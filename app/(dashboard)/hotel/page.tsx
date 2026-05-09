"use client";

import Link from "next/link";
import {
  ShoppingCart,
  Package,
  Truck,
  Receipt,
  TrendingDown,
  Clock,
  AlertCircle,
  ArrowRight,
  Search,
  Bell,
  BarChart3,
  Store,
} from "lucide-react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Active Orders", value: 12, change: "+3", icon: Package, color: "#3b82f6" },
  { label: "Monthly Spend", value: "284K EGP", change: "-12%", icon: Receipt, color: "#10b981" },
  { label: "Pending Approval", value: 4, change: "2 urgent", icon: AlertCircle, color: "#f59e0b" },
  { label: "Avg Delivery", value: "36h", change: "-8h", icon: Truck, color: "#8b5cf6" },
];

const RECENT_ORDERS = [
  { id: "PO-2026-0042", supplier: "Nile Fresh Foods", items: 8, total: "12,400 EGP", status: "In Transit", date: "2h ago" },
  { id: "PO-2026-0041", supplier: "Delta Linens", items: 24, total: "8,200 EGP", status: "Delivered", date: "1d ago" },
  { id: "PO-2026-0040", supplier: "Cairo Chemicals", items: 5, total: "3,150 EGP", status: "Pending Approval", date: "3h ago" },
  { id: "PO-2026-0039", supplier: "Red Sea Produce", items: 15, total: "6,800 EGP", status: "Processing", date: "5h ago" },
];

const LOW_STOCK = [
  { product: "Bath Towels (Terry)", current: 12, min: 50, supplier: "Delta Linens" },
  { product: "Dishwasher Detergent", current: 8, min: 20, supplier: "Cairo Chemicals" },
  { product: "Olive Oil (5L)", current: 3, min: 15, supplier: "Nile Fresh Foods" },
];

const QUICK_ACTIONS = [
  { label: "Browse Marketplace", desc: "50+ categories", icon: Store, to: "/hotel/catalog", color: "#3b82f6" },
  { label: "Create Order", desc: "Quick procurement", icon: ShoppingCart, to: "/hotel/order", color: "#10b981" },
  { label: "Track Shipments", desc: "Live delivery map", icon: Truck, to: "/shipping", color: "#f59e0b" },
  { label: "Spend Analytics", desc: "Cost insights", icon: BarChart3, to: "/hotel", color: "#8b5cf6" },
];

export default function HotelDashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight">Hotel Procurement Portal</h1>
            <p className="text-[13px] text-white/40 mt-1">Welcome back — here's what's happening across your properties</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder="Search orders, products..."
                className="pl-10 pr-4 py-2.5 w-64 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[13px] text-white placeholder:text-white/20 outline-none focus:border-white/[0.12] transition-all"
              />
            </div>
            <button className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e11d48]" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {STATS.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.06]"
            >
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
                </div>
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: stat.change.includes("-") ? "#10b98115" : "#f59e0b15",
                    color: stat.change.includes("-") ? "#10b981" : "#f59e0b",
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <div className="text-[24px] font-bold text-white">{stat.value}</div>
              <div className="text-[12px] text-white/40 mt-0.5">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.to}
                  className="group p-4 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] hover:border-white/[0.12] transition-all"
                >
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                    style={{ backgroundColor: `${action.color}15` }}
                  >
                    <action.icon className="w-4.5 h-4.5" style={{ color: action.color }} />
                  </div>
                  <div className="text-[13px] font-semibold text-white">{action.label}</div>
                  <div className="text-[11px] text-white/30 mt-0.5">{action.desc}</div>
                </Link>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-white">Recent Orders</h2>
                <Link href="/hotel/order" className="text-[12px] text-[#e11d48] hover:text-[#be123c] flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {RECENT_ORDERS.map((order) => (
                  <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                        <Package className="w-4.5 h-4.5 text-white/30" />
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-white">{order.id}</div>
                        <div className="text-[12px] text-white/30">{order.supplier} · {order.items} items</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-medium text-white">{order.total}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                          order.status === "Delivered" ? "bg-[#10b98115] text-[#10b981]" :
                          order.status === "In Transit" ? "bg-[#3b82f615] text-[#3b82f6]" :
                          order.status === "Pending Approval" ? "bg-[#f59e0b15] text-[#f59e0b]" :
                          "bg-white/[0.04] text-white/40"
                        }`}>
                          {order.status}
                        </span>
                        <span className="text-[11px] text-white/20">{order.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Low Stock Alerts */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h2 className="text-[14px] font-semibold text-white flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-[#f59e0b]" />
                  Low Stock Alerts
                </h2>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {LOW_STOCK.map((item) => (
                  <div key={item.product} className="px-5 py-3">
                    <div className="text-[13px] font-medium text-white">{item.product}</div>
                    <div className="text-[11px] text-white/30 mt-0.5">{item.supplier}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#f59e0b]"
                          style={{ width: `${(item.current / item.min) * 100}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-white/40">{item.current}/{item.min}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-white/[0.06]">
                <Link href="/hotel/catalog" className="text-[12px] text-[#e11d48] hover:text-[#be123c] flex items-center justify-center gap-1">
                  Restock Now <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Savings Card */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingDown className="w-4 h-4 text-[#10b981]" />
                <h2 className="text-[14px] font-semibold text-white">This Month's Savings</h2>
              </div>
              <div className="text-[32px] font-bold text-white">42,800 EGP</div>
              <div className="text-[12px] text-white/40 mt-1">Compared to offline procurement</div>
              <div className="mt-4 flex items-center gap-2 text-[12px] text-[#10b981]">
                <Clock className="w-3.5 h-3.5" />
                Updated 2 hours ago
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
