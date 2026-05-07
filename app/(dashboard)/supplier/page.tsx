"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store, Package, ClipboardList, TrendingUp, ArrowUpRight, ArrowDownRight,
  Search, Filter, Plus, Star, MapPin, Clock, CheckCircle2, XCircle,
  BarChart3, Eye, Edit3, Trash2,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

/* ─── MOCK DATA ─── */
const METRICS = [
  { label: "Active Listings", value: "124", change: "+8 this week", up: true, icon: Package },
  { label: "Pending Orders", value: "23", change: "+5", up: true, icon: ClipboardList },
  { label: "RFQ Responses", value: "7", change: "2 due today", up: false, icon: Clock },
  { label: "Avg. Rating", value: "4.7", change: "+0.2", up: true, icon: Star },
];

const INVENTORY = [
  { sku: "FB-001", name: "Premium Basmati Rice 5kg", category: "F&B", price: 185, stock: 450, moq: 50, rating: 4.8, views: 1240 },
  { sku: "HK-012", name: "Industrial Floor Cleaner 5L", category: "Housekeeping", price: 320, stock: 120, moq: 12, rating: 4.5, views: 890 },
  { sku: "LIN-045", name: "Egyptian Cotton Towel Set", category: "Linens", price: 1250, stock: 85, moq: 20, rating: 4.9, views: 2100 },
  { sku: "GRA-023", name: "Luxury Shampoo 300ml", category: "Amenities", price: 45, stock: 1200, moq: 100, rating: 4.6, views: 1560 },
  { sku: "ENG-008", name: "Pool Chlorine Tablets 10kg", category: "Engineering", price: 680, stock: 60, moq: 5, rating: 4.4, views: 720 },
  { sku: "FB-034", name: "Extra Virgin Olive Oil 1L", category: "F&B", price: 95, stock: 340, moq: 24, rating: 4.7, views: 980 },
];

const RFQS = [
  { id: "RFQ-2026-008", hotel: "Pickalbatros Palace Resort", items: 8, deadline: "2026-05-08", status: "OPEN", responses: 2 },
  { id: "RFQ-2026-007", hotel: "Sunrise Royal Makadi", items: 15, deadline: "2026-05-06", status: "RESPONDED", responses: 1 },
  { id: "RFQ-2026-006", hotel: "Baron Resort Sharm", items: 5, deadline: "2026-05-05", status: "CLOSED", responses: 4 },
  { id: "RFQ-2026-005", hotel: "Orascom El Gouna", items: 12, deadline: "2026-05-03", status: "AWARDED", responses: 3 },
];

const CATEGORY_COLORS: Record<string, string> = {
  "F&B": "#DC143C",
  "Housekeeping": "#60a5fa",
  "Linens": "#a78bfa",
  "Amenities": "#fbbf24",
  "Engineering": "#34d399",
};

/* ─── UTILS ─── */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    OPEN: { bg: "bg-[#60a5fa]/10", text: "text-[#60a5fa]", dot: "bg-[#60a5fa]", label: "Open" },
    RESPONDED: { bg: "bg-[#DC143C]/10", text: "text-[#DC143C]", dot: "bg-[#DC143C]", label: "Responded" },
    CLOSED: { bg: "bg-white/[0.04]", text: "text-white/40", dot: "bg-white/30", label: "Closed" },
    AWARDED: { bg: "bg-[#10B981]/10", text: "text-[#10B981]", dot: "bg-[#10B981]", label: "Awarded" },
  };
  const c = config[status] || config.OPEN;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function StockIndicator({ stock, moq }: { stock: number; moq: number }) {
  const ratio = stock / moq;
  if (ratio >= 10) return <span className="text-[11px] text-[#10B981]">{stock} in stock</span>;
  if (ratio >= 5) return <span className="text-[11px] text-[#DC143C]">{stock} low stock</span>;
  return <span className="text-[11px] text-[#EF4444]">{stock} critical</span>;
}

/* ─── PAGE ─── */
export default function SupplierPortalPage() {
  const [search, setSearch] = useState("");

  const filteredInventory = INVENTORY.filter(
    (i) => i.name.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Supplier Central</h1>
          <p className="text-sm text-white/40 mt-0.5">Manage inventory, respond to RFQs, and track marketplace performance</p>
        </div>
        <Link
          href="/supplier/products"
          className="px-4 py-2 text-xs font-semibold bg-[#DC143C] hover:bg-[#b91c1c] text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={14} />
          Add Product
        </Link>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {METRICS.map((m) => (
          <motion.div
            key={m.label}
            variants={fadeInUp}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{m.label}</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                <m.icon size={15} className="text-white/40" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{m.value}</p>
            <div className="flex items-center gap-1 mt-1">
              {m.up ? <ArrowUpRight size={12} className="text-[#10B981]" /> : <ArrowDownRight size={12} className="text-[#EF4444]" />}
              <span className={`text-[11px] font-medium ${m.up ? "text-[#10B981]" : "text-[#EF4444]"}`}>{m.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Main Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inventory Table */}
        <div className="lg:col-span-2 rounded-xl border border-white/[0.06] bg-white/[0.02]">
          <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Store size={14} className="text-white/40" />
              Inventory Management
            </h3>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/20" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 pr-3 rounded-lg text-xs text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#DC143C]/40 transition-all w-48"
                />
              </div>
              <button className="h-8 px-2.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-colors">
                <Filter size={12} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  {["SKU", "Product", "Category", "Price", "Stock", "Rating", "Views", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-2.5 text-[10px] font-medium text-white/25 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map((item) => (
                  <tr key={item.sku} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                    <td className="px-4 py-3 text-[11px] font-mono text-white/40">{item.sku}</td>
                    <td className="px-4 py-3 text-xs font-medium text-white">{item.name}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${CATEGORY_COLORS[item.category]}15`, color: CATEGORY_COLORS[item.category] }}>
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-white/60">EGP {item.price}</td>
                    <td className="px-4 py-3"><StockIndicator stock={item.stock} moq={item.moq} /></td>
                    <td className="px-4 py-3 text-xs text-[#fbbf24]">★ {item.rating}</td>
                    <td className="px-4 py-3 text-xs text-white/30">{item.views.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1 rounded text-white/20 hover:text-white/60 hover:bg-white/[0.05]"><Eye size={12} /></button>
                        <button className="p-1 rounded text-white/20 hover:text-[#DC143C] hover:bg-white/[0.05]"><Edit3 size={12} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RFQ Panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ClipboardList size={14} className="text-white/40" />
              RFQ Responses
            </h3>
            <div className="space-y-3">
              {RFQS.map((rfq) => (
                <div key={rfq.id} className="p-3 rounded-lg border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-mono text-white/40">{rfq.id}</span>
                    <StatusBadge status={rfq.status} />
                  </div>
                  <p className="text-xs font-medium text-white">{rfq.hotel}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] text-white/25">{rfq.items} items · Due {rfq.deadline}</span>
                    <span className="text-[10px] text-white/30">{rfq.responses} responses</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-white/40" />
              Performance
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/40">Conversion Rate</span>
                <span className="text-xs font-semibold text-white">34%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04]">
                <div className="h-full w-[34%] rounded-full bg-[#DC143C]" />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-white/40">Avg. Response Time</span>
                <span className="text-xs font-semibold text-white">4.2h</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04]">
                <div className="h-full w-[65%] rounded-full bg-[#10B981]" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
