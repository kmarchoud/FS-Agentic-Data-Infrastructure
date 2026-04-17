export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { SynthesisRequest, SynthesisResponse, MarketDataPoint } from "@/lib/data/morning-brief-types";

function formatMarketData(md: SynthesisRequest["marketData"]): string {
  const lines: string[] = [];
  const fmt = (label: string, pt: MarketDataPoint | null) => {
    if (!pt) return `${label}: unavailable`;
    const sign = pt.delta >= 0 ? "+" : "";
    return `${label}: ${pt.value.toFixed(2)} (${sign}${pt.delta.toFixed(2)}, ${sign}${pt.deltaPercent.toFixed(1)}%)`;
  };
  lines.push(fmt("FTSE All Share", md.ftseAllShare));
  lines.push(fmt("10yr Gilt Yield", md.giltYield));
  lines.push(fmt("Sterling/USD", md.sterling));
  lines.push(fmt("UK Volatility (VFTSE)", md.volatility));
  return lines.join("\n");
}

export async function POST(req: Request) {
  try {
    const body: SynthesisRequest = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(fallbackResponse("No API key configured"), { status: 200 });
    }

    const client = new Anthropic({ apiKey });

    const newsSection = body.newsArticles
      .slice(0, 5)
      .map((a, i) => `${i + 1}. ${a.title} · ${a.source} · ${a.publishedAt} · ${a.description}`)
      .join("\n");

    const flowSection = body.sectorFlows
      .map((f) => `${f.sector}: ${f.net_retail_sales_gbpm >= 0 ? "+" : ""}£${f.net_retail_sales_gbpm}m (${f.month})`)
      .join("\n");

    const fundSection = body.funds
      .map((f) => `${f.fund_name} · ${f.ia_sector} · ${f.mandate_category}`)
      .join("\n");

    const userPrompt = `Generate a morning distribution brief from this data.

MARKET DATA:
${formatMarketData(body.marketData)}

TOP NEWS SIGNALS (most recent first):
${newsSection}

IA SECTOR FLOWS (most recent month available):
${flowSection}

FUND RANGE:
${fundSection}

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
- mandate_category values must exactly match one of: multi_asset_cautious, multi_asset_balanced, multi_asset_growth, multi_asset_aggressive, multi_asset_income, uk_equity_income, uk_equity, global_equity, european_equity, north_american_equity, corporate_bond, global_macro_bond, money_market`;

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: "You are a distribution intelligence analyst for a UK asset manager selling OEICs and unit trusts through the IFA channel. You write concise, specific, actionable morning intelligence for distribution teams. Every sentence must contain a specific data point — a number, a fund type, a named market event, or a named sector. Never write generic statements. Write as a knowledgeable colleague, not a marketing document. Respond ONLY with valid JSON — no markdown, no code blocks, no preamble.",
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      return NextResponse.json(fallbackResponse("No text in response"));
    }

    // Extract JSON from response (handle potential markdown code blocks)
    let jsonStr = textBlock.text.trim();
    if (jsonStr.startsWith("```")) {
      jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
    }

    // Check for truncated response (stop_reason !== "end_turn")
    if (message.stop_reason !== "end_turn") {
      console.error("Claude response truncated, stop_reason:", message.stop_reason);
      return NextResponse.json(fallbackResponse("Response truncated"));
    }

    const parsed: SynthesisResponse = JSON.parse(jsonStr);
    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Morning synthesis error:", err);
    return NextResponse.json(fallbackResponse("Synthesis failed"));
  }
}

function fallbackResponse(reason: string): SynthesisResponse {
  return {
    synthesis_sentence: "Market data unavailable — showing intelligence based on recent signals.",
    impact_cards: [],
    talking_point: "Synthesis currently unavailable. Please refresh to retry.",
    error: true,
  };
}
