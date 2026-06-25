/**
 * HotelsVendors — Platform Fee Structure
 *
 * LEGAL: Platform operates under digital marketing license only.
 * No cash custody. No factoring. No lending. No wallet balances.
 *
 * Revenue streams:
 * 1. SaaS subscription (supplier listing plans via INVO)
 * 2. Document processing (per ETA invoice submission)
 * 3. Marketplace commission (per transaction, not financial spread)
 */

export const FEE_STRUCTURE = {
  saas: {
    supplierListingPlan: {
      tier: "INVO marketplace subscription",
      pricing: "Per INVO plan — see /pricing",
      frequency: "monthly_or_annual",
    },
  },
  documentProcessing: {
    etaInvoiceSubmission: {
      description: "Per-document fee for ETA e-invoicing compliance submission",
      pricing: "Variable — quoted per invoice volume",
      frequency: "per_submission",
      authority: "Egyptian Tax Authority (ETA)",
    },
  },
  marketplace: {
    transactionCommission: {
      description: "Percentage of transaction value — NOT a financial spread",
      pricing: "Negotiated per supplier agreement",
      frequency: "per_settlement",
      legalNote: "Platform does not hold or transfer cash. All settlements processed by licensed payment partners.",
    },
  },
} as const;

export const MANDATORY_DISCLAIMER =
  "Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults.";
