"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package, TrendingUp, Clock, Star,
  ArrowUpRight, ArrowDownRight, Plus, Search, Eye,
  ClipboardList, Truck, FileText,
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
  hotel: { name: string };
  items: { quantity: number; product: { name: string } }[];
}

interface Product {
  id: string;
  sku: string;
  name: string;
  stockQuantity: number;
  unitPrice: number;
  category: string;
  inventorySnapshots: { stockQuantity: number; createdAt: string }[];
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING_APPROVAL: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    APPROVED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Approved" },
    CONFIRMED: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "Confirmed" },
    IN_TRANSIT: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "In Transit" },
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

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

export default function SupplierDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: ordersData, loading: ordersLoading, error: ordersError } = useApi<{ orders: Order[]; pagination: { total: number } }>(
    "/api/v1/supplier/orders?page=1&limit=10&sortOrder=desc"
  );

  const { data: inventoryData, loading: inventoryLoading } = useApi<{ products: Product[]; pagination: { total: number } }>(
    "/api/v1/supplier/inventory?page=1&limit=20"
  );

  const orders = ordersData?.orders ?? [];
  const products = inventoryData?.products ?? [];

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== "CANCELLED" ? o.total : 0), 0);
    const pendingOrders = orders.filter((o) => o.status === "PENDING_APPROVAL").length;
    const deliveredOrders = orders.filter((o) => o.status === "DELIVERED").length;
    const avgRating = 4.6; // Would come from supplier profile API

    return [
      { label: "Total Orders", value: orders.length.toString(), change: `${deliveredOrders} delivered`, up: true, icon: ClipboardList },
      { label: "Revenue", value: formatCurrency(totalRevenue), change: "Net revenue", up: true, icon: TrendingUp },
      { label: "Pending", value: pendingOrders.toString(), change: "Awaiting approval", up: pendingOrders === 0, icon: Clock },
      { label: "Rating", value: avgRating.toString(), change: "4.8 peak", up: true, icon: Star },
    ];
  }, [orders]);

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.hotel?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = ordersLoading || inventoryLoading;

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
          <p className="text-sm text-white/40 mt-0.5">Manage orders, inventory, and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-white/80 transition-all">
            <FileText size={14} />
            Reports
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#022349] hover:bg-[#022349]/80 text-xs text-white font-medium transition-all">
            <Plus size={14} />
            Add Product
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {isLoading
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

      {/* Main Grid */}
      <motion.div variants={fadeInUp} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ClipboardList size={14} className="text-white/40" />
              Incoming Orders
            </h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-white placeholder:text-white/20 focus:outline-none focus:border-[#022349]/50 w-56"
              />
            </div>
          </div>

          {ordersLoading ? (
            <LoadingTable rows={5} />
          ) : ordersError ? (
            <EmptyState title="Error loading orders" description={ordersError} />
          ) : filteredOrders.length === 0 ? (
            <EmptyState
              title="No orders yet"
              description="Orders will appear here when hotels purchase your products."
            />
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Order</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Hotel</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Status</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Date</th>
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
                        <span className="text-xs font-semibold text-white">{formatCurrency(order.total, order.currency)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-white/30">{new Date(order.createdAt).toLocaleDateString()}</span>
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
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Inventory */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Package size={14} className="text-white/40" />
              Product Catalog
            </h3>
            {inventoryLoading ? (
              <LoadingTable rows={3} />
            ) : products.length === 0 ? (
              <EmptyState title="No products" description="Add your first product to start selling." icon="package" />
            ) : (
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                    <div>
                      <p className="text-xs text-white">{product.name}</p>
                      <p className="text-[10px] text-white/25">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-white">{formatCurrency(product.unitPrice)}</p>
                      <p className={`text-[9px] ${product.stockQuantity <= 10 ? "text-red-400" : "text-white/20"}`}>
                        {product.stockQuantity} in stock
                      </p>
                    </div>
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="text-[10px] text-white/20 text-center pt-1">+ {products.length - 5} more products</p>
                )}
              </div>
            )}
          </div>

          {/* Pipeline */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Order Pipeline</h3>
            <div className="space-y-3">
              {[
                { label: "Pending", count: orders.filter((o) => o.status === "PENDING_APPROVAL").length, color: "bg-amber-500" },
                { label: "Approved", count: orders.filter((o) => o.status === "APPROVED").length, color: "bg-blue-500" },
                { label: "In Transit", count: orders.filter((o) => o.status === "IN_TRANSIT").length, color: "bg-[#022349]" },
                { label: "Delivered", count: orders.filter((o) => o.status === "DELIVERED").length, color: "bg-emerald-500" },
              ].map((stage) => (
                <div key={stage.label} className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${stage.color}`} />
                  <span className="text-xs text-white/40 flex-1">{stage.label}</span>
                  <span className="text-xs font-semibold text-white">{stage.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Order Detail Modal */}
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
                <div className="mt-0.5"><StatusBadge status={selectedOrder.status} /></div>
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
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
