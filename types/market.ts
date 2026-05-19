/**
 * Egyptian Market Data Types
 * Type definitions for data/egyptian-market-v2.json
 */

// ============================================================================
// RAW JSON STRUCTURES (as they appear in the file)
// ============================================================================

export interface RawSupplierData {
  id: string;
  name: string;
  city: string;
  governorate: string;
  category: string;
  industrial_zone: string;
  tax_id: string;
  monthly_capacity_egp: number;
}

export interface RawProductData {
  sku: string;
  name: string;
  category: string;
  unit: string;
  base_price_egp: number;
  supplier_id: string;
}

export interface RawHotelData {
  id: string;
  name: string;
  city: string;
  governorate: string;
  tier: string;
  rooms: number;
  chain: string;
  monthly_gmv_egp: number;
}

export interface MarketDataV2 {
  version: string;
  generated_at: string;
  suppliers: RawSupplierData[];
  hotels: RawHotelData[];
  product_catalog: RawProductData[];
  documents?: Array<{
    name: string;
    provider: string;
    purpose: string;
    fields: unknown[];
  }>;
  analytics?: {
    total_suppliers: number;
    total_hotels: number;
    total_products: number;
    coverage_by_category?: Record<string, number>;
  };
}

// ============================================================================
// TRANSFORMED DOMAIN TYPES (camelCase)
// ============================================================================

export interface MarketSupplier {
  id: string;
  name: string;
  city: string;
  governorate: string;
  category: string;
  industrialZone: string;
  taxId: string;
  monthlyCapacityEgp: number;
}

export interface MarketHotel {
  id: string;
  name: string;
  city: string;
  governorate: string;
  tier: string;
  rooms: number;
  chain: string;
  monthlyGmvEgp: number;
}

export interface MarketProduct {
  sku: string;
  name: string;
  category: string;
  unit: string;
  basePriceEgp: number;
  supplierId: string;
}

// ============================================================================
// CATEGORY & MAPPING TYPES
// ============================================================================

export type CategorySlug = 
  | 'poultry' | 'dairy' | 'beverages' | 'seafood' | 'meat' 
  | 'fresh_produce' | 'oils' | 'spices' | 'linens' | 'paper_products'
  | 'hospitality_equipment' | 'ceramics' | 'glassware' | 'furniture'
  | 'carpets' | 'amenities' | 'handicrafts' | 'dates' | 'bakery'
  | 'canned_goods' | 'cleaning' | 'uniforms' | 'packaging' 
  | 'pharmaceuticals' | 'confectionery' | 'cold_storage' | 'logistics'
  | 'building_materials' | 'electronics' | 'chemicals' | 'energy'
  | 'sugar' | 'grains' | 'textiles' | 'plastics' | 'metals'
  | 'processed_food' | 'organic_produce' | 'water';

export type TierLevel = '5_star' | '4_star' | '3_star' | 'boutique' | 'resort';

export interface CategoryInfo {
  slug: CategorySlug;
  label: string;
  color: string;
  icon?: string;
}
