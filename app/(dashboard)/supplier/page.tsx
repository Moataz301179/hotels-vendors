"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Store, Package, ClipboardList, TrendingUp, ArrowUpRight, ArrowDownRight,
  Search, Filter, Plus, Star, Clock, CheckCircle2, XCircle,
  BarChart3, Eye, Edit3,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  unitPrice: number;
  minOrderQty: number;
  status: string;
  inventorySnapshots: { stockQuantity: number; createdAt: string }[];
}

interface Order {
  id: string;
  orderNumber: string;
  hotel: { name: string };
  items: { quantity: number; product: { name: string } }[];
  total: number;
  status: string;
  createdAt: string;
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    OPEN: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Open" },
    RESPONDED: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "Responded" },
    CLOSED: { bg: "bg-white/5", text: "text-white/40", dot: "bg-white/30", label: "Closed" },
    AWARDED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Awarded" },
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
    IN_TRANSIT: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "In Transit" },
    APPROVED: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "Approved" },
    PENDING_APPROVAL: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Rejected" },
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
  if (ratio >= 10) return <span className="text-[11px] text-emerald-400">{stock} in stock</span>;
  if (ratio >= 5) return <span className="text-[11px] text-[#022349]">{stock} low stock</span>;
  return <span className="text-[11px] text-red-400">{stock} critical</span>;
}

function SkeletonCard() {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 animate-pulse">
      <div className="h-3 w-20 bg-white/10 rounded mb-3" />
      <div className="h-6 w-24 bg-white/10 rounded mb-2" />
      <div className="h-3 w-16 bg-white/10 rounded" />
    </div>
  );
}

function SkeletonTable() {
  return (
    <div className="animate-pulse space-y-2 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-10 bg-white/[0.02] rounded" />
      ))}
    </div>
  );
}

const CATEGORY_COLORS: Record<string, string> = {
  "F&B": "#022349",
  "Food & Beverage": "#022349",
  "Housekeeping": "#60a5fa",
  "Linens": "#a78bfa",
  "Linens & Textiles": "#a78bfa",
  "Amenities": "#fbbf24",
  "Room Amenities": "#fbbf24",
  "Engineering": "#34d399",
  "Engineering & Maintenance": "#34d399",
  "IT & Technology": "#f472b6",
};

export default function SupplierPortalPage() {
  const [search, setSearch] = useState("");

  const { data: productsData, loading: productsLoading } = useApi<{ products: Product[]; pagination: { total: number } }>(
    "/api/v1/supplier/inventory?page=1&limit=20"
  );

  const { data: ordersData, loading: ordersLoading } = useApi<{ orders: Order[]; pagination: { total: number } }>(
    "/api/v1/supplier/orders?page=1&limit=10"
  );

  const products = productsData?.products ?? [];
  const orders = ordersData?.orders ?? [];

  const filteredInventory = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((i) => i.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q));
  }, [products, search]);

  const metrics = useMemo(() => {
    const activeListings = products.filter((p) => p.status === "ACTIVE").length;
    const pendingOrders = orders.filter((o) => !["DELIVERED", "REJECTED", "CANCELLED"].includes(o.status)).length;
    const lowStock = products.filter((p) => {
      const stock = p.inventorySnapshots[0]?.stockQuantity ?? 0;
      return stock > 0 && stock < p.minOrderQty * 5;
    }).length;

    return [
      { label: "Active Listings", value: activeListings.toString(), change: `${products.length} total products`, up: true, icon: Package },
      { label: "Pending Orders", value: pendingOrders.toString(), change: `${orders.length} total orders`, up: true, icon: ClipboardList },
      { label: "Low Stock Alerts", value: lowStock.toString(), change: lowStock > 0 ? "Action required" : "All healthy", up: lowStock === 0, icon: Clock },
      { label: "Inventory Value", value: "EGP —", change: "Calculating...", up: true, icon: TrendingUp },
    ];
  }, [products, orders]);

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
          <p className="text-sm text-white/40 mt-0.5">Manage inventory, respond to orders, and track marketplace performance</p>
        </div>
        <Link
          href="/supplier/products"
          className="px-4 py-2 text-xs font-semibold bg-[#022349] hover:bg-[#b91c1c] text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus size={14} />
          Add Product
        </Link>
      </motion.div>

      {/* Metrics */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics ? (
          metrics.map((m) => (
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
                {m.up ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
                <span className={`text-[11px] font-medium ${m.up ? "text-emerald-400" : "text-red-400"}`}>{m.change}</span>
              </div>
            </motion.div>
          ))
        ) : (
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
        )}
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
                  className="h-8 pl-8 pr-3 rounded-lg text-xs text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#022349]/40 transition-all w-48"
                />
              </div>
              <button className="h-8 px-2.5 rounded-lg border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.03] transition-colors">
                <Filter size={12} />
              </button>
            </div>
          </div>

          {productsLoading ? (
            <SkeletonTable />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.04]">
                    {["SKU", "Product", "Category", "Price", "Stock", "MOQ", ""].map((h) => (
                      <th key={h} className="text-left px-4 py-2.5 text-[10px] font-medium text-white/25 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-white/30">
                        No products found. <Link href="/supplier/products" className="text-[#022349] hover:underline">Add your first product</Link>.
                      </td>
                    </tr>
                  ) : (
                    filteredInventory.map((item) => {
                      const stock = item.inventorySnapshots[0]?.stockQuantity ?? 0;
                      const color = CATEGORY_COLORS[item.category] || "#022349";
                      return (
                        <tr key={item.id} className="border-b border-white/[0.03] hover:bg-white/[0.015] transition-colors group">
                          <td className="px-4 py-3 text-[11px] font-mono text-white/40">{item.sku}</td>
                          <td className="px-4 py-3 text-xs font-medium text-white">{item.name}</td>
                          <td className="px-4 py-3">
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
                              {item.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-white/60">EGP {item.unitPrice.toLocaleString()}</td>
                          <td className="px-4 py-3"><StockIndicator stock={stock} moq={item.minOrderQty} /></td>
                          <td className="px-4 py-3 text-xs text-white/30">{item.minOrderQty}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button className="p-1 rounded text-white/20 hover:text-white/60 hover:bg-white/[0.05]"><Eye size={12} /></button>
                              <button className="p-1 rounded text-white/20 hover:text-[#022349] hover:bg-white/[0.05]"><Edit3 size={12} /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Orders Panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <ClipboardList size={14} className="text-white/40" />
              Incoming Orders
            </h3>
            {ordersLoading ? (
              <div className="animate-pulse space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-20 bg-white/[0.02] rounded-lg" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <p className="text-xs text-white/30 py-4 text-center">No incoming orders yet.</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-3 rounded-lg border border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-mono text-white/40">{order.orderNumber}</span>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs font-medium text-white">{order.hotel.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-white/25">{order.items.reduce((s, it) => s + it.quantity, 0)} items</span>
                      <span className="text-[10px] text-white/30">EGP {order.total.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <TrendingUp size={14} className="text-white/40" />
              Performance
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-white/40">On-Time Fulfillment</span>
                <span className="text-xs font-semibold text-white">94%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04]">
                <div className="h-full w-[94%] rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[11px] text-white/40">Order Acceptance</span>
                <span className="text-xs font-semibold text-white">87%</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.04]">
                <div className="h-full w-[87%] rounded-full bg-[#022349]" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
