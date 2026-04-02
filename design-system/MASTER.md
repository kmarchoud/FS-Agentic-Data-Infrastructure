# Regulex Intelligence — Design System

> Single source of truth. Every value is final.
> Implementation agents: execute verbatim. If a value is missing, stop and ask.

---

## SECTION 1: DESIGN PHILOSOPHY

Regulex Intelligence is a light, minimal, quietly confident product for institutional distribution professionals. It must feel like opening the most organised tool you own — calm, precise, and certain. Like Linear's restraint crossed with the data authority of Stripe's dashboard, built for someone managing £15 billion in client assets.

**Core register:** Institutional calm. Private-bank composure. The interface recedes; the data speaks.

**Must feel like:** A senior distribution professional's private terminal. Clean. Authoritative. The kind of product where you trust the numbers because the typography is that good.

**Must never feel like:** Dark mode. Startup energy. A consumer fintech app. A colourful admin panel. AI-generated. A Bloomberg terminal. Dramatic. Busy.

**Three non-negotiable rules:**
1. White surfaces with hairline borders — no card shadows on light backgrounds. Shadows are for dark UIs. Depth comes from border and surface tonal shift.
2. Amber appears in a maximum of three places per page. It is the brand accent — surgical, never decorative.
3. Every number, timestamp, currency value, and percentage in the entire product uses Geist Mono with `font-variant-numeric: tabular-nums`. No exceptions.

---

## SECTION 2: COLOUR SYSTEM

### Surface Hierarchy

| Token | Hex | CSS Variable | Tailwind | Usage | Never |
|-------|-----|-------------|----------|-------|-------|
| Page background | `#F8F8F6` | `--bg-page` | `bg-page` | Html body, page canvas, sidebar background | Never use as card background |
| Card surface | `#FFFFFF` | `--bg-card` | `bg-card` | Cards, panels, top bar, modal backgrounds, table containers | Never use for page background |
| Raised surface | `#F3F3F1` | `--bg-raised` | `bg-raised` | Input fields, active table rows, hover states, code blocks, dropdown menus | Never use as primary card surface |
| Subtle background | `#EDEDEB` | `--bg-subtle` | `bg-subtle` | Section backgrounds within cards, kbd elements, skeleton loaders | Only inside cards or as secondary surface |

### Borders

| Token | Hex | CSS Variable | Tailwind | Usage | Never |
|-------|-----|-------------|----------|-------|-------|
| Default border | `#E8E8E5` | `--border` | `border-border` | Card borders, input borders, sidebar right border, top bar bottom border | Never use for strong separators |
| Strong border | `#D4D4D0` | `--border-strong` | `border-strong` | Table header bottom, dividers between major sections, active input borders | Sparingly — most borders use default |
| Subtle border | `#F0F0EE` | `--border-subtle` | `border-subtle` | Table row separators, inner card dividers, the lightest possible border | Never use as primary container border |

### Text

| Token | Hex | CSS Variable | Tailwind | Usage | Never |
|-------|-----|-------------|----------|-------|-------|
| Primary text | `#1A1A1A` | `--text-primary` | `text-primary` | Headings, stat values, client names, nav active, table primary data | Never for body paragraphs |
| Secondary text | `#6B6B6B` | `--text-secondary` | `text-secondary` | Body text, descriptions, nav default items, table text cells | Never for headings or stat values |
| Tertiary text | `#999999` | `--text-tertiary` | `text-tertiary` | Timestamps, captions, placeholders, helper text, axis labels, muted labels | Never for readable body content |
| Disabled text | `#C4C4C4` | `--text-disabled` | `text-disabled` | Disabled inputs, inactive controls | Only for disabled states |

### Accent (Amber)

| Token | Hex | CSS Variable | Tailwind | Usage | Never |
|-------|-----|-------------|----------|-------|-------|
| Accent | `#F59E0B` | `--accent` | `text-accent` / `bg-accent` | Primary CTA, active nav indicator, Revenue at Risk card top border, notification dot, logo square. Max 3 uses per page. | Never as general highlight. Never on more than 3 elements per view. |
| Accent hover | `#D97706` | `--accent-hover` | `bg-accent-hover` | Button hover state, link hover | Only on interactive hover |
| Accent subtle | `rgba(245, 158, 11, 0.08)` | `--accent-subtle` | `bg-accent-subtle` | Amber badge backgrounds, Revenue at Risk card label background | Never as text colour. Never as large surface fill. |

### Semantic Status

| Token | Hex | Subtle | Text (AA on white) | CSS Variables | Usage |
|-------|-----|--------|-------------------|--------------|-------|
| Danger | `#EF4444` | `rgba(239, 68, 68, 0.08)` | `#DC2626` | `--danger` / `--danger-subtle` / `--danger-text` | Risk >65, negative flows, urgent contacts, outflows |
| Success | `#22C55E` | `rgba(34, 197, 94, 0.08)` | `#16A34A` | `--success` / `--success-subtle` / `--success-text` | Positive flows, opportunity, risk <40, recent contact |
| Warning | `#F59E0B` | `rgba(245, 158, 11, 0.08)` | `#B45309` | `--warning` / `--warning-subtle` / `--warning-text` | Medium risk (40-65), 20-45 day contacts, approaching thresholds |
| Neutral | `#6B7280` | `rgba(107, 114, 128, 0.08)` | `#4B5563` | `--neutral` / `--neutral-subtle` / `--neutral-text` | Stable status, default states, no-change deltas |

### Client Type Badge Palette

| Client Type | Background | Border | Text | CSS Prefix |
|-------------|-----------|--------|------|------------|
| Pension Fund | `rgba(59, 130, 246, 0.08)` | `rgba(59, 130, 246, 0.20)` | `#2563EB` | `--badge-pension` |
| Endowment | `rgba(139, 92, 246, 0.08)` | `rgba(139, 92, 246, 0.20)` | `#7C3AED` | `--badge-endowment` |
| Insurance | `rgba(6, 182, 212, 0.08)` | `rgba(6, 182, 212, 0.20)` | `#0891B2` | `--badge-insurance` |
| Wealth Manager | `rgba(16, 185, 129, 0.08)` | `rgba(16, 185, 129, 0.20)` | `#059669` | `--badge-wealth` |
| Platform | `rgba(245, 158, 11, 0.08)` | `rgba(245, 158, 11, 0.20)` | `#B45309` | `--badge-platform` |
| Family Office | `rgba(236, 72, 153, 0.08)` | `rgba(236, 72, 153, 0.20)` | `#DB2777` | `--badge-family` |

### Chart Series Palette

| Series | Hex | Usage |
|--------|-----|-------|
| 1 (Primary) | `#F59E0B` | Amber — Meridian brand, primary series, area fills |
| 2 | `#3B82F6` | Blue — second series, endowment flows |
| 3 | `#8B5CF6` | Purple — third series |
| 4 | `#10B981` | Emerald — fourth series, positive data |
| 5 | `#EC4899` | Pink — fifth series |

### Risk Scatter Plot Colours

```
Danger zone (riskScore ≥ 55 AND daysSinceContact ≥ 30):
  fill: var(--danger) at 65% opacity

Warning zone (riskScore ≥ 55 OR daysSinceContact ≥ 30, but not both):
  fill: var(--warning) at 65% opacity

Safe zone (riskScore < 55 AND daysSinceContact < 30):
  fill: var(--success) at 65% opacity

All bubbles: stroke 2px white (#FFFFFF), creates separation on overlap
```

---

## SECTION 3: TYPOGRAPHY

### Font Installation

```bash
npm install geist
```

```tsx
// layout.tsx
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';

// Apply to <html>:
<html className={`${GeistSans.variable} ${GeistMono.variable}`}>
```

```css
/* CSS variables set by the geist package */
--font-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
```

### Geist Mono Mandatory Usage

Geist Mono with `tabular-nums` **must** be used for:
- Currency values: `£14.83bn`, `-£127m`, `£892m`
- Percentages: `+3.1%`, `-1.7%`, `42%`
- Dates and timestamps: `Mar 29`, `34d ago`, `08:15`, `2m ago`
- Scores and counts: `72`, `127`, `89`, `4`
- Risk scores, deltas, progress values
- Chart axis labels and tooltip values

Geist Mono **must not** be used for: headings, labels, descriptions, navigation items, button text, badge text, body copy.

### Type Scale

| Name | Font | Size | Weight | Line-height | Letter-spacing | Tailwind Class | Used For |
|------|------|------|--------|-------------|----------------|---------------|----------|
| `page-title` | Geist Sans | 1.25rem (20px) | 600 | 1.4 | -0.01em | `text-xl font-semibold tracking-tight` | Page headings: Morning Brief, Priority Queue, etc. |
| `section-heading` | Geist Sans | 0.875rem (14px) | 600 | 1.4 | -0.006em | `text-sm font-semibold` | Card headers, section labels, panel titles |
| `card-label` | Geist Sans | 0.6875rem (11px) | 500 | 1.0 | 0.06em | `text-[11px] font-medium uppercase tracking-[0.06em]` | Stat card labels, table column headers, section sub-labels. Always uppercase. |
| `body` | Geist Sans | 0.875rem (14px) | 400 | 1.6 | 0 | `text-sm` | Client insight text, feed headlines, general content |
| `body-sm` | Geist Sans | 0.8125rem (13px) | 400 | 1.5 | 0 | `text-[13px]` | Secondary descriptions, nav items, badge support text |
| `caption` | Geist Mono | 0.6875rem (11px) | 400 | 1.3 | 0.01em | `font-mono text-[11px] tabular-nums` | Timestamps, sync indicators, footnotes, chart axis labels |
| `data-xl` | Geist Mono | 1.5rem (24px) | 600 | 1.2 | -0.02em | `font-mono text-2xl font-semibold tabular-nums tracking-tight` | Stat card primary values: £14.83bn, −£127m |
| `data-lg` | Geist Mono | 0.875rem (14px) | 500 | 1.4 | 0 | `font-mono text-sm font-medium tabular-nums` | Table AUM values, risk scores as numbers, client card AUM |
| `data-sm` | Geist Mono | 0.75rem (12px) | 400 | 1.3 | 0.01em | `font-mono text-xs tabular-nums` | Deltas (+1.2%), small counts, chart labels, days since contact |
| `badge-text` | Geist Sans | 0.6875rem (11px) | 600 | 1.0 | 0.04em | `text-[11px] font-semibold uppercase tracking-wide` | All badge labels. Always uppercase. |

---

## SECTION 4: SPACING AND LAYOUT

### Base Grid: 8px

| Value | Pixels | Tailwind | Primary Usage |
|-------|--------|----------|---------------|
| 1 | 4px | `p-1` / `gap-1` | Icon-text inline gap, badge vertical padding |
| 1.5 | 6px | `p-1.5` | Badge horizontal padding |
| 2 | 8px | `p-2` / `gap-2` | Tight component spacing, small gaps |
| 2.5 | 10px | `p-2.5` | Data source strip vertical padding |
| 3 | 12px | `p-3` / `gap-3` | Gaps between rows inside cards, nav item padding |
| 4 | 16px | `p-4` / `gap-4` | Standard card padding, stat card gaps, table cell padding |
| 5 | 20px | `p-5` / `gap-5` | Client card padding, comfortable card padding |
| 6 | 24px | `p-6` / `gap-6` | Page content padding, major section gaps, tab bar gap |
| 8 | 32px | `gap-8` | Gap between major page sections |

### Layout Constants

| Element | Value | Tailwind |
|---------|-------|----------|
| Sidebar width | 240px | `w-60` |
| Top bar height | 52px | `h-13` (custom) or `h-[52px]` |
| Page content horizontal padding | 24px | `px-6` |
| Card padding (standard) | 20px | `p-5` |
| Card padding (compact/stat) | 16px | `p-4` |
| Card border-radius | 8px | `rounded-lg` |
| Badge border-radius | 9999px | `rounded-full` |
| Button border-radius | 6px | `rounded-md` |
| Input border-radius | 6px | `rounded-md` |
| Stat card gap | 16px | `gap-4` |
| Section gap (vertical) | 32px | `gap-8` |
| Client card gap (vertical) | 12px | `gap-3` |
| Table cell padding | 12px horizontal, 10px vertical | `px-3 py-2.5` |
| Maximum content width | 1440px | `max-w-[1440px]` |
| Sidebar nav item padding | 8px 12px | `px-3 py-2` |
| Sidebar nav item border-radius | 6px | `rounded-md` |
| Sidebar nav item horizontal margin | 8px | `mx-2` |

---

## SECTION 5: THE HERO CHART — CLIENT RISK SCATTER PLOT

### Purpose

The most important visual in the product. A Head of Distribution looks at this and sees the health of their entire client book in 10 seconds. Every client plotted as a bubble. Immediately identifies which relationships are in the danger zone.

### Container

```
Height: 380px
Background: var(--bg-card)
Border: 1px solid var(--border)
Border-radius: 8px
Padding: 20px top, 20px right, 12px bottom, 20px left
```

### Chart Header (inside container, above plot)

```
Left: "Client Risk Distribution" — section-heading style
Right: "Bubble size = AUM · Hover for detail" — caption, text-tertiary
Margin-bottom: 16px
```

### Axes

```
X axis:
  Label: "Risk Score →"
  Range: 0–100
  Ticks: 0, 25, 50, 75, 100
  Font: Geist Mono, 11px (caption), text-tertiary
  Axis line: 1px var(--border-strong)
  Tick line: hidden

Y axis:
  Label: "Days Since Contact ↑"
  Range: 0–80 (values above 80 display as "80+")
  Ticks: 0, 15, 30, 45, 60, 80
  Font: Geist Mono, 11px (caption), text-tertiary
  Axis line: hidden
  Tick line: hidden
```

### Grid Lines

```
Horizontal only
Stroke: var(--border-subtle)
Stroke opacity: 0.6
Stroke dasharray: none (solid, barely visible)
```

### Quadrant System

```
Dividers: dashed lines, var(--border), opacity 0.5
  Vertical at risk score = 55
  Horizontal at days since contact = 30
Stroke dasharray: "6 4"

Quadrant labels (positioned in corners of each quadrant):
  Top-right: "Urgent Attention" — data-sm, var(--danger-text), opacity 0.7
  Top-left: "Monitor" — data-sm, var(--warning-text), opacity 0.7
  Bottom-right: "Watch" — data-sm, var(--warning-text), opacity 0.7
  Bottom-left: "Healthy" — data-sm, var(--success-text), opacity 0.7

Each label: positioned 8px from nearest quadrant corner
```

### Bubble Sizing

```
Formula: diameter = 8 + (sqrt(AUM_in_millions) / sqrt(max_AUM_in_millions)) * 40
  Min diameter: 12px (smallest AUM client, e.g. £178m)
  Max diameter: 48px (largest AUM client, e.g. £1,200m)
  Scale: sqrt-proportional (prevents large clients from dominating)

Bubble stroke: 2px solid #FFFFFF
Bubble fill opacity: 65%
```

### Bubble Colour Logic

```javascript
function getBubbleColour(riskScore: number, daysSinceContact: number): string {
  if (riskScore >= 55 && daysSinceContact >= 30) return 'var(--danger)';
  if (riskScore >= 55 || daysSinceContact >= 30) return 'var(--warning)';
  return 'var(--success)';
}
```

### Client Positions (Meridian Dataset)

| Client | Risk | Days | AUM £m | Quadrant | Colour |
|--------|------|------|--------|----------|--------|
| Phoenix Group | 91 | 72 | 760 | Urgent Attention | Danger |
| Aviva Staff Pension | 85 | 61 | 1,200 | Urgent Attention | Danger |
| Lancashire Pension | 78 | 34 | 892 | Urgent Attention | Danger |
| West Midlands | 67 | 47 | 510 | Urgent Attention | Danger |
| Scottish Widows | 62 | 41 | 380 | Monitor | Warning |
| Church of England | 54 | 29 | 267 | Watch | Warning |
| Wellcome Trust | 45 | 19 | 334 | Healthy | Success |
| Hargreaves Lansdown | 38 | 14 | 420 | Healthy | Success |
| St James's Place | 31 | 3 | 680 | Healthy | Success |
| Rathbones | 28 | 11 | 290 | Healthy | Success |
| Cambridge Endowment | 22 | 8 | 445 | Healthy | Success |
| Caledonian Family Office | 19 | 5 | 178 | Healthy | Success |

### Hover State

```
Hovered bubble:
  Opacity: 100% (from 65%)
  Drop shadow: 0 2px 8px rgba(0,0,0,0.12)
  Transition: all 150ms ease

Tooltip:
  Background: var(--bg-card)
  Border: 1px solid var(--border-strong)
  Border-radius: 8px
  Padding: 12px
  Box-shadow: 0 4px 12px rgba(0,0,0,0.08)
  Max-width: 220px

  Line 1: Client name — body, font-semibold, text-primary
  Line 2: Client type badge (see badge spec)
  Line 3: "AUM" label (caption, text-tertiary) + value (data-sm, Geist Mono, text-primary)
  Line 4: "Risk Score" label + value (coloured by threshold)
  Line 5: "Last Contact" label + days value (coloured by threshold)
```

### Load Animation

```
Bubbles animate in with scale: 0 → 1
Order: largest AUM first
Stagger: 30ms between bubbles
Duration: 250ms per bubble
Easing: spring (stiffness: 200, damping: 20)
```

---

## SECTION 6: COMPONENT SPECIFICATIONS

### 6a) Sidebar

```
Container:
  width: 240px (w-60)
  background: var(--bg-page) — same as page, NOT white
  border-right: 1px solid var(--border)
  position: fixed, top: 0, left: 0, height: 100vh
  display: flex, flex-direction: column
  z-index: 30

Logo zone:
  height: 52px (matches top bar)
  display: flex, align-items: center
  padding: 0 20px
  border-bottom: 1px solid var(--border)

  Amber square: 20px × 20px, bg var(--accent), border-radius 4px
  Gap: 8px
  "Regulex": body (14px), font-semibold, text-primary
  No "Intelligence". No "Powered by". The product IS Regulex.

Nav section labels:
  text: card-label style (11px, font-medium, uppercase, tracking 0.06em)
  color: var(--text-tertiary)
  padding: 0 16px
  margin: 20px 0 4px 0

Nav item — default:
  padding: 8px 12px
  margin: 0 8px
  border-radius: 6px
  font: body-sm (13px), font-weight 400
  color: var(--text-secondary)
  icon: 16px, strokeWidth 1.5, color var(--text-tertiary)
  gap: 8px (icon to label)
  transition: all 120ms ease
  border-left: 2px solid transparent

Nav item — hover:
  background: var(--bg-raised)
  color: var(--text-primary)
  icon color: var(--text-secondary)

Nav item — active:
  background: var(--bg-raised)
  color: var(--text-primary)
  font-weight: 500
  icon color: var(--text-primary)
  border-left: 2px solid var(--accent)

  This is the Linear approach: weight change + surface + amber bar.
  No colour fill. No amber background.

Nav items:
  Section "OVERVIEW":
    Morning Brief (LayoutDashboard icon, href /)
  Section "INTELLIGENCE":
    Priority Queue (AlertTriangle, /priorities)
    Client Intelligence (Users, /clients)
    Flow Intelligence (TrendingUp, /flows)
    RFP Intelligence (FileText, /rfp)
  Section "SYSTEM":
    Settings (Settings, /settings)

User block (bottom of sidebar):
  border-top: 1px solid var(--border)
  padding: 12px 16px
  display: flex, align-items: center, gap: 12px

  Avatar: 32px circle, bg var(--bg-raised),
    initials "JW" in caption style, text-secondary, font-medium
  Name: body-sm, text-primary, font-medium — "James Whitfield"
  Role: caption (11px), text-tertiary — "Head of Distribution"

  Settings gear icon: 16px, text-tertiary, ml-auto
    hover: text-secondary
```

### 6b) Top Bar

```
Container:
  height: 52px
  background: var(--bg-card)
  border-bottom: 1px solid var(--border)
  padding: 0 24px
  display: flex, align-items: center, justify-content: space-between
  position: sticky, top: 0, z-index: 20

Left slot:
  Page title: page-title style (20px, font-semibold, text-primary, tracking-tight)

Right slot: flex, align-items: center, gap: 16px
  Live date/time: caption style (Geist Mono, 11px, text-tertiary)
    Format: "Mon 31 Mar · 08:15"
    Updates every 60 seconds

  Search icon: 18px, text-tertiary, hover text-secondary
    transition: color 120ms ease

  Bell icon: 18px, text-tertiary, hover text-secondary
    Notification dot: 7px circle, bg var(--accent)
    Position: absolute, top: -1px, right: -1px
    Visible only when notification count > 0

  Avatar: 32px circle, bg var(--bg-raised)
    Initials "JW" in caption style, text-secondary
```

### 6c) Stat Cards

```
Layout: 6 cards in CSS grid, grid-cols-6, gap-4

Container:
  background: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: 8px
  padding: 16px
  NO box-shadow

Label row:
  display: flex, align-items: center, gap: 6px
  Icon: 16px lucide icon, text-tertiary
  Text: card-label style (11px, font-medium, uppercase, tracking 0.06em, text-tertiary)
  margin-bottom: 8px

Value row:
  font: data-xl (Geist Mono, 24px, font-semibold, tabular-nums)
  color: var(--text-primary)
  Animate: useCountUp hook on mount (900ms, cubic ease-out)

Delta row (optional):
  margin-top: 4px
  font: data-sm (Geist Mono, 12px, tabular-nums)
  Positive: var(--success-text), "↑ " prefix
  Negative: var(--danger-text), "↓ " prefix
  Neutral: var(--text-tertiary)

Revenue at Risk card (special treatment):
  border-top: 2px solid var(--accent) (replaces default 1px top border)
  Label text colour: var(--accent) instead of text-tertiary
  Label icon colour: var(--accent) instead of text-tertiary
  Value: same data-xl as other cards
  This card draws the eye. One of the max-3 amber uses per page.

Hover (all cards):
  border-color: var(--border-strong)
  transition: border-color 150ms ease
```

### 6d) Data Source Status Strip

```
Container:
  NOT a card. A flush horizontal bar.
  padding: 10px 20px
  background: var(--bg-card)
  border-top: 1px solid var(--border)
  border-bottom: 1px solid var(--border)
  display: flex, align-items: center
  Sits between stat cards and hero chart. Flush to card edges.

Label:
  "DATA SOURCES" — card-label style, text-tertiary
  margin-right: 20px
  flex-shrink: 0

Source items: flex, divide-x divide-border
  Each item: padding 0 20px (first item padding-left 0)
  display: flex, align-items: center, gap: 8px

  Status dot: 6px circle (w-1.5, h-1.5, rounded-full)
    Connected: bg var(--success), animation: pulse-dot 2.2s ease-in-out infinite
    Stale: bg var(--warning), no animation
    Disconnected: bg var(--text-disabled), no animation

  Source name: body-sm (13px), text-secondary
  Sync time: caption (Geist Mono, 11px), text-tertiary

Sources: CRM, PMS, Market Data, Compliance, Research
```

### 6e) Priority Client Cards

```
Container:
  background: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: 8px
  padding: 20px
  transition: border-color 150ms ease

  Hover: border-color var(--border-strong)
  No shadow. No background change.

Urgent variant (riskScore > 75 AND mandateRenewal < 60 days):
  border-left: 3px solid var(--danger)
  padding-left: 17px (20px - 3px to compensate)
  Everything else identical.

Layout: 4 rows, gap-3 (12px)

Row 1 — Header:
  display: flex, justify-content: space-between, align-items: flex-start
  Left: client name (body, font-semibold, text-primary) + type badge (gap-2)
  Right column (text-right):
    Days since contact: data-sm, Geist Mono
      >45 days: var(--danger-text)
      20-45 days: var(--warning-text)
      <20 days: var(--text-tertiary)
      Format: "34d ago"
    Mandate renewal (if ≤90 days): caption, text-tertiary
      Format: "Renewal: 29 Apr"

Row 2 — Metrics:
  display: flex, items-center, gap: 12px
  AUM: data-lg (Geist Mono, 14px, font-medium, text-primary) — "£892m"
  AUM delta: data-sm, Geist Mono, coloured — "+2.4%" or "-1.7%"
  Separator: · (text-tertiary)
  RM: 20px circle avatar (bg-raised, initials caption) + body-sm text-tertiary name

Row 3 — Insight:
  body-sm (13px), text-secondary
  max 2 lines: line-clamp-2, overflow hidden

Row 4 — Risk + Action:
  display: flex, items-center, gap: 12px

  "RISK" label: card-label style, text-tertiary
  Risk bar: flex-1, 3px height, rounded-full
    Track: bg var(--bg-raised)
    Fill: width = score%, coloured by threshold
      >65: var(--danger)
      40-65: var(--warning)
      <40: var(--success)
    CSS: transition width 600ms cubic-bezier(0.4,0,0.2,1) 200ms
  Score number: data-sm, Geist Mono, coloured by threshold

  "Prepare Brief" button:
    body-sm, text-secondary
    bg var(--bg-raised), hover bg var(--bg-subtle)
    padding: 4px 12px, border-radius: 6px
    border: 1px solid var(--border)
    transition: all 120ms ease
    ChevronRight icon 12px after text
    Links to /clients/[id]

Stagger animation:
  Each card: animation-delay = index × 60ms
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  animation: fadeSlideIn 0.2s ease-out both;
```

### 6f) Data Tables

```
Container: no outer card. Table sits on --bg-page directly.

<thead>:
  position: sticky, top: 0, z-index: 10
  background: var(--bg-page)

  <th>:
    padding: 10px 12px
    text: card-label style (11px, font-medium, uppercase, tracking 0.06em, text-tertiary)
    border-bottom: 1px solid var(--border-strong)
    text-align: left (text columns), right (number columns)

  Sort indicator: ChevronUp/Down 12px, text-tertiary
    Active sort: text-primary

<tbody>:
  <tr>:
    border-bottom: 1px solid var(--border-subtle)
    transition: background-color 100ms ease

    Hover: background var(--bg-raised)

    Alert row (risk >75 AND renewal <60d):
      border-left: 2px solid var(--danger)

  <td> text cells: body-sm, text-secondary, padding 10px 12px
  <td> number cells: data-sm or data-lg, Geist Mono, text-primary,
    text-align: right, padding 10px 12px

  Last contact cell:
    >45 days: var(--danger-text), Geist Mono
    20-45 days: var(--warning-text), Geist Mono
    <20 days: var(--text-tertiary), Geist Mono

  Risk score column:
    Inline bar (60px wide, 3px height) + score number
    Same colours as client card risk bar

  Priority rank: data-sm, Geist Mono, text-tertiary (muted — context not content)

No zebra striping. One hover state does the job.
```

### 6g) Badge System

```
Base badge:
  display: inline-flex, align-items: center
  padding: 2px 8px (py-0.5 px-2)
  border-radius: 9999px (rounded-full)
  font: badge-text (11px, font-semibold, uppercase, tracking-wide)
  border: 1px solid [per type]

Status badges:
  URGENT: bg var(--danger-subtle), border rgba(239,68,68,0.20), text var(--danger-text)
  AT RISK: bg var(--warning-subtle), border rgba(245,158,11,0.20), text var(--warning-text)
  STABLE: bg var(--neutral-subtle), border rgba(107,114,128,0.20), text var(--neutral-text)
  OPPORTUNITY: bg var(--success-subtle), border rgba(34,197,94,0.20), text var(--success-text)

Client type badges: see Client Type Badge Palette in Section 2.
  Each uses its --badge-[type]-bg, --badge-[type]-border, --badge-[type]-text

RM badges:
  bg var(--bg-raised), border 1px var(--border), text var(--text-secondary)
```

### 6h) Buttons

```
Primary (amber — used sparingly):
  background: var(--accent)
  color: white
  font: body-sm (13px), font-medium
  padding: 8px 16px
  border-radius: 6px
  transition: background-color 120ms ease
  hover: background var(--accent-hover)
  active: opacity 0.9
  disabled: opacity 0.5, cursor not-allowed
  focus-visible: ring-2 ring-accent ring-offset-2 ring-offset-bg-page

Secondary:
  background: var(--bg-card)
  color: var(--text-secondary)
  font: body-sm (13px), font-medium
  padding: 8px 16px
  border-radius: 6px
  border: 1px solid var(--border)
  transition: all 120ms ease
  hover: border-color var(--border-strong), color var(--text-primary)

Ghost:
  background: transparent
  color: var(--text-secondary)
  font: body-sm (13px), font-medium
  padding: 8px 12px
  border-radius: 6px
  transition: all 120ms ease
  hover: background var(--bg-raised), color var(--text-primary)

Destructive:
  background: var(--danger)
  color: white
  Same dimensions as primary
  hover: opacity 0.9
```

### 6i) Tabs (Client Detail, 5 tabs)

```
Tab bar:
  border-bottom: 1px solid var(--border)
  display: flex
  gap: 24px (gap-6)
  margin-bottom: 24px

Tab — default:
  body-sm (13px), text-tertiary
  padding-bottom: 12px
  border-bottom: 2px solid transparent
  margin-bottom: -1px (overlaps container border)
  cursor: pointer
  transition: color 120ms ease

Tab — hover:
  color: var(--text-secondary)

Tab — active:
  color: var(--text-primary)
  font-weight: 500
  border-bottom-color: var(--accent)

Tabs: Overview, Timeline, Engagement, Intelligence, Pre-Meeting Brief
```

### 6j) Risk Bar (standalone)

```
Track:
  height: 3px
  border-radius: 9999px
  background: var(--bg-raised)
  width: 60px (in tables) or 100% or flex-1

Fill:
  border-radius: 9999px
  transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1)
  Delay: 200ms on mount

  Score 0-39: var(--success)
  Score 40-65: var(--warning)
  Score 66-100: var(--danger)

Score number: data-sm, Geist Mono, same colour as fill bar
```

### 6k) Timeline Entries

```
Container: relative (for vertical line)
  padding-left: 24px

Vertical line:
  position: absolute, left: 7px, top: 0, bottom: 0
  width: 1px
  background: var(--border)

Entry: relative, padding-bottom: 24px
  Last entry: padding-bottom: 0

Dot: 14px circle
  position: absolute, left: -24px (aligns with line), top: 4px
  background: var(--bg-card)
  border: 2px solid var(--border-strong)

  Type-specific fill (6px inner circle or border override):
    Meeting: bg var(--accent) (filled amber dot)
    Call: border-color var(--success)
    Email: border-color var(--neutral)
    Report Sent: border-color var(--warning)
    RFP Response: border-color var(--accent)

Content: margin-left: 4px (total offset from dot edge)
  Date: caption (Geist Mono, 11px, text-tertiary)
  Type badge: inline badge per Section 6g
  Contact: body-sm, text-tertiary, italic — "with [name]"
  Description: body-sm, text-secondary, margin-top: 4px
  Outcome: body-sm, text-tertiary, italic, margin-top: 2px
```

### 6l) RFP Pipeline Cards

```
Container:
  background: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: 8px
  padding: 16px

Header: flex, justify-between, items-center
  Client name: body (14px), font-semibold, text-primary
  Mandate type badge: per Section 6g

Details row: flex, gap-12, margin-top: 8px
  AUM estimate: data-lg, Geist Mono, text-primary
  Due date: data-sm, Geist Mono
    <10 days: var(--danger-text)
    10-21 days: var(--warning-text)
    >21 days: var(--text-tertiary)

Progress bar: margin-top: 12px
  height: 6px (thicker — completion matters in RFP context)
  border-radius: 9999px
  background: var(--bg-raised)
  fill: var(--accent)
  Percentage label: data-sm, Geist Mono, text-tertiary, right-aligned below bar

Data status grid: margin-top: 12px, grid-cols-2, gap-x-12, gap-y-2
  Auto field: CheckCircle icon (14px, success), body-sm, text-secondary
  Manual field: XCircle icon (14px, danger), body-sm, text-secondary
```

### 6m) Market Intelligence Feed Items

```
Container: padding 12px 0, border-bottom: 1px solid var(--border-subtle)
  Last item: no border-bottom
  Layout: flex, gap: 12px, items-start

Timestamp: caption (Geist Mono, 11px, text-tertiary)
  width: 48px, flex-shrink: 0

Source badge:
  font: badge-text (11px, font-semibold, uppercase)
  padding: 1px 6px
  border-radius: 4px
  border: 1px solid
  flex-shrink: 0

  Bloomberg: bg rgba(245,158,11,0.08), border rgba(245,158,11,0.20), text #B45309
  LSEG: bg rgba(59,130,246,0.08), border rgba(59,130,246,0.20), text #2563EB
  Reuters: bg rgba(234,88,12,0.08), border rgba(234,88,12,0.20), text #C2410C
  FT: bg rgba(236,72,153,0.08), border rgba(236,72,153,0.20), text #DB2777
  Morningstar: bg rgba(16,185,129,0.08), border rgba(16,185,129,0.20), text #059669

Content: flex-1
  Headline: body-sm (13px), text-primary (intentionally primary — these are scannable)
  Relevance: caption (11px), text-tertiary, margin-top: 2px
    Format: "→ Lancashire Pension · Aviva Staff Pension"
    Links the market event to specific clients. Key differentiator.
```

---

## SECTION 7: ALL CHART SPECIFICATIONS

### Global Defaults (all charts)

```jsx
// Background: transparent (charts sit on bg-card surface)

// Grid
<CartesianGrid
  stroke="var(--border-subtle)"
  strokeOpacity={0.6}
  vertical={false}
/>

// X Axis
<XAxis
  tick={{ fontSize: 11, fill: '#999999', fontFamily: 'var(--font-mono)' }}
  axisLine={{ stroke: '#D4D4D0' }}
  tickLine={false}
/>

// Y Axis
<YAxis
  tick={{ fontSize: 11, fill: '#999999', fontFamily: 'var(--font-mono)' }}
  axisLine={false}
  tickLine={false}
/>

// Tooltip
contentStyle={{
  background: '#FFFFFF',
  border: '1px solid #D4D4D0',
  borderRadius: '8px',
  padding: '12px',
  fontSize: '12px',
  fontFamily: 'var(--font-mono)',
  color: '#1A1A1A',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
}}
labelStyle={{ color: '#999999', fontSize: '11px', marginBottom: '4px' }}
itemStyle={{ color: '#6B6B6B', padding: '2px 0' }}

// Animation
isAnimationActive={true}
animationDuration={600}
animationEasing="ease-out"
```

### 1. Risk Scatter Plot — see Section 5

### 2. Area Chart (Engagement Decay, AUM Sparkline)

```jsx
<defs>
  <linearGradient id="areaGradientAccent" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stopColor="#F59E0B" stopOpacity={0.15} />
    <stop offset="100%" stopColor="#F59E0B" stopOpacity={0} />
  </linearGradient>
</defs>
<Area
  type="monotone"
  stroke="#F59E0B"
  strokeWidth={2}
  fill="url(#areaGradientAccent)"
  dot={false}
  activeDot={{ r: 4, stroke: '#F59E0B', fill: '#FFFFFF', strokeWidth: 2 }}
/>

// Sparkline version: no axes, no grid, no tooltip
// Width: 120px, Height: 36px
// Area fill: #F59E0B at 8% opacity
// strokeWidth: 1.5
```

### 3. Net Flows Bar Chart

```jsx
// Positive bars
fill="#16A34A" (success-text for AA contrast on white)
opacity={0.7}
radius={[4, 4, 0, 0]}

// Negative bars
fill="#DC2626" (danger-text)
opacity={0.7}
radius={[4, 4, 0, 0]}  // Still top-rounded, negative values go below

barCategoryGap="40%"

// Reference line at y=0
<ReferenceLine y={0} stroke="#D4D4D0" strokeWidth={1} />
```

### 4. Stacked Bar (Flows by Channel)

```jsx
// 5 stacked segments per bar, one bar per quarter
// Colours from chart series palette:
Series 1: #F59E0B (Pension)
Series 2: #3B82F6 (Endowment)
Series 3: #8B5CF6 (Insurance)
Series 4: #10B981 (Wealth)
Series 5: #EC4899 (Platform)

// Legend: horizontal, positioned above chart
// Font: body-sm, text-secondary
```

### 5. Multi-Series Line (Fund Performance)

```jsx
// 5 fund lines, colours from chart series palette
strokeWidth={1.5}
dot={false}
activeDot={{ r: 3, strokeWidth: 1 }}

// Benchmark line
stroke="#999999" (text-tertiary)
strokeDasharray="6 3"
strokeWidth={1}

// Legend: horizontal, body-sm
```

### 6. Donut Chart (Wallet Share)

```jsx
<Pie
  innerRadius="65%"
  outerRadius="85%"
  stroke="#FFFFFF"
  strokeWidth={2}
  paddingAngle={2}
/>

// Meridian slice: fill #F59E0B (accent)
// Other managers slice: fill #EDEDEB (bg-subtle)

// Centre label:
// data-lg (Geist Mono, 14px, font-medium): "34%"
// caption (11px, text-tertiary): "Wallet Share"
```

### 7. Sparkline

```
Width: 120px, Height: 36px
Line: stroke #F59E0B, strokeWidth 1.5
No axes, no grid, no tooltip, no dots
Area fill: linearGradient #F59E0B from opacity 0.08 to 0
isAnimationActive: false
```

### 8. Bar List (Days-Since-Contact Distribution)

```
Horizontal bars, labels on left, bars on right
Bar height: 24px, border-radius: 4px

Bucket colours:
  0-7d:  var(--success) at 80% opacity
  7-14d: var(--success) at 60% opacity
  14-30d: var(--neutral) at 80% opacity
  30-45d: var(--warning) at 80% opacity
  45d+:  var(--danger) at 80% opacity

Count label: data-sm, Geist Mono, right of bar end, 4px gap
Bucket label: body-sm, text-secondary, left side, 80px width
```

---

## SECTION 8: ANIMATION AND MOTION

### 1. Page Transition

```tsx
<motion.div
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
>
```

### 2. Stat Card Count-Up

```tsx
// Hook: useCountUp(target: number, duration?: number): number
// Default duration: 900ms
// Easing: t => 1 - Math.pow(1 - t, 3) (cubic ease-out)
// Fires on component mount, returns animated value
// Format output with appropriate currency/unit
```

### 3. Scatter Plot Bubbles — see Section 5

### 4. Client Card Stagger

```css
@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
/* Per card: animation: fadeSlideIn 0.2s ease-out both; */
/* animation-delay: calc(var(--index) * 60ms); */
```

### 5. Risk Bar Fill

```css
transition: width 600ms cubic-bezier(0.4, 0, 0.2, 1);
/* Delay: 200ms after mount */
```

### 6. Data Source Pulse

```css
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
animation: pulse-dot 2.2s ease-in-out infinite;
```

### 7. Hover Transitions

```
Duration: 120ms
Easing: ease
Allowed properties: background-color, border-color, color, opacity
```

### PROHIBITED ANIMATIONS

1. Card hover lift (translateY on hover)
2. Box shadow growth on hover
3. Scale transforms on hover (no `hover:scale-*`)
4. Spinning or rotating elements (except loading spinner ≤16px)
5. Bounce or elastic easing
6. Sliding sidebars
7. Skeleton shimmer (use opacity fade)
8. Parallax effects
9. Scroll-triggered animations
10. Number flash/pulse on data update

---

## SECTION 9: TAILWIND CONFIG EXTENSIONS

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-page": "var(--bg-page)",
        "bg-card": "var(--bg-card)",
        "bg-raised": "var(--bg-raised)",
        "bg-subtle": "var(--bg-subtle)",
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
          subtle: "var(--border-subtle)",
        },
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        tertiary: "var(--text-tertiary)",
        disabled: "var(--text-disabled)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          subtle: "var(--accent-subtle)",
        },
        danger: {
          DEFAULT: "var(--danger)",
          subtle: "var(--danger-subtle)",
          text: "var(--danger-text)",
        },
        success: {
          DEFAULT: "var(--success)",
          subtle: "var(--success-subtle)",
          text: "var(--success-text)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          subtle: "var(--warning-subtle)",
          text: "var(--warning-text)",
        },
        neutral: {
          DEFAULT: "var(--neutral)",
          subtle: "var(--neutral-subtle)",
          text: "var(--neutral-text)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      animation: {
        "pulse-dot": "pulse-dot 2.2s ease-in-out infinite",
        "fade-slide-in": "fadeSlideIn 0.2s ease-out both",
      },
      keyframes: {
        "pulse-dot": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        fadeSlideIn: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
```

---

## SECTION 10: GLOBALS.CSS FULL CONTENT

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Surface hierarchy */
  --bg-page: #F8F8F6;
  --bg-card: #FFFFFF;
  --bg-raised: #F3F3F1;
  --bg-subtle: #EDEDEB;

  /* Borders */
  --border: #E8E8E5;
  --border-strong: #D4D4D0;
  --border-subtle: #F0F0EE;

  /* Text */
  --text-primary: #1A1A1A;
  --text-secondary: #6B6B6B;
  --text-tertiary: #999999;
  --text-disabled: #C4C4C4;

  /* Accent */
  --accent: #F59E0B;
  --accent-hover: #D97706;
  --accent-subtle: rgba(245, 158, 11, 0.08);

  /* Semantic */
  --danger: #EF4444;
  --danger-subtle: rgba(239, 68, 68, 0.08);
  --danger-text: #DC2626;
  --success: #22C55E;
  --success-subtle: rgba(34, 197, 94, 0.08);
  --success-text: #16A34A;
  --warning: #F59E0B;
  --warning-subtle: rgba(245, 158, 11, 0.08);
  --warning-text: #B45309;
  --neutral: #6B7280;
  --neutral-subtle: rgba(107, 114, 128, 0.08);
  --neutral-text: #4B5563;

  /* Client type badges */
  --badge-pension-bg: rgba(59, 130, 246, 0.08);
  --badge-pension-border: rgba(59, 130, 246, 0.20);
  --badge-pension-text: #2563EB;
  --badge-endowment-bg: rgba(139, 92, 246, 0.08);
  --badge-endowment-border: rgba(139, 92, 246, 0.20);
  --badge-endowment-text: #7C3AED;
  --badge-insurance-bg: rgba(6, 182, 212, 0.08);
  --badge-insurance-border: rgba(6, 182, 212, 0.20);
  --badge-insurance-text: #0891B2;
  --badge-wealth-bg: rgba(16, 185, 129, 0.08);
  --badge-wealth-border: rgba(16, 185, 129, 0.20);
  --badge-wealth-text: #059669;
  --badge-platform-bg: rgba(245, 158, 11, 0.08);
  --badge-platform-border: rgba(245, 158, 11, 0.20);
  --badge-platform-text: #B45309;
  --badge-family-bg: rgba(236, 72, 153, 0.08);
  --badge-family-border: rgba(236, 72, 153, 0.20);
  --badge-family-text: #DB2777;

  /* Fonts */
  --font-sans: 'Geist Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Geist Mono', 'SF Mono', 'Fira Code', monospace;
}

body {
  background-color: var(--bg-page);
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  border-color: var(--border);
}

/* Selection */
::selection {
  background-color: var(--accent-subtle);
  color: var(--text-primary);
}

/* Focus ring */
*:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 4px;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: var(--border-strong);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--text-disabled);
}

/* Animations */
@keyframes pulse-dot {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

@keyframes fadeSlideIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## SECTION 11: FILE STRUCTURE

```
src/
  app/
    globals.css           → CSS variables, base styles, @tailwind, keyframes,
                            scrollbar, selection, focus-visible
    layout.tsx            → GeistSans/GeistMono imports, font variables on <html>,
                            Sidebar import, main content offset (marginLeft: 240px)
    page.tsx              → Morning Brief
    priorities/page.tsx   → Priority Queue
    clients/page.tsx      → Client Intelligence
    flows/page.tsx        → Flow Intelligence
    rfp/page.tsx          → RFP Intelligence
    settings/page.tsx     → Settings

  tailwind.config.ts      → Colour tokens (var(--*) references), font families,
                            animation keyframes, border-radius overrides

  components/
    dashboard/            → Product-specific components
      sidebar.tsx           All sidebar styles via Tailwind + inline styles
      topbar.tsx            Top bar with live clock
      stat-card.tsx         Uses useCountUp, variant prop
      data-source-strip.tsx Pulse dots, horizontal layout
      client-card.tsx       4-variant cards with risk bar
      feed-item.tsx         Market intelligence items
      timeline-entry.tsx    Relationship history
    ui/                   → Generic UI primitives
      badge.tsx             All badge variants
      risk-bar.tsx          Animated fill bar
    charts/               → Recharts wrappers
      scatter-plot.tsx      Hero chart with quadrants
      area-chart.tsx        Gradient fill areas
      bar-chart.tsx         Positive/negative bars
      line-chart.tsx        Multi-series lines
      donut-chart.tsx       Wallet share
      sparkline.tsx         Inline trend
      bar-list.tsx          Horizontal distribution

  hooks/
    use-count-up.ts       → Animated number hook

  lib/
    mock-data.ts          → DO NOT MODIFY — all Meridian data
    utils.ts              → cn() helper, colour threshold functions
```

### Style Conventions

- All styling via Tailwind utility classes in JSX `className`
- CSS variables for all colours — never raw hex in Tailwind classes
- Use `cn()` from `lib/utils.ts` for conditional classes
- No CSS modules, no styled-components
- No `@apply` in CSS files
- No inline `style` objects except for Recharts (which requires them)
- Component variants via props: `<StatCard variant="critical" />`

---

## SECTION 12: DO / NEVER DO

**DO:**
1. Use Geist Mono for every number in the UI — AUM, percentages, dates, counts, risk scores, deltas. No exceptions.
2. Apply `tabular-nums` globally via body and reinforce on every `font-mono` usage.
3. Keep amber to max 3 uses per page: active nav indicator + Revenue at Risk card border + one more intentional use.
4. Use the warm off-white `#F8F8F6` page background — never pure `#FFFFFF` for the page canvas.
5. Express active nav state through font-weight increase + bg-raised surface + amber left bar. Not colour fills.
6. Use hairline borders (`1px solid var(--border)`) on all cards. Zero box-shadow on the light theme.
7. Colour-code "days since contact" values in every table and card using the threshold rules (>45d danger, 20-45d warning, <20d tertiary).
8. Show the client risk scatter plot as the hero element of Morning Brief, below stat cards and data source strip.
9. Use the stagger animation (60ms intervals) for the 5 client cards on Morning Brief.
10. Right-align all numerical table columns. Left-align all text columns.
11. Make the "Prepare Brief" button on client cards link to `/clients/[id]`.
12. Show the "→ [client name]" relevance tag on market intelligence items — this is the key product differentiator.
13. Apply the risk bar fill animation with 200ms delay (waits for page transition to complete).

**NEVER:**
14. Use box-shadow on cards — this is a light theme. Borders create hierarchy. Shadows are for dark UIs.
15. Use more than 3 amber elements per page — amber is surgical, never decorative.
16. Use rounded-xl (12px+) on cards — 8px max. Larger radii read as consumer/mobile.
17. Use zebra-striped table rows — one hover state does the job (the Linear way).
18. Apply hover transforms (scale, translateY, shadow growth) — these are consumer patterns.
19. Use Geist Sans for any numerical value — all numbers are Geist Mono, always.
20. Show "Powered by Regulex" anywhere — the product IS Regulex.
21. Use purple as a primary or accent colour — purple reads as startup/AI/consumer.
22. Add skeleton shimmer loading states — use simple opacity fade instead.
23. Put the sidebar on a different background than the page — sidebar uses `--bg-page`, separated by its right border only.
24. Use coloured icon backgrounds (icon circles, icon squares with fills) — icons inherit text colour, nothing more.
25. Make the notification dot any colour other than amber — it's one of the 3 permitted accent uses.

---

## INTELLIGENCE MODULES — DESIGN EXTENSION

> 6 new Intelligence module pages and a navigation restructure.
> All decisions consistent with the existing design system above.
> Light theme. Geist Sans + Geist Mono. CSS variable tokens. Same component patterns.

---

### SECTION A: NAVIGATION RESTRUCTURE

#### New Sidebar Structure

The sidebar nav is restructured into 3 sections:

```
SECTION 1 — "OVERVIEW"
  Morning Brief        (LayoutDashboard)    /
  Priority Queue       (AlertTriangle)      /priorities
  Client Intelligence  (Users)              /clients
  Flow Intelligence    (TrendingUp)         /flows
  RFP Intelligence     (FileText)           /rfp

SECTION 2 — "INTELLIGENCE"  ← NEW
  IFA Prioritisation   (Target)             /intelligence/ifa-prioritisation
  Competitive Positioning (BarChart3)       /intelligence/competitive-positioning
  Partnership Intel    (Link)               /intelligence/partnership-intelligence
  Market Intelligence  (Zap)               /intelligence/market-intelligence
  Platform Flow        (GitBranch)          /intelligence/platform-flow
  AI Research          (Search)             /intelligence/ai-research

SECTION 3 — "SYSTEM"  (renamed)
  Settings             (Settings)           /settings
  Data Sources         (Database)           /data-sources
```

#### Section Label Differentiation

OVERVIEW and SYSTEM labels use the existing spec:
- 11px, font-medium, uppercase, tracking-[0.06em], text-tertiary

INTELLIGENCE label is identical in style but has a BETA badge inline:

```
INTELLIGENCE label:
  Same style as other section labels
  Gap: 6px between "INTELLIGENCE" text and badge

BETA badge:
  display: inline-flex
  padding: 1px 5px
  border-radius: 4px
  font-size: 9px
  font-weight: 600
  letter-spacing: 0.06em
  text-transform: uppercase
  background: var(--accent-subtle)
  color: var(--accent)
  border: 1px solid rgba(245, 158, 11, 0.15)
  vertical-align: middle
  line-height: 1.4

  The BETA badge sits on the section label only, NOT on individual items.
  This is cleaner — one signal, not six.
```

#### Intelligence Nav Items

Same styling as existing nav items in MASTER.md Section 6a. No special treatment — they are navigation items, not feature flags. The BETA badge on the section label is the only indicator that this is a new capability area.

---

### SECTION B: LAYER STATUS INDICATOR SYSTEM

#### Three States

| State | Background | Border | Text | Icon (lucide, 14px) |
|-------|-----------|--------|------|---------------------|
| LIVE | `var(--success-subtle)` | `rgba(34,197,94,0.20)` | `var(--success-text)` | `CircleDot` |
| BUILDING | `rgba(107,114,128,0.08)` | `rgba(107,114,128,0.20)` | `var(--neutral-text)` | `Clock` |
| LICENSED | `var(--accent-subtle)` | `rgba(245,158,11,0.15)` | `var(--accent)` | `Lock` |

```
Badge spec:
  display: inline-flex, align-items: center, gap: 4px
  padding: 2px 8px
  border-radius: 9999px (pill)
  font: badge-text (11px, font-semibold, uppercase, tracking-wide)
  border: 1px solid [per state]
  icon: 12px, same colour as text
```

#### Layer Section Design

Each module page is divided into visible layer sections.

```
Layer section header:
  display: flex, justify-content: space-between, align-items: center
  padding-bottom: 12px
  border-bottom: 1px solid var(--border)
  margin-bottom: 20px

  Left: "Layer 1 — Universe & Profile" in section-heading style (14px, font-semibold)
  Right: Layer status badge

LIVE section:
  Content renders normally, no overlay.

BUILDING section:
  Content container: position relative
  Overlay: position absolute, inset 0, background rgba(248,248,246,0.7),
    border-radius 8px, display flex, align-items center, justify-content center
  Overlay content: centred card (bg-card, border, rounded-lg, p-5, max-width 320px)
    Clock icon (24px, text-tertiary) centred
    "In development" — body, font-semibold, text-primary, mt-3
    "Available Q2 2026" — body-sm, text-tertiary, mt-1
  The greyed content is still visible underneath — it previews what's coming.

LICENSED section:
  Content area shows a single informative card:
  Container: bg-card, border 1px var(--border), border-left 3px solid var(--accent),
    rounded-lg, p-5
  Lock icon: 20px, var(--accent), mb-3
  Heading: "Requires licensing" — section-heading
  Body: "This layer requires commercial data from:" — body-sm, text-secondary, mt-2
  Provider list: each on its own line with bullet
    "• Defaqto — IFA fund usage and panel preferences"
    "• LinkedIn Sales Navigator — people movement signals"
    body-sm, text-secondary
  Footer: "Register Interest" — text link in accent colour, body-sm, font-medium, mt-4
    hover: underline

  This must feel like a considered product roadmap, not a broken feature.
  Language: "Requires [Provider] licensing" — never "Coming Soon".
```

---

### SECTION C: MODULE PAGE TEMPLATE

Every Intelligence module follows this structural template.

#### 1. Module Header

```
Container: padding 24px, border-bottom 1px var(--border)

Left column (flex-1):
  Module name: page-title style (20px, font-semibold, text-primary, tracking-tight)
  Description: body-sm (13px), text-secondary, mt-1, max-width 600px
  "PUBLIC DATA ONLY" badge: inline, mt-2
    bg: var(--success-subtle)
    border: 1px solid rgba(34,197,94,0.20)
    text: var(--success-text)
    font: body-sm (13px, NOT uppercase — this is a sentence, not a label)
    padding: 2px 10px
    border-radius: 9999px
    Content: "Public data only — no internal access required"

Right column:
  "Data Sources" ghost button per MASTER.md Section 6h ghost spec
  icon: Database (16px) left of text
```

#### 2. Layer Navigation Tabs

```
Container: border-bottom 1px var(--border), mt-6, mb-6
  display: flex, gap: 0

Tab — each:
  padding: 10px 16px
  display: flex, align-items: center, gap: 8px
  border-bottom: 2px solid transparent
  margin-bottom: -1px
  cursor: pointer
  transition: color 120ms ease

  Label: body-sm (13px)
  Status badge: inline, scale 0.9 (slightly smaller than standalone badges)

Tab — default: text-tertiary
Tab — hover: text-secondary
Tab — active: text-primary, font-medium, border-bottom-color var(--accent)
Tab — building/licensed (not active): text-tertiary, opacity 0.8
  Still clickable — shows the preview/locked state.
```

#### 3. Layer Content Area

Changes based on active tab. Per-module specs in Section D.

#### 4. Data Freshness Strip

```
Container: mt-8, pt-3, border-top 1px var(--border-subtle)
  display: flex, gap: 16px, flex-wrap: wrap

Each source:
  font: caption (Geist Mono, 11px), text-tertiary
  Format: "FCA Register: 2h ago"
  Separator: " · " between sources

  Stale source (>24h): text in var(--warning-text)
```

---

### SECTION D: PER-MODULE DESIGN SPECIFICATIONS

---

#### MODULE 1: IFA PRIORITISATION

**Route:** `/intelligence/ifa-prioritisation`

**Hero moment:** "From 10,847 registered UK IFAs, here are the 25 most likely to allocate to Keyridge's Global Systematic mandate this quarter — ranked by fit score, enriched with public signals."

##### Layer 1 — Live: Universe & Profile

**Filter bar:**
```
Container: bg-card, border 1px var(--border), rounded-lg, p-3, mt-0
  display: flex, gap: 12px, align-items: center, flex-wrap: wrap

Each filter control:
  body-sm (13px), text-secondary
  bg: var(--bg-raised)
  border: 1px solid var(--border)
  border-radius: 6px
  padding: 6px 12px
  min-width: 140px
  appearance: none (custom chevron)
  transition: border-color 120ms ease
  focus: border-color var(--accent)

Controls:
  1. Mandate: dropdown — "Global Systematic" default
     Options: Global Systematic, UK Balanced, Diversified Income, Absolute Return, Strategic Bond
  2. Region: dropdown — "All UK" default
     Options: All UK, London, South East, Midlands, North, Scotland, Wales
  3. Firm type: dropdown — "All" default
     Options: All, DA Firm, AR Firm, Network
  4. Min AUM: dropdown — "Any" default
     Options: Any, £50m+, £250m+, £500m+, £1bn+
  5. Signals: dropdown — "All" default
     Options: All, New Signals Only, Leadership Changes, Platform Changes
```

**Universe stats strip:**
```
Container: mt-4, mb-4, display flex, gap 4px, align-items baseline
  font: body-sm (13px), text-secondary

  "10,847" — font-mono, data-lg, text-primary
  " IFAs in universe · " — body-sm, text-secondary
  "847" — font-mono, data-lg, text-primary
  " match Global Systematic criteria · " — body-sm, text-secondary
  "23" — font-mono, data-lg, var(--accent)
  " have new signals this week" — body-sm, text-secondary
```

**Main ranked table:**
```
Same table spec as MASTER.md Section 6f (no outer card, sits on bg-page).
Columns:

  Rank: 40px, data-sm Geist Mono, text-tertiary, centre-aligned
  IFA Firm: body-sm font-medium text-primary + type badge inline (gap 6px)
  Region: body-sm, text-secondary, 100px
  Est. AUM: data-sm Geist Mono, text-primary, right-aligned, 90px
  Fit Score: 120px — inline risk bar (60px, 3px height) + score (data-sm Geist Mono)
    >70: var(--success) fill
    50-70: var(--warning) fill
    <50: var(--neutral) fill
  Key Signal: body-sm, text-secondary, flex-1, min-width 200px, line-clamp-2
  FCA Status: 80px — 6px dot (success or danger) + "Authorised" caption
  Action: ghost button "Build Brief", 90px

Row hover: bg-raised
Row click: expands IFA Detail Panel below the row.
```

**Mock IFA data (top 8):**

| Rank | Firm | Region | AUM | Score | Signal |
|------|------|--------|-----|-------|--------|
| 1 | Paradigm Capital Ltd | London | £2.1bn | 91 | Investment director Sarah Chen moved from Schroders Global 3 weeks ago — opens relationship door |
| 2 | Attivo Group | Manchester | £1.1bn | 87 | Added systematic equity strategy to approved list per updated website Q4 2025 |
| 3 | Foster Denovo | London | £3.2bn | 84 | FCA RMAR shows 28% client growth YoY — scaling fast, may need broader fund range |
| 4 | Progeny Wealth | Leeds | £1.2bn | 82 | Director appointment: new Head of Investments from Jupiter AM (Companies House, 6 weeks ago) |
| 5 | Informed Financial Planning | Oxford | £890m | 79 | Investment philosophy page updated to emphasise systematic and factor-based approaches |
| 6 | Atticus Wealth | Bristol | £540m | 76 | Joined Nucleus platform Q3 — expanding fund access, reviewing panel |
| 7 | Perspective Financial Group | Bristol | £1.8bn | 74 | New client proposition document mentions 'evidence-based investing' — strong mandate fit |
| 8 | Arbor Asset Management | Edinburgh | £680m | 71 | RMAR revenue up 41% — growing rapidly, underserved by current AM relationships |

**IFA Detail Panel (expanded row):**
```
Container: bg-card, border-top 1px var(--border), border-bottom 1px var(--border),
  p-5, display grid, grid-template-columns: 1fr 1fr 1fr, gap: 24px
  Animation: fadeSlideIn 0.2s ease-out

Column 1 — Firm Profile:
  Section label: "FIRM PROFILE" (card-label style)
  Key-value rows: FCA Number, Registration Date, Permissions,
    Key Individuals (named), Office Address, Companies House Number
  body-sm throughout, keys in text-tertiary, values in text-primary
  All reference numbers in Geist Mono

Column 2 — Intelligence Signals:
  Section label: "INTELLIGENCE SIGNALS"
  Each signal: timeline-style (dot + date + description)
  Date: Geist Mono caption, text-tertiary
  Source label: inline badge (FCA / CH / Web / Press)
  Description: body-sm, text-secondary

Column 3 — Mandate Fit Breakdown:
  Section label: "FIT SCORE BREAKDOWN"
  Stacked bar showing score components:
    Philosophy match: X/30
    Platform overlap: X/25
    AUM band fit: X/20
    Growth trajectory: X/15
    Signal recency: X/10
  Each: label (body-sm, text-secondary) + bar (3px, coloured by contribution) + score (Geist Mono)
  Total: section-heading, Geist Mono, text-primary

  "Build Outreach Brief" primary button (bg-accent, text white, body-sm, mt-4)
```

##### Layer 2 — Building: Relevance Scoring

```
Greyed preview showing:
  A more detailed scoring breakdown with:
  - Philosophy match analysis (word cloud from IFA website)
  - Platform overlap matrix
  - Client demographic alignment indicators
  - Fee tolerance signals

Overlay card: Clock icon + "In development — Available Q2 2026"
```

##### Layer 3 — Licensed: Readiness Signals

```
Locked card (accent border-left):
  Lock icon (20px, accent)
  "Real-time readiness signals require:"
  "• Defaqto — adviser fund usage data, panel preferences, research ratings"
  "• LinkedIn Sales Navigator — people movement signals at scale, relationship mapping"
  body-sm, text-secondary

  "These signals would increase actionable leads by an estimated 3-4x."
  body-sm, text-secondary, mt-3, font-style italic

  "Register Interest" — accent text link, font-medium, mt-4
```

---

#### MODULE 2: COMPETITIVE POSITIONING

**Route:** `/intelligence/competitive-positioning`

**Hero moment:** "Select a mandate. See every fund competing for the same IFAs. Get a battlecard for any competitor in 30 seconds."

##### Layer 1 — Live: Competitive Universe Mapping

**Mandate selector:** Same control as Module 1 (consistent UX). Default: "Global Systematic".

**Peer group table:**
```
Same table spec as Section 6f.
Columns:
  Fund Name: body-sm, font-medium, text-primary
    Keyridge row: border-left 2px solid var(--accent) + "YOU" micro badge
  Asset Manager: body-sm, text-secondary
  AUM: data-sm, Geist Mono, right-aligned — format "£X.Xbn"
  IA Sector: body-sm, text-secondary
  Fee (OCF): data-sm, Geist Mono, right-aligned — format "X.XX%"
  YTD Perf: data-sm, Geist Mono, right-aligned — coloured by sign
  Platforms: data-sm, Geist Mono, centre-aligned — count
  Key Claim: body-sm, text-secondary, max-width 240px, line-clamp-2
  Action: ghost button "View Brief"
```

**Mock peer group data (Global Systematic):**

| Fund | Manager | AUM | OCF | YTD | Platforms | Key Claim |
|------|---------|-----|-----|-----|-----------|-----------|
| **Keyridge Global Systematic** | Keyridge AM | £4.2bn | 0.65% | +3.1% | 12 | Systematic factor-based, 20yr track record |
| Schroders QEP Global Core | Schroders | £8.1bn | 0.73% | +4.2% | 31 | QEP systematic approach, ESG integrated |
| Jupiter Merlin Growth | Jupiter | £5.3bn | 1.42% | +2.8% | 28 | Multi-manager, actively managed allocation |
| Artemis Global Income | Artemis | £3.7bn | 0.83% | +5.1% | 24 | Income-focused global equity, yield 2.8% |
| M&G Global Macro Bond | M&G | £2.1bn | 0.91% | +1.9% | 19 | Macro-driven flexible fixed income |
| Royal London Sustainable World | Royal London | £1.8bn | 0.79% | +3.6% | 22 | ESG-integrated global multi-asset |

**Platform presence callout:**
```
Container: bg-accent-subtle, border-left 3px solid var(--accent), rounded-lg, p-4, mt-4
  body-sm, text-primary:
  "Keyridge is not listed on Hargreaves Lansdown. 4 of 5 key competitors are."
  body-sm, text-secondary, mt-1:
  "HL carries £149bn AUM and grew 3.2% QoQ. This is the highest-priority distribution gap."
```

**Competitor Brief Panel (slide-over):**
```
Container: fixed right, top 0, height 100vh, width 420px, z-index 50
  background: var(--bg-card)
  border-left: 1px solid var(--border)
  box-shadow: -8px 0 24px rgba(0,0,0,0.06)
  padding: 24px
  overflow-y: auto

Header: flex, justify-content space-between, items-center
  Fund name: section-heading (14px, font-semibold)
  Close: X icon (18px, text-tertiary, hover text-secondary)

Sections (gap-6 between):

  "OVERVIEW" (card-label):
    Key-value rows: AUM, Fee, YTD, Sector, Platforms
    data-sm Geist Mono for all values

  "POSITIONING" (card-label):
    body-sm, text-secondary, line-height 1.6
    2-3 sentences from factsheet/KIID

  "PERCEIVED STRENGTHS" (card-label):
    Bulleted list, body-sm, text-secondary
    Green dot (6px) per item

  "VISIBLE WEAKNESSES" (card-label):
    Bulleted list, body-sm, text-secondary
    Amber dot (6px) per item

  "PLATFORM DISTRIBUTION" (card-label):
    Compact list: platform name + ✓/✗ (success/danger colour)

  "BATTLECARD" section:
    Container: bg-accent-subtle, border-left 2px solid var(--accent), p-4, rounded-lg
    Heading: "If they mention [Competitor Name]" — section-heading
    3 numbered talking points: body-sm, text-primary, line-height 1.6
    Each point: < 25 words. Punchy. Specific. Data-backed.

    Mock battlecard for Schroders QEP:
    1. "Our OCF is 0.65% vs their 0.73% — 8bps cheaper with a 20-year systematic track record, 3x longer than QEP."
    2. "QEP requires Schroders platform relationship — we sit on 12 platforms including Transact and Nucleus independently."
    3. "Their ESG integration is a passive overlay — ours is embedded in the factor model from construction."
```

##### Layer 2 — Building: Positioning Intelligence

Greyed preview of fuller competitor briefs with manager commentary, distribution hire signals, mandate pivot detection. Overlay: "In development — Available Q2 2026"

##### Layer 3 — Licensed: IFA Perception Layer

Locked card: Defaqto fund ratings and actual IFA usage data. "Shows exactly how IFAs currently rate and use each competitor fund."

---

#### MODULE 3: PARTNERSHIP INTELLIGENCE

**Route:** `/intelligence/partnership-intelligence`

**Hero moment:** An anatomy of the JPMorgan + True Potential partnership — trigger, people, mandate fit, outcome — and a list of firms with an identical pre-partnership profile today.

##### Layer 1 — Live: Retrospective Partnership Anatomy

**Search bar:**
```
Full-width input: bg-card, border 1px var(--border), rounded-lg
  height: 44px, padding: 0 16px
  placeholder: "Search known partnerships..." (body-sm, text-tertiary)
  focus: border-color var(--accent)
  Autocomplete dropdown: bg-card, border, rounded-lg, shadow-sm, mt-1
    Suggestions: body-sm, p-3, hover bg-raised
    "JPMorgan + True Potential"
    "Schroders + Benchmark Capital"
    "Columbia Threadneedle + Openwork"
```

**Default state:** 3 collapsed partnership anatomy cards in a row (grid-cols-3 gap-4).

**Partnership Anatomy Card (full view):**
```
Container: bg-card, border 1px var(--border), rounded-lg, p-6

Header:
  Left: [AM name] × [Distributor name] — page-title style
  Right: "Announced [date]" — caption, Geist Mono, text-tertiary

4-section anatomy (grid-cols-2 gap-5):

  TRIGGER:
    Container: border-left 3px solid var(--accent), pl-4
    Label: "TRIGGER" — card-label style
    Content: body-sm, text-secondary, line-height 1.6, mt-2

  MANDATE FIT:
    Container: border-left 3px solid var(--success), pl-4
    Label: "MANDATE FIT"
    Content: body-sm, text-secondary

  PEOPLE CATALYST:
    Container: border-left 3px solid var(--neutral), pl-4
    Label: "PEOPLE CATALYST"
    Content: body-sm, text-secondary
    Source note: "Source: LinkedIn profile, FCA register" — caption, text-tertiary, mt-1

  OUTCOME:
    Container: border-left 3px solid var(--success), pl-4
    Label: "OUTCOME"
    Content: body-sm, text-secondary
    Key metric in Geist Mono: "£1.2bn AUM estimated at peak"
```

**Mock anatomy — JPMorgan + True Potential:**

| Section | Content |
|---------|---------|
| TRIGGER | True Potential's discretionary service launched 2017 required institutional-grade systematic equity exposure not available in their existing fund panel. |
| MANDATE FIT | JPMorgan US Equity Income matched True Potential's target demographic (risk-averse, income-seeking) and their then-emerging digital distribution model. |
| PEOPLE CATALYST | True Potential's CIO David Harrison had a prior relationship with JPMorgan's UK Wholesale team from his previous role at Standard Life Investments (2014-2017). |
| OUTCOME | True Potential became one of JPMorgan's top 10 UK wholesale distributors by AUM within 24 months. £1.2bn AUM estimated at peak (2021, FT Adviser). |

**Pre-partnership profile matches table:**
```
Section heading: "Firms matching this pre-partnership profile today" + count badge "12"

Compact table (same spec as Section 6f):
  Rank | Firm | Signal | Match Score (risk bar + score)

Mock data (show 6):
  1. Quilter Financial Planning — "Launching MPS Q1 2026, systematic equity gap identified in factsheet" — 88
  2. Benchmark Capital — "DPS AUM grew 140% in 2 years, current systematic equity offering thin" — 84
  3. Perspective Group — "New CIO from institutional AM, expanding product range (FCA register)" — 81
  4. Ascot Lloyd — "Platform expansion to Nucleus suggests fund panel review underway" — 78
  5. Sandringham Financial Partners — "Regulation-driven consolidation creating systematic exposure gap" — 75
  6. Almary Green — "Investment committee minutes mention 'factor-based diversification' as 2026 priority" — 72
```

##### Layer 2 — Building: Predictive Signals

Greyed preview: broader signal scanning across all 10,847 IFAs. Overlay: "In development — Available Q3 2026"

##### Layer 3 — Licensed: People & Relationship Intelligence

Locked card: LinkedIn Sales Navigator + Defaqto for people movement and fund panel signals at scale.

---

#### MODULE 4: DYNAMIC MARKET INTELLIGENCE

**Route:** `/intelligence/market-intelligence`

**Hero moment:** Bank of England held rates at 4.5% today. The platform shows: which 3 Keyridge mandates are directly relevant, which IFA segments to contact, and what to say — in under 60 seconds.

##### Layer 1 — Live: Macro Event to Mandate Mapping

**Two-column layout:** `grid-cols-[380px_1fr] gap-0`

**Left column — Live Event Feed:**
```
Container: border-right 1px var(--border), overflow-y auto, height calc(100vh - 200px)
  padding: 0

Section heading: "MARKET EVENTS" (card-label) + pulsing green dot (6px, animate-pulse-dot)
  + "Live" in success-text, caption. Padding: 16px.

Each event item:
  Container: p-4, border-bottom 1px var(--border-subtle), cursor pointer
    transition: all 120ms ease
  Selected: border-left 2px solid var(--accent), bg-raised, pl-[14px]
  Hover (not selected): bg-raised

  Time: Geist Mono, caption (11px), text-tertiary, mb-1
  Source badge: per MASTER.md Section 6m source colours
  Headline: body-sm (13px), text-primary, mt-1, line-height 1.5
  Relevance: caption, var(--accent), mt-1
    "Relevant to 3 mandates"

Mock events:
  08:15 BoE — "Bank of England holds base rate at 4.5%" → 3 mandates
  09:30 ONS — "UK CPI prints 2.8% — below consensus" → 2 mandates
  10:05 Reuters — "LGPS consolidation pool expansion announced" → 4 mandates
  10:45 FT — "Global equity markets rally on Fed dovish signals" → 2 mandates
  11:20 Citywire — "Multi-asset sector sees £2.1bn outflows in March" → 3 mandates
```

**Right column — Mapped Intelligence:**
```
Container: padding 24px, overflow-y auto

Event summary card (top):
  bg-card, border, rounded-lg, p-5
  Headline: section-heading (14px, font-semibold)
  Context: body-sm, text-secondary, mt-2, line-height 1.6 (2 sentences)

Mandate relevance section (mt-6):
  Label: "MANDATES AFFECTED" (card-label) + count badge
  Grid: grid-cols-1 gap-3, mt-3

  Mandate card:
    bg-card, border 1px var(--border), rounded-lg, p-4
    Mandate name: body (14px), font-semibold, text-primary
    Why relevant: body-sm, text-secondary, mt-1, line-height 1.5
    Opportunity badge: pill — DEFENSIVE (neutral) / OFFENSIVE (success) / NEUTRAL (neutral)
    "Generate Outreach Brief" ghost button, mt-3

IFA Outreach Intelligence section (mt-6):
  Label: "IFAS TO CONTACT TODAY" (card-label)
  Compact table (mt-3):
    Firm | Reason | Mandate | Action
    Firm: body-sm, font-medium, text-primary
    Reason: body-sm, text-secondary, line-clamp-2
    Mandate: badge (neutral style)
    Action: "Draft" ghost button (small)

  Mock rows:
    Paradigm Capital — "Risk-averse client base benefits from rate hold stability; Strategic Bond narrative" — Strategic Bond
    Foster Denovo — "Last discussed fixed income 8 weeks ago; this event gives natural re-engagement hook" — Strategic Bond
    Attivo Group — "Investment philosophy updated to emphasise duration sensitivity last month" — Global Systematic
```

**Outreach Draft Modal:**
```
Width: 600px, centred, bg-card, border, rounded-lg, shadow
  shadow: 0 8px 32px rgba(0,0,0,0.10)
  Backdrop: rgba(0,0,0,0.3)

Header: p-5, border-bottom 1px var(--border)
  "Outreach Draft" — section-heading
  "For: [IFA Name] · Re: [Event] · Mandate: [Name]" — caption, text-tertiary
  Close X: top-right

Body: p-5
  Draft text: body-sm, line-height 1.7, bg-raised, border, rounded-md, p-4
    Editable textarea, min-height 200px
    font-family: var(--font-sans)

Footer: p-5, border-top 1px var(--border), display flex, gap 3
  "Copy to clipboard" — ghost button (primary)
  "Open in email client" — ghost button
  "Personalise with AI Research" — ghost button, accent text

Disclaimer: caption, text-tertiary, mt-3, text-centre
  "Review and personalise before sending. This draft is generated from public data."
```

##### Layer 2 — Building: Mandate to Distribution Opportunity

Greyed preview: connecting macro events to Module 1 IFA priority lists. Overlay: "In development — Available Q2 2026"

##### Layer 3 — Licensed: Client Holdings Intelligence

Locked card: "Maps macro events to specific client portfolios." Requires: Salesforce/DealCloud integration, Portfolio management system access.

---

#### MODULE 5: AI RESEARCH TEAM

**Route:** `/intelligence/ai-research`

**Hero moment:** Type "Who should we target for Global Systematic in the South East?" and receive a ranked list of 8 IFA firms with intelligence briefs in under 10 seconds.

##### Layer 1 — Live: Structured Q&A on Connected Data

**Query input (prominent):**
```
Container: mt-2

Input:
  width: 100%
  height: 52px
  bg: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: 10px
  padding: 0 52px 0 20px (right padding for submit button)
  font: body (14px), text-primary
  placeholder: "Ask any distribution question..." (text-tertiary)
  focus: border-color var(--accent), box-shadow: 0 0 0 3px var(--accent-subtle)

Submit button (inside input, right side):
  position: absolute, right: 6px, top: 50%, transform translateY(-50%)
  bg: var(--accent), hover: var(--accent-hover)
  border-radius: 6px
  padding: 8px 14px
  display: flex, align-items: center, gap: 6px
  "Research" — body-sm, font-medium, white
  Search icon: 14px, white
```

**Suggested question chips (below input):**
```
Container: display flex, gap 2, flex-wrap wrap, mt-3

Each chip:
  bg: var(--bg-raised)
  border: 1px solid var(--border)
  border-radius: 9999px
  padding: 6px 14px
  font: body-sm (13px), text-secondary
  cursor: pointer
  transition: all 120ms ease
  hover: bg var(--bg-subtle), border-color var(--border-strong), text-primary

Chips:
  "Who should we target for Global Systematic in the South East?"
  "How is Schroders positioned against us for the IA Global sector?"
  "Which IFAs have had leadership changes in the last 30 days?"
  "Which platforms carry Artemis but not Keyridge?"
```

**Query history (left sidebar feel):**
```
Container: mt-6, pt-4, border-top 1px var(--border-subtle)
  Label: "RECENT QUERIES" — card-label style

Each entry: py-2, cursor pointer, hover text-primary
  Query text: body-sm, text-secondary, line-clamp-1
  Timestamp: caption, Geist Mono, text-tertiary, mt-0.5
```

**Result area:**
```
Default (no query): centred, mt-12
  Search icon: 32px, text-tertiary
  "Ask a distribution question. Get a research-grade answer." — body-sm, text-tertiary, mt-3

Result state: mt-6
  Query echo: section-heading, text-primary
  Meta: caption, Geist Mono, text-tertiary, mt-1
    "Result generated in 8.2s · Sources: FCA Register, Companies House, Fund Factsheets, Industry Press"

  Result content depends on query type:

  TYPE 1 — Ranked list (IFA targeting): same table as Module 1, compact
    "Download as CSV" ghost button below table

  TYPE 2 — Structured brief (competitor/mandate): card sections
    Overview / Positioning / Key Signals / Recommended Actions
    "Copy brief" ghost button + "Export PDF" ghost button

  TYPE 3 — Comparison (platform/benchmark): comparison table, Geist Mono

  Below result:
    "Refine this query" input: ghost-style, smaller (height 36px), body-sm
    "Generate outreach brief from this result" — accent ghost button, mt-3
```

##### Layer 2 — Building: Research Brief Generation

Greyed preview: structured one-page briefs for client meetings. Overlay: "In development — Available Q2 2026"

##### Layer 3 — Licensed: Proactive Intelligence

Locked card: "System monitors sources continuously and pushes relevant intelligence to the right RM without being asked." Overlay: "Building — Available Q4 2026 · Requires: Connected data sources"

---

#### MODULE 6: PLATFORM FLOW INTELLIGENCE

**Route:** `/intelligence/platform-flow`

**Hero moment:** "Keyridge's Global Systematic is not listed on Hargreaves Lansdown. HL's multi-asset category AUM grew £4.2bn in the last quarter."

##### Layer 1 — Live: Market-Level Flow Intelligence

**Top stats strip (4 stats, same StatCard component):**

| Label | Value | Delta | Direction |
|-------|-------|-------|-----------|
| IA Global Net Flows QTD | −£2.1bn | ↓ 3 consecutive negative quarters | down |
| IA Mixed Inv. Flows QTD | +£847m | ↑ vs −£312m prior quarter | up |
| UK Net Retail Sales Mar | −£1.4bn | ↓ worst month since Oct 2023 | down |
| Platforms Growing AUM | 8 of 18 | | neutral |

**Two charts (grid-cols-2 gap-4, mt-6):**

Left: "Net Retail Sales by IA Sector — 12M"
```
Bar chart per MASTER.md Section 7 item 3.
Positive bars: success-text at 70% opacity
Negative bars: danger-text at 70% opacity
IA sectors on X axis. Net flows on Y axis.
Reference line at 0.

Mock data (monthly, show last 6 months as bars):
  IA Global: -£340m, -£280m, -£310m (consistently negative)
  IA Strategic Bond: +£120m, +£190m, +£240m (growing positive)
  IA Mixed 40-85%: -£80m, +£40m, +£110m (recovering)
```

Right: "Major Platform AUM Rankings"
```
Bar list per MASTER.md Section 7 item 8.
Horizontal bars, labels left, values right.

Mock data:
  Hargreaves Lansdown: £149bn (+3.2% QoQ) — success-text delta
  Quilter: £104bn (+1.1%) — success-text
  AJ Bell: £82bn (+2.8%) — success-text
  Aegon: £58bn (flat) — text-tertiary
  Transact: £53bn (+4.7%) — success-text
  Nucleus: £28bn (+6.1%) — success-text

All AUM values: Geist Mono. Deltas: Geist Mono, coloured.
```

**Platform Distribution Gap Analysis (mt-6):**
```
Section heading: "Keyridge Fund Presence vs Competitor Platforms"

Table: same spec as Section 6f.
Columns: Platform | Global Systematic | UK Balanced | Diversified Income | Abs Return | Strategic Bond | Competitor Count

Cell values: ✓ (success-text) or ✗ (danger-text), centre-aligned
  ✗ cells in columns where Keyridge funds are missing: bg var(--accent-subtle)

Gap rows (platforms where Keyridge has ≥2 missing funds):
  Entire row: bg var(--accent-subtle) at 50% opacity

Mock data:
  Hargreaves Lansdown: ✗ ✗ ✓ ✗ ✓ | 4 competitors
  Quilter: ✓ ✓ ✓ ✗ ✓ | 3 competitors
  Transact: ✓ ✓ ✓ ✓ ✓ | 2 competitors
  Nucleus: ✓ ✗ ✓ ✗ ✓ | 3 competitors
  AJ Bell: ✗ ✗ ✓ ✗ ✓ | 4 competitors
  Standard Life: ✓ ✓ ✗ ✗ ✓ | 2 competitors
  Aviva: ✗ ✓ ✓ ✗ ✓ | 3 competitors
  Zurich: ✓ ✓ ✓ ✗ ✓ | 2 competitors

Competitor Count: data-sm Geist Mono, right-aligned
```

**Priority gap callout:**
```
Container: bg-accent-subtle, border-left 3px solid var(--accent), rounded-lg, p-4, mt-4
  body-sm, text-primary:
  "2 priority platform gaps identified:"
  body, font-semibold, text-primary, mt-1:
  "Hargreaves Lansdown and AJ Bell"
  body-sm, text-secondary, mt-1:
  "Both growing, both carrying 4 competitors without Keyridge."
```

##### Layer 2 — Building: Inferred Platform & Manager Signals

Greyed preview: partial flow inference from fund AUM trajectory, platform fund list changes, press signals. Overlay: "In development — Available Q3 2026"

##### Layer 3 — Licensed: Actual Platform Flow Data

```
Locked card (accent border-left):
  Lock icon (20px, accent)
  "Firm-specific, fund-specific, platform-specific flow data requires:"
  "• Calastone — transaction-level flow data (enterprise pricing)"
  "• FE fundinfo Finscape / Nexus — 15+ UK retail platforms, fund switches, distributor flows"
  body-sm, text-secondary

  "This is the most commercially valuable layer. Licensing discussions should begin once the core product is validated."
  body-sm, text-secondary, mt-3, font-style italic

  "Register Interest" — accent text link, font-medium, mt-4
```

---

### SECTION E: SHARED INTELLIGENCE COMPONENTS

#### Data Sources Slide-Over Panel

```
Container: fixed right, top 0, height 100vh, width 420px, z-index 50
  background: var(--bg-card)
  border-left: 1px solid var(--border)
  box-shadow: -8px 0 24px rgba(0,0,0,0.06)
  overflow-y: auto
  Backdrop: fixed inset, bg rgba(0,0,0,0.2), cursor pointer (click to close)

Header: p-5, border-bottom 1px var(--border)
  display: flex, justify-content space-between, items-center
  "Data Sources — [Module Name]" — section-heading
  Close: X icon, 18px, text-tertiary, hover text-secondary

Body: p-5
  Table:
    Columns: Source | Purpose | Layer | Cost | Legal Status
    Source: body-sm, font-medium, text-primary
    Purpose: body-sm, text-secondary
    Layer: badge — "1" / "2" / "3" with neutral styling
    Cost: body-sm, text-secondary — "Free" / "Licensed"
    Legal Status: 6px dot + label
      Green: dot var(--success) + "Green" body-sm
      Amber: dot var(--warning) + "Amber" body-sm

Footer: p-5, border-top 1px var(--border)
  body-sm, text-tertiary, line-height 1.5:
  "All data collection respects robots.txt. Personal data handled under UK GDPR Legitimate Interests basis."
```

#### "PUBLIC DATA ONLY" Badge

```
Appears on every module header. Always visible.

  background: var(--success-subtle)
  border: 1px solid rgba(34,197,94,0.20)
  color: var(--success-text)
  font: body-sm (13px) — NOT uppercase (this is a sentence)
  padding: 2px 10px
  border-radius: 9999px
  display: inline-flex, align-items: center, gap: 4px
  icon: ShieldCheck (14px, success-text) — optional, left of text

  Text: "Public data only — no internal access required"

  Commercial message: no procurement delay, no security review, no SOC 2.
```

---

### SECTION F: EMPTY AND LOADING STATES

**Empty state (no data selected / no query):**
```
Container: display flex, flex-direction column, align-items centre,
  justify-content centre, min-height 240px, gap 8px

Icon: lucide, 32px, text-tertiary (module-appropriate icon)
Prompt: body-sm, text-tertiary
  Module 1: "Select a mandate to begin"
  Module 2: "Select a mandate to view competitors"
  Module 3: "Search a partnership or browse examples"
  Module 4: "Select an event from the feed"
  Module 5: "Ask a distribution question"
  Module 6: "Market-level platform data displayed by default"
```

**Loading state:**
```
Content skeleton: same dimensions as expected content
  background: var(--bg-raised)
  border-radius: 4px
  animation: pulse-dot 2.2s ease-in-out infinite
  (Same opacity pulse as data source dots — NOT shimmer)
```

**Error state:**
```
Container: inline-flex, items-center, gap 8px, p-3, rounded-lg
  bg: var(--warning-subtle)
  border-left: 2px solid var(--warning)

  AlertTriangle icon: 16px, warning-text
  Text: body-sm, text-secondary
    "[Source Name] temporarily unavailable"
  "Retry" — text link, body-sm, font-medium, accent colour
```

---

## CONNECTED INTELLIGENCE, OVERVIEW PAGE & MARKET INTELLIGENCE EXTENSION

---

### SECTION G: CONNECTED INTELLIGENCE — EXISTING MODULE REFRAME

The five existing modules (Morning Brief, Priority Queue, Client Intelligence, Flow Intelligence, RFP Intelligence) are the "Connected Intelligence" layer — what the product becomes when internal data is connected to the public intelligence layer.

#### G1: Navigation Section Rename

Rename the sidebar OVERVIEW section label to: **CONNECTED INTELLIGENCE**

```
Label treatment:
  Text: "CONNECTED INTELLIGENCE"
  Font: 11px, font-weight 500, uppercase, letter-spacing 0.06em
  Colour: var(--text-secondary) — slightly stronger than text-tertiary
    This is the ONE section label that uses text-secondary instead of text-tertiary.
    It signals importance without breaking the visual pattern.
  All other section labels remain text-tertiary.
  The label fits within 240px sidebar at 11px with 0.06em tracking.
```

#### G2: Connected Data Strip

Every Connected Intelligence page gets a persistent strip below the top bar.

```
Container:
  width: 100%
  height: 36px
  background: var(--bg-subtle)
  border-bottom: 1px solid var(--border)
  padding: 0 24px
  display: flex, align-items: center, justify-content: space-between

Left side:
  display: flex, align-items: center, gap: 8px

  "CONNECTED:" label:
    font: 11px, font-weight 500, uppercase, tracking 0.06em
    colour: var(--text-tertiary)
    margin-right: 4px

  6 system pills, each:
    display: flex, align-items: center, gap: 6px
    padding: 2px 8px
    background: var(--bg-card)
    border: 1px solid var(--border)
    border-radius: 4px

    Dot: 5px circle, background var(--success), NO animation (static)
    Text: Geist Mono, 11px, var(--text-secondary), tabular-nums

  Systems:
    Salesforce CRM
    Aladdin PMS
    Bloomberg
    LSEG
    Morningstar
    Outlook

  Gap between pills: gap-2 (8px)

Right side:
  "Why does this view require connected data? →"
  font: 11px, var(--text-tertiary)
  hover: var(--text-secondary)
  cursor: pointer
  transition: color 120ms ease
  Opens Connected Data Explainer (G3)
```

**Strip placement:** Between topbar and page content on Connected Intelligence pages ONLY. Never shown on Intelligence module pages (those are public data only).

#### G3: Connected Data Explainer Panel

```
Slide-over: fixed right, top 0, height 100vh, width 400px, z-index 50
  background: var(--bg-card)
  border-left: 1px solid var(--border)
  box-shadow: -8px 0 24px rgba(0,0,0,0.06)
  padding: 24px
  overflow-y: auto
  Animation: same as Data Sources panel (Framer Motion x 400→0, 200ms easeOut)
  Backdrop: fixed inset, bg rgba(0,0,0,0.2)

Header:
  "Why this view requires connected data" — section-heading (14px, font-semibold)
  Close X: 18px, text-tertiary, hover text-secondary, top-right

Body (mt-6):
  Intro: body-sm, text-secondary, line-height 1.6
  "The Morning Brief you're viewing combines three data layers simultaneously:"

  3 numbered sections (mt-5 between each):

  Section 1:
    Number: "1" — data-xl (24px), Geist Mono, var(--accent), float left, mr-4
    Title: "External Intelligence (Public Data)" — body (14px), font-semibold, text-primary
    Description: body-sm, text-secondary, line-height 1.6, mt-1
      "Market events, IFA signals, competitor moves, platform changes — surfaced automatically from public sources. This layer is always on."
    Badge: "Public data only" — success-subtle badge (same as module headers)
    mt-2

  Section 2:
    Number: "2"
    Title: "Relationship Layer (CRM)"
    Description: "Which clients you manage, when you last spoke to them, what was said, what was promised. Without this, the Morning Brief cannot prioritise your specific book."
    Badge: "Salesforce CRM" — neutral badge (neutral-subtle bg, neutral-text)

  Section 3:
    Number: "3"
    Title: "Performance Layer (PMS + Market Data)"
    Description: "How your funds are performing vs benchmark, which client holdings are affected by market events. Without this, fund impact analysis is generic, not specific to your mandates."
    Badge: "Aladdin PMS · Bloomberg" — neutral badge

  Divider: 1px var(--border), my-6

  Closing text: body-sm, text-secondary
    "Start with public intelligence. Add connected layers when you're ready."

  Buttons (mt-4, flex, gap-3):
    "Explore Intelligence Modules →" — primary button (bg-accent, white, body-sm, font-medium, px-4 py-2, rounded-md)
    "Request Integration Setup" — ghost button
```

#### G4: Module-Level "This View Is Connected" Indicator

```
On each Connected Intelligence page header, next to the page title:

Container: display flex, align-items: center, gap: 6px, ml-3
  Icon: Layers (lucide, 14px, var(--text-tertiary))
  Text: "Connected intelligence" — caption (11px), var(--text-tertiary)

Subtle. Signals the page category without dominating the header.
Equivalent of a "Pro" badge on a SaaS feature.
```

---

### SECTION H: INTELLIGENCE OVERVIEW PAGE

**Route:** `/intelligence`

This page must achieve three things in under 10 seconds:
1. Show the scale of data being watched continuously
2. Show what is actionable right now, specifically
3. Create the feeling that this is a different category of product

#### H1: Page Header

```
Left:
  "Intelligence Overview" — page-title (20px, font-semibold, text-primary)
  Below: body-sm, text-secondary
    "47 signals detected across your distribution universe in the last 7 days"
    "47" — Geist Mono, text-primary, font-semibold (inline)

Right:
  Date range compact tabs: "7D / 30D / 90D"
  Same tab style as layer tabs: underline, body-sm
  Default active: 7D
  Active: text-primary, font-medium, border-bottom 2px var(--accent)
  Default: text-tertiary
```

#### H2: Headline Stats Strip

```
4 stat cards (grid-cols-4 gap-4, mt-6):
Same StatCard component, standard variant.

Card 1 — IFA SIGNALS:
  Value: 23 (data-xl, Geist Mono)
  Delta: "+8 vs last week" (success delta)
  Icon: Target (16px)

Card 2 — MARKET EVENTS:
  Value: 8 (data-xl, Geist Mono)
  Delta: "Linked to 3 mandates each avg" (caption, text-tertiary)
  Icon: Zap (16px)

Card 3 — COMPETITIVE ALERTS:
  Value: 12 (data-xl, Geist Mono)
  Delta: "2 new today" (warning-text, Geist Mono)
  Icon: BarChart2 (16px)

Card 4 — UK IFA UNIVERSE:
  Value: 10,847 (data-xl, Geist Mono)
  Delta: "847 match your mandates" — caption, text-tertiary,
    "847" in var(--accent)
  Icon: Users (16px)
```

#### H3: Hero Visualisation — IFA Opportunity Scatter

```
Container: bg-card, border 1px var(--border), border-radius 8px, p-6, mt-6
  Height: 380px

Title row (inside container, above chart):
  Left: "IFA Opportunity Map" — section-heading (14px, font-semibold)
    Sub: "Each bubble = one IFA firm · Size = estimated AUM · Colour = opportunity signal strength"
    caption, text-tertiary
  Right: Mandate filter dropdown (compact, "Global Systematic" default)

Scatter plot:

X axis: Mandate Fit Score (0 → 100)
  Label: "Mandate Fit →" (Geist Mono, 11px, text-tertiary)
  Ticks: 0, 25, 50, 75, 100
  Axis line: 1px var(--border-strong)

Y axis: Signal Recency (INVERTED — 0 at top = most recent)
  Label: "Signal Recency ↑" (Geist Mono, 11px, text-tertiary)
  Values: 0d, 7d, 14d, 21d, 30d+
  Axis line: hidden

Grid: horizontal only, var(--border-subtle), opacity 0.6

Quadrant zones (subtle background tinting, NOT divider lines):
  Top-left (high fit + very recent): bg var(--accent) at 3% opacity
    Label: "Act Now" — card-label style, var(--accent)
  Top-right (lower fit + recent): no tint
    Label: "Monitor" — card-label style, text-tertiary
  Bottom-left (high fit + older): no tint
    Label: "Qualify" — card-label style, text-tertiary
  Bottom-right: no label, no tint

Bubble properties:
  Size: diameter = 8 + (sqrt(AUM_millions) / sqrt(max_AUM)) * 44
    Min: 12px, Max: 52px
  Colour:
    Fit > 80 AND Signal < 7d: var(--accent) — HOT (amber)
    Fit > 70 AND Signal < 14d: var(--warning) — WARM
    Fit > 55 AND Signal < 30d: var(--neutral) — WATCH
    Otherwise: var(--border-strong) — UNIVERSE (very muted)
  Opacity: 70% fill
  Stroke: 2px white (#FFFFFF)

Key labelled bubbles (always show labels):
  Paradigm Capital: fit 91, signal 3d, £2.1bn — amber, top-left
    Label: "Paradigm Capital" body-sm font-semibold below bubble
    Sub: "New signal: 3d ago" caption var(--accent)
  Attivo Group: fit 87, signal 8d, £1.1bn
  Foster Denovo: fit 84, signal 12d, £3.2bn
  Progeny Wealth: fit 82, signal 18d, £1.2bn

200+ unlabelled small grey dots: var(--border-strong) at 40% opacity
  Size: 6-10px. Represent the full IFA universe.
  The amber/warm labelled bubbles POP against the grey field.

Hover tooltip:
  bg-card, border var(--border-strong), rounded-lg (8px), p-3, shadow-sm
  Line 1: firm name — body-sm, font-semibold
  Line 2: type badge + region — caption
  Line 3: "Fit Score: 91/100" — Geist Mono, data-sm
  Line 4: "Latest signal: [text]" — caption, text-secondary
  Line 5: "Est. AUM: £2.1bn" — Geist Mono, caption
  Button: "View in IFA Prioritisation →" ghost, xs

Below chart (inside container):
  body-sm, text-secondary:
  "23 actionable opportunities identified this week. Top recommendation: "
  "Paradigm Capital" — font-semibold, text-primary
  " — act within "
  "48 hours" — Geist Mono, var(--accent)
  "."
```

#### H4: Two-Column Section (50/50)

```
Container: grid-cols-2 gap-6, mt-6

LEFT — Signal Stream 7-Day Timeline:
  Container: bg-card, border 1px var(--border), rounded-lg, p-5
  Height: 320px

  Title: "Intelligence Signal Stream" — section-heading
  Sub: "All signals detected across 6 modules, last 7 days" — caption, text-tertiary

  Horizontal timeline: 7 columns (Mon → Sun)
    Day label: caption, Geist Mono, text-tertiary, centred above column
    Each signal = 10px coloured dot, stacked vertically, 4px gap
    Max 8 visible per day, then "+X more" in caption

  Module colour coding:
    IFA Prioritisation:        #3B82F6 (blue)
    Competitive Positioning:   var(--accent) (#F59E0B, amber)
    Partnership Intelligence:  #8B5CF6 (violet)
    Market Intelligence:       #16A34A (emerald)
    Platform Flow:             #EA580C (orange)
    AI Research:               #0EA5E9 (sky)

  Dot: fill at 80% opacity
  Hover: tooltip with signal summary

  Mock distribution (total 47):
    Mon: 8 (3 IFA, 2 Market, 2 Competitive, 1 Platform)
    Tue: 6 (2 IFA, 3 Market, 1 Partnership)
    Wed: 9 (4 IFA, 2 Market, 1 Competitive, 2 Platform)
    Thu: 11 (5 IFA, 3 Market, 2 Competitive, 1 AI)
    Fri: 7 (3 IFA, 2 Market, 1 Partnership, 1 Platform)
    Sat: 3 (1 IFA, 2 Market)
    Sun: 3 (2 IFA, 1 Market)

  Legend below: single row, coloured dot + module name in caption, gap-4

RIGHT — Competitive Pressure Heatmap:
  Container: bg-card, border 1px var(--border), rounded-lg, p-5
  Height: 320px

  Title: "Competitor Presence by Platform" — section-heading
  Sub: "Number of competing funds per platform per mandate" — caption, text-tertiary

  Matrix:
    Rows: 5 mandates (abbreviated): GS / UKB / DI / AR / SB
    Columns: 8 platforms: HL / Quilter / Transact / Nucleus / AJ Bell / St Life / Aviva / Zurich
    Column headers: caption, Geist Mono, text-tertiary

  Each cell (32px × 32px):
    Corner indicator (6px dot, top-right):
      Green (var(--success)): Keyridge listed
      Red (var(--danger)): Keyridge NOT listed

    Cell background (heatmap):
      0 competitors: var(--success-subtle)
      1-2: var(--warning) at 8%
      3-4: var(--warning-subtle)
      5+: var(--danger-subtle)

    Content: competitor count, data-sm, Geist Mono, text-primary, centred

  Mock data (HL column — most alarming):
    GS: 4 competitors, NO Keyridge (red dot, warning-subtle bg)
    UKB: 3 competitors, NO Keyridge (red dot)
    DI: 3 competitors, ✓ Keyridge (green dot)
    AR: 5 competitors, NO Keyridge (red dot, danger-subtle bg)
    SB: 4 competitors, ✓ Keyridge (green dot)

  Below matrix:
    "2 priority gaps: Hargreaves Lansdown and AJ Bell" — body-sm, text-primary
    "Hargreaves Lansdown carries 4 competitors in Global Systematic — Keyridge is not listed."
    body-sm, text-secondary. "4 competitors" in Geist Mono, var(--danger-text).
    "View Platform Flow →" ghost link, caption, var(--accent)
```

#### H5: Module Activity Cards (3×2 grid)

```
Container: grid-cols-3 gap-4, mt-6
6 cards, one per Intelligence module.

Each card: bg-card, border 1px var(--border), rounded-lg, p-4
  hover: border-color var(--border-strong), transition 150ms

Row 1: flex, items-center, gap-2
  Icon: lucide, 18px, module colour
  Name: body (14px), font-semibold, text-primary
  "LIVE" badge: right-aligned, success status badge (xs)

Row 2: mt-3
  Stat: data-lg (14px), Geist Mono, font-medium, text-primary

Row 3: mt-2
  Signal: body-sm (13px), text-secondary, line-clamp-1
  Timestamp: caption, Geist Mono, text-tertiary, right-aligned (float or flex)

Row 4: mt-3
  "Open module →" — caption (11px), var(--accent), hover underline
  cursor-pointer, links to module route

Mock data per card:

IFA Prioritisation (Target, #3B82F6):
  Stat: "847 IFAs match Global Systematic"
  Signal: "Paradigm Capital: new investment director 3d ago"

Competitive Positioning (BarChart2, #F59E0B):
  Stat: "5 competitor funds in IA Global sector"
  Signal: "Schroders QEP: new distribution hire on LinkedIn"

Partnership Intelligence (Link, #8B5CF6):
  Stat: "12 firms match True Potential pre-partnership profile"
  Signal: "Quilter: launching MPS Q1 2026 — panel gap identified"

Market Intelligence (Zap, #16A34A):
  Stat: "8 market events mapped to mandates today"
  Signal: "BoE rate hold: Strategic Bond thesis validated"

Platform Flow (GitBranch, #EA580C):
  Stat: "2 priority platform gaps identified"
  Signal: "HL: 4 competitors in Global Systematic, no Keyridge"

AI Research (Search, #0EA5E9):
  Stat: "Ask any distribution question"
  Signal: "Most asked: 'Who to target for Global Systematic in South East?'"
```

#### H6: Recent Signals Feed

```
Container: mt-6, mb-8

Title: "Recent Signals" — section-heading
"See all →" link — caption, var(--accent), right-aligned, hover underline

10 rows, compact:
  Each: flex, items-center, gap-3, py-3, border-bottom 1px var(--border-subtle)
  Hover: bg-raised, transition 100ms

  Module dot: 10px circle, module colour at 80% opacity
  Module badge: caption, text-tertiary, bg-raised, px-1.5 py-0.5, rounded, min-width 100px
  Signal text: body-sm, text-secondary, flex-1
  Timestamp: caption, Geist Mono, text-tertiary, flex-shrink-0

Mock signals (10):
  1. IFA · "Paradigm Capital: investment director joined from Schroders" · 3h ago
  2. Market · "BoE held rates — Strategic Bond thesis validated, 3 IFAs to call" · 5h ago
  3. Platform · "Hargreaves Lansdown AUM up 3.2% QoQ — Keyridge absent from Global Systematic panel" · 6h ago
  4. Competitive · "Schroders QEP: new distribution hire suggests IA Global push" · 1d ago
  5. IFA · "Foster Denovo: RMAR shows 28% client growth — scaling fast" · 1d ago
  6. Partnership · "Quilter launching MPS Q1 — systematic equity gap in current panel" · 2d ago
  7. Market · "LGPS consolidation announced — 4 mandates directly relevant" · 2d ago
  8. IFA · "Progeny Wealth: new Head of Investments from Jupiter (Companies House)" · 3d ago
  9. Competitive · "Artemis Global: launched on AJ Bell — Keyridge absent from same platform" · 4d ago
  10. Platform · "Transact AUM up 4.7% QoQ — growing faster than market, worth prioritising" · 5d ago
```

---

### SECTION I: MARKET INTELLIGENCE — FUND IMPACT DATA

Complete fund impact data for all 5 market events across all 5 Keyridge funds.

#### I1: Fund Impact Data — 5 Events × 5 Funds

**EVENT 1: BoE holds base rate at 4.5% (08:15)**

| Fund | Impact | Dir | Why | What to Say |
|------|--------|-----|-----|-------------|
| Strategic Bond | POSITIVE HIGH | ↑ | Duration 4.2yr benefits from rate stability. +180bps vs benchmark since rate pause began Q3 2025. | Our duration positioning anticipated this pause. Strategic Bond has outperformed by 180bps since rates stabilised — this event validates the thesis. |
| Diversified Income | POSITIVE MODERATE | ↑ | Income yield 4.1% increasingly attractive vs cash at 4.5%. Rate stability supports distribution payments. | Rate stability protects your clients' income distributions. Our 4.1% yield is increasingly competitive vs cash alternatives. |
| UK Balanced | POSITIVE LOW | ↑ | 60% equity component benefits from lower discount rates in stable rate environment. | Stable rates support equity valuations. Clients holding UK Balanced are in a good position heading into Q2. |
| Global Systematic | NEUTRAL | → | Systematic factor model explicitly avoids duration bets. Rate-neutral by design. | Our systematic approach avoids duration risk by design. This is when factor diversification proves its value. |
| Absolute Return | WATCH | ↓ | Cash+3% objective increasingly difficult with rates unchanged. YTD -0.4% exposed. | Worth a call to discuss how we're navigating the rate environment. I want to be transparent about near-term challenges. |

**EVENT 2: UK CPI prints 2.8% — below consensus (09:30)**

| Fund | Impact | Dir | Why | What to Say |
|------|--------|-----|-----|-------------|
| Strategic Bond | POSITIVE HIGH | ↑ | Disinflation narrative directly supports fixed income. Real yield improves as inflation falls. | CPI below consensus strengthens the fixed income case. Strategic Bond duration is positioned perfectly for continued disinflation. |
| Diversified Income | POSITIVE MODERATE | ↑ | Real yield on 4.1% income improves as inflation falls toward target. Income client purchasing power recovering. | Your clients' real income is improving. Strong moment to reinforce the income story with clients worried about inflation erosion. |
| UK Balanced | POSITIVE LOW | ↑ | Lower inflation boosts real returns. UK equity valuations supported by easing cost pressures. | The inflation story is moving in the right direction for UK equity. UK Balanced clients benefit on both equity and bond sides. |
| Global Systematic | NEUTRAL | → | Factor model macro-neutral. CPI variance does not create tracking error in systematic strategy. | Our macro-neutral positioning means clients aren't exposed to inflation surprise risk. Consistent factor exposure regardless of macro. |
| Absolute Return | WATCH | ↓ | If rates follow inflation down, cash+3% target becomes harder. Objective under increasing pressure. | Good moment to review absolute return expectations with clients. Happy to walk through positioning on a call. |

**EVENT 3: LGPS consolidation pool expansion (10:05)**

| Fund | Impact | Dir | Why | What to Say |
|------|--------|-----|-----|-------------|
| Global Systematic | POSITIVE HIGH | ↑ | LGPS pools actively reviewing external systematic equity exposure. Evidence-based governance aligns directly with systematic investment approach. | LGPS pools are rebuilding manager panels now. Our 20-year systematic track record fits pool investment committee requirements precisely. |
| UK Balanced | POSITIVE MODERATE | ↑ | Multi-asset mandates in demand within pooling frameworks for liability-matching. | LGPS consolidation creates balanced mandate opportunities. We can support with a pool-specific pitch for your territory. |
| Strategic Bond | POSITIVE MODERATE | ↑ | Fixed income mandates for liability matching within pool portfolios in high demand. | Pools need fixed income for liability matching. Strategic Bond's duration profile fits pool liability frameworks well. |
| Diversified Income | POSITIVE LOW | ↑ | Income mandates applicable to pools with current pension payment obligations. | Income generation is relevant to pools with current pensioners. A smaller but real opportunity worth flagging. |
| Absolute Return | NEUTRAL | → | Absolute return strategies receive mixed reception in LGPS governance frameworks. | LGPS pools tend to prefer clear-factor strategies. Absolute return may not be the lead conversation here. |

**EVENT 4: Global equity markets rally — Fed dovish (10:45)**

| Fund | Impact | Dir | Why | What to Say |
|------|--------|-----|-----|-------------|
| UK Balanced | POSITIVE HIGH | ↑ | 60% equity exposure captures significant upside. YTD +5.7% vs benchmark +4.2% — outperforming in a rising market. | UK Balanced is outperforming the benchmark in the rally. Strong moment to reinforce confidence with clients. |
| Global Systematic | POSITIVE MODERATE | ↑ | Factor model captured quality and momentum in rally. YTD +3.1% vs benchmark +4.8% — lag reflects defensive factor tilt, not failure. | Our systematic factors captured the rally. The benchmark lag reflects factor diversification — we don't concentrate in growth. Worth framing proactively. |
| Diversified Income | NEUTRAL | → | Income focus means lower equity beta — less upside in rally but stable income maintained throughout. | Income strategy isn't designed to chase equity rallies — and that's the point. Clients chose income over growth and it's delivering. |
| Strategic Bond | WATCH | ↓ | Rate expectations embedded in equity rally may signal less rate cutting — modest pressure on fixed income duration. | The rally signals some reflation expectations which could pressure fixed income. Watching closely — nothing alarming yet. |
| Absolute Return | RISK | ↓ | Strategy designed to be market-neutral — lagging equity beta in strong rally. YTD -0.4% more visible against strong equity backdrop. | Absolute return strategies don't participate fully in equity rallies — that's the trade-off for downside protection. Worth reinforcing with clients. |

**EVENT 5: Multi-asset sector £2.1bn outflows March (11:20)**

| Fund | Impact | Dir | Why | What to Say |
|------|--------|-----|-----|-------------|
| UK Balanced | RISK HIGH | ⚠ | Directly in IA Mixed Investment sector experiencing £2.1bn outflows. Client redemption risk elevated. YTD +5.7% is the defence — use it now. | Sector under redemption pressure. Contact IFAs holding UK Balanced before they hear the outflow data from competitors. Our performance is the story. |
| Absolute Return | RISK HIGH | ⚠ | Absolute return outflows accelerating as clients seek pure equity or pure cash. Middle-ground strategies under structural pressure. | This is the most urgent retention conversation. Prioritise IFAs with Absolute Return exposure this week — proactive beats reactive. |
| Diversified Income | RISK MODERATE | ⚠ | Income funds adjacent to mixed investment sector seeing sympathy selling. Outflow risk moderate. | Proactive touch with Diversified Income relationships this week. Our performance is not negative — that distinction needs making explicitly. |
| Global Systematic | RISK MODERATE | ⚠ | IA Global also seeing outflows. Systematic strategies not immune to sector-level sentiment. YTD +3.1% is the counter-narrative. | Systematic equity is in the same outflow environment. Performance is our defence — +3.1% YTD needs to be front and centre. |
| Strategic Bond | POSITIVE CONTRAST | ↑ | Fixed income bucking the mixed investment outflow trend. Inflows into strategic bond as investors de-risk from mixed assets. | Strategic Bond is one of few areas seeing inflows. Clients rotating out of mixed assets may be receptive — strong positioning story. |

#### I2: Fund Impact Table Component Spec

```
Component: FundImpactTable
Props: eventId: string

Container: bg-card, border 1px var(--border), rounded-lg, p-4, mt-4
Title: "Fund Impact Analysis" — section-heading
  Right-aligned: event headline in body-sm, text-secondary

Table: 5 rows (one per fund)

Columns:
  Fund (35% width): body-sm, font-medium, text-primary
  Impact (15%): impact badge
    POSITIVE HIGH: bg var(--success-subtle), border rgba(34,197,94,0.20), text var(--success-text)
    POSITIVE MODERATE: bg var(--success-subtle), text var(--success-text) at 80% opacity
    POSITIVE LOW: bg rgba(34,197,94,0.05), text var(--success-text) at 60% opacity
    POSITIVE CONTRAST: bg var(--success-subtle), text var(--success-text), border-style dashed
    NEUTRAL: bg var(--neutral-subtle), border rgba(107,114,128,0.20), text var(--neutral-text)
    WATCH: bg var(--warning-subtle), border rgba(245,158,11,0.20), text var(--warning-text)
    RISK: bg var(--danger-subtle), border rgba(239,68,68,0.20), text var(--danger-text)
    RISK HIGH: bg var(--danger-subtle), border var(--danger) at 30%, text var(--danger-text), font-weight 600
    RISK MODERATE: bg var(--danger-subtle), text var(--danger-text) at 80% opacity
    All: badge-text (11px, font-semibold, uppercase, tracking-wide), rounded-full, px-2 py-0.5

  Direction (8%): Geist Mono, data-sm, centred
    ↑: var(--success-text)
    →: var(--text-tertiary)
    ↓: var(--danger-text)
    ⚠: var(--warning-text)

  Why (42%): body-sm, text-secondary, line-clamp-2
    Expand chevron (ChevronDown/Up, 14px, text-tertiary) far right
    Click toggles full text

Row dividers: 1px var(--border-subtle)
Row hover: bg-raised

"What to say" expandable section (below selected row):
  Container: bg-accent-subtle, border-left 2px solid var(--accent), p-4, rounded-r-lg, mt-1
  Label: "If [prospect] asks about [event]:" — card-label style
  Text: body-sm, text-primary, line-height 1.6
    The <25 word talking point from the data
  "Copy talking point" — ghost button, xs, right-aligned
  "Personalise →" — link to /intelligence/ai-research, caption, var(--accent)
```

#### I3: IFA Outreach Intelligence — BoE Rate Hold

```
Section heading: "IFAS TO CONTACT TODAY" (card-label) + count badge "5"

Outreach window indicator (above table):
  Container: bg-raised, px-4 py-2, rounded-md, display flex, items-center, gap-2
  Clock icon: 12px, text-tertiary
  Text: caption, text-tertiary
    "Best outreach window: "
    "24-48 hours" — Geist Mono, var(--accent)
    ". After 48 hours this becomes yesterday's news."

Table (mt-3): 5 rows

Columns: Firm | Reason | Mandate | Last Contact | Priority | Action

Row 1: Paradigm Capital
  Reason: "Income-focused client base. Strategic Bond narrative aligns with their investment philosophy."
  Mandate: Strategic Bond (badge)
  Last Contact: 3d ago (text-tertiary — recent, good)
  Priority: HIGH (warning badge)
  Action: [Draft] ghost button

Row 2: Foster Denovo
  Reason: "Last discussed fixed income 8 weeks ago. Rate hold creates natural re-engagement hook."
  Mandate: Strategic Bond + Diversified Income (2 badges)
  Last Contact: 56d ago (danger-text — overdue)
  Priority: URGENT (danger badge)
  Action: [Draft] ghost button

Row 3: Attivo Group
  Reason: "Added systematic equity to approved list Q4. Rate-neutral positioning differentiates Global Systematic."
  Mandate: Global Systematic (badge)
  Last Contact: 8d ago (text-tertiary)
  Priority: HIGH (warning badge)
  Action: [Draft] ghost button

Row 4: Progeny Wealth
  Reason: "New Head of Investments from Jupiter. Rate hold validates income mandate timing — strong hook."
  Mandate: Diversified Income (badge)
  Last Contact: 18d ago (text-tertiary)
  Priority: MODERATE (neutral badge)
  Action: [Draft] ghost button

Row 5: Perspective Financial
  Reason: "RMAR shows income-focused client growth. Rate stability directly supports their proposition."
  Mandate: Diversified Income (badge)
  Last Contact: 34d ago (warning-text)
  Priority: MODERATE (neutral badge)
  Action: [Draft] ghost button
```

#### I4: Event Card Visual Update

```
Updated event item in left-side feed:

After headline, add fund impact chip row:
  Container: display flex, gap 4px, mt-1
  Max 2 chips: most positive + most concerning impact

  Chip spec:
    font: caption (11px), Geist Mono
    padding: 1px 6px
    border-radius: 3px
    display: inline-flex, items-center, gap: 2px

    Positive chip: bg var(--success-subtle), text var(--success-text)
      Content: "[Fund] ↑↑" for HIGH, "[Fund] ↑" for MODERATE
    Negative chip: bg var(--danger-subtle), text var(--danger-text)
      Content: "[Fund] ↓" for WATCH/RISK
    Warning chip: bg var(--warning-subtle), text var(--warning-text)
      Content: "[Fund] ⚠" for RISK HIGH

  Mock for BoE event:
    "Strat. Bond ↑↑" (success) + "Abs. Return ↓" (danger)

  Mock for Multi-asset outflows event:
    "UK Balanced ⚠" (warning) + "Strat. Bond ↑" (success)
```
