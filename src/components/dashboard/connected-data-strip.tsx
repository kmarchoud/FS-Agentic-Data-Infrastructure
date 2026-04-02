"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck } from "lucide-react";

const SYSTEMS = [
  { name: "Salesforce CRM", syncTime: "2m ago" },
  { name: "Aladdin PMS", syncTime: "5m ago" },
  { name: "Bloomberg", syncTime: "1m ago" },
  { name: "LSEG", syncTime: "3m ago" },
  { name: "Morningstar", syncTime: "8m ago" },
  { name: "Outlook", syncTime: "1m ago" },
];

function ConnectedDataExplainer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)",
              zIndex: 49, cursor: "pointer",
            }}
          />
          <motion.aside
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed", top: 0, right: 0, height: "100vh", width: "400px",
              background: "var(--bg-card)", borderLeft: "1px solid var(--border)",
              boxShadow: "-8px 0 24px rgba(0,0,0,0.06)", padding: "24px",
              overflowY: "auto", zIndex: 50,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>
                Why this view requires connected data
              </h2>
              <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: "4px" }}>
                <X size={18} style={{ color: "var(--text-tertiary)" }} />
              </button>
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "24px" }}>
              The Morning Brief you&apos;re viewing combines three data layers simultaneously:
            </p>

            {/* Section 1 */}
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "24px", fontWeight: 600, color: "var(--accent)", lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>1</span>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>External Intelligence (Public Data)</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "4px" }}>
                    Market events, IFA signals, competitor moves, platform changes — surfaced automatically from public sources. This layer is always on.
                  </p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "8px", padding: "2px 10px", borderRadius: "9999px", background: "var(--success-subtle)", border: "1px solid rgba(34,197,94,0.20)", color: "var(--success-text)", fontSize: "13px" }}>
                    <ShieldCheck size={14} /> Public data only
                  </span>
                </div>
              </div>
            </div>

            {/* Section 2 */}
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "24px", fontWeight: 600, color: "var(--accent)", lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>2</span>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Relationship Layer (CRM)</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "4px" }}>
                    Which clients you manage, when you last spoke to them, what was said, what was promised. Without this, the Morning Brief cannot prioritise your specific book.
                  </p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "8px", padding: "2px 10px", borderRadius: "9999px", background: "var(--neutral-subtle)", border: "1px solid rgba(107,114,128,0.20)", color: "var(--neutral-text)", fontSize: "13px" }}>
                    Salesforce CRM
                  </span>
                </div>
              </div>
            </div>

            {/* Section 3 */}
            <div style={{ marginTop: "20px" }}>
              <div style={{ display: "flex", gap: "16px" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "24px", fontWeight: 600, color: "var(--accent)", lineHeight: 1.2, fontVariantNumeric: "tabular-nums" }}>3</span>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>Performance Layer (PMS + Market Data)</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6, marginTop: "4px" }}>
                    How your funds are performing vs benchmark, which client holdings are affected by market events. Without this, fund impact analysis is generic, not specific to your mandates.
                  </p>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", marginTop: "8px", padding: "2px 10px", borderRadius: "9999px", background: "var(--neutral-subtle)", border: "1px solid rgba(107,114,128,0.20)", color: "var(--neutral-text)", fontSize: "13px" }}>
                    Aladdin PMS · Bloomberg
                  </span>
                </div>
              </div>
            </div>

            {/* Divider + closing */}
            <hr style={{ border: "none", borderTop: "1px solid var(--border)", margin: "24px 0" }} />
            <p style={{ fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
              Start with public intelligence. Add connected layers when you&apos;re ready.
            </p>
            <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
              <a href="/intelligence" style={{
                display: "inline-flex", padding: "8px 16px", borderRadius: "6px",
                background: "var(--accent)", color: "white", fontSize: "13px",
                fontWeight: 500, textDecoration: "none", transition: "opacity 120ms ease",
              }}>
                Explore Intelligence Modules →
              </a>
              <button style={{
                padding: "8px 16px", borderRadius: "6px", background: "transparent",
                border: "1px solid var(--border)", color: "var(--text-secondary)",
                fontSize: "13px", fontWeight: 500, cursor: "pointer",
                transition: "all 120ms ease",
              }}>
                Request Integration Setup
              </button>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export function ConnectedDataStrip() {
  const [explainerOpen, setExplainerOpen] = useState(false);

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "36px",
          background: "var(--bg-subtle)",
          borderBottom: "1px solid var(--border)",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        {/* Left */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{
            fontSize: "11px", fontWeight: 500, textTransform: "uppercase",
            letterSpacing: "0.06em", color: "var(--text-tertiary)", marginRight: "4px",
          }}>
            Connected:
          </span>
          {SYSTEMS.map((sys) => (
            <span
              key={sys.name}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "2px 8px", background: "var(--bg-card)",
                border: "1px solid var(--border)", borderRadius: "4px",
              }}
            >
              <span style={{
                width: "5px", height: "5px", borderRadius: "50%",
                background: "var(--success)", flexShrink: 0,
              }} />
              <span style={{
                fontFamily: "var(--font-mono)", fontSize: "11px",
                color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums",
                whiteSpace: "nowrap",
              }}>
                {sys.name}
              </span>
            </span>
          ))}
        </div>

        {/* Right */}
        <button
          onClick={() => setExplainerOpen(true)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: "11px", color: "var(--text-tertiary)",
            transition: "color 120ms ease", padding: 0,
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-secondary)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-tertiary)"; }}
        >
          Why does this view require connected data? →
        </button>
      </div>

      <ConnectedDataExplainer isOpen={explainerOpen} onClose={() => setExplainerOpen(false)} />
    </>
  );
}
