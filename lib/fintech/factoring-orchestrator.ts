/**
 * Factoring Orchestrator
 * Hotels Vendors Fintech Layer — Production-Ready Factoring Lifecycle
 *
 * Orchestrates the complete non-recourse factoring flow:
 *   Order Confirmed → Risk Assessment → ETA Validation → Partner Inquiry →
 *   Hub Revenue Calculation → Funding Request → Disbursement → Settlement Tracking
 *
 * Key design decisions:
 * 1. Every step is persisted to FactoringRequest for audit trail
 * 2. Platform fee is ALWAYS deducted FIRST (Hub-Revenue invariant)
 * 3. No order ships without PaymentGuaranteed = true
 * 4. ETA UUID is mandatory — no exceptions
 * 5. Non-recourse only — supplier has zero default risk
 */

import { prisma } from "@/lib/prisma";
import type { FactoringRequestStatus, RiskTier } from "@prisma/client";
import { validateForFactoring } from "@/lib/eta/validator";
import { assessRisk, type RiskAssessment } from "@/lib/fintech/risk-engine";
import { calculateHubRevenue, type HubRevenueResult } from "@/lib/fintech/hub-revenue";
import {
  inquireAll,
  fundThroughPartner,
  trackSettlement,
  type InquiryResponse,
  type FundingRequest,
  type FundingResponse,
  type SettlementStatus,
} from "@/lib/fintech/factoring-bridge";

// ─────────────────────────────────────────
// 1. TYPES
// ─────────────────────────────────────────

export interface FactoringOrchestrationInput {
  orderId: string;
  invoiceId: string;
  triggeredBy: string; // userId or "SYSTEM"
  tenantId: string;
  preferredPartnerId?: string; // Optional: force a specific partner
}

export type OrchestrationStage =
  | "INIT"
  | "RISK_ASSESSMENT"
  | "ETA_VALIDATION"
  | "PARTNER_INQUIRY"
  | "HUB_REVENUE_CALC"
  | "FUNDING_REQUEST"
  | "DISBURSED"
  | "SETTLED"
  | "FAILED";

export interface OrchestrationResult {
  success: boolean;
  stage: OrchestrationStage;
  factoringRequestId?: string;
  error?: string;
  errorCode?: string;
  details: {
    riskAssessment?: RiskAssessment;
    etaValid?: boolean;
    etaError?: string;
    partnerOffers?: InquiryResponse[];
    bestOffer?: InquiryResponse | null;
    hubRevenue?: HubRevenueResult;
    fundingResponse?: FundingResponse;
    settlementStatus?: SettlementStatus;
  };
}

export interface FactoringPipelineState {
  factoringRequestId: string;
  stage: OrchestrationStage;
  orderId: string;
  invoiceId: string;
  hotelId: string;
  supplierId: string;
  tenantId: string;
  status: FactoringRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

// ─────────────────────────────────────────
// 2. MAIN ORCHESTRATION FUNCTION
// ─────────────────────────────────────────

/**
 * Run the complete factoring pipeline for an invoice.
 * This is the SINGLE ENTRY POINT for all factoring operations.
 */
export async function orchestrateFactoring(
  input: FactoringOrchestrationInput
): Promise<OrchestrationResult> {
  const { orderId, invoiceId, triggeredBy, tenantId, preferredPartnerId } = input;

  // Fetch authoritative data
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId, tenantId },
    include: { hotel: true, supplier: true, order: true },
  });

  if (!invoice) {
    return { success: false, stage: "FAILED", error: "Invoice not found", errorCode: "INVOICE_NOT_FOUND", details: {} };
  }

  if (invoice.factoringStatus === "PAID" || invoice.factoringStatus === "ACCEPTED") {
    return { success: false, stage: "FAILED", error: "Invoice already factored", errorCode: "ALREADY_FACTORED", details: {} };
  }

  const hotel = invoice.hotel;
  const supplier = invoice.supplier;
  const grossAmount = invoice.total;

  // ── Stage 1: Risk Assessment ───────────────────────────────
  let riskAssessment: RiskAssessment;
  try {
    riskAssessment = await assessRisk(hotel.id, tenantId);
  } catch (err) {
    return {
      success: false,
      stage: "FAILED",
      error: `Risk assessment failed: ${err instanceof Error ? err.message : String(err)}`,
      errorCode: "RISK_ASSESSMENT_FAILED",
      details: {},
    };
  }

  // CRITICAL risk = auto-reject (no factoring)
  if (riskAssessment.riskTier === "CRITICAL") {
    return {
      success: false,
      stage: "FAILED",
      error: "Hotel risk tier is CRITICAL. Factoring not available. Consider deposit or split payment via Smart Fix.",
      errorCode: "CRITICAL_RISK",
      details: { riskAssessment },
    };
  }

  // ── Stage 2: ETA Validation (COMPLIANCE GATE) ──────────────
  const etaResult = await validateForFactoring(invoiceId);
  if (!etaResult.valid) {
    // Update invoice status
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { factoringStatus: "NOT_FACTORABLE", etaStatus: "REJECTED" },
    });
    return {
      success: false,
      stage: "FAILED",
      error: `ETA validation failed: ${etaResult.message}`,
      errorCode: etaResult.code,
      details: { riskAssessment, etaValid: false, etaError: etaResult.message },
    };
  }

  // ── Stage 3: Create FactoringRequest (persistent record) ───
  const factoringRequest = await prisma.factoringRequest.create({
    data: {
      invoiceId,
      requestedAmount: grossAmount,
      factoringCompanyId: preferredPartnerId || "efg_hermes", // Will be updated after inquiry
      status: "UNDER_REVIEW",
      riskScore: riskAssessment.compositeScore,
      riskTier: riskAssessment.riskTier,
      tenantId,
    },
  });

  // ── Stage 4: Partner Inquiry (shop for best rate) ──────────
  const { bestOffer, allOffers } = await inquireAll({
    hotelTaxId: hotel.taxId,
    hotelName: hotel.name,
    hotelRiskScore: riskAssessment.compositeScore,
    hotelRiskTier: riskAssessment.riskTier,
    invoiceAmount: grossAmount,
    invoiceCurrency: invoice.currency,
    invoiceDueDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    etaUuid: invoice.etaUuid!,
  });

  if (!bestOffer) {
    await prisma.factoringRequest.update({
      where: { id: factoringRequest.id },
      data: { status: "REJECTED", partnerResponse: JSON.stringify(allOffers) },
    });
    return {
      success: false,
      stage: "FAILED",
      factoringRequestId: factoringRequest.id,
      error: "No factoring partner approved this invoice. All partners rejected.",
      errorCode: "NO_PARTNER_APPROVAL",
      details: { riskAssessment, etaValid: true, partnerOffers: allOffers, bestOffer: null },
    };
  }

  // Update with chosen partner
  await prisma.factoringRequest.update({
    where: { id: factoringRequest.id },
    data: {
      factoringCompanyId: bestOffer.partnerId!,
      advanceRate: bestOffer.maxAdvanceRate,
      discountRate: bestOffer.discountRate,
      status: "APPROVED",
      partnerResponse: JSON.stringify({ bestOffer, allOffers }),
    },
  });

  // ── Stage 5: Hub Revenue Calculation ───────────────────────
  const hubRevenue = await calculateHubRevenue({
    invoiceId,
    partnerDiscountRate: bestOffer.discountRate,
    advanceRate: bestOffer.maxAdvanceRate,
  });

  // Persist calculated fees
  await prisma.factoringRequest.update({
    where: { id: factoringRequest.id },
    data: {
      grossAmount: hubRevenue.grossAmount,
      platformFee: hubRevenue.netPlatformFee,
      netPlatformFee: hubRevenue.netPlatformFee,
      factoringFee: hubRevenue.factoringFee,
      disbursedAmount: hubRevenue.supplierDisbursement,
    },
  });

  // ── Stage 6: Funding Request ───────────────────────────────
  const fundingRequest: FundingRequest = {
    eligibilityResponseId: bestOffer.responseId,
    invoiceId,
    etaUuid: invoice.etaUuid!,
    grossAmount: hubRevenue.grossAmount,
    platformFee: hubRevenue.netPlatformFee,
    netDisbursement: hubRevenue.supplierDisbursement,
    supplierBankAccount: supplier.bankAccount || "",
    supplierBankName: supplier.bankName || "",
    supplierTaxId: supplier.taxId,
    hotelTaxId: hotel.taxId,
  };

  const fundingResponse = await fundThroughPartner(bestOffer.partnerId!, fundingRequest);

  if (!fundingResponse.success) {
    await prisma.factoringRequest.update({
      where: { id: factoringRequest.id },
      data: { status: "REJECTED" },
    });
    return {
      success: false,
      stage: "FAILED",
      factoringRequestId: factoringRequest.id,
      error: "Funding request failed at partner level.",
      errorCode: "FUNDING_FAILED",
      details: {
        riskAssessment,
        etaValid: true,
        partnerOffers: allOffers,
        bestOffer,
        hubRevenue,
        fundingResponse,
      },
    };
  }

  // ── Stage 7: Mark as Disbursed ─────────────────────────────
  await prisma.factoringRequest.update({
    where: { id: factoringRequest.id },
    data: {
      status: "DISBURSED",
      disbursedAt: fundingResponse.disbursedAt,
    },
  });

  // Update invoice
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      factoringStatus: "PAID",
      paymentStatus: "FACTORED",
      paidDate: fundingResponse.disbursedAt,
    },
  });

  // Update order: payment is now guaranteed
  await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentGuaranteed: true,
      paymentGuaranteeMethod: "FACTORING",
      paymentGuaranteeSetAt: new Date(),
    },
  });

  // Create credit transaction for audit trail
  await prisma.creditTransaction.create({
    data: {
      type: "FACTORING_ADVANCE",
      amount: hubRevenue.supplierDisbursement,
      description: `Factoring disbursement via ${bestOffer.partnerName} — Invoice ${invoice.invoiceNumber}`,
      hotelId: hotel.id,
      factoringCompanyId: bestOffer.partnerId,
      orderId,
      invoiceId,
      tenantId,
    },
  });

  // ── Stage 8: Return Success ────────────────────────────────
  return {
    success: true,
    stage: "DISBURSED",
    factoringRequestId: factoringRequest.id,
    details: {
      riskAssessment,
      etaValid: true,
      partnerOffers: allOffers,
      bestOffer,
      hubRevenue,
      fundingResponse,
    },
  };
}

// ─────────────────────────────────────────
// 3. SETTLEMENT TRACKING
// ─────────────────────────────────────────

/**
 * Check settlement status for a factoring request.
 * Called by cron job or webhook handler.
 */
export async function checkSettlement(
  factoringRequestId: string,
  tenantId: string
): Promise<{ status: SettlementStatus | null; factoringRequestId: string }> {
  const fr = await prisma.factoringRequest.findUnique({
    where: { id: factoringRequestId, tenantId },
    include: { factoringCompany: true },
  });

  if (!fr) return { status: null, factoringRequestId };

  const settlement = await trackSettlement(fr.factoringCompanyId, factoringRequestId);

  if (settlement) {
    // Update persisted state
    const newStatus: FactoringRequestStatus =
      settlement.status === "SETTLED"
        ? "SETTLED"
        : settlement.status === "DEFAULTED"
        ? "DEFAULTED"
        : fr.status;

    await prisma.factoringRequest.update({
      where: { id: factoringRequestId },
      data: {
        status: newStatus,
        settledAt: settlement.status === "SETTLED" ? new Date() : fr.settledAt,
        hotelPaidAt: settlement.hotelPaid ? new Date() : fr.hotelPaidAt,
      },
    });
  }

  return { status: settlement, factoringRequestId };
}

// ─────────────────────────────────────────
// 4. PIPELINE STATE QUERIES
// ─────────────────────────────────────────

/**
 * Get all active factoring pipelines for a tenant.
 */
export async function getActivePipelines(tenantId: string): Promise<FactoringPipelineState[]> {
  const requests = await prisma.factoringRequest.findMany({
    where: {
      tenantId,
      status: { in: ["PENDING", "UNDER_REVIEW", "APPROVED", "DISBURSED"] },
    },
    include: { invoice: { select: { orderId: true, hotelId: true, supplierId: true } } },
    orderBy: { createdAt: "desc" },
  });

  return requests.map((r) => ({
    factoringRequestId: r.id,
    stage: mapStatusToStage(r.status),
    orderId: r.invoice.orderId,
    invoiceId: r.invoiceId,
    hotelId: r.invoice.hotelId,
    supplierId: r.invoice.supplierId,
    tenantId: r.tenantId,
    status: r.status,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  }));
}

function mapStatusToStage(status: FactoringRequestStatus): OrchestrationStage {
  switch (status) {
    case "PENDING":
      return "INIT";
    case "UNDER_REVIEW":
      return "PARTNER_INQUIRY";
    case "APPROVED":
      return "HUB_REVENUE_CALC";
    case "REJECTED":
      return "FAILED";
    case "DISBURSED":
      return "DISBURSED";
    case "SETTLED":
      return "SETTLED";
    case "DEFAULTED":
      return "FAILED";
    default:
      return "INIT";
  }
}

// ─────────────────────────────────────────
// 5. BATCH OPERATIONS
// ─────────────────────────────────────────

/**
 * Process multiple invoices for factoring in parallel.
 * Useful for end-of-month batch processing.
 */
export async function batchOrchestrate(
  inputs: FactoringOrchestrationInput[]
): Promise<OrchestrationResult[]> {
  // Process sequentially to avoid race conditions on partner APIs
  const results: OrchestrationResult[] = [];
  for (const input of inputs) {
    const result = await orchestrateFactoring(input);
    results.push(result);
    // Small delay between requests to avoid rate limiting
    await new Promise((r) => setTimeout(r, 500));
  }
  return results;
}

// ─────────────────────────────────────────
// 6. REVERSAL / CANCELLATION
// ─────────────────────────────────────────

/**
 * Cancel a factoring request before disbursement.
 * Only allowed if status is PENDING, UNDER_REVIEW, or APPROVED.
 */
export async function cancelFactoringRequest(
  factoringRequestId: string,
  tenantId: string,
  reason: string,
  cancelledBy: string
): Promise<{ success: boolean; error?: string }> {
  const fr = await prisma.factoringRequest.findUnique({
    where: { id: factoringRequestId, tenantId },
  });

  if (!fr) return { success: false, error: "Factoring request not found" };

  if (["DISBURSED", "SETTLED"].includes(fr.status)) {
    return { success: false, error: `Cannot cancel factoring request with status: ${fr.status}` };
  }

  await prisma.factoringRequest.update({
    where: { id: factoringRequestId },
    data: {
      status: "REJECTED",
      partnerResponse: JSON.stringify({
        cancelled: true,
        reason,
        cancelledBy,
        cancelledAt: new Date().toISOString(),
      }),
    },
  });

  // Revert invoice status
  await prisma.invoice.update({
    where: { id: fr.invoiceId },
    data: { factoringStatus: "AVAILABLE" },
  });

  return { success: true };
}
