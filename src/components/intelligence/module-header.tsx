"use client";

import { Database, ShieldCheck } from "lucide-react";

interface ModuleHeaderProps {
  title: string;
  description: string;
  onDataSourcesClick?: () => void;
}

export function ModuleHeader({ title, description, onDataSourcesClick }: ModuleHeaderProps) {
  return (
    <div
      style={{
        padding: "24px",
        borderBottom: "1px solid var(--border)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}
    >
      {/* Left column */}
      <div style={{ flex: 1, maxWidth: "600px" }}>
        <h1
          style={{
            fontSize: "20px",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "-0.01em",
            lineHeight: 1.4,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            marginTop: "4px",
            lineHeight: 1.5,
            margin: "4px 0 0 0",
          }}
        >
          {description}
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
            border: "1px solid rgba(34, 197, 94, 0.20)",
            color: "var(--success-text)",
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          <ShieldCheck
            size={14}
            strokeWidth={1.5}
            style={{ color: "var(--success-text)", flexShrink: 0 }}
          />
          Public data only — no internal access required
        </span>
      </div>

      {/* Right column — Data Sources ghost button */}
      {onDataSourcesClick && (
        <button
          onClick={onDataSourcesClick}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            color: "var(--text-secondary)",
            fontSize: "13px",
            fontWeight: 500,
            padding: "8px 12px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            transition: "all 120ms ease",
            flexShrink: 0,
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
          <Database size={16} strokeWidth={1.5} />
          Data Sources
        </button>
      )}
    </div>
  );
}

export default ModuleHeader;
