# Morning Brief — Visual Update Specification

> Branch: `feature/morning-brief-visuals`
> Scope: Morning Brief page components only
> Design authority: `design-system/MASTER.md`

---

## Pre-Delivery Checklist

- [ ] No emojis used as icons — all icons are Lucide or SVG
- [ ] `cursor-pointer` on all clickable elements (buttons, links, interactive rows)
- [ ] Hover transitions use `120ms ease` for interactions, `150ms ease` for card borders
- [ ] Skeleton loading states maintained for all async content
- [ ] `prefers-reduced-motion: reduce` respected — disable sparkline draw, fade animations, and transitions
- [ ] Amber count does not exceed 2 simultaneous (max 3 slots, 2 active at once)
- [ ] All numbers rendered in Geist Mono with `font-variant-numeric: tabular-nums`
- [ ] No prohibited animations: no shadows, no hover lift, no scale transforms, no bounce/elastic, no shimmer
- [ ] Responsive at 375px / 768px / 1024px / 1440px breakpoints
- [ ] Sparkline `isAnimationActive: false` per MASTER.md sparkline specification

---

## Change 1: Synthesis Sentence Promoted to Hero

**Current:** body-lg (16px) text below five market cards. Easy to miss.

**New:** Move ABOVE the five market cards.

**Typography:** 18px, font-weight 600, color `var(--text-primary)`, line-height 1.5, letter-spacing -0.01em.
This is between body-lg and page-title — a custom "hero-sentence" treatment.

**Rationale:** page-title (20px/600) is too large, body-lg (16px/500) too small. 18px/600 creates the right visual weight.

```
Container:
  padding: 0 0 20px 0
  margin-bottom: 0
  border-bottom: 1px solid var(--border-subtle)

Text:
  font-family: var(--font-sans)
  font-size: 18px
  font-weight: 600
  color: var(--text-primary)
  line-height: 1.5
  letter-spacing: -0.01em
  max-width: 900px
```

**Skeleton:** single line, height 18px, width 70%, `bg-subtle`, border-radius 4px, opacity fade animation.

**Section order becomes:** Page Header → Synthesis Sentence → Separator → Market Cards → rest of page.

---

## Change 2: Market Cards with Sparklines

### API Route Update

Update `/api/market-data` to fetch 7-day range:

```
GET https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?interval=1d&range=7d
```

Extract from response:

- `chart.result[0].indicators.quote[0].close` → array of closing prices
- `chart.result[0].timestamp` → array of unix timestamps
- Filter out null values from the close array

### Updated MarketDataPoint Interface

```typescript
interface MarketDataPoint {
  value: number;
  previousClose: number;
  delta: number;
  deltaPercent: number;
  timestamp: string;
  sparklineData: Array<{ time: number; value: number }> | null;
}
```

### Sparkline Spec

Applied to first 4 cards only (FTSE, Gilt, Sterling, Volatility). Top IA Sector card does NOT get a sparkline.

```
Container:
  margin-top: 8px
  height: 48px
  width: 100% (full card width minus padding — card padding is 16px so this is calc(100%))

Recharts component:
  <ResponsiveContainer width="100%" height={48}>
    <LineChart data={sparklineData} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
      <Line
        type="monotone"
        dataKey="value"
        stroke={trendColor}
        strokeWidth={1.5}
        dot={false}
        isAnimationActive={false}
      />
    </LineChart>
  </ResponsiveContainer>

Trend colour logic:
  const firstValue = sparklineData[0]?.value ?? 0;
  const lastValue = sparklineData[sparklineData.length - 1]?.value ?? 0;
  const trendColor = lastValue > firstValue
    ? "var(--success-text)"  // #16A34A emerald
    : lastValue < firstValue
    ? "var(--danger-text)"   // #DC2626 red
    : "var(--text-tertiary)" // #999999 flat
```

No area fill (unlike MASTER.md sparkline spec which uses amber area). This is intentional — sentiment-coloured lines without fill are cleaner for market data cards where the colour itself carries meaning.

If `sparklineData` is null or empty array: card renders without sparkline, no error, no empty space.

---

## Change 3: Impact Cards Visual Redesign

### Card Container (all sentiments)

```
Container:
  background: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: 8px
  padding: 20px
  border-left: 3px solid {sentiment-border-color}
  NO box-shadow
  hover: border-color var(--border-strong), transition 150ms ease

Sentiment border-left colours:
  positive: var(--success-text) #16A34A
  neutral:  var(--text-tertiary) #999999
  negative: var(--danger-text) #DC2626
```

### Card Header (unchanged from current)

Mandate name | Sentiment badge
Fund names | IA sector name

### Card Body — Row 1: Context Block

```
Container:
  display: grid
  grid-template-columns: 1fr 1fr
  gap: 16px
  background: var(--bg-raised)
  border-radius: 8px
  padding: 12px
  margin-top: 12px

Left column:
  Label: "WHAT HAPPENED"
    card-label style: 11px, font-medium, uppercase, tracking 0.06em, text-tertiary
    margin-bottom: 4px
  Content: body-sm (13px), text-secondary, line-height 1.5

Right column:
  Label: "WHY IT MATTERS"
    same card-label style
    margin-bottom: 4px
  Content: body-sm (13px), text-secondary, line-height 1.5
```

### Card Body — Row 2: Talking Angle (Hero Row)

```
Container:
  margin-top: 12px
  padding: 12px
  border-radius: 6px
  border-left: 3px solid {sentiment-talking-angle-border}

Sentiment variants:

  Positive (Favourable):
    background: var(--success-subtle)         // rgba(34,197,94,0.08)
    border-left-color: var(--success-text)    // #16A34A
    Label colour: var(--success-text)

  Negative (Headwind):
    background: var(--danger-subtle)          // rgba(239,68,68,0.08)
    border-left-color: var(--danger-text)     // #DC2626
    Label colour: var(--danger-text)

  Neutral:
    background: var(--bg-raised)              // #F3F3F1
    border-left-color: var(--text-tertiary)   // #999999
    Label colour: var(--text-tertiary)

Label: "TALKING ANGLE"
  card-label style but with sentiment colour (not text-tertiary)

Content:
  font-size: 13px (body-sm)
  font-weight: 500
  color: var(--text-secondary)
  line-height: 1.5
```

### Card Body — Row 3: Sector Flow Indicator

New subcomponent: `SectorFlowBar`

```
Container:
  margin-top: 12px
  display: flex
  align-items: center
  gap: 8px

Bar:
  height: 4px
  border-radius: 9999px
  background: var(--bg-subtle)  // track
  width: 100%
  max-width: 200px
  overflow: hidden

  Fill:
    height: 100%
    border-radius: 9999px
    width: {proportional to flow: Math.min(Math.abs(flow) / 500 * 100, 100)}%
    background: flow >= 0 ? var(--success-text) : var(--danger-text)

Label:
  font-family: var(--font-mono)
  font-size: 11px
  font-variant-numeric: tabular-nums
  color: var(--text-tertiary)
  white-space: nowrap
  Format: "+£275m · Feb 2026" or "-£839m · Feb 2026"
```

---

## Change 4: "Focus This Angle" → Secondary Button

**Current:** plain text link "Focus this angle" / "Show talking angle"

**New:** compact secondary button on non-primary cards only.

```
Button (non-primary cards):
  Label: "Make this today's angle"
  Style: secondary button, compact
    background: var(--bg-card)
    border: 1px solid var(--border)
    border-radius: 6px
    padding: 4px 10px
    font-size: 11px (caption size)
    font-weight: 500
    color: var(--text-secondary)
    cursor: pointer
    transition: all 120ms ease
    hover: border-color var(--border-strong), color var(--text-primary)

  Position: bottom-right of talking angle row
    display: flex, justify-content: flex-end, margin-top: 8px

Primary card: no button shown. The amber/sentiment treatment IS the signal.
```

---

## Change 5: Today's Talking Point Visual Treatment

### Section Header Changes

```
Old header: "This Week's Talking Point"
New header: "Today's Talking Point"
  section-heading style (14px, font-semibold, text-primary)

Old subtitle: "Ready to share with your team"
New subtitle: "Updated daily · Ready to share"
  body-sm (13px), text-tertiary
```

### Card Visual Treatment

```
Container:
  background: var(--bg-card)
  border: 1px solid var(--border)
  border-left: 3px solid var(--accent)    // amber left border — 1 amber slot
  border-radius: 8px
  padding: 24px
  NO box-shadow
  position: relative

Decorative quotation mark:
  content: "\u201C" (left double quotation mark)
  position: absolute
  top: 16px
  left: 20px
  font-size: 48px (text-5xl)
  font-family: Georgia, serif   // serif for traditional quotation aesthetic
  color: var(--accent)
  opacity: 0.2
  line-height: 1
  pointer-events: none
  user-select: none

Paragraph:
  padding-left: 16px          // offset from quotation mark
  font-size: 16px
  font-weight: 400
  color: var(--text-secondary)
  line-height: 1.7
  max-width: 800px
```

### Button and Metadata Updates

```
Copy button:
  Old label: "Copy"
  New label: "Copy talking point"
  On success: "Copied to clipboard ✓" for 2 seconds
  Style: primary amber button per MASTER.md Section 6h
  NOTE: this does NOT count as an amber slot — it is a standard primary button

Metadata line:
  Old: "Generated {date} {time} · Based on..."
  New: "Updated {date} {time} · Based on..."
  Same font-mono 11px text-tertiary styling
```

---

## Change 6: Outreach Table Priority Bars and Differentiators

### Priority Bar (per row)

```
Position: inside the Firm cell, left of the firm name
  display: flex, align-items: center, gap: 8px

Bar:
  width: 4px
  height: 32px
  border-radius: 9999px
  flex-shrink: 0

Colour by score:
  score >= 80: var(--success-text)     // #16A34A full intensity
  score >= 70: var(--success)          // #22C55E medium
  score >= 60: rgba(34,197,94,0.40)   // 40% opacity emerald
  score < 60:  var(--bg-subtle)        // #EDEDEB barely visible
```

### Secondary Differentiator Logic

Append to the WHY_THIS_WEEK text, separated by " · ":

```typescript
function getSecondaryDifferentiator(firm: RealIFAFirm): string {
  if (firm.brief_available && (firm as any).pension_transfers) {
    return " · pension transfer specialists";
  }
  if (firm.brief_available && (firm as any).manages_investments) {
    return " · runs in-house DFM";
  }
  if ((firm.review_count ?? 0) > 1000) {
    return " · high VouchedFor presence";
  }
  // pimfa_member not available in current data — skip
  return "";
}
```

Result example: "Gilt yield story — cautious drawdown clients · pension transfer specialists"

---

## Amber Budget Audit (Updated)

| Slot | Element | When Active | Notes |
|------|---------|-------------|-------|
| 1 | Primary impact card talking angle | Default state | Uses sentiment colour, NOT amber. Only amber when amber-context owner is 'impact-card' |
| 2 | Today's Talking Point left border | Always | Structural amber, always present |
| 3 | BriefSlideOver OPENING LINE | When slide-over open | Amber treatment on opening line section |

**Simultaneous amber accounting:**

Default state (no slide-over):

- Talking Point border (slot 2) = 1 amber
- Impact card talking angle uses SENTIMENT colours (emerald/red/grey), not amber = 0 amber
- **Total: 1 amber**

Slide-over open:

- Talking Point border (slot 2) = 1 amber
- OPENING LINE in slide-over (slot 3) = 1 amber
- **Total: 2 amber**

**Maximum simultaneous: 2.** Well within the 3-slot budget.

Note: The impact card talking angle redesign (Change 3) uses sentiment colours (success-subtle, danger-subtle, bg-raised) instead of amber. This frees up an amber slot compared to the previous design. The amber-context system can be simplified since the impact cards no longer compete for amber.

---

## Updated Interfaces

```typescript
// MarketDataPoint — updated with sparklineData
interface MarketDataPoint {
  value: number;
  previousClose: number;
  delta: number;
  deltaPercent: number;
  timestamp: string;
  sparklineData: Array<{ time: number; value: number }> | null;
}

// SectorFlowBar props
interface SectorFlowBarProps {
  flow: number;          // net_retail_sales_gbpm
  month: string;         // "2026-02"
  maxFlow?: number;      // scale reference, default 500
}
```

---

## Component Updates Summary

| Component | Changes |
|-----------|---------|
| MarketPulse.tsx | Move synthesis sentence above cards grid |
| MarketCard.tsx | Add sparkline via Recharts, receive sparklineData prop |
| ImpactCard.tsx | New 3-row layout: context block + talking angle hero + flow bar |
| TalkingAngle.tsx | Use sentiment colours instead of amber. Add "Make this today's angle" button |
| NEW: SectorFlowBar.tsx | Mini proportional bar for IA sector flow |
| TalkingPoint.tsx | Rename, add left border, decorative quote mark, update button/metadata labels |
| OutreachRow.tsx | Add priority bar, append secondary differentiator to WHY_THIS_WEEK |
| /api/market-data/route.ts | Change range=5d to range=7d, extract sparklineData from close array |

---

## Files NOT to Touch

- `design-system/MASTER.md`
- `lib/mock-data.ts`
- `lib/data/ifa-real-data.ts`
- `app/intelligence/ifa-prioritisation/page.tsx`
- `components/dashboard/sidebar.tsx`
- `components/dashboard/topbar.tsx`
- All other pages and components not listed above
- Loading states (keep existing skeletons)
- Error states
