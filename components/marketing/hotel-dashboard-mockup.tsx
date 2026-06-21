"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrandLogo } from "@/components/layout/brand-logo";
import {
  Building2, ShoppingCart, Receipt, Truck, Banknote, TrendingUp, TrendingDown,
  CheckCircle2, Clock, ArrowUpRight, Search, Bell,
} from "lucide-react";

const kpiCards = [
  { label: "Open POs", value: "18", change: "+4 wk", up: true, color: "#FF6B00" },
  { label: "Pending Invoices", value: "EGP 847K", change: "12 invoices", up: false, color: "#3B82F6" },
  { label: "Active Deliveries", value: "7", change: "ETA: 2 today", up: true, color: "#D4A843" },
  { label: "Factored MTD", value: "EGP 1.2M", change: "+32% MoM", up: true, color: "#22C55E" },
];

const chartBars = [42, 58, 48, 72, 61, 78, 65, 88, 75, 92, 82, 98];
const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const activityFeed = [
  { icon: CheckCircle2, text: "PO #INVO-0421 approved — Steigenberger El Gouna", time: "12 min ago", color: "#22C55E" },
  { icon: Receipt, text: "Invoice #HV-00419 validated — ETA UUID confirmed", time: "1 hr ago", color: "#FF6B00" },
  { icon: Truck, text: "Delivery #DLV-033 arrived at Jaz Almaza Resort", time: "2 hr ago", color: "#3B82F6" },
  { icon: Banknote, text: "Settlement EGP 243K released — 24h factoring", time: "3 hr ago", color: "#D4A843" },
];

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
      <div className="absolute -inset-4 rounded-3xl blur-[60px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(132,204,22,0.06) 0%, transparent 70%)" }} />
      <div className="rounded-2xl overflow-hidden relative" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)" }}>
        {/* Title bar */}
        <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: "#0f0f0f", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#EF4444" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D4A843" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
            </div>
            <span className="text-[9px] text-white/20 ml-2 font-mono">app.hotelsvendors.com/hotel/dashboard</span>
          </div>
        </div>
        <div className="p-4">
          {/* Header — with HV logo */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: "#000000", border: "1px solid rgba(255,255,255,0.15)" }}>
                <BrandLogo size="xs" showText={false} />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-white">Hotel Dashboard</h3>
                <p className="text-[9px] text-white/25">Steigenberger Resort El Gouna</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 rounded-md flex items-center gap-1 px-2" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Search size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
                <span className="text-[8px] text-white/15">Search POs...</span>
              </div>
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Bell size={10} style={{ color: "rgba(255,255,255,0.25)" }} />
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(132,204,22,0.15)" }}>
                <span className="text-[7px]" style={{ color: "#FF6B00", fontWeight: 700 }}>AM</span>
              </div>
            </div>
          </div>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {kpiCards.map((kpi) => (
              <div key={kpi.label} className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-white/30">{kpi.label}</span>
                  {kpi.up ? <TrendingUp size={8} style={{ color: "#22C55E" }} /> : <TrendingDown size={8} style={{ color: "#EF4444" }} />}
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[14px] font-bold text-white">{kpi.value}</span>
                  <span className="text-[8px]" style={{ color: kpi.up ? "#22C55E" : "#EF4444" }}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Chart + Activity */}
          <div className="grid grid-cols-5 gap-3">
            <div className="col-span-3 rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] font-medium text-white/40">Procurement Spend (YoY)</span>
                <div className="flex items-center gap-1"><span className="text-[8px]" style={{ color: "#22C55E" }}>+18.2%</span><ArrowUpRight size={8} style={{ color: "#22C55E" }} /></div>
              </div>
              <div className="flex items-end gap-[3px] h-12">
                {chartBars.map((h, i) => (
                  <div key={i} className="flex-1 rounded-t-sm transition-all duration-300 hover:opacity-100" style={{ height: `${h}%`, backgroundColor: i === chartBars.length - 1 ? "#FF6B00" : "rgba(132,204,22,0.12)", opacity: i === chartBars.length - 1 ? 1 : 0.6 }} />
                ))}
              </div>
              <div className="flex justify-between mt-1.5">
                {chartLabels.filter((_, i) => i % 3 === 0).map((label) => (<span key={label} className="text-[6px] text-white/15">{label}</span>))}
              </div>
            </div>
            <div className="col-span-2 rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
              <span className="text-[9px] font-medium text-white/40 block mb-2">Activity Feed</span>
              <div className="space-y-2">
                {activityFeed.map((item, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <item.icon size={8} className="mt-0.5 flex-shrink-0" style={{ color: item.color }} />
                    <div className="min-w-0">
                      <p className="text-[7px] text-white/60 leading-tight">{item.text}</p>
                      <p className="text-[6px] text-white/20">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Pipeline */}
          <div className="mt-3 rounded-lg p-2.5 flex items-center justify-between" style={{ backgroundColor: "rgba(132,204,22,0.03)", border: "1px solid rgba(132,204,22,0.06)" }}>
            <div className="flex items-center gap-3">
              {[{ label: "Forecast", status: "done" }, { label: "PO Sent", status: "done" }, { label: "Invoice", status: "active" }, { label: "Delivery", status: "pending" }, { label: "Settled", status: "pending" }].map((step, i) => (
                <div key={step.label} className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: step.status === "done" ? "#22C55E" : step.status === "active" ? "#FF6B00" : "rgba(255,255,255,0.1)" }} />
                  <span className="text-[7px]" style={{ color: step.status === "done" ? "rgba(255,255,255,0.4)" : step.status === "active" ? "#FF6B00" : "rgba(255,255,255,0.15)" }}>{step.label}</span>
                  {i < 4 && <div className="w-3 h-px" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />}
                </div>
              ))}
            </div>
            <span className="text-[7px] font-medium" style={{ color: "#FF6B00" }}>PO #INVO-0421</span>
          </div>
        </div>
      </div>
      {/* Honest label — not "Live" */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, duration: 0.5 }} className="absolute -bottom-3 -right-2 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(132,204,22,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
        <span className="text-[8px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Illustrative Preview</span>
      </motion.div>
    </motion.div>
  );
}
