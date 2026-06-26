"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Package,
  Star,
  MapPin,
  ShieldCheck,
  ShoppingCart,
  Check,
  Minus,
  Plus,
  Loader2,
  Scale,
} from "lucide-react";
import { motion } from "framer-motion";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { CompareDrawer } from "@/components/marketplace/compare-drawer";
import { useCompare } from "@/components/marketplace/compare-context";
import { getCategoryById } from "@/lib/marketplace/categories";
import { getProductImage } from "@/lib/marketplace/product-images";
import type { MarketplaceProduct } from "@/lib/marketplace/category-mapper";

const accent = "var(--accent-base)";
const accentMuted = "var(--accent-muted)";
const accentBorder = "var(--accent-glow)";
const borderSubtle = "var(--border-subtle)";

function ProductImage({ product }: { product: MarketplaceProduct }) {
  const [error, setError] = useState(false);
  const resolved = getProductImage(product);

  if (resolved.type === "url" && !error) {
    return (
      <img
        src={resolved.src}
        alt={product.name}
        className="w-full h-full object-cover"
        loading="eager"
        onError={() => setError(true)}
      />
    );
  }

  const colors = resolved.type === "gradient" ? resolved.colors : ["#1a1a2e", "#2a2a4a", "#4a4a7a"];
  const initials = resolved.type === "gradient"
    ? resolved.initials
    : product.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)` }}
    >
      <div className="text-center">
        <span className="text-[32px] font-bold text-white/20 tracking-tight">{initials}</span>
        <p className="text-[10px] text-white/15 uppercase tracking-wider mt-1">{product.category.toUpperCase()}</p>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;

  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const { addItem: addToCompare, removeItem: removeFromCompare, isInCompare } = useCompare();

  useEffect(() => {
    let cancelled = false;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch the catalog and find the product by id.
        // The public API filters by ACTIVE status by default.
        const res = await fetch(`/api/v1/products?status=ACTIVE&limit=100&page=1`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error || "Failed to load product");
        if (!cancelled) {
          setProducts(json.data.products);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load product");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchProduct();
    return () => { cancelled = true; };
  }, [productId]);

  const product = useMemo(() => products.find((p) => p.id === productId) || null, [products, productId]);

  // Related products: same category, excluding self
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);
  }, [products, product]);

  // Initialize qty when product loads
  useEffect(() => {
    if (product) setQty(product.minOrderQty || 1);
  }, [product]);

  if (loading) {
    return (
      <main className="min-h-screen text-primary" style={{ backgroundColor: "var(--background)", fontFamily: "var(--font-sans)" }}>
        <MarketingNav />
        <div className="flex items-center justify-center py-32 text-white/40">
          <Loader2 className="w-6 h-6 animate-spin mr-3" />
          <span>Loading product...</span>
        </div>
        <MarketingFooter />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen text-primary" style={{ backgroundColor: "var(--background)", fontFamily: "var(--font-sans)" }}>
        <MarketingNav />
        <div className="flex flex-col items-center justify-center py-32 text-white/40">
          <Package className="w-12 h-12 mb-4 text-white/20" />
          <h1 className="text-xl font-semibold text-white/60 mb-1">Product Not Found</h1>
          <p className="text-sm text-white/30 mb-6">{error || "This product may have been removed or the URL is incorrect."}</p>
          <Link href="/marketplace" className="px-5 py-2.5 rounded-xl text-sm font-medium text-white" style={{ backgroundColor: accent }}>
            Back to Marketplace
          </Link>
        </div>
        <MarketingFooter />
      </main>
    );
  }

  const category = getCategoryById(product.category);
  const inStock = product.stockQuantity > 0;
  const lowStock = product.stockQuantity > 0 && product.stockQuantity < 20;
  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    // Marketing context — cart is optional; visual feedback only
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("en-EG", { style: "currency", currency: product.currency, minimumFractionDigits: 0 }).format(p);

  return (
    <main className="min-h-screen text-primary" style={{ backgroundColor: "var(--background)", fontFamily: "var(--font-sans)" }}>
      <MarketingNav />

      {/* Breadcrumb */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 pt-4 pb-2">
        <div className="flex items-center justify-between">
          <Link href="/marketplace" className="flex items-center gap-1.5 text-[12px] text-white/40 hover:text-white/70 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Marketplace
          </Link>
        </div>
      </div>

      {/* Product Detail */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/[0.06] bg-[var(--background)]">
              <ProductImage product={product} />
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-white/40 px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  {category?.code || product.category}
                </span>
                {product.supplierTier === "PREMIER" && (
                  <span className="text-[10px] uppercase tracking-wider font-bold text-amber-400 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
                    Premier
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{product.name}</h1>
              {product.description && <p className="text-sm text-white/40 mt-1">{product.description}</p>}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium text-white/70">{product.supplierRating.toFixed(1)}</span>
                <span className="text-xs text-white/25">({product.supplierReviewCount} reviews)</span>
              </div>
              <span className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1 text-xs text-white/30">
                <MapPin className="w-3 h-3" />
                {product.supplierCity}
              </div>
              <span className="w-px h-4 bg-white/10" />
              <div className="flex items-center gap-1 text-xs text-white/30">
                <ShieldCheck className="w-3 h-3" />
                Verified Supplier
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-white tracking-tight">
                {formatPrice(product.unitPrice)}
              </span>
              <span className="text-xs text-white/25">/ {product.unitOfMeasure}</span>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {!inStock ? (
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 bg-red-500/10 border border-red-500/20">
                  Out of Stock
                </span>
              ) : lowStock ? (
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20">
                  Low Stock — {product.stockQuantity} units left
                </span>
              ) : (
                <span className="px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                  In Stock — {product.stockQuantity} units available
                </span>
              )}
              <span className="text-xs text-white/25">MOQ: {product.minOrderQty} {product.unitOfMeasure}</span>
            </div>

            {/* Quantity */}
            {inStock && (
              <div className="flex items-center gap-4">
                <span className="text-sm text-white/50">Quantity</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))}
                    className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium text-white">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center text-white/50 hover:text-white hover:border-white/20 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                style={{ backgroundColor: accent }}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={() =>
                  inCompare
                    ? removeFromCompare(product.id)
                    : addToCompare({
                        id: product.id,
                        name: product.name,
                        category: product.category,
                        unitPrice: product.unitPrice,
                        currency: product.currency,
                        supplierName: product.supplierName,
                        supplierRating: product.supplierRating,
                        supplierTier: product.supplierTier,
                        supplierCity: product.supplierCity,
                        stockQuantity: product.stockQuantity,
                        leadTimeDays: product.leadTimeDays,
                        minOrderQty: product.minOrderQty,
                        unitOfMeasure: product.unitOfMeasure,
                      })
                }
                className={`p-3 rounded-xl border transition-colors ${
                  inCompare
                    ? "text-white"
                    : "bg-white/[0.03] text-white/40 hover:text-white hover:border-white/[0.14]"
                }`}
                style={inCompare ? { backgroundColor: accent, borderColor: accent } : { borderColor: "rgba(255,255,255,0.08)" }}
                title={inCompare ? "Remove from compare" : "Add to compare"}
              >
                <Scale className="w-5 h-5" />
              </button>
            </div>

            {/* Supplier */}
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-2">Supplier</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">{product.supplierName}</p>
                  <p className="text-xs text-white/30">{product.supplierCity}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-sm text-white/60">{product.supplierRating.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Lead Time</p>
                <p className="text-sm text-white mt-0.5">{product.leadTimeDays} days</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">SKU</p>
                <p className="text-sm text-white mt-0.5 font-mono">{product.sku}</p>
              </div>
              {product.shelfLifeDays && (
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] text-white/20 uppercase">Shelf Life</p>
                  <p className="text-sm text-white mt-0.5">{product.shelfLifeDays} days</p>
                </div>
              )}
              {product.temperatureReq && (
                <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-[10px] text-white/20 uppercase">Storage</p>
                  <p className="text-sm text-white mt-0.5">{product.temperatureReq}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">More from {category?.label || product.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((rp) => (
                <motion.div key={rp.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                  <Link href={`/marketplace/${rp.id}`} className="block rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.10] transition-all">
                    <div className="aspect-[4/3] overflow-hidden">
                      <ProductImage product={rp} />
                    </div>
                    <div className="p-3">
                      <p className="text-[12px] font-medium text-white/90 line-clamp-2">{rp.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-[12px] font-bold text-white">{formatPrice(rp.unitPrice)}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-[10px] text-white/40">{rp.supplierRating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <CompareDrawer />
      <MarketingFooter />
    </main>
  );
}
