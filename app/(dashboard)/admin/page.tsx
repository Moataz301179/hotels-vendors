"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Activity, Users, Building2, TrendingUp, AlertTriangle,
  CheckCircle2, Clock, BarChart3, Zap, Globe, CreditCard,
  ArrowUpRight, ArrowDownRight, Search, Eye, FileText,
  Terminal, Settings, Layers, Server, Database, Bell,
  UserCheck, Truck, Wallet, ArrowRight, RefreshCw,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/dashboards/shared/stat-card";
import { SectionCard } from "@/components/dashboards/shared/section-card";

/* ─── ANIMATIONS ─── */
const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const cardEnter = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* ─── TYPES ─── */
interface User { id: string; name: string; email: string; role: string; platformRole: string; tenantName?: string; createdAt: string; lastActive?: string; }
interface Order { id: string; orderNumber: string; status: string; total: number; hotel: { name: string }; supplier: { name: string }; createdAt: string; }
interface ActivityLog { id: string; action: string; actor: string; resource: string; createdAt: string; severity: "info" | "warning" | "critical"; }
interface SystemHealth { status: string; uptime: string; latency: number; errorRate: number; activeConnections: number; }
interface RevenueMetrics {
  totalRevenue: number; monthlyGrowth: number;
  transactionCount: number; averageOrderValue: number;
  byPortal: Record<string, number>;
}

/* ─── STATUS BADGE ─── */
const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
  CONFIRMED: { bg: "bg-[#8b5cf6]/10", text: "text-[#8b5cf6]", dot: "bg-[#8b5cf6]", label: "Confirmed" },
  DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
  CANCELLED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Cancelled" },
};
function StatusBadge({ status }: { status: string }) {
  const c = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{c.label}
    </span>
  );
}

function formatCurrency(amount: number, currency = "EGP") { return `${currency} ${amount.toLocaleString("en-EG")}`; }

/* ─── SEVERITY CONFIG ─── */
const SEVERITY_CONFIG: Record<string, { icon: typeof AlertTriangle; color: string; bg: string }> = {
  info: { icon: CheckCircle2, color: "text-blue-400", bg: "bg-blue-500/10" },
  warning: { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
  critical: { icon: Zap, color: "text-red-400", bg: "bg-red-500/10" },
};

/* ─── ACTIVITY FEED ─── */
function ActivityFeed({ logs, loading }: { logs: ActivityLog[]; loading: boolean }) {
  if (loading) return <LoadingTable rows={4} />;
  if (!logs.length) return <EmptyState title="No activity" description="System activity will appear here." />;

  return (
    <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1">
      {logs.map((log) => {
        const sev = SEVERITY_CONFIG[log.severity] || SEVERITY_CONFIG.info;
        return (
          <motion.div key={log.id} variants={cardEnter} initial="hidden" animate="visible"
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors group cursor-pointer">
            <div className={`p-1.5 rounded-lg ${sev.bg} flex-shrink-0 mt-0.5`}>
              <sev.icon size={12} className={sev.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] text-white/60 group-hover:text-white/80 transition-colors">{log.action}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] text-white/25">{log.actor}</span>
                <span className="text-white/10">·</span>
                <span className="text-[10px] text-white/20">{log.resource}</span>
              </div>
            </div>
            <span className="text-[10px] text-white/15 flex-shrink-0">{new Date(log.createdAt).toLocaleTimeString("en-EG", { hour: "2-digit", minute: "2-digit" })}</span>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ─── ENTITY MAP ─── */
function EntityMap({ users, orders }: { users: User[]; orders: Order[] }) {
  const counts = useMemo(() => {
    const hotels = users.filter((u) => u.platformRole === "HOTEL").length;
    const suppliers = users.filter((u) => u.platformRole === "SUPPLIER").length;
    const nbfs = users.filter((u) => u.platformRole === "NBFI").length;
    const logistics = users.filter((u) => u.platformRole === "LOGISTICS").length;
    return { hotels, suppliers, nbfs, logistics, totalUsers: users.length, totalOrders: orders.length };
  }, [users, orders]);

  return (
    <div className="space-y-3">
      {[
        { label: "Hotels", count: counts.hotels, icon: Building2, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10", bar: "bg-[#8b5cf6]" },
        { label: "Suppliers", count: counts.suppliers, icon: Warehouse, color: "text-blue-400", bg: "bg-blue-500/10", bar: "bg-blue-500" },
        { label: "NBFI Partners", count: counts.nbfs, icon: CreditCard, color: "text-emerald-400", bg: "bg-emerald-500/10", bar: "bg-emerald-500" },
        { label: "Logistics", count: counts.logistics, icon: Truck, color: "text-amber-400", bg: "bg-amber-500/10", bar: "bg-amber-500" },
      ].map((e) => {
        const maxCount = Math.max(counts.hotels, counts.suppliers, counts.nbfs, counts.logistics, 1);
        const pct = Math.round((e.count / maxCount) * 100);
        return (
          <div key={e.label} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-md ${e.bg}`}><e.icon size={11} className={e.color} /></div>
                <span className="text-[11px] text-white/50 font-medium">{e.label}</span>
              </div>
              <span className="text-[12px] font-bold text-white/70 font-mono">{e.count}</span>
            </div>
            <div className="h-1 rounded-full bg-white/[0.03] overflow-hidden">
              <div className={`h-full rounded-full ${e.bar} opacity-60`} style={{ width: `${Math.max(pct, 4)}%` }} />
            </div>
          </div>
        );
      })}
      <div className="pt-2 border-t border-white/[0.03] flex items-center justify-between">
        <span className="text-[10px] text-white/25">{counts.totalUsers} users · {counts.totalOrders} orders</span>
      </div>
    </div>
  );
}

/* ─── SYSTEM HEALTH ─── */
function SystemHealthCard({ health, loading }: { health: SystemHealth | null; loading: boolean }) {
  if (loading) return <LoadingCard rows={3} />;
  if (!health) return <EmptyState title="No data" description="System health metrics will appear here." />;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${health.status === "healthy" ? "bg-emerald-400 animate-pulse" : health.status === "degraded" ? "bg-amber-400" : "bg-red-400"}`} />
        <span className={`text-[12px] font-semibold ${health.status === "healthy" ? "text-emerald-400" : health.status === "degraded" ? "text-amber-400" : "text-red-400"} uppercase tracking-wider`}>
          {health.status}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "Uptime", value: health.uptime, icon: Clock },
          { label: "Latency", value: `${health.latency}ms`, icon: Zap },
          { label: "Error Rate", value: `${(health.errorRate * 100).toFixed(2)}%`, icon: AlertTriangle },
          { label: "Connections", value: health.activeConnections.toString(), icon: Users },
        ].map((m) => (
          <div key={m.label} className="p-2 rounded-lg bg-white/[0.015] border border-white/[0.03]">
            <p className="text-[9px] text-white/20 uppercase tracking-wider">{m.label}</p>
            <p className="text-[13px] font-semibold text-white/70 mt-0.5">{m.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── QUICK ACTIONS ─── */
function QuickActions() {
  const actions = [
    { label: "Approve Supplier", desc: "Review pending applications", icon: UserCheck, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Review Credit App", desc: "NBFI credit line requests", icon: CreditCard, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/10" },
    { label: "Resolve Dispute", desc: "Open dispute cases", icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-500/10" },
    { label: "Broadcast Message", desc: "Send platform notification", icon: Bell, color: "text-blue-400", bg: "bg-blue-500/10" },
  ];

  return (
    <div className="space-y-2">
      {actions.map((a) => (
        <button key={a.label} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-all group border border-transparent hover:border-white/[0.04] text-left">
          <div className={`p-1.5 rounded-lg ${a.bg} flex-shrink-0`}><a.icon size={13} className={a.color} /></div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-white/60 group-hover:text-white/85 transition-colors">{a.label}</p>
            <p className="text-[10px] text-white/20">{a.desc}</p>
          </div>
          <ArrowRight size={12} className="text-white/10 group-hover:text-white/30 transition-colors" />
        </button>
      ))}
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function AdminDashboardPage() {
  const { data: pulseData, loading: pulseLoading } = useApi<{ stats: { gmv: number; ordersToday: number; activeUsers: number; newSignups: number } }>("/api/v1/admin/pulse");
  const { data: activityData, loading: activityLoading } = useApi<{ logs: ActivityLog[] }>("/api/v1/admin/activity");
  const { data: usersData } = useApi<{ users: User[] }>("/api/v1/admin/users");
  const { data: ordersData } = useApi<{ orders: Order[] }>("/api/v1/admin/orders");
  const { data: revenueData } = useApi<RevenueMetrics>("/api/v1/factoring/invoices");

  const users = usersData?.users || [];
  const orders = ordersData?.orders || [];
  const logs = activityData?.logs || [];
  const pulse = pulseData?.stats;

  const stats = useMemo(() => {
    return [
      { label: "GMV Today", value: pulse ? `EGP ${(pulse.gmv / 1000000).toFixed(1)}M` : "—", change: "+12%", up: true, icon: Wallet, color: "crimson" as const },
      { label: "Orders Today", value: pulse?.ordersToday?.toString() || "—", change: "+5", up: true, icon: BarChart3, color: "blue" as const },
      { label: "Active Users", value: pulse?.activeUsers?.toString() || "—", change: "+8%", up: true, icon: Users, color: "emerald" as const },
      { label: "New Signups", value: pulse?.newSignups?.toString() || "—", change: "+3", up: true, icon: UserCheck, color: "amber" as const },
    ];
  }, [pulse]);

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6 pb-10">
      <motion.div variants={fadeInUp}>
        <PageHeader title="Admin Command Center" description="Platform health, activity monitoring, and operational controls."
          breadcrumbs={[{ label: "Dashboard" }]}
          actions={
            <div className="flex items-center gap-2">
              <button className="btn-ghost text-[12px] py-1.5 px-3"><RefreshCw size={14} /> Refresh</button>
              <button className="btn-crimson text-[12px] py-1.5 px-3"><Terminal size={14} /> Console</button>
            </div>
          }
        />
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => <StatCard key={s.label} {...s} delay={i} />)}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <SectionCard title="Activity Feed" icon={Activity}
            action={<span className="text-[11px] text-white/20">{logs.length} events</span>}>
            <ActivityFeed logs={logs} loading={activityLoading} />
          </SectionCard>

          <SectionCard title="Recent Orders" icon={BarChart3}>
            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-1">
              {orders.slice(0, 6).map((order) => (
                <motion.div key={order.id} variants={cardEnter} initial="hidden" animate="visible"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center flex-shrink-0">
                    <FileText size={13} className="text-[#8b5cf6]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-white/35">{order.orderNumber}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-[11px] text-white/35 mt-0.5">{order.hotel?.name} · {order.supplier?.name}</p>
                  </div>
                  <span className="text-[12px] font-semibold text-white/50 font-mono flex-shrink-0">{formatCurrency(order.total)}</span>
                </motion.div>
              ))}
              {orders.length === 0 && <EmptyState title="No orders" description="Orders will appear here." />}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-5">
          <SectionCard title="Entity Map" icon={Globe}>
            <EntityMap users={users} orders={orders} />
          </SectionCard>

          <SectionCard title="System Health" icon={Server}>
            <SystemHealthCard health={null} loading={false} />
          </SectionCard>

          <SectionCard title="Quick Actions" icon={Zap}>
            <QuickActions />
          </SectionCard>
        </div>
      </div>
    </motion.div>
  );
}
