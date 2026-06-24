"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrandLogo } from "@/components/layout/brand-logo";
import {
  Landmark, Receipt, Banknote, Shield, TrendingUp, CheckCircle2,
  Clock, ArrowUpRight, Search, Bell, TrendingDown,
} from "lucide-react";

const kpiCards = [
  { label: "Pool Size", value: "EGP 8.2M", change: "37 invoices", up: true, color: "#3B82F6" },
  { label: "Active Bids", value: "3", change: "2 new today", up: true, color: "var(--accent-base)" },
  { label: "Avg Return", value: "14.2%", change: "APR", up: true, color: "#22C55E" },
  { label: "Risk Score", value: "24/100", change: "Low avg", up: true, color: "#D4A843" },
];

const invoices = [
  { id: "INV-00421", hotel: "Steigenberger", amount: "EGP 247.8K", risk: "Low", return: "14.2%", status: "Open", color: "#22C55E" },
  { id: "INV-00419", hotel: "Jaz Almaza", amount: "EGP 312.5K", risk: "Low", return: "13.8%", status: "Open", color: "#22C55E" },
  { id: "INV-00418", hotel: "Movenpick", amount: "EGP 189.2K", risk: "Medium", return: "16.5%", status: "Bidding", color: "#D4A843" },
  { id: "INV-00417", hotel: "Hilton Pyramids", amount: "EGP 456.0K", risk: "Medium", return: "15.1%", status: "Open", color: "#D4A843" },
];

export function FunderDashboardMockup() {
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
      <div className="absolute -inset-4 rounded-3xl blur-[60px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(59,130,246,0.06) 0%, transparent 70%)" }} />
      <div className="rounded-2xl overflow-hidden relative" style={{ backgroundColor: "#0B0F17", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)" }}>
        <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: "#0f0f0f", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#EF4444" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D4A843" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
            </div>
            <span className="text-[9px] text-white/20 ml-2 font-mono">app.hotelsvendors.com/funder</span>
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
                <h3 className="text-[13px] font-semibold text-white">Funder Portal</h3>
                <p className="text-[9px] text-white/25">CIB Capital · ETA-Verified Pool</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 rounded-md flex items-center gap-1 px-2" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Search size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
                <span className="text-[8px] text-white/15">Search pool...</span>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(59,130,246,0.15)" }}>
                <span className="text-[7px]" style={{ color: "#3B82F6", fontWeight: 700 }}>CB</span>
              </div>
            </div>
          </div>
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
          {/* Invoice Pool */}
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[9px] font-medium text-white/40">Available Invoice Pool</span>
              <span className="text-[8px]" style={{ color: "#3B82F6" }}>ETA Verified ✓</span>
            </div>
            <div className="space-y-1.5">
              {invoices.map((inv) => (
                <div key={inv.id} className="flex items-center justify-between p-2 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <Shield size={8} style={{ color: inv.color }} />
                    <div className="min-w-0">
                      <p className="text-[8px] text-white/50 font-medium">{inv.id} · {inv.hotel}</p>
                      <p className="text-[7px] text-white/25">{inv.amount} · Est. {inv.return}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <span className="text-[7px] px-1.5 py-0.5 rounded" style={{ backgroundColor: inv.color + "15", color: inv.color }}>{inv.risk}</span>
                    <button className="text-[7px] px-1.5 py-0.5 rounded font-medium" style={{ backgroundColor: "#3B82F615", color: "#3B82F6" }}>Bid</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Settlement bar */}
          <div className="mt-3 rounded-lg p-2.5 flex items-center justify-between" style={{ backgroundColor: "rgba(59,130,246,0.03)", border: "1px solid rgba(59,130,246,0.06)" }}>
            <div className="flex items-center gap-2">
              <Banknote size={10} style={{ color: "#3B82F6" }} />
              <span className="text-[8px] text-white/50">EGP 243,209.70 deployed to INV-00421</span>
            </div>
            <span className="text-[7px] font-medium" style={{ color: "#3B82F6" }}>Bank-direct · IBAN</span>
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, duration: 0.5 }} className="absolute -bottom-3 -right-2 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(59,130,246,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
        <span className="text-[8px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Funder Capital Pool</span>
      </motion.div>
    </motion.div>
  );
}
