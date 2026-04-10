#!/usr/bin/env python3
"""
Generate pre-call intelligence briefs for the top 50 PRIMARY firms in
keyridge_ranked. Uses the local `claude` CLI (Max subscription) as the
LLM backend, model claude-opus-4-5.

Usage:
  python3 generate_briefs.py --sample       # Print rank 1 brief and stop
  python3 generate_briefs.py --run          # Run all 50 with checkpointing
"""

import argparse
import csv
import json
import re
import subprocess
import sys
import time
from pathlib import Path

BASE = Path(__file__).resolve().parent.parent
DATA = BASE / "data"
RANKED = DATA / "keyridge_ranked.jsonl"
OUT_JSON = DATA / "keyridge_briefs.json"
OUT_CSV = DATA / "keyridge_briefs.csv"
CHECKPOINT = DATA / "briefs.checkpoint"

MODEL = "claude-opus-4-5"
TOP_N = 50
RATE_LIMIT_SEC = 1.0

SYSTEM_PROMPT = """You are a distribution intelligence analyst for Keyridge Asset Management, a UK asset manager with £5.8bn AUM across 22 retail funds. The fund range includes:

Multi-asset: WS Keyridge Portfolio III-VII (risk profiles 3-7, IA Mixed Investment sectors), WS Keyridge DRM III-VI (Volatility Managed, risk profiles 3-6), WS Keyridge Diversified Monthly Income (income-focused multi-asset).

Equity: WS Keyridge UK Equity, WS Keyridge UK Equity Income, WS Keyridge European, WS Keyridge North American, WS Keyridge Global Equity.

Fixed income: WS Keyridge Corporate Bond, WS Keyridge Global Macro Bond, WS Keyridge Sterling Liquidity.

Funds are available on: Hargreaves Lansdown, Fidelity FundsNetwork, Interactive Investor, AJ Bell, Aviva, Charles Stanley, Bestinvest, and Quilter platforms.

Write concise pre-call briefs for relationship managers. Be specific. Never use phrases like strong track record, well-positioned, holistic approach, or comprehensive service. Use only data provided. If a field is missing say so briefly."""


def load_top_primary(n):
    """Load top-N PRIMARY firms from jsonl, sorted by priority_score desc."""
    firms = []
    with open(RANKED) as f:
        for line in f:
            rec = json.loads(line)
            if rec.get("restricted_network"):
                continue
            firms.append(rec)
    firms.sort(key=lambda r: r.get("priority_score", 0), reverse=True)
    return firms[:n]


def derive_specialisms(firm):
    specs = []
    if firm.get("pension_transfers"):
        specs.append("pension transfers")
    if firm.get("manages_investments"):
        specs.append("discretionary management")
    if firm.get("advises_on_investments"):
        specs.append("investment advice")
    if firm.get("retail_clients"):
        specs.append("retail clients")
    if firm.get("professional_clients"):
        specs.append("professional clients")
    cities = firm.get("cities") or []
    if len(cities) >= 10:
        specs.append(f"national footprint ({len(cities)} cities)")
    elif len(cities) >= 3:
        specs.append(f"multi-regional ({len(cities)} cities)")
    return specs or ["not specified"]


def build_user_prompt(firm, rank):
    name = firm.get("firm_name", "")
    town = firm.get("city", "") or "unknown"
    postcode = firm.get("postcode", "") or "unknown"
    adviser_count = firm.get("adviser_count_vf") or firm.get("individual_count") or "unknown"
    review_count = firm.get("total_reviews", 0)
    top_rated = firm.get("top_rated_advisers", 0)
    if review_count and adviser_count and isinstance(adviser_count, int) and adviser_count > 0:
        rating_note = f"{review_count} reviews, {top_rated} top-rated advisers"
    else:
        rating_note = "no VouchedFor reviews"
    specialisms = ", ".join(derive_specialisms(firm))
    pt = "yes" if firm.get("pension_transfers") else "no"
    mi = "yes" if firm.get("manages_investments") else "no"
    pimfa = "unknown (not in dataset)"
    priority = firm.get("priority_score", 0)
    top_mandate = firm.get("top_mandate_category", "multi_asset_cautious")

    return f"""Write a pre-call brief for a Keyridge relationship manager calling this IFA firm for the first time.

FIRM DATA:
Name: {name}
Location: {town}, {postcode}
Adviser count: {adviser_count}
VouchedFor reviews: {rating_note}
Specialisms: {specialisms}
Pension transfers authorised: {pt}
Manages investments: {mi}
PIMFA member: {pimfa}
Priority score: {priority}/100
Best mandate fit: {top_mandate}

Write exactly three short paragraphs with these labels:

WHO THEY ARE
One sentence on firm size and what clients they serve, inferred from adviser count, location, and specialisms.

WHY KEYRIDGE FITS
One sentence naming specific Keyridge funds that match their client base. Must reference actual fund names from the Keyridge range. Connect the fund to their specialisms.

OPENING LINE
One sentence the RM says in the first 30 seconds of the call. Must be specific to this firm. Do not start with I noticed or I came across or I wanted to reach out."""


def call_claude(user_prompt):
    """Call the claude CLI and return the text output."""
    result = subprocess.run(
        [
            "claude",
            "-p",
            user_prompt,
            "--model",
            MODEL,
            "--append-system-prompt",
            SYSTEM_PROMPT,
        ],
        capture_output=True,
        text=True,
        timeout=180,
    )
    if result.returncode != 0:
        raise RuntimeError(f"claude CLI failed: {result.stderr[:500]}")
    return result.stdout.strip()


def parse_brief(text):
    """Extract WHO/WHY/OPENING sections from the model output."""
    # Normalise line endings and strip markdown bold markers around labels
    t = text.replace("\r\n", "\n").strip()
    # Remove ** around section labels (and any stray ** in headings)
    t = re.sub(r"\*{2,}", "", t)

    def grab(label, next_labels):
        # Match label, optional colon, newline, then content until next label
        pattern = rf"{label}\s*:?\s*\n(.*?)(?=\n\s*(?:{'|'.join(next_labels)})\s*:?\s*(?:\n|$)|\Z)"
        m = re.search(pattern, t, re.DOTALL | re.IGNORECASE)
        if not m:
            return ""
        return m.group(1).strip().strip('"').strip()

    who = grab("WHO THEY ARE", ["WHY KEYRIDGE FITS", "OPENING LINE"])
    why = grab("WHY KEYRIDGE FITS", ["OPENING LINE", "WHO THEY ARE"])
    opener = grab("OPENING LINE", ["WHO THEY ARE", "WHY KEYRIDGE FITS"])
    # Trim opener at the first blank line or divider (drops any trailing footer)
    opener = re.split(r"\n\s*\n|\n---+|\n\*", opener, maxsplit=1)[0].strip()
    opener = opener.strip('"').strip("'").strip()
    return who, why, opener


def make_record(firm, rank, who, why, opener):
    review_count = firm.get("total_reviews", 0)
    top_rated = firm.get("top_rated_advisers", 0)
    rating = None
    if review_count and top_rated:
        # VouchedFor doesn't give avg rating in our data; use top_rated ratio
        rating = None
    return {
        "rank": rank,
        "firm_name": firm.get("firm_name", ""),
        "frn": firm.get("frn", ""),
        "priority_score": firm.get("priority_score", 0),
        "town": firm.get("city", ""),
        "postcode": firm.get("postcode", ""),
        "adviser_count": firm.get("adviser_count_vf") or firm.get("individual_count") or 0,
        "review_count": review_count,
        "top_rated_advisers": top_rated,
        "rating": rating,
        "specialisms": derive_specialisms(firm),
        "pension_transfers": bool(firm.get("pension_transfers")),
        "manages_investments": bool(firm.get("manages_investments")),
        "top_mandate": firm.get("top_mandate_category", ""),
        "brief_who": who,
        "brief_why": why,
        "brief_opener": opener,
    }


def load_checkpoint():
    if not CHECKPOINT.exists():
        return []
    with open(CHECKPOINT) as f:
        return [json.loads(line) for line in f if line.strip()]


def save_checkpoint(records):
    with open(CHECKPOINT, "w") as f:
        for rec in records:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")


def write_outputs(records):
    with open(OUT_JSON, "w") as f:
        json.dump(records, f, indent=2, ensure_ascii=False)
    fieldnames = [
        "rank",
        "firm_name",
        "priority_score",
        "town",
        "adviser_count",
        "top_mandate",
        "brief_who",
        "brief_why",
        "brief_opener",
    ]
    with open(OUT_CSV, "w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames, extrasaction="ignore")
        w.writeheader()
        for rec in records:
            w.writerow(rec)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--sample", action="store_true", help="Print rank 1 only")
    parser.add_argument("--run", action="store_true", help="Run all 50")
    args = parser.parse_args()

    firms = load_top_primary(TOP_N)
    print(f"Loaded {len(firms)} firms (top {TOP_N} PRIMARY by priority_score)")

    if args.sample:
        firm = firms[0]
        print(f"\n=== Rank 1: {firm['firm_name']} (score {firm['priority_score']}) ===\n")
        prompt = build_user_prompt(firm, 1)
        print("--- PROMPT ---")
        print(prompt)
        print("\n--- CALLING CLAUDE ---\n")
        text = call_claude(prompt)
        print(text)
        print("\n--- PARSED ---")
        who, why, opener = parse_brief(text)
        print(f"WHO:    {who}")
        print(f"WHY:    {why}")
        print(f"OPENER: {opener}")
        return

    if not args.run:
        print("Pass --sample or --run")
        sys.exit(1)

    existing = load_checkpoint()
    done_ranks = {r["rank"] for r in existing}
    print(f"Checkpoint: {len(existing)} firms already done (ranks: {sorted(done_ranks)[:10]}...)")

    records = list(existing)

    for i, firm in enumerate(firms):
        rank = i + 1
        if rank in done_ranks:
            continue
        frn = firm.get("frn") or ""

        print(f"[{rank}/{TOP_N}] {firm['firm_name']} (FRN {frn or 'none'})...", flush=True)

        prompt = build_user_prompt(firm, rank)
        try:
            text = call_claude(prompt)
            who, why, opener = parse_brief(text)
            if not who or not why or not opener:
                print(f"  WARNING: incomplete parse, saving raw fallback")
            rec = make_record(firm, rank, who, why, opener)
            rec["_raw"] = text
            records.append(rec)
        except Exception as e:
            print(f"  ERROR: {e}")
            continue

        # Checkpoint every 10
        if len(records) % 10 == 0:
            save_checkpoint(records)
            print(f"  [checkpoint: {len(records)} saved]")

        time.sleep(RATE_LIMIT_SEC)

    # Final sort and dedupe by rank (unique per firm in this batch)
    seen = set()
    final = []
    for rec in sorted(records, key=lambda r: r["rank"]):
        if rec["rank"] in seen:
            continue
        seen.add(rec["rank"])
        final.append(rec)

    save_checkpoint(final)
    write_outputs(final)
    print(f"\nDONE. {len(final)} briefs written to:")
    print(f"  {OUT_JSON}")
    print(f"  {OUT_CSV}")


if __name__ == "__main__":
    main()
