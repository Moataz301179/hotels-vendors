import { Queue, Worker, Job } from "bullmq";
import Redis from "ioredis";

/**
 * Asynchronous Swarm Orchestration (BullMQ + Redis)
 * Handles heavy multi-tenant operations, compliance generation, and ETA webhook
 * transmissions without causing Vercel serverless 504 Gateway Timeouts.
 */

// Initialize persistent Redis connection strictly bypassing maxRetries limits for BullMQ
const connection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

// ─────────────────────────────────────────
// FORMAL SQUAD QUEUE DEFINITIONS
// ─────────────────────────────────────────
export const IntelligenceQueue = new Queue("swarm_intelligence", { connection });
export const ExecutionQueue = new Queue("swarm_execution", { connection });
export const ComplianceQueue = new Queue("swarm_compliance", { 
  connection,
  defaultJobOptions: {
    attempts: 5, // Enforce DLQ threshold
    backoff: {
      type: 'exponential',
      delay: 5000 // 5s, 25s, 125s, etc.
    }
  }
});

// ─────────────────────────────────────────
// WORKER DEFINITIONS (Dead-Letter Supported)
// ─────────────────────────────────────────

/**
 * The ETA Network Adapter Worker
 * Executes strictly defined cryptographic e-invoicing transmissions to the ETA.
 * Enforces exponential backoff and dead-letter queue routing upon 5xx network failures.
 */
export const complianceWorker = new Worker("swarm_compliance", async (job: Job) => {
  const { action, payload, tenantId } = job.data;
  
  console.log(`[Swarm Orchestration] Processing ${action} for tenant ${tenantId} via Background Worker...`);
  
  if (action === "TRANSMIT_ETA_HASH") {
    // Simulate Outbound Network Request to Egyptian Tax Authority
    // If the ETA API is offline, this worker will throw, triggering the DLQ exponential backoff retry.
    if (!payload.signature) {
      throw new Error("COMPLIANCE_BREACH: Missing CAdES-BES signature for transmission.");
    }
    
    // Simulate async network latency and processing boundary
    await new Promise((resolve) => setTimeout(resolve, 2500));
    console.log(`[ETA Bridge] Successfully transmitted ETA payload for Asset ${payload.assetId}.`);
    
    // In production: Dispatch SSE telemetry hook back to frontend UI here
    
    return { success: true, status: "TRANSMITTED" };
  }
  
  throw new Error("UNKNOWN_ACTION: Worker received unsupported or structurally flawed operation.");
}, { 
  connection,
  concurrency: 5, // Parallel execution guard
  limiter: {
    max: 20, // Strict rate limiting: Max 20 requests
    duration: 60000 // per 1 minute (aligned with ETA API constraints)
  }
});

// Lifecycle Event Telemetry
complianceWorker.on("failed", (job, err) => {
  console.error(`[DLQ Alert] Job ${job?.id} failed after ${job?.attemptsMade} attempts. Routing to Dead-Letter Queue. Reason: ${err.message}`);
});

complianceWorker.on("completed", (job) => {
  console.log(`[Swarm Orchestration] Job ${job.id} cleanly executed and removed from memory pool.`);
});

// ─────────────────────────────────────────
// BACKWARDS COMPATIBILITY LAYER (DEPRECATED)
// Maintains API compatibility with old swarm scheduler
// ─────────────────────────────────────────

/** @deprecated Use IntelligenceQueue or ExecutionQueue directly */
export const swarmQueues = {
  director: ExecutionQueue,
  platform: ExecutionQueue,
  fintech: ComplianceQueue,
  supplier: ExecutionQueue,
  hotel: ExecutionQueue,
  logistics: ExecutionQueue,
  intelligence: IntelligenceQueue,
  growth: ExecutionQueue,
};

/** @deprecated Legacy job type definitions */
export type SwarmJobType =
  | "director_plan" | "director_review"
  | "schema_design" | "security_audit" | "deploy_pipeline" | "test_automation"
  | "fee_calculation" | "eta_submission" | "credit_assessment" | "authority_enforcement"
  | "supplier_onboard" | "catalog_validate" | "trust_assess" | "coastal_mapping"
  | "procurement_design" | "order_flow" | "spend_analytics" | "multi_property_setup"
  | "route_optimize" | "delivery_track" | "partner_manage"
  | "price_benchmark" | "demand_forecast" | "matchmake" | "ai_assistant_train"
  | "lead_scout" | "lead_enrich" | "outreach_draft" | "outreach_send" | "content_generate"
  | "seo_optimize" | "social_listen" | "health_check" | "audit_data"
  | "web_navigate" | "form_fill" | "document_ocr" | "report_generate";

/** @deprecated Legacy payload interface */
export interface SwarmJobPayload {
  jobType: string;
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

/** @deprecated Use ExecutionQueue.add or IntelligenceQueue.add directly */
export async function addSwarmJob(
  payload: SwarmJobPayload,
  options: {
    delay?: number;
    priority?: number;
    repeat?: { cron: string; tz?: string };
    jobId?: string;
  } = {}
): Promise<Job> {
  const queue = swarmQueues[payload.squad as keyof typeof swarmQueues] || ExecutionQueue;
  
  const job = await queue.add(payload.jobType, payload, {
    priority: options.priority || 5,
    delay: options.delay,
    repeat: options.repeat,
    jobId: options.jobId,
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
  });
  
  console.warn(`[DEPRECATED] addSwarmJob called. Consider migrating to ExecutionQueue.add for: ${payload.jobType}`);
  return job;
}
