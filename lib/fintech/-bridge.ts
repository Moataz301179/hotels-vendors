/**
 * Finance Adapter — Payment Orchestration Layer
 */
import type { FactoringPartnerAdapter, InvoiceDataForPartner, PartnerOffer } from "./factoring-bridge";

export interface FinanceAdapter {
  partnerId: string;
  partnerName: string;
  canHandle(invoice: unknown): Promise<boolean>;
  requestOffer(invoice: unknown): Promise<{ eligible: boolean; maxAdvanceRate: number; discountRate: number; estimatedDisbursement?: number; rejectionReason?: string }>;
  executePayout(instruction: unknown): Promise<{ success: boolean; reference: string; disbursedAmount: number }>;
}

export const noopAdapter: FactoringPartnerAdapter = {
  id: "noop",
  partnerId: "noop",
  partnerName: "No Factoring Partner Configured",
  name: "No Factoring Partner Configured",
  type: "STANDARD",
  canHandle: async () => false,
  requestOffer: async () => ({
    eligible: false,
    maxAdvanceRate: 0,
    discountRate: 0,
    estimatedDisbursement: 0,
    rejectionReason: "No factoring partner configured",
  }),
  checkEligibility: async () => ({
    partnerId: "noop",
    partnerName: "No Factoring Partner Configured",
    responseId: "noop-response",
    eligible: false,
    maxAdvanceRate: 0,
    discountRate: 0,
    rejectionReason: "No factoring partner configured",
  }),
  submitInstruction: async () => {
    throw new Error("No factoring partner configured");
  },
  trackInstruction: async () => {
    throw new Error("No factoring partner configured");
  },
  handleWebhook: async () => {
    throw new Error("No factoring partner configured");
  },
};
