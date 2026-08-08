"use client";

/* /categories — Category Hubs
   Real-data catalog hub grid. NO fabricated SKU / supplier / price counts anywhere.
   Product counts are computed live on mount from GET /api/v1/products?limit=200,
   grouped by each returned product's real `category`. If the catalog is empty we
   render an honest empty state instead of inventing numbers. */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Bath,
  BedDouble,
  Boxes,
  CircleDollarSign,
  Droplets,
  FileCheck2,
  Layers,
  Loader2,
  RefreshCw,
  Shirt,
  Sofa,
  Sparkles,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";

interface Hub {
  code: string; // marketplace category code for the Browse link
  hubKey: string; // canonical read category that real products come back under
  name: string;
  blurb: string;
  icon: typeof Shirt;
  img: string;
}

const CATEGORIES: Hub[] = [
  {
    code: "LIN",
    hubKey: "gra",
    name: "Linens",
    blurb: "Bed sheets, towels, duvet covers and table linen — hospitality-grade textiles.",
    icon: Shirt,
    img: "https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=900&auto=format&fit=crop",
  },
  {
    code: "GRA",
    hubKey: "gra",
    name: "Bathroom",
    blurb: "Vanity towels, bath and shower essentials, fixtures and guest bathroom supplies.",
    icon: Bath,
    img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=900&auto=format&fit=crop",
  },
  {
    code: "FB",
    hubKey: "fb",
    name: "Commercial Kitchen",
    blurb: "Ovens, cold rooms, gastronorm, cookware and back-of-house kitchen equipment.",
    icon: UtensilsCrossed,
    img: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=900&auto=format&fit=crop",
  },
  {
    code: "HK",
    hubKey: "ose",
    name: "Cleaning & Chemicals",
    blurb: "Hotel-grade disinfectants, detergents, carts and housekeeping operational supplies.",
    icon: Sparkles,
    img: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=900&auto=format&fit=crop",
  },
  {
    code: "FFE",
    hubKey: "ffe",
    name: "Furniture",
    blurb: "Beds, desks, lobby sofas, casegoods and full furniture, fixtures & equipment.",
    icon: Sofa,
    img: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=900&auto=format&fit=crop",
  },
  {
    code: "ENG",
    hubKey: "eng",
    name: "HVAC / Engineering",
    blurb: "HVAC parts, electrical, plumbing, tools and MEP spare parts for hotel ops.",
    icon: Wrench,
    img: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?q=80&w=900&auto=format&fit=crop",
  },
  {
    code: "LIN",
    hubKey: "gra",
    name: "Bedding",
    blurb: "Duvets, pillows, mattress protectors and sleep accessories for guest rooms.",
    icon: BedDouble,
    img: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?q=80&w=900&auto=format&fit=crop",
  },
  {
    code: "SPA",
    hubKey: "gra",
    name: "Pool & Spa",
    blurb: "Pool and spa towels, chemicals, loungers and wellness recreation supplies.",
    icon: Droplets,
    img: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?q=80&w=900&auto=format&fit=crop",
  },
];

const SAVINGS_ANGLES = [
  {
    icon: Layers,
    title: "Consolidated catalogs",
    desc: "One source for every line your property buys — fewer vendors to manage.",
  },
  {
    icon: CircleDollarSign,
    title: "Bulk pricing",
    desc: "Aggregated, transparent unit pricing across suppliers for every order.",
  },
  {
    icon: FileCheck2,
    title: "Less admin",
    desc: "RFQs, invoicing and ETA compliance automated — procurement overhead shrinks.",
  },
];

interface RawProduct {
  category?: string;
}

export default function CategoriesPage() {
  const [products, setProducts] = useState<RawProduct[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Reset loading + error when the user asks for a fresh fetch (handler, not effect).
  const retry = () => {
    setLoading(true);
    setError(null);
    setReloadKey((k) => k + 1);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/v1/products?limit=200");
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || json?.success === false) {
          throw new Error(json?.error || "Failed to load catalog");
        }
        setProducts(Array.isArray(json?.data?.products) ? json.data.products : []);
        setTotal(typeof json?.data?.pagination?.total === "number" ? json.data.pagination.total : null);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load catalog");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  // Group returned products by their REAL category (lowercase, e.g. "gra", "ose").
  const counts = useMemo(() => {
    const m: Record<string, number> = {};
    for (const p of products) {
      const key = (p.category || "").toLowerCase();
      if (key) m[key] = (m[key] || 0) + 1;
    }
    return m;
  }, [products]);

  const liveTotal: number = total !== null ? total : Object.values(counts).reduce((a, b) => a + b, 0);
  const populatedHubs = CATEGORIES.filter((c) => (counts[c.hubKey] || 0) > 0).length;
  const showEmptyState = !loading && !error && liveTotal === 0;

  const countLabel = (n: number) =>
    n === 1 ? "1 product" : n + " product" + (n === 1 ? "" : "s");

  return (
    <main className="bg-slate-50 min-h-screen pt-16">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        {/* ── Premium header ── */}
        <header className="mb-10">
          <div className="text-[11px] font-semibold uppercase tracking-widest text-blue-600">
            Category Hubs
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-slate-900 mt-2" style={{ lineHeight: 1.1 }}>
            Everything a hotel buys, in one catalog
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-3 max-w-2xl leading-relaxed">
            One consolidated catalog for every line your property buys — transparent bulk pricing
            across suppliers, and less back-office admin, so procurement cuts cost instead of chasing it.
          </p>

          {/* Live catalog signal */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            {loading ? (
              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Counting live products…
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                {liveTotal > 0 ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    {liveTotal} live product{liveTotal === 1 ? "" : "s"} across {populatedHubs} active hub{populatedHubs === 1 ? "" : "s"}
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-slate-300" />
                    Catalog currently empty — populated from live supplier data
                  </>
                )}
              </span>
            )}
            {error && (
              <button
                onClick={retry}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Retry load
              </button>
            )}
          </div>
        </header>

        {/* ── Honest empty state (never fabricated numbers) ── */}
        {showEmptyState && (
          <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-10 mb-10 flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
              <Boxes className="w-6 h-6 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-1.5">Catalog is warming up</h2>
            <p className="text-slate-600 text-sm max-w-xl leading-relaxed">
              Catalog populating as suppliers connect — run an ingestion to see live category hubs.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <Link
                href="/ai-catalog"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Explore the AI Catalog <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/ai-catalog"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-slate-700 border border-slate-300 rounded-lg bg-white hover:bg-slate-50 transition-colors"
              >
                How automated sourcing works
              </Link>
            </div>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center justify-between gap-4">
            <p className="text-sm text-red-700">Couldn&apos;t load the catalog: {error}</p>
            <button
              onClick={retry}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-red-700 hover:text-red-800 shrink-0"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        )}

        {/* ── Category hub cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const count = counts[c.hubKey] || 0;
            return (
              <div
                key={c.code + c.name}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-colors flex flex-col"
              >
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  {loading ? (
                    <div className="w-full h-full bg-slate-100 animate-pulse" />
                  ) : (
                    <Image
                      src={c.img}
                      alt={c.name + " — hospitality supplies"}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-slate-600" />
                        </span>
                        <h3 className="text-sm font-semibold text-slate-900 leading-snug">{c.name}</h3>
                      </div>
                      <div className="text-xs text-slate-500 mt-1.5">
                        {c.blurb}
                      </div>
                    </div>
                  </div>

                  {/* Honest live count */}
                  <div className="mt-3">
                    {count > 0 ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {countLabel(count)} live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        0 products
                      </span>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex-1 flex items-end">
                    <Link
                      href={"/marketplace?category=" + c.code}
                      className="w-full inline-flex items-center justify-center gap-1.5 text-sm font-semibold bg-blue-600 text-white rounded-lg py-2.5 hover:bg-blue-700 transition-colors"
                    >
                      Browse {c.name} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Savings angle ── */}
        <section className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SAVINGS_ANGLES.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="bg-white border border-slate-200 rounded-xl p-5">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}