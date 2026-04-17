"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  Users,
  TrendingUp,
  FileText,
  Settings,
  Target,
  BarChart2,
  Link as LinkIcon,
  Zap,
  GitBranch,
  Search,
  Database,
  Newspaper,
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

interface NavSection {
  sectionLabel: string;
  sectionHref?: string;
  items: NavItem[];
  badge?: "BETA";
}

const NAV_SECTIONS: NavSection[] = [
  {
    sectionLabel: "CONNECTED INTELLIGENCE",
    items: [
      { label: "Morning Brief", href: "/", icon: LayoutDashboard },
      { label: "Priority Queue", href: "/priorities", icon: AlertTriangle },
      { label: "Client Intelligence", href: "/clients", icon: Users },
      { label: "Flow Intelligence", href: "/flows", icon: TrendingUp },
      { label: "RFP Intelligence", href: "/rfp", icon: FileText },
    ],
  },
  {
    sectionLabel: "INTELLIGENCE",
    badge: "BETA",
    items: [
      { label: "Morning Brief", href: "/intelligence/morning-brief", icon: Newspaper },
      // { label: "Overview", href: "/intelligence", icon: LayoutDashboard },
      { label: "IFA Prioritisation", href: "/intelligence/ifa-prioritisation", icon: Target },
      { label: "Competitive Positioning", href: "/intelligence/competitive-positioning", icon: BarChart2 },
      { label: "Partnership Intelligence", href: "/intelligence/partnership-intelligence", icon: LinkIcon },
      { label: "Market Intelligence", href: "/intelligence/market-intelligence", icon: Zap },
      { label: "Platform Flow", href: "/intelligence/platform-flow", icon: GitBranch },
      { label: "AI Research", href: "/intelligence/ai-research", icon: Search },
    ],
  },
  {
    sectionLabel: "SYSTEM INTEGRATIONS",
    items: [
      { label: "Settings", href: "/settings", icon: Settings },
      { label: "Data Sources", href: "/data-sources", icon: Database },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      data-sidebar
      style={{
        width: "240px",
        background: "var(--bg-page)",
        borderRight: "1px solid var(--border)",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
        zIndex: 30,
      }}
    >
      {/* Logo zone — 52px height matches topbar */}
      <div
        style={{
          height: "52px",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
          gap: "8px",
        }}
      >
        {/* Amber square logo mark */}
        <div
          style={{
            width: "20px",
            height: "20px",
            background: "var(--accent)",
            borderRadius: "4px",
            flexShrink: 0,
          }}
        />
        {/* Product name */}
        <span
          style={{
            color: "var(--text-primary)",
            fontSize: "14px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            lineHeight: 1,
          }}
        >
          Regulex
        </span>
      </div>

      {/* Nav sections */}
      <nav style={{ flex: 1, overflowY: "auto", paddingBottom: "8px" }}>
        {NAV_SECTIONS.map((section) => (
          <div key={section.sectionLabel}>
            {/* Section label */}
            {(() => {
              const labelColor = section.sectionLabel === "CONNECTED INTELLIGENCE" ? "var(--text-secondary)" : "var(--text-tertiary)";
              const labelStyle: React.CSSProperties = {
                padding: "0 16px",
                margin: "20px 0 4px 0",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: labelColor,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                textDecoration: "none",
              };
              const badgeEl = section.badge === "BETA" && (
                <span
                  style={{
                    display: "inline-flex",
                    padding: "1px 5px",
                    borderRadius: "4px",
                    fontSize: "9px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: "var(--accent-subtle)",
                    color: "var(--accent)",
                    border: "1px solid rgba(245, 158, 11, 0.15)",
                    verticalAlign: "middle",
                    lineHeight: 1.4,
                  }}
                >
                  BETA
                </span>
              );
              if (section.sectionHref) {
                return (
                  <Link
                    href={section.sectionHref}
                    style={{ ...labelStyle, cursor: "pointer", transition: "color 120ms ease" }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = labelColor; }}
                  >
                    {section.sectionLabel}
                    {badgeEl}
                  </Link>
                );
              }
              return (
                <div style={labelStyle}>
                  {section.sectionLabel}
                  {badgeEl}
                </div>
              );
            })()}

            {/* Nav items */}
            {section.items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <div key={item.href} style={{ margin: "0 8px" }}>
                  <Link
                    href={item.href}
                    className="sidebar-nav-item"
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
                      textDecoration: "none",
                      transition: "all 120ms ease",
                      borderLeft: isActive
                        ? "2px solid var(--accent)"
                        : "2px solid transparent",
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
                  </Link>
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User block */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "12px 16px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Avatar with initials */}
        <div
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            background: "var(--bg-raised)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--text-secondary)",
            fontSize: "11px",
            fontWeight: 500,
            flexShrink: 0,
          }}
        >
          JW
        </div>

        {/* Name and role */}
        <div style={{ minWidth: 0, flex: 1 }}>
          <div
            style={{
              color: "var(--text-primary)",
              fontSize: "13px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.3,
            }}
          >
            James Whitfield
          </div>
          <div
            style={{
              color: "var(--text-tertiary)",
              fontSize: "11px",
              fontWeight: 400,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              lineHeight: 1.3,
            }}
          >
            Head of Distribution
          </div>
        </div>

        {/* Settings gear */}
        <Link
          href="/settings"
          aria-label="Settings"
          className="sidebar-gear-btn"
          style={{
            background: "none",
            border: "none",
            padding: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            borderRadius: "4px",
            textDecoration: "none",
          }}
        >
          <Settings
            size={16}
            strokeWidth={1.5}
            style={{ color: "var(--text-tertiary)" }}
          />
        </Link>
      </div>

      <style>{`
        .sidebar-nav-item:hover {
          background: var(--bg-raised) !important;
          color: var(--text-primary) !important;
        }
        .sidebar-nav-item:hover svg {
          color: var(--text-primary) !important;
        }
        .sidebar-gear-btn:hover svg {
          color: var(--text-secondary) !important;
        }
      `}</style>
    </aside>
  );
}

export default Sidebar;
