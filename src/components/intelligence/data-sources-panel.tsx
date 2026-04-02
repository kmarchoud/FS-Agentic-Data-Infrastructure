"use client";

import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DataSource {
  name: string;
  purpose: string;
  layer: number;
  cost: "Free" | "Licensed";
  legalStatus: "Green" | "Amber";
}

interface DataSourcesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  sources: DataSource[];
  moduleName: string;
}

export function DataSourcesPanel({
  isOpen,
  onClose,
  sources,
  moduleName,
}: DataSourcesPanelProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.2)",
              zIndex: 49,
              cursor: "pointer",
            }}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              right: 0,
              top: 0,
              height: "100vh",
              width: "420px",
              zIndex: 50,
              background: "var(--bg-card)",
              borderLeft: "1px solid var(--border)",
              boxShadow: "-8px 0 24px rgba(0, 0, 0, 0.06)",
              display: "flex",
              flexDirection: "column",
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
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                }}
              >
                Data Sources — {moduleName}
              </span>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                }}
              >
                <X
                  size={18}
                  strokeWidth={1.5}
                  style={{ color: "var(--text-tertiary)" }}
                />
              </button>
            </div>

            {/* Body — Table */}
            <div style={{ padding: "20px", flex: 1 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["Source", "Purpose", "Layer", "Cost", "Legal Status"].map(
                      (header) => (
                        <th
                          key={header}
                          style={{
                            padding: "10px 12px",
                            fontSize: "11px",
                            fontWeight: 500,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            color: "var(--text-tertiary)",
                            borderBottom: "1px solid var(--border-strong)",
                            textAlign: "left",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sources.map((source) => (
                    <tr
                      key={source.name}
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                      }}
                    >
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                        }}
                      >
                        {source.name}
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {source.purpose}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                            background: "var(--neutral-subtle)",
                            border: "1px solid rgba(107, 114, 128, 0.20)",
                            color: "var(--neutral-text)",
                          }}
                        >
                          {source.layer}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: "10px 12px",
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {source.cost}
                      </td>
                      <td style={{ padding: "10px 12px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            fontSize: "13px",
                            color: "var(--text-secondary)",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background:
                                source.legalStatus === "Green"
                                  ? "var(--success)"
                                  : "var(--warning)",
                              flexShrink: 0,
                            }}
                          />
                          {source.legalStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer — GDPR disclaimer */}
            <div
              style={{
                padding: "20px",
                borderTop: "1px solid var(--border)",
                flexShrink: 0,
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  color: "var(--text-tertiary)",
                  lineHeight: 1.5,
                  margin: 0,
                }}
              >
                All data collection respects robots.txt. Personal data handled
                under UK GDPR Legitimate Interests basis.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default DataSourcesPanel;
