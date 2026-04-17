"use client";

interface OutreachRowProps {
  rank: number;
  firmName: string;
  town: string;
  adviserCount: number | null;
  mandate: string;
  whyThisWeek: string;
  onViewBrief: () => void;
}

export function OutreachRow({
  rank,
  firmName,
  town,
  adviserCount,
  mandate,
  whyThisWeek,
  onViewBrief,
}: OutreachRowProps) {
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
        {firmName}
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
          View Brief \u2192
        </button>
      </td>
    </tr>
  );
}
