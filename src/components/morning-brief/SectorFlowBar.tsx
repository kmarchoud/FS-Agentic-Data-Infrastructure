"use client";

interface SectorFlowBarProps {
  flow: number;
  month: string;
  maxFlow?: number;
}

export function SectorFlowBar({ flow, month, maxFlow = 500 }: SectorFlowBarProps) {
  const fillWidth = Math.min((Math.abs(flow) / maxFlow) * 100, 100);
  const fillColor = flow >= 0 ? "var(--success-text)" : "var(--danger-text)";

  // Format month: "2026-02" -> "Feb 2026"
  const formatMonth = (m: string) => {
    try {
      const d = new Date(m + "-01");
      return d.toLocaleDateString("en-GB", { month: "short", year: "numeric" });
    } catch {
      return m;
    }
  };

  const sign = flow >= 0 ? "+" : "-";
  const label = `${sign}\u00A3${Math.abs(flow)}m \u00B7 ${formatMonth(month)}`;

  return (
    <div
      style={{
        marginTop: "12px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <div
        style={{
          height: "4px",
          borderRadius: "9999px",
          background: "var(--bg-subtle)",
          width: "100%",
          maxWidth: "200px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            borderRadius: "9999px",
            width: `${fillWidth}%`,
            background: fillColor,
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          fontVariantNumeric: "tabular-nums",
          color: "var(--text-tertiary)",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
    </div>
  );
}
