"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";

/* ─────────── Data ─────────── */

const heroCarouselSlides = [
  { id: 1, src: "/carousel-hotel-procurement.jpg", title: "Procurement Reimagined", subtitle: "From chaos to controlled supply chain" },
  { id: 2, src: "/carousel-ai-forecasting.jpg", title: "AI-Powered Forecasting", subtitle: "94% accuracy predicting what you need, when you need it" },
  { id: 3, src: "/carousel-supplier-payment.jpg", title: "48-Hour Supplier Payments", subtitle: "Your vendors get paid fast while you keep Net-60 terms" },
];

const features = [
  { icon: "brain", title: "AI Demand Forecasting", description: "Predict inventory needs 14 days ahead with 94% accuracy." },
  { icon: "dollar", title: "Reverse Factoring", description: "Suppliers paid in 48 hours. You keep Net-60 terms." },
  { icon: "file", title: "ETA E-Invoicing", description: "Full Egyptian Tax Authority compliance, zero errors." },
  { icon: "store", title: "Supplier Marketplace", description: "680+ verified vendors across 6 governorates." },
];

const steps = [
  { number: "01", title: "Onboard", description: "Register in 5 minutes. AI maps your suppliers." },
  { number: "02", title: "Forecast", description: "AI predicts demand from occupancy and seasonality." },
  { number: "03", title: "Transact", description: "One-click POs. Automatic matching. Real-time tracking." },
  { number: "04", title: "Settle", description: "Invoices auto-reconcile. Suppliers paid in 48h." },
];

/* ─────────── Icons ─────────── */

type IconName = "arrow" | "brain" | "cart" | "check" | "dashboard" | "dollar" | "file" | "link" | "play" | "store" | "spark";

function Icon({ name, className = "" }: { name: IconName; className?: string }) {
  const p = { className: `h-5 w-5 ${className}`, viewBox: "0 0 24 24" as const, fill: "none" as const, stroke: "currentColor" as const, strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const svg = (children: ReactNode) => <svg {...p} aria-hidden={true}>{children}</svg>;

  switch (name) {
    case "arrow": return svg(<><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>);
    case "brain": return svg(<><path d="M9 5a3 3 0 0 0-5 2.2A3.5 3.5 0 0 0 5.5 14"/><path d="M15 5a3 3 0 0 1 5 2.2A3.5 3.5 0 0 1 18.5 14"/><path d="M9 5v14"/><path d="M15 5v14"/><path d="M9 19a3 3 0 0 1-4.6-2.5"/><path d="M15 19a3 3 0 0 0 4.6-2.5"/><path d="M9 10H7"/><path d="M15 10h2"/><path d="M9 14H7"/><path d="M15 14h2"/></>);
    case "cart": return svg(<><path d="M4 5h2l2 10h9l2-7H7"/><circle cx="10" cy="19" r="1.5"/><circle cx="17" cy="19" r="1.5"/></>);
    case "check": return svg(<><path d="m5 12 4 4L19 6"/></>);
    case "dashboard": return svg(<><path d="M4 13a8 8 0 0 1 16 0"/><path d="M12 13l4-4"/><path d="M6.4 17h11.2"/><path d="M8 21h8"/></>);
    case "dollar": return svg(<><path d="M12 3v18"/><path d="M17 7.5c-.8-1.2-2.4-2-4.2-2H11a3 3 0 0 0 0 6h2a3 3 0 0 1 0 6h-1.8c-1.8 0-3.4-.8-4.2-2"/></>);
    case "file": return svg(<><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v5h5"/><path d="M9 13h6"/><path d="M9 17h4"/></>);
    case "link": return svg(<><path d="M10 13a5 5 0 0 0 7.1 0l1.4-1.4a5 5 0 0 0-7.1-7.1L10.6 5.3"/><path d="M14 11a5 5 0 0 0-7.1 0L5.5 12.4a5 5 0 0 0 7.1 7.1l.8-.8"/></>);
    case "play": return svg(<><path d="m8 5 11 7-11 7z"/></>);
    case "spark": return svg(<><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/></>);
    case "store": return svg(<><path d="M4 10h16l-1-5H5z"/><path d="M6 10v10h12V10"/><path d="M9 20v-6h6v6"/></>);
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

function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const { ref, visible } = useIntersection(0.12);
  return (
    <div ref={ref} className={`reveal ${visible ? "revealed" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
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

/* ─────────── Components ─────────── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 h-16 transition-colors duration-300 ${scrolled ? "bg-[#16140f]/95 backdrop-blur-md" : "bg-transparent"}`}>
      <nav className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-3">
          <img src="/logo-horse.svg" alt="HotelsVendors" className="h-9 w-9 rounded-lg" />
          <span className="text-sm font-semibold tracking-tight text-[#f0ebe5]">HotelsVendors</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#features" className="text-xs font-medium uppercase tracking-[0.18em] text-[#9a9590] transition-colors hover:text-[#f0ebe5]">Features</a>
          <a href="#how-it-works" className="text-xs font-medium uppercase tracking-[0.18em] text-[#9a9590] transition-colors hover:text-[#f0ebe5]">How It Works</a>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="hidden text-xs font-medium text-[#9a9590] transition-colors hover:text-[#f0ebe5] sm:block">Sign In</Link>
          <Link href="/signup" className="rounded-lg bg-[#b8aa88] px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#16140f] transition-transform hover:scale-105">Get Started</Link>
        </div>
      </nav>
    </header>
  );
}

function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setActive((prev) => (prev + 1) % heroCarouselSlides.length), 5000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="relative overflow-hidden rounded-2xl">
      <div className="relative aspect-[16/7] sm:aspect-[21/9] overflow-hidden bg-[#121110]">
        {heroCarouselSlides.map((slide, idx) => (
          <div key={slide.id} className={`absolute inset-0 transition-all duration-700 ${idx === active ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"}`}>
            <img src={slide.src} alt="" className="h-full w-full object-cover" loading={idx === active ? "eager" : "lazy"} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f0d0a] via-[#0f0d0a]/20 to-transparent" />
          </div>
        ))}

        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
          {heroCarouselSlides.map((_, idx) => (
            <button key={idx} onClick={() => setActive(idx)} className={`h-1.5 rounded-full transition-all duration-400 ${idx === active ? "w-8 bg-[#b8aa88]" : "w-2 bg-white/30"}`} aria-label={`Slide ${idx + 1}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0f0d0a] pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="hero-fade mb-6" style={{ animationDelay: "80ms" }}>
          <SectionTag>Series A Opportunity</SectionTag>
        </div>

        <div className="hero-fade max-w-3xl" style={{ animationDelay: "160ms" }}>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-[-0.04em] text-[#f0ebe5] sm:text-5xl lg:text-6xl">
            Turning Hotel<br />Procurement Into a<br />
            <span className="text-[#b8aa88]">Financial Advantage</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#9a9590]">
            AI-powered procurement platform with embedded reverse factoring and ETA e-invoicing.
            Your suppliers are paid in 48 hours — you preserve Net-60.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-[#b8aa88] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#16140f] transition-transform hover:scale-105">
              Get Started <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="/sandbox" className="inline-flex items-center gap-2 rounded-lg border border-[#5a574f] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#f0ebe5] transition-all hover:border-[#8a857e] hover:scale-105">
              <Icon name="play" className="h-4 w-4" /> See Platform
            </Link>
          </div>
        </div>

        <div className="hero-fade mt-14" style={{ animationDelay: "300ms" }}>
          <HeroCarousel />
        </div>

        <div className="hero-fade mt-6 flex items-center gap-3 text-xs text-[#8a857e]" style={{ animationDelay: "400ms" }}>
          <Icon name="spark" className="h-3.5 w-3.5 text-[#b8aa88]" />
          <span>Trusted by 500+ hotels from Sharm El Sheikh to the North Coast</span>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="bg-[#13110e] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <SectionTag>The Platform</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">What You Get</h2>
          <p className="mt-3 text-[#9a9590]">Four pillars that turn procurement from a cost center into a competitive advantage.</p>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {features.map((feat, i) => (
            <Reveal key={feat.title} delay={i * 80}>
              <div className="rounded-xl border border-[#2a2722] bg-[#16140f] p-6 transition-all duration-300 hover:border-[#3d4a34] hover:-translate-y-0.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#3d4a34]/40 text-[#b8aa88]">
                  <Icon name={feat.icon as IconName} className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-base font-semibold text-[#f0ebe5]">{feat.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8a857e]">{feat.description}</p>
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
    <section id="how-it-works" className="bg-[#0f0d0a] py-28">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="max-w-2xl">
          <SectionTag>How It Works</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">Live in 24 Hours</h2>
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={i * 80}>
              <div className="rounded-xl border border-[#2a2722] bg-[#16140f] p-6">
                <span className="text-xs font-mono font-bold text-[#b8aa88]">{step.number}</span>
                <h3 className="mt-4 text-base font-semibold text-[#f0ebe5]">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#8a857e]">{step.description}</p>
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
    <section className="bg-[#13110e] py-28">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <SectionTag>Get Started</SectionTag>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.04em] text-[#f0ebe5] sm:text-4xl">Ready to Transform Your Procurement?</h2>
          <p className="mt-4 text-[#9a9590]">Join 500+ hotels. No credit card required.</p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-lg bg-[#b8aa88] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#16140f] hover:scale-105 transition-transform">
              Get Started Free <Icon name="arrow" className="h-4 w-4" />
            </Link>
            <Link href="/sandbox" className="inline-flex items-center gap-2 rounded-lg border border-[#5a574f] px-6 py-3 text-sm font-semibold uppercase tracking-wider text-[#f0ebe5] hover:border-[#8a857e] hover:scale-105 transition-transform">
              <Icon name="play" className="h-4 w-4" /> Explore Sandbox
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#2a2722] bg-[#0f0d0a] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 sm:flex-row sm:justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo-horse.svg" alt="HotelsVendors" className="h-8 w-8 rounded-lg" />
          <span className="text-sm font-semibold text-[#9a9590]">HotelsVendors</span>
        </div>
        <p className="text-xs text-[#5a5550]">&copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.</p>
        <div className="flex gap-5">
          <Link href="/login" className="text-xs text-[#5a5550] hover:text-[#b8aa88] transition-colors">Sign In</Link>
          <Link href="/signup" className="text-xs text-[#5a5550] hover:text-[#b8aa88] transition-colors">Get Started</Link>
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
