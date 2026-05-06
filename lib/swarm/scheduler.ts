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
import { runAcquisition } from "./acquisition-engine";
import { executeAgentJob } from "./agent-executor";
import { getAgentById } from "./agents";

// ── Queues ──
export const swarmQueues = {
  director: new Queue("swarm-director", { connection: getRedisConnection() }),
  platform: new Queue("swarm-platform", { connection: getRedisConnection() }),
  fintech: new Queue("swarm-fintech", { connection: getRedisConnection() }),
  supplier: new Queue("swarm-supplier", { connection: getRedisConnection() }),
  hotel: new Queue("swarm-hotel", { connection: getRedisConnection() }),
  logistics: new Queue("swarm-logistics", { connection: getRedisConnection() }),
  intelligence: new Queue("swarm-intelligence", { connection: getRedisConnection() }),
  growth: new Queue("swarm-growth", { connection: getRedisConnection() }),
};

function getRedisConnection() {
  const url = process.env.REDIS_URL || "redis://localhost:6379";
  return { url };
}

// ── Job Types ──
export type SwarmJobType =
  // Director
  | "director_plan"
  | "director_review"
  // Platform
  | "schema_design"
  | "security_audit"
  | "deploy_pipeline"
  | "test_automation"
  // Fintech
  | "fee_calculation"
  | "eta_submission"
  | "credit_assessment"
  | "authority_enforcement"
  // Supplier
  | "supplier_onboard"
  | "catalog_validate"
  | "trust_assess"
  | "coastal_mapping"
  // Hotel
  | "procurement_design"
  | "order_flow"
  | "spend_analytics"
  | "multi_property_setup"
  // Logistics
  | "route_optimize"
  | "delivery_track"
  | "partner_manage"
  // Intelligence
  | "price_benchmark"
  | "demand_forecast"
  | "matchmake"
  | "ai_assistant_train"
  // Growth
  | "lead_scout"
  | "lead_enrich"
  | "outreach_draft"
  | "outreach_send"
  | "content_generate"
  | "seo_optimize"
  | "social_listen"
  | "health_check"
  | "audit_data"
  | "web_navigate"
  | "form_fill"
  | "document_ocr"
  | "report_generate";

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
  if (!queue) {
    throw new Error(`Unknown squad: ${payload.squad}`);
  }

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

        // Get agent definition for tool list
        const agentDef = getAgentById(payload.agentId);
        const agentTools = agentDef?.tools || [];

        // Execute agent job with autonomous tool use
        let result: { content: string; provider: string; latencyMs: number; toolRounds?: number };
        let toolResults: { success: boolean; data: unknown; error?: string }[] = [];

        if (agentTools.length > 0 && agentTools.some((t) => t.startsWith("openclaw_") || t.startsWith("memory_") || t.startsWith("database_"))) {
          const execResult = await executeAgentJob({
            agentId: payload.agentId,
            agentName: payload.agentName,
            systemPrompt: payload.systemPrompt,
            userPrompt: payload.userPrompt,
            tools: agentTools,
            memoryContext,
            temperature: 0.3,
            maxTokens: 4096,
          });
          result = execResult;
          toolResults = execResult.toolResults;
        } else {
          // Fallback to simple LLM call for agents without tools
          const llmResult = await executeLLM(
            payload.systemPrompt,
            memoryContext ? `${memoryContext}\n\n${payload.userPrompt}` : payload.userPrompt,
            { temperature: 0.3, maxTokens: 4096 }
          );
          result = llmResult;
        }

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

        // Execute acquisition engine if context contains acquisition run
        let acquisitionResult = null;
        if (payload.context?.acquisitionRun) {
          const runConfig = payload.context.acquisitionRun as {
            sourceIds: string[];
            maxLeadsPerSource: number;
            autoEnrich: boolean;
            autoOutreach: boolean;
            dryRun: boolean;
          };
          const tenantId = String(payload.context.tenantId || "platform");
          acquisitionResult = await runAcquisition(
            {
              id: `scheduled_${Date.now()}`,
              sourceIds: runConfig.sourceIds,
              maxLeadsPerSource: runConfig.maxLeadsPerSource,
              options: {
                autoEnrich: runConfig.autoEnrich,
                autoOutreach: runConfig.autoOutreach,
                dryRun: runConfig.dryRun,
              },
            },
            tenantId
          );
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
                acquisitionResult,
                toolResults,
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

  // Growth: Lead scouting every 4 hours via Acquisition Engine
  await addSwarmJob(
    {
      jobType: "lead_scout",
      agentId: "lead-scout",
      agentName: "Lead Scout",
      squad: "growth",
      systemPrompt: `You are the Lead Scout agent. Your mission: discover high-quality suppliers from Egyptian industrial directories using browser automation. You orchestrate the full acquisition pipeline: discover → enrich → dedupe → store → score → draft outreach.`,
      userPrompt: `Execute automated supplier acquisition from top-priority sources. Target: 6th of October and 10th of Ramadan industrial directories.`,
      context: {
        acquisitionRun: {
          sourceIds: ["industrialzones-6oct", "industrialzones-10ramadan", "yellowpages-eg-hospitality"],
          maxLeadsPerSource: 15,
          autoEnrich: true,
          autoOutreach: false,
          dryRun: false,
        },
        tenantId: "platform", // Platform-wide acquisition
      },
      requiresApproval: false,
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
    createSwarmWorker("platform"),
    createSwarmWorker("fintech"),
    createSwarmWorker("supplier"),
    createSwarmWorker("hotel"),
    createSwarmWorker("logistics"),
    createSwarmWorker("intelligence"),
    createSwarmWorker("growth"),
  ];

  workers.forEach((w) => {
    w.on("completed", (job) => console.log(`[Worker] ${job.id} completed`));
    w.on("failed", (job, err) => console.error(`[Worker] ${job?.id} failed:`, err.message));
  });

  return workers;
}
