"use client";

interface SkeletonCardProps {
  width?: string;
  height?: string;
  lines?: { width: string; height: string }[];
}

export function SkeletonCard({ width, height, lines }: SkeletonCardProps) {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "16px",
        width: width || "100%",
        height: height || "auto",
        animation: "skeleton-fade 1.5s ease-in-out infinite",
      }}
    >
      {lines
        ? lines.map((line, i) => (
            <div
              key={i}
              style={{
                height: line.height,
                width: line.width,
                background: "var(--bg-subtle)",
                borderRadius: "4px",
                marginTop: i > 0 ? "8px" : 0,
              }}
            />
          ))
        : (
          <>
            <div style={{ height: "11px", width: "80px", background: "var(--bg-subtle)", borderRadius: "4px" }} />
            <div style={{ height: "24px", width: "100px", background: "var(--bg-subtle)", borderRadius: "4px", marginTop: "8px" }} />
            <div style={{ height: "12px", width: "60px", background: "var(--bg-subtle)", borderRadius: "4px", marginTop: "4px" }} />
          </>
        )}
      <style>{`
        @keyframes skeleton-fade {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
