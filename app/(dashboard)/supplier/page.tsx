"use client";

import Link from "next/link";
import {
  Package,
  TrendingUp,
  Star,
  Truck,
  Receipt,
  AlertCircle,
  ArrowRight,
  Search,
  Bell,
  BarChart3,
  Store,
  Plus,
} from "lucide-react";
import { motion } from "framer-motion";

const STATS = [
  { label: "Active Orders", value: 28, change: "+5", icon: Package, color: "#3b82f6" },
  { label: "Monthly Revenue", value: "156K EGP", change: "+18%", icon: Receipt, color: "#10b981" },
  { label: "Rating", value: "4.8", change: "Top 5%", icon: Star, color: "#f59e0b" },
  { label: "On-Time Delivery", value: "96%", change: "+2%", icon: Truck, color: "#8b5cf6" },
];

const INCOMING_ORDERS = [
  { id: "PO-2026-0042", hotel: "Steigenberger Nile Palace", items: 8, total: "12,400 EGP", status: "New", date: "2m ago" },
  { id: "PO-2026-0041", hotel: "Jaz Aquamarine", items: 24, total: "8,200 EGP", status: "Processing", date: "1h ago" },
  { id: "PO-2026-0040", hotel: "Sunrise Arabian Beach", items: 5, total: "3,150 EGP", status: "Ready to Ship", date: "3h ago" },
  { id: "PO-2026-0039", hotel: "Pickalbatros Palace", items: 15, total: "6,800 EGP", status: "In Transit", date: "5h ago" },
];

const TOP_PRODUCTS = [
  { name: "Egyptian Cotton Bed Sheets", orders: 156, revenue: "78K EGP" },
  { name: "Premium Olive Oil (5L)", orders: 89, revenue: "44K EGP" },
  { name: "Industrial Dishwasher Soap", orders: 67, revenue: "22K EGP" },
  { name: "SPA Bath Amenities Set", orders: 45, revenue: "18K EGP" },
];

const QUICK_ACTIONS = [
  { label: "Manage Inventory", desc: "Update stock levels", icon: Store, to: "/supplier", color: "#3b82f6" },
  { label: "View Orders", desc: "Process incoming", icon: Package, to: "/supplier", color: "#10b981" },
  { label: "Add Product", desc: "List new SKU", icon: Plus, to: "/supplier", color: "#f59e0b" },
  { label: "Analytics", desc: "Performance insights", icon: BarChart3, to: "/supplier", color: "#8b5cf6" },
];

export default function SupplierDashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight">Supplier Central</h1>
            <p className="text-[13px] text-white/40 mt-1">Manage inventory, orders, and grow your hospitality business</p>
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
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${stat.color}15` }}>
                  <stat.icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
                </div>
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#10b98115] text-[#10b981]">
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
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: `${action.color}15` }}>
                    <action.icon className="w-4.5 h-4.5" style={{ color: action.color }} />
                  </div>
                  <div className="text-[13px] font-semibold text-white">{action.label}</div>
                  <div className="text-[11px] text-white/30 mt-0.5">{action.desc}</div>
                </Link>
              ))}
            </div>

            {/* Incoming Orders */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden">
              <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between">
                <h2 className="text-[14px] font-semibold text-white">Incoming Orders</h2>
                <Link href="/supplier" className="text-[12px] text-[#e11d48] hover:text-[#be123c] flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {INCOMING_ORDERS.map((order) => (
                  <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.04] flex items-center justify-center">
                        <Package className="w-4.5 h-4.5 text-white/30" />
                      </div>
                      <div>
                        <div className="text-[13px] font-medium text-white">{order.id}</div>
                        <div className="text-[12px] text-white/30">{order.hotel} · {order.items} items</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-medium text-white">{order.total}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full ${
                          order.status === "New" ? "bg-[#e11d48]15 text-[#e11d48]" :
                          order.status === "Ready to Ship" ? "bg-[#10b981]15 text-[#10b981]" :
                          order.status === "Processing" ? "bg-[#f59e0b]15 text-[#f59e0b]" :
                          "bg-[#3b82f6]15 text-[#3b82f6]"
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
            {/* Top Products */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] overflow-hidden">
              <div className="px-5 py-4 border-b border-white/[0.06]">
                <h2 className="text-[14px] font-semibold text-white">Top Products</h2>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {TOP_PRODUCTS.map((product, i) => (
                  <div key={product.name} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center text-[11px] font-bold text-white/30">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-white truncate">{product.name}</div>
                      <div className="text-[11px] text-white/30">{product.orders} orders</div>
                    </div>
                    <div className="text-[13px] font-medium text-[#10b981]">{product.revenue}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Card */}
            <div className="rounded-2xl bg-[#0f0f0f] border border-white/[0.06] p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-4 h-4 text-[#10b981]" />
                <h2 className="text-[14px] font-semibold text-white">Growth This Month</h2>
              </div>
              <div className="text-[32px] font-bold text-white">+24%</div>
              <div className="text-[12px] text-white/40 mt-1">vs last month</div>
              <div className="mt-4 h-16 flex items-end gap-1">
                {[40, 55, 45, 70, 60, 80, 75, 90, 85, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${h}%`,
                      backgroundColor: i === 9 ? "#10b981" : "#10b98130",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
