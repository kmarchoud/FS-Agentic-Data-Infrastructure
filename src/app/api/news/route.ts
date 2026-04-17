export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { NewsArticle, NewsResponse } from "@/lib/data/morning-brief-types";

const GNEWS_BASE = "https://gnews.io/api/v4/search";

const QUERIES = [
  "UK funds OR gilt yields OR Bank of England OR inflation",
  "IFA market OR financial adviser OR OEIC OR unit trust",
  "FTSE OR UK economy OR interest rates OR CPI",
];

async function fetchGNews(apiKey: string): Promise<NewsArticle[]> {
  const results = await Promise.all(
    QUERIES.map(async (q) => {
      try {
        const params = new URLSearchParams({
          q,
          lang: "en",
          country: "gb",
          max: "5",
          sortby: "publishedAt",
          apikey: apiKey,
        });
        const res = await fetch(`${GNEWS_BASE}?${params}`, {
          signal: AbortSignal.timeout(8000),
        });
        if (!res.ok) return [];
        const data = await res.json();
        return (data.articles || []).map((a: Record<string, unknown>) => ({
          title: String(a.title || ""),
          source: (a.source as Record<string, string>)?.name || "Unknown",
          publishedAt: String(a.publishedAt || new Date().toISOString()),
          description: String(a.description || "").slice(0, 200),
          url: String(a.url || ""),
        }));
      } catch {
        return [];
      }
    })
  );

  // Deduplicate by URL
  const seen = new Set<string>();
  const deduped: NewsArticle[] = [];
  for (const articles of results) {
    for (const article of articles as NewsArticle[]) {
      if (!seen.has(article.url)) {
        seen.add(article.url);
        deduped.push(article);
      }
    }
  }

  // Sort by publishedAt descending, take top 8
  deduped.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  return deduped.slice(0, 8);
}

async function readFallback(): Promise<NewsArticle[]> {
  try {
    const filePath = path.join(process.cwd(), "src/lib/data/raw/macro_signals.jsonl");
    const content = await fs.readFile(filePath, "utf-8");
    const lines = content.trim().split("\n");
    return lines.slice(0, 8).map((line) => {
      const obj = JSON.parse(line);
      return {
        title: obj.title || "",
        source: obj.source || "Archive",
        publishedAt: obj.published_date || new Date().toISOString(),
        description: (obj.summary || "").slice(0, 200),
        url: obj.url || "",
      };
    });
  } catch {
    return [];
  }
}

export async function GET() {
  const apiKey = process.env.GNEWS_API_KEY;
  let articles: NewsArticle[] = [];
  let usingFallback = false;

  if (apiKey) {
    articles = await fetchGNews(apiKey);
  }

  if (articles.length === 0) {
    articles = await readFallback();
    usingFallback = true;
  }

  const response: NewsResponse = {
    articles,
    usingFallback,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
