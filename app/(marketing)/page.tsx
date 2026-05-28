"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════
   MARKETING SKILLS APPLIED (coreyhaines31/marketingskills):
   - CRO: Social proof, trust signals, role-based CTAs, clarity 
   - Copywriting: Pain-first headlines, benefit-focused, "you" language
   - SEO: Semantic HTML, keyword-rich headings, structured content  
   - Onboarding: Clear pathways per user role, quick-start demos
   - Pricing: Transparent value proposition, cost-savings messaging
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
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = ["Platform", "Solutions", "Network", "Trust"];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? "bg-[#000000]/85 backdrop-blur-2xl border-b border-white/[0.04]"
        : "bg-transparent border-b border-transparent"
    }`}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="HotelsVendors Home">
          <img src="/logo-icon-white.png" alt="" width={22} height={32} className="object-contain opacity-80 group-hover:opacity-100 transition-opacity" />
          <span className="text-[14px] font-semibold text-white tracking-tight">HotelsVendors</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-[12px] font-medium text-white/30 hover:text-white/70 transition-colors tracking-wide uppercase">
              {item}
            </a>
          ))}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-[12px] font-medium text-white/50 hover:text-white transition-colors">Sign In</Link>
            <Link href="/register/hotel" className="text-[12px] font-semibold text-black bg-[#a3e635] hover:bg-[#bef264] px-5 py-2 rounded-full transition-all">Get Started</Link>
          </div>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white/60 hover:text-white transition-colors p-2" aria-label="Toggle menu">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {mobileOpen ? <path d="M18 6L6 18M6 6l12 12" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="md:hidden bg-[#000000]/95 backdrop-blur-2xl border-b border-white/[0.04]">
          <div className="px-6 py-4 space-y-3">
            {navLinks.map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} onClick={() => setMobileOpen(false)} className="block text-[13px] font-medium text-white/50 hover:text-white transition-colors py-1.5">{item}</a>
            ))}
            <div className="pt-3 border-t border-white/[0.04] flex gap-3">
              <Link href="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-[13px] font-medium text-white/50 hover:text-white transition-colors py-2.5 rounded-full border border-white/[0.08]">Sign In</Link>
              <Link href="/register/hotel" onClick={() => setMobileOpen(false)} className="flex-1 text-center text-[13px] font-semibold text-black bg-[#a3e635] hover:bg-[#bef264] py-2.5 rounded-full transition-all">Get Started</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════════
   HERO — Pain-first headline, social proof, role CTAs
   ═══════════════════════════════════════════════════════════ */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#000000]" aria-label="Hero">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(163,230,53,0.06),transparent_50%)]" />
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <motion.div custom={0} variants={fadeInUp} initial="hidden" animate="visible"
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-[#a3e635]/20 bg-[#a3e635]/[0.06]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#a3e635] animate-pulse" />
              <span className="text-[11px] font-medium text-[#a3e635] tracking-wide">Private Beta — Now Onboarding Egyptian Hotels</span>
            </motion.div>

            <motion.h1 custom={1} variants={fadeInUp} initial="hidden" animate="visible"
              className="text-[42px] sm:text-[52px] lg:text-[60px] font-semibold text-white leading-[1.06] tracking-[-0.03em]">
              Stop losing EGP 3M/year
              <br />
              <span className="text-white/25">to procurement leakage.</span>
            </motion.h1>

            <motion.p custom={2} variants={fadeInUp} initial="hidden" animate="visible"
              className="mt-6 text-[15px] text-white/35 max-w-[500px] leading-relaxed">
              HotelsVendors gives your procurement team AI-powered pre-spend control, automated ETA e-invoicing, and embedded supplier financing — so you catch overspend before it happens, not after month-end close.
            </motion.p>

            <motion.div custom={3} variants={fadeInUp} initial="hidden" animate="visible" className="mt-10 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/register/hotel"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#a3e635] text-black text-[14px] font-semibold rounded-full transition-all hover:bg-[#bef264] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(163,230,53,0.15)]">
                  Start Free Trial <span className="opacity-60">→</span>
                </Link>
                <Link href="/register/supplier"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/10 text-white/60 text-[14px] font-medium rounded-full transition-all hover:border-white/20 hover:text-white hover:bg-white/[0.03]">
                  Join as Supplier
                </Link>
              </div>
              <p className="text-[11px] text-white/15">No credit card required · 14-day free trial · Cancel anytime</p>
            </motion.div>

            <motion.div custom={4} variants={fadeInUp} initial="hidden" animate="visible"
              className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-4">
              {[
                { v: "EGP 25M+", l: "Annual Procurement Managed" },
                { v: "100%", l: "ETA Compliance" },
                { v: "54+", l: "Hotels in Network" },
              ].map((s, i) => (
                <div key={i} className="flex items-baseline gap-2">
                  <span className="text-[18px] font-bold text-white tracking-tight">{s.v}</span>
                  <span className="text-[10px] text-white/20 uppercase tracking-wider">{s.l}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div custom={2} variants={scaleIn} initial="hidden" animate="visible"
            className="relative hidden lg:block h-[500px]">
            <div className="absolute top-4 left-4 right-4 bottom-4 rounded-2xl overflow-hidden border border-white/[0.06] bg-[#000000]/80 backdrop-blur-xl shadow-[0_0_60px_rgba(163,230,53,0.03)]"
              style={{ transform: "perspective(1200px) rotateY(-8deg) rotateX(4deg)" }}>
              <img src="/intelligence-v2.jpg" alt="AI-powered procurement dashboard showing spend analytics and supplier performance" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-transparent to-transparent" />
              <div className="absolute top-6 left-6">
                <div className="text-[10px] text-[#a3e635] font-semibold uppercase tracking-wider">Live Dashboard</div>
                <div className="text-[13px] text-white/70 mt-1">Pre-Spend Intelligence</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-8 w-[260px] rounded-xl overflow-hidden border border-white/[0.06] bg-[#000000]/90 backdrop-blur-xl shadow-lg"
              style={{ transform: "perspective(1000px) rotateY(6deg) rotateX(-3deg)" }}>
              <img src="/compliance-v2.jpg" alt="ETA compliance dashboard" className="w-full h-auto opacity-80" />
            </div>
            <div className="absolute top-8 -right-4 px-4 py-2 rounded-full bg-[#a3e635]/90 backdrop-blur text-black text-[11px] font-semibold shadow-[0_4px_20px_rgba(163,230,53,0.3)]"
              style={{ transform: "perspective(800px) rotateY(-12deg)" }}>
              AI Swarm Active · 24/7
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   WHO IT'S FOR — Role-based pathways (Onboarding skill)
   ═══════════════════════════════════════════════════════════ */
function WhoSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const roles = [
    {
      title: "For Hotels",
      tagline: "Pre-spend control that pays for itself",
      desc: "Replace WhatsApp orders and paper POs with AI-powered procurement workflows. Get real-time spend visibility, automated 3-way matching, and ETA-compliant e-invoices — without adding headcount.",
      cta: "Start as a Hotel",
      href: "/register/hotel",
      accent: "#a3e635",
      stats: ["85% less reconciliation time", "3-day invoice cycle", "Full ETA compliance"],
    },
    {
      title: "For Suppliers",
      tagline: "Get paid faster. Sell more.",
      desc: "Access 54+ mid-to-luxury hotels actively procuring. Receive digital POs, submit ETA-compliant e-invoices in one click, and qualify for embedded factoring — get paid in days, not months.",
      cta: "Join as Supplier",
      href: "/register/supplier",
      accent: "#60a5fa",
      stats: ["54+ hotel buyers", "Same-day invoice submission", "Factoring available"],
    },
    {
      title: "For Factoring Partners",
      tagline: "De-risk lending with AI underwriting",
      desc: "Lend against verified, ETA-compliant invoices — not promises. Our swarm intelligence layer provides real-time credit scoring, spend pattern analysis, and automated risk assessment for every financed transaction.",
      cta: "Become a Partner",
      href: "/register/factoring",
      accent: "#fbbf24",
      stats: ["AI risk scoring", "Real-time invoice verification", "Automated settlement"],
    },
    {
      title: "For Logistics Providers",
      tagline: "Optimize routes. Reduce deadhead.",
      desc: "Get trip assignments from hotels and suppliers directly on the platform. AI route optimization, real-time tracking, digital PODs, and automated billing — all integrated with the procurement workflow.",
      cta: "Register as Shipper",
      href: "/register/shipping",
      accent: "#34d399",
      stats: ["Route optimization", "Digital proof of delivery", "Automated billing"],
    },
  ];

  return (
    <section id="solutions" className="py-32 bg-[#000000]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a3e635] mb-4 block">Solutions</span>
          <h2 className="text-[34px] md:text-[42px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
            Built for <span className="text-[#a3e635]">your</span> role in the supply chain
          </h2>
          <p className="mt-4 text-[15px] text-white/30 max-w-[600px] mx-auto leading-relaxed">
            One platform, four perspectives. Every stakeholder gets the tools, data, and workflows they need — without compromise.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {roles.map((role, i) => (
            <motion.div key={role.title} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="group relative rounded-2xl border border-white/[0.04] bg-[#000000] p-7 md:p-8 hover:border-white/[0.08] transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(90deg, transparent, ${role.accent}40, transparent)` }} />
              <span className="text-[10px] font-bold tracking-[0.15em] uppercase mb-4 block" style={{ color: role.accent }}>{role.title}</span>
              <h3 className="text-[20px] font-semibold text-white mb-3">{role.tagline}</h3>
              <p className="text-[13px] text-white/30 leading-relaxed mb-6">{role.desc}</p>
              <div className="flex flex-wrap gap-3 mb-8">
                {role.stats.map((stat) => (
                  <span key={stat} className="text-[11px] text-white/20 px-3 py-1 rounded-full border border-white/[0.04] bg-white/[0.02]">{stat}</span>
                ))}
              </div>
              <Link href={role.href} className="inline-flex items-center gap-2 text-[13px] font-semibold transition-colors"
                style={{ color: role.accent }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "white")}
                onMouseLeave={(e) => (e.currentTarget.style.color = role.accent)}>
                {role.cta} <span>→</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROBLEM SECTION
   ═══════════════════════════════════════════════════════════ */
function ProblemSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="platform" className="py-32 bg-[#000000]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="text-center mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a3e635] mb-4 block">Why HotelsVendors Exists</span>
          <h2 className="text-[34px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
            Your procurement team deserves <span className="text-white/20">better tools</span> than WhatsApp.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { stat: "EGP 3M", statLabel: "Annual Procurement Leakage", title: "No Pre-Spend Visibility", desc: "When orders go through WhatsApp and phone calls, there's no audit trail. Price discrepancies, duplicate orders, and unauthorized spend slip through — and you discover them at month-end, when it's too late." },
            { stat: "48 hrs", statLabel: "Average Invoice Processing Delay", title: "ETA Compliance Risk", desc: "Egypt's mandatory e-invoicing regime requires real-time submission. Manual processes create filing backlogs, tax authority penalties, and audit exposure. Every delayed invoice is a compliance risk." },
            { stat: "60-90", statLabel: "Day Payment Cycle Gap", title: "Working Capital Bottleneck", desc: "Suppliers need payment in 15-30 days. Your hotel works on 60-90 day cycles. The gap forces expensive short-term borrowing or strains supplier relationships — both cost you money." },
          ].map((card, i) => (
            <motion.div key={card.title} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="group relative rounded-2xl border border-white/[0.04] bg-[#000000] p-7 md:p-8 hover:border-[#a3e635]/15 transition-all duration-500">
              <div className="absolute top-0 left-0 right-0 h-px rounded-t-2xl bg-gradient-to-r from-transparent via-[#a3e635]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="text-[44px] font-bold text-[#a3e635]/[0.07] leading-none mb-3" style={{ fontFamily: "monospace" }}>{card.stat}</div>
              <div className="text-[10px] text-[#a3e635]/50 uppercase tracking-wider mb-5 font-semibold">{card.statLabel}</div>
              <h3 className="text-[16px] font-semibold text-white mb-3">{card.title}</h3>
              <p className="text-[13px] text-white/25 leading-relaxed">{card.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   PLATFORM SECTION
   ═══════════════════════════════════════════════════════════ */
function PlatformSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const features = [
    { title: "AI Procurement Intelligence", tag: "Intelligence", accent: "#a3e635", desc: "Multi-agent swarm continuously analyzes your spend patterns, detects price anomalies across suppliers, forecasts demand from occupancy signals — and flags savings opportunities before you approve a single purchase order.", img: "/intelligence-v2.jpg", large: true },
    { title: "ETA E-Invoicing Automation", tag: "Compliance", accent: "#34d399", desc: "Mandatory Egyptian Tax Authority integration. Every transaction generates a compliant e-invoice, submitted to ETA in real-time. Your finance team stops doing data entry and starts doing strategy.", img: "/compliance-v2.jpg" },
    { title: "Embedded Supplier Financing", tag: "Finance", accent: "#60a5fa", desc: "Licensed Egyptian fintech integration for invoice factoring, credit lines, and payment orchestration — all embedded in the procurement workflow. Suppliers get paid faster; you optimize working capital.", img: "/finance-v2.jpg" },
    { title: "Verified Supplier Network", tag: "Network", accent: "#fbbf24", desc: "Pre-qualified suppliers across Egypt — from Cairo to the Red Sea coast — covering F&B, housekeeping, linens, pool chemicals, and maintenance. Every supplier is verified for EGS code compliance.", img: "/network-v2.jpg" },
  ];

  return (
    <section className="py-32 bg-[#000000]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a3e635] mb-4 block">Platform</span>
          <h2 className="text-[34px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1] max-w-[650px]">
            Every procurement function. <span className="text-white/25">One platform.</span>
          </h2>
          <p className="mt-4 text-[15px] text-white/30 max-w-[500px] leading-relaxed">
            From demand sensing through ETA-compliant settlement — replacing phone calls, WhatsApp threads, and paper trails with AI-powered workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((feat, i) => (
            <motion.div key={feat.title} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className={`group relative rounded-2xl border border-white/[0.04] bg-[#000000] overflow-hidden hover:border-white/[0.08] transition-all duration-500 ${feat.large ? "md:col-span-2" : ""}`}>
              <div className="absolute top-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10"
                style={{ background: `linear-gradient(90deg, transparent, ${feat.accent}30, transparent)` }} />
              <div className="p-7 md:p-8 pb-0">
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase mb-3 block" style={{ color: feat.accent }}>{feat.tag}</span>
                <h3 className="text-[20px] font-semibold text-white mb-2">{feat.title}</h3>
                <p className="text-[13px] text-white/25 leading-relaxed max-w-[500px]">{feat.desc}</p>
              </div>
              <div className="mt-5 mx-4 mb-4 rounded-xl overflow-hidden border border-white/[0.03]">
                <img src={feat.img} alt={feat.title} className="w-full h-auto object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" loading="lazy" />
              </div>
            </motion.div>
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
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const steps = [
    { n: "01", title: "Demand Sensing", desc: "Our AI swarm analyzes your occupancy forecasts, seasonal patterns, and historical consumption to predict what you'll need — before procurement starts. No more emergency orders at peak rates.", accent: "#a3e635" },
    { n: "02", title: "Approval & Sourcing", desc: "Review AI-generated recommendations with full pre-spend visibility. Digital POs are dispatched to verified suppliers with configurable approval workflows — every decision is auditable.", accent: "#bef264" },
    { n: "03", title: "ETA-Compliant Execution", desc: "Goods receipt, GRN matching, and automatic e-invoice submission to the Egyptian Tax Authority. Every transaction tracked in real-time. Zero manual filing. Zero compliance gaps.", accent: "#a3e635" },
    { n: "04", title: "Continuous Optimization", desc: "The swarm continuously analyzes transaction patterns, detects price anomalies, and surfaces savings opportunities. Your procurement gets smarter every month without any manual data entry.", accent: "#bef264" },
  ];

  return (
    <section className="py-32 bg-[#000000]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-20">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a3e635] mb-4 block">How It Works</span>
          <h2 className="text-[34px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
            From forecast <span className="text-white/25">to fulfillment</span> in 4 steps
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
          <div className="hidden md:block absolute top-[28px] left-[12%] right-[12%] h-px bg-gradient-to-r from-[#a3e635]/30 via-[#bef264]/50 to-[#a3e635]/30" />
          {steps.map((step, i) => (
            <motion.div key={step.n} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="relative pl-0 md:pl-6 first:pl-0">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-white/[0.05] bg-[#000000]"
                style={{ boxShadow: `0 0 30px ${step.accent}10` }}>
                <span className="text-[16px] font-bold" style={{ color: step.accent, fontFamily: "monospace" }}>{step.n}</span>
              </div>
              <h3 className="text-[16px] font-semibold text-white mb-3">{step.title}</h3>
              <p className="text-[12px] text-white/25 leading-relaxed pr-3">{step.desc}</p>
            </motion.div>
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
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const cities = [
    { name: "Cairo & Giza", region: "Capital Corridor", hotels: "28+" },
    { name: "Hurghada", region: "Red Sea", hotels: "12+" },
    { name: "Sharm El-Sheikh", region: "South Sinai", hotels: "8+" },
    { name: "Alexandria", region: "North Coast", hotels: "6+" },
  ];
  const categories = ["F&B Supplies", "Housekeeping", "Linens & Textiles", "Pool Chemicals", "Maintenance", "Guest Amenities"];

  return (
    <section id="network" className="py-32 bg-[#000000]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a3e635] mb-4 block">Network</span>
              <h2 className="text-[34px] md:text-[42px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
                Nationwide coverage. <span className="text-white/25">Category depth.</span>
              </h2>
              <p className="mt-5 text-[15px] text-white/30 max-w-[450px] leading-relaxed">
                Active across Egypt's key hospitality corridors — from the Capital to the Red Sea — with verified suppliers in every category your hotel needs.
              </p>
            </motion.div>
            <div className="mt-10 grid grid-cols-2 gap-3">
              {cities.map((city, i) => (
                <motion.div key={city.name} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
                  className="rounded-xl border border-white/[0.04] bg-[#000000] p-5 hover:border-[#a3e635]/12 transition-all duration-300">
                  <div className="flex items-baseline justify-between mb-1">
                    <h4 className="text-[14px] font-semibold text-white">{city.name}</h4>
                    <span className="text-[15px] font-bold text-[#a3e635]">{city.hotels}</span>
                  </div>
                  <p className="text-[11px] text-white/20">{city.region}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-8">
              <p className="text-[10px] text-white/20 uppercase tracking-wider mb-3">Categories Covered</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <span key={cat} className="text-[11px] text-white/25 px-3 py-1.5 rounded-full border border-white/[0.04] bg-white/[0.01]">{cat}</span>
                ))}
              </div>
            </div>
          </div>
          <motion.div custom={2} variants={scaleIn} initial="hidden" animate={inView ? "visible" : "hidden"}
            className="relative rounded-2xl overflow-hidden border border-white/[0.04] aspect-[4/3]">
            <img src="/hero-hotel-drone.jpg" alt="Aerial view of Egyptian coastal hotel resort" className="w-full h-full object-cover opacity-55" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#000000] via-[#000000]/30 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-[12px] text-white/35 uppercase tracking-wider">Total Coverage</span>
                <span className="text-[32px] font-bold text-white">54+</span>
              </div>
              <div className="text-[11px] text-white/20">Hotels across 6 Egyptian governorates</div>
            </div>
          </motion.div>
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
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const badges = [
    { title: "ETA Compliant", desc: "Full Egyptian Tax Authority e-invoicing integration. Automated real-time submission — zero manual filing.", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
    { title: "Pre-Spend Gatekeeper", desc: "AI-powered cost analysis before money is committed. Flag anomalies, enforce budgets, prevent leakage.", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
    { title: "Fintech Licensed Partners", desc: "Integrated with licensed Egyptian financial institutions for secure payments, factoring, and credit.", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
    { title: "AI Swarm Intelligence", desc: "Multi-agent system continuously analyzing spend, compliance, cashflow, and procurement 24/7.", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
    { title: "Role-Based Access Control", desc: "Granular permissions per user role. Each stakeholder sees only what they need — nothing more.", icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" },
    { title: "Audit Trail & Governance", desc: "Every transaction, approval, and modification is logged immutably. Full audit trail for internal and external review.", icon: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8" },
  ];

  return (
    <section id="trust" className="py-32 bg-[#000000]" ref={ref}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a3e635] mb-4 block">Trust</span>
          <h2 className="text-[34px] md:text-[44px] font-semibold text-white tracking-[-0.03em] leading-[1.1]">
            Enterprise-grade trust. <span className="text-white/25">Built for Egyptian banking standards.</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge, i) => (
            <motion.div key={badge.title} custom={i} variants={fadeInUp} initial="hidden" animate={inView ? "visible" : "hidden"}
              className="group flex items-start gap-4 rounded-2xl border border-white/[0.04] bg-[#000000] p-6 hover:border-[#a3e635]/10 transition-all duration-500">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-[#a3e635]/[0.06] flex items-center justify-center border border-[#a3e635]/8 group-hover:bg-[#a3e635]/[0.10] transition-all">
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#a3e635" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d={badge.icon} />
                </svg>
              </div>
              <div>
                <h4 className="text-[14px] font-semibold text-white mb-1.5">{badge.title}</h4>
                <p className="text-[12px] text-white/25 leading-relaxed">{badge.desc}</p>
              </div>
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
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-32 bg-[#000000] relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(163,230,53,0.04),transparent_60%)]" />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
        className="relative z-10 max-w-[680px] mx-auto px-6 md:px-8 text-center">
        <h2 className="text-[34px] md:text-[48px] font-semibold text-white tracking-[-0.03em] leading-[1.08]">
          Ready to stop losing <span className="text-[#a3e635]">EGP 3M/year</span>?
        </h2>
        <p className="mt-6 text-[16px] text-white/35 leading-relaxed">
          Join Egypt's first AI-powered procurement orchestration platform. 14-day free trial. No credit card. Cancel anytime.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register/hotel"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#a3e635] text-black text-[14px] font-semibold rounded-full transition-all hover:bg-[#bef264] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(163,230,53,0.2)]">
            Start Free Trial <span className="opacity-60">→</span>
          </Link>
          <Link href="/register/supplier"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 border border-white/10 text-white/60 text-[14px] font-medium rounded-full transition-all hover:border-white/20 hover:text-white hover:bg-white/[0.03]">
            Join as Supplier
          </Link>
        </div>
        <p className="mt-6 text-[12px] text-white/15">
          14-day free trial · No credit card required · Cancel anytime · ETA-compliant from day one
        </p>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="py-16 border-t border-white/[0.03] bg-[#000000]" role="contentinfo">
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <img src="/logo-icon-white.png" alt="" width={20} height={29} className="object-contain opacity-60" />
              <span className="text-[13px] font-semibold text-white/40">HotelsVendors</span>
            </Link>
            <p className="text-[11px] text-white/15 leading-relaxed mb-4">AI-powered procurement orchestration for Egyptian hospitality. ETA-compliant, fintech-enabled.</p>
            <span className="text-[10px] text-white/10">Cairo, Egypt</span>
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-4">Product</h5>
            <ul className="space-y-2.5">
              {["Platform Overview", "Solutions", "How It Works", "Network", "Trust & Security"].map((l) => (<li key={l}><a href="#" className="text-[12px] text-white/15 hover:text-white/40 transition-colors">{l}</a></li>))}
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-4">For Teams</h5>
            <ul className="space-y-2.5">
              {["Hotel Procurement", "Supplier Portal", "Factoring Partners", "Logistics Providers"].map((l) => (<li key={l}><a href="#" className="text-[12px] text-white/15 hover:text-white/40 transition-colors">{l}</a></li>))}
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-4">Resources</h5>
            <ul className="space-y-2.5">
              {["Documentation", "API Reference", "Blog", "Help Center"].map((l) => (<li key={l}><a href="#" className="text-[12px] text-white/15 hover:text-white/40 transition-colors">{l}</a></li>))}
            </ul>
          </div>
          <div>
            <h5 className="text-[10px] font-semibold uppercase tracking-wider text-white/30 mb-4">Legal</h5>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Security", "Compliance"].map((l) => (<li key={l}><a href="#" className="text-[12px] text-white/15 hover:text-white/40 transition-colors">{l}</a></li>))}
            </ul>
          </div>
        </div>
        <div className="pt-6 border-t border-white/[0.02] flex flex-col md:flex-row justify-between items-center gap-3">
          <span className="text-[11px] text-white/10">© {new Date().getFullYear()} HotelsVendors. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span className="text-[10px] text-white/10">ETA Compliant</span>
            <span className="text-[10px] text-white/10">SOC 2 (in progress)</span>
          </div>
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
    <main className="min-h-screen bg-[#000000]" style={{ fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}>
      <LandingNav />
      <HeroSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      <WhoSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      <ProblemSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      <PlatformSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      <WorkflowSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      <NetworkSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      <TrustSection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      <CTASection />
      <div className="h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" />
      <Footer />
    </main>
  );
}