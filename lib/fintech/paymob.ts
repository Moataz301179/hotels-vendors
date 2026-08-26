/**
 * Paymob Accept API Client - lib/fintech layer (SEC chunk 4A)
 *
 * Thin, env-driven client for the Paymob Accept gateway:
 *   1. Auth            POST /api/auth/tokens
 *   2. Create order    POST /ecommerce/orders
 *   3. Payment key     POST /acceptance/payment_keys
 *   4. Iframe URL builder
 *   5. HMAC-SHA512 webhook signature verification
 *
 * All configuration is env-driven:
 *   PAYMOB_API_KEY, PAYMOB_HMAC_SECRET, PAYMOB_BASE_URL
 *   (optional: PAYMOB_INTEGRATION_ID, PAYMOB_IFRAME_ID)
 */

import * as crypto from "crypto";

// ============================================================================
// CONFIGURATION
// ============================================================================

const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com";
const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY || "";
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET || "";
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID || "";
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID || "";

export function isPaymobConfigured(): boolean {
  return Boolean(PAYMOB_API_KEY && PAYMOB_HMAC_SECRET);
}

// ============================================================================
// TYPES
// ============================================================================

export interface PaymobAuthTokenResponse {
  token: string;
  expires_in?: number;
}

export interface PaymobOrderItem {
  name: string;
  amount_cents: number;
  description?: string;
  quantity: number;
}

export interface PaymobBillingData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  apartment?: string;
  floor?: string;
  street?: string;
  building?: string;
  city: string;
  country: string;
  state?: string;
  postal_code?: string;
}

export interface PaymobCreateOrderInput {
  amountCents: number;
  merchantOrderId: string;
  items?: PaymobOrderItem[];
  billingData: PaymobBillingData;
}

export interface PaymobOrder {
  id: number;
  merchant_order_id?: string;
  amount_cents?: number;
  currency?: string;
}

export interface PaymobWebhookObj {
  id: number;
  success?: boolean;
  pending?: boolean;
  amount_cents: number;
  created_at: string;
  currency?: string;
  error_occured?: boolean;
  has_parent_transaction?: boolean;
  is_3d_secure?: boolean;
  is_auth?: boolean;
  is_capture?: boolean;
  is_refunded?: boolean;
  is_standalone_payment?: boolean;
  is_voided?: boolean;
  is_refund?: boolean;
  integration_id?: number | string;
  owner?: number;
  source_data?: { type?: string; pan?: string; sub_type?: string };
  order: { id?: number; merchant_order_id?: string } | number | string;
  [key: string]: unknown;
}

export interface PaymobWebhookPayload {
  obj: PaymobWebhookObj;
  type?: string;
  hmac: string;
}

// ============================================================================
// HTTP HELPER
// ============================================================================

async function paymobFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!PAYMOB_API_KEY) {
    throw new Error("Paymob not configured: missing PAYMOB_API_KEY");
  }
  const res = await fetch(`${PAYMOB_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Paymob ${path} failed (${res.status}): ${body.slice(0, 500)}`);
  }
  return (await res.json()) as T;
}

function normalizeBilling(billing: Partial<PaymobBillingData>): PaymobBillingData {
  return {
    first_name: billing.first_name || "Customer",
    last_name: billing.last_name || "User",
    email: billing.email || "payments@hotelsvendors.com",
    phone_number: billing.phone_number || "NA",
    apartment: billing.apartment || "NA",
    floor: billing.floor || "NA",
    street: billing.street || "NA",
    building: billing.building || "NA",
    city: billing.city || "Cairo",
    country: billing.country || "EG",
    state: billing.state || "Cairo",
    postal_code: billing.postal_code || "NA",
  };
}

// ============================================================================
// STEP 1 - AUTH
// ============================================================================

export async function getAuthToken(): Promise<string> {
  const res = await paymobFetch<PaymobAuthTokenResponse>("/api/auth/tokens", {
    method: "POST",
    body: JSON.stringify({ api_key: PAYMOB_API_KEY }),
  });
  return res.token;
}

// ============================================================================
// STEP 2 - CREATE ORDER
// ============================================================================

export async function createOrder(
  authToken: string,
  input: PaymobCreateOrderInput
): Promise<PaymobOrder> {
  const payload = {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: input.amountCents,
    currency: "EGP",
    merchant_order_id: input.merchantOrderId,
    items: input.items || [],
    shipping_data: normalizeBilling(input.billingData),
  };
  return paymobFetch<PaymobOrder>("/ecommerce/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ============================================================================
// STEP 3 - PAYMENT KEY
// ============================================================================

export async function createPaymentKey(
  authToken: string,
  params: {
    orderId: number;
    amountCents: number;
    billingData: Partial<PaymobBillingData>;
    expirationSeconds?: number;
  }
): Promise<string> {
  const payload = {
    auth_token: authToken,
    amount_cents: params.amountCents,
    expiration: params.expirationSeconds ?? 3600,
    order_id: params.orderId,
    billing_data: normalizeBilling(params.billingData),
    currency: "EGP",
    integration_id: Number(PAYMOB_INTEGRATION_ID) || PAYMOB_INTEGRATION_ID,
    lock_order_when_paid: true,
  };
  const res = await paymobFetch<{ token: string }>("/acceptance/payment_keys", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return res.token;
}

// ============================================================================
// STEP 4 - IFRAME URL BUILDER
// ============================================================================

/** Build the hosted payment iframe URL from a payment key token. */
export function buildIframeUrl(paymentToken: string): string {
  if (!PAYMOB_IFRAME_ID) {
    throw new Error("Paymob not configured: missing PAYMOB_IFRAME_ID");
  }
  return `${PAYMOB_BASE_URL}/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${encodeURIComponent(paymentToken)}`;
}

/** Full checkout flow helper: auth -> order -> payment key -> iframe URL. */
export async function initializeCheckout(input: PaymobCreateOrderInput): Promise<{
  iframeUrl: string;
  paymobOrderId: number;
}> {
  const token = await getAuthToken();
  const order = await createOrder(token, input);
  const paymentKey = await createPaymentKey(token, {
    orderId: order.id,
    amountCents: input.amountCents,
    billingData: input.billingData,
  });
  return { iframeUrl: buildIframeUrl(paymentKey), paymobOrderId: order.id };
}

// ============================================================================
// STEP 5 - HMAC VERIFICATION (webhook callbacks)
// ============================================================================

/**
 * Verify the HMAC-SHA512 signature of a Paymob webhook.
 *
 * Per Paymob docs: concatenate the transaction object's variables in this
 * exact order, then compare sha512-HMAC (keyed with the HMAC secret) against
 * the `hmac` field.
 */
const HMAC_FIELD_ORDER = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
] as const;

export function verifyHmac(
  payload: PaymobWebhookPayload,
  hmacSecret: string = PAYMOB_HMAC_SECRET
): boolean {
  if (!hmacSecret) return false;
  const received = String(payload.hmac || "");
  if (!received) return false;

  const obj = payload.obj || ({} as PaymobWebhookObj);
  const orderVal =
    typeof obj.order === "object" && obj.order !== null
      ? (obj.order as { id?: number }).id ?? ""
      : (obj.order ?? "");

  const values: Record<string, unknown> = {
    amount_cents: obj.amount_cents ?? "",
    created_at: obj.created_at ?? "",
    currency: obj.currency ?? "EGP",
    error_occured: obj.error_occured ?? false,
    has_parent_transaction: obj.has_parent_transaction ?? false,
    id: obj.id ?? "",
    integration_id: obj.integration_id ?? "",
    is_3d_secure: obj.is_3d_secure ?? false,
    is_auth: obj.is_auth ?? false,
    is_capture: obj.is_capture ?? false,
    is_refunded: obj.is_refunded ?? false,
    is_standalone_payment: obj.is_standalone_payment ?? false,
    is_voided: obj.is_voided ?? false,
    order: orderVal,
    owner: obj.owner ?? "",
    pending: obj.pending ?? false,
    "source_data.pan": obj.source_data?.pan ?? "",
    "source_data.sub_type": obj.source_data?.sub_type ?? "",
    "source_data.type": obj.source_data?.type ?? "",
  };

  const concatenated = HMAC_FIELD_ORDER.map((f) => values[f]).join("");
  const expected = crypto.createHmac("sha512", hmacSecret).update(concatenated).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "utf8"), Buffer.from(received, "utf8"));
  } catch {
    return false;
  }
}

/**
 * Extract the merchant_order_id from a webhook payload regardless of whether
 * `order` arrives as an object or a scalar.
 */
export function extractMerchantOrderId(obj: PaymobWebhookObj): string | null {
  if (typeof obj.order === "object" && obj.order !== null) {
    return obj.order.merchant_order_id || (obj.order.id != null ? String(obj.order.id) : null);
  }
  return obj.order != null ? String(obj.order) : null;
}
