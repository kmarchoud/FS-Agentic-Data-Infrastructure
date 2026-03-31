'use client';

import {
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
}

export function Sparkline({
  data,
  color = '#3B82F6',
  height = 32,
  width = 100,
}: SparklineProps) {
  const chartData = data.map((value) => ({ value }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData} margin={{ top: 1, right: 1, left: 1, bottom: 1 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
