/**
 * Core Type Definitions - Path to 98/100
 * Centralized type safety for all domains
 */

// ============================================================================
// BASE TYPES
// ============================================================================

export type UserType = 'HOTEL' | 'SUPPLIER' | 'ADMIN' | 'AGENT';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'AUTHORIZED' | 'CAPTURED' | 'FAILED' | 'REFUNDED';
export type LpoLevel = 1 | 2 | 3;
export type LpoStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'FULLY_APPROVED';

// ============================================================================
// USER & AUTHENTICATION
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  userType: UserType;
  tenantId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface HotelProfile {
  id: string;
  userId: string;
  name: string;
  taxId: string;
  registrationNumber: string;
  address: string;
  contactName: string;
  contactPhone: string;
}

export interface SupplierProfile {
  id: string;
  userId: string;
  name: string;
  taxId: string;
  licenseNumber: string;
  address: string;
}

export interface Session {
  user: User;
  token: string;
  expiresAt: Date;
}

// ============================================================================
// MARKETPLACE
// ============================================================================

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  slug: string;
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  unit: string;
  packaging: string;
  minOrderQuantity: number;
  maxOrderQuantity: number;
  shelfLife: number;
  origin: string;
  certifications: string[];
  supplierId: string;
  categoryId: string;
  images?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product?: Product;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  expiresAt?: Date;
}

// ============================================================================
// ORDERS & PROCUREMENT
// ============================================================================

export interface OrderItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface LpoAuthorization {
  level: LpoLevel;
  status: LpoStatus;
  approverId?: string;
  approvedAt?: Date;
  notes?: string;
}

export interface Order {
  id: string;
  hotelId: string;
  supplierId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  supplierStatus?: string;
  lpo: LpoAuthorization;
  requestedDeliveryDate: Date;
  confirmedDeliveryDate?: Date;
  deliveryDate?: Date;
  specialInstructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// FINTECH & PAYMENTS
// ============================================================================

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: 'CREDIT_FACILITY' | 'CARD' | 'BANK_TRANSFER' | 'CASH';
  stripePaymentIntentId?: string;
  authorizedAt?: Date;
  capturedAt?: Date;
  failedAt?: Date;
  failureReason?: string;
}

export interface CreditFacility {
  id: string;
  hotelId: string;
  limit: number;
  used: number;
  remaining: number;
  interestRate: number;
  status: 'ACTIVE' | 'SUSPENDED' | 'CLOSED';
}

export interface LedgerEntry {
  id: string;
  account: string;
  debit: number;
  credit: number;
  transactionId: string;
  description?: string;
  createdAt: Date;
}

export interface FactoringRequest {
  id: string;
  orderId: string;
  supplierId: string;
  amount: number;
  advanceRate: number;
  maxAdvance: number;
  fee: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'DISBURSED';
  requestedAt: Date;
  approvedAt?: Date;
  disbursedAt?: Date;
}

// ============================================================================
// ETA (Egypt Tax Authority - E-Invoicing)
// ============================================================================

export interface EtaCredentials {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  apiBaseUrl: string;
}

export interface EtaInvoice {
  issuer: {
    name: string;
    regNum: string;
  };
  receiver: {
    name: string;
    regNum?: string;
  };
  documentType: 'I' | 'C' | 'D';
  dateIssued: string;
  internalId: string;
  totalSales: number;
  totalDiscount: number;
  netAmount: number;
  totalAmount: number;
  taxTotals: Array<{
    taxType: string;
    amount: number;
  }>;
}

export interface EtaApiResponse<T> {
  data: T;
  status: 'success' | 'error';
  message?: string;
  correlationId?: string;
}

// ============================================================================
// SWARM AI AGENTS
// ============================================================================

export interface SwarmMessage {
  id: string;
  role: 'user' | 'assistant' | 'system' | 'tool';
  content: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface SwarmAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  model: string;
  systemPrompt: string;
  isActive: boolean;
}

export interface SwarmThread {
  id: string;
  userId: string;
  agentId: string;
  messages: SwarmMessage[];
  status: 'active' | 'closed' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// API RESPONSES
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    hasMore?: boolean;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    totalPages: number;
  };
}

// ============================================================================
// AUDIT & COMPLIANCE
// ============================================================================

export interface AuditLog {
  id: string;
  action: string;
  actor: string;
  actorType: 'USER' | 'SYSTEM' | 'AGENT';
  resource: string;
  resourceId: string;
  details?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface WebhookEvent {
  id: string;
  source: string;
  eventType: string;
  payload: unknown;
  signature: string;
  processed: boolean;
  processedAt?: Date;
  error?: string;
  retryCount: number;
  createdAt: Date;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
  statusCode: number;
};

// Re-export commonly used types
export * from './fintech';
export * from './marketplace';
