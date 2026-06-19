"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "@/components/theme/theme-provider";

interface TickerItem {
  nameAr: string;
  nameEn: string;
  price: number;
  unit: string;
  change: number; // percentage
}

// Seed data — most demanded hotel products in Egypt
const SEED_ITEMS: TickerItem[] = [
  { nameAr: "مواد غذائية طازجة", nameEn: "Fresh Food Supplies", price: 185, unit: "كجم", change: 0 },
  { nameAr: "مستلزمات نظافة", nameEn: "Cleaning Supplies", price: 42, unit: "لتر", change: 0 },
  { nameAr: "مفروشات فندقية", nameEn: "Hotel Linens", price: 320, unit: "قطعة", change: 0 },
  { nameAr: "مشروبات غازية", nameEn: "Soft Drinks", price: 12, unit: "كرتون", change: 0 },
  { nameAr: "مواد تعقيم", nameEn: "Sanitizers", price: 65, unit: "لتر", change: 0 },
  { nameAr: "فواكه طازجة", nameEn: "Fresh Fruits", price: 28, unit: "كجم", change: 0 },
  { nameAr: "لحوم مجمدة", nameEn: "Frozen Meat", price: 210, unit: "كجم", change: 0 },
  { nameAr: "منتجات ألبان", nameEn: "Dairy Products", price: 35, unit: "كجم", change: 0 },
  { nameAr: "مواد خام للطبخ", nameEn: "Cooking Ingredients", price: 55, unit: "كجم", change: 0 },
  { nameAr: "مستلزمات حمام", nameEn: "Bathroom Amenities", price: 85, unit: "مجموعة", change: 0 },
  { nameAr: "كيماويات مسابح", nameEn: "Pool Chemicals", price: 120, unit: "كجم", change: 0 },
  { nameAr: "غسيل ومبيضات", nameEn: "Laundry & Bleach", price: 38, unit: "كجم", change: 0 },
  { nameAr: "إضاءة LED", nameEn: "LED Lighting", price: 150, unit: "وحدة", change: 0 },
  { nameAr: "أدوات مطبخ", nameEn: "Kitchen Tools", price: 275, unit: "قطعة", change: 0 },
  { nameAr: "ورق تواليت", nameEn: "Toilet Paper", price: 5, unit: "رول", change: 0 },
  { nameAr: "مناديل ورقية", nameEn: "Paper Towels", price: 18, unit: "حزمة", change: 0 },
  { nameAr: "بطاريات صناعية", nameEn: "Industrial Batteries", price: 420, unit: "وحدة", change: 0 },
  { nameAr: "فلاتر مياه", nameEn: "Water Filters", price: 95, unit: "فلتر", change: 0 },
];

function randomChange() {
  // Random between -3% and +3%, biased slightly positive
  return +(Math.random() * 6 - 2.5).toFixed(2);
}

export function MarketTicker() {
  const { mode } = useTheme();
  const isLight = mode === "light";
  const [items, setItems] = useState<TickerItem[]>(SEED_ITEMS);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          change: randomChange(),
          price: Math.max(1, +(item.price * (1 + (Math.random() * 0.02 - 0.01))).toFixed(0)),
        }))
      );
    }, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Double the items for seamless marquee
  const doubled = [...items, ...items];

  return (
    <div
      className="w-full overflow-hidden border-y py-2.5"
      style={{
        borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)",
        backgroundColor: isLight ? "#f8f7fc" : "#050505",
      }}
    >
      <div className="flex items-center">
        {/* Fixed label */}
        <div
          className="shrink-0 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider flex items-center gap-2 border-r"
          style={{
            color: isLight ? "#581c87" : "#FFB000",
            borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
          }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: isLight ? "#581c87" : "#FFB000" }} />
          <span>مؤشر السوق · Market Index</span>
        </div>

        {/* Scrolling marquee */}
        <div className="overflow-hidden flex-1">
          <div className="flex animate-marquee whitespace-nowrap">
            {doubled.map((item, i) => {
              const isUp = item.change >= 0;
              return (
                <div
                  key={`${item.nameEn}-${i}`}
                  className="inline-flex items-center gap-2 px-5 text-[11px]"
                >
                  <span className={isLight ? "text-gray-700" : "text-white/70"}>{item.nameAr}</span>
                  <span className={isLight ? "text-gray-400" : "text-white/30"}>·</span>
                  <span className={`font-mono ${isLight ? "text-gray-500" : "text-white/40"}`}>
                    {item.price} ج.م/{item.unit}
                  </span>
                  <span
                    className="font-mono text-[10px] flex items-center gap-0.5"
                    style={{ color: isUp ? "#22C55E" : "#EF4444" }}
                  >
                    {isUp ? "▲" : "▼"}
                    {Math.abs(item.change).toFixed(1)}%
                  </span>
                  <span className={isLight ? "text-gray-200" : "text-white/10"}>|</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
