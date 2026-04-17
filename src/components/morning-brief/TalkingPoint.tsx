"use client";

import { useState } from "react";
import { SkeletonCard } from "./SkeletonCard";

interface TalkingPointProps {
  talkingPoint: string | null;
  newsCount: number;
  loading: boolean;
}

export function TalkingPoint({ talkingPoint, newsCount, loading }: TalkingPointProps) {
  const [copied, setCopied] = useState(false);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = async () => {
    if (!talkingPoint) return;
    try {
      await navigator.clipboard.writeText(talkingPoint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API might fail in some contexts
    }
  };

  const handleEmail = () => {
    if (!talkingPoint) return;
    const subject = encodeURIComponent(
      `Today's distribution talking point \u2014 ${dateStr}`
    );
    const body = encodeURIComponent(talkingPoint);
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

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
          Today&apos;s Talking Point
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-tertiary)",
            marginTop: "4px",
            marginBottom: 0,
          }}
        >
          Updated daily &middot; Ready to share
        </p>
      </div>

      {/* Card */}
      {loading ? (
        <div style={{ marginTop: "16px" }}>
          <SkeletonCard
            lines={[
              { width: "100%", height: "16px" },
              { width: "95%", height: "16px" },
              { width: "80%", height: "16px" },
              { width: "70%", height: "16px" },
            ]}
          />
        </div>
      ) : talkingPoint ? (
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--accent)",
            borderRadius: "8px",
            padding: "24px",
            marginTop: "16px",
            position: "relative",
          }}
        >
          {/* Decorative quotation mark */}
          <span
            style={{
              position: "absolute",
              top: "16px",
              left: "20px",
              fontSize: "48px",
              fontFamily: "Georgia, serif",
              color: "var(--accent)",
              opacity: 0.2,
              lineHeight: 1,
              pointerEvents: "none",
              userSelect: "none",
            }}
            aria-hidden="true"
          >
            {"\u201C"}
          </span>

          <p
            style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: "800px",
              margin: 0,
              paddingLeft: "16px",
            }}
          >
            {talkingPoint}
          </p>

          {/* Divider */}
          <div
            style={{
              borderBottom: "1px solid var(--border-subtle)",
              margin: "20px 0 12px",
            }}
          />

          {/* Metadata */}
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-tertiary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            Updated {dateStr} {timeStr} &middot; Based on {newsCount} news signals
            and IA sector flow data
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
            <button
              onClick={handleCopy}
              style={{
                background: "var(--accent)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background 120ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--accent-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--accent)";
              }}
            >
              {copied ? "Copied to clipboard \u2713" : "Copy talking point"}
            </button>
            <button
              onClick={handleEmail}
              style={{
                background: "var(--bg-card)",
                color: "var(--text-secondary)",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "1px solid var(--border)",
                fontSize: "13px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "all 120ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-strong)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              Share via email
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "32px",
            fontSize: "13px",
            color: "var(--text-tertiary)",
            marginTop: "16px",
          }}
        >
          Synthesis unavailable &middot; Refresh to retry
        </div>
      )}
    </div>
  );
}
