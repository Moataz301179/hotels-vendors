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
  Landmark,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketTicker } from "@/components/marketing/market-ticker";
import { SecurityCertificates } from "@/components/marketing/security-certificates";
import { FAQSection } from "@/components/marketing/faq-section";
import { HotelDashboardMockup } from "@/components/marketing/hotel-dashboard-mockup";
import { SupplierDashboardMockup } from "@/components/marketing/supplier-dashboard-mockup";
import { FunderDashboardMockup } from "@/components/marketing/funder-dashboard-mockup";

// ─── Color System (Neon Orange + Turquoise) ──────────────────────
const C = {
  // Primary: Neon Orange
  primary: "#FF6B00",
  primaryMuted: "rgba(255,107,0,0.1)",
  primaryBorder: "rgba(255,107,0,0.3)",
  primaryGlow: "rgba(255,107,0,0.15)",
  // Secondary: Turquoise / Cyan Neon
  secondary: "#00E5CC",
  secondaryMuted: "rgba(0,229,204,0.1)",
  secondaryBorder: "rgba(0,229,204,0.3)",
  secondaryGlow: "rgba(0,229,204,0.15)",
  // Accent: Deep Violet
  accent: "#A855F7",
  accentMuted: "rgba(168,85,247,0.1)",
  accentBorder: "rgba(168,85,247,0.3)",
  // Aliases for backwards compat in this file
  orange: "#FF6B00",
  orangeMuted: "rgba(255,107,0,0.1)",
  orangeBorder: "rgba(255,107,0,0.3)",
  green: "#00E5CC",       // turquoise replaces green
  greenMuted: "rgba(0,229,204,0.1)",
  greenBorder: "rgba(0,229,204,0.3)",
  purple: "#A855F7",
  purpleMuted: "rgba(168,85,247,0.1)",
  purpleBorder: "rgba(168,85,247,0.3)",
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
  { icon: Shield, label: "ETA E-Invoicing", desc: "Egyptian Tax Authority" },
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
  { step: "01", title: "Hotels Join Free", desc: "Register on HotelsVendors. AI-guided ETA-compliant onboarding in minutes — no paperwork, no credit card.", color: C.secondary, borderColor: C.secondaryBorder },
  { step: "02", title: "Discover on INVO", desc: "Browse 680+ verified suppliers on INVO — our vendor marketplace. Real-time catalogs, AI-powered matching.", color: C.primary, borderColor: C.primaryBorder },
  { step: "03", title: "Checkout & Pay", desc: "HotelsVendors handles checkout, multi-gateway payments, and bank transfers. AI forecasts spend and flags compliance gaps.", color: C.accent, borderColor: C.accentBorder },
  { step: "04", title: "Suppliers Get Paid in 48h", desc: "Vendors request reverse factoring via Settlement & Capital. Competitive bidding, bank-direct disbursement, FRA compliant.", color: C.secondary, borderColor: C.secondaryBorder },
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
  const [activeLayer, setActiveLayer] = useState<"hv" | "invo" | "capital">("hv");
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
          HERO — with large logo, 3-layer consistent messaging
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-12">
        {/* Neon glow orbs */}
        <div className="absolute top-1/4 left-1/6 w-[500px] h-[400px] rounded-full blur-[200px] pointer-events-none" style={{ background: C.primary, opacity: 0.07 }} />
        <div className="absolute bottom-1/4 right-1/6 w-[400px] h-[300px] rounded-full blur-[180px] pointer-events-none" style={{ background: C.secondary, opacity: 0.05 }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] tracking-wider uppercase mb-8 border"
            style={{ borderColor: C.accentBorder, background: C.accentMuted, color: C.accent }}
          >
            <Sparkles size={12} />
            Egypt & MENA&apos;s First · AI-Native B2B Hotel Procurement Platform
          </motion.div>

          {/* Logo + Brand Name Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="flex items-center justify-center gap-5 mb-6"
          >
            {/* Large Knight Logo with glow overlay */}
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-2xl opacity-40" style={{ background: C.primary }} />
              <svg width="88" height="88" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative">
                <defs>
                  <linearGradient id="heroLogoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor={C.primary} />
                    <stop offset="100%" stopColor={C.secondary} />
                  </linearGradient>
                </defs>
                <path d="M65 15 L75 25 L70 35 L80 45 L70 60 L55 55 L45 65 L35 60 L30 70 L25 65 L30 50 L40 45 L35 35 L45 25 L55 30 L65 15Z" fill="url(#heroLogoGrad)" />
                <path d="M35 60 L30 70 L25 65 L30 50Z" fill={C.primary} opacity="0.5" />
                <path d="M55 30 L65 15 L60 25Z" fill={C.secondary} opacity="0.3" />
                <circle cx="58" cy="38" r="3" fill="#ffffff" opacity="0.9" />
              </svg>
            </div>

            {/* Brand name — ALL CAPS consistent with hero title */}
            <h1
              className="text-[40px] sm:text-[52px] md:text-[64px] font-semibold leading-[1.05] tracking-[0.06em] uppercase"
              style={{
                background: `linear-gradient(135deg, ${C.primary} 0%, ${C.secondary} 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              HOTELS<br />VENDORS
            </h1>
          </motion.div>

          {/* Subtitle — 3 layers clearly named */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-[18px] md:text-[22px] text-white font-medium mb-4 tracking-wide"
          >
            Three Layers. One Network. Zero Friction.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-[14px] md:text-[15px] text-white/60 max-w-3xl mx-auto mb-4 font-normal leading-relaxed"
          >
            <span style={{ color: C.secondary }}>HotelsVendors</span> is the procurement operating system — AI forecasting, checkout, ETA compliance.
            <span style={{ color: C.primary }}> INVO</span> is the vendor marketplace — 680+ verified suppliers, real-time catalogs.
            <span style={{ color: C.accent }}> Settlement & Capital</span> is the financial layer — reverse factoring, 48h payout, FRA compliant.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-[13px] text-white/40 max-w-2xl mx-auto mb-8 font-normal"
          >
            All three layers are free to join. We earn only when value is exchanged — transparent fees, zero hidden costs.
          </motion.p>

          {/* Trust pills */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-wrap justify-center gap-2.5 mb-8 text-[11px]"
          >
            {[
              { label: "ETA E-Invoicing", color: C.secondary },
              { label: "FRA Framework Ready", color: C.primary },
              { label: "Bank-Grade Security", color: C.accent },
              { label: "Free to Start", color: C.secondary },
            ].map((pill) => (
              <span key={pill.label} className="px-3 py-1 rounded-full border font-medium" style={{ borderColor: pill.color + "50", color: pill.color, background: pill.color + "10" }}>
                {pill.label}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 text-[14px] font-semibold rounded-lg transition-all hover:shadow-lg hover:opacity-90" style={{ background: `linear-gradient(135deg, ${C.primary}, #FF8C38)`, color: "#ffffff" }}>
              Get Started Free
              <ArrowRight size={16} />
            </Link>
            <Link href="/sandbox" className="inline-flex items-center gap-2 px-8 py-3.5 text-[14px] font-medium rounded-lg border transition-all hover:bg-white/[0.04]" style={{ borderColor: C.accentBorder, color: C.accent }}>
              <Play size={15} />
              Explore Sandbox
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex justify-center"
          >
            <a href="#layers" className="flex flex-col items-center gap-2 text-white/30 hover:text-white/60 transition-colors cursor-pointer">
              <span className="text-[10px] tracking-widest uppercase">Explore the Three Layers</span>
              <ChevronDown size={16} className="animate-bounce" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* Market Ticker — below hero, not in header */}
      <MarketTicker />

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
          THREE-LAYER ARCHITECTURE
          ═══════════════════════════════════════════ */}
      <section id="layers" className="py-24 border-y" style={{ borderColor: C.purple + "18" }}>
        <div className="max-w-6xl mx-auto px-6">
          <RevealSection>
            <div className="text-center mb-12">
              <span className={`${Label}`} style={{ color: C.purple }}>Three-Layer Architecture · بنية ثلاثية الطبقات</span>
              <h2 className={`${H2} mt-3 mb-4 text-white`}>Three Layers. One Unified Network.</h2>
              <p className="text-white/50 text-[15px] max-w-2xl mx-auto font-normal">Each layer serves a distinct stakeholder — connected by AI agents, shared settlement, and cryptographic compliance. Together, they form Egypt&apos;s hospitality procurement infrastructure.</p>
              <p className="text-white/30 text-[13px] max-w-xl mx-auto mt-2" dir="rtl">كل طبقة تخدم طرفًا محددًا — متصلة بالعملاء الذكيين والتسوية المشتركة والامتثال التشفيري. معًا، تشكل بنية تحتية لمشتريات الضيافة في مصر.</p>
            </div>
          </RevealSection>

          {/* Layer cards — always visible */}
          <RevealSection>
            <div className="grid md:grid-cols-3 gap-5 mb-12">
              {[
                {
                  icon: Building2,
                  title: "HotelsVendors",
                  titleAr: "هوتيلز فيندورز",
                  subtitle: "Procurement OS",
                  subtitleAr: "نظام المشتريات",
                  desc: "Hotel-facing workspace. AI forecasting, multi-gateway checkout, ETA compliance, reverse factoring requests, and budget control — all in one dashboard.",
                  descAr: "مساحة عمل فندقية. تنبؤ ذكي، دفع متعدد البوابات، امتثال ضريبي، تمويل عكسي، وتحكم في الميزانية — كل ذلك في لوحة تحكم واحدة.",
                  color: C.secondary,
                  borderColor: C.secondaryBorder,
                  mutedColor: C.secondaryMuted,
                  features: ["AI demand forecasting", "ETA e-invoicing", "Budget authority matrix", "Multi-gateway payments"],
                  dashboard: HotelDashboardMockup,
                },
                {
                  icon: Store,
                  title: "INVO",
                  titleAr: "إنفو",
                  subtitle: "Vendor Marketplace",
                  subtitleAr: "سوق الموردين",
                  desc: "Supplier-facing marketplace. Aggregated catalogs via API, AI-powered vendor discovery, 24-hour onboarding, real-time inventory sync across 6 governorates.",
                  descAr: "سوق موردين مُجمّع. كتالوجات عبر واجهات برمجة، اكتشاف ذكي للموردين، تسجيل في 24 ساعة، مزامنة مخزون فورية عبر 6 محافظات.",
                  color: C.orange,
                  borderColor: C.orangeBorder,
                  mutedColor: C.orangeMuted,
                  features: ["680+ verified suppliers", "AI vendor matching", "Real-time catalog sync", "24h supplier onboarding"],
                  dashboard: SupplierDashboardMockup,
                },
                {
                  icon: Landmark,
                  title: "Settlement & Capital",
                  titleAr: "التسوية ورأس المال",
                  subtitle: "Financial Infrastructure",
                  subtitleAr: "البنية التحتية المالية",
                  desc: "Financial layer. Reverse factoring with competitive bidding, 48-hour supplier payout, bank-direct settlement, FRA anti-fraud compliance, and cryptographic audit trails.",
                  descAr: "الطبقة المالية. تمويل عكسي بتنافس تسعيري، دفع للموردين في 48 ساعة، تسوية بنكية مباشرة، امتثال مكافحة الاحتيال، ومسارات تدقيق تشفيرية.",
                  color: C.purple,
                  borderColor: C.purpleBorder,
                  mutedColor: C.purpleMuted,
                  features: ["48h reverse factoring", "Multi-funder bidding", "Bank-direct settlement", "FRA anti-fraud compliance"],
                  dashboard: FunderDashboardMockup,
                },
              ].map((layer) => (
                <motion.div
                  key={layer.title}
                  whileHover={{ y: -4, borderColor: layer.color + "66" }}
                  className="rounded-2xl p-6 flex flex-col"
                  style={{ backgroundColor: C.card, border: `1px solid ${layer.borderColor}` }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: layer.mutedColor }}>
                      <layer.icon size={20} style={{ color: layer.color }} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-semibold text-white">{layer.title}</h3>
                      <p className="text-[10px] text-white/30" dir="rtl">{layer.titleAr}</p>
                    </div>
                  </div>
                  <p className="text-[11px] font-medium mb-1" style={{ color: layer.color }}>{layer.subtitle}</p>
                  <p className="text-[10px] text-white/25 mb-2" dir="rtl">{layer.subtitleAr}</p>
                  <p className="text-[12px] text-white/45 leading-relaxed mb-3 flex-1">{layer.desc}</p>
                  <p className="text-[11px] text-white/30 leading-relaxed mb-4" dir="rtl">{layer.descAr}</p>
                  <ul className="space-y-1.5">
                    {layer.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[11px] text-white/50">
                        <CheckCircle size={12} className="shrink-0" style={{ color: layer.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </RevealSection>

          {/* Interactive layer detail */}
          <RevealSection>
            <div className="flex justify-center mb-8">
              <div className="inline-flex border rounded-xl p-1 gap-1" style={{ borderColor: C.greenBorder, background: C.bg }}>
                {[
                  { key: "hv", label: "HotelsVendors", icon: Building2, color: C.green },
                  { key: "invo", label: "INVO", icon: Store, color: C.orange },
                  { key: "capital", label: "Settlement & Capital", icon: Landmark, color: C.purple },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveLayer(tab.key as "hv" | "invo" | "capital")}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-medium transition-all cursor-pointer"
                    style={{
                      background: activeLayer === tab.key ? tab.color : "transparent",
                      color: activeLayer === tab.key ? "#07090f" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                  </button>
                ))}
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
                    HotelsVendors · نظام المشتريات
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
                  <Link href="/register/hotel" className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium rounded-md transition-all hover:opacity-90" style={{ background: C.green, color: "#07090f" }}>
                    Register as Hotel <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: C.greenBorder, boxShadow: `0 0 40px 2px ${C.green}18` }}>
                  <HotelDashboardMockup />
                </div>
              </motion.div>
            ) : activeLayer === "invo" ? (
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
                    INVO · سوق الموردين
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
                  <Link href="/register/supplier" className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium rounded-md transition-all hover:opacity-90" style={{ background: C.orange, color: "#07090f" }}>
                    Register as Supplier <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: C.orangeBorder, boxShadow: `0 0 40px 2px ${C.orange}18` }}>
                  <SupplierDashboardMockup />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="capital"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium tracking-widest uppercase mb-4" style={{ borderColor: C.purpleBorder, color: C.purple, background: C.purpleMuted }}>
                    <Landmark size={14} />
                    Settlement & Capital · التسوية ورأس المال
                  </div>
                  <h3 className={`${H3} mb-4 text-white`}>The Financial Infrastructure Layer</h3>
                  <p className="text-white/50 text-[14px] leading-relaxed mb-6 font-normal">The settlement layer connects licensed funders, banks, and suppliers. Reverse factoring with competitive bidding, 48-hour payout, bank-direct settlement, and FRA anti-fraud compliance — all cryptographically audited.</p>
                  <ul className="flex flex-col gap-3 mb-8">
                    {[
                      "Reverse factoring with multi-funder competitive bidding",
                      "48-hour supplier payout — bank-direct settlement",
                      "FRA anti-fraud compliance with three-way matching",
                      "SHA-256 cryptographic audit trails on every transaction",
                      "Non-recourse factoring — zero liability for counterparty default",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[13px] text-white/70 font-normal">
                        <CheckCircle size={15} className="mt-0.5 shrink-0" style={{ color: C.purple }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/register/funder" className="inline-flex items-center gap-2 px-6 py-2.5 text-[13px] font-medium rounded-md transition-all hover:opacity-90" style={{ background: C.purple, color: "#ffffff" }}>
                    Register as Funder <ArrowRight size={15} />
                  </Link>
                </div>
                <div className="relative rounded-2xl overflow-hidden border" style={{ borderColor: C.purpleBorder, boxShadow: `0 0 40px 2px ${C.purple}18` }}>
                  <FunderDashboardMockup />
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
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: i % 2 === 0 ? C.secondaryMuted : C.primaryMuted }}>
                    <badge.icon size={16} style={{ color: i % 2 === 0 ? C.secondary : C.primary }} />
                  </div>
                  <div>
                    <p className="text-[12px] font-medium text-white/70">{badge.label}</p>
                    <p className="text-[10px] text-white/40 font-normal">{badge.desc}</p>
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
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 text-[14px] font-semibold rounded-xl transition-all hover:opacity-90 hover:shadow-lg" style={{ background: `linear-gradient(135deg, ${C.primary}, #FF8C38)`, color: "#ffffff" }}>
                Get Started Free <ArrowRight size={15} />
              </Link>
              <Link href="/sandbox" className="inline-flex items-center gap-2 px-8 py-3.5 text-[14px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: `1px solid ${C.secondaryBorder}`, color: C.secondary }}>
                <Sparkles size={14} /> Explore Sandbox
              </Link>
            </div>
            <p className="text-[11px] text-white/30 mt-6 font-normal">No credit card required · Free to start · Dedicated onboarding</p>
          </RevealSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECURITY & COMPLIANCE CERTIFICATES
          ═══════════════════════════════════════════ */}
      <section className="py-16 border-t" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "#0a0a0a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <span className="text-[11px] font-semibold uppercase tracking-[0.15em] block mb-3" style={{ color: C.primary }}>
              Security & Compliance · الأمان والامتثال
            </span>
            <h2 className="text-[26px] sm:text-[32px] font-semibold tracking-tight text-white mb-3">
              Bank-Grade Security Infrastructure
            </h2>
            <p className="text-[14px] text-white/50 max-w-2xl mx-auto leading-relaxed">
              Every transaction, every invoice, every data point — protected by cryptographic standards trusted by Egypt&apos;s financial institutions.
              <br />
              <span dir="rtl" className="text-[13px] text-white/35">كل معاملة، كل فاتورة، كل نقطة بيانات — محمية بمعايير تشفير تثق بها المؤسسات المالية المصرية.</span>
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Shield, title: "ETA Phase 1 & 2 Compliant", titleAr: "متوافق مع الفوترة الإلكترونية — المرحلة الأولى والثانية", desc: "Full integration with Egyptian Tax Authority e-invoicing pipeline. RSA 2048-bit digital signing, UUID validation.", color: C.secondary },
              { icon: Lock, title: "AES-256-GCM Encryption", titleAr: "تشفير AES-256-GCM", desc: "All data at rest encrypted using AES-256-GCM. Keys rotated every 90 days.", color: C.primary },
              { icon: CheckCircle, title: "ISO 27001 Aligned", titleAr: "متوافق مع معيار ISO 27001", desc: "Information security management aligned with ISO 27001. Regular third-party audits and penetration testing.", color: C.accent },
              { icon: Globe, title: "Data Residency — Egypt", titleAr: "إقامة البيانات — مصر", desc: "All tenant data hosted on servers within Egypt. No data leaves Egyptian jurisdiction without consent.", color: C.secondary },
              { icon: ShieldCheck, title: "FRA Anti-Fraud Framework", titleAr: "إطار مكافحة الاحتيال", desc: "Three-way matching (PO + UUID + Delivery Note), SHA-256 audit trails, real-time fraud detection.", color: C.primary },
              { icon: Users, title: "Tenant Data Isolation", titleAr: "عزل بيانات المستأجرين", desc: "Each hotel/supplier/funder in fully isolated data scope. Cross-tenant access is architecturally impossible.", color: C.accent },
            ].map((cert) => (
              <div key={cert.title} className="rounded-2xl p-6 transition-all hover:scale-[1.01]" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: cert.color + "15" }}>
                    <cert.icon size={20} style={{ color: cert.color }} />
                  </div>
                  <span className="text-[9px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: cert.color + "15", color: cert.color }}>Active</span>
                </div>
                <h3 className="text-[14px] font-semibold text-white/80 mb-1">{cert.title}</h3>
                <p className="text-[10px] text-white/30 mb-3" dir="rtl">{cert.titleAr}</p>
                <p className="text-[12px] text-white/50 leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>

          {/* Legal disclaimer */}
          <div className="mt-8 rounded-xl p-5 text-center" style={{ backgroundColor: C.primaryMuted, border: `1px solid ${C.primaryBorder}` }}>
            <p className="text-[12px] text-white/60">
              <strong style={{ color: C.primary }}>Restaurants for E-Marketing</strong> operates as a <strong className="text-white/70">technical data orchestrator</strong> — not a bank, not a payment service provider, not a factoring company.
              All financial flows are processed through licensed institutions. Zero liability for counterparty collection defaults.
            </p>
            <p className="text-[11px] mt-2 text-white/40" dir="rtl">
              تعمل مطاعم للتسويق الإلكتروني كمنسق بيانات تقني — ليست بنكاً ولا مزود خدمات دفع. جميع التدفقات المالية تتم عبر مؤسسات مرخصة. مسؤولية صفرية عن تعثر تحصيل الطرف الآخر.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ
          ═══════════════════════════════════════════ */}
      <section className="py-20 border-t" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "#000000" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-12">
            <span className="text-[11px] font-medium text-white/40 uppercase tracking-[0.15em] block mb-3">FAQ · الأسئلة الشائعة</span>
            <h2 className="text-[26px] sm:text-[32px] font-semibold tracking-tight text-white mb-3">
              Frequently Asked Questions
            </h2>
            <p className="text-[14px] text-white/50 max-w-2xl mx-auto leading-relaxed">
              Everything you need to know about HotelsVendors — onboarding, compliance, suppliers, factoring, and how the platform works.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <FAQSection />
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
