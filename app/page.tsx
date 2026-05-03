"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, TrendingUp, Shield, Zap, ArrowRight, Play, Pause,
  Package, Truck, CreditCard, Brain, Menu, X, Building2, Factory,
  Landmark, Clock, Lock, HeartHandshake, BarChart3, ChevronRight, Eye,
  Globe, Sparkles, FileCheck, BadgeCheck, Star, Users, CheckCircle2,
  Workflow, MessageSquare, Receipt, Boxes, ChevronDown, Mail, Phone,
  MapPin, Award, Lightbulb, Target, Rocket, Handshake,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════ */
interface Product {
  id: string; sku: string; name: string; category: string;
  unitPrice: number; stockQuantity: number; minOrderQty: number;
  images?: string | null; supplier?: { name: string };
}

/* ═══════════════════════════════════════════════════
   REAL IMAGE URLs (Unsplash)
   ═══════════════════════════════════════════════════ */
const IMAGES = {
  heroHotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80",
  hotelLobby: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
  restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  kitchen: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=80",
  housekeeping: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
  amenities: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
  logistics: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=80",
  office: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  cairo: "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?w=800&q=80",
  supplierFactory: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80",
  handshake: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80",
  analytics: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  invoice: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
  delivery: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
  money: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
};

const TABS = [
  { id: "product", label: "Product", icon: Package },
  { id: "solutions", label: "Solutions", icon: Lightbulb },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "enterprise", label: "Enterprise", icon: Building2 },
  { id: "about", label: "Who We Are", icon: Users },
];

const HOTELS = [
  { name: "Marriott Mena House", location: "Cairo", initials: "MH", color: "#8B0000" },
  { name: "Four Seasons Cairo", location: "Nile Plaza", initials: "FS", color: "#1a472a" },
  { name: "Hilton Alexandria", location: "Corniche", initials: "HA", color: "#003b5c" },
  { name: "Mövenpick El Gouna", location: "Red Sea", initials: "MG", color: "#c41e3a" },
  { name: "Steigenberger Tahrir", location: "Cairo", initials: "ST", color: "#1e3a5f" },
  { name: "Kempinski Nile", location: "Garden City", initials: "KN", color: "#4a0e4e" },
  { name: "Jaz Aquamarine", location: "Hurghada", initials: "JA", color: "#006994" },
  { name: "Rixos Sharm", location: "Sharm El-Sheikh", initials: "RS", color: "#d4af37" },
];

const PRICING_TIERS = [
  {
    name: "Starter",
    price: "0",
    period: "forever free",
    description: "For small hotels exploring digital procurement",
    features: [
      "Browse verified supplier catalog",
      "Basic search & filters",
      "Manual purchase orders",
      "Email notifications",
      "Up to 3 users",
    ],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Professional",
    price: "4,500",
    period: "EGP / month",
    description: "For growing hotels ready to automate",
    features: [
      "Everything in Starter",
      "AI price comparison",
      "Auto PO generation",
      "Authority Matrix workflows",
      "ETA e-invoicing",
      "Up to 15 users",
      "Priority support",
    ],
    cta: "Start 14-Day Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "tailored pricing",
    description: "For hotel groups with 5+ properties",
    features: [
      "Everything in Professional",
      "Multi-property dashboard",
      "Custom integrations (Opera, SAP)",
      "Dedicated account manager",
      "White-label options",
      "Unlimited users",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

/* ═══════════════════════════════════════════════════
   ANIMATION PRESETS
   ═══════════════════════════════════════════════════ */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

/* ═══════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════ */

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#dc2626]/10 border border-[#dc2626]/20 text-[11px] font-semibold text-[#ef4444] tracking-widest uppercase">
      {children}
    </span>
  );
}

function Navbar({ activeTab, onTabChange }: { activeTab: string; onTabChange: (t: string) => void }) {
  const [mobileMenu, setMobileMenu] = useState(false);
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-[72px] items-center justify-between">
          {/* Logo — LARGER */}
          <Link href="/" className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-white/[0.05] ring-1 ring-white/10">
              <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1.5" />
            </div>
            <div>
              <span className="text-[15px] font-bold tracking-wider text-white">Hotels Vendors</span>
              <span className="hidden sm:block text-[9px] text-white/30 tracking-[0.2em] uppercase">Procurement Hub</span>
            </div>
          </Link>

          {/* Desktop Tabs */}
          <div className="hidden lg:flex items-center gap-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#dc2626]/10 text-white border border-[#dc2626]/20"
                      : "text-white/40 hover:text-white hover:bg-white/[0.03]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="px-4 py-2 text-[13px] font-medium text-white/50 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="px-5 py-2.5 text-[13px] font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition-all hover:-translate-y-px">
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button className="lg:hidden p-2 text-white/50" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/[0.06] bg-black/95 backdrop-blur-xl px-6 py-4 overflow-hidden"
          >
            <div className="space-y-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => { onTabChange(tab.id); setMobileMenu(false); }}
                  className={`block w-full text-left py-2.5 px-3 text-sm rounded-lg transition-colors ${
                    activeTab === tab.id ? "text-white bg-[#dc2626]/10" : "text-white/50 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="pt-4 mt-4 border-t border-white/[0.06] flex gap-3">
              <Link href="/login" className="flex-1 text-center py-2.5 text-sm rounded-xl border border-white/10 text-white/50">Sign In</Link>
              <Link href="/register" className="flex-1 text-center py-2.5 text-sm rounded-xl bg-white text-black font-semibold">Get Started</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ─── Hero with Video ─── */
function HeroSection({ onTabChange }: { onTabChange: (t: string) => void }) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/videos/demo-hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
          onPlay={() => setVideoPlaying(true)}
          onPause={() => setVideoPlaying(false)}
        >
          <source src="/videos/demo-hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <SectionBadge>
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#22c55e]" />
            </span>
            Now Live in Egypt
          </SectionBadge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter text-white leading-[0.95]"
        >
          The Procurement
          <br />
          <span className="text-[#ef4444]">Platform</span>
          <br />
          <span className="text-white/60">for Egyptian Hotels</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 text-lg sm:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed"
        >
          Connect with verified suppliers, automate purchase orders, and stay ETA-compliant — all in one place.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/register" className="group px-8 py-4 text-sm font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition-all hover:-translate-y-0.5 flex items-center gap-2">
            Start Free Trial
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() => onTabChange("product")}
            className="px-8 py-4 text-sm font-semibold rounded-xl border border-white/10 text-white/60 hover:bg-white/[0.03] hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Explore Platform
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto"
        >
          {[
            { val: "52+", label: "Hotels" },
            { val: "68+", label: "Suppliers" },
            { val: "15M+", label: "EGP GMV" },
            { val: "99.9%", label: "ETA Compliant" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl font-bold text-white tracking-tight">{s.val}</div>
              <div className="text-[11px] text-white/30 mt-1 uppercase tracking-widest">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Trust Bar with Hotel Logos ─── */
function TrustBar() {
  return (
    <section className="border-y border-white/[0.06] py-12 bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <p className="text-center text-[11px] text-white/25 uppercase tracking-[0.2em] mb-8">
          Trusted by leading hotels across Egypt
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {HOTELS.map((hotel) => (
            <div
              key={hotel.name}
              className="group flex flex-col items-center gap-2 p-4 rounded-xl border border-white/[0.04] bg-white/[0.02] hover:border-white/[0.08] hover:bg-white/[0.04] transition-all duration-300"
            >
              {/* Styled Logo Placeholder */}
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: hotel.color }}
              >
                {hotel.initials}
              </div>
              <span className="text-[10px] text-white/40 text-center leading-tight group-hover:text-white/60 transition-colors">
                {hotel.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Product Tab ─── */
function ProductTab() {
  const features = [
    {
      title: "Save 15+ Hours Weekly",
      desc: "Digital catalog, auto-POs, and approval workflows cut procurement admin by 80%.",
      image: IMAGES.hotelLobby,
      span: "lg:col-span-2",
    },
    {
      title: "Cut Costs 20–30%",
      desc: "AI price comparison across verified suppliers ensures you always pay the best price.",
      image: IMAGES.analytics,
      span: "",
    },
    {
      title: "100% ETA Compliant",
      desc: "Every invoice digitally signed and submitted to ETA automatically. Zero penalties.",
      image: IMAGES.invoice,
      span: "",
    },
    {
      title: "Bank-Grade Security",
      desc: "End-to-end encryption, role-based access, and immutable audit trails.",
      image: IMAGES.office,
      span: "",
    },
    {
      title: "Verified Suppliers",
      desc: "KYC-checked, rated, and audited. HACCP and ISO certifications verified on-site.",
      image: IMAGES.supplierFactory,
      span: "lg:col-span-2",
    },
    {
      title: "Embedded Factoring",
      desc: "Get paid in 24–48 hours instead of 60–90 days. Built-in liquidity for suppliers.",
      image: IMAGES.money,
      span: "lg:col-span-3",
    },
  ];

  const steps = [
    { num: "01", title: "Search & Compare", desc: "Browse 5 categories of hotel supplies. Filter by price, MOQ, supplier tier, and certification.", image: IMAGES.restaurant },
    { num: "02", title: "Smart AI Purchase", desc: "Our AI officer finds the lowest price across suppliers, checks authority rules, and auto-approves POs.", image: IMAGES.kitchen },
    { num: "03", title: "Track & Pay", desc: "Monitor delivery in real-time. Invoices are ETA-compliant. Pay via embedded factoring or direct transfer.", image: IMAGES.delivery },
  ];

  return (
    <div className="space-y-32">
      {/* Features Bento */}
      <section>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <SectionBadge>Platform</SectionBadge>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-5 text-white">Everything you need</h2>
          <p className="text-white/40 text-lg max-w-lg mx-auto">From discovery to delivery, every step optimized for Egyptian hospitality.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              className={`group relative rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.10] transition-all duration-500 ${f.span}`}
            >
              <div className="relative h-48 overflow-hidden">
                <Image src={f.image} alt={f.title} fill className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="text-[16px] font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <SectionBadge>How it works</SectionBadge>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-5 text-white">Three steps to smarter procurement</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group"
            >
              <div className="relative h-56 rounded-2xl overflow-hidden mb-6 border border-white/[0.06]">
                <Image src={step.image} alt={step.title} fill className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-[#dc2626]/20 border border-[#dc2626]/30 flex items-center justify-center text-[#ef4444] font-bold text-sm">
                  {step.num}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
              <p className="text-[13px] text-white/40 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Solutions Tab ─── */
function SolutionsTab() {
  return (
    <div className="space-y-32">
      {/* AI Engine */}
      <section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionBadge>AI Engine</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-6 text-white">Intelligence that saves time and money</h2>
            <p className="text-white/40 text-lg leading-relaxed mb-10">
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
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#dc2626]/10 flex items-center justify-center text-[#ef4444] shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-[12px] text-white/35">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-white/[0.06]">
              <Image src={IMAGES.analytics} alt="AI Analytics" fill className="object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/30" />
              <div className="absolute inset-0 p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/[0.06]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ef4444]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#eab308]/60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#22c55e]/60" />
                  <span className="ml-2 text-[10px] text-white/30 font-mono tracking-wide">AI Procurement Assistant</span>
                </div>
                <div className="space-y-3 flex-1">
                  {[
                    { type: "user", text: "What's my hotel's biggest spend category?" },
                    { type: "ai", text: "F&B represents 62% of your spend (EGP 847,500). I recommend locking rates with Cairo Poultry before May 15." },
                    { type: "user", text: "Any suppliers with delivery delays?" },
                    { type: "ai", text: "2 suppliers have delays: Nile Textiles (+2 days) and Wadi Foods (+1 day). I've flagged alternatives." },
                  ].map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[11px] leading-relaxed ${msg.type === "user" ? "bg-[#dc2626]/15 text-white/80 rounded-br-md" : "bg-white/[0.03] text-white/50 rounded-bl-md border border-white/[0.04]"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases by Role */}
      <section>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <SectionBadge>For Every Stakeholder</SectionBadge>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-5 text-white">Built for every role</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Building2 className="w-6 h-6" />, title: "Hotels", desc: "Procurement portals, spend analytics, multi-property governance", color: "#3b82f6" },
            { icon: <Factory className="w-6 h-6" />, title: "Suppliers", desc: "Inventory sync, order management, instant factoring payouts", color: "#22c55e" },
            { icon: <Truck className="w-6 h-6" />, title: "Logistics", desc: "Route optimization, shared-load fulfillment, real-time tracking", color: "#eab308" },
            { icon: <Landmark className="w-6 h-6" />, title: "Factoring", desc: "Credit risk scoring, portfolio analytics, automated disbursement", color: "#a855f7" },
          ].map((role, i) => (
            <motion.div
              key={role.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 hover:border-white/[0.10] hover:bg-white/[0.03] transition-all duration-500 text-center"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: `${role.color}15`, color: role.color }}>
                {role.icon}
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{role.title}</h3>
              <p className="text-[13px] text-white/40 leading-relaxed">{role.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Pricing Tab ─── */
function PricingTab() {
  return (
    <div className="space-y-32">
      <section>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <SectionBadge>Pricing</SectionBadge>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-5 text-white">Simple, transparent pricing</h2>
          <p className="text-white/40 text-lg max-w-lg mx-auto">No hidden fees. Start free, scale as you grow.</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PRICING_TIERS.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative rounded-2xl border p-8 flex flex-col ${
                tier.highlight
                  ? "border-[#dc2626]/30 bg-[#dc2626]/[0.03]"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#dc2626] text-white text-[10px] font-semibold uppercase tracking-wider">
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-semibold text-white mb-2">{tier.name}</h3>
              <p className="text-[13px] text-white/40 mb-6">{tier.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">{tier.price === "0" ? "Free" : tier.price}</span>
                {tier.price !== "0" && <span className="text-white/40 text-sm ml-1">EGP</span>}
                <div className="text-[12px] text-white/30 mt-1">{tier.period}</div>
              </div>
              <ul className="space-y-3 mb-8 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/50">
                    <CheckCircle2 className="w-4 h-4 text-[#22c55e] shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.name === "Enterprise" ? "#" : "/register"}
                className={`block text-center py-3 rounded-xl text-sm font-semibold transition-all hover:-translate-y-px ${
                  tier.highlight
                    ? "bg-white text-black hover:bg-white/90"
                    : "border border-white/10 text-white/70 hover:bg-white/[0.03] hover:text-white"
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Enterprise Tab ─── */
function EnterpriseTab() {
  return (
    <div className="space-y-32">
      <section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <SectionBadge>Enterprise</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-6 text-white">Built for hotel groups</h2>
            <p className="text-white/40 text-lg leading-relaxed mb-10">
              Multi-property procurement governance, custom ERP integrations, and dedicated support for Egypt's largest hospitality operators.
            </p>
            <div className="space-y-4">
              {[
                { icon: <Building2 className="w-5 h-5" />, title: "Multi-Property Dashboard", desc: "Consolidated view across all properties with role-based access per hotel." },
                { icon: <Workflow className="w-5 h-5" />, title: "Custom Workflows", desc: "Tailored approval chains, spend limits, and notification rules per property." },
                { icon: <Handshake className="w-5 h-5" />, title: "Dedicated Success Manager", desc: "White-glove onboarding, quarterly business reviews, and priority support." },
                { icon: <Lock className="w-5 h-5" />, title: "Custom Integrations", desc: "Opera PMS, SAP, Oracle — we integrate with your existing stack." },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#dc2626]/10 flex items-center justify-center text-[#ef4444] shrink-0">{item.icon}</div>
                  <div>
                    <h4 className="text-sm font-semibold text-white mb-1">{item.title}</h4>
                    <p className="text-[12px] text-white/35">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] rounded-2xl overflow-hidden border border-white/[0.06]"
          >
            <Image src={IMAGES.handshake} alt="Enterprise" fill className="object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="max-w-xl mx-auto">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-10">
          <h3 className="text-2xl font-bold text-white mb-2">Talk to our sales team</h3>
          <p className="text-white/40">Get a custom quote for your hotel group.</p>
        </motion.div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="First Name" className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/20 focus:border-[#dc2626]/30 focus:outline-none transition-colors" />
            <input placeholder="Last Name" className="px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/20 focus:border-[#dc2626]/30 focus:outline-none transition-colors" />
          </div>
          <input placeholder="Work Email" className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/20 focus:border-[#dc2626]/30 focus:outline-none transition-colors" />
          <input placeholder="Hotel Group Name" className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/20 focus:border-[#dc2626]/30 focus:outline-none transition-colors" />
          <input placeholder="Number of Properties" className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/20 focus:border-[#dc2626]/30 focus:outline-none transition-colors" />
          <textarea placeholder="Tell us about your procurement needs..." rows={4} className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white text-sm placeholder:text-white/20 focus:border-[#dc2626]/30 focus:outline-none transition-colors resize-none" />
          <button className="w-full py-3.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-white/90 transition-all hover:-translate-y-px">
            Request a Demo
          </button>
        </div>
      </section>
    </div>
  );
}

/* ─── Who We Are Tab ─── */
function AboutTab() {
  return (
    <div className="space-y-32">
      {/* Mission */}
      <section>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[450px] rounded-2xl overflow-hidden border border-white/[0.06] order-2 lg:order-1"
          >
            <Image src={IMAGES.team} alt="Team" fill className="object-cover opacity-50" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
          </motion.div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="order-1 lg:order-2">
            <SectionBadge>Who We Are</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-6 text-white">Building the future of hospitality procurement</h2>
            <p className="text-white/40 text-lg leading-relaxed mb-6">
              Hotels Vendors was born from a simple observation: Egypt's $21.5B hospitality industry still runs on WhatsApp messages and Excel sheets.
            </p>
            <p className="text-white/40 text-lg leading-relaxed mb-8">
              We're changing that. Our four-sided marketplace connects hotels, suppliers, logistics providers, and factoring companies on a single, ETA-compliant platform powered by AI.
            </p>
            <div className="grid grid-cols-3 gap-6">
              {[
                { val: "2024", label: "Founded" },
                { val: "52+", label: "Hotels" },
                { val: "68+", label: "Suppliers" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-white">{s.val}</div>
                  <div className="text-[11px] text-white/30 mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <SectionBadge>Our Values</SectionBadge>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-5 text-white">What drives us</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Target className="w-6 h-6" />, title: "Vertical Depth", desc: "We own hospitality procurement. Not horizontal B2B. Not grocery. Hotels." },
            { icon: <Shield className="w-6 h-6" />, title: "Trust First", desc: "Every supplier is KYC-checked. Every invoice is ETA-verified. Zero exceptions." },
            { icon: <Zap className="w-6 h-6" />, title: "Speed Matters", desc: "From 3 days of admin to 30 minutes. From 90-day payment to 48 hours." },
            { icon: <Rocket className="w-6 h-6" />, title: "AI-Native", desc: "Not AI bolted on. AI at the core of every procurement decision." },
          ].map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-7 hover:border-white/[0.10] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-[#dc2626]/10 flex items-center justify-center text-[#ef4444] mb-5">{v.icon}</div>
              <h3 className="text-[15px] font-semibold text-white mb-2">{v.title}</h3>
              <p className="text-[13px] text-white/40 leading-relaxed">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Location */}
      <section>
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
          <SectionBadge>Contact</SectionBadge>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mt-5 mb-5 text-white">Get in touch</h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: <MapPin className="w-5 h-5" />, title: "Cairo, Egypt", desc: "Downtown headquarters" },
            { icon: <Mail className="w-5 h-5" />, title: "hello@hotelsvendors.com", desc: "General inquiries" },
            { icon: <Phone className="w-5 h-5" />, title: "+20 2 XXXX XXXX", desc: "Sales & Support" },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            >
              <div className="w-12 h-12 rounded-xl bg-[#dc2626]/10 flex items-center justify-center text-[#ef4444] mx-auto mb-4">{c.icon}</div>
              <h3 className="text-sm font-semibold text-white mb-1">{c.title}</h3>
              <p className="text-[12px] text-white/40">{c.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          <div className="col-span-2">
            <div className="flex items-center gap-3.5 mb-5">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white/[0.05] ring-1 ring-white/10">
                <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1.5" />
              </div>
              <div>
                <span className="text-[15px] font-bold tracking-wider text-white">Hotels Vendors</span>
                <span className="block text-[9px] text-white/30 tracking-[0.2em] uppercase">Digital Procurement Hub</span>
              </div>
            </div>
            <p className="text-[13px] text-white/30 max-w-xs leading-relaxed">
              Egypt's first B2B digital procurement hub for hotels. ETA-compliant, AI-powered, and built for scale.
            </p>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-4">Product</div>
            <div className="space-y-2.5">
              {["Catalog", "Features", "Solutions", "ETA Compliance"].map((l) => (
                <span key={l} className="block text-[13px] text-white/30 hover:text-white/60 transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-4">Company</div>
            <div className="space-y-2.5">
              {["About", "Careers", "Contact", "Blog"].map((l) => (
                <span key={l} className="block text-[13px] text-white/30 hover:text-white/60 transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.15em] text-white/30 font-semibold mb-4">Legal</div>
            <div className="space-y-2.5">
              {["Privacy", "Terms", "Security"].map((l) => (
                <span key={l} className="block text-[13px] text-white/30 hover:text-white/60 transition-colors cursor-pointer">{l}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/[0.03] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-[11px] text-white/25">© 2026 Hotels Vendors. All rights reserved.</div>
          <div className="flex items-center gap-5 text-[11px] text-white/25">
            <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-[#22c55e]" /> SSL Secured</span>
            <span className="flex items-center gap-1.5"><BadgeCheck className="w-3 h-3 text-[#3b82f6]" /> ISO 27001</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════ */
export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("product");
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    contentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "product": return <ProductTab />;
      case "solutions": return <SolutionsTab />;
      case "pricing": return <PricingTab />;
      case "enterprise": return <EnterpriseTab />;
      case "about": return <AboutTab />;
      default: return <ProductTab />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white antialiased">
      <Navbar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Hero */}
      <HeroSection onTabChange={handleTabChange} />

      {/* Trust Bar */}
      <TrustBar />

      {/* Tab Content */}
      <div ref={contentRef} className="scroll-mt-[80px]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Global CTA */}
      <section className="py-24 border-t border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] p-14 lg:p-20 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(220,38,38,0.06),transparent)]" />
            <div className="relative">
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-5 text-white">Ready to transform your procurement?</h2>
              <p className="text-white/40 max-w-md mx-auto mb-10 text-lg">Join Egypt's leading hospitality procurement network.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/register" className="px-8 py-4 text-sm font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition-all hover:-translate-y-0.5 flex items-center gap-2">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/catalog" className="px-8 py-4 text-sm font-semibold rounded-xl border border-white/10 text-white/60 hover:bg-white/[0.03] hover:text-white transition-all flex items-center gap-2">
                  Browse Catalog <Eye className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
