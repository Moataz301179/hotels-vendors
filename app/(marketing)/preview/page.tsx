"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, BrainCircuit, Receipt, Banknote, ShieldCheck, Store,
  TrendingUp, Zap, FileCheck, MapPin, CheckCircle2, Globe, Lock,
  Building2, ShoppingCart, CreditCard, Truck, Users, ChevronRight,
  BarChart3, Activity, Package, Clock, Sparkles, Menu, X, ChevronDown,
  Palette,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useDesignEditor, DEFAULT_CONFIG } from "@/components/preview/use-design-editor";
import { DesignEditorPanel } from "@/components/preview/design-editor-panel";

/* ─── NAV ─── */
function PreviewNav({ accent }: { accent: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${scrolled ? "bg-[var(--preview-canvas,#000000)]/90 backdrop-blur-xl border-b border-white/[0.05]" : "bg-transparent"}`}>
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo-icon-white.png" alt="Hotels Vendors" width={28} height={28} className="opacity-90" />
          <div className="flex flex-col">
            <span className="text-[14px] font-bold tracking-tight text-white leading-none">Hotels Vendors</span>
            <span className="text-[9px] font-semibold text-white/30 uppercase tracking-[0.12em] leading-none mt-0.5">Smarter Together</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-0.5">
          {[
            { label: "Platform", href: "#platform" },
            { label: "Workflow", href: "#workflow" },
            { label: "Coverage", href: "#coverage" },
            { label: "Modules", href: "#modules" },
            { label: "Trust", href: "#trust" },
          ].map((item) => (
            <Link key={item.label} href={item.href} className="px-3.5 py-2 text-[13px] font-medium text-white/40 hover:text-white transition-colors rounded-lg">
              {item.label}
            </Link>
          ))}
          <div className="relative" onMouseEnter={() => setDropdownOpen(true)} onMouseLeave={() => setDropdownOpen(false)}>
            <button className="flex items-center gap-1 px-3.5 py-2 text-[13px] font-medium text-white/40 hover:text-white transition-colors rounded-lg">
              Solutions <ChevronDown className="w-3 h-3" />
            </button>
            {dropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-64 bg-[#0a0a0a] border border-white/[0.06] rounded-xl shadow-2xl overflow-hidden">
                <div className="p-2 bg-white/[0.02] border-b border-white/[0.04]">
                  <p className="text-[10px] font-semibold text-white/20 uppercase tracking-wider px-2 pt-1">Stakeholders</p>
                </div>
                <Link href="/register/hotel" className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] border-b border-white/[0.03] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[var(--preview-accent,#bef264)]/10 flex items-center justify-center flex-shrink-0"><Building2 className="w-4 h-4 text-[var(--preview-accent,#bef264)]" /></div>
                  <div>
                    <div className="text-[13px] font-semibold text-white/80">For Hotels</div>
                    <div className="text-[11px] text-white/30">Procurement OS &amp; spend optimization</div>
                  </div>
                </Link>
                <Link href="/register/supplier" className="flex items-start gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[var(--preview-accent,#bef264)]/10 flex items-center justify-center flex-shrink-0"><ShoppingCart className="w-4 h-4 text-[var(--preview-accent,#bef264)]" /></div>
                  <div>
                    <div className="text-[13px] font-semibold text-white/80">For Suppliers</div>
                    <div className="text-[11px] text-white/30">Grow your B2B hospitality business</div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="px-4 py-2 text-[13px] font-medium text-white/40 hover:text-white transition-colors">Sign In</Link>
          <Link href="/register" className="inline-flex items-center gap-1.5 px-5 py-2.5 text-[13px] font-semibold bg-[var(--preview-accent,#bef264)] text-white hover:bg-[var(--preview-accent-dark,#6d28d9)] rounded-lg transition-colors">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button className="lg:hidden p-2 text-white/40" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/[0.06] px-6 py-5 bg-[var(--preview-canvas,#000000)]/95 backdrop-blur-xl">
          {["Platform", "Workflow", "Coverage", "Modules", "Trust"].map((l) => (
            <Link key={l} href={`#${l.toLowerCase()}`} className="block py-2.5 text-[14px] font-medium text-white/50" onClick={() => setMobileOpen(false)}>{l}</Link>
          ))}
        </div>
      )}
    </header>
  );
}

/* ─── SECTION TABS ─── */
function SectionTabs({ accent }: { accent: string }) {
  const [active, setActive] = useState("platform");

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-40% 0px -40% 0px" }
    );
    ["platform", "workflow", "coverage", "modules", "trust"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const tabs = [
    { id: "platform", label: "Platform Overview" },
    { id: "workflow", label: "Workflow" },
    { id: "coverage", label: "Coverage" },
    { id: "modules", label: "Modules" },
    { id: "trust", label: "Trust &amp; Security" },
  ];

  return (
    <nav className="sticky top-16 z-30 backdrop-blur-xl bg-[var(--preview-canvas,#000000)]/70 border-y border-white/[0.04]">
      <div className="mx-auto max-w-7xl px-6 h-12 flex items-center gap-1 overflow-x-auto scrollbar-hide">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => scrollTo(t.id)}
            className={`relative px-4 py-2 text-[13px] font-medium transition-colors whitespace-nowrap rounded-lg ${active === t.id ? "text-white" : "text-white/30 hover:text-white/60"}`}
          >
            {t.label}
            {active === t.id && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-[2px] rounded-full bg-[var(--preview-accent,#bef264)]" />}
          </button>
        ))}
      </div>
    </nav>
  );
}

/* ─── HERO ─── */
function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden" style={{ background: "var(--preview-hero-bg, #000000)" }}>
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        backgroundSize: "60px 60px",
      }} />
      <div className="absolute inset-0 opacity-30" style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${"var(--preview-accent,#bef264)"}20, transparent), radial-gradient(ellipse 60% 40% at 80% 30%, ${"var(--preview-accent,#bef264)"}08, transparent)`,
      }} />

      <div className="relative mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-8 bg-[var(--preview-accent,#bef264)]/50" />
            <span className="text-[11px] font-semibold text-[var(--preview-accent,#bef264)] uppercase tracking-[0.2em]">Egypt's B2B Procurement Hub</span>
          </div>

          <h1 className="font-bold text-white leading-[1.05] tracking-[-0.02em] mb-6" style={{ fontSize: "var(--preview-font-hero, 64px)" }}>
            Predict Demand.<br />Automate Sourcing.<br />Secure Cashflow.
          </h1>

          <p className="text-white/40 leading-relaxed max-w-xl mb-10" style={{ fontSize: "var(--preview-font-body, 15px)" }}>
            The intelligence layer for Egyptian hospitality procurement. AI-native demand sensing, embedded supply-chain finance, and native ETA compliance — in one operating system.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Link href="/register/hotel" className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold bg-[var(--preview-accent,#bef264)] text-white hover:bg-[var(--preview-accent-dark,#6d28d9)] rounded-xl transition-all">
              Register as Hotel <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/register/supplier" className="inline-flex items-center gap-2 px-7 py-3.5 text-[14px] font-semibold border border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.02] rounded-xl transition-all">
              Become a Supplier
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { v: "52", l: "Hotel Properties", s: "8 governorates" },
              { v: "68", l: "Verified Suppliers", s: "1,200+ SKUs" },
              { v: "100%", l: "ETA Compliant", s: "E-invoicing" },
              { v: "EGP 86M", l: "Monthly GMV", s: "Procurement tracked" },
            ].map((st) => (
              <div key={st.l} className="border-l border-white/[0.06] pl-5">
                <div className="text-[28px] md:text-[32px] font-bold text-white tracking-tight">{st.v}</div>
                <div className="text-[12px] font-medium text-white/50 mt-0.5">{st.l}</div>
                <div className="text-[10px] text-white/20 mt-0.5">{st.s}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── BENTO CARD ─── */
function BentoCard({ label, title, desc, accent, span, children }: {
  label: string; title: string; desc: string; accent: string; span?: string; children?: React.ReactNode;
}) {
  return (
    <div className={`group relative ${span || ""}`}>
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `linear-gradient(135deg, ${accent}15, transparent 60%)` }} />
      <div className="relative h-full rounded-2xl border p-5 flex flex-col hover:border-white/[0.08] transition-colors" style={{ backgroundColor: "var(--preview-card-bg, rgba(255,255,255,0.02))", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))", borderRadius: "var(--preview-card-radius, 16px)" }}>
        <div className="mb-auto">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] mb-2 block" style={{ color: accent + "80" }}>{label}</span>
          <h3 className="text-[15px] font-semibold text-white mb-1.5 leading-snug">{title}</h3>
          <p className="text-[12px] text-white/30 leading-relaxed">{desc}</p>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── MINI MOCKS ─── */
function MockChart() {
  return (
    <div className="mt-4 p-4 rounded-xl border space-y-3" style={{ backgroundColor: "var(--preview-canvas,#000000)", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))" }}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-white/20 uppercase tracking-wider">Spend Overview</span>
        <span className="text-[10px] text-white/15">This Month</span>
      </div>
      <div className="text-[20px] font-semibold text-white">EGP 2,847,500</div>
      <div className="flex gap-1 items-end h-8">
        {[40,55,35,70,45,60,80,50,65,75,55,90].map((h,i) => (
          <div key={i} className="flex-1 rounded-sm bg-white/[0.08]" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function MockInvoice() {
  return (
    <div className="mt-4 p-4 rounded-xl border space-y-2.5" style={{ backgroundColor: "var(--preview-canvas,#000000)", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))" }}>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500/60" />
        <span className="text-[10px] text-emerald-400/60">Submitted to ETA</span>
      </div>
      <div className="h-px bg-white/[0.03]" />
      <div className="flex justify-between text-[10px]"><span className="text-white/30">UUID</span><span className="font-mono text-white/20">E-2024-001234</span></div>
      <div className="flex justify-between text-[10px]"><span className="text-white/30">Status</span><span className="text-emerald-400/60">Valid</span></div>
    </div>
  );
}

function MockCredit() {
  return (
    <div className="mt-4 p-4 rounded-xl border space-y-2.5" style={{ backgroundColor: "var(--preview-canvas,#000000)", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))" }}>
      <div className="flex justify-between">
        <span className="text-[10px] text-white/20 uppercase tracking-wider">Credit Line</span>
        <span className="text-[9px] text-blue-400/60">Active</span>
      </div>
      <div className="text-[18px] font-semibold text-white">EGP 5,000,000</div>
      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <div className="h-full rounded-full bg-blue-500/40 w-[62%]" />
      </div>
      <div className="flex justify-between text-[9px] text-white/15"><span>Used: EGP 3.1M</span><span>62% utilized</span></div>
    </div>
  );
}

function MockNetwork() {
  return (
    <div className="mt-4 p-4 rounded-xl border space-y-2" style={{ backgroundColor: "var(--preview-canvas,#000000)", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))" }}>
      <div className="flex items-center gap-2 mb-1">
        <Globe size={12} className="text-amber-400/40" />
        <span className="text-[10px] text-white/20 uppercase tracking-wider">6 Governorates</span>
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {["Cairo","Alex","Hurghada","Sharm","Luxor","Aswan"].map((c) => (
          <div key={c} className="px-2 py-1.5 rounded-lg border text-center" style={{ backgroundColor: "var(--preview-card-bg, rgba(255,255,255,0.02))", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))" }}>
            <span className="text-[9px] text-white/30">{c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── PLATFORM SECTION ─── */
function PlatformSection() {
  return (
    <section id="platform" className="py-24" style={{ backgroundColor: "var(--preview-canvas,#000000)", paddingTop: "var(--preview-section-padding, 96px)", paddingBottom: "var(--preview-section-padding, 96px)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-xl mb-12">
          <span className="text-[10px] font-semibold text-[var(--preview-accent,#bef264)] uppercase tracking-[0.2em] mb-3 block">Platform Overview</span>
          <h2 className="font-bold text-white tracking-[-0.01em] mb-3" style={{ fontSize: "var(--preview-font-section, 36px)" }}>Built to scale as your business grows</h2>
          <p className="text-white/35 leading-relaxed" style={{ fontSize: "var(--preview-font-body, 15px)" }}>
            An integrated operating system connecting demand intelligence, compliance, financing, and supplier verification into a single workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
          <BentoCard label="INTELLIGENCE" title="Predictive Demand Sensing" desc="AI analyzes consumption velocity across properties, anticipates seasonal spikes, and auto-generates purchase orders before stockouts." accent="#bef264" span="lg:col-span-2 lg:row-span-2">
            <MockChart />
          </BentoCard>
          <BentoCard label="COMPLIANCE" title="Native ETA E-Invoicing" desc="Every invoice digitally signed, UUID-tagged, and submitted to the Egyptian Tax Authority in real time." accent="#10b981">
            <MockInvoice />
          </BentoCard>
          <BentoCard label="FINANCE" title="Embedded Cashflow" desc="Invoice factoring and credit-line management woven directly into the transaction flow." accent="#3b82f6">
            <MockCredit />
          </BentoCard>
          <BentoCard label="NETWORK" title="Verified Supplier Network" desc="Every supplier audited for commercial registration, tax compliance, and delivery track record." accent="#f59e0b">
            <MockNetwork />
          </BentoCard>
        </div>
      </div>
    </section>
  );
}

/* ─── WORKFLOW SECTION ─── */
function WorkflowSection() {
  const steps = [
    { n: "01", t: "Intelligent Demand Sensing", d: "AI ingests historical consumption and forecasts exactly what each outlet needs before stockouts occur." },
    { n: "02", t: "Autonomous Sourcing", d: "AI evaluates supplier bids against quality scores, SLAs, and historical pricing to find the optimal match." },
    { n: "03", t: "Governed Execution", d: "Orders route through your authority matrix. ETA-compliant invoices generate automatically on delivery." },
    { n: "04", t: "Continuous Optimization", d: "Post-delivery analytics feed back into the model. Price deviations adjust future sourcing parameters." },
  ];

  return (
    <section id="workflow" className="border-t border-white/[0.04]" style={{ backgroundColor: "var(--preview-canvas,#000000)", paddingTop: "var(--preview-section-padding, 96px)", paddingBottom: "var(--preview-section-padding, 96px)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <span className="text-[10px] font-semibold text-[var(--preview-accent,#bef264)] uppercase tracking-[0.2em] mb-3 block">Workflow</span>
          <h2 className="font-bold text-white tracking-[-0.01em] mb-3" style={{ fontSize: "var(--preview-font-section, 36px)" }}>From signal to delivery</h2>
          <p className="text-white/35" style={{ fontSize: "var(--preview-font-body, 15px)" }}>Four stages. Zero manual intervention.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <div className="text-[48px] font-bold text-white/[0.03] leading-none mb-2">{s.n}</div>
              <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--preview-card-bg, rgba(255,255,255,0.02))", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))", borderRadius: "var(--preview-card-radius, 16px)" }}>
                <div className="w-8 h-8 rounded-lg bg-[var(--preview-accent,#bef264)]/10 flex items-center justify-center mb-3">
                  <span className="text-[11px] font-bold text-[var(--preview-accent,#bef264)]">{s.n}</span>
                </div>
                <h3 className="text-[15px] font-semibold text-white mb-1.5">{s.t}</h3>
                <p className="text-[12px] text-white/30 leading-relaxed">{s.d}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 -right-3 w-6 h-px bg-white/[0.06]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── COVERAGE SECTION ─── */
function CoverageSection() {
  const cities = [
    { n: "Cairo", p: 18, r: "Capital Corridor" },
    { n: "Alexandria", p: 8, r: "Mediterranean" },
    { n: "Hurghada", p: 12, r: "Red Sea" },
    { n: "Sharm El-Sheikh", p: 9, r: "South Sinai" },
    { n: "Luxor", p: 3, r: "Upper Egypt" },
    { n: "Aswan", p: 2, r: "Upper Egypt" },
  ];

  return (
    <section id="coverage" className="border-t border-white/[0.04]" style={{ backgroundColor: "var(--preview-canvas,#000000)", paddingTop: "var(--preview-section-padding, 96px)", paddingBottom: "var(--preview-section-padding, 96px)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="max-w-xl">
            <span className="text-[10px] font-semibold text-[var(--preview-accent,#bef264)] uppercase tracking-[0.2em] mb-3 block">Coverage</span>
            <h2 className="font-bold text-white tracking-[-0.01em] mb-3" style={{ fontSize: "var(--preview-font-section, 36px)" }}>From Cairo to Aswan</h2>
            <p className="text-white/35" style={{ fontSize: "var(--preview-font-body, 15px)" }}>Unified procurement across six governorates.</p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 rounded-xl border" style={{ backgroundColor: "var(--preview-card-bg, rgba(255,255,255,0.02))", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))" }}>
            <MapPin size={14} className="text-[var(--preview-accent,#bef264)]" />
            <span className="text-[12px] text-white/40">52 properties connected</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {cities.map((c) => (
            <div key={c.n} className="group rounded-xl border p-5 hover:border-white/[0.08] transition-colors text-center" style={{ backgroundColor: "var(--preview-card-bg, rgba(255,255,255,0.02))", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))", borderRadius: "var(--preview-card-radius, 16px)" }}>
              <MapPin className="w-4 h-4 text-white/15 mx-auto mb-3" />
              <div className="text-[15px] font-semibold text-white">{c.n}</div>
              <div className="text-[11px] text-white/30 mt-1">{c.p} properties</div>
              <div className="text-[9px] text-white/15 mt-0.5 uppercase tracking-wider">{c.r}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── MODULES SECTION ─── */
function ModulesSection() {
  const mods = [
    { icon: BrainCircuit, t: "Predictive Demand", d: "AI forecasts consumption across properties before stockouts occur." },
    { icon: Receipt, t: "ETA E-Invoicing", d: "Digitally signed invoices submitted to the Tax Authority in real time." },
    { icon: Banknote, t: "Embedded Factoring", d: "Credit-line management woven into every transaction flow." },
    { icon: ShieldCheck, t: "Authority Governance", d: "Multi-level approval chains enforced at the database layer." },
    { icon: Store, t: "Verified Suppliers", d: "Audited for registration, compliance, and delivery track record." },
    { icon: TrendingUp, t: "Spend Intelligence", d: "Cross-property analysis, benchmarking, and anomaly detection." },
  ];

  return (
    <section id="modules" className="border-t border-white/[0.04]" style={{ backgroundColor: "var(--preview-canvas,#000000)", paddingTop: "var(--preview-section-padding, 96px)", paddingBottom: "var(--preview-section-padding, 96px)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <span className="text-[10px] font-semibold text-[var(--preview-accent,#bef264)] uppercase tracking-[0.2em] mb-3 block">Modules</span>
          <h2 className="font-bold text-white tracking-[-0.01em] mb-3" style={{ fontSize: "var(--preview-font-section, 36px)" }}>Six integrated modules</h2>
          <p className="text-white/35" style={{ fontSize: "var(--preview-font-body, 15px)" }}>Every layer of the procurement stack, connected.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mods.map((m) => (
            <div key={m.t} className="group rounded-2xl border p-6 hover:border-white/[0.08] transition-colors" style={{ backgroundColor: "var(--preview-card-bg, rgba(255,255,255,0.02))", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))", borderRadius: "var(--preview-card-radius, 16px)" }}>
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center mb-4 group-hover:bg-[var(--preview-accent,#bef264)]/10 transition-colors">
                <m.icon className="w-5 h-5 text-white/30 group-hover:text-[var(--preview-accent,#bef264)] transition-colors" />
              </div>
              <h3 className="text-[15px] font-semibold text-white mb-1.5">{m.t}</h3>
              <p className="text-[12px] text-white/30 leading-relaxed">{m.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── TRUST SECTION ─── */
function TrustSection() {
  const badges = [
    { l: "ETA Compliant", d: "E-invoicing integrated with Egyptian Tax Authority" },
    { l: "SOC 2 Ready", d: "Security controls aligned with industry standards" },
    { l: "GDPR Aware", d: "Data handling practices follow EU privacy principles" },
    { l: "256-bit TLS", d: "End-to-end encryption for all data in transit" },
  ];

  return (
    <section id="trust" className="border-t border-white/[0.04]" style={{ backgroundColor: "var(--preview-canvas,#000000)", paddingTop: "var(--preview-section-padding, 96px)", paddingBottom: "var(--preview-section-padding, 96px)" }}>
      <div className="mx-auto max-w-7xl px-6">
        <div className="text-center mb-14">
          <span className="text-[10px] font-semibold text-[var(--preview-accent,#bef264)] uppercase tracking-[0.2em] mb-3 block">Trust &amp; Security</span>
          <h2 className="font-bold text-white tracking-[-0.01em] mb-3" style={{ fontSize: "var(--preview-font-section, 36px)" }}>Enterprise-grade security</h2>
          <p className="text-white/35" style={{ fontSize: "var(--preview-font-body, 15px)" }}>Security and compliance at every layer.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map((b) => (
            <div key={b.l} className="rounded-xl border p-5 hover:border-white/[0.08] transition-colors" style={{ backgroundColor: "var(--preview-card-bg, rgba(255,255,255,0.02))", borderColor: "var(--preview-card-border, rgba(255,255,255,0.06))", borderRadius: "var(--preview-card-radius, 16px)" }}>
              <div className="w-9 h-9 rounded-lg bg-white/[0.03] flex items-center justify-center mb-3">
                <ShieldCheck className="w-4.5 h-4.5 text-white/25" />
              </div>
              <h3 className="text-[13px] font-semibold text-white mb-1">{b.l}</h3>
              <p className="text-[11px] text-white/25 leading-relaxed">{b.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA SECTION ─── */
function CTASection() {
  return (
    <section className="border-t border-white/[0.04]" style={{ backgroundColor: "var(--preview-canvas,#000000)", paddingTop: "var(--preview-section-padding, 96px)", paddingBottom: "var(--preview-section-padding, 96px)" }}>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-bold text-white tracking-[-0.02em] mb-4" style={{ fontSize: "var(--preview-font-section, 36px)" }}>
          Ready to transform your procurement?
        </h2>
        <p className="text-white/35 mb-10 max-w-md mx-auto" style={{ fontSize: "var(--preview-font-body, 15px)" }}>
          Join 52 hotels and 68 suppliers already on the platform.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/register/hotel" className="inline-flex items-center gap-2 px-8 py-4 text-[14px] font-semibold bg-[var(--preview-accent,#bef264)] text-white hover:bg-[var(--preview-accent-dark,#6d28d9)] rounded-xl transition-colors">
            Register as Hotel <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/register/supplier" className="inline-flex items-center gap-2 px-8 py-4 text-[14px] font-semibold border border-white/[0.08] text-white/50 hover:text-white hover:border-white/[0.15] hover:bg-white/[0.02] rounded-xl transition-all">
            Become a Supplier
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ─── FOOTER ─── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.04]" style={{ backgroundColor: "var(--preview-canvas,#000000)" }}>
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Image src="/logo-icon-white.png" alt="" width={24} height={24} className="opacity-70" />
              <span className="text-[14px] font-bold text-white">Hotels Vendors</span>
            </div>
            <p className="text-[12px] text-white/30 leading-relaxed max-w-[220px]">
              AI-native procurement operating system for Egyptian hospitality.
            </p>
          </div>
          {[
            { h: "Product", links: [
              { label: "Platform", href: "#platform" },
              { label: "Workflow", href: "#workflow" },
              { label: "Coverage", href: "#coverage" },
              { label: "Pricing", href: "/pricing" },
            ]},
            { h: "Company", links: [
              { label: "About", href: "/about" },
              { label: "Solutions", href: "/solutions" },
              { label: "Partners", href: "/partners" },
              { label: "Contact", href: "/contact" },
            ]},
            { h: "Resources", links: [
              { label: "Documentation", href: "#" },
              { label: "API Reference", href: "#" },
              { label: "Status", href: "#" },
              { label: "Support", href: "#" },
            ]},
            { h: "Legal", links: [
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" },
              { label: "Security", href: "#" },
            ]},
          ].map((col) => (
            <div key={col.h}>
              <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-4">{col.h}</h4>
              {col.links.map((l) => (
                <Link key={l.label} href={l.href} className="block text-[13px] text-white/40 hover:text-white transition-colors mb-2.5">{l.label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div className="mt-12 pt-6 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-white/20">© 2026 Hotels Vendors. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-white/20">Made in Egypt 🇪🇬</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── DESIGN STUDIO FLOATING BUTTON ─── */
function DesignStudioButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 bg-[#1a1a1a] border border-white/[0.08] text-white text-[12px] font-medium rounded-xl shadow-2xl hover:bg-white/[0.04] transition-colors"
    >
      <Palette size={14} />
      Design Studio
    </button>
  );
}

/* ─── MAIN PAGE ─── */
export default function PreviewPage() {
  const editor = useDesignEditor();
  const { open, setOpen, config, update, reset, exportConfig, applyStyles } = editor;

  return (
    <>
      {/* CSS variables from editor */}
      <style jsx global>{`
        :root {
          --preview-hero-bg: ${config.heroBg};
          --preview-accent: ${config.accentColor};
          --preview-accent-dark: ${config.accentDark};
          --preview-canvas: ${config.canvasBg};
          --preview-card-bg: ${config.cardBg};
          --preview-card-border: ${config.cardBorder};
          --preview-text-primary: ${config.textPrimary};
          --preview-text-secondary: ${config.textSecondary};
          --preview-text-muted: ${config.textMuted};
          --preview-section-padding: ${config.sectionPadding}px;
          --preview-card-radius: ${config.cardRadius}px;
          --preview-font-hero: ${config.fontSizeHero}px;
          --preview-font-section: ${config.fontSizeSection}px;
          --preview-font-body: ${config.fontSizeBody}px;
        }
      `}</style>

      <main className="min-h-screen" style={{ backgroundColor: config.canvasBg }}>
        <PreviewNav accent={config.accentColor} />
        <Hero />
        <SectionTabs accent={config.accentColor} />
        {config.showPlatform && <PlatformSection />}
        {config.showWorkflow && <WorkflowSection />}
        {config.showCoverage && <CoverageSection />}
        {config.showModules && <ModulesSection />}
        {config.showTrust && <TrustSection />}
        {config.showCTA && <CTASection />}
        <Footer />
      </main>

      {!open && <DesignStudioButton onClick={() => setOpen(true)} />}
      {open && (
        <DesignEditorPanel
          config={config}
          update={update}
          reset={reset}
          exportConfig={exportConfig}
          applyStyles={applyStyles}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
