"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Package, ShoppingCart, TrendingUp, Star,
  CreditCard, Clock, CheckCircle2, AlertTriangle,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

interface SupplierDashboardData {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  averageRating: number;
  lowStockCount: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    hotelName: string;
    createdAt: string;
  }>;
}

function KpiCard({ title, value, icon: Icon, color, index }: {
  title: string; value: string; icon: any; color: string; index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="p-5 rounded-xl border"
      style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${color}20` }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-white/30 mt-1">{title}</div>
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PENDING_APPROVAL: "#f59e0b", APPROVED: "#22c55e", REJECTED: "#ef4444",
    DELIVERED: "#3b82f6", DRAFT: "#6b7280", CONFIRMED: "#a3e635",
  };
  return (
    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${colors[status] || "#6b7280"}20`, color: colors[status] || "#6b7280" }}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default function SupplierDashboardPage() {
  const { data, loading, error, refetch } = useApi<SupplierDashboardData>("/api/v1/supplier/dashboard");

  if (loading) {
    return (
      <div className="p-6 space-y-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
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
      <div className="p-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
        <div className="p-4 rounded-xl border bg-red-500/10 text-red-300" style={{ borderColor: "rgba(239,68,68,0.2)" }}>
          <AlertTriangle size={20} className="mb-2" />
          <p className="text-sm">{error}</p>
          <button onClick={refetch} className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 transition-colors">Retry</button>
        </div>
      </div>
    );
  }

  const kpis = [
    { title: "Products", value: String(data?.totalProducts || 0), icon: Package, color: "#a3e635" },
    { title: "Total Orders", value: String(data?.totalOrders || 0), icon: ShoppingCart, color: "#3b82f6" },
    { title: "Revenue", value: `EGP ${(data?.totalRevenue || 0).toLocaleString()}`, icon: CreditCard, color: "#22c55e" },
    { title: "Rating", value: `${(data?.averageRating || 0).toFixed(1)} ★`, icon: Star, color: "#f59e0b" },
  ];

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: "#000000", minHeight: "100vh" }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Supplier Dashboard</h1>
          <p className="text-xs text-white/30 mt-1">Overview of your business</p>
        </div>
        <button onClick={refetch} className="px-3 py-1.5 rounded-lg text-xs text-white transition-opacity hover:opacity-80" style={{ backgroundColor: "#a3e635" }}>Refresh</button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={i} {...kpi} index={i} />
        ))}
      </div>

      <div className="p-5 rounded-xl border" style={{ backgroundColor: "#0a0a0a", borderColor: "rgba(255,255,255,0.06)" }}>
        <h2 className="text-sm font-semibold text-white mb-4">Recent Orders</h2>
        <div className="space-y-3">
          {data?.recentOrders?.length === 0 && <p className="text-xs text-white/20">No recent orders</p>}
          {data?.recentOrders?.slice(0, 5).map((order) => (
            <div key={order.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              <div>
                <div className="text-xs font-medium text-white">{order.orderNumber}</div>
                <div className="text-[10px] text-white/30">{order.hotelName}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-white">EGP {order.total.toLocaleString()}</div>
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
