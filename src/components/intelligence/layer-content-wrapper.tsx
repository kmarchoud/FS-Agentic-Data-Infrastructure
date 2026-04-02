"use client";

import { Clock, Lock } from "lucide-react";
import type { ReactNode } from "react";

type LayerStatus = "live" | "building" | "licensed";

interface LayerContentWrapperProps {
  status: LayerStatus;
  quarterLabel?: string;
  children: ReactNode;
  licenseProviders?: { name: string; description: string }[];
}

export function LayerContentWrapper({
  status,
  quarterLabel = "Q2 2026",
  children,
  licenseProviders,
}: LayerContentWrapperProps) {
  if (status === "live") {
    return <>{children}</>;
  }

  if (status === "building") {
    return (
      <div style={{ position: "relative" }}>
        {/* Greyed preview content */}
        <div style={{ pointerEvents: "none", userSelect: "none" }}>
          {children}
        </div>

        {/* Overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(248, 248, 246, 0.7)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
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
            <Clock
              size={24}
              strokeWidth={1.5}
              style={{ color: "var(--text-tertiary)", margin: "0 auto" }}
            />
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: "var(--text-primary)",
                marginTop: "12px",
              }}
            >
              In development
            </div>
            <div
              style={{
                fontSize: "13px",
                color: "var(--text-tertiary)",
                marginTop: "4px",
              }}
            >
              Available {quarterLabel}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Licensed
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--accent)",
        borderRadius: "8px",
        padding: "20px",
      }}
    >
      <Lock
        size={20}
        strokeWidth={1.5}
        style={{ color: "var(--accent)", marginBottom: "12px" }}
      />
      <div
        style={{
          fontSize: "14px",
          fontWeight: 600,
          color: "var(--text-primary)",
        }}
      >
        Requires licensing
      </div>
      <div
        style={{
          fontSize: "13px",
          color: "var(--text-secondary)",
          marginTop: "8px",
          lineHeight: 1.5,
        }}
      >
        This layer requires commercial data from:
      </div>
      {licenseProviders && licenseProviders.length > 0 && (
        <div style={{ marginTop: "8px" }}>
          {licenseProviders.map((provider) => (
            <div
              key={provider.name}
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              &bull; {provider.name} — {provider.description}
            </div>
          ))}
        </div>
      )}
      <a
        href="#"
        style={{
          display: "inline-block",
          marginTop: "16px",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--accent)",
          textDecoration: "none",
          cursor: "pointer",
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.textDecoration = "underline";
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.textDecoration = "none";
        }}
      >
        Register Interest
      </a>
    </div>
  );
}

export default LayerContentWrapper;
