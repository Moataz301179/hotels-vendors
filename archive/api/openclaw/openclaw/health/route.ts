import { NextRequest, NextResponse } from "next/server";
import { apiRoute, authenticate, requirePermission } from "@/lib/api-utils";
import { checkOpenClawHealth } from "@/lib/integrations/openclaw";

/**
 * GET /api/v1/openclaw/health
 * Returns health status for both the OpenClaw gateway and automation engine.
 * Requires: admin:manage_platform
 */
export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_platform");

  const health = await checkOpenClawHealth();

  return NextResponse.json({
    success: true,
    data: health,
  });
});
