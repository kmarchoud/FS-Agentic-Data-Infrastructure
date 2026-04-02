"use client";

import { useState, useEffect } from "react";

const CORRECT_PASSWORD = "Regulex";
const STORAGE_KEY = "regulex-auth";

export function PasswordGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setAuthenticated(true);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
    }
  }

  // Prevent flash of login screen on authenticated sessions
  if (!mounted) return null;

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-page)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "380px",
          padding: "40px",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "40px" }}>
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "var(--accent)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: "18px", fontWeight: 600, color: "var(--text-primary)" }}>
            Regulex
          </span>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: "20px", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>
          Distribution Intelligence
        </h1>
        <p style={{ fontSize: "13px", color: "var(--text-tertiary)", margin: "0 0 32px" }}>
          Enter your access password to continue
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label
              htmlFor="password"
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 500,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--text-tertiary)",
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              autoFocus
              autoComplete="off"
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "14px",
                fontFamily: "var(--font-sans)",
                color: "var(--text-primary)",
                background: "var(--bg-card)",
                border: `1px solid ${error ? "var(--danger)" : "var(--border)"}`,
                borderRadius: "6px",
                outline: "none",
                transition: "border-color 120ms ease",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                if (!error) e.currentTarget.style.borderColor = "var(--border-strong)";
              }}
              onBlur={(e) => {
                if (!error) e.currentTarget.style.borderColor = "var(--border)";
              }}
            />
            {error && (
              <p style={{ fontSize: "12px", color: "var(--danger-text)", margin: "6px 0 0" }}>
                Incorrect password
              </p>
            )}
          </div>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px 16px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#FFFFFF",
              background: "var(--accent)",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background 120ms ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)"; }}
          >
            Continue
          </button>
        </form>

        {/* Footer */}
        <p style={{
          fontSize: "11px",
          color: "var(--text-disabled)",
          textAlign: "center",
          marginTop: "32px",
          fontFamily: "var(--font-mono)",
          fontVariantNumeric: "tabular-nums",
        }}>
          Meridian Asset Management · Confidential
        </p>
      </div>
    </div>
  );
}
