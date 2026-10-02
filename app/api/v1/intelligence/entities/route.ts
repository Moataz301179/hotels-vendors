import { NextRequest } from "next/server";
import { apiRoute, authenticate, success, requirePermission } from "@/lib/api-utils";
import { createIntelligenceService } from "@/lib/intelligence/services";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "report:read");
  const entityType = request.nextUrl.searchParams.get("entityType") ?? undefined;
  return success({ status: "live", insights: await createIntelligenceService().detectNetworkPattern(auth.tenantId, entityType) });
});
