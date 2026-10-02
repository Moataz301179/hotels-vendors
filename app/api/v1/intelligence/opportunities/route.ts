import { NextRequest } from "next/server";
import { apiRoute, authenticate, success, requirePermission } from "@/lib/api-utils";
import { createIntelligenceService } from "@/lib/intelligence/services";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "report:read");
  const service = createIntelligenceService();
  await service.detectNeeds(auth.tenantId);
  const opportunities = await service.matchOpportunity(auth.tenantId, request.nextUrl.searchParams.get("needId") ?? undefined);
  return success({ status: "live", opportunities });
});
