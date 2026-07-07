"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

const features = [
  { title: "AI Demand Forecasting", desc: "Predict inventory needs 14 days ahead with 94% accuracy." },
  { title: "Reverse Factoring", desc: "Suppliers paid in 48 hours. You keep Net-60 terms." },
  { title: "ETA E-Invoicing", desc: "Full Egyptian Tax Authority compliance, zero errors." },
  { title: "Supplier Marketplace", desc: "680+ verified vendors across 6 governorates." },
];

const steps = [
  { num: "01", title: "Onboard", desc: "Register in 5 minutes. AI maps your suppliers." },
  { num: "02", title: "Forecast", desc: "AI predicts demand from occupancy and seasonality." },
  { num: "03", title: "Transact", desc: "One-click POs. Automatic matching. Real-time tracking." },
  { num: "04", title: "Settle", desc: "Invoices auto-reconcile. Suppliers paid in 48h." },
];

function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-[#5a574f]/40 bg-[#1e1c19]/80 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#b8aa88]">
      {children}
    </span>
  );
}

function useReveal(threshold = 0.1) {
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

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const { ref, on } = useReveal();
  return (
    <div ref={ref} className={`transition-all duration-500 ease-out ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 h-14 sm:h-16 transition-all duration-200 ${scrolled ? "bg-[#16140f]/95 backdrop-blur-md border-b border-[#2a2722]" : "bg-transparent"}`}>
      <nav className="flex h-full max-w-6xl mx-auto items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center cursor-pointer z-50">
          <img src="/logo.svg" alt="HotelsVendors" className="h-6 sm:h-7" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-sm font-medium text-[#9a9590] hover:text-[#f0ebe5] transition-colors duration-150 cursor-pointer">Features</a>
          <a href="#how-it-works" className="text-sm font-medium text-[#9a9590] hover:text-[#f0ebe5] transition-colors duration-150 cursor-pointer">How It Works</a>
          <Link href="/login" className="text-sm font-medium text-[#9a9590] hover:text-[#f0ebe5] transition-colors duration-150 cursor-pointer">Sign In</Link>
          <Link href="/signup" className="inline-flex items-center justify-center min-h-[40px] px-4 rounded-lg bg-[#b8aa88] text-xs font-semibold uppercase tracking-wider text-[#16140f] hover:bg-[#c9b999] transition-all duration-150 cursor-pointer">Get Started</Link>
        </div>

        <button onClick={() => setOpen(!open)} className="flex md:hidden items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer z-50" aria-label="Menu">
          <svg className={`w-5 h-5 text-[#9a9590] transition-transform duration-200 ${open ? "rotate-90" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {open ? <><path d="M18 6 6 18"/><path d="m6 6 12 12"/></> : <><path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/></>}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="fixed inset-0 top-14 z-40 bg-[#0f0d0a] md:hidden">
          <div className="flex flex-col items-center gap-6 pt-16">
            <a href="#features" onClick={() => setOpen(false)} className="text-base font-medium text-[#f0ebe5] hover:text-[#b8aa88] transition-colors cursor-pointer">Features</a>
            <a href="#how-it-works" onClick={() => setOpen(false)} className="text-base font-medium text-[#f0ebe5] hover:text-[#b8aa88] transition-colors cursor-pointer">How It Works</a>
            <hr className="w-12 border-[#2a2722]" />
            <Link href="/login" onClick={() => setOpen(false)} className="text-base font-medium text-[#9a9590] hover:text-[#f0ebe5] transition-colors cursor-pointer">Sign In</Link>
            <Link href="/signup" onClick={() => setOpen(false)} className="inline-flex items-center justify-center min-h-[44px] px-8 rounded-lg bg-[#b8aa88] text-sm font-semibold uppercase tracking-wider text-[#16140f] hover:bg-[#c9b999] transition-all cursor-pointer">Get Started</Link>
          </div>
        </div>
      )}
    </header>
  );
}

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
  }, [slides.length]);

  return (
    <section className="relative min-h-dvh flex items-center bg-[#0f0d0a] pt-14 pb-12">
      <div className="w-full max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-3xl">
          <Reveal>
            <Tag>Series A Opportunity</Tag>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="mt-4 sm:mt-5 text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.15] tracking-[-0.03em] text-[#f0ebe5]">
              Turning Hotel Procurement Into a<br />
              <span className="text-[#b8aa88]">Financial Advantage</span>
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="mt-4 sm:mt-5 text-base sm:text-lg leading-relaxed text-[#9a9590] max-w-xl">
              AI-powered procurement platform with embedded reverse factoring and ETA e-invoicing.
              Your suppliers are paid in 48 hours — you preserve Net-60.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-6 sm:mt-7 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg bg-[#b8aa88] text-sm font-semibold uppercase tracking-wider text-[#16140f] hover:bg-[#c9b999] active:scale-[0.97] transition-all duration-150 cursor-pointer">
                Get Started
                <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
              </Link>
              <Link href="/sandbox" className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg border border-[#5a574f] text-sm font-semibold uppercase tracking-wider text-[#f0ebe5] hover:border-[#8a857e] active:scale-[0.97] transition-all duration-150 cursor-pointer">
                <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m8 5 11 7-11 7z"/></svg>
                See Platform
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={320}>
          <div className="mt-8 sm:mt-10 relative overflow-hidden rounded-xl aspect-[4/3] sm:aspect-[21/9] bg-[#121110]">
            {slides.map((s, idx) => (
              <div key={idx} className={`absolute inset-0 transition-all duration-500 ${idx === i ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}>
                <img src={s.src} alt="" className="h-full w-full object-cover" loading={idx === i ? "eager" : "lazy"} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0a] via-[#0f0d0a]/20 to-transparent" />
              </div>
            ))}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {slides.map((_, idx) => (
                <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all duration-200 cursor-pointer ${idx === i ? "w-7 bg-[#b8aa88]" : "w-1.5 bg-white/30"}`} aria-label={`Slide ${idx + 1}`} />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-4 sm:mt-5 flex items-center gap-2 text-sm text-[#8a857e]">
            <svg className="w-4 h-4 shrink-0 text-[#b8aa88]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></svg>
            <span>Trusted by 500+ hotels from Sharm El Sheikh to the North Coast</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-[#13110e] py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <Tag>The Platform</Tag>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#f0ebe5]">What You Get</h2>
          <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#9a9590]">Four pillars that turn procurement into a competitive advantage.</p>
        </Reveal>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="rounded-xl border border-[#2a2722] bg-[#16140f] p-5 sm:p-6 hover:border-[#3d4a34] transition-colors duration-200">
                <h3 className="text-base sm:text-lg font-semibold text-[#f0ebe5]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8a857e]">{f.desc}</p>
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
    <section id="how-it-works" className="bg-[#0f0d0a] py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <Reveal className="max-w-2xl">
          <Tag>How It Works</Tag>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#f0ebe5]">Live in 24 Hours</h2>
        </Reveal>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 60}>
              <div className="rounded-xl border border-[#2a2722] bg-[#16140f] p-5 sm:p-6">
                <span className="text-xs font-mono font-bold text-[#b8aa88]">{s.num}</span>
                <h3 className="mt-3 text-base sm:text-lg font-semibold text-[#f0ebe5]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#8a857e]">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="bg-[#13110e] py-16 sm:py-24">
      <div className="max-w-2xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <Tag>Get Started</Tag>
          <h2 className="mt-3 text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-[#f0ebe5]">Ready to Transform Your Procurement?</h2>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#9a9590]">Join 500+ hotels. No credit card required.</p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="inline-flex items-center justify-center min-h-[44px] w-full sm:w-auto px-6 rounded-lg bg-[#b8aa88] text-sm font-semibold uppercase tracking-wider text-[#16140f] hover:bg-[#c9b999] active:scale-[0.97] transition-all duration-150 cursor-pointer">
              Get Started Free
              <svg className="ml-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round"><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></svg>
            </Link>
            <Link href="/sandbox" className="inline-flex items-center justify-center min-h-[44px] w-full sm:w-auto px-6 rounded-lg border border-[#5a574f] text-sm font-semibold uppercase tracking-wider text-[#f0ebe5] hover:border-[#8a857e] active:scale-[0.97] transition-all duration-150 cursor-pointer">
              <svg className="mr-2 w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="m8 5 11 7-11 7z"/></svg>
              Explore Sandbox
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#2a2722] bg-[#0f0d0a] py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto px-5 sm:px-8">
        <img src="/logo.svg" alt="HotelsVendors" className="h-5 sm:h-6" />
        <p className="text-xs sm:text-sm text-[#5a5550]">&copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/login" className="text-xs sm:text-sm text-[#5a5550] hover:text-[#b8aa88] transition-colors duration-150 cursor-pointer">Sign In</Link>
          <Link href="/signup" className="text-xs sm:text-sm text-[#5a5550] hover:text-[#b8aa88] transition-colors duration-150 cursor-pointer">Get Started</Link>
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
        <Features />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
