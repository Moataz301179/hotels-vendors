import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";
import { SWARM_AGENTS, getAgentsBySquad } from "@/lib/swarm/agents";

/**
 * GET /api/v1/swarm/agents
 * List all swarm agents
 */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const squad = request.nextUrl.searchParams.get("squad");

  const agents = squad ? getAgentsBySquad(squad) : SWARM_AGENTS;

  return NextResponse.json({
    success: true,
    data: {
      count: agents.length,
      agents: agents.map((a) => ({
        id: a.id,
        name: a.name,
        squad: a.squad,
        avatar: a.avatar,
        role: a.role,
        capabilities: a.capabilities,
        requiresApproval: a.requiresApproval,
      })),
    },
  });
});
