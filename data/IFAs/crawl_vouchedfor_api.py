#!/usr/bin/env python3
"""
VouchedFor API Crawler — uses discovered public API endpoint
to pull all advisers per city in a single request.

API: https://api.vouchedfor.co.uk/v2/public/stats-full
Returns up to 2000 advisers per location with rich data.

Usage:
  python3 crawl_vouchedfor_api.py --test    # 5 cities
  python3 crawl_vouchedfor_api.py --full    # All cities
"""

import json
import subprocess
import sys
import time
import argparse
from datetime import datetime
from pathlib import Path
from collections import defaultdict

BASE_DIR = Path(__file__).resolve().parent
RAW_DIR = BASE_DIR / "raw"
LOG_DIR = BASE_DIR / "logs"
OUTPUT_ADVISERS = RAW_DIR / "vouchedfor_api_advisers.jsonl"
OUTPUT_FIRMS = RAW_DIR / "vouchedfor_api_firms.jsonl"
OUTPUT_SUMMARY = RAW_DIR / "vouchedfor_api_summary.md"
LOG_FILE = LOG_DIR / "vouchedfor_api.log"

API_BASE = "https://api.vouchedfor.co.uk/v2/public/stats-full"

UK_CITIES = [
    "london", "birmingham", "manchester", "leeds", "glasgow",
    "liverpool", "edinburgh", "bristol", "cardiff", "sheffield",
    "newcastle", "nottingham", "leicester", "coventry", "belfast",
    "southampton", "portsmouth", "brighton", "reading", "wolverhampton",
    "plymouth", "derby", "stoke-on-trent", "hull", "sunderland",
    "preston", "blackpool", "bournemouth", "luton", "oxford",
    "cambridge", "norwich", "ipswich", "exeter", "chelmsford",
    "bath", "york", "chester", "lincoln", "gloucester",
    "worcester", "canterbury", "chichester", "carlisle", "durham",
    "guildford", "maidstone", "swindon", "basingstoke", "woking",
    "crawley", "eastbourne", "tunbridge-wells", "epsom", "croydon",
    "bromley", "kingston-upon-thames", "richmond", "wimbledon",
    "ealing", "harrow", "enfield", "barnet", "romford",
    "greenwich", "wandsworth", "hammersmith", "kensington",
    "westminster", "islington", "camden", "hackney",
    "stockport", "bolton", "wigan", "oldham", "rochdale",
    "bury", "salford", "warrington", "crewe", "macclesfield",
    "halifax", "huddersfield", "bradford", "wakefield", "doncaster",
    "rotherham", "barnsley", "harrogate", "scarborough", "middlesbrough",
    "darlington", "stockton-on-tees",
    "solihull", "walsall", "dudley", "sutton-coldfield",
    "tamworth", "stafford", "telford", "shrewsbury",
    "hereford", "northampton", "kettering",
    "peterborough", "bedford", "milton-keynes", "aylesbury",
    "high-wycombe", "banbury", "stratford-upon-avon",
    "leamington-spa", "rugby", "nuneaton",
    "salisbury", "poole", "taunton", "yeovil", "torquay",
    "barnstaple", "truro", "falmouth", "penzance",
    "cheltenham", "cirencester",
    "southend-on-sea", "harlow",
    "bury-st-edmunds", "kings-lynn",
    "aberdeen", "dundee", "inverness", "stirling", "perth",
    "falkirk", "kilmarnock", "ayr", "dumfries", "paisley",
    "swansea", "newport", "wrexham", "bangor", "aberystwyth",
    "carmarthen", "bridgend", "pontypridd",
    "derry", "lisburn", "newry",
]


def log(msg):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"{timestamp} {msg}"
    print(line, flush=True)
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")


def fetch_city(city, search_range=30, limit=2000):
    """Fetch all advisers for a city via the VouchedFor API."""
    url = (
        f"{API_BASE}?"
        f"include_travel_professionals=1"
        f"&is_contactable=1"
        f"&location={city}"
        f"&search_range={search_range}"
        f"&vertical_id=5"
        f"&limit={limit}"
        f"&sort_by=sigmoid"
    )

    try:
        result = subprocess.run(
            ["curl", "-s", "--max-time", "30", url],
            capture_output=True, text=True, timeout=35,
        )
        if result.returncode == 0 and result.stdout.strip():
            data = json.loads(result.stdout)
            return data.get("data", [])
    except Exception as e:
        log(f"  Error: {e}")

    return []


def main():
    parser = argparse.ArgumentParser(description="VouchedFor API Crawler")
    parser.add_argument("--test", action="store_true", help="5 cities only")
    parser.add_argument("--full", action="store_true", help="All cities")
    args = parser.parse_args()

    RAW_DIR.mkdir(parents=True, exist_ok=True)
    LOG_DIR.mkdir(parents=True, exist_ok=True)

    cities = UK_CITIES[:5] if args.test else UK_CITIES

    log(f"VouchedFor API Crawler — {len(cities)} cities")
    log(f"API: {API_BASE}")

    # Collect all advisers, deduplicate by ID
    all_advisers = {}  # id -> adviser data
    city_counts = {}

    for i, city in enumerate(cities):
        log(f"[{i+1}/{len(cities)}] {city}...")
        time.sleep(2)  # Rate limit

        advisers = fetch_city(city) or []
        new_count = 0

        for adv in advisers:
            aid = str(adv.get("id", ""))
            if aid and aid not in all_advisers:
                # Extract clean record
                permalink = adv.get("permalink", {})
                record = {
                    "adviser_id": aid,
                    "first_name": adv.get("first_name", ""),
                    "last_name": adv.get("last_name", ""),
                    "firm_name": adv.get("firm_name", ""),
                    "firm_id": adv.get("firm_id"),
                    "phone": adv.get("phone_number", ""),
                    "city": permalink.get("city", city.title()),
                    "town": permalink.get("town", ""),
                    "profile_url": f"https://www.vouchedfor.co.uk/{permalink.get('url', '')}",
                    "adviser_type": adv.get("type", ""),
                    "review_count": adv.get("review_count", 0),
                    "review_avg_score": adv.get("review_average_score"),
                    "is_top_rated": adv.get("is_top_rated", False),
                    "is_contactable": adv.get("is_contactable", False),
                    "verified_since": adv.get("verified_since", ""),
                    "about": (adv.get("about") or "")[:300],
                    "source": "vouchedfor_api",
                    "scraped_at": datetime.now().strftime("%Y-%m-%d"),
                }
                all_advisers[aid] = record
                new_count += 1

        city_counts[city] = {"total_returned": len(advisers), "new_unique": new_count}
        log(f"  {len(advisers)} returned, {new_count} new (cumulative: {len(all_advisers)})")

    # Write all advisers
    if OUTPUT_ADVISERS.exists():
        OUTPUT_ADVISERS.unlink()
    for adv in all_advisers.values():
        with open(OUTPUT_ADVISERS, "a") as f:
            f.write(json.dumps(adv, ensure_ascii=False) + "\n")

    log(f"Total unique advisers: {len(all_advisers)}")

    # Aggregate to firm level
    firms = defaultdict(lambda: {
        "firm_name": "", "firm_id": None, "adviser_count": 0,
        "advisers": [], "cities": set(), "towns": set(),
        "phones": set(), "types": set(), "top_rated_count": 0,
        "total_reviews": 0,
    })

    for adv in all_advisers.values():
        fn = adv["firm_name"].strip()
        if not fn:
            continue
        fid = adv.get("firm_id") or fn.lower()
        firm = firms[fid]
        firm["firm_name"] = fn
        firm["firm_id"] = adv.get("firm_id")
        firm["adviser_count"] += 1
        firm["advisers"].append(f"{adv['first_name']} {adv['last_name']}".strip())
        if adv.get("city"):
            firm["cities"].add(adv["city"])
        if adv.get("town"):
            firm["towns"].add(adv["town"])
        if adv.get("phone"):
            firm["phones"].add(adv["phone"])
        if adv.get("adviser_type"):
            firm["types"].add(adv["adviser_type"])
        if adv.get("is_top_rated"):
            firm["top_rated_count"] += 1
        firm["total_reviews"] += adv.get("review_count", 0)

    # Write firms
    if OUTPUT_FIRMS.exists():
        OUTPUT_FIRMS.unlink()
    sorted_firms = sorted(firms.values(), key=lambda f: f["adviser_count"], reverse=True)
    for firm in sorted_firms:
        firm_record = {
            "firm_name": firm["firm_name"],
            "firm_id": firm["firm_id"],
            "adviser_count": firm["adviser_count"],
            "advisers": firm["advisers"][:50],
            "cities": sorted(firm["cities"]),
            "towns": sorted(firm["towns"])[:20],
            "phone": next(iter(firm["phones"]), None),
            "adviser_types": sorted(firm["types"]),
            "top_rated_advisers": firm["top_rated_count"],
            "total_reviews": firm["total_reviews"],
            "source": "vouchedfor_api",
        }
        with open(OUTPUT_FIRMS, "a") as f:
            f.write(json.dumps(firm_record, ensure_ascii=False) + "\n")

    log(f"Total unique firms: {len(sorted_firms)}")

    # Write summary
    with open(OUTPUT_SUMMARY, "w") as f:
        f.write(f"# VouchedFor API Crawl Summary\n\n")
        f.write(f"**Date:** {datetime.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"**Cities searched:** {len(cities)}\n")
        f.write(f"**Total unique advisers:** {len(all_advisers)}\n")
        f.write(f"**Total unique firms:** {len(sorted_firms)}\n\n")
        f.write(f"## Top 30 Firms by Adviser Count\n\n")
        f.write(f"| Rank | Firm | Advisers | Reviews | Top Rated | Cities |\n")
        f.write(f"|------|------|----------|---------|-----------|--------|\n")
        for i, firm in enumerate(sorted_firms[:30]):
            cities_str = ", ".join(sorted(firm["cities"])[:3])
            f.write(f"| {i+1} | {firm['firm_name'][:40]} | {firm['adviser_count']} | {firm['total_reviews']} | {firm['top_rated_count']} | {cities_str} |\n")

    log(f"Summary written to {OUTPUT_SUMMARY}")
    log("COMPLETE")


if __name__ == "__main__":
    main()
