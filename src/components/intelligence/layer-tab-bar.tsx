"use client";

import { LayerStatusBadge } from "./layer-status-badge";

type LayerStatus = "live" | "building" | "licensed";

interface LayerTab {
  number: number;
  label: string;
  status: LayerStatus;
}

interface LayerTabBarProps {
  layers: LayerTab[];
  activeLayer: number;
  onLayerChange: (layerNumber: number) => void;
}

export function LayerTabBar({ layers, activeLayer, onLayerChange }: LayerTabBarProps) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border)",
        marginTop: "24px",
        marginBottom: "24px",
        display: "flex",
        gap: 0,
      }}
    >
      {layers.map((layer) => {
        const isActive = layer.number === activeLayer;
        const isNonLive = layer.status !== "live";

        return (
          <button
            key={layer.number}
            onClick={() => onLayerChange(layer.number)}
            style={{
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
              marginBottom: "-1px",
              cursor: "pointer",
              transition: "color 120ms ease",
              background: "none",
              border: "none",
              borderBottomWidth: "2px",
              borderBottomStyle: "solid",
              borderBottomColor: isActive ? "var(--accent)" : "transparent",
              fontSize: "13px",
              fontWeight: isActive ? 500 : 400,
              color: isActive
                ? "var(--text-primary)"
                : "var(--text-tertiary)",
              opacity: isNonLive && !isActive ? 0.8 : 1,
              fontFamily: "inherit",
            }}
          >
            <span>
              Layer {layer.number} — {layer.label}
            </span>
            <span style={{ transform: "scale(0.9)", display: "inline-flex" }}>
              <LayerStatusBadge status={layer.status} />
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default LayerTabBar;
