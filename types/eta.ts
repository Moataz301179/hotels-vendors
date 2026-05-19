/**
 * Egypt Tax Authority (ETA) E-Invoicing Types
 * Full compliance with Egypt's digital tax invoice system
 */

// ============================================================================
// ETA BASE TYPES
// ============================================================================

export type EtaDocumentType = 'I' | 'C' | 'D'; // Invoice, Credit, Debit
export type EtaTaxType = 'T1' | 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'T8' | 'T9' | 'T10' | 'T11' | 'T12' | 'T13' | 'T14' | 'T15' | 'T16' | 'T17' | 'T18';

export interface EtaAddress {
  branchID?: string;
  country?: string;
  governorate?: string;
  regionCity?: string;
  street?: string;
  buildingNumber?: string;
  postalCode?: string;
  floor?: string;
  room?: string;
  landmark?: string;
  additionalInformation?: string;
}

export interface EtaParty {
  name: string;
  id: string;
  type: 'B' | 'P' | 'F' | 'C'; // Business, Person, Foreigner, Company
  address?: EtaAddress;
}

// ============================================================================
// ETA INVOICE LINE ITEMS
// ============================================================================

export interface EtaTaxableItem {
  taxType: EtaTaxType;
  amount: number;
  subType?: string;
  rate: number;
}

export interface EtaInvoiceLine {
  description: string;
  itemType: 'GS1' | 'EGS';
  itemCode: string;
  unitType: string;
  quantity: number;
  internalCode?: string;
  valueDifference: number;
  totalTaxableFees: number;
  itemsDiscount: number;
  unitPrice: number;
  discount?: {
    rate: number;
    amount: number;
  };
  taxableItems: EtaTaxableItem[];
  salesTotal: number;
  netTotal: number;
  totalAmount: number;
}

// ============================================================================
// ETA FULL INVOICE STRUCTURE
// ============================================================================

export interface EtaInvoiceData {
  issuer: EtaParty;
  receiver: EtaParty;
  documentType: EtaDocumentType;
  documentTypeVersion: '1.0' | '0.9';
  dateIssued: string; // ISO 8601 format
  internalId: string;
  purchaseOrderReference?: string;
  purchaseOrderDescription?: string;
  salesOrderReference?: string;
  salesOrderDescription?: string;
  proformaInvoiceNumber?: string;
  payment: {
    bankName?: string;
    bankAddress?: string;
    bankAccountNo?: string;
    bankAccountIBAN?: string;
    swiftCode?: string;
    terms?: string;
  };
  delivery: {
    approach?: string;
    packaging?: string;
    dateValidity?: string;
    exportPort?: string;
    grossWeight?: number;
    netWeight?: number;
    terms?: string;
  };
  invoiceLines: EtaInvoiceLine[];
  totalDiscountAmount?: number;
  totalSalesAmount: number;
  netAmount: number;
  taxTotals: EtaTaxableItem[];
  extraDiscountAmount?: number;
  totalItemsDiscountAmount?: number;
  totalAmount: number;
}

// ============================================================================
// ETA API RESPONSES
// ============================================================================

export interface EtaSubmissionResponse {
  submissionId: string;
  documentCount: number;
  dateReceived: string;
  uuid?: string;
  validationResults?: EtaValidationResult;
}

export interface EtaValidationResult {
  status: 'Valid' | 'Invalid' | 'PartiallyValid';
  validationSteps: EtaValidationStep[];
}

export interface EtaValidationStep {
  name: string;
  status: 'Valid' | 'Invalid';
  error?: EtaValidationError;
}

export interface EtaValidationError {
  code: string;
  message: string;
  propertyPath?: string;
  target: string;
}

export interface EtaDocumentResponse {
  uuid: string;
  longId?: string;
  internalId: string;
  typeName: string;
  typeVersionName: string;
  dateTimeIssued: string;
  dateTimeReceived: string;
  receipt?: EtaReceipt;
  cancelRequestDate?: string;
  rejectRequestDate?: string;
  cancelRequestDelay?: string;
  rejectRequestDelay?: string;
  declineCancelRequestDate?: string;
  declineRejectRequestDate?: string;
  status: string;
  documentStatusReason?: string;
}

export interface EtaReceipt {
  uuid: string;
  longId?: string;
  dateTimeReceived: string;
  receiptNumber: string;
}

// ============================================================================
// ETA AUTHENTICATION
// ============================================================================

export interface EtaTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

export interface EtaCredentials {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  apiBaseUrl: string;
}

// ============================================================================
// SIGNING & CRYPTO
// ============================================================================

export interface EtaSignatureData {
  signatureValue: string;
  certificateInfo: {
    issuerName: string;
    serialNumber: string;
    publicKey: string;
    validityFrom: string;
    validityTo: string;
  };
}

export interface CertificateDetails {
  subject: string;
  issuer: string;
  serialNumber: string;
  validFrom: Date;
  validTo: Date;
  fingerprint: string;
  algorithm: string;
}

// ============================================================================
// ETA CDN UPLOAD
// ============================================================================

export interface EtaCdnUploadResponse {
  publicUrl: string;
  uuid: string;
  receiptNumber: string;
}

export interface EtaSignedDocument {
  payload: EtaInvoiceData;
  signatures: EtaSignatureData[];
}
