"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingBag, CheckCircle2, Clock, Truck,
  ArrowUpRight, ArrowDownRight, Search, Eye,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { Modal } from "@/components/ui/modal";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  currency: string;
  createdAt: string;
  deliveryDate: string | null;
  hotel: { name: string };
  supplier: { name: string };
  items: { quantity: number; total: number; product: { name: string } }[];
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING_APPROVAL: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    APPROVED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Approved" },
    CONFIRMED: { bg: "bg-accent-base/10", text: "text-accent-base", dot: "bg-accent-base", label: "Confirmed" },
    IN_TRANSIT: { bg: "bg-accent-base/10", text: "text-accent-base", dot: "bg-accent-base", label: "In Transit" },
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
    CANCELLED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Cancelled" },
    DRAFT: { bg: "bg-white/10", text: "text-white/40", dot: "bg-white/40", label: "Draft" },
  };
  const c = config[status] || config.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PAID: "bg-emerald-500/10 text-emerald-400",
    PENDING: "bg-amber-500/10 text-amber-400",
    FACTORED: "bg-accent-base/10 text-accent-base",
    UNPAID: "bg-red-500/10 text-red-400",
  };
  return (
    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${colors[status] || colors.UNPAID}`}>
      {status || "Unpaid"}
    </span>
  );
}

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: ordersData, loading, error } = useApi<Order[]>("/api/v1/orders?page=1&limit=50&sortOrder=desc");
  const orders = ordersData ?? [];

  const stats = [
    { label: "Total Orders", value: orders.length.toString(), change: "All time", up: true, icon: ShoppingBag },
    { label: "Processing", value: orders.filter((o) => ["APPROVED", "CONFIRMED", "IN_TRANSIT"].includes(o.status)).length.toString(), change: "Active", up: true, icon: Clock },
    { label: "Delivered", value: orders.filter((o) => o.status === "DELIVERED").length.toString(), change: "Completed", up: true, icon: CheckCircle2 },
    { label: "In Transit", value: orders.filter((o) => o.status === "IN_TRANSIT").length.toString(), change: "Shipping", up: true, icon: Truck },
  ];

  const filteredOrders = orders.filter(
    (o) =>
      (filterStatus === "all" || o.status === filterStatus) &&
      (o.hotel?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase()))
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Order Management</h1>
          <p className="text-sm text-white/40 mt-0.5">Track, manage, and fulfill orders across the entire supply chain</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
          : stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeInUp}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] font-medium text-white/30 uppercase tracking-wider">{s.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center">
                    <s.icon size={15} className="text-white/40" />
                  </div>
                </div>
                <p className="text-xl font-bold text-white">{s.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {s.up ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
                  <span className={`text-[11px] font-medium ${s.up ? "text-emerald-400" : "text-red-400"}`}>{s.change}</span>
                </div>
              </motion.div>
            ))}
      </motion.div>

      {/* Search + Filters */}
      <motion.div variants={fadeInUp} className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search orders, hotels, suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent-base/50"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white/60 focus:outline-none"
        >
          <option value="all" className="bg-[#0a0a0a]">All Status</option>
          <option value="PENDING_APPROVAL" className="bg-[#0a0a0a]">Pending</option>
          <option value="APPROVED" className="bg-[#0a0a0a]">Approved</option>
          <option value="CONFIRMED" className="bg-[#0a0a0a]">Confirmed</option>
          <option value="IN_TRANSIT" className="bg-[#0a0a0a]">In Transit</option>
          <option value="DELIVERED" className="bg-[#0a0a0a]">Delivered</option>
          <option value="CANCELLED" className="bg-[#0a0a0a]">Cancelled</option>
        </select>
      </motion.div>

      {/* Orders Table */}
      <motion.div variants={fadeInUp}>
        {loading ? (
          <LoadingTable rows={6} />
        ) : error ? (
          <EmptyState title="Error loading orders" description={error} />
        ) : filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description="Try adjusting your search or filters."
            action={
              <button
                onClick={() => { setSearchQuery(""); setFilterStatus("all"); }}
                className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 hover:text-white transition-colors"
              >
                Clear Filters
              </button>
            }
          />
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Supplier</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Items</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Delivery</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-white/[0.04] hover:bg-white/[0.015] transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-white/60">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-white">{order.hotel?.name || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-white/40">{order.supplier?.name || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-white">{order.items?.reduce((sum, i) => sum + i.quantity, 0) || 0}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-white">{formatCurrency(order.total, order.currency)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-white/30">
                        {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors"
                      >
                        <Eye size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.orderNumber}`}
        description={`${selectedOrder?.hotel?.name} → ${selectedOrder?.supplier?.name}`}
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Total</p>
                <p className="text-sm text-white mt-0.5">{formatCurrency(selectedOrder.total, selectedOrder.currency)}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedOrder.status} /></div>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-white/20 uppercase mb-2">Items</p>
              <div className="space-y-1.5">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                    <span className="text-xs text-white/60">{item.product?.name}</span>
                    <div className="text-right">
                      <span className="text-xs text-white/40">× {item.quantity}</span>
                      <span className="text-xs text-white ml-2">{formatCurrency(item.total, selectedOrder.currency)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
