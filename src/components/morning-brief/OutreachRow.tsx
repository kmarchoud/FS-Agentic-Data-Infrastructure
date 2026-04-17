"use client";

interface OutreachRowProps {
  rank: number;
  firmName: string;
  town: string;
  adviserCount: number | null;
  mandate: string;
  whyThisWeek: string;
  fitScore: number;
  differentiator: string;
  onViewBrief: () => void;
}

function getPriorityBarColor(score: number): string {
  if (score >= 80) return "var(--success-text)";
  if (score >= 70) return "var(--success)";
  if (score >= 60) return "rgba(34,197,94,0.40)";
  return "var(--bg-subtle)";
}

export function OutreachRow({
  rank,
  firmName,
  town,
  adviserCount,
  mandate,
  whyThisWeek,
  fitScore,
  differentiator,
  onViewBrief,
}: OutreachRowProps) {
  const fullWhyText = differentiator
    ? `${whyThisWeek} \u00B7 ${differentiator}`
    : whyThisWeek;

  return (
    <tr
      style={{ transition: "background 100ms ease" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-raised)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
      }}
    >
      <td
        style={{
          width: "40px",
          padding: "10px 12px",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          fontVariantNumeric: "tabular-nums",
          color: "var(--text-tertiary)",
          textAlign: "center",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {rank}
      </td>
      <td
        style={{
          width: "200px",
          padding: "10px 12px",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--text-primary)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={{
              width: "4px",
              height: "32px",
              borderRadius: "9999px",
              flexShrink: 0,
              background: getPriorityBarColor(fitScore),
            }}
          />
          {firmName}
        </div>
      </td>
      <td
        style={{
          width: "120px",
          padding: "10px 12px",
          fontSize: "13px",
          color: "var(--text-secondary)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {town}
      </td>
      <td
        style={{
          width: "80px",
          padding: "10px 12px",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          fontVariantNumeric: "tabular-nums",
          color: "var(--text-primary)",
          textAlign: "right",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {adviserCount ?? "\u2014"}
      </td>
      <td
        style={{
          width: "140px",
          padding: "10px 12px",
          fontFamily: "var(--font-mono)",
          fontSize: "11px",
          color: "var(--text-tertiary)",
          fontVariantNumeric: "tabular-nums",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {mandate}
      </td>
      <td
        style={{
          padding: "10px 12px",
          fontSize: "13px",
          color: "var(--text-secondary)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        {whyThisWeek}
        {differentiator && (
          <span style={{ color: "var(--text-tertiary)" }}>
            {" "}&middot; {differentiator}
          </span>
        )}
      </td>
      <td
        style={{
          width: "100px",
          padding: "10px 12px",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <button
          onClick={onViewBrief}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontSize: "13px",
            fontWeight: 500,
            color: "var(--accent)",
            cursor: "pointer",
            transition: "color 120ms ease",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--accent-hover)";
            e.currentTarget.style.textDecoration = "underline";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--accent)";
            e.currentTarget.style.textDecoration = "none";
          }}
        >
          View Brief &rarr;
        </button>
      </td>
    </tr>
  );
}
