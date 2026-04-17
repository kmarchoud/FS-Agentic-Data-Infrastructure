#!/usr/bin/env python3
"""
Generate TypeScript data file from real IFA ranked CSV + briefs JSON.
Outputs src/lib/data/ifa-real-data.ts matching the IFARanking interface.

Usage: python3 src/lib/data/generate-ifa-data.py
"""

import csv
import json
from pathlib import Path

RAW_DIR = Path(__file__).parent / "raw"
OUTPUT = Path(__file__).parent / "ifa-real-data.ts"

MANDATE_MAP = {
    "multi_asset_cautious": "cautious_multi_asset",
    "multi_asset_balanced": "balanced_multi_asset",
    "multi_asset_growth": "growth_multi_asset",
    "multi_asset_income": "monthly_income",
    "multi_asset_aggressive": "aggressive_multi_asset",
    "multi_asset_aggressive_plus": "aggressive_multi_asset",
    "uk_equity_income": "uk_equity_income",
    "global_equity": "global_equity",
    "uk_equity": "uk_equity",
    "corporate_bond": "corporate_bond",
    "european_equity": "european_equity",
    "north_american_equity": "north_american_equity",
    "short_duration_bond": "corporate_bond",
    "global_macro_bond": "corporate_bond",
    "money_market": "corporate_bond",
}

FIRM_TYPE_MAP = {
    "ifa": "DA Firm",
    "wealth_manager": "DA Firm",
    "dfm": "DA Firm",
    "fa_restricted": "Network",
    "ar_practice": "AR Firm",
}


def safe_int(val):
    if val is None or val == "":
        return None
    try:
        return int(float(val))
    except (ValueError, TypeError):
        return None


def safe_float(val):
    if val is None or val == "":
        return None
    try:
        return float(val)
    except (ValueError, TypeError):
        return None


def is_true(val):
    return str(val).strip().lower() in ("true", "1", "yes")


def escape_ts(s):
    if s is None:
        return "null"
    return json.dumps(s, ensure_ascii=False)


def main():
    # Load CSV
    with open(RAW_DIR / "keyridge_ranked.csv") as f:
        reader = csv.DictReader(f)
        rows = list(reader)

    # Load briefs
    with open(RAW_DIR / "keyridge_briefs.json") as f:
        briefs = json.load(f)
    brief_by_rank = {b["rank"]: b for b in briefs}

    # Filter: top 200 primary + top 50 restricted
    primary = [r for r in rows if r["section"] == "PRIMARY"][:200]
    restricted = [r for r in rows if r["section"] == "RESTRICTED"][:50]
    all_firms = primary + restricted

    print(f"Processing {len(primary)} primary + {len(restricted)} restricted = {len(all_firms)} firms")

    lines = []
    lines.append('// AUTO-GENERATED from real data. Do not edit manually.')
    lines.append('// Run: python3 src/lib/data/generate-ifa-data.py')
    lines.append('')
    lines.append('')

    # We can't import the type from page.tsx since it's not exported.
    # Instead, we'll define the data as a plain array and the page will cast it.
    lines.append('export interface RealIFAFirm {')
    lines.append('  id: string;')
    lines.append('  rank: number;')
    lines.append('  firm: string;')
    lines.append('  firmType: "DA Firm" | "AR Firm" | "Network";')
    lines.append('  region: string;')
    lines.append('  fitScore: number;')
    lines.append('  keySignal: string;')
    lines.append('  fcaNumber: string;')
    lines.append('  registrationDate: string;')
    lines.append('  permissions: string;')
    lines.append('  keyIndividuals: string[];')
    lines.append('  officeAddress: string;')
    lines.append('  companiesHouseNumber: string;')
    lines.append('  signals: { date: string; source: "FCA" | "CH" | "Web" | "Press"; description: string }[];')
    lines.append('  scoreBreakdown: {')
    lines.append('    firmScale: number;')
    lines.append('    distributionMatch: number;')
    lines.append('    regulatoryFit: number;')
    lines.append('    fundFit: number;')
    lines.append('    marketTiming: number;')
    lines.append('  };')
    lines.append('  review_count: number | null;')
    lines.append('  adviser_count: number | null;')
    lines.append('  signal_count: number;')
    lines.append('  active_mandate: string;')
    lines.append('  brief_available: boolean;')
    lines.append('  brief_who: string | null;')
    lines.append('  brief_why: string | null;')
    lines.append('  brief_opener: string | null;')
    lines.append('  restricted_network: boolean;')
    lines.append('}')
    lines.append('')
    lines.append('export const realIFARankings: RealIFAFirm[] = [')

    for row in all_firms:
        rank = int(row["rank"])
        brief = brief_by_rank.get(rank)

        frn = row.get("frn", "") or ""
        firm_name = row["firm_name"]
        city = row.get("city", "") or ""
        postcode = row.get("postcode", "") or ""
        phone = row.get("phone", "") or ""
        website = row.get("website", "") or ""
        adviser_types = row.get("adviser_types", "") or ""

        adviser_count = safe_int(row.get("adviser_count"))
        review_count = safe_int(row.get("total_reviews"))
        top_rated = safe_int(row.get("top_rated_advisers"))
        priority_score = safe_float(row["priority_score"])
        size_score = safe_float(row.get("size_score", 0))
        perm_score = safe_float(row.get("permission_score", 0))
        dist_score = safe_float(row.get("distribution_score", 0))
        mandate_score = safe_float(row.get("top_mandate_score", 0))
        data_conf = safe_float(row.get("data_confidence", 0))

        has_perms = is_true(row.get("has_permissions_data"))
        advises_retail = is_true(row.get("advises_retail"))
        pension_transfers = is_true(row.get("pension_transfers"))
        manages_investments = is_true(row.get("manages_investments"))
        is_restricted = is_true(row.get("restricted_network"))

        top_mandate_cat = row.get("top_mandate_category", "multi_asset_cautious")
        active_mandate = MANDATE_MAP.get(top_mandate_cat, "cautious_multi_asset")

        # Determine firm type
        first_type = adviser_types.split("|")[0] if adviser_types else "ifa"
        firm_type = FIRM_TYPE_MAP.get(first_type, "DA Firm")
        if is_restricted:
            firm_type = "Network"

        # Score breakdown: normalise sub-scores to fit max values (30/25/20/15/10)
        firm_scale = min(round((size_score or 0) * 30 / 100), 30)
        dist_match = min(round((dist_score or 0) * 25 / 100), 25)
        reg_fit = min(round((perm_score or 0) * 20 / 100), 20)
        fund_fit = min(round((mandate_score or 0) * 15 / 100), 15)
        # Market timing: derive from data confidence + recency signals
        market_timing = min(round((data_conf or 0) * 10), 10)

        # Signals
        signals = []
        signal_count = 0
        if review_count and review_count > 0:
            signals.append({
                "date": "VouchedFor",
                "source": "Web",
                "description": f"{review_count:,} client reviews, {top_rated or 0} top-rated advisers"
            })
            signal_count += 1
        if has_perms:
            perms_list = []
            if advises_retail:
                perms_list.append("advises retail clients")
            if pension_transfers:
                perms_list.append("pension transfers")
            if manages_investments:
                perms_list.append("manages investments")
            if perms_list:
                signals.append({
                    "date": "FCA Register",
                    "source": "FCA",
                    "description": "Permissions: " + ", ".join(perms_list)
                })
                signal_count += 1
        if website:
            signals.append({
                "date": "Public",
                "source": "Web",
                "description": f"Website: {website}"
            })
            signal_count += 1

        key_signal = signals[0]["description"] if signals else "FCA-registered firm. Limited public signals."

        # Permissions string
        perm_parts = []
        if advises_retail:
            perm_parts.append("Advising on investments")
        if pension_transfers:
            perm_parts.append("Pension transfers")
        if manages_investments:
            perm_parts.append("Managing investments")
        permissions_str = ", ".join(perm_parts) if perm_parts else "Advising on investments"

        # Brief
        brief_available = brief is not None
        brief_who = brief.get("brief_who") if brief else None
        brief_why = brief.get("brief_why") if brief else None
        brief_opener = brief.get("brief_opener") if brief else None

        # Specialisms for key individuals placeholder
        specialisms = brief.get("specialisms", []) if brief else []
        key_individuals = specialisms[:3] if specialisms else []

        obj = {
            "id": frn if frn else f"rank-{rank}",
            "rank": rank,
            "firm": firm_name,
            "firmType": firm_type,
            "region": city or "UK",
            "fitScore": round(priority_score) if priority_score else 0,
            "keySignal": key_signal,
            "fcaNumber": f"FRN {frn}" if frn else "",
            "registrationDate": "",
            "permissions": permissions_str,
            "keyIndividuals": key_individuals,
            "officeAddress": f"{city} {postcode}".strip() if city or postcode else "",
            "companiesHouseNumber": row.get("companies_house", "") or "",
            "signals": signals,
            "scoreBreakdown": {
                "firmScale": firm_scale,
                "distributionMatch": dist_match,
                "regulatoryFit": reg_fit,
                "fundFit": fund_fit,
                "marketTiming": market_timing,
            },
            "review_count": review_count,
            "adviser_count": adviser_count,
            "signal_count": signal_count,
            "active_mandate": active_mandate,
            "brief_available": brief_available,
            "brief_who": brief_who,
            "brief_why": brief_why,
            "brief_opener": brief_opener,
            "restricted_network": is_restricted,
        }

        lines.append(f"  {json.dumps(obj, ensure_ascii=False)},")

    lines.append('];')
    lines.append('')
    lines.append(f'export const UNIVERSE_TOTAL = {len(rows)};')
    lines.append('')

    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {len(all_firms)} firms to {OUTPUT}")
    top5 = [f"{r['firm_name']} ({r['priority_score']})" for r in primary[:5]]
    print(f"Top 5: {', '.join(top5)}")


if __name__ == "__main__":
    main()
