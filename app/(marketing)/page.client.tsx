"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HotelSuppliesCarousel } from "@/components/marketing/hotel-supplies-carousel";
import { useTranslation } from "@/lib/i18n/hooks/use-translation";
import { useLanguage } from "@/lib/i18n/language-context";
import {
  FileText, CheckCircle2, Truck, CreditCard, ChevronRight, ChevronLeft,
  ShoppingCart, Package, MapPin, Building2, Search, Smartphone, Monitor,
  ArrowRight, Shield, Zap, BarChart3, Landmark, Bot, TrendingUp,
} from "lucide-react";

/* ── Count-Up Animation ── */
function useCountUp(end: number, duration = 1600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - start) / duration, 1);
          setValue(Math.round((1 - Math.pow(1 - p, 3)) * end));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.4 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return { value, ref };
}

function StatCounter({ end, suffix, label }: { end: number; suffix?: string; label: string }) {
  const { value, ref } = useCountUp(end);
  return (
    <div className="text-center" ref={ref}>
      <div className="text-2xl md:text-3xl font-bold text-foreground">{value}{suffix || "+"}</div>
      <div className="text-[11px] md:text-xs text-foreground-secondary mt-1 font-medium">{label}</div>
    </div>
  );
}

/* ── Main Page ── */
export default function MarketingPage() {
  const { t } = useTranslation("homepage");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <main id="main-content">
      {/* ═══════════ HERO — Dual Layer Architecture ═══════════ */}
      <section className="pt-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* LEFT */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wider uppercase mb-6 border animate-fade-in"
                style={{ borderColor: "var(--border-accent)", background: "var(--accent-muted)", color: "var(--accent-base)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-accent-base animate-pulse" />
                Egypt & MENA — AI-Native B2B Hotel Procurement
              </div>

              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight mb-4 animate-fade-in-up">
                Two Layers.<br />
                <span className="text-foreground">One Platform</span>
                <span className="text-foreground">.</span>
              </h1>

              <p className="text-base md:text-lg max-w-xl leading-relaxed animate-fade-in-up animation-delay-100"
                style={{ color: "rgba(var(--hero-text-rgb), 0.8)" }}>
                <strong style={{ color: "var(--accent-base)" }}>HotelsVendors Web</strong> — buyer control panel for hotels.
                RFQ-driven procurement, authority matrix approvals, embedded factoring, ETA compliance.
                <br /><br />
                <strong style={{ color: "var(--orange-base)" }}>INVO Mobile</strong> — supplier marketplace app.
                Scan-to-request, real-time inventory, housekeeping workflow, instant factoring.
              </p>

              <a href="/register"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold rounded-lg bg-accent-base text-surface hover:bg-accent-light transition-colors animate-fade-in-up animation-delay-150">
                Start Free <ArrowRight size={18} />
              </a>

              <div className="flex flex-wrap gap-3 mt-4 animate-fade-in-up animation-delay-200">
                <span className="px-3 py-1 rounded-full border text-xs font-medium"
                  style={{ borderColor: "var(--border-accent)", color: "var(--accent-base)", background: "var(--accent-muted)" }}>ETA</span>
                <span className="px-3 py-1 rounded-full border text-xs font-medium"
                  style={{ borderColor: "var(--orange-muted)", color: "var(--orange-base)", background: "var(--orange-muted)" }}>FRA</span>
                <span className="px-3 py-1 rounded-full border text-xs font-medium"
                  style={{ borderColor: "var(--purple-muted)", color: "var(--purple-base)", background: "var(--purple-muted)" }}>ISO 27001</span>
                <span className="px-3 py-1 rounded-full border text-xs font-medium"
                  style={{ borderColor: "var(--border-accent)", color: "var(--accent-base)", background: "var(--accent-muted)" }}>Free to Start</span>
              </div>

              {/* Live metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 max-w-3xl pt-8 border-t border-white/5 animate-fade-in-up animation-delay-300">
                <StatCounter end={1247} label="Hotels Onboarded" />
                <StatCounter end={3892} label="Verified Suppliers" />
                <StatCounter end={847} suffix="M" label="EGP GMV" />
                <StatCounter end={48} suffix="h" label="Avg. Delivery" />
              </div>

              {/* Partner strip */}
              <div className="flex items-center gap-4 pt-4 animate-fade-in-up animation-delay-400">
                <span className="text-[10px] text-foreground-muted tracking-wider uppercase">Factoring Partner</span>
                <img src="/oliv-logo-white.png" alt="Oliv Finance" className="h-5 w-auto opacity-70 hover:opacity-100 transition-opacity" />
                <span className="text-[10px] text-foreground-muted">·</span>
                <span className="text-[10px] text-foreground-muted tracking-wider uppercase">Payments via</span>
                <span className="text-[10px] text-white/50 font-medium">Paymob</span>
                <span className="text-[10px] text-white/50 font-medium">InstaPay</span>
                <span className="text-[10px] text-white/50 font-medium">Fawry</span>
              </div>
            </div>

            {/* RIGHT — Dual Layer Visual */}
            <div className="animate-fade-in-up animation-delay-200 space-y-4">
              {/* Web Dashboard Card */}
              <div className="rounded-2xl border overflow-hidden bg-surface-1"
                style={{ borderColor: "var(--accent-base)33", boxShadow: "0 0 40px 2px var(--accent-glow)" }}>
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-subtle">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-base)" }} />
                  <span className="flex-1 text-center text-[10px] text-foreground-muted font-mono">
                    <Monitor size={12} className="inline mr-1" /> HotelsVendors Web — Buyer Control
                  </span>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Active Orders", val: "34", sub: "+8%", color: "var(--accent-base)" },
                      { label: "Monthly Spend", val: "EGP 182K", sub: "Forecast EGP 168K", color: "var(--orange-base)" },
                      { label: "Vendor Network", val: "47", sub: "via INVO", color: "var(--purple-base)" },
                      { label: "Factoring", val: "6", sub: "2 pending 48h", color: "var(--accent-base)" },
                    ].map((c) => (
                      <div key={c.label} className="rounded-lg border bg-canvas/60 p-3" style={{ borderColor: `${c.color}22` }}>
                        <div className="text-[10px] text-foreground-muted">{c.label}</div>
                        <div className="text-base font-semibold text-foreground mt-0.5">{c.val}</div>
                        <div className="text-[10px] mt-0.5" style={{ color: c.color }}>{c.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* INVO Mobile App Card */}
              <div className="rounded-2xl border overflow-hidden bg-surface-1 flex"
                style={{ borderColor: "var(--orange-base)33" }}>
                <div className="flex-1 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Smartphone size={16} style={{ color: "var(--orange-base)" }} />
                    <span className="text-xs font-semibold" style={{ color: "var(--orange-base)" }}>INVO Mobile</span>
                    <span className="text-[10px] text-foreground-muted ml-auto">Supplier App</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "Scan Invoice", icon: "📸" },
                      { label: "Housekeeping", icon: "🧹" },
                      { label: "Marketplace", icon: "🏪" },
                      { label: "Factoring", icon: "💳" },
                    ].map((f) => (
                      <div key={f.label} className="rounded-lg border border-white/5 bg-canvas/60 p-2 flex items-center gap-2">
                        <span className="text-sm">{f.icon}</span>
                        <span className="text-[11px] text-foreground-secondary">{f.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* QR to Oliv */}
                <div className="w-28 p-3 flex flex-col items-center justify-center border-l border-white/5">
                  <img src="https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=https%3A%2F%2Fwww.hotelsvendors.com%2Foliv%2Freferral"
                    alt="Scan for Oliv" className="w-20 h-20 rounded" />
                  <span className="text-[8px] text-foreground-muted mt-1 text-center">Scan · CHV000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <HotelSuppliesCarousel />
      </section>

      {/* ═══════════ HOW THE DUAL LAYER WORKS ═══════════ */}
      <section className="py-20 border-y border-border-invisible">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 animate-on-scroll">
            <span className="text-xs tracking-widest uppercase" style={{ color: "var(--accent-base)" }}>Architecture</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-3 text-foreground">
              Web Controls · Mobile Executes
            </h2>
            <p className="text-foreground-secondary text-base max-w-xl mx-auto">
              Hotels manage procurement from the desktop. Suppliers fulfill from their phone. One real-time data layer connects them.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Layer 1 */}
            <div className="neon-card rounded-2xl border bg-surface-1 p-6 text-center" style={{ borderColor: "var(--accent-base)33" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--accent-base)15", border: "1px solid var(--accent-base)40" }}>
                <Monitor size={24} style={{ color: "var(--accent-base)" }} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">HotelsVendors Web</h3>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                Hotel procurement managers create RFQs, approve orders via authority matrix, track spend, and manage ETA compliance — all from the desktop dashboard.
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                {["RFQ Engine", "Authority Matrix", "ETA Compliance", "Spend Analytics"].map((b) => (
                  <span key={b} className="text-[10px] px-2 py-0.5 rounded-full border"
                    style={{ borderColor: "var(--accent-base)33", color: "var(--accent-base)" }}>{b}</span>
                ))}
              </div>
            </div>

            {/* Connection */}
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-dashed"
                style={{ borderColor: "var(--purple-base)40", background: "var(--purple-base)10" }}>
                <Zap size={24} style={{ color: "var(--purple-base)" }} />
              </div>
              <div className="text-xs text-center text-foreground-secondary leading-relaxed">
                <strong style={{ color: "var(--purple-base)" }}>Real-Time Sync</strong><br />
                Orders, inventory, invoices, and factoring status flow instantly between web and mobile via shared API + Redis.
              </div>
            </div>

            {/* Layer 2 */}
            <div className="neon-card rounded-2xl border bg-surface-1 p-6 text-center" style={{ borderColor: "var(--orange-base)33" }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: "var(--orange-base)15", border: "1px solid var(--orange-base)40" }}>
                <Smartphone size={24} style={{ color: "var(--orange-base)" }} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">INVO Mobile</h3>
              <p className="text-sm text-foreground-secondary leading-relaxed">
                Suppliers scan invoices, manage inventory, fulfill orders, and access factoring — all from their phone. No training required.
              </p>
              <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                {["Scan-to-Request", "GRN Capture", "Oliv Factoring", "Push Notifications"].map((b) => (
                  <span key={b} className="text-[10px] px-2 py-0.5 rounded-full border"
                    style={{ borderColor: "var(--orange-base)33", color: "var(--orange-base)" }}>{b}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ SANDBOX DEMO ═══════════ */}
      <SandboxDemo t={t} />

      {/* ═══════════ PROCUREMENT CATEGORIES ═══════════ */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-on-scroll">
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--orange-base)" }}>Every Category. One Platform.</span>
          <h2 className="text-3xl md:text-4xl mt-3 mb-3 text-foreground font-semibold">Source Everything Your Hotel Needs</h2>
          <p className="text-foreground-secondary text-base max-w-xl mx-auto">From premium linens to commercial kitchen equipment — source everything through verified suppliers on INVO.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {[
            { name: "Premium Linens", price: "From EGP 450", color: "var(--accent-base)" },
            { name: "Bathroom Amenities", price: "From EGP 35/set", color: "var(--orange-base)" },
            { name: "Kitchen Equipment", price: "From EGP 2,100", color: "var(--purple-base)" },
            { name: "Cleaning Supplies", price: "From EGP 80/L", color: "var(--accent-base)" },
            { name: "Guest Room Furniture", price: "From EGP 3,500", color: "var(--orange-base)" },
            { name: "HVAC & Engineering", price: "From EGP 15,000", color: "var(--purple-base)" },
            { name: "Hotel Bedding", price: "From EGP 1,200", color: "var(--accent-base)" },
            { name: "Pool & Spa Supplies", price: "From EGP 550", color: "var(--orange-base)" },
          ].map((c) => (
            <div key={c.name} className="animate-on-scroll group">
              <div className="rounded-xl border overflow-hidden bg-surface-1 transition-all duration-300 hover:scale-[1.02]" style={{ borderColor: `${c.color}22` }}>
                <div className="h-36 flex items-center justify-center" style={{ background: `${c.color}15`, border: `1px dashed ${c.color}33` }}>
                  <div className="text-center"><div className="text-sm font-semibold" style={{ color: c.color }}>{c.name}</div></div>
                </div>
                <div className="px-4 py-3">
                  <div className="text-sm font-semibold text-foreground mb-0.5">{c.name}</div>
                  <div className="text-xs" style={{ color: `${c.color}cc` }}>{c.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ HOW IT WORKS ═══════════ */}
      <section className="py-20 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-on-scroll">
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--accent-base)" }}>How It Works</span>
          <h2 className="text-3xl md:text-4xl mt-3 mb-3 text-foreground font-semibold">Start Free. Transact Smart.</h2>
          <p className="text-foreground-secondary text-base max-w-2xl mx-auto">No subscription. No setup cost. AI agents guide you from registration to your first compliant transaction.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-5 stagger-children">
          {[
            { step: "01", title: "Hotels Join Free", desc: "Register your property group. AI agents guide you through ETA-compliant onboarding in minutes.", color: "var(--accent-base)" },
            { step: "02", title: "Discover on INVO", desc: "Browse INVO — our vendor marketplace. Compare, order, and track everything from one dashboard.", color: "var(--orange-base)" },
            { step: "03", title: "Suppliers Fulfill via Mobile", desc: "Orders appear instantly on INVO Mobile. Suppliers scan, pack, and deliver — all from their phone.", color: "var(--purple-base)" },
            { step: "04", title: "Finance & Get Paid Fast", desc: "Need working capital? Factor invoices via Oliv. Hotel pays later. Supplier gets paid in 48h.", color: "var(--accent-base)" },
          ].map((s) => (
            <div key={s.step} className="animate-on-scroll">
              <div className="neon-card relative rounded-2xl border bg-surface-1 p-5 h-full flex flex-col" style={{ borderColor: `${s.color}33` }}>
                <div className="text-3xl mb-3 opacity-15 font-semibold" style={{ color: s.color }}>{s.step}</div>
                <div className="text-sm mb-2 font-medium" style={{ color: s.color }}>{s.title}</div>
                <p className="text-foreground-secondary text-xs leading-relaxed flex-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ AI SWARM AGENTS ═══════════ */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center mb-14 animate-on-scroll">
          <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--orange-base)" }}>AI-Powered</span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-foreground">Swarm Agents Handle the Complexity</h2>
          <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">You focus on hospitality. Our AI swarm handles compliance, documentation, vendor matching, spend forecasting, and factoring — automatically.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5 stagger-children">
          {[
            { icon: Bot, title: "Onboarding Agent", desc: "Guides hotels and vendors through ETA registration and document collection — conversationally.", color: "var(--accent-base)" },
            { icon: TrendingUp, title: "Spend Forecast Agent", desc: "Analyses historical orders to predict future costs and flag budget overruns before they happen.", color: "var(--purple-base)" },
            { icon: Shield, title: "Compliance Swarm", desc: "Specialised agents audit every transaction against ETA and FRA standards, generating required documentation.", color: "var(--orange-base)" },
            { icon: Landmark, title: "Factoring Agent", desc: "Orchestrates reverse factoring end-to-end — request, approval, FRA validation, and 48h disbursement.", color: "var(--accent-base)" },
            { icon: Bot, title: "AI Procurement Chatbot", desc: "Hotels describe needs in plain language. Chatbot searches INVO, compares vendors, generates ready-to-approve orders.", color: "var(--purple-base)" },
            { icon: Zap, title: "Integration Agent", desc: "Connects to external marketplace APIs automatically, mapping catalogs into INVO's unified structure.", color: "var(--orange-base)" },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.title} className="animate-on-scroll">
                <div className="neon-card rounded-2xl border bg-surface-1 p-5 h-full" style={{ borderColor: `${a.color}33` }}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 border" style={{ background: `${a.color}15`, borderColor: `${a.color}40`, color: a.color }}>
                    <Icon size={20} />
                  </div>
                  <div className="font-semibold text-sm mb-2 text-foreground">{a.title}</div>
                  <p className="text-foreground-secondary text-xs leading-relaxed">{a.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════ REVERSE FACTORING ═══════════ */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-on-scroll">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--orange-base)" }}>Reverse Factoring</span>
            <h2 className="text-4xl font-extrabold mt-3 mb-4 text-foreground">Suppliers Paid in 48 Hours. No Wait.</h2>
            <p className="text-foreground-secondary text-lg leading-relaxed mb-8">
              Traditional 60–90 day payment terms kill supplier cash flow. Our embedded factoring, powered by AI agents and FRA-validated, lets vendors redeem money in 48 hours — while hotels keep standard payment schedules.
            </p>
            <div className="flex flex-col gap-3 mb-8">
              {[
                "Supplier submits factoring request via INVO Mobile",
                "Swarm agents verify invoice & order",
                "Hotel approves digitally via portal",
                "FRA compliance check automated",
                "Funds disbursed in 48 hours",
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3" dir="ltr">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center border shrink-0 text-xs font-semibold"
                    style={{ borderColor: `var(--accent-base)55`, color: "var(--accent-base)", background: "var(--accent-base)10" }}>
                    <CheckCircle2 size={16} />
                  </div>
                  <div className="text-sm text-foreground">{step}</div>
                </div>
              ))}
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: "var(--orange-base)" }}>
              1.5–3% fee only on factoring — no hidden charges
            </div>
          </div>

          {/* Factoring example card */}
          <div className="animate-on-scroll">
            <div className="neon-card rounded-2xl border bg-surface-1 p-5" style={{ borderColor: "var(--orange-base)33" }}>
              <div className="flex items-center justify-between mb-4">
                <div><div className="text-xs text-foreground-secondary mb-1">Factoring Request #F-2847</div><div className="font-semibold text-foreground">Luxe Linen Co.</div></div>
                <span className="text-xs px-3 py-1 rounded-full font-semibold" style={{ background: "var(--accent-muted)", color: "var(--accent-base)" }}>Active</span>
              </div>
              <div className="grid grid-cols-3 gap-3 mb-4 text-center">
                <div className="rounded-lg p-2 bg-canvas/60"><div className="text-xl font-semibold" style={{ color: "var(--orange-base)" }}>EGP 14.4K</div><div className="text-xs text-foreground-secondary">Invoice</div></div>
                <div className="rounded-lg p-2 bg-canvas/60"><div className="text-xl font-semibold" style={{ color: "var(--accent-base)" }}>$13.9K</div><div className="text-xs text-foreground-secondary">Disbursed</div></div>
                <div className="rounded-lg p-2 bg-canvas/60"><div className="text-xl font-semibold" style={{ color: "var(--purple-base)" }}>38h</div><div className="text-xs text-foreground-secondary">Time to Pay</div></div>
              </div>
              <div className="flex flex-col gap-1.5">
                {["Invoice verified by compliance agent", "Hotel approval received", "FRA validation complete", "Funds disbursed"].map((s) => (
                  <div key={s} className="flex items-center gap-2 text-xs text-foreground" dir="ltr">
                    <CheckCircle2 size={14} style={{ color: "var(--accent-base)" }} />
                    {s}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ PRICING ═══════════ */}
      <section className="py-24 border-y border-border-invisible">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14 animate-on-scroll">
            <span className="text-xs tracking-widest uppercase" style={{ color: "var(--accent-base)" }}>Transparent Pricing</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-foreground">Pay Only When You Transact</h2>
            <p className="text-foreground-secondary text-lg">No subscriptions. No lock-in. We grow only when you grow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 stagger-children">
            {[
              { badge: "Hotels & Vendors", title: "Platform Access", price: "Free", period: "Forever", features: ["Full HotelsVendors dashboard", "INVO marketplace access", "AI chatbot & agents", "ETA-compliant invoicing", "Unlimited users & properties"], color: "var(--accent-base)", cta: "Get Started" },
              { badge: "All payment types", title: "Bank Transfer", price: "1%", period: "per transaction", features: ["Multi-currency support", "SWIFT & local bank rails", "Instant confirmation", "Auto-generated receipts", "Full audit trail"], color: "var(--orange-base)", cta: "Get Started", popular: true },
              { badge: "Reverse factoring", title: "Factoring Service", price: "1.5–3%", period: "of invoice value", features: ["48-hour supplier payout", "AI-driven authorisation", "FRA-compliant process", "Zero paperwork", "Joker option — use anytime"], color: "var(--purple-base)", cta: "Get Started" },
            ].map((p) => (
              <div key={p.title} className="animate-on-scroll">
                <div className="neon-card rounded-2xl border bg-surface-1 p-5 flex flex-col h-full relative" style={{ borderColor: `${p.color}33` }}>
                  {p.popular && (
                    <div className="absolute -top-3 left-1/2 px-4 py-1 rounded-full text-xs font-semibold"
                      style={{ background: p.color, color: "var(--bg-canvas)", transform: "translateX(-50%)" }}>Most Used</div>
                  )}
                  <div className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: p.color }}>{p.badge}</div>
                  <div className="text-2xl font-semibold mb-1 text-foreground">{p.title}</div>
                  <div className="flex items-end gap-1 mb-6">
                    <span className="text-4xl font-extrabold text-foreground">{p.price}</span>
                    <span className="text-foreground-secondary pb-1 text-sm">{p.period}</span>
                  </div>
                  <ul className="flex flex-col gap-2.5 flex-1 mb-7">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-foreground" dir="ltr">
                        <CheckCircle2 size={16} style={{ color: p.color }} />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/register" className="w-full font-semibold cursor-pointer rounded-lg text-sm py-2.5 text-center block"
                    style={{ background: p.color, color: "var(--bg-canvas)" }}>{p.cta}</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ OLIV REFERRAL QR ═══════════ */}
      <section className="py-20 border-y border-border-invisible">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--success)" }}>Partner Financing</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-foreground">Get Instant Cash Flow via Oliv</h2>
          <p className="text-foreground-secondary mb-8">Scan the QR code or tap below. Your referral code CHV000 is included automatically. Get paid in 48 hours.</p>
          <div className="flex flex-col items-center gap-6">
            <div className="w-48 h-48 rounded-xl overflow-hidden bg-white p-2 border-2" style={{ borderColor: "var(--success)40" }}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fwww.hotelsvendors.com%2Foliv%2Freferral"
                alt="Scan for Oliv" className="w-full h-full" />
            </div>
            <div className="flex gap-3">
              <a href="/api/v1/oliv/click" className="px-6 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors hover:opacity-90"
                style={{ background: "var(--success)" }}>Apply via Oliv</a>
              <Link href="/financing/oliv" className="px-6 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-white/5"
                style={{ borderColor: "var(--success)40", color: "var(--success)" }}>Learn More</Link>
            </div>
            <p className="text-[10px] text-foreground-muted font-mono">Code CHV000 · FRA Licensed · 48h Funding</p>
          </div>
        </div>
      </section>

      {/* ═══════════ COMPLIANCE ═══════════ */}
      <section className="py-24 border-y border-border-invisible">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14 animate-on-scroll">
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "var(--purple-base)" }}>Security & Compliance</span>
            <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4 text-foreground">Built for Egypt's Regulated Market</h2>
            <p className="text-foreground-secondary text-lg max-w-2xl mx-auto">Every transaction, invoice, and factoring request is automatically audited against ETA and FRA standards.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mb-12 stagger-children">
            {["ETA", "FRA", "ISO 27001", "PCI-DSS", "AML/KYC", "GDPR"].map((b) => (
              <div key={b} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm animate-on-scroll"
                style={{ borderColor: "var(--accent-base)55", color: "var(--accent-base)", background: "var(--accent-base)10" }}>
                <CheckCircle2 size={16} />{b}
              </div>
            ))}
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: FileText, title: "ETA Compliance Engine", desc: "Every invoice issued through INVO is automatically structured to meet Egypt's ETA electronic invoicing standard. No manual submission required — our agents handle it end-to-end.", color: "var(--accent-base)" },
              { icon: Shield, title: "FRA Financial Standards", desc: "All factoring operations conducted within the FRA regulatory framework. Automated KYC, AML screening, and transaction monitoring embedded in every workflow.", color: "var(--orange-base)" },
            ].map((c) => {
              const Icon = c.icon;
              return (
                <div key={c.title} className="neon-card rounded-2xl border bg-surface-1 p-5" style={{ borderColor: `${c.color}33` }}>
                  <div className="flex items-center gap-3 mb-3" dir="ltr">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center border"
                      style={{ background: `${c.color}15`, borderColor: `${c.color}40`, color: c.color }}>
                      <Icon size={16} />
                    </div>
                    <div className="font-semibold text-foreground">{c.title}</div>
                  </div>
                  <p className="text-sm text-foreground-secondary leading-relaxed">{c.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ FINAL CTA ═══════════ */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: "linear-gradient(to right, var(--accent-base) 1px, transparent 1px), linear-gradient(to bottom, var(--accent-base) 1px, transparent 1px)", backgroundSize: "56px 56px" }} />
        <div className="relative max-w-3xl mx-auto px-6 text-center animate-on-scroll">
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 text-balance leading-tight text-foreground">
            The Future of Hotel<br />Procurement is Here.
          </h2>
          <p className="text-foreground-secondary text-lg mb-10 max-w-xl mx-auto">
            Start free today. Explore the sandbox. Let our AI agents guide your onboarding. No commitment, no subscription — just results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/register"
              className="font-semibold px-10 py-3 cursor-pointer gap-2 text-base rounded-lg inline-flex items-center justify-center bg-accent-base text-surface hover:bg-accent-light transition-colors">
              Start Free — No Credit Card
            </a>
            <a href="/sandbox"
              className="font-semibold px-10 py-3 cursor-pointer gap-2 text-base rounded-lg border inline-flex items-center justify-center transition-colors hover:bg-white/5"
              style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
              Explore Sandbox
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ═════════════════════════════════════════════════════════════
   SANDBOX DEMO COMPONENT — Dual-layer dashboard + mobile preview
   ═════════════════════════════════════════════════════════════ */
function SandboxDemo({ t }: { t: (key: string) => string }) {
  const [tab, setTab] = useState<"hotel" | "vendor" | "chat">("hotel");

  return (
    <section className="py-20 border-y border-border-invisible">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10 animate-on-scroll">
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--accent-base)" }}>Sandbox Demo</span>
          <h2 className="text-3xl md:text-4xl mt-3 mb-3 text-foreground font-semibold">Explore Before You Commit</h2>
          <p className="text-foreground-secondary text-sm max-w-xl mx-auto">No account needed. See the dual-layer platform in action — web dashboard + mobile app.</p>
        </div>

        {/* Dual layer tabs */}
        <div className="flex justify-center mb-4 flex-wrap gap-2">
          {[
            { key: "hotel" as const, label: "🏢 Web Dashboard", color: "var(--accent-base)" },
            { key: "vendor" as const, label: "📱 INVO Mobile", color: "var(--orange-base)" },
            { key: "chat" as const, label: "🤖 AI Assistant", color: "var(--purple-base)" },
          ].map((tb) => (
            <button key={tb.key} onClick={() => setTab(tb.key)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer border"
              style={{
                background: tab === tb.key ? tb.color : "transparent",
                color: tab === tb.key ? "var(--bg-canvas)" : "rgba(160,160,176,1)",
                borderColor: tab === tb.key ? tb.color : `${tb.color}33`,
              }}>
              {tb.label}
            </button>
          ))}
        </div>

        {/* Hotel Dashboard Tab */}
        {tab === "hotel" && (
          <div className="rounded-2xl border overflow-hidden bg-canvas"
            style={{ borderColor: "var(--accent-base)33", boxShadow: "0 0 40px 2px var(--accent-glow)" }}>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-subtle bg-surface-1/60">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-base)" }} />
              <span className="flex-1 text-center text-[11px] text-foreground-muted font-mono">app.hotelsvendors.com — Meridian Hotels · 3 Properties</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">Meridian Hotels — Procurement Hub</h3>
                  <p className="text-foreground-secondary text-sm">3 properties · AI Spend Forecast: <span style={{ color: "var(--accent-base)" }}>↓ 8% vs last quarter</span></p>
                </div>
                <button className="text-sm px-4 py-2 font-semibold rounded-md bg-accent-base text-surface">AI Assist</button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: "Active Orders", value: "34", sub: "+8%", color: "var(--accent-base)" },
                  { label: "Monthly Spend", value: "EGP 182K", sub: "Forecast: EGP 168K", color: "var(--orange-base)" },
                  { label: "Vendor Network", value: "47", sub: "via INVO", color: "var(--purple-base)" },
                  { label: "Factoring Requests", value: "6", sub: "2 pending 48h", color: "var(--accent-base)" },
                ].map((c) => (
                  <div key={c.label} className="rounded-xl border bg-surface-1 p-4" style={{ borderColor: `${c.color}33` }}>
                    <div className="text-xs text-foreground-secondary mb-1">{c.label}</div>
                    <div className="text-2xl font-semibold text-foreground">{c.value}</div>
                    <div className="text-xs mt-1" style={{ color: c.color }}>{c.sub}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border bg-surface-1 overflow-hidden" style={{ borderColor: "var(--border-accent)" }}>
                <div className="px-4 py-3 border-b border-border-subtle flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground">Recent Orders — ETA Compliant</span>
                  <span className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: "var(--border-accent)", color: "var(--accent-base)" }}>All verified</span>
                </div>
                {[
                  { vendor: "Luxe Linen Co.", item: "Egyptian Cotton Sheets × 200", price: "EGP 14,400", status: "Delivered", color: "var(--accent-base)" },
                  { vendor: "ProClean Supplies", item: "Eco Amenity Kits × 500", price: "EGP 3,250", status: "In Transit", color: "var(--orange-base)" },
                  { vendor: "GourmetSource", item: "Premium Coffee Blend × 50kg", price: "EGP 2,100", status: "Factoring Active", color: "var(--purple-base)" },
                ].map((o, i) => (
                  <div key={i} className={`flex items-center justify-between px-4 py-3 text-sm ${i < 2 ? "border-b border-border-invisible" : ""}`}>
                    <div><div className="font-medium text-foreground">{o.vendor}</div><div className="text-foreground-secondary text-xs">{o.item}</div></div>
                    <div className="text-right"><div className="font-semibold text-foreground">{o.price}</div><div className="text-xs" style={{ color: o.color }}>{o.status}</div></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile App Tab */}
        {tab === "vendor" && (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 rounded-2xl border overflow-hidden bg-canvas"
              style={{ borderColor: "var(--orange-base)33", boxShadow: "0 0 40px 2px var(--orange-base)14" }}>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-subtle bg-surface-1/60">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-base)" }} />
                <span className="flex-1 text-center text-[11px] text-foreground-muted font-mono">INVO Mobile · Supplier Dashboard</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">Luxe Linen Co. — Vendor Central</h3>
                    <p className="text-foreground-secondary text-sm">340 hotel buyers · <span style={{ color: "var(--orange-base)" }}>12 active orders</span></p>
                  </div>
                  <button className="text-sm px-4 py-2 font-semibold rounded-md text-white" style={{ background: "var(--orange-base)" }}>Scan Invoice</button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: "Hotel Buyers", value: "340", color: "var(--orange-base)" },
                    { label: "MRR", value: "EGP 94K", color: "var(--accent-base)" },
                    { label: "Avg. Order", value: "EGP 2.8K", color: "var(--purple-base)" },
                    { label: "Reorder Rate", value: "74%", color: "var(--orange-base)" },
                  ].map((c) => (
                    <div key={c.label} className="rounded-xl border bg-surface-1 p-4" style={{ borderColor: `${c.color}33` }}>
                      <div className="text-xs text-foreground-secondary mb-1">{c.label}</div>
                      <div className="text-2xl font-semibold text-foreground">{c.value}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {["📸 Scan Invoice", "📦 New Order #2847", "🧹 Housekeeping", "💳 Factor Invoice"].map((f) => (
                    <div key={f} className="rounded-lg border border-white/5 bg-surface-1 p-3 text-sm text-foreground-secondary">{f}</div>
                  ))}
                </div>
              </div>
            </div>
            {/* Mobile phone frame */}
            <div className="hidden md:block w-48 shrink-0">
              <div className="rounded-3xl border-4 border-white/10 overflow-hidden bg-surface-1 p-2" style={{ boxShadow: "0 0 40px 2px var(--accent-glow)" }}>
                <div className="rounded-2xl overflow-hidden bg-canvas p-3">
                  <div className="text-[8px] text-center text-foreground-muted mb-2">INVO Mobile</div>
                  <div className="space-y-1.5">
                    {["📦 3 New Orders", "💳 Factor EGP 14.4K", "🏪 Browse INVO", "📸 Scan Invoice"].map((s) => (
                      <div key={s} className="rounded bg-surface-1 p-1.5 text-[8px] text-foreground-secondary">{s}</div>
                    ))}
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/5 text-center">
                    <div className="w-10 h-10 mx-auto rounded bg-white p-0.5">
                      <img src="https://api.qrserver.com/v1/create-qr-code/?size=36x36&data=https%3A%2F%2Fwww.hotelsvendors.com%2Foliv%2Freferral" alt="QR" className="w-full h-full" />
                    </div>
                    <div className="text-[7px] text-foreground-muted mt-1">Scan · CHV000</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Chat Tab */}
        {tab === "chat" && (
          <div className="rounded-2xl border overflow-hidden bg-canvas"
            style={{ borderColor: "var(--purple-base)33", boxShadow: "0 0 40px 2px var(--purple-base)14" }}>
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border-subtle bg-surface-1/60">
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: "var(--accent-base)" }} />
              <span className="flex-1 text-center text-[11px] text-foreground-muted font-mono">AI Procurement Assistant</span>
            </div>
            <div className="p-6 min-h-[320px]">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-accent-base text-surface text-xs font-semibold">AI</div>
                  <div className="rounded-xl rounded-tl-sm bg-surface-1 border border-white/5 p-3 text-sm text-foreground max-w-md">
                    I can help you find suppliers, create RFQs, and track orders. What do you need for your hotel today?
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <div className="rounded-xl rounded-tr-sm p-3 text-sm text-white max-w-md" style={{ background: "var(--purple-base)" }}>
                    I need 200 sets of Egyptian cotton bedsheets, 400 thread count, delivered to Sharm El-Sheikh by next week.
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-canvas border border-white/10 text-xs font-semibold text-foreground">GM</div>
                </div>
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-accent-base text-surface text-xs font-semibold">AI</div>
                  <div className="rounded-xl rounded-tl-sm bg-surface-1 border border-white/5 p-3 text-sm text-foreground max-w-md">
                    Found 3 verified suppliers on INVO. <strong style={{ color: "var(--accent-base)" }}>Luxe Linen Co.</strong> — EGP 72/unit, delivers in 3 days, 4.8★ rating. Would you like me to create an RFQ?
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}