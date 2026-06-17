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
  ChevronLeft,
  ChevronRight,
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

// ─── Template Styling Constants ───────────────────────────────────
const ACCENT = "#0a1628";
const ACCENT_LIGHT = "#1a2744";
const EMERALD = "#10B981";

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
    accent: ACCENT,
    accentMuted: "rgba(10,22,40,0.15)",
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
    accent: EMERALD,
    accentMuted: "rgba(16,185,129,0.1)",
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
  const [taxId, setTaxId] = useState("");
  const [domainRole, setDomainRole] = useState("hotel");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [cairoTime, setCairoTime] = useState("");
  const [currentSlide, setCurrentSlide] = useState(1);
  const totalSlides = 2;

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCairoTime(now.toLocaleTimeString("en-EG", { hour12: false, timeZone: "Africa/Cairo" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev >= totalSlides ? 1 : prev + 1));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentSector = SECTORS.find((s) => s.key === activeSector)!;

  // Quick-access form (no taxId required)
  const handleQuickSubmit = useCallback(async (e: React.FormEvent) => {
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

  // Full onboarding form (includes taxId + domainRole)
  const handleFullSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim() || !taxId.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/v1/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName, email, taxId, domainRole, sector: activeSector }),
      });
      setSubmitSuccess(true);
      setCompanyName("");
      setEmail("");
      setTaxId("");
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch {
      // silent fail
    } finally {
      setIsSubmitting(false);
    }
  }, [companyName, email, taxId, domainRole, activeSector]);

  const heroSlides = [
    {
      id: 1,
      tag: "Invoice Factoring",
      tagColor: ACCENT,
      title: "Unlock Cash Flow\nwith Invoice Factoring",
      desc: "Suppliers get paid early. Hotels keep their net-30/60 payment terms. No more cash flow crunches. Our financial partners fund your invoices within 24 hours.",
      bg: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=80",
      cta1: { label: "Learn More", href: "/solutions" },
      cta2: { label: "Get Started Free", href: "/register" },
    },
    {
      id: 2,
      tag: "Easy Integration",
      tagColor: ACCENT,
      title: "Connect Your PMS,\nERP or POS in Minutes",
      desc: "Pre-built connectors for your existing hotel systems. No IT team required. Plug Hotels Vendors into your existing tech stack. Go live in under a day.",
      bg: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=80",
      cta1: { label: "Book a Demo", href: "/register" },
      cta2: { label: "Get Started Free", href: "/register" },
    },
  ];

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
          CAROUSEL HERO — Template Matching
          ═══════════════════════════════════════════ */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-zinc-950">
        {heroSlides.map((slide) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${currentSlide === slide.id ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-transparent z-10" />
            <Image
              src={slide.bg}
              alt=""
              fill
              className="object-cover object-center opacity-45"
              priority={slide.id === 1}
            />
            <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 lg:px-24 max-w-4xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase mb-6 self-start"
                style={{ backgroundColor: `${slide.tagColor}20`, border: `1px solid ${slide.tagColor}30`, color: slide.tagColor }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: slide.tagColor }} />
                {slide.tag}
              </div>
              <h1 className="font-serif text-5xl lg:text-7xl font-semibold leading-tight text-white mb-6 whitespace-pre-line">
                {slide.title}
              </h1>
              <p className="text-zinc-400 text-base lg:text-lg max-w-xl mb-8 font-light leading-relaxed">
                {slide.desc}
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href={slide.cta1.href}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl transition-all transform hover:-translate-y-0.5"
                  style={{ backgroundColor: ACCENT, color: "#ffffff" }}
                >
                  {slide.cta1.label}
                </Link>
                <Link
                  href={slide.cta2.href}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-sm font-semibold rounded-xl transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff" }}
                >
                  {slide.cta2.label}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-8 right-6 lg:right-12 z-30 flex items-center gap-4">
          <div className="flex gap-1.5">
            {[1, 2].map((dot) => (
              <button
                key={dot}
                onClick={() => setCurrentSlide(dot)}
                className={`h-1 rounded-full cursor-pointer transition-all ${currentSlide === dot ? "w-8 bg-white" : "w-8 bg-white/30"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => (prev <= 1 ? totalSlides : prev - 1))}
              className="p-2.5 rounded-full transition-colors"
              style={{ backgroundColor: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev >= totalSlides ? 1 : prev + 1))}
              className="p-2.5 rounded-full transition-colors"
              style={{ backgroundColor: "rgba(0,0,0,0.6)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          BENTO GRID FEATURES — Template Matching
          ═══════════════════════════════════════════ */}
      <section id="solutions" className="py-24 px-6 lg:px-12 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl lg:text-5xl font-semibold mb-4 text-white">Unified B2B Operations</h2>
            <p className="text-zinc-500 max-w-2xl mx-auto text-base">One modern dashboard to orchestrate Egyptian Tax requirements, automated vendor verification, and immediate capital financing.</p>
          </div>

          {/* Bento Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Box 1: Wide 2x1 — ETA Document Signatures */}
            <div                className="md:col-span-2 bg-zinc-950 border rounded-3xl p-8 transition-all flex flex-col justify-between group"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div>
                <span className="text-xs font-bold tracking-widest uppercase block mb-3" style={{ color: ACCENT }}>Egyptian Market First</span>
                <h3 className="font-serif text-3xl font-semibold mb-3 text-white">ETA Document Signatures</h3>
                <p className="text-zinc-400 font-light max-w-lg">Fully aligned with the Egyptian Tax Authority e-invoicing SDK. We canonicalize, sign, and securely transfer standard data without interrupting business.</p>
              </div>
              <div className="mt-8 bg-black/50 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: EMERALD }} />
                  <span className="text-xs tracking-wider text-zinc-300 font-medium">Automatic Token Expiration Management</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-bold bg-zinc-900 border border-white/5 px-2 py-1 rounded">JWT Active</span>
              </div>
            </div>

            {/* Box 2: Square 1x1 — Vendor Audits */}
            <div className="bg-zinc-950 border rounded-3xl p-8 transition-all flex flex-col justify-between group"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div>
                <span className="text-xs font-bold tracking-widest uppercase block mb-3" style={{ color: ACCENT }}>Compliance</span>
                <h3 className="font-serif text-2xl font-semibold mb-3 text-white">Vendor Audits</h3>
                <p className="text-zinc-400 font-light text-sm">We verify Tax Cards and Commercial Registries before suppliers hit your feed.</p>
              </div>
              <div className="mt-6 flex justify-center">
                <span className="text-xs font-semibold rounded-full inline-flex items-center gap-1.5 px-3 py-1.5"
                  style={{ color: EMERALD, backgroundColor: `${EMERALD}15`, border: `1px solid ${EMERALD}25` }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                  100% Tax Compliant
                </span>
              </div>
            </div>

            {/* Box 3: Square 1x1 — Cash Liquidity */}
            <div className="bg-zinc-950 border rounded-3xl p-8 transition-all flex flex-col justify-between group"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div>
                <span className="text-xs font-bold tracking-widest uppercase block mb-3 text-zinc-400">FinTech Core</span>
                <h3 className="font-serif text-2xl font-semibold mb-3 text-white">Cash Liquidity</h3>
                <p className="text-zinc-400 font-light text-sm">Never stall operations again. Turn outstanding invoices into liquid cash balances in hours.</p>
              </div>
              <div className="mt-6">
                <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ backgroundColor: ACCENT, width: "78%" }} />
                </div>
                <div className="flex justify-between text-[11px] text-zinc-500 mt-2">
                  <span>Current Payout Rate</span>
                  <span className="font-bold text-zinc-300">78% / Day 1</span>
                </div>
              </div>
            </div>

            {/* Box 4: Wide 2x1 — Zero Cloud Liability */}
            <div                className="md:col-span-2 bg-zinc-950 border rounded-3xl p-8 transition-all flex flex-col justify-between group"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}
            >
              <div>
                <span className="text-xs font-bold tracking-widest uppercase block mb-3" style={{ color: ACCENT }}>Data Flow</span>
                <h3 className="font-serif text-3xl font-semibold mb-3 text-white">Zero Cloud Liability</h3>
                <p className="text-zinc-400 font-light max-w-lg">We serve purely as a technical integration router. All private API keys, cryptographic tokens, and billing records reside under absolute secure cloud policies.</p>
              </div>
              <div className="mt-8 flex gap-2 flex-wrap">
                <span className="text-xs text-zinc-400 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg font-medium">B2B Procurement</span>
                <span className="text-xs text-zinc-400 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg font-medium">Frictionless API</span>
                <span className="text-xs text-zinc-400 bg-zinc-900 border border-white/5 px-3 py-1.5 rounded-lg font-medium">Secure Environment</span>
              </div>
            </div>
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
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${ACCENT}20` }}>
                    <badge.icon size={16} style={{ color: ACCENT }} />
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
              HotelsVendors integrates with Egypt&apos;s leading payment and fintech infrastructure.
            </p>
          </div>
        </div>
      </RevealSection>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          SECTOR ROUTER — Dynamic Tab System
          ═══════════════════════════════════════════ */}
      <section id="platform" className="py-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: `radial-gradient(circle, ${ACCENT}08 0%, transparent 70%)` }} />
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

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSector}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="grid lg:grid-cols-5 gap-6 items-start">
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
                  <p className="text-[15px] text-white/60 leading-relaxed mb-6">{currentSector.hook}</p>
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
                    className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all"
                    style={{ backgroundColor: currentSector.accent, color: "#ffffff" }}
                  >
                    Schedule {currentSector.label} Audit <ArrowRight size={14} />
                  </Link>
                </div>

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
                        style={{ backgroundColor: `${EMERALD}10`, border: `1px solid ${EMERALD}25` }}
                      >
                        <CheckCircle2 size={28} className="mx-auto mb-3" style={{ color: EMERALD }} />
                        <p className="text-[13px] font-medium text-white mb-1">Application Received</p>
                        <p className="text-[11px] text-white/40">Our team will contact you within 24 hours.</p>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleQuickSubmit} className="space-y-3">
                        <div>
                          <label className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1.5 block">Company / Property</label>
                          <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)}
                            placeholder={currentSector.placeholder}
                            className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/15 outline-none transition-all"
                            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-white/30 uppercase tracking-wider font-medium mb-1.5 block">Work Email</label>
                          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@company.com"
                            className="w-full px-4 py-3 rounded-xl text-[13px] text-white placeholder:text-white/15 outline-none transition-all"
                            style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                          />
                        </div>
                        <button type="submit" disabled={isSubmitting || !companyName.trim() || !email.trim()}
                          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          style={{ backgroundColor: currentSector.accent, color: "#ffffff" }}
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
          ONBOARDING LEAD GENERATION — Template Matching
          ═══════════════════════════════════════════ */}
      <section id="supplier" className="py-24 px-6 lg:px-12 bg-zinc-950 border-t border-white/5">
        <div className="max-w-4xl mx-auto bg-black border border-white/5 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <span className="text-xs font-bold tracking-widest uppercase block mb-2" style={{ color: ACCENT }}>Onboarding Application</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-semibold mb-4 text-white">Register as a Verified Partner</h2>
            <p className="text-zinc-500 text-sm max-w-md mx-auto">Input your company profiles below. Our vetting teams will process your registration profile inside our unified system ledger.</p>
          </div>

          <form onSubmit={handleFullSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Company Name</label>
                <input
                  type="text" required placeholder="e.g. Red Sea Hospitality Ltd"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  onFocus={(e) => { e.target.style.borderColor = ACCENT }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Egyptian Tax Registration ID</label>
                <input
                  type="text" required placeholder="XXX-XXX-XXX"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  onFocus={(e) => { e.target.style.borderColor = ACCENT }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)" }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Primary Contact Email</label>
                <input
                  type="email" required placeholder="procurement@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                  onFocus={(e) => { e.target.style.borderColor = ACCENT }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">Company Domain Role</label>
                <select
                  value={domainRole}
                  onChange={(e) => setDomainRole(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  <option value="hotel">Hospitality Operator (Hotel)</option>
                  <option value="vendor">Verified Product Supplier (Vendor)</option>
                </select>
              </div>
            </div>
            
            <button type="submit" disabled={isSubmitting}
              className="w-full font-bold py-4 rounded-xl transition-all tracking-wider text-xs uppercase disabled:opacity-40"
              style={{ backgroundColor: ACCENT, color: "#ffffff" }}
            >
              {isSubmitting ? "Processing..." : "Submit Digital Registration Profile"}
            </button>
          </form>
          
          {submitSuccess && (
            <div className="mt-6 rounded-xl p-4 text-center" style={{ backgroundColor: `${EMERALD}10`, border: `1px solid ${EMERALD}25` }}>
              <span className="text-sm font-semibold block" style={{ color: EMERALD }}>✓ Application Successfully Received</span>
              <span className="text-xs text-zinc-500 mt-1 block">Data profile matched with local Prisma models and staged for verification.</span>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — Staggered Pipeline
          ═══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="text-center mb-12">
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-1 block">Operational Workflow</span>
              <h2 className="text-[26px] font-bold text-white">From Forecast to Settlement</h2>
            </div>
          </RevealSection>
          <div className="grid md:grid-cols-5 gap-4 relative">
            <div className="hidden md:block absolute top-[60px] left-[10%] right-[10%] h-px" style={{ background: `linear-gradient(to right, ${ACCENT}30, ${ACCENT}10, ${ACCENT}30)` }} />
            {PIPELINE.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6, borderColor: `${ACCENT}30` }}
                className="rounded-2xl p-6 text-center h-full relative group"
                style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div className="text-[32px] font-bold leading-none mb-3" style={{ color: `${ACCENT}20` }}>{step.step}</div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: `${ACCENT}20`, border: `1px solid ${ACCENT}15` }}
                >
                  <step.icon size={18} style={{ color: ACCENT }} />
                </div>
                <h3 className="text-[13px] font-bold mb-2 text-white transition-colors duration-300" style={{ color: ACCENT }}>{step.title}</h3>
                <p className="text-[11px] text-white/50 leading-relaxed">{step.desc}</p>
                {i < PIPELINE.length - 1 && (
                  <div className="hidden md:flex absolute top-[54px] -right-3 z-10 items-center justify-center w-6 h-6 rounded-full" style={{ backgroundColor: `${ACCENT}20` }}>
                    <MoveRight size={12} style={{ color: `${ACCENT}50` }} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          THREE PILLARS
          ═══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="text-center mb-14">
              <span className="text-[11px] font-semibold text-white/50 uppercase tracking-[0.15em] mb-2 block">Integrated Solution</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-4">
                Procurement + Fintech + AI.<br />One Settlement Engine.
              </h2>
            </div>
          </RevealSection>
          <div className="grid lg:grid-cols-3 gap-5">
            {[
              { icon: CircuitBoard, title: "AI-Automated Procurement", subtitle: "The Engine", desc: "Cashflow preservation, not administrative overhead. Predict demand 14 days ahead. Auto-generate POs against budget ceilings.", href: "/register", cta: "Schedule Procurement Audit", color: ACCENT, type: "engine" as const },
              { icon: Wallet, title: "Cashflow Optimization", subtitle: "The Capital", desc: "Suppliers paid in 24 hours via competitive reverse factoring. You keep net-60+. On-site GRN validation unlocks non-recourse settlement.", href: "/register", cta: "Request Capital Assessment", color: EMERALD, type: "capital" as const },
              { icon: LineChart, title: "B2B Smartest Fintech", subtitle: "The Shield", desc: "Pre-cleared, high-velocity corporate deal flow. Every asset passes tenant validation, ETA cryptographic UUID verification, and automated three-way matching.", href: "/register", cta: "Schedule Integration Audit", color: "#3B82F6", type: "shield" as const },
            ].map((role, i) => (
              <RevealSection key={role.title} delay={i * 0.12}>
                <motion.div whileHover={{ y: -4 }} className="rounded-2xl p-0 overflow-hidden h-full" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
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
          CTA — Final Conversion
          ═══════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
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
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-semibold rounded-xl transition-all"
                  style={{ backgroundColor: ACCENT, color: "#ffffff" }}
                >
                  Request Institutional Onboarding <ArrowRight size={15} />
                </motion.a>
                <motion.a
                  href="/sandbox"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all"
                  style={{ border: `1px solid ${ACCENT}40`, color: ACCENT }}
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
            </motion.div>
          </RevealSection>
        </div>
      </section>

      <MarketingFooter />
      <PublicChatbot />
    </main>
  );
}
