"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ShoppingCart,
  FileText,
  Truck,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  Plus,
  Search,
  ChevronRight,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardCard } from "../DashboardCard";

interface KPI {
  openPOs: number;
  pendingInvoices: number;
  activeDeliveries: number;
  budgetUtilization: number;
}

interface Order {
  id: string;
  orderNumber: string;
  supplierName: string;
  total: string;
  status: string;
  createdAt: string;
  estimatedDelivery: string | null;
}

interface PendingApproval {
  id: string;
  orderNumber: string;
  amount: string;
  requestedBy: string;
  waitingSince: string;
}

interface UpcomingDelivery {
  id: string;
  orderNumber: string;
  supplierName: string;
  eta: string;
  status: string;
}

interface BudgetAlert {
  category: string;
  utilization: number;
  threshold: number;
}

/**
 * Hotel Buyer Dashboard — procurement teams at individual properties.
 * Shows spend, orders, approvals, and budget health.
 */
export function HotelBuyerDashboard() {
  const [kpis, setKpis] = useState<KPI>({
    openPOs: 0,
    pendingInvoices: 0,
    activeDeliveries: 0,
    budgetUtilization: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [upcoming, setUpcoming] = useState<UpcomingDelivery[]>([]);
  const [budgetAlerts, setBudgetAlerts] = useState<BudgetAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchData() {
      try {
        const res = await fetch("/api/v1/dashboard/hotel");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        setKpis(data.kpis || kpis);
        setOrders(data.orders || []);
        setApprovals(data.approvals || []);
        setUpcoming(data.upcoming || []);
        setBudgetAlerts(data.budgetAlerts || []);
      } catch (err) {
        if (!cancelled) setError("Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-[var(--text-muted)] text-sm">Loading procurement data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-6 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  const budgetChartData = budgetAlerts.map((b) => ({
    name: b.category,
    utilization: b.utilization,
    threshold: b.threshold,
  }));

  const COLORS = ["var(--accent-base)", "var(--warning)", "var(--error)", "var(--success)"];

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[var(--text-primary)]">
            Hotel Procurement Portal
          </h1>
          <p className="text-[13px] text-[var(--text-muted)] mt-1">
            Track spend, manage orders, and monitor deliveries
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium bg-[var(--accent-base)] text-white hover:opacity-90 transition-opacity">
            <Plus size={14} />
            Create PO
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
            <Search size={14} />
            Browse Catalog
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg text-[12px] font-medium border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--surface-hover)] transition-colors">
            <Truck size={14} />
            View Deliveries
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={ShoppingCart}
          label="Open POs"
          value={kpis.openPOs.toString()}
          accent="var(--accent-base)"
        />
        <KPICard
          icon={FileText}
          label="Pending Invoices"
          value={kpis.pendingInvoices.toString()}
          accent="var(--warning)"
        />
        <KPICard
          icon={Truck}
          label="Active Deliveries"
          value={kpis.activeDeliveries.toString()}
          accent="var(--info)"
        />
        <KPICard
          icon={DollarSign}
          label="Budget Utilization"
          value={`${kpis.budgetUtilization}%`}
          accent={kpis.budgetUtilization > 85 ? "var(--error)" : "var(--success)"}
        />
      </div>

      {/* Budget Alerts */}
      {budgetAlerts.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={16} className="text-amber-400" />
            <span className="text-[12px] font-semibold uppercase tracking-wider text-amber-400">
              Budget Alerts
            </span>
          </div>
          <div className="space-y-2">
            {budgetAlerts.map((alert) => (
              <div key={alert.category} className="flex items-center justify-between">
                <span className="text-[12px] text-[var(--text-secondary)]">
                  {alert.category}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400"
                      style={{ width: `${Math.min(alert.utilization, 100)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-amber-400 w-12 text-right">
                    {alert.utilization}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="Budget Utilization by Category">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--text-muted)" }} />
                <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="utilization" fill="var(--accent-base)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="threshold" fill="var(--warning)" radius={[4, 4, 0, 0]} opacity={0.4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        <DashboardCard title="Order Status Breakdown">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getStatusBreakdown(orders)}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  dataKey="value"
                >
                  {getStatusBreakdown(orders).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--surface-raised)",
                    border: "1px solid var(--border-subtle)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-2">
            {getStatusBreakdown(orders).map((item, i) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                <span className="text-[10px] text-[var(--text-muted)]">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Recent Orders + Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <DashboardCard title="Recent Orders">
          <div className="space-y-3">
            {orders.length === 0 && (
              <p className="text-[12px] text-[var(--text-muted)]">No recent orders</p>
            )}
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between py-2 border-b border-[var(--border-invisible)] last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[var(--text-primary)] truncate">
                    {order.orderNumber}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate">
                    {order.supplierName}
                  </p>
                </div>
                <div className="text-right ml-3 shrink-0">
                  <p className="text-[12px] font-medium text-[var(--text-primary)]">
                    {order.total} EGP
                  </p>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>

        <DashboardCard title="Pending Approvals">
          <div className="space-y-3">
            {approvals.length === 0 && (
              <p className="text-[12px] text-[var(--text-muted)]">No pending approvals</p>
            )}
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between py-2 border-b border-[var(--border-invisible)] last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-medium text-[var(--text-primary)]">
                    {approval.orderNumber}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)]">
                    By {approval.requestedBy} · {approval.waitingSince}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-3 shrink-0">
                  <span className="text-[12px] font-medium text-[var(--text-primary)]">
                    {approval.amount} EGP
                  </span>
                  <button className="p-1 rounded bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </DashboardCard>
      </div>

      {/* Upcoming Deliveries */}
      <DashboardCard title="Upcoming Deliveries">
        <div className="space-y-3">
          {upcoming.length === 0 && (
            <p className="text-[12px] text-[var(--text-muted)]">No upcoming deliveries</p>
          )}
          {upcoming.map((delivery) => (
            <div
              key={delivery.id}
              className="flex items-center justify-between py-2 border-b border-[var(--border-invisible)] last:border-0"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-medium text-[var(--text-primary)]">
                  {delivery.orderNumber}
                </p>
                <p className="text-[10px] text-[var(--text-muted)]">{delivery.supplierName}</p>
              </div>
              <div className="flex items-center gap-4 ml-3 shrink-0">
                <div className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
                  <Clock size={12} />
                  {delivery.eta}
                </div>
                <StatusBadge status={delivery.status} />
              </div>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}

function KPICard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 rounded-lg" style={{ backgroundColor: `${accent}15` }}>
          <Icon size={18} style={{ color: accent }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
      <p className="text-[11px] text-[var(--text-muted)] mt-1 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const s = status?.toUpperCase();
  const color =
    s === "DELIVERED" || s === "CONFIRMED"
      ? "text-emerald-400 bg-emerald-500/10"
      : s === "IN_TRANSIT"
      ? "text-blue-400 bg-blue-500/10"
      : s === "DISPUTED" || s === "REJECTED" || s === "CANCELLED"
      ? "text-red-400 bg-red-500/10"
      : "text-amber-400 bg-amber-500/10";

  return (
    <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[9px] font-medium uppercase ${color}`}>
      {status?.replace(/_/g, " ") || "DRAFT"}
    </span>
  );
}

function getStatusBreakdown(orders: Order[]) {
  const counts: Record<string, number> = {};
  orders.forEach((o) => {
    const s = o.status?.replace(/_/g, " ") || "DRAFT";
    counts[s] = (counts[s] || 0) + 1;
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}
