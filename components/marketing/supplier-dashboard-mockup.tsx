"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Store, Package, Receipt, Banknote, TrendingUp, CheckCircle2, Clock,
  ArrowUpRight, Search, Bell, Truck,
} from "lucide-react";

const kpiCards = [
  { label: "Active POs", value: "18", change: "+6", up: true, color: "var(--success)" },
  { label: "Invoices Issued", value: "42", change: "+14", up: true, color: "var(--success)" },
  { label: "Paid (24h)", value: "EGP 320K", change: "+28%", up: true, color: "var(--info)" },
  { label: "Avg Settlement", value: "18h", change: "-4h", up: true, color: "var(--orange-base)" },
];

const orders = [
  { id: "PO-2024-0892", hotel: "Stella Di Mare", items: 24, value: "EGP 48,500", status: "Pending Delivery", color: "var(--orange-base)" },
  { id: "PO-2024-0893", hotel: "Jaz Resort", items: 18, value: "EGP 32,100", status: "In Transit", color: "var(--info)" },
  { id: "PO-2024-0894", hotel: "Baron Palace", items: 31, value: "EGP 67,200", status: "Delivered", color: "var(--success)" },
  { id: "PO-2024-0895", hotel: "Sunrise Resort", items: 12, value: "EGP 18,900", status: "Pending Delivery", color: "var(--orange-base)" },
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
      <div className="absolute -inset-4 rounded-3xl blur-[60px] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(var(--success-rgb),0.06) 0%, transparent 70%)" }} />
      <div className="rounded-2xl overflow-hidden relative" style={{ backgroundColor: "var(--surface)", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)" }}>
        <div className="flex items-center justify-between px-4 py-2.5" style={{ backgroundColor: "var(--surface-1)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--error)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--orange-base)" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "var(--success)" }} />
            </div>
            <span className="text-[9px] text-white/20 ml-2 font-mono">app.hotelsvendors.com/supplier</span>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[13px] font-semibold text-white">Supplier Portal</h3>
              <p className="text-[9px] text-white/25">Egyptian Fresh Foods Co. · Cairo</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-20 h-6 rounded-md flex items-center gap-1 px-2" style={{ backgroundColor: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Search size={9} style={{ color: "rgba(255,255,255,0.2)" }} />
                <span className="text-[8px] text-white/15">Search...</span>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(var(--success-rgb),0.15)" }}>
                <span className="text-[7px]" style={{ color: "var(--success)", fontWeight: 700 }}>EF</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {kpiCards.map((kpi) => (
              <div key={kpi.label} className="rounded-lg p-2.5" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[8px] text-white/30">{kpi.label}</span>
                  <TrendingUp size={8} style={{ color: "var(--success)" }} />
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-[14px] font-bold text-white">{kpi.value}</span>
                  <span className="text-[8px]" style={{ color: "var(--success)" }}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Recent Orders */}
          <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[9px] font-medium text-white/40">Recent Purchase Orders</span>
              <span className="text-[8px]" style={{ color: "var(--success)" }}>View All →</span>
            </div>
            <div className="space-y-2">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-2 rounded-md" style={{ backgroundColor: "rgba(255,255,255,0.01)" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: order.color }} />
                    <div className="min-w-0">
                      <p className="text-[8px] text-white/50 font-medium">{order.id}</p>
                      <p className="text-[7px] text-white/25 truncate">{order.hotel} · {order.items} items</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="text-[8px] text-white/40">{order.value}</p>
                    <p className="text-[7px]" style={{ color: order.color }}>{order.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Settlement bar */}
          <div className="mt-3 rounded-lg p-2.5 flex items-center justify-between" style={{ backgroundColor: "rgba(var(--success-rgb),0.03)", border: "1px solid rgba(var(--success-rgb),0.06)" }}>
            <div className="flex items-center gap-2">
              <Banknote size={10} style={{ color: "var(--success)" }} />
              <span className="text-[8px] text-white/40">Next settlement: <span className="font-medium" style={{ color: "var(--success)" }}>EGP 48,500</span> in 18h</span>
            </div>
            <span className="text-[7px] font-medium" style={{ color: "var(--success)" }}>Auto-deposit · IBAN ****4521</span>
          </div>
        </div>
      </div>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.8, duration: 0.5 }} className="absolute -bottom-3 -right-2 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5" style={{ backgroundColor: "var(--surface-1)", border: "1px solid rgba(var(--success-rgb),0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.4)" }}>
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--success)" }} />
        <span className="text-[8px] font-medium" style={{ color: "var(--success)" }}>24h Settlement Active</span>
      </motion.div>
    </motion.div>
  );
}
