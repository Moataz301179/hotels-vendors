"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/components/app/cart-context";
import { useToast } from "@/components/app/toast";

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  stockQuantity: number;
  minOrderQty: number;
  unitOfMeasure: string;
  images?: string | null;
  supplier?: { id: string; name: string; city: string };
}

const CATEGORY_COLORS: Record<string, string> = {
  F_AND_B: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  CONSUMABLES: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  GUEST_SUPPLIES: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  FFE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  SERVICES: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const CATEGORY_LABELS: Record<string, string> = {
  F_AND_B: "F&B",
  CONSUMABLES: "Consumables",
  GUEST_SUPPLIES: "Guest Supplies",
  FFE: "FF&E",
  SERVICES: "Services",
};

const CATEGORY_BG: Record<string, string> = {
  F_AND_B: "bg-orange-500/5",
  CONSUMABLES: "bg-blue-500/5",
  GUEST_SUPPLIES: "bg-violet-500/5",
  FFE: "bg-amber-500/5",
  SERVICES: "bg-cyan-500/5",
};

const CATEGORY_DOT: Record<string, string> = {
  F_AND_B: "bg-orange-400",
  CONSUMABLES: "bg-blue-400",
  GUEST_SUPPLIES: "bg-violet-400",
  FFE: "bg-amber-400",
  SERVICES: "bg-cyan-400",
};

const ALL_CATEGORIES = ["F_AND_B", "CONSUMABLES", "GUEST_SUPPLIES", "FFE", "SERVICES"];

function ProductImage({ product }: { product: Product }) {
  const [error, setError] = useState(false);
  const initial = CATEGORY_LABELS[product.category]?.[0] || "?";
  const bg = CATEGORY_BG[product.category] || "bg-surface-raised";

  if (error) {
    return (
      <div className={`aspect-square w-full flex items-center justify-center ${bg}`}>
        <span className="text-2xl font-bold text-foreground-faint">{initial}</span>
      </div>
    );
  }

  let src = "";
  if (product.images) {
    try {
      const arr = JSON.parse(product.images);
      if (Array.isArray(arr) && arr.length > 0) src = arr[0];
    } catch {}
  }

  return (
    <div className={`aspect-square w-full ${bg} relative overflow-hidden`}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={product.name}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-2xl font-bold text-foreground-faint">{initial}</span>
        </div>
      )}
    </div>
  );
}

function AddToCartButton({ productId }: { productId: string }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await addToCart(productId, 1);
      showToast("Added to cart");
    } catch {
      showToast("Failed to add to cart", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAdd}
      disabled={loading}
      className="flex items-center gap-1 px-2 py-1 rounded-md bg-brand-500/10 text-brand-400 border border-brand-500/20 hover:bg-brand-500/20 disabled:opacity-50 transition-colors text-[10px] font-medium"
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShoppingCart className="w-3 h-3" />}
      Add
    </button>
  );
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<{ id: string; name: string }[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [supplierId, setSupplierId] = useState("ALL");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setProducts(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/suppliers?limit=100")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSuppliers(d.data);
      })
      .catch(() => {});
  }, []);

  const filtered = products.filter((p) => {
    const m =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const c = category === "ALL" || p.category === category;
    const s = supplierId === "ALL" || p.supplier?.id === supplierId;
    return m && c && s;
  });

  if (loading) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-base font-semibold">Product Catalog</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border-subtle bg-surface overflow-hidden animate-pulse">
              <div className="aspect-square bg-surface-raised" />
              <div className="p-3 space-y-1.5">
                <div className="h-2 w-16 bg-surface-raised rounded" />
                <div className="h-3 w-full bg-surface-raised rounded" />
                <div className="h-2 w-20 bg-surface-raised rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-base font-semibold">Product Catalog</h1>
          <p className="text-[11px] text-foreground-muted">
            Browse {products.length} products across {ALL_CATEGORIES.length} categories
          </p>
        </div>
        <span className="text-[11px] text-foreground-muted">{filtered.length} shown</span>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search products, SKUs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-6 pr-2 py-[3px] text-[11px] rounded-md bg-surface border border-border-subtle focus:border-brand-500/50 focus:outline-none text-foreground placeholder:text-foreground-faint"
          />
        </div>
        <select
          value={supplierId}
          onChange={(e) => setSupplierId(e.target.value)}
          className="text-[11px] rounded-md bg-surface border border-border-subtle px-1.5 py-[3px] focus:border-brand-500/50 focus:outline-none text-foreground"
        >
          <option value="ALL">All Suppliers</option>
          {suppliers.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Category tabs */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setCategory("ALL")}
          className={`text-[10px] px-2.5 py-[3px] rounded-full border transition-colors ${
            category === "ALL"
              ? "bg-brand-500/10 text-brand-400 border-brand-500/30"
              : "bg-surface text-foreground-muted border-border-subtle hover:border-border-default"
          }`}
        >
          All
        </button>
        {ALL_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`flex items-center gap-1 text-[10px] px-2.5 py-[3px] rounded-full border transition-colors ${
              category === c
                ? CATEGORY_COLORS[c]
                : "bg-surface text-foreground-muted border-border-subtle hover:border-border-default"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT[c]}`} />
            {CATEGORY_LABELS[c] || c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="rounded-lg border border-border-subtle bg-surface p-8 text-center">
          <div className="text-xs text-foreground-muted">No products match your search.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-border-subtle bg-surface overflow-hidden hover:border-border-default transition-colors flex flex-col"
            >
              <Link href={`/catalog/${p.id}`} className="block">
                <ProductImage product={p} />
              </Link>
              <div className="p-3 flex-1 flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <span
                    className={`flex items-center gap-1 text-[8px] px-1.5 py-[1px] rounded-full border ${
                      CATEGORY_COLORS[p.category] || "bg-slate-500/10 text-slate-400 border-slate-500/20"
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full ${CATEGORY_DOT[p.category] || "bg-slate-400"}`} />
                    {CATEGORY_LABELS[p.category] || p.category}
                  </span>
                </div>
                <Link href={`/catalog/${p.id}`} className="block">
                  <div className="text-[9px] font-mono text-foreground-muted">{p.sku}</div>
                  <div className="text-xs font-medium leading-tight mt-0.5 line-clamp-2 hover:text-brand-400 transition-colors">
                    {p.name}
                  </div>
                </Link>
                <div className="text-[9px] text-foreground-muted mt-0.5 truncate">{p.supplier?.name}</div>
                <div className="mt-auto pt-2 flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-400">
                    EGP {p.unitPrice.toLocaleString()}
                  </span>
                  <AddToCartButton productId={p.id} />
                </div>
                <div className="text-[9px] mt-1">
                  <span className={p.stockQuantity <= p.minOrderQty * 2 ? "text-red-400" : "text-foreground-muted"}>
                    {p.stockQuantity} in stock
                  </span>
                  <span className="text-foreground-faint"> · MOQ {p.minOrderQty}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
