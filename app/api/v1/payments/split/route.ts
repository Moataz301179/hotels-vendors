/**
 * Split Payments API
 * POST — Create a split payment from a master invoice
 * GET — List split transactions for a tenant
 */

import { NextRequest } from "next/server";
import {
  apiRoute,
  authenticate,
  requirePermission,
  success,
  ApiError,
} from "@/lib/api-utils";
import { prisma } from "@/lib/prisma";
import { createSplitPayment, getSplitTransaction } from "@/lib/payments/split";

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:manage_payments");

  const body = await request.json();

  if (!body.masterInvoiceId || !body.totalAmount || !body.supplierId) {
    throw new ApiError("masterInvoiceId, totalAmount, and supplierId required", 400);
  }

  const masterInvoice = await prisma.masterInvoice.findUnique({
    where: { id: body.masterInvoiceId, tenantId: auth.tenantId },
  });

  if (!masterInvoice) {
    throw new ApiError("Master invoice not found", 404);
  }

  const result = await createSplitPayment({
    masterInvoiceId: body.masterInvoiceId,
    hotelId: masterInvoice.hotelId,
    tenantId: auth.tenantId,
    totalAmount: body.totalAmount,
    supplierId: body.supplierId,
    factoringCompanyId: body.factoringCompanyId,
    factoringFeeRate: body.factoringFeeRate,
    logisticsFee: body.logisticsFee,
    logisticsProviderId: body.logisticsProviderId,
  });

  return success(result, 201);
});

export const GET = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "admin:read");

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 200);

  const txs = await prisma.splitTransaction.findMany({
    where: {
      tenantId: auth.tenantId,
      ...(status && { status: status as any }),
    },
    include: { splits: true },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return success(txs);
});
