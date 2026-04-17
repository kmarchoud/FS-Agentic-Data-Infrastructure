"use client";

import { TrendingUp, Percent, PoundSterling, Activity, ArrowUpRight } from "lucide-react";
import type { MarketDataPoint } from "@/lib/data/morning-brief-types";

type CardType = "ftse" | "gilt" | "sterling" | "volatility" | "topSector";

interface MarketCardProps {
  type: CardType;
  data: MarketDataPoint | null;
  // For topSector card:
  sectorName?: string;
  sectorFlow?: number;
  sectorMonth?: string;
}

const ICONS: Record<CardType, React.ElementType> = {
  ftse: TrendingUp,
  gilt: Percent,
  sterling: PoundSterling,
  volatility: Activity,
  topSector: ArrowUpRight,
};

const LABELS: Record<CardType, string> = {
  ftse: "FTSE ALL SHARE",
  gilt: "10YR GILT YIELD",
  sterling: "STERLING",
  volatility: "UK VOLATILITY",
  topSector: "TOP IA SECTOR",
};

function formatValue(type: CardType, data: MarketDataPoint | null): string {
  if (!data) return "—";
  switch (type) {
    case "ftse":
      return data.value.toLocaleString("en-GB", { maximumFractionDigits: 0 });
    case "gilt":
      return `${data.value.toFixed(2)}%`;
    case "sterling":
      return `$${data.value.toFixed(2)}`;
    case "volatility":
      return data.value.toFixed(1);
    default:
      return "—";
  }
}

function formatDelta(type: CardType, data: MarketDataPoint | null): { text: string; color: string; prefix: string } | null {
  if (!data) return null;
  const { delta, deltaPercent } = data;

  if (type === "gilt") {
    // Convert to basis points; rising yields = danger
    const bps = Math.round(delta * 100);
    const sign = bps >= 0 ? "+" : "";
    const color = bps > 0 ? "var(--danger-text)" : bps < 0 ? "var(--success-text)" : "var(--text-tertiary)";
    const prefix = bps > 0 ? "\u2191 " : bps < 0 ? "\u2193 " : "";
    return { text: `${sign}${bps}bps`, color, prefix };
  }

  if (type === "volatility") {
    const sign = delta >= 0 ? "+" : "";
    // Higher volatility = negative sentiment
    const color = delta > 0 ? "var(--danger-text)" : delta < 0 ? "var(--success-text)" : "var(--text-tertiary)";
    const prefix = delta > 0 ? "\u2191 " : delta < 0 ? "\u2193 " : "";
    return { text: `${sign}${delta.toFixed(1)}`, color, prefix };
  }

  // FTSE, Sterling
  const sign = delta >= 0 ? "+" : "";
  const color = delta > 0 ? "var(--success-text)" : delta < 0 ? "var(--danger-text)" : "var(--text-tertiary)";
  const prefix = delta > 0 ? "\u2191 " : delta < 0 ? "\u2193 " : "";
  return { text: `${sign}${delta.toFixed(1)} (${sign}${deltaPercent.toFixed(1)}%)`, color, prefix };
}

export function MarketCard({ type, data, sectorName, sectorFlow, sectorMonth }: MarketCardProps) {
  const Icon = ICONS[type];
  const label = LABELS[type];
  const isTopSector = type === "topSector";
  const highVol = type === "volatility" && data != null && data.value > 25;

  const deltaInfo = !isTopSector ? formatDelta(type, data) : null;

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "16px",
        borderTop: highVol ? "2px solid var(--warning)" : undefined,
        transition: "border-color 150ms ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        if (highVol) e.currentTarget.style.borderTopColor = "var(--warning)";
      }}
    >
      {/* Label row */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <Icon
          size={16}
          strokeWidth={1.5}
          style={{ color: isTopSector ? "var(--success-text)" : "var(--text-tertiary)" }}
        />
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: isTopSector ? "var(--success-text)" : "var(--text-tertiary)",
          }}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      {isTopSector ? (
        <>
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              marginTop: "8px",
            }}
          >
            {sectorName || "—"}
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-tertiary)",
              fontVariantNumeric: "tabular-nums",
              marginTop: "4px",
            }}
          >
            {sectorFlow != null
              ? `${sectorFlow >= 0 ? "+" : ""}£${Math.abs(sectorFlow)}m · ${sectorMonth || ""}`
              : ""}
          </div>
        </>
      ) : (
        <>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "24px",
              fontWeight: 600,
              color: data ? "var(--text-primary)" : "var(--text-disabled)",
              fontVariantNumeric: "tabular-nums",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              marginTop: "8px",
            }}
          >
            {type === "sterling" && data ? (
              <>
                <span style={{ color: "var(--text-tertiary)" }}>£1 = </span>
                {formatValue(type, data)}
              </>
            ) : (
              formatValue(type, data)
            )}
          </div>

          {/* Delta */}
          {deltaInfo ? (
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontVariantNumeric: "tabular-nums",
                color: deltaInfo.color,
                letterSpacing: "0.01em",
                lineHeight: 1.3,
                marginTop: "4px",
              }}
            >
              {deltaInfo.prefix}{deltaInfo.text}
            </div>
          ) : !data ? (
            <div
              style={{
                fontSize: "11px",
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
                marginTop: "4px",
              }}
            >
              Live prices unavailable
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
