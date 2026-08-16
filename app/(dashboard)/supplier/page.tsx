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
      className="mx-auto max-w-[1600px] space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fadeInUp} className="flex items-start justify-between rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Supplier Central</h1>
          <p className="mt-0.5 text-sm text-slate-500">Manage orders, inventory, and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-xs text-slate-700 transition-all hover:bg-slate-100">
            <FileText size={14} />
            Reports
          </button>
          <button className="flex items-center gap-2 rounded-lg bg-[var(--accent-base)] px-4 py-2.5 text-xs font-medium text-[#1a140f] transition-all hover:opacity-90">
            <Plus size={14} />
            Add Product
          </button>
        </div>
      </motion.div>

      <motion.div variants={staggerContainer} className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <LoadingCard key={i} />)
          : stats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeInUp}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.04)] transition-colors"
              >
                <div className="mb-3 flex items-start justify-between">
                  <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500">{s.label}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100">
                    <s.icon size={15} className="text-slate-500" />
                  </div>
                </div>
                <p className="text-xl font-bold text-slate-900">{s.value}</p>
                <div className="mt-1 flex items-center gap-1">
                  {s.up ? <ArrowUpRight size={12} className="text-emerald-500" /> : <ArrowDownRight size={12} className="text-red-500" />}
                  <span className={`text-[11px] font-medium ${s.up ? "text-emerald-600" : "text-red-600"}`}>{s.change}</span>
                </div>
              </motion.div>
            ))}
      </motion.div>

      <motion.div variants={fadeInUp} className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <ClipboardList size={14} className="text-slate-500" />
              Incoming Orders
            </h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-4 text-xs text-slate-700 placeholder:text-slate-400 focus:border-[var(--accent-base)] focus:outline-none"
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
            <div className="overflow-hidden overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
              <table className="w-full min-w-[640px]">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Order</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Hotel</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Amount</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Status</th>
                    <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500">Date</th>
                    <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-slate-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-slate-200 transition-colors hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs text-slate-600">{order.orderNumber}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-slate-700">{order.hotel?.name || "—"}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-semibold text-slate-800">{formatCurrency(order.total, order.currency)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-[11px] text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
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
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
              <Package size={14} className="text-slate-500" />
              Product Catalog
            </h3>
            {inventoryLoading ? (
              <LoadingTable rows={3} />
            ) : products.length === 0 ? (
              <EmptyState title="No products" description="Add your first product to start selling." icon="package" />
            ) : (
              <div className="space-y-2">
                {products.slice(0, 5).map((product) => (
                  <div key={product.id} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2.5">
                    <div>
                      <p className="text-xs text-slate-800">{product.name}</p>
                      <p className="text-[10px] text-slate-500">{product.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-800">{formatCurrency(product.unitPrice)}</p>
                      <p className={`text-[9px] ${product.stockQuantity <= 10 ? "text-red-500" : "text-slate-500"}`}>
                        {product.stockQuantity} in stock
                      </p>
                    </div>
                  </div>
                ))}
                {products.length > 5 && (
                  <p className="pt-1 text-center text-[10px] text-slate-500">+ {products.length - 5} more products</p>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.04)]">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">Order Pipeline</h3>
            <div className="space-y-3">
              {[
                { label: "Pending", count: orders.filter((o) => o.status === "PENDING_APPROVAL").length, color: "bg-amber-500" },
                { label: "Approved", count: orders.filter((o) => o.status === "APPROVED").length, color: "bg-blue-500" },
                { label: "In Transit", count: orders.filter((o) => o.status === "IN_TRANSIT").length, color: "bg-[var(--accent-base)]" },
                { label: "Delivered", count: orders.filter((o) => o.status === "DELIVERED").length, color: "bg-emerald-500" },
              ].map((stage) => (
                <div key={stage.label} className="flex items-center gap-3">
                  <span className={`h-2 w-2 rounded-full ${stage.color}`} />
                  <span className="flex-1 text-xs text-slate-500">{stage.label}</span>
                  <span className="text-xs font-semibold text-slate-700">{stage.count}</span>
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
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Total</p>
                <p className="mt-0.5 text-sm font-medium text-slate-800">{formatCurrency(selectedOrder.total, selectedOrder.currency)}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedOrder.status} /></div>
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-wider text-slate-500">Items</p>
              <div className="space-y-1.5">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2">
                    <span className="text-xs text-slate-600">{item.product?.name}</span>
                    <span className="text-xs text-slate-500">× {item.quantity}</span>
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
