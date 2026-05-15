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
    ],
  },
  {
    group: "Intelligence",
    items: [
      { label: "Data Explorer", desc: "Cross-tenant search across users, suppliers, hotels, orders & products", icon: Search, to: "/admin/explorer", color: "#6366f1" },
      { label: "AI Insights", desc: "Anomaly detection, trend analysis & strategic recommendations", icon: Brain, to: "/admin/ai-insights", color: "#14b8a6" },
      { label: "Reports", desc: "Platform-wide analytics, GMV tracking & KPI dashboards", icon: PieChart, to: "/admin/reports", color: "#8b5cf6" },
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
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-white/[0.06] mb-8">
        <div className="py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-white">Command Center</h1>
            <p className="text-[13px] text-white/40 mt-1">Enterprise admin dashboard — all portals, all data, AI-powered</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
              <Bell className="w-5 h-5" />
              {pulse && pulse.pendingApprovals > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#8B0000]" />
              )}
            </button>
            <Link
              href="/admin/settings"
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all"
            >
              <Settings className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Portal Switcher */}
      <div className="mb-8">
        <h2 className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-3">Access Any Portal</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {PORTAL_SWITCHER.map((portal) => {
            const Icon = portal.icon;
            return (
              <Link
                key={portal.label}
                href={portal.to}
                className="flex items-center gap-3 p-4 rounded-xl border border-white/[0.06] bg-[#0f0f0f] hover:border-white/[0.12] hover:bg-white/[0.02] transition-all group"
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: portal.bg }}>
                  <Icon className="w-5 h-5" style={{ color: portal.color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">{portal.label}</p>
                  <p className="text-[11px] text-white/30">{portal.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-white/30 ml-auto transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] animate-pulse">
              <div className="h-8 bg-white/5 rounded w-16 mb-2" />
              <div className="h-3 bg-white/5 rounded w-24" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px]">{error}</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.06]"
            >
              <div className="text-[28px] font-bold" style={{ color: stat.color }}>
                {stat.value.toLocaleString()}
              </div>
              <div className="text-[11px] text-white/40 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Two Column: Activity + GMV */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activity Feed */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-[#0f0f0f]">
          <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ff6b6b]" />
              <h2 className="text-sm font-semibold text-white/80">Live Activity Feed</h2>
            </div>
            <Link href="/admin/explorer" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {actLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-3 bg-white/5 rounded w-1/3 mb-2" />
                  <div className="h-2 bg-white/5 rounded w-2/3" />
                </div>
              ))
            ) : activity.length === 0 ? (
              <div className="p-8 text-center text-white/20 text-sm">No recent activity</div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="p-4 hover:bg-white/[0.01] transition-colors flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-white/[0.03] border border-white/[0.06] mt-0.5">
                    {typeIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-white/70">{item.title}</span>
                      <span className="text-[10px] text-white/20">{formatTimeAgo(item.timestamp)}</span>
                    </div>
                    <p className="text-xs text-white/30">{item.description}</p>
                  </div>
                  {item.amount && (
                    <span className="text-xs font-medium text-white/40 whitespace-nowrap">
                      {item.amount.toLocaleString()} {item.currency || "EGP"}
                    </span>
                  )}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${statusColor(item.status)}`}>
                    {item.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: GMV + Quick Links */}
        <div className="space-y-6">
          {/* GMV Card */}
          {pulse && (
            <div className="p-5 rounded-xl bg-[#0f0f0f] border border-white/[0.06]">
              <p className="text-[11px] text-white/40 uppercase tracking-wider">Last 30 Days GMV</p>
              <p className="text-[28px] font-bold text-white mt-2">
                EGP {pulse.monthlySpend.toLocaleString()}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-xs text-emerald-400">{pulse.recentOrders} orders</span>
              </div>
              <Link
                href="/admin/reports"
                className="mt-4 block text-center px-4 py-2 bg-white/[0.04] border border-white/[0.08] text-white/60 text-[12px] font-medium rounded-lg hover:bg-white/[0.08] transition-colors"
              >
                View Full Reports
              </Link>
            </div>
          )}

          {/* Quick Links */}
          <div className="p-5 rounded-xl bg-[#0f0f0f] border border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white/60 mb-3">Quick Actions</h3>
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
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/[0.03] transition-colors group"
                  >
                    <Icon className="w-4 h-4 text-white/30 group-hover:text-white/50" />
                    <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">{link.label}</span>
                    <ArrowRight className="w-3 h-3 text-white/10 group-hover:text-white/30 ml-auto transition-colors" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Module Groups */}
      <div className="space-y-10">
        {MODULES.map((group, gi) => (
          <div key={group.group}>
            <h2 className="text-[14px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              {group.group}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {group.items.map((item, ii) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: gi * 0.1 + ii * 0.05 }}
                >
                  <Link
                    href={item.to}
                    className="group block p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] hover:border-white/[0.12] transition-all h-full"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: item.color }} />
                    </div>
                    <h3 className="text-[14px] font-semibold text-white mb-1.5 flex items-center gap-2">
                      {item.label}
                      <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 group-hover:translate-x-0.5 transition-all" />
                    </h3>
                    <p className="text-[12px] text-white/30 leading-relaxed">{item.desc}</p>
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
