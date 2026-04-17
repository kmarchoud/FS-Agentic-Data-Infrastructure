// Morning Brief TypeScript interfaces
// Spec: design-system/morning-brief-spec.md Section 11

export interface MarketDataPoint {
  value: number;
  previousClose: number;
  delta: number;
  deltaPercent: number;
  timestamp: string;
  sparklineData: Array<{ time: number; value: number }> | null;
}

export interface MarketDataResponse {
  ftseAllShare: MarketDataPoint | null;
  giltYield: MarketDataPoint | null;
  sterling: MarketDataPoint | null;
  volatility: MarketDataPoint | null;
  fetchedAt: string;
}

export interface NewsArticle {
  title: string;
  source: string;
  publishedAt: string;
  description: string;
  url: string;
}

export interface NewsResponse {
  articles: NewsArticle[];
  usingFallback: boolean;
  fetchedAt: string;
}

export interface SectorFlow {
  sector: string;
  net_retail_sales_gbpm: number;
  month: string;
}

export interface FundData {
  fund_name: string;
  ia_sector: string;
  mandate_category: string;
  dynamic_planner_profile: number | null;
}

export interface ImpactCard {
  mandate_category: string;
  fund_names: string[];
  ia_sector: string;
  sentiment: "positive" | "neutral" | "negative";
  what_happened: string;
  why_it_matters: string;
  talking_angle: string;
}

export interface SynthesisRequest {
  marketData: MarketDataResponse;
  newsArticles: NewsArticle[];
  sectorFlows: SectorFlow[];
  funds: FundData[];
}

export interface SynthesisResponse {
  synthesis_sentence: string;
  impact_cards: ImpactCard[];
  talking_point: string;
  error?: boolean;
}

export interface MorningBriefPageData {
  marketData: MarketDataResponse | null;
  news: NewsResponse | null;
  synthesis: SynthesisResponse | null;
  sectorFlows: SectorFlow[];
  funds: FundData[];
  loadingPhase: "market" | "news" | "synthesis" | "complete" | "error";
  lastRefreshed: string | null;
}
