"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import {
  Search,
  ShoppingCart,
  Plus,
  Package,
  ArrowLeft,
  ChefHat,
  Sparkles,
  Wrench,
  Bath,
  Armchair,
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
  subcategory?: string;
  unitPrice: number;
  currency: string;
  stockQuantity: number;
  minOrderQty: number;
  supplier: { id: string; name: string; city: string };
}

export default function CatalogPage() {
  const router = useRouter();
  const { addItem, totalItems } = useCart();
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push("/hotel")}
            className="p-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <ArrowLeft size={20} className="text-foreground-muted" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Product Catalog</h1>
            <p className="text-sm text-foreground-muted">Browse and order from verified suppliers</p>
          </div>
        </div>
        <button
          onClick={() => router.push("/hotel/order")}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
        >
          <ShoppingCart size={18} />
          <span>Cart</span>
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent-gold text-black text-xs font-bold flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-faint" />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border-default text-foreground placeholder:text-foreground-faint focus:border-brand-500 focus:outline-none transition-colors"
        />
      </div>

      {/* Category Pills */}
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
                  ? "bg-brand-600 text-white"
                  : "bg-surface border border-border-default text-foreground-muted hover:border-border-strong hover:text-foreground"
              }`}
            >
              <Icon size={16} />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card p-5 h-48 animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="glass-card p-8 text-center text-foreground-muted">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-8 text-center text-foreground-muted">
          No products found. Try a different search or category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={() => addItem({
              productId: product.id,
              name: product.name,
              sku: product.sku,
              unitPrice: product.unitPrice,
              supplierId: product.supplier.id,
              supplierName: product.supplier.name,
            })} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAdd }: { product: Product; onAdd: () => void }) {
  return (
    <div className="glass-card p-5 flex flex-col gap-3 hover:-translate-y-1 transition-transform">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-surface-raised flex items-center justify-center">
          <Package size={20} className="text-foreground-muted" />
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent-emerald/10 text-accent-emerald">
          {product.stockQuantity} in stock
        </span>
      </div>

      <div className="flex-1">
        <p className="text-xs text-foreground-faint uppercase tracking-wider">{product.sku}</p>
        <h3 className="text-sm font-semibold text-foreground mt-0.5 line-clamp-2">{product.name}</h3>
        <p className="text-xs text-foreground-muted mt-1">{product.supplier.name} · {product.supplier.city}</p>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-border-subtle">
        <div>
          <p className="text-lg font-bold text-foreground metric-value">{product.unitPrice.toLocaleString()}</p>
          <p className="text-xs text-foreground-faint">{product.currency} / unit</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand-600 hover:bg-brand-700 text-white text-sm font-medium transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </div>
  );
}
