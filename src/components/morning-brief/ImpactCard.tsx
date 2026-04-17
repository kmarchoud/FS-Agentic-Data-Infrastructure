"use client";

import type { ImpactCard as ImpactCardType } from "@/lib/data/morning-brief-types";
import { TalkingAngle } from "./TalkingAngle";

interface ImpactCardProps {
  card: ImpactCardType;
  isHighestSentiment: boolean;
  onFocusAngle: () => void;
}

const MANDATE_DISPLAY: Record<string, string> = {
  multi_asset_cautious: "Multi-Asset Cautious",
  multi_asset_balanced: "Multi-Asset Balanced",
  multi_asset_growth: "Multi-Asset Growth",
  multi_asset_aggressive: "Multi-Asset Aggressive",
  multi_asset_income: "Multi-Asset Income",
  uk_equity_income: "UK Equity Income",
  uk_equity: "UK Equity",
  global_equity: "Global Equity",
  european_equity: "European Equity",
  north_american_equity: "North American Equity",
  corporate_bond: "Corporate Bond",
  global_macro_bond: "Global Macro Bond",
  money_market: "Money Market",
};

function SentimentBadge({ sentiment }: { sentiment: "positive" | "neutral" | "negative" }) {
  const config = {
    positive: {
      bg: "var(--success-subtle)",
      border: "rgba(34,197,94,0.20)",
      color: "var(--success-text)",
      label: "\u2191 Favourable",
    },
    neutral: {
      bg: "var(--bg-subtle)",
      border: "var(--border)",
      color: "var(--text-secondary)",
      label: "\u2192 Neutral",
    },
    negative: {
      bg: "var(--danger-subtle)",
      border: "rgba(239,68,68,0.20)",
      color: "var(--danger-text)",
      label: "\u2193 Headwind",
    },
  }[sentiment];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: "11px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        padding: "2px 8px",
        borderRadius: "9999px",
        whiteSpace: "nowrap",
      }}
    >
      {config.label}
    </span>
  );
}

export function ImpactCard({ card, isHighestSentiment, onFocusAngle }: ImpactCardProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "20px",
        transition: "border-color 150ms ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--border-strong)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
      }}
    >
      {/* Header row 1 */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
          {MANDATE_DISPLAY[card.mandate_category] || card.mandate_category}
        </span>
        <SentimentBadge sentiment={card.sentiment} />
      </div>

      {/* Header row 2 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "4px",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-tertiary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {card.fund_names.join(", ")}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-tertiary)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {card.ia_sector}
        </span>
      </div>

      {/* Divider */}
      <div style={{ borderBottom: "1px solid var(--border-subtle)", margin: "12px 0" }} />

      {/* Card body */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* What happened */}
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-tertiary)",
              marginBottom: "4px",
            }}
          >
            WHAT HAPPENED
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {card.what_happened}
          </div>
        </div>

        {/* Why it matters */}
        <div>
          <div
            style={{
              fontSize: "11px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-tertiary)",
              marginBottom: "4px",
            }}
          >
            WHY IT MATTERS
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
            {card.why_it_matters}
          </div>
        </div>

        {/* Talking angle */}
        <TalkingAngle
          text={card.talking_angle}
          isHighestSentiment={isHighestSentiment}
          onFocus={onFocusAngle}
        />
      </div>
    </div>
  );
}
