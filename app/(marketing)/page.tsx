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
  Sparkles,
  ArrowDown,
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
   DESIGN SYSTEM — HotelsVendors Landing Page v3
   ═══════════════════════════════════════════════════════════════ */

const ACCENT = "#FF6B00";
const ACCENT_MUTED = "rgba(255,107,0,0.08)";
const ACCENT_BORDER = "rgba(255,107,0,0.25)";
const ACCENT_GLOW = "rgba(255,107,0,0.15)";
const SURFACE = "#080B12";
const SURFACE_CARD = "#0C1018";
const BORDER = "rgba(255,255,255,0.06)";
const BORDER_HOVER = "rgba(255,255,255,0.12)";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
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

function Stat({ end, suffix = "", prefix = "", label, accent = false }: { end: number; suffix?: string; prefix?: string; label: string; accent?: boolean }) {
  const ref = useRef(null);
  const active = useInView(ref, { once: true });
  const count = useCounter(end, 2200, active);
  return (
    <div ref={ref} className="text-center px-4">
      <div
        className={`text-[32px] md:text-[44px] lg:text-[52px] font-bold tracking-tight ${accent ? "text-white" : "text-white"}`}
        style={{ fontVariantNumeric: "tabular-nums", fontFamily: "'Playfair Display', Georgia, serif" }}
      >
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-[11px] md:text-[12px] mt-2 uppercase tracking-[0.15em] font-medium" style={{ color: accent ? ACCENT : "rgba(255,255,255,0.3)" }}>
        {label}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [wizardOpen, setWizardOpen] = useState(false);

  return (
    <div className="min-h-screen text-white" style={{ backgroundColor: "#000000" }}>
      <MarketingNav />

      {/* ═══════════════════════════════════════════════════════════
          HERO — Full-viewport immersive
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden" style={{ backgroundColor: "#000000" }}>
        {/* Layered ambient glow */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(ellipse, ${ACCENT_GLOW} 0%, transparent 70%)`, opacity: 0.5 }} />
        <div className="absolute top-[100px] right-[-200px] w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-[92px] md:pt-[110px] pb-20 md:pb-28">
          {/* Brand logo — large, centered */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center mb-12 md:mb-16"
          >
            <BrandLogo variant="dark" size="xl" />
          </motion.div>

          {/* Hero content + dashboard side by side */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
            {/* Left: Marketing content (5 cols) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-5 lg:sticky lg:top-28"
            >
              {/* Eyebrow */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ backgroundColor: ACCENT_MUTED, border: `1px solid ${ACCENT_BORDER}` }}
              >
                <Sparkles size={12} style={{ color: ACCENT }} />
                <span className="text-[11px] font-semibold tracking-wide" style={{ color: ACCENT }}>AI-POWERED PROCUREMENT FOR EGYPTIAN HOSPITALITY</span>
              </motion.div>

              <h1
                className="text-[36px] md:text-[48px] lg:text-[56px] font-normal text-white mb-6 leading-[1.08] tracking-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Procurement
                <br />
                That Pays for
                <br />
                <span style={{ color: ACCENT }}>Itself</span>
              </h1>

              <p className="text-[15px] md:text-[17px] text-white/45 max-w-lg mb-10 leading-[1.7]">
                From Sharm El-Sheikh to Hurghada — coastal resorts use HotelsVendors to cut procurement costs 15–25%, settle suppliers in 48 hours, and automate ETA e-invoicing compliance.
              </p>

              {/* CTAs — large, prominent */}
              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <button
                  onClick={() => setWizardOpen(true)}
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4.5 text-[15px] font-bold rounded-2xl transition-all duration-200 hover:scale-[1.03] hover:shadow-lg cursor-pointer"
                  style={{ background: ACCENT, color: "#ffffff", boxShadow: `0 8px 32px ${ACCENT_GLOW}` }}
                >
                  Get Started Free
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
                </button>
                <Link
                  href="/sandbox"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4.5 text-[14px] font-medium rounded-2xl border transition-all duration-200 hover:bg-white/[0.04]"
                  style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
                >
                  <Play size={15} />
                  Explore Sandbox
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap items-center gap-5 text-[12px] text-white/30">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} style={{ color: ACCENT }} />
                  No credit card to start
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} style={{ color: ACCENT }} />
                  ETA e-invoicing included
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 size={13} style={{ color: ACCENT }} />
                  6 governorates covered
                </span>
              </div>
            </motion.div>

            {/* Right: Dashboard mockup (7 cols — dominant visual) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="lg:col-span-7"
            >
              <div
                className="relative rounded-3xl p-3"
                style={{
                  background: "linear-gradient(165deg, #1a1a1a 0%, #0a0a0a 100%)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  boxShadow: "0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)",
                }}
              >
                {/* Top edge highlight */}
                <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
                  <HotelDashboardMockup />
                </div>
              </div>
              {/* Glow under dashboard */}
              <div
                className="absolute -bottom-8 left-1/4 right-1/4 h-16 rounded-full blur-3xl opacity-25"
                style={{ background: ACCENT }}
              />
            </motion.div>
          </div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-16 flex justify-center"
          >
            <a href="#stats" className="flex flex-col items-center gap-1.5 text-white/15 hover:text-white/30 transition-colors">
              <span className="text-[9px] tracking-[0.2em] uppercase font-medium">Discover</span>
              <ArrowDown size={14} className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MARKET TICKER
          ═══════════════════════════════════════════════════════════ */}
      <MarketTicker />

      {/* ═══════════════════════════════════════════════════════════
          STATS — Full-width, bold numbers
          ═══════════════════════════════════════════════════════════ */}
      <section id="stats" className="py-20 md:py-24" style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-6xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: ACCENT }}>
                By the Numbers
              </span>
              <h2 className="text-[24px] md:text-[32px] font-medium tracking-tight text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                What We&apos;re Building Toward
              </h2>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
            <Stat end={680} suffix="+" label="Verified Suppliers" />
            <Stat end={94} suffix="%" label="Forecast Accuracy" accent />
            <Stat end={48} suffix="h" label="Supplier Settlement" />
            <Stat end={40} suffix="%" label="Cost Reduction" />
          </div>
          <p className="text-center text-[10px] text-white/20 mt-8 tracking-wide">
            Targets based on pilot program projections · Updated quarterly
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          THREE STAKEHOLDERS — Tabbed showcase
          ═══════════════════════════════════════════════════════════ */}
      <ThreeStakeholderSection wizardOpen={setWizardOpen} />

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS — 4 steps
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ backgroundColor: SURFACE }}>
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: ACCENT }}>
                How It Works
              </span>
              <h2 className="text-[24px] md:text-[32px] font-medium tracking-tight text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Live in 24 Hours
              </h2>
              <p className="text-[14px] text-white/35 max-w-md mx-auto">
                From registration to your first AI-optimized order in under a day.
              </p>
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
                  <div
                    className="rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1 group"
                    style={{ backgroundColor: SURFACE_CARD, border: `1px solid ${BORDER}` }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = BORDER_HOVER; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; }}
                  >
                    <div className="text-[10px] font-bold mb-4 uppercase tracking-wider" style={{ color: ACCENT }}>Step {item.step}</div>
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                      style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${BORDER}` }}
                    >
                      <StepIcon size={18} className="text-white/40 group-hover:text-white/60 transition-colors" />
                    </div>
                    <h3 className="text-[15px] font-semibold text-white mb-2">{item.title}</h3>
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
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: ACCENT }}>
                Platform Capabilities
              </span>
              <h2 className="text-[24px] md:text-[32px] font-medium tracking-tight text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Built for Hospitality.
                <br />
                Compliant by Default.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                <Reveal key={f.title} delay={i * 0.08}>
                  <div
                    className="rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1 group"
                    style={{ backgroundColor: SURFACE_CARD, border: `1px solid ${BORDER}` }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = BORDER_HOVER; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = BORDER; }}
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                      style={{ backgroundColor: ACCENT_MUTED, border: `1px solid ${ACCENT_BORDER}` }}
                    >
                      <Icon size={18} style={{ color: ACCENT }} />
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

      {/* ═══════════════════════════════════════════════════════════
          PRICING — Transparent, simple
          ═══════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 md:py-32" style={{ backgroundColor: SURFACE }}>
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: ACCENT }}>
                Pricing
              </span>
              <h2 className="text-[24px] md:text-[32px] font-medium tracking-tight text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Free to Start. Pay Only When You Transact.
              </h2>
              <p className="text-[14px] text-white/35 max-w-md mx-auto">
                No subscriptions. No setup fees. No credit card to join.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                role: "Hotels",
                price: "Free",
                priceNote: "to join & use",
                desc: "Full procurement dashboard, AI forecasting, 680+ suppliers, and ETA compliance — all free.",
                items: [
                  "0% subscription fee",
                  "1% on bank transfer payments",
                  "Free ETA e-invoicing",
                  "Free AI demand forecasting",
                ],
                accent: true,
              },
              {
                role: "Suppliers",
                price: "Free",
                priceNote: "to list",
                desc: "List your catalog, receive purchase orders, and get paid — no listing fees.",
                items: [
                  "0% listing fee",
                  "2-4% commission per order",
                  "Free INVO marketplace listing",
                  "48h settlement via factoring",
                ],
                accent: false,
              },
              {
                role: "Funders",
                price: "Free",
                priceNote: "to access pool",
                desc: "Access verified, ETA-compliant invoice pools. Only earn when you fund.",
                items: [
                  "0% access fee",
                  "Earn 12-18% APR on invoices",
                  "FRA-compliant three-way matching",
                  "Fully automated settlement",
                ],
                accent: false,
              },
            ].map((plan, i) => (
              <Reveal key={plan.role} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 h-full flex flex-col"
                  style={{
                    backgroundColor: plan.accent ? ACCENT_MUTED : SURFACE_CARD,
                    border: `1px solid ${plan.accent ? ACCENT_BORDER : BORDER}`,
                  }}
                >
                  <div className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3" style={{ color: plan.accent ? ACCENT : "rgba(255,255,255,0.3)" }}>
                    {plan.role}
                  </div>
                  <div className="mb-1">
                    <span className="text-[36px] font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{plan.price}</span>
                  </div>
                  <div className="text-[12px] text-white/30 mb-4">{plan.priceNote}</div>
                  <p className="text-[12px] text-white/40 leading-relaxed mb-6">{plan.desc}</p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[12px] text-white/55">
                        <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: plan.accent ? ACCENT : "rgba(255,255,255,0.3)" }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setWizardOpen(true)}
                    className="w-full py-3 text-[13px] font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer mt-auto"
                    style={{
                      background: plan.accent ? ACCENT : "rgba(255,255,255,0.06)",
                      color: plan.accent ? "#ffffff" : "rgba(255,255,255,0.7)",
                      border: `1px solid ${plan.accent ? ACCENT : BORDER}`,
                    }}
                  >
                    {plan.accent ? "Get Started Free" : `Register as ${plan.role.slice(0, -1)}`}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-center text-[10px] text-white/20 mt-8">
              All prices exclude applicable taxes · Enterprise pricing available for 10+ property groups
            </p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          SOCIAL PROOF — Testimonial + Trust bar
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ borderTop: `1px solid ${BORDER}`, borderBottom: `1px solid ${BORDER}` }}>
        <div className="max-w-5xl mx-auto px-6">
          <Reveal>
            <div className="max-w-2xl mx-auto text-center mb-14">
              <div className="text-[40px] leading-none mb-4" style={{ color: ACCENT, fontFamily: "'Playfair Display', Georgia, serif" }}>&ldquo;</div>
              <p className="text-[16px] md:text-[18px] text-white/60 leading-relaxed mb-6 italic" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                We went from 60-day supplier payments to 48 hours — without changing our own cash flow. The reverse factoring alone paid for the platform in the first quarter.
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ backgroundColor: ACCENT, color: "#fff" }}>MH</div>
                <div className="text-left">
                  <p className="text-[12px] font-medium text-white/70">Mohamed Hassan</p>
                  <p className="text-[10px] text-white/30">Group Procurement Director · Red Sea Resort Chain</p>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal>
            <div className="text-center mb-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/25">
                Trusted by Leading Hotel Groups
              </span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14">
              {["Stella Di Mare", "Sunrise Resorts", "Jaz Hotels", "Baron Hotels", "Al Gouna", "Steigenberger"].map((name) => (
                <span key={name} className="text-[15px] font-semibold tracking-wide transition-opacity hover:opacity-60" style={{ color: "rgba(255,255,255,0.35)" }}>{name}</span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          MID-PAGE CTA — Conversion break
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center bottom, ${ACCENT_GLOW} 0%, transparent 60%)` }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative">
          <Reveal>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{ backgroundColor: ACCENT_MUTED, border: `1px solid ${ACCENT_BORDER}` }}
            >
              <Zap size={13} style={{ color: ACCENT }} />
              <span className="text-[12px] font-semibold" style={{ color: ACCENT }}>Start Saving Today</span>
            </div>
            <h2 className="text-[28px] md:text-[40px] font-medium tracking-tight text-white mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Your Supply Chain Is
              <br />
              Leaking Money
            </h2>
            <p className="text-[15px] text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
              Every manual PO, every late invoice, every untracked delivery — it adds up. HotelsVendors gives your hotel 360-degree control: AI-optimized ordering, ETA-compliant invoicing, and 48h supplier settlement.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setWizardOpen(true)}
                className="group inline-flex items-center justify-center gap-2.5 px-10 py-4.5 text-[15px] font-bold rounded-2xl transition-all duration-200 hover:scale-[1.03] cursor-pointer"
                style={{ background: ACCENT, color: "#ffffff", boxShadow: `0 8px 32px ${ACCENT_GLOW}` }}
              >
                Get Started Free
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-0.5" />
              </button>
              <Link
                href="/sandbox"
                className="inline-flex items-center justify-center gap-2 px-8 py-4.5 text-[14px] font-medium rounded-2xl border transition-all duration-200 hover:bg-white/[0.04]"
                style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
              >
                <Play size={15} /> Explore Sandbox
              </Link>
            </div>
            <p className="text-[11px] text-white/20 mt-8">No credit card required · Free forever for hotels · Dedicated onboarding</p>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32" style={{ borderTop: `1px solid ${BORDER}`, backgroundColor: SURFACE }}>
        <div className="max-w-3xl mx-auto px-6">
          <Reveal>
            <div className="text-center mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: ACCENT }}>
                FAQ
              </span>
              <h2 className="text-[24px] md:text-[32px] font-medium tracking-tight text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                Questions? Answered.
              </h2>
            </div>
          </Reveal>
          <FAQSection />
        </div>
      </section>

      <MarketingFooter />

      <RegistrationWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
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
    <section className="py-24 md:py-32" style={{ backgroundColor: SURFACE }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: ACCENT }}>
              Three Stakeholders, One Platform
            </span>
            <h2 className="text-[24px] md:text-[32px] font-medium tracking-tight text-white mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
              Hotels Buy. Suppliers Sell.
              <br />
              Funders Finance.
            </h2>
          </div>
        </Reveal>

        {/* Tab buttons */}
        <Reveal>
          <div className="flex justify-center gap-2 mb-12">
            {tabs.map((tab, i) => {
              const Icon = tab.icon;
              const isActive = activeTab === i;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(i)}
                  className="flex items-center gap-2.5 px-6 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer"
                  style={{
                    background: isActive ? ACCENT_MUTED : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isActive ? ACCENT_BORDER : BORDER}`,
                    color: isActive ? ACCENT : "rgba(255,255,255,0.4)",
                    boxShadow: isActive ? `0 4px 20px ${ACCENT_GLOW}` : "none",
                  }}
                >
                  <Icon size={15} />
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="flex items-center gap-2.5 mb-5">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: ACCENT_MUTED, border: `1px solid ${ACCENT_BORDER}` }}
                >
                  <active.icon size={18} style={{ color: ACCENT }} />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] block" style={{ color: ACCENT }}>
                    {active.title}
                  </span>
                  <span className="text-[10px] text-white/25">{active.subtitle}</span>
                </div>
              </div>
              <h3 className="text-[20px] md:text-[26px] font-semibold text-white mb-5 leading-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                {active.key === "hotel" ? "Stop Guessing What to Order" :
                 active.key === "supplier" ? "Sell to 500+ Hotels in One Click" :
                 "Finance Hotel Receivables at Scale"}
              </h3>
              <p className="text-[14px] text-white/45 leading-relaxed mb-8">{active.desc}</p>
              <ul className="space-y-3.5 mb-10">
                {active.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[13px] text-white/55">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => wizardOpen(true)}
                className="group inline-flex items-center gap-2.5 px-7 py-3.5 text-[14px] font-bold rounded-xl transition-all duration-200 hover:scale-[1.03] cursor-pointer"
                style={{ background: ACCENT, color: "#ffffff", boxShadow: `0 6px 24px ${ACCENT_GLOW}` }}
              >
                {active.cta}
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${BORDER}`, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
              <active.dashboard />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
