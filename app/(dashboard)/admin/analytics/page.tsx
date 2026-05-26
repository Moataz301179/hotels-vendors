"use client";
import { useState } from "react";
import { BarChart3, TrendingUp, Users, ShoppingCart, CreditCard, AlertTriangle } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
interface AnalyticsData { totalUsers: number; totalOrders: number; totalRevenue: number; totalSuppliers: number; totalHotels: number; ordersByMonth: Array<{ month: string; count: number; revenue: number }>; topSuppliers: Array<{ name: string; orders: number; revenue: number }>; }
export default function AdminAnalyticsPage() {
  const { data, loading, error, refetch } = useApi<AnalyticsData>("/api/v1/admin/analytics");
  if (loading) return <div className="p-6 space-y-4" style={{ backgroundColor: "#050508", minHeight: "100vh" }}><div className="h-8 w-48 bg-white/5 rounded animate-pulse" /><div className="grid grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse" />)}</div></div>;
  if (error) return <div className="p-6" style={{ backgroundColor: "#050508", minHeight: "100vh" }}><div className="p-4 rounded-xl border bg-red-500/10 text-red-300" style={{ borderColor: "rgba(239,68,68,0.2)" }}><AlertTriangle size={20} className="mb-2" /><p className="text-sm">{error}</p><button onClick={refetch} className="mt-3 px-3 py-1.5 rounded-lg text-xs bg-red-500/20 hover:bg-red-500/30 transition-colors">Retry</button></div></div>;
  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: "#050508", minHeight: "100vh" }}>
      <h1 className="text-xl font-bold text-white">Analytics</h1>
      <div className="grid grid-cols-4 gap-4">
        {[{ t: "Users", v: data?.totalUsers || 0, i: Users, c: "#7c3aed" }, { t: "Orders", v: data?.totalOrders || 0, i: ShoppingCart, c: "#3b82f6" }, { t: "Revenue", v: `EGP ${(data?.totalRevenue || 0).toLocaleString()}`, i: CreditCard, c: "#22c55e" }, { t: "Suppliers", v: data?.totalSuppliers || 0, i: TrendingUp, c: "#f59e0b" }].map((k, i) => (
          <div key={i} className="p-5 rounded-xl border" style={{ backgroundColor: "#0a0a12", borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${k.c}20` }}><k.i size={20} style={{ color: k.c }} /></div>
            <div className="text-2xl font-bold text-white">{k.v}</div><div className="text-xs text-white/30 mt-1">{k.t}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "#0a0a12", borderColor: "rgba(255,255,255,0.06)" }}><h2 className="text-sm font-semibold text-white mb-4">Orders by Month</h2><div className="space-y-2">{(data?.ordersByMonth || []).map((m) => (
          <div key={m.month} className="flex items-center gap-3"><span className="text-xs text-white/30 w-16">{m.month}</span><div className="flex-1 h-2 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.05)" }}><div className="h-2 rounded-full" style={{ width: `${Math.min(100, (m.count / 50) * 100)}%`, backgroundColor: "#7c3aed" }} /></div><span className="text-xs text-white">{m.count}</span></div>
        ))}</div></div>
        <div className="p-5 rounded-xl border" style={{ backgroundColor: "#0a0a12", borderColor: "rgba(255,255,255,0.06)" }}><h2 className="text-sm font-semibold text-white mb-4">Top Suppliers</h2><div className="space-y-2">{(data?.topSuppliers || []).map((s, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(255,255,255,0.04)" }}><span className="text-xs text-white">{s.name}</span><span className="text-xs text-white/30">EGP {s.revenue.toLocaleString()}</span></div>
        ))}</div></div>
      </div>
    </div>
  );
}
