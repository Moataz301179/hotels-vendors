/**
 * ETA E-Invoicing Type Definitions
 * Hotels Vendors Compliance Layer
 *
 * Type-safe definitions for Egyptian Tax Authority API interactions.
 */

// ─────────────────────────────────────────
// 1. ETA API REQUEST / RESPONSE TYPES
// ─────────────────────────────────────────

/**
 * ETA Invoice Submission Payload
 * Based on ETA e-invoicing API specification (JSON format)
 */
export interface EtaInvoicePayload {
  issuer: EtaTaxpayer;
  receiver: EtaTaxpayer;
  documentType: "I" | "C" | "D"; // Invoice, Credit, Debit
  documentTypeVersion: "1.0";
  dateIssued: string; // ISO 8601
  internalId: string; // Platform invoice number
  purchaseOrderReference?: string;
  proformaInvoiceNumber?: string;
  payment: EtaPayment;
  delivery: EtaDelivery;
  invoiceLines: EtaInvoiceLine[];
  totalDiscountAmount?: number;
  totalSalesAmount: number;
  netAmount: number;
  taxTotals: EtaTaxTotal[];
  totalAmount: number;
  extraDiscountAmount?: number;
  totalItemsDiscountAmount?: number;
}

export interface EtaTaxpayer {
  type: "B" | "P" | "F"; // Business, Person, Foreign
  id: string; // Tax ID (Registration Number)
  name: string;
  address: EtaAddress;
}

export interface EtaAddress {
  branchId?: string;
  country: string; // "EG"
  governate: string;
  regionCity: string;
  street: string;
  buildingNumber: string;
  postalCode?: string;
  floor?: string;
  room?: string;
  landmark?: string;
  additionalInformation?: string;
}

export interface EtaPayment {
  bankName?: string;
  bankAddress?: string;
  bankAccountNo?: string;
  bankAccountIBAN?: string;
  swiftCode?: string;
  terms: string; // Payment terms description
}

export interface EtaDelivery {
  approach: string;
  packaging?: string;
  dateValidity?: string;
  exportPort?: string;
  countryOfOrigin?: string;
  grossWeight?: number;
  netWeight?: number;
  terms: string;
}

export interface EtaInvoiceLine {
  description: string;
  itemType: "GS1" | "EGS";
  itemCode: string;
  unitType: string;
  quantity: number;
  internalCode?: string;
  salesTotal: number;
  total: number;
  valueDifference: number;
  totalTaxableFees: number;
  netTotal: number;
  itemsDiscount: number;
  discount: EtaDiscount;
  taxableItems: EtaTaxableItem[];
}

export interface EtaDiscount {
  rate?: number;
  amount: number;
}

export interface EtaTaxableItem {
  taxType: "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8" | "T9" | "T10" | "T11" | "T12";
  amount: number;
  subType: string;
  rate: number;
}

export interface EtaTaxTotal {
  taxType: "T1" | "T2" | "T3" | "T4" | "T5" | "T6" | "T7" | "T8" | "T9" | "T10" | "T11" | "T12";
  amount: number;
}

// ─────────────────────────────────────────
// 2. ETA API RESPONSE TYPES
// ─────────────────────────────────────────

export interface EtaSubmissionResponse {
  submissionId: string;
  uuid: string;
  longId?: string;
  internalId: string;
  typeName: string;
  typeVersionName: string;
  issuerId: string;
  issuerName: string;
  receiverId?: string;
  receiverName?: string;
  dateTimeIssued: string;
  dateTimeReceived: string;
  totalSales: number;
  totalDiscount: number;
  netAmount: number;
  total: number;
  status: "Submitted" | "Valid" | "Invalid" | "Rejected" | "Cancelled";
  documentCount: number;
  dateTimeValidated?: string;
  rejectionReasons?: EtaRejectionReason[];
}

export interface EtaRejectionReason {
  error: string;
  errorCode: string;
  propertyPath: string;
  propertyValue: string;
}

export interface EtaValidationResult {
  valid: boolean;
  code: EtaValidationCode;
  message: string;
  etaRecord?: EtaSubmissionResponse;
  details?: Record<string, unknown>;
}

export type EtaValidationCode =
  | "ETA_VALID"
  | "ETA_UUID_MISSING"
  | "ETA_STATUS_INVALID"
  | "ETA_SIGNATURE_MISSING"
  | "ETA_AMOUNT_MISMATCH"
  | "ETA_TAX_ID_MISMATCH"
  | "ETA_NOT_FOUND"
  | "ETA_API_ERROR"
  | "ETA_NETWORK_ERROR";

// ─────────────────────────────────────────
// 3. ETA DOCUMENT STATUS
// ─────────────────────────────────────────

export type EtaDocumentStatus =
  | "Submitted"
  | "Valid"
  | "Invalid"
  | "Rejected"
  | "Cancelled";

// ─────────────────────────────────────────
// 4. INTERNAL TYPES
// ─────────────────────────────────────────

export interface EtaQueueItem {
  id: string;
  invoiceId: string;
  etaUuid?: string;
  status: "PENDING" | "PROCESSING" | "RETRYING" | "FAILED" | "RESOLVED";
  attemptCount: number;
  maxAttempts: number;
  nextRetryAt?: Date;
  lastError?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EtaConfig {
  baseUrl: string;
  apiVersion: string;
  clientId: string;
  clientSecret: string;
  timeoutMs: number;
  maxRetries: number;
  retryDelayMs: number;
}
