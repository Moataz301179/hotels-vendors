"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Truck,
  Banknote,
  Clock,
  Building2,
  Package,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Plug,
  Webhook,
  RefreshCw,
  Database,
  Layers,
  Code2,
  Terminal,
  Server,
  Cpu,
  GitBranch,
  Boxes,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

const accent = "#FF6B00";
const accentMuted = "rgba(255,107,0,0.08)";
const accentBorder = "rgba(255,107,0,0.20)";
const surface = "#111520";
const borderSubtle = "rgba(255,255,255,0.06)";

const CATEGORIES = [
  { name: "F&B", desc: "Food, beverages & kitchen equipment", icon: "🍽️" },
  { name: "Consumables", desc: "Linens, chemicals & cleaning supplies", icon: "🧴" },
  { name: "Guest Supplies", desc: "Amenities & room accessories", icon: "🛁" },
  { name: "FF&E", desc: "Furniture, fixtures & capital equipment", icon: "🪑" },
  { name: "Services", desc: "Maintenance, pest control & laundry", icon: "🔧" },
];

const API_HOOKS = [
  { method: "POST", path: "/api/v1/inventory/sync", desc: "Bulk inventory update from PMS or ERP", status: "active" },
  { method: "GET", path: "/api/v1/catalog/search", desc: "Search supplier catalogs with filters", status: "active" },
  { method: "POST", path: "/api/v1/orders", desc: "Create purchase order programmatically", status: "active" },
  { method: "GET", path: "/api/v1/orders/:id/eta", desc: "Retrieve ETA-compliant invoice UUID", status: "active" },
  { method: "POST", path: "/api/v1/webhooks/register", desc: "Register webhook for PO/delivery events", status: "active" },
  { method: "GET", path: "/api/v1/suppliers/:id/credit", desc: "Check supplier factoring credit limit", status: "beta" },
];

const PLUGIN_EXTENSIONS = [
  { name: "Opera PMS Connector", desc: "Sync inventory from Opera Cloud. Auto-reorder triggers based on par levels.", icon: Layers, version: "v2.4.1" },
  { name: "SAP Hospitality Bridge", desc: "Bi-directional sync with SAP. Purchase orders, invoices, and stock movements.", icon: Server, version: "v1.8.0" },
  { name: "Mews Hotels Integration", desc: "Real-time inventory from Mews. AI predicts consumption from occupancy data.", icon: Cpu, version: "v3.1.0" },
  { name: "Sherlock RMS Plugin", desc: "Revenue management data feeds AI procurement forecasts. 94% accuracy.", icon: GitBranch, version: "v2.0.3" },
  { name: "ETA E-Invoice Gateway", desc: "Direct integration with Egyptian Tax Authority. Auto-sign, submit, archive.", icon: Terminal, version: "v4.2.0" },
  { name: "Shark-Breaker Logistics", desc: "Shared-route optimization for Red Sea resorts. GPS tracking, auto-settlement.", icon: Truck, version: "v1.5.0" },
];

const HOTEL_GROUPS = [
  "Stella Di Mare", "Sunrise Resorts", "Jaz Hotels", "Baron Hotels",
  "Pickalbatros", "Marriott Hurghada", "Four Seasons Sharm", "Rixos Sharm",
];

export default function MarketplacePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <main className="min-h-screen text-white" style={{ backgroundColor: "#0B0F17", fontFamily: "'Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
      <MarketingNav />

      {/* ═══ Hero ═══ */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6" style={{ backgroundColor: accentMuted, border: `1px solid ${accentBorder}` }}>
            <Sparkles size={12} style={{ color: accent }} />
            <span className="text-[11px] font-medium" style={{ color: accent }}>Layer 1 — Marketplace & Inventory Orchestration</span>
          </div>

          <h1 className="text-[32px] sm:text-[44px] font-semibold tracking-tight mb-4 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
            Egypt&apos;s B2B Hospitality<br />Procurement Marketplace
          </h1>
          <p className="text-[15px] text-white/50 mb-8 max-w-2xl mx-auto leading-relaxed">
            Fixed-price catalogs from verified Egyptian suppliers. ETA-compliant invoicing.
            24-hour settlement via embedded factoring. Open API + plugin ecosystem.
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="flex gap-2 max-w-md mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@hotel.com"
                  required
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl text-[13px] text-white placeholder:text-white/20 outline-none"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${borderSubtle}` }}
                />
              </div>
              <button type="submit" className="px-6 py-3.5 rounded-xl text-[13px] font-medium transition-all hover:opacity-90 flex items-center gap-2" style={{ backgroundColor: accent, color: "#fff" }}>
                Join Waitlist <ArrowRight size={14} />
              </button>
            </form>
          ) : (
            <div className="inline-flex items-center gap-3 px-6 py-4 rounded-xl" style={{ backgroundColor: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <CheckCircle2 size={18} className="text-green-400" />
              <span className="text-[14px] text-green-400">You&apos;re on the list. We&apos;ll reach out when we launch.</span>
            </div>
          )}
          <p className="text-[11px] text-white/20 mt-3">No spam. Early access + priority onboarding for waitlist members.</p>
        </div>
      </section>

      {/* ═══ Hotel Groups Trust Bar ═══ */}
      <section className="py-8 border-y" style={{ borderColor: borderSubtle }}>
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-[10px] uppercase tracking-[0.15em] text-white/20 text-center mb-5">Trusted by procurement teams at</p>
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {HOTEL_GROUPS.map((name) => (
              <span key={name} className="text-[12px] text-white/25 font-medium">{name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ API Hooks ═══ */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentMuted }}>
              <Code2 size={16} style={{ color: accent }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Developer API</span>
          </div>
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            RESTful Hooks for Inventory Synchronization
          </h2>
          <p className="text-[14px] text-white/40 max-w-2xl mb-8">
            Connect your PMS, ERP, or proprietary system directly to the HotelsVendors marketplace. Real-time inventory sync, automated PO generation, and ETA invoice retrieval.
          </p>

          <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${borderSubtle}` }}>
            <div className="px-4 py-3 flex items-center gap-2" style={{ backgroundColor: "rgba(255,255,255,0.02)", borderBottom: `1px solid ${borderSubtle}` }}>
              <Terminal size={14} className="text-white/40" />
              <span className="text-[11px] font-mono text-white/40">api.hotelsvendors.com/v1</span>
            </div>
            <div className="divide-y" style={{ borderColor: borderSubtle }}>
              {API_HOOKS.map((hook) => (
                <div key={hook.path} className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors" style={{ borderBottom: `1px solid ${borderSubtle}` }}>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded" style={{
                    backgroundColor: hook.method === "GET" ? "rgba(59,130,246,0.15)" : "rgba(34,197,94,0.15)",
                    color: hook.method === "GET" ? "#60A5FA" : "#4ADE80",
                  }}>{hook.method}</span>
                  <code className="text-[12px] font-mono text-white/60 flex-1">{hook.path}</code>
                  <span className="text-[10px] text-white/30 hidden sm:block">{hook.desc}</span>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded" style={{
                    backgroundColor: hook.status === "active" ? "rgba(34,197,94,0.1)" : "rgba(234,179,8,0.1)",
                    color: hook.status === "active" ? "#4ADE80" : "#FACC15",
                  }}>{hook.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Plugin Extensions ═══ */}
      <section className="py-20" style={{ borderTop: `1px solid ${borderSubtle}` }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentMuted }}>
              <Plug size={16} style={{ color: accent }} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: accent }}>Plugin Ecosystem</span>
          </div>
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Hospitality Integrations & Extensions
          </h2>
          <p className="text-[14px] text-white/40 max-w-2xl mb-8">
            Pre-built connectors for major PMS, RMS, and ERP platforms. Deploy in hours, not months.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {PLUGIN_EXTENSIONS.map((plugin) => {
              const Icon = plugin.icon;
              return (
                <div key={plugin.name} className="rounded-xl p-5 transition-all hover:scale-[1.01]" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: accentMuted }}>
                      <Icon size={18} style={{ color: accent }} />
                    </div>
                    <span className="text-[10px] font-mono text-white/25">{plugin.version}</span>
                  </div>
                  <h3 className="text-[14px] font-medium text-white/90 mb-1">{plugin.name}</h3>
                  <p className="text-[12px] text-white/35 leading-relaxed">{plugin.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Product Categories ═══ */}
      <section className="py-20" style={{ borderTop: `1px solid ${borderSubtle}` }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              Product Categories
            </h2>
            <p className="text-[14px] text-white/40 max-w-lg mx-auto">
              Five curated categories covering the full hospitality supply chain.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.name} className="rounded-xl p-5 transition-all hover:scale-[1.01]" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: accentMuted }}>
                  <span className="text-[18px]">{cat.icon}</span>
                </div>
                <h3 className="text-[14px] font-medium text-white/90 mb-1">{cat.name}</h3>
                <p className="text-[12px] text-white/35 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
            <div className="rounded-xl p-5 flex flex-col items-center justify-center text-center" style={{ backgroundColor: accentMuted, border: `1px solid ${accentBorder}` }}>
              <Sparkles size={20} style={{ color: accent }} className="mb-2" />
              <h3 className="text-[14px] font-medium mb-1" style={{ color: accent }}>AI Sourcing Agent</h3>
              <p className="text-[12px] text-white/40 leading-relaxed">Describe what you need. Our agent finds it from verified suppliers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Trust Signals ═══ */}
      <section className="py-12 border-t" style={{ borderColor: borderSubtle }}>
        <div className="mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Shield, label: "Verified Suppliers", desc: "KYC + trade license verified" },
              { icon: Banknote, label: "48h Settlement", desc: "Embedded invoice factoring" },
              { icon: Truck, label: "Coastal Delivery", desc: "Shark-Breaker shared logistics" },
              { icon: Clock, label: "ETA Invoicing", desc: "Auto-generated compliant invoices" },
            ].map((signal) => (
              <div key={signal.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: surface, border: `1px solid ${borderSubtle}` }}>
                <signal.icon size={20} style={{ color: accent }} className="mx-auto mb-2" />
                <p className="text-[12px] font-medium text-white/70 mb-0.5">{signal.label}</p>
                <p className="text-[10px] text-white/30">{signal.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 border-t" style={{ borderColor: borderSubtle }}>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[24px] sm:text-[32px] font-semibold tracking-tight mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
            Ready to Transform Your Procurement?
          </h2>
          <p className="text-[14px] text-white/40 mb-8 max-w-lg mx-auto">
            Join the waitlist for early access. Priority onboarding for coastal hotel procurement teams.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:opacity-90" style={{ backgroundColor: accent, color: "#fff" }}>
              Get Started Free <ArrowRight size={14} />
            </Link>
            <Link href="/become-supplier" className="inline-flex items-center gap-2 px-6 py-3.5 text-[13px] font-medium rounded-xl transition-all hover:bg-white/[0.04]" style={{ border: `1px solid ${accentBorder}`, color: accent }}>
              Become a Supplier
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
