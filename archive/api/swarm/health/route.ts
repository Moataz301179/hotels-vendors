import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";
import { getSwarmHealth, getSquadPerformance } from "@/lib/swarm/monitoring";

/**
 * GET /api/v1/swarm/health
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
    data: {
      health,
      squadPerformance,
      generatedAt: new Date().toISOString(),
    },
  });
});
