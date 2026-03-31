"use client";

import Link from "next/link";
import { type Client, type ClientType } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";

// ─── Animation keyframes ──────────────────────────────────────────────────────
// MASTER.md §8.4 — fadeSlideIn stagger

const FADE_SLIDE_STYLE = `
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface ClientCardProps {
  client: Client;
  animationDelay?: number;
}

// ─── Badge variant map ────────────────────────────────────────────────────────

const TYPE_TO_BADGE: Record<ClientType, "pension-fund" | "endowment" | "insurance" | "wealth-manager" | "platform" | "family-office"> = {
  "Pension Fund":   "pension-fund",
  "Endowment":      "endowment",
  "Insurance":      "insurance",
  "Wealth Manager": "wealth-manager",
  "Platform":       "platform",
  "Family Office":  "family-office",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
}

function daysUntil(dateStr: string): number {
  return Math.floor((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
}

/** Days-since-contact colour per MASTER.md §6e */
function contactColour(days: number): string {
  if (days > 45)  return "var(--danger-text)";
  if (days >= 20) return "var(--warning-text)";
  return "var(--text-tertiary)";
}

/** Risk bar / score colour per MASTER.md §6j */
function riskColour(score: number): string {
  if (score > 65)  return "var(--danger)";
  if (score >= 40) return "var(--warning)";
  return "var(--success)";
}

function formatRenewal(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
}

// ─── Inline Risk Bar ──────────────────────────────────────────────────────────
// MASTER.md §6j: 3px track, flex-1, fill animates on mount with 600ms delay 200ms

function RiskBar({ score }: { score: number }) {
  const colour = riskColour(score);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
      {/* RISK label */}
      <span
        style={{
          fontSize: "11px",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          lineHeight: 1,
          color: "var(--text-tertiary)",
          flexShrink: 0,
        }}
      >
        RISK
      </span>

      {/* Track */}
      <div
        style={{
          flex: 1,
          height: "3px",
          borderRadius: "9999px",
          background: "var(--bg-raised)",
          overflow: "hidden",
        }}
      >
        {/* Fill */}
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            borderRadius: "9999px",
            backgroundColor: colour,
            transition: "width 600ms cubic-bezier(0.4,0,0.2,1) 200ms",
          }}
        />
      </div>

      {/* Score — data-sm: Geist Mono 12px, coloured */}
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          fontWeight: 400,
          lineHeight: 1.3,
          letterSpacing: "0.01em",
          fontVariantNumeric: "tabular-nums",
          color: colour,
          flexShrink: 0,
        }}
      >
        {score}
      </span>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ClientCard({ client, animationDelay = 0 }: ClientCardProps) {
  const daysSinceContact = daysSince(client.lastContactDate);
  const renewalDays      = client.mandateRenewalDate ? daysUntil(client.mandateRenewalDate) : null;

  // MASTER.md §6e urgent variant: riskScore > 75 AND mandateRenewal < 60 days
  const isUrgent =
    client.riskScore > 75 &&
    renewalDays !== null &&
    renewalDays < 60;

  const badgeVariant = TYPE_TO_BADGE[client.type];

  return (
    <>
      <style>{FADE_SLIDE_STYLE}</style>

      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          // urgent: border-left 3px solid danger, padding-left compensated to 17px
          borderLeft: isUrgent ? "3px solid var(--danger)" : "1px solid var(--border)",
          borderRadius: "8px",
          padding: isUrgent ? "20px 20px 20px 17px" : "20px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          cursor: "default",
          transition: "border-color 150ms ease",
          animation: "fadeSlideIn 0.2s ease-out both",
          animationDelay: `${animationDelay}ms`,
        }}
        onMouseEnter={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--border-strong)";
          if (isUrgent) el.style.borderLeftColor = "var(--danger)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget as HTMLDivElement;
          el.style.borderColor = "var(--border)";
          if (isUrgent) el.style.borderLeftColor = "var(--danger)";
        }}
      >
        {/* ── Row 1: Header ─────────────────────────────────────────────────── */}
        {/* Left: name + badge  |  Right: days since contact + renewal */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <span
              style={{
                fontSize: "14px",
                fontWeight: 600,
                lineHeight: 1.4,
                color: "var(--text-primary)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {client.name}
            </span>
            <Badge variant={badgeVariant}>{client.type}</Badge>
          </div>

          {/* Right */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            {/* Days since contact — data-sm Geist Mono, threshold colour */}
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "12px",
                fontWeight: 400,
                lineHeight: 1.3,
                letterSpacing: "0.01em",
                fontVariantNumeric: "tabular-nums",
                color: contactColour(daysSinceContact),
              }}
            >
              {daysSinceContact}d ago
            </div>
            {/* Mandate renewal if ≤90 days */}
            {renewalDays !== null && renewalDays <= 90 && renewalDays > 0 && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontWeight: 400,
                  lineHeight: 1.3,
                  letterSpacing: "0.01em",
                  color: "var(--text-tertiary)",
                  marginTop: "2px",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                Renewal: {formatRenewal(client.mandateRenewalDate!)}
              </div>
            )}
          </div>
        </div>

        {/* ── Row 2: Metrics ────────────────────────────────────────────────── */}
        {/* AUM · delta · RM */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* AUM — data-lg: Geist Mono 14px font-medium text-primary */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "14px",
              fontWeight: 500,
              lineHeight: 1.4,
              color: "var(--text-primary)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            £{client.aum.toLocaleString("en-GB")}m
          </span>

          {/* Separator */}
          <span style={{ color: "var(--text-tertiary)", fontSize: "13px" }}>·</span>

          {/* RM avatar + name — body-sm text-tertiary */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            {/* 20px circle avatar */}
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "9999px",
                background: "var(--bg-raised)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "9px",
                  fontWeight: 500,
                  lineHeight: 1,
                  color: "var(--text-secondary)",
                  letterSpacing: "0.01em",
                }}
              >
                {client.assignedRM
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
            <span
              style={{
                fontSize: "13px",
                fontWeight: 400,
                lineHeight: 1.5,
                color: "var(--text-tertiary)",
              }}
            >
              {client.assignedRM}
            </span>
          </div>
        </div>

        {/* ── Row 3: Insight ────────────────────────────────────────────────── */}
        {/* body-sm, text-secondary, 2-line clamp */}
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: 1.5,
            color: "var(--text-secondary)",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          } as React.CSSProperties}
        >
          {client.notes}
        </p>

        {/* ── Row 4: Risk bar + action ──────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <RiskBar score={client.riskScore} />

          {/* "Prepare Brief" ghost button — §6e + §6h ghost spec */}
          <Link
            href={`/clients?id=${client.id}&tab=brief`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              background: "var(--bg-raised)",
              color: "var(--text-secondary)",
              fontSize: "13px",
              fontWeight: 400,
              lineHeight: 1,
              padding: "4px 12px",
              borderRadius: "6px",
              border: "1px solid var(--border)",
              cursor: "pointer",
              transition: "all 120ms ease",
              flexShrink: 0,
              whiteSpace: "nowrap",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "var(--bg-subtle)";
              el.style.color = "var(--text-primary)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.background = "var(--bg-raised)";
              el.style.color = "var(--text-secondary)";
            }}
          >
            Prepare Brief
            {/* ChevronRight 12px inline */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </>
  );
}
