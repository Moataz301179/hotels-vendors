import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { submitFactoringInstruction } from "@/lib/fintech/factoring-bridge";
import { apiRoute, authenticate, success, error, audit, requireIdempotencyKey, completeIdempotency, requirePermission } from "@/lib/api-utils";
import { z } from "zod";

const FundSchema = z.object({
  invoiceId: z.string().cuid(),
  partnerId: z.string().min(1),
});

/**
 * Submit a factoring instruction to a licensed partner.
 *
 * ⚠️  HotelsVendors does NOT transfer funds.
 * This endpoint sends invoice data to the factoring partner.
 * The partner pays the supplier directly and collects from the hotel later.
 *
 * HotelsVendors earns a referral fee from the partner (invoiced off-chain).
 */
export const POST = apiRoute(async (request: NextRequest) => {
  const auth = await authenticate(request);
  await requirePermission(auth, "factoring:fund");
  const body = await request.json();
  const data = FundSchema.parse(body);

  const invoice = await prisma.invoice.findUnique({
    where: { id: data.invoiceId },
    include: { hotel: true, supplier: true, order: true },
  });

  if (!invoice) {
    return error("Invoice not found", 404);
  }

  // Verify the user's entity matches the invoice
  const user = await prisma.user.findUnique({
    where: { id: auth.userId },
    select: { hotelId: true, supplierId: true },
  });
  if (auth.platformRole === "HOTEL" && invoice.hotelId !== user?.hotelId) {
    return error("Forbidden", 403);
  }
  if (auth.platformRole === "SUPPLIER" && invoice.supplierId !== user?.supplierId) {
    return error("Forbidden", 403);
  }

  // Idempotency — prevent duplicate factoring submissions
  const idempotencyKey = await requireIdempotencyKey(request, {
    userId: auth.userId,
    action: "FACTORING_INSTRUCTION",
    amount: invoice.total,
  });

  // Prepare invoice data for the partner
  const invoiceData = {
    invoiceId: invoice.id,
    invoiceNumber: invoice.invoiceNumber,
    etaUuid: invoice.etaUuid || "",
    grossAmount: invoice.total,
    currency: invoice.currency,
    supplier: {
      name: invoice.supplier.name,
      taxId: invoice.supplier.taxId,
      bankAccount: invoice.supplier.bankAccount || "",
      bankName: invoice.supplier.bankName || "",
    },
    hotel: {
      name: invoice.hotel.name,
      taxId: invoice.hotel.taxId,
    },
    orderId: invoice.orderId,
    deliveryConfirmedAt: invoice.order?.createdAt?.toISOString() || new Date().toISOString(),
  };

  // Submit to partner — partner handles all fund transfers
  const result = await submitFactoringInstruction(data.partnerId, invoiceData);

  if (!result.success) {
    return error(result.error || "Partner rejected the instruction", 502);
  }

  // Update invoice status — platform orchestrates, partner transacts
  await prisma.invoice.update({
    where: { id: data.invoiceId },
    data: {
      factoringStatus: "ACCEPTED",
      factoringCompanyId: data.partnerId,
      paymentStatus: "FACTORED",
    },
  });

  // Create factoring request record (for tracking only — no cash handled)
  const factoringRequest = await prisma.factoringRequest.create({
    data: {
      tenantId: auth.tenantId,
      invoiceId: data.invoiceId,
      factoringCompanyId: data.partnerId,
      requestedAmount: invoice.total,
      status: "DISBURSED",
      // Terms are set by the partner, not the platform
      disbursedAt: new Date(),
      partnerResponse: JSON.stringify({
        instructionId: result.instructionId,
        partnerFundingId: result.partnerFundingId,
        estimatedDisbursementDate: result.estimatedDisbursementDate,
        note: "Funds disbursed directly by partner to supplier",
      }),
    },
  });

  await audit({
    entityType: "INVOICE",
    entityId: data.invoiceId,
    action: "FACTORING_INSTRUCTION_SUBMITTED",
    tenantId: auth.tenantId,
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      partnerId: data.partnerId,
      instructionId: result.instructionId,
      partnerFundingId: result.partnerFundingId,
      factoringRequestId: factoringRequest.id,
      note: "Partner handles all fund transfers. Platform does not hold cash.",
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  completeIdempotency(idempotencyKey, data.invoiceId);

  return success({
    instructionId: result.instructionId,
    partnerFundingId: result.partnerFundingId,
    estimatedDisbursementDate: result.estimatedDisbursementDate,
    factoringRequestId: factoringRequest.id,
  });
}, { rateLimit: "financial" });
