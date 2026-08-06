"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Store,
  Truck,
  ShoppingCart,
  Package,
  BarChart3,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  Search,
  Bell,
  Settings,
  ChevronDown,
  DollarSign,
  FileText,
  Users,
  Filter,
  Download,
  Plus,
  Eye,
  MoreHorizontal,
  Star,
  MapPin,
  Calendar,
  ChevronRight,
} from "lucide-react";

type Tab = "hotel" | "supplier" | "orders" | "analytics";

// ── Sample Data ──
const HOTEL_STATS = [
  { label: "Monthly Spend", value: "EGP 2.4M", change: "+12%", up: true, icon: DollarSign },
  { label: "Active Orders", value: "47", change: "+8", up: true, icon: ShoppingCart },
  { label: "Suppliers", value: "124", change: "+15", up: true, icon: Store },
  { label: "Savings", value: "EGP 340K", change: "18%", up: true, icon: TrendingUp },
];

const ORDERS = [
  { id: "PO-2024-1892", supplier: "Cairo Fresh Produce", items: 12, total: "EGP 45,200", status: "DELIVERED", date: "Jan 15" },
  { id: "PO-2024-1891", supplier: "Delta Cleaning Co.", items: 8, total: "EGP 23,800", status: "IN_TRANSIT", date: "Jan 14" },
  { id: "PO-2024-1890", supplier: "Nile Linens Ltd.", items: 5, total: "EGP 67,500", status: "PENDING", date: "Jan 14" },
  { id: "PO-2024-1889", supplier: "Alexandra Foods", items: 22, total: "EGP 89,100", status: "APPROVED", date: "Jan 13" },
  { id: "PO-2024-1888", supplier: "Sinai Water Supply", items: 3, total: "EGP 12,400", status: "DELIVERED", date: "Jan 12" },
  { id: "PO-2024-1887", supplier: "Giza Electronics", items: 7, total: "EGP 34,600", status: "CANCELLED", date: "Jan 11" },
];

const PRODUCTS = [
  { name: "Premium Cotton Towels", sku: "HTL-001", supplier: "Nile Linens", price: "EGP 45", stock: 1240, category: "Housekeeping" },
  { name: "Industrial Dishwasher Tabs", sku: "HTL-002", supplier: "Delta Cleaning", price: "EGP 890", stock: 320, category: "Cleaning" },
  { name: "Bottled Water 500ml (24pk)", sku: "HTL-003", supplier: "Sinai Water", price: "EGP 120", stock: 5600, category: "F&B" },
  { name: "LED Bulb 12W (Pack of 10)", sku: "HTL-004", supplier: "Giza Electronics", price: "EGP 210", stock: 890, category: "Maintenance" },
  { name: "Hand Soap Refill 5L", sku: "HTL-005", supplier: "Delta Cleaning", price: "EGP 175", stock: 420, category: "Amenities" },
  { name: "Fresh Vegetables Mix", sku: "HTL-006", supplier: "Cairo Fresh", price: "EGP 32/kg", stock: 850, category: "F&B" },
];

const ANALYTICS_DATA = [
  { month: "Aug", spend: 1800000, orders: 38 },
  { month: "Sep", spend: 2100000, orders: 42 },
  { month: "Oct", spend: 1950000, orders: 39 },
  { month: "Nov", spend: 2300000, orders: 45 },
  { month: "Dec", spend: 2150000, orders: 41 },
  { month: "Jan", spend: 2400000, orders: 47 },
];

const STATUS_COLORS: Record<string, string> = {
  DELIVERED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  IN_TRANSIT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  APPROVED: "bg-white/10 text-white border-white/20",
  CANCELLED: "bg-red-500/10 text-red-400 border-red-500/20",
};

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "hotel", label: "Hotel Dashboard", icon: Building2 },
  { key: "supplier", label: "Supplier View", icon: Store },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "analytics", label: "Analytics", icon: BarChart3 },
];

export default function SandboxPage() {
  const [activeTab, setActiveTab] = useState<Tab>("hotel");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  return (
    <main className="min-h-screen bg-[#0c0c12]">
      {/* ── Top Banner ── */}
      <div className="bg-accent-base/10 border-b border-accent-base/20 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-white/60">
            <Zap size={12} className="text-accent-base" />
            <span>Sandbox Mode — Explore the real INVO platform with sample data</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-xs font-medium text-white/60 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="text-xs font-medium px-3 py-1 rounded-md bg-accent-base text-white hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* ── App Shell ── */}
      <div className="flex h-[calc(100vh-40px)]">
        {/* ── Sidebar ── */}
        <aside className="w-64 bg-[#12121a] border-r border-white/5 flex flex-col shrink-0">
          {/* Logo */}
          <div className="h-14 flex items-center gap-2.5 px-5 border-b border-white/5">
            <div className="w-7 h-7 rounded-lg bg-accent-base flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium tracking-tight text-white">INVO</span>
          </div>

          {/* Nav */}
          <nav className="flex-1 py-4 px-3 space-y-1">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-accent-base/10 text-white border border-accent-base/20"
                      : "text-white/40 hover:text-white/70 hover:bg-white/5"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-white/5">
              <p className="px-3 mb-2 text-[10px] font-semibold text-white/20 uppercase tracking-wider">Other</p>
              {[
                { label: "Shipments", icon: Truck },
                { label: "Invoices", icon: FileText },
                { label: "Suppliers", icon: Users },
                { label: "Settings", icon: Settings },
              ].map((item) => (
                <button
                  key={item.label}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-white/30 hover:text-white/50 hover:bg-white/5 transition-all"
                >
                  <item.icon size={15} />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* User */}
          <div className="p-3 border-t border-white/5">
            <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-accent-base/20 flex items-center justify-center text-xs font-semibold text-accent-base">
                AH
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-white truncate">Al Sahara Hotel</p>
                <p className="text-[10px] text-white/30 truncate">admin@alsahara.com</p>
              </div>
              <ChevronDown size={14} className="text-white/20" />
            </div>
          </div>
        </aside>

        {/* ── Main Content ── */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 flex items-center justify-between px-6 border-b border-white/5 bg-[#12121a]/80 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <h1 className="text-sm font-semibold text-white">
                {TABS.find((t) => t.key === activeTab)?.label}
              </h1>
              <span className="text-xs text-white/30">|</span>
              <span className="text-xs text-white/40">January 2026</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                <Search size={14} className="text-white/30" />
                <span className="text-xs text-white/30">Search...</span>
              </div>
              <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-all relative">
                <Bell size={16} />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-base" />
              </button>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === "hotel" && <HotelDashboard />}
            {activeTab === "supplier" && <SupplierView />}
            {activeTab === "orders" && <OrdersView selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />}
            {activeTab === "analytics" && <AnalyticsView />}
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Hotel Dashboard ──
function HotelDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HOTEL_STATS.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-[#1a1a24] border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-white/40 uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={14} className="text-white/20" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className={`text-xs mt-1 ${stat.up ? "text-emerald-400" : "text-red-400"}`}>{stat.change} vs last month</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-xl bg-[#1a1a24] border border-white/5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Recent Orders</h3>
          <button className="text-xs text-accent-base hover:underline">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Supplier</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Items</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.slice(0, 5).map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 text-xs font-medium text-white">{order.id}</td>
                  <td className="px-5 py-3.5 text-xs text-white/60">{order.supplier}</td>
                  <td className="px-5 py-3.5 text-xs text-white/60">{order.items}</td>
                  <td className="px-5 py-3.5 text-xs font-medium text-white">{order.total}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_COLORS[order.status]}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/40">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "New Purchase Order", desc: "Create a new PO from catalog", icon: Plus, color: "text-emerald-400" },
          { title: "Inventory Check", desc: "View stock levels across properties", icon: Package, color: "text-blue-400" },
          { title: "Supplier Discovery", desc: "Find verified suppliers for your needs", icon: Store, color: "text-purple-400" },
        ].map((action) => (
          <button key={action.title} className="p-4 rounded-xl bg-[#1a1a24] border border-white/5 hover:border-white/10 transition-all text-left group">
            <action.icon size={18} className={`${action.color} mb-3`} />
            <p className="text-sm font-medium text-white group-hover:text-accent-base transition-colors">{action.title}</p>
            <p className="text-xs text-white/40 mt-1">{action.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Supplier View ──
function SupplierView() {
  const supplierStats = [
    { label: "Total Revenue", value: "EGP 1.2M", icon: DollarSign },
    { label: "Active POs", value: "23", icon: ShoppingCart },
    { label: "Products Listed", value: "156", icon: Package },
    { label: "Avg. Rating", value: "4.8", icon: Star },
  ];

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {supplierStats.map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl bg-[#1a1a24] border border-white/5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] text-white/40 uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={14} className="text-white/20" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Product Catalog */}
      <div className="rounded-xl bg-[#1a1a24] border border-white/5">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Your Product Catalog</h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 bg-white/5 hover:bg-white/10 transition-colors">
              <Filter size={12} /> Filter
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-white/40 bg-white/5 hover:bg-white/10 transition-colors">
              <Download size={12} /> Export
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">SKU</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Price</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Stock</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Category</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTS.map((product) => (
                <tr key={product.sku} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                        <Package size={14} className="text-white/30" />
                      </div>
                      <span className="text-xs font-medium text-white">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/40 font-mono">{product.sku}</td>
                  <td className="px-5 py-3.5 text-xs font-medium text-white">{product.price}</td>
                  <td className="px-5 py-3.5 text-xs text-white/60">{product.stock.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-white/50 border border-white/5">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button className="p-1.5 rounded-md hover:bg-white/5 transition-colors">
                      <MoreHorizontal size={14} className="text-white/30" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Orders View ──
function OrdersView({ selectedOrder, setSelectedOrder }: { selectedOrder: string | null; setSelectedOrder: (id: string | null) => void }) {
  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {["All", "Pending", "Approved", "In Transit", "Delivered"].map((filter) => (
          <button
            key={filter}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-xl bg-[#1a1a24] border border-white/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Order</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Supplier</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Items</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Total</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">ETA</th>
                <th className="px-5 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider"></th>
              </tr>
            </thead>
            <tbody>
              {ORDERS.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(selectedOrder === order.id ? null : order.id)}
                  className={`border-b border-white/5 cursor-pointer transition-colors ${
                    selectedOrder === order.id ? "bg-accent-base/5" : "hover:bg-white/[0.02]"
                  }`}
                >
                  <td className="px-5 py-3.5 text-xs font-medium text-white">{order.id}</td>
                  <td className="px-5 py-3.5 text-xs text-white/60">{order.supplier}</td>
                  <td className="px-5 py-3.5 text-xs text-white/60">{order.items} items</td>
                  <td className="px-5 py-3.5 text-xs font-medium text-white">{order.total}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border ${STATUS_COLORS[order.status]}`}>
                      {order.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white/40">{order.date}</td>
                  <td className="px-5 py-3.5">
                    <ChevronRight size={14} className="text-white/20" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Panel */}
      {selectedOrder && (
        <div className="rounded-xl bg-[#1a1a24] border border-white/5 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">{selectedOrder}</h3>
              <p className="text-xs text-white/40 mt-1">Order details and timeline</p>
            </div>
            <button onClick={() => setSelectedOrder(null)} className="text-xs text-white/40 hover:text-white">
              Close
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Order Info */}
            <div className="space-y-4">
              {[
                { label: "Supplier", value: "Cairo Fresh Produce" },
                { label: "Order Date", value: "January 15, 2026" },
                { label: "Delivery Date", value: "January 18, 2026" },
                { label: "Payment Terms", value: "Net 30" },
                { label: "ETA Status", value: "Validated", color: "text-emerald-400" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-white/5">
                  <span className="text-xs text-white/40">{item.label}</span>
                  <span className={`text-xs font-medium ${item.color || "text-white"}`}>{item.value}</span>
                </div>
              ))}
            </div>

            {/* Right: Timeline */}
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-4">Order Timeline</p>
              <div className="space-y-3">
                {[
                  { step: "PO Created", time: "Jan 15, 09:00", done: true },
                  { step: "Supplier Confirmed", time: "Jan 15, 11:30", done: true },
                  { step: "In Transit", time: "Jan 16, 08:00", done: true },
                  { step: "Delivered", time: "Pending", done: false },
                ].map((item, i) => (
                  <div key={item.step} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      item.done ? "bg-emerald-500/20" : "bg-white/5"
                    }`}>
                      {item.done ? <CheckCircle2 size={10} className="text-emerald-400" /> : <Clock size={10} className="text-white/20" />}
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${item.done ? "text-white" : "text-white/40"}`}>{item.step}</p>
                      <p className="text-[10px] text-white/30">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/5">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-base text-white text-xs font-medium hover:opacity-90 transition-opacity">
              <Eye size={14} /> View Invoice
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 text-white/60 text-xs font-medium hover:bg-white/10 transition-colors">
              <Download size={14} /> Download PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Analytics View ──
function AnalyticsView() {
  const maxSpend = Math.max(...ANALYTICS_DATA.map((d) => d.spend));

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center gap-3">
        {["7 Days", "30 Days", "90 Days", "12 Months"].map((period, i) => (
          <button
            key={period}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              i === 1 ? "bg-accent-base text-white" : "bg-white/5 text-white/40 hover:text-white"
            }`}
          >
            {period}
          </button>
        ))}
      </div>

      {/* Spend Chart */}
      <div className="rounded-xl bg-[#1a1a24] border border-white/5 p-5">
        <h3 className="text-sm font-semibold text-white mb-6">Monthly Spend Trend</h3>
        <div className="flex items-end gap-3 h-48">
          {ANALYTICS_DATA.map((data) => (
            <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-[10px] text-white/40">EGP {(data.spend / 1000000).toFixed(1)}M</span>
              <div
                className="w-full rounded-t-md bg-accent-base/30 hover:bg-accent-base/50 transition-colors cursor-pointer relative group"
                style={{ height: `${(data.spend / maxSpend) * 100}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#0c0c12] border border-white/10 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  EGP {data.spend.toLocaleString()}
                </div>
              </div>
              <span className="text-[10px] text-white/30">{data.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Spend", value: "EGP 11.7M", sub: "Last 6 months", icon: DollarSign },
          { label: "Avg. Order Value", value: "EGP 48.5K", sub: "+8% vs prior", icon: TrendingUp },
          { label: "Cost Savings", value: "EGP 2.1M", sub: "18% reduction", icon: BarChart3 },
        ].map((stat) => (
          <div key={stat.label} className="p-5 rounded-xl bg-[#1a1a24] border border-white/5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                <stat.icon size={14} className="text-white/30" />
              </div>
              <span className="text-xs text-white/40">{stat.label}</span>
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-[11px] text-white/30 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Top Suppliers */}
      <div className="rounded-xl bg-[#1a1a24] border border-white/5">
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className="text-sm font-semibold text-white">Top Suppliers by Spend</h3>
        </div>
        <div className="p-5 space-y-3">
          {[
            { name: "Cairo Fresh Produce", spend: "EGP 340K", pct: 28 },
            { name: "Nile Linens Ltd.", spend: "EGP 280K", pct: 23 },
            { name: "Delta Cleaning Co.", spend: "EGP 210K", pct: 18 },
            { name: "Sinai Water Supply", spend: "EGP 180K", pct: 15 },
            { name: "Giza Electronics", spend: "EGP 120K", pct: 10 },
          ].map((supplier, i) => (
            <div key={supplier.name} className="flex items-center gap-4">
              <span className="text-xs text-white/30 w-4">{i + 1}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-white">{supplier.name}</span>
                  <span className="text-xs text-white/40">{supplier.spend}</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-accent-base/50" style={{ width: `${supplier.pct}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
