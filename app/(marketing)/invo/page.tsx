"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Check,
  Star,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  Zap,
  Building2,
  Store,
  Search,
  Package,
  BarChart3,
  Clock,
  FileCheck,
  Users,
  Sparkles,
  X,
  Menu,
  ChevronDown,
  Percent,
  Award,
  RefreshCw,
  ShoppingCart,
  Eye,
  Smartphone,
  Truck,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { InvoNav } from "@/components/invo/invo-nav";
import { MarketTicker } from "@/components/marketing/market-ticker";
import { InvoFooter } from "@/components/invo/invo-footer";

/* ═══════════════════════════════════════════════════════════════
   TYPE DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */
interface Product {
  id: string;
  name: string;
  category: string;
  unitPrice: number;
  currency: string;
  supplier: { id: string; name: string; city: string; rating: number };
  images?: string;
  featured?: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: string[];
  maxProducts: number;
}

/* ═══════════════════════════════════════════════════════════════
   ANIMATION HELPERS
   ═══════════════════════════════════════════════════════════════ */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="text-[10px] uppercase tracking-[0.3em] mb-4 block"
      style={{ color: "#D4A843", letterSpacing: "0.3em" }}
    >
      {children}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   COUNT-UP ANIMATION
   ═══════════════════════════════════════════════════════════════ */
function AnimatedStat({
  value,
  label,
  prefix = "",
}: {
  value: number;
  label: string;
  prefix?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const [displayed, setDisplayed] = useState("0");

  useEffect(() => {
    if (!isInView || !value) return;
    const duration = 1500;
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplayed(prefix + Math.round(value).toLocaleString());
        clearInterval(timer);
      } else {
        setDisplayed(prefix + Math.round(current).toLocaleString());
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [isInView, value, prefix]);

  return (
    <div ref={ref} className="text-center">
      <div
        className="text-[30px] md:text-[42px] font-bold mb-1 metric-value"
        style={{ fontFamily: "var(--font-sans)", color: "#D4A843" }}
      >
        {isInView ? displayed : "0"}
      </div>
      <div className="text-[13px]" style={{ fontFamily: "var(--font-sans)", color: "rgba(255,255,255,0.5)" }}>
        {label}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIVE ACTIVITY TICKER
   ═══════════════════════════════════════════════════════════════ */
function ActivityTicker() {
  const activities = [
    "Stella Di Mare ordered 200kg chicken breast",
    "Sunrise Reserves requested cleaning supplies quote",
    "Delta Food Co. listed 45 new SKUs",
    "Jaz Hotels approved invoice INV-2024-0891",
    "Cairo Fresh joined INVO — 120 products listed",
    "Baron Hotels searched FF&E category",
    "Pickalbatros paid invoice INV-2024-0882 (48hr early)",
    "Nile Supply Co. upgraded to Professional plan",
  ];

  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDisplayIndex((i) => (i + 1) % activities.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [activities.length]);

  return (
    <div
      className="relative overflow-hidden h-10 flex items-center"
      style={{ background: "rgba(212,168,67,0.04)", borderTop: "1px solid rgba(212,168,67,0.06)", borderBottom: "1px solid rgba(212,168,67,0.06)" }}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center gap-3 w-full">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse" />
          <span className="text-[10px] font-medium uppercase tracking-wider text-[#22C55E]">Live</span>
        </div>
        <div className="overflow-hidden flex-1 h-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={displayIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center"
            >
              <span className="text-[12px] text-white/40 truncate">{activities[displayIndex]}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LIVE MARKETPLACE PREVIEW
   ═══════════════════════════════════════════════════════════════ */
function MarketplacePreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/invo/catalog/featured?limit=6")
      .then((r) => r.json())
      .then((d) => setProducts(d.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="surface-card p-4 animate-pulse">
            <div className="h-4 bg-white/5 rounded w-3/4 mb-3" />
            <div className="h-3 bg-white/5 rounded w-1/2 mb-2" />
            <div className="h-3 bg-white/5 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {products.slice(0, 6).map((p) => (
        <div
          key={p.id}
          className="surface-card p-4 hover:border-[rgba(212,168,67,0.2)] transition-all group"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="w-8 h-8 rounded-lg bg-[rgba(212,168,67,0.08)] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-4 h-4 text-[#D4A843]" />
            </div>
            {p.featured && (
              <span className="text-[8px] uppercase tracking-wider text-[#D4A843] px-1.5 py-0.5 rounded-full bg-[rgba(212,168,67,0.1)]">
                Featured
              </span>
            )}
          </div>
          <h4 className="text-[13px] text-white font-medium truncate">{p.name}</h4>
          <p className="text-[11px] text-white/30 truncate">{p.supplier?.name}</p>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-[14px] text-[#D4A843] font-semibold">
              EGP {p.unitPrice?.toFixed(0) || "—"}
            </span>
            <span className="text-[10px] text-white/20">{p.supplier?.city || ""}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AI ROI CALCULATOR
   ═══════════════════════════════════════════════════════════════ */
function RoiCalculator() {
  const [orders, setOrders] = useState(50);
  const [avgOrder, setAvgOrder] = useState(5000);
  const [factoringPct, setFactoringPct] = useState(40);

  const monthlyRevenue = orders * avgOrder;
  const factoringFee = monthlyRevenue * (factoringPct / 100) * 0.015;
  const subscriptionCost = 2500;
  const netBenefit = monthlyRevenue * (factoringPct / 100) * 0.98;
  const annualSaving = netBenefit * 12 - subscriptionCost * 12;

  return (
    <div
      className="surface-card p-8 max-w-lg"
      style={{
        background: "linear-gradient(135deg, rgba(212,168,67,0.04), rgba(212,168,67,0.01))",
        border: "1px solid rgba(212,168,67,0.1)",
      }}
    >
      <h3 className="text-[18px] text-white font-medium mb-6 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-[#D4A843]" />
        Estimate Your Earnings
      </h3>

      <div className="space-y-5">
        <div>
          <div className="flex justify-between text-[12px] mb-2">
            <span className="text-white/50">Monthly orders</span>
            <span className="text-white font-medium">{orders}</span>
          </div>
          <input
            type="range"
            min="5"
            max="500"
            value={orders}
            onChange={(e) => setOrders(Number(e.target.value))}
            className="w-full accent-[#D4A843]"
          />
        </div>
        <div>
          <div className="flex justify-between text-[12px] mb-2">
            <span className="text-white/50">Avg order value (EGP)</span>
            <span className="text-white font-medium">EGP {avgOrder.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="500"
            max="50000"
            step="500"
            value={avgOrder}
            onChange={(e) => setAvgOrder(Number(e.target.value))}
            className="w-full accent-[#D4A843]"
          />
        </div>
        <div>
          <div className="flex justify-between text-[12px] mb-2">
            <span className="text-white/50">Invoices factored</span>
            <span className="text-white font-medium">{factoringPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={factoringPct}
            onChange={(e) => setFactoringPct(Number(e.target.value))}
            className="w-full accent-[#D4A843]"
          />
        </div>
      </div>

      <div className="mt-6 pt-5 border-t border-white/5 space-y-3">
        <div className="flex justify-between text-[13px]">
          <span className="text-white/40">Monthly revenue</span>
          <span className="text-white font-medium">EGP {monthlyRevenue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-white/40">Subscription</span>
          <span className="text-white/60">-EGP {subscriptionCost.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-white/40">Factoring fees (1.5%)</span>
          <span className="text-white/60">-EGP {factoringFee.toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-[15px] pt-2 border-t border-white/5">
          <span className="text-[#D4A843] font-semibold">Estimated annual gain</span>
          <span className="text-[#D4A843] font-bold">
            EGP {Math.max(0, annualSaving).toFixed(0)}
          </span>
        </div>
      </div>

      <Link
        href="/register"
        className="mt-6 w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#D4A843] text-black text-[14px] font-semibold rounded-xl hover:bg-[#e0b856] transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.2)]"
      >
        Calculate Your Actual ROI
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRICING SECTION
   ═══════════════════════════════════════════════════════════════ */
function PricingSection() {
  const [annual, setAnnual] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);

  useEffect(() => {
    fetch("/api/v1/invo/plans")
      .then((r) => r.json())
      .then((d) => {
        if (d.data) setPlans(d.data);
        else
          setPlans([
            { id: "starter", name: "Starter", price: 0, currency: "EGP", billingCycle: "MONTHLY", features: ["Up to 10 products", "50 orders/month", "2 user accounts", "Basic analytics", "Email support", "Standard placement"], maxProducts: 10 },
            { id: "pro", name: "Professional", price: 2500, currency: "EGP", billingCycle: "MONTHLY", features: ["Up to 100 products", "Unlimited orders", "10 user accounts", "Featured listings", "Priority support", "Advanced analytics", "API access"], maxProducts: 100 },
            { id: "enterprise", name: "Enterprise", price: 8000, currency: "EGP", billingCycle: "MONTHLY", features: ["Unlimited products", "Unlimited orders", "Unlimited users", "Featured listings", "Dedicated account manager", "Custom branding", "API access", "SLA guarantee"], maxProducts: -1 },
          ]);
      })
      .catch(() => {});
  }, []);

  const effectivePlans = plans.map((p) => ({
    ...p,
    displayPrice: annual ? Math.round(p.price * 10) : p.price,
    displayPeriod: annual ? "/yr" : "/mo",
    saving: annual ? `Save ${Math.round((1 - 10 / 12) * 100)}%` : null,
  }));

  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white font-medium">
              No commission. No hidden fees.
              <br />
              <span className="text-[#D4A843]">Just a flat subscription.</span>
            </h2>
            <p className="mt-4 text-[15px] text-white/35 max-w-lg mx-auto">
              Keep 100% of every sale. Pay only the monthly fee. Upgrade, downgrade, or cancel anytime.
            </p>

            {/* Annual toggle */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <span className={`text-[13px] ${!annual ? "text-white" : "text-white/30"}`}>Monthly</span>
              <button
                onClick={() => setAnnual(!annual)}
                className={`relative w-12 h-6 rounded-full transition-colors ${annual ? "bg-[#D4A843]" : "bg-white/10"}`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform ${annual ? "translate-x-6" : "translate-x-0.5"}`}
                />
              </button>
              <span className={`text-[13px] ${annual ? "text-white" : "text-white/30"}`}>
                Annual <span className="text-[#22C55E] text-[11px]">Save 17%</span>
              </span>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {effectivePlans.map((p, idx) => {
            const isPro = idx === 1;
            return (
              <div
                key={p.id}
                className={`surface-card p-8 flex flex-col hover-lift relative ${
                  isPro ? "border-[rgba(212,168,67,0.3)] ring-1 ring-[rgba(212,168,67,0.15)]" : ""
                }`}
              >
                {isPro && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4A843] text-black text-[10px] font-semibold uppercase tracking-wider">
                    Most Suppliers Choose This
                  </div>
                )}
                <h3 className="text-[16px] text-white font-medium mt-2">{p.name}</h3>
                <div className="mt-4 mb-1">
                  <span className="text-[36px] text-white font-bold tracking-tight">
                    {p.price === 0 ? "Free" : `EGP ${p.displayPrice.toLocaleString()}`}
                  </span>
                  <span className="text-[14px] text-white/30">{p.displayPeriod}</span>
                </div>
                {p.saving && (
                  <span className="text-[11px] text-[#22C55E] font-medium">{p.saving}</span>
                )}
                <p className="text-[12px] text-white/30 mt-3 mb-6">
                  {p.id === "starter"
                    ? "Perfect for testing the waters"
                    : p.id === "pro"
                    ? "For serious suppliers scaling their reach"
                    : "For high-volume established suppliers"}
                </p>
                <ul className="space-y-3 mb-8 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-white/50">
                      <Check className="w-4 h-4 text-[#D4A843] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={p.id === "enterprise" ? "/contact" : "/register"}
                  className={`block text-center py-3.5 rounded-xl text-[14px] font-semibold transition-all ${
                    isPro
                      ? "bg-[#D4A843] text-black hover:bg-[#e0b856] hover:shadow-[0_0_30px_rgba(212,168,67,0.2)]"
                      : "border border-white/10 text-white/50 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {p.price === 0 ? "Start Free" : isPro ? "Start Free Trial" : "Deploy with AI"}
                </Link>
              </div>
            );
          })}
        </div>

        {/* Trust bar below pricing */}
        <div className="mt-10 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 px-6 py-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <span className="flex items-center gap-1.5 text-[12px] text-white/30">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4A843]" /> No commission on sales
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5 text-[12px] text-white/30">
              <RefreshCw className="w-3.5 h-3.5 text-[#D4A843]" /> Cancel anytime
            </span>
            <span className="w-px h-4 bg-white/10" />
            <span className="flex items-center gap-1.5 text-[12px] text-white/30">
              <Award className="w-3.5 h-3.5 text-[#D4A843]" /> Free 14-day trial
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FAQ SECTION
   ═══════════════════════════════════════════════════════════════ */
function FaqSection() {
  const faqs = [
    {
      q: "Is there really no commission on sales?",
      a: "Zero. Every piastre you earn on INVO is yours. We only charge the flat monthly subscription. If you use factoring, a 1-2% service fee applies only on the factored amount.",
    },
    {
      q: "How fast do I get paid?",
      a: "Standard settlement is Net-30 from invoice approval. With factoring, you can get paid within 24 hours — we advance the amount minus a small fee, and the hotel pays us later.",
    },
    {
      q: "Do I need to be ETA-registered?",
      a: "We handle ETA compliance automatically. Every invoice generated through INVO is digitally signed, UUID-validated, and submitted to the Egyptian Tax Authority. Zero manual work.",
    },
    {
      q: "What if I already have my own hotel clients?",
      a: "You can still use INVO for invoicing, ETA compliance, and factoring. List your products to reach new hotels, or use the platform just for the financial tools — it's up to you.",
    },
    {
      q: "Can HotelsVendors really hold our funds?",
      a: "No — we operate through Paymob, a licensed PSP under CBE Law 194/2020. Escrow funds are held by Paymob, not by HotelsVendors. We only instruct release on due terms.",
    },
    {
      q: "What happens if a hotel doesn't pay?",
      a: "With non-recourse factoring, we take the credit risk. If you've factored the invoice, you get paid regardless. Without factoring, standard collection processes apply.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <div className="text-center mb-14">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white font-medium">
              Questions Suppliers Ask
              <br />
              <span className="text-[#D4A843]">Before They Join</span>
            </h2>
          </div>
        </Reveal>

        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="surface-card overflow-hidden transition-all"
              style={{
                borderColor: openIndex === i ? "rgba(212,168,67,0.2)" : undefined,
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
              >
                <span className="text-[14px] text-white font-medium pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-white/30 shrink-0 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[13px] text-white/40 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-[13px] text-white/30 mb-4">Still have questions?</p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-[13px] text-[#D4A843] hover:text-[#e0b856] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Talk to our team
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function InvoMarketplacePage() {
  const router = useRouter();
  const [roleTab, setRoleTab] = useState<"supplier" | "hotel">("supplier");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.title = "INVO — Egypt's B2B Hospitality Marketplace";
  }, []);

  const suppliers = [
    { icon: DollarSign, title: "Get paid in 24 hours", desc: "Factor your invoices and receive payment within 24 hours. No more 60-90 day waits." },
    { icon: Building2, title: "Reach 500+ hotels", desc: "Your catalog visible to every hotel on the network. Procurement managers discover you." },
    { icon: BarChart3, title: "Smart analytics", desc: "Track product views, inquiries, conversion rates. Optimize your catalog with data." },
    { icon: FileCheck, title: "ETA compliance automated", desc: "Every invoice digitally signed and submitted to the Tax Authority. Zero manual work." },
  ];

  const hotels = [
    { icon: Search, title: "Browse 680+ suppliers", desc: "Compare products, pricing, and ratings across verified suppliers in every category." },
    { icon: ShieldCheck, title: "Escrow payment protection", desc: "Funds held by Paymob (licensed PSP). Released only when terms are met. Zero risk." },
    { icon: Clock, title: "Reverse factoring = Net-60", desc: "Let suppliers get paid early while you keep your payment terms. Everyone wins." },
    { icon: TrendingUp, title: "AI-powered procurement", desc: "Demand forecasting, auto-reorder, budget enforcement via authority matrix." },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── NAV ── */}
      <InvoNav />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-20 lg:pt-44 lg:pb-28 overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-[#D4A843]/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#D4A843]/[0.02] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] px-4 py-1.5 rounded-full bg-[rgba(212,168,67,0.08)] text-[#D4A843] border border-[rgba(212,168,67,0.15)]">
                Egypt&apos;s B2B Hospitality Marketplace
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight font-medium mb-6"
            >
              The Marketplace Connecting
              <br />
              <span className="text-[#D4A843]">Egypt&apos;s Hotels &amp; Suppliers</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[16px] md:text-[18px] text-white/45 leading-relaxed max-w-2xl mx-auto mb-8"
            >
              INVO is where hotels find verified suppliers and suppliers reach every hotel on Egypt&apos;s
              largest hospitality procurement network. No commissions. Transparent pricing. ETA-compliant.
            </motion.p>

            {/* Role tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex items-center justify-center gap-1 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.06] max-w-xs mx-auto mb-10"
            >
              {[
                { key: "supplier" as const, label: "I&apos;m a Supplier", icon: Store },
                { key: "hotel" as const, label: "I&apos;m a Hotel", icon: Building2 },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = roleTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setRoleTab(tab.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                      isActive ? "bg-[#D4A843] text-black" : "text-white/40 hover:text-white/60"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span dangerouslySetInnerHTML={{ __html: tab.label }} />
                  </button>
                );
              })}
            </motion.div>

            {/* Dynamic value prop based on role */}
            <AnimatePresence mode="wait">
              <motion.div
                key={roleTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-[15px] text-white/60 max-w-xl mx-auto mb-8">
                  {roleTab === "supplier"
                    ? "List your products once. Reach every hotel on the network. Get paid in 24 hours with factoring. Flat monthly fee, zero commission."
                    : "Browse 680+ verified suppliers. AI-powered procurement. Escrow-protected payments. ETA-compliant invoicing, fully automated."}
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#D4A843] text-black text-[15px] font-semibold rounded-xl hover:bg-[#e0b856] transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.2)]"
                  >
                    {roleTab === "supplier" ? "Start Listing Free" : "Start Buying Free"}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`#${roleTab === "supplier" ? "for-suppliers" : "for-hotels"}`}
                    className="inline-flex items-center gap-2 px-6 py-4 text-[14px] font-medium text-white/50 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-colors"
                  >
                    See How It Works
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Social proof bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto text-center"
          >
            {[
              { value: 680, label: "Verified Suppliers", prefix: "" },
              { value: 500, label: "Active Hotels", prefix: "" },
              { value: 12000000, label: "Monthly GMV (EGP)", prefix: "EGP " },
              { value: 48000, label: "Orders Processed", prefix: "" },
            ].map((s) => (
              <AnimatedStat key={s.label} value={s.value} label={s.label} prefix={s.prefix} />
            ))}
          </motion.div>

          {/* Hero search */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-10 max-w-lg mx-auto"
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) router.push(`/marketplace?search=${encodeURIComponent(searchQuery.trim())}`);
              }}
              className="relative"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products across 680+ suppliers..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[14px] text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#D4A843]/30 transition-colors"
              />
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── LIVE ACTIVITY TICKER ── */}
      <ActivityTicker />

      <MarketTicker />

      {/* ── FOR SUPPLIERS ── */}
      <section id="for-suppliers" className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <Reveal>
                <SectionLabel>For Suppliers</SectionLabel>
                <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white font-medium mb-6">
                  List Once.
                  <br />
                  <span className="text-[#D4A843]">Reach Every Hotel.</span>
                </h2>
                <p className="text-[15px] text-white/40 leading-relaxed mb-8">
                  Stop chasing payments and cold-calling procurement managers. List your catalog on INVO
                  and get discovered by hotels actively looking for your products. Flat monthly subscription.
                  Zero commission. Get paid in 24 hours with factoring.
                </p>
              </Reveal>

              <div className="space-y-4">
                {suppliers.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Reveal key={item.title} delay={i * 0.08}>
                      <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-[rgba(212,168,67,0.15)] transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.12)] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-[#D4A843]" />
                        </div>
                        <div>
                          <h3 className="text-[15px] text-white font-medium mb-1">{item.title}</h3>
                          <p className="text-[13px] text-white/40 leading-relaxed">{item.desc}</p>
                        </div>
                      </div>
                    </Reveal>
                  );
                })}
              </div>

              <Reveal delay={0.3}>
                <Link
                  href="/register"
                  className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-[#D4A843] text-black text-[15px] font-semibold rounded-xl hover:bg-[#e0b856] transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.2)]"
                >
                  List Your Products Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Reveal>
            </div>

            {/* ROI Calculator */}
            <Reveal delay={0.15}>
              <RoiCalculator />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── LIVE MARKETPLACE PREVIEW ── */}
      <section className="py-24 lg:py-32" style={{ background: "rgba(255,255,255,0.01)", borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div>
                <SectionLabel>Live Marketplace</SectionLabel>
                <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white font-medium">
                  Products hotels are
                  <br />
                  <span className="text-[#D4A843">browsing right now.</span>
                </h2>
              </div>
              <Link
                href="/marketplace"
                className="mt-4 md:mt-0 inline-flex items-center gap-2 text-[13px] text-[#D4A843] hover:text-[#e0b856] transition-colors"
              >
                Browse full marketplace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <MarketplacePreview />
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8 text-center">
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium border border-white/10 rounded-xl hover:bg-white/5 transition-colors"
              >
                <Eye className="w-4 h-4 text-[#D4A843]" />
                View all {">"} 4,500 products
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── WHY INVO — Dual Value ── */}
      <section className="py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-center mb-16">
              <SectionLabel>Why INVO</SectionLabel>
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white font-medium">
                Built for Both Sides
                <br />
                <span className="text-[#D4A843">of the Procurement Table</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Supplier side */}
            <Reveal delay={0.1}>
              <div
                className="surface-card p-8 lg:p-10 relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, rgba(212,168,67,0.04), transparent)",
                  border: "1px solid rgba(212,168,67,0.1)",
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[rgba(212,168,67,0.04)] blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-[#D4A843] flex items-center justify-center">
                      <Store className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#D4A843] font-medium">For Suppliers</div>
                      <h3 className="text-[18px] text-white font-medium">Sell to 500+ hotels</h3>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Flat monthly fee — no commission on sales",
                      "Get paid in 24 hours with invoice factoring",
                      "ETA compliance handled automatically",
                      "Real-time analytics on product performance",
                      "Featured listings for priority visibility",
                      "API access for catalog sync",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13px] text-white/50">
                        <Check className="w-4 h-4 text-[#D4A843] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-[13px] text-[#D4A843] hover:text-[#e0b856] transition-colors font-medium"
                  >
                    Start selling <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>

            {/* Hotel side */}
            <Reveal delay={0.2}>
              <div
                className="surface-card p-8 lg:p-10 relative overflow-hidden group"
                style={{
                  background: "linear-gradient(135deg, rgba(59,130,246,0.04), transparent)",
                  border: "1px solid rgba(59,130,246,0.1)",
                }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-[rgba(59,130,246,0.04)] blur-2xl pointer-events-none group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-11 h-11 rounded-xl bg-[#3B82F6] flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[#3B82F6] font-medium">For Hotels</div>
                      <h3 className="text-[18px] text-white font-medium">Procure from 680+ suppliers</h3>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {[
                      "Free to browse and order — no subscription needed",
                      "Escrow protection via Paymob (licensed PSP)",
                      "Reverse factoring: suppliers paid early, you keep Net-60",
                      "AI demand forecasting and auto-reorder",
                      "ETA-compliant invoicing, fully automated",
                      "Authority Matrix for budget control",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-2.5 text-[13px] text-white/50">
                        <Check className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-[13px] text-[#3B82F6] hover:text-[#60A5FA] transition-colors font-medium"
                  >
                    Start buying <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <PricingSection />

      {/* ── HOW IT WORKS (simple) ── */}
      <section className="py-24 lg:py-32" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="mx-auto max-w-7xl px-6">
          <Reveal>
            <div className="text-center mb-16">
              <SectionLabel>How It Works</SectionLabel>
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white font-medium mb-4">
                From Listing to Payment
                <br />
                <span className="text-[#D4A843]">in Four Simple Steps</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {[
              { num: "01", title: "Choose Your Plan", desc: "Pick Starter (free), Professional, or Enterprise. No commission, just a flat monthly fee.", icon: FileCheck },
              { num: "02", title: "List Your Products", desc: "Upload catalog with images, specs, and pricing. Go live to every hotel on the network instantly.", icon: Package },
              { num: "03", title: "Get Discovered", desc: "Hotels search, browse, and order from your catalog. Featured listings get priority placement.", icon: TrendingUp },
              { num: "04", title: "Get Paid Fast", desc: "Standard Net-30 or 24-hour factoring. ETA-compliant invoicing handled automatically.", icon: DollarSign },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.num} delay={i * 0.1}>
                  <div className="surface-card p-6 h-full group">
                    <div className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#D4A843] mb-4">Step {step.num}</div>
                    <div className="w-10 h-10 rounded-xl bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.12)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-[#D4A843]" />
                    </div>
                    <h3 className="text-[15px] text-white font-medium mb-2">{step.title}</h3>
                    <p className="text-[12px] text-white/40 leading-relaxed">{step.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <FaqSection />

      {/* ── FINAL CTA ── */}
      <section className="py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] rounded-full bg-[rgba(212,168,67,0.04)] blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-3xl px-6 text-center relative z-10">
          <Reveal>
            <SectionLabel>Ready to Transform Your Business?</SectionLabel>
            <h2 className="text-[clamp(1.75rem,4vw,3rem)] leading-tight tracking-tight text-white font-medium mb-6">
              {roleTab === "supplier"
                ? "Start Reaching Every Hotel in Egypt"
                : "Start Procuring Smarter Today"}
            </h2>
            <p className="text-[16px] text-white/40 leading-relaxed max-w-lg mx-auto mb-10">
              {roleTab === "supplier"
                ? "Free to list. No commission on sales. Cancel anytime. Join 680+ suppliers already on INVO."
                : "Free to browse. No subscription needed. Join 500+ hotels already using INVO for procurement."}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-10 py-4 bg-[#D4A843] text-black text-[15px] font-semibold rounded-xl hover:bg-[#e0b856] transition-all hover:shadow-[0_0_30px_rgba(212,168,67,0.2)]"
              >
                {roleTab === "supplier" ? "Get Started Free" : "Create Free Account"}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 text-[14px] font-medium text-white/40 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                Talk to Our Team
              </Link>
            </div>
            <div className="mt-6 flex items-center justify-center gap-4 text-[11px] text-white/20">
              <span>No credit card required</span>
              <span className="w-px h-3 bg-white/10" />
              <span>Free 14-day trial</span>
              <span className="w-px h-3 bg-white/10" />
              <span>Cancel anytime</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STICKY MOBILE CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-black/90 backdrop-blur-lg border-t border-white/[0.06] md:hidden">
        <Link
          href="/register"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-[#D4A843] text-black text-[14px] font-semibold rounded-xl"
        >
          {roleTab === "supplier" ? "List Your Products Free" : "Start Procuring Free"}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <InvoFooter />
    </div>
  );
}
