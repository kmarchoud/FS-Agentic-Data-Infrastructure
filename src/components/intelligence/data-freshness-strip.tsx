"use client";

interface FreshnessSource {
  name: string;
  lastUpdated: string;
}

interface DataFreshnessStripProps {
  sources: FreshnessSource[];
}

export function DataFreshnessStrip({ sources }: DataFreshnessStripProps) {
  return (
    <div
      style={{
        marginTop: "32px",
        paddingTop: "12px",
        borderTop: "1px solid var(--border-subtle)",
        display: "flex",
        gap: "0",
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      {sources.map((source, index) => (
        <span
          key={source.name}
          style={{
            fontSize: "11px",
            fontFamily: "var(--font-mono)",
            color: "var(--text-tertiary)",
            letterSpacing: "0.01em",
            lineHeight: 1.3,
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {source.name}: {source.lastUpdated}
          {index < sources.length - 1 && (
            <span
              style={{
                margin: "0 8px",
                color: "var(--text-tertiary)",
              }}
            >
              &middot;
            </span>
          )}
        </span>
      ))}
    </div>
  );
}

export default DataFreshnessStrip;
