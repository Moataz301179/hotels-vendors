"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, MapPin, Package, Minus, Plus } from "lucide-react";
import { getProductImage } from "@/lib/marketplace/product-images";
import { getCategoryById } from "@/lib/marketplace/categories";
import { SupplierBadge } from "./supplier-badge";
import { PriceDisplay, parseVolumeTiers } from "./price-display";

interface ProductCardV2Props {
  id: string;
  name: string;
  description?: string;
  sku: string;
  category: string;
  subcategory?: string;
  unitPrice: number;
  currency?: string;
  stockQuantity: number;
  minOrderQty: number;
  supplierName: string;
  supplierTier?: string;
  supplierRating?: number;
  supplierReviewCount?: number;
  supplierCity?: string;
  supplierBadges?: ("verified" | "premier" | "coastal" | "fast" | "premium")[];
  images?: string[];
  unitOfMeasure?: string;
  temperatureReq?: string;
  shelfLifeDays?: number;
  leadTimeDays?: number;
  volumeTiers?: string; // JSON
  isB2B?: boolean;
  onAddToCart?: (id: string, qty: number) => void;
}

export function ProductCardV2({
  id,
  name,
  sku,
  category,
  subcategory,
  unitPrice,
  currency = "EGP",
  stockQuantity,
  minOrderQty,
  supplierName,
  supplierTier,
  supplierRating = 0,
  supplierReviewCount = 0,
  supplierCity,
  supplierBadges = [],
  unitOfMeasure = "piece",
  temperatureReq,
  shelfLifeDays,
  leadTimeDays,
  volumeTiers,
  isB2B = false,
  onAddToCart,
}: ProductCardV2Props) {
  const [qty, setQty] = useState(minOrderQty);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageError, setImageError] = useState(false);

  const resolvedImage = getProductImage({ name, category });
  const cat = getCategoryById(category);
  const tiers = parseVolumeTiers(volumeTiers);

  const stockStatus =
    stockQuantity === 0
      ? { label: "Out of Stock", className: "bg-red-50 text-red-700 border-red-200" }
      : stockQuantity < minOrderQty * 3
      ? { label: "Low Stock", className: "bg-amber-50 text-amber-700 border-amber-200" }
      : { label: "In Stock", className: "bg-green-50 text-green-700 border-green-200" };

  const tempBadge = temperatureReq
    ? temperatureReq.includes("Frozen")
      ? "❄️ Frozen"
      : temperatureReq.includes("Cold")
      ? "🧊 Cold"
      : null
    : null;

  return (
    <motion.div
      className="group relative flex flex-col rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg hover:border-[#8B0000]/20 transition-all duration-300"
      whileHover={{ y: -2 }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Image */}
      <Link href={`/marketplace-v2/${id}`} className="relative aspect-[4/3] bg-gray-100 overflow-hidden block">
        {resolvedImage.type === "url" && !imageError ? (
          <Image
            src={resolvedImage.src}
            alt={name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            onError={() => setImageError(true)}
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
              <span className="text-2xl font-bold text-white/25 tracking-tight">
                {resolvedImage.type === "gradient" ? resolvedImage.initials : "HV"}
              </span>
              <p className="text-[9px] text-white/15 uppercase tracking-wider mt-0.5">
                {category.toUpperCase()}
              </p>
            </div>
          </div>
        )}

        {/* Badges overlay */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${stockStatus.className}`}>
            {stockStatus.label}
          </span>
          {supplierBadges.includes("premier") && (
            <SupplierBadge type="premier" />
          )}
          {supplierBadges.includes("fast") && (
            <SupplierBadge type="fast" />
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isWishlisted
              ? "bg-[#8B0000] border-[#8B0000] text-white"
              : "bg-white/80 backdrop-blur-sm border-gray-200 text-gray-400 hover:text-[#8B0000]"
          }`}
        >
          <Heart size={14} className={isWishlisted ? "fill-current" : ""} />
        </button>

        {/* Temp badge */}
        {tempBadge && (
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-blue-500/90 text-white text-[10px] font-medium">
            {tempBadge}
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-col gap-2 p-3 flex-1">
        {/* Category */}
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 uppercase tracking-wider">
          <span>{cat?.label || category}</span>
          {subcategory && (
            <>
              <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
              <span>{subcategory}</span>
            </>
          )}
        </div>

        {/* Title */}
        <Link href={`/marketplace-v2/${id}`}>
          <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 min-h-[2.25rem] hover:text-[#8B0000] transition-colors">
            {name}
          </h3>
        </Link>

        {/* SKU */}
        <p className="text-[10px] text-gray-300 font-mono">{sku}</p>

        {/* Supplier */}
        <div className="flex items-center gap-2 flex-wrap">
          {supplierRating > 0 && (
            <div className="flex items-center gap-0.5">
              <Star size={11} className="text-amber-400 fill-amber-400" />
              <span className="text-xs font-medium text-gray-700">{supplierRating.toFixed(1)}</span>
              <span className="text-[10px] text-gray-400">({supplierReviewCount})</span>
            </div>
          )}
          {supplierCity && (
            <div className="flex items-center gap-0.5 text-[10px] text-gray-400">
              <MapPin size={10} />
              <span>{supplierCity}</span>
            </div>
          )}
        </div>

        {/* Price */}
        <PriceDisplay
          unitPrice={unitPrice}
          currency={currency}
          unitOfMeasure={unitOfMeasure}
          volumeTiers={tiers}
          isB2B={isB2B}
        />

        {/* Meta */}
        <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-auto pt-1">
          <span className="flex items-center gap-0.5">
            <Package size={10} />
            Min {minOrderQty}
          </span>
          <span>·</span>
          <span>{leadTimeDays}d lead</span>
          {shelfLifeDays && (
            <>
              <span>·</span>
              <span>{shelfLifeDays}d shelf</span>
            </>
          )}
        </div>

        {/* Quantity + Add to Cart */}
        <div className="flex items-center gap-2 pt-1">
          <div className="flex items-center rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
            <button
              onClick={() => setQty(Math.max(minOrderQty, qty - 1))}
              className="px-2 py-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Minus size={12} />
            </button>
            <span className="px-2 py-1.5 text-xs font-medium text-gray-900 min-w-[1.5rem] text-center">
              {qty}
            </span>
            <button
              onClick={() => setQty(Math.min(stockQuantity, qty + 1))}
              className="px-2 py-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <Plus size={12} />
            </button>
          </div>
          <button
            onClick={() => onAddToCart?.(id, qty)}
            disabled={stockQuantity === 0}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-[#8B0000] hover:bg-[#6B0512] disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium transition-all active:scale-[0.98]"
          >
            <ShoppingCart size={14} />
            <span className="hidden sm:inline">Add</span>
          </button>
        </div>

        {/* Supplier name */}
        <p className="text-[10px] text-gray-400 truncate">
          by <span className="text-gray-600">{supplierName}</span>
          {supplierTier && supplierTier !== "CORE" && (
            <span className="ml-1 text-[#8B0000]">· {supplierTier}</span>
          )}
        </p>
      </div>
    </motion.div>
  );
}
