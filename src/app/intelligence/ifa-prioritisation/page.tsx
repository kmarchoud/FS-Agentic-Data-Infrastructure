"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  philosophyMatch: number; // max 30
  platformOverlap: number; // max 25
  aumBandFit: number;       // max 20
  growthTrajectory: number; // max 15
  signalRecency: number;    // max 10
}

interface IFARanking {
  id: string;
  rank: number;
  firm: string;
  firmType: FirmType;
  region: string;
  estAUM: string;
  estAUMValue: number; // in millions, for sorting
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
}

// ── Mock data — 25 UK IFA firms ───────────────────────────────────────────────

const ifaRankings: IFARanking[] = [
  {
    id: "1",
    rank: 1,
    firm: "Paradigm Capital Ltd",
    firmType: "DA Firm",
    region: "London",
    estAUM: "£2.1bn",
    estAUMValue: 2100,
    fitScore: 91,
    keySignal: "Investment director Sarah Chen moved from Schroders Global 3 weeks ago — opens relationship door",
    fcaNumber: "FRN 512847",
    registrationDate: "14 Mar 2009",
    permissions: "Advising on investments, arranging deals, managing investments",
    keyIndividuals: ["James Whitfield (CEO)", "Sarah Chen (Investment Director)", "Rachel Moore (CIO)"],
    officeAddress: "12 Broadgate Circle, London EC2M 2QS",
    companiesHouseNumber: "06821934",
    signals: [
      { date: "10 Mar 2026", source: "Press", description: "Sarah Chen joins as Investment Director from Schroders Global Equity team" },
      { date: "28 Feb 2026", source: "Web", description: "Investment philosophy page updated — explicit reference to systematic and factor-based approaches" },
      { date: "15 Jan 2026", source: "FCA", description: "RMAR filing shows 22% AUM growth year-on-year" },
    ],
    scoreBreakdown: { philosophyMatch: 28, platformOverlap: 22, aumBandFit: 18, growthTrajectory: 14, signalRecency: 9 },
  },
  {
    id: "2",
    rank: 2,
    firm: "Attivo Group",
    firmType: "Network",
    region: "Manchester",
    estAUM: "£1.1bn",
    estAUMValue: 1100,
    fitScore: 87,
    keySignal: "Added systematic equity strategy to approved list per updated website Q4 2025",
    fcaNumber: "FRN 488312",
    registrationDate: "02 Sep 2007",
    permissions: "Advising on investments, arranging deals in investments",
    keyIndividuals: ["David Hartley (MD)", "Claire Simmons (Head of Investments)", "Tom Yates (Research Lead)"],
    officeAddress: "55 Spring Gardens, Manchester M2 2BX",
    companiesHouseNumber: "05834621",
    signals: [
      { date: "18 Nov 2025", source: "Web", description: "Approved list updated — systematic equity strategy category added" },
      { date: "04 Oct 2025", source: "CH", description: "New board appointment: Claire Simmons joins as Head of Investments" },
      { date: "22 Aug 2025", source: "FCA", description: "Permissions extended to include collective portfolio management" },
    ],
    scoreBreakdown: { philosophyMatch: 26, platformOverlap: 21, aumBandFit: 17, growthTrajectory: 14, signalRecency: 9 },
  },
  {
    id: "3",
    rank: 3,
    firm: "Foster Denovo",
    firmType: "DA Firm",
    region: "London",
    estAUM: "£3.2bn",
    estAUMValue: 3200,
    fitScore: 84,
    keySignal: "FCA RMAR shows 28% client growth YoY — scaling fast, may need broader fund range",
    fcaNumber: "FRN 462654",
    registrationDate: "11 Jun 2006",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Lee Robertson (CEO)", "Marc Sherland (CIO)", "Jessica Park (Head of Research)"],
    officeAddress: "1 Minster Court, Mincing Lane, London EC3R 7AA",
    companiesHouseNumber: "05764923",
    signals: [
      { date: "20 Feb 2026", source: "FCA", description: "RMAR shows 28% client growth year-on-year — fastest in three years" },
      { date: "12 Jan 2026", source: "Web", description: "New institutional proposition page launched targeting systematic mandates" },
      { date: "30 Nov 2025", source: "Press", description: "Foster Denovo listed in FT Adviser Top 100 Financial Advisers 2025" },
    ],
    scoreBreakdown: { philosophyMatch: 25, platformOverlap: 22, aumBandFit: 18, growthTrajectory: 13, signalRecency: 6 },
  },
  {
    id: "4",
    rank: 4,
    firm: "Progeny Wealth",
    firmType: "DA Firm",
    region: "Leeds",
    estAUM: "£1.2bn",
    estAUMValue: 1200,
    fitScore: 82,
    keySignal: "Director appointment: new Head of Investments from Jupiter AM (Companies House, 6 weeks ago)",
    fcaNumber: "FRN 534218",
    registrationDate: "28 Feb 2011",
    permissions: "Advising on investments, arranging deals, managing investments",
    keyIndividuals: ["Neil Moles (CEO)", "Andrew Buchanan (Head of Investments)", "Laura Tesh (CIO)"],
    officeAddress: "3 Whitehall Quay, Leeds LS1 4HR",
    companiesHouseNumber: "07512834",
    signals: [
      { date: "17 Feb 2026", source: "CH", description: "Andrew Buchanan appointed Head of Investments — previously at Jupiter Asset Management" },
      { date: "05 Jan 2026", source: "FCA", description: "New MiFID permissions granted for cross-border distribution" },
      { date: "20 Dec 2025", source: "Web", description: "Investment committee page updated — growth mandate focus added" },
    ],
    scoreBreakdown: { philosophyMatch: 24, platformOverlap: 20, aumBandFit: 17, growthTrajectory: 13, signalRecency: 8 },
  },
  {
    id: "5",
    rank: 5,
    firm: "Informed Financial Planning",
    firmType: "DA Firm",
    region: "Oxford",
    estAUM: "£890m",
    estAUMValue: 890,
    fitScore: 79,
    keySignal: "Investment philosophy page updated to emphasise systematic and factor-based approaches",
    fcaNumber: "FRN 497183",
    registrationDate: "03 Apr 2008",
    permissions: "Advising on investments, arranging deals in investments",
    keyIndividuals: ["Philip Dragoumis (MD)", "Helen Watkins (CIO)", "Mark Fairweather (Research)"],
    officeAddress: "Seacourt Tower, West Way, Oxford OX2 0JJ",
    companiesHouseNumber: "06384721",
    signals: [
      { date: "08 Mar 2026", source: "Web", description: "Philosophy page refresh — systematic factor investing and evidence-based allocation now central" },
      { date: "14 Feb 2026", source: "Press", description: "Shortlisted for Professional Adviser Awards — Best Client Outcomes category" },
      { date: "10 Jan 2026", source: "FCA", description: "RMAR filing indicates stable AUM growth of 14% year-on-year" },
    ],
    scoreBreakdown: { philosophyMatch: 27, platformOverlap: 18, aumBandFit: 15, growthTrajectory: 11, signalRecency: 8 },
  },
  {
    id: "6",
    rank: 6,
    firm: "Atticus Wealth",
    firmType: "DA Firm",
    region: "Bristol",
    estAUM: "£540m",
    estAUMValue: 540,
    fitScore: 76,
    keySignal: "Joined Nucleus platform Q3 — expanding fund access, reviewing panel",
    fcaNumber: "FRN 521094",
    registrationDate: "19 Jul 2010",
    permissions: "Advising on investments, arranging deals, credit broking",
    keyIndividuals: ["Simon Walsh (CEO)", "Natasha Brennan (Head of Investments)", "Chris Fielding (Research)"],
    officeAddress: "5 Glass Wharf, Bristol BS2 0FR",
    companiesHouseNumber: "07234816",
    signals: [
      { date: "01 Sep 2025", source: "Web", description: "Nucleus platform integration announced — new fund categories accessible to clients" },
      { date: "28 Aug 2025", source: "Press", description: "Atticus Wealth completes merger with Williams Financial Planning, AUM doubles" },
      { date: "12 Jul 2025", source: "FCA", description: "Approved persons update — three new investment advisers authorised" },
    ],
    scoreBreakdown: { philosophyMatch: 22, platformOverlap: 21, aumBandFit: 14, growthTrajectory: 12, signalRecency: 7 },
  },
  {
    id: "7",
    rank: 7,
    firm: "Perspective Financial Group",
    firmType: "Network",
    region: "Bristol",
    estAUM: "£1.8bn",
    estAUMValue: 1800,
    fitScore: 74,
    keySignal: "New client proposition document mentions 'evidence-based investing' — strong mandate fit",
    fcaNumber: "FRN 443781",
    registrationDate: "14 Jan 2005",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Paul Armson (CEO)", "Victoria Clarke (CIO)", "Ben Thomson (Head of Research)"],
    officeAddress: "Aztec West Business Park, Bristol BS32 4TD",
    companiesHouseNumber: "05234178",
    signals: [
      { date: "22 Feb 2026", source: "Web", description: "Client proposition document updated — 'evidence-based investing' and systematic allocation prominently featured" },
      { date: "15 Dec 2025", source: "CH", description: "Victoria Clarke appointed CIO — previously at Vanguard UK institutional team" },
      { date: "04 Nov 2025", source: "FCA", description: "Network permissions expanded — additional AR firms onboarded" },
    ],
    scoreBreakdown: { philosophyMatch: 23, platformOverlap: 19, aumBandFit: 16, growthTrajectory: 10, signalRecency: 6 },
  },
  {
    id: "8",
    rank: 8,
    firm: "Arbor Asset Management",
    firmType: "DA Firm",
    region: "Edinburgh",
    estAUM: "£680m",
    estAUMValue: 680,
    fitScore: 71,
    keySignal: "RMAR revenue up 41% — growing rapidly, underserved by current AM relationships",
    fcaNumber: "FRN 508921",
    registrationDate: "07 Nov 2009",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Alasdair MacLeod (CEO)", "Fiona Reid (CIO)", "Callum Fraser (Research Lead)"],
    officeAddress: "Quartermile 4, Lauriston Place, Edinburgh EH3 9EN",
    companiesHouseNumber: "SC384172",
    signals: [
      { date: "28 Jan 2026", source: "FCA", description: "RMAR revenue up 41% year-on-year — fastest growth in the firm's history" },
      { date: "10 Dec 2025", source: "CH", description: "Board expansion — two new non-executive directors appointed" },
      { date: "03 Oct 2025", source: "Web", description: "Investment team page expanded — global equity section added to core capability" },
    ],
    scoreBreakdown: { philosophyMatch: 21, platformOverlap: 18, aumBandFit: 15, growthTrajectory: 12, signalRecency: 5 },
  },
  {
    id: "9",
    rank: 9,
    firm: "Equilibrium Asset Management",
    firmType: "DA Firm",
    region: "North West",
    estAUM: "£780m",
    estAUMValue: 780,
    fitScore: 68,
    keySignal: "Published white paper on systematic alpha generation — signals philosophy alignment",
    fcaNumber: "FRN 452193",
    registrationDate: "22 May 2006",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Colin Lawson (Founder)", "Gavin Rankin (CIO)", "Sarah Rutherford (Research)"],
    officeAddress: "Ascot House, Epsom Avenue, Handforth SK9 3RN",
    companiesHouseNumber: "05812934",
    signals: [
      { date: "12 Mar 2026", source: "Web", description: "New white paper published: 'The Case for Systematic Alpha' — strong mandate alignment" },
      { date: "05 Feb 2026", source: "Press", description: "Equilibrium wins Best Discretionary Manager at Citywire Awards 2025" },
    ],
    scoreBreakdown: { philosophyMatch: 22, platformOverlap: 17, aumBandFit: 13, growthTrajectory: 10, signalRecency: 6 },
  },
  {
    id: "10",
    rank: 10,
    firm: "Cazenove Capital",
    firmType: "DA Firm",
    region: "London",
    estAUM: "£4.1bn",
    estAUMValue: 4100,
    fitScore: 66,
    keySignal: "New institutional mandate desk opened in Q1 2026 — actively seeking systematic strategies",
    fcaNumber: "FRN 113955",
    registrationDate: "01 Jun 1998",
    permissions: "Advising on investments, managing investments, arranging deals, safeguarding",
    keyIndividuals: ["Edmund Truell (Chair)", "Gemma Harrington (Head of Mandates)", "Alex Pemberton (CIO)"],
    officeAddress: "12 Moorgate, London EC2R 6DA",
    companiesHouseNumber: "01679384",
    signals: [
      { date: "03 Mar 2026", source: "Press", description: "Institutional mandate desk launched — targeting systematic and quantitative strategies" },
      { date: "18 Jan 2026", source: "CH", description: "Gemma Harrington joins as Head of Mandates — previously at BlackRock Institutional" },
    ],
    scoreBreakdown: { philosophyMatch: 20, platformOverlap: 19, aumBandFit: 13, growthTrajectory: 9, signalRecency: 5 },
  },
  {
    id: "11",
    rank: 11,
    firm: "Thorntons Investments",
    firmType: "DA Firm",
    region: "Scotland",
    estAUM: "£420m",
    estAUMValue: 420,
    fitScore: 64,
    keySignal: "FCA permissions updated — added collective investment undertakings to scope",
    fcaNumber: "FRN 487234",
    registrationDate: "15 Apr 2008",
    permissions: "Advising on investments, managing investments, collective investment undertakings",
    keyIndividuals: ["Robert Cairns (CEO)", "Moira Sinclair (Investment Director)"],
    officeAddress: "Whitehall House, 33 Yeaman Shore, Dundee DD1 4BJ",
    companiesHouseNumber: "SC289471",
    signals: [
      { date: "25 Feb 2026", source: "FCA", description: "Permissions updated — collective investment undertakings now in scope" },
      { date: "10 Nov 2025", source: "Web", description: "Website relaunched with enhanced institutional client focus" },
    ],
    scoreBreakdown: { philosophyMatch: 19, platformOverlap: 16, aumBandFit: 13, growthTrajectory: 10, signalRecency: 6 },
  },
  {
    id: "12",
    rank: 12,
    firm: "Raymond James Financial Services",
    firmType: "Network",
    region: "Midlands",
    estAUM: "£2.4bn",
    estAUMValue: 2400,
    fitScore: 63,
    keySignal: "Network expanded systematic fund category on approved list November 2025",
    fcaNumber: "FRN 705062",
    registrationDate: "12 Feb 2019",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Alan Steel (MD)", "Patrick Thomson (Research Director)", "Sophie Clarke (Compliance)"],
    officeAddress: "Colmore Gate, 2-6 Colmore Row, Birmingham B3 2QD",
    companiesHouseNumber: "11823947",
    signals: [
      { date: "15 Nov 2025", source: "Web", description: "Approved list expanded — systematic global equity now a recognised strategy category" },
      { date: "09 Sep 2025", source: "FCA", description: "New AR firms onboarded — network headcount now 340 advisers" },
    ],
    scoreBreakdown: { philosophyMatch: 18, platformOverlap: 20, aumBandFit: 12, growthTrajectory: 9, signalRecency: 4 },
  },
  {
    id: "13",
    rank: 13,
    firm: "Kingswood Group",
    firmType: "DA Firm",
    region: "London",
    estAUM: "£1.5bn",
    estAUMValue: 1500,
    fitScore: 61,
    keySignal: "New CIO appointment from Vanguard — strong factor investing background signals philosophy shift",
    fcaNumber: "FRN 578213",
    registrationDate: "08 Aug 2014",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Gary Wilder (CEO)", "Jonathan Hughes (CIO)", "Rebecca Stone (Research)"],
    officeAddress: "14 Cornhill, London EC3V 3ND",
    companiesHouseNumber: "09178234",
    signals: [
      { date: "01 Mar 2026", source: "CH", description: "Jonathan Hughes joins as CIO — previously Head of Factor Strategies at Vanguard UK" },
      { date: "20 Jan 2026", source: "Web", description: "Investment process page updated to include quantitative screening methodology" },
    ],
    scoreBreakdown: { philosophyMatch: 20, platformOverlap: 15, aumBandFit: 13, growthTrajectory: 9, signalRecency: 4 },
  },
  {
    id: "14",
    rank: 14,
    firm: "Succession Wealth",
    firmType: "Network",
    region: "South East",
    estAUM: "£2.9bn",
    estAUMValue: 2900,
    fitScore: 59,
    keySignal: "Platform consolidation to Transact and Nucleus — fund access broadening significantly",
    fcaNumber: "FRN 521041",
    registrationDate: "03 Mar 2010",
    permissions: "Advising on investments, arranging deals, managing investments",
    keyIndividuals: ["James Stevenson (CEO)", "Nicholas Crawford (Investment Director)"],
    officeAddress: "One Valpy, Reading RG1 1AR",
    companiesHouseNumber: "07134821",
    signals: [
      { date: "20 Feb 2026", source: "Press", description: "Platform migration complete — now operating across Transact, Nucleus and Quilter" },
      { date: "04 Dec 2025", source: "FCA", description: "Regulatory returns filed — AUM stable, client numbers growing" },
    ],
    scoreBreakdown: { philosophyMatch: 17, platformOverlap: 21, aumBandFit: 11, growthTrajectory: 7, signalRecency: 3 },
  },
  {
    id: "15",
    rank: 15,
    firm: "Beaufort Financial",
    firmType: "AR Firm",
    region: "South West",
    estAUM: "£310m",
    estAUMValue: 310,
    fitScore: 57,
    keySignal: "AR firm recently gaining DA status — independence drive creates fund selection opportunity",
    fcaNumber: "FRN 478921",
    registrationDate: "17 Sep 2007",
    permissions: "Advising on investments, arranging deals in investments",
    keyIndividuals: ["Michael Beaufort (Principal)", "Sandra Leigh (Head of Client Services)"],
    officeAddress: "Bath Road, Cheltenham GL53 7LH",
    companiesHouseNumber: "06234817",
    signals: [
      { date: "28 Feb 2026", source: "FCA", description: "Application submitted for direct authorisation — AR status to be relinquished Q3 2026" },
      { date: "11 Jan 2026", source: "Web", description: "'Our independence' section added to website — signals philosophy shift away from restricted advice" },
    ],
    scoreBreakdown: { philosophyMatch: 18, platformOverlap: 15, aumBandFit: 11, growthTrajectory: 9, signalRecency: 4 },
  },
  {
    id: "16",
    rank: 16,
    firm: "True Potential Wealth Management",
    firmType: "Network",
    region: "North East",
    estAUM: "£3.8bn",
    estAUMValue: 3800,
    fitScore: 55,
    keySignal: "Network MPS review underway — fund selection committee meeting Q2 2026",
    fcaNumber: "FRN 529360",
    registrationDate: "21 Jan 2011",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["David Harrison (CEO)", "Colin Lawson (CIO)", "Jonathan Polin (Investment Director)"],
    officeAddress: "True Potential House, Newburn Riverside, Newcastle NE15 8NZ",
    companiesHouseNumber: "07541923",
    signals: [
      { date: "15 Mar 2026", source: "Press", description: "MPS annual review announced — fund selection committee to meet April 2026" },
      { date: "06 Jan 2026", source: "FCA", description: "Network RMAR shows £380m net inflows in 2025 — strong platform growth" },
    ],
    scoreBreakdown: { philosophyMatch: 16, platformOverlap: 18, aumBandFit: 10, growthTrajectory: 8, signalRecency: 3 },
  },
  {
    id: "17",
    rank: 17,
    firm: "Canaccord Genuity Wealth",
    firmType: "DA Firm",
    region: "London",
    estAUM: "£2.2bn",
    estAUMValue: 2200,
    fitScore: 53,
    keySignal: "Institutional desk expanding — hired two ex-AM distribution professionals in Q4 2025",
    fcaNumber: "FRN 491044",
    registrationDate: "14 Dec 2008",
    permissions: "Advising on investments, managing investments, arranging deals, safeguarding",
    keyIndividuals: ["David Esfandi (CEO)", "Liz Brayshaw (CIO)", "Tim Giles (Head of Institutional)"],
    officeAddress: "88 Wood Street, London EC2V 7RS",
    companiesHouseNumber: "06812347",
    signals: [
      { date: "20 Nov 2025", source: "CH", description: "Two new appointments to institutional distribution team — ex-Fidelity and ex-M&G professionals" },
      { date: "12 Oct 2025", source: "Web", description: "Institutional capabilities section expanded — now covers systematic and quantitative strategies" },
    ],
    scoreBreakdown: { philosophyMatch: 17, platformOverlap: 16, aumBandFit: 11, growthTrajectory: 7, signalRecency: 2 },
  },
  {
    id: "18",
    rank: 18,
    firm: "Tilney Investment Management",
    firmType: "DA Firm",
    region: "London",
    estAUM: "£5.1bn",
    estAUMValue: 5100,
    fitScore: 51,
    keySignal: "Integration with Smith & Williamson complete — expanded investment committee now reviewing all mandates",
    fcaNumber: "FRN 121770",
    registrationDate: "08 Apr 1992",
    permissions: "Advising on investments, managing investments, arranging deals, safeguarding",
    keyIndividuals: ["Christopher Woodhouse (CEO)", "Emma Wall (Head of Research)", "Philip Goetz (CIO)"],
    officeAddress: "1 Gresham Street, London EC2V 7BX",
    companiesHouseNumber: "01789234",
    signals: [
      { date: "28 Jan 2026", source: "Press", description: "Evelyn Partners integration finalised — unified investment committee established" },
      { date: "15 Nov 2025", source: "Web", description: "Investment philosophy refreshed — systematic approaches now formally part of core framework" },
    ],
    scoreBreakdown: { philosophyMatch: 16, platformOverlap: 16, aumBandFit: 10, growthTrajectory: 7, signalRecency: 2 },
  },
  {
    id: "19",
    rank: 19,
    firm: "Quilter Financial Planning",
    firmType: "Network",
    region: "South East",
    estAUM: "£6.2bn",
    estAUMValue: 6200,
    fitScore: 49,
    keySignal: "New head of fund research appointed — prior role was at Morningstar covering systematic funds",
    fcaNumber: "FRN 440703",
    registrationDate: "17 Jan 2005",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["Steven Levin (CEO)", "Harriet Jenner (Head of Fund Research)", "Paul Harrison (CIO)"],
    officeAddress: "Senator House, 85 Queen Victoria Street, London EC4V 4AB",
    companiesHouseNumber: "05341782",
    signals: [
      { date: "10 Mar 2026", source: "CH", description: "Harriet Jenner appointed Head of Fund Research — previously Senior Analyst at Morningstar covering systematic equity" },
      { date: "25 Jan 2026", source: "FCA", description: "RMAR filed — network retains stable 1,200 adviser headcount" },
    ],
    scoreBreakdown: { philosophyMatch: 15, platformOverlap: 17, aumBandFit: 9, growthTrajectory: 6, signalRecency: 2 },
  },
  {
    id: "20",
    rank: 20,
    firm: "Hargreaves Lansdown Financial Advice",
    firmType: "DA Firm",
    region: "South West",
    estAUM: "£4.7bn",
    estAUMValue: 4700,
    fitScore: 47,
    keySignal: "Advice business strategic review — white label mandates under consideration for first time",
    fcaNumber: "FRN 115248",
    registrationDate: "12 Sep 1991",
    permissions: "Advising on investments, managing investments, arranging deals, safeguarding, deposit taking",
    keyIndividuals: ["Chris Hill (CEO)", "Lydia Romero (Head of Advice)", "Dan Olley (CTO)"],
    officeAddress: "One College Square South, Anchor Road, Bristol BS1 5HL",
    companiesHouseNumber: "02122142",
    signals: [
      { date: "05 Mar 2026", source: "Press", description: "Strategic review announced — white label mandate proposition to be piloted in H2 2026" },
      { date: "12 Feb 2026", source: "Web", description: "Adviser proposition page updated with expanded fund access messaging" },
    ],
    scoreBreakdown: { philosophyMatch: 14, platformOverlap: 16, aumBandFit: 9, growthTrajectory: 6, signalRecency: 2 },
  },
  {
    id: "21",
    rank: 21,
    firm: "Ascot Lloyd",
    firmType: "DA Firm",
    region: "South East",
    estAUM: "£1.6bn",
    estAUMValue: 1600,
    fitScore: 45,
    keySignal: "Five acquisitions in 12 months — integrating fund panels, creating new selection opportunity",
    fcaNumber: "FRN 543780",
    registrationDate: "04 Oct 2012",
    permissions: "Advising on investments, arranging deals, managing investments",
    keyIndividuals: ["Andrew Tripp (CEO)", "Mark Walsh (CIO)", "Charlotte Evans (Head of Research)"],
    officeAddress: "One Bartholomew Lane, London EC2N 2AX",
    companiesHouseNumber: "08234791",
    signals: [
      { date: "22 Feb 2026", source: "Press", description: "Fifth acquisition in 12 months — panel harmonisation project launched" },
      { date: "30 Jan 2026", source: "CH", description: "Board restructure following acquisitions — investment committee reformed" },
    ],
    scoreBreakdown: { philosophyMatch: 14, platformOverlap: 14, aumBandFit: 9, growthTrajectory: 6, signalRecency: 2 },
  },
  {
    id: "22",
    rank: 22,
    firm: "Mattioli Woods",
    firmType: "DA Firm",
    region: "Midlands",
    estAUM: "£1.9bn",
    estAUMValue: 1900,
    fitScore: 42,
    keySignal: "Pension consulting division expanding — new systematic mandate category added to investment framework",
    fcaNumber: "FRN 220687",
    registrationDate: "18 Nov 2003",
    permissions: "Advising on investments, managing investments, pension trustee, arranging deals",
    keyIndividuals: ["Ian Mattioli (CEO)", "Bob Woods (Chairman)", "Philip Spiers (CIO)"],
    officeAddress: "1 New Walk, Leicester LE1 6TH",
    companiesHouseNumber: "04462162",
    signals: [
      { date: "18 Jan 2026", source: "Web", description: "Pension consulting framework updated — systematic equity now a named category alongside traditional active" },
      { date: "05 Nov 2025", source: "FCA", description: "New permissions granted for pension trustee advisory services" },
    ],
    scoreBreakdown: { philosophyMatch: 13, platformOverlap: 14, aumBandFit: 8, growthTrajectory: 5, signalRecency: 2 },
  },
  {
    id: "23",
    rank: 23,
    firm: "Wesleyan Financial Services",
    firmType: "DA Firm",
    region: "Midlands",
    estAUM: "£1.1bn",
    estAUMValue: 1100,
    fitScore: 39,
    keySignal: "Diversifying beyond core professional market — exploring external AM relationships for first time",
    fcaNumber: "FRN 144467",
    registrationDate: "14 Jun 1996",
    permissions: "Advising on investments, arranging deals, insurance mediation",
    keyIndividuals: ["Craig Errington (CEO)", "Tim Johnson (CIO)", "Emma Bowell (Head of Research)"],
    officeAddress: "Colmore Circus, Birmingham B4 6AR",
    companiesHouseNumber: "02761324",
    signals: [
      { date: "25 Jan 2026", source: "Press", description: "CEO interview: 'We are exploring external asset management relationships for systematic strategies for the first time'" },
    ],
    scoreBreakdown: { philosophyMatch: 12, platformOverlap: 12, aumBandFit: 8, growthTrajectory: 5, signalRecency: 2 },
  },
  {
    id: "24",
    rank: 24,
    firm: "Brooks Macdonald",
    firmType: "DA Firm",
    region: "London",
    estAUM: "£3.3bn",
    estAUMValue: 3300,
    fitScore: 36,
    keySignal: "New head of adviser distribution — growing MPS proposition, reviewing fund universe",
    fcaNumber: "FRN 196822",
    registrationDate: "22 May 2000",
    permissions: "Advising on investments, managing investments, arranging deals, safeguarding",
    keyIndividuals: ["Andrew Shepherd (CEO)", "Caroline Connellan (President)", "Niall O'Shea (CIO)"],
    officeAddress: "21 Lombard Street, London EC3V 9AH",
    companiesHouseNumber: "03959023",
    signals: [
      { date: "14 Feb 2026", source: "CH", description: "New Head of Adviser Distribution appointed — focus on MPS and institutional mandates" },
    ],
    scoreBreakdown: { philosophyMatch: 11, platformOverlap: 13, aumBandFit: 7, growthTrajectory: 4, signalRecency: 1 },
  },
  {
    id: "25",
    rank: 25,
    firm: "Premier Miton Investors",
    firmType: "DA Firm",
    region: "London",
    estAUM: "£1.4bn",
    estAUMValue: 1400,
    fitScore: 33,
    keySignal: "Investment committee refresh underway — exploring systematic complementary strategies alongside active core",
    fcaNumber: "FRN 181083",
    registrationDate: "03 Feb 1999",
    permissions: "Advising on investments, managing investments, arranging deals",
    keyIndividuals: ["David Hambidge (Head of MI)", "Neil Birrell (CIO)", "Amanda Yeoman (Research)"],
    officeAddress: "Eastgate Court, High Street, Guildford GU1 3DE",
    companiesHouseNumber: "03639404",
    signals: [
      { date: "08 Mar 2026", source: "Web", description: "Investment committee page refreshed — systematic strategies listed as complementary allocation" },
    ],
    scoreBreakdown: { philosophyMatch: 10, platformOverlap: 11, aumBandFit: 7, growthTrajectory: 4, signalRecency: 1 },
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

// ── Detail Panel ──────────────────────────────────────────────────────────────

function DetailPanel({ ifa, onBuildBrief }: { ifa: IFARanking; onBuildBrief: () => void }) {
  const breakdown = ifa.scoreBreakdown;
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

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

      {/* Column 2 — Intelligence Signals */}
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
      </div>

      {/* Column 3 — Fit Score Breakdown */}
      <div>
        <div style={{ fontSize: "11px", fontWeight: 500, color: "var(--text-tertiary)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
          FIT SCORE BREAKDOWN
        </div>
        <div>
          <ScoreRow label="Philosophy match" value={breakdown.philosophyMatch} max={30} />
          <ScoreRow label="Platform overlap" value={breakdown.platformOverlap} max={25} />
          <ScoreRow label="AUM band fit" value={breakdown.aumBandFit} max={20} />
          <ScoreRow label="Growth trajectory" value={breakdown.growthTrajectory} max={15} />
          <ScoreRow label="Signal recency" value={breakdown.signalRecency} max={10} />
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
        <button
          onClick={onBuildBrief}
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
          Build Outreach Brief
        </button>
      </div>
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
}) {
  const aumBandMin: Record<string, number> = {
    Any: 0,
    "£50m+": 50,
    "£250m+": 250,
    "£500m+": 500,
    "£1bn+": 1000,
  };

  const filteredData = ifaRankings.filter((ifa) => {
    if (selectedRegion !== "All UK" && ifa.region !== selectedRegion) return false;
    if (selectedFirmType !== "All" && ifa.firmType !== selectedFirmType) return false;
    if (ifa.estAUMValue < (aumBandMin[selectedAUMBand] ?? 0)) return false;
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

  const colHeaders = ["#", "IFA Firm", "Region", "Est. AUM", "Fit Score", "Key Signal", "FCA Status", "Action"];

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
        <select style={selectStyle} value={selectedMandate} onChange={(e) => setSelectedMandate(e.target.value)}>
          <option>Global Systematic</option>
          <option>UK Balanced</option>
          <option>Diversified Income</option>
          <option>Absolute Return</option>
          <option>Strategic Bond</option>
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
        <select style={selectStyle} value={selectedAUMBand} onChange={(e) => setSelectedAUMBand(e.target.value)}>
          <option>Any</option>
          <option>£50m+</option>
          <option>£250m+</option>
          <option>£500m+</option>
          <option>£1bn+</option>
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
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}> match {selectedMandate} criteria · </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 500, color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>23</span>
        <span style={{ fontSize: "13px", color: "var(--text-secondary)" }}> have new signals this week</span>
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
            gridTemplateColumns: "40px 220px 100px 90px 130px 1fr 90px 100px",
            padding: "0 12px",
            borderBottom: "1px solid var(--border-strong)",
            background: "var(--bg-raised)",
          }}
        >
          {colHeaders.map((h, i) => (
            <div
              key={h}
              style={{
                padding: "10px 0",
                fontSize: "11px",
                fontWeight: 500,
                color: "var(--text-tertiary)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                textAlign: i === 3 ? "right" : "left",
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
                onClick={() => setExpandedRow(isExpanded ? null : ifa.id)}
                style={{
                  display: "grid",
                  gridTemplateColumns: "40px 220px 100px 90px 130px 1fr 90px 100px",
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

                {/* Est AUM */}
                <div
                  style={{
                    padding: "10px 0",
                    fontFamily: "var(--font-mono)",
                    fontSize: "12px",
                    color: "var(--text-primary)",
                    textAlign: "right",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {ifa.estAUM}
                </div>

                {/* Fit Score */}
                <div style={{ padding: "10px 0 10px 8px" }}>
                  <FitBar score={ifa.fitScore} />
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
                      onBuildBrief(ifa);
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
                    Build Brief
                  </button>
                </div>
              </div>

              {/* Expanded detail panel */}
              <AnimatePresence>
                {isExpanded && (
                  <DetailPanel
                    ifa={ifa}
                    onBuildBrief={() => onBuildBrief(ifa)}
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
  const [selectedMandate, setSelectedMandate] = useState("Global Systematic");
  const [selectedRegion, setSelectedRegion] = useState("All UK");
  const [selectedFirmType, setSelectedFirmType] = useState("All");
  const [selectedAUMBand, setSelectedAUMBand] = useState("Any");
  const [selectedSignalFilter, setSelectedSignalFilter] = useState("All");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activeLayer, setActiveLayer] = useState<1 | 2 | 3>(1);
  const [isDraftOpen, setIsDraftOpen] = useState(false);
  const [draftContext, setDraftContext] = useState<IFARanking | null>(null);

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
