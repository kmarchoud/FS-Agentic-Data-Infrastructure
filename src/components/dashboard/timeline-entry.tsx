"use client";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TimelineEntryType = "Meeting" | "Call" | "Email" | "Report Sent" | "RFP Response";

export interface TimelineEntryProps {
  date: string;
  type: TimelineEntryType;
  description: string;
  outcome?: string;
  contact?: string;
  isLast?: boolean;
}

// ─── Type → dot colour mapping — MASTER.md §6k ───────────────────────────────
//   Meeting:      amber fill (var(--accent))
//   Call:         success border (var(--success))
//   Email:        neutral border (var(--neutral))
//   Report Sent:  warning border (var(--warning))
//   RFP Response: accent border (var(--accent))

interface DotConfig {
  /** Filled dot (Meeting): the entire inner circle gets this colour */
  fillColour: string;
  /** Border override for call/email/report/rfp types */
  borderColour: string;
  /** Whether the dot is fully filled (Meeting style) */
  filled: boolean;
}

const DOT_CONFIG: Record<TimelineEntryType, DotConfig> = {
  "Meeting":      { fillColour: "var(--accent)",   borderColour: "var(--accent)",   filled: true  },
  "Call":         { fillColour: "var(--success)",  borderColour: "var(--success)",  filled: false },
  "Email":        { fillColour: "var(--neutral)",  borderColour: "var(--neutral)",  filled: false },
  "Report Sent":  { fillColour: "var(--warning)",  borderColour: "var(--warning)",  filled: false },
  "RFP Response": { fillColour: "var(--accent)",   borderColour: "var(--accent)",   filled: false },
};

// ─── Component ────────────────────────────────────────────────────────────────

export function TimelineEntry({
  date,
  type,
  description,
  outcome,
  contact,
  isLast = false,
}: TimelineEntryProps) {
  const dot = DOT_CONFIG[type];

  return (
    /*
     * MASTER.md §6k:
     *   container: position relative, padding-left 24px
     *   entry: padding-bottom 24px (0 on last)
     */
    <div
      style={{
        position: "relative",
        paddingLeft: "24px",
        paddingBottom: isLast ? 0 : "24px",
      }}
    >
      {/* ── Vertical line — 1px #E8E8E5, absolute left 7px top 0 bottom 0 ── */}
      {!isLast && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "7px",
            top: 0,
            bottom: 0,
            width: "1px",
            backgroundColor: "#E8E8E5",
          }}
        />
      )}

      {/* ── Dot — 14px circle, absolute, centred on the line ─────────────── */}
      {/*
       * Line centre: left 7px.  Dot width 14px → left = 7 - 7 = 0px.
       * top: 4px per spec.
       */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "0px",
          top: "4px",
          width: "14px",
          height: "14px",
          borderRadius: "9999px",
          backgroundColor: "var(--bg-card)",
          border: dot.filled
            ? `2px solid ${dot.borderColour}`
            : `2px solid ${dot.borderColour}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxSizing: "border-box",
        }}
      >
        {/* Inner 6px fill circle — Meeting gets amber fill */}
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "9999px",
            backgroundColor: dot.filled ? dot.fillColour : "transparent",
          }}
        />
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <div style={{ marginLeft: "4px" }}>
        {/* Date — caption: Geist Mono 11px, text-tertiary */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            fontWeight: 400,
            letterSpacing: "0.01em",
            lineHeight: 1.3,
            color: "var(--text-tertiary)",
            fontVariantNumeric: "tabular-nums",
            display: "block",
            marginBottom: "3px",
          }}
        >
          {date}
        </span>

        {/* Type badge — inline badge per §6g */}
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "2px 8px",
            borderRadius: "9999px",
            fontSize: "11px",
            fontWeight: 600,
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
            backgroundColor: "var(--bg-raised)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
            marginBottom: "4px",
          }}
        >
          {type}
        </span>

        {/* Contact — body-sm, text-tertiary, italic */}
        {contact && (
          <p
            style={{
              margin: "0 0 4px 0",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: 1.5,
              fontStyle: "italic",
              color: "var(--text-tertiary)",
            }}
          >
            with {contact}
          </p>
        )}

        {/* Description — body-sm, text-secondary */}
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "var(--text-secondary)",
          }}
        >
          {description}
        </p>

        {/* Outcome — body-sm, text-tertiary, italic */}
        {outcome && (
          <p
            style={{
              margin: "2px 0 0 0",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: 1.5,
              fontStyle: "italic",
              color: "var(--text-tertiary)",
            }}
          >
            {outcome}
          </p>
        )}
      </div>
    </div>
  );
}
