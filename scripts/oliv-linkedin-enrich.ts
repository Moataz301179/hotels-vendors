/**
 * Oliv LinkedIn Decision-Maker Enrichment
 *
 * For the top-ranked eligible suppliers from the registry, finds CFOs,
 * Procurement Directors, and Finance Managers on LinkedIn via the Apify
 * LinkedIn Company Employees Scraper.
 *
 * Usage:
 *   npx tsx scripts/oliv-linkedin-enrich.ts --top 10
 *   npx tsx scripts/oliv-linkedin-enrich.ts --company "Juhayna Food Industries"
 *
 * Requires: APIFY_API_TOKEN environment variable or --token flag.
 *
 * Output: data/oliv-decision-makers.json
 */

import { filterEligibleSuppliers, OLIV_ELIGIBILITY } from "@/lib/referral/outreach";
import { getAllSuppliers } from "@/lib/marketplace/real-suppliers";

const APIFY_TOKEN = process.env.APIFY_API_TOKEN || process.argv.find((a) => a.startsWith("--token="))?.split("=")[1];

// Actor: LinkedIn Company Employees Scraper
const ACTOR_ID = "harvestapi/linkedin-company-employees";
const APIFY_BASE = "https://api.apify.com/v2";

// Job titles we're targeting for B2B outreach
const TARGET_TITLES = [
  "CFO",
  "Finance Director",
  "Procurement Manager",
  "VP Finance",
  "Head of Procurement",
  "Supply Chain Director",
  "Chief Financial Officer",
  "Finance Manager",
  "Director of Procurement",
  "مدير مالي",
  "مدير مشتريات",
  "المدير المالي",
];

interface DecisionMaker {
  supplierName: string;
  supplierTaxId: string;
  supplierCategory: string;
  monthlyRevenueEgp: number;
  contactName: string;
  contactTitle: string;
  linkedinUrl: string;
  email?: string;
}

interface ApifyRunResult {
  id: string;
  actId: string;
  status: string;
  startedAt: string;
  finishedAt?: string;
}

/**
 * Start an Apify actor run for a given LinkedIn company URL.
 */
async function startApifyRun(linkedinUrl: string): Promise<ApifyRunResult> {
  if (!APIFY_TOKEN) {
    throw new Error("APIFY_API_TOKEN not set. Pass --token=<your-token> or set APIFY_API_TOKEN env.");
  }

  const res = await fetch(`${APIFY_BASE}/acts/${ACTOR_ID}/runs`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${APIFY_TOKEN}`,
    },
    body: JSON.stringify({
      linkedinCompanyUrl: linkedinUrl,
      maxResults: 20,
      titleIncludes: TARGET_TITLES.join(","),
      minDelay: 3,
      maxDelay: 8,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Apify run start failed: ${res.status} ${err}`);
  }

  const run = (await res.json()) as { data: ApifyRunResult };
  return run.data;
}

/**
 * Poll for run completion and fetch results.
 */
async function waitForRun(runId: string, timeoutMs = 120_000): Promise<DecisionMaker[]> {
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${APIFY_BASE}/acts/${ACTOR_ID}/runs/${runId}`, {
      headers: { Authorization: `Bearer ${APIFY_TOKEN}` },
    });

    const run = (await res.json()) as { data: ApifyRunResult };
    if (run.data.status === "SUCCEEDED") {
      // Fetch dataset
      const datasetRes = await fetch(`${APIFY_BASE}/acts/${ACTOR_ID}/runs/${runId}/dataset/items`, {
        headers: { Authorization: `Bearer ${APIFY_TOKEN}` },
      });
      const items = (await datasetRes.json()) as any[];
      return items.map((item: any) => ({
        supplierName: "", // filled by caller
        supplierTaxId: "",
        supplierCategory: "",
        monthlyRevenueEgp: 0,
        contactName: item.name || item.fullName || "",
        contactTitle: item.title || item.headline || "",
        linkedinUrl: item.url || item.linkedinUrl || "",
        email: item.email || undefined,
      }));
    }

    if (run.data.status === "FAILED" || run.data.status === "ABORTED" || run.data.status === "TIMED-OUT") {
      throw new Error(`Apify run ${runId} ended with status: ${run.data.status}`);
    }

    // Still running — wait 5s then poll again
    await new Promise((r) => setTimeout(r, 5000));
  }

  throw new Error(`Apify run ${runId} timed out after ${timeoutMs}ms`);
}

/**
 * Find the LinkedIn company URL for a given company name.
 * Uses a simple Google dork via web search. In production, use a proper
 * LinkedIn API or manual lookup.
 */
function guessLinkedInUrl(companyName: string): string {
  // Common patterns for Egyptian companies
  const slug = companyName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  // Try company name directly
  return `https://www.linkedin.com/company/${slug}`;
}

async function main() {
  const args = process.argv.slice(2);
  const topN = parseInt(args.find((a) => a.startsWith("--top="))?.split("=")[1] || "10", 10);

  console.log("┌───────────────────────────────────────────────────┐");
  console.log("│  HotelsVendors — Oliv LinkedIn Enrichment          │");
  console.log("│  Actor: apify/harvestapi/linkedin-company-employees │");
  console.log("└───────────────────────────────────────────────────┘\n");

  // Get top eligible suppliers
  const allSuppliers = getAllSuppliers();
  const { eligible } = filterEligibleSuppliers(allSuppliers, OLIV_ELIGIBILITY);

  // Sort by monthly capacity (highest first)
  eligible.sort((a, b) => b.monthlyCapacityEgp - a.monthlyCapacityEgp);

  const targets = eligible.slice(0, topN);

  console.log(`📋 Top ${targets.length} eligible suppliers:\n`);
  targets.forEach((s, i) => {
    console.log(`  ${i + 1}. ${s.name} — EGP ${(s.monthlyCapacityEgp / 1_000_000).toFixed(1)}M/month — ${s.category}`);
  });

  if (!APIFY_TOKEN) {
    console.log("\n⚠️  APIFY_API_TOKEN not set. Dry run only — no LinkedIn data fetched.");
    console.log("   Set with: export APIFY_API_TOKEN=apify_api_... OR --token=<token>");
    console.log("   Get a free token at: https://console.apify.com\n");

    // Still output the target list for manual lookup
    const output = targets.map((s) => ({
      supplierName: s.name,
      supplierTaxId: s.taxId,
      supplierCategory: s.category,
      monthlyRevenueEgp: s.monthlyCapacityEgp,
      linkedinSearchUrl: `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(s.name)}`,
      suggestedLookup: guessLinkedInUrl(s.name),
      targetTitles: TARGET_TITLES,
    }));

    const fs = await import("fs/promises");
    await fs.writeFile("data/oliv-decision-makers.json", JSON.stringify(output, null, 2));
    console.log("📁 Saved target list to data/oliv-decision-makers.json (no LinkedIn data — dry run)");
    return;
  }

  console.log(`\n🔍 Enriching with LinkedIn data via Apify...\n`);

  const results: DecisionMaker[] = [];
  const fs = await import("fs/promises");

  for (const supplier of targets) {
    const linkedinUrl = guessLinkedInUrl(supplier.name);
    console.log(`  🔎 ${supplier.name} → ${linkedinUrl}`);

    try {
      const run = await startApifyRun(linkedinUrl);
      console.log(`     Run started: ${run.id}`);

      const contacts = await waitForRun(run.id);
      console.log(`     Found ${contacts.length} decision makers`);

      for (const c of contacts) {
        c.supplierName = supplier.name;
        c.supplierTaxId = supplier.taxId;
        c.supplierCategory = supplier.category;
        c.monthlyRevenueEgp = supplier.monthlyCapacityEgp;
      }

      results.push(...contacts);

      // Save incrementally
      await fs.writeFile("data/oliv-decision-makers.json", JSON.stringify(results, null, 2));
    } catch (err) {
      console.error(`     ❌ Failed: ${err instanceof Error ? err.message : "unknown"}`);
    }

    // Rate limit: Apify recommends 5-10s between runs
    await new Promise((r) => setTimeout(r, 5000));
  }

  console.log(`\n✅ Enrichment complete. ${results.length} decision makers found.`);
  console.log("📁 Saved to data/oliv-decision-makers.json");
}

main().catch((err) => {
  console.error("Enrichment failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});