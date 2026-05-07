"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  TrendingDown,
  Clock,
  ShieldCheck,
  BadgeCheck,
  Truck,
  Landmark,
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
  Search,
  Crown,
  Package,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import catalogData from "@/data/catalog-products.json";
import { getCategoryById } from "@/lib/marketplace/categories";

const ALL_PRODUCTS: any[] = (catalogData as { products: any[] }).products;

/* ═══════════════════════════════════════════
   THEME
   ═══════════════════════════════════════════ */
const RED = "#DC143C";
const RED_DIM = "rgba(220,20,60,0.15)";
const RED_GLOW = "rgba(220,20,60,0.30)";
const GOLD = "#e1a95f";
const GOLD_DIM = "rgba(225,169,95,0.15)";

/* ═══════════════════════════════════════════
   GSAP REGISTER
   ═══════════════════════════════════════════ */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/* ═══════════════════════════════════════════
   CATEGORIES (10 total)
   ═══════════════════════════════════════════ */
const CATEGORIES = [
  { id: "fb", label: "Food & Beverage", icon: "🍽️", count: 32 },
  { id: "hk", label: "Housekeeping", icon: "🧼", count: 28 },
  { id: "lin", label: "Linens & Textiles", icon: "🛏️", count: 15 },
  { id: "eng", label: "Engineering", icon: "🔧", count: 12 },
  { id: "amenities", label: "Guest Amenities", icon: "🧴", count: 18 },
  { id: "equipment", label: "Kitchen Equipment", icon: "🍳", count: 10 },
  { id: "safety", label: "Safety & PPE", icon: "🦺", count: 8 },
  { id: "uniforms", label: "Staff Uniforms", icon: "👔", count: 6 },
  { id: "gra", label: "Guest Room", icon: "🛎️", count: 14 },
  { id: "ffe", label: "Furniture & Fixtures", icon: "🪑", count: 9 },
];

/* ═══════════════════════════════════════════
   ANIMATED COUNTER COMPONENT
   ═══════════════════════════════════════════ */
function AnimatedCounter({
  end,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || hasAnimated.current) return;

    const obj = { value: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      onEnter: () => {
        if (hasAnimated.current) return;
        hasAnimated.current = true;
        gsap.to(obj, {
          value: end,
          duration: 2,
          ease: "power2.out",
          onUpdate: () => {
            const formatted = decimals > 0 ? obj.value.toFixed(decimals) : Math.round(obj.value).toLocaleString();
            el.textContent = `${prefix}${formatted}${suffix}`;
          },
        });
      },
    });

    return () => {
      trigger.kill();
    };
  }, [end, prefix, suffix]);

  return (
    <span ref={ref} className="metric-value">
      {prefix}0{suffix}
    </span>
  );
}

/* ═══════════════════════════════════════════
   SCROLL REVEAL WRAPPER
   ═══════════════════════════════════════════ */
function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        delay,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   STAGGER REVEAL
   ═══════════════════════════════════════════ */
function StaggerReveal({
  children,
  className = "",
  stagger = 0.08,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const items = el.children;
    if (items.length === 0) return;

    gsap.fromTo(
      items,
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════
   GLASS TOOLBAR
   ═══════════════════════════════════════════ */
function GlassToolbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a12]/90 backdrop-blur-xl border-b border-white/[0.06]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <BrandLogo variant="dark" size="sm" />
              <span className="text-[14px] font-semibold text-white tracking-tight hidden sm:block">
                Hotels Vendors
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {["Platform", "Marketplace", "For Hotels", "For Suppliers", "Pricing"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                    className="px-4 py-2 rounded-xl text-[13px] text-white/50 hover:text-white transition-colors"
                  >
                    {item}
                  </a>
                )
              )}
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/marketplace"
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-[12px] text-white/50 hover:text-white transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </Link>
              <Link
                href="/login"
                className="hidden sm:block text-[12px] text-white/50 hover:text-white px-3 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-[12px] font-semibold px-4 py-2 rounded-xl transition-all"
                style={{ background: RED, color: "#fff" }}
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
                className="md:hidden p-2 text-white"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed inset-x-0 top-16 z-40 p-4 bg-[#0a0a12]/95 backdrop-blur-xl border-b border-white/[0.06] md:hidden"
        >
          {["Platform", "Marketplace", "For Hotels", "For Suppliers", "Pricing"].map(
            (item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="block py-2.5 text-[14px] text-white/50"
                onClick={() => setMobileOpen(false)}
              >
                {item}
              </a>
            )
          )}
          <div className="mt-2 pt-2 border-t border-white/[0.06] flex gap-2">
            <Link
              href="/login"
              className="flex-1 text-center py-2.5 text-[13px] border border-white/[0.10] text-white/50 rounded-xl"
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
    </>
  );
}

/* ═══════════════════════════════════════════
   HERO BENTO PREVIEW TILES
   ═══════════════════════════════════════════ */
function HeroBentoTiles() {
  const tiles = ALL_PRODUCTS.slice(0, 6);
  return (
    <div className="grid grid-cols-2 gap-2 w-full max-w-md">
      {tiles.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
          className={`surface-card p-3 ${
            i === 0 || i === 3 ? "col-span-1 row-span-1" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[8px] font-mono text-white/20 uppercase tracking-wider">
              {p.sku}
            </span>
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                p.stockQuantity > 20 ? "bg-emerald-400/40" : "bg-amber-400/40"
              }`}
            />
          </div>
          <p className="text-[10px] text-white/40 leading-tight line-clamp-2 font-medium">
            {p.name}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] font-bold text-white/50">
              EGP {p.unitPrice.toLocaleString()}
            </span>
            {p.supplierTier === "PREMIER" && (
              <Crown className="w-3 h-3" style={{ color: GOLD }} />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a12] relative overflow-hidden">
      <GlassToolbar />

      {/* ═══════════════════════════════════════
         HERO — Aurora + Bento Preview
         ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center bg-aurora bg-noise">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a12]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text */}
            <div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-[11px] font-extralight text-white/30 tracking-[0.3em] uppercase mb-6"
              >
                Smarter Together
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="text-[42px] sm:text-[52px] lg:text-[60px] font-extrabold leading-[1.05] tracking-[-0.03em]"
                style={{ fontFamily: "var(--font-display), sans-serif" }}
              >
                <span className="text-white">Cut procurement costs</span>
                <br />
                <span style={{ color: RED }}>by 30%.</span>
                <br />
                <span className="text-white/80">Zero friction.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="mt-6 text-[16px] sm:text-[18px] text-white/40 max-w-md leading-relaxed"
              >
                The first B2B marketplace for Egyptian hospitality.
                AI-powered sourcing. ETA e-invoicing compliant.
                One platform for buyers, suppliers, logistics, and finance.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-8 flex flex-wrap items-center gap-3"
              >
                <Link
                  href="/register"
                  className="btn-crimson px-7 py-3.5 text-[14px]"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/marketplace"
                  className="btn-ghost px-7 py-3.5 text-[14px] h-auto"
                >
                  Explore Marketplace
                </Link>
              </motion.div>

              {/* Trust Strip */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10 flex flex-wrap items-center gap-5"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px] text-white/30">ETA Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-white/20" />
                  <span className="text-[11px] text-white/30">
                    <AnimatedCounter end={1200} suffix="+" /> Suppliers
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-white/20" />
                  <span className="text-[11px] text-white/30">
                    <AnimatedCounter end={200} suffix="+" /> Hotels
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-white/20" />
                  <span className="text-[11px] text-white/30">
                    EGP <AnimatedCounter end={2.4} suffix="B+" decimals={1} /> GMV
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right: Bento Preview */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="hidden lg:block"
            >
              <HeroBentoTiles />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         FEATURES — Bento Grid
         ═══════════════════════════════════════ */}
      <section id="platform" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <span className="label-upper">The Platform</span>
            <h2
              className="mt-3 text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] leading-tight"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              Four pillars.
              <span style={{ color: RED }}> One ecosystem.</span>
            </h2>
            <p className="mt-3 text-[16px] text-white/40 max-w-lg mx-auto">
              Everything your hotel needs to procure smarter, faster, and cheaper —
              in one intelligent platform.
            </p>
          </ScrollReveal>

          <StaggerReveal className="bento-grid" stagger={0.1}>
            {/* Large tile — Smart Savings */}
            <div className="bento-item-6 surface-card p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-[60px] opacity-20" style={{ background: RED }} />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: RED_DIM }}>
                  <TrendingDown className="w-5 h-5" style={{ color: RED }} />
                </div>
                <h3 className="text-[20px] font-bold text-white mb-2">Smart Savings</h3>
                <p className="text-[14px] text-white/40 leading-relaxed">
                  AI forecasting, bulk discounts, and zero-margin procurement.
                  Cut costs up to 30% with demand-driven buying.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[12px]" style={{ color: RED }}>
                  <span>Learn more</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Medium tile — Time Freedom */}
            <div className="bento-item-3 surface-card p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(6,182,212,0.15)" }}>
                  <Clock className="w-5 h-5" style={{ color: "#06b6d4" }} />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Time Freedom</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">
                  48h delivery. Automated approvals. ETA e-invoicing. Hands-free from PO to payment.
                </p>
              </div>
            </div>

            {/* Medium tile — Risk-Zero Finance */}
            <div className="bento-item-3 surface-card p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: GOLD_DIM }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: GOLD }} />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Risk-Zero Finance</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">
                  Non-recourse factoring. Guaranteed payments. Full audit trails. Sleep soundly.
                </p>
              </div>
            </div>

            {/* Small tile — Quality Locked */}
            <div className="bento-item-4 surface-card p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(89,212,153,0.15)" }}>
                  <BadgeCheck className="w-5 h-5" style={{ color: "#59d499" }} />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Quality Locked</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">
                  Verified suppliers. Premier screening. Cold-chain logistics. Consistent standards.
                </p>
              </div>
            </div>

            {/* Small tile — ETA Compliance */}
            <div className="bento-item-4 surface-card p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(85,179,255,0.15)" }}>
                  <Receipt className="w-5 h-5" style={{ color: "#55b3ff" }} />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">ETA Compliant</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">
                  Native Egyptian Tax Authority e-invoicing. Digitally signed. Auto-submitted. Zero manual work.
                </p>
              </div>
            </div>

            {/* Small tile — Shared Logistics */}
            <div className="bento-item-4 surface-card p-6 relative overflow-hidden group">
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: "rgba(255,188,51,0.15)" }}>
                  <Truck className="w-5 h-5" style={{ color: "#ffbc33" }} />
                </div>
                <h3 className="text-[18px] font-bold text-white mb-2">Shared Logistics</h3>
                <p className="text-[13px] text-white/40 leading-relaxed">
                  Route-optimized delivery network. Coastal cluster consolidation. Reduce shipping costs by 40%.
                </p>
              </div>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         STATS — Animated Counters
         ═══════════════════════════════════════ */}
      <section className="py-20 border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-4" stagger={0.1}>
            {[
              { value: 1200, suffix: "+", label: "Verified Suppliers", color: RED },
              { value: 200, suffix: "+", label: "Hotels Onboarded", color: "#55b3ff" },
              { value: 48, suffix: "h", label: "Avg. Delivery", color: "#59d499" },
              { value: 99.9, suffix: "%", label: "Uptime SLA", decimals: 1, color: GOLD },
            ].map((stat) => (
              <div key={stat.label} className="surface-card p-6 text-center relative overflow-hidden">
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: stat.color, opacity: 0.6 }}
                />
                <p
                  className="text-[32px] sm:text-[40px] font-bold tracking-tight"
                  style={{ fontFamily: "var(--font-mono), monospace", color: stat.color }}
                >
                  <AnimatedCounter
                    end={stat.value}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                  />
                </p>
                <p className="text-[11px] text-white/25 mt-2 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         MARKETPLACE PREVIEW — Category Grid
         ═══════════════════════════════════════ */}
      <section id="marketplace" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <span className="label-upper">Marketplace</span>
            <h2
              className="mt-3 text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] leading-tight"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              Everything your hotel needs.
              <span style={{ color: RED }}> Verified.</span>
            </h2>
            <p className="mt-3 text-[16px] text-white/40 max-w-lg mx-auto">
              Browse 10 categories of verified suppliers. Fixed pricing. Real-time stock. ETA-compliant invoicing.
            </p>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3" stagger={0.06}>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/marketplace?category=${cat.id}`}
                className="surface-card p-5 group hover:border-white/[0.12] transition-all duration-300"
              >
                <span className="text-2xl mb-3 block">{cat.icon}</span>
                <h3 className="text-[14px] font-semibold text-white group-hover:text-white/90 transition-colors">
                  {cat.label}
                </h3>
                <p className="text-[11px] text-white/25 mt-1">
                  {cat.count} products
                </p>
                <div className="mt-3 flex items-center gap-1 text-[11px] opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: RED }}>
                  <span>Explore</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </StaggerReveal>

          <ScrollReveal className="text-center mt-10" delay={0.2}>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 btn-crimson"
            >
              Browse All Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         FOR HOTELS / FOR SUPPLIERS
         ═══════════════════════════════════════ */}
      <section id="for-hotels" className="py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="surface-elevated p-8 h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: RED_DIM }}>
                  <Building2 className="w-6 h-6" style={{ color: RED }} />
                </div>
                <h3
                  className="text-[28px] font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  For Hotels
                </h3>
                <ul className="space-y-3">
                  {[
                    "AI-suggested suppliers based on your consumption patterns",
                    "Automated PO generation with Authority Matrix approvals",
                    "Real-time budget tracking and spend analytics",
                    "ETA e-invoicing compliance — zero manual work",
                    "48-hour delivery guarantee on in-stock items",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14px] text-white/50">
                      <BadgeCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: RED }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="inline-flex items-center gap-2 mt-6 text-[13px] font-medium" style={{ color: RED }}>
                  Register as a Hotel <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="surface-elevated p-8 h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: GOLD_DIM }}>
                  <Package className="w-6 h-6" style={{ color: GOLD }} />
                </div>
                <h3
                  className="text-[28px] font-bold text-white mb-4"
                  style={{ fontFamily: "var(--font-display), sans-serif" }}
                >
                  For Suppliers
                </h3>
                <ul className="space-y-3">
                  {[
                    "Access 200+ hotel buyers with one listing",
                    "Fixed pricing — no bidding wars, no race to the bottom",
                    "Guaranteed payments via embedded non-recourse factoring",
                    "Shared-route logistics reduces your delivery costs",
                    "Real-time inventory sync with demand forecasting",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-[14px] text-white/50">
                      <BadgeCheck className="w-4 h-4 mt-0.5 shrink-0" style={{ color: GOLD }} />
                      {item}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="inline-flex items-center gap-2 mt-6 text-[13px] font-medium" style={{ color: GOLD }}>
                  Register as a Supplier <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         PRICING
         ═══════════════════════════════════════ */}
      <section id="pricing" className="py-24 border-t border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal className="text-center mb-14">
            <span className="label-upper">Pricing</span>
            <h2
              className="mt-3 text-[36px] sm:text-[44px] font-bold tracking-[-0.02em] leading-tight"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              Transparent.
              <span style={{ color: RED }}> No surprises.</span>
            </h2>
            <p className="mt-3 text-[16px] text-white/40 max-w-lg mx-auto">
              Pay only when you transact. No setup fees. No monthly minimums.
            </p>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto" stagger={0.1}>
            {/* Free */}
            <div className="surface-card p-6">
              <h3 className="text-[18px] font-bold text-white">Free</h3>
              <p className="text-[13px] text-white/30 mt-1">For small hotels</p>
              <p className="text-[36px] font-bold text-white mt-4">EGP 0</p>
              <p className="text-[11px] text-white/25">/ month</p>
              <ul className="mt-6 space-y-2">
                {["Browse marketplace", "Place orders", "Basic analytics", "Email support"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-white/50">
                    <BadgeCheck className="w-3.5 h-3.5" style={{ color: RED }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block mt-6 text-center py-2.5 rounded-xl text-[13px] font-medium border border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15] transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro */}
            <div className="surface-elevated p-6 relative">
              <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: RED }} />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-semibold text-white" style={{ background: RED }}>
                Most Popular
              </div>
              <h3 className="text-[18px] font-bold text-white">Pro</h3>
              <p className="text-[13px] text-white/30 mt-1">For growing chains</p>
              <p className="text-[36px] font-bold text-white mt-4">1.5%</p>
              <p className="text-[11px] text-white/25">per transaction</p>
              <ul className="mt-6 space-y-2">
                {["Everything in Free", "AI demand forecasting", "Priority support", "Multi-property dashboard", "Custom integrations"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-white/50">
                    <BadgeCheck className="w-3.5 h-3.5" style={{ color: RED }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block mt-6 text-center py-2.5 rounded-xl text-[13px] font-semibold text-white btn-crimson h-auto">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise */}
            <div className="surface-card p-6">
              <h3 className="text-[18px] font-bold text-white">Enterprise</h3>
              <p className="text-[13px] text-white/30 mt-1">For large groups</p>
              <p className="text-[36px] font-bold text-white mt-4">Custom</p>
              <p className="text-[11px] text-white/25">tailored pricing</p>
              <ul className="mt-6 space-y-2">
                {["Everything in Pro", "Dedicated account manager", "White-label options", "SLA guarantees", "On-premise deployment"].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-[13px] text-white/50">
                    <BadgeCheck className="w-3.5 h-3.5" style={{ color: GOLD }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="block mt-6 text-center py-2.5 rounded-xl text-[13px] font-medium border border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15] transition-colors">
                Contact Sales
              </Link>
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         FINAL CTA — Mesh Gradient
         ═══════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(220,20,60,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 80% 100%, rgba(30,30,60,0.4) 0%, transparent 50%)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2
              className="text-[36px] sm:text-[48px] font-bold text-white tracking-[-0.03em] leading-tight"
              style={{ fontFamily: "var(--font-display), sans-serif" }}
            >
              Ready to transform
              <br />
              your procurement?
            </h2>
            <p className="mt-4 text-[17px] text-white/40 max-w-md mx-auto">
              Join 200+ hotels and 1,200+ suppliers. Setup takes 10 minutes.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link href="/register" className="btn-crimson px-8 py-3.5 text-[14px]">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/marketplace" className="btn-ghost px-8 py-3.5 text-[14px] h-auto">
                Explore Marketplace
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════
         FOOTER
         ═══════════════════════════════════════ */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <BrandLogo variant="dark" size="sm" />
                <span className="text-[14px] font-semibold text-white">Hotels Vendors</span>
              </div>
              <p className="text-[12px] text-white/30 leading-relaxed">
                Egypt&apos;s leading B2B procurement platform for the hospitality sector.
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Marketplace</p>
              <div className="space-y-2">
                {CATEGORIES.slice(0, 5).map((c) => (
                  <Link key={c.id} href={`/marketplace?category=${c.id}`} className="block text-[12px] text-white/30 hover:text-white/60 transition-colors">
                    {c.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Platform</p>
              <div className="space-y-2">
                {["For Hotels", "For Suppliers", "For Logistics", "For Factoring", "ETA Compliance"].map((l) => (
                  <a key={l} href="#" className="block text-[12px] text-white/30 hover:text-white/60 transition-colors">
                    {l}
                  </a>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider mb-3">Legal</p>
              <div className="space-y-2">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                  <a key={l} href="#" className="block text-[12px] text-white/30 hover:text-white/60 transition-colors">
                    {l}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[11px] text-white/20">
              &copy; 2026 Hotels Vendors. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {["Twitter", "LinkedIn", "Instagram"].map((s) => (
                <a key={s} href="#" className="text-[11px] text-white/20 hover:text-white/50 transition-colors">
                  {s}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
