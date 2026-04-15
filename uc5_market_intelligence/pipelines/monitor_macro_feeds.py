"""
Monitor macro news RSS feeds and append new articles to macro_signals.jsonl.

Fetches from 6 UK financial / economic RSS feeds, extracts article metadata,
applies relevance tags via keyword matching, and appends only new articles
(deduplicated by URL, filtered by date) to the JSONL store.

Requirements:
    pip install feedparser

Usage:
    python uc5_market_intelligence/pipelines/monitor_macro_feeds.py
"""

import html
import json
import re
import sys
from datetime import datetime, timedelta, timezone
from pathlib import Path
from time import struct_time

try:
    import feedparser
except ImportError:
    sys.exit(
        "feedparser is required.  Install with:\n"
        "  pip install feedparser"
    )

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------
SCRIPT_DIR = Path(__file__).resolve().parent
DATA_PATH = SCRIPT_DIR.parent / "data" / "macro_feeds" / "macro_signals.jsonl"

# ---------------------------------------------------------------------------
# Feed sources
# ---------------------------------------------------------------------------
FEEDS = {
    "FT Adviser": "https://www.ftadviser.com/rss",
    "Citywire": "https://citywire.com/rss",
    "Investment Week": "https://www.investmentweek.co.uk/feed",
    "Money Marketing": "https://www.moneymarketing.co.uk/feed",
    "Bank of England": "https://www.bankofengland.co.uk/rss/",
    "ONS": "https://www.ons.gov.uk/rss/",
}

# ---------------------------------------------------------------------------
# Relevance tags  (tag -> lowercased keyword list)
# ---------------------------------------------------------------------------
TAG_KEYWORDS: dict[str, list[str]] = {
    "multi_asset": [
        "interest rate", "inflation", "gilt", "boe", "bank of england",
        "monetary policy", "economic outlook", "gdp", "recession", "budget",
        "cpi", "rpi", "fixed income", "bond market", "yield curve",
    ],
    "uk_equity": [
        "ftse", "uk stocks", "uk equity", "uk market", "british companies",
        "london stock exchange", "uk economy", "uk gdp",
    ],
    "global_equity": [
        "s&p 500", "wall street", "global equity", "us market", "tech stocks",
        "nasdaq", "global markets", "federal reserve", "us interest rates",
        "us economy",
    ],
    "fixed_income": [
        "bond yields", "credit spreads", "corporate bonds", "gilt yields",
        "duration", "fixed income", "high yield", "investment grade",
        "credit markets",
    ],
    "property": [
        "property market", "real estate", "reit", "house prices",
        "commercial property", "residential property",
    ],
}


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def strip_html(text: str) -> str:
    """Remove HTML tags and unescape HTML entities."""
    text = re.sub(r"<[^>]+>", "", text)
    return html.unescape(text).strip()


def parse_published_date(entry) -> str | None:
    """Return ISO date string (YYYY-MM-DD) from a feed entry, or None."""
    for attr in ("published_parsed", "updated_parsed"):
        val: struct_time | None = getattr(entry, attr, None)
        if val:
            try:
                return datetime(*val[:6], tzinfo=timezone.utc).strftime("%Y-%m-%d")
            except (ValueError, TypeError):
                continue
    # Fallback: try parsing the raw string
    for attr in ("published", "updated"):
        raw = getattr(entry, attr, None)
        if raw:
            for fmt in ("%a, %d %b %Y %H:%M:%S %z", "%Y-%m-%dT%H:%M:%S%z"):
                try:
                    return datetime.strptime(raw, fmt).strftime("%Y-%m-%d")
                except ValueError:
                    continue
    return None


def extract_summary(entry) -> str:
    """Return first 300 chars of the entry description, HTML-stripped."""
    raw = getattr(entry, "summary", "") or getattr(entry, "description", "") or ""
    clean = strip_html(raw)
    return clean[:300]


def tag_article(title: str, summary: str) -> list[str]:
    """Return relevance tags based on keyword matching against title + summary."""
    blob = f"{title} {summary}".lower()
    tags = [
        tag
        for tag, keywords in TAG_KEYWORDS.items()
        if any(kw in blob for kw in keywords)
    ]
    return tags if tags else ["general"]


def load_existing() -> tuple[set[str], str | None]:
    """
    Load existing JSONL file.
    Returns (set of known URLs, most recent published_date or None).
    """
    known_urls: set[str] = set()
    latest_date: str | None = None

    if not DATA_PATH.exists():
        return known_urls, latest_date

    with open(DATA_PATH, "r", encoding="utf-8") as fh:
        for line in fh:
            line = line.strip()
            if not line:
                continue
            try:
                rec = json.loads(line)
            except json.JSONDecodeError:
                continue
            url = rec.get("url")
            if url:
                known_urls.add(url)
            pub = rec.get("published_date")
            if pub and (latest_date is None or pub > latest_date):
                latest_date = pub

    return known_urls, latest_date


def fetch_feed(name: str, url: str) -> list[dict]:
    """Parse a single RSS feed and return a list of article dicts."""
    articles: list[dict] = []
    feed = feedparser.parse(url)

    if feed.bozo and not feed.entries:
        print(f"  [WARN] {name}: feed error — {feed.bozo_exception}")
        return articles

    if feed.bozo:
        print(f"  [WARN] {name}: feed parsed with errors — {feed.bozo_exception}")

    for entry in feed.entries:
        pub_date = parse_published_date(entry)
        if not pub_date:
            continue

        title = strip_html(getattr(entry, "title", "") or "")
        link = getattr(entry, "link", "") or ""
        summary = extract_summary(entry)

        if not title or not link:
            continue

        articles.append({
            "title": title,
            "source": name,
            "published_date": pub_date,
            "url": link,
            "summary": summary,
            "tags": tag_article(title, summary),
        })

    return articles


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    print("Loading existing data...")
    known_urls, latest_date = load_existing()

    if latest_date:
        cutoff = latest_date
        print(f"  Most recent article: {latest_date} — fetching newer only.")
    else:
        cutoff = (datetime.now(timezone.utc) - timedelta(days=30)).strftime("%Y-%m-%d")
        print(f"  No existing data. Keeping articles from last 30 days (>= {cutoff}).")

    # Fetch all feeds
    all_new: list[dict] = []
    failed_feeds: list[str] = []

    print("\nFetching feeds...")
    for name, url in FEEDS.items():
        print(f"  {name}...")
        try:
            articles = fetch_feed(name, url)
        except Exception as exc:
            print(f"  [ERROR] {name}: {exc}")
            failed_feeds.append(name)
            continue

        # Filter by date and deduplicate
        for art in articles:
            if art["published_date"] <= cutoff:
                continue
            if art["url"] in known_urls:
                continue
            known_urls.add(art["url"])
            all_new.append(art)

    # Append to file
    if all_new:
        DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
        with open(DATA_PATH, "a", encoding="utf-8") as fh:
            for art in sorted(all_new, key=lambda a: a["published_date"]):
                fh.write(json.dumps(art, ensure_ascii=False) + "\n")

    # Summary
    print(f"\n{'=' * 50}")
    print(f"{len(all_new)} new articles added.")

    if all_new:
        tag_counts: dict[str, int] = {}
        for art in all_new:
            for tag in art["tags"]:
                tag_counts[tag] = tag_counts.get(tag, 0) + 1
        for tag, count in sorted(tag_counts.items(), key=lambda x: -x[1]):
            print(f"  {tag}: {count}")

    if failed_feeds:
        print(f"\nFailed feeds: {', '.join(failed_feeds)}")


if __name__ == "__main__":
    main()
