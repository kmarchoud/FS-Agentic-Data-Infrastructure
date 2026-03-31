'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  value: number;
  total: number;
  height?: number;
}

// ── Centre label ─────────────────────────────────────────────────────────────

interface CentreLabelProps {
  viewBox?: { cx: number; cy: number };
  percentage: number;
}

function CentreLabel({ viewBox, percentage }: CentreLabelProps) {
  if (!viewBox) return null;
  const { cx, cy } = viewBox;

  return (
    <g>
      <text
        x={cx}
        y={cy - 8}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          fontWeight: 500,
          fill: 'var(--text-primary, #1A1A1A)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {percentage}%
      </text>
      <text
        x={cx}
        y={cy + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fill: '#999999',
          letterSpacing: '0.01em',
        }}
      >
        Wallet Share
      </text>
    </g>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function DonutChart({ value, total, height = 200 }: DonutChartProps) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
  const remaining = Math.max(0, total - value);

  const data = [
    { name: 'Meridian', value },
    { name: 'Other', value: remaining },
  ];

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          innerRadius="65%"
          outerRadius="85%"
          stroke="#FFFFFF"
          strokeWidth={2}
          paddingAngle={2}
          dataKey="value"
          startAngle={90}
          endAngle={-270}
          labelLine={false}
          label={false}
          isAnimationActive={true}
          animationDuration={600}
          animationEasing="ease-out"
        >
          <Cell fill="#F59E0B" />
          <Cell fill="#EDEDEB" />
        </Pie>

        {/*
          Zero-size Pie used solely to inject the centre SVG label.
          Recharts does not expose a first-class centreLabel API.
        */}
        <Pie
          data={[{ value: 1 }]}
          innerRadius={0}
          outerRadius={0}
          dataKey="value"
          stroke="none"
          fill="transparent"
          isAnimationActive={false}
          labelLine={false}
          label={(props: { cx: number; cy: number }) => (
            <CentreLabel
              viewBox={{ cx: props.cx, cy: props.cy }}
              percentage={percentage}
            />
          )}
        >
          <Cell fill="transparent" stroke="none" />
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
