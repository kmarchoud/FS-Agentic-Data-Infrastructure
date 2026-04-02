"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Zap,
  BarChart2,
  Users,
  Link,
  GitBranch,
  Search as SearchIcon,
} from "lucide-react";
import { TopBar } from "@/components/dashboard/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ifaScatterData,
  signalStream,
  competitorHeatmap,
  recentSignals,
  moduleCards,
} from "@/lib/intelligence-mock-data";

// ── Types ─────────────────────────────────────────────────────────────────────

type TimeRange = "7D" | "30D" | "90D";

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  firm: {
    id: string;
    name: string;
    fitScore: number;
    signalRecencyDays: number;
    estimatedAUM_m: number;
    isUniverse: boolean;
    signal?: string;
  } | null;
}

// ── Constants ─────────────────────────────────────────────────────────────────

const MODULE_COLOURS: Record<string, string> = {
  "IFA Prioritisation": "#3B82F6",
  "Competitive Positioning": "#F59E0B",
  "Partnership Intelligence": "#8B5CF6",
  "Market Intelligence": "#16A34A",
  "Platform Flow": "#EA580C",
  "AI Research": "#0EA5E9",
};

const MODULE_SHORT: Record<string, string> = {
  IFA: "#3B82F6",
  Market: "#16A34A",
  Platform: "#EA580C",
  Competitive: "#F59E0B",
  Partnership: "#8B5CF6",
  AI: "#0EA5E9",
};

const PLATFORMS = ["HL", "Quilter", "Transact", "Nucleus", "AJ Bell", "St Life", "Aviva", "Zurich"];
const MANDATES = ["Global Systematic", "UK Balanced", "Diversified Income", "Absolute Return", "Strategic Bond"];
const MANDATE_ABBR = ["GS", "UKB", "DI", "AR", "SB"];

const MODULE_ICON_MAP: Record<string, React.ReactNode> = {
  Target: <Target size={18} strokeWidth={1.5} />,
  BarChart2: <BarChart2 size={18} strokeWidth={1.5} />,
  Link: <Link size={18} strokeWidth={1.5} />,
  Zap: <Zap size={18} strokeWidth={1.5} />,
  GitBranch: <GitBranch size={18} strokeWidth={1.5} />,
  Search: <SearchIcon size={18} strokeWidth={1.5} />,
};

// ── SVG Scatter Helpers ───────────────────────────────────────────────────────

const SVG_W = 800;
const SVG_H = 300;
const PAD_L = 48;
const PAD_R = 24;
const PAD_T = 24;
const PAD_B = 36;

function fitToX(fit: number) {
  return PAD_L + (fit / 100) * (SVG_W - PAD_L - PAD_R);
}

function recencyToY(days: number) {
  // Inverted: 0d at top (PAD_T), 30d+ at bottom
  const clamped = Math.min(days, 30);
  return PAD_T + (clamped / 30) * (SVG_H - PAD_T - PAD_B);
}

const MAX_AUM = 4100; // Chase de Vere

function bubbleRadius(aum_m: number, isUniverse: boolean) {
  if (isUniverse) return 3 + Math.random() * 1; // small grey dots
  const r = 6 + (Math.sqrt(aum_m) / Math.sqrt(MAX_AUM)) * 22;
  return Math.max(6, Math.min(r, 26));
}

function bubbleColour(fit: number, days: number): string {
  if (fit > 80 && days < 7) return "var(--accent)";
  if (fit > 70 && days < 14) return "var(--warning)";
  if (fit > 55 && days < 30) return "var(--neutral)";
  return "var(--border-strong)";
}

// ── Heatmap cell bg ───────────────────────────────────────────────────────────

function heatmapBg(count: number) {
  if (count === 0) return "var(--success-subtle)";
  if (count <= 2) return "rgba(245,158,11,0.08)";
  if (count <= 4) return "var(--warning-subtle)";
  return "var(--danger-subtle)";
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IntelligenceOverviewPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("7D");
  const [selectedMandate, setSelectedMandate] = useState("Global Systematic");
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, firm: null });
  const svgRef = useRef<SVGSVGElement>(null);

  // Pre-compute named firm radii deterministically
  const namedFirms = ifaScatterData.filter((f) => !f.isUniverse);
  const universeFirms = ifaScatterData.filter((f) => f.isUniverse);

  function handleSvgMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip((t) => ({ ...t, x: e.clientX - rect.left, y: e.clientY - rect.top }));
  }

  function handleBubbleEnter(firm: typeof ifaScatterData[0]) {
    setTooltip((t) => ({ ...t, visible: true, firm }));
  }

  function handleBubbleLeave() {
    setTooltip({ visible: false, x: 0, y: 0, firm: null });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ background: "var(--bg-page)", minHeight: "100vh" }}
    >
      <TopBar title="Intelligence Overview" />

      <div style={{ padding: "24px 28px 48px" }}>

        {/* ── H1: Page Header ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
          <div>
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>47</span>
              {" "}signals detected across your distribution universe in the last 7 days
            </p>
          </div>

          {/* Time range tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: "2px", background: "var(--bg-raised)", borderRadius: "6px", padding: "3px" }}>
            {(["7D", "30D", "90D"] as TimeRange[]).map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                style={{
                  fontSize: "12px",
                  fontWeight: timeRange === t ? 500 : 400,
                  color: timeRange === t ? "var(--text-primary)" : "var(--text-tertiary)",
                  background: timeRange === t ? "var(--bg-card)" : "transparent",
                  border: "none",
                  borderRadius: "4px",
                  padding: "4px 10px",
                  cursor: "pointer",
                  borderBottom: timeRange === t ? "2px solid var(--accent)" : "2px solid transparent",
                  transition: "all 120ms ease",
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* ── H2: Stats Strip ─────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "24px" }}>
          <StatCard
            label="IFA SIGNALS"
            value={23}
            valueFormat={(n) => String(Math.round(n))}
            delta="+8 vs last week"
            deltaDirection="up"
            icon={<Target size={16} strokeWidth={1.5} />}
          />
          <StatCard
            label="MARKET EVENTS"
            value={8}
            valueFormat={(n) => String(Math.round(n))}
            delta="Linked to 3 mandates each avg"
            deltaDirection="neutral"
            icon={<Zap size={16} strokeWidth={1.5} />}
          />
          <StatCard
            label="COMPETITIVE ALERTS"
            value={12}
            valueFormat={(n) => String(Math.round(n))}
            delta="2 new today"
            deltaDirection="neutral"
            icon={<BarChart2 size={16} strokeWidth={1.5} />}
          />
          <StatCard
            label="UK IFA UNIVERSE"
            value={10847}
            valueFormat={(n) => Math.round(n).toLocaleString()}
            delta="847 match your mandates"
            deltaDirection="neutral"
            icon={<Users size={16} strokeWidth={1.5} />}
          />
        </div>

        {/* ── H3: IFA Opportunity Scatter ─────────────────────────────────── */}
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "24px",
            marginBottom: "24px",
          }}
        >
          {/* Title row */}
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
                IFA Opportunity Map
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                Each bubble = one IFA firm · Size = estimated AUM · Colour = opportunity signal strength
              </div>
            </div>
            <select
              value={selectedMandate}
              onChange={(e) => setSelectedMandate(e.target.value)}
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "4px 10px",
                cursor: "pointer",
                outline: "none",
                fontFamily: "inherit",
              }}
            >
              {MANDATES.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* SVG Scatter */}
          <div style={{ position: "relative", height: "300px" }}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              width="100%"
              height="300"
              style={{ display: "block", overflow: "visible" }}
              onMouseMove={handleSvgMouseMove}
              onMouseLeave={handleBubbleLeave}
            >
              {/* Quadrant: Act Now — top-left amber tint */}
              <rect
                x={PAD_L}
                y={PAD_T}
                width={(SVG_W - PAD_L - PAD_R) * 0.5}
                height={(SVG_H - PAD_T - PAD_B) * 0.45}
                fill="var(--accent)"
                fillOpacity={0.03}
              />

              {/* Quadrant labels */}
              <text x={PAD_L + 8} y={PAD_T + 14} fontSize={10} fontFamily="var(--font-mono)" fill="var(--accent)" fontWeight={500}>
                Act Now
              </text>
              <text x={SVG_W - PAD_R - 52} y={PAD_T + 14} fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
                Monitor
              </text>
              <text x={PAD_L + 8} y={SVG_H - PAD_B - 6} fontSize={10} fontFamily="var(--font-mono)" fill="var(--text-tertiary)">
                Qualify
              </text>

              {/* Horizontal grid lines */}
              {[0, 7, 14, 21, 30].map((d) => {
                const y = recencyToY(d);
                return (
                  <g key={d}>
                    <line
                      x1={PAD_L} y1={y}
                      x2={SVG_W - PAD_R} y2={y}
                      stroke="var(--border-subtle)"
                      strokeWidth={1}
                      opacity={0.6}
                    />
                    <text x={PAD_L - 4} y={y + 4} fontSize={9} fontFamily="var(--font-mono)" fill="var(--text-tertiary)" textAnchor="end">
                      {d === 30 ? "30d+" : `${d}d`}
                    </text>
                  </g>
                );
              })}

              {/* X axis */}
              <line
                x1={PAD_L} y1={SVG_H - PAD_B}
                x2={SVG_W - PAD_R} y2={SVG_H - PAD_B}
                stroke="var(--border-strong)"
                strokeWidth={1}
              />
              {[0, 25, 50, 75, 100].map((v) => (
                <text
                  key={v}
                  x={fitToX(v)}
                  y={SVG_H - PAD_B + 12}
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                  fill="var(--text-tertiary)"
                  textAnchor="middle"
                >
                  {v}
                </text>
              ))}
              <text
                x={SVG_W - PAD_R}
                y={SVG_H - PAD_B + 24}
                fontSize={10}
                fontFamily="var(--font-mono)"
                fill="var(--text-tertiary)"
                textAnchor="end"
              >
                Mandate Fit →
              </text>
              <text
                x={PAD_L - 36}
                y={PAD_T - 8}
                fontSize={10}
                fontFamily="var(--font-mono)"
                fill="var(--text-tertiary)"
              >
                Signal Recency ↑
              </text>

              {/* Universe dots — seeded positions */}
              {universeFirms.map((f, i) => {
                const cx = fitToX(f.fitScore);
                const cy = recencyToY(Math.min(f.signalRecencyDays, 30));
                return (
                  <circle
                    key={f.id}
                    cx={cx}
                    cy={cy}
                    r={3 + (i % 2 === 0 ? 0.5 : 0)}
                    fill="var(--border-strong)"
                    fillOpacity={0.4}
                    style={{ cursor: "default" }}
                  />
                );
              })}

              {/* Named bubbles */}
              {namedFirms.map((f) => {
                const cx = fitToX(f.fitScore);
                const cy = recencyToY(Math.min(f.signalRecencyDays, 30));
                const r = 6 + (Math.sqrt(f.estimatedAUM_m) / Math.sqrt(MAX_AUM)) * 22;
                const clampedR = Math.max(6, Math.min(r, 26));
                const colour = bubbleColour(f.fitScore, f.signalRecencyDays);
                const isTop5 = ["ifa-1", "ifa-2", "ifa-3", "ifa-4", "ifa-5"].includes(f.id);
                return (
                  <g
                    key={f.id}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={() => handleBubbleEnter(f)}
                    onMouseLeave={handleBubbleLeave}
                  >
                    <circle
                      cx={cx}
                      cy={cy}
                      r={clampedR}
                      fill={colour}
                      fillOpacity={0.7}
                      stroke="#FFFFFF"
                      strokeWidth={2}
                    />
                    {isTop5 && (
                      <>
                        <text
                          x={cx}
                          y={cy + clampedR + 11}
                          fontSize={9}
                          fontFamily="var(--font-sans)"
                          fontWeight={600}
                          fill="var(--text-primary)"
                          textAnchor="middle"
                          style={{ pointerEvents: "none" }}
                        >
                          {f.name.split(" ")[0]}
                        </text>
                        {f.id === "ifa-1" && (
                          <text
                            x={cx}
                            y={cy + clampedR + 21}
                            fontSize={8}
                            fontFamily="var(--font-mono)"
                            fill="var(--accent)"
                            textAnchor="middle"
                            style={{ pointerEvents: "none" }}
                          >
                            3d ago
                          </text>
                        )}
                      </>
                    )}
                  </g>
                );
              })}

              {/* Tooltip rendered inside SVG as foreignObject */}
              {tooltip.visible && tooltip.firm && (
                <foreignObject
                  x={Math.min(tooltip.x + 12, SVG_W - 180)}
                  y={Math.max(tooltip.y - 120, 0)}
                  width={200}
                  height={140}
                  style={{ pointerEvents: "none" }}
                >
                  <div
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border-strong)",
                      borderRadius: "8px",
                      padding: "10px 12px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    }}
                  >
                    <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "3px" }}>
                      {tooltip.firm.name}
                    </div>
                    <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "3px" }}>
                      {tooltip.firm.isUniverse ? "Universe" : "DA Firm"} · UK
                    </div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-primary)", marginBottom: "2px" }}>
                      Fit Score: {tooltip.firm.fitScore}/100
                    </div>
                    {tooltip.firm.signal && (
                      <div style={{ fontSize: "10px", color: "var(--text-secondary)", marginBottom: "2px", lineHeight: 1.4 }}>
                        {tooltip.firm.signal.slice(0, 60)}…
                      </div>
                    )}
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: "var(--text-tertiary)" }}>
                      Est. AUM: £{tooltip.firm.estimatedAUM_m >= 1000
                        ? `${(tooltip.firm.estimatedAUM_m / 1000).toFixed(1)}bn`
                        : `${tooltip.firm.estimatedAUM_m}m`}
                    </div>
                  </div>
                </foreignObject>
              )}
            </svg>
          </div>

          {/* Below chart summary */}
          <div style={{ marginTop: "12px", fontSize: "13px", color: "var(--text-secondary)", borderTop: "1px solid var(--border-subtle)", paddingTop: "12px" }}>
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-primary)", fontWeight: 600 }}>23</span>
            {" "}actionable opportunities identified this week. Top recommendation:{" "}
            <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>Paradigm Capital</span>
            {" "}— act within{" "}
            <span style={{ fontFamily: "var(--font-mono)", color: "var(--accent)", fontWeight: 600 }}>48 hours</span>.
          </div>
        </div>

        {/* ── H4: Two columns ─────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>

          {/* LEFT: Signal Stream */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "20px",
              height: "320px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
                Intelligence Signal Stream
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                All signals detected across 6 modules, last 7 days
              </div>
            </div>

            {/* Timeline columns */}
            <div style={{ display: "flex", gap: "8px", flex: 1, alignItems: "flex-start", overflowY: "hidden" }}>
              {signalStream.map((day) => (
                <div key={day.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <span style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "10px",
                    color: "var(--text-tertiary)",
                    marginBottom: "4px",
                    textAlign: "center",
                  }}>
                    {day.day}
                  </span>
                  {day.signals.slice(0, 8).map((sig, i) => {
                    const colour = MODULE_COLOURS[sig.module] ?? "var(--border-strong)";
                    return (
                      <div
                        key={i}
                        title={`${sig.module}: ${sig.text}`}
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: colour,
                          opacity: 0.8,
                          flexShrink: 0,
                          cursor: "default",
                        }}
                      />
                    );
                  })}
                  {day.signals.length > 8 && (
                    <span style={{ fontSize: "9px", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
                      +{day.signals.length - 8}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
              {Object.entries(MODULE_COLOURS).map(([mod, colour]) => (
                <span key={mod} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "10px", color: "var(--text-tertiary)" }}>
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: colour, display: "inline-block", flexShrink: 0 }} />
                  {mod.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT: Competitor Heatmap */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "20px",
              height: "320px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
                Competitor Presence by Platform
              </div>
              <div style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                Number of competing funds per platform per mandate
              </div>
            </div>

            {/* Matrix */}
            <div style={{ flex: 1, overflowX: "auto" }}>
              <table style={{ borderCollapse: "separate", borderSpacing: "3px", tableLayout: "fixed" }}>
                <thead>
                  <tr>
                    <th style={{ width: "36px" }} />
                    {PLATFORMS.map((p) => (
                      <th
                        key={p}
                        style={{
                          width: "36px",
                          fontSize: "9px",
                          fontFamily: "var(--font-mono)",
                          color: "var(--text-tertiary)",
                          fontWeight: 400,
                          textAlign: "center",
                          paddingBottom: "4px",
                        }}
                      >
                        {p}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {competitorHeatmap.map((row, ri) => (
                    <tr key={row.mandate}>
                      <td style={{
                        fontSize: "10px",
                        fontFamily: "var(--font-mono)",
                        color: "var(--text-tertiary)",
                        fontWeight: 500,
                        paddingRight: "4px",
                        textAlign: "right",
                        verticalAlign: "middle",
                      }}>
                        {MANDATE_ABBR[ri]}
                      </td>
                      {PLATFORMS.map((p) => {
                        const cell = row.cells[p];
                        if (!cell) return <td key={p} style={{ width: "32px", height: "32px" }} />;
                        return (
                          <td
                            key={p}
                            title={`${row.mandate} / ${p}: ${cell.competitorCount} competitors, Keyridge ${cell.keyridgePresent ? "listed" : "NOT listed"}`}
                            style={{
                              width: "32px",
                              height: "32px",
                              background: heatmapBg(cell.competitorCount),
                              borderRadius: "4px",
                              position: "relative",
                              textAlign: "center",
                              verticalAlign: "middle",
                              cursor: "default",
                            }}
                          >
                            {/* Corner dot */}
                            <span style={{
                              position: "absolute",
                              top: "3px",
                              right: "3px",
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: cell.keyridgePresent ? "var(--success)" : "var(--danger)",
                              display: "block",
                            }} />
                            <span style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "11px",
                              fontWeight: 500,
                              color: "var(--text-primary)",
                              fontVariantNumeric: "tabular-nums",
                            }}>
                              {cell.competitorCount}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Below matrix */}
            <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: "12px", color: "var(--text-primary)", fontWeight: 500, marginBottom: "2px" }}>
                2 priority gaps: Hargreaves Lansdown and AJ Bell
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-secondary)", marginBottom: "6px" }}>
                Hargreaves Lansdown carries{" "}
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--danger-text)", fontWeight: 600 }}>4 competitors</span>
                {" "}in Global Systematic — Keyridge is not listed.
              </div>
              <button
                style={{
                  fontSize: "11px",
                  color: "var(--accent)",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "underline")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "none")}
              >
                View Platform Flow →
              </button>
            </div>
          </div>
        </div>

        {/* ── H5: Module Activity Cards ────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {moduleCards.map((card) => (
            <div
              key={card.name}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "16px",
                transition: "border-color 150ms ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-strong)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)")}
            >
              {/* Row 1: icon + name + LIVE */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <span style={{ color: card.colour, flexShrink: 0, display: "flex", alignItems: "center" }}>
                  {MODULE_ICON_MAP[card.icon] ?? <Target size={18} strokeWidth={1.5} />}
                </span>
                <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>
                  {card.name}
                </span>
                <span style={{
                  fontSize: "10px",
                  fontWeight: 500,
                  color: "var(--success-text)",
                  background: "var(--success-subtle)",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  letterSpacing: "0.04em",
                  flexShrink: 0,
                }}>
                  LIVE
                </span>
              </div>

              {/* Row 2: Stat */}
              <div style={{
                fontFamily: "var(--font-mono)",
                fontSize: "14px",
                fontWeight: 500,
                color: "var(--text-primary)",
                marginBottom: "8px",
                fontVariantNumeric: "tabular-nums",
              }}>
                {card.stat}
              </div>

              {/* Row 3: Signal + timestamp */}
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: "8px", marginBottom: "12px" }}>
                <span style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  flex: 1,
                }}>
                  {card.signal}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                  flexShrink: 0,
                }}>
                  {card.timestamp}
                </span>
              </div>

              {/* Row 4: Open module link */}
              <a
                href={card.route}
                style={{
                  fontSize: "11px",
                  color: "var(--accent)",
                  textDecoration: "none",
                  display: "inline-block",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "none")}
              >
                Open module →
              </a>
            </div>
          ))}
        </div>

        {/* ── H6: Recent Signals Feed ─────────────────────────────────────── */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
              Recent Signals
            </span>
            <button
              style={{
                fontSize: "11px",
                color: "var(--accent)",
                background: "none",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
                padding: 0,
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "underline")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "none")}
            >
              See all →
            </button>
          </div>

          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            {recentSignals.map((sig, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 16px",
                  borderBottom: i < recentSignals.length - 1 ? "1px solid var(--border-subtle)" : "none",
                  transition: "background 100ms ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLDivElement).style.background = "transparent")}
              >
                {/* Module dot */}
                <span style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  background: sig.colour,
                  opacity: 0.8,
                  flexShrink: 0,
                }} />

                {/* Module badge */}
                <span style={{
                  fontSize: "10px",
                  color: "var(--text-tertiary)",
                  background: "var(--bg-raised)",
                  borderRadius: "4px",
                  padding: "2px 6px",
                  minWidth: "70px",
                  textAlign: "center",
                  flexShrink: 0,
                }}>
                  {sig.module}
                </span>

                {/* Signal text */}
                <span style={{
                  fontSize: "12px",
                  color: "var(--text-secondary)",
                  flex: 1,
                  lineHeight: 1.4,
                }}>
                  {sig.text}
                </span>

                {/* Timestamp */}
                <span style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                  flexShrink: 0,
                }}>
                  {sig.timestamp}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </motion.div>
  );
}
