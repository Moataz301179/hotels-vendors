/**
 * Oliv Finance Invoice Factoring Integration
 * Hotels Vendors Fintech Layer - Egyptian Market
 *
 * Oliv Finance provides invoice factoring services for B2B procurement.
 * This adapter handles asynchronous invoice factoring status synchronization
 * from INITIALIZED through MATURED states.
 *
 * Integration handles:
 * - Invoice submission for factoring eligibility
 * - Status webhook callbacks (INITIALIZED -> APPROVED -> DISBURSED -> MATURED)
 * - HMAC signature verification for webhook security
 * - Sandbox mode for end-to-end testing
 */

import * as crypto from "crypto";

// ============================================================================
// 1. CONFIGURATION & ENVIRONMENT
// ============================================================================

const OLIV_BASE_URL = process.env.OLIV_BASE_URL || "https://api.oliv.finance";
const OLIV_API_KEY = process.env.OLIV_API_KEY || "";
const OLIV_WEBHOOK_SECRET = process.env.OLIV_WEBHOOK_SECRET || "";
const OLIV_CLIENT_ID = process.env.OLIV_CLIENT_ID || "";

const USE_MOCK = !OLIV_API_KEY || !OLIV_WEBHOOK_SECRET || process.env.OLIV_MOCK === "true";
const IS_SANDBOX = process.env.NEXT_PUBLIC_FINTECH_SANDBOX === "true" || process.env.OLIV_SANDBOX === "true";

// ============================================================================
// 2. TYPES
// ============================================================================

export type OlivFactoringStatus =
  | "INITIALIZED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "DISBURSED"
  | "MATURED"
  | "DEFAULTED"
  | "CANCELLED";

export interface OlivInvoiceSubmission {
  invoiceId: string;
  invoiceNumber: string;
  supplierId: string;
  hotelId: string;
  amount: number;
  currency: "EGP";
  issueDate: string; // ISO 8601
  dueDate: string; // ISO 8601
  vatAmount: number;
  netAmount: number;
  invoiceItems: OlivInvoiceItem[];
  hotelDetails: OlivHotelDetails;
  supplierDetails: OlivSupplierDetails;
}

export interface OlivInvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  vatRate: number;
}

export interface OlivHotelDetails {
  legalName: string;
  taxId: string;
  commercialReg: string;
  address: string;
  city: string;
  governorate: string;
  email: string;
  phone: string;
}

export interface OlivSupplierDetails {
  legalName: string;
  taxId: string;
  commercialReg: string;
  address: string;
  city: string;
  governorate: string;
  email: string;
  phone: string;
}

export interface OlivSubmissionResponse {
  factoringRequestId: string;
  status: OlivFactoringStatus;
  submittedAt: string;
  estimatedDecisionDate: string;
  advanceRate: number;
  discountRate: number;
  platformFeeRate: number;
}

export interface OlivStatusUpdate {
  factoringRequestId: string;
  invoiceId: string;
  previousStatus: OlivFactoringStatus;
  newStatus: OlivFactoringStatus;
  updatedAt: string;
  metadata?: {
    disbursedAmount?: number;
    disbursedAt?: string;
    maturityDate?: string;
    rejectionReason?: string;
    approvedAdvanceRate?: number;
    approvedDiscountRate?: number;
  };
}

export interface OlivWebhookPayload {
  event: "FACTORING_STATUS_UPDATE";
  timestamp: string;
  data: OlivStatusUpdate;
  signature: string;
}

export interface OlivFactoringRequestDetails {
  factoringRequestId: string;
  invoiceId: string;
  status: OlivFactoringStatus;
  submittedAt: string;
  updatedAt: string;
  advanceRate: number;
  discountRate: number;
  platformFeeRate: number;
  requestedAmount: number;
  approvedAmount?: number;
  disbursedAmount?: number;
  disbursedAt?: string;
  maturityDate?: string;
  settledAt?: string;
  hotelPaidAt?: string;
  rejectionReason?: string;
  riskScore?: number;
  riskTier?: string;
}

// ============================================================================
// 3. SIGNATURE UTILITIES
// ============================================================================

function generateHmac(data: string): string {
  return crypto.createHmac("sha256", OLIV_WEBHOOK_SECRET).update(data).digest("hex");
}

export function verifyOlivWebhook(payload: OlivWebhookPayload): boolean {
  if (USE_MOCK) return true;
  if (!OLIV_WEBHOOK_SECRET) return false;

  // Oliv HMAC verification: concatenate specific fields in deterministic order
  const { event, timestamp, data } = payload;
  const hmacString = [
    event,
    timestamp,
    data.factoringRequestId,
    data.invoiceId,
    data.previousStatus,
    data.newStatus,
    data.updatedAt,
    data.metadata?.disbursedAmount || "",
    data.metadata?.disbursedAt || "",
    data.metadata?.maturityDate || "",
    data.metadata?.rejectionReason || "",
    data.metadata?.approvedAdvanceRate || "",
    data.metadata?.approvedDiscountRate || "",
  ].join("|");

  const expectedHmac = generateHmac(hmacString);
  try {
    return crypto.timingSafeEqual(Buffer.from(expectedHmac), Buffer.from(payload.signature));
  } catch {
    return false;
  }
}

// ============================================================================
// 4. HTTP CLIENT
// ============================================================================

async function olivFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (USE_MOCK) {
    throw new Error("Oliv mock mode: use mock functions instead");
  }

  const url = `${OLIV_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${OLIV_API_KEY}`,
      "X-Client-ID": OLIV_CLIENT_ID,
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Oliv ${path} failed: ${res.status} ${err}`);
  }

  return res.json() as Promise<T>;
}

// ============================================================================
// 5. PRODUCTION FUNCTIONS
// ============================================================================

/**
 * Submit invoice for factoring eligibility assessment
 */
export async function submitInvoiceForFactoring(
  submission: OlivInvoiceSubmission
): Promise<OlivSubmissionResponse> {
  if (USE_MOCK) return _mockSubmitInvoice(submission);

  return olivFetch<OlivSubmissionResponse>("/v1/factoring/invoices", {
    method: "POST",
    body: JSON.stringify(submission),
  });
}

/**
 * Get factoring request status by ID
 */
export async function getFactoringStatus(factoringRequestId: string): Promise<OlivFactoringRequestDetails> {
  if (USE_MOCK) return _mockFactoringStatus(factoringRequestId);

  return olivFetch<OlivFactoringRequestDetails>(`/v1/factoring/requests/${factoringRequestId}`);
}

/**
 * Poll for factoring status updates (for client-side polling fallback)
 */
export async function pollFactoringStatus(
  factoringRequestId: string,
  intervalMs: number = 30000,
  maxAttempts: number = 60
): Promise<OlivFactoringRequestDetails> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const status = await getFactoringStatus(factoringRequestId);
    
    // Terminal states
    if (["MATURED", "DEFAULTED", "CANCELLED", "REJECTED"].includes(status.status)) {
      return status;
    }
    
    // Wait before next poll
    if (attempt < maxAttempts - 1) {
      await _simulateLatency(intervalMs);
    }
  }
  
  // Return last known status if max attempts reached
  return getFactoringStatus(factoringRequestId);
}

/**
 * Batch get statuses for multiple factoring requests
 */
export async function getBatchFactoringStatuses(
  factoringRequestIds: string[]
): Promise<Map<string, OlivFactoringRequestDetails>> {
  const results = new Map<string, OlivFactoringRequestDetails>();
  
  // Process in batches of 10 to avoid rate limits
  const batchSize = 10;
  for (let i = 0; i < factoringRequestIds.length; i += batchSize) {
    const batch = factoringRequestIds.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (id) => {
        try {
          const status = await getFactoringStatus(id);
          results.set(id, status);
        } catch (error) {
          console.error(`Failed to get status for ${id}:`, error);
        }
      })
    );
  }
  
  return results;
}

/**
 * Webhook handler for asynchronous status updates
 * Call this from your webhook endpoint (e.g., /api/webhooks/oliv)
 */
export async function handleOlivWebhook(
  rawPayload: string,
  signature: string
): Promise<OlivStatusUpdate | null> {
  try {
    const payload: OlivWebhookPayload = JSON.parse(rawPayload);
    payload.signature = signature;
    
    if (!verifyOlivWebhook(payload)) {
      throw new Error("Invalid webhook signature");
    }
    
    return payload.data;
  } catch (error) {
    console.error("Oliv webhook verification failed:", error);
    return null;
  }
}

// ============================================================================
// 6. MOCK IMPLEMENTATIONS (for sandbox/development)
// ============================================================================

async function _mockSubmitInvoice(submission: OlivInvoiceSubmission): Promise<OlivSubmissionResponse> {
  await _simulateLatency(500);
  
  const factoringRequestId = `OLIV-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  const submittedAt = new Date().toISOString();
  
  // Simulate instant approval for sandbox
  return {
    factoringRequestId,
    status: "INITIALIZED",
    submittedAt,
    estimatedDecisionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    advanceRate: 0.90,
    discountRate: 0.02,
    platformFeeRate: 0.005,
  };
}

async function _mockFactoringStatus(factoringRequestId: string): Promise<OlivFactoringRequestDetails> {
  await _simulateLatency(200);
  
  // In mock mode, simulate progression through states based on request ID hash
  const hash = factoringRequestId.split("-").pop() || "";
  const stateIndex = parseInt(hash, 36) % 7;
  const states: OlivFactoringStatus[] = [
    "INITIALIZED",
    "UNDER_REVIEW",
    "APPROVED",
    "DISBURSED",
    "MATURED",
    "REJECTED",
    "CANCELLED",
  ];
  const status = states[stateIndex] || "INITIALIZED";
  
  const baseDate = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000); // 5 days ago
  
  return {
    factoringRequestId,
    invoiceId: `INV-${factoringRequestId}`,
    status,
    submittedAt: baseDate.toISOString(),
    updatedAt: new Date().toISOString(),
    advanceRate: 0.90,
    discountRate: 0.02,
    platformFeeRate: 0.005,
    requestedAmount: 100000,
    approvedAmount: ["APPROVED", "DISBURSED", "MATURED"].includes(status) ? 90000 : undefined,
    disbursedAmount: ["DISBURSED", "MATURED"].includes(status) ? 90000 : undefined,
    disbursedAt: ["DISBURSED", "MATURED"].includes(status) ? new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() : undefined,
    maturityDate: "MATURED" === status ? new Date().toISOString() : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    settledAt: "MATURED" === status ? new Date().toISOString() : undefined,
    hotelPaidAt: "MATURED" === status ? new Date().toISOString() : undefined,
    rejectionReason: status === "REJECTED" ? "Insufficient credit history" : undefined,
    riskScore: 45,
    riskTier: "LOW",
  };
}

function _simulateLatency(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ============================================================================
// 7. STATUS FLOW UTILITIES
// ============================================================================

export const OLIV_STATUS_FLOW: Record<OlivFactoringStatus, OlivFactoringStatus[]> = {
  INITIALIZED: ["UNDER_REVIEW", "REJECTED", "CANCELLED"],
  UNDER_REVIEW: ["APPROVED", "REJECTED", "CANCELLED"],
  APPROVED: ["DISBURSED", "CANCELLED"],
  DISBURSED: ["MATURED", "DEFAULTED"],
  MATURED: [], // Terminal
  REJECTED: [], // Terminal
  DEFAULTED: [], // Terminal
  CANCELLED: [], // Terminal
};

export function isTerminalStatus(status: OlivFactoringStatus): boolean {
  return ["MATURED", "REJECTED", "DEFAULTED", "CANCELLED"].includes(status);
}

export function canTransition(from: OlivFactoringStatus, to: OlivFactoringStatus): boolean {
  return OLIV_STATUS_FLOW[from]?.includes(to) ?? false;
}

export function getStatusDisplayName(status: OlivFactoringStatus): string {
  const names: Record<OlivFactoringStatus, string> = {
    INITIALIZED: "Initialized",
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    DISBURSED: "Disbursed",
    MATURED: "Matured",
    DEFAULTED: "Defaulted",
    CANCELLED: "Cancelled",
  };
  return names[status];
}

export function getStatusColor(status: OlivFactoringStatus): string {
  const colors: Record<OlivFactoringStatus, string> = {
    INITIALIZED: "bg-blue-100 text-blue-800",
    UNDER_REVIEW: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    DISBURSED: "bg-purple-100 text-purple-800",
    MATURED: "bg-emerald-100 text-emerald-800",
    DEFAULTED: "bg-red-100 text-red-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };
  return colors[status];
}

// ============================================================================
// 8. EXPORTS
// ============================================================================

export const olivAdapter = {
  submitInvoice: submitInvoiceForFactoring,
  getStatus: getFactoringStatus,
  pollStatus: pollFactoringStatus,
  getBatchStatuses: getBatchFactoringStatuses,
  handleWebhook: handleOlivWebhook,
  verifyWebhook: verifyOlivWebhook,
};

export type {
  OlivFactoringStatus,
  OlivInvoiceSubmission,
  OlivInvoiceItem,
  OlivHotelDetails,
  OlivSupplierDetails,
  OlivSubmissionResponse,
  OlivStatusUpdate,
  OlivWebhookPayload,
  OlivFactoringRequestDetails,
};