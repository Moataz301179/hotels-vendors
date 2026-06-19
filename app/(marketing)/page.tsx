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
  CreditCard,
  Send,
  Sparkles,
  CircuitBoard,
  Wallet,
  LineChart,
  Play,
  ChevronDown,
  Users,
  Globe,
  Lock,
  Cpu,
  MessageSquare,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { HotelDashboardMockup } from "@/components/marketing/hotel-dashboard-mockup";
import { SupplierDashboardMockup } from "@/components/marketing/supplier-dashboard-mockup";

// ─── Color System (Hercules Neon) ─────────────────────────────────
const C = {
  green: "#39ff7e",
  greenMuted: "rgba(57,255,126,0.1)",
  greenBorder: "rgba(57,255,126,0.3)",
  orange: "#ff7e1a",
  orangeMuted: "rgba(255,126,26,0.1)",
  orangeBorder: "rgba(255,126,26,0.3)",
  purple: "#c455ff",
  purpleMuted: "rgba(196,85,255,0.1)",
  purpleBorder: "rgba(196,85,255,0.3)",
  bg: "#07090f",
  card: "rgba(255,255,255,0.03)",
  border: "rgba(255,255,255,0.06)",
};

// ─── Typography: semibold (600) for titles, normal (400) for body ─
const H1 = "text-[32px] sm:text-[40px] md:text-[48px] font-semibold leading-[1.1] tracking-tight";
const H2 = "text-[26px] sm:text-[32px] md:text-[36px] font-semibold leading-[1.15] tracking-tight";
const H3 = "text-[18px] sm:text-[20px] font-semibold leading-snug";
const H4 = "text-[15px] font-semibold";
const Body = "text-[14px] font-normal leading-relaxed text-white/60";
const BodySm = "text-[13px] font-normal leading-relaxed text-white/50";
const Label = "text-[11px] font-medium uppercase tracking-[0.12em] text-white/40";

// ─── RevealSection ────────────────────────────────────────────────
function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Animated Counter ──────────────────────────────────────────────
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

function Counter({ end, suffix = "", prefix = "", label, icon: Icon, color = C.green }: {
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
      className="rounded-2xl p-6 text-center"
      style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
    >
      <Icon size={18} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
      <p className="text-[28px] font-semibold text-white mb-1">
        {prefix}{count.toLocaleString()}{suffix}
      </p>
      <p className={`text-[10px] uppercase tracking-wider font-medium`} style={{ color: "rgba(255,255,255,0.25)" }}>{label}</p>
    </motion.div>
  );
}

// ─── Data ──────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Shield, label: "ETA Phase 1 & 2 Compliant", desc: "Egyptian Tax Authority" },
  { icon: Lock, label: "AES-256-GCM Encryption", desc: "At-rest credential security" },
  { icon: Globe, label: "6 Governorates Covered", desc: "Coastal + Inland" },
  { icon: Zap, label: "48-Hour Settlement", desc: "Bank-direct factoring" },
];

const STATS = [
  { value: "Free", label: "To Start — No Subscription", color: C.green },
  { value: "1%", label: "On Bank Transfers", color: C.orange },
  { value: "1.5–3%", label: "On Factoring Services", color: C.purple },
  { value: "48h", label: "Reverse Factoring Payout", color: C.green },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Hotels Join Free", desc: "Register your property group on HotelsVendors. Our AI agent guides you through ETA-compliant onboarding in minutes — no paperwork.", color: C.green, borderColor: C.greenBorder },
  { step: "02", title: "Discover on INVO", desc: "Browse INVO — our vendor marketplace aggregated via API and plugin integrations from global supply networks. Find, compare, and order.", color: C.orange, borderColor: C.orangeBorder },
  { step: "03", title: "Checkout & Pay", desc: "HotelsVendors handles checkout, multi-currency payments, and bank transfers. AI agents forecast your spend and flag compliance gaps.", color: C.purple, borderColor: C.purpleBorder },
  { step: "04", title: "Suppliers Get Paid Fast", desc: "Vendors request reverse factoring. Our swarm agents validate, authorise, and disburse within 48 hours — fully compliant with FRA.", color: C.green, borderColor: C.greenBorder },
];

const FEATURES = [
  { icon: BrainCircuit, title: "AI Demand Forecasting", desc: "14-day forward predictions analyzing occupancy curves, booked events, and historical consumption patterns across every property.", color: C.green },
  { icon: Receipt, title: "ETA E-Invoicing V2", desc: "Native Egyptian Tax Authority API pipeline. RSA 2048-bit digital signing with cryptographic UUID validation at point of goods receipt.", color: C.green },
  { icon: Truck, title: "Shared-Route Logistics", desc: "AI-driven route consolidation across 6 governorates. Up to 40% cost reduction via intelligent multi-supplier load matching.", color: C.green },
  { icon: Banknote, title: "Embedded Reverse Factoring", desc: "Competitive bidding among 4+ licensed grantors. Non-recourse, bank-direct settlement. Suppliers paid in 48 hours.", color: C.green },
  { icon: ShieldCheck, title: "FRA Anti-Fraud Compliance", desc: "Mandatory three-way matching: PO + ETA UUID + Signed Digital Delivery Note. SHA-256 cryptographic audit trail.", color: C.green },
  { icon: BarChart3, title: "Cost Control Engine", desc: "Real-time spend analysis, anomaly detection, and budget optimization across every property, department, and vendor.", color: C.green },
];

const PIPELINE = [
  { step: "01", title: "AI Forecast & PO Generation", desc: "Engine predicts demand 14 days ahead from occupancy, events, and seasonality. Auto-generates POs against budget ceilings.", icon: BrainCircuit },
  { step: "02", title: "Authority Matrix Approval", desc: "POs route through your corporate authority matrix. Pre-occurrence budget blockades enforce spending limits.", icon: ShieldCheck },
  { step: "03", title: "ETA Invoice & GRN Clearance", desc: "Invoices digitally signed and submitted to Tax Authority. On-site GRN clearance triggers UUID validation.", icon: Receipt },
  { step: "04", title: "Logistics & Delivery", desc: "Shared-route consolidation. Multi-supplier load matching. 48-hour delivery guarantee to any Egyptian governorate.", icon: Truck },
  { step: "05", title: "Factoring & Settlement", desc: "Pre-cleared invoices enter competitive bidding. Funders bid. Supplier paid in 48hrs. Hotel keeps net-60+.", icon: Banknote },
];

// ─── Main Page ────────────────────────────────────────────────────
export default function HomePage() {
  const [activeLayer, setActiveLayer] = useState<"hv" | "invo">("hv");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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
    } catch {
      // silent fail
    } finally {
      setIsSubmitting(false);
    }
  }, [companyName, email]);

  return (
    <main className="min-h-screen" style={{ backgroundColor: C.bg, color: "#ffffff" }}>
      <MarketingNav />

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Neon glow orbs */}
        <div className="absolute top-1/3 left-1/4 w-80 h-80 rounded-full blur-[160px] pointer-events-none" style={{ background: C.green, opacity: 0.06 }} />
        <div className="absolute bottom-1/4 right-1/5 w-60 h-60 rounded-full blur-[130px] pointer-events-none" style={{ background: C.purple, opacity: 0.05 }} />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] tracking-wider uppercase mb-6 border"
            style={{ borderColor: C.purpleBorder, background: C.purpleMuted, color: C.purple }}
          >
            <Sparkles size={12} />
            Egypt & MENA's First · AI-Native B2B Hotel Procurement Platform
          </motion.div>

          {/* Title — semibold, not bold */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[36px] sm:text-[48px] md:text-[56px] font-semibold tracking-[0.08em] text-white leading-[1.1] mb-5 uppercase"
          >
            Hotels Vendors
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-[17px] md:text-[20px] text-white/90 mb-3 font-normal tracking-wide"
          >
            The Intelligent Procurement Network — <span className="text-white/65">Hotels, Vendors & Capital Connected.</span>
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[14px] text-white/55 max-w-2xl mx-auto mb-8 font-normal leading-relaxed"
          >
            For the first time in Egypt and the broader MENA region, hotels and their entire supply chain operate inside one unified, AI-governed platform.{" "}
            <span style={{ color: C.green }}>HotelsVendors</span> orchestrates procurement, payments, compliance, and financing — while{" "}
            <span style={{ color: C.orange }}>INVO</span>, its vendor marketplace sub-layer, aggregates supplier networks via API. Both platforms are free to join. We earn only when value is exchanged.
          </motion.p>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 mb-8 text-[11px]"
          >
            {[
              { label: "ETA Compliant", color: C.green },
              { label: "FRA Registered", color: C.orange },
              { label: "ISO 27001", color: C.purple },
              { label: "Free to Start", color: C.green },
            ].map((pill) => (
              <span key={pill.label} className="px-3 py-1 rounded-full border font-medium" style={{ borderColor: pill.color + "55", color: pill.color, background: pill.color + "10" }}>
                {pill.label}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/sandbox" className="inline-flex items-center gap-2 px-7 py-3 text-[13px] font-medium rounded-md transition-all hover:opacity-90" style={{ background: C.green, color: "#07090f" }}>
              <CreditCard size={16} />
              Explore the Sandbox Demo
            </Link>
            <Link href="/solutions" className="inline-flex items-center gap-2 px-7 py-3 text-[13px] font-normal rounded-md border transition-all hover:bg-white/5" style={{ borderColor: C.purpleBorder, color: C.purple }}>
              <MessageSquare size={16} />
              Talk to the AI Agent
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 flex justify-center"
          >
            <a href="#stats" className="flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer">
              <span className="text-[10px] tracking-widest uppercase">Discover</span>
              <ChevronDown size={16} className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS STRIP
          ═══════════════════════════════════════════ */}
      <section id="stats" className="relative py-12 border-y" style={{ borderColor: C.green + "22" }}>
        <div className="relative max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-[28px] md:text-[32px] mb-1 font-semibold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[11px] text-white/40 font-normal leading-snug">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════ */}
      <section id="how" className="py-20 max-w-6xl mx-auto px-6">
        <RevealSection>
          <div className="text-center mb-14">
            <span className={Label} style={{ color: C.green }}>How It Works</span>
            <h2 className={`${H2} mt-3 mb-3 text-white`}>Start Free. Transact Smart.</h2>
            <p className={`${Body} max-w-2xl mx-auto`}>No subscription. No setup cost. Our AI agents guide you from registration to your first compliant transaction.</p>
          </div>
        </RevealSection>

        <div className="grid md:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map((item, i) => (
            <RevealSection key={item.step} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, borderColor: item.color + "88" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="rounded-2xl p-5 h-full flex flex-col"
                style={{ backgroundColor: C.card, border: `1px solid ${item.borderColor}` }}
              >
                <div className="text-[28px] mb-3 opacity-15 font-semibold" style={{ color: item.color }}>{item.step}</div>
                <div className="text-[14px] mb-2 text-white font-medium" style={{ color: item.color }}>{item.title}</div>
                <p className="text-[12px] text-white/45 leading-relaxed flex-1 font-normal">{item.desc}</p>
              </motion.div>
            </RevealSection>
          ))}
        </div>
      </section>

      <hr className="border-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.green}22, transparent)` }} />

      {/* ═══════════════════════════════════════════
          VIDEO DEMO
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-y" style={{ borderColor: C.green + "18" }}>
        <div className="max-w-5xl mx-auto px-6">
          <RevealSection>
            <div className="text-center mb-10">
              <span className={Label} style={{ color: C.green }}>Platform Demo</span>
              <h2 className={`${H2} mt-3 mb-3 text-white`}>See It in Action</h2>
              <p className="text-white/45 text-[14px] max-w-xl mx-auto font-normal">Watch how HotelsVendors and INVO work together to streamline hotel procurement, payments, and supplier financing.</p>
            </div>
          </RevealSection>
          <RevealSection>
            <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: C.green + "44", boxShadow: `0 0 50px 4px ${C.green}10` }}>
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: C.border, backgroundColor: "rgba(255,255,255,0.02)" }}>
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: C.green }} />
                <div className="flex-1 mx-4 rounded px-3 py-1 text-[11px] text-white/30 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: C.border }}>app.hotelsvendors.com — Platform Overview</div>
              </div>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Play size={48} style={{ color: C.green }} className="opacity-60" />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-8 text-[11px] text-white/40 font-normal">
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: C.green }} />Hotel Dashboard Overview</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: C.orange }} />INVO Marketplace Tour</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: C.purple }} />AI Chatbot in Action</span>
              <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: C.green }} />Reverse Factoring Flow</span>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DUAL LAYER ARCHITECTURE
          ═══════════════════════════════════════════ */}
      <section id="invo" className="py-24 border-y" style={{ borderColor: C.purple + "18" }}>
        <div className="max-w-6xl mx-auto px-6">
          <RevealSection>
            <div className="text-center mb-12">
              <span className={`${Label}`} style={{ color: C.purple }}>Dual-Layer Architecture</span>
              <h2 className={`${H2} mt-3 mb-4 text-white`}>Two Platforms. One Network.</h2>
              <p className="text-white/50 text-[15px] max-w-2xl mx-auto font-normal">Each layer has its own workspace, user base, and purpose — connected by AI agents and shared settlement infrastructure.</p>
            </div>
          </RevealSection>

          {/* Layer switcher */}
          <RevealSection>
            <div className="flex justify-center mb-10">
              <div className="inline-flex border rounded-xl p-1 gap-1" style={{ borderColor: C.greenBorder, background: C.bg }}>
                <button
                  onClick={() => setActiveLayer("hv")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer"
                  style={{ background: activeLayer === "hv" ? C.green : "transparent", color: activeLayer === "hv" ? "#07090f" : "rgba(255,255,255,0.5)" }}
                >
                  <Building2 size={18} />
                  HotelsVendors
                </button>
                <button
                  onClick={() => setActiveLayer("invo")}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer"
                  style={{ background: activeLayer === "invo" ? C.orange : "transparent", color: activeLayer === "invo" ? "#07090f" : "rgba(255,255,255,0.5)" }}
                >
                  <Store size={18} />
                  INVO
                </button>
              </div>
            </div>
          </RevealSection>

          <AnimatePresence mode="wait">
            {activeLayer === "hv" ? (
              <motion.div
                key="hv"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium tracking-widest uppercase mb-4" style={{ borderColor: C.greenBorder, color: C.green, background: C.greenMuted }}>
                    <Building2 size={14} />
                    Hotel Layer
                  </div>
                  <h3 className={`${H3} mb-4 text-white`}>The Checkout & Payments Brain</h3>
                  <p className="text-white/50 text-[14px] leading-relaxed mb-6 font-normal">HotelsVendors is the hotel-facing workspace. It aggregates procurement, forecasts spending, processes payments via integrated gateways, and gives access to factoring and compliance services — all powered by AI swarm agents.</p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {[
                      "AI-powered spend forecasting and budget alerts",
                      "Multi-gateway checkout (cards, SWIFT, local banks)",
                      "Reverse factoring requests with automated authorisation",
                      "ETA & FRA compliance engine built-in",
                      "Swarm agents handle documentation at every workflow stage",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-white/70 font-normal">
                        <CheckCircle size={15} className="mt-0.5 shrink-0" style={{ color: C.green }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register" className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium rounded-md transition-all hover:opacity-90" style={{ background: C.green, color: "#07090f" }}>
                    Explore HotelsVendors <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: C.greenBorder, boxShadow: `0 0 40px 2px ${C.green}18` }}>
                  <HotelDashboardMockup />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="invo"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium tracking-widest uppercase mb-4" style={{ borderColor: C.orangeBorder, color: C.orange, background: C.orangeMuted }}>
                    <Store size={14} />
                    Vendor Marketplace Layer
                  </div>
                  <h3 className={`${H3} mb-4 text-white`}>The B2B Procurement Marketplace</h3>
                  <p className="text-white/50 text-[14px] leading-relaxed mb-6 font-normal">INVO is the vendor-facing sub-layer — a smart marketplace aggregated from partner networks via APIs and plugins. Suppliers list their catalogs, hotels discover and order, and every transaction flows up to HotelsVendors for settlement.</p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {[
                      "Plug-and-play integration with existing supplier marketplaces",
                      "AI chatbot helps hotels find the right vendor instantly",
                      "Vendor onboarding in under 24 hours",
                      "Real-time catalog sync across all connected networks",
                      "Automated pricing and availability updates",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-white/70 font-normal">
                        <CheckCircle size={15} className="mt-0.5 shrink-0" style={{ color: C.orange }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/become-supplier" className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium rounded-md transition-all hover:opacity-90" style={{ background: C.orange, color: "#07090f" }}>
                    Explore INVO <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: C.orangeBorder, boxShadow: `0 0 40px 2px ${C.orange}18` }}>
                  <SupplierDashboardMockup />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <hr className="border-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.green}15, transparent)` }} />

      {/* ═══════════════════════════════════════════
          ANIMATED STATS
          ═══════════════════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Counter end={680} suffix="+" label="Verified Suppliers" icon={Store} />
            <Counter end={94} suffix="%" label="Forecast Accuracy" icon={TrendingUp} />
            <Counter end={48} suffix="h" label="Supplier Settlement" icon={Clock} />
            <Counter end={40} suffix="%" label="Logistics Cost Reduction" icon={Truck} />
          </div>
        </div>
      </section>

      <hr className="border-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.green}15, transparent)` }} />

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
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.greenMuted }}>
                    <badge.icon size={16} style={{ color: C.green }} />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-white/60">{badge.label}</p>
                    <p className="text-[10px] text-white/25 font-normal">{badge.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </RevealSection>

      {/* ═══════════════════════════════════════════
          PLATFORM CAPABILITIES
          ═══════════════════════════════════════════ */}
      <section className="py-20" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="max-w-7xl mx-auto px-6">
          <RevealSection>
            <div className="mb-10">
              <span className={Label} style={{ color: C.green }}>Platform Capabilities</span>
              <h2 className={`${H2} text-white mt-2`}>Six Infrastructure Pillars</h2>
            </div>
          </RevealSection>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <RevealSection key={f.title} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -3, borderColor: C.greenBorder }}
                  className="rounded-2xl p-6 h-full"
                  style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                    <f.icon size={20} style={{ color: C.green }} />
                  </div>
                  <h3 className="text-[14px] font-semibold mb-2 text-white">{f.title}</h3>
                  <p className="text-[12px] text-white/40 leading-relaxed font-normal">{f.desc}</p>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.green}15, transparent)` }} />

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — Pipeline
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <RevealSection>
            <div className="text-center mb-12">
              <span className={Label} style={{ color: C.green }}>Operational Workflow</span>
              <h2 className={`${H2} text-white mt-2`}>From Forecast to Settlement</h2>
            </div>
          </RevealSection>
          <div className="grid md:grid-cols-5 gap-4">
            {PIPELINE.map((step, i) => (
              <RevealSection key={step.step} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-6 text-center h-full"
                  style={{ backgroundColor: C.card, border: `1px solid ${C.border}` }}
                >
                  <div className="text-[24px] font-semibold leading-none mb-3" style={{ color: C.green + "15" }}>{step.step}</div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: C.greenMuted, border: `1px solid ${C.green}20` }}>
                    <step.icon size={18} style={{ color: C.green }} />
                  </div>
                  <h3 className="text-[13px] font-semibold mb-2 text-white">{step.title}</h3>
                  <p className="text-[11px] text-white/35 leading-relaxed font-normal">{step.desc}</p>
                </motion.div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="border-0 h-px" style={{ background: `linear-gradient(to right, transparent, ${C.green}15, transparent)` }} />

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${C.green}08 0%, transparent 70%)` }} />
        <div className="max-w-4xl mx-auto px-6 text-center relative">
          <RevealSection>
            <span className={Label} style={{ color: C.green }}>Enterprise Onboarding</span>
            <h2 className={`${H2} mb-5 text-white mt-3`}>
              Your Procurement Infrastructure Shouldn't<br />Depend on Spreadsheets
            </h2>
            <p className="text-[14px] text-white/40 mb-8 leading-relaxed max-w-lg mx-auto font-normal">
              AI-automated procurement. Cashflow optimization. The smartest B2B fintech. All in one platform — with cryptographic ETA compliance, automated settlement, and zero manual reconciliation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:opacity-90" style={{ background: C.green, color: "#07090f" }}>
                Request Enterprise Access <ArrowRight size={15} />
              </Link>
              <Link href="/platform" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-normal rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.6)" }}>
                <Sparkles size={14} /> Explore Platform
              </Link>
            </div>
            <p className="text-[11px] text-white/20 mt-6 font-normal">No credit card required · 14-day enterprise trial · Dedicated onboarding</p>
          </RevealSection>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
