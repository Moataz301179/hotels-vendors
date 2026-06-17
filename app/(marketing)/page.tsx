"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowRight,
  BrainCircuit,
  Receipt,
  Banknote,
  ShieldCheck,
  Store,
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
  FileText,
  Send,
  Sparkles,
  CircuitBoard,
  Wallet,
  LineChart,
  Play,
  Cpu,
  Server,
  ArrowUpRight,
  MoveRight,
  FileCheck,
  Fingerprint,
  Stamp,
  ScanLine,
  MonitorPlay,
  Video,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { PublicChatbot } from "@/components/ai-assistant/public-chatbot";
import { HotelDashboardMockup } from "@/components/marketing/hotel-dashboard-mockup";
import { SupplierDashboardMockup } from "@/components/marketing/supplier-dashboard-mockup";
import { FunderDashboardMockup } from "@/components/marketing/funder-dashboard-mockup";
import { LogisticsDashboardMockup } from "@/components/marketing/logistics-dashboard-mockup";
import { IPadFrame } from "@/components/marketing/ipad-frame";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { SectorVisual } from "@/components/marketing/sector-visual";
import { PillarVisual } from "@/components/marketing/pillar-visual";

// ─── RevealSection ────────────────────────────────────────────────
function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
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
    accent: "#84cc16",
    accentMuted: "rgba(132,204,22,0.1)",
    hook: "Cashflow preservation engine, not an administrative expense. Enforce strict pre-occurrence budget blockades at the resort branch level while stretching working capital cycles to net-90+ without taking on corporate debt.",
    bullets: [
      "14-day forward demand forecasting from occupancy curves, events, and seasonality",
      "Pre-occurrence budget blockades at property-branch-department level",
      "Automated three-way matching: PO + ETA UUID + Signed Digital GRN",
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
    hook: "Suppliers get paid in 24 hours. You keep net-60+. No more chasing decentralized hotel properties across regional clusters for 180 days. On-site GRN validation unlocks non-recourse, bank-direct early payment factoring — programmatically.",
    bullets: [
      "Net-60+ terms without balance-sheet liability — off-balance-sheet by design",
      "Suppliers paid in 24 hours via competitive bidding among licensed grantors",
      "Automated interest accrual, settlement reconciliation, and late-repayment protocols",
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
    hook: "Pre-cleared, high-velocity corporate deal flow — not unverified, paper-shuffled SME invoices. Every asset passes tenant validation, ETA cryptographic UUID verification, and automated three-way matching before entering your bidding pool.",
    bullets: [
      "SHA-256 cryptographic audit trail on every transaction state transition",
      "Non-recourse factoring with bank-direct IBAN settlement — no intermediary accounts",
      "AI-driven risk scoring: hotel creditworthiness, repayment velocity, sector concentration",
    ],
    placeholder: "Enter Financial Institution / Fund Name",
    features: ["Crypto Audit Trail", "Non-Recourse", "Bank-Direct", "Risk Scoring"],
  },
  {
    key: "ai",
    label: "AI Automation",
    icon: Cpu,
    accent: "#6366f1",
    accentMuted: "rgba(99,102,241,0.1)",
    hook: "Autonomous agents running your entire procurement workflow — from demand prediction to settlement. Self-healing error handling, dead-letter queues with automatic retry and escalation, and real-time telemetry across every transaction.",
    bullets: [
      "Autonomous agent orchestration with self-healing protocols and circuit-breaker patterns",
      "Real-time anomaly detection across all transactions — pricing, volume, velocity",
      "Dead-letter queue with automatic retry, escalation, and human-in-the-loop fallback",
    ],
    placeholder: "Enter Enterprise / Group Name",
    features: ["Agent Orchestration", "Self-Healing", "Anomaly Detection", "Dead-Letter Queue"],
  },
];

const PIPELINE = [
  { step: "01", title: "AI Forecast & PO Generation", desc: "Engine predicts demand 14 days ahead from occupancy, events, and seasonality. Auto-generates POs against budget ceilings with pre-occurrence blockades enforced.", icon: BrainCircuit },
  { step: "02", title: "Authority Matrix Approval", desc: "POs route through your corporate authority matrix. Pre-occurrence budget blockades enforce spending limits at property-branch-department level.", icon: ShieldCheck },
  { step: "03", title: "ETA Invoice & GRN Clearance", desc: "Invoices digitally signed with RSA-2048 and submitted to ETA in real-time. On-site GRN clearance triggers cryptographic UUID validation the millisecond goods land.", icon: Receipt },
  { step: "04", title: "Logistics & Delivery", desc: "Shared-route consolidation across 6 governorates. Multi-supplier load matching. 48-hour delivery guarantee. Cold-chain capable with real-time GPS.", icon: Truck },
  { step: "05", title: "Factoring & Settlement", desc: "Pre-cleared invoices enter competitive bidding pool. Funders bid. Supplier paid in 24hrs via bank-direct IBAN. Hotel keeps net-60+. Non-recourse.", icon: Banknote },
];

const FEATURES = [
  { icon: BrainCircuit, title: "AI Demand Forecasting", desc: "14-day forward predictions analyzing occupancy curves, booked events, and historical consumption patterns. Auto-generates POs against budget ceilings — before a single pound leaves your account.", color: "#84cc16" },
  { icon: Receipt, title: "ETA E-Invoicing V2 Pipeline", desc: "Direct Egyptian Tax Authority API integration. RSA 2048-bit digital signing with cryptographic UUID validation at point of goods receipt. Zero-exposure regulatory shield.", color: "#84cc16" },
  { icon: Truck, title: "Shared-Route Logistics", desc: "AI-driven route consolidation across 6 governorates. Multi-supplier load matching for significant cost reduction. Cold-chain capable with real-time GPS tracking.", color: "#84cc16" },
  { icon: Banknote, title: "Embedded Reverse Factoring", desc: "Competitive bidding among licensed grantors. Non-recourse, bank-direct IBAN settlement. Suppliers paid in 24 hours. Hotels preserve net-60+ working capital.", color: "#84cc16" },
  { icon: ShieldCheck, title: "FRA Anti-Fraud Compliance", desc: "Mandatory three-way matching gate: PO + ETA UUID + Signed Digital Delivery Note. SHA-256 cryptographic audit trail on every transaction state transition.", color: "#84cc16" },
  { icon: BarChart3, title: "Cost Control & Anomaly Detection", desc: "Real-time spend analysis, pricing deviation alerts, and budget optimization across every property, department, and vendor. AI flags anomalies before they compound.", color: "#84cc16" },
  { icon: Cpu, title: "Offline-First Data Resilience", desc: "Secure local caching stores serialized transaction arrays during connectivity drops. Auto-queued sync with ETA portal on reconnection — zero data loss, zero manual re-entry. Built for Egyptian hotel network realities.", color: "#84cc16" },
];

const TRUST_BADGES = [
  { icon: Shield, label: "ETA Phase 1 & 2 Compliant", desc: "Egyptian Tax Authority" },
  { icon: Server, label: "AES-256-GCM Encryption", desc: "At-rest credential security" },
  { icon: Building2, label: "6 Governorates Covered", desc: "Coastal + Inland" },
  { icon: Clock, label: "24-Hour Settlement", desc: "Bank-direct factoring" },
];

// ─── Main Page ────────────────────────────────────────────────────
export default function HomePage() {
  const [activeSector, setActiveSector] = useState<SectorKey>("procurement");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [cairoTime, setCairoTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCairoTime(now.toLocaleTimeString("en-EG", { hour12: false, timeZone: "Africa/Cairo" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentSector = SECTORS.find((s) => s.key === activeSector)!;

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
    <main className="min-h-screen">
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          MARKET INDEX TICKER
          ═══════════════════════════════════════════ */}
      <div className="fixed top-16 left-0 right-0 z-40 h-9 border-b border-white/10 bg-white/[0.03] backdrop-blur-xl flex items-center overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-4 whitespace-nowrap animate-ticker">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              {[
                { item: "Cairo", change: cairoTime, isClock: true },
                { item: "USD/EGP", change: "48.24", up: true, isRate: true },
                { item: "EUR/EGP", change: "58.34", up: false, isRate: true },
                { item: "Fresh Linen", change: "+2.4%", up: true },
                { item: "Industrial Detergent", change: "-1.1%", up: false },
                { item: "Kitchenware Bulk", change: "+0.8%", up: true },
                { item: "Pool Chemicals", change: "-0.5%", up: false },
                { item: "Guest Amenities", change: "+1.2%", up: true },
                { item: "HVAC Filters", change: "+0.3%", up: true },
                { item: "CBE Lending Rate", change: "20.0%", up: false, isRate: true },
                { item: "Inflation (May)", change: "14.6%", up: false, isRate: true },
                { item: "Avg Factoring", change: "1.85%", up: true, isRate: true },
              ].map((ticker) => (
                <div key={ticker.item} className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">{ticker.item}</span>
                  {ticker.isClock ? (
                    <span className="text-[10px] font-mono font-bold text-white/70">{ticker.change}</span>
                  ) : (
                    <span className={`text-[10px] font-mono font-bold ${ticker.up ? "text-green-400" : "text-red-400"}`}>
                      {ticker.change} {ticker.isRate ? "○" : (ticker.up ? "▲" : "▼")}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          HERO — B2B Value Prop + iPad Sector Dashboard
          ═══════════════════════════════════════════ */}
      <section className="relative pt-32 sm:pt-36 pb-12 sm:pb-20 overflow-hidden">
        {/* Hero background image with overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-[0.03]"
            priority
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #000000 0%, transparent 30%, transparent 70%, #000000 100%)" }} />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.04) 0%, transparent 70%)" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          {/* Mobile-first grid: stacks on mobile, side-by-side on lg */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">
            {/* ── Left: Value Prop + CTAs ── */}
            <div className="lg:col-span-3 order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 sm:mb-6"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#84cc16" }} />
                    <span className="text-[9px] sm:text-[10px] text-white/50 font-medium uppercase tracking-wider">Egyptian Tax Authority — Direct E-Invoicing Integration</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[32px] sm:text-[48px] md:text-[60px] lg:text-[64px] leading-[1.0] tracking-tight mb-6"
                style={{ color: "#ffffff", fontWeight: 800 }}
              >
                <span className="text-gradient-lime">ETA-Compliant</span>
                <br />
                <span className="text-white/70 font-medium">by Design.</span>
                <br />
                Hospitality Procurement
                <br />
                <span className="text-white/70 font-medium">by Default.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-[15px] sm:text-[17px] text-white/60 leading-relaxed max-w-lg mb-8"
              >
                Egypt&apos;s first hospitality procurement platform natively integrated with the <strong>Egyptian Tax Authority e-invoicing API</strong>. Every invoice is RSA-2048 signed, UUID-validated, and submitted in real-time. AI-automated purchasing, shared-route logistics, and 24-hour supplier settlement — all ETA-compliant by design.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.3)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
                  Request Onboarding <ArrowRight size={16} />
                </Link>
                <Link href="/sandbox" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(132,204,22,0.4)", color: "#84cc16" }}>
                  <Play size={15} /> Explore Interactive Sandbox
                </Link>
              </motion.div>

              {/* Social proof — honest, no fake numbers */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center gap-4 sm:gap-6 flex-wrap"
              >
                <div className="text-[9px] sm:text-[10px] text-white/40 leading-tight">
                  <span className="text-white/50 font-medium">Built for Egypt&apos;s hospitality sector</span>
                  <br /><span className="text-white/20">Red Sea coastal properties · Cairo · Alexandria · North Coast</span>
                </div>
              </motion.div>
            </div>

            {/* ── Right: iPad-Framed Sector Dashboard ── */}
            <div className="lg:col-span-2 order-2">
              <HeroVisual>
                {/* Sector tabs — horizontal scroll on mobile */}
                <div className="flex gap-1.5 sm:gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {[
                  { key: "procurement" as SectorKey, label: "Hotel", icon: Building2, accent: "#84cc16" },
                  { key: "cashflow" as SectorKey, label: "Supplier", icon: Store, accent: "#22C55E" },
                  { key: "fintech" as SectorKey, label: "Funder", icon: Landmark, accent: "#3B82F6" },
                  { key: "ai" as SectorKey, label: "Logistics", icon: Truck, accent: "#D4A843" },
                ].map((tab) => {
                  const isActive = activeSector === tab.key;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setActiveSector(tab.key)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] sm:text-[11px] font-medium whitespace-nowrap transition-all flex-shrink-0"
                      style={{
                        backgroundColor: isActive ? tab.accent + "15" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isActive ? tab.accent + "40" : "rgba(255,255,255,0.06)"}`,
                        color: isActive ? tab.accent : "rgba(255,255,255,0.4)",
                      }}
                    >
                      <tab.icon size={12} />
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* iPad Frame with sector dashboard */}
              <AnimatePresence mode="wait">
                {activeSector === "procurement" && (
                  <motion.div key="procurement" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <IPadFrame accentColor="#84cc16">
                      <HotelDashboardMockup />
                    </IPadFrame>
                  </motion.div>
                )}
                {activeSector === "cashflow" && (
                  <motion.div key="cashflow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <IPadFrame accentColor="#22C55E">
                      <SupplierDashboardMockup />
                    </IPadFrame>
                  </motion.div>
                )}
                {activeSector === "fintech" && (
                  <motion.div key="fintech" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <IPadFrame accentColor="#3B82F6">
                      <FunderDashboardMockup />
                    </IPadFrame>
                  </motion.div>
                )}
                {activeSector === "ai" && (
                  <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <IPadFrame accentColor="#D4A843">
                      <LogisticsDashboardMockup />
                    </IPadFrame>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Honest label — not "Live" */}
              <p className="text-[9px] text-white/15 text-center mt-3">
                Dashboard preview — illustrative interface
              </p>
              </HeroVisual>
              </div>

          </div>

          {/* ── Below Hero: Platform capabilities summary ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10 sm:mt-14">
            {/* Compliance & Security */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="rounded-2xl p-4"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={12} style={{ color: "#84cc16" }} />
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Compliance & Security</span>
              </div>
              <div className="space-y-2">
                {[
                  { icon: Shield, label: "ETA Phase 1 & 2 Compliant", desc: "Egyptian Tax Authority" },
                  { icon: Server, label: "AES-256-GCM Encryption", desc: "At-rest credential security" },
                  { icon: FileText, label: "SHA-256 Audit Trail", desc: "Every transaction state" },
                  { icon: Zap, label: "ISO 27001 / SOC 2 Ready", desc: "Institutional-grade security" },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
                    <badge.icon size={10} style={{ color: "#84cc16" }} />
                    <div>
                      <p className="text-[9px] text-white/50 font-medium">{badge.label}</p>
                      <p className="text-[7px] text-white/20">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Platform Features */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="rounded-2xl p-4"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <BrainCircuit size={12} style={{ color: "#84cc16" }} />
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Platform Capabilities</span>
              </div>
              <div className="space-y-2">
                {[
                  "AI demand forecasting (14-day forward)",
                  "Automated PO generation & budget blockades",
                  "ETA e-invoicing with RSA-2048 signing",
                  "Embedded reverse factoring",
                  "Shared-route logistics consolidation",
                  "Real-time anomaly detection",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 p-1.5 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
                    <CheckCircle size={9} style={{ color: "#84cc16" }} />
                    <p className="text-[9px] text-white/40">{item}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Quick CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="rounded-2xl p-4"
              style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={12} style={{ color: "#84cc16" }} />
                <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">Get Started</span>
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed mb-4">
                Explore the platform with our interactive sandbox or request institutional onboarding for your property group.
              </p>
              <div className="space-y-2">
                <Link href="/sandbox" className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[10px] font-semibold rounded-lg transition-all" style={{ backgroundColor: "rgba(132,204,22,0.1)", color: "#84cc16", border: "1px solid rgba(132,204,22,0.15)" }}>
                  <Play size={10} /> Explore Interactive Sandbox
                </Link>
                <Link href="/register" className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-[10px] font-semibold rounded-lg transition-all" style={{ backgroundColor: "rgba(132,204,22,0.1)", color: "#84cc16", border: "1px solid rgba(132,204,22,0.15)" }}>
                  Request Onboarding <ArrowRight size={10} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST BAR
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
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(132,204,22,0.15)" }}>
                    <badge.icon size={16} style={{ color: "#84cc16" }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-medium text-white/60">{badge.label}</p>
                    <p className="text-[9px] text-white/40">{badge.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          INTEGRATION PARTNERS
          ═══════════════════════════════════════════ */}
      <RevealSection>
        <div className="py-14" style={{ backgroundColor: "#030303" }}>
          <div className="mx-auto max-w-7xl px-6">
            <p className="text-[9px] font-medium text-white/20 uppercase tracking-[0.15em] mb-6 text-center">Integrated Payment & Fintech Partners</p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {[
                { name: "Paymob", desc: "Payment aggregation" },
                { name: "Fawry", desc: "Bill presentment & payments" },
                { name: "valU", desc: "BNPL & consumer finance" },
                { name: "valU B2B", desc: "Business financing" },
                { name: "CIB", desc: "Corporate banking" },
              ].map((partner) => (
                <div key={partner.name} className="flex flex-col items-center gap-1.5">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>{partner.name}</span>
                  </div>
                  <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>{partner.desc}</span>
                </div>
              ))}
            </div>
            <p className="text-[8px] text-white/15 text-center mt-6 max-w-xl mx-auto leading-relaxed">
              HotelsVendors integrates with Egypt&apos;s leading payment and fintech infrastructure. Partnerships provide seamless payment aggregation, BNPL options, business financing, and corporate banking connectivity — all within the procurement workflow.
            </p>
          </div>
        </div>
      </RevealSection>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          SECTOR ROUTER — Dynamic Tab System
          ═══════════════════════════════════════════ */}
      <section id="platform" className="py-20 relative overflow-hidden">
        {/* Section background image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-[0.02]"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #000000 0%, transparent 30%, transparent 70%, #000000 100%)" }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center bottom, rgba(132,204,22,0.02) 0%, transparent 60%)" }} />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <RevealSection>
            <div className="text-center mb-10">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.15em] mb-2 block">Platform Overview</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-3">
                Four Engines. One Operating System.
              </h2>
              <p className="text-white/50 text-[14px] max-w-2xl mx-auto leading-relaxed">
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
                    className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.15)]"
                    style={{ backgroundColor: currentSector.accent, color: "#000000" }}
                  >
                    Schedule {currentSector.label} Audit <ArrowRight size={14} />
                  </Link>
                </div>

                {/* Right: Visual + Signup Form */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                  <SectorVisual sector={activeSector} accentColor={currentSector.accent} />
                  
                  <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
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
                          Engine: <span className="font-medium" style={{ color: currentSector.accent }}>{currentSector.label}</span> · Data orchestration only · No liability for logistics or collection
                        </p>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          PLATFORM DEMO — Recording Preview
          ═══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "#050505" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(132,204,22,0.015) 0%, transparent 60%)" }} />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <RevealSection>
            <div className="text-center mb-10">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.15em] mb-2 block" style={{ color: "#84cc16" }}>Platform Demo</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-3">
                See It In Action.<br /><span className="text-gradient-lime">No Sign-Up Required.</span>
              </h2>
              <p className="text-white/50 text-[14px] max-w-2xl mx-auto leading-relaxed">
                Watch a guided walkthrough of the complete procurement-to-settlement workflow — from AI demand forecasting to bank-direct settlement — across all four stakeholder perspectives.
              </p>
            </div>
          </RevealSection>

          {/* Demo Video Mockup */}
          <RevealSection>
            <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden relative group cursor-pointer" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(132,204,22,0.1)" }}>
              {/* Top bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
                  </div>
                  <span className="text-[8px] ml-3" style={{ color: "rgba(255,255,255,0.15)" }}>hotelsvendors.com/demo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MonitorPlay size={12} style={{ color: "#84cc16" }} />
                  <span className="text-[8px]" style={{ color: "#84cc16" }}>Demo Recording</span>
                </div>
              </div>

              {/* Video preview area */}
              <Link href="/sandbox" className="relative block aspect-video flex items-center justify-center group" style={{ background: "linear-gradient(135deg, rgba(132,204,22,0.03), rgba(99,102,241,0.03))" }}>
                {/* Play button overlay */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="w-16 h-16 rounded-full flex items-center justify-center cursor-pointer transition-all group-hover:shadow-[0_0_40px_rgba(132,204,22,0.25)]"
                  style={{ backgroundColor: "rgba(132,204,22,0.15)", border: "2px solid rgba(132,204,22,0.3)" }}
                >
                  <Play size={24} style={{ color: "#84cc16", marginLeft: 2 }} />
                </motion.div>

                {/* Dashboard skeleton in background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.06]">
                  <div className="text-[120px] font-bold tracking-tight" style={{ color: "#84cc16" }}>HV</div>
                </div>

                {/* Preview badge */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className="px-2 py-1 rounded text-[8px] font-medium backdrop-blur-sm" style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#84cc16", border: "1px solid rgba(132,204,22,0.2)" }}>
                    Try the Sandbox →
                  </span>
                </div>

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-lg" />
              </Link>

              {/* Controls bar */}
              <div className="flex items-center justify-between px-4 py-2.5 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <MonitorPlay size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
                    <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>Full Walkthrough</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Video size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
                    <span className="text-[8px]" style={{ color: "rgba(255,255,255,0.2)" }}>4 Perspectives</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[9px]" style={{ color: "#84cc16" }}>Skip to section →</span>
                  <div className="flex gap-1">
                    {["Hotel", "Supplier", "Funder", "Logistics"].map((s) => (
                      <span key={s} className="text-[8px] px-2 py-0.5 rounded" style={{ backgroundColor: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)" }}>{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* Demo CTA */}
          <RevealSection>
            <div className="mt-8 text-center">
              <p className="text-[10px] mb-4" style={{ color: "rgba(255,255,255,0.2)" }}>
                Prefer to walk through it yourself?
              </p>
              <Link
                href="/sandbox"
                className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.15)]"
                style={{ backgroundColor: "#84cc16", color: "#000000" }}
              >
                Try Interactive Sandbox <ArrowRight size={14} />
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          THREE PILLARS — Staggered Scroll Reveal
          ═══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        {/* Section background image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-[0.015]"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #000000 0%, transparent 40%, transparent 60%, #000000 100%)" }} />
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="text-center mb-14">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.15em] mb-2 block">Integrated Solution</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-4">
                Procurement + Fintech + AI.<br />One Settlement Engine.
              </h2>
              <p className="text-white/50 text-[14px] max-w-2xl mx-auto leading-relaxed">
                Every transaction simultaneously serves the hotel&apos;s cashflow mandate, the supplier&apos;s liquidity requirement, and the funder&apos;s asset-quality threshold — with zero manual reconciliation.
              </p>
            </div>
          </RevealSection>

          <div className="grid lg:grid-cols-3 gap-5">
            {[
              { icon: CircuitBoard, title: "AI-Automated Procurement", subtitle: "The Engine", desc: "Cashflow preservation, not administrative overhead. Predict demand 14 days ahead. Auto-generate POs against budget ceilings. Enforce pre-occurrence blockades. Stretch working capital to net-90+ without corporate debt.", href: "/register", cta: "Schedule Procurement Audit", color: "#84cc16", type: "engine" as const },
              { icon: Wallet, title: "Cashflow Optimization", subtitle: "The Capital", desc: "Suppliers paid in 24 hours via competitive reverse factoring. You keep net-60+. No more 180-day collection chases across regional hotel clusters. On-site GRN validation unlocks non-recourse, bank-direct settlement.", href: "/register", cta: "Request Capital Assessment", color: "#22C55E", type: "capital" as const },
              { icon: LineChart, title: "B2B Smartest Fintech", subtitle: "The Shield", desc: "Pre-cleared, high-velocity corporate deal flow — not paper-shuffled SME invoices. Every asset passes tenant validation, ETA cryptographic UUID verification, and automated three-way matching. SHA-256 audit trail.", href: "/register", cta: "Schedule Integration Audit", color: "#3B82F6", type: "shield" as const },
            ].map((role, i) => (
              <RevealSection key={role.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="rounded-2xl p-0 overflow-hidden h-full"
                  style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <PillarVisual type={role.type} accentColor={role.color} />
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
                    <p className="text-[12px] text-white/50 leading-relaxed mb-6">{role.desc}</p>
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
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "#0a0a0a" }}>
        {/* Section background image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-[0.02]"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, #0a0a0a 0%, transparent 30%, transparent 70%, #0a0a0a 100%)" }} />
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="text-center mb-14">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.15em] mb-2 block">Infrastructure & Compliance</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-4">
                Regulatory Shield. Settlement Engine.<br />Cryptographic Audit Trail.
              </h2>
            </div>
          </RevealSection>

          <div className="grid lg:grid-cols-3 gap-5">
            {[
              { icon: <FileText size={18} style={{ color: "#84cc16" }} />, title: "ETA V2 API Pipeline", subtitle: "Zero-Exposure Regulatory Shield", desc: "Direct integration with the Egyptian Tax Authority&apos;s e-invoicing API. GS1/EGS product tax code mapping with Alphabetical Canonical flattening logic. Clear token handling rules. Cryptographic UUID validation fires the millisecond goods arrive at the property. Automated RSA 2048-bit digital signing. Phase 1 & 2 fully covered.", badges: ["GS1/EGS Tax Code Mapping", "Alphabetical Canonical Flattening", "ETA UUID · RSA-2048", "Phase 1 & 2 Compliant", "Clear Token Handling Rules"], bg: "rgba(132,204,22,0.1)" },
              { icon: <Banknote size={18} style={{ color: "#22C55E" }} />, title: "Standalone Payment & Clearing", subtitle: "Technology Layer — Not a Financial Intermediary", desc: "HotelsVendors is a technology orchestration layer. We never touch capital. Funders fund. Suppliers receive. Hotels owe. Capital routes programmatically from licensed grantor desks straight to supplier IBANs — no intermediary accounts, no manual wire approvals. Automated interest accruals, settlement reconciliation, and late-repayment protocols.", badges: ["Technology Layer Only", "No Capital Custody", "Programmatic Routing", "Bank-Direct IBAN Settlement", "Auto Accrual & Reconciliation"], bg: "rgba(34,197,94,0.1)" },
              { icon: <Shield size={18} style={{ color: "#3B82F6" }} />, title: "Institutional Alignment", subtitle: "Compliance & Security Frameworks", desc: "Built for institutional-grade deployment. I-Score Assessment Readiness with clean, real-time risk parameters. FRA Anti-Fraud Compliance via three-way matching gate: PO + ETA UUID + Signed Digital GRN. ISO/IEC 27001 and SOC 2 Type II audit-ready architecture.", badges: ["I-Score Ready", "FRA Anti-Fraud — 3-Way Match", "ISO 27001", "SOC 2 Type II"], bg: "rgba(59,130,246,0.1)" },
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
                  <p className="text-[12px] text-white/50 leading-relaxed mb-4">{card.desc}</p>
                  <div className="space-y-1.5">
                    {card.badges.map((badge, j) => (
                      <div key={j} className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: "rgba(255,255,255,0.02)" }}>
                        <CheckCircle size={11} style={{ color: "#3B82F6" }} />
                        <span className="text-[10px] text-white/40">{badge}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </RevealSection>
            ))}
          </div>

          {/* ── SLA & Resilience Badges ── */}
          <div className="mt-8 space-y-4">
            <RevealSection delay={0.35}>
              <div className="rounded-xl p-4 flex items-center gap-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(132,204,22,0.15)" }}>
                  <Server size={16} style={{ color: "#84cc16" }} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    <strong className="text-white/60">99.99% Uptime Target — Operational Integrity Protocol:</strong> Hosting infrastructure maintains redundant, multi-zone configurations with automated failover — keeping transaction data streams running without interruption. Architecture aligned with CIB and Paymob aggregator SLA expectations.
                  </p>
                </div>
              </div>
            </RevealSection>

            <RevealSection delay={0.4}>
              <div className="rounded-xl p-4 flex items-center gap-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(59,130,246,0.08)" }}>
                  <Cpu size={16} style={{ color: "#3B82F6" }} />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] text-white/40 leading-relaxed">
                    <strong className="text-white/60">Offline-First Resilience:</strong> The platform utilizes a secure local caching layer to store serialized transaction data arrays safely during connectivity interruptions. Queued submissions sync automatically with the ETA portal the moment connectivity recovers — zero data loss, zero manual re-entry.
                  </p>
                </div>
              </div>
            </RevealSection>
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
              <h2 className="text-[26px] font-bold text-white">Seven Infrastructure Pillars</h2>
            </div>
          </RevealSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, borderColor: "rgba(132,204,22,0.25)", boxShadow: "0 12px 40px rgba(132,204,22,0.06)" }}
                className="rounded-2xl p-6 h-full cursor-default group"
                style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(132,204,22,0.15)]" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                  <f.icon size={20} style={{ color: "#84cc16" }} />
                </div>
                <h3 className="text-[14px] font-bold mb-2 text-white transition-colors duration-300 group-hover:text-[#84cc16]">{f.title}</h3>
                <p className="text-[12px] text-white/50 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          AI AUTOMATION & CASHFLOW FORECAST
          ═══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "#030303" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(99,102,241,0.03) 0%, transparent 50%)" }} />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 70% 50%, rgba(132,204,22,0.02) 0%, transparent 50%)" }} />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <RevealSection>
            <div className="text-center mb-12">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.15em] mb-2 block" style={{ color: "#6366f1" }}>AI-Powered Intelligence</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-3">
                Autonomous Procurement.<br /><span className="text-gradient-lime">Cashflow Intelligence.</span>
              </h2>
              <p className="text-white/50 text-[14px] max-w-2xl mx-auto leading-relaxed">
                AI agents run continuously — predicting demand, forecasting cashflow, detecting anomalies, and orchestrating the entire procurement lifecycle without human intervention.
              </p>
            </div>
          </RevealSection>

          {/* AI Forecast Dashboard Simulation */}
          <RevealSection>
            <div className="rounded-2xl overflow-hidden mb-10" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(99,102,241,0.12)" }}>
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(99,102,241,0.08)" }}>
                <div className="flex items-center gap-2.5">
                  <BrainCircuit size={14} style={{ color: "#6366f1" }} />
                  <span className="text-[10px] font-medium" style={{ color: "#84cc16" }}>AI Forecast Engine — 14-Day Forward</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
                  <span className="text-[8px] font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>ACTIVE</span>
                </div>
              </div>

              <div className="p-5">
                {/* Consumption Forecast Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Forecasted Spend (14d)", value: "EGP 847,200", change: "+12.3% vs prior", sub: "6 categories · 4 properties", color: "#84cc16" },
                    { label: "Cashflow Position", value: "Net-62 days", change: "+8 days vs target", sub: "Working capital stretch", color: "#22C55E" },
                    { label: "Consumption Rate", value: "94.2%", change: "±2.1% variance", sub: "AI accuracy score", color: "#6366f1" },
                  ].map((kpi) => (
                    <div key={kpi.label} className="rounded-xl p-4" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                      <p className="text-[8px] font-medium uppercase tracking-wider mb-1.5" style={{ color: "rgba(255,255,255,0.2)" }}>{kpi.label}</p>
                      <p className="text-[22px] font-bold text-white mb-0.5">{kpi.value}</p>
                      <p className="text-[9px]" style={{ color: kpi.color }}>{kpi.change}</p>
                      <p className="text-[8px]" style={{ color: "rgba(255,255,255,0.15)" }}>{kpi.sub}</p>
                    </div>
                  ))}
                </div>

                {/* Category Spend Breakdown */}
                <div className="mb-5">
                  <p className="text-[9px] font-medium uppercase tracking-wider mb-3" style={{ color: "rgba(255,255,255,0.2)" }}>Forecasted Consumption by Category</p>
                  <div className="space-y-2">
                    {[
                      { cat: "F&B", pct: 38, value: "EGP 322K", color: "#84cc16" },
                      { cat: "Housekeeping", pct: 22, value: "EGP 186K", color: "#22C55E" },
                      { cat: "Engineering", pct: 16, value: "EGP 136K", color: "#3B82F6" },
                      { cat: "Amenities", pct: 13, value: "EGP 110K", color: "#D4A843" },
                      { cat: "Consumables", pct: 7, value: "EGP 59K", color: "#A855F7" },
                      { cat: "Capital Equipment", pct: 4, value: "EGP 34K", color: "#F97316" },
                    ].map((cat) => (
                      <div key={cat.cat} className="flex items-center gap-3">
                        <span className="text-[9px] w-24" style={{ color: "rgba(255,255,255,0.4)" }}>{cat.cat}</span>
                        <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.03)" }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: cat.color }}
                            initial={{ width: "0%" }}
                            whileInView={{ width: `${cat.pct}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                          />
                        </div>
                        <span className="text-[9px] font-mono w-20 text-right" style={{ color: "rgba(255,255,255,0.3)" }}>{cat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cashflow Timeline */}
                <div className="rounded-xl p-4" style={{ backgroundColor: "rgba(99,102,241,0.04)", border: "1px solid rgba(99,102,241,0.1)" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Wallet size={12} style={{ color: "#6366f1" }} />
                      <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.25)" }}>Cashflow Forecast — Next 60 Days</span>
                    </div>
                    <span className="text-[8px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#6366f1" }}>AI Generated</span>
                  </div>
                  <div className="flex items-end justify-between h-24 relative">
                    {[
                      { day: "Week 1", inflow: 80, outflow: 60 },
                      { day: "Week 2", inflow: 85, outflow: 45 },
                      { day: "Week 3", inflow: 70, outflow: 75 },
                      { day: "Week 4", inflow: 90, outflow: 50 },
                      { day: "Week 5", inflow: 75, outflow: 65 },
                      { day: "Week 6", inflow: 95, outflow: 40 },
                      { day: "Week 7", inflow: 60, outflow: 80 },
                      { day: "Week 8", inflow: 88, outflow: 55 },
                    ].map((w, i) => (
                      <div key={i} className="flex flex-col items-center gap-1 flex-1">
                        <div className="w-full flex items-end justify-center gap-0.5">
                          <div className="w-3 rounded-t-sm" style={{ height: `${w.inflow * 0.6}px`, backgroundColor: "#84cc16", opacity: 0.7 }} />
                          <div className="w-3 rounded-t-sm" style={{ height: `${w.outflow * 0.6}px`, backgroundColor: "#ef4444", opacity: 0.5 }} />
                        </div>
                        <span className="text-[6px]" style={{ color: "rgba(255,255,255,0.15)" }}>{w.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#84cc16", opacity: 0.7 }} />
                      <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>Inflow</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: "#ef4444", opacity: 0.5 }} />
                      <span className="text-[7px]" style={{ color: "rgba(255,255,255,0.2)" }}>Outflow</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealSection>

          {/* AI Agent Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">              {[
                { icon: BrainCircuit, title: "Demand Predictor", desc: "Analyzes occupancy curves, events, seasonality, and 12-month consumption history to forecast procurement needs with 94% accuracy.", color: "#84cc16" },
                { icon: Wallet, title: "Cashflow Optimizer", desc: "Monitors working capital cycles, suggests optimal payment timing, and auto-routes invoices to factoring pools when liquidity gaps are detected.", color: "#22C55E" },
                { icon: BarChart3, title: "Spending Analyzer", desc: "Real-time spend analysis across properties, departments, and vendors. Flags pricing deviations, budget anomalies, and optimization opportunities.", color: "#3B82F6" },
                { icon: Shield, title: "Compliance Guardian", desc: "Continuously validates ETA compliance, monitors regulatory changes, and ensures every invoice meets FRA anti-fraud requirements.", color: "#6366f1" },
              ].map((agent, i) => (
              <RevealSection key={agent.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -4, borderColor: agent.color + "30" }}
                  className="rounded-xl p-5 h-full"
                  style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: agent.color + "15" }}>
                    <agent.icon size={18} style={{ color: agent.color }} />
                  </div>
                  <h3 className="text-[13px] font-bold text-white mb-2">{agent.title}</h3>
                  <p className="text-[10px] leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{agent.desc}</p>
                </motion.div>
              </RevealSection>
            ))}
          </div>

          {/* CTA */}
          <RevealSection>
            <div className="mt-10 text-center">
              <Link
                href="/sandbox"
                className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all"
                style={{ backgroundColor: "rgba(99,102,241,0.1)", color: "#6366f1", border: "1px solid rgba(99,102,241,0.2)" }}
              >
                See AI Forecast in Sandbox <ArrowRight size={14} />
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — Staggered Pipeline
          ═══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        {/* Section background image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-[0.015]"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, #000000 0%, transparent 30%, transparent 70%, #000000 100%)" }} />
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="text-center mb-12">
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-1 block">Operational Workflow</span>
              <h2 className="text-[26px] font-bold text-white">From Forecast to Settlement</h2>
            </div>
          </RevealSection>
          <div className="grid md:grid-cols-5 gap-4 relative">
            {/* Connecting line between steps */}
            <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(to right, rgba(132,204,22,0.2), rgba(132,204,22,0.05), rgba(132,204,22,0.2))" }} />
            {PIPELINE.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, borderColor: "rgba(132,204,22,0.25)" }}
                className="rounded-2xl p-6 text-center h-full relative group"
                style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                {/* Step number - large background */}
                <div className="text-[32px] font-bold leading-none mb-3 transition-all duration-300 group-hover:opacity-100" style={{ color: "rgba(132,204,22,0.15)" }}>{step.step}</div>
                {/* Icon container with pulse animation */}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(132,204,22,0.15)]" style={{ backgroundColor: "rgba(132,204,22,0.15)", border: "1px solid rgba(132,204,22,0.12)" }}>
                  <step.icon size={18} style={{ color: "#84cc16" }} />
                </div>
                <h3 className="text-[13px] font-bold mb-2 text-white transition-colors duration-300 group-hover:text-[#84cc16]">{step.title}</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">{step.desc}</p>
                {/* Arrow connector */}
                {i < PIPELINE.length - 1 && (
                  <div className="hidden md:flex absolute top-[54px] -right-3 z-10 items-center justify-center w-6 h-6 rounded-full transition-all duration-300 group-hover:bg-[rgba(132,204,22,0.1)]" style={{ backgroundColor: "rgba(132,204,22,0.05)" }}>
                    <MoveRight size={12} style={{ color: "rgba(132,204,22,0.3)" }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          ETA INVOICE SAMPLE
          ═══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden" style={{ backgroundColor: "#050505" }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(132,204,22,0.015) 0%, transparent 60%)" }} />
        </div>
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <RevealSection>
            <div className="text-center mb-10">
              <span className="text-[11px] font-medium text-white/40 uppercase tracking-[0.15em] mb-2 block">ETA E-Invoice Sample</span>
              <h2 className="text-[clamp(24px,3.5vw,36px)] font-bold tracking-tight text-white mb-3">
                Real ETA-Compliant Invoice.<br /><span className="text-gradient-lime">RSA-2048 Signed. UUID Validated.</span>
              </h2>
              <p className="text-white/50 text-[14px] max-w-xl mx-auto leading-relaxed">
                Every invoice generated on HotelsVendors meets Egyptian Tax Authority Phase 1 & 2 requirements — with bilingual Arabic/English output, cryptographic signatures, and real-time submission.
              </p>
            </div>
          </RevealSection>

          <RevealSection>
            <div className="max-w-2xl mx-auto rounded-2xl overflow-hidden" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(132,204,22,0.12)" }}>
              {/* Invoice Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: "rgba(132,204,22,0.08)" }}>
                <div className="flex items-center gap-2.5">
                  <Fingerprint size={14} style={{ color: "#84cc16" }} />
                  <span className="text-[10px] font-medium" style={{ color: "#84cc16" }}>ETA UUID: 9b7e3f51-2a8d-4c6e-b0f1-8d3e5a7c9b0a</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Stamp size={11} style={{ color: "#22C55E" }} />
                  <span className="text-[9px] font-medium" style={{ color: "#22C55E" }}>RSA-2048 SIGNED</span>
                </div>
              </div>

              <div className="p-5">
                <div className="grid grid-cols-2 gap-6 mb-4">
                  {/* English Side */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <FileCheck size={12} style={{ color: "#84cc16" }} />
                      <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>English</span>
                    </div>
                    <div className="space-y-2 text-[10px]">
                      <div className="flex justify-between"><span className="text-white/30">Invoice #</span><span className="text-white/70 font-mono">HV-INV-00421</span></div>
                      <div className="flex justify-between"><span className="text-white/30">Issuer</span><span className="text-white/70">Egyptian Linen Co.</span></div>
                      <div className="flex justify-between"><span className="text-white/30">Buyer</span><span className="text-white/70">Steigenberger El Gouna</span></div>
                      <div className="flex justify-between"><span className="text-white/30">Amount</span><span className="text-white/70 font-mono">EGP 247,800.00</span></div>
                      <div className="flex justify-between"><span className="text-white/30">Tax</span><span className="text-white/70 font-mono">EGP 37,170.00 (14%)</span></div>
                      <div className="flex justify-between border-t pt-1.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}><span className="text-white/40 font-medium">Total</span><span className="text-white font-mono font-bold">EGP 284,970.00</span></div>
                    </div>
                  </div>

                  {/* Arabic Side */}
                  <div dir="rtl">
                    <div className="flex items-center gap-2 mb-3">
                      <ScanLine size={12} style={{ color: "#D4A843" }} />
                      <span className="text-[9px] font-medium uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>Arabic</span>
                    </div>
                    <div className="space-y-2 text-[10px]">
                      <div className="flex justify-between"><span className="text-white/30">رقم الفاتورة</span><span className="text-white/70 font-mono">HV-INV-00421</span></div>
                      <div className="flex justify-between"><span className="text-white/30">المورد</span><span className="text-white/70">الشركة المصرية للكتان</span></div>
                      <div className="flex justify-between"><span className="text-white/30">المشتري</span><span className="text-white/70">ستيجينبيرجر الجونة</span></div>
                      <div className="flex justify-between"><span className="text-white/30">المبلغ</span><span className="text-white/70 font-mono">٢٤٧,٨٠٠.٠٠ ج.م</span></div>
                      <div className="flex justify-between"><span className="text-white/30">الضريبة</span><span className="text-white/70 font-mono">٣٧,١٧٠.٠٠ ج.م (١٤%)</span></div>
                      <div className="flex justify-between border-t pt-1.5" style={{ borderColor: "rgba(255,255,255,0.06)" }}><span className="text-white/40 font-medium">الإجمالي</span><span className="text-white font-mono font-bold">٢٨٤,٩٧٠.٠٠ ج.م</span></div>
                    </div>
                  </div>
                </div>

                {/* ETA Status Bar */}
                <div className="mt-4 rounded-xl p-3 flex items-center justify-between" style={{ backgroundColor: "rgba(132,204,22,0.04)", border: "1px solid rgba(132,204,22,0.1)" }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "#84cc16" }} />
                    <span className="text-[10px] font-medium text-white/60">ETA Submission Status</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={10} style={{ color: "#22C55E" }} />
                      <span className="text-[9px]" style={{ color: "#22C55E" }}>Submitted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={10} style={{ color: "#22C55E" }} />
                      <span className="text-[9px]" style={{ color: "#22C55E" }}>UUID Validated</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 size={10} style={{ color: "#22C55E" }} />
                      <span className="text-[9px]" style={{ color: "#22C55E" }}>ACCEPTED</span>
                    </div>
                  </div>
                </div>

                {/* ETA Registration Info */}
                <div className="mt-3 rounded-xl p-3 flex items-center justify-between" style={{ backgroundColor: "rgba(59,130,246,0.04)", border: "1px solid rgba(59,130,246,0.1)" }}>
                  <div className="flex items-center gap-2">
                    <Fingerprint size={11} style={{ color: "#3B82F6" }} />
                    <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.5)" }}>
                      ETA Portal Registration: <strong className="text-white/60">Restaurants for E-Marketing</strong>
                    </span>
                  </div>
                  <span className="text-[8px] px-2 py-0.5 rounded font-medium" style={{ backgroundColor: "rgba(59,130,246,0.08)", color: "#3B82F6" }}>Tax ID: 704226146</span>
                </div>
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          CTA — Final Conversion
          ═══════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        {/* CTA background image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1920&q=80"
            alt=""
            fill
            className="object-cover opacity-[0.025]"
          />
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, #000000 40%, transparent 70%)" }} />
        </div>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(132,204,22,0.05) 0%, transparent 70%)" }} />
        <div className="mx-auto max-w-7xl px-6 text-center relative">
          <RevealSection>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.15em] mb-2 block">Enterprise Onboarding</span>
              <h2 className="text-[clamp(28px,4vw,42px)] font-bold mb-5 tracking-tight text-white">
                Your Procurement Infrastructure Shouldn&apos;t<br />Depend on Spreadsheets
              </h2>
              <p className="text-[14px] text-white/40 mb-8 leading-relaxed max-w-lg mx-auto">
                AI-automated procurement. Cashflow optimization. The smartest B2B fintech. All in one platform — with cryptographic ETA compliance, automated settlement, and zero manual reconciliation.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <motion.a
                  href="/register"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]"
                  style={{ backgroundColor: "#84cc16", color: "#000000" }}
                >
                  Request Institutional Onboarding <ArrowRight size={15} />
                </motion.a>
                <motion.a
                  href="/sandbox"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]"
                  style={{ border: "1px solid rgba(132,204,22,0.25)", color: "#84cc16" }}
                >
                  Explore Interactive Sandbox
                </motion.a>
                <motion.a
                  href="/marketplace"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]"
                  style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}
                >
                  <Sparkles size={14} /> View Marketplace
                </motion.a>
              </div>
              <p className="text-[10px] text-white/20 mt-6">Dedicated onboarding · Integration audit included · Zero liability for logistics or collection defaults</p>
            </motion.div>
          </RevealSection>
        </div>
      </section>

      <MarketingFooter />
      <PublicChatbot />
    </main>
  );
}