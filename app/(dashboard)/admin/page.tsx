"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, ShieldCheck, Wallet, Users, Brain, Truck,
  CalendarClock, ScanBarcode, Store, BarChart3, ArrowRight,
  Settings, MapPin, PieChart, Bell, Loader2, Search,
  Hotel, Landmark, Package, ShoppingCart, FileText,
  Activity, TrendingUp, ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { motion } from "framer-motion";

const MODULES = [
  {
    group: "Operations",
    items: [
      { label: "Procurement Dashboard", desc: "Inventory alerts, consumption trends & restock predictions", icon: LayoutDashboard, to: "/procurement", color: "#3b82f6" },
      { label: "Approval Matrix", desc: "AI-driven PO evaluation, CFO overrides & payment triggers", icon: ShieldCheck, to: "/admin/suppliers/pipeline", color: "#8b5cf6" },
      { label: "Bulk Scheduler", desc: "Recurring procurement orders & automated supply runs", icon: CalendarClock, to: "/scheduler", color: "#06b6d4" },
      { label: "Dock Receiving", desc: "Barcode-scan incoming shipments & log discrepancies", icon: ScanBarcode, to: "/orders", color: "#10b981" },
    ],
  },
  {
    group: "Finance & Compliance",
    items: [
      { label: "Finance & Liquidity", desc: "Credit facilities, factoring pipeline & PO-ETA reconciliation", icon: Wallet, to: "/factoring", color: "#f59e0b" },
      { label: "Shipment Tracking", desc: "Live logistics map, delay alerts & damage reports", icon: Truck, to: "/shipping", color: "#ef4444" },
      { label: "ETA Compliance", desc: "E-invoicing status, submission deadlines & penalty tracking", icon: ShieldCheck, to: "/eta", color: "#ec4899" },
      { label: "Accounting & Revenue", desc: "Platform fees, commissions, P&L tracking & financial reports", icon: Wallet, to: "/admin/accounting", color: "#c8a36f" },
    ],
  },
  {
    group: "Intelligence",
    items: [
      { label: "Data Explorer", desc: "Cross-tenant search across users, suppliers, hotels, orders & products", icon: Search, to: "/admin/explorer", color: "#6366f1" },
      { label: "AI Insights", desc: "Anomaly detection, trend analysis & strategic recommendations", icon: Brain, to: "/admin/ai-insights", color: "#14b8a6" },
      { label: "Reports", desc: "Platform-wide analytics, GMV tracking & KPI dashboards", icon: PieChart, to: "/admin/reports", color: "#8b5cf6" },
      { label: "Analytics & Insights", desc: "User metrics, order analytics, revenue trends & growth KPIs", icon: BarChart3, to: "/admin/analytics", color: "#a28cb4" },
    ],
  },
  {
    group: "Platform Management",
    items: [
      { label: "Credentials & Secrets", desc: "API keys, webhook secrets, .env config & Oliv/ETA credentials", icon: ShieldCheck, to: "/admin/credentials", color: "#f59e0b" },
      { label: "AI Assistant", desc: "Generative suggestions for improvements, growth & enhancements", icon: Brain, to: "/admin/ai-assistant", color: "#a28cb4" },
      { label: "User Management", desc: "Users, roles, permissions & tenant administration", icon: Users, to: "/admin/users", color: "#3b82f6" },
      { label: "Logs & Audit", desc: "System logs, security events & compliance audit trail", icon: Activity, to: "/admin/logs", color: "#ef4444" },
    ],
  },
  {
    group: "AI Agent Core",
    items: [
      { label: "Grok Brain", desc: "Real-time agent execution monitor — watch tools, screenshots & results", icon: Brain, to: "/admin/grok-brain", color: "#ef4444" },
      { label: "Orchestrator", desc: "Strategic command center for AI agent squads", icon: BarChart3, to: "/admin/orchestrator", color: "#f59e0b" },
      { label: "Swarm", desc: "Job queue management, approvals & agent health", icon: Activity, to: "/admin/swarm", color: "#10b981" },
    ],
  },
];

const PORTAL_SWITCHER = [
  { label: "Hotel Portal", desc: "Browse as hotel buyer", icon: Hotel, to: "/hotel", color: "#3b82f6", bg: "#3b82f615" },
  { label: "Supplier Portal", desc: "Browse as supplier", icon: Store, to: "/supplier", color: "#f59e0b", bg: "#f59e0b15" },
  { label: "Factoring Portal", desc: "Browse as factoring company", icon: Landmark, to: "/factoring", color: "#8b5cf6", bg: "#8b5cf615" },
  { label: "Shipping Portal", desc: "Browse as logistics provider", icon: Truck, to: "/shipping", color: "#10b981", bg: "#10b98115" },
];

interface PulseData {
  pendingApprovals: number;
  activeOrders: number;
  etaInvoices: number;
  creditLines: number;
  totalUsers: number;
  totalHotels: number;
  totalSuppliers: number;
  totalProducts: number;
  recentOrders: number;
  monthlySpend: number;
}

interface ActivityItem {
  id: string;
  type: string;
  title: string;
  description: string;
  amount?: number;
  currency?: string;
  status: string;
  timestamp: string;
}

export default function AdminDashboardPage() {
  const [pulse, setPulse] = useState<PulseData | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actLoading, setActLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/v1/admin/pulse")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setPulse(json.data);
        else setError(json.error || "Failed to load metrics");
      })
      .catch(() => setError("Connection failed"))
      .finally(() => setLoading(false));

    fetch("/api/v1/admin/activity?limit=10")
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setActivity(json.data);
      })
      .catch(() => {})
      .finally(() => setActLoading(false));
  }, []);

  const stats = pulse
    ? [
        { label: "Pending Approvals", value: pulse.pendingApprovals, color: "#f59e0b", trend: null },
        { label: "Active Orders", value: pulse.activeOrders, color: "#3b82f6", trend: null },
        { label: "ETA Invoices", value: pulse.etaInvoices, color: "#10b981", trend: null },
        { label: "Credit Lines", value: pulse.creditLines, color: "#8b5cf6", trend: null },
        { label: "Total Users", value: pulse.totalUsers, color: "#ec4899", trend: null },
        { label: "Hotels", value: pulse.totalHotels, color: "#06b6d4", trend: null },
        { label: "Suppliers", value: pulse.totalSuppliers, color: "#f59e0b", trend: null },
        { label: "Products", value: pulse.totalProducts, color: "#10b981", trend: null },
      ]
    : [];

  const statusColor = (s: string) => {
    const map: Record<string, string> = {
      ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      APPROVED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      CONFIRMED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      IN_TRANSIT: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      DISPUTED: "bg-red-500/10 text-red-400 border-red-500/20",
      CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
      COMPLETED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    };
    return map[s] || "bg-white/5 text-white/50 border-white/10";
  };

  const typeIcon = (t: string) => {
    switch (t) {
      case "ORDER": return <ShoppingCart className="w-3.5 h-3.5 text-blue-400" />;
      case "USER": return <Users className="w-3.5 h-3.5 text-emerald-400" />;
      case "INVOICE": return <FileText className="w-3.5 h-3.5 text-amber-400" />;
      case "AUDIT": return <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />;
      case "FACTORING": return <Landmark className="w-3.5 h-3.5 text-cyan-400" />;
      default: return <Activity className="w-3.5 h-3.5 text-white/30" />;
    }
  };

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] text-slate-900">
      <div className="mb-8 rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6">
        <div className="mb-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-base)]" />
            Platform Command Fabric
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-slate-900 sm:text-[30px]">Command Center</h1>
            <p className="mt-1 text-[13px] text-slate-500">Enterprise admin dashboard — all portals, all data, AI-powered</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {pulse && pulse.pendingApprovals > 0 && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--accent-base)]" />
              )}
            </button>
            <Link
              href="/admin/settings"
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-3 text-[12px] font-semibold uppercase tracking-wider text-slate-500">Access Any Portal</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {PORTAL_SWITCHER.map((portal) => {
            const Icon = portal.icon;
            return (
              <Link
                key={portal.label}
                href={portal.to}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-slate-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: portal.bg }}>
                  <Icon className="h-5 w-5" style={{ color: portal.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 transition-colors">{portal.label}</p>
                  <p className="text-[12px] text-slate-500">{portal.desc}</p>
                </div>
                <ArrowRight className="ml-auto h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-500" />
              </Link>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-2 h-8 w-16 rounded bg-slate-200" />
              <div className="h-3 w-24 rounded bg-slate-200" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mb-8 rounded-xl border border-red-200 bg-red-50 p-4 text-[13px] text-red-600">{error}</div>
      ) : (
        <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.03)]"
            >
              <div className="text-[28px] font-bold" style={{ color: stat.color }}>
                {stat.value.toLocaleString()}
              </div>
              <div className="mt-1 text-[12px] text-slate-500">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between border-b border-slate-200 p-5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-rose-500" />
              <h2 className="text-sm font-semibold text-slate-700">Live Activity Feed</h2>
            </div>
            <Link href="/admin/explorer" className="text-[12px] text-slate-500 transition-colors hover:text-slate-700">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-slate-200">
            {actLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="mb-2 h-3 w-1/3 rounded bg-slate-200" />
                  <div className="h-2 w-2/3 rounded bg-slate-200" />
                </div>
              ))
            ) : activity.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-400">No recent activity</div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-4 transition-colors hover:bg-slate-50">
                  <div className="mt-0.5 rounded-md border border-slate-200 bg-slate-50 p-1.5">
                    {typeIcon(item.type)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-0.5 flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-700">{item.title}</span>
                      <span className="text-[11px] text-slate-400">{formatTimeAgo(item.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  {item.amount && (
                    <span className="whitespace-nowrap text-xs font-medium text-slate-500">
                      {item.amount.toLocaleString()} {item.currency || "EGP"}
                    </span>
                  )}
                  <span className={`rounded border px-1.5 py-0.5 text-[11px] ${statusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          {pulse && (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
              <p className="text-[12px] uppercase tracking-wider text-slate-500">Last 30 Days GMV</p>
              <p className="mt-2 text-[28px] font-bold text-slate-900">
                EGP {pulse.monthlySpend.toLocaleString()}
              </p>
              <div className="mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-emerald-500" />
                <span className="text-xs text-emerald-600">{pulse.recentOrders} orders</span>
              </div>
              <Link
                href="/admin/reports"
                className="mt-4 block rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-center text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-100"
              >
                View Full Reports
              </Link>
            </div>
          )}

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Quick Actions</h3>
            <div className="space-y-2">
              {[
                { label: "Data Explorer", to: "/admin/explorer", icon: Search },
                { label: "AI Insights", to: "/admin/ai-insights", icon: Brain },
                { label: "User Management", to: "/admin/users", icon: Users },
                { label: "Grok Brain", to: "/admin/grok-brain", icon: Activity },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.label}
                    href={link.to}
                    className="group flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-slate-50"
                  >
                    <Icon className="h-4 w-4 text-slate-500 group-hover:text-slate-700" />
                    <span className="text-sm text-slate-600 transition-colors group-hover:text-slate-800">{link.label}</span>
                    <ArrowRight className="ml-auto h-3 w-3 text-slate-300 transition-colors group-hover:text-slate-500" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {MODULES.map((group, gi) => (
          <div key={group.group}>
            <h2 className="mb-4 text-[14px] font-semibold uppercase tracking-wider text-slate-500">
              {group.group}
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              {group.items.map((item, ii) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.1 + ii * 0.05 }}
                >
                  <Link
                    href={item.to}
                    className="group block h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.04)] transition-all hover:-translate-y-0.5 hover:border-slate-300"
                  >
                    <div
                      className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </div>
                    <h3 className="mb-1.5 flex items-center gap-2 text-[14px] font-semibold text-slate-800">
                      {item.label}
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-500" />
                    </h3>
                    <p className="text-[12px] leading-relaxed text-slate-500">{item.desc}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
