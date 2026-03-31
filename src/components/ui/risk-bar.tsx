"use client";

import { useEffect, useState } from "react";

interface RiskBarProps {
  score: number;
  width?: string;
}

function getFillColor(score: number): string {
  if (score > 65) return "#DC2626";
  if (score >= 40) return "#B45309";
  return "#16A34A";
}

export function RiskBar({ score, width = "48px" }: RiskBarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // rAF ensures the 0-width paint commits before the transition fires
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const clamped = Math.max(0, Math.min(100, score));
  const fillColor = getFillColor(clamped);
  const fillWidth = mounted ? `${clamped}%` : "0%";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      {/* Track */}
      <div
        style={{
          width,
          height: "3px",
          borderRadius: "9999px",
          backgroundColor: "var(--bg-raised)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        {/* Fill */}
        <div
          style={{
            height: "100%",
            width: fillWidth,
            borderRadius: "9999px",
            backgroundColor: fillColor,
            transition:
              "width 600ms cubic-bezier(0.4, 0, 0.2, 1) 200ms",
          }}
        />
      </div>

      {/* Score number — data-sm: Geist Mono, 12px, tabular-nums */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: 1.3,
          letterSpacing: "0.01em",
          fontVariantNumeric: "tabular-nums",
          color: fillColor,
        }}
      >
        {clamped}
      </span>
    </div>
  );
}
