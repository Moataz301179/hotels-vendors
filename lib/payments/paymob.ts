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

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;
const PAYMOB_IFRAME_ID = process.env.PAYMOB_IFRAME_ID || "YOUR_IFRAME_ID";
const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC_SECRET;

const BASE_URL = "https://accept.paymob.com/api";

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

  const paymentUrl = `https://accept.paymob.com/api/acceptance/iframes/${PAYMOB_IFRAME_ID}?payment_token=${paymentKey}`;
  return { paymentUrl, paymobOrderId };
}

export function verifyPaymobCallback(
  payload: Record<string, unknown>
): boolean {
  if (!PAYMOB_HMAC_SECRET) return true; // In sandbox, skip verification

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
  const crypto = require("crypto");
  const calculated = crypto
    .createHmac("sha512", PAYMOB_HMAC_SECRET)
    .update(hmacString)
    .digest("hex");

  return calculated === receivedHmac;
}
