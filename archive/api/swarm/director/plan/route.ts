import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";
import { runGrowthSnowball } from "@/lib/swarm/director";

/**
 * POST /api/v1/swarm/director/plan
 * Trigger the Director's daily battle plan cycle manually
 */
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  await runGrowthSnowball();

  return NextResponse.json({
    success: true,
    message: "Director cycle triggered. Check swarm jobs for assigned missions.",
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/swarm/director/plan
 * Get the latest battle plan from memory
 */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  return NextResponse.json({
    success: true,
    message: "Use POST to trigger a new plan",
  });
});
