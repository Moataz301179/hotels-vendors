"use client";

import { useState } from "react";
import { Search, Star, ChevronRight, Package } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

const categories = [
  { code: "FB-001", name: "Food & Beverage", count: 245 },
  { code: "HK-002", name: "Housekeeping", count: 128 },
  { code: "GA-003", name: "Guest Amenities", count: 89 },
  { code: "KE-004", name: "Kitchen Equipment", count: 67 },
  { code: "LU-005", name: "Linen & Uniforms", count: 54 },
  { code: "MT-006", name: "Maintenance", count: 43 },
  { code: "SP-007", name: "SPA & Wellness", count: 31 },
  { code: "TS-008", name: "Technology Systems", count: 23 },
];

const suppliers = [
  { name: "Nile Fresh Foods", cat: "Food & Beverage", rating: 4.8, orders: 1200 },
  { name: "Pyramid Linens", cat: "Linen & Uniforms", rating: 4.9, orders: 890 },
  { name: "Red Sea Amenities", cat: "Guest Amenities", rating: 4.7, orders: 650 },
  { name: "Cairo Kitchen Pro", cat: "Kitchen Equipment", rating: 4.6, orders: 420 },
  { name: "Delta Maintenance", cat: "Maintenance", rating: 4.8, orders: 380 },
  { name: "Oasis Spa Supplies", cat: "SPA & Wellness", rating: 4.5, orders: 210 },
];

export default function MarketplacePage() {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<string | null>(null);

  const filtered = suppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      s.cat.toLowerCase().includes(q.toLowerCase());
    return sel ? s.cat === sel && matchesSearch : matchesSearch;
  });

  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* Hero */}
      <section className="pt-36 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="label-upper mb-3">Marketplace</p>
          <h1 className="text-[32px] md:text-[48px] font-medium text-white leading-[1.1] mb-5">
            B2B Procurement Marketplace
          </h1>
          <p className="text-[13px] text-white/40 max-w-xl mb-6">
            680+ verified suppliers across 8 HS-code categories. AI-powered
            matching connects you with the right vendors.
          </p>
          <div className="max-w-md relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/25"
            />
            <input
              type="text"
              placeholder="Search suppliers or categories..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full surface-input pl-11 pr-4 py-3 text-[13px]"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {categories.map((c) => (
              <button
                key={c.code}
                onClick={() => setSel(sel === c.name ? null : c.name)}
                className="surface-card p-4 text-left transition-all"
                style={
                  sel === c.name
                    ? { borderColor: "var(--invo-base)" }
                    : {}
                }
              >
                <span className="text-[10px] text-white/25">{c.code}</span>
                <p className="text-[13px] font-medium text-white/70 mt-0.5">
                  {c.name}
                </p>
                <p className="text-[10px] text-white/25 mt-1">
                  {c.count} suppliers
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Supplier List */}
      <section className="py-20" style={{ background: "var(--bg-surface-1)" }}>
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-[16px] font-medium text-white/70">
              {sel || "All Suppliers"}
            </h2>
            {sel && (
              <button
                onClick={() => setSel(null)}
                className="text-[11px] text-white/25 hover:text-white/60 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-3">
            {filtered.map((s, i) => (
              <div
                key={i}
                className="surface-card p-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-white/25">
                    <Package size={18} />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-white/70">
                      {s.name}
                    </p>
                    <p className="text-[11px] text-white/25">{s.cat}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden sm:flex items-center gap-1">
                    <Star
                      size={14}
                      className="text-amber-500 fill-amber-500"
                    />
                    <span className="text-[12px] text-white/50">
                      {s.rating}
                    </span>
                  </div>
                  <span className="text-[11px] text-white/25">
                    {s.orders} orders
                  </span>
                  <button className="btn-ghost text-[11px] py-2 px-3">
                    View <ChevronRight size={12} />
                  </button>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-[13px] text-white/25">
                  No suppliers match your search.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
