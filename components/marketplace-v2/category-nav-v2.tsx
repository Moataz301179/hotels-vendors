"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HOTEL_CATEGORIES, type HotelCategory } from "@/lib/marketplace/categories";

interface CategoryNavV2Props {
  activeCategory?: string;
  onSelect: (categoryId: string) => void;
  counts?: Record<string, number>;
}

export function CategoryNavV2({ activeCategory, onSelect, counts = {} }: CategoryNavV2Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 200;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  const allCategories: HotelCategory[] = [
    { id: "all", code: "ALL", label: "All", labelAr: "الكل", description: "", icon: "LayoutGrid", color: "", examples: [], keywords: [] },
    ...HOTEL_CATEGORIES,
  ];

  return (
    <div className="relative">
      {/* Mobile scroll buttons */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#8B0000] lg:hidden"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-500 hover:text-[#8B0000] lg:hidden"
      >
        <ChevronRight size={16} />
      </button>

      {/* Categories */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide px-8 lg:px-0 py-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {allCategories.map((cat) => {
          const isActive = activeCategory === cat.id || (activeCategory === "all" && cat.id === "all");
          const count = cat.id === "all" ? Object.values(counts).reduce((a, b) => a + b, 0) : counts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                isActive
                  ? "bg-[#8B0000] text-white border-[#8B0000] shadow-md shadow-[#8B0000]/20"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#8B0000]/30 hover:text-[#8B0000]"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-400"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
