// Regulex Intelligence — Mock Data
// UK multi-asset distribution intelligence dashboard for Meridian Asset Management

export type ClientType = 'Pension Fund' | 'Endowment' | 'Insurance' | 'Family Office' | 'Wealth Manager' | 'Platform';
export type EngagementTrend = 'improving' | 'declining' | 'stable';
export type RFPStatus = 'In Progress' | 'Not Started' | 'Near Complete' | 'Just Opened';

export interface Fund {
  id: string;
  name: string;
  aum: number;
  ytdReturn: number;
  benchmarkReturn: number;
  flowsMTD: number;
  flowsQTD: number;
  flowsYTD: number;
  clientCount: number;
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  aum: number;
  lastContactDate: string;
  assignedRM: string;
  riskScore: number;
  engagementTrend: EngagementTrend;
  fundsHeld: string[];
  mandateRenewalDate: string | null;
  notes: string;
  walletSharePercent: number;
  totalEstimatedAUM: number;
  relationshipSince: string;
  investmentObjective: string;
  keyConstraints: string[];
}

export interface DataSource {
  name: string;
  lastSync: string;
  status: 'connected';
}

export interface MarketIntelItem {
  id: string;
  time: string;
  source: string;
  sourceColor: string;
  headline: string;
  relevantTo: string[];
}

export interface RFPItem {
  id: string;
  clientName: string;
  mandateType: string;
  estimatedAUM: string;
  dueDate: string;
  daysUntilDue: number;
  dataCompletion: number;
  status: RFPStatus;
  statusNote: string;
  assignedTo: string;
  stage: 'New' | 'Data Gathering' | 'Internal Review' | 'Submitted';
  autoFields: string[];
  manualFields: string[];
}

export interface FlowMonth {
  month: string;
  netFlow: number;
  pension: number;
  endowment: number;
  insurance: number;
  wealth: number;
  platform: number;
}

export interface TimelineEntry {
  date: string;
  type: 'Meeting' | 'Call' | 'Email' | 'Report Sent' | 'RFP Response';
  description: string;
  meridianContact: string;
  outcome: string;
}

export interface IntelEntry {
  source: string;
  date: string;
  headline: string;
  relevance: string;
}

export interface Firm {
  name: string;
  totalAUM: number;
  netFlowsQTD: number;
  netFlowsMTD: number;
  grossInflowsQTD: number;
  grossOutflowsQTD: number;
  activeClients: number;
  mandateRenewals90Days: number;
  revenueAtRisk: number;
  avgFeeBps: number;
}

// ---------------------------------------------------------------------------
// Firm
// ---------------------------------------------------------------------------
// Revenue at risk: sum AUM of clients with riskScore > 65
// At-risk clients: Lancashire (892, risk 78), Aviva (1200, risk 85),
//   Phoenix (760, risk 91), West Midlands (510, risk 67)
// (892 + 1200 + 760 + 510) × 0.0042 = £14.12m
export const firm: Firm = {
  name: 'Meridian Asset Management',
  totalAUM: 14830,
  netFlowsQTD: -127,
  netFlowsMTD: -43,
  grossInflowsQTD: 312,
  grossOutflowsQTD: 439,
  activeClients: 89,
  mandateRenewals90Days: 6,
  revenueAtRisk: 14.12,
  avgFeeBps: 42,
};

// ---------------------------------------------------------------------------
// Funds
// ---------------------------------------------------------------------------
export const funds: Fund[] = [
  {
    id: 'fund-1',
    name: 'Meridian Global Multi-Asset Fund',
    aum: 4200,
    ytdReturn: 3.1,
    benchmarkReturn: 4.8,
    flowsMTD: -18,
    flowsQTD: -52,
    flowsYTD: -89,
    clientCount: 8,
  },
  {
    id: 'fund-2',
    name: 'Meridian UK Balanced Fund',
    aum: 2800,
    ytdReturn: 5.7,
    benchmarkReturn: 4.2,
    flowsMTD: 12,
    flowsQTD: 34,
    flowsYTD: 67,
    clientCount: 6,
  },
  {
    id: 'fund-3',
    name: 'Meridian Diversified Income Fund',
    aum: 3100,
    ytdReturn: 2.9,
    benchmarkReturn: 3.0,
    flowsMTD: -8,
    flowsQTD: -21,
    flowsYTD: -15,
    clientCount: 7,
  },
  {
    id: 'fund-4',
    name: 'Meridian Absolute Return Fund',
    aum: 1900,
    ytdReturn: -0.4,
    benchmarkReturn: 0,
    flowsMTD: -15,
    flowsQTD: -48,
    flowsYTD: -72,
    clientCount: 5,
  },
  {
    id: 'fund-5',
    name: 'Meridian Strategic Bond Fund',
    aum: 2800,
    ytdReturn: 4.1,
    benchmarkReturn: 3.3,
    flowsMTD: -14,
    flowsQTD: -40,
    flowsYTD: 9,
    clientCount: 4,
  },
];

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------
export const clients: Client[] = [
  {
    id: 'client-1',
    name: 'Lancashire County Pension Fund',
    type: 'Pension Fund',
    aum: 892,
    lastContactDate: '2026-02-24',
    assignedRM: 'Sarah Chen',
    riskScore: 78,
    engagementTrend: 'declining',
    fundsHeld: ['Meridian Global Multi-Asset Fund', 'Meridian UK Balanced Fund'],
    mandateRenewalDate: '2026-05-21',
    walletSharePercent: 21,
    totalEstimatedAUM: 4200,
    relationshipSince: '2019-03-15',
    investmentObjective: 'Multi-asset growth with liability awareness',
    keyConstraints: ['Quarterly liquidity minimum', 'UK bias ≥30%'],
    notes:
      'Key contact David Morris promoted to CIO last month — new priorities unclear. Previously committed to reviewing alternatives allocation in Q2.',
  },
  {
    id: 'client-2',
    name: 'Cambridge University Endowment',
    type: 'Endowment',
    aum: 445,
    lastContactDate: '2026-03-22',
    assignedRM: 'James Whitfield',
    riskScore: 22,
    engagementTrend: 'stable',
    fundsHeld: ['Meridian Diversified Income Fund', 'Meridian Absolute Return Fund'],
    mandateRenewalDate: '2026-11-30',
    walletSharePercent: 12,
    totalEstimatedAUM: 3700,
    relationshipSince: '2017-09-01',
    investmentObjective: 'Real return of CPI + 4% over rolling 5 years',
    keyConstraints: ['ESG screens required', 'No fossil fuel direct holdings'],
    notes:
      'Satisfied relationship. Recent board decision to increase real assets exposure — potential new mandate opportunity.',
  },
  {
    id: 'client-3',
    name: 'Aviva Staff Pension Scheme',
    type: 'Pension Fund',
    aum: 1200,
    lastContactDate: '2026-01-28',
    assignedRM: 'Sarah Chen',
    riskScore: 85,
    engagementTrend: 'declining',
    fundsHeld: ['Meridian Global Multi-Asset Fund'],
    mandateRenewalDate: '2026-05-07',
    walletSharePercent: 15,
    totalEstimatedAUM: 8000,
    relationshipSince: '2020-06-10',
    investmentObjective: 'Liability-driven growth, de-risking pathway',
    keyConstraints: ['Liquidity ≥ weekly', 'Gilts allocation ≥ 20%'],
    notes:
      'No contact in 61 days. AUM is flat despite strong contributions — potential silent redemption underway. Competitor known to be pitching a liability-driven alternative.',
  },
  {
    id: 'client-4',
    name: "St. James's Place Partnership",
    type: 'Wealth Manager',
    aum: 680,
    lastContactDate: '2026-03-27',
    assignedRM: 'Tom Okafor',
    riskScore: 31,
    engagementTrend: 'stable',
    fundsHeld: ['Meridian UK Balanced Fund', 'Meridian Diversified Income Fund'],
    mandateRenewalDate: '2026-09-30',
    walletSharePercent: 8,
    totalEstimatedAUM: 8500,
    relationshipSince: '2021-01-15',
    investmentObjective: 'Balanced growth for advised retail clients',
    keyConstraints: ['Daily dealing required', 'Morningstar ≥ 3 star'],
    notes:
      'Flows have been consistent. New regional director for South East appointed — relationship to be established.',
  },
  {
    id: 'client-5',
    name: 'Wellcome Trust',
    type: 'Endowment',
    aum: 334,
    lastContactDate: '2026-03-11',
    assignedRM: 'James Whitfield',
    riskScore: 45,
    engagementTrend: 'stable',
    fundsHeld: ['Meridian Absolute Return Fund', 'Meridian Strategic Bond Fund'],
    mandateRenewalDate: '2026-07-30',
    walletSharePercent: 4,
    totalEstimatedAUM: 8350,
    relationshipSince: '2022-04-20',
    investmentObjective: 'Absolute return, capital preservation with income',
    keyConstraints: ['ESG integration required', 'Maximum drawdown ≤ 8%'],
    notes:
      'ESG integration becoming a priority. Current Absolute Return underperformance (-0.4% YTD) is a latent risk — not yet raised by client.',
  },
  {
    id: 'client-6',
    name: 'Phoenix Group Insurance',
    type: 'Insurance',
    aum: 760,
    lastContactDate: '2026-01-17',
    assignedRM: 'Sarah Chen',
    riskScore: 91,
    engagementTrend: 'declining',
    fundsHeld: ['Meridian Strategic Bond Fund', 'Meridian Diversified Income Fund'],
    mandateRenewalDate: '2026-05-13',
    walletSharePercent: 11,
    totalEstimatedAUM: 6900,
    relationshipSince: '2018-11-01',
    investmentObjective: 'Matching-adjusted spread optimisation',
    keyConstraints: ['Solvency II compliant', 'Duration match ± 0.5yr'],
    notes:
      '72 days without contact. New CIO joined from Legal & General 6 weeks ago — strategic review of external managers expected. This is the highest risk account in the book.',
  },
  {
    id: 'client-7',
    name: 'Rathbones Group',
    type: 'Wealth Manager',
    aum: 290,
    lastContactDate: '2026-03-19',
    assignedRM: 'Tom Okafor',
    riskScore: 28,
    engagementTrend: 'improving',
    fundsHeld: ['Meridian UK Balanced Fund'],
    mandateRenewalDate: null,
    walletSharePercent: 6,
    totalEstimatedAUM: 4800,
    relationshipSince: '2023-02-01',
    investmentObjective: 'UK equity income with growth tilt',
    keyConstraints: ['Monthly reporting required'],
    notes:
      'Flows have increased 18% QoQ. Potential to introduce Strategic Bond as a complement.',
  },
  {
    id: 'client-8',
    name: 'West Midlands Pension Fund',
    type: 'Pension Fund',
    aum: 510,
    lastContactDate: '2026-02-11',
    assignedRM: 'Sarah Chen',
    riskScore: 67,
    engagementTrend: 'declining',
    fundsHeld: ['Meridian Global Multi-Asset Fund'],
    mandateRenewalDate: '2026-06-09',
    walletSharePercent: 9,
    totalEstimatedAUM: 5700,
    relationshipSince: '2020-09-15',
    investmentObjective: 'Multi-asset growth, LGPS pooling compliant',
    keyConstraints: ['LGPS investment regulations', 'Responsible investment policy'],
    notes:
      'Global Multi-Asset underperformance (-1.7% vs benchmark) is likely on their radar. No proactive outreach since Q4 results.',
  },
  {
    id: 'client-9',
    name: 'Caledonian Family Office',
    type: 'Family Office',
    aum: 178,
    lastContactDate: '2026-03-25',
    assignedRM: 'James Whitfield',
    riskScore: 19,
    engagementTrend: 'improving',
    fundsHeld: ['Meridian Diversified Income Fund', 'Meridian UK Balanced Fund'],
    mandateRenewalDate: null,
    walletSharePercent: 35,
    totalEstimatedAUM: 510,
    relationshipSince: '2021-07-10',
    investmentObjective: 'Capital preservation with moderate income',
    keyConstraints: ['Quarterly reporting', 'No leverage'],
    notes:
      'High satisfaction. Introduced two peer family offices to Meridian in Q1 — strong advocate.',
  },
  {
    id: 'client-10',
    name: 'Hargreaves Lansdown',
    type: 'Platform',
    aum: 420,
    lastContactDate: '2026-03-16',
    assignedRM: 'Tom Okafor',
    riskScore: 38,
    engagementTrend: 'stable',
    fundsHeld: ['Meridian UK Balanced Fund', 'Meridian Diversified Income Fund'],
    mandateRenewalDate: null,
    walletSharePercent: 1,
    totalEstimatedAUM: 42000,
    relationshipSince: '2022-11-01',
    investmentObjective: 'Retail distribution — platform listing agreement',
    keyConstraints: ['Daily dealing', 'KID/KIID compliant', 'Trustnet rating maintained'],
    notes:
      'Retail flows into UK Balanced have grown following its recent Trustnet rating upgrade.',
  },
  {
    id: 'client-11',
    name: 'Church of England Pensions Board',
    type: 'Pension Fund',
    aum: 267,
    lastContactDate: '2026-03-01',
    assignedRM: 'James Whitfield',
    riskScore: 54,
    engagementTrend: 'stable',
    fundsHeld: ['Meridian Absolute Return Fund', 'Meridian Strategic Bond Fund'],
    mandateRenewalDate: '2026-08-30',
    walletSharePercent: 7,
    totalEstimatedAUM: 3800,
    relationshipSince: '2019-06-15',
    investmentObjective: 'Ethical absolute return with income',
    keyConstraints: [
      'Ethical investment policy',
      'No arms, tobacco, gambling',
      'Climate Action 100+ alignment',
    ],
    notes:
      'Strong ESG mandate alignment required. Absolute Return underperformance flagged internally at last trustee meeting.',
  },
  {
    id: 'client-12',
    name: 'Scottish Widows Investment Partnership',
    type: 'Insurance',
    aum: 380,
    lastContactDate: '2026-02-17',
    assignedRM: 'Tom Okafor',
    riskScore: 62,
    engagementTrend: 'declining',
    fundsHeld: ['Meridian Global Multi-Asset Fund'],
    mandateRenewalDate: '2026-06-30',
    walletSharePercent: 5,
    totalEstimatedAUM: 7600,
    relationshipSince: '2024-09-01',
    investmentObjective: 'Insurance portfolio diversification',
    keyConstraints: ['Solvency II compatible', 'Quarterly rebalancing'],
    notes:
      'Allocated 18 months ago following competitive pitch. First formal review due Q3. Performance tracking needed.',
  },
];

// ---------------------------------------------------------------------------
// Data Sources
// ---------------------------------------------------------------------------
export const dataSources: DataSource[] = [
  { name: 'Salesforce CRM', lastSync: '8 mins ago', status: 'connected' },
  { name: 'Aladdin PMS', lastSync: '2 hours ago', status: 'connected' },
  { name: 'Bloomberg', lastSync: '1 hour ago', status: 'connected' },
  { name: 'LSEG Workspace', lastSync: '3 mins ago', status: 'connected' },
  { name: 'Morningstar', lastSync: '5 mins ago', status: 'connected' },
  { name: 'Email (Outlook)', lastSync: '30 seconds ago', status: 'connected' },
];

// ---------------------------------------------------------------------------
// Market Intelligence
// ---------------------------------------------------------------------------
export const marketIntel: MarketIntelItem[] = [
  {
    id: 'mi-1',
    time: '08:15',
    source: 'BLOOMBERG',
    sourceColor: '#f59e0b',
    headline: 'Bank of England holds base rate at 4.5% — gilt yields fall 8bps',
    relevantTo: ['Aviva Staff Pension Scheme', 'Strategic Bond Fund'],
  },
  {
    id: 'mi-2',
    time: '09:30',
    source: 'LSEG',
    sourceColor: '#3b82f6',
    headline: 'UK CPI prints at 2.8% — below consensus, positive for fixed income',
    relevantTo: ['Strategic Bond Fund', 'Phoenix Group Insurance'],
  },
  {
    id: 'mi-3',
    time: '10:05',
    source: 'MORNINGSTAR',
    sourceColor: '#22c55e',
    headline: 'Multi-asset fund category sees £2.1bn net outflows in March',
    relevantTo: ['Global Multi-Asset Fund', 'Lancashire County Pension Fund'],
  },
  {
    id: 'mi-4',
    time: '10:45',
    source: 'REUTERS',
    sourceColor: '#f97316',
    headline: 'LGPS consolidation pool expansion announced — mandate reviews expected',
    relevantTo: ['Lancashire County Pension Fund', 'West Midlands Pension Fund'],
  },
  {
    id: 'mi-5',
    time: '11:20',
    source: 'FT',
    sourceColor: '#ec4899',
    headline: 'Aviva Group reports £4.2bn pension scheme liability reduction',
    relevantTo: ['Aviva Staff Pension Scheme'],
  },
  {
    id: 'mi-6',
    time: '12:00',
    source: 'BLOOMBERG',
    sourceColor: '#f59e0b',
    headline: 'EM debt spread compression continues — 14bps tighter WTD',
    relevantTo: ['Diversified Income Fund'],
  },
  {
    id: 'mi-7',
    time: '13:15',
    source: 'LSEG',
    sourceColor: '#3b82f6',
    headline: 'Endowment sector increases alternatives allocation target to 28% average',
    relevantTo: ['Cambridge University Endowment', 'Wellcome Trust'],
  },
  {
    id: 'mi-8',
    time: '14:30',
    source: 'REUTERS',
    sourceColor: '#f97316',
    headline:
      'UK defined benefit schemes report improved funding ratios — de-risking trend accelerating',
    relevantTo: ['Aviva Staff Pension Scheme', 'Lancashire County Pension Fund'],
  },
];

// ---------------------------------------------------------------------------
// RFP Pipeline
// ---------------------------------------------------------------------------
export const rfpPipeline: RFPItem[] = [
  {
    id: 'rfp-1',
    clientName: 'Greater Manchester Pension Fund',
    mandateType: 'Global Multi-Asset mandate',
    estimatedAUM: '£300-500m',
    dueDate: '2026-04-08',
    daysUntilDue: 9,
    dataCompletion: 73,
    status: 'In Progress',
    statusNote: 'ESG questionnaire pending',
    assignedTo: 'Sarah Chen',
    stage: 'Data Gathering',
    autoFields: [
      'Performance data (Aladdin)',
      'Team bios (HR feed)',
      'AUM history (Aladdin)',
      'Risk metrics (Bloomberg)',
    ],
    manualFields: ['ESG metrics', 'Custom scenario analysis', 'Client references'],
  },
  {
    id: 'rfp-2',
    clientName: 'Legal & General Retail',
    mandateType: 'Diversified Income fund listing',
    estimatedAUM: '',
    dueDate: '2026-04-21',
    daysUntilDue: 22,
    dataCompletion: 45,
    status: 'Not Started',
    statusNote: 'Not Started on ESG section',
    assignedTo: 'Tom Okafor',
    stage: 'Data Gathering',
    autoFields: ['Performance data (Aladdin)', 'Fund factsheet (Marketing)'],
    manualFields: [
      'ESG metrics',
      'Distribution strategy',
      'Platform integration specs',
      'Fee schedule',
    ],
  },
  {
    id: 'rfp-3',
    clientName: 'Mercer Consulting',
    mandateType: 'Multi-asset review',
    estimatedAUM: '',
    dueDate: '2026-04-30',
    daysUntilDue: 31,
    dataCompletion: 91,
    status: 'Near Complete',
    statusNote: 'Final compliance sign-off pending',
    assignedTo: 'James Whitfield',
    stage: 'Internal Review',
    autoFields: [
      'Performance data (Aladdin)',
      'Risk attribution (Bloomberg)',
      'Team bios (HR feed)',
      'AUM history (Aladdin)',
      'ESG report (Morningstar)',
    ],
    manualFields: ['Custom benchmark analysis'],
  },
  {
    id: 'rfp-4',
    clientName: 'Abrdn Platform',
    mandateType: 'Strategic Bond distribution',
    estimatedAUM: '',
    dueDate: '2026-04-13',
    daysUntilDue: 14,
    dataCompletion: 58,
    status: 'In Progress',
    statusNote: 'Awaiting updated factsheet',
    assignedTo: 'Tom Okafor',
    stage: 'Data Gathering',
    autoFields: [
      'Performance data (Aladdin)',
      'Fund factsheet (Marketing)',
      'Risk metrics (Bloomberg)',
    ],
    manualFields: [
      'Platform-specific documentation',
      'Fee negotiation terms',
      'Distribution agreement',
    ],
  },
  {
    id: 'rfp-5',
    clientName: 'Barnett Waddingham',
    mandateType: 'Pension fund advisory',
    estimatedAUM: '£150m',
    dueDate: '2026-05-14',
    daysUntilDue: 45,
    dataCompletion: 20,
    status: 'Just Opened',
    statusNote: 'Initial data request received',
    assignedTo: 'Sarah Chen',
    stage: 'New',
    autoFields: ['Performance data (Aladdin)'],
    manualFields: [
      'ESG metrics',
      'Custom scenario analysis',
      'Risk attribution',
      'Team bios',
      'Client references',
      'Fee schedule',
    ],
  },
];

// ---------------------------------------------------------------------------
// Flow History (12 months — April 2025 to March 2026)
// ---------------------------------------------------------------------------
export const flowHistory: FlowMonth[] = [
  { month: 'Apr 2025', netFlow: 45, pension: 20, endowment: 8, insurance: 5, wealth: 7, platform: 5 },
  { month: 'May 2025', netFlow: 32, pension: 12, endowment: 5, insurance: 8, wealth: 4, platform: 3 },
  { month: 'Jun 2025', netFlow: -15, pension: -20, endowment: 3, insurance: -5, wealth: 4, platform: 3 },
  { month: 'Jul 2025', netFlow: 28, pension: 10, endowment: 6, insurance: 4, wealth: 5, platform: 3 },
  { month: 'Aug 2025', netFlow: 8, pension: -5, endowment: 2, insurance: 3, wealth: 5, platform: 3 },
  { month: 'Sep 2025', netFlow: 52, pension: 25, endowment: 10, insurance: 8, wealth: 5, platform: 4 },
  { month: 'Oct 2025', netFlow: 18, pension: 5, endowment: 4, insurance: 3, wealth: 3, platform: 3 },
  { month: 'Nov 2025', netFlow: -22, pension: -15, endowment: -3, insurance: -8, wealth: 2, platform: 2 },
  { month: 'Dec 2025', netFlow: -8, pension: -10, endowment: 2, insurance: -5, wealth: 3, platform: 2 },
  { month: 'Jan 2026', netFlow: -38, pension: -20, endowment: -5, insurance: -12, wealth: -3, platform: 2 },
  { month: 'Feb 2026', netFlow: -46, pension: -25, endowment: -4, insurance: -15, wealth: -4, platform: 2 },
  { month: 'Mar 2026', netFlow: -43, pension: -18, endowment: -3, insurance: -14, wealth: -5, platform: -3 },
];

// ---------------------------------------------------------------------------
// Client Timelines
// ---------------------------------------------------------------------------
export const clientTimelines: Record<string, TimelineEntry[]> = {
  'client-1': [
    // Lancashire County Pension Fund
    {
      date: '2024-10-15',
      type: 'Meeting',
      description: 'Annual strategy review with investment committee',
      meridianContact: 'Sarah Chen',
      outcome: 'Agreed to maintain current allocation. Discussed alternatives interest.',
    },
    {
      date: '2024-11-08',
      type: 'Report Sent',
      description: 'Q3 2024 performance report and attribution analysis',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report acknowledged by David Morris.',
    },
    {
      date: '2024-12-03',
      type: 'Call',
      description: 'Year-end review call with David Morris',
      meridianContact: 'Sarah Chen',
      outcome: 'Discussed 2025 outlook. Lancashire considering LGPS pooling options.',
    },
    {
      date: '2025-01-20',
      type: 'Email',
      description: 'Email: Updated fee schedule for 2025',
      meridianContact: 'Sarah Chen',
      outcome: 'Acknowledged. No pushback on fees.',
    },
    {
      date: '2025-03-12',
      type: 'Meeting',
      description: 'Face-to-face meeting at Lancashire County Hall',
      meridianContact: 'Sarah Chen',
      outcome: 'Reviewed Q4 performance. Positive discussion on UK Balanced allocation.',
    },
    {
      date: '2025-05-22',
      type: 'Report Sent',
      description: 'Q1 2025 factsheet and market outlook',
      meridianContact: 'Alex Rodriguez',
      outcome: 'No response received.',
    },
    {
      date: '2025-07-14',
      type: 'Call',
      description: 'Mid-year review call with investment team',
      meridianContact: 'Sarah Chen',
      outcome: 'Lancashire flagged interest in reviewing alternatives allocation in Q2 2026.',
    },
    {
      date: '2025-09-05',
      type: 'Meeting',
      description: 'Quarterly review meeting — Preston office',
      meridianContact: 'Sarah Chen',
      outcome: 'Performance broadly in line. LGPS pooling discussion ongoing.',
    },
    {
      date: '2025-10-30',
      type: 'Report Sent',
      description: 'Q3 2025 performance report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report sent to David Morris and pension committee.',
    },
    {
      date: '2025-12-18',
      type: 'Call',
      description: 'Year-end positioning call',
      meridianContact: 'Sarah Chen',
      outcome: 'Brief call. David Morris mentioned upcoming CIO transition.',
    },
    {
      date: '2026-01-15',
      type: 'Email',
      description: 'Email: Congratulations on David Morris CIO appointment',
      meridianContact: 'Sarah Chen',
      outcome: 'Brief thank you reply from Morris.',
    },
    {
      date: '2026-02-24',
      type: 'Report Sent',
      description: 'Q4 2025 performance pack and 2026 outlook',
      meridianContact: 'Alex Rodriguez',
      outcome: 'No response. Last contact with this client.',
    },
  ],
  'client-2': [
    // Cambridge University Endowment
    {
      date: '2024-09-20',
      type: 'Meeting',
      description: 'Annual investment review with endowment board',
      meridianContact: 'James Whitfield',
      outcome: 'Positive review. Board pleased with income consistency.',
    },
    {
      date: '2024-11-12',
      type: 'Report Sent',
      description: 'Q3 2024 Diversified Income and Absolute Return reports',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report reviewed by investment office. No concerns raised.',
    },
    {
      date: '2024-12-19',
      type: 'Call',
      description: 'Year-end planning call with Dr Sarah Patterson (investment director)',
      meridianContact: 'James Whitfield',
      outcome: 'Discussed 2025 ESG policy updates. Fossil fuel exclusion reaffirmed.',
    },
    {
      date: '2025-02-06',
      type: 'Email',
      description: 'Email: ESG integration update and Meridian climate report',
      meridianContact: 'James Whitfield',
      outcome: 'Well received. Cambridge shared their updated responsible investment policy.',
    },
    {
      date: '2025-04-10',
      type: 'Meeting',
      description: 'Spring review meeting at Cambridge Investment Office',
      meridianContact: 'James Whitfield',
      outcome: 'Strong relationship. Discussed potential real assets mandate.',
    },
    {
      date: '2025-06-25',
      type: 'Report Sent',
      description: 'Q1 2025 performance pack with ESG impact summary',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Acknowledged by investment office.',
    },
    {
      date: '2025-08-14',
      type: 'Call',
      description: 'Quarterly check-in with Dr Patterson',
      meridianContact: 'James Whitfield',
      outcome: 'Cambridge reviewing alternatives allocation. Early-stage discussion.',
    },
    {
      date: '2025-10-03',
      type: 'Meeting',
      description: 'Annual strategy meeting with endowment board',
      meridianContact: 'James Whitfield',
      outcome: 'Board approved increase in real assets exposure. Potential new mandate for Meridian.',
    },
    {
      date: '2025-11-20',
      type: 'Report Sent',
      description: 'Q3 2025 performance report and real assets proposal',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Proposal under review by investment committee.',
    },
    {
      date: '2026-01-09',
      type: 'Email',
      description: 'Email: Follow-up on real assets mandate discussion',
      meridianContact: 'James Whitfield',
      outcome: 'Cambridge confirmed internal review underway. Timeline TBC.',
    },
    {
      date: '2026-02-14',
      type: 'Call',
      description: 'Monthly check-in call',
      meridianContact: 'James Whitfield',
      outcome: 'Relationship stable. Real assets decision expected by end of Q2.',
    },
    {
      date: '2026-03-22',
      type: 'Meeting',
      description: 'Q4 review and real assets mandate update',
      meridianContact: 'James Whitfield',
      outcome: 'Board decision to increase real assets imminent. Meridian well-positioned.',
    },
  ],
  'client-3': [
    // Aviva Staff Pension Scheme — gap in recent months
    {
      date: '2024-09-12',
      type: 'Meeting',
      description: 'Annual review with pension scheme trustees',
      meridianContact: 'Sarah Chen',
      outcome: 'Trustees satisfied with performance. De-risking pathway discussed.',
    },
    {
      date: '2024-10-25',
      type: 'Report Sent',
      description: 'Q3 2024 performance and liability update',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report acknowledged by scheme secretary.',
    },
    {
      date: '2024-12-05',
      type: 'Call',
      description: 'Year-end de-risking strategy call',
      meridianContact: 'Sarah Chen',
      outcome: 'Aviva flagged improving funding ratio. May accelerate de-risking timeline.',
    },
    {
      date: '2025-01-22',
      type: 'Email',
      description: 'Email: 2025 contribution schedule and investment plan',
      meridianContact: 'Sarah Chen',
      outcome: 'Contributions confirmed at current levels.',
    },
    {
      date: '2025-03-18',
      type: 'Meeting',
      description: 'Quarterly review meeting — Aviva offices, London',
      meridianContact: 'Sarah Chen',
      outcome: 'Performance broadly in line. Discussion on gilt allocation.',
    },
    {
      date: '2025-05-08',
      type: 'Report Sent',
      description: 'Q1 2025 performance report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report sent. No response received.',
    },
    {
      date: '2025-07-15',
      type: 'Call',
      description: 'Mid-year review call with scheme manager',
      meridianContact: 'Sarah Chen',
      outcome: 'Aviva mentioned receiving approach from competitor. Non-committal.',
    },
    {
      date: '2025-09-22',
      type: 'Meeting',
      description: 'Trustee meeting — Q2 performance review',
      meridianContact: 'Sarah Chen',
      outcome: 'Global Multi-Asset underperformance raised. Trustees requested action plan.',
    },
    {
      date: '2025-10-14',
      type: 'Email',
      description: 'Email: Performance improvement action plan sent',
      meridianContact: 'Emma Walsh',
      outcome: 'Acknowledged but no follow-up meeting scheduled.',
    },
    {
      date: '2025-11-28',
      type: 'Report Sent',
      description: 'Q3 2025 performance pack with enhanced attribution',
      meridianContact: 'Alex Rodriguez',
      outcome: 'No response received.',
    },
    {
      date: '2026-01-28',
      type: 'Email',
      description: 'Email: Q4 2025 preliminary performance summary',
      meridianContact: 'Sarah Chen',
      outcome: 'Brief acknowledgement. No meeting requested. Last contact.',
    },
  ],
  'client-4': [
    // St. James's Place Partnership
    {
      date: '2024-10-10',
      type: 'Meeting',
      description: 'Annual partnership review at SJP head office',
      meridianContact: 'Tom Okafor',
      outcome: 'Positive review. SJP confirmed continued allocation to both funds.',
    },
    {
      date: '2024-11-15',
      type: 'Report Sent',
      description: 'Q3 2024 fund reports and Morningstar ratings update',
      meridianContact: 'Alex Rodriguez',
      outcome: 'SJP investment team acknowledged. Ratings stable.',
    },
    {
      date: '2025-01-08',
      type: 'Call',
      description: 'New year planning call with SJP fund selection team',
      meridianContact: 'Tom Okafor',
      outcome: 'SJP confirmed fund positioning on approved list for 2025.',
    },
    {
      date: '2025-02-20',
      type: 'Email',
      description: 'Email: Updated fund factsheets for adviser distribution',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Factsheets updated on SJP platform.',
    },
    {
      date: '2025-04-15',
      type: 'Meeting',
      description: 'Quarterly review — SJP Cirencester office',
      meridianContact: 'Tom Okafor',
      outcome: 'Flows steady. Discussion on expanding to other SJP fund ranges.',
    },
    {
      date: '2025-06-12',
      type: 'Report Sent',
      description: 'Q1 2025 performance report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Strong UK Balanced performance noted positively.',
    },
    {
      date: '2025-08-21',
      type: 'Call',
      description: 'Mid-year review call with partnership manager',
      meridianContact: 'Tom Okafor',
      outcome: 'SJP indicated possible increase in allocation to UK Balanced.',
    },
    {
      date: '2025-10-17',
      type: 'Meeting',
      description: 'Annual fund review meeting',
      meridianContact: 'Tom Okafor',
      outcome: 'Both funds retained on approved list. Strong net inflows noted.',
    },
    {
      date: '2025-12-09',
      type: 'Report Sent',
      description: 'Q3 2025 performance and flow report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report well received.',
    },
    {
      date: '2026-01-22',
      type: 'Email',
      description: 'Email: 2026 distribution strategy discussion',
      meridianContact: 'Tom Okafor',
      outcome: 'SJP open to discussing new fund launches for adviser network.',
    },
    {
      date: '2026-02-18',
      type: 'Call',
      description: 'Monthly check-in with fund selection team',
      meridianContact: 'Tom Okafor',
      outcome: 'New regional director for South East appointed. Intro meeting planned.',
    },
    {
      date: '2026-03-27',
      type: 'Meeting',
      description: 'Q4 review and introduction to new regional director',
      meridianContact: 'Tom Okafor',
      outcome: 'Good first meeting with new regional director. Relationship building.',
    },
  ],
  'client-5': [
    // Wellcome Trust
    {
      date: '2024-10-02',
      type: 'Meeting',
      description: 'Annual investment review with Wellcome investment team',
      meridianContact: 'James Whitfield',
      outcome: 'Positive discussion on Absolute Return and Strategic Bond allocation.',
    },
    {
      date: '2024-11-18',
      type: 'Report Sent',
      description: 'Q3 2024 Absolute Return and Strategic Bond performance reports',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Reports reviewed. No major concerns.',
    },
    {
      date: '2024-12-12',
      type: 'Call',
      description: 'Year-end ESG integration discussion',
      meridianContact: 'James Whitfield',
      outcome: 'Wellcome increasing focus on ESG integration for 2025.',
    },
    {
      date: '2025-01-30',
      type: 'Email',
      description: 'Email: Meridian ESG policy update and climate report',
      meridianContact: 'James Whitfield',
      outcome: 'Wellcome appreciated the proactive ESG communication.',
    },
    {
      date: '2025-03-25',
      type: 'Meeting',
      description: 'Q1 review meeting at Wellcome offices, Euston Road',
      meridianContact: 'James Whitfield',
      outcome: 'Discussion on drawdown limits. Maximum drawdown constraint of 8% noted.',
    },
    {
      date: '2025-06-05',
      type: 'Report Sent',
      description: 'Q1 2025 performance and risk report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Absolute Return slight underperformance noted but within tolerance.',
    },
    {
      date: '2025-08-19',
      type: 'Call',
      description: 'Quarterly review call with Wellcome CIO',
      meridianContact: 'James Whitfield',
      outcome: 'Wellcome monitoring Absolute Return closely. No immediate concerns.',
    },
    {
      date: '2025-10-08',
      type: 'Meeting',
      description: 'Annual strategy review',
      meridianContact: 'James Whitfield',
      outcome: 'ESG integration becoming a key differentiator in manager selection.',
    },
    {
      date: '2025-12-04',
      type: 'Report Sent',
      description: 'Q3 2025 performance report with ESG impact analysis',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Well received. Wellcome noted ESG reporting improvements.',
    },
    {
      date: '2026-01-23',
      type: 'Email',
      description: 'Email: Market outlook and positioning update',
      meridianContact: 'Emma Walsh',
      outcome: 'Brief acknowledgement from Wellcome investment team.',
    },
    {
      date: '2026-03-11',
      type: 'Call',
      description: 'Q4 2025 results and 2026 outlook call',
      meridianContact: 'James Whitfield',
      outcome:
        'Absolute Return underperformance (-0.4% YTD) discussed but not flagged as critical. Monitoring.',
    },
  ],
  'client-6': [
    // Phoenix Group Insurance — gap in recent months
    {
      date: '2024-09-18',
      type: 'Meeting',
      description: 'Annual review with Phoenix investment committee',
      meridianContact: 'Sarah Chen',
      outcome: 'Solvency II compliance confirmed. Duration matching within tolerance.',
    },
    {
      date: '2024-10-30',
      type: 'Report Sent',
      description: 'Q3 2024 Strategic Bond and Diversified Income reports',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report received by investment team.',
    },
    {
      date: '2024-11-22',
      type: 'Call',
      description: 'Duration positioning call ahead of year-end',
      meridianContact: 'Emma Walsh',
      outcome: 'Phoenix satisfied with duration match positioning.',
    },
    {
      date: '2025-01-14',
      type: 'Email',
      description: 'Email: 2025 Solvency II compliance attestation',
      meridianContact: 'Sarah Chen',
      outcome: 'Compliance documentation submitted and acknowledged.',
    },
    {
      date: '2025-03-10',
      type: 'Meeting',
      description: 'Quarterly review — Phoenix offices, Birmingham',
      meridianContact: 'Sarah Chen',
      outcome: 'Positive review. No concerns raised by outgoing CIO.',
    },
    {
      date: '2025-05-20',
      type: 'Report Sent',
      description: 'Q1 2025 performance and Solvency II impact report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report acknowledged. No follow-up.',
    },
    {
      date: '2025-07-08',
      type: 'Call',
      description: 'Mid-year call with investment team',
      meridianContact: 'Sarah Chen',
      outcome: 'Phoenix mentioned upcoming CIO transition. No details shared.',
    },
    {
      date: '2025-09-15',
      type: 'Meeting',
      description: 'Q2 review meeting with investment committee',
      meridianContact: 'Sarah Chen',
      outcome: 'Outgoing CIO flagged that strategic review would follow new appointment.',
    },
    {
      date: '2025-10-28',
      type: 'Report Sent',
      description: 'Q3 2025 performance report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report sent. No response received.',
    },
    {
      date: '2025-12-15',
      type: 'Email',
      description: 'Email: Year-end positioning summary',
      meridianContact: 'Sarah Chen',
      outcome: 'No response. New CIO Marcus Thompson had recently joined.',
    },
    {
      date: '2026-01-17',
      type: 'Email',
      description: 'Email: Introduction letter to new CIO Marcus Thompson',
      meridianContact: 'Sarah Chen',
      outcome: 'No response received. Last contact with this client.',
    },
  ],
  'client-7': [
    // Rathbones Group
    {
      date: '2024-10-22',
      type: 'Meeting',
      description: 'Introductory meeting with Rathbones fund selection team',
      meridianContact: 'Tom Okafor',
      outcome: 'Initial allocation to UK Balanced Fund confirmed.',
    },
    {
      date: '2024-12-04',
      type: 'Report Sent',
      description: 'Q3 2024 UK Balanced Fund performance report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Positive reception. Strong performance noted.',
    },
    {
      date: '2025-01-16',
      type: 'Call',
      description: 'Q4 2024 review call with fund selection team',
      meridianContact: 'Tom Okafor',
      outcome: 'Rathbones pleased with performance. Considering increased allocation.',
    },
    {
      date: '2025-03-05',
      type: 'Meeting',
      description: 'Quarterly review meeting at Rathbones, London',
      meridianContact: 'Tom Okafor',
      outcome: 'Allocation increased by 12%. Very positive.',
    },
    {
      date: '2025-05-14',
      type: 'Report Sent',
      description: 'Q1 2025 performance report and peer comparison',
      meridianContact: 'Alex Rodriguez',
      outcome: 'UK Balanced Fund ranked top quartile. Rathbones very pleased.',
    },
    {
      date: '2025-07-09',
      type: 'Call',
      description: 'Mid-year check-in',
      meridianContact: 'Tom Okafor',
      outcome: 'Flows increasing. Rathbones considering complementary bond allocation.',
    },
    {
      date: '2025-09-18',
      type: 'Meeting',
      description: 'Q2 review and Strategic Bond Fund introduction',
      meridianContact: 'Tom Okafor',
      outcome: 'Positive reception to Strategic Bond pitch. Under internal review.',
    },
    {
      date: '2025-11-12',
      type: 'Report Sent',
      description: 'Q3 2025 performance report with Strategic Bond Fund profile',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Rathbones reviewing Strategic Bond internally.',
    },
    {
      date: '2026-01-08',
      type: 'Call',
      description: 'New year planning call',
      meridianContact: 'Tom Okafor',
      outcome: 'Flows up 18% QoQ. Strategic Bond decision expected Q2.',
    },
    {
      date: '2026-02-11',
      type: 'Email',
      description: 'Email: Updated Strategic Bond Fund materials',
      meridianContact: 'Tom Okafor',
      outcome: 'Materials forwarded to Rathbones investment committee.',
    },
    {
      date: '2026-03-19',
      type: 'Meeting',
      description: 'Q4 2025 review and ongoing Strategic Bond discussion',
      meridianContact: 'Tom Okafor',
      outcome: 'Strong advocacy from fund selection team. Decision timeline Q2 2026.',
    },
  ],
  'client-8': [
    // West Midlands Pension Fund — gap in recent months
    {
      date: '2024-09-25',
      type: 'Meeting',
      description: 'Annual investment review with pension committee',
      meridianContact: 'Sarah Chen',
      outcome: 'Global Multi-Asset performance acceptable. LGPS pooling discussed.',
    },
    {
      date: '2024-11-06',
      type: 'Report Sent',
      description: 'Q3 2024 performance report and LGPS compliance update',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report received. Committee reviewing LGPS pooling implications.',
    },
    {
      date: '2024-12-18',
      type: 'Call',
      description: 'Year-end call with pension fund director',
      meridianContact: 'Sarah Chen',
      outcome: 'LGPS pooling timeline uncertain. West Midlands monitoring closely.',
    },
    {
      date: '2025-02-10',
      type: 'Meeting',
      description: 'Q4 2024 review meeting — Wolverhampton',
      meridianContact: 'Sarah Chen',
      outcome: 'Performance slightly below benchmark. Committee noted but no action.',
    },
    {
      date: '2025-04-22',
      type: 'Report Sent',
      description: 'Q1 2025 performance report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Benchmark gap widening. Report acknowledged without comment.',
    },
    {
      date: '2025-06-16',
      type: 'Call',
      description: 'Mid-year check-in with pension manager',
      meridianContact: 'Sarah Chen',
      outcome: 'Performance gap discussed. Sarah committed to providing action plan.',
    },
    {
      date: '2025-08-05',
      type: 'Email',
      description: 'Email: Performance action plan for Global Multi-Asset',
      meridianContact: 'Emma Walsh',
      outcome: 'Action plan acknowledged. Pension committee to review at next meeting.',
    },
    {
      date: '2025-09-30',
      type: 'Meeting',
      description: 'Quarterly review with pension committee',
      meridianContact: 'Sarah Chen',
      outcome: 'Committee expressed concern about -1.2% underperformance. Monitoring closely.',
    },
    {
      date: '2025-11-14',
      type: 'Report Sent',
      description: 'Q3 2025 performance report with enhanced attribution',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report sent. No response received.',
    },
    {
      date: '2025-12-20',
      type: 'Email',
      description: 'Email: Year-end market outlook',
      meridianContact: 'Sarah Chen',
      outcome: 'No response received.',
    },
    {
      date: '2026-02-11',
      type: 'Report Sent',
      description: 'Q4 2025 performance report — underperformance at -1.7%',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report sent. No acknowledgement. Last contact.',
    },
  ],
  'client-9': [
    // Caledonian Family Office
    {
      date: '2024-10-08',
      type: 'Meeting',
      description: 'Annual review with Alistair McLeod (principal)',
      meridianContact: 'James Whitfield',
      outcome: 'Very positive. Family pleased with capital preservation approach.',
    },
    {
      date: '2024-11-25',
      type: 'Report Sent',
      description: 'Q3 2024 portfolio report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report appreciated. McLeod family values detailed reporting.',
    },
    {
      date: '2025-01-13',
      type: 'Call',
      description: 'New year planning call with Alistair McLeod',
      meridianContact: 'James Whitfield',
      outcome: 'Family considering modest increase in allocation.',
    },
    {
      date: '2025-02-28',
      type: 'Meeting',
      description: 'Portfolio review — Edinburgh',
      meridianContact: 'James Whitfield',
      outcome: 'McLeod increased allocation by £15m. Very satisfied.',
    },
    {
      date: '2025-04-18',
      type: 'Email',
      description: 'Email: Introduction to peer family office (Henderson FO)',
      meridianContact: 'James Whitfield',
      outcome: 'McLeod introduced Henderson Family Office. Meeting scheduled.',
    },
    {
      date: '2025-06-02',
      type: 'Report Sent',
      description: 'Q1 2025 portfolio report with income analysis',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Income yield exceeding expectations. Family very pleased.',
    },
    {
      date: '2025-08-11',
      type: 'Call',
      description: 'Summer check-in with Alistair McLeod',
      meridianContact: 'James Whitfield',
      outcome: 'Family holiday season. Brief positive call.',
    },
    {
      date: '2025-10-14',
      type: 'Meeting',
      description: 'Quarterly review — Edinburgh',
      meridianContact: 'James Whitfield',
      outcome: 'Capital preservation on track. Discussion on next generation involvement.',
    },
    {
      date: '2025-12-08',
      type: 'Report Sent',
      description: 'Q3 2025 portfolio report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report appreciated.',
    },
    {
      date: '2026-01-20',
      type: 'Email',
      description: 'Email: Introduction to second peer family office (Drummond FO)',
      meridianContact: 'James Whitfield',
      outcome: 'McLeod introduced Drummond Family Office. Strong advocacy for Meridian.',
    },
    {
      date: '2026-02-17',
      type: 'Call',
      description: 'Monthly check-in',
      meridianContact: 'James Whitfield',
      outcome: 'Family planning next generation wealth transfer. Potential mandate discussion.',
    },
    {
      date: '2026-03-25',
      type: 'Meeting',
      description: 'Q4 review and wealth transfer planning discussion',
      meridianContact: 'James Whitfield',
      outcome: 'Very positive meeting. Next generation engaged. Strong advocate.',
    },
  ],
  'client-10': [
    // Hargreaves Lansdown
    {
      date: '2024-09-30',
      type: 'Meeting',
      description: 'Annual platform review — HL offices, Bristol',
      meridianContact: 'Tom Okafor',
      outcome: 'Both funds retained on Wealth 50 list. Positive retail demand.',
    },
    {
      date: '2024-11-08',
      type: 'Report Sent',
      description: 'Q3 2024 fund factsheets and KID updates',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Documentation updated on HL platform.',
    },
    {
      date: '2024-12-16',
      type: 'Email',
      description: 'Email: Year-end fund commentary for HL editorial team',
      meridianContact: 'Tom Okafor',
      outcome: 'Commentary used in HL year-end market review.',
    },
    {
      date: '2025-02-05',
      type: 'Call',
      description: 'Q4 2024 distribution review call',
      meridianContact: 'Tom Okafor',
      outcome: 'Retail flows steady. UK Balanced gaining traction after Trustnet upgrade.',
    },
    {
      date: '2025-04-08',
      type: 'Meeting',
      description: 'Spring review meeting at HL, Bristol',
      meridianContact: 'Tom Okafor',
      outcome: 'UK Balanced flows up 25% since Trustnet rating upgrade.',
    },
    {
      date: '2025-06-19',
      type: 'Report Sent',
      description: 'Q1 2025 performance reports and updated factsheets',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Factsheets published on platform.',
    },
    {
      date: '2025-08-28',
      type: 'Call',
      description: 'Mid-year distribution call',
      meridianContact: 'Tom Okafor',
      outcome: 'HL considering featuring UK Balanced in newsletter.',
    },
    {
      date: '2025-10-20',
      type: 'Meeting',
      description: 'Annual Wealth 50 review meeting',
      meridianContact: 'Tom Okafor',
      outcome: 'Both funds retained. Strong performance versus peer group.',
    },
    {
      date: '2025-12-12',
      type: 'Report Sent',
      description: 'Q3 2025 reports and KID/KIID compliance update',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Compliance documentation approved.',
    },
    {
      date: '2026-01-28',
      type: 'Email',
      description: 'Email: 2026 distribution plan and marketing cooperation',
      meridianContact: 'Tom Okafor',
      outcome: 'HL agreed to feature UK Balanced in Q1 newsletter.',
    },
    {
      date: '2026-03-16',
      type: 'Call',
      description: 'Q4 2025 review call and 2026 planning',
      meridianContact: 'Tom Okafor',
      outcome: 'UK Balanced retail flows growing. Diversified Income steady.',
    },
  ],
  'client-11': [
    // Church of England Pensions Board
    {
      date: '2024-09-16',
      type: 'Meeting',
      description: 'Annual ethical investment review with pensions board',
      meridianContact: 'James Whitfield',
      outcome: 'Climate Action 100+ alignment confirmed. ESG screens maintained.',
    },
    {
      date: '2024-11-04',
      type: 'Report Sent',
      description: 'Q3 2024 performance and ethical screening compliance report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report reviewed by ethics committee. Full compliance confirmed.',
    },
    {
      date: '2024-12-10',
      type: 'Call',
      description: 'Year-end call on 2025 ethical investment priorities',
      meridianContact: 'James Whitfield',
      outcome: 'CoE increasing focus on climate transition engagement.',
    },
    {
      date: '2025-02-18',
      type: 'Email',
      description: 'Email: Meridian climate transition engagement report',
      meridianContact: 'James Whitfield',
      outcome: 'Well received. CoE shared updated ethical investment framework.',
    },
    {
      date: '2025-04-07',
      type: 'Meeting',
      description: 'Quarterly review at Church House, Westminster',
      meridianContact: 'James Whitfield',
      outcome: 'Absolute Return performance in line. Strategic Bond performing well.',
    },
    {
      date: '2025-06-23',
      type: 'Report Sent',
      description: 'Q1 2025 performance report with ethical screening summary',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report approved by ethics committee.',
    },
    {
      date: '2025-08-12',
      type: 'Call',
      description: 'Mid-year review call with pensions board secretary',
      meridianContact: 'James Whitfield',
      outcome: 'Discussed increased focus on climate engagement outcomes.',
    },
    {
      date: '2025-10-21',
      type: 'Meeting',
      description: 'Annual strategy review with trustee board',
      meridianContact: 'James Whitfield',
      outcome: 'Absolute Return underperformance beginning to be noticed. Not yet critical.',
    },
    {
      date: '2025-12-05',
      type: 'Report Sent',
      description: 'Q3 2025 performance and climate engagement report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report noted Absolute Return underperformance of -0.3%.',
    },
    {
      date: '2026-01-14',
      type: 'Email',
      description: 'Email: Absolute Return positioning update and market outlook',
      meridianContact: 'Emma Walsh',
      outcome: 'CoE acknowledged. Internal discussion at trustee meeting planned.',
    },
    {
      date: '2026-02-10',
      type: 'Call',
      description: 'Monthly check-in call',
      meridianContact: 'James Whitfield',
      outcome: 'Trustee meeting discussed Absolute Return. Monitoring but not yet escalated.',
    },
    {
      date: '2026-03-01',
      type: 'Meeting',
      description: 'Q4 2025 review and trustee feedback session',
      meridianContact: 'James Whitfield',
      outcome:
        'Absolute Return underperformance flagged at last trustee meeting. Watching closely.',
    },
  ],
  'client-12': [
    // Scottish Widows Investment Partnership
    {
      date: '2024-09-01',
      type: 'RFP Response',
      description: 'Competitive pitch response — Global Multi-Asset mandate',
      meridianContact: 'Tom Okafor',
      outcome: 'Meridian selected from shortlist of 4 managers.',
    },
    {
      date: '2024-09-20',
      type: 'Meeting',
      description: 'Post-selection onboarding meeting — Edinburgh',
      meridianContact: 'Tom Okafor',
      outcome: 'Mandate terms agreed. £380m initial allocation.',
    },
    {
      date: '2024-10-15',
      type: 'Email',
      description: 'Email: Solvency II compliance documentation submitted',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Documentation approved by Scottish Widows compliance.',
    },
    {
      date: '2024-12-09',
      type: 'Report Sent',
      description: 'First quarterly report — Q3 2024 (partial period)',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report format agreed. Quarterly rebalancing schedule confirmed.',
    },
    {
      date: '2025-01-21',
      type: 'Call',
      description: 'Q4 2024 review call',
      meridianContact: 'Tom Okafor',
      outcome: 'Early performance in line. Scottish Widows satisfied with onboarding.',
    },
    {
      date: '2025-03-18',
      type: 'Meeting',
      description: 'First formal quarterly review — Edinburgh',
      meridianContact: 'Tom Okafor',
      outcome: 'Performance slightly below benchmark. Too early to draw conclusions.',
    },
    {
      date: '2025-05-12',
      type: 'Report Sent',
      description: 'Q1 2025 performance report',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Report received. No concerns raised.',
    },
    {
      date: '2025-07-22',
      type: 'Call',
      description: 'Mid-year review call',
      meridianContact: 'Tom Okafor',
      outcome: 'Performance gap widening. Scottish Widows monitoring.',
    },
    {
      date: '2025-09-08',
      type: 'Meeting',
      description: 'Quarterly review — Edinburgh',
      meridianContact: 'Tom Okafor',
      outcome: 'Underperformance discussed. Scottish Widows requested enhanced reporting.',
    },
    {
      date: '2025-11-04',
      type: 'Report Sent',
      description: 'Q3 2025 enhanced performance report with attribution',
      meridianContact: 'Alex Rodriguez',
      outcome: 'Enhanced format appreciated. Performance still tracking below benchmark.',
    },
    {
      date: '2025-12-16',
      type: 'Email',
      description: 'Email: Year-end positioning and 2026 outlook',
      meridianContact: 'Tom Okafor',
      outcome: 'Brief acknowledgement. No meeting requested.',
    },
    {
      date: '2026-02-17',
      type: 'Call',
      description: 'Q4 2025 review call',
      meridianContact: 'Tom Okafor',
      outcome: 'Performance under scrutiny. Formal review due Q3 2026. Last contact.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Client Intelligence
// ---------------------------------------------------------------------------
export const clientIntelligence: Record<string, IntelEntry[]> = {
  'client-1': [
    // Lancashire County Pension Fund
    {
      source: 'Reuters',
      date: '2026-03-30',
      headline: 'LGPS consolidation announcement — review of external managers expected',
      relevance: 'Direct impact on Lancashire mandate. May trigger formal review.',
    },
    {
      source: 'LinkedIn',
      date: '2026-03-12',
      headline: 'David Morris appointed CIO — moved from HSBC Asset Management',
      relevance: 'New CIO may bring new priorities and manager preferences.',
    },
    {
      source: 'Companies House',
      date: '2026-02-26',
      headline: 'Lancashire CC posts £340m pension liability increase in annual report',
      relevance: 'Liability growth may accelerate de-risking or mandate review.',
    },
    {
      source: 'LGPS Tracker',
      date: '2026-02-13',
      headline: 'Lancashire pension fund increases alternatives allocation to 22%',
      relevance: 'Alternatives growth may redirect assets from traditional multi-asset.',
    },
  ],
  'client-2': [
    // Cambridge University Endowment
    {
      source: 'FT',
      date: '2026-03-28',
      headline: 'Cambridge endowment posts 9.2% return for FY2025 — outperforms peers',
      relevance: 'Strong endowment performance reinforces current manager relationships.',
    },
    {
      source: 'Bloomberg',
      date: '2026-03-15',
      headline: 'UK university endowments increase real assets allocation to average 18%',
      relevance: 'Trend aligns with Cambridge board decision to increase real assets.',
    },
    {
      source: 'LinkedIn',
      date: '2026-02-20',
      headline: 'Dr Sarah Patterson presents at CIO Summit on endowment portfolio construction',
      relevance: 'Patterson publicly advocating for diversification — supports Meridian positioning.',
    },
    {
      source: 'Reuters',
      date: '2026-01-30',
      headline: 'Cambridge University receives £150m donation for research endowment',
      relevance: 'Increased capital may flow through investment office. Mandate growth opportunity.',
    },
    {
      source: 'Morningstar',
      date: '2026-01-10',
      headline: 'Diversified income category sees renewed institutional interest',
      relevance: 'Positive backdrop for Meridian Diversified Income Fund positioning.',
    },
  ],
  'client-3': [
    // Aviva Staff Pension Scheme
    {
      source: 'FT',
      date: '2026-03-30',
      headline: 'Aviva Group reports £4.2bn pension scheme liability reduction',
      relevance: 'Improved funding ratio may accelerate de-risking and mandate reallocation.',
    },
    {
      source: 'Bloomberg',
      date: '2026-03-18',
      headline: 'BlackRock reportedly pitching LDI mandate to Aviva schemes',
      relevance: 'Direct competitive threat. BlackRock proposing liability-driven alternative.',
    },
    {
      source: 'Reuters',
      date: '2026-03-02',
      headline: 'Aviva Investors announces restructuring of multi-asset team',
      relevance: 'Internal Aviva changes may affect external manager selection process.',
    },
    {
      source: 'Companies House',
      date: '2026-01-29',
      headline: 'Aviva Staff Pension Scheme annual report shows improved funding ratio',
      relevance: 'Funding improvement supports de-risking thesis. May reduce multi-asset allocation.',
    },
  ],
  'client-4': [
    // St. James's Place Partnership
    {
      source: 'FT',
      date: '2026-03-25',
      headline: "SJP reports Q1 2026 net inflows of £2.8bn — adviser confidence improving",
      relevance: 'Strong platform flows suggest continued demand for Meridian funds.',
    },
    {
      source: 'Reuters',
      date: '2026-03-10',
      headline: "St. James's Place appoints new regional director for South East",
      relevance: 'New regional director needs introduction. Relationship building opportunity.',
    },
    {
      source: 'Morningstar',
      date: '2026-02-28',
      headline: 'UK Balanced funds attract £1.2bn in February — highest monthly inflow since 2023',
      relevance: 'Sector tailwinds supporting UK Balanced Fund on SJP platform.',
    },
    {
      source: 'Bloomberg',
      date: '2026-02-05',
      headline: "SJP fund review retains all existing third-party managers for 2026",
      relevance: 'Meridian funds retained on approved list. No immediate risk.',
    },
  ],
  'client-5': [
    // Wellcome Trust
    {
      source: 'FT',
      date: '2026-03-22',
      headline: 'Wellcome Trust announces £16bn commitment to biomedical research over 5 years',
      relevance: 'Large commitment may require portfolio rebalancing. Potential mandate changes.',
    },
    {
      source: 'LinkedIn',
      date: '2026-03-05',
      headline: 'Wellcome Trust investment team adds ESG analytics specialist',
      relevance: 'Increased ESG scrutiny of managers expected. Meridian ESG reporting critical.',
    },
    {
      source: 'Bloomberg',
      date: '2026-02-18',
      headline: 'Absolute return fund category sees worst start to year since 2020',
      relevance: 'Category headwinds may draw attention to Absolute Return underperformance.',
    },
    {
      source: 'Reuters',
      date: '2026-01-22',
      headline: 'UK endowments increase focus on climate-aligned investment strategies',
      relevance: 'ESG integration trend aligns with Wellcome priorities. Positive for Meridian.',
    },
    {
      source: 'Morningstar',
      date: '2026-01-08',
      headline: 'Strategic Bond funds attract institutional inflows as rate expectations shift',
      relevance: 'Positive backdrop for Meridian Strategic Bond Fund held by Wellcome.',
    },
  ],
  'client-6': [
    // Phoenix Group Insurance
    {
      source: 'LinkedIn',
      date: '2026-02-16',
      headline: 'New CIO Marcus Thompson joins from Legal & General',
      relevance: 'New CIO likely to review all external manager relationships.',
    },
    {
      source: 'FT',
      date: '2026-03-09',
      headline: 'Phoenix Group announces strategic review of external managers',
      relevance: 'Formal review announced. Meridian mandate at risk.',
    },
    {
      source: 'Insurance Times',
      date: '2026-02-23',
      headline: 'Phoenix life fund consolidation project enters Phase 2',
      relevance: 'Consolidation may reduce number of external mandates.',
    },
    {
      source: 'Bloomberg',
      date: '2026-02-08',
      headline: 'Phoenix Group H2 results: operating profit up 8%',
      relevance: 'Strong results but strategic focus shifting to cost optimisation.',
    },
  ],
  'client-7': [
    // Rathbones Group
    {
      source: 'FT',
      date: '2026-03-20',
      headline: 'Rathbones reports record DFM inflows in Q1 2026',
      relevance: 'Strong Rathbones inflows suggest increasing allocation to approved managers.',
    },
    {
      source: 'Morningstar',
      date: '2026-03-08',
      headline: 'UK equity income funds see renewed interest amid dividend growth',
      relevance: 'Sector tailwinds support UK Balanced Fund positioning with Rathbones.',
    },
    {
      source: 'Bloomberg',
      date: '2026-02-25',
      headline: 'Rathbones Group completes Investec W&I integration ahead of schedule',
      relevance: 'Successful integration increases DFM capacity. Potential for larger allocations.',
    },
    {
      source: 'LinkedIn',
      date: '2026-02-12',
      headline: 'Rathbones fund selection team expands with two senior hires',
      relevance: 'Expanded team may review and potentially increase external manager allocations.',
    },
  ],
  'client-8': [
    // West Midlands Pension Fund
    {
      source: 'LGPS Tracker',
      date: '2026-03-28',
      headline: 'West Midlands LGPS pool announces review of multi-asset allocations',
      relevance: 'Direct threat to Meridian mandate. Pool-level review may replace individual mandates.',
    },
    {
      source: 'Reuters',
      date: '2026-03-15',
      headline: 'LGPS pooling accelerates — Central pool expands mandate scope',
      relevance: 'Broader pooling trend affecting all LGPS clients including West Midlands.',
    },
    {
      source: 'FT',
      date: '2026-02-20',
      headline: 'West Midlands Pension Fund increases responsible investment commitments',
      relevance: 'ESG focus growing. Meridian ESG positioning may need enhancement.',
    },
    {
      source: 'Companies House',
      date: '2026-01-25',
      headline: 'West Midlands Pension Fund annual report shows 3.8% return — below 5.2% target',
      relevance: 'Below-target returns increase pressure on external managers.',
    },
    {
      source: 'LinkedIn',
      date: '2026-01-10',
      headline: 'West Midlands pension committee appoints new independent adviser',
      relevance: 'New adviser may prompt fresh review of manager performance.',
    },
  ],
  'client-9': [
    // Caledonian Family Office
    {
      source: 'LinkedIn',
      date: '2026-03-20',
      headline: 'Alistair McLeod speaks at Scottish Family Office Forum on wealth preservation',
      relevance: 'McLeod publicly advocates conservative approach — aligned with Meridian strategy.',
    },
    {
      source: 'FT',
      date: '2026-03-05',
      headline: 'UK family offices increase allocation to income-generating strategies',
      relevance: 'Sector trend supports Meridian Diversified Income Fund positioning.',
    },
    {
      source: 'Reuters',
      date: '2026-02-15',
      headline: 'Scottish family offices report increased interest in next-generation wealth planning',
      relevance: 'Aligns with McLeod family intergenerational planning discussions.',
    },
    {
      source: 'Bloomberg',
      date: '2026-01-28',
      headline: 'UK family office AUM grows 12% in 2025 driven by investment returns',
      relevance: 'Growing family office market supports Meridian referral pipeline from McLeod.',
    },
  ],
  'client-10': [
    // Hargreaves Lansdown
    {
      source: 'FT',
      date: '2026-03-25',
      headline: 'Hargreaves Lansdown reports platform AUM reaches £155bn — record high',
      relevance: 'Growing platform AUM increases distribution potential for listed funds.',
    },
    {
      source: 'Morningstar',
      date: '2026-03-12',
      headline: 'Meridian UK Balanced Fund receives Trustnet rating upgrade to 5 crowns',
      relevance: 'Rating upgrade should drive increased retail flows on HL platform.',
    },
    {
      source: 'Reuters',
      date: '2026-02-28',
      headline: 'UK retail investors shift to balanced and income funds amid rate uncertainty',
      relevance: 'Retail demand trends favour Meridian fund range on HL platform.',
    },
    {
      source: 'Bloomberg',
      date: '2026-02-10',
      headline: 'HL Wealth 50 list annual review confirms all existing fund selections',
      relevance: 'Both Meridian funds retained on Wealth 50. Strong endorsement.',
    },
    {
      source: 'LinkedIn',
      date: '2026-01-20',
      headline: 'Hargreaves Lansdown expands fund research team with three analyst hires',
      relevance: 'Expanded research team may increase coverage depth of Meridian funds.',
    },
  ],
  'client-11': [
    // Church of England Pensions Board
    {
      source: 'FT',
      date: '2026-03-18',
      headline: 'Church of England Pensions Board publishes updated ethical investment policy',
      relevance: 'Updated policy may introduce additional screening requirements.',
    },
    {
      source: 'Reuters',
      date: '2026-03-01',
      headline: 'UK faith-based pension funds increase climate engagement targets',
      relevance: 'Climate engagement becoming more important in manager assessment.',
    },
    {
      source: 'Bloomberg',
      date: '2026-02-14',
      headline: 'Absolute return funds underperform in Q4 2025 — sector-wide trend',
      relevance: 'Sector-wide underperformance provides context for CoE Absolute Return results.',
    },
    {
      source: 'LinkedIn',
      date: '2026-01-30',
      headline: 'CoE Pensions Board trustee meeting minutes published — manager review planned Q3',
      relevance: 'Q3 manager review could affect Meridian mandate if performance does not improve.',
    },
    {
      source: 'Morningstar',
      date: '2026-01-15',
      headline: 'Strategic Bond funds with ethical screens see growing institutional demand',
      relevance: 'Positive trend for Meridian Strategic Bond Fund with CoE ethical alignment.',
    },
  ],
  'client-12': [
    // Scottish Widows Investment Partnership
    {
      source: 'FT',
      date: '2026-03-22',
      headline: 'Scottish Widows parent Lloyds Banking Group reviews asset management strategy',
      relevance: 'Strategic review at parent level may affect Scottish Widows manager selection.',
    },
    {
      source: 'Bloomberg',
      date: '2026-03-05',
      headline: 'Insurance multi-asset mandates see increased churn as Solvency II reviewed',
      relevance: 'Regulatory review may change investment parameters for insurance mandates.',
    },
    {
      source: 'Reuters',
      date: '2026-02-18',
      headline: 'Scottish Widows reports £2.1bn net inflows in H2 2025',
      relevance: 'Strong inflows may increase mandate sizes if performance improves.',
    },
    {
      source: 'LinkedIn',
      date: '2026-02-01',
      headline: 'Scottish Widows investment team restructure — new head of external managers appointed',
      relevance: 'New head of external managers will conduct baseline reviews of all relationships.',
    },
    {
      source: 'Insurance Times',
      date: '2026-01-15',
      headline: 'Scottish Widows targets £50bn in insurance assets by 2027',
      relevance: 'Growth targets may create mandate expansion opportunities if performance meets targets.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

/**
 * Calculate the number of days between two dates.
 */
function daysBetween(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return Math.abs(Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)));
}

/**
 * Calculate a composite priority score for a client.
 * Higher score = higher priority / more urgent attention needed.
 *
 * Formula: (riskScore * 0.4) + (daysSinceContact * 0.35) + (renewalProximity * 0.25)
 *
 * renewalProximity: mandate renewal within 90 days scores higher (scaled 0-100).
 */
export function getPriorityScore(client: Client): number {
  const today = '2026-03-30';
  const daysSinceContact = daysBetween(client.lastContactDate, today);

  let renewalProximity = 0;
  if (client.mandateRenewalDate) {
    const daysUntilRenewal = daysBetween(today, client.mandateRenewalDate);
    if (daysUntilRenewal <= 90) {
      // Scale: 0 days away = 100, 90 days away = 0
      renewalProximity = Math.max(0, 100 - (daysUntilRenewal / 90) * 100);
    }
  }

  return client.riskScore * 0.4 + daysSinceContact * 0.35 + renewalProximity * 0.25;
}

/**
 * Return top N priority clients sorted by composite score (descending).
 */
export function getTopPriorityClients(count: number): Client[] {
  return [...clients]
    .sort((a, b) => getPriorityScore(b) - getPriorityScore(a))
    .slice(0, count);
}

/**
 * Calculate revenue at risk: sum AUM of clients with riskScore > 65, multiply by 0.0042.
 */
export function getRevenueAtRisk(): number {
  const atRiskAUM = clients
    .filter((c) => c.riskScore > 65)
    .reduce((sum, c) => sum + c.aum, 0);
  return Math.round(atRiskAUM * 0.0042 * 100) / 100;
}

/**
 * Return clients with >45 days since last contact and declining engagement trend.
 */
export function getSilentAccounts(): Client[] {
  const today = '2026-03-30';
  return clients.filter((c) => {
    const daysSinceContact = daysBetween(c.lastContactDate, today);
    return daysSinceContact > 45 && c.engagementTrend === 'declining';
  });
}
