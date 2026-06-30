"use client";

import { useEffect, useState, useRef } from "react";

export function MarketTicker() {
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
    }, 15000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const doubled = [...items, ...items];

  // Theme-aware colors
  const isHercules = false;
  const isOriginal = false;
  const accentColor = "#FF6B00";
  const bgColor = isHercules ? "#0a1628" : "#050505";
  const borderColor = isHercules ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)";
  const textColor = isHercules ? "#f0f4f8" : "#ffffff";
  const textMuted = isHercules ? "#94a3b8" : "rgba(255,255,255,0.70)";
  const textFaint = isHercules ? "#64748b" : "rgba(255,255,255,0.30)";
  const textPrice = isHercules ? "#94a3b8" : "rgba(255,255,255,0.40)";
  const sepColor = isHercules ? "#475569" : "rgba(255,255,255,0.10)";

  return (
    <div
      className="w-full overflow-hidden border-y py-2.5"
      style={{ borderColor, backgroundColor: bgColor }}
    >
      <div className="flex items-center">
        {/* Fixed label */}
        <div
          className="shrink-0 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider flex items-center gap-2 border-r"
          style={{ color: accentColor, borderColor }}
        >
          <span className="inline-block w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          <span>مؤشر السوق · Market Index</span>
        </div>

        {/* Scrolling marquee — 15s desktop, 25s mobile */}
        <div className="overflow-hidden flex-1">
          <div className="flex animate-marquee whitespace-nowrap">
            {doubled.map((item, i) => {
              const isUp = item.change >= 0;
              return (
                <div
                  key={`${item.nameEn}-${i}`}
                  className="inline-flex items-center gap-2 px-5 text-[11px]"
                >
                  <span style={{ color: textMuted }}>{item.nameAr}</span>
                  <span style={{ color: textFaint }}>·</span>
                  <span className="font-mono" style={{ color: textPrice }}>
                    {item.price} ج.م/{item.unit}
                  </span>
                  <span
                    className="font-mono text-[10px] flex items-center gap-0.5"
                    style={{ color: isUp ? "#22C55E" : "#EF4444" }}
                  >
                    {isUp ? "▲" : "▼"}
                    {Math.abs(item.change).toFixed(1)}%
                  </span>
                  <span style={{ color: sepColor }}>|</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
