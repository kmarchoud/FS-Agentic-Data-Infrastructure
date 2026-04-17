import { promises as fs } from "fs";
import path from "path";
import { TopBar } from "@/components/dashboard/topbar";
import { MorningBriefClient } from "@/components/morning-brief/MorningBriefClient";
import { realIFARankings } from "@/lib/data/ifa-real-data";
import type { SectorFlow, FundData } from "@/lib/data/morning-brief-types";

async function loadStaticData() {
  const dataDir = path.join(process.cwd(), "src/lib/data/raw");

  // Load sector flows CSV
  const flowsCsv = await fs.readFile(path.join(dataDir, "ia_sector_flows.csv"), "utf-8");
  const flowLines = flowsCsv.trim().split("\n").slice(1); // skip header
  const sectorFlows: SectorFlow[] = flowLines.map((line) => {
    const [month, sector, net] = line.split(",");
    return {
      month: month.trim(),
      sector: sector.trim(),
      net_retail_sales_gbpm: parseFloat(net.trim()),
    };
  });

  // Load funds JSON
  const fundsRaw = await fs.readFile(
    path.join(dataDir, "keyridge_funds_clean.json"),
    "utf-8"
  );
  const fundsAll = JSON.parse(fundsRaw) as Array<Record<string, unknown>>;
  const funds: FundData[] = fundsAll.map((f) => ({
    fund_name: String(f.fund_name || ""),
    ia_sector: String(f.ia_sector || ""),
    mandate_category: String(f.mandate_category || ""),
    dynamic_planner_profile: typeof f.dynamic_planner_profile === "number" ? f.dynamic_planner_profile : null,
  }));

  // Load briefs JSON
  const briefsRaw = await fs.readFile(
    path.join(dataDir, "keyridge_briefs.json"),
    "utf-8"
  );
  const briefs = JSON.parse(briefsRaw) as Array<Record<string, unknown>>;

  return {
    sectorFlows,
    funds,
    rankedFirms: realIFARankings,
    briefs: briefs as Array<{
      firm_name: string;
      brief_who: string;
      brief_why: string;
      brief_opener: string;
      top_mandate: string;
      [key: string]: unknown;
    }>,
  };
}

export default async function MorningBriefPage() {
  const staticData = await loadStaticData();

  return (
    <>
      <TopBar title="Morning Brief" />
      <MorningBriefClient staticData={staticData} />
    </>
  );
}
