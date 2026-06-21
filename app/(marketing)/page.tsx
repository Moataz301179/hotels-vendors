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
  CheckCircle2,
  ChevronDown,
  Play,
  TrendingUp,
  Clock,
  Globe,
  Landmark,
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
   DESIGN SYSTEM — HotelsVendors
   Background: #000000 · Surface: #0A0F1B
   Text: #FFFFFF · Headings: Playfair Display serif
   Accent: #FF6B00 (orange) — borders, hovers, icon frames only
   ═══════════════════════════════════════════════════════════════ */

const accent = "#FF6B00";
const accentMuted = "rgba(255,107,0,0.08)";
const accentBorder = "rgba(255,107,0,0.20)";
const surface = "#0A0F1B";
const borderSubtle = "rgba(255,255,255,0.06)";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
      <div className="text-[28px] md:text-[36px] font-semibold tracking-tight text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-[11px] text-white/35 mt-1 uppercase tracking-[0.1em]">{label}</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <main className="min-h-screen bg-black text-white">
      <MarketingNav />

      {/* ═══════════════════════════════════════════════════════════
          HERO — Full-width, immersive
          Left: Bold headline + value prop + CTA
          Right: Large dashboard mockup in device frame
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden" style={{ backgroundColor: "#000000" }}>
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none opacity-30" style={{ background: `radial-gradient(ellipse, ${accentMuted} 0%, transparent 70%)` }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[300px] rounded-full pointer-events-none opacity-10" style={{ background: `radial-gradient(ellipse, rgba(0,229,255,0.1) 0%, transparent 70%)` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Brand logo */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-10"
          >
            <BrandLogo variant="dark" size="xl" />
          </motion.div>

          {/* Two-column hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: Marketing content (5 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5"
            >
              <h1
                className="text-[32px] md:text-[44px] lg:text-[52px] font-normal text-white mb-6 leading-[1.1] tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Procurement
                <br />
                That Pays for
                <br />
                Itself
              </h1>
              <p className="text-[15px] md:text-[16px] text-white/45 max-w-md mb-8 leading-relaxed">
                Egypt&apos;s hospitality supply chain runs on AI. Cut costs by 15–25%, settle suppliers in 48 hours, and stay ETA-compliant — automatically.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={() => setWizardOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-semibold rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] cursor-pointer"
                  style={{ background: accent, color: "#ffffff" }}
                >
                  Get Started Free
                  <ArrowRight size={16} />
                </button>
                <Link
                  href="/sandbox"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-medium rounded-xl border transition-all hover:bg-white/[0.04]"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
                >
                  <Play size={14} />
                  Explore Sandbox
                </Link>
              </div>

              {/* Trust badges — inline, compact */}
              <div className="flex flex-wrap items-center gap-4 text-[12px] text-white/30">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} style={{ color: accent }} />
                  No credit card
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} style={{ color: accent }} />
                  Live in 24 hours
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={12} style={{ color: accent }} />
                  680+ suppliers
                </span>
              </div>
            </motion.div>

            {/* Right: Dashboard mockup (7 cols — larger) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="lg:col-span-7"
            >
              <div
                className="relative rounded-[24px] p-2.5"
                style={{
                  background: "linear-gradient(145deg, #1a1a1a, #0a0a0a)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
                }}
              >
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="rounded-[18px] overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                  <HotelDashboardMockup />
                </div>
              </div>
              {/* Glow under the dashboard */}
              <div
                className="absolute -bottom-6 left-1/4 right-1/4 h-12 rounded-full blur-2xl opacity-20"
                style={{ background: accent }}
              />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 flex justify-center"
          >
            <a href="#stats" className="flex flex-col items-center gap-1 text-white/15 hover:text-white/30 transition-colors">
              <span className="text-[9px] tracking-[0.2em] uppercase">Scroll</span>
              <ChevronDown size={12} className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARKET TICKER
          ═══════════════════════════════════════════════════════════ */}
      <MarketTicker />

      {/* ═══════════════════════════════════════════════════════════
          STATS — Bold, large numbers
          ═══════════════════════════════════════════════════════════ */}
      <section id="stats" className="py-16 border-y" style={{ borderColor: borderSubtle }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            <Stat end={680} suffix="+" label="Verified Suppliers" />
            <Stat end={94} suffix="%" label="Forecast Accuracy" />
            <Stat end={48} suffix="h" label="Supplier Settlement" />
            <Stat end={40} suffix="%" label="Cost Reduction" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THREE STAKEHOLDERS — Tabbed showcase
          ═══════════════════════════════════════════════════════════ */}
      <ThreeStakeholderSection wizardOpen={setWizardOpen} />

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS — 4 steps, horizontal
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] mb-3 block" style={{ color: accent }}>
                How It Works
              </span>
              <h2 className="text-[22px] md:text-[28px] font-medium tracking-tight text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Live in 24 Hours
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Join Free", desc: "AI-guided registration in 5 minutes. No paperwork, no credit card.", icon: Building2 },
              { step: "02", title: "Discover & Order", desc: "Search 680+ verified suppliers. AI matches you to the best vendor.", icon: Store },
              { step: "03", title: "Checkout & Pay", desc: "Card, SWIFT, or bank transfer. Every invoice ETA-compliant.", icon: BrainCircuit },
              { step: "04", title: "Settle in 48h", desc: "Suppliers get paid early. You keep Net-30/60 terms. Everyone wins.", icon: Banknote },
            ].map((item, i) => {
              const StepIcon = item.icon;
              return (
                <Reveal key={item.step} delay={i * 0.1}>
                  <div className="rounded-xl p-5 h-full" style={{ background: surface, border: `1px solid ${borderSubtle}` }}>
                    <div className="text-[10px] font-medium mb-3 uppercase tracking-wider" style={{ color: accent }}>Step {item.step}</div>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                      <StepIcon size={16} className="text-white/50" />
                    </div>
                    <h3 className="text-[14px] font-medium text-white mb-2">{item.title}</h3>
                    <p className="text-[12px] text-white/35 leading-relaxed">{item.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CAPABILITIES — 6 pillars
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28" style={{ background: "#050810" }}>
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] mb-3 block" style={{ color: accent }}>
                Platform Capabilities
              </span>
              <h2 className="text-[22px] md:text-[28px] font-medium tracking-tight text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Built for Hospitality.
                <br />
                Compliant by Default.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: BrainCircuit, title: "AI Demand Forecasting", desc: "Predict needs 14 days out — factoring occupancy, events, seasonality. 94% accuracy means less waste, fewer emergencies." },
              { icon: Receipt, title: "ETA E-Invoicing — Automatic", desc: "Every invoice digitally signed, UUID-validated, submitted to Egyptian Tax Authority automatically. Zero manual tax work." },
              { icon: Truck, title: "Shared-Route Logistics", desc: "AI consolidates deliveries across suppliers and properties. Cut logistics costs by up to 40% — critical for Red Sea resorts." },
              { icon: Banknote, title: "Embedded Reverse Factoring", desc: "Suppliers request early payment. Licensed funders compete on rate. Supplier gets cash in 48h. Hotel keeps Net-30/60." },
              { icon: ShieldCheck, title: "FRA Anti-Fraud Compliance", desc: "Three-way matching (PO + ETA UUID + delivery note) on every transaction. SHA-256 audit trails. Real-time fraud detection." },
              { icon: BarChart3, title: "Cost Control & Analytics", desc: "Real-time spend visibility across every property, department, and vendor. AI flags anomalies and surfaces savings." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.06}>
                  <div className="rounded-xl p-5 h-full transition-all hover:-translate-y-0.5" style={{ background: surface, border: `1px solid ${borderSubtle}` }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: accentMuted, border: `1px solid ${accentBorder}` }}>
                      <Icon size={16} style={{ color: accent }} />
                    </div>
                    <h3 className="text-[13px] font-medium text-white mb-2">{f.title}</h3>
                    <p className="text-[11px] text-white/35 leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SOCIAL PROOF — Trust bar
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 border-y" style={{ borderColor: borderSubtle }}>
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-8">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/30">
                Trusted by Leading Hotel Groups
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 opacity-40">
              {["Stella Di Mare", "Sunrise Resorts", "Jaz Hotels", "Baron Hotels", "Al Gouna", "Steigenberger"].map((name) => (
                <span key={name} className="text-[13px] font-medium text-white/60 tracking-wide">{name}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA — Single focused conversion
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-30" style={{ background: `radial-gradient(ellipse at center, ${accentMuted} 0%, transparent 60%)` }} />
        <div className="max-w-2xl mx-auto px-6 text-center relative">
          <Reveal>
            <h2 className="text-[24px] md:text-[32px] font-medium tracking-tight text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Your Supply Chain Is
              <br />
              Leaking Money
            </h2>
            <p className="text-[14px] text-white/40 mb-8 max-w-md mx-auto leading-relaxed">
              Every manual PO, every late invoice, every untracked delivery — it adds up. HotelsVendors plugs the leaks. Free to start, live in 24 hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setWizardOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-semibold rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] cursor-pointer"
                style={{ background: accent, color: "#ffffff" }}
              >
                Get Started Free <ArrowRight size={16} />
              </button>
              <Link
                href="/sandbox"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-medium rounded-xl border transition-all hover:bg-white/[0.04]"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
              >
                <Play size={14} /> Explore Sandbox
              </Link>
            </div>
            <p className="text-[10px] text-white/20 mt-6">No credit card required · Free forever for hotels · Dedicated onboarding</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 border-t" style={{ borderColor: borderSubtle, background: "#030508" }}>
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-10">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em] mb-3 block" style={{ color: accent }}>
                FAQ
              </span>
              <h2 className="text-[22px] md:text-[28px] font-medium tracking-tight text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
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

/* ═══════════════════════════════════════════════════════════════
   THREE STAKEHOLDER SECTION
   ═══════════════════════════════════════════════════════════════ */
function ThreeStakeholderSection({ wizardOpen }: { wizardOpen: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      key: "hotel",
      icon: Building2,
      title: "For Hotels",
      subtitle: "Procurement OS",
      desc: "AI predicts what you need before you run out. Automates purchase orders. Keeps every invoice ETA-compliant. Your team stops chasing paperwork and starts saving money.",
      features: [
        "AI demand forecasting — 94% accuracy across 14-day windows",
        "Multi-gateway payments: cards, SWIFT, local bank transfers",
        "One-click reverse factoring with automated approval flows",
        "ETA & FRA compliance engine — zero manual tax work",
      ],
      cta: "Register as Hotel",
      dashboard: HotelDashboardMockup,
    },
    {
      key: "supplier",
      icon: Store,
      title: "For Suppliers",
      subtitle: "INVO Marketplace",
      desc: "680+ verified suppliers in one searchable marketplace. Hotels find, compare, and order everything from fresh produce to pool chemicals — with real-time pricing and AI-powered vendor matching.",
      features: [
        "Access 500+ active hotel buyers across 6 governorates",
        "AI chatbot matches hotels to your products in seconds",
        "Get paid in 48 hours via reverse factoring",
        "Real-time catalog and inventory sync via API",
      ],
      cta: "Register as Supplier",
      dashboard: SupplierDashboardMockup,
    },
    {
      key: "funder",
      icon: Landmark,
      title: "For Funders",
      subtitle: "Settlement & Capital",
      desc: "Suppliers get paid in 48 hours — not 60 days. Licensed funders compete to finance receivables at the best rate. The hotel keeps its original payment terms. Everyone wins.",
      features: [
        "Competitive multi-funder bidding drives down factoring fees",
        "Suppliers paid within 48 hours via direct bank settlement",
        "FRA anti-fraud: PO + ETA UUID + signed delivery note",
        "SHA-256 cryptographic audit trail on every transaction",
      ],
      cta: "Register as Funder",
      dashboard: FunderDashboardMockup,
    },
  ];

  const active = tabs[activeTab];

  return (
    <section className="py-20 md:py-28">
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-12">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] mb-3 block" style={{ color: accent }}>
              Three Stakeholders, One Platform
            </span>
            <h2 className="text-[22px] md:text-[28px] font-medium tracking-tight text-white mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Hotels Buy. Suppliers Sell.
              <br />
              Funders Finance.
            </h2>
          </div>
        </Reveal>

        {/* Tab buttons */}
        <Reveal>
          <div className="flex justify-center gap-2 mb-10">
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = activeTab === i;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(i)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12px] font-medium transition-all cursor-pointer"
                  style={{
                    background: isActive ? accentMuted : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isActive ? accentBorder : borderSubtle}`,
                    color: isActive ? accent : "rgba(255,255,255,0.4)",
                  }}
                >
                  <Icon size={14} />
                  {tab.title}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Active tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.key}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="grid md:grid-cols-2 gap-10 items-center"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <active.icon size={16} style={{ color: accent }} />
                <span className="text-[10px] font-medium uppercase tracking-[0.15em]" style={{ color: accent }}>
                  {active.title} · {active.subtitle}
                </span>
              </div>
              <h3 className="text-[18px] md:text-[22px] font-medium text-white mb-4 leading-tight">
                {active.key === "hotel" ? "Stop Guessing What to Order" :
                 active.key === "supplier" ? "Sell to 500+ Hotels in One Click" :
                 "Finance Hotel Receivables at Scale"}
              </h3>
              <p className="text-[13px] text-white/45 leading-relaxed mb-6">{active.desc}</p>
              <ul className="space-y-3 mb-8">
                {active.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[12px] text-white/55">
                    <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: accent }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => wizardOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-lg transition-all hover:opacity-90 cursor-pointer"
                style={{ background: accent, color: "#ffffff" }}
              >
                {active.cta} <ArrowRight size={14} />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${borderSubtle}` }}>
              <active.dashboard />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
