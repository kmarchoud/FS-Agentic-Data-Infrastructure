"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/dashboard/topbar";
import { StatCard } from "@/components/dashboard/stat-card";
import {
  ShieldCheck,
  CircleDot,
  Clock,
  Lock,
  TrendingDown,
  TrendingUp,
  BarChart3,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveLayer = 1 | 2 | 3;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SECTOR_FLOWS = [
  { label: "IA Global", value: -310, max: 400 },
  { label: "IA Strategic Bond", value: 240, max: 400 },
  { label: "IA Mixed 40–85%", value: 110, max: 400 },
];

const PLATFORMS = [
  { name: "Hargreaves Lansdown", aum: 149, delta: "+3.2% QoQ", up: true },
  { name: "Quilter", aum: 104, delta: "+1.1%", up: true },
  { name: "AJ Bell", aum: 82, delta: "+2.8%", up: true },
  { name: "Aegon", aum: 58, delta: "flat", up: null },
  { name: "Transact", aum: 53, delta: "+4.7%", up: true },
  { name: "Nucleus", aum: 28, delta: "+6.1%", up: true },
];

const MANDATES = [
  "Global Systematic",
  "UK Balanced",
  "Diversified Income",
  "Abs Return",
  "Strategic Bond",
];

// present = true, absent = false
const PLATFORM_PRESENCE: {
  platform: string;
  funds: boolean[];
  competitors: number;
  gap: boolean; // ≥2 missing
}[] = [
  { platform: "Hargreaves Lansdown", funds: [false, false, true, false, true], competitors: 4, gap: true },
  { platform: "Quilter",             funds: [true,  true,  true,  false, true], competitors: 3, gap: false },
  { platform: "Transact",            funds: [true,  true,  true,  true,  true], competitors: 2, gap: false },
  { platform: "Nucleus",             funds: [true,  false, true,  false, true], competitors: 3, gap: false },
  { platform: "AJ Bell",             funds: [false, false, true,  false, true], competitors: 4, gap: true },
  { platform: "Standard Life",       funds: [true,  true,  false, false, true], competitors: 2, gap: false },
  { platform: "Aviva",               funds: [false, true,  true,  false, true], competitors: 3, gap: false },
  { platform: "Zurich",              funds: [true,  true,  true,  false, true], competitors: 2, gap: false },
];

const DATA_FRESHNESS = [
  { label: "Investment Association", age: "2d ago", stale: true },
  { label: "Platform disclosures",   age: "1w ago", stale: true },
  { label: "Fund factsheets",        age: "1d ago", stale: false },
];

// ─── Layer Status Badge ───────────────────────────────────────────────────────

function LayerStatusBadge({ state }: { state: "live" | "building" | "licensed" }) {
  const configs = {
    live: {
      bg: "var(--success-subtle)",
      border: "rgba(34,197,94,0.20)",
      color: "var(--success-text)",
      icon: <CircleDot size={12} />,
      label: "LIVE",
    },
    building: {
      bg: "rgba(107,114,128,0.08)",
      border: "rgba(107,114,128,0.20)",
      color: "var(--neutral-text)",
      icon: <Clock size={12} />,
      label: "BUILDING",
    },
    licensed: {
      bg: "var(--accent-subtle)",
      border: "rgba(245,158,11,0.15)",
      color: "var(--accent)",
      icon: <Lock size={12} />,
      label: "LICENSED",
    },
  };
  const c = configs[state];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "9999px",
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {c.icon}
      {c.label}
    </span>
  );
}

// ─── Sector Flows Chart (bar list) ────────────────────────────────────────────

function SectorFlowsChart() {
  const maxAbs = 400;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 16px 0",
        }}
      >
        Net Retail Sales by IA Sector — 12M
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        {SECTOR_FLOWS.map((sector) => {
          const isNeg = sector.value < 0;
          const barPct = (Math.abs(sector.value) / maxAbs) * 100;
          const barColor = isNeg
            ? "var(--danger)"
            : "var(--success)";
          const textColor = isNeg ? "var(--danger-text)" : "var(--success-text)";

          return (
            <div key={sector.label}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {sector.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontVariantNumeric: "tabular-nums",
                    color: textColor,
                    fontWeight: 500,
                  }}
                >
                  {isNeg ? "-" : "+"}£{Math.abs(sector.value)}m
                </span>
              </div>
              <div
                style={{
                  height: "6px",
                  borderRadius: "3px",
                  background: "var(--bg-subtle)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barPct}%` }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  style={{
                    height: "100%",
                    borderRadius: "3px",
                    background: barColor,
                    opacity: 0.7,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Platform AUM Rankings ────────────────────────────────────────────────────

function PlatformRankings() {
  const maxAum = 149;
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <p
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 16px 0",
        }}
      >
        Major Platform AUM Rankings
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {PLATFORMS.map((p, i) => {
          const barPct = (p.aum / maxAum) * 100;
          const deltaColor =
            p.up === true
              ? "var(--success-text)"
              : p.up === false
              ? "var(--danger-text)"
              : "var(--text-tertiary)";

          return (
            <div key={p.name}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                  alignItems: "baseline",
                }}
              >
                <span style={{ fontSize: "13px", color: "var(--text-primary)" }}>
                  {p.name}
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "14px",
                      fontWeight: 500,
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--text-primary)",
                    }}
                  >
                    £{p.aum}bn
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      fontVariantNumeric: "tabular-nums",
                      color: deltaColor,
                    }}
                  >
                    {p.delta}
                  </span>
                </div>
              </div>
              <div
                style={{
                  height: "4px",
                  borderRadius: "2px",
                  background: "var(--bg-subtle)",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${barPct}%` }}
                  transition={{
                    duration: 0.6,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.06,
                  }}
                  style={{
                    height: "100%",
                    borderRadius: "2px",
                    background: "var(--accent)",
                    opacity: 0.75,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Platform Gap Table ───────────────────────────────────────────────────────

function PlatformGapTable() {
  return (
    <div style={{ marginTop: "24px" }}>
      <p
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 12px 0",
        }}
      >
        Keyridge Fund Presence vs Competitor Platforms
      </p>

      <div
        style={{
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
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-tertiary)",
                  whiteSpace: "nowrap",
                }}
              >
                Platform
              </th>
              {MANDATES.map((m) => (
                <th
                  key={m}
                  style={{
                    padding: "10px 12px",
                    textAlign: "center",
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-tertiary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {m}
                </th>
              ))}
              <th
                style={{
                  padding: "10px 12px",
                  textAlign: "right",
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  color: "var(--text-tertiary)",
                  whiteSpace: "nowrap",
                }}
              >
                Competitor Count
              </th>
            </tr>
          </thead>
          <tbody>
            {PLATFORM_PRESENCE.map((row, idx) => (
              <tr
                key={row.platform}
                style={{
                  borderBottom:
                    idx < PLATFORM_PRESENCE.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                  background: row.gap
                    ? "rgba(245,158,11,0.04)"
                    : "var(--bg-card)",
                }}
              >
                <td
                  style={{
                    padding: "10px 12px",
                    fontSize: "13px",
                    color: "var(--text-primary)",
                    fontWeight: row.gap ? 500 : 400,
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.platform}
                </td>
                {row.funds.map((present, fi) => (
                  <td
                    key={fi}
                    style={{
                      padding: "10px 12px",
                      textAlign: "center",
                      background: !present ? "var(--accent-subtle)" : "transparent",
                      fontSize: "14px",
                    }}
                  >
                    {present ? (
                      <span style={{ color: "var(--success-text)" }}>✓</span>
                    ) : (
                      <span style={{ color: "var(--danger-text)" }}>✗</span>
                    )}
                  </td>
                ))}
                <td
                  style={{
                    padding: "10px 12px",
                    textAlign: "right",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--text-primary)",
                  }}
                >
                  {row.competitors}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Priority gap callout */}
      <div
        style={{
          marginTop: "16px",
          background: "var(--accent-subtle)",
          borderLeft: "3px solid var(--accent)",
          borderRadius: "8px",
          padding: "16px",
        }}
      >
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          2 priority platform gaps identified:
        </p>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: "4px 0 0 0",
          }}
        >
          Hargreaves Lansdown and AJ Bell
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: "4px 0 0 0",
          }}
        >
          Both growing, both carrying 4 competitors without Keyridge.
        </p>
      </div>
    </div>
  );
}

// ─── Layer 1 ──────────────────────────────────────────────────────────────────

function Layer1() {
  return (
    <div>
      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px",
        }}
      >
        <StatCard
          label="IA Global Net Flows QTD"
          value={-210}
          valueFormat={(n) => `${n < 0 ? "-" : "+"}£${Math.abs(n / 100).toFixed(1)}bn`}
          delta="3 consecutive negative quarters"
          deltaDirection="down"
          icon={<TrendingDown size={16} strokeWidth={1.5} />}
        />
        <StatCard
          label="IA Mixed Inv. Flows QTD"
          value={847}
          valueFormat={(n) => `+£${n}m`}
          delta="vs −£312m prior quarter"
          deltaDirection="up"
          icon={<TrendingUp size={16} strokeWidth={1.5} />}
        />
        <StatCard
          label="UK Net Retail Sales Mar"
          value={-140}
          valueFormat={(n) => `${n < 0 ? "-" : "+"}£${Math.abs(n / 100).toFixed(1)}bn`}
          delta="worst month since Oct 2023"
          deltaDirection="down"
          icon={<TrendingDown size={16} strokeWidth={1.5} />}
        />
        <StatCard
          label="Platforms Growing AUM"
          value={8}
          valueFormat={(n) => `${n} of 18`}
          deltaDirection="neutral"
          icon={<BarChart3 size={16} strokeWidth={1.5} />}
        />
      </div>

      {/* Charts */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginTop: "24px",
        }}
      >
        <SectorFlowsChart />
        <PlatformRankings />
      </div>

      {/* Gap table */}
      <PlatformGapTable />
    </div>
  );
}

// ─── Layer 2 ──────────────────────────────────────────────────────────────────

function Layer2() {
  return (
    <div style={{ position: "relative", minHeight: "280px" }}>
      <div style={{ opacity: 0.3, pointerEvents: "none", userSelect: "none" }}>
        <div
          style={{
            background: "var(--bg-raised)",
            borderRadius: "8px",
            height: "200px",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(248,248,246,0.7)",
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
            style={{ color: "var(--text-tertiary)", margin: "0 auto" }}
          />
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "12px 0 0 0",
            }}
          >
            In development
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-tertiary)",
              margin: "4px 0 0 0",
            }}
          >
            Available Q3 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Layer 3 ──────────────────────────────────────────────────────────────────

function Layer3() {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--accent)",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <Lock size={20} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
      <p
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "12px 0 0 0",
        }}
      >
        Requires licensing
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          margin: "8px 0 0 0",
          lineHeight: 1.6,
        }}
      >
        Firm-specific, fund-specific, platform-specific flow data requires:
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          margin: "8px 0 0 0",
          lineHeight: 1.7,
        }}
      >
        • Calastone — transaction-level flow data (enterprise pricing)
        <br />
        • FE fundinfo Finscape / Nexus — 15+ UK retail platforms, fund switches, distributor flows
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          margin: "12px 0 0 0",
          lineHeight: 1.6,
          fontStyle: "italic",
        }}
      >
        This is the most commercially valuable layer. Licensing discussions should begin once the core product is validated.
      </p>
      <button
        onClick={() => alert("Interest registered.")}
        style={{
          marginTop: "16px",
          background: "none",
          border: "none",
          padding: 0,
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--accent)",
          cursor: "pointer",
          transition: "text-decoration 120ms ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.textDecoration = "underline";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.textDecoration = "none";
        }}
      >
        Register Interest
      </button>
    </div>
  );
}

// ─── Layer Tabs ───────────────────────────────────────────────────────────────

const LAYERS: {
  id: ActiveLayer;
  label: string;
  status: "live" | "building" | "licensed";
}[] = [
  { id: 1, label: "Market-Level Flows", status: "live" },
  { id: 2, label: "Inferred Signals", status: "building" },
  { id: 3, label: "Actual Flow Data", status: "licensed" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlatformFlowPage() {
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>(1);

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <TopBar title="Platform Flow Intelligence" />

      <div style={{ padding: "0 24px 40px 24px", maxWidth: "1440px" }}>
        {/* Module header */}
        <div
          style={{
            padding: "24px 0",
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
              }}
            >
              Platform Flow Intelligence
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginTop: "4px",
                marginBottom: 0,
                maxWidth: "600px",
              }}
            >
              Where money is moving across UK retail platforms and where Keyridge is missing.
            </p>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "8px",
                padding: "2px 10px",
                borderRadius: "9999px",
                background: "var(--success-subtle)",
                border: "1px solid rgba(34,197,94,0.20)",
                color: "var(--success-text)",
                fontSize: "13px",
              }}
            >
              <ShieldCheck size={14} strokeWidth={1.5} />
              Public data only — no internal access required
            </span>
          </div>
        </div>

        {/* Layer tabs */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid var(--border)",
            marginTop: "24px",
          }}
        >
          {LAYERS.map((layer) => {
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
                  border: "none",
                  borderBottom: isActive
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  marginBottom: "-1px",
                  background: "none",
                  cursor: "pointer",
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-tertiary)",
                  fontWeight: isActive ? 500 : 400,
                  fontSize: "13px",
                  transition: "color 120ms ease",
                  fontFamily: "var(--font-sans)",
                  opacity: !isActive && layer.status !== "live" ? 0.8 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--text-secondary)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive)
                    (e.currentTarget as HTMLButtonElement).style.color =
                      "var(--text-tertiary)";
                }}
              >
                Layer {layer.id} — {layer.label}
                <LayerStatusBadge state={layer.status} />
              </button>
            );
          })}
        </div>

        {/* Layer content */}
        <div style={{ marginTop: "24px" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLayer}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeLayer === 1 && <Layer1 />}
              {activeLayer === 2 && <Layer2 />}
              {activeLayer === 3 && <Layer3 />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Data freshness strip */}
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
          {DATA_FRESHNESS.map((src, i) => (
            <span key={src.label}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: src.stale
                    ? "var(--warning-text)"
                    : "var(--text-tertiary)",
                  letterSpacing: "0.01em",
                }}
              >
                {src.label}: {src.age}
              </span>
              {i < DATA_FRESHNESS.length - 1 && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--text-tertiary)",
                    marginLeft: "16px",
                  }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
