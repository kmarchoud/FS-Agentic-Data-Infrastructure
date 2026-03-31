"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Clock, BarChart2, Zap, LayoutList, Columns } from "lucide-react";
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
} from "recharts";
import { rfpPipeline, type RFPItem } from "@/lib/mock-data";

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

// ── Win rate data ─────────────────────────────────────────────────────────────

const winRateData = [
  { bracket: "<7 days",   rate: 68 },
  { bracket: "7–14 days", rate: 41 },
  { bracket: ">14 days",  rate: 19 },
];

// ── Kanban columns ────────────────────────────────────────────────────────────

const KANBAN_STAGES = ["New", "Data Gathering", "Internal Review", "Submitted"] as const;
type KanbanStage = typeof KANBAN_STAGES[number];

// ── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, delay: i * 0.05, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  }),
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function dueDateStyle(days: number): React.CSSProperties {
  if (days < 10)
    return { color: "var(--danger-text)", fontFamily: "var(--font-mono)", fontSize: "13px", fontVariantNumeric: "tabular-nums" };
  if (days < 21)
    return { color: "var(--warning-text)", fontFamily: "var(--font-mono)", fontSize: "13px", fontVariantNumeric: "tabular-nums" };
  return { color: "var(--text-tertiary)", fontFamily: "var(--font-mono)", fontSize: "13px", fontVariantNumeric: "tabular-nums" };
}

function formatDueDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function statusBadgeVariant(status: RFPItem["status"]): "urgent" | "at-risk" | "stable" | "opportunity" {
  switch (status) {
    case "In Progress":  return "at-risk";
    case "Near Complete": return "opportunity";
    case "Just Opened":  return "stable";
    case "Not Started":  return "urgent";
  }
}

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
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "5px 12px",
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

export default function RFPPage() {
  const [view, setView] = useState<"table" | "kanban">("table");

  const urgentRFP = rfpPipeline.find((r) => r.daysUntilDue === Math.min(...rfpPipeline.map((x) => x.daysUntilDue)));

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <TopBar title="RFP Intelligence" />

      <main style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "24px" }}>

        {/* ── Stat Cards ─────────────────────────────────────────────────── */}
        <motion.div
          initial="hidden"
          animate="visible"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}
        >
          {[
            {
              label: "Open RFPs",
              value: rfpPipeline.length,
              valueFormat: (n: number) => `${Math.round(n)}`,
              delta: "active in pipeline",
              deltaDirection: "neutral" as const,
              variant: "default" as const,
              icon: <FileText size={16} strokeWidth={1.5} />,
            },
            {
              label: "Next Due",
              value: 9,
              valueFormat: (n: number) => `${Math.round(n)} days`,
              delta: "Greater Manchester · 08 Apr",
              deltaDirection: "down" as const,
              variant: "default" as const,
              icon: <Clock size={16} strokeWidth={1.5} />,
            },
            {
              label: "Avg Completion",
              value: 57,
              valueFormat: (n: number) => `${Math.round(n)}%`,
              delta: "below 75% target",
              deltaDirection: "down" as const,
              variant: "default" as const,
              icon: <BarChart2 size={16} strokeWidth={1.5} />,
            },
            {
              label: "Bandwidth Risk",
              value: 0,
              valueFormat: () => "HIGH",
              delta: "3 RFPs due within 14 days",
              deltaDirection: "down" as const,
              variant: "critical" as const,
              icon: <Zap size={16} strokeWidth={1.5} />,
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

        {/* ── Main content + sidebar ──────────────────────────────────────── */}
        <motion.div
          custom={4}
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          style={{ display: "flex", gap: "0", alignItems: "flex-start" }}
        >
          {/* ── Table / Kanban panel ─────────────────────────────────────── */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* View toggle header */}
            <div
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px 8px 0 0",
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                RFP Pipeline
              </p>
              <div style={{ display: "flex", gap: "4px" }}>
                <ToggleButton active={view === "table"} onClick={() => setView("table")}>
                  <LayoutList size={14} strokeWidth={1.5} />
                  Table
                </ToggleButton>
                <ToggleButton active={view === "kanban"} onClick={() => setView("kanban")}>
                  <Columns size={14} strokeWidth={1.5} />
                  Kanban
                </ToggleButton>
              </div>
            </div>

            {/* Table view */}
            {view === "table" && (
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  overflowX: "auto",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: "var(--bg-page)" }}>
                      {[
                        { label: "Client",     align: "left"  },
                        { label: "Mandate",    align: "left"  },
                        { label: "AUM",        align: "right" },
                        { label: "Due Date",   align: "right" },
                        { label: "Days Left",  align: "right" },
                        { label: "Completion", align: "left"  },
                        { label: "Status",     align: "left"  },
                        { label: "Assigned",   align: "left"  },
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
                    {rfpPipeline.map((rfp, idx) => (
                      <tr
                        key={rfp.id}
                        style={{
                          borderBottom:
                            idx < rfpPipeline.length - 1
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
                        {/* Client */}
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>
                            {rfp.clientName}
                          </span>
                        </td>

                        {/* Mandate */}
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                            {rfp.mandateType}
                          </span>
                        </td>

                        {/* AUM */}
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: "13px",
                              fontVariantNumeric: "tabular-nums",
                              color: rfp.estimatedAUM ? "var(--text-primary)" : "var(--text-tertiary)",
                            }}
                          >
                            {rfp.estimatedAUM || "TBD"}
                          </span>
                        </td>

                        {/* Due Date */}
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>
                          <span style={dueDateStyle(rfp.daysUntilDue)}>
                            {formatDueDate(rfp.dueDate)}
                          </span>
                        </td>

                        {/* Days Left */}
                        <td style={{ padding: "10px 12px", textAlign: "right" }}>
                          <span style={dueDateStyle(rfp.daysUntilDue)}>
                            {rfp.daysUntilDue}d
                          </span>
                        </td>

                        {/* Completion bar */}
                        <td style={{ padding: "10px 12px", minWidth: "140px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                              style={{
                                flex: 1,
                                height: "6px",
                                borderRadius: "9999px",
                                background: "var(--bg-raised)",
                                overflow: "hidden",
                              }}
                            >
                              <div
                                style={{
                                  height: "100%",
                                  width: `${rfp.dataCompletion}%`,
                                  borderRadius: "9999px",
                                  background: "var(--accent)",
                                  transition: "width 600ms cubic-bezier(0.4,0,0.2,1)",
                                }}
                              />
                            </div>
                            <span
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: "11px",
                                fontVariantNumeric: "tabular-nums",
                                color: "var(--text-tertiary)",
                                minWidth: "28px",
                                textAlign: "right",
                              }}
                            >
                              {rfp.dataCompletion}%
                            </span>
                          </div>
                        </td>

                        {/* Status badge */}
                        <td style={{ padding: "10px 12px" }}>
                          <Badge variant={statusBadgeVariant(rfp.status)}>
                            {rfp.status}
                          </Badge>
                        </td>

                        {/* Assigned */}
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                            {rfp.assignedTo}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Kanban view */}
            {view === "kanban" && (
              <div
                style={{
                  background: "var(--bg-page)",
                  border: "1px solid var(--border)",
                  borderTop: "none",
                  borderRadius: "0 0 8px 8px",
                  padding: "16px",
                  display: "grid",
                  gridTemplateColumns: "repeat(4, 1fr)",
                  gap: "12px",
                }}
              >
                {KANBAN_STAGES.map((stage) => {
                  const cards = rfpPipeline.filter((r) => r.stage === stage);
                  return (
                    <div key={stage}>
                      {/* Column header */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "8px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 500,
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                            color: "var(--text-tertiary)",
                          }}
                        >
                          {stage}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: "11px",
                            color: "var(--text-tertiary)",
                          }}
                        >
                          {cards.length}
                        </span>
                      </div>

                      {/* Cards */}
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                        {cards.map((rfp) => (
                          <div
                            key={rfp.id}
                            style={{
                              background: "var(--bg-card)",
                              border: "1px solid var(--border)",
                              borderRadius: "8px",
                              padding: "12px",
                              transition: "border-color 150ms ease",
                              cursor: "default",
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-strong)";
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                            }}
                          >
                            <p
                              style={{
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "var(--text-primary)",
                                margin: "0 0 4px",
                                lineHeight: 1.3,
                              }}
                            >
                              {rfp.clientName}
                            </p>
                            <p
                              style={{
                                fontSize: "11px",
                                color: "var(--text-tertiary)",
                                margin: "0 0 8px",
                              }}
                            >
                              {rfp.mandateType}
                            </p>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                              }}
                            >
                              {/* Completion bar mini */}
                              <div
                                style={{
                                  flex: 1,
                                  height: "4px",
                                  borderRadius: "9999px",
                                  background: "var(--bg-raised)",
                                  overflow: "hidden",
                                  marginRight: "8px",
                                }}
                              >
                                <div
                                  style={{
                                    height: "100%",
                                    width: `${rfp.dataCompletion}%`,
                                    borderRadius: "9999px",
                                    background: "var(--accent)",
                                  }}
                                />
                              </div>
                              <span
                                style={{
                                  fontFamily: "var(--font-mono)",
                                  fontSize: "11px",
                                  color: "var(--text-tertiary)",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              >
                                {rfp.dataCompletion}%
                              </span>
                            </div>
                            <div style={{ marginTop: "8px" }}>
                              <span style={dueDateStyle(rfp.daysUntilDue)}>
                                Due {formatDueDate(rfp.dueDate)} · {rfp.daysUntilDue}d
                              </span>
                            </div>
                          </div>
                        ))}
                        {cards.length === 0 && (
                          <div
                            style={{
                              border: "1px dashed var(--border)",
                              borderRadius: "8px",
                              padding: "16px",
                              textAlign: "center",
                              fontSize: "11px",
                              color: "var(--text-tertiary)",
                            }}
                          >
                            No items
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right sidebar ─────────────────────────────────────────────── */}
          <div
            style={{
              width: "280px",
              flexShrink: 0,
              borderLeft: "1px solid var(--border)",
              background: "var(--bg-card)",
              marginLeft: "0",
              borderRadius: "0 8px 8px 0",
              alignSelf: "stretch",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Win Rate chart */}
            <div style={{ padding: "16px", borderBottom: "1px solid var(--border)" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-tertiary)",
                  margin: "0 0 4px",
                }}
              >
                Win Rate by Turnaround
              </p>
              <p
                style={{
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                  margin: "0 0 12px",
                  fontFamily: "var(--font-mono)",
                }}
              >
                Historical · all mandates
              </p>
              <ResponsiveContainer width="100%" height={120}>
                <RechartsBarChart
                  data={winRateData}
                  layout="vertical"
                  margin={{ top: 0, right: 24, left: 0, bottom: 0 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid
                    stroke="var(--border-subtle)"
                    strokeOpacity={0.6}
                    horizontal={false}
                  />
                  <XAxis
                    type="number"
                    domain={[0, 100]}
                    tick={TICK_STYLE}
                    axisLine={{ stroke: "#D4D4D0" }}
                    tickLine={false}
                    tickFormatter={(v: number) => `${v}%`}
                  />
                  <YAxis
                    type="category"
                    dataKey="bracket"
                    tick={TICK_STYLE}
                    axisLine={false}
                    tickLine={false}
                    width={68}
                  />
                  <Tooltip
                    contentStyle={TOOLTIP_CONTENT_STYLE}
                    labelStyle={TOOLTIP_LABEL_STYLE}
                    itemStyle={TOOLTIP_ITEM_STYLE}
                    cursor={{ fill: "var(--bg-raised)" }}
                    formatter={(value: number) => [`${value}%`, "Win Rate"]}
                  />
                  <Bar dataKey="rate" radius={[0, 4, 4, 0]} barSize={18} isAnimationActive animationDuration={600}>
                    {winRateData.map((entry, idx) => (
                      <Cell
                        key={`wr-${idx}`}
                        fill={
                          entry.rate >= 60
                            ? "#16A34A"
                            : entry.rate >= 35
                            ? "#B45309"
                            : "#DC2626"
                        }
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>

            {/* Impact callout */}
            {urgentRFP && (
              <div
                style={{
                  padding: "16px",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-tertiary)",
                    margin: "0 0 10px",
                  }}
                >
                  Urgency Callout
                </p>
                <div
                  style={{
                    background: "rgba(239,68,68,0.04)",
                    border: "1px solid rgba(239,68,68,0.15)",
                    borderRadius: "6px",
                    padding: "12px",
                  }}
                >
                  <p
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      margin: "0 0 4px",
                    }}
                  >
                    {urgentRFP.clientName}
                  </p>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "var(--text-tertiary)",
                      margin: "0 0 10px",
                    }}
                  >
                    Due in {urgentRFP.daysUntilDue} days
                  </p>
                  <div
                    style={{
                      borderTop: "1px solid rgba(239,68,68,0.12)",
                      paddingTop: "10px",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-tertiary)",
                        margin: "0 0 2px",
                      }}
                    >
                      Win rate impact
                    </p>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "14px",
                        fontWeight: 500,
                        fontVariantNumeric: "tabular-nums",
                        color: "var(--danger-text)",
                      }}
                    >
                      −27 percentage points
                    </span>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "var(--text-tertiary)",
                        margin: "4px 0 0",
                      }}
                    >
                      vs submitting within 7 days
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pipeline summary */}
            <div style={{ padding: "16px" }}>
              <p
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-tertiary)",
                  margin: "0 0 10px",
                }}
              >
                Pipeline Summary
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {KANBAN_STAGES.map((stage) => {
                  const count = rfpPipeline.filter((r) => r.stage === stage).length;
                  return (
                    <div
                      key={stage}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                        {stage}
                      </span>
                      <span
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "13px",
                          fontVariantNumeric: "tabular-nums",
                          color: "var(--text-primary)",
                          fontWeight: 500,
                        }}
                      >
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>

      </main>
    </div>
  );
}
