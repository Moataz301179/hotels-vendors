"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Star,
  MapPin,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Check,
  ArrowRight,
  Crown,
  ShoppingBag,
} from "lucide-react";
import { getCategoryById } from "@/lib/marketplace/categories";
import { getProductImage } from "@/lib/marketplace/product-images";
import catalogData from "@/data/catalog-products.json";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { useCart } from "@/components/cart/cart-context";

const ALL_PRODUCTS = (catalogData as { products: any[] }).products;

function ProductImage({ product }: { product: any }) {
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
  const initials = resolved.type === "gradient" ? resolved.initials : product.name.split(" ").slice(0, 2).map((w: string) => w[0]).join("").toUpperCase();

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

export default function ProductDetailClient({ productId }: { productId: string }) {
  const product = ALL_PRODUCTS.find((p) => p.id === productId);
  const [qty, setQty] = useState(product?.minOrderQty || 1);
  const [added, setAdded] = useState(false);
  const [memberMode, setMemberMode] = useState(false);
  const { addItem, openCart, totalItems } = useCart();

  if (!product) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center gap-4">
        <Package className="w-12 h-12 text-white/10" />
        <h1 className="text-xl font-semibold text-white">Product Not Found</h1>
        <Link href="/marketplace" className="px-4 py-2 rounded-xl text-sm text-white bg-[#8B0000] hover:bg-[#6B0000] transition-colors">
          Back to Marketplace
        </Link>
      </div>
    );
  }

  const cat = getCategoryById(product.category);
  const related = ALL_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4);

  const formatPrice = (p: number, c: string) =>
    new Intl.NumberFormat("en-EG", { style: "currency", currency: c, minimumFractionDigits: 0 }).format(p);

  const memberPrice = Math.round(product.unitPrice * 0.92);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      unitPrice: memberMode ? memberPrice : product.unitPrice,
      supplierId: product.id,
      supplierName: product.supplierName,
      image: getProductImage(product).type === "url" ? (getProductImage(product) as any).src : undefined,
    }, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <MarketingNav />

      {/* Sub-header */}
      <div className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#050505]/90 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/marketplace" className="inline-flex items-center gap-2 text-[12px] text-white/30 hover:text-white/60 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Marketplace</span>
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMemberMode(!memberMode)}
              className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                memberMode ? "bg-[#8B0000] text-white" : "text-white/40 hover:text-white/70 border border-white/[0.06]"
              }`}
            >
              <Crown className="w-3 h-3" />
              Member
              {memberMode && <Check className="w-3 h-3" />}
            </button>
            <button
              onClick={openCart}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/[0.06] text-white/60 hover:text-white hover:border-white/[0.12] transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8B0000] text-white text-[10px] font-bold flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6">
        {/* Product */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <div className="relative aspect-square rounded-2xl border border-white/[0.06] overflow-hidden">
              <ProductImage product={product} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                    product.stockQuantity === 0
                      ? "text-red-400 bg-red-500/10 border-red-500/20"
                      : product.stockQuantity < 20
                      ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
                      : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                  }`}
                >
                  {product.stockQuantity === 0 ? "Out of Stock" : product.stockQuantity < 20 ? "Low Stock" : "In Stock"}
                </span>
                {product.supplierTier === "PREMIER" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold border bg-white/10 text-white border-white/20">
                    Premier
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold border bg-white/5 text-white/60 border-white/10">
                {cat?.label || product.category}
              </span>
              <span className="text-xs text-white/20 font-mono">{product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold text-white">{product.name}</h1>
            <p className="text-sm text-white/40">{product.description}</p>

            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium text-white">{product.supplierRating.toFixed(1)}</span>
              <span className="text-xs text-white/25">({product.supplierReviewCount})</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <MapPin className="w-3.5 h-3.5 text-white/20" />
              <span className="text-xs text-white/30">{product.supplierCity}</span>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.06] bg-[#0a0a0a]">
              {memberMode ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-white">EGP {memberPrice.toLocaleString()}</span>
                  <span className="text-lg text-white/25 line-through">{formatPrice(product.unitPrice, product.currency)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full text-white bg-[#8B0000]">-8%</span>
                </div>
              ) : (
                <span className="text-3xl font-bold text-white">{formatPrice(product.unitPrice, product.currency)}</span>
              )}
              <span className="text-sm text-white/30 ml-2">/ {product.unitOfMeasure}</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#0a0a0a] overflow-hidden">
                <button onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))} className="px-4 py-3 text-white/40 hover:text-white transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-medium text-white min-w-[4rem] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))} className="px-4 py-3 text-white/40 hover:text-white transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all disabled:bg-white/[0.03] disabled:text-white/20 bg-[#8B0000] hover:bg-[#6B0000]"
              >
                {added ? <><Check className="w-5 h-5" /><span>Added to Cart</span></> : <><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></>}
              </button>
            </div>

            {added && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-white/60">
                Added to cart. <button onClick={openCart} className="underline font-medium">View cart</button> or <Link href="/login" className="underline font-medium">sign in</Link> to checkout.
              </motion.p>
            )}

            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400">ETA E-Invoicing Compliant</span>
            </div>

            <div className="p-5 rounded-xl border border-white/[0.06] bg-[#0a0a0a]">
              <p className="text-xs font-semibold text-white/30 uppercase mb-3">Supplier</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-sm font-bold text-white">
                  {product.supplierName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{product.supplierName}</p>
                  <div className="flex items-center gap-2 text-xs text-white/30">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{product.supplierRating.toFixed(1)}</span>
                    <span>({product.supplierReviewCount})</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <MapPin className="w-3 h-3" />
                    <span>{product.supplierCity}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specs */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-white mb-4">Specifications</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-xl overflow-hidden border border-white/[0.06]">
            {[
              { label: "SKU", value: product.sku },
              { label: "Category", value: cat?.label || product.category },
              { label: "Unit", value: product.unitOfMeasure },
              { label: "Min Order", value: `${product.minOrderQty} ${product.unitOfMeasure}` },
              { label: "Stock", value: `${product.stockQuantity} ${product.unitOfMeasure}` },
              { label: "Lead Time", value: `${product.leadTimeDays} days` },
              { label: "Shelf Life", value: product.shelfLifeDays ? `${product.shelfLifeDays} days` : "N/A" },
              { label: "Storage", value: product.temperatureReq || "Room Temp" },
            ].map((s) => (
              <div key={s.label} className="p-4 bg-[#0a0a0a]">
                <p className="text-[10px] uppercase tracking-wider text-white/25 font-semibold mb-1">{s.label}</p>
                <p className="text-sm text-white/80 font-medium">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold text-white mb-4">More from {cat?.label || product.category}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/marketplace/${p.id}`}
                  className="group p-3 rounded-xl border border-white/[0.06] bg-[#0a0a0a] hover:border-white/[0.10] transition-colors"
                >
                  <div className="h-24 rounded-lg overflow-hidden mb-3">
                    <ProductImage product={p} />
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/5 text-white/40">{p.sku}</span>
                    <span className="text-[9px] text-white/20">{getCategoryById(p.category)?.label || p.category}</span>
                  </div>
                  <p className="text-sm font-medium text-white line-clamp-1 group-hover:text-white/80 transition-colors">{p.name}</p>
                  <p className="text-sm text-white/40 mt-1">{formatPrice(p.unitPrice, p.currency)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <MarketingFooter />
    </div>
  );
}
