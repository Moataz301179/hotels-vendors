"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

/* ─────────── Design Tokens ─────────── */

const tokens = {
  color: {
    bg: "#0f0d0a",
    surface: "#16140f",
    surfaceHover: "#1e1c19",
    border: "#2a2722",
    borderHover: "#3d4a34",
    textPrimary: "#f0ebe5",
    textSecondary: "#9a9590",
    textMuted: "#5a5550",
    accent: "#b8aa88",
    accentHover: "#c9b999",
    accentDark: "#16140f",
    green: "#3d4a34",
  },
  spacing: {
    section: "py-24 sm:py-32",
    container: "max-w-6xl mx-auto px-5 sm:px-8",
    gap: "gap-4 sm:gap-6",
  },
  radius: {
    card: "rounded-xl",
    button: "rounded-lg",
    tag: "rounded-full",
  },
} as const;

/* ─────────── Data ─────────── */

const heroSlides = [
  { id: 1, src: "/carousel-hotel-procurement.jpg", title: "Procurement Reimagined", subtitle: "From chaos to controlled supply chain" },
  { id: 2, src: "/carousel-ai-forecasting.jpg", title: "AI-Powered Forecasting", subtitle: "94% accuracy predicting what you need, when you need it" },
  { id: 3, src: "/carousel-supplier-payment.jpg", title: "48-Hour Supplier Payments", subtitle: "Your vendors get paid fast while you keep Net-60 terms" },
];

const features = [
  { icon: "brain" as const, title: "AI Demand Forecasting", desc: "Predict inventory needs 14 days ahead with 94% accuracy." },
  { icon: "dollar" as const, title: "Reverse Factoring", desc: "Suppliers paid in 48 hours. You keep Net-60 terms." },
  { icon: "file" as const, title: "ETA E-Invoicing", desc: "Full Egyptian Tax Authority compliance, zero errors." },
  { icon: "store" as const, title: "Supplier Marketplace", desc: "680+ verified vendors across 6 governorates." },
];

const steps = [
  { num: "01", title: "Onboard", desc: "Register in 5 minutes. AI maps your suppliers." },
  { num: "02", title: "Forecast", desc: "AI predicts demand from occupancy and seasonality." },
  { num: "03", title: "Transact", desc: "One-click POs. Automatic matching. Real-time tracking." },
  { num: "04", title: "Settle", desc: "Invoices auto-reconcile. Suppliers paid in 48h." },
];

/* ─────────── Icons ─────────── */

type IconName = "arrow" | "brain" | "dollar" | "file" | "play" | "store" | "spark";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const s = { className: `w-5 h-5 ${className}`, viewBox: "0 0 24 24" as const, fill: "none" as const, stroke: "currentColor" as const, strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const svg = (c: ReactNode) => <svg {...s}>{c}</svg>;
  switch (name) {
    case "arrow": return svg(<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>);
    case "brain": return svg(<><path d="M9 5a3 3 0 0 0-5 2.2A3.5 3.5 0 0 0 5.5 14"/><path d="M15 5a3 3 0 0 1 5 2.2A3.5 3.5 0 0 1 18.5 14"/><path d="M9 5v14"/><path d="M15 5v14"/><path d="M9 19a3 3 0 0 1-4.6-2.5"/><path d="M15 19a3 3 0 0 0 4.6-2.5"/><path d="M9 10H7"/><path d="M15 10h2"/><path d="M9 14H7"/><path d="M15 14h2"/></>);
    case "dollar": return svg(<><path d="M12 3v18"/><path d="M17 7.5c-.8-1.2-2.4-2-4.2-2H11a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6h-1.8c-1.8 0-3.4-.8-4.2-2"/></>);
    case "file": return svg(<><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></>);
    case "play": return svg(<><path d="m8 5 11 7-11 7z"/></>);
    case "store": return svg(<><path d="M4 10h16l-1-5H5z"/><path d="M6 10v10h12V10"/><path d="M9 20v-6h6v6"/></>);
    case "spark": return svg(<><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></>);
  }
}

/* ─────────── Utilities ─────────── */

function useReveal(threshold = 0.12) {
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

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, on } = useReveal();
  return (
    <div ref={ref} className={`transition-all duration-600 ease-out ${on ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

/* ─────────── Components ─────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 h-16 transition-all duration-300 ${scrolled ? "bg-[#16140f]/95 backdrop-blur-md border-b border-[#2a2722]" : "bg-transparent"}`}>
      <nav className="flex h-full max-w-6xl mx-auto items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <img src="/logo-horse.svg" alt="HotelsVendors" className="h-9 w-9 rounded-lg" />
          <span className="text-sm font-semibold tracking-tight text-[#f0ebe5]">HotelsVendors</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-xs font-medium uppercase tracking-[0.16em] text-[#9a9590] hover:text-[#f0ebe5] transition-colors cursor-pointer">Features</a>
          <a href="#how-it-works" className="text-xs font-medium uppercase tracking-[0.16em] text-[#9a9590] hover:text-[#f0ebe5] transition-colors cursor-pointer">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden sm:block text-xs font-medium text-[#9a9590] hover:text-[#f0ebe5] transition-colors cursor-pointer">Sign In</Link>
          <Link href="/signup" className="inline-flex items-center justify-center min-h-[44px] px-5 rounded-lg bg-[#b8aa88] text-xs font-semibold uppercase tracking-wider text-[#16140f] hover:bg-[#c9b999] active:scale-[0.97] transition-all cursor-pointer">Get Started</Link>
        </div>
      </nav>
    </header>
  );
}

function HeroCarousel() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI(p => (p + 1) % heroSlides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl aspect-[16/7] sm:aspect-[21/9] bg-[#121110]">
      {heroSlides.map((s, idx) => (
        <div key={s.id} className={`absolute inset-0 transition-all duration-700 ${idx === i ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}>
          <img src={s.src} alt="" className="h-full w-full object-cover" loading={idx === i ? "eager" : "lazy"} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0a] via-[#0f0d0a]/20 to-transparent" />
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {heroSlides.map((_, idx) => (
          <button key={idx} onClick={() => setI(idx)} className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${idx === i ? "w-8 bg-[#b8aa88]" : "w-2 bg-white/30"}`} aria-label={`Slide ${idx + 1}`} />
        ))}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#0f0d0a] pt-20 pb-16">
      <div className={tokens.spacing.container + " w-full"}>
        <div className="max-w-3xl">
          <Reveal>
            <span className="inline-block rounded-full border border-[#5a574f]/40 bg-[#1e1c19]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.32em] text-[#b8aa88] mb-6">Series A Opportunity</span>
          </Reveal>

          <Reveal delay={100}>
            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-[-0.04em] text-[#f0ebe5] sm:text-5xl lg:text-6xl">
              Turning Hotel<br />Procurement Into a<br />
              <span className="text-[#b8aa88]">Financial Advantage</span>
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#9a9590]">
              AI-powered procurement platform with embedded reverse factoring and ETA e-invoicing.
              Your suppliers are paid in 48 hours — you preserve Net-60.
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/signup" className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg bg-[#b8aa88] text-sm font-semibold uppercase tracking-wider text-[#16140f] hover:bg-[#c9b999] active:scale-[0.97] transition-all cursor-pointer">
                Get Started <Icon name="arrow" className="ml-2 w-4 h-4" />
              </Link>
              <Link href="/sandbox" className="inline-flex items-center justify-center min-h-[44px] px-6 rounded-lg border border-[#5a574f] text-sm font-semibold uppercase tracking-wider text-[#f0ebe5] hover:border-[#8a857e] active:scale-[0.97] transition-all cursor-pointer">
                <Icon name="play" className="mr-2 w-4 h-4" /> See Platform
              </Link>
            </div>
          </Reveal>
        </div>

        <Reveal delay={400} className="mt-12">
          <HeroCarousel />
        </Reveal>

        <Reveal delay={500}>
          <div className="mt-6 flex items-center gap-3 text-xs text-[#8a857e]">
            <Icon name="spark" className="w-3.5 h-3.5 text-[#b8aa88]" />
            <span>Trusted by 500+ hotels from Sharm El Sheikh to the North Coast</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className={`bg-[#13110e] ${tokens.spacing.section}`}>
      <div className={tokens.spacing.container}>
        <Reveal className="max-w-2xl">
          <span className="inline-block rounded-full border border-[#5a574f]/40 bg-[#1e1c19]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.32em] text-[#b8aa88] mb-4">The Platform</span>
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">What You Get</h2>
          <p className="mt-3 text-[#9a9590]">Four pillars that turn procurement from a cost center into a competitive advantage.</p>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 80}>
              <div className="group rounded-xl border border-[#2a2722] bg-[#16140f] p-6 hover:border-[#3d4a34] hover:-translate-y-0.5 transition-all duration-300 cursor-default">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#3d4a34]/40 text-[#b8aa88]">
                  <Icon name={f.icon} className="w-5 h-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#f0ebe5]">{f.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8a857e]">{f.desc}</p>
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
    <section id="how-it-works" className={`bg-[#0f0d0a] ${tokens.spacing.section}`}>
      <div className={tokens.spacing.container}>
        <Reveal className="max-w-2xl">
          <span className="inline-block rounded-full border border-[#5a574f]/40 bg-[#1e1c19]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.32em] text-[#b8aa88] mb-4">How It Works</span>
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">Live in 24 Hours</h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {steps.map((s, i) => (
            <Reveal key={s.num} delay={i * 80}>
              <div className="rounded-xl border border-[#2a2722] bg-[#16140f] p-6">
                <span className="text-xs font-mono font-bold text-[#b8aa88]">{s.num}</span>
                <h3 className="mt-4 text-base font-semibold text-[#f0ebe5]">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8a857e]">{s.desc}</p>
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
    <section className={`bg-[#13110e] ${tokens.spacing.section}`}>
      <div className="max-w-3xl mx-auto px-5 sm:px-8 text-center">
        <Reveal>
          <span className="inline-block rounded-full border border-[#5a574f]/40 bg-[#1e1c19]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.32em] text-[#b8aa88] mb-4">Get Started</span>
          <h2 className="text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">Ready to Transform Your Procurement?</h2>
          <p className="mt-4 text-[#9a9590]">Join 500+ hotels. No credit card required.</p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/signup" className="inline-flex items-center justify-center min-h-[44px] w-full sm:w-auto px-6 rounded-lg bg-[#b8aa88] text-sm font-semibold uppercase tracking-wider text-[#16140f] hover:bg-[#c9b999] active:scale-[0.97] transition-all cursor-pointer">
              Get Started Free <Icon name="arrow" className="ml-2 w-4 h-4" />
            </Link>
            <Link href="/sandbox" className="inline-flex items-center justify-center min-h-[44px] w-full sm:w-auto px-6 rounded-lg border border-[#5a574f] text-sm font-semibold uppercase tracking-wider text-[#f0ebe5] hover:border-[#8a857e] active:scale-[0.97] transition-all cursor-pointer">
              <Icon name="play" className="mr-2 w-4 h-4" /> Explore Sandbox
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#2a2722] bg-[#0f0d0a] py-8">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-center gap-3">
          <img src="/logo-horse.svg" alt="HotelsVendors" className="h-8 w-8 rounded-lg" />
          <span className="text-sm font-semibold text-[#9a9590]">HotelsVendors</span>
        </div>
        <p className="text-xs text-[#5a5550]">&copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/login" className="text-xs text-[#5a5550] hover:text-[#b8aa88] transition-colors cursor-pointer">Sign In</Link>
          <Link href="/signup" className="text-xs text-[#5a5550] hover:text-[#b8aa88] transition-colors cursor-pointer">Get Started</Link>
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
