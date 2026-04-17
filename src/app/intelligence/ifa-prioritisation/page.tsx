"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CircleDot,
  Clock,
  Lock,
  Database,
  X,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { TopBar } from "@/components/dashboard/topbar";

// ── Types ─────────────────────────────────────────────────────────────────────

type FirmType = "DA Firm" | "AR Firm" | "Network";
type LayerState = "live" | "building" | "licensed";

interface SignalItem {
  date: string;
  source: "FCA" | "CH" | "Web" | "Press";
  description: string;
}

interface ScoreBreakdown {
  firmScale: number;         // max 30
  distributionMatch: number; // max 25
  regulatoryFit: number;     // max 20
  fundFit: number;           // max 15
  marketTiming: number;      // max 10
}

interface IFARanking {
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
  scoreBreakdown: ScoreBreakdown;
  review_count: number | null;
  adviser_count: number | null;
  signal_count: number;
  active_mandate: string;
  brief_available: boolean;
  brief_who: string | null;
  brief_why: string | null;
  brief_opener: string | null;
}

// ── Mandate constants ────────────────────────────────────────────────────────

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

const MANDATE_OPTIONS: { value: string; label: string }[] = [
  { value: "all", label: "All Mandates" },
  { value: "cautious_multi_asset", label: "Cautious Multi-Asset \u2014 Portfolio III \u00b7 DRM III" },
  { value: "balanced_multi_asset", label: "Balanced Multi-Asset \u2014 Portfolio IV \u00b7 DRM IV" },
  { value: "growth_multi_asset", label: "Growth Multi-Asset \u2014 Portfolio V \u00b7 DRM V \u00b7 Portfolio VI \u00b7 DRM VI" },
  { value: "aggressive_multi_asset", label: "Aggressive Multi-Asset \u2014 Portfolio VII" },
  { value: "monthly_income", label: "Monthly Income \u2014 Diversified Monthly Income" },
  { value: "uk_equity_income", label: "UK Equity Income \u2014 UK Equity Income Fund" },
  { value: "global_equity", label: "Global Equity \u2014 Global Equity Fund" },
  { value: "uk_equity", label: "UK Equity \u2014 UK Equity Fund" },
  { value: "corporate_bond", label: "Corporate Bond \u2014 Corporate Bond Fund" },
  { value: "european_equity", label: "European Equity \u2014 European Fund" },
  { value: "north_american_equity", label: "North American Equity \u2014 North American Fund" },
];

// ── Market context ───────────────────────────────────────────────────────────

type MarketContext = {
  text: string;
  dotColor: "emerald" | "amber";
};

const MARKET_CONTEXT: Record<string, MarketContext> = {
  all: {
    text: "Volatility Managed and Mixed 40-85% saw the strongest inflows in Feb 2026 \u2014 cautious and growth multi-asset remain well-timed.",
    dotColor: "emerald",
  },
  cautious_multi_asset: {
    text: "IA Volatility Managed: +\u00a3275m net inflows Feb 2026 \u2014 DRM III-IV sits in the top-inflow sector.",
    dotColor: "emerald",
  },
  balanced_multi_asset: {
    text: "IA Mixed 20-60%: steady inflows \u2014 Portfolio IV well-positioned against Jupiter Merlin Income (\u00a31.68bn sector leader).",
    dotColor: "emerald",
  },
  growth_multi_asset: {
    text: "IA Mixed 40-85%: +\u00a3250m net inflows Feb 2026 \u2014 Portfolio V-VI in the second strongest inflow sector.",
    dotColor: "emerald",
  },
  aggressive_multi_asset: {
    text: "IA sector flow data updated Feb 2026. Filter by mandate to see sector-specific context.",
    dotColor: "amber",
  },
  monthly_income: {
    text: "Safe-haven rotation underway \u2014 multi-asset income seeing consistent \u00a31.3-1.5bn/month inflows per Calastone FFI.",
    dotColor: "emerald",
  },
  uk_equity_income: {
    text: "IA UK Equity Income: outflows easing \u2014 Keyridge UK Equity Income at \u00a3132m competes in a sector led by Artemis Income (\u00a36.58bn). OCF advantage: 0.84% vs 0.87% sector average.",
    dotColor: "amber",
  },
  global_equity: {
    text: "IA Global: -\u00a3839m outflows Feb 2026 \u2014 sector under pressure. Timing calls for firms with income or cautious client focus.",
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

// ── Mock data — 25 UK IFA firms ───────────────────────────────────────────────

const ifaRankings: IFARanking[] = [
  {
    id: "1",
    rank: 1,
    firm: "Paradigm Capital Ltd",
    firmType: "DA Firm",
    region: "London",
    fitScore: 91,
    keySignal: "Investment director Sarah Chen moved from Schroders Global 3 weeks ago \u2014 opens relationship door",
    fcaNumber: "FRN 512847",
    registrationDate: "14 Mar 2009",
    permissions: "Advising on investments, arranging deals, managing investments",
    keyIndividuals: ["James Whitfield (CEO)", "Sarah Chen (Investment Director)", "Rachel Moore (CIO)"],
    officeAddress: "12 Broadgate Circle, London EC2M 2QS",
    companiesHouseNumber: "06821934",
    signals: [
      { date: "10 Mar 2026", source: "Press", description: "Sarah Chen joins as Investment Director from Schroders Global Equity team" },
      { date: "28 Feb 2026", source: "Web", description: "Investment philosophy page updated \u2014 explicit reference to systematic and factor-based approaches" },
      { date: "15 Jan 2026", source: "FCA", description: "RMAR filing shows 22% AUM growth year-on-year" },
    ],
    scoreBreakdown: { firmScale: 28, distributionMatch: 22, regulatoryFit: 18, fundFit: 14, marketTiming: 9 },
    review_count: 6776,
    adviser_count: 12,
    signal_count: 3,
    active_mandate: "cautious_multi_asset",
    brief_available: true,
    brief_who: "London-based DA firm with three senior investment professionals and a recent investment director hire from Schroders. RMAR-reported 22% AUM growth year-on-year. Manages \u00a32.1bn with a stated mandate for systematic and factor-based allocation \u2014 outsources execution but runs an in-house investment committee.",
    brief_why: "The Schroders hire and explicit systematic philosophy shift on their website points to readiness for WS Keyridge Portfolio V and DRM V. Their growth mandate profile and platform access via Transact and Quilter align with Keyridge\u2019s distribution footprint.",
    brief_opener: "Sarah Chen\u2019s move from Schroders and your updated investment philosophy caught our attention \u2014 I\u2019d like to understand how you\u2019re building out the systematic allocation that your website now references.",
  },
  {
    id: "2",
    rank: 2,
    firm: "Attivo Group",
    firmType: "Network",
    region: "Manchester",
    fitScore: 87,
    keySignal: "Added systematic equity strategy to approved list per updated website Q4 2025",
    fcaNumber: "FRN 488312",
    registrationDate: "02 Sep 2007",
    permissions: "Advising on investments, arranging deals in investments",
    keyIndividuals: ["David Hartley (MD)", "Claire Simmons (Head of Investments)", "Tom Yates (Research Lead)"],
    officeAddress: "55 Spring Gardens, Manchester M2 2BX",
    companiesHouseNumber: "05834621",
    signals: [
      { date: "18 Nov 2025", source: "Web", description: "Approved list updated \u2014 systematic equity strategy category added" },
      { date: "04 Oct 2025", source: "CH", description: "New board appointment: Claire Simmons joins as Head of Investments" },
      { date: "22 Aug 2025", source: "FCA", description: "Permissions extended to include collective portfolio management" },
    ],
    scoreBreakdown: { firmScale: 26, distributionMatch: 21, regulatoryFit: 17, fundFit: 14, marketTiming: 9 },
    review_count: 4210,
    adviser_count: 45,
    signal_count: 3,
    active_mandate: "balanced_multi_asset",
    brief_available: true,
    brief_who: "Manchester-headquartered network with collective portfolio management permissions and a newly appointed Head of Investments. Systematic equity was recently added as a named strategy category on their approved list, opening fund access to the full adviser base.",
    brief_why: "Network-level approved list inclusion is the distribution unlock \u2014 once on the Attivo list, their adviser base has immediate access. WS Keyridge Portfolio IV and DRM IV fit the balanced mandate profile their advisers service.",
    brief_opener: "We noticed Attivo added systematic equity to your approved list in Q4 \u2014 I\u2019d like to discuss how Keyridge\u2019s multi-asset range might complement your existing panel for balanced risk profiles.",
  },
  {
    id: "3",
    rank: 3,
    firm: "Foster Denovo",
    firmType: "DA Firm",
    region: "London",
    fitScore: 84,
    keySignal: "FCA RMAR shows 28% client growth YoY \u2014 scaling fast, may need broader fund range",
    fcaNumber: "FRN 462654",
    registrationDate: "11 Jun 2006",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Lee Robertson (CEO)", "Marc Sherland (CIO)", "Jessica Park (Head of Research)"],
    officeAddress: "1 Minster Court, Mincing Lane, London EC3R 7AA",
    companiesHouseNumber: "05764923",
    signals: [
      { date: "20 Feb 2026", source: "FCA", description: "RMAR shows 28% client growth year-on-year \u2014 fastest in three years" },
      { date: "12 Jan 2026", source: "Web", description: "New institutional proposition page launched targeting systematic mandates" },
      { date: "30 Nov 2025", source: "Press", description: "Foster Denovo listed in FT Adviser Top 100 Financial Advisers 2025" },
    ],
    scoreBreakdown: { firmScale: 25, distributionMatch: 22, regulatoryFit: 18, fundFit: 13, marketTiming: 6 },
    review_count: 3540,
    adviser_count: 28,
    signal_count: 3,
    active_mandate: "growth_multi_asset",
    brief_available: true,
    brief_who: "National DA firm scaling rapidly with 28% client growth year-on-year. Launched an institutional proposition page targeting systematic mandates. Three senior investment professionals running an expanding research function \u2014 likely reviewing their fund universe to support growth.",
    brief_why: "Fast-growing firms outgrow their existing fund panels. Foster Denovo\u2019s explicit institutional focus and systematic mandate interest maps directly to WS Keyridge Portfolio V-VI for growth clients and DRM III-IV for their cautious retiree segment.",
    brief_opener: "Your 28% client growth and new institutional proposition page suggest you\u2019re expanding your fund universe \u2014 I\u2019d like to explore whether Keyridge\u2019s multi-asset range fits the systematic allocation framework you\u2019re building.",
  },
  {
    id: "4",
    rank: 4,
    firm: "Progeny Wealth",
    firmType: "DA Firm",
    region: "Leeds",
    fitScore: 82,
    keySignal: "Director appointment: new Head of Investments from Jupiter AM (Companies House, 6 weeks ago)",
    fcaNumber: "FRN 534218",
    registrationDate: "28 Feb 2011",
    permissions: "Advising on investments, arranging deals, managing investments",
    keyIndividuals: ["Neil Moles (CEO)", "Andrew Buchanan (Head of Investments)", "Laura Tesh (CIO)"],
    officeAddress: "3 Whitehall Quay, Leeds LS1 4HR",
    companiesHouseNumber: "07512834",
    signals: [
      { date: "17 Feb 2026", source: "CH", description: "Andrew Buchanan appointed Head of Investments \u2014 previously at Jupiter Asset Management" },
      { date: "05 Jan 2026", source: "FCA", description: "New MiFID permissions granted for cross-border distribution" },
      { date: "20 Dec 2025", source: "Web", description: "Investment committee page updated \u2014 growth mandate focus added" },
    ],
    scoreBreakdown: { firmScale: 24, distributionMatch: 20, regulatoryFit: 17, fundFit: 13, marketTiming: 8 },
    review_count: 2890,
    adviser_count: 18,
    signal_count: 3,
    active_mandate: "monthly_income",
    brief_available: true,
    brief_who: "Leeds-based DA firm with a new Head of Investments from Jupiter AM and recently granted cross-border MiFID permissions. Investment committee page now features a growth mandate focus alongside their traditional cautious positioning.",
    brief_why: "The Jupiter hire signals a pivot toward active-systematic blends. WS Keyridge DRM IV and Portfolio IV sit precisely at the balanced-to-growth transition. Cross-border permissions also open European distribution conversations.",
    brief_opener: "Andrew Buchanan\u2019s appointment from Jupiter and your updated growth mandate focus suggest an evolution in your investment approach \u2014 I\u2019d like to understand how you\u2019re sourcing multi-asset solutions for that expanded risk spectrum.",
  },
  {
    id: "5",
    rank: 5,
    firm: "Informed Financial Planning",
    firmType: "DA Firm",
    region: "Oxford",
    fitScore: 79,
    keySignal: "Investment philosophy page updated to emphasise systematic and factor-based approaches",
    fcaNumber: "FRN 497183",
    registrationDate: "03 Apr 2008",
    permissions: "Advising on investments, arranging deals in investments",
    keyIndividuals: ["Philip Dragoumis (MD)", "Helen Watkins (CIO)", "Mark Fairweather (Research)"],
    officeAddress: "Seacourt Tower, West Way, Oxford OX2 0JJ",
    companiesHouseNumber: "06384721",
    signals: [
      { date: "08 Mar 2026", source: "Web", description: "Philosophy page refresh \u2014 systematic factor investing and evidence-based allocation now central" },
      { date: "14 Feb 2026", source: "Press", description: "Shortlisted for Professional Adviser Awards \u2014 Best Client Outcomes category" },
      { date: "10 Jan 2026", source: "FCA", description: "RMAR filing indicates stable AUM growth of 14% year-on-year" },
    ],
    scoreBreakdown: { firmScale: 27, distributionMatch: 18, regulatoryFit: 15, fundFit: 11, marketTiming: 8 },
    review_count: 1520,
    adviser_count: 8,
    signal_count: 3,
    active_mandate: "cautious_multi_asset",
    brief_available: true,
    brief_who: "Oxford-based DA firm with a stated evidence-based and factor-investing philosophy. Shortlisted for Professional Adviser Best Client Outcomes award. Stable 14% AUM growth with a research-led investment process across three senior professionals.",
    brief_why: "Their explicit factor-investing philosophy is the strongest alignment signal. WS Keyridge\u2019s systematic process mirrors their stated approach. Portfolio III-IV for their cautious-balanced client base, with the DRM range as a natural conversation for drawdown clients.",
    brief_opener: "Your evidence-based philosophy and factor-investing focus align closely with how Keyridge constructs portfolios \u2014 I\u2019d like to explore whether our systematic multi-asset range could complement your existing research framework.",
  },
  {
    id: "6",
    rank: 6,
    firm: "Atticus Wealth",
    firmType: "DA Firm",
    region: "Bristol",
    fitScore: 76,
    keySignal: "Joined Nucleus platform Q3 \u2014 expanding fund access, reviewing panel",
    fcaNumber: "FRN 521094",
    registrationDate: "19 Jul 2010",
    permissions: "Advising on investments, arranging deals, credit broking",
    keyIndividuals: ["Simon Walsh (CEO)", "Natasha Brennan (Head of Investments)", "Chris Fielding (Research)"],
    officeAddress: "5 Glass Wharf, Bristol BS2 0FR",
    companiesHouseNumber: "07234816",
    signals: [
      { date: "01 Sep 2025", source: "Web", description: "Nucleus platform integration announced \u2014 new fund categories accessible to clients" },
      { date: "28 Aug 2025", source: "Press", description: "Atticus Wealth completes merger with Williams Financial Planning, AUM doubles" },
      { date: "12 Jul 2025", source: "FCA", description: "Approved persons update \u2014 three new investment advisers authorised" },
    ],
    scoreBreakdown: { firmScale: 22, distributionMatch: 21, regulatoryFit: 14, fundFit: 12, marketTiming: 7 },
    review_count: 980,
    adviser_count: 14,
    signal_count: 2,
    active_mandate: "cautious_multi_asset",
    brief_available: true,
    brief_who: "Bristol-based DA firm with 14 advisers that recently doubled AUM through a merger with Williams Financial Planning. Now operating on Nucleus platform with expanded fund access. Three new investment advisers authorised by the FCA in 2025, signalling rapid team growth.",
    brief_why: "The Nucleus platform integration and post-merger panel review create a natural window for WS Keyridge DRM III and Portfolio III. Their cautious client base and newly expanded fund access align with Keyridge\u2019s distribution on Nucleus.",
    brief_opener: "Your merger with Williams Financial Planning and the Nucleus integration suggest you\u2019re consolidating your fund panel \u2014 I\u2019d like to discuss how Keyridge\u2019s cautious multi-asset range could fit into your updated proposition.",
  },
  {
    id: "7",
    rank: 7,
    firm: "Perspective Financial Group",
    firmType: "Network",
    region: "Bristol",
    fitScore: 74,
    keySignal: "New client proposition document mentions 'evidence-based investing' \u2014 strong mandate fit",
    fcaNumber: "FRN 443781",
    registrationDate: "14 Jan 2005",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Paul Armson (CEO)", "Victoria Clarke (CIO)", "Ben Thomson (Head of Research)"],
    officeAddress: "Aztec West Business Park, Bristol BS32 4TD",
    companiesHouseNumber: "05234178",
    signals: [
      { date: "22 Feb 2026", source: "Web", description: "Client proposition document updated \u2014 'evidence-based investing' and systematic allocation prominently featured" },
      { date: "15 Dec 2025", source: "CH", description: "Victoria Clarke appointed CIO \u2014 previously at Vanguard UK institutional team" },
      { date: "04 Nov 2025", source: "FCA", description: "Network permissions expanded \u2014 additional AR firms onboarded" },
    ],
    scoreBreakdown: { firmScale: 23, distributionMatch: 19, regulatoryFit: 16, fundFit: 10, marketTiming: 6 },
    review_count: 5120,
    adviser_count: 38,
    signal_count: 3,
    active_mandate: "balanced_multi_asset",
    brief_available: true,
    brief_who: "Bristol-headquartered network with 38 advisers and a new CIO hired from Vanguard UK\u2019s institutional team. Their updated client proposition document now prominently features evidence-based investing and systematic allocation. Network permissions recently expanded with additional AR firms onboarded.",
    brief_why: "Victoria Clarke\u2019s Vanguard background and the explicit evidence-based positioning create strong philosophy alignment. WS Keyridge Portfolio IV and DRM IV map to the balanced mandate profile their network advisers predominantly service.",
    brief_opener: "Victoria Clarke\u2019s appointment from Vanguard and your updated evidence-based proposition caught our attention \u2014 I\u2019d like to explore how Keyridge\u2019s systematic multi-asset range might complement the allocation framework you\u2019re building across the network.",
  },
  {
    id: "8",
    rank: 8,
    firm: "Arbor Asset Management",
    firmType: "DA Firm",
    region: "Edinburgh",
    fitScore: 71,
    keySignal: "RMAR revenue up 41% \u2014 growing rapidly, underserved by current AM relationships",
    fcaNumber: "FRN 508921",
    registrationDate: "07 Nov 2009",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Alasdair MacLeod (CEO)", "Fiona Reid (CIO)", "Callum Fraser (Research Lead)"],
    officeAddress: "Quartermile 4, Lauriston Place, Edinburgh EH3 9EN",
    companiesHouseNumber: "SC384172",
    signals: [
      { date: "28 Jan 2026", source: "FCA", description: "RMAR revenue up 41% year-on-year \u2014 fastest growth in the firm\u2019s history" },
      { date: "10 Dec 2025", source: "CH", description: "Board expansion \u2014 two new non-executive directors appointed" },
      { date: "03 Oct 2025", source: "Web", description: "Investment team page expanded \u2014 global equity section added to core capability" },
    ],
    scoreBreakdown: { firmScale: 21, distributionMatch: 18, regulatoryFit: 15, fundFit: 12, marketTiming: 5 },
    review_count: 2340,
    adviser_count: 10,
    signal_count: 3,
    active_mandate: "growth_multi_asset",
    brief_available: true,
    brief_who: "Edinburgh-based DA firm experiencing 41% revenue growth with 10 advisers. Recently expanded their board with two new non-executive directors and added global equity as a core capability. Research-led approach with Callum Fraser heading fund selection.",
    brief_why: "Rapid revenue growth suggests Arbor is outgrowing existing AM relationships. Their new global equity capability and growth trajectory map well to WS Keyridge Portfolio V and DRM V. Edinburgh location underserved by most London-centric AM distribution teams.",
    brief_opener: "Your 41% revenue growth and expanded global equity capability suggest you\u2019re scaling your investment proposition \u2014 I\u2019d like to discuss whether Keyridge\u2019s growth multi-asset range could support your expanding client base.",
  },
  {
    id: "9",
    rank: 9,
    firm: "Equilibrium Asset Management",
    firmType: "DA Firm",
    region: "North West",
    fitScore: 68,
    keySignal: "Published white paper on systematic alpha generation \u2014 signals philosophy alignment",
    fcaNumber: "FRN 452193",
    registrationDate: "22 May 2006",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Colin Lawson (Founder)", "Gavin Rankin (CIO)", "Sarah Rutherford (Research)"],
    officeAddress: "Ascot House, Epsom Avenue, Handforth SK9 3RN",
    companiesHouseNumber: "05812934",
    signals: [
      { date: "12 Mar 2026", source: "Web", description: "New white paper published: 'The Case for Systematic Alpha' \u2014 strong mandate alignment" },
      { date: "05 Feb 2026", source: "Press", description: "Equilibrium wins Best Discretionary Manager at Citywire Awards 2025" },
      { date: "18 Dec 2025", source: "FCA", description: "RMAR confirms stable 12% AUM growth with enhanced discretionary permissions" },
    ],
    scoreBreakdown: { firmScale: 22, distributionMatch: 17, regulatoryFit: 13, fundFit: 10, marketTiming: 6 },
    review_count: 1870,
    adviser_count: 15,
    signal_count: 3,
    active_mandate: "cautious_multi_asset",
    brief_available: true,
    brief_who: "North West DA firm with a strong discretionary heritage and 15 advisers. Recently published a white paper on systematic alpha generation and won Best Discretionary Manager at Citywire Awards. Colin Lawson\u2019s founder-led culture emphasises research rigour.",
    brief_why: "The systematic alpha white paper is a direct philosophy alignment signal. WS Keyridge DRM III and Portfolio III fit their cautious client base, while the Citywire award credibility opens a peer-conversation angle around systematic approaches.",
    brief_opener: "Your white paper on systematic alpha generation resonates closely with Keyridge\u2019s investment process \u2014 I\u2019d like to discuss how our DRM range could complement the systematic framework you\u2019re developing for cautious mandates.",
  },
  {
    id: "10",
    rank: 10,
    firm: "Cazenove Capital",
    firmType: "DA Firm",
    region: "London",
    fitScore: 66,
    keySignal: "New institutional mandate desk opened in Q1 2026 \u2014 actively seeking systematic strategies",
    fcaNumber: "FRN 113955",
    registrationDate: "01 Jun 1998",
    permissions: "Advising on investments, managing investments, arranging deals, safeguarding",
    keyIndividuals: ["Edmund Truell (Chair)", "Gemma Harrington (Head of Mandates)", "Alex Pemberton (CIO)"],
    officeAddress: "12 Moorgate, London EC2R 6DA",
    companiesHouseNumber: "01679384",
    signals: [
      { date: "03 Mar 2026", source: "Press", description: "Institutional mandate desk launched \u2014 targeting systematic and quantitative strategies" },
      { date: "18 Jan 2026", source: "CH", description: "Gemma Harrington joins as Head of Mandates \u2014 previously at BlackRock Institutional" },
    ],
    scoreBreakdown: { firmScale: 20, distributionMatch: 19, regulatoryFit: 13, fundFit: 9, marketTiming: 5 },
    review_count: 420,
    adviser_count: 22,
    signal_count: 2,
    active_mandate: "monthly_income",
    brief_available: true,
    brief_who: "London-based DA firm with 22 advisers and a new institutional mandate desk launched Q1 2026. Gemma Harrington joined as Head of Mandates from BlackRock Institutional, bringing systematic strategy sourcing expertise. Legacy Cazenove reputation provides strong institutional credibility.",
    brief_why: "The new mandate desk explicitly targets systematic strategies \u2014 a direct distribution opportunity. WS Keyridge Diversified Monthly Income fits their income-focused client base, while Harrington\u2019s BlackRock background means familiarity with systematic processes.",
    brief_opener: "Your new institutional mandate desk and Gemma Harrington\u2019s appointment from BlackRock suggest you\u2019re actively sourcing systematic strategies \u2014 I\u2019d like to explore whether Keyridge\u2019s income range fits that mandate framework.",
  },
  {
    id: "11",
    rank: 11,
    firm: "Thorntons Investments",
    firmType: "DA Firm",
    region: "Scotland",
    fitScore: 64,
    keySignal: "FCA permissions updated \u2014 added collective investment undertakings to scope",
    fcaNumber: "FRN 487234",
    registrationDate: "15 Apr 2008",
    permissions: "Advising on investments, managing investments, collective investment undertakings",
    keyIndividuals: ["Robert Cairns (CEO)", "Moira Sinclair (Investment Director)"],
    officeAddress: "Whitehall House, 33 Yeaman Shore, Dundee DD1 4BJ",
    companiesHouseNumber: "SC289471",
    signals: [
      { date: "25 Feb 2026", source: "FCA", description: "Permissions updated \u2014 collective investment undertakings now in scope" },
      { date: "10 Nov 2025", source: "Web", description: "Website relaunched with enhanced institutional client focus" },
    ],
    scoreBreakdown: { firmScale: 19, distributionMatch: 16, regulatoryFit: 13, fundFit: 10, marketTiming: 6 },
    review_count: 310,
    adviser_count: 7,
    signal_count: 1,
    active_mandate: "cautious_multi_asset",
    brief_available: true,
    brief_who: "Scotland-based DA firm in Dundee with 7 advisers and recently expanded FCA permissions to include collective investment undertakings. Website relaunched with an enhanced institutional client focus, suggesting a strategic shift toward broader fund access.",
    brief_why: "The new collective investment permissions unlock access to fund structures they couldn\u2019t previously hold. WS Keyridge DRM III for cautious mandates is a natural fit \u2014 their Scottish base is underserved by most AM distribution teams.",
    brief_opener: "Your expanded FCA permissions for collective investments and refreshed institutional focus suggest you\u2019re broadening your fund universe \u2014 I\u2019d like to discuss how Keyridge\u2019s cautious multi-asset range could fit your updated proposition.",
  },
  {
    id: "12",
    rank: 12,
    firm: "Raymond James Financial Services",
    firmType: "Network",
    region: "Midlands",
    fitScore: 63,
    keySignal: "Network expanded systematic fund category on approved list November 2025",
    fcaNumber: "FRN 705062",
    registrationDate: "12 Feb 2019",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Alan Steel (MD)", "Patrick Thomson (Research Director)", "Sophie Clarke (Compliance)"],
    officeAddress: "Colmore Gate, 2-6 Colmore Row, Birmingham B3 2QD",
    companiesHouseNumber: "11823947",
    signals: [
      { date: "15 Nov 2025", source: "Web", description: "Approved list expanded \u2014 systematic global equity now a recognised strategy category" },
      { date: "09 Sep 2025", source: "FCA", description: "New AR firms onboarded \u2014 network headcount now 340 advisers" },
      { date: "22 Jul 2025", source: "CH", description: "Patrick Thomson appointed Research Director from Morningstar UK" },
    ],
    scoreBreakdown: { firmScale: 18, distributionMatch: 20, regulatoryFit: 12, fundFit: 9, marketTiming: 4 },
    review_count: 6100,
    adviser_count: 50,
    signal_count: 3,
    active_mandate: "uk_equity_income",
    brief_available: true,
    brief_who: "Midlands-headquartered network with 340 advisers and a recently expanded approved list that now includes systematic global equity as a named category. Patrick Thomson joined as Research Director from Morningstar UK, bringing independent fund analysis expertise.",
    brief_why: "Network-level approved list expansion is a scale unlock \u2014 340 advisers gain access simultaneously. WS Keyridge UK Equity Income Fund competes favourably on OCF at 0.84% vs the 0.87% sector average. Thomson\u2019s Morningstar background means he\u2019ll respond to data-driven fund positioning.",
    brief_opener: "Your expanded approved list now includes systematic equity \u2014 with 340 advisers across the network, I\u2019d like to discuss how Keyridge\u2019s UK Equity Income Fund could complement your existing panel, particularly given the OCF advantage.",
  },
  {
    id: "13",
    rank: 13,
    firm: "Kingswood Group",
    firmType: "DA Firm",
    region: "London",
    fitScore: 61,
    keySignal: "New CIO appointment from Vanguard \u2014 strong factor investing background signals philosophy shift",
    fcaNumber: "FRN 578213",
    registrationDate: "08 Aug 2014",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Gary Wilder (CEO)", "Jonathan Hughes (CIO)", "Rebecca Stone (Research)"],
    officeAddress: "14 Cornhill, London EC3V 3ND",
    companiesHouseNumber: "09178234",
    signals: [
      { date: "01 Mar 2026", source: "CH", description: "Jonathan Hughes joins as CIO \u2014 previously Head of Factor Strategies at Vanguard UK" },
      { date: "20 Jan 2026", source: "Web", description: "Investment process page updated to include quantitative screening methodology" },
      { date: "05 Dec 2025", source: "FCA", description: "RMAR confirms AUM growth of 18% with expanded discretionary permissions" },
    ],
    scoreBreakdown: { firmScale: 20, distributionMatch: 15, regulatoryFit: 13, fundFit: 9, marketTiming: 4 },
    review_count: 1340,
    adviser_count: 16,
    signal_count: 3,
    active_mandate: "balanced_multi_asset",
    brief_available: true,
    brief_who: "London-based DA firm with 16 advisers and a new CIO from Vanguard UK\u2019s Factor Strategies team. Investment process recently updated to include quantitative screening. RMAR shows 18% AUM growth with expanded discretionary permissions.",
    brief_why: "Jonathan Hughes\u2019s factor investing background from Vanguard is the strongest philosophy alignment signal. WS Keyridge Portfolio IV and DRM IV fit their balanced mandate positioning, and Hughes will be receptive to systematic process conversations.",
    brief_opener: "Jonathan Hughes\u2019s appointment from Vanguard\u2019s factor strategies team and your updated quantitative screening process suggest a clear direction \u2014 I\u2019d like to discuss how Keyridge\u2019s systematic multi-asset range aligns with that approach.",
  },
  {
    id: "14",
    rank: 14,
    firm: "Succession Wealth",
    firmType: "Network",
    region: "South East",
    fitScore: 59,
    keySignal: "Platform consolidation to Transact and Nucleus \u2014 fund access broadening significantly",
    fcaNumber: "FRN 521041",
    registrationDate: "03 Mar 2010",
    permissions: "Advising on investments, arranging deals, managing investments",
    keyIndividuals: ["James Stevenson (CEO)", "Nicholas Crawford (Investment Director)"],
    officeAddress: "One Valpy, Reading RG1 1AR",
    companiesHouseNumber: "07134821",
    signals: [
      { date: "20 Feb 2026", source: "Press", description: "Platform migration complete \u2014 now operating across Transact, Nucleus and Quilter" },
      { date: "04 Dec 2025", source: "FCA", description: "Regulatory returns filed \u2014 AUM stable, client numbers growing" },
      { date: "15 Oct 2025", source: "Web", description: "Adviser proposition page updated with expanded fund access messaging" },
    ],
    scoreBreakdown: { firmScale: 17, distributionMatch: 21, regulatoryFit: 11, fundFit: 7, marketTiming: 3 },
    review_count: 3890,
    adviser_count: 42,
    signal_count: 3,
    active_mandate: "balanced_multi_asset",
    brief_available: true,
    brief_who: "South East network with 42 advisers that recently completed platform migration to Transact, Nucleus and Quilter. Client numbers growing steadily with stable AUM. Adviser proposition page updated to emphasise expanded fund access.",
    brief_why: "Platform consolidation onto Transact, Nucleus and Quilter maps directly to Keyridge\u2019s distribution footprint. WS Keyridge Portfolio IV and DRM IV are available on all three platforms, making onboarding frictionless for the 42-adviser base.",
    brief_opener: "Your completed platform migration to Transact, Nucleus and Quilter creates seamless access to Keyridge\u2019s range \u2014 I\u2019d like to discuss how our balanced multi-asset funds might complement your existing panel across the network.",
  },
  {
    id: "15",
    rank: 15,
    firm: "Beaufort Financial",
    firmType: "AR Firm",
    region: "South West",
    fitScore: 57,
    keySignal: "AR firm recently gaining DA status \u2014 independence drive creates fund selection opportunity",
    fcaNumber: "FRN 478921",
    registrationDate: "17 Sep 2007",
    permissions: "Advising on investments, arranging deals in investments",
    keyIndividuals: ["Michael Beaufort (Principal)", "Sandra Leigh (Head of Client Services)"],
    officeAddress: "Bath Road, Cheltenham GL53 7LH",
    companiesHouseNumber: "06234817",
    signals: [
      { date: "28 Feb 2026", source: "FCA", description: "Application submitted for direct authorisation \u2014 AR status to be relinquished Q3 2026" },
      { date: "11 Jan 2026", source: "Web", description: "'Our independence' section added to website \u2014 signals philosophy shift away from restricted advice" },
      { date: "20 Nov 2025", source: "Press", description: "Beaufort Financial featured in Money Marketing discussing transition to independence" },
    ],
    scoreBreakdown: { firmScale: 18, distributionMatch: 15, regulatoryFit: 11, fundFit: 9, marketTiming: 4 },
    review_count: 540,
    adviser_count: 9,
    signal_count: 3,
    active_mandate: "cautious_multi_asset",
    brief_available: true,
    brief_who: "South West AR firm in Cheltenham with 9 advisers transitioning to direct authorisation in Q3 2026. Added an \u2018Our independence\u2019 section to their website, signalling a philosophy shift toward unrestricted fund selection. Featured in Money Marketing discussing their transition journey.",
    brief_why: "The AR-to-DA transition is the highest-value timing signal \u2014 they\u2019re building a fund panel from scratch. WS Keyridge DRM III and Portfolio III fit their cautious client base, and early engagement positions Keyridge before the panel is finalised.",
    brief_opener: "Your transition to direct authorisation and the independence messaging on your website suggest you\u2019re building a new fund panel \u2014 I\u2019d like to discuss how Keyridge\u2019s cautious multi-asset range could be part of that foundation.",
  },
  {
    id: "16",
    rank: 16,
    firm: "True Potential Wealth Management",
    firmType: "Network",
    region: "North East",
    fitScore: 55,
    keySignal: "Network MPS review underway \u2014 fund selection committee meeting Q2 2026",
    fcaNumber: "FRN 529360",
    registrationDate: "21 Jan 2011",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["David Harrison (CEO)", "Colin Lawson (CIO)", "Jonathan Polin (Investment Director)"],
    officeAddress: "True Potential House, Newburn Riverside, Newcastle NE15 8NZ",
    companiesHouseNumber: "07541923",
    signals: [
      { date: "15 Mar 2026", source: "Press", description: "MPS annual review announced \u2014 fund selection committee to meet April 2026" },
      { date: "06 Jan 2026", source: "FCA", description: "Network RMAR shows \u00a3380m net inflows in 2025 \u2014 strong platform growth" },
      { date: "12 Nov 2025", source: "Web", description: "Investment approach page updated to reference multi-factor systematic allocation" },
    ],
    scoreBreakdown: { firmScale: 16, distributionMatch: 18, regulatoryFit: 10, fundFit: 8, marketTiming: 3 },
    review_count: 7000,
    adviser_count: 48,
    signal_count: 3,
    active_mandate: "growth_multi_asset",
    brief_available: true,
    brief_who: "North East network headquartered in Newcastle with 48 advisers and \u00a3380m net inflows in 2025. MPS annual review underway with the fund selection committee meeting in April 2026. Investment approach page recently updated to reference multi-factor systematic allocation.",
    brief_why: "The imminent MPS review creates an immediate timing window \u2014 Keyridge needs to be on the shortlist before April. WS Keyridge Portfolio V and DRM V fit their growth mandate, and \u00a3380m inflows demonstrate the scale of the distribution opportunity.",
    brief_opener: "With your MPS review committee meeting in April and \u00a3380m of net inflows to allocate, I\u2019d like to discuss how Keyridge\u2019s growth multi-asset range could earn a place on the updated panel.",
  },
  {
    id: "17",
    rank: 17,
    firm: "Canaccord Genuity Wealth",
    firmType: "DA Firm",
    region: "London",
    fitScore: 53,
    keySignal: "Institutional desk expanding \u2014 hired two ex-AM distribution professionals in Q4 2025",
    fcaNumber: "FRN 491044",
    registrationDate: "14 Dec 2008",
    permissions: "Advising on investments, managing investments, arranging deals, safeguarding",
    keyIndividuals: ["David Esfandi (CEO)", "Liz Brayshaw (CIO)", "Tim Giles (Head of Institutional)"],
    officeAddress: "88 Wood Street, London EC2V 7RS",
    companiesHouseNumber: "06812347",
    signals: [
      { date: "20 Nov 2025", source: "CH", description: "Two new appointments to institutional distribution team \u2014 ex-Fidelity and ex-M&G professionals" },
      { date: "12 Oct 2025", source: "Web", description: "Institutional capabilities section expanded \u2014 now covers systematic and quantitative strategies" },
    ],
    scoreBreakdown: { firmScale: 17, distributionMatch: 16, regulatoryFit: 11, fundFit: 7, marketTiming: 2 },
    review_count: 780,
    adviser_count: 25,
    signal_count: 2,
    active_mandate: "global_equity",
    brief_available: true,
    brief_who: "London-based DA firm with 25 advisers and an expanding institutional desk. Two new distribution hires from Fidelity and M&G in Q4 2025. Institutional capabilities section now covers systematic and quantitative strategies. Long-established wealth management brand.",
    brief_why: "The ex-Fidelity and ex-M&G hires will be receptive to systematic fund conversations. WS Keyridge Global Equity Fund complements their institutional expansion, though the IA Global sector is under outflow pressure \u2014 positioning around income overlay may resonate better.",
    brief_opener: "Your expanded institutional desk and the systematic strategy focus on your capabilities page suggest you\u2019re actively sourcing new mandates \u2014 I\u2019d like to explore how Keyridge\u2019s global equity proposition could complement your institutional offering.",
  },
  {
    id: "18",
    rank: 18,
    firm: "Tilney Investment Management",
    firmType: "DA Firm",
    region: "London",
    fitScore: 51,
    keySignal: "Integration with Smith & Williamson complete \u2014 expanded investment committee now reviewing all mandates",
    fcaNumber: "FRN 121770",
    registrationDate: "08 Apr 1992",
    permissions: "Advising on investments, managing investments, arranging deals, safeguarding",
    keyIndividuals: ["Christopher Woodhouse (CEO)", "Emma Wall (Head of Research)", "Philip Goetz (CIO)"],
    officeAddress: "1 Gresham Street, London EC2V 7BX",
    companiesHouseNumber: "01789234",
    signals: [
      { date: "28 Jan 2026", source: "Press", description: "Evelyn Partners integration finalised \u2014 unified investment committee established" },
      { date: "15 Nov 2025", source: "Web", description: "Investment philosophy refreshed \u2014 systematic approaches now formally part of core framework" },
    ],
    scoreBreakdown: { firmScale: 16, distributionMatch: 16, regulatoryFit: 10, fundFit: 7, marketTiming: 2 },
    review_count: 1150,
    adviser_count: 35,
    signal_count: 1,
    active_mandate: "uk_equity_income",
    brief_available: true,
    brief_who: "London-based DA firm with 35 advisers that recently completed the Evelyn Partners integration. Unified investment committee now reviewing all mandates across the combined entity. Investment philosophy refreshed to formally include systematic approaches as part of the core framework.",
    brief_why: "Post-merger mandate reviews create a natural entry point. WS Keyridge UK Equity Income Fund\u2019s 0.84% OCF competes well in a sector where Artemis Income leads at \u00a36.58bn. Emma Wall\u2019s research background means she\u2019ll respond to data-driven positioning.",
    brief_opener: "With the Evelyn Partners integration finalised and your investment committee reviewing all mandates, I\u2019d like to discuss how Keyridge\u2019s UK Equity Income Fund could complement your refreshed systematic framework.",
  },
  {
    id: "19",
    rank: 19,
    firm: "Quilter Financial Planning",
    firmType: "Network",
    region: "South East",
    fitScore: 49,
    keySignal: "New head of fund research appointed \u2014 prior role was at Morningstar covering systematic funds",
    fcaNumber: "FRN 440703",
    registrationDate: "17 Jan 2005",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Steven Levin (CEO)", "Harriet Jenner (Head of Fund Research)", "Paul Harrison (CIO)"],
    officeAddress: "Senator House, 85 Queen Victoria Street, London EC4V 4AB",
    companiesHouseNumber: "05341782",
    signals: [
      { date: "10 Mar 2026", source: "CH", description: "Harriet Jenner appointed Head of Fund Research \u2014 previously Senior Analyst at Morningstar covering systematic equity" },
      { date: "25 Jan 2026", source: "FCA", description: "RMAR filed \u2014 network retains stable 1,200 adviser headcount" },
      { date: "08 Dec 2025", source: "Web", description: "Fund research methodology page updated to include systematic strategy assessment criteria" },
    ],
    scoreBreakdown: { firmScale: 15, distributionMatch: 17, regulatoryFit: 9, fundFit: 6, marketTiming: 2 },
    review_count: 5890,
    adviser_count: 50,
    signal_count: 3,
    active_mandate: "balanced_multi_asset",
    brief_available: true,
    brief_who: "South East network with 1,200 advisers and a new Head of Fund Research from Morningstar\u2019s systematic equity coverage. Fund research methodology page updated to include systematic strategy assessment criteria. Largest adviser base in the target universe.",
    brief_why: "Harriet Jenner\u2019s Morningstar systematic coverage background means she\u2019ll evaluate Keyridge on factor exposure, tracking error and process consistency. WS Keyridge Portfolio IV and DRM IV fit the balanced mandate \u2014 and 1,200 advisers makes this a scale-defining conversation.",
    brief_opener: "Harriet Jenner\u2019s appointment from Morningstar and your updated systematic assessment criteria suggest the research process is evolving \u2014 I\u2019d like to discuss how Keyridge\u2019s multi-asset range holds up under that analytical framework.",
  },
  {
    id: "20",
    rank: 20,
    firm: "Hargreaves Lansdown Financial Advice",
    firmType: "DA Firm",
    region: "South West",
    fitScore: 47,
    keySignal: "Advice business strategic review \u2014 white label mandates under consideration for first time",
    fcaNumber: "FRN 115248",
    registrationDate: "12 Sep 1991",
    permissions: "Advising on investments, managing investments, arranging deals, safeguarding, deposit taking",
    keyIndividuals: ["Chris Hill (CEO)", "Lydia Romero (Head of Advice)", "Dan Olley (CTO)"],
    officeAddress: "One College Square South, Anchor Road, Bristol BS1 5HL",
    companiesHouseNumber: "02122142",
    signals: [
      { date: "05 Mar 2026", source: "Press", description: "Strategic review announced \u2014 white label mandate proposition to be piloted in H2 2026" },
      { date: "12 Feb 2026", source: "Web", description: "Adviser proposition page updated with expanded fund access messaging" },
      { date: "20 Jan 2026", source: "FCA", description: "RMAR filed \u2014 advice division AUM stable at \u00a34.7bn with growing client numbers" },
    ],
    scoreBreakdown: { firmScale: 14, distributionMatch: 16, regulatoryFit: 9, fundFit: 6, marketTiming: 2 },
    review_count: 6950,
    adviser_count: 40,
    signal_count: 2,
    active_mandate: "growth_multi_asset",
    brief_available: true,
    brief_who: "South West DA firm in Bristol with 40 advisers and \u00a34.7bn AUM across the advice division. Strategic review announced with white label mandate proposition to be piloted in H2 2026. Growing client numbers despite stable AUM suggest net new client acquisition.",
    brief_why: "White label mandate consideration signals a new distribution channel. WS Keyridge Portfolio V and DRM V fit growth mandates, and early engagement before the H2 pilot could position Keyridge as a foundation provider for the white label proposition.",
    brief_opener: "Your strategic review and white label mandate pilot suggest a new distribution approach \u2014 I\u2019d like to explore whether Keyridge\u2019s growth multi-asset range could form part of that proposition from the outset.",
  },
  {
    id: "21",
    rank: 21,
    firm: "Ascot Lloyd",
    firmType: "DA Firm",
    region: "South East",
    fitScore: 45,
    keySignal: "Five acquisitions in 12 months \u2014 integrating fund panels, creating new selection opportunity",
    fcaNumber: "FRN 543780",
    registrationDate: "04 Oct 2012",
    permissions: "Advising on investments, arranging deals, managing investments",
    keyIndividuals: ["Andrew Tripp (CEO)", "Mark Walsh (CIO)", "Charlotte Evans (Head of Research)"],
    officeAddress: "One Bartholomew Lane, London EC2N 2AX",
    companiesHouseNumber: "08234791",
    signals: [
      { date: "22 Feb 2026", source: "Press", description: "Fifth acquisition in 12 months \u2014 panel harmonisation project launched" },
      { date: "30 Jan 2026", source: "CH", description: "Board restructure following acquisitions \u2014 investment committee reformed" },
    ],
    scoreBreakdown: { firmScale: 14, distributionMatch: 14, regulatoryFit: 9, fundFit: 6, marketTiming: 2 },
    review_count: 2100,
    adviser_count: 30,
    signal_count: 0,
    active_mandate: "cautious_multi_asset",
    brief_available: true,
    brief_who: "South East DA firm with 30 advisers that has completed five acquisitions in 12 months. Panel harmonisation project launched and investment committee reformed following the board restructure. Rapidly scaling through M&A with a newly consolidated research function.",
    brief_why: "Post-acquisition panel harmonisation is the key timing signal \u2014 they\u2019re rationalising multiple fund panels into one. WS Keyridge DRM III and Portfolio III for cautious mandates should be positioned before the harmonised panel is finalised.",
    brief_opener: "Five acquisitions in 12 months and a panel harmonisation project suggest significant fund selection decisions ahead \u2014 I\u2019d like to discuss how Keyridge\u2019s cautious multi-asset range could earn a place on the unified panel.",
  },
  {
    id: "22",
    rank: 22,
    firm: "Mattioli Woods",
    firmType: "DA Firm",
    region: "Midlands",
    fitScore: 42,
    keySignal: "Pension consulting division expanding \u2014 new systematic mandate category added to investment framework",
    fcaNumber: "FRN 220687",
    registrationDate: "18 Nov 2003",
    permissions: "Advising on investments, managing investments, pension trustee, arranging deals",
    keyIndividuals: ["Ian Mattioli (CEO)", "Bob Woods (Chairman)", "Philip Spiers (CIO)"],
    officeAddress: "1 New Walk, Leicester LE1 6TH",
    companiesHouseNumber: "04462162",
    signals: [
      { date: "18 Jan 2026", source: "Web", description: "Pension consulting framework updated \u2014 systematic equity now a named category alongside traditional active" },
      { date: "05 Nov 2025", source: "FCA", description: "New permissions granted for pension trustee advisory services" },
    ],
    scoreBreakdown: { firmScale: 13, distributionMatch: 14, regulatoryFit: 8, fundFit: 5, marketTiming: 2 },
    review_count: 1680,
    adviser_count: 20,
    signal_count: 0,
    active_mandate: "monthly_income",
    brief_available: true,
    brief_who: "Midlands-based DA firm in Leicester with 20 advisers and strong pension consulting heritage. Systematic equity now a named category in their investment framework alongside traditional active. New FCA permissions for pension trustee advisory expand their service scope.",
    brief_why: "Pension consulting firms need income solutions for drawdown clients. WS Keyridge Diversified Monthly Income maps directly to their pension decumulation client base. The new systematic category in their framework opens the door for a process-led conversation.",
    brief_opener: "Your addition of systematic equity to the pension consulting framework and expanded trustee permissions suggest evolving fund requirements \u2014 I\u2019d like to discuss how Keyridge\u2019s income range fits your drawdown client needs.",
  },
  {
    id: "23",
    rank: 23,
    firm: "Wesleyan Financial Services",
    firmType: "DA Firm",
    region: "Midlands",
    fitScore: 39,
    keySignal: "Diversifying beyond core professional market \u2014 exploring external AM relationships for first time",
    fcaNumber: "FRN 144467",
    registrationDate: "14 Jun 1996",
    permissions: "Advising on investments, arranging deals, insurance mediation",
    keyIndividuals: ["Craig Errington (CEO)", "Tim Johnson (CIO)", "Emma Bowell (Head of Research)"],
    officeAddress: "Colmore Circus, Birmingham B4 6AR",
    companiesHouseNumber: "02761324",
    signals: [
      { date: "25 Jan 2026", source: "Press", description: "CEO interview: 'We are exploring external asset management relationships for systematic strategies for the first time'" },
    ],
    scoreBreakdown: { firmScale: 12, distributionMatch: 12, regulatoryFit: 8, fundFit: 5, marketTiming: 2 },
    review_count: null,
    adviser_count: 35,
    signal_count: 0,
    active_mandate: "cautious_multi_asset",
    brief_available: true,
    brief_who: "Midlands-based DA firm in Birmingham with 35 advisers and a heritage in the professional (medical, dental, legal) client market. Historically used in-house fund solutions only. CEO publicly stated they are exploring external AM relationships for systematic strategies for the first time.",
    brief_why: "First-time external AM exploration is a rare green-field opportunity. WS Keyridge DRM III for cautious mandates fits their conservative professional client base. Being among the first external managers considered positions Keyridge as a foundation relationship.",
    brief_opener: "Your decision to explore external asset management relationships for the first time represents a significant strategic shift \u2014 I\u2019d like to discuss how Keyridge\u2019s systematic process could complement your existing in-house capability for professional client mandates.",
  },
  {
    id: "24",
    rank: 24,
    firm: "Brooks Macdonald",
    firmType: "DA Firm",
    region: "London",
    fitScore: 36,
    keySignal: "New head of adviser distribution \u2014 growing MPS proposition, reviewing fund universe",
    fcaNumber: "FRN 196822",
    registrationDate: "22 May 2000",
    permissions: "Advising on investments, managing investments, arranging deals, safeguarding",
    keyIndividuals: ["Andrew Shepherd (CEO)", "Caroline Connellan (President)", "Niall O'Shea (CIO)"],
    officeAddress: "21 Lombard Street, London EC3V 9AH",
    companiesHouseNumber: "03959023",
    signals: [
      { date: "14 Feb 2026", source: "CH", description: "New Head of Adviser Distribution appointed \u2014 focus on MPS and institutional mandates" },
    ],
    scoreBreakdown: { firmScale: 11, distributionMatch: 13, regulatoryFit: 7, fundFit: 4, marketTiming: 1 },
    review_count: null,
    adviser_count: 28,
    signal_count: 0,
    active_mandate: "corporate_bond",
    brief_available: true,
    brief_who: "London-based DA firm with 28 advisers and a growing MPS proposition. New Head of Adviser Distribution appointed with a focus on institutional mandates. Established discretionary heritage with Niall O\u2019Shea leading investment strategy as CIO.",
    brief_why: "The new distribution head will be reviewing the fund universe to support MPS growth. WS Keyridge Corporate Bond Fund offers a differentiated fixed income allocation for their MPS construction. Early engagement before the review concludes is advisable.",
    brief_opener: "Your new Head of Adviser Distribution and MPS growth focus suggest an expanding fund universe \u2014 I\u2019d like to explore how Keyridge\u2019s corporate bond proposition could complement your MPS construction process.",
  },
  {
    id: "25",
    rank: 25,
    firm: "Premier Miton Investors",
    firmType: "DA Firm",
    region: "London",
    fitScore: 33,
    keySignal: "Investment committee refresh underway \u2014 exploring systematic complementary strategies alongside active core",
    fcaNumber: "FRN 181083",
    registrationDate: "03 Feb 1999",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["David Hambidge (Head of MI)", "Neil Birrell (CIO)", "Amanda Yeoman (Research)"],
    officeAddress: "Eastgate Court, High Street, Guildford GU1 3DE",
    companiesHouseNumber: "03639404",
    signals: [
      { date: "08 Mar 2026", source: "Web", description: "Investment committee page refreshed \u2014 systematic strategies listed as complementary allocation" },
    ],
    scoreBreakdown: { firmScale: 10, distributionMatch: 11, regulatoryFit: 7, fundFit: 4, marketTiming: 1 },
    review_count: null,
    adviser_count: 15,
    signal_count: 0,
    active_mandate: "corporate_bond",
    brief_available: true,
    brief_who: "London-based DA firm in Guildford with 15 advisers and an active core investment philosophy. Investment committee refresh underway with systematic strategies now listed as complementary allocation for the first time. Neil Birrell as CIO brings deep multi-manager experience.",
    brief_why: "The investment committee refresh and explicit acknowledgement of systematic complementary strategies creates a natural conversation starter. WS Keyridge Corporate Bond Fund could serve as an entry point for their fixed income allocation alongside the active core.",
    brief_opener: "Your investment committee refresh and addition of systematic strategies as a complementary allocation caught our attention \u2014 I\u2019d like to discuss how Keyridge\u2019s corporate bond and multi-asset range could fit alongside your active core.",
  },
];

// ── Fit score colour ──────────────────────────────────────────────────────────

function getFitScoreColor(score: number): string {
  if (score >= 70) return "var(--success)";
  if (score >= 50) return "var(--warning)";
  return "var(--neutral)";
}

// ── Firm type badge colours ───────────────────────────────────────────────────

function getFirmTypeBadgeStyle(type: FirmType): React.CSSProperties {
  switch (type) {
    case "DA Firm":
      return {
        background: "rgba(59,130,246,0.08)",
        border: "1px solid rgba(59,130,246,0.20)",
        color: "#2563EB",
      };
    case "AR Firm":
      return {
        background: "rgba(139,92,246,0.08)",
        border: "1px solid rgba(139,92,246,0.20)",
        color: "#7C3AED",
      };
    case "Network":
      return {
        background: "rgba(16,185,129,0.08)",
        border: "1px solid rgba(16,185,129,0.20)",
        color: "#059669",
      };
  }
}

// ── Source badge ──────────────────────────────────────────────────────────────

function getSourceBadgeStyle(source: SignalItem["source"]): React.CSSProperties {
  switch (source) {
    case "FCA":
      return { background: "rgba(59,130,246,0.08)", color: "#2563EB", border: "1px solid rgba(59,130,246,0.20)" };
    case "CH":
      return { background: "rgba(139,92,246,0.08)", color: "#7C3AED", border: "1px solid rgba(139,92,246,0.20)" };
    case "Web":
      return { background: "rgba(16,185,129,0.08)", color: "#059669", border: "1px solid rgba(16,185,129,0.20)" };
    case "Press":
      return { background: "rgba(245,158,11,0.08)", color: "#B45309", border: "1px solid rgba(245,158,11,0.20)" };
  }
}

// ── Inline FitBar (fit-score specific — green/warning/neutral) ────────────────

function FitBar({ score }: { score: number }) {
  const color = getFitScoreColor(score);
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}>
      <div
        style={{
          width: "60px",
          height: "3px",
          borderRadius: "9999px",
          background: "var(--bg-raised)",
          overflow: "hidden",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${score}%`,
            borderRadius: "9999px",
            background: color,
            transition: "width 600ms cubic-bezier(0.4,0,0.2,1) 200ms",
          }}
        />
      </div>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          fontVariantNumeric: "tabular-nums",
          color,
          fontWeight: 500,
        }}
      >
        {score}
      </span>
    </div>
  );
}

// ── Score breakdown bar ───────────────────────────────────────────────────────

function ScoreRow({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = Math.round((value / max) * 100);
  const color = pct >= 70 ? "var(--success)" : pct >= 50 ? "var(--warning)" : "var(--neutral)";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
      <span style={{ fontSize: "13px", color: "var(--text-secondary)", flex: 1, minWidth: 0 }}>{label}</span>
      <div style={{ width: "80px", height: "3px", borderRadius: "9999px", background: "var(--bg-raised)", overflow: "hidden", flexShrink: 0 }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "9999px" }} />
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: "var(--text-secondary)", fontVariantNumeric: "tabular-nums", minWidth: "36px", textAlign: "right" }}>
        {value}/{max}
      </span>
    </div>
  );
}

// ── Layer Status Badge ────────────────────────────────────────────────────────

function LayerStatusBadge({ state }: { state: LayerState }) {
  const config: Record<LayerState, { icon: React.ReactNode; label: string; style: React.CSSProperties }> = {
    live: {
      icon: <CircleDot size={12} />,
      label: "LIVE",
      style: {
        background: "var(--success-subtle)",
        border: "1px solid rgba(34,197,94,0.20)",
        color: "var(--success-text)",
      },
    },
    building: {
      icon: <Clock size={12} />,
      label: "BUILDING",
      style: {
        background: "rgba(107,114,128,0.08)",
        border: "1px solid rgba(107,114,128,0.20)",
        color: "var(--neutral-text)",
      },
    },
    licensed: {
      icon: <Lock size={12} />,
      label: "LICENSED",
      style: {
        background: "var(--accent-subtle)",
        border: "1px solid rgba(245,158,11,0.15)",
        color: "var(--accent)",
      },
    },
  };

  const { icon, label, style } = config[state];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "2px 8px",
        borderRadius: "9999px",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        ...style,
      }}
    >
      {icon}
      {label}
    </span>
  );
}

// ── Outreach Draft Modal ──────────────────────────────────────────────────────

function OutreachDraftModal({
  ifa,
  onClose,
}: {
  ifa: IFARanking;
  onClose: () => void;
}) {
  const totalScore = Object.values(ifa.scoreBreakdown).reduce((a, b) => a + b, 0);
  const topSignal = ifa.signals[0];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.24)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 8 }}
        transition={{ duration: 0.16, ease: [0.25, 0.1, 0.25, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-strong)",
          borderRadius: "12px",
          padding: "0",
          maxWidth: "640px",
          width: "100%",
          maxHeight: "80vh",
          overflowY: "auto",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
        }}
      >
        {/* Modal header */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "2px" }}>
              Outreach Brief — {ifa.firm}
            </div>
            <div style={{ fontSize: "11px", color: "var(--text-tertiary)", fontFamily: "var(--font-mono)" }}>
              For: {ifa.firm} · Mandate: Global Systematic · Score: {totalScore}/100
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px",
              color: "var(--text-tertiary)",
              display: "flex",
              alignItems: "center",
              borderRadius: "4px",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: "20px" }}>
          {/* Subject line */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              SUGGESTED SUBJECT LINE
            </div>
            <div
              style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "10px 12px",
                fontSize: "13px",
                color: "var(--text-primary)",
              }}
            >
              Global Systematic — allocation fit for {ifa.firm} client mandates
            </div>
          </div>

          {/* Opening hook */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              OPENING HOOK (SIGNAL-LED)
            </div>
            <div
              style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "12px",
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              We noted {topSignal?.description?.toLowerCase()}. Given this context, we believe the Keyridge Global Systematic mandate may represent a timely fit for your current investment framework.
            </div>
          </div>

          {/* Key points */}
          <div style={{ marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>
              KEY MANDATE POINTS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                "20-year live track record across full market cycles",
                "Systematic factor-based process — fully rules-driven, repeatable",
                "OCF 0.65% — competitive vs. peer group average of 0.91%",
                "Available on 12 major UK platforms including Transact, Nucleus, and Quilter",
              ].map((point, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                  <CheckCircle2 size={14} style={{ color: "var(--success-text)", flexShrink: 0, marginTop: "1px" }} />
                  <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div>
            <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>
              SUGGESTED CTA
            </div>
            <div
              style={{
                background: "var(--bg-raised)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                padding: "10px 12px",
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              Would a 20-minute call this week work to walk through the process and discuss how Global Systematic might complement your current fund universe?
            </div>
          </div>
        </div>

        {/* Modal footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: "1px solid var(--border)",
            display: "flex",
            gap: "8px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "7px 14px",
              border: "1px solid var(--border)",
              borderRadius: "6px",
              background: "transparent",
              fontSize: "13px",
              color: "var(--text-secondary)",
              cursor: "pointer",
            }}
          >
            Close
          </button>
          <button
            style={{
              padding: "7px 16px",
              background: "var(--accent)",
              border: "none",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 500,
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Copy to Clipboard
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ── Intelligence Signals Panel ───────────────────────────────────────────────

function IntelligenceSignalsPanel({ ifa }: { ifa: IFARanking }) {
  if (ifa.signal_count === 0) {
    // State C — empty state
    return (
      <div>
        <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
          INTELLIGENCE SIGNALS
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100px",
            textAlign: "center",
            gap: "8px",
          }}
        >
          <div
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              border: "1.5px solid var(--border-strong)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "1.5px",
                background: "var(--text-disabled)",
                borderRadius: "1px",
              }}
            />
          </div>
          <span style={{ fontSize: "12px", color: "var(--text-tertiary)" }}>
            Limited public signals available
          </span>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              color: "var(--text-tertiary)",
            }}
          >
            Intelligence based on FCA register data only
          </span>
        </div>
      </div>
    );
  }

  // State A (signal_count >= 3) or State B (signal_count 1-2)
  return (
    <div>
      <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
        INTELLIGENCE SIGNALS
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {ifa.signals.map((signal, i) => (
          <div key={i} style={{ display: "flex", gap: "10px" }}>
            <div
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "var(--accent)",
                flexShrink: 0,
                marginTop: "5px",
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "11px",
                    color: "var(--text-tertiary)",
                  }}
                >
                  {signal.date}
                </span>
                <span
                  style={{
                    ...getSourceBadgeStyle(signal.source),
                    padding: "1px 5px",
                    borderRadius: "4px",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                  }}
                >
                  {signal.source}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                {signal.description}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* State B — limited signals notice */}
      {ifa.signal_count >= 1 && ifa.signal_count <= 2 && (
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            marginTop: "12px",
            paddingTop: "10px",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "11px",
              letterSpacing: "0.01em",
              lineHeight: 1.4,
              color: "var(--text-tertiary)",
              margin: 0,
            }}
          >
            Additional public signals limited for this firm.
            <br />
            Profile based on FCA register and VouchedFor data.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Detail Panel ──────────────────────────────────────────────────────────────

function DetailPanel({
  ifa,
  onBuildBrief,
  briefVisible,
  setBriefVisible,
}: {
  ifa: IFARanking;
  onBuildBrief: () => void;
  briefVisible: string | null;
  setBriefVisible: (id: string | null) => void;
}) {
  const breakdown = ifa.scoreBreakdown;
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const prefersReducedMotion = useReducedMotion();
  const isBriefShown = briefVisible === ifa.id;

  // Determine CTA behaviour
  const showBrief = ifa.brief_available;

  const handleCTAClick = () => {
    if (showBrief) {
      setBriefVisible(isBriefShown ? null : ifa.id);
    } else {
      onBuildBrief();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "24px",
        }}
      >
        {/* Column 1 — Firm Profile */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
            FIRM PROFILE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            {[
              { label: "FCA Number", value: ifa.fcaNumber, mono: true },
              { label: "Registered", value: ifa.registrationDate, mono: true },
              { label: "Permissions", value: ifa.permissions, mono: false },
              { label: "Key Individuals", value: ifa.keyIndividuals.join(", "), mono: false },
              { label: "Office", value: ifa.officeAddress, mono: false },
              { label: "Companies House", value: ifa.companiesHouseNumber, mono: true },
            ].map(({ label, value, mono }) => (
              <div key={label} style={{ display: "flex", gap: "8px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-tertiary)", minWidth: "110px", flexShrink: 0 }}>{label}</span>
                <span
                  style={{
                    fontSize: "12px",
                    color: "var(--text-primary)",
                    fontFamily: mono ? "var(--font-mono)" : "var(--font-sans)",
                    fontVariantNumeric: mono ? "tabular-nums" : undefined,
                  }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Column 2 — Fit Score Breakdown */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
            FIT SCORE BREAKDOWN
          </div>
          <div>
            <ScoreRow label="Firm Scale" value={breakdown.firmScale} max={30} />
            <ScoreRow label="Distribution Match" value={breakdown.distributionMatch} max={25} />
            <ScoreRow label="Regulatory Fit" value={breakdown.regulatoryFit} max={20} />
            <ScoreRow label="Fund Fit" value={breakdown.fundFit} max={15} />
            <ScoreRow label="Market Timing" value={breakdown.marketTiming} max={10} />
            <div
              style={{
                marginTop: "12px",
                paddingTop: "12px",
                borderTop: "1px solid var(--border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>Total Score</span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: "var(--text-primary)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {total}<span style={{ fontSize: "11px", color: "var(--text-tertiary)", fontWeight: 400 }}>/100</span>
              </span>
            </div>
          </div>
          {/* CTA button */}
          {isBriefShown ? (
            <button
              onClick={handleCTAClick}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "8px 16px",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--text-secondary)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "all 120ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-strong)";
                e.currentTarget.style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.color = "var(--text-secondary)";
              }}
            >
              <FileText size={13} />
              Hide Brief
            </button>
          ) : (
            <button
              onClick={handleCTAClick}
              style={{
                marginTop: "16px",
                width: "100%",
                padding: "8px 16px",
                background: "var(--accent)",
                border: "none",
                borderRadius: "6px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#fff",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "background 120ms ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "var(--accent-hover)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--accent)")}
            >
              <FileText size={13} />
              {showBrief ? "Show Pre-Call Brief" : "Build Outreach Brief"}
            </button>
          )}
        </div>

        {/* Column 3 — Intelligence Signals */}
        <IntelligenceSignalsPanel ifa={ifa} />
      </div>

      {/* Brief section */}
      <AnimatePresence>
        {isBriefShown && ifa.brief_who && ifa.brief_why && ifa.brief_opener && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: prefersReducedMotion ? 0 : 0.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            style={{ overflow: "hidden" }}
          >
            <div
              style={{
                borderTop: "1px solid var(--border-subtle)",
                padding: "24px",
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "24px",
              }}
            >
              {/* WHO THEY ARE */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                  }}
                >
                  WHO THEY ARE
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {ifa.brief_who}
                </div>
              </div>

              {/* WHY KEYRIDGE FITS */}
              <div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "var(--text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                  }}
                >
                  WHY KEYRIDGE FITS
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 400,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {ifa.brief_why}
                </div>
              </div>

              {/* OPENING LINE */}
              <div
                style={{
                  background: "rgba(245, 158, 11, 0.08)",
                  border: "1px solid rgba(245, 158, 11, 0.20)",
                  borderRadius: "8px",
                  padding: "16px",
                }}
              >
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 500,
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginBottom: "8px",
                  }}
                >
                  OPENING LINE
                </div>
                <div
                  style={{
                    fontSize: "14px",
                    fontWeight: 500,
                    color: "var(--text-secondary)",
                    lineHeight: 1.6,
                  }}
                >
                  {ifa.brief_opener}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Layer 1 ───────────────────────────────────────────────────────────────────

function Layer1({
  selectedMandate,
  setSelectedMandate,
  selectedRegion,
  setSelectedRegion,
  selectedFirmType,
  setSelectedFirmType,
  selectedAUMBand,
  setSelectedAUMBand,
  selectedSignalFilter,
  setSelectedSignalFilter,
  expandedRow,
  setExpandedRow,
  onBuildBrief,
  briefVisible,
  setBriefVisible,
}: {
  selectedMandate: string;
  setSelectedMandate: (v: string) => void;
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  selectedFirmType: string;
  setSelectedFirmType: (v: string) => void;
  selectedAUMBand: string;
  setSelectedAUMBand: (v: string) => void;
  selectedSignalFilter: string;
  setSelectedSignalFilter: (v: string) => void;
  expandedRow: string | null;
  setExpandedRow: (id: string | null) => void;
  onBuildBrief: (ifa: IFARanking) => void;
  briefVisible: string | null;
  setBriefVisible: (id: string | null) => void;
}) {
  const filteredData = ifaRankings.filter((ifa) => {
    if (selectedMandate !== "all" && ifa.active_mandate !== selectedMandate) return false;
    if (selectedRegion !== "All UK" && ifa.region !== selectedRegion) return false;
    if (selectedFirmType !== "All" && ifa.firmType !== selectedFirmType) return false;
    return true;
  });

  const selectStyle: React.CSSProperties = {
    fontSize: "13px",
    color: "var(--text-secondary)",
    background: "var(--bg-raised)",
    border: "1px solid var(--border)",
    borderRadius: "6px",
    padding: "6px 28px 6px 10px",
    minWidth: "140px",
    appearance: "none",
    WebkitAppearance: "none",
    outline: "none",
    cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 8px center",
  };

  const mandateSelectStyle: React.CSSProperties = {
    ...selectStyle,
    minWidth: "280px",
  };

  const colHeaders = ["#", "IFA Firm", "Region", "Score", "Key Signal", "FCA Status", "Action"];

  const handleRowClick = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
    setBriefVisible(null);
  };

  // Market context
  const context = MARKET_CONTEXT[selectedMandate] || MARKET_CONTEXT["all"];
  const dotStyle = context.dotColor === "emerald"
    ? { background: "var(--success)", animation: "pulse-dot 2.2s ease-in-out infinite" }
    : (briefVisible !== null
        ? { background: "var(--text-tertiary)" }
        : { background: "var(--warning)", animation: "pulse-dot 2.2s ease-in-out infinite" });

  return (
    <div>
      {/* Filter bar */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          padding: "12px",
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <select style={mandateSelectStyle} value={selectedMandate} onChange={(e) => setSelectedMandate(e.target.value)}>
          {MANDATE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <select style={selectStyle} value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
          <option>All UK</option>
          <option>London</option>
          <option>South East</option>
          <option>Midlands</option>
          <option>North</option>
          <option>Scotland</option>
          <option>Wales</option>
        </select>
        <select style={selectStyle} value={selectedFirmType} onChange={(e) => setSelectedFirmType(e.target.value)}>
          <option>All</option>
          <option>DA Firm</option>
          <option>AR Firm</option>
          <option>Network</option>
        </select>
        <select style={selectStyle} value={selectedSignalFilter} onChange={(e) => setSelectedSignalFilter(e.target.value)}>
          <option>All</option>
          <option>New Signals Only</option>
          <option>Leadership Changes</option>
          <option>Platform Changes</option>
        </select>
      </div>

      {/* Universe stats strip */}
      <div
        style={{
          marginTop: "16px",
          marginBottom: "16px",
          display: "flex",
          gap: "4px",
          alignItems: "baseline",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>10,847</span>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}> IFAs in universe · </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}>847</span>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}> match {MANDATE_LABELS[selectedMandate] || "current"} criteria · </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>23</span>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}> have new signals this week</span>
      </div>

      {/* Market context strip */}
      <div
        style={{
          background: "var(--bg-raised)",
          border: "1px solid var(--border)",
          borderRadius: "6px",
          padding: "8px 12px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <div
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            flexShrink: 0,
            ...dotStyle,
          }}
        />
        <span
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            flex: 1,
            lineHeight: 1.5,
          }}
        >
          {context.text}
        </span>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "11px",
            color: "var(--text-tertiary)",
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Feb 2026 data
        </span>
      </div>

      {/* Ranked table */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "40px 220px 100px 180px 1fr 90px 100px",
            padding: "0 12px",
            borderBottom: "1px solid var(--border-strong)",
            background: "var(--bg-raised)",
          }}
        >
          {colHeaders.map((h) => (
            <div
              key={h}
              style={{
                padding: "10px 0",
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {h}
            </div>
          ))}
        </div>

        {/* Table rows */}
        {filteredData.map((ifa) => {
          const isExpanded = expandedRow === ifa.id;
          return (
            <div key={ifa.id}>
              <div
                onClick={() => handleRowClick(ifa.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 220px 100px 180px 1fr 90px 100px",
                  padding: "0 12px",
                  borderBottom: "1px solid var(--border-subtle)",
                  alignItems: "center",
                  cursor: "pointer",
                  background: isExpanded ? "var(--bg-raised)" : "transparent",
                  transition: "background 120ms ease",
                }}
                onMouseEnter={(e) => {
                  if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = "var(--bg-raised)";
                }}
                onMouseLeave={(e) => {
                  if (!isExpanded) (e.currentTarget as HTMLDivElement).style.background = "transparent";
                }}
              >
                {/* Rank */}
                <div
                  style={{
                    padding: "10px 0",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-tertiary)",
                    textAlign: "center",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {ifa.rank}
                </div>

                {/* Firm + type badge */}
                <div style={{ padding: "10px 0 10px 8px", display: "flex", alignItems: "center", gap: "6px", minWidth: 0 }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 500,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {ifa.firm}
                  </span>
                  <span
                    style={{
                      ...getFirmTypeBadgeStyle(ifa.firmType),
                      padding: "1px 6px",
                      borderRadius: "9999px",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      flexShrink: 0,
                    }}
                  >
                    {ifa.firmType}
                  </span>
                </div>

                {/* Region */}
                <div style={{ padding: "10px 0", fontSize: "13px", color: "var(--text-secondary)" }}>
                  {ifa.region}
                </div>

                {/* Score (stacked: context line + FitBar) */}
                <div style={{ padding: "10px 0 10px 8px" }}>
                  {(() => {
                    const contextLine =
                      ifa.review_count && ifa.review_count > 0
                        ? { num: ifa.review_count.toLocaleString("en-GB"), label: "reviews" }
                        : ifa.adviser_count && ifa.adviser_count > 0
                          ? { num: String(ifa.adviser_count), label: "advisers" }
                          : null;
                    return (
                      <>
                        {contextLine && (
                          <div style={{ fontSize: "12px", color: "var(--text-tertiary)", marginBottom: "4px" }}>
                            <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums" }}>{contextLine.num}</span>
                            <span style={{ fontFamily: "var(--font-sans)" }}> {contextLine.label}</span>
                          </div>
                        )}
                        <FitBar score={ifa.fitScore} />
                      </>
                    );
                  })()}
                </div>

                {/* Key Signal */}
                <div
                  style={{
                    padding: "10px 8px",
                    fontSize: "13px",
                    color: "var(--text-secondary)",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    lineHeight: 1.4,
                  }}
                >
                  {ifa.keySignal}
                </div>

                {/* FCA Status */}
                <div style={{ padding: "10px 0", display: "flex", alignItems: "center", gap: "6px" }}>
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "var(--success)",
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: "11px",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Authorised
                  </span>
                </div>

                {/* Action */}
                <div style={{ padding: "10px 0" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (ifa.brief_available) {
                        // Expand the row if not already expanded, then show brief
                        if (!isExpanded) {
                          setExpandedRow(ifa.id);
                        }
                        setBriefVisible(briefVisible === ifa.id ? null : ifa.id);
                      } else {
                        onBuildBrief(ifa);
                      }
                    }}
                    style={{
                      padding: "5px 10px",
                      background: "transparent",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "12px",
                      color: "var(--text-secondary)",
                      cursor: "pointer",
                      transition: "border-color 120ms ease, color 120ms ease",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--accent)";
                      e.currentTarget.style.color = "var(--accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--border)";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    {ifa.brief_available ? "Show Brief" : "Build Brief"}
                  </button>
                </div>
              </div>

              {/* Expanded detail panel */}
              <AnimatePresence>
                {isExpanded && (
                  <DetailPanel
                    ifa={ifa}
                    onBuildBrief={() => onBuildBrief(ifa)}
                    briefVisible={briefVisible}
                    setBriefVisible={setBriefVisible}
                  />
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Layer 2 — Building ────────────────────────────────────────────────────────

function Layer2() {
  return (
    <div style={{ position: "relative" }}>
      {/* Greyed preview content */}
      <div style={{ opacity: 0.35, pointerEvents: "none", userSelect: "none" }}>
        <div style={{ background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "8px", padding: "20px", marginBottom: "16px" }}>
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "16px" }}>
            Advanced Relevance Scoring
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                PHILOSOPHY MATCH ANALYSIS
              </div>
              <div style={{ background: "var(--bg-raised)", borderRadius: "6px", height: "120px" }} />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                PLATFORM OVERLAP MATRIX
              </div>
              <div style={{ background: "var(--bg-raised)", borderRadius: "6px", height: "120px" }} />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                CLIENT DEMOGRAPHIC ALIGNMENT
              </div>
              <div style={{ background: "var(--bg-raised)", borderRadius: "6px", height: "80px" }} />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "8px" }}>
                FEE TOLERANCE SIGNALS
              </div>
              <div style={{ background: "var(--bg-raised)", borderRadius: "6px", height: "80px" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(248,248,246,0.80)",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            padding: "20px",
            maxWidth: "320px",
            textAlign: "center",
          }}
        >
          <Clock size={24} style={{ color: "var(--text-tertiary)", margin: "0 auto 12px" }} />
          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "4px" }}>
            In development
          </div>
          <div style={{ fontSize: "13px", color: "var(--text-tertiary)" }}>
            Available Q2 2026
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Layer 3 — Licensed ────────────────────────────────────────────────────────

function Layer3() {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderLeft: "3px solid var(--accent)",
        borderRadius: "8px",
        padding: "20px",
        maxWidth: "520px",
      }}
    >
      <Lock size={20} style={{ color: "var(--accent)", marginBottom: "12px" }} />
      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginBottom: "8px" }}>
        Requires licensing
      </div>
      <div style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "12px" }}>
        This layer requires commercial data from:
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "12px" }}>
        {[
          "Defaqto — adviser fund usage data, panel preferences, research ratings",
          "LinkedIn Sales Navigator — people movement signals at scale, relationship mapping",
        ].map((item) => (
          <div key={item} style={{ display: "flex", gap: "8px" }}>
            <span style={{ color: "var(--text-tertiary)", flexShrink: 0 }}>•</span>
            <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}>{item}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: "13px", color: "var(--text-secondary)", fontStyle: "italic", marginTop: "12px", marginBottom: "16px" }}>
        These signals would increase actionable leads by an estimated 3–4x.
      </p>
      <a
        href="#"
        style={{
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--accent)",
          textDecoration: "none",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
        onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
      >
        Register Interest →
      </a>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function IFAPrioritisationPage() {
  const [selectedMandate, setSelectedMandate] = useState("all");
  const [selectedRegion, setSelectedRegion] = useState("All UK");
  const [selectedFirmType, setSelectedFirmType] = useState("All");
  const [selectedAUMBand, setSelectedAUMBand] = useState("Any");
  const [selectedSignalFilter, setSelectedSignalFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [draftContext, setDraftContext] = useState<IFARanking | null>(null);
  const [briefVisible, setBriefVisible] = useState<string | null>(null);

  const layers: {
    id: 1 | 2 | 3;
    label: string;
    sublabel: string;
    state: LayerState;
  }[] = [
    { id: 1, label: "Layer 1", sublabel: "Universe & Profile", state: "live" },
    { id: 2, label: "Layer 2", sublabel: "Relevance Scoring", state: "building" },
    { id: 3, label: "Layer 3", sublabel: "Readiness Signals", state: "licensed" },
  ];

  function handleBuildBrief(ifa: IFARanking) {
    setDraftContext(ifa);
    setIsDraftOpen(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
      style={{ background: "var(--bg-page)", minHeight: "100vh" }}
    >
      <TopBar title="IFA Prioritisation" />

      {/* Module Header */}
      <div
        style={{
          padding: "24px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text-primary)",
              letterSpacing: "-0.01em",
              margin: 0,
              lineHeight: 1.3,
            }}
          >
            IFA Prioritisation
          </h2>
          <p
            style={{
              fontSize: "13px",
              color: "var(--text-secondary)",
              marginTop: "4px",
              marginBottom: "8px",
              maxWidth: "600px",
              lineHeight: 1.5,
            }}
          >
            Rank 10,000+ UK IFAs by mandate fit using public data signals
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "2px 10px",
              borderRadius: "9999px",
              background: "var(--success-subtle)",
              border: "1px solid rgba(34,197,94,0.20)",
              color: "var(--success-text)",
              fontSize: "13px",
            }}
          >
            Public data only — no internal access required
          </span>
        </div>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 14px",
            background: "transparent",
            border: "1px solid var(--border)",
            borderRadius: "6px",
            fontSize: "13px",
            color: "var(--text-secondary)",
            cursor: "pointer",
            transition: "border-color 120ms ease, color 120ms ease",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--border-strong)";
            e.currentTarget.style.color = "var(--text-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}
        >
          <Database size={14} />
          Data Sources
        </button>
      </div>

      {/* Layer Navigation Tabs */}
      <div
        style={{
          borderBottom: "1px solid var(--border)",
          display: "flex",
          gap: 0,
          padding: "0 24px",
        }}
      >
        {layers.map((layer) => {
          const isActive = activeLayer === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(layer.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                background: "none",
                border: "none",
                borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                marginBottom: "-1px",
                cursor: "pointer",
                color: isActive
                  ? "var(--text-primary)"
                  : "var(--text-tertiary)",
                fontWeight: isActive ? 500 : 400,
                fontSize: "13px",
                transition: "color 120ms ease",
                opacity: !isActive && (layer.state === "building" || layer.state === "licensed") ? 0.8 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-secondary)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = "var(--text-tertiary)";
              }}
            >
              <span>{layer.label} — {layer.sublabel}</span>
              <LayerStatusBadge state={layer.state} />
            </button>
          );
        })}
      </div>

      {/* Content Area */}
      <div style={{ padding: "24px" }}>
        {activeLayer === 1 && (
          <Layer1
            selectedMandate={selectedMandate}
            setSelectedMandate={setSelectedMandate}
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedFirmType={selectedFirmType}
            setSelectedFirmType={setSelectedFirmType}
            selectedAUMBand={selectedAUMBand}
            setSelectedAUMBand={setSelectedAUMBand}
            selectedSignalFilter={selectedSignalFilter}
            setSelectedSignalFilter={setSelectedSignalFilter}
            expandedRow={expandedRow}
            setExpandedRow={setExpandedRow}
            onBuildBrief={handleBuildBrief}
            briefVisible={briefVisible}
            setBriefVisible={setBriefVisible}
          />
        )}

        {activeLayer === 2 && <Layer2 />}

        {activeLayer === 3 && <Layer3 />}

        {/* Data Freshness Strip */}
        <div
          style={{
            marginTop: "32px",
            paddingTop: "12px",
            borderTop: "1px solid var(--border-subtle)",
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          {[
            { label: "FCA Register", age: "2h ago" },
            { label: "Companies House", age: "4h ago" },
            { label: "FT Adviser", age: "35s ago" },
          ].map(({ label, age }) => (
            <span
              key={label}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "11px",
                color: "var(--text-tertiary)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {label}: {age}
            </span>
          ))}
        </div>
      </div>

      {/* Outreach Draft Modal */}
      <AnimatePresence>
        {isDraftOpen && draftContext && (
          <OutreachDraftModal
            ifa={draftContext}
            onClose={() => setIsDraftOpen(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
