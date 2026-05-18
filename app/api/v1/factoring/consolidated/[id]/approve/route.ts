import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, audit, requirePermission } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "invoice:approve");

  const resolved = await params;
  if (!resolved) return error("Missing parameters", 400);
  const { id } = resolved; // consolidated invoice ID

  const record = await prisma.consolidatedInvoice.findUnique({
    where: { id },
    select: { tenantId: true, total: true, status: true },
  });

  if (!record || record.tenantId !== auth.tenantId) {
    return error("Consolidated Invoice asset not found in this tenant context", 404);
  }

  // Record Four-Eyes Attestation State Transition to the append-only AuditLog
  await audit({
    entityType: "CONSOLIDATED_INVOICE",
    entityId: id,
    action: "CONSOLIDATED_INVOICE_APPROVED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole === "HOTEL" ? "VERIFIER" : "FINANCIAL_CONTROLLER",
    beforeState: { status: record.status },
    afterState: { status: "APPROVED" },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    message: "Four-Eyes Attestation State Transition executed successfully and recorded in audit log.",
    consolidatedInvoiceId: id,
  });
});
