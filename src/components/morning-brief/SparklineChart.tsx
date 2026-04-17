"use client";

import { ResponsiveContainer, LineChart, Line } from "recharts";

interface SparklineChartProps {
  data: Array<{ time: number; value: number }> | null;
  color: "emerald" | "red" | "neutral";
}

const COLOR_MAP = {
  emerald: "var(--success-text)",
  red: "var(--danger-text)",
  neutral: "var(--text-tertiary)",
};

export function SparklineChart({ data, color }: SparklineChartProps) {
  if (!data || data.length < 2) return null;
  return (
    <div style={{ marginTop: "8px", height: "48px", width: "100%" }}>
      <ResponsiveContainer width="100%" height={48}>
        <LineChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={COLOR_MAP[color]}
            strokeWidth={1.5}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
