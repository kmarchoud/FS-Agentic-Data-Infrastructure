'use client';

import {
  AreaChart as RechartsAreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface AreaChartProps {
  data: Record<string, unknown>[];
  dataKey: string;
  xKey: string;
  height?: number;
  showAxes?: boolean;
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

// ── Component ─────────────────────────────────────────────────────────────────

export function AreaChart({
  data,
  dataKey,
  xKey,
  height = 300,
  showAxes = true,
}: AreaChartProps) {
  // Sparkline mode: no axes, no grid, no tooltip, 36px height
  if (!showAxes) {
    return (
      <ResponsiveContainer width="100%" height={36}>
        <RechartsAreaChart data={data} margin={{ top: 1, right: 0, left: 0, bottom: 1 }}>
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.08} />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey={dataKey}
            stroke="#F59E0B"
            strokeWidth={1.5}
            fill="url(#sparklineGradient)"
            dot={false}
            activeDot={false}
            isAnimationActive={false}
          />
        </RechartsAreaChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsAreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="areaGradientAccent" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.15} />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
          </linearGradient>
        </defs>

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

        <Area
          type="monotone"
          dataKey={dataKey}
          stroke="#F59E0B"
          strokeWidth={2}
          fill="url(#areaGradientAccent)"
          dot={false}
          activeDot={{ r: 4, stroke: '#F59E0B', fill: '#FFFFFF', strokeWidth: 2 }}
          isAnimationActive={true}
          animationDuration={600}
          animationEasing="ease-out"
        />
      </RechartsAreaChart>
    </ResponsiveContainer>
  );
}
