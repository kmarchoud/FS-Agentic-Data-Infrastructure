"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAmber } from "@/lib/contexts/amber-context";

interface BriefData {
  firmName: string;
  fitScore: number;
  firmType: string;
  briefWho: string | null;
  briefWhy: string | null;
  briefOpener: string | null;
}

interface BriefSlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  brief: BriefData | null;
}

function getFitScoreColor(score: number): string {
  if (score >= 70) return "var(--success)";
  if (score >= 50) return "var(--warning)";
  return "var(--neutral)";
}

export function BriefSlideOver({ isOpen, onClose, brief }: BriefSlideOverProps) {
  const { claimAmber, releaseAmber } = useAmber();

  useEffect(() => {
    if (isOpen) {
      claimAmber("slide-over");
    } else {
      releaseAmber();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && brief && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.24)",
              zIndex: 50,
            }}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "480px",
              background: "var(--bg-card)",
              borderLeft: "1px solid var(--border)",
              overflowY: "auto",
              zIndex: 51,
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>
                  {brief.firmName}
                </div>
                <div style={{ display: "flex", gap: "8px", marginTop: "8px", alignItems: "center" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "12px",
                      fontVariantNumeric: "tabular-nums",
                      color: getFitScoreColor(brief.fitScore),
                      fontWeight: 500,
                    }}
                  >
                    {brief.fitScore}
                  </span>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                      background: "var(--bg-subtle)",
                      border: "1px solid var(--border-subtle)",
                      color: "var(--text-secondary)",
                      padding: "2px 8px",
                      borderRadius: "9999px",
                    }}
                  >
                    {brief.firmType}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X
                  size={16}
                  strokeWidth={1.5}
                  style={{ color: "var(--text-tertiary)", transition: "color 120ms ease" }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as SVGElement).style.color = "var(--text-secondary)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as SVGElement).style.color = "var(--text-tertiary)";
                  }}
                />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "24px" }}>
              {/* Who they are */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-tertiary)",
                    marginBottom: "8px",
                  }}
                >
                  WHO THEY ARE
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {brief.briefWho || "Brief not available."}
                </p>
              </div>

              {/* Why Keyridge fits */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-tertiary)",
                    marginBottom: "8px",
                  }}
                >
                  WHY KEYRIDGE FITS
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {brief.briefWhy || "Brief not available."}
                </p>
              </div>

              {/* Opening line - amber treatment */}
              <div
                style={{
                  background: "var(--accent-subtle)",
                  border: "1px solid rgba(245, 158, 11, 0.20)",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--accent)",
                    marginBottom: "8px",
                  }}
                >
                  OPENING LINE
                </div>
                <p
                  style={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {brief.briefOpener || "Opening line not available."}
                </p>
              </div>
            </div>
          </motion.div>

          <style>{`
            @media (max-width: 639px) {
              div[style*="width: 480px"] {
                width: 100vw !important;
              }
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
