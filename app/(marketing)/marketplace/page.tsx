"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Filter,
  Package,
  UtensilsCrossed,
  Sparkles,
  Sofa,
  Wrench,
  ArrowRight,
  Check,
  Clock,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";

// ── Category Config ──
const CATEGORIES = [
  { id: "ALL", label: "All Products", icon: Package },
  { id: "F_AND_B", label: "Food & Beverage", icon: UtensilsCrossed },
  { id: "CONSUMABLES", label: "Consumables", icon: Sparkles },
  { id: "GUEST_SUPPLIES", label: "Guest Supplies", icon: Sofa },
  { id: "FFE", label: "Furniture & Equipment", icon: Sofa },
  { id: "SERVICES", label: "Services", icon: Wrench },
];

// ── Demo Products (replace with API fetch) ──
const DEMO_PRODUCTS = [
  {
    id: "1",
    name: "Premium Egyptian Cotton Towels",
    description: "600 GSM long-staple cotton, hotel-grade durability",
    category: "GUEST_SUPPLIES",
    unitPrice: 145,
    currency: "EGP",
    stockQuantity: 1200,
    supplier: "Nile Textile Co.",
    image: "https://images.unsplash.com/photo-1616627547584-600c936c0a64?w=600&q=80",
    badge: "Best Seller",
  },
  {
    id: "2",
    name: "Cold-Pressed Extra Virgin Olive Oil",
    description: "Single-origin Siwa oasis, 5L bulk packaging",
    category: "F_AND_B",
    unitPrice: 890,
    currency: "EGP",
    stockQuantity: 340,
    supplier: "Siwa Organics",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&q=80",
    badge: "Local",
  },
  {
    id: "3",
    name: "Industrial Dishwasher Detergent",
    description: "Concentrated formula, 20L drum, HACCP compliant",
    category: "CONSUMABLES",
    unitPrice: 420,
    currency: "EGP",
    stockQuantity: 85,
    supplier: "CleanPro Egypt",
    image: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=600&q=80",
    badge: null,
  },
  {
    id: "4",
    name: "Luxury Mattress Topper — Queen",
    description: "Memory foam gel-infused, hypoallergenic cover",
    category: "FFE",
    unitPrice: 3200,
    currency: "EGP",
    stockQuantity: 45,
    supplier: "SleepTech MENA",
    image: "https://images.unsplash.com/photo-1505693416388-b0346efee539?w=600&q=80",
    badge: "Premium",
  },
  {
    id: "5",
    name: "Laundry Service — Per Kg Contract",
    description: "Daily pickup, 24hr turnaround, linen tracking",
    category: "SERVICES",
    unitPrice: 18,
    currency: "EGP",
    stockQuantity: 999,
    supplier: "FastWash Cairo",
    image: "https://images.unsplash.com/photo-1517677208171-0bc163a78d3a?w=600&q=80",
    badge: "Service",
  },
  {
    id: "6",
    name: "Artisanal Egyptian Honey — 1kg",
    description: "Sidr honey from Sinai, raw and unfiltered",
    category: "F_AND_B",
    unitPrice: 650,
    currency: "EGP",
    stockQuantity: 200,
    supplier: "Desert Gold Apiaries",
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=600&q=80",
    badge: "Organic",
  },
  {
    id: "7",
    name: "Biodegradable Guest Amenities Kit",
    description: "Shampoo, conditioner, lotion, 500 sets per box",
    category: "GUEST_SUPPLIES",
    unitPrice: 380,
    currency: "EGP",
    stockQuantity: 600,
    supplier: "EcoGuest Egypt",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
    badge: "Eco",
  },
  {
    id: "8",
    name: "LED Bathroom Mirror — 80cm",
    description: "Anti-fog, touch sensor, warm/cool light",
    category: "FFE",
    unitPrice: 4800,
    currency: "EGP",
    stockQuantity: 22,
    supplier: "Luxor Lighting",
    image: "https://images.unsplash.com/photo-1620626012053-10165ddf6f7a?w=600&q=80",
    badge: "New",
  },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return DEMO_PRODUCTS.filter((p) => {
      const matchesCategory = activeCategory === "ALL" || p.category === activeCategory;
      const matchesSearch =
        searchQuery === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.supplier.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f0f0f0]">
      <MarketingNav />

      {/* ═══ Hero ═══ */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-aurora" />
        <div className="absolute inset-0 bg-noise" />
        <div className="relative max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="text-center max-w-3xl mx-auto">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[rgba(139,0,0,0.12)] border border-[rgba(139,0,0,0.25)] text-[#ff6b6b] text-[11px] font-medium uppercase tracking-wider mb-6">
                <TrendingUp size={12} />
                Verified Supplier Network
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
                Procurement Marketplace{" "}
                <span className="text-[#8B0000]">for Hotels</span>
              </h1>
              <p className="text-lg text-[#a0a0a0] leading-relaxed max-w-2xl mx-auto mb-10">
                Discover vetted suppliers, compare real-time pricing, and purchase
                everything your property needs — from F&B to furniture — on one platform.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20"
                />
                <input
                  type="text"
                  placeholder="Search products, suppliers, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-11 pr-4 rounded-xl text-sm text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#8B0000]/40 focus:ring-1 focus:ring-[#8B0000]/10 transition-all"
                />
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══ Category Tabs ═══ */}
      <section className="border-y border-white/[0.06] bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Filter size={14} className="text-white/30 mr-2 flex-shrink-0" />
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-[rgba(139,0,0,0.15)] text-white border border-[rgba(139,0,0,0.30)]"
                      : "text-white/50 hover:text-white hover:bg-white/[0.04] border border-transparent"
                  }`}
                >
                  <Icon size={14} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Product Grid ═══ */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-24"
              >
                <Package size={48} className="mx-auto text-white/10 mb-4" />
                <p className="text-white/40 text-lg">No products match your search.</p>
              </motion.div>
            ) : (
              <StaggerContainer
                key={activeCategory + searchQuery}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
              >
                {filtered.map((product) => (
                  <StaggerItem key={product.id}>
                    <ProductCard product={product} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 sm:py-24 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0a0a0a] to-[#111] p-10 sm:p-16 text-center">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8B0000]/[0.06] rounded-full blur-[100px] pointer-events-none" />
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
                Ready to modernize your procurement?
              </h2>
              <p className="text-[#a0a0a0] max-w-xl mx-auto mb-8">
                Join 50+ hotels already using Hotels Vendors to cut procurement costs
                by 30% and eliminate stockouts.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register?role=hotel"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#8B0000] hover:bg-[#6B0000] text-white text-sm font-semibold transition-all shadow-[0_0_30px_rgba(139,0,0,0.20)]"
                >
                  Register Your Hotel
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/become-supplier"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.10] text-white/70 hover:text-white hover:bg-white/[0.04] text-sm font-medium transition-all"
                >
                  Become a Supplier
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}

// ── Product Card ──
function ProductCard({
  product,
}: {
  product: (typeof DEMO_PRODUCTS)[number];
}) {
  const inStock = product.stockQuantity > 50;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="group surface-card overflow-hidden cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-[#8B0000]/90 text-white text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm">
            {product.badge}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-semibold text-[#f0f0f0] leading-snug line-clamp-2">
            {product.name}
          </h3>
        </div>
        <p className="text-xs text-[#707070] leading-relaxed mb-3 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-medium ${
              inStock ? "text-[#34d399]" : "text-[#fbbf24]"
            }`}
          >
            {inStock ? <Check size={10} /> : <Clock size={10} />}
            {inStock ? "In Stock" : "Low Stock"}
          </span>
          <span className="text-white/10">|</span>
          <span className="text-[10px] text-white/30">{product.supplier}</span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
          <span className="text-lg font-bold text-[#f0f0f0]">
            {product.unitPrice.toLocaleString()}{" "}
            <span className="text-xs font-normal text-white/40">{product.currency}</span>
          </span>
          <button className="p-2 rounded-lg bg-[rgba(139,0,0,0.12)] text-[#8B0000] hover:bg-[#8B0000] hover:text-white transition-all">
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
