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
INPUT_FILE = BASE_DIR.parent / "data" / "base_universe.jsonl"
DATA_DIR = BASE_DIR.parent / "data"
OUTPUT_JSONL = DATA_DIR / "keyridge_ranked.jsonl"
OUTPUT_CSV = DATA_DIR / "keyridge_ranked.csv"
OUTPUT_REPORT = DATA_DIR / "keyridge_scoring_report.md"

# Only score these firm types
SCOREABLE_TYPES = {"ifa", "wealth_manager"}

# ── ICP FILTER ────────────────────────────────────────────────────────────────

# Exclude firms whose NAME contains these (case insensitive)
EXCLUDE_NAME_PATTERNS = {
    "investment management", "asset management", "fund management",
    "investment managers", "capital management", "investment company",
    "goldman sachs", "jpmorgan", "lloyds bank", "barclays", "hsbc",
    "citibank", "morgan stanley", "ubs", "credit suisse", "deutsche bank",
    "blackrock", "schroders", "legal & general", "aviva investors",
    "abrdn", "vanguard", "invesco", "fidelity international",
    "jupiter investment", "franklin templeton", "newton investment",
    "bny mellon", "fisher investments europe", "axa investment",
    "clearbridge investment", "union bancaire", "forvis mazars",
    "interactive investor", "ucits",
}

# Exclude these assigned_types entirely
EXCLUDE_TYPES = {"institution", "institutional_adviser", "other", "platform"}


def passes_icp_filter(firm):
    """Returns True if the firm should be scored for Keyridge."""
    # Type check
    if firm.get("assigned_type", "") in EXCLUDE_TYPES:
        return False, "excluded_type"

    if firm.get("assigned_type", "") not in SCOREABLE_TYPES:
        return False, "not_scoreable_type"

    # Name pattern check
    name_lower = (firm.get("firm_name") or "").lower()
    for pattern in EXCLUDE_NAME_PATTERNS:
        if pattern in name_lower:
            return False, f"excluded_name:{pattern}"

    # Headcount check (>500 = institutional)
    if (firm.get("individual_count", 0) or 0) > 500:
        return False, "too_large"

    return True, None


def load_jsonl(path):
    return [json.loads(l) for l in open(path) if l.strip()]


# ── Scoring Components ────────────────────────────────────────────────────────

def score_firm_size(firm):
    """0-100. Adviser count, reviews, geographic reach, Companies House."""
    score = 0

    # Adviser count (use VouchedFor count, fall back to FCA individual count)
    ac = firm.get("adviser_count_vf", 0) or firm.get("individual_count", 0) or 0
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
    has_data = firm.get("has_permissions_data", False)

    if not has_data:
        # No FCA permissions data — use baseline
        base = 40
        types = firm.get("adviser_types", []) or []
        if "ifa" in types:
            base += 10
        if firm.get("assigned_type") == "ifa":
            base += 10
        return base

    score = 0
    if firm.get("advises_on_investments"):       score += 20
    if firm.get("retail_clients"):               score += 20
    if firm.get("collective_investment_schemes"): score += 15
    if firm.get("pension_transfers"):             score += 15
    if firm.get("manages_investments"):            score += 10
    if firm.get("life_policies"):                  score += 5
    if firm.get("professional_clients"):           score += 5

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
    addr = firm.get("address")
    if firm.get("postcode") or (isinstance(addr, dict) and addr.get("postcode")):
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
        bool(firm.get("postcode") or (firm.get("address") if isinstance(firm.get("address"), dict) else {}).get("postcode")),
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

    all_firms = load_jsonl(INPUT_FILE)
    print(f"Loaded {len(all_firms)} firms from base universe")

    # ── ICP FILTER ──
    firms = []
    excluded_reasons = {}
    for firm in all_firms:
        passes, reason = passes_icp_filter(firm)
        if passes:
            firms.append(firm)
        else:
            excluded_reasons[reason] = excluded_reasons.get(reason, 0) + 1

    total_excluded = len(all_firms) - len(firms)
    print(f"ICP filter: {len(firms)} pass, {total_excluded} excluded")
    for reason, count in sorted(excluded_reasons.items(), key=lambda x: -x[1])[:10]:
        print(f"  {count:>5}  {reason}")

    # ── SCORE ALL FIRMS ──
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

        # ── FIX 2: VouchedFor data penalty ──
        has_vf = (firm.get("total_reviews", 0) or 0) > 0 or (firm.get("adviser_count_vf", 0) or 0) > 0
        firm["scored_without_vouchedfor"] = not has_vf

        if not has_vf:
            # Penalty: reduce score by 25%
            firm["priority_score"] = round(firm["priority_score"] * 0.75, 1)
            # Cap tier at tier_3
            if firm["size_tier"] in ("tier_1", "tier_2"):
                firm["size_tier"] = "tier_3"

        # ── FIX 3: Restricted network flag ──
        types = firm.get("adviser_types") or []
        is_restricted = "fa_restricted" in types or firm.get("assigned_type") == "fa_restricted"
        firm["restricted_network"] = is_restricted

        scored.append(firm)

    # ── MIN-MAX NORMALISATION ──
    # Rescale priority_score to 35-88 range for intuitive 0-100 scale
    raw_scores = [f["priority_score"] for f in scored]
    raw_min = min(raw_scores)
    raw_max = max(raw_scores)
    if raw_max > raw_min:
        for firm in scored:
            firm["priority_score_raw"] = firm["priority_score"]
            firm["priority_score"] = round(
                35 + (firm["priority_score"] - raw_min) / (raw_max - raw_min) * 53, 1
            )
    else:
        for firm in scored:
            firm["priority_score_raw"] = firm["priority_score"]
    print(f"\nScore normalisation: raw {raw_min:.1f}–{raw_max:.1f} → normalised 35.0–88.0")

    # ── SORT: independent first, then restricted ──
    independent = [f for f in scored if not f["restricted_network"]]
    restricted = [f for f in scored if f["restricted_network"]]

    # Sort each group by priority desc
    independent.sort(key=lambda f: (
        -f["priority_score"],
        -f["size_score"],
        -(f.get("adviser_count_vf", 0) or f.get("individual_count", 0) or 0),
    ))
    restricted.sort(key=lambda f: (
        -f["priority_score"],
        -f["size_score"],
        -(f.get("adviser_count_vf", 0) or f.get("individual_count", 0) or 0),
    ))

    # Assign ranks within each section
    for i, firm in enumerate(independent):
        firm["rank"] = i + 1
    for i, firm in enumerate(restricted):
        firm["rank"] = i + 1

    # Combined output: independent first, then restricted
    scored = independent + restricted

    print(f"\nPrimary list (independent/IFA): {len(independent)}")
    print(f"Restricted network section: {len(restricted)}")
    print(f"Scored without VouchedFor data: {sum(1 for f in scored if f.get('scored_without_vouchedfor'))}")

    # Write JSONL
    with open(OUTPUT_JSONL, "w") as f:
        for firm in scored:
            f.write(json.dumps(firm, ensure_ascii=False) + "\n")
    print(f"Wrote {len(scored)} firms to {OUTPUT_JSONL}")

    # Write CSV
    with open(OUTPUT_CSV, "w", newline="") as f:
        w = csv.writer(f)
        w.writerow([
            "section", "rank", "priority_score", "firm_name", "frn", "size_tier",
            "adviser_count", "total_reviews", "top_rated_advisers",
            "adviser_types", "phone", "postcode", "website", "city",
            "cities_count", "data_confidence",
            "size_score", "permission_score", "distribution_score",
            "top_mandate_category", "top_mandate_score",
            "fca_status", "companies_house", "has_permissions_data",
            "advises_retail", "pension_transfers", "manages_investments",
            "restricted_network", "scored_without_vouchedfor",
        ])
        for firm in scored:
            ac = firm.get("adviser_count_vf", 0) or firm.get("individual_count", 0) or 0
            pc = firm.get("postcode", "") or ""
            web = firm.get("website", "") or ""
            section = "RESTRICTED" if firm.get("restricted_network") else "PRIMARY"
            w.writerow([
                section,
                firm["rank"],
                firm["priority_score"],
                firm["firm_name"],
                firm.get("frn", ""),
                firm["size_tier"],
                ac,
                firm.get("total_reviews", 0),
                firm.get("top_rated_advisers", 0),
                "|".join(firm.get("adviser_types") or []),
                firm.get("phone", ""),
                pc,
                web,
                firm.get("city", ""),
                len(firm.get("cities") or []),
                firm["data_confidence"],
                firm["size_score"],
                firm["permission_score"],
                firm["distribution_score"],
                firm["top_mandate_category"],
                firm["top_mandate_score"],
                firm.get("fca_status", ""),
                firm.get("companies_house", ""),
                firm.get("has_permissions_data", False),
                firm.get("retail_clients", ""),
                firm.get("pension_transfers", ""),
                firm.get("manages_investments", ""),
                firm.get("restricted_network", False),
                firm.get("scored_without_vouchedfor", False),
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
        f.write(f"- Firms with postcode: {sum(1 for s in scored if s.get('postcode'))}\n")
        f.write(f"- Firms with website: {sum(1 for s in scored if s.get('website'))}\n")
        f.write(f"- Firms with Companies House: {sum(1 for s in scored if s.get('companies_house'))}\n")

    print(f"Wrote report to {OUTPUT_REPORT}")

    # Print top 15
    print(f"\nTop 15 PRIMARY (independent IFAs):")
    print(f"{'Rk':<4} {'Score':<6} {'Tier':<7} {'Adv':<5} {'Rev':<6} {'Firm':<38} {'City':<15} {'Mandate':<20}")
    print("-" * 100)
    for s in independent[:15]:
        ac = s.get('adviser_count_vf',0) or s.get('individual_count',0) or 0
        city = (s.get('city') or '')[:14]
        print(f"{s['rank']:<4} {s['priority_score']:<6} {s['size_tier']:<7} {ac:<5} {s.get('total_reviews',0):<6} {s['firm_name'][:37]:<38} {city:<15} {s.get('top_mandate_category',''):<20}")

    print(f"\nTop 5 RESTRICTED networks:")
    for s in restricted[:5]:
        ac = s.get('adviser_count_vf',0) or s.get('individual_count',0) or 0
        print(f"  {s['rank']:<4} {s['priority_score']:<6} {ac:<5} {s['firm_name'][:40]}")


if __name__ == "__main__":
    main()
