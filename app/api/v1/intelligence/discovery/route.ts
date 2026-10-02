import { NextRequest } from "next/server";
import { apiRoute, authenticate, success, requirePermission } from "@/lib/api-utils";
import { createIntelligenceService } from "@/lib/intelligence/services";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "report:read");
  const data = await createIntelligenceService().detectNeeds(auth.tenantId, request.nextUrl.searchParams.get("scope") ?? undefined);
  return success({ status: "live", needs: data });
});
