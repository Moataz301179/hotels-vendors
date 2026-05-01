import { NextRequest } from "next/server";
import { calculateTrustScore } from "@/lib/integrations/trust-score";
import { apiRoute, authenticate, success, error } from "@/lib/api-utils";
import { z } from "zod";

const QuerySchema = z.object({
  type: z.enum(["HOTEL", "SUPPLIER"]),
});

export const GET = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ entityId: string }> }) => {
  const auth = await authenticate(request);
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { entityId } = resolved;

  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type");
  const parsed = QuerySchema.safeParse({ type });
  if (!parsed.success) {
    return error("Missing or invalid ?type=HOTEL|SUPPLIER", 400);
  }

  const result = await calculateTrustScore(entityId, parsed.data.type);

  return success({ trustScore: result });
});
