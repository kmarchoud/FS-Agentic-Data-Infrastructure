#!/usr/bin/env python3
"""
Merge competitor fund partials into final JSON + CSV + sector summary.

Inputs:
  data/competitor_funds/partials/batch_*.json

Outputs:
  data/competitor_funds/competitor_funds.json
  data/competitor_funds/competitor_funds.csv
  data/competitor_funds/sector_summary.md
"""

import csv
import json
import statistics
from collections import defaultdict
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
CF_DIR = BASE / "data" / "competitor_funds"
PARTIALS = CF_DIR / "partials"
OUT_JSON = CF_DIR / "competitor_funds.json"
OUT_CSV = CF_DIR / "competitor_funds.csv"
OUT_MD = CF_DIR / "sector_summary.md"

# Keyridge funds in each sector with their AUM (from user spec)
KEYRIDGE_FUNDS = {
    "IA Mixed Investment 0-35% Shares": [
        ("WS Keyridge Portfolio III", 80.7),
        ("WS Keyridge DRM III", 121.5),
    ],
    "IA Mixed Investment 20-60% Shares": [
        ("WS Keyridge Portfolio IV", 267.8),
        ("WS Keyridge DRM IV", 81.1),
        ("WS Keyridge Diversified Monthly Income", 101.3),
    ],
    "IA Mixed Investment 40-85% Shares": [
        ("WS Keyridge Portfolio V", 319.9),
        ("WS Keyridge Portfolio VI", 219.1),
        ("WS Keyridge DRM VI", 220.4),
    ],
    "IA Flexible Investment": [
        ("WS Keyridge Portfolio VII", 70.4),
    ],
    "IA Volatility Managed": [
        ("WS Keyridge DRM III", 121.5),
        ("WS Keyridge DRM IV", 81.1),
        ("WS Keyridge DRM VI", 220.4),
    ],
    "IA UK All Companies": [
        ("WS Keyridge UK Equity", 135.7),
    ],
    "IA UK Equity Income": [
        ("WS Keyridge UK Equity Income", 131.9),
    ],
    "IA Europe Excluding UK": [
        ("WS Keyridge European Fund", 57.1),
    ],
    "IA North America": [
        ("WS Keyridge North American", None),
    ],
    "IA Global": [
        ("WS Keyridge Global Equity", None),
    ],
    "IA Sterling Corporate Bond": [
        ("WS Keyridge Corporate Bond", None),
    ],
    "IA Global Mixed Bond": [
        ("WS Keyridge Global Macro Bond", None),
    ],
}

# Approximate Keyridge OCFs (from factsheet review; used only for summary comparison)
# These are based on WS Keyridge fund factsheet data already in the shared/ directory.
KEYRIDGE_OCF_ESTIMATE = 0.0075  # Generic placeholder; the md flags this as estimate.


def load_all():
    funds = []
    for p in sorted(PARTIALS.glob("batch_*.json")):
        with open(p) as f:
            funds.extend(json.load(f))
    return funds


def dedupe(funds):
    """Some funds (e.g. HSBC Global Strategy Balanced) appear in both
    Mixed Investment 40-85% and Volatility Managed batches. Keep both
    sector records — they are legitimately cross-sector competitors."""
    seen = set()
    out = []
    for f in funds:
        key = (f.get("fund_name", "").strip().lower(), f.get("ia_sector", ""))
        if key in seen:
            continue
        seen.add(key)
        out.append(f)
    return out


def write_json(funds):
    with open(OUT_JSON, "w") as f:
        json.dump(funds, f, indent=2, ensure_ascii=False)


def write_csv(funds):
    fieldnames = [
        "fund_name", "fund_manager", "isin", "ia_sector",
        "keyridge_competitor_to", "fund_size_gbp_m", "fund_size_date",
        "ocf", "risk_rating", "benchmark", "investment_objective",
        "ytd_performance_pct", "one_yr_performance_pct",
        "three_yr_performance_pct", "factsheet_url", "source_url",
        "collected_date",
    ]
    with open(OUT_CSV, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for rec in funds:
            row = {k: rec.get(k) for k in fieldnames}
            # Flatten list field for CSV
            if isinstance(row.get("keyridge_competitor_to"), list):
                row["keyridge_competitor_to"] = " | ".join(row["keyridge_competitor_to"])
            w.writerow(row)


def write_summary(funds):
    by_sector = defaultdict(list)
    for f in funds:
        by_sector[f["ia_sector"]].append(f)

    lines = []
    lines.append("# UC2 — Competitor Mandate Intelligence\n")
    lines.append("Sector-by-sector positioning for WS Keyridge funds against the largest third-party competitors in each IA sector. Data collected 2026-04-10 via Trustnet/Citywire/Morningstar search and fund manager sources. Fields left null where not verifiable from source.\n")
    lines.append(f"**Total competitor funds collected:** {len(funds)}\n")

    # Quality flags
    missing_perf = sum(1 for f in funds if f.get("one_yr_performance_pct") is None)
    missing_ocf = sum(1 for f in funds if f.get("ocf") is None)
    missing_aum = sum(1 for f in funds if f.get("fund_size_gbp_m") is None)
    lines.append(f"**Data quality:** {missing_aum}/{len(funds)} missing AUM, {missing_ocf}/{len(funds)} missing OCF, {missing_perf}/{len(funds)} missing 1yr performance. Follow-up enrichment pass recommended for performance data.\n")

    sector_order = list(KEYRIDGE_FUNDS.keys())

    for sector in sector_order:
        sector_funds = by_sector.get(sector, [])
        keyridge_in_sector = KEYRIDGE_FUNDS[sector]

        lines.append(f"\n## {sector}\n")

        # Keyridge funds
        kr_lines = []
        kr_aum_total = 0
        for name, aum in keyridge_in_sector:
            if aum is not None:
                kr_lines.append(f"{name} (£{aum}m)")
                kr_aum_total += aum
            else:
                kr_lines.append(f"{name} (AUM not disclosed)")
        lines.append(f"**Keyridge funds in sector:** {', '.join(kr_lines)}")
        lines.append(f"**Competitors collected:** {len(sector_funds)}\n")

        # Sort competitors by AUM desc (nulls last)
        sorted_funds = sorted(
            sector_funds,
            key=lambda f: (f.get("fund_size_gbp_m") is None, -(f.get("fund_size_gbp_m") or 0)),
        )

        # Table
        lines.append("| Fund | Manager | AUM (£m) | OCF | 1yr return |")
        lines.append("|------|---------|----------|-----|------------|")
        for f in sorted_funds:
            name = f.get("fund_name", "")[:50]
            mgr = f.get("fund_manager", "") or ""
            aum = f.get("fund_size_gbp_m")
            aum_str = f"{aum:,.0f}" if aum else "—"
            ocf = f.get("ocf")
            ocf_str = f"{ocf*100:.2f}%" if ocf else "—"
            perf = f.get("one_yr_performance_pct")
            perf_str = f"{perf:+.1f}%" if perf is not None else "—"
            lines.append(f"| {name} | {mgr} | {aum_str} | {ocf_str} | {perf_str} |")

        # AUM rank for Keyridge
        if kr_aum_total > 0:
            aums_sorted = sorted(
                [f.get("fund_size_gbp_m") or 0 for f in sector_funds],
                reverse=True,
            )
            # Use the largest Keyridge fund in the sector
            largest_kr_aum = max((a for _, a in keyridge_in_sector if a), default=0)
            rank = 1
            for a in aums_sorted:
                if a > largest_kr_aum:
                    rank += 1
            total = len(aums_sorted) + 1
            lines.append(f"\n**Keyridge AUM rank in sector:** largest Keyridge fund (£{largest_kr_aum}m) ranks #{rank} of {total} funds collected.")
        else:
            lines.append(f"\n**Keyridge AUM rank in sector:** Keyridge AUM not disclosed — rank cannot be calculated.")

        # OCF comparison
        ocfs = [f["ocf"] for f in sector_funds if f.get("ocf") is not None]
        if ocfs:
            avg_ocf = statistics.mean(ocfs)
            lines.append(f"**Sector competitor average OCF:** {avg_ocf*100:.2f}% (from {len(ocfs)} funds with disclosed OCF). Keyridge OCFs require factsheet cross-check.")
        else:
            lines.append(f"**Sector competitor average OCF:** not available — no OCFs captured in this batch.")

        # Observation
        obs = build_observation(sector, sector_funds, keyridge_in_sector)
        lines.append(f"**Key observation:** {obs}\n")

    return "\n".join(lines)


def build_observation(sector, funds, keyridge):
    if not funds:
        return "No competitor data collected — follow-up required."

    # Find dominant competitor
    sized = [f for f in funds if f.get("fund_size_gbp_m")]
    if sized:
        top = max(sized, key=lambda f: f["fund_size_gbp_m"])
        top_name = top["fund_name"]
        top_aum = top["fund_size_gbp_m"]
        top_mgr = top.get("fund_manager", "")

        kr_largest = max((a for _, a in keyridge if a), default=0)
        if kr_largest > 0:
            ratio = top_aum / kr_largest
            return f"{top_name} ({top_mgr}) dominates the sector at £{top_aum:,.0f}m — {ratio:.0f}x the largest Keyridge fund in this sector."
        return f"{top_name} ({top_mgr}) is the sector leader at £{top_aum:,.0f}m — Keyridge AUM in this sector is not disclosed for comparison."

    return f"{len(funds)} competitors identified but AUM data incomplete — enrichment pass needed."


def write_md(content):
    with open(OUT_MD, "w") as f:
        f.write(content)


def main():
    funds = load_all()
    funds = dedupe(funds)
    print(f"Loaded {len(funds)} unique sector-fund rows")

    write_json(funds)
    print(f"Wrote {OUT_JSON}")

    write_csv(funds)
    print(f"Wrote {OUT_CSV}")

    md = write_summary(funds)
    write_md(md)
    print(f"Wrote {OUT_MD}")


if __name__ == "__main__":
    main()
