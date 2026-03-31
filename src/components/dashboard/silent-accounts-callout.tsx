"use client";

// ─── Hardcoded data per spec ──────────────────────────────────────────────────

const SILENT_ACCOUNTS = [
  { name: "Aviva Staff Pension",         daysSilent: 61, aum: "£1.2bn" },
  { name: "Phoenix Group",               daysSilent: 72, aum: "£760m"  },
  { name: "West Midlands Pension Fund",  daysSilent: 47, aum: "£510m"  },
];

// Combined stats (hardcoded per spec)
const COMBINED_AUM    = "£2.35bn";
const FEES_AT_RISK    = "£9.87m";

// ─── Component ────────────────────────────────────────────────────────────────

export function SilentAccountsCallout() {
  return (
    <div
      style={{
        borderRadius: "8px",
        border: "1px solid rgba(239,68,68,0.20)",
        borderLeft: "2px solid var(--danger)",
        backgroundColor: "rgba(239,68,68,0.08)",
        padding: "16px",
      }}
    >
      {/* Heading row */}
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "8px",
        }}
      >
        {/* "3 accounts · no contact in 45+ days" */}
        <span
          style={{
            fontSize: "13px",
            fontWeight: 600,
            lineHeight: 1.4,
            color: "var(--danger-text)",
          }}
        >
          3 accounts · no contact in 45+ days
        </span>

        {/* Combined AUM + fees at risk — font-mono, danger-text */}
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            fontWeight: 400,
            lineHeight: 1.3,
            letterSpacing: "0.01em",
            fontVariantNumeric: "tabular-nums",
            color: "var(--danger-text)",
            whiteSpace: "nowrap",
          }}
        >
          Combined AUM: {COMBINED_AUM} · Annual fees at risk: {FEES_AT_RISK}
        </span>
      </div>

      {/* Account list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {SILENT_ACCOUNTS.map((account) => (
          <div
            key={account.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            {/* Client name — body-sm, text-primary */}
            <span
              style={{
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: 1.5,
                color: "var(--text-primary)",
              }}
            >
              {account.name}
            </span>

            {/* Days + AUM — Geist Mono, caption, right side */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexShrink: 0 }}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 400,
                  lineHeight: 1.3,
                  letterSpacing: "0.01em",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--danger-text)",
                }}
              >
                {account.daysSilent}d
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 400,
                  lineHeight: 1.3,
                  letterSpacing: "0.01em",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--text-tertiary)",
                }}
              >
                {account.aum}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
