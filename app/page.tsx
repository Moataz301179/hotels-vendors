"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Menu, X, Package, ShoppingCart,
  Truck, CreditCard, Landmark, ShieldCheck, BarChart3, Search,
  MessageCircle, XIcon, Zap, Users, FileCheck, TrendingUp,
  ChevronRight, Building2, MapPin, Clock, Sparkles, Boxes,
  UtensilsCrossed, Bath, BedDouble, Wrench, Monitor, HeartHandshake,
  ArrowUpRight, Play, Star, Hexagon, CircleDot, Triangle,
} from "lucide-react";

/* ─── DATA ─── */

const FEATURES = [
  { icon: Package, title: "Unified Catalog", desc: "10,000+ SKUs across F&B, housekeeping, linens, and engineering from verified Egyptian suppliers." },
  { icon: Truck, title: "Shared Logistics", desc: "Coastal-cluster fulfillment with real-time tracking. Cut delivery costs by 40%." },
  { icon: CreditCard, title: "Embedded Factoring", desc: "Non-recourse invoice financing. Suppliers get paid in 48 hours, not 90 days." },
  { icon: Landmark, title: "ETA E-Invoicing", desc: "Real-time submission to the Egyptian Tax Authority. Digitally signed, fully compliant." },
  { icon: ShieldCheck, title: "Authority Matrix", desc: "Multi-level approval chains for purchase orders by value, hierarchy, and supplier tier." },
  { icon: BarChart3, title: "AI Intelligence", desc: "Demand forecasting, price benchmarking, and smart reorder alerts by season." },
];

const CATEGORIES = [
  { icon: UtensilsCrossed, label: "Food & Beverage", count: "4,100+ SKUs", tint: "from-amber-500/10 to-transparent", accent: "#f59e0b" },
  { icon: Bath, label: "Housekeeping", count: "1,800+ SKUs", tint: "from-cyan-500/10 to-transparent", accent: "#06b6d4" },
  { icon: BedDouble, label: "Linens & Textiles", count: "2,400+ SKUs", tint: "from-rose-500/10 to-transparent", accent: "#f43f5e" },
  { icon: Wrench, label: "Engineering", count: "1,700+ SKUs", tint: "from-emerald-500/10 to-transparent", accent: "#10b981" },
  { icon: Boxes, label: "Room Amenities", count: "1,300+ SKUs", tint: "from-violet-500/10 to-transparent", accent: "#8b5cf6" },
  { icon: Monitor, label: "IT & Technology", count: "900+ SKUs", tint: "from-sky-500/10 to-transparent", accent: "#0ea5e9" },
];

const PRICING = [
  { name: "Starter", price: "0", period: "free forever", desc: "For small hotels exploring digital procurement", features: ["Browse verified catalog", "Basic search & filters", "Manual POs", "Email alerts", "Up to 3 users"], highlight: false },
  { name: "Professional", price: "4,500", period: "EGP / month", desc: "For growing hotels ready to automate", features: ["Everything in Starter", "AI price comparison", "Auto PO generation", "Authority Matrix", "ETA e-invoicing", "Up to 15 users", "Priority support"], highlight: true },
  { name: "Enterprise", price: "Custom", period: "tailored pricing", desc: "For hotel groups with 5+ properties", features: ["Everything in Pro", "Multi-property dashboard", "Opera / SAP integrations", "Dedicated AM", "White-label options", "Unlimited users", "SLA guarantee"], highlight: false },
];

const HOTELS = [
  "Marriott Mena House", "Four Seasons", "Hilton Alexandria",
  "Mövenpick El Gouna", "Steigenberger", "Kempinski Nile",
  "Jaz Aquamarine", "Rixos Sharm",
];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ─── LOGO SVG ─── */

function HorseLogo({ className = "w-8 h-10", stroke = "#FF5C00" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" className={className} fill="none" stroke={stroke} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
      {/* Horse Knight Head Outline - Exact trace: flared mane right, ear up, nostril flare, jaw curve */}
      <path d="M10 20 Q15 10 25 15 Q40 5 55 20 Q70 15 80 30 Q90 40 95 55 Q100 70 92 85 Q85 95 75 105 Q65 115 55 120 Q45 125 35 118 Q25 110 20 95 Q18 80 22 65 Q25 50 28 40 Q25 30 20 25 Q15 22 10 20 Z" />
      {/* Mane flare/ear */}
      <path d="M55 20 Q65 10 75 25 Q85 20 90 35 Q95 45 92 55" />
      {/* Eye/Nostril */}
      <circle cx="35" cy="45" r="2" fill={stroke} opacity="0.9" />
      <ellipse cx="85" cy="60" rx="2.5" ry="1.5" />
      {/* Integrated HV Letters - V tilted in mane (45deg), H parallel tilt in neck for clarity */}
      <g transform="translate(60,70) rotate(-15)">
        <text x="0" y="8" fontSize="18" fontWeight="900" fontFamily="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" letterSpacing="-0.5" opacity="0.95">H</text>
      </g>
      <g transform="translate(75,45) rotate(45)">
        <text x="0" y="12" fontSize="16" fontWeight="800" fontFamily="-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif" letterSpacing="0" opacity="0.95">V</text>
      </g>
    </svg>
  );
}

/* ─── CHATBOT ─── */

function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowOffer(true), 5000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {showOffer && !open && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-2 border border-white/[0.08] bg-[#0a0a0a] p-3 max-w-[200px] relative rounded-lg">
          <button onClick={() => setShowOffer(false)} className="absolute top-2 right-2 text-white/20 hover:text-white/60">
            <XIcon className="w-3 h-3" />
          </button>
          <p className="text-[11px] font-medium text-white/70 pr-4">Need help getting started?</p>
          <Link href="/register" className="inline-block mt-2 px-3 py-1.5 text-[10px] font-semibold bg-white text-black hover:bg-white/90 transition-colors rounded">
            Register Now
          </Link>
        </motion.div>
      )}
      <button onClick={() => { setOpen(!open); setShowOffer(false); }} className="w-10 h-10 border border-[#FF5C00]/50 bg-[#FF5C00] flex items-center justify-center hover:bg-[#cc4700] transition-colors rounded-lg shadow-lg shadow-[#FF5C00]/20">
        <MessageCircle className="w-4 h-4 text-white" />
      </button>
    </div>
  );
}

/* ─── NAVBAR (WHITE) ─── */

function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]" : "bg-white"}`}>
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <HorseLogo className="w-7 h-8" stroke="#FF5C00" />
            <span className="text-[14px] font-bold text-black tracking-tight">Hotels Vendors</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Catalog", href: "/catalog" },
              { label: "Solutions", href: "#solutions" },
              { label: "Pricing", href: "#pricing" },
              { label: "About", href: "#about" },
            ].map((item) => (
              <a key={item.label} href={item.href} className="text-[13px] font-medium text-black/50 hover:text-black transition-colors">
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-[13px] font-medium text-black/50 hover:text-black transition-colors px-3 py-1.5">
              Sign In
            </Link>
            <Link href="/register" className="px-4 py-2 text-[12px] font-semibold bg-black text-white hover:bg-black/80 transition-colors rounded-md">
              Get Started
            </Link>
          </div>

          <button className="md:hidden p-2 text-black" onClick={() => setOpen(!open)}>
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-black/5 px-5 py-4 space-y-1">
          {["Catalog", "Solutions", "Pricing", "About"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="block py-2 text-[14px] font-medium text-black/60 hover:text-black">{item}</a>
          ))}
          <div className="pt-3 flex gap-2">
            <Link href="/login" className="flex-1 text-center py-2.5 text-[13px] border border-black/10 text-black rounded-md font-medium">Sign In</Link>
            <Link href="/register" className="flex-1 text-center py-2.5 text-[13px] bg-black text-white rounded-md font-semibold">Get Started</Link>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ─── ABSTRACT HERO VISUAL (CSS-only, no images) ─── */

function HeroVisual() {
  return (
    <div className="relative w-full h-full min-h-[360px] lg:min-h-[420px]">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-[0.04]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px'
      }} />

      {/* Orbiting accent rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-white/[0.06] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/[0.04] rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border border-[#FF5C00]/20 rounded-full" />

      {/* Floating cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="absolute top-4 left-4 lg:left-8 bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF5C00]/20 flex items-center justify-center">
            <Package className="w-3.5 h-3.5 text-[#ff7a33]" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white">New Order</p>
            <p className="text-[9px] text-white/30">EGP 24,500</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute top-16 right-2 lg:right-6 bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white">ETA Verified</p>
            <p className="text-[9px] text-white/30">Invoice #8821</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="absolute bottom-20 left-2 lg:left-4 bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Truck className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white">In Transit</p>
            <p className="text-[9px] text-white/30">Hurghada → Cairo</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-6 right-6 lg:right-12 bg-white/[0.03] border border-white/[0.08] rounded-xl p-3 backdrop-blur-sm"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-500/10 flex items-center justify-center">
            <CreditCard className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-white">Factored</p>
            <p className="text-[9px] text-white/30">48h payout</p>
          </div>
        </div>
      </motion.div>

      {/* Center node */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-[#FF5C00]/10 border border-[#FF5C00]/30 flex items-center justify-center">
            <HorseLogo className="w-8 h-9" stroke="#ff7a33" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-[#FF5C00]/20 blur-xl -z-10" />
        </div>
      </div>

      {/* Connection lines (decorative) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <line x1="30%" y1="20%" x2="50%" y2="50%" stroke="url(#grad1)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="70%" y1="25%" x2="50%" y2="50%" stroke="url(#grad1)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="25%" y1="75%" x2="50%" y2="50%" stroke="url(#grad1)" strokeWidth="1" strokeDasharray="4 4" />
        <line x1="75%" y1="80%" x2="50%" y2="50%" stroke="url(#grad1)" strokeWidth="1" strokeDasharray="4 4" />
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF5C00" stopOpacity="0" />
            <stop offset="50%" stopColor="#FF5C00" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FF5C00" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* ─── HERO ─── */

function Hero() {
  return (
    <section className="relative bg-black pt-16 overflow-hidden">
      {/* Subtle radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#FF5C00]/[0.07] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-5 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] mb-6">
              <Sparkles className="w-3 h-3 text-[#ff7a33]" />
              <span className="text-[11px] font-medium text-white/50">Now serving 200+ Egyptian hotels</span>
            </div>

            <h1 className="text-[32px] sm:text-[40px] lg:text-[48px] font-bold text-white leading-[1.1] tracking-tight">
              The procurement platform{" "}
              <span className="text-[#ff7a33]">built for Egyptian hospitality</span>
            </h1>

            <p className="mt-5 text-[15px] text-white/40 leading-relaxed max-w-md">
              Connect hotels, suppliers, logistics, and factoring on a single compliant platform. From catalog discovery to ETA e-invoice submission.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/register" className="px-5 py-2.5 text-[13px] font-semibold bg-white text-black hover:bg-white/90 transition-colors rounded-lg flex items-center gap-2">
                Start Free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/catalog" className="px-5 py-2.5 text-[13px] font-semibold border border-white/12 text-white hover:bg-white/[0.03] transition-colors rounded-lg flex items-center gap-2">
                Explore Catalog <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-10 flex items-center gap-8">
              {[
                { value: "10K+", label: "SKUs" },
                { value: "1,200+", label: "Suppliers" },
                { value: "2.4B", label: "EGP GMV" },
                { value: "48h", label: "Delivery" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-[20px] font-bold text-white tracking-tight">{stat.value}</p>
                  <p className="text-[11px] text-white/25 uppercase tracking-wider mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: abstract visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── TRUST BAR ─── */

function TrustBar() {
  return (
    <section className="bg-black border-y border-white/[0.04]">
      <div className="mx-auto max-w-6xl px-5 py-6">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          <span className="text-[11px] font-medium text-white/20 uppercase tracking-wider">Trusted by leading hotels</span>
          {HOTELS.map((h) => (
            <span key={h} className="text-[12px] font-semibold text-white/15 hover:text-white/40 transition-colors">{h}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CATEGORIES (icon cards, no images) ─── */

function Categories() {
  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[11px] font-semibold text-[#ff7a33] tracking-[0.15em] uppercase">Catalog</span>
          <h2 className="mt-3 text-[28px] sm:text-[32px] font-bold text-white tracking-tight">Everything your hotel needs</h2>
          <p className="mt-2 text-[14px] text-white/35 max-w-md">Verified suppliers across six core procurement categories.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.label}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.025] hover:border-white/[0.12] transition-all duration-300 p-5 cursor-pointer"
            >
              {/* Gradient tint */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.tint} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300" style={{ backgroundColor: `${cat.accent}15` }}>
                  <cat.icon className="w-5 h-5" style={{ color: cat.accent }} />
                </div>
                <h3 className="text-[15px] font-semibold text-white group-hover:text-white/90 transition-colors">{cat.label}</h3>
                <p className="mt-1 text-[12px] text-white/30">{cat.count}</p>
                <div className="mt-4 flex items-center gap-1 text-[11px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ color: cat.accent }}>
                  Browse <ArrowUpRight className="w-3 h-3" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── FEATURES ─── */

function Features() {
  return (
    <section id="product" className="bg-[#050505] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[11px] font-semibold text-[#ff7a33] tracking-[0.15em] uppercase">Platform</span>
          <h2 className="mt-3 text-[28px] sm:text-[32px] font-bold text-white tracking-tight">Capabilities</h2>
          <p className="mt-2 text-[14px] text-white/35 max-w-md">From catalog discovery to ETA-compliant invoicing — one platform, zero fragmentation.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-xl border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.025] hover:border-white/[0.12] transition-all duration-300 p-5"
            >
              <div className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center mb-4 group-hover:border-white/[0.15] transition-colors">
                <f.icon className="w-[18px] h-[18px] text-white/30 group-hover:text-white/50 transition-colors" />
              </div>
              <h3 className="text-[15px] font-semibold text-white">{f.title}</h3>
              <p className="mt-1.5 text-[13px] text-white/30 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── HOW IT WORKS ─── */

function HowItWorks() {
  const steps = [
    { num: "01", icon: Search, title: "Discover", desc: "Browse verified suppliers across 6 categories. Filter by price, MOQ, and delivery zone." },
    { num: "02", icon: FileCheck, title: "Order", desc: "Build purchase orders with AI-suggested bundles. Route through your Authority Matrix." },
    { num: "03", icon: Truck, title: "Fulfill", desc: "Track shared-logistics delivery in real time. Invoice auto-submits to ETA." },
  ];

  return (
    <section id="solutions" className="bg-black py-20">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[11px] font-semibold text-[#ff7a33] tracking-[0.15em] uppercase">Process</span>
          <h2 className="mt-3 text-[28px] sm:text-[32px] font-bold text-white tracking-tight">How it works</h2>
          <p className="mt-2 text-[14px] text-white/35">From catalog to compliance in three steps</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((s, i) => (
            <motion.div
              key={s.num}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative rounded-xl border border-white/[0.06] bg-white/[0.015] p-6"
            >
              {/* Step connector line */}
              {i < 2 && (
                <div className="hidden md:block absolute top-10 left-full w-4 h-px bg-gradient-to-r from-white/[0.08] to-transparent z-10" />
              )}

              <div className="flex items-center gap-3 mb-5">
                <span className="text-[11px] font-mono text-white/15">{s.num}</span>
                <div className="flex-1 h-px bg-white/[0.06]" />
              </div>
              <div className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center mb-4">
                <s.icon className="w-[18px] h-[18px] text-white/40" />
              </div>
              <h4 className="text-[16px] font-semibold text-white">{s.title}</h4>
              <p className="mt-2 text-[13px] text-white/30 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── METRICS BANNER ─── */

function MetricsBanner() {
  const metrics = [
    { icon: Building2, value: "200+", label: "Hotels Onboarded" },
    { icon: MapPin, value: "6", label: "Coastal Clusters" },
    { icon: Clock, value: "48h", label: "Avg. Delivery" },
    { icon: TrendingUp, value: "40%", label: "Cost Reduction" },
  ];

  return (
    <section className="bg-[#050505] py-16">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-4 rounded-xl border border-white/[0.06] bg-white/[0.015] p-4"
            >
              <div className="w-9 h-9 rounded-lg border border-white/[0.08] flex items-center justify-center shrink-0">
                <m.icon className="w-4 h-4 text-white/30" />
              </div>
              <div>
                <p className="text-[18px] font-bold text-white tracking-tight">{m.value}</p>
                <p className="text-[10px] text-white/25 uppercase tracking-wider">{m.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── PRICING ─── */

function Pricing() {
  return (
    <section id="pricing" className="bg-black py-20">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <span className="text-[11px] font-semibold text-[#ff7a33] tracking-[0.15em] uppercase">Pricing</span>
          <h2 className="mt-3 text-[28px] sm:text-[32px] font-bold text-white tracking-tight">Simple, transparent plans</h2>
          <p className="mt-2 text-[14px] text-white/35">No hidden fees. Scale as you grow.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRICING.map((tier) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`rounded-xl p-6 transition-all duration-300 ${
                tier.highlight
                  ? "border border-[#FF5C00]/40 bg-[#FF5C00]/[0.03]"
                  : "border border-white/[0.06] bg-white/[0.015] hover:bg-white/[0.025]"
              }`}
            >
              {tier.highlight && (
                <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-wider bg-white text-black rounded mb-4">Most Popular</span>
              )}
              <h3 className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">{tier.name}</h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-[28px] font-bold text-white tracking-tight">{tier.price}</span>
                <span className="text-[11px] text-white/30">{tier.period}</span>
              </div>
              <p className="mt-2 text-[13px] text-white/30 leading-relaxed">{tier.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[13px] text-white/40">
                    <CheckCircle2 className="w-4 h-4 text-white/25 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-6 block w-full text-center py-2.5 text-[13px] font-semibold transition-colors rounded-lg ${
                  tier.highlight
                    ? "bg-white text-black hover:bg-white/90"
                    : "border border-white/10 text-white hover:bg-white/[0.03]"
                }`}
              >
                {tier.highlight ? "Start 14-Day Trial" : tier.name === "Enterprise" ? "Contact Sales" : "Get Started Free"}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */

function CTA() {
  return (
    <section className="bg-[#050505] py-20">
      <div className="mx-auto max-w-6xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] p-10 lg:p-16 text-center"
        >
          {/* Background accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#FF5C00]/[0.08] rounded-full blur-[100px] pointer-events-none" />

          <div className="relative">
            <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight">Ready to transform your procurement?</h2>
            <p className="mt-3 text-[14px] text-white/35 max-w-md mx-auto">Join 200+ Egyptian hotels and 1,200+ suppliers. Setup takes less than 10 minutes.</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="px-6 py-2.5 text-[13px] font-semibold bg-white text-black hover:bg-white/90 transition-colors rounded-lg">
                Get Started Free
              </Link>
              <Link href="/catalog" className="px-6 py-2.5 text-[13px] font-semibold border border-white/12 text-white hover:bg-white/[0.03] transition-colors rounded-lg">
                Browse Catalog
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */

function Footer() {
  return (
    <footer className="bg-black border-t border-white/[0.05]">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <HorseLogo className="w-5 h-6" stroke="#FF5C00" />
              <span className="text-[14px] font-bold text-white tracking-tight">Hotels Vendors</span>
            </div>
            <p className="text-[13px] text-white/25 leading-relaxed max-w-[240px]">The Digital Procurement Hub for Egyptian Hospitality.</p>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-3">Product</h4>
            <ul className="space-y-2">
              {["Catalog", "Orders", "ETA E-Invoicing", "Authority Matrix", "Pricing"].map((l) => (
                <li key={l}><a href="#" className="text-[13px] text-white/25 hover:text-white/60 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-3">Company</h4>
            <ul className="space-y-2">
              {["About", "Careers", "Blog", "Contact"].map((l) => (
                <li key={l}><a href="#" className="text-[13px] text-white/25 hover:text-white/60 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[11px] font-semibold text-white uppercase tracking-wider mb-3">Legal</h4>
            <ul className="space-y-2">
              {["Privacy", "Terms", "Security", "Compliance"].map((l) => (
                <li key={l}><a href="#" className="text-[13px] text-white/25 hover:text-white/60 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-white/15">© 2026 Hotels Vendors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

/* ─── PAGE ─── */

export default function LandingPage() {
  return (
    <main className="bg-black text-white min-h-screen">
      <Navbar />
      <Hero />
      <TrustBar />
      <Categories />
      <Features />
      <HowItWorks />
      <MetricsBanner />
      <Pricing />
      <CTA />
      <Footer />
      <ChatbotWidget />
    </main>
  );
}
