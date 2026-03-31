"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingDown, TrendingUp, ArrowDownLeft, ArrowUpRight, AlertTriangle } from "lucide-react";
import { TopBar } from "@/components/dashboard/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
  ReferenceLine,
} from "recharts";
import { funds, flowHistory, firm } from "@/lib/mock-data";

// ── Light-theme chart constants ───────────────────────────────────────────────

const TOOLTIP_CONTENT_STYLE = {
  background: "#FFFFFF",
  border: "1px solid #D4D4D0",
  borderRadius: "8px",
  padding: "12px",
  fontSize: "12px",
  fontFamily: "var(--font-mono)",
  color: "#1A1A1A",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};
const TOOLTIP_LABEL_STYLE = { color: "#999999", fontSize: "11px", marginBottom: "4px" };
const TOOLTIP_ITEM_STYLE = { color: "#6B6B6B", padding: "2px 0" };
const TICK_STYLE = { fontSize: 11, fill: "#999999", fontFamily: "var(--font-mono)" };

// ── Data preparation ──────────────────────────────────────────────────────────

const netFlowData = flowHistory.map((m) => ({
  month: m.month.replace(" 2025", " '25").replace(" 2026", " '26"),
  netFlow: m.netFlow,
}));

const channelData = flowHistory.map((m) => ({
  month: m.month.replace(" 2025", " '25").replace(" 2026", " '26"),
  Pension: m.pension,
  Endowment: m.endowment,
  Insurance: m.insurance,
  Wealth: m.wealth,
  Platform: m.platform,
}));

const CHANNEL_COLOURS: Record<string, string> = {
  Pension:   "#F59E0B",
  Endowment: "#3B82F6",
  Insurance: "#8B5CF6",
  Wealth:    "#10B981",
  Platform:  "#EC4899",
};

const topInflowsData = [
  { name: "Rathbones Group",             fund: "UK Balanced",        qtd: 18,  ytd: 24  },
  { name: "Cambridge Univ. Endowment",   fund: "Diversified Income", qtd: 12,  ytd: 19  },
  { name: "Hargreaves Lansdown",         fund: "UK Balanced",        qtd: 9,   ytd: 15  },
  { name: "Caledonian Family Office",    fund: "Diversified Income", qtd: 7,   ytd: 11  },
  { name: "St. James's Place",           fund: "UK Balanced",        qtd: 5,   ytd: 8   },
];

const topOutflowsData = [
  { name: "Aviva Staff Pension",         fund: "Global Multi-Asset", qtd: -45, ytd: -72 },
  { name: "Lancashire County Pension",   fund: "Global Multi-Asset", qtd: -38, ytd: -61 },
  { name: "Phoenix Group Insurance",     fund: "Strategic Bond",     qtd: -32, ytd: -48 },
  { name: "West Midlands Pension",       fund: "Global Multi-Asset", qtd: -22, ytd: -35 },
  { name: "Scottish Widows Inv.",        fund: "Global Multi-Asset", qtd: -18, ytd: -29 },
];

const mandateAlerts = [
  {
    client: "Church of England Pensions Board",
    fund: "Absolute Return Fund",
    message: "Mandate objective: Cash +3%. Actual YTD: −0.4%. Objective breach risk.",
    severity: "high" as const,
    daysToRenewal: 152,
  },
  {
    client: "Aviva Staff Pension Scheme",
    fund: "Global Multi-Asset Fund",
    message: "No contact in 61 days. Mandate renewal 07 May. Competitor pitching LDI alternative.",
    severity: "high" as const,
    daysToRenewal: 37,
  },
  {
    client: "Lancashire County Pension Fund",
    fund: "Global Multi-Asset Fund",
    message: "Underperformance −1.7% vs benchmark. Renewal 21 May. CIO change unaddressed.",
    severity: "medium" as const,
    daysToRenewal: 51,
  },
];

// ── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

// ── Sub-components ────────────────────────────────────────────────────────────

function FlowValue({ value, size = 13 }: { value: number; size?: number }) {
  const sign = value >= 0 ? "+" : "";
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: `${size}px`,
        fontVariantNumeric: "tabular-nums",
        color: value >= 0 ? "var(--success-text)" : "var(--danger-text)",
      }}
    >
      {sign}£{Math.abs(value)}m
    </span>
  );
}

function ReturnVsBenchmark({ ytd, benchmark }: { ytd: number; benchmark: number }) {
  const diff = +(ytd - benchmark).toFixed(1);
  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "13px",
        fontVariantNumeric: "tabular-nums",
        color: diff >= 0 ? "var(--success-text)" : "var(--danger-text)",
      }}
    >
      {diff >= 0 ? "+" : ""}{diff}%
    </span>
  );
}

// ── Toggle Button ─────────────────────────────────────────────────────────────

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "4px 12px",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: active ? 500 : 400,
        color: active ? "var(--text-primary)" : "var(--text-secondary)",
        background: active ? "var(--bg-raised)" : "transparent",
        border: active ? "1px solid var(--border-strong)" : "1px solid transparent",
        cursor: "pointer",
        transition: "all 120ms ease",
      }}
    >
      {children}
    </button>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function FlowsPage() {
  const [flowTab, setFlowTab] = useState<"inflows" | "outflows">("inflows");

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <TopBar title="Flow Intelligence" />

      <main style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}
        >
          {[
            {
              label: "Net Flows MTD",
              value: firm.netFlowsMTD,      // −43
              valueFormat: (n: number) => `${n < 0 ? "−" : "+"}£${Math.abs(Math.round(n))}m`,
              delta: "vs prior month",
              deltaDirection: "down" as const,
              variant: "default" as const,
              icon: <TrendingDown size={16} strokeWidth={1.5} />,
            },
            {
              label: "Net Flows QTD",
              value: firm.netFlowsQTD,      // −127
              valueFormat: (n: number) => `${n < 0 ? "−" : "+"}£${Math.abs(Math.round(n))}m`,
              delta: "3 consecutive negative months",
              deltaDirection: "down" as const,
              variant: "critical" as const,
              icon: <TrendingDown size={16} strokeWidth={1.5} />,
            },
            {
              label: "Gross Inflows QTD",
              value: firm.grossInflowsQTD,  // 312
              valueFormat: (n: number) => `£${Math.round(n)}m`,
              delta: "+£18m vs Q3 2025",
              deltaDirection: "up" as const,
              variant: "default" as const,
              icon: <ArrowUpRight size={16} strokeWidth={1.5} />,
            },
            {
              label: "Gross Outflows QTD",
              value: firm.grossOutflowsQTD, // 439
              valueFormat: (n: number) => `£${Math.round(n)}m`,
              delta: "−£54m vs Q3 2025",
              deltaDirection: "down" as const,
              variant: "default" as const,
              icon: <ArrowDownLeft size={16} strokeWidth={1.5} />,
            },
          ].map((card, i) => (
            <motion.div key={card.label} custom={i} variants={fadeUp}>
              <StatCard
                label={card.label}
                value={card.value}
                valueFormat={card.valueFormat}
                delta={card.delta}
                deltaDirection={card.deltaDirection}
                variant={card.variant}
                icon={card.icon}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* ── Charts: Net Flows + Channel ─────────────────────────────────── */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "16px" }}
        >
          {/* Monthly Net Flows bar chart */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                  Monthly Net Flows
                </p>
                <p style={{ fontSize: "11px", color: "var(--text-tertiary)", margin: "3px 0 0", fontFamily: "var(--font-mono)" }}>
                  Apr 2025 – Mar 2026 · £m
                </p>
              </div>
              <span style={{ fontSize: "11px", color: "var(--text-tertiary)" }}>
                green = inflow · red = outflow
              </span>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <RechartsBarChart
                data={netFlowData}
                barCategoryGap="40%"
                margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--border-subtle)"
                  strokeOpacity={0.6}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={TICK_STYLE}
                  axisLine={{ stroke: "#D4D4D0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={TICK_STYLE}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `£${v}m`}
                />
                <Tooltip
                  contentStyle={TOOLTIP_CONTENT_STYLE}
                  labelStyle={TOOLTIP_LABEL_STYLE}
                  itemStyle={TOOLTIP_ITEM_STYLE}
                  cursor={{ fill: "var(--bg-raised)" }}
                  formatter={(value: number) => [
                    `${value >= 0 ? "+" : ""}£${value}m`,
                    "Net Flow",
                  ]}
                />
                <ReferenceLine y={0} stroke="#D4D4D0" strokeWidth={1} />
                <Bar dataKey="netFlow" radius={[4, 4, 0, 0]} barSize={22} isAnimationActive animationDuration={600}>
                  {netFlowData.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.netFlow >= 0 ? "#16A34A" : "#DC2626"}
                      fillOpacity={0.7}
                    />
                  ))}
                </Bar>
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>

          {/* Flows by Channel grouped bar */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "20px",
            }}
          >
            <div style={{ marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                Flows by Channel
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-tertiary)", margin: "3px 0 0", fontFamily: "var(--font-mono)" }}>
                Monthly net flows by client type · £m
              </p>
            </div>
            <ResponsiveContainer width="100%" height={210}>
              <RechartsBarChart
                data={channelData}
                barCategoryGap="30%"
                margin={{ top: 4, right: 4, left: -12, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="var(--border-subtle)"
                  strokeOpacity={0.6}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  tick={TICK_STYLE}
                  axisLine={{ stroke: "#D4D4D0" }}
                  tickLine={false}
                />
                <YAxis
                  tick={TICK_STYLE}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v: number) => `${v}m`}
                />
                <Tooltip
                  contentStyle={TOOLTIP_CONTENT_STYLE}
                  labelStyle={TOOLTIP_LABEL_STYLE}
                  itemStyle={TOOLTIP_ITEM_STYLE}
                  cursor={{ fill: "var(--bg-raised)" }}
                  formatter={(value: number, name: string) => [
                    `${value >= 0 ? "+" : ""}£${value}m`,
                    name,
                  ]}
                />
                <Legend
                  wrapperStyle={{
                    fontSize: "11px",
                    fontFamily: "var(--font-sans)",
                    color: "var(--text-secondary)",
                    paddingTop: "8px",
                  }}
                  iconSize={7}
                  iconType="circle"
                />
                {Object.entries(CHANNEL_COLOURS).map(([key, colour]) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={colour} isAnimationActive animationDuration={600} />
                ))}
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* ── Fund Flow Table ─────────────────────────────────────────────── */}
        <motion.div
          custom={5}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Fund Flow Analysis
            </p>
            <span
              style={{
                fontSize: "11px",
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-mono)",
              }}
            >
              Red border = underperforming &amp; outflowing
            </span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-page)" }}>
                  {[
                    { label: "Fund",          align: "left"  },
                    { label: "AUM",           align: "right" },
                    { label: "YTD Return",    align: "right" },
                    { label: "vs Benchmark",  align: "right" },
                    { label: "Flows MTD",     align: "right" },
                    { label: "Flows QTD",     align: "right" },
                    { label: "Flows YTD",     align: "right" },
                  ].map((h) => (
                    <th
                      key={h.label}
                      style={{
                        padding: "10px 12px",
                        fontSize: "11px",
                        fontWeight: 500,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--text-tertiary)",
                        textAlign: h.align as "left" | "right",
                        borderBottom: "1px solid var(--border-strong)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {funds.map((fund, idx) => {
                  const underperforming =
                    fund.ytdReturn < fund.benchmarkReturn && fund.flowsQTD < 0;
                  return (
                    <tr
                      key={fund.id}
                      style={{
                        borderBottom:
                          idx < funds.length - 1
                            ? "1px solid var(--border-subtle)"
                            : "none",
                        borderLeft: underperforming
                          ? "2px solid var(--danger)"
                          : "2px solid transparent",
                        transition: "background-color 100ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--bg-raised)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {fund.name}
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px",
                            fontVariantNumeric: "tabular-nums",
                            color: "var(--text-primary)",
                          }}
                        >
                          £{fund.aum.toLocaleString()}m
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "13px",
                            fontVariantNumeric: "tabular-nums",
                            color:
                              fund.ytdReturn >= 0
                                ? "var(--success-text)"
                                : "var(--danger-text)",
                          }}
                        >
                          {fund.ytdReturn >= 0 ? "+" : ""}
                          {fund.ytdReturn.toFixed(1)}%
                        </span>
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        <ReturnVsBenchmark
                          ytd={fund.ytdReturn}
                          benchmark={fund.benchmarkReturn}
                        />
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        <FlowValue value={fund.flowsMTD} />
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        <FlowValue value={fund.flowsQTD} />
                      </td>
                      <td style={{ padding: "10px 12px", textAlign: "right" }}>
                        <FlowValue value={fund.flowsYTD} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Bottom Row: Toggle table + Mandate Alerts ───────────────────── */}
        <motion.div
          custom={6}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
        >
          {/* Top Inflows / Outflows toggle */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                {flowTab === "inflows" ? "Top 5 Inflows" : "Top 5 Outflows"} — QTD
              </p>
              <div style={{ display: "flex", gap: "4px" }}>
                <ToggleButton
                  active={flowTab === "inflows"}
                  onClick={() => setFlowTab("inflows")}
                >
                  Inflows
                </ToggleButton>
                <ToggleButton
                  active={flowTab === "outflows"}
                  onClick={() => setFlowTab("outflows")}
                >
                  Outflows
                </ToggleButton>
              </div>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg-page)" }}>
                  {["Client", "Fund", "QTD"].map((h, i) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        fontSize: "11px",
                        fontWeight: 500,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "var(--text-tertiary)",
                        textAlign: i === 2 ? "right" : "left",
                        borderBottom: "1px solid var(--border-strong)",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(flowTab === "inflows" ? topInflowsData : topOutflowsData).map(
                  (item, idx, arr) => (
                    <tr
                      key={item.name}
                      style={{
                        borderBottom:
                          idx < arr.length - 1
                            ? "1px solid var(--border-subtle)"
                            : "none",
                        transition: "background-color 100ms ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--bg-raised)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                      }}
                    >
                      <td
                        style={{
                          padding: "8px 12px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {item.name}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          fontSize: "11px",
                          color: "var(--text-tertiary)",
                        }}
                      >
                        {item.fund}
                      </td>
                      <td style={{ padding: "8px 12px", textAlign: "right" }}>
                        <FlowValue value={item.qtd} />
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* Mandate Fit Alerts */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <AlertTriangle size={14} strokeWidth={1.5} style={{ color: "var(--warning-text)" }} />
              <p
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  margin: 0,
                }}
              >
                Mandate Fit Alerts
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {mandateAlerts.map((alert, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    padding: "12px 16px",
                    borderBottom:
                      idx < mandateAlerts.length - 1
                        ? "1px solid var(--border-subtle)"
                        : "none",
                    borderLeft:
                      alert.severity === "high"
                        ? "2px solid var(--danger)"
                        : "2px solid var(--warning)",
                    transition: "background-color 100ms ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-raised)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                      }}
                    >
                      {alert.client}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "11px",
                        fontVariantNumeric: "tabular-nums",
                        color:
                          alert.daysToRenewal <= 45
                            ? "var(--danger-text)"
                            : "var(--warning-text)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {alert.daysToRenewal}d to renewal
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: "11px",
                      color: "var(--text-tertiary)",
                      fontStyle: "italic",
                    }}
                  >
                    {alert.fund}
                  </span>
                  <p
                    style={{
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      lineHeight: 1.5,
                      margin: 0,
                    }}
                  >
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
