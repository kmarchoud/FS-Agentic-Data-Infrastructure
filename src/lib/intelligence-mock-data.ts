// Regulex Intelligence — Intelligence Module Mock Data
// All data for the 6 new Intelligence modules

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type IFAFirm = {
  id: string;
  rank: number;
  name: string;
  region: string;
  estAUM: string;
  fitScore: number;
  signal: string;
  fcaStatus: "Authorised";
  type: "DA Firm" | "AR Firm" | "Network";
  fcaNumber: string;
  registrationDate: string;
  address: string;
  companiesHouseNumber: string;
  keyIndividuals: string[];
  signalHistory: { date: string; source: string; description: string }[];
  fitBreakdown: {
    philosophy: number;
    platformOverlap: number;
    aumFit: number;
    growth: number;
    signalRecency: number;
  };
};

export type CompetitorFund = {
  name: string;
  manager: string;
  aum: string;
  ocf: string;
  ytd: string;
  platforms: number;
  keyClaim: string;
  isKeyridge?: boolean;
  battlecard?: string[];
};

export type PlatformPresenceRow = {
  platform: string;
  globalSystematic: boolean;
  ukBalanced: boolean;
  diversifiedIncome: boolean;
  absoluteReturn: boolean;
  strategicBond: boolean;
  competitorCount: number;
};

export type Partnership = {
  id: string;
  am: string;
  distributor: string;
  announcedDate: string;
  trigger: string;
  mandateFit: string;
  peopleCatalyst: string;
  peopleSource: string;
  outcome: string;
  outcomeMetric: string;
};

export type PartnershipMatch = {
  rank: number;
  firm: string;
  signal: string;
  matchScore: number;
};

export type MarketEvent = {
  id: string;
  time: string;
  source: string;
  headline: string;
  context: string;
  mandateCount: number;
  mandates: {
    name: string;
    whyRelevant: string;
    opportunityType: "DEFENSIVE" | "OFFENSIVE" | "NEUTRAL";
  }[];
  ifaOutreach: { firm: string; reason: string; mandate: string }[];
};

export type SectorFlow = {
  sector: string;
  months: { month: string; flow: number }[];
};

export type PlatformAUM = {
  platform: string;
  aum: string;
  qoqDelta: string;
  qoqDirection: "up" | "down" | "flat";
};

// ---------------------------------------------------------------------------
// IFA PRIORITISATION — Module 1
// ---------------------------------------------------------------------------

export const ifaRankings: IFAFirm[] = [
  {
    id: "ifa-1",
    rank: 1,
    name: "Paradigm Capital Ltd",
    region: "London",
    estAUM: "£2.1bn",
    fitScore: 91,
    signal: "Investment director Sarah Chen moved from Schroders Global 3 weeks ago — opens relationship door",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "223344",
    registrationDate: "2008-03-14",
    address: "45 Moorgate, London EC2R 6AR",
    companiesHouseNumber: "06234891",
    keyIndividuals: ["Sarah Chen", "Marcus Taylor", "Diana Osei"],
    signalHistory: [
      { date: "2026-03-10", source: "FCA Register", description: "Sarah Chen registered as CF30 — Investment Management" },
      { date: "2026-02-28", source: "Companies House", description: "Annual accounts filed — revenue £14.2m (+22% YoY)" },
      { date: "2026-01-15", source: "Web", description: "Investment philosophy page updated to include systematic strategies" },
    ],
    fitBreakdown: { philosophy: 28, platformOverlap: 22, aumFit: 18, growth: 14, signalRecency: 9 },
  },
  {
    id: "ifa-2",
    rank: 2,
    name: "Attivo Group",
    region: "Manchester",
    estAUM: "£1.1bn",
    fitScore: 87,
    signal: "Added systematic equity strategy to approved list per updated website Q4 2025",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "445566",
    registrationDate: "2012-06-20",
    address: "2 Spinningfields, Manchester M3 3EB",
    companiesHouseNumber: "08123456",
    keyIndividuals: ["James Richardson", "Priya Mehta"],
    signalHistory: [
      { date: "2025-12-01", source: "Web", description: "Approved fund list updated — added systematic equity category" },
      { date: "2025-10-14", source: "Press", description: "FTAdviser interview: CEO discusses factor-based investing interest" },
    ],
    fitBreakdown: { philosophy: 26, platformOverlap: 20, aumFit: 17, growth: 14, signalRecency: 10 },
  },
  {
    id: "ifa-3",
    rank: 3,
    name: "Foster Denovo",
    region: "London",
    estAUM: "£3.2bn",
    fitScore: 84,
    signal: "FCA RMAR shows 28% client growth YoY — scaling fast, may need broader fund range",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "556677",
    registrationDate: "2005-11-08",
    address: "110 Bishopsgate, London EC2N 4AY",
    companiesHouseNumber: "05478923",
    keyIndividuals: ["Roger Foster", "Alison Denovo", "Tom Mackenzie"],
    signalHistory: [
      { date: "2026-03-01", source: "FCA Register", description: "RMAR filing shows 28% client growth year-on-year" },
      { date: "2026-01-20", source: "Press", description: "Citywire — firm wins 'Best Growth Firm' award at industry event" },
    ],
    fitBreakdown: { philosophy: 24, platformOverlap: 21, aumFit: 19, growth: 13, signalRecency: 7 },
  },
  {
    id: "ifa-4",
    rank: 4,
    name: "Progeny Wealth",
    region: "Leeds",
    estAUM: "£1.2bn",
    fitScore: 82,
    signal: "Director appointment: new Head of Investments from Jupiter AM (Companies House, 6 weeks ago)",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "667788",
    registrationDate: "2014-02-17",
    address: "34 Park Row, Leeds LS1 5JL",
    companiesHouseNumber: "09345678",
    keyIndividuals: ["Neil Sheridan", "Rachel Fox"],
    signalHistory: [
      { date: "2026-02-14", source: "Companies House", description: "New director appointment — Head of Investments (ex-Jupiter AM)" },
      { date: "2025-11-30", source: "Web", description: "Job posting for senior investment analyst — expanding team" },
    ],
    fitBreakdown: { philosophy: 25, platformOverlap: 18, aumFit: 17, growth: 14, signalRecency: 8 },
  },
  {
    id: "ifa-5",
    rank: 5,
    name: "Informed Financial Planning",
    region: "Oxford",
    estAUM: "£890m",
    fitScore: 79,
    signal: "Investment philosophy page updated to emphasise systematic and factor-based approaches",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "778899",
    registrationDate: "2010-09-23",
    address: "12 Broad Street, Oxford OX1 3AS",
    companiesHouseNumber: "07654321",
    keyIndividuals: ["David Oakes", "Laura Bennett"],
    signalHistory: [
      { date: "2026-02-20", source: "Web", description: "Investment philosophy page rewritten — now emphasises systematic and factor-based approaches" },
      { date: "2025-12-10", source: "FCA Register", description: "Two new CF30 approvals — team expanding" },
    ],
    fitBreakdown: { philosophy: 27, platformOverlap: 16, aumFit: 15, growth: 12, signalRecency: 9 },
  },
  {
    id: "ifa-6",
    rank: 6,
    name: "Atticus Wealth",
    region: "Bristol",
    estAUM: "£540m",
    fitScore: 76,
    signal: "Joined Nucleus platform Q3 — expanding fund access, reviewing panel",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "889900",
    registrationDate: "2016-04-11",
    address: "8 Queen Square, Bristol BS1 4JE",
    companiesHouseNumber: "10234567",
    keyIndividuals: ["Sophie Green", "Michael Harris"],
    signalHistory: [
      { date: "2025-09-15", source: "Press", description: "Joined Nucleus platform — expanding fund access capabilities" },
      { date: "2025-08-20", source: "Web", description: "Fund panel review announced on company blog" },
    ],
    fitBreakdown: { philosophy: 22, platformOverlap: 20, aumFit: 14, growth: 12, signalRecency: 8 },
  },
  {
    id: "ifa-7",
    rank: 7,
    name: "Perspective Financial Group",
    region: "Bristol",
    estAUM: "£1.8bn",
    fitScore: 74,
    signal: "New client proposition document mentions 'evidence-based investing' — strong mandate fit",
    fcaStatus: "Authorised",
    type: "Network",
    fcaNumber: "990011",
    registrationDate: "2003-07-29",
    address: "26 King Street, Bristol BS1 4DP",
    companiesHouseNumber: "04567890",
    keyIndividuals: ["Ian Browne", "Claire Sheridan", "Andrew Parker"],
    signalHistory: [
      { date: "2026-01-08", source: "Web", description: "Client proposition document updated — mentions 'evidence-based investing'" },
      { date: "2025-11-15", source: "Companies House", description: "Revenue up 18% per latest accounts" },
    ],
    fitBreakdown: { philosophy: 24, platformOverlap: 17, aumFit: 16, growth: 11, signalRecency: 6 },
  },
  {
    id: "ifa-8",
    rank: 8,
    name: "Arbor Asset Management",
    region: "Edinburgh",
    estAUM: "£680m",
    fitScore: 71,
    signal: "RMAR revenue up 41% — growing rapidly, underserved by current AM relationships",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "112233",
    registrationDate: "2015-01-06",
    address: "15 Charlotte Square, Edinburgh EH2 4DF",
    companiesHouseNumber: "SC456789",
    keyIndividuals: ["Alistair MacLeod", "Fiona Campbell"],
    signalHistory: [
      { date: "2026-03-05", source: "FCA Register", description: "RMAR revenue up 41% — fastest growth in peer group" },
      { date: "2025-12-20", source: "Press", description: "Scotsman interview — firm planning to expand fund panel in 2026" },
    ],
    fitBreakdown: { philosophy: 21, platformOverlap: 15, aumFit: 15, growth: 13, signalRecency: 7 },
  },
  // 17 additional realistic UK IFA firms
  {
    id: "ifa-9",
    rank: 9,
    name: "Chase de Vere",
    region: "London",
    estAUM: "£4.1bn",
    fitScore: 69,
    signal: "New Head of Research appointed from Morningstar — reviewing all fund panels",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "134567",
    registrationDate: "1998-05-12",
    address: "30 City Road, London EC1Y 2AB",
    companiesHouseNumber: "03456789",
    keyIndividuals: ["Mark Reynolds", "Jennifer Walsh"],
    signalHistory: [
      { date: "2026-02-15", source: "FCA Register", description: "New CF30 registration — Head of Research (ex-Morningstar)" },
    ],
    fitBreakdown: { philosophy: 20, platformOverlap: 18, aumFit: 14, growth: 10, signalRecency: 7 },
  },
  {
    id: "ifa-10",
    rank: 10,
    name: "Tilney Smith & Williamson",
    region: "London",
    estAUM: "£5.8bn",
    fitScore: 67,
    signal: "Expanded DFM proposition — systematic equity allocation gap in current range",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "145678",
    registrationDate: "2001-08-22",
    address: "6 New Street Square, London EC4A 3AQ",
    companiesHouseNumber: "04567891",
    keyIndividuals: ["Chris Sherwood", "Emma Cartwright"],
    signalHistory: [
      { date: "2026-01-28", source: "Press", description: "Citywire — firm expanding DFM proposition, adding new asset classes" },
    ],
    fitBreakdown: { philosophy: 19, platformOverlap: 17, aumFit: 16, growth: 9, signalRecency: 6 },
  },
  {
    id: "ifa-11",
    rank: 11,
    name: "Brewin Dolphin Wealth",
    region: "London",
    estAUM: "£6.2bn",
    fitScore: 65,
    signal: "Quarterly investment bulletin mentions interest in factor-based strategies",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "156789",
    registrationDate: "1999-11-03",
    address: "12 Smithfield Street, London EC1A 9BD",
    companiesHouseNumber: "03789012",
    keyIndividuals: ["Robin Sherlock", "Patricia Knight"],
    signalHistory: [
      { date: "2026-02-01", source: "Web", description: "Q4 investment bulletin references factor-based diversification" },
    ],
    fitBreakdown: { philosophy: 20, platformOverlap: 15, aumFit: 15, growth: 8, signalRecency: 7 },
  },
  {
    id: "ifa-12",
    rank: 12,
    name: "Succession Wealth",
    region: "South East",
    estAUM: "£2.4bn",
    fitScore: 63,
    signal: "Acquired two regional firms in Q4 — fund panel harmonisation expected",
    fcaStatus: "Authorised",
    type: "Network",
    fcaNumber: "167890",
    registrationDate: "2009-03-16",
    address: "Charter Court, Phoenix Way, Llansamlet SA7 9EG",
    companiesHouseNumber: "07890123",
    keyIndividuals: ["James Stevenson", "Helen Murray"],
    signalHistory: [
      { date: "2025-11-10", source: "Press", description: "Two regional firm acquisitions completed — panel review imminent" },
    ],
    fitBreakdown: { philosophy: 18, platformOverlap: 16, aumFit: 14, growth: 10, signalRecency: 5 },
  },
  {
    id: "ifa-13",
    rank: 13,
    name: "Kingswood Group",
    region: "London",
    estAUM: "£1.5bn",
    fitScore: 61,
    signal: "New CIO hire from BlackRock — systematic investment background",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "178901",
    registrationDate: "2011-07-25",
    address: "40 Gracechurch Street, London EC3V 0BT",
    companiesHouseNumber: "08901234",
    keyIndividuals: ["Gary Downing", "Samantha Brooks"],
    signalHistory: [
      { date: "2026-01-05", source: "FCA Register", description: "CIO appointment registered — ex-BlackRock systematic equity" },
    ],
    fitBreakdown: { philosophy: 19, platformOverlap: 14, aumFit: 13, growth: 9, signalRecency: 6 },
  },
  {
    id: "ifa-14",
    rank: 14,
    name: "Mattioli Woods",
    region: "Midlands",
    estAUM: "£3.6bn",
    fitScore: 59,
    signal: "Annual report highlights planned diversification into systematic strategies",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "189012",
    registrationDate: "2002-04-09",
    address: "1 New Walk Place, Leicester LE1 6RU",
    companiesHouseNumber: "05012345",
    keyIndividuals: ["Ian Mattioli", "Bob Woods", "Nathan Sheridan"],
    signalHistory: [
      { date: "2025-12-15", source: "Web", description: "Annual report references systematic strategy diversification plans" },
    ],
    fitBreakdown: { philosophy: 17, platformOverlap: 15, aumFit: 14, growth: 8, signalRecency: 5 },
  },
  {
    id: "ifa-15",
    rank: 15,
    name: "AFH Wealth Management",
    region: "Midlands",
    estAUM: "£7.1bn",
    fitScore: 57,
    signal: "Completed 5 acquisitions in 2025 — largest consolidator, panel review overdue",
    fcaStatus: "Authorised",
    type: "Network",
    fcaNumber: "190123",
    registrationDate: "2004-10-18",
    address: "Buntsford Gate, Bromsgrove B60 3DX",
    companiesHouseNumber: "05123456",
    keyIndividuals: ["Alan Hudson", "Fiona Henderson"],
    signalHistory: [
      { date: "2025-10-30", source: "Press", description: "Fifth acquisition of 2025 completed — panel harmonisation expected" },
    ],
    fitBreakdown: { philosophy: 16, platformOverlap: 14, aumFit: 14, growth: 8, signalRecency: 5 },
  },
  {
    id: "ifa-16",
    rank: 16,
    name: "Evelyn Partners",
    region: "London",
    estAUM: "£8.4bn",
    fitScore: 55,
    signal: "Rebrand from Smith & Williamson completed — new investment proposition launching Q1",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "201234",
    registrationDate: "1997-02-14",
    address: "45 Gresham Street, London EC2V 7BG",
    companiesHouseNumber: "02345678",
    keyIndividuals: ["Peter Waggott", "Sarah Sheridan"],
    signalHistory: [
      { date: "2026-01-20", source: "Press", description: "New investment proposition launch announced — expanding fund range" },
    ],
    fitBreakdown: { philosophy: 16, platformOverlap: 13, aumFit: 13, growth: 7, signalRecency: 6 },
  },
  {
    id: "ifa-17",
    rank: 17,
    name: "Punter Southall Wealth",
    region: "London",
    estAUM: "£920m",
    fitScore: 53,
    signal: "Pension fund specialist exploring multi-asset solutions for DC default funds",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "212345",
    registrationDate: "2007-06-30",
    address: "11 Strand, London WC2N 5HR",
    companiesHouseNumber: "06234567",
    keyIndividuals: ["Jonathan Punter", "Caroline Southall"],
    signalHistory: [
      { date: "2026-02-10", source: "Web", description: "DC default fund review page added to website" },
    ],
    fitBreakdown: { philosophy: 15, platformOverlap: 13, aumFit: 12, growth: 7, signalRecency: 6 },
  },
  {
    id: "ifa-18",
    rank: 18,
    name: "Wren Sterling",
    region: "Midlands",
    estAUM: "£1.3bn",
    fitScore: 51,
    signal: "Investment committee restructured — new members from institutional backgrounds",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "223456",
    registrationDate: "2013-09-12",
    address: "5 St James's Court, Derby DE21 7BF",
    companiesHouseNumber: "08345678",
    keyIndividuals: ["Peter Smyth", "Jane Collins"],
    signalHistory: [
      { date: "2025-12-05", source: "Companies House", description: "Two new director appointments from institutional asset management" },
    ],
    fitBreakdown: { philosophy: 15, platformOverlap: 12, aumFit: 12, growth: 7, signalRecency: 5 },
  },
  {
    id: "ifa-19",
    rank: 19,
    name: "Canaccord Genuity WM",
    region: "London",
    estAUM: "£4.5bn",
    fitScore: 49,
    signal: "Launched new MPS range — gaps in systematic equity allocation visible",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "234567",
    registrationDate: "2006-12-01",
    address: "41 Lothbury, London EC2R 7AE",
    companiesHouseNumber: "05678901",
    keyIndividuals: ["David Sheridan", "Maria Thompson"],
    signalHistory: [
      { date: "2026-01-15", source: "Press", description: "New MPS range launched — systematic equity underweight identified" },
    ],
    fitBreakdown: { philosophy: 14, platformOverlap: 12, aumFit: 12, growth: 6, signalRecency: 5 },
  },
  {
    id: "ifa-20",
    rank: 20,
    name: "Raymond James Investment Services",
    region: "London",
    estAUM: "£2.9bn",
    fitScore: 47,
    signal: "UK head of distribution recently appointed — relationship building opportunity",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "245678",
    registrationDate: "2008-11-14",
    address: "77 Cornhill, London EC3V 3QQ",
    companiesHouseNumber: "06789012",
    keyIndividuals: ["Stephen Day", "Katherine Moore"],
    signalHistory: [
      { date: "2026-02-20", source: "FCA Register", description: "New UK head of distribution registered" },
    ],
    fitBreakdown: { philosophy: 13, platformOverlap: 12, aumFit: 11, growth: 6, signalRecency: 5 },
  },
  {
    id: "ifa-21",
    rank: 21,
    name: "Sanlam Wealth",
    region: "London",
    estAUM: "£2.2bn",
    fitScore: 45,
    signal: "South African parent pushing global systematic allocation — cultural alignment",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "256789",
    registrationDate: "2010-03-22",
    address: "16 South Park, Sevenoaks TN13 1AN",
    companiesHouseNumber: "07890234",
    keyIndividuals: ["Andrew Gillmore", "Louise Pretorius"],
    signalHistory: [
      { date: "2025-11-20", source: "Press", description: "Parent company mandate to increase systematic equity allocation in UK" },
    ],
    fitBreakdown: { philosophy: 13, platformOverlap: 11, aumFit: 10, growth: 6, signalRecency: 5 },
  },
  {
    id: "ifa-22",
    rank: 22,
    name: "Fidelity Adviser Solutions",
    region: "London",
    estAUM: "£12.5bn",
    fitScore: 43,
    signal: "Platform expansion — third-party fund selection committee reviewing new managers",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "267890",
    registrationDate: "1995-06-08",
    address: "25 Cannon Street, London EC4M 5TA",
    companiesHouseNumber: "02890123",
    keyIndividuals: ["Brian Conroy", "Sarah Parker"],
    signalHistory: [
      { date: "2026-03-01", source: "Web", description: "Fund selection committee meeting scheduled for Q2" },
    ],
    fitBreakdown: { philosophy: 12, platformOverlap: 11, aumFit: 10, growth: 5, signalRecency: 5 },
  },
  {
    id: "ifa-23",
    rank: 23,
    name: "Abrdn Financial Planning",
    region: "Edinburgh",
    estAUM: "£9.3bn",
    fitScore: 41,
    signal: "Restructured adviser panel — new fund selection process being implemented",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "278901",
    registrationDate: "1999-09-15",
    address: "1 George Street, Edinburgh EH2 2LL",
    companiesHouseNumber: "SC123456",
    keyIndividuals: ["Keith Skeoch", "Amanda Young"],
    signalHistory: [
      { date: "2025-12-18", source: "Press", description: "Adviser panel restructured — new fund selection criteria published" },
    ],
    fitBreakdown: { philosophy: 12, platformOverlap: 10, aumFit: 10, growth: 5, signalRecency: 4 },
  },
  {
    id: "ifa-24",
    rank: 24,
    name: "Openwork Partnership",
    region: "South East",
    estAUM: "£14.8bn",
    fitScore: 39,
    signal: "Largest UK adviser network — annual fund review cycle starting Q2 2026",
    fcaStatus: "Authorised",
    type: "Network",
    fcaNumber: "289012",
    registrationDate: "1996-01-30",
    address: "Washington House, Swindon SN5 7EY",
    companiesHouseNumber: "02901234",
    keyIndividuals: ["Philip Howell", "Gemma Sheridan"],
    signalHistory: [
      { date: "2026-02-25", source: "Web", description: "Annual fund review cycle announced — submissions open Q2" },
    ],
    fitBreakdown: { philosophy: 11, platformOverlap: 10, aumFit: 9, growth: 5, signalRecency: 4 },
  },
  {
    id: "ifa-25",
    rank: 25,
    name: "Quilter Financial Planning",
    region: "London",
    estAUM: "£11.2bn",
    fitScore: 37,
    signal: "Launching MPS Q1 2026 — systematic equity gap identified in published factsheet",
    fcaStatus: "Authorised",
    type: "DA Firm",
    fcaNumber: "290123",
    registrationDate: "2000-04-12",
    address: "Senator House, 85 Queen Victoria St, London EC4V 4AB",
    companiesHouseNumber: "03012345",
    keyIndividuals: ["Steven Levin", "Mark Thompson"],
    signalHistory: [
      { date: "2026-01-10", source: "Press", description: "MPS launch announced — factsheet reveals systematic equity gap" },
    ],
    fitBreakdown: { philosophy: 10, platformOverlap: 9, aumFit: 9, growth: 5, signalRecency: 4 },
  },
];

// ---------------------------------------------------------------------------
// COMPETITIVE POSITIONING — Module 2
// ---------------------------------------------------------------------------

export const peerGroupFunds: CompetitorFund[] = [
  {
    name: "Keyridge Global Systematic",
    manager: "Keyridge AM",
    aum: "£4.2bn",
    ocf: "0.65%",
    ytd: "+3.1%",
    platforms: 12,
    keyClaim: "Systematic factor-based, 20yr track record",
    isKeyridge: true,
    battlecard: [],
  },
  {
    name: "Schroders QEP Global Core",
    manager: "Schroders",
    aum: "£8.1bn",
    ocf: "0.73%",
    ytd: "+4.2%",
    platforms: 31,
    keyClaim: "QEP systematic approach, ESG integrated",
    battlecard: [
      "Our OCF is 0.65% vs their 0.73% — 8bps cheaper with a 20-year systematic track record, 3x longer than QEP.",
      "QEP requires Schroders platform relationship — we sit on 12 platforms including Transact and Nucleus independently.",
      "Their ESG integration is a passive overlay — ours is embedded in the factor model from construction.",
    ],
  },
  {
    name: "Jupiter Merlin Growth",
    manager: "Jupiter",
    aum: "£5.3bn",
    ocf: "1.42%",
    ytd: "+2.8%",
    platforms: 28,
    keyClaim: "Multi-manager, actively managed allocation",
    battlecard: [
      "Jupiter Merlin charges 1.42% OCF — more than double our 0.65%. That's 77bps of drag every single year.",
      "Multi-manager introduces an additional layer of manager risk — our systematic approach removes human bias entirely.",
      "Their active allocation has underperformed our systematic model in 3 of the last 5 calendar years.",
    ],
  },
  {
    name: "Artemis Global Income",
    manager: "Artemis",
    aum: "£3.7bn",
    ocf: "0.83%",
    ytd: "+5.1%",
    platforms: 24,
    keyClaim: "Income-focused global equity, yield 2.8%",
    battlecard: [
      "Artemis is income-focused with a 2.8% yield — our mandate targets total return, which has outperformed income strategies in rising rate environments.",
      "Their concentrated portfolio (40-60 holdings) creates higher stock-specific risk vs our diversified factor approach.",
      "Global Income funds saw £1.2bn net outflows in 2025 — the trend is moving toward systematic total return.",
    ],
  },
  {
    name: "M&G Global Macro Bond",
    manager: "M&G",
    aum: "£2.1bn",
    ocf: "0.91%",
    ytd: "+1.9%",
    platforms: 19,
    keyClaim: "Macro-driven flexible fixed income",
    battlecard: [
      "M&G is a fixed income fund — different asset class. If an IFA is considering this as an alternative, their client needs equity exposure we can provide.",
      "Their macro-driven approach has a binary risk profile — our systematic equity model provides smoother, more predictable return patterns.",
      "At 0.91% OCF for a bond fund, our 0.65% equity fund offers better risk-adjusted value.",
    ],
  },
  {
    name: "Royal London Sustainable World",
    manager: "Royal London",
    aum: "£1.8bn",
    ocf: "0.79%",
    ytd: "+3.6%",
    platforms: 22,
    keyClaim: "ESG-integrated global multi-asset",
    battlecard: [
      "Royal London's ESG integration relies on exclusion screens — our factor model integrates ESG as a return-enhancing signal, not just a constraint.",
      "Their multi-asset approach dilutes equity returns — clients wanting global equity exposure get a cleaner, more efficient allocation with us.",
      "At £1.8bn AUM vs our £4.2bn, we have significantly more liquidity and lower market impact costs.",
    ],
  },
];

export const competitorBattlecards: Record<string, string[]> = {
  "Schroders QEP Global Core": [
    "Our OCF is 0.65% vs their 0.73% — 8bps cheaper with a 20-year systematic track record, 3x longer than QEP.",
    "QEP requires Schroders platform relationship — we sit on 12 platforms including Transact and Nucleus independently.",
    "Their ESG integration is a passive overlay — ours is embedded in the factor model from construction.",
  ],
  "Jupiter Merlin Growth": [
    "Jupiter Merlin charges 1.42% OCF — more than double our 0.65%. That's 77bps of drag every single year.",
    "Multi-manager introduces an additional layer of manager risk — our systematic approach removes human bias entirely.",
    "Their active allocation has underperformed our systematic model in 3 of the last 5 calendar years.",
  ],
  "Artemis Global Income": [
    "Artemis is income-focused with a 2.8% yield — our mandate targets total return, which has outperformed income strategies in rising rate environments.",
    "Their concentrated portfolio (40-60 holdings) creates higher stock-specific risk vs our diversified factor approach.",
    "Global Income funds saw £1.2bn net outflows in 2025 — the trend is moving toward systematic total return.",
  ],
  "M&G Global Macro Bond": [
    "M&G is a fixed income fund — different asset class. If an IFA is considering this as an alternative, their client needs equity exposure we can provide.",
    "Their macro-driven approach has a binary risk profile — our systematic equity model provides smoother, more predictable return patterns.",
    "At 0.91% OCF for a bond fund, our 0.65% equity fund offers better risk-adjusted value.",
  ],
  "Royal London Sustainable World": [
    "Royal London's ESG integration relies on exclusion screens — our factor model integrates ESG as a return-enhancing signal, not just a constraint.",
    "Their multi-asset approach dilutes equity returns — clients wanting global equity exposure get a cleaner, more efficient allocation with us.",
    "At £1.8bn AUM vs our £4.2bn, we have significantly more liquidity and lower market impact costs.",
  ],
};

// ---------------------------------------------------------------------------
// PLATFORM FLOW — Module 6
// ---------------------------------------------------------------------------

export const platformPresence: PlatformPresenceRow[] = [
  { platform: "Hargreaves Lansdown", globalSystematic: false, ukBalanced: false, diversifiedIncome: true, absoluteReturn: false, strategicBond: true, competitorCount: 4 },
  { platform: "Quilter", globalSystematic: true, ukBalanced: true, diversifiedIncome: true, absoluteReturn: false, strategicBond: true, competitorCount: 3 },
  { platform: "Transact", globalSystematic: true, ukBalanced: true, diversifiedIncome: true, absoluteReturn: true, strategicBond: true, competitorCount: 2 },
  { platform: "Nucleus", globalSystematic: true, ukBalanced: false, diversifiedIncome: true, absoluteReturn: false, strategicBond: true, competitorCount: 3 },
  { platform: "AJ Bell", globalSystematic: false, ukBalanced: false, diversifiedIncome: true, absoluteReturn: false, strategicBond: true, competitorCount: 4 },
  { platform: "Standard Life", globalSystematic: true, ukBalanced: true, diversifiedIncome: false, absoluteReturn: false, strategicBond: true, competitorCount: 2 },
  { platform: "Aviva", globalSystematic: false, ukBalanced: true, diversifiedIncome: true, absoluteReturn: false, strategicBond: true, competitorCount: 3 },
  { platform: "Zurich", globalSystematic: true, ukBalanced: true, diversifiedIncome: true, absoluteReturn: false, strategicBond: true, competitorCount: 2 },
];

// ---------------------------------------------------------------------------
// PARTNERSHIP INTELLIGENCE — Module 3
// ---------------------------------------------------------------------------

export const partnerships: Partnership[] = [
  {
    id: "part-1",
    am: "JPMorgan",
    distributor: "True Potential",
    announcedDate: "2017-06-15",
    trigger: "True Potential's discretionary service launched 2017 required institutional-grade systematic equity exposure not available in their existing fund panel.",
    mandateFit: "JPMorgan US Equity Income matched True Potential's target demographic (risk-averse, income-seeking) and their then-emerging digital distribution model.",
    peopleCatalyst: "True Potential's CIO David Harrison had a prior relationship with JPMorgan's UK Wholesale team from his previous role at Standard Life Investments (2014-2017).",
    peopleSource: "LinkedIn profile, FCA register",
    outcome: "True Potential became one of JPMorgan's top 10 UK wholesale distributors by AUM within 24 months.",
    outcomeMetric: "£1.2bn AUM estimated at peak (2021, FT Adviser)",
  },
  {
    id: "part-2",
    am: "Schroders",
    distributor: "Benchmark Capital",
    announcedDate: "2019-03-22",
    trigger: "Benchmark's DPS (Discretionary Portfolio Service) AUM grew 140% in 2 years, outgrowing their existing systematic equity allocation.",
    mandateFit: "Schroders QEP provided the systematic equity building block for Benchmark's risk-graded model portfolios.",
    peopleCatalyst: "Benchmark's Head of Investment Strategy previously worked at Schroders' institutional division.",
    peopleSource: "LinkedIn profile, Companies House",
    outcome: "Benchmark became Schroders' fastest-growing UK intermediary relationship.",
    outcomeMetric: "£800m AUM within 18 months",
  },
  {
    id: "part-3",
    am: "Columbia Threadneedle",
    distributor: "Openwork",
    announcedDate: "2020-09-10",
    trigger: "Openwork's annual fund panel review identified a gap in their global equity allocation — existing providers underperforming.",
    mandateFit: "Columbia Threadneedle Global Focus met Openwork's ESG requirements and performance criteria for their centralised investment proposition.",
    peopleCatalyst: "Openwork's CIO had met Columbia Threadneedle's distribution head at a Citywire event and maintained an informal dialogue.",
    peopleSource: "Press, FCA register",
    outcome: "Openwork added Columbia Threadneedle to their recommended fund list across 4,500 advisers.",
    outcomeMetric: "£450m estimated AUM within first year",
  },
];

export const partnershipMatches: PartnershipMatch[] = [
  { rank: 1, firm: "Quilter Financial Planning", signal: "Launching MPS Q1 2026, systematic equity gap identified in factsheet", matchScore: 88 },
  { rank: 2, firm: "Benchmark Capital", signal: "DPS AUM grew 140% in 2 years, current systematic equity offering thin", matchScore: 84 },
  { rank: 3, firm: "Perspective Group", signal: "New CIO from institutional AM, expanding product range (FCA register)", matchScore: 81 },
  { rank: 4, firm: "Ascot Lloyd", signal: "Platform expansion to Nucleus suggests fund panel review underway", matchScore: 78 },
  { rank: 5, firm: "Sandringham Financial Partners", signal: "Regulation-driven consolidation creating systematic exposure gap", matchScore: 75 },
  { rank: 6, firm: "Almary Green", signal: "Investment committee minutes mention 'factor-based diversification' as 2026 priority", matchScore: 72 },
  { rank: 7, firm: "Wren Sterling", signal: "New investment committee members from institutional backgrounds", matchScore: 68 },
  { rank: 8, firm: "Kingswood Group", signal: "CIO appointment from BlackRock systematic equity division", matchScore: 65 },
];

// ---------------------------------------------------------------------------
// MARKET INTELLIGENCE — Module 4
// ---------------------------------------------------------------------------

export const marketEvents: MarketEvent[] = [
  {
    id: "evt-1",
    time: "08:15",
    source: "BoE",
    headline: "Bank of England holds base rate at 4.5%",
    context: "The MPC voted 6-3 to maintain the base rate at 4.5%, with three members favouring a 25bp cut. Markets had priced in a 40% probability of a cut. Sterling strengthened 0.3% against the dollar on the announcement.",
    mandateCount: 3,
    mandates: [
      { name: "Strategic Bond", whyRelevant: "Rate hold supports short-duration positioning in the fund; current 3.2yr duration is well-positioned vs peers averaging 5.1yr", opportunityType: "DEFENSIVE" },
      { name: "Global Systematic", whyRelevant: "Factor model's quality tilt benefits from stable rate environment; rate-sensitive growth stocks remain underweight", opportunityType: "NEUTRAL" },
      { name: "Diversified Income", whyRelevant: "Yield advantage maintained at current rate level; 4.1% distribution yield remains competitive vs deposit rates", opportunityType: "OFFENSIVE" },
    ],
    ifaOutreach: [
      { firm: "Paradigm Capital", reason: "Risk-averse client base benefits from rate hold stability; Strategic Bond narrative", mandate: "Strategic Bond" },
      { firm: "Foster Denovo", reason: "Last discussed fixed income 8 weeks ago; this event gives natural re-engagement hook", mandate: "Strategic Bond" },
      { firm: "Attivo Group", reason: "Investment philosophy updated to emphasise duration sensitivity last month", mandate: "Global Systematic" },
    ],
  },
  {
    id: "evt-2",
    time: "09:30",
    source: "ONS",
    headline: "UK CPI prints 2.8% — below consensus",
    context: "UK Consumer Price Index came in at 2.8% year-on-year for February, below the consensus estimate of 3.0%. Core CPI also surprised to the downside at 3.5% vs 3.7% expected. This strengthens the case for rate cuts later in 2026.",
    mandateCount: 2,
    mandates: [
      { name: "Strategic Bond", whyRelevant: "Below-consensus CPI supports duration extension thesis; fund positioned to benefit from eventual rate cuts", opportunityType: "OFFENSIVE" },
      { name: "UK Balanced", whyRelevant: "Lower inflation supports UK equity valuations and domestic consumer spending outlook", opportunityType: "OFFENSIVE" },
    ],
    ifaOutreach: [
      { firm: "Progeny Wealth", reason: "New Head of Investments may want to discuss inflation outlook and bond positioning", mandate: "Strategic Bond" },
      { firm: "Informed Financial Planning", reason: "Client base heavily exposed to UK equities — inflation print supports allocation", mandate: "UK Balanced" },
    ],
  },
  {
    id: "evt-3",
    time: "10:05",
    source: "Reuters",
    headline: "LGPS consolidation pool expansion announced",
    context: "The government confirmed plans to accelerate Local Government Pension Scheme consolidation, with 8 regional pools expected to manage over £500bn by 2030. This creates opportunities for managers with institutional-grade systematic strategies.",
    mandateCount: 4,
    mandates: [
      { name: "Global Systematic", whyRelevant: "LGPS consolidation favours systematic approaches with institutional governance frameworks", opportunityType: "OFFENSIVE" },
      { name: "UK Balanced", whyRelevant: "Consolidated pools likely to increase UK equity allocation under government guidance", opportunityType: "OFFENSIVE" },
      { name: "Diversified Income", whyRelevant: "Income mandates remain core to LGPS liability-matching strategies", opportunityType: "NEUTRAL" },
      { name: "Strategic Bond", whyRelevant: "LDI requirements of consolidated pools create demand for strategic bond mandates", opportunityType: "DEFENSIVE" },
    ],
    ifaOutreach: [
      { firm: "Chase de Vere", reason: "Advises several local authority pension funds — LGPS consolidation directly relevant", mandate: "Global Systematic" },
      { firm: "Mattioli Woods", reason: "Strong pension fund advisory practice — consolidation creates new opportunities", mandate: "Global Systematic" },
    ],
  },
  {
    id: "evt-4",
    time: "10:45",
    source: "FT",
    headline: "Global equity markets rally on Fed dovish signals",
    context: "US markets rose 1.8% overnight after Federal Reserve Chair signalled openness to rate cuts in H2 2026. European markets followed with gains of 0.9-1.2%. The move favours growth and quality factor tilts.",
    mandateCount: 2,
    mandates: [
      { name: "Global Systematic", whyRelevant: "Quality factor tilt in our model benefits from risk-on rotation; positioned to capture rally continuation", opportunityType: "OFFENSIVE" },
      { name: "Absolute Return", whyRelevant: "Long-short positioning captured upside overnight; low-beta profile provides cushion if rally fades", opportunityType: "NEUTRAL" },
    ],
    ifaOutreach: [
      { firm: "Atticus Wealth", reason: "Recent platform expansion — good time to discuss equity positioning opportunities", mandate: "Global Systematic" },
      { firm: "Arbor Asset Management", reason: "Growing rapidly and underserved — rally provides natural conversation starter", mandate: "Global Systematic" },
    ],
  },
  {
    id: "evt-5",
    time: "11:20",
    source: "Citywire",
    headline: "Multi-asset sector sees £2.1bn outflows in March",
    context: "The IA Mixed Investment 40-85% sector recorded £2.1bn net outflows in March, the third consecutive month of negative flows. Advisers are increasingly moving to risk-graded model portfolios and systematic strategies.",
    mandateCount: 3,
    mandates: [
      { name: "Global Systematic", whyRelevant: "Outflows from traditional multi-asset create opportunity for systematic alternatives; our approach directly addresses adviser concerns", opportunityType: "OFFENSIVE" },
      { name: "UK Balanced", whyRelevant: "UK-focused balanced funds seeing relative inflows as advisers reduce global multi-asset exposure", opportunityType: "DEFENSIVE" },
      { name: "Diversified Income", whyRelevant: "Income mandates attracting flows from multi-asset as advisers seek clearer outcome-oriented funds", opportunityType: "OFFENSIVE" },
    ],
    ifaOutreach: [
      { firm: "Perspective Financial Group", reason: "Evidence-based investing philosophy aligns with systematic narrative — multi-asset outflow story resonates", mandate: "Global Systematic" },
      { firm: "Succession Wealth", reason: "Panel review following acquisitions — good timing to position against traditional multi-asset", mandate: "Global Systematic" },
    ],
  },
];

// ---------------------------------------------------------------------------
// PLATFORM FLOW — Module 6 (Sector Flows & Platform AUM)
// ---------------------------------------------------------------------------

export const iaSectorFlows: SectorFlow[] = [
  {
    sector: "IA Global",
    months: [
      { month: "Oct", flow: -340 },
      { month: "Nov", flow: -280 },
      { month: "Dec", flow: -310 },
      { month: "Jan", flow: -290 },
      { month: "Feb", flow: -260 },
      { month: "Mar", flow: -320 },
    ],
  },
  {
    sector: "IA Strategic Bond",
    months: [
      { month: "Oct", flow: 120 },
      { month: "Nov", flow: 190 },
      { month: "Dec", flow: 240 },
      { month: "Jan", flow: 180 },
      { month: "Feb", flow: 210 },
      { month: "Mar", flow: 270 },
    ],
  },
  {
    sector: "IA Mixed 40-85%",
    months: [
      { month: "Oct", flow: -80 },
      { month: "Nov", flow: 40 },
      { month: "Dec", flow: 110 },
      { month: "Jan", flow: -30 },
      { month: "Feb", flow: 60 },
      { month: "Mar", flow: -90 },
    ],
  },
];

export const platformAUM: PlatformAUM[] = [
  { platform: "Hargreaves Lansdown", aum: "£149bn", qoqDelta: "+3.2%", qoqDirection: "up" },
  { platform: "Quilter", aum: "£104bn", qoqDelta: "+1.1%", qoqDirection: "up" },
  { platform: "AJ Bell", aum: "£82bn", qoqDelta: "+2.8%", qoqDirection: "up" },
  { platform: "Aegon", aum: "£58bn", qoqDelta: "0.0%", qoqDirection: "flat" },
  { platform: "Transact", aum: "£53bn", qoqDelta: "+4.7%", qoqDirection: "up" },
  { platform: "Nucleus", aum: "£28bn", qoqDelta: "+6.1%", qoqDirection: "up" },
];

// ---------------------------------------------------------------------------
// AI RESEARCH — Module 5
// ---------------------------------------------------------------------------

export const suggestedQueries: string[] = [
  "Who should we target for Global Systematic in the South East?",
  "How is Schroders positioned against us for the IA Global sector?",
  "Which IFAs have had leadership changes in the last 30 days?",
  "Which platforms carry Artemis but not Keyridge?",
  "What are the top 5 IFA firms by growth rate in the Midlands?",
  "Show me partnership patterns similar to JPMorgan + True Potential",
  "Which IFAs mention factor-based investing on their websites?",
  "Compare our platform distribution with Schroders QEP",
];

// ---------------------------------------------------------------------------
// FUND IMPACT TYPES & DATA — Section I
// ---------------------------------------------------------------------------

export type ImpactLevel = "POSITIVE_HIGH" | "POSITIVE_MODERATE" | "POSITIVE_LOW" | "NEUTRAL" | "WATCH" | "RISK" | "RISK_HIGH" | "RISK_MODERATE" | "POSITIVE_CONTRAST";
export type FundImpact = { fundName: string; impactLevel: ImpactLevel; direction: "up" | "down" | "neutral" | "warning"; why: string; whatToSay: string };
export type IFAOutreachRow = { firmName: string; reason: string; mandateRelevant: string; lastContactDays: number; priority: "URGENT" | "HIGH" | "MODERATE" };
export type MarketEventWithImpact = { id: string; time: string; source: string; headline: string; context: string; fundImpacts: FundImpact[]; ifaOutreach: IFAOutreachRow[]; topPositive: string; topConcern: string };

export const marketEventsWithImpact: MarketEventWithImpact[] = [
  {
    id: "evt-1",
    time: "08:15",
    source: "BoE",
    headline: "Bank of England holds base rate at 4.5%",
    context: "The MPC voted 6-3 to maintain the base rate at 4.5%, with three members favouring a 25bp cut. Markets had priced in a 40% probability of a cut. Sterling strengthened 0.3% against the dollar on the announcement.",
    fundImpacts: [
      { fundName: "Strategic Bond", impactLevel: "POSITIVE_HIGH", direction: "up", why: "Duration 4.2yr benefits from rate stability. +180bps vs benchmark since rate pause began Q3 2025.", whatToSay: "Our duration positioning anticipated this pause. Strategic Bond has outperformed by 180bps since rates stabilised — this event validates the thesis." },
      { fundName: "Diversified Income", impactLevel: "POSITIVE_MODERATE", direction: "up", why: "Income yield 4.1% increasingly attractive vs cash at 4.5%. Rate stability supports distribution payments.", whatToSay: "Rate stability protects your clients' income distributions. Our 4.1% yield is increasingly competitive vs cash alternatives." },
      { fundName: "UK Balanced", impactLevel: "POSITIVE_LOW", direction: "up", why: "60% equity component benefits from lower discount rates in stable rate environment.", whatToSay: "Stable rates support equity valuations. Clients holding UK Balanced are in a good position heading into Q2." },
      { fundName: "Global Systematic", impactLevel: "NEUTRAL", direction: "neutral", why: "Systematic factor model explicitly avoids duration bets. Rate-neutral by design.", whatToSay: "Our systematic approach avoids duration risk by design. This is when factor diversification proves its value." },
      { fundName: "Absolute Return", impactLevel: "WATCH", direction: "down", why: "Cash+3% objective increasingly difficult with rates unchanged. YTD -0.4% exposed.", whatToSay: "Worth a call to discuss how we're navigating the rate environment. I want to be transparent about near-term challenges." },
    ],
    ifaOutreach: [],
    topPositive: "Strat. Bond ↑↑",
    topConcern: "Abs. Return ↓",
  },
  {
    id: "evt-2",
    time: "09:30",
    source: "ONS",
    headline: "UK CPI prints 2.8% — below consensus",
    context: "UK Consumer Price Index came in at 2.8% year-on-year for February, below the consensus estimate of 3.0%. Core CPI also surprised to the downside at 3.5% vs 3.7% expected. This strengthens the case for rate cuts later in 2026.",
    fundImpacts: [
      { fundName: "Strategic Bond", impactLevel: "POSITIVE_HIGH", direction: "up", why: "Disinflation narrative directly supports fixed income. Real yield improves as inflation falls.", whatToSay: "CPI below consensus strengthens the fixed income case. Strategic Bond duration is positioned perfectly for continued disinflation." },
      { fundName: "Diversified Income", impactLevel: "POSITIVE_MODERATE", direction: "up", why: "Real yield on 4.1% income improves as inflation falls toward target. Income client purchasing power recovering.", whatToSay: "Your clients' real income is improving. Strong moment to reinforce the income story with clients worried about inflation erosion." },
      { fundName: "UK Balanced", impactLevel: "POSITIVE_LOW", direction: "up", why: "Lower inflation boosts real returns. UK equity valuations supported by easing cost pressures.", whatToSay: "The inflation story is moving in the right direction for UK equity. UK Balanced clients benefit on both equity and bond sides." },
      { fundName: "Global Systematic", impactLevel: "NEUTRAL", direction: "neutral", why: "Factor model macro-neutral. CPI variance does not create tracking error in systematic strategy.", whatToSay: "Our macro-neutral positioning means clients aren't exposed to inflation surprise risk. Consistent factor exposure regardless of macro." },
      { fundName: "Absolute Return", impactLevel: "WATCH", direction: "down", why: "If rates follow inflation down, cash+3% target becomes harder. Objective under increasing pressure.", whatToSay: "Good moment to review absolute return expectations with clients. Happy to walk through positioning on a call." },
    ],
    ifaOutreach: [],
    topPositive: "Strat. Bond ↑↑",
    topConcern: "Abs. Return ↓",
  },
  {
    id: "evt-3",
    time: "10:05",
    source: "Reuters",
    headline: "LGPS consolidation pool expansion announced",
    context: "The government confirmed plans to accelerate Local Government Pension Scheme consolidation, with 8 regional pools expected to manage over £500bn by 2030. This creates opportunities for managers with institutional-grade systematic strategies.",
    fundImpacts: [
      { fundName: "Global Systematic", impactLevel: "POSITIVE_HIGH", direction: "up", why: "LGPS pools actively reviewing external systematic equity exposure. Evidence-based governance aligns directly with systematic investment approach.", whatToSay: "LGPS pools are rebuilding manager panels now. Our 20-year systematic track record fits pool investment committee requirements precisely." },
      { fundName: "UK Balanced", impactLevel: "POSITIVE_MODERATE", direction: "up", why: "Multi-asset mandates in demand within pooling frameworks for liability-matching.", whatToSay: "LGPS consolidation creates balanced mandate opportunities. We can support with a pool-specific pitch for your territory." },
      { fundName: "Strategic Bond", impactLevel: "POSITIVE_MODERATE", direction: "up", why: "Fixed income mandates for liability matching within pool portfolios in high demand.", whatToSay: "Pools need fixed income for liability matching. Strategic Bond's duration profile fits pool liability frameworks well." },
      { fundName: "Diversified Income", impactLevel: "POSITIVE_LOW", direction: "up", why: "Income mandates applicable to pools with current pension payment obligations.", whatToSay: "Income generation is relevant to pools with current pensioners. A smaller but real opportunity worth flagging." },
      { fundName: "Absolute Return", impactLevel: "NEUTRAL", direction: "neutral", why: "Absolute return strategies receive mixed reception in LGPS governance frameworks.", whatToSay: "LGPS pools tend to prefer clear-factor strategies. Absolute return may not be the lead conversation here." },
    ],
    ifaOutreach: [],
    topPositive: "Global Sys. ↑↑",
    topConcern: "Abs. Return →",
  },
  {
    id: "evt-4",
    time: "10:45",
    source: "FT",
    headline: "Global equity markets rally on Fed dovish signals",
    context: "US markets rose 1.8% overnight after Federal Reserve Chair signalled openness to rate cuts in H2 2026. European markets followed with gains of 0.9-1.2%. The move favours growth and quality factor tilts.",
    fundImpacts: [
      { fundName: "UK Balanced", impactLevel: "POSITIVE_HIGH", direction: "up", why: "60% equity exposure captures significant upside. YTD +5.7% vs benchmark +4.2% — outperforming in a rising market.", whatToSay: "UK Balanced is outperforming the benchmark in the rally. Strong moment to reinforce confidence with clients." },
      { fundName: "Global Systematic", impactLevel: "POSITIVE_MODERATE", direction: "up", why: "Factor model captured quality and momentum in rally. YTD +3.1% vs benchmark +4.8% — lag reflects defensive factor tilt, not failure.", whatToSay: "Our systematic factors captured the rally. The benchmark lag reflects factor diversification — we don't concentrate in growth. Worth framing proactively." },
      { fundName: "Diversified Income", impactLevel: "NEUTRAL", direction: "neutral", why: "Income focus means lower equity beta — less upside in rally but stable income maintained throughout.", whatToSay: "Income strategy isn't designed to chase equity rallies — and that's the point. Clients chose income over growth and it's delivering." },
      { fundName: "Strategic Bond", impactLevel: "WATCH", direction: "down", why: "Rate expectations embedded in equity rally may signal less rate cutting — modest pressure on fixed income duration.", whatToSay: "The rally signals some reflation expectations which could pressure fixed income. Watching closely — nothing alarming yet." },
      { fundName: "Absolute Return", impactLevel: "RISK", direction: "down", why: "Strategy designed to be market-neutral — lagging equity beta in strong rally. YTD -0.4% more visible against strong equity backdrop.", whatToSay: "Absolute return strategies don't participate fully in equity rallies — that's the trade-off for downside protection. Worth reinforcing with clients." },
    ],
    ifaOutreach: [],
    topPositive: "UK Balanced ↑↑",
    topConcern: "Abs. Return ↓",
  },
  {
    id: "evt-5",
    time: "11:20",
    source: "Citywire",
    headline: "Multi-asset sector sees £2.1bn outflows in March",
    context: "The IA Mixed Investment 40-85% sector recorded £2.1bn net outflows in March, the third consecutive month of negative flows. Advisers are increasingly moving to risk-graded model portfolios and systematic strategies.",
    fundImpacts: [
      { fundName: "UK Balanced", impactLevel: "RISK_HIGH", direction: "warning", why: "Directly in IA Mixed Investment sector experiencing £2.1bn outflows. Client redemption risk elevated. YTD +5.7% is the defence — use it now.", whatToSay: "Sector under redemption pressure. Contact IFAs holding UK Balanced before they hear the outflow data from competitors. Our performance is the story." },
      { fundName: "Absolute Return", impactLevel: "RISK_HIGH", direction: "warning", why: "Absolute return outflows accelerating as clients seek pure equity or pure cash. Middle-ground strategies under structural pressure.", whatToSay: "This is the most urgent retention conversation. Prioritise IFAs with Absolute Return exposure this week — proactive beats reactive." },
      { fundName: "Diversified Income", impactLevel: "RISK_MODERATE", direction: "warning", why: "Income funds adjacent to mixed investment sector seeing sympathy selling. Outflow risk moderate.", whatToSay: "Proactive touch with Diversified Income relationships this week. Our performance is not negative — that distinction needs making explicitly." },
      { fundName: "Global Systematic", impactLevel: "RISK_MODERATE", direction: "warning", why: "IA Global also seeing outflows. Systematic strategies not immune to sector-level sentiment. YTD +3.1% is the counter-narrative.", whatToSay: "Systematic equity is in the same outflow environment. Performance is our defence — +3.1% YTD needs to be front and centre." },
      { fundName: "Strategic Bond", impactLevel: "POSITIVE_CONTRAST", direction: "up", why: "Fixed income bucking the mixed investment outflow trend. Inflows into strategic bond as investors de-risk from mixed assets.", whatToSay: "Strategic Bond is one of few areas seeing inflows. Clients rotating out of mixed assets may be receptive — strong positioning story." },
    ],
    ifaOutreach: [],
    topPositive: "Strat. Bond ↑",
    topConcern: "UK Balanced ⚠",
  },
];

// IFA Outreach Intelligence — BoE Rate Hold (Section I3)
export const boeIfaOutreach: IFAOutreachRow[] = [
  { firmName: "Paradigm Capital", reason: "Income-focused client base. Strategic Bond narrative aligns with their investment philosophy.", mandateRelevant: "Strategic Bond", lastContactDays: 3, priority: "HIGH" },
  { firmName: "Foster Denovo", reason: "Last discussed fixed income 8 weeks ago. Rate hold creates natural re-engagement hook.", mandateRelevant: "Strategic Bond, Diversified Income", lastContactDays: 56, priority: "URGENT" },
  { firmName: "Attivo Group", reason: "Added systematic equity to approved list Q4. Rate-neutral positioning differentiates Global Systematic.", mandateRelevant: "Global Systematic", lastContactDays: 8, priority: "HIGH" },
  { firmName: "Progeny Wealth", reason: "New Head of Investments from Jupiter. Rate hold validates income mandate timing — strong hook.", mandateRelevant: "Diversified Income", lastContactDays: 18, priority: "MODERATE" },
  { firmName: "Perspective Financial", reason: "RMAR shows income-focused client growth. Rate stability directly supports their proposition.", mandateRelevant: "Diversified Income", lastContactDays: 34, priority: "MODERATE" },
];

// ---------------------------------------------------------------------------
// OVERVIEW PAGE TYPES & DATA — Section H
// ---------------------------------------------------------------------------

export type OverviewStat = { label: string; value: number; valueFormat: string; delta: string; deltaDirection: "up" | "down" | "neutral"; icon: string };
export type SignalDot = { module: string; text: string };
export type SignalDay = { day: string; signals: SignalDot[] };
export type HeatmapCell = { competitorCount: number; keyridgePresent: boolean };
export type HeatmapRow = { mandate: string; abbreviation: string; cells: Record<string, HeatmapCell> };
export type ModuleCard = { icon: string; name: string; colour: string; stat: string; signal: string; timestamp: string; route: string };
export type RecentSignal = { module: string; colour: string; text: string; timestamp: string };
export type IFAScatterFirm = { id: string; name: string; fitScore: number; signalRecencyDays: number; estimatedAUM_m: number; isUniverse: boolean; signal?: string };

// H2: Headline Stats Strip
export const overviewStats: OverviewStat[] = [
  { label: "IFA SIGNALS", value: 23, valueFormat: "integer", delta: "+8 vs last week", deltaDirection: "up", icon: "Target" },
  { label: "MARKET EVENTS", value: 8, valueFormat: "integer", delta: "Linked to 3 mandates each avg", deltaDirection: "neutral", icon: "Zap" },
  { label: "COMPETITIVE ALERTS", value: 12, valueFormat: "integer", delta: "2 new today", deltaDirection: "neutral", icon: "BarChart2" },
  { label: "UK IFA UNIVERSE", value: 10847, valueFormat: "comma", delta: "847 match your mandates", deltaDirection: "neutral", icon: "Users" },
];

// H4 Left: Signal Stream 7-Day Timeline
export const signalStream: SignalDay[] = [
  {
    day: "Mon",
    signals: [
      { module: "IFA Prioritisation", text: "Paradigm Capital: investment director joined" },
      { module: "IFA Prioritisation", text: "Attivo Group: approved list updated" },
      { module: "IFA Prioritisation", text: "Foster Denovo: RMAR filing shows growth" },
      { module: "Market Intelligence", text: "BoE rate decision preview" },
      { module: "Market Intelligence", text: "UK gilt yields shift" },
      { module: "Competitive Positioning", text: "Schroders QEP: fee reduction rumour" },
      { module: "Competitive Positioning", text: "Jupiter Merlin: outflow data published" },
      { module: "Platform Flow", text: "Transact: new fund listings announced" },
    ],
  },
  {
    day: "Tue",
    signals: [
      { module: "IFA Prioritisation", text: "Progeny Wealth: Head of Investments appointment" },
      { module: "IFA Prioritisation", text: "Informed Financial Planning: philosophy update" },
      { module: "Market Intelligence", text: "US CPI preview analysis" },
      { module: "Market Intelligence", text: "LGPS consultation response published" },
      { module: "Market Intelligence", text: "ECB rate guidance shift" },
      { module: "Partnership Intelligence", text: "Quilter MPS panel gap identified" },
    ],
  },
  {
    day: "Wed",
    signals: [
      { module: "IFA Prioritisation", text: "Arbor Asset Management: revenue up 41%" },
      { module: "IFA Prioritisation", text: "Chase de Vere: Head of Research from Morningstar" },
      { module: "IFA Prioritisation", text: "Kingswood Group: CIO hire from BlackRock" },
      { module: "IFA Prioritisation", text: "Succession Wealth: acquisition panel review" },
      { module: "Market Intelligence", text: "UK CPI prints 2.8% below consensus" },
      { module: "Market Intelligence", text: "BoE holds base rate at 4.5%" },
      { module: "Competitive Positioning", text: "Artemis Global Income: launched on AJ Bell" },
      { module: "Platform Flow", text: "HL AUM up 3.2% QoQ" },
      { module: "Platform Flow", text: "Nucleus fund listing changes" },
    ],
  },
  {
    day: "Thu",
    signals: [
      { module: "IFA Prioritisation", text: "Tilney S&W: DFM expansion" },
      { module: "IFA Prioritisation", text: "Mattioli Woods: systematic strategy plans" },
      { module: "IFA Prioritisation", text: "Evelyn Partners: new investment proposition" },
      { module: "IFA Prioritisation", text: "Brewin Dolphin: factor-based interest" },
      { module: "IFA Prioritisation", text: "Wren Sterling: IC restructured" },
      { module: "Market Intelligence", text: "LGPS consolidation pool expansion" },
      { module: "Market Intelligence", text: "Global equity rally on Fed dovish signals" },
      { module: "Market Intelligence", text: "Multi-asset sector £2.1bn outflows" },
      { module: "Competitive Positioning", text: "Schroders QEP: new distribution hire" },
      { module: "Competitive Positioning", text: "Royal London: platform expansion" },
      { module: "AI Research", text: "Research query: South East targeting for GS" },
    ],
  },
  {
    day: "Fri",
    signals: [
      { module: "IFA Prioritisation", text: "Canaccord: MPS range systematic gap" },
      { module: "IFA Prioritisation", text: "Raymond James: UK distribution head" },
      { module: "IFA Prioritisation", text: "Sanlam: parent systematic allocation push" },
      { module: "Market Intelligence", text: "Week-end macro summary" },
      { module: "Market Intelligence", text: "Sector flow data published" },
      { module: "Partnership Intelligence", text: "Benchmark Capital DPS growth signal" },
      { module: "Platform Flow", text: "AJ Bell quarterly data" },
    ],
  },
  {
    day: "Sat",
    signals: [
      { module: "IFA Prioritisation", text: "Openwork: fund review cycle starting Q2" },
      { module: "Market Intelligence", text: "Weekend FT editorial: multi-asset future" },
      { module: "Market Intelligence", text: "Asia market overnight: factor rotation" },
    ],
  },
  {
    day: "Sun",
    signals: [
      { module: "IFA Prioritisation", text: "Quilter: MPS factsheet gap confirmed" },
      { module: "IFA Prioritisation", text: "Fidelity: fund selection committee Q2" },
      { module: "Market Intelligence", text: "Pre-market briefing: week ahead" },
    ],
  },
];

// H4 Right: Competitive Pressure Heatmap — 5 mandates × 8 platforms
// Data derived from platformPresence + explicit HL column from MASTER.md H4
export const competitorHeatmap: HeatmapRow[] = [
  {
    mandate: "Global Systematic",
    abbreviation: "GS",
    cells: {
      "HL": { competitorCount: 4, keyridgePresent: false },
      "Quilter": { competitorCount: 3, keyridgePresent: true },
      "Transact": { competitorCount: 2, keyridgePresent: true },
      "Nucleus": { competitorCount: 3, keyridgePresent: true },
      "AJ Bell": { competitorCount: 4, keyridgePresent: false },
      "St Life": { competitorCount: 2, keyridgePresent: true },
      "Aviva": { competitorCount: 3, keyridgePresent: false },
      "Zurich": { competitorCount: 2, keyridgePresent: true },
    },
  },
  {
    mandate: "UK Balanced",
    abbreviation: "UKB",
    cells: {
      "HL": { competitorCount: 3, keyridgePresent: false },
      "Quilter": { competitorCount: 2, keyridgePresent: true },
      "Transact": { competitorCount: 1, keyridgePresent: true },
      "Nucleus": { competitorCount: 2, keyridgePresent: false },
      "AJ Bell": { competitorCount: 3, keyridgePresent: false },
      "St Life": { competitorCount: 1, keyridgePresent: true },
      "Aviva": { competitorCount: 2, keyridgePresent: true },
      "Zurich": { competitorCount: 1, keyridgePresent: true },
    },
  },
  {
    mandate: "Diversified Income",
    abbreviation: "DI",
    cells: {
      "HL": { competitorCount: 3, keyridgePresent: true },
      "Quilter": { competitorCount: 2, keyridgePresent: true },
      "Transact": { competitorCount: 2, keyridgePresent: true },
      "Nucleus": { competitorCount: 1, keyridgePresent: true },
      "AJ Bell": { competitorCount: 3, keyridgePresent: true },
      "St Life": { competitorCount: 2, keyridgePresent: false },
      "Aviva": { competitorCount: 2, keyridgePresent: true },
      "Zurich": { competitorCount: 1, keyridgePresent: true },
    },
  },
  {
    mandate: "Absolute Return",
    abbreviation: "AR",
    cells: {
      "HL": { competitorCount: 5, keyridgePresent: false },
      "Quilter": { competitorCount: 3, keyridgePresent: false },
      "Transact": { competitorCount: 2, keyridgePresent: true },
      "Nucleus": { competitorCount: 3, keyridgePresent: false },
      "AJ Bell": { competitorCount: 4, keyridgePresent: false },
      "St Life": { competitorCount: 2, keyridgePresent: false },
      "Aviva": { competitorCount: 3, keyridgePresent: false },
      "Zurich": { competitorCount: 2, keyridgePresent: false },
    },
  },
  {
    mandate: "Strategic Bond",
    abbreviation: "SB",
    cells: {
      "HL": { competitorCount: 4, keyridgePresent: true },
      "Quilter": { competitorCount: 3, keyridgePresent: true },
      "Transact": { competitorCount: 2, keyridgePresent: true },
      "Nucleus": { competitorCount: 1, keyridgePresent: true },
      "AJ Bell": { competitorCount: 3, keyridgePresent: true },
      "St Life": { competitorCount: 2, keyridgePresent: true },
      "Aviva": { competitorCount: 2, keyridgePresent: true },
      "Zurich": { competitorCount: 1, keyridgePresent: true },
    },
  },
];

// H5: Module Activity Cards
export const moduleCards: ModuleCard[] = [
  { icon: "Target", name: "IFA Prioritisation", colour: "#3B82F6", stat: "847 IFAs match Global Systematic", signal: "Paradigm Capital: new investment director 3d ago", timestamp: "3h ago", route: "/intelligence/ifa-prioritisation" },
  { icon: "BarChart2", name: "Competitive Positioning", colour: "#F59E0B", stat: "5 competitor funds in IA Global sector", signal: "Schroders QEP: new distribution hire on LinkedIn", timestamp: "1d ago", route: "/intelligence/competitive-positioning" },
  { icon: "Link", name: "Partnership Intelligence", colour: "#8B5CF6", stat: "12 firms match True Potential pre-partnership profile", signal: "Quilter: launching MPS Q1 2026 — panel gap identified", timestamp: "2d ago", route: "/intelligence/partnership-intelligence" },
  { icon: "Zap", name: "Market Intelligence", colour: "#16A34A", stat: "8 market events mapped to mandates today", signal: "BoE rate hold: Strategic Bond thesis validated", timestamp: "5h ago", route: "/intelligence/market-intelligence" },
  { icon: "GitBranch", name: "Platform Flow", colour: "#EA580C", stat: "2 priority platform gaps identified", signal: "HL: 4 competitors in Global Systematic, no Keyridge", timestamp: "6h ago", route: "/intelligence/platform-flow" },
  { icon: "Search", name: "AI Research", colour: "#0EA5E9", stat: "Ask any distribution question", signal: "Most asked: 'Who to target for Global Systematic in South East?'", timestamp: "1d ago", route: "/intelligence/ai-research" },
];

// H6: Recent Signals Feed
export const recentSignals: RecentSignal[] = [
  { module: "IFA", colour: "#3B82F6", text: "Paradigm Capital: investment director joined from Schroders", timestamp: "3h ago" },
  { module: "Market", colour: "#16A34A", text: "BoE held rates — Strategic Bond thesis validated, 3 IFAs to call", timestamp: "5h ago" },
  { module: "Platform", colour: "#EA580C", text: "Hargreaves Lansdown AUM up 3.2% QoQ — Keyridge absent from Global Systematic panel", timestamp: "6h ago" },
  { module: "Competitive", colour: "#F59E0B", text: "Schroders QEP: new distribution hire suggests IA Global push", timestamp: "1d ago" },
  { module: "IFA", colour: "#3B82F6", text: "Foster Denovo: RMAR shows 28% client growth — scaling fast", timestamp: "1d ago" },
  { module: "Partnership", colour: "#8B5CF6", text: "Quilter launching MPS Q1 — systematic equity gap in current panel", timestamp: "2d ago" },
  { module: "Market", colour: "#16A34A", text: "LGPS consolidation announced — 4 mandates directly relevant", timestamp: "2d ago" },
  { module: "IFA", colour: "#3B82F6", text: "Progeny Wealth: new Head of Investments from Jupiter (Companies House)", timestamp: "3d ago" },
  { module: "Competitive", colour: "#F59E0B", text: "Artemis Global: launched on AJ Bell — Keyridge absent from same platform", timestamp: "4d ago" },
  { module: "Platform", colour: "#EA580C", text: "Transact AUM up 4.7% QoQ — growing faster than market, worth prioritising", timestamp: "5d ago" },
];

// H3: IFA Opportunity Scatter — named firms + universe
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateUniverseFirms(): IFAScatterFirm[] {
  const rng = seededRandom(42);
  const firms: IFAScatterFirm[] = [];
  const regions = ["London", "South East", "Midlands", "North West", "Yorkshire", "Scotland", "South West", "East Anglia", "Wales", "North East"];
  for (let i = 0; i < 175; i++) {
    const fitScore = Math.round(5 + rng() * 60);
    const signalRecencyDays = Math.round(14 + rng() * 76);
    const estimatedAUM_m = Math.round(50 + rng() * 1950);
    const region = regions[Math.floor(rng() * regions.length)];
    firms.push({
      id: `universe-${i + 1}`,
      name: `${region} Advisory ${i + 1}`,
      fitScore,
      signalRecencyDays,
      estimatedAUM_m,
      isUniverse: true,
    });
  }
  return firms;
}

const namedScatterFirms: IFAScatterFirm[] = ifaRankings.map((ifa) => ({
  id: ifa.id,
  name: ifa.name,
  fitScore: ifa.fitScore,
  signalRecencyDays: ifa.id === "ifa-1" ? 3 : ifa.id === "ifa-2" ? 8 : ifa.id === "ifa-3" ? 12 : ifa.id === "ifa-4" ? 18 : Math.round(7 + Math.abs(ifa.fitScore - 91) * 0.8),
  estimatedAUM_m: parseFloat(ifa.estAUM.replace(/[£bn,m]/g, "")) * (ifa.estAUM.includes("bn") ? 1000 : 1),
  isUniverse: false,
  signal: ifa.signal,
}));

export const ifaScatterData: IFAScatterFirm[] = [...namedScatterFirms, ...generateUniverseFirms()];
