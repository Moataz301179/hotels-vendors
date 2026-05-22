"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

/* ═══════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } }),
};

const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };

/* ═══════════════════════════════════════════════════════════
   HORSE LOGO SVG (from VPS logo-horse-only.svg)
   ═══════════════════════════════════════════════════════════ */
function HorseLogo({ className = "", size = 28 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 80 100" fill="currentColor" className={className}>
      <path d="M55 8 L68 22 L62 35 L72 48 L60 65 L42 58 L30 70 L18 64 L12 78 L8 72 L14 52 L26 46 L20 32 L32 18 L45 24 L55 8Z" opacity="0.95"/>
      <path d="M30 70 L18 64 L14 52 L26 46 L20 32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.5"/>
      <path d="M42 58 L30 70" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.35"/>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════ */
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
      scrolled ? "border-white/[0.05] bg-[#0a0a0f]/80 backdrop-blur-2xl" : "border-transparent bg-transparent"
    }`}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <HorseLogo className="text-[#8b5cf6]" size={26} />
          <div className="flex items-baseline gap-2">
            <span className="text-[15px] font-semibold text-white tracking-tight">HotelsVendors</span>
            <span className="text-[10px] text-white/25 tracking-[0.1em] uppercase hidden sm:inline">Smarter Together</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {["Platform", "Workflow", "Network", "Trust"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[13px] text-white/40 hover:text-white transition-colors">
              {item}
            </a>
          ))}
          <Link href="/login" className="text-[13px] font-semibold text-white bg-[#8b5cf6] hover:bg-[#a78bfa] px-5 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(139,92,246,0.25)] hover:shadow-[0_0_30px_rgba(139,92,246,0.35)] hover:-translate-y-0.5">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO SECTION — Pipe.com Style
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">
      {/* Purple/blue light streaks at bottom */}
      <div className="absolute -bottom-[10%] -left-[10%] -right-[10%] h-[45%] z-[1] animate-streak-float"
        style={{
          background: `radial-gradient(ellipse 60% 30% at 15% 80%, rgba(139,92,246,0.18) 0%, transparent 70%),
                       radial-gradient(ellipse 50% 25% at 85% 75%, rgba(99,102,241,0.13) 0%, transparent 70%),
                       radial-gradient(ellipse 40% 20% at 50% 90%, rgba(168,85,247,0.08) 0%, transparent 60%),
                       radial-gradient(ellipse 30% 15% at 70% 85%, rgba(59,130,246,0.06) 0%, transparent 55%)`,
          filter: "blur(40px)",
        }}
      />
      {/* Top ambient glow */}
      <div className="absolute -top-[20%] left-[30%] right-[30%] h-[50%] z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.05) 0%, transparent 70%)" }}
      />
      {/* Vignette */}
      <div className="absolute inset-0 z-[3] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, transparent 30%, rgba(0,0,0,0.5) 100%)" }}
      />

      <div className="relative z-10 max-w-[720px] mx-auto px-6 text-center pt-24 pb-20">
        <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 border border-[#8b5cf6]/20 bg-[#8b5cf6]/[0.06]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6] animate-pulse" />
          <span className="text-[12px] font-medium text-[#a78bfa]">Private Beta — Egypt 2024</span>
        </motion.div>

        <motion.h1 custom={1} variants={fadeInUp} initial="hidden" animate="visible"
          className="text-[42px] sm:text-[52px] lg:text-[58px] font-medium text-white leading-[1.12] tracking-[-0.03em] text-balance"
          style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}>
          The modern capital platform.
        </motion.h1>

        <motion.h2 custom={2} variants={fadeInUp} initial="hidden" animate="visible"
          className="text-[42px] sm:text-[52px] lg:text-[58px] font-normal text-white/40 leading-[1.12] tracking-[-0.03em] mt-1 text-balance"
          style={{ fontFamily: "var(--font-body), system-ui, sans-serif" }}>
          Allowing you to grow on your terms.
        </motion.h2>

        <motion.p custom={3} variants={fadeInUp} initial="hidden" animate="visible"
          className="mt-7 text-base text-white/40 max-w-[540px] mx-auto leading-relaxed">
          Unify sourcing, financing, and logistics on a single AI-native platform — without fragmentation.
        </motion.p>

        <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible" className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register/hotel"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#0a0a0f] text-[14px] font-semibold rounded-full transition-all hover:bg-white/90 hover:shadow-[0_6px_32px_rgba(255,255,255,0.18)] hover:-translate-y-0.5">
            Get Started <span className="opacity-50">&gt;</span>
          </Link>
          <Link href="/register/supplier"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/10 text-white/70 text-[14px] font-medium rounded-full transition-all hover:border-white/20 hover:bg-white/[0.03] hover:text-white">
            Watch Demo
          </Link>
        </motion.div>

        <motion.div custom={5} variants={fadeInUp} initial="hidden" animate="visible"
          className="mt-6 flex items-center justify-center gap-2 text-[12px] text-white/25">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          No credit card required
        </motion.div>

        {/* Stats */}
        <motion.div custom={6} variants={fadeInUp} initial="hidden" animate="visible"
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-[640px] mx-auto">
          {[
            { value: "52", label: "Properties" },
            { value: "68", label: "Suppliers" },
            { value: "100%", label: "ETA Compliant" },
            { value: "EGP 86M", label: "Annual GMV" },
          ].map((stat) => (
            <div key={stat.label}
              className="text-center py-4 px-3 rounded-xl bg-white/[0.015] border border-white/[0.04] hover:border-[#8b5cf6]/20 hover:bg-[#8b5cf6]/[0.03] transition-all">
              <div className="text-[24px] font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-mono)" }}>{stat.value}</div>
              <div className="text-[10px] text-white/25 mt-1 uppercase tracking-[0.08em]">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLATFORM SECTION — Bento Grid
   ═══════════════════════════════════════════════════════════ */
function PlatformSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const cards = [
    {
      label: "INTELLIGENCE", color: "#c084fc",
      title: "Predictive Demand Engine",
      desc: "AI-powered demand forecasting driven by occupancy patterns, seasonality curves, and local market signals.",
      span: "md:col-span-2",
      img: "/intelligence-v2.jpg",
      imgAlt: "AI demand forecasting dashboard with predictive analytics",
    },
    {
      label: "COMPLIANCE", color: "#34d399",
      title: "ETA E-Invoicing",
      desc: "Real-time tax authority integration with automated submission and compliance verification.",
      span: "",
      img: "/compliance-v2.jpg",
      imgAlt: "ETA Egyptian Tax Authority e-invoicing compliance interface",
    },
    {
      label: "FINANCE", color: "#60a5fa",
      title: "Embedded Factoring",
      desc: "Supplier financing against approved invoices with risk-adjusted pricing and instant disbursement.",
      span: "",
      img: "/finance-v2.jpg",
      imgAlt: "Credit line dashboard with supplier financing analytics",
    },
    {
      label: "NETWORK", color: "#fbbf24",
      title: "Verified Supplier Grid",
      desc: "Pre-vetted suppliers across Egypt's key hospitality corridors — from Cairo to Aswan.",
      span: "md:col-span-2",
      img: "/network-v2.jpg",
      imgAlt: "Egypt supplier network map with verified connections",
    },
  ];

  return (
    <section id="platform" className="py-28 md:py-36 bg-[#0a0a0f]" ref={ref}>
      <div className="max-w-[1140px] mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8b5cf6] mb-3.5 px-3 py-1 rounded-full bg-[#8b5cf6]/[0.08] border border-[#8b5cf6]/10">
            Platform
          </span>
          <h2 className="text-[32px] md:text-[38px] font-medium text-white tracking-[-0.03em] leading-tight">
            Intelligence, compliance, and capital — unified.
          </h2>
          <p className="mt-3 text-[15px] text-white/35 max-w-[500px] mx-auto">From demand sensing to supplier settlement. One platform. Zero fragmentation.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cards.map((card, i) => (
            <motion.div key={card.label} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className={`group relative rounded-2xl border border-white/[0.05] bg-[#111118] p-7 hover:border-[#8b5cf6]/20 transition-all duration-300 hover:shadow-[0_0_60px_rgba(139,92,246,0.06)] hover:-translate-y-0.5 ${card.span}`}>
              {/* Top edge highlight */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8b5cf6]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              <span className="text-[10px] font-bold tracking-[0.14em]" style={{ color: card.color }}>{card.label}</span>
              <h3 className="text-[17px] font-semibold text-white mt-2.5">{card.title}</h3>
              <p className="text-[13px] text-white/30 mt-1.5 leading-relaxed">{card.desc}</p>

              {card.img && (
                <div className="mt-5 rounded-xl overflow-hidden border border-white/[0.04] group-hover:border-[#8b5cf6]/20 transition-colors">
                  <img src={card.img} alt={card.imgAlt} className="w-full h-auto object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              )}</motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WORKFLOW SECTION
   ═══════════════════════════════════════════════════════════ */
function WorkflowSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const steps = [
    { n: "01", title: "Intelligent Demand Sensing", desc: "AI analyzes occupancy, seasonality, and events to forecast procurement needs before they materialize." },
    { n: "02", title: "Autonomous Sourcing", desc: "Smart RFQs dispatched to verified suppliers. Competitive bidding ensures best pricing without manual effort." },
    { n: "03", title: "Governed Execution", desc: "Digital POs, GRN matching, ETA-compliant e-invoicing — every step tracked, every action auditable." },
    { n: "04", title: "Continuous Optimization", desc: "Spend analytics reveal savings opportunities. Supplier scorecards drive sustained performance gains." },
  ];

  return (
    <section id="workflow" className="py-28 md:py-36 bg-[#0d0d12]" ref={ref}>
      <div className="max-w-[1140px] mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8b5cf6] mb-3.5 px-3 py-1 rounded-full bg-[#8b5cf6]/[0.08] border border-[#8b5cf6]/10">Workflow</span>
          <h2 className="text-[32px] md:text-[38px] font-medium text-white tracking-[-0.03em] leading-tight">Autonomous procurement. End-to-end.</h2>
          <p className="mt-3 text-[15px] text-white/35 max-w-[500px] mx-auto">From demand signal to supplier payment — orchestrated automatically.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <div key={step.n} className="flex">
              <motion.div custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                className="group relative rounded-2xl border border-white/[0.05] bg-[#111118] p-6 mx-2 hover:border-white/[0.08] transition-all h-full">
                <div className="text-[36px] font-bold text-[#8b5cf6] opacity-[0.12] leading-none" style={{ fontFamily: "var(--font-mono)" }}>{step.n}</div>
                <h3 className="text-[14px] font-semibold text-white mt-3.5">{step.title}</h3>
                <p className="text-[12px] text-white/30 mt-2 leading-relaxed">{step.desc}</p>
              </motion.div>
              {i < 3 && <div className="hidden md:block h-px flex-1 mt-14 bg-gradient-to-r from-[#8b5cf6] to-transparent" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   NETWORK SECTION
   ═══════════════════════════════════════════════════════════ */
function NetworkSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const cities = [
    { name: "Cairo", count: "28 Properties", region: "Capital Region" },
    { name: "Alexandria", count: "8 Properties", region: "North Coast" },
    { name: "Hurghada", count: "6 Properties", region: "Red Sea" },
    { name: "Sharm El-Sheikh", count: "5 Properties", region: "South Sinai" },
    { name: "Luxor", count: "3 Properties", region: "Upper Egypt" },
    { name: "Aswan", count: "2 Properties", region: "Nubia" },
  ];

  return (
    <section id="network" className="py-28 md:py-36 bg-[#0a0a0f]" ref={ref}>
      <div className="max-w-[1140px] mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8b5cf6] mb-3.5 px-3 py-1 rounded-full bg-[#8b5cf6]/[0.08] border border-[#8b5cf6]/10">Network</span>
          <h2 className="text-[32px] md:text-[38px] font-medium text-white tracking-[-0.03em] leading-tight">Nationwide coverage. Local precision.</h2>
          <p className="mt-3 text-[15px] text-white/35 max-w-[500px] mx-auto">Active across Egypt&apos;s key hospitality corridors with dedicated on-ground support.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {cities.map((city, i) => (
            <motion.div key={city.name} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="rounded-xl border border-white/[0.05] bg-[#111118] p-5 hover:border-[#8b5cf6]/25 hover:-translate-y-[3px] hover:shadow-[0_12px_32px_rgba(139,92,246,0.06)] transition-all">
              <h4 className="text-[15px] font-semibold text-white">{city.name}</h4>
              <p className="text-[13px] text-[#8b5cf6] mt-1">{city.count}</p>
              <p className="text-[11px] text-white/20 mt-1">{city.region}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRUST SECTION
   ═══════════════════════════════════════════════════════════ */
function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const badges = [
    { icon: "shield", title: "ETA Compliant", desc: "Real-time Egyptian Tax Authority integration with automated e-invoice submission" },
    { icon: "check", title: "SOC 2 Ready", desc: "Type II audit in progress with full security controls documentation" },
    { icon: "lock", title: "GDPR Aware", desc: "Data protection by design with privacy-first architecture principles" },
    { icon: "key", title: "256-bit TLS", desc: "End-to-end encryption for all data in transit and at rest" },
  ];

  const iconSvg: Record<string, string> = {
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    check: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4",
    lock: "M3 11h18v10H3V11zm3-4a6 6 0 0112 0v4H6V7z",
    key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 11-7.778 7.778 5.5 5.5 0 017.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  };

  return (
    <section id="trust" className="py-28 md:py-36 bg-[#0d0d12]" ref={ref}>
      <div className="max-w-[1140px] mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-14">
          <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8b5cf6] mb-3.5 px-3 py-1 rounded-full bg-[#8b5cf6]/[0.08] border border-[#8b5cf6]/10">Trust</span>
          <h2 className="text-[32px] md:text-[38px] font-medium text-white tracking-[-0.03em] leading-tight">Enterprise-grade trust by design.</h2>
          <p className="mt-3 text-[15px] text-white/35 max-w-[500px] mx-auto">Built to the standards Egypt&apos;s leading hospitality operators demand.</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <motion.div key={badge.title} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="rounded-2xl border border-white/[0.05] bg-[#111118] p-8 text-center hover:border-white/[0.08] transition-all group">
              <div className="w-11 h-11 mx-auto rounded-full bg-[#8b5cf6]/[0.08] flex items-center justify-center mb-4 border border-[#8b5cf6]/10">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={iconSvg[badge.icon]} />
                </svg>
              </div>
              <h4 className="text-[14px] font-semibold text-white">{badge.title}</h4>
              <p className="text-[11px] text-white/25 mt-2 leading-relaxed">{badge.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="py-28 md:py-36 bg-[#0a0a0f]">
      <div className="max-w-[640px] mx-auto px-6 text-center">
        <h2 className="text-[32px] md:text-[38px] font-medium text-white tracking-[-0.03em] leading-tight">
          Ready to modernize your supply chain?
        </h2>
        <p className="mt-5 text-[17px] text-white/35 leading-relaxed">
          Join the network that is redefining hospitality procurement across Egypt.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register/hotel" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white text-[#0a0a0f] text-[14px] font-semibold rounded-full transition-all hover:bg-white/90 hover:shadow-[0_6px_32px_rgba(255,255,255,0.18)] hover:-translate-y-0.5">
            Get Started <span className="opacity-50">&gt;</span>
          </Link>
          <Link href="/register/supplier" className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/10 text-white/70 text-[14px] font-medium rounded-full transition-all hover:border-white/20 hover:bg-white/[0.03] hover:text-white">
            Watch Demo
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="py-14 border-t border-white/[0.04] bg-[#0a0a0f]">
      <div className="max-w-[1140px] mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-4">Product</h5>
            {["Platform Overview", "Workflow", "Coverage", "Pricing"].map((l) => (
              <a key={l} href="#" className="block text-[13px] text-white/20 hover:text-white/60 transition-colors mb-3">{l}</a>
            ))}
          </div>
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-4">Company</h5>
            {["About", "Solutions", "Partners"].map((l) => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="block text-[13px] text-white/20 hover:text-white/60 transition-colors mb-3">{l}</Link>
            ))}
          </div>
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-4">Resources</h5>
            {["Documentation", "API Reference", "Status"].map((l) => (
              <a key={l} href="#" className="block text-[13px] text-white/20 hover:text-white/60 transition-colors mb-3">{l}</a>
            ))}
          </div>
          <div>
            <h5 className="text-[11px] font-semibold uppercase tracking-wider text-white/60 mb-4">Legal</h5>
            {["Privacy Policy", "Terms of Service", "Security"].map((l) => (
              <a key={l} href="#" className="block text-[13px] text-white/20 hover:text-white/60 transition-colors mb-3">{l}</a>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t border-white/[0.03] flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <HorseLogo className="text-white/30" size={16} />
            <span className="text-[12px] text-white/15">HotelsVendors. All rights reserved.</span>
          </div>
          <span className="text-[11px] text-white/10">Cairo, Egypt</span>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0f]" style={{ fontFamily: "var(--font-body), system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif" }}>
      <LandingNav />
      <HeroSection />
      <PlatformSection />
      <WorkflowSection />
      <NetworkSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  );
}
