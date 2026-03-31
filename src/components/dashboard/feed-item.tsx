"use client";

// ─── Source badge styles — exact rgba values from MASTER.md §6m ──────────────

interface SourceStyle {
  bg: string;
  border: string;
  text: string;
}

const SOURCE_STYLES: Record<string, SourceStyle> = {
  BLOOMBERG: {
    bg:     "rgba(245,158,11,0.08)",
    border: "rgba(245,158,11,0.20)",
    text:   "#B45309",
  },
  LSEG: {
    bg:     "rgba(59,130,246,0.08)",
    border: "rgba(59,130,246,0.20)",
    text:   "#2563EB",
  },
  REUTERS: {
    bg:     "rgba(234,88,12,0.08)",
    border: "rgba(234,88,12,0.20)",
    text:   "#C2410C",
  },
  FT: {
    bg:     "rgba(236,72,153,0.08)",
    border: "rgba(236,72,153,0.20)",
    text:   "#DB2777",
  },
  MORNINGSTAR: {
    bg:     "rgba(16,185,129,0.08)",
    border: "rgba(16,185,129,0.20)",
    text:   "#059669",
  },
};

const DEFAULT_SOURCE_STYLE: SourceStyle = {
  bg:     "var(--bg-raised)",
  border: "var(--border)",
  text:   "var(--text-secondary)",
};

function getSourceStyle(source: string): SourceStyle {
  return SOURCE_STYLES[source.toUpperCase()] ?? DEFAULT_SOURCE_STYLE;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface FeedItemProps {
  timestamp: string;
  source: string;
  headline: string;
  relevantClients?: string[];
  isLast?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FeedItem({
  timestamp,
  source,
  headline,
  relevantClients = [],
  isLast = false,
}: FeedItemProps) {
  const srcStyle = getSourceStyle(source);

  return (
    <div
      style={{
        padding: "12px 0",
        borderBottom: isLast ? "none" : "1px solid var(--border-subtle)",
        display: "flex",
        gap: "12px",
        alignItems: "flex-start",
      }}
    >
      {/* Timestamp — caption: Geist Mono 11px, text-tertiary, fixed 48px width */}
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
          width: "48px",
          flexShrink: 0,
          paddingTop: "1px",
        }}
      >
        {timestamp}
      </span>

      {/* Content column */}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
        {/* Source badge — badge-text: 11px, font-semibold, uppercase, tracking-wide */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            alignSelf: "flex-start",
            padding: "1px 6px",
            borderRadius: "4px",
            fontSize: "11px",
            fontWeight: 600,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            whiteSpace: "nowrap",
            border: `1px solid ${srcStyle.border}`,
            backgroundColor: srcStyle.bg,
            color: srcStyle.text,
          }}
        >
          {source}
        </span>

        {/* Headline — body-sm (13px), text-primary (scannable per spec) */}
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "var(--text-primary)",
          }}
        >
          {headline}
        </p>

        {/* Relevance tags — caption 11px, text-tertiary */}
        {relevantClients.length > 0 && (
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontWeight: 400,
              letterSpacing: "0.01em",
              lineHeight: 1.3,
              color: "var(--text-tertiary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            → {relevantClients.join(" · ")}
          </p>
        )}
      </div>
    </div>
  );
}
