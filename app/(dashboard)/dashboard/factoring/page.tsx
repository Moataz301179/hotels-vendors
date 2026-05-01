"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Landmark,
  Banknote,
  TrendingDown,
  TrendingUp,
  Receipt,
  ChevronRight,
  Shield,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";

const METRICS = [
  {
    label: "Active Facilities",
    value: "45",
    subtext: "+3 this week",
    icon: Landmark,
    color: "bg-accent-cyan/10 text-accent-cyan",
  },
  {
    label: "Deployed Capital",
    value: "12.4M EGP",
    subtext: "84% of capacity",
    icon: Banknote,
    color: "bg-accent-emerald/10 text-accent-emerald",
  },
  {
    label: "Default Rate",
    value: "1.2%",
    subtext: "Target < 2.0%",
    icon: TrendingDown,
    color: "bg-accent-amber/10 text-accent-amber",
  },
  {
    label: "Portfolio Yield",
    value: "18.7%",
    subtext: "Annualized IRR",
    icon: TrendingUp,
    color: "bg-accent-gold/10 text-accent-gold",
  },
];

const INVOICES = [
  { id: "INV-2026-0089", hotel: "Marriott Cairo", supplier: "Nile Textiles", amount: 142000, eta_status: "valid", risk: "low", days: 12 },
  { id: "INV-2026-0087", hotel: "Four Seasons Giza", supplier: "Wadi Foods", amount: 378000, eta_status: "valid", risk: "low", days: 8 },
  { id: "INV-2026-0085", hotel: "Pyramid View Hotel", supplier: "ProClean Egypt", amount: 56000, eta_status: "pending", risk: "high", days: 28 },
  { id: "INV-2026-0082", hotel: "Hilton Alexandria", supplier: "ElectroStar", amount: 456000, eta_status: "valid", risk: "low", days: 15 },
  { id: "INV-2026-0079", hotel: "Sunrise Marina", supplier: "Royal Pack", amount: 95000, eta_status: "invalid", risk: "medium", days: 35 },
];

const FACILITIES = [
  {
    name: "EFG Hermes",
    type: "Factoring Leader",
    deployed: 12400000,
    capacity: 50000000,
    rate: 0.018,
    active: 28,
    contact: "Ahmed Hassan",
    phone: "+20 2 3535 6000",
    email: "factoring@efg-hermes.com",
    location: "Cairo, Egypt",
  },
  {
    name: "Contact Financial",
    type: "SME Specialist",
    deployed: 6300000,
    capacity: 20000000,
    rate: 0.024,
    active: 17,
    contact: "Mona El-Sayed",
    phone: "+20 2 2403 9000",
    email: "sme@contact.com.eg",
    location: "Giza, Egypt",
  },
];

function RiskBadge({ risk }: { risk: string }) {
  const config: Record<string, { text: string; cls: string; dot: string }> = {
    low: { text: "Low Risk", cls: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20", dot: "bg-accent-emerald" },
    medium: { text: "Medium", cls: "bg-accent-amber/10 text-accent-amber border-accent-amber/20", dot: "bg-accent-amber" },
    high: { text: "High Risk", cls: "bg-brand-700/20 text-brand-400 border-brand-700/30", dot: "bg-brand-500" },
  };
  const c = config[risk] || config.low;
  return (
    <span className={`status-badge border ${c.cls}`}>
      <span className={`status-dot ${c.dot}`} />
      {c.text}
    </span>
  );
}

function EtaBadge({ status }: { status: string }) {
  const config: Record<string, { text: string; cls: string }> = {
    valid: { text: "ETA Valid", cls: "bg-accent-emerald/10 text-accent-emerald" },
    pending: { text: "Pending", cls: "bg-accent-amber/10 text-accent-amber" },
    invalid: { text: "Invalid", cls: "bg-brand-700/20 text-brand-400" },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${c.cls}`}>
      {c.text}
    </span>
  );
}

export default function FactoringDashboard() {
  return (
    <DashboardShell role="factoring">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text-animated">Liquidity Dashboard</span>
          </h1>
          <p className="text-foreground-muted mt-1 text-sm">
            Monitor capital deployment, invoice pipelines, and portfolio risk in real time
          </p>
        </div>

        {/* Metrics */}
        <div className="command-grid mb-8">
          {METRICS.map((m) => (
            <div key={m.label} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <m.icon size={18} />
                </div>
                {m.subtext && (
                  <span className="text-[11px] font-medium text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-full">
                    {m.subtext}
                  </span>
                )}
              </div>
              <p className="metric-value text-2xl font-bold text-foreground">{m.value}</p>
              <p className="metric-label mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Factorable Invoices Pipeline */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-accent-gold/10">
                  <Receipt size={18} className="text-accent-gold" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Factorable Invoices Pipeline</h2>
                  <p className="text-xs text-foreground-faint">Awaiting disbursement decision</p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
                All Invoices <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border-subtle">
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Invoice</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Hotel</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Amount</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Risk</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">ETA</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint text-right">Days</th>
                  </tr>
                </thead>
                <tbody>
                  {INVOICES.map((inv) => (
                    <tr key={inv.id} className="data-table-row">
                      <td className="py-3 text-sm font-mono text-foreground">{inv.id}</td>
                      <td className="py-3 text-sm text-foreground-muted">{inv.hotel}</td>
                      <td className="py-3 text-sm font-medium text-foreground">{inv.amount.toLocaleString()} EGP</td>
                      <td className="py-3"><RiskBadge risk={inv.risk} /></td>
                      <td className="py-3"><EtaBadge status={inv.eta_status} /></td>
                      <td className="py-3 text-sm text-foreground-faint text-right">{inv.days}d</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk Gauge */}
          <div className="glass-card p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-lg bg-brand-700/20">
                <Shield size={18} className="text-brand-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Portfolio Risk Gauge</h2>
                <p className="text-xs text-foreground-faint">Weighted exposure by tier</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-foreground-muted">Low Risk</span>
                  <span className="text-xs font-medium text-foreground">68%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-hover overflow-hidden">
                  <div className="h-full rounded-full bg-accent-emerald" style={{ width: "68%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-foreground-muted">Medium Risk</span>
                  <span className="text-xs font-medium text-foreground">22%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-hover overflow-hidden">
                  <div className="h-full rounded-full bg-accent-amber" style={{ width: "22%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-foreground-muted">High Risk</span>
                  <span className="text-xs font-medium text-foreground">10%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-surface-hover overflow-hidden">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: "10%" }} />
                </div>
              </div>
            </div>

            <div className="mt-5 p-4 rounded-xl bg-surface-raised border border-border-subtle">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-foreground-muted">Concentration Score</span>
                <span className="text-sm font-bold text-accent-emerald">7.8 / 10</span>
              </div>
              <div className="w-full h-2 rounded-full bg-surface-hover overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-700 via-accent-amber to-accent-emerald" style={{ width: "78%" }} />
              </div>
              <p className="text-[11px] text-foreground-faint mt-2">
                Diversified across 32 hotel chains
              </p>
            </div>
          </div>
        </div>

        {/* Facility Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {FACILITIES.map((f) => (
            <div key={f.name} className="glass-card p-6">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/10 flex items-center justify-center">
                    <Landmark size={18} className="text-accent-gold" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-foreground">{f.name}</h3>
                    <p className="text-xs text-foreground-faint">{f.type}</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-foreground-faint bg-surface-raised px-2 py-0.5 rounded border border-border-subtle">
                  {(f.rate * 100).toFixed(1)}% rate
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-5">
                <div>
                  <p className="metric-value text-lg font-bold text-foreground">{(f.deployed / 1000000).toFixed(1)}M</p>
                  <p className="metric-label mt-0.5">Deployed</p>
                </div>
                <div>
                  <p className="metric-value text-lg font-bold text-foreground">{(f.capacity / 1000000).toFixed(0)}M</p>
                  <p className="metric-label mt-0.5">Capacity</p>
                </div>
                <div>
                  <p className="metric-value text-lg font-bold text-foreground">{f.active}</p>
                  <p className="metric-label mt-0.5">Active</p>
                </div>
              </div>

              <div className="w-full h-1.5 rounded-full bg-surface-hover overflow-hidden mb-5">
                <div
                  className="h-full rounded-full bg-accent-gold transition-all"
                  style={{ width: `${(f.deployed / f.capacity) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                  <UserIcon size={13} className="text-foreground-faint" />
                  {f.contact}
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                  <Phone size={13} className="text-foreground-faint" />
                  {f.phone}
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                  <Mail size={13} className="text-foreground-faint" />
                  {f.email}
                </div>
                <div className="flex items-center gap-2 text-xs text-foreground-muted">
                  <MapPin size={13} className="text-foreground-faint" />
                  {f.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  );
}

// Small helper since lucide-react might not export a plain User in this version
function UserIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
