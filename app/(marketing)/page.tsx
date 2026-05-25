"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   ANIMATION VARIANTS
   ═══════════════════════════════════════════════════════════ */
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] } }),
};
const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({ opacity: 1, transition: { duration: 0.8, delay: i * 0.1 } }),
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i: number) => ({ opacity: 1, scale: 1, transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] } }),
};

/* ═══════════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════════ */
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-[#050508]/80 backdrop-blur-2xl border-b border-white/[0.04]" : "bg-transparent border-b border-transparent"
    }`}>
      <div className="max-w-[1280px] mx-auto px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <img src="/logo-icon-white.png" alt="" width={22} height={32} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
          <span className="text-[14px] font-semibold text-white tracking-tight">HotelsVendors</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {["Platform", "Workflow", "Network", "Trust"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-[12px] font-medium text-white/30 hover:text-white/70 transition-colors tracking-wide uppercase">
              {item}
            </a>
          ))}
          <Link href="/login" className="text-[12px] font-semibold text-white bg-[#7c3aed] hover:bg-[#8b5cf6] px-5 py-2 rounded-full transition-all shadow-[0_0_20px_rgba(124,58,237,0.2)] hover:shadow-[0_0_30px_rgba(139,92,246,0.35)]">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO SECTION — Split-screen with floating UI mockups
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#050508]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-30%] right-[-10%] w-[70%] h-[80%] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.4) 0%, transparent 70%)", filter: "blur(120px)" }} />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)", filter: "blur(100px)" }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-8 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div>
            <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-[#7c3aed]/20 bg-[#7c3aed]/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7c3aed] animate-pulse" />
              <span className="text-[11px] font-medium text-[#a78bfa] tracking-wide">Private Beta — Egypt 2024</span>
            </motion.div>

            <motion.h1 custom={1} variants={fadeInUp} initial="hidden" animate="visible"
              className="text-[48px] sm:text-[56px] lg:text-[64px] font-semibold text-white leading-[1.08] tracking-[-0.03em]">
              Pre-spend control{" "}
              <span className="text-white/25">for Egyptian hospitality</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeInUp} initial="hidden" animate="visible"
              className="mt-6 text-[15px] text-white/35 max-w-[480px] leading-relaxed">
              HotelsVendors replaces WhatsApp orders and paper invoices with AI-powered procurement workflows, 
              ETA compliance, and embedded financing for mid-size Egyptian hotels managing EGP 17-25M in annual spend.
            </motion.p>

            <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible" className="mt-10 flex flex-row gap-4">
              <Link href="/register/hotel"
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#7c3aed] text-white text-[13px] font-semibold rounded-full transition-all hover:bg-[#8b5cf6] hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:-translate-y-0.5">
                Get Started <span className="opacity-60">→</span>
              </Link>
              <Link href="/register/supplier"
                className="inline-flex items-center gap-2 px-7 py-3 border border-white/10 text-white/50 text-[13px] font-medium rounded-full transition-all hover:border-white/20 hover:text-white hover:bg-white/[0.03]">
                Watch Demo
              </Link>
            </motion.div>

            {/* Mini stats row */}
            <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible"
              className="mt-14 flex items-center gap-8">
              {[
                { v: "EGP 25M", l: "Annual Procurement" },
                { v: "4-5 Star", l: "Hotel Segment" },
                { v: "100%", l: "ETA Compliant" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-[18px] font-bold text-white tracking-tight">{s.v}</div>
                  <div className="text-[10px] text-white/20 mt-0.5 uppercase tracking-wider">{s.l}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Floating UI mockups */}
          <motion.div custom={2} variants={scaleIn} initial="hidden" animate="visible" className="relative hidden lg:block h-[540px]">
            {/* Main dashboard card */}
            <div className="absolute top-4 left-4 right-4 bottom-4 rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0a0a12]/80 backdrop-blur-xl shadow-[0_32px_64px_rgba(0,0,0,0.4)]"
              style={{ transform: "perspective(1200px) rotateY(-8deg) rotateX(4deg)" }}>
              <img src="/intelligence-v2.jpg" alt="AI Procurement Dashboard" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a12] via-transparent to-transparent" />
            </div>
            {/* Floating smaller card */}
            <div className="absolute -bottom-4 -left-8 w-[260px] rounded-xl overflow-hidden border border-white/[0.06] bg-[#0a0a12]/90 backdrop-blur-xl shadow-[0_24px_48px_rgba(0,0,0,0.5)]"
              style={{ transform: "perspective(1000px) rotateY(6deg) rotateX(-3deg)" }}>
              <img src="/compliance-v2.jpg" alt="ETA Compliance" className="w-full h-auto opacity-80" />
            </div>
            {/* Floating badge */}
            <div className="absolute top-8 -right-4 px-4 py-2 rounded-full bg-[#7c3aed]/90 backdrop-blur text-white text-[11px] font-semibold shadow-[0_8px_32px_rgba(124,58,237,0.4)]"
              style={{ transform: "perspective(800px) rotateY(-12deg)" }}>
              AI Swarm Active
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROBLEM SECTION — Visual chaos vs control
   ═══════════════════════════════════════════════════════════ */
function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-32 bg-[#050508]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-4 block">The Problem</span>
          <h2 className="text-[36px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
            EGP 25M managed on <span className="text-white/20">WhatsApp</span>
          </h2>
        </motion.div>

        {/* Three pain point cards in a row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { 
              title: "Fragmented Communication", 
              desc: "Orders placed via WhatsApp, phone calls, and paper requisitions. No central record. No audit trail. Procurement managers spend hours reconciling supplier invoices against unknown purchase requests.",
              stat: "0%",
              statLabel: "Pre-spend Visibility"
            },
            { 
              title: "ETA Compliance Burden", 
              desc: "Egypt's mandatory e-invoicing regime requires every transaction to be submitted to the Tax Authority in real-time. Manual processes create filing backlogs, penalties, and audit risk.",
              stat: "48hrs",
              statLabel: "Avg. Invoice Delay"
            },
            { 
              title: "Cash Flow Inefficiency", 
              desc: "Suppliers demand payment in 15-30 days. Hotels operate on 60-90 day cycles. The working capital gap forces hotels into expensive short-term borrowing or supplier relationship strain.",
              stat: "EGP 6M",
              statLabel: "Tied-up Working Capital"
            },
          ].map((card, i) => (
            <motion.div key={i} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="group relative rounded-2xl border border-white/[0.04] bg-[#0a0a12] p-8 hover:border-[#7c3aed]/20 transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-[42px] font-bold text-[#7c3aed]/10 leading-none mb-4" style={{ fontFamily: "monospace" }}>{card.stat}</div>
              <div className="text-[10px] text-[#7c3aed]/60 uppercase tracking-wider mb-6">{card.statLabel}</div>
              <h3 className="text-[16px] font-semibold text-white mb-3">{card.title}</h3>
              <p className="text-[13px] text-white/30 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLATFORM SECTION — Editorial bento grid with images
   ═══════════════════════════════════════════════════════════ */
function PlatformSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="platform" className="py-32 bg-[#08080c]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-4 block">Platform</span>
          <h2 className="text-[36px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1] max-w-[600px]">
            One platform. Every procurement function.
          </h2>
          <p className="mt-4 text-[15px] text-white/30 max-w-[500px] leading-relaxed">
            From demand sensing through ETA-compliant settlement. Replacing phone calls, WhatsApp orders, and paper trails.
          </p>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Large card — AI Intelligence */}
          <motion.div custom={0} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="md:col-span-2 group relative rounded-2xl border border-white/[0.04] bg-[#0a0a12] overflow-hidden hover:border-[#7c3aed]/20 transition-all duration-500">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7c3aed]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-8 pb-0">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#c084fc] uppercase">Intelligence</span>
              <h3 className="text-[20px] font-semibold text-white mt-2">AI Procurement Intelligence</h3>
              <p className="text-[13px] text-white/30 mt-2 leading-relaxed max-w-[400px]">
                Multi-agent swarm continuously analyzes spend patterns, detects price anomalies, forecasts demand from occupancy signals, and surfaces savings opportunities.
              </p>
            </div>
            <div className="mt-6 mx-4 mb-4 rounded-xl overflow-hidden border border-white/[0.03]">
              <img src="/intelligence-v2.jpg" alt="AI Procurement Dashboard" className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>

          {/* Tall card — ETA Compliance */}
          <motion.div custom={1} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="group relative rounded-2xl border border-white/[0.04] bg-[#0a0a12] overflow-hidden hover:border-[#34d399]/20 transition-all duration-500 row-span-2">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#34d399]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-8">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#34d399] uppercase">Compliance</span>
              <h3 className="text-[20px] font-semibold text-white mt-2">ETA E-Invoicing</h3>
              <p className="text-[13px] text-white/30 mt-2 leading-relaxed">
                Mandatory Egyptian Tax Authority integration. Automated e-invoice generation, real-time submission, and compliance verification — zero manual filing.
              </p>
            </div>
            <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-white/[0.03]">
              <img src="/compliance-v2.jpg" alt="ETA Compliance Interface" className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>

          {/* Finance card */}
          <motion.div custom={2} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="group relative rounded-2xl border border-white/[0.04] bg-[#0a0a12] overflow-hidden hover:border-[#60a5fa]/20 transition-all duration-500">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#60a5fa]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-8">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#60a5fa] uppercase">Finance</span>
              <h3 className="text-[20px] font-semibold text-white mt-2">Embedded Supplier Financing</h3>
              <p className="text-[13px] text-white/30 mt-2 leading-relaxed">
                Licensed Egyptian fintech integration for invoice factoring, credit lines, and payment orchestration.
              </p>
            </div>
            <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-white/[0.03]">
              <img src="/finance-v2.jpg" alt="Supplier Financing Dashboard" className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>

          {/* Network card */}
          <motion.div custom={3} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="group relative rounded-2xl border border-white/[0.04] bg-[#0a0a12] overflow-hidden hover:border-[#fbbf24]/20 transition-all duration-500">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#fbbf24]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="p-8">
              <span className="text-[10px] font-bold tracking-[0.15em] text-[#fbbf24] uppercase">Network</span>
              <h3 className="text-[20px] font-semibold text-white mt-2">Verified Supplier Network</h3>
              <p className="text-[13px] text-white/30 mt-2 leading-relaxed">
                Pre-qualified suppliers across Egypt — from Cairo to the Red Sea — covering F&B, housekeeping, linens, and maintenance.
              </p>
            </div>
            <div className="mx-4 mb-4 rounded-xl overflow-hidden border border-white/[0.03]">
              <img src="/network-v2.jpg" alt="Supplier Network Map" className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WORKFLOW SECTION — Horizontal connected steps
   ═══════════════════════════════════════════════════════════ */
function WorkflowSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    { n: "01", title: "Demand Sensing", 
      desc: "AI swarm analyzes occupancy, seasonality, and local events to forecast procurement needs across F&B, housekeeping, linens, and maintenance — before spend is committed.",
      accent: "#7c3aed" },
    { n: "02", title: "Approval & Sourcing", 
      desc: "Procurement managers review AI-generated recommendations with pre-spend visibility. Digital POs dispatched to verified suppliers with approval workflows enforced.",
      accent: "#8b5cf6" },
    { n: "03", title: "ETA-Compliant Execution", 
      desc: "Goods receipt, GRN matching, and automatic e-invoice submission to the Egyptian Tax Authority — every transaction tracked, every step auditable.",
      accent: "#a78bfa" },
    { n: "04", title: "AI Optimization", 
      desc: "The swarm layer continuously analyzes transaction patterns, detects price anomalies, generates savings reports, and refines supplier performance — without manual data entry.",
      accent: "#c4b5fd" },
  ];

  return (
    <section id="workflow" className="py-32 bg-[#050508]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-4 block">Workflow</span>
          <h2 className="text-[36px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
            From forecast <span className="text-white/25">to fulfillment</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-px bg-gradient-to-r from-[#7c3aed] via-[#8b5cf6] to-[#c4b5fd] opacity-20" />

          {steps.map((step, i) => (
            <motion.div key={step.n} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="relative pl-0 md:pl-6 first:pl-0">
              {/* Step number */}
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/[0.05] bg-[#0a0a12]"
                style={{ boxShadow: `0 0 20px ${step.accent}15` }}>
                <span className="text-[16px] font-bold" style={{ color: step.accent, fontFamily: "monospace" }}>{step.n}</span>
              </div>
              <h3 className="text-[15px] font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-[12px] text-white/30 leading-relaxed pr-4">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   NETWORK SECTION — Coverage visualization
   ═══════════════════════════════════════════════════════════ */
function NetworkSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const cities = [
    { name: "Cairo & Giza", region: "Capital Corridor", hotels: "28+" },
    { name: "Alexandria", region: "North Coast", hotels: "8+" },
    { name: "Hurghada", region: "Red Sea", hotels: "6+" },
    { name: "Sharm El-Sheikh", region: "South Sinai", hotels: "5+" },
    { name: "Luxor", region: "Upper Egypt", hotels: "3+" },
    { name: "Aswan", region: "Nubia", hotels: "2+" },
  ];

  return (
    <section id="network" className="py-32 bg-[#08080c]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Text */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-4 block">Network</span>
            <h2 className="text-[36px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
              Nationwide coverage. <span className="text-white/25">Category depth.</span>
            </h2>
            <p className="mt-5 text-[15px] text-white/30 max-w-[420px] leading-relaxed">
              Active across Egypt&apos;s key hospitality corridors with verified suppliers in F&B, housekeeping, linens, and maintenance.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-4">
              {cities.slice(0, 4).map((city, i) => (
                <motion.div key={city.name} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                  className="rounded-xl border border-white/[0.04] bg-[#0a0a12] p-5 hover:border-[#7c3aed]/15 transition-all">
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-[14px] font-semibold text-white">{city.name}</h4>
                    <span className="text-[16px] font-bold text-[#7c3aed]">{city.hotels}</span>
                  </div>
                  <p className="text-[11px] text-white/20 mt-1">{city.region}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: City list + image */}
          <motion.div custom={2} variants={scaleIn} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="relative rounded-2xl overflow-hidden border border-white/[0.04] aspect-[4/3]">
            <img src="/hotel-cairo.jpg" alt="Egypt Hospitality" className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/40 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[12px] text-white/40 uppercase tracking-wider">Total Coverage</span>
                <span className="text-[28px] font-bold text-white">52+</span>
              </div>
              <div className="text-[11px] text-white/20">Hotels across 6 governorates</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   TRUST SECTION — Enterprise badges
   ═══════════════════════════════════════════════════════════ */
function TrustSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const badges = [
    { title: "ETA Compliant", desc: "Full Egyptian Tax Authority e-invoicing integration with automated real-time submission", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { title: "Pre-Spend Control", desc: "Approval workflows and AI-powered cost optimization before money is committed — not after", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { title: "Fintech Licensed", desc: "Integrated with licensed Egyptian financial institutions for payment and financing", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
    { title: "AI Swarm Layer", desc: "Multi-agent system continuously analyzing spend, compliance, cashflow, and procurement", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  ];

  return (
    <section id="trust" className="py-32 bg-[#050508]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7c3aed] mb-4 block">Trust</span>
          <h2 className="text-[36px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
            Enterprise trust <span className="text-white/25">by design</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {badges.map((badge, i) => (
            <motion.div key={badge.title} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="group flex items-start gap-5 rounded-2xl border border-white/[0.04] bg-[#0a0a12] p-7 hover:border-[#7c3aed]/15 transition-all duration-500">
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#7c3aed]/[0.08] flex items-center justify-center border border-[#7c3aed]/10">
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={badge.icon} />
                </svg>
              </div>
              <div>
                <h4 className="text-[15px] font-semibold text-white mb-1">{badge.title}</h4>
                <p className="text-[12px] text-white/30 leading-relaxed">{badge.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   CTA SECTION — Bold closing
   ═══════════════════════════════════════════════════════════ */
function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-32 bg-[#08080c] relative overflow-hidden" ref={ref}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-10"
        style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.6) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        className="relative z-10 max-w-[640px] mx-auto px-8 text-center">
        <h2 className="text-[36px] md:text-[48px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
          Stop managing procurement on <span className="text-[#7c3aed]">WhatsApp</span>.
        </h2>
        <p className="mt-6 text-[16px] text-white/35 leading-relaxed">
          Join Egypt&apos;s first AI-powered procurement orchestration platform — built for mid-size hotels that demand visibility before spend, not after.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register/hotel" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#7c3aed] text-white text-[13px] font-semibold rounded-full transition-all hover:bg-[#8b5cf6] hover:shadow-[0_0_40px_rgba(139,92,246,0.35)] hover:-translate-y-0.5">
            Get Started <span className="opacity-60">→</span>
          </Link>
          <Link href="/register/supplier" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/10 text-white/50 text-[13px] font-medium rounded-full transition-all hover:border-white/20 hover:text-white hover:bg-white/[0.03]">
            Watch Demo
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER — Minimal
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="py-14 border-t border-white/[0.03] bg-[#050508]">
      <div className="max-w-[1280px] mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-4">Product</h5>
            {["Platform Overview", "Workflow", "Coverage"].map((l) => (
              <a key={l} href="#" className="block text-[12px] text-white/15 hover:text-white/50 transition-colors mb-3">{l}</a>
            ))}
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-4">Company</h5>
            {["About", "Partners"].map((l) => (
              <a key={l} href="#" className="block text-[12px] text-white/15 hover:text-white/50 transition-colors mb-3">{l}</a>
            ))}
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-4">Resources</h5>
            {["Documentation", "API Reference"].map((l) => (
              <a key={l} href="#" className="block text-[12px] text-white/15 hover:text-white/50 transition-colors mb-3">{l}</a>
            ))}
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/40 mb-4">Legal</h5>
            {["Privacy Policy", "Terms of Service", "Security"].map((l) => (
              <a key={l} href="#" className="block text-[12px] text-white/15 hover:text-white/50 transition-colors mb-3">{l}</a>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[11px] text-white/10">HotelsVendors. All rights reserved.</span>
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
    <main className="min-h-screen bg-[#050508]" style={{ fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif" }}>
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <PlatformSection />
      <WorkflowSection />
      <NetworkSection />
      <TrustSection />
      <CTASection />
      <Footer />
    </main>
  );
}
