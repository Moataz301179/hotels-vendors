"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
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
  SlidersHorizontal,
  ChevronDown,
  Crown,
  Filter,
  Check,
} from "lucide-react";
import { HOTEL_CATEGORIES, getCategoryById } from "@/lib/marketplace/categories";
import { getProductImage, getCategoryImage } from "@/lib/marketplace/product-images";
import { MarketplaceBanner } from "./marketplace-banner";
import { SupplierShowcase } from "./supplier-showcase";
import catalogData from "@/data/catalog-products.json";
import { BrandLogo } from "@/components/layout/brand-logo";

const ALL_PRODUCTS: any[] = (catalogData as { products: any[] }).products;

const RED = "#8B0000";
const RED_DIM = "rgba(139,10,30,0.15)";
const RED_GLOW = "rgba(139,10,30,0.25)";
const GOLD = "#e1a95f";
const GOLD_DIM = "rgba(225,169,95,0.15)";

const COUNTS = ALL_PRODUCTS.reduce((acc, p) => {
  acc[p.category] = (acc[p.category] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

/* ═══════════════════════════════════════════
   PRODUCT IMAGE COMPONENT — URL or gradient fallback
   ═══════════════════════════════════════════ */

function ProductImage({ product }: { product: any }) {
  const resolved = getProductImage(product);

  if (resolved.type === "url") {
    return (
      <img
        src={resolved.src}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        loading="lazy"
      />
    );
  }

  // Gradient fallback with initials
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${resolved.colors[0]} 0%, ${resolved.colors[1]} 50%, ${resolved.colors[2]} 100%)`,
      }}
    >
      <div className="text-center">
        <span className="text-[32px] font-bold text-white/20 tracking-tight">
          {resolved.initials}
        </span>
        <p className="text-[10px] text-white/15 uppercase tracking-wider mt-1">
          {product.category.toUpperCase()}
        </p>
      </div>
    </div>
  );
}

const CAT_IMAGES: Record<string, string> = {
  fb: getCategoryImage("fb"),
  hk: getCategoryImage("hk"),
  lin: getCategoryImage("lin"),
  eng: getCategoryImage("eng"),
  gra: getCategoryImage("gra"),
  ffe: getCategoryImage("ffe"),
  ose: getCategoryImage("ose"),
  spa: getCategoryImage("spa"),
  it: getCategoryImage("it"),
  sec: getCategoryImage("sec"),
};

/* ═══════════════════════════════════════════
   FILTER CHIPS
   ═══════════════════════════════════════════ */

const FILTER_OPTIONS = [
  {
    label: "Brand",
    options: ["Al-Waha", "Delta Fresh", "CleanMax", "Cotton House", "Nile Fresh"],
  },
  {
    label: "Price",
    options: ["Under 100 EGP", "100-500 EGP", "500-1K EGP", "1K+ EGP"],
  },
  {
    label: "Rating",
    options: ["4.5+ Stars", "4.0+ Stars", "3.5+ Stars"],
  },
  {
    label: "Delivery",
    options: ["Same Day", "24 Hours", "48 Hours", "3-5 Days"],
  },
  {
    label: "Stock",
    options: ["In Stock", "Low Stock", "Pre-Order"],
  },
];

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("relevance");
  const [showLoginPrompt, setShowLoginPrompt] = useState<string | null>(null);
  const [memberMode, setMemberMode] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [expandedFilter, setExpandedFilter] = useState<string | null>(null);

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
    // Apply active filter chips
    if (activeFilters.includes("In Stock")) list = list.filter((p) => p.stockQuantity > 0);
    if (activeFilters.includes("Low Stock")) list = list.filter((p) => p.stockQuantity > 0 && p.stockQuantity < 20);
    if (activeFilters.includes("Pre-Order")) list = list.filter((p) => p.stockQuantity === 0);
    if (activeFilters.includes("Under 100 EGP")) list = list.filter((p) => p.unitPrice < 100);
    if (activeFilters.includes("100-500 EGP")) list = list.filter((p) => p.unitPrice >= 100 && p.unitPrice <= 500);
    if (activeFilters.includes("500-1K EGP")) list = list.filter((p) => p.unitPrice > 500 && p.unitPrice <= 1000);
    if (activeFilters.includes("1K+ EGP")) list = list.filter((p) => p.unitPrice > 1000);
    if (activeFilters.includes("4.5+ Stars")) list = list.filter((p) => p.supplierRating >= 4.5);
    if (activeFilters.includes("4.0+ Stars")) list = list.filter((p) => p.supplierRating >= 4.0);
    if (activeFilters.includes("3.5+ Stars")) list = list.filter((p) => p.supplierRating >= 3.5);
    if (activeFilters.includes("Same Day")) list = list.filter((p) => p.leadTimeDays <= 1);
    if (activeFilters.includes("24 Hours")) list = list.filter((p) => p.leadTimeDays <= 1);
    if (activeFilters.includes("48 Hours")) list = list.filter((p) => p.leadTimeDays <= 2);
    if (activeFilters.includes("3-5 Days")) list = list.filter((p) => p.leadTimeDays >= 3 && p.leadTimeDays <= 5);
    // Brand filters
    const brandFilters = ["Al-Waha", "Delta Fresh", "CleanMax", "Cotton House", "Nile Fresh"];
    const activeBrands = activeFilters.filter((f) => brandFilters.includes(f));
    if (activeBrands.length > 0) {
      list = list.filter((p) => activeBrands.some((b) => p.supplierName.includes(b)));
    }
    if (sortBy === "price_low") list.sort((a, b) => a.unitPrice - b.unitPrice);
    else if (sortBy === "price_high") list.sort((a, b) => b.unitPrice - a.unitPrice);
    else if (sortBy === "rating") list.sort((a, b) => b.supplierRating - a.supplierRating);
    else if (sortBy === "lead") list.sort((a, b) => a.leadTimeDays - b.leadTimeDays);
    return list;
  }, [activeCategory, search, sortBy, activeFilters]);

  const toggleFilter = (filter: string) => {
    setActiveFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  const handleAdd = (id: string) => {
    setShowLoginPrompt(id);
    setTimeout(() => setShowLoginPrompt(null), 2000);
  };

  const formatPrice = (p: number, c: string) =>
    new Intl.NumberFormat("en-EG", { style: "currency", currency: c, minimumFractionDigits: 0 }).format(p);

  const memberDiscount = (price: number) => Math.round(price * 0.92);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <BrandLogo variant="dark" size="sm" />
            <span className="text-[14px] font-semibold text-white tracking-tight hidden sm:block">
              Hotels Vendors
            </span>
          </Link>

          {/* Search */}
          <div className="flex-1 max-w-2xl">
            <div className="relative flex items-center">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search products, suppliers, SKUs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-sm text-white placeholder:text-white/25 outline-none focus:border-white/[0.12] transition-all surface-input"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Member Toggle */}
            <button
              onClick={() => setMemberMode(!memberMode)}
              className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl text-[12px] font-medium transition-all ${
                memberMode
                  ? "text-white"
                  : "text-white/40 hover:text-white/70 border border-white/[0.06]"
              }`}
              style={memberMode ? { background: RED_DIM, border: `1px solid ${RED_GLOW}` } : {}}
            >
              <Crown className="w-3.5 h-3.5" style={{ color: memberMode ? RED : "currentColor" }} />
              <span>Member Prices</span>
              {memberMode && <Check className="w-3 h-3" style={{ color: RED }} />}
            </button>

            <Link
              href="/login"
              className="text-[12px] text-white/50 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-[12px] font-medium text-white px-4 py-2 rounded-xl transition-all"
              style={{ background: RED }}
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="border-t border-white/[0.04] bg-white/[0.02]">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/[0.08] text-[12px] text-white/60 hover:text-white transition-colors shrink-0"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Categories
            </button>

            {FILTER_OPTIONS.map((group) => (
              <div key={group.label} className="relative shrink-0">
                <button
                  onClick={() => setExpandedFilter(expandedFilter === group.label ? null : group.label)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[12px] transition-colors ${
                    activeFilters.some((f) => group.options.includes(f))
                      ? "text-white border-white/[0.16] bg-white/[0.06]"
                      : "text-white/50 border-white/[0.06] hover:text-white/80 hover:border-white/[0.10]"
                  }`}
                >
                  {group.label}
                  <ChevronDown className={`w-3 h-3 transition-transform ${expandedFilter === group.label ? "rotate-180" : ""}`} />
                </button>

                {expandedFilter === group.label && (
                  <div className="absolute top-full left-0 mt-1 z-40 min-w-[160px] p-2 rounded-xl border border-white/[0.08] bg-[#121212] shadow-xl">
                    {group.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => toggleFilter(opt)}
                        className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[12px] transition-colors ${
                          activeFilters.includes(opt)
                            ? "text-white bg-white/[0.06]"
                            : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                        }`}
                      >
                        <div className={`w-3.5 h-3.5 rounded border ${activeFilters.includes(opt) ? "bg-white border-white" : "border-white/20"}`}>
                          {activeFilters.includes(opt) && <Check className="w-3 h-3 text-black" />}
                        </div>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {activeFilters.length > 0 && (
              <button
                onClick={() => setActiveFilters([])}
                className="px-3 py-1.5 rounded-lg text-[12px] text-white/40 hover:text-white/70 transition-colors shrink-0"
              >
                Clear ({activeFilters.length})
              </button>
            )}

            <div className="ml-auto flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1.5 text-[12px] text-white/30">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent text-white/50 outline-none cursor-pointer"
                >
                  <option value="relevance" className="bg-[#121212]">Relevance</option>
                  <option value="price_low" className="bg-[#121212]">Price: Low &rarr; High</option>
                  <option value="price_high" className="bg-[#121212]">Price: High &rarr; Low</option>
                  <option value="rating" className="bg-[#121212]">Top Rated</option>
                  <option value="lead" className="bg-[#121212]">Fastest Delivery</option>
                </select>
              </div>
              <div className="flex rounded-lg border border-white/[0.06] overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/60"}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-white/[0.08] text-white" : "text-white/30 hover:text-white/60"}`}
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <MarketplaceBanner />
        <div className="flex gap-6">
        {/* Left Sidebar — Categories */}
        <aside
          className={`${
            mobileSidebarOpen ? "fixed inset-y-0 left-0 z-40 w-64 bg-[#050505] border-r border-white/[0.06] p-4" : "hidden lg:block w-56 shrink-0"
          }`}
        >
          {mobileSidebarOpen && (
            <div className="flex items-center justify-between mb-4 lg:hidden">
              <span className="text-sm font-semibold text-white">Categories</span>
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1 text-white/40 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <div className="space-y-1">
            <button
              onClick={() => { setActiveCategory(""); setMobileSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                !activeCategory
                  ? "text-white bg-white/[0.06] border border-white/[0.08]"
                  : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
              }`}
            >
              <Package className="w-4 h-4" />
              All Categories
              <span className="ml-auto text-[10px] text-white/25">{ALL_PRODUCTS.length}</span>
            </button>

            {HOTEL_CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(isActive ? "" : cat.id); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] transition-all ${
                    isActive
                      ? "text-white bg-white/[0.06] border border-white/[0.08]"
                      : "text-white/50 hover:text-white/80 hover:bg-white/[0.03]"
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/[0.06]">
                    <img src={CAT_IMAGES[cat.id] || CAT_IMAGES.fb} alt={cat.label} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-left">{cat.label}</span>
                  <span className="ml-auto text-[10px] text-white/25">{COUNTS[cat.id] || 0}</span>
                </button>
              );
            })}
          </div>

          {/* Member Banner */}
          <div
            className="mt-6 p-4 rounded-xl border"
            style={{ borderColor: "rgba(225,169,95,0.20)", background: GOLD_DIM }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4" style={{ color: GOLD }} />
              <span className="text-[12px] font-semibold text-white">Member Benefits</span>
            </div>
            <p className="text-[11px] text-white/40 leading-relaxed">
              Unlock 8% discount on all products, priority delivery, and dedicated support.
            </p>
            <Link
              href="/register"
              className="mt-3 block w-full text-center py-2 text-[11px] font-medium text-[#050505] rounded-lg"
              style={{ background: GOLD }}
            >
              Become a Member
            </Link>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {/* Results count */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] text-white/40">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              {activeCategory && ` in ${getCategoryById(activeCategory)?.label}`}
            </span>
            {memberMode && (
              <span className="flex items-center gap-1.5 text-[11px]" style={{ color: RED }}>
                <Crown className="w-3 h-3" /> Member prices active
              </span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/30">
              <Package className="w-12 h-12 mb-4 text-white/10" />
              <p className="text-lg font-medium text-white/50">No products found</p>
              <button
                onClick={() => { setActiveCategory(""); setSearch(""); setActiveFilters([]); }}
                className="mt-4 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ background: RED }}
              >
                View All Products
              </button>
            </div>
          ) : (
            <div
              className={`grid gap-4 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  className="group relative flex flex-col surface-card overflow-hidden hover:border-white/[0.10] transition-all duration-300"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <ProductImage product={product} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${
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
                        <span
                          className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border"
                          style={{ background: GOLD_DIM, color: GOLD, borderColor: "rgba(225,169,95,0.25)" }}
                        >
                          Premier
                        </span>
                      )}
                      {memberMode && (
                        <span
                          className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1"
                          style={{ background: RED_DIM, color: RED, borderColor: RED_GLOW }}
                        >
                          <Crown className="w-2.5 h-2.5" /> -8%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-2 p-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider font-bold" style={{ color: GOLD }}>
                        {getCategoryById(product.category)?.code || product.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span className="text-[10px] uppercase tracking-wider text-white/25">{product.unitOfMeasure}</span>
                    </div>

                    <h3 className="text-[14px] font-medium text-white leading-snug line-clamp-2 group-hover:text-white/80 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[12px] font-medium text-white/60">{product.supplierRating.toFixed(1)}</span>
                      <span className="text-[10px] text-white/25">({product.supplierReviewCount})</span>
                    </div>

                    <div className="flex items-baseline gap-2 pt-1">
                      {memberMode ? (
                        <>
                          <span className="text-xl font-bold text-white tracking-tight">
                            EGP {memberDiscount(product.unitPrice).toLocaleString()}
                          </span>
                          <span className="text-[12px] text-white/25 line-through">
                            EGP {product.unitPrice.toLocaleString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-xl font-bold text-white tracking-tight">
                          {formatPrice(product.unitPrice, product.currency)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-white/25">
                      <span>MOQ: {product.minOrderQty}</span>
                      <span className="w-1 h-1 rounded-full bg-white/10" />
                      <span>{product.leadTimeDays} day delivery</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <Link
                        href={`/marketplace/${product.id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/[0.06] text-[12px] font-medium text-white/50 hover:text-white hover:border-white/[0.12] transition-all"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                      <button
                        onClick={() => handleAdd(product.id)}
                        className="flex items-center justify-center px-3 py-2.5 rounded-xl text-white transition-all btn-crimson h-auto"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>

                    {showLoginPrompt === product.id && (
                      <motion.p
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-[11px] text-center"
                        style={{ color: RED }}
                      >
                        Please <Link href="/login" className="underline font-medium">sign in</Link> to order
                      </motion.p>
                    )}

                    <p className="text-[10px] text-white/15 truncate">
                      by <span className="text-white/30">{product.supplierName}</span>
                      <span className="mx-1">·</span>
                      <MapPin className="w-2.5 h-2.5 inline text-white/15" />
                      <span className="text-white/20"> {product.supplierCity}</span>
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <SupplierShowcase />
        </div>
        </div>
      </div>
    </div>
  );
}
