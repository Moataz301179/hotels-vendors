"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Eye,
  ShoppingCart,
  BadgeCheck,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  ArrowUpRight,
  Clock,
  Package,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Product,
  Supplier,
  CATEGORY_DISPLAY_NAMES,
  getStockStatus,
  formatEGP,
} from "./premium-types";
import marketData from "@/data/egyptian-market-real.json";

// Ripple effect hook
const useRipple = () => {
  const [ripples, setRipples] = useState<
    { x: number; y: number; id: number }[]
  >([]);
  const counterRef = useRef(0);

  const createRipple = (event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const id = counterRef.current++;
    setRipples((prev) => [...prev, { x, y, id }]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id));
    }, 600);
  };

  return { ripples, createRipple };
};

interface PremiumProductCardProps {
  product: Product;
  supplier?: Supplier;
  onQuickView?: () => void;
  index?: number;
}

export function PremiumProductCard({
  product,
  supplier,
  onQuickView,
  index = 0,
}: PremiumProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ripples, createRipple } = useRipple();

  // Get stock status based on price
  const stock = getStockStatus(product.base_price_egp);

  // Find supplier from market data if not provided
  const productSupplier =
    supplier ||
    (marketData as any).suppliers.find(
      (s: Supplier) => s.id === product.supplier_id
    );

  // Get category display name
  const categoryName =
    CATEGORY_DISPLAY_NAMES[product.category] || product.category;

  // Generate a placeholder gradient based on product name
  const getGradient = (name: string) => {
    const gradients = [
      "from-violet-600/20 via-indigo-600/20 to-purple-600/20",
      "from-blue-600/20 via-cyan-600/20 to-teal-600/20",
      "from-amber-600/20 via-orange-600/20 to-yellow-600/20",
      "from-emerald-600/20 via-green-600/20 to-lime-600/20",
      "from-rose-600/20 via-pink-600/20 to-fuchsia-600/20",
    ];
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return gradients[hash % gradients.length];
  };

  const handleContactClick = (e: React.MouseEvent<HTMLElement>) => {
    createRipple(e);
    setShowSupplierModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative"
      >
        {/* Glassmorphism Card Container */}
        <div
          className={`
            relative overflow-hidden rounded-2xl
            bg-zinc-950/80 backdrop-blur-xl
            border border-zinc-800/50
            transition-all duration-500 ease-out
            ${isHovered ? "border-indigo-500/50 shadow-2xl shadow-indigo-500/20" : ""}
          `}
          style={{
            transform: isHovered
              ? "translateY(-8px) scale(1.02)"
              : "translateY(0) scale(1)",
          }}
        >
          {/* Image Container */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950">
            {/* Background Gradient */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${getGradient(
                product.name
              )} opacity-50`}
            />

            {/* Product Category Icon Fallback */}
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="absolute inset-0 animate-pulse bg-indigo-500/20 blur-3xl rounded-full" />
                  <Package className="relative w-16 h-16 text-zinc-600" />
                </div>
              </div>
            )}

            {/* Product Image - Using supplier/category based image */}
            <Image
              src={`/api/placeholder/400/300?text=${encodeURIComponent(
                product.name.slice(0, 2)
              )}`}
              alt={product.name}
              fill
              className={`
                object-cover transition-all duration-700 ease-out
                ${isHovered ? "scale-110" : "scale-100"}
                ${imageLoaded ? "opacity-100" : "opacity-0"}
              `}
              onLoad={() => setImageLoaded(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Overlay on Hover */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                >
                  {/* Quick View Button */}
                  <div className="absolute inset-0 flex items-center justify-center gap-3">
                    <motion.button
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      onClick={onQuickView}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-md
                        border border-white/20 rounded-full text-white font-medium
                        hover:bg-white/20 transition-all duration-300
                        hover:scale-105 active:scale-95"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Quick View</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Stock Badge */}
            <div className="absolute top-3 left-3">
              <Badge
                variant="secondary"
                className={`
                  ${stock.color}/90 backdrop-blur-md border-0
                  text-white text-xs font-medium px-2.5 py-1
                `}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse" />
                {stock.label}
              </Badge>
            </div>

            {/* "Coming Soon" Badge */}
            <div className="absolute top-3 right-3">
              <Badge
                variant="outline"
                className="bg-indigo-500/90 backdrop-blur-md border-indigo-400/50
                  text-white text-xs font-medium px-2.5 py-1"
              >
                <ShoppingCart className="w-3 h-3 mr-1.5" />
                Coming Soon
              </Badge>
            </div>

            {/* Verified Supplier Badge */}
            {productSupplier?.verified && (
              <div className="absolute bottom-3 left-3">
                <Badge
                  variant="secondary"
                  className="bg-emerald-500/90 backdrop-blur-md border-0
                    text-white text-xs font-medium px-2 py-1"
                >
                  <BadgeCheck className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {/* Category & Supplier */}
            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="bg-zinc-800/80 text-zinc-300 border-zinc-700/50 text-xs"
              >
                {categoryName}
              </Badge>
              {productSupplier && (
                <button
                  onClick={() => setShowSupplierModal(true)}
                  className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300
                    transition-colors group/supplier"
                >
                  <Building2 className="w-3 h-3" />
                  <span className="truncate max-w-[100px]">
                    {productSupplier.name}
                  </span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover/supplier:opacity-100 transition-opacity" />
                </button>
              )}
            </div>

            {/* Product Name */}
            <h3 className="text-lg font-semibold text-white leading-tight line-clamp-2
              group-hover:text-indigo-300 transition-colors duration-300">
              {product.name}
            </h3>

            {/* Price Display */}
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white tracking-tight">
                {formatEGP(product.base_price_egp)}
              </span>
              <span className="text-sm text-zinc-500 font-medium">EGP</span>
              <span className="text-xs text-zinc-600 ml-1">
                / {product.unit}
              </span>
            </div>

            {/* Contact Supplier Button with Ripple */}
            <button
              onClick={handleContactClick}
              className="relative w-full overflow-hidden
                bg-gradient-to-r from-indigo-600 to-violet-600
                hover:from-indigo-500 hover:to-violet-500
                text-white font-semibold py-3.5 rounded-xl
                transition-all duration-300
                active:scale-[0.98] transform
                shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/40
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {/* Ripple Effects */}
              {ripples.map((ripple) => (
                <span
                  key={ripple.id}
                  className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
                  style={{
                    left: ripple.x - 50,
                    top: ripple.y - 50,
                    width: 100,
                    height: 100,
                  }}
                />
              ))}
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Phone className="w-4 h-4" />
                Contact Supplier
              </span>
            </button>
          </div>

          {/* Hover Gradient Border Effect */}
          {isHovered && (
            <div className="absolute inset-0 rounded-2xl pointer-events-none
              bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10" />
          )}
        </div>
      </motion.div>

      {/* Supplier Info Modal */}
      <Dialog open={showSupplierModal} onOpenChange={setShowSupplierModal}>
        <DialogContent className="sm:max-w-[500px] bg-zinc-950 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Building2 className="w-5 h-5 text-indigo-400" />
              {productSupplier?.name || "Supplier Information"}
            </DialogTitle>
          </DialogHeader>
          {productSupplier && (
            <div className="space-y-4 mt-4">
              {/* Supplier Details */}
              <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-zinc-500 mt-0.5" />
                  <span className="text-sm text-zinc-300 leading-relaxed">
                    {productSupplier.address}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-zinc-500" />
                  <a
                    href={`tel:${productSupplier.phone}`}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    {productSupplier.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-zinc-500" />
                  <a
                    href={`mailto:${productSupplier.email}`}
                    className="text-sm text-indigo-400 hover:text-indigo-300"
                  >
                    {productSupplier.email}
                  </a>
                </div>
                {(productSupplier as any).website && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-4 h-4 text-zinc-500" />
                    <a
                      href={(productSupplier as any).website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                      Visit Website
                      <ArrowUpRight className="inline w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                    <Clock className="w-3 h-3" />
                    Established
                  </div>
                  <p className="text-white font-semibold">
                    {productSupplier.years_established} years
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-2 text-zinc-500 text-xs mb-1">
                    <Sparkles className="w-3 h-3" />
                    Monthly Capacity
                  </div>
                  <p className="text-white font-semibold">
                    {formatEGP(productSupplier.monthly_capacity_egp)} EGP
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white"
                  onClick={() =>
                    window.open(
                      `tel:${productSupplier.phone}`,
                      "_self"
                    )
                  }
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call Now
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-zinc-700 hover:bg-zinc-800 text-white"
                  onClick={() =>
                    window.open(
                      `mailto:${productSupplier.email}?subject=Inquiry about ${product.name}`,
                      "_self"
                    )
                  }
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Global Styles for Ripple Animation */}
      <style jsx global>{`
        @keyframes ripple {
          to {
            transform: scale(4);
            opacity: 0;
          }
        }
        .animate-ripple {
          animation: ripple 600ms linear;
        }
      `}</style>
    </>
  );
}
