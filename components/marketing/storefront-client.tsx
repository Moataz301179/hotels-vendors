"use client";

/* Marketplace — the categorized procurement catalog cover page.
   Top: category cover-photo grid (click a cover → that category).
   Below: smart search + sidebar (categories/subcategories) + product grid.
   Real data only (/api/v1/products); honest empty states. NO fake rows/photos.
   A product thumbnail only ever shows its real supplier image or a neutral
   placeholder — never a hallucinated stock photo. */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, Truck, Package, ChevronRight, Layers, RefreshCw, Loader2, MapPin, LayoutGrid } from "lucide-react";
import { HOTEL_CATEGORIES } from "@/lib/marketplace/categories";
import { CATEGORY_COVERS } from "@/lib/marketplace/covers";
import { getHotelCategoryFromMarketplace } from "@/lib/marketplace/category-mapper";
import { scoreProduct, suggestCompletions, complementaryKeywords, alternativeKeywords, comparePrices } from "@/lib/storefront/commerce";
import { quoteDelivery } from "@/lib/storefront/shipping";

interface Product {
  id: string; name: string; description?: string; category: string; subcategory?: string;
  unitPrice: number; unitOfMeasure: string; minOrderQuantity?: number; images?: string | string[];
  inStock?: boolean; supplier?: { id: string; name: string; city?: string; tier?: string; rating?: number };
}

function realImage(images?: string | string[]): string {
  if (!images) return "";
  const list = Array.isArray(images) ? images : String(images).split(",");
  for (const it of list) { const s = String(it ?? "").trim(); if (/^https?:\/\//.test(s)) return s; }
  return "";
}

/* Map a product's canonical (lowercase) marketplace category to its display label. */
function categoryLabel(category?: string): string {
  if (!category) return "General";
  const match = getHotelCategoryFromMarketplace(category.toLowerCase());
  return match?.label ?? category.replace(/_/g, " ");
}

export function StorefrontClient({ initialCategory }: { initialCategory?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCat, setActiveCat] = useState<string>(() =>
    initialCategory && HOTEL_CATEGORIES.some((c) => c.code === initialCategory) ? initialCategory : "ALL"
  );
  const [activeSub, setActiveSub] = useState<string>("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);

  async function load() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/v1/products?limit=200");
      const d = await res.json();
      if (d.success) setProducts(d.data?.products || []);
      else setError(d.error || "Could not load catalog.");
    } catch { setError("Could not load catalog."); } finally { setLoading(false); }
  }
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/products?limit=200");
        const d = await res.json();
        if (cancelled) return;
        if (d.success) setProducts(d.data?.products || []);
        else setError(d.error || "Could not load catalog.");
      } catch {
        if (!cancelled) setError("Could not load catalog.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const nameIndex = useMemo(() => products.map((p) => p.name), [products]);
  const suggestionIndex = useMemo(() => suggestCompletions(search, nameIndex, 8), [search, nameIndex]);

  const filtered = useMemo(() => {
    let list = products;
    if (search.trim()) {
      const scored = products
        .map((p) => ({ p, s: scoreProduct(search, { name: p.name, description: p.description, category: p.category }) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s)
        .map((x) => x.p);
      return scored;
    }
    if (activeCat !== "ALL") {
      const cat = HOTEL_CATEGORIES.find((c) => c.code.toLowerCase() === activeCat.toLowerCase());
      const codes = cat ? [cat.code, ...cat.keywords.map((k) => k), cat.label] : [activeCat];
      list = list.filter((p) => codes.some((x) => { const c = (p.category || "").toLowerCase(); const xl = x.toLowerCase(); return c.includes(xl) || (p.name && p.name.toLowerCase().includes(xl)); }));
    }
    if (activeSub !== "ALL") list = list.filter((p) => (p.subcategory || p.name || "").toLowerCase().includes(activeSub.toLowerCase()) || (p.name || "").toLowerCase().includes(activeSub.toLowerCase()));
    return list;
  }, [products, search, activeCat, activeSub]);

  const cat = activeCat === "ALL" ? null : HOTEL_CATEGORIES.find((c) => c.code === activeCat);

  /* Storefront-level smart sections for the selected product */
  const comps = selected ? complementaryKeywords([selected.category, selected.name], selected.name) : [];
  const alts = selected ? alternativeKeywords(selected.name) : [];

  const offers = selected
    ? products.filter((p) => p.name.toLowerCase().includes(selected.name.split(" ").slice(0, 2).join(" ").toLowerCase())).map((p) => ({ supplierId: p.supplier?.id || p.id, supplierName: p.supplier?.name || "Supplier", unitPrice: p.unitPrice, unitOfMeasure: p.unitOfMeasure, city: p.supplier?.city }))
    : [];
  const priceCmp = comparePrices(offers);

  const [shipCity, setShipCity] = useState("Cairo");
  const ship = selected ? quoteDelivery(shipCity, 1, 2, "EXPRESS") : null;

  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-[10px] font-semibold uppercase tracking-widest text-[#8a6d3b] mb-1 flex items-center gap-1.5"><LayoutGrid size={12} /> Marketplace</div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">Everything a hotel buys, in one catalog</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">Browse by category. Real supplier SKUs, smart search, cross-vendor pricing, and delivery to your property.</p>
          </div>
          <div className="relative md:w-96">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search… try 'towels', 'shampoo', 'linen'"
              className="w-full border border-slate-300 focus:ring-2 focus:ring-[#314B43] rounded-lg pl-9 pr-10 py-2.5 text-sm bg-white text-slate-900"
            />
            {suggestionIndex.length > 0 && search.trim() && (
              <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow z-20 overflow-hidden">
                {suggestionIndex.map((s) => (
                  <button key={s} onClick={() => setSearch(s)} className="block w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50">{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Category cover-photo grid — the cover page. Click a category cover to enter it. */}
        {!search.trim() && (
          <div className="mb-10">
            <div className="flex items-baseline justify-between mb-4">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1.5"><Layers size={12} /> Browse by category</div>
              </div>
              <Link href="/categories" className="text-xs font-semibold text-[#314B43] hover:underline">View all categories →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {CATEGORY_COVERS.map((c) => {
                const isActive = activeCat === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => { setActiveCat(isActive ? "ALL" : c.code); setActiveSub("ALL"); }}
                    className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 text-left ${isActive ? "border-[#314B43]" : "border-slate-200 hover:border-[#314B43]/40"} transition-all shadow-sm hover:shadow-md`}
                  >
                    <img src={c.img} alt={c.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/25 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3">
                      <div className="text-white text-[13px] font-semibold drop-shadow leading-tight">{c.label}</div>
                      <div className="text-[10px] text-slate-200/90 mt-1 leading-snug line-clamp-2">{c.blurb}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6">
          {/* Sidebar — categories + subcategories */}
          <aside className="bg-white border border-slate-200 rounded-xl p-4 self-start lg:sticky lg:top-6">
            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5"><Layers size={12} /> Categories</div>
            <button onClick={() => { setActiveCat("ALL"); setActiveSub("ALL"); }} className={`w-full text-left text-sm px-3 py-2 rounded-lg mb-1 ${activeCat === "ALL" ? "bg-[#314B43] text-white" : "text-slate-700 hover:bg-slate-50"}`}>
              All Products <span className={activeCat === "ALL" ? "text-slate-300" : "text-slate-400"}>({products.length})</span>
            </button>
            {HOTEL_CATEGORIES.map((c) => {
              const real = products.filter((p) => (p.category || "").toLowerCase().includes(c.code.toLowerCase()) || (p.name || "").toLowerCase().includes(c.label.toLowerCase()));
              const isActive = activeCat === c.code;
              return (
                <div key={c.id} className="mb-0.5">
                  <button onClick={() => { setActiveCat(isActive ? "ALL" : c.code); setActiveSub("ALL"); }} className={`w-full text-left text-sm px-3 py-2 rounded-lg flex items-center justify-between ${isActive ? "bg-[#314B43] text-white" : "text-slate-700 hover:bg-slate-50"}`}>
                    <span>{c.label}</span>
                    <span className={isActive ? "text-slate-300 text-xs" : "text-slate-400 text-xs"}>{real.length || 0}</span>
                  </button>
                  {isActive && (
                    <div className="pl-3 mt-1 space-y-0.5">
                      {["ALL", ...c.examples].map((sub) => (
                        <button key={sub} onClick={() => setActiveSub(sub)} className={`block w-full text-left text-xs px-2 py-1 rounded ${activeSub === sub ? "text-[#314B43] font-semibold" : "text-slate-500 hover:text-slate-700"}`}>
                          {sub === "ALL" ? "All in " + c.label : sub}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </aside>

          {/* Main */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex items-center justify-center py-24"><Loader2 size={28} className="animate-spin text-[#314B43]" /></div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">{error} <button onClick={load} className="inline-flex items-center gap-1 ml-2 font-semibold"><RefreshCw size={12} /> Retry</button></div>
            ) : products.length === 0 ? (
              <div className="bg-white border border-dashed border-slate-300 rounded-xl p-16 text-center">
                <Package size={32} className="mx-auto text-slate-300 mb-3" />
                <p className="text-sm text-slate-600 font-semibold">Catalog is populating.</p>
                <p className="text-xs text-slate-400 mt-1">Connect a supplier source or run an ingestion to see live products here. No fake listings — only real supplier catalog.</p>
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                  <Link href="/ai-catalog" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-[#314B43] text-white rounded-lg hover:opacity-95 transition-opacity">
                    Explore the AI Catalog <ChevronRight className="w-4 h-4" />
                  </Link>
                  <Link href="/suppliers/join" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#314B43] border border-[#314B43]/30 rounded-lg bg-white hover:bg-slate-50 transition-colors">
                    Register your supplier catalog
                  </Link>
                </div>
              </div>
            ) : (
              <>
                {/* Selected product smart panel */}
                {selected && (
                  <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-slate-50">
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Product intelligence</span>
                      <button onClick={() => setSelected(null)} className="text-xs text-slate-400 hover:text-slate-700">✕ close</button>
                    </div>
                    <div className="p-5 grid lg:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{selected.name}</h3>
                        <p className="text-3xl font-bold text-emerald-700 mt-1">EGP {selected.unitPrice.toLocaleString()} <span className="text-sm text-slate-400 font-normal">/{selected.unitOfMeasure}</span></p>
                        {selected.supplier?.name && <p className="text-xs text-slate-500 mt-2">Supplier: {selected.supplier.name}{selected.supplier.city ? ` · ${selected.supplier.city}` : ""}</p>}
                        {comps.length > 0 && <div className="mt-4"><div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Often bought together</div><div className="flex flex-wrap gap-1.5">{comps.map((c) => <span key={c} className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">{c}</span>)}</div></div>}
                        {alts.length > 0 && <div className="mt-3"><div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Alternatives / replacements</div><div className="flex flex-wrap gap-1.5">{alts.map((a) => <span key={a} className="text-xs px-2 py-1 rounded bg-amber-50 text-amber-800 border border-amber-200">{a}</span>)}</div></div>}
                      </div>
                      <div className="space-y-4">
                        {priceCmp.offers.length > 0 && (
                          <div>
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1.5">Compare across {priceCmp.offers.length} supplier{priceCmp.offers.length > 1 ? "s" : ""}</div>
                            <div className="space-y-1">
                              {priceCmp.offers.slice(0, 4).map((o, i) => (
                                <div key={i} className="flex items-center justify-between text-xs border border-slate-200 rounded-lg px-3 py-2">
                                  <span className="text-slate-700">{o.supplierName}{o.city ? ` · ${o.city}` : ""}</span>
                                  <span className="font-semibold text-slate-900">EGP {o.unitPrice.toLocaleString()}</span>
                                </div>
                              ))}
                            </div>
                            {priceCmp.lowest && <p className="text-[11px] text-emerald-700 mt-1.5 font-medium">Lowest: {priceCmp.lowest.supplierName} — EGP {priceCmp.lowest.unitPrice.toLocaleString()}</p>}
                          </div>
                        )}
                        {ship && (
                          <div className="border border-slate-200 rounded-lg p-3">
                            <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2 flex items-center gap-1.5"><Truck size={12} /> Deliver to hotel</div>
                            <select value={shipCity} onChange={(e) => setShipCity(e.target.value)} className="w-full text-xs border border-slate-300 rounded-lg px-2.5 py-2 bg-white mb-2">
                              {["Cairo", "Giza", "Alexandria", "Hurghada", "Sharm El Sheikh", "El Gouna", "North Coast", "Marsa Alam"].map((c) => <option key={c}>{c}</option>)}
                            </select>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-slate-500 flex items-center gap-1"><MapPin size={11} /> {ship.corridor}</span>
                              <span className="font-bold text-slate-900">EGP {ship.estimatedCostEGP.toLocaleString()}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">{ship.etaText}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Product grid */}
                <div className="text-xs text-slate-500 mb-2">{filtered.length} product{filtered.length !== 1 ? "s" : ""} · {cat ? cat.label : "All categories"}</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {filtered.slice(0, 60).map((p) => {
                    const img = realImage(p.images);
                    return (
                      <button key={p.id} onClick={() => setSelected(p)} className="text-left group bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 hover:shadow-sm transition-all">
                        <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100 relative">
                          {img ? <img src={img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center"><Package size={28} className="text-slate-300" /></div>}
                          <span className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full bg-[#3a544a]/80 text-slate-100">{categoryLabel(p.category)}</span>
                        </div>
                        <div className="p-3">
                          <h4 className="text-[13px] font-semibold text-slate-900 line-clamp-1">{p.name}</h4>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-sm font-bold text-emerald-700">EGP {p.unitPrice.toLocaleString()}</span>
                            <span className="text-[10px] text-slate-400">/{p.unitOfMeasure}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {filtered.length === 0 && <div className="bg-white border border-dashed border-slate-300 rounded-xl p-10 text-center text-sm text-slate-500">No products match this filter yet — catalog grows as suppliers connect.</div>}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}