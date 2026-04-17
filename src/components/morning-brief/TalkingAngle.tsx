"use client";

interface TalkingAngleProps {
  text: string;
  sentiment: "positive" | "neutral" | "negative";
  isHighestSentiment: boolean;
  onFocus: () => void;
}

const SENTIMENT_STYLES = {
  positive: {
    bg: "var(--success-subtle)",
    borderColor: "var(--success-text)",
    labelColor: "var(--success-text)",
  },
  negative: {
    bg: "var(--danger-subtle)",
    borderColor: "var(--danger-text)",
    labelColor: "var(--danger-text)",
  },
  neutral: {
    bg: "var(--bg-raised)",
    borderColor: "var(--text-tertiary)",
    labelColor: "var(--text-tertiary)",
  },
};

export function TalkingAngle({ text, sentiment, isHighestSentiment, onFocus }: TalkingAngleProps) {
  const styles = SENTIMENT_STYLES[sentiment];

  return (
    <div style={{ marginTop: "12px" }}>
      <div
        style={{
          background: styles.bg,
          borderLeft: `3px solid ${styles.borderColor}`,
          borderRadius: "6px",
          padding: "12px",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: styles.labelColor,
            marginBottom: "4px",
          }}
        >
          TALKING ANGLE
        </div>
        <div
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            fontWeight: 500,
            lineHeight: 1.5,
          }}
        >
          {text}
        </div>
      </div>
      {!isHighestSentiment && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
          <button
            onClick={onFocus}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              padding: "4px 10px",
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--text-secondary)",
              cursor: "pointer",
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
            Make this today&apos;s angle
          </button>
        </div>
      )}
    </div>
  );
}
