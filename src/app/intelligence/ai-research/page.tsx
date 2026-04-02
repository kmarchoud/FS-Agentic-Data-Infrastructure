"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TopBar } from "@/components/dashboard/topbar";
import {
  Search,
  ShieldCheck,
  CircleDot,
  Clock,
  Lock,
  Download,
  FileText,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ActiveLayer = 1 | 2 | 3;

interface QueryHistoryEntry {
  query: string;
  timestamp: string;
}

interface IFAResult {
  rank: number;
  firm: string;
  region: string;
  aum: string;
  fitScore: number;
  signal: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const SUGGESTED_CHIPS = [
  "Who should we target for Global Systematic in the South East?",
  "How is Schroders positioned against us for the IA Global sector?",
  "Which IFAs have had leadership changes in the last 30 days?",
  "Which platforms carry Artemis but not Keyridge?",
];

const QUERY_HISTORY: QueryHistoryEntry[] = [
  {
    query: "Which IFAs have added systematic equity to their approved list?",
    timestamp: "2h ago",
  },
  {
    query: "Top platforms for Global Systematic by AUM growth QoQ",
    timestamp: "Yesterday",
  },
  {
    query: "Competitive landscape for IA Mixed 40-85% sector",
    timestamp: "2d ago",
  },
];

const IFA_RESULTS: IFAResult[] = [
  {
    rank: 1,
    firm: "Paradigm Capital Ltd",
    region: "London",
    aum: "£2.1bn",
    fitScore: 91,
    signal: "Investment director from Schroders 3 weeks ago",
  },
  {
    rank: 2,
    firm: "Foster Denovo",
    region: "London",
    aum: "£3.2bn",
    fitScore: 84,
    signal: "28% client growth — scaling fast",
  },
  {
    rank: 3,
    firm: "Attivo Group",
    region: "Manchester",
    aum: "£1.1bn",
    fitScore: 87,
    signal: "Added systematic strategy to approved list",
  },
  {
    rank: 4,
    firm: "Informed Financial Planning",
    region: "Oxford",
    aum: "£890m",
    fitScore: 79,
    signal: "Philosophy page updated to factor-based",
  },
  {
    rank: 5,
    firm: "Perspective Group",
    region: "Bristol",
    aum: "£1.8bn",
    fitScore: 74,
    signal: "Evidence-based investing in proposition doc",
  },
  {
    rank: 6,
    firm: "Atticus Wealth",
    region: "Bristol",
    aum: "£540m",
    fitScore: 76,
    signal: "Joined Nucleus platform Q3",
  },
  {
    rank: 7,
    firm: "Progeny Wealth",
    region: "Leeds",
    aum: "£1.2bn",
    fitScore: 82,
    signal: "New Head of Investments from Jupiter",
  },
  {
    rank: 8,
    firm: "Arbor AM",
    region: "Edinburgh",
    aum: "£680m",
    fitScore: 71,
    signal: "Revenue up 41%, underserved",
  },
];

const DATA_FRESHNESS = [
  { label: "FCA Register", age: "2h ago", stale: false },
  { label: "Companies House", age: "4h ago", stale: false },
  { label: "Fund Factsheets", age: "1d ago", stale: false },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

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

function FitScoreBar({ score }: { score: number }) {
  const color =
    score >= 70
      ? "var(--success)"
      : score >= 50
      ? "var(--warning)"
      : "var(--neutral)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "60px",
          height: "3px",
          borderRadius: "2px",
          background: "var(--bg-subtle)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: color,
            borderRadius: "2px",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          fontVariantNumeric: "tabular-nums",
          color: "var(--text-primary)",
        }}
      >
        {score}/100
      </span>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ marginTop: "24px" }}>
      <style>{`
        @keyframes pulse-opacity {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        .skel { animation: pulse-opacity 2.2s ease-in-out infinite; background: var(--bg-raised); border-radius: 4px; }
      `}</style>
      {/* Query echo skeleton */}
      <div className="skel" style={{ height: "20px", width: "60%", marginBottom: "8px" }} />
      <div className="skel" style={{ height: "12px", width: "80%", marginBottom: "24px" }} />
      {/* Table header */}
      <div className="skel" style={{ height: "36px", width: "100%", marginBottom: "2px", borderRadius: "6px" }} />
      {/* Table rows */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="skel"
          style={{
            height: "44px",
            width: "100%",
            marginBottom: "2px",
            borderRadius: "4px",
            animationDelay: `${i * 0.08}s`,
          }}
        />
      ))}
    </div>
  );
}

function ResultTable({ results }: { results: IFAResult[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Query echo */}
      <div style={{ marginBottom: "4px" }}>
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Who should we target for Global Systematic in the South East?
        </p>
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-tertiary)",
            letterSpacing: "0.01em",
            margin: "4px 0 0 0",
          }}
        >
          Result generated in 8.2s · Sources: FCA Register, Companies House, Fund Factsheets, Industry Press
        </p>
      </div>

      {/* Table */}
      <div
        style={{
          marginTop: "16px",
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
              {["Rank", "Firm", "Region", "Est AUM", "Fit Score", "Key Signal"].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "10px 12px",
                    textAlign: col === "Rank" || col === "Est AUM" ? "center" : "left",
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-tertiary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, idx) => (
              <motion.tr
                key={row.rank}
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.2, ease: "easeOut" }}
                style={{
                  borderBottom:
                    idx < results.length - 1
                      ? "1px solid var(--border-subtle)"
                      : "none",
                  background: "var(--bg-card)",
                  transition: "background 120ms ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background =
                    "var(--bg-raised)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLTableRowElement).style.background =
                    "var(--bg-card)";
                }}
              >
                <td
                  style={{
                    padding: "10px 12px",
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {row.rank}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    fontSize: "13px",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.firm}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.region}
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    textAlign: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: "13px",
                    fontWeight: 500,
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--text-primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {row.aum}
                </td>
                <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                  <FitScoreBar score={row.fitScore} />
                </td>
                <td
                  style={{
                    padding: "10px 12px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                  }}
                >
                  {row.signal}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Actions below table */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginTop: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={() => alert("Downloading CSV…")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "6px",
            border: "1px solid var(--border)",
            background: "transparent",
            fontSize: "13px",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "all 120ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border-strong)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor =
              "var(--border)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--text-secondary)";
          }}
        >
          <Download size={13} strokeWidth={1.5} />
          Download as CSV
        </button>

        <button
          onClick={() => alert("Generating outreach brief from this result…")}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "6px 14px",
            borderRadius: "6px",
            border: "1px solid rgba(245,158,11,0.30)",
            background: "transparent",
            fontSize: "13px",
            color: "var(--accent)",
            cursor: "pointer",
            transition: "all 120ms ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--accent-subtle)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
          }}
        >
          <FileText size={13} strokeWidth={1.5} />
          Generate outreach brief from this result
        </button>
      </div>
    </motion.div>
  );
}

// ─── Layer 1 Content ──────────────────────────────────────────────────────────

function Layer1({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasResult, setHasResult] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleSubmit() {
    if (!query.trim()) return;
    setIsLoading(true);
    setHasResult(false);
    setTimeout(() => {
      setIsLoading(false);
      setHasResult(true);
    }, 2000);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <div>
      {/* Query input */}
      <div style={{ position: "relative", marginTop: "8px" }}>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask any distribution question..."
          style={{
            width: "100%",
            height: "52px",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "0 120px 0 20px",
            fontSize: "14px",
            color: "var(--text-primary)",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "var(--font-sans)",
            transition: "border-color 120ms ease, box-shadow 120ms ease",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "var(--accent)";
            e.target.style.boxShadow = "0 0 0 3px var(--accent-subtle)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
            e.target.style.boxShadow = "none";
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            position: "absolute",
            right: "6px",
            top: "50%",
            transform: "translateY(-50%)",
            background: isLoading ? "var(--accent-hover)" : "var(--accent)",
            border: "none",
            borderRadius: "6px",
            padding: "8px 14px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            cursor: isLoading ? "default" : "pointer",
            transition: "background 120ms ease",
          }}
          onMouseEnter={(e) => {
            if (!isLoading)
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent-hover)";
          }}
          onMouseLeave={(e) => {
            if (!isLoading)
              (e.currentTarget as HTMLButtonElement).style.background =
                "var(--accent)";
          }}
        >
          <Search size={14} strokeWidth={2} color="white" />
          <span
            style={{
              fontSize: "13px",
              fontWeight: 500,
              color: "white",
              whiteSpace: "nowrap",
            }}
          >
            {isLoading ? "Researching…" : "Research"}
          </span>
        </button>
      </div>

      {/* Suggested chips */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginTop: "12px",
        }}
      >
        {SUGGESTED_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => {
              setQuery(chip);
              inputRef.current?.focus();
            }}
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "9999px",
              padding: "6px 14px",
              fontSize: "13px",
              color: "var(--text-secondary)",
              cursor: "pointer",
              transition: "all 120ms ease",
              fontFamily: "var(--font-sans)",
            }}
            onMouseEnter={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "var(--bg-subtle)";
              b.style.borderColor = "var(--border-strong)";
              b.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              const b = e.currentTarget as HTMLButtonElement;
              b.style.background = "var(--bg-raised)";
              b.style.borderColor = "var(--border)";
              b.style.color = "var(--text-secondary)";
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Query history */}
      <div
        style={{
          marginTop: "24px",
          paddingTop: "16px",
          borderTop: "1px solid var(--border-subtle)",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--text-tertiary)",
            margin: "0 0 8px 0",
          }}
        >
          Recent Queries
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {QUERY_HISTORY.map((entry, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(entry.query);
                inputRef.current?.focus();
              }}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                background: "none",
                border: "none",
                padding: "8px 0",
                cursor: "pointer",
                transition: "color 120ms ease",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  margin: 0,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  transition: "color 120ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLParagraphElement).style.color =
                    "var(--text-primary)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLParagraphElement).style.color =
                    "var(--text-secondary)";
                }}
              >
                {entry.query}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                  margin: 0,
                }}
              >
                {entry.timestamp}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Result area */}
      <div style={{ marginTop: "24px" }}>
        {!isLoading && !hasResult && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "180px",
              gap: "8px",
            }}
          >
            <Search size={32} strokeWidth={1.5} color="var(--text-tertiary)" />
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-tertiary)",
                margin: 0,
              }}
            >
              Ask a distribution question. Get a research-grade answer.
            </p>
          </div>
        )}

        {isLoading && <LoadingSkeleton />}

        <AnimatePresence>
          {hasResult && !isLoading && (
            <ResultTable results={IFA_RESULTS} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Layer 2 Content ──────────────────────────────────────────────────────────

function Layer2() {
  return (
    <div style={{ position: "relative", minHeight: "280px" }}>
      {/* Ghost preview content */}
      <div style={{ opacity: 0.3, pointerEvents: "none", userSelect: "none" }}>
        <div
          style={{
            background: "var(--bg-raised)",
            borderRadius: "8px",
            height: "200px",
          }}
        />
      </div>
      {/* Overlay */}
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
            Available Q2 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Layer 3 Content ──────────────────────────────────────────────────────────

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
        This layer requires commercial data from:
      </p>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "8px 0 0 0", lineHeight: 1.7 }}>
        • Connected data sources (all modules)
      </p>
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          margin: "12px 0 0 0",
          lineHeight: 1.6,
        }}
      >
        Building — Available Q4 2026
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
          textDecoration: "none",
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
  { id: 1, label: "Structured Q&A", status: "live" },
  { id: 2, label: "Brief Generation", status: "building" },
  { id: 3, label: "Proactive Intelligence", status: "licensed" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AIResearchPage() {
  const [activeLayer, setActiveLayer] = useState<ActiveLayer>(1);
  const [query, setQuery] = useState("");

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <TopBar title="AI Research" />

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
              AI Research Team
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginTop: "4px",
                marginBottom: "0",
                maxWidth: "600px",
              }}
            >
              Natural language distribution intelligence. Ask any question, get a research-grade answer.
            </p>
            {/* Public data badge */}
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
              {activeLayer === 1 && (
                <Layer1 query={query} setQuery={setQuery} />
              )}
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
                  color: src.stale ? "var(--warning-text)" : "var(--text-tertiary)",
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
