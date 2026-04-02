"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OutreachDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  context: string;
  mandateName: string;
  draftText: string;
}

export function OutreachDraftModal({
  isOpen,
  onClose,
  context,
  mandateName,
  draftText,
}: OutreachDraftModalProps) {
  const [text, setText] = useState(draftText);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API not available
    }
  };

  const handleEmailClient = () => {
    const subject = encodeURIComponent(`Re: ${mandateName}`);
    const body = encodeURIComponent(text);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={onClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0, 0, 0, 0.3)",
              zIndex: 49,
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "600px",
              maxHeight: "85vh",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.10)",
              zIndex: 50,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
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
                flexShrink: 0,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                  }}
                >
                  Outreach Draft
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontFamily: "var(--font-mono)",
                    color: "var(--text-tertiary)",
                    marginTop: "4px",
                    letterSpacing: "0.01em",
                  }}
                >
                  {context} · Mandate: {mandateName}
                </div>
              </div>
              <button
                onClick={onClose}
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  flexShrink: 0,
                }}
              >
                <X
                  size={18}
                  strokeWidth={1.5}
                  style={{ color: "var(--text-tertiary)" }}
                />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: "20px", flex: 1, overflowY: "auto" }}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "200px",
                  background: "var(--bg-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "6px",
                  padding: "16px",
                  fontSize: "13px",
                  fontFamily: "var(--font-sans)",
                  color: "var(--text-primary)",
                  lineHeight: 1.7,
                  resize: "vertical",
                  outline: "none",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                }}
              />
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "20px",
                borderTop: "1px solid var(--border)",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                {/* Copy to clipboard */}
                <button
                  onClick={handleCopy}
                  style={{
                    background: "transparent",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "var(--bg-raised)";
                    el.style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "transparent";
                    el.style.color = "var(--text-secondary)";
                  }}
                >
                  Copy to clipboard
                </button>

                {/* Open in email client */}
                <button
                  onClick={handleEmailClient}
                  style={{
                    background: "transparent",
                    color: "var(--text-secondary)",
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "var(--bg-raised)";
                    el.style.color = "var(--text-primary)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "transparent";
                    el.style.color = "var(--text-secondary)";
                  }}
                >
                  Open in email client
                </button>

                {/* Personalise with AI Research */}
                <button
                  style={{
                    background: "transparent",
                    color: "var(--accent)",
                    fontSize: "13px",
                    fontWeight: 500,
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    transition: "all 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "var(--bg-raised)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.background = "transparent";
                  }}
                >
                  Personalise with AI Research
                </button>
              </div>

              {/* Disclaimer */}
              <p
                style={{
                  fontSize: "11px",
                  fontFamily: "var(--font-mono)",
                  color: "var(--text-tertiary)",
                  marginTop: "12px",
                  textAlign: "center",
                  letterSpacing: "0.01em",
                  lineHeight: 1.3,
                  margin: "12px 0 0 0",
                }}
              >
                Review and personalise before sending. This draft is generated
                from public data.
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default OutreachDraftModal;
