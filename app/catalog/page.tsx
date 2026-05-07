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
  SlidersHorizontal,
  Grid3X3,
  LayoutList,
  ArrowUpDown,
  Filter,
  X,
} from "lucide-react";
import { HOTEL_CATEGORIES, getCategoryById } from "@/lib/marketplace/categories";
import catalogData from "@/data/catalog-products.json";

const ICON_MAP: Record<string, React.ElementType> = {
  UtensilsCrossed: Package,
  Sparkles: Package,
  Bath: Package,
  Wrench: Package,
  Sofa: Package,
  Briefcase: Package,
  Shirt: Package,
  Droplets: Package,
  Monitor: Package,
  Shield: Package,
};

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  unitPrice: number;
  currency: string;
  stockQuantity: number;
  minOrderQty: number;
  unitOfMeasure: string;
  leadTimeDays: number;
  supplierName: string;
  supplierTier: string;
  supplierRating: number;
  supplierReviewCount: number;
  supplierCity: string;
}

const ALL_PRODUCTS: Product[] = (catalogData as { products: Product[] }).products;

const COUNTS = ALL_PRODUCTS.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

export default function PublicCatalogPage() {
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [cart, setCart] = useState<Record<string, number>>({});
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#800000]/15 border border-[#800000]/25 flex items-center justify-center">
              <Image src="/logo-horse-only.png" alt="" width={24} height={24} className="opacity-90" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Hotels Vendors</h1>
              <p className="text-[9px] text-white/30 uppercase tracking-wider">Procurement Hub</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 rounded-lg bg-[#800000] hover:bg-[#990000] text-white text-sm font-medium transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-gradient-to-r from-[#800000]/10 via-transparent to-[#800000]/5" />
        <div className="relative max-w-[1600px] mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-5 h-5 text-[#ff4d4d]" />
              <span className="text-xs font-medium text-[#ff4d4d] uppercase tracking-wider">Public Marketplace</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">
              {activeCategory ? `${getCategoryById(activeCategory)?.label || activeCategory} Products` : "One-Stop Hotel Procurement"}
            </h1>
            <p className="text-white/50 text-sm mb-6">
              Browse {ALL_PRODUCTS.length}+ verified products from 57 Egyptian suppliers. Sign in to order.
            </p>
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, suppliers, SKUs..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-sm text-white placeholder:text-white/30 outline-none focus:border-[#800000]/50 focus:shadow-[0_0_20px_rgba(128,0,0,0.15)] transition-all"
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
      <div className="border-b border-white/[0.06] bg-[#0a0a0a]/50">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            <button
              onClick={() => setActiveCategory("")}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                !activeCategory ? "bg-[#800000] text-white" : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
              }`}
            >
              All
            </button>
            {HOTEL_CATEGORIES.map((cat) => {
              const count = COUNTS[cat.id] || 0;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(isActive ? "" : cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                    isActive ? "bg-[#800000] text-white" : "text-white/50 hover:text-white/80 hover:bg-white/[0.04]"
                  }`}
                >
                  <span>{cat.label}</span>
                  {count > 0 && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.08] text-white/40">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
          <span className="text-sm text-white/40">{filtered.length} products</span>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-white/30" />
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm text-white/60 outline-none cursor-pointer">
                <option value="relevance" className="bg-[#0a0a0a]">Relevance</option>
                <option value="price_low" className="bg-[#0a0a0a]">Price: Low → High</option>
                <option value="price_high" className="bg-[#0a0a0a]">Price: High → Low</option>
                <option value="rating" className="bg-[#0a0a0a]">Top Rated</option>
                <option value="lead" className="bg-[#0a0a0a]">Fastest Delivery</option>
              </select>
            </div>
            <div className="flex rounded-lg border border-white/[0.08] overflow-hidden">
              <button onClick={() => setViewMode("grid")} className={`p-2 ${viewMode === "grid" ? "bg-[#800000] text-white" : "text-white/40"}`}><Grid3X3 className="w-4 h-4" /></button>
              <button onClick={() => setViewMode("list")} className={`p-2 ${viewMode === "list" ? "bg-[#800000] text-white" : "text-white/40"}`}><LayoutList className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-white/30">
            <SlidersHorizontal className="w-12 h-12 mb-4" />
            <p className="text-lg font-medium">No products found</p>
            <button onClick={() => { setActiveCategory(""); setSearch(""); }} className="mt-4 px-4 py-2 rounded-lg bg-[#800000] text-white text-sm">View All</button>
          </div>
        ) : (
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.02 }}
                className="group relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#800000]/40 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] bg-black overflow-hidden">
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#800000]/10 to-transparent">
                    <Package className="w-12 h-12 text-white/10" />
                    <span className="text-[10px] text-white/20 mt-2 font-mono">{product.sku}</span>
                  </div>
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                      product.stockQuantity === 0 ? "text-red-400 bg-red-500/10 border-red-500/20" :
                      product.stockQuantity < 20 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" :
                      "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                    }`}>
                      {product.stockQuantity === 0 ? "Out of Stock" : product.stockQuantity < 20 ? "Low Stock" : "In Stock"}
                    </span>
                    {product.supplierTier === "PREMIER" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#800000]/20 text-[#ff4d4d] border border-[#800000]/30">Premier</span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 p-4">
                  <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-wider">
                    <span>{getCategoryById(product.category)?.label || product.category}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span>{product.unitOfMeasure}</span>
                  </div>
                  <h3 className="text-sm font-medium text-white/90 leading-snug line-clamp-2 min-h-[2.5rem]">{product.name}</h3>
                  <div className="flex items-center gap-2">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-medium">{product.supplierRating.toFixed(1)}</span>
                    <span className="text-[10px] text-white/30">({product.supplierReviewCount})</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <MapPin className="w-3 h-3 text-white/30" />
                    <span className="text-[10px] text-white/40">{product.supplierCity}</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-lg font-bold">{formatPrice(product.unitPrice, product.currency)}</span>
                    <span className="text-xs text-white/40">/ {product.unitOfMeasure}</span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-white/30">
                    <span>Min: {product.minOrderQty}</span>
                    <span>Lead: {product.leadTimeDays}d</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Link
                      href={`/catalog/${product.id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] text-sm text-white/70 hover:text-white hover:border-white/[0.14] transition-colors"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleAdd(product.id)}
                      className="flex items-center justify-center px-3 py-2 rounded-lg bg-[#800000] hover:bg-[#990000] text-white transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                    </button>
                  </div>
                  {showLoginPrompt === product.id && (
                    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-[#ff4d4d] text-center">
                      Please <Link href="/login" className="underline">sign in</Link> to add to cart
                    </motion.div>
                  )}
                  <p className="text-[10px] text-white/30 truncate">Sold by <span className="text-white/50">{product.supplierName}</span></p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
