/**
 * INVO — Shared TypeScript types for the infrastructure layer.
 * Used by both the API routes and the bridge client.
 */

export interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  supplierId: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

export interface CatalogFilters {
  supplierId?: string;
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CatalogListResponse {
  success: boolean;
  data: CatalogItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface GeoPoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface DeliveryQuoteRequest {
  pickup?: GeoPoint;
  dropoff?: GeoPoint;
  weightKg?: number;
  volumeM3?: number;
  urgency?: "standard" | "same_day" | "express";
}

export interface DeliveryQuote {
  quoteId: string;
  price: number;
  currency: string;
  estimatedHours: number;
  route: {
    from: GeoPoint;
    to: GeoPoint;
    distanceKm: number;
  };
  expiresAt: string;
}

export interface RouteStop {
  orderId: string;
  sequence: number;
  location: GeoPoint;
  eta: string;
}

export interface RouteAssignment {
  routeId: string;
  stops: RouteStop[];
  estimatedDuration: number;
  vehicleType: string;
  consolidate: boolean;
  driverAssigned: boolean;
  driverName?: string;
  driverPhone?: string;
  trackingUrl: string;
  status: string;
}

export interface SettlementRequest {
  invoiceId: string;
  supplierId: string;
  amount: number;
  method?: string;
}

export interface Settlement {
  settlementId: string;
  invoiceId: string;
  supplierId: string;
  amount: number;
  currency: string;
  method: string;
  status: string;
  executedAt: string;
  receiptUrl: string;
  platformFee: number;
  netAmount: number;
}

export type PartnerType = "supplier" | "logistics" | "bank";

export interface PartnerOnboardRequest {
  type: PartnerType;
  name: string;
  taxId: string;
  email: string;
  phone?: string;
  contactName?: string;
  address?: string;
  categories?: string[];
  documents?: string[];
}

export interface Partner {
  partnerId: string;
  type: PartnerType;
  name: string;
  taxId: string;
  email: string;
  status: "pending_review" | "approved" | "rejected";
  submittedAt: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: Record<string, any>;
}
