'use client';

// ── Types ─────────────────────────────────────────────────────────────────────

interface BarListItem {
  label: string;
  value: number;
  bucket: '0-7d' | '7-14d' | '14-30d' | '30-45d' | '45d+';
}

interface BarListProps {
  data: BarListItem[];
}

// ── Bucket colour map ─────────────────────────────────────────────────────────
// Colours: MASTER.md Section 7 Bar List spec

const BUCKET_COLOURS: Record<BarListItem['bucket'], string> = {
  '0-7d':   'rgba(34, 197, 94, 0.80)',   // success 80%
  '7-14d':  'rgba(34, 197, 94, 0.60)',   // success 60%
  '14-30d': 'rgba(107, 114, 128, 0.80)', // neutral 80%
  '30-45d': 'rgba(245, 158, 11, 0.80)',  // warning 80%
  '45d+':   'rgba(239, 68, 68, 0.80)',   // danger 80%
};

// ── Component ─────────────────────────────────────────────────────────────────

export function BarList({ data }: BarListProps) {
  if (!data.length) return null;

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '100%',
      }}
    >
      {data.map((item, i) => {
        const widthPct = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
        const barColour = BUCKET_COLOURS[item.bucket];

        return (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
            }}
          >
            {/* Bucket label — fixed 80px */}
            <span
              style={{
                flexShrink: 0,
                width: '80px',
                fontSize: '13px',
                color: '#6B6B6B',
                fontFamily: 'var(--font-sans)',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </span>

            {/* Bar track */}
            <div
              style={{
                flex: 1,
                height: '24px',
                background: '#EDEDEB',
                borderRadius: '4px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${widthPct}%`,
                  background: barColour,
                  borderRadius: '4px',
                  transition: 'width 600ms cubic-bezier(0.4, 0, 0.2, 1) 200ms',
                }}
              />
            </div>

            {/* Count label — 4px gap from bar */}
            <span
              style={{
                flexShrink: 0,
                fontSize: '12px',
                color: '#1A1A1A',
                fontFamily: 'var(--font-mono)',
                fontVariantNumeric: 'tabular-nums',
                minWidth: '24px',
                textAlign: 'right',
              }}
            >
              {item.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
