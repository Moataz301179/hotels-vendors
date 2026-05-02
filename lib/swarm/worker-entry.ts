/**
 * Swarm Worker Entry Point
 * Runs as a background process to execute queued jobs
 */

import { initializeSwarmWorkers, setupScheduledJobs } from "./scheduler";
import { recordSwarmEvent } from "./monitoring";

async function main() {
  console.log("[SwarmWorker] 🐝 Starting worker...");

  // Initialize all squad workers
  const workers = initializeSwarmWorkers();
  console.log(`[SwarmWorker] ✅ ${workers.length} squad workers initialized`);

  // Setup scheduled cron jobs
  await setupScheduledJobs();
  console.log("[SwarmWorker] ✅ Scheduled jobs configured");

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
