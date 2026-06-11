import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search, Filter, ShoppingCart, FileCheck, Truck, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Marketplace — B2B Procurement Catalog | HotelsVendors",
  description: "Browse verified suppliers across F&B, consumables, FF&E, guest supplies, and services. Fixed-price catalogs with ETA-compliant invoicing.",
};

const categories = [
  { name: "F&B", desc: "Food, beverages, kitchen equipment", count: "2,400+ SKUs", color: "#39FF14" },
  { name: "Consumables", desc: "Housekeeping, chemicals, linens, toiletries", count: "1,800+ SKUs", color: "#22C55E" },
  { name: "Guest Supplies", desc: "Amenities, room accessories, FF&E", count: "950+ SKUs", color: "#3B82F6" },
  { name: "FF&E", desc: "Furniture, fixtures, capital equipment", count: "620+ SKUs", color: "#D4A843" },
  { name: "Services", desc: "Maintenance, pest control, laundry, security", count: "340+ vendors", color: "#A855F7" },
];

const suppliers = [
  { name: "Nile Fresh Produce", category: "F&B", rating: 4.9, location: "Cairo", verified: true },
  { name: "Red Sea Linen Co.", category: "Consumables", rating: 4.8, location: "Hurghada", verified: true },
  { name: "Oasis Amenities", category: "Guest Supplies", rating: 4.7, location: "Sharm El-Sheikh", verified: true },
  { name: "Egyptian Kitchen Supply", category: "FF&E", rating: 4.9, location: "Alexandria", verified: true },
  { name: "Coastal Maintenance Group", category: "Services", rating: 4.6, location: "Hurghada", verified: true },
  { name: "Pharaoh Chemicals", category: "Consumables", rating: 4.8, location: "Cairo", verified: true },
];

export default function MarketplacePage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(57,255,20,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Marketplace</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            Verified Suppliers.<br /><span className="text-gradient-lime">Fixed-Price Catalogs.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed mb-8">
            Browse 6,000+ SKUs across 5 product categories from verified suppliers. Every order is ETA-compliant, budget-enforced, and logistics-optimized.
          </p>
          <div className="max-w-2xl mb-8">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="text" placeholder="Search products, suppliers, or categories..." className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-[#39FF14]/60 transition-all" />
              </div>
              <button className="px-5 py-3.5 rounded-xl flex items-center gap-2 text-[13px] font-medium" style={{ backgroundColor: "#39FF14", color: "#000000" }}>
                <Filter size={14} /> Filter
              </button>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>Start Ordering <ArrowRight size={14} /></Link>
            <Link href="/become-supplier" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>Become a Supplier</Link>
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-6">Product Categories</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {categories.map((cat) => (
              <div key={cat.name} className="rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02]" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: cat.color + "15" }}>
                  <ShoppingCart size={16} style={{ color: cat.color }} />
                </div>
                <h3 className="text-[14px] font-medium text-white mb-1">{cat.name}</h3>
                <p className="text-[11px] text-white/30 mb-2">{cat.desc}</p>
                <p className="text-[10px] font-medium" style={{ color: cat.color }}>{cat.count}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-6">Featured Suppliers</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {suppliers.map((s) => (
              <div key={s.name} className="rounded-xl p-5 flex items-center justify-between" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(57,255,20,0.08)" }}>
                    <span className="text-[12px] font-medium text-[#39FF14]">{s.name.charAt(0)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-medium text-white">{s.name}</h3>
                      {s.verified && <Shield size={12} style={{ color: "#39FF14" }} />}
                    </div>
                    <p className="text-[11px] text-white/30">{s.category} · {s.location}</p>
                  </div>
                </div>
                <p className="text-[13px] font-medium text-white/70">★ {s.rating}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-8 text-center">How Procurement Works</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {[
              { step: "01", title: "Browse & Order", desc: "Search catalogs, compare prices, add to cart. AI suggests optimal quantities based on your occupancy forecast.", icon: Search },
              { step: "02", title: "Approve & Invoice", desc: "PO routes through your authority matrix. Supplier issues ETA-compliant invoice with cryptographic signature.", icon: FileCheck },
              { step: "03", title: "Deliver & Settle", desc: "Shared-route delivery in 48hrs. Three-way matching auto-verifies GRN. Factoring settles in 24hrs.", icon: Truck },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(57,255,20,0.08)" }}>
                  <item.icon size={20} style={{ color: "#39FF14" }} />
                </div>
                <span className="text-[10px] font-medium text-white/25 uppercase tracking-wider">Step {item.step}</span>
                <h3 className="text-[14px] font-medium text-white mt-1 mb-2">{item.title}</h3>
                <p className="text-[12px] text-white/30 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-medium mb-4 text-white">Ready to Source Smarter?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Join 680+ hotels and suppliers already transacting on HotelsVendors.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>
            Request Enterprise Access <ArrowRight size={14} />
          </Link>
        </div>
      </section>
    </main>
  );
}
