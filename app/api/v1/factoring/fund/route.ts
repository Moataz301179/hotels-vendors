import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { fundThroughPartner } from "@/lib/fintech/factoring-bridge";
import { calculateHubRevenue } from "@/lib/fintech/hub-revenue";
import { apiRoute, authenticate, success, error, audit, requireIdempotencyKey, completeIdempotency } from "@/lib/api-utils";
import { z } from "zod";

const FundSchema = z.object({
  invoiceId: z.string().cuid(),
  partnerId: z.string().min(1),
  eligibilityResponseId: z.string().min(1),
});

export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  const body = await request.json();
  const data = FundSchema.parse(body);

  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
    include: { hotel: true, supplier: true, order: true },
  });

  if (!invoice) {
    return error("Invoice not found", 404);
  }

  if (auth.platformRole === "HOTEL" && invoice.hotelId !== auth.tenantId) {
    return error("Forbidden", 403);
  }
  if (auth.platformRole === "SUPPLIER" && invoice.supplierId !== auth.tenantId) {
    return error("Forbidden", 403);
  }

  const idempotencyKey = await requireIdempotencyKey(request, { userId: auth.userId, action: "FACTORING_FUND", amount: invoice.total });

  const hubRev = await calculateHubRevenue({
    invoiceId: data.invoiceId,
    partnerDiscountRate: 0.02,
    advanceRate: 0.9,
  });

  const funding = await fundThroughPartner(data.partnerId, {
    eligibilityResponseId: data.eligibilityResponseId,
    invoiceId: data.invoiceId,
    etaUuid: invoice.etaUuid || "",
    grossAmount: invoice.total,
    platformFee: hubRev.netPlatformFee,
    netDisbursement: hubRev.supplierDisbursement,
    supplierBankAccount: invoice.supplier.bankAccount || "",
    supplierBankName: invoice.supplier.bankName || "",
    supplierTaxId: invoice.supplier.taxId,
    hotelTaxId: invoice.hotel.taxId,
  });

  if (!funding.success) {
    return error("Funding execution failed", 502);
  }

  await prisma.invoice.update({
    where: { id: data.invoiceId },
    data: {
      factoringStatus: "ACCEPTED",
      factoringCompanyId: data.partnerId,
      factoringAmount: funding.disbursedAmount,
      paymentStatus: "FACTORED",
    },
  });

  await prisma.factoringRequest.create({
    data: {
      invoiceId: data.invoiceId,
      factoringCompanyId: data.partnerId,
      requestedAmount: invoice.total,
      status: "DISBURSED",
      advanceRate: 0.9,
      discountRate: 0.02,
      platformFeeRate: hubRev.platformFeeRate,
      grossAmount: invoice.total,
      platformFee: hubRev.netPlatformFee,
      netPlatformFee: hubRev.netPlatformFee,
      factoringFee: hubRev.factoringFee,
      disbursedAmount: funding.disbursedAmount,
      disbursedAt: funding.disbursedAt,
    },
  });

  await audit({
    entityType: "INVOICE",
    entityId: data.invoiceId,
    action: "FACTORING_FUND",
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      partnerId: data.partnerId,
      disbursedAmount: funding.disbursedAmount,
      platformFee: hubRev.netPlatformFee,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  completeIdempotency(idempotencyKey, data.invoiceId);

  return success({ funding, hubRevenue: hubRev });
});
