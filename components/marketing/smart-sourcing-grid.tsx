"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Filter, ArrowRight, CheckCircle2, Sparkles, X } from "lucide-react";

const A = "#FF6B00";
const AM = "rgba(255,107,0,0.08)";
const AB = "rgba(255,107,0,0.25)";
const AG = "rgba(255,107,0,0.15)";
const S1 = "#080B12";
const SC = "#0C1018";
const B1 = "rgba(255,255,255,0.06)";
const BH = "rgba(255,255,255,0.12)";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const CATEGORIES = ["All", "F&B", "Consumables", "Guest Supplies", "FF&E", "Services"];

const ITEMS = [
  { name: "Premium Egyptian Rice (Basmati)", cat: "F&B", price: "EGP 42/kg", min: "500kg", availability: "In Stock", score: 98, supplier: "NileFresh Produce", delivery: "48h to Sharm", tags: ["Halal", "Organic"] },
  { name: "Industrial Pool Chlorine Tablets", cat: "Consumables", price: "EGP 180/kg", min: "50kg", availability: "In Stock", score: 94, supplier: "Pharaoh Chemicals", delivery: "24h to Hurghada", tags: ["Certified"] },
  { name: "Luxury Bath Towels (70x140cm)", cat: "Guest Supplies", price: "EGP 85/unit", min: "200 units", availability: "In Stock", score: 96, supplier: "Red Sea Linen Co.", delivery: "72h to Sharm", tags: ["Egyptian Cotton", "500 GSM"] },
  { name: "Stainless Steel Chafing Dishes", cat: "FF&E", price: "EGP 1,200/unit", min: "10 units", availability: "In Stock", score: 91, supplier: "Oasis FF&E", delivery: "5-7 days", tags: ["304 Grade"] },
  { name: "Fresh Red Sea Seafood Mix", cat: "F&B", price: "EGP 280/kg", min: "200kg", availability: "Pre-order", score: 97, supplier: "Hurghada Fisheries", delivery: "Same day", tags: ["Fresh Catch", "Cold Chain"] },
  { name: "Bulk Shampoo (500ml, Amenities)", cat: "Guest Supplies", price: "EGP 18/unit", min: "1,000 units", availability: "In Stock", score: 93, supplier: "Cleopatra Amenities", delivery: "48h to Cairo", tags: ["Vegan", "Eco"] },
];

export function SmartSourcingGrid() {
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = ITEMS.filter((item) => {
    const matchCat = active === "All" || item.cat === active;
    const matchQuery = !query || item.name.toLowerCase().includes(query.toLowerCase());
    return matchCat && matchQuery;
  });

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: S1 }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
              Smart Sourcing Catalog
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Fixed-Price Catalog.
              <br />
              AI-Powered Discovery.
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
              Every item is pre-negotiated, fixed-price, and ready to order. No bidding. No price surprises. AI matches you to the best supplier automatically.
            </p>
          </div>
        </Reveal>

        {/* Search + Filter */}
        <Reveal>
          <div className="rounded-2xl p-4 mb-6" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search 680+ products..."
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl text-[13px] text-white placeholder:text-white/20 outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${B1}` }}
                />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                    <X size={14} className="text-white/30" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <Filter size={12} className="text-white/20 shrink-0" />
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActive(c)}
                    className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all shrink-0 cursor-pointer"
                    style={{
                      backgroundColor: active === c ? AM : "rgba(255,255,255,0.02)",
                      border: `1px solid ${active === c ? AB : B1}`,
                      color: active === c ? A : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((item, i) => (
            <Reveal key={item.name} delay={i * 0.05}>
              <motion.div
                className="rounded-2xl p-5 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 group"
                style={{ backgroundColor: SC, border: `1px solid ${B1}` }}
                whileHover={{ borderColor: BH }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: AM, color: A }}>
                      {item.cat}
                    </span>
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: item.availability === "In Stock" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)",
                        color: item.availability === "In Stock" ? "#22C55E" : "#EAB308",
                      }}
                    >
                      {item.availability}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles size={10} style={{ color: A }} />
                    <span className="text-[11px] font-bold" style={{ color: A }}>{item.score}</span>
                  </div>
                </div>

                <h3 className="text-[14px] font-semibold text-white/85 mb-1 leading-snug">{item.name}</h3>
                <p className="text-[11px] text-white/30 mb-3">{item.supplier} · {item.delivery}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.tags.map((t) => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.35)" }}>
                      {t}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between" style={{ borderTop: `1px solid ${B1}` }}>
                  <div>
                    <span className="text-[16px] font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{item.price}</span>
                    <span className="text-[10px] text-white/25 ml-1">min {item.min}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: A }}>
                    Add to RFQ <ArrowRight size={11} />
                  </div>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[13px] text-white/30">No items match your filters. Try a different category or search term.</p>
          </div>
        )}

        <Reveal>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 text-[12px] text-white/30">
              <CheckCircle2 size={13} style={{ color: A }} />
              <span>All prices are fixed — no bidding, no hidden fees. Volume discounts applied automatically.</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
