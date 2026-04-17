# UC4: IFA Prioritisation — Update Specification

> Branch: `feature/uc4-real-data`
> Scope: `src/app/intelligence/ifa-prioritisation/page.tsx` only.
> Design authority: `design-system/MASTER.md` — all tokens referenced verbatim.
> UI/UX validation: ui-ux-pro-max Data-Dense Dashboard pattern applied.

---

## Pre-Delivery Checklist (ui-ux-pro-max)

Before implementation is complete, verify:

- [ ] No emojis as icons — all icons use Lucide (consistent with existing page)
- [ ] `cursor-pointer` on all new clickable elements
- [ ] Hover transitions use 120ms ease (MASTER.md Section 8, Rule 7)
- [ ] Empty state provides helpful message, not blank space (UX guideline: Feedback/Empty States)
- [ ] Expand/collapse animation uses ease-out for entering, ease-in for exiting (UX guideline: Animation/Easing)
- [ ] Maximum 1–2 animated elements per state change (UX guideline: Animation/Excessive Motion)
- [ ] `prefers-reduced-motion` respected — wrap Framer Motion in `useReducedMotion()` check
- [ ] Amber accent count ≤ 3 per page view (MASTER.md Rule 2)
- [ ] All numeric values use Geist Mono with `tabular-nums` (MASTER.md Rule 3)
- [ ] No prohibited animations: no hover lift, no shadow growth, no scale transforms, no bounce/elastic (MASTER.md Section 8)

---

## Change 1: Score Component Labels

### Location

`DetailPanel` → Fit Score Breakdown panel → five `<ScoreRow>` calls (lines ~1093–1097).

### Exact changes

```
Old label              → New label
─────────────────────────────────────
Philosophy match       → Firm Scale
Platform overlap       → Distribution Match
AUM band fit           → Regulatory Fit
Growth trajectory      → Fund Fit
Signal recency         → Market Timing
```

### Visual styling

Identical. No change to `ScoreRow` component, colours, bar widths, or max values.

### Interface rename

```typescript
// Before
interface ScoreBreakdown {
  philosophyMatch: number;   // max 30
  platformOverlap: number;   // max 25
  aumBandFit: number;        // max 20
  growthTrajectory: number;  // max 15
  signalRecency: number;     // max 10
}

// After
interface ScoreBreakdown {
  firmScale: number;         // max 30
  distributionMatch: number; // max 25
  regulatoryFit: number;     // max 20
  fundFit: number;           // max 15
  marketTiming: number;      // max 10
}
```

Update all 25 mock data objects to use new field names. Numeric values unchanged.

---

## Change 2: Column Replacement — AUM → Review Count + Score

### Current grid (8 columns)

```
40px  220px  100px  90px   130px  1fr    90px   100px
#     Firm   Region AUM    Score  Signal FCA    Action
```

### New grid (7 columns — AUM and Score merge)

```
40px  220px  100px  180px  1fr    90px   100px
#     Firm   Region SCORE  Signal FCA    Action
```

### Column header

Single header: `"SCORE"` — `card-label` style per MASTER.md Section 3:
```
font-size: 11px
font-weight: 500
color: var(--text-tertiary)
text-transform: uppercase
letter-spacing: 0.06em
```

### Cell layout (stacked vertically, left-aligned)

```
┌───────────────────────────────┐
│ 6,776 reviews                 │  ← context line (optional)
│ ████████████░░░░░░░░  91      │  ← FitBar (unchanged)
└───────────────────────────────┘
```

**Context line rendering logic:**

```typescript
function renderContextLine(review_count: number | null, adviser_count: number | null): string | null {
  if (review_count && review_count > 0) {
    return `${review_count.toLocaleString('en-GB')} reviews`;
  }
  if (adviser_count && adviser_count > 0) {
    return `${adviser_count} advisers`;
  }
  return null; // render nothing
}
```

**Context line styling:**

```
// The numeric portion (e.g. "6,776") — Geist Mono per MASTER.md Rule 3
font-family: var(--font-mono)
font-size: 12px                        // data-sm
font-variant-numeric: tabular-nums
color: var(--text-tertiary)

// The word "reviews" or "advisers" — Geist Sans
font-family: var(--font-sans)
font-size: 12px
color: var(--text-tertiary)
```

Implementation note: render as two `<span>` elements — one mono for the number, one sans for the label. This follows MASTER.md Section 3: "Geist Mono must not be used for… descriptions".

**FitBar** renders identically to current. No changes.

### Removed fields

```typescript
// Remove from IFARanking:
estAUM: string;       // deleted
estAUMValue: number;  // deleted
```

### New fields

```typescript
review_count: number | null;
adviser_count: number | null;
```

---

## Change 3: Panel Order in Expanded Row

### Location

`DetailPanel` component — 3-column CSS grid.

### Change

| Column | Before | After |
|--------|--------|-------|
| 1 (left) | Firm Profile | Firm Profile *(unchanged)* |
| 2 (middle) | Intelligence Signals | **Fit Score Breakdown** |
| 3 (right) | Fit Score Breakdown | **Intelligence Signals** |

Swap the JSX blocks. `gridTemplateColumns: "1fr 1fr 1fr"` remains.

No internal changes to either panel's content or styling.

---

## Change 4: Intelligence Signals — Three Display States

### Location

Intelligence Signals panel (now column 3 of `DetailPanel` after Change 3).

### Control prop

```typescript
signal_count: number; // added to IFARanking
```

### State A — Rich signals (`signal_count >= 3`)

No change. Render existing signal list verbatim.

### State B — Limited signals (`signal_count === 1 || signal_count === 2`)

Render existing signals (1 or 2 items), then append:

```
Container:
  border-top: 1px solid var(--border-subtle)   // #F0F0EE
  margin-top: 12px
  padding-top: 10px

Text:
  font-family: var(--font-mono)                // caption style per MASTER.md
  font-size: 11px
  letter-spacing: 0.01em
  line-height: 1.4
  color: var(--text-tertiary)                  // #999999
  margin: 0

Copy:
  "Additional public signals limited for this firm."
  "Profile based on FCA register and VouchedFor data."
  (Two lines, or single block with line break)
```

### State C — No signals (`signal_count === 0`)

Replace signal list entirely with centred empty state. This follows the ui-ux-pro-max UX guideline "Empty States: show helpful message and action, not blank empty screens".

```
Container:
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  min-height: 100px
  text-align: center
  gap: 8px

Icon — muted circle with dash:
  width: 28px, height: 28px
  border-radius: 50%
  border: 1.5px solid var(--border-strong)     // #D4D4D0
  display: flex, align-items: center, justify-content: center

  Inner dash:
    width: 10px, height: 1.5px
    background: var(--text-disabled)            // #C4C4C4
    border-radius: 1px

Primary text:
  font-size: 12px                              // between caption and body-sm
  color: var(--text-tertiary)
  Copy: "Limited public signals available"

Secondary text:
  font-family: var(--font-mono)                // caption style
  font-size: 11px
  color: var(--text-tertiary)
  Copy: "Intelligence based on FCA register data only"
```

### Note

`signal_count` controls display state independently of `signals.length`. In mock data, keep them consistent. In production, `signal_count` will be server-computed and may differ from the number of signals in the detail payload.

---

## Change 5: Mandate Filter Options

### Location

First `<select>` in the filter bar within `Layer1` (line ~1232).

### Current options

```
Global Systematic | UK Balanced | Diversified Income | Absolute Return | Strategic Bond
```

### New options

| `value` | Display text |
|---------|-------------|
| `"all"` | `All Mandates` |
| `"cautious_multi_asset"` | `Cautious Multi-Asset — Portfolio III · DRM III` |
| `"balanced_multi_asset"` | `Balanced Multi-Asset — Portfolio IV · DRM IV` |
| `"growth_multi_asset"` | `Growth Multi-Asset — Portfolio V · DRM V · Portfolio VI · DRM VI` |
| `"aggressive_multi_asset"` | `Aggressive Multi-Asset — Portfolio VII` |
| `"monthly_income"` | `Monthly Income — Diversified Monthly Income` |
| `"uk_equity_income"` | `UK Equity Income — UK Equity Income Fund` |
| `"global_equity"` | `Global Equity — Global Equity Fund` |
| `"uk_equity"` | `UK Equity — UK Equity Fund` |
| `"corporate_bond"` | `Corporate Bond — Corporate Bond Fund` |
| `"european_equity"` | `European Equity — European Fund` |
| `"north_american_equity"` | `North American Equity — North American Fund` |

### Implementation

Use native `<select>` + `<option>`. Display format: `"{Primary} — {Secondary}"` combined into a single string per option. Native selects don't support rich child content, but the em-dash separator provides visual distinction. This maintains browser-native behaviour consistent with the existing filter implementation.

### Lookup for display labels (used in stats strip)

```typescript
const MANDATE_LABELS: Record<string, string> = {
  all: "current",
  cautious_multi_asset: "Cautious Multi-Asset",
  balanced_multi_asset: "Balanced Multi-Asset",
  growth_multi_asset: "Growth Multi-Asset",
  aggressive_multi_asset: "Aggressive Multi-Asset",
  monthly_income: "Monthly Income",
  uk_equity_income: "UK Equity Income",
  global_equity: "Global Equity",
  uk_equity: "UK Equity",
  corporate_bond: "Corporate Bond",
  european_equity: "European Equity",
  north_american_equity: "North American Equity",
};
```

### State changes

- Initial value: `"all"` (was `"Global Systematic"`)
- Stats strip text: `"847 match {MANDATE_LABELS[selectedMandate]} criteria"`
- Filter logic: if `selectedMandate !== "all"`, show only firms where `ifa.active_mandate === selectedMandate`

### New field on `IFARanking`

```typescript
active_mandate: string; // one of the mandate values above (excluding "all")
```

---

## Change 6: Market Context Strip

### Location

Between the stats strip and the ranked table. Insert after the `"10,847 IFAs in universe…"` div, before the table container.

### Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ●  Volatility Managed and Mixed 40-85% saw the strongest…   Feb 2026 data │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Container spec

```
background: var(--bg-raised)               // #F3F3F1
border: 1px solid var(--border)            // #E8E8E5
border-radius: 6px                         // rounded-md per MASTER.md
padding: 8px 12px
margin-bottom: 16px
display: flex
align-items: center
gap: 8px
```

No box-shadow (MASTER.md Rule 1: "no card shadows on light backgrounds").

### Pulse dot (left)

```
width: 6px
height: 6px
border-radius: 50%
flex-shrink: 0

Emerald (positive inflows):
  background: var(--success)               // #22C55E
  animation: pulse-dot 2.2s ease-in-out infinite

Amber (mixed/negative):
  background: var(--warning)               // #F59E0B
  animation: pulse-dot 2.2s ease-in-out infinite
```

Uses existing `pulse-dot` keyframes from MASTER.md Section 8, Rule 6 (already in globals.css and tailwind config).

### Context text (centre)

```
font-size: 13px                            // body-sm
color: var(--text-secondary)               // #6B6B6B
flex: 1
line-height: 1.5
```

Note: Currency values within the text (e.g. "£275m", "£1.68bn") should use `<span>` with Geist Mono per MASTER.md Rule 3. Implementation may use inline spans for these.

### Date label (right)

```
font-family: var(--font-mono)              // caption style
font-size: 11px
color: var(--text-tertiary)                // #999999
font-variant-numeric: tabular-nums
white-space: nowrap
flex-shrink: 0
```

Static text: `"Feb 2026 data"` — hardcoded for now.

### Mandate-to-context lookup object

```typescript
type MarketContext = {
  text: string;
  dotColor: "emerald" | "amber";
};

const MARKET_CONTEXT: Record<string, MarketContext> = {
  all: {
    text: "Volatility Managed and Mixed 40-85% saw the strongest inflows in Feb 2026 — cautious and growth multi-asset remain well-timed.",
    dotColor: "emerald",
  },
  cautious_multi_asset: {
    text: "IA Volatility Managed: +£275m net inflows Feb 2026 — DRM III-IV sits in the top-inflow sector.",
    dotColor: "emerald",
  },
  balanced_multi_asset: {
    text: "IA Mixed 20-60%: steady inflows — Portfolio IV well-positioned against Jupiter Merlin Income (£1.68bn sector leader).",
    dotColor: "emerald",
  },
  growth_multi_asset: {
    text: "IA Mixed 40-85%: +£250m net inflows Feb 2026 — Portfolio V-VI in the second strongest inflow sector.",
    dotColor: "emerald",
  },
  aggressive_multi_asset: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
  monthly_income: {
    text: "Safe-haven rotation underway — multi-asset income seeing consistent £1.3-1.5bn/month inflows per Calastone FFI.",
    dotColor: "emerald",
  },
  uk_equity_income: {
    text: "IA UK Equity Income: outflows easing — Keyridge UK Equity Income at £132m competes in a sector led by Artemis Income (£6.58bn). OCF advantage: 0.84% vs 0.87% sector average.",
    dotColor: "amber",
  },
  global_equity: {
    text: "IA Global: -£839m outflows Feb 2026 — sector under pressure. Timing calls for firms with income or cautious client focus.",
    dotColor: "amber",
  },
  uk_equity: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
  corporate_bond: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
  european_equity: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
  north_american_equity: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
};
```

### Dot colour mapping

```typescript
const dotStyle = context.dotColor === "emerald"
  ? { background: "var(--success)", animation: "pulse-dot 2.2s ease-in-out infinite" }
  : { background: "var(--warning)", animation: "pulse-dot 2.2s ease-in-out infinite" };
```

### Amber budget note

The pulse dot uses `var(--warning)` (#F59E0B) only when `dotColor === "amber"`. This is the semantic warning colour, not the accent. However, since `--warning` and `--accent` are the same hex (#F59E0B), treat amber-dot states as consuming one of the page's 3 amber slots. When the dot is emerald, the amber budget is unaffected.

Current amber usage on the page:
1. Active nav indicator (sidebar — always present)
2. "Show Pre-Call Brief" / "Build Outreach Brief" CTA button
3. Opening Line column background (only when brief is expanded)

The market context strip dot is emerald by default (`"all"` mandate), so amber budget is respected. When a user selects an amber-dot mandate AND expands a brief simultaneously, the dot + CTA button + Opening Line = 3 amber uses — at the limit but compliant.

---

## Change 7: Brief CTA Behaviour

### Two firm states

| Condition | Table "Action" button | Expanded row CTA | Click behaviour |
|-----------|----------------------|-------------------|-----------------|
| `brief_available === true` | `"Show Brief"` | `"Show Pre-Call Brief"` / `"Hide Brief"` | Toggle inline brief section |
| `brief_available === false` | `"Build Brief"` | `"Build Outreach Brief"` | Open existing modal |

### New state variable

```typescript
const [briefVisible, setBriefVisible] = useState<string | null>(null);
// IFA id whose brief is visible, or null
```

### Brief expand animation

Per MASTER.md Section 8 Rule 1 easing, and ui-ux-pro-max guideline (ease-out for entering, ease-in for exiting):

```tsx
<AnimatePresence>
  {briefVisible === ifa.id && (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1],   // MASTER.md page transition easing
      }}
      style={{ overflow: "hidden" }}
    >
      <BriefSection ifa={ifa} />
    </motion.div>
  )}
</AnimatePresence>
```

### Brief section container

```
border-top: 1px solid var(--border-subtle)    // #F0F0EE
padding: 24px
display: grid
grid-template-columns: 1fr 1fr 1fr
gap: 24px
```

### Column 1 — WHO THEY ARE

```
Label:
  card-label style per MASTER.md Section 3:
  font-size: 11px
  font-weight: 500
  color: var(--text-tertiary)
  text-transform: uppercase
  letter-spacing: 0.06em
  margin-bottom: 8px
  Copy: "WHO THEY ARE"

Content:
  body style per MASTER.md Section 3:
  font-size: 14px
  font-weight: 400
  color: var(--text-secondary)
  line-height: 1.6
  Data: ifa.brief_who
```

### Column 2 — WHY KEYRIDGE FITS

Same label and content styling as Column 1.

```
Label copy: "WHY KEYRIDGE FITS"
Data: ifa.brief_why
```

### Column 3 — OPENING LINE (visually distinct)

```
Container:
  background: var(--accent-subtle)              // rgba(245, 158, 11, 0.08) — per MASTER.md Section 2
  border: 1px solid rgba(245, 158, 11, 0.20)   // per badge-platform border token
  border-radius: 8px                            // rounded-lg per MASTER.md
  padding: 16px

Label:
  font-size: 11px
  font-weight: 500
  color: var(--accent)                          // #F59E0B
  text-transform: uppercase
  letter-spacing: 0.06em
  margin-bottom: 8px
  Copy: "OPENING LINE"

Content:
  font-size: 14px
  font-weight: 500                              // font-medium — emphasis
  color: var(--text-secondary)
  line-height: 1.6
  Data: ifa.brief_opener
```

### "Hide Brief" button style

When the brief section is visible, the CTA button switches to secondary style to release the amber slot:

```
// Per MASTER.md Section 6h — Secondary button:
background: var(--bg-card)                      // #FFFFFF
color: var(--text-secondary)                    // #6B6B6B
font-size: 13px
font-weight: 500
padding: 8px 16px
border-radius: 6px
border: 1px solid var(--border)                 // #E8E8E5
transition: all 120ms ease
hover: border-color var(--border-strong), color var(--text-primary)
Copy: "Hide Brief"
```

### Row collapse clears brief

When `expandedRow` changes (user clicks different row or collapses), also set `briefVisible` to `null`:

```typescript
const handleRowClick = (id: string) => {
  setExpandedRow(expandedRow === id ? null : id);
  if (expandedRow === id || expandedRow !== id) {
    setBriefVisible(null); // always clear brief on row change
  }
};
```

---

## New TypeScript Interfaces (Complete)

### `IFARanking` (updated)

```typescript
interface IFARanking {
  // Unchanged
  id: string;
  rank: number;
  firm: string;
  firmType: FirmType;
  region: string;
  fitScore: number;
  keySignal: string;
  fcaNumber: string;
  registrationDate: string;
  permissions: string;
  keyIndividuals: string[];
  officeAddress: string;
  companiesHouseNumber: string;
  signals: SignalItem[];

  // Renamed (Change 1)
  scoreBreakdown: ScoreBreakdown;       // field names changed

  // Removed
  // estAUM: string;                    — deleted (Change 2)
  // estAUMValue: number;               — deleted (Change 2)

  // Added (Change 2)
  review_count: number | null;
  adviser_count: number | null;

  // Added (Change 4)
  signal_count: number;                 // 0, 1, 2, or 3+

  // Added (Change 5)
  active_mandate: string;               // matches mandate filter values

  // Added (Change 7)
  brief_available: boolean;
  brief_who: string | null;
  brief_why: string | null;
  brief_opener: string | null;
}
```

### `ScoreBreakdown` (renamed fields)

```typescript
interface ScoreBreakdown {
  firmScale: number;         // max 30
  distributionMatch: number; // max 25
  regulatoryFit: number;     // max 20
  fundFit: number;           // max 15
  marketTiming: number;      // max 10
}
```

---

## Mock Data Additions

All 25 existing mock firms in the `ifaRankings` array at the top of `page.tsx` need these new fields.

### Distribution targets

| Field | Distribution across 25 firms |
|-------|------------------------------|
| `review_count` | 100–7,000. Null for firms 23, 24, 25. |
| `adviser_count` | 5–50 for all firms. Used as fallback display. |
| `signal_count` | 15 firms: 3 (State A). 6 firms: 1–2 (State B). 4 firms: 0 (State C). |
| `active_mandate` | ~8 cautious_multi_asset, ~5 balanced, ~4 growth, ~3 monthly_income, ~2 uk_equity_income, ~1 global_equity, ~2 others. |
| `brief_available` | `true` for all 25 mock firms. |
| `brief_who/why/opener` | Full content for firms 1–5. Realistic FS placeholder for 6–25. |

### Brief content — Firms 1–5

**Firm 1: Paradigm Capital Ltd**

```typescript
brief_who: "London-based DA firm with three senior investment professionals and a recent investment director hire from Schroders. RMAR-reported 22% AUM growth year-on-year. Manages £2.1bn with a stated mandate for systematic and factor-based allocation — outsources execution but runs an in-house investment committee.",
brief_why: "The Schroders hire and explicit systematic philosophy shift on their website points to readiness for WS Keyridge Portfolio V and DRM V. Their growth mandate profile and platform access via Transact and Quilter align with Keyridge's distribution footprint.",
brief_opener: "Sarah Chen's move from Schroders and your updated investment philosophy caught our attention — I'd like to understand how you're building out the systematic allocation that your website now references.",
```

**Firm 2: Attivo Group**

```typescript
brief_who: "Manchester-headquartered network with collective portfolio management permissions and a newly appointed Head of Investments. Systematic equity was recently added as a named strategy category on their approved list, opening fund access to the full adviser base.",
brief_why: "Network-level approved list inclusion is the distribution unlock — once on the Attivo list, their adviser base has immediate access. WS Keyridge Portfolio IV and DRM IV fit the balanced mandate profile their advisers service.",
brief_opener: "We noticed Attivo added systematic equity to your approved list in Q4 — I'd like to discuss how Keyridge's multi-asset range might complement your existing panel for balanced risk profiles.",
```

**Firm 3: Foster Denovo**

```typescript
brief_who: "National DA firm scaling rapidly with 28% client growth year-on-year. Launched an institutional proposition page targeting systematic mandates. Three senior investment professionals running an expanding research function — likely reviewing their fund universe to support growth.",
brief_why: "Fast-growing firms outgrow their existing fund panels. Foster Denovo's explicit institutional focus and systematic mandate interest maps directly to WS Keyridge Portfolio V-VI for growth clients and DRM III-IV for their cautious retiree segment.",
brief_opener: "Your 28% client growth and new institutional proposition page suggest you're expanding your fund universe — I'd like to explore whether Keyridge's multi-asset range fits the systematic allocation framework you're building.",
```

**Firm 4: Progeny Wealth**

```typescript
brief_who: "Leeds-based DA firm with a new Head of Investments from Jupiter AM and recently granted cross-border MiFID permissions. Investment committee page now features a growth mandate focus alongside their traditional cautious positioning.",
brief_why: "The Jupiter hire signals a pivot toward active-systematic blends. WS Keyridge DRM IV and Portfolio IV sit precisely at the balanced-to-growth transition. Cross-border permissions also open European distribution conversations.",
brief_opener: "Andrew Buchanan's appointment from Jupiter and your updated growth mandate focus suggest an evolution in your investment approach — I'd like to understand how you're sourcing multi-asset solutions for that expanded risk spectrum.",
```

**Firm 5: Informed Financial Planning**

```typescript
brief_who: "Oxford-based DA firm with a stated evidence-based and factor-investing philosophy. Shortlisted for Professional Adviser Best Client Outcomes award. Stable 14% AUM growth with a research-led investment process across three senior professionals.",
brief_why: "Their explicit factor-investing philosophy is the strongest alignment signal. WS Keyridge's systematic process mirrors their stated approach. Portfolio III-IV for their cautious-balanced client base, with the DRM range as a natural conversation for drawdown clients.",
brief_opener: "Your evidence-based philosophy and factor-investing focus align closely with how Keyridge constructs portfolios — I'd like to explore whether our systematic multi-asset range could complement your existing research framework.",
```

### Brief content — Firms 6–25

Write unique, realistic content for each firm. Template pattern — **do not copy verbatim, adapt per firm's data**:

```
brief_who: "[Region]-based [firmType] with [adviser_count] advisers managing approximately [AUM]. [Key recent activity from signals — new hires, platform changes, permissions updates]. Client base primarily [retail/HNW] with a [mandate style] focus."

brief_why: "[Specific signal or firm characteristic] creates a natural entry point for WS Keyridge [relevant fund names]. [Platform overlap / mandate fit / growth trajectory detail] suggests timing is favourable for an initial conversation."

brief_opener: "We've been following [specific development from firm's signals] — I'd like to understand how this affects your current approach to [relevant mandate area] and whether Keyridge's range could add value to your panel."
```

Each firm should reference:
- Their actual region, firm type, and AUM from mock data
- Their specific signals (from the `signals` array)
- A plausible Keyridge fund recommendation based on their `active_mandate`

---

## Edge Cases

### 1. Row collapse hides brief

If `expandedRow` changes for any reason, `briefVisible` resets to `null`. The brief section exit animation plays before the row collapses.

### 2. Market context strip — always visible

Never render an empty strip. The `"all"` key is the default fallback. If `selectedMandate` somehow doesn't match a key, fall back to `MARKET_CONTEXT["all"]`.

### 3. Review count formatting

Use `toLocaleString('en-GB')`. Both `0` and `null` mean "no reviews" — fall through to `adviser_count`. If both are null/zero, render nothing (FitBar renders alone).

### 4. Brief expand height animation

Use Framer Motion `animate={{ height: "auto" }}` with `overflow: "hidden"` on the motion wrapper. The inner content div carries the padding (24px) — do not put padding on the motion wrapper, as it would be visible during `height: 0`.

### 5. Reduced motion

Wrap the brief expand animation in a `prefers-reduced-motion` check:

```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// If reduced motion, skip animation — render immediately
transition={{
  duration: prefersReducedMotion ? 0 : 0.2,
  ease: [0.25, 0.1, 0.25, 1],
}}
```

Or use Framer Motion's `useReducedMotion()` hook.

### 6. Stats strip mandate label

When `selectedMandate === "all"`: show `"847 match current criteria"`
When any specific mandate: show `"847 match {MANDATE_LABELS[selectedMandate]} criteria"`

### 7. Mandate filter width

The longest option (`"Growth Multi-Asset — Portfolio V · DRM V · Portfolio VI · DRM VI"`) is 62 characters. Set `minWidth: "280px"` on the mandate select (up from current `140px`) to prevent text truncation. Other selects keep `140px`.

---

## Files Modified (Summary)

| File | Change type |
|------|-------------|
| `src/app/intelligence/ifa-prioritisation/page.tsx` | All 7 changes + mock data updates |
| `src/lib/intelligence-mock-data.ts` | **No changes** — page uses inline mock data |

Note: The current page uses an inline `ifaRankings` array, not the shared `intelligence-mock-data.ts`. All mock data changes apply to the inline array in `page.tsx`.

---

## What Must NOT Change

- Layer tab system and logic (Layer 1/2/3)
- Sidebar, topbar, navigation
- Layer 2 (Building) and Layer 3 (Licensed) content
- All other intelligence module pages
- Morning Brief, Priority Queue, Client Intelligence, Flow Intelligence, RFP Intelligence
- Any shared components in `components/ui/`
- `design-system/MASTER.md`
- `lib/mock-data.ts`
- `lib/intelligence-mock-data.ts`
