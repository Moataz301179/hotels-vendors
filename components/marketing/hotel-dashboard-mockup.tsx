"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Building2, ShoppingCart, Receipt, Truck, Banknote, TrendingUp, TrendingDown,
  CheckCircle2, Clock, AlertCircle, ArrowUpRight, Search, Bell,
} from "lucide-react";

const kpiCards = [
  { label: "Open POs", value: "24", change: "+3", up: true, color: "var(--success)" },
  { label: "Pending Invoices", value: "8", change: "-2", up: false, color: "var(--info)" },
  { label: "Active Deliveries", value: "12", change: "+5", up: true, color: "var(--orange-base)" },
  { label: "Factored This Month", value: "EGP 180K", change: "+12%", up: true, color: "var(--success)" },
];

const recentActivity = [
  { icon: CheckCircle2, text: "PO-2024-0892 approved", time: "2m ago", color: "var(--success)" },
  { icon: Clock, text: "Invoice #INV-4451 pending ETA", time: "8m ago", color: "var(--orange-base)" },
  { icon: Truck, text: "Shipment SH-009 in transit", time: "15m ago", color: "var(--info)" },
  { icon: AlertCircle, text: "Budget alert: F&B > 85%", time: "32m ago", color: "var(--error)" },
];

const chartBars = [35, 52, 45, 68, 55, 72, 60, 85, 70, 90, 78, 95];
const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function HotelDashboardMockup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40, scale: 0.92 }}
      animate={isInView ? { opacity: 1, x: 0, scale: 1 } : {}}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative"
    >
      <div className="absolute -inset-4 rounded-3xl blur-[60px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(var(--success-rgb),0.06) 0%, transparent 70%)" }} />
      <div className="rounded-2xl overflow-hidden relative" style={{ backgroundColor: "var(--surface)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)" }}>
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: "var(--surface-1)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--error)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--orange-base)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />
            </div>
            <span className="text-[9px] text-white/20 ml-2 font-mono">app.hotelsvendors.com/hotel/dashboard</span>
          </div>
        </div>
        <div className="p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[13px] font-semibold text-white">Hotel Dashboard</h3>
              <p className="text-[9px] text-white/25">Stella Di Mare Resort · Sharm El-Sheikh</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 rounded-md flex items-center gap-1 px-2" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Search size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
                <span className="text-[8px] text-white/15">Search...</span>
              </div>
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Bell size={10} style={{ color: "rgba(255,255,255,0.25)" }} />
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(var(--success-rgb),0.15)" }}>
                <span className="text-[7px]" style={{ color: "var(--success)", fontWeight: 700 }}>AM</span>
              </div>
            </div>
          </div>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {kpiCards.map((kpi) => (
              <div key={kpi.label} className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-white/30">{kpi.label}</span>
                  {kpi.up ? <TrendingUp size={8} style={{ color: "var(--success)" }} /> : <TrendingDown size={8} style={{ color: "var(--error)" }} />}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[14px] font-bold text-white">{kpi.value}</span>
                  <span className="text-[8px]" style={{ color: kpi.up ? "var(--success)" : "var(--error)" }}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Chart + Activity */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-medium text-white/40">Procurement Spend</span>
                <div className="flex items-center gap-1"><span className="text-[8px]" style={{ color: "var(--success)" }}>+18.2%</span><ArrowUpRight size={8} style={{ color: "var(--success)" }} /></div>
              </div>
              <div className="flex items-end gap-[3px] h-12">
                {chartBars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, backgroundColor: i === chartBars.length - 1 ? "var(--success)" : "rgba(var(--success-rgb),0.12)" }} />
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {chartLabels.filter((_, i) => i % 3 === 0).map((label) => (<span key={label} className="text-[6px] text-white/15">{label}</span>))}
              </div>
            </div>
            <div className="col-span-2 rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[9px] font-medium text-white/40 block mb-2">Activity</span>
              <div className="space-y-2">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <item.icon size={8} className="mt-0.5 flex-shrink-0" style={{ color: item.color }} />
                    <div className="min-w-0">
                      <p className="text-[7px] text-white/40 leading-tight truncate">{item.text}</p>
                      <p className="text-[6px] text-white/15">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Pipeline */}
          <div className="mt-3 rounded-lg p-2.5 flex items-center justify-between" style={{ backgroundColor: "rgba(var(--success-rgb),0.03)", border: "1px solid rgba(var(--success-rgb),0.06)" }}>
            <div className="flex items-center gap-3">
              {[{ label: "Forecast", status: "done" }, { label: "PO Sent", status: "done" }, { label: "Invoice", status: "active" }, { label: "Delivery", status: "pending" }, { label: "Settled", status: "pending" }].map((step, i) => (
                <div key={step.label} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.status === "done" ? "var(--success)" : step.status === "active" ? "var(--success)" : "rgba(255,255,255,0.1)" }} />
                  <span className="text-[7px]" style={{ color: step.status === "done" ? "rgba(255,255,255,0.4)" : step.status === "active" ? "var(--success)" : "rgba(255,255,255,0.15)" }}>{step.label}</span>
                  {i < 4 && <div className="w-3 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />}
                </div>
              ))}
            </div>
            <span className="text-[7px] font-medium" style={{ color: "var(--success)" }}>PO-2024-0892</span>
          </div>
        </div>
      </div>
      {/* Floating badge */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, duration: 0.5 }} className="absolute -bottom-3 -right-2 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: "var(--surface-1)", border: "1px solid rgba(var(--success-rgb),0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--success)" }} />
        <span className="text-[8px] font-medium" style={{ color: "var(--success)" }}>Live · ETA Connected</span>
      </motion.div>
    </motion.div>
  );
}
