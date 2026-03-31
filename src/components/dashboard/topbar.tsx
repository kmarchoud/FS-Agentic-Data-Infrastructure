"use client";

import { useState, useEffect } from "react";
import { Search, Bell } from "lucide-react";

interface TopBarProps {
  title: string;
}

function formatClock(date: Date): string {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const dayName = days[date.getDay()];
  const day = date.getDate().toString().padStart(2, "0");
  const month = months[date.getMonth()];
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${dayName} ${day} ${month} · ${hours}:${minutes}`;
}

function LiveClock() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(formatClock(new Date()));
    const interval = setInterval(() => {
      setTime(formatClock(new Date()));
    }, 60_000);
    return () => clearInterval(interval);
  }, []);

  if (!time) return null;

  return (
    <span
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "11px",
        fontWeight: 400,
        color: "var(--text-tertiary)",
        letterSpacing: "0.02em",
        whiteSpace: "nowrap",
      }}
    >
      {time}
    </span>
  );
}

export function TopBar({ title }: TopBarProps) {
  return (
    <header
      data-topbar
      style={{
        height: "52px",
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 20,
      }}
    >
      {/* Left: Page title */}
      <h1
        style={{
          color: "var(--text-primary)",
          fontSize: "20px",
          fontWeight: 600,
          letterSpacing: "-0.015em",
          margin: 0,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h1>

      {/* Right: clock, search, bell, avatar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <LiveClock />

        {/* Search icon */}
        <button
          aria-label="Search"
          className="topbar-icon-btn"
          onClick={() => alert("Search — Press ⌘K to search clients, funds, and intelligence")}
          style={{
            background: "none",
            border: "none",
            padding: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "4px",
            transition: "color 120ms ease",
          }}
        >
          <Search
            size={18}
            strokeWidth={1.5}
            style={{ color: "var(--text-tertiary)" }}
          />
        </button>

        {/* Bell icon with amber notification dot */}
        <div style={{ position: "relative", flexShrink: 0 }}>
          <button
            aria-label="Notifications"
            className="topbar-bell-btn"
            onClick={() => alert("4 urgent alerts:\n\n• Aviva Staff Pension — 61 days no contact\n• Phoenix Group — 72 days no contact\n• Lancashire County — mandate renewal in 51 days\n• West Midlands — risk score elevated to 67")}
            style={{
              background: "none",
              border: "none",
              padding: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "4px",
              transition: "color 120ms ease",
            }}
          >
            <Bell
              size={18}
              strokeWidth={1.5}
              style={{ color: "var(--text-tertiary)" }}
            />
          </button>
          {/* Amber notification dot */}
          <span
            style={{
              position: "absolute",
              top: "-1px",
              right: "-1px",
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "var(--accent)",
              pointerEvents: "none",
            }}
          />
        </div>

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
            cursor: "pointer",
          }}
        >
          JW
        </div>
      </div>

      <style>{`
        .topbar-icon-btn:hover svg,
        .topbar-bell-btn:hover svg {
          color: var(--text-secondary) !important;
        }
      `}</style>
    </header>
  );
}

export default TopBar;
