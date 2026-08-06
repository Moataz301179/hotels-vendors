import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import {
  apiRoute,
  authenticate,
  requirePermission,
  requireIdempotencyKey,
  audit,
  success,
  error,
} from "@/lib/api-utils";

const SettlementSchema = z.object({
  invoiceId: z.string().min(1),
  supplierId: z.string().min(1),
  amount: z.number().positive(),
  method: z.string().optional(),
});

/**
 * POST /api/v1/invo/settlement
 * Records a settlement execution against an invoice.
 * Authenticated, tenant-scoped, idempotent, audit-logged.
 */
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "payment:create");

  const body = await request.json();
  const parsed = SettlementSchema.safeParse(body);
  if (!parsed.success) {
    return error(parsed.error.issues[0]?.message || "Invalid request body", 400);
  }
  const { invoiceId, supplierId, amount, method } = parsed.data;

  // Tenant scoping: the invoice must belong to the caller's tenant
  const invoice = await prisma.invoice.findFirst({
    where: { id: invoiceId, tenantId: auth.tenantId },
    select: { id: true, supplierId: true, total: true },
  });
  if (!invoice) {
    return error("Invoice not found", 404);
  }

  await requireIdempotencyKey(request, {
    userId: auth.userId,
    action: "SETTLEMENT_EXECUTE",
    amount,
  });

  const settlementId = `set_${Date.now()}_${auth.userId.slice(-6)}`;

  // Settlement rail integration (bank transfer / wallet) is pending provider
  // certification. Until then, non-production environments return a simulated
  // receipt; production rejects the call explicitly rather than silently
  // pretending money moved.
  if (process.env.NODE_ENV === "production") {
    return error("Settlement rail not yet enabled. Contact platform operations.", 503);
  }

  await audit({
    entityType: "SETTLEMENT",
    entityId: settlementId,
    action: "SETTLEMENT_EXECUTE",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { invoiceId, supplierId, amount, method: method || "bank_transfer" },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({
    settlementId,
    invoiceId,
    supplierId,
    amount,
    currency: "EGP",
    method: method || "bank_transfer",
    status: "simulated",
    executedAt: new Date().toISOString(),
    receiptUrl: `https://invo.hotelsvendors.com/receipts/${settlementId}`,
    platformFee: Math.floor(amount * 0.025),
    netAmount: Math.floor(amount * 0.975),
  });
}, { rateLimit: "financial" });
