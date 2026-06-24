"use client";

import { useRef, useState } from "react";
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

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS
   ═══════════════════════════════════════════════════════════════ */
const A = "#FF6B00";
const AM = "rgba(255,107,0,0.08)";
const AB = "rgba(255,107,0,0.25)";
const AG = "rgba(255,107,0,0.15)";
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
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 block" style={{ color: A }}>
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   SANDBOX DASHBOARD PANEL (Interactive Demo)
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
      className="relative rounded-3xl p-3 spotlight"
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
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-bold transition-all hover:scale-105 cursor-pointer cta-glow"
            style={{ background: A, color: "#fff" }}
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
   1. HERO — The Story Opening
   ═══════════════════════════════════════════════════════════ */
function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <section className="relative overflow-hidden grid-pattern">
      {/* Ambient glow */}
      <div
        className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${AM} 0%, transparent 70%)`, opacity: 0.6 }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-[92px] md:pt-[110px] pb-20 md:pb-28">
        {/* Brand logo */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-10"
        >
          <BrandLogo variant="dark" size="lg" />
        </motion.div>

        {/* Headline + sub */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h1
            className="text-[36px] md:text-[52px] lg:text-[60px] font-normal text-white mb-5 leading-[1.08] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Stop Losing 25% of Your
            <br />
            <span style={{ color: A }}>Procurement Budget</span>
          </h1>
          <p className="text-[15px] md:text-[17px] text-white/45 max-w-xl mx-auto leading-[1.7]">
            Egypt&apos;s hotels waste millions on manual POs, 180-day payment cycles, and ETA compliance failures.
            HotelsVendors fixes all three — with AI.
          </p>
        </motion.div>

        {/* Two-column: CTA left, Interactive Demo right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-start">
          {/* Left: Email + social proof */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-5 lg:sticky lg:top-28"
          >
            {/* Email capture */}
            {!submitted ? (
              <div className="flex flex-col sm:flex-row gap-2 mb-8 max-w-md">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[13px] text-white placeholder:text-white/20 outline-none transition-all"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${B1}` }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = AB; e.currentTarget.style.boxShadow = `0 0 0 3px ${AM}`; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = B1; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>
                <button
                  onClick={() => { if (email.includes("@")) { setSubmitted(true); onCTAClick(); } }}
                  className="px-6 py-3.5 text-[13px] font-bold rounded-xl transition-all duration-200 hover:scale-[1.03] cursor-pointer cta-glow shrink-0"
                  style={{ background: A, color: "#ffffff" }}
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 mb-8 px-4 py-3 rounded-xl max-w-md"
                style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <CheckCircle2 size={16} style={{ color: "#22C55E" }} />
                <span className="text-[13px] text-white/60">You&apos;re on the list. We&apos;ll be in touch shortly.</span>
              </div>
            )}

            {/* Quick stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { num: "680+", label: "Suppliers" },
                { num: "48h", label: "Settlement" },
                { num: "25%", label: "Cost Saved" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-3 rounded-xl card-lift" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${B1}` }}>
                  <div className="text-[20px] font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stat.num}</div>
                  <div className="text-[10px] text-white/30 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 text-[11px] text-white/25">
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={12} style={{ color: A }} />
                ETA Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <Banknote size={12} style={{ color: A }} />
                FRA Licensed
              </span>
              <span className="flex items-center gap-1.5">
                <Receipt size={12} style={{ color: A }} />
                6 Governorates
              </span>
            </div>
          </motion.div>

          {/* Right: Interactive Sandbox Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="lg:col-span-7"
          >
            <SandboxDashboardPanel onCTAClick={onCTAClick} />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-16 flex justify-center">
          <a href="#problem" className="flex flex-col items-center gap-1.5 text-white/15 hover:text-white/30 transition-colors">
            <span className="text-[9px] tracking-[0.2em] uppercase font-medium">Scroll to discover</span>
            <ArrowDown size={14} className="animate-bounce" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. PROBLEM SECTION — "The Old Way Is Broken"
   ═══════════════════════════════════════════════════════════ */
function ProblemSection() {
  const problems = [
    { title: "Manual POs", desc: "Your team sends purchase orders via WhatsApp and email. No audit trail. No budget control.", icon: "📋" },
    { title: "60-180 Day Payments", desc: "Suppliers wait months for payment. They prioritize other buyers. Your supply chain suffers.", icon: "⏳" },
    { title: "ETA Compliance Burden", desc: "Every invoice must be digitally signed, UUID-validated, and submitted to the Tax Authority. Manual work is error-prone.", icon: "📑" },
    { title: "Zero Spend Visibility", desc: "You don't know which properties are overpaying, which suppliers are unreliable, or where money leaks.", icon: "👁️" },
  ];

  return (
    <section id="problem" className="py-24 md:py-32 relative">
      <div className="section-fade absolute top-0 left-0 right-0" />
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>The Problem</SectionLabel>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Hotel Procurement Is Broken
            </h2>
            <div className="glow-line mx-auto mb-5" />
            <p className="text-[14px] text-white/40 max-w-lg mx-auto">
              Egypt&apos;s coastal resorts lose 15–25% of procurement value to inefficiency. Here&apos;s what that looks like.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div
                className="rounded-2xl p-6 h-full card-lift"
                style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid rgba(239,68,68,0.1)` }}
              >
                <div className="text-[24px] mb-3">{p.icon}</div>
                <h3 className="text-[15px] font-semibold text-white/90 mb-2">{p.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. HOW IT WORKS — 4-Step Flow
   ═══════════════════════════════════════════════════════════ */
function HowItWorks() {
  const steps = [
    { num: "01", title: "Connect", desc: "Register your hotel in 5 minutes. AI guides you through supplier discovery and catalog browsing.", icon: Building2 },
    { num: "02", title: "Order", desc: "AI predicts what you need. One-click PO generation. Automatic budget enforcement via Authority Matrix.", icon: BrainCircuit },
    { num: "03", title: "Settle", desc: "Every invoice ETA-compliant, digitally signed, UUID-validated. Suppliers paid in 48 hours via reverse factoring.", icon: Banknote },
    { num: "04", title: "Optimize", desc: "AI learns your patterns. Forecasts demand 14 days ahead. Flags anomalies before you overpay.", icon: BarChart3 },
  ];

  return (
    <section className="py-24 md:py-32 relative">
      <div className="section-fade absolute top-0 left-0 right-0" />
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>How It Works</SectionLabel>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              From Chaos to Control
              <br />
              <span style={{ color: A }}>In Four Steps</span>
            </h2>
            <div className="glow-line mx-auto" />
          </div>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((item, i) => {
            const StepIcon = item.icon;
            return (
              <Reveal key={item.num} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-6 h-full card-lift step-connector group"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${B1}` }}
                >
                  <div className="text-[10px] font-bold mb-4 uppercase tracking-wider" style={{ color: A }}>
                    Step {item.num}
                  </div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:border-[rgba(255,107,0,0.2)]"
                    style={{ backgroundColor: "rgba(255,255,255,0.03)", border: `1px solid ${B1}` }}
                  >
                    <StepIcon size={18} className="text-white/40 group-hover:text-[#FF6B00] transition-colors duration-300" />
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
   4. ROLE-BASED VALUE — "Built for Your Role"
   ═══════════════════════════════════════════════════════════ */
function RoleValueSection({ onCTAClick }: { onCTAClick: () => void }) {
  const roles = [
    {
      title: "Hotels",
      headline: "Cut Procurement Costs 25%",
      points: [
        "AI demand forecasting — 94% accuracy",
        "680+ verified suppliers, one marketplace",
        "ETA e-invoicing automated — zero manual work",
        "Reverse factoring — suppliers paid in 48h, you keep Net-60",
      ],
      cta: "Register as Hotel",
      icon: Building2,
    },
    {
      title: "Suppliers",
      headline: "Get Paid in 48 Hours, Not 60 Days",
      points: [
        "Access 500+ active hotel buyers",
        "AI chatbot matches hotels to your products",
        "Reverse factoring — you choose when to get paid",
        "Real-time catalog sync via API",
      ],
      cta: "Register as Supplier",
      icon: Store,
    },
    {
      title: "Funders",
      headline: "Finance Pre-Verified Invoice Pools",
      points: [
        "Only ETA-compliant, three-way matched invoices",
        "Competitive bidding drives down factoring fees",
        "SHA-256 audit trail on every transaction",
        "FRA-compliant from day one",
      ],
      cta: "Register as Funder",
      icon: Landmark,
    },
  ];

  return (
    <section className="py-24 md:py-32 relative">
      <div className="section-fade absolute top-0 left-0 right-0" />
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>One Platform, Three Stakeholders</SectionLabel>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Built for Your Role
            </h2>
            <div className="glow-line mx-auto" />
          </div>
        </Reveal>

        <div className="space-y-6">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <Reveal key={role.title} delay={i * 0.1}>
                <div
                  className="rounded-2xl p-8 md:p-10 card-lift"
                  style={{ backgroundColor: "rgba(255,255,255,0.015)", border: `1px solid ${B1}` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: AM, border: `1px solid ${AB}` }}
                        >
                          <Icon size={18} style={{ color: A }} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] block" style={{ color: A }}>{role.title}</span>
                          <h3 className="text-[18px] md:text-[22px] font-semibold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {role.headline}
                          </h3>
                        </div>
                      </div>
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
                        {role.points.map((p) => (
                          <li key={p} className="flex items-start gap-2.5 text-[13px] text-white/55">
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: A }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={onCTAClick}
                        className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-bold rounded-xl transition-all duration-200 hover:scale-[1.03] cursor-pointer cta-glow"
                        style={{ background: A, color: "#ffffff" }}
                      >
                        {role.cta}
                        <ArrowRight size={14} className="cta-arrow" />
                      </button>
                    </div>
                  </div>
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
   5. SOCIAL PROOF
   ═══════════════════════════════════════════════════════════ */
function SocialProof() {
  return (
    <section className="py-20 relative">
      <div className="section-fade absolute top-0 left-0 right-0" />
      <div className="section-fade absolute bottom-0 left-0 right-0" />
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { num: "680+", label: "Verified Suppliers", sub: "Across 6 governorates" },
              { num: "500+", label: "Active Hotels", sub: "From Sharm to North Coast" },
              { num: "EGP 12M+", label: "Monthly GMV", sub: "Growing 30% month-over-month" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-[32px] md:text-[40px] font-bold text-white mb-1"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {stat.num}
                </div>
                <div className="text-[13px] text-white/50">{stat.label}</div>
                <div className="text-[11px] text-white/25 mt-0.5">{stat.sub}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. FINAL CTA
   ═══════════════════════════════════════════════════════════ */
function FinalCTA({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at center bottom, ${AG} 0%, transparent 60%)` }}
      />
      <div className="max-w-3xl mx-auto px-6 text-center relative">
        <Reveal>
          <h2
            className="text-[28px] md:text-[44px] font-medium tracking-tight text-white mb-5 leading-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ready to Stop
            <br />
            <span style={{ color: A }}>Leaking Money?</span>
          </h2>
          <div className="glow-line mx-auto mb-5" />
          <p className="text-[15px] text-white/40 mb-10 max-w-lg mx-auto leading-relaxed">
            Join Egypt&apos;s hospitality procurement revolution. Free to start. Live in 24 hours. No credit card.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onCTAClick}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[14px] font-bold rounded-2xl transition-all duration-200 hover:scale-[1.03] cursor-pointer cta-glow"
              style={{ background: A, color: "#ffffff" }}
            >
              Get Started Free
              <ArrowRight size={16} className="cta-arrow" />
            </button>
            <Link
              href="/sandbox"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-medium rounded-2xl border transition-all duration-200 hover:bg-white/[0.04]"
              style={{ borderColor: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
            >
              <Play size={15} />
              Explore Sandbox
            </Link>
          </div>
          <p className="text-[11px] text-white/20 mt-8">
            No credit card required · Free forever for hotels · Dedicated onboarding
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function HomePage() {
  const [wizardOpen, setWizardOpen] = useState(false);
  const openWizard = () => setWizardOpen(true);

  return (
    <div className="min-h-screen bg-black text-white">
      <MarketingNav />

      <HeroSection onCTAClick={openWizard} />
      <MarketTicker />
      <ProblemSection />
      <HowItWorks />
      <RoleValueSection onCTAClick={openWizard} />
      <SocialProof />
      <FinalCTA onCTAClick={openWizard} />

      <MarketingFooter />
      <RegistrationWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </div>
  );
}
