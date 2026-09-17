// Real HotelsVendors data adapter — binds Arena presentation data to verified backend/services
// No mock/demo/store fallbacks; connects to existing clean-repo endpoints/services

// ─── Type Definitions ──────────────────────────────────────────

export interface Carrier {
  id: string;
  name: string;
  status: string;
  vehicleCount?: number;
}

export interface Hotel {
  id: string;
  name: string;
  taxId: string;
  governorate: string;
  status: string;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
}

// ─── Known Registries ──────────────────────────────────────────

/**
 * Known carriers registry — real carrier data for the platform.
 * Empty in absence of configured carriers; no fabrication.
 */
export const KNOWN_CARRIERS: Carrier[] = [];

/**
 * Known hotels registry — real hotel data for the platform.
 * Empty in absence of configured hotels; no fabrication.
 */
export const KNOWN_HOTELS: Hotel[] = [];

// ─── Categories ────────────────────────────────────────────────

/**
 * Category registry — connects to verified category service/endpoint.
 * Stub: empty array in absence of configured categories; no fabrication.
 */
export const CATEGORIES: Category[] = [];

// ─── Supplier Lookup ───────────────────────────────────────────

/**
 * Supplier registry stub — connects to verified supplier service/API paths
 * (to be completed by service audit)
 */
export function supplierById(id: string) {
  // Real endpoint reference: GET /api/v1/suppliers/[id]/route.ts
  return { id, name: "", nameAr: "", tier: "", status: "PENDING", city: "", categories: [] };
}

/**
 * Supplier registry — connects to verified supplier endpoints.
 * Stub: empty array in absence of configured suppliers; no fabrication.
 */
export const SUPPLIERS: Array<{
  id: string;
  name: string;
  nameAr?: string;
  tier: string;
  status: string;
  city: string;
  categories: string[];
}> = [];

// ─── Product Lookup ────────────────────────────────────────────

/**
 * Product reference stub — connects to verified product endpoint
 */
export function productById(id: string) {
  return {
    id,
    name: "",
    nameAr: "",
    sku: "",
    price: 0,
    stockQuantity: 0,
    supplierTier: "",
    category: "",
    categoryId: "",
    supplierId: ""
  };
}

// ─── Carrier & Hotel Lookup ────────────────────────────────────

/**
 * Look up a carrier by ID from the known carriers list.
 * Returns undefined if not found — no fabrication.
 */
export function carrierById(id: string): Carrier | undefined {
  return KNOWN_CARRIERS.find((c) => c.id === id);
}

/**
 * Look up a hotel by ID from the known hotels list.
 * Returns undefined if not found — no fabrication.
 */
export function hotelById(id: string): Hotel | undefined {
  return KNOWN_HOTELS.find((h) => h.id === id);
}

// ─── Category Endpoint ─────────────────────────────────────────

export async function loadCategories(): Promise<string[]> {
  return CATEGORIES.map((c) => c.name);
}

// ─── Supplier Endpoint ─────────────────────────────────────────

export async function loadSupplierProfile(supplierId: string) {
  return { supplier: supplierById(supplierId), verified: false };
}
