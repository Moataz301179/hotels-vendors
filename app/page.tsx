"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Zap, ArrowRight, CheckCircle2, Menu, X, Building2, Package,
  Truck, CreditCard, Landmark, Users, ShieldCheck, Globe,
  Sparkles, BarChart3, Clock, Star, ChevronRight, Search,
} from "lucide-react";

/* ─────────────────────────────────────────
   DATA
   ───────────────────────────────────────── */
const HOTELS = [
  { name: "Marriott Mena House", location: "Cairo", initials: "MH" },
  { name: "Four Seasons Cairo", location: "Nile Plaza", initials: "FS" },
  { name: "Hilton Alexandria", location: "Corniche", initials: "HA" },
  { name: "Mövenpick El Gouna", location: "Red Sea", initials: "MG" },
  { name: "Steigenberger Tahrir", location: "Cairo", initials: "ST" },
  { name: "Kempinski Nile", location: "Garden City", initials: "KN" },
  { name: "Jaz Aquamarine", location: "Hurghada", initials: "JA" },
  { name: "Rixos Sharm", location: "Sharm El-Sheikh", initials: "RS" },
];

const FEATURES = [
  {
    icon: Package,
    title: "Unified Catalog",
    desc: "Browse 10,000+ SKUs across F&B, housekeeping, linens, and engineering from verified Egyptian suppliers.",
    span: "col-span-1",
  },
  {
    icon: Truck,
    title: "Shared Logistics",
    desc: "Coastal-cluster fulfillment with real-time tracking. Cut delivery costs by 40% through route consolidation.",
    span: "col-span-1",
  },
  {
    icon: CreditCard,
    title: "Embedded Factoring",
    desc: "Non-recourse invoice financing integrated at checkout. Suppliers get paid in 48 hours, not 90 days.",
    span: "col-span-1",
  },
  {
    icon: Landmark,
    title: "ETA E-Invoicing",
    desc: "Real-time submission to the Egyptian Tax Authority. Digitally signed, UUID-tracked, fully compliant.",
    span: "col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "Authority Matrix",
    desc: "Multi-level approval chains for purchase orders. Hotel hierarchy, value thresholds, and dual-authorization overrides.",
    span: "col-span-1",
  },
  {
    icon: BarChart3,
    title: "AI Procurement Intelligence",
    desc: "Demand forecasting, price benchmarking, and smart reorder alerts tailored to Egyptian seasonality.",
    span: "col-span-1",
  },
];

const PRICING = [
  {
    name: "Starter",
    price: "0",
    period: "forever free",
    desc: "For small hotels exploring digital procurement",
    features: ["Browse verified catalog", "Basic search & filters", "Manual POs", "Email alerts", "Up to 3 users"],
    highlight: false,
  },
  {
    name: "Professional",
    price: "4,500",
    period: "EGP / month",
    desc: "For growing hotels ready to automate",
    features: ["Everything in Starter", "AI price comparison", "Auto PO generation", "Authority Matrix", "ETA e-invoicing", "Up to 15 users", "Priority support"],
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored pricing",
    desc: "For hotel groups with 5+ properties",
    features: ["Everything in Pro", "Multi-property dashboard", "Opera / SAP integrations", "Dedicated AM", "White-label", "Unlimited users", "SLA guarantee"],
    highlight: false,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ─────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-default)] bg-[var(--surface)]/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[var(--surface-raised)] border border-[var(--border-default)]">
              <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1" />
            </div>
            <span className="text-sm font-bold tracking-wider text-[var(--foreground)]">Hotels Vendors</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="px-3 py-2 text-[13px] font-medium rounded-lg text-[var(--foreground-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-[13px] font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">Sign In</Link>
            <Link href="/register" className="px-5 py-2.5 text-[13px] font-semibold rounded-xl bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)] transition-all hover:-translate-y-px">
              Get Started
            </Link>
          </div>

          <button className="lg:hidden p-2 text-[var(--foreground-secondary)]" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-[var(--border-default)] bg-[var(--surface)] px-6 py-4 space-y-2">
          {["Product", "Solutions", "Pricing", "Enterprise"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block px-3 py-2 text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] rounded-lg hover:bg-[var(--surface-raised)]">{item}</a>
          ))}
          <div className="pt-2 flex gap-2">
            <Link href="/login" className="flex-1 text-center py-2.5 text-sm rounded-xl border border-[var(--border-default)] text-[var(--foreground)] font-medium">Sign In</Link>
            <Link href="/register" className="flex-1 text-center py-2.5 text-sm rounded-xl bg-[var(--accent-500)] text-white font-semibold">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─────────────────────────────────────────
   HERO
   ───────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-[var(--background)] pt-[72px]">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--accent-500)]/8 rounded-full blur-[150px]" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--accent-500)]/5 rounded-full blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-20 w-full">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 text-[11px] font-semibold text-[var(--accent-400)] tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--success)] opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--success)]" />
              </span>
              Now Live in Egypt
            </span>
          </motion.div>

          <motion.h1 variants={fadeUp} className="mt-6 text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-[var(--foreground)]">The Procurement</span>
            <br />
            <span className="text-[var(--accent-400)]">OS for Egyptian</span>
            <br />
            <span className="text-[var(--foreground)]">Hospitality</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mt-6 text-lg text-[var(--foreground-secondary)] max-w-xl leading-relaxed">
            Connect hotels, suppliers, logistics, and factoring on one platform. 
            Fixed pricing. ETA-compliant e-invoicing. AI-powered procurement intelligence.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/register" className="group px-7 py-3.5 text-sm font-semibold rounded-xl bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)] transition-all hover:-translate-y-0.5 flex items-center gap-2">
              Start Free <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/catalog" className="px-7 py-3.5 text-sm font-semibold rounded-xl border border-[var(--border-default)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] hover:border-[var(--border-strong)] transition-all hover:-translate-y-0.5">
              Explore Catalog
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6">
            {[
              { value: "10,000+", label: "Verified SKUs" },
              { value: "1,200+", label: "Suppliers" },
              { value: "EGP 2.4B", label: "GMV Processed" },
              { value: "48h", label: "Avg. Delivery" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
                <p className="text-xs text-[var(--foreground-muted)] mt-0.5">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   TRUST BAR
   ───────────────────────────────────────── */
function TrustBar() {
  return (
    <section className="border-y border-[var(--border-default)] bg-[var(--surface)] py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.15em] text-[var(--foreground-muted)] mb-6">
          Trusted by leading Egyptian hotels
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          {HOTELS.map((h) => (
            <div key={h.name} className="flex items-center gap-2.5 opacity-50 hover:opacity-100 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-default)] flex items-center justify-center text-[10px] font-bold text-[var(--foreground-secondary)]">
                {h.initials}
              </div>
              <span className="text-sm font-medium text-[var(--foreground-secondary)]">{h.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FEATURES — BENTO GRID
   ───────────────────────────────────────── */
function Features() {
  return (
    <section id="product" className="py-24 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} className="text-center mb-16">
          <motion.span variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 text-[11px] font-semibold text-[var(--accent-400)] tracking-widest uppercase">
            Platform Capabilities
          </motion.span>
          <motion.h2 variants={fadeUp} className="mt-4 text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            Everything you need to <span className="text-[var(--accent-400)]">procure smarter</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="mt-3 text-[var(--foreground-secondary)] max-w-2xl mx-auto">
            From catalog discovery to ETA-compliant invoicing — one platform, zero fragmentation.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`group p-6 rounded-2xl border border-[var(--border-default)] bg-[var(--surface)]/60 backdrop-blur-md hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)]/60 transition-all duration-400 hover:-translate-y-1 ${f.span}`}
            >
              <div className="w-10 h-10 rounded-xl bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 flex items-center justify-center text-[var(--accent-400)] mb-4">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-[var(--foreground)] mb-1.5">{f.title}</h3>
              <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   HOW IT WORKS
   ───────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { num: "01", icon: Search, title: "Discover", desc: "Browse verified suppliers across 6 hospitality categories. Filter by price, MOQ, delivery zone, and certification." },
    { num: "02", icon: CheckCircle2, title: "Order", desc: "Build purchase orders with AI-suggested bundles. Route through your Authority Matrix for approval." },
    { num: "03", icon: Truck, title: "Fulfill", desc: "Track shared-logistics delivery in real time. Invoice auto-submits to ETA with digital signature." },
  ];
  return (
    <section id="solutions" className="py-24 bg-[var(--surface)] border-y border-[var(--border-default)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 text-[11px] font-semibold text-[var(--accent-400)] tracking-widest uppercase">
            How It Works
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            From catalog to <span className="text-[var(--accent-400)]">compliance</span> in minutes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-[var(--border-default)]" />
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="relative text-center"
            >
              <div className="w-12 h-12 rounded-full bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 flex items-center justify-center mx-auto mb-5">
                <s.icon className="w-5 h-5 text-[var(--accent-400)]" />
              </div>
              <span className="text-xs font-mono text-[var(--foreground-muted)]">{s.num}</span>
              <h4 className="mt-2 text-lg font-semibold text-[var(--foreground)]">{s.title}</h4>
              <p className="mt-2 text-sm text-[var(--foreground-secondary)] max-w-xs mx-auto">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PRICING
   ───────────────────────────────────────── */
function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-[var(--background)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 text-[11px] font-semibold text-[var(--accent-400)] tracking-widest uppercase">
            Pricing
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
            Simple, transparent <span className="text-[var(--accent-400)]">pricing</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                tier.highlight
                  ? "border-[var(--accent-500)]/30 bg-[var(--accent-500)]/5 backdrop-blur-md"
                  : "border-[var(--border-default)] bg-[var(--surface)]/60 backdrop-blur-md hover:border-[var(--border-strong)]"
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[var(--accent-500)] text-white text-[10px] font-bold uppercase tracking-wider">
                  Most Popular
                </span>
              )}
              <h3 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">{tier.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-[var(--foreground)]">{tier.price}</span>
                <span className="text-sm text-[var(--foreground-muted)]">{tier.period}</span>
              </div>
              <p className="mt-2 text-sm text-[var(--foreground-secondary)]">{tier.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-[var(--foreground-secondary)]">
                    <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-6 block w-full text-center py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  tier.highlight
                    ? "bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)]"
                    : "border border-[var(--border-default)] text-[var(--foreground)] hover:bg-[var(--surface-raised)]"
                }`}
              >
                {tier.highlight ? "Start 14-Day Trial" : tier.name === "Enterprise" ? "Contact Sales" : "Get Started Free"}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   CTA
   ───────────────────────────────────────── */
function CTA() {
  return (
    <section className="py-24 bg-[var(--surface)] border-y border-[var(--border-default)]">
      <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
          Ready to transform your <span className="text-[var(--accent-400)]">procurement</span>?
        </h2>
        <p className="mt-4 text-[var(--foreground-secondary)] max-w-xl mx-auto">
          Join 200+ Egyptian hotels and 1,200+ suppliers already on the platform. 
          Setup takes less than 10 minutes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/register" className="px-7 py-3.5 text-sm font-semibold rounded-xl bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)] transition-all hover:-translate-y-0.5">
            Get Started Free
          </Link>
          <Link href="/catalog" className="px-7 py-3.5 text-sm font-semibold rounded-xl border border-[var(--border-default)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] hover:border-[var(--border-strong)] transition-all hover:-translate-y-0.5">
            Browse Catalog
          </Link>
        </div>
        <p className="mt-4 text-xs text-[var(--foreground-muted)]">Free 14-day trial • No credit card required • Cancel anytime</p>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[var(--background)] border-t border-[var(--border-default)] py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 rounded-lg overflow-hidden bg-[var(--surface-raised)] border border-[var(--border-default)]">
                <Image src="/logo-transparent.png" alt="" fill className="object-contain p-0.5" />
              </div>
              <span className="text-sm font-bold text-[var(--foreground)]">Hotels Vendors</span>
            </div>
            <p className="text-xs text-[var(--foreground-muted)] leading-relaxed">
              The Digital Procurement Hub for Egyptian Hospitality. 
              Hotels, suppliers, logistics, and factoring — unified.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              {["Catalog", "Orders", "ETA E-Invoicing", "Authority Matrix", "Pricing"].map((l) => (
                <li key={l}><a href="#" className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              {["About", "Careers", "Blog", "Contact", "Partners"].map((l) => (
                <li key={l}><a href="#" className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-[var(--foreground)] uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              {["Privacy", "Terms", "Security", "Compliance"].map((l) => (
                <li key={l}><a href="#" className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-[var(--border-default)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[var(--foreground-muted)]">© 2026 Hotels Vendors. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[var(--foreground-muted)]">
            <svg className="w-4 h-4 hover:text-[var(--foreground)] cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <svg className="w-4 h-4 hover:text-[var(--foreground)] cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            <svg className="w-4 h-4 hover:text-[var(--foreground)] cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   PAGE
   ───────────────────────────────────────── */
export default function LandingPage() {
  return (
    <main className="bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />
      <Hero />
      <TrustBar />
      <Features />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
