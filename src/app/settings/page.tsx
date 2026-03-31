"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Palette,
  Database,
  Bell,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { TopBar } from "@/components/dashboard/topbar";
import { dataSources } from "@/lib/mock-data";

// ── Nav config ────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "profile",      label: "Profile",      icon: User       },
  { id: "appearance",   label: "Appearance",   icon: Palette    },
  { id: "data-sources", label: "Data Sources", icon: Database   },
  { id: "notifications",label: "Notifications",icon: Bell       },
  { id: "compliance",   label: "Compliance",   icon: Shield     },
] as const;

type NavId = typeof NAV_ITEMS[number]["id"];

// ── Static data ───────────────────────────────────────────────────────────────

const notificationPrefs = [
  { label: "Risk Threshold Alerts",     value: "Enabled — Score ≥ 70",          enabled: true  },
  { label: "Silent Account Alerts",     value: "Enabled — 45+ days no contact", enabled: true  },
  { label: "RFP Deadline Alerts",       value: "Enabled — 7 days prior",        enabled: true  },
  { label: "Flow Anomaly Alerts",       value: "Enabled — ±15% variance",       enabled: true  },
  { label: "Mandate Renewal Reminders", value: "Enabled — 90 days prior",       enabled: true  },
  { label: "Delivery Method",           value: "Email + In-app",                enabled: true  },
];

const complianceFields = [
  { label: "Audit Trail Retention", value: "7 years — enabled"        },
  { label: "Data Residency",        value: "UK / EU only"              },
  { label: "GDPR Status",           value: "Compliant"                 },
  { label: "FCA Reporting",         value: "Active"                    },
  { label: "Last External Audit",   value: "15 Jan 2026"               },
  { label: "Access Log Exports",    value: "Available on request"      },
];

// ── Animation ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.18, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

// ── Shared sub-components ─────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "var(--text-tertiary)",
        margin: "0 0 12px",
      }}
    >
      {children}
    </p>
  );
}

function FieldRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 0",
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{label}</span>
      <span
        style={{
          fontSize: "13px",
          color: "var(--text-primary)",
          fontFamily: mono ? "var(--font-mono)" : undefined,
          fontVariantNumeric: mono ? "tabular-nums" : undefined,
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Section renderers ─────────────────────────────────────────────────────────

function ProfileSection() {
  return (
    <motion.div key="profile" initial="hidden" animate="visible" variants={fadeUp}>
      <SectionLabel>Account</SectionLabel>

      {/* Avatar + name */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          padding: "16px",
          background: "var(--bg-raised)",
          borderRadius: "8px",
          marginBottom: "20px",
          border: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-strong)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "16px",
            fontWeight: 600,
            color: "var(--text-secondary)",
            flexShrink: 0,
          }}
        >
          JW
        </div>
        <div>
          <p style={{ fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 2px" }}>
            James Whitfield
          </p>
          <p style={{ fontSize: "13px", color: "var(--text-tertiary)", margin: 0 }}>
            Head of Distribution · Meridian Asset Management
          </p>
        </div>
      </div>

      {/* Fields */}
      <div>
        <FieldRow label="Email"       value="j.whitfield@meridianam.co.uk" />
        <FieldRow label="Role"        value="Head of Distribution" />
        <FieldRow label="Team"        value="Institutional Distribution" />
        <FieldRow label="Location"    value="London, UK" />
        <FieldRow label="Member since" value="March 2023" mono />
        <FieldRow
          label="Last sign-in"
          value={
            <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontSize: "13px", color: "var(--text-primary)" }}>
              Today · 08:04
            </span>
          }
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <SectionLabel>Assigned Clients</SectionLabel>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {[
            "Cambridge University Endowment",
            "Wellcome Trust",
            "Caledonian Family Office",
            "Church of England Pensions Board",
          ].map((c) => (
            <span
              key={c}
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "4px 10px",
              }}
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function AppearanceSection() {
  const [density, setDensity] = useState<string>("Default");

  return (
    <motion.div key="appearance" initial="hidden" animate="visible" variants={fadeUp}>
      <SectionLabel>Theme</SectionLabel>

      {/* Light theme — active */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          background: "var(--bg-card)",
          border: "1px solid var(--border-strong)",
          borderRadius: "8px",
          marginBottom: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "22px",
              borderRadius: "4px",
              background: "#F8F8F6",
              border: "1px solid var(--border)",
            }}
          />
          <div>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 1px" }}>
              Light
            </p>
            <p style={{ fontSize: "11px", color: "var(--text-tertiary)", margin: 0 }}>
              Warm off-white · Active
            </p>
          </div>
        </div>
        <CheckCircle2 size={16} strokeWidth={1.5} style={{ color: "var(--accent)" }} />
      </div>

      {/* Dark theme — unavailable */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 16px",
          background: "var(--bg-page)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          opacity: 0.5,
          cursor: "not-allowed",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "32px",
              height: "22px",
              borderRadius: "4px",
              background: "#1C1C21",
              border: "1px solid var(--border)",
            }}
          />
          <div>
            <p style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", margin: "0 0 1px" }}>
              Dark
            </p>
            <p style={{ fontSize: "11px", color: "var(--text-tertiary)", margin: 0 }}>
              Dark theme not available
            </p>
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "12px 14px",
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
        }}
      >
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
          Regulex Intelligence is designed as a light-theme product. The interface uses warm off-white surfaces and hairline borders to create institutional clarity. Dark theme is not available.
        </p>
      </div>

      <div style={{ marginTop: "20px" }}>
        <SectionLabel>Density</SectionLabel>
        <div style={{ display: "flex", gap: "8px" }}>
          {["Compact", "Default", "Comfortable"].map((d) => {
            const isActive = density === d;
            return (
              <button
                key={d}
                onClick={() => setDensity(d)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  background: isActive ? "var(--bg-raised)" : "var(--bg-card)",
                  border: isActive ? "1px solid var(--border-strong)" : "1px solid var(--border)",
                  cursor: "pointer",
                  transition: "all 120ms ease",
                }}
              >
                {d}
              </button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function DataSourcesSection() {
  return (
    <motion.div key="data-sources" initial="hidden" animate="visible" variants={fadeUp}>
      <SectionLabel>Connected Sources</SectionLabel>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {dataSources.map((src, idx) => (
          <div
            key={src.name}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom:
                idx < dataSources.length - 1 ? "1px solid var(--border-subtle)" : "none",
              transition: "background-color 100ms ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-raised)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            {/* Status dot + name */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--success)",
                  flexShrink: 0,
                  animation: "pulse-dot 2.2s ease-in-out infinite",
                }}
              />
              <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                {src.name}
              </span>
            </div>

            {/* Status + sync time */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--success-text)",
                }}
              >
                Connected
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  color: "var(--text-tertiary)",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "110px",
                  textAlign: "right",
                }}
              >
                {src.lastSync}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "16px" }}>
        <SectionLabel>Sync Schedule</SectionLabel>
        <div>
          <FieldRow label="CRM (Salesforce)"    value="Real-time" />
          <FieldRow label="Portfolio (Aladdin)" value="Every 2 hours" />
          <FieldRow label="Market Data"         value="Every 1 hour" />
          <FieldRow label="Research"            value="Daily · 07:00" />
          <FieldRow label="Email (Outlook)"     value="Real-time" />
        </div>
      </div>
    </motion.div>
  );
}

function NotificationsSection() {
  return (
    <motion.div key="notifications" initial="hidden" animate="visible" variants={fadeUp}>
      <SectionLabel>Alert Preferences</SectionLabel>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {notificationPrefs.map((pref, idx) => (
          <div
            key={pref.label}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderBottom:
                idx < notificationPrefs.length - 1
                  ? "1px solid var(--border-subtle)"
                  : "none",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {pref.label}
            </span>
            <span
              style={{
                fontSize: "13px",
                color: pref.enabled ? "var(--success-text)" : "var(--text-tertiary)",
              }}
            >
              {pref.value}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "14px",
          padding: "12px 14px",
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
        }}
      >
        <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
          Alert thresholds are set at the firm level by your system administrator. Contact your admin to adjust sensitivity.
        </p>
      </div>
    </motion.div>
  );
}

function ComplianceSection() {
  return (
    <motion.div key="compliance" initial="hidden" animate="visible" variants={fadeUp}>
      <SectionLabel>Regulatory &amp; Audit</SectionLabel>
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {complianceFields.map((field, idx) => (
          <div
            key={field.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom:
                idx < complianceFields.length - 1
                  ? "1px solid var(--border-subtle)"
                  : "none",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
              {field.label}
            </span>
            <span
              style={{
                fontSize: "13px",
                color: "var(--text-primary)",
                fontFamily:
                  field.label === "Last External Audit" ? "var(--font-mono)" : undefined,
                fontVariantNumeric:
                  field.label === "Last External Audit" ? "tabular-nums" : undefined,
              }}
            >
              {field.value}
            </span>
          </div>
        ))}
      </div>

      <div style={{ marginTop: "16px" }}>
        <SectionLabel>Data Access Log</SectionLabel>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          {[
            { action: "Exported client report",    user: "James Whitfield", time: "Today · 09:12" },
            { action: "Viewed Phoenix Group brief", user: "Sarah Chen",     time: "Today · 08:47" },
            { action: "RFP data accessed",         user: "Tom Okafor",     time: "Today · 08:31" },
            { action: "Risk scores recalculated",  user: "System",         time: "Today · 08:00" },
          ].map((log, idx, arr) => (
            <div
              key={idx}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 16px",
                borderBottom: idx < arr.length - 1 ? "1px solid var(--border-subtle)" : "none",
              }}
            >
              <div>
                <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>
                  {log.action}
                </span>
                <span style={{ fontSize: "11px", color: "var(--text-tertiary)", marginLeft: "8px" }}>
                  · {log.user}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "11px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--text-tertiary)",
                }}
              >
                {log.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [active, setActive] = useState<NavId>("profile");

  const contentMap: Record<NavId, React.ReactNode> = {
    profile:       <ProfileSection />,
    appearance:    <AppearanceSection />,
    "data-sources":<DataSourcesSection />,
    notifications: <NotificationsSection />,
    compliance:    <ComplianceSection />,
  };

  return (
    <div style={{ background: "var(--bg-page)", minHeight: "100vh" }}>
      <TopBar title="Settings" />

      <main
        style={{
          padding: "24px",
          display: "flex",
          gap: "24px",
          alignItems: "flex-start",
          maxWidth: "1440px",
        }}
      >
        {/* ── Left nav ───────────────────────────────────────────────────── */}
        <nav
          style={{
            width: "200px",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
            position: "sticky",
            top: "76px",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--text-tertiary)",
              margin: "0 0 8px 12px",
            }}
          >
            Settings
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "var(--text-primary)" : "var(--text-secondary)",
                  background: isActive ? "var(--bg-raised)" : "transparent",
                  border: "none",
                  borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 120ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "var(--bg-raised)";
                    e.currentTarget.style.color = "var(--text-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-secondary)";
                  }
                }}
              >
                <Icon
                  size={16}
                  strokeWidth={1.5}
                  style={{
                    color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
                    flexShrink: 0,
                  }}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* ── Right content ──────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            minWidth: 0,
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "24px",
            maxWidth: "640px",
          }}
        >
          {contentMap[active]}
        </div>
      </main>

      {/* Pulse dot keyframe — needed for data sources */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
