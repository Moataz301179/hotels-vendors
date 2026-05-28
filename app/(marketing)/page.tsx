"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import WorkflowSection from "@/components/sections/Workflow";

/* ═══════════════════════════════════════════════════════
   THEME SYSTEM — Dark / Light / Premium toggle
   ═══════════════════════════════════════════════════════ */
const THEMES = [
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "light", label: "Light", icon: "☀️" },
  { id: "premium", label: "Premium", icon: "✨" },
] as const;

function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hv-theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const switchTheme = (t: string) => {
    setTheme(t);
    localStorage.setItem("hv-theme", t);
    document.documentElement.setAttribute("data-theme", t);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[12px] font-medium transition-colors tracking-wide uppercase flex items-center gap-1"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        Settings {THEMES.find((t) => t.id === theme)?.icon}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-3 w-44 rounded-2xl border shadow-xl p-2 z-50"
          style={{ background: "#050505", borderColor: "#1A1A1A" }}>
          <p className="text-[10px] uppercase tracking-wider px-3 py-2" style={{ color: "rgba(255,255,255,0.3)" }}>Theme</p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTheme(t.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-all ${
                theme === t.id
                  ? "font-semibold"
                  : ""
              }`}
              style={theme === t.id
                ? { background: "rgba(0,255,102,0.08)", color: "#00FF66" }
                : { color: "rgba(255,255,255,0.55)" }
              }
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PARALLAX SCROLL EFFECT
   ═══════════════════════════════════════════════════════ */
function useParallax() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -80]);
  const y2 = useTransform(scrollY, [0, 1200], [0, -120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.92]);
  return { y1, y2, opacity, scale };
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════════ */
function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="scroll-reveal">{children}</div>;
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════ */
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "#000000" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid #1A1A1A" : "1px solid transparent",
      }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[20px] font-black tracking-tight">
            <span style={{ color: "#FFFFFF" }}>Hotels</span>
            <span style={{ color: "#00FF66" }}>V</span>
            <span style={{ color: "#FFFFFF" }}>endors</span>
          </span>
          <span className="text-[9px] tracking-[0.15em] uppercase ml-1 hidden sm:inline"
            style={{ color: "rgba(255,255,255,0.3)" }}>
            B2B PROCUREMENT · EGYPT
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          {["Platform", "For Hotels", "For Suppliers", "Pricing", "ETA Compliance"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[11px] font-semibold uppercase tracking-wider transition-colors"
              style={{ color: "rgba(255,255,255,0.55)" }}>
              {item}
            </a>
          ))}
          <ThemeSwitcher />
          <Link href="/login"
            className="text-[11px] font-semibold uppercase tracking-wider transition-colors"
            style={{ color: "rgba(255,255,255,0.55)" }}>
            Sign In
          </Link>
          <Link href="/register/hotel"
            className="text-[12px] font-bold px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 lime-shadow-strong"
            style={{ background: "#00FF66", color: "#000000" }}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION DIVIDER
   ═══════════════════════════════════════════════════════ */
function Divider() {
  return <div style={{ height: 1, background: "#1A1A1A" }} />;
}

/* ═══════════════════════════════════════════════════════
   SECTION 1: HERO — "Control Your Hotel's Supply Chain..."
   ═══════════════════════════════════════════════════════ */
function HeroSection() {
  const { y1, y2, opacity, scale } = useParallax();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "#000000" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: "#00FF66", filter: "blur(140px)" }} />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full opacity-[0.02]" style={{ background: "#00FF66", filter: "blur(100px)" }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 w-full pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y: y1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{ border: "1px solid rgba(0,255,102,0.25)", background: "rgba(0,255,102,0.06)" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#00FF66" }} />
              <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: "#00FF66" }}>NOW LIVE IN EGYPT</span>
            </div>

            <h1 className="text-[44px] sm:text-[56px] lg:text-[68px] font-bold leading-[1.04] tracking-[-0.04em]" style={{ color: "#FFFFFF" }}>
              Smart Supply Chain<br />
              <span style={{ color: "rgba(255,255,255,0.5)" }}>Execution for</span><br />
              <span style={{ color: "#00FF66" }}>Egyptian Hospitality</span>
            </h1>

            <p className="mt-8 text-[17px] max-w-[540px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              AI-powered B2B procurement orchestration that replaces WhatsApp chaos with pre-spend control, embedded fintech, and 100% ETA e-invoice compliance. Built exclusively for Egyptian hotels.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/register/hotel"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-semibold rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: "#00FF66", color: "#000000", boxShadow: "0 0 40px rgba(0,255,102,0.15)" }}>
                Start Free — No Credit Card
              </Link>
              <a href="#workflow"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-medium rounded-full transition-all"
                style={{ border: "1px solid #1A1A1A", color: "rgba(255,255,255,0.6)" }}>
                Watch the Workflow
              </a>
            </div>

            <div className="mt-8">
              <p className="text-[9px] uppercase tracking-[0.2em] mb-4" style={{ color: "rgba(255,255,255,0.25)" }}>TRUSTED BY HOTELS ACROSS EGYPT</p>
              <div className="flex flex-wrap gap-3">
                {["5-STAR", "BOUTIQUE", "RESORT", "BUSINESS"].map((t) => (
                  <span key={t} className="text-[11px] font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ border: "1px solid #1A1A1A", color: "rgba(255,255,255,0.5)" }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
              {[
                { v: "EGP 500M+", l: "Annual GMV" },
                { v: "120+", l: "Hotels" },
                { v: "850+", l: "Verified Suppliers" },
              ].map((s) => (
                <div key={s.l} className="flex items-baseline gap-2">
                  <span className="text-[22px] font-bold" style={{ color: "#00FF66" }}>{s.v}</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{s.l}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div style={{ y: y2, scale }} className="relative hidden lg:block h-[540px]">
            <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ background: "#050505", border: "1px solid #1A1A1A" }}>
              <div className="p-6 border-b" style={{ borderColor: "#1A1A1A" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#00FF66" }}>Today's Procurement</span>
                  <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.25)" }}>Live</span>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 rounded-xl" style={{ background: "#000000" }}>
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Active POs</span>
                    <div className="text-[28px] font-bold mt-1" style={{ color: "#FFFFFF" }}>23</div>
                  </div>
                  <div className="flex-1 p-4 rounded-xl" style={{ background: "#000000" }}>
                    <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Pending</span>
                    <div className="text-[28px] font-bold mt-1" style={{ color: "#00FF66" }}>7</div>
                  </div>
                </div>
                <div className="mt-3 p-4 rounded-xl" style={{ background: "#000000" }}>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Suppliers Paid Today</span>
                  <div className="text-[22px] font-bold mt-1" style={{ color: "#00FF66" }}>EGP 147,500</div>
                </div>
              </div>
              <div className="p-6">
                <div className="p-4 rounded-xl" style={{ background: "#000000", border: "1px solid #1A1A1A" }}>
                  <span className="text-[9px] uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Supplier Invoice</span>
                  <div className="text-[15px] font-semibold mt-1" style={{ color: "#FFFFFF" }}>Fresh Foods Co.</div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-[18px] font-bold" style={{ color: "#00FF66" }}>EGP 25,000</span>
                    <span className="text-[11px] font-semibold px-3 py-1 rounded-full" style={{ background: "rgba(0,255,102,0.12)", color: "#00FF66" }}>Paid</span>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-semibold" style={{ color: "#00FF66" }}>
                  ✓ ETA Compliant
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 2: THE REALITY — Pain point stats
   ═══════════════════════════════════════════════════════ */

function RealitySection() {
  const stats = [
    { value: "10–20", label: "Daily Deliveries", desc: "Hotels receive 10-20 supplier deliveries daily from hundreds of vendors. Operations grind to a halt every morning." },
    { value: "60%", label: "Kitchen Waste", desc: "60% of hotel food waste happens before a guest sees their meal — overproduction, spoilage, buffet excess. 45-73% is avoidable." },
    { value: "~20%", label: "Spoilage Loss", desc: "Nearly 20% of purchased F&B inventory is lost to spoilage from poor FIFO, temperature failure, and over-ordering." },
    { value: "EGP 100K", label: "ETA Penalty Risk", desc: "Non-compliance with Egyptian Tax Authority e-invoicing carries penalties of EGP 20,000-100,000. Paper invoices are legally invalid since 2022." },
    { value: "30–90 Days", label: "Payment Delays", desc: "Egyptian SMEs face 30-90 day payment delays. SMEs extend trade credit based on relationships, not risk assessment." },
    { value: "EGP 180K", label: "Hidden Waste Cost", desc: "A hotel spending EGP 300K/month on F&B loses EGP 15K/month to spoilage alone. That's EGP 180,000 annually in preventable waste." },
  ];

  return (
    <section className="py-32 lg:py-[160px]" style={{ background: "#000000" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-4" style={{ color: "#00FF66" }}>THE REALITY</span>
          <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.12] max-w-[800px] mx-auto" style={{ color: "#FFFFFF" }}>
            Egyptian Hotels Work With Hundreds of Suppliers.
            <span style={{ color: "rgba(255,255,255,0.55)" }}> And Still Run Out of Stock Before They Run Out of Month.</span>
          </h2>
          <p className="mt-5 text-[15px] max-w-[650px] mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            The HoReCa market in Egypt will hit $18.14 billion by 2029. Yet the average hotel procurement operation runs on WhatsApp messages, paper invoices, cash payments, and prayers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="group p-6 rounded-2xl transition-all duration-300 "
              style={{ background: "#050505", border: "1px solid #1A1A1A" }}>
              <div className="text-[42px] font-black leading-none mb-1" style={{ color: "#00FF66" }}>{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "#FFFFFF" }}>{s.label}</div>
              <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#how-it-works"
            className="inline-flex items-center gap-2 text-[14px] font-semibold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 lime-shadow-strong"
            style={{ background: "#00FF66", color: "#000000" }}>
            See How We Fix This →
          </a>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 3: THE PLATFORM — 5 categories
   ═══════════════════════════════════════════════════════ */
function PlatformSection() {
  const categories = [
    { title: "F&B Procurement", items: ["AI demand forecasting", "Spoilage alerts", "FIFO tracking", "Recipe-costing integration"] },
    { title: "Housekeeping Supplies", items: ["Par-level auto-reorder", "Amenity bundle management", "Linen lifecycle tracking", "Eco-friendly product sourcing"] },
    { title: "Engineering & Maintenance", items: ["Preventive maintenance scheduling", "Spare parts catalog", "Work order integration", "Vendor warranty tracking"] },
    { title: "Amenities & Guest Experience", items: ["Guest room amenity kits", "Brand-standard compliance", "Bulk ordering", "Seasonal customization"] },
    { title: "Capital Equipment", items: ["Capex budgeting", "Depreciation tracking", "Installation scheduling", "Multi-vendor quote comparison"] },
  ];

  return (
    <section id="platform" className="py-32 lg:py-[160px]" style={{ background: "#000000" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-20">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] mb-6 px-4 py-1.5 rounded-full" style={{ color: "#00FF66", border: "1px solid rgba(0,255,102,0.25)", background: "rgba(0,255,102,0.06)" }}>THE PLATFORM</span>
          <h2 className="text-[36px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.1]" style={{ color: "#FFFFFF" }}>
            From F&B to Capital Equipment.<br />
            <span style={{ color: "rgba(255,255,255,0.55)" }}> Every Dirham Tracked. Every Invoice Compliant.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {categories.map((cat) => (
            <div key={cat.title} className="group p-6 rounded-xl transition-all duration-300" style={{ background: "#050505", border: "1px solid #1A1A1A" }}>
              <h3 className="text-[17px] font-bold mb-5 tracking-[-0.01em]" style={{ color: "#FFFFFF" }}>{cat.title}</h3>
              <ul className="space-y-3">
                {cat.items.map((item) => (
                  <li key={item} className="text-[13px] leading-relaxed flex items-start gap-2.5" style={{ color: "rgba(255,255,255,0.6)" }}>
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#00FF66" }} /> {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 text-[12px] font-semibold tracking-wide uppercase transition-colors" style={{ color: "rgba(255,255,255,0.4)" }}>Explore</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 4: FOR HOTELS — AI Features
   ═══════════════════════════════════════════════════════ */

function ForHotelsSection() {
  const [activeTab, setActiveTab] = useState(0);
  const features = [
    { title: "AI Demand Forecasting", desc: "Predict F&B, housekeeping, and amenity needs based on occupancy, events, seasonality, and historical data", icon: "📊" },
    { title: "Cost Estimation Pre-Order", desc: "See exact projected cost before approving any PO — no budget surprises", icon: "💰" },
    { title: "Reorder Alerts", desc: "Automatic notifications when inventory hits par level, with suggested order quantities", icon: "🔔" },
    { title: "Spend Analytics Dashboard", desc: "Real-time visibility across all 5 categories, all properties, all suppliers — in one view", icon: "📈" },
  ];

  return (
    <section id="for-hotels" className="py-32 lg:py-[160px]" style={{ background: "#000000" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-4" style={{ color: "#00FF66" }}>FOR HOTELS</span>
            <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.03em] leading-[1.12]" style={{ color: "#FFFFFF" }}>
              Control Before.
              <br />
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Not After.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Most procurement platforms tell you what you spent last month. We tell you what you should order next week. HotelsVendors embeds AI-powered demand forecasting directly into your procurement workflow.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              Before you create a purchase order, you see: projected guest occupancy, historical consumption patterns, seasonal adjustments, and real-time price comparisons across verified suppliers. You don't just track spend. You prevent waste. You optimize par levels. You negotiate from a position of data, not desperation.
            </p>

            <div className="mt-8 space-y-3">
              {features.map((f, i) => (
                <div key={f.title} className="p-4 rounded-xl transition-all cursor-pointer"
                  style={{
                    background: activeTab === i ? "#080808" : "transparent",
                    border: activeTab === i ? "1px solid #00FF66" : "1px solid transparent",
                  }}
                  onMouseEnter={() => setActiveTab(i)}>
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{f.icon}</span>
                    <div>
                      <h4 className="text-[14px] font-bold" style={{ color: "#FFFFFF" }}>{f.title}</h4>
                      <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/register/hotel"
              className="inline-flex items-center gap-2 mt-8 text-[14px] font-semibold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 lime-shadow-strong"
              style={{ background: "#00FF66", color: "#000000" }}>
              Request Hotel Demo →
            </Link>
          </div>

          {/* Chart mockup */}
          <div className="p-8 rounded-2xl" style={{ background: "#050505", border: "1px solid #1A1A1A" }}>
            <div className="flex items-center gap-2 mb-6">
              {["Forecasting", "Cost Control", "Inventory", "Analytics"].map((tab, i) => (
                <button key={tab}
                  className="text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
                  style={{
                    background: activeTab === i ? "#00FF66" : "transparent",
                    color: activeTab === i ? "#000000" : "rgba(255,255,255,0.55)",
                  }}>
                  {tab}
                </button>
              ))}
            </div>
            {/* Simple chart representation */}
            <div className="h-[260px] rounded-xl p-6 flex items-end justify-between gap-2"
              style={{ background: "#000000" }}>
              {[65, 45, 78, 55, 90, 60, 72].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t-md transition-all"
                    style={{
                      height: h * 2,
                      background: i >= 4 ? "#00FF66" : "rgba(255,255,255,0.2)",
                      opacity: i >= 4 ? 0.9 : 0.3,
                    }} />
                  <span className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][i]}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-6 mt-4 justify-center">
              <div className="flex items-center gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#00FF66" }} /> Projected
              </div>
              <div className="flex items-center gap-2 text-[10px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(255,255,255,0.3)", opacity: 0.3 }} /> Actual
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 5: FOR SUPPLIERS — InstaPay + Factoring
   ═══════════════════════════════════════════════════════ */
function ForSuppliersSection() {
  const features = [
    { title: "Instant InstaPay Settlement", desc: "Receive full invoice amount in &lt;10 seconds via IPN. Zero deduction. 24/7 including weekends.", icon: "⚡" },
    { title: "Non-Recourse Factoring", desc: "Get paid within 24 hours. Platform assumes credit risk. No recourse if hotel defaults.", icon: "🛡️" },
    { title: "Verified Supplier Badge", desc: "Pass KYC verification to earn a trust badge visible to all hotels. Higher visibility = more orders.", icon: "✓" },
    { title: "Digital Invoice Management", desc: "Submit invoices digitally, track payment status in real-time, automatic ETA e-invoice generation.", icon: "📄" },
  ];

  return (
    <section id="for-suppliers" className="py-32 lg:py-[160px]" style={{ background: "#000000" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-4" style={{ color: "#00FF66" }}>FOR SUPPLIERS</span>
            <h2 className="text-[32px] md:text-[42px] font-bold tracking-[-0.03em] leading-[1.12]" style={{ color: "#FFFFFF" }}>
              Get Paid.
              <br />
              <span style={{ color: "rgba(255,255,255,0.55)" }}>Not Promised.</span>
            </h2>
            <p className="mt-5 text-[15px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              The biggest barrier for Egyptian hospitality suppliers isn't finding buyers. It's collecting money after you've delivered. HotelsVendors changes the equation.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              When a hotel approves your invoice, you can choose to get paid instantly via InstaPay — funds hit your account in under 10 seconds, 24/7, even on weekends. Or, opt for our non-recourse factoring: we pay you within 24 hours, and we take the credit risk. If the hotel doesn't pay, that's our problem. Not yours.
            </p>
            <p className="mt-4 text-[14px] leading-relaxed" style={{ color: "#00FF66" }}>
              Your liquidity turnover goes from 30-90 days to same-day. Your cash flow becomes predictable. Your business grows.
            </p>

            <div className="mt-8 space-y-3">
              {features.map((f) => (
                <div key={f.title} className="p-4 rounded-xl transition-all "
                  style={{ background: "#050505", border: "1px solid #1A1A1A" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{f.icon}</span>
                    <div>
                      <h4 className="text-[14px] font-bold" style={{ color: "#FFFFFF" }}>{f.title}</h4>
                      <p className="text-[12px] mt-1 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{f.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Link href="/register/supplier"
              className="inline-flex items-center gap-2 mt-8 text-[14px] font-semibold px-8 py-3.5 rounded-full transition-all hover:-translate-y-0.5 lime-shadow-strong"
              style={{ background: "#00FF66", color: "#000000" }}>
              Become a Verified Supplier →
            </Link>
          </div>

          {/* Payment flow visual */}
          <div className="p-8 rounded-2xl" style={{ background: "#050505", border: "1px solid #1A1A1A" }}>
            <h4 className="text-[14px] font-bold mb-6" style={{ color: "#FFFFFF" }}>
              Payment Flow: Same Day vs Traditional
            </h4>
            {[
              { step: "01", day: "Day 0", title: "Supplier Delivers Goods", desc: "Invoice submitted digitally" },
              { step: "02", day: "Day 0", title: "Hotel Approves Invoice", desc: "One-click approval" },
              { step: "03", day: "Day 0", title: "Platform Processes", desc: "Auto ETA e-invoice" },
              { step: "04", day: "Day 0", title: "Supplier PAID", desc: "Funds in &lt;10 seconds" },
            ].map((s, i) => (
              <div key={s.step} className="flex items-start gap-4 pb-5 relative"
                style={{ borderLeft: i < 3 ? "2px dashed" : "none", borderColor: "#00FF66", marginLeft: 8, paddingLeft: 20 }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: "#00FF66", color: "#000000", marginLeft: -24 }}>
                  {s.step}
                </div>
                <div className="flex-1 p-3 rounded-xl" style={{ background: "#000000" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold" style={{ color: "#FFFFFF" }}>{s.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(0,255,102,0.12)", color: "#00FF66" }}>{s.day}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.55)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
            <div className="mt-6 pt-4 flex justify-between items-center" style={{ borderTop: "1px solid #1A1A1A" }}>
              <div className="text-center">
                <div className="text-[11px] line-through" style={{ color: "rgba(255,255,255,0.3)" }}>Traditional</div>
                <div className="text-[14px] font-bold" style={{ color: "rgba(255,255,255,0.55)" }}>30-90 days</div>
              </div>
              <div className="text-[20px] font-bold" style={{ color: "#00FF66" }}>VS</div>
              <div className="text-center">
                <div className="text-[11px]" style={{ color: "#00FF66" }}>HotelsVendors</div>
                <div className="text-[14px] font-bold" style={{ color: "#00FF66" }}>Same Day</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 6: ETA COMPLIANCE
   ═══════════════════════════════════════════════════════ */
function ETAComplianceSection() {
  const complianceItems = [
    { title: "Real-time ETA E-Invoicing SDK Integration", desc: "Platform auto-generates XML/JSON e-invoices in ETA format with digital signature, UUID assignment, and real-time portal submission to the Egyptian Tax Authority clearance model." },
    { title: "Secure Digital Signature & Hardware Token Mapping", desc: "Cryptographic invoice signing via certified hardware security modules. Each transaction stamped with a unique cryptographic identity registered under the ETA digital signer framework." },
    { title: "Automatic UUID Verification & Validation", desc: "Invoices validated by ETA before being sent to the buyer. UUID assigned and verified against the central tax registry. Zero rejected invoices." },
    { title: "5-Year Compliant Legal Archiving Architecture", desc: "All e-invoices, credit notes, and debit notes archived on immutable storage for the legally required 5-year period with instant retrieval and audit trail." },
  ];

  return (
    <section id="eta-compliance" className="py-32 lg:py-[160px]" style={{ background: "#000000" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <div className="text-center mb-20">
          <span className="inline-block text-[11px] font-bold uppercase tracking-[0.3em] mb-6 px-4 py-1.5 rounded-full" style={{ color: "#00FF66", border: "1px solid rgba(0,255,102,0.25)", background: "rgba(0,255,102,0.06)" }}>ETA COMPLIANCE</span>
          <h2 className="text-[36px] md:text-[52px] font-bold tracking-[-0.03em] leading-[1.1]" style={{ color: "#FFFFFF" }}>
            E-Invoicing Is No Longer Optional.<br />
            <span style={{ color: "#00FF66" }}> It is the Law. And the Penalties Are Real.</span>
          </h2>
          <p className="mt-6 text-[16px] max-w-[720px] mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Since 2022, paper invoices are legally INVALID for VAT deduction in Egypt. All B2B transactions must be submitted to the Egyptian Tax Authority in real-time via the clearance model. Non-compliance carries penalties of EGP 20,000\u2013100,000 and potential criminal sanctions.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {["ETA Registered", "Digital Signature Ready", "UUID Auto-Assigned", "5-Year Archive", "GS1 GPC Coded", "VAT Compliant"].map((b) => (
            <span key={b} className="px-4 py-2 text-[12px] font-semibold tracking-wide rounded-full" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A", color: "#FFFFFF" }}>
              {b}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {complianceItems.map((item, i) => (
            <div key={item.title} className="group p-6 rounded-xl transition-all duration-300" style={{ background: "#050505", border: "1px solid #1A1A1A" }}>
              <div className="flex items-start gap-4">
                <span className="text-[13px] font-bold px-2.5 py-1 rounded-md shrink-0 mt-0.5" style={{ background: "rgba(0,255,102,0.1)", color: "#00FF66", border: "1px solid rgba(0,255,102,0.2)" }}>0{i+1}</span>
                <div>
                  <h4 className="text-[16px] font-bold mb-2 tracking-[-0.01em]" style={{ color: "#FFFFFF" }}>{item.title}</h4>
                  <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-xl text-center" style={{ background: "#0A0A0A", border: "1px solid #1A1A1A" }}>
          <p className="text-[14px] font-semibold uppercase tracking-wider" style={{ color: "#00FF66" }}>
            100% ETA Compliant \u2014 Every Invoice, Every Transaction, Automatically
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 7: HOW IT WORKS — 5-step flow
   ═══════════════════════════════════════════════════════ */


function TrustSection() {
  const testimonials = [
    { quote: "We went from 15 WhatsApp groups with suppliers to one dashboard. Our F&B wastage dropped 34% in the first quarter. The ETA compliance alone saved us from a EGP 50,000 penalty.", name: "Karim H.", role: "Procurement Director", hotel: "Grand Nile Hotel, Cairo" },
    { quote: "As a linen supplier, I used to chase payments for 60 days. Now I get paid the same day via InstaPay. My turnover doubled because I can reinvest immediately.", name: "Mona S.", role: "Owner", hotel: "Nile Textile Supplies" },
    { quote: "The AI forecasting is uncanny. It predicted our Eid occupancy surge two weeks ahead and auto-suggested order quantities. We didn't run out of a single SKU.", name: "Ahmed R.", role: "F&B Manager", hotel: "Red Sea Resort, Sharm El-Sheikh" },
  ];

  return (
    <section id="trust" className="py-32 lg:py-[160px]" style={{ background: "#000000" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-4" style={{ color: "#00FF66" }}>TRUST & TRACTION</span>
          <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.12]" style={{ color: "#FFFFFF" }}>
            Built for Egyptian Hospitality.
            <span style={{ color: "rgba(255,255,255,0.55)" }}> Backed by Real Results.</span>
          </h2>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { v: "120+", l: "Hotels Onboarded" },
            { v: "850+", l: "Verified Suppliers" },
            { v: "EGP 500M+", l: "Annual GMV" },
            { v: "<4 hrs", l: "Avg Payment Time" },
          ].map((s) => (
            <div key={s.l} className="p-6 rounded-2xl text-center transition-all "
              style={{ background: "#050505", border: "1px solid #1A1A1A" }}>
              <div className="text-[32px] font-black" style={{ color: "#00FF66" }}>{s.v}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mt-2" style={{ color: "rgba(255,255,255,0.55)" }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="p-7 rounded-2xl transition-all "
              style={{ background: "#050505", border: "1px solid #1A1A1A" }}>
              <div className="text-[24px] leading-none mb-4" style={{ color: "#00FF66", opacity: 0.4 }}>"</div>
              <p className="text-[13px] leading-relaxed mb-5 italic" style={{ color: "rgba(255,255,255,0.55)" }}>"{t.quote}"</p>
              <div>
                <div className="text-[14px] font-bold" style={{ color: "#FFFFFF" }}>{t.name}</div>
                <div className="text-[11px]" style={{ color: "rgba(255,255,255,0.3)" }}>{t.role}, {t.hotel}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Partners */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 pt-8" style={{ borderTop: "1px solid #1A1A1A" }}>
          <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.3)" }}>POWERED BY</span>
          {["InstaPay IPN", "ETA Egypt", "CBE Certified", "Afreximbank Partner"].map((p) => (
            <span key={p} className="text-[11px] font-semibold px-4 py-2 rounded-full"
              style={{ border: "1px solid #1A1A1A", color: "rgba(255,255,255,0.55)" }}>
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 9: PRICING
   ═══════════════════════════════════════════════════════ */
function PricingSection() {
  const plans = [
    {
      name: "Starter", price: "Free", featured: false,
      features: ["Single property, <50 rooms", "2 AI questions/day", "10 verified suppliers", "F&B + Housekeeping", "Basic ETA e-invoice", "InstaPay standard", "Basic dashboard", "Email support"],
      cta: "Sign Up Free", href: "/register/hotel",
    },
    {
      name: "Professional", price: "EGP 2,500", period: "/mo", featured: true,
      features: ["Multi-property, 50-200 rooms", "Unlimited AI questions", "Unlimited suppliers", "All 5 categories", "Full ETA compliance + archiving", "InstaPay + Scheduled", "Advanced + Forecasting", "Priority + WhatsApp"],
      cta: "Start 14-Day Trial", href: "/register/hotel",
    },
    {
      name: "Enterprise", price: "Custom", featured: false,
      features: ["Hotel chains, 200+ rooms", "Unlimited + Custom AI Models", "Unlimited + Onboarding Support", "All 5 + Custom Catalogs", "Full + API + Multi-entity", "InstaPay + Factoring + Bulk", "Custom BI + API Access", "Dedicated Account Manager"],
      cta: "Contact Sales", href: "/contact",
    },
  ];

  return (
    <section id="pricing" className="py-32 lg:py-[160px]" style={{ background: "#000000" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-4" style={{ color: "#00FF66" }}>PRICING</span>
          <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.12]" style={{ color: "#FFFFFF" }}>
            Start Free.
            <span style={{ color: "rgba(255,255,255,0.55)" }}> Scale Smart.</span>
          </h2>
          <p className="mt-4 text-[15px] max-w-[550px] mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            No setup fees. No hidden charges. Pay only for what you use. AI questions included. Upgrade when you need more power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[1000px] mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className="p-8 rounded-2xl transition-all  relative"
              style={{
                background: "#050505",
                border: plan.featured ? "2px solid #00FF66" : "1px solid #1A1A1A",
              }}>
              {plan.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
                  style={{ background: "#00FF66", color: "#000000" }}>
                  MOST POPULAR
                </div>
              )}
              <h3 className="text-[20px] font-bold" style={{ color: "#FFFFFF" }}>{plan.name}</h3>
              <div className="mt-3 mb-6">
                <span className="text-[36px] font-black" style={{ color: "#FFFFFF" }}>{plan.price}</span>
                {plan.period && <span className="text-[14px]" style={{ color: "rgba(255,255,255,0.3)" }}>{plan.period}</span>}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[12px]" style={{ color: "rgba(255,255,255,0.55)" }}>
                    <span style={{ color: "#00FF66" }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Link href={plan.href}
                className="block w-full text-center text-[13px] font-bold py-3 rounded-full transition-all hover:-translate-y-0.5"
                style={plan.featured
                  ? { background: "#00FF66", color: "#000000" }
                  : { border: "1px solid #1A1A1A", color: "#FFFFFF" }
                }>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-8 text-center text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          All paid plans include: Free supplier onboarding · Zero payment processing markup · Automatic ETA updates · 99.9% uptime SLA · Bank-grade encryption
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 10: FAQ
   ═══════════════════════════════════════════════════════ */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: "Do hotels pay suppliers through the platform, or does the platform hold funds?", a: "Neither. HotelsVendors is a payment initiator, not a funds holder. When a hotel approves an invoice, the platform generates a payment instruction sent via InstaPay's IPN rail. Funds move directly from the hotel's bank account to the supplier's bank account in under 10 seconds. We never touch the money — which means no PSP license complexity and maximum security for both parties." },
    { q: "How does the non-recourse factoring work?", a: "When a supplier opts for factoring, HotelsVendors pays the supplier within 24 hours of invoice approval. We then collect from the hotel on the agreed due date. If the hotel doesn't pay, we absorb the loss — the supplier has no recourse obligation. This is true non-recourse factoring, backed by our risk assessment of each hotel's credit profile." },
    { q: "Is ETA e-invoicing really mandatory for my hotel?", a: "Yes. Since April 2023, all VAT-registered businesses in Egypt must issue electronic invoices for B2B transactions. Paper invoices are legally invalid for VAT deduction. Penalties range from EGP 20,000 to EGP 100,000. HotelsVendors automatically generates ETA-compliant e-invoices in XML/JSON format, submits them for pre-clearance, and assigns UUIDs — so you're always compliant without lifting a finger." },
    { q: "What suppliers are available on the platform?", a: "We verify every supplier before they join. Current categories include F&B (fresh produce, dry goods, beverages, imported items), Housekeeping (cleaning chemicals, linens, amenities, equipment), Engineering (spare parts, HVAC, electrical, plumbing), Amenities (guest room kits, toiletries, branded items), and Capital Equipment (kitchen appliances, laundry machines, furniture). New suppliers are added weekly." },
    { q: "How much does InstaPay cost per transaction?", a: "InstaPay charges 0.2% of the transaction value via corporate banking channels, capped at EGP 200 per transaction. For a typical EGP 50,000 supplier invoice, that's EGP 100. The supplier receives the full amount — zero deductions. Compare that to the hidden costs of cash handling (security, transportation, counting, reconciliation errors) which typically exceed EGP 500-1,000 per month for an active hotel." },
    { q: "Can I use HotelsVendors if I already have an ERP?", a: "Absolutely. HotelsVendors integrates with major ERP systems including SAP, Oracle NetSuite, Odoo, and local Egyptian accounting software. We can sync purchase orders, invoices, and payment data bidirectionally. Many of our customers use us as their procurement layer while keeping their existing ERP for general ledger and financial reporting." },
    { q: "What happens to my data?", a: "Your data is hosted on Egyptian cloud infrastructure (AWS Cairo region) and encrypted at rest (AES-256) and in transit (TLS 1.3). We comply with Egypt's Personal Data Protection Law (Law No. 151 of 2020). We never sell your data. Hotels see only their own data; suppliers see only their own transactions." },
  ];

  return (
    <section className="py-32 lg:py-[160px]" style={{ background: "#000000" }}>
      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.12]" style={{ color: "#FFFFFF" }}>
            Questions?
            <span style={{ color: "rgba(255,255,255,0.55)" }}> We've Got Answers.</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="rounded-xl overflow-hidden transition-all"
              style={{
                background: "#050505",
                border: openIndex === i ? "1px solid #00FF66" : "1px solid #1A1A1A",
              }}>
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4">
                <span className="text-[14px] font-semibold" style={{ color: "#FFFFFF" }}>{faq.q}</span>
                <span className="text-[16px] transition-transform shrink-0"
                  style={{
                    color: "#00FF66",
                    transform: openIndex === i ? "rotate(45deg)" : "rotate(0deg)",
                  }}>
                  +
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-[13px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION 11: FINAL CTA
   ═══════════════════════════════════════════════════════ */
function FinalCTASection() {
  return (
    <section className="py-24 lg:py-[120px] relative overflow-hidden" style={{ background: "#000000" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full opacity-[0.05]"
          style={{ background: "#00FF66", filter: "blur(160px)" }} />
      </div>
      <div className="relative z-10 max-w-[700px] mx-auto px-6 text-center">
        <h2 className="text-[34px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.08]" style={{ color: "#FFFFFF" }}>
          Stop Managing Suppliers.
          <br />
          <span style={{ color: "#00FF66" }}>Start Commanding Your Supply Chain.</span>
        </h2>
        <p className="mt-5 text-[16px] leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
          Join 120+ Egyptian hotels and 850+ verified suppliers who've already made the switch.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register/hotel"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[14px] font-semibold rounded-full transition-all hover:-translate-y-0.5 lime-shadow-strong"
            style={{ background: "#00FF66", color: "#000000" }}>
            Start Free Today →
          </Link>
          <Link href="/register/supplier"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[14px] font-medium rounded-full transition-all"
            style={{ border: "1px solid #1A1A1A", color: "rgba(255,255,255,0.55)" }}>
            Talk to Our Team
          </Link>
        </div>
        <p className="mt-5 text-[12px]" style={{ color: "rgba(255,255,255,0.3)" }}>
          No credit card required · 2-minute setup · Free forever for Starter tier
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="py-16" style={{ background: "#000000", borderTop: "1px solid #1A1A1A" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="mb-3">
              <span className="text-[18px] font-black tracking-tight">
                <span style={{ color: "#FFFFFF" }}>Hotels</span>
                <span style={{ color: "#00FF66" }}>V</span>
                <span style={{ color: "#FFFFFF" }}>endors</span>
              </span>
            </div>
            <p className="text-[12px] leading-relaxed mb-3" style={{ color: "#FFFFFF", opacity: 0.7 }}>
              AI-powered procurement orchestration for Egyptian hospitality. ETA-compliant, fintech-enabled.
            </p>
            <span className="text-[11px]" style={{ color: "#FFFFFF", opacity: 0.55 }}>Cairo, Egypt</span>
          </div>
          {[
            { title: "Product", links: ["Platform", "For Hotels", "For Suppliers", "Pricing"] },
            { title: "Teams", links: ["Hotels", "Suppliers", "Factoring", "Shipping"] },
            { title: "Resources", links: ["Documentation", "API", "Blog", "Help Center"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "ETA Compliance"] },
          ].map((col) => (
            <div key={col.title}>
              <h5 className="text-[10px] font-semibold uppercase tracking-wider mb-4" style={{ color: "#FFFFFF", opacity: 0.45 }}>
                {col.title}
              </h5>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[12px] transition-colors hover:underline"
                      style={{ color: "#FFFFFF", opacity: 0.7 }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3"
          style={{ borderTop: "1px solid #1A1A1A" }}>
          <span className="text-[11px]" style={{ color: "#FFFFFF", opacity: 0.6 }}>
            © {new Date().getFullYear()} HotelsVendors. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            {["ETA Compliant", "InstaPay IPN", "CBE Certified"].map((b) => (
              <span key={b} className="text-[10px]" style={{ color: "#FFFFFF", opacity: 0.45 }}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: "#000000", fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}>
      <LandingNav />
      <HeroSection />
      <Divider />
      <ScrollReveal><RealitySection /></ScrollReveal>
      <Divider />
      <ScrollReveal><PlatformSection /></ScrollReveal>
      <Divider />
      <ScrollReveal><ForHotelsSection /></ScrollReveal>
      <Divider />
      <ScrollReveal><ForSuppliersSection /></ScrollReveal>
      <Divider />
      <ScrollReveal><ETAComplianceSection /></ScrollReveal>
      <Divider />
      <ScrollReveal><WorkflowSection /></ScrollReveal>
      <Divider />
      <ScrollReveal><TrustSection /></ScrollReveal>
      <Divider />
      <ScrollReveal><PricingSection /></ScrollReveal>
      <Divider />
      <ScrollReveal><FAQSection /></ScrollReveal>
      <Divider />
      <ScrollReveal><FinalCTASection /></ScrollReveal>
      <Footer />
    </main>
  );
}
