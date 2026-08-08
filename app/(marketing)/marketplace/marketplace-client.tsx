"use client";

import Link from "next/link";
import { Suspense, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Search, X, Loader2, ShoppingCart, Star, MapPin, Package, Shield, Clock, FileCheck, Truck, Banknote, BarChart3, Upload } from "lucide-react";
import { getProductImage } from "@/lib/marketplace/product-images";
import { HOTEL_CATEGORIES } from "@/lib/marketplace/categories";
import { useCart } from "@/components/cart/cart-context";

interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  subcategory?: string;
  unitPrice: number;
  unitOfMeasure: string;
  minOrderQuantity?: number;
  images?: string;
  inStock?: boolean;
  supplier?: { id: string; name: string; city?: string; tier?: string; rating?: number };
}

const CATEGORY_IMAGES: Record<string, string> = {
  FB: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
  CONSUMABLES: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600&h=400&fit=crop",
  GUEST_SUPPLIES: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
  FFE: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
  OSE: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&h=400&fit=crop",
  LINEN: "https://images.unsplash.com/photo-1629949009765-69764abb390e?w=600&h=400&fit=crop",
  ENGINEERING: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&h=400&fit=crop",
  SPA: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=400&fit=crop",
  IT: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
  SAFETY: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
};

const VENDOR_FEATURES = [
  { icon: Upload, title: "Catalog Management", desc: "Upload your catalog. Hotels request quotes — AI matches the right vendors." },
  { icon: ShoppingCart, title: "RFQ Matching", desc: "Receive quote requests directly from hotel procurement teams." },
  { icon: Banknote, title: "48-Hour Payment", desc: "Get paid in 48 hours via embedded factoring." },
  { icon: FileCheck, title: "ETA Invoicing", desc: "Every invoice is auto-generated with RSA-2048 signing and UUID tracking." },
  { icon: BarChart3, title: "Sales Analytics", desc: "Track quote requests, revenue, and buyer behavior across properties." },
  { icon: Shield, title: "Verified Badge", desc: "Complete KYC and get the verified vendor badge." },
];

function formatPrice(price: number): string {
  return "EGP " + price.toLocaleString("en-EG");
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "";
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/v1/products?limit=200");
        const json = await res.json();
        const list = json.data?.products ?? json.data?.data ?? [];
        if (Array.isArray(list)) {
          setProducts(list);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const q = query.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (q) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          p.category.toLowerCase().includes(q) ||
          (p.supplier?.name && p.supplier.name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [q, activeCategory, products]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const displayCategories = HOTEL_CATEGORIES.filter((c) => {
    if (!activeCategory) return true;
    return c.code === activeCategory;
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.unitPrice,
      unitPrice: product.unitPrice,
      supplierId: product.supplier?.id || "",
      supplierName: product.supplier?.name || "Verified Supplier",
      image: (() => { const r = getProductImage({ name: product.name, category: product.category }); return r.type === "url" ? r.src : ""; })(),
    }, product.minOrderQuantity || 1);
  };

  return (
    <main style={{ backgroundColor: "#0c0c12", color: "#ffffff", minHeight: "100vh" }}>
      {/* ═══════════ HERO ═══════════ */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(var(--accent-base-rgb),0.06) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full" style={{ backgroundColor: "rgba(var(--accent-base-rgb),0.12)", color: "var(--accent-base)" }}>Marketplace</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] px-2.5 py-1 rounded-full border" style={{ borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.3)" }}>Live Catalog</span>
          </div>
          <h1 className="text-[clamp(32px,5vw,56px)] font-semibold leading-[1.05] tracking-tight mb-5">
            <span className="text-white">{products.length}+ Products.</span>{" "}
            <span className="text-white">Verified Vendors.</span><br />
            <span style={{ color: "var(--accent-base)" }}>Zero Collection Chases.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed mb-8">
            Egypt&apos;s largest hospitality procurement catalog. Request quotes, AI matches the right vendors, and the cycle automates. Built for vendors who are done waiting 90 days to get paid.
          </p>

          {/* Search */}
          <div className="max-w-2xl mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, suppliers, or categories..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-accent-base/60 transition-all"
                />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors" aria-label="Clear search">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
            {query && (
              <p className="text-[12px] text-white/40 mt-3">
                {filteredProducts.length > 0 ? (
                  <>Showing <span className="text-white font-medium">{filteredProducts.length}</span> results for <span style={{ color: "var(--accent-base)" }}>&ldquo;{query}&rdquo;</span></>
                ) : (
                  <>No matches for <span className="text-white font-medium">&ldquo;{query}&rdquo;</span></>
                )}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/register?type=supplier" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(var(--accent-base-rgb),0.2)]" style={{ backgroundColor: "var(--accent-base)", color: "var(--surface)" }}>
              Start Selling <ArrowRight size={14} />
            </Link>
            <Link href="/register?type=hotel" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Register as Buyer
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ TRUST BAR ═══════════ */}
      <section className="py-6 border-y" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "#12121a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Package, label: `${products.length}+ Products`, desc: "Live in catalog" },
              { icon: Clock, label: "24-Hour Settlement", desc: "Via embedded factoring" },
              { icon: FileCheck, label: "ETA Compliant", desc: "Auto-generated invoices" },
              { icon: Truck, label: "48h Delivery", desc: "Coastal & metro zones" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={16} style={{ color: "var(--accent-base)" }} />
                <div>
                  <p className="text-[11px] font-medium text-white/60">{b.label}</p>
                  <p className="text-[9px] text-white/25">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORY FILTER TABS ═══════════ */}
      <section className="py-6 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setActiveCategory("")}
              className="shrink-0 px-4 py-2 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap"
              style={!activeCategory ? { backgroundColor: "var(--accent-base)", color: "var(--surface)" } : { border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
            >
              All ({products.length})
            </button>
            {HOTEL_CATEGORIES.map((cat) => {
              const count = categoryCounts[cat.code] || 0;
              if (count === 0) return null;
              return (
                <button
                  key={cat.code}
                  onClick={() => setActiveCategory(activeCategory === cat.code ? "" : cat.code)}
                  className="shrink-0 px-4 py-2 rounded-lg text-[12px] font-medium transition-all whitespace-nowrap"
                  style={activeCategory === cat.code ? { backgroundColor: "var(--accent-base)", color: "var(--surface)" } : { border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.4)" }}
                >
                  {cat.label} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ PRODUCT GRID ═══════════ */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(var(--accent-base-rgb),0.03) 0%, transparent 60%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2">
                {activeCategory ? HOTEL_CATEGORIES.find((c) => c.code === activeCategory)?.label || "Products" : "All Products"}
              </h2>
              <p className="text-[13px] text-white/40">{filteredProducts.length} products available</p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin" style={{ color: "var(--accent-base)" }} />
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredProducts.slice(0, 32).map((product) => {
                const resolved = getProductImage({ name: product.name, category: product.category });
                const img = resolved.type === "url" ? resolved.src : "";
                return (
                  <div key={product.id} className="group rounded-xl overflow-hidden border transition-all hover:border-white/15 hover:shadow-lg cursor-pointer" style={{ backgroundColor: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
                    {/* Image */}
                    <div className="relative h-36 overflow-hidden">
                      <img src={img} alt={product.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-transparent to-transparent opacity-60" />
                      {/* Category badge */}
                      <div className="absolute top-2.5 left-2.5">
                        <span className="text-[9px] font-medium px-2 py-0.5 rounded-full backdrop-blur-sm" style={{ backgroundColor: "rgba(var(--accent-base-rgb),0.2)", color: "var(--accent-base)" }}>
                          {product.category.replace(/_/g, " ")}
                        </span>
                      </div>
                      {/* Stock badge */}
                      {product.inStock === false && (
                        <div className="absolute top-2.5 right-2.5">
                          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(220,38,38,0.2)", color: "#ef4444" }}>
                            Out of Stock
                          </span>
                        </div>
                      )}
                      {/* Hover cart button */}
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        className="absolute bottom-2.5 right-2.5 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0"
                        style={{ backgroundColor: "var(--accent-base)" }}
                        aria-label={`Add ${product.name} to cart`}
                      >
                        <ShoppingCart size={14} className="text-white" />
                      </button>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h4 className="text-[12px] font-medium text-white mb-1 leading-tight line-clamp-2 min-h-[28px]">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        {product.supplier?.rating && (
                          <div className="flex items-center gap-0.5">
                            <Star size={10} className="fill-yellow-500 text-yellow-500" />
                            <span className="text-[10px] text-white/50">{product.supplier.rating.toFixed(1)}</span>
                          </div>
                        )}
                        {product.supplier?.city && (
                          <span className="flex items-center gap-0.5 text-[10px] text-white/30">
                            <MapPin size={9} /> {product.supplier.city}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/30 mb-2">{product.supplier?.name || "Verified Supplier"}</p>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[13px] font-semibold" style={{ color: "var(--accent-base)" }}>
                            {formatPrice(product.unitPrice)}
                          </p>
                          <p className="text-[9px] text-white/25">/ {product.unitOfMeasure}</p>
                        </div>
                        {product.minOrderQuantity && product.minOrderQuantity > 1 && (
                          <span className="text-[9px] text-white/25">MOQ: {product.minOrderQuantity}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-20">
              <Package size={40} className="mx-auto mb-4" style={{ color: "rgba(255,255,255,0.1)" }} />
              <p className="text-[14px] text-white/30 mb-2">No products found</p>
              <p className="text-[12px] text-white/20">Try adjusting your search or category filter</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════ CATEGORIES GRID ═══════════ */}
      {!activeCategory && (
        <section className="py-16" style={{ backgroundColor: "#12121a" }}>
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2">Browse by Category</h2>
            <p className="text-[13px] text-white/40 mb-8">Explore our full range of hospitality procurement categories</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {HOTEL_CATEGORIES.map((cat) => {
                const count = categoryCounts[cat.code] || 0;
                const img = CATEGORY_IMAGES[cat.code] || CATEGORY_IMAGES.FB;
                return (
                  <button
                    key={cat.code}
                    onClick={() => setActiveCategory(cat.code)}
                    className="group relative rounded-xl overflow-hidden border text-left transition-all hover:scale-[1.02] hover:border-white/15"
                    style={{ borderColor: "rgba(255,255,255,0.06)" }}
                  >
                    <img src={img} alt={cat.label} className="w-full h-28 object-cover opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-[#0c0c12]/70 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <h3 className="text-[12px] font-semibold text-white mb-0.5">{cat.label}</h3>
                      <p className="text-[10px] text-white/30">{count} products</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════ VENDOR FEATURES ═══════════ */}
      <section className="py-16" style={{ backgroundColor: "#0c0c12" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3">Why Vendors Choose HotelsVendors</h2>
            <p className="text-[14px] text-white/50 max-w-lg mx-auto">Everything you need to sell to Egypt&apos;s top hotels — from catalog to cash in 48 hours.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VENDOR_FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl p-6 transition-all hover:border-white/10" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(var(--accent-base-rgb),0.1)" }}>
                  <f.icon size={18} style={{ color: "var(--accent-base)" }} />
                </div>
                <h3 className="text-[13px] font-medium text-white mb-2">{f.title}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-20" style={{ backgroundColor: "#12121a" }}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[28px] font-semibold mb-4 text-white">Ready to Sell to Egypt&apos;s Top Hotels?</h2>
          <p className="text-[14px] text-white/40 mb-8 max-w-lg mx-auto">
            Join vendors already transacting on HotelsVendors. Get paid in 48 hours, not 90.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register?type=supplier" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(var(--accent-base-rgb),0.2)]" style={{ backgroundColor: "var(--accent-base)", color: "var(--surface)" }}>
              Register as Vendor <ArrowRight size={14} />
            </Link>
            <Link href="/login" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function MarketplaceClient() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "#0c0c12", minHeight: "100vh" }} className="flex items-center justify-center"><Loader2 size={28} className="animate-spin" style={{ color: "var(--accent-base)" }} /></div>}>
      <MarketplaceContent />
    </Suspense>
  );
}
