"use client";

import { useState } from "react";
import type { ImpactCard as ImpactCardType } from "@/lib/data/morning-brief-types";
import { ImpactCard } from "./ImpactCard";
import { SkeletonCard } from "./SkeletonCard";

interface ImpactGridProps {
  cards: ImpactCardType[];
  loading: boolean;
}

export function ImpactGrid({ cards, loading }: ImpactGridProps) {
  // Track which card index has the "focused" amber angle
  const [focusedIdx, setFocusedIdx] = useState<number>(() => {
    // Default: first positive, or first neutral if no positive
    const posIdx = cards.findIndex((c) => c.sentiment === "positive");
    if (posIdx >= 0) return posIdx;
    const neuIdx = cards.findIndex((c) => c.sentiment === "neutral");
    return neuIdx >= 0 ? neuIdx : 0;
  });

  // Recalculate default if cards change
  const effectiveFocused = focusedIdx < cards.length ? focusedIdx : 0;

  return (
    <div style={{ marginTop: "32px" }}>
      {/* Section header */}
      <div>
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          What This Means for Distribution
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-tertiary)",
            marginTop: "4px",
            marginBottom: 0,
          }}
        >
          How current market conditions affect the fund range and IFA conversations
        </p>
      </div>

      {/* Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "16px",
          marginTop: "16px",
        }}
      >
        {loading ? (
          <>
            <SkeletonCard
              lines={[
                { width: "120px", height: "14px" },
                { width: "80px", height: "11px" },
                { width: "100%", height: "1px" },
                { width: "60px", height: "11px" },
                { width: "90%", height: "13px" },
                { width: "60px", height: "11px" },
                { width: "80%", height: "13px" },
              ]}
            />
            <SkeletonCard
              lines={[
                { width: "120px", height: "14px" },
                { width: "80px", height: "11px" },
                { width: "100%", height: "1px" },
                { width: "60px", height: "11px" },
                { width: "90%", height: "13px" },
                { width: "60px", height: "11px" },
                { width: "80%", height: "13px" },
              ]}
            />
          </>
        ) : cards.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "32px",
              fontSize: "13px",
              color: "var(--text-tertiary)",
            }}
          >
            Synthesis unavailable \u00B7 Refresh to retry
          </div>
        ) : (
          cards.map((card, i) => (
            <ImpactCard
              key={`${card.mandate_category}-${i}`}
              card={card}
              isHighestSentiment={i === effectiveFocused}
              onFocusAngle={() => setFocusedIdx(i)}
            />
          ))
        )}
      </div>

      <style>{`
        @media (max-width: 639px) {
          div[style*="grid-template-columns: repeat(2"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
