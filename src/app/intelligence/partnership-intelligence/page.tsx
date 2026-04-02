"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import TopBar from "@/components/dashboard/topbar";
import {
  Search,
  Database,
  CircleDot,
  Clock,
  Lock,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LayerId = 1 | 2 | 3;

// ─── Data ─────────────────────────────────────────────────────────────────────

const SUGGESTION_CHIPS = [
  "JPMorgan + True Potential",
  "Schroders + Benchmark Capital",
  "Columbia Threadneedle + Openwork",
];

const ANATOMY_SECTIONS = [
  {
    label: "TRIGGER",
    borderColor: "var(--accent)",
    content:
      "True Potential's discretionary service launched 2017 required institutional-grade systematic equity exposure not available in their existing fund panel.",
    sourceNote: null,
  },
  {
    label: "MANDATE FIT",
    borderColor: "var(--success)",
    content:
      "JPMorgan US Equity Income matched True Potential's target demographic (risk-averse, income-seeking) and their then-emerging digital distribution model.",
    sourceNote: null,
  },
  {
    label: "PEOPLE CATALYST",
    borderColor: "var(--neutral)",
    content:
      "True Potential's CIO David Harrison had a prior relationship with JPMorgan's UK Wholesale team from his previous role at Standard Life Investments (2014-2017).",
    sourceNote: "Source: LinkedIn profile, FCA register",
  },
  {
    label: "OUTCOME",
    borderColor: "var(--success)",
    content:
      "True Potential became one of JPMorgan's top 10 UK wholesale distributors by AUM within 24 months.",
    metric: "£1.2bn AUM estimated at peak (2021, FT Adviser).",
    sourceNote: null,
  },
];

const MATCH_ROWS = [
  {
    rank: 1,
    firm: "Quilter Financial Planning",
    signal:
      "Launching MPS Q1 2026, systematic equity gap identified in factsheet",
    score: 88,
  },
  {
    rank: 2,
    firm: "Benchmark Capital",
    signal:
      "DPS AUM grew 140% in 2 years, current systematic equity offering thin",
    score: 84,
  },
  {
    rank: 3,
    firm: "Perspective Group",
    signal:
      "New CIO from institutional AM, expanding product range (FCA register)",
    score: 81,
  },
  {
    rank: 4,
    firm: "Ascot Lloyd",
    signal:
      "Platform expansion to Nucleus suggests fund panel review underway",
    score: 78,
  },
  {
    rank: 5,
    firm: "Sandringham Financial Partners",
    signal:
      "Regulation-driven consolidation creating systematic exposure gap",
    score: 75,
  },
  {
    rank: 6,
    firm: "Almary Green",
    signal:
      "Investment committee minutes mention 'factor-based diversification' as 2026 priority",
    score: 72,
  },
];

const DATA_SOURCES = [
  { label: "FCA Register", freshness: "2h ago", stale: false },
  { label: "Companies House", freshness: "4h ago", stale: false },
  { label: "FT Adviser", freshness: "35s ago", stale: false },
  { label: "LinkedIn (public)", freshness: "1d ago", stale: false },
];

const LAYER_TABS: { id: LayerId; label: string; status: "live" | "building" | "licensed" }[] = [
  { id: 1, label: "Partnership Anatomy", status: "live" },
  { id: 2, label: "Predictive Signals", status: "building" },
  { id: 3, label: "People Intelligence", status: "licensed" },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function LayerStatusBadge({ status }: { status: "live" | "building" | "licensed" }) {
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
  const c = configs[status];
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
        lineHeight: 1,
      }}
    >
      <span style={{ display: "flex", alignItems: "center" }}>{c.icon}</span>
      {c.label}
    </span>
  );
}

function ScoreBar({ score }: { score: number }) {
  const fill =
    score >= 70
      ? "var(--success)"
      : score >= 50
      ? "var(--warning)"
      : "var(--neutral)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "64px",
          height: "3px",
          background: "var(--bg-subtle)",
          borderRadius: "9999px",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: `${score}%`,
            height: "100%",
            background: fill,
            borderRadius: "9999px",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "13px",
          fontWeight: 500,
          fontVariantNumeric: "tabular-nums",
          color: "var(--text-primary)",
        }}
      >
        {score}
      </span>
    </div>
  );
}

// ─── Layer 1 content ──────────────────────────────────────────────────────────

function Layer1Content() {
  const [searchValue, setSearchValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleChipClick = (chip: string) => {
    setSearchValue(chip);
    setShowDropdown(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Search bar */}
      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "14px",
              color: "var(--text-tertiary)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setShowDropdown(e.target.value.length > 0);
            }}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
            placeholder="Search known partnerships..."
            style={{
              width: "100%",
              height: "44px",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "0 16px 0 40px",
              fontSize: "13px",
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
              outline: "none",
              transition: "border-color 120ms ease",
            }}
            onFocusCapture={(e) =>
              (e.currentTarget.style.borderColor = "var(--accent)")
            }
            onBlurCapture={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
          />
        </div>

        {/* Autocomplete dropdown */}
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              zIndex: 10,
              overflow: "hidden",
            }}
          >
            {SUGGESTION_CHIPS.map((chip) => (
              <button
                key={chip}
                onMouseDown={() => handleChipClick(chip)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  width: "100%",
                  padding: "10px 14px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  textAlign: "left",
                  transition: "background 100ms ease",
                  fontFamily: "var(--font-sans)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--bg-raised)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <Search size={13} style={{ color: "var(--text-tertiary)", flexShrink: 0 }} />
                {chip}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Suggestion chips */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginTop: "12px",
        }}
      >
        {SUGGESTION_CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => handleChipClick(chip)}
            style={{
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "9999px",
              padding: "6px 14px",
              fontSize: "13px",
              color: "var(--text-secondary)",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              transition: "all 120ms ease",
              lineHeight: 1,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--bg-subtle)";
              e.currentTarget.style.borderColor = "var(--border-strong)";
              e.currentTarget.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--bg-raised)";
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Partnership Anatomy Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1], delay: 0.06 }}
        style={{
          marginTop: "24px",
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "24px",
        }}
      >
        {/* Card header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              margin: 0,
              fontFamily: "var(--font-sans)",
            }}
          >
            JPMorgan × True Potential
          </h2>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontVariantNumeric: "tabular-nums",
              color: "var(--text-tertiary)",
              letterSpacing: "0.01em",
              flexShrink: 0,
              marginLeft: "16px",
            }}
          >
            Announced 2017
          </span>
        </div>

        {/* 2×2 anatomy grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
          }}
        >
          {ANATOMY_SECTIONS.map((section, i) => (
            <motion.div
              key={section.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.1 + i * 0.05,
              }}
              style={{
                borderLeft: `3px solid ${section.borderColor}`,
                paddingLeft: "16px",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-sans)",
                  marginBottom: "6px",
                }}
              >
                {section.label}
              </div>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.6,
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                }}
              >
                {section.content}
                {section.metric && (
                  <>
                    {" "}
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontVariantNumeric: "tabular-nums",
                        color: "var(--text-primary)",
                        fontWeight: 500,
                      }}
                    >
                      {section.metric}
                    </span>
                  </>
                )}
              </p>
              {section.sourceNote && (
                <p
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--text-tertiary)",
                    letterSpacing: "0.01em",
                    marginTop: "6px",
                    marginBottom: 0,
                  }}
                >
                  {section.sourceNote}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Matching firms section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1], delay: 0.18 }}
        style={{ marginTop: "32px" }}
      >
        {/* Section heading + count badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "16px",
          }}
        >
          <h3
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.006em",
              margin: 0,
              fontFamily: "var(--font-sans)",
            }}
          >
            Firms matching this pre-partnership profile today
          </h3>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--bg-raised)",
              border: "1px solid var(--border)",
              borderRadius: "9999px",
              padding: "1px 8px",
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            12
          </span>
        </div>

        {/* Table */}
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
              gridTemplateColumns: "44px 1fr 1fr 140px 110px",
              padding: "0 16px",
              borderBottom: "1px solid var(--border-strong)",
              background: "var(--bg-card)",
            }}
          >
            {["#", "Firm", "Signal", "Match Score", ""].map((col) => (
              <div
                key={col}
                style={{
                  padding: "10px 0",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "var(--text-tertiary)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {col}
              </div>
            ))}
          </div>

          {/* Table rows */}
          {MATCH_ROWS.map((row, i) => (
            <motion.div
              key={row.rank}
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.18,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.22 + i * 0.04,
              }}
              style={{
                display: "grid",
                gridTemplateColumns: "44px 1fr 1fr 140px 110px",
                padding: "0 16px",
                borderBottom:
                  i < MATCH_ROWS.length - 1
                    ? "1px solid var(--border-subtle)"
                    : "none",
                alignItems: "center",
                transition: "background 120ms ease",
                cursor: "default",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--bg-raised)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              {/* Rank */}
              <div
                style={{
                  padding: "10px 0",
                  fontFamily: "var(--font-mono)",
                  fontSize: "12px",
                  color: "var(--text-tertiary)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {row.rank}
              </div>

              {/* Firm */}
              <div
                style={{
                  padding: "10px 12px 10px 0",
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "var(--text-primary)",
                  fontFamily: "var(--font-sans)",
                }}
              >
                {row.firm}
              </div>

              {/* Signal */}
              <div
                style={{
                  padding: "10px 12px 10px 0",
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                  fontFamily: "var(--font-sans)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {row.signal}
              </div>

              {/* Match score */}
              <div style={{ padding: "10px 0" }}>
                <ScoreBar score={row.score} />
              </div>

              {/* Action */}
              <div style={{ padding: "10px 0" }}>
                <button
                  style={{
                    background: "none",
                    border: "1px solid var(--border)",
                    borderRadius: "6px",
                    padding: "5px 10px",
                    fontSize: "12px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    transition: "all 120ms ease",
                    whiteSpace: "nowrap",
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
                  Build Outreach
                  <ChevronRight size={12} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Layer 2 content ──────────────────────────────────────────────────────────

function Layer2Content() {
  return (
    <div style={{ position: "relative", minHeight: "320px" }}>
      {/* Ghost preview content behind the overlay */}
      <div style={{ opacity: 0.25, pointerEvents: "none", userSelect: "none" }}>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "24px",
            marginBottom: "16px",
          }}
        >
          <div
            style={{
              height: "14px",
              background: "var(--bg-raised)",
              borderRadius: "4px",
              width: "40%",
              marginBottom: "12px",
            }}
          />
          <div
            style={{
              height: "12px",
              background: "var(--bg-raised)",
              borderRadius: "4px",
              width: "80%",
              marginBottom: "8px",
            }}
          />
          <div
            style={{
              height: "12px",
              background: "var(--bg-raised)",
              borderRadius: "4px",
              width: "65%",
            }}
          />
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "24px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "16px",
            }}
          >
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                style={{
                  height: "80px",
                  background: "var(--bg-raised)",
                  borderRadius: "6px",
                }}
              />
            ))}
          </div>
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
            padding: "24px",
            maxWidth: "320px",
            width: "100%",
            textAlign: "center",
          }}
        >
          <Clock
            size={24}
            style={{ color: "var(--text-tertiary)", margin: "0 auto 12px" }}
          />
          <p
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              margin: "0 0 4px",
              fontFamily: "var(--font-sans)",
            }}
          >
            In development
          </p>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-tertiary)",
              margin: 0,
              fontFamily: "var(--font-sans)",
            }}
          >
            Available Q3 2026
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Layer 3 content ──────────────────────────────────────────────────────────

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
        style={{ color: "var(--accent)", marginBottom: "12px", display: "block" }}
      />
      <h3
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--text-primary)",
          margin: "0 0 8px",
          fontFamily: "var(--font-sans)",
        }}
      >
        Requires licensing
      </h3>
      <p
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          margin: "0 0 8px",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.5,
        }}
      >
        This layer requires commercial data from:
      </p>
      <div
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-sans)",
          lineHeight: 1.7,
        }}
      >
        <div>• LinkedIn Sales Navigator — people movement signals at scale, relationship mapping</div>
        <div>• Defaqto — IFA fund usage data, panel preferences, research ratings</div>
      </div>
      <a
        href="#"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          marginTop: "16px",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--accent)",
          textDecoration: "none",
          fontFamily: "var(--font-sans)",
        }}
        onMouseEnter={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "underline")
        }
        onMouseLeave={(e) =>
          ((e.currentTarget as HTMLAnchorElement).style.textDecoration = "none")
        }
      >
        Register Interest
        <ExternalLink size={12} />
      </a>
    </div>
  );
}

// ─── Data Sources Slide-Over ───────────────────────────────────────────────────

function DataSourcesPanel({ onClose }: { onClose: () => void }) {
  const sources = [
    {
      name: "FCA Register",
      purpose: "Firm authorisations, permissions, key individuals",
      layer: "1",
      cost: "Free",
      status: "green",
    },
    {
      name: "Companies House",
      purpose: "Director appointments, filings, ownership",
      layer: "1",
      cost: "Free",
      status: "green",
    },
    {
      name: "FT Adviser",
      purpose: "Industry news, partnership announcements",
      layer: "1",
      cost: "Free",
      status: "green",
    },
    {
      name: "LinkedIn (public)",
      purpose: "Career history, role changes (public profiles only)",
      layer: "1",
      cost: "Free",
      status: "amber",
    },
    {
      name: "LinkedIn Sales Navigator",
      purpose: "People movement signals at scale, relationship mapping",
      layer: "3",
      cost: "Licensed",
      status: "amber",
    },
    {
      name: "Defaqto",
      purpose: "IFA fund usage, panel preferences, research ratings",
      layer: "3",
      cost: "Licensed",
      status: "amber",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.20)",
          zIndex: 49,
          cursor: "pointer",
        }}
      />
      {/* Panel */}
      <motion.div
        initial={{ x: 420 }}
        animate={{ x: 0 }}
        exit={{ x: 420 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "420px",
          background: "var(--bg-card)",
          borderLeft: "1px solid var(--border)",
          boxShadow: "-8px 0 24px rgba(0,0,0,0.06)",
          zIndex: 50,
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            background: "var(--bg-card)",
            zIndex: 1,
          }}
        >
          <span
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Data Sources — Partnership Intelligence
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--text-tertiary)",
              display: "flex",
              alignItems: "center",
              padding: "4px",
              borderRadius: "4px",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M13.5 4.5L4.5 13.5M4.5 4.5L13.5 13.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Table */}
        <div style={{ padding: "20px" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-strong)" }}>
                {["Source", "Purpose", "Layer", "Cost", "Status"].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "8px 0",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--text-tertiary)",
                      fontFamily: "var(--font-sans)",
                      paddingRight: "12px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sources.map((s, i) => (
                <tr
                  key={s.name}
                  style={{
                    borderBottom:
                      i < sources.length - 1
                        ? "1px solid var(--border-subtle)"
                        : "none",
                  }}
                >
                  <td
                    style={{
                      padding: "10px 12px 10px 0",
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-sans)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.name}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px 10px 0",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-sans)",
                      lineHeight: 1.4,
                    }}
                  >
                    {s.purpose}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px 10px 0",
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      color: "var(--text-tertiary)",
                      fontVariantNumeric: "tabular-nums",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.layer}
                  </td>
                  <td
                    style={{
                      padding: "10px 12px 10px 0",
                      fontSize: "13px",
                      color: "var(--text-secondary)",
                      fontFamily: "var(--font-sans)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {s.cost}
                  </td>
                  <td style={{ padding: "10px 0", whiteSpace: "nowrap" }}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background:
                            s.status === "green"
                              ? "var(--success)"
                              : "var(--warning)",
                          flexShrink: 0,
                        }}
                      />
                      {s.status === "green" ? "Green" : "Amber"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px",
            borderTop: "1px solid var(--border)",
            fontSize: "13px",
            color: "var(--text-tertiary)",
            lineHeight: 1.5,
            fontFamily: "var(--font-sans)",
          }}
        >
          All data collection respects robots.txt. Personal data handled under
          UK GDPR Legitimate Interests basis.
        </div>
      </motion.div>
    </>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PartnershipIntelligencePage() {
  const [activeLayer, setActiveLayer] = useState<LayerId>(1);
  const [showDataSources, setShowDataSources] = useState(false);

  return (
    <>
      <TopBar title="Partnership Intelligence" />

      <motion.main
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        style={{
          minHeight: "calc(100vh - 52px)",
          background: "var(--bg-page)",
        }}
      >
        {/* ── Module Header ── */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-card)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "24px",
            }}
          >
            {/* Left */}
            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.01em",
                  margin: "0 0 4px",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Partnership Intelligence
              </h1>
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-secondary)",
                  margin: "0 0 10px",
                  maxWidth: "600px",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.5,
                }}
              >
                Understand why partnerships form, who catalysed them, and find
                firms matching the same profile today.
              </p>
              {/* Public Data Only badge */}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "2px 10px",
                  borderRadius: "9999px",
                  background: "var(--success-subtle)",
                  border: "1px solid rgba(34,197,94,0.20)",
                  color: "var(--success-text)",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  lineHeight: 1.4,
                }}
              >
                <ShieldCheck size={14} style={{ flexShrink: 0 }} />
                Public data only — no internal access required
              </span>
            </div>

            {/* Right: Data Sources ghost button */}
            <button
              onClick={() => setShowDataSources(true)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontFamily: "var(--font-sans)",
                flexShrink: 0,
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
              <Database size={16} />
              Data Sources
            </button>
          </div>
        </div>

        {/* ── Layer Navigation Tabs ── */}
        <div
          style={{
            borderBottom: "1px solid var(--border)",
            background: "var(--bg-card)",
            display: "flex",
            gap: 0,
            paddingLeft: "24px",
          }}
        >
          {LAYER_TABS.map((tab) => {
            const isActive = activeLayer === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveLayer(tab.id)}
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
                  fontSize: "13px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive
                    ? "var(--text-primary)"
                    : "var(--text-tertiary)",
                  fontFamily: "var(--font-sans)",
                  transition: "color 120ms ease",
                  opacity: !isActive && tab.status !== "live" ? 0.8 : 1,
                  whiteSpace: "nowrap",
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
                <span style={{ fontSize: "13px" }}>
                  Layer {tab.id} — {tab.label}
                </span>
                <span style={{ transform: "scale(0.9)", transformOrigin: "center" }}>
                  <LayerStatusBadge status={tab.status} />
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Layer Content ── */}
        <div style={{ padding: "24px", maxWidth: "1440px" }}>
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
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.006em",
                fontFamily: "var(--font-sans)",
              }}
            >
              {activeLayer === 1 && "Layer 1 — Partnership Anatomy"}
              {activeLayer === 2 && "Layer 2 — Predictive Signals"}
              {activeLayer === 3 && "Layer 3 — People Intelligence"}
            </span>
            <LayerStatusBadge
              status={
                activeLayer === 1
                  ? "live"
                  : activeLayer === 2
                  ? "building"
                  : "licensed"
              }
            />
          </div>

          {/* Layer-specific content */}
          {activeLayer === 1 && <Layer1Content />}
          {activeLayer === 2 && <Layer2Content />}
          {activeLayer === 3 && <Layer3Content />}

          {/* ── Data Freshness Strip ── */}
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
            {DATA_SOURCES.map((source, i) => (
              <span
                key={source.label}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontVariantNumeric: "tabular-nums",
                  color: source.stale
                    ? "var(--warning-text)"
                    : "var(--text-tertiary)",
                  letterSpacing: "0.01em",
                  display: "flex",
                  alignItems: "center",
                  gap: "0",
                }}
              >
                {source.label}:{" "}
                <span style={{ marginLeft: "4px" }}>{source.freshness}</span>
                {i < DATA_SOURCES.length - 1 && (
                  <span
                    style={{
                      margin: "0 12px",
                      color: "var(--border-strong)",
                    }}
                  >
                    ·
                  </span>
                )}
              </span>
            ))}
          </div>
        </div>
      </motion.main>

      {/* Data Sources Slide-Over */}
      {showDataSources && (
        <DataSourcesPanel onClose={() => setShowDataSources(false)} />
      )}
    </>
  );
}
