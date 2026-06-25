"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Truck,
  Banknote,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: ShoppingCart, label: "Procurement", active: false },
  { icon: Receipt, label: "Invoices", active: false },
  { icon: Truck, label: "Logistics", active: false },
  { icon: Banknote, label: "Factoring", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const kpiCards = [
  { label: "Open POs", value: "24", change: "+3", up: true, color: "var(--accent-base)" },
  { label: "Pending Invoices", value: "8", change: "-2", up: false, color: "var(--info)" },
  { label: "Active Deliveries", value: "12", change: "+5", up: true, color: "var(--warning)" },
  { label: "Factored This Month", value: "EGP 180K", change: "+12%", up: true, color: "var(--success)" },
];

const recentActivity = [
  { icon: CheckCircle2, text: "PO-2024-0892 approved", time: "2m ago", color: "var(--success)" },
  { icon: Clock, text: "Invoice #INV-4451 pending ETA", time: "8m ago", color: "var(--warning)" },
  { icon: Truck, text: "Shipment SH-009 in transit", time: "15m ago", color: "var(--info)" },
  { icon: AlertCircle, text: "Budget alert: F&B > 85%", time: "32m ago", color: "var(--error)" },
];

// Mini chart bars (heights in %)
const chartBars = [35, 52, 45, 68, 55, 72, 60, 85, 70, 90, 78, 95];
const chartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function DashboardMockup() {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      className="relative"
    >
      {/* Glow behind the mockup */}
      <div
        className="absolute -inset-4 rounded-3xl blur-[60px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(255,107,0,0.06) 0%, transparent 70%)" }}
      />

      {/* ── Dashboard Window ── */}
      <div
        className="rounded-2xl overflow-hidden relative"
        style={{
          backgroundColor: "var(--bg-surface-1)",
          border: "1px solid var(--border-subtle)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--border-invisible)",
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5"
          style={{ backgroundColor: "var(--bg-surface-2)", borderBottom: "1px solid var(--border-subtle)" }}
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#EF4444" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#D4A843" }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#22C55E" }} />
            </div>
            <span className="text-[9px] ml-2 font-mono" style={{ color: "var(--text-muted)" }}>app.hotelsvendors.com/dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent-muted)" }} />
          </div>
        </div>

        <div className="flex">
          {/* ── Sidebar ── */}
          <div
            className="w-[52px] flex-shrink-0 py-3 flex flex-col items-center gap-1"
            style={{ backgroundColor: "var(--bg-surface-2)", borderRight: "1px solid var(--border-subtle)" }}
          >
            {/* Logo */}
            <div className="mb-3">
              <BrandLogo size="xs" showText={false} />
            </div>

            {sidebarItems.map((item) => (
              <div
                key={item.label}
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                style={{
                  backgroundColor: item.active ? "rgba(255,107,0,0.08)" : "transparent",
                }}
                title={item.label}
              >
                <item.icon
                  size={15}
                  style={{ color: item.active ? "var(--accent-base)" : "var(--text-muted)" }}
                />
              </div>
            ))}
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 p-4 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[13px] font-semibold" style={{ color: "var(--text-primary)" }}>Dashboard</h3>
                <p className="text-[9px]" style={{ color: "var(--text-muted)" }}>Stella Di Mare Resort · Sharm El-Sheikh</p>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-20 h-6 rounded-md flex items-center gap-1 px-2"
                  style={{ backgroundColor: "var(--accent-muted)", border: "1px solid var(--border-subtle)" }}
                >
                  <Search size={9} style={{ color: "var(--text-muted)" }} />
                  <span className="text-[8px]" style={{ color: "var(--text-muted)" }}>Search...</span>
                </div>
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: "var(--accent-muted)", border: "1px solid var(--border-subtle)" }}
                >
                  <Bell size={10} style={{ color: "var(--text-muted)" }} />
                </div>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(255,107,0,0.15)" }}
                >
                  <span className="text-[7px] font-bold" style={{ color: "var(--accent-base)" }}>AM</span>
                </div>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {kpiCards.map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-lg p-2.5"
                  style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[8px]" style={{ color: "var(--text-muted)" }}>{kpi.label}</span>
                    {kpi.up ? (
                      <TrendingUp size={8} style={{ color: "var(--success)" }} />
                    ) : (
                      <TrendingDown size={8} style={{ color: "#EF4444" }} />
                    )}
                  </div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[14px] font-bold" style={{ color: "var(--text-primary)" }}>{kpi.value}</span>
                    <span className="text-[8px]" style={{ color: kpi.up ? "#22C55E" : "#EF4444" }}>{kpi.change}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Chart + Activity side by side */}
            <div className="grid grid-cols-5 gap-3">
              {/* Mini Chart */}
              <div
                className="col-span-3 rounded-lg p-3"
                style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-medium" style={{ color: "var(--text-secondary)" }}>Procurement Spend</span>
                  <div className="flex items-center gap-1">
                    <span className="text-[8px]" style={{ color: "var(--success)" }}>+18.2%</span>
                    <ArrowUpRight size={8} style={{ color: "var(--success)" }} />
                  </div>
                </div>
                {/* Bar chart */}
                <div className="flex items-end gap-[3px] h-12">
                  {chartBars.map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-sm"
                      style={{
                        height: `${h}%`,
                        backgroundColor: i === chartBars.length - 1 ? "var(--accent-base)" : "rgba(255,107,0,0.12)",
                        transition: "height 0.3s ease",
                      }}
                    />
                  ))}
                </div>
                <div className="flex justify-between mt-1.5">
                  {chartLabels.filter((_, i) => i % 3 === 0).map((label) => (
                    <span key={label} className="text-[6px]" style={{ color: "var(--text-muted)" }}>{label}</span>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div
                className="col-span-2 rounded-lg p-3"
                style={{ backgroundColor: "var(--bg-surface-2)", border: "1px solid var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[9px] font-medium" style={{ color: "var(--text-secondary)" }}>Activity</span>
                  <MoreHorizontal size={9} style={{ color: "var(--text-muted)" }} />
                </div>
                <div className="space-y-2">
                  {recentActivity.map((item, i) => (
                    <div key={i} className="flex items-start gap-1.5">
                      <item.icon size={8} className="mt-0.5 flex-shrink-0" style={{ color: item.color }} />
                      <div className="min-w-0">
                        <p className="text-[7px] leading-tight truncate" style={{ color: "var(--text-secondary)" }}>{item.text}</p>
                        <p className="text-[6px]" style={{ color: "var(--text-muted)" }}>{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom pipeline status bar */}
            <div
              className="mt-3 rounded-lg p-2.5 flex items-center justify-between"
              style={{ backgroundColor: "rgba(255,107,0,0.03)", border: "1px solid rgba(255,107,0,0.06)" }}
            >
              <div className="flex items-center gap-3">
                {[
                  { label: "Forecast", status: "done" },
                  { label: "PO Sent", status: "done" },
                  { label: "Invoice", status: "active" },
                  { label: "Delivery", status: "pending" },
                  { label: "Settled", status: "pending" },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-center gap-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{
                        backgroundColor:
                          step.status === "done" ? "#22C55E" :
                          step.status === "active" ? "var(--accent-base)" :
                          "var(--text-muted)",
                      }}
                    />
                    <span
                      className="text-[7px]"
                      style={{
                        color:
                          step.status === "done" ? "var(--text-secondary)" :
                          step.status === "active" ? "var(--accent-base)" :
                          "var(--text-muted)",
                      }}
                    >
                      {step.label}
                    </span>
                    {i < 4 && (
                      <div className="w-3 h-px" style={{ backgroundColor: "var(--border-subtle)" }} />
                    )}
                  </div>
                ))}
              </div>
              <span className="text-[7px] font-medium" style={{ color: "var(--accent-base)" }}>PO-2024-0892</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating badge — bottom right */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="absolute -bottom-3 -right-2 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5"
        style={{
          backgroundColor: "var(--foreground)",
          border: "1px solid rgba(255,107,0,0.15)",
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
        }}
      >
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--accent-base)" }} />
        <span className="text-[8px] font-medium" style={{ color: "var(--accent-base)" }}>Live · ETA Connected</span>
      </motion.div>
    </motion.div>
  );
}
