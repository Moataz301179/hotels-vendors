"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Truck,
  PackageCheck,
  Fuel,
  Route,
  ChevronRight,
  Leaf,
  Boxes,
  Navigation,
  AlertCircle,
  TrendingUp,
  Building2,
} from "lucide-react";

const METRICS = [
  {
    label: "Active Trips",
    value: "18",
    subtext: "4 completing today",
    icon: Truck,
    color: "bg-accent-cyan/10 text-accent-cyan",
  },
  {
    label: "Deliveries Today",
    value: "47",
    subtext: "+12 vs yesterday",
    icon: PackageCheck,
    color: "bg-accent-emerald/10 text-accent-emerald",
  },
  {
    label: "Fuel Cost",
    value: "8,420 EGP",
    subtext: "-3.2% optimized",
    icon: Fuel,
    color: "bg-accent-amber/10 text-accent-amber",
  },
  {
    label: "Route Efficiency",
    value: "94.3%",
    subtext: "Top quartile",
    icon: Route,
    color: "bg-accent-gold/10 text-accent-gold",
  },
];

const TRIPS = [
  { id: "TR-2026-0418", route: "6th October → Downtown Cairo", stops: 6, driver: "Mohamed Ali", status: "in_transit", eta: "14:30", progress: 65 },
  { id: "TR-2026-0417", route: "10th Ramadan → Alexandria", stops: 4, driver: "Khaled Omar", status: "in_transit", eta: "16:00", progress: 42 },
  { id: "TR-2026-0416", route: "Alexandria → North Coast", stops: 8, driver: "Hassan Ibrahim", status: "loading", eta: "18:45", progress: 12 },
  { id: "TR-2026-0415", route: "Cairo → Giza Hotels", stops: 5, driver: "Ahmed Sayed", status: "completed", eta: "—", progress: 100 },
  { id: "TR-2026-0414", route: "Hurghada → Safaga", stops: 3, driver: "Youssef Kamal", status: "in_transit", eta: "12:15", progress: 78 },
];

const BUNDLING = [
  {
    id: "BND-001",
    route: "6th October → Marriott Cairo",
    hotels: ["Marriott Cairo", "Four Seasons Giza", "Kempinski Nile"],
    suppliers: ["Nile Textiles", "Wadi Foods"],
    savings: 12400,
    co2_saved: 18,
  },
  {
    id: "BND-002",
    route: "Alexandria → North Coast",
    hotels: ["Hilton Alexandria", "Sunrise Marina"],
    suppliers: ["ElectroStar", "Royal Pack"],
    savings: 8300,
    co2_saved: 12,
  },
];

function TripBadge({ status }: { status: string }) {
  const config: Record<string, { text: string; cls: string; dot: string }> = {
    in_transit: { text: "In Transit", cls: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20", dot: "bg-accent-cyan" },
    loading: { text: "Loading", cls: "bg-accent-amber/10 text-accent-amber border-accent-amber/20", dot: "bg-accent-amber" },
    completed: { text: "Completed", cls: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20", dot: "bg-accent-emerald" },
  };
  const c = config[status] || config.in_transit;
  return (
    <span className={`status-badge border ${c.cls}`}>
      <span className={`status-dot ${c.dot}`} />
      {c.text}
    </span>
  );
}

export default function ShippingDashboard() {
  return (
    <DashboardShell role="shipping">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text-animated">Daily Delivery Optimization</span>
          </h1>
          <p className="text-foreground-muted mt-1 text-sm">
            Monitor active trips, optimize routes, and discover bundling opportunities
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
          {/* Trips Table */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-accent-cyan/10">
                  <Truck size={18} className="text-accent-cyan" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Active Trips</h2>
                  <p className="text-xs text-foreground-faint">Real-time fleet tracking</p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
                Fleet View <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border-subtle">
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Trip ID</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Route</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Stops</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Driver</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Status</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint text-right">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {TRIPS.map((trip) => (
                    <tr key={trip.id} className="data-table-row">
                      <td className="py-3 text-sm font-mono text-foreground">{trip.id}</td>
                      <td className="py-3 text-sm text-foreground-muted max-w-[200px] truncate">{trip.route}</td>
                      <td className="py-3 text-sm text-foreground-muted">{trip.stops}</td>
                      <td className="py-3 text-sm text-foreground-muted">{trip.driver}</td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <TripBadge status={trip.status} />
                        </div>
                      </td>
                      <td className="py-3 text-sm text-foreground-faint text-right">{trip.eta}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Trip Progress Bars */}
            <div className="mt-4 space-y-3">
              {TRIPS.filter((t) => t.status !== "completed").map((trip) => (
                <div key={`${trip.id}-prog`} className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-foreground-faint w-24 truncate">{trip.id}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-surface-hover overflow-hidden">
                    <div
                      className={`h-full rounded-full ${trip.status === "loading" ? "bg-accent-amber" : "bg-accent-cyan"}`}
                      style={{ width: `${trip.progress}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-foreground-faint w-8 text-right">{trip.progress}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Route Optimization Panel */}
          <div className="glass-card p-6 flex flex-col">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="p-2 rounded-lg bg-accent-violet/10">
                <Navigation size={18} className="text-accent-violet" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Route Optimization</h2>
                <p className="text-xs text-foreground-faint">AI-suggested improvements</p>
              </div>
            </div>

            {/* Stylized Map Visualization */}
            <div className="flex-1 min-h-[200px] rounded-xl bg-surface-raised border border-border-subtle relative overflow-hidden">
              {/* Grid lines */}
              <div className="absolute inset-0 opacity-10">
                <div className="w-full h-full" style={{
                  backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
                  backgroundSize: "24px 24px"
                }} />
              </div>

              {/* Route lines */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M 40 180 Q 80 120 140 100 T 260 60" fill="none" stroke="rgba(6,182,212,0.4)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 60 200 Q 120 140 180 110 T 280 80" fill="none" stroke="rgba(245,158,11,0.3)" strokeWidth="2" strokeDasharray="4 4" />
                <path d="M 20 160 Q 100 100 160 80 T 300 40" fill="none" stroke="rgba(16,185,129,0.3)" strokeWidth="2" strokeDasharray="4 4" />
              </svg>

              {/* Waypoints */}
              <div className="absolute left-[40px] top-[180px] w-3 h-3 rounded-full bg-accent-cyan ring-2 ring-surface" />
              <div className="absolute left-[140px] top-[100px] w-3 h-3 rounded-full bg-accent-cyan ring-2 ring-surface" />
              <div className="absolute left-[260px] top-[60px] w-3 h-3 rounded-full bg-accent-emerald ring-2 ring-surface" />
              <div className="absolute left-[180px] top-[110px] w-3 h-3 rounded-full bg-accent-amber ring-2 ring-surface" />
              <div className="absolute left-[300px] top-[40px] w-3 h-3 rounded-full bg-accent-emerald ring-2 ring-surface" />

              {/* Labels */}
              <div className="absolute top-3 left-3 text-[10px] font-mono text-foreground-dim">Greater Cairo Hub</div>
              <div className="absolute bottom-3 right-3 text-[10px] font-mono text-foreground-dim">Alexandria Corridor</div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-raised border border-border-subtle">
                <TrendingUp size={14} className="text-accent-emerald mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">Reorder stop #3</p>
                  <p className="text-[11px] text-foreground-faint">Saves 14 min on TR-2026-0418</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5 p-2.5 rounded-lg bg-surface-raised border border-border-subtle">
                <AlertCircle size={14} className="text-accent-amber mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-foreground">Traffic alert on Ring Road</p>
                  <p className="text-[11px] text-foreground-faint">Reroute via 26th July corridor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Eco-Ship Bundling */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-accent-emerald/10">
                <Leaf size={18} className="text-accent-emerald" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">Eco-Ship Bundling Opportunities</h2>
                <p className="text-xs text-foreground-faint">Combine deliveries to reduce cost and carbon footprint</p>
              </div>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
              All Opportunities <ChevronRight size={14} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {BUNDLING.map((b) => (
              <div key={b.id} className="surface-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Boxes size={16} className="text-accent-emerald" />
                    <span className="text-sm font-semibold text-foreground">{b.id}</span>
                  </div>
                  <span className="text-[11px] font-mono text-foreground-faint bg-surface-hover px-2 py-0.5 rounded">
                    {b.route}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-[11px] text-foreground-faint mb-1">Hotels</p>
                    <div className="space-y-1">
                      {b.hotels.map((h) => (
                        <div key={h} className="flex items-center gap-1.5 text-xs text-foreground-muted">
                          <Building2 size={12} className="text-foreground-faint" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[11px] text-foreground-faint mb-1">Suppliers</p>
                    <div className="space-y-1">
                      {b.suppliers.map((s) => (
                        <div key={s} className="flex items-center gap-1.5 text-xs text-foreground-muted">
                          <PackageCheck size={12} className="text-foreground-faint" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="metric-value text-sm font-bold text-accent-emerald">{b.savings.toLocaleString()} EGP</p>
                      <p className="metric-label">Cost Savings</p>
                    </div>
                    <div>
                      <p className="metric-value text-sm font-bold text-accent-cyan">{b.co2_saved} kg</p>
                      <p className="metric-label">CO₂ Saved</p>
                    </div>
                  </div>
                  <button className="h-8 px-3 rounded-lg bg-brand-900/20 text-brand-400 text-xs font-medium hover:bg-brand-900/30 transition-colors flex items-center gap-1.5">
                    Bundle <ChevronRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
