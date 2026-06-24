"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BrandLogo } from "@/components/layout/brand-logo";
import {
  Store, Package, Receipt, Banknote, TrendingUp, CheckCircle2, Clock, ShoppingCart,
  ArrowUpRight, Search, Bell,
} from "lucide-react";

const kpiCards = [
  { label: "Active POs", value: "8", change: "EGP 1.2M", up: true, color: "#22C55E" },
  { label: "Invoices Issued", value: "12", change: "EGP 847.5K", up: true, color: "var(--accent-base)" },
  { label: "Paid (24h)", value: "EGP 243K", change: "14 hrs avg", up: true, color: "#3B82F6" },
  { label: "Avg Settlement", value: "14 hrs", change: "-22% MoM", up: true, color: "#D4A843" },
];

const orders = [
  { id: "PO-0421", hotel: "Steigenberger El Gouna", items: "14 items", total: "EGP 247.8K", status: "Approved", color: "#22C55E" },
  { id: "PO-0420", hotel: "Jaz Almaza Beach", items: "8 items", total: "EGP 89.2K", status: "Pending", color: "#D4A843" },
  { id: "PO-0419", hotel: "Movenpick Resort", items: "22 items", total: "EGP 312.5K", status: "Approved", color: "#22C55E" },
  { id: "PO-0418", hotel: "Hilton Pyramids", items: "6 items", total: "EGP 45.1K", status: "Delivered", color: "#3B82F6" },
];

export function SupplierDashboardMockup() {
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
      <div className="absolute -inset-4 rounded-3xl blur-[60px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(34,197,94,0.06) 0%, transparent 70%)" }} />
      <div className="rounded-2xl overflow-hidden relative" style={{ backgroundColor: "#0B0F17", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)" }}>
        <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: "#0f0f0f", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#EF4444" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D4A843" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
            </div>
            <span className="text-[9px] text-white/20 ml-2 font-mono">app.hotelsvendors.com/supplier</span>
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
                <h3 className="text-[13px] font-semibold text-white">Supplier Portal</h3>
                <p className="text-[9px] text-white/25">Egyptian Linen Co. · Verified</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 rounded-md flex items-center gap-1 px-2" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Search size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
                <span className="text-[8px] text-white/15">Search POs...</span>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(34,197,94,0.15)" }}>
                <span className="text-[7px]" style={{ color: "#22C55E", fontWeight: 700 }}>EL</span>
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
          {/* Recent Orders */}
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[9px] font-medium text-white/40">Incoming Purchase Orders</span>
              <span className="text-[8px]" style={{ color: "#22C55E" }}>View All →</span>
            </div>
            <div className="space-y-1.5">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-2 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: order.color }} />
                    <div className="min-w-0">
                      <p className="text-[8px] text-white/50 font-medium">{order.id} · {order.hotel}</p>
                      <p className="text-[7px] text-white/25">{order.items} · {order.total}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-[7px] font-medium" style={{ color: order.color }}>{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Settlement bar */}
          <div className="mt-3 rounded-lg p-2.5 flex items-center justify-between" style={{ backgroundColor: "rgba(34,197,94,0.03)", border: "1px solid rgba(34,197,94,0.06)" }}>
            <div className="flex items-center gap-2">
              <Banknote size={10} style={{ color: "#22C55E" }} />
              <span className="text-[8px] text-white/50">EGP 243,401.40 settled — 14 hours</span>
            </div>
            <span className="text-[7px] font-medium" style={{ color: "#22C55E" }}>Auto-deposit · IBAN</span>
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, duration: 0.5 }} className="absolute -bottom-3 -right-2 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: "#0f0f0f", border: "1px solid rgba(34,197,94,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
        <span className="text-[8px] font-medium" style={{ color: "rgba(255,255,255,0.35)" }}>Supplier Marketplace</span>
      </motion.div>
    </motion.div>
  );
}
