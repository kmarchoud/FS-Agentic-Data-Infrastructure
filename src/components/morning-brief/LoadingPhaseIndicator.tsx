"use client";

import { Check } from "lucide-react";

type Phase = "market" | "news" | "synthesis" | "complete" | "error";

interface LoadingPhaseIndicatorProps {
  phase: Phase;
}

const STEPS = [
  { id: "market", activeLabel: "Fetching market data...", completeLabel: "Market data loaded" },
  { id: "news", activeLabel: "Analysing signals...", completeLabel: "Signals analysed" },
  { id: "synthesis", activeLabel: "Generating brief...", completeLabel: "Brief generated" },
] as const;

function getStepState(
  stepId: string,
  currentPhase: Phase
): "active" | "pending" | "complete" {
  const order = ["market", "news", "synthesis", "complete"];
  const currentIdx = order.indexOf(currentPhase);
  const stepIdx = order.indexOf(stepId);

  if (currentPhase === "error") {
    // Show completed steps up to where it failed
    if (stepIdx < currentIdx) return "complete";
    return "pending";
  }
  if (currentPhase === "complete") return "complete";
  if (stepIdx < currentIdx) return "complete";
  if (stepIdx === currentIdx) return "active";
  return "pending";
}

export function LoadingPhaseIndicator({ phase }: LoadingPhaseIndicatorProps) {
  if (phase === "complete") return null;

  return (
    <div
      style={{
        display: "flex",
        gap: "16px",
        alignItems: "center",
        padding: "12px 0",
        marginBottom: "8px",
        transition: "opacity 300ms ease",
      }}
    >
      {STEPS.map((step) => {
        const state = getStepState(step.id, phase);
        return (
          <div
            key={step.id}
            style={{ display: "flex", alignItems: "center", gap: "6px" }}
          >
            {state === "complete" ? (
              <Check size={12} style={{ color: "var(--success-text)" }} />
            ) : (
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: state === "active" ? "var(--success)" : "var(--text-disabled)",
                  display: "inline-block",
                  animation: state === "active" ? "pulse-dot 2.2s ease-in-out infinite" : "none",
                }}
              />
            )}
            <span
              style={{
                fontSize: "11px",
                fontWeight: state === "active" ? 500 : 400,
                color: state === "active" ? "var(--text-primary)" : "var(--text-tertiary)",
              }}
            >
              {state === "complete" ? step.completeLabel : step.activeLabel}
            </span>
          </div>
        );
      })}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
