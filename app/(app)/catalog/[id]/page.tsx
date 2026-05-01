"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingCart, Minus, Plus, Loader2 } from "lucide-react";
import { useCart } from "@/components/app/cart-context";
import { useToast } from "@/components/app/toast";

interface ProductDetail {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string;
  subcategory: string | null;
  unitPrice: number;
  currency: string;
  stockQuantity: number;
  minOrderQty: number;
  unitOfMeasure: string;
  leadTimeDays: number;
  images: string | null;
  specs: string | null;
  supplier: {
    id: string;
    name: string;
    city: string;
    email: string;
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  F_AND_B: "F&B",
  CONSUMABLES: "Consumables",
  GUEST_SUPPLIES: "Guest Supplies",
  FFE: "FF&E",
  SERVICES: "Services",
};

const CATEGORY_COLORS: Record<string, string> = {
  F_AND_B: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  CONSUMABLES: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  GUEST_SUPPLIES: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  FFE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  SERVICES: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

const CATEGORY_DOT: Record<string, string> = {
  F_AND_B: "bg-orange-400",
  CONSUMABLES: "bg-blue-400",
  GUEST_SUPPLIES: "bg-violet-400",
  FFE: "bg-amber-400",
  SERVICES: "bg-cyan-400",
};

function ProductImage({ images, name }: { images: string | null; name: string }) {
  const [error, setError] = useState(false);
  const [index, setIndex] = useState(0);

  let srcs: string[] = [];
  if (images) {
    try {
      const arr = JSON.parse(images);
      if (Array.isArray(arr)) srcs = arr;
    } catch {}
  }

  const src = srcs[index] || "";

  if (error || !src) {
    return (
      <div className="aspect-square w-full rounded-lg bg-surface-raised flex items-center justify-center">
        <span className="text-4xl font-bold text-foreground-faint">{name[0]}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="aspect-square w-full rounded-lg bg-surface-raised overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={name} className="w-full h-full object-cover" onError={() => setError(true)} />
      </div>
      {srcs.length > 1 && (
        <div className="flex gap-2">
          {srcs.map((s, i) => (
            <button
              key={i}
              onClick={() => { setIndex(i); setError(false); }}
              className={`w-12 h-12 rounded-md overflow-hidden border ${
                i === index ? "border-brand-500" : "border-border-subtle"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [related, setRelated] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setProduct(d.data);
          setQuantity(d.data.minOrderQty || 1);
          // Fetch related products
          fetch(`/api/products?limit=8&supplierId=${d.data.supplier.id}&category=${d.data.category}`)
            .then((r) => r.json())
            .then((rd) => {
              if (rd.success) {
                setRelated(rd.data.filter((p: ProductDetail) => p.id !== id).slice(0, 4));
              }
            })
            .catch(() => {});
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setAdding(true);
    try {
      await addToCart(product.id, quantity);
      showToast(`Added ${quantity} × ${product.name} to cart`);
    } catch {
      showToast("Failed to add to cart", "error");
    } finally {
      setAdding(false);
    }
  };

  const specs = product?.specs
    ? (() => {
        try {
          return JSON.parse(product.specs) as Record<string, string>;
        } catch {
          return null;
        }
      })()
    : null;

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-3 w-20 bg-surface-raised rounded" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="aspect-square bg-surface-raised rounded-lg" />
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-surface-raised rounded" />
            <div className="h-3 w-1/2 bg-surface-raised rounded" />
            <div className="h-20 bg-surface-raised rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-foreground-muted">Product not found</p>
        <Link href="/catalog" className="text-xs text-brand-400 hover:underline mt-2 inline-block">
          Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1 text-[11px] text-foreground-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-3 h-3" />
        Back to Catalog
      </Link>

      {/* Main */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Image */}
        <ProductImage images={product.images} name={product.name} />

        {/* Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`flex items-center gap-1 text-[10px] px-2 py-[2px] rounded-full border ${
                  CATEGORY_COLORS[product.category] || ""
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${CATEGORY_DOT[product.category] || ""}`} />
                {CATEGORY_LABELS[product.category] || product.category}
              </span>
              <span className="text-[10px] font-mono text-foreground-muted">{product.sku}</span>
            </div>
            <h1 className="text-lg font-semibold leading-tight">{product.name}</h1>
            {product.description && (
              <p className="text-xs text-foreground-muted mt-1">{product.description}</p>
            )}
          </div>

          <div className="rounded-lg bg-[#13161c]/80 border border-white/10 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">Supplier</span>
              <span className="text-xs font-medium">{product.supplier.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">City</span>
              <span className="text-xs font-medium">{product.supplier.city}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">Lead Time</span>
              <span className="text-xs font-medium">{product.leadTimeDays} day(s)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">Unit</span>
              <span className="text-xs font-medium">{product.unitOfMeasure}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">Stock</span>
              <span className={`text-xs font-medium ${product.stockQuantity <= product.minOrderQty * 2 ? "text-red-400" : ""}`}>
                {product.stockQuantity} available
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground-muted">Min Order</span>
              <span className="text-xs font-medium">{product.minOrderQty}</span>
            </div>
          </div>

          {specs && Object.keys(specs).length > 0 && (
            <div className="rounded-lg bg-[#13161c]/80 border border-white/10 p-3">
              <h3 className="text-xs font-semibold mb-2">Specifications</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(specs).map(([key, value]) => (
                  <div key={key} className="text-[10px]">
                    <span className="text-foreground-muted capitalize">{key.replace(/_/g, " ")}</span>
                    <div className="text-foreground font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <div className="text-2xl font-bold text-emerald-400">
              EGP {product.unitPrice.toLocaleString()}
            </div>
            <span className="text-[10px] text-foreground-muted">/ {product.unitOfMeasure}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setQuantity(Math.max(product.minOrderQty || 1, quantity - 1))}
                className="p-2 rounded-md bg-white/5 border border-white/10 text-foreground-muted hover:text-foreground transition-colors"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="text-sm font-medium w-8 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-md bg-white/5 border border-white/10 text-foreground-muted hover:text-foreground transition-colors"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-brand-700 text-white text-xs font-medium hover:bg-brand-600 disabled:opacity-50 transition-colors"
            >
              {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-3 pt-4 border-t border-border-subtle">
          <h2 className="text-sm font-semibold">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/catalog/${p.id}`}
                className="rounded-lg border border-border-subtle bg-surface p-3 hover:border-border-default transition-colors"
              >
                <div className="text-[9px] font-mono text-foreground-muted">{p.sku}</div>
                <div className="text-xs font-medium mt-0.5 line-clamp-1">{p.name}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-semibold text-emerald-400">
                    EGP {p.unitPrice.toLocaleString()}
                  </span>
                  <span className="text-[9px] text-foreground-muted">{p.supplier.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
