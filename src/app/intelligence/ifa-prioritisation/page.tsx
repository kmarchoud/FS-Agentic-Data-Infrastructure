"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CircleDot,
  Clock,
  Lock,
  Database,
  X,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { TopBar } from "@/components/dashboard/topbar";
import { realIFARankings, UNIVERSE_TOTAL } from "@/lib/data/ifa-real-data";

// ── Types ─────────────────────────────────────────────────────────────────────

type FirmType = "DA Firm" | "AR Firm" | "Network";
type LayerState = "live" | "building" | "licensed";

interface SignalItem {
  date: string;
  source: "FCA" | "CH" | "Web" | "Press";
  description: string;
}

interface ScoreBreakdown {
  firmScale: number;         // max 30
  distributionMatch: number; // max 25
  regulatoryFit: number;     // max 20
  fundFit: number;           // max 15
  marketTiming: number;      // max 10
}

interface IFARanking {
  id: string;
  rank: number;
  firm: string;
  firmType: FirmType;
  region: string;
  fitScore: number;
  keySignal: string;
  fcaNumber: string;
  registrationDate: string;
  permissions: string;
  keyIndividuals: string[];
  officeAddress: string;
  companiesHouseNumber: string;
  signals: SignalItem[];
  scoreBreakdown: ScoreBreakdown;
  review_count: number | null;
  adviser_count: number | null;
  signal_count: number;
  active_mandate: string;
  brief_available: boolean;
  brief_who: string | null;
  brief_why: string | null;
  brief_opener: string | null;
}

// ── Mandate constants ────────────────────────────────────────────────────────

const MANDATE_LABELS: Record<string, string> = {
  all: "current",
  cautious_multi_asset: "Cautious Multi-Asset",
  balanced_multi_asset: "Balanced Multi-Asset",
  growth_multi_asset: "Growth Multi-Asset",
  aggressive_multi_asset: "Aggressive Multi-Asset",
  monthly_income: "Monthly Income",
  uk_equity_income: "UK Equity Income",
  global_equity: "Global Equity",
  uk_equity: "UK Equity",
  corporate_bond: "Corporate Bond",
  european_equity: "European Equity",
  north_american_equity: "North American Equity",
};

const MANDATE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Mandates" },
  { value: "cautious_multi_asset", label: "Cautious Multi-Asset \u2014 Portfolio III \u00b7 DRM III" },
  { value: "balanced_multi_asset", label: "Balanced Multi-Asset \u2014 Portfolio IV \u00b7 DRM IV" },
  { value: "growth_multi_asset", label: "Growth Multi-Asset \u2014 Portfolio V \u00b7 DRM V \u00b7 Portfolio VI \u00b7 DRM VI" },
  { value: "aggressive_multi_asset", label: "Aggressive Multi-Asset \u2014 Portfolio VII" },
  { value: "monthly_income", label: "Monthly Income \u2014 Diversified Monthly Income" },
  { value: "uk_equity_income", label: "UK Equity Income \u2014 UK Equity Income Fund" },
  { value: "global_equity", label: "Global Equity \u2014 Global Equity Fund" },
  { value: "uk_equity", label: "UK Equity \u2014 UK Equity Fund" },
  { value: "corporate_bond", label: "Corporate Bond \u2014 Corporate Bond Fund" },
  { value: "european_equity", label: "European Equity \u2014 European Fund" },
  { value: "north_american_equity", label: "North American Equity \u2014 North American Fund" },
];

// ── Market context ───────────────────────────────────────────────────────────

type MarketContext = {
  text: string;
  dotColor: "emerald" | "amber";
};

const MARKET_CONTEXT: Record<string, MarketContext> = {
  all: {
    text: "Volatility Managed and Mixed 40-85% saw the strongest inflows in Feb 2026 \u2014 cautious and growth multi-asset remain well-timed.",
    dotColor: "emerald",
  },
  cautious_multi_asset: {
    text: "IA Volatility Managed: +\u00a3275m net inflows Feb 2026 \u2014 DRM III-IV sits in the top-inflow sector.",
    dotColor: "emerald",
  },
  balanced_multi_asset: {
    text: "IA Mixed 20-60%: steady inflows \u2014 Portfolio IV well-positioned against Jupiter Merlin Income (\u00a31.68bn sector leader).",
    dotColor: "emerald",
  },
  growth_multi_asset: {
    text: "IA Mixed 40-85%: +\u00a3250m net inflows Feb 2026 \u2014 Portfolio V-VI in the second strongest inflow sector.",
    dotColor: "emerald",
  },
  aggressive_multi_asset: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
  monthly_income: {
    text: "Safe-haven rotation underway \u2014 multi-asset income seeing consistent \u00a31.3-1.5bn/month inflows per Calastone FFI.",
    dotColor: "emerald",
  },
  uk_equity_income: {
    text: "IA UK Equity Income: outflows easing \u2014 Keyridge UK Equity Income at \u00a3132m competes in a sector led by Artemis Income (\u00a36.58bn). OCF advantage: 0.84% vs 0.87% sector average.",
    dotColor: "amber",
  },
  global_equity: {
    text: "IA Global: -\u00a3839m outflows Feb 2026 \u2014 sector under pressure. Timing calls for firms with income or cautious client focus.",
    dotColor: "amber",
  },
  uk_equity: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
  corporate_bond: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
  european_equity: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
  north_american_equity: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
};

// ── Real data from keyridge_ranked.csv + keyridge_briefs.json ────────────────

const ifaRankings: IFARanking[] = realIFARankings as IFARanking[];

// ── Fit score colour ──────────────────────────────────────────────────────────

function getFitScoreColor(score: number): string {
  if (score >= 70) return "var(--success)";
  if (score >= 50) return "var(--warning)";
  return "var(--neutral)";
}

// ── Firm type badge colours ───────────────────────────────────────────────────

function getFirmTypeBadgeStyle(type: FirmType): React.CSSProperties {
  switch (type) {
    case "DA Firm":
      return {
        background: "rgba(59,130,246,0.08)",
        border: "1px solid rgba(59,130,246,0.20)",
        color: "#2563EB",
      };
    case "AR Firm":
      return {
        background: "rgba(139,92,246,0.08)",
        border: "1px solid rgba(139,92,246,0.20)",
        color: "#7C3AED",
      };
    case "Network":
      return {
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.20)",
        color: "#059669",
      };
  }
}

// ── Source badge ──────────────────────────────────────────────────────────────

function getSourceBadgeStyle(source: SignalItem["source"]): React.CSSProperties {
  switch (source) {
    case "FCA":
      return { background: "rgba(59,130,246,0.08)", color: "#2563EB", border: "1px solid rgba(59,130,246,0.20)" };
    case "CH":
      return { background: "rgba(139,92,246,0.08)", color: "#7C3AED", border: "1px solid rgba(139,92,246,0.20)" };
    case "Web":
      return { background: "rgba(16,185,129,0.08)", color: "#059669", border: "1px solid rgba(16,185,129,0.20)" };
    case "Press":
      return { background: "rgba(245,158,11,0.08)", color: "#B45309", border: "1px solid rgba(245,158,11,0.20)" };
  }
}

// ── Inline FitBar (fit-score specific — green/warning/neutral) ────────────────

function FitBar({ score }: { score: number }) {
  const color = getFitScoreColor(score);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "60px",
          height: "3px",
          borderRadius: "9999px",
          background: "var(--bg-raised)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            borderRadius: "9999px",
            background: color,
            transition: "width 600ms cubic-bezier(0.4,0,0.2,1) 200ms",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          fontVariantNumeric: "tabular-nums",
          color,
          fontWeight: 500,
        }}
      >
        {score}
      </span>
    </div>
  );
}

// ── Score breakdown bar ───────────────────────────────────────────────────────

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 70 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--neutral)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
      <span style={{ fontSize: "13px", color: "var(--text-secondary)", flex: 1, minWidth: 0 }}>{label}</span>
      <div style={{ width: "80px", height: "3px", borderRadius: "9999px", background: "var(--bg-raised)", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "9999px" }} />
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums", minWidth: "36px", textAlign: "right" }}>
        {value}/{max}
      </span>
    </div>
  );
}

// ── Layer Status Badge ────────────────────────────────────────────────────────

function LayerStatusBadge({ state }: { state: LayerState }) {
  const config: Record<LayerState, { icon: React.ReactNode; label: string; style: React.CSSProperties }> = {
    live: {
      icon: <CircleDot size={12} />,
      label: "LIVE",
      style: {
        background: "var(--success-subtle)",
        border: "1px solid rgba(34,197,94,0.20)",
        color: "var(--success-text)",
      },
    },
    building: {
      icon: <Clock size={12} />,
      label: "BUILDING",
      style: {
        background: "rgba(107,114,128,0.08)",
        border: "1px solid rgba(107,114,128,0.20)",
        color: "var(--neutral-text)",
      },
    },
    licensed: {
      icon: <Lock size={12} />,
      label: "LICENSED",
      style: {
        background: "var(--accent-subtle)",
        border: "1px solid rgba(245,158,11,0.15)",
        color: "var(--accent)",
      },
    },
  };

  const { icon, label, style } = config[state];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {icon}
      {label}
    </span>
  );
}

// ── Outreach Draft Modal ──────────────────────────────────────────────────────

function OutreachDraftModal({
  ifa,
  onClose,
}: {
  ifa: IFARanking;
  onClose: () => void;
}) {
  const totalScore = Object.values(ifa.scoreBreakdown).reduce((a, b) => a + b, 0);
  const topSignal = ifa.signals[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.24)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-strong)",
          borderRadius: "12px",
          padding: "0",
          maxWidth: "640px",
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Modal header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
              Outreach Brief — {ifa.firm}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
              For: {ifa.firm} · Mandate: Global Systematic · Score: {totalScore}/100
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-tertiary)",
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: "20px" }}>
          {/* Subject line */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              SUGGESTED SUBJECT LINE
            </div>
            <div
              style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "10px 12px",
                fontSize: "13px",
                color: "var(--text-primary)",
              }}
            >
              Global Systematic — allocation fit for {ifa.firm} client mandates
            </div>
          </div>

          {/* Opening hook */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              OPENING HOOK (SIGNAL-LED)
            </div>
            <div
              style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "12px",
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              We noted {topSignal?.description?.toLowerCase()}. Given this context, we believe the Keyridge Global Systematic mandate may represent a timely fit for your current investment framework.
            </div>
          </div>

          {/* Key points */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
              KEY MANDATE POINTS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                "20-year live track record across full market cycles",
                "Systematic factor-based process — fully rules-driven, repeatable",
                "OCF 0.65% — competitive vs. peer group average of 0.91%",
                "Available on 12 major UK platforms including Transact, Nucleus, and Quilter",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <CheckCircle2 size={14} style={{ color: "var(--success-text)", flexShrink: 0, marginTop: "1px" }} />
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              SUGGESTED CTA
            </div>
            <div
              style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "10px 12px",
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Would a 20-minute call this week work to walk through the process and discuss how Global Systematic might complement your current fund universe?
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "7px 14px",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              background: "transparent",
              fontSize: "13px",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            style={{
              padding: "7px 16px",
              background: "var(--accent)",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Intelligence Signals Panel ───────────────────────────────────────────────

function IntelligenceSignalsPanel({ ifa }: { ifa: IFARanking }) {
  if (ifa.signal_count === 0) {
    // State C — empty state
    return (
      <div>
        <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
          INTELLIGENCE SIGNALS
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100px",
            textAlign: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "1.5px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "1.5px",
                background: "var(--text-disabled)",
                borderRadius: "1px",
              }}
            />
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
            Limited public signals available
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-tertiary)",
            }}
          >
            Intelligence based on FCA register data only
          </span>
        </div>
      </div>
    );
  }

  // State A (signal_count >= 3) or State B (signal_count 1-2)
  return (
    <div>
      <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
        INTELLIGENCE SIGNALS
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {ifa.signals.map((signal, i) => (
          <div key={i} style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent)",
                flexShrink: 0,
                marginTop: "5px",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {signal.date}
                </span>
                <span
                  style={{
                    ...getSourceBadgeStyle(signal.source),
                    padding: "1px 5px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  {signal.source}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                {signal.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* State B — limited signals notice */}
      {ifa.signal_count >= 1 && ifa.signal_count <= 2 && (
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            marginTop: "12px",
            paddingTop: "10px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.01em",
              lineHeight: 1.4,
              color: "var(--text-tertiary)",
              margin: 0,
            }}
          >
            Additional public signals limited for this firm.
            <br />
            Profile based on FCA register and VouchedFor data.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function DetailPanel({
  ifa,
  onBuildBrief,
  briefVisible,
  setBriefVisible,
}: {
  ifa: IFARanking;
  onBuildBrief: () => void;
  briefVisible: string | null;
  setBriefVisible: (id: string | null) => void;
}) {
  const breakdown = ifa.scoreBreakdown;
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const prefersReducedMotion = useReducedMotion();
  const isBriefShown = briefVisible === ifa.id;

  // Determine CTA behaviour
  const showBrief = ifa.brief_available;

  const handleCTAClick = () => {
    if (showBrief) {
      setBriefVisible(isBriefShown ? null : ifa.id);
    } else {
      onBuildBrief();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
        }}
      >
        {/* Column 1 — Firm Profile */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
            FIRM PROFILE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "FCA Number", value: ifa.fcaNumber, mono: true },
              { label: "Registered", value: ifa.registrationDate, mono: true },
              { label: "Permissions", value: ifa.permissions, mono: false },
              { label: "Key Individuals", value: ifa.keyIndividuals.join(", "), mono: false },
              { label: "Office", value: ifa.officeAddress, mono: false },
              { label: "Companies House", value: ifa.companiesHouseNumber, mono: true },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-tertiary)", minWidth: "110px", flexShrink: 0 }}>{label}</span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-primary)",
                    fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
                    fontVariantNumeric: mono ? "tabular-nums" : undefined,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 — Fit Score Breakdown */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
            FIT SCORE BREAKDOWN
          </div>
          <div>
            <ScoreRow label="Firm Scale" value={breakdown.firmScale} max={30} />
            <ScoreRow label="Distribution Match" value={breakdown.distributionMatch} max={25} />
            <ScoreRow label="Regulatory Fit" value={breakdown.regulatoryFit} max={20} />
            <ScoreRow label="Fund Fit" value={breakdown.fundFit} max={15} />
            <ScoreRow label="Market Timing" value={breakdown.marketTiming} max={10} />
            <div
              style={{
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Total Score</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {ifa.fitScore}<span style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 400 }}>/100</span>
              </span>
            </div>
          </div>
          {/* CTA button */}
          {isBriefShown ? (
            <button
              onClick={handleCTAClick}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "8px 16px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 120ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-strong)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              <FileText size={13} />
              Hide Brief
            </button>
          ) : (
            <button
              onClick={handleCTAClick}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "8px 16px",
                background: "var(--accent)",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "background 120ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
            >
              <FileText size={13} />
              {showBrief ? "Show Pre-Call Brief" : "Build Outreach Brief"}
            </button>
          )}
        </div>

        {/* Column 3 — Intelligence Signals */}
        <IntelligenceSignalsPanel ifa={ifa} />
      </div>

      {/* Brief section */}
      <AnimatePresence>
        {isBriefShown && ifa.brief_who && ifa.brief_why && ifa.brief_opener && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "24px",
              }}
            >
              {/* WHO THEY ARE */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                  }}
                >
                  WHO THEY ARE
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {ifa.brief_who}
                </div>
              </div>

              {/* WHY KEYRIDGE FITS */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                  }}
                >
                  WHY KEYRIDGE FITS
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {ifa.brief_why}
                </div>
              </div>

              {/* OPENING LINE */}
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.20)",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                  }}
                >
                  OPENING LINE
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {ifa.brief_opener}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Layer 1 ───────────────────────────────────────────────────────────────────

function Layer1({
  selectedMandate,
  setSelectedMandate,
  selectedRegion,
  setSelectedRegion,
  selectedFirmType,
  setSelectedFirmType,
  selectedAUMBand,
  setSelectedAUMBand,
  selectedSignalFilter,
  setSelectedSignalFilter,
  expandedRow,
  setExpandedRow,
  onBuildBrief,
  briefVisible,
  setBriefVisible,
}: {
  selectedMandate: string;
  setSelectedMandate: (v: string) => void;
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  selectedFirmType: string;
  setSelectedFirmType: (v: string) => void;
  selectedAUMBand: string;
  setSelectedAUMBand: (v: string) => void;
  selectedSignalFilter: string;
  setSelectedSignalFilter: (v: string) => void;
  expandedRow: string | null;
  setExpandedRow: (id: string | null) => void;
  onBuildBrief: (ifa: IFARanking) => void;
  briefVisible: string | null;
  setBriefVisible: (id: string | null) => void;
}) {
  const filteredData = ifaRankings.filter((ifa) => {
    if (selectedMandate !== "all" && ifa.active_mandate !== selectedMandate) return false;
    if (selectedRegion !== "All UK" && ifa.region !== selectedRegion) return false;
    if (selectedFirmType !== "All" && ifa.firmType !== selectedFirmType) return false;
    return true;
  });

  const selectStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "var(--text-secondary)",
    background: "var(--bg-raised)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "6px 28px 6px 10px",
    minWidth: "140px",
    appearance: "none",
    WebkitAppearance: "none",
    outline: "none",
    cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  };

  const mandateSelectStyle: React.CSSProperties = {
    ...selectStyle,
    minWidth: "280px",
  };

  const colHeaders = ["#", "IFA Firm", "Region", "Score", "Key Signal", "FCA Status", "Action"];

  const handleRowClick = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
    setBriefVisible(null);
  };

  // Market context
  const context = MARKET_CONTEXT[selectedMandate] || MARKET_CONTEXT["all"];
  const dotStyle = context.dotColor === "emerald"
    ? { background: "var(--success)", animation: "pulse-dot 2.2s ease-in-out infinite" }
    : (briefVisible !== null
        ? { background: "var(--text-tertiary)" }
        : { background: "var(--warning)", animation: "pulse-dot 2.2s ease-in-out infinite" });

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "12px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <select style={mandateSelectStyle} value={selectedMandate} onChange={(e) => setSelectedMandate(e.target.value)}>
          {MANDATE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select style={selectStyle} value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
          <option>All UK</option>
          <option>London</option>
          <option>South East</option>
          <option>Midlands</option>
          <option>North</option>
          <option>Scotland</option>
          <option>Wales</option>
        </select>
        <select style={selectStyle} value={selectedFirmType} onChange={(e) => setSelectedFirmType(e.target.value)}>
          <option>All</option>
          <option>DA Firm</option>
          <option>AR Firm</option>
          <option>Network</option>
        </select>
        <select style={selectStyle} value={selectedSignalFilter} onChange={(e) => setSelectedSignalFilter(e.target.value)}>
          <option>All</option>
          <option>New Signals Only</option>
          <option>Leadership Changes</option>
          <option>Platform Changes</option>
        </select>
      </div>

      {/* Universe stats strip */}
      <div
        style={{
          marginTop: "16px",
          marginBottom: "16px",
          display: "flex",
          gap: "4px",
          alignItems: "baseline",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{UNIVERSE_TOTAL.toLocaleString("en-GB")}</span>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}> IFAs in universe · </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>{ifaRankings.filter(f => !(f as any).restricted_network).length.toLocaleString("en-GB")}</span>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}> independent firms · </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{ifaRankings.filter(f => (f.review_count ?? 0) > 0).length.toLocaleString("en-GB")}</span>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}> have VouchedFor intelligence</span>
      </div>

      {/* Market context strip */}
      <div
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "8px 12px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            flexShrink: 0,
            ...dotStyle,
          }}
        />
        <span
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            flex: 1,
            lineHeight: 1.5,
          }}
        >
          {context.text}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-tertiary)",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Feb 2026 data
        </span>
      </div>

      {/* Ranked table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 220px 100px 180px 1fr 90px 100px",
            padding: "0 12px",
            borderBottom: "1px solid var(--border-strong)",
            background: "var(--bg-raised)",
          }}
        >
          {colHeaders.map((h) => (
            <div
              key={h}
              style={{
                padding: "10px 0",
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Table rows */}
        {filteredData.map((ifa) => {
          const isExpanded = expandedRow === ifa.id;
          return (
            <div key={ifa.id}>
              <div
                onClick={() => handleRowClick(ifa.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 220px 100px 180px 1fr 90px 100px",
                  padding: "0 12px",
                  borderBottom: "1px solid var(--border-subtle)",
                  alignItems: "center",
                  cursor: "pointer",
                  background: isExpanded ? "var(--bg-raised)" : "transparent",
                  transition: "background 120ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)";
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                {/* Rank */}
                <div
                  style={{
                    padding: "10px 0",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-tertiary)",
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {ifa.rank}
                </div>

                {/* Firm + type badge */}
                <div style={{ padding: "10px 0 10px 8px", display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ifa.firm}
                  </span>
                  <span
                    style={{
                      ...getFirmTypeBadgeStyle(ifa.firmType),
                      padding: "1px 6px",
                      borderRadius: "9999px",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    {ifa.firmType}
                  </span>
                </div>

                {/* Region */}
                <div style={{ padding: "10px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                  {ifa.region}
                </div>

                {/* Score (stacked: context line + FitBar) */}
                <div style={{ padding: "10px 0 10px 8px" }}>
                  {(() => {
                    const contextLine =
                      ifa.review_count && ifa.review_count > 0
                        ? { num: ifa.review_count.toLocaleString("en-GB"), label: "reviews" }
                        : ifa.adviser_count && ifa.adviser_count > 0
                          ? { num: String(ifa.adviser_count), label: "advisers" }
                          : null;
                    return (
                      <>
                        {contextLine && (
                          <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginBottom: "4px" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{contextLine.num}</span>
                            <span style={{ fontFamily: "var(--font-sans)" }}> {contextLine.label}</span>
                          </div>
                        )}
                        <FitBar score={ifa.fitScore} />
                      </>
                    );
                  })()}
                </div>

                {/* Key Signal */}
                <div
                  style={{
                    padding: "10px 8px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.4,
                  }}
                >
                  {ifa.keySignal}
                </div>

                {/* FCA Status */}
                <div style={{ padding: "10px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--success)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Authorised
                  </span>
                </div>

                {/* Action */}
                <div style={{ padding: "10px 0" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ifa.brief_available) {
                        // Expand the row if not already expanded, then show brief
                        if (!isExpanded) {
                          setExpandedRow(ifa.id);
                        }
                        setBriefVisible(briefVisible === ifa.id ? null : ifa.id);
                      } else {
                        onBuildBrief(ifa);
                      }
                    }}
                    style={{
                      padding: "5px 10px",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "border-color 120ms ease, color 120ms ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    {ifa.brief_available ? "Show Brief" : "Build Brief"}
                  </button>
                </div>
              </div>

              {/* Expanded detail panel */}
              <AnimatePresence>
                {isExpanded && (
                  <DetailPanel
                    ifa={ifa}
                    onBuildBrief={() => onBuildBrief(ifa)}
                    briefVisible={briefVisible}
                    setBriefVisible={setBriefVisible}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Layer 2 — Building ────────────────────────────────────────────────────────

function Layer2() {
  return (
    <div style={{ position: "relative" }}>
      {/* Greyed preview content */}
      <div style={{ opacity: 0.35, pointerEvents: "none", userSelect: "none" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px" }}>
            Advanced Relevance Scoring
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                PHILOSOPHY MATCH ANALYSIS
              </div>
              <div style={{ background: "var(--bg-raised)", borderRadius: "6px", height: "120px" }} />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                PLATFORM OVERLAP MATRIX
              </div>
              <div style={{ background: "var(--bg-raised)", borderRadius: "6px", height: "120px" }} />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                CLIENT DEMOGRAPHIC ALIGNMENT
              </div>
              <div style={{ background: "var(--bg-raised)", borderRadius: "6px", height: "80px" }} />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                FEE TOLERANCE SIGNALS
              </div>
              <div style={{ background: "var(--bg-raised)", borderRadius: "6px", height: "80px" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(248,248,246,0.80)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "320px",
            textAlign: "center",
          }}
        >
          <Clock size={24} style={{ color: "var(--text-tertiary)", margin: "0 auto 12px" }} />
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            In development
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
            Available Q2 2026
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Layer 3 — Licensed ────────────────────────────────────────────────────────

function Layer3() {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--accent)",
        borderRadius: "8px",
        padding: "20px",
        maxWidth: "520px",
      }}
    >
      <Lock size={20} style={{ color: "var(--accent)", marginBottom: "12px" }} />
      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
        Requires licensing
      </div>
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
        This layer requires commercial data from:
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
        {[
          "Defaqto — adviser fund usage data, panel preferences, research ratings",
          "LinkedIn Sales Navigator — people movement signals at scale, relationship mapping",
        ].map((item) => (
          <div key={item} style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "var(--text-tertiary)", flexShrink: 0 }}>•</span>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontStyle: "italic", marginTop: "12px", marginBottom: "16px" }}>
        These signals would increase actionable leads by an estimated 3–4x.
      </p>
      <a
        href="#"
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--accent)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        Register Interest →
      </a>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IFAPrioritisationPage() {
  const [selectedMandate, setSelectedMandate] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("All UK");
  const [selectedFirmType, setSelectedFirmType] = useState("All");
  const [selectedAUMBand, setSelectedAUMBand] = useState("Any");
  const [selectedSignalFilter, setSelectedSignalFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [draftContext, setDraftContext] = useState<IFARanking | null>(null);
  const [briefVisible, setBriefVisible] = useState<string | null>(null);

  const layers: {
    id: 1 | 2 | 3;
    label: string;
    sublabel: string;
    state: LayerState;
  }[] = [
    { id: 1, label: "Layer 1", sublabel: "Universe & Profile", state: "live" },
    { id: 2, label: "Layer 2", sublabel: "Relevance Scoring", state: "building" },
    { id: 3, label: "Layer 3", sublabel: "Readiness Signals", state: "licensed" },
  ];

  function handleBuildBrief(ifa: IFARanking) {
    setDraftContext(ifa);
    setIsDraftOpen(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ background: "var(--bg-page)", minHeight: "100vh" }}
    >
      <TopBar title="IFA Prioritisation" />

      {/* Module Header */}
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
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            IFA Prioritisation
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginTop: "4px",
              marginBottom: "8px",
              maxWidth: "600px",
              lineHeight: 1.5,
            }}
          >
            Rank 10,000+ UK IFAs by mandate fit using public data signals
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 10px",
              borderRadius: "9999px",
              background: "var(--success-subtle)",
              border: "1px solid rgba(34,197,94,0.20)",
              color: "var(--success-text)",
              fontSize: "13px",
            }}
          >
            Public data only — no internal access required
          </span>
        </div>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            fontSize: "13px",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "border-color 120ms ease, color 120ms ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-strong)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <Database size={14} />
          Data Sources
        </button>
      </div>

      {/* Layer Navigation Tabs */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          display: "flex",
          gap: 0,
          padding: "0 24px",
        }}
      >
        {layers.map((layer) => {
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: "-1px",
                cursor: "pointer",
                color: isActive
                  ? "var(--text-primary)"
                  : "var(--text-tertiary)",
                fontWeight: isActive ? 500 : 400,
                fontSize: "13px",
                transition: "color 120ms ease",
                opacity: !isActive && (layer.state === "building" || layer.state === "licensed") ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-tertiary)";
              }}
            >
              <span>{layer.label} — {layer.sublabel}</span>
              <LayerStatusBadge state={layer.state} />
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{ padding: "24px" }}>
        {activeLayer === 1 && (
          <Layer1
            selectedMandate={selectedMandate}
            setSelectedMandate={setSelectedMandate}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedFirmType={selectedFirmType}
            setSelectedFirmType={setSelectedFirmType}
            selectedAUMBand={selectedAUMBand}
            setSelectedAUMBand={setSelectedAUMBand}
            selectedSignalFilter={selectedSignalFilter}
            setSelectedSignalFilter={setSelectedSignalFilter}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            onBuildBrief={handleBuildBrief}
            briefVisible={briefVisible}
            setBriefVisible={setBriefVisible}
          />
        )}

        {activeLayer === 2 && <Layer2 />}

        {activeLayer === 3 && <Layer3 />}

        {/* Data Freshness Strip */}
        <div
          style={{
            marginTop: "32px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "FCA Register", age: "2h ago" },
            { label: "Companies House", age: "4h ago" },
            { label: "FT Adviser", age: "35s ago" },
          ].map(({ label, age }) => (
            <span
              key={label}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-tertiary)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {label}: {age}
            </span>
          ))}
        </div>
      </div>

      {/* Outreach Draft Modal */}
      <AnimatePresence>
        {isDraftOpen && draftContext && (
          <OutreachDraftModal
            ifa={draftContext}
            onClose={() => setIsDraftOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
