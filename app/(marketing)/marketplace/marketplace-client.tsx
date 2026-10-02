"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Building2, CheckCircle2, Search, ShieldCheck, Truck, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description?: string;
  category: string;
  unitPrice: number;
  unitOfMeasure: string;
  images?: string | string[];
  supplier?: { id: string; name: string; city?: string; tier?: string };
}

const categories = [
  { name: "Food & Beverage", short: "F&B", desc: "Food, beverage and kitchen supply", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=85" },
  { name: "Housekeeping", short: "Housekeeping", desc: "Chemicals, consumables and operating supplies", image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=1200&q=85" },
  { name: "Guest Experience", short: "Guest", desc: "Amenities, linens and room essentials", image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1200&q=85" },
  { name: "FF&E", short: "FF&E", desc: "Furniture, fixtures and capital equipment", image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=1200&q=85" },
];

function formatPrice(price: number) {
  return `EGP ${price.toLocaleString("en-EG")}`;
}

function imageForProduct(p: Product) {
  const raw = Array.isArray(p.images) ? p.images[0] : p.images;
  return raw || categories.find(c => c.name.toLowerCase().includes(p.category.toLowerCase()))?.image || categories[0].image;
}

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/products?limit=100")
      .then(r => r.ok ? r.json() : null)
      .then(json => setProducts(json?.success ? (json.data?.data ?? []) : []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const q = query.trim().toLowerCase();
  const filtered = useMemo(() => !q ? products : products.filter(p =>
    [p.name, p.description, p.category, p.supplier?.name].filter(Boolean).some(v => String(v).toLowerCase().includes(q))
  ), [products, q]);

  return (
    <main className="min-h-screen bg-[#F7F8FA] text-[#0F172A]">
      <section className="relative overflow-hidden border-b border-[#E2E8F0] bg-white pt-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,rgba(37,99,235,.09),transparent_35%)]" />
        <div className="relative mx-auto grid max-w-[1240px] gap-12 px-5 pb-16 md:px-8 lg:grid-cols-[.9fr_1.1fr] lg:items-end lg:pb-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.18em] text-[#2563EB]"><span className="h-1.5 w-1.5 rounded-full bg-[#0D9488]" /> Hospitality marketplace</div>
            <h1 className="max-w-3xl text-[clamp(40px,6vw,68px)] font-semibold leading-[.98] tracking-[-.055em]">Buy the supply your hotel actually needs.</h1>
            <p className="mt-6 max-w-xl text-[16px] leading-7 text-[#596579]">A procurement layer for verified hospitality supply — organized by category, supplier and buying need. Live inventory is shown only when it is actually published.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/rfq" className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(37,99,235,.16)] hover:bg-[#1D4ED8]">Request a quote <ArrowRight size={15} /></Link>
              <Link href="/become-supplier" className="inline-flex items-center gap-2 rounded-xl border border-[#CBD5E1] bg-white px-5 py-3 text-sm font-semibold hover:bg-[#F1F5F9]">List your supply</Link>
            </div>
          </div>
          <div className="rounded-[26px] border border-[#DDE3EC] bg-[#0D1420] p-3 shadow-[0_24px_70px_rgba(15,23,42,.14)]">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {categories.map(c => <div key={c.short} className="group relative aspect-[1.15] overflow-hidden rounded-2xl">
                <img src={c.image} alt={c.name} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07101C] via-[#07101C]/25 to-transparent" />
                <div className="absolute inset-x-3 bottom-3"><span className="text-[11px] font-semibold text-white">{c.short}</span><p className="mt-0.5 text-[9px] leading-4 text-[#C8D1DD]">{c.desc}</p></div>
              </div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E2E8F0] bg-[#F8FAFC] py-5">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-8 gap-y-3 px-5 text-[11px] text-[#596579] md:px-8">
          <span className="inline-flex items-center gap-2"><ShieldCheck size={14} className="text-[#0D9488]" /> Supplier verification</span>
          <span className="inline-flex items-center gap-2"><CheckCircle2 size={14} className="text-[#0D9488]" /> Evidence-linked procurement</span>
          <span className="inline-flex items-center gap-2"><Truck size={14} className="text-[#2563EB]" /> Carrier-aware delivery</span>
          <span className="inline-flex items-center gap-2"><Building2 size={14} className="text-[#2563EB]" /> Hotel buying workflows</span>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-5 py-14 md:px-8 md:py-18">
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div><p className="text-[10px] font-semibold uppercase tracking-[.18em] text-[#64748B]">Live supplier inventory</p><h2 className="mt-2 text-2xl font-semibold tracking-[-.03em]">Published products, not demo cards.</h2><p className="mt-2 text-sm text-[#64748B]">{loading ? "Checking the live catalog…" : `${filtered.length} published product${filtered.length === 1 ? "" : "s"} currently available.`}</p></div>
          <div className="relative w-full md:w-[360px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={16} />
            <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search products or suppliers" className="h-11 w-full rounded-xl border border-[#CBD5E1] bg-white pl-11 pr-10 text-sm outline-none focus:border-[#2563EB]" />
            {query && <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]"><X size={15} /></button>}
          </div>
        </div>

        {filtered.length > 0 ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.slice(0, 24).map(p => <article key={p.id} className="overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_8px_30px_rgba(15,23,42,.05)]">
            <div className="aspect-[4/3] overflow-hidden bg-[#F1F5F9]"><img src={imageForProduct(p)} alt={p.name} className="h-full w-full object-cover" /></div>
            <div className="p-4"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#2563EB]">{p.category}</p><h3 className="mt-2 line-clamp-2 text-sm font-semibold">{p.name}</h3><p className="mt-1 text-[11px] text-[#64748B]">{p.supplier?.name || "Verified supplier"}</p><p className="mt-3 text-sm font-semibold">{formatPrice(p.unitPrice)} <span className="font-normal text-[#94A3B8]">/ {p.unitOfMeasure}</span></p></div>
          </article>)}
        </div> : <div className="rounded-[24px] border border-dashed border-[#CBD5E1] bg-white px-6 py-14 text-center">
          <p className="text-lg font-semibold">No published inventory to show yet.</p>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-[#64748B]">HotelsVendors does not fill the marketplace with fabricated products. Suppliers publish real catalog inventory, and those records appear here.</p>
          <div className="mt-6 flex justify-center gap-3"><Link href="/become-supplier" className="rounded-xl bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white">Become a supplier</Link><Link href="/rfq" className="rounded-xl border border-[#CBD5E1] px-5 py-3 text-sm font-semibold">Request supply</Link></div>
        </div>}
      </section>

      <section className="border-t border-[#E2E8F0] bg-white py-14">
        <div className="mx-auto max-w-[1240px] px-5 md:px-8"><div className="grid gap-4 md:grid-cols-4">{categories.map(c => <Link key={c.name} href={`/categories?q=${encodeURIComponent(c.short)}`} className="group overflow-hidden rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]"><div className="aspect-[16/9] overflow-hidden"><img src={c.image} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div><div className="p-4"><h3 className="font-semibold">{c.name}</h3><p className="mt-1 text-xs leading-5 text-[#64748B]">{c.desc}</p><span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#2563EB]">Explore <ArrowRight size={13} /></span></div></Link>)}</div></div>
      </section>
    </main>
  );
}

export default function MarketplaceClient() { return <Suspense fallback={<div className="min-h-screen bg-[#F7F8FA]" />}><MarketplaceContent /></Suspense>; }
