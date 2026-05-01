"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  TrendingUp,
  Shield,
  Zap,
  CheckCircle2,
  ArrowRight,
  Package,
  Truck,
  CreditCard,
  Brain,
  Menu,
  X,
  Star,
  Building2,
  Factory,
  Landmark,
  Anchor,
  Clock,
  FileCheck,
  Lock,
  Users,
  Sparkles,
  HeartHandshake,
  BarChart3,
} from "lucide-react";

/* ── Types ── */
interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  stockQuantity: number;
  minOrderQty: number;
  images?: string | null;
  supplier?: { name: string };
}

interface Supplier {
  id: string;
  name: string;
  city: string;
  certifications?: string;
}

/* ── Constants ── */
const CATEGORY_LABELS: Record<string, string> = {
  F_AND_B: "F&B",
  CONSUMABLES: "Consumables",
  GUEST_SUPPLIES: "Guest Supplies",
  FFE: "FF&E",
  SERVICES: "Services",
};

const CATEGORY_COLORS: Record<string, string> = {
  F_AND_B: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  CONSUMABLES: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  GUEST_SUPPLIES: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  FFE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  SERVICES: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
};

/* ── Product Card (inline for hero) ── */
function HeroProductCard({ p }: { p: Product }) {
  const [src, setSrc] = useState("");
  useEffect(() => {
    if (p.images) {
      try {
        const arr = JSON.parse(p.images);
        if (Array.isArray(arr) && arr.length > 0) setSrc(arr[0]);
      } catch {}
    }
  }, [p.images]);

  const catLabel = CATEGORY_LABELS[p.category] || p.category;
  const catColor = CATEGORY_COLORS[p.category] || "bg-slate-500/10 text-slate-400 border-slate-500/20";

  return (
    <div className="rounded-lg border border-border-subtle bg-surface overflow-hidden hover:border-border-default transition-all hover:-translate-y-0.5 group">
      <div className="aspect-[4/3] bg-surface-raised relative overflow-hidden">
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-8 h-8 text-foreground-faint" />
          </div>
        )}
        <span className={`absolute top-2 left-2 text-[9px] px-1.5 py-[2px] rounded-full border ${catColor} backdrop-blur-sm`}>
          {catLabel}
        </span>
      </div>
      <div className="p-2.5">
        <div className="text-[9px] font-mono text-foreground-muted">{p.sku}</div>
        <div className="text-[11px] font-medium truncate mt-0.5">{p.name}</div>
        <div className="text-[9px] text-foreground-muted truncate">{p.supplier?.name}</div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs font-semibold text-emerald-400">EGP {p.unitPrice.toLocaleString()}</span>
          <span className="text-[9px] text-foreground-muted">MOQ {p.minOrderQty}</span>
        </div>
      </div>
    </div>
  );
}

/* ── Animated Counter ── */
function useCountUp(end: number, duration = 1500) {
  const [val, setVal] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min((now - start) / duration, 1);
            setVal(Math.floor(t * end));
            if (t < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [end, duration]);
  return { val, ref };
}

/* ── Main Page ── */
export default function LandingPage() {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [heroProducts, setHeroProducts] = useState<Product[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");

  /* Fetch live data for hero */
  useEffect(() => {
    fetch("/api/products?limit=6")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setHeroProducts(d.data.slice(0, 6));
      });
    fetch("/api/suppliers?limit=4")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setSuppliers(d.data.slice(0, 4));
      });
  }, []);

  const filtered = heroProducts.filter((p) => {
    const m = search === "" || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const c = activeCategory === "ALL" || p.category === activeCategory;
    return m && c;
  });

  const stat1 = useCountUp(500);
  const stat2 = useCountUp(200);
  const stat3 = useCountUp(50);
  const stat4 = useCountUp(99);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-border-subtle bg-background/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
                <Image src="/logo-transparent.png" alt="Hotels Vendors" width={32} height={32} className="object-contain" />
              </div>
              <span className="text-sm font-bold tracking-tight">HOTELS VENDORS</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-xs font-medium text-foreground-muted">
              <a href="#catalog" className="hover:text-foreground transition-colors">Catalog</a>
              <a href="#why-us" className="hover:text-foreground transition-colors">Why Us</a>
              <a href="#suppliers" className="hover:text-foreground transition-colors">Suppliers</a>
              <a href="#how" className="hover:text-foreground transition-colors">How It Works</a>
              <a href="#ai" className="hover:text-foreground transition-colors">AI Features</a>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Link href="/login" className="px-3 py-1.5 text-xs font-medium rounded-md border border-border-subtle hover:border-brand-500/50 transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="px-3 py-1.5 text-xs font-medium rounded-md bg-brand-700 text-white hover:bg-brand-600 transition-colors">
                Get Started
              </Link>
            </div>
            <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden border-t border-border-subtle px-4 py-3 space-y-2">
            <a href="#catalog" className="block text-sm text-foreground-muted hover:text-foreground">Catalog</a>
            <a href="#why-us" className="block text-sm text-foreground-muted hover:text-foreground">Why Us</a>
            <a href="#suppliers" className="block text-sm text-foreground-muted hover:text-foreground">Suppliers</a>
            <a href="#how" className="block text-sm text-foreground-muted hover:text-foreground">How It Works</a>
            <a href="#ai" className="block text-sm text-foreground-muted hover:text-foreground">AI Features</a>
            <div className="pt-2 flex gap-2">
              <Link href="/login" className="flex-1 text-center px-3 py-2 text-xs rounded-md border border-border-subtle">Sign In</Link>
              <Link href="/register" className="flex-1 text-center px-3 py-2 text-xs rounded-md bg-brand-700 text-white">Get Started</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero: Marketplace Search + Live Grid ── */}
      <section className="relative overflow-hidden border-b border-border-subtle">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(185,28,28,0.08),transparent)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-10 pb-12">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
              Procurement for Egypt's{" "}
              <span className="bg-gradient-to-r from-brand-400 to-brand-600 bg-clip-text text-transparent">
                Hotel Industry
              </span>
            </h1>
            <p className="text-sm text-foreground-muted">
              Discover verified suppliers, compare prices, and automate purchasing — all in one B2B marketplace.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products, suppliers, SKUs..."
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg bg-surface border border-border-subtle focus:border-brand-500/50 focus:outline-none transition-colors placeholder:text-foreground-faint"
              />
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
                activeCategory === "ALL" ? "bg-brand-500/10 text-brand-400 border-brand-500/30" : "bg-surface text-foreground-muted border-border-subtle hover:border-border-default"
              }`}
            >
              All Categories
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(activeCategory === key ? "ALL" : key)}
                className={`text-[11px] px-3 py-1 rounded-full border transition-colors ${
                  activeCategory === key ? CATEGORY_COLORS[key] : "bg-surface text-foreground-muted border-border-subtle hover:border-border-default"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Live Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {filtered.length > 0 ? (
              filtered.map((p) => <HeroProductCard key={p.id} p={p} />)
            ) : (
              heroProducts.map((p) => <HeroProductCard key={p.id} p={p} />)
            )}
          </div>

          <div className="text-center mt-4">
            <Link href="/catalog" className="inline-flex items-center gap-1 text-xs text-brand-400 hover:underline">
              Browse full catalog <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Scrolling Product Marquee ── */}
      <section className="border-b border-border-subtle bg-surface/50 overflow-hidden py-4">
        <div className="relative">
          <div className="flex animate-marquee whitespace-nowrap gap-4">
            {[...heroProducts, ...heroProducts].map((p, i) => (
              <div key={`${p.id}-${i}`} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs shrink-0">
                <Package className="w-3 h-3 text-brand-400" />
                <span className="text-foreground font-medium">{p.name}</span>
                <span className="text-emerald-400">EGP {p.unitPrice.toLocaleString()}</span>
              </div>
            ))}
            {heroProducts.length === 0 && (
              <>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs text-foreground-muted shrink-0"><Package className="w-3 h-3" /> Premium Egyptian Rice</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs text-foreground-muted shrink-0"><Package className="w-3 h-3" /> Fresh Chicken Breast</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs text-foreground-muted shrink-0"><Package className="w-3 h-3" /> Full Cream Milk</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs text-foreground-muted shrink-0"><Package className="w-3 h-3" /> Olive Oil Extra Virgin</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs text-foreground-muted shrink-0"><Package className="w-3 h-3" /> Guest Room Shampoo</span>
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border-subtle text-xs text-foreground-muted shrink-0"><Package className="w-3 h-3" /> Pool Chlorine Tablets</span>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Trust Bar ── */}
      <section className="border-b border-border-subtle bg-surface">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { label: "Hotels Onboarded", value: `${stat1.val}+`, icon: <Building2 className="w-4 h-4 text-brand-400" />, ref: stat1.ref },
              { label: "Verified Suppliers", value: `${stat2.val}+`, icon: <Factory className="w-4 h-4 text-emerald-400" />, ref: stat2.ref },
              { label: "Million EGP Processed", value: `${stat3.val}M+`, icon: <TrendingUp className="w-4 h-4 text-amber-400" />, ref: stat3.ref },
              { label: "ETA Compliance", value: `${stat4.val}.9%`, icon: <Shield className="w-4 h-4 text-blue-400" />, ref: stat4.ref },
            ].map((s) => (
              <div key={s.label} ref={s.ref} className="space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  {s.icon}
                  <span className="text-lg font-bold">{s.value}</span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-foreground-muted font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Us ── */}
      <section id="why-us" className="py-14 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold mb-2">Why Hotels Vendors?</h2>
            <p className="text-sm text-foreground-muted max-w-xl mx-auto">
              We eliminate the chaos of hotel procurement. No more phone calls, spreadsheets, or missed deadlines — just one powerful platform that handles everything.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: <Clock className="w-5 h-5" />,
                title: "Save 15+ Hours Weekly",
                desc: "Stop chasing suppliers by phone. Our digital catalog, auto-POs, and approval workflows cut procurement admin time by 80%.",
                pain: "Procurement teams waste hours on calls, emails, and manual order tracking.",
              },
              {
                icon: <BarChart3 className="w-5 h-5" />,
                title: "Cut Costs by 20-30%",
                desc: "AI price comparison across verified suppliers ensures you always pay the best price. Volume discounts are auto-applied.",
                pain: "Hotels overpay because they can't compare prices across all suppliers in real-time.",
              },
              {
                icon: <Shield className="w-5 h-5" />,
                title: "100% ETA Compliant",
                desc: "Every invoice is digitally signed and submitted to ETA automatically. No penalties, no audits, no stress.",
                pain: "Manual e-invoicing errors lead to ETA fines and delayed tax refunds.",
              },
              {
                icon: <Lock className="w-5 h-5" />,
                title: "Bank-Grade Security",
                desc: "End-to-end encryption, role-based access, and audit trails protect your financial data and supplier contracts.",
                pain: "Sharing POs and invoices via WhatsApp or email creates data leaks and compliance risks.",
              },
              {
                icon: <HeartHandshake className="w-5 h-5" />,
                title: "Verified Supplier Network",
                desc: "Every supplier is KYC-checked, rated, and audited. Cold-chain, HACCP, and ISO certifications are verified on-site.",
                pain: "Unverified suppliers deliver substandard goods, causing guest complaints and health risks.",
              },
              {
                icon: <CreditCard className="w-5 h-5" />,
                title: "Embedded Factoring",
                desc: "Get paid in 24-48 hours instead of 60-90 days. Invoice factoring is built-in — no separate bank negotiations.",
                pain: "Cash flow gaps force hotels to delay payments and suppliers to take expensive bank loans.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-border-subtle bg-surface p-5 hover:border-brand-500/20 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-brand-700/20 flex items-center justify-center text-brand-400 mb-3 group-hover:bg-brand-700/30 transition-colors">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold mb-1.5">{item.title}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed mb-3">{item.desc}</p>
                <div className="flex items-start gap-1.5 text-[10px] text-foreground-faint bg-background/50 rounded-md px-2.5 py-2">
                  <Zap className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                  <span><span className="font-medium text-foreground-muted">Pain we solve:</span> {item.pain}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Suppliers ── */}
      <section id="suppliers" className="py-12 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold">Featured Suppliers</h2>
              <p className="text-xs text-foreground-muted">Verified partners ready to fulfill your orders</p>
            </div>
            <Link href="/supplier" className="text-xs text-brand-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {suppliers.map((s) => (
              <div key={s.id} className="rounded-lg border border-border-subtle bg-surface p-4 hover:border-border-default transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-700/20 flex items-center justify-center text-brand-400">
                    <Factory className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-[10px] text-foreground-muted">{s.city}</div>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Supplier
                </div>
                {s.certifications && (
                  <div className="mt-2 text-[9px] text-foreground-muted">{s.certifications}</div>
                )}
              </div>
            ))}
            {suppliers.length === 0 && (
              <div className="col-span-full text-center text-xs text-foreground-muted py-8">Loading suppliers...</div>
            )}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="py-12 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold">How It Works</h2>
            <p className="text-xs text-foreground-muted mt-1">From search to delivery in three steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Search & Compare",
                desc: "Browse 5 categories of hotel supplies. Filter by price, MOQ, supplier tier, and certification.",
                icon: <Search className="w-5 h-5" />,
              },
              {
                step: "02",
                title: "Smart AI Purchase",
                desc: "Our AI officer finds the lowest price across suppliers, checks authority rules, and auto-approves POs.",
                icon: <Brain className="w-5 h-5" />,
              },
              {
                step: "03",
                title: "Track & Pay",
                desc: "Monitor delivery in real-time. Invoices are ETA-compliant. Pay via embedded factoring or direct transfer.",
                icon: <Truck className="w-5 h-5" />,
              },
            ].map((item) => (
              <div key={item.step} className="rounded-lg border border-border-subtle bg-surface p-5 relative overflow-hidden">
                <div className="absolute top-3 right-3 text-[10px] font-mono text-foreground-faint">{item.step}</div>
                <div className="w-10 h-10 rounded-lg bg-brand-700/20 flex items-center justify-center text-brand-400 mb-3">
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Smart AI Features ── */}
      <section id="ai" className="py-12 border-b border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-lg font-semibold">Smart AI Features</h2>
            <p className="text-xs text-foreground-muted mt-1">Intelligence that saves time and money</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: "Smart Deals",
                desc: "AI scans all supplier prices for the same SKU and surfaces the lowest offer automatically.",
                icon: <TrendingUp className="w-5 h-5" />,
              },
              {
                title: "AI Purchasing Officer",
                desc: "Auto-generates POs, routes them through your authority matrix, and approves under-limit orders instantly.",
                icon: <ShoppingCart className="w-5 h-5" />,
              },
              {
                title: "Product Alternatives",
                desc: "When stock is low or a supplier is offline, AI suggests equivalent products from verified vendors.",
                icon: <Package className="w-5 h-5" />,
              },
            ].map((f) => (
              <div key={f.title} className="rounded-lg border border-border-subtle bg-surface p-5 hover:border-brand-500/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-brand-700/20 flex items-center justify-center text-brand-400 mb-3">
                  {f.icon}
                </div>
                <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                <p className="text-xs text-foreground-muted leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-xl border border-border-subtle bg-surface p-8 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(185,28,28,0.08),transparent)]" />
            <div className="relative">
              <h2 className="text-xl font-bold mb-2">Ready to streamline your procurement?</h2>
              <p className="text-xs text-foreground-muted mb-6 max-w-lg mx-auto">
                Join Egypt's leading B2B hospitality network. Hotels save time, suppliers grow revenue, factoring companies earn yields, and logistics providers optimize routes.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <Link href="/register?type=hotel" className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg bg-brand-700 text-white hover:bg-brand-600 transition-colors">
                  <Building2 className="w-5 h-5" />
                  <span className="text-xs font-medium">Join as Hotel</span>
                </Link>
                <Link href="/register?type=supplier" className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg border border-border-subtle hover:border-brand-500/50 hover:bg-surface-raised transition-colors">
                  <Factory className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-medium">Join as Supplier</span>
                </Link>
                <Link href="/register?type=factoring" className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg border border-border-subtle hover:border-brand-500/50 hover:bg-surface-raised transition-colors">
                  <Landmark className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-medium">Factoring Services</span>
                </Link>
                <Link href="/register?type=shipping" className="flex flex-col items-center gap-2 px-4 py-3 rounded-lg border border-border-subtle hover:border-brand-500/50 hover:bg-surface-raised transition-colors">
                  <Truck className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs font-medium">Logistics Partner</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border-subtle bg-[#0a0e1a]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
                  <Image src="/logo-transparent.png" alt="Hotels Vendors" width={28} height={28} className="object-contain" />
                </div>
                <span className="text-sm font-bold">HOTELS VENDORS</span>
              </div>
              <p className="text-[11px] text-foreground-muted max-w-xs leading-relaxed">
                Egypt's first B2B digital procurement hub for hotels. Connecting buyers, suppliers, and financial services on one compliant platform.
              </p>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-foreground-faint font-semibold mb-2">Product</div>
              <div className="space-y-1.5">
                <a href="#catalog" className="block text-[11px] text-foreground-muted hover:text-foreground">Catalog</a>
                <a href="#suppliers" className="block text-[11px] text-foreground-muted hover:text-foreground">Suppliers</a>
                <a href="#ai" className="block text-[11px] text-foreground-muted hover:text-foreground">AI Features</a>
                <Link href="/eta-demo" className="block text-[11px] text-foreground-muted hover:text-foreground">ETA Compliance</Link>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-foreground-faint font-semibold mb-2">Company</div>
              <div className="space-y-1.5">
                <span className="block text-[11px] text-foreground-muted">About Us</span>
                <span className="block text-[11px] text-foreground-muted">Careers</span>
                <span className="block text-[11px] text-foreground-muted">Contact</span>
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-foreground-faint font-semibold mb-2">Legal</div>
              <div className="space-y-1.5">
                <span className="block text-[11px] text-foreground-muted">Privacy</span>
                <span className="block text-[11px] text-foreground-muted">Terms</span>
                <span className="block text-[11px] text-foreground-muted">ETA e-Invoicing</span>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-border-subtle text-[10px] text-foreground-muted text-center">
            © 2026 Hotels Vendors. Smarter Together.
          </div>
        </div>
      </footer>
    </div>
  );
}
