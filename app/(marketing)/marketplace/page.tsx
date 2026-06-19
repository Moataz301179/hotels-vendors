"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search, Filter, ShoppingCart, Star, MapPin, Clock, Shield,
  ChevronDown, SlidersHorizontal, Grid3X3, LayoutList, Heart,
  Truck, Banknote, CheckCircle2, ArrowRight, X, Package,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

// ─── Color System ──────────────────────────────────────────────────
const C = {
  green: "#39ff7e",
  greenMuted: "rgba(57,255,126,0.08)",
  greenBorder: "rgba(57,255,126,0.25)",
  orange: "#ff7e1a",
  orangeMuted: "rgba(255,126,26,0.08)",
  orangeBorder: "rgba(255,126,26,0.25)",
  purple: "#c455ff",
  bg: "#07090f",
  card: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.06)",
};

// ─── Mock Data ─────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", name: "All Categories", count: 2847 },
  { id: "fnb", name: "F&B", count: 1243 },
  { id: "consumables", name: "Consumables", count: 687 },
  { id: "guest", name: "Guest Supplies", count: 412 },
  { id: "ffne", name: "FF&E", count: 298 },
  { id: "services", name: "Services", count: 207 },
];

const SUPPLIERS = [
  { id: "s1", name: "Egyptian Linen Co.", location: "Cairo", rating: 4.8, reviews: 234, verified: true, specialty: "Premium hotel linens & textiles" },
  { id: "s2", name: "Nile Fresh Produce", location: "Giza", rating: 4.6, reviews: 189, verified: true, specialty: "Daily F&B fresh delivery" },
  { id: "s3", name: "Red Sea Chemicals", location: "Hurghada", rating: 4.7, reviews: 156, verified: true, specialty: "Pool & housekeeping chemicals" },
  { id: "s4", name: "Oasis Amenities", location: "Alexandria", rating: 4.5, reviews: 98, verified: false, specialty: "Guest room amenities & toiletries" },
  { id: "s5", name: "Pharaoh FF&E", location: "Cairo", rating: 4.9, reviews: 312, verified: true, specialty: "Furniture, fixtures & capital equipment" },
  { id: "s6", name: "Delta Pest Control", location: "Mansoura", rating: 4.4, reviews: 67, verified: true, specialty: "Licensed pest management services" },
];

const PRODUCTS = [
  {
    id: "p1", name: "Egyptian Cotton Towel Set", category: "consumables", supplier: "Egyptian Linen Co.",
    price: 85, unit: "piece", minOrder: 50, rating: 4.8, reviews: 124, inStock: true, fastShip: true,
    desc: "70x140cm, 600GSM, white. Pre-washed, hotel-grade. ETA invoice included.",
  },
  {
    id: "p2", name: "Pool Chlorine Tablets 5kg", category: "consumables", supplier: "Red Sea Chemicals",
    price: 320, unit: "bucket", minOrder: 4, rating: 4.7, reviews: 89, inStock: true, fastShip: true,
    desc: "Trichloro-s-triazinetrione 90%. NSF certified. Safety data sheet provided.",
  },
  {
    id: "p3", name: "Shampoo Dispenser 300ml", category: "guest", supplier: "Oasis Amenities",
    price: 45, unit: "piece", minOrder: 100, rating: 4.5, reviews: 67, inStock: true, fastShip: false,
    desc: "Wall-mounted, tamper-proof. Brushed stainless steel. Refillable cartridges available.",
  },
  {
    id: "p4", name: "Restaurant Chair — Bentwood", category: "ffne", supplier: "Pharaoh FF&E",
    price: 1200, unit: "piece", minOrder: 20, rating: 4.9, reviews: 203, inStock: true, fastShip: false,
    desc: "Solid beech wood, natural finish. Stackable. Weight capacity 150kg. 5-year warranty.",
  },
  {
    id: "p5", name: "Fresh Salmon Fillets", category: "fnb", supplier: "Nile Fresh Produce",
    price: 285, unit: "kg", minOrder: 10, rating: 4.6, reviews: 156, inStock: true, fastShip: true,
    desc: "Norwegian Atlantic salmon, skin-on. Cold-chain delivered. HACCP certified facility.",
  },
  {
    id: "p6", name: "Pest Control — Monthly", category: "services", supplier: "Delta Pest Control",
    price: 2500, unit: "month", minOrder: 1, rating: 4.4, reviews: 45, inStock: true, fastShip: false,
    desc: "Full property treatment. Cockroach, ant, rodent. Licensed by Egyptian Ministry of Health.",
  },
  {
    id: "p7", name: "Bed Sheet Set King", category: "consumables", supplier: "Egyptian Linen Co.",
    price: 340, unit: "set", minOrder: 30, rating: 4.8, reviews: 198, inStock: true, fastShip: true,
    desc: "200x220cm fitted + 2 pillowcases. 300TC sateen weave. 100% Egyptian cotton.",
  },
  {
    id: "p8", name: "Lobby Sofa — 3 Seater", category: "ffne", supplier: "Pharaoh FF&E",
    price: 18500, unit: "piece", minOrder: 2, rating: 4.9, reviews: 87, inStock: false, fastShip: false,
    desc: "Premium Italian leather. Solid hardwood frame. Custom colors available. 8-week lead time.",
  },
  {
    id: "p9", name: "Olive Oil Extra Virgin 5L", category: "fnb", supplier: "Nile Fresh Produce",
    price: 420, unit: "can", minOrder: 6, rating: 4.7, reviews: 134, inStock: true, fastShip: true,
    desc: "Cold-pressed, acidity <0.8%. Origin: Siwa Oasis. Food safety certified.",
  },
  {
    id: "p10", name: "Bathroom Amenities Kit", category: "guest", supplier: "Oasis Amenities",
    price: 28, unit: "kit", minOrder: 200, rating: 4.5, reviews: 89, inStock: true, fastShip: true,
    desc: "Shampoo, conditioner, body wash, lotion, soap. Individually wrapped. Hotel branding available.",
  },
  {
    id: "p11", name: "Dishwashing Liquid 5L", category: "consumables", supplier: "Red Sea Chemicals",
    price: 65, unit: "can", minOrder: 10, rating: 4.6, reviews: 78, inStock: true, fastShip: true,
    desc: "Commercial grade, concentrated. Food-safe. KOSHER certified.",
  },
  {
    id: "p12", name: "Laundry Service — Per kg", category: "services", supplier: "Egyptian Linen Co.",
    price: 12, unit: "kg", minOrder: 100, rating: 4.7, reviews: 112, inStock: true, fastShip: false,
    desc: "Pickup & delivery included. 24-hour turnaround. Industrial-grade cleaning.",
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  fnb: "#FFB000",
  consumables: "#22C55E",
  guest: "#3B82F6",
  ffne: "#D4A843",
  services: "#00E5CC",
};

const CATEGORY_LABELS: Record<string, string> = {
  fnb: "F&B",
  consumables: "Consumables",
  guest: "Guest Supplies",
  ffne: "FF&E",
  services: "Services",
};

// ─── Product Card ──────────────────────────────────────────────────
function ProductCard({ product }: { product: typeof PRODUCTS[number] }) {
  const catColor = CATEGORY_COLORS[product.category] || C.green;
  return (
    <div
      className="rounded-xl overflow-hidden transition-all hover:scale-[1.01] group"
      style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
    >
      {/* Image placeholder */}
      <div className="relative h-40 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${catColor}08, ${catColor}03)` }}>
        <Package size={40} style={{ color: catColor, opacity: 0.25 }} />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: catColor + "20", color: catColor }}>
            {CATEGORY_LABELS[product.category]}
          </span>
          {product.fastShip && (
            <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: C.greenMuted, color: C.green }}>
              Fast Ship
            </span>
          )}
        </div>
        <button className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <Heart size={13} className="text-white/60" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="text-[13px] font-medium text-white leading-snug flex-1">{product.name}</h3>
          <span className="text-[13px] font-semibold whitespace-nowrap" style={{ color: C.green }}>EGP {product.price}</span>
        </div>
        <p className="text-[11px] text-white/30 mb-2">{product.unit} · MOQ {product.minOrder}</p>
        <p className="text-[11px] text-white/40 leading-relaxed mb-3 line-clamp-2">{product.desc}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star size={10} fill="#FFB000" color="#FFB000" />
              <span className="text-[10px] text-white/50">{product.rating}</span>
              <span className="text-[9px] text-white/20">({product.reviews})</span>
            </div>
            <span className="text-[9px] text-white/15">·</span>
            <span className="text-[10px] text-white/30">{product.supplier}</span>
          </div>
          {product.inStock ? (
            <span className="text-[9px] flex items-center gap-1" style={{ color: C.green }}>
              <CheckCircle2 size={9} /> In Stock
            </span>
          ) : (
            <span className="text-[9px]" style={{ color: C.orange }}>Pre-order</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Supplier Card ─────────────────────────────────────────────────
function SupplierCard({ supplier }: { supplier: typeof SUPPLIERS[number] }) {
  return (
    <div className="rounded-xl p-4 transition-all hover:scale-[1.01]" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.greenMuted }}>
          <span className="text-[10px] font-bold" style={{ color: C.green }}>{supplier.name.charAt(0)}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="text-[13px] font-medium text-white truncate">{supplier.name}</h3>
            {supplier.verified && <Shield size={11} style={{ color: C.green }} />}
          </div>
          <p className="text-[11px] text-white/30 mb-1">{supplier.specialty}</p>
          <div className="flex items-center gap-3 text-[10px] text-white/40">
            <span className="flex items-center gap-1"><MapPin size={9} />{supplier.location}</span>
            <span className="flex items-center gap-1"><Star size={9} fill="#FFB000" color="#FFB000" />{supplier.rating} ({supplier.reviews})</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────
export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState<"products" | "suppliers">("products");

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.supplier.toLowerCase().includes(q) ||
          p.desc.toLowerCase().includes(q)
      );
    }
    return result;
  }, [activeCategory, searchQuery]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: C.bg, color: "#ffffff", fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, -apple-system, sans-serif" }}>
      <MarketingNav />

      {/* ═══ Hero Search ═══ */}
      <section className="pt-28 pb-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none" style={{ background: `radial-gradient(circle, ${C.green}06 0%, transparent 70%)` }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-tight mb-2 text-white">
            B2B Hospitality Marketplace
          </h1>
          <p className="text-[14px] text-white/40 mb-6 max-w-xl">
            Fixed-price catalogs from verified Egyptian suppliers. ETA-compliant invoicing. 24-hour settlement via embedded factoring.
          </p>

          {/* Search bar */}
          <div className="flex gap-2 max-w-2xl">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, suppliers, categories..."
                className="w-full pl-11 pr-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/20 outline-none"
                style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${C.border}` }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={14} className="text-white/30" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-4 py-3 rounded-xl flex items-center gap-2 text-[13px] transition-all"
              style={{ backgroundColor: showFilters ? C.greenMuted : "rgba(255,255,255,0.04)", border: `1px solid ${showFilters ? C.greenBorder : C.border}`, color: showFilters ? C.green : "rgba(255,255,255,0.5)" }}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>
          </div>

          {/* Quick filters */}
          {showFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {[
                { label: "In Stock Only", color: C.green },
                { label: "Fast Ship", color: C.orange },
                { label: "Verified Suppliers", color: C.purple },
                { label: "Under EGP 100", color: C.green },
                { label: "Bulk Orders", color: C.orange },
              ].map((f) => (
                <button key={f.label} className="text-[11px] px-3 py-1.5 rounded-full border transition-all hover:scale-105" style={{ borderColor: f.color + "40", color: f.color, backgroundColor: f.color + "08" }}>
                  {f.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ═══ Content ═══ */}
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex gap-8">
            {/* ─── Sidebar ─── */}
            <aside className="hidden lg:block w-56 flex-shrink-0">
              <div className="sticky top-24">
                <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/30 mb-3">Categories</h3>
                <div className="space-y-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] transition-all"
                      style={{
                        backgroundColor: activeCategory === cat.id ? C.greenMuted : "transparent",
                        color: activeCategory === cat.id ? C.green : "rgba(255,255,255,0.45)",
                      }}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] opacity-50">{cat.count}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${C.border}` }}>
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/30 mb-3">Delivery To</h3>
                  {["Sharm El-Sheikh", "Hurghada", "Cairo", "Alexandria", "North Coast", "Marsa Alam"].map((loc) => (
                    <label key={loc} className="flex items-center gap-2 py-1.5 cursor-pointer">
                      <input type="checkbox" className="rounded" style={{ accentColor: C.green }} />
                      <span className="text-[12px] text-white/40">{loc}</span>
                    </label>
                  ))}
                </div>

                <div className="mt-8 pt-6" style={{ borderTop: `1px solid ${C.border}` }}>
                  <h3 className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/30 mb-3">Settlement</h3>
                  {["24h Factoring", "Net-30", "Net-60", "Bank Transfer"].map((s) => (
                    <label key={s} className="flex items-center gap-2 py-1.5 cursor-pointer">
                      <input type="checkbox" className="rounded" style={{ accentColor: C.green }} />
                      <span className="text-[12px] text-white/40">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* ─── Main Content ─── */}
            <div className="flex-1 min-w-0">
              {/* Tabs + View toggle */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                  <button
                    onClick={() => setActiveTab("products")}
                    className="px-4 py-2 rounded-md text-[12px] font-medium transition-all"
                    style={{ backgroundColor: activeTab === "products" ? C.green : "transparent", color: activeTab === "products" ? "#07090f" : "rgba(255,255,255,0.4)" }}
                  >
                    Products ({filteredProducts.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("suppliers")}
                    className="px-4 py-2 rounded-md text-[12px] font-medium transition-all"
                    style={{ backgroundColor: activeTab === "suppliers" ? C.orange : "transparent", color: activeTab === "suppliers" ? "#07090f" : "rgba(255,255,255,0.4)" }}
                  >
                    Suppliers ({SUPPLIERS.length})
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-white/25">{filteredProducts.length} results</span>
                  <div className="flex border rounded-lg overflow-hidden" style={{ borderColor: C.border }}>
                    <button onClick={() => setViewMode("grid")} className="p-1.5" style={{ backgroundColor: viewMode === "grid" ? "rgba(255,255,255,0.06)" : "transparent" }}>
                      <Grid3X3 size={13} className={viewMode === "grid" ? "text-white/60" : "text-white/20"} />
                    </button>
                    <button onClick={() => setViewMode("list")} className="p-1.5" style={{ backgroundColor: viewMode === "list" ? "rgba(255,255,255,0.06)" : "transparent" }}>
                      <LayoutList size={13} className={viewMode === "list" ? "text-white/60" : "text-white/20"} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {activeTab === "products" && (
                <div className={viewMode === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-3"}>
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                  {filteredProducts.length === 0 && (
                    <div className="col-span-full py-16 text-center">
                      <Search size={32} className="mx-auto mb-3 text-white/10" />
                      <p className="text-[14px] text-white/30">No products match your search.</p>
                      <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); }} className="mt-3 text-[12px]" style={{ color: C.green }}>Clear filters</button>
                    </div>
                  )}
                </div>
              )}

              {/* Suppliers Grid */}
              {activeTab === "suppliers" && (
                <div className="grid sm:grid-cols-2 gap-4">
                  {SUPPLIERS.map((supplier) => (
                    <SupplierCard key={supplier.id} supplier={supplier} />
                  ))}
                </div>
              )}

              {/* Trust bar */}
              <div className="mt-10 rounded-xl p-5 flex flex-wrap justify-center gap-6" style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}>
                {[
                  { icon: Shield, label: "Verified Suppliers", desc: "KYC completed", color: C.green },
                  { icon: Banknote, label: "24h Settlement", desc: "Embedded factoring", color: C.orange },
                  { icon: Truck, label: "Coastal Delivery", desc: "6 governorates", color: C.green },
                  { icon: Clock, label: "ETA Invoicing", desc: "Auto-generated", color: C.purple },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-2.5">
                    <b.icon size={15} style={{ color: b.color }} />
                    <div>
                      <p className="text-[11px] font-medium text-white/60">{b.label}</p>
                      <p className="text-[9px] text-white/25">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 border-t" style={{ borderColor: C.border }}>
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[22px] font-semibold mb-3 text-white">Can&apos;t Find What You Need?</h2>
          <p className="text-[13px] text-white/40 mb-6 max-w-lg mx-auto">
            Our AI agent can source any product from verified suppliers. Describe what you need and get matched instantly.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/sandbox" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:opacity-90" style={{ backgroundColor: C.green, color: "#07090f" }}>
              Talk to AI Agent <ArrowRight size={14} />
            </Link>
            <Link href="/become-supplier" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: `1px solid ${C.orangeBorder}`, color: C.orange }}>
              Become a Supplier
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
