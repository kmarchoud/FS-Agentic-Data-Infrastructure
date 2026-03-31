'use client';

import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// ── Chart series palette from MASTER.md ───────────────────────────────────────

const DEFAULT_COLOURS = ['#F59E0B', '#3B82F6', '#8B5CF6', '#10B981', '#EC4899'];

interface LineSeries {
  key: string;
  colour?: string;
  label?: string;
}

interface LineChartProps {
  data: Record<string, unknown>[];
  lines: LineSeries[];
  xKey: string;
  benchmarkKey?: string;
  height?: number;
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
  stroke: '#F0F0EE',
  strokeWidth: 1,
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
  payload?: { strokeDasharray?: string };
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
      {payload.map((entry, i) => {
        const isDashed = entry.payload?.strokeDasharray != null;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <svg width="16" height="10" style={{ flexShrink: 0 }}>
              <line
                x1="0"
                y1="5"
                x2="16"
                y2="5"
                stroke={entry.color}
                strokeWidth={isDashed ? 1 : 1.5}
                strokeDasharray={isDashed ? '4 2' : undefined}
              />
            </svg>
            <span style={{ fontSize: '13px', color: '#6B6B6B' }}>{entry.value}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LineChart({
  data,
  lines,
  xKey,
  benchmarkKey,
  height = 300,
}: LineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsLineChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
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
          align="left"
          content={<CustomLegend />}
        />

        {/* Benchmark line — dashed, neutral */}
        {benchmarkKey && (
          <Line
            key={benchmarkKey}
            type="monotone"
            dataKey={benchmarkKey}
            name="Benchmark"
            stroke="#999999"
            strokeWidth={1}
            strokeDasharray="6 3"
            dot={false}
            activeDot={{ r: 3, strokeWidth: 1, fill: '#999999' }}
            isAnimationActive={true}
            animationDuration={600}
            animationEasing="ease-out"
          />
        )}

        {lines.map((s, i) => {
          const colour = s.colour ?? DEFAULT_COLOURS[i % DEFAULT_COLOURS.length];
          return (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label ?? s.key}
              stroke={colour}
              strokeWidth={1.5}
              dot={false}
              activeDot={{ r: 3, strokeWidth: 1, fill: colour }}
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-out"
            />
          );
        })}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
}
