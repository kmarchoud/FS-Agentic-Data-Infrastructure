#!/usr/bin/env python3
"""
FCA Name Matching — 3 approaches to match VouchedFor firms to FCA register.

Uses the v1 FCA-enriched dataset (3,828 firms with phones, postcodes, names)
as the matching corpus.

Usage:
  python3 match_fca.py                    # Run all 3 approaches
  caffeinate -i python3 match_fca.py      # With keep-awake
"""

import json
import re
import subprocess
import time
from datetime import datetime
from pathlib import Path
from difflib import SequenceMatcher

BASE_DIR = Path(__file__).resolve().parent
RAW_DIR = BASE_DIR / "raw"
ENRICHED_DIR = BASE_DIR / "enriched"
LOG_DIR = BASE_DIR / "logs"

# v1 enriched data (3,828 firms with phones/postcodes/names)
V1_ENRICHED = BASE_DIR.parent / "enriched" / "fca_enriched.jsonl"
# Fallback: check parent dirs
if not V1_ENRICHED.exists():
    V1_ENRICHED = Path("/Users/karimmarchoud/Desktop/AI/FSInfra/Keyridge/Data/IFAs/enriched/fca_enriched.jsonl")

# VouchedFor firms
VF_FIRMS = RAW_DIR / "vouchedfor_api_firms.jsonl"
VF_ADVISERS = RAW_DIR / "vouchedfor_api_advisers.jsonl"

# Existing FCA lookup (285 already matched)
EXISTING_LOOKUP = RAW_DIR / "vouchedfor_fca_lookup.jsonl"

# Output
NEW_MATCHES_FILE = RAW_DIR / "fca_matches_v2.jsonl"
LOG_FILE = LOG_DIR / "match_fca.log"

FCA_API_EMAIL = "karim.marchoud@regulex.io"
FCA_API_KEY = "e6acc1c947a4586da5ca619d45c03f96"


def log(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"{timestamp} {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def normalise_phone(phone):
    """Normalise phone to 10-11 digits for matching."""
    if not phone:
        return None
    # Strip everything except digits
    digits = re.sub(r'\D', '', str(phone))
    # Remove +44 prefix
    if digits.startswith('44') and len(digits) > 10:
        digits = '0' + digits[2:]
    # Remove leading 0 duplicates
    if digits.startswith('00'):
        digits = digits[1:]
    # Should be 10-11 digits
    if 10 <= len(digits) <= 11:
        return digits
    return None


def normalise_name(name):
    """Normalise firm name for comparison."""
    if not name:
        return ""
    n = name.lower().strip()
    # Remove common suffixes
    for suffix in [' limited', ' ltd', ' llp', ' plc', ' lp',
                   ' inc', ' corp', ' group', ' holdings',
                   ' financial planning', ' wealth management',
                   ' financial services', ' financial advisers',
                   ' financial advice', ' financial solutions',
                   ' wealth', ' advisory']:
        n = n.replace(suffix, '')
    # Remove punctuation
    n = re.sub(r'[^\w\s]', '', n)
    return n.strip()


def first_word(name):
    """Extract first meaningful word from firm name."""
    if not name:
        return ""
    n = name.lower().strip()
    # Skip common prefixes
    for prefix in ['the ', 'st ', 'st. ']:
        if n.startswith(prefix):
            n = n[len(prefix):]
    words = n.split()
    return words[0] if words else ""


def similarity(a, b):
    """String similarity ratio 0-1."""
    if not a or not b:
        return 0.0
    return SequenceMatcher(None, a.lower(), b.lower()).ratio()


def fca_api_call(endpoint):
    """Call FCA API."""
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


def main():
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    ENRICHED_DIR.mkdir(parents=True, exist_ok=True)

    log("=" * 60)
    log("FCA Name Matching — 3 Approaches")
    log("=" * 60)

    # Load VouchedFor firms
    vf_firms = [json.loads(l) for l in open(VF_FIRMS)]
    log(f"VouchedFor firms: {len(vf_firms)}")

    # Load VouchedFor advisers (for phone numbers per firm)
    vf_advisers = [json.loads(l) for l in open(VF_ADVISERS)]
    # Build phone lookup by firm name
    vf_phones = {}
    for adv in vf_advisers:
        fn = adv.get("firm_name", "").strip()
        phone = normalise_phone(adv.get("phone"))
        if fn and phone and fn not in vf_phones:
            vf_phones[fn] = phone

    # Load existing matches (285 already matched)
    already_matched = {}
    if EXISTING_LOOKUP.exists():
        for line in open(EXISTING_LOOKUP):
            rec = json.loads(line)
            if rec.get("fca_number"):
                already_matched[rec["firm_name"]] = rec["fca_number"]
    log(f"Already matched: {len(already_matched)}")

    # Load v1 FCA enriched data as matching corpus
    fca_corpus = []
    if V1_ENRICHED.exists():
        fca_corpus = [json.loads(l) for l in open(V1_ENRICHED) if l.strip()]
    log(f"FCA corpus (v1 enriched): {len(fca_corpus)}")

    # Build FCA lookup indexes
    fca_by_phone = {}
    fca_by_postcode = {}  # postcode -> list of firms
    fca_by_name_norm = {}

    for fc in fca_corpus:
        frn = fc.get("frn", "")
        name = fc.get("firm_name", "") or fc.get("fca_firm", {}).get("name", "")
        phone = normalise_phone(fc.get("phone"))
        postcode = (fc.get("address", {}).get("postcode", "") or "").strip().upper()
        website = fc.get("website", "") or ""

        if phone:
            fca_by_phone[phone] = {"frn": frn, "name": name, "postcode": postcode}

        if postcode:
            if postcode not in fca_by_postcode:
                fca_by_postcode[postcode] = []
            fca_by_postcode[postcode].append({"frn": frn, "name": name})

        norm = normalise_name(name)
        if norm:
            fca_by_name_norm[norm] = {"frn": frn, "name": name}

    log(f"FCA phone index: {len(fca_by_phone)}")
    log(f"FCA postcode index: {len(fca_by_postcode)} postcodes")
    log(f"FCA name index: {len(fca_by_name_norm)}")

    # Firms to match
    unmatched = [f for f in vf_firms if f.get("firm_name", "") not in already_matched]
    log(f"Unmatched firms to process: {len(unmatched)}")

    # Results
    new_matches = {}
    approach_counts = {"phone": 0, "postcode_name": 0, "fuzzy_name": 0}

    # ── APPROACH 1: Phone number matching ────────────────────────────
    log("\n--- Approach 1: Phone Number Matching ---")

    for firm in unmatched:
        fn = firm.get("firm_name", "")
        if fn in new_matches:
            continue

        phone = normalise_phone(firm.get("phone"))
        if not phone:
            # Try from advisers
            phone = vf_phones.get(fn)

        if phone and phone in fca_by_phone:
            match = fca_by_phone[phone]
            new_matches[fn] = {
                "firm_name": fn,
                "fca_number": match["frn"],
                "fca_name": match["name"],
                "match_method": "phone",
                "match_confidence": 0.95,
            }
            approach_counts["phone"] += 1

    log(f"Phone matches: {approach_counts['phone']}")

    # ── APPROACH 2: Postcode + partial name matching ─────────────────
    log("\n--- Approach 2: Postcode + First Word Name Matching ---")

    # Load postcodes from FCA lookup (scraped from VouchedFor profiles)
    vf_postcodes = {}
    if EXISTING_LOOKUP.exists():
        for line in open(EXISTING_LOOKUP):
            rec = json.loads(line)
            pc = (rec.get("postcode") or "").strip().upper()
            if pc:
                vf_postcodes[rec["firm_name"]] = pc

    for firm in unmatched:
        fn = firm.get("firm_name", "")
        if fn in new_matches:
            continue

        postcode = vf_postcodes.get(fn, "").strip().upper()
        if not postcode:
            continue

        fw = first_word(fn)
        if not fw or len(fw) < 3:
            continue

        # Check all FCA firms at this postcode
        candidates = fca_by_postcode.get(postcode, [])
        for cand in candidates:
            cand_name = cand["name"].lower()
            if fw in cand_name:
                new_matches[fn] = {
                    "firm_name": fn,
                    "fca_number": cand["frn"],
                    "fca_name": cand["name"],
                    "match_method": "postcode_name",
                    "match_confidence": 0.80,
                }
                approach_counts["postcode_name"] += 1
                break

    log(f"Postcode+name matches: {approach_counts['postcode_name']}")

    # ── APPROACH 3: Fuzzy name matching ──────────────────────────────
    log("\n--- Approach 3: Fuzzy Name Matching ---")

    fca_norm_keys = list(fca_by_name_norm.keys())

    for firm in unmatched:
        fn = firm.get("firm_name", "")
        if fn in new_matches:
            continue

        vf_norm = normalise_name(fn)
        if not vf_norm or len(vf_norm) < 3:
            continue

        # Direct normalised match first
        if vf_norm in fca_by_name_norm:
            match = fca_by_name_norm[vf_norm]
            new_matches[fn] = {
                "firm_name": fn,
                "fca_number": match["frn"],
                "fca_name": match["name"],
                "match_method": "fuzzy_name",
                "match_confidence": 0.90,
            }
            approach_counts["fuzzy_name"] += 1
            continue

        # Fuzzy match (only check if first 3 chars match for speed)
        best_score = 0
        best_match = None
        prefix = vf_norm[:3]

        for fca_norm in fca_norm_keys:
            if not fca_norm.startswith(prefix):
                continue
            score = similarity(vf_norm, fca_norm)
            if score > best_score and score >= 0.85:
                best_score = score
                best_match = fca_by_name_norm[fca_norm]

        if best_match:
            new_matches[fn] = {
                "firm_name": fn,
                "fca_number": best_match["frn"],
                "fca_name": best_match["name"],
                "match_method": "fuzzy_name",
                "match_confidence": round(best_score, 2),
            }
            approach_counts["fuzzy_name"] += 1

    log(f"Fuzzy name matches: {approach_counts['fuzzy_name']}")

    # ── Write results ────────────────────────────────────────────────
    log(f"\n--- Results ---")
    log(f"New matches total: {len(new_matches)}")
    log(f"  Phone: {approach_counts['phone']}")
    log(f"  Postcode+name: {approach_counts['postcode_name']}")
    log(f"  Fuzzy name: {approach_counts['fuzzy_name']}")
    log(f"Previously matched: {len(already_matched)}")
    log(f"Total matched: {len(already_matched) + len(new_matches)}")
    log(f"Still unmatched: {len(unmatched) - len(new_matches)}")

    # Write new matches
    with open(NEW_MATCHES_FILE, "w") as f:
        for match in new_matches.values():
            f.write(json.dumps(match) + "\n")

    # Merge into existing lookup
    all_matches = dict(already_matched)
    for fn, match in new_matches.items():
        all_matches[fn] = match["fca_number"]

    # Update the lookup file
    updated_lookup = []
    if EXISTING_LOOKUP.exists():
        for line in open(EXISTING_LOOKUP):
            rec = json.loads(line)
            fn = rec.get("firm_name", "")
            if fn in new_matches and not rec.get("fca_number"):
                rec["fca_number"] = new_matches[fn]["fca_number"]
                rec["match_method"] = new_matches[fn]["match_method"]
                rec["match_confidence"] = new_matches[fn]["match_confidence"]
                rec["fca_name"] = new_matches[fn]["fca_name"]
            updated_lookup.append(rec)

    # Add firms that weren't in the lookup at all
    existing_firms = {r["firm_name"] for r in updated_lookup}
    for fn, match in new_matches.items():
        if fn not in existing_firms:
            updated_lookup.append({
                "firm_name": fn,
                "fca_number": match["fca_number"],
                "fca_name": match["fca_name"],
                "match_method": match["match_method"],
                "match_confidence": match["match_confidence"],
                "postcode": None,
                "scraped_at": datetime.now().strftime("%Y-%m-%d"),
            })

    with open(EXISTING_LOOKUP, "w") as f:
        for rec in updated_lookup:
            f.write(json.dumps(rec) + "\n")

    log(f"Updated lookup file: {len(updated_lookup)} records")

    # ── FCA API enrichment for new matches ───────────────────────────
    log(f"\n--- FCA API Enrichment for {len(new_matches)} new matches ---")

    # Reload enriched file to know what's already enriched
    enriched_frns = set()
    if (ENRICHED_DIR / "ifa_enriched.jsonl").exists():
        for line in open(ENRICHED_DIR / "ifa_enriched.jsonl"):
            rec = json.loads(line)
            if rec.get("fca_enriched") and rec.get("frn"):
                enriched_frns.add(rec["frn"])

    # FRNs to enrich (new matches + previously matched but not enriched)
    to_enrich = {}
    for fn, frn in all_matches.items():
        if frn and frn not in enriched_frns:
            to_enrich[fn] = frn

    log(f"FRNs to enrich: {len(to_enrich)}")

    # Load VouchedFor firm data for merging
    vf_firms_by_name = {f["firm_name"]: f for f in vf_firms}

    enriched_count = 0
    for fn, frn in to_enrich.items():
        vf = vf_firms_by_name.get(fn, {})
        log(f"  Enriching {fn} (FRN {frn})...")

        record = {
            "frn": frn,
            "firm_name": fn,
            "firm_id_vouchedfor": vf.get("firm_id"),
            "adviser_count": vf.get("adviser_count", 0),
            "total_reviews": vf.get("total_reviews", 0),
            "top_rated_advisers": vf.get("top_rated_advisers", 0),
            "phone": vf.get("phone"),
            "cities": vf.get("cities", []),
            "adviser_types": vf.get("adviser_types", []),
            "advisers": vf.get("advisers", [])[:20],
            "source": "vouchedfor",
            "fca_enriched": True,
        }

        # Firm details
        time.sleep(1)
        data = fca_api_call(f"Firm/{frn}")
        if data and isinstance(data, dict):
            fd = data.get("Data", [])
            if isinstance(fd, list) and fd:
                fd = fd[0]
                record["fca_name"] = fd.get("Organisation Name", "")
                record["fca_status"] = fd.get("Status", "")
                record["business_type"] = fd.get("Business Type", "")
                record["companies_house"] = fd.get("Companies House Number", "")

        # Permissions
        time.sleep(1)
        data = fca_api_call(f"Firm/{frn}/Permissions")
        if data and isinstance(data, dict):
            perms_dict = data.get("Data", {})
            if isinstance(perms_dict, dict):
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

        # Address
        time.sleep(1)
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

        # Individuals
        time.sleep(1)
        data = fca_api_call(f"Firm/{frn}/Individuals")
        if data and isinstance(data, dict):
            ri = data.get("ResultInfo")
            record["individual_count"] = int(ri.get("total_count", 0)) if ri else 0

        # Append to enriched file
        with open(ENRICHED_DIR / "ifa_enriched.jsonl", "a") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")

        enriched_frns.add(frn)
        enriched_count += 1

        if enriched_count % 20 == 0:
            log(f"  Checkpoint: {enriched_count} enriched")

    log(f"\nEnrichment complete: {enriched_count} new firms enriched")
    log(f"Total FCA enriched: {len(enriched_frns)}")

    # ── Rebuild enriched file (deduplicate) ──────────────────────────
    log("\nRebuilding enriched file (deduplicating)...")

    all_records = [json.loads(l) for l in open(ENRICHED_DIR / "ifa_enriched.jsonl") if l.strip()]

    # Keep latest record per firm name
    by_name = {}
    for rec in all_records:
        fn = rec.get("firm_name", "")
        existing = by_name.get(fn)
        # Prefer FCA-enriched over non-enriched
        if not existing or (rec.get("fca_enriched") and not existing.get("fca_enriched")):
            by_name[fn] = rec

    with open(ENRICHED_DIR / "ifa_enriched.jsonl", "w") as f:
        for rec in by_name.values():
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")

    total_enriched = sum(1 for r in by_name.values() if r.get("fca_enriched"))
    log(f"Deduplicated: {len(by_name)} unique firms, {total_enriched} FCA enriched")

    log("\nDONE. Run score_ifas.py to rescore.")


if __name__ == "__main__":
    main()
