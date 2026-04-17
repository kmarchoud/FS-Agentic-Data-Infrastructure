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
      `This week's distribution talking point \u2014 ${dateStr}`
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
          This Week&apos;s Talking Point
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-tertiary)",
            marginTop: "4px",
            marginBottom: 0,
          }}
        >
          Ready to share with your team
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
            borderRadius: "8px",
            padding: "24px",
            marginTop: "16px",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              fontWeight: 400,
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: "800px",
              margin: 0,
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
            Generated {dateStr} {timeStr} \u00B7 Based on {newsCount} news signals
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
              {copied ? "Copied \u2713" : "Copy"}
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
          Synthesis unavailable \u00B7 Refresh to retry
        </div>
      )}
    </div>
  );
}
