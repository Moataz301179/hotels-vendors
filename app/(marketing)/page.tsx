"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Receipt,
  Banknote,
  ShieldCheck,
  Store,
  ChevronRight,
  Building2,
  Landmark,
  Truck,
  BarChart3,
  Zap,
  Clock,
  CheckCircle2,
  TrendingUp,
  CheckCircle,
  Shield,
  CreditCard,
  Calendar,
  FileText,
  Send,
  Sparkles,
  CircuitBoard,
  Wallet,
  LineChart,
  ArrowUpRight,
  Play,
  ChevronDown,
  ChevronUp,
  Users,
  Globe,
  Lock,
  Cpu,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { DashboardMockup } from "@/components/marketing/dashboard-mockup";

// ─── Animated Counter Hook ─────────────────────────────────────────
function useCounter(end: number, duration = 2000, start = 0, inView = false) {
  const [count, setCount] = useState(start);
  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    let raf: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * (end - start) + start));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration, start, inView]);
  return count;
}

// ─── RevealSection ────────────────────────────────────────────────
function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
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

// ─── Scroll-Triggered Counter ──────────────────────────────────────
function Counter({ end, suffix = "", prefix = "", label, icon: Icon, color = "#39FF14" }: {
  end: number; suffix?: string; prefix?: string; label: string; icon: React.ElementType; color?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCounter(end, 2200, 0, inView);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
      className="rounded-2xl p-6 text-center hover-lift"
      style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      <Icon size={18} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
      <p className="text-[32px] font-bold text-white mb-1">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium">{label}</p>
    </motion.div>
  );
}

// ─── Sector Router Data ───────────────────────────────────────────
type SectorKey = "procurement" | "cashflow" | "fintech" | "ai";

interface SectorData {
  key: SectorKey;
  label: string;
  icon: React.ElementType;
  accent: string;
  accentMuted: string;
  hook: string;
  bullets: string[];
  placeholder: string;
  features: string[];
}

const SECTORS: SectorData[] = [
  {
    key: "procurement",
    label: "Digital Procurement",
    icon: CircuitBoard,
    accent: "#39FF14",
    accentMuted: "rgba(57,255,20,0.1)",
    hook: "AI-automated SaaS procurement that predicts demand, generates POs against budget ceilings, and enforces pre-occurrence blockades — before a single pound leaves your account.",
    bullets: [
      "14-day forward demand forecasting from occupancy curves",
      "Pre-occurrence budget blockades at property-branch level",
      "Automated three-way matching: PO + ETA UUID + GRN",
    ],
    placeholder: "Enter Hotel / Resort Group Name",
    features: ["AI Demand Forecasting", "Budget Blockades", "ETA Compliance", "Multi-Property"],
  },
  {
    key: "cashflow",
    label: "Cashflow Optimization",
    icon: Wallet,
    accent: "#22C55E",
    accentMuted: "rgba(34,197,94,0.1)",
    hook: "Stretch working capital to net-60+ without balance-sheet debt. Embedded reverse factoring pays suppliers in 24 hours while you keep your cash longer.",
    bullets: [
      "Net-60+ terms without balance-sheet liability",
      "Suppliers paid in 24 hours via competitive bidding",
      "Automated interest accrual and settlement reconciliation",
    ],
    placeholder: "Enter Company / Property Group Name",
    features: ["Net-60+ Terms", "24h Settlement", "Zero Debt", "Auto Accrual"],
  },
  {
    key: "fintech",
    label: "B2B Fintech",
    icon: LineChart,
    accent: "#3B82F6",
    accentMuted: "rgba(59,130,246,0.1)",
    hook: "The smartest fintech layer for Egyptian B2B. Every invoice passes tenant validation, ETA cryptographic verification, and automated three-way matching before entering the factoring pool.",
    bullets: [
      "SHA-256 cryptographic audit trail on every transition",
      "Non-recourse factoring with bank-direct settlement",
      "Automated scoring: PO + ETA UUID + Signed Delivery Note",
    ],
    placeholder: "Enter Financial Institution / Fund Name",
    features: ["Crypto Audit Trail", "Non-Recourse", "Bank-Direct", "Risk Scoring"],
  },
  {
    key: "ai",
    label: "AI Automation",
    icon: Cpu,
    accent: "#D4A843",
    accentMuted: "rgba(212,168,67,0.1)",
    hook: "Autonomous agents that run your entire procurement workflow — from demand prediction to settlement. Self-healing error handling, dead-letter queues, and real-time telemetry.",
    bullets: [
      "Autonomous agent orchestration with self-healing protocols",
      "Real-time anomaly detection across all transactions",
      "Dead-letter queue with automatic retry and escalation",
    ],
    placeholder: "Enter Enterprise / Group Name",
    features: ["Agent Orchestration", "Self-Healing", "Anomaly Detection", "Dead-Letter Queue"],
  },
];

// ─── Market Index Data ────────────────────────────────────────────
const marketIndex = [
  { product: "Fresh Chicken", unit: "kg", price: 68.5, change: "+2.1%", up: true },
  { product: "Beef Fillet", unit: "kg", price: 285.0, change: "+1.4%", up: true },
  { product: "Sea Bass", unit: "kg", price: 195.0, change: "-0.8%", up: false },
  { product: "Lamb Shoulder", unit: "kg", price: 245.0, change: "+3.2%", up: true },
  { product: "Olive Oil", unit: "L", price: 92.0, change: "+5.1%", up: true },
  { product: "Basmati Rice", unit: "kg", price: 48.5, change: "-1.2%", up: false },
  { product: "Fresh Milk", unit: "L", price: 22.0, change: "0.0%", up: true },
  { product: "Eggs (local)", unit: "30pc", price: 145.0, change: "+4.3%", up: true },
  { product: "Tomatoes", unit: "kg", price: 18.5, change: "-8.5%", up: false },
  { product: "Potatoes", unit: "kg", price: 12.0, change: "-2.1%", up: false },
];

const liveRates = [
  { label: "USD/EGP", value: "50.85", change: "-0.12", source: "CBE" },
  { label: "EUR/EGP", value: "54.20", change: "+0.34", source: "Market" },
  { label: "Inflation", value: "24.1%", change: "-0.8", source: "CAPMAS" },
  { label: "CBE Rate", value: "49.45", change: "-0.05", source: "CBE" },
];

const PIPELINE = [
  { step: "01", title: "AI Forecast & PO Generation", desc: "Engine predicts demand 14 days ahead from occupancy, events, and seasonality. Auto-generates POs against budget ceilings.", icon: BrainCircuit },
  { step: "02", title: "Authority Matrix Approval", desc: "POs route through your corporate authority matrix. Pre-occurrence budget blockades enforce spending limits.", icon: ShieldCheck },
  { step: "03", title: "ETA Invoice & GRN Clearance", desc: "Invoices digitally signed and submitted to Tax Authority. On-site GRN clearance triggers UUID validation.", icon: Receipt },
  { step: "04", title: "Logistics & Delivery", desc: "Shared-route consolidation. Multi-supplier load matching. 48-hour delivery guarantee to any Egyptian governorate.", icon: Truck },
  { step: "05", title: "Factoring & Settlement", desc: "Pre-cleared invoices enter competitive bidding. Funders bid. Supplier paid in 24hrs. Hotel keeps net-60+.", icon: Banknote },
];

const FEATURES = [
  { icon: BrainCircuit, title: "AI Demand Forecasting", desc: "14-day forward predictions analyzing occupancy curves, booked events, and historical consumption patterns across every property.", color: "#39FF14" },
  { icon: Receipt, title: "ETA E-Invoicing V2", desc: "Native Egyptian Tax Authority API pipeline. RSA 2048-bit digital signing with cryptographic UUID validation at point of goods receipt.", color: "#39FF14" },
  { icon: Truck, title: "Shared-Route Logistics", desc: "AI-driven route consolidation across 6 governorates. Up to 40% cost reduction via intelligent multi-supplier load matching.", color: "#39FF14" },
  { icon: Banknote, title: "Embedded Reverse Factoring", desc: "Competitive bidding among 4+ licensed grantors. Non-recourse, bank-direct settlement. Suppliers paid in 24 hours.", color: "#39FF14" },
  { icon: ShieldCheck, title: "FRA Anti-Fraud Compliance", desc: "Mandatory three-way matching: PO + ETA UUID + Signed Digital Delivery Note. SHA-256 cryptographic audit trail.", color: "#39FF14" },
  { icon: BarChart3, title: "Cost Control Engine", desc: "Real-time spend analysis, anomaly detection, and budget optimization across every property, department, and vendor.", color: "#39FF14" },
];

const TRUST_BADGES = [
  { icon: Shield, label: "ETA Phase 1 & 2 Compliant", desc: "Egyptian Tax Authority" },
  { icon: Lock, label: "AES-256-GCM Encryption", desc: "At-rest credential security" },
  { icon: Globe, label: "6 Governorates Covered", desc: "Coastal + Inland" },
  { icon: Zap, label: "24-Hour Settlement", desc: "Bank-direct factoring" },
];

// ─── Main Page ────────────────────────────────────────────────────
export default function HomePage() {
  const [activeSector, setActiveSector] = useState<SectorKey>("procurement");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.96]);
  const smoothOpacity = useSpring(heroOpacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(heroScale, { stiffness: 100, damping: 30 });

  const currentSector = SECTORS.find((s) => s.key === activeSector)!;
  const doubledIndex = [...marketIndex, ...marketIndex];

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/v1/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, sector: activeSector }),
      });
      setSubmitSuccess(true);
      setCompanyName("");
      setEmail("");
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch {
      // silent fail
    } finally {
      setIsSubmitting(false);
    }
  }, [companyName, email, activeSector]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <MarketingNav />

      {/* ── Market Index Ticker ── */}
      <div style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
        <div className="marquee-container">
          <div className="marquee-content">
            {doubledIndex.map((item, i) => (
              <div key={i} className="inline-flex items-center gap-2 px-5 py-2.5">
                <span className="text-[11px] text-white/30">{item.product}</span>
                <span className="text-[11px] font-medium text-white/60">EGP {item.price.toFixed(1)}/{item.unit}</span>
                <span className={`text-[10px] font-medium ${item.up ? "text-[#22C55E]" : "text-[#EF4444]"}`}>{item.change}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          HERO — Parallax Scroll + Animated Entry
          ═══════════════════════════════════════════ */}
      <section ref={heroRef} className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(57,255,20,0.04) 0%, transparent 70%)" }} />

        <motion.div className="relative z-10 mx-auto max-w-7xl px-6" style={{ opacity: smoothOpacity, scale: smoothScale }}>
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
                style={{ border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#39FF14" }} />
                <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Live · Egypt&apos;s B2B Hospitality Infrastructure</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[36px] sm:text-[48px] md:text-[58px] font-bold leading-[1.02] tracking-tight mb-6"
                style={{ color: "#ffffff" }}
              >
                AI-Automated Procurement.
                <br />
                <span className="text-gradient-lime">Smartest B2B Fintech.</span>
                <br />
                One Platform.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-[15px] text-white/50 leading-relaxed max-w-lg mb-3"
              >
                HotelsVendors is the all-in-one operating system that sits between your property&apos;s procurement desk, your supplier&apos;s balance sheet, and your funder&apos;s capital deployment engine — combining <strong className="text-white/70">AI-automated SaaS digital procurement</strong>, <strong className="text-white/70">cashflow optimization</strong>, and the <strong className="text-white/70">smartest B2B fintech</strong> layer for Egyptian hospitality.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="text-[13px] text-white/30 leading-relaxed max-w-lg mb-8"
              >
                No balance-sheet debt. No 180-day collection chases. No unverified paper. Just cryptographic compliance, automated settlement, and zero manual reconciliation.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>
                  Request Enterprise Access <ArrowRight size={15} />
                </Link>
                <Link href="/sandbox" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(57,255,20,0.25)", color: "#39FF14" }}>
                  <Play size={13} /> Try Sandbox
                </Link>
                <Link href="#platform" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                  Explore Platform
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center gap-6 flex-wrap"
              >
                <div className="flex -space-x-2">
                  {["AI", "ETA", "B2B", "HV"].map((a, i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "2px solid #000000" }}>
                      <span className="text-[8px] font-bold text-white/30">{a}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-white/25">
                  <span className="text-white/50 font-medium">Trusted by 680+ suppliers</span>
                  <br />across Egypt&apos;s hospitality sector
                </div>
              </motion.div>
            </div>

            <div className="lg:col-span-2">
              <DashboardMockup />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST BAR — Animated Scroll
          ═══════════════════════════════════════════ */}
      <RevealSection>
        <div className="py-10 border-y" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "#050505" }}>
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {TRUST_BADGES.map((badge, i) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(57,255,20,0.08)" }}>
                    <badge.icon size={16} style={{ color: "#39FF14" }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-white/60">{badge.label}</p>
                    <p className="text-[9px] text-white/25">{badge.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          SECTOR ROUTER — Dynamic Tab System
          ═══════════════════════════════════════════ */}
      <section id="platform" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center bottom, rgba(57,255,20,0.02) 0%, transparent 60%)" }} />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <RevealSection>
            <div className="text-center mb-10">
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2 block">All-in-One Platform</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-3">
                Four Engines. One Operating System.
              </h2>
              <p className="text-white/40 text-[14px] max-w-2xl mx-auto leading-relaxed">
                AI-automated procurement, cashflow optimization, B2B fintech, and autonomous AI agents — all running on a single multi-tenant platform with cryptographic ETA compliance.
              </p>
            </div>
          </RevealSection>

          {/* ── Sector Tabs ── */}
          <RevealSection>
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {SECTORS.map((sector) => {
                const isActive = activeSector === sector.key;
                const Icon = sector.icon;
                return (
                  <motion.button
                    key={sector.key}
                    onClick={() => setActiveSector(sector.key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative inline-flex items-center gap-2.5 px-5 py-3 rounded-xl text-[13px] font-medium transition-all duration-200"
                    style={{
                      backgroundColor: isActive ? sector.accentMuted : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isActive ? sector.accent + "40" : "rgba(255,255,255,0.06)"}`,
                      color: isActive ? sector.accent : "rgba(255,255,255,0.5)",
                    }}
                  >
                    <Icon size={16} />
                    {sector.label}
                    {isActive && (
                      <motion.div
                        layoutId="sector-indicator"
                        className="absolute -bottom-px left-3 right-3 h-[2px] rounded-full"
                        style={{ backgroundColor: sector.accent }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </RevealSection>

          {/* ── Dynamic Sector Content ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSector}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="grid lg:grid-cols-5 gap-6 items-start">
                {/* Left: Hook + Bullets */}
                <div className="lg:col-span-3 rounded-2xl p-8" style={{ backgroundColor: "#0a0a0a", border: `1px solid ${currentSector.accent}15` }}>
                  <div className="flex items-center gap-3 mb-5">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: currentSector.accentMuted }}
                    >
                      <currentSector.icon size={22} style={{ color: currentSector.accent }} />
                    </motion.div>
                    <div>
                      <h3 className="text-[18px] font-bold text-white">{currentSector.label}</h3>
                      <p className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: currentSector.accent }}>Your Workflow, Re-Engineered</p>
                    </div>
                  </div>

                  <p className="text-[15px] text-white/60 leading-relaxed mb-6">
                    {currentSector.hook}
                  </p>

                  <div className="space-y-3 mb-8">
                    {currentSector.bullets.map((bullet, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                        className="flex items-start gap-3"
                      >
                        <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0" style={{ backgroundColor: currentSector.accentMuted }}>
                          <CheckCircle size={12} style={{ color: currentSector.accent }} />
                        </div>
                        <span className="text-[13px] text-white/50 leading-relaxed">{bullet}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentSector.features.map((f) => (
                      <span key={f} className="text-[10px] px-2.5 py-1 rounded-full font-medium" style={{ backgroundColor: currentSector.accentMuted, color: currentSector.accent }}>
                        {f}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/register?sector=${activeSector}`}
                    className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.15)]"
                    style={{ backgroundColor: currentSector.accent, color: "#000000" }}
                  >
                    Get Started with {currentSector.label} <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Right: Signup Form */}
                <div className="lg:col-span-2 rounded-2xl p-6" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <h4 className="text-[14px] font-bold text-white mb-1">Request Access</h4>
                  <p className="text-[11px] text-white/30 mb-5">We&apos;ll match you to the right onboarding flow.</p>

                  {submitSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="rounded-xl p-5 text-center"
                      style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}
                    >
                      <CheckCircle2 size={28} className="mx-auto mb-3" style={{ color: "#22C55E" }} />
                      <p className="text-[13px] font-medium text-white mb-1">Application Received</p>
                      <p className="text-[11px] text-white/40">Our team will contact you within 24 hours.</p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3">
                      <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1.5 block">Company / Property</label>
                        <input
                          type="text"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder={currentSector.placeholder}
                          className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/15 outline-none transition-all focus:ring-1"
                          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                          onFocus={(e) => { e.target.style.borderColor = currentSector.accent + "40"; }}
                          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1.5 block">Work Email</label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@company.com"
                          className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/15 outline-none transition-all focus:ring-1"
                          style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                          onFocus={(e) => { e.target.style.borderColor = currentSector.accent + "40"; }}
                          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isSubmitting || !companyName.trim() || !email.trim()}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{ backgroundColor: currentSector.accent, color: "#000000" }}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                            Submitting…
                          </span>
                        ) : (
                          <>Submit Application <Send size={13} /></>
                        )}
                      </button>
                      <p className="text-[10px] text-white/20 text-center">
                        Engine: <span className="font-medium" style={{ color: currentSector.accent }}>{currentSector.label}</span> · No credit card required
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          ANIMATED STATS
          ═══════════════════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Counter end={680} suffix="+" label="Verified Suppliers" icon={Store} />
            <Counter end={94} suffix="%" label="Forecast Accuracy" icon={TrendingUp} />
            <Counter end={24} suffix="h" label="Supplier Settlement" icon={Clock} />
            <Counter end={40} suffix="%" label="Logistics Cost Reduction" icon={Truck} />
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          THREE PILLARS — Staggered Scroll Reveal
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="text-center mb-14">
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2 block">All-in-One Platform</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-4">
                Procurement + Fintech + AI.<br />One Settlement Engine.
              </h2>
              <p className="text-white/40 text-[14px] max-w-2xl mx-auto leading-relaxed">
                Every transaction simultaneously serves the hotel&apos;s cashflow mandate, the supplier&apos;s liquidity requirement, and the funder&apos;s asset-quality threshold — with zero manual reconciliation.
              </p>
            </div>
          </RevealSection>

          <div className="grid lg:grid-cols-3 gap-5">
            {[
              { icon: CircuitBoard, title: "AI-Automated Procurement", subtitle: "The Engine", desc: "Predict demand 14 days ahead. Auto-generate POs against budget ceilings. Enforce pre-occurrence blockades. Every purchase order is validated before it leaves your desk.", href: "/register", cta: "Start Procurement", color: "#39FF14" },
              { icon: Wallet, title: "Cashflow Optimization", subtitle: "The Capital", desc: "Net-60+ working capital without balance-sheet debt. Suppliers paid in 24 hours via competitive reverse factoring. You keep your cash longer.", href: "/register", cta: "Optimize Cashflow", color: "#22C55E" },
              { icon: LineChart, title: "B2B Smartest Fintech", subtitle: "The Shield", desc: "Every invoice passes tenant validation, ETA cryptographic UUID verification, and automated three-way matching. SHA-256 audit trail on every transition.", href: "/register", cta: "Deploy Capital", color: "#3B82F6" },
            ].map((role, i) => (
              <RevealSection key={role.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="rounded-2xl p-0 overflow-hidden h-full"
                  style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="h-1.5" style={{ background: `linear-gradient(to right, ${role.color}, ${role.color}88)` }} />
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${role.color}15` }}>
                        <role.icon size={22} style={{ color: role.color }} />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white">{role.title}</h3>
                        <p className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: role.color }}>{role.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-[12px] text-white/40 leading-relaxed mb-6">{role.desc}</p>
                    <Link href={role.href} className="inline-flex items-center gap-1.5 text-[11px] font-semibold py-2.5 px-4 rounded-xl transition-all" style={{ color: role.color, border: `1px solid ${role.color}30` }}>
                      {role.cta} <ArrowRight size={12} />
                    </Link>
                  </div>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          INFRASTRUCTURE & COMPLIANCE
          ═══════════════════════════════════════════ */}
      <section className="py-20" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="text-center mb-14">
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2 block">Infrastructure & Compliance</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-4">
                Regulatory Shield. Settlement Engine.<br />Cryptographic Audit Trail.
              </h2>
            </div>
          </RevealSection>

          <div className="grid lg:grid-cols-3 gap-5">
            {[
              { icon: <FileText size={18} style={{ color: "#39FF14" }} />, title: "ETA V2 API Pipeline", subtitle: "Zero-Exposure Regulatory Shield", desc: "Direct integration with the Egyptian Tax Authority&apos;s e-invoicing API. Cryptographic UUID validation fires the millisecond goods arrive at the property. Automated RSA 2048-bit digital signing.", badge: "ETA UUID · RSA-2048 · Phase 1 & 2", badgeIcon: <Shield size={13} style={{ color: "#39FF14" }} />, bg: "rgba(57,255,20,0.1)" },
              { icon: <CreditCard size={18} style={{ color: "#22C55E" }} />, title: "Standalone Payment & Clearing", subtitle: "Bank-Direct Settlement Engine", desc: "Capital routes programmatically from funder desks straight to supplier IBANs — no intermediary accounts, no manual wire approvals. Automated interest accruals and settlement reconciliation.", badge: "Programmatic Routing · Auto Accrual", badgeIcon: <Zap size={13} style={{ color: "#22C55E" }} />, bg: "rgba(34,197,94,0.1)" },
              { icon: <Shield size={18} style={{ color: "#3B82F6" }} />, title: "Institutional Alignment", subtitle: "Compliance & Security Frameworks", desc: "Built for institutional-grade deployment. I-Score Assessment Readiness, FRA Anti-Fraud Compliance, and alignment against ISO/IEC 27001 & SOC 2 Type II control frameworks.", badges: ["I-Score Ready", "FRA Anti-Fraud", "ISO 27001", "SOC 2 Type II"], bg: "rgba(59,130,246,0.1)" },
            ].map((card, i) => (
              <RevealSection key={card.title} delay={i * 0.1}>
                <motion.div whileHover={{ y: -3 }} className="rounded-2xl p-6 h-full" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg }}>
                      {card.icon}
                    </div>
                    <div>
                      <h3 className="text-[14px] font-bold text-white">{card.title}</h3>
                      <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.3)" }}>{card.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-white/40 leading-relaxed mb-4">{card.desc}</p>
                  {"badges" in card && card.badges ? (
                    <div className="space-y-1.5">
                      {card.badges.map((badge, j) => (
                        <div key={j} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                          <CheckCircle size={11} style={{ color: "#3B82F6" }} />
                          <span className="text-[10px] text-white/40">{badge}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                      {card.badgeIcon}
                      <span className="text-[10px] text-white/25">{card.badge}</span>
                    </div>
                  )}
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          PLATFORM CAPABILITIES — Scroll Reveal Grid
          ═══════════════════════════════════════════ */}
      <section className="py-20" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="mb-10">
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-1 block">Platform Capabilities</span>
              <h2 className="text-[26px] font-bold text-white">Six Infrastructure Pillars</h2>
            </div>
          </RevealSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <RevealSection key={f.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -3, borderColor: "rgba(57,255,20,0.2)" }}
                  className="rounded-2xl p-6 h-full"
                  style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", transitionDelay: `${i * 60}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                    <f.icon size={20} style={{ color: "#39FF14" }} />
                  </div>
                  <h3 className="text-[14px] font-bold mb-2 text-white">{f.title}</h3>
                  <p className="text-[12px] text-white/40 leading-relaxed">{f.desc}</p>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — Staggered Pipeline
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="text-center mb-12">
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-1 block">Operational Workflow</span>
              <h2 className="text-[26px] font-bold text-white">From Forecast to Settlement</h2>
            </div>
          </RevealSection>
          <div className="grid md:grid-cols-5 gap-4">
            {PIPELINE.map((step, i) => (
              <RevealSection key={step.step} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-6 text-center h-full"
                  style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="text-[28px] font-bold leading-none mb-3" style={{ color: "rgba(57,255,20,0.08)" }}>{step.step}</div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(57,255,20,0.08)", border: "1px solid rgba(57,255,20,0.12)" }}>
                    <step.icon size={18} style={{ color: "#39FF14" }} />
                  </div>
                  <h3 className="text-[13px] font-bold mb-2 text-white">{step.title}</h3>
                  <p className="text-[11px] text-white/35 leading-relaxed">{step.desc}</p>
                  {i < PIPELINE.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-2.5 text-white/10">
                      <ArrowRight size={16} />
                    </div>
                  )}
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          CTA — Final Conversion
          ═══════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(57,255,20,0.05) 0%, transparent 70%)" }} />
        <div className="mx-auto max-w-7xl px-6 text-center relative">
          <RevealSection>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2 block">Enterprise Onboarding</span>
              <h2 className="text-[clamp(28px,4vw,42px)] font-bold mb-5 tracking-tight text-white">
                Your Procurement Infrastructure Shouldn&apos;t<br />Depend on Spreadsheets
              </h2>
              <p className="text-[14px] text-white/40 mb-8 leading-relaxed max-w-lg mx-auto">
                AI-automated procurement. Cashflow optimization. The smartest B2B fintech. All in one platform — with cryptographic ETA compliance, automated settlement, and zero manual reconciliation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="/sandbox"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]"
                  style={{ backgroundColor: "#39FF14", color: "#000000" }}
                >
                  Try Sandbox Free <ArrowRight size={15} />
                </motion.a>
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]"
                  style={{ border: "1px solid rgba(57,255,20,0.25)", color: "#39FF14" }}
                >
                  Request Enterprise Access
                </motion.a>
                <motion.a
                  href="/marketplace"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                >
                  <Sparkles size={14} /> Explore Marketplace
                </motion.a>
              </div>
              <p className="text-[10px] text-white/20 mt-6">No credit card required · 14-day enterprise trial · Dedicated onboarding</p>
            </motion.div>
          </RevealSection>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
