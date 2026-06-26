/**
 * Direct Hotel → Supplier Settlement (Net-60 path)
 *
 * Hotels on negotiated credit terms (Net-30, Net-60) pay suppliers directly
 * without factoring. This route creates a DIRECT settlement Payment record.
 */

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { apiRoute, authenticate, success, error, requirePermission, audit } from "@/lib/api-utils";
import { z } from "zod";

const SettleSchema = z.object({
  invoiceId: z.string().min(1),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "payment:create");

  const body = await request.json();
  const { invoiceId } = SettleSchema.parse(body);

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { hotel: true, supplier: true },
  });

  if (!invoice) return error("Invoice not found", 404);
  if (invoice.tenantId !== auth.tenantId) return error("Not found", 404);
  if (invoice.factoringStatus === "PAID" || invoice.factoringStatus === "ACCEPTED") {
    return error("Invoice already settled or factored", 409);
  }

  const total = invoice.total;

  const payment = await prisma.payment.create({
    data: {
      paymentNumber: `PAY-${Date.now()}`,
      invoiceId: invoice.id,
      hotelId: invoice.hotelId,
      amount: total,
      status: "PENDING",
      tenantId: auth.tenantId,
    },
  });

  await audit({
    entityType: "Payment",
    entityId: payment.id,
    action: "payment:create",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: { amount: total.toString(), settlementType: "DIRECT" },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  return success({ payment });
});
