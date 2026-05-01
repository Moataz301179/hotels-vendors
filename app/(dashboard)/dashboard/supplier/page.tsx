"use client";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import {
  Package,
  ClipboardList,
  Truck,
  TrendingUp,
  AlertTriangle,
  Upload,
  FileText,
  ChevronRight,
  Box,
  BarChart3,
} from "lucide-react";

const METRICS = [
  {
    label: "Stock Items",
    value: "1,247",
    subtext: "98% in stock",
    icon: Package,
    color: "bg-accent-cyan/10 text-accent-cyan",
  },
  {
    label: "Incoming POs",
    value: "23",
    subtext: "5 new today",
    icon: ClipboardList,
    color: "bg-accent-emerald/10 text-accent-emerald",
  },
  {
    label: "Pending Shipments",
    value: "8",
    subtext: "2 urgent",
    icon: Truck,
    color: "bg-accent-amber/10 text-accent-amber",
  },
  {
    label: "Monthly Revenue",
    value: "486,250 EGP",
    subtext: "+8.4% vs last month",
    icon: TrendingUp,
    color: "bg-accent-gold/10 text-accent-gold",
  },
];

const INVENTORY = [
  { sku: "TX-BTH-001", name: "Egyptian Cotton Towels", qty: 420, reorder: 100, status: "healthy", warehouse: "6th October" },
  { sku: "FB-OIL-024", name: "Cold-Pressed Olive Oil", qty: 85, reorder: 120, status: "low", warehouse: "10th Ramadan" },
  { sku: "HK-DET-008", name: "Industrial Detergent", qty: 650, reorder: 200, status: "healthy", warehouse: "6th October" },
  { sku: "ENG-LED-112", name: "LED Panel Downlight 18W", qty: 12, reorder: 50, status: "critical", warehouse: "Alexandria" },
  { sku: "AMN-KIT-045", name: "Guest Amenity Kit", qty: 1800, reorder: 500, status: "healthy", warehouse: "6th October" },
];

const INCOMING_ORDERS = [
  { id: "PO-2026-0114", hotel: "Marriott Cairo", items: 4, total: 14200, status: "pending", date: "2026-04-28" },
  { id: "PO-2026-0112", hotel: "Four Seasons Giza", items: 12, total: 37800, status: "confirmed", date: "2026-04-27" },
  { id: "PO-2026-0109", hotel: "Hilton Alexandria", items: 8, total: 5600, status: "ready", date: "2026-04-26" },
  { id: "PO-2026-0107", hotel: "Movenpick Hurghada", items: 24, total: 45600, status: "shipped", date: "2026-04-24" },
  { id: "PO-2026-0105", hotel: "Steigenberger Cairo", items: 200, total: 9500, status: "delivered", date: "2026-04-22" },
];

function StockBadge({ status }: { status: string }) {
  const config: Record<string, { text: string; cls: string; dot: string }> = {
    healthy: { text: "Healthy", cls: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20", dot: "bg-accent-emerald" },
    low: { text: "Low Stock", cls: "bg-accent-amber/10 text-accent-amber border-accent-amber/20", dot: "bg-accent-amber" },
    critical: { text: "Critical", cls: "bg-brand-700/20 text-brand-400 border-brand-700/30", dot: "bg-brand-500" },
  };
  const c = config[status] || config.healthy;
  return (
    <span className={`status-badge border ${c.cls}`}>
      <span className={`status-dot ${c.dot}`} />
      {c.text}
    </span>
  );
}

function OrderBadge({ status }: { status: string }) {
  const config: Record<string, { text: string; cls: string; dot: string }> = {
    pending: { text: "Pending", cls: "bg-accent-amber/10 text-accent-amber border-accent-amber/20", dot: "bg-accent-amber" },
    confirmed: { text: "Confirmed", cls: "bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20", dot: "bg-accent-cyan" },
    ready: { text: "Ready to Ship", cls: "bg-accent-violet/10 text-accent-violet border-accent-violet/20", dot: "bg-accent-violet" },
    shipped: { text: "Shipped", cls: "bg-accent-gold/10 text-accent-gold border-accent-gold/20", dot: "bg-accent-gold" },
    delivered: { text: "Delivered", cls: "bg-accent-emerald/10 text-accent-emerald border-accent-emerald/20", dot: "bg-accent-emerald" },
  };
  const c = config[status] || config.pending;
  return (
    <span className={`status-badge border ${c.cls}`}>
      <span className={`status-dot ${c.dot}`} />
      {c.text}
    </span>
  );
}

export default function SupplierDashboard() {
  return (
    <DashboardShell role="supplier">
      <div className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="gradient-text-animated">Inventory & Order Command Center</span>
          </h1>
          <p className="text-foreground-muted mt-1 text-sm">
            Monitor stock levels, manage incoming purchase orders, and coordinate shipments
          </p>
        </div>

        {/* Metrics */}
        <div className="command-grid mb-8">
          {METRICS.map((m) => (
            <div key={m.label} className="glass-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`p-2 rounded-lg ${m.color}`}>
                  <m.icon size={18} />
                </div>
                {m.subtext && (
                  <span className="text-[11px] font-medium text-accent-emerald bg-accent-emerald/10 px-2 py-0.5 rounded-full">
                    {m.subtext}
                  </span>
                )}
              </div>
              <p className="metric-value text-2xl font-bold text-foreground">{m.value}</p>
              <p className="metric-label mt-1">{m.label}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Inventory Status */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-accent-cyan/10">
                  <Box size={18} className="text-accent-cyan" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Inventory Status</h2>
                  <p className="text-xs text-foreground-faint">Live stock across warehouses</p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
                Manage Stock <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border-subtle">
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">SKU</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Product</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Qty</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Status</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint text-right">Warehouse</th>
                  </tr>
                </thead>
                <tbody>
                  {INVENTORY.map((item) => (
                    <tr key={item.sku} className="data-table-row">
                      <td className="py-3 text-sm font-mono text-foreground-faint">{item.sku}</td>
                      <td className="py-3 text-sm text-foreground">{item.name}</td>
                      <td className="py-3 text-sm font-medium text-foreground">{item.qty}</td>
                      <td className="py-3"><StockBadge status={item.status} /></td>
                      <td className="py-3 text-sm text-foreground-faint text-right">{item.warehouse}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Incoming Orders */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-accent-emerald/10">
                  <ClipboardList size={18} className="text-accent-emerald" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-foreground">Incoming Orders</h2>
                  <p className="text-xs text-foreground-faint">Purchase orders from hotels</p>
                </div>
              </div>
              <button className="flex items-center gap-1 text-xs font-medium text-brand-400 hover:text-brand-300 transition-colors">
                All Orders <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border-subtle">
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">PO ID</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Hotel</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Total</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint">Status</th>
                    <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-foreground-faint text-right">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {INCOMING_ORDERS.map((order) => (
                    <tr key={order.id} className="data-table-row">
                      <td className="py-3 text-sm font-mono text-foreground">{order.id}</td>
                      <td className="py-3 text-sm text-foreground-muted">{order.hotel}</td>
                      <td className="py-3 text-sm font-medium text-foreground">{order.total.toLocaleString()} EGP</td>
                      <td className="py-3"><OrderBadge status={order.status} /></td>
                      <td className="py-3 text-sm text-foreground-faint text-right">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Upload Zone */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-accent-violet/10">
                <Upload size={18} className="text-accent-violet" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-foreground">AI Upload Zone</h2>
                <p className="text-xs text-foreground-faint">Drag & drop invoices, catalog sheets, or shipping docs</p>
              </div>
            </div>
            <span className="text-[11px] font-medium text-foreground-faint bg-surface-raised px-2 py-0.5 rounded-full border border-border-subtle">
              Beta
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 surface-card p-8 flex flex-col items-center justify-center text-center border-dashed border-2 border-border-default hover:border-brand-700/30 transition-colors cursor-pointer">
              <div className="w-14 h-14 rounded-2xl bg-surface-raised flex items-center justify-center mb-4">
                <Upload size={24} className="text-foreground-faint" />
              </div>
              <p className="text-sm font-medium text-foreground">Drop files here or click to browse</p>
              <p className="text-xs text-foreground-faint mt-1">Supports PDF, Excel, CSV, and image files up to 50MB</p>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-[10px] text-foreground-dim bg-surface-hover px-2 py-0.5 rounded">Invoices</span>
                <span className="text-[10px] text-foreground-dim bg-surface-hover px-2 py-0.5 rounded">Catalogs</span>
                <span className="text-[10px] text-foreground-dim bg-surface-hover px-2 py-0.5 rounded">Packing Lists</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="surface-card p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-emerald/10">
                  <FileText size={16} className="text-accent-emerald" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-Extract</p>
                  <p className="text-[11px] text-foreground-faint">SKU, qty, and pricing parsed by AI</p>
                </div>
              </div>
              <div className="surface-card p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-cyan/10">
                  <BarChart3 size={16} className="text-accent-cyan" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Match & Reconcile</p>
                  <p className="text-[11px] text-foreground-faint">Cross-check with PO and ETA data</p>
                </div>
              </div>
              <div className="surface-card p-4 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent-amber/10">
                  <AlertTriangle size={16} className="text-accent-amber" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Flag Anomalies</p>
                  <p className="text-[11px] text-foreground-faint">Highlight price or quantity mismatches</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
