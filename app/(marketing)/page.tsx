/* ═══════════════════════════════════════════════════════════════
   HOTELS VENDORS — MARKETING PAGE v2 (HERMES BUILD May 30 2026)
   Reference design: clario.framer.website
   Reference content: kimi.page HotelsVendors
   Color system: #050505 bg, #8cff2e lime primary, #a855f7 purple secondary
   Animation: Framer Motion — fade+slide scroll reveals, stagger, 3D tilt
   ═══════════════════════════════════════════════════════════════ */
"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import {
  ShoppingCart, Store, ArrowRight, Shield, Cpu, Truck, Landmark,
  CheckCircle, FileCheck, Banknote, CreditCard, ChevronRight, Play
} from "lucide-react";

/* ─── Animation variants (Clario-style) ─── */
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

/* ─── Data ─── */
const STATS = [
  { value: "10–20", label: "Daily supplier deliveries per hotel. Operations grind to a halt every morning." },
  { value: "60%", label: "Kitchen food waste before a guest sees their meal. 45–73% is avoidable." },
  { value: "~20%", label: "Of F&B inventory lost to spoilage from poor FIFO and over-ordering." },
  { value: "EGP 100K", label: "ETA penalty risk. Paper invoices are legally invalid since 2022." },
];

const STEPS = [
  { num: "Step 1", title: "Connect Your Suppliers", desc: "Onboard existing suppliers onto the platform. They get a free dashboard to manage orders, invoices, and payments." },
  { num: "Step 2", title: "AI Forecasts Your Needs", desc: "Our engine analyzes occupancy, seasonality, consumption patterns, and events to predict exactly what you need — before you run out." },
  { num: "Step 3", title: "Order, Track & Pay — Compliant", desc: "Create POs with pre-order cost estimates. Track deliveries in real time. Every invoice is ETA e-invoicing compliant automatically." },
];

const CATEGORIES = [
  { icon: "🍽️", title: "F&B Procurement", desc: "AI-powered demand forecasting. Predict what you need before you need it. Real-time price comparison across verified suppliers.", accent: "lime" as const },
  { icon: "🧹", title: "Housekeeping", desc: "Consumables tracking with automated reorder points. Never run out of linens, toiletries, or cleaning supplies.", accent: "purple" as const },
  { icon: "⚙️", title: "Engineering", desc: "Maintenance scheduling, spare parts inventory, and MRO procurement — all in one compliant workflow.", accent: "purple" as const },
  { icon: "✨", title: "Amenities", desc: "Guest experience supplies managed with par-level automation. Seasonal adjustments built into your forecast.", accent: "lime" as const },
  { icon: "🏗️", title: "Capital Equipment", desc: "Track high-value asset purchases, depreciation schedules, and vendor warranties. Compare supplier quotes.", accent: "purple" as const },
];

const FEATURES = [
  { icon: Cpu, title: "AI Demand Forecasting", desc: "Predict procurement needs based on occupancy, seasonality, and historical data.", accent: "lime" as const },
  { icon: Shield, title: "Authority Matrix", desc: "Multi-level approval enforcement based on order value thresholds.", accent: "purple" as const },
  { icon: FileCheck, title: "Native ETA Compliance", desc: "Full Egyptian Tax Authority e-invoicing integration. Zero penalty risk.", accent: "lime" as const },
  { icon: CreditCard, title: "Supplier Factoring", desc: "Non-recourse factoring via Oliv Finance. Suppliers get paid in under 10 seconds.", accent: "purple" as const },
  { icon: Truck, title: "Shared Logistics", desc: "Coastal cluster delivery within 48 hours with optimized routing.", accent: "lime" as const },
  { icon: Landmark, title: "Supply Chain Finance", desc: "Dynamic credit lines based on transaction history and supplier performance.", accent: "purple" as const },
];

const HOTEL_FEATURES = [
  { title: "AI Demand Forecasting", desc: "Predict F&B, housekeeping, and amenity needs based on occupancy, events, seasonality, and historical data." },
  { title: "Cost Estimation Pre-Order", desc: "See exact projected cost before approving any PO — no budget surprises." },
  { title: "Reorder Alerts", desc: "Automatic notifications when inventory hits par level, with suggested order quantities." },
  { title: "Spend Analytics Dashboard", desc: "Real-time visibility across all 5 categories, all properties, all suppliers — in one view." },
];

const SUPPLIER_FEATURES = [
  { title: "Instant InstaPay Settlement", desc: "Receive full invoice amount in <10 seconds via IPN. Zero deduction. 24/7 including weekends." },
  { title: "Non-Recourse Factoring", desc: "Get paid within 24 hours. We take the credit risk. If the hotel doesn't pay, that's our problem." },
  { title: "Purchase Order Visibility", desc: "See confirmed orders before you deliver. Plan your logistics with real hotel commitment data." },
];

export default function MarketingPage() {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -80]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.7]);

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          NAV
          ═══════════════════════════════════════════ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(5,5,5,0.80)] backdrop-blur-xl border-b border-[rgba(255,255,255,0.06)]">
        <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-9 h-9 flex items-center justify-center"
            >
              <img
                src="/logo-horse-only.png"
                alt=""
                width={28}
                height={28}
                className="invert-0"
                style={{ filter: "invert(1) drop-shadow(0 0 4px rgba(140,255,46,0.4))" }}
              />
            </motion.div>
            <span className="font-bold text-white text-base tracking-tight">
              Hotels<span className="text-[#8cff2e]">Vendors</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {["Platform", "For Hotels", "For Suppliers", "Pricing"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-[rgba(255,255,255,0.65)] hover:text-white text-sm font-medium transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 bg-[#171717] border border-[rgba(255,255,255,0.06)] text-white text-xs font-semibold rounded-lg hover:bg-[#1e1e1e] transition-all"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 bg-[#8cff2e] text-[#0d0d0d] text-xs font-bold rounded-lg hover:bg-[#a0ff4a] transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════ */}
      <motion.section
        style={{ y: heroY, opacity: heroOpacity }}
        className="pt-28 pb-20 bg-[#050505] relative"
      >
        {/* Ambient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-48 -right-48 w-[600px] h-[600px] bg-[#8cff2e] rounded-full blur-[200px] opacity-[0.03]" />
          <div className="absolute bottom-0 -left-48 w-[400px] h-[400px] bg-[#a855f7] rounded-full blur-[200px] opacity-[0.03]" />
        </div>

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[70vh]">
            {/* Left: Copy */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold text-[#8cff2e] border border-[rgba(140,255,46,0.2)] rounded-full bg-[rgba(140,255,46,0.08)] mb-8"
              >
                <span className="w-[6px] h-[6px] bg-[#8cff2e] rounded-full animate-pulse" />
                B2B PROCUREMENT · EGYPT
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }}
                className="text-4xl md:text-5xl lg:text-[56px] font-black mb-6 tracking-tight leading-[1.05]"
              >
                <span className="text-white">Control Your Hotel's</span>
                <br />
                <span className="text-white">Supply Chain</span>
                <br />
                <span className="text-[#8cff2e]">Before It Controls You.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base md:text-lg text-[rgba(255,255,255,0.65)] max-w-lg mb-10 leading-relaxed"
              >
                From F&B to capital equipment — track every dirham, automate every order, and get AI demand forecasting that prevents waste before it happens.
              </motion.p>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-col sm:flex-row gap-4 mb-10"
              >
                <motion.div variants={staggerItem}>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-7 py-3.5 bg-[#8cff2e] text-[#0d0d0d] font-bold rounded-xl text-sm hover:bg-[#a0ff4a] hover:-translate-y-0.5 transition-all"
                  >
                    Start Free — No Credit Card
                  </Link>
                </motion.div>
                <motion.div variants={staggerItem}>
                  <a
                    href="#platform"
                    className="inline-flex items-center gap-2 px-7 py-3.5 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white font-semibold rounded-xl text-sm hover:bg-[rgba(255,255,255,0.08)] transition-all"
                  >
                    <Play className="w-4 h-4" />
                    Watch How It Works
                  </a>
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="flex items-center gap-6 flex-wrap"
              >
                <span className="text-[11px] text-[rgba(255,255,255,0.45)] font-semibold uppercase tracking-widest">Trusted by hotels across Egypt</span>
                <div className="flex items-center gap-3">
                  {["5-STAR", "BOUTIQUE", "RESORT", "BUSINESS"].map((t) => (
                    <span key={t} className="flex items-center gap-1.5 text-[10px] text-[rgba(255,255,255,0.55)] font-semibold uppercase tracking-wider">
                      <span className="w-[4px] h-[4px] bg-[#8cff2e] rounded-full" />
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right: 3D Tilt Card */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] as const }}
              className="perspective-[1200px] hidden lg:flex justify-center"
            >
              <motion.div
                whileHover={{
                  rotateY: -4,
                  rotateX: 2,
                  y: -8,
                  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
                }}
                initial={{ rotateY: -8, rotateX: 4 }}
                className="w-full max-w-[460px] bg-[#0d0d0d] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 cursor-default"
                style={{ boxShadow: "-20px 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(140,255,46,0.05)" }}
              >
                <div className="flex justify-between mb-6 pb-5 border-b border-[rgba(255,255,255,0.06)]">
                  <div>
                    <div className="text-3xl font-black text-[#8cff2e] tracking-tight">EGP 180K</div>
                    <div className="text-[11px] text-[rgba(255,255,255,0.45)] uppercase font-semibold tracking-wider mt-1">Annual Waste Saved</div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black text-[#8cff2e] tracking-tight">~20%</div>
                    <div className="text-[11px] text-[rgba(255,255,255,0.45)] uppercase font-semibold tracking-wider mt-1">Spoilage Reduced</div>
                  </div>
                </div>
                <div className="flex items-end gap-1.5 h-16 mb-4">
                  {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-opacity"
                      style={{
                        height: `${h}%`,
                        backgroundColor: "#8cff2e",
                        opacity: i === 5 ? 1 : 0.15,
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-[rgba(255,255,255,0.45)]">Projected</span>
                  <span className="text-[#8cff2e] font-semibold font-mono">Actual ↑ 12%</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Lime gradient divider */}
      <div className="w-[120px] h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#8cff2e] to-transparent" />

      {/* ═══════════════════════════════════════════
          THE REALITY
          ═══════════════════════════════════════════ */}
      <section className="py-24 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8cff2e] mb-4">THE REALITY</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
              Egyptian Hotels Work With Hundreds of Suppliers.
              <br />
              <span className="text-[rgba(255,255,255,0.65)]">And Still Run Out of Stock Before They Run Out of Month.</span>
            </h2>
            <p className="text-base text-[rgba(255,255,255,0.65)] max-w-2xl mx-auto mt-6 leading-relaxed">
              The HoReCa market in Egypt will hit $18.14 billion by 2029. Yet the average hotel procurement operation runs on WhatsApp messages, paper invoices, cash payments, and prayers.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                variants={staggerItem}
                whileHover={{ y: -4, borderColor: "rgba(140,255,46,0.3)" }}
                className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.06)] rounded-2xl p-7 transition-all duration-300"
              >
                <div className="text-4xl font-black text-[#8cff2e] tracking-tight mb-3">{s.value}</div>
                <div className="text-[13px] text-[rgba(255,255,255,0.65)] leading-relaxed">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="w-[120px] h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#8cff2e] to-transparent" />

      {/* ═══════════════════════════════════════════
          HOW IT WORKS — 3 STEPS
          ═══════════════════════════════════════════ */}
      <section className="py-24 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8cff2e] mb-4">HOW IT WORKS</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Three Steps to Procurement Clarity
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num}
                variants={staggerItem}
                whileHover={{ y: -4, borderColor: "rgba(140,255,46,0.3)" }}
                className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 transition-all duration-300"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#8cff2e] mb-3">{step.num}</p>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-[14px] text-[rgba(255,255,255,0.65)] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="w-[120px] h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#8cff2e] to-transparent" />

      {/* ═══════════════════════════════════════════
          THE PLATFORM — BENTO GRID
          ═══════════════════════════════════════════ */}
      <section id="platform" className="py-24 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8cff2e] mb-4">THE PLATFORM</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              From F&B to Capital Equipment.
              <br />
              <span className="text-[rgba(255,255,255,0.65)]">Every Dirham Tracked. Every Invoice Compliant.</span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.title}
                variants={staggerItem}
                whileHover={{
                  y: -4,
                  borderColor: cat.accent === "lime" ? "rgba(140,255,46,0.3)" : "rgba(168,85,247,0.3)",
                  boxShadow: cat.accent === "lime"
                    ? "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(140,255,46,0.08)"
                    : "0 20px 60px rgba(0,0,0,0.4), 0 0 40px rgba(168,85,247,0.08)",
                }}
                className={`bg-[#0d0d0d] border border-[rgba(255,255,255,0.06)] rounded-2xl p-7 transition-all duration-300 ${i === 0 ? "md:col-span-2" : ""}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4 ${cat.accent === "lime" ? "bg-[rgba(140,255,46,0.12)]" : "bg-[rgba(168,85,247,0.12)]"}`}>
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-[14px] text-[rgba(255,255,255,0.65)] leading-relaxed mb-4">{cat.desc}</p>
                <span className={`inline-flex items-center gap-1 text-[13px] font-semibold ${cat.accent === "lime" ? "text-[#8cff2e]" : "text-[#a855f7]"} transition-all hover:gap-2`}>
                  Explore →
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="w-[120px] h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#8cff2e] to-transparent" />

      {/* ═══════════════════════════════════════════
          PLATFORM FEATURES — 6 CARDS
          ═══════════════════════════════════════════ */}
      <section className="py-24 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeInUp}
            className="text-center mb-16"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#a855f7] mb-4">PLATFORM FEATURES</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              Designed for Clarity.
              <br />
              <span className="text-[rgba(255,255,255,0.65)]">Built for Better Procurement Decisions.</span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={feat.title}
                  variants={staggerItem}
                  whileHover={{ y: -3, borderColor: "rgba(140,255,46,0.2)" }}
                  className="group p-6 bg-[#0d0d0d] border border-[rgba(255,255,255,0.06)] rounded-2xl transition-all duration-300"
                >
                  <Icon className={`w-8 h-8 mb-4 ${feat.accent === "lime" ? "text-[#8cff2e]" : "text-[#a855f7]"}`} />
                  <h3 className="font-bold text-white text-base mb-2">{feat.title}</h3>
                  <p className="text-[13px] text-[rgba(255,255,255,0.65)] leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <div className="w-[120px] h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#8cff2e] to-transparent" />

      {/* ═══════════════════════════════════════════
          FOR HOTELS
          ═══════════════════════════════════════════ */}
      <section id="for-hotels" className="py-24 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8cff2e] mb-4">FOR HOTELS</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-5">
                Control Before.
                <br />
                <span className="text-[rgba(255,255,255,0.65)]">Not After.</span>
              </h2>
              <p className="text-[15px] text-[rgba(255,255,255,0.65)] leading-relaxed mb-8">
                Most procurement platforms tell you what you spent last month. We tell you what you should order next week. HotelsVendors embeds AI-powered demand forecasting directly into your procurement workflow.
              </p>

              <ul className="space-y-5 mb-10">
                {HOTEL_FEATURES.map((f, i) => (
                  <motion.li
                    key={f.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-6 h-6 min-w-[24px] rounded-md bg-[rgba(168,85,247,0.12)] flex items-center justify-center mt-0.5">
                      <ChevronRight className="w-3.5 h-3.5 text-[#a855f7]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-[15px] mb-1">{f.title}</h4>
                      <p className="text-[13px] text-[rgba(255,255,255,0.65)] leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="inline-flex items-center px-7 py-3.5 bg-[#8cff2e] text-[#0d0d0d] font-bold rounded-xl text-sm hover:bg-[#a0ff4a] hover:-translate-y-0.5 transition-all">
                  Request Hotel Demo
                </Link>
                <Link href="/for-hotels" className="inline-flex items-center px-7 py-3.5 bg-[#a855f7] text-white font-bold rounded-xl text-sm hover:bg-[#b56dff] hover:-translate-y-0.5 transition-all">
                  Learn More
                </Link>
              </div>
            </motion.div>

            {/* Mockup card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={scaleIn}
            >
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(140,255,46,0.2)" }}
                className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.06)] rounded-2xl p-7 transition-all duration-400"
              >
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-[rgba(255,255,255,0.06)]">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                  </div>
                  <span className="text-[11px] text-[rgba(255,255,255,0.45)]">Forecasting Dashboard</span>
                </div>
                <p className="text-[12px] text-[rgba(255,255,255,0.65)] mb-4">Weekly Demand Forecast — F&B</p>
                <div className="flex items-end gap-2 h-24 mb-5">
                  {[50, 70, 45, 85, 60, 95, 75].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm transition-opacity"
                      style={{ height: `${h}%`, backgroundColor: "#8cff2e", opacity: i === 5 ? 1 : 0.15 }}
                    />
                  ))}
                </div>
                <div className="flex gap-6 pt-4 border-t border-[rgba(255,255,255,0.06)]">
                  <div><div className="text-xl font-black text-[#8cff2e]">-18%</div><div className="text-[10px] text-[rgba(255,255,255,0.45)] mt-0.5">Waste Reduction</div></div>
                  <div><div className="text-xl font-black text-[#a855f7]">EGP 15K</div><div className="text-[10px] text-[rgba(255,255,255,0.45)] mt-0.5">Monthly Savings</div></div>
                  <div><div className="text-xl font-black text-white">94%</div><div className="text-[10px] text-[rgba(255,255,255,0.45)] mt-0.5">Forecast Accuracy</div></div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="w-[120px] h-[1px] mx-auto bg-gradient-to-r from-transparent via-[#8cff2e] to-transparent" />

      {/* ═══════════════════════════════════════════
          FOR SUPPLIERS
          ═══════════════════════════════════════════ */}
      <section id="for-suppliers" className="py-24 bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Mockup */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={scaleIn}
              className="order-2 lg:order-1"
            >
              <motion.div
                whileHover={{ y: -4, borderColor: "rgba(140,255,46,0.2)" }}
                className="bg-[#0d0d0d] border border-[rgba(255,255,255,0.06)] rounded-2xl p-7 transition-all duration-400"
              >
                <div className="flex justify-between items-center mb-5 pb-4 border-b border-[rgba(255,255,255,0.06)]">
                  <div className="flex gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8cff2e] opacity-60" />
                  </div>
                  <span className="text-[11px] text-[rgba(255,255,255,0.45)]">Invoice Status</span>
                </div>
                <div className="text-center py-8">
                  <div className="text-[56px] font-black text-[#8cff2e] tracking-tight leading-none">&lt;10s</div>
                  <div className="text-[13px] text-[rgba(255,255,255,0.65)] mt-3">InstaPay Settlement</div>
                  <div className="flex gap-3 justify-center mt-7">
                    <span className="inline-flex items-center px-4 py-2 bg-[rgba(140,255,46,0.12)] border border-[rgba(140,255,46,0.2)] rounded-lg text-[12px] font-semibold text-[#8cff2e]">
                      ✓ Paid
                    </span>
                    <span className="inline-flex items-center px-4 py-2 bg-[#171717] border border-[rgba(255,255,255,0.06)] rounded-lg text-[12px] font-semibold text-[rgba(255,255,255,0.65)]">
                      Pending
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Copy */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeInUp}
              className="order-1 lg:order-2"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#8cff2e] mb-4">FOR SUPPLIERS</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-5">
                Get Paid.
                <br />
                <span className="text-[rgba(255,255,255,0.65)]">Not Promised.</span>
              </h2>
              <p className="text-[15px] text-[rgba(255,255,255,0.65)] leading-relaxed mb-5">
                The biggest barrier for Egyptian hospitality suppliers isn't finding buyers. It's collecting money after you've delivered. HotelsVendors changes the equation.
              </p>
              <p className="text-[15px] text-[rgba(255,255,255,0.65)] leading-relaxed mb-8">
                When a hotel approves your invoice, get paid instantly via InstaPay — funds hit your account in under 10 seconds, 24/7, even on weekends.
              </p>

              <ul className="space-y-5 mb-10">
                {SUPPLIER_FEATURES.map((f, i) => (
                  <motion.li
                    key={f.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08, duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
                    className="flex gap-4 items-start"
                  >
                    <div className="w-6 h-6 min-w-[24px] rounded-md bg-[rgba(168,85,247,0.12)] flex items-center justify-center mt-0.5">
                      <ChevronRight className="w-3.5 h-3.5 text-[#a855f7]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-[15px] mb-1">{f.title}</h4>
                      <p className="text-[13px] text-[rgba(255,255,255,0.65)] leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3">
                <Link href="/register" className="inline-flex items-center px-7 py-3.5 bg-[#8cff2e] text-[#0d0d0d] font-bold rounded-xl text-sm hover:bg-[#a0ff4a] hover:-translate-y-0.5 transition-all">
                  Become a Supplier
                </Link>
                <Link href="/for-suppliers" className="inline-flex items-center px-7 py-3.5 bg-[#a855f7] text-white font-bold rounded-xl text-sm hover:bg-[#b56dff] hover:-translate-y-0.5 transition-all">
                  Supplier FAQ
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════ */}
      <section className="py-24 bg-[#050505]">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={scaleIn}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-5">
              Ready to Take Control?
            </h2>
            <p className="text-[15px] text-[rgba(255,255,255,0.65)] leading-relaxed mb-10">
              Join Egypt's leading B2B hospitality procurement platform. No credit card required to start.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/register" className="inline-flex items-center px-8 py-4 bg-[#8cff2e] text-[#0d0d0d] font-bold rounded-xl text-base hover:bg-[#a0ff4a] hover:-translate-y-0.5 transition-all">
                Get Started Free
              </Link>
              <Link href="/demo" className="inline-flex items-center px-8 py-4 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-white font-semibold rounded-xl text-base hover:bg-[rgba(255,255,255,0.08)] transition-all">
                Schedule Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════ */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#050505]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <img src="/logo-horse-only.png" alt="" width={28} height={28} style={{ filter: "invert(1) drop-shadow(0 0 4px rgba(140,255,46,0.4))" }} />
                <span className="font-bold text-white text-base">
                  Hotels<span className="text-[#8cff2e]">Vendors</span>
                </span>
              </Link>
              <p className="text-[13px] text-[rgba(255,255,255,0.65)] leading-relaxed max-w-[260px]">
                B2B procurement platform for the Egyptian hospitality industry. Smarter Together.
              </p>
            </div>
            <div>
              <h5 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.45)] mb-4">Platform</h5>
              <div className="space-y-2.5">
                {["Features", "For Hotels", "For Suppliers", "Pricing", "ETA Compliance"].map((l) => (
                  <a key={l} href="#" className="block text-[13px] text-[rgba(255,255,255,0.65)] hover:text-[#8cff2e] transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.45)] mb-4">Company</h5>
              <div className="space-y-2.5">
                {["About", "Blog", "Careers", "Contact"].map((l) => (
                  <a key={l} href="#" className="block text-[13px] text-[rgba(255,255,255,0.65)] hover:text-[#8cff2e] transition-colors">{l}</a>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(255,255,255,0.45)] mb-4">Legal</h5>
              <div className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((l) => (
                  <a key={l} href="#" className="block text-[13px] text-[rgba(255,255,255,0.65)] hover:text-[#8cff2e] transition-colors">{l}</a>
                ))}
              </div>
            </div>
          </div>
          <div className="border-t border-[rgba(255,255,255,0.06)] pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <span className="text-[12px] text-[rgba(255,255,255,0.45)]">© 2026 HotelsVendors. All rights reserved.</span>
            <span className="text-[12px] text-[rgba(255,255,255,0.45)]">Built for Egyptian hospitality. Smarter Together.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
