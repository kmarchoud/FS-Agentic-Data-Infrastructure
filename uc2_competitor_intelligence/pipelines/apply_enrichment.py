#!/usr/bin/env python3
"""
Apply Trustnet enrichment results to competitor_funds.json. Only merges
fields that are demonstrably reliable from the Trustnet HTML extraction:
ISIN, fund_size_gbp_m, benchmark. Performance numbers are excluded
because the model was extracting sector-average widgets rather than
fund-specific values (multiple unrelated funds returned identical 1yr/3yr
figures). Risk_rating is also excluded — Trustnet's 0-100 risk score is
not the same as SRRI 1-7.
"""

import json
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CF_DIR = BASE / "data" / "competitor_funds"
SOURCE = CF_DIR / "competitor_funds.json"
ENRICHMENT = CF_DIR / "partials" / "enrichment_results.json"

# Map enrichment fund_name_match -> exact fund_name in source.
# Keys are the names used in enrichment_results.json; values are
# the exact fund_name strings in competitor_funds.json.
NAME_MAP = {
    "Vanguard LifeStrategy 60% Equity Fund A Acc": "Vanguard LifeStrategy 60% Equity Fund A Acc",
    "Jupiter Merlin Income Portfolio I Acc": "Jupiter Merlin Income Portfolio I Acc",
    "HSBC Global Strategy Cautious Portfolio C Acc": "HSBC Global Strategy Cautious Portfolio C Acc",
    "Vanguard LifeStrategy 40% Equity Fund A Acc": "Vanguard LifeStrategy 40% Equity Fund A Acc",
    "Rathbone Strategic Growth Portfolio S Acc": "Rathbone Strategic Growth Portfolio S Acc",
    "Vanguard LifeStrategy 80% Equity Fund A Acc": "Vanguard LifeStrategy 80% Equity Fund A Acc",
    "HSBC Global Strategy Balanced Portfolio C Acc": "HSBC Global Strategy Balanced Portfolio C Acc",
    "HSBC Global Strategy Balanced Portfolio": "HSBC Global Strategy Balanced Portfolio",
    "Fidelity European Fund": "Fidelity European Fund",
    "Baillie Gifford American Fund B Accumulation": "Baillie Gifford American Fund B Accumulation",
    "HSBC FTSE All-World Index Fund C Accumulation": "HSBC FTSE All-World Index Fund C Accumulation",
    "Baillie Gifford Global Alpha Growth Fund B Accumulation": "Baillie Gifford Global Alpha Growth Fund B Accumulation",
    "Royal London Corporate Bond Fund M Accumulation": "Royal London Corporate Bond Fund M Accumulation",
    "Invesco Corporate Bond Fund (UK) Z Accumulation": "Invesco Corporate Bond Fund (UK) Z Accumulation",
    "Artemis Corporate Bond Fund I Accumulation GBP": "Artemis Corporate Bond Fund I Accumulation GBP",
    "Royal London Global Bond Opportunities Fund Z Income": "Royal London Global Bond Opportunities Fund Z Income",
}


def main():
    with open(SOURCE) as f:
        funds = json.load(f)
    with open(ENRICHMENT) as f:
        enrichments = json.load(f)

    # Index by fund_name (multiple sector rows can share a name)
    by_name = {}
    for f in funds:
        by_name.setdefault(f["fund_name"], []).append(f)

    updated_count = 0
    for enr in enrichments:
        match_key = enr["fund_name_match"]
        target_name = NAME_MAP.get(match_key)
        if not target_name or target_name not in by_name:
            print(f"  SKIP: no match for {match_key}")
            continue

        for fund in by_name[target_name]:
            changed = False
            # Always overwrite ISIN/AUM if enrichment has a value
            if enr.get("isin") and not fund.get("isin"):
                fund["isin"] = enr["isin"]
                changed = True
            if enr.get("isin") and fund.get("isin") and fund["isin"] != enr["isin"]:
                # Trustnet ISIN takes priority — it's authoritative
                fund["isin"] = enr["isin"]
                changed = True
            if enr.get("fund_size_gbp_m") is not None:
                old = fund.get("fund_size_gbp_m")
                fund["fund_size_gbp_m"] = enr["fund_size_gbp_m"]
                if not fund.get("fund_size_date"):
                    fund["fund_size_date"] = "2026-04-10"
                if old != enr["fund_size_gbp_m"]:
                    changed = True
            if enr.get("benchmark") and not fund.get("benchmark"):
                fund["benchmark"] = enr["benchmark"]
                changed = True
            if changed:
                updated_count += 1
                if not fund.get("source_url") or "trustnet.com" not in fund.get("source_url", ""):
                    pass  # keep original source url

    with open(SOURCE, "w") as f:
        json.dump(funds, f, indent=2, ensure_ascii=False)

    print(f"Updated {updated_count} fund records with Trustnet enrichment")
    print(f"Wrote {SOURCE}")


if __name__ == "__main__":
    main()
