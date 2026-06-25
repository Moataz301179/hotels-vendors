"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrandLogo } from "@/components/layout/brand-logo";
import {
  Truck, Package, MapPin, Banknote, TrendingUp, CheckCircle2,
  Clock, ArrowUpRight, Search, Bell, Navigation,
} from "lucide-react";

const kpiCards = [
  { label: "Active Loads", value: "12", change: "3 new today", up: true, color: "#D4A843" },
  { label: "Truck Utilization", value: "87%", change: "+12% MoM", up: true, color: "var(--accent-base)" },
  { label: "On-Time Rate", value: "94%", change: "+2.1%", up: true, color: "#22C55E" },
  { label: "Deliveries/Wk", value: "47", change: "Target: 45", up: true, color: "#3B82F6" },
];

const routes = [
  { id: "RT-021", from: "Cairo Hub", to: "Hurghada Corridor", load: "4 suppliers", eta: "22:15", status: "Active", color: "#22C55E" },
  { id: "RT-022", from: "Alex Hub", to: "North Coast", load: "3 suppliers", eta: "16:30", status: "Loading", color: "#3B82F6" },
  { id: "RT-023", from: "Suez Hub", to: "Sharm El Sheikh", load: "5 suppliers", eta: "05:30", status: "Scheduled", color: "#D4A843" },
];

export function LogisticsDashboardMockup() {
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
      <div className="absolute -inset-4 rounded-3xl blur-[60px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(212,168,67,0.06) 0%, transparent 70%)" }} />
      <div className="rounded-2xl overflow-hidden relative" style={{ backgroundColor: "var(--background)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)" }}>
        <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: "var(--foreground)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#EF4444" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D4A843" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
            </div>
            <span className="text-[9px] text-white/20 ml-2 font-mono">app.hotelsvendors.com/logistics</span>
          </div>
        </div>
        <div className="p-4">
          {/* Header — with HV logo */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden" style={{ backgroundColor: "var(--background)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <BrandLogo size="xs" showText={false} />
              </div>
              <div>
                <h3 className="text-[13px] font-semibold text-white">Logistics Control</h3>
                <p className="text-[9px] text-white/25">Red Sea Fleet · GPS Active</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 rounded-md flex items-center gap-1 px-2" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Search size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
                <span className="text-[8px] text-white/15">Search routes...</span>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(212,168,67,0.15)" }}>
                <span className="text-[7px]" style={{ color: "#D4A843", fontWeight: 700 }}>RF</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {kpiCards.map((kpi) => (
              <div key={kpi.label} className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-white/30">{kpi.label}</span>
                  <TrendingUp size={8} style={{ color: "#22C55E" }} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[14px] font-bold text-white">{kpi.value}</span>
                  <span className="text-[8px]" style={{ color: "#22C55E" }}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Active Routes */}
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[9px] font-medium text-white/40">Active Routes</span>
              <span className="text-[8px]" style={{ color: "#D4A843" }}>GPS Tracking</span>
            </div>
            <div className="space-y-1.5">
              {routes.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-2 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <Navigation size={8} style={{ color: route.color }} />
                    <div className="min-w-0">
                      <p className="text-[8px] text-white/50 font-medium">{route.id} · {route.load}</p>
                      <p className="text-[7px] text-white/25">{route.from} → {route.to}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-[7px] font-medium" style={{ color: route.color }}>{route.status}</p>
                    <p className="text-[6px] text-white/15">ETA {route.eta}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Payment bar */}
          <div className="mt-3 rounded-lg p-2.5 flex items-center justify-between" style={{ backgroundColor: "rgba(212,168,67,0.03)", border: "1px solid rgba(212,168,67,0.06)" }}>
            <div className="flex items-center gap-2">
              <Banknote size={10} style={{ color: "#D4A843" }} />
              <span className="text-[8px] text-white/50">EGP 18,420 released — 3 hours post-POD</span>
            </div>
            <span className="text-[7px] font-medium" style={{ color: "#D4A843" }}>Auto-settlement</span>
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, duration: 0.5 }} className="absolute -bottom-3 -right-2 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: "var(--foreground)", border: "1px solid rgba(212,168,67,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
        <span className="text-[8px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Illustrative Preview</span>
      </motion.div>
    </motion.div>
  );
}
