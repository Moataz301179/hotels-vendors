"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BrainCircuit,
  Banknote,
  Store,
  Building2,
  BarChart3,
  CheckCircle2,
  Play,
  Landmark,
  ClipboardList,
  Timer,
  Eye,
  TrendingUp,
  Zap,
  DollarSign,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
const ACCENT = "#8c6c2c";
const ACCENT_LIGHT = "#a07d3c";
const ACCENT_MUTED = "rgba(140, 108, 44, 0.10)";
const ACCENT_BORDER = "rgba(140, 108, 44, 0.25)";
const BG = "#0f100e";
const BG_SURFACE = "#181916";
const BG_SURFACE_2 = "#22231f";
const TEXT = "#ffffff";
const TEXT_SECONDARY = "#b2aeae";
const TEXT_MUTED = "#9a9696";
const TERRACOTTA = "#ce5112";

const HEADING = "'Anek Malayalam', system-ui, sans-serif";
const SANS = "'Alan Sans', 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif";

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
      style={{ color: ACCENT, fontFamily: HEADING, letterSpacing: "0.3em" }}
    >
      {children}
    </span>
  );
}

function BillboardCarousel() {
  const slides = [
    { icon: Store, metric: "680+", label: "Verified Suppliers", desc: "Egypt's largest hospitality vendor network — across 6 governorates" },
    { icon: Timer, metric: "48h", label: "Supplier Payment", desc: "Reverse factoring lets suppliers choose early payment while you keep Net-60" },
    { icon: BrainCircuit, metric: "94%", label: "Forecast Accuracy", desc: "AI predicts demand 14 days ahead, flags anomalies, auto-generates POs" },
    { icon: DollarSign, metric: "1%", label: "Per Transaction", desc: "Just 1% commission. No hidden fees, no minimums, no lock-in" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % slides.length), 4200);
    return () => clearInterval(t);
  }, []);
  const s = slides[active];
  const Icon = s.icon;
  return (
    <div className="w-full flex flex-col items-center justify-center" style={{ height: "100%", minHeight: 400 }}>
      <div style={{
        width: "100%", maxWidth: 400,
        background: "linear-gradient(160deg, #1A120B 0%, #2A1F14 100%)",
        border: "1px solid rgba(140,108,44,0.25)",
        borderRadius: 18, padding: "36px 28px 28px",
        position: "relative",
        boxShadow: "0 0 60px rgba(140,108,44,0.06), inset 0 1px 0 rgba(140,108,44,0.08)",
      }}>
        {/* Bezel corner brackets */}
        {["top-0 left-0 border-t-2 border-l-2 rounded-tl-[18px] w-5 h-5",
          "top-0 right-0 border-t-2 border-r-2 rounded-tr-[18px] w-5 h-5",
          "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-[18px] w-5 h-5",
          "bottom-0 right-0 border-b-2 border-r-2 rounded-br-[18px] w-5 h-5"].map(p => (
          <div key={p} className={`absolute ${p}`} style={{ borderColor: "rgba(140,108,44,0.35)" }} />
        ))}
        {/* Mounting bolts */}
        {["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"].map(p => (
          <div key={p} className={`absolute ${p} w-1.5 h-1.5 rounded-full`} style={{ background: "rgba(140,108,44,0.25)" }} />
        ))}
        <AnimatePresence mode="wait">
          <motion.div key={active}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: ACCENT_MUTED, border: "1px solid rgba(140,108,44,0.18)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20,
            }}>
              <Icon size={22} style={{ color: ACCENT }} />
            </div>
            <div style={{ fontSize: 36, fontWeight: 500, color: ACCENT, fontFamily: HEADING, lineHeight: 1.1, marginBottom: 4 }}>
              {s.metric}
            </div>
            <div style={{ fontSize: 11, fontWeight: 500, color: TEXT, fontFamily: SANS, textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: 8, opacity: 0.8 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 12, color: TEXT_MUTED, fontFamily: SANS, maxWidth: 260, lineHeight: 1.6 }}>
              {s.desc}
            </div>
          </motion.div>
        </AnimatePresence>
        <div style={{ display: "flex", gap: 5, justifyContent: "center", marginTop: 24 }}>
          {slides.map((_, i) => (
            <div key={i} style={{
              width: 5, height: 5, borderRadius: "50%",
              background: i === active ? ACCENT : "rgba(140,108,44,0.15)",
              transition: "all 0.3s",
            }} />
          ))}
        </div>
        {/* Subtle pole mount */}
        <div style={{
          position: "absolute", bottom: -24, left: "50%", marginLeft: -1,
          width: 2, height: 24,
          background: "linear-gradient(to bottom, rgba(140,108,44,0.2), transparent)",
        }} />
      </div>
    </div>
  );
}

function HeroSection({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="w-full" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-6 py-20 md:px-12">

        {/* LEFT: SOLID UNIFORM TYPOGRAPHY */}
        <div className="lg:col-span-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs uppercase tracking-[0.25em]" style={{ color: ACCENT }}>✦ FinTech Automated Procurement</span>
          </motion.div>

          <h1
            className="text-3xl md:text-4xl font-light tracking-wide leading-tight"
            style={{ color: ACCENT, fontFamily: HEADING }}
          >
            Turn your hotel procurement into a financial advantage.
          </h1>

          <p className="text-base font-light max-w-xl leading-relaxed"
            style={{ color: TEXT_MUTED, fontFamily: SANS }}
          >
            Just 1% commission per transaction. Your suppliers get paid in 48 hours, with every invoice automatically ETA-compliant. No paperwork, no delays.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-start gap-4">
            <Link
              href="/register"
              className="text-sm px-6 py-3 rounded transition-colors duration-150 bg-transparent"
              style={{ border: `1px solid ${ACCENT}`, color: ACCENT, fontFamily: SANS, fontWeight: 300 }}
            >
              Start Free Trial
            </Link>
            <Link
              href="/sandbox"
              className="text-sm px-6 py-3 rounded transition-colors duration-150 bg-transparent"
              style={{ border: "1px solid #22231f", color: TEXT_MUTED, fontFamily: SANS, fontWeight: 300 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = ACCENT; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = TEXT_MUTED; e.currentTarget.style.borderColor = '#22231f'; }}
            >
              See the Platform in Action
            </Link>
          </div>

          <p className="text-xs font-light pt-2" style={{ color: TEXT_MUTED, fontFamily: SANS }}>
            Trusted by 500+ hotels from Sharm El Sheikh to the North Coast.
          </p>
        </div>

        {/* RIGHT: BILLBOARD CAROUSEL */}
        <div className="lg:col-span-6 rounded-xl relative overflow-hidden flex items-center justify-center"
          style={{ background: BG_SURFACE, border: "1px solid #22231f", minHeight: "420px" }}
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(to right, #22231f 1px, transparent 1px), linear-gradient(to bottom, #22231f 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <BillboardCarousel />
        </div>

      </div>
    </section>
  );
}

function DeepValueStack() {
  const cards = [
    {
      icon: Banknote,
      title: "Liquidity Pool Routing",
      desc: "Real-time automated capital allocation matching vendor payment terms. AI optimizes cash deployment across your supply chain — reducing cost of capital by 40%.",
    },
    {
      icon: ClipboardList,
      title: "Automated Reconciliation",
      desc: "Instant 3-way matching between purchase orders, delivery notes, and digital invoices. Every discrepancy flagged before payment — zero manual effort.",
    },
  ];

  return (
    <section className="py-24 md:py-32" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] mb-4 block" style={{ color: ACCENT, fontFamily: HEADING }}>
              ENTERPRISE FINANCIAL INFRASTRUCTURE
            </span>
            <h2 className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}>
              The Engine Behind the Marketplace
            </h2>
            <div className="w-12 h-px mx-auto" style={{ background: ACCENT }} />
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <Reveal key={card.title} delay={i * 0.1}>
                <div className="p-8 md:p-10 rounded-2xl h-full"
                  style={{ background: BG_SURFACE, border: "1px solid #22231f" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                    style={{ background: ACCENT_MUTED, border: "1px solid rgba(140,108,44,0.20)" }}>
                    <Icon size={22} style={{ color: ACCENT }} />
                  </div>
                  <h3 className="text-lg md:text-xl mb-3" style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}>
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ fontFamily: SANS, color: TEXT_MUTED }}>
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

function ProblemSection() {
  const problems = [
    { title: "Manual POs", desc: "Purchase orders sent via WhatsApp and email. No audit trail. No budget control.", icon: ClipboardList },
    { title: "60–180 Day Payments", desc: "Suppliers wait months for payment. They prioritize other buyers. Your supply chain suffers.", icon: Timer },
    { title: "ETA Compliance Burden", desc: "Every invoice must be digitally signed, UUID-validated, submitted to the Tax Authority. Manual work is error-prone.", icon: FileText },
    { title: "Zero Spend Visibility", desc: "You don't know which properties overpay, which suppliers are unreliable, or where money leaks.", icon: Eye },
  ];

  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ background: BG }}>
      <div className="max-w-7xl mx-auto px-6 relative">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>The Problem</SectionLabel>
            <h2 className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}>
              Hotel Procurement Is Broken
            </h2>
            <div className="w-12 h-px mx-auto mb-5" style={{ background: ACCENT }} />
            <p className="text-[14px] max-w-lg mx-auto" style={{ fontFamily: SANS, color: TEXT_MUTED }}>
              Egypt&apos;s coastal resorts lose 15–25% of procurement value to inefficiency. Here&apos;s what that looks like.
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={i * 0.08}>
                <div className="p-6 h-full rounded-2xl" style={{ background: BG_SURFACE, border: "1px solid rgba(140,108,44,0.08)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: ACCENT_MUTED, border: "1px solid rgba(140,108,44,0.20)" }}>
                    <Icon size={18} style={{ color: ACCENT }} />
                  </div>
                  <h3 className="text-[15px] mb-2" style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}>{p.title}</h3>
                  <p className="text-[13px] leading-relaxed" style={{ fontFamily: SANS, color: TEXT_MUTED }}>{p.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { num: "01", title: "Connect", desc: "Register your hotel in 5 minutes. AI guides you through supplier discovery and catalog browsing.", icon: Building2 },
    { num: "02", title: "Order", desc: "AI predicts what you need. One-click PO generation. Automatic budget enforcement via Authority Matrix.", icon: BrainCircuit },
    { num: "03", title: "Settle", desc: "Every invoice ETA-compliant, digitally signed, UUID-validated. Suppliers paid in 48 hours via reverse factoring.", icon: Banknote },
    { num: "04", title: "Optimize", desc: "AI learns your patterns. Forecasts demand 14 days ahead. Flags anomalies before you overpay.", icon: BarChart3 },
  ];

  return (
    <section className="py-24 md:py-32 relative" style={{ background: BG_SURFACE }}>
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <SectionLabel>How It Works</SectionLabel>
            <h2 className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}>
              From Chaos to Control
            </h2>
            <p className="text-[14px] max-w-md mx-auto" style={{ fontFamily: SANS, color: TEXT_MUTED }}>
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
                <div className="p-6 h-full rounded-2xl" style={{ background: BG_SURFACE, border: "1px solid rgba(140,108,44,0.08)" }}>
                  <div className="text-[10px] mb-4 uppercase tracking-wider"
                    style={{ color: ACCENT, fontFamily: SANS, fontWeight: 500, letterSpacing: "0.15em" }}>
                    Step {item.num}
                  </div>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: ACCENT_MUTED, border: "1px solid rgba(140,108,44,0.20)" }}>
                    <StepIcon size={18} style={{ color: ACCENT }} />
                  </div>
                   <h3 className="text-[15px] mb-2" style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}>{item.title}</h3>
                  <p className="text-[12px] leading-relaxed" style={{ fontFamily: SANS, color: TEXT_MUTED }}>{item.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

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
      <div className="max-w-7xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>One Platform, Three Stakeholders</SectionLabel>
            <h2 className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}>
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
                <div className="p-8 md:p-10 rounded-2xl" style={{ background: BG_SURFACE, border: "1px solid rgba(140,108,44,0.08)" }}>
                  <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ background: ACCENT_MUTED, border: "1px solid rgba(140,108,44,0.20)" }}>
                          <Icon size={18} style={{ color: ACCENT }} />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.15em] block"
                            style={{ color: ACCENT, fontFamily: SANS, fontWeight: 500 }}>
                            {role.title}
                          </span>
                          <h3 className="text-[18px] md:text-[22px]" style={{ fontFamily: SANS, fontWeight: 500, color: TEXT }}>
                            {role.headline}
                          </h3>
                        </div>
                      </div>
                      <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2.5 mb-6">
                        {role.points.map((p) => (
                          <li key={p} className="flex items-start gap-2.5 text-[13px]"
                            style={{ fontFamily: SANS, color: TEXT_SECONDARY }}>
                            <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: ACCENT }} />
                            {p}
                          </li>
                        ))}
                      </ul>
                      <button
                        onClick={onCTAClick}
                        className="inline-flex items-center gap-2 px-6 py-3 text-[13px] rounded-xl transition-all duration-200 hover:scale-[1.03] cursor-pointer"
                        style={{ background: ACCENT, color: "#ffffff", fontFamily: SANS, fontWeight: 500 }}
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
      <div className="text-[28px] md:text-[36px] mb-1 metric-value"
        style={{ fontFamily: SANS, fontWeight: 500, color: ACCENT }}>
        {isInView ? displayed : "0"}
      </div>
      <div className="text-[12px]" style={{ fontFamily: SANS, color: TEXT_SECONDARY }}>{label}</div>
      <div className="text-[10px] mt-0.5" style={{ fontFamily: SANS, color: TEXT_MUTED }}>{sub}</div>
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
    "Four Seasons", "Ritz-Carlton", "Mandarin Oriental", "Rosewood",
    "Peninsula", "Aman", "St. Regis", "W Hotels",
  ];

  const stats = [
    { value: "680+", label: "Verified Suppliers", sub: "Across 6 governorates" },
    { value: "500+", label: "Active Hotels", sub: "From Sharm to North Coast" },
    { value: "12M+", label: "Monthly GMV (EGP)", sub: "Growing 30% MoM" },
  ];

  return (
    <section className="py-24 md:py-32 relative" style={{ background: BG_SURFACE }}>
      <div className="max-w-7xl mx-auto px-6 relative">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>Real Results, Real Hotels</SectionLabel>
            <h2 className="text-[26px] md:text-[36px] lg:text-[40px] tracking-tight mb-4 leading-[1.1]"
              style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}>
              Measurable Impact Across the Red Sea
            </h2>
            <div className="w-12 h-px mx-auto" style={{ background: ACCENT }} />
          </div>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto text-center mb-14">
            {stats.map((stat) => (
              <AnimatedStat key={stat.label} {...stat} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 mb-14">
            {trustedBy.map((name) => (
              <span key={name} className="text-[13px] font-medium opacity-40 tracking-wide"
                style={{ fontFamily: SANS, color: TEXT }}>
                {name}
              </span>
            ))}
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {results.map((r, i) => {
            const Icon = r.icon;
            return (
              <Reveal key={r.label} delay={0.15 + i * 0.08}>
                <div className="p-6 h-full flex flex-col rounded-2xl"
                  style={{ background: BG_SURFACE, border: "1px solid rgba(140,108,44,0.08)" }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: ACCENT_MUTED, border: "1px solid rgba(140,108,44,0.20)" }}>
                    <Icon size={18} style={{ color: ACCENT }} />
                  </div>
                  <div className="text-[22px] mb-1 metric-value" style={{ fontFamily: SANS, color: TEXT }}>
                    {r.metric}
                  </div>
                  <div className="text-[11px] font-medium uppercase tracking-wider mb-3"
                    style={{ fontFamily: SANS, color: ACCENT, letterSpacing: "0.08em" }}>
                    {r.label}
                  </div>
                  <p className="text-[13px] leading-relaxed flex-1" style={{ fontFamily: SANS, color: TEXT_MUTED }}>
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

function FinalCTA({ onCTAClick }: { onCTAClick: () => void }) {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden text-center" style={{ background: BG }}>
      <div className="max-w-3xl mx-auto px-6 relative">
        <Reveal>
          <h2 className="text-[28px] md:text-[44px] tracking-tight mb-5 leading-tight"
            style={{ fontFamily: HEADING, fontWeight: 500, color: TEXT }}>
            Ready to Modernize Your Procurement?
          </h2>
          <div className="w-12 h-px mx-auto mb-5" style={{ background: ACCENT }} />
          <p className="text-[15px] mb-10 max-w-lg mx-auto leading-relaxed" style={{ fontFamily: SANS, color: TEXT_MUTED }}>
            Join 500+ hotels already on HotelsVendors. Free to start. Live in 24 hours. No credit card.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={onCTAClick}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-[14px] rounded-2xl transition-all duration-200 hover:scale-[1.03] cursor-pointer"
               style={{ background: ACCENT, color: "#ffffff", fontFamily: SANS, fontWeight: 500 }}
            >
              Get Started Free
              <ArrowRight size={16} />
            </button>
            <Link
              href="/sandbox"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] rounded-2xl transition-all duration-200"
              style={{ border: "1px solid rgba(140,108,44,0.2)", color: TEXT, fontFamily: SANS, fontWeight: 500 }}
            >
              <Play size={15} />
              Explore Sandbox
            </Link>
          </div>
          <p className="text-[11px] mt-8" style={{ fontFamily: SANS, color: TEXT_MUTED }}>
            No credit card required · Free forever for hotels · Dedicated onboarding
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen" style={{ background: BG, color: TEXT, fontFamily: SANS }}>
      <MarketingNav />
      <HeroSection onCTAClick={() => router.push('/register')} />
      <DeepValueStack />
      <ProblemSection />
      <HowItWorks />
      <RoleValueSection onCTAClick={() => router.push('/register')} />
      <SocialProof />
      <FinalCTA onCTAClick={() => router.push('/register')} />
      <MarketingFooter />
    </div>
  );
}