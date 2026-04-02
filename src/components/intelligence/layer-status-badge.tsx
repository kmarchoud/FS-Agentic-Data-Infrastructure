"use client";

import { CircleDot, Clock, Lock } from "lucide-react";

type LayerStatus = "live" | "building" | "licensed";

interface LayerStatusBadgeProps {
  status: LayerStatus;
}

const statusConfig: Record<
  LayerStatus,
  {
    label: string;
    bg: string;
    border: string;
    text: string;
    Icon: React.ElementType;
  }
> = {
  live: {
    label: "LIVE",
    bg: "var(--success-subtle)",
    border: "rgba(34, 197, 94, 0.20)",
    text: "var(--success-text)",
    Icon: CircleDot,
  },
  building: {
    label: "BUILDING",
    bg: "var(--neutral-subtle)",
    border: "rgba(107, 114, 128, 0.20)",
    text: "var(--neutral-text)",
    Icon: Clock,
  },
  licensed: {
    label: "LICENSED",
    bg: "var(--accent-subtle)",
    border: "rgba(245, 158, 11, 0.15)",
    text: "var(--accent)",
    Icon: Lock,
  },
};

export function LayerStatusBadge({ status }: LayerStatusBadgeProps) {
  const config = statusConfig[status];
  const { Icon } = config;

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        lineHeight: 1,
      }}
    >
      <Icon size={12} strokeWidth={1.5} style={{ color: config.text, flexShrink: 0 }} />
      {config.label}
    </span>
  );
}

export default LayerStatusBadge;
