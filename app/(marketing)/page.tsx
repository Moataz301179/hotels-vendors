"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import WorkflowSection from "@/components/sections/Workflow";

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
        className="text-[12px] font-medium transition-colors tracking-wide uppercase flex items-center gap-1"
        style={{ color: "var(--fg-secondary)" }}
      >
        Settings {THEMES.find((t) => t.id === theme)?.icon}
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-3 w-44 rounded-2xl border shadow-xl p-2 z-50"
          style={{ background: "var(--bg-raised)", borderColor: "var(--border-default)" }}>
          <p className="text-[10px] uppercase tracking-wider px-3 py-2" style={{ color: "var(--fg-tertiary)" }}>Theme</p>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => switchTheme(t.id)}
              className={`w-full text-left px-3 py-2 rounded-xl text-[13px] transition-all ${
                theme === t.id
                  ? "font-semibold"
                  : ""
              }`}
              style={theme === t.id
                ? { background: "rgba(163,113,247,0.08)", color: "var(--accent)" }
                : { color: "var(--fg-secondary)" }
              }
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   PARALLAX SCROLL EFFECT
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
   SCROLL REVEAL
   ═══════════════════════════════════════════════════════ */
function ScrollReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} className="scroll-reveal">{children}</div>;
}

/* ═══════════════════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════════════════ */
function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "var(--bg-canvas)" : "transparent",
        backdropFilter: scrolled ? "blur(24px)" : "none",
        borderBottom: scrolled ? "1px solid var(--border-default)" : "1px solid transparent",
      }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-[20px] font-black tracking-tight">
            <span style={{ color: "var(--fg-primary)" }}>Hotels</span>
            <span style={{ color: "var(--accent)" }}>V</span>
            <span style={{ color: "var(--fg-primary)" }}>endors</span>
          </span>
          <span className="text-[9px] tracking-[0.15em] uppercase ml-1 hidden sm:inline"
            style={{ color: "var(--fg-tertiary)" }}>
            B2B PROCUREMENT · EGYPT
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          {["Platform", "For Hotels", "For Suppliers", "Pricing", "ETA Compliance"].map((item) => (
            <a key={item} href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-[11px] font-semibold uppercase tracking-wider transition-colors"
              style={{ color: "var(--fg-secondary)" }}>
              {item}
            </a>
          ))}
          <ThemeSwitcher />
          <Link href="/login"
            className="text-[11px] font-semibold uppercase tracking-wider transition-colors"
            style={{ color: "var(--fg-secondary)" }}>
            Sign In
          </Link>
          <Link href="/register/hotel"
            className="text-[12px] font-bold px-5 py-2.5 rounded-full transition-all hover:-translate-y-0.5 neon-purple-glow"
            style={{ background: "var(--accent)", color: "var(--bg-canvas)" }}>
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

/* ═══════════════════════════════════════════════════════
   SECTION DIVIDER
   ═══════════════════════════════════════════════════════ */
function Divider() {
  return <div style={{ height: 1, background: "var(--border-default)" }} />;
}

/* ═══════════════════════════════════════════════════════
   SECTION 1: HERO — "Control Your Hotel's Supply Chain..."
   ═══════════════════════════════════════════════════════ */
function HeroSection() {
  const { y1, y2, opacity, scale } = useParallax();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" style={{ background: "var(--bg-canvas)" }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] right-[5%] w-[600px] h-[600px] rounded-full opacity-[0.03]" style={{ background: "var(--accent)", filter: "blur(140px)" }} />
        <div className="absolute bottom-[10%] left-[5%] w-[400px] h-[400px] rounded-full opacity-[0.02]" style={{ background: "var(--accent)", filter: "blur(100px)" }} />
      </div>

      <div className="relative z-10 max-w-[1280px] mx-auto px-6 md:px-10 w-full pt-32 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div style={{ y: y1 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8" style={{ border: "1px solid rgba(163,113,247,0.25)", background: "rgba(163,113,247,0.06)" }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
              <span className="text-[11px] font-semibold tracking-wider uppercase" style={{ color: "var(--accent)" }}>NOW LIVE IN EGYPT</span>
            </div>

            <h1 className="text-[44px] sm:text-[56px] lg:text-[68px] font-bold leading-[1.04] tracking-[-0.04em]" style={{ color: "var(--fg-primary)" }}>
              Smart Supply Chain<br />
              <span style={{ color: "var(--fg-secondary)" }}>Execution for</span><br />
              <span style={{ color: "var(--accent)" }}>Egyptian Hospitality</span>
            </h1>

            <p className="mt-8 text-[17px] max-w-[540px] leading-relaxed" style={{ color: "var(--fg-secondary)" }}>
              AI-powered B2B procurement orchestration that replaces WhatsApp chaos with pre-spend control, embedded fintech, and 100% ETA e-invoice compliance. Built exclusively for Egyptian hotels.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link href="/register/hotel"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-semibold rounded-full transition-all hover:-translate-y-0.5"
                style={{ background: "var(--accent)", color: "var(--bg-canvas)", boxShadow: "0 0 40px rgba(163,113,247,0.15)" }}>
                Start Free — No Credit Card
              </Link>
              <a href="#workflow"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-medium rounded-full transition-all"
                style={{ border: "1px solid var(--border-default)", color: "var(--fg-secondary)" }}>
                Watch the Workflow
              </a>
            </div>

            <div className="mt-8">
              <p className="text-[9px] uppercase tracking-[0.2em] mb-4" style={{ color: "var(--fg-tertiary)" }}>TRUSTED BY HOTELS ACROSS EGYPT</p>
              <div className="flex flex-wrap gap-3">
                {["5-STAR", "BOUTIQUE", "RESORT", "BUSINESS"].map((t) => (
                  <span key={t} className="text-[11px] font-semibold tracking-wider px-4 py-1.5 rounded-full" style={{ border: "1px solid var(--border-default)", color: "var(--fg-secondary)" }}>{t}</span>
                ))}
              </div>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
              {[
                { v: "EGP 500M+", l: "Annual GMV" },
                { v: "120+", l: "Hotels" },
                { v: "850+", l: "Verified Suppliers" },
              ].map((s) => (
                <div key={s.l} className="flex items-baseline gap-2">
                  <span className="text-[22px] font-bold" style={{ color: "var(--accent)" }}>{s.v}</span>
                  <span className="text-[10px] uppercase tracking-wider" style={{ color: "var(--fg-tertiary)" }}>{s.l}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div style={{ y: y2, scale }} className="relative hidden lg:block h-[580px]">
            <div className="absolute inset-0 rounded-xl overflow-hidden" style={{ background: "var(--bg-raised)", border: "1px solid var(--border-default)" }}>
              {/* Portal Header */}
              <div className="px-5 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--border-default)", background: "var(--bg-subtle)" }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: "#a371f7" }} />
                  <span className="text-[11px] font-semibold" style={{ color: "var(--fg-primary)" }}>Checkout Portal</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "#a371f71a", color: "#a371f7", border: "1px solid #a371f740" }}>Live</span>
              </div>

              {/* Order Summary */}
              <div className="p-4 border-b" style={{ borderColor: "var(--border-default)" }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-medium" style={{ color: "var(--fg-secondary)" }}>Order Summary</span>
                  <span className="text-[11px] font-bold" style={{ color: "var(--fg-primary)" }}>EGP 47,250</span>
                </div>
                <div className="space-y-2">
                  {[
                    { item: "Fresh Produce — 12 SKUs", price: "EGP 18,500" },
                    { item: "Cleaning Supplies — 8 SKUs", price: "EGP 9,750" },
                    { item: "Linen & Amenities — 15 SKUs", price: "EGP 19,000" },
                  ].map((row) => (
                    <div key={row.item} className="flex items-center justify-between text-[11px]">
                      <span style={{ color: "var(--fg-secondary)" }}>{row.item}</span>
                      <span style={{ color: "var(--fg-primary)" }}>{row.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Methods */}
              <div className="p-4 border-b" style={{ borderColor: "var(--border-default)" }}>
                <span className="text-[11px] font-medium mb-3 block" style={{ color: "var(--fg-secondary)" }}>Payment Method</span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: "Factoring", desc: "Instant settlement", icon: "⚡", active: true },
                    { name: "Credit Line", desc: "EGP 2.4M available", icon: "💳", active: false },
                    { name: "Bank Transfer", desc: "CBE — 24hr", icon: "🏦", active: false },
                    { name: "Wallet", desc: "EGP 125,000", icon: "💰", active: false },
                  ].map((pm) => (
                    <div key={pm.name} className="p-2.5 rounded-lg text-[11px] cursor-pointer transition-all"
                      style={{
                        background: pm.active ? "#a371f71a" : "var(--bg-canvas)",
                        border: pm.active ? "1px solid #a371f7" : "1px solid var(--border-default)",
                      }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span>{pm.icon}</span>
                        <span className="font-semibold" style={{ color: pm.active ? "#a371f7" : "var(--fg-primary)" }}>{pm.name}</span>
                      </div>
                      <span style={{ color: "var(--fg-tertiary)" }}>{pm.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Account Statement */}
              <div className="p-4 border-b" style={{ borderColor: "var(--border-default)" }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-medium" style={{ color: "var(--fg-secondary)" }}>Account Statement</span>
                  <span className="text-[10px]" style={{ color: "var(--fg-tertiary)" }}>This month</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span style={{ color: "var(--fg-secondary)" }}>Total Spend</span>
                      <span style={{ color: "var(--fg-primary)" }}>EGP 312,000</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full" style={{ background: "var(--bg-overlay)" }}>
                      <div className="h-full rounded-full" style={{ width: "68%", background: "#a371f7" }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Cost Savings */}
              <div className="p-4">
                <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: "#a371f70d", border: "1px solid #a371f720" }}>
                  <span className="text-[14px]">📊</span>
                  <div>
                    <div className="text-[11px] font-semibold" style={{ color: "#a371f7" }}>EGP 23,400 saved this quarter</div>
                    <div className="text-[10px]" style={{ color: "var(--fg-tertiary)" }}>AI-optimized ordering reduced waste by 34%</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>