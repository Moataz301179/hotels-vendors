"use client";

import type { Metadata } from "next";
import Link from "next/link";
import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Filter,
  ShoppingCart,
  CheckCircle2,
  Truck,
  Building2,
  ShieldCheck,
  Star,
  ShoppingBag,
  Upload,
  FileCheck,
  Banknote,
  BarChart3,
  Shield,
  ChevronRight,
  Sparkles,
  Clock,
} from "lucide-react";
import useSWR, { mutate } from "swr";
import OlivReferralCTA from "@/components/auth/OlivReferralCTA";
import { transformManyToMarketplace, type MarketplaceProduct } from "@/lib/marketplace/category-mapper";
import { z } from "zod";

export const metadata: Metadata = {
  title: "B2B Hospitality Marketplace Egypt | 680+ Verified Hotel Suppliers | HotelsVendors",
  description: "Egypt's largest B2B hospitality marketplace. 680+ verified suppliers across F&B, consumables, FF&E, guest supplies, and services. Fixed-price catalogs with ETA-compliant invoicing.",
  keywords: ["B2B hospitality procurement Egypt", "hospitality vendor marketplace", "hotel suppliers Egypt", "F&B wholesale Egypt", "FF&E procurement", "تجهيزات الفنادق بالجملة", "موردي الفنادق مصر"],
  openGraph: {
    title: "B2B Hospitality Marketplace Egypt | 680+ Verified Hotel Suppliers | HotelsVendors",
    description: "Egypt's largest B2B hospitality marketplace. 680+ verified suppliers across F&B, consumables, FF&E, guest supplies, and services.",
    type: "website",
  },
};

// API response schema for type safety
const MarketplaceResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({
    products: z.array(z.any()),
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      totalPages: z.number(),
    }),
  }),
});

type MarketplaceApiResponse = z.infer<typeof MarketplaceResponseSchema>;

// Category mapping for filters
const categories = [
  { name: "F&B", desc: "Food, beverages, kitchen equipment", count: "2,400+ SKUs", color: "#39ff7e" },
  { name: "Consumables", desc: "Housekeeping, chemicals, linens, toiletries", count: "1,800+ SKUs", color: "#39ff7e" },
  { name: "Guest Supplies", desc: "Amenities, room accessories, FF&E", count: "950+ SKUs", color: "#64b5f6" },
  { name: "FF&E", desc: "Furniture, fixtures, capital equipment", count: "620+ SKUs", color: "#ff7e1a" },
  { name: "Services", desc: "Maintenance, pest control, laundry, security", count: "340+ vendors", color: "#c455ff" },
];

const priceRanges = [
  { label: "All budgets", value: "all", min: 0, max: Number.POSITIVE_INFINITY },
  { label: "Under 1,000 EGP", value: "under-1000", min: 0, max: 1000 },
  { label: "1,000–5,000 EGP", value: "1000-5000", min: 1000, max: 5000 },
  { label: "5,000–20,000 EGP", value: "5000-20000", min: 5000, max: 20000 },
  { label: "Over 20,000 EGP", value: "over-20000", min: 20000, max: Number.POSITIVE_INFINITY },
];

const availabilityOptions = [
  "All availability",
  "ACTIVE",
  "IN_STOCK",
  "LOW_STOCK",
  "OUT_OF_STOCK",
  "MADE_TO_ORDER",
];

const hotelDepartments = [
  { name: "Housekeeping", subtitle: "Linens, amenities, cleaning supplies", image: "https://images.unsplash.com/photo-1582719478250-896e44ac3c65?auto=format&fit=crop&w=400&q=60" },
  { name: "Food & Beverage", subtitle: "Restaurant equipment, tableware, kitchen tools", image: "https://images.unsplash.com/photo-1582719501478-3995cdbb0bf1?auto=format&fit=crop&w=400&q=60" },
  { name: "Front Office", subtitle: "Guest supplies, lobby furniture, signage", image: "https://images.unsplash.com/photo-1582719513711-17b7fcb31b5a?auto=format&fit=crop&w=400&q=60" },
  { name: "Engineering", subtitle: "Maintenance supplies, tools, replacement parts", image: "https://images.unsplash.com/photo-1582719529407-2d2b7d6bfc33?auto=format&fit=crop&w=400&q=60" },
  { name: "Spa & Wellness", subtitle: "Spa equipment, pool supplies, fitness equipment", image: "https://images.unsplash.com/photo-1582719545047-314f1cb0e2ef?auto=format&fit=crop&w=400&q=60" },
];

// Prisma category to department mapping
const PRISMA_TO_DEPARTMENT: Record<string, string> = {
  F_AND_B: "Food & Beverage",
  CONSUMABLES: "Housekeeping",
  GUEST_SUPPLIES: "Front Office",
  FFE: "Front Office",
  SERVICES: "Engineering",
};

type SortOption = "featured" | "price-asc" | "price-desc" | "rating" | "newest";
type PriceRange = {
  label: string;
  value: string;
  min: number;
  max: number;
};

// Cart context (simple implementation)
interface CartItem {
  productId: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (productId: string, quantity?: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  itemCount: number;
}

const useCart = (): CartContextValue => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("hotelsvendors_cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hotelsvendors_cart", JSON.stringify(items));
  }, [items]);

  const addItem = (productId: string, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setItems([]);

  return {
    items,
    addItem,
    removeItem,
    clearCart,
    itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
  };
};

// Fetcher function for SWR
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MarketplacePage() {
  const [department, setDepartment] = useState("All departments");
  const [category, setCategory] = useState("All categories");
  const [availability, setAvailability] = useState("All availability");
  const [priceRange, setPriceRange] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const { data, error, isLoading, mutate: mutateProducts } = useSWR<MarketplaceApiResponse>(
    `/api/v1/products?status=ACTIVE&limit=100&page=${page}`,
    fetcher
  );

  // Transform API data to marketplace products
  const marketplaceProducts = useMemo(() => {
    if (!data?.data?.products) return [];
    return transformManyToMarketplace(
      data.data.products.map((p) => ({
        ...p,
        images: p.images ? JSON.parse(p.images) : null,
      }))
    );
  }, [data]);

  // Add isFeatured and isNew flags based on status or other criteria
  const productsWithFlags = useMemo(() => {
    return marketplaceProducts.map((p) => ({
      ...p,
      isFeatured: p.status === "ACTIVE" && p.supplierRating >= 4.5,
      isNew: false, // Could be derived from createdAt date
    }));
  }, [marketplaceProducts]);

  const cart = useCart();

  // Filter products based on selections
  const filteredProducts = useMemo(() => {
    const activePriceRange =
      priceRanges.find((range) => range.value === priceRange) ?? priceRanges[0];
    const normalizedQuery = query.trim().toLowerCase();

    return productsWithFlags
      .filter((product) => {
        const productDepartment = PRISMA_TO_DEPARTMENT[product.prismaCategory] || "Housekeeping";
        const matchesDepartment =
          department === "All departments" || productDepartment === department;
        const matchesCategory =
          category === "All categories" || product.category === category;
        const matchesAvailability =
          availability === "All availability" || product.status === availability;
        const matchesPrice =
          product.unitPrice >= activePriceRange.min && product.unitPrice <= activePriceRange.max;
        const matchesQuery =
          normalizedQuery.length === 0 ||
          [
            product.name,
            product.description || "",
            productDepartment,
            product.category,
            product.sku || "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(normalizedQuery);

        return matchesDepartment && matchesCategory && matchesAvailability && matchesPrice && matchesQuery;
      })
      .sort((a, b) => {
        if (sort === "price-asc") {
          return a.unitPrice - b.unitPrice;
        }
        if (sort === "price-desc") {
          return b.unitPrice - a.unitPrice;
        }
        if (sort === "rating") {
          return b.supplierRating - a.supplierRating;
        }
        if (sort === "newest") {
          return 0; // Would need createdAt for proper sorting
        }
        return Number(Boolean(b.isFeatured)) - Number(Boolean(a.isFeatured));
      });
  }, [availability, category, department, priceRanges, priceRange, productsWithFlags, query, sort]);

  const featuredProducts = useMemo(
    () => productsWithFlags.filter((p) => p.isFeatured).slice(0, 3),
    [productsWithFlags]
  );

  const totalProducts = data?.data?.pagination?.total ?? 0;

  const scrollToCatalog = () => {
    document.getElementById("catalog")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAddToCart = (productId: string) => {
    cart.addItem(productId);
    mutateProducts(); // Refresh cart count if needed
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0c0c12]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#39ff7e] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-white/60">Loading products...</p>
        </div>
      </main>
    );
  }

  if (error || !data?.success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0c0c12]">
        <div className="text-center p-6">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Failed to load products</h2>
          <p className="text-white/40 mb-4">{(error as any)?.message || "Please try again later"}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#39ff7e] text-black rounded-lg font-medium hover:bg-[#32cd32] transition"
          >
            Retry
          </button>
        </div>
      </main>
    );
  }

  return (
    <main style={{ backgroundColor: "#0c0c12", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section className="relative min-h-[92vh] overflow-hidden bg-stone-950 px-4 py-16 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(245,245,240,0.22),transparent_32%),linear-gradient(120deg,rgba(12,10,9,0.94),rgba(12,10,9,0.56)_45%,rgba(146,64,14,0.5))]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-stone-50 to-transparent" />
        </div>

        <div className="relative z-10 mx-auto grid min-h-[78vh] max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="text-center mb-4">
              <img src="/images/logo-hotels-vendors.png" alt="Hotels Vendors" className="h-10" />
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-[#39ff7e] backdrop-blur">
              <Sparkles size={15} /> Premium Hotel Procurement
            </div>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Egypt&apos;s Premier B2B Hospitality Marketplace
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-200 md:text-xl">
              Fixed-price catalogs • ETA-compliant invoicing • 24-hour payments via embedded factoring
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={scrollToCatalog}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-4 text-sm font-bold text-stone-950 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:bg-amber-100"
              >
                Browse Product Catalog <ArrowRight size={16} />
              </button>
              <a
                href="#suppliers"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/20"
              >
                View Verified Suppliers
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-10 rounded-full bg-amber-400/20 blur-3xl" />
            <div className="relative overflow-hidden rounded-[2.6rem] border border-white/20 bg-white/10 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl">
              <img
                src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1400&q=90"
                alt="Premium hotel lobby furniture"
                className="h-[560px] w-full rounded-[2rem] object-cover"
              />
              <div className="absolute bottom-8 left-8 right-8 rounded-[1.75rem] border border-white/20 bg-stone-950/65 p-6 backdrop-blur-xl">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-amber-300">
                  Cairo Ready Catalog
                </p>
                <p className="mt-2 font-serif text-3xl text-white">
                  {featuredProducts.length}+ Featured Products
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-300">
                  Transparent EGP pricing, MOQs, lead times and hotel reviews.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Product Catalog Section */}
      <section id="catalog" className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-amber-700">
                Live Product Catalog
              </p>
              <h2 className="mt-2 font-serif text-3xl text-stone-950 md:text-4xl">
                {filteredProducts.length.toLocaleString()} products found
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Showing {Math.min((page - 1) * 24 + 1, totalProducts)}–{Math.min(page * 24, totalProducts)} of {totalProducts.toLocaleString()} products
              </p>
            </div>
            <div className="rounded-3xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-600">
              <span className="font-bold text-stone-950">{categories.length}</span> procurement categories
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-[2rem] border border-stone-200 bg-stone-50 p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1.2fr_1fr_1fr_1fr_1fr]">
              <label className="relative block">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search products, SKU, or description"
                  className="h-12 w-full rounded-2xl border border-stone-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#39ff7e]/30 focus:ring-2 focus:ring-[#39ff7e]/10"
                />
              </label>

              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-[#39ff7e]/30 focus:ring-2 focus:ring-[#39ff7e]/10"
                aria-label="Filter by department"
              >
                <option>All departments</option>
                {hotelDepartments.map((item) => (
                  <option key={item.name} value={item.name}>{item.name}</option>
                ))}
              </select>

              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-[#39ff7e]/30 focus:ring-2 focus:ring-[#39ff7e]/10"
                aria-label="Filter by category"
              >
                <option value="All categories">All categories</option>
                <option value="fb">F&B</option>
                <option value="hk">Housekeeping</option>
                <option value="gra">Guest Supplies</option>
                <option value="ffe">FF&E</option>
                <option value="eng">Services</option>
                <option value="lin">Linens</option>
                <option value="spa">Spa</option>
                <option value="it">IT</option>
                <option value="sec">Security</option>
              </select>

              <select
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-[#39ff7e]/30 focus:ring-2 focus:ring-[#39ff7e]/10"
                aria-label="Filter by availability"
              >
                {availabilityOptions.map((item) => (
                  <option key={item} value={item}>{item.replace("_", " ")}</option>
                ))}
              </select>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="h-12 rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-[#39ff7e]/30 focus:ring-2 focus:ring-[#39ff7e]/10"
                aria-label="Sort products"
              >
                <option value="featured">Sort: Featured</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
                <option value="rating">Top rated</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-stone-500">
                <Filter size={14} /> Price
              </span>
              {priceRanges.map((range) => (
                <button
                  type="button"
                  key={range.value}
                  onClick={() => setPriceRange(range.value)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                    priceRange === range.value
                      ? "border-stone-950 bg-stone-950 text-white"
                      : "border-stone-200 bg-white text-stone-600 hover:border-stone-950"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCardArena
                    key={product.id}
                    product={product}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>

              {/* Pagination */}
              {data?.data?.pagination?.totalPages > 1 && (
                <div className="mt-8 flex justify-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-stone-950"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-stone-600">
                    Page {page} of {data.data.pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(data.data.pagination.totalPages, p + 1))}
                    disabled={page === data.data.pagination.totalPages}
                    className="px-4 py-2 rounded-lg border border-stone-200 bg-white text-stone-600 disabled:opacity-50 disabled:cursor-not-allowed hover:border-stone-950"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-12 text-center">
              <h3 className="font-serif text-3xl text-stone-950">No products match these filters.</h3>
              <p className="mt-2 text-stone-500">
                Reset the department, price or search terms to browse more products.
              </p>
              <button
                type="button"
                onClick={() => {
                  setDepartment("All departments");
                  setCategory("All categories");
                  setAvailability("All availability");
                  setPriceRange("all");
                  setQuery("");
                }}
                className="mt-6 rounded-full bg-stone-950 px-6 py-3 text-sm font-bold text-white transition hover:bg-amber-700"
              >
                Reset filters
              </button>
            </div>
          )}
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
                <b.icon size={16} style={{ color: "#39ff7e" }} />
                <div>
                  <p className="text-[11px] font-medium text-white/60">{b.label}</p>
                  <p className="text-[9px] text-white/25">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Categories */}
      <section className="py-16" style={{ backgroundColor: "#12121a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-6">Shop By Department</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {hotelDepartments.map((dept) => (
              <motion.button
                key={dept.name}
                type="button"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: hotelDepartments.indexOf(dept) * 0.03, duration: 0.5 }}
                onClick={() => {
                  setDepartment(dept.name);
                  setTimeout(scrollToCatalog, 300);
                }}
                className="group relative min-h-64 overflow-hidden rounded-[2rem] bg-stone-900 text-left shadow-xl shadow-stone-900/10"
              >
                <img
                  src={dept.image}
                  alt={dept.name}
                  className="absolute inset-0 h-full w-full object-cover opacity-80 transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                    Department {String(hotelDepartments.indexOf(dept) + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl">{dept.name}</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-stone-200">
                    {dept.subtitle}
                  </p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Oliv Referral CTA */}
      <section className="py-12" style={{ backgroundColor: "#12121a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-lg font-semibold text-white mb-4">
              Enhance Your Procurement with Oliv Financing
            </h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-center">
                <img src="/images/logo-hotels-vendors.png" alt="Hotels Vendors" className="h-8" />
              </div>
              <div className="text-center">
                <img src="https://oliv.finance/logo.svg" alt="Oliv Finance" className="h-8" />
              </div>
            </div>
            <div className="bg-[#39ff7e]/10 px-4 py-2 rounded-md text-sm text-white/80 mb-3">
              Referral Code: <span className="font-mono text-white">CHV000</span>
            </div>
            <button
              onClick={() => {
                window.open(
                  `https://oliv.finance/onboard?ref=CHV000&user_id=marketplace_visitor&redirect_uri=${encodeURIComponent(
                    window.location.origin
                  )}`,
                  "_blank"
                );
              }}
              className="w-full max-w-md bg-[#39ff7e] hover:bg-[#32cd32] text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-lg"
            >
              Get Instant Credit Line via Oliv
            </button>
            <p className="mt-3 text-xs text-white/60">
              Get up to 10M EGP credit line • Approval in 24h • Zero risk for suppliers
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[24px] font-medium mb-4 text-white">Ready to Streamline Your Hotel Procurement?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">
            Join 680+ verified suppliers already transacting on HotelsVendors. Get paid in 24 hours, not 90.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/register?sector=supplier" className="flex-1 px-5 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,126,0.2)]" style={{ backgroundColor: "#39ff7e", color: "#07090f" }}>
              Register as Supplier <ArrowRight size={14} />
            </Link>
            <Link href="/register?sector=hotel" className="flex-1 px-5 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
              Register as Hotel Buyer
            </Link>
          </div>
        </div>
      </section>

      {/* Oliv Referral CTA at bottom */}
      <OlivReferralCTA
        userId="marketplace-footer-visitor"
        userType="SUPPLIER"
        onOlivComplete={() => (window.location.href = '/dashboard')}
      />
    </main>
  );
}

// Product Card Arena - Updated to use real MarketplaceProduct fields
function ProductCardArena({ product, onAddToCart }: {
  product: MarketplaceProduct & { isFeatured?: boolean; isNew?: boolean };
  onAddToCart: (id: string) => void;
}) {
  const department = PRISMA_TO_DEPARTMENT[product.prismaCategory] || "Housekeeping";

  return (
    <article className="group overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm transition duration-500 hover:-translate-y-1 hover:shadow-2xl hover:shadow-stone-900/10">
      <Link
        href={`/products/${product.id}`}
        className="relative block h-72 overflow-hidden bg-stone-100"
      >
        <img
          src={product.images?.[0] || "https://images.unsplash.com/photo-1592928309764-2c087a0f6f5b?auto=format&fit=crop&w=400&q=60"}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/55 via-transparent to-transparent opacity-70" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {product.isFeatured ? (
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-stone-950 backdrop-blur">
              Featured
            </span>
          ) : null}
          {product.isNew ? (
            <span className="rounded-full bg-amber-600 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-white">
              New
            </span>
          ) : null}
        </div>
        <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 backdrop-blur">
          {product.stockQuantity > 0 ? "In Stock" : "Out of Stock"}
        </span>
      </Link>

      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">
            {department}
          </p>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-stone-600">
            <Star size={14} className="fill-amber-500 text-amber-500" />
            {product.supplierRating.toFixed(1)}
          </span>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="mt-3 block font-serif text-2xl leading-tight text-stone-950 transition hover:text-amber-700"
        >
          {product.name}
        </Link>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-500">
          {product.description || `Supplier: ${product.supplierName}`}
        </p>

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-stone-400">From</p>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-stone-950">
                {product.unitPrice.toLocaleString('en-EG')} EGP
              </p>
              {product.minOrderQty > 1 && (
                <p className="text-xs text-stone-500">MOQ: {product.minOrderQty}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onAddToCart(product.id)}
            className="grid h-12 w-12 place-items-center rounded-full bg-stone-950 text-white shadow-lg shadow-stone-950/15 transition hover:scale-105 hover:bg-amber-700"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={18} />
          </button>
        </div>

        <Link
          href={`/products/${product.id}`}
          className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-stone-950 transition hover:gap-3 hover:text-amber-700"
        >
          View details <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}