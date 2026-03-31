"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DataSource {
  name: string;
  syncTime: string;
  status: "connected" | "stale" | "disconnected";
}

// ─── Hardcoded sources per MASTER.md §6d ─────────────────────────────────────

const SOURCES: DataSource[] = [
  { name: "Salesforce",         syncTime: "2m ago",  status: "connected" },
  { name: "SimCorp Dimension",  syncTime: "5m ago",  status: "connected" },
  { name: "Bloomberg Terminal", syncTime: "1m ago",  status: "connected" },
  { name: "FCA Gabriel",        syncTime: "12m ago", status: "connected" },
  { name: "Morningstar Direct", syncTime: "8m ago",  status: "connected" },
];

// ─── Pulse dot animation — injected once ─────────────────────────────────────
// @keyframes pulse-dot per MASTER.md §8.6

const PULSE_STYLE = `
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.3; }
}
.animate-pulse-dot {
  animation: pulse-dot 2.2s ease-in-out infinite;
}
`;

// ─── Status dot ───────────────────────────────────────────────────────────────

function StatusDot({ status }: { status: DataSource["status"] }) {
  const baseStyle: React.CSSProperties = {
    width: "6px",
    height: "6px",
    borderRadius: "9999px",
    flexShrink: 0,
  };

  if (status === "connected") {
    return (
      <span
        className="animate-pulse-dot"
        style={{ ...baseStyle, backgroundColor: "var(--success)" }}
      />
    );
  }
  if (status === "stale") {
    return (
      <span style={{ ...baseStyle, backgroundColor: "var(--warning)" }} />
    );
  }
  // disconnected
  return (
    <span style={{ ...baseStyle, backgroundColor: "var(--text-disabled)" }} />
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function DataSourceStrip() {
  return (
    <>
      {/* Inject keyframes once */}
      <style>{PULSE_STYLE}</style>

      {/*
       * MASTER.md §6d:
       *   NOT a card — a flush horizontal bar
       *   padding: 10px 20px
       *   bg-card, border-top + border-bottom 1px var(--border)
       *   flex, align-items center
       *   divide-x on source items
       */}
      <div
        style={{
          background: "var(--bg-card)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* "DATA SOURCES" label — card-label style, text-tertiary, flex-shrink 0 */}
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            lineHeight: 1,
            color: "var(--text-tertiary)",
            marginRight: "20px",
            flexShrink: 0,
          }}
        >
          DATA SOURCES
        </span>

        {/* Source items — divide-x via inline border-left on non-first items */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {SOURCES.map((source, i) => (
            <div
              key={source.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: i === 0 ? "0 20px 0 0" : "0 20px",
                borderLeft: i === 0 ? "none" : "1px solid var(--border)",
              }}
            >
              <StatusDot status={source.status} />

              {/* Source name — body-sm (13px), text-secondary */}
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: 400,
                  lineHeight: 1.5,
                  color: "var(--text-secondary)",
                  whiteSpace: "nowrap",
                }}
              >
                {source.name}
              </span>

              {/* Sync time — caption: Geist Mono 11px, text-tertiary */}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 400,
                  letterSpacing: "0.01em",
                  lineHeight: 1.3,
                  color: "var(--text-tertiary)",
                  fontVariantNumeric: "tabular-nums",
                  whiteSpace: "nowrap",
                }}
              >
                {source.syncTime}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
