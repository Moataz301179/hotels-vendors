/**
 * Oliv Outreach CLI — Phase 1 supplier referral email automation.
 *
 * Usage:
 *   npx tsx scripts/oliv-outreach.ts --dry-run     # Preview without sending
 *   npx tsx scripts/oliv-outreach.ts --send         # Actually send emails
 *   npx tsx scripts/oliv-outreach.ts --stats        # Show eligibility breakdown
 *
 * Reads the master supplier registry, filters by Oliv criteria,
 * and sends personalized referral emails with code "CHV000".
 */

import { runOlivOutreach, OLIV_REFERRAL_CODE, OLIV_REGISTER_URL, filterEligibleSuppliers, OLIV_ELIGIBILITY } from "@/lib/referral/outreach";
import { getAllSuppliers } from "@/lib/marketplace/real-suppliers";

const args = process.argv.slice(2);
const dryRun = !args.includes("--send");
const statsOnly = args.includes("--stats");

async function main() {
  console.log("┌─────────────────────────────────────────────┐");
  console.log("│  HotelsVendors × Oliv — Outreach Automation  │");
  console.log("│  Phase 1: Email handoff, no technical loop   │");
  console.log("└─────────────────────────────────────────────┘\n");

  const allSuppliers = getAllSuppliers();
  console.log(`📋 Total suppliers in registry: ${allSuppliers.length}\n`);

  // Show eligibility criteria
  console.log("🎯 Oliv Eligibility Criteria:");
  console.log(`   Min monthly capacity: EGP ${OLIV_ELIGIBILITY.minMonthlyCapacityEgp.toLocaleString()}`);
  console.log(`   Min years operating:  ${OLIV_ELIGIBILITY.minYearsOperating}`);
  console.log(`   Tax ID required:      ${OLIV_ELIGIBILITY.requiresTaxId ? "Yes" : "No"}`);
  console.log(`   Target categories:    ${OLIV_ELIGIBILITY.targetCategories.length} verticals`);
  console.log("");

  // Filter
  const { eligible, ineligible } = filterEligibleSuppliers(allSuppliers);
  console.log(`✅ Eligible suppliers:   ${eligible.length}`);
  console.log(`❌ Ineligible suppliers: ${ineligible.length}`);
  console.log("");

  if (statsOnly) {
    // Show breakdown
    if (ineligible.length > 0) {
      console.log("Ineligible breakdown:");
      for (const { supplier, reasons } of ineligible.slice(0, 20)) {
        console.log(`  ${supplier.name} — ${reasons.join("; ")}`);
      }
      if (ineligible.length > 20) {
        console.log(`  ... and ${ineligible.length - 20} more`);
      }
      console.log("");
    }

    console.log("Eligible suppliers:");
    for (const s of eligible.slice(0, 20)) {
      console.log(`  ${s.name} (${s.category}) — EGP ${s.monthlyCapacityEgp.toLocaleString()}/month — Tax ID: ${s.taxId || "NONE"}`);
    }
    if (eligible.length > 20) {
      console.log(`  ... and ${eligible.length - 20} more`);
    }
    console.log("");
    return;
  }

  if (dryRun) {
    console.log("🔍 DRY RUN MODE — no emails will be sent. Use --send to actually send.\n");
  } else {
    console.log("📨 SEND MODE — emails WILL be sent. Press Ctrl+C within 5s to abort.\n");
    await new Promise((r) => setTimeout(r, 5000));
  }

  // Run outreach
  const { summary, results } = await runOlivOutreach({
    dryRun,
    onProgress: (result, index, total) => {
      const icon = result.emailSent ? "📨" : result.eligible ? "🔍" : "⏭️";
      const status = result.emailSent
        ? `SENT (${result.messageId?.slice(0, 8)}...)`
        : result.eligible
          ? "DRY RUN"
          : `SKIPPED: ${result.reason}`;
      console.log(`  [${index}/${total}] ${icon} ${result.supplier.name}: ${status}`);
    },
  });

  console.log("\n── Summary ──");
  console.log(`  Eligible:  ${summary.eligible}`);
  console.log(`  Sent:      ${summary.sent}`);
  console.log(`  Failed:    ${summary.failed}`);
  console.log(`  Skipped:   ${summary.skipped}`);
  console.log("");
  console.log(`📌 All referred suppliers should enter code: "${OLIV_REFERRAL_CODE}"`);
  console.log(`📌 Oliv registration: ${OLIV_REGISTER_URL}`);
  console.log("");
  console.log("✅ Outreach complete.");
}

main().catch((err) => {
  console.error("Outreach failed:", err);
  process.exit(1);
});