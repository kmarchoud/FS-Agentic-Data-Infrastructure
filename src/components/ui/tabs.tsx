"use client";

interface Tab {
  label: string;
  value: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (value: string) => void;
}

export function Tabs({ tabs, activeTab, onTabChange }: TabsProps) {
  return (
    <div
      style={{
        display: "flex",
        gap: "24px",
        borderBottom: "1px solid var(--border)",
        marginBottom: "24px",
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.value === activeTab;
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            style={{
              // Reset button defaults
              appearance: "none",
              background: "none",
              border: "none",
              padding: 0,
              margin: 0,
              cursor: "pointer",
              // Tab styling per Section 6i
              fontFamily: "var(--font-sans)",
              fontSize: "13px",
              fontWeight: isActive ? 500 : 400,
              lineHeight: 1.5,
              color: isActive ? "var(--text-primary)" : "var(--text-tertiary)",
              paddingBottom: "12px",
              borderBottom: isActive
                ? "2px solid var(--accent)"
                : "2px solid transparent",
              // Pulls the 2px border flush with the container's 1px border-bottom
              marginBottom: "-1px",
              transition: "color 120ms ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-secondary)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "var(--text-tertiary)";
              }
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
