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
