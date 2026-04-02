"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, TrendingDown, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { TopBar } from "@/components/dashboard/topbar";
import { ConnectedDataStrip } from "@/components/dashboard/connected-data-strip";
import { Badge } from "@/components/ui/badge";
import { RiskBar } from "@/components/ui/risk-bar";
import { clients } from "@/lib/mock-data";
import type { Client, ClientType } from "@/lib/mock-data";

// ── Date helpers ─────────────────────────────────────────────────────────────

const TODAY = new Date("2026-03-31");

function daysSince(dateStr: string): number {
  return Math.floor(
    (TODAY.getTime() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24)
  );
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  return Math.floor(
    (new Date(dateStr).getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24)
  );
}

function formatRenewalDate(dateStr: string | null): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "2-digit",
  });
}

function formatAUM(aum: number): string {
  return `£${aum.toLocaleString("en-GB")}m`;
}

// ── Priority score ────────────────────────────────────────────────────────────

function priorityScore(c: Client): number {
  const days = daysSince(c.lastContactDate);
  const renewal = daysUntil(c.mandateRenewalDate);
  const renewalUrgency =
    renewal !== null ? Math.max(0, (90 - renewal) / 90) * 100 : 0;
  return c.riskScore * 0.4 + Math.min(days, 100) * 0.35 + renewalUrgency * 0.25;
}

function isUrgentRow(c: Client): boolean {
  const renewal = daysUntil(c.mandateRenewalDate);
  return c.riskScore > 75 && renewal !== null && renewal < 60;
}

// ── Colour helpers ────────────────────────────────────────────────────────────

function lastContactColour(days: number): string {
  if (days > 45) return "var(--danger-text)";
  if (days >= 20) return "var(--warning-text)";
  return "var(--text-tertiary)";
}

function renewalColour(days: number | null): string {
  if (days === null) return "var(--text-tertiary)";
  if (days < 30) return "var(--danger-text)";
  if (days < 60) return "var(--warning-text)";
  return "var(--text-tertiary)";
}

function clientTypeToBadgeVariant(
  type: ClientType
): React.ComponentProps<typeof Badge>["variant"] {
  const map: Record<ClientType, React.ComponentProps<typeof Badge>["variant"]> = {
    "Pension Fund": "pension-fund",
    Endowment: "endowment",
    Insurance: "insurance",
    "Family Office": "family-office",
    "Wealth Manager": "wealth-manager",
    Platform: "platform",
  };
  return map[type];
}

// ── Contact recency buckets ───────────────────────────────────────────────────

interface RecencyBucket {
  label: string;
  count: number;
  colour: string;
}

function buildRecencyBuckets(list: Client[]): RecencyBucket[] {
  return [
    { label: "0–7 days",   min: 0,   max: 7,        colour: "rgba(34,197,94,0.80)"   },
    { label: "7–14 days",  min: 7,   max: 14,       colour: "rgba(34,197,94,0.60)"   },
    { label: "14–30 days", min: 14,  max: 30,       colour: "rgba(107,114,128,0.80)" },
    { label: "30–45 days", min: 30,  max: 45,       colour: "rgba(245,158,11,0.80)"  },
    { label: "45d+",       min: 45,  max: Infinity, colour: "rgba(239,68,68,0.80)"   },
  ].map(({ label, min, max, colour }) => ({
    label,
    colour,
    count: list.filter((c) => {
      const d = daysSince(c.lastContactDate);
      return d >= min && d < max;
    }).length,
  }));
}

// ── BarList ───────────────────────────────────────────────────────────────────

function BarList({ buckets }: { buckets: RecencyBucket[] }) {
  const max = Math.max(...buckets.map((b) => b.count), 1);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {buckets.map((bucket, i) => (
        <motion.div
          key={bucket.label}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.2,
            delay: 0.1 + i * 0.06,
            ease: [0.25, 0.1, 0.25, 1],
          }}
          style={{ display: "flex", alignItems: "center", gap: "10px" }}
        >
          {/* Label */}
          <span
            style={{
              width: "72px",
              flexShrink: 0,
              fontSize: "13px",
              color: "var(--text-secondary)",
              lineHeight: 1.4,
            }}
          >
            {bucket.label}
          </span>

          {/* Bar track */}
          <div
            style={{
              flex: 1,
              height: "24px",
              borderRadius: "4px",
              backgroundColor: "var(--bg-subtle)",
              overflow: "hidden",
            }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(bucket.count / max) * 100}%` }}
              transition={{
                duration: 0.5,
                delay: 0.25 + i * 0.06,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              style={{
                height: "100%",
                backgroundColor: bucket.colour,
                borderRadius: "4px",
              }}
            />
          </div>

          {/* Count */}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "12px",
              fontVariantNumeric: "tabular-nums",
              color: "var(--text-secondary)",
              width: "16px",
              textAlign: "right",
              flexShrink: 0,
            }}
          >
            {bucket.count}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

// ── SilentAccountsCallout ─────────────────────────────────────────────────────

function SilentAccountsCallout() {
  const silent = clients.filter((c) => daysSince(c.lastContactDate) > 45);
  const totalAUM = silent.reduce((s, c) => s + c.aum, 0);
  if (silent.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        marginTop: "24px",
        border: "1px solid rgba(239,68,68,0.25)",
        borderLeft: "3px solid var(--danger)",
        borderRadius: "8px",
        backgroundColor: "var(--danger-subtle)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
      }}
    >
      {/* Icon */}
      <AlertTriangle
        size={16}
        strokeWidth={2}
        style={{ color: "var(--danger-text)", flexShrink: 0, marginTop: "1px" }}
      />

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: 600,
            color: "var(--danger-text)",
            lineHeight: 1.4,
          }}
        >
          {silent.length} silent account{silent.length > 1 ? "s" : ""} — no contact in over 45 days
        </p>
        <p
          style={{
            margin: "4px 0 0",
            fontSize: "13px",
            color: "var(--text-secondary)",
            lineHeight: 1.5,
          }}
        >
          {silent.map((c) => c.name).join(", ")} ·{" "}
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontVariantNumeric: "tabular-nums",
              color: "var(--danger-text)",
            }}
          >
            {formatAUM(totalAUM)}
          </span>{" "}
          combined AUM at risk of silent redemption
        </p>
      </div>

      {/* Days-ago pills */}
      <div
        style={{
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          gap: "4px",
          alignItems: "flex-end",
        }}
      >
        {silent.map((c) => (
          <span
            key={c.id}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              fontVariantNumeric: "tabular-nums",
              color: "var(--danger-text)",
              backgroundColor: "rgba(239,68,68,0.06)",
              border: "1px solid rgba(239,68,68,0.20)",
              borderRadius: "9999px",
              padding: "1px 8px",
              whiteSpace: "nowrap",
            }}
          >
            {daysSince(c.lastContactDate)}d ago
          </span>
        ))}
      </div>
    </motion.div>
  );
}

// ── Ghost select ──────────────────────────────────────────────────────────────

interface GhostSelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
}

function GhostSelect({ label, options, value, onChange }: GhostSelectProps) {
  return (
    <div style={{ position: "relative", display: "inline-flex" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          appearance: "none",
          WebkitAppearance: "none",
          backgroundColor: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "6px 30px 6px 10px",
          fontSize: "13px",
          color: value === "" ? "var(--text-tertiary)" : "var(--text-secondary)",
          cursor: "pointer",
          outline: "none",
          fontFamily: "inherit",
          lineHeight: 1.4,
          transition: "border-color 120ms ease",
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = "var(--border-strong)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        <option value="">{label}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={12}
        strokeWidth={2}
        style={{
          position: "absolute",
          right: "9px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-tertiary)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ── Sort indicator ────────────────────────────────────────────────────────────

type SortKey = "priority" | "name" | "aum" | "lastContact" | "risk" | "renewal" | "rm";
type SortDir = "asc" | "desc";

function SortArrow({ active, dir }: { active: boolean; dir: SortDir }) {
  const Icon = dir === "asc" ? ChevronUp : ChevronDown;
  return (
    <Icon
      size={12}
      strokeWidth={2}
      style={{
        display: "inline",
        marginLeft: "3px",
        verticalAlign: "middle",
        color: active ? "var(--text-primary)" : "var(--text-tertiary)",
        opacity: active ? 1 : 0.35,
      }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PrioritiesPage() {
  const [filterRM, setFilterRM]     = useState("");
  const [filterRisk, setFilterRisk] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDays, setFilterDays] = useState("");
  const [sortKey, setSortKey]       = useState<SortKey>("priority");
  const [sortDir, setSortDir]       = useState<SortDir>("desc");

  const rmOptions: string[]   = Array.from(new Set(clients.map((c) => c.assignedRM))).sort();
  const typeOptions: string[] = [
    "Pension Fund", "Endowment", "Insurance",
    "Family Office", "Wealth Manager", "Platform",
  ];
  const riskOptions: string[] = ["High (>65)", "Medium (40–65)", "Low (<40)"];
  const daysOptions: string[] = ["<7 days", "7–14 days", "14–30 days", "30–45 days", "45d+"];

  const sorted = useMemo(() => {
    let list = [...clients];

    if (filterRM)   list = list.filter((c) => c.assignedRM === filterRM);
    if (filterType) list = list.filter((c) => c.type === filterType);
    if (filterRisk) {
      list = list.filter((c) => {
        if (filterRisk === "High (>65)")    return c.riskScore > 65;
        if (filterRisk === "Medium (40–65)") return c.riskScore >= 40 && c.riskScore <= 65;
        return c.riskScore < 40;
      });
    }
    if (filterDays) {
      list = list.filter((c) => {
        const d = daysSince(c.lastContactDate);
        if (filterDays === "<7 days")      return d < 7;
        if (filterDays === "7–14 days")    return d >= 7 && d < 14;
        if (filterDays === "14–30 days")   return d >= 14 && d < 30;
        if (filterDays === "30–45 days")   return d >= 30 && d < 45;
        return d >= 45;
      });
    }

    list.sort((a, b) => {
      let va: number | string = 0;
      let vb: number | string = 0;
      if (sortKey === "priority")    { va = priorityScore(a);                     vb = priorityScore(b); }
      else if (sortKey === "name")   { va = a.name;                               vb = b.name; }
      else if (sortKey === "aum")    { va = a.aum;                                vb = b.aum; }
      else if (sortKey === "lastContact") { va = daysSince(a.lastContactDate);    vb = daysSince(b.lastContactDate); }
      else if (sortKey === "risk")   { va = a.riskScore;                          vb = b.riskScore; }
      else if (sortKey === "renewal"){ va = daysUntil(a.mandateRenewalDate) ?? 9999; vb = daysUntil(b.mandateRenewalDate) ?? 9999; }
      else if (sortKey === "rm")     { va = a.assignedRM;                         vb = b.assignedRM; }

      if (typeof va === "string" && typeof vb === "string") {
        return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortDir === "asc"
        ? (va as number) - (vb as number)
        : (vb as number) - (va as number);
    });

    return list;
  }, [filterRM, filterRisk, filterType, filterDays, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortKey(key); setSortDir("desc"); }
  }

  const recencyBuckets = useMemo(() => buildRecencyBuckets(clients), []);
  const urgentCount    = clients.filter((c) => c.riskScore > 65).length;
  const filtersActive  = !!(filterRM || filterRisk || filterType || filterDays);

  // Column definitions
  const columns: Array<{
    key: SortKey | null;
    label: string;
    align: "left" | "right";
  }> = [
    { key: "priority",    label: "#",             align: "right" },
    { key: "name",        label: "Client",         align: "left"  },
    { key: "aum",         label: "AUM",            align: "right" },
    { key: "lastContact", label: "Last Contact",   align: "right" },
    { key: "risk",        label: "Risk",           align: "left"  },
    { key: "renewal",     label: "Renewal",        align: "right" },
    { key: "rm",          label: "RM",             align: "left"  },
    { key: null,          label: "Signal",         align: "left"  },
    { key: null,          label: "Action",         align: "left"  },
  ];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg-page)" }}>
      <TopBar title="Priority Queue" />
      <ConnectedDataStrip />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ padding: "24px 24px 48px" }}
      >
        {/* ── Revenue callout ─────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "20px",
          }}
        >
          <TrendingDown
            size={14}
            strokeWidth={2}
            style={{ color: "var(--danger-text)", flexShrink: 0 }}
          />
          <p
            style={{
              margin: 0,
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: 1.5,
            }}
          >
            {urgentCount} accounts require urgent attention ·{" "}
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontVariantNumeric: "tabular-nums",
                color: "var(--accent)",
                fontWeight: 600,
              }}
            >
              £14.12m
            </span>{" "}
            in annual fees at risk
          </p>
        </div>

        {/* ── Filter bar ──────────────────────────────────────────────────── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "24px",
            flexWrap: "wrap",
          }}
        >
          <GhostSelect
            label="All RMs"
            options={rmOptions}
            value={filterRM}
            onChange={setFilterRM}
          />
          <GhostSelect
            label="Risk Level"
            options={riskOptions}
            value={filterRisk}
            onChange={setFilterRisk}
          />
          <GhostSelect
            label="Client Type"
            options={typeOptions}
            value={filterType}
            onChange={setFilterType}
          />
          <GhostSelect
            label="Days Since Contact"
            options={daysOptions}
            value={filterDays}
            onChange={setFilterDays}
          />

          {filtersActive && (
            <button
              onClick={() => {
                setFilterRM("");
                setFilterRisk("");
                setFilterType("");
                setFilterDays("");
              }}
              style={{
                background: "none",
                border: "none",
                padding: "6px 4px",
                fontSize: "12px",
                color: "var(--text-tertiary)",
                cursor: "pointer",
                transition: "color 120ms ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-tertiary)";
              }}
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Two-column layout ────────────────────────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 260px",
            gap: "24px",
            alignItems: "start",
          }}
        >
          {/* ── LEFT: Table ─────────────────────────────────────────────── */}
          <div style={{ overflow: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "13px",
              }}
            >
              {/* thead */}
              <thead
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: "var(--bg-page)",
                }}
              >
                <tr>
                  {columns.map((col) => (
                    <th
                      key={col.label}
                      onClick={col.key ? () => handleSort(col.key!) : undefined}
                      style={{
                        padding: "10px 12px",
                        fontSize: "11px",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--text-tertiary)",
                        borderBottom: "1px solid var(--border-strong)",
                        textAlign: col.align,
                        cursor: col.key ? "pointer" : "default",
                        userSelect: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {col.label}
                      {col.key && (
                        <SortArrow
                          active={sortKey === col.key}
                          dir={sortKey === col.key ? sortDir : "desc"}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              </thead>

              {/* tbody */}
              <tbody>
                {sorted.map((client, idx) => {
                  const days    = daysSince(client.lastContactDate);
                  const renewal = daysUntil(client.mandateRenewalDate);
                  const urgent  = isUrgentRow(client);

                  return (
                    <motion.tr
                      key={client.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.15, delay: idx * 0.025 }}
                      style={{
                        borderBottom: "1px solid var(--border-subtle)",
                        borderLeft: urgent
                          ? "2px solid var(--danger)"
                          : "2px solid transparent",
                        transition: "background-color 100ms ease",
                        cursor: "pointer",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          "var(--bg-raised)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLTableRowElement).style.backgroundColor =
                          "transparent";
                      }}
                    >
                      {/* # */}
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontFamily: "var(--font-mono)",
                          fontSize: "12px",
                          fontVariantNumeric: "tabular-nums",
                          color: "var(--text-tertiary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {idx + 1}
                      </td>

                      {/* Client name + type badge */}
                      <td style={{ padding: "10px 12px" }}>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "13px",
                              fontWeight: 500,
                              color: "var(--text-primary)",
                              lineHeight: 1.3,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {client.name}
                          </span>
                          <Badge variant={clientTypeToBadgeVariant(client.type)}>
                            {client.type}
                          </Badge>
                        </div>
                      </td>

                      {/* AUM */}
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontFamily: "var(--font-mono)",
                          fontSize: "13px",
                          fontVariantNumeric: "tabular-nums",
                          color: "var(--text-primary)",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatAUM(client.aum)}
                      </td>

                      {/* Last contact */}
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontFamily: "var(--font-mono)",
                          fontSize: "12px",
                          fontVariantNumeric: "tabular-nums",
                          color: lastContactColour(days),
                          whiteSpace: "nowrap",
                        }}
                      >
                        {days}d ago
                      </td>

                      {/* Risk bar */}
                      <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                        <RiskBar score={client.riskScore} width="60px" />
                      </td>

                      {/* Renewal */}
                      <td
                        style={{
                          padding: "10px 12px",
                          textAlign: "right",
                          fontFamily: "var(--font-mono)",
                          fontSize: "12px",
                          fontVariantNumeric: "tabular-nums",
                          color: renewalColour(renewal),
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatRenewalDate(client.mandateRenewalDate)}
                      </td>

                      {/* RM badge */}
                      <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            borderRadius: "9999px",
                            padding: "2px 8px",
                            fontSize: "11px",
                            fontWeight: 500,
                            backgroundColor: "var(--bg-raised)",
                            border: "1px solid var(--border)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {client.assignedRM}
                        </span>
                      </td>

                      {/* Signal — 2-line clamp */}
                      <td
                        style={{
                          padding: "10px 12px",
                          maxWidth: "220px",
                          minWidth: "160px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "12px",
                            color: "var(--text-secondary)",
                            lineHeight: 1.5,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          } as React.CSSProperties}
                        >
                          {client.notes}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ padding: "10px 12px", whiteSpace: "nowrap" }}>
                        <a
                          href={`/clients?id=${client.id}&tab=brief`}
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            padding: "5px 12px",
                            fontSize: "12px",
                            fontWeight: 500,
                            color: "var(--text-secondary)",
                            backgroundColor: "var(--bg-card)",
                            border: "1px solid var(--border)",
                            borderRadius: "6px",
                            textDecoration: "none",
                            transition: "border-color 120ms ease, color 120ms ease",
                          }}
                          onMouseEnter={(e) => {
                            const el = e.currentTarget;
                            el.style.borderColor = "var(--border-strong)";
                            el.style.color = "var(--text-primary)";
                          }}
                          onMouseLeave={(e) => {
                            const el = e.currentTarget;
                            el.style.borderColor = "var(--border)";
                            el.style.color = "var(--text-secondary)";
                          }}
                        >
                          Prepare Brief
                        </a>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {/* Empty state */}
            {sorted.length === 0 && (
              <div
                style={{
                  padding: "48px 24px",
                  textAlign: "center",
                  color: "var(--text-tertiary)",
                  fontSize: "13px",
                }}
              >
                No clients match the current filters.
              </div>
            )}

            {/* Silent accounts callout */}
            <SilentAccountsCallout />
          </div>

          {/* ── RIGHT: Sidebar ───────────────────────────────────────────── */}
          <div
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "20px",
              position: "sticky",
              top: "76px",
            }}
          >
            {/* Section label */}
            <p
              style={{
                margin: "0 0 16px",
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-tertiary)",
              }}
            >
              Contact Recency
            </p>

            <BarList buckets={recencyBuckets} />

            {/* Total */}
            <div
              style={{
                marginTop: "16px",
                paddingTop: "16px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
                Total accounts
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "13px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--text-primary)",
                  fontWeight: 500,
                }}
              >
                {clients.length}
              </span>
            </div>

            {/* Overdue warning chip */}
            {(() => {
              const overdue = clients.filter(
                (c) => daysSince(c.lastContactDate) > 45
              ).length;
              if (overdue === 0) return null;
              return (
                <div
                  style={{
                    marginTop: "12px",
                    padding: "8px 10px",
                    backgroundColor: "rgba(239,68,68,0.06)",
                    border: "1px solid rgba(239,68,68,0.20)",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Clock
                    size={12}
                    strokeWidth={2}
                    style={{ color: "var(--danger-text)", flexShrink: 0 }}
                  />
                  <span style={{ fontSize: "12px", color: "var(--danger-text)" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontVariantNumeric: "tabular-nums",
                        fontWeight: 600,
                      }}
                    >
                      {overdue}
                    </span>{" "}
                    overdue contact{overdue > 1 ? "s" : ""}
                  </span>
                </div>
              );
            })()}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
