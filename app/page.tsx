"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Search, ShoppingCart, TrendingUp, Shield, Zap, ArrowRight,
  Package, Truck, CreditCard, Brain, Menu, X, Building2, Factory,
  Landmark, Clock, Lock, HeartHandshake, BarChart3, ChevronRight, Eye,
  Globe, Sparkles, FileCheck, BadgeCheck, Star, Users, CheckCircle2,
  MousePointerClick, Workflow, MessageSquare, Receipt, Boxes,
} from "lucide-react";

/* ─── Types ─── */
interface Product {
  id: string; sku: string; name: string; category: string;
  unitPrice: number; stockQuantity: number; minOrderQty: number;
  images?: string | null; supplier?: { name: string };
}
interface Supplier {
  id: string; name: string; city: string; certifications?: string;
}

/* ─── Animation Presets ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/* ─── Components ─── */

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-500)]/[0.06] border border-[var(--accent-500)]/[0.12] text-[11px] font-semibold text-[var(--accent-400)] tracking-wider uppercase">
      {children}
    </span>
  );
}

function BentoCard({
  icon, title, desc, className = "", delay = 0,
}: {
  icon: React.ReactNode; title: string; desc: string;
  className?: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`group relative rounded-2xl border border-[var(--border-default)] bg-[var(--surface)]/[0.5] hover:bg-[var(--surface-raised)]/[0.6] hover:border-[var(--border-strong)] transition-all duration-500 p-7 ${className}`}
    >
      <div className="w-11 h-11 rounded-xl bg-[var(--accent-500)]/[0.08] border border-[var(--accent-500)]/[0.12] flex items-center justify-center text-[var(--accent-400)] mb-5 group-hover:scale-105 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold text-[var(--foreground)] mb-2 tracking-tight">{title}</h3>
      <p className="text-[13px] text-[var(--foreground-tertiary)] leading-relaxed">{desc}</p>
    </motion.div>
  );
}

function StepCard({
  step, title, desc, icon, delay = 0,
}: {
  step: string; title: string; desc: string;
  icon: React.ReactNode; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      <div className="flex items-center gap-3 mb-5">
        <div className="w-11 h-11 rounded-xl bg-[var(--accent-500)]/[0.08] border border-[var(--accent-500)]/[0.12] flex items-center justify-center text-[var(--accent-400)]">
          {icon}
        </div>
        <span className="text-[11px] font-mono text-[var(--foreground-muted)] tracking-wide">Step {step}</span>
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2 tracking-tight">{title}</h3>
      <p className="text-[13px] text-[var(--foreground-tertiary)] leading-relaxed">{desc}</p>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  useEffect(() => {
    fetch("/api/products?limit=8")
      .then((r) => r.json())
      .then((d) => { if (d.success) setHeroProducts(d.data.slice(0, 8)); });
    fetch("/api/suppliers?limit=6")
      .then((r) => r.json())
      .then((d) => { if (d.success) setSuppliers(d.data.slice(0, 6)); });
  }, []);

  const filtered = heroProducts.filter(
    (p) =>
      (search === "" || p.name.toLowerCase().includes(search.toLowerCase())) &&
      (activeCategory === "ALL" || p.category === activeCategory)
  );

  const cats = [
    { key: "ALL", label: "All" },
    { key: "F_AND_B", label: "F&B" },
    { key: "CONSUMABLES", label: "Housekeeping" },
    { key: "GUEST_SUPPLIES", label: "Amenities" },
    { key: "FFE", label: "FF&E" },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased selection:bg-[var(--accent-500)]/25">
      {/* ═══════════════════════════════════════
          NAVBAR
          ═══════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-default)] bg-[var(--background)]/75 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[var(--surface)] ring-1 ring-[var(--border-strong)]">
                <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1.5" />
              </div>
              <span className="text-sm font-bold tracking-wider text-[var(--foreground)]">Hotels Vendors</span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-[var(--foreground-tertiary)]">
              {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-[var(--foreground)] transition-colors duration-200">
                  {item}
                </a>
              ))}
            </div>

            {/* Desktop CTAs */}
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-[13px] font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="px-4 py-2 text-[13px] font-semibold rounded-xl bg-[var(--foreground)] text-[var(--foreground-inverse)] hover:bg-[var(--foreground)]/90 transition-all duration-200 hover:-translate-y-px">
                Get Started
              </Link>
            </div>

            {/* Mobile Toggle */}
            <button className="lg:hidden p-2 text-[var(--foreground-secondary)]" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="lg:hidden border-t border-[var(--border-default)] bg-[var(--background)]/95 backdrop-blur-xl px-6 py-5 space-y-1">
            {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="block py-2 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)]" onClick={() => setMobileMenu(false)}>
                {item}
              </a>
            ))}
            <div className="pt-4 flex gap-3">
              <Link href="/login" className="flex-1 text-center py-2.5 text-sm rounded-xl border border-[var(--border-default)] text-[var(--foreground-secondary)]">
                Sign In
              </Link>
              <Link href="/register" className="flex-1 text-center py-2.5 text-sm rounded-xl bg-[var(--foreground)] text-[var(--foreground-inverse)] font-semibold">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════
          HERO
          ═══════════════════════════════════════ */}
      <section className="relative pt-36 pb-28 lg:pt-44 lg:pb-36 overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-5%,rgba(99,102,241,0.08),transparent)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[var(--accent-500)]/[0.025] rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible" className="mb-8">
              <SectionBadge>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-60" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--success)]" />
                </span>
                Now Live in Egypt
              </SectionBadge>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1} variants={fadeUp} initial="hidden" animate="visible"
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[var(--foreground)] mb-7 leading-[1.05]"
            >
              The Procurement Platform{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent-400)] to-[var(--accent-300)]">
                Built for Egyptian Hotels
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              custom={2} variants={fadeUp} initial="hidden" animate="visible"
              className="text-lg text-[var(--foreground-tertiary)] mb-12 leading-relaxed max-w-xl mx-auto"
            >
              Connect with verified suppliers, automate purchase orders, and stay ETA-compliant — all in one place.
            </motion.p>

            {/* CTAs */}
            <motion.div
              custom={3} variants={fadeUp} initial="hidden" animate="visible"
              className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
            >
              <Link href="/register" className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold rounded-xl bg-[var(--foreground)] text-[var(--foreground-inverse)] hover:bg-[var(--foreground)]/90 transition-all duration-200 hover:-translate-y-px flex items-center justify-center gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/catalog" className="w-full sm:w-auto px-7 py-3.5 text-sm font-semibold rounded-xl border border-[var(--border-default)] text-[var(--foreground-secondary)] hover:bg-[var(--surface)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)] transition-all duration-200 flex items-center justify-center gap-2">
                <Eye className="w-4 h-4" /> Browse Catalog
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              custom={5} variants={fadeUp} initial="hidden" animate="visible"
              className="flex items-center justify-center gap-10 lg:gap-14 text-center"
            >
              {[
                { val: "52+", label: "Hotels Onboarded" },
                { val: "68+", label: "Verified Suppliers" },
                { val: "15M+", label: "EGP GMV Processed" },
                { val: "99.9%", label: "ETA Compliant" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-[var(--foreground)] tracking-tight">{s.val}</div>
                  <div className="text-[11px] text-[var(--foreground-muted)] mt-1 tracking-wide">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TRUST BAR
          ═══════════════════════════════════════ */}
      <section className="border-y border-[var(--border-default)] py-10">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-[11px] text-[var(--foreground-muted)] uppercase tracking-[0.15em] mb-7">
            Trusted by leading hotels across Egypt
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {["Marriott Mena House", "Four Seasons Cairo", "Hilton Alexandria", "Mövenpick El Gouna", "Steigenberger Tahrir", "Kempinski Nile", "Jaz Aquamarine", "Rixos Sharm"].map((h) => (
              <span key={h} className="text-sm text-[var(--foreground-muted)]/40 font-medium whitespace-nowrap hover:text-[var(--foreground-muted)]/70 transition-colors">
                {h}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FEATURES — BENTO GRID
          ═══════════════════════════════════════ */}
      <section id="product" className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <SectionBadge>Platform</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-5 text-[var(--foreground)]">
              Everything you need to procure smarter
            </h2>
            <p className="text-[var(--foreground-tertiary)] max-w-lg mx-auto text-lg">
              From discovery to delivery, every step is optimized for Egyptian hospitality.
            </p>
          </motion.div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr">
            <BentoCard
              icon={<Clock className="w-5 h-5" />}
              title="Save 15+ Hours Weekly"
              desc="Digital catalog, auto-POs, and approval workflows cut procurement admin by 80%."
              className="md:col-span-2"
              delay={0}
            />
            <BentoCard
              icon={<BarChart3 className="w-5 h-5" />}
              title="Cut Costs 20–30%"
              desc="AI price comparison across verified suppliers ensures you always pay the best price."
              delay={0.1}
            />
            <BentoCard
              icon={<FileCheck className="w-5 h-5" />}
              title="100% ETA Compliant"
              desc="Every invoice digitally signed and submitted to ETA automatically. Zero penalties."
              delay={0.15}
            />
            <BentoCard
              icon={<Lock className="w-5 h-5" />}
              title="Bank-Grade Security"
              desc="End-to-end encryption, role-based access, and immutable audit trails."
              delay={0.2}
            />
            <BentoCard
              icon={<HeartHandshake className="w-5 h-5" />}
              title="Verified Suppliers"
              desc="KYC-checked, rated, and audited. HACCP and ISO certifications verified on-site."
              className="md:col-span-2"
              delay={0.25}
            />
            <BentoCard
              icon={<CreditCard className="w-5 h-5" />}
              title="Embedded Factoring"
              desc="Get paid in 24–48 hours instead of 60–90 days. Built-in liquidity for suppliers."
              className="md:col-span-3"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════ */}
      <section id="solutions" className="py-32 border-y border-[var(--border-default)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <SectionBadge>How it works</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-5 text-[var(--foreground)]">
              Three steps to smarter procurement
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
            <StepCard
              step="01"
              title="Search & Compare"
              desc="Browse 5 categories of hotel supplies. Filter by price, MOQ, supplier tier, and certification."
              icon={<Search className="w-5 h-5" />}
              delay={0}
            />
            <StepCard
              step="02"
              title="Smart AI Purchase"
              desc="Our AI officer finds the lowest price across suppliers, checks authority rules, and auto-approves POs."
              icon={<Brain className="w-5 h-5" />}
              delay={0.1}
            />
            <StepCard
              step="03"
              title="Track & Pay"
              desc="Monitor delivery in real-time. Invoices are ETA-compliant. Pay via embedded factoring or direct transfer."
              icon={<Truck className="w-5 h-5" />}
              delay={0.2}
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          LIVE CATALOG
          ═══════════════════════════════════════ */}
      <section id="catalog" className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-14"
          >
            <SectionBadge>Marketplace</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-5 text-[var(--foreground)]">
              Browse verified suppliers
            </h2>
            <p className="text-[var(--foreground-tertiary)] text-lg">
              Real products from real Egyptian suppliers
            </p>
          </motion.div>

          {/* Search + Filters */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative mb-5">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--foreground-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, SKUs, suppliers..."
                className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl bg-[var(--surface)] border border-[var(--border-default)] focus:border-[var(--accent-500)]/30 focus:outline-none focus:ring-2 focus:ring-[var(--accent-500)]/10 transition-all placeholder:text-[var(--foreground-muted)]"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {cats.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setActiveCategory(c.key)}
                  className={`px-4 py-1.5 text-[12px] rounded-full border transition-all duration-200 ${
                    activeCategory === c.key
                      ? "bg-[var(--accent-500)]/10 border-[var(--accent-500)]/20 text-[var(--accent-400)] font-medium"
                      : "bg-[var(--surface)] border-[var(--border-default)] text-[var(--foreground-tertiary)] hover:border-[var(--border-strong)] hover:text-[var(--foreground-secondary)]"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {(filtered.length > 0 ? filtered : heroProducts).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, duration: 0.4 }}
                className="group rounded-2xl overflow-hidden border border-[var(--border-default)] bg-[var(--surface)]/[0.4] hover:border-[var(--border-strong)] hover:bg-[var(--surface)]/[0.7] transition-all duration-400 hover:-translate-y-0.5"
              >
                <div className="aspect-[4/3] bg-[var(--surface)] flex items-center justify-center">
                  <Package className="w-6 h-6 text-[var(--foreground-muted)]/25 group-hover:text-[var(--foreground-muted)]/40 transition-colors" />
                </div>
                <div className="p-3.5">
                  <div className="text-[9px] font-mono text-[var(--foreground-muted)] mb-1">{p.sku}</div>
                  <div className="text-[13px] font-medium truncate mb-1 text-[var(--foreground)]">{p.name}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)] truncate mb-2.5">{p.supplier?.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[var(--success)]">
                      EGP {p.unitPrice.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-[var(--foreground-muted)]">MOQ {p.minOrderQty}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {heroProducts.length === 0 && (
              <div className="col-span-full text-center py-20 text-[var(--foreground-muted)]">
                <div className="animate-pulse">Loading marketplace...</div>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors font-medium">
              View Full Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          AI ENGINE
          ═══════════════════════════════════════ */}
      <section className="py-32 border-y border-[var(--border-default)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <SectionBadge>AI Engine</SectionBadge>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-6 text-[var(--foreground)]">
                Intelligence that saves time and money
              </h2>
              <p className="text-[var(--foreground-tertiary)] leading-relaxed mb-10 text-lg">
                Our Tri-Layer Guardian combines LLM reasoning, WASM rule engines, and human oversight to make procurement decisions faster and safer.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <TrendingUp className="w-5 h-5" />, title: "Smart Deals", desc: "AI scans all supplier prices for the same SKU and surfaces the lowest offer." },
                  { icon: <ShoppingCart className="w-5 h-5" />, title: "AI Purchasing Officer", desc: "Auto-generates POs, routes through authority matrix, approves under-limit orders." },
                  { icon: <Sparkles className="w-5 h-5" />, title: "Product Alternatives", desc: "When stock is low, AI suggests equivalent products from verified vendors." },
                ].map((item, i) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-start gap-4 p-4 rounded-xl bg-[var(--surface)]/[0.4] border border-[var(--border-default)] hover:border-[var(--border-strong)] transition-colors duration-300"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[var(--accent-500)]/[0.08] flex items-center justify-center text-[var(--accent-400)] shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1 text-[var(--foreground)]">{item.title}</h4>
                      <p className="text-[12px] text-[var(--foreground-tertiary)]">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Right: Chat Mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)]/[0.4] p-6 backdrop-blur-sm">
                <div className="flex items-center gap-2.5 mb-5 pb-5 border-b border-[var(--border-default)]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--error)]/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--warning)]/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[var(--success)]/50" />
                  <span className="ml-2 text-[10px] text-[var(--foreground-muted)] font-mono tracking-wide">AI Procurement Assistant</span>
                </div>
                <div className="space-y-3.5">
                  {[
                    { type: "user", text: "What's my hotel's biggest spend category this month?" },
                    { type: "ai", text: "F&B represents 62% of your spend (EGP 847,500). I recommend locking rates with Cairo Poultry before their scheduled price increase on May 15." },
                    { type: "user", text: "Any suppliers with delivery delays?" },
                    { type: "ai", text: "2 suppliers in your active POs have delays: Nile Textiles (+2 days) and Wadi Foods (+1 day). I've flagged alternatives from verified vendors." },
                  ].map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[11px] leading-relaxed ${
                          msg.type === "user"
                            ? "bg-[var(--accent-500)]/10 text-[var(--foreground-secondary)] rounded-br-md"
                            : "bg-[var(--surface-raised)] text-[var(--foreground-tertiary)] rounded-bl-md border border-[var(--border-default)]"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════ */}
      <section className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <SectionBadge>Testimonials</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-5 text-[var(--foreground)]">
              Trusted by procurement teams
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                quote: "We cut our procurement admin from 3 days a week to half a day. The AI officer handles routine orders while we focus on strategy.",
                name: "Amr El-Sayed",
                role: "Procurement Director",
                hotel: "Marriott Mena House, Cairo",
              },
              {
                quote: "The factoring integration is a game-changer. We get paid in 48 hours instead of 90 days. Cash flow transformed overnight.",
                name: "Hana Rashid",
                role: "Finance Manager",
                hotel: "Four Seasons Nile Plaza",
              },
              {
                quote: "ETA compliance used to keep me up at night. Now it's automatic. Every invoice is signed and submitted without us touching it.",
                name: "Omar Khalil",
                role: "Operations Head",
                hotel: "Hilton Alexandria Corniche",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="rounded-2xl border border-[var(--border-default)] bg-[var(--surface)]/[0.3] p-7 hover:border-[var(--border-strong)] transition-colors duration-400"
              >
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5 text-[var(--warning)] fill-[var(--warning)]" />
                  ))}
                </div>
                <p className="text-[14px] text-[var(--foreground-secondary)] leading-relaxed mb-6 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[var(--accent-500)]/10 flex items-center justify-center text-[var(--accent-400)] text-xs font-bold">
                    {t.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--foreground)]">{t.name}</div>
                    <div className="text-[11px] text-[var(--foreground-muted)]">
                      {t.role}, {t.hotel}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA
          ═══════════════════════════════════════ */}
      <section id="enterprise" className="py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl border border-[var(--border-default)] bg-[var(--surface)]/[0.3] p-14 lg:p-20 text-center overflow-hidden"
          >
            {/* Subtle gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(99,102,241,0.06),transparent)]" />

            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-[var(--foreground)]">
                Ready to transform your procurement?
              </h2>
              <p className="text-[var(--foreground-tertiary)] max-w-md mx-auto mb-12 text-lg">
                Join Egypt&apos;s leading hospitality procurement network. Hotels save time, suppliers grow revenue.
              </p>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8">
                {[
                  { icon: <Building2 className="w-5 h-5" />, label: "Join as Hotel", href: "/register?type=hotel", primary: true },
                  { icon: <Factory className="w-5 h-5" />, label: "Join as Supplier", href: "/register?type=supplier", primary: false },
                  { icon: <Landmark className="w-5 h-5" />, label: "Factoring Partner", href: "/register?type=factoring", primary: false },
                  { icon: <Truck className="w-5 h-5" />, label: "Logistics Partner", href: "/register?type=shipping", primary: false },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex flex-col items-center gap-2.5 px-3 py-5 rounded-xl transition-all duration-200 hover:-translate-y-px ${
                      item.primary
                        ? "bg-[var(--foreground)] text-[var(--foreground-inverse)] font-semibold hover:bg-[var(--foreground)]/90"
                        : "bg-[var(--surface)] border border-[var(--border-default)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:border-[var(--border-strong)]"
                    }`}
                  >
                    {item.icon}
                    <span className="text-[11px]">{item.label}</span>
                  </Link>
                ))}
              </div>

              <p className="text-[11px] text-[var(--foreground-muted)] tracking-wide">
                Free 14-day trial &middot; No credit card required &middot; Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════ */}
      <footer className="border-t border-[var(--border-default)] bg-[var(--background-void)]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-5">
                <div className="relative w-8 h-8 rounded-xl overflow-hidden bg-[var(--surface)] ring-1 ring-[var(--border-strong)]">
                  <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1.5" />
                </div>
                <span className="text-sm font-bold tracking-wider text-[var(--foreground)]">Hotels Vendors</span>
              </div>
              <p className="text-[13px] text-[var(--foreground-muted)] max-w-xs leading-relaxed">
                Egypt&apos;s first B2B digital procurement hub for hotels. ETA-compliant, AI-powered, and built for scale.
              </p>
            </div>

            {/* Links */}
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-muted)] font-semibold mb-4">
                Product
              </div>
              <div className="space-y-2.5">
                {["Catalog", "Features", "Solutions", "ETA Compliance"].map((l) => (
                  <a key={l} href="#" className="block text-[13px] text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors">
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-muted)] font-semibold mb-4">
                Company
              </div>
              <div className="space-y-2.5">
                {["About", "Careers", "Contact", "Blog"].map((l) => (
                  <span key={l} className="block text-[13px] text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors cursor-pointer">
                    {l}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-[var(--foreground-muted)] font-semibold mb-4">
                Legal
              </div>
              <div className="space-y-2.5">
                {["Privacy", "Terms", "Security", "ETA e-Invoicing"].map((l) => (
                  <span key={l} className="block text-[13px] text-[var(--foreground-tertiary)] hover:text-[var(--foreground)] transition-colors cursor-pointer">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-[var(--foreground-muted)]">
              © 2026 Hotels Vendors. All rights reserved.
            </div>
            <div className="flex items-center gap-5 text-[11px] text-[var(--foreground-muted)]">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-[var(--success)]" /> SSL Secured
              </span>
              <span className="flex items-center gap-1.5">
                <BadgeCheck className="w-3 h-3 text-[var(--info)]" /> ISO 27001
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-[var(--accent-400)]" /> Cairo, Egypt
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
