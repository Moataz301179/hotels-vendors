"use client";

import { useRef, useState, Suspense, lazy } from "react";
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
  Play,
  Landmark,
  Sparkles,
  ArrowDown,
  Mail,
  Lock,
  FileCheck,
  Server,
  Eye,
  Fingerprint,
} from "lucide-react";
import Link from "next/link";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketTicker } from "@/components/marketing/market-ticker";
import { HotelDashboardMockup } from "@/components/marketing/hotel-dashboard-mockup";
import { SupplierDashboardMockup } from "@/components/marketing/supplier-dashboard-mockup";
import { FunderDashboardMockup } from "@/components/marketing/funder-dashboard-mockup";
import { LogisticsDashboardMockup } from "@/components/marketing/logistics-dashboard-mockup";
import { RegistrationWizard } from "@/components/auth/registration-wizard";
import { BrandLogo } from "@/components/layout/brand-logo";
import { EnterpriseTrustBanner } from "@/components/marketing/enterprise-trust-banner";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { ProblemSolutionSplit } from "@/components/marketing/problem-solution-split";
import { FeatureBentoGrid } from "@/components/marketing/feature-bento-grid";
import { VendorNetwork } from "@/components/marketing/vendor-network";
import { SmartSourcingGrid } from "@/components/marketing/smart-sourcing-grid";
import { RFQEngine } from "@/components/marketing/rfq-engine";
import { InvoicingPortal } from "@/components/marketing/invoicing-portal";
import { PaymentGateway } from "@/components/marketing/payment-gateway";
import { AuthorityValidation } from "@/components/marketing/authority-validation";
import { AnalyticsDashboard } from "@/components/marketing/analytics-dashboard";
import { LifecycleVisualizer } from "@/components/marketing/lifecycle-visualizer";
import { GovernanceAudit } from "@/components/marketing/governance-audit";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════ */
const A = "#FF6B00";
const AM = "rgba(255,107,0,0.08)";
const AB = "rgba(255,107,0,0.25)";
const AG = "rgba(255,107,0,0.15)";
const S1 = "var(--bg-canvas)";
const SC = "var(--bg-surface-raised)";
const B1 = "rgba(255,255,255,0.06)";
const BH = "rgba(255,255,255,0.12)";

/* ═══════════════════════════════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════════════════════════════ */
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
      {children}
    </span>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
      style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
    >
      {children}
    </h2>
  );
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
      {children}
    </p>
  );
}

function CTAButton({ onClick, primary = false, children }: { onClick: () => void; primary?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[14px] font-bold rounded-2xl transition-all duration-200 hover:scale-[1.03] cursor-pointer"
      style={{
        background: primary ? A : "rgba(255,255,255,0.06)",
        color: primary ? "#ffffff" : "rgba(255,255,255,0.7)",
        border: `1px solid ${primary ? A : B1}`,
        boxShadow: primary ? `0 8px 32px ${AG}` : "none",
      }}
    >
      {children}
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════════
   SANDBOX DASHBOARD PANEL (Hero Interactive Preview)
   ═══════════════════════════════════════════════════════════ */
function SandboxDashboardPanel({ onCTAClick }: { onCTAClick: () => void }) {
  const [activeRole, setActiveRole] = useState<"hotel" | "supplier" | "funder" | "logistics">("hotel");

  const roles = [
    { key: "hotel" as const, label: "Hotel", icon: Building2 },
    { key: "supplier" as const, label: "Supplier", icon: Store },
    { key: "funder" as const, label: "Funder", icon: Landmark },
    { key: "logistics" as const, label: "Logistics", icon: Truck },
  ];

  return (
    <div
      className="relative rounded-3xl p-3"
      style={{
        background: "linear-gradient(165deg, #0B0F17 0%, #0B0F17 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 50px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)",
      }}
    >
      <div className="absolute top-0 left-12 right-12 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Role switcher tabs */}
      <div className="flex gap-1 p-2 mb-3 rounded-xl" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole === role.key;
          return (
            <button
              key={role.key}
              onClick={() => setActiveRole(role.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
              style={{
                backgroundColor: isActive ? "rgba(255,107,0,0.08)" : "transparent",
                color: isActive ? "#FF6B00" : "rgba(255,255,255,0.35)",
                border: isActive ? "1px solid rgba(255,107,0,0.2)" : "1px solid transparent",
              }}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{role.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dashboard preview area */}
      <div className="rounded-2xl overflow-hidden relative" style={{ border: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300" style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}>
          <button
            onClick={onCTAClick}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-bold transition-all hover:scale-105 cursor-pointer"
            style={{ background: A, color: "#fff", boxShadow: `0 8px 32px ${AG}` }}
          >
            <Play size={14} />
            Open Interactive Sandbox
          </button>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {activeRole === "hotel" && <HotelDashboardMockup />}
            {activeRole === "supplier" && <SupplierDashboardMockup />}
            {activeRole === "funder" && <FunderDashboardMockup />}
            {activeRole === "logistics" && <LogisticsDashboardMockup />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA bar */}
      <div className="mt-3 flex items-center justify-between px-3 py-2">
        <span className="text-[10px] text-white/20">Live preview — click to explore</span>
        <Link
          href="/sandbox"
          className="flex items-center gap-1.5 text-[11px] font-medium transition-colors"
          style={{ color: A }}
        >
          Full Sandbox
          <ArrowRight size={11} />
        </Link>
      </div>

      <div
        className="absolute -bottom-8 left-1/4 right-1/4 h-16 rounded-full blur-3xl opacity-25"
        style={{ background: A }}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. HERO SECTION
   ═══════════════════════════════════════════════════════════ */
function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="marketing-section relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="marketing-ambient absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none"
        style={{ opacity: 0.5 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-[92px] md:pt-[110px] pb-20 md:pb-28">
        {/* Brand logo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12 md:mb-16"
        >
          <BrandLogo variant="dark" size="xl" />
        </motion.div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          {/* Left: Marketing content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ backgroundColor: AM, border: `1px solid ${AB}` }}
            >
              <Sparkles size={12} style={{ color: A }} />
              <span className="text-[11px] font-semibold tracking-wide" style={{ color: A }}>
                EGYPT&apos;S #1 HOSPITALITY PROCUREMENT PLATFORM
              </span>
            </div>

            <h1
              className="text-[36px] md:text-[48px] lg:text-[56px] font-normal text-white mb-6 leading-[1.08] tracking-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Procurement
              <br />
              That Pays for
              <br />
              <span style={{ color: A }}>Itself</span>
            </h1>

            <p className="text-[15px] md:text-[17px] text-white/45 max-w-lg mb-8 leading-[1.7]">
              Egypt&apos;s coastal resorts use HotelsVendors to cut procurement costs 15–25%, settle suppliers in 48 hours via reverse factoring, and automate ETA e-invoicing — all from one platform.
            </p>

            {/* Email capture */}
            {!submitted ? (
              <div className="flex flex-col sm:flex-row gap-2 mb-6 max-w-md">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[13px] text-white placeholder:text-white/20 outline-none transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${B1}` }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = AB; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = B1; }}
                  />
                </div>
                <button
                  onClick={() => { if (email.includes("@")) { setSubmitted(true); onCTAClick(); } }}
                  className="px-6 py-3.5 text-[13px] font-bold rounded-xl transition-all duration-200 hover:scale-[1.03] cursor-pointer shrink-0"
                  style={{ background: A, color: "#ffffff", boxShadow: `0 6px 24px ${AG}` }}
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 mb-6 px-4 py-3 rounded-xl max-w-md"
                style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <CheckCircle2 size={16} style={{ color: "#22C55E" }} />
                <span className="text-[13px] text-white/60">You&apos;re on the list. We&apos;ll be in touch shortly.</span>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-5 text-[12px] text-white/30">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} style={{ color: A }} />
                No credit card
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} style={{ color: A }} />
                Live in 24 hours
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} style={{ color: A }} />
                680+ suppliers
              </span>
            </div>
          </motion.div>

          {/* Right: Interactive Sandbox Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="lg:col-span-7"
          >
            <SandboxDashboardPanel onCTAClick={onCTAClick} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mt-16 flex justify-center">
          <a href="#stats" className="flex flex-col items-center gap-1.5 text-white/15 hover:text-white/30 transition-colors">
            <span className="text-[9px] tracking-[0.2em] uppercase font-medium">Discover</span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. VALUE SPLIT · Hotels vs Suppliers vs Funders
   ═══════════════════════════════════════════════════════════ */
function ValueSplitSection({ onCTAClick }: { onCTAClick: () => void }) {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    {
      key: "hotel",
      icon: Building2,
      title: "For Hotels",
      headline: "Stop Guessing What to Order",
      desc: "AI predicts what you need before you run out. Automates purchase orders. Keeps every invoice ETA-compliant. Your team stops chasing paperwork and starts saving money.",
      features: [
        "AI demand forecasting with 94% accuracy across 14-day windows",
        "Multi-gateway payments: cards, SWIFT, local bank transfers",
        "One-click reverse factoring with automated approval flows",
        "ETA and FRA compliance engine with zero manual tax work",
      ],
      cta: "Register as Hotel",
      dashboard: HotelDashboardMockup,
    },
    {
      key: "supplier",
      icon: Store,
      title: "For Suppliers",
      headline: "Sell to 500+ Hotels in One Click",
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
      headline: "Finance Hotel Receivables at Scale",
      desc: "Suppliers get paid in 48 hours, not 60 days. Licensed funders compete to finance receivables at the best rate. The hotel keeps its original payment terms. Everyone wins.",
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
    <section className="py-24 md:py-32" style={{ backgroundColor: S1 }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>Three Stakeholders, One Platform</SectionLabel>
            <SectionHeading>
              Hotels Buy. Suppliers Sell.
              <br />
              Funders Finance.
            </SectionHeading>
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
                    background: isActive ? AM : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isActive ? AB : B1}`,
                    color: isActive ? A : "rgba(255,255,255,0.4)",
                    boxShadow: isActive ? `0 4px 20px ${AG}` : "none",
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
                  style={{ backgroundColor: AM, border: `1px solid ${AB}` }}
                >
                  <active.icon size={18} style={{ color: A }} />
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-[0.15em] block" style={{ color: A }}>
                    {active.title}
                  </span>
                </div>
              </div>
              <h3
                className="text-[22px] md:text-[28px] font-semibold text-white mb-5 leading-tight"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {active.headline}
              </h3>
              <p className="text-[14px] text-white/45 leading-relaxed mb-8">{active.desc}</p>
              <ul className="space-y-3.5 mb-10">
                {active.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[13px] text-white/55">
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0" style={{ color: A }} />
                    {f}
                  </li>
                ))}
              </ul>
              <CTAButton onClick={onCTAClick} primary>
                {active.cta}
              </CTAButton>
            </div>
            <div
              className="rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${B1}`, boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}
            >
              <active.dashboard />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. PROCUREMENT FLOW VISUALIZER
   ═══════════════════════════════════════════════════════════ */
function ProcurementFlowVisualizer() {
  const steps = [
    { num: "01", title: "Join Free", desc: "AI-guided registration in 5 minutes. No paperwork, no credit card.", icon: Building2 },
    { num: "02", title: "Discover & Order", desc: "Search 680+ verified suppliers. AI matches you to the best vendor.", icon: Store },
    { num: "03", title: "Checkout & Pay", desc: "Card, SWIFT, or bank transfer. Every invoice ETA-compliant.", icon: BrainCircuit },
    { num: "04", title: "Settle in 48h", desc: "Suppliers get paid early. You keep Net-30/60 terms. Everyone wins.", icon: Banknote },
  ];

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: S1 }}>
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>How It Works</SectionLabel>
            <SectionHeading>Live in 24 Hours</SectionHeading>
            <SectionSub>From registration to your first AI-optimized order in under a day.</SectionSub>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((item, i) => {
            const StepIcon = item.icon;
            return (
              <Reveal key={item.num} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 h-full transition-all duration-300 hover:-translate-y-1 group"
                  style={{ backgroundColor: SC, border: `1px solid ${B1}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = BH; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = B1; }}
                >
                  <div className="text-[10px] font-bold mb-4 uppercase tracking-wider" style={{ color: A }}>
                    Step {item.num}
                  </div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${B1}` }}
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
  );
}

/* ═══════════════════════════════════════════════════════════
   6. DUAL ONBOARDING · Hotels + Suppliers
   ═══════════════════════════════════════════════════════════ */
function DualOnboarding({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>Get Started</SectionLabel>
            <SectionHeading>Two Ways to Join</SectionHeading>
            <SectionSub>Whether you buy or sell, onboarding takes less than 24 hours.</SectionSub>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Hotel card */}
          <Reveal>
            <div
              className="rounded-2xl p-8 h-full flex flex-col relative overflow-hidden"
              style={{ backgroundColor: AM, border: `1px solid ${AB}` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10" style={{ background: A }} />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: "rgba(255,107,0,0.15)" }}
                >
                  <Building2 size={22} style={{ color: A }} />
                </div>
                <h3
                  className="text-[22px] font-semibold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  I&apos;m a Hotel
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed mb-6">
                  Get AI-powered procurement, 680+ verified suppliers, ETA-compliant invoicing, and 48-hour supplier settlement, all free to start.
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {[
                    "Free procurement dashboard",
                    "AI demand forecasting",
                    "680+ verified suppliers",
                    "ETA e-invoicing built-in",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[12px] text-white/55">
                      <CheckCircle2 size={13} style={{ color: A }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <CTAButton onClick={onCTAClick} primary>
                  Register as Hotel
                </CTAButton>
              </div>
            </div>
          </Reveal>

          {/* Supplier card */}
          <Reveal delay={0.1}>
            <div
              className="rounded-2xl p-8 h-full flex flex-col relative overflow-hidden"
              style={{ backgroundColor: SC, border: `1px solid ${B1}` }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-5" style={{ background: A }} />
              <div className="relative">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${B1}` }}
                >
                  <Store size={22} className="text-white/50" />
                </div>
                <h3
                  className="text-[22px] font-semibold text-white mb-3"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  I&apos;m a Supplier
                </h3>
                <p className="text-[13px] text-white/40 leading-relaxed mb-6">
                  List your catalog, receive purchase orders from 500+ hotels, and get paid in 48 hours via reverse factoring — no listing fees.
                </p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {[
                    "Free catalog listing",
                    "Access 500+ hotel buyers",
                    "48h settlement via factoring",
                    "Real-time order notifications",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-[12px] text-white/55">
                      <CheckCircle2 size={13} style={{ color: A }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <CTAButton onClick={onCTAClick}>
                  Register as Supplier
                </CTAButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   7. GOVERNANCE & SECURITY
   ═══════════════════════════════════════════════════════════ */
function GovernanceSecurity() {
  const certs = [
    { icon: ShieldCheck, title: "ETA Phase 1 & 2 Compliant", titleAr: "متوافق مع الفوترة الإلكترونية", desc: "Every invoice digitally signed, UUID-validated, submitted to Egyptian Tax Authority automatically.", color: "#22C55E" },
    { icon: Lock, title: "AES-256-GCM Encryption", titleAr: "تشفير AES-256-GCM", desc: "Bank-grade encryption at rest. TLS 1.3 in transit. Keys rotated every 90 days.", color: "#3B82F6" },
    { icon: FileCheck, title: "ISO 27001 Aligned", titleAr: "متوافق مع ISO 27001", desc: "Information security management aligned with ISO 27001. Regular third-party audits.", color: "#FF6B00" },
    { icon: Server, title: "Data Residency — Egypt", titleAr: "إقامة البيانات — مصر", desc: "All tenant data hosted on servers within Egypt. Data never leaves Egyptian jurisdiction.", color: "#8B5CF6" },
    { icon: Eye, title: "FRA Anti-Fraud Compliance", titleAr: "مكافحة الاحتيال — هيئة الرقابة المالية", desc: "Three-way matching: PO + ETA UUID + signed delivery note. SHA-256 audit trails.", color: "#EF4444" },
    { icon: Fingerprint, title: "Tenant Data Isolation", titleAr: "عزل بيانات المستأجرين", desc: "Each tenant operates in a fully isolated data scope. Cross-tenant access is architecturally impossible.", color: "#06B6D4" },
  ];

  return (
    <section className="py-24 md:py-32" style={{ backgroundColor: S1 }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>Security & Compliance · الأمان والامتثال</SectionLabel>
            <SectionHeading>Trusted by Banks. Built for Regulators.</SectionHeading>
            <SectionSub>
              AES-256 encryption. RSA 2048-bit digital signatures. Egyptian data residency. Every transaction is cryptographically auditable.
            </SectionSub>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map((cert, i) => {
            const Icon = cert.icon;
            return (
              <Reveal key={cert.title} delay={i * 0.06}>
                <div
                  className="rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 group"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${B1}` }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = BH; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = B1; }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: cert.color + "15" }}
                    >
                      <Icon size={20} style={{ color: cert.color }} />
                    </div>
                    <span
                      className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: cert.color + "15", color: cert.color }}
                    >
                      Active
                    </span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-white/80 mb-1">{cert.title}</h3>
                  <p className="text-[10px] text-white/30 mb-3" dir="rtl">{cert.titleAr}</p>
                  <p className="text-[12px] leading-relaxed text-white/50">{cert.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Liability disclaimer */}
        <Reveal>
          <div
            className="mt-10 rounded-xl p-5 text-center"
            style={{ backgroundColor: "rgba(255,107,0,0.03)", border: `1px solid rgba(255,107,0,0.08)` }}
          >
            <p className="text-[12px] text-white/50">
              <strong style={{ color: A }}>Restaurants for E-Marketing</strong> operates as a{" "}
              <strong className="text-white/60">technical data orchestrator</strong> — not a bank, not a payment service provider, not a factoring company.
              All financial flows are processed through licensed institutions. Zero liability for counterparty collection defaults.
            </p>
            <p className="text-[11px] mt-2 text-white/30" dir="rtl">
              تعمل مطاعم للتسويق الإلكتروني كمنسق بيانات تقني، ليست بنكاً ولا مزود خدمات دفع. جميع التدفقات المالية تتم عبر مؤسسات مرخصة. مسؤولية صفرية عن تعثر تحصيل الطرف الآخر.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   8. PRICING SECTION
   ═══════════════════════════════════════════════════════════ */
function PricingSection({ onCTAClick }: { onCTAClick: () => void }) {
  const plans = [
    {
      role: "Hotels",
      price: "Free",
      priceNote: "to join & use",
      desc: "Full procurement dashboard, AI forecasting, 680+ suppliers, and ETA compliance, all free.",
      items: ["0% subscription fee", "1% on bank transfer payments", "Free ETA e-invoicing", "Free AI demand forecasting"],
      accent: true,
    },
    {
      role: "Suppliers",
      price: "Free",
      priceNote: "to list",
      desc: "List your catalog, receive purchase orders, and get paid. No listing fees.",
      items: ["0% listing fee", "2-4% commission per order", "Free INVO marketplace listing", "48h settlement via factoring"],
      accent: false,
    },
    {
      role: "Funders",
      price: "Free",
      priceNote: "to access pool",
      desc: "Access verified, ETA-compliant invoice pools. Only earn when you fund.",
      items: ["0% access fee", "Earn 12-18% APR on invoices", "FRA-compliant three-way matching", "Fully automated settlement"],
      accent: false,
    },
  ];

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>Pricing</SectionLabel>
            <SectionHeading>Free to Start. Pay Only When You Transact.</SectionHeading>
            <SectionSub>No subscriptions. No setup fees. No credit card to join.</SectionSub>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {plans.map((plan, i) => (
            <Reveal key={plan.role} delay={i * 0.1}>
              <div
                className="rounded-2xl p-6 h-full flex flex-col"
                style={{
                  backgroundColor: plan.accent ? AM : SC,
                  border: `1px solid ${plan.accent ? AB : B1}`,
                }}
              >
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.15em] mb-3"
                  style={{ color: plan.accent ? A : "rgba(255,255,255,0.3)" }}
                >
                  {plan.role}
                </div>
                <div className="mb-1">
                  <span
                    className="text-[36px] font-bold text-white"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    {plan.price}
                  </span>
                </div>
                <div className="text-[12px] text-white/30 mb-4">{plan.priceNote}</div>
                <p className="text-[12px] text-white/40 leading-relaxed mb-6">{plan.desc}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {plan.items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[12px] text-white/55">
                      <CheckCircle2 size={13} className="mt-0.5 shrink-0" style={{ color: plan.accent ? A : "rgba(255,255,255,0.3)" }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={onCTAClick}
                  className="w-full py-3 text-[13px] font-bold rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer mt-auto"
                  style={{
                    background: plan.accent ? A : "rgba(255,255,255,0.06)",
                    color: plan.accent ? "#ffffff" : "rgba(255,255,255,0.7)",
                    border: `1px solid ${plan.accent ? A : B1}`,
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
  );
}

/* ═══════════════════════════════════════════════════════════
   9. SOCIAL PROOF / TESTIMONIAL
   ═══════════════════════════════════════════════════════════ */
function SocialProof() {
  return (
    <section className="py-20" style={{ borderTop: `1px solid ${B1}`, borderBottom: `1px solid ${B1}` }}>
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="text-[40px] leading-none mb-4"
              style={{ color: A, fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              &ldquo;
            </div>
            <p
              className="text-[16px] md:text-[18px] text-white/60 leading-relaxed mb-6 italic"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              We went from 60-day supplier payments to 48 hours — without changing our own cash flow. The reverse factoring alone paid for the platform in the first quarter.
            </p>
            <div className="flex items-center justify-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ backgroundColor: A, color: "#fff" }}
              >
                MH
              </div>
              <div className="text-left">
                <p className="text-[12px] font-medium text-white/70">Mohamed Hassan</p>
                <p className="text-[10px] text-white/30">Group Procurement Director · Red Sea Resort Chain</p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   10. MID-PAGE CTA
   ═══════════════════════════════════════════════════════════ */
function MidPageCTA({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center bottom, ${AG} 0%, transparent 60%)` }}
      />
      <div className="max-w-3xl mx-auto px-6 text-center relative">
        <Reveal>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{ backgroundColor: AM, border: `1px solid ${AB}` }}
          >
            <Zap size={13} style={{ color: A }} />
            <span className="text-[12px] font-semibold" style={{ color: A }}>Start Saving Today</span>
          </div>
          <h2
            className="text-[28px] md:text-[40px] font-medium tracking-tight text-white mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Your Supply Chain Is
            <br />
            Leaking Money
          </h2>
          <p className="text-[15px] text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
            Every manual PO, every late invoice, every untracked delivery adds up. HotelsVendors gives your hotel 360-degree control.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CTAButton onClick={onCTAClick} primary>
              Get Started Free
            </CTAButton>
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
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
const TABS = [
  { id: "overview", label: "Overview", icon: Building2 },
  { id: "platform", label: "Platform", icon: BrainCircuit },
  { id: "pricing", label: "Pricing", icon: Banknote },
  { id: "faq", label: "FAQ", icon: Sparkles },
] as const;

export default function HomePage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const openWizard = () => setWizardOpen(true);

  return (
    <div className="marketing-main min-h-screen">
      <MarketingNav />

      <HeroSection onCTAClick={openWizard} />
      <MarketTicker />
      <EnterpriseTrustBanner />

      {/* Tab Navigation */}
      <div className="sticky top-[68px] z-40 border-b" style={{ borderColor: "var(--border-subtle)", background: "var(--bg-canvas)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium whitespace-nowrap transition-all shrink-0"
                style={{
                  background: activeTab === tab.id ? "var(--accent-muted)" : "transparent",
                  color: activeTab === tab.id ? "var(--accent-base)" : "var(--text-secondary)",
                  border: `1px solid ${activeTab === tab.id ? "var(--border-accent)" : "transparent"}`,
                }}
              >
                <tab.icon size={15} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <ValueSplitSection onCTAClick={openWizard} />
            <ProblemSolutionSplit />
            <FeatureBentoGrid />
            <ProcurementFlowVisualizer />
            <SocialProof />
            <MidPageCTA onCTAClick={openWizard} />
          </motion.div>
        )}
        {activeTab === "platform" && (
          <motion.div key="platform" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <VendorNetwork />
            <SmartSourcingGrid />
            <RFQEngine />
            <InvoicingPortal />
            <PaymentGateway />
            <AuthorityValidation />
            <AnalyticsDashboard />
            <LifecycleVisualizer />
            <GovernanceAudit />
            <DualOnboarding onCTAClick={openWizard} />
            <GovernanceSecurity />
          </motion.div>
        )}
        {activeTab === "pricing" && (
          <motion.div key="pricing" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <PricingSection onCTAClick={openWizard} />
          </motion.div>
        )}
        {activeTab === "faq" && (
          <motion.div key="faq" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.3 }}>
            <section className="py-24 md:py-32" style={{ borderTop: `1px solid var(--border-subtle)` }}>
              <div className="max-w-3xl mx-auto px-6">
                <Reveal>
                  <div className="text-center mb-12">
                    <SectionLabel>FAQ</SectionLabel>
                    <SectionHeading>Questions? Answered.</SectionHeading>
                  </div>
                </Reveal>
                <FAQAccordion />
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <MarketingFooter />
      <RegistrationWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}
