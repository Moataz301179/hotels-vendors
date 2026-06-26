"use client";

import { useState } from "react";

/* ═══════════════════════════════════════════════════════════════
   CSS-ONLY HERO CAROUSEL
   5 contextual slides: procurement, ETA, marketplace, logistics, factoring.
   Manual dot navigation. No external images. Inline SVG + CSS gradients.
   Designed for light theme (warm whites, gold accent). For dark themes,
   the caption scrim handles contrast; SVG mockups are intentionally
   light-only since they represent paper documents / screens.
   ═══════════════════════════════════════════════════════════════ */

const SLIDES = [
  {
    id: "procurement",
    title: "Hotel Procurement Dashboard",
    caption: "Real-time spend control across every property, outlet, and category.",
  },
  {
    id: "eta",
    title: "ETA E-Invoice Compliance",
    caption: "Every invoice digitally signed, UUID-validated, submitted to the Tax Authority in seconds.",
  },
  {
    id: "marketplace",
    title: "Verified Supplier Marketplace",
    caption: "680+ pre-vetted suppliers. Fixed-price catalogs. One-click PO generation.",
  },
  {
    id: "logistics",
    title: "Coastal Logistics Map",
    caption: "Shark-Breaker shared-route delivery from Cairo to Sharm, Hurghada, and the North Coast.",
  },
  {
    id: "factoring",
    title: "Embedded Reverse Factoring",
    caption: "Suppliers paid in 48 hours. Hotels keep Net-60 terms. Competitive grantor bidding.",
  },
];

export function HeroCarouselCss() {
  const [active, setActive] = useState(0);

  return (
    <div className="relative w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface-2)" }}>
      {/* Slides */}
      <div className="relative w-full h-full">
        {SLIDES.map((slide, i) => (
          <input
            key={slide.id}
            type="radio"
            name="hero-carousel"
            className="sr-only"
            checked={active === i}
            onChange={() => setActive(i)}
            aria-label={slide.title}
            style={{ display: "none" }}
          />
        ))}

        {/* Slide 1 — Procurement Dashboard */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out flex flex-col"
          style={{ opacity: active === 0 ? 1 : 0, pointerEvents: active === 0 ? "auto" : "none", background: "linear-gradient(135deg, #FAFAF8 0%, #F5F4F1 100%)" }}
        >
          <DashboardMockupSVG />
        </div>

        {/* Slide 2 — ETA E-Invoice */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out flex flex-col"
          style={{ opacity: active === 1 ? 1 : 0, pointerEvents: active === 1 ? "auto" : "none", background: "linear-gradient(135deg, #FFFAF0 0%, #FFF3E0 100%)" }}
        >
          <ETAInvoiceSVG />
        </div>

        {/* Slide 3 — Marketplace Grid */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out flex flex-col"
          style={{ opacity: active === 2 ? 1 : 0, pointerEvents: active === 2 ? "auto" : "none", background: "linear-gradient(135deg, #F0F7F4 0%, #E8F5EE 100%)" }}
        >
          <MarketplaceSVG />
        </div>

        {/* Slide 4 — Logistics Map */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out flex flex-col"
          style={{ opacity: active === 3 ? 1 : 0, pointerEvents: active === 3 ? "auto" : "none", background: "linear-gradient(135deg, #F0F4FA 0%, #E5EEF7 100%)" }}
        >
          <LogisticsMapSVG />
        </div>

        {/* Slide 5 — Factoring Flow */}
        <div
          className="absolute inset-0 transition-opacity duration-700 ease-out flex flex-col"
          style={{ opacity: active === 4 ? 1 : 0, pointerEvents: active === 4 ? "auto" : "none", background: "linear-gradient(135deg, #FAF8F0 0%, #F5EDE0 100%)" }}
        >
          <FactoringFlowSVG />
        </div>
      </div>

      {/* Caption overlay — dark scrim ensures contrast on light slide backgrounds */}
      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-7 z-10" style={{ background: "linear-gradient(to top, rgba(26,24,22,0.88) 0%, rgba(26,24,22,0.45) 60%, transparent 100%)" }}>
        <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] mb-1.5 font-medium">
          {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </p>
        <h3 className="text-white text-[17px] md:text-[21px] font-medium mb-1.5 leading-tight drop-shadow-sm">
          {SLIDES[active].title}
        </h3>
        <p className="text-white/75 text-[12px] md:text-[13px] leading-relaxed max-w-md drop-shadow-sm">
          {SLIDES[active].caption}
        </p>
      </div>

      {/* Dot navigation — outline dots with accent fill for visibility on any background */}
      <div className="absolute bottom-3 right-5 md:bottom-5 md:right-7 flex items-center gap-1.5 z-10">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.id}
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}: ${slide.title}`}
            className="h-1.5 rounded-full transition-all duration-300 ring-1 ring-black/20"
            style={{
              width: active === i ? 28 : 8,
              background: active === i ? "var(--accent-base)" : "rgba(255,255,255,0.7)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SVG MOCKUP — HOTEL PROCUREMENT DASHBOARD
   ═══════════════════════════════════════════════════════════════ */
function DashboardMockupSVG() {
  return (
    <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-[520px] rounded-xl overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 8px 32px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.04)", border: "1px solid #E8E6E3" }}>
        {/* Window chrome */}
        <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: "#F5F4F1", borderBottom: "1px solid #E8E6E3" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#FEBC2E" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#28C840" }} />
          <span className="ml-3 text-[9px] text-muted flex-1 text-center" style={{ color: "#9D978E" }}>dashboard.hotelsvendors.com</span>
        </div>
        {/* Sidebar + content */}
        <div className="flex min-h-[200px] md:min-h-[260px]">
          {/* Sidebar */}
          <div className="hidden sm:flex flex-col w-[72px] py-3 gap-3 items-center" style={{ background: "#FAFAF8", borderRight: "1px solid #E8E6E3" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "#C4881F" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAFAF8" strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
            </div>
            {["M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z"].map((d, i) => (
              <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: i === 0 ? "rgba(196,136,31,0.10)" : "transparent", border: i === 0 ? "1px solid rgba(196,136,31,0.2)" : "1px solid transparent" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? "#C4881F" : "#9D978E"} strokeWidth="2"><path d={d} /></svg>
              </div>
            ))}
          </div>
          {/* Main */}
          <div className="flex-1 p-3 md:p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="h-2.5 w-24 rounded" style={{ background: "#1A1816" }} />
                <div className="h-1.5 w-32 rounded" style={{ background: "#9D978E" }} />
              </div>
              <div className="px-2.5 py-1 rounded-md text-[9px] font-medium" style={{ background: "#C4881F", color: "#FAFAF8" }}>+ New PO</div>
            </div>
            {/* KPI cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { val: "EGP 2.4M", label: "Monthly Spend", color: "#C4881F" },
                { val: "94%", label: "On-Time", color: "#2E7D4F" },
                { val: "127", label: "Active POs", color: "#2B6CB0" },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-lg p-2" style={{ background: "#FAFAF8", border: "1px solid #E8E6E3" }}>
                  <div className="text-[8px] mb-0.5" style={{ color: "#9D978E" }}>{kpi.label}</div>
                  <div className="text-[12px] md:text-[13px] font-semibold" style={{ color: kpi.color }}>{kpi.val}</div>
                </div>
              ))}
            </div>
            {/* Bar chart */}
            <div className="rounded-lg p-2.5" style={{ background: "#FAFAF8", border: "1px solid #E8E6E3" }}>
              <div className="flex items-end justify-between h-16 gap-1.5">
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 50, 95].map((h, i) => (
                  <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 6 ? "#C4881F" : "#E8E6E3" }} />
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => (
                  <span key={i} className="text-[6px]" style={{ color: "#9D978E" }}>{m}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SVG MOCKUP — ETA E-INVOICE WITH QR CODE
   ═══════════════════════════════════════════════════════════════ */
function ETAInvoiceSVG() {
  return (
    <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-[520px] rounded-xl overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1px solid #E8E6E3" }}>
        <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: "#F5F4F1", borderBottom: "1px solid #E8E6E3" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#FEBC2E" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#28C840" }} />
          <span className="ml-3 text-[9px]" style={{ color: "#9D978E" }}>eta.gov.eg/verify</span>
        </div>
        <div className="p-4 md:p-5 grid grid-cols-3 gap-4">
          {/* Invoice body */}
          <div className="col-span-2 space-y-2.5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#2E7D4F" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FAFAF8" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div>
                <div className="text-[11px] font-semibold" style={{ color: "#1A1816" }}>ETA Verified</div>
                <div className="text-[8px]" style={{ color: "#2E7D4F" }}>UUID: 8472a1b3-...</div>
              </div>
            </div>
            <div className="h-2 w-3/4 rounded" style={{ background: "#1A1816" }} />
            <div className="h-1.5 w-full rounded" style={{ background: "#E8E6E3" }} />
            <div className="h-1.5 w-5/6 rounded" style={{ background: "#E8E6E3" }} />
            {/* Line items */}
            <div className="space-y-1.5 mt-3 pt-3" style={{ borderTop: "1px solid #E8E6E3" }}>
              {[
                { item: "F&B — Seafood delivery", qty: "120 kg", amt: "EGP 18,400" },
                { item: "Linen — 300 thread count", qty: "200 units", amt: "EGP 9,200" },
                { item: "Pool chemicals — Chlorine", qty: "40 L", amt: "EGP 2,800" },
              ].map((row) => (
                <div key={row.item} className="flex items-center justify-between text-[9px]">
                  <span style={{ color: "#4A4640" }}>{row.item}</span>
                  <span style={{ color: "#9D978E" }}>{row.qty}</span>
                  <span className="font-medium" style={{ color: "#1A1816" }}>{row.amt}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between pt-2" style={{ borderTop: "1px solid #E8E6E3" }}>
              <span className="text-[10px]" style={{ color: "#4A4640" }}>Total (incl. VAT)</span>
              <span className="text-[12px] font-semibold" style={{ color: "#C4881F" }}>EGP 30,400</span>
            </div>
          </div>
          {/* QR code */}
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg p-1.5" style={{ background: "#FAFAF8", border: "1px solid #E8E6E3" }}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect width="100" height="100" fill="#FAFAF8"/>
                {/* Position detection patterns */}
                <rect x="4" y="4" width="24" height="24" fill="none" stroke="#1A1816" strokeWidth="3"/>
                <rect x="8" y="8" width="16" height="16" fill="#1A1816"/>
                <rect x="72" y="4" width="24" height="24" fill="none" stroke="#1A1816" strokeWidth="3"/>
                <rect x="76" y="8" width="16" height="16" fill="#1A1816"/>
                <rect x="4" y="72" width="24" height="24" fill="none" stroke="#1A1816" strokeWidth="3"/>
                <rect x="8" y="76" width="16" height="16" fill="#1A1816"/>
                {/* Data modules */}
                {[32,36,40,44,48,52,56,60,64,68].map((x) => (
                  <rect key={`t${x}`} x={x} y="4" width="2" height="2" fill="#1A1816"/>
                ))}
                {[32,36,40,44,56,60,64,68].map((x) => (
                  <rect key={`b${x}`} x={x} y="94" width="2" height="2" fill="#1A1816"/>
                ))}
                {[36,44,52,60,68].map((y) => (
                  <rect key={`l${y}`} x="4" y={y} width="2" height="2" fill="#1A1816"/>
                ))}
                {[36,44,52,60,68].map((y) => (
                  <rect key={`r${y}`} x="94" y={y} width="2" height="2" fill="#1A1816"/>
                ))}
                {/* Center data */}
                {[36,40,44,48,52,56,60,64,68].map((x) =>
                  [36,40,44,48,52,56,60,64,68].map((y) => {
                    const filled = (x * y) % 3 === 0;
                    return filled ? <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" fill="#1A1816"/> : null;
                  })
                )}
              </svg>
            </div>
            <div className="text-[8px] text-center" style={{ color: "#2E7D4F" }}>Scan to verify<br/>on ETA portal</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SVG MOCKUP — SUPPLIER MARKETPLACE GRID
   ═══════════════════════════════════════════════════════════════ */
function MarketplaceSVG() {
  const suppliers = [
    { name: "Al-Gomhouria", cat: "F&B", rating: "4.8", color: "#C4881F" },
    { name: "Nile Linen", cat: "Textile", rating: "4.6", color: "#2E7D4F" },
    { name: "RedSea Chemicals", cat: "Pool", rating: "4.9", color: "#2B6CB0" },
    { name: "Cairo Fresh", cat: "Produce", rating: "4.7", color: "#C4881F" },
    { name: "Delta Pest", cat: "Services", rating: "4.5", color: "#7A756E" },
    { name: "Shark Beach", cat: "FF&E", rating: "4.8", color: "#2E7D4F" },
  ];
  return (
    <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-[520px] rounded-xl overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1px solid #E8E6E3" }}>
        <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: "#F5F4F1", borderBottom: "1px solid #E8E6E3" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#FEBC2E" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#28C840" }} />
          <span className="ml-3 text-[9px]" style={{ color: "#9D978E" }}>marketplace.hotelsvendors.com</span>
        </div>
        <div className="p-3 md:p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-[12px] font-semibold" style={{ color: "#1A1816" }}>Verified Suppliers</div>
            <div className="px-2 py-0.5 rounded text-[8px]" style={{ background: "#F0F7F4", color: "#2E7D4F", border: "1px solid #C8E6D4" }}>680 active</div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {suppliers.map((s) => (
              <div key={s.name} className="rounded-lg p-2" style={{ background: "#FAFAF8", border: "1px solid #E8E6E3" }}>
                <div className="w-full h-8 rounded mb-1.5 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${s.color}15, ${s.color}30)` }}>
                  <span className="text-[10px] font-semibold" style={{ color: s.color }}>{s.cat}</span>
                </div>
                <div className="text-[9px] font-medium truncate" style={{ color: "#1A1816" }}>{s.name}</div>
                <div className="flex items-center gap-0.5 mt-0.5">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="#C4881F"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                  <span className="text-[8px]" style={{ color: "#7A756E" }}>{s.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SVG MOCKUP — LOGISTICS MAP (EGYPT)
   ═══════════════════════════════════════════════════════════════ */
function LogisticsMapSVG() {
  return (
    <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-[520px] rounded-xl overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1px solid #E8E6E3" }}>
        <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: "#F5F4F1", borderBottom: "1px solid #E8E6E3" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#FEBC2E" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#28C840" }} />
          <span className="ml-3 text-[9px]" style={{ color: "#9D978E" }}>logistics.hotelsvendors.com</span>
        </div>
        <div className="p-3 md:p-4 relative">
          <div className="text-[11px] font-semibold mb-2" style={{ color: "#1A1816" }}>Shark-Breaker Coastal Routes</div>
          {/* Egypt map outline */}
          <svg viewBox="0 0 400 280" className="w-full h-auto">
            {/* Mediterranean Sea */}
            <rect x="0" y="0" width="400" height="60" fill="#E5EEF7" opacity="0.5"/>
            <text x="20" y="30" fontSize="8" fill="#2B6CB0" opacity="0.6">Mediterranean Sea</text>
            {/* Red Sea label */}
            <text x="320" y="220" fontSize="8" fill="#C4881F" opacity="0.6">Red Sea</text>
            {/* Egypt outline (simplified) */}
            <path d="M 80 40 L 320 40 L 340 80 L 360 140 L 340 200 L 300 260 L 260 270 L 200 260 L 140 270 L 100 250 L 80 200 L 60 140 L 80 40 Z"
              fill="#FAFAF8" stroke="#D4D1CC" strokeWidth="1.5"/>
            {/* Nile */}
            <path d="M 200 60 Q 210 110 200 160 Q 195 200 200 260"
              fill="none" stroke="#B8D4E8" strokeWidth="3" opacity="0.7"/>
            {/* Cities */}
            {[
              { name: "Alexandria", x: 130, y: 50, active: true },
              { name: "Cairo", x: 200, y: 110, active: true },
              { name: "Hurghada", x: 280, y: 170, active: true },
              { name: "Sharm", x: 320, y: 200, active: true },
              { name: "Marsa Matruh", x: 90, y: 50, active: false },
              { name: "Aswan", x: 220, y: 240, active: false },
            ].map((city) => (
              <g key={city.name}>
                {city.active && (
                  <>
                    <circle cx={city.x} cy={city.y} r="14" fill="#C4881F" opacity="0.12"/>
                    <circle cx={city.x} cy={city.y} r="8" fill="#C4881F" opacity="0.2"/>
                  </>
                )}
                <circle cx={city.x} cy={city.y} r="3.5" fill={city.active ? "#C4881F" : "#9D978E"}/>
                <text x={city.x + 7} y={city.y + 3} fontSize="7" fill={city.active ? "#1A1816" : "#9D978E"} fontWeight={city.active ? "600" : "400"}>
                  {city.name}
                </text>
              </g>
            ))}
            {/* Delivery routes */}
            <path d="M 200 110 Q 240 140 280 170" fill="none" stroke="#C4881F" strokeWidth="1.5" strokeDasharray="4 3"/>
            <path d="M 200 110 Q 165 80 130 50" fill="none" stroke="#2E7D4F" strokeWidth="1.5" strokeDasharray="4 3"/>
            <path d="M 280 170 L 320 200" fill="none" stroke="#2B6CB0" strokeWidth="1.5" strokeDasharray="4 3"/>
            {/* Hub marker */}
            <rect x="190" y="100" width="20" height="14" rx="3" fill="#C4881F"/>
            <text x="193" y="110" fontSize="6" fill="#FAFAF8" fontWeight="600">HUB</text>
          </svg>
          <div className="flex items-center gap-3 mt-2 text-[8px]">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#C4881F" }}/> Coverage</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full" style={{ background: "#9D978E" }}/> Coming soon</span>
            <span className="flex items-center gap-1 ml-auto" style={{ color: "#2E7D4F" }}>3 active routes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SVG MOCKUP — FACTORING FLOW
   ═══════════════════════════════════════════════════════════════ */
function FactoringFlowSVG() {
  return (
    <div className="flex-1 p-4 md:p-6 flex items-center justify-center">
      <div className="w-full max-w-[520px] rounded-xl overflow-hidden" style={{ background: "#FFFFFF", boxShadow: "0 8px 32px rgba(0,0,0,0.08)", border: "1px solid #E8E6E3" }}>
        <div className="flex items-center gap-1.5 px-3 py-2.5" style={{ background: "#F5F4F1", borderBottom: "1px solid #E8E6E3" }}>
          <span className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#FEBC2E" }} />
          <span className="w-2 h-2 rounded-full" style={{ background: "#28C840" }} />
          <span className="ml-3 text-[9px]" style={{ color: "#9D978E" }}>factoring.hotelsvendors.com</span>
        </div>
        <div className="p-4 md:p-5">
          <div className="text-[11px] font-semibold mb-4 text-center" style={{ color: "#1A1816" }}>Invoice Factoring Flow</div>
          {/* Flow diagram */}
          <svg viewBox="0 0 460 160" className="w-full h-auto">
            {/* Hotel node */}
            <rect x="10" y="50" width="80" height="60" rx="10" fill="#FAFAF8" stroke="#E8E6E3"/>
            <rect x="10" y="50" width="80" height="60" rx="10" fill="#C4881F" opacity="0.06"/>
            <text x="50" y="78" fontSize="9" fontWeight="600" fill="#1A1816" textAnchor="middle">Hotel</text>
            <text x="50" y="92" fontSize="7" fill="#7A756E" textAnchor="middle">Net-60 terms</text>
            {/* Invoice */}
            <rect x="130" y="50" width="80" height="60" rx="10" fill="#FAFAF8" stroke="#E8E6E3"/>
            <rect x="130" y="50" width="80" height="60" rx="10" fill="#2E7D4F" opacity="0.06"/>
            <text x="170" y="78" fontSize="9" fontWeight="600" fill="#1A1816" textAnchor="middle">Invoice</text>
            <text x="170" y="92" fontSize="7" fill="#2E7D4F" textAnchor="middle">ETA Cleared</text>
            {/* Pool */}
            <circle cx="280" cy="80" r="38" fill="#FAFAF8" stroke="#E8E6E3"/>
            <circle cx="280" cy="80" r="38" fill="#C4881F" opacity="0.08"/>
            <text x="280" y="76" fontSize="9" fontWeight="600" fill="#C4881F" textAnchor="middle">Factoring</text>
            <text x="280" y="88" fontSize="9" fontWeight="600" fill="#C4881F" textAnchor="middle">Pool</text>
            <text x="280" y="100" fontSize="7" fill="#7A756E" textAnchor="middle">Bidding</text>
            {/* Supplier */}
            <rect x="370" y="50" width="80" height="60" rx="10" fill="#FAFAF8" stroke="#E8E6E3"/>
            <rect x="370" y="50" width="80" height="60" rx="10" fill="#2B6CB0" opacity="0.06"/>
            <text x="410" y="78" fontSize="9" fontWeight="600" fill="#1A1816" textAnchor="middle">Supplier</text>
            <text x="410" y="92" fontSize="7" fill="#2B6CB0" textAnchor="middle">Paid 48h</text>
            {/* Arrows */}
            <path d="M 95 80 L 125 80" stroke="#C4881F" strokeWidth="1.5" markerEnd="url(#arrow)"/>
            <path d="M 215 80 L 237 80" stroke="#C4881F" strokeWidth="1.5" markerEnd="url(#arrow)"/>
            <path d="M 323 80 L 365 80" stroke="#C4881F" strokeWidth="1.5" markerEnd="url(#arrow)"/>
            {/* Arrow marker */}
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0 0 L6 3 L0 6 Z" fill="#C4881F"/>
              </marker>
            </defs>
            {/* Bottom labels */}
            <text x="50" y="135" fontSize="7" fill="#9D978E" textAnchor="middle">Step 1 — PO Issued</text>
            <text x="170" y="135" fontSize="7" fill="#9D978E" textAnchor="middle">Step 2 — 3-Way Match</text>
            <text x="280" y="135" fontSize="7" fill="#9D978E" textAnchor="middle">Step 3 — Grantors Bid</text>
            <text x="410" y="135" fontSize="7" fill="#9D978E" textAnchor="middle">Step 4 — Settlement</text>
          </svg>
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-3" style={{ borderTop: "1px solid #E8E6E3" }}>
            {[
              { val: "1–2 days", label: "Settlement" },
              { val: "Non-recourse", label: "Risk" },
              { val: "FRA", label: "Compliant" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-[10px] font-semibold" style={{ color: "#C4881F" }}>{s.val}</div>
                <div className="text-[8px]" style={{ color: "#9D978E" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
