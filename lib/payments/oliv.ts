/**
 * Oliv Payment Integration — Phase 1 (Referral)
 *
 * HotelsVendors refers hotels and suppliers to Oliv for:
 * - Supplier factoring (supplier-initiated)
 * - Hotel reverse factoring (hotel-initiated)
 * - Marketplace payments (checkout redirect)
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

export interface OlivHotelReferralPayload {
  hotelId: string;
  hotelName: string;
  hotelEmail: string;
  taxId: string;
  propertyType: string;
  numberOfProperties: string;
  financingType: "factoring" | "reverse_factoring";
  etaToken?: string;
}

export interface OlivCheckoutPayload {
  hotelId: string;
  hotelName: string;
  orderId: string;
  amount: number;
  currency: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
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
 * Phase 1: Generate a hotel referral URL to Oliv's financing application.
 * Hotels can apply for factoring or reverse factoring.
 */
export function generateOlivHotelReferralUrl(payload: OlivHotelReferralPayload): string {
  const params = new URLSearchParams({
    ref: payload.hotelId,
    name: payload.hotelName,
    email: payload.hotelEmail,
    taxId: payload.taxId,
    propertyType: payload.propertyType,
    properties: payload.numberOfProperties,
    financingType: payload.financingType,
    source: "hotelsvendors",
  });

  if (payload.etaToken) {
    params.set("etaToken", payload.etaToken);
  }

  return `https://oliv.finance/hotel-apply?${params.toString()}`;
}

/**
 * Phase 1: Generate a checkout redirect URL to Oliv for payment.
 * Hotels are redirected to Oliv to complete payment for marketplace orders.
 */
export function generateOlivCheckoutUrl(payload: OlivCheckoutPayload): string {
  const params = new URLSearchParams({
    hotel: payload.hotelId,
    hotelName: payload.hotelName,
    order: payload.orderId,
    amount: payload.amount.toString(),
    currency: payload.currency,
    source: "hotelsvendors_checkout",
  });

  // Add items as JSON
  params.set("items", JSON.stringify(payload.items));

  return `https://oliv.finance/checkout?${params.toString()}`;
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
 * Phase 1: Create a hotel referral record in the database.
 * Tracks which hotels were referred to Oliv and their financing type.
 */
export async function createOlivHotelReferral(payload: OlivHotelReferralPayload) {
  // TODO: Create OlivHotelReferral model in Prisma schema
  // For now, return a mock response
  const referralId = `OLIV-HTL-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

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
