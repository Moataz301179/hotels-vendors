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
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

// ─── Sector Router Data ───────────────────────────────────────────
type SectorKey = "HOTEL" | "SUPPLIER" | "LOGISTICS" | "FINANCE";

interface SectorData {
  key: SectorKey;
  label: string;
  icon: React.ElementType;
  accent: string;
  accentMuted: string;
  hook: string;
  bullets: string[];
  placeholder: string;
}

const SECTORS: SectorData[] = [
  {
    key: "HOTEL",
    label: "Hotel Procurement",
    icon: Building2,
    accent: "#39FF14",
    accentMuted: "rgba(57,255,20,0.1)",
    hook: "Optimize your HORECA supply chain. Access real-time cost forecasting and automated factored credit lines.",
    bullets: [
      "Direct ETA-compliant invoicing",
      "AI-driven alternative suggestions",
      "Flexible credit checkout",
    ],
    placeholder: "Enter Hotel Name / Group",
  },
  {
    key: "SUPPLIER",
    label: "Supplier Vendors",
    icon: Store,
    accent: "#22C55E",
    accentMuted: "rgba(34,197,94,0.1)",
    hook: "Get paid immediately on delivery while offering your hotel buyers flexible credit terms.",
    bullets: [
      "Direct ETA eInvoicing SDK sync",
      "Zero-friction Invisible Onboarding",
      "Instant placement in hotel catalogs",
    ],
    placeholder: "Enter Company / Storefront Name",
  },
  {
    key: "LOGISTICS",
    label: "Logistics & Shipping",
    icon: Truck,
    accent: "#3B82F6",
    accentMuted: "rgba(59,130,246,0.1)",
    hook: "Become an authorized fulfillment partner for Egypt's premier hotel supplier network.",
    bullets: [
      "Automated route dispatching",
      "Guaranteed corporate payloads",
      "Seamless ERP inventory integration",
    ],
    placeholder: "Enter Logistics / Fleet Company Name",
  },
  {
    key: "FINANCE",
    label: "Factoring & Finance",
    icon: Landmark,
    accent: "#D4A843",
    accentMuted: "rgba(212,168,67,0.1)",
    hook: "Deploy your capital safely into verified, real-time B2B hospitality transactions.",
    bullets: [
      "Risk mitigation via official ETA telemetry",
      "Automated transaction scoring",
      "Complete liability protection",
    ],
    placeholder: "Enter Financial Institution Name",
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

const seasonForecast = [
  { month: "Jun", occupancy: 72, demand: 0.78, priceIndex: 105, season: "Low" },
  { month: "Jul", occupancy: 85, demand: 0.92, priceIndex: 118, season: "High" },
  { month: "Aug", occupancy: 94, demand: 1.0, priceIndex: 132, season: "Peak" },
  { month: "Sep", occupancy: 78, demand: 0.82, priceIndex: 108, season: "Med" },
  { month: "Oct", occupancy: 68, demand: 0.71, priceIndex: 98, season: "Low" },
  { month: "Nov", occupancy: 62, demand: 0.64, priceIndex: 92, season: "Low" },
  { month: "Dec", occupancy: 88, demand: 0.96, priceIndex: 128, season: "Peak" },
];

const STATS = [
  { value: "680+", label: "Verified Suppliers", icon: Store },
  { value: "94%", label: "Forecast Accuracy", icon: TrendingUp },
  { value: "24h", label: "Supplier Settlement", icon: Clock },
  { value: "40%", label: "Logistics Cost Reduction", icon: Truck },
];

const FEATURES = [
  { icon: BrainCircuit, title: "AI Demand Forecasting", desc: "14-day forward predictions analyzing occupancy curves, booked events, and historical consumption patterns across every property.", color: "#39FF14" },
  { icon: Receipt, title: "ETA E-Invoicing V2", desc: "Native Egyptian Tax Authority API pipeline. RSA 2048-bit digital signing with cryptographic UUID validation at point of goods receipt.", color: "#39FF14" },
  { icon: Truck, title: "Shared-Route Logistics", desc: "AI-driven route consolidation across 6 governorates. Up to 40% cost reduction via intelligent multi-supplier load matching.", color: "#39FF14" },
  { icon: Banknote, title: "Embedded Reverse Factoring", desc: "Competitive bidding among 4+ licensed grantors. Non-recourse, bank-direct settlement. Suppliers paid in 24 hours.", color: "#39FF14" },
  { icon: ShieldCheck, title: "FRA Anti-Fraud Compliance", desc: "Mandatory three-way matching: PO + ETA UUID + Signed Digital Delivery Note. SHA-256 cryptographic audit trail.", color: "#39FF14" },
  { icon: BarChart3, title: "Cost Control Engine", desc: "Real-time spend analysis, anomaly detection, and budget optimization across every property, department, and vendor.", color: "#39FF14" },
];

const ROLES = [
  {
    icon: Building2,
    title: "For Hotels & Resorts",
    subtitle: "The Buyers",
    desc: "Pre-occurrence budget blockades at the individual resort branch level. Every PO validated against pre-approved allocation ceilings. Stretch working capital to net-60+ without balance-sheet debt.",
    href: "/register",
    cta: "Register Your Property Group",
    features: ["Pre-occurrence budget enforcement per property branch", "Net-60+ working capital without balance-sheet liability", "Automated PO-to-invoice matching with authority matrix", "Real-time credit utilization dashboard"],
    accent: "#39FF14",
  },
  {
    icon: Store,
    title: "For Suppliers & Vendors",
    subtitle: "The Providers",
    desc: "The moment your on-site Goods Received Note is cleared and the ETA cryptographic UUID is validated, your invoice enters the non-recourse factoring pool. Bank-direct settlement within 24 hours.",
    href: "/register",
    cta: "Join as a Verified Supplier",
    features: ["GRN clearance triggers automatic factoring eligibility", "Non-recourse, bank-direct payment within 24 hours", "Zero collection overhead across multi-property groups", "Real-time receivables ledger with settlement tracking"],
    accent: "#22C55E",
  },
  {
    icon: Landmark,
    title: "For Funders & Capital Partners",
    subtitle: "The Capital",
    desc: "Pre-cleared, high-velocity corporate deal flow — every invoice has passed tenant validation, ETA UUID verification, delivery sign-off, and automated three-way matching.",
    href: "/register",
    cta: "Apply as a Licensed Funder",
    features: ["SHA-256 cryptographic audit trail on every transition", "Three-way matching: PO + ETA UUID + Signed Digital Delivery Note", "Normalized bidding parameters across all hotel debtors", "Automated interest accrual and late repayment protocols"],
    accent: "#3B82F6",
  },
];

const PIPELINE = [
  { step: "01", title: "AI Forecast & PO Generation", desc: "Engine predicts demand 14 days ahead from occupancy, events, and seasonality. Auto-generates POs against budget ceilings.", icon: BrainCircuit },
  { step: "02", title: "Authority Matrix Approval", desc: "POs route through your corporate authority matrix. Pre-occurrence budget blockades enforce spending limits.", icon: ShieldCheck },
  { step: "03", title: "ETA Invoice & GRN Clearance", desc: "Invoices digitally signed and submitted to Tax Authority. On-site GRN clearance triggers UUID validation.", icon: Receipt },
  { step: "04", title: "Logistics & Delivery", desc: "Shared-route consolidation. Multi-supplier load matching. 48-hour delivery guarantee to any Egyptian governorate.", icon: Truck },
  { step: "05", title: "Factoring & Settlement", desc: "Pre-cleared invoices enter competitive bidding. Funders bid. Supplier paid in 24hrs. Hotel keeps net-60+.", icon: Banknote },
];

// ─── RevealSection ────────────────────────────────────────────────
function RevealSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────
export default function HomePage() {
  const [activeSector, setActiveSector] = useState<SectorKey>("HOTEL");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const currentSector = SECTORS.find((s) => s.key === activeSector)!;
  const maxOccupancy = Math.max(...seasonForecast.map((s) => s.occupancy));
  const doubledIndex = [...marketIndex, ...marketIndex];

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim() || !email.trim()) return;
    setIsSubmitting(true);
    try {
      await fetch("/api/v1/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          email,
          sector: activeSector,
        }),
      });
      setSubmitSuccess(true);
      setCompanyName("");
      setEmail("");
      setTimeout(() => setSubmitSuccess(false), 4000);
    } catch {
      // silent fail — non-critical
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
          HERO
          ═══════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(57,255,20,0.04) 0%, transparent 70%)" }} />

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-5 gap-10 items-start">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ border: "1px solid rgba(255,255,255,0.08)", backgroundColor: "rgba(255,255,255,0.02)" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#39FF14" }} />
                <span className="text-[10px] text-white/50 font-medium uppercase tracking-wider">Live · Egyptian Hospitality Procurement Infrastructure</span>
              </div>

              <h1 className="text-[36px] sm:text-[48px] md:text-[58px] font-bold leading-[1.02] tracking-tight mb-6" style={{ color: "#ffffff" }}>
                Corporate Working Capital,
                <br />
                <span className="text-gradient-lime">Re-Engineered</span> for Egyptian Hospitality
              </h1>

              <p className="text-[15px] text-white/50 leading-relaxed max-w-lg mb-4">
                HotelsVendors is the middleware operating system that sits between your property&apos;s procurement desk, your supplier&apos;s balance sheet, and your funder&apos;s capital deployment engine — enforcing pre-occurrence budget blockades, automating ETA cryptographic compliance, and routing pre-cleared invoices into a competitive reverse factoring pool.
              </p>
              <p className="text-[13px] text-white/30 leading-relaxed max-w-lg mb-8">
                No balance-sheet debt. No 180-day collection chases. No unverified paper.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>
                  Request Enterprise Access <ArrowRight size={15} />
                </Link>
                <Link href="/platform" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                  Architecture Overview
                </Link>
              </div>

              <div className="flex items-center gap-6 flex-wrap">
                <div className="flex -space-x-2">
                  {["HV", "INVO", "CBE", "ETA"].map((a, i) => (
                    <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.06)", border: "2px solid #000000" }}>
                      <span className="text-[8px] font-bold text-white/30">{a}</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-white/25">
                  <span className="text-white/50 font-medium">Trusted by 680+ suppliers</span>
                  <br />across Egypt&apos;s hospitality sector
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="rounded-2xl p-5" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Live Market Rates</span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#22C55E" }} />
                    <span className="text-[10px] text-white/25">Real-time</span>
                  </span>
                </div>
                <div className="space-y-3">
                  {liveRates.map((rate, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg transition-colors hover:bg-white/[0.02]">
                      <div>
                        <p className="text-[12px] font-medium text-white/70">{rate.label}</p>
                        <p className="text-[10px] text-white/25">{rate.source}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[14px] font-mono font-medium text-white/80">{rate.value}</p>
                        <p className={`text-[10px] font-medium ${rate.change.startsWith("+") ? "text-[#22C55E]" : "text-[#EF4444]"}`}>{rate.change}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[22px] font-bold" style={{ color: "#39FF14" }}>24h</p>
                  <p className="text-[9px] text-white/25 uppercase tracking-wider">Settlement</p>
                </div>
                <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p className="text-[22px] font-bold text-[#22C55E]">40%</p>
                  <p className="text-[9px] text-white/25 uppercase tracking-wider">Cost Cut</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SECTOR ROUTER — Dynamic Tab System
          ═══════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center bottom, rgba(57,255,20,0.02) 0%, transparent 60%)" }} />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <RevealSection>
            <div className="text-center mb-10">
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2 block">Choose Your Role</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-3">
                One Platform. Four Entry Points.
              </h2>
              <p className="text-white/40 text-[14px] max-w-xl mx-auto leading-relaxed">
                Select your sector below to see how HotelsVendors re-engineers your specific workflow — then request access with one click.
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
                  <button
                    key={sector.key}
                    onClick={() => setActiveSector(sector.key)}
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
                  </button>
                );
              })}
            </div>
          </RevealSection>

          {/* ── Dynamic Sector Content ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSector}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="grid lg:grid-cols-5 gap-6 items-start">
                {/* Left: Hook + Bullets */}
                <div className="lg:col-span-3 rounded-2xl p-8" style={{ backgroundColor: "#0a0a0a", border: `1px solid ${currentSector.accent}15` }}>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: currentSector.accentMuted }}>
                      <currentSector.icon size={22} style={{ color: currentSector.accent }} />
                    </div>
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
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0" style={{ backgroundColor: currentSector.accentMuted }}>
                          <CheckCircle size={12} style={{ color: currentSector.accent }} />
                        </div>
                        <span className="text-[13px] text-white/50 leading-relaxed">{bullet}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={`/register?sector=${activeSector}`}
                    className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.15)]"
                    style={{ backgroundColor: currentSector.accent, color: "#000000" }}
                  >
                    Get Started as {currentSector.label.split(" ")[0]} <ArrowRight size={14} />
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
                          style={{
                            backgroundColor: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
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
                          style={{
                            backgroundColor: "rgba(255,255,255,0.03)",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                          onFocus={(e) => { e.target.style.borderColor = currentSector.accent + "40"; }}
                          onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.08)"; }}
                        />
                      </div>

                      {/* Hidden sector tag — submitted with form */}
                      <input type="hidden" name="sector" value={activeSector} />

                      <button
                        type="submit"
                        disabled={isSubmitting || !companyName.trim() || !email.trim()}
                        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-[13px] font-semibold rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                          backgroundColor: currentSector.accent,
                          color: "#000000",
                        }}
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
                        Sector: <span className="font-medium" style={{ color: currentSector.accent }}>{activeSector}</span> · No credit card required
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
          THREE PILLARS
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="text-center mb-14">
              <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2 block">Network Architecture</span>
              <h2 className="text-[clamp(26px,3.5vw,40px)] font-bold tracking-tight text-white mb-4">
                Three Participants. One Settlement Engine.
              </h2>
              <p className="text-white/40 text-[14px] max-w-2xl mx-auto leading-relaxed">
                Every transaction on HotelsVendors simultaneously serves the hotel&apos;s cashflow mandate, the supplier&apos;s liquidity requirement, and the funder&apos;s asset-quality threshold — with zero manual reconciliation.
              </p>
            </div>
          </RevealSection>

          <div className="grid lg:grid-cols-3 gap-5">
            {ROLES.map((role, i) => (
              <RevealSection key={role.title}>
                <div className="rounded-2xl p-0 overflow-hidden transition-all duration-300 hover:scale-[1.02]" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", transitionDelay: `${i * 80}ms` }}>
                  <div className="h-1.5" style={{ background: `linear-gradient(to right, ${role.accent}, ${role.accent}88)` }} />
                  <div className="p-7">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${role.accent}15` }}>
                        <role.icon size={22} style={{ color: role.accent }} />
                      </div>
                      <div>
                        <h3 className="text-[16px] font-bold text-white">{role.title}</h3>
                        <p className="text-[10px] uppercase tracking-[0.15em] font-semibold" style={{ color: role.accent }}>{role.subtitle}</p>
                      </div>
                    </div>
                    <p className="text-[12px] text-white/40 leading-relaxed mb-4">{role.desc}</p>
                    <div className="space-y-2.5 mb-6">
                      {role.features.map((item, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <CheckCircle size={13} className="mt-0.5 flex-shrink-0" style={{ color: role.accent }} />
                          <span className="text-[11px] text-white/40">{item}</span>
                        </div>
                      ))}
                    </div>
                    <Link href={role.href} className="inline-flex items-center gap-1.5 text-[11px] font-semibold py-2.5 px-4 rounded-xl transition-all" style={{ color: role.accent, border: `1px solid ${role.accent}30` }}>
                      {role.cta} <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
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
              <p className="text-white/40 text-[14px] max-w-2xl mx-auto leading-relaxed">
                Every invoice that moves through HotelsVendors is validated, signed, and settled by infrastructure — not by people chasing spreadsheets.
              </p>
            </div>
          </RevealSection>

          <div className="grid lg:grid-cols-3 gap-5">
            {[
              { icon: <FileText size={18} style={{ color: "#39FF14" }} />, title: "ETA V2 API Pipeline", subtitle: "Zero-Exposure Regulatory Shield", desc: "Direct integration with the Egyptian Tax Authority's e-invoicing API. Cryptographic UUID validation fires the millisecond goods arrive at the property. Automated RSA 2048-bit digital signing. Full Phase 1 & 2 compliance.", badge: "ETA UUID · RSA-2048 · Phase 1 & 2 Compliant", badgeIcon: <Shield size={13} style={{ color: "#39FF14" }} />, bg: "rgba(57,255,20,0.1)" },
              { icon: <CreditCard size={18} style={{ color: "#22C55E" }} />, title: "Standalone Payment & Clearing", subtitle: "Bank-Direct Settlement Engine", desc: "Capital routes programmatically from funder desks straight to supplier IBANs — no intermediary accounts, no manual wire approvals. The engine manages automated interest accruals, late repayment protocols, and settlement reconciliation in real time.", badge: "Programmatic Routing · Auto Accrual · Immutable Ledger", badgeIcon: <Zap size={13} style={{ color: "#22C55E" }} />, bg: "rgba(34,197,94,0.1)" },
              { icon: <Shield size={18} style={{ color: "#3B82F6" }} />, title: "Institutional Alignment", subtitle: "Compliance & Security Frameworks", desc: "Built for institutional-grade deployment. I-Score Assessment Readiness, FRA Anti-Fraud Compliance, and alignment against ISO/IEC 27001 & SOC 2 Type II control frameworks.", badges: ["I-Score Assessment Ready", "FRA Anti-Fraud: 3-Way Match", "ISO/IEC 27001 Aligned", "SOC 2 Type II Audit Ready"], bg: "rgba(59,130,246,0.1)" },
            ].map((card, i) => (
              <RevealSection key={card.title}>
                <div className="rounded-2xl p-6 h-full" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
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
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          SEASON FORECAST
          ═══════════════════════════════════════════ */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-1 block">Hospitality Intelligence</span>
                <h2 className="text-[22px] font-bold text-white">Seasonal Occupancy & Demand Forecast</h2>
              </div>
              <span className="flex items-center gap-1.5 text-[10px] text-white/25"><Calendar size={12} />Jun — Dec 2026</span>
            </div>
            <div className="rounded-2xl p-6" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-end gap-3 h-44 mb-5 px-2">
                {seasonForecast.map((s, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2 group relative">
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white/50 whitespace-nowrap px-2.5 py-1 rounded-lg z-10" style={{ backgroundColor: "#1a1a1a" }}>
                      {s.occupancy}% occ · Idx {s.priceIndex}
                    </div>
                    <div className="w-full rounded-lg overflow-hidden relative transition-all group-hover:scale-105" style={{ height: `${(s.occupancy / maxOccupancy) * 140}px` }}>
                      <div
                        className="absolute bottom-0 left-0 right-0 rounded-lg transition-all"
                        style={{
                          height: "100%",
                          background: s.season === "Peak" ? "linear-gradient(to top, rgba(57,255,20,0.7), rgba(57,255,20,0.2))" :
                            s.season === "High" ? "linear-gradient(to top, rgba(59,130,246,0.6), rgba(59,130,246,0.2))" :
                            s.season === "Med" ? "linear-gradient(to top, rgba(255,255,255,0.15), rgba(255,255,255,0.04))" :
                            "linear-gradient(to top, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-white/25 font-medium">{s.month}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {seasonForecast.map((s, i) => (
                  <div key={i} className="text-center">
                    <p className="text-[12px] font-semibold text-white/70">{s.occupancy}%</p>
                    <p className="text-[9px] text-white/25">occ</p>
                    <span className={`inline-block mt-1 text-[8px] px-1.5 py-0.5 rounded-full font-medium ${
                      s.season === "Peak" ? "text-[#39FF14]" : s.season === "High" ? "text-blue-400" : s.season === "Med" ? "text-white/40" : "text-white/20"
                    }`} style={{
                      backgroundColor: s.season === "Peak" ? "rgba(57,255,20,0.1)" :
                        s.season === "High" ? "rgba(59,130,246,0.1)" :
                        s.season === "Med" ? "rgba(255,255,255,0.05)" :
                        "rgba(255,255,255,0.03)",
                    }}>{s.season}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-6 mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {[
                  { label: "Peak", dot: "#39FF14" },
                  { label: "High", dot: "#3B82F6" },
                  { label: "Medium", dot: "rgba(255,255,255,0.3)" },
                  { label: "Low", dot: "rgba(255,255,255,0.1)" },
                ].map((l, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: l.dot }} />
                    <span className="text-[9px] text-white/25">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </RevealSection>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          PLATFORM CAPABILITIES
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
              <RevealSection key={f.title}>
                <Link href="/platform" className="rounded-2xl p-6 block group hover-lift h-full" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", transitionDelay: `${i * 60}ms` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                    <f.icon size={20} style={{ color: "#39FF14" }} />
                  </div>
                  <h3 className="text-[14px] font-bold mb-2 text-white group-hover:text-[#39FF14] transition-colors">{f.title}</h3>
                  <p className="text-[12px] text-white/40 leading-relaxed mb-4">{f.desc}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/20 group-hover:text-[#39FF14] transition-all">
                    Learn more <ChevronRight size={12} />
                  </span>
                </Link>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          HOW IT WORKS
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
              <RevealSection key={step.step}>
                <div className="rounded-2xl p-6 text-center hover-lift relative h-full" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)", transitionDelay: `${i * 80}ms` }}>
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
                </div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          STATS
          ═══════════════════════════════════════════ */}
      <section className="py-16" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <RevealSection>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((s, i) => (
                <div key={s.label} className="rounded-2xl p-6 text-center hover-lift" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <s.icon size={18} className="mx-auto mb-3" style={{ color: "rgba(255,255,255,0.15)" }} />
                  <p className="text-[32px] font-bold text-white mb-1">{s.value}</p>
                  <p className="text-[10px] text-white/25 uppercase tracking-wider font-medium">{s.label}</p>
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      <hr className="section-divider" />

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(57,255,20,0.04) 0%, transparent 70%)" }} />
        <div className="mx-auto max-w-7xl px-6 text-center relative">
          <RevealSection>
            <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2 block">Enterprise Onboarding</span>
            <h2 className="text-[clamp(28px,4vw,42px)] font-bold mb-5 tracking-tight text-white">
              Your Procurement Infrastructure Shouldn&apos;t<br />Depend on Spreadsheets
            </h2>
            <p className="text-[14px] text-white/40 mb-8 leading-relaxed max-w-lg mx-auto">
              HotelsVendors is the middleware layer that connects your property group&apos;s procurement operations to institutional capital — with cryptographic compliance, automated settlement, and zero manual reconciliation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/register" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(57,255,20,0.2)]" style={{ backgroundColor: "#39FF14", color: "#000000" }}>
                Request Enterprise Access <ArrowRight size={15} />
              </Link>
              <Link href="/invo" className="inline-flex items-center gap-2 px-8 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                INVO Developer Platform
              </Link>
            </div>
            <p className="text-[10px] text-white/20 mt-6">No credit card required · 14-day enterprise trial · Dedicated onboarding</p>
          </RevealSection>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
