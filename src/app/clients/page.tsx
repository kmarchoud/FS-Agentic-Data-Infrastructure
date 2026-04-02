"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Printer,
  CalendarDays,
  MessageSquare,
  FileText,
  Layers,
} from "lucide-react";
import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { TopBar } from "@/components/dashboard/topbar";
import { ConnectedDataStrip } from "@/components/dashboard/connected-data-strip";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import {
  TimelineEntry,
} from "@/components/dashboard/timeline-entry";
import { Sparkline } from "@/components/charts/sparkline";
import {
  clients,
  funds,
  clientTimelines,
  clientIntelligence,
  type Client,
  type ClientType,
} from "@/lib/mock-data";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TODAY = new Date("2026-03-31");

function daysSince(dateStr: string): number {
  return Math.floor(
    (TODAY.getTime() - new Date(dateStr).getTime()) / 86_400_000
  );
}

function formatAUM(aum: number): string {
  return aum >= 1000 ? `£${(aum / 1000).toFixed(2)}bn` : `£${aum}m`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function contactColor(days: number): string {
  if (days > 45) return "var(--danger-text)";
  if (days >= 20) return "var(--warning-text)";
  return "var(--text-tertiary)";
}

function riskFillColor(score: number): string {
  if (score > 65) return "#EF4444";
  if (score >= 40) return "#F59E0B";
  return "#22C55E";
}

function riskBadgeVariant(score: number): "urgent" | "at-risk" | "stable" {
  if (score > 65) return "urgent";
  if (score >= 40) return "at-risk";
  return "stable";
}

function riskBadgeLabel(score: number): string {
  if (score > 65) return "High Risk";
  if (score >= 40) return "At Risk";
  return "Stable";
}

function clientTypeVariant(
  type: ClientType
): "pension-fund" | "endowment" | "insurance" | "wealth-manager" | "platform" | "family-office" {
  const map: Record<
    ClientType,
    | "pension-fund"
    | "endowment"
    | "insurance"
    | "wealth-manager"
    | "platform"
    | "family-office"
  > = {
    "Pension Fund": "pension-fund",
    Endowment: "endowment",
    Insurance: "insurance",
    "Wealth Manager": "wealth-manager",
    Platform: "platform",
    "Family Office": "family-office",
  };
  return map[type];
}

function timelineType(
  t: string
): "Meeting" | "Call" | "Email" | "Report Sent" | "RFP Response" {
  if (t === "Meeting") return "Meeting";
  if (t === "Call") return "Call";
  if (t === "Email") return "Email";
  if (t === "Report Sent") return "Report Sent";
  return "RFP Response";
}

/** Deterministic sparkline for a client based on AUM & risk */
function makeSparkline(client: Client): number[] {
  const base = client.aum;
  const drift =
    client.engagementTrend === "declining"
      ? -1
      : client.engagementTrend === "improving"
      ? 1
      : 0;
  return Array.from({ length: 12 }, (_, i) =>
    base +
    Math.sin(i * 0.7 + client.riskScore * 0.1) * base * 0.04 +
    drift * i * base * 0.003
  );
}

/** 12-month engagement decay series */
function makeEngagement(client: Client) {
  const base =
    client.engagementTrend === "improving"
      ? 80
      : client.engagementTrend === "declining"
      ? 20
      : 55;
  const months = [
    "Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar",
  ];
  return months.map((month, i) => ({
    month,
    score: Math.max(
      0,
      Math.min(
        100,
        base +
          (client.engagementTrend === "improving"
            ? i * 1.8
            : client.engagementTrend === "declining"
            ? i * 2.5
            : 0) +
          Math.sin(i * 0.9) * 4
      )
    ),
  }));
}

// ─── Shared tooltip style (light theme) ──────────────────────────────────────

const TOOLTIP_STYLE = {
  background: "#FFFFFF",
  border: "1px solid #D4D4D0",
  borderRadius: "8px",
  padding: "12px",
  fontSize: "12px",
  fontFamily: "var(--font-mono)",
  color: "#1A1A1A",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};
const TOOLTIP_LABEL = {
  color: "#999999",
  fontSize: "11px",
  marginBottom: "4px",
};
const TOOLTIP_ITEM = { color: "#6B6B6B", padding: "2px 0" };

// ─── Sub-atoms ────────────────────────────────────────────────────────────────

function RiskDot({ score }: { score: number }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        backgroundColor: riskFillColor(score),
        flexShrink: 0,
      }}
    />
  );
}

function MiniRiskBar({ score }: { score: number }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <div
      style={{
        width: 48,
        height: 2,
        borderRadius: 9999,
        backgroundColor: "var(--bg-subtle)",
        overflow: "hidden",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          height: "100%",
          width: mounted ? `${score}%` : "0%",
          backgroundColor: riskFillColor(score),
          borderRadius: 9999,
          transition: "width 600ms cubic-bezier(0.4,0,0.2,1) 200ms",
        }}
      />
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: "0 0 10px",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--text-tertiary)",
      }}
    >
      {children}
    </p>
  );
}

function Card({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Intelligence source badge styles ────────────────────────────────────────

const SOURCE_BADGE: Record<
  string,
  { bg: string; border: string; text: string }
> = {
  Reuters: {
    bg: "rgba(234,88,12,0.08)",
    border: "rgba(234,88,12,0.20)",
    text: "#C2410C",
  },
  Bloomberg: {
    bg: "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.20)",
    text: "#B45309",
  },
  FT: {
    bg: "rgba(236,72,153,0.08)",
    border: "rgba(236,72,153,0.20)",
    text: "#DB2777",
  },
  Morningstar: {
    bg: "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.20)",
    text: "#059669",
  },
  LinkedIn: {
    bg: "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.20)",
    text: "#2563EB",
  },
  "Companies House": {
    bg: "rgba(107,114,128,0.08)",
    border: "rgba(107,114,128,0.20)",
    text: "#4B5563",
  },
  "Insurance Times": {
    bg: "rgba(139,92,246,0.08)",
    border: "rgba(139,92,246,0.20)",
    text: "#7C3AED",
  },
  "LGPS Tracker": {
    bg: "rgba(6,182,212,0.08)",
    border: "rgba(6,182,212,0.20)",
    text: "#0891B2",
  },
};

const DEFAULT_SOURCE = {
  bg: "rgba(107,114,128,0.08)",
  border: "rgba(107,114,128,0.20)",
  text: "#4B5563",
};

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ client }: { client: Client }) {
  const clientFunds = funds.filter((f) =>
    client.fundsHeld.includes(f.name)
  );
  const signals = (clientIntelligence[client.id] ?? []).slice(0, 3);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {/* ── Left column ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Funds Held */}
        <Card style={{ padding: 0 }}>
          <div style={{ padding: "16px 16px 10px" }}>
            <Label>Funds Held</Label>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Fund", "YTD", "vs Benchmark"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 14px",
                      fontSize: 11,
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                      borderBottom: "1px solid var(--border-strong)",
                      textAlign: h === "Fund" ? "left" : "right",
                      backgroundColor: "var(--bg-page)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientFunds.map((f) => {
                const diff = f.ytdReturn - f.benchmarkReturn;
                return (
                  <tr
                    key={f.id}
                    style={{
                      borderBottom: "1px solid var(--border-subtle)",
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 14px",
                        fontSize: 13,
                        color: "var(--text-secondary)",
                      }}
                    >
                      {f.name.replace("Meridian ", "")}
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        textAlign: "right",
                        color:
                          f.ytdReturn >= 0
                            ? "var(--success-text)"
                            : "var(--danger-text)",
                      }}
                    >
                      {f.ytdReturn > 0 ? "+" : ""}
                      {f.ytdReturn.toFixed(1)}%
                    </td>
                    <td
                      style={{
                        padding: "10px 14px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        textAlign: "right",
                        color:
                          diff >= 0
                            ? "var(--success-text)"
                            : "var(--danger-text)",
                      }}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        {/* Mandate Summary */}
        <Card>
          <Label>Mandate Summary</Label>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 4,
            }}
          >
            {[
              {
                key: "Objective",
                val: client.investmentObjective,
              },
              {
                key: "Constraints",
                val: client.keyConstraints.join(" · "),
              },
              {
                key: "Relationship Since",
                val: formatDate(client.relationshipSince),
              },
              {
                key: "Mandate Renewal",
                val: client.mandateRenewalDate
                  ? formatDate(client.mandateRenewalDate)
                  : "No fixed date",
              },
            ].map(({ key, val }) => (
              <div key={key} style={{ display: "flex", gap: 12 }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    color: "var(--text-tertiary)",
                    minWidth: 128,
                    flexShrink: 0,
                    paddingTop: 1,
                  }}
                >
                  {key}
                </span>
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                  }}
                >
                  {val}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ── Right column ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Wallet Share donut */}
        <Card>
          <Label>Wallet Share</Label>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 4,
            }}
          >
            <div style={{ width: 120, height: 120, flexShrink: 0 }}>
              <WalletDonut pct={client.walletSharePercent} />
            </div>
            <div>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: "0 0 4px",
                  tabularNums: "tabular-nums",
                } as React.CSSProperties}
              >
                {client.walletSharePercent}%
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--text-secondary)",
                  margin: "0 0 4px",
                }}
              >
                of {formatAUM(client.totalEstimatedAUM)} estimated AUM
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: "var(--text-tertiary)",
                  margin: 0,
                }}
              >
                Meridian {formatAUM(client.aum)} · Other{" "}
                {formatAUM(client.totalEstimatedAUM - client.aum)}
              </p>
            </div>
          </div>
        </Card>

        {/* Recent Signals */}
        <Card>
          <Label>Recent Signals</Label>
          {signals.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 10,
                alignItems: "flex-start",
                padding: "10px 0",
                borderBottom:
                  i < signals.length - 1
                    ? "1px solid var(--border-subtle)"
                    : "none",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  backgroundColor: "#F59E0B",
                  marginTop: 5,
                  flexShrink: 0,
                }}
              />
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--text-primary)",
                    lineHeight: 1.4,
                  }}
                >
                  {item.headline}
                </p>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                  }}
                >
                  {item.source} · {formatDate(item.date)}
                </p>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ─── Wallet Donut (inline — light theme) ─────────────────────────────────────

function WalletDonut({ pct }: { pct: number }) {
  const data = [
    { name: "Meridian", value: pct },
    { name: "Other", value: 100 - pct },
  ];
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          innerRadius="62%"
          outerRadius="82%"
          stroke="#FFFFFF"
          strokeWidth={2}
          paddingAngle={2}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          isAnimationActive
          animationDuration={600}
          animationEasing="ease-out"
        >
          <Cell fill="#F59E0B" />
          <Cell fill="#EDEDEB" />
        </Pie>
        {/* SVG centre labels */}
        <text
          x="50%"
          y="44%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 15,
            fontWeight: 600,
            fill: "#1A1A1A",
          }}
        >
          {pct}%
        </text>
        <text
          x="50%"
          y="60%"
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9,
            fill: "#999999",
          }}
        >
          Wallet Share
        </text>
      </PieChart>
    </ResponsiveContainer>
  );
}

// ─── Timeline Tab ─────────────────────────────────────────────────────────────

function TimelineTab({ client }: { client: Client }) {
  const entries = [...(clientTimelines[client.id] ?? [])].reverse();
  return (
    <Card>
      <Label>Interaction History</Label>
      <div style={{ marginTop: 16 }}>
        <div style={{ position: "relative", paddingLeft: "24px" }}>
          <div style={{ position: "absolute", left: "7px", top: 0, bottom: 0, width: "1px", background: "var(--border)" }} />
          {entries.map((entry, i) => (
            <TimelineEntry
              key={i}
              type={timelineType(entry.type)}
              date={formatDate(entry.date)}
              description={entry.description}
              contact={`with ${entry.meridianContact}`}
              outcome={entry.outcome}
              isLast={i === entries.length - 1}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}

// ─── Engagement Tab ───────────────────────────────────────────────────────────

function EngagementTab({ client }: { client: Client }) {
  const engData = makeEngagement(client);
  const clientFunds = funds.filter((f) => client.fundsHeld.includes(f.name));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Engagement Decay area chart */}
      <Card>
        <Label>Engagement Score (12 months)</Label>
        <div style={{ height: 160, marginTop: 8 }}>
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={engData}
              margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                stroke="var(--border-subtle)"
                strokeOpacity={0.6}
                vertical={false}
              />
              <XAxis
                dataKey="month"
                tick={{
                  fontSize: 11,
                  fill: "#999999",
                  fontFamily: "var(--font-mono)",
                }}
                axisLine={{ stroke: "#D4D4D0" }}
                tickLine={false}
              />
              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#999999",
                  fontFamily: "var(--font-mono)",
                }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                labelStyle={TOOLTIP_LABEL}
                itemStyle={TOOLTIP_ITEM}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#F59E0B"
                strokeWidth={2}
                fill="url(#engGrad)"
                dot={false}
                activeDot={{
                  r: 4,
                  stroke: "#F59E0B",
                  fill: "#FFFFFF",
                  strokeWidth: 2,
                }}
                isAnimationActive
                animationDuration={600}
                animationEasing="ease-out"
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Performance vs Benchmark */}
      <Card>
        <Label>Performance vs Benchmark (YTD)</Label>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
            marginTop: 8,
          }}
        >
          {clientFunds.map((f) => {
            const diff = f.ytdReturn - f.benchmarkReturn;
            const maxVal = 10;
            return (
              <div key={f.id}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 12,
                      color: "var(--text-secondary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "60%",
                    }}
                  >
                    {f.name.replace("Meridian ", "")}
                  </span>
                  <div
                    style={{
                      display: "flex",
                      gap: 12,
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color:
                          diff >= 0
                            ? "var(--success-text)"
                            : "var(--danger-text)",
                      }}
                    >
                      {f.ytdReturn > 0 ? "+" : ""}
                      {f.ytdReturn.toFixed(1)}%
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--text-tertiary)",
                      }}
                    >
                      bm {f.benchmarkReturn.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    position: "relative",
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: "var(--bg-raised)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${Math.max(0, (f.ytdReturn / maxVal) * 100)}%`,
                      backgroundColor:
                        diff >= 0 ? "var(--success)" : "var(--danger)",
                      borderRadius: 4,
                      transition: "width 600ms cubic-bezier(0.4,0,0.2,1) 200ms",
                    }}
                  />
                  {/* Benchmark line */}
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: `${Math.max(0, (f.benchmarkReturn / maxVal) * 100)}%`,
                      height: "100%",
                      width: 2,
                      backgroundColor: "var(--text-tertiary)",
                      opacity: 0.7,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Wallet Share donut */}
      <Card
        style={{
          display: "flex",
          alignItems: "center",
          gap: 28,
        }}
      >
        <div style={{ width: 160, height: 160, flexShrink: 0 }}>
          <WalletDonut pct={client.walletSharePercent} />
        </div>
        <div>
          <Label>Wallet Share</Label>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 24,
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "4px 0 6px",
            }}
          >
            {client.walletSharePercent}%
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              margin: "0 0 4px",
            }}
          >
            of estimated {formatAUM(client.totalEstimatedAUM)} total AUM
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              color: "var(--text-tertiary)",
              margin: 0,
            }}
          >
            Meridian: {formatAUM(client.aum)} · Other:{" "}
            {formatAUM(client.totalEstimatedAUM - client.aum)}
          </p>
        </div>
      </Card>
    </div>
  );
}

// ─── Intelligence Tab ─────────────────────────────────────────────────────────

function IntelligenceTab({ client }: { client: Client }) {
  const items = clientIntelligence[client.id] ?? [];
  return (
    <Card>
      <Label>Market &amp; Intelligence Signals</Label>
      <div style={{ marginTop: 4 }}>
        {items.map((item, i) => {
          const style = SOURCE_BADGE[item.source] ?? DEFAULT_SOURCE;
          return (
            <div
              key={i}
              style={{
                padding: "14px 0",
                borderBottom:
                  i < items.length - 1
                    ? "1px solid var(--border-subtle)"
                    : "none",
                display: "flex",
                gap: 14,
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "2px 8px",
                  borderRadius: 4,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  border: `1px solid ${style.border}`,
                  backgroundColor: style.bg,
                  color: style.text,
                }}
              >
                {item.source}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13,
                    color: "var(--text-primary)",
                    lineHeight: 1.5,
                  }}
                >
                  {item.headline}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontSize: 13,
                    color: "var(--text-secondary)",
                    lineHeight: 1.5,
                    fontStyle: "italic",
                  }}
                >
                  {item.relevance}
                </p>
                <span
                  style={{
                    display: "block",
                    marginTop: 4,
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--text-tertiary)",
                  }}
                >
                  {formatDate(item.date)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ─── Pre-Meeting Brief Tab ────────────────────────────────────────────────────

function BriefSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p
        style={{
          margin: "0 0 10px",
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text-tertiary)",
          paddingBottom: 6,
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

function PreMeetingBriefTab({ client }: { client: Client }) {
  const days = daysSince(client.lastContactDate);
  const clientFunds = funds.filter((f) => client.fundsHeld.includes(f.name));
  const intelItems = (clientIntelligence[client.id] ?? []).slice(0, 3);

  const risks: string[] = [];
  if (days > 45)
    risks.push(`No contact in ${days} days — relationship risk elevated`);
  if (client.riskScore > 65)
    risks.push(
      `Risk score ${client.riskScore}/100 — requires immediate engagement`
    );
  clientFunds.forEach((f) => {
    const diff = f.ytdReturn - f.benchmarkReturn;
    if (diff < 0)
      risks.push(
        `${f.name.replace("Meridian ", "")} underperforming benchmark by ${Math.abs(diff).toFixed(1)}%`
      );
  });
  if (client.mandateRenewalDate) {
    const renewDays = Math.floor(
      (new Date(client.mandateRenewalDate).getTime() - TODAY.getTime()) /
        86_400_000
    );
    if (renewDays < 90 && renewDays > 0)
      risks.push(
        `Mandate renewal in ${renewDays} days — ${formatDate(client.mandateRenewalDate)}`
      );
  }

  const opportunities: string[] = [];
  if (client.engagementTrend === "improving")
    opportunities.push(
      "Engagement trend improving — good time to introduce new propositions"
    );
  if (client.walletSharePercent < 20)
    opportunities.push(
      `Wallet share at ${client.walletSharePercent}% — room to grow from ${formatAUM(client.totalEstimatedAUM)} estimated total AUM`
    );
  intelItems.forEach((item) => opportunities.push(item.relevance));

  const talkingPoints = [
    `Open with market update relevant to ${client.investmentObjective.toLowerCase()}`,
    client.fundsHeld.length > 1
      ? `Review combined performance of ${client.fundsHeld.length} holdings and cross-portfolio positioning`
      : `Review ${client.fundsHeld[0].replace("Meridian ", "")} performance in detail`,
    `Address any benchmark deviation proactively`,
    `Discuss 2026 strategic priorities and investment themes`,
    client.mandateRenewalDate
      ? `Confirm mandate renewal timeline and any structural changes`
      : `Explore opportunities to formalise and deepen the relationship`,
  ];

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>

      <div
        className="no-print"
        style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}
      >
        <button
          onClick={() => window.print()}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 14px",
            backgroundColor: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
            color: "var(--text-secondary)",
            transition: "all 120ms ease",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = "var(--border-strong)";
            el.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.borderColor = "var(--border)";
            el.style.color = "var(--text-secondary)";
          }}
        >
          <Printer size={14} strokeWidth={1.5} />
          Print Brief
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Header */}
        <div
          style={{
            paddingBottom: 20,
            borderBottom: "2px solid var(--border-strong)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p
                style={{
                  margin: "0 0 4px",
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                }}
              >
                Pre-Meeting Brief
              </p>
              <h2
                style={{
                  margin: "0 0 4px",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                {client.name}
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: "var(--text-secondary)" }}>
                Prepared by Regulex Intelligence · {formatDate("2026-03-31")}
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p
                style={{
                  margin: "0 0 2px",
                  fontFamily: "var(--font-mono)",
                  fontSize: 20,
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                {formatAUM(client.aum)}
              </p>
              <p style={{ margin: "0 0 2px", fontSize: 13, color: "var(--text-secondary)" }}>
                AUM under Meridian management
              </p>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  color: contactColor(days),
                }}
              >
                Last contact {days}d ago
              </p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <BriefSection title="Executive Summary">
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "var(--text-secondary)",
              lineHeight: 1.65,
            }}
          >
            {client.notes}
          </p>
        </BriefSection>

        {/* Holdings */}
        <BriefSection title="Current Holdings">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {clientFunds.map((f) => {
              const diff = f.ytdReturn - f.benchmarkReturn;
              return (
                <div
                  key={f.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    backgroundColor: "var(--bg-raised)",
                    borderRadius: 6,
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                    {f.name}
                  </span>
                  <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color: "var(--text-primary)",
                      }}
                    >
                      YTD {f.ytdReturn > 0 ? "+" : ""}
                      {f.ytdReturn.toFixed(1)}%
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        color:
                          diff >= 0
                            ? "var(--success-text)"
                            : "var(--danger-text)",
                      }}
                    >
                      {diff > 0 ? "+" : ""}
                      {diff.toFixed(1)}% vs benchmark
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </BriefSection>

        {/* Risks */}
        {risks.length > 0 && (
          <BriefSection title="Key Risks">
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {risks.map((r, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "var(--danger-text)",
                    fontWeight: 500,
                  }}
                >
                  {r}
                </li>
              ))}
            </ul>
          </BriefSection>
        )}

        {/* Opportunities */}
        {opportunities.length > 0 && (
          <BriefSection title="Opportunities">
            <ul
              style={{
                margin: 0,
                paddingLeft: 18,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              {opportunities.map((o, i) => (
                <li
                  key={i}
                  style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}
                >
                  {o}
                </li>
              ))}
            </ul>
          </BriefSection>
        )}

        {/* Talking Points */}
        <BriefSection title="Suggested Talking Points">
          <ol
            style={{
              margin: 0,
              paddingLeft: 18,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {talkingPoints.map((tp, i) => (
              <li
                key={i}
                style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.5 }}
              >
                {tp}
              </li>
            ))}
          </ol>
        </BriefSection>

        {/* Contacts */}
        <BriefSection title="Relationship Manager">
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                backgroundColor: "var(--bg-raised)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 11,
                fontWeight: 500,
                color: "var(--text-secondary)",
                flexShrink: 0,
              }}
            >
              {client.assignedRM
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--text-primary)",
                }}
              >
                {client.assignedRM}
              </p>
              <p
                style={{ margin: "1px 0 0", fontSize: 11, color: "var(--text-tertiary)" }}
              >
                Assigned Relationship Manager
              </p>
            </div>
          </div>
        </BriefSection>

        {/* Sensitivities */}
        <BriefSection title="Client Sensitivities">
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {client.keyConstraints.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 13,
                  color: "var(--text-secondary)",
                }}
              >
                <span
                  style={{
                    width: 4,
                    height: 4,
                    borderRadius: "50%",
                    backgroundColor: "var(--text-tertiary)",
                    flexShrink: 0,
                    display: "inline-block",
                  }}
                />
                {c}
              </div>
            ))}
          </div>
        </BriefSection>
      </div>
    </>
  );
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TAB_LIST = [
  { label: "Overview", value: "overview" },
  { label: "Timeline", value: "timeline" },
  { label: "Engagement", value: "engagement" },
  { label: "Intelligence", value: "intelligence" },
  { label: "Pre-Meeting Brief", value: "brief" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

function ClientsPageInner() {
  const searchParams = useSearchParams();

  // Resolve initial client from ?id= param, falling back to the first client
  const paramId  = searchParams.get("id");
  const paramTab = searchParams.get("tab");

  const initialId  = clients.find((c) => c.id === paramId)?.id ?? clients[0].id;
  // "brief" maps directly to the TAB_LIST value; any unrecognised value falls
  // back to "overview" so the tab bar is always in a valid state.
  const validTabValues = TAB_LIST.map((t) => t.value);
  const initialTab = paramTab && validTabValues.includes(paramTab) ? paramTab : "overview";

  const [search, setSearch]       = useState("");
  const [selectedId, setSelectedId] = useState(initialId);
  const [activeTab, setActiveTab]   = useState(initialTab);

  // If the URL changes after first render (e.g. browser back/forward), sync state.
  useEffect(() => {
    const id  = searchParams.get("id");
    const tab = searchParams.get("tab");
    if (id) {
      const match = clients.find((c) => c.id === id);
      if (match) setSelectedId(match.id);
    }
    if (tab && validTabValues.includes(tab)) {
      setActiveTab(tab);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
  const selected = clients.find((c) => c.id === selectedId) ?? clients[0];
  const days = daysSince(selected.lastContactDate);
  const sparklineData = makeSparkline(selected);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--bg-page)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <TopBar title="Client Intelligence" />
      <ConnectedDataStrip />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          height: "calc(100vh - 52px)",
          overflow: "hidden",
        }}
      >
        {/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
        <div
          style={{
            borderRight: "1px solid var(--border)",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "var(--bg-card)",
          }}
        >
          {/* Search */}
          <div
            style={{
              padding: 12,
              borderBottom: "1px solid var(--border-subtle)",
              flexShrink: 0,
            }}
          >
            <div style={{ position: "relative" }}>
              <Search
                size={14}
                strokeWidth={1.5}
                style={{
                  position: "absolute",
                  left: 10,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--text-tertiary)",
                  pointerEvents: "none",
                }}
              />
              <input
                type="text"
                placeholder="Search clients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "7px 10px 7px 30px",
                  backgroundColor: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: 6,
                  fontSize: 13,
                  color: "var(--text-primary)",
                  outline: "none",
                  fontFamily: "var(--font-sans)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--border-strong)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              />
            </div>
          </div>

          {/* Client list */}
          <div style={{ flex: 1 }}>
            {filtered.map((client) => {
              const isActive = client.id === selectedId;
              return (
                <button
                  key={client.id}
                  onClick={() => {
                    setSelectedId(client.id);
                    setActiveTab("overview");
                  }}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    appearance: "none",
                    background: isActive ? "var(--bg-raised)" : "transparent",
                    border: "none",
                    borderBottom: "1px solid var(--border-subtle)",
                    borderLeft: isActive
                      ? "2px solid var(--accent)"
                      : "2px solid transparent",
                    padding: "12px 14px 12px 12px",
                    cursor: "pointer",
                    transition: "background-color 120ms ease",
                    display: "block",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "var(--bg-raised)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        "transparent";
                  }}
                >
                  {/* Name row */}
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      marginBottom: 5,
                    }}
                  >
                    {client.name}
                  </div>
                  {/* Meta row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--text-tertiary)",
                        flexShrink: 0,
                      }}
                    >
                      {formatAUM(client.aum)}
                    </span>
                    <Badge variant={clientTypeVariant(client.type)}>
                      {client.type}
                    </Badge>
                    <span style={{ flex: 1 }} />
                    <RiskDot score={client.riskScore} />
                    <MiniRiskBar score={client.riskScore} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
        <div
          style={{
            overflowY: "auto",
            backgroundColor: "var(--bg-page)",
          }}
        >
          <div style={{ padding: 24 }}>
            {/* Client header card */}
            <Card style={{ marginBottom: 24 }}>
              {/* Row 1: name + badge + RM pill */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  flexWrap: "wrap",
                  marginBottom: 12,
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: 20,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {selected.name}
                </h2>
                <Badge variant={clientTypeVariant(selected.type)}>
                  {selected.type}
                </Badge>
                {/* RM pill */}
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "3px 10px",
                    backgroundColor: "var(--bg-raised)",
                    border: "1px solid var(--border)",
                    borderRadius: 9999,
                    fontSize: 12,
                    color: "var(--text-secondary)",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      backgroundColor: "var(--bg-subtle)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 9,
                      fontWeight: 600,
                      color: "var(--text-secondary)",
                    }}
                  >
                    {selected.assignedRM
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  {selected.assignedRM}
                </span>
              </div>

              {/* Row 2: AUM + sparkline + risk badge + last contact */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  flexWrap: "wrap",
                  marginBottom: 16,
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 24,
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.02em",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {formatAUM(selected.aum)}
                </span>
                {/* Sparkline */}
                <div style={{ width: 120, height: 36 }}>
                  <Sparkline
                    data={sparklineData}
                    color="#F59E0B"
                    width={120}
                    height={36}
                  />
                </div>
                <Badge variant={riskBadgeVariant(selected.riskScore)}>
                  {riskBadgeLabel(selected.riskScore)}
                </Badge>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--text-tertiary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Last contact
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 12,
                      color: contactColor(days),
                    }}
                  >
                    {days}d ago
                  </span>
                </div>
              </div>

              {/* Row 3: action buttons */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {/* Primary CTA */}
                <button
                  onClick={() => setActiveTab("brief")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    backgroundColor: "var(--accent)",
                    color: "#FFFFFF",
                    border: "none",
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 500,
                    cursor: "pointer",
                    transition: "background-color 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--accent-hover)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                      "var(--accent)";
                  }}
                >
                  <FileText size={13} strokeWidth={1.5} />
                  Generate Pre-Meeting Brief
                </button>
                {/* Ghost buttons */}
                {[
                  { icon: <MessageSquare size={13} strokeWidth={1.5} />, label: "Log Interaction" },
                  { icon: <CalendarDays size={13} strokeWidth={1.5} />, label: "Schedule Meeting" },
                ].map(({ icon, label }) => (
                  <button
                    key={label}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "8px 12px",
                      backgroundColor: "transparent",
                      color: "var(--text-secondary)",
                      border: "none",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 120ms ease",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.backgroundColor = "var(--bg-raised)";
                      el.style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLButtonElement;
                      el.style.backgroundColor = "transparent";
                      el.style.color = "var(--text-secondary)";
                    }}
                  >
                    {icon}
                    {label}
                  </button>
                ))}
              </div>
            </Card>

            {/* Tabs */}
            <Tabs
              tabs={TAB_LIST}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />

            {/* Tab content */}
            {activeTab === "overview" && <OverviewTab client={selected} />}
            {activeTab === "timeline" && <TimelineTab client={selected} />}
            {activeTab === "engagement" && <EngagementTab client={selected} />}
            {activeTab === "intelligence" && (
              <IntelligenceTab client={selected} />
            )}
            {activeTab === "brief" && (
              <Card>
                <PreMeetingBriefTab client={selected} />
              </Card>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ClientsPage() {
  return (
    <Suspense>
      <ClientsPageInner />
    </Suspense>
  );
}
