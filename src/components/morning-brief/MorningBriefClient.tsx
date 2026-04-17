"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import type {
  MarketDataResponse,
  NewsResponse,
  SynthesisResponse,
  SectorFlow,
  FundData,
} from "@/lib/data/morning-brief-types";
import type { RealIFAFirm } from "@/lib/data/ifa-real-data";
import { AmberProvider } from "@/lib/contexts/amber-context";
import { LoadingPhaseIndicator } from "./LoadingPhaseIndicator";
import { MarketPulse } from "./MarketPulse";
import { ImpactGrid } from "./ImpactGrid";
import { OutreachTable } from "./OutreachTable";
import { TalkingPoint } from "./TalkingPoint";

interface BriefRecord {
  firm_name: string;
  brief_who: string;
  brief_why: string;
  brief_opener: string;
  top_mandate: string;
  [key: string]: unknown;
}

interface StaticData {
  sectorFlows: SectorFlow[];
  funds: FundData[];
  rankedFirms: RealIFAFirm[];
  briefs: BriefRecord[];
}

type LoadingPhase = "market" | "news" | "synthesis" | "complete" | "error";

export function MorningBriefClient({ staticData }: { staticData: StaticData }) {
  const [marketData, setMarketData] = useState<MarketDataResponse | null>(null);
  const [news, setNews] = useState<NewsResponse | null>(null);
  const [synthesis, setSynthesis] = useState<SynthesisResponse | null>(null);
  const [loadingPhase, setLoadingPhase] = useState<LoadingPhase>("market");
  const [lastRefreshed, setLastRefreshed] = useState<string | null>(null);

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const fetchAll = useCallback(async () => {
    setLoadingPhase("market");
    setSynthesis(null);
    setMarketData(null);
    setNews(null);

    try {
      // Phase 1+2: Fetch market data and news in parallel
      const [marketRes, newsRes] = await Promise.all([
        fetch("/api/market-data").then((r) => r.json()) as Promise<MarketDataResponse>,
        fetch("/api/news").then((r) => r.json()) as Promise<NewsResponse>,
      ]);

      setMarketData(marketRes);
      setNews(newsRes);
      setLoadingPhase("synthesis");

      // Phase 3: Claude synthesis
      const synthRes = await fetch("/api/morning-synthesis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketData: marketRes,
          newsArticles: newsRes.articles.slice(0, 5),
          sectorFlows: [...staticData.sectorFlows]
            .sort((a, b) => Math.abs(b.net_retail_sales_gbpm) - Math.abs(a.net_retail_sales_gbpm))
            .slice(0, 6),
          funds: staticData.funds,
        }),
      }).then((r) => r.json()) as SynthesisResponse;

      setSynthesis(synthRes);
      setLoadingPhase("complete");
      setLastRefreshed(
        new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })
      );
    } catch (err) {
      console.error("Morning brief fetch error:", err);
      setLoadingPhase("error");
    }
  }, [staticData.sectorFlows, staticData.funds]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const isRefreshing = loadingPhase !== "complete" && loadingPhase !== "error";

  return (
    <AmberProvider>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Page header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <h1
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
                margin: 0,
              }}
            >
              Morning Brief
            </h1>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-tertiary)",
                marginTop: "4px",
                marginBottom: 0,
              }}
            >
              Distribution intelligence for {today}
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            {lastRefreshed && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                  fontVariantNumeric: "tabular-nums",
                  marginBottom: "8px",
                }}
              >
                Last updated {lastRefreshed}
              </div>
            )}
            <button
              onClick={fetchAll}
              disabled={isRefreshing}
              style={{
                background: "var(--bg-card)",
                color: isRefreshing ? "var(--text-tertiary)" : "var(--text-secondary)",
                fontSize: "13px",
                fontWeight: 500,
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                cursor: isRefreshing ? "not-allowed" : "pointer",
                opacity: isRefreshing ? 0.5 : 1,
                transition: "all 120ms ease",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
              onMouseEnter={(e) => {
                if (!isRefreshing) {
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                  e.currentTarget.style.color = "var(--text-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isRefreshing) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}
            >
              <RefreshCw
                size={14}
                strokeWidth={1.5}
                style={{
                  animation: isRefreshing ? "spin 1s linear infinite" : "none",
                }}
              />
              {isRefreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Content area */}
        <div style={{ padding: "24px" }}>
          <LoadingPhaseIndicator phase={loadingPhase} />

          <MarketPulse
            marketData={marketData}
            sectorFlows={staticData.sectorFlows}
            synthesisSentence={synthesis?.synthesis_sentence ?? null}
            loading={loadingPhase === "market"}
          />

          <ImpactGrid
            cards={synthesis?.impact_cards ?? []}
            loading={loadingPhase !== "complete" && loadingPhase !== "error"}
            sectorFlows={staticData.sectorFlows}
          />

          <OutreachTable
            rankedFirms={staticData.rankedFirms}
            briefs={staticData.briefs}
            impactCards={synthesis?.impact_cards ?? []}
            loading={loadingPhase !== "complete" && loadingPhase !== "error"}
          />

          <TalkingPoint
            talkingPoint={synthesis?.talking_point ?? null}
            newsCount={news?.articles?.length ?? 0}
            loading={loadingPhase !== "complete" && loadingPhase !== "error"}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </AmberProvider>
  );
}
