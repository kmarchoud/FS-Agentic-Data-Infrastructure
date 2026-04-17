export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import type { MarketDataPoint, MarketDataResponse } from "@/lib/data/morning-brief-types";

const TICKERS: Record<string, string> = {
  ftseAllShare: "^FTAS",
  giltYield: "^TNX",
  sterling: "GBPUSD=X",
  volatility: "^VFTSE",
};

async function fetchInstrument(ticker: string): Promise<MarketDataPoint | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}?interval=1d&range=7d`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    const meta = result?.meta;
    if (!meta) return null;

    const value = meta.regularMarketPrice ?? 0;
    const previousClose = meta.chartPreviousClose ?? 0;
    const delta = value - previousClose;
    const deltaPercent = previousClose !== 0 ? (delta / previousClose) * 100 : 0;

    // Extract sparkline data from close prices and timestamps
    let sparklineData: Array<{ time: number; value: number }> | null = null;
    try {
      const closes: (number | null)[] = result?.indicators?.quote?.[0]?.close ?? [];
      const timestamps: number[] = result?.timestamp ?? [];
      if (closes.length > 0 && timestamps.length > 0) {
        const points: Array<{ time: number; value: number }> = [];
        for (let i = 0; i < Math.min(closes.length, timestamps.length); i++) {
          if (closes[i] != null) {
            points.push({ time: timestamps[i], value: closes[i] as number });
          }
        }
        if (points.length >= 2) {
          sparklineData = points;
        }
      }
    } catch {
      sparklineData = null;
    }

    return {
      value,
      previousClose,
      delta,
      deltaPercent,
      timestamp: new Date().toISOString(),
      sparklineData,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const [ftseAllShare, giltYield, sterling, volatility] = await Promise.all([
    fetchInstrument(TICKERS.ftseAllShare),
    fetchInstrument(TICKERS.giltYield),
    fetchInstrument(TICKERS.sterling),
    fetchInstrument(TICKERS.volatility),
  ]);

  const response: MarketDataResponse = {
    ftseAllShare,
    giltYield,
    sterling,
    volatility,
    fetchedAt: new Date().toISOString(),
  };

  return NextResponse.json(response);
}
