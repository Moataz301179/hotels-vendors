import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";
import { dispatchSwarmMission, dispatchBatchMissions } from "@/lib/swarm/orchestrator";
import { bootstrapSwarmDev } from "@/lib/swarm/dev-bootstrap";
import { getSwarmHealth, getSquadPerformance } from "@/lib/swarm/monitoring";

/**
 * POST /api/v1/swarm/orchestrate
 * The MAIN swarm dispatch endpoint.
 * Takes a task description → analyzes → dispatches to multiple agents in PARALLEL.
 *
 * Body: { task: string, dryRun?: boolean, skipApproval?: boolean }
 * Batch: { tasks: string[] }
 */
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  // Ensure swarm is active
  const bootstrap = await bootstrapSwarmDev();
  if (!bootstrap.success) {
    return NextResponse.json(
      { success: false, error: "Swarm bootstrap failed: " + bootstrap.message },
      { status: 500 }
    );
  }

  const body = await request.json();

  // Batch mode
  if (body.tasks && Array.isArray(body.tasks)) {
    const results = await dispatchBatchMissions(body.tasks);
    return NextResponse.json({
      success: true,
      mode: "batch",
      missions: results.map((r) => ({
        missionId: r.missionId,
        task: r.task,
        summary: r.summary,
        agentCount: r.assignments.length,
        jobIds: r.jobIds,
      })),
      swarmStatus: bootstrap,
    });
  }

  // Single task mode
  const task = body.task || body.prompt || body.description;
  if (!task || typeof task !== "string") {
    return NextResponse.json(
      { success: false, error: "Missing 'task' field" },
      { status: 400 }
    );
  }

  const result = await dispatchSwarmMission(task, {
    dryRun: body.dryRun === true,
    skipApproval: body.skipApproval === true,
  });

  return NextResponse.json({
    success: true,
    mode: "single",
    missionId: result.missionId,
    analysis: result.analysis,
    agents: result.assignments.map((a) => ({
      id: a.agent.id,
      name: a.agent.name,
      avatar: a.agent.avatar,
      role: a.role,
      squad: a.agent.squad,
      priority: a.priority,
    })),
    jobIds: result.jobIds,
    summary: result.summary,
    swarmStatus: bootstrap,
  });
});

/**
 * GET /api/v1/swarm/orchestrate
 * Swarm health dashboard data
 */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const hours = parseInt(request.nextUrl.searchParams.get("hours") || "24", 10);

  const [health, squadPerformance] = await Promise.all([
    getSwarmHealth(hours),
    getSquadPerformance(hours),
  ]);

  return NextResponse.json({
    success: true,
    swarmActive: true,
    health,
    squadPerformance,
    agentRegistry: {
      totalAgents: 28,
      squads: ["director", "platform", "fintech", "supplier", "hotel", "logistics", "intelligence", "growth"],
    },
  });
});
