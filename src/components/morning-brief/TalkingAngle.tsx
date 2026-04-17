"use client";

import { useAmber } from "@/lib/contexts/amber-context";

interface TalkingAngleProps {
  text: string;
  isHighestSentiment: boolean;
  onFocus: () => void;
}

export function TalkingAngle({ text, isHighestSentiment, onFocus }: TalkingAngleProps) {
  const { amberOwner } = useAmber();
  const isAmber = amberOwner === "impact-card" && isHighestSentiment;

  return (
    <div style={{ marginTop: "4px" }}>
      <div
        style={{
          background: isAmber ? "var(--accent-subtle)" : "transparent",
          border: isAmber ? "1px solid rgba(245, 158, 11, 0.20)" : "1px solid transparent",
          borderRadius: "6px",
          padding: "10px 12px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: isAmber ? "var(--accent)" : "var(--text-tertiary)",
            marginBottom: "4px",
          }}
        >
          TALKING ANGLE
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            fontWeight: isAmber ? 500 : 400,
            lineHeight: 1.5,
          }}
        >
          {text}
        </div>
      </div>
      {!isAmber && (
        <button
          onClick={onFocus}
          style={{
            background: "none",
            border: "none",
            padding: "4px 0",
            fontSize: "11px",
            color: "var(--text-tertiary)",
            cursor: "pointer",
            transition: "color 120ms ease",
            marginTop: "4px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--text-tertiary)";
          }}
        >
          Focus this angle
        </button>
      )}
    </div>
  );
}
