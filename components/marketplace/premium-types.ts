/**
 * Premium Marketplace Types
 * Types for Egyptian hospitality supplier marketplace components
 */

export interface Supplier {
  id: string;
  name: string;
  city: string;
  governorate: string;
  category: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  industrial_zone: string;
  tax_id: string;
  monthly_capacity_egp: number;
  years_established: number;
  verified: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  city: string;
  governorate: string;
  tier: 'luxury' | 'upscale' | 'midscale' | 'budget';
  rooms: number;
  chain: string;
  monthly_gmv_egp: number;
  logo_url: string;
  website: string;
  brand_color: string;
}

export interface Product {
  sku: string;
  name: string;
  category: ProductCategory;
  unit: string;
  base_price_egp: number;
  supplier_id: string;
}

export type ProductCategory = 
  | 'amenities' 
  | 'linens_textiles' 
  | 'kitchen_equipment' 
  | 'cleaning_supplies' 
  | 'multi_category';

export interface ProductWithSupplier extends Product {
  supplier_name: string;
  supplier_city: string;
  supplier_verified: boolean;
}

export interface PaymobPaymentMethod {
  method: string;
  name: string;
  providers: string[];
  currencies: string[];
  fees_egp: string;
}

export interface PaymobConfig {
  region: string;
  api_base_url: string;
  flash_api_base_url: string;
  endpoints: Record<string, string>;
  credentials: {
    api_key_format: string;
    secret_key_format: string;
    hmac_secret_required: boolean;
    hmac_calculation: string;
  };
  payment_methods: PaymobPaymentMethod[];
  webhooks: {
    events: string[];
    callbacks: Record<string, unknown>;
    signature_header: string;
    signature_verification: string;
  };
  important_notes: string[];
  contact: {
    developer_docs: string;
    egypt_hub: string;
    support_email: string;
    egypt_hotline: string;
    dashboard: string;
  };
}

export interface EgyptianMarketData {
  _meta: {
    version: string;
    generated: string;
    region: string;
    data_quality: string;
    total_suppliers: number;
    total_products: number;
    total_hotels: number;
    sources: string[];
  };
  suppliers: Supplier[];
  hotels: Hotel[];
  product_catalog: Product[];
  paymob_config: PaymobConfig;
  analytics: {
    suppliers_by_category: Record<string, number>;
    hotels_by_tier: Record<string, number>;
    payment_methods_supported: number;
    total_governorates_covered: number;
  };
}

export type CategoryFilter = ProductCategory | 'all';

export interface FilterState {
  category: CategoryFilter;
  priceRange: [number, number];
  selectedSuppliers: string[];
  searchQuery: string;
}

// Category display names mapping
export const CATEGORY_DISPLAY_NAMES: Record<ProductCategory | 'all', string> = {
  all: 'All Categories',
  amenities: 'Guest Amenities',
  linens_textiles: 'Linens & Textiles',
  kitchen_equipment: 'Kitchen Equipment',
  cleaning_supplies: 'Cleaning Supplies',
  multi_category: 'Multi-Category'
};

// Category icons (using Lucide icon names)
export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  amenities: 'Sparkles',
  linens_textiles: 'BedDouble',
  kitchen_equipment: 'ChefHat',
  cleaning_supplies: 'Sparkles',
  multi_category: 'Package'
};

// Payment provider logos (SVG paths or URLs)
export const PAYMENT_PROVIDER_LOGOS = {
  visa: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png',
  mastercard: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png',
  vodafoneCash: 'https://www.vodafone.com.eg/content/dam/vodafone-marketing/static/Home%20page/Vodafone%20Cash%20-%20Logo%20-%20Orange%20-%20On%20S&W.png',
  etisalatCash: 'https://www.etisalat.eg/images/newdesignImages/LogoHomePage.png',
  orangeMoney: 'https://www.orange.eg/en/footer/PublishingImages/orange-logo.jpg',
  instaPay: 'https://instapay.eg/assets/images/instapay-logo.png',
  fawry: 'https://fawry.com/wp-content/uploads/2023/06/Fawry-Logo.png'
};

// Stock indicator types
export type StockStatus = 'available' | 'limited' | 'out_of_stock' | 'contact_supplier';

export interface StockIndicator {
  status: StockStatus;
  label: string;
  color: string;
}

// Helper function to determine stock status based on price
export const getStockStatus = (price: number): StockIndicator => {
  if (price > 50000) {
    return { status: 'contact_supplier', label: 'Contact Supplier', color: 'bg-amber-500' };
  } else if (price > 10000) {
    return { status: 'limited', label: 'Limited Stock', color: 'bg-amber-500' };
  } else {
    return { status: 'available', label: 'Available', color: 'bg-emerald-500' };
  }
};

// Format EGP price with commas
export const formatEGP = (price: number): string => {
  return price.toLocaleString('en-EG');
};
