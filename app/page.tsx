"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  Search, ShoppingCart, TrendingUp, Shield, Zap, CheckCircle2, ArrowRight,
  Package, Truck, CreditCard, Brain, Menu, X, Building2, Factory,
  Landmark, Clock, Lock, HeartHandshake, BarChart3, ChevronRight, Eye,
  Gem, Globe, Award, Sparkles, FileCheck, Anchor,
} from "lucide-react";
import { AuroraBackground } from "@/components/aurora-background";

interface Product { id: string; sku: string; name: string; category: string; unitPrice: number; stockQuantity: number; minOrderQty: number; images?: string | null; supplier?: { name: string }; }
interface Supplier { id: string; name: string; city: string; certifications?: string; }

const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7,  } }) };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.6,  } } };

function GlassCard({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0); const [rotateY, setRotateY] = useState(0);
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setRotateX(((e.clientY - rect.top) / rect.height - 0.5) * -12);
    setRotateY(((e.clientX - rect.left) / rect.width - 0.5) * 12);
  };
  return (
    <motion.div ref={ref} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}  onMouseMove={handleMouseMove} onMouseLeave={() => { setRotateX(0); setRotateY(0); }} style={{ transformStyle: "preserve-3d", perspective: 1000 }} className={`group relative ${className}`}>
      <motion.div animate={{ rotateX, rotateY }} transition={{ type: "spring", stiffness: 300, damping: 30 }} className="w-full h-full">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.05)] group-hover:border-red-500/20 group-hover:shadow-[0_8px_32px_rgba(185,28,28,0.15),inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-500" />
        <div className="relative z-10 w-full h-full">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function AnimatedCounter({ end, suffix = "", prefix = "" }: { end: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [val, setVal] = useState(0);
  useEffect(() => { if (!isInView) return; let raf: number; const start = performance.now(); const tick = (now: number) => { const t = Math.min((now - start) / 2000, 1); setVal(Math.floor((1 - Math.pow(1 - t, 3)) * end)); if (t < 1) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf); }, [isInView, end]);
  return <span ref={ref}>{prefix}{val.toLocaleString()}{suffix}</span>;
}

function FloatingOrb({ className = "" }: { className?: string }) {
  return <motion.div animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className={`absolute rounded-full blur-3xl opacity-30 pointer-events-none ${className}`} />;
}

export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    fetch("/api/products?limit=8").then(r => r.json()).then(d => { if (d.success) setHeroProducts(d.data.slice(0, 8)); });
    fetch("/api/suppliers?limit=6").then(r => r.json()).then(d => { if (d.success) setSuppliers(d.data.slice(0, 6)); });
  }, []);

  const filtered = heroProducts.filter(p => (search === "" || p.name.toLowerCase().includes(search.toLowerCase())) && (activeCategory === "ALL" || p.category === activeCategory));
  const cats = [{ key: "ALL", label: "All" }, { key: "F_AND_B", label: "F&B" }, { key: "CONSUMABLES", label: "Housekeeping" }, { key: "GUEST_SUPPLIES", label: "Amenities" }, { key: "FFE", label: "FF&E" }];

  const features = [
    { icon: <Clock className="w-6 h-6" />, title: "Save 15+ Hours Weekly", desc: "Digital catalog, auto-POs, and approval workflows cut procurement admin by 80%.", col: "from-red-500/20 to-red-600/5" },
    { icon: <BarChart3 className="w-6 h-6" />, title: "Cut Costs 20-30%", desc: "AI price comparison across verified suppliers ensures you always pay the best price.", col: "from-amber-500/20 to-amber-600/5" },
    { icon: <FileCheck className="w-6 h-6" />, title: "100% ETA Compliant", desc: "Every invoice digitally signed and submitted to ETA automatically. Zero penalties.", col: "from-emerald-500/20 to-emerald-600/5" },
    { icon: <Lock className="w-6 h-6" />, title: "Bank-Grade Security", desc: "End-to-end encryption, role-based access, and immutable audit trails.", col: "from-blue-500/20 to-blue-600/5" },
    { icon: <HeartHandshake className="w-6 h-6" />, title: "Verified Suppliers", desc: "KYC-checked, rated, and audited. HACCP and ISO certifications verified on-site.", col: "from-violet-500/20 to-violet-600/5" },
    { icon: <CreditCard className="w-6 h-6" />, title: "Embedded Factoring", desc: "Get paid in 24-48 hours instead of 60-90 days. Built-in liquidity.", col: "from-cyan-500/20 to-cyan-600/5" },
  ];

  return (
    <div className="min-h-screen bg-[#08090c] text-[#e8eaed] relative overflow-x-hidden">
      <AuroraBackground />

      {/* Navbar */}
      <motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.8,  }} className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06] bg-[#08090c]/60 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-1 ring-white/10 group-hover:ring-red-500/40 transition-all duration-500">
                <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1" />
              </div>
              <div>
                <span className="text-sm font-bold tracking-[0.15em] uppercase">Hotels Vendors</span>
                <span className="block text-[9px] text-white/40 -mt-0.5 tracking-wider">Digital Procurement Hub</span>
              </div>
            </Link>
            <div className="hidden lg:flex items-center gap-8 text-[13px] font-medium text-white/50">
              {["Catalog", "Suppliers", "Features", "AI Engine", "Enterprise"].map(item => (
                <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="hover:text-white transition-colors duration-300 relative group">
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-gradient-to-r from-red-500 to-amber-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="px-4 py-2 text-[13px] font-medium rounded-lg border border-white/10 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-300">Sign In</Link>
              <Link href="/register" className="px-4 py-2 text-[13px] font-medium rounded-lg bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-lg shadow-red-900/30 hover:shadow-red-900/50 transition-all duration-300">Get Started</Link>
            </div>
            <button className="lg:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>{mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        {mobileMenu && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="lg:hidden border-t border-white/[0.06] bg-[#08090c]/95 backdrop-blur-xl px-6 py-4 space-y-3">
            {["Catalog", "Suppliers", "Features", "AI Engine", "Enterprise"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="block text-sm text-white/60 hover:text-white" onClick={() => setMobileMenu(false)}>{item}</a>
            ))}
            <div className="pt-3 flex gap-3">
              <Link href="/login" className="flex-1 text-center py-2 text-sm rounded-lg border border-white/10">Sign In</Link>
              <Link href="/register" className="flex-1 text-center py-2 text-sm rounded-lg bg-red-700 text-white">Get Started</Link>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero */}
      <motion.section style={{ opacity: heroOpacity, scale: heroScale }} className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <FloatingOrb className="w-[600px] h-[600px] bg-red-600/20 -top-40 -left-40" />
        <FloatingOrb className="w-[500px] h-[500px] bg-amber-500/10 top-1/3 right-0" />
        <FloatingOrb className="w-[400px] h-[400px] bg-red-800/15 bottom-0 left-1/3" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1,  }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-md mb-8">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" /></span>
            <span className="text-[11px] text-white/60 tracking-wide">Live Marketplace — 68 Verified Suppliers Active</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1,  }} className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6">
            Procurement Reimagined<br /><span className="bg-gradient-to-r from-red-400 via-red-500 to-amber-500 bg-clip-text text-transparent">for Egyptian Hospitality</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2,  }} className="text-lg text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            The first AI-powered B2B procurement hub connecting Egypt's hotels with verified suppliers, embedded factoring, and real-time ETA e-invoicing compliance.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3,  }} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/register" className="group px-8 py-4 text-sm font-semibold rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-2xl shadow-red-900/40 hover:shadow-red-900/60 transition-all duration-500 flex items-center gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/catalog" className="px-8 py-4 text-sm font-semibold rounded-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.03] backdrop-blur-md transition-all duration-300 flex items-center gap-2">
              <Eye className="w-4 h-4" /> Browse Catalog
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }} className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.04] rounded-2xl overflow-hidden max-w-3xl mx-auto backdrop-blur-md border border-white/[0.06]">
            {[{ val: 52, label: "Hotels Onboarded", suffix: "+" }, { val: 68, label: "Verified Suppliers", suffix: "+" }, { val: 15, label: "Million EGP GMV", suffix: "M+" }, { val: 99, label: "ETA Compliance", suffix: "%" }].map((s, i) => (
              <div key={i} className="bg-[#08090c]/80 p-5 text-center">
                <div className="text-2xl font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent"><AnimatedCounter end={s.val} suffix={s.suffix} /></div>
                <div className="text-[10px] text-white/40 mt-1 tracking-wider uppercase">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </motion.div>
      </motion.section>

      {/* Trust Bar */}
      <section className="relative py-12 border-y border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090c] via-transparent to-[#08090c] z-10 pointer-events-none" />
        <motion.div animate={{ x: [0, -1200] }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="flex gap-16 items-center whitespace-nowrap">
          {[...Array(2)].map((_, dup) => (
            <div key={dup} className="flex gap-16 items-center">
              {["Marriott Mena House", "Four Seasons Cairo", "Hilton Alexandria", "Movenpick El Gouna", "Steigenberger Tahrir", "Kempinski Nile", "Jaz Aquamarine", "Rixos Sharm"].map(h => (
                <span key={h} className="text-sm text-white/20 font-medium tracking-wide flex items-center gap-2"><Building2 className="w-4 h-4" /> {h}</span>
              ))}
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-white/50 tracking-wider uppercase mb-4">Platform Capabilities</span>
            <h2 className="text-4xl font-bold tracking-tight mb-4">Why Hotels Vendors?</h2>
            <p className="text-white/40 max-w-xl mx-auto">We eliminate the chaos of hotel procurement. No more phone calls, spreadsheets, or missed deadlines.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <GlassCard key={f.title} delay={i * 0.1}>
                <div className="p-6 h-full">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.col} flex items-center justify-center text-white/80 mb-4 ring-1 ring-white/10`}>{f.icon}</div>
                  <h3 className="text-base font-semibold mb-2">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how" className="relative py-24 border-y border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight mb-4">How It Works</h2>
            <p className="text-white/40">From search to delivery in three steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {[
              { step: "01", title: "Search & Compare", desc: "Browse 5 categories of hotel supplies. Filter by price, MOQ, supplier tier, and certification.", icon: <Search className="w-6 h-6" /> },
              { step: "02", title: "Smart AI Purchase", desc: "Our AI officer finds the lowest price across suppliers, checks authority rules, and auto-approves POs.", icon: <Brain className="w-6 h-6" /> },
              { step: "03", title: "Track & Pay", desc: "Monitor delivery in real-time. Invoices are ETA-compliant. Pay via embedded factoring or direct transfer.", icon: <Truck className="w-6 h-6" /> },
            ].map((item, i) => (
              <motion.div key={item.step} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={i} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/[0.08] backdrop-blur-xl mb-6 relative">
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-r from-red-600 to-red-500 flex items-center justify-center text-[10px] font-bold">{item.step}</div>
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Catalog */}
      <section id="catalog" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-center mb-12">
            <h2 className="text-4xl font-bold tracking-tight mb-4">Live Marketplace</h2>
            <p className="text-white/40">Browse real products from verified Egyptian suppliers</p>
          </motion.div>

          {/* Search & Filter */}
          <div className="max-w-2xl mx-auto mb-10">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products, SKUs, suppliers..." className="w-full pl-11 pr-4 py-3.5 text-sm rounded-xl bg-white/[0.03] border border-white/[0.08] focus:border-red-500/30 focus:outline-none transition-colors placeholder:text-white/20" />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {cats.map(c => (
                <button key={c.key} onClick={() => setActiveCategory(c.key)} className={`px-4 py-1.5 text-[12px] rounded-full border transition-all duration-300 ${activeCategory === c.key ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/15"}`}>
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {(filtered.length > 0 ? filtered : heroProducts).map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }} className="group relative rounded-xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-500">
                <div className="aspect-[4/3] bg-gradient-to-br from-white/[0.03] to-white/[0.01] flex items-center justify-center relative overflow-hidden">
                  <Package className="w-8 h-8 text-white/10 group-hover:text-white/20 transition-colors" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08090c] via-transparent to-transparent opacity-60" />
                </div>
                <div className="p-4">
                  <div className="text-[10px] font-mono text-white/30 mb-1">{p.sku}</div>
                  <div className="text-sm font-medium truncate mb-1">{p.name}</div>
                  <div className="text-[11px] text-white/30 truncate mb-2">{p.supplier?.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-400">EGP {p.unitPrice.toLocaleString()}</span>
                    <span className="text-[10px] text-white/30">MOQ {p.minOrderQty}</span>
                  </div>
                </div>
              </motion.div>
            ))}
            {heroProducts.length === 0 && (
              <div className="col-span-full text-center py-16 text-white/30">
                <div className="animate-pulse">Loading marketplace...</div>
              </div>
            )}
          </div>

          <div className="text-center mt-8">
            <Link href="/catalog" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors group">
              View Full Catalog <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Engine */}
      <section id="ai-engine" className="relative py-24 border-y border-white/[0.04] overflow-hidden">
        <FloatingOrb className="w-[800px] h-[800px] bg-red-600/10 top-0 right-0" />
        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0}>
              <span className="inline-block px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-[11px] text-red-400 tracking-wider uppercase mb-4">AI Engine</span>
              <h2 className="text-4xl font-bold tracking-tight mb-4">Intelligence That Saves<br />Time and Money</h2>
              <p className="text-white/40 leading-relaxed mb-8">
                Our Tri-Layer Guardian system combines LLM reasoning, WASM rule engines, and human oversight 
                to make procurement decisions faster and safer than any human team.
              </p>
              <div className="space-y-4">
                {[
                  { icon: <TrendingUp className="w-5 h-5" />, title: "Smart Deals", desc: "AI scans all supplier prices for the same SKU and surfaces the lowest offer." },
                  { icon: <ShoppingCart className="w-5 h-5" />, title: "AI Purchasing Officer", desc: "Auto-generates POs, routes through authority matrix, approves under-limit orders." },
                  { icon: <Sparkles className="w-5 h-5" />, title: "Product Alternatives", desc: "When stock is low, AI suggests equivalent products from verified vendors." },
                ].map((item, i) => (
                  <motion.div key={item.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-red-600/5 flex items-center justify-center text-red-400 shrink-0">{item.icon}</div>
                    <div>
                      <h4 className="text-sm font-semibold mb-1">{item.title}</h4>
                      <p className="text-[12px] text-white/40">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-amber-500/10 rounded-3xl blur-3xl" />
              <div className="relative rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl">
                <div className="flex items-center gap-2 mb-4 pb-4 border-b border-white/[0.06]">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-[11px] text-white/30 font-mono">AI Assistant — Procurement Intelligence</span>
                </div>
                <div className="space-y-3">
                  {[
                    { type: "user", text: "What's my hotel's biggest spend category this month?" },
                    { type: "ai", text: "F&B represents 62% of your spend (EGP 847,500). I recommend locking rates with Cairo Poultry before their scheduled price increase on May 15." },
                    { type: "user", text: "Any suppliers with delivery delays?" },
                    { type: "ai", text: "2 suppliers in your active POs have delays: Nile Textiles (+2 days) and Wadi Foods (+1 day). I've flagged alternatives from verified vendors." },
                  ].map((msg, i) => (
                    <div key={i} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] px-4 py-2.5 rounded-xl text-[12px] leading-relaxed ${msg.type === "user" ? "bg-red-600/20 text-white/80 rounded-br-sm" : "bg-white/[0.05] text-white/60 rounded-bl-sm border border-white/[0.06]"}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center gap-2">
                  <input type="text" placeholder="Ask about orders, suppliers, budgets..." className="flex-1 bg-transparent text-[12px] text-white/60 placeholder:text-white/20 focus:outline-none" />
                  <button className="p-1.5 rounded-lg bg-red-600/20 text-red-400"><ArrowRight className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enterprise CTA */}
      <section id="enterprise" className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative rounded-3xl border border-white/[0.08] bg-gradient-to-br from-white/[0.05] to-white/[0.01] backdrop-blur-xl p-12 lg:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(185,28,28,0.12),transparent)]" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Ready to Transform Your Procurement?</h2>
              <p className="text-white/40 max-w-lg mx-auto mb-10">Join Egypt's leading hospitality procurement network. Hotels save time, suppliers grow revenue, and everyone stays compliant.</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
                {[
                  { icon: <Building2 className="w-6 h-6" />, label: "Join as Hotel", href: "/register?type=hotel", color: "from-red-700 to-red-600" },
                  { icon: <Factory className="w-6 h-6" />, label: "Join as Supplier", href: "/register?type=supplier", color: "from-white/[0.08] to-white/[0.04]" },
                  { icon: <Landmark className="w-6 h-6" />, label: "Factoring Partner", href: "/register?type=factoring", color: "from-white/[0.08] to-white/[0.04]" },
                  { icon: <Truck className="w-6 h-6" />, label: "Logistics Partner", href: "/register?type=shipping", color: "from-white/[0.08] to-white/[0.04]" },
                ].map((item) => (
                  <Link key={item.label} href={item.href} className={`flex flex-col items-center gap-3 px-4 py-5 rounded-xl bg-gradient-to-br ${item.color} ${item.color.includes("red") ? "text-white shadow-lg shadow-red-900/30" : "text-white/70 border border-white/[0.08] hover:border-white/15"} transition-all duration-300 hover:-translate-y-1`}>
                    {item.icon}
                    <span className="text-xs font-medium">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/[0.06] bg-[#05060a]">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden ring-1 ring-white/10">
                  <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1" />
                </div>
                <span className="text-sm font-bold tracking-wider uppercase">Hotels Vendors</span>
              </div>
              <p className="text-[12px] text-white/30 max-w-xs leading-relaxed">
                Egypt's first B2B digital procurement hub for hotels. ETA-compliant, AI-powered, and built for scale.
              </p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-3">Product</div>
              <div className="space-y-2">
                <a href="#catalog" className="block text-[12px] text-white/40 hover:text-white transition-colors">Catalog</a>
                <a href="#features" className="block text-[12px] text-white/40 hover:text-white transition-colors">Features</a>
                <a href="#ai-engine" className="block text-[12px] text-white/40 hover:text-white transition-colors">AI Engine</a>
                <Link href="/eta-demo" className="block text-[12px] text-white/40 hover:text-white transition-colors">ETA Compliance</Link>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-3">Company</div>
              <div className="space-y-2">
                <span className="block text-[12px] text-white/40">About</span>
                <span className="block text-[12px] text-white/40">Careers</span>
                <span className="block text-[12px] text-white/40">Contact</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-white/30 font-semibold mb-3">Legal</div>
              <div className="space-y-2">
                <span className="block text-[12px] text-white/40">Privacy</span>
                <span className="block text-[12px] text-white/40">Terms</span>
                <span className="block text-[12px] text-white/40">ETA e-Invoicing</span>
              </div>
            </div>
          </div>
          <div className="mt-10 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-[11px] text-white/30">© 2026 Hotels Vendors. Smarter Together.</div>
            <div className="flex items-center gap-4 text-[11px] text-white/30">
              <span className="flex items-center gap-1.5"><Shield className="w-3 h-3 text-emerald-500/60" /> SSL Secured</span>
              <span className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-blue-500/60" /> Cairo, Egypt</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
