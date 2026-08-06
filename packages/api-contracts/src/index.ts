import { z } from 'zod';

export const PaginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    message: z.string().optional(),
  });

export const IdParamsSchema = z.object({
  id: z.string().cuid(),
});

export const RequisitionStatusSchema = z.enum([
  'DRAFT',
  'SUBMITTED',
  'APPROVED',
  'REJECTED',
  'CONVERTED_TO_PO',
  'CANCELLED',
]);

export const POStatusSchema = z.enum([
  'DRAFT',
  'SENT_TO_SUPPLIER',
  'ACCEPTED',
  'REJECTED',
  'PARTIALLY_DELIVERED',
  'DELIVERED',
  'INVOICED',
  'PAYMENT_APPROVED',
  'PAID',
  'CANCELLED',
]);

export const InvoiceStatusSchema = z.enum([
  'DRAFT',
  'ISSUED',
  'SUBMITTED',
  'VALIDATED',
  'PAID',
  'FACTORED',
  'OVERDUE',
  'DISPUTED',
  'CREDIT_NOTE',
]);

export const PaymentStatusSchema = z.enum([
  'UNPAID',
  'PARTIALLY_PAID',
  'PAID',
  'FACTORED',
  'OVERDUE',
]);

export const EtaStatusSchema = z.enum([
  'PENDING',
  'SUBMITTED',
  'ACCEPTED',
  'VALIDATED',
  'REJECTED',
  'FAILED',
]);

export const UserRoleSchema = z.enum([
  'hotel',
  'supplier',
  'manager',
  'finance',
  'admin',
]);

export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string(),
  role: UserRoleSchema,
  tenantId: z.string(),
  hotelId: z.string().optional(),
  supplierId: z.string().optional(),
});

export const LoginCredentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const OtpLoginSchema = z.object({
  phone: z.string(),
  otp: z.string().length(6),
});

export const RegisterSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string(),
  role: z.enum(['hotel', 'supplier']),
  city: z.string(),
  governorate: z.string(),
  termsAccepted: z.boolean().refine((v) => v === true),
});

export const RequisitionSchema = z.object({
  id: z.string().cuid().optional(),
  productName: z.string(),
  barcode: z.string().optional(),
  quantity: z.number().int().positive(),
  unit: z.string(),
  price: z.number().positive(),
  outlet: z.string(),
  note: z.string().optional(),
  supplierName: z.string().optional(),
  status: RequisitionStatusSchema.default('DRAFT'),
});

export const OrderSchema = z.object({
  id: z.string().cuid().optional(),
  hotelId: z.string(),
  supplierId: z.string(),
  items: z.array(z.object({
    productName: z.string(),
    sku: z.string().optional(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    totalPrice: z.number().positive(),
  })),
  totalAmount: z.number().positive(),
  status: POStatusSchema,
  paymentGuaranteed: z.boolean().default(false),
});

export const InvoiceSchema = z.object({
  id: z.string().cuid().optional(),
  orderId: z.string().cuid(),
  supplierId: z.string(),
  invoiceNumber: z.string(),
  amount: z.number().positive(),
  vatAmount: z.number().positive().default(0),
  totalAmount: z.number().positive(),
  status: InvoiceStatusSchema.default('DRAFT'),
  etaStatus: EtaStatusSchema.default('PENDING'),
  etaUuid: z.string().optional(),
  dueDate: z.string().date(),
});

export const FactoringRequestSchema = z.object({
  invoiceId: z.string().cuid(),
  amount: z.number().positive(),
  factoringPartner: z.string(),
  discountRate: z.number().positive(),
  notes: z.string().optional(),
});

export const NotificationSchema = z.object({
  id: z.string().cuid().optional(),
  userId: z.string().cuid(),
  type: z.enum(['requisition', 'po', 'invoice', 'payment', 'alert', 'delivery']),
  title: z.string(),
  body: z.string(),
  read: z.boolean().default(false),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const CatalogItemSchema = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  sku: z.string(),
  category: z.string(),
  price: z.number().positive(),
  unit: z.string(),
  stock: z.number().int().nonnegative(),
  supplierId: z.string().cuid(),
  supplierName: z.string(),
  imageUrl: z.string().optional(),
  description: z.string().optional(),
});

export const QuoteRequestSchema = z.object({
  id: z.string().cuid().optional(),
  hotelId: z.string().cuid(),
  title: z.string(),
  description: z.string(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    unit: z.string(),
    specifications: z.string().optional(),
  })),
  status: z.enum(['DRAFT', 'OPEN', 'QUOTING', 'AWARDED', 'CLOSED']).default('DRAFT'),
  createdAt: z.string().datetime().optional(),
});

export const QuoteSchema = z.object({
  id: z.string().cuid().optional(),
  quoteRequestId: z.string().cuid(),
  supplierId: z.string().cuid(),
  items: z.array(z.object({
    name: z.string(),
    quantity: z.number().int().positive(),
    unitPrice: z.number().positive(),
    totalPrice: z.number().positive(),
  })),
  totalAmount: z.number().positive(),
  validUntil: z.string().date(),
  status: z.enum(['PENDING', 'ACCEPTED', 'REJECTED']).default('PENDING'),
});

export const AuthorityMatrixSchema = z.object({
  id: z.string().cuid().optional(),
  hotelId: z.string().cuid(),
  orderValueThreshold: z.number().positive(),
  requiredApprovals: z.number().int().positive(),
  roles: z.array(z.string()),
});

export const CreditLineSchema = z.object({
  id: z.string().cuid().optional(),
  hotelId: z.string().cuid(),
  supplierId: z.string().cuid(),
  limit: z.number().positive(),
  utilized: z.number().positive().default(0),
  available: z.number().positive(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'CLOSED']).default('ACTIVE'),
  terms: z.object({
    paymentDays: z.number().int().positive(),
    discountRate: z.number().positive().optional(),
  }).optional(),
});

export const SettlementSchema = z.object({
  id: z.string().cuid().optional(),
  invoiceId: z.string().cuid(),
  supplierId: z.string().cuid(),
  amount: z.number().positive(),
  platformFee: z.number().positive(),
  netAmount: z.number().positive(),
  method: z.enum(['INSTAPAY', 'FAWRY', 'PAYMOB', 'BANK_TRANSFER']),
  status: z.enum(['PENDING', 'SETTLED', 'FAILED', 'REFUNDED']).default('PENDING'),
});

export const DeliverySchema = z.object({
  id: z.string().cuid().optional(),
  orderId: z.string().cuid(),
  driverId: z.string(),
  vehicleId: z.string(),
  status: z.enum(['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'RETURNED']).default('PENDING'),
  estimatedDelivery: z.string().datetime(),
  actualDelivery: z.string().datetime().optional(),
  trackingUrl: z.string().url().optional(),
});

export type User = z.infer<typeof UserSchema>;
export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type OtpLogin = z.infer<typeof OtpLoginSchema>;
export type RegisterData = z.infer<typeof RegisterSchema>;
export type Requisition = z.infer<typeof RequisitionSchema>;
export type Order = z.infer<typeof OrderSchema>;
export type Invoice = z.infer<typeof InvoiceSchema>;
export type FactoringRequest = z.infer<typeof FactoringRequestSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type CatalogItem = z.infer<typeof CatalogItemSchema>;
export type QuoteRequest = z.infer<typeof QuoteRequestSchema>;
export type Quote = z.infer<typeof QuoteSchema>;
export type AuthorityMatrix = z.infer<typeof AuthorityMatrixSchema>;
export type CreditLine = z.infer<typeof CreditLineSchema>;
export type Settlement = z.infer<typeof SettlementSchema>;
export type Delivery = z.infer<typeof DeliverySchema>;