#!/usr/bin/env python3
"""
IFA Scoring Engine v2 — Keyridge Asset Management
Reads enriched IFA data, scores and ranks firms.

Weights adjusted for current data availability:
  Firm Size: 40% (strong data)
  Permissions: 30% (183 firms enriched, rest baseline)
  Fund Distribution: 10% (no website data yet)
  Mandate Fit: 20% (adviser type + about text)

Usage:
  python3 score_ifas.py
"""

import csv
import json
import re
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ENRICHED_DIR = BASE_DIR / "enriched"
INPUT_FILE = ENRICHED_DIR / "ifa_enriched.jsonl"
OUTPUT_JSONL = ENRICHED_DIR / "ifa_ranked.jsonl"
OUTPUT_CSV = ENRICHED_DIR / "ifa_ranked.csv"
OUTPUT_REPORT = ENRICHED_DIR / "scoring_report.md"


def load_jsonl(path):
    return [json.loads(l) for l in open(path) if l.strip()]


# ── Scoring Components ────────────────────────────────────────────────────────

def score_firm_size(firm):
    """0-100. Adviser count, reviews, geographic reach, Companies House."""
    score = 0

    # Adviser count (primary signal)
    ac = firm.get("adviser_count", 0) or 0
    if ac >= 100:    score += 35
    elif ac >= 50:   score += 30
    elif ac >= 20:   score += 24
    elif ac >= 10:   score += 18
    elif ac >= 5:    score += 12
    elif ac >= 2:    score += 6
    else:            score += 2

    # Reviews (proxy for client base size)
    reviews = firm.get("total_reviews", 0) or 0
    if reviews >= 5000:   score += 20
    elif reviews >= 2000: score += 16
    elif reviews >= 500:  score += 12
    elif reviews >= 100:  score += 8
    elif reviews >= 20:   score += 4

    # Top rated advisers (quality signal)
    top_rated = firm.get("top_rated_advisers", 0) or 0
    if top_rated >= 20:   score += 10
    elif top_rated >= 10: score += 7
    elif top_rated >= 3:  score += 4
    elif top_rated >= 1:  score += 2

    # Geographic reach (number of cities present in)
    cities = firm.get("cities", []) or []
    if len(cities) >= 20:   score += 15
    elif len(cities) >= 10: score += 10
    elif len(cities) >= 5:  score += 6
    elif len(cities) >= 2:  score += 3

    # Companies House presence (established business)
    if firm.get("companies_house"):
        score += 5

    # Phone number (contactable)
    if firm.get("phone"):
        score += 5

    return min(score, 100)


def score_permissions(firm):
    """0-100. FCA permissions depth. Baseline 50 for non-enriched firms."""
    perms = firm.get("permissions", {})

    # Non-enriched firms: all VouchedFor firms are FCA authorised advisers
    if not perms:
        # Baseline: they're on VouchedFor so they advise retail clients
        base = 50
        # Boost if IFA (not restricted)
        types = firm.get("adviser_types", [])
        if "ifa" in types:
            base += 10  # Independent = broader permissions
        return base

    score = 0
    if perms.get("advises_on_investments"):     score += 20
    if perms.get("retail_clients"):             score += 20
    if perms.get("arranges_investments"):        score += 15
    if perms.get("pension_transfers"):           score += 15
    if perms.get("manages_investments"):          score += 10
    if perms.get("professional_clients"):         score += 10

    # Investment types depth
    inv_types = perms.get("investment_types", [])
    if any("unit" in t.lower() for t in inv_types):
        score += 10  # Can deal in unit trusts/OEICs

    return min(score, 100)


def score_fund_distribution(firm):
    """0-100. Platform and fund distribution signals. Mostly baseline for now."""
    score = 0

    # Website (shows digital presence)
    if firm.get("website"):
        score += 15

    # FCA enriched (more data available = more engaged firm)
    if firm.get("fca_enriched"):
        score += 10

    # Geographic reach as proxy for platform sophistication
    cities = firm.get("cities", []) or []
    if len(cities) >= 10:
        score += 15  # Multi-region = likely uses platforms
    elif len(cities) >= 3:
        score += 8

    # Adviser type: IFAs use platforms more broadly than restricted
    types = firm.get("adviser_types", [])
    if "ifa" in types:
        score += 10

    # Postcode (basic data completeness)
    if firm.get("postcode") or firm.get("address", {}).get("postcode"):
        score += 5

    return min(score, 100)


MANDATE_KEYWORDS = {
    "multi_asset_cautious": [
        "retirement", "cautious", "lower risk", "capital preservation",
        "later life", "estate", "inheritance", "conservative", "pension"
    ],
    "multi_asset_balanced": [
        "investment", "financial planning", "balanced", "portfolio",
        "wealth management", "savings", "isa"
    ],
    "multi_asset_growth": [
        "growth", "capital growth", "long term", "equity",
        "wealth", "accumulation"
    ],
    "multi_asset_income": [
        "retirement income", "income", "drawdown", "annuit",
        "later life", "pension", "decumulation"
    ],
    "uk_equity_income": [
        "income", "uk equity", "equity income", "dividend",
        "yield", "isa"
    ],
    "global_equity": [
        "global", "international", "overseas", "growth",
        "equity", "long term"
    ],
    "corporate_bond": [
        "retirement income", "income", "cautious", "lower risk",
        "capital preservation", "fixed income", "bond"
    ],
    "uk_equity": [
        "uk equity", "equity", "growth", "isa",
        "investment", "capital growth"
    ],
}


def score_mandate_fit(firm):
    """Returns dict of mandate category → score (0-100). Uses adviser type + about text."""
    scores = {}

    # Gather text signals
    about_texts = []
    # About text from VouchedFor (per adviser, concatenated)
    about = firm.get("about", "") or ""
    if about:
        about_texts.append(about.lower())

    types = firm.get("adviser_types", []) or []
    types_lower = [t.lower() for t in types]

    for mandate, keywords in MANDATE_KEYWORDS.items():
        score = 20  # Baseline for all IFA firms

        # Keyword match in about text
        if about_texts:
            text = " ".join(about_texts)
            matches = sum(1 for kw in keywords if kw in text)
            if matches >= 3:    score += 40
            elif matches == 2:  score += 28
            elif matches == 1:  score += 16

        # IFA vs restricted boost
        if "ifa" in types_lower:
            score += 10  # IFAs can recommend any fund
        elif "fa_restricted" in types_lower:
            score += 5   # Restricted = limited panel

        # Pension-related mandates boosted if pension transfers permission
        perms = firm.get("permissions", {})
        if mandate in ["multi_asset_cautious", "multi_asset_income", "corporate_bond"]:
            if perms.get("pension_transfers"):
                score += 10

        # Managing investments boost for growth/equity mandates
        if mandate in ["multi_asset_growth", "global_equity", "uk_equity"]:
            if perms.get("manages_investments"):
                score += 8

        scores[mandate] = min(score, 100)

    return scores


# ── Overall Score ─────────────────────────────────────────────────────────────

def calculate_priority_score(firm):
    size = score_firm_size(firm)
    permissions = score_permissions(firm)
    distribution = score_fund_distribution(firm)
    mandate_scores = score_mandate_fit(firm)
    top_mandate = max(mandate_scores.values()) if mandate_scores else 20
    top_mandate_name = max(mandate_scores, key=mandate_scores.get) if mandate_scores else "unknown"

    # Weighted combination (adjusted for current data)
    priority = (
        size         * 0.40 +
        permissions  * 0.30 +
        distribution * 0.10 +
        top_mandate  * 0.20
    )

    return {
        "priority_score": round(priority, 1),
        "size_score": size,
        "permission_score": permissions,
        "distribution_score": distribution,
        "mandate_scores": mandate_scores,
        "top_mandate_category": top_mandate_name,
        "top_mandate_score": top_mandate,
    }


def calculate_data_confidence(firm):
    fields = [
        bool(firm.get("fca_enriched")),
        bool(firm.get("phone")),
        bool(firm.get("postcode") or firm.get("address", {}).get("postcode")),
        bool(firm.get("website")),
        bool(firm.get("companies_house")),
        bool(firm.get("permissions")),
        firm.get("adviser_count", 0) > 0,
        firm.get("total_reviews", 0) > 0,
    ]
    return round(sum(1 for f in fields if f) / len(fields), 2)


def assign_size_tier(size_score):
    if size_score >= 70:   return "tier_1"
    elif size_score >= 45: return "tier_2"
    elif size_score >= 25: return "tier_3"
    else:                  return "tier_4"


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    print(f"IFA Scoring Engine v2 — {datetime.now().isoformat()}")

    firms = load_jsonl(INPUT_FILE)
    print(f"Loaded {len(firms)} firms")

    # Score all firms
    scored = []
    for firm in firms:
        result = calculate_priority_score(firm)
        firm["priority_score"] = result["priority_score"]
        firm["size_score"] = result["size_score"]
        firm["permission_score"] = result["permission_score"]
        firm["distribution_score"] = result["distribution_score"]
        firm["mandate_fit_scores"] = result["mandate_scores"]
        firm["top_mandate_category"] = result["top_mandate_category"]
        firm["top_mandate_score"] = result["top_mandate_score"]
        firm["data_confidence"] = calculate_data_confidence(firm)
        firm["size_tier"] = assign_size_tier(result["size_score"])
        scored.append(firm)

    # Sort: priority desc, then size desc, then adviser_count desc
    scored.sort(key=lambda f: (
        -f["priority_score"],
        -f["size_score"],
        -(f.get("adviser_count", 0) or 0),
    ))

    # Assign ranks
    for i, firm in enumerate(scored):
        firm["rank"] = i + 1

    # Write JSONL
    with open(OUTPUT_JSONL, "w") as f:
        for firm in scored:
            f.write(json.dumps(firm, ensure_ascii=False) + "\n")
    print(f"Wrote {len(scored)} firms to {OUTPUT_JSONL}")

    # Write CSV
    with open(OUTPUT_CSV, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow([
            "rank", "priority_score", "firm_name", "frn", "size_tier",
            "adviser_count", "total_reviews", "top_rated_advisers",
            "adviser_types", "phone", "postcode", "website",
            "cities_count", "data_confidence",
            "size_score", "permission_score", "distribution_score",
            "top_mandate_category", "top_mandate_score",
            "fca_status", "companies_house", "fca_enriched",
            "advises_retail", "pension_transfers", "manages_investments",
        ])
        for firm in scored:
            perms = firm.get("permissions", {})
            addr = firm.get("address", {})
            pc = firm.get("postcode") or addr.get("postcode", "")
            web = firm.get("website", "") or ""
            w.writerow([
                firm["rank"],
                firm["priority_score"],
                firm["firm_name"],
                firm.get("frn", ""),
                firm["size_tier"],
                firm.get("adviser_count", 0),
                firm.get("total_reviews", 0),
                firm.get("top_rated_advisers", 0),
                "|".join(firm.get("adviser_types", [])),
                firm.get("phone", ""),
                pc,
                web,
                len(firm.get("cities", [])),
                firm["data_confidence"],
                firm["size_score"],
                firm["permission_score"],
                firm["distribution_score"],
                firm["top_mandate_category"],
                firm["top_mandate_score"],
                firm.get("fca_status", ""),
                firm.get("companies_house", ""),
                firm.get("fca_enriched", False),
                perms.get("retail_clients", ""),
                perms.get("pension_transfers", ""),
                perms.get("manages_investments", ""),
            ])
    print(f"Wrote CSV to {OUTPUT_CSV}")

    # Write report
    with open(OUTPUT_REPORT, "w") as f:
        f.write(f"# IFA Scoring Report v2\n\n")
        f.write(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"**Total firms scored:** {len(scored)}\n")
        f.write(f"**FCA enriched:** {sum(1 for s in scored if s.get('fca_enriched'))}\n")
        f.write(f"**VouchedFor only:** {sum(1 for s in scored if not s.get('fca_enriched'))}\n\n")

        f.write(f"## Weights\n\n")
        f.write(f"| Component | Weight |\n|---|---|\n")
        f.write(f"| Firm Size | 40% |\n| Permissions | 30% |\n| Fund Distribution | 10% |\n| Mandate Fit | 20% |\n\n")

        f.write(f"## Tier Breakdown\n\n")
        tiers = {}
        for s in scored:
            t = s["size_tier"]
            tiers[t] = tiers.get(t, 0) + 1
        f.write(f"| Tier | Count |\n|---|---|\n")
        for t in ["tier_1", "tier_2", "tier_3", "tier_4"]:
            f.write(f"| {t} | {tiers.get(t, 0)} |\n")

        f.write(f"\n## Score Distribution\n\n")
        f.write(f"| Range | Count |\n|---|---|\n")
        for lo in range(0, 100, 10):
            hi = lo + 10
            count = sum(1 for s in scored if lo <= s["priority_score"] < hi)
            f.write(f"| {lo}-{hi} | {count} |\n")

        f.write(f"\n## Top 30 Firms\n\n")
        f.write(f"| Rank | Score | Tier | Adv | Reviews | Firm | FRN | Type | Top Mandate |\n")
        f.write(f"|------|-------|------|-----|---------|------|-----|------|-------------|\n")
        for s in scored[:30]:
            types = "|".join(s.get("adviser_types", []))
            f.write(f"| {s['rank']} | {s['priority_score']} | {s['size_tier']} | {s.get('adviser_count',0)} | {s.get('total_reviews',0)} | {s['firm_name'][:35]} | {s.get('frn','')} | {types} | {s['top_mandate_category']} |\n")

        f.write(f"\n## Data Quality\n\n")
        f.write(f"- Firms with FCA number: {sum(1 for s in scored if s.get('frn'))}\n")
        f.write(f"- Firms with phone: {sum(1 for s in scored if s.get('phone'))}\n")
        f.write(f"- Firms with postcode: {sum(1 for s in scored if s.get('postcode') or s.get('address',{}).get('postcode'))}\n")
        f.write(f"- Firms with website: {sum(1 for s in scored if s.get('website'))}\n")
        f.write(f"- Firms with Companies House: {sum(1 for s in scored if s.get('companies_house'))}\n")

    print(f"Wrote report to {OUTPUT_REPORT}")

    # Print top 15
    print(f"\nTop 15:")
    print(f"{'Rk':<4} {'Score':<6} {'Tier':<7} {'Adv':<5} {'Rev':<6} {'Firm':<38} {'Type':<15}")
    print("-" * 85)
    for s in scored[:15]:
        types = "|".join(s.get("adviser_types", []))[:14]
        print(f"{s['rank']:<4} {s['priority_score']:<6} {s['size_tier']:<7} {s.get('adviser_count',0):<5} {s.get('total_reviews',0):<6} {s['firm_name'][:37]:<38} {types:<15}")


if __name__ == "__main__":
    main()
