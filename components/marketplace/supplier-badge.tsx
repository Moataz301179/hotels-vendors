"use client";

import React from "react";
import { motion } from "framer-motion";
import { Building2, BadgeCheck, MapPin, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "./premium-types";

interface SupplierBadgeProps {
  supplier: Supplier;
  size?: "sm" | "md" | "lg";
  showLocation?: boolean;
  showYears?: boolean;
}

export function SupplierBadge({
  supplier,
  size = "md",
  showLocation = true,
  showYears = true,
}: SupplierBadgeProps) {
  const sizeClasses = {
    sm: {
      badge: "text-[10px] px-1.5 py-0.5",
      icon: "w-2.5 h-2.5",
    },
    md: {
      badge: "text-xs px-2 py-1",
      icon: "w-3 h-3",
    },
    lg: {
      badge: "text-sm px-2.5 py-1",
      icon: "w-3.5 h-3.5",
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center"
    >
      <div
        className={`
          flex items-center gap-1.5 rounded-lg
          bg-zinc-900/80 backdrop-blur-sm border border-zinc-800/50
          hover:border-indigo-500/30 transition-colors cursor-pointer
          group
        `}
      >
        {/* Supplier Icon */}
        <div className="flex items-center gap-1.5 px-2 py-1">
          <Building2
            className={`${sizeClasses[size].icon} text-zinc-500 group-hover:text-indigo-400 transition-colors`}
          />
          <span className={`${sizeClasses[size].badge} text-zinc-300 font-medium truncate max-w-[120px]`}>
            {supplier.name}
          </span>
        </div>

        {/* Verified Badge */}
        {supplier.verified && (
          <div className="px-1.5 border-l border-zinc-800">
            <BadgeCheck
              className={`${sizeClasses[size].icon} text-emerald-400`}
            />
          </div>
        )}

        {/* Location */}
        {showLocation && (
          <div className="hidden sm:flex items-center gap-1 px-2 border-l border-zinc-800">
            <MapPin
              className={`${sizeClasses[size].icon} text-zinc-600 group-hover:text-zinc-400 transition-colors`}
            />
            <span className={`${sizeClasses[size].badge} text-zinc-500`}>
              {supplier.city}
            </span>
          </div>
        )}

        {/* Years Established */}
        {showYears && (
          <div className="hidden md:flex items-center gap-1 px-2 border-l border-zinc-800">
            <Clock
              className={`${sizeClasses[size].icon} text-zinc-600 group-hover:text-zinc-400 transition-colors`}
            />
            <span className={`${sizeClasses[size].badge} text-zinc-500`}>
              {supplier.years_established}y
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface CompactSupplierBadgeProps {
  supplier: Supplier;
  onClick?: () => void;
}

export function CompactSupplierBadge({
  supplier,
  onClick,
}: CompactSupplierBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
        bg-zinc-900 border border-zinc-800 text-xs text-zinc-400
        hover:text-white hover:border-zinc-700 transition-all
        group"
    >
      <Building2 className="w-3 h-3 text-zinc-500 group-hover:text-indigo-400" />
      <span className="font-medium">{supplier.name}</span>
      {supplier.verified && (
        <BadgeCheck className="w-3 h-3 text-emerald-400" />
      )}
    </button>
  );
}
