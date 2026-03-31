'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';

interface BarChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  height?: number;
  showNegative?: boolean;
}

// ── Shared style constants ────────────────────────────────────────────────────

const TOOLTIP_CONTENT_STYLE = {
  background: '#FFFFFF',
  border: '1px solid #D4D4D0',
  borderRadius: '8px',
  padding: '12px',
  fontSize: '12px',
  fontFamily: 'var(--font-mono)',
  color: '#1A1A1A',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
};

const TOOLTIP_LABEL_STYLE = {
  color: '#999999',
  fontSize: '11px',
  marginBottom: '4px',
};

const TOOLTIP_ITEM_STYLE = {
  color: '#6B6B6B',
  padding: '2px 0',
};

const TOOLTIP_CURSOR_STYLE = {
  fill: '#F0F0EE',
  opacity: 0.5,
};

const TICK_STYLE = {
  fontSize: 11,
  fill: '#999999',
  fontFamily: 'var(--font-mono)',
};

// ── Component ─────────────────────────────────────────────────────────────────

export function BarChart({
  data,
  dataKey,
  xKey,
  height = 300,
  showNegative = false,
}: BarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        barCategoryGap="40%"
        margin={{ top: 4, right: 4, left: -16, bottom: 0 }}
      >
        <CartesianGrid
          stroke="#F0F0EE"
          strokeOpacity={0.6}
          vertical={false}
        />

        <XAxis
          dataKey={xKey}
          tick={TICK_STYLE}
          axisLine={{ stroke: '#D4D4D0' }}
          tickLine={false}
        />
        <YAxis
          tick={TICK_STYLE}
          axisLine={false}
          tickLine={false}
        />

        <Tooltip
          contentStyle={TOOLTIP_CONTENT_STYLE}
          labelStyle={TOOLTIP_LABEL_STYLE}
          itemStyle={TOOLTIP_ITEM_STYLE}
          cursor={TOOLTIP_CURSOR_STYLE}
        />

        {showNegative && (
          <ReferenceLine y={0} stroke="#D4D4D0" strokeWidth={1} />
        )}

        <Bar
          dataKey={dataKey}
          radius={[4, 4, 0, 0]}
          isAnimationActive={true}
          animationDuration={600}
          animationEasing="ease-out"
        >
          {data.map((entry, index) => {
            const value = entry[dataKey];
            const isNegative = typeof value === 'number' && value < 0;
            return (
              <Cell
                key={`cell-${index}`}
                fill={isNegative ? '#DC2626' : '#16A34A'}
                fillOpacity={0.7}
              />
            );
          })}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
