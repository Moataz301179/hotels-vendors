/**
 * Oliv Payment Integration — Phase 1 (Referral)
 *
 * HotelsVendors refers suppliers to Oliv for invoice financing.
 * No embedded payment flow yet — just referral redirect.
 *
 * Phase 2 (planned): Embedded Oliv SDK for in-app payments.
 */

export interface OlivReferralPayload {
  orderId: string;
  invoiceId: string;
  supplierId: string;
  supplierName: string;
  supplierEmail: string;
  amount: number;
  currency: string;
  invoiceNumber: string;
  hotelName: string;
}

export interface OlivReferralResponse {
  success: boolean;
  referralUrl?: string;
  referralId?: string;
  error?: string;
}

/**
 * Phase 1: Generate a referral URL to Oliv's financing application.
 * The supplier is redirected to Oliv to complete the financing process.
 */
export function generateOlivReferralUrl(payload: OlivReferralPayload): string {
  const params = new URLSearchParams({
    ref: payload.supplierId,
    order: payload.orderId,
    invoice: payload.invoiceId,
    amount: payload.amount.toString(),
    currency: payload.currency,
    name: payload.supplierName,
    email: payload.supplierEmail,
    source: "hotelsvendors",
  });

  return `https://oliv.finance/apply?${params.toString()}`;
}

/**
 * Phase 1: Create a referral record in the database.
 * Tracks which suppliers were referred to Oliv and their status.
 */
export async function createOlivReferral(payload: OlivReferralPayload) {
  // TODO: Create OlivReferral model in Prisma schema
  // For now, return a mock response
  const referralId = `OLIV-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  return {
    id: referralId,
    ...payload,
    status: "PENDING",
    createdAt: new Date(),
  };
}

/**
 * Phase 2 (placeholder): Handle Oliv webhook for payment confirmation.
 */
export async function handleOlivWebhook(event: {
  type: string;
  orderId: string;
  status: string;
  amount: number;
}) {
  // TODO: Implement Phase 2 webhook handling
  console.log("[Oliv Webhook] Received:", event.type, event.orderId);
  return { received: true };
}
