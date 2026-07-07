/*
  ETA e-invoicing economics for HotelsVendors.

  Market reality (researched):
  - The ETA (Egyptian Tax Authority) charges NO fee to submit invoices.
  - Real hard costs are: an annual digital-signature certificate (fixed) + tiny compute per invoice.
  - Competitors charge 1%–1.5% of invoice VALUE. That is really factoring pricing dressed
    up as "compliance". Honest SaaS players charge flat $20–200/mo.

  HotelsVendors advantage:
  - The ETA invoice is auto-generated from an order that already exists on INVO
    (PO, line items, tax IDs, GRN). Marginal cost is near-zero.
  - We therefore price PER-INVOICE or FLAT, never a % of value.

  All money in piastres (EGP * 100).
*/

export type EtaTier = "bundled" | "saas" | "payg";

export const ETA_PRICING = {
  // Bundled inside the 2.5% marketplace fee — no extra charge.
  bundled: { label: "Bundled", perInvoice: 0, monthly: 0, note: "Included free with marketplace orders" },
  // Flat monthly SaaS for off-platform invoices.
  saas: { label: "Flat SaaS", perInvoice: 0, monthly: 29900, note: "EGP 299 / month, unlimited invoices" }, // 29900 piastres = EGP 299
  // Pay-as-you-go for low volume.
  payg: { label: "Pay-as-you-go", perInvoice: 500, monthly: 0, note: "EGP 5 per invoice, no subscription" }, // 500 piastres = EGP 5
} as const;

// Competitor benchmark: 1.25% of invoice value.
export const COMPETITOR_RATE_BPS = 125;

export type EtaSavings = {
  invoiceValue: number;
  monthlyVolume: number;
  competitorMonthlyCost: number;
  ourMonthlyCost: number;
  monthlySaving: number;
  annualSaving: number;
  savingPct: number;
  ourEffectiveBps: number;      // our cost as bps of value (to show ~0.1% vs 1.25%)
};

export function computeEtaSavings(
  avgInvoiceValue: number,
  monthlyVolume: number,
  tier: EtaTier
): EtaSavings {
  const totalValue = avgInvoiceValue * monthlyVolume;
  const competitorMonthlyCost = Math.round((totalValue * COMPETITOR_RATE_BPS) / 10000);

  const p = ETA_PRICING[tier];
  const ourMonthlyCost = p.monthly + p.perInvoice * monthlyVolume;

  const monthlySaving = Math.max(0, competitorMonthlyCost - ourMonthlyCost);
  const annualSaving = monthlySaving * 12;
  const savingPct = competitorMonthlyCost > 0 ? Math.round((monthlySaving / competitorMonthlyCost) * 100) : 100;
  const ourEffectiveBps = totalValue > 0 ? Math.round((ourMonthlyCost / totalValue) * 10000 * 10) / 10 : 0;

  return {
    invoiceValue: avgInvoiceValue,
    monthlyVolume,
    competitorMonthlyCost,
    ourMonthlyCost,
    monthlySaving,
    annualSaving,
    savingPct,
    ourEffectiveBps,
  };
}
