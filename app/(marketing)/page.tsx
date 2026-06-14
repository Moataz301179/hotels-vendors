"use client";

import Link from "next/link";
import { useRef, useState, useCallback } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { HotelDashboardMockup } from "@/components/marketing/hotel-dashboard-mockup";
import { SupplierDashboardMockup } from "@/components/marketing/supplier-dashboard-mockup";
import { FunderDashboardMockup } from "@/components/marketing/funder-dashboard-mockup";
import { LogisticsDashboardMockup } from "@/components/marketing/logistics-dashboard-mockup";
import { IPadFrame } from "@/components/marketing/ipad-frame";
import { HeroVisual } from "@/components/marketing/hero-visual";
import { SectorVisual } from "@/components/marketing/sector-visual";
import { PillarVisual } from "@/components/marketing/pillar-visual";

// ─── RevealSection ────────────────────────────────────────────────

// ─── RevealSection ────────────────────────────────────────────────

// ─── RevealSection ────────────────────────────────────────────────

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
    <main className="min-h-screen" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          MARKET INDEX TICKER
          ═══════════════════════════════════════════ */}
      <div className="fixed top-16 left-0 right-0 z-40 h-9 border-b border-white/10 bg-white/[0.03] backdrop-blur-xl flex items-center overflow-hidden shadow-[0_4px_30px_rgba(0,0,0,0.5)]" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-center gap-4 whitespace-nowrap animate-ticker">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-8 px-4">
              {[
                { item: "Fresh Linen", change: "+2.4%", up: true },
                { item: "Industrial Detergent", change: "-1.1%", up: false },
                { item: "Kitchenware Bulk", change: "+0.8%", up: true },
                { item: "Pool Chemicals", change: "-0.5%", up: false },
                { item: "Guest Amenities", change: "+1.2%", up: true },
                { item: "HVAC Filters", change: "+0.3%", up: true },
              ].map((ticker) => (
                <div key={ticker.item} className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-white/40 uppercase tracking-wider">{ticker.item}</span>
                  <span className={`text-[10px] font-mono font-bold ${ticker.up ? "text-green-400" : "text-red-400"}`}>
                    {ticker.change} {ticker.up ? "▲" : "▼"}
                  </span>
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.04) 0%, transparent 70%)" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          {/* Mobile-first grid: stacks on mobile, side-by-side on lg */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-10 items-start">
            {/* ── Left: Value Prop + CTAs ── */}
            <div className="lg:col-span-3 order-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-4 sm:mb-6"
                style={{ border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#84cc16" }} />
                <span className="text-[9px] sm:text-[10px] text-white/50 font-medium uppercase tracking-wider">Egypt&apos;s B2B Hospitality Infrastructure</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-[32px] sm:text-[48px] md:text-[60px] lg:text-[64px] leading-[1.0] tracking-tight mb-6"
                style={{ color: "#ffffff", fontWeight: 800 }}
              >
                Institutional-Grade<br />
                <span className="text-gradient-lime">Hospitality Rails.</span>
                <br />
                <span className="text-white/50 font-medium">Zero Debt. Absolute Compliance.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="text-[15px] sm:text-[17px] text-white/50 leading-relaxed max-w-lg mb-8"
              >
                HotelsVendors is the vertical operating system for Egyptian hospitality. We synchronize the <strong>HV Governance Layer</strong> with the <strong>INVO Infrastructure Engine</strong> to automate procurement, secure cashflow, and enforce ETA compliance at scale.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-wrap gap-3 mb-8"
              >
                <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-bold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.3)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
                  Deploy Infrastructure <ArrowRight size={16} />
                </Link>
                <Link href="/sandbox" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(132,204,22,0.4)", color: "#84cc16" }}>
                  <Play size={15} /> Launch Architecture Sandbox
                </Link>
              </motion.div>

              {/* Social proof — honest, no fake numbers */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="flex items-center gap-4 sm:gap-6 flex-wrap"
              >
                <div className="text-[9px] sm:text-[10px] text-white/25 leading-tight">
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
              <p className="text-[11px] text-white/35 leading-relaxed mb-4">
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
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(132,204,22,0.08)" }}>
                    <badge.icon size={16} style={{ color: "#84cc16" }} />
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
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center bottom, rgba(132,204,22,0.02) 0%, transparent 60%)" }} />

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
                  <p className="text-[12px] text-white/40 leading-relaxed mb-4">{card.desc}</p>
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
                <div className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(132,204,22,0.08)" }}>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <RevealSection key={f.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -3, borderColor: "rgba(132,204,22,0.2)" }}
                  className="rounded-2xl p-6 h-full"
                  style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", transitionDelay: `${i * 60}ms` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                    <f.icon size={20} style={{ color: "#84cc16" }} />
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
                  <div className="text-[28px] font-bold leading-none mb-3" style={{ color: "rgba(132,204,22,0.08)" }}>{step.step}</div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: "rgba(132,204,22,0.08)", border: "1px solid rgba(132,204,22,0.12)" }}>
                    <step.icon size={18} style={{ color: "#84cc16" }} />
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
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(132,204,22,0.05) 0%, transparent 70%)" }} />
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
    </main>
  );
}

      <MarketingFooter />
    </main>
  );
}
{ scale: 0.97 }}
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
    </main>
  );
}
