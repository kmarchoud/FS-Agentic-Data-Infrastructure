#!/usr/bin/env python3
"""
FCA Enrichment Pipeline for VouchedFor IFA firms.

Phase 1: Scrape FCA numbers from VouchedFor profile pages (1 per firm)
Phase 2: Enrich via FCA API using discovered FRNs

Usage:
  python3 enrich_fca.py --phase 1 --test     # Scrape 10 profiles
  python3 enrich_fca.py --phase 1 --full     # Scrape all profiles
  python3 enrich_fca.py --phase 2 --full     # FCA API enrichment
  caffeinate -i python3 enrich_fca.py --all  # Both phases
"""

import json
import re
import subprocess
import sys
import time
import argparse
from datetime import datetime
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent
RAW_DIR = BASE_DIR / "raw"
ENRICHED_DIR = BASE_DIR / "enriched"
LOG_DIR = BASE_DIR / "logs"

FCA_API_EMAIL = "karim.marchoud@regulex.io"
FCA_API_KEY = "e6acc1c947a4586da5ca619d45c03f96"

LOG_FILE = LOG_DIR / "enrich_fca.log"
FCA_LOOKUP_FILE = RAW_DIR / "vouchedfor_fca_lookup.jsonl"
ENRICHED_FILE = ENRICHED_DIR / "ifa_enriched.jsonl"
ENRICHED_CSV = ENRICHED_DIR / "ifa_enriched.csv"


def log(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"{timestamp} {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def fetch_url(url, timeout=15):
    try:
        result = subprocess.run(
            ["curl", "-s", "-L", "--max-time", str(timeout),
             "-H", "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
             url],
            capture_output=True, text=True, timeout=timeout + 5,
        )
        if result.returncode == 0:
            return result.stdout
    except Exception:
        pass
    return None


def fca_api_call(endpoint):
    url = f"https://register.fca.org.uk/services/V0.1/{endpoint}"
    try:
        result = subprocess.run(
            ["curl", "-s", "-X", "GET", url,
             "-H", f"x-auth-email: {FCA_API_EMAIL}",
             "-H", f"x-auth-key: {FCA_API_KEY}",
             "-H", "Content-Type: application/json"],
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode == 0 and result.stdout.strip():
            return json.loads(result.stdout)
    except Exception:
        pass
    return None


# ── Phase 1: Scrape FCA numbers from VouchedFor profiles ──────────────────

def phase1_scrape_fca_numbers(limit=None):
    """Visit one VouchedFor profile per firm to extract the FCA number."""
    log("Phase 1: Scraping FCA numbers from VouchedFor profiles...")

    # Load firms and pick one adviser per firm
    advisers = [json.loads(l) for l in open(RAW_DIR / "vouchedfor_api_advisers.jsonl")]

    # Group by firm, pick first adviser per firm
    firm_profiles = {}
    for adv in advisers:
        fn = adv.get("firm_name", "").strip()
        if fn and fn not in firm_profiles:
            firm_profiles[fn] = adv

    log(f"  {len(firm_profiles)} unique firms to scrape")

    # Load existing lookups
    existing = {}
    if FCA_LOOKUP_FILE.exists():
        for line in open(FCA_LOOKUP_FILE):
            rec = json.loads(line)
            existing[rec.get("firm_name", "")] = rec

    count = 0
    found = 0

    for firm_name, adv in firm_profiles.items():
        if firm_name in existing:
            continue

        if limit and count >= limit:
            break

        url = adv.get("profile_url", "")
        if not url:
            continue

        time.sleep(2)  # Rate limit
        html = fetch_url(url)

        record = {
            "firm_name": firm_name,
            "firm_id": adv.get("firm_id"),
            "profile_url": url,
            "fca_number": None,
            "postcode": None,
            "scraped_at": datetime.now().strftime("%Y-%m-%d"),
        }

        if html:
            # Extract FCA number — look for 5-7 digit number near "FCA" or "FRN"
            fca_patterns = [
                re.compile(r'(?:FCA|FRN|Financial Conduct Authority)[^\d]{0,30}(\d{5,7})', re.I),
                re.compile(r'(\d{6})\s*(?:is|was)\s*(?:authorised|regulated)', re.I),
                re.compile(r'register\.fca\.org\.uk[^\d]*(\d{5,7})', re.I),
            ]
            for pattern in fca_patterns:
                m = pattern.search(html)
                if m:
                    fca_num = m.group(1)
                    # Validate: FCA numbers are typically 6 digits
                    if 100000 <= int(fca_num) <= 999999:
                        record["fca_number"] = fca_num
                        found += 1
                        break

            # Extract postcode
            pc_match = re.search(r'([A-Z]{1,2}\d[A-Z\d]?\s+\d[A-Z]{2})', html)
            if pc_match:
                record["postcode"] = pc_match.group(1)

        with open(FCA_LOOKUP_FILE, "a") as f:
            f.write(json.dumps(record) + "\n")

        count += 1
        if count % 50 == 0:
            log(f"  Scraped {count} profiles, {found} FCA numbers found")

    log(f"Phase 1 complete: {count} profiles scraped, {found} FCA numbers found")
    return count, found


# ── Phase 2: FCA API Enrichment ───────────────────────────────────────────

def phase2_fca_enrichment(limit=None):
    """Enrich firms with FCA API data using discovered FRNs."""
    log("Phase 2: FCA API enrichment...")

    # Load FCA lookups
    lookups = {}
    if FCA_LOOKUP_FILE.exists():
        for line in open(FCA_LOOKUP_FILE):
            rec = json.loads(line)
            if rec.get("fca_number"):
                lookups[rec["firm_name"]] = rec

    # Load firm data
    firms = [json.loads(l) for l in open(RAW_DIR / "vouchedfor_api_firms.jsonl")]

    log(f"  {len(firms)} firms, {len(lookups)} with FCA numbers")

    # Load existing enriched
    existing_frns = set()
    if ENRICHED_FILE.exists():
        for line in open(ENRICHED_FILE):
            rec = json.loads(line)
            existing_frns.add(rec.get("frn", ""))

    ENRICHED_DIR.mkdir(parents=True, exist_ok=True)
    count = 0

    for firm in firms:
        fn = firm.get("firm_name", "")
        lookup = lookups.get(fn, {})
        frn = lookup.get("fca_number")

        if not frn or frn in existing_frns:
            # Still write the firm without FCA data
            if frn not in existing_frns:
                record = {
                    "frn": frn,
                    "firm_name": fn,
                    "firm_id_vouchedfor": firm.get("firm_id"),
                    "adviser_count": firm.get("adviser_count", 0),
                    "total_reviews": firm.get("total_reviews", 0),
                    "top_rated_advisers": firm.get("top_rated_advisers", 0),
                    "phone": firm.get("phone"),
                    "postcode": lookup.get("postcode"),
                    "cities": firm.get("cities", []),
                    "adviser_types": firm.get("adviser_types", []),
                    "advisers": firm.get("advisers", [])[:20],
                    "source": "vouchedfor",
                    "fca_enriched": False,
                }
                with open(ENRICHED_FILE, "a") as f:
                    f.write(json.dumps(record, ensure_ascii=False) + "\n")
            continue

        if limit and count >= limit:
            break

        log(f"  Enriching {fn} (FRN {frn})...")
        time.sleep(1)

        record = {
            "frn": frn,
            "firm_name": fn,
            "firm_id_vouchedfor": firm.get("firm_id"),
            "adviser_count": firm.get("adviser_count", 0),
            "total_reviews": firm.get("total_reviews", 0),
            "top_rated_advisers": firm.get("top_rated_advisers", 0),
            "phone": firm.get("phone"),
            "postcode": lookup.get("postcode"),
            "cities": firm.get("cities", []),
            "adviser_types": firm.get("adviser_types", []),
            "advisers": firm.get("advisers", [])[:20],
            "source": "vouchedfor",
            "fca_enriched": True,
        }

        # Firm details
        data = fca_api_call(f"Firm/{frn}")
        if data and isinstance(data, dict):
            fd = data.get("Data", [])
            if isinstance(fd, list) and fd:
                fd = fd[0]
                record["fca_name"] = fd.get("Organisation Name", "")
                record["fca_status"] = fd.get("Status", "")
                record["business_type"] = fd.get("Business Type", "")
                record["companies_house"] = fd.get("Companies House Number", "")
        time.sleep(1)

        # Permissions
        data = fca_api_call(f"Firm/{frn}/Permissions")
        if data and isinstance(data, dict):
            perms_dict = data.get("Data", {})
            if isinstance(perms_dict, dict):
                activities = list(perms_dict.keys())
                all_inv_types = set()
                all_cust_types = set()
                for act_data in perms_dict.values():
                    if isinstance(act_data, list):
                        for item in act_data:
                            if isinstance(item, dict):
                                for ct in item.get("Customer Type", []):
                                    all_cust_types.add(ct)
                                for it in item.get("Investment Type", []):
                                    all_inv_types.add(it)

                activities_lower = " ".join(activities).lower()
                types_lower = " ".join(all_cust_types).lower()

                record["permissions"] = {
                    "advises_on_investments": "advising on investments" in activities_lower,
                    "arranges_investments": "arranging" in activities_lower,
                    "manages_investments": "managing investments" in activities_lower,
                    "pension_transfers": "pension transfer" in activities_lower,
                    "retail_clients": "retail" in types_lower,
                    "professional_clients": "professional" in types_lower,
                    "activities": activities[:20],
                    "investment_types": sorted(all_inv_types)[:20],
                }
        time.sleep(1)

        # Address
        data = fca_api_call(f"Firm/{frn}/Address")
        if data and isinstance(data, dict):
            addrs = data.get("Data", [])
            if isinstance(addrs, list) and addrs:
                addr = addrs[0]
                for a in addrs:
                    if isinstance(a, dict) and a.get("Address Type") == "Principal Place of Business":
                        addr = a
                        break
                if isinstance(addr, dict):
                    record["address"] = {
                        "line1": addr.get("Address Line 1", ""),
                        "line2": addr.get("Address Line 2", ""),
                        "town": addr.get("Town", ""),
                        "county": addr.get("County", ""),
                        "postcode": addr.get("Postcode", ""),
                        "country": addr.get("Country", ""),
                    }
                    record["phone"] = addr.get("Phone Number", "") or record.get("phone")
                    record["website"] = addr.get("Website Address", "")
        time.sleep(1)

        # Individuals count
        data = fca_api_call(f"Firm/{frn}/Individuals")
        if data and isinstance(data, dict):
            ri = data.get("ResultInfo")
            record["individual_count"] = int(ri.get("total_count", 0)) if ri else 0

        with open(ENRICHED_FILE, "a") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")

        existing_frns.add(frn)
        count += 1

        if count % 20 == 0:
            log(f"  Checkpoint: {count} firms enriched via FCA API")

    log(f"Phase 2 complete: {count} firms enriched via FCA API")
    return count


def main():
    parser = argparse.ArgumentParser(description="FCA Enrichment")
    parser.add_argument("--phase", type=int, choices=[1, 2], help="Run specific phase")
    parser.add_argument("--all", action="store_true", help="Run both phases")
    parser.add_argument("--test", action="store_true", help="Small test batch")
    parser.add_argument("--full", action="store_true", help="Full run")
    args = parser.parse_args()

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    ENRICHED_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    limit = 10 if args.test else None

    if args.phase == 1 or args.all:
        phase1_scrape_fca_numbers(limit=limit)

    if args.phase == 2 or args.all:
        phase2_fca_enrichment(limit=limit)


if __name__ == "__main__":
    main()
