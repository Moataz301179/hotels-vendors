"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Search, Eye, RefreshCw, Package, Truck, DollarSign, Clock, Loader2,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { StatusPill } from "@/components/dashboards/shared/status-pill";
import { Modal } from "@/components/ui/modal";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface OrderItem {
  quantity: number;
  product: { name: string };
}

interface Hotel {
  name: string;
}

interface Order {
  id: string;
  orderNumber: string;
  hotel: Hotel;
  items: OrderItem[];
  total: number;
  currency?: string;
  status: string;
  createdAt: string;
}

type StatusTab = "all" | "pending" | "processing" | "shipped" | "delivered";

const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

// Valid status transitions for suppliers
const SUPPLIER_ACTIONS: Record<string, { label: string; nextStatus: string; color: string }[]> = {
  APPROVED: [{ label: "Confirm Order", nextStatus: "CONFIRMED", color: "bg-blue-500" }],
  CONFIRMED: [{ label: "Mark In Transit", nextStatus: "IN_TRANSIT", color: "bg-cyan-500" }],
  IN_TRANSIT: [
    { label: "Mark Delivered", nextStatus: "DELIVERED", color: "bg-emerald-500" },
    { label: "Partial Delivery", nextStatus: "PARTIALLY_DELIVERED", color: "bg-amber-500" },
  ],
  PARTIALLY_DELIVERED: [{ label: "Mark Delivered", nextStatus: "DELIVERED", color: "bg-emerald-500" }],
};

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

function statusMatchesTab(status: string, tab: StatusTab): boolean {
  if (tab === "all") return true;
  const s = status.toLowerCase().replace(/_/g, " ");
  if (tab === "pending") return s.includes("pending") || s.includes("draft");
  if (tab === "processing") return s.includes("processing") || s.includes("approved") || s.includes("confirmed");
  if (tab === "shipped") return s.includes("shipped") || s.includes("transit") || s.includes("partially");
  if (tab === "delivered") return s.includes("delivered");
  return false;
}

export default function SupplierOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateOrder, setUpdateOrder] = useState<Order | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState("");

  const { data, loading, error, refetch } = useApi<{ orders: Order[]; pagination?: { total: number } }>("/api/v1/supplier/orders");

  const orders = useMemo(() => data?.orders ?? [], [data]);

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch =
        o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.hotel?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTab = statusMatchesTab(o.status, activeTab);
      return matchesSearch && matchesTab;
    });
  }, [orders, searchQuery, activeTab]);

  const stats = useMemo(() => {
    const newOrders = orders.filter((o) => o.status === "PENDING_APPROVAL" || o.status === "APPROVED").length;
    const processing = orders.filter((o) => o.status === "CONFIRMED" || o.status === "IN_TRANSIT").length;
    const delivered = orders.filter((o) => o.status === "DELIVERED").length;
    const revenue = orders.filter((o) => o.status === "DELIVERED").reduce((sum, o) => sum + (o.total || 0), 0);
    return { newOrders, processing, delivered, revenue };
  }, [orders]);

  const handleStatusUpdate = useCallback(async (orderId: string, nextStatus: string) => {
    setUpdating(true);
    setUpdateError("");
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!json.success) {
        setUpdateError(json.error || "Update failed");
      } else {
        setUpdateOrder(null);
        refetch();
      }
    } catch (err: unknown) {
      setUpdateError(err instanceof Error ? err.message : "Network error");
    } finally {
      setUpdating(false);
    }
  }, [refetch]);

  const availableActions = updateOrder ? SUPPLIER_ACTIONS[updateOrder.status] || [] : [];

  return (
    <motion.div
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Order Fulfillment</h1>
          <p className="text-sm text-white/40 mt-0.5">Manage and fulfill incoming orders</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={fadeInUp} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "New Orders", value: stats.newOrders, icon: Package, color: "text-amber-400" },
          { label: "Processing", value: stats.processing, icon: Clock, color: "text-blue-400" },
          { label: "Delivered", value: stats.delivered, icon: Truck, color: "text-emerald-400" },
          { label: "Revenue", value: formatCurrency(stats.revenue), icon: DollarSign, color: "text-cyan-400" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={stat.color} />
                <span className="text-[10px] text-white/30 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className="text-lg font-semibold text-white">{stat.value}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Search & Tabs */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white placeholder:text-white/20 outline-none focus:border-white/12"
          />
        </div>
        <div className="flex gap-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab.key
                  ? "bg-accent-base/20 text-[#ff6b6b] border border-accent-base/30"
                  : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
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
            description={searchQuery || activeTab !== "all" ? "Try adjusting your filters." : "Orders will appear here when hotels purchase your products."}
            icon="inbox"
          />
        ) : (
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Order ID</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Items</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Date</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Actions</th>
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
                      <span className="text-xs text-white/60">
                        {order.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0} items
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-white">{formatCurrency(order.total, order.currency)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusPill status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-white/30">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors"
                          title="View"
                        >
                          <Eye size={14} />
                        </button>
                        {SUPPLIER_ACTIONS[order.status]?.length > 0 && (
                          <button
                            onClick={() => setUpdateOrder(order)}
                            className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors"
                            title="Update Status"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* View Order Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.orderNumber}`}
        description={`From ${selectedOrder?.hotel?.name}`}
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
                <div className="mt-0.5"><StatusPill status={selectedOrder.status} /></div>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-white/20 uppercase mb-2">Items</p>
              <div className="space-y-1.5">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                    <span className="text-xs text-white/60">{item.product?.name}</span>
                    <span className="text-xs text-white/40">× {item.quantity}</span>
                  </div>
                ))}
                {(!selectedOrder.items || selectedOrder.items.length === 0) && (
                  <p className="text-xs text-white/20">No items listed.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal */}
      <Modal
        isOpen={!!updateOrder}
        onClose={() => { setUpdateOrder(null); setUpdateError(""); }}
        title="Update Order Status"
        description={`Order ${updateOrder?.orderNumber}`}
        size="sm"
      >
        {updateOrder && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/40">Current:</span>
              <StatusPill status={updateOrder.status} />
            </div>

            {updateError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
                {updateError}
              </div>
            )}

            <div className="pt-1">
              <p className="text-xs text-white/40 mb-2">Select action:</p>
              <div className="grid gap-2">
                {availableActions.map((action) => (
                  <button
                    key={action.nextStatus}
                    disabled={updating}
                    onClick={() => handleStatusUpdate(updateOrder.id, action.nextStatus)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-white/80 hover:bg-white/[0.04] hover:border-white/[0.10] transition-all disabled:opacity-50 ${action.color.replace("bg-", "hover:bg-")}`}
                  >
                    <span>{action.label}</span>
                    {updating && <Loader2 size={14} className="animate-spin text-white/30" />}
                  </button>
                ))}
              </div>
              {availableActions.length === 0 && (
                <p className="text-xs text-white/20">No actions available for this status.</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
