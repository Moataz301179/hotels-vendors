/**
 * ETA (Egyptian Tax Authority) Types
 * Hotels Vendors Compliance Layer
 */

export interface EtaInvoicePayload {
  invoiceNumber: string;
  invoiceDate: string;
  paymentTerms: number;
  receiverId: string;
  receiverName: string;
  receiverTaxId: string;
  lines: EtaInvoiceLine[];
  totalDiscountAmount: number;
  totalSalesAmount: number;
  netAmount: number;
  taxAmount: number;
  totalAmount: number;
  issuer?: {
    type: string;
    id: string;
    name: string;
    address: {
      country: string;
      governate: string;
      regionCity: string;
      street: string;
      buildingNumber: string;
    };
  };
  receiver?: {
    type: string;
    id: string;
    name: string;
    address: {
      country: string;
      governate: string;
      regionCity: string;
      street: string;
      buildingNumber: string;
    };
  };
}

export interface EtaInvoiceLine {
  productCode: string;
  productName: string;
  productDescription?: string;
  unitOfMeasure: string;
  quantity: number;
  unitPrice: number;
  discountRate: number;
  discountAmount: number;
  salesAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

export interface EtaTaxpayer {
  id: string;
  name: string;
  taxId: string;
  address?: string;
  city?: string;
  governorate?: string;
}

export enum EtaTaxType {
  STANDARD = "ST",
  REDUCED_1 = "T1",
  REDUCED_2 = "T2",
  REDUCED_3 = "T3",
  ZERO = "Z",
  EXEMPT = "EX",
}

export interface EtaSubmissionResponse {
  uuid: string;
  status: string;
  submissionId?: string;
  technicalError?: string;
  total?: number;
  totalSales?: number;
  totalDiscount?: number;
  netAmount?: number;
  issuerId?: string;
  issuerName?: string;
  receiverId?: string;
  receiverName?: string;
  longId?: string;
  internalId?: string;
  typeName?: string;
  typeVersionName?: string;
  dateTimeIssued?: string;
  dateTimeReceived?: string;
  dateTimeValidated?: string;
  documentCount?: number;
  rejectionReasons?: { error: string; errorCode: string }[];
}

export interface EtaConfig {
  baseUrl: string;
  apiPath: string;
  apiVersion?: string;
  positionId: string;
  registrationNumber: string;
  privateKey: string;
  clientId?: string;
  clientSecret?: string;
  environment: "sandbox" | "production";
  maxRetries?: number;
  timeoutMs?: number;
  retryDelayMs?: number;
}

export interface EtaDocumentStatus {
  uuid: string;
  status: string;
  rejectionReason?: string;
  submissionDate?: Date;
  processedDate?: Date;
}

export interface EtaTaxableItem {
  itemName: string;
  itemCode: string;
  unitType: string;
  quantity: number;
  unitPrice: number;
  discountRate: number;
  discountAmount: number;
  salesAmount: number;
  taxType: EtaTaxType;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

export interface EtaValidationResult {
  valid: boolean;
  message?: string;
  code?: string;
  errors?: string[];
  warnings?: string[];
  details?: Record<string, unknown>;
  etaRecord?: Record<string, unknown>;
}

export type EtaValidationCode =
  | "MISSING_REQUIRED_FIELD"
  | "INVALID_TAX_ID"
  | "INVALID_LINE_TOTAL"
  | "INVALID_TAX_CALCULATION"
  | "DUPLICATE_INVOICE"
  | "INVOICE_TOTAL_MISMATCH";
