/**
 * Paymob Integration — Smart Fix A Deposit Collection
 * Hotels Vendors Fintech Layer
 *
 * Flow:
 * 1. Order triggers Smart Fix A (20% deposit required)
 * 2. Create Paymob payment link (iframe or wallet)
 * 3. User pays via card/mobile wallet
 * 4. Paymob sends callback to /api/v1/payments/paymob-callback
 * 5. Mark order paymentGuaranteed = true
 */

import { createHmac } from "crypto";

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_PUBLIC_KEY = process.env.PAYMOB_PUBLIC_KEY;
const PAYMOB_SECRET_KEY = process.env.PAYMOB_SECRET_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID || "";
const PAYMOB_IFRAME_ID_INSTALLMENT = process.env.PAYMOB_IFRAME_ID_INSTALLMENT || "";
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET;
const PAYMOB_BASE_URL = process.env.PAYMOB_BASE_URL || "https://accept.paymob.com/api";
const PAYMOB_IFRAME_BASE_URL = process.env.PAYMOB_IFRAME_BASE_URL || "https://accept.paymob.com";
const PAYMOB_MODE = process.env.PAYMOB_MODE || "test";

const BASE_URL = PAYMOB_BASE_URL;

interface PaymobAuthResponse {
  token: string;
}

interface PaymobOrderResponse {
  id: number;
}

interface PaymobPaymentKeyResponse {
  token: string;
}

export interface DepositRequest {
  orderId: string;
  amountCents: number; // EGP * 100
  customerEmail: string;
  customerPhone?: string;
  customerFirstName: string;
  customerLastName: string;
}

async function paymobFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Paymob ${path} failed: ${err}`);
  }
  return res.json() as Promise<T>;
}

export async function getAuthToken(): Promise<string> {
  if (!PAYMOB_API_KEY) throw new Error("PAYMOB_API_KEY not configured");
  const data = await paymobFetch<PaymobAuthResponse>("/auth/tokens", {
    api_key: PAYMOB_API_KEY,
  });
  return data.token;
}

export async function createPaymobOrder(
  authToken: string,
  amountCents: number,
  merchantOrderId: string
): Promise<number> {
  const data = await paymobFetch<PaymobOrderResponse>("/ecommerce/orders", {
    auth_token: authToken,
    delivery_needed: false,
    amount_cents: amountCents,
    currency: "EGP",
    merchant_order_id: merchantOrderId,
    items: [],
  });
  return data.id;
}

export async function generatePaymentKey(
  authToken: string,
  paymobOrderId: number,
  amountCents: number,
  customer: {
    email: string;
    phone?: string;
    firstName: string;
    lastName: string;
  }
): Promise<string> {
  if (!PAYMOB_INTEGRATION_ID) throw new Error("PAYMOB_INTEGRATION_ID not configured");

  const data = await paymobFetch<PaymobPaymentKeyResponse>("/acceptance/payment_keys", {
    auth_token: authToken,
    amount_cents: amountCents,
    expiration: 3600,
    order_id: paymobOrderId,
    currency: "EGP",
    integration_id: parseInt(PAYMOB_INTEGRATION_ID, 10),
    billing_data: {
      apartment: "NA",
      email: customer.email,
      floor: "NA",
      first_name: customer.firstName,
      street: "NA",
      building: "NA",
      phone_number: customer.phone || "NA",
      shipping_method: "NA",
      postal_code: "NA",
      city: "Cairo",
      country: "EG",
      last_name: customer.lastName,
      state: "Cairo",
    },
  });
  return data.token;
}

export async function createDepositPayment(request: DepositRequest): Promise<{
  paymentUrl: string;
  paymobOrderId: number;
}> {
  const authToken = await getAuthToken();
  const paymobOrderId = await createPaymobOrder(
    authToken,
    request.amountCents,
    request.orderId
  );
  const paymentKey = await generatePaymentKey(
    authToken,
    paymobOrderId,
    request.amountCents,
    {
      email: request.customerEmail,
      phone: request.customerPhone,
      firstName: request.customerFirstName,
      lastName: request.customerLastName,
    }
  );

  const paymentUrl = `${PAYMOB_IFRAME_BASE_URL}/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
  return { paymentUrl, paymobOrderId };
}

export function verifyPaymobCallback(
  payload: Record<string, unknown>
): boolean {
  if (!PAYMOB_HMAC_SECRET) {
    throw new Error("PAYMOB_HMAC_SECRET not configured — cannot verify callbacks");
  }

  // Paymob HMAC verification
  const receivedHmac = payload.hmac as string;
  if (!receivedHmac) return false;

  // Build HMAC string from ordered fields
  const fields = [
    payload.amount_cents,
    payload.created_at,
    payload.currency,
    payload.error_occured,
    payload.has_parent_transaction,
    payload.id,
    payload.integration_id,
    payload.is_3d_secure,
    payload.is_auth,
    payload.is_capture,
    payload.is_refunded,
    payload.is_standalone_payment,
    payload.is_voided,
    payload.order,
    payload.owner,
    payload.pending,
    payload.source_data_pan,
    payload.source_data_sub_type,
    payload.source_data_type,
    payload.success,
  ];

  const hmacString = fields.join("");
  const calculated = createHmac("sha512", PAYMOB_HMAC_SECRET)
    .update(hmacString)
    .digest("hex");

  return calculated === receivedHmac;
}

// ── Transaction Status Lookup ───────────────────────────────────

export async function getTransactionStatus(
  transactionId: number
): Promise<{
  success: boolean;
  pending: boolean;
  amountCents: number;
  currency: string;
  orderId: number;
  [key: string]: unknown;
}> {
  const authToken = await getAuthToken();
  const res = await fetch(`${BASE_URL}/acceptance/transactions/${transactionId}`, {
    headers: { Authorization: `Bearer ${authToken}` },
  });
  const data = await res.json();
  return {
    success: data.success === true,
    pending: data.pending === true,
    amountCents: data.amount_cents || 0,
    currency: data.currency || "EGP",
    orderId: data.order?.id || 0,
    ...data,
  };
}

// ── Config Export ───────────────────────────────────────────────

export const paymobConfig = {
  publicKey: PAYMOB_PUBLIC_KEY,
  secretKey: PAYMOB_SECRET_KEY,
  integrationId: PAYMOB_INTEGRATION_ID,
  iframeId: PAYMOB_IFRAME_ID,
  iframeIdInstallment: PAYMOB_IFRAME_ID_INSTALLMENT,
  baseUrl: BASE_URL,
  iframeBaseUrl: PAYMOB_IFRAME_BASE_URL,
  mode: PAYMOB_MODE,
  isTest: PAYMOB_MODE === "test",
};
