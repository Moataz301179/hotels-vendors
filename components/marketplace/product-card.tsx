"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ShoppingCart, Heart, Eye, Package, MapPin, Scale } from "lucide-react";
import { motion } from "framer-motion";
import { getCategoryById } from "@/lib/marketplace/categories";
import { useCompare } from "./compare-context";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  subcategory?: string;
  unitPrice: number;
  currency: string;
  stockQuantity: number;
  minOrderQty: number;
  supplierName: string;
  supplierTier: string;
  supplierRating: number;
  supplierReviewCount: number;
  supplierCity: string;
  images?: string[];
  unitOfMeasure: string;
  temperatureReq?: string;
  shelfLifeDays?: number;
  leadTimeDays: number;
  onAddToCart?: (id: string, qty: number) => void;
  onViewDetails?: (id: string) => void;
  compareData?: {
    id: string;
    name: string;
    category: string;
    unitPrice: number;
    currency: string;
    supplierName: string;
    supplierRating: number;
    supplierTier: string;
    supplierCity: string;
    stockQuantity: number;
    leadTimeDays: number;
    minOrderQty: number;
    unitOfMeasure: string;
  };
}

export function ProductCard({
  id,
  name,
  description,
  sku,
  category,
  subcategory,
  unitPrice,
  currency,
  stockQuantity,
  minOrderQty,
  supplierName,
  supplierTier,
  supplierRating,
  supplierReviewCount,
  supplierCity,
  images,
  unitOfMeasure,
  temperatureReq,
  shelfLifeDays,
  leadTimeDays,
  onAddToCart,
  onViewDetails,
  compareData,
}: ProductCardProps) {
  const { addItem, removeItem, isInCompare } = useCompare();
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [qty, setQty] = useState(minOrderQty);
  const inCompare = compareData ? isInCompare(compareData.id) : false;

  const stockStatus =
    stockQuantity === 0
      ? { label: "Out of Stock", color: "text-red-400 bg-red-500/10 border-red-500/20" }
      : stockQuantity < minOrderQty * 3
      ? { label: "Low Stock", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" }
      : { label: "In Stock", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };

  const tempBadge = temperatureReq
    ? temperatureReq.includes("Frozen")
      ? "❄️ Frozen"
      : temperatureReq.includes("Cold")
      ? "🧊 Cold"
      : "🌡️ " + temperatureReq
    : null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
    }).format(price);
  };

  return (
    <motion.div
      className="group relative flex flex-col rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-[#800000]/40 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Image Area */}
      <div className="relative aspect-[4/3] bg-black overflow-hidden">
        {images && images.length > 0 ? (
          <Image
            src={images[0]}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#800000]/10 to-transparent">
            <Package className="w-12 h-12 text-white/10" />
          </div>
        )}

        {/* Overlays */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${stockStatus.color}`}>
            {stockStatus.label}
          </span>
          {supplierTier === "PREMIER" && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#800000]/20 text-[#ff4d4d] border border-[#800000]/30">
              Premier
            </span>
          )}
        </div>

        {/* Hover Actions */}
        <motion.div
          className="absolute top-3 right-3 flex flex-col gap-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md border transition-colors ${
              isWishlisted
                ? "bg-[#800000] border-[#800000] text-white"
                : "bg-black/40 border-white/10 text-white/60 hover:text-white hover:border-white/30"
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={() => onViewDetails?.(id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md bg-black/40 border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          {compareData && (
            <button
              onClick={() => inCompare ? removeItem(compareData.id) : addItem(compareData)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center backdrop-blur-md border transition-colors ${
                inCompare
                  ? "bg-[#800000] border-[#800000] text-white"
                  : "bg-black/40 border-white/10 text-white/60 hover:text-white hover:border-white/30"
              }`}
            >
              <Scale className="w-4 h-4" />
            </button>
          )}
        </motion.div>

        {/* Temp Badge */}
        {tempBadge && (
          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-[10px] text-blue-300 font-medium">
            {tempBadge}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 p-4">
        {/* Category */}
        <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-wider">
          <span>{getCategoryById(category)?.label || category}</span>
          {subcategory && (
            <>
              <span className="w-1 h-1 rounded-full bg-white/20" />
              <span>{subcategory}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-white/90 leading-snug line-clamp-2 min-h-[2.5rem]">
          {name}
        </h3>

        {/* SKU */}
        <p className="text-[10px] text-white/30 font-mono">{sku}</p>

        {/* Supplier Info */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-white/70">{supplierRating.toFixed(1)}</span>
            <span className="text-[10px] text-white/30">({supplierReviewCount})</span>
          </div>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <div className="flex items-center gap-1 text-[10px] text-white/40">
            <MapPin className="w-3 h-3" />
            <span>{supplierCity}</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-lg font-bold text-white tracking-tight">
            {formatPrice(unitPrice)}
          </span>
          <span className="text-xs text-white/40">/ {unitOfMeasure}</span>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-[10px] text-white/30">
          <span>Min: {minOrderQty} {unitOfMeasure}</span>
          <span>Lead: {leadTimeDays}d</span>
          {shelfLifeDays && <span>Shelf: {shelfLifeDays}d</span>}
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex items-center gap-2 mt-1">
          <div className="flex items-center rounded-lg border border-white/[0.08] bg-white/[0.03] overflow-hidden">
            <button
              onClick={() => setQty(Math.max(minOrderQty, qty - 1))}
              className="px-2.5 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              −
            </button>
            <span className="px-2 py-1.5 text-xs font-medium text-white min-w-[2.5rem] text-center">
              {qty}
            </span>
            <button
              onClick={() => setQty(Math.min(stockQuantity, qty + 1))}
              className="px-2.5 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors"
            >
              +
            </button>
          </div>
          <button
            onClick={() => onAddToCart?.(id, qty)}
            disabled={stockQuantity === 0}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#800000] hover:bg-[#990000] disabled:bg-white/[0.05] disabled:text-white/20 text-white text-sm font-medium transition-all active:scale-[0.98]"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
        </div>

        {/* Supplier Name */}
        <p className="text-[10px] text-white/30 truncate">
          Sold by <span className="text-white/50">{supplierName}</span>
        </p>
      </div>
    </motion.div>
  );
}
