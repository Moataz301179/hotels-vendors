import { NextRequest } from "next/server";
import { z } from "zod";
import {
  apiRoute,
  authenticate,
  validateBody,
  success,
  requirePermission,
} from "@/lib/api-utils";
import { runAcquisition, quickDiscover } from "@/lib/swarm/acquisition-engine";
import { SUPPLIER_SOURCES } from "@/lib/swarm/supplier-sources";
import { addSwarmJob } from "@/lib/swarm/scheduler";

const AcquireSchema = z.object({
  sourceIds: z.array(z.string()).min(1).max(10),
  maxLeadsPerSource: z.number().min(1).max(100).default(20),
  autoEnrich: z.boolean().default(true),
  autoOutreach: z.boolean().default(false),
  dryRun: z.boolean().default(false),
});

const QuickDiscoverSchema = z.object({
  sourceId: z.string(),
  maxLeads: z.number().min(1).max(50).default(10),
});

// ── GET: List available sources ──

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "lead:read");

  return success({
    sources: SUPPLIER_SOURCES.map((s) => ({
      id: s.id,
      name: s.name,
      region: s.region,
      category: s.category,
      priority: s.priority,
      url: s.url,
      notes: s.notes,
    })),
    total: SUPPLIER_SOURCES.length,
  });
});

// ── POST: Trigger full acquisition run ──

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "lead:create");

  const body = await request.json();

  // Quick discover mode (no DB write)
  if (body.mode === "quick_discover") {
    const data = validateBody(QuickDiscoverSchema, body);
    const results = await quickDiscover(data.sourceId, data.maxLeads);
    return success({
      mode: "quick_discover",
      sourceId: data.sourceId,
      discovered: results.length,
      leads: results,
    });
  }

  // Full acquisition pipeline
  const data = validateBody(AcquireSchema, body);

  const runId = `acq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Queue as async SwarmJob for background execution
  const job = await addSwarmJob(
    {
      jobType: "lead_scout",
      agentId: "lead-scout",
      agentName: "Lead Scout",
      squad: "growth",
      systemPrompt: `You are the Lead Scout agent. Your mission: discover high-quality suppliers from Egyptian industrial directories using browser automation. You orchestrate the full acquisition pipeline: discover → enrich → dedupe → store → score → draft outreach.`,
      userPrompt: `Execute acquisition run ${runId} for sources: ${data.sourceIds.join(", ")}. Max ${data.maxLeadsPerSource} leads per source.`,
      context: {
        runId,
        sourceIds: data.sourceIds,
        maxLeadsPerSource: data.maxLeadsPerSource,
        autoEnrich: data.autoEnrich,
        autoOutreach: data.autoOutreach,
        dryRun: data.dryRun,
        tenantId: auth.tenantId,
      },
      requiresApproval: false,
      memoryCategory: "lead",
    },
    { priority: 3 }
  );

  // Also trigger immediate execution (don't wait)
  runAcquisition(
    {
      id: runId,
      sourceIds: data.sourceIds,
      maxLeadsPerSource: data.maxLeadsPerSource,
      options: {
        autoEnrich: data.autoEnrich,
        autoOutreach: data.autoOutreach,
        dryRun: data.dryRun,
      },
    },
    auth.tenantId
  ).catch((err) => {
    console.error("[Acquisition] Background run failed:", err);
  });

  return success({
    runId,
    jobId: job.id,
    status: "QUEUED",
    sources: data.sourceIds,
    maxLeadsPerSource: data.maxLeadsPerSource,
    dryRun: data.dryRun,
    message: "Acquisition pipeline started. Check swarm jobs for progress.",
  }, 202);
});
