/**
 * Premium Marketplace Components
 * 
 * Pinterest/Amazon-level premium marketplace components for Egyptian hospitality suppliers.
 * Uses real data from egyptian-market-real.json with OLED black (#000000) backgrounds,
 * electric indigo (#6366f1) accents, and glassmorphism effects.
 * 
 * @example
 * import { PremiumMarketplaceClient, HeroMarketplace, MasonryProductGrid } from "./premium-index";
 * 
 * // Full marketplace page
 * <PremiumMarketplaceClient marketData={marketData} />
 * 
 * // Individual components
 * <HeroMarketplace marketData={marketData} onSearch={handleSearch} />
 * <MasonryProductGrid 
 *   products={products} 
 *   suppliers={suppliers} 
 *   filters={filters}
 * />
 */

// Main client wrapper
export { PremiumMarketplaceClient } from "./premium-marketplace-client";

// Individual components
export { HeroMarketplace } from "./hero-marketplace";
export { PremiumProductCard } from "./premium-product-card";
export { MasonryProductGrid } from "./masonry-product-grid";
export { FilterPanel } from "./filter-panel";
export { SupplierBadge, CompactSupplierBadge } from "./supplier-badge";

// Types and utilities
export type {
  Supplier,
  Hotel,
  Product,
  ProductWithSupplier,
  ProductCategory,
  CategoryFilter,
  FilterState,
  EgyptianMarketData,
  PaymobConfig,
  PaymobPaymentMethod,
  StockStatus,
  StockIndicator,
} from "./premium-types";

export {
  CATEGORY_DISPLAY_NAMES,
  CATEGORY_ICONS,
  PAYMENT_PROVIDER_LOGOS,
  getStockStatus,
  formatEGP,
} from "./premium-types";

// Component prop types (for TypeScript users)
export type { PremiumMarketplaceClientProps } from "./premium-marketplace-client";
export type { HeroMarketplaceProps } from "./hero-marketplace";
export type { MasonryProductGridProps } from "./masonry-product-grid";
export type { FilterPanelProps } from "./filter-panel";
export type { SupplierBadgeProps, CompactSupplierBadgeProps } from "./supplier-badge";
