"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Package,
  Star,
  MapPin,
  ArrowRight,
  Grid3X3,
  LayoutList,
  ArrowUpDown,
  X,
  ChevronDown,
} from "lucide-react";
import { HOTEL_CATEGORIES, getCategoryById } from "@/lib/marketplace/categories";
import catalogData from "@/data/catalog-products.json";
import { GlobalHeader } from "@/components/layout/global-header";

const ALL_PRODUCTS: any[] = (catalogData as { products: any[] }).products;

const COUNTS = ALL_PRODUCTS.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

export default function PublicCatalogPage() {
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [showLoginPrompt, setShowLoginPrompt] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = [...ALL_PRODUCTS];
    if (activeCategory) list = list.filter((p) => p.category === activeCategory);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.supplierName.toLowerCase().includes(q)
      );
    }
    if (sortBy === "price_low") list.sort((a, b) => a.unitPrice - b.unitPrice);
    else if (sortBy === "price_high") list.sort((a, b) => b.unitPrice - a.unitPrice);
    else if (sortBy === "rating") list.sort((a, b) => b.supplierRating - a.supplierRating);
    else if (sortBy === "lead") list.sort((a, b) => a.leadTimeDays - b.leadTimeDays);
    return list;
  }, [activeCategory, search, sortBy]);

  const handleAdd = (id: string) => {
    setShowLoginPrompt(id);
    setTimeout(() => setShowLoginPrompt(null), 2000);
  };

  const formatPrice = (p: number, c: string) =>
    new Intl.NumberFormat("en-EG", { style: "currency", currency: c, minimumFractionDigits: 0 }).format(p);

  return (
    <div className="min-h-screen bg-black text-white">
      <GlobalHeader />

      {/* Hero — Solid Black */}
      <div className="relative overflow-hidden border-b border-white/[0.06] bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(185,28,28,0.08),_transparent_60%)]" />
        <div className="relative max-w-[1600px] mx-auto px-6 py-14">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#b91c1c]/10 border border-[#b91c1c]/20 mb-4">
              <Package className="w-3.5 h-3.5 text-[#b91c1c]" />
              <span className="text-xs font-medium text-[#b91c1c]">Public Marketplace — Browse without signing in</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 text-white">
              {activeCategory ? `${getCategoryById(activeCategory)?.label || activeCategory}` : "One-Stop Hotel Procurement"}
            </h1>
            <p className="text-white/40 text-base mb-8 max-w-lg">
              {activeCategory
                ? `${COUNTS[activeCategory] || 0} verified products from Egyptian suppliers. Sign in to order.`
                : `${ALL_PRODUCTS.length}+ verified products from 57 Egyptian suppliers across 10 hotel procurement categories.`}
            </p>
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, suppliers, SKUs..."
                className="w-full pl-12 pr-10 py-3.5 rounded-xl border border-white/[0.08] bg-white/[0.04] text-sm text-white placeholder:text-white/25 outline-none focus:border-[#b91c1c]/50 focus:ring-1 focus:ring-[#b91c1c]/20 transition-all"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Category Nav */}
      <div className="border-b border-white/[0.06] bg-[#0a0a0a]/80 backdrop-blur-sm sticky top-16 z-40">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                !activeCategory
                  ? "bg-[#b91c1c] text-white shadow-[0_0_16px_rgba(185,28,28,0.25)]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              All Products
            </button>
            {HOTEL_CATEGORIES.map((cat) => {
              const count = COUNTS[cat.id] || 0;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? "" : cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[#b91c1c] text-white shadow-[0_0_16px_rgba(185,28,28,0.25)]"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{cat.label}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white/80" : "bg-white/[0.06] text-white/30"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-white/[0.06] bg-black">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-white/40">{filtered.length} products found</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-white/30" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-sm text-white/60 outline-none cursor-pointer"
              >
                <option value="relevance" className="bg-[#0a0a0a]">Relevance</option>
                <option value="price_low" className="bg-[#0a0a0a]">Price: Low → High</option>
                <option value="price_high" className="bg-[#0a0a0a]">Price: High → Low</option>
                <option value="rating" className="bg-[#0a0a0a]">Top Rated</option>
                <option value="lead" className="bg-[#0a0a0a]">Fastest Delivery</option>
              </select>
            </div>
            <div className="flex rounded-lg border border-white/[0.08] overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#b91c1c] text-white" : "text-white/40 hover:text-white/70"}`}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button onClick={() => setViewMode("list")} className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#b91c1c] text-white" : "text-white/40 hover:text-white/70"}`}>
                <LayoutList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/30">
            <Package className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No products found</p>
            <button
              onClick={() => { setActiveCategory(""); setSearch(""); }}
              className="mt-4 px-5 py-2.5 rounded-lg bg-[#b91c1c] hover:bg-[#991b1b] text-white text-sm font-medium transition-colors"
            >
              View All Products
            </button>
          </div>
        ) : (
          <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: i * 0.03 }}
                className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-[#111] overflow-hidden hover:border-[#b91c1c]/30 hover:shadow-[0_8px_32px_rgba(185,28,28,0.08)] transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0d] overflow-hidden">
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <Package className="w-10 h-10 text-white/[0.08] group-hover:text-white/[0.15] transition-colors" />
                    <span className="text-[10px] text-white/15 mt-2 font-mono tracking-wider">{product.sku}</span>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        product.stockQuantity === 0
                          ? "text-red-400 bg-red-500/10 border-red-500/20"
                          : product.stockQuantity < 20
                          ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                          : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                      }`}
                    >
                      {product.stockQuantity === 0 ? "Out of Stock" : product.stockQuantity < 20 ? "Low Stock" : "In Stock"}
                    </span>
                    {product.supplierTier === "PREMIER" && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#b91c1c]/15 text-[#ef4444] border border-[#b91c1c]/25">
                        Premier
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-3 p-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-[#b91c1c] font-bold">
                      {getCategoryById(product.category)?.code || product.category}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/15" />
                    <span className="text-[10px] uppercase tracking-wider text-white/30">{product.unitOfMeasure}</span>
                  </div>

                  <h3 className="text-[15px] font-semibold text-white/95 leading-snug line-clamp-2 min-h-[2.6rem] group-hover:text-white transition-colors">
                    {product.name}
                  </h3>

                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-semibold text-white/80">{product.supplierRating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-white/25">({product.supplierReviewCount})</span>
                    <span className="w-1 h-1 rounded-full bg-white/15" />
                    <MapPin className="w-3 h-3 text-white/25" />
                    <span className="text-[10px] text-white/35">{product.supplierCity}</span>
                  </div>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xl font-bold text-white tracking-tight">
                      {formatPrice(product.unitPrice, product.currency)}
                    </span>
                    <span className="text-xs text-white/30">/ {product.unitOfMeasure}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-white/25">
                    <span>MOQ: {product.minOrderQty}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span>{product.leadTimeDays} day delivery</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={`/catalog/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] text-sm font-medium text-white/70 hover:text-white hover:border-[#b91c1c]/40 hover:bg-[#b91c1c]/5 transition-all"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => handleAdd(product.id)}
                      className="flex items-center justify-center px-3 py-2.5 rounded-xl bg-[#b91c1c] hover:bg-[#991b1b] text-white transition-all active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>

                  {showLoginPrompt === product.id && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-[#ef4444] text-center"
                    >
                      Please <Link href="/login" className="underline font-medium">sign in</Link> to order
                    </motion.p>
                  )}

                  <p className="text-[10px] text-white/20 truncate pt-0.5">
                    by <span className="text-white/40">{product.supplierName}</span>
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
