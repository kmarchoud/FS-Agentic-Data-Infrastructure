#!/usr/bin/env python3
"""
IFA Scoring Engine — Keyridge Asset Management
Reads ifa_master.jsonl, applies ICP filter and 5-component scoring,
produces ranked output files.

Usage:
  python3 score_ifas.py
"""

import csv
import json
import os
import sys
from datetime import datetime
from pathlib import Path
from collections import Counter

# ── Paths ────────────────────────────────────────────────────────────────────

BASE_DIR = Path(__file__).resolve().parent
ENRICHED_DIR = BASE_DIR / "enriched"
PLATFORM_CSV = BASE_DIR.parent / "Platforms" / "platform_presence.csv"
FUND_DATA_PATH = ENRICHED_DIR / "keyridge_funds_clean.json"

INPUT_FILE = ENRICHED_DIR / "ifa_master.jsonl"
OUTPUT_JSONL = ENRICHED_DIR / "ifa_ranked.jsonl"
OUTPUT_CSV = ENRICHED_DIR / "ifa_ranked.csv"
OUTPUT_REPORT = ENRICHED_DIR / "scoring_report.md"
EXCLUDED_FILE = ENRICHED_DIR / "excluded_firms.jsonl"


# ── Load helpers ─────────────────────────────────────────────────────────────

def load_jsonl(path):
    records = []
    with open(path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line:
                records.append(json.loads(line))
    return records


def load_keyridge_platforms():
    """Load platform names where Keyridge funds are confirmed present."""
    platforms = set()
    if not PLATFORM_CSV.exists():
        print(f"WARNING: Platform CSV not found at {PLATFORM_CSV}")
        return platforms

    with open(PLATFORM_CSV, "r", encoding="utf-8-sig") as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Try common column name patterns
            confirmed = None
            platform_name = None
            for k, v in row.items():
                kl = k.strip().lower().replace(" ", "_")
                if "confirmed" in kl and "present" in kl:
                    confirmed = v
                if kl in ("platform", "platform_name", "name"):
                    platform_name = v
            if confirmed and confirmed.strip().lower() in ("true", "yes", "1"):
                if platform_name:
                    platforms.add(platform_name.strip().lower())
    print(f"Loaded {len(platforms)} Keyridge platforms: {sorted(platforms)}")
    return platforms


def load_fund_data():
    """Load Keyridge fund data for mandate categories."""
    if not FUND_DATA_PATH.exists():
        return []
    with open(FUND_DATA_PATH, "r") as f:
        return json.load(f)


# ── ICP Filter ───────────────────────────────────────────────────────────────

HARD_EXCLUDE_FRNS = {"169586", "417792"}

HARD_EXCLUDE_NAMES = [
    "waystone", "crowdcube", "risksave", "asset match", "corpay", "mercantile risk"
]

SOFT_EXCLUDE_NAMES = [
    "securities limited", "capital markets", "technologies ltd"
]


def icp_filter(firm):
    """Return (passes, reason) tuple. If passes is False, firm is excluded."""
    frn = str(firm.get("frn", ""))
    name = firm.get("firm_name", "")
    name_lower = name.lower()
    perms = firm.get("permissions", {})

    # Hard exclude FRNs
    if frn in HARD_EXCLUDE_FRNS:
        return False, f"hard_exclude_frn:{frn}"

    # Hard exclude names
    for pattern in HARD_EXCLUDE_NAMES:
        if pattern in name_lower:
            return False, f"hard_exclude_name:{pattern}"

    # Permission requirements
    has_advises = perms.get("advises_on_investments", False)
    has_retail = perms.get("retail_clients", False)
    # CIS check: either the boolean flag OR "Unit" in investment_types
    # "Unit" means the firm can deal in unit trusts/OEICs (collective investments)
    has_cis = perms.get("collective_investment_schemes", False)
    if not has_cis:
        inv_types = [t.lower() for t in perms.get("investment_types", [])]
        has_cis = any("unit" in t for t in inv_types)
    all_perms = has_advises and has_retail and has_cis

    # Soft exclude: name pattern + missing permissions
    for pattern in SOFT_EXCLUDE_NAMES:
        if pattern in name_lower and not all_perms:
            return False, f"soft_exclude_name:{pattern}_missing_permissions"

    # Hard permission filter
    if not all_perms:
        missing = []
        if not has_advises:
            missing.append("advises_on_investments")
        if not has_retail:
            missing.append("retail_clients")
        if not has_cis:
            missing.append("collective_investment_schemes")
        return False, f"missing_permissions:{','.join(missing)}"

    return True, None


# ── Scoring Components ───────────────────────────────────────────────────────

def score_size(firm):
    """Component 1: Size Score (weight 30%)."""
    score = 0

    # Adviser count
    adviser_count = firm.get("individual_count", 0) or 0
    if adviser_count >= 200:
        score += 40
    elif adviser_count >= 50:
        score += 32
    elif adviser_count >= 20:
        score += 24
    elif adviser_count >= 10:
        score += 16
    elif adviser_count >= 5:
        score += 10
    elif adviser_count >= 2:
        score += 6
    else:
        score += 2

    # AUM band from vouchedfor
    vf = firm.get("vouchedfor", {}) or {}
    aum_band = (vf.get("aum_band", "") or "").lower()
    if any(x in aum_band for x in ["500m", "billion", "1bn", "500 m"]):
        score += 30
    elif any(x in aum_band for x in ["100m", "250m", "100 m", "250 m"]):
        score += 22
    elif any(x in aum_band for x in ["50m", "50 m"]):
        score += 16
    elif any(x in aum_band for x in ["10m", "25m", "10 m", "25 m"]):
        score += 10
    else:
        score += 5

    # PIMFA member
    if firm.get("pimfa_member", False):
        score += 15

    return min(score, 100)


def score_permissions(firm):
    """Component 2: Permission Score (weight 20%)."""
    perms = firm.get("permissions", {})
    score = 0

    if perms.get("advises_on_investments", False):
        score += 20
    if perms.get("retail_clients", False):
        score += 20
    has_cis_perm = perms.get("collective_investment_schemes", False)
    if not has_cis_perm:
        inv_types = [t.lower() for t in perms.get("investment_types", [])]
        has_cis_perm = any("unit" in t for t in inv_types)
    if has_cis_perm:
        score += 20
    if perms.get("pension_transfers", False):
        score += 15
    if perms.get("manages_investments", False):
        score += 15
    if perms.get("life_policies", False):
        score += 5
    if perms.get("professional_clients", False):
        score += 5

    return min(score, 100)


def score_distribution(firm, keyridge_platforms):
    """Component 3: Fund Distribution Score (weight 35%)."""
    score = 0

    # Platform mentions from website_intelligence
    wi = firm.get("website_intelligence", {}) or {}
    platform_mentions = wi.get("platform_mentions", []) or []
    platform_mentions_lower = [p.lower() for p in platform_mentions]

    overlap = [p for p in platform_mentions_lower if p in keyridge_platforms]
    overlap_count = len(overlap)

    if overlap_count >= 3:
        score += 50
    elif overlap_count == 2:
        score += 38
    elif overlap_count == 1:
        score += 26
    elif len(platform_mentions) > 0:
        score += 12

    # Risk profiling tool
    rpt = (wi.get("risk_profiling_tool", "") or "").lower()
    if "dynamic planner" in rpt:
        score += 20
    elif rpt:
        score += 10

    # Fund manager mentions
    fmm = wi.get("fund_manager_mentions", []) or []
    fmm_lower = [m.lower() for m in fmm]
    if any("keyridge" in m or "canada life" in m for m in fmm_lower):
        score += 20

    # PIMFA member
    if firm.get("pimfa_member", False):
        score += 10

    return min(score, 100)


# ── Mandate Fit ──────────────────────────────────────────────────────────────

MANDATE_CATEGORIES = {
    "multi_asset_cautious": {
        "keywords": ["cautious", "defensive", "low risk", "capital preservation",
                      "conservative", "wealth preservation", "risk averse",
                      "income", "retirement", "pension"],
        "permission_boost": "pension_transfers",
    },
    "multi_asset_balanced": {
        "keywords": ["balanced", "moderate", "medium risk", "diversified",
                      "mixed", "multi-asset", "growth and income",
                      "wealth management", "financial planning"],
        "permission_boost": None,
    },
    "multi_asset_growth": {
        "keywords": ["growth", "capital growth", "long term", "accumulation",
                      "equity", "higher risk", "aggressive",
                      "wealth creation", "investment management"],
        "permission_boost": None,
    },
    "multi_asset_income": {
        "keywords": ["income", "yield", "dividend", "distribution",
                      "retirement income", "drawdown", "pension",
                      "decumulation", "annuity alternative"],
        "permission_boost": "pension_transfers",
    },
    "uk_equity_income": {
        "keywords": ["uk equity", "uk income", "uk dividend", "british",
                      "domestic equity", "uk stocks", "ftse",
                      "uk market", "uk shares"],
        "permission_boost": None,
    },
    "global_equity": {
        "keywords": ["global", "international", "overseas", "world",
                      "emerging", "global equity", "international equity",
                      "foreign", "worldwide"],
        "permission_boost": None,
    },
    "corporate_bond": {
        "keywords": ["bond", "fixed income", "credit", "corporate bond",
                      "fixed interest", "gilt", "debt", "investment grade",
                      "high yield"],
        "permission_boost": None,
    },
    "uk_equity": {
        "keywords": ["uk equity", "uk stocks", "uk shares", "british equity",
                      "domestic", "ftse", "uk market", "uk growth",
                      "small cap", "mid cap"],
        "permission_boost": None,
    },
}


def score_mandate_fit(firm):
    """Component 4: Mandate Fit (weight 15%). Returns dict of category scores and top category."""
    perms = firm.get("permissions", {})

    # Gather text to match against
    vf = firm.get("vouchedfor", {}) or {}
    ub = firm.get("unbiased", {}) or {}
    specialisms = []

    # From vouchedfor
    vf_specialisms = vf.get("specialisms", []) or []
    specialisms.extend([s.lower() for s in vf_specialisms])

    # From unbiased
    ub_services = ub.get("services", []) or []
    specialisms.extend([s.lower() for s in ub_services])

    # Also check firm_category and any other text fields
    cat = (firm.get("firm_category", "") or "").lower()
    if cat:
        specialisms.append(cat)

    # Website intelligence services
    wi = firm.get("website_intelligence", {}) or {}
    wi_services = wi.get("services", []) or []
    specialisms.extend([s.lower() for s in wi_services])

    combined_text = " ".join(specialisms)

    mandate_scores = {}
    for category, config in MANDATE_CATEGORIES.items():
        base = 20  # baseline
        keywords = config["keywords"]
        matches = sum(1 for kw in keywords if kw in combined_text)

        if matches >= 3:
            base += 50
        elif matches == 2:
            base += 35
        elif matches == 1:
            base += 20

        # Permission boost
        perm_boost_key = config.get("permission_boost")
        if perm_boost_key and perms.get(perm_boost_key, False):
            base += 10

        mandate_scores[category] = min(base, 100)

    top_category = max(mandate_scores, key=mandate_scores.get)
    top_score = mandate_scores[top_category]

    return mandate_scores, top_category, top_score


# ── Signal Score ─────────────────────────────────────────────────────────────

SIGNAL_KEYWORDS = {
    "aum growth": 15,
    "assets under management growth": 15,
    "acquisition": 10,
    "acquired": 10,
    "merger": 10,
    "new office": 10,
    "office opening": 10,
    "expansion": 10,
    "award": 8,
    "awarded": 8,
    "winner": 8,
    "partnership": 12,
    "strategic partnership": 12,
    "collaboration": 12,
    "leadership": 5,
    "new ceo": 5,
    "new hire": 5,
    "appointed": 5,
    "regulatory": -25,
    "fined": -25,
    "sanction": -25,
    "enforcement": -25,
}


def score_signals(firm):
    """Component 5: Signal Score (adjustment only)."""
    baseline = 50

    news = firm.get("news_signals", []) or []
    if not news:
        return baseline

    adjustment = 0
    seen_categories = set()
    for signal in news:
        text = ""
        if isinstance(signal, dict):
            text = (signal.get("headline", "") + " " + signal.get("summary", "")).lower()
        elif isinstance(signal, str):
            text = signal.lower()

        for keyword, points in SIGNAL_KEYWORDS.items():
            if keyword in text and keyword not in seen_categories:
                adjustment += points
                seen_categories.add(keyword)

    return baseline + adjustment


# ── Data Confidence ──────────────────────────────────────────────────────────

def calc_data_confidence(firm):
    """Count presence of key data fields, divide by 8."""
    checks = 0

    vf = firm.get("vouchedfor", {}) or {}
    if vf.get("found", False):
        checks += 1

    ub = firm.get("unbiased", {}) or {}
    if ub.get("found", False):
        checks += 1

    wi = firm.get("website_intelligence", {}) or {}
    if wi.get("platform_mentions"):
        checks += 1

    # companies_house_number - check multiple locations
    if firm.get("companies_house_number") or (firm.get("fca_firm", {}) or {}).get("companies_house_number"):
        checks += 1

    if firm.get("phone"):
        checks += 1

    if firm.get("website"):
        checks += 1

    if firm.get("news_signals"):
        checks += 1

    if (firm.get("individual_count") or 0) > 0:
        checks += 1

    return round(checks / 8, 4)


# ── Overall Score ────────────────────────────────────────────────────────────

def compute_priority_score(size, permission, distribution, top_mandate, signal_score):
    """
    priority_score = size*0.30 + permission*0.20 + distribution*0.35 + top_mandate*0.15 + signal_adjustment
    signal_adjustment = (signal_score - 50) * 0.10
    """
    signal_adj = (signal_score - 50) * 0.10
    raw = size * 0.30 + permission * 0.20 + distribution * 0.35 + top_mandate * 0.15 + signal_adj
    return round(raw, 2)


def size_tier(score):
    if score >= 70:
        return "tier_1"
    elif score >= 45:
        return "tier_2"
    elif score >= 25:
        return "tier_3"
    else:
        return "tier_4"


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    print(f"IFA Scoring Engine — {datetime.now().isoformat()}")
    print(f"Input: {INPUT_FILE}")

    # Load data
    firms = load_jsonl(INPUT_FILE)
    print(f"Loaded {len(firms)} firms from ifa_master.jsonl")

    keyridge_platforms = load_keyridge_platforms()
    fund_data = load_fund_data()
    print(f"Loaded {len(fund_data)} Keyridge funds")

    # ICP Filter
    included = []
    excluded = []
    exclusion_reasons = Counter()

    for firm in firms:
        passes, reason = icp_filter(firm)
        if passes:
            included.append(firm)
        else:
            excluded.append({"firm": firm, "exclusion_reason": reason})
            # Count top-level reason
            top_reason = reason.split(":")[0] if ":" in reason else reason
            exclusion_reasons[top_reason] += 1

    print(f"ICP Filter: {len(included)} included, {len(excluded)} excluded")
    for reason, count in exclusion_reasons.most_common():
        print(f"  {reason}: {count}")

    # Write excluded firms
    with open(EXCLUDED_FILE, "w", encoding="utf-8") as f:
        for exc in excluded:
            record = {
                "frn": exc["firm"].get("frn", ""),
                "firm_name": exc["firm"].get("firm_name", ""),
                "exclusion_reason": exc["exclusion_reason"],
            }
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    print(f"Wrote {len(excluded)} excluded firms to {EXCLUDED_FILE}")

    # Score all included firms
    scored = []
    for firm in included:
        ss = score_size(firm)
        ps = score_permissions(firm)
        ds = score_distribution(firm, keyridge_platforms)
        mandate_scores, top_cat, top_mandate = score_mandate_fit(firm)
        sig = score_signals(firm)

        priority = compute_priority_score(ss, ps, ds, top_mandate, sig)
        tier = size_tier(priority)
        dc = calc_data_confidence(firm)

        adviser_count = firm.get("individual_count", 0) or 0
        address = firm.get("address", {}) or {}
        wi = firm.get("website_intelligence", {}) or {}

        scored_firm = {
            "frn": firm.get("frn", ""),
            "firm_name": firm.get("firm_name", ""),
            "firm_category": firm.get("firm_category", ""),
            "status": firm.get("status", ""),
            "phone": firm.get("phone", ""),
            "website": firm.get("website", ""),
            "town": address.get("town", ""),
            "postcode": address.get("postcode", ""),
            "county": address.get("county", ""),
            "country": address.get("country", ""),
            "adviser_count": adviser_count,
            "pimfa_member": firm.get("pimfa_member", False),
            "priority_score": priority,
            "size_tier": tier,
            "size_score": ss,
            "permission_score": ps,
            "fund_distribution_score": ds,
            "signal_score": sig,
            "data_confidence": dc,
            "top_mandate_category": top_cat,
            "mandate_fit_multi_asset_cautious": mandate_scores.get("multi_asset_cautious", 0),
            "mandate_fit_multi_asset_balanced": mandate_scores.get("multi_asset_balanced", 0),
            "mandate_fit_multi_asset_growth": mandate_scores.get("multi_asset_growth", 0),
            "mandate_fit_multi_asset_income": mandate_scores.get("multi_asset_income", 0),
            "mandate_fit_uk_equity_income": mandate_scores.get("uk_equity_income", 0),
            "mandate_fit_global_equity": mandate_scores.get("global_equity", 0),
            "mandate_fit_corporate_bond": mandate_scores.get("corporate_bond", 0),
            "mandate_fit_uk_equity": mandate_scores.get("uk_equity", 0),
            "vouchedfor_specialisms": ", ".join(
                (firm.get("vouchedfor", {}) or {}).get("specialisms", []) or []
            ),
            "platform_mentions": ", ".join(wi.get("platform_mentions", []) or []),
            "risk_profiling_tool": wi.get("risk_profiling_tool", ""),
            "has_keyridge_mention": any(
                "keyridge" in m.lower() or "canada life" in m.lower()
                for m in (wi.get("fund_manager_mentions", []) or [])
            ),
            # Preserve original data for JSONL
            "permissions": firm.get("permissions", {}),
            "address": address,
            "is_appointed_representative": firm.get("is_appointed_representative", False),
            "has_disciplinary_history": firm.get("has_disciplinary_history", False),
            "mandate_fit_scores": mandate_scores,
        }
        scored.append(scored_firm)

    # Sort: priority_score desc, size_score desc, distribution_score desc, adviser_count desc
    scored.sort(key=lambda x: (
        -x["priority_score"],
        -x["size_score"],
        -x["fund_distribution_score"],
        -x["adviser_count"],
    ))

    # Assign ranks
    for i, firm in enumerate(scored):
        firm["rank"] = i + 1

    # ── Write JSONL ──────────────────────────────────────────────────────────
    with open(OUTPUT_JSONL, "w", encoding="utf-8") as f:
        for firm in scored:
            f.write(json.dumps(firm, ensure_ascii=False) + "\n")
    print(f"Wrote {len(scored)} scored firms to {OUTPUT_JSONL}")

    # ── Write CSV ────────────────────────────────────────────────────────────
    csv_columns = [
        "rank", "priority_score", "firm_name", "frn", "firm_category", "size_tier",
        "town", "postcode", "phone", "website", "adviser_count", "pimfa_member",
        "data_confidence", "size_score", "permission_score", "fund_distribution_score",
        "signal_score", "mandate_fit_multi_asset_cautious", "mandate_fit_multi_asset_balanced",
        "mandate_fit_multi_asset_growth", "mandate_fit_multi_asset_income",
        "mandate_fit_uk_equity_income", "mandate_fit_global_equity",
        "mandate_fit_corporate_bond", "mandate_fit_uk_equity",
        "top_mandate_category", "vouchedfor_specialisms", "platform_mentions",
        "risk_profiling_tool", "has_keyridge_mention",
    ]

    # Rename firm_category to category in CSV output
    with open(OUTPUT_CSV, "w", encoding="utf-8", newline="") as f:
        # Use "category" header as specified
        headers = [c if c != "firm_category" else "category" for c in csv_columns]
        writer = csv.DictWriter(f, fieldnames=headers, extrasaction="ignore")
        writer.writeheader()
        for firm in scored:
            row = {(k if k != "firm_category" else "category"): firm.get(k, "") for k in csv_columns}
            writer.writerow(row)
    print(f"Wrote {len(scored)} rows to {OUTPUT_CSV}")

    # ── Validation Checks ────────────────────────────────────────────────────
    validations = []

    # 1. No duplicate scores in top 50
    top50_scores = [(s["priority_score"], s["size_score"], s["fund_distribution_score"], s["adviser_count"]) for s in scored[:50]]
    has_dupes = len(top50_scores) != len(set(top50_scores))
    if has_dupes:
        # Count actual duplicates
        dupe_count = sum(1 for c in Counter(top50_scores).values() if c > 1)
        validations.append(f"WARN: {dupe_count} duplicate sort-key tuples in top 50 (tie-breaking applied but some firms have identical data)")
    else:
        validations.append("PASS: No duplicate sort-key tuples in top 50")

    # 2. Waystone FRN 169586 not in output
    waystone_169586 = any(s["frn"] == "169586" for s in scored)
    if waystone_169586:
        validations.append("FAIL: Waystone FRN 169586 found in output!")
    else:
        validations.append("PASS: Waystone FRN 169586 excluded")

    # 3. FRN 417792 not in output
    frn_417792 = any(s["frn"] == "417792" for s in scored)
    if frn_417792:
        validations.append("FAIL: FRN 417792 found in output!")
    else:
        validations.append("PASS: FRN 417792 excluded")

    # 4. Top 200 covers >=8 regions
    top200_towns = set(s.get("town", "").strip() for s in scored[:200] if s.get("town", "").strip())
    # Use county as a proxy for region if available
    top200_regions = set()
    for s in scored[:200]:
        town = (s.get("town", "") or "").strip()
        county = (s.get("county", "") or "").strip()
        if county:
            top200_regions.add(county)
        elif town:
            top200_regions.add(town)
    region_count = len(top200_regions)
    if region_count >= 8:
        validations.append(f"PASS: Top 200 covers {region_count} regions/towns")
    else:
        validations.append(f"WARN: Top 200 covers only {region_count} regions/towns (target: >=8)")

    # 5. >=10% of top 200 have distribution_score > 40
    top200_dist_gt40 = sum(1 for s in scored[:200] if s["fund_distribution_score"] > 40)
    pct = (top200_dist_gt40 / min(200, len(scored))) * 100 if scored else 0
    if pct >= 10:
        validations.append(f"PASS: {top200_dist_gt40} ({pct:.1f}%) of top 200 have distribution_score > 40")
    else:
        validations.append(f"INFO: {top200_dist_gt40} ({pct:.1f}%) of top 200 have distribution_score > 40 (target: >=10%)")

    # 6. Data confidence has variance
    dc_values = set(s["data_confidence"] for s in scored)
    if len(dc_values) > 1:
        validations.append(f"PASS: data_confidence has {len(dc_values)} distinct values")
    else:
        validations.append(f"WARN: data_confidence has only 1 distinct value: {dc_values}")

    # ── Scoring Report ───────────────────────────────────────────────────────
    tier_counts = Counter(s["size_tier"] for s in scored)
    top_mandate_counts = Counter(s["top_mandate_category"] for s in scored)

    report_lines = [
        f"# IFA Scoring Report",
        f"",
        f"Generated: {datetime.now().isoformat()}",
        f"",
        f"## Summary Statistics",
        f"",
        f"- **Total firms in input**: {len(firms)}",
        f"- **Excluded by ICP filter**: {len(excluded)}",
        f"- **Scored firms**: {len(scored)}",
        f"- **Keyridge platforms loaded**: {len(keyridge_platforms)}",
        f"",
        f"### Exclusion Breakdown",
        f"",
    ]
    for reason, count in exclusion_reasons.most_common():
        report_lines.append(f"- {reason}: {count}")

    report_lines += [
        f"",
        f"### Size Tier Distribution",
        f"",
    ]
    for tier in ["tier_1", "tier_2", "tier_3", "tier_4"]:
        report_lines.append(f"- {tier}: {tier_counts.get(tier, 0)}")

    report_lines += [
        f"",
        f"### Score Ranges",
        f"",
    ]
    if scored:
        scores = [s["priority_score"] for s in scored]
        report_lines.append(f"- Priority score: min={min(scores)}, max={max(scores)}, mean={sum(scores)/len(scores):.1f}")
        sizes = [s["size_score"] for s in scored]
        report_lines.append(f"- Size score: min={min(sizes)}, max={max(sizes)}, mean={sum(sizes)/len(sizes):.1f}")
        perms = [s["permission_score"] for s in scored]
        report_lines.append(f"- Permission score: min={min(perms)}, max={max(perms)}, mean={sum(perms)/len(perms):.1f}")
        dists = [s["fund_distribution_score"] for s in scored]
        report_lines.append(f"- Distribution score: min={min(dists)}, max={max(dists)}, mean={sum(dists)/len(dists):.1f}")

    report_lines += [
        f"",
        f"### Top Mandate Categories",
        f"",
    ]
    for cat, count in top_mandate_counts.most_common():
        report_lines.append(f"- {cat}: {count}")

    report_lines += [
        f"",
        f"## Top 30 Firms",
        f"",
        f"| Rank | Score | Firm | FRN | Tier | Town | Advisers |",
        f"|------|-------|------|-----|------|------|----------|",
    ]
    for s in scored[:30]:
        report_lines.append(
            f"| {s['rank']} | {s['priority_score']} | {s['firm_name'][:40]} | {s['frn']} | {s['size_tier']} | {s.get('town', '')[:20]} | {s['adviser_count']} |"
        )

    report_lines += [
        f"",
        f"## Validation Checks",
        f"",
    ]
    for v in validations:
        report_lines.append(f"- {v}")
        print(f"  Validation: {v}")

    report_text = "\n".join(report_lines) + "\n"
    with open(OUTPUT_REPORT, "w", encoding="utf-8") as f:
        f.write(report_text)
    print(f"Wrote scoring report to {OUTPUT_REPORT}")

    print(f"\nDone. Top 5 firms:")
    for s in scored[:5]:
        print(f"  #{s['rank']} {s['firm_name']} (FRN {s['frn']}) — score {s['priority_score']}, tier {s['size_tier']}")


if __name__ == "__main__":
    main()
