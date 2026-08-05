// Shared API Contracts — Zod Schemas for @hotels-vendors/api-contracts
// Single source of truth for Web API routes + Mobile API client

import { z } from "zod";

/* ═══════════════════════════════════════════════════════════════════
   COMMON / SHARED
   ═══════════════════════════════════════════════════════════════════ */

// Pagination
export const PaginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    success: z.boolean(),
    data: z.array(itemSchema),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  });

// Standard API Response
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

// Error Response
export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  code: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

// ID Params
export const IdParamsSchema = z.object({
  id: z.string().cuid(),
});

/* ═══════════════════════════════════════════════════════════════════
   ENUMS (Shared between Web & Mobile)
   ═══════════════════════════════════════════════════════════════════ */

export const RequisitionStatusSchema = z.enum([
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
  "CONVERTED_TO_PO",
  "CANCELLED",
]);

export const POStatusSchema = z.enum([
  "DRAFT",
  "SENT_TO_SUPPLIER",
  "ACCEPTED",
  "REJECTED",
  "PARTIALLY_DELIVERED",
  "DELIVERED",
  "INVOICED",
  "PAYMENT_APPROVED",
  "PAID",
  "CANCELLED",
]);

export const InvoiceStatusSchema = z.enum([
  "DRAFT",
  "ISSUED",
  "SUBMITTED",
  "VALIDATED",
  "PAID",
  "FACTORED",
  "OVERDUE",
  "DISPUTED",
  "CREDIT_NOTE",
]);

export const PaymentStatusSchema = z.enum([
  "UNPAID",
  "PARTIALLY_PAID",
  "PAID",
  "FACTORED",
  "OVERDUE",
]);

export const EtaStatusSchema = z.enum([
  "PENDING",
  "SUBMITTING",
  "ACCEPTED",
  "REJECTED",
  "RETRYING",
  "MANUAL_RESOLUTION",
]);

export const CreditLinePaymentStatusSchema = z.enum([
  "NOT_INITIATED",
  "REDIRECTED_TO_OLIV",
  "PAYMENT_PENDING",
  "PAID",
  "FAILED",
  "EXPIRED",
]);

export const NotificationTypeSchema = z.enum([
  "REQUISITION_SUBMITTED",
  "REQUISITION_APPROVED",
  "REQUISITION_REJECTED",
  "PO_CREATED",
  "PO_ACCEPTED",
  "PO_REJECTED",
  "INVOICE_RECEIVED",
  "INVOICE_APPROVED",
  "DELIVERY_SCHEDULED",
  "DELIVERY_COMPLETED",
  "PAYMENT_DUE",
  "PAYMENT_RECEIVED",
  "CREDIT_LINE_AVAILABLE",
  "SYSTEM_ALERT",
]);

export const ProductCategorySchema = z.enum([
  "F_AND_B",
  "CONSUMABLES",
  "GUEST_SUPPLIES",
  "FFE",
  "SERVICES",
]);

export const UserRoleSchema = z.enum([
  "OWNER",
  "REGIONAL_GM",
  "GM",
  "FINANCIAL_CONTROLLER",
  "DEPARTMENT_HEAD",
  "CLERK",
  "RECEIVING_CLERK",
  "SUPPLIER_SALES",
  "SUPPLIER_DELIVERY",
  "FACTORING_ANALYST",
  "PLATFORM_ADMIN",
]);

/* ═══════════════════════════════════════════════════════════════════
   HOTEL BUYER — REQUISITIONS
   ═══════════════════════════════════════════════════════════════════ */

export const RequisitionItemInputSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive(),
  unitOfMeasure: z.string().min(1),
  estimatedUnitPrice: z.number().positive().optional(),
  notes: z.string().optional(),
});

export const CreateRequisitionSchema = z.object({
  outletId: z.string().cuid(),
  propertyId: z.string().cuid(),
  items: z.array(RequisitionItemInputSchema).min(1),
  notes: z.string().optional(),
});

export type CreateRequisitionInput = z.infer<typeof CreateRequisitionSchema>;

export const RequisitionItemSchema = z.object({
  id: z.string().cuid(),
  product: z.object({
    id: z.string().cuid(),
    name: z.string(),
    sku: z.string(),
    category: ProductCategorySchema,
    unitOfMeasure: z.string(),
    supplier: z.object({ id: z.string().cuid(), name: z.string() }).optional(),
  }),
  quantity: z.number().int().positive(),
  unitOfMeasure: z.string(),
  estimatedUnitPrice: z.number().nullable(),
  notes: z.string().nullable(),
});

export const RequisitionSchema = z.object({
  id: z.string().cuid(),
  requisitionNumber: z.string(),
  status: RequisitionStatusSchema,
  outlet: z.object({ id: z.string().cuid(), name: z.string() }),
  property: z.object({ id: z.string().cuid(), name: z.string() }),
  hotel: z.object({ id: z.string().cuid(), name: z.string() }),
  requester: z.object({ id: z.string().cuid(), name: z.string(), email: z.string().email() }),
  approver: z.object({ id: z.string().cuid(), name: z.string() }).nullable(),
  items: z.array(RequisitionItemSchema),
  notes: z.string().nullable(),
  createdAt: z.string().datetime(),
  submittedAt: z.string().datetime().nullable(),
  approvedAt: z.string().datetime().nullable(),
  rejectedAt: z.string().datetime().nullable(),
  rejectionReason: z.string().nullable(),
  purchaseOrderId: z.string().cuid().nullable(),
  purchaseOrder: z.object({ id: z.string().cuid(), poNumber: z.string() }).nullable(),
});

export type Requisition = z.infer<typeof RequisitionSchema>;

export const ApproveRequisitionSchema = z.object({
  // No body needed — just ID in params
});

export const RejectRequisitionSchema = z.object({
  reason: z.string().min(10).max(500),
});

/* ═══════════════════════════════════════════════════════════════════
   HOTEL BUYER — PURCHASE ORDERS
   ═══════════════════════════════════════════════════════════════════ */

export const POItemInputSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

export const CreatePOSchema = z.object({
  requisitionId: z.string().cuid(),
  supplierId: z.string().cuid(),
  deliveryDate: z.string().datetime().optional(),
  deliveryInstructions: z.string().optional(),
  paymentTerms: z.string().optional(),
  items: z.array(POItemInputSchema).min(1),
});

export type CreatePOInput = z.infer<typeof CreatePOSchema>;

export const POItemSchema = z.object({
  id: z.string().cuid(),
  product: z.object({
    id: z.string().cuid(),
    name: z.string(),
    sku: z.string(),
    category: ProductCategorySchema,
  }),
  quantity: z.number().int().positive(),
  unitPrice: z.number(),
  total: z.number(),
  receivedQuantity: z.number().int().nonnegative(),
  notes: z.string().nullable(),
});

export const POSchema = z.object({
  id: z.string().cuid(),
  poNumber: z.string(),
  status: POStatusSchema,
  hotel: z.object({ id: z.string().cuid(), name: z.string() }),
  supplier: z.object({ id: z.string().cuid(), name: z.string() }),
  property: z.object({ id: z.string().cuid(), name: z.string() }).nullable(),
  outlet: z.object({ id: z.string().cuid(), name: z.string() }).nullable(),
  requester: z.object({ id: z.string().cuid(), name: z.string() }),
  approver: z.object({ id: z.string().cuid(), name: z.string() }).nullable(),
  items: z.array(POItemSchema),
  deliveryDate: z.string().datetime().nullable(),
  deliveryInstructions: z.string().nullable(),
  paymentTerms: z.string().nullable(),
  subtotal: z.number(),
  vatAmount: z.number(),
  total: z.number(),
  authoritySnapshot: z.unknown().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  requisitionId: z.string().cuid().nullable(),
  requisition: z.object({ id: z.string().cuid(), requisitionNumber: z.string() }).nullable(),
});

export type PurchaseOrder = z.infer<typeof POSchema>;

// Supplier actions on PO
export const AcceptPOSchema = z.object({
  // Optional: confirm delivery date, notes
  confirmedDeliveryDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const RejectPOSchema = z.object({
  reason: z.string().min(10).max(500),
});

/* ═══════════════════════════════════════════════════════════════════
   INVOICES
   ═══════════════════════════════════════════════════════════════════ */

export const InvoiceLineItemSchema = z.object({
  id: z.string().cuid(),
  product: z.object({
    id: z.string().cuid(),
    name: z.string(),
    sku: z.string(),
  }),
  quantity: z.number().int().positive(),
  unitPrice: z.number(),
  total: z.number(),
});

export const InvoiceSchema = z.object({
  id: z.string().cuid(),
  invoiceNumber: z.string(),
  status: InvoiceStatusSchema,
  paymentStatus: PaymentStatusSchema,
  purchaseOrder: z.object({ id: z.string().cuid(), poNumber: z.string() }).nullable(),
  supplier: z.object({ id: z.string().cuid(), name: z.string() }),
  hotel: z.object({ id: z.string().cuid(), name: z.string() }),
  lineItems: z.array(InvoiceLineItemSchema),
  subtotal: z.number(),
  vatRate: z.number(),
  vatAmount: z.number(),
  total: z.number(),
  etaUuid: z.string().nullable(),
  etaStatus: EtaStatusSchema,
  etaSubmissionId: z.string().nullable(),
  etaValidatedAt: z.string().datetime().nullable(),
  creditLinePaymentId: z.string().nullable(),
  creditLineStatus: CreditLinePaymentStatusSchema,
  creditLinePaidAt: z.string().datetime().nullable(),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime().nullable(),
  paidDate: z.string().datetime().nullable(),
  createdAt: z.string().datetime(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;

// Supplier creates invoice from accepted PO
export const CreateInvoiceSchema = z.object({
  purchaseOrderId: z.string().cuid(),
  invoiceNumber: z.string().min(1),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime().optional(),
  paymentTerms: z.string().optional(),
  lineItems: z.array(z.object({
    productId: z.string().cuid(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
  })).min(1),
});

export const UploadInvoiceDocumentSchema = z.object({
  // multipart/form-data handled separately
  // This is for metadata
  invoiceId: z.string().cuid(),
  documentType: z.enum(["INVOICE_PDF", "DELIVERY_NOTE", "OTHER"]),
});

/* ═══════════════════════════════════════════════════════════════════
   SUPPLIER — CATALOG / INVENTORY
   ═══════════════════════════════════════════════════════════════════ */

export const ProductSchema = z.object({
  id: z.string().cuid(),
  sku: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  category: ProductCategorySchema,
  subcategory: z.string().nullable(),
  unitOfMeasure: z.string(),
  unitPrice: z.number().nullable(),
  stockQuantity: z.number().int().nonnegative(),
  minOrderQty: z.number().int().positive(),
  leadTimeDays: z.number().int().nonnegative(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "OUT_OF_STOCK", "DISCONTINUED"]),
  supplier: z.object({ id: z.string().cuid(), name: z.string() }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateProductSchema = z.object({
  sku: z.string().min(3).max(50),
  name: z.string().min(2).max(200),
  description: z.string().optional(),
  category: ProductCategorySchema,
  subcategory: z.string().optional(),
  unitOfMeasure: z.string(),
  unitPrice: z.number().positive(),
  stockQuantity: z.number().int().nonnegative().default(0),
  minOrderQty: z.number().int().positive().default(1),
  leadTimeDays: z.number().int().nonnegative().default(1),
  images: z.array(z.string().url()).optional(),
});

export const UpdateProductSchema = CreateProductSchema.partial();

/* ═══════════════════════════════════════════════════════════════════
   FINTECH — OLIV CREDIT LINE & CHECKOUT
   ═══════════════════════════════════════════════════════════════════ */

export const OlivCheckoutRequestSchema = z.object({
  invoiceId: z.string().cuid(),
  amount: z.number().positive(),
  currency: z.string().default("EGP"),
  returnUrl: z.string().url().optional(),
});

export type OlivCheckoutRequest = z.infer<typeof OlivCheckoutRequestSchema>;

export const OlivCheckoutResponseSchema = z.object({
  checkoutUrl: z.string().url(),
  reference: z.string(),
});

export type OlivCheckoutResponse = z.infer<typeof OlivCheckoutResponseSchema>;

export const OlivStatusResponseSchema = z.object({
  reference: z.string(),
  status: z.enum(["PENDING", "AUTHORIZED", "COMPLETED", "FAILED", "EXPIRED", "CANCELLED"]),
  amount: z.number().optional(),
  paidAt: z.string().datetime().optional(),
  error: z.string().optional(),
});

export type OlivStatusResponse = z.infer<typeof OlivStatusResponseSchema>;

// Credit Facility (Supplier view)
export const CreditFacilitySchema = z.object({
  id: z.string().cuid(),
  olivFacilityId: z.string(),
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "EXPIRED", "DEFAULTED"]),
  creditLimitEgp: z.number(),
  utilizedEgp: z.number(),
  availableEgp: z.number(),
  interestRate: z.number().nullable(),
  advanceRate: z.number().nullable(),
  discountRate: z.number().nullable(),
  settlementDays: z.number().int().positive(),
  approvedAt: z.string().datetime().nullable(),
  expiresAt: z.string().datetime().nullable(),
  lastSyncedAt: z.string().datetime().nullable(),
  paymentSchedule: z.array(z.object({
    dueDate: z.string().datetime(),
    amountEgp: z.number(),
    status: z.enum(["PENDING", "PAID", "OVERDUE"]),
  })).optional(),
});

export type CreditFacility = z.infer<typeof CreditFacilitySchema>;

// Factoring History
export const FactoringHistoryItemSchema = z.object({
  id: z.string().cuid(),
  invoiceId: z.string().cuid(),
  invoiceNumber: z.string(),
  amount: z.number(),
  status: z.enum(["DISBURSED", "SETTLED", "DEFAULTED", "PENDING"]),
  disbursedAt: z.string().datetime().nullable(),
  settledAt: z.string().datetime().nullable(),
  factoringFee: z.number().nullable(),
  netReceived: z.number().nullable(),
});

/* ═══════════════════════════════════════════════════════════════════
   DELIVERY / LOGISTICS (Reserved for Future Phase)
   ═══════════════════════════════════════════════════════════════════ */

export const DeliveryUpdateSchema = z.object({
  poId: z.string().cuid(),
  status: z.enum(["SCHEDULED", "IN_TRANSIT", "ARRIVED", "DELIVERED", "FAILED"]),
  deliveredAt: z.string().datetime().optional(),
  podPhotoUrl: z.string().url().optional(),
  signatureUrl: z.string().url().optional(),
  notes: z.string().optional(),
});

/* ═══════════════════════════════════════════════════════════════════
   NOTIFICATIONS
   ═══════════════════════════════════════════════════════════════════ */

export const NotificationSchema = z.object({
  id: z.string().cuid(),
  type: NotificationTypeSchema,
  title: z.string(),
  body: z.string(),
  data: z.record(z.unknown()).nullable(),
  readAt: z.string().datetime().nullable(),
  sentAt: z.string().datetime(),
  createdAt: z.string().datetime(),
});

export type Notification = z.infer<typeof NotificationSchema>;

/* ═══════════════════════════════════════════════════════════════════
   REAL-TIME EVENTS (SSE)
   ═══════════════════════════════════════════════════════════════════ */

export const SSEEventSchema = z.object({
  event: z.string(), // e.g., "requisition.approved", "po.accepted", "invoice.paid"
  data: z.unknown(),
  timestamp: z.string().datetime(),
});

export type SSEEvent = z.infer<typeof SSEEventSchema>;

/* ═══════════════════════════════════════════════════════════════════
   WEBHOOK PAYLOADS (External → Web)
   ═══════════════════════════════════════════════════════════════════ */

export const OlivWebhookPayloadSchema = z.object({
  event_type: z.string(),
  event_id: z.string(),
  timestamp: z.string().datetime(),
  data: z.record(z.unknown()),
});

export const EtaWebhookPayloadSchema = z.object({
  submissionId: z.string(),
  uuid: z.string(),
  status: EtaStatusSchema,
  errorMessage: z.string().optional(),
  timestamp: z.string().datetime(),
});

/* ═══════════════════════════════════════════════════════════════════
   BARREL EXPORTS
   ═══════════════════════════════════════════════════════════════════ */

export const HotelSchemas = {
  CreateRequisition: CreateRequisitionSchema,
  Requisition: RequisitionSchema,
  ApproveRequisition: ApproveRequisitionSchema,
  RejectRequisition: RejectRequisitionSchema,
  CreatePO: CreatePOSchema,
  PO: POSchema,
  AcceptPO: AcceptPOSchema,
  RejectPO: RejectPOSchema,
  Invoice: InvoiceSchema,
  CreateInvoice: CreateInvoiceSchema,
  OlivCheckoutRequest: OlivCheckoutRequestSchema,
  OlivCheckoutResponse: OlivCheckoutResponseSchema,
  OlivStatusResponse: OlivStatusResponseSchema,
};

export const SupplierSchemas = {
  Product: ProductSchema,
  CreateProduct: CreateProductSchema,
  UpdateProduct: UpdateProductSchema,
  PO: POSchema,
  AcceptPO: AcceptPOSchema,
  RejectPO: RejectPOSchema,
  Invoice: InvoiceSchema,
  CreateInvoice: CreateInvoiceSchema,
  CreditFacility: CreditFacilitySchema,
  FactoringHistoryItem: FactoringHistoryItemSchema,
  DeliveryUpdate: DeliveryUpdateSchema,
};

export const CommonSchemas = {
  PaginationParams: PaginationParamsSchema,
  IdParams: IdParamsSchema,
  ApiResponse: ApiResponseSchema,
  ApiError: ApiErrorSchema,
  SSEEvent: SSEEventSchema,
  Notification: NotificationSchema,
  OlivWebhook: OlivWebhookPayloadSchema,
  EtaWebhook: EtaWebhookPayloadSchema,
};

// Re-export all enums
export {
  RequisitionStatusSchema,
  POStatusSchema,
  InvoiceStatusSchema,
  PaymentStatusSchema,
  EtaStatusSchema,
  CreditLinePaymentStatusSchema,
  NotificationTypeSchema,
  ProductCategorySchema,
  UserRoleSchema,
};