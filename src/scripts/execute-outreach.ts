/**
 * Hotels Vendors — Automated Outbound Communication Pipeline
 *
 * Reads verified executive leads from /data/verified_executive_leads.json
 * and dispatches sector-specific B2B communication via Resend API.
 *
 * Features:
 * - Sector-aware templates (HOTEL vs FINANCIAL)
 * - Randomized send intervals (30–120s) to protect sender reputation
 * - Local execution log with Queued → Dispatched → Failed status tracking
 * - Zero liability disclaimer appended to every outbound payload
 *
 * Usage:
 *   npx tsx src/scripts/execute-outreach.ts [--dry-run] [--sector=HOTEL|FINANCIAL]
 *
 * Environment:
 *   RESEND_API_KEY    — Resend API key (required unless --dry-run)
 *   RESEND_FROM       — Sender email (default: outreach@hotelsvendors.com)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Resend } from "resend";

// ─── Configuration ────────────────────────────────────────────────

const LEADS_FILE = join(process.cwd(), "data/verified_executive_leads.json");
const LOG_FILE = join(process.cwd(), "data/outreach_execution_log.json");
const FROM_EMAIL = process.env.RESEND_FROM || "outreach@hotelsvendors.com";
const RESEND_API_KEY = process.env.RESEND_API_KEY || "";

// Random interval between sends (ms): 30s–120s
const MIN_INTERVAL_MS = 30_000;
const MAX_INTERVAL_MS = 120_000;

const CORPORATE_DISCLAIMER =
  "This communication is sent by Restaurants for E-Marketing, operating strictly as a technical data orchestrator. Restaurants for E-Marketing carries zero liability for counterparty collection defaults, logistics execution, or financial settlement between transacting parties.";

// ─── Types ────────────────────────────────────────────────────────

interface Lead {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  sector: "HOTEL" | "FINANCIAL";
  phone?: string;
  city?: string;
  governorate?: string;
  starRating?: number;
  roomCount?: number;
  source?: string;
  verified: boolean;
  status: string;
}

interface LeadsFile {
  metadata: { generatedAt: string; version: string; description: string };
  leads: Lead[];
}

interface LogEntry {
  leadId: string;
  email: string;
  sector: string;
  status: "Queued" | "Dispatched" | "Failed";
  timestamp: string;
  messageId?: string;
  error?: string;
}

interface ExecutionLog {
  executionId: string;
  startedAt: string;
  completedAt?: string;
  dryRun: boolean;
  totalLeads: number;
  dispatched: number;
  failed: number;
  skipped: number;
  entries: LogEntry[];
}

// ─── Templates ────────────────────────────────────────────────────

function buildHotelTemplate(lead: Lead): { subject: string; html: string } {
  const subject = `${lead.name.split(" ")[0]}, your procurement desk is leaking working capital — we can prove it in 14 days`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 32px 24px;">

  <div style="border-top: 3px solid #84cc16; margin-bottom: 24px;"></div>

  <p style="font-size: 15px; line-height: 1.6; color: #333;">
    Dear ${lead.name},
  </p>

  <p style="font-size: 15px; line-height: 1.6; color: #333;">
    You are currently managing procurement across ${lead.roomCount || "multiple"} rooms at ${lead.company} — coordinating suppliers, chasing invoices, and reconciling ETA submissions manually. Every day this continues, your working capital bleeds.
  </p>

  <p style="font-size: 15px; line-height: 1.6; color: #333; font-weight: 600;">
    HotelsVendors eliminates the leakage:
  </p>

  <ul style="font-size: 14px; line-height: 1.8; color: #444; padding-left: 20px;">
    <li><strong>Bank-direct IBAN settlement</strong> — Suppliers paid in 24 hours. You retain Net-60+ terms. No intermediary accounts. No manual wire approvals.</li>
    <li><strong>90-day credit lines</strong> — Pre-negotiated, off-balance-sheet facilities through our licensed factoring partners. Zero corporate debt.</li>
    <li><strong>Real-time ETA reconciliation</strong> — Cryptographic UUID validation fires the millisecond goods arrive. Automated three-way match (PO + ETA UUID + Signed Digital GRN). Zero tax exposure.</li>
    <li><strong>AI demand forecasting</strong> — 14-day forward predictions from occupancy curves, events, and seasonality. Auto-generated POs with pre-occurrence budget blockades.</li>
  </ul>

  <p style="font-size: 15px; line-height: 1.6; color: #333;">
    We are currently onboarding a limited cohort of coastal resort groups for Q3 2026. I would welcome 20 minutes to demonstrate the settlement architecture specific to ${lead.company}.
  </p>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://hotelsvendors.com/register?sector=hotel&ref=outreach" style="background: #84cc16; color: #000; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; display: inline-block;">Schedule Institutional Onboarding</a>
  </div>

  <p style="font-size: 13px; line-height: 1.6; color: #666;">
    Regards,<br>
    <strong>HotelsVendors Institutional Team</strong><br>
    Egypt's B2B Hospitality Procurement Infrastructure
  </p>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
  <p style="font-size: 10px; line-height: 1.5; color: #999;">
    ${CORPORATE_DISCLAIMER}
  </p>

</body>
</html>`;

  return { subject, html };
}

function buildFinancialTemplate(lead: Lead): { subject: string; html: string } {
  const subject = `${lead.name.split(" ")[0]}, a new asset class: pre-cleared hospitality receivables with ETA cryptographic verification`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; max-width: 600px; margin: 0 auto; padding: 32px 24px;">

  <div style="border-top: 3px solid #3B82F6; margin-bottom: 24px;"></div>

  <p style="font-size: 15px; line-height: 1.6; color: #333;">
    Dear ${lead.name},
  </p>

  <p style="font-size: 15px; line-height: 1.6; color: #333;">
    The Egyptian hospitality sector processes an estimated EGP 42 billion in annual procurement — yet the receivables backing these transactions remain largely unverified, manually reconciled, and exposed to tax authority rejection.
  </p>

  <p style="font-size: 15px; line-height: 1.6; color: #333; font-weight: 600;">
    HotelsVendors operates a Zero-Exposure Regulatory Shield:
  </p>

  <ul style="font-size: 14px; line-height: 1.8; color: #444; padding-left: 20px;">
    <li><strong>FRA-compliant three-way match</strong> — Every invoice cryptographically validated: PO + ETA UUID + Signed Digital GRN. No manual reconciliation. No rejected submissions.</li>
    <li><strong>Pre-cleared corporate deal flow</strong> — Not unverified SME paper. Every asset passes tenant validation, ETA cryptographic UUID verification, and automated three-way matching before entering your bidding pool.</li>
    <li><strong>SHA-256 audit trail</strong> — Immutable cryptographic hash chain on every transaction state transition. Full regulatory defensibility.</li>
    <li><strong>Non-recourse, bank-direct IBAN settlement</strong> — Capital routes programmatically from your desk to supplier IBANs. No intermediary accounts. Automated interest accrual and reconciliation.</li>
    <li><strong>AI-driven risk scoring</strong> — Hotel creditworthiness, repayment velocity, and sector concentration analyzed in real-time before asset admission.</li>
  </ul>

  <p style="font-size: 15px; line-height: 1.6; color: #333;">
    We are structuring a Q3 2026 factoring facility specifically for hospitality receivables. I would value 20 minutes to walk through the data orchestration architecture and risk parameters.
  </p>

  <div style="text-align: center; margin: 28px 0;">
    <a href="https://hotelsvendors.com/register?sector=fintech&ref=outreach" style="background: #3B82F6; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; display: inline-block;">Schedule Integration Audit</a>
  </div>

  <p style="font-size: 13px; line-height: 1.6; color: #666;">
    Regards,<br>
    <strong>HotelsVendors Institutional Partnerships</strong><br>
    Egypt's B2B Hospitality Data Orchestration Layer
  </p>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 24px 0;">
  <p style="font-size: 10px; line-height: 1.5; color: #999;">
    ${CORPORATE_DISCLAIMER}
  </p>

</body>
</html>`;

  return { subject, html };
}

// ─── Helpers ───────────────────────────────────────────────────────

function randomInterval(): number {
  return Math.floor(Math.random() * (MAX_INTERVAL_MS - MIN_INTERVAL_MS + 1)) + MIN_INTERVAL_MS;
}

function loadExecutionLog(): ExecutionLog {
  if (existsSync(LOG_FILE)) {
    return JSON.parse(readFileSync(LOG_FILE, "utf-8")) as ExecutionLog;
  }
  return {
    executionId: `exec_${Date.now()}`,
    startedAt: new Date().toISOString(),
    dryRun: false,
    totalLeads: 0,
    dispatched: 0,
    failed: 0,
    skipped: 0,
    entries: [],
  };
}

function saveExecutionLog(log: ExecutionLog): void {
  writeFileSync(LOG_FILE, JSON.stringify(log, null, 2));
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Main Execution ───────────────────────────────────────────────

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const isDryRun = args.includes("--dry-run");
  const sectorFilter = args.find((a) => a.startsWith("--sector="))?.split("=")[1]?.toUpperCase();

  console.log("═══════════════════════════════════════════════════");
  console.log("  Hotels Vendors — Outbound Communication Pipeline");
  console.log("═══════════════════════════════════════════════════");
  console.log(`  Mode: ${isDryRun ? "DRY RUN (no emails sent)" : "LIVE"}`);
  console.log(`  Sector filter: ${sectorFilter || "ALL"}`);
  console.log("───────────────────────────────────────────────────");

  // Load leads
  const leadsData: LeadsFile = JSON.parse(readFileSync(LEADS_FILE, "utf-8"));
  let leads = leadsData.leads.filter((l) => l.verified && l.status === "new");

  if (sectorFilter) {
    leads = leads.filter((l) => l.sector === sectorFilter);
  }

  console.log(`  Leads loaded: ${leads.length}`);
  console.log("───────────────────────────────────────────────────\n");

  if (leads.length === 0) {
    console.log("  No eligible leads found. Exiting.");
    return;
  }

  // Initialize Resend client
  const resend = isDryRun ? null : new Resend(RESEND_API_KEY);

  // Initialize execution log
  const log: ExecutionLog = {
    executionId: `exec_${Date.now()}`,
    startedAt: new Date().toISOString(),
    dryRun: isDryRun,
    totalLeads: leads.length,
    dispatched: 0,
    failed: 0,
    skipped: 0,
    entries: [],
  };

  // Process each lead
  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];
    const entry: LogEntry = {
      leadId: lead.id,
      email: lead.email,
      sector: lead.sector,
      status: "Queued",
      timestamp: new Date().toISOString(),
    };

    console.log(`  [${i + 1}/${leads.length}] Processing: ${lead.name} (${lead.company}) [${lead.sector}]`);

    try {
      // Build sector-specific template
      const template = lead.sector === "HOTEL" ? buildHotelTemplate(lead) : buildFinancialTemplate(lead);

      if (isDryRun) {
        console.log(`    ↳ DRY RUN — would send to ${lead.email}`);
        console.log(`    ↳ Subject: ${template.subject}`);
        entry.status = "Dispatched";
        log.dispatched++;
      } else {
        // Send via Resend
        const result = await resend!.emails.send({
          from: FROM_EMAIL,
          to: lead.email,
          subject: template.subject,
          html: template.html,
        });

        if (result.data?.id) {
          entry.status = "Dispatched";
          entry.messageId = result.data.id;
          log.dispatched++;
          console.log(`    ↳ Dispatched — messageId: ${result.data.id}`);
        } else {
          throw new Error("No message ID returned from Resend");
        }
      }
    } catch (err) {
      entry.status = "Failed";
      entry.error = err instanceof Error ? err.message : String(err);
      log.failed++;
      console.log(`    ↳ FAILED — ${entry.error}`);
    }

    log.entries.push(entry);

    // Stagger subsequent sends (skip delay after last lead)
    if (i < leads.length - 1 && !isDryRun) {
      const delay = randomInterval();
      console.log(`    ↳ Next send in ${(delay / 1000).toFixed(0)}s...`);
      await sleep(delay);
    }
  }

  // Finalize log
  log.completedAt = new Date().toISOString();
  saveExecutionLog(log);

  console.log("\n───────────────────────────────────────────────────");
  console.log("  Execution Complete");
  console.log("───────────────────────────────────────────────────");
  console.log(`  Total leads:  ${log.totalLeads}`);
  console.log(`  Dispatched:   ${log.dispatched}`);
  console.log(`  Failed:       ${log.failed}`);
  console.log(`  Log saved:    ${LOG_FILE}`);
  console.log("═══════════════════════════════════════════════════\n");
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
