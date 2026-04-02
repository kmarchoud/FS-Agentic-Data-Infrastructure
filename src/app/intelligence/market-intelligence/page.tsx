"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TopBar from "@/components/dashboard/topbar";
import {
  ShieldCheck,
  Database,
  CircleDot,
  Clock,
  Lock,
  X,
  Copy,
  Mail,
  Sparkles,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type LayerTab = 1 | 2 | 3;

interface MarketEvent {
  id: string;
  time: string;
  source: string;
  headline: string;
  mandateCount: number;
}

interface MandateCard {
  name: string;
  why: string;
  badge: "DEFENSIVE" | "OFFENSIVE" | "NEUTRAL";
}

interface IFARow {
  firm: string;
  reason: string;
  mandate: string;
}

// ─── Data ────────────────────────────────────────────────────────────────────

const EVENTS: MarketEvent[] = [
  {
    id: "boe",
    time: "08:15",
    source: "BoE",
    headline: "Bank of England holds base rate at 4.5%",
    mandateCount: 3,
  },
  {
    id: "ons",
    time: "09:30",
    source: "ONS",
    headline: "UK CPI prints 2.8% — below consensus",
    mandateCount: 2,
  },
  {
    id: "reuters",
    time: "10:05",
    source: "Reuters",
    headline: "LGPS consolidation pool expansion announced",
    mandateCount: 4,
  },
  {
    id: "ft",
    time: "10:45",
    source: "FT",
    headline: "Global equity markets rally on Fed dovish signals",
    mandateCount: 2,
  },
  {
    id: "citywire",
    time: "11:20",
    source: "Citywire",
    headline: "Multi-asset sector sees £2.1bn outflows in March",
    mandateCount: 3,
  },
];

const MANDATE_DATA: Record<string, { context: string; mandates: MandateCard[]; ifas: IFARow[] }> = {
  boe: {
    context:
      "The Bank of England's Monetary Policy Committee voted to hold the base rate at 4.5%, in line with market expectations following three consecutive months of declining inflation. The decision signals a cautious but stable rate environment, providing clarity for fixed income positioning and duration-sensitive mandates.",
    mandates: [
      {
        name: "Strategic Bond",
        why: "Rate hold supports duration positioning. Strategic Bond is well-positioned for stability-seeking IFAs.",
        badge: "DEFENSIVE",
      },
      {
        name: "Diversified Income",
        why: "Yield expectations stabilise. Income mandates benefit from predictable rate environment.",
        badge: "DEFENSIVE",
      },
      {
        name: "Global Systematic",
        why: "Factor models adjust for rate sensitivity. Systematic approach captures macro regime signal.",
        badge: "NEUTRAL",
      },
    ],
    ifas: [
      {
        firm: "Paradigm Capital",
        reason: "Risk-averse client base benefits from rate hold stability; Strategic Bond narrative aligns directly.",
        mandate: "Strategic Bond",
      },
      {
        firm: "Foster Denovo",
        reason: "Last discussed fixed income 8 weeks ago; this event gives natural re-engagement hook.",
        mandate: "Strategic Bond",
      },
      {
        firm: "Attivo Group",
        reason: "Investment philosophy updated to emphasise duration sensitivity last month.",
        mandate: "Global Systematic",
      },
    ],
  },
  ons: {
    context:
      "The Office for National Statistics reported UK CPI at 2.8% for March, coming in below the consensus forecast of 3.1%. The below-consensus print reduces pressure on the MPC to hold rates higher for longer and opens the door to potential cuts in H2 2026.",
    mandates: [
      {
        name: "Strategic Bond",
        why: "Softer inflation supports a bullish case for gilts and investment-grade credit duration.",
        badge: "OFFENSIVE",
      },
      {
        name: "Diversified Income",
        why: "Lower-than-expected inflation preserves real yield, strengthening the income mandate narrative.",
        badge: "DEFENSIVE",
      },
    ],
    ifas: [
      {
        firm: "Progeny Wealth",
        reason: "New Head of Investments from Jupiter AM; inflation data gives timely fixed income conversation.",
        mandate: "Strategic Bond",
      },
      {
        firm: "Informed Financial Planning",
        reason: "Oxford-based with inflation-sensitive retiree client base; CPI print directly relevant.",
        mandate: "Diversified Income",
      },
      {
        firm: "Foster Denovo",
        reason: "Scaling rapidly — needs broadened fixed income exposure; below-consensus CPI is a hook.",
        mandate: "Strategic Bond",
      },
    ],
  },
  reuters: {
    context:
      "Reuters reports that the government has confirmed expansion of the LGPS consolidation pool structure, bringing additional pension assets under centralised management. The move is expected to accelerate institutional mandate reviews across participating funds.",
    mandates: [
      {
        name: "UK Balanced",
        why: "LGPS pools reviewing multi-asset mandates; UK Balanced is a natural fit for liability-driven pools.",
        badge: "OFFENSIVE",
      },
      {
        name: "Global Systematic",
        why: "Systematic strategies aligned with LGPS pools' shift toward factor-based governance frameworks.",
        badge: "OFFENSIVE",
      },
      {
        name: "Diversified Income",
        why: "Consolidation pools seeking income mandates to match defined-benefit liability profiles.",
        badge: "DEFENSIVE",
      },
      {
        name: "Strategic Bond",
        why: "Rate-stable fixed income appeals to newly consolidated pension structures.",
        badge: "DEFENSIVE",
      },
    ],
    ifas: [
      {
        firm: "Hymans Robertson",
        reason: "Key LGPS advisory relationship; consolidation announcement triggers mandate strategy review.",
        mandate: "UK Balanced",
      },
      {
        firm: "Mercer",
        reason: "Advised on pool transition for three participating funds — direct access to decision makers.",
        mandate: "Global Systematic",
      },
      {
        firm: "Aon",
        reason: "LGPS clients under active review post-consolidation; income mandate positioning is timely.",
        mandate: "Diversified Income",
      },
    ],
  },
  ft: {
    context:
      "Global equity markets extended their recovery on Thursday as Federal Reserve officials signalled a more dovish stance than anticipated, with two board members indicating support for a rate cut before year-end. Risk appetite improved across developed markets.",
    mandates: [
      {
        name: "Global Systematic",
        why: "Momentum and trend factors capture the equity rally signal; systematic exposure is well-timed.",
        badge: "OFFENSIVE",
      },
      {
        name: "UK Balanced",
        why: "Equity recovery improves balanced fund performance narrative for mid-risk IFA conversations.",
        badge: "OFFENSIVE",
      },
    ],
    ifas: [
      {
        firm: "Cazenove Capital",
        reason: "Global equity tilt in client portfolios; Fed dovish signal gives compelling re-engagement moment.",
        mandate: "Global Systematic",
      },
      {
        firm: "Rathbones",
        reason: "Balanced mandate conversations ongoing; equity recovery strengthens risk-on positioning.",
        mandate: "UK Balanced",
      },
      {
        firm: "Brewin Dolphin",
        reason: "Systematic equity exposure under-allocated in current book; rally provides entry timing.",
        mandate: "Global Systematic",
      },
    ],
  },
  citywire: {
    context:
      "Citywire reports £2.1bn in net outflows from the IA Mixed Investment sector during March, marking the third consecutive month of negative retail flows. Advisers are rotating client assets toward lower-volatility and income-generating mandates.",
    mandates: [
      {
        name: "Diversified Income",
        why: "Multi-asset outflows signal adviser rotation toward income; Diversified Income directly captures this shift.",
        badge: "OFFENSIVE",
      },
      {
        name: "Strategic Bond",
        why: "IFAs exiting mixed investment are seeking fixed income stability; Strategic Bond is the natural destination.",
        badge: "OFFENSIVE",
      },
      {
        name: "Absolute Return",
        why: "Low-volatility outflow destination for risk-averse advisers reducing multi-asset exposure.",
        badge: "DEFENSIVE",
      },
    ],
    ifas: [
      {
        firm: "St. James's Place",
        reason: "Large mixed investment book with active redemption signals; income narrative is directly applicable.",
        mandate: "Diversified Income",
      },
      {
        firm: "Quilter Cheviot",
        reason: "Adviser panel reviewing fixed income rotation strategy following outflow pressure.",
        mandate: "Strategic Bond",
      },
      {
        firm: "Paradigm Capital",
        reason: "Three client portfolios flagged for multi-asset review this quarter; absolute return option relevant.",
        mandate: "Absolute Return",
      },
    ],
  },
};

const SOURCE_COLOURS: Record<string, { bg: string; text: string; border: string }> = {
  BoE: {
    bg: "var(--neutral-subtle)",
    text: "var(--neutral-text)",
    border: "rgba(107,114,128,0.20)",
  },
  ONS: {
    bg: "var(--neutral-subtle)",
    text: "var(--neutral-text)",
    border: "rgba(107,114,128,0.20)",
  },
  Reuters: {
    bg: "rgba(234,88,12,0.08)",
    text: "#C2410C",
    border: "rgba(234,88,12,0.20)",
  },
  FT: {
    bg: "rgba(236,72,153,0.08)",
    text: "#DB2777",
    border: "rgba(236,72,153,0.20)",
  },
  Citywire: {
    bg: "var(--neutral-subtle)",
    text: "var(--neutral-text)",
    border: "rgba(107,114,128,0.20)",
  },
};

const BADGE_COLOURS: Record<string, { bg: string; text: string; border: string }> = {
  DEFENSIVE: {
    bg: "var(--neutral-subtle)",
    text: "var(--neutral-text)",
    border: "rgba(107,114,128,0.20)",
  },
  OFFENSIVE: {
    bg: "var(--success-subtle)",
    text: "var(--success-text)",
    border: "rgba(34,197,94,0.20)",
  },
  NEUTRAL: {
    bg: "var(--neutral-subtle)",
    text: "var(--neutral-text)",
    border: "rgba(107,114,128,0.20)",
  },
};

const DATA_FRESHNESS = [
  { source: "Bloomberg", ago: "1m ago" },
  { source: "Reuters", ago: "3m ago" },
  { source: "FT", ago: "15m ago" },
  { source: "ONS", ago: "2h ago" },
  { source: "BoE", ago: "4h ago" },
];

// ─── Draft content per IFA ───────────────────────────────────────────────────

function getDraftText(firm: string, mandate: string, eventHeadline: string): string {
  return `Subject: ${eventHeadline} — ${mandate} Positioning Note

Dear [Adviser Name],

I wanted to reach out following today's announcement: "${eventHeadline}". Given your clients' current positioning and the conversations we've had around ${mandate}, I believe this development presents a relevant opportunity worth discussing.

Our ${mandate} mandate has been specifically structured to navigate exactly this type of macro environment. The current rate and inflation backdrop directly reinforces the strategy's core thesis — [specific positioning detail relevant to the event] — and we're seeing early confirmation in recent performance attribution. I'd welcome the chance to walk you through our current thinking and how it aligns with your client book.

Would you be available for a 20-minute call this week or early next? I'm happy to share our updated positioning note ahead of that conversation. As always, this is based entirely on public market data — no proprietary or internal information required on your end.

Kind regards,
[Your Name]
Keyridge Asset Management
[Phone] | [Email]`;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SourceBadge({ source }: { source: string }) {
  const colours = SOURCE_COLOURS[source] ?? SOURCE_COLOURS["BoE"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "1px 6px",
        borderRadius: "9999px",
        background: colours.bg,
        border: `1px solid ${colours.border}`,
        color: colours.text,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {source}
    </span>
  );
}

function BadgePill({ label }: { label: string }) {
  const colours = BADGE_COLOURS[label] ?? BADGE_COLOURS["NEUTRAL"];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: "9999px",
        background: colours.bg,
        border: `1px solid ${colours.border}`,
        color: colours.text,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

function MandateBadge({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        borderRadius: "9999px",
        background: "var(--neutral-subtle)",
        border: "1px solid rgba(107,114,128,0.20)",
        color: "var(--neutral-text)",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function GhostButton({
  children,
  onClick,
  accentText,
  small,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  accentText?: boolean;
  small?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: accentText ? "var(--accent)" : "var(--text-secondary)",
        fontSize: small ? "12px" : "13px",
        fontWeight: 500,
        padding: small ? "4px 10px" : "6px 12px",
        borderRadius: "6px",
        border: "none",
        cursor: "pointer",
        transition: "background 120ms ease, color 120ms ease",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: "var(--font-sans)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-raised)";
        if (!accentText) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        if (!accentText) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
      }}
    >
      {children}
    </button>
  );
}

function CountBadge({ count }: { count: number }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "20px",
        height: "20px",
        padding: "0 6px",
        borderRadius: "9999px",
        background: "var(--bg-raised)",
        border: "1px solid var(--border)",
        color: "var(--text-secondary)",
        fontSize: "11px",
        fontFamily: "var(--font-mono)",
        fontWeight: 500,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {count}
    </span>
  );
}

// ─── Outreach Draft Modal ────────────────────────────────────────────────────

function OutreachModal({
  firm,
  mandate,
  eventHeadline,
  onClose,
}: {
  firm: string;
  mandate: string;
  eventHeadline: string;
  onClose: () => void;
}) {
  const [draftText, setDraftText] = useState(getDraftText(firm, mandate, eventHeadline));
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(draftText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleEmailClient = () => {
    const subject = encodeURIComponent(`${eventHeadline} — ${mandate} Positioning Note`);
    const body = encodeURIComponent(draftText);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.3)",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
          style={{
            width: "600px",
            maxWidth: "100%",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.10)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: "12px",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.006em",
                  fontFamily: "var(--font-sans)",
                }}
              >
                Outreach Draft
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                  marginTop: "4px",
                  letterSpacing: "0.01em",
                }}
              >
                For: {firm} · Re: BoE Rate Decision · Mandate: {mandate}
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px",
                color: "var(--text-tertiary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "color 120ms ease",
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)")}
            >
              <X size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Body */}
          <div style={{ padding: "20px" }}>
            <textarea
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              style={{
                width: "100%",
                minHeight: "220px",
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
                boxSizing: "border-box",
                transition: "border-color 120ms ease",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--border-strong)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "16px 20px 20px",
              borderTop: "1px solid var(--border)",
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <GhostButton onClick={handleCopy}>
              <Copy size={14} strokeWidth={1.5} />
              {copied ? "Copied!" : "Copy to clipboard"}
            </GhostButton>
            <GhostButton onClick={handleEmailClient}>
              <Mail size={14} strokeWidth={1.5} />
              Open in email client
            </GhostButton>
            <GhostButton accentText>
              <Sparkles size={14} strokeWidth={1.5} />
              Personalise with AI Research
            </GhostButton>
            <div
              style={{
                width: "100%",
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-tertiary)",
                marginTop: "8px",
                textAlign: "center",
                letterSpacing: "0.01em",
              }}
            >
              Review and personalise before sending. This draft is generated from public data.
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Layer 1 ─────────────────────────────────────────────────────────────────

function Layer1({
  selectedEventId,
  onSelectEvent,
}: {
  selectedEventId: string;
  onSelectEvent: (id: string) => void;
}) {
  const [modalState, setModalState] = useState<{
    firm: string;
    mandate: string;
    eventHeadline: string;
  } | null>(null);

  const selectedEvent = EVENTS.find((e) => e.id === selectedEventId)!;
  const intelligence = MANDATE_DATA[selectedEventId];

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: 0,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* ── LEFT: Event Feed ── */}
        <div
          style={{
            borderRight: "1px solid var(--border)",
            overflowY: "auto",
            height: "calc(100vh - 240px)",
          }}
        >
          {/* Feed header */}
          <div
            style={{
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: "1px solid var(--border-subtle)",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-tertiary)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Market Events
            </span>
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--success)",
                display: "inline-block",
                animation: "pulse-dot 2.2s ease-in-out infinite",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--success-text)",
                letterSpacing: "0.01em",
              }}
            >
              Live
            </span>
          </div>

          {/* Events */}
          {EVENTS.map((event) => {
            const isSelected = event.id === selectedEventId;
            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event.id)}
                style={{
                  padding: isSelected ? "16px 16px 16px 14px" : "16px",
                  borderBottom: "1px solid var(--border-subtle)",
                  borderLeft: isSelected
                    ? "2px solid var(--accent)"
                    : "2px solid transparent",
                  background: isSelected ? "var(--bg-raised)" : "transparent",
                  cursor: "pointer",
                  transition: "background 120ms ease, border-color 120ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    (e.currentTarget as HTMLDivElement).style.background = "transparent";
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--text-tertiary)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {event.time}
                  </span>
                  <SourceBadge source={event.source} />
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-primary)",
                    lineHeight: 1.5,
                    fontFamily: "var(--font-sans)",
                    marginTop: "4px",
                  }}
                >
                  {event.headline}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--accent)",
                    marginTop: "6px",
                    letterSpacing: "0.01em",
                  }}
                >
                  Relevant to {event.mandateCount} mandates
                </div>
              </div>
            );
          })}
        </div>

        {/* ── RIGHT: Mapped Intelligence ── */}
        <div
          style={{
            padding: "24px",
            overflowY: "auto",
            height: "calc(100vh - 240px)",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedEventId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Event summary card */}
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    letterSpacing: "-0.006em",
                    fontFamily: "var(--font-sans)",
                    lineHeight: 1.4,
                  }}
                >
                  {selectedEvent.headline}
                </div>
                <div
                  style={{
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    marginTop: "8px",
                    lineHeight: 1.6,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {intelligence.context}
                </div>
              </div>

              {/* Mandates Affected */}
              <div style={{ marginTop: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--text-tertiary)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    Mandates Affected
                  </span>
                  <CountBadge count={intelligence.mandates.length} />
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: "12px",
                  }}
                >
                  {intelligence.mandates.map((mandate, i) => (
                    <motion.div
                      key={mandate.name}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: i * 0.05,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        padding: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--text-primary)",
                            fontFamily: "var(--font-sans)",
                          }}
                        >
                          {mandate.name}
                        </span>
                        <BadgePill label={mandate.badge} />
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          marginTop: "6px",
                          lineHeight: 1.5,
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {mandate.why}
                      </div>
                      <div style={{ marginTop: "12px" }}>
                        <GhostButton
                          small
                          onClick={() =>
                            setModalState({
                              firm: intelligence.ifas[0]?.firm ?? "IFA",
                              mandate: mandate.name,
                              eventHeadline: selectedEvent.headline,
                            })
                          }
                        >
                          Generate Outreach Brief
                        </GhostButton>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* IFAs to Contact Today */}
              <div style={{ marginTop: "24px" }}>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-sans)",
                    marginBottom: "12px",
                  }}
                >
                  IFAs to Contact Today
                </div>

                {/* Table */}
                <div
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "160px 1fr 140px 80px",
                      padding: "8px 12px",
                      borderBottom: "1px solid var(--border-strong)",
                      background: "var(--bg-page)",
                    }}
                  >
                    {["Firm", "Reason", "Mandate", "Action"].map((col) => (
                      <div
                        key={col}
                        style={{
                          fontSize: "11px",
                          fontWeight: 500,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          color: "var(--text-tertiary)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {col}
                      </div>
                    ))}
                  </div>

                  {/* Rows */}
                  {intelligence.ifas.map((ifa, i) => (
                    <div
                      key={ifa.firm}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "160px 1fr 140px 80px",
                        padding: "10px 12px",
                        borderBottom:
                          i < intelligence.ifas.length - 1
                            ? "1px solid var(--border-subtle)"
                            : "none",
                        alignItems: "center",
                        transition: "background 100ms ease",
                      }}
                      onMouseEnter={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)")
                      }
                      onMouseLeave={(e) =>
                        ((e.currentTarget as HTMLDivElement).style.background = "transparent")
                      }
                    >
                      <div
                        style={{
                          fontSize: "13px",
                          fontWeight: 500,
                          color: "var(--text-primary)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {ifa.firm}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          fontFamily: "var(--font-sans)",
                          lineHeight: 1.4,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          paddingRight: "12px",
                        }}
                      >
                        {ifa.reason}
                      </div>
                      <div>
                        <MandateBadge label={ifa.mandate} />
                      </div>
                      <div>
                        <GhostButton
                          small
                          onClick={() =>
                            setModalState({
                              firm: ifa.firm,
                              mandate: ifa.mandate,
                              eventHeadline: selectedEvent.headline,
                            })
                          }
                        >
                          Draft
                        </GhostButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Outreach Draft Modal */}
      <AnimatePresence>
        {modalState && (
          <OutreachModal
            firm={modalState.firm}
            mandate={modalState.mandate}
            eventHeadline={modalState.eventHeadline}
            onClose={() => setModalState(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// ─── Layer 2 ─────────────────────────────────────────────────────────────────

function Layer2() {
  return (
    <div style={{ position: "relative", minHeight: "320px" }}>
      {/* Ghost preview content */}
      <div style={{ opacity: 0.25, pointerEvents: "none", userSelect: "none" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {["Mandate Priority Score", "IFA Fit Index", "Outreach Velocity"].map((label) => (
            <div
              key={label}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                padding: "16px",
                height: "80px",
              }}
            >
              <div style={{ fontSize: "11px", color: "var(--text-tertiary)", marginBottom: "8px" }}>
                {label}
              </div>
              <div
                style={{
                  height: "24px",
                  background: "var(--bg-raised)",
                  borderRadius: "4px",
                  width: "60%",
                }}
              />
            </div>
          ))}
        </div>
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            height: "200px",
            padding: "16px",
          }}
        >
          <div style={{ height: "12px", background: "var(--bg-raised)", borderRadius: "4px", width: "30%", marginBottom: "12px" }} />
          <div style={{ height: "8px", background: "var(--bg-raised)", borderRadius: "4px", width: "80%", marginBottom: "8px" }} />
          <div style={{ height: "8px", background: "var(--bg-raised)", borderRadius: "4px", width: "65%", marginBottom: "8px" }} />
          <div style={{ height: "8px", background: "var(--bg-raised)", borderRadius: "4px", width: "72%" }} />
        </div>
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(248,248,246,0.75)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "320px",
            textAlign: "center",
          }}
        >
          <Clock size={24} strokeWidth={1.5} style={{ color: "var(--text-tertiary)", margin: "0 auto 12px" }} />
          <div
            style={{
              fontSize: "14px",
              fontWeight: 600,
              color: "var(--text-primary)",
              fontFamily: "var(--font-sans)",
            }}
          >
            In development
          </div>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-tertiary)",
              marginTop: "4px",
              letterSpacing: "0.01em",
            }}
          >
            Available Q2 2026
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Layer 3 ─────────────────────────────────────────────────────────────────

function Layer3() {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--accent)",
        borderRadius: "8px",
        padding: "20px",
        maxWidth: "540px",
      }}
    >
      <Lock size={20} strokeWidth={1.5} style={{ color: "var(--accent)", marginBottom: "12px" }} />
      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--text-primary)",
          fontFamily: "var(--font-sans)",
        }}
      >
        Requires licensing
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-sans)",
          marginTop: "8px",
          lineHeight: 1.6,
        }}
      >
        Maps macro events to specific client portfolios. This layer requires commercial data from:
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-sans)",
          marginTop: "8px",
          lineHeight: 1.8,
        }}
      >
        <div>• Salesforce / DealCloud — CRM and relationship data</div>
        <div>• Portfolio Management System — client holdings access</div>
      </div>
      <button
        style={{
          marginTop: "16px",
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--accent)",
          fontFamily: "var(--font-sans)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "underline")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.textDecoration = "none")}
      >
        Register Interest
      </button>
    </div>
  );
}

// ─── Layer Status Badge ──────────────────────────────────────────────────────

function LayerStatusBadge({ state }: { state: "LIVE" | "BUILDING" | "LICENSED" }) {
  const config = {
    LIVE: {
      bg: "var(--success-subtle)",
      border: "rgba(34,197,94,0.20)",
      text: "var(--success-text)",
      icon: <CircleDot size={12} strokeWidth={2} />,
      label: "Live",
    },
    BUILDING: {
      bg: "rgba(107,114,128,0.08)",
      border: "rgba(107,114,128,0.20)",
      text: "var(--neutral-text)",
      icon: <Clock size={12} strokeWidth={2} />,
      label: "Building",
    },
    LICENSED: {
      bg: "var(--accent-subtle)",
      border: "rgba(245,158,11,0.15)",
      text: "var(--accent)",
      icon: <Lock size={12} strokeWidth={2} />,
      label: "Licensed",
    },
  }[state];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "9999px",
        background: config.bg,
        border: `1px solid ${config.border}`,
        color: config.text,
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        fontFamily: "var(--font-sans)",
      }}
    >
      {config.icon}
      {config.label}
    </span>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function MarketIntelligencePage() {
  const [selectedEventId, setSelectedEventId] = useState<string>(EVENTS[0].id);
  const [activeLayer, setActiveLayer] = useState<LayerTab>(1);
  const [isDataSourcesOpen, setIsDataSourcesOpen] = useState(false);

  const layerTabs: { id: LayerTab; label: string; sub: string; status: "LIVE" | "BUILDING" | "LICENSED" }[] = [
    { id: 1, label: "Layer 1", sub: "Event to Mandate Mapping", status: "LIVE" },
    { id: 2, label: "Layer 2", sub: "Distribution Opportunity", status: "BUILDING" },
    { id: 3, label: "Layer 3", sub: "Client Holdings", status: "LICENSED" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <TopBar title="Market Intelligence" />

      <div style={{ maxWidth: "1440px" }}>
        {/* ── Module Header ── */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h2
              style={{
                fontSize: "20px",
                fontWeight: 600,
                color: "var(--text-primary)",
                letterSpacing: "-0.01em",
                fontFamily: "var(--font-sans)",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Dynamic Market Intelligence
            </h2>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                marginTop: "4px",
                fontFamily: "var(--font-sans)",
                maxWidth: "600px",
                lineHeight: 1.5,
              }}
            >
              Macro events mapped to mandates and IFA outreach opportunities in real time.
            </p>
            {/* Public Data Only badge */}
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                marginTop: "8px",
                padding: "2px 10px",
                borderRadius: "9999px",
                background: "var(--success-subtle)",
                border: "1px solid rgba(34,197,94,0.20)",
                color: "var(--success-text)",
                fontSize: "13px",
                fontFamily: "var(--font-sans)",
                fontWeight: 400,
              }}
            >
              <ShieldCheck size={14} strokeWidth={1.5} />
              Public data only — no internal access required
            </span>
          </div>

          {/* Data Sources button */}
          <div style={{ flexShrink: 0, paddingTop: "4px" }}>
            <GhostButton onClick={() => setIsDataSourcesOpen(true)}>
              <Database size={16} strokeWidth={1.5} />
              Data Sources
            </GhostButton>
          </div>
        </div>

        {/* ── Layer Navigation Tabs ── */}
        <div
          style={{
            display: "flex",
            gap: 0,
            borderBottom: "1px solid var(--border)",
            padding: "0 24px",
          }}
        >
          {layerTabs.map((tab) => {
            const isActive = activeLayer === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveLayer(tab.id)}
                style={{
                  padding: "10px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                  marginBottom: "-1px",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                  borderBottomWidth: "2px",
                  borderBottomStyle: "solid",
                  borderBottomColor: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "13px",
                  fontWeight: isActive ? 500 : 400,
                  transition: "color 120ms ease",
                  opacity: !isActive && tab.status !== "LIVE" ? 0.8 : 1,
                  outline: "none",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)";
                }}
              >
                <span>{tab.sub}</span>
                <span style={{ transform: "scale(0.9)", display: "inline-flex" }}>
                  <LayerStatusBadge state={tab.status} />
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Layer Content ── */}
        <div>
          <AnimatePresence mode="wait">
            {activeLayer === 1 && (
              <motion.div
                key="layer1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <Layer1
                  selectedEventId={selectedEventId}
                  onSelectEvent={setSelectedEventId}
                />
              </motion.div>
            )}
            {activeLayer === 2 && (
              <motion.div
                key="layer2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ padding: "24px" }}
              >
                {/* Layer 2 section header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "12px",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: "20px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "-0.006em",
                    }}
                  >
                    Layer 2 — Mandate to Distribution Opportunity
                  </span>
                  <LayerStatusBadge state="BUILDING" />
                </div>
                <Layer2 />
              </motion.div>
            )}
            {activeLayer === 3 && (
              <motion.div
                key="layer3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ padding: "24px" }}
              >
                {/* Layer 3 section header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "12px",
                    borderBottom: "1px solid var(--border)",
                    marginBottom: "20px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontFamily: "var(--font-sans)",
                      letterSpacing: "-0.006em",
                    }}
                  >
                    Layer 3 — Client Holdings Intelligence
                  </span>
                  <LayerStatusBadge state="LICENSED" />
                </div>
                <Layer3 />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Data Freshness Strip ── */}
        <div
          style={{
            margin: "0 24px",
            paddingTop: "12px",
            paddingBottom: "20px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: "0",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {DATA_FRESHNESS.map((item, i) => (
            <span key={item.source}>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                  letterSpacing: "0.01em",
                }}
              >
                {item.source}:{" "}
                <span style={{ color: "var(--text-tertiary)" }}>{item.ago}</span>
              </span>
              {i < DATA_FRESHNESS.length - 1 && (
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--text-tertiary)",
                    margin: "0 8px",
                  }}
                >
                  ·
                </span>
              )}
            </span>
          ))}
        </div>
      </div>

      {/* ── Data Sources Slide-Over ── */}
      <AnimatePresence>
        {isDataSourcesOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.2)",
                zIndex: 40,
                cursor: "pointer",
              }}
              onClick={() => setIsDataSourcesOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                position: "fixed",
                top: 0,
                right: 0,
                height: "100vh",
                width: "420px",
                background: "var(--bg-card)",
                borderLeft: "1px solid var(--border)",
                boxShadow: "-8px 0 24px rgba(0,0,0,0.06)",
                overflowY: "auto",
                zIndex: 50,
              }}
            >
              {/* Panel header */}
              <div
                style={{
                  padding: "20px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-sans)",
                    letterSpacing: "-0.006em",
                  }}
                >
                  Data Sources — Market Intelligence
                </span>
                <button
                  onClick={() => setIsDataSourcesOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "4px",
                    borderRadius: "4px",
                    color: "var(--text-tertiary)",
                    display: "flex",
                    alignItems: "center",
                    transition: "color 120ms ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-tertiary)")}
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              {/* Panel body */}
              <div style={{ padding: "20px" }}>
                {/* Table header */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 60px 60px 80px",
                    gap: "8px",
                    paddingBottom: "8px",
                    borderBottom: "1px solid var(--border-strong)",
                    marginBottom: "4px",
                  }}
                >
                  {["Source", "Purpose", "Layer", "Cost", "Legal"].map((col) => (
                    <div
                      key={col}
                      style={{
                        fontSize: "11px",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--text-tertiary)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {col}
                    </div>
                  ))}
                </div>

                {[
                  { source: "Bank of England", purpose: "Rate decisions & MPC statements", layer: "1", cost: "Free", legal: "green" },
                  { source: "ONS", purpose: "CPI, GDP and macro indicators", layer: "1", cost: "Free", legal: "green" },
                  { source: "Reuters", purpose: "Market news and LGPS signals", layer: "1", cost: "Free", legal: "green" },
                  { source: "Financial Times", purpose: "Equity market commentary", layer: "1", cost: "Free", legal: "amber" },
                  { source: "Citywire", purpose: "Fund flow and sector data", layer: "1", cost: "Free", legal: "amber" },
                  { source: "Bloomberg", purpose: "Real-time market data", layer: "2", cost: "Licensed", legal: "amber" },
                  { source: "Salesforce/DealCloud", purpose: "CRM relationship data", layer: "3", cost: "Licensed", legal: "amber" },
                  { source: "Portfolio Mgmt System", purpose: "Client holdings", layer: "3", cost: "Licensed", legal: "amber" },
                ].map((row) => (
                  <div
                    key={row.source}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 60px 60px 80px",
                      gap: "8px",
                      padding: "10px 0",
                      borderBottom: "1px solid var(--border-subtle)",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: "var(--text-primary)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {row.source}
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-sans)",
                        lineHeight: 1.4,
                      }}
                    >
                      {row.purpose}
                    </div>
                    <div>
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "1px 6px",
                          borderRadius: "9999px",
                          background: "var(--neutral-subtle)",
                          border: "1px solid rgba(107,114,128,0.20)",
                          color: "var(--neutral-text)",
                          fontSize: "11px",
                          fontWeight: 600,
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {row.layer}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "13px",
                        color: "var(--text-secondary)",
                        fontFamily: "var(--font-sans)",
                      }}
                    >
                      {row.cost}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                      <span
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: row.legal === "green" ? "var(--success)" : "var(--warning)",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "13px",
                          color: "var(--text-secondary)",
                          fontFamily: "var(--font-sans)",
                        }}
                      >
                        {row.legal === "green" ? "Green" : "Amber"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Panel footer */}
              <div
                style={{
                  padding: "20px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <p
                  style={{
                    fontSize: "13px",
                    color: "var(--text-tertiary)",
                    fontFamily: "var(--font-sans)",
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  All data collection respects robots.txt. Personal data handled under UK GDPR Legitimate Interests basis.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
