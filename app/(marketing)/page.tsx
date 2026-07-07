"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

/* ─────────── Data ─────────── */

const features = [
  {
    title: "AI Demand Forecasting",
    desc: "Predict inventory needs 14 days ahead with 94% accuracy.",
    image: "/carousel-ai-forecasting.jpg",
  },
  {
    title: "Reverse Factoring Engine",
    desc: "Suppliers paid in 48 hours while you keep Net-60 terms.",
    image: "/carousel-supplier-payment.jpg",
  },
  {
    title: "ETA E-Invoicing",
    desc: "Full Egyptian Tax Authority compliance, automated.",
    image: "/carousel-einvoicing.jpg",
  },
  {
    title: "Verified Supplier Marketplace",
    desc: "680+ pre-vetted vendors across 6 governorates.",
    image: "/supplier-network.jpg",
  },
];

const steps = [
  { num: "01", title: "Onboard", desc: "Register in 5 minutes. AI maps your suppliers." },
  { num: "02", title: "Forecast", desc: "AI predicts demand from occupancy and seasonality." },
  { num: "03", title: "Transact", desc: "One-click POs. Automatic matching." },
  { num: "04", title: "Settle", desc: "Auto-reconciliation. Suppliers paid in 48h." },
];

const partners = [
  "Four Seasons", "Ritz-Carlton", "Mandarin Oriental", "Rosewood",
  "Peninsula", "Aman", "St. Regis", "W Hotels",
];

/* ─────────── Icons ─────────── */

function Arrow({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>;
}

function Play({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m8 5 11 7-11 7z"/></svg>;
}

function Check({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round"><path d="m5 12 4 4L19 6"/></svg>;
}

function Spark({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>;
}

/* ─────────── Hooks ─────────── */

function useOnScreen(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, on };
}

function FadeUp({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, on } = useOnScreen();
  return (
    <div ref={ref} className={`transition-all duration-700 ease-out ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─────────── Nav ─────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300 ${scrolled ? "bg-[#0f0d0a]/90 backdrop-blur-xl border-b border-white/5" : "bg-transparent"}`}>
      <nav className="flex h-full max-w-6xl mx-auto items-center justify-between px-6 lg:px-8">
        <Link href="/" className="z-50 flex items-center">
          <img src="/logo.svg" alt="HotelsVendors" className="h-6 sm:h-7" />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {["Features", "How It Works"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`}
              className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200">
              {item}
            </a>
          ))}
          <Link href="/login" className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-200">Sign In</Link>
          <Link href="/signup"
            className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-[#b8aa88] text-xs font-semibold uppercase tracking-widest text-[#0f0d0a] hover:bg-[#c9b999] transition-all duration-200">
            Get Started
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden z-50 flex items-center justify-center h-10 w-10 text-white/60" aria-label="Menu">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {open
              ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></>
              : <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 top-16 z-40 bg-[#0f0d0a] md:hidden">
          <div className="flex flex-col items-center gap-6 pt-16">
            {["Features", "How It Works"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/\s/g, "-")}`} onClick={() => setOpen(false)}
                className="text-lg text-white/80 hover:text-white transition-colors">{item}</a>
            ))}
            <hr className="w-12 border-white/10" />
            <Link href="/login" onClick={() => setOpen(false)} className="text-lg text-white/60 hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" onClick={() => setOpen(false)}
              className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-[#b8aa88] text-sm font-semibold uppercase tracking-widest text-[#0f0d0a]">Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}

/* ─────────── Hero ─────────── */

function Hero() {
  const [i, setI] = useState(0);
  const slides = [
    { src: "/carousel-hotel-procurement.jpg" },
    { src: "/carousel-ai-forecasting.jpg" },
    { src: "/carousel-supplier-payment.jpg" },
  ];

  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-dvh flex items-center overflow-hidden bg-[#0f0d0a]">
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />

      {/* Gradient orbs */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#b8aa88]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#3d4a34]/10 blur-[100px] pointer-events-none" />

      <div className="relative w-full max-w-6xl mx-auto px-6 lg:px-8 pt-20 pb-16">
        <div className="max-w-3xl">
          <FadeUp>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b8aa88]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b8aa88] animate-pulse" />
              Series A Opportunity
            </span>
          </FadeUp>

          <FadeUp delay={100}>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-[-0.03em] text-white">
              Turning Hotel<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#b8aa88] to-[#d4c5a4]">Procurement Into a<br />Financial Advantage</span>
            </h1>
          </FadeUp>

          <FadeUp delay={180}>
            <p className="mt-5 text-base sm:text-lg leading-relaxed text-white/50 max-w-xl">
              AI-powered procurement platform with embedded reverse factoring and ETA e-invoicing.
              Your suppliers get paid in 48 hours — you keep your terms.
            </p>
          </FadeUp>

          <FadeUp delay={260}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup"
                className="group inline-flex items-center justify-center h-12 px-7 rounded-xl bg-[#b8aa88] text-sm font-bold uppercase tracking-widest text-[#0f0d0a] hover:bg-[#c9b999] active:scale-[0.97] transition-all duration-200">
                Get Started
                <Arrow className="ml-2.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/sandbox"
                className="inline-flex items-center justify-center h-12 px-7 rounded-xl border border-white/15 text-sm font-bold uppercase tracking-widest text-white/80 hover:bg-white/5 hover:border-white/25 active:scale-[0.97] transition-all duration-200">
                <Play className="mr-2.5 w-4 h-4" />
                See Platform
              </Link>
            </div>
          </FadeUp>
        </div>

        <FadeUp delay={340}>
          <div className="mt-12 relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
            <div className="aspect-[4/3] sm:aspect-[21/9] relative">
              {slides.map((s, idx) => (
                <div key={idx}
                  className={`absolute inset-0 transition-all duration-700 ${idx === i ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}>
                  <img src={s.src} alt="" className="h-full w-full object-cover" loading={idx === i ? "eager" : "lazy"} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0a] via-[#0f0d0a]/10 to-transparent" />
                </div>
              ))}
            </div>
          </div>
        </FadeUp>

        <FadeUp delay={420}>
          <div className="mt-5 flex items-center gap-2.5 text-sm text-white/40">
            <Spark className="w-4 h-4 text-[#b8aa88]" />
            <span>Trusted by 500+ hotels from Sharm El Sheikh to the North Coast</span>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────── Stats ─────────── */

function CountUp({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !done.current) {
        done.current = true;
        const t0 = performance.now();
        const dur = 1800;
        const raf = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          setVal(Math.round(end * (1 - Math.pow(1 - p, 3))));
          if (p < 1) requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end]);

  return <span ref={ref}>{val}{suffix}</span>;
}

/* ─────────── Features ─────────── */

function FeaturesSection() {
  return (
    <section id="features" className="relative bg-[#0f0d0a] py-24 sm:py-32 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      <div className="absolute top-[40%] left-[-20%] w-[30%] h-[30%] rounded-full bg-[#3d4a34]/8 blur-[100px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <FadeUp className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b8aa88]">
            The Platform
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-white">
            The Intelligent Procurement Stack
          </h2>
          <p className="mt-3 text-base leading-relaxed text-white/50">
            Four integrated pillars that turn procurement from a cost center into a competitive advantage.
          </p>
        </FadeUp>

        <div className="mt-14 grid gap-6 sm:grid-cols-2">
          {features.map((f, idx) => (
            <FadeUp key={f.title} delay={idx * 80}>
              <div className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-400">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={f.image} alt="" className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0a] via-[#0f0d0a]/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-7">
                  <h3 className="text-lg sm:text-xl font-bold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">{f.desc}</p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── How It Works ─────────── */

function HowItWorks() {
  return (
    <section id="how-it-works" className="relative bg-[#0f0d0a] py-24 sm:py-32 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] rounded-full bg-[#b8aa88]/5 blur-[120px] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
        <FadeUp className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b8aa88]">
            How It Works
          </span>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-white">
            From Signup to Savings in 24 Hours
          </h2>
        </FadeUp>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, idx) => (
            <FadeUp key={s.num} delay={idx * 60}>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 sm:p-7 h-full hover:bg-white/[0.04] transition-all duration-300">
                <span className="font-mono text-3xl font-bold text-white/10">{s.num}</span>
                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/45">{s.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────── Stats ─────────── */

function StatsSection() {
  const stats = [
    { end: 680, suffix: "+", label: "Verified Suppliers" },
    { end: 500, suffix: "+", label: "Active Hotels" },
    { end: 144, suffix: "M+", label: "GMV Processed (EGP)" },
    { end: 94, suffix: "%", label: "Forecast Accuracy" },
  ];

  return (
    <section className="relative overflow-hidden bg-[#0f0d0a] py-20 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-4">
          {stats.map((s) => (
            <FadeUp key={s.label}>
              <div className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-white tabular-nums">
                  <CountUp end={s.end} suffix={s.suffix} />
                </p>
                <p className="mt-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.2em] text-white/40">{s.label}</p>
              </div>
            </FadeUp>
          ))}
        </div>

        <FadeUp delay={100}>
          <div className="mt-12 overflow-hidden [mask-image:linear-gradient(to_right,transparent_2%,black_15%,black_85%,transparent_98%)]">
            <div             style={{ animation: "marquee 40s linear infinite" }}
            className="flex min-w-max items-center gap-12">
              {[...partners, ...partners].map((name, i) => (
                <span key={`${name}-${i}`} className="text-xs font-bold uppercase tracking-[0.25em] text-white/15 whitespace-nowrap">{name}</span>
              ))}
            </div>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────── CTA ─────────── */

function CTA() {
  return (
    <section className="relative bg-[#0f0d0a] py-28 sm:py-36 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full bg-[#b8aa88]/5 blur-[150px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-6 text-center">
        <FadeUp>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b8aa88]">
            Get Started
          </span>
          <h2 className="mt-6 text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-white">
            Ready to Transform Your Procurement?
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/50">
            Join 500+ hotels. No credit card required. Live in 24 hours.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup"
              className="group inline-flex items-center justify-center h-12 w-full sm:w-auto px-8 rounded-xl bg-[#b8aa88] text-sm font-bold uppercase tracking-widest text-[#0f0d0a] hover:bg-[#c9b999] active:scale-[0.97] transition-all duration-200">
              Get Started Free
              <Arrow className="ml-2.5 w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link href="/sandbox"
              className="inline-flex items-center justify-center h-12 w-full sm:w-auto px-8 rounded-xl border border-white/15 text-sm font-bold uppercase tracking-widest text-white/80 hover:bg-white/5 hover:border-white/25 active:scale-[0.97] transition-all duration-200">
              <Play className="mr-2.5 w-4 h-4" />
              Explore Sandbox
            </Link>
          </div>
        </FadeUp>
      </div>
    </section>
  );
}

/* ─────────── Footer ─────────── */

function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#0f0d0a] py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-5 max-w-6xl mx-auto px-6 lg:px-8">
        <img src="/logo.svg" alt="HotelsVendors" className="h-5 sm:h-6" />
        <p className="text-xs sm:text-sm text-white/30">&copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/login" className="text-xs sm:text-sm text-white/30 hover:text-white/60 transition-colors duration-200">Sign In</Link>
          <Link href="/signup" className="text-xs sm:text-sm text-white/30 hover:text-white/60 transition-colors duration-200">Get Started</Link>
        </div>
      </div>
    </footer>
  );
}

/* ─────────── Page ─────────── */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f0d0a] antialiased selection:bg-[#b8aa88]/30 selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <StatsSection />
        <FeaturesSection />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
