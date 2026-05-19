/**
 * Dashboard Explorer Types
 * Type definitions for admin explorer page entities
 */

// ============================================================================
// EXPLORER ENTITY TYPES
// ============================================================================

export interface ExplorerUser {
  id: string;
  name: string;
  email: string;
  platformRole: string;
  status: string;
  tenant?: {
    name?: string;
  } | null;
  createdAt: string;
}

export interface ExplorerSupplier {
  id: string;
  name: string;
  city?: string | null;
  status: string;
  tier?: string | null;
  rating?: number | null;
  _count?: {
    products?: number;
    orders?: number;
  };
}

export interface ExplorerHotel {
  id: string;
  name: string;
  city?: string | null;
  status: string;
  rooms?: number | null;
  chain?: string | null;
  _count?: {
    orders?: number;
  };
}

export interface ExplorerOrder {
  id: string;
  orderNumber?: string;
  status: string;
  total?: number | null;
  hotel?: {
    name?: string;
  } | null;
  supplier?: {
    name?: string;
  } | null;
  createdAt: string;
  items?: Array<{
    quantity: number;
    unitPrice: number;
  }>;
}

export interface ExplorerProduct {
  id: string;
  name: string;
  category?: string | null;
  basePrice?: number | null;
  status: string;
  supplier?: {
    name?: string;
  } | null;
  _count?: {
    orderItems?: number;
  };
}

export interface ExplorerInvoice {
  id: string;
  invoiceNumber?: string;
  status: string;
  totalAmount?: number | null;
  hotel?: {
    name?: string;
  } | null;
  supplier?: {
    name?: string;
  } | null;
  issuedAt?: string | null;
  etaStatus?: string | null;
}

export interface ExplorerFactoring {
  id: string;
  status: string;
  amount?: number | null;
  advanceRate?: number | null;
  fee?: number | null;
  hotel?: {
    name?: string;
  } | null;
  supplier?: {
    name?: string;
  } | null;
  createdAt: string;
}

export interface ExplorerLead {
  id: string;
  companyName?: string;
  status: string;
  category?: string | null;
  source?: string | null;
  confidence?: number | null;
  discoveredAt?: string | null;
  enrichedAt?: string | null;
}

// ============================================================================
// ENTITY TYPE UNION
// ============================================================================

export type ExplorerEntity =
  | ExplorerUser
  | ExplorerSupplier
  | ExplorerHotel
  | ExplorerOrder
  | ExplorerProduct
  | ExplorerInvoice
  | ExplorerFactoring
  | ExplorerLead;
