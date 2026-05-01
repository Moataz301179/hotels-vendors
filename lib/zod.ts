import { z } from "zod";
import {
  HotelTier,
  HotelStatus,
  UserRole,
  UserStatus,
  SupplierStatus,
  SupplierTier,
  ProductCategory,
  ProductStatus,
  OrderStatus,
  ApprovalAction,
  EtaStatus,
  InvoiceStatus,
  PaymentStatus,
  FactoringStatus,
  AuthorityAction,
  AuditStatus,
  FactoringCompanyStatus,
  CreditFacilityStatus,
  OutletType,
  TripStatus,
} from "@prisma/client";

/* ── Hotel Schemas ── */
export const HotelCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  legalName: z.string().optional(),
  taxId: z.string().min(3, "Tax ID is required"),
  commercialReg: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1, "City is required"),
  governorate: z.string().min(1, "Governorate is required"),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  starRating: z.number().int().min(1).max(7).optional(),
  roomCount: z.number().int().optional(),
  tier: z.nativeEnum(HotelTier).default(HotelTier.CORE),
  creditLimit: z.number().optional(),
});

export const HotelUpdateSchema = HotelCreateSchema.partial();

/* ── User Schemas ── */
export const UserCreateSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole).default(UserRole.DEPARTMENT_HEAD),
  hotelId: z.string().cuid(),
  canOverride: z.boolean().default(false),
});

export const UserUpdateSchema = UserCreateSchema.partial();

/* ── Supplier Schemas ── */
export const SupplierCreateSchema = z.object({
  name: z.string().min(2),
  legalName: z.string().optional(),
  taxId: z.string().min(3),
  commercialReg: z.string().optional(),
  address: z.string().optional(),
  city: z.string().min(1),
  governorate: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  certifications: z.string().optional(),
  bankAccount: z.string().optional(),
  bankName: z.string().optional(),
});

export const SupplierUpdateSchema = SupplierCreateSchema.partial();

/* ── Product Schemas ── */
export const ProductCreateSchema = z.object({
  sku: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.nativeEnum(ProductCategory),
  subcategory: z.string().optional(),
  unitPrice: z.number().positive(),
  currency: z.string().default("EGP"),
  stockQuantity: z.number().int().min(0).default(0),
  minOrderQty: z.number().int().min(1).default(1),
  leadTimeDays: z.number().int().min(1).default(1),
  unitOfMeasure: z.string().default("piece"),
  supplierId: z.string().cuid(),
});

export const ProductUpdateSchema = ProductCreateSchema.partial();

/* ── Order Schemas ── */
export const OrderItemSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  notes: z.string().optional(),
});

export const OrderCreateSchema = z.object({
  orderNumber: z.string().min(1),
  hotelId: z.string().cuid(),
  propertyId: z.string().cuid().optional(),
  outletId: z.string().cuid().optional(),
  supplierId: z.string().cuid(),
  requesterId: z.string().cuid(),
  items: z.array(OrderItemSchema).min(1, "At least one item is required"),
  deliveryDate: z.string().datetime().optional(),
  deliveryInstructions: z.string().optional(),
});

/* ── Invoice Schemas ── */
export const InvoiceCreateSchema = z.object({
  invoiceNumber: z.string().min(1),
  orderId: z.string().cuid(),
  hotelId: z.string().cuid(),
  supplierId: z.string().cuid(),
  subtotal: z.number().positive(),
  vatRate: z.number().default(14),
  vatAmount: z.number().positive(),
  total: z.number().positive(),
  issueDate: z.string().datetime(),
  dueDate: z.string().datetime().optional(),
});

/* ── Authority Matrix Schemas ── */
export const AuthorityRuleSchema = z.object({
  role: z.nativeEnum(UserRole),
  minValue: z.number().min(0),
  maxValue: z.number().min(0),
  category: z.string(),
  supplierTier: z.string(),
  action: z.nativeEnum(AuthorityAction),
  routeToRole: z.nativeEnum(UserRole).optional(),
  hotelId: z.string().cuid().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  priority: z.number().int().default(0),
});

/* ── Cart Schemas ── */
export const CartItemCreateSchema = z.object({
  productId: z.string().cuid(),
  quantity: z.number().int().positive(),
  notes: z.string().optional(),
});

export const CartCheckoutSchema = z.object({
  supplierId: z.string().cuid(),
  deliveryDate: z.string().datetime().optional(),
  deliveryInstructions: z.string().optional(),
  outletId: z.string().cuid().optional(),
});

/* ── ETA Submission Schemas ── */
export const EtaSubmissionSchema = z.object({
  invoiceId: z.string().cuid(),
});

/* ── Factoring Schemas ── */
export const FactoringCompanySchema = z.object({
  name: z.string().min(2),
  legalName: z.string().optional(),
  taxId: z.string().min(3),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  maxFacility: z.number().optional(),
  interestRate: z.number().optional(),
  rate: z.number().optional(),
  status: z.nativeEnum(FactoringCompanyStatus).default(FactoringCompanyStatus.ACTIVE),
});

export const CreditFacilityCreateSchema = z.object({
  hotelId: z.string().cuid(),
  factoringCompanyId: z.string().cuid(),
  limit: z.number().positive(),
  interestRate: z.number().min(0),
});

export const CreditFacilityUpdateSchema = z.object({
  status: z.nativeEnum(CreditFacilityStatus).optional(),
  limit: z.number().positive().optional(),
  utilized: z.number().min(0).optional(),
});

/* ── Outlet Schemas ── */
export const OutletCreateSchema = z.object({
  propertyId: z.string().cuid(),
  name: z.string().min(2),
  type: z.nativeEnum(OutletType).default(OutletType.KITCHEN),
  managerName: z.string().optional(),
  managerPhone: z.string().optional(),
  operatingHours: z.string().optional(),
});

export const OutletUpdateSchema = OutletCreateSchema.partial().omit({ propertyId: true });

/* ── Logistics Schemas ── */
export const TripCreateSchema = z.object({
  hubId: z.string().cuid(),
  driverName: z.string().min(1),
  driverPhone: z.string().min(1),
  vehiclePlate: z.string().min(1),
  scheduledDate: z.string().datetime(),
});

export const TripUpdateSchema = z.object({
  status: z.nativeEnum(TripStatus).optional(),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
  vehiclePlate: z.string().optional(),
  scheduledDate: z.string().datetime().optional(),
});

export const TripStopCreateSchema = z.object({
  orderId: z.string().cuid().optional(),
  stopNumber: z.number().int().min(1),
  eta: z.string().datetime().optional(),
});

/* ── Supplier Audit Schemas ── */
export const SupplierAuditCreateSchema = z.object({
  auditorName: z.string().min(1),
  auditDate: z.string().datetime(),
  score: z.number().int().min(0).max(100).optional(),
  status: z.nativeEnum(AuditStatus).default("PENDING"),
  coldChainCompliant: z.boolean().optional(),
  haccpCertified: z.boolean().optional(),
  onSiteVisited: z.boolean().optional(),
  labTested: z.boolean().optional(),
  notes: z.string().optional(),
});

export const SupplierAuditUpdateSchema = SupplierAuditCreateSchema.partial();

/* ── Auth Schemas ── */
export const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  hotelId: z.string().cuid().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export const BusinessRegisterSchema = z.object({
  type: z.enum(["hotel", "supplier", "factoring", "shipping"]),
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional(),
  city: z.string().min(1),
  governorate: z.string().min(1),
  address: z.string().optional(),
  taxId: z.string().min(3),
  commercialReg: z.string().optional(),
  crDocumentUrl: z.string().optional(),
  taxDocumentUrl: z.string().optional(),
});

export const LoginSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

/* ── Query Params ── */
export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
