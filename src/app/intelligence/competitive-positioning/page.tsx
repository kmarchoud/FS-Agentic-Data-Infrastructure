"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Database,
  CircleDot,
  Clock,
  Lock,
  X,
  ChevronDown,
  BarChart3,
} from "lucide-react";
import { TopBar } from "@/components/dashboard/topbar";

// ── Types ─────────────────────────────────────────────────────────────────────

type LayerId = 1 | 2 | 3;

interface PeerFund {
  id: string;
  name: string;
  manager: string;
  aum: string;
  ocf: string;
  ytd: string;
  ytdSign: "positive" | "negative" | "neutral";
  platforms: number;
  keyClaim: string;
  isKeyridge?: boolean;
  sector: string;
}

interface CompetitorBrief {
  id: string;
  name: string;
  manager: string;
  aum: string;
  ocf: string;
  ytd: string;
  sector: string;
  platforms: number;
  positioning: string;
  strengths: string[];
  weaknesses: string[];
  platformList: { name: string; listed: boolean }[];
  battlecard: string[];
}

// ── Mock Data ─────────────────────────────────────────────────────────────────

const PEER_GROUP: PeerFund[] = [
  {
    id: "keyridge",
    name: "Keyridge Global Systematic",
    manager: "Keyridge AM",
    aum: "£4.2bn",
    ocf: "0.65%",
    ytd: "+3.1%",
    ytdSign: "positive",
    platforms: 12,
    sector: "IA Global",
    keyClaim: "Systematic factor-based, 20yr track record",
    isKeyridge: true,
  },
  {
    id: "schroders-qep",
    name: "Schroders QEP Global Core",
    manager: "Schroders",
    aum: "£8.1bn",
    ocf: "0.73%",
    ytd: "+4.2%",
    ytdSign: "positive",
    platforms: 31,
    sector: "IA Global",
    keyClaim: "QEP systematic approach, ESG integrated",
  },
  {
    id: "jupiter-merlin",
    name: "Jupiter Merlin Growth",
    manager: "Jupiter",
    aum: "£5.3bn",
    ocf: "1.42%",
    ytd: "+2.8%",
    ytdSign: "positive",
    platforms: 28,
    sector: "IA Global",
    keyClaim: "Multi-manager, actively managed allocation",
  },
  {
    id: "artemis-global",
    name: "Artemis Global Income",
    manager: "Artemis",
    aum: "£3.7bn",
    ocf: "0.83%",
    ytd: "+5.1%",
    ytdSign: "positive",
    platforms: 24,
    sector: "IA Global",
    keyClaim: "Income-focused global equity, yield 2.8%",
  },
  {
    id: "mg-macro",
    name: "M&G Global Macro Bond",
    manager: "M&G",
    aum: "£2.1bn",
    ocf: "0.91%",
    ytd: "+1.9%",
    ytdSign: "positive",
    platforms: 19,
    sector: "IA Global",
    keyClaim: "Macro-driven flexible fixed income",
  },
  {
    id: "royal-london",
    name: "Royal London Sustainable World",
    manager: "Royal London",
    aum: "£1.8bn",
    ocf: "0.79%",
    ytd: "+3.6%",
    ytdSign: "positive",
    platforms: 22,
    sector: "IA Global",
    keyClaim: "ESG-integrated global multi-asset",
  },
];

const COMPETITOR_BRIEFS: Record<string, CompetitorBrief> = {
  "schroders-qep": {
    id: "schroders-qep",
    name: "Schroders QEP Global Core",
    manager: "Schroders",
    aum: "£8.1bn",
    ocf: "0.73%",
    ytd: "+4.2%",
    sector: "IA Global",
    platforms: 31,
    positioning:
      "Schroders QEP (Quantitative Equity Products) is a systematic, rules-based global equity strategy underpinned by proprietary factor models with ESG integration as a passive overlay. The fund targets long-term capital growth through disciplined factor exposure across large- and mid-cap global equities.",
    strengths: [
      "Schroders brand recognition — instant IFA credibility",
      "31 platform listings including all major UK platforms",
      "Larger AUM (£8.1bn) signals institutional endorsement",
      "ESG badge ticks compliance boxes for adviser suitability",
    ],
    weaknesses: [
      "OCF of 0.73% — 8bps more expensive than Keyridge",
      "QEP track record from 2018 — 6 years vs Keyridge 20 years",
      "ESG is a passive overlay, not embedded in factor construction",
      "Requires Schroders platform relationship for optimal terms",
    ],
    platformList: [
      { name: "Hargreaves Lansdown", listed: true },
      { name: "Transact", listed: true },
      { name: "Nucleus", listed: true },
      { name: "Fidelity Adviser Solutions", listed: true },
      { name: "Aegon Wrap", listed: true },
      { name: "Standard Life", listed: true },
    ],
    battlecard: [
      "Our OCF is 0.65% vs their 0.73% — 8bps cheaper with a 20-year systematic track record, 3x longer than QEP.",
      "QEP requires Schroders platform relationship — we sit on 12 platforms including Transact and Nucleus independently.",
      "Their ESG integration is a passive overlay — ours is embedded in the factor model from construction.",
    ],
  },
  "jupiter-merlin": {
    id: "jupiter-merlin",
    name: "Jupiter Merlin Growth",
    manager: "Jupiter",
    aum: "£5.3bn",
    ocf: "1.42%",
    ytd: "+2.8%",
    sector: "IA Global",
    platforms: 28,
    positioning:
      "Jupiter Merlin Growth is a multi-manager fund of funds targeting long-term capital growth through active allocation across global equity and mixed-asset funds. The portfolio is actively managed with discretionary allocation shifts based on macro views.",
    strengths: [
      "Established multi-manager brand with long IFA familiarity",
      "28 platform listings — broad distribution footprint",
      "Active allocation story appeals to IFAs wanting a managed solution",
      "Strong Jupiter relationship network in UK wholesale",
    ],
    weaknesses: [
      "OCF of 1.42% — more than double Keyridge's 0.65%",
      "Fund-of-funds structure adds complexity and cost drag",
      "Discretionary macro calls introduce manager risk",
      "YTD +2.8% — underperforming systematic peers",
    ],
    platformList: [
      { name: "Hargreaves Lansdown", listed: true },
      { name: "Transact", listed: true },
      { name: "Nucleus", listed: true },
      { name: "Fidelity Adviser Solutions", listed: true },
      { name: "Aegon Wrap", listed: true },
      { name: "Standard Life", listed: false },
    ],
    battlecard: [
      "Our OCF is 0.65% vs their 1.42% — advisers save 77bps annually for clients; on a £500k portfolio that is £3,850 per year.",
      "Jupiter Merlin layers manager risk on top of market risk — our rules-based systematic approach removes discretionary guesswork.",
      "Their YTD +2.8% trails our +3.1% while charging more than double our fee — the cost-adjusted case is unambiguous.",
    ],
  },
  "artemis-global": {
    id: "artemis-global",
    name: "Artemis Global Income",
    manager: "Artemis",
    aum: "£3.7bn",
    ocf: "0.83%",
    ytd: "+5.1%",
    sector: "IA Global",
    platforms: 24,
    positioning:
      "Artemis Global Income is an actively managed global equity income fund targeting a yield of 2.8% with capital appreciation. The fund concentrates on dividend-paying equities across developed markets, with a bias toward quality and value factors.",
    strengths: [
      "Highest YTD performance in the peer group at +5.1%",
      "Income yield of 2.8% — differentiated positioning for income-seeking IFAs",
      "Artemis brand respected across UK IFA community",
      "24 platform listings — solid distribution coverage",
    ],
    weaknesses: [
      "OCF of 0.83% — 18bps more expensive than Keyridge",
      "Income mandate narrows the addressable IFA segment",
      "Concentrated dividend exposure creates yield-chasing risk",
      "Active stock picking introduces single-manager key-person risk",
    ],
    platformList: [
      { name: "Hargreaves Lansdown", listed: true },
      { name: "Transact", listed: true },
      { name: "Nucleus", listed: false },
      { name: "Fidelity Adviser Solutions", listed: true },
      { name: "Aegon Wrap", listed: true },
      { name: "Standard Life", listed: true },
    ],
    battlecard: [
      "Artemis Global Income is an income fund — it suits a specific client profile. Our Global Systematic serves the full growth mandate without yield constraints.",
      "Their 18bps OCF premium funds active stock picking; our systematic process removes manager risk while delivering comparable growth at lower cost.",
      "Strong recent YTD can reverse quickly with any dividend cycle turn — our factor diversification smooths return across market regimes.",
    ],
  },
  "mg-macro": {
    id: "mg-macro",
    name: "M&G Global Macro Bond",
    manager: "M&G",
    aum: "£2.1bn",
    ocf: "0.91%",
    ytd: "+1.9%",
    sector: "IA Global",
    platforms: 19,
    positioning:
      "M&G Global Macro Bond employs a flexible fixed income strategy driven by macro thematic analysis. The fund seeks to generate returns across global bond markets by actively positioning duration, currency, and credit exposure based on the manager's macro outlook.",
    strengths: [
      "M&G brand — large insurer parent provides institutional confidence",
      "Flexible mandate allows defensive positioning in rate cycles",
      "Fixed income allocation differs from equity-heavy peers",
      "19 platform listings — adequate coverage",
    ],
    weaknesses: [
      "OCF of 0.91% — most expensive in the peer group",
      "Lowest YTD performance at +1.9%",
      "Macro discretion introduces high active risk relative to outcome",
      "Smaller AUM (£2.1bn) vs equity peers — less IFA familiarity",
    ],
    platformList: [
      { name: "Hargreaves Lansdown", listed: true },
      { name: "Transact", listed: false },
      { name: "Nucleus", listed: false },
      { name: "Fidelity Adviser Solutions", listed: true },
      { name: "Aegon Wrap", listed: true },
      { name: "Standard Life", listed: true },
    ],
    battlecard: [
      "M&G Global Macro Bond is a fixed income fund — a different asset class. If the adviser needs global equity systematic exposure, we are the direct comparison.",
      "Their OCF of 0.91% is 26bps above ours for a fund delivering +1.9% YTD — the cost-per-unit-of-return argument strongly favours Keyridge.",
      "Macro discretion in fixed income introduces rates-call risk; our equity factor model is systematic, diversified, and regimes-tested over 20 years.",
    ],
  },
  "royal-london": {
    id: "royal-london",
    name: "Royal London Sustainable World",
    manager: "Royal London",
    aum: "£1.8bn",
    ocf: "0.79%",
    ytd: "+3.6%",
    sector: "IA Global",
    platforms: 22,
    positioning:
      "Royal London Sustainable World is an ESG-integrated global multi-asset fund targeting long-term growth with a sustainability mandate. The fund applies proprietary ESG scoring across equities and bonds, with a focus on firms demonstrating improving sustainability trajectories.",
    strengths: [
      "Strong ESG credentials — differentiated sustainability story",
      "Royal London mutual status resonates with IFAs valuing client alignment",
      "Multi-asset breadth appeals to one-stop IFA portfolios",
      "22 platform listings — decent coverage",
    ],
    weaknesses: [
      "OCF of 0.79% — 14bps above Keyridge",
      "Smallest AUM in the peer group at £1.8bn",
      "ESG integration limits investable universe vs unconstrained peers",
      "Multi-asset complexity makes attribution harder to communicate",
    ],
    platformList: [
      { name: "Hargreaves Lansdown", listed: true },
      { name: "Transact", listed: true },
      { name: "Nucleus", listed: true },
      { name: "Fidelity Adviser Solutions", listed: false },
      { name: "Aegon Wrap", listed: true },
      { name: "Standard Life", listed: true },
    ],
    battlecard: [
      "Royal London Sustainable World is a multi-asset fund with ESG constraints — our Global Systematic is a pure systematic equity strategy with higher growth potential.",
      "Their OCF premium of 14bps funds ESG screening that narrows the universe; our factor model embeds sustainability signals from construction without the cost drag.",
      "At £1.8bn AUM and 22 platforms, they are still building distribution scale — our 20-year track record and institutional backing are already established.",
    ],
  },
};

const MANDATES = [
  "Global Systematic",
  "UK Balanced",
  "Diversified Income",
  "Strategic Bond",
  "Global Multi-Asset",
];

// ── Sub-components ────────────────────────────────────────────────────────────

function LayerStatusBadge({ state }: { state: "live" | "building" | "licensed" }) {
  const config = {
    live: {
      bg: "var(--success-subtle)",
      border: "rgba(34,197,94,0.20)",
      color: "var(--success-text)",
      label: "LIVE",
      Icon: CircleDot,
    },
    building: {
      bg: "rgba(107,114,128,0.08)",
      border: "rgba(107,114,128,0.20)",
      color: "var(--neutral-text)",
      label: "BUILDING",
      Icon: Clock,
    },
    licensed: {
      bg: "var(--accent-subtle)",
      border: "rgba(245,158,11,0.15)",
      color: "var(--accent)",
      label: "LICENSED",
      Icon: Lock,
    },
  }[state];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "9999px",
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.color,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      <config.Icon size={12} strokeWidth={2} />
      {config.label}
    </span>
  );
}

function MandateSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <span
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          fontWeight: 500,
        }}
      >
        Mandate
      </span>
      <div style={{ position: "relative" }}>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{
            appearance: "none",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            padding: "6px 32px 6px 12px",
            fontSize: "13px",
            color: "var(--text-primary)",
            fontFamily: "var(--font-sans)",
            fontWeight: 500,
            cursor: "pointer",
            minWidth: "200px",
            outline: "none",
            transition: "border-color 120ms ease",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
        >
          {MANDATES.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          strokeWidth={2}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text-tertiary)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

function YtdValue({ value, sign }: { value: string; sign: "positive" | "negative" | "neutral" }) {
  const color =
    sign === "positive"
      ? "var(--success-text)"
      : sign === "negative"
      ? "var(--danger-text)"
      : "var(--text-secondary)";
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "12px",
        fontWeight: 400,
        color,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {value}
    </span>
  );
}

function PeerTable({
  onViewBrief,
}: {
  onViewBrief: (id: string) => void;
}) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr
            style={{
              borderBottom: "1px solid var(--border-strong)",
              background: "var(--bg-card)",
            }}
          >
            {["Fund Name", "Asset Manager", "AUM", "OCF %", "YTD", "Platforms", "Key Claim", ""].map(
              (col, i) => (
                <th
                  key={i}
                  style={{
                    padding: "10px 12px",
                    textAlign:
                      col === "AUM" || col === "OCF %" || col === "YTD"
                        ? "right"
                        : col === "Platforms"
                        ? "center"
                        : "left",
                    fontSize: "11px",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {PEER_GROUP.map((fund, idx) => (
            <tr
              key={fund.id}
              style={{
                borderBottom:
                  idx < PEER_GROUP.length - 1 ? "1px solid var(--border-subtle)" : "none",
                borderLeft: fund.isKeyridge ? "2px solid var(--accent)" : "2px solid transparent",
                background: fund.isKeyridge ? "rgba(245,158,11,0.02)" : undefined,
                transition: "background 100ms ease",
              }}
              onMouseEnter={(e) => {
                if (!fund.isKeyridge)
                  (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg-raised)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLTableRowElement).style.background = fund.isKeyridge
                  ? "rgba(245,158,11,0.02)"
                  : "";
              }}
            >
              {/* Fund Name */}
              <td style={{ padding: "10px 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                    }}
                  >
                    {fund.name}
                  </span>
                  {fund.isKeyridge && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        background: "var(--accent-subtle)",
                        border: "1px solid rgba(245,158,11,0.20)",
                        color: "var(--accent)",
                        fontSize: "10px",
                        fontWeight: 700,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        flexShrink: 0,
                      }}
                    >
                      YOU
                    </span>
                  )}
                </div>
              </td>

              {/* Asset Manager */}
              <td style={{ padding: "10px 12px" }}>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {fund.manager}
                </span>
              </td>

              {/* AUM */}
              <td style={{ padding: "10px 12px", textAlign: "right" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {fund.aum}
                </span>
              </td>

              {/* OCF */}
              <td style={{ padding: "10px 12px", textAlign: "right" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {fund.ocf}
                </span>
              </td>

              {/* YTD */}
              <td style={{ padding: "10px 12px", textAlign: "right" }}>
                <YtdValue value={fund.ytd} sign={fund.ytdSign} />
              </td>

              {/* Platforms */}
              <td style={{ padding: "10px 12px", textAlign: "center" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {fund.platforms}
                </span>
              </td>

              {/* Key Claim */}
              <td style={{ padding: "10px 12px", maxWidth: "240px" }}>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {fund.keyClaim}
                </span>
              </td>

              {/* Action */}
              <td style={{ padding: "10px 12px" }}>
                {!fund.isKeyridge && (
                  <button
                    onClick={() => onViewBrief(fund.id)}
                    style={{
                      background: "none",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      padding: "5px 10px",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-sans)",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      transition: "border-color 120ms ease, color 120ms ease",
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
                    View Brief
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CompetitorPanel({
  brief,
  onClose,
}: {
  brief: CompetitorBrief;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ x: 420 }}
      animate={{ x: 0 }}
      exit={{ x: 420 }}
      transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        position: "fixed",
        right: 0,
        top: 0,
        height: "100vh",
        width: "420px",
        background: "var(--bg-card)",
        borderLeft: "1px solid var(--border)",
        boxShadow: "-8px 0 24px rgba(0,0,0,0.06)",
        zIndex: 50,
        overflowY: "auto",
        padding: "24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "24px",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.4,
            }}
          >
            {brief.name}
          </h2>
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-tertiary)",
              margin: "2px 0 0",
            }}
          >
            {brief.manager}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            padding: "4px",
            cursor: "pointer",
            color: "var(--text-tertiary)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "color 120ms ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-tertiary)")}
          aria-label="Close panel"
        >
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Sections */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* OVERVIEW */}
        <section>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              margin: "0 0 10px",
            }}
          >
            Overview
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "AUM", value: brief.aum },
              { label: "Fee (OCF)", value: brief.ocf },
              { label: "YTD", value: brief.ytd },
              { label: "Sector", value: brief.sector },
              { label: "Platforms", value: String(brief.platforms) },
            ].map(({ label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>{label}</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border-subtle)" }} />

        {/* POSITIONING */}
        <section>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              margin: "0 0 8px",
            }}
          >
            Positioning
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              margin: 0,
            }}
          >
            {brief.positioning}
          </p>
        </section>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border-subtle)" }} />

        {/* PERCEIVED STRENGTHS */}
        <section>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              margin: "0 0 10px",
            }}
          >
            Perceived Strengths
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            {brief.strengths.map((s, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--success)",
                    flexShrink: 0,
                    marginTop: "5px",
                  }}
                />
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border-subtle)" }} />

        {/* VISIBLE WEAKNESSES */}
        <section>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              margin: "0 0 10px",
            }}
          >
            Visible Weaknesses
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
            {brief.weaknesses.map((w, i) => (
              <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    flexShrink: 0,
                    marginTop: "5px",
                  }}
                />
                <span style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
                  {w}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border-subtle)" }} />

        {/* PLATFORM DISTRIBUTION */}
        <section>
          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-tertiary)",
              margin: "0 0 10px",
            }}
          >
            Platform Distribution
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {brief.platformList.map(({ name, listed }) => (
              <div
                key={name}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{name}</span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    color: listed ? "var(--success-text)" : "var(--danger-text)",
                    fontWeight: 500,
                  }}
                >
                  {listed ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div style={{ height: "1px", background: "var(--border-subtle)" }} />

        {/* BATTLECARD */}
        <section>
          <div
            style={{
              background: "var(--accent-subtle)",
              borderLeft: "2px solid var(--accent)",
              borderRadius: "8px",
              padding: "16px",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: "0 0 12px",
              }}
            >
              If they mention {brief.manager}
            </p>
            <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "12px" }}>
              {brief.battlecard.map((point, i) => (
                <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "var(--accent)",
                      flexShrink: 0,
                      marginTop: "1px",
                      minWidth: "16px",
                    }}
                  >
                    {i + 1}.
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--text-primary)",
                      lineHeight: 1.6,
                    }}
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

      </div>
    </motion.div>
  );
}

// ── Layer 1 Content ───────────────────────────────────────────────────────────

function Layer1Content({
  onViewBrief,
}: {
  onViewBrief: (id: string) => void;
}) {
  const [mandate, setMandate] = useState("Global Systematic");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Mandate selector */}
      <MandateSelector value={mandate} onChange={setMandate} />

      {/* Peer group table */}
      <PeerTable onViewBrief={onViewBrief} />

      {/* Platform presence callout */}
      <div
        style={{
          background: "var(--accent-subtle)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Keyridge is not listed on Hargreaves Lansdown. 4 of 5 key competitors are.
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: "4px 0 0",
            lineHeight: 1.6,
          }}
        >
          HL carries £149bn AUM and grew 3.2% QoQ. This is the highest-priority distribution gap.
        </p>
      </div>
    </div>
  );
}

// ── Layer 2 Content ───────────────────────────────────────────────────────────

function Layer2Content() {
  return (
    <div style={{ position: "relative" }}>
      {/* Ghost preview content */}
      <div style={{ opacity: 0.3, pointerEvents: "none", userSelect: "none" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
          }}
        >
          {["Schroders QEP", "Jupiter Merlin", "Artemis Global", "M&G Macro"].map((name) => (
            <div
              key={name}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "20px",
              }}
            >
              <div
                style={{
                  height: "14px",
                  background: "var(--bg-subtle)",
                  borderRadius: "4px",
                  marginBottom: "12px",
                  width: "60%",
                }}
              />
              <div
                style={{
                  height: "10px",
                  background: "var(--bg-subtle)",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              />
              <div
                style={{
                  height: "10px",
                  background: "var(--bg-subtle)",
                  borderRadius: "4px",
                  width: "80%",
                }}
              />
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--text-tertiary)",
                  marginTop: "12px",
                }}
              >
                {name} — fuller brief with manager commentary, distribution hire signals, mandate pivot detection.
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(248,248,246,0.75)",
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
          <Clock
            size={24}
            strokeWidth={1.5}
            style={{ color: "var(--text-tertiary)", margin: "0 auto 12px" }}
          />
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 4px",
            }}
          >
            In development
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-tertiary)",
              margin: 0,
            }}
          >
            Available Q2 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Layer 3 Content ───────────────────────────────────────────────────────────

function Layer3Content() {
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
      <Lock
        size={20}
        strokeWidth={1.5}
        style={{ color: "var(--accent)", marginBottom: "12px" }}
      />
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 8px",
        }}
      >
        Requires licensing
      </h3>
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          margin: "0 0 10px",
          lineHeight: 1.6,
        }}
      >
        This layer requires commercial data from:
      </p>
      <ul style={{ margin: "0 0 16px", padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "6px" }}>
        <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          • Defaqto — IFA fund usage and panel preferences
        </li>
        <li style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
          • LinkedIn Sales Navigator — people movement signals
        </li>
      </ul>
      <p style={{ margin: 0 }}>
        <a
          href="#"
          style={{
            fontSize: "13px",
            color: "var(--accent)",
            fontWeight: 500,
            textDecoration: "none",
            transition: "text-decoration 120ms ease",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Register Interest
        </a>
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function CompetitivePositioningPage() {
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeLayer, setActiveLayer] = useState<LayerId>(1);

  const handleViewBrief = (id: string) => {
    setSelectedCompetitor(id);
    setIsPanelOpen(true);
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedCompetitor(null), 250);
  };

  const layers: { id: LayerId; label: string; sub: string; state: "live" | "building" | "licensed" }[] = [
    { id: 1, label: "Competitive Universe", sub: "Layer 1", state: "live" },
    { id: 2, label: "Positioning Intelligence", sub: "Layer 2", state: "building" },
    { id: 3, label: "IFA Perception", sub: "Layer 3", state: "licensed" },
  ];

  const activeBrief =
    selectedCompetitor && isPanelOpen ? COMPETITOR_BRIEFS[selectedCompetitor] ?? null : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <TopBar title="Competitive Positioning" />

      {/* Backdrop for slide-over */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={handleClosePanel}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.08)",
              zIndex: 40,
            }}
          />
        )}
      </AnimatePresence>

      {/* Slide-over panel */}
      <AnimatePresence>
        {activeBrief && (
          <CompetitorPanel
            key="panel"
            brief={activeBrief}
            onClose={handleClosePanel}
          />
        )}
      </AnimatePresence>

      {/* Page content */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        {/* Module Header */}
        <div
          style={{
            padding: "24px 24px 20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <BarChart3
                size={18}
                strokeWidth={1.5}
                style={{ color: "var(--text-tertiary)" }}
              />
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: 0,
                  letterSpacing: "-0.01em",
                  lineHeight: 1.4,
                }}
              >
                Competitive Positioning
              </h1>
            </div>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                margin: "0 0 10px",
                maxWidth: "600px",
                lineHeight: 1.5,
              }}
            >
              See every fund competing for the same IFAs. Get a battlecard in 30 seconds.
            </p>
            {/* Public Data Only badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "5px",
                padding: "2px 10px",
                borderRadius: "9999px",
                background: "var(--success-subtle)",
                border: "1px solid rgba(34,197,94,0.20)",
                color: "var(--success-text)",
                fontSize: "13px",
                fontWeight: 400,
              }}
            >
              <ShieldCheck size={13} strokeWidth={2} />
              Public data only — no internal access required
            </span>
          </div>

          {/* Data Sources ghost button */}
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "7px 12px",
              fontSize: "13px",
              color: "var(--text-secondary)",
              fontFamily: "var(--font-sans)",
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              transition: "border-color 120ms ease, color 120ms ease",
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
            <Database size={15} strokeWidth={1.5} />
            Data Sources
          </button>
        </div>

        {/* Layer tabs */}
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            padding: "0 24px",
            display: "flex",
            gap: 0,
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
                  borderBottom: isActive
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  marginBottom: "-1px",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-tertiary)",
                  fontFamily: "var(--font-sans)",
                  transition: "color 120ms ease",
                  whiteSpace: "nowrap",
                  opacity: !isActive && layer.state !== "live" ? 0.8 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "var(--text-secondary)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    e.currentTarget.style.color = "var(--text-tertiary)";
                }}
              >
                <span>{layer.label}</span>
                <span style={{ transform: "scale(0.9)", transformOrigin: "center" }}>
                  <LayerStatusBadge state={layer.state} />
                </span>
              </button>
            );
          })}
        </div>

        {/* Main content area */}
        <div style={{ padding: "24px" }}>

          {/* Layer section header */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              paddingBottom: "12px",
              borderBottom: "1px solid var(--border)",
              marginBottom: "20px",
            }}
          >
            <h2
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {activeLayer === 1 && "Layer 1 — Competitive Universe Mapping"}
              {activeLayer === 2 && "Layer 2 — Positioning Intelligence"}
              {activeLayer === 3 && "Layer 3 — IFA Perception Layer"}
            </h2>
            <LayerStatusBadge
              state={
                activeLayer === 1 ? "live" : activeLayer === 2 ? "building" : "licensed"
              }
            />
          </div>

          {/* Layer content */}
          <AnimatePresence mode="wait">
            {activeLayer === 1 && (
              <motion.div
                key="layer1"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
              >
                <Layer1Content onViewBrief={handleViewBrief} />
              </motion.div>
            )}
            {activeLayer === 2 && (
              <motion.div
                key="layer2"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
              >
                <Layer2Content />
              </motion.div>
            )}
            {activeLayer === 3 && (
              <motion.div
                key="layer3"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.14 }}
              >
                <Layer3Content />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Data Freshness Strip */}
          <div
            style={{
              marginTop: "32px",
              paddingTop: "12px",
              borderTop: "1px solid var(--border-subtle)",
              display: "flex",
              gap: "16px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {[
              { label: "Fund Factsheets", age: "1d ago", stale: false },
              { label: "Morningstar", age: "4h ago", stale: false },
              { label: "Platform Lists", age: "12h ago", stale: false },
            ].map(({ label, age, stale }, i) => (
              <span
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: stale ? "var(--warning-text)" : "var(--text-tertiary)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {i > 0 && (
                  <span style={{ marginRight: "4px", color: "var(--border-strong)" }}>·</span>
                )}
                {label}:{" "}
                <span style={{ color: stale ? "var(--warning-text)" : "var(--text-tertiary)" }}>
                  {age}
                </span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
