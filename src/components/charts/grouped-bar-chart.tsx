'use client';

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface SeriesConfig {
  key: string;
  colour?: string;
  label: string;
}

interface GroupedBarChartProps {
  data: Record<string, unknown>[];
  series: SeriesConfig[];
  xKey: string;
  height?: number;
}

// ── Chart series palette from MASTER.md ───────────────────────────────────────

const DEFAULT_COLOURS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899'];

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

// ── Legend renderer ───────────────────────────────────────────────────────────

interface LegendPayloadItem {
  color: string;
  value: string;
}

interface CustomLegendProps {
  payload?: LegendPayloadItem[];
}

function CustomLegend({ payload }: CustomLegendProps) {
  if (!payload?.length) return null;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
        marginBottom: '12px',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {payload.map((entry, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span
            style={{
              display: 'inline-block',
              width: '10px',
              height: '10px',
              borderRadius: '2px',
              background: entry.color,
            }}
          />
          <span style={{ fontSize: '13px', color: '#6B6B6B' }}>{entry.value}</span>
        </div>
      ))}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function GroupedBarChart({
  data,
  series,
  xKey,
  height = 300,
}: GroupedBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        barCategoryGap="30%"
        barGap={3}
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

        <Legend
          verticalAlign="top"
          content={<CustomLegend />}
        />

        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.label}
            fill={s.colour ?? DEFAULT_COLOURS[i % DEFAULT_COLOURS.length]}
            fillOpacity={0.85}
            radius={[4, 4, 0, 0]}
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease-out"
          />
        ))}
      </RechartsBarChart>
    </ResponsiveContainer>
  );
}
