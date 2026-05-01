/**
 * Factoring API Bridge
 * Hotels Vendors Fintech Layer
 *
 * Unified interface for factoring partners (EFG Hermes, Contact, etc.)
 * Abstracts partner-specific APIs behind a common interface.
 */

import type { RiskTier } from "./risk-engine";

// ─────────────────────────────────────────
// 1. SHARED TYPES
// ─────────────────────────────────────────

export interface EligibilityRequest {
  hotelTaxId: string;
  hotelName: string;
  hotelRiskScore: number;
  hotelRiskTier: RiskTier;
  invoiceAmount: number;
  invoiceCurrency: string;
  invoiceDueDate: Date;
  etaUuid: string;
}

export interface InquiryResponse {
  eligible: boolean;
  partnerId?: string;
  partnerName?: string;
  maxAdvanceRate: number; // 0.90 = 90%
  discountRate: number; // 0.02 = 2%
  responseId: string;
  conditionalTerms?: string;
  rejectionReason?: string;
  estimatedDisbursement?: number;
}

export interface FundingRequest {
  eligibilityResponseId: string;
  invoiceId: string;
  etaUuid: string;
  grossAmount: number;
  platformFee: number; // Hub fee — DEDUCTED FIRST
  netDisbursement: number; // To supplier
  supplierBankAccount: string;
  supplierBankName: string;
  supplierTaxId: string;
  hotelTaxId: string;
}

export interface FundingResponse {
  success: boolean;
  factoringRequestId: string;
  disbursedAmount: number;
  disbursedAt: Date;
  transactionReference: string;
  expectedSettlementDate: Date;
  partnerResponse?: Record<string, unknown>;
}

export interface SettlementStatus {
  status: "PENDING" | "DISBURSED" | "SETTLED" | "DEFAULTED" | "DISPUTED";
  disbursedAmount: number;
  settledAmount: number;
  remainingAmount: number;
  hotelPaid: boolean;
  hotelPaidAt?: Date;
  lastUpdated: Date;
}

export interface WebhookResult {
  processed: boolean;
  eventType: string;
  factoringRequestId?: string;
  updates: Record<string, unknown>;
}

// ─────────────────────────────────────────
// 2. PARTNER INTERFACE
// ─────────────────────────────────────────

export interface FactoringPartnerAdapter {
  id: string;
  name: string;
  type: "STANDARD" | "HIGH_RISK";
  
  inquiry(request: EligibilityRequest): Promise<InquiryResponse>;
  fund(request: FundingRequest): Promise<FundingResponse>;
  track(factoringRequestId: string): Promise<SettlementStatus>;
  handleWebhook(payload: unknown): Promise<WebhookResult>;
}

// ─────────────────────────────────────────
// 3. MOCK PARTNER ADAPTERS
// ─────────────────────────────────────────

/**
 * EFG Hermes — Standard factoring partner
 * Mock implementation for development. Replace with real API calls.
 */
class EfgHermesAdapter implements FactoringPartnerAdapter {
  id = "efg_hermes";
  name = "EFG Hermes Factoring";
  type: "STANDARD" | "HIGH_RISK" = "STANDARD";

  async inquiry(request: EligibilityRequest): Promise<InquiryResponse> {
    // Simulate API latency
    await simulateLatency(300);

    // Reject CRITICAL risk
    if (request.hotelRiskTier === "CRITICAL") {
      return {
        eligible: false,
        maxAdvanceRate: 0,
        discountRate: 0,
        responseId: `efg_${Date.now()}`,
        rejectionReason: "Hotel risk tier exceeds EFG Hermes underwriting criteria",
      };
    }

    // HIGH risk gets lower advance
    const advanceRate = request.hotelRiskTier === "HIGH" ? 0.85 : 0.90;
    const discountRate = request.hotelRiskTier === "HIGH" ? 0.025 : 0.02;

    return {
      eligible: true,
      partnerId: this.id,
      partnerName: this.name,
      maxAdvanceRate: advanceRate,
      discountRate,
      responseId: `efg_${Date.now()}`,
      estimatedDisbursement: request.invoiceAmount * advanceRate,
    };
  }

  async fund(request: FundingRequest): Promise<FundingResponse> {
    await simulateLatency(500);

    // Simulate successful disbursement
    const disbursedAt = new Date();
    const expectedSettlementDate = new Date(disbursedAt);
    expectedSettlementDate.setDate(expectedSettlementDate.getDate() + 90); // 90-day terms

    return {
      success: true,
      factoringRequestId: `efg_fund_${Date.now()}`,
      disbursedAmount: request.netDisbursement,
      disbursedAt,
      transactionReference: `EFG-${Math.floor(Math.random() * 1000000)}`,
      expectedSettlementDate,
    };
  }

  async track(factoringRequestId: string): Promise<SettlementStatus> {
    await simulateLatency(200);

    // Mock tracking
    return {
      status: "DISBURSED",
      disbursedAmount: 90000,
      settledAmount: 0,
      remainingAmount: 90000,
      hotelPaid: false,
      lastUpdated: new Date(),
    };
  }

  async handleWebhook(payload: unknown): Promise<WebhookResult> {
    const event = payload as Record<string, unknown>;
    return {
      processed: true,
      eventType: (event.eventType as string) || "UNKNOWN",
      factoringRequestId: (event.factoringRequestId as string) || undefined,
      updates: event,
    };
  }
}

/**
 * Contact Financial — High-risk factoring specialist
 * Mock implementation for development. Replace with real API calls.
 */
class ContactHighRiskAdapter implements FactoringPartnerAdapter {
  id = "contact_high_risk";
  name = "Contact Financial — SME Desk";
  type: "STANDARD" | "HIGH_RISK" = "HIGH_RISK";

  async inquiry(request: EligibilityRequest): Promise<InquiryResponse> {
    await simulateLatency(400);

    // Contact specializes in HIGH and MEDIUM risk
    if (request.hotelRiskTier === "LOW") {
      return {
        eligible: false,
        maxAdvanceRate: 0,
        discountRate: 0,
        responseId: `contact_${Date.now()}`,
        rejectionReason: "Contact Financial specializes in medium-to-high risk hotels. For low-risk hotels, use EFG Hermes.",
      };
    }

    // Higher rates for higher risk
    const advanceRate = request.hotelRiskTier === "CRITICAL" ? 0.80 : 0.85;
    const discountRate = request.hotelRiskTier === "CRITICAL" ? 0.04 : 0.03;

    return {
      eligible: true,
      partnerId: this.id,
      partnerName: this.name,
      maxAdvanceRate: advanceRate,
      discountRate,
      responseId: `contact_${Date.now()}`,
      estimatedDisbursement: request.invoiceAmount * advanceRate,
    };
  }

  async fund(request: FundingRequest): Promise<FundingResponse> {
    await simulateLatency(600);

    const disbursedAt = new Date();
    const expectedSettlementDate = new Date(disbursedAt);
    expectedSettlementDate.setDate(expectedSettlementDate.getDate() + 60); // Shorter terms for high-risk

    return {
      success: true,
      factoringRequestId: `contact_fund_${Date.now()}`,
      disbursedAmount: request.netDisbursement,
      disbursedAt,
      transactionReference: `CNT-${Math.floor(Math.random() * 1000000)}`,
      expectedSettlementDate,
    };
  }

  async track(factoringRequestId: string): Promise<SettlementStatus> {
    await simulateLatency(200);
    return {
      status: "DISBURSED",
      disbursedAmount: 85000,
      settledAmount: 0,
      remainingAmount: 85000,
      hotelPaid: false,
      lastUpdated: new Date(),
    };
  }

  async handleWebhook(payload: unknown): Promise<WebhookResult> {
    const event = payload as Record<string, unknown>;
    return {
      processed: true,
      eventType: (event.eventType as string) || "UNKNOWN",
      factoringRequestId: (event.factoringRequestId as string) || undefined,
      updates: event,
    };
  }
}

// ─────────────────────────────────────────
// 4. BRIDGE REGISTRY
// ─────────────────────────────────────────

const PARTNERS: Map<string, FactoringPartnerAdapter> = new Map([
  ["efg_hermes", new EfgHermesAdapter()],
  ["contact_high_risk", new ContactHighRiskAdapter()],
]);

export function getPartner(id: string): FactoringPartnerAdapter | undefined {
  return PARTNERS.get(id);
}

export function getAllPartners(): FactoringPartnerAdapter[] {
  return Array.from(PARTNERS.values());
}

export function getPartnersByType(type: "STANDARD" | "HIGH_RISK"): FactoringPartnerAdapter[] {
  return Array.from(PARTNERS.values()).filter((p) => p.type === type);
}

// ─────────────────────────────────────────
// 5. UNIFIED BRIDGE FUNCTIONS
// ─────────────────────────────────────────

/**
 * Submit an eligibility inquiry to ALL matching partners and return the best offer.
 */
export async function inquireAll(
  request: EligibilityRequest,
  partnerType?: "STANDARD" | "HIGH_RISK"
): Promise<{ bestOffer: InquiryResponse | null; allOffers: InquiryResponse[] }> {
  const partners = partnerType
    ? getPartnersByType(partnerType)
    : getAllPartners();

  const offers = await Promise.all(
    partners.map(async (partner) => {
      try {
        return await partner.inquiry(request);
      } catch {
        return {
          eligible: false,
          maxAdvanceRate: 0,
          discountRate: 0,
          responseId: `${partner.id}_error`,
          rejectionReason: "Partner inquiry failed",
        } as InquiryResponse;
      }
    })
  );

  const eligibleOffers = offers.filter((o) => o.eligible);

  // Best offer = highest net disbursement (advanceRate - discountRate)
  const bestOffer = eligibleOffers.length > 0
    ? eligibleOffers.reduce((best, current) => {
        const bestNet = best.maxAdvanceRate - best.discountRate;
        const currentNet = current.maxAdvanceRate - current.discountRate;
        return currentNet > bestNet ? current : best;
      })
    : null;

  return { bestOffer, allOffers: offers };
}

/**
 * Fund a specific invoice through a specific partner.
 */
export async function fundThroughPartner(
  partnerId: string,
  request: FundingRequest
): Promise<FundingResponse> {
  const partner = getPartner(partnerId);
  if (!partner) {
    return {
      success: false,
      factoringRequestId: "",
      disbursedAmount: 0,
      disbursedAt: new Date(),
      transactionReference: "",
      expectedSettlementDate: new Date(),
    };
  }

  return partner.fund(request);
}

/**
 * Track settlement status across all partners for a factoring request.
 */
export async function trackSettlement(
  partnerId: string,
  factoringRequestId: string
): Promise<SettlementStatus | null> {
  const partner = getPartner(partnerId);
  if (!partner) return null;
  return partner.track(factoringRequestId);
}

// ─────────────────────────────────────────
// 6. UTILITIES
// ─────────────────────────────────────────

function simulateLatency(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
