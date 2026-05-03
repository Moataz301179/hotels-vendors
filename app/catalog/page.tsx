"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search, Package, ArrowRight, ChefHat, Sparkles, Bath, Armchair, Wrench,
  ShoppingCart, Building2, Factory, Landmark, Truck, Menu, X, ChevronRight,
} from "lucide-react";

/* ─── Types ─── */
interface Product {
  id: string; sku: string; name: string; category: string;
  subcategory?: string; unitPrice: number; currency: string;
  stockQuantity: number; minOrderQty: number;
  supplier: { id: string; name: string; city: string };
}

const CATEGORIES = [
  { key: "ALL", label: "All Products", icon: Package },
  { key: "F_AND_B", label: "F&B", icon: ChefHat },
  { key: "CONSUMABLES", label: "Housekeeping", icon: Sparkles },
  { key: "GUEST_SUPPLIES", label: "Amenities", icon: Bath },
  { key: "FFE", label: "Equipment", icon: Armchair },
  { key: "SERVICES", label: "Services", icon: Wrench },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/* ─── Components ─── */
function Navbar() {
  const [mobileMenu, setMobileMenu] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-default)] bg-[var(--background)]/75 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[var(--surface)] ring-1 ring-[var(--border-strong)]">
              <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1.5" />
            </div>
            <span className="text-sm font-bold tracking-wider text-[var(--foreground)]">Hotels Vendors</span>
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-[var(--foreground-tertiary)]">
            {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
              <a key={item} href={`/#${item.toLowerCase()}`} className="hover:text-[var(--foreground)] transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-[13px] font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 text-[13px] font-semibold rounded-xl bg-[var(--foreground)] text-[var(--foreground-inverse)] hover:bg-[var(--foreground)]/90 transition-all hover:-translate-y-px">
              Get Started
            </Link>
          </div>
          <button className="lg:hidden p-2 text-[var(--foreground-secondary)]" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {mobileMenu && (
        <div className="lg:hidden border-t border-[var(--border-default)] bg-[var(--background)]/95 backdrop-blur-xl px-6 py-5 space-y-1">
          {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
            <a key={item} href={`/#${item.toLowerCase()}`} className="block py-2 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)]" onClick={() => setMobileMenu(false)}>
              {item}
            </a>
          ))}
          <div className="pt-4 flex gap-3">
            <Link href="/login" className="flex-1 text-center py-2.5 text-sm rounded-xl border border-[var(--border-default)] text-[var(--foreground-secondary)]">Sign In</Link>
            <Link href="/register" className="flex-1 text-center py-2.5 text-sm rounded-xl bg-[var(--foreground)] text-[var(--foreground-inverse)] font-semibold">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--border-default)] bg-[var(--background-void)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-[var(--surface)] ring-1 ring-[var(--border-strong)]">
                <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1.5" />
              </div>
              <span className="text-sm font-bold tracking-wider text-[var(--foreground)]">Hotels Vendors</span>
            </div>
            <p className="text-[13px] text-[var(--foreground-muted)] max-w-xs leading-relaxed">
              Egypt&apos;s first B2B digital procurement hub for hotels. ETA-compliant, AI-powered, and built for scale.
            </p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-muted)] font-semibold mb-4">Product</div>
            <div className="space-y-2.5">
              {["Catalog", "Features", "Solutions", "ETA Compliance"].map((l) => (
                <a key={l} href="#" className="block text-[13px] text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-muted)] font-semibold mb-4">Company</div>
            <div className="space-y-2.5">
              {["About", "Careers", "Contact", "Blog"].map((l) => (
                <span key={l} className="block text-[13px] text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-muted)] font-semibold mb-4">Legal</div>
            <div className="space-y-2.5">
              {["Privacy", "Terms", "Security", "ETA e-Invoicing"].map((l) => (
                <span key={l} className="block text-[13px] text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-[var(--foreground-muted)]">© 2026 Hotels Vendors. All rights reserved.</div>
          <div className="flex items-center gap-5 text-[11px] text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1.5"><ShoppingCart className="w-3 h-3 text-[var(--success)]" /> SSL Secured</span>
            <span className="flex items-center gap-1.5"><Package className="w-3 h-3 text-[var(--info)]" /> ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function PublicCatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams();
        params.set("limit", "48");
        if (activeCategory !== "ALL") params.set("category", activeCategory);
        const res = await fetch(`/api/products?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setProducts(json.data || []);
        } else {
          setError(json.error || "Failed to load products");
        }
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [activeCategory]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
      <Navbar />

      {/* Header */}
      <section className="pt-32 pb-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
          >
            <div className="flex items-center gap-2 text-[13px] text-[var(--foreground-muted)] mb-4">
              <Link href="/" className="hover:text-[var(--foreground)] transition-colors">Home</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-[var(--foreground-secondary)]">Catalog</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4">
              Supplier Catalog
            </h1>
            <p className="text-[var(--foreground-tertiary)] text-lg max-w-xl">
              Browse verified products from Egyptian suppliers. Sign in to place orders and unlock AI pricing.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search + Filters */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or SKU..."
                className="w-full pl-11 pr-4 py-3 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border-default)] focus:border-[var(--accent-500)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]/10 transition-all placeholder:text-[var(--foreground-muted)]"
              />
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <button
                    key={c.key}
                    onClick={() => { setActiveCategory(c.key); setLoading(true); }}
                    className={`inline-flex items-center gap-2 px-4 py-2 text-[12px] rounded-full border transition-all duration-200 ${
                      activeCategory === c.key
                        ? "bg-[var(--accent-500)]/10 border-[var(--accent-500)]/20 text-[var(--accent-400)] font-medium"
                        : "bg-[var(--surface)] border-[var(--border-default)] text-[var(--foreground-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--foreground-secondary)]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Results Count */}
      <section className="pb-6">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <p className="text-[13px] text-[var(--foreground-muted)]">
              {loading ? "Loading products..." : `${filtered.length} product${filtered.length !== 1 ? "s" : ""} found`}
            </p>
            <Link href="/register" className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold rounded-lg bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 text-[var(--accent-400)] hover:bg-[var(--accent-500)]/15 transition-colors">
              <ShoppingCart className="w-3.5 h-3.5" />
              Sign in to Order
            </Link>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {error && (
            <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)]/[0.4] p-8 text-center">
              <p className="text-[var(--error)] text-sm mb-2">{error}</p>
              <button
                onClick={() => { setLoading(true); setError(""); setActiveCategory("ALL"); }}
                className="text-[var(--accent-400)] text-sm hover:underline"
              >
                Retry
              </button>
            </div>
          )}

          {!error && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {loading
                ? [...Array(8)].map((_, i) => (
                    <div key={i} className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)]/[0.3] p-4 animate-pulse">
                      <div className="aspect-[4/3] bg-[var(--surface-raised)] rounded-xl mb-4" />
                      <div className="h-3 bg-[var(--surface-raised)] rounded w-1/3 mb-2" />
                      <div className="h-4 bg-[var(--surface-raised)] rounded w-3/4 mb-2" />
                      <div className="h-3 bg-[var(--surface-raised)] rounded w-1/2" />
                    </div>
                  ))
                : filtered.map((p, i) => (
                    <motion.div
                      key={p.id}
                      custom={i}
                      variants={fadeUp}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="group rounded-2xl border border-[var(--border-default)] bg-[var(--surface)]/[0.4] overflow-hidden hover:border-[var(--border-strong)] hover:bg-[var(--surface)]/[0.7] transition-all duration-400 hover:-translate-y-0.5"
                    >
                      <div className="aspect-[4/3] bg-[var(--surface)] flex items-center justify-center">
                        <Package className="w-8 h-8 text-[var(--foreground-muted)]/25 group-hover:text-[var(--foreground-muted)]/40 transition-colors" />
                      </div>
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-[9px] font-mono text-[var(--foreground-muted)]">{p.sku}</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--surface-raised)] text-[var(--foreground-muted)]">
                            {p.category.replace(/_/g, " ")}
                          </span>
                        </div>
                        <h3 className="text-[14px] font-medium text-[var(--foreground)] truncate mb-1">{p.name}</h3>
                        <p className="text-[11px] text-[var(--foreground-muted)] truncate mb-3">{p.supplier?.name} · {p.supplier?.city}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-[14px] font-semibold text-[var(--success)]">
                            EGP {p.unitPrice.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-[var(--foreground-muted)]">
                            MOQ {p.minOrderQty}
                          </span>
                        </div>
                        <div className="mt-3 pt-3 border-t border-[var(--border-default)]">
                          <Link
                            href="/register"
                            className="flex items-center justify-center gap-1.5 w-full py-2 text-[11px] font-medium rounded-lg bg-[var(--accent-500)]/8 text-[var(--accent-400)] border border-[var(--accent-500)]/10 hover:bg-[var(--accent-500)]/12 transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3" />
                            Sign in to Order
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
            </div>
          )}

          {!loading && filtered.length === 0 && !error && (
            <div className="text-center py-20">
              <Package className="w-10 h-10 text-[var(--foreground-muted)] mx-auto mb-4" />
              <p className="text-[var(--foreground-secondary)] text-lg mb-2">No products found</p>
              <p className="text-[var(--foreground-muted)] text-sm">Try adjusting your search or category filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative rounded-3xl border border-[var(--border-default)] bg-[var(--surface)]/[0.3] p-10 lg:p-14 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.06),transparent)]" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4 text-[var(--foreground)]">
                Ready to start ordering?
              </h2>
              <p className="text-[var(--foreground-tertiary)] max-w-md mx-auto mb-8 text-lg">
                Join 50+ hotels already procuring smarter. Free 14-day trial, no credit card required.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/register" className="px-7 py-3.5 text-sm font-semibold rounded-xl bg-[var(--foreground)] text-[var(--foreground-inverse)] hover:bg-[var(--foreground)]/90 transition-all hover:-translate-y-px flex items-center gap-2">
                  Create Free Account <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="px-7 py-3.5 text-sm font-semibold rounded-xl border border-[var(--border-default)] text-[var(--foreground-secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-all">
                  Sign In
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
