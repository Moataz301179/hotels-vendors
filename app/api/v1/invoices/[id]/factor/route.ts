import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { inquireAll, fundThroughPartner } from "@/lib/fintech/factoring-bridge";
import { validateForFactoring } from "@/lib/eta/validator";
import { assessRisk } from "@/lib/fintech/risk-engine";
import { calculateHubRevenue } from "@/lib/fintech/hub-revenue";
import { apiRoute, authenticate, success, error, audit, requireIdempotencyKey, completeIdempotency } from "@/lib/api-utils";

export const POST = apiRoute(async (request: NextRequest, { params }: { params?: Promise<{ id: string }> }) => {
  const auth = await authenticate(request);
  const resolved = await params;
  if (!resolved) return error("Missing parameter", 400);
  const { id } = resolved;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
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

  const idempotencyKey = await requireIdempotencyKey(request, { userId: auth.userId, action: "INVOICE_FACTOR", amount: invoice.total });

  // Validate ETA compliance
  const etaValid = await validateForFactoring(id);
  if (!etaValid.valid) {
    return error(`Factoring blocked: ${etaValid.message}`, 422);
  }

  // Assess risk
  const risk = await assessRisk(invoice.hotelId);

  // Inquire partners
  const { bestOffer, allOffers } = await inquireAll({
    hotelTaxId: invoice.hotel.taxId,
    hotelName: invoice.hotel.name,
    hotelRiskScore: risk.compositeScore,
    hotelRiskTier: risk.riskTier,
    invoiceAmount: invoice.total,
    invoiceCurrency: "EGP",
    invoiceDueDate: invoice.dueDate || new Date(),
    etaUuid: invoice.etaUuid || "",
  });

  if (!bestOffer || !bestOffer.partnerId) {
    return error("No factoring partner eligible for this invoice", 422);
  }

  // Calculate hub revenue
  const hubRev = await calculateHubRevenue({
    invoiceId: id,
    partnerDiscountRate: bestOffer.discountRate,
    advanceRate: bestOffer.maxAdvanceRate,
  });

  // Execute funding
  const funding = await fundThroughPartner(bestOffer.partnerId, {
    eligibilityResponseId: bestOffer.responseId,
    invoiceId: id,
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

  // Update invoice
  await prisma.invoice.update({
    where: { id },
    data: {
      factoringStatus: "ACCEPTED",
      factoringCompanyId: bestOffer.partnerId,
      factoringAmount: funding.disbursedAmount,
      paymentStatus: "FACTORED",
    },
  });

  // Create factoring request record
  await prisma.factoringRequest.create({
    data: {
      invoiceId: id,
      factoringCompanyId: bestOffer.partnerId,
      requestedAmount: invoice.total,
      status: "DISBURSED",
      riskScore: risk.compositeScore,
      riskTier: risk.riskTier,
      advanceRate: bestOffer.maxAdvanceRate,
      discountRate: bestOffer.discountRate,
      platformFeeRate: hubRev.platformFeeRate,
      grossAmount: invoice.total,
      platformFee: hubRev.netPlatformFee,
      netPlatformFee: hubRev.netPlatformFee,
      factoringFee: hubRev.factoringFee,
      disbursedAmount: funding.disbursedAmount,
      disbursedAt: funding.disbursedAt,
      partnerResponse: JSON.stringify(funding.partnerResponse || {}),
    },
  });

  await audit({
    entityType: "INVOICE",
    entityId: id,
    action: "FACTORING_FUNDED",
    actorId: auth.userId,
    actorRole: auth.platformRole,
    afterState: {
      partnerId: bestOffer.partnerId,
      disbursedAmount: funding.disbursedAmount,
      platformFee: hubRev.netPlatformFee,
      factoringFee: hubRev.factoringFee,
    },
    ipAddress: request.headers.get("x-forwarded-for") || null,
    userAgent: request.headers.get("user-agent"),
  });

  completeIdempotency(idempotencyKey, id);

  return success({
    message: "Factoring funded successfully",
    funding,
    hubRevenue: hubRev,
    offers: allOffers,
  });
});
