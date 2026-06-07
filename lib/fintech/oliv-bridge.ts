/**
 * Oliv Finance Bridge — Payment Orchestration Adapter
 * Hotels Vendors
 *
 * ⚠️  HotelsVendors does NOT hold or transfer cash.
 * This adapter sends factoring instructions to Oliv Finance.
 * Oliv pays the supplier directly. Oliv collects from the hotel later.
 * HotelsVendors tracks the workflow status only.
 *
 * Oliv Finance is Egypt's first FRA-licensed digital factoring company (Dec 2024).
 * Contact: https://oliv.finance
 */

import type {
  FactoringPartnerAdapter,
  InvoiceDataForPartner,
  PartnerOffer,
  WebhookResult,
} from "./factoring-bridge";

const OLIV_API_BASE = process.env.OLIV_API_URL || "https://api.oliv.finance/v1";
const OLIV_API_KEY = process.env.OLIV_API_KEY;
const USE_MOCK = !OLIV_API_KEY || process.env.OLIV_MOCK === "true";

const OLIV_CONFIG = {
  standardAdvanceRate: 0.88,
  standardDiscountRate: 0.025,
  highRiskAdvanceRate: 0.82,
  highRiskDiscountRate: 0.035,
  minInvoiceAmount: 5000,
  maxInvoiceAmount: 5_000_000,
  standardSettlementDays: 90,
  highRiskSettlementDays: 60,
};

export class OlivFinanceAdapter implements FactoringPartnerAdapter {
  id = "oliv_finance";
  name = "Oliv Finance";
  type = "PAYMENT_RAIL" as const;

  async checkEligibility(invoice: InvoiceDataForPartner): Promise<PartnerOffer> {
    if (USE_MOCK) return this._mockEligibility(invoice);

    const res = await fetch(`${OLIV_API_BASE}/inquiries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OLIV_API_KEY}`,
      },
      body: JSON.stringify({
        hotel_tax_id: invoice.hotel.taxId,
        hotel_name: invoice.hotel.name,
        invoice_amount: invoice.grossAmount,
        eta_uuid: invoice.etaUuid,
        sector: "hospitality",
      }),
    });

    if (!res.ok) {
      return {
        eligible: false,
        partnerId: this.id,
        partnerName: this.name,
        maxAdvanceRate: 0,
        discountRate: 0,
        responseId: `oliv_err_${Date.now()}`,
        rejectionReason: `Oliv API error: ${res.status}`,
      };
    }

    const data = await res.json();
    return {
      eligible: data.eligible,
      partnerId: this.id,
      partnerName: this.name,
      maxAdvanceRate: data.max_advance_rate,
      discountRate: data.discount_rate,
      responseId: data.inquiry_id,
      estimatedDisbursement: data.estimated_disbursement,
      rejectionReason: data.rejection_reason,
    };
  }

  async submitInstruction(invoice: InvoiceDataForPartner): Promise<{
    success: boolean;
    instructionId: string;
    partnerFundingId: string;
    estimatedDisbursementDate: string;
  }> {
    if (USE_MOCK) return this._mockSubmit(invoice);

    const res = await fetch(`${OLIV_API_BASE}/factoring-instructions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OLIV_API_KEY}`,
        "Idempotency-Key": invoice.invoiceId,
      },
      body: JSON.stringify({
        invoice_number: invoice.invoiceNumber,
        eta_uuid: invoice.etaUuid,
        gross_amount: invoice.grossAmount,
        supplier: invoice.supplier,
        hotel: invoice.hotel,
        delivery_confirmed_at: invoice.deliveryConfirmedAt,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        instructionId: "",
        partnerFundingId: "",
        estimatedDisbursementDate: "",
      };
    }

    const data = await res.json();
    return {
      success: true,
      instructionId: data.instruction_id,
      partnerFundingId: data.funding_id,
      estimatedDisbursementDate: data.estimated_disbursement_date,
    };
  }

  async trackInstruction(instructionId: string) {
    if (USE_MOCK) return this._mockTrack(instructionId);

    const res = await fetch(`${OLIV_API_BASE}/instructions/${instructionId}/status`, {
      headers: { Authorization: `Bearer ${OLIV_API_KEY}` },
    });

    if (!res.ok) return { status: "PENDING" as const };

    const data = await res.json();
    return {
      status: data.status.toUpperCase(),
      disbursedAt: data.disbursed_at ? new Date(data.disbursed_at) : undefined,
      settledAt: data.settled_at ? new Date(data.settled_at) : undefined,
    };
  }

  async handleWebhook(payload: unknown): Promise<WebhookResult> {
    const event = payload as Record<string, unknown>;
    const eventType = (event.event_type as string) || "UNKNOWN";

    switch (eventType) {
      case "funding.disbursed":
        return {
          processed: true,
          eventType,
          instructionId: (event.instruction_id as string) || undefined,
          partnerFundingId: (event.funding_id as string) || undefined,
          updates: { disbursedAt: event.disbursed_at, status: "DISBURSED" },
        };
      case "funding.settled":
        return {
          processed: true,
          eventType,
          instructionId: (event.instruction_id as string) || undefined,
          updates: { settledAt: event.settled_at, status: "SETTLED" },
        };
      case "funding.defaulted":
        return {
          processed: true,
          eventType,
          instructionId: (event.instruction_id as string) || undefined,
          updates: { status: "DEFAULTED" },
        };
      default:
        return {
          processed: true,
          eventType,
          instructionId: (event.instruction_id as string) || undefined,
          updates: event,
        };
    }
  }

  // ── Mock implementations for development ──

  private async _mockEligibility(invoice: InvoiceDataForPartner): Promise<PartnerOffer> {
    await simulateLatency(400);

    if (invoice.grossAmount < OLIV_CONFIG.minInvoiceAmount) {
      return {
        eligible: false, partnerId: this.id, partnerName: this.name,
        maxAdvanceRate: 0, discountRate: 0,
        responseId: `oliv_${Date.now()}`,
        rejectionReason: `Below Oliv minimum of ${OLIV_CONFIG.minInvoiceAmount} EGP`,
      };
    }

    return {
      eligible: true,
      partnerId: this.id,
      partnerName: this.name,
      maxAdvanceRate: OLIV_CONFIG.standardAdvanceRate,
      discountRate: OLIV_CONFIG.standardDiscountRate,
      responseId: `oliv_${Date.now()}`,
      estimatedDisbursement: invoice.grossAmount * OLIV_CONFIG.standardAdvanceRate,
    };
  }

  private async _mockSubmit(_invoice: InvoiceDataForPartner) {
    await simulateLatency(600);
    return {
      success: true,
      instructionId: `oliv_inst_${Date.now()}`,
      partnerFundingId: `oliv_fund_${Date.now()}`,
      estimatedDisbursementDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    } as {
      success: boolean;
      instructionId: string;
      partnerFundingId: string;
      estimatedDisbursementDate: string;
    };
  }

  private async _mockTrack(_instructionId: string) {
    await simulateLatency(250);
    return { status: "DISBURSED" as const, disbursedAt: new Date() };
  }
}

function simulateLatency(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const olivFinanceAdapter = new OlivFinanceAdapter();
