"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════
   THEME SYSTEM — Dark / Light / Premium toggle
   ═══════════════════════════════════════════════════════ */
const THEMES = [
  { id: "dark", label: "Dark", icon: "🌙" },
  { id: "light", label: "Light", icon: "☀️" },
  { id: "premium", label: "Premium", icon: "✨" },
] as const;

function ThemeSwitcher() {
  const [theme, setTheme] = useState("dark");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("hv-theme") || "dark";
    setTheme(saved);
    document.documentElement.setAttribute("data-theme", saved);
  }, []);

  const switchTheme = (t: string) => {
    setTheme(t);
    localStorage.setItem("hv-theme", t);
    document.documentElement.setAttribute("data-theme", t);
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors tracking-wide uppercase flex items-center gap-1"
      >
        Settings {THEMES.find((t) => t.id === theme)?.icon}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-3 w-44 rounded-2xl bg-[var(--bg-surface-2)] border border-[var(--border-visible)] shadow-xl p-2 z-50">
          <p className="text-[10px] text-[var(--text-tertiary)] uppercase tracking-wider px-3 py-2">Theme</p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTheme(t.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-all ${
                theme === t.id
                  ? "bg-[var(--accent)]/15 text-[var(--accent)] font-semibold"
                  : "text-[var(--text-secondary)] hover:bg-[var(--bg-surface-3)]"
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
          <hr className="my-1 border-[var(--border-subtle)]" />
          <button
            onClick={() => {
              const next = theme === "dark" ? "light" : theme === "light" ? "premium" : "dark";
              switchTheme(next);
            }}
            className="w-full text-left px-3 py-2 rounded-xl text-[13px] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-3)] transition-all"
          >
            🔄 Toggle Dark/Light
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PARALLAX SCROLL EFFECT — deep sight
   ═══════════════════════════════════════════════════════ */
function useParallax() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, -80]);
  const y2 = useTransform(scrollY, [0, 1200], [0, -120]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);
  const scale = useTransform(scrollY, [0, 600], [1, 0.92]);
  return { y1, y2, opacity, scale };
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION — with Settings theme tab
   ═══════════════════════════════════════════════════════ */
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "var(--bg-canvas)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-subtle)" : "1px solid transparent",
        opacity: scrolled ? 0.95 : 1,
      }}
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-[18px] font-bold text-[var(--accent)] tracking-tight">🏨</span>
          <span className="text-[14px] font-semibold text-[var(--text-primary)] tracking-tight">HotelsVendors</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {["Platform", "Network", "Trust"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-[12px] font-medium text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors tracking-wide uppercase">
              {item}
            </a>
          ))}
          <ThemeSwitcher />
          <Link href="/login"
            className="text-[12px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
            Sign In
          </Link>
          <Link href="/register/hotel"
            className="text-[12px] font-semibold text-[var(--text-inverse)] px-5 py-2 rounded-full transition-all lime-shadow-strong"
            style={{ background: "var(--accent)" }}>
            Get On Board Now
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════
   HERO — Parallax deep-sight
   ═══════════════════════════════════════════════════════ */
function HeroSection() {
  const { y1, y2, opacity, scale } = useParallax();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "var(--bg-canvas)" }}>
      {/* BG decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "var(--accent)", filter: "blur(120px)" }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-8 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div style={{ y: y1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
              style={{ border: "1px solid var(--border-accent)", background: "var(--accent)08" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
              <span className="text-[11px] font-medium tracking-wide" style={{ color: "var(--accent)" }}>
                Now Onboarding Egyptian Hotels & Suppliers
              </span>
            </div>

            <h1 className="text-[44px] sm:text-[54px] lg:text-[64px] font-bold leading-[1.06] tracking-[-0.03em]" style={{ color: "var(--text-primary)" }}>
              Egypt's procurement,{" "}
              <span style={{ color: "var(--text-tertiary)" }}>reimagined.</span>
            </h1>

            <p className="mt-6 text-[16px] max-w-[500px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              AI-powered procurement orchestration that replaces WhatsApp chaos with pre-spend control, ETA e-invoicing, and embedded financing — built for Egyptian hospitality.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-3">
              <Link href="/register/hotel"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[14px] font-semibold rounded-full transition-all hover:-translate-y-0.5 lime-shadow-strong"
                style={{ background: "var(--accent)", color: "var(--text-inverse)" }}>
                Get On Board Now →
              </Link>
              <Link href="/register/supplier"
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[14px] font-medium rounded-full transition-all hover:-translate-y-0.5"
                style={{ border: "1px solid var(--border-visible)", color: "var(--text-secondary)" }}>
                Watch Demo
              </Link>
            </div>
            <p className="mt-4 text-[11px]" style={{ color: "var(--text-tertiary)" }}>
              Free 14-day trial · No credit card · Cancel anytime
            </p>

            <div className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3">
              {[
                { v: "EGP 25M+", l: "Managed Procurement" },
                { v: "100%", l: "ETA Compliant" },
                { v: "54+", l: "Hotels Connected" },
              ].map((s) => (
                <div key={s.l} className="flex items-baseline gap-2">
                  <span className="text-[20px] font-bold" style={{ color: "var(--accent)" }}>{s.v}</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--text-tertiary)" }}>{s.l}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div style={{ y: y2, scale }} className="relative hidden lg:block h-[500px]">
            <div className="absolute inset-4 rounded-2xl overflow-hidden framed-card" style={{ background: "var(--bg-surface-2)" }}>
              <img src="/intelligence-v2.jpg" alt="Dashboard" className="w-full h-full object-cover opacity-70" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to top, var(--bg-canvas), transparent)` }} />
              <div className="absolute top-6 left-6">
                <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Platform</div>
                <div className="text-[15px] mt-1 font-medium" style={{ color: "var(--text-primary)" }}>AI Procurement Hub</div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-8 w-[260px] rounded-xl overflow-hidden lime-shadow" style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-visible)" }}>
              <img src="/compliance-v2.jpg" alt="Compliance" className="w-full h-auto opacity-75" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FEATURE CARDS — Grey/white with lime shadows
   ═══════════════════════════════════════════════════════ */
function FeatureCards() {
  const features = [
    {
      title: "AI Pre-Spend Control",
      desc: "Multi-agent swarm analyzes spend patterns, detects anomalies, and flags savings before you approve a single PO.",
      icon: "⚡",
    },
    {
      title: "ETA E-Invoicing",
      desc: "Automated real-time submission to Egyptian Tax Authority. Zero manual filing. Full compliance from day one.",
      icon: "📋",
    },
    {
      title: "Embedded Financing",
      desc: "Licensed Egyptian fintech integration for factoring, credit lines, and payment orchestration — all in one workflow.",
      icon: "💰",
    },
    {
      title: "Verified Network",
      desc: "Pre-qualified suppliers across Egypt — Cairo, Red Sea, North Coast. Every supplier verified for EGS compliance.",
      icon: "🌐",
    },
  ];

  return (
    <section className="py-32" style={{ background: "var(--bg-canvas)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] block mb-4" style={{ color: "var(--accent)" }}>Platform</span>
          <h2 className="text-[34px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.1]" style={{ color: "var(--text-primary)" }}>
            Everything you need.{" "}
            <span style={{ color: "var(--text-tertiary)" }}>One platform.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f, i) => (
            <div key={f.title}
              className="group framed-card p-8 transition-all duration-500 hover:lime-shadow"
              style={{ background: "var(--bg-surface-2)" }}>
              <div className="text-[28px] mb-4">{f.icon}</div>
              <h3 className="text-[20px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>{f.title}</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{f.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-[13px] font-semibold" style={{ color: "var(--accent)" }}>
                Learn more <span>→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   PROBLEM CARDS — White cards with black text
   ═══════════════════════════════════════════════════════ */
function ProblemSection() {
  const cards = [
    { stat: "EGP 3M", label: "Annual Leakage", title: "No Pre-Spend Visibility", desc: "WhatsApp orders and phone calls mean no audit trail. Price discrepancies and unauthorized spend slip through — discovered at month-end, when it's too late." },
    { stat: "48 hrs", label: "Invoice Delay", title: "ETA Compliance Risk", desc: "Mandatory e-invoicing requires real-time submission. Manual processes create backlogs, penalties, and audit exposure." },
    { stat: "60-90", label: "Day Payment Gap", title: "Working Capital Crunch", desc: "Suppliers demand 15-30 day payment. Hotels operate on 60-90 day cycles. The gap forces expensive borrowing." },
  ];

  return (
    <section className="py-32" style={{ background: "var(--bg-surface-1)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="text-center mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] block mb-4" style={{ color: "var(--accent)" }}>Why HotelsVendors</span>
          <h2 className="text-[34px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.1]" style={{ color: "var(--text-primary)" }}>
            Your team deserves better than{" "}
            <span style={{ color: "var(--text-tertiary)" }}>WhatsApp.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map((c) => (
            <div key={c.title}
              className="p-8 rounded-2xl card-shadow transition-all duration-300 hover:lime-shadow"
              style={{ background: "var(--bg-surface-2)" }}>
              <div className="text-[48px] font-black leading-none mb-2" style={{ color: "var(--accent)", opacity: 0.12 }}>{c.stat}</div>
              <div className="text-[10px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--accent)", opacity: 0.7 }}>{c.label}</div>
              <h3 className="text-[17px] font-bold mb-2" style={{ color: "var(--text-primary)" }}>{c.title}</h3>
              <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   NETWORK — Egypt map (keep this image)
   ═══════════════════════════════════════════════════════ */
function NetworkSection() {
  const cities = [
    { name: "Cairo & Giza", hotels: "28+", region: "Capital Corridor" },
    { name: "Hurghada", hotels: "12+", region: "Red Sea" },
    { name: "Sharm El-Sheikh", hotels: "8+", region: "South Sinai" },
    { name: "Alexandria", hotels: "6+", region: "North Coast" },
  ];

  return (
    <section id="network" className="py-32" style={{ background: "var(--bg-canvas)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] block mb-4" style={{ color: "var(--accent)" }}>Network</span>
            <h2 className="text-[34px] md:text-[42px] font-bold tracking-[-0.03em] leading-[1.1]" style={{ color: "var(--text-primary)" }}>
              Nationwide coverage.{" "}
              <span style={{ color: "var(--text-tertiary)" }}>Deep categories.</span>
            </h2>
            <p className="mt-4 text-[15px] max-w-[450px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
              Active across Egypt's key hospitality corridors with verified suppliers in F&B, housekeeping, linens, pool chemicals, and maintenance.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3">
              {cities.map((c) => (
                <div key={c.name}
                  className="p-4 rounded-xl transition-all hover:lime-shadow"
                  style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-[14px] font-semibold" style={{ color: "var(--text-primary)" }}>{c.name}</span>
                    <span className="text-[15px] font-bold" style={{ color: "var(--accent)" }}>{c.hotels}</span>
                  </div>
                  <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>{c.region}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden framed-card">
            <img src="/hero-hotel-drone.jpg" alt="Egypt hospitality coverage map" className="w-full aspect-[4/3] object-cover opacity-60" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, var(--bg-canvas) 0%, transparent 60%)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   TRUST BADGES
   ═══════════════════════════════════════════════════════ */
function TrustSection() {
  const badges = [
    { title: "ETA Compliant", desc: "Full Egyptian Tax Authority e-invoicing integration with automated real-time submission." },
    { title: "Pre-Spend Gatekeeper", desc: "AI-powered cost analysis before money is committed. Flag anomalies, enforce budgets." },
    { title: "Fintech Licensed", desc: "Integrated with licensed Egyptian financial institutions for payments and factoring." },
    { title: "AI Swarm 24/7", desc: "Multi-agent system continuously analyzing spend, compliance, and procurement." },
    { title: "RBAC Security", desc: "Granular role-based access. Each stakeholder sees only what they need." },
    { title: "Full Audit Trail", desc: "Every transaction, approval, and modification logged immutably." },
  ];

  return (
    <section id="trust" className="py-32" style={{ background: "var(--bg-surface-1)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="mb-16">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] block mb-4" style={{ color: "var(--accent)" }}>Trust</span>
          <h2 className="text-[34px] md:text-[44px] font-bold tracking-[-0.03em] leading-[1.1]" style={{ color: "var(--text-primary)" }}>
            Enterprise-grade trust.{" "}
            <span style={{ color: "var(--text-tertiary)" }}>Banking standard.</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((b) => (
            <div key={b.title}
              className="p-6 rounded-2xl transition-all hover:lime-shadow"
              style={{ background: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: "var(--accent)15" }}>
                <span style={{ color: "var(--accent)" }}>✓</span>
              </div>
              <h4 className="text-[15px] font-bold mb-1" style={{ color: "var(--text-primary)" }}>{b.title}</h4>
              <p className="text-[12px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   CTA SECTION
   ═══════════════════════════════════════════════════════ */
function CTASection() {
  return (
    <section className="py-32 relative overflow-hidden" style={{ background: "var(--bg-canvas)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{ background: "var(--accent)", filter: "blur(150px)" }} />
      </div>
      <div className="relative z-10 max-w-[680px] mx-auto px-6 text-center">
        <h2 className="text-[36px] md:text-[48px] font-bold tracking-[-0.03em] leading-[1.08]" style={{ color: "var(--text-primary)" }}>
          Ready to stop the{" "}
          <span style={{ color: "var(--accent)" }}>procurement chaos</span>?
        </h2>
        <p className="mt-5 text-[16px] leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Join Egypt's first AI-powered procurement platform. 14-day free trial. No credit card. Cancel anytime.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register/hotel"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[14px] font-semibold rounded-full transition-all hover:-translate-y-0.5 lime-shadow-strong"
            style={{ background: "var(--accent)", color: "var(--text-inverse)" }}>
            Get On Board Now →
          </Link>
          <Link href="/register/supplier"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[14px] font-medium rounded-full transition-all"
            style={{ border: "1px solid var(--border-visible)", color: "var(--text-secondary)" }}>
            Join as Supplier
          </Link>
        </div>
        <p className="mt-5 text-[12px]" style={{ color: "var(--text-tertiary)" }}>
          14-day free trial · No credit card · Cancel anytime · ETA-compliant
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════
   FOOTER — Regular white text (not muted)
   ═══════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="py-16" style={{ background: "var(--bg-canvas)", borderTop: "1px solid var(--border-subtle)" }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[18px]">🏨</span>
              <span className="text-[14px] font-bold" style={{ color: "var(--accent)" }}>HotelsVendors</span>
            </div>
            <p className="text-[12px] leading-relaxed mb-3" style={{ color: "var(--text-secondary)" }}>
              AI-powered procurement orchestration for Egyptian hospitality. ETA-compliant, fintech-enabled.
            </p>
            <span className="text-[11px]" style={{ color: "var(--text-tertiary)" }}>Cairo, Egypt</span>
          </div>
          {[
            { title: "Product", links: ["Platform", "Solutions", "Network", "Trust", "Pricing"] },
            { title: "Teams", links: ["Hotels", "Suppliers", "Factoring", "Logistics"] },
            { title: "Resources", links: ["Documentation", "API", "Blog", "Help Center"] },
            { title: "Legal", links: ["Privacy", "Terms", "Security", "Compliance"] },
          ].map((col) => (
            <div key={col.title}>
              <h5 className="text-[10px] font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-primary)", opacity: 0.6 }}>
                {col.title}
              </h5>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-[12px] transition-colors hover:underline"
                      style={{ color: "var(--text-primary)", opacity: 0.85 }}>{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3"
          style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <span className="text-[11px]" style={{ color: "var(--text-primary)", opacity: 0.7 }}>
            © {new Date().getFullYear()} HotelsVendors. All rights reserved.
          </span>
          <div className="flex items-center gap-5">
            <span className="text-[10px]" style={{ color: "var(--text-primary)", opacity: 0.5 }}>ETA Compliant</span>
            <span className="text-[10px]" style={{ color: "var(--text-primary)", opacity: 0.5 }}>ISO 27001 (in progress)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════════════
   SCROLL REVEAL OBSERVER
   ═══════════════════════════════════════════════════════ */
function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="scroll-reveal">{children}</div>;
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════ */
export default function LandingPage() {
  return (
    <main className="min-h-screen" style={{ background: "var(--bg-canvas)", fontFamily: "var(--font-inter), system-ui, -apple-system, sans-serif" }}>
      <LandingNav />
      <HeroSection />
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--border-visible), transparent)" }} />
      <ScrollReveal><FeatureCards /></ScrollReveal>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--border-visible), transparent)" }} />
      <ScrollReveal><ProblemSection /></ScrollReveal>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--border-visible), transparent)" }} />
      <ScrollReveal><NetworkSection /></ScrollReveal>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--border-visible), transparent)" }} />
      <ScrollReveal><TrustSection /></ScrollReveal>
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--border-visible), transparent)" }} />
      <ScrollReveal><CTASection /></ScrollReveal>
      <Footer />
    </main>
  );
}