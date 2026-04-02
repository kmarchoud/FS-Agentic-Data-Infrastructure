"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingDown,
  Users,
  AlertTriangle,
  Calendar,
  ShieldAlert,
  Layers,
} from "lucide-react";

import { TopBar } from "@/components/dashboard/topbar";
import { ConnectedDataStrip } from "@/components/dashboard/connected-data-strip";
import { StatCard } from "@/components/dashboard/stat-card";
import { DataSourceStrip } from "@/components/dashboard/data-source-strip";
import { ClientCard } from "@/components/dashboard/client-card";
import { FeedItem } from "@/components/dashboard/feed-item";
import { clients, marketIntel } from "@/lib/mock-data";
import type { Client } from "@/lib/mock-data";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TODAY = new Date("2026-03-31");

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  return Math.floor((TODAY.getTime() - then) / (1000 * 60 * 60 * 24));
}



function riskTextColour(score: number): string {
  if (score >= 66) return "var(--danger-text)";
  if (score >= 40) return "var(--warning-text)";
  return "var(--success-text)";
}

function contactTextColour(days: number): string {
  if (days >= 30) return "var(--danger-text)";
  if (days >= 15) return "var(--warning-text)";
  return "var(--text-tertiary)";
}

function clientTypeBadgeStyle(
  type: Client["type"]
): { bg: string; color: string; border: string } {
  const map: Record<Client["type"], { bg: string; color: string; border: string }> = {
    "Pension Fund":   { bg: "var(--badge-pension-bg)",    color: "var(--badge-pension-text)",    border: "var(--badge-pension-border)" },
    Endowment:        { bg: "var(--badge-endowment-bg)",  color: "var(--badge-endowment-text)",  border: "var(--badge-endowment-border)" },
    Insurance:        { bg: "var(--badge-insurance-bg)",  color: "var(--badge-insurance-text)",  border: "var(--badge-insurance-border)" },
    "Wealth Manager": { bg: "var(--badge-wealth-bg)",     color: "var(--badge-wealth-text)",     border: "var(--badge-wealth-border)" },
    Platform:         { bg: "var(--badge-platform-bg)",   color: "var(--badge-platform-text)",   border: "var(--badge-platform-border)" },
    "Family Office":  { bg: "var(--badge-family-bg)",     color: "var(--badge-family-text)",     border: "var(--badge-family-border)" },
  };
  return map[type];
}

// ---------------------------------------------------------------------------
// Derived data
// ---------------------------------------------------------------------------

const TOP_5_CLIENTS = [...clients]
  .sort((a, b) => b.riskScore - a.riskScore)
  .slice(0, 5);


const FEED_ITEMS = marketIntel.slice(0, 8);

// ---------------------------------------------------------------------------
// Risk Scatter Plot
// ---------------------------------------------------------------------------

const MAX_AUM = Math.max(...clients.map((c) => c.aum));

function getBubbleFill(riskScore: number, daysSinceContact: number): string {
  if (riskScore >= 55 && daysSinceContact >= 30) return "var(--danger)";
  if (riskScore >= 55 || daysSinceContact >= 30) return "var(--warning)";
  return "var(--success)";
}

function getBubbleRadius(aum: number): number {
  return 4 + (Math.sqrt(aum) / Math.sqrt(MAX_AUM)) * 20;
}

interface TooltipState {
  client: Client;
  x: number;
  y: number;
}

function RiskScatter({ clientList }: { clientList: Client[] }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  const CHART_W = 800;
  const CHART_H = 280;
  const PAD_LEFT = 52;
  const PAD_RIGHT = 20;
  const PAD_TOP = 12;
  const PAD_BOTTOM = 36;

  const plotW = CHART_W - PAD_LEFT - PAD_RIGHT;
  const plotH = CHART_H - PAD_TOP - PAD_BOTTOM;

  function xPos(risk: number) {
    return PAD_LEFT + (risk / 100) * plotW;
  }
  function yPos(days: number) {
    const capped = Math.min(days, 80);
    return PAD_TOP + plotH - (capped / 80) * plotH;
  }

  const QX = xPos(55);
  const QY = yPos(30);

  // Render largest AUM first (behind smaller)
  const sorted = [...clientList].sort((a, b) => b.aum - a.aum);

  function handleCircleEnter(e: React.MouseEvent<SVGCircleElement>, client: Client) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip({ client, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }

  function handleCircleMove(e: React.MouseEvent<SVGCircleElement>) {
    if (!containerRef.current || !tooltip) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTooltip((prev) => prev ? { ...prev, x: e.clientX - rect.left, y: e.clientY - rect.top } : null);
  }

  return (
    <div
      ref={containerRef}
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "20px 20px 12px 20px",
        position: "relative",
      }}
    >
      {/* Chart header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.006em" }}>
          Client Risk Distribution
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-tertiary)", letterSpacing: "0.01em" }}>
          Bubble size = AUM · Hover for detail
        </span>
      </div>

      {/* SVG */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <svg
          viewBox={`0 0 ${CHART_W} ${CHART_H}`}
          width="100%"
          height={CHART_H}
          style={{ display: "block" }}
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Horizontal grid lines */}
          {[0, 15, 30, 45, 60, 80].map((d) => (
            <line
              key={`grid-${d}`}
              x1={PAD_LEFT} x2={CHART_W - PAD_RIGHT}
              y1={yPos(d)} y2={yPos(d)}
              stroke="var(--border-subtle)" strokeOpacity={0.6}
            />
          ))}

          {/* Quadrant dashed dividers */}
          <line x1={QX} x2={QX} y1={PAD_TOP} y2={PAD_TOP + plotH}
            stroke="var(--border)" strokeOpacity={0.5} strokeDasharray="6 4" />
          <line x1={PAD_LEFT} x2={CHART_W - PAD_RIGHT} y1={QY} y2={QY}
            stroke="var(--border)" strokeOpacity={0.5} strokeDasharray="6 4" />

          {/* Quadrant labels */}
          <text x={CHART_W - PAD_RIGHT - 8} y={PAD_TOP + 16} textAnchor="end"
            fill="var(--danger-text)" opacity={0.7}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
            Urgent Attention
          </text>
          <text x={PAD_LEFT + 8} y={PAD_TOP + 16} textAnchor="start"
            fill="var(--warning-text)" opacity={0.7}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
            Monitor
          </text>
          <text x={CHART_W - PAD_RIGHT - 8} y={PAD_TOP + plotH - 8} textAnchor="end"
            fill="var(--warning-text)" opacity={0.7}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
            Watch
          </text>
          <text x={PAD_LEFT + 8} y={PAD_TOP + plotH - 8} textAnchor="start"
            fill="var(--success-text)" opacity={0.7}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
            Healthy
          </text>

          {/* X axis */}
          <line x1={PAD_LEFT} x2={CHART_W - PAD_RIGHT}
            y1={PAD_TOP + plotH} y2={PAD_TOP + plotH}
            stroke="var(--border-strong)" strokeWidth={1} />
          {[0, 25, 50, 75, 100].map((v) => (
            <text key={`xtick-${v}`} x={xPos(v)} y={PAD_TOP + plotH + 18}
              textAnchor="middle" fill="var(--text-tertiary)"
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
              {v}
            </text>
          ))}
          <text x={PAD_LEFT + plotW / 2} y={CHART_H - 2}
            textAnchor="middle" fill="var(--text-tertiary)"
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
            Risk Score →
          </text>

          {/* Y axis ticks */}
          {[0, 15, 30, 45, 60, 80].map((v) => (
            <text key={`ytick-${v}`} x={PAD_LEFT - 8} y={yPos(v) + 4}
              textAnchor="end" fill="var(--text-tertiary)"
              style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
              {v === 80 ? "80+" : v}
            </text>
          ))}
          {/* Y axis label */}
          <text
            x={10} y={PAD_TOP + plotH / 2}
            textAnchor="middle" fill="var(--text-tertiary)"
            transform={`rotate(-90, 10, ${PAD_TOP + plotH / 2})`}
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px" }}>
            Days Since Contact ↑
          </text>

          {/* Bubbles */}
          {sorted.map((client, i) => {
            const days = daysSince(client.lastContactDate);
            const r = getBubbleRadius(client.aum);
            const cx = xPos(client.riskScore);
            const cy = yPos(days);
            const fill = getBubbleFill(client.riskScore, days);
            const isHovered = tooltip?.client.id === client.id;

            return (
              <circle
                key={client.id}
                cx={cx} cy={cy} r={r}
                fill={fill}
                fillOpacity={isHovered ? 1 : 0.65}
                stroke="#FFFFFF"
                strokeWidth={2}
                style={{
                  cursor: "pointer",
                  transition: "fill-opacity 150ms ease, filter 150ms ease",
                  filter: isHovered ? "drop-shadow(0 2px 8px rgba(0,0,0,0.12))" : "none",
                  ...(mounted ? {
                    animation: `bubbleIn 250ms cubic-bezier(0.34,1.56,0.64,1) ${i * 30}ms both`,
                  } : {}),
                }}
                onMouseEnter={(e) => handleCircleEnter(e, client)}
                onMouseMove={handleCircleMove}
                onMouseLeave={() => setTooltip(null)}
              />
            );
          })}
        </svg>
      </div>

      <style>{`
        @keyframes bubbleIn {
          from { transform-origin: center; transform: scale(0); opacity: 0; }
          to   { transform-origin: center; transform: scale(1); opacity: 1; }
        }
      `}</style>

      {/* Tooltip */}
      {tooltip && (() => {
        const c = tooltip.client;
        const days = daysSince(c.lastContactDate);
        const bs = clientTypeBadgeStyle(c.type);
        return (
          <div
            style={{
              position: "absolute",
              left: tooltip.x + 16,
              top: tooltip.y - 20,
              zIndex: 50,
              background: "var(--bg-card)",
              border: "1px solid var(--border-strong)",
              borderRadius: "8px",
              padding: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              maxWidth: "220px",
              pointerEvents: "none",
            }}
          >
            <p style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 6px 0", lineHeight: 1.3 }}>
              {c.name}
            </p>
            <span style={{
              display: "inline-flex", alignItems: "center",
              padding: "2px 8px", borderRadius: "9999px",
              fontSize: "11px", fontWeight: 600,
              letterSpacing: "0.04em", textTransform: "uppercase" as const,
              background: bs.bg, color: bs.color,
              border: `1px solid ${bs.border}`, marginBottom: "8px",
            }}>
              {c.type}
            </span>
            <div style={{ display: "flex", flexDirection: "column" as const, gap: "4px", marginTop: "4px" }}>
              {[
                { label: "AUM",          value: `£${c.aum.toLocaleString("en-GB")}m`, colour: "var(--text-primary)" },
                { label: "Risk Score",   value: String(c.riskScore),                   colour: riskTextColour(c.riskScore) },
                { label: "Last Contact", value: `${days}d ago`,                        colour: contactTextColour(days) },
              ].map(({ label, value, colour }) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: "12px" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-tertiary)" }}>
                    {label}
                  </span>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", fontVariantNumeric: "tabular-nums", color: colour, fontWeight: 500 }}>
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function MorningBriefPage() {
  return (
    <>
      <TopBar title="Morning Brief" />
      <ConnectedDataStrip />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "1440px",
          margin: "0 auto",
        }}
      >
        {/* ------------------------------------------------------------------ */}
        {/* Page header                                                          */}
        {/* ------------------------------------------------------------------ */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <h1 style={{
            fontSize: "20px", fontWeight: 600, color: "var(--text-primary)",
            letterSpacing: "-0.01em", lineHeight: 1.4, margin: 0,
          }}>
            Morning Brief
          </h1>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: "13px",
            color: "var(--text-tertiary)", fontVariantNumeric: "tabular-nums",
          }}>
            Tue 31 Mar 2026
          </span>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Stat cards — grid-cols-6                                             */}
        {/* ------------------------------------------------------------------ */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: "16px" }}>
          <StatCard
            label="Total AUM"
            value={14.83}
            valueFormat={(n) => `£${n.toFixed(2)}bn`}
            delta="+1.2% QoQ"
            deltaDirection="up"
            icon={<Wallet size={16} strokeWidth={1.5} />}
          />
          <StatCard
            label="Net Flows QTD"
            value={127}
            valueFormat={(n) => `-£${Math.round(n)}m`}
            delta="outflows"
            deltaDirection="down"
            icon={<TrendingDown size={16} strokeWidth={1.5} />}
          />
          <StatCard
            label="Active Clients"
            value={89}
            valueFormat={(n) => String(Math.round(n))}
            icon={<Users size={16} strokeWidth={1.5} />}
          />
          <StatCard
            label="Urgent Alerts"
            value={4}
            valueFormat={(n) => String(Math.round(n))}
            icon={<AlertTriangle size={16} strokeWidth={1.5} />}
          />
          <StatCard
            label="Mandate Renewals ≤90d"
            value={6}
            valueFormat={(n) => String(Math.round(n))}
            icon={<Calendar size={16} strokeWidth={1.5} />}
          />
          <StatCard
            label="Revenue at Risk"
            value={14.12}
            valueFormat={(n) => `£${n.toFixed(2)}m`}
            variant="critical"
            icon={<ShieldAlert size={16} strokeWidth={1.5} />}
          />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Data Source Strip                                                    */}
        {/* ------------------------------------------------------------------ */}
        <DataSourceStrip />

        {/* ------------------------------------------------------------------ */}
        {/* Risk Scatter — full width                                            */}
        {/* ------------------------------------------------------------------ */}
        <RiskScatter clientList={clients} />

        {/* ------------------------------------------------------------------ */}
        {/* Two-column grid                                                      */}
        {/* ------------------------------------------------------------------ */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "24px", alignItems: "start" }}>

          {/* Left: Priority Client Insights */}
          <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Label + count badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                fontSize: "11px", fontWeight: 500,
                textTransform: "uppercase", letterSpacing: "0.06em",
                color: "var(--text-tertiary)", lineHeight: 1,
              }}>
                Priority Client Insights
              </span>
              <span style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: "var(--bg-raised)", border: "1px solid var(--border)",
                borderRadius: "9999px", fontFamily: "var(--font-mono)",
                fontSize: "11px", fontWeight: 600,
                color: "var(--text-secondary)", padding: "1px 7px",
                lineHeight: 1.4, fontVariantNumeric: "tabular-nums",
              }}>
                5
              </span>
            </div>

            {TOP_5_CLIENTS.map((client, index) => (
              <ClientCard
                key={client.id}
                client={client}
                animationDelay={index * 60}
              />
            ))}
          </section>

          {/* Right: Market Intelligence */}
          <section style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "20px",
            position: "sticky",
            top: "72px",
          }}>
            <span style={{
              fontSize: "11px", fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.06em",
              color: "var(--text-tertiary)", lineHeight: 1,
              display: "block", marginBottom: "4px",
            }}>
              Market Intelligence
            </span>

            <div>
              {FEED_ITEMS.map((item, i) => (
                <FeedItem
                  key={item.id}
                  timestamp={item.time}
                  source={item.source}
                  headline={item.headline}
                  relevantClients={item.relevantTo}
                  isLast={i === FEED_ITEMS.length - 1}
                />
              ))}
            </div>
          </section>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Today's Schedule — populated                                         */}
        {/* ------------------------------------------------------------------ */}
        <section>
          {/* Section heading + count badge */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
            <span style={{
              fontSize: "11px", fontWeight: 500,
              textTransform: "uppercase", letterSpacing: "0.06em",
              color: "var(--text-tertiary)", lineHeight: 1,
            }}>
              TODAY&apos;S SCHEDULE
            </span>
            <span style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: "var(--bg-raised)", border: "1px solid var(--border)",
              borderRadius: "9999px", fontFamily: "var(--font-mono)",
              fontSize: "11px", fontWeight: 600,
              color: "var(--text-secondary)", padding: "1px 7px",
              lineHeight: 1.4, fontVariantNumeric: "tabular-nums",
            }}>
              3
            </span>
          </div>

          {/* Meeting rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>

            {/* 09:30 — Lancashire County Pension Fund */}
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--text-primary)",
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
                width: "48px",
              }}>
                09:30
              </span>
              <a href="/clients" style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-primary)",
                textDecoration: "none",
              }}>
                Lancashire County Pension Fund
              </a>
              <span style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}>
                Quarterly Review
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--success-text)",
                marginLeft: "auto",
                fontVariantNumeric: "tabular-nums",
              }}>
                Brief ready
              </span>
            </div>

            {/* 11:00 — Wellcome Trust */}
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--text-primary)",
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
                width: "48px",
              }}>
                11:00
              </span>
              <a href="/clients" style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-primary)",
                textDecoration: "none",
              }}>
                Wellcome Trust
              </a>
              <span style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}>
                Portfolio Update
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--success-text)",
                marginLeft: "auto",
                fontVariantNumeric: "tabular-nums",
              }}>
                Brief ready
              </span>
            </div>

            {/* 14:30 — Church of England Pensions Board */}
            <div style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "13px",
                color: "var(--text-primary)",
                fontVariantNumeric: "tabular-nums",
                flexShrink: 0,
                width: "48px",
              }}>
                14:30
              </span>
              <a href="/clients" style={{
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-primary)",
                textDecoration: "none",
              }}>
                Church of England Pensions Board
              </a>
              <span style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
              }}>
                Mandate Discussion
              </span>
              <span style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--warning-text)",
                marginLeft: "auto",
                fontVariantNumeric: "tabular-nums",
              }}>
                Needs preparation
              </span>
            </div>

          </div>
        </section>
      </motion.div>
    </>
  );
}
