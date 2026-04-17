"use client";

import type { MarketDataResponse, SectorFlow } from "@/lib/data/morning-brief-types";
import { MarketCard } from "./MarketCard";
import { SkeletonCard } from "./SkeletonCard";

interface MarketPulseProps {
  marketData: MarketDataResponse | null;
  sectorFlows: SectorFlow[];
  synthesisSentence: string | null;
  loading: boolean;
}

export function MarketPulse({ marketData, sectorFlows, synthesisSentence, loading }: MarketPulseProps) {
  // Find top sector by absolute flow (positive only, for "top inflow")
  const topSector = [...sectorFlows]
    .filter((f) => f.net_retail_sales_gbpm > 0)
    .sort((a, b) => b.net_retail_sales_gbpm - a.net_retail_sales_gbpm)[0];

  // Format month for display (e.g. "2025-01" -> "Jan 2025")
  const formatMonth = (m: string) => {
    try {
      const d = new Date(m + "-01");
      return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    } catch {
      return m;
    }
  };

  return (
    <div>
      {/* Synthesis sentence — hero position above cards */}
      <div
        style={{
          paddingBottom: "20px",
          borderBottom: "1px solid var(--border-subtle)",
          marginBottom: "16px",
        }}
      >
        {synthesisSentence ? (
          <p
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.5,
              letterSpacing: "-0.01em",
              maxWidth: "900px",
              margin: 0,
            }}
          >
            {synthesisSentence}
          </p>
        ) : (
          <div
            style={{
              height: "18px",
              width: "70%",
              background: "var(--bg-subtle)",
              borderRadius: "4px",
              animation: "skeleton-fade 1.5s ease-in-out infinite",
            }}
          />
        )}
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "16px",
        }}
      >
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
        ) : (
          <>
            <MarketCard type="ftse" data={marketData?.ftseAllShare ?? null} />
            <MarketCard type="gilt" data={marketData?.giltYield ?? null} />
            <MarketCard type="sterling" data={marketData?.sterling ?? null} />
            <MarketCard type="volatility" data={marketData?.volatility ?? null} />
            <MarketCard
              type="topSector"
              data={null}
              sectorName={topSector?.sector?.replace("IA ", "") || "\u2014"}
              sectorFlow={topSector?.net_retail_sales_gbpm}
              sectorMonth={topSector ? formatMonth(topSector.month) : ""}
            />
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 1023px) {
          div[style*="grid-template-columns: repeat(5"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 639px) {
          div[style*="grid-template-columns: repeat(5"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @keyframes skeleton-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
