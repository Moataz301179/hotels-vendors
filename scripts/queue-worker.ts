/**
 * Sourcing Queue Worker — processes BullMQ jobs:
 *   - scrape           → run a portal scraper, upsert SUPPLIER_SYNC products
 *   - catalog-sync     → persisted via webhook (payload processed by API); worker ack
 *   - aggregator-checkout → dispatch supplier POs + stock locks
 *   - apify-discovery  → run autonomous Apify sourcing
 *
 * Run: npx tsx scripts/queue-worker.ts
 * Env: REDIS_URL / REDIS_HOST + REDIS_PORT (+ APIFY_API_TOKEN for discovery)
 */

import { Worker, Job } from "bullmq";
import { SourceJobData } from "@/lib/queue";

const REDIS_URL = process.env.REDIS_URL;
if (!REDIS_URL && !process.env.REDIS_HOST) {
  console.log("[queue] Redis not configured — worker not started (graceful no-op).");
  process.exit(0);
}

const connection = {
  host: (REDIS_URL ? new URL(REDIS_URL).hostname : process.env.REDIS_HOST) || "localhost",
  port: REDIS_URL ? Number(new URL(REDIS_URL).port || "6379") : Number(process.env.REDIS_PORT || "6380"),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
};

const worker = new Worker<SourceJobData>(
  "hv-sourcing",
  async (job: Job<SourceJobData>) => {
    const { type, providerId, jobKey, attempt } = job.data;
    console.log(`[queue] processing ${type} job=${jobKey} attempt=${(attempt ?? 0) + 1}`);

    switch (type) {
      case "scrape": {
        // In this deploy, scraping runs via the worker connected to the scraper lib.
        const { scrapeSource, upsertScraped } = await import("@/lib/sourcing/scraper");
        const { prisma } = await import("@/lib/prisma");
        const tenant = await prisma.tenant.findFirst();
        const supplier = await prisma.supplier.findFirst({ where: { tenantId: tenant?.id } });
        if (!tenant || !supplier || !providerId) throw new Error("missing tenant/supplier/source");
        const products = await scrapeSource(providerId, { maxPages: 3 });
        const res = await upsertScraped(providerId, products, supplier.id, tenant.id);
        console.log(`[queue] scrape ${providerId}: ${res.created} new, ${res.updated} updated`);
        return res;
      }
      case "apify-discovery": {
        const { runDiscoveryActor, fetchDiscoveryResults, ingestDiscoveredSuppliers } = await import("@/lib/sourcing/apify");
        const { prisma } = await import("@/lib/prisma");
        const tenant = await prisma.tenant.findFirst();
        if (!tenant) throw new Error("no tenant");
        const { runId, started } = await runDiscoveryActor();
        if (!started || !runId) return { skipped: true };
        await new Promise((r) => setTimeout(r, 15_000)); // bounded wait for results
        const suppliers = await fetchDiscoveryResults(runId);
        const res = await ingestDiscoveredSuppliers(suppliers, tenant.id);
        console.log(`[queue] apify-discovery: ${res.created} new suppliers`);
        return res;
      }
      case "catalog-sync":
      case "aggregator-checkout":
        // These are handled inline by their API routes for real-time response;
        // the job exists for durable retry logging. Ack as done.
        console.log(`[queue] ${type} acknowledged (handled by API route)`);
        return { ok: true };
      default:
        return { ok: false };
    }
  },
  { connection, concurrency: 4 }
);

worker.on("completed", (job) => console.log(`[queue] ✓ ${job.name} done`));
worker.on("failed", (job, err) => console.error(`[queue] ✗ ${job?.name} failed:`, err.message));

console.log("[queue] worker started — watching hv-sourcing");
