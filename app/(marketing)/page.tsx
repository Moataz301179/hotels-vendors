"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";

/* ─────────── Data ─────────── */

const navLinks = ["Platform", "Market", "Traction", "Investors"];

const heroCarouselSlides = [
  { id: 1, src: "/carousel-hotel-procurement.jpg", title: "Procurement Reimagined", subtitle: "From chaos to controlled supply chain" },
  { id: 2, src: "/carousel-ai-forecasting.jpg", title: "AI-Powered Forecasting", subtitle: "94% accuracy predicting what you need, when you need it" },
  { id: 3, src: "/carousel-supplier-payment.jpg", title: "48-Hour Supplier Payments", subtitle: "Your vendors get paid fast while you keep Net-60 terms" },
  { id: 4, src: "/carousel-einvoicing.jpg", title: "ETA Compliant Automation", subtitle: "Egypt tax authority e-invoicing built into every transaction" },
];

const featureCards = [
  { id: "ai-demand", src: "/carousel-ai-forecasting.jpg", title: "AI Demand Forecasting", description: "Machine learning models trained on 500+ hotel procurement patterns predict inventory needs 14 days ahead with 94% accuracy.", stat: "94% Accuracy", icon: "brain" as const },
  { id: "reverse-factoring", src: "/carousel-supplier-payment.jpg", title: "Reverse Factoring Engine", description: "Embedded financing layer pays suppliers in 48 hours while hotels preserve their Net-60 payment terms.", stat: "48h Payment", icon: "dollar" as const },
  { id: "eta-compliance", src: "/carousel-einvoicing.jpg", title: "ETA E-Invoicing Integration", description: "Full Egyptian Tax Authority compliance with digital signatures, UUID validation, and automated VAT calculations.", stat: "Zero Errors", icon: "file" as const },
  { id: "marketplace", src: "/carousel-hotel-procurement.jpg", title: "Verified Supplier Marketplace", description: "680+ pre-vetted suppliers across F&B, OS&E, linens, maintenance, and logistics spanning 6 Egyptian governorates.", stat: "680+ Vendors", icon: "store" as const },
];

const platformStats = [
  { value: 680, suffix: "+", label: "Verified Suppliers" },
  { value: 500, suffix: "+", label: "Active Hotels" },
  { value: 12, suffix: "M+", label: "Monthly GMV (EGP)" },
];

const marketStats = [
  { value: 4.2, suffix: "B", label: "TAM (EGP)", sub: "Hospitality procurement market" },
  { value: 28, suffix: "%", label: "CAGR", sub: "Growth through 2029" },
  { value: 15, suffix: "%", label: "Inefficiency Loss", sub: "Recoverable via platform" },
];

const logos = ["Four Seasons", "Ritz-Carlton", "Mandarin Oriental", "Rosewood", "Peninsula", "Aman", "St. Regis", "W Hotels"];

const problemCards = [
  { title: "Manual Purchase Orders", description: "Procurement happens through WhatsApp, phone calls, and paper trails with zero audit visibility.", impact: "3-5 hours lost per property weekly" },
  { title: "Extended Payment Delays", description: "Suppliers wait 60-180 days for payment, leading to supply prioritization elsewhere.", impact: "15-25% price premium on late payers" },
  { title: "Compliance Overhead", description: "Manual ETA e-invoicing consumes finance team hours with UUID validation and error correction.", impact: "EGP 2.3M sector-wide annual penalties" },
  { title: "Zero Spend Intelligence", description: "No centralized view of purchasing patterns, supplier performance, or negotiation leverage.", impact: "No bulk bargaining power" },
];

const steps = [
  { number: "01", title: "Onboard", description: "Register in 5 minutes. AI maps your existing suppliers.", icon: "link" as const },
  { number: "02", title: "Forecast", description: "AI predicts demand from occupancy, seasonality, and events.", icon: "dashboard" as const },
  { number: "03", title: "Transact", description: "One-click POs. Automatic matching. Real-time tracking.", icon: "cart" as const },
  { number: "04", title: "Settle", description: "Invoices auto-reconcile. Suppliers paid in 48h.", icon: "check" as const },
];

const stakeholderCards = [
  { role: "Hotels", headline: "Cut Procurement Costs by 25%", benefits: ["AI forecasting with 94% accuracy", "680+ verified suppliers", "Automated ETA invoicing", "Net-60 preserved"] },
  { role: "Suppliers", headline: "Get Paid in 48 Hours", benefits: ["Access 500+ hotel buyers", "AI-powered order matching", "Early payment options", "API catalog integration"] },
  { role: "Funders", headline: "Finance Pre-Vetted Invoice Pools", benefits: ["ETA-compliant only", "Competitive pool bidding", "SHA-256 audit trail", "FRA-ready controls"] },
];

const tractionMetrics = [
  { label: "GMV Processed", value: "EGP 144M", change: "+127% YoY" },
  { label: "Active Hotels", value: "500+", change: "+89% YoY" },
  { label: "Supplier Network", value: "680+", change: "+156% YoY" },
  { label: "Platform Take Rate", value: "1.0%", change: "Industry best" },
];

const resultsMetrics = [
  { metric: "11 days → 4 hours", label: "Invoice Processing", desc: "End-to-end automation removes manual bottlenecks" },
  { metric: "90 days → 48 hours", label: "Supplier Payment", desc: "Embedded factoring delivers instant liquidity" },
  { metric: "38% lower", label: "Logistics Cost/Kilo", desc: "Aggregated demand enables route optimization" },
];

const investorPoints = [
  { title: "Network Effects", text: "680+ suppliers × 500+ hotels creates compounding switching costs." },
  { title: "Regulatory Moat", text: "First-mover in Egypt's mandatory ETA e-invoicing for hospitality." },
  { title: "Asset-Light Model", text: "Working capital financed by institutions — no balance sheet risk." },
  { title: "AI Defensibility", text: "Proprietary forecasting models improve with every transaction." },
];

const fundAllocation = [
  { area: "Product Engineering", pct: 40, detail: "AI/ML pipeline, mobile PWA, API infrastructure" },
  { area: "Go-to-Market", pct: 30, detail: "Enterprise sales, supplier acquisition, partnerships" },
  { area: "Regulatory", pct: 15, detail: "ETA certification, FRA licensing, legal framework" },
  { area: "Operations", pct: 15, detail: "Customer success, verification, support scaling" },
];

/* ─────────── Icons ─────────── */

type IconName = "arrow" | "bank" | "brain" | "cart" | "check" | "clock" | "dashboard" | "dollar" | "eye" | "file" | "hotel" | "invoice" | "link" | "play" | "reconcile" | "route" | "shield" | "spark" | "store" | "trend" | "truck" | "zap";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const p = { className: `h-5 w-5 ${className}`, viewBox: "0 0 24 24" as const, fill: "none" as const, stroke: "currentColor" as const, strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const svg = (children: ReactNode) => <svg {...p} aria-hidden={true}>{children}</svg>;

  switch (name) {
    case "arrow": return svg(<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>);
    case "bank": return svg(<><path d="M3 10h18"/><path d="m5 10 7-5 7 5"/><path d="M6 10v8"/><path d="M10 10v8"/><path d="M14 10v8"/><path d="M18 10v8"/><path d="M4 18h16"/></>);
    case "brain": return svg(<><path d="M9 5a3 3 0 0 0-5 2.2A3.5 3.5 0 0 0 5.5 14"/><path d="M15 5a3 3 0 0 1 5 2.2A3.5 3.5 0 0 1 18.5 14"/><path d="M9 5v14"/><path d="M15 5v14"/><path d="M9 19a3 3 0 0 1-4.6-2.5"/><path d="M15 19a3 3 0 0 0 4.6-2.5"/><path d="M9 10H7"/><path d="M15 10h2"/><path d="M9 14H7"/><path d="M15 14h2"/></>);
    case "cart": return svg(<><path d="M4 5h2l2 10h9l2-7H7"/><circle cx="10" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></>);
    case "check": return svg(<><path d="m5 12 4 4L19 6"/></>);
    case "clock": return svg(<><circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/></>);
    case "dashboard": return svg(<><path d="M4 13a8 8 0 0 1 16 0"/><path d="M12 13l4-4"/><path d="M6.4 17h11.2"/><path d="M8 21h8"/></>);
    case "dollar": return svg(<><path d="M12 3v18"/><path d="M17 7.5c-.8-1.2-2.4-2-4.2-2H11a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6h-1.8c-1.8 0-3.4-.8-4.2-2"/></>);
    case "eye": return svg(<><path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"/><circle cx="12" cy="12" r="2.5"/></>);
    case "file": return svg(<><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></>);
    case "hotel": return svg(<><path d="M4 21V6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v15"/><path d="M8 8h1"/><path d="M12 8h1"/><path d="M8 12h1"/><path d="M12 12h1"/><path d="M9 21v-5h4v5"/><path d="M3 21h18"/></>);
    case "invoice": return svg(<><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6"/><path d="M9 12h6"/><path d="M9 16h3"/></>);
    case "link": return svg(<><path d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1L10.6 5.3"/><path d="M14 11a5 5 0 0 0-7.1 0L5.5 12.4a5 5 0 0 0 7.1 7.1l.8-.8"/></>);
    case "play": return svg(<><path d="m8 5 11 7-11 7z"/></>);
    case "reconcile": return svg(<><path d="M5 7h9"/><path d="M5 12h14"/><path d="M5 17h8"/><path d="m16 16 2 2 4-5"/></>);
    case "route": return svg(<><circle cx="6" cy="6" r="2"/><circle cx="18" cy="18" r="2"/><path d="M8 6h4a4 4 0 0 1 0 8h-1a4 4 0 0 0 0 8h5"/></>);
    case "shield": return svg(<><path d="M12 3 19 6v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z"/><path d="m9 12 2 2 4-5"/></>);
    case "spark": return svg(<><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></>);
    case "store": return svg(<><path d="M4 10h16l-1-5H5z"/><path d="M6 10v10h12V10"/><path d="M9 20v-6h6v6"/><path d="M4 10c0 1.2 1 2 2 2s2-.8 2-2"/><path d="M8 10c0 1.2 1 2 2 2s2-.8 2-2"/><path d="M12 10c0 1.2 1 2 2 2s2-.8 2-2"/><path d="M16 10c0 1.2 1 2 2 2s2-.8 2-2"/></>);
    case "trend": return svg(<><path d="m4 16 6-6 4 4 6-7"/><path d="M15 7h5v5"/></>);
    case "truck": return svg(<><path d="M3 7h11v10H3z"/><path d="M14 10h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></>);
    case "zap": return svg(<><path d="M13 2 4 14h7l-1 8 10-13h-7z"/></>);
  }
}

/* ─────────── Utilities ─────────── */

function useIntersection(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

function AnimatedNumber({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const ran = useRef(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    let frameId: ReturnType<typeof requestAnimationFrame> | null = null;
    if (!el) return;

    const start = () => {
      const t0 = performance.now();
      const dur = 1600;
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
        if (p < 1) frameId = requestAnimationFrame(tick);
      };
      frameId = requestAnimationFrame(tick);
    };

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !ran.current) { ran.current = true; start(); obs.disconnect(); }
    }, { threshold: 0.45 });

    obs.observe(el);
    return () => { obs.disconnect(); if (frameId != null) cancelAnimationFrame(frameId); };
  }, [value]);

  return (
    <div className="text-center">
      <span ref={ref} className="block text-3xl font-bold tracking-tight text-[#f0ebe5] sm:text-4xl">{n}{suffix}</span>
      <span className="mt-1.5 block text-[10px] font-semibold uppercase tracking-[0.26em] text-[#8a857e]">{label}</span>
    </div>
  );
}

function SectionTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-[#5a574f]/40 bg-[#1e1c19]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.32em] text-[#b8aa88]">
      {children}
    </span>
  );
}

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useIntersection(0.12);
  return (
    <div ref={ref} className={`reveal ${visible ? "revealed" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function SolidCard({ children, className = "", hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  return <div className={`solid-card ${hover ? "solid-card-hover" : ""} ${className}`}>{children}</div>;
}

/* ─────────── Components ─────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300 ${scrolled ? "bg-[#16140f]" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#3d4a34]">
            <Icon name="shield" className="h-4 w-4 text-[#b8aa88]" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-[#f0ebe5]">HotelsVendors</span>
        </Link>

        <div className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-xs font-medium uppercase tracking-[0.18em] text-[#9a9590] transition-colors hover:text-[#f0ebe5]">{link}</a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-xs font-medium uppercase tracking-[0.18em] text-[#9a9590] transition-colors hover:text-[#f0ebe5] sm:block">Sign In</Link>
          <Link href="/signup" className="rounded-lg bg-[#b8aa88] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#16140f] transition-transform hover:scale-105">Get Started</Link>
        </div>
      </nav>
    </header>
  );
}

function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setActive((prev) => (prev + 1) % heroCarouselSlides.length), 4500);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#1a1815]">
      <div className="relative aspect-[16/7] sm:aspect-[21/9] overflow-hidden bg-[#121110]">
        {heroCarouselSlides.map((slide, idx) => (
          <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ${idx === active ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}>
            <img src={slide.src} alt="" className="h-full w-full object-cover" loading={idx === active ? "eager" : "lazy"} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#16140f] via-[#16140f]/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.36em] text-[#b8aa88]">HotelsVendors</p>
              <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{slide.title}</h3>
              <p className="mt-1 text-sm text-[#9a9590]">{slide.subtitle}</p>
            </div>
          </div>
        ))}

        <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {heroCarouselSlides.map((_, idx) => (
            <button key={idx} onClick={() => setActive(idx)} className={`h-1.5 rounded-full transition-all duration-400 ${idx === active ? "w-8 bg-[#b8aa88]" : "w-2 bg-white/35"}`} aria-label={`Slide ${idx + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="relative min-h-screen bg-[#0f0d0a] pt-20 pb-16">
      <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">
        <div className="hero-fade mb-8" style={{ animationDelay: "80ms" }}>
          <SectionTag>Series A Opportunity</SectionTag>
        </div>

        <div className="hero-fade grid max-w-4xl gap-6 sm:grid-cols-2" style={{ animationDelay: "160ms" }}>
          <h1 className="text-4xl font-extrabold leading-[1.08] tracking-[-0.06em] text-[#f0ebe5] sm:text-5xl lg:text-6xl">
            Turning Hotel<br />Procurement Into a<br />
            <span className="text-[#b8aa88]">Financial Advantage</span>
          </h1>
          <div className="flex flex-col justify-end">
            <p className="text-base leading-7 text-[#9a9590] sm:text-lg">
              AI-powered procurement platform with embedded reverse factoring and ETA e-invoicing.
              Your suppliers are paid in 48 hours — you preserve Net-60.
            </p>
            <div className="mt-5 flex gap-3">
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-[#b8aa88] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#16140f] transition-transform hover:scale-105">
                Get Started <Icon name="arrow" className="h-3.5 w-3.5" />
              </Link>
              <Link href="/sandbox" className="inline-flex items-center gap-2 rounded-lg border border-[#5a574f] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#f0ebe5] transition-transform hover:scale-105 hover:border-[#8a857e]">
                See Platform
              </Link>
            </div>
          </div>
        </div>

        <div className="hero-fade mt-10" style={{ animationDelay: "280ms" }}>
          <HeroCarousel />
        </div>

        <div className="hero-fade mt-8 flex items-center gap-3 text-xs text-[#8a857e]" style={{ animationDelay: "380ms" }}>
          <Icon name="spark" className="h-3.5 w-3.5 text-[#b8aa88]" />
          <span>Trusted by 500+ hotels from Sharm El Sheikh to the North Coast</span>
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  return (
    <section className="border-y border-[#2a2722] bg-[#16140f] py-10">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {platformStats.map((stat) => (
            <AnimatedNumber key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-7xl overflow-hidden px-6 lg:px-8 [mask-image:linear-gradient(to_right,transparent_4%,black_12%,black_88%,transparent_96%)]">
        <div className="marquee flex min-w-max items-center gap-12">
          {[...logos, ...logos].map((name, i) => (
            <span key={`${name}-${i}`} className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5a574f]/70 whitespace-nowrap">{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function MarketSection() {
  return (
    <section id="market" className="bg-[#0f0d0a] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <SectionTag>The Market</SectionTag>
            <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">A EGP 4.2B Procurement Market Ripe for Modernization</h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[#9a9590]">
              Egypt&apos;s hospitality sector is experiencing historic growth. With 15M+ annual visitors and accelerating hotel development, the procurement infrastructure remains stuck in the analog era.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-3">
              {marketStats.map((s) => (
                <div key={s.label} className="rounded-lg border border-[#2a2722] bg-[#16140f] p-3.5">
                  <p className="text-xl font-bold text-[#f0ebe5]">{s.value}{s.suffix}</p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#b8aa88]">{s.label}</p>
                  <p className="mt-1 text-[10px] text-[#6a6560]">{s.sub}</p>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="overflow-hidden rounded-xl border border-[#2a2722] bg-[#16140f]">
              <img src="/egypt-map.jpg" alt="Egypt coverage map" className="w-full object-cover aspect-square" />
              <div className="border-t border-[#2a2722] p-4">
                <p className="text-xs font-semibold text-[#f0ebe5]">6 Governorates Covered</p>
                <p className="mt-1 text-[11px] text-[#6a6560]">Red Sea · North Coast · Cairo · Alexandria · Luxor · Aswan</p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section className="bg-[#13110e] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <SectionTag>The Problem</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">Hotel Procurement Is Broken by Design</h2>
          <p className="mt-3 leading-relaxed text-[#9a9590]">Every inefficiency is an opportunity.</p>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {problemCards.map((card, i) => (
            <Reveal key={card.title} delay={i * 80}>
              <SolidCard>
                <p className="text-sm font-semibold text-[#f0ebe5]">{card.title}</p>
                <p className="mt-2 text-sm leading-6 text-[#8a857e]">{card.description}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded bg-[#2a2015]/50 px-2.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#c97b4a]" />
                  <span className="text-[11px] font-medium text-[#c97b4a]">{card.impact}</span>
                </div>
              </SolidCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureImageCards() {
  return (
    <section id="platform" className="bg-[#0f0d0a] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl text-center mx-auto">
          <SectionTag>The Platform</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">Four Pillars of Intelligent Procurement</h2>
          <p className="mt-3 leading-relaxed text-[#9a9590]">Each feature solves a specific pain point. Together they create an unbreakable competitive advantage.</p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {featureCards.map((feat, i) => (
            <Reveal key={feat.id} delay={i * 90}>
              <div className="group relative overflow-hidden rounded-xl border border-[#2a2722] bg-[#16140f] transition-transform duration-300 hover:-translate-y-1">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img src={feat.src} alt={feat.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16140f] via-[#16140f]/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="mb-2 inline-flex items-center gap-1.5 rounded-md bg-[#3d4a34]/85 backdrop-blur-sm px-2.5 py-1 text-[11px] font-bold text-[#b8aa88] opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-150">
                      <Icon name={feat.icon} className="h-3 w-3" />
                      {feat.stat}
                    </div>
                    <h3 className="text-lg font-bold text-white opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-250">{feat.title}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-[#b8bab0] opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 delay-350">{feat.description}</p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5 group-hover:opacity-0 group-hover:transition-opacity duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-[#f0ebe5]">{feat.title}</h3>
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#3d4a34]/60 text-[#b8aa88]">
                      <Icon name={feat.icon} className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="bg-[#13110e] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl text-center mx-auto">
          <SectionTag>How It Works</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">From Signup to First Transaction in Under 24 Hours</h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 90}>
              <SolidCard hover={false}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#5a574f]">{`0${i + 1}`}</span>
                  <Icon name={step.icon} className="h-4 w-4 text-[#b8aa88]" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-[#f0ebe5]">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-5 text-[#8a857e]">{step.description}</p>
              </SolidCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StakeholdersSection() {
  return (
    <section className="bg-[#0f0d0a] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl text-center mx-auto">
          <SectionTag>Ecosystem Value</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">One Platform, Three Winning Parties</h2>
        </Reveal>

        <div className="mt-10 space-y-4">
          {stakeholderCards.map((stakeholder, i) => (
            <Reveal key={stakeholder.role} delay={i * 100}>
              <div className="rounded-xl border border-[#2a2722] bg-[#16140f] p-5 sm:p-6 sm:grid sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-8">
                <div>
                  <SectionTag>{stakeholder.role}</SectionTag>
                  <h3 className="mt-2 text-lg font-semibold text-[#f0ebe5]">{stakeholder.headline}</h3>
                </div>
                <ul className="mt-4 grid gap-x-6 gap-y-1 sm:mt-0 sm:grid-cols-2">
                  {stakeholder.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-[#b8bab0]">
                      <Icon name="check" className="mt-0.5 h-3 w-3 shrink-0 text-[#b8aa88]" />
                      {b}
                    </li>
                  ))}
                </ul>
                <Link href="/signup" className="mt-4 hidden sm:mt-0 sm:inline-flex items-center gap-2 rounded-lg bg-[#b8aa88] px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-[#16140f] hover:scale-105 transition-transform">Learn More <Icon name="arrow" className="h-3 w-3" /></Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function TractionSection() {
  return (
    <section id="traction" className="bg-[#13110e] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl text-center mx-auto">
          <SectionTag>Traction</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">Numbers That Speak</h2>
        </Reveal>

        <Reveal className="mt-10">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tractionMetrics.map((m) => (
              <div key={m.label} className="rounded-lg border border-[#2a2722] bg-[#16140f] p-5">
                <p className="text-[11px] font-medium text-[#6a6560] uppercase tracking-wider">{m.label}</p>
                <p className="mt-2 text-2xl font-bold text-[#f0ebe5]">{m.value}</p>
                <p className="mt-1 text-xs font-semibold text-[#b8aa88]">{m.change}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-8">
          <div className="overflow-hidden rounded-xl border border-[#2a2722] bg-[#16140f]">
            <img src="/procurement-dashboard.jpg" alt="Platform dashboard preview" className="w-full aspect-[21/9] object-cover" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ResultsGrid() {
  return (
    <section className="bg-[#0f0d0a] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl text-center mx-auto">
          <SectionTag>Proven Impact</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">Before and After the Platform</h2>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {resultsMetrics.map((r, i) => (
            <Reveal key={r.label} delay={i * 100}>
              <SolidCard hover={false}>
                <p className="font-mono text-xl font-bold text-[#b8aa88]">{r.metric}</p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#6a6560]">{r.label}</p>
                <p className="mt-2 text-xs leading-5 text-[#8a857e]">{r.desc}</p>
              </SolidCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function InvestorSection() {
  return (
    <section id="investors" className="bg-[#13110e] py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal className="max-w-2xl text-center mx-auto">
          <SectionTag>For Investors</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">Why HotelsVendors Now</h2>
          <p className="mt-3 text-[#9a9590]">A unique position at the intersection of hospitality, fintech, and regulatory technology.</p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {investorPoints.map((point) => (
              <SolidCard key={point.title}>
                <h3 className="text-sm font-semibold text-[#f0ebe5]">{point.title}</h3>
                <p className="mt-2 text-xs leading-5 text-[#8a857e]">{point.text}</p>
              </SolidCard>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120} className="mt-10">
          <div className="rounded-xl border border-[#2a2722] bg-[#16140f] p-6 sm:p-8">
            <div className="grid gap-10 lg:grid-cols-2">
              <div>
                <h3 className="text-lg font-bold text-[#f0ebe5]">Use of Funds</h3>
                <p className="mt-1 text-xs text-[#6a6560]">Seed round allocation to accelerate growth.</p>
                <div className="mt-6 space-y-4">
                  {fundAllocation.map((item) => (
                    <div key={item.area}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium text-[#d8d3cc]">{item.area}</span>
                        <span className="font-semibold tabular-nums text-[#b8aa88]">{item.pct}%</span>
                      </div>
                      <div className="mt-1.5 h-1.5 rounded-full bg-[#2a2722]">
                        <div className="h-full rounded-full bg-[#3d4a34]" style={{ width: `${item.pct}%` }} />
                      </div>
                      <p className="mt-1 text-[11px] text-[#5a5550]">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#f0ebe5]">Advisory Board</h3>
                <p className="mt-1 text-xs text-[#6a6560]">Industry veterans guiding strategy.</p>
                <div className="mt-6 space-y-3">
                  {[
                    { initials: "AH", name: "Ahmed Hassan", role: "Ex-COO, Marriott MENA" },
                    { initials: "SD", name: "Sarah El-Din", role: "Former VP, FRA Egypt" },
                    { initials: "KM", name: "Karim Mansour", role: "Partner, Sawari Ventures" },
                  ].map((advisor) => (
                    <div key={advisor.initials} className="flex items-center gap-3 rounded-lg border border-[#2a2722]/60 bg-[#0f0d0a] p-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#3d4a34]/40 text-xs font-bold text-[#b8aa88]">{advisor.initials}</div>
                      <div>
                        <p className="text-sm font-semibold text-[#f0ebe5]">{advisor.name}</p>
                        <p className="text-[11px] text-[#b8aa88]">{advisor.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="bg-[#0f0d0a] py-20">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <Reveal>
          <SectionTag>Join Us</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">Ready to Transform Hospitality Procurement?</h2>
          <p className="mt-4 text-[#9a9590]">Join 500+ hotels. Live in 24 hours. No credit card required.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-[#b8aa88] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#16140f] hover:scale-105 transition-transform">
              Get Started Free <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="/sandbox" className="inline-flex items-center gap-2 rounded-lg border border-[#5a574f] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#f0ebe5] hover:border-[#8a857e] hover:scale-105 transition-transform">
              <Icon name="play" className="h-4 w-4" /> Explore Sandbox
            </Link>
          </div>
          <p className="mt-6 text-[11px] text-[#5a5550]">Free forever for hotels · Dedicated onboarding · Cairo-based support</p>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#2a2722] bg-[#0f0d0a] py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-6 text-xs text-[#5a5550] sm:flex-row sm:justify-between lg:px-8">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded bg-[#3d4a34]">
            <Icon name="shield" className="h-3.5 w-3.5 text-[#b8aa88]" />
          </span>
          <span className="font-semibold text-[#9a9590]">HotelsVendors</span>
        </div>
        <p>&copy; {new Date().getFullYear()} HotelsVendors. All rights reserved. Cairo, Egypt.</p>
        <div className="flex gap-5">
          <Link href="/login" className="hover:text-[#b8aa88] transition-colors">Sign In</Link>
          <Link href="/signup" className="hover:text-[#b8aa88] transition-colors">Get Started</Link>
          <Link href="/sandbox" className="hover:text-[#b8aa88] transition-colors">Sandbox</Link>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0d0a] antialiased">
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <MarketSection />
        <ProblemSection />
        <FeatureImageCards />
        <HowItWorks />
        <StakeholdersSection />
        <TractionSection />
        <ResultsGrid />
        <InvestorSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
