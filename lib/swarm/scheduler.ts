/**
 * Swarm Scheduler
 * BullMQ-based job queue with cron scheduling
 * Manages the lifecycle of all swarm jobs
 */

import { Queue, Worker, Job } from "bullmq";
import { prisma } from "@/lib/prisma";
import { executeLLM } from "./model-router";
import { getMemoryContext, storeMemory } from "./memory";
import { recordSwarmEvent } from "./monitoring";

// ── Queues ──
export const swarmQueues = {
  growth: new Queue("swarm-growth", { connection: getRedisConnection() }),
  operations: new Queue("swarm-operations", { connection: getRedisConnection() }),
  intelligence: new Queue("swarm-intelligence", { connection: getRedisConnection() }),
  execution: new Queue("swarm-execution", { connection: getRedisConnection() }),
  director: new Queue("swarm-director", { connection: getRedisConnection() }),
};

function getRedisConnection() {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  return { url };
}

// ── Job Types ──
export type SwarmJobType =
  | "lead_scout"
  | "lead_enrich"
  | "outreach_draft"
  | "outreach_send"
  | "content_generate"
  | "social_listen"
  | "supplier_onboard"
  | "catalog_validate"
  | "trust_assess"
  | "health_check"
  | "price_benchmark"
  | "demand_forecast"
  | "matchmake"
  | "audit_data"
  | "web_navigate"
  | "form_fill"
  | "document_ocr"
  | "report_generate"
  | "director_plan"
  | "director_review";

export interface SwarmJobPayload {
  jobType: SwarmJobType;
  agentId: string;
  agentName: string;
  squad: string;
  systemPrompt: string;
  userPrompt: string;
  context?: Record<string, unknown>;
  requiresApproval?: boolean;
  memoryCategory?: string;
  openclawAction?: {
    endpoint: string;
    payload: Record<string, unknown>;
  };
}

// ── Add Job ──
export async function addSwarmJob(
  payload: SwarmJobPayload,
  options: {
    delay?: number;
    priority?: number;
    repeat?: { cron: string; tz?: string };
    jobId?: string;
  } = {}
): Promise<Job> {
  const queue = swarmQueues[payload.squad as keyof typeof swarmQueues] || swarmQueues.director;

  const job = await queue.add(payload.jobType, payload, {
    priority: options.priority || 5,
    delay: options.delay,
    repeat: options.repeat,
    jobId: options.jobId,
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });

  // Persist to DB
  await prisma.swarmJob.create({
    data: {
      queueName: payload.squad,
      jobType: payload.jobType,
      jobName: `${payload.agentName}: ${payload.jobType}`,
      payload: JSON.stringify(payload),
      status: options.delay ? "SCHEDULED" : "PENDING",
      squad: payload.squad,
      assignedAgent: payload.agentId,
      requiresApproval: payload.requiresApproval || false,
      scheduledAt: options.delay ? new Date(Date.now() + options.delay) : undefined,
    },
  });

  await recordSwarmEvent("job_queued", "INFO", {
    agentId: payload.agentId,
    squad: payload.squad,
  });

  return job;
}

// ── Worker Factory ──
export function createSwarmWorker(squad: string) {
  return new Worker(
    `swarm-${squad}`,
    async (job: Job<SwarmJobPayload>) => {
      const payload = job.data;
      const start = Date.now();
      const dbJob = await prisma.swarmJob.findFirst({
        where: { jobType: payload.jobType, assignedAgent: payload.agentId },
        orderBy: { createdAt: "desc" },
      });

      try {
        // Update status
        if (dbJob) {
          await prisma.swarmJob.update({
            where: { id: dbJob.id },
            data: { status: "RUNNING", startedAt: new Date() },
          });
        }

        // Check if approval required
        if (payload.requiresApproval) {
          if (dbJob) {
            await prisma.swarmJob.update({
              where: { id: dbJob.id },
              data: { status: "WAITING_APPROVAL" },
            });
          }
          await recordSwarmEvent("approval_required", "WARNING", {
            jobId: job.id,
            agentId: payload.agentId,
            jobType: payload.jobType,
          });
          return { status: "waiting_approval", message: "Human approval required" };
        }

        // Retrieve memory context
        const memoryContext = await getMemoryContext(payload.agentId, payload.userPrompt);

        // Execute LLM call
        const result = await executeLLM(
          payload.systemPrompt,
          memoryContext ? `${memoryContext}\n\n${payload.userPrompt}` : payload.userPrompt,
          { temperature: 0.3, maxTokens: 4096 }
        );

        // Store result in memory
        await storeMemory({
          agentId: payload.agentId,
          agentName: payload.agentName,
          content: `Job ${payload.jobType}: ${result.content.substring(0, 1000)}`,
          memoryType: "ACTION_PLAN",
          category: payload.memoryCategory || "general",
          jobId: dbJob?.id,
        });

        // Execute OpenClaw action if specified
        let openclawResult = null;
        if (payload.openclawAction) {
          openclawResult = await executeOpenClaw(payload.openclawAction);
        }

        const duration = Date.now() - start;

        // Update DB
        if (dbJob) {
          await prisma.swarmJob.update({
            where: { id: dbJob.id },
            data: {
              status: "COMPLETED",
              completedAt: new Date(),
              durationMs: duration,
              output: JSON.stringify({
                llmResult: result,
                openclawResult,
              }),
              findings: result.content.substring(0, 2000),
            },
          });
        }

        await recordSwarmEvent("job_completed", "INFO", {
          jobId: job.id,
          agentId: payload.agentId,
          durationMs: duration,
          model: result.provider,
        });

        return {
          status: "completed",
          content: result.content,
          model: result.provider,
          durationMs: duration,
          openclawResult,
        };
      } catch (error) {
        const err = error instanceof Error ? error.message : String(error);
        const duration = Date.now() - start;

        if (dbJob) {
          await prisma.swarmJob.update({
            where: { id: dbJob.id },
            data: {
              status: job.attemptsMade >= (job.opts.attempts || 3) ? "FAILED" : "RETRYING",
              completedAt: new Date(),
              durationMs: duration,
              error: err,
              attempt: { increment: 1 },
            },
          });
        }

        await recordSwarmEvent("job_failed", "ERROR", {
          jobId: job.id,
          agentId: payload.agentId,
          error: err,
          attempt: job.attemptsMade,
        });

        throw error;
      }
    },
    { connection: getRedisConnection(), concurrency: 2 }
  );
}

// ── OpenClaw Bridge ──
async function executeOpenClaw(action: { endpoint: string; payload: Record<string, unknown> }) {
  const openclawUrl = process.env.OPENCLAW_URL || "http://localhost:8000";
  try {
    const res = await fetch(`${openclawUrl}${action.endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(action.payload),
    });
    return await res.json();
  } catch (e) {
    console.error("[OpenClaw] Execution failed:", e);
    return { success: false, error: String(e) };
  }
}

// ── Scheduled Jobs Setup ──
export async function setupScheduledJobs() {
  // Remove existing repeatable jobs first
  for (const queue of Object.values(swarmQueues)) {
    const repeatables = await queue.getRepeatableJobs();
    for (const r of repeatables) {
      await queue.removeRepeatableByKey(r.key);
    }
  }

  // Director: Daily strategy review at 6 AM
  await addSwarmJob(
    {
      jobType: "director_plan",
      agentId: "director",
      agentName: "The Director",
      squad: "director",
      systemPrompt: `You are The Director — the supreme orchestrator of Hotels Vendors. You analyze market data, competitor moves, platform metrics, and agent performance to create the daily battle plan. You are ruthless about growth, obsessed with supplier acquisition, and laser-focused on generating revenue. Your output is a structured JSON action plan with prioritized initiatives.`,
      userPrompt: `Analyze the current state:
- Platform: Hotels Vendors B2B procurement marketplace for Egyptian hospitality
- Current hotels: ${await prisma.hotel.count()} | suppliers: ${await prisma.supplier.count()} | orders: ${await prisma.order.count()}
- Competitors: MaxAB-Wasoko (horizontal), FutureLog (global, no Egypt), Capiter (shut down)
- Market: $21.54B Egyptian hospitality, 7.12% CAGR

Generate today's action plan with:
1. Top 3 growth initiatives (hotel acquisition, supplier onboarding, transaction volume)
2. Agent assignments for each squad
3. Risk flags and mitigation
4. Revenue opportunity score (1-10)

Output ONLY valid JSON.`,
      requiresApproval: false,
      memoryCategory: "strategy",
    },
    { repeat: { cron: "0 6 * * *", tz: "Africa/Cairo" }, jobId: "director-daily-plan" }
  );

  // Growth: Lead scouting every 4 hours
  await addSwarmJob(
    {
      jobType: "lead_scout",
      agentId: "lead-scout",
      agentName: "Lead Scout",
      squad: "growth",
      systemPrompt: `You are a lead generation specialist for Hotels Vendors. Your job is to identify high-potential hotels and suppliers in Egypt. You analyze data sources and produce structured lead lists with enrichment data. Focus on: Cairo hotels (5-star, 200+ rooms), 6th of October suppliers (F&B, linens, chemicals), North Coast seasonal properties.`,
      userPrompt: `Search for and identify 10 new high-priority leads (mix of hotels and suppliers) in Egypt. For each provide: name, city, type, estimated tier, discovery source, and initial outreach angle. Output as structured JSON array.`,
      memoryCategory: "lead",
    },
    { repeat: { cron: "0 */4 * * *", tz: "Africa/Cairo" }, jobId: "growth-lead-scout" }
  );

  // Intelligence: Price benchmarking daily at 8 AM
  await addSwarmJob(
    {
      jobType: "price_benchmark",
      agentId: "price-analyst",
      agentName: "Price Analyst",
      squad: "intelligence",
      systemPrompt: `You are a pricing intelligence analyst. You monitor competitor pricing, market trends, and platform data to identify pricing anomalies and opportunities. You flag any supplier pricing that deviates significantly from market norms.`,
      userPrompt: `Analyze current product pricing on the platform. Identify any products with pricing anomalies (too high/low vs market). Suggest price adjustments. Output structured JSON with recommendations.`,
      memoryCategory: "market_signal",
    },
    { repeat: { cron: "0 8 * * *", tz: "Africa/Cairo" }, jobId: "intel-price-benchmark" }
  );

  // Operations: Health check every 2 hours
  await addSwarmJob(
    {
      jobType: "health_check",
      agentId: "health-monitor",
      agentName: "Health Monitor",
      squad: "operations",
      systemPrompt: `You monitor platform health: inactive suppliers, churn-risk hotels, order anomalies, and catalog quality issues. You flag problems before they become crises.`,
      userPrompt: `Check platform health metrics. Identify: (1) suppliers with no orders in 30 days, (2) hotels with declining order frequency, (3) catalog items with zero stock, (4) any data quality issues. Output structured JSON with severity ratings.`,
      memoryCategory: "market_signal",
    },
    { repeat: { cron: "0 */2 * * *", tz: "Africa/Cairo" }, jobId: "ops-health-check" }
  );

  console.log("[Scheduler] Scheduled jobs configured");
}

// ── Initialize Workers ──
export function initializeSwarmWorkers() {
  const workers = [
    createSwarmWorker("director"),
    createSwarmWorker("growth"),
    createSwarmWorker("operations"),
    createSwarmWorker("intelligence"),
    createSwarmWorker("execution"),
  ];

  workers.forEach((w) => {
    w.on("completed", (job) => console.log(`[Worker] ${job.id} completed`));
    w.on("failed", (job, err) => console.error(`[Worker] ${job?.id} failed:`, err.message));
  });

  return workers;
}
