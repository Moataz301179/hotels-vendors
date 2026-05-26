"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, Package, TrendingDown, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Building2, CreditCard,
  Clock, CheckCircle2, BarChart3, PiggyBank,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

interface DashboardData {
  ordersCount: number;
  pendingOrders: number;
  spendRequestsCount: number;
  pendingSpendRequests: number;
  totalSpent: number;
  budgetRemaining: number;
  lowStockItems: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    supplierName: string;
    createdAt: string;
  }>;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

function KpiCard({
  title, value, icon: Icon, trend, trendUp, color, index,
}: {
  title: string; value: string; icon: any; trend?: string;
  trendUp?: boolean; color: string; index: number;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="p-5 rounded-xl border"
      style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
          <Icon size={20} style={{ color }} />
        </div>
        {trend && (
          <span className={`text-xs font-medium flex items-center gap-1 ${trendUp ? "text-green-400" : "text-red-400"}`}>
            {trendUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {trend}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/30 mt-1">{title}</div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING_APPROVAL: "#f59e0b",
    APPROVED: "#22c55e",
    REJECTED: "#ef4444",
    DELIVERED: "#3b82f6",
    DRAFT: "#6b7280",
  };
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors[status] || "#6b7280"}20`, color: colors[status] || "#6b7280" }}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default function HotelDashboardPage() {
  const { data, loading, error, refetch } = useApi<DashboardData>("/api/v1/hotel/dashboard");

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="p-4 rounded-xl border bg-red-500/10 text-red-300" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
          <AlertTriangle size={20} className="mb-2" />
          <p className="text-sm">{error}</p>
          <button onClick={refetch} className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 transition-colors">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const kpis = [
    { title: "Total Orders", value: String(data?.ordersCount || 0), icon: ShoppingCart, trend: "+12%", trendUp: true, color: "#a3e635" },
    { title: "Pending Approval", value: String(data?.pendingOrders || 0), icon: Clock, trend: "-5%", trendUp: false, color: "#f59e0b" },
    { title: "Total Spent", value: `EGP ${(data?.totalSpent || 0).toLocaleString()}`, icon: CreditCard, trend: "+8%", trendUp: true, color: "#22c55e" },
    { title: "Budget Left", value: `EGP ${(data?.budgetRemaining || 0).toLocaleString()}`, icon: PiggyBank, trend: "-3%", trendUp: false, color: "#3b82f6" },
  ];

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Hotel Dashboard</h1>
          <p className="text-xs text-white/30 mt-1">Overview of your procurement activity</p>
        </div>
        <button onClick={refetch} className="px-3 py-1.5 rounded-lg text-xs text-white transition-opacity hover:opacity-80" style={{ backgroundColor: "#a3e635" }}>
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} index={i} />
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-semibold text-white mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {data?.recentOrders?.length === 0 && (
              <p className="text-xs text-white/20">No recent orders</p>
            )}
            {data?.recentOrders?.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                <div>
                  <div className="text-xs font-medium text-white">{order.orderNumber}</div>
                  <div className="text-[10px] text-white/30">{order.supplierName}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-white">EGP {order.total.toLocaleString()}</div>
                  <StatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-xl border" style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}>
          <h2 className="text-sm font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "New Order", icon: ShoppingCart, href: "/hotel/order" },
              { label: "Spend Request", icon: CreditCard, href: "/hotel/spend-requests/new" },
              { label: "Catalog", icon: Package, href: "/hotel/catalog" },
              { label: "Invoices", icon: BarChart3, href: "/hotel/invoices" },
            ].map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors"
              >
                <action.icon size={16} />
                {action.label}
                <ArrowUpRight size={14} className="ml-auto opacity-30" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
