# Morning Intelligence Brief — Design Specification

> Branch: `feature/uc4-real-data`
> Route: `/intelligence/morning-brief`
> Design authority: `design-system/MASTER.md`
> UI/UX validation: ui-ux-pro-max Data-Dense Dashboard pattern

---

## Pre-Delivery Checklist (ui-ux-pro-max)

- [ ] No emojis as icons — all icons use Lucide
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover transitions use 120ms ease (MASTER.md Section 8, Rule 7)
- [ ] Skeleton loading states for all async content (UX guideline: Loading States)
- [ ] Loading button disabled during refresh (UX guideline: Loading Buttons)
- [ ] `prefers-reduced-motion` respected for all animations
- [ ] Amber accent count ≤ 3 per page view (MASTER.md Rule 2)
- [ ] All numeric values use Geist Mono with `tabular-nums` (MASTER.md Rule 3)
- [ ] No prohibited animations (MASTER.md Section 8)
- [ ] Responsive at 375px, 768px, 1024px, 1440px
- [ ] Content reserving space for async content — no layout jumps (UX guideline: Content Jumping)
- [ ] Focus states visible for keyboard navigation

---

## 1. Purpose and Persona

A daily morning intelligence brief for UK asset managers distributing OEICs and unit trusts through the IFA channel. The demo uses Keyridge Asset Management's fund range but the page must be generalisable — no component hardcodes the manager name or fund names. All fund references come from the data layer.

**Primary persona:** Head of Distribution or senior relationship manager. Opens this page at 7:45am. Has 10 calls to make this week. Needs to know what happened in markets, which funds are affected, which IFAs to call about it, and what to say. Has five minutes.

---

## 2. Navigation Changes

### Add Morning Brief to sidebar

Add new nav item to the INTELLIGENCE section of the sidebar, as the **first item** (above IFA Prioritisation):

```
Label: Morning Brief
Route: /intelligence/morning-brief
Icon: Newspaper (from lucide-react, 16px, strokeWidth 1.5)
```

Nav item styling per MASTER.md Section 6a:
- Default: body-sm (13px), text-secondary, icon text-tertiary
- Hover: bg-raised, text-primary, icon text-secondary
- Active: bg-raised, text-primary, font-weight 500, border-left 2px solid var(--accent)

### Hide Intelligence Overview

Comment out the Intelligence Overview nav item in `components/dashboard/sidebar.tsx`. Do not delete the route or page — only hide from navigation.

---

## 3. Route and Layout

```
Route: /intelligence/morning-brief
Layout: Uses existing app/layout.tsx shell
No new layout files needed
```

---

## 4. Data Sources

### 4a. Live: Yahoo Finance

Proxy via Next.js API route: `/api/market-data`

Fetch from: `https://query1.finance.yahoo.com/v8/finance/chart/{ticker}`

| Instrument | Ticker | Display Label |
|-----------|--------|---------------|
| FTSE All Share | `^FTAS` | FTSE ALL SHARE |
| 10yr Gilt Yield | `^TNX` | 10YR GILT YIELD |
| Sterling/Dollar | `GBPUSD=X` | STERLING |
| FTSE Volatility | `^VFTSE` | UK VOLATILITY |

For each instrument collect:
- `value`: current price / level
- `previousClose`: previous close
- `delta`: value minus previousClose
- `deltaPercent`: (delta / previousClose) * 100
- `timestamp`: ISO string of last update

Error handling: if Yahoo Finance is unavailable, return `null` for all fields. Do not throw.

### 4b. Live: GNews API

Proxy via Next.js API route: `/api/news`
API key: `.env.local` as `GNEWS_API_KEY`

Three queries run in parallel on page load:

```
Query 1: q="UK funds OR gilt yields OR Bank of England OR inflation"
         lang=en, country=gb, max=5, sortby=publishedAt

Query 2: q="IFA market OR financial adviser OR OEIC OR unit trust"
         lang=en, country=gb, max=5, sortby=publishedAt

Query 3: q="FTSE OR UK economy OR interest rates OR CPI"
         lang=en, country=gb, max=5, sortby=publishedAt
```

Deduplicate by URL across all three queries. Return top 8 most recent unique articles.

Each article: `title`, `source` (name), `publishedAt` (ISO), `description` (first 200 chars), `url`.

Fallback: if GNews unavailable, read `lib/data/raw/macro_signals.jsonl` (existing UC5 data). Flag with `usingFallback: true`.

### 4c. Live: Claude API Synthesis

API route: `/api/morning-synthesis`
Called after market data and news are both fetched.
Full prompt spec in Section 10.

### 4d. Static (build time)

| File | Content |
|------|---------|
| `lib/data/raw/ia_sector_flows.csv` | UC3 sector flows |
| `lib/data/raw/keyridge_funds_clean.json` | 22 funds |
| `lib/data/raw/keyridge_ranked.csv` | IFA universe |
| `lib/data/raw/keyridge_briefs.json` | Top 50 briefs |

---

## 5. Page Layout

Full width content page. No split panel.
Max content width: 1200px, centred.
Vertical scroll.
Padding: 24px (consistent with other Intelligence module pages per MASTER.md Section 4).

### Page Header

Inline header, not global topbar. Sits below the TopBar component.

```
Container:
  padding: 24px
  border-bottom: 1px solid var(--border)
  display: flex
  justify-content: space-between
  align-items: flex-start

Left side:
  Title: "Morning Brief"
    page-title style: 20px, font-semibold, text-primary, tracking-tight

  Subtitle: "Distribution intelligence for {today's date formatted as 'Thursday 17 April 2026'}"
    body-sm (13px), text-tertiary, margin-top 4px

Right side:
  Timestamp: "Last updated {HH:MM}"
    font-mono, 11px (caption), text-tertiary, tabular-nums
    margin-bottom 8px

  Refresh button:
    Secondary button style per MASTER.md Section 6h:
    background: var(--bg-card)
    color: var(--text-secondary)
    font: body-sm (13px), font-medium
    padding: 8px 16px
    border-radius: 6px
    border: 1px solid var(--border)
    transition: all 120ms ease
    hover: border-color var(--border-strong), color var(--text-primary)

    Icon: RefreshCw from lucide-react, 14px, before label text
    Default label: "Refresh"
    Loading label: "Refreshing..." with animate-spin on icon
    During refresh: button disabled, opacity 0.5
```

---

## 6. Section 1: Market Pulse

### Stat Cards Row

Five cards in a horizontal row. Same stat card spec as MASTER.md Section 6c.

```
Layout:
  Desktop: grid-cols-5, gap-4
  Tablet (< 1024px): grid-cols-3 first row + grid-cols-2 second row
  Mobile (< 640px): grid-cols-2

Card container (per MASTER.md Section 6c):
  background: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: 8px
  padding: 16px
  NO box-shadow
  hover: border-color var(--border-strong), transition 150ms ease
```

#### Card 1: FTSE All Share

```
Label: "FTSE ALL SHARE" — card-label style, icon: TrendingUp 16px
Value: current index level — data-xl (Geist Mono, 24px, font-semibold, tabular-nums)
  Format: comma separated, no decimals (e.g. "4,287")
Delta: data-sm (Geist Mono, 12px, tabular-nums)
  Format: "+42.3 (+1.0%)" or "-18.7 (-0.4%)"
  Positive: var(--success-text) #16A34A, "↑ " prefix
  Negative: var(--danger-text) #DC2626, "↓ " prefix
  Zero: var(--text-tertiary), no prefix
```

#### Card 2: 10yr Gilt Yield

```
Label: "10YR GILT YIELD" — card-label style, icon: Percent 16px
Value: shown as percentage — data-xl
  Format: "4.82%" (two decimals)
Delta: data-sm
  Format: "+12bps" or "-8bps" (convert percentage point change to basis points * 100)
  Positive (rising yields): var(--danger-text) — rising yields = headwind for bonds
  Negative (falling yields): var(--success-text) — falling yields = tailwind
```

#### Card 3: Sterling

```
Label: "STERLING" — card-label style, icon: PoundSterling 16px
Value: "£1 = $1.27" format — data-xl
  The "£1 = $" prefix in text-tertiary, value in text-primary
Delta: data-sm
  Format: percentage change vs previous close
```

#### Card 4: UK Volatility

```
Label: "UK VOLATILITY" — card-label style, icon: Activity 16px
Value: index level — data-xl
  Format: one decimal (e.g. "18.4")
Delta: data-sm, absolute change
Special: if value > 25, card gets border-top: 2px solid var(--warning)
  This consumes one amber slot when active.
```

#### Card 5: Top IA Sector Inflow (static data)

```
Label: "TOP IA SECTOR" — card-label style, icon: ArrowUpRight 16px
  Label colour: var(--success-text) instead of text-tertiary (always emerald)
Value: sector name — section-heading style (14px, font-semibold, text-primary)
  e.g. "Volatility Managed"
Sub-value: "+£275m · Feb 2026" — caption (Geist Mono, 11px, text-tertiary)
No delta indicator (monthly data, not live)
```

### Synthesis Sentence

Below the five cards, full width:

```
Container:
  margin-top: 16px
  padding-bottom: 16px
  border-bottom: 1px solid var(--border-subtle)

Text:
  font-size: 16px (body-lg, slightly larger than body)
  font-weight: 500
  color: var(--text-primary)
  line-height: 1.6
  max-width: 900px
```

No label or wrapper — the sentence stands alone.

Content: AI-generated `synthesis_sentence` from Claude API. Max 30 words. Must contain at least one specific number and one fund type reference.

### Loading State

Five skeleton cards (same dimensions as real cards):
```
Skeleton card:
  background: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: 8px
  padding: 16px

  Label skeleton: height 11px, width 80px, bg var(--bg-subtle), border-radius 4px
  Value skeleton: height 24px, width 100px, bg var(--bg-subtle), border-radius 4px, margin-top 8px
  Delta skeleton: height 12px, width 60px, bg var(--bg-subtle), border-radius 4px, margin-top 4px

  Animation: opacity fade 1.5s ease-in-out infinite (NOT shimmer — per MASTER.md prohibited list)
```

One skeleton line below for the synthesis sentence:
```
height: 16px, width: 60%, bg var(--bg-subtle), border-radius 4px
```

---

## 7. Section 2: Fund Mandate Impact

### Section Header

```
Header: "What This Means for Distribution"
  section-heading style: 14px, font-semibold, text-primary

Subheader: "How current market conditions affect the fund range and IFA conversations"
  body-sm (13px), text-tertiary, margin-top 4px

Spacing: margin-top 32px (gap-8 between major sections per MASTER.md)
```

### Impact Card Grid

```
Layout:
  Desktop: grid-cols-2, gap-4
  Mobile: grid-cols-1
```

Cards generated by Claude synthesis API. 3-5 cards per day (Claude decides based on materiality).

### Individual Impact Card

```
Container:
  background: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: 8px
  padding: 20px
  NO box-shadow
  hover: border-color var(--border-strong), transition 150ms ease

Top section (card header):
  Row 1:
    Left: mandate display name — body (14px), font-medium, text-primary
    Right: sentiment badge
      Positive: bg var(--success-subtle), border 1px solid rgba(34,197,94,0.20),
                text var(--success-text), "↑ Favourable"
      Neutral:  bg var(--bg-subtle), border 1px solid var(--border),
                text var(--text-secondary), "→ Neutral"
      Negative: bg var(--danger-subtle), border 1px solid rgba(239,68,68,0.20),
                text var(--danger-text), "↓ Headwind"
      Badge style: badge-text (11px, font-semibold, uppercase, tracking-wide),
                   padding 2px 8px, border-radius 9999px

  Row 2 (margin-top 4px):
    Left: fund names — caption (Geist Mono, 11px, text-tertiary)
    Right: IA sector name — caption (Geist Mono, 11px, text-tertiary)

Divider:
  border-bottom: 1px solid var(--border-subtle)
  margin: 12px 0

Card body (three labelled rows, gap 12px):

  Row 1 — WHAT HAPPENED:
    Label: card-label style (11px, font-medium, uppercase, tracking 0.06em, text-tertiary)
    Content: body-sm (13px), text-secondary, line-height 1.5
    Max: one sentence

  Row 2 — WHY IT MATTERS:
    Label: card-label style
    Content: body-sm (13px), text-secondary, line-height 1.5
    Max: one sentence

  Row 3 — TALKING ANGLE:
    See Talking Angle spec below.
```

### Talking Angle Row (amber-managed)

Only ONE card on the page shows the full amber treatment at a time. The highest-sentiment card (first positive, or first neutral if no positive) gets it by default.

```
Amber treatment (active card):
  Container:
    background: var(--accent-subtle) — rgba(245, 158, 11, 0.08)
    border: 1px solid rgba(245, 158, 11, 0.20)
    border-radius: 6px
    padding: 10px 12px
    margin-top: 4px

  Label: "TALKING ANGLE"
    card-label style but color: var(--accent) instead of text-tertiary

  Content: body-sm (13px), text-secondary, font-weight 500, line-height 1.5

Neutral treatment (other cards):
  Container: no background, no border, same padding
  Label: "TALKING ANGLE" in text-tertiary (standard card-label)
  Content: body-sm (13px), text-secondary, font-weight 400

  Affordance: a subtle text button below the content:
    "Focus this angle" in caption size (11px), text-tertiary
    hover: text-secondary
    On click: transfers amber treatment to this card
    (previous amber card reverts to neutral)
```

### Loading State

Two skeleton cards at correct card height:
```
Skeleton impact card:
  Same container as real card
  Three skeleton rows inside (label + content line)
  Opacity fade animation
```

---

## 8. Section 3: Prioritised Outreach This Week

### Section Header

```
Header: "Prioritised Outreach"
  section-heading style

Subheader: "IFAs most relevant to this week's market conditions"
  body-sm, text-tertiary

Info badge (below subheader, margin-top 8px):
  "Based on the public IFA universe · Not your existing client relationships"
  Style: inline-flex, bg var(--bg-subtle), border 1px solid var(--border-subtle),
         padding 4px 10px, border-radius 9999px,
         font-mono 11px, text-tertiary

Spacing: margin-top 32px
```

### IFA Selection Logic (component-level, not Claude)

```typescript
1. Read mandate_categories from Section 2 impact cards
   where sentiment === 'positive' || sentiment === 'neutral'
2. Filter IFA ranked list to firms where
   top_mandate_category matches those categories
3. Sort by priority_score descending
4. Take top 5
5. If fewer than 5 match, fill remaining slots with
   top overall priority_score firms
```

### Table Spec

Compact table per MASTER.md Section 6f. Not expandable rows.

```
Container:
  background: var(--bg-card)
  border: 1px solid var(--border)
  border-radius: 8px
  overflow: hidden

Columns and widths:
  #        | 40px   | data-sm, text-tertiary, centre-aligned
  Firm     | 200px  | body-sm, font-medium, text-primary
  Town     | 120px  | body-sm, text-secondary
  Advisers | 80px   | data-sm, Geist Mono, text-primary, right-aligned
  Mandate  | 140px  | caption, text-tertiary
  Why This Week | 1fr | body-sm, text-secondary
  Action   | 100px  | accent colour text link
```

Header row per MASTER.md Section 6f:
```
background: var(--bg-raised) — NOTE: use bg-raised for table headers in cards
border-bottom: 1px solid var(--border-strong)
th: card-label style (11px, font-medium, uppercase, tracking 0.06em, text-tertiary)
padding: 10px 12px
```

Body rows:
```
border-bottom: 1px solid var(--border-subtle)
hover: background var(--bg-raised), transition 100ms ease
td: padding 10px 12px
```

### "Why This Week" Lookup

```typescript
const WHY_THIS_WEEK: Record<string, string> = {
  multi_asset_cautious: "Gilt yield story — cautious drawdown clients",
  multi_asset_balanced: "Mixed asset inflows — balanced portfolio demand",
  multi_asset_growth: "Growth mandate timing — equity positioning",
  multi_asset_aggressive: "Risk-on signals — growth-seeking clients",
  multi_asset_income: "Safe-haven rotation — income mandate timing",
  uk_equity_income: "UK equity pressure — income alternative angle",
  uk_equity: "UK equity — domestic allocation conversation",
  global_equity: "Global diversification — international mandate",
  european_equity: "European allocation — continental positioning",
  north_american_equity: "US market signals — North America mandate",
  corporate_bond: "Credit spreads — fixed income conversation",
  global_macro_bond: "Macro bond timing — global fixed income",
  money_market: "Rate environment — liquidity positioning",
};
```

### Action Column

```
"View Brief →" text link
  font: body-sm (13px), font-medium
  color: var(--accent)
  hover: color var(--accent-hover), text-decoration underline
  cursor: pointer

On click: opens BriefSlideOver panel
```

### BriefSlideOver Panel

```
Overlay:
  position: fixed, inset: 0, z-index: 50
  background: rgba(0, 0, 0, 0.24)
  Click outside to close

Panel:
  position: fixed, top: 0, right: 0, bottom: 0
  width: 480px (desktop), 100vw (mobile < 640px)
  background: var(--bg-card)
  border-left: 1px solid var(--border)
  overflow-y: auto
  z-index: 51

Animation (Framer Motion):
  Enter: translateX(100%) → translateX(0), opacity 0 → 1
  Exit: translateX(0) → translateX(100%), opacity 1 → 0
  Duration: 0.2s
  Easing: [0.25, 0.1, 0.25, 1] (MASTER.md page transition easing)

Header:
  padding: 20px
  border-bottom: 1px solid var(--border)
  display: flex, justify-content: space-between, align-items: flex-start

  Firm name: section-heading (14px, font-semibold, text-primary)
  Score badge: data-sm, Geist Mono, coloured by getFitScoreColor
  Size tier badge: badge-text style, bg-subtle, border-subtle, text-secondary

  Close button: X icon (16px), text-tertiary, hover text-secondary
    position: top-right, padding 4px, border-radius 4px

Body:
  padding: 20px
  Three sections matching IFA module brief layout:

  Section 1 — WHO THEY ARE:
    Label: card-label style, text-tertiary, uppercase
    Content: body (14px), text-secondary, line-height 1.6

  Section 2 — WHY KEYRIDGE FITS:
    Same label and content styling

  Section 3 — OPENING LINE (amber treatment):
    Container: bg var(--accent-subtle), border 1px solid rgba(245,158,11,0.20),
               border-radius 8px, padding 16px
    Label: card-label style but color var(--accent)
    Content: body (14px), text-secondary, font-weight 500, line-height 1.6
```

---

## 9. Section 4: This Week's Talking Point

### Section Header

```
Header: "This Week's Talking Point"
  section-heading style

Subheader: "Ready to share with your team"
  body-sm, text-tertiary

Spacing: margin-top 32px
```

### Card

```
Container:
  background: var(--bg-card)
  border: 1px solid var(--border) — default border, not subtle
  border-radius: 8px
  padding: 24px (larger than standard card padding)
  NO box-shadow

Paragraph:
  font-size: 16px (body-lg)
  font-weight: 400
  color: var(--text-secondary)
  line-height: 1.7
  max-width: 800px
  Max 120 words

Divider:
  border-bottom: 1px solid var(--border-subtle)
  margin: 20px 0 12px

Metadata:
  font-family: var(--font-mono)
  font-size: 11px (caption)
  color: var(--text-tertiary)
  font-variant-numeric: tabular-nums
  "Generated {date} {time} · Based on {n} news signals and IA sector flow data"

Action buttons (margin-top 16px, display flex, gap 8px):
  Primary — "Copy":
    Primary button per MASTER.md Section 6h:
    background: var(--accent), color white, padding 8px 16px, border-radius 6px
    hover: background var(--accent-hover)
    On click: copies paragraph to clipboard
    Label changes to "Copied ✓" for 2 seconds, then reverts
    NOTE: this is an amber use — count in budget

  Secondary — "Share via email":
    Secondary button style
    Opens mailto: with subject "This week's distribution talking point — {date}"
    and paragraph in email body
```

---

## 10. Claude API Synthesis Specification

### API Route

```
Route: /api/morning-synthesis
Method: POST
```

### Request Body

```typescript
interface SynthesisRequest {
  marketData: {
    ftseAllShare: MarketDataPoint | null;
    giltYield: MarketDataPoint | null;
    sterling: MarketDataPoint | null;
    volatility: MarketDataPoint | null;
  };
  newsArticles: Array<{
    title: string;
    source: string;
    publishedAt: string;
    description: string;
  }>; // max 5
  sectorFlows: Array<{
    sector: string;
    net_retail_sales_gbpm: number;
    month: string;
  }>; // top 6 by absolute flow
  funds: Array<{
    fund_name: string;
    ia_sector: string;
    mandate_category: string;
    dynamic_planner_profile: number | null;
  }>; // all funds from fund range
}
```

### Claude API Call

```
Model: claude-sonnet-4-6
Max tokens: 1000
```

### System Prompt

```
You are a distribution intelligence analyst for a UK asset manager selling OEICs and unit trusts through the IFA channel. You write concise, specific, actionable morning intelligence for distribution teams. Every sentence must contain a specific data point — a number, a fund type, a named market event, or a named sector. Never write generic statements. Write as a knowledgeable colleague, not a marketing document. Respond only with valid JSON.
```

### User Prompt

```
Generate a morning distribution brief from this data.

MARKET DATA:
{formatted market prices and deltas}

TOP NEWS SIGNALS (most recent first):
{article 1: title · source · date · description}
{article 2...}
...

IA SECTOR FLOWS (most recent month available):
{sector: net flow in £m}
...

FUND RANGE:
{fund name · IA sector · mandate category}
...

Return exactly this JSON structure with no preamble:
{
  "synthesis_sentence": "string",
  "impact_cards": [
    {
      "mandate_category": "string",
      "fund_names": ["string"],
      "ia_sector": "string",
      "sentiment": "positive" | "neutral" | "negative",
      "what_happened": "string",
      "why_it_matters": "string",
      "talking_angle": "string"
    }
  ],
  "talking_point": "string"
}

Rules:
- synthesis_sentence: max 30 words, must contain at least one specific number and one fund type reference
- impact_cards: 3-5 cards only, only include mandates where something material happened this week based on the news and market data provided
- Each what_happened and why_it_matters: max 25 words
- Each talking_angle: max 30 words
- talking_point: max 120 words, first person plural, specific enough to forward to an RM team today
- mandate_category values must exactly match one of: multi_asset_cautious, multi_asset_balanced, multi_asset_growth, multi_asset_aggressive, multi_asset_income, uk_equity_income, uk_equity, global_equity, european_equity, north_american_equity, corporate_bond, global_macro_bond, money_market
```

### Response Shape

```typescript
interface SynthesisResponse {
  synthesis_sentence: string;
  impact_cards: ImpactCard[];
  talking_point: string;
}

interface ImpactCard {
  mandate_category: string;
  fund_names: string[];
  ia_sector: string;
  sentiment: "positive" | "neutral" | "negative";
  what_happened: string;
  why_it_matters: string;
  talking_angle: string;
}
```

---

## 11. TypeScript Interfaces

```typescript
// ── Market Data ──────────────────────────────────────────

interface MarketDataPoint {
  value: number;
  previousClose: number;
  delta: number;
  deltaPercent: number;
  timestamp: string;
}

interface MarketDataResponse {
  ftseAllShare: MarketDataPoint | null;
  giltYield: MarketDataPoint | null;
  sterling: MarketDataPoint | null;
  volatility: MarketDataPoint | null;
  fetchedAt: string;
}

// ── News ─────────────────────────────────────────────────

interface NewsArticle {
  title: string;
  source: string;
  publishedAt: string;
  description: string;
  url: string;
}

interface NewsResponse {
  articles: NewsArticle[];
  usingFallback: boolean;
  fetchedAt: string;
}

// ── Sector Flows ─────────────────────────────────────────

interface SectorFlow {
  sector: string;
  net_retail_sales_gbpm: number;
  month: string;
}

// ── Fund Data ────────────────────────────────────────────

interface FundData {
  fund_name: string;
  ia_sector: string;
  mandate_category: string;
  dynamic_planner_profile: number | null;
}

// ── Synthesis ────────────────────────────────────────────

interface SynthesisRequest {
  marketData: MarketDataResponse;
  newsArticles: NewsArticle[];
  sectorFlows: SectorFlow[];
  funds: FundData[];
}

interface ImpactCard {
  mandate_category: string;
  fund_names: string[];
  ia_sector: string;
  sentiment: "positive" | "neutral" | "negative";
  what_happened: string;
  why_it_matters: string;
  talking_angle: string;
}

interface SynthesisResponse {
  synthesis_sentence: string;
  impact_cards: ImpactCard[];
  talking_point: string;
}

// ── IFA (from existing adapter) ──────────────────────────

// Uses RealIFAFirm from lib/data/ifa-real-data.ts
// No new interface needed — reuse existing

// ── Page Aggregate ───────────────────────────────────────

interface MorningBriefPageData {
  marketData: MarketDataResponse | null;
  news: NewsResponse | null;
  synthesis: SynthesisResponse | null;
  sectorFlows: SectorFlow[];
  funds: FundData[];
  ifaRanked: RealIFAFirm[];
  briefs: IFABrief[];
  loadingPhase: "market" | "news" | "synthesis" | "complete" | "error";
  lastRefreshed: string | null;
}
```

---

## 12. Component Hierarchy

```
app/intelligence/morning-brief/
  page.tsx                          ← Server component, loads static data, renders client wrapper

src/components/morning-brief/
  MorningBriefClient.tsx            ← Client component, orchestrates API calls and state
  MarketPulse.tsx                   ← Section 1: cards row + synthesis sentence
  MarketCard.tsx                    ← Individual instrument stat card
  ImpactGrid.tsx                    ← Section 2: grid of impact cards
  ImpactCard.tsx                    ← Individual mandate impact card
  TalkingAngle.tsx                  ← Amber row within impact card (reads amber context)
  OutreachTable.tsx                 ← Section 3: IFA table
  OutreachRow.tsx                   ← Individual IFA table row
  BriefSlideOver.tsx                ← Slide-over panel for pre-call brief
  TalkingPoint.tsx                  ← Section 4: full-width talking point card
  LoadingPhaseIndicator.tsx         ← Three-phase progress indicator
  SkeletonCard.tsx                  ← Reusable skeleton for loading states

app/api/
  market-data/route.ts              ← Yahoo Finance proxy
  news/route.ts                     ← GNews API proxy with fallback
  morning-synthesis/route.ts        ← Claude API synthesis
```

---

## 13. Loading Sequence

Three phases. Show progress via LoadingPhaseIndicator.

### Phase 1 — Market Data (~500ms)

```
Progress indicator at top of content area:
  Three steps displayed horizontally, subtle:
  ● "Fetching market data..." (active — text-primary, pulse dot emerald)
  ○ "Analysing signals..." (pending — text-tertiary)
  ○ "Generating brief..." (pending — text-tertiary)

UI state:
  Section 1: skeleton cards
  Sections 2-4: skeleton placeholders
```

### Phase 2 — News Fetch (parallel with Phase 1, ~1s)

```
Both market data and news fetch fire simultaneously (Promise.all).
When both complete, Phase 3 begins automatically.

Progress indicator updates:
  ✓ "Market data loaded" (complete — text-tertiary, checkmark)
  ● "Analysing signals..." (active — text-primary, pulse dot)
  ○ "Generating brief..." (pending — text-tertiary)

UI state:
  Section 1: real market data populates cards
  Sections 2-4: still skeleton
```

### Phase 3 — Claude Synthesis (~3-5s)

```
Progress indicator updates:
  ✓ "Market data loaded" (complete)
  ✓ "Signals analysed" (complete)
  ● "Generating brief..." (active — text-primary, pulse dot)

UI state:
  Section 1: fully populated (cards + synthesis sentence)
  Sections 2-4: skeleton while Claude processes

When Claude returns:
  All sections populate
  Progress indicator fades out (opacity 0 over 300ms, then display none)
```

### Progress Indicator Spec

```
Container:
  display: flex, gap: 16px, align-items: center
  padding: 12px 0
  margin-bottom: 8px

Step (each):
  display: flex, align-items: center, gap: 6px

  Dot:
    width: 6px, height: 6px, border-radius: 50%
    Active: bg var(--success), animation pulse-dot 2.2s ease-in-out infinite
    Pending: bg var(--text-disabled)
    Complete: bg var(--success), no animation

  Label:
    font-size: 11px (caption)
    Active: text-primary, font-weight 500
    Pending: text-tertiary
    Complete: text-tertiary

  Checkmark (complete state):
    Replace dot with Check icon (12px), text var(--success-text)
```

---

## 14. Error State Handling

### Yahoo Finance Failure

```
Market cards show:
  Value: "—" in data-xl, text-disabled
  Delta: hidden
  Badge on each card: "Live prices unavailable"
    bg var(--warning-subtle), text var(--warning-text), caption size

Synthesis sentence fallback:
  "Market data unavailable — showing intelligence based on recent signals."
  Styled same as normal synthesis sentence but in text-tertiary
```

### GNews Failure

```
Fall back to lib/data/raw/macro_signals.jsonl.

Caption below news-derived content:
  "Live news unavailable · Using recent signal archive"
  font-mono, 11px, text-tertiary
  margin-top 4px
```

### Claude API Failure

```
Sections 2 and 4 show:
  Centred in card area:
  "Synthesis unavailable · Refresh to retry"
  body-sm, text-tertiary

Section 3 still shows IFAs:
  Derived from static data, not Claude
  Uses default mandate selection (top 5 by priority_score)
  "Why This Week" column shows general text instead of market-specific
```

### All Errors

Page remains usable. No broken layouts. No error prevents the user seeing any content. Every section has a graceful fallback.

---

## 15. Amber Budget Accounting

Per MASTER.md, maximum 3 amber elements per page view.

### Slot Allocation

| Slot | Element | When Active |
|------|---------|-------------|
| 1 | Talking Angle treatment on highest-sentiment impact card (Section 2) | Always when cards are loaded |
| 2 | OPENING LINE treatment in BriefSlideOver panel (Section 3) | Only when slide-over is open |
| 3 | Copy button in Section 4 (primary amber button) | Always present |

Note: Slot 3 (Copy button) is a primary button. The secondary "Share via email" button is not amber. This gives us exactly 2 permanent amber elements + 1 conditional.

### Edge Case: Slide-Over Open

When BriefSlideOver opens:
- Slot 2 (OPENING LINE) becomes active
- Slot 1 (Talking Angle) must switch to neutral styling
- This maintains maximum 3 simultaneous amber elements (Talking Angle neutral + OPENING LINE amber + Copy button amber)

Actually with Copy button always present, we have:
- Default state: Talking Angle (1) + Copy button (2) = 2 amber
- Slide-over open: OPENING LINE (1) + Copy button (2) = 2 amber, Talking Angle goes neutral
- Volatility warning: if ^VFTSE > 25, card border-top uses var(--warning) which is same hex as amber = 3 amber max

### Implementation

```typescript
// Lifted state or React context
type AmberSlotOwner = "impact-card" | "slide-over";

const [amberSlotOwner, setAmberSlotOwner] = useState<AmberSlotOwner>("impact-card");

// When slide-over opens:
setAmberSlotOwner("slide-over");

// When slide-over closes:
setAmberSlotOwner("impact-card");

// TalkingAngle reads this:
const isAmber = amberSlotOwner === "impact-card" && isHighestSentiment;
```

### Volatility Warning Edge Case

If ^VFTSE > 25 AND slide-over is open AND Talking Angle is on a card:
- Volatility card border-top (amber) + OPENING LINE (amber) + Copy button (amber) = 3
- Talking Angle must be neutral
- This is at the limit but compliant

---

## 16. What Must NOT Change

- `design-system/MASTER.md`
- `lib/mock-data.ts`
- `lib/data/ifa-real-data.ts` (read-only, no modifications)
- Any existing intelligence module pages
- `components/dashboard/topbar.tsx`
- Any components in `components/ui/`

`components/dashboard/sidebar.tsx` is the only existing file modified (add nav item, hide Overview).
