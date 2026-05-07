"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronRight,
  Star,
  ShoppingCart,
  Heart,
  Scale,
  Package,
  Truck,
  ShieldCheck,
  MapPin,
  Check,
  Minus,
  Plus,
  Clock,
  Thermometer,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { getCategoryById } from "@/lib/marketplace/categories";
import { useCompare } from "@/components/marketplace/compare-context";
import { ProductCard } from "@/components/marketplace/product-card";
import catalogData from "@/data/catalog-products.json";

interface Product {
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
  shelfLifeDays: number | null;
  temperatureReq: string | null;
  images: string[] | null;
  supplierName: string;
  supplierTier: string;
  supplierRating: number;
  supplierReviewCount: number;
  supplierCity: string;
}

const ALL_PRODUCTS: Product[] = (catalogData as { products: Product[] }).products;

// Bulk pricing tiers
function getBulkTiers(unitPrice: number) {
  return [
    { qty: 1, price: unitPrice, discount: 0 },
    { qty: 10, price: Math.round(unitPrice * 0.95), discount: 5 },
    { qty: 50, price: Math.round(unitPrice * 0.90), discount: 10 },
    { qty: 100, price: Math.round(unitPrice * 0.85), discount: 15 },
    { qty: 500, price: Math.round(unitPrice * 0.80), discount: 20 },
  ];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const product = useMemo(() => ALL_PRODUCTS.find((p) => p.id === productId), [productId]);

  const [qty, setQty] = useState(product?.minOrderQty || 1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const { addItem, removeItem, isInCompare } = useCompare();

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <Package className="w-12 h-12 text-white/20" />
        <h1 className="text-xl font-semibold">Product Not Found</h1>
        <p className="text-sm text-white/40">This product may have been removed or the URL is incorrect.</p>
        <Link
          href="/hotel/catalog"
          className="px-4 py-2 rounded-lg bg-[#FF5C00] hover:bg-[#e65100] text-white text-sm font-medium transition-colors"
        >
          Back to Catalog
        </Link>
      </div>
    );
  }

  const category = getCategoryById(product.category);
  const bulkTiers = getBulkTiers(product.unitPrice);
  const activeTier = bulkTiers.slice().reverse().find((t) => qty >= t.qty) || bulkTiers[0];
  const unitPrice = activeTier.price;
  const totalPrice = unitPrice * qty;

  const stockStatus =
    product.stockQuantity === 0
      ? { label: "Out of Stock", color: "text-red-400 bg-red-500/10 border-red-500/20" }
      : product.stockQuantity < product.minOrderQty * 3
      ? { label: "Low Stock", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" }
      : { label: "In Stock", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };

  const relatedProducts = ALL_PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const inCompare = isInCompare(product.id);

  const handleAddToCart = () => {
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-EG", { style: "currency", currency: product.currency, minimumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb */}
      <div className="border-b border-white/[0.06]">
        <div className="max-w-[1400px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-white/40">
            <Link href="/hotel" className="hover:text-white/70 transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/hotel/catalog" className="hover:text-white/70 transition-colors">Catalog</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-white/60">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/hotel/catalog")}
          className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="relative aspect-square rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              {product.images && product.images.length > 0 ? (
                <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#FF5C00]/5 to-transparent">
                  <Package className="w-20 h-20 text-white/10 mb-4" />
                  <span className="text-sm text-white/20">{product.sku}</span>
                </div>
              )}
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${stockStatus.color}`}>
                  {stockStatus.label}
                </span>
                {product.supplierTier === "PREMIER" && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FF5C00]/20 text-[#ff7a33] border border-[#FF5C00]/30">
                    Premier Supplier
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right: Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="flex flex-col gap-5"
          >
            {/* Category & SKU */}
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-[#FF5C00]/15 text-[#ff7a33] text-xs font-semibold border border-[#FF5C00]/25">
                {category?.label || product.category}
              </span>
              <span className="text-xs text-white/30 font-mono">{product.sku}</span>
            </div>

            {/* Name */}
            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>

            {/* Description */}
            {product.description && (
              <p className="text-sm text-white/50 leading-relaxed">{product.description}</p>
            )}

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-sm font-medium">{product.supplierRating.toFixed(1)}</span>
              </div>
              <span className="text-xs text-white/30">({product.supplierReviewCount} reviews)</span>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span className="text-xs text-white/40">{product.supplierCity}</span>
            </div>

            {/* Price */}
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-white">{formatPrice(totalPrice)}</span>
                <span className="text-sm text-white/40">for {qty} {product.unitOfMeasure}</span>
                {activeTier.discount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                    Save {activeTier.discount}%
                  </span>
                )}
              </div>
              <p className="text-xs text-white/30 mt-1">
                {formatPrice(unitPrice)} / {product.unitOfMeasure} (bulk pricing applied)
              </p>
            </div>

            {/* Bulk Pricing Tiers */}
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-2">Bulk Pricing</p>
              <div className="grid grid-cols-5 gap-2">
                {bulkTiers.map((tier) => (
                  <button
                    key={tier.qty}
                    onClick={() => setQty(Math.max(tier.qty, product.minOrderQty))}
                    className={`p-2 rounded-lg border text-center transition-all ${
                      qty >= tier.qty
                        ? "bg-[#FF5C00]/15 border-[#FF5C00]/30 text-white"
                        : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:text-white/60"
                    }`}
                  >
                    <div className="text-xs font-bold">{tier.qty}+</div>
                    <div className="text-[10px] text-white/40">{formatPrice(tier.price)}</div>
                    {tier.discount > 0 && (
                      <div className="text-[9px] text-emerald-400">-{tier.discount}%</div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden">
                <button
                  onClick={() => setQty(Math.max(product.minOrderQty, qty - 1))}
                  className="px-4 py-3 text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-3 text-sm font-medium text-white min-w-[4rem] text-center">
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(product.stockQuantity, qty + 1))}
                  className="px-4 py-3 text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity === 0}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#FF5C00] hover:bg-[#e65100] disabled:bg-white/[0.05] disabled:text-white/20 text-white font-medium transition-all active:scale-[0.98]"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Added to Cart</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 rounded-xl border transition-colors ${
                  isWishlisted
                    ? "bg-[#FF5C00] border-[#FF5C00] text-white"
                    : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white hover:border-white/[0.14]"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>

              <button
                onClick={() =>
                  inCompare
                    ? removeItem(product.id)
                    : addItem({
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
                    ? "bg-[#FF5C00] border-[#FF5C00] text-white"
                    : "border-white/[0.08] bg-white/[0.03] text-white/40 hover:text-white hover:border-white/[0.14]"
                }`}
              >
                <Scale className="w-5 h-5" />
              </button>
            </div>

            {/* Min Order Note */}
            <p className="text-xs text-white/30">
              Minimum order: <span className="text-white/50">{product.minOrderQty} {product.unitOfMeasure}</span>
              {product.stockQuantity > 0 && (
                <span> · Available: <span className="text-white/50">{product.stockQuantity} {product.unitOfMeasure}</span></span>
              )}
            </p>

            {/* ETA Compliance Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-emerald-400">ETA E-Invoicing Compliant</span>
              <span className="text-[10px] text-white/30">· Tax invoice auto-generated on order</span>
            </div>

            {/* Supplier Card */}
            <div className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-white/40 uppercase tracking-wider">Supplier</p>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                  product.supplierTier === "PREMIER"
                    ? "bg-[#FF5C00]/15 text-[#ff7a33] border border-[#FF5C00]/25"
                    : product.supplierTier === "CORE"
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/25"
                    : "bg-white/[0.06] text-white/40 border border-white/[0.08]"
                }`}>
                  {product.supplierTier}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#FF5C00]/15 border border-[#FF5C00]/25 flex items-center justify-center text-sm font-bold text-[#ff7a33]">
                  {product.supplierName.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{product.supplierName}</p>
                  <div className="flex items-center gap-2 text-xs text-white/40">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{product.supplierRating.toFixed(1)}</span>
                    </div>
                    <span>({product.supplierReviewCount} reviews)</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{product.supplierCity}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specs Table */}
        <div className="mt-12">
          <h2 className="text-lg font-semibold mb-4">Product Specifications</h2>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-4">
              {[
                { label: "SKU", value: product.sku, icon: Package },
                { label: "Category", value: category?.label || product.category, icon: Package },
                { label: "Unit of Measure", value: product.unitOfMeasure, icon: Package },
                { label: "Min Order", value: `${product.minOrderQty} ${product.unitOfMeasure}`, icon: Package },
                { label: "Stock", value: `${product.stockQuantity} ${product.unitOfMeasure}`, icon: Package },
                { label: "Lead Time", value: `${product.leadTimeDays} days`, icon: Truck },
                { label: "Shelf Life", value: product.shelfLifeDays ? `${product.shelfLifeDays} days` : "N/A", icon: Calendar },
                { label: "Storage", value: product.temperatureReq || "Room Temperature", icon: Thermometer },
              ].map((spec, i) => (
                <div
                  key={spec.label}
                  className={`p-4 ${i < 4 ? "border-b" : ""} ${i % 4 !== 3 ? "border-r" : ""} border-white/[0.04]`}
                >
                  <p className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-1">{spec.label}</p>
                  <p className="text-sm text-white/80 font-medium">{spec.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Truck, title: "Delivery", desc: `${product.leadTimeDays} business days to Greater Cairo` },
            { icon: ShieldCheck, title: "Payment Guarantee", desc: "Platform-secured payment with factoring option" },
            { icon: Clock, title: "Reorder Alert", desc: "Auto-reminder when stock drops below reorder point" },
          ].map((item) => (
            <div key={item.title} className="flex items-start gap-3 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
              <item.icon className="w-5 h-5 text-[#ff7a33] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{item.title}</p>
                <p className="text-xs text-white/40 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-lg font-semibold mb-4">More from {category?.label || product.category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <ProductCard
                    id={p.id}
                    name={p.name}
                    description={p.description || undefined}
                    sku={p.sku}
                    category={p.category}
                    unitPrice={p.unitPrice}
                    currency={p.currency}
                    stockQuantity={p.stockQuantity}
                    minOrderQty={p.minOrderQty}
                    unitOfMeasure={p.unitOfMeasure}
                    leadTimeDays={p.leadTimeDays}
                    shelfLifeDays={p.shelfLifeDays || undefined}
                    temperatureReq={p.temperatureReq || undefined}
                    supplierName={p.supplierName}
                    supplierTier={p.supplierTier}
                    supplierRating={p.supplierRating}
                    supplierReviewCount={p.supplierReviewCount}
                    supplierCity={p.supplierCity}
                    onViewDetails={(id) => router.push(`/hotel/catalog/${id}`)}
                    compareData={{
                      id: p.id,
                      name: p.name,
                      category: p.category,
                      unitPrice: p.unitPrice,
                      currency: p.currency,
                      supplierName: p.supplierName,
                      supplierRating: p.supplierRating,
                      supplierTier: p.supplierTier,
                      supplierCity: p.supplierCity,
                      stockQuantity: p.stockQuantity,
                      leadTimeDays: p.leadTimeDays,
                      minOrderQty: p.minOrderQty,
                      unitOfMeasure: p.unitOfMeasure,
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
