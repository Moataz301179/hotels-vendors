"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Mail,
  Package,
  Loader2,
  Shield,
  Banknote,
  Truck,
  Clock,
} from "lucide-react";
import { motion } from "framer-motion";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { SearchBar, type SearchFilters } from "@/components/marketplace/search-bar";
import { CategoryNav } from "@/components/marketplace/category-nav";
import { ProductCard } from "@/components/marketplace/product-card";
import { CompareDrawer } from "@/components/marketplace/compare-drawer";
import { useCompare } from "@/components/marketplace/compare-context";
import { getProductImage } from "@/lib/marketplace/product-images";
import type { MarketplaceProduct } from "@/lib/marketplace/category-mapper";

const accent = "var(--accent-base)";
const accentMuted = "var(--accent-muted)";
const accentBorder = "var(--accent-glow)";
const surface = "var(--bg-surface-1)";
const borderSubtle = "var(--border-subtle)";

const HOTEL_GROUPS = [
  "Stella Di Mare", "Sunrise Resorts", "Jaz Hotels", "Baron Hotels",
  "Pickalbatros", "Marriott Hurghada", "Four Seasons Sharm", "Rixos Sharm",
];

const CATEGORIES = [
  { name: "F&B", desc: "Food, beverages & kitchen equipment", icon: "🍽️" },
  { name: "Consumables", desc: "Linens, chemicals & cleaning supplies", icon: "🧴" },
  { name: "Guest Supplies", desc: "Amenities & room accessories", icon: "🛁" },
  { name: "FF&E", desc: "Furniture, fixtures & capital equipment", icon: "🪑" },
  { name: "Services", desc: "Maintenance, pest control & laundry", icon: "🔧" },
];

export default function MarketplacePage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  // Waitlist
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare } = useCompare();

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (activeCategory) params.set("category", activeCategory);
      params.set("status", "ACTIVE");
      params.set("limit", "48");
      params.set("page", "1");

      const res = await fetch(`/api/v1/products?${params.toString()}`);
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Failed to load products");
      setProducts(json.data.products);
      setTotal(json.data.pagination.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, activeCategory]);

  useEffect(() => {
    const timer = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  const counts = useMemo(() => {
    return products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [products]);

  const handleSearch = (query: string, _filters: SearchFilters) => {
    setSearch(query);
  };

  const handleViewDetails = (id: string) => {
    window.location.href = `/marketplace/${id}`;
  };

  const handleAddToCart = (id: string, _qty: number) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    const resolved = getProductImage(product);
    // Cart is optional on marketing — silently no-op if no cart context
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <main className="min-h-screen text-primary" style={{ backgroundColor: "var(--background)", fontFamily: "var(--font-sans)" }}>
      <MarketingNav />

      {/* ═══ Hero ═══ */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(163,230,53,0.05) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: accentMuted, border: "1px solid var(--accent-glow)" }}>
            <Sparkles size={12} style={{ color: "var(--accent-base)" }} />
            <span className="text-[11px] font-medium" style={{ color: "var(--accent-base)" }}>Real Catalog - {total} Verified Products Online</span>
          </div>

          <h1 className="text-[32px] sm:text-[44px] font-semibold tracking-tight mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Egypt's B2B Hospitality<br />Procurement Marketplace
          </h1>
          <p className="text-[15px] text-white/50 mb-8 max-w-2xl mx-auto leading-relaxed">
            Fixed-price catalogs from verified Egyptian suppliers. ETA-compliant invoicing.
            24-hour settlement via embedded factoring. Open API + plugin ecosystem.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@hotel.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[13px] text-white placeholder:text-white/20 outline-none"
                  style={{ backgroundColor: "var(--border-subtle)", border: `1px solid ${borderSubtle}` }}
                />
              </div>
              <button type="submit" className="px-6 py-3.5 rounded-xl text-[13px] font-medium transition-all hover:opacity-90 flex items-center gap-2" style={{ backgroundColor: accent, color: "var(--text-primary)" }}>
                Join Waitlist <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl" style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <CheckCircle2 size={18} className="text-green-400" />
              <span className="text-[14px] text-green-400">You're on the list. We'll reach out when we launch.</span>
            </div>
          )}
          <p className="text-[11px] text-white/20 mt-3">No spam. Early access + priority onboarding for waitlist members.</p>
        </div>
      </section>

      {/* ═══ Hotel Groups Trust Bar ═══ */}
      <section className="py-8 border-y" style={{ borderColor: borderSubtle }}>
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/20 text-center mb-5">Trusted by procurement teams at</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {HOTEL_GROUPS.map((name) => (
              <span key={name} className="text-[12px] text-white/25 font-medium">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Real Product Catalog ═══ */}
      <section className="py-16" style={{ borderTop: `1px solid ${borderSubtle}` }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentMuted }}>
              <Package size={16} style={{ color: "var(--accent-base)" }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--accent-base)" }}>Live Catalog - Verified Suppliers</span>
          </div>
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Real Products - Ready to Order
          </h2>
          <p className="text-[14px] text-white/40 max-w-2xl mb-8">
            Browse fixed-price listings from verified Egyptian suppliers across F&B, consumables, guest supplies, FF&E, and services - actively serving Sharm El-Sheikh, Hurghada, Dahab, El Gouna, Marsa Alam, and the wider Red Sea corridor.
          </p>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Search products, suppliers, SKUs..."
              trending={["Bed Linen", "Pool Chemicals", "Beef Cuts", "HVAC Parts"]}
            />
          </div>

          {/* Category Nav */}
          <div className="mb-8">
            <CategoryNav
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              counts={counts}
            />
          </div>

          {/* Loading / Error / Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24 text-white/40">
              <Loader2 className="w-6 h-6 animate-spin mr-3" />
              <span>Loading products...</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/40">
              <Package className="w-12 h-12 mb-4 text-white/20" />
              <h3 className="text-lg font-semibold text-white/60 mb-1">Failed to load products</h3>
              <p className="text-sm text-white/30 mb-6">{error}</p>
              <button onClick={fetchProducts} className="px-5 py-2.5 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: accent }}>
                Retry
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-white/40">
              <Package className="w-12 h-12 mb-4 text-white/20" />
              <h3 className="text-lg font-semibold text-white/60 mb-1">No products found</h3>
              <p className="text-sm text-white/30 mb-6">Try adjusting your search or category filter.</p>
              <button
                onClick={() => { setSearch(""); setActiveCategory(""); }}
                className="px-5 py-2.5 rounded-xl text-sm font-medium text-white"
                style={{ backgroundColor: accent }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] text-white/40">
                  {products.length} of {total} products
                  {activeCategory && ` in ${activeCategory}`}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.02 }}
                  >
                    <ProductCard
                      id={product.id}
                      name={product.name}
                      description={product.description || undefined}
                      sku={product.sku}
                      category={product.category}
                      subcategory={product.subcategory || undefined}
                      unitPrice={product.unitPrice}
                      currency={product.currency}
                      stockQuantity={product.stockQuantity}
                      minOrderQty={product.minOrderQty}
                      unitOfMeasure={product.unitOfMeasure}
                      leadTimeDays={product.leadTimeDays}
                      shelfLifeDays={product.shelfLifeDays || undefined}
                      temperatureReq={product.temperatureReq || undefined}
                      supplierName={product.supplierName}
                      supplierTier={product.supplierTier}
                      supplierRating={product.supplierRating}
                      supplierReviewCount={product.supplierReviewCount}
                      supplierCity={product.supplierCity}
                      onAddToCart={handleAddToCart}
                      onViewDetails={handleViewDetails}
                      compareData={{
                        id: product.id,
                        name: product.name,
                        category: product.category,
                        unitPrice: product.unitPrice,
                        currency: product.currency,
                        supplierName: product.supplierName,
                        supplierRating: product.supplierRating,
                        supplierTier: product.supplierTier,
                        supplierCity: product.supplierCity,
                        stockQuantity: product.stockQuantity,
                        leadTimeDays: product.leadTimeDays,
                        minOrderQty: product.minOrderQty,
                        unitOfMeasure: product.unitOfMeasure,
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ═══ Product Categories ═══ */}
      <section className="py-20" style={{ borderTop: `1px solid ${borderSubtle}` }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Product Categories
            </h2>
            <p className="text-[14px] text-white/40 max-w-lg mx-auto">
              Five curated categories covering the full hospitality supply chain.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="rounded-xl p-5 transition-all hover:scale-[1.01]" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: accentMuted }}>
                  <span className="text-[18px]">{cat.icon}</span>
                </div>
                <h3 className="text-[14px] font-medium text-white/90 mb-1">{cat.name}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
            <div className="rounded-xl p-5 flex flex-col items-center justify-center text-center" style={{ backgroundColor: accentMuted, border: `1px solid ${accentBorder}` }}>
              <Sparkles size={20} style={{ color: "var(--accent-base)" }} className="mb-2" />
              <h3 className="text-[14px] font-medium mb-1" style={{ color: "var(--accent-base)" }}>AI Sourcing Agent</h3>
              <p className="text-[12px] text-white/40 leading-relaxed">Describe what you need. Our agent finds it from verified suppliers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Trust Signals ═══ */}
      <section className="py-12 border-t" style={{ borderColor: borderSubtle }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "Verified Suppliers", desc: "KYC + trade license verified" },
              { icon: Banknote, label: "48h Settlement", desc: "Embedded invoice factoring" },
              { icon: Truck, label: "Coastal Delivery", desc: "Shark-Breaker shared logistics" },
              { icon: Clock, label: "ETA Invoicing", desc: "Auto-generated compliant invoices" },
            ].map((signal) => (
              <div key={signal.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
                <signal.icon size={20} style={{ color: "var(--accent-base)" }} className="mx-auto mb-2" />
                <p className="text-[12px] font-medium text-white/70 mb-0.5">{signal.label}</p>
                <p className="text-[10px] text-white/30">{signal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 border-t" style={{ borderColor: borderSubtle }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Transform Your Procurement?
          </h2>
          <p className="text-[14px] text-white/40 mb-8 max-w-lg mx-auto">
            Join the waitlist for early access. Priority onboarding for coastal hotel procurement teams.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:opacity-90" style={{ backgroundColor: accent, color: "var(--text-primary)" }}>
              Get Started Free <ArrowRight size={14} />
            </Link>
            <Link href="/become-supplier" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: `1px solid ${accentBorder}`, color: accent }}>
              Become a Supplier
            </Link>
          </div>
        </div>
      </section>

      <CompareDrawer />
      <MarketingFooter />
    </main>
  );
}
