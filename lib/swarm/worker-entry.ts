/**
 * Swarm Worker Entry Point
 * Runs as a background process to execute queued jobs
 */

import { recordSwarmEvent } from "./monitoring";
import { createEtaWorker, createEtaDeadLetterWorker } from "@/lib/eta/queue";
import { createOrderWorker } from "@/lib/orders/queue";
import { createFactoringWorker } from "@/lib/factoring/queue";
import { createEmailWorker } from "@/lib/notifications/queue";

async function main() {
  console.log("[SwarmWorker] 🐝 Starting worker...");

  const workers: any[] = [];

  // Initialize business-logic workers
  const etaWorker = createEtaWorker();
  const etaDlqWorker = createEtaDeadLetterWorker();
  const orderWorker = createOrderWorker();
  const factoringWorker = createFactoringWorker();
  const emailWorker = createEmailWorker();

  workers.push(etaWorker, etaDlqWorker, orderWorker, factoringWorker, emailWorker);
  console.log(`[SwarmWorker] ✅ 5 business workers initialized (eta, orders, factoring, email)`);

  await recordSwarmEvent("worker_started", "INFO", {
    workerCount: workers.length,
    mode: process.env.WORKER_MODE || "swarm",
  });

  // Keep process alive
  process.on("SIGTERM", async () => {
    console.log("[SwarmWorker] Received SIGTERM, shutting down gracefully...");
    for (const worker of workers) {
      await worker.close();
    }
    process.exit(0);
  });

  process.on("SIGINT", async () => {
    console.log("[SwarmWorker] Received SIGINT, shutting down gracefully...");
    for (const worker of workers) {
      await worker.close();
    }
    process.exit(0);
  });

  console.log("[SwarmWorker] 🚀 Ready for missions");
}

main().catch((err) => {
  console.error("[SwarmWorker] Fatal error:", err);
  process.exit(1);
});
