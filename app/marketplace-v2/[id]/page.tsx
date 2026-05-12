"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Star,
  MapPin,
  Package,
  Clock,
  ShoppingCart,
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from "lucide-react";
import { getProductImage } from "@/lib/marketplace/product-images";
import { getCategoryById } from "@/lib/marketplace/categories";
import { CartProvider, useCart } from "@/components/cart/cart-context";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { SupplierBadge } from "@/components/marketplace-v2/supplier-badge";
import { PriceDisplay, parseVolumeTiers } from "@/components/marketplace-v2/price-display";
import catalogData from "@/data/catalog-products.json";

const ALL_PRODUCTS: any[] = (catalogData as { products: any[] }).products;

function ProductDetailV2Inner() {
  const params = useParams();
  const id = params.id as string;
  const product = ALL_PRODUCTS.find((p) => p.id === id);
  const { addItem, openCart } = useCart();

  const [qty, setQty] = useState(product?.minOrderQty || 1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-gray-50">
        <MarketingNav />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h1>
          <p className="text-gray-500 mb-4">This product may have been removed or is no longer available.</p>
          <Link
            href="/marketplace-v2"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B0000] text-white text-sm font-medium hover:bg-[#6B0512]"
          >
            <ArrowLeft size={14} />
            Back to Marketplace
          </Link>
        </div>
        <MarketingFooter />
      </main>
    );
  }

  const resolvedImage = getProductImage(product);
  const cat = getCategoryById(product.category);
  const tiers = parseVolumeTiers(product.volumeTiers);

  const stockStatus =
    product.stockQuantity === 0
      ? { label: "Out of Stock", className: "bg-red-50 text-red-700 border-red-200" }
      : product.stockQuantity < product.minOrderQty * 3
      ? { label: "Low Stock", className: "bg-amber-50 text-amber-700 border-amber-200" }
      : { label: "In Stock", className: "bg-green-50 text-green-700 border-green-200" };

  const badges: ("verified" | "premier" | "coastal" | "fast" | "premium")[] = [];
  if (product.supplierTier === "PREMIER") badges.push("premier");
  if (product.supplierTier === "VERIFIED") badges.push("verified");
  if (product.supplierBadges?.includes("fast")) badges.push("fast");

  return (
    <main className="min-h-screen bg-gray-50">
      <MarketingNav />

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <Link href="/marketplace-v2" className="hover:text-[#8B0000]">
            Marketplace
          </Link>
          <span>/</span>
          <span className="text-gray-400">{cat?.label || product.category}</span>
          <span>/</span>
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
              {resolvedImage.type === "url" && !imageError ? (
                <Image
                  src={resolvedImage.src}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  onError={() => setImageError(true)}
                  priority
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: resolvedImage.type === "gradient"
                      ? `linear-gradient(135deg, ${resolvedImage.colors[0]} 0%, ${resolvedImage.colors[1]} 50%, ${resolvedImage.colors[2]} 100%)`
                      : "linear-gradient(135deg, #8B0000 0%, #6B0512 100%)",
                  }}
                >
                  <div className="text-center">
                    <span className="text-5xl font-bold text-white/25 tracking-tight">
                      {resolvedImage.type === "gradient" ? resolvedImage.initials : "HV"}
                    </span>
                    <p className="text-xs text-white/15 uppercase tracking-wider mt-2">
                      {product.category.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${stockStatus.className}`}>
                  {stockStatus.label}
                </span>
                {badges.map((b) => (
                  <SupplierBadge key={b} type={b} size="md" />
                ))}
              </div>

              {/* Wishlist */}
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center border transition-all ${
                  isWishlisted
                    ? "bg-[#8B0000] border-[#8B0000] text-white"
                    : "bg-white/80 backdrop-blur-sm border-gray-200 text-gray-400 hover:text-[#8B0000]"
                }`}
              >
                <Heart size={18} className={isWishlisted ? "fill-current" : ""} />
              </button>
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex flex-col gap-4"
          >
            {/* Category */}
            <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-wider">
              <span>{cat?.label || product.category}</span>
              {product.subcategory && (
                <>
                  <span>·</span>
                  <span>{product.subcategory}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* SKU */}
            <p className="text-xs text-gray-400 font-mono">{product.sku}</p>

            {/* Supplier */}
            <div className="flex items-center gap-3 flex-wrap">
              {product.supplierRating > 0 && (
                <div className="flex items-center gap-1">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-sm font-medium text-gray-700">{product.supplierRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-400">({product.supplierReviewCount})</span>
                </div>
              )}
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} />
                {product.supplierCity}
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <ShieldCheck size={12} />
                {product.supplierName}
              </div>
            </div>

            {/* Price */}
            <PriceDisplay
              unitPrice={product.unitPrice}
              currency={product.currency}
              unitOfMeasure={product.unitOfMeasure}
              volumeTiers={tiers}
              isB2B={true}
            />

            {/* Meta */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                <Package size={16} className="mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Min Order</p>
                <p className="text-sm font-semibold text-gray-900">
                  {product.minOrderQty} {product.unitOfMeasure}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                <Clock size={16} className="mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Lead Time</p>
                <p className="text-sm font-semibold text-gray-900">{product.leadTimeDays} days</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                <Truck size={16} className="mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">Delivery</p>
                <p className="text-sm font-semibold text-gray-900">48h Express</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                <BadgeCheck size={16} className="mx-auto text-gray-400 mb-1" />
                <p className="text-xs text-gray-500">ETA Ready</p>
                <p className="text-sm font-semibold text-gray-900">Compliant</p>
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center rounded-xl border border-gray-200 bg-white overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))}
                  className="px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <Minus size={14} />
                </button>
                <span className="px-3 py-2.5 text-sm font-medium text-gray-900 min-w-[3rem] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))}
                  className="px-3 py-2.5 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                onClick={() => {
                  addItem(
                    {
                      productId: product.id,
                      name: product.name,
                      sku: product.sku,
                      unitPrice: product.unitPrice,
                      supplierId: product.supplierId || "unknown",
                      supplierName: product.supplierName || "Unknown",
                      image: product.images?.[0],
                    },
                    qty
                  );
                  openCart();
                }}
                disabled={product.stockQuantity === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#8B0000] hover:bg-[#6B0512] disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium transition-all active:scale-[0.98]"
              >
                <ShoppingCart size={16} />
                Add to Cart
              </button>
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Specs */}
            {product.specs && (
              <div className="bg-white rounded-xl border border-gray-200 p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-2">Specifications</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(JSON.parse(product.specs)).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-500">{key}</span>
                      <span className="text-gray-900 font-medium">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <MarketingFooter />
    </main>
  );
}

export default function ProductDetailV2Page() {
  return (
    <CartProvider>
      <ProductDetailV2Inner />
    </CartProvider>
  );
}
