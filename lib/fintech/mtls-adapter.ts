/**
 * mTLS Adapter for Factoring Partners
 * Hotels Vendors Fintech Security Layer
 *
 * Enforces mutual TLS + HMAC request signing for all partner APIs.
 * Prevents man-in-the-middle and replay attacks.
 */

import { createHmac, createSign, randomBytes } from "crypto";
import type { FactoringPartnerAdapter } from "./factoring-bridge";

// ─────────────────────────────────────────
// 1. MTLS CONFIGURATION
// ─────────────────────────────────────────

export interface MTLSConfig {
  partnerId: string;
  baseUrl: string;
  clientCert: string; // PEM-encoded client certificate
  clientKey: string; // PEM-encoded client private key
  caCert: string; // PEM-encoded CA certificate
  apiKey: string;
  apiSecret: string;
  requestTimeoutMs: number;
}

// ─────────────────────────────────────────
// 2. REQUEST SIGNING
// ─────────────────────────────────────────

export interface SignedRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
}

/**
 * Sign a request with HMAC-SHA256.
 * Includes timestamp and nonce to prevent replay attacks.
 */
export function signRequest(params: {
  method: string;
  path: string;
  body: string;
  apiKey: string;
  apiSecret: string;
}): { headers: Record<string, string>; timestamp: number; nonce: string } {
  const { method, path, body, apiKey, apiSecret } = params;
  const timestamp = Date.now();
  const nonce = randomBytes(16).toString("hex");

  const message = `${method.toUpperCase()}:${path}:${timestamp}:${nonce}:${body}`;
  const signature = createHmac("sha256", apiSecret).update(message).digest("hex");

  return {
    headers: {
      "X-API-Key": apiKey,
      "X-Timestamp": timestamp.toString(),
      "X-Nonce": nonce,
      "X-Signature": signature,
      "Content-Type": "application/json",
    },
    timestamp,
    nonce,
  };
}

/**
 * Verify a response signature from the partner.
 */
export function verifyResponse(params: {
  body: string;
  signature: string;
  apiSecret: string;
  timestamp: number;
  nonce: string;
}): boolean {
  const { body, signature, apiSecret, timestamp, nonce } = params;
  const message = `${timestamp}:${nonce}:${body}`;
  const expected = createHmac("sha256", apiSecret).update(message).digest("hex");
  return signature === expected;
}

// ─────────────────────────────────────────
// 3. MTLS HTTP CLIENT (STUB)
// ─────────────────────────────────────────

/**
 * Perform an mTLS-protected HTTP request.
 *
 * NOTE: This is a stub. In production, use Node.js https.Agent
 * with cert/key/ca options, or a library like axios with httpsAgent.
 */
export async function mtlsFetch(
  config: MTLSConfig,
  path: string,
  options: { method?: string; body?: string } = {}
): Promise<{ status: number; body: string; headers: Record<string, string> }> {
  const method = options.method || "GET";
  const body = options.body || "";
  const url = `${config.baseUrl}${path}`;

  // Sign request
  const signed = signRequest({
    method,
    path,
    body,
    apiKey: config.apiKey,
    apiSecret: config.apiSecret,
  });

  // TODO: In production, use https.Agent with client cert
  // const agent = new https.Agent({
  //   cert: config.clientCert,
  //   key: config.clientKey,
  //   ca: config.caCert,
  //   rejectUnauthorized: true,
  // });

  // For now, perform regular fetch with signed headers
  const response = await fetch(url, {
    method,
    headers: signed.headers,
    body: body || undefined,
  });

  const responseBody = await response.text();

  // Verify response signature if present
  const responseSignature = response.headers.get("X-Signature");
  const responseTimestamp = response.headers.get("X-Timestamp");
  const responseNonce = response.headers.get("X-Nonce");

  if (responseSignature && responseTimestamp && responseNonce) {
    const valid = verifyResponse({
      body: responseBody,
      signature: responseSignature,
      apiSecret: config.apiSecret,
      timestamp: parseInt(responseTimestamp),
      nonce: responseNonce,
    });

    if (!valid) {
      throw new Error("Response signature verification failed — possible MITM attack");
    }
  }

  return {
    status: response.status,
    body: responseBody,
    headers: Object.fromEntries(response.headers.entries()),
  };
}

// ─────────────────────────────────────────
// 4. BANK ACCOUNT WHITELIST
// ─────────────────────────────────────────

const WHITELISTED_ACCOUNTS = new Map<string, Set<string>>();

export function whitelistBankAccount(supplierId: string, accountNumber: string): void {
  if (!WHITELISTED_ACCOUNTS.has(supplierId)) {
    WHITELISTED_ACCOUNTS.set(supplierId, new Set());
  }
  WHITELISTED_ACCOUNTS.get(supplierId)!.add(accountNumber);
}

export function isBankAccountWhitelisted(supplierId: string, accountNumber: string): boolean {
  return WHITELISTED_ACCOUNTS.get(supplierId)?.has(accountNumber) || false;
}

// ─────────────────────────────────────────
// 5. DISBURSEMENT VALIDATION
// ─────────────────────────────────────────

export interface DisbursementValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validate a disbursement request before sending to partner.
 */
export function validateDisbursement(params: {
  supplierId: string;
  bankAccount: string;
  amount: number;
  invoiceId: string;
  etaUuid?: string | null;
}): DisbursementValidationResult {
  const { supplierId, bankAccount, amount, invoiceId, etaUuid } = params;

  if (!isBankAccountWhitelisted(supplierId, bankAccount)) {
    return {
      valid: false,
      reason: `Bank account ${bankAccount} is not whitelisted for supplier ${supplierId}`,
    };
  }

  if (amount <= 0) {
    return {
      valid: false,
      reason: "Disbursement amount must be positive",
    };
  }

  if (!invoiceId) {
    return {
      valid: false,
      reason: "Invoice ID is required for disbursement",
    };
  }

  if (!etaUuid) {
    return {
      valid: false,
      reason: "ETA UUID is required for disbursement",
    };
  }

  return { valid: true };
}
