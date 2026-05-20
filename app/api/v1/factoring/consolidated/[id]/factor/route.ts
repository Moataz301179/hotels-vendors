import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { orchestrateConsolidatedFactoring } from "@/lib/fintech/factoring-orchestrator";
import { apiRoute, authenticate, success, error, audit, requireIdempotencyKey, completeIdempotency, requirePermission } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invoice:factor");
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved; // master invoice ID

  const record = await prisma.masterInvoice.findUnique({ where: { id }, select: { tenantId: true, total: true } });
  if (!record || record.tenantId !== auth.tenantId) return error("Not found", 404);

  const idempotencyKey = await requireIdempotencyKey(request, { userId: auth.userId, action: "CONSOLIDATED_FACTOR", amount: record.total });

  const result = await orchestrateConsolidatedFactoring({
    masterInvoiceId: id,
    triggeredBy: auth.userId,
    tenantId: auth.tenantId,
  });

  if (!result.success) {
    return error(result.error || "Factoring execution failed", 422);
  }

  await audit({
    entityType: "MASTER_INVOICE",
    entityId: id,
    action: "CONSOLIDATED_FACTORING_COMPLETED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      factoringRequestId: result.factoringRequestId,
      stage: result.stage,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  completeIdempotency(idempotencyKey, id);

  return success({
    message: "Consolidated reverse factoring successfully executed and disbursed",
    factoringRequestId: result.factoringRequestId,
    details: result.details,
  });
});
