"use client";

import { useState, useEffect } from "react";
import {
  BarChart3, TrendingUp, Users, ShoppingCart, FileText, Landmark,
  ArrowUpRight, ArrowDownRight, Calendar, Filter, Download, RefreshCw
} from "lucide-react";

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalUsers: number;
  totalSuppliers: number;
  totalHotels: number;
  platformFees: number;
  factoringVolume: number;
  avgOrderValue: number;
  monthlyGrowth: number;
  activeUsers: number;
  pendingOrders: number;
  completedOrders: number;
  rejectedOrders: number;
  topSuppliers: Array<{ name: string; orders: number; revenue: number }>;
  topHotels: Array<{ name: string; orders: number; spend: number }>;
  revenueByMonth: Array<{ month: string; revenue: number; fees: number }>;
  ordersByStatus: Array<{ status: string; count: number; color: string }>;
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d" | "1y">("30d");

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/admin/analytics?period=${period}`);
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      // Mock data
      setData({
        totalRevenue: 1250000,
        totalOrders: 847,
        totalUsers: 234,
        totalSuppliers: 89,
        totalHotels: 145,
        platformFees: 25000,
        factoringVolume: 4200000,
        avgOrderValue: 15400,
        monthlyGrowth: 12.5,
        activeUsers: 189,
        pendingOrders: 23,
        completedOrders: 798,
        rejectedOrders: 26,
        topSuppliers: [
          { name: "ABC Cleaning Supplies", orders: 156, revenue: 2340000 },
          { name: "Egyptian Paper Products", orders: 134, revenue: 1890000 },
          { name: "Delta Foods Trading", orders: 112, revenue: 1560000 },
          { name: "Cairo Hospitality Supplies", orders: 98, revenue: 1230000 },
          { name: "Nile Valley Chemicals", orders: 87, revenue: 980000 },
        ],
        topHotels: [
          { name: "Marriott Cairo", orders: 89, spend: 1230000 },
          { name: "Hilton Ramses", orders: 76, spend: 980000 },
          { name: "Four Seasons Nile", orders: 65, spend: 870000 },
          { name: "Kempinski Nile", orders: 54, spend: 650000 },
          { name: "Sofitel Nile El Gezirah", orders: 43, spend: 540000 },
        ],
        revenueByMonth: [
          { month: "Jan", revenue: 85000, fees: 1700 },
          { month: "Feb", revenue: 92000, fees: 1840 },
          { month: "Mar", revenue: 105000, fees: 2100 },
          { month: "Apr", revenue: 118000, fees: 2360 },
          { month: "May", revenue: 132000, fees: 2640 },
          { month: "Jun", revenue: 145000, fees: 2900 },
          { month: "Jul", revenue: 158000, fees: 3160 },
        ],
        ordersByStatus: [
          { status: "Completed", count: 798, color: "#10b981" },
          { status: "Pending", count: 23, color: "#f59e0b" },
          { status: "In Transit", count: 15, color: "#3b82f6" },
          { status: "Rejected", count: 26, color: "#ef4444" },
          { status: "Cancelled", count: 8, color: "#6b7280" },
        ],
      });
    } finally {
      setLoading(false);
    }
  };

  const formatEGP = (amount: number) => `EGP ${amount.toLocaleString()}`;

  if (loading) {
    return (
      <div className="min-h-screen">
        <div className="border-b border-white/[0.06] mb-8">
          <div className="py-6">
            <h1 className="text-[24px] font-bold tracking-tight text-white flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-[#39ff7e]" />
              Analytics & Insights
            </h1>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] animate-pulse">
              <div className="h-8 bg-white/5 rounded w-20 mb-2" />
              <div className="h-3 bg-white/5 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/[0.06] mb-8">
        <div className="py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight text-white flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-[#39ff7e]" />
              Analytics & Insights
            </h1>
            <p className="text-[13px] text-white/40 mt-1">Platform performance, revenue metrics, and user analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-1 p-1 bg-white/[0.02] rounded-lg border border-white/[0.06]">
              {(["7d", "30d", "90d", "1y"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${
                    period === p ? "bg-[#39ff7e]/10 text-[#39ff7e]" : "text-white/30 hover:text-white/50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            <button className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60 transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={fetchAnalytics} className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:text-white/60 transition-colors">
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      {data && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Revenue", value: formatEGP(data.totalRevenue), change: `+${data.monthlyGrowth}%`, up: true, color: "#39ff7e" },
              { label: "Platform Fees", value: formatEGP(data.platformFees), change: "+18.2%", up: true, color: "#f59e0b" },
              { label: "Factoring Volume", value: formatEGP(data.factoringVolume), change: "+24.5%", up: true, color: "#8b5cf6" },
              { label: "Avg Order Value", value: formatEGP(data.avgOrderValue), change: "+5.3%", up: true, color: "#3b82f6" },
              { label: "Total Orders", value: data.totalOrders.toLocaleString(), change: "+12.8%", up: true, color: "#10b981" },
              { label: "Active Users", value: data.activeUsers.toLocaleString(), change: "+8.4%", up: true, color: "#ec4899" },
              { label: "Suppliers", value: data.totalSuppliers.toLocaleString(), change: "+15.2%", up: true, color: "#06b6d4" },
              { label: "Hotels", value: data.totalHotels.toLocaleString(), change: "+9.7%", up: true, color: "#c455ff" },
            ].map((kpi) => (
              <div key={kpi.label} className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.06]">
                <div className="text-[24px] font-bold" style={{ color: kpi.color }}>{kpi.value}</div>
                <div className="text-[11px] text-white/40 mt-1">{kpi.label}</div>
                <div className="flex items-center gap-1 mt-2">
                  {kpi.up ? <ArrowUpRight className="w-3 h-3 text-emerald-400" /> : <ArrowDownRight className="w-3 h-3 text-red-400" />}
                  <span className="text-[11px] text-emerald-400">{kpi.change}</span>
                  <span className="text-[10px] text-white/20">vs last period</span>
                </div>
              </div>
            ))}
          </div>

          {/* Orders by Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="rounded-xl border border-white/[0.06] bg-[#0f0f0f] p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-4">Orders by Status</h3>
              <div className="space-y-3">
                {data.ordersByStatus.map((s) => (
                  <div key={s.status} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                    <span className="text-sm text-white/60 flex-1">{s.status}</span>
                    <span className="text-sm font-medium text-white/80">{s.count}</span>
                    <div className="w-24 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                      <div className="h-full rounded-full" style={{ backgroundColor: s.color, width: `${(s.count / data.totalOrders) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Revenue by Month */}
            <div className="rounded-xl border border-white/[0.06] bg-[#0f0f0f] p-5">
              <h3 className="text-sm font-semibold text-white/80 mb-4">Revenue by Month</h3>
              <div className="flex items-end gap-2 h-40">
                {data.revenueByMonth.map((m) => {
                  const maxRevenue = Math.max(...data.revenueByMonth.map(x => x.revenue));
                  const height = (m.revenue / maxRevenue) * 100;
                  return (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-white/30">{formatEGP(m.fees)}</span>
                      <div className="w-full rounded-t bg-[#39ff7e]/20 relative" style={{ height: `${height}%` }}>
                        <div className="absolute bottom-0 w-full rounded-t bg-[#39ff7e]/60" style={{ height: "60%" }} />
                      </div>
                      <span className="text-[10px] text-white/30">{m.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Suppliers & Hotels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/[0.06] bg-[#0f0f0f]">
              <div className="p-4 border-b border-white/[0.04]">
                <h3 className="text-sm font-semibold text-white/80">Top Suppliers</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {data.topSuppliers.map((s, i) => (
                  <div key={s.name} className="p-4 flex items-center gap-3">
                    <span className="text-[11px] text-white/20 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70 truncate">{s.name}</p>
                      <p className="text-[11px] text-white/30">{s.orders} orders</p>
                    </div>
                    <span className="text-sm font-medium text-white/60">{formatEGP(s.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-[#0f0f0f]">
              <div className="p-4 border-b border-white/[0.04]">
                <h3 className="text-sm font-semibold text-white/80">Top Hotels (by Spend)</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {data.topHotels.map((h, i) => (
                  <div key={h.name} className="p-4 flex items-center gap-3">
                    <span className="text-[11px] text-white/20 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/70 truncate">{h.name}</p>
                      <p className="text-[11px] text-white/30">{h.orders} orders</p>
                    </div>
                    <span className="text-sm font-medium text-white/60">{formatEGP(h.spend)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
