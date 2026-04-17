"use client";

import { useState } from "react";
import type { ImpactCard } from "@/lib/data/morning-brief-types";
import type { RealIFAFirm } from "@/lib/data/ifa-real-data";
import { OutreachRow } from "./OutreachRow";
import { BriefSlideOver } from "./BriefSlideOver";

interface BriefRecord {
  firm_name: string;
  brief_who: string;
  brief_why: string;
  brief_opener: string;
  top_mandate: string;
  [key: string]: unknown;
}

interface OutreachTableProps {
  rankedFirms: RealIFAFirm[];
  briefs: BriefRecord[];
  impactCards: ImpactCard[];
  loading: boolean;
}

const WHY_THIS_WEEK: Record<string, string> = {
  multi_asset_cautious: "Gilt yield story \u2014 cautious drawdown clients",
  multi_asset_balanced: "Mixed asset inflows \u2014 balanced portfolio demand",
  multi_asset_growth: "Growth mandate timing \u2014 equity positioning",
  multi_asset_aggressive: "Risk-on signals \u2014 growth-seeking clients",
  multi_asset_income: "Safe-haven rotation \u2014 income mandate timing",
  uk_equity_income: "UK equity pressure \u2014 income alternative angle",
  uk_equity: "UK equity \u2014 domestic allocation conversation",
  global_equity: "Global diversification \u2014 international mandate",
  european_equity: "European allocation \u2014 continental positioning",
  north_american_equity: "US market signals \u2014 North America mandate",
  corporate_bond: "Credit spreads \u2014 fixed income conversation",
  global_macro_bond: "Macro bond timing \u2014 global fixed income",
  money_market: "Rate environment \u2014 liquidity positioning",
};

// Map active_mandate from IFA data to mandate_category format
function normalizeMandateKey(mandate: string): string {
  // Already in snake_case
  if (mandate.includes("_")) return mandate;
  // Convert e.g. "cautious_multi_asset" to "multi_asset_cautious"
  return mandate;
}

function selectOutreachFirms(
  rankedFirms: RealIFAFirm[],
  impactCards: ImpactCard[]
): RealIFAFirm[] {
  const activeMandates = new Set(
    impactCards
      .filter((c) => c.sentiment === "positive" || c.sentiment === "neutral")
      .map((c) => c.mandate_category)
  );

  // Filter firms matching active mandates
  const matching = rankedFirms.filter((f) =>
    activeMandates.has(normalizeMandateKey(f.active_mandate))
  );

  // Sort by fitScore descending
  matching.sort((a, b) => b.fitScore - a.fitScore);
  const selected = matching.slice(0, 5);

  // If fewer than 5, fill with top overall
  if (selected.length < 5) {
    const selectedIds = new Set(selected.map((f) => f.id));
    const remaining = rankedFirms
      .filter((f) => !selectedIds.has(f.id))
      .sort((a, b) => b.fitScore - a.fitScore);
    for (const f of remaining) {
      if (selected.length >= 5) break;
      selected.push(f);
    }
  }

  return selected;
}

export function OutreachTable({ rankedFirms, briefs, impactCards, loading }: OutreachTableProps) {
  const [slideOverFirm, setSlideOverFirm] = useState<RealIFAFirm | null>(null);

  const firms = selectOutreachFirms(rankedFirms, impactCards);

  // Find brief for a firm
  const findBrief = (firmName: string) =>
    briefs.find((b) => b.firm_name === firmName);

  return (
    <div style={{ marginTop: "32px" }}>
      {/* Section header */}
      <div>
        <h2
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "var(--text-primary)",
            margin: 0,
          }}
        >
          Prioritised Outreach
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-tertiary)",
            marginTop: "4px",
            marginBottom: 0,
          }}
        >
          IFAs most relevant to this week&apos;s market conditions
        </p>
        <div
          style={{
            display: "inline-flex",
            background: "var(--bg-subtle)",
            border: "1px solid var(--border-subtle)",
            padding: "4px 10px",
            borderRadius: "9999px",
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-tertiary)",
            fontVariantNumeric: "tabular-nums",
            marginTop: "8px",
          }}
        >
          Based on the public IFA universe \u00B7 Not your existing client relationships
        </div>
      </div>

      {/* Table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
          marginTop: "16px",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                background: "var(--bg-raised)",
                borderBottom: "1px solid var(--border-strong)",
              }}
            >
              {["#", "FIRM", "TOWN", "ADVISERS", "MANDATE", "WHY THIS WEEK", "ACTION"].map(
                (col, i) => (
                  <th
                    key={col}
                    style={{
                      padding: "10px 12px",
                      fontSize: "11px",
                      fontWeight: 500,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      color: "var(--text-tertiary)",
                      textAlign:
                        col === "#"
                          ? "center"
                          : col === "ADVISERS"
                          ? "right"
                          : "left",
                      width:
                        col === "#"
                          ? "40px"
                          : col === "FIRM"
                          ? "200px"
                          : col === "TOWN"
                          ? "120px"
                          : col === "ADVISERS"
                          ? "80px"
                          : col === "MANDATE"
                          ? "140px"
                          : col === "ACTION"
                          ? "100px"
                          : undefined,
                    }}
                  >
                    {col}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    padding: "32px",
                    textAlign: "center",
                    fontSize: "13px",
                    color: "var(--text-tertiary)",
                  }}
                >
                  Loading outreach suggestions...
                </td>
              </tr>
            ) : (
              firms.map((firm, i) => (
                <OutreachRow
                  key={firm.id}
                  rank={i + 1}
                  firmName={firm.firm}
                  town={firm.region}
                  adviserCount={firm.adviser_count}
                  mandate={normalizeMandateKey(firm.active_mandate).replace(/_/g, " ")}
                  whyThisWeek={
                    WHY_THIS_WEEK[normalizeMandateKey(firm.active_mandate)] ||
                    "Distribution opportunity identified"
                  }
                  onViewBrief={() => setSlideOverFirm(firm)}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over */}
      <BriefSlideOver
        isOpen={!!slideOverFirm}
        onClose={() => setSlideOverFirm(null)}
        brief={
          slideOverFirm
            ? {
                firmName: slideOverFirm.firm,
                fitScore: slideOverFirm.fitScore,
                firmType: slideOverFirm.firmType,
                briefWho:
                  slideOverFirm.brief_who ||
                  findBrief(slideOverFirm.firm)?.brief_who ||
                  null,
                briefWhy:
                  slideOverFirm.brief_why ||
                  findBrief(slideOverFirm.firm)?.brief_why ||
                  null,
                briefOpener:
                  slideOverFirm.brief_opener ||
                  findBrief(slideOverFirm.firm)?.brief_opener ||
                  null,
              }
            : null
        }
      />
    </div>
  );
}
