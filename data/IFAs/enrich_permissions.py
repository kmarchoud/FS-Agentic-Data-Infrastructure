#!/usr/bin/env python3
"""
Bulk FCA Permissions Enrichment
Calls Permissions + Individuals endpoints for all firms with FRNs but no permissions data.

Usage:
  caffeinate -i python3 enrich_permissions.py
"""

import json
import subprocess
import time
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ENRICHED_DIR = BASE_DIR / "enriched"
RAW_DIR = BASE_DIR / "raw"
LOG_DIR = BASE_DIR / "logs"

UNIVERSE_FILE = ENRICHED_DIR / "ifa_merged_universe.jsonl"
CHECKPOINT_FILE = RAW_DIR / "permissions.checkpoint"
LOG_FILE = LOG_DIR / "permissions.log"

FCA_EMAIL = "karim.marchoud@regulex.io"
FCA_KEY = "e6acc1c947a4586da5ca619d45c03f96"


def log(msg):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"{ts} {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def fca_call(endpoint):
    url = f"https://register.fca.org.uk/services/V0.1/{endpoint}"
    try:
        result = subprocess.run(
            ["curl", "-s", "-X", "GET", url,
             "-H", f"x-auth-email: {FCA_EMAIL}",
             "-H", f"x-auth-key: {FCA_KEY}",
             "-H", "Content-Type: application/json"],
            capture_output=True, text=True, timeout=30,
        )
        if result.returncode == 0 and result.stdout.strip():
            return json.loads(result.stdout)
    except Exception:
        pass
    return None


def load_checkpoint():
    done = set()
    if CHECKPOINT_FILE.exists():
        with open(CHECKPOINT_FILE) as f:
            for line in f:
                line = line.strip()
                if line:
                    done.add(line)
    return done


def save_checkpoint_frn(frn):
    with open(CHECKPOINT_FILE, "a") as f:
        f.write(frn + "\n")


def parse_permissions(data):
    if not data or not isinstance(data, dict):
        return None

    perms_dict = data.get("Data", {})
    if not isinstance(perms_dict, dict):
        return None

    activities = list(perms_dict.keys())
    all_cust_types = set()
    all_inv_types = set()

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
    inv_lower = " ".join(all_inv_types).lower()

    return {
        "advises_on_investments": "advising on investments" in activities_lower,
        "arranges_investments": "arranging" in activities_lower,
        "manages_investments": "managing investments" in activities_lower,
        "pension_transfers": "pension transfer" in activities_lower,
        "collective_investment_schemes": (
            "collective investment" in activities_lower or
            "unit" in inv_lower
        ),
        "life_policies": "life polic" in (activities_lower + " " + inv_lower),
        "retail_clients": "retail" in types_lower,
        "professional_clients": "professional" in types_lower,
        "activities": activities[:25],
        "investment_types": sorted(all_inv_types)[:25],
        "customer_types": sorted(all_cust_types)[:10],
    }


def main():
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    RAW_DIR.mkdir(parents=True, exist_ok=True)

    log("=" * 60)
    log("Bulk FCA Permissions Enrichment")
    log("=" * 60)

    # Load universe
    firms = [json.loads(l) for l in open(UNIVERSE_FILE)]
    log(f"Universe: {len(firms)} firms")

    # Find firms needing permissions
    already_have = 0
    no_frn = 0
    to_process = []

    for firm in firms:
        frn = firm.get("frn")
        if not frn:
            no_frn += 1
            continue
        if firm.get("permissions") and isinstance(firm["permissions"], dict) and firm["permissions"].get("advises_on_investments") is not None:
            already_have += 1
            continue
        # Check raw permissions string from ground truth
        if firm.get("fca_permissions_raw") and firm.get("has_permissions"):
            already_have += 1
            continue
        to_process.append(firm)

    log(f"Already have permissions: {already_have}")
    log(f"No FRN: {no_frn}")
    log(f"Need permissions: {len(to_process)}")

    # Load checkpoint
    done = load_checkpoint()
    to_process = [f for f in to_process if f["frn"] not in done]
    log(f"After checkpoint skip: {len(to_process)} remaining")

    # Process
    count = 0
    errors = 0
    permissions_results = {}  # frn -> permissions dict

    for firm in to_process:
        frn = firm["frn"]
        name = firm.get("firm_name", "?")

        # Permissions
        time.sleep(1)
        perm_data = fca_call(f"Firm/{frn}/Permissions")
        perms = parse_permissions(perm_data)

        # Individuals
        time.sleep(1)
        indiv_data = fca_call(f"Firm/{frn}/Individuals")
        indiv_count = 0
        if indiv_data and isinstance(indiv_data, dict):
            ri = indiv_data.get("ResultInfo")
            if ri and isinstance(ri, dict):
                try:
                    indiv_count = int(ri.get("total_count", 0))
                except (ValueError, TypeError):
                    indiv_count = 0

        if perms:
            permissions_results[frn] = {
                "permissions": perms,
                "individual_count": indiv_count,
            }
        else:
            errors += 1

        save_checkpoint_frn(frn)
        count += 1

        if count % 50 == 0:
            log(f"  Progress: {count}/{len(to_process)} ({len(permissions_results)} with perms, {errors} errors)")

        if count % 200 == 0:
            log(f"  Checkpoint: {count} processed")

    log(f"\nAPI calls complete: {count} processed, {len(permissions_results)} with permissions, {errors} errors")

    # Update universe file
    log("Updating universe file...")
    firms = [json.loads(l) for l in open(UNIVERSE_FILE)]

    updated = 0
    for firm in firms:
        frn = firm.get("frn")
        if frn and frn in permissions_results:
            result = permissions_results[frn]
            firm["permissions"] = result["permissions"]
            firm["individual_count"] = result["individual_count"]
            updated += 1

    # Count totals
    total_with_perms = 0
    core_ifa = 0
    for firm in firms:
        perms = firm.get("permissions")
        if isinstance(perms, dict) and perms.get("advises_on_investments") is not None:
            total_with_perms += 1
            if (perms.get("advises_on_investments") and
                perms.get("retail_clients") and
                perms.get("collective_investment_schemes")):
                core_ifa += 1
        elif firm.get("has_permissions") and firm.get("fca_permissions_raw"):
            total_with_perms += 1
            raw = (firm.get("fca_permissions_raw") or "").lower()
            if "advising on investments" in raw and "retail" in raw:
                core_ifa += 1

    # Write updated universe
    with open(UNIVERSE_FILE, "w") as f:
        for firm in firms:
            f.write(json.dumps(firm, ensure_ascii=False, default=str) + "\n")

    log(f"\n{'='*60}")
    log(f"RESULTS")
    log(f"{'='*60}")
    log(f"Firms with permissions before: {already_have}")
    log(f"Firms with permissions after:  {already_have + updated}")
    log(f"New permissions added:         {updated}")
    log(f"Total with permissions data:   {total_with_perms}")
    log(f"Core IFA (advise + retail + CIS): {core_ifa}")
    log(f"Failing core test:             {total_with_perms - core_ifa}")
    log(f"Individual counts collected:    {sum(1 for r in permissions_results.values() if r['individual_count'] > 0)}")
    log(f"\nDONE")


if __name__ == "__main__":
    main()
