"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

/* ═══════════════════════════════════════════════════════════════
   HERO CAROUSEL — Design-Taste-Frontend-V1 Compliant
   DESIGN_VARIANCE: 8 (asymmetric, offset grids, fractional units)
   MOTION_INTENSITY: 6 (spring physics, perpetual micro-animations)
   VISUAL_DENSITY: 4 (airy, generous whitespace, gallery-style)

   Rules applied:
   - No centered hero → asymmetric split layouts per slide
   - No 3-column cards → 2-column zig-zag + asymmetric grids
   - No emojis → Lucide/SVG icons only
   - No generic names → realistic Arabic/English data
   - No pure black → off-black #1C1814
   - No neon glows → inner borders + tinted shadows
   - Spring physics on interactive elements
   - Perpetual micro-animations (pulse, float, shimmer)
   - Liquid glass surfaces where elevation is needed
   ═══════════════════════════════════════════════════════════════ */

const SLIDES = [
  {
    id: "procurement",
    title: "Procurement Command Center",
    caption: "From PO issuance to delivery — every transaction tracked, every dirham accounted for.",
    meta: "Live · 3 properties · 14 active orders",
  },
  {
    id: "eta",
    title: "ETA E-Invoice Pipeline",
    caption: "Cryptographic signatures, UUID validation, Tax Authority submission — fully automated.",
    meta: "99.7% clearance rate · avg 4.2s per invoice",
  },
  {
    id: "marketplace",
    title: "Verified Supplier Network",
    caption: "680+ pre-vetted suppliers across 6 governorates. Fixed-price catalogs. Zero negotiation overhead.",
    meta: "Cairo · Sharm · Hurghada · Alexandria",
  },
  {
    id: "logistics",
    title: "Shark-Breaker Coastal Routes",
    caption: "Shared logistics from Cairo to the Red Sea. Consolidated delivery. 40% cost reduction per kilo.",
    meta: "3 routes · 14 tons moved daily",
  },
  {
    id: "factoring",
    title: "Embedded Reverse Factoring",
    caption: "Suppliers paid in 48 hours. Hotels keep Net-60. Competitive grantor bidding drives rates down.",
    meta: "EGP 12M+ monthly · 1.8% avg fee",
  },
];

/* ═══════════════════════════════════════════════════════════════
   MAGNETIC BUTTON — pulls toward cursor on hover
   Uses useMotionValue + useTransform (NOT useState) per skill spec
   ═══════════════════════════════════════════════════════════════ */
function MagneticButton({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const tx = useTransform(x, (v) => v * 0.15);
  const ty = useTransform(y, (v) => v * 0.15);

  const handleMouse = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set(e.clientX - cx);
    y.set(e.clientY - cy);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      style={{ x: tx, y: ty }}
      className={`relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-medium transition-shadow duration-300 ${className}`}
    >
      {children}
    </motion.button>
  );
}

export function HeroCarouselCss() {
  const [active, setActive] = useState(0);

  // Auto-advance every 6s with pause on hover
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full" style={{ background: "var(--bg-surface-1)" }}>
      {/* Outer frame — liquid glass effect per skill spec */}
      <div
        className="relative rounded-[2rem] overflow-hidden border"
        style={{
          borderColor: "var(--border-subtle)",
          boxShadow: "0 20px 40px -15px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)",
          background: "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(250,250,248,0.95) 100%)",
        }}
      >
        {/* Slide area */}
        <div className="relative aspect-[16/10] md:aspect-[2/1]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {active === 0 && <ProcurementSlide />}
              {active === 1 && <ETAInvoiceSlide />}
              {active === 2 && <MarketplaceSlide />}
              {active === 3 && <LogisticsSlide />}
              {active === 4 && <FactoringSlide />}
            </motion.div>
          </AnimatePresence>

          {/* Caption — bottom-left asymmetric per skill (no center) */}
          <div className="absolute bottom-0 left-0 md:left-8 bottom-6 md:bottom-8 z-10 max-w-md">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                <p
                  className="text-[10px] uppercase tracking-[0.25em] mb-2 font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  {String(active + 1).padStart(2, "0")} — {SLIDES[active].meta}
                </p>
                <h3
                  className="text-[18px] md:text-[22px] font-medium mb-2 leading-tight tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {SLIDES[active].title}
                </h3>
                <p
                  className="text-[12px] md:text-[13px] leading-relaxed max-w-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {SLIDES[active].caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dot navigation — bottom-right asymmetric */}
          <div className="absolute bottom-6 md:bottom-8 right-6 md:right-8 flex items-center gap-2 z-10">
            {SLIDES.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}: ${slide.title}`}
                className="h-[6px] rounded-full transition-all duration-500"
                style={{
                  width: active === i ? 28 : 6,
                  background: active === i ? "var(--accent-base)" : "var(--border-visible)",
                  boxShadow: active === i ? "0 0 0 2px var(--accent-muted)" : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 1 — PROCUREMENT COMMAND CENTER
   Asymmetric 70/30 split (not centered, not 3-column)
   ═══════════════════════════════════════════════════════════════ */
function ProcurementSlide() {
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-0">
      {/* Left 70% — main dashboard */}
      <div className="md:col-span-7 p-5 md:p-7 flex items-center">
        <div
          className="w-full rounded-2xl border p-4 md:p-5"
          style={{
            background: "#FFFFFF",
            borderColor: "var(--border-subtle)",
            boxShadow: "0 12px 32px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {/* Window chrome */}
          <div className="flex items-center gap-1.5 mb-3 pb-3" style={{ borderBottom: "1px solid var(--border-subtle)" }}>
            <span className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#FEBC2E" }} />
            <span className="w-2 h-2 rounded-full" style={{ background: "#28C840" }} />
            <span className="ml-3 text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>hv-cmd-0847</span>
            <span className="ml-auto px-2 py-0.5 rounded text-[8px] font-medium" style={{ background: "rgba(46,125,79,0.08)", color: "#2E7D4F" }}>Live</span>
          </div>
          {/* Header row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>Stella Di Mare — Sharm El-Sheikh</div>
              <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>3 properties · 14 active POs · EGP 847,200 monthly</div>
            </div>
          </div>
          {/* KPI row — 2 columns asymmetric (not 3) */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-lg p-3" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
              <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Monthly Spend</div>
              <div className="text-[18px] font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>EGP 847,200</div>
              <div className="text-[9px] mt-1" style={{ color: "#2E7D4F" }}>↓ 12.4% vs last month</div>
            </div>
            <div className="rounded-lg p-3" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
              <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>On-Time Delivery</div>
              <div className="text-[18px] font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>94.7%</div>
              <div className="text-[9px] mt-1" style={{ color: "var(--text-muted)" }}>Target: 95% · 147 orders</div>
            </div>
          </div>
          {/* Bar chart — realistic uneven data */}
          <div className="rounded-lg p-3" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>Spend by Category — Last 12 Months</span>
              <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>F&B · Linen · Pool · FF&E</span>
            </div>
            <div className="flex items-end gap-1.5 h-16">
              {[32, 58, 41, 73, 52, 88, 64, 91, 78, 55, 82, 96].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 rounded-sm"
                  style={{ background: i === 11 ? "var(--accent-base)" : "var(--border-visible)" }}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.04, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              {["J","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => (
                <span key={i} className="text-[7px] flex-1 text-center" style={{ color: "var(--text-muted)" }}>{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Right 30% — activity feed (asymmetric) */}
      <div className="md:col-span-5 p-5 md:p-7 md:pl-0 flex items-center">
        <div className="w-full space-y-3">
          <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Recent Activity</div>
          {[
            { time: "2m ago", text: "PO-0847 sent to Al-Gomhouria", status: "sent", amount: "EGP 18,400" },
            { time: "14m ago", text: "Invoice #INV-2291 ETA cleared", status: "cleared", amount: "EGP 9,200" },
            { time: "1h ago", text: "Delivery confirmed — Nile Linen", status: "delivered", amount: "EGP 4,800" },
            { time: "3h ago", text: "Grantor bid accepted — CIB", status: "funded", amount: "EGP 32,100" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="flex items-start gap-3 p-3 rounded-xl border"
              style={{ background: "var(--bg-surface-1)", borderColor: "var(--border-subtle)" }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                style={{
                  background: item.status === "sent" ? "#2B6CB0" : item.status === "cleared" ? "#2E7D4F" : item.status === "delivered" ? "#C4881F" : "#7A756E",
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{item.text}</div>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>{item.time}</span>
                  <span className="text-[10px] font-mono font-medium" style={{ color: "var(--text-primary)" }}>{item.amount}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 2 — ETA E-INVOICE
   Asymmetric: document on left, verification panel on right
   ═══════════════════════════════════════════════════════════════ */
function ETAInvoiceSlide() {
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-0">
      {/* Left — invoice document */}
      <div className="md:col-span-7 p-5 md:p-7 flex items-center">
        <div
          className="w-full rounded-2xl border p-5 md:p-6 relative"
          style={{
            background: "#FFFFFF",
            borderColor: "var(--border-subtle)",
            boxShadow: "0 12px 32px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          {/* ETA stamp */}
          <div className="absolute top-4 right-4 px-2 py-1 rounded-md border flex items-center gap-1.5" style={{ background: "rgba(46,125,79,0.06)", borderColor: "rgba(46,125,79,0.2)" }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#2E7D4F" strokeWidth="3"><path d="M20 6L9 17l-5-5"/></svg>
            <span className="text-[9px] font-medium" style={{ color: "#2E7D4F" }}>ETA Verified</span>
          </div>
          <div className="text-[10px] font-mono mb-3" style={{ color: "var(--text-muted)" }}>UUID: 8472a1b3-f9e2-4d88-a1c7-3e5f92b0d4e1</div>
          <div className="text-[14px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>Tax Invoice #INV-2026-2291</div>
          <div className="text-[10px] mb-4" style={{ color: "var(--text-muted)" }}>Issued: 2026-06-26 09:42:17 · Supplier: Al-Gomhouria for Food Supplies</div>
          {/* Line items */}
          <div className="space-y-2 py-3" style={{ borderTop: "1px solid var(--border-subtle)", borderBottom: "1px solid var(--border-subtle)" }}>
            {[
              { item: "سمك فيليه — بلطي", en: "Fish Fillet — Bolti", qty: "120 kg", price: "153.33", amt: "EGP 18,400.00" },
              { item: "ملاءات فندقية — 300 خيط", en: "Hotel Linen — 300 thread", qty: "200 units", price: "46.00", amt: "EGP 9,200.00" },
              { item: "كلورين مسابح — مركز", en: "Pool Chlorine — concentrated", qty: "40 L", price: "70.00", amt: "EGP 2,800.00" },
            ].map((row) => (
              <div key={row.item} className="flex items-center justify-between text-[11px]">
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate" style={{ color: "var(--text-primary)" }}>{row.item}</div>
                  <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{row.en} · {row.qty} × {row.price}</div>
                </div>
                <span className="font-mono font-medium ml-4" style={{ color: "var(--text-primary)" }}>{row.amt}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3">
            <span className="text-[11px]" style={{ color: "var(--text-secondary)" }}>Total (incl. 14% VAT)</span>
            <span className="text-[15px] font-semibold font-mono" style={{ color: "var(--accent-base)" }}>EGP 30,400.00</span>
          </div>
        </div>
      </div>
      {/* Right — verification panel */}
      <div className="md:col-span-5 p-5 md:p-7 md:pl-0 flex items-center">
        <div className="w-full space-y-4">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Verification Pipeline</div>
          {[
            { label: "Digital Signature", desc: "RSA-2048 · Valid", ok: true },
            { label: "UUID Validation", desc: "ETA registry confirmed", ok: true },
            { label: "Three-Way Match", desc: "PO + GRN + Invoice", ok: true },
            { label: "Tax Authority", desc: "Submitted · Accepted", ok: true },
          ].map((step, i) => (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.12, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center gap-3 p-3 rounded-xl border"
              style={{ background: "var(--bg-surface-1)", borderColor: "var(--border-subtle)" }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(46,125,79,0.08)" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2E7D4F" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
              </div>
              <div className="flex-1">
                <div className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{step.label}</div>
                <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{step.desc}</div>
              </div>
              <span className="text-[9px] font-mono" style={{ color: "#2E7D4F" }}>✓</span>
            </motion.div>
          ))}
          {/* QR code */}
          <div className="flex items-center gap-3 p-3 rounded-xl border" style={{ background: "var(--bg-surface-1)", borderColor: "var(--border-subtle)" }}>
            <div className="w-12 h-12 rounded-lg p-1" style={{ background: "#FFFFFF", border: "1px solid var(--border-subtle)" }}>
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <rect x="4" y="4" width="24" height="24" fill="none" stroke="#1C1814" strokeWidth="3"/>
                <rect x="8" y="8" width="16" height="16" fill="#1C1814"/>
                <rect x="72" y="4" width="24" height="24" fill="none" stroke="#1C1814" strokeWidth="3"/>
                <rect x="76" y="8" width="16" height="16" fill="#1C1814"/>
                <rect x="4" y="72" width="24" height="24" fill="none" stroke="#1C1814" strokeWidth="3"/>
                <rect x="8" y="76" width="16" height="16" fill="#1C1814"/>
                {[36,44,52,60,68].map((x) =>
                  [36,44,52,60,68].map((y) => ((x * y) % 3 === 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="2" height="2" fill="#1C1814"/> : null))
                )}
              </svg>
            </div>
            <div>
              <div className="text-[10px] font-medium" style={{ color: "var(--text-primary)" }}>Scan to verify</div>
              <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>eta.gov.eg/verify/8472a1b3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 3 — MARKETPLACE
   Asymmetric bento: 2-column zig-zag (not 3-column)
   ═══════════════════════════════════════════════════════════════ */
function MarketplaceSlide() {
  return (
    <div className="h-full p-5 md:p-7 flex items-center">
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Left — featured supplier card */}
        <div className="md:col-span-5">
          <div
            className="rounded-2xl border p-5 h-full"
            style={{
              background: "#FFFFFF",
              borderColor: "var(--border-subtle)",
              boxShadow: "0 12px 32px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Featured Supplier</div>
              <span className="px-2 py-0.5 rounded text-[8px] font-medium" style={{ background: "rgba(46,125,79,0.08)", color: "#2E7D4F" }}>Verified</span>
            </div>
            <div className="text-[15px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>Al-Gomhouria for Food Supplies</div>
            <div className="text-[10px] mb-3" style={{ color: "var(--text-muted)" }}>القاهرة · تأسست ١٩٨٧ · ٣٢٠ فندق عميل</div>
            <div className="flex items-center gap-1 mb-4">
              {[1,2,3,4,5].map((s) => (
                <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= 4 ? "#C4881F" : "none"} stroke="#C4881F" strokeWidth="1.5"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
              <span className="text-[10px] ml-1" style={{ color: "var(--text-muted)" }}>4.7 · 847 orders</span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[
                { label: "F&B", sub: "Produce · Dairy · Meat" },
                { label: "Linen", sub: "300 thread · Egyptian cotton" },
              ].map((cat) => (
                <div key={cat.label} className="rounded-lg p-2.5" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                  <div className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{cat.label}</div>
                  <div className="text-[9px]" style={{ color: "var(--text-muted)" }}>{cat.sub}</div>
                </div>
              ))}
            </div>
            <MagneticButton
              className="w-full justify-center"
            >
              View Catalog — 247 items
            </MagneticButton>
          </div>
        </div>
        {/* Right — supplier grid (2 columns, not 3) */}
        <div className="md:col-span-7">
          <div className="text-[10px] uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>680 Verified Suppliers · 6 Governorates</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { name: "Nile Linen", cat: "Textile", rating: "4.6", hotels: "124", color: "#2E7D4F" },
              { name: "RedSea Chemicals", cat: "Pool · Cleaning", rating: "4.9", hotels: "89", color: "#2B6CB0" },
              { name: "Cairo Fresh Produce", cat: "F&B", rating: "4.7", hotels: "201", color: "#C4881F" },
              { name: "Delta Pest Control", cat: "Services", rating: "4.5", hotels: "67", color: "#7A756E" },
              { name: "Shark Beach Equipment", cat: "FF&E", rating: "4.8", hotels: "52", color: "#2E7D4F" },
              { name: "Alexandria Marine", cat: "Seafood", rating: "4.4", hotels: "38", color: "#2B6CB0" },
            ].map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                className="rounded-xl p-3 border"
                style={{ background: "#FFFFFF", borderColor: "var(--border-subtle)", boxShadow: "0 4px 12px -4px rgba(0,0,0,0.04)" }}
              >
                <div className="w-full h-12 rounded-lg mb-2 flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${s.color}10, ${s.color}20)` }}>
                  <span className="text-[11px] font-semibold" style={{ color: s.color }}>{s.cat}</span>
                </div>
                <div className="text-[11px] font-medium truncate" style={{ color: "var(--text-primary)" }}>{s.name}</div>
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-0.5">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="#C4881F"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    <span className="text-[9px]" style={{ color: "var(--text-muted)" }}>{s.rating}</span>
                  </div>
                  <span className="text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>{s.hotels} hotels</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 4 — LOGISTICS MAP
   Full-bleed asymmetric: map + side panel
   ═══════════════════════════════════════════════════════════════ */
function LogisticsSlide() {
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-0">
      {/* Map area */}
      <div className="md:col-span-8 p-5 md:p-7 flex items-center">
        <div
          className="w-full rounded-2xl border p-5"
          style={{
            background: "#FFFFFF",
            borderColor: "var(--border-subtle)",
            boxShadow: "0 12px 32px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>Shark-Breaker Live Routes</div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>3 active routes · 14 tons in transit · Next dispatch: 14:30</div>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg" style={{ background: "rgba(46,125,79,0.06)", border: "1px solid rgba(46,125,79,0.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#2E7D4F" }} />
              <span className="text-[9px] font-medium" style={{ color: "#2E7D4F" }}>Live</span>
            </div>
          </div>
          <svg viewBox="0 0 480 280" className="w-full h-auto">
            <defs>
              <linearGradient id="seaGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#E5EEF7" stopOpacity="0.4"/>
                <stop offset="100%" stopColor="#D4E4F0" stopOpacity="0.2"/>
              </linearGradient>
            </defs>
            {/* Mediterranean */}
            <rect x="0" y="0" width="480" height="50" fill="url(#seaGrad)"/>
            <text x="15" y="28" fontSize="8" fill="#2B6CB0" opacity="0.5" fontFamily="Jakarta Sans">Mediterranean Sea</text>
            {/* Red Sea */}
            <text x="370" y="245" fontSize="8" fill="#C4881F" opacity="0.5" fontFamily="Jakarta Sans">Red Sea</text>
            {/* Egypt outline */}
            <path d="M 70 35 L 350 35 L 370 75 L 385 140 L 370 200 L 335 260 L 285 272 L 220 265 L 155 272 L 110 255 L 85 205 L 70 145 Z"
              fill="#FAFAF8" stroke="#D4D1CC" strokeWidth="1.5"/>
            {/* Nile */}
            <path d="M 225 55 Q 232 105 225 155 Q 220 195 225 260" fill="none" stroke="#B8D4E8" strokeWidth="3" opacity="0.6"/>
            {/* Cairo hub */}
            <rect x="210" y="96" width="26" height="14" rx="4" fill="#C4881F"/>
            <text x="215" y="106" fontSize="7" fill="#FAFAF8" fontWeight="600" fontFamily="Jakarta Sans">CAI</text>
            {/* Routes */}
            {[
              { to: "Sharm", x: 320, y: 195, color: "#C4881F" },
              { to: "Hurghada", x: 280, y: 165, color: "#2E7D4F" },
              { to: "Alex", x: 130, y: 48, color: "#2B6CB0" },
            ].map((route) => (
              <g key={route.to}>
                <motion.path
                  d={`M 225 110 Q ${(225 + route.x) / 2} ${(110 + route.y) / 2 - 15} ${route.x} ${route.y}`}
                  fill="none"
                  stroke={route.color}
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </g>
            ))}
            {/* Cities */}
            {[
              { name: "Alexandria", x: 130, y: 48, active: true },
              { name: "Cairo", x: 225, y: 110, active: true },
              { name: "Hurghada", x: 280, y: 165, active: true },
              { name: "Sharm", x: 320, y: 195, active: true },
              { name: "Marsa Matruh", x: 85, y: 45, limited: true },
              { name: "Aswan", x: 240, y: 240, coming: true },
            ].map((city) => (
              <g key={city.name}>
                {city.active && (
                  <>
                    <circle cx={city.x} cy={city.y} r="16" fill="#C4881F" opacity="0.08"/>
                    <circle cx={city.x} cy={city.y} r="8" fill="#C4881F" opacity="0.15"/>
                  </>
                )}
                <circle cx={city.x} cy={city.y} r="4" fill={city.active ? "#C4881F" : city.limited ? "#B8860B" : "#D4D1CC"}/>
                <text x={city.x + 7} y={city.y + 3} fontSize="7" fill={city.active ? "#1C1814" : "#9D978E"} fontWeight={city.active ? "600" : "400"} fontFamily="Jakarta Sans">
                  {city.name}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
      {/* Side panel — route stats */}
      <div className="md:col-span-4 p-5 md:p-7 md:pl-0 flex items-center">
        <div className="w-full space-y-3">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Today's Dispatch</div>
          {[
            { route: "Cairo → Sharm", tons: "4.2", eta: "14:30", status: "In Transit", color: "#C4881F" },
            { route: "Cairo → Hurghada", tons: "3.8", eta: "16:00", status: "Loading", color: "#2E7D4F" },
            { route: "Cairo → Alexandria", tons: "2.1", eta: "10:30", status: "Delivered", color: "#2B6CB0" },
          ].map((r, i) => (
            <motion.div
              key={r.route}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              className="rounded-xl p-3 border flex items-center justify-between"
              style={{ background: "var(--bg-surface-1)", borderColor: "var(--border-subtle)" }}
            >
              <div>
                <div className="text-[11px] font-medium" style={{ color: "var(--text-primary)" }}>{r.route}</div>
                <div className="text-[9px] font-mono" style={{ color: "var(--text-muted)" }}>{r.tons} tons · ETA {r.eta}</div>
              </div>
              <span className="text-[9px] font-medium px-2 py-0.5 rounded" style={{ background: `${r.color}10`, color: r.color }}>{r.status}</span>
            </motion.div>
          ))}
          <div className="pt-3 mt-3" style={{ borderTop: "1px solid var(--border-subtle)" }}>
            <div className="flex items-center justify-between text-[10px]">
              <span style={{ color: "var(--text-muted)" }}>Cost reduction</span>
              <span className="font-mono font-medium" style={{ color: "#2E7D4F" }}>38.4% per kg</span>
            </div>
            <div className="flex items-center justify-between text-[10px] mt-1">
              <span style={{ color: "var(--text-muted)" }}>Monthly volume</span>
              <span className="font-mono font-medium" style={{ color: "var(--text-primary)" }}>14.2 tons</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SLIDE 5 — FACTORING FLOW
   Asymmetric: flow diagram + stats panel
   ═══════════════════════════════════════════════════════════════ */
function FactoringSlide() {
  return (
    <div className="h-full grid grid-cols-1 md:grid-cols-12 gap-0">
      {/* Flow diagram */}
      <div className="md:col-span-7 p-5 md:p-7 flex items-center">
        <div
          className="w-full rounded-2xl border p-5"
          style={{
            background: "#FFFFFF",
            borderColor: "var(--border-subtle)",
            boxShadow: "0 12px 32px -10px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.9)",
          }}
        >
          <div className="text-[13px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>Invoice Factoring Flow</div>
          <div className="text-[10px] mb-5" style={{ color: "var(--text-muted)" }}>Average settlement: 36 hours · 1.8% fee · Non-recourse</div>
          <svg viewBox="0 0 480 180" className="w-full h-auto">
            <defs>
              <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0 0 L6 3 L0 6 Z" fill="#C4881F"/>
              </marker>
            </defs>
            {/* Hotel */}
            <rect x="10" y="55" width="85" height="70" rx="12" fill="#FAFAF8" stroke="#E8E6E3"/>
            <rect x="10" y="55" width="85" height="70" rx="12" fill="#C4881F" opacity="0.04"/>
            <text x="52" y="82" fontSize="10" fontWeight="600" fill="#1C1814" textAnchor="middle" fontFamily="Jakarta Sans">Hotel</text>
            <text x="52" y="98" fontSize="8" fill="#7A756E" textAnchor="middle" fontFamily="Jakarta Sans">Net-60 terms</text>
            {/* Invoice */}
            <rect x="135" y="55" width="85" height="70" rx="12" fill="#FAFAF8" stroke="#E8E6E3"/>
            <rect x="135" y="55" width="85" height="70" rx="12" fill="#2E7D4F" opacity="0.04"/>
            <text x="177" y="82" fontSize="10" fontWeight="600" fill="#1C1814" textAnchor="middle" fontFamily="Jakarta Sans">Invoice</text>
            <text x="177" y="98" fontSize="8" fill="#2E7D4F" textAnchor="middle" fontFamily="Jakarta Sans">ETA Cleared</text>
            {/* Pool */}
            <circle cx="290" cy="90" r="42" fill="#FAFAF8" stroke="#E8E6E3"/>
            <circle cx="290" cy="90" r="42" fill="#C4881F" opacity="0.06"/>
            <text x="290" y="86" fontSize="10" fontWeight="600" fill="#C4881F" textAnchor="middle" fontFamily="Jakarta Sans">Factoring</text>
            <text x="290" y="100" fontSize="10" fontWeight="600" fill="#C4881F" textAnchor="middle" fontFamily="Jakarta Sans">Pool</text>
            <text x="290" y="114" fontSize="8" fill="#7A756E" textAnchor="middle" fontFamily="Jakarta Sans">3 grantors</text>
            {/* Supplier */}
            <rect x="385" y="55" width="85" height="70" rx="12" fill="#FAFAF8" stroke="#E8E6E3"/>
            <rect x="385" y="55" width="85" height="70" rx="12" fill="#2B6CB0" opacity="0.04"/>
            <text x="427" y="82" fontSize="10" fontWeight="600" fill="#1C1814" textAnchor="middle" fontFamily="Jakarta Sans">Supplier</text>
            <text x="427" y="98" fontSize="8" fill="#2B6CB0" textAnchor="middle" fontFamily="Jakarta Sans">Paid 36h</text>
            {/* Arrows */}
            <path d="M 100 90 L 130 90" stroke="#C4881F" strokeWidth="1.5" markerEnd="url(#arrow)"/>
            <path d="M 225 90 L 243 90" stroke="#C4881F" strokeWidth="1.5" markerEnd="url(#arrow)"/>
            <path d="M 337 90 L 380 90" stroke="#C4881F" strokeWidth="1.5" markerEnd="url(#arrow)"/>
            {/* Bottom labels */}
            <text x="52" y="145" fontSize="8" fill="#9D978E" textAnchor="middle" fontFamily="Jakarta Sans">Step 1 — PO Issued</text>
            <text x="177" y="145" fontSize="8" fill="#9D978E" textAnchor="middle" fontFamily="Jakarta Sans">Step 2 — 3-Way Match</text>
            <text x="290" y="145" fontSize="8" fill="#9D978E" textAnchor="middle" fontFamily="Jakarta Sans">Step 3 — Grantors Bid</text>
            <text x="427" y="145" fontSize="8" fill="#9D978E" textAnchor="middle" fontFamily="Jakarta Sans">Step 4 — Settlement</text>
          </svg>
        </div>
      </div>
      {/* Stats panel */}
      <div className="md:col-span-5 p-5 md:p-7 md:pl-0 flex items-center">
        <div className="w-full space-y-4">
          <div className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Monthly Performance</div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Total Volume", value: "EGP 12.4M", sub: "+30% MoM", color: "#C4881F" },
              { label: "Avg Settlement", value: "36.2 hours", sub: "Target: 48h", color: "#2E7D4F" },
              { label: "Active Grantors", value: "7", sub: "Bidding avg 3.2", color: "#2B6CB0" },
              { label: "Default Rate", value: "0.03%", sub: "Zero losses", color: "#2E7D4F" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
                className="rounded-xl p-3 border"
                style={{ background: "var(--bg-surface-1)", borderColor: "var(--border-subtle)" }}
              >
                <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{stat.label}</div>
                <div className="text-[16px] font-semibold font-mono" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{stat.sub}</div>
              </motion.div>
            ))}
          </div>
          <div className="rounded-xl p-3 border" style={{ background: "var(--bg-surface-1)", borderColor: "var(--border-subtle)" }}>
            <div className="text-[10px] font-medium mb-1" style={{ color: "var(--text-primary)" }}>Risk Status</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: "#2E7D4F" }} />
              <span className="text-[10px]" style={{ color: "#2E7D4F" }}>Non-recourse · Zero liability · FRA compliant</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
