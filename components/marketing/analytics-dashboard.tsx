"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { BarChart3, TrendingUp, TrendingDown, DollarSign, ShoppingCart, Truck, Users } from "lucide-react";

const A = "#FF6B00";
const AM = "rgba(255,107,0,0.08)";
const AB = "rgba(255,107,0,0.25)";
const AG = "rgba(255,107,0,0.15)";
const S1 = "#080B12";
const SC = "#0C1018";
const B1 = "rgba(255,255,255,0.06)";
const BH = "rgba(255,255,255,0.12)";

function Reveal({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const KPIS = [
  { label: "Total Spend (MTD)", value: "EGP 2.4M", change: "-12%", trend: "down", icon: DollarSign, good: true },
  { label: "Orders Processed", value: "1,847", change: "+23%", trend: "up", icon: ShoppingCart, good: true },
  { label: "Avg. Delivery Time", value: "38h", change: "-15%", trend: "down", icon: Truck, good: true },
  { label: "Active Suppliers", value: "342", change: "+8%", trend: "up", icon: Users, good: true },
];

const SPEND_BY_CATEGORY = [
  { name: "F&B", amount: 980000, pct: 41 },
  { name: "Consumables", amount: 520000, pct: 22 },
  { name: "Guest Supplies", amount: 380000, pct: 16 },
  { name: "FF&E", amount: 310000, pct: 13 },
  { name: "Services", amount: 190000, pct: 8 },
];

const TOP_SAVINGS = [
  { item: "Pool Chemicals — Bulk Order", saved: "EGP 18,400", pct: "14%", supplier: "Pharaoh Chemicals" },
  { item: "Linen Towels — Volume Discount", saved: "EGP 12,200", pct: "11%", supplier: "Red Sea Linen Co." },
  { item: "F&B Consolidation — 3 Properties", saved: "EGP 31,600", pct: "18%", supplier: "NileFresh Produce" },
];

export function AnalyticsDashboard() {
  return (
    <section className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: "#000000" }}>
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(circle, ${AG} 0%, transparent 70%)`, opacity: 0.2 }}
      />
      <div className="max-w-6xl mx-auto px-6">
        <Reveal>
          <div className="text-center mb-16">
            <span className="text-[10px] font-bold uppercase tracking-[0.25em] mb-4 block" style={{ color: A }}>
              Layer 3 · Orchestration
            </span>
            <h2
              className="text-[26px] md:text-[36px] lg:text-[40px] font-normal tracking-tight text-white mb-4 leading-[1.1]"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Real-Time Spend Visibility.
              <br />
              Zero Blind Spots.
            </h2>
            <p className="text-[14px] md:text-[15px] text-white/40 max-w-lg mx-auto leading-relaxed">
              Live dashboards show every order, every delivery, every payment across all properties. AI flags anomalies and surfaces savings opportunities.
            </p>
          </div>
        </Reveal>

        {/* KPI row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {KPIS.map((kpi, i) => (
            <Reveal key={kpi.label} delay={i * 0.06}>
              <motion.div
                className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: SC, border: `1px solid ${B1}` }}
                whileHover={{ borderColor: BH }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: AM, border: `1px solid ${AB}` }}>
                    <kpi.icon size={16} style={{ color: A }} />
                  </div>
                  <div className="flex items-center gap-1">
                    {kpi.trend === "up" ? (
                      <TrendingUp size={12} style={{ color: kpi.good ? "#22C55E" : "#EF4444" }} />
                    ) : (
                      <TrendingDown size={12} style={{ color: kpi.good ? "#22C55E" : "#EF4444" }} />
                    )}
                    <span className="text-[11px] font-bold" style={{ color: kpi.good ? "#22C55E" : "#EF4444" }}>{kpi.change}</span>
                  </div>
                </div>
                <div className="text-[20px] font-bold text-white mb-0.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{kpi.value}</div>
                <div className="text-[10px] text-white/25">{kpi.label}</div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Spend by category */}
          <Reveal delay={0.2}>
            <div className="lg:col-span-3 rounded-2xl p-6" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
              <div className="flex items-center gap-2 mb-5">
                <BarChart3 size={14} style={{ color: A }} />
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: A }}>Spend by Category (MTD)</span>
              </div>
              <div className="space-y-4">
                {SPEND_BY_CATEGORY.map((cat, i) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] text-white/50">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                          EGP {(cat.amount / 1000).toFixed(0)}K
                        </span>
                        <span className="text-[10px] text-white/20">{cat.pct}%</span>
                      </div>
                    </div>
                    <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: A, opacity: 0.5 + (cat.pct / 100) * 0.5 }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${cat.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${B1}` }}>
                <span className="text-[11px] text-white/25">Total MTD spend</span>
                <span className="text-[16px] font-bold text-white" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>EGP 2.38M</span>
              </div>
            </div>
          </Reveal>

          {/* AI savings */}
          <Reveal delay={0.25}>
            <div className="lg:col-span-2 rounded-2xl p-6" style={{ backgroundColor: SC, border: `1px solid ${B1}` }}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: AM, border: `1px solid ${AB}` }}>
                  <span className="text-[12px] font-bold" style={{ color: A }}>AI</span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: A }}>AI Savings</span>
                  <p className="text-[10px] text-white/25">This month</p>
                </div>
              </div>
              <div className="space-y-3">
                {TOP_SAVINGS.map((s, i) => (
                  <motion.div
                    key={s.item}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.02)", border: `1px solid ${B1}` }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-medium text-white/60">{s.item}</span>
                      <span className="text-[11px] font-bold" style={{ color: "#22C55E" }}>{s.pct}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/20">{s.supplier}</span>
                      <span className="text-[12px] font-bold" style={{ color: "#22C55E", fontFamily: "'Playfair Display', Georgia, serif" }}>{s.saved}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: `1px solid ${B1}` }}>
                <span className="text-[10px] text-white/25">Total AI savings</span>
                <span className="text-[14px] font-bold" style={{ color: "#22C55E", fontFamily: "'Playfair Display', Georgia, serif" }}>EGP 62,200</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
