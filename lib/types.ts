/**
 * Shared TypeScript types for HotelsVendors
 */

// ─── Role ───────────────────────────────────────────────────
export type Role =
  | "hotel_admin"
  | "gm"
  | "finance_director"
  | "supplier_manager"
  | "supplier_admin"
  | "platform_admin"
  | "auditor"
  | "logistics_manager"
  | "factoring_manager"
  | "partner_officer"
  | "carrier"
  | "unknown";

// ─── User ───────────────────────────────────────────────────
export interface User {
  id: string;
  name?: string;
  email: string;
  role: Role;
  tenantId: string;
  platformRole: string;
  orgId?: string;
}

// ─── Supplier ────────────────────────────────────────────────
export interface Supplier {
  id: string;
  name: string;
  nameAr?: string;
  taxId: string;
  city: string;
  governorate: string;
  status: string;
  tier: string;
  logoUrl?: string;
  rating?: number;
  categories?: string[];
  description?: string;
}

// ─── Product ────────────────────────────────────────────────
export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  sku: string;
  price: number;
  stock: number | string;
  category?: string;
  categoryId?: string;
  supplierId?: string;
}

// ─── Hotel ───────────────────────────────────────────────────
export interface Hotel {
  id: string;
  name: string;
  taxId: string;
  governorate: string;
  status: string;
}

// ─── Carrier ────────────────────────────────────────────────
export interface Carrier {
  id: string;
  name: string;
  status: string;
  vehicleCount?: number;
}

// ─── Category ───────────────────────────────────────────────
export interface Category {
  id: string;
  name: string;
  nameAr?: string;
}

// ─── Order ──────────────────────────────────────────────────
export interface Order {
  id: string;
  po: string;
  hotelId: string;
  supplierId: string;
  status: string;
  total: number;
  currency: string;
  vat: number;
  note?: string;
  approval: {
    state: string;
    required: string[] | boolean;
    approverId?: string;
    approvers?: string[];
    approvedAt?: string;
    rejectedAt?: string;
    rejectionReason?: string;
    note?: string;
  };
  fulfillment: string;
  receipt: string;
  lines?: Array<{ id: string; productId: string; name: string; qty: number; price: number; vat: number; total: number; received?: number | string; condition?: string; category?: string }>;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
  deliveries?: Array<{ id: string; status: string; carrierId: string; eta: string; delayed: boolean; orderId?: string }>;
  invoices?: Array<{ id: string; orderId?: string; number: string; supplierId?: string; hotelId?: string; status: string; amount: number; total?: number; dueDate: string; tenor?: string }>;
  financing?: Array<{ id: string; orderId?: string; provider: string; status: string; amount: number; disbursedAt: string; hotelId?: string; number?: string; tenor?: string }>;
  products?: Product[];
}

// ─── Delivery ───────────────────────────────────────────────
export interface Delivery {
  id: string;
  status: string;
  carrierId: string;
  eta: string;
  delayed: boolean;
  orderId?: string;
  vehicle?: string;
  driver?: string;
  driverAr?: string;
  origin?: string;
  originAr?: string;
  destination?: string;
  destinationAr?: string;
  window?: string;
  temp?: boolean;
  docs?: boolean;
  exceptions?: Array<{ at: string; note: string }>;
  stops?: Array<{ id: string; status: string; arrived?: string; delivered?: string }>;
}

// ─── Invoice ────────────────────────────────────────────────
export interface Invoice {
  id: string;
  orderId?: string;
  number: string;
  supplierId?: string;
  hotelId?: string;
  status: string;
  amount: number;
  total?: number;
  dueDate: string;
  tenor?: string;
}

// ─── Financing ──────────────────────────────────────────────
export interface Financing {
  id: string;
  orderId?: string;
  provider: string;
  status: string;
  amount: number;
  disbursedAt: string;
  hotelId?: string;
  number?: string;
  tenor?: string;
}

// ─── API Response ───────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// ─── App Context Data ──────────────────────────────────────
export interface AppContextData {
  categories?: Category[];
  suppliers?: Supplier[];
  settings?: Record<string, unknown>;
  orders?: Order[];
  deliveries?: Delivery[];
  invoices?: Invoice[];
  financing?: Financing[];
  products?: Product[];
}
