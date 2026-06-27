"use client";

import { useRef, useState, useEffect } from "react";
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
  CheckCircle2,
  Play,
  Landmark,
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
import { ThemeToggle } from "@/components/theme/theme-toggle";

/* ═══════════════════════════════════════════════════════════════
   DESIGN TOKENS — Orange mobile services light theme
   Uses CSS variables from :root (orange light default).
   ═══════════════════════════════════════════════════════════════ */
const ACCENT = "var(--accent-base, #C4881F)";
const ACCENT_LIGHT = "var(--accent-light, #E8A838)";
const ACCENT_MUTED = "var(--accent-muted, rgba(196,136,31,0.08))";
const ACCENT_BORDER = "var(--border-accent, rgba(196,136,31,0.30))";
const BG = "var(--bg-canvas, #FAFAF8)";
const TEXT = "var(--text-primary, #1A1816)";
const TEXT_SECONDARY = "var(--text-secondary, #4A4640)";
const TEXT_MUTED = "var(--text-muted, #9D978E)";
const SURFACE = "var(--surface, #FFFFFF)";
const TEXT_INVERSE = "var(--text-inverse, #FAFAF8)";

const SANS = "var(--font-sans, 'Jakarta Sans, Inter, system-ui, sans-serif')";

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
    <span
      className="text-[10px] uppercase tracking-[0.3em] mb-4 block"
      style={{ color: ACCENT, fontFamily: SANS, letterSpacing: "0.3em" }}
    >
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   SANDBOX DASHBOARD PANEL (Interactive Demo)
   Theme A: White outer frame, black cards inside.
   Uses Framer Motion AnimatePresence for role switching.
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
      className="relative rounded-3xl p-4"
      style={{
        background: SURFACE,
        border: "1px solid var(--border-subtle)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.06), 0 0 0 1px var(--border-subtle)",
      }}
    >
      {/* Role switcher tabs */}
      <div
        className="flex gap-1 p-1.5 mb-4 rounded-xl"
        style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}
      >
        {roles.map((role) => {
          const Icon = role.icon;
          const isActive = activeRole === role.key;
          return (
            <button
              key={role.key}
              onClick={() => setActiveRole(role.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg text-[11px] transition-all cursor-pointer"
              style={{
                backgroundColor: isActive ? ACCENT : "transparent",
                color: isActive ? "var(--text-inverse)" : "var(--text-muted)",
                fontFamily: SANS,
                fontWeight: isActive ? 600 : 500,
              }}
            >
              <Icon size={12} />
              <span className="hidden sm:inline">{role.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dashboard preview area */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{ border: "1px solid var(--border-subtle)", backgroundColor: "var(--bg-surface-3)" }}
      >
        {/* Hover overlay with CTA */}
        <div
          className="absolute inset-0 z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
          style={{ backgroundColor: "rgba(0,0,0,0.35)", backdropFilter: "blur(4px)" }}
        >
          <button
            onClick={onCTAClick}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] transition-all hover:scale-105 cursor-pointer"
            style={{
              background: ACCENT,
              color: "var(--text-inverse)",
              fontFamily: SANS,
              fontWeight: 600,
              boxShadow: "0 0 20px var(--accent-glow)",
            }}
          >
            <Play size={14} />
            Open Interactive Sandbox
          </button>
        </div>
        {/* Animated role switch */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {activeRole === "hotel" && <HotelDashboardMockup />}
            {activeRole === "supplier" && <SupplierDashboardMockup />}
            {activeRole === "funder" && <FunderDashboardMockup />}
            {activeRole === "logistics" && <LogisticsDashboardMockup />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA bar */}
      <div className="mt-4 flex items-center justify-between px-2 py-2">
        <span className="text-[10px]" style={{ color: "var(--text-muted)", fontFamily: SANS }}>
          Live preview — click to explore
        </span>
        <Link
          href="/sandbox"
          className="flex items-center gap-1.5 text-[11px] transition-colors"
          style={{ color: ACCENT, fontFamily: SANS, fontWeight: 500 }}
        >
          Full Sandbox
          <ArrowRight size={11} />
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   1. HERO — The Story Opening
   Theme A: OLED black bg, white title, lime subtitle.
   Full-screen DashboardMockup with Framer Motion parallax via HeroVisual.
   ═══════════════════════════════════════════════════════════ */
function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={visible ? "/hero-video.mp4" : undefined}
      poster="/hero-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="none"
      className="w-full h-full object-cover"
    />
  );
}

function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [emailError, setEmailError] = useState("");

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* Background — CSS gradient (no external image needed) */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0A0806 0%, #14110E 30%, #1A1408 60%, #0E1A14 100%)",
        }}
      />
      {/* Subtle warm glow top-right */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--accent-dark) 0%, transparent 70%)" }}
      />
      {/* Subtle cool glow bottom-left */}
      <div
        className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--success) 0%, transparent 70%)" }}
      />

      {/* Decorative grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32 w-full">
        <div className="flex flex-col lg:flex-row items-start gap-12 lg:gap-16">
          {/* Left column — text + CTA */}
          <div className="max-w-3xl flex-1">
            {/* Badge */}
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] px-4 py-1.5 rounded-full mb-8"
              style={{
                background: "var(--accent-muted)",
                color: "var(--accent-light)",
                border: "1px solid var(--border-accent)",
                fontFamily: SANS,
                fontWeight: 500,
              }}
            >
              Egypt&apos;s B2B Hospitality Infrastructure
            </motion.span>

            {/* Headline — stagger animation */}
            <h1
              className="text-[36px] md:text-[56px] lg:text-[64px] mb-6 leading-[1.05] tracking-tight"
              style={{ fontFamily: SANS, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em" }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="block"
              >
                Procurement, Compliance, and Capital —
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18 }}
                className="block"
                style={{ color: "var(--accent-light)" }}
              >
                Built Into One Platform
              </motion.span>
            </h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[15px] md:text-[17px] max-w-xl mb-10 leading-[1.7]"
              style={{ fontFamily: SANS, color: "rgba(255,255,255,0.7)", fontWeight: 400 }}
            >
              From Sharm El-Sheikh to Alexandria: AI-driven procurement, ETA-compliant e-invoicing,
              and embedded reverse factoring — purpose-built for Egypt&apos;s coastal hotel chains.
            </motion.p>

            {/* Email capture with validation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="max-w-md"
            >
              {!submitted ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: "rgba(255,255,255,0.4)" }}
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError("");
                      }}
                      onBlur={() => {
                        if (email && !isValidEmail(email)) {
                          setEmailError("Enter a valid email address");
                        }
                      }}
                      placeholder="you@yourhotel.com"
                      className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[13px] outline-none transition-all"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: emailError
                          ? "1px solid #EF4444"
                          : "1px solid rgba(255,255,255,0.15)",
                        color: "#FFFFFF",
                        fontFamily: SANS,
                        boxShadow: emailError ? "0 0 0 3px rgba(239,68,68,0.15)" : "none",
                      }}
                      onFocus={(e) => {
                        setEmailError("");
                        e.currentTarget.style.borderColor = "var(--accent-base)";
                        e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-muted)";
                      }}
                    />
                    {emailError && (
                      <span
                        className="absolute -bottom-5 left-0 text-[10px]"
                        style={{ color: "#EF4444", fontFamily: SANS, fontWeight: 500 }}
                      >
                        {emailError}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (!email) {
                        setEmailError("Enter your email address");
                        return;
                      }
                      if (!isValidEmail(email)) {
                        setEmailError("Enter a valid email address");
                        return;
                      }
                      setSubmitted(true);
                      onCTAClick();
                    }}
                    className="px-6 py-3.5 text-[13px] rounded-xl transition-all duration-200 shrink-0"
                    style={{
                      background: email && isValidEmail(email)
                        ? "linear-gradient(135deg, var(--accent-dark), var(--accent-light))"
                        : "rgba(255,255,255,0.12)",
                      color: email && isValidEmail(email)
                        ? "var(--accent-text)"
                        : "rgba(255,255,255,0.4)",
                      fontFamily: SANS,
                      fontWeight: 600,
                      cursor: email && isValidEmail(email) ? "pointer" : "default",
                    }}
                  >
                    Get Started
                  </button>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 px-4 py-3 rounded-xl"
                  style={{ backgroundColor: "rgba(46,125,79,0.15)", border: "1px solid rgba(46,125,79,0.3)" }}
                >
                  <CheckCircle2 size={16} style={{ color: "var(--success)" }} />
                  <span className="text-[13px]" style={{ color: "#FFFFFF", fontFamily: SANS }}>
                    You&apos;re on the list. We&apos;ll be in touch shortly.
                  </span>
                </div>
              )}
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 mt-10 text-[11px]"
              style={{ color: "rgba(255,255,255,0.5)", fontFamily: SANS }}
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={12} style={{ color: "var(--accent-light)" }} />
                ETA Compliant
              </span>
              <span className="flex items-center gap-1.5">
                <Banknote size={12} style={{ color: "var(--accent-light)" }} />
                FRA Licensed
              </span>
              <span className="flex items-center gap-1.5">
                <Receipt size={12} style={{ color: "var(--accent-light)" }} />
                6 Governorates
              </span>
              <span className="flex items-center gap-1.5">
                <Landmark size={12} style={{ color: "var(--accent-light)" }} />
                Bank-Direct Settlement
              </span>
            </motion.div>
          </div>

          {/* Right column — hero video (lg+) with lazy-load */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block w-[340px] xl:w-[400px] shrink-0"
            aria-hidden="true"
          >
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
                aspectRatio: "832 / 464",
              }}
            >
              <HeroVideo />
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <a
            href="#problem"
            className="flex flex-col items-center gap-1.5 transition-colors"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <span className="text-[9px] tracking-[0.2em] uppercase" style={{ fontFamily: SANS, fontWeight: 500 }}>
              Scroll to discover
            </span>
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
    {
      title: "Manual POs",
      desc: "Your team sends purchase orders via WhatsApp and email. No audit trail. No budget control.",
      icon: "📋",
    },
    {
      title: "60–180 Day Payments",
      desc: "Suppliers wait months for payment. They prioritize other buyers. Your supply chain suffers.",
      icon: "⏳",
    },
    {
      title: "ETA Compliance Burden",
      desc: "Every invoice must be digitally signed, UUID-validated, and submitted to the Tax Authority. Manual work is error-prone.",
      icon: "📑",
    },
    {
      title: "Zero Spend Visibility",
      desc: "You don't know which properties are overpaying, which suppliers are unreliable, or where money leaks.",
      icon: "👁️",
    },
  ];

  return (
    <section id="problem" className="py-24 md:py-32 relative" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>The Problem</SectionLabel>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: SANS, fontWeight: 500, color: TEXT }}
            >
              Hotel Procurement Is Broken
            </h2>
            <div className="w-12 h-px mx-auto mb-5" style={{ background: ACCENT }} />
            <p
              className="text-[14px] max-w-lg mx-auto"
              style={{ fontFamily: SANS, color: TEXT_SECONDARY, fontWeight: 400 }}
            >
              Egypt&apos;s coastal resorts lose 15–25% of procurement value to inefficiency. Here&apos;s what that looks like.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4">
          {problems.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div
                className="surface-card p-6 h-full"
              >
                <div className="text-[24px] mb-3">{p.icon}</div>
                <h3
                  className="text-[15px] mb-2"
                  style={{ fontFamily: SANS, fontWeight: 500, color: TEXT }}
                >
                  {p.title}
                </h3>
                <p
                  className="text-[13px] leading-relaxed"
                  style={{ fontFamily: SANS, color: TEXT_MUTED, fontWeight: 400 }}
                >
                  {p.desc}
                </p>
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
    {
      num: "01",
      title: "Connect",
      desc: "Register your hotel in 5 minutes. AI guides you through supplier discovery and catalog browsing.",
      icon: Building2,
    },
    {
      num: "02",
      title: "Order",
      desc: "AI predicts what you need. One-click PO generation. Automatic budget enforcement via Authority Matrix.",
      icon: BrainCircuit,
    },
    {
      num: "03",
      title: "Settle",
      desc: "Every invoice ETA-compliant, digitally signed, UUID-validated. Suppliers paid in 48 hours via reverse factoring.",
      icon: Banknote,
    },
    {
      num: "04",
      title: "Optimize",
      desc: "AI learns your patterns. Forecasts demand 14 days ahead. Flags anomalies before you overpay.",
      icon: BarChart3,
    },
  ];

  return (
    <section className="py-24 md:py-32 relative" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>How It Works</SectionLabel>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: SANS, fontWeight: 500, color: TEXT }}
            >
              From Chaos to Control
            </h2>
            <p
              className="text-[14px] max-w-md mx-auto"
              style={{ fontFamily: SANS, color: TEXT_SECONDARY, fontWeight: 400 }}
            >
              Four steps. Zero paperwork. Every invoice bankable.
            </p>
            <div className="w-12 h-px mx-auto mt-5" style={{ background: ACCENT }} />
          </div>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-4">
          {steps.map((item, i) => {
            const StepIcon = item.icon;
            return (
              <Reveal key={item.num} delay={i * 0.1}>
                <div
                  className="surface-card p-6 h-full group"
                >
                  <div
                    className="text-[10px] mb-4 uppercase tracking-wider"
                    style={{ color: ACCENT, fontFamily: SANS, fontWeight: 500, letterSpacing: "0.15em" }}
                  >
                    Step {item.num}
                  </div>
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
                    style={{
                      backgroundColor: ACCENT_MUTED,
                      border: `1px solid ${ACCENT_BORDER}`,
                    }}
                  >
                    <StepIcon size={18} style={{ color: ACCENT }} />
                  </div>
                  <h3 className="text-[15px] mb-2" style={{ fontFamily: SANS, fontWeight: 500, color: TEXT }}>
                    {item.title}
                  </h3>
                  <p
                    className="text-[12px] leading-relaxed"
                    style={{ fontFamily: SANS, color: TEXT_MUTED, fontWeight: 400 }}
                  >
                    {item.desc}
                  </p>
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
    <section className="py-24 md:py-32 relative" style={{ background: BG }}>
      <div className="max-w-5xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>One Platform, Three Stakeholders</SectionLabel>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: SANS, fontWeight: 500, color: TEXT }}
            >
              Built for Your Role
            </h2>
            <div className="w-12 h-px mx-auto" style={{ background: ACCENT }} />
          </div>
        </Reveal>

        <div className="space-y-6">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <Reveal key={role.title} delay={i * 0.1}>
                <div
                  className="surface-card p-8 md:p-10"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: ACCENT_MUTED, border: `1px solid ${ACCENT_BORDER}` }}
                        >
                          <Icon size={18} style={{ color: ACCENT }} />
                        </div>
                        <div>
                          <span
                            className="text-[10px] uppercase tracking-[0.15em] block"
                            style={{ color: ACCENT, fontFamily: SANS, fontWeight: 500 }}
                          >
                            {role.title}
                          </span>
                          <h3
                            className="text-[18px] md:text-[22px]"
                            style={{ fontFamily: SANS, fontWeight: 500, color: TEXT }}
                          >
                            {role.headline}
                          </h3>
                        </div>
                      </div>
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
                        {role.points.map((p) => (
                          <li
                            key={p}
                            className="flex items-start gap-2.5 text-[13px]"
                            style={{ fontFamily: SANS, color: TEXT_SECONDARY, fontWeight: 400 }}
                          >
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={onCTAClick}
                        className="inline-flex items-center gap-2 px-6 py-3 text-[13px] rounded-xl transition-all duration-200 hover:scale-[1.03] cursor-pointer"
                        style={{
                          background: ACCENT,
                          color: "var(--text-inverse)",
                          fontFamily: SANS,
                          fontWeight: 600,
                          boxShadow: "0 0 16px var(--accent-glow)",
                        }}
                      >
                        {role.cta}
                        <ArrowRight size={14} />
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
  const testimonials = [
    {
      quote: "We cut invoice processing from 11 days to 4 hours. ETA submission is now fully automatic — zero manual work for our finance team.",
      name: "Ahmed El-Sayed",
      title: "Group Finance Director",
      org: "Stella Di Mare Hotels",
    },
    {
      quote: "Reverse factoring changed our supplier relationships. They get paid in 48 hours, we keep Net-60 terms. Everyone wins.",
      name: "Marina Fahmy",
      title: "Procurement Manager",
      org: "Sunrise Resorts — Sharm",
    },
    {
      quote: "The Shark-Breaker hub model reduced our logistics cost per kilo by 38%. Consolidated delivery to three Red Sea properties.",
      name: "Khaled Hassan",
      title: "Operations Director",
      org: "Jaz Hotels — Hurghada",
    },
  ];

  const trustedBy = [
    "Stella Di Mare", "Sunrise", "Jaz Hotels", "Baron Hotels",
    "Steigenberger", "Rixos", "Marriott", "Hilton",
  ];

  const stats = [
    { num: "680+", label: "Verified Suppliers", sub: "Across 6 governorates" },
    { num: "500+", label: "Active Hotels", sub: "From Sharm to North Coast" },
    { num: "EGP 12M+", label: "Monthly GMV", sub: "Growing 30% MoM" },
  ];

  return (
    <section className="py-24 md:py-32 relative" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>Trusted by Egypt&apos;s Coastal Hospitality Leaders</SectionLabel>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: SANS, fontWeight: 500, color: TEXT }}
            >
              Built with the Operators Who Run the Resorts
            </h2>
            <div className="w-12 h-px mx-auto" style={{ background: ACCENT }} />
          </div>
        </Reveal>

        {/* Stats row */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto text-center mb-14">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div
                  className="text-[28px] md:text-[36px] mb-1"
                  style={{ fontFamily: SANS, fontWeight: 600, color: ACCENT }}
                >
                  {stat.num}
                </div>
                <div className="text-[12px]" style={{ fontFamily: SANS, color: TEXT_SECONDARY }}>
                  {stat.label}
                </div>
                <div className="text-[10px] mt-0.5" style={{ fontFamily: SANS, color: TEXT_MUTED }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Trusted-by logo strip */}
        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-14">
            {trustedBy.map((name) => (
              <span
                key={name}
                className="text-[13px] font-medium opacity-50 tracking-wide"
                style={{ fontFamily: SANS, color: TEXT }}
              >
                {name}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Testimonial cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={0.15 + i * 0.08}>
              <div className="surface-card p-6 h-full flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[0, 1, 2, 3, 4].map((s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={ACCENT} xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
                <p
                  className="text-[13px] leading-relaxed flex-1 mb-5"
                  style={{ fontFamily: SANS, color: TEXT_SECONDARY, fontWeight: 400 }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
                  <p className="text-[13px] font-medium" style={{ fontFamily: SANS, color: TEXT }}>
                    {t.name}
                  </p>
                  <p className="text-[11px]" style={{ fontFamily: SANS, color: TEXT_MUTED }}>
                    {t.title} · {t.org}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. FINAL CTA
   ═══════════════════════════════════════════════════════════ */
function FinalCTA({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: BG }}>
      {/* Subtle accent glow at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, var(--accent-glow) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-3xl mx-auto px-6 text-center relative">
        <Reveal>
          <h2
            className="text-[28px] md:text-[44px] tracking-tight mb-5 leading-tight"
            style={{ fontFamily: SANS, fontWeight: 500, color: TEXT }}
          >
            Ready to Modernize Your Procurement?
          </h2>
          <div className="w-12 h-px mx-auto mb-5" style={{ background: ACCENT }} />
          <p
            className="text-[15px] mb-10 max-w-lg mx-auto leading-relaxed"
            style={{ fontFamily: SANS, color: TEXT_MUTED, fontWeight: 400 }}
          >
            Join 500+ Egyptian hotels already on HotelsVendors. Free to start. Live in 24 hours. No credit card.
          </p>
          <p
            className="text-[10px] mt-2 max-w-xl mx-auto"
            style={{ fontFamily: SANS, color: TEXT_MUTED, fontWeight: 400, opacity: 0.7 }}
          >
            Restaurants for E-Marketing operates strictly as a technical data orchestrator. Zero liability for counterparty collection defaults.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onCTAClick}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[14px] rounded-2xl transition-all duration-200 hover:scale-[1.03] cursor-pointer"
              style={{
                background: ACCENT,
                color: "var(--text-inverse)",
                fontFamily: SANS,
                fontWeight: 600,
                boxShadow: "0 0 24px var(--accent-glow)",
              }}
            >
              Get Started Free
              <ArrowRight size={16} />
            </button>
            <Link
              href="/sandbox"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] rounded-2xl transition-all duration-200"
              style={{
                border: "1px solid var(--border-visible)",
                color: TEXT_SECONDARY,
                fontFamily: SANS,
                fontWeight: 500,
              }}
            >
              <Play size={15} />
              Explore Sandbox
            </Link>
          </div>
          <p
            className="text-[11px] mt-8"
            style={{ fontFamily: SANS, color: TEXT_MUTED, fontWeight: 400 }}
          >
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
    <div className="min-h-screen" style={{ background: BG, color: TEXT, fontFamily: SANS }}>
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

      {/* Theme toggle — fixed bottom-right */}
      <div className="fixed bottom-6 right-6 z-50">
        <ThemeToggle />
      </div>
    </div>
  );
}
