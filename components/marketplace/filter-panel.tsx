"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  SlidersHorizontal,
  Check,
  MapPin,
  Building2,
  Banknote,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Supplier,
  CategoryFilter,
  CATEGORY_DISPLAY_NAMES,
  ProductCategory,
} from "./premium-types";

// Custom dual-range slider component
interface DualRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
}

function DualRangeSlider({
  min,
  max,
  value,
  onChange,
  step = 1000,
}: DualRangeSliderProps) {
  const [isDragging, setIsDragging] = useState<"min" | "max" | null>(null);
  const rangeRef = React.useRef<HTMLDivElement>(null);

  const percentage = (val: number) => ((val - min) / (max - min)) * 100;

  const handleMouseDown = (type: "min" | "max") => () => {
    setIsDragging(type);
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !rangeRef.current) return;

      const rect = rangeRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const newValue = min + x * (max - min);
      const steppedValue = Math.round(newValue / step) * step;

      if (isDragging === "min") {
        onChange([Math.min(steppedValue, value[1] - step), value[1]]);
      } else {
        onChange([value[0], Math.max(steppedValue, value[0] + step)]);
      }
    },
    [isDragging, min, max, value, step, onChange]
  );

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove]);

  return (
    <div className="py-4">
      {/* Track */}
      <div ref={rangeRef} className="relative h-2 bg-zinc-800 rounded-full cursor-pointer">
        {/* Filled range */}
        <div
          className="absolute h-full bg-gradient-to-r from-indigo-600 to-violet-600 rounded-full"
          style={{
            left: `${percentage(value[0])}%`,
            right: `${100 - percentage(value[1])}%`,
          }}
        />

        {/* Min handle */}
        <button
          onMouseDown={handleMouseDown("min")}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg
            cursor-grab active:cursor-grabbing ring-2 ring-indigo-500 z-10
            hover:scale-110 transition-transform"
          style={{ left: `${percentage(value[0])}%`, transform: `translate(-50%, -50%)` }}
        >
          {isDragging === "min" && (
            <motion.div
              layoutId="tooltip-min"
              className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1
                bg-zinc-900 text-white text-xs rounded-md whitespace-nowrap
                border border-zinc-700"
            >
              {value[0].toLocaleString()} EGP
            </motion.div>
          )}
        </button>

        {/* Max handle */}
        <button
          onMouseDown={handleMouseDown("max")}
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg
            cursor-grab active:cursor-grabbing ring-2 ring-indigo-500 z-10
            hover:scale-110 transition-transform"
          style={{ left: `${percentage(value[1])}%`, transform: `translate(-50%, -50%)` }}
        >
          {isDragging === "max" && (
            <motion.div
              layoutId="tooltip-max"
              className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1
                bg-zinc-900 text-white text-xs rounded-md whitespace-nowrap
                border border-zinc-700"
            >
              {value[1].toLocaleString()} EGP
            </motion.div>
          )}
        </button>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 text-xs text-zinc-500">
        <span>{min.toLocaleString()} EGP</span>
        <span>{max.toLocaleString()} EGP</span>
      </div>
    </div>
  );
}

// Loading Shimmer Button
interface ShimmerButtonProps {
  loading: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

function ShimmerButton({
  loading,
  children,
  onClick,
  disabled,
}: ShimmerButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative w-full overflow-hidden
        ${loading ? "" : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"}
        text-white font-semibold py-6 rounded-xl
        transition-all duration-300
      `}
      disabled={disabled || loading}
    >
      {loading && (
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
              animate-[shimmer_1.5s_infinite]"
            style={{
              transform: "translateX(-100%)",
              animation: "shimmer 1.5s infinite",
            }}
          />
        </div>
      )}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {loading ? "Applying..." : children}
      </span>
      {/* Shimmer animation keyframes */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Button>
  );
}

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  suppliers: Supplier[];
  priceRange: [number, number];
  selectedSuppliers: string[];
  selectedCategory: CategoryFilter;
  onPriceRangeChange: (range: [number, number]) => void;
  onSuppliersChange: (suppliers: string[]) => void;
  onCategoryChange: (category: CategoryFilter) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  isLoading?: boolean;
}

export function FilterPanel({
  isOpen,
  onClose,
  suppliers,
  priceRange,
  selectedSuppliers,
  selectedCategory,
  onPriceRangeChange,
  onSuppliersChange,
  onCategoryChange,
  onApplyFilters,
  onResetFilters,
  isLoading = false,
}: FilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    price: true,
    suppliers: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Calculate active filters count
  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    (selectedSuppliers.length > 0 ? selectedSuppliers.length : 0) +
    (priceRange[0] > 0 || priceRange[1] < 200000 ? 1 : 0);

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-full max-w-[380px] z-50
              bg-zinc-950 border-r border-zinc-800 shadow-2xl"
          >
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center">
                      <SlidersHorizontal className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">Filters</h2>
                      <p className="text-xs text-zinc-500">
                        {activeFiltersCount > 0
                          ? `${activeFiltersCount} active`
                          : "No active filters"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-zinc-900 text-zinc-400 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Category Section */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection("categories")}
                    className="w-full flex items-center justify-between text-sm font-medium text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                      Categories
                    </span>
                    {expandedSections.categories ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSections.categories && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {[
                          "all",
                          "amenities",
                          "linens_textiles",
                          "kitchen_equipment",
                          "cleaning_supplies",
                          "multi_category",
                        ].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => onCategoryChange(cat as CategoryFilter)}
                            className={`
                              w-full flex items-center justify-between p-3 rounded-xl
                              text-sm transition-all duration-200
                              ${
                                selectedCategory === cat
                                  ? "bg-indigo-600/20 border border-indigo-500/50 text-white"
                                  : "bg-zinc-900/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                              }
                            `}
                          >
                            <span>{CATEGORY_DISPLAY_NAMES[cat as CategoryFilter]}</span>
                            {selectedCategory === cat && (
                              <Check className="w-4 h-4 text-indigo-400" />
                            )}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="h-px bg-zinc-800" />

                {/* Price Range Section */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection("price")}
                    className="w-full flex items-center justify-between text-sm font-medium text-white"
                  >
                    <span className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-emerald-400" />
                      Price Range (EGP)
                    </span>
                    {expandedSections.price ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSections.price && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-4 overflow-hidden"
                      >
                        {/* Current Range Display */}
                        <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                          <span className="text-emerald-400 font-semibold">
                            {priceRange[0].toLocaleString()} EGP
                          </span>
                          <span className="text-zinc-600">-</span>
                          <span className="text-emerald-400 font-semibold">
                            {priceRange[1].toLocaleString()} EGP
                          </span>
                        </div>

                        {/* Dual Range Slider */}
                        <DualRangeSlider
                          min={0}
                          max={200000}
                          step={1000}
                          value={priceRange}
                          onChange={onPriceRangeChange}
                        />

                        {/* Quick Presets */}
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "Under 5K", value: [0, 5000] as [number, number] },
                            { label: "5K - 25K", value: [5000, 25000] as [number, number] },
                            { label: "25K - 100K", value: [25000, 100000] as [number, number] },
                            { label: "100K+", value: [100000, 200000] as [number, number] },
                          ].map((preset) => (
                            <button
                              key={preset.label}
                              onClick={() => onPriceRangeChange(preset.value)}
                              className={`
                                px-3 py-1.5 text-xs rounded-full transition-colors
                                ${
                                  priceRange[0] === preset.value[0] &&
                                  priceRange[1] === preset.value[1]
                                    ? "bg-indigo-600 text-white"
                                    : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                                }
                              `}
                            >
                              {preset.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Divider */}
                <div className="h-px bg-zinc-800" />

                {/* Suppliers Section */}
                <div className="space-y-3">
                  <button
                    onClick={() => toggleSection("suppliers")}
                    className="w-full flex items-center justify-between text-sm font-medium text-white"
                  >
                    <span className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      Suppliers ({suppliers.length})
                    </span>
                    {expandedSections.suppliers ? (
                      <ChevronUp className="w-4 h-4 text-zinc-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedSections.suppliers && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {selectedSuppliers.length > 0 && (
                          <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/50">
                            <span className="text-xs text-zinc-400">
                              {selectedSuppliers.length} selected
                            </span>
                            <button
                              onClick={() => onSuppliersChange([])}
                              className="text-xs text-indigo-400 hover:text-indigo-300"
                            >
                              Clear
                            </button>
                          </div>
                        )}

                        <div className="space-y-2 max-h-[300px] overflow-y-auto">
                          {suppliers.map((supplier) => (
                            <label
                              key={supplier.id}
                              className="flex items-center gap-3 p-3 rounded-xl bg-zinc-900/50 border border-zinc-800
                                hover:border-zinc-700 cursor-pointer transition-all group"
                            >
                              <Checkbox
                                checked={selectedSuppliers.includes(supplier.id)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    onSuppliersChange([
                                      ...selectedSuppliers,
                                      supplier.id,
                                    ]);
                                  } else {
                                    onSuppliersChange(
                                      selectedSuppliers.filter(
                                        (id) => id !== supplier.id
                                      )
                                    );
                                  }
                                }}
                                className="border-zinc-600 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-white font-medium truncate group-hover:text-indigo-300 transition-colors">
                                  {supplier.name}
                                </p>
                                <p className="text-xs text-zinc-500 flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {supplier.city} • {supplier.years_established} years
                                </p>
                              </div>
                              {supplier.verified && (
                                <Badge
                                  variant="secondary"
                                  className="bg-emerald-500/20 text-emerald-400 border-0 text-[10px]"
                                >
                                  Verified
                                </Badge>
                              )}
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 space-y-3">
                  <ShimmerButton
                    loading={isLoading}
                    onClick={onApplyFilters}
                  >
                    Apply Filters
                    {activeFiltersCount > 0 && (
                      <Badge
                        variant="secondary"
                        className="ml-2 bg-white/20 text-white border-0"
                      >
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </ShimmerButton>

                  {activeFiltersCount > 0 && (
                    <button
                      onClick={onResetFilters}
                      className="w-full py-2 text-sm text-zinc-400 hover:text-white transition-colors"
                    >
                      Reset all filters
                    </button>
                  )}
                </div>

                {/* Premium Badge */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-indigo-600 text-white border-0">
                      Premium
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400">
                    All suppliers are verified and meet our quality standards for
                    Egyptian hospitality businesses.
                  </p>
                </div>
              </div>
            </ScrollArea>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
