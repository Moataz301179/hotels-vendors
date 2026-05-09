"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  ShieldCheck,
  Wallet,
  Users,
  Brain,
  Truck,
  CalendarClock,
  ScanBarcode,
  Store,
  BarChart3,
  ArrowRight,
  Settings,
  MapPin,
  PieChart,
  Bell,
} from "lucide-react";
import { motion } from "framer-motion";

const MODULES = [
  {
    group: "Operations",
    items: [
      { label: "Procurement Dashboard", desc: "Inventory alerts, consumption trends & restock predictions", icon: LayoutDashboard, to: "/admin", color: "#3b82f6" },
      { label: "Approval Matrix", desc: "AI-driven PO evaluation, CFO overrides & payment triggers", icon: ShieldCheck, to: "/admin/suppliers/pipeline", color: "#8b5cf6" },
      { label: "Bulk Scheduler", desc: "Recurring procurement orders & automated supply runs", icon: CalendarClock, to: "/admin", color: "#06b6d4" },
      { label: "Dock Receiving", desc: "Barcode-scan incoming shipments & log discrepancies", icon: ScanBarcode, to: "/admin", color: "#10b981" },
    ],
  },
  {
    group: "Finance & Compliance",
    items: [
      { label: "Finance & Liquidity", desc: "Credit facilities, factoring pipeline & PO-ETA reconciliation", icon: Wallet, to: "/factoring", color: "#f59e0b" },
      { label: "Shipment Tracking", desc: "Live logistics map, delay alerts & damage reports", icon: Truck, to: "/shipping", color: "#ef4444" },
      { label: "Logistics Command", desc: "Command center with delay thresholds, KPIs & live map", icon: MapPin, to: "/shipping", color: "#ec4899" },
    ],
  },
  {
    group: "Supplier & Demand Intelligence",
    items: [
      { label: "Supplier Insights", desc: "Vendor scorecards, delivery performance & risk ratings", icon: Users, to: "/supplier", color: "#6366f1" },
      { label: "Demand Forecast", desc: "AI-powered category predictions & pre-order recommendations", icon: Brain, to: "/admin", color: "#14b8a6" },
    ],
  },
];

const QUICK_STATS = [
  { label: "Pending Approvals", value: 12, color: "#f59e0b" },
  { label: "Active Orders", value: 48, color: "#3b82f6" },
  { label: "ETA Invoices", value: 156, color: "#10b981" },
  { label: "Credit Lines", value: 8, color: "#8b5cf6" },
];

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06]">
        <div className="mx-auto max-w-7xl px-6 py-6 flex items-center justify-between">
          <div>
            <h1 className="text-[24px] font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-[13px] text-white/40 mt-1">Mission Control — Overview of all platform operations</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06] text-white/50 hover:text-white hover:bg-white/[0.08] transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#e11d48]" />
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

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {QUICK_STATS.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl bg-[#0f0f0f] border border-white/[0.06]"
            >
              <div className="text-[32px] font-bold text-white" style={{ color: stat.color }}>
                {stat.value}
              </div>
              <div className="text-[12px] text-white/40 mt-1">{stat.label}</div>
            </motion.div>
          ))}
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

        {/* Bottom CTA */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0f0f0f] border border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-[16px] font-semibold text-white">Need to dive deeper?</h3>
            <p className="text-[13px] text-white/40 mt-1">Access the Swarm Mission Control or OpenClaw automation panel.</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/admin/swarm"
              className="px-5 py-2.5 bg-[#e11d48] hover:bg-[#be123c] text-white text-[13px] font-semibold rounded-lg transition-colors"
            >
              Swarm Control
            </Link>
            <Link
              href="/admin/openclaw"
              className="px-5 py-2.5 border border-white/20 text-white text-[13px] font-medium rounded-lg hover:bg-white/5 transition-colors"
            >
              OpenClaw
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
