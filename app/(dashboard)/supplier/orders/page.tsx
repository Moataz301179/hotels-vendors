"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Eye,
  RefreshCw,
  Package,
  Truck,
  DollarSign,
  Clock,
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

interface OrdersApiResponse {
  orders: Order[];
  pagination?: { total: number };
}

type StatusTab = "all" | "pending" | "processing" | "shipped" | "delivered";

const STATUS_TABS: { key: StatusTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
];

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

function statusMatchesTab(status: string, tab: StatusTab): boolean {
  if (tab === "all") return true;
  const s = status.toLowerCase().replace(/_/g, " ");
  if (tab === "pending") return s.includes("pending") || s.includes("draft");
  if (tab === "processing") return s.includes("processing") || s.includes("approved") || s.includes("confirmed");
  if (tab === "shipped") return s.includes("shipped") || s.includes("transit");
  if (tab === "delivered") return s.includes("delivered");
  return false;
}

export default function SupplierOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<StatusTab>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [updateOrder, setUpdateOrder] = useState<Order | null>(null);

  const { data, loading, error, refetch } = useApi<OrdersApiResponse>("/api/orders");

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
    const newOrders = orders.filter((o) =>
      statusMatchesTab(o.status, "pending")
    ).length;
    const processing = orders.filter((o) =>
      statusMatchesTab(o.status, "processing")
    ).length;
    const shipped = orders.filter((o) =>
      statusMatchesTab(o.status, "shipped")
    ).length;
    const revenue = orders
      .filter((o) => !o.status.toLowerCase().includes("cancel"))
      .reduce((sum, o) => sum + o.total, 0);

    return [
      { label: "New Orders", value: newOrders.toString(), icon: Clock, color: "text-amber-400" },
      { label: "Processing", value: processing.toString(), icon: Package, color: "text-purple-400" },
      { label: "Shipped", value: shipped.toString(), icon: Truck, color: "text-cyan-400" },
      { label: "Revenue", value: formatCurrency(revenue), icon: DollarSign, color: "text-emerald-400" },
    ];
  }, [orders]);

  return (
    <motion.div
      className="max-w-[1600px] mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Order Fulfillment</h1>
          <p className="text-sm text-white/40 mt-0.5">Track and manage incoming orders from hotels</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-white/80 transition-all self-start"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
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
                    <s.icon size={15} className={s.color} />
                  </div>
                </div>
                <p className="text-xl font-bold text-white">{s.value}</p>
              </motion.div>
            ))}
      </motion.div>

      {/* Tabs + Search */}
      <motion.div variants={fadeInUp} className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {STATUS_TABS.map((tab) => {
            const count = orders.filter((o) => statusMatchesTab(o.status, tab.key)).length;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-white/[0.06] text-white border border-white/[0.08]"
                    : "text-white/30 hover:text-white/60 hover:bg-white/[0.02]"
                }`}
              >
                {tab.label}
                <span className={`ml-1.5 text-[10px] ${isActive ? "text-white/50" : "text-white/15"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative flex-1 lg:max-w-xs lg:ml-auto">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            type="text"
            placeholder="Search by order ID or hotel..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#022349]/50 w-full"
          />
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
                        <button
                          onClick={() => setUpdateOrder(order)}
                          className="p-1.5 rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors"
                          title="Update Status"
                        >
                          <RefreshCw size={14} />
                        </button>
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
            <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <p className="text-[10px] text-white/20 uppercase">Order Date</p>
              <p className="text-sm text-white mt-0.5">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}
      </Modal>

      {/* Update Status Modal (placeholder) */}
      <Modal
        isOpen={!!updateOrder}
        onClose={() => setUpdateOrder(null)}
        title="Update Order Status"
        description={`Order ${updateOrder?.orderNumber}`}
        size="sm"
      >
        {updateOrder && (
          <div className="space-y-3">
            <p className="text-xs text-white/40">Current status:</p>
            <div className="flex items-center gap-2">
              <StatusPill status={updateOrder.status} />
            </div>
            <div className="pt-2">
              <p className="text-xs text-white/40 mb-2">Select new status:</p>
              <div className="grid grid-cols-2 gap-2">
                {["Pending", "Processing", "Shipped", "Delivered"].map((s) => (
                  <button
                    key={s}
                    className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white/60 hover:bg-white/[0.04] hover:text-white transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setUpdateOrder(null)}
                className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-xs text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setUpdateOrder(null)}
                className="px-4 py-2 rounded-lg bg-[#022349] text-xs text-white font-medium hover:bg-[#022349]/80 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
