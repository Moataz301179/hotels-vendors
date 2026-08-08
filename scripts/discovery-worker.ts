/**
 * Autonomous Discovery Worker — invoked on cron (schedule: every 6h).
 * Dispatches an Apify run, fetches results, ingests discovered suppliers
 * as REAL leads. Logs telemetry for the dashboard.
 *
 * Run: npx tsx scripts/discovery-worker.ts
 * Env: APIFY_API_TOKEN (server-side), DISCOVERY_TENANT_ID
 */

import { PrismaClient } from "@prisma/client";
import { runDiscoveryActor, fetchDiscoveryResults, ingestDiscoveredSuppliers } from "@/lib/sourcing/apify";

const prisma = new PrismaClient();

async function main() {
  const startedAt = Date.now();
  console.log(`[discovery] ${new Date().toISOString()} starting autonomous sourcing run`);

  if (!process.env.APIFY_API_TOKEN) {
    console.log("[discovery] APIFY_API_TOKEN not set — no-op. Engine ready; set env to enable.");
    return;
  }

  const tenant = await prisma.tenant.findFirst();
  if (!tenant) { console.log("[discovery] no tenant — abort"); return; }

  // 1. dispatch
  const { runId, started } = await runDiscoveryActor();
  if (!started || !runId) { console.log("[discovery] dispatch failed"); return; }
  console.log(`[discovery] run dispatched: ${runId}`);

  // 2. wait for completion (bounded poll — production uses Apify webhooks)
  await new Promise((r) => setTimeout(r, 20_000));

  // 3. fetch + ingest
  const suppliers = await fetchDiscoveryResults(runId);
  const res = await ingestDiscoveredSuppliers(suppliers, tenant.id);
  const elapsedMs = Date.now() - startedAt;

  // 4. telemetry
  await prisma.auditLog.create({
    data: {
      tenantId: tenant.id, entityId: "apify:discovery", actorId: "system",
      actionType: "CREATE",
      changes: { runId, discovered: res.total, created: res.created, skipped: res.skipped, elapsedMs },
    },
  });

  console.log(`[discovery] done: ${res.created} new suppliers (${res.total} fetched) in ${(elapsedMs / 1000).toFixed(1)}s`);
}

main().then(() => prisma.$disconnect()).catch((e) => { console.error(e); process.exit(1); });
