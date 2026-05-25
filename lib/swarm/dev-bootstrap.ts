/**
 * Swarm Dev Bootstrapper — VPS Architecture Compatible
 * Creates workers for ExecutionQueue and IntelligenceQueue
 * so the full swarm can process jobs in parallel.
 */

import { Worker, Job } from "bullmq";
import Redis from "ioredis";
import { executeAgentJob } from "./agent-executor";
import { getAgentById } from "./agents";
import { recordSwarmEvent } from "./monitoring";

const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

let workersInitialized = false;
let activeWorkers: Worker[] = [];

async function processAgentJob(job: Job) {
  const payload = job.data;
  const start = Date.now();

  console.log(`[SwarmWorker] 🐝 Job ${job.id} | ${payload.agentName || payload.agentId} | ${payload.jobType}`);

  try {
    const agentDef = getAgentById(payload.agentId);
    const agentTools = agentDef?.tools || [];

    const result = await executeAgentJob({
      agentId: payload.agentId,
      agentName: payload.agentName || payload.agentId,
      systemPrompt: payload.systemPrompt,
      userPrompt: payload.userPrompt,
      tools: agentTools,
      temperature: 0.3,
      maxTokens: 4096,
    });

    const duration = Date.now() - start;
    console.log(`[SwarmWorker] ✅ Job ${job.id} completed in ${duration}ms | Model: ${result.provider}`);

    await recordSwarmEvent("job_completed", "INFO", {
      jobId: job.id,
      agentId: payload.agentId,
      durationMs: duration,
      model: result.provider,
    });

    return { status: "completed", content: result.content, model: result.provider, durationMs: duration };
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    console.error(`[SwarmWorker] ❌ Job ${job.id} failed:`, err);

    await recordSwarmEvent("job_failed", "ERROR", {
      jobId: job.id,
      agentId: payload.agentId,
      error: err,
    });

    throw error;
  }
}

export async function bootstrapSwarmDev(): Promise<{
  success: boolean;
  workers: number;
  message: string;
}> {
  if (workersInitialized) {
    return { success: true, workers: activeWorkers.length, message: "Swarm already active" };
  }

  try {
    console.log("[SwarmDev] 🐝 Bootstrapping swarm workers...");

    // Worker 1: Execution Queue — General agent tasks
    const executionWorker = new Worker("swarm_execution", processAgentJob, {
      connection,
      concurrency: 3,
    });
    executionWorker.on("completed", (job) => console.log(`[ExecutionQueue] ✅ ${job.id}`));
    executionWorker.on("failed", (job, err) => console.error(`[ExecutionQueue] ❌ ${job?.id}: ${err.message}`));

    // Worker 2: Intelligence Queue — Analytics, research, planning
    const intelligenceWorker = new Worker("swarm_intelligence", processAgentJob, {
      connection,
      concurrency: 2,
    });
    intelligenceWorker.on("completed", (job) => console.log(`[IntelligenceQueue] ✅ ${job.id}`));
    intelligenceWorker.on("failed", (job, err) => console.error(`[IntelligenceQueue] ❌ ${job?.id}: ${err.message}`));

    activeWorkers = [executionWorker, intelligenceWorker];
    workersInitialized = true;

    console.log(`[SwarmDev] ✅ ${activeWorkers.length} workers active (Execution + Intelligence)`);

    await recordSwarmEvent("swarm_dev_bootstrapped", "INFO", {
      workerCount: activeWorkers.length,
      mode: "vps",
    });

    return {
      success: true,
      workers: activeWorkers.length,
      message: `Swarm active: ${activeWorkers.length} workers processing jobs`,
    };
  } catch (error) {
    const err = error instanceof Error ? error.message : String(error);
    console.error("[SwarmDev] ❌ Bootstrap failed:", err);
    return { success: false, workers: 0, message: `Bootstrap failed: ${err}` };
  }
}

export function isSwarmActive(): boolean {
  return workersInitialized;
}

// Graceful shutdown
export async function shutdownSwarmWorkers(): Promise<void> {
  for (const worker of activeWorkers) {
    await worker.close();
  }
  workersInitialized = false;
  activeWorkers = [];
}
