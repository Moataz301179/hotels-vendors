"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  BrainCircuit,
  Package,
  Truck,
  Landmark,
  BadgeCheck,
  Zap,
  BarChart3,
  Users,
  Star,
  ChevronRight,
  Sparkles,
  Lock,
  Receipt,
  Building2,
  Menu,
  X,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import catalogData from "@/data/catalog-products.json";
import { getCategoryById } from "@/lib/marketplace/categories";

const ALL_PRODUCTS: any[] = (catalogData as { products: any[] }).products;

/* ═══════════════════════════════════════════
   THEME COLORS — Crimson Red Dark
   ═══════════════════════════════════════════ */

const RED = "#DC143C";
const RED_DIM = "rgba(220,20,60,0.15)";
const RED_GLOW = "rgba(220,20,60,0.30)";

/* ═══════════════════════════════════════════
   BACKGROUND MARKETPLACE GRID
   ═══════════════════════════════════════════ */

const CAT_BG: Record<string, string> = {
  fb: "bg-orange-500/15",
  hk: "bg-sky-500/15",
  lin: "bg-violet-500/15",
  gra: "bg-amber-500/15",
  eng: "bg-emerald-500/15",
  ffe: "bg-rose-500/15",
};

const CAT_BORDER: Record<string, string> = {
  fb: "border-orange-500/20",
  hk: "border-sky-500/20",
  lin: "border-violet-500/20",
  gra: "border-amber-500/20",
  eng: "border-emerald-500/20",
  ffe: "border-rose-500/20",
};

function MarketplaceBackground() {
  const products = useMemo(() => {
    const shuffled = [...ALL_PRODUCTS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 60);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Dense product grid */}
      <div className="absolute inset-0 grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-12 gap-2 p-3 scale-110">
        {products.map((p, i) => {
          const cat = getCategoryById(p.category);
          return (
            <motion.div
              key={p.id + i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.015, duration: 0.4 }}
              className={`rounded-xl border ${
                CAT_BORDER[p.category] || "border-white/[0.06]"
              } ${CAT_BG[p.category] || "bg-white/[0.03]"} p-2.5 flex flex-col justify-between min-h-[110px]`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-mono text-white/15 uppercase tracking-wider">
                  {p.sku}
                </span>
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    p.stockQuantity > 20 ? "bg-emerald-400/40" : "bg-amber-400/40"
                  }`}
                />
              </div>
              <p className="text-[10px] text-white/30 leading-tight line-clamp-2 mt-1 font-medium">
                {p.name}
              </p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[10px] font-bold text-white/40">
                  EGP {p.unitPrice}
                </span>
                <span className="text-[7px] text-white/15 uppercase">{p.unitOfMeasure}</span>
              </div>
              {p.supplierTier === "PREMIER" && (
                <span className="text-[7px] text-amber-400/50 mt-0.5 font-medium">★ Premier</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Tempered glass dark overlay — products are visible but hazy */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[3px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/90" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
    </div>
  );
}

/* ═══════════════════════════════════════════
   LOGO WATERMARK
   ═══════════════════════════════════════════ */

function LogoWatermark() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      <BrandLogo
        variant="dark"
        size="xl"
        className="opacity-[0.03] scale-[3]"
      />
    </div>
  );
}

/* ═══════════════════════════════════════════
   TABS
   ═══════════════════════════════════════════ */

const TABS = [
  { id: "platform", label: "Platform" },
  { id: "hotels", label: "For Hotels" },
  { id: "suppliers", label: "For Suppliers" },
  { id: "pricing", label: "Pricing" },
];

const TAB_TRANSITION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

/* ═══════════════════════════════════════════
   UNSPLASH IMAGES
   ═══════════════════════════════════════════ */

const IMG = {
  food: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=80",
  housekeeping: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&q=80",
  linens: "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=800&q=80",
  engineering: "https://images.unsplash.com/photo-1581092921461-eab62e97a782?w=800&q=80",
  amenities: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
  hotel: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
  warehouse: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80",
  truck: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=800&q=80",
  ai: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80",
  finance: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
  handshake: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80",
  team: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
  quality: "https://images.unsplash.com/photo-1605218427306-022ba6c6699d?w=800&q=80",
  procurement: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
};

/* ═══════════════════════════════════════════
   GLASS TOOLBAR
   ═══════════════════════════════════════════ */

function GlassToolbar({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (id: string) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl">
        <div className="flex items-center justify-between px-5 py-3 rounded-2xl border border-white/[0.08] bg-black/60 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <BrandLogo variant="dark" size="sm" />
            <div className="hidden sm:block">
              <span className="text-[13px] font-semibold text-white tracking-tight leading-none">
                Hotels Vendors
              </span>
            </div>
          </Link>

          {/* Desktop Tabs */}
          <nav className="hidden md:flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 rounded-xl text-[12px] font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white/[0.08] rounded-xl border border-white/[0.10]"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                {tab.label}
              </button>
            ))}
            <Link
              href="/marketplace"
              className="px-4 py-2 rounded-xl text-[12px] font-medium text-white/40 hover:text-white/70 transition-colors"
            >
              Marketplace
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/login"
              className="hidden sm:block text-[12px] text-white/50 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-[12px] font-semibold px-4 py-2 rounded-xl transition-all"
              style={{
                background: RED,
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "#b91031";
                (e.target as HTMLElement).style.boxShadow = `0 0 20px ${RED_GLOW}`;
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = RED;
                (e.target as HTMLElement).style.boxShadow = "none";
              }}
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/[0.05]"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-4 rounded-2xl border border-white/[0.08] bg-black/80 backdrop-blur-xl md:hidden"
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 rounded-xl text-[13px] ${
                  activeTab === tab.id ? "text-white bg-white/[0.08]" : "text-white/50"
                }`}
              >
                {tab.label}
              </button>
            ))}
            <Link
              href="/marketplace"
              className="block px-4 py-2.5 rounded-xl text-[13px] text-white/50"
              onClick={() => setMobileOpen(false)}
            >
              Marketplace
            </Link>
            <div className="mt-2 pt-2 border-t border-white/[0.06] flex gap-2">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 text-[13px] text-white/50 border border-white/[0.08] rounded-xl"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 text-[13px] font-semibold text-white rounded-xl"
                style={{ background: RED }}
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </header>
    </>
  );
}

/* ═══════════════════════════════════════════
   PLATFORM TAB — HERO + 4 PILLARS
   ═══════════════════════════════════════════ */

function PlatformTab() {
  return (
    <motion.div {...TAB_TRANSITION} className="min-h-[calc(100vh-80px)] flex flex-col">
      {/* HERO SECTION */}
      <section className="flex-1 flex flex-col justify-center items-center px-6 pt-24 pb-12 relative">
        <LogoWatermark />

        {/* Slogan — thin, small, centered */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[11px] sm:text-[12px] font-extralight text-white/30 tracking-[0.3em] uppercase mb-6"
        >
          Smarter Together
        </motion.p>

        {/* Main Hook */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-center text-[40px] sm:text-[56px] lg:text-[72px] font-bold text-white leading-[1.05] tracking-[-0.03em] max-w-4xl"
        >
          One Platform.
          <br />
          <span style={{ color: RED }}>Four Pillars.</span>
          <br />
          Zero Friction.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 text-center text-[15px] sm:text-[17px] text-white/40 max-w-xl leading-relaxed"
        >
          Hotels Vendors unites{" "}
          <strong className="text-white/70">buyers, suppliers, logistics, and finance</strong>{" "}
          into a single intelligent ecosystem.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <Link
            href="/register"
            className="group px-7 py-3.5 text-[14px] font-semibold text-white rounded-xl transition-all flex items-center gap-2"
            style={{ background: RED }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.boxShadow = `0 0 24px ${RED_GLOW}`;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.boxShadow = "none";
            }}
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link
            href="/marketplace"
            className="px-7 py-3.5 text-[14px] font-medium text-white/50 hover:text-white border border-white/[0.08] hover:border-white/[0.16] rounded-xl transition-all"
          >
            Explore Marketplace
          </Link>
        </motion.div>

        {/* 4 Pillars Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-5xl"
        >
          {[
            {
              icon: TrendingDown,
              title: "Smart Savings",
              desc: "AI forecasting, bulk discounts, zero-margin procurement. Cut costs up to 30%.",
              img: IMG.finance,
            },
            {
              icon: Clock,
              title: "Time Freedom",
              desc: "48h delivery. Automated approvals. ETA e-invoicing. Hands-free from PO to payment.",
              img: IMG.truck,
            },
            {
              icon: ShieldCheck,
              title: "Risk-Zero Finance",
              desc: "Non-recourse factoring. Guaranteed payments. Full audit trails. Sleep soundly.",
              img: IMG.handshake,
            },
            {
              icon: BadgeCheck,
              title: "Quality Locked",
              desc: "Verified suppliers. Premier screening. Cold-chain logistics. Consistent standards.",
              img: IMG.quality,
            },
          ].map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.12] hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="h-28 overflow-hidden relative">
                <img
                  src={pillar.img}
                  alt={pillar.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: RED_DIM }}
                  >
                    <pillar.icon className="w-3.5 h-3.5" style={{ color: RED }} />
                  </div>
                  <h3 className="text-[13px] font-semibold text-white">{pillar.title}</h3>
                </div>
                <p className="text-[11px] text-white/35 leading-relaxed">{pillar.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* SCROLL SECTION 2 — Stats + CTA */}
      <section className="px-6 py-16 border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
          >
            {[
              { value: "1,200+", label: "Verified Suppliers" },
              { value: "200+", label: "Hotels Onboarded" },
              { value: "EGP 2.4B+", label: "Annual GMV" },
              { value: "99.9%", label: "Uptime SLA" },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-xl border border-white/[0.04]">
                <p className="text-[24px] sm:text-[28px] font-bold text-white tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[10px] text-white/25 mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Final CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-8 sm:p-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] relative overflow-hidden"
          >
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[100px] opacity-20"
              style={{ background: RED }}
            />
            <div className="relative z-10">
              <h2 className="text-[28px] sm:text-[36px] font-bold text-white tracking-tight">
                Ready to transform your procurement?
              </h2>
              <p className="mt-3 text-[14px] text-white/40 max-w-md mx-auto">
                Join 200+ hotels and 1,200+ suppliers. Setup takes 10 minutes. No credit card required.
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/register"
                  className="px-7 py-3.5 text-[14px] font-semibold text-white rounded-xl transition-all"
                  style={{ background: RED }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.boxShadow = `0 0 24px ${RED_GLOW}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  Create Free Account
                </Link>
                <Link
                  href="/login"
                  className="px-7 py-3.5 text-[14px] font-medium text-white/50 hover:text-white border border-white/[0.08] hover:border-white/[0.16] rounded-xl transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <BrandLogo variant="dark" size="sm" />
              <span className="text-[13px] font-semibold text-white/60">Hotels Vendors</span>
            </div>
            <div className="flex items-center gap-6">
              {["Marketplace", "Platform", "Pricing", "Privacy", "Terms"].map((l) => (
                <a
                  key={l}
                  href={l === "Marketplace" ? "/marketplace" : l === "Platform" ? "#" : l === "Pricing" ? "#" : "#"}
                  className="text-[11px] text-white/20 hover:text-white/50 transition-colors"
                >
                  {l}
                </a>
              ))}
            </div>
            <p className="text-[10px] text-white/15">&copy; 2026 Hotels Vendors</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   FOR HOTELS TAB
   ═══════════════════════════════════════════ */

function HotelsTab() {
  return (
    <motion.div {...TAB_TRANSITION} className="min-h-[calc(100vh-80px)] pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase mb-4"
              style={{ background: "rgba(16,185,129,0.10)", color: "#10B981", border: "1px solid rgba(16,185,129,0.20)" }}
            >
              <Building2 className="w-3 h-3" /> For Hotel Buyers
            </span>
            <h2 className="text-3xl sm:text-[42px] font-bold text-white leading-tight tracking-tight">
              Stop chasing suppliers.
              <br />
              <span style={{ color: "#10B981" }}>Start scaling.</span>
            </h2>
            <p className="mt-4 text-[15px] text-white/40 leading-relaxed max-w-md">
              From a single property to a 50-hotel group. Cut procurement admin by 80%
              and redirect your team to guest experience.
            </p>
            <div className="mt-6 flex items-center gap-3">
              <Link
                href="/register"
                className="px-6 py-3 text-[13px] font-semibold text-white rounded-xl transition-all"
                style={{ background: "#10B981" }}
              >
                Join as Hotel
              </Link>
              <Link
                href="/marketplace"
                className="px-6 py-3 text-[13px] font-medium text-white/50 hover:text-white border border-white/[0.08] hover:border-white/[0.16] rounded-xl transition-colors"
              >
                Browse Marketplace
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
            <img src={IMG.hotel} alt="Hotel" className="w-full h-72 object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: BrainCircuit, title: "AI Inventory Engine", desc: "Predictive reordering based on occupancy and seasonality.", img: IMG.ai },
            { icon: Receipt, title: "ETA Auto-Compliance", desc: "Every invoice digitally signed and submitted to ETA in real time.", img: IMG.finance },
            { icon: Lock, title: "Authority Matrix", desc: "Multi-level approvals by value threshold. No PO moves without sign-off.", img: IMG.procurement },
            { icon: Truck, title: "48-Hour Delivery", desc: "Shared-route logistics covering Cairo, Alexandria, Red Sea, and South Sinai.", img: IMG.truck },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-32 shrink-0">
                <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <b.icon className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-[13px] font-semibold text-white">{b.title}</h3>
                </div>
                <p className="text-[11px] text-white/35 leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   FOR SUPPLIERS TAB
   ═══════════════════════════════════════════ */

function SuppliersTab() {
  return (
    <motion.div {...TAB_TRANSITION} className="min-h-[calc(100vh-80px)] pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center mb-10">
          <div>
            <span
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase mb-4"
              style={{ background: "rgba(14,165,233,0.10)", color: "#0ea5e9", border: "1px solid rgba(14,165,233,0.20)" }}
            >
              <Package className="w-3 h-3" /> For Suppliers
            </span>
            <h2 className="text-3xl sm:text-[42px] font-bold text-white leading-tight tracking-tight">
              Your products.
              <br />
              <span style={{ color: "#0ea5e9" }}>Their hotels.</span>
              <br />
              Zero friction.
            </h2>
            <p className="mt-4 text-[15px] text-white/40 leading-relaxed max-w-md">
              List once. Sell to 450+ properties. Get paid fast. We handle logistics,
              compliance, and collections.
            </p>
            <div className="mt-6">
              <Link
                href="/register"
                className="px-6 py-3 text-[13px] font-semibold text-white rounded-xl transition-all"
                style={{ background: "#0ea5e9" }}
              >
                Join as Supplier
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/[0.06]">
            <img src={IMG.warehouse} alt="Warehouse" className="w-full h-72 object-cover" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { icon: Users, title: "450+ Hotel Buyers", desc: "Instant access to hotel chains, resorts, and boutique properties.", img: IMG.team },
            { icon: Landmark, title: "Guaranteed Payments", desc: "Embedded non-recourse factoring. Paid in 24-48 hours, not 90 days.", img: IMG.finance },
            { icon: BarChart3, title: "Demand Intelligence", desc: "AI forecasts tell you what to stock, when, and for which properties.", img: IMG.ai },
            { icon: Truck, title: "Shared Logistics", desc: "Reduce delivery costs by 40% through our shared-route network.", img: IMG.warehouse },
          ].map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:bg-white/[0.04] transition-colors"
            >
              <div className="w-32 shrink-0">
                <img src={b.img} alt={b.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <b.icon className="w-4 h-4 text-sky-400" />
                  <h3 className="text-[13px] font-semibold text-white">{b.title}</h3>
                </div>
                <p className="text-[11px] text-white/35 leading-relaxed">{b.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   PRICING TAB
   ═══════════════════════════════════════════ */

function PricingTab() {
  const tiers = [
    {
      name: "Starter",
      price: "Free",
      period: "",
      desc: "Small hotels exploring digital procurement",
      features: ["Browse marketplace", "Basic search", "Manual POs", "Email alerts", "Up to 3 users"],
      cta: "Get Started",
      highlight: false,
    },
    {
      name: "Professional",
      price: "4,500",
      period: "EGP / month",
      desc: "Growing hotels ready to automate",
      features: ["Everything in Starter", "AI price comparison", "Auto PO generation", "Authority Matrix", "ETA e-invoicing", "Up to 15 users", "Priority support"],
      cta: "Start 14-Day Trial",
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      desc: "Hotel groups with 5+ properties",
      features: ["Everything in Pro", "Multi-property dashboard", "Opera / SAP integration", "Dedicated account manager", "White-label options", "Unlimited users", "SLA guarantee"],
      cta: "Contact Sales",
      highlight: false,
    },
  ];

  return (
    <motion.div {...TAB_TRANSITION} className="min-h-[calc(100vh-80px)] pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Pricing</h2>
          <p className="text-sm text-white/40 mt-2">No hidden fees. Cancel anytime.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {tiers.map((tier, i) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08 }}
              className={`rounded-2xl p-6 border ${
                tier.highlight
                  ? "border-white/[0.12] bg-white/[0.04]"
                  : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              {tier.highlight && (
                <span
                  className="inline-block px-3 py-1 text-[10px] font-medium text-white rounded-full mb-5"
                  style={{ background: RED }}
                >
                  Most Popular
                </span>
              )}
              <h3 className="text-[13px] font-medium text-white/50">{tier.name}</h3>
              <div className="mt-2 flex items-baseline gap-1.5">
                <span className="text-[32px] font-bold text-white">{tier.price}</span>
                {tier.period && <span className="text-[13px] text-white/40">{tier.period}</span>}
              </div>
              <p className="mt-1 text-[12px] text-white/30">{tier.desc}</p>
              <ul className="mt-5 space-y-2.5">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[12px] text-white/50">
                    <Zap className="w-3 h-3 shrink-0 mt-0.5" style={{ color: RED }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/register"
                className={`mt-6 block w-full text-center py-3 text-[13px] font-medium rounded-xl transition-colors ${
                  tier.highlight
                    ? "text-white"
                    : "border border-white/[0.08] text-white/60 hover:text-white hover:border-white/[0.14]"
                }`}
                style={tier.highlight ? { background: RED } : {}}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState("platform");

  return (
    <div className="min-h-screen w-full relative bg-black overflow-x-hidden">
      {/* Background marketplace grid */}
      <MarketplaceBackground />

      {/* Logo watermark */}
      <LogoWatermark />

      {/* Floating Glass Toolbar */}
      <GlassToolbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === "platform" && <PlatformTab key="platform" />}
          {activeTab === "hotels" && <HotelsTab key="hotels" />}
          {activeTab === "suppliers" && <SuppliersTab key="suppliers" />}
          {activeTab === "pricing" && <PricingTab key="pricing" />}
        </AnimatePresence>
      </main>
    </div>
  );
}
