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
import { Prisma, type FactoringRequestStatus, type RiskTier } from "@prisma/client";
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
import { recordDisbursementJournal } from "@/lib/fintech/accounting-ledger";

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
    childInvoiceId?: string;
    approvalsCount?: number;
  };
}

export interface FactoringPipelineState {
  factoringRequestId: string;
  stage: OrchestrationStage;
  orderId: string | null;
  invoiceId: string | null;
  hotelId: string;
  supplierId: string | null;
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
  const grossAmount = new Prisma.Decimal(Number(invoice.total));

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

  const factor = await prisma.factoringCompany.findUnique({ where: { id: preferredPartnerId ?? "" } });
  if (factor && !factor.licenseVerified) {
    return { success: false, stage: "FAILED", error: "Factoring company license not verified", errorCode: "FACTOR_UNLICENSED", details: {} };
  }

  // ── Stage 3: Create FactoringRequest (persistent record) ───
  const factoringRequest = await prisma.factoringRequest.create({
    data: {
      invoiceId,
      requestedAmount: grossAmount,
      factoringCompanyId: preferredPartnerId ?? null,
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
    platformFee: hubRevenue.platformFee,
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
        hotelPaidAt: fr.hotelPaidAt,
      },
    });
  }

  return { status: settlement?.status ?? null, factoringRequestId };
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
    include: {
      invoice: { select: { orderId: true, hotelId: true, supplierId: true } },
      consolidatedInvoice: { select: { hotelId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return requests.map((r) => {
    const invoiceId = r.invoiceId || null;
    const orderId = r.invoice?.orderId || null;
    const hotelId = r.invoice?.hotelId || r.consolidatedInvoice?.hotelId || "";
    const supplierId = r.invoice?.supplierId || null;
    return {
      factoringRequestId: r.id,
      stage: mapStatusToStage(r.status),
      orderId,
      invoiceId,
      hotelId,
      supplierId,
      tenantId: r.tenantId,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    };
  });
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
  if (fr.invoiceId) {
    await prisma.invoice.update({
      where: { id: fr.invoiceId },
      data: { factoringStatus: "AVAILABLE" },
    });
  } else if (fr.consolidatedInvoiceId) {
    await prisma.consolidatedInvoice.update({
      where: { id: fr.consolidatedInvoiceId },
      data: { status: "DRAFT" },
    });
    // Also release all underlying child invoices from the master lock
    const childInvoices = await prisma.invoice.findMany({
      where: { consolidatedInvoiceId: fr.consolidatedInvoiceId },
      select: { id: true },
    });
    await prisma.invoice.updateMany({
      where: { id: { in: childInvoices.map((c) => c.id) } },
      data: { factoringStatus: "AVAILABLE" },
    });
  }

  return { success: true };
}

// ─────────────────────────────────────────
// 7. CONSOLIDATED REVERSE FACTORING LIFE-CYCLE
// ─────────────────────────────────────────

export interface ConsolidatedFactoringInput {
  consolidatedInvoiceId: string;
  triggeredBy: string;
  tenantId: string;
  preferredPartnerId?: string;
}

export async function orchestrateConsolidatedFactoring(
  input: ConsolidatedFactoringInput
): Promise<OrchestrationResult> {
  const { consolidatedInvoiceId, triggeredBy, tenantId, preferredPartnerId } = input;

  // 1. Fetch Consolidated Invoice details with child invoices
  const ci = await prisma.consolidatedInvoice.findUnique({
    where: { id: consolidatedInvoiceId, tenantId },
    include: {
      hotel: true,
      invoices: {
        include: { supplier: true, order: true }
      }
    }
  });

  if (!ci) {
    return { success: false, stage: "FAILED", error: "Consolidated Invoice not found", errorCode: "CONSOLIDATED_NOT_FOUND", details: {} };
  }

  if (ci.status === "DISBURSED" || ci.status === "APPROVED_BY_FACTOR") {
    return { success: false, stage: "FAILED", error: "Consolidated Invoice already factored", errorCode: "ALREADY_FACTORED", details: {} };
  }

  // ── "FOUR-EYES" DUAL AUTHORIZATION GATE: Enforce FRA Guidelines ──
  const approvals = await prisma.auditLog.findMany({
    where: {
      entityType: "CONSOLIDATED_INVOICE",
      entityId: consolidatedInvoiceId,
      action: "CONSOLIDATED_INVOICE_APPROVED",
      tenantId,
    },
    select: { actorId: true },
  });

  const distinctApprovers = new Set(approvals.map((a) => a.actorId).filter(Boolean));

  if (distinctApprovers.size < 2) {
    if (process.env.BYPASS_FOUR_EYES === "true" && process.env.NODE_ENV !== "production") {
      console.warn(
        `[AUDIT] Four-eyes bypass activated — development only. Package ${consolidatedInvoiceId} by actor ${triggeredBy}.`
      );
    } else {
      return {
        success: false,
        stage: "FAILED",
        error: "FRA Guideline Violation: Consolidated invoice factoring requires 'Four-Eyes' dual authorization from two distinct authorized users.",
        errorCode: "FOUR_EYES_APPROVAL_REQUIRED",
        details: { approvalsCount: distinctApprovers.size },
      };
    }
  }

  // ── INVARIANT LOCK: Detect and prevent double-factoring vectors ──
  const invoiceIds = ci.invoices.map((inv) => inv.id);

  if (invoiceIds.length > 0) {
    try {
      await prisma.$transaction(async (tx) => {
        // 1. Instantly isolate all underlying supplier child invoices and apply a PostgreSQL pessimistic row-level lock
        const lockedChildInvoices = await tx.$queryRaw<any[]>`
          SELECT id, "invoiceNumber", "factoringStatus" FROM "Invoice"
          WHERE id IN (${Prisma.join(invoiceIds)})
          FOR UPDATE
        `;

        // 2. Validate double-factoring attempt
        for (const lockedInv of lockedChildInvoices) {
          if (
            lockedInv.factoringStatus === "LOCKED_BY_MASTER" ||
            lockedInv.factoringStatus === "ACCEPTED" ||
            lockedInv.factoringStatus === "PAID"
          ) {
            // Log a 'FRAUDULENT_DOUBLE_FACTOR_ATTEMPT' security event to our append-only AuditLog
            await tx.auditLog.create({
              data: {
                action: "FRAUDULENT_DOUBLE_FACTOR_ATTEMPT",
                entityType: "CONSOLIDATED_INVOICE",
                entityId: consolidatedInvoiceId,
                actorId: triggeredBy,
                afterState: JSON.stringify({
                  message: `Security Breach: Fraudulent double-factoring attempt detected. Invoice ${lockedInv.invoiceNumber} (ID: ${lockedInv.id}) has a conflicting factoring status: ${lockedInv.factoringStatus}.`,
                  invoiceId: lockedInv.id,
                  invoiceNumber: lockedInv.invoiceNumber,
                  status: lockedInv.factoringStatus,
                }),
                tenantId,
              }
            });

            throw new Error(`FRAUDULENT_DOUBLE_FACTOR_ATTEMPT: Conflicting status on invoice ${lockedInv.invoiceNumber}. Liquidation aborted to prevent double factoring.`);
          }
        }

        // 3. Atomically transition the state of these underlying child records to 'LOCKED_BY_MASTER'
        await tx.invoice.updateMany({
          where: { id: { in: invoiceIds } },
          data: { factoringStatus: "LOCKED_BY_MASTER" },
        });
      });
    } catch (err) {
      return {
        success: false,
        stage: "FAILED",
        error: err instanceof Error ? err.message : String(err),
        errorCode: "DOUBLE_FACTORING_DETECTED",
        details: {},
      };
    }
  }

  // Lock release helper for graceful rollbacks on failure
  const releaseLock = async () => {
    await prisma.invoice.updateMany({
      where: { id: { in: invoiceIds } },
      data: { factoringStatus: "AVAILABLE" },
    });
  };

  const hotel = ci.hotel;
  const grossAmount = Number(ci.total);

  // ── Stage 1: Risk Assessment ───────────────────────────────
  let riskAssessment;
  try {
    riskAssessment = await assessRisk(hotel.id, tenantId);
  } catch (err) {
    await releaseLock();
    return {
      success: false,
      stage: "FAILED",
      error: `Risk assessment failed: ${err instanceof Error ? err.message : String(err)}`,
      errorCode: "RISK_ASSESSMENT_FAILED",
      details: {},
    };
  }

  if (riskAssessment.riskTier === "CRITICAL") {
    await releaseLock();
    return {
      success: false,
      stage: "FAILED",
      error: "Hotel risk tier is CRITICAL. Factoring not available.",
      errorCode: "CRITICAL_RISK",
      details: { riskAssessment },
    };
  }

  // ── Stage 2: ETA Validation (COMPLIANCE GATE for each supplier invoice) ──────────────
  for (const invoice of ci.invoices) {
    const etaResult = await validateForFactoring(invoice.id);
    if (!etaResult.valid) {
      await prisma.consolidatedInvoice.update({
        where: { id: consolidatedInvoiceId },
        data: { status: "DRAFT" },
      });
      await releaseLock();
      return {
        success: false,
        stage: "FAILED",
        error: `ETA validation failed for Invoice ${invoice.invoiceNumber}: ${etaResult.message}`,
        errorCode: etaResult.code,
        details: { riskAssessment, etaValid: false, etaError: etaResult.message },
      };
    }
  }

  // ── Stage 3: Create FactoringRequest ───
  const factoringRequest = await prisma.factoringRequest.create({
    data: {
      consolidatedInvoiceId,
      requestedAmount: grossAmount,
      factoringCompanyId: preferredPartnerId || "efg_hermes",
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
    invoiceCurrency: ci.currency,
    invoiceDueDate: ci.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    etaUuid: ci.invoices[0]?.etaUuid || "CONSOLIDATED_ETA_CLUSTER",
  });

  if (!bestOffer) {
    await prisma.factoringRequest.update({
      where: { id: factoringRequest.id },
      data: { status: "REJECTED", partnerResponse: JSON.stringify(allOffers) },
    });
    await releaseLock();
    return {
      success: false,
      stage: "FAILED",
      factoringRequestId: factoringRequest.id,
      error: "No factoring partner approved this consolidated invoice. All partners rejected.",
      errorCode: "NO_PARTNER_APPROVAL",
      details: { riskAssessment, etaValid: true, partnerOffers: allOffers, bestOffer: null },
    };
  }

  // Update factoring request with chosen partner
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

  // ── Stage 5: Tri-Tier Margins & Programmatic Split Calculation ───────────────────────
  const advanceRate = bestOffer.maxAdvanceRate;
  const factorDiscountRate = bestOffer.discountRate;
  const factoringFee = grossAmount.mul(factorDiscountRate);

  // Stream 1: Fintech Commission from Factor
  const factoringCommissionRate = new Prisma.Decimal(0.015);
  const factoringCommissionAmount = grossAmount.mul(advanceRate).mul(factoringCommissionRate);

  // Stream 3: Hotel Admin Fee
  const hotelAdminFeeRate = new Prisma.Decimal(Number(ci.hotelAdminFeeRate ?? 0.01));
  const hotelAdminFeeAmount = grossAmount.mul(hotelAdminFeeRate);

  // ── Yield Spread Guard Verification ──
  const isTreasuryOverridden = process.env.TREASURY_OVERRIDE === "true";

  for (const invoice of ci.invoices) {
    const supplierDiscountRateNum = invoice.supplierDiscountRate != null ? Number(invoice.supplierDiscountRate) : 0;
    const margin = supplierDiscountRateNum - factorDiscountRate;
    if (margin < 0.015 && !isTreasuryOverridden) {
      // Log a 'YIELD_SPREAD_BREACH' exception to our append-only AuditLog
      await prisma.auditLog.create({
        data: {
          action: "YIELD_SPREAD_BREACH",
          entityType: "CONSOLIDATED_INVOICE",
          entityId: consolidatedInvoiceId,
          actorId: triggeredBy,
          afterState: JSON.stringify({
            message: `Yield Spread Breach: Margin for Invoice ${invoice.invoiceNumber} (${(margin * 100).toFixed(2)}%) fell below the net positive 1.5% platform margin requirement.`,
            invoiceId: invoice.id,
            invoiceNumber: invoice.invoiceNumber,
            supplierDiscountRate: supplierDiscountRateNum,
            factorDiscountRate,
            margin,
          }),
          tenantId,
        }
      });

      await releaseLock();

      // Update factoring request status to show the breach
      await prisma.factoringRequest.update({
        where: { id: factoringRequest.id },
        data: { status: "REJECTED" },
      });

      throw new Error(
        `YIELD_SPREAD_BREACH: The delta between Supplier Cash-Discount (${(supplierDiscountRateNum * 100).toFixed(2)}%) and Factoring Fee (${(factorDiscountRate * 100).toFixed(2)}%) drops below the net positive 1.5% platform margin.`
      );
    }
  }

  // Stream 2: Supplier Cash-Discount Delta
  let totalSupplierDiscountAmount = 0;
  let totalSupplierDisbursement = 0;

  for (const invoice of ci.invoices) {
    const discountRate = invoice.supplierDiscountRate != null ? Number(invoice.supplierDiscountRate) : 0;
    const totalNum = invoice.total != null ? Number(invoice.total) : 0;
    const discountAmount = totalNum * discountRate;
    const cashRate = totalNum - discountAmount;

    totalSupplierDiscountAmount += discountAmount;
    totalSupplierDisbursement += cashRate;

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        acceleratedCashRate: cashRate,
        cashDiscountDelta: discountAmount - (Number(invoice.total) * factorDiscountRate),
      },
    });
  }

  // Pocketed Cash-Discount Delta
  const cashDiscountDelta = Math.max(0, totalSupplierDiscountAmount - factoringFee);

  // Update Consolidated Invoice totals
  await prisma.consolidatedInvoice.update({
    where: { id: consolidatedInvoiceId },
    data: {
      hotelAdminFeeAmount,
      status: "APPROVED_BY_FACTOR",
    },
  });

  // Persist calculated factoring fees
  await prisma.factoringRequest.update({
    where: { id: factoringRequest.id },
    data: {
      grossAmount,
      platformFee: factoringCommissionAmount + cashDiscountDelta + hotelAdminFeeAmount,
      factoringFee,
      disbursedAmount: totalSupplierDisbursement,
    },
  });

  // ── Stage 6: Partner Funding Request ───
  const fundingRequest = {
    eligibilityResponseId: bestOffer.responseId,
    invoiceId: consolidatedInvoiceId,
    etaUuid: ci.invoices[0]?.etaUuid || "CONSOLIDATED_ETA_CLUSTER",
    grossAmount,
    platformFee: factoringCommissionAmount + cashDiscountDelta + hotelAdminFeeAmount,
    netDisbursement: totalSupplierDisbursement,
    supplierBankAccount: ci.invoices[0]?.supplier?.bankAccount || "ESCROW_CUSTODY",
    supplierBankName: ci.invoices[0]?.supplier?.bankName || "ESCROW_BANK",
    supplierTaxId: ci.invoices[0]?.supplier?.taxId || "MULTIPLE",
    hotelTaxId: hotel.taxId,
  };

  const fundingResponse = await fundThroughPartner(bestOffer.partnerId!, fundingRequest);

  if (!fundingResponse.success) {
    await prisma.factoringRequest.update({
      where: { id: factoringRequest.id },
      data: { status: "REJECTED" },
    });
    await releaseLock();
    return {
      success: false,
      stage: "FAILED",
      factoringRequestId: factoringRequest.id,
      error: "Funding request failed at partner level.",
      errorCode: "FUNDING_FAILED",
      details: { riskAssessment, etaValid: true, partnerOffers: allOffers, bestOffer, fundingResponse },
    };
  }

  // ── Stage 7: Ledger Disbursement Bookkeeping & State Updates ───
  await prisma.$transaction(async (tx) => {
    // 1. Record Double-Entry Journal Entry
    await recordDisbursementJournal(tx, {
      consolidatedInvoiceId,
      tenantId,
      grossAmount,
      advanceRate,
      factoringCommissionRate,
      factoringCommissionAmount,
      factoringFee,
      supplierDiscountRate: 0.03, // aggregate representation
      supplierDiscountAmount: totalSupplierDiscountAmount,
      hotelAdminFeeRate,
      hotelAdminFeeAmount,
      supplierDisbursement: totalSupplierDisbursement,
    });

    // 2. Mark Factoring Request as Disbursed
    await tx.factoringRequest.update({
      where: { id: factoringRequest.id },
      data: {
        status: "DISBURSED",
        disbursedAt: fundingResponse.disbursedAt,
      },
    });

    // 3. Mark Consolidated Invoice as Disbursed
    await tx.consolidatedInvoice.update({
      where: { id: consolidatedInvoiceId },
      data: {
        status: "DISBURSED",
        paidDate: fundingResponse.disbursedAt,
      },
    });

    // 4. Update child Invoices as PAID / FACTORED
    for (const invoice of ci.invoices) {
      await tx.invoice.update({
        where: { id: invoice.id },
        data: {
          factoringStatus: "PAID",
          paymentStatus: "FACTORED",
          paidDate: fundingResponse.disbursedAt,
        },
      });

      // Update order: payment is guaranteed
      await tx.order.update({
        where: { id: invoice.orderId },
        data: {
          paymentGuaranteed: true,
          paymentGuaranteeMethod: "FACTORING",
          paymentGuaranteeSetAt: new Date(),
        },
      });

      // Create credit transaction for audit trail
      await tx.creditTransaction.create({
        data: {
          type: "FACTORING_ADVANCE",
          amount: (invoice.total != null ? Number(invoice.total) : 0) * (1 - (invoice.supplierDiscountRate != null ? Number(invoice.supplierDiscountRate) : 0)),
          description: `Disbursement for Invoice ${invoice.invoiceNumber} in Consolidated Cluster ${ci.invoiceNumber}`,
          hotelId: hotel.id,
          factoringCompanyId: bestOffer.partnerId,
          orderId: invoice.orderId,
          invoiceId: invoice.id,
          tenantId,
        },
      });
    }
  });

  return {
    success: true,
    stage: "DISBURSED",
    factoringRequestId: factoringRequest.id,
    details: {
      riskAssessment,
      etaValid: true,
      partnerOffers: allOffers,
      bestOffer,
      fundingResponse,
    },
  };
}
