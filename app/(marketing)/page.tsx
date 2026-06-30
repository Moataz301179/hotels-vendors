"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Receipt,
  Banknote,
  ShieldCheck,
  ShoppingCart,
  Store,
  Building2,
  Truck,
  BarChart3,
  CheckCircle2,
  Play,
  Landmark,
  ArrowDown,
  Mail,
  ClipboardList,
  Timer,
  Eye,
  AlertTriangle,
  TrendingUp,
  Zap,
  DollarSign,
  FileText,
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
   DESIGN TOKENS — Liquid Glass (navy + gold)
   ═══════════════════════════════════════════════════════════════ */
const ACCENT = "var(--accent-base, #A16207)";
const ACCENT_LIGHT = "var(--accent-light, #D97706)";
const ACCENT_MUTED = "var(--accent-muted, rgba(161,98,7,0.08))";
const ACCENT_BORDER = "var(--border-accent, rgba(161,98,7,0.30))";
const BG = "var(--bg-canvas, #F8FAFC)";
const TEXT = "var(--text-primary, #0F1729)";
const TEXT_SECONDARY = "var(--text-secondary, #334155)";
const TEXT_MUTED = "var(--text-muted, #94A3B8)";
const SURFACE = "var(--surface, #FFFFFF)";
const TEXT_INVERSE = "var(--text-inverse, #F8FAFC)";

const SANS = "var(--font-sans, 'Karla, Inter, system-ui, sans-serif')";
const HEADING = "var(--font-serif)";

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
   1. HERO — Procurement Orchestration Platform
   Split layout: left text + right animated flow diagram
   ═══════════════════════════════════════════════════════════ */

function HeroFlowDiagram() {
  const steps = [
    { icon: Store, label: "INVO Marketplace" },
    { icon: ShoppingCart, label: "Order" },
    { icon: Receipt, label: "ETA Verification" },
    { icon: ShieldCheck, label: "Escrow Payment" },
    { icon: Banknote, label: "Release" },
  ];

  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    const timers = steps.map((_, i) =>
      setTimeout(() => setActiveIndex(i), 600 + i * 900)
    );

    const interval = setInterval(() => {
      setActiveIndex(-1);
      requestAnimationFrame(() => {
        steps.forEach((_, i) => {
          setTimeout(() => setActiveIndex(i), i * 900);
        });
      });
    }, 6000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col items-center">
      {steps.map((step, i) => {
        const StepIcon = step.icon;
        const isActive = activeIndex >= i;
        const isCurrent = activeIndex === i;

        return (
          <div key={step.label} className="flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: isActive
                  ? "linear-gradient(135deg, rgba(196,136,31,0.2), rgba(232,168,56,0.1))"
                  : "rgba(255,255,255,0.04)",
                border: isActive
                  ? "1px solid rgba(232,168,56,0.35)"
                  : "1px solid rgba(255,255,255,0.06)",
                backdropFilter: "blur(12px)",
                transform: isCurrent ? "scale(1.03)" : "scale(1)",
                boxShadow: isCurrent
                  ? "0 0 30px rgba(196,136,31,0.15), inset 0 1px 0 rgba(255,255,255,0.1)"
                  : isActive
                  ? "inset 0 1px 0 rgba(255,255,255,0.08)"
                  : "inset 0 1px 0 rgba(255,255,255,0.04)",
              }}
              className="flex items-center gap-3.5 px-5 py-3.5 rounded-2xl w-full min-w-[230px] transition-all duration-500"
            >
              <div
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, var(--accent-dark), var(--accent-light))"
                    : "rgba(255,255,255,0.06)",
                  boxShadow: isActive ? "0 0 16px var(--accent-glow)" : "none",
                }}
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-500"
              >
                <StepIcon
                  size={18}
                  style={{
                    color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.3)",
                    transition: "color 0.5s",
                  }}
                />
              </div>
              <span
                className="text-[14px] font-medium transition-all duration-500"
                style={{
                  fontFamily: SANS,
                  color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.35)",
                }}
              >
                {step.label}
              </span>
            </motion.div>

            {i < steps.length - 1 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 36 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.15 + 0.2 }}
                className="flex items-center justify-center overflow-hidden"
              >
                <motion.svg
                  width="16"
                  height="36"
                  viewBox="0 0 16 36"
                  fill="none"
                  animate={activeIndex > i ? { y: [0, 4, 0] } : { y: 0 }}
                  transition={{ duration: 1.5, repeat: activeIndex > i ? Infinity : 0, ease: "easeInOut" }}
                >
                  <path
                    d="M8 4L8 32M8 32L2 26M8 32L14 26"
                    stroke={activeIndex > i ? "var(--accent-base)" : "rgba(255,255,255,0.1)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transition-colors duration-500"
                  />
                </motion.svg>
              </motion.div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Background — CSS gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #0A0F1D 0%, #0F1729 30%, #1A2438 60%, #0F1729 100%)",
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
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <span
            className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] px-4 py-1.5 rounded-full"
            style={{
              background: "var(--accent-muted)",
              color: "var(--accent-light)",
              border: "1px solid var(--border-accent)",
              fontFamily: SANS,
              fontWeight: 500,
            }}
          >
            Egypt&apos;s B2B Hospitality Infrastructure
          </span>
        </motion.div>

        {/* Split layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left column — text + CTA */}
          <div>
            {/* Headline — stagger animation */}
            <h1
              className="text-[36px] md:text-[56px] lg:text-[64px] mb-6 leading-[1.05] tracking-tight"
              style={{ fontFamily: HEADING, fontWeight: 600, color: "#FFFFFF", letterSpacing: "-0.02em" }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="block"
              >
                Egypt&apos;s First Procurement
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.18 }}
                className="block"
                style={{ color: "var(--accent-light)" }}
              >
                Orchestration Platform
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.26 }}
                className="block"
              >
                for Hotels
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
              INVO marketplace connects hotels with verified suppliers. HotelsVendors automates procurement, ETA compliance, and escrow payments — one unified workflow.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Link
                href="/sandbox"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] rounded-xl transition-all duration-200 hover:scale-[1.03]"
                style={{
                  background: "linear-gradient(135deg, var(--accent-dark), var(--accent-light))",
                  color: "var(--accent-text, #FFFFFF)",
                  fontFamily: SANS,
                  fontWeight: 600,
                  boxShadow: "0 0 24px var(--accent-glow)",
                }}
              >
                Explore the Sandbox
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[14px] rounded-xl transition-all duration-200 hover:scale-[1.03]"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "#FFFFFF",
                  fontFamily: SANS,
                  fontWeight: 500,
                }}
              >
                Talk to Sales
              </Link>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center gap-2 text-[12px]"
              style={{ fontFamily: SANS, color: "rgba(255,255,255,0.5)", fontWeight: 400 }}
            >
              <ShieldCheck size={14} style={{ color: "var(--accent-light)" }} />
              Trusted by Orascom Hotels, Jaz, Pickalbatros + 200+ properties across Egypt
            </motion.div>
          </div>

          {/* Right column — flow diagram */}
          <div className="flex justify-center lg:justify-end pt-4">
            <HeroFlowDiagram />
          </div>
        </div>

        {/* Value prop row */}
        <div className="grid md:grid-cols-3 gap-4 mt-20">
          {[
            {
              title: "For Hotel Finance",
              desc: "Automated ETA e-invoicing, escrow payment protection — every invoice bankable.",
              icon: Receipt,
            },
            {
              title: "For Hotel Procurement",
              desc: "Browse INVO marketplace, AI-powered PO approval, real-time budget control.",
              icon: Store,
            },
            {
              title: "For Suppliers",
              desc: "List products on INVO, get paid on time via escrow — no more 90-day waits.",
              icon: Banknote,
            },
          ].map((card, i) => {
            const CardIcon = card.icon;
            return (
              <Reveal key={card.title} delay={i * 0.1}>
                <div
                  className="p-6 rounded-2xl h-full"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{
                      background: "var(--accent-muted)",
                      border: "1px solid var(--border-accent)",
                    }}
                  >
                    <CardIcon size={18} style={{ color: "var(--accent-light)" }} />
                  </div>
                  <h3
                    className="text-[15px] mb-2"
                    style={{ fontFamily: HEADING, fontWeight: 500, color: "#FFFFFF" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ fontFamily: SANS, color: "rgba(255,255,255,0.6)", fontWeight: 400 }}
                  >
                    {card.desc}
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
   2. PROBLEM SECTION — "The Old Way Is Broken"
   ═══════════════════════════════════════════════════════════ */
function ProblemSection() {
  const problems = [
    {
      title: "Manual POs",
      desc: "Your team sends purchase orders via WhatsApp and email. No audit trail. No budget control.",
      icon: ClipboardList,
    },
    {
      title: "60–180 Day Payments",
      desc: "Suppliers wait months for payment. They prioritize other buyers. Your supply chain suffers.",
      icon: Timer,
    },
    {
      title: "ETA Compliance Burden",
      desc: "Every invoice must be digitally signed, UUID-validated, and submitted to the Tax Authority. Manual work is error-prone.",
      icon: FileText,
    },
    {
      title: "Zero Spend Visibility",
      desc: "You don't know which properties are overpaying, which suppliers are unreliable, or where money leaks.",
      icon: Eye,
    },
  ];

  return (
    <section id="problem" className="py-24 md:py-32 relative overflow-hidden" style={{ background: BG }}>
      {/* Subtle warning glow */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full opacity-[0.04] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--warning) 0%, transparent 70%)" }}
      />
      <div className="max-w-5xl mx-auto px-6 relative">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>The Problem</SectionLabel>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}
            >
              Hotel Procurement Is Broken
            </h2>
            <div className="w-12 h-px mx-auto mb-5" style={{ background: "var(--warning)" }} />
            <p
              className="text-[14px] max-w-lg mx-auto"
              style={{ fontFamily: SANS, color: TEXT_SECONDARY, fontWeight: 400 }}
            >
              Egypt&apos;s coastal resorts lose 15–25% of procurement value to inefficiency. Here&apos;s what that looks like.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
            <Reveal key={p.title} delay={i * 0.08}>
              <div
                className="p-6 h-full rounded-2xl transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, rgba(202,138,4,0.04), rgba(202,138,4,0.01))",
                  border: "1px solid rgba(202,138,4,0.12)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{
                    background: "rgba(202,138,4,0.08)",
                    border: "1px solid rgba(202,138,4,0.15)",
                  }}
                >
                  <Icon size={18} style={{ color: "var(--warning)" }} />
                </div>
                <h3
                  className="text-[15px] mb-2"
                  style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}
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
            );
          })}
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
              style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}
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
                  <h3 className="text-[15px] mb-2" style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}>
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
              style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}
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
                            style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}
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
function AnimatedStat({ value, label, sub }: { value: string; label: string; sub: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayed, setDisplayed] = useState("0");
  const numOnly = value.replace(/[^0-9.]/g, "");
  const prefix = value.replace(numOnly, "");
  const target = parseFloat(numOnly);

  useEffect(() => {
    if (!isInView || !target) return;
    const duration = 1200;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayed(prefix + Math.round(target));
        clearInterval(timer);
      } else {
        setDisplayed(prefix + Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, target, prefix]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-[28px] md:text-[36px] mb-1 metric-value"
        style={{ fontFamily: SANS, fontWeight: 600, color: ACCENT }}
      >
        {isInView ? displayed : "0"}
      </div>
      <div className="text-[12px]" style={{ fontFamily: SANS, color: TEXT_SECONDARY }}>
        {label}
      </div>
      <div className="text-[10px] mt-0.5" style={{ fontFamily: SANS, color: TEXT_MUTED }}>
        {sub}
      </div>
    </div>
  );
}

function SocialProof() {
  const results = [
    {
      metric: "11 days → 4 hours",
      label: "Invoice processing time",
      icon: Zap,
      desc: "ETA-compliant invoicing eliminated manual data entry and tax authority submissions for pilot hotels.",
    },
    {
      metric: "90 days → 48 hours",
      label: "Supplier payment time",
      icon: DollarSign,
      desc: "Reverse factoring lets suppliers choose early payment while hotels keep Net-60 terms.",
    },
    {
      metric: "38% reduction",
      label: "Logistics cost per kilo",
      icon: TrendingUp,
      desc: "Hub-and-spoke delivery model consolidates Red Sea corridor shipments into fewer, fuller trucks.",
    },
  ];

  const trustedBy = [
    "Stella Di Mare", "Sunrise", "Jaz Hotels", "Baron Hotels",
    "Steigenberger", "Rixos", "Marriott", "Hilton",
  ];

  const stats = [
    { value: "680+", label: "Verified Suppliers", sub: "Across 6 governorates" },
    { value: "500+", label: "Active Hotels", sub: "From Sharm to North Coast" },
    { value: "12M+", label: "Monthly GMV (EGP)", sub: "Growing 30% MoM" },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: BG }}>
      {/* Subtle radial */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full opacity-[0.03] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(ellipse, var(--accent-base) 0%, transparent 70%)" }}
      />
      <div className="max-w-5xl mx-auto px-6 relative">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>Real Results, Real Hotels</SectionLabel>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}
            >
              Measurable Impact Across the Red Sea
            </h2>
            <div className="w-12 h-px mx-auto" style={{ background: ACCENT }} />
          </div>
        </Reveal>

        {/* Stats row with count-up */}
        <Reveal delay={0.05}>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto text-center mb-14">
            {stats.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
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

        {/* Metric result cards */}
        <div className="grid md:grid-cols-3 gap-5">
          {results.map((r, i) => {
            const Icon = r.icon;
            return (
            <Reveal key={r.label} delay={0.15 + i * 0.08}>
              <div className="surface-card p-6 h-full flex flex-col">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: ACCENT_MUTED, border: `1px solid ${ACCENT_BORDER}` }}
                >
                  <Icon size={18} style={{ color: ACCENT }} />
                </div>
                <div
                  className="text-[22px] font-semibold mb-1 metric-value"
                  style={{ fontFamily: SANS, color: TEXT }}
                >
                  {r.metric}
                </div>
                <div
                  className="text-[11px] font-medium uppercase tracking-wider mb-3"
                  style={{ fontFamily: SANS, color: ACCENT, letterSpacing: "0.08em" }}
                >
                  {r.label}
                </div>
                <p
                  className="text-[13px] leading-relaxed flex-1"
                  style={{ fontFamily: SANS, color: TEXT_MUTED, fontWeight: 400 }}
                >
                  {r.desc}
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
            style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}
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
