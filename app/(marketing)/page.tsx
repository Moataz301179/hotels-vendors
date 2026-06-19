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
  TrendingUp,
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

/* ═══════════════════════════════════════════════════════════════
   DESIGN SYSTEM — Single source of truth for this page
   Accent: #FFB000 (yellow) · Secondary: #10B981 (emerald)
   Background: #0B0F1A · Surfaces: #0F1320 → #141828 → #1C2032
   ═══════════════════════════════════════════════════════════════ */

const accent = "#FFB000";
const accentMuted = "rgba(255,176,0,0.10)";
const accentBorder = "rgba(255,176,0,0.25)";
const emerald = "#10B981";
const emeraldMuted = "rgba(16,185,129,0.10)";
const surface1 = "#0F1320";
const surface2 = "#141828";
const borderSubtle = "rgba(255,255,255,0.06)";
const borderVisible = "rgba(255,255,255,0.10)";

/* ─── Reveal animation ─── */
function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
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
      <div className="text-[36px] md:text-[44px] font-semibold tracking-tight text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-[12px] text-white/40 mt-1 uppercase tracking-[0.08em]">{label}</div>
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
      color: emerald,
      colorMuted: emeraldMuted,
      desc: "Hotel-facing workspace. AI forecasting, multi-gateway checkout, ETA compliance, reverse factoring requests, and budget control — all in one dashboard.",
      features: [
        "AI-powered spend forecasting and budget alerts",
        "Multi-gateway checkout (cards, SWIFT, local banks)",
        "Reverse factoring requests with automated authorisation",
        "ETA & FRA compliance engine built-in",
        "Swarm agents handle documentation at every workflow stage",
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
      desc: "Supplier-facing marketplace. Aggregated catalogs via API, AI-powered vendor discovery, 24-hour onboarding, real-time inventory sync across 6 governorates.",
      features: [
        "Plug-and-play integration with existing supplier marketplaces",
        "AI chatbot helps hotels find the right vendor instantly",
        "Vendor onboarding in under 24 hours",
        "Real-time catalog sync across all connected networks",
        "Automated pricing and availability updates",
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
      desc: "Financial layer. Reverse factoring with competitive bidding, 48-hour supplier payout, bank-direct settlement, FRA anti-fraud compliance, and cryptographic audit trails.",
      features: [
        "Reverse factoring with multi-funder competitive bidding",
        "48-hour supplier payout — bank-direct settlement",
        "FRA anti-fraud compliance with three-way matching",
        "SHA-256 cryptographic audit trails on every transaction",
        "Non-recourse factoring — zero liability for counterparty default",
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
          HERO
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${accentMuted} 0%, transparent 70%)` }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-medium uppercase tracking-[0.12em] mb-10"
            style={{ border: `1px solid ${accentBorder}`, background: accentMuted, color: accent }}
          >
            <Sparkles size={12} />
            Egypt & MENA&apos;s First · AI-Native B2B Hotel Procurement Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[40px] sm:text-[56px] md:text-[72px] font-semibold leading-[1.05] tracking-tight text-white mb-6"
          >
            Egypt&apos;s Hospitality
            <br />
            Procurement Infrastructure
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[16px] md:text-[18px] text-white/50 max-w-2xl mx-auto mb-4 leading-relaxed"
          >
            AI-powered procurement, supplier marketplace, and embedded financial infrastructure — built for coastal hotels and their supply chain across Egypt.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-[13px] text-white/30 max-w-xl mx-auto mb-10"
          >
            Free to join. Transparent fees only when value is exchanged. No credit card required.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <button onClick={() => setWizardOpen(true)} className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-semibold rounded-xl transition-all hover:opacity-90 hover:shadow-lg cursor-pointer" style={{ background: accent, color: "#0B0F1A" }}>
              Get Started Free
              <ArrowRight size={16} />
            </button>
            <Link href="/sandbox" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-medium rounded-xl border transition-all hover:bg-white/[0.04]" style={{ borderColor: borderVisible, color: "rgba(255,255,255,0.6)" }}>
              <Play size={15} />
              Explore Sandbox
            </Link>
          </motion.div>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-3 mt-10"
          >
            {[
              "ETA E-Invoicing",
              "FRA Compliant",
              "Bank-Grade Security",
              "Free to Start",
            ].map((label) => (
              <span key={label} className="px-3 py-1 rounded-full text-[11px] font-medium text-white/40" style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>
                {label}
              </span>
            ))}
          </motion.div>

          {/* Scroll */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="mt-16 flex justify-center">
            <a href="#layers" className="flex flex-col items-center gap-2 text-white/20 hover:text-white/40 transition-colors">
              <span className="text-[10px] tracking-[0.15em] uppercase">Explore the Platform</span>
              <ChevronDown size={16} className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARKET TICKER
          ═══════════════════════════════════════════════════════════ */}
      <MarketTicker />

      {/* ═══════════════════════════════════════════════════════════
          STATS — Single clean row
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 border-y" style={{ borderColor: borderSubtle }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-6">
            <Stat end={680} suffix="+" label="Verified Suppliers" />
            <Stat end={94} suffix="%" label="Forecast Accuracy" />
            <Stat end={48} suffix="h" label="Supplier Settlement" />
            <Stat end={40} suffix="%" label="Logistics Cost Reduction" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THREE-LAYER ARCHITECTURE — The core section
          ═══════════════════════════════════════════════════════════ */}
      <section id="layers" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section header */}
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: accent }}>
                Three-Layer Architecture
              </span>
              <h2 className="text-[32px] md:text-[44px] font-semibold tracking-tight text-white mb-4">
                Built for Every Stakeholder
              </h2>
              <p className="text-[15px] text-white/40 max-w-xl mx-auto leading-relaxed">
                Each layer serves a distinct role — connected by AI agents, shared settlement, and cryptographic compliance. Together, they form Egypt&apos;s hospitality procurement infrastructure.
              </p>
            </div>
          </Reveal>

          {/* Layer cards — 3-up grid, clean */}
          <Reveal>
            <div className="grid md:grid-cols-3 gap-4 mb-16">
              {layers.map((layer, i) => {
                const Icon = layer.icon;
                const isActive = activeLayer === i;
                return (
                  <button
                    key={layer.key}
                    onClick={() => setActiveLayer(i as 0 | 1 | 2)}
                    className="text-left rounded-2xl p-6 transition-all cursor-pointer"
                    style={{
                      background: isActive ? surface2 : surface1,
                      border: `1px solid ${isActive ? "rgba(255,255,255,0.12)" : borderSubtle}`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                        <Icon size={20} className="text-white/60" />
                      </div>
                      <div>
                        <h3 className="text-[15px] font-semibold text-white">{layer.title}</h3>
                        <p className="text-[11px] font-medium text-white/30">{layer.tagline}</p>
                      </div>
                    </div>
                    <p className="text-[13px] text-white/40 leading-relaxed mb-4">{layer.desc}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(i === 0 ? ["AI Forecasting", "ETA Compliance", "Factoring"] :
                        i === 1 ? ["680+ Suppliers", "24h Onboarding", "API Sync"] :
                        ["48h Payout", "Multi-Funder", "FRA Compliant"]
                      ).map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded text-[10px] font-medium text-white/30" style={{ background: "rgba(255,255,255,0.04)" }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Active layer detail — side by side */}
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
                <div className="flex items-center gap-2 mb-5">
                  <active.icon size={20} style={{ color: active.color }} />
                  <span className="text-[12px] font-medium uppercase tracking-[0.1em]" style={{ color: active.color }}>
                    {active.title} · {active.tagline}
                  </span>
                </div>
                <h3 className="text-[24px] md:text-[30px] font-semibold text-white mb-4 leading-tight">
                  {activeLayer === 0 ? "The Checkout & Payments Brain" :
                   activeLayer === 1 ? "The B2B Procurement Marketplace" :
                   "The Financial Infrastructure Layer"}
                </h3>
                <p className="text-[14px] text-white/45 leading-relaxed mb-8">{active.desc}</p>
                <ul className="space-y-3 mb-8">
                  {active.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/60">
                      <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: active.color }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={active.cta.href} className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:opacity-90" style={{ background: active.color, color: activeLayer === 1 ? "#0B0F1A" : "#ffffff" }}>
                  {active.cta.label} <ArrowRight size={14} />
                </Link>
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${borderVisible}` }}>
                <active.dashboard />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Divider */}
      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS — 4 steps, clean horizontal
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: emerald }}>
                How It Works
              </span>
              <h2 className="text-[32px] md:text-[44px] font-semibold tracking-tight text-white mb-4">
                From Forecast to Settlement
              </h2>
              <p className="text-[15px] text-white/40 max-w-lg mx-auto">
                No subscription. No setup cost. AI agents guide you from registration to your first compliant transaction.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "01", title: "Join Free", desc: "Register in minutes. AI-guided onboarding, no paperwork, no credit card.", icon: Building2 },
              { step: "02", title: "Discover & Order", desc: "Browse 680+ verified suppliers on INVO. AI-powered matching and real-time catalogs.", icon: Store },
              { step: "03", title: "Checkout & Pay", desc: "Multi-gateway payments, ETA-compliant invoicing, AI spend forecasting.", icon: BrainCircuit },
              { step: "04", title: "Settle in 48h", desc: "Suppliers request reverse factoring. Competitive bidding. Bank-direct disbursement.", icon: Banknote },
            ].map((item, i) => (
              <Reveal key={item.step} delay={i * 0.1}>
                <div className="rounded-2xl p-6 h-full" style={{ background: surface1, border: `1px solid ${borderSubtle}` }}>
                  <div className="text-[11px] font-medium text-white/20 mb-3 uppercase tracking-wider">Step {item.step}</div>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                    <item.icon size={18} className="text-white/40" />
                  </div>
                  <h3 className="text-[15px] font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-[12px] text-white/35 leading-relaxed">{item.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════════════════════
          PLATFORM CAPABILITIES — 6 pillars, bento-style
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ background: "#080B14" }}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: emerald }}>
                Platform Capabilities
              </span>
              <h2 className="text-[32px] md:text-[44px] font-semibold tracking-tight text-white mb-4">
                Six Infrastructure Pillars
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: BrainCircuit, title: "AI Demand Forecasting", desc: "14-day forward predictions analyzing occupancy curves, booked events, and historical consumption patterns.", color: emerald },
              { icon: Receipt, title: "ETA E-Invoicing V2", desc: "Native Egyptian Tax Authority API pipeline. RSA 2048-bit digital signing with cryptographic UUID validation.", color: emerald },
              { icon: Truck, title: "Shared-Route Logistics", desc: "AI-driven route consolidation across 6 governorates. Up to 40% cost reduction via intelligent multi-supplier load matching.", color: emerald },
              { icon: Banknote, title: "Embedded Reverse Factoring", desc: "Competitive bidding among 4+ licensed grantors. Non-recourse, bank-direct settlement. Suppliers paid in 48 hours.", color: emerald },
              { icon: ShieldCheck, title: "FRA Anti-Fraud Compliance", desc: "Mandatory three-way matching: PO + ETA UUID + Signed Digital Delivery Note. SHA-256 cryptographic audit trail.", color: emerald },
              { icon: BarChart3, title: "Cost Control Engine", desc: "Real-time spend analysis, anomaly detection, and budget optimization across every property, department, and vendor.", color: emerald },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.title} delay={i * 0.06}>
                  <div className="rounded-2xl p-6 h-full transition-all hover:-translate-y-1" style={{ background: surface1, border: `1px solid ${borderSubtle}` }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: emeraldMuted }}>
                      <Icon size={20} style={{ color: emerald }} />
                    </div>
                    <h3 className="text-[14px] font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-[12px] text-white/35 leading-relaxed">{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Divider */}
      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════════════════════
          TRUST & SECURITY — Consolidated, not scattered
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: accent }}>
                Security & Compliance
              </span>
              <h2 className="text-[32px] md:text-[44px] font-semibold tracking-tight text-white mb-4">
                Bank-Grade Security
              </h2>
              <p className="text-[15px] text-white/40 max-w-xl mx-auto">
                Every transaction, every invoice, every data point — protected by cryptographic standards trusted by Egypt&apos;s financial institutions.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {[
              { icon: Shield, title: "ETA Phase 1 & 2 Compliant", desc: "Full integration with Egyptian Tax Authority e-invoicing pipeline. RSA 2048-bit digital signing, UUID validation.", color: emerald },
              { icon: ShieldCheck, title: "FRA Anti-Fraud Framework", desc: "Three-way matching (PO + UUID + Delivery Note), SHA-256 audit trails, real-time fraud detection.", color: accent },
              { icon: Zap, title: "AES-256-GCM Encryption", desc: "All data at rest encrypted. Keys rotated every 90 days. TLS 1.3 in transit.", color: "#3B82F6" },
              { icon: CheckCircle, title: "ISO 27001 Aligned", desc: "Information security management aligned with ISO 27001. Regular third-party audits.", color: "#A855F7" },
              { icon: Clock, title: "Data Residency — Egypt", desc: "All tenant data hosted on servers within Egypt. No data leaves Egyptian jurisdiction.", color: emerald },
              { icon: Banknote, title: "Tenant Data Isolation", desc: "Each hotel/supplier/funder in fully isolated data scope. Cross-tenant access is architecturally impossible.", color: accent },
            ].map((cert, i) => {
              const Icon = cert.icon;
              return (
                <Reveal key={cert.title} delay={i * 0.06}>
                  <div className="rounded-2xl p-6 h-full" style={{ background: surface1, border: `1px solid ${borderSubtle}` }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: cert.color + "15" }}>
                        <Icon size={18} style={{ color: cert.color }} />
                      </div>
                      <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ background: cert.color + "15", color: cert.color }}>Active</span>
                    </div>
                    <h3 className="text-[13px] font-semibold text-white/80 mb-2">{cert.title}</h3>
                    <p className="text-[12px] text-white/40 leading-relaxed">{cert.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Legal disclaimer */}
          <Reveal>
            <div className="rounded-xl p-5 text-center" style={{ background: accentMuted, border: `1px solid ${accentBorder}` }}>
              <p className="text-[12px] text-white/50 leading-relaxed">
                <strong style={{ color: accent }}>Restaurants for E-Marketing</strong> operates as a{" "}
                <strong className="text-white/60">technical data orchestrator</strong> — not a bank, not a payment service provider, not a factoring company.
                All financial flows are processed through licensed institutions. Zero liability for counterparty collection defaults.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Divider */}
      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════════════════════
          CTA — Single focused conversion section
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${accentMuted} 0%, transparent 70%)` }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <Reveal>
            <h2 className="text-[32px] md:text-[44px] font-semibold tracking-tight text-white mb-5">
              Stop Managing Procurement
              <br />
              in Spreadsheets
            </h2>
            <p className="text-[15px] text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
              AI-automated procurement. Cashflow optimization. Cryptographic ETA compliance. All in one platform — free to start.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={() => setWizardOpen(true)} className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-semibold rounded-xl transition-all hover:opacity-90 cursor-pointer" style={{ background: accent, color: "#0B0F1A" }}>
                Get Started Free <ArrowRight size={16} />
              </button>
              <Link href="/sandbox" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-medium rounded-xl border transition-all hover:bg-white/[0.04]" style={{ borderColor: borderVisible, color: "rgba(255,255,255,0.6)" }}>
                <Sparkles size={14} /> Explore Sandbox
              </Link>
            </div>
            <p className="text-[11px] text-white/25 mt-6">No credit card required · Free to start · Dedicated onboarding</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 border-t" style={{ borderColor: borderSubtle, background: "#060810" }}>
        <div className="max-w-4xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block" style={{ color: accent }}>
                FAQ
              </span>
              <h2 className="text-[32px] md:text-[44px] font-semibold tracking-tight text-white mb-4">
                Frequently Asked Questions
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
