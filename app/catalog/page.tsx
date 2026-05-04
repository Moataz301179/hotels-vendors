"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  Filter,
  Star,
  Truck,
  ShieldCheck,
  Package,
  ChefHat,
  Sparkles,
  Bath,
  Armchair,
  Wrench,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  { key: "ALL", label: "All Products", icon: Package },
  { key: "F_AND_B", label: "F&B", icon: ChefHat },
  { key: "CONSUMABLES", label: "Housekeeping", icon: Sparkles },
  { key: "GUEST_SUPPLIES", label: "Amenities", icon: Bath },
  { key: "FFE", label: "Equipment", icon: Armchair },
  { key: "SERVICES", label: "Services", icon: Wrench },
];

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  currency: string;
  stockQuantity: number;
  minOrderQty: number;
  supplier: { id: string; name: string; city: string; rating?: number };
}

export default function MarketplacePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const params = new URLSearchParams();
        if (activeCategory !== "ALL") params.set("category", activeCategory);
        const res = await fetch(`/api/v1/hotel/catalog?${params.toString()}`);
        const json = await res.json();
        if (json.success) {
          setProducts(json.data.products || []);
        } else {
          setError(json.error || "Failed to load products");
        }
      } catch {
        setError("Network error");
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
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Navbar */}
      <nav className="border-b border-[var(--border-default)] bg-[var(--surface)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[var(--surface-raised)] border border-[var(--border-default)]">
                <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1" />
              </div>
              <span className="text-sm font-bold tracking-wider text-[var(--foreground)]">Hotels Vendors</span>
            </Link>
            <div className="hidden lg:flex items-center gap-1">
              {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
                <a key={item} href={`/#${item.toLowerCase()}`} className="px-3 py-2 text-[13px] font-medium rounded-lg text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition-colors">
                  {item}
                </a>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-[13px] font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">Sign In</Link>
              <Link href="/register" className="px-5 py-2.5 text-[13px] font-semibold rounded-xl bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)] transition-all">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-500)]/8 rounded-full blur-[150px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 text-[11px] font-semibold text-[var(--accent-400)] tracking-widest uppercase mb-6">
              <Package size={12} />
              Marketplace
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]">
              Browse <span className="text-[var(--accent-400)]">10,000+</span> verified products
            </h1>
            <p className="mt-4 text-lg text-[var(--foreground-secondary)]">
              From F&B to housekeeping, find everything your hotel needs from Egypt's best suppliers.
            </p>
          </div>

          {/* Search Bar */}
          <div className="mt-10 max-w-2xl mx-auto relative">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
            <input
              type="text"
              placeholder="Search by product name, SKU, or supplier..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-default)] text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent-500)] text-base shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Toolbar */}
      <section className="border-y border-[var(--border-default)] bg-[var(--surface)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
              <Filter size={16} />
              <span className="text-xs font-medium uppercase tracking-wider">Categories</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                const active = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => setActiveCategory(cat.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      active
                        ? "bg-[var(--accent-500)] text-white shadow-md"
                        : "bg-[var(--background)] border border-[var(--border-default)] text-[var(--foreground-secondary)] hover:border-[var(--border-strong)] hover:text-[var(--foreground)]"
                    }`}
                  >
                    <Icon size={16} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="glass-card p-5 h-56 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="glass-card p-8 text-center text-[var(--foreground-muted)]">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="glass-card p-8 text-center text-[var(--foreground-muted)]">
              No products found. Try a different search or category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--border-default)] bg-[var(--surface)] py-16">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Ready to <span className="text-[var(--accent-400)]">procure smarter</span>?
          </h2>
          <p className="mt-3 text-[var(--foreground-secondary)] max-w-xl mx-auto">
            Join 200+ Egyptian hotels already sourcing on Hotels Vendors. Setup takes 10 minutes.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="px-7 py-3.5 text-sm font-semibold rounded-xl bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)] transition-all">
              Get Started Free
            </Link>
            <Link href="/login" className="px-7 py-3.5 text-sm font-semibold rounded-xl border border-[var(--border-default)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--background)] border-t border-[var(--border-default)] py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[var(--foreground-muted)]">© 2026 Hotels Vendors. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[var(--foreground-muted)] text-xs">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-300">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-[var(--surface-raised)] border border-[var(--border-default)] flex items-center justify-center">
          <Package size={24} className="text-[var(--foreground-muted)]" />
        </div>
        <span className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
          product.stockQuantity > 100
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
        }`}>
          {product.stockQuantity} in stock
        </span>
      </div>

      <div className="flex-1">
        <p className="text-[11px] text-[var(--foreground-muted)] uppercase tracking-wider">{product.sku}</p>
        <h3 className="text-sm font-semibold text-[var(--foreground)] mt-0.5 line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-1.5 mt-2">
          <ShieldCheck size={12} className="text-[var(--accent-400)]" />
          <p className="text-xs text-[var(--foreground-secondary)]">{product.supplier.name} · {product.supplier.city}</p>
        </div>
        {product.supplier.rating && (
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-[var(--foreground-secondary)]">{product.supplier.rating}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-[var(--border-subtle)]">
        <div>
          <p className="text-lg font-bold text-[var(--foreground)]">{product.unitPrice.toLocaleString()}</p>
          <p className="text-[11px] text-[var(--foreground-muted)]">{product.currency} / unit · MOQ {product.minOrderQty}</p>
        </div>
        <Link
          href="/login"
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-sm font-medium transition-colors"
        >
          Order <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
