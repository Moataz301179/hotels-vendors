"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Package, Star, MapPin, Truck, ShieldCheck, ArrowLeft, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { getCategoryById } from "@/lib/marketplace/categories";
import catalogData from "@/data/catalog-products.json";

const ALL_PRODUCTS = (catalogData as { products: any[] }).products;

export default function PublicProductDetailPage() {
  const params = useParams();
  const product = ALL_PRODUCTS.find((p) => p.id === params.id);
  const [qty, setQty] = useState(product?.minOrderQty || 1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Package className="w-12 h-12 text-white/20" />
        <h1 className="text-xl font-semibold">Product Not Found</h1>
        <Link href="/catalog" className="px-4 py-2 rounded-lg bg-[#FF5C00] text-white text-sm">Back to Catalog</Link>
      </div>
    );
  }

  const cat = getCategoryById(product.category);
  const related = ALL_PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const formatPrice = (p: number, c: string) =>
    new Intl.NumberFormat("en-EG", { style: "currency", currency: c, minimumFractionDigits: 0 }).format(p);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#FF5C00]/15 border border-[#FF5C00]/25 flex items-center justify-center">
              <Image src="/logo-horse-only.png" alt="" width={24} height={24} className="opacity-90" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight">Hotels Vendors</h1>
              <p className="text-[9px] text-white/30 uppercase tracking-wider">Procurement Hub</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/catalog" className="text-sm text-white/50 hover:text-white transition-colors">Catalog</Link>
            <Link href="/login" className="px-4 py-2 rounded-lg bg-[#FF5C00] hover:bg-[#e65100] text-white text-sm font-medium transition-colors">Sign In</Link>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <Link href="/catalog" className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 mb-6">
          <ArrowLeft className="w-4 h-4" /><span>Back to Catalog</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="relative aspect-square rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-[#FF5C00]/5 to-transparent">
              <Package className="w-20 h-20 text-white/10 mb-4" />
              <span className="text-sm text-white/20 font-mono">{product.sku}</span>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${product.stockQuantity === 0 ? "text-red-400 bg-red-500/10 border-red-500/20" : product.stockQuantity < 20 ? "text-amber-400 bg-amber-500/10 border-amber-500/20" : "text-emerald-400 bg-emerald-500/10 border-emerald-500/20"}`}>
                  {product.stockQuantity === 0 ? "Out of Stock" : product.stockQuantity < 20 ? "Low Stock" : "In Stock"}
                </span>
                {product.supplierTier === "PREMIER" && <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF5C00]/20 text-[#ff7a33] border border-[#FF5C00]/30">Premier</span>}
              </div>
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-[#FF5C00]/15 text-[#ff7a33] text-xs font-semibold border border-[#FF5C00]/25">{cat?.label || product.category}</span>
              <span className="text-xs text-white/30 font-mono">{product.sku}</span>
            </div>
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="text-sm text-white/50">{product.description}</p>
            <div className="flex items-center gap-3">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-medium">{product.supplierRating.toFixed(1)}</span>
              <span className="text-xs text-white/30">({product.supplierReviewCount})</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <MapPin className="w-3.5 h-3.5 text-white/30" />
              <span className="text-xs text-white/40">{product.supplierCity}</span>
            </div>
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <span className="text-3xl font-bold">{formatPrice(product.unitPrice, product.currency)}</span>
              <span className="text-sm text-white/40 ml-2">/ {product.unitOfMeasure}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                <button onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))} className="px-4 py-3 text-white/60"><Minus className="w-4 h-4" /></button>
                <span className="px-4 text-sm font-medium min-w-[4rem] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))} className="px-4 py-3 text-white/60"><Plus className="w-4 h-4" /></button>
              </div>
              <button onClick={() => setAdded(true)} disabled={product.stockQuantity === 0} className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-[#e65100] disabled:bg-white/[0.05] text-white font-medium transition-all">
                {added ? <><Check className="w-5 h-5" /><span>Sign in to Order</span></> : <><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></>}
              </button>
            </div>
            {added && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-[#ff7a33]">Please <Link href="/login" className="underline">sign in</Link> to place orders</motion.p>}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400">ETA E-Invoicing Compliant</span>
            </div>
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <p className="text-xs font-semibold text-white/40 uppercase mb-3">Supplier</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF5C00]/15 border border-[#FF5C00]/25 flex items-center justify-center text-sm font-bold text-[#ff7a33]">{product.supplierName.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium">{product.supplierName}</p>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span>{product.supplierRating.toFixed(1)}</span>
                    <span>({product.supplierReviewCount})</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <MapPin className="w-3 h-3" /><span>{product.supplierCity}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specs */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Specifications</h2>
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
              <div key={s.label} className="p-4 bg-white/[0.02]">
                <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-1">{s.label}</p>
                <p className="text-sm text-white/80 font-medium">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold mb-4">More from {cat?.label || product.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((p) => (
                <Link key={p.id} href={`/catalog/${p.id}`} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#FF5C00]/30 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#FF5C00]/15 text-[#ff7a33]">{p.sku}</span>
                    <span className="text-[10px] text-white/30">{getCategoryById(p.category)?.label || p.category}</span>
                  </div>
                  <p className="text-sm font-medium line-clamp-2">{p.name}</p>
                  <p className="text-sm text-white/50 mt-1">{formatPrice(p.unitPrice, p.currency)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
