import { NextRequest } from "next/server";
import { apiRoute, authenticate, success, requirePermission } from "@/lib/api-utils";
import { createEvidenceService } from "@/lib/intelligence/services";

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "report:read");
  const provenance = request.nextUrl.searchParams.get("provenance") ?? undefined;
  return success({ status: "live", evidence: await createEvidenceService().queryEvidence(auth.tenantId, provenance) });
});
