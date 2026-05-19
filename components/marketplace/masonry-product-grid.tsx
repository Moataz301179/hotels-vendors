"use client";

import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { PremiumProductCard } from "./premium-product-card";
import {
  Product,
  Supplier,
  CategoryFilter,
  FilterState,
  CATEGORY_DISPLAY_NAMES,
} from "./premium-types";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Sparkles,
  BedDouble,
  ChefHat,
  Package,
} from "lucide-react";

interface MasonryProductGridProps {
  products: Product[];
  suppliers: Supplier[];
  filters: FilterState;
  onQuickView?: (product: Product) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  itemsPerPage?: number;
}

// Map icon names to actual Lucide components
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  all: LayoutGrid,
  amenities: Sparkles,
  linens_textiles: BedDouble,
  kitchen_equipment: ChefHat,
  cleaning_supplies: Sparkles,
  multi_category: Package,
};

export function MasonryProductGrid({
  products,
  suppliers,
  filters,
  onQuickView,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  itemsPerPage = 12,
}: MasonryProductGridProps) {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>(
    filters.category || "all"
  );
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, { once: false, margin: "100px" });

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      if (selectedCategory !== "all" && product.category !== selectedCategory) {
        return false;
      }
      if (
        product.base_price_egp < filters.priceRange[0] || 
        product.base_price_egp > filters.priceRange[1]
      ) {
        return false;
      }
      if (
        filters.selectedSuppliers.length > 0 &&
        !filters.selectedSuppliers.includes(product.supplier_id)
      ) {
        return false;
      }
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const supplier = suppliers.find((s) => s.id === product.supplier_id);
        return (
          product.name.toLowerCase().includes(query) ||
          (supplier?.name.toLowerCase() || "").includes(query)
        );
      }
      return true;
    });
  }, [products, selectedCategory, filters, suppliers]);

  const visibleProducts = useMemo(() => {
    return filteredProducts.slice(0, visibleCount);
  }, [filteredProducts, visibleCount]);

  // Infinite scroll
  useEffect(() => {
    if (isInView && hasMore && !isLoading && visibleCount < filteredProducts.length) {
      const timer = setTimeout(() => {
        setVisibleCount((prev) => Math.min(prev + itemsPerPage, filteredProducts.length));
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isInView, hasMore, isLoading, visibleCount, filteredProducts.length, itemsPerPage]);

  // Calculate columns based on screen width
  const [numColumns, setNumColumns] = useState(4);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setNumColumns(1);
      else if (width < 768) setNumColumns(2);
      else if (width < 1024) setNumColumns(3);
      else setNumColumns(4);
    };
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // Distribute products into columns
  const columns = useMemo(() => {
    const cols: Product[][] = Array.from({ length: numColumns }, () => []);
    const heights = new Array(numColumns).fill(0);

    visibleProducts.forEach((product, index) => {
      const shortestIndex = heights.indexOf(Math.min(...heights));
      cols[shortestIndex].push({ ...product, _index: index } as Product & { _index: number });
      const height = 350 + (product.name.length > 30 ? 40 : 0);
      heights[shortestIndex] += height + 16;
    });

    return cols;
  }, [visibleProducts, numColumns]);

  // Get unique categories
  const availableCategories = useMemo(() => {
    const categories = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(categories)] as CategoryFilter[];
  }, [products]);

  if (filteredProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-24 h-24 rounded-full bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-6">
          <RefreshCcw className="w-10 h-10 text-zinc-600" />
        </div>
        <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
        <p className="text-zinc-500 max-w-md">
          Try adjusting your filters or search criteria to find what you&apos;re looking for.
        </p>
        <Button
          variant="outline"
          className="mt-6 border-zinc-700 hover:bg-zinc-800 text-white"
          onClick={() => setSelectedCategory("all")}
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
        {availableCategories.map((category, i) => {
          const isActive = selectedCategory === category;
          const Icon = CATEGORY_ICONS[category] || Package;
          const count = category === "all" 
            ? products.length 
            : products.filter((p) => p.category === category).length;

          return (
            <motion.button
              key={category}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setSelectedCategory(category)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-300
                ${isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25"
                  : "bg-zinc-900/80 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                }
              `}
            >
              <Icon className="w-4 h-4" />
              <span>{CATEGORY_DISPLAY_NAMES[category]}</span>
              <span className="text-xs opacity-60">({count})</span>
            </motion.button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>Showing {visibleProducts.length} of {filteredProducts.length} products</span>
      </div>

      {/* Masonry Grid */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${numColumns}, minmax(0, 1fr))` }}
      >
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex flex-col gap-4">
            {column.map((product) => (
              <PremiumProductCard
                key={product.sku}
                product={product}
                supplier={suppliers.find((s) => s.id === product.supplier_id)}
                onQuickView={() => onQuickView?.(product)}
                index={(product as any)._index}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Load More */}
      {visibleCount < filteredProducts.length && (
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          <div className="flex items-center gap-3 text-zinc-500">
            <div className="w-5 h-5 border-2 border-zinc-700 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm">Loading more products...</span>
          </div>
        </div>
      )}

      {visibleCount >= filteredProducts.length && filteredProducts.length > itemsPerPage && (
        <div className="py-8 text-center">
          <span className="text-zinc-600 text-sm">
            You&apos;ve seen all {filteredProducts.length} products
          </span>
        </div>
      )}
    </div>
  );
}
