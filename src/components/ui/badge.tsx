type BadgeVariant =
  // Status badges
  | "urgent"
  | "at-risk"
  | "stable"
  | "opportunity"
  // Client type badges
  | "pension-fund"
  | "endowment"
  | "insurance"
  | "wealth-manager"
  | "platform"
  | "family-office";

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
  // ── Status badges — semantic CSS variable colours ───────────────────────────
  urgent: {
    backgroundColor: "var(--danger-subtle)",
    borderColor: "rgba(239, 68, 68, 0.20)",
    color: "var(--danger-text)",
  },
  "at-risk": {
    backgroundColor: "var(--warning-subtle)",
    borderColor: "rgba(245, 158, 11, 0.20)",
    color: "var(--warning-text)",
  },
  stable: {
    backgroundColor: "var(--neutral-subtle)",
    borderColor: "rgba(107, 114, 128, 0.20)",
    color: "var(--neutral-text)",
  },
  opportunity: {
    backgroundColor: "var(--success-subtle)",
    borderColor: "rgba(34, 197, 94, 0.20)",
    color: "var(--success-text)",
  },

  // ── Client type badges — CSS variable palette from Section 2 ───────────────
  "pension-fund": {
    backgroundColor: "var(--badge-pension-bg)",
    borderColor: "var(--badge-pension-border)",
    color: "var(--badge-pension-text)",
  },
  endowment: {
    backgroundColor: "var(--badge-endowment-bg)",
    borderColor: "var(--badge-endowment-border)",
    color: "var(--badge-endowment-text)",
  },
  insurance: {
    backgroundColor: "var(--badge-insurance-bg)",
    borderColor: "var(--badge-insurance-border)",
    color: "var(--badge-insurance-text)",
  },
  "wealth-manager": {
    backgroundColor: "var(--badge-wealth-bg)",
    borderColor: "var(--badge-wealth-border)",
    color: "var(--badge-wealth-text)",
  },
  platform: {
    backgroundColor: "var(--badge-platform-bg)",
    borderColor: "var(--badge-platform-border)",
    color: "var(--badge-platform-text)",
  },
  "family-office": {
    backgroundColor: "var(--badge-family-bg)",
    borderColor: "var(--badge-family-border)",
    color: "var(--badge-family-text)",
  },
};

export function Badge({ variant, children }: BadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        borderRadius: "9999px",
        padding: "2px 8px",
        fontSize: "11px",
        fontWeight: 600,
        lineHeight: 1,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
        borderStyle: "solid",
        borderWidth: "1px",
        whiteSpace: "nowrap",
        ...variantStyles[variant],
      }}
    >
      {children}
    </span>
  );
}
