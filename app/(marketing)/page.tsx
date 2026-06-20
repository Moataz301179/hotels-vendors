"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Receipt,
  Banknote,
  ShieldCheck,
  Store,
  Building2,
  Truck,
  BarChart3,
  Zap,
  Clock,
  CheckCircle2,
  CheckCircle,
  Shield,
  Sparkles,
  Landmark,
  ChevronDown,
  Play,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketTicker } from "@/components/marketing/market-ticker";
import { FAQSection } from "@/components/marketing/faq-section";
import { HotelDashboardMockup } from "@/components/marketing/hotel-dashboard-mockup";
import { SupplierDashboardMockup } from "@/components/marketing/supplier-dashboard-mockup";
import { FunderDashboardMockup } from "@/components/marketing/funder-dashboard-mockup";
import { RegistrationWizard } from "@/components/auth/registration-wizard";
import { BrandLogo } from "@/components/layout/brand-logo";

/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM — HotelsVendors Dark Theme
   Background: #000000 (OLED black) · Surfaces: #0B0F1A / #0F1320
   Text: #FFFFFF (white) — headings in Playfair Display serif
   Accent: #FF6B00 (neon orange) — decorative only: borders, hovers, frames
   NO colored text for headings or body
   ═══════════════════════════════════════════════════════════════ */

const accent = "#FF6B00";
const accentMuted = "rgba(255,107,0,0.10)";
const accentBorder = "rgba(255,107,0,0.25)";
const turquoise = "#00E5FF";
const turquoiseMuted = "rgba(0,229,255,0.10)";
const enterpriseBlue = "#0369A1";
const surface1 = "#0F1320";
const surface2 = "#141828";
const borderSubtle = "rgba(255,255,255,0.06)";
const borderVisible = "rgba(255,255,255,0.10)";

/* ─── Reveal animation (respects reduced-motion) ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated counter ─── */
function useCounter(end: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let raf: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(p * end));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, active]);
  return count;
}

function Stat({ end, suffix = "", prefix = "", label }: { end: number; suffix?: string; prefix?: string; label: string }) {
  const ref = useRef(null);
  const active = useInView(ref, { once: true });
  const count = useCounter(end, 2200, active);
  return (
    <div ref={ref} className="text-center">
      <div className="text-[22px] md:text-[26px] font-medium tracking-tight text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-[11px] text-white/40 mt-1 uppercase tracking-[0.08em]">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [activeLayer, setActiveLayer] = useState<0 | 1 | 2>(0);
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/v1/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email }),
      });
      setSubmitSuccess(true);
      setCompanyName("");
      setEmail("");
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch { /* silent */ } finally {
      setIsSubmitting(false);
    }
  }, [companyName, email]);

  const layers = [
    {
      key: "hv" as const,
      icon: Building2,
      title: "HotelsVendors",
      tagline: "Procurement OS",
      color: turquoise,
      colorMuted: turquoiseMuted,
      desc: "Your hotel&apos;s command centre. AI predicts what you need before you run out, automates purchase orders, and keeps every invoice ETA-compliant — so your team stops chasing paperwork and starts saving money.",
      features: [
        "AI demand forecasting — 94% accuracy across 14-day windows",
        "Multi-gateway payments: cards, SWIFT, local bank transfers",
        "One-click reverse factoring requests with automated approval flows",
        "ETA & FRA compliance engine — zero manual tax work",
        "AI agents auto-generate POs, delivery notes, and reconciliation reports",
      ],
      cta: { label: "Register as Hotel", href: "/register/hotel" },
      dashboard: HotelDashboardMockup,
    },
    {
      key: "invo" as const,
      icon: Store,
      title: "INVO",
      tagline: "Vendor Marketplace",
      color: accent,
      colorMuted: accentMuted,
      desc: "680+ verified suppliers in one searchable marketplace. Hotels find, compare, and order everything from fresh produce to pool chemicals — with real-time pricing, live inventory, and AI-powered vendor matching.",
      features: [
        "680+ verified suppliers across 6 Egyptian governorates",
        "AI chatbot matches hotels to the right vendor in seconds",
        "Supplier onboarding in under 24 hours — not weeks",
        "Real-time catalog and inventory sync via API",
        "Automated price benchmarking across competing vendors",
      ],
      cta: { label: "Register as Supplier", href: "/register/supplier" },
      dashboard: SupplierDashboardMockup,
    },
    {
      key: "capital" as const,
      icon: Landmark,
      title: "Settlement & Capital",
      tagline: "Financial Infrastructure",
      color: "#A855F7",
      colorMuted: "rgba(168,85,247,0.10)",
      desc: "Suppliers get paid in 48 hours — not 60 days. Licensed funders compete to finance your receivables at the best rate. The hotel keeps its original payment terms. Everyone wins.",
      features: [
        "Competitive multi-funder bidding drives down factoring fees",
        "Suppliers paid within 48 hours via direct bank settlement",
        "FRA anti-fraud compliance: PO + ETA UUID + signed delivery note",
        "SHA-256 cryptographic audit trail on every transaction",
        "Non-recourse structure — zero liability if the counterparty defaults",
      ],
      cta: { label: "Register as Funder", href: "/register/funder" },
      dashboard: FunderDashboardMockup,
    },
  ];

  const active = layers[activeLayer];

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#0B0F1A", color: "#F2F4F7" }}>
      <MarketingNav />

      {/* ═══════════════════════════════════════════════════════════
          HERO — Two-column: marketing text left, dashboard right
          Big brand logo top-center · Playfair Display headings
          OLED black bg · neon orange accent (decorative only)
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden" style={{ backgroundColor: "#000000" }}>
        {/* Subtle orange glow behind logo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full pointer-events-none opacity-40" style={{ background: `radial-gradient(ellipse, ${accentMuted} 0%, transparent 70%)` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Brand logo — top center, extra large */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-12 md:mb-16"
          >
            <BrandLogo variant="dark" size="xxl" />
          </motion.div>

          {/* Two-column: dashboard mockup LEFT, marketing title RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Left: Dashboard mockup in tablet frame */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="relative"
            >
              {/* Tablet/iPad frame */}
              <div
                className="relative rounded-[28px] p-3 shadow-2xl"
                style={{
                  background: "linear-gradient(145deg, #1a1a1a, #0d0d0d)",
                  border: "2px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 25px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                {/* Screen bezel highlight */}
                <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                {/* Camera notch */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white/[0.06]" />
                {/* Screen content */}
                <div className="rounded-[20px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                  <HotelDashboardMockup />
                </div>
              </div>
              {/* Reflection glow */}
              <div
                className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-30"
                style={{ background: accent }}
              />
            </motion.div>

            {/* Right: Marketing content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
            >
              <h1
                className="text-[28px] md:text-[40px] lg:text-[46px] font-normal text-white mb-5 leading-[1.15]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Procurement That
                <br />
                Pays for Itself
              </h1>
              <p className="text-[14px] md:text-[16px] text-white/50 max-w-md mb-8 leading-relaxed">
                Cut procurement costs by 15–25%, settle suppliers in 48 hours, and stay ETA-compliant automatically. The operating system for Egypt&apos;s hospitality supply chain.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button
                  onClick={() => setWizardOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-semibold rounded-xl transition-all hover:opacity-90 cursor-pointer"
                  style={{ background: accent, color: "#ffffff" }}
                >
                  Get Started Free
                  <ArrowRight size={16} />
                </button>
                <Link
                  href="/sandbox"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] font-medium rounded-xl border transition-all hover:bg-white/[0.04]"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.7)" }}
                >
                  <Play size={14} />
                  Explore Sandbox
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-2">
                {["680+ Verified Suppliers", "ETA Compliant", "94% Forecast Accuracy", "Free to Start"].map((label) => (
                  <span
                    key={label}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium text-white/40"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
                  >
                    {label}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-14 flex justify-center"
          >
            <a href="#layers" className="flex flex-col items-center gap-1 text-white/20 hover:text-white/40 transition-colors">
              <span className="text-[10px] tracking-[0.15em] uppercase">Explore</span>
              <ChevronDown size={14} className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARKET TICKER
          ═══════════════════════════════════════════════════════════ */}
      <MarketTicker />

      {/* ═══════════════════════════════════════════════════════════
          STATS — Compact row
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-14 border-y" style={{ borderColor: borderSubtle }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <Stat end={680} suffix="+" label="Verified Suppliers" />
            <Stat end={94} suffix="%" label="Forecast Accuracy" />
            <Stat end={48} suffix="h" label="Supplier Settlement" />
            <Stat end={40} suffix="%" label="Cost Reduction" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THREE-LAYER ARCHITECTURE
          ═══════════════════════════════════════════════════════════ */}
      <section id="layers" className="py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] mb-2 block" style={{ color: accent }}>
                Three-Layer Architecture
              </span>
              <h2 className="text-[18px] md:text-[22px] font-medium tracking-tight text-white mb-3">
                One Platform, Three Stakeholders
              </h2>
              <p className="text-[13px] text-white/40 max-w-md mx-auto leading-relaxed">
                Hotels buy. Suppliers sell. Funders finance. AI agents orchestrate every transaction end to end.
              </p>
            </div>
          </Reveal>

          {/* Layer cards */}
          <Reveal>
            <div className="grid md:grid-cols-3 gap-3 mb-12">
              {layers.map((layer, i) => {
                const Icon = layer.icon;
                const isActive = activeLayer === i;
                return (
                  <button
                    key={layer.key}
                    onClick={() => setActiveLayer(i as 0 | 1 | 2)}
                    className="text-left rounded-xl p-5 transition-all cursor-pointer card-outlined"
                    style={{
                      background: isActive ? surface2 : surface1,
                      borderColor: isActive ? "rgba(255,255,255,0.10)" : undefined,
                    }}
                  >
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                        <Icon size={16} className="text-white/60" />
                      </div>
                      <div>
                        <h3 className="text-[13px] font-medium text-white">{layer.title}</h3>
                        <p className="text-[10px] font-medium text-white/30">{layer.tagline}</p>
                      </div>
                    </div>
                    <p className="text-[12px] text-white/40 leading-relaxed mb-3">{layer.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {(i === 0 ? ["AI Forecasting", "ETA Compliance", "Factoring"] :
                        i === 1 ? ["680+ Suppliers", "24h Onboarding", "API Sync"] :
                        ["48h Payout", "Multi-Funder", "FRA Compliant"]
                      ).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-medium text-white/30" style={{ background: "rgba(255,255,255,0.03)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Active layer detail */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid md:grid-cols-2 gap-8 items-center"
            >
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <active.icon size={16} style={{ color: active.color }} />
                  <span className="text-[10px] font-medium uppercase tracking-[0.1em]" style={{ color: active.color }}>
                    {active.title} · {active.tagline}
                  </span>
                </div>
                <h3 className="text-[16px] md:text-[20px] font-medium text-white mb-3 leading-tight">
                  {activeLayer === 0 ? "Stop Guessing What to Order" :
                   activeLayer === 1 ? "Every Supplier You Need, One Search" :
                   "Suppliers Paid in 48 Hours — Not 60 Days"}
                </h3>
                <p className="text-[13px] text-white/45 leading-relaxed mb-6">{active.desc}</p>
                <ul className="space-y-2.5 mb-6">
                  {active.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-[12px] text-white/55">
                      <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: active.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={active.cta.href}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-medium rounded-lg transition-all hover:opacity-90"
                  style={{ background: active.color, color: activeLayer === 1 ? "#0B0F1A" : "#ffffff" }}
                >
                  {active.cta.label} <ArrowRight size={13} />
                </Link>
              </div>
              <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${borderVisible}` }}>
                <active.dashboard />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <hr style={{ borderColor: borderSubtle, borderTop: "1px solid", margin: 0 }} />

      {/* ═══════════════════════════════════════════════════════════
          VIDEO SPACE — Platform overview video
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-10">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] mb-2 block" style={{ color: accent }}>
                Platform Overview
              </span>
              <h2 className="text-[18px] md:text-[22px] font-medium tracking-tight text-white mb-3">
                See How It Works
              </h2>
              <p className="text-[13px] text-white/40 max-w-md mx-auto">
                Watch how hotels, suppliers, and funders connect on one platform — from AI-powered forecasting to 48-hour supplier settlement.
              </p>
            </div>
          </Reveal>

          <Reveal>
            <div
              className="relative rounded-2xl overflow-hidden mx-auto max-w-4xl"
              style={{
                border: `1px solid ${borderVisible}`,
                background: surface1,
                aspectRatio: "16/9",
              }}
            >
              {/* Video placeholder — replace src with actual video URL */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: accentMuted, border: `1px solid ${accentBorder}` }}
                >
                  <Play size={24} style={{ color: accent }} className="ml-1" />
                </div>
                <p className="text-[13px] text-white/30">Video coming soon</p>
                <p className="text-[11px] text-white/20">16:9 · Platform walkthrough</p>
              </div>
              {/* Uncomment when video is ready:
              <video
                className="w-full h-full object-cover"
                controls
                poster="/video-poster.jpg"
                playsInline
              >
                <source src="/videos/platform-overview.mp4" type="video/mp4" />
              </video>
              */}
            </div>
          </Reveal>
        </div>
      </section>

      <hr style={{ borderColor: borderSubtle, borderTop: "1px solid", margin: 0 }} />

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS — 4 steps
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24">
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] mb-2 block" style={{ color: turquoise }}>
                How It Works
              </span>
              <h2 className="text-[18px] md:text-[22px] font-medium tracking-tight text-white mb-3">
                Live in 24 Hours, Saving in 30 Days
              </h2>
              <p className="text-[13px] text-white/40 max-w-md mx-auto">
                No subscription. No setup fee. No credit card. AI agents handle the complexity — you handle the savings.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Join Free", desc: "AI-guided registration in under 5 minutes. No paperwork, no credit card, no commitment.", icon: Building2 },
              { step: "02", title: "Discover & Order", desc: "Search 680+ verified suppliers. AI matches you to the best vendor for every product.", icon: Store },
              { step: "03", title: "Checkout & Pay", desc: "Pay via card, SWIFT, or bank transfer. Every invoice is ETA-compliant automatically.", icon: BrainCircuit },
              { step: "04", title: "Settle in 48h", desc: "Suppliers opt for early payment. Funders compete. Supplier gets paid — hotel keeps Net-30/60 terms.", icon: Banknote },
            ].map((item, i) => {
              const StepIcon = item.icon;
              return (
                <Reveal key={item.step} delay={i * 0.08}>
                  <div className="rounded-xl p-5 h-full card-outlined" style={{ background: surface1 }}>
                    <div className="text-[10px] font-medium text-white/20 mb-2 uppercase tracking-wider">Step {item.step}</div>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                      <StepIcon size={15} className="text-white/40" />
                    </div>
                    <h3 className="text-[13px] font-medium text-white mb-1.5">{item.title}</h3>
                    <p className="text-[11px] text-white/35 leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <hr style={{ borderColor: borderSubtle, borderTop: "1px solid", margin: 0 }} />

      {/* ═══════════════════════════════════════════════════════════
          PLATFORM CAPABILITIES — 6 pillars
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24" style={{ background: "#080B14" }}>
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] mb-2 block" style={{ color: turquoise }}>
                Platform Capabilities
              </span>
              <h2 className="text-[18px] md:text-[22px] font-medium tracking-tight text-white mb-3">
                Built for Hospitality. Compliant by Default.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: BrainCircuit, title: "AI Demand Forecasting", desc: "Predict what you&apos;ll need 14 days out — factoring in occupancy, events, and seasonality. 94% accuracy means less waste, fewer emergency orders, and tighter budgets." },
              { icon: Receipt, title: "ETA E-Invoicing — Automatic", desc: "Every invoice is digitally signed, UUID-validated, and submitted to the Egyptian Tax Authority automatically. Zero manual tax work. Zero compliance risk." },
              { icon: Truck, title: "Shared-Route Logistics", desc: "AI consolidates deliveries across suppliers and properties. Cut logistics costs by up to 40% — critical for remote Red Sea and South Sinai resorts." },
              { icon: Banknote, title: "Embedded Reverse Factoring", desc: "Suppliers request early payment. Licensed funders compete on rate. Supplier gets cash in 48 hours. Hotel keeps its Net-30/60 terms. Everyone wins." },
              { icon: ShieldCheck, title: "FRA Anti-Fraud Compliance", desc: "Three-way matching (PO + ETA UUID + signed delivery note) on every transaction. SHA-256 audit trails. Real-time fraud detection. Fully FRA-compliant." },
              { icon: BarChart3, title: "Cost Control & Analytics", desc: "Real-time spend visibility across every property, department, and vendor. AI flags anomalies, benchmarks prices, and surfaces savings opportunities automatically." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.05}>
                  <div className="rounded-xl p-5 h-full transition-all hover:-translate-y-0.5 card-outlined" style={{ background: surface1 }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: turquoiseMuted }}>
                      <Icon size={16} style={{ color: turquoise }} />
                    </div>
                    <h3 className="text-[12px] font-medium text-white mb-1.5">{f.title}</h3>
                    <p className="text-[11px] text-white/35 leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <hr style={{ borderColor: borderSubtle, borderTop: "1px solid", margin: 0 }} />

      {/* ═══════════════════════════════════════════════════════════
          TRUST & SECURITY
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] mb-2 block" style={{ color: accent }}>
                Security & Compliance
              </span>
              <h2 className="text-[18px] md:text-[22px] font-medium tracking-tight text-white mb-3">
                Trusted by Banks. Built for Regulators.
              </h2>
              <p className="text-[13px] text-white/40 max-w-md mx-auto">
                AES-256 encryption. RSA 2048-bit digital signatures. Egyptian data residency. Every transaction is cryptographically auditable.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
            {[
              { icon: Shield, title: "ETA Phase 1 & 2 Compliant", desc: "Full integration with Egyptian Tax Authority e-invoicing pipeline. RSA 2048-bit digital signing, UUID validation.", color: turquoise },
              { icon: ShieldCheck, title: "FRA Anti-Fraud Framework", desc: "Three-way matching (PO + UUID + Delivery Note), SHA-256 audit trails, real-time fraud detection.", color: accent },
              { icon: Zap, title: "AES-256-GCM Encryption", desc: "All data at rest encrypted. Keys rotated every 90 days. TLS 1.3 in transit.", color: enterpriseBlue },
              { icon: CheckCircle, title: "ISO 27001 Aligned", desc: "Information security management aligned with ISO 27001. Regular third-party audits.", color: "#A855F7" },
              { icon: Clock, title: "Data Residency — Egypt", desc: "All tenant data hosted on servers within Egypt. No data leaves Egyptian jurisdiction.", color: turquoise },
              { icon: Banknote, title: "Tenant Data Isolation", desc: "Each hotel/supplier/funder in fully isolated data scope. Cross-tenant access is architecturally impossible.", color: accent },
            ].map((cert, i) => {
              const Icon = cert.icon;
              return (
                <Reveal key={cert.title} delay={i * 0.05}>
                  <div className="rounded-xl p-5 h-full" style={{ background: surface1, border: `1px solid ${borderSubtle}` }}>
                    <div className="flex items-center gap-2.5 mb-2.5">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: cert.color + "12" }}>
                        <Icon size={14} style={{ color: cert.color }} />
                      </div>
                      <span className="text-[8px] font-medium px-1.5 py-0.5 rounded-full uppercase tracking-wider" style={{ background: cert.color + "12", color: cert.color }}>
                        Active
                      </span>
                    </div>
                    <h3 className="text-[12px] font-medium text-white/80 mb-1.5">{cert.title}</h3>
                    <p className="text-[11px] text-white/40 leading-relaxed">{cert.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Legal disclaimer */}
          <Reveal>
            <div className="rounded-lg p-4 text-center" style={{ background: accentMuted, border: `1px solid ${accentBorder}` }}>
              <p className="text-[11px] text-white/50 leading-relaxed">
                <strong style={{ color: accent }}>Restaurants for E-Marketing</strong> operates as a{" "}
                <strong className="text-white/60">technical data orchestrator</strong> — not a bank, not a payment service provider, not a factoring company.
                All financial flows are processed through licensed institutions. Zero liability for counterparty collection defaults.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <hr style={{ borderColor: borderSubtle, borderTop: "1px solid", margin: 0 }} />

      {/* ═══════════════════════════════════════════════════════════
          CTA — Single focused conversion
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: `radial-gradient(ellipse at center, ${accentMuted} 0%, transparent 70%)` }} />
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <Reveal>
            <h2 className="text-[18px] md:text-[22px] font-medium tracking-tight text-white mb-4">
              Your Supply Chain Is Leaking Money
            </h2>
            <p className="text-[13px] text-white/40 mb-8 max-w-md mx-auto leading-relaxed">
              Every manual PO, every late invoice, every untracked delivery — it adds up. HotelsVendors plugs the leaks. Free to start, live in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setWizardOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-medium rounded-lg transition-all hover:opacity-90 cursor-pointer"
                style={{ background: accent, color: "#0B0F1A" }}
              >
                Get Started Free <ArrowRight size={14} />
              </button>
              <Link
                href="/sandbox"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-medium rounded-lg border transition-all hover:bg-white/[0.04]"
                style={{ borderColor: borderVisible, color: "rgba(255,255,255,0.6)" }}
              >
                <Sparkles size={13} /> Explore Sandbox
              </Link>
            </div>
            <p className="text-[10px] text-white/25 mt-5">No credit card required · Free to start · Dedicated onboarding</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-24 border-t" style={{ borderColor: borderSubtle, background: "#060810" }}>
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-10">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] mb-2 block" style={{ color: accent }}>
                FAQ
              </span>
              <h2 className="text-[18px] md:text-[22px] font-medium tracking-tight text-white mb-3">
                Questions? Answered.
              </h2>
            </div>
          </Reveal>
          <FAQSection />
        </div>
      </section>

      <MarketingFooter />

      <RegistrationWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </main>
  );
}
