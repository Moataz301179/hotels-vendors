"use client";

import Link from "next/link";
import { Suspense, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Search, Filter, ShoppingCart, FileCheck, Truck, Shield, Clock, Banknote, Upload, BarChart3, Star, Package, X } from "lucide-react";

const categories = [
  { name: "F&B", desc: "Food, beverages, kitchen equipment", count: "2,400+ SKUs", color: "#14b8a6", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop" },
  { name: "Consumables", desc: "Housekeeping, chemicals, linens, toiletries", count: "1,800+ SKUs", color: "#14b8a6", image: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=400&h=300&fit=crop" },
  { name: "Guest Supplies", desc: "Amenities, room accessories, FF&E", count: "950+ SKUs", color: "#64b5f6", image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop" },
  { name: "FF&E", desc: "Furniture, fixtures, capital equipment", count: "620+ SKUs", color: "#ff7e1a", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop" },
  { name: "Services", desc: "Maintenance, pest control, laundry, security", count: "340+ vendors", color: "#c455ff", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop" },
];

const suppliers = [
  { name: "Nile Fresh Produce", category: "F&B", rating: 4.9, location: "Cairo", verified: true, avatar: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=80&h=80&fit=crop", products: ["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&h=120&fit=crop", "https://images.unsplash.com/photo-1565299624946-b28f40a0aeec?w=120&h=120&fit=crop", "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=120&h=120&fit=crop"] },
  { name: "Red Sea Linen Co.", category: "Consumables", rating: 4.8, location: "Hurghada", verified: true, avatar: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=80&h=80&fit=crop", products: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=120&h=120&fit=crop", "https://images.unsplash.com/photo-1584100936595-b272aff752b5?w=120&h=120&fit=crop", "https://images.unsplash.com/photo-1629949009765-40fc74c9ec21?w=120&h=120&fit=crop"] },
  { name: "Oasis Amenities", category: "Guest Supplies", rating: 4.7, location: "Sharm El-Sheikh", verified: true, avatar: "https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=80&h=80&fit=crop", products: ["https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=120&h=120&fit=crop", "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=120&h=120&fit=crop", "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=120&h=120&fit=crop"] },
  { name: "Egyptian Kitchen Supply", category: "FF&E", rating: 4.9, location: "Alexandria", verified: true, avatar: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=80&h=80&fit=crop", products: ["https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=120&h=120&fit=crop", "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=120&h=120&fit=crop", "https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?w=120&h=120&fit=crop"] },
  { name: "Coastal Maintenance Group", category: "Services", rating: 4.6, location: "Hurghada", verified: true, avatar: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=80&h=80&fit=crop", products: [] },
  { name: "Pharaoh Chemicals", category: "Consumables", rating: 4.8, location: "Cairo", verified: true, avatar: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=80&h=80&fit=crop", products: ["https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=120&h=120&fit=crop", "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=120&h=120&fit=crop", "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=120&h=120&fit=crop"] },
];

const heroProducts = [
  { name: "Premium Olive Oil 5L", supplier: "Nile Fresh Produce", price: "EGP 890", image: "https://images.unsplash.com/photo-1474979266404-7f28bfce8480?w=300&h=300&fit=crop", category: "F&B" },
  { name: "Egyptian Cotton Towels", supplier: "Red Sea Linen Co.", price: "EGP 145/pc", image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=300&h=300&fit=crop", category: "Consumables" },
  { name: "Shampoo Dispenser Set", supplier: "Oasis Amenities", price: "EGP 320", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=300&h=300&fit=crop", category: "Guest Supplies" },
  { name: "Commercial Blender Pro", supplier: "Egyptian Kitchen Supply", price: "EGP 12,400", image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=300&h=300&fit=crop", category: "FF&E" },
  { name: "Bulk Cleaning Solution", supplier: "Pharaoh Chemicals", price: "EGP 2,100", image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=300&h=300&fit=crop", category: "Consumables" },
  { name: "Artisan Coffee Beans 10kg", supplier: "Nile Fresh Produce", price: "EGP 3,600", image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=300&h=300&fit=crop", category: "F&B" },
];

const supplierFeatures = [
  { icon: Upload, title: "Catalog Upload", desc: "Upload 2,400+ SKUs with bulk CSV import. Set fixed prices per hotel or per property group." },
  { icon: ShoppingCart, title: "PO Matching", desc: "Receive purchase orders directly from hotel procurement teams. Auto-match against your catalog availability." },
  { icon: Banknote, title: "24-Hour Payment", desc: "Get paid in 24 hours via embedded factoring. No more chasing invoices for 90 days." },
  { icon: FileCheck, title: "ETA Invoicing", desc: "Every invoice is auto-generated with RSA-2048 signing and UUID tracking. Zero compliance overhead." },
  { icon: BarChart3, title: "Sales Analytics", desc: "Track orders, revenue, and buyer behavior across properties. Identify your top hotel accounts at a glance." },
  { icon: Shield, title: "Verified Badge", desc: "Complete KYC and get the verified supplier badge. Hotels prioritize verified vendors for new POs." },
];

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const q = query.trim().toLowerCase();

  const filteredProducts = useMemo(() => {
    if (!q) return heroProducts;
    return heroProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.supplier.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredSuppliers = useMemo(() => {
    if (!q) return suppliers;
    return suppliers.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q)
    );
  }, [q]);

  const filteredCategories = useMemo(() => {
    if (!q) return categories;
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)
    );
  }, [q]);

  const hasResults =
    filteredProducts.length > 0 ||
    filteredSuppliers.length > 0 ||
    filteredCategories.length > 0;

  return (
    <main style={{ backgroundColor: "#0c0c12", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(20,184,166,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Marketplace</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            2,400+ SKUs. 680+ Verified<br />Suppliers. <span className="text-white">Zero Collection Chases.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed mb-8">
            Egypt&apos;s largest hospitality procurement catalog. Fixed-price listings, ETA-compliant invoicing, and 24-hour settlement via embedded factoring. Built for suppliers who are done waiting 90 days to get paid.
          </p>
          <div className="max-w-2xl mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, suppliers, or categories..."
                  className="w-full pl-11 pr-10 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#14b8a6]/60 transition-all"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button className="px-5 py-3.5 rounded-xl flex items-center gap-2 text-[13px] font-medium" style={{ backgroundColor: "#14b8a6", color: "#07090f" }}>
                <Filter size={14} /> Filter
              </button>
            </div>
            {query && (
              <p className="text-[12px] text-white/40 mt-3">
                {hasResults ? (
                  <>Showing results for <span className="text-[#14b8a6] font-medium">&ldquo;{query}&rdquo;</span></>
                ) : (
                  <>No matches for <span className="text-white font-medium">&ldquo;{query}&rdquo;</span></>
                )}
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register?sector=procurement" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(20,184,166,0.2)]" style={{ backgroundColor: "#14b8a6", color: "#07090f" }}>Start Selling <ArrowRight size={14} /></Link>
            <Link href="/register?sector=procurement" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>Register as Buyer</Link>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "#12121a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: Shield, label: "680+ Verified Suppliers", desc: "KYC completed" },
              { icon: Clock, label: "24-Hour Settlement", desc: "Via embedded factoring" },
              { icon: FileCheck, label: "ETA Compliant", desc: "Auto-generated invoices" },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-3">
                <b.icon size={16} style={{ color: "#14b8a6" }} />
                <div>
                  <p className="text-[11px] font-medium text-white/60">{b.label}</p>
                  <p className="text-[9px] text-white/25">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Showcase — Visual Hero */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(20,184,166,0.04) 0%, transparent 60%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2">Trending Products</h2>
              <p className="text-[13px] text-white/40">Sample of what hotels are ordering this week</p>
            </div>
            <Link href="/register?sector=procurement" className="text-[12px] font-medium text-[#14b8a6] hover:underline flex items-center gap-1">View all catalog <ArrowRight size={12} /></Link>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {filteredProducts.map((p) => (
                <div key={p.name} className="group rounded-xl overflow-hidden border transition-all hover:border-white/20 hover:scale-[1.02] cursor-pointer" style={{ backgroundColor: "#12121a", borderColor: "rgba(255,255,255,0.06)" }}>
                  <div className="relative h-32 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500" />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(20,184,166,0.15)", color: "#14b8a6" }}>{p.category}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="text-[11px] font-medium text-white mb-1 leading-tight">{p.name}</h4>
                    <p className="text-[10px] text-white/30 mb-1.5">{p.supplier}</p>
                    <p className="text-[12px] font-semibold text-[#14b8a6]">{p.price}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-white/30 py-8 text-center">No products match your search.</p>
          )}
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16" style={{ backgroundColor: "#12121a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-6">Product Categories</h2>
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {filteredCategories.map((cat) => (
                <div key={cat.name} className="group relative rounded-xl overflow-hidden border cursor-pointer transition-all hover:scale-[1.02] hover:border-white/20" style={{ borderColor: `${cat.color}33` }}>
                  <img src={cat.image} alt={cat.name} className="w-full h-32 object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c12] via-[#0c0c12]/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="text-[13px] font-semibold mb-0.5" style={{ color: cat.color }}>{cat.name}</h3>
                    <p className="text-[10px] text-white/30 leading-tight mb-1">{cat.desc}</p>
                    <p className="text-[10px] font-medium" style={{ color: cat.color }}>{cat.count}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-white/30 py-8 text-center">No categories match your search.</p>
          )}
        </div>
      </section>

      {/* Featured Suppliers */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-6">Featured Suppliers</h2>
          {filteredSuppliers.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredSuppliers.map((s) => (
                <div key={s.name} className="group rounded-xl overflow-hidden transition-all hover:border-[#14b8a6]/20" style={{ backgroundColor: "#12121a", border: "1px solid rgba(255,255,255,0.06)" }}>
                  {s.products.length > 0 && (
                    <div className="flex gap-0.5 h-16 overflow-hidden">
                      {s.products.map((img, i) => (
                        <img key={i} src={img} alt="" className="flex-1 h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity" />
                      ))}
                    </div>
                  )}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={s.avatar} alt={s.name} className="w-10 h-10 rounded-lg object-cover" style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-[13px] font-medium text-white">{s.name}</h3>
                          {s.verified && <Shield size={12} style={{ color: "#14b8a6" }} />}
                        </div>
                        <p className="text-[11px] text-white/30">{s.category} · {s.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <p className="text-[13px] font-medium text-white/70">{s.rating}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13px] text-white/30 py-8 text-center">No suppliers match your search.</p>
          )}
        </div>
      </section>

      {/* Supplier Features */}
      <section className="py-16" style={{ backgroundColor: "#12121a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8 text-center">Why Suppliers Choose HotelsVendors</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {supplierFeatures.map((f) => (
              <div key={f.title} className="rounded-xl p-6 transition-all hover:border-[#14b8a6]/20" style={{ backgroundColor: "#12121a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <f.icon size={20} className="mb-4" style={{ color: "#14b8a6" }} />
                <h3 className="text-[14px] font-medium text-white mb-2">{f.title}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8 text-center">How Procurement Works</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "01", title: "Upload & List", desc: "Upload your catalog with fixed prices. Set per-hotel or per-group pricing. Go live in under 48 hours.", icon: Upload },
              { step: "02", title: "Receive & Fulfill", desc: "Hotels place orders directly. PO routes through their authority matrix. You confirm and ship.", icon: ShoppingCart },
              { step: "03", title: "Invoice & Get Paid", desc: "ETA-compliant invoice auto-generated. Three-way match verified. Factoring settles in 24 hours.", icon: Banknote },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(20,184,166,0.08)" }}>
                  <item.icon size={20} style={{ color: "#14b8a6" }} />
                </div>
                <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">Step {item.step}</span>
                <h3 className="text-[14px] font-medium text-white mt-1 mb-2">{item.title}</h3>
                <p className="text-[12px] text-white/30 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-medium mb-4 text-white">Ready to Sell to Egypt&apos;s Top Hotels?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Join 680+ suppliers already transacting on HotelsVendors. Get paid in 24 hours, not 90.</p>
          <Link href="/register?sector=procurement" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(20,184,166,0.2)]" style={{ backgroundColor: "#14b8a6", color: "#07090f" }}>
            Register as Supplier <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default function MarketplaceClient() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: "#0c0c12", minHeight: "100vh" }} />}>
      <MarketplaceContent />
    </Suspense>
  );
}
