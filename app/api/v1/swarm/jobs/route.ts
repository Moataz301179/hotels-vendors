import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { addSwarmJob } from "@/lib/swarm/scheduler";
import { getAgentById } from "@/lib/swarm/agents";

/**
 * GET /api/v1/swarm/jobs
 * List swarm jobs with filtering
 */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const status = request.nextUrl.searchParams.get("status");
  const squad = request.nextUrl.searchParams.get("squad");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "20", 10);
  const page = parseInt(request.nextUrl.searchParams.get("page") || "1", 10);

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (squad) where.squad = squad;

  const [jobs, total] = await Promise.all([
    prisma.swarmJob.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.swarmJob.count({ where }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      jobs,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    },
  });
});

/**
 * POST /api/v1/swarm/jobs
 * Create a new swarm job manually
 */
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const body = await request.json();
  const { agentId, jobType, prompt, context, requiresApproval } = body;

  const agent = getAgentById(agentId);
  if (!agent) {
    return NextResponse.json({ success: false, error: `Unknown agent: ${agentId}` }, { status: 400 });
  }

  const job = await addSwarmJob(
    {
      jobType,
      agentId: agent.id,
      agentName: agent.name,
      squad: agent.squad,
      systemPrompt: agent.systemPrompt,
      userPrompt: prompt,
      context,
      requiresApproval: requiresApproval || agent.requiresApproval,
      memoryCategory: agent.memoryCategory,
    },
    { priority: body.priority || 5 }
  );

  return NextResponse.json({
    success: true,
    data: { jobId: job.id, status: "queued" },
  });
});
