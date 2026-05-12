"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, SlidersHorizontal, X, ShoppingCart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HOTEL_CATEGORIES } from "@/lib/marketplace/categories";
import { CartProvider, useCart } from "@/components/cart/cart-context";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { ProductCardV2 } from "@/components/marketplace-v2/product-card-v2";
import { ProductGrid } from "@/components/marketplace-v2/product-grid";
import { CategoryNavV2 } from "@/components/marketplace-v2/category-nav-v2";
import { MarketplaceBannerV2 } from "@/components/marketplace-v2/marketplace-banner-v2";
import { EmptyState } from "@/components/marketplace-v2/empty-state";
import catalogData from "@/data/catalog-products.json";

const ALL_PRODUCTS: any[] = (catalogData as { products: any[] }).products;

const COUNTS = ALL_PRODUCTS.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

function MarketplaceV2Inner() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"relevance" | "price-low" | "price-high" | "name">("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const { addItem, openCart, totalItems } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...ALL_PRODUCTS];

    // Category filter
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.supplierName?.toLowerCase().includes(q) ||
          p.subcategory?.toLowerCase().includes(q)
      );
    }

    // Price filter
    result = result.filter((p) => p.unitPrice >= priceRange[0] && p.unitPrice <= priceRange[1]);

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.unitPrice - b.unitPrice);
        break;
      case "price-high":
        result.sort((a, b) => b.unitPrice - a.unitPrice);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // relevance = default order
        break;
    }

    return result;
  }, [activeCategory, searchQuery, sortBy, priceRange]);

  const handleAddToCart = useCallback(
    (id: string, qty: number) => {
      const product = ALL_PRODUCTS.find((p) => p.id === id);
      if (!product) return;

      setAddingId(id);
      addItem(
        {
          productId: product.id,
          name: product.name,
          sku: product.sku,
          unitPrice: product.unitPrice,
          supplierId: product.supplierId || "unknown",
          supplierName: product.supplierName || "Unknown Supplier",
          image: product.images?.[0],
        },
        qty
      );
      setTimeout(() => setAddingId(null), 800);
    },
    [addItem]
  );

  const clearFilters = useCallback(() => {
    setActiveCategory("all");
    setSearchQuery("");
    setSortBy("relevance");
    setPriceRange([0, 100000]);
  }, []);

  const maxPrice = useMemo(() => {
    return Math.ceil(Math.max(...ALL_PRODUCTS.map((p) => p.unitPrice), 1000) / 100) * 100;
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      <MarketingNav />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Banner */}
        <MarketplaceBannerV2 />

        {/* Search & Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, suppliers, SKUs..."
              className="w-full h-11 pl-10 pr-10 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#8B0000]/40 focus:ring-2 focus:ring-[#8B0000]/10 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort & Filter buttons */}
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 outline-none focus:border-[#8B0000]/40"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A-Z</option>
            </select>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`h-11 px-3 rounded-xl border text-sm font-medium flex items-center gap-2 transition-colors ${
                showFilters
                  ? "border-[#8B0000] bg-[#8B0000]/10 text-[#8B0000]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-[#8B0000]/30"
              }`}
            >
              <SlidersHorizontal size={14} />
              <span className="hidden sm:inline">Filters</span>
            </button>
            {/* Cart button */}
            <button
              onClick={openCart}
              className="h-11 px-3 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-[#8B0000]/30 relative"
            >
              <ShoppingCart size={16} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#8B0000] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Price filter panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="flex-1">
                  <label className="text-xs font-medium text-gray-500 mb-2 block">
                    Price Range: EGP {priceRange[0]} — EGP {priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={maxPrice}
                    step={100}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-[#8B0000]"
                  />
                </div>
                <button
                  onClick={() => setPriceRange([0, maxPrice])}
                  className="text-xs text-[#8B0000] hover:underline"
                >
                  Reset
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Nav */}
        <CategoryNavV2 activeCategory={activeCategory} onSelect={setActiveCategory} counts={COUNTS} />

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            <span className="font-semibold text-gray-900">{filteredProducts.length}</span> product
            {filteredProducts.length !== 1 ? "s" : ""}
            {(activeCategory !== "all" || searchQuery) && (
              <button onClick={clearFilters} className="ml-2 text-[#8B0000] hover:underline text-xs">
                Clear all
              </button>
            )}
          </p>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <ProductGrid>
            {filteredProducts.map((product) => (
              <ProductCardV2
                key={product.id}
                id={product.id}
                name={product.name}
                sku={product.sku}
                category={product.category}
                subcategory={product.subcategory}
                unitPrice={product.unitPrice}
                currency={product.currency}
                stockQuantity={product.stockQuantity}
                minOrderQty={product.minOrderQty}
                supplierName={product.supplierName}
                supplierTier={product.supplierTier}
                supplierRating={product.supplierRating}
                supplierReviewCount={product.supplierReviewCount}
                supplierCity={product.supplierCity}
                supplierBadges={product.supplierBadges || []}
                unitOfMeasure={product.unitOfMeasure}
                temperatureReq={product.temperatureReq}
                shelfLifeDays={product.shelfLifeDays}
                leadTimeDays={product.leadTimeDays}
                volumeTiers={product.volumeTiers}
                onAddToCart={handleAddToCart}
              />
            ))}
          </ProductGrid>
        ) : (
          <EmptyState searchTerm={searchQuery} onClear={clearFilters} />
        )}
      </div>

      <MarketingFooter />
    </main>
  );
}

export default function MarketplaceV2Page() {
  return (
    <CartProvider>
      <MarketplaceV2Inner />
    </CartProvider>
  );
}
