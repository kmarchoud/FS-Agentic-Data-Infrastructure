"use client";

import { ReactNode } from "react";
import { useCountUp } from "@/hooks/use-count-up";

type DeltaDirection = "up" | "down" | "neutral";
type Variant = "default" | "critical";

interface StatCardProps {
  label: string;
  value: number;
  valueFormat: (n: number) => string;
  delta?: string;
  deltaDirection?: DeltaDirection;
  variant?: Variant;
  icon: ReactNode;
}

export function StatCard({
  label,
  value,
  valueFormat,
  delta,
  deltaDirection = "neutral",
  variant = "default",
  icon,
}: StatCardProps) {
  const animated = useCountUp(value, 900);
  const isCritical = variant === "critical";

  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: isCritical
          ? "2px solid var(--accent)"
          : "1px solid var(--border)",
        borderRadius: "8px",
        padding: "16px",
        transition: "border-color 150ms ease",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--border-strong)";
        if (isCritical) el.style.borderTopColor = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement;
        el.style.borderColor = "var(--border)";
        if (isCritical) el.style.borderTopColor = "var(--accent)";
      }}
    >
      {/* Label row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            width: "16px",
            height: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: isCritical ? "var(--accent)" : "var(--text-tertiary)",
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontSize: "11px",
            fontWeight: 500,
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            lineHeight: 1,
            color: isCritical ? "var(--accent)" : "var(--text-tertiary)",
          }}
        >
          {label}
        </span>
      </div>

      {/* Value row — data-xl spec: Geist Mono, 24px, semibold, tabular-nums */}
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "24px",
          fontWeight: 600,
          lineHeight: 1.2,
          letterSpacing: "-0.02em",
          color: "var(--text-primary)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {valueFormat(animated)}
      </div>

      {/* Delta row — data-sm spec: Geist Mono, 12px, tabular-nums */}
      {delta && (
        <div
          style={{
            marginTop: "4px",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            lineHeight: 1.3,
            letterSpacing: "0.01em",
            fontVariantNumeric: "tabular-nums",
            color:
              deltaDirection === "up"
                ? "var(--success-text)"
                : deltaDirection === "down"
                ? "var(--danger-text)"
                : "var(--text-tertiary)",
          }}
        >
          {deltaDirection === "up" && "↑ "}
          {deltaDirection === "down" && "↓ "}
          {delta}
        </div>
      )}
    </div>
  );
}
