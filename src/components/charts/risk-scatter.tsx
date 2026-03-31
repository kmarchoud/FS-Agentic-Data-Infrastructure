'use client';

import { useMemo, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ZAxis,
  Customized,
} from 'recharts';
import type { Client, ClientType } from '@/lib/mock-data';

interface RiskScatterProps {
  clients: Client[];
}

// ── Colour helpers ────────────────────────────────────────────────────────────

function getBubbleColour(riskScore: number, daysSinceContact: number): string {
  if (riskScore >= 55 && daysSinceContact >= 30) return 'var(--danger)';
  if (riskScore >= 55 || daysSinceContact >= 30) return 'var(--warning)';
  return 'var(--success)';
}

function getBubbleTextColour(riskScore: number, daysSinceContact: number): string {
  if (riskScore >= 55 && daysSinceContact >= 30) return '#DC2626';
  if (riskScore >= 55 || daysSinceContact >= 30) return '#B45309';
  return '#16A34A';
}

// ── Badge colours by client type ──────────────────────────────────────────────

const TYPE_BADGE: Record<ClientType, { bg: string; border: string; text: string }> = {
  'Pension Fund':   { bg: 'rgba(59,130,246,0.08)',  border: 'rgba(59,130,246,0.20)',  text: '#2563EB' },
  'Endowment':      { bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.20)',  text: '#7C3AED' },
  'Insurance':      { bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.20)',   text: '#0891B2' },
  'Wealth Manager': { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.20)',  text: '#059669' },
  'Platform':       { bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.20)',  text: '#B45309' },
  'Family Office':  { bg: 'rgba(236,72,153,0.08)',  border: 'rgba(236,72,153,0.20)',  text: '#DB2777' },
};

// ── Bubble sizing formula ─────────────────────────────────────────────────────

function getBubbleDiameter(aum: number, maxAum: number): number {
  // diameter = 8 + (sqrt(AUM) / sqrt(maxAUM)) * 40  → range ~12–48px
  return 8 + (Math.sqrt(aum) / Math.sqrt(maxAum)) * 40;
}

// ── Days since a date string ──────────────────────────────────────────────────

function daysSince(dateStr: string): number {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.floor(ms / (1000 * 60 * 60 * 24));
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

interface ScatterPoint {
  name: string;
  type: ClientType;
  aum: number;
  riskScore: number;
  daysSinceContact: number;
  diameter: number;
}

interface TooltipPayloadEntry {
  payload: ScatterPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadEntry[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  const badge = TYPE_BADGE[d.type];
  const riskColour = getBubbleTextColour(d.riskScore, d.daysSinceContact);
  const daysColour =
    d.daysSinceContact >= 45 ? '#DC2626' :
    d.daysSinceContact >= 20 ? '#B45309' :
    '#999999';

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1px solid #D4D4D0',
      borderRadius: '8px',
      padding: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      maxWidth: '220px',
      fontFamily: 'var(--font-sans)',
    }}>
      <p style={{ margin: '0 0 6px 0', fontSize: '14px', fontWeight: 600, color: '#1A1A1A', lineHeight: 1.3 }}>
        {d.name}
      </p>
      <span style={{
        display: 'inline-block',
        padding: '1px 8px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        background: badge.bg,
        border: `1px solid ${badge.border}`,
        color: badge.text,
        marginBottom: '10px',
      }}>
        {d.type}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {[
          { label: 'AUM',          value: `£${d.aum.toLocaleString()}m`, colour: '#1A1A1A' },
          { label: 'Risk Score',   value: String(d.riskScore),           colour: riskColour },
          { label: 'Last Contact', value: `${d.daysSinceContact}d ago`,  colour: daysColour },
        ].map(({ label, value, colour }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
            <span style={{ fontSize: '11px', color: '#999999', fontFamily: 'var(--font-mono)' }}>{label}</span>
            <span style={{ fontSize: '12px', color: colour, fontFamily: 'var(--font-mono)', fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Custom dot renderer ───────────────────────────────────────────────────────

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: ScatterPoint;
}

function CustomDot({ cx, cy, payload }: CustomDotProps) {
  const [hovered, setHovered] = useState(false);
  if (cx == null || cy == null || !payload) return null;

  const r = payload.diameter / 2;
  const colour = getBubbleColour(payload.riskScore, payload.daysSinceContact);

  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={colour}
      fillOpacity={hovered ? 1 : 0.65}
      stroke="#FFFFFF"
      strokeWidth={2}
      style={{
        cursor: 'pointer',
        transition: 'fill-opacity 150ms ease, filter 150ms ease',
        filter: hovered ? 'drop-shadow(0 2px 8px rgba(0,0,0,0.12))' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    />
  );
}

// ── Quadrant labels via Customized ────────────────────────────────────────────
// Recharts <Customized> receives the full xAxis/yAxis scale functions so we
// can convert data-space coordinates to pixel coordinates precisely.

interface QuadrantLabelsProps {
  xAxisMap?: Record<string, { scale: (v: number) => number }>;
  yAxisMap?: Record<string, { scale: (v: number) => number }>;
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

const QUADRANT_LABELS = [
  { label: 'Urgent Attention', x: 100, y: 80, anchor: 'end'   as const, colour: '#DC2626' },
  { label: 'Monitor',          x: 0,   y: 80, anchor: 'start' as const, colour: '#B45309' },
  { label: 'Watch',            x: 100, y: 0,  anchor: 'end'   as const, colour: '#B45309' },
  { label: 'Healthy',          x: 0,   y: 0,  anchor: 'start' as const, colour: '#16A34A' },
] as const;

function QuadrantLabels({ xAxisMap, yAxisMap }: QuadrantLabelsProps) {
  const xScale = xAxisMap ? Object.values(xAxisMap)[0]?.scale : null;
  const yScale = yAxisMap ? Object.values(yAxisMap)[0]?.scale : null;
  if (!xScale || !yScale) return null;

  const pad = 8;

  return (
    <g pointerEvents="none">
      {QUADRANT_LABELS.map(({ label, x, y, anchor, colour }) => {
        const px = xScale(x) + (anchor === 'end' ? -pad : pad);
        const py = yScale(y) + (y === 80 ? pad + 12 : -pad);
        return (
          <text
            key={label}
            x={px}
            y={py}
            textAnchor={anchor}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              fill: colour,
              opacity: 0.7,
              userSelect: 'none',
            }}
          >
            {label}
          </text>
        );
      })}
    </g>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function RiskScatter({ clients }: RiskScatterProps) {
  const maxAum = useMemo(
    () => Math.max(...clients.map((c) => c.aum)),
    [clients]
  );

  const scatterData = useMemo(
    () =>
      clients.map((c) => ({
        name: c.name,
        type: c.type,
        aum: c.aum,
        riskScore: c.riskScore,
        daysSinceContact: Math.min(daysSince(c.lastContactDate), 80),
        diameter: getBubbleDiameter(c.aum, maxAum),
      })),
    [clients, maxAum]
  );

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '8px',
      padding: '20px 20px 12px 20px',
      height: '380px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Chart header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          fontFamily: 'var(--font-sans)',
          letterSpacing: '-0.006em',
        }}>
          Client Risk Distribution
        </span>
        <span style={{
          fontSize: '11px',
          color: '#999999',
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.01em',
        }}>
          Bubble size = AUM · Hover for detail
        </span>
      </div>

      {/* Chart */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
            <CartesianGrid
              stroke="#F0F0EE"
              strokeOpacity={0.6}
              vertical={false}
            />

            <XAxis
              type="number"
              dataKey="riskScore"
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              tick={{ fontSize: 11, fill: '#999999', fontFamily: 'var(--font-mono)' }}
              axisLine={{ stroke: '#D4D4D0' }}
              tickLine={false}
              label={{
                value: 'Risk Score →',
                position: 'insideBottomRight',
                offset: -4,
                style: { fontSize: 11, fill: '#999999', fontFamily: 'var(--font-mono)' },
              }}
            />

            <YAxis
              type="number"
              dataKey="daysSinceContact"
              domain={[0, 80]}
              ticks={[0, 15, 30, 45, 60, 80]}
              tick={{ fontSize: 11, fill: '#999999', fontFamily: 'var(--font-mono)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => (v === 80 ? '80+' : String(v))}
              label={{
                value: 'Days Since Contact ↑',
                angle: -90,
                position: 'insideTopLeft',
                offset: 16,
                style: { fontSize: 11, fill: '#999999', fontFamily: 'var(--font-mono)' },
              }}
            />

            {/* ZAxis suppressed — sizing handled via custom dot renderer */}
            <ZAxis range={[0, 0]} />

            <Tooltip content={<CustomTooltip />} cursor={false} />

            {/* Quadrant divider — vertical at risk score 55 */}
            <ReferenceLine
              x={55}
              stroke="#E8E8E5"
              strokeOpacity={0.5}
              strokeDasharray="6 4"
              strokeWidth={1}
            />

            {/* Quadrant divider — horizontal at days since contact 30 */}
            <ReferenceLine
              y={30}
              stroke="#E8E8E5"
              strokeOpacity={0.5}
              strokeDasharray="6 4"
              strokeWidth={1}
            />

            {/* Quadrant labels — uses axis scales for pixel-accurate placement */}
            <Customized component={QuadrantLabels} />

            <Scatter
              data={scatterData}
              shape={<CustomDot />}
              isAnimationActive={true}
              animationDuration={600}
              animationEasing="ease-out"
            />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
