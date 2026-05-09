"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShoppingCart, Package, TrendingDown, AlertTriangle,
  ArrowUpRight, ArrowDownRight, Plus, Search, Eye,
  Building2, Calendar, FileText, Truck,
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
  supplier: { name: string };
  hotel: { name: string };
  items: { quantity: number; product: { name: string } }[];
}

interface Product {
  id: string;
  sku: string;
  name: string;
  stockQuantity: number;
  reorderPoint: number;
  unitPrice: number;
  supplier: { name: string };
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    DRAFT: { bg: "bg-white/10", text: "text-white/40", dot: "bg-white/40", label: "Draft" },
    PENDING_APPROVAL: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    APPROVED: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Approved" },
    CONFIRMED: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "Confirmed" },
    IN_TRANSIT: { bg: "bg-[#022349]/10", text: "text-[#022349]", dot: "bg-[#022349]", label: "In Transit" },
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
    CANCELLED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Cancelled" },
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

export default function HotelDashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { data: ordersData, loading: ordersLoading, error: ordersError } = useApi<{ orders: Order[]; pagination: { total: number } }>(
    "/api/v1/hotel/orders?page=1&limit=10&sortOrder=desc"
  );

  const { data: spendData, loading: spendLoading } = useApi<{
    totalSpend: number;
    totalOrders: number;
    byCategory: Record<string, { amount: number; orderCount: number }>;
  }>("/api/v1/hotel/spend");

  const { data: catalogData, loading: catalogLoading } = useApi<{ products: Product[]; pagination: { total: number } }>(
    "/api/v1/hotel/catalog?page=1&limit=20"
  );

  const orders = ordersData?.orders ?? [];
  const products = catalogData?.products ?? [];

  const stats = useMemo(() => {
    const totalSpend = spendData?.totalSpend ?? 0;
    const activeOrders = orders.filter((o) => !["DELIVERED", "CANCELLED", "DRAFT"].includes(o.status)).length;
    const inventoryItems = catalogData?.pagination?.total ?? 0;
    const savings = Math.round(totalSpend * 0.12); // 12% benchmark savings

    return [
      { label: "Total Spend", value: formatCurrency(totalSpend), change: "This year", up: true, icon: ShoppingCart },
      { label: "Active Orders", value: activeOrders.toString(), change: `${orders.length} total`, up: activeOrders > 0, icon: Package },
      { label: "Inventory Items", value: inventoryItems.toString(), change: "In catalog", up: true, icon: Package },
      { label: "Est. Savings", value: formatCurrency(savings), change: "12% vs market", up: true, icon: TrendingDown },
    ];
  }, [spendData, orders, catalogData]);

  const lowStockItems = useMemo(() => {
    return products.filter((p) => p.stockQuantity <= p.reorderPoint).slice(0, 5);
  }, [products]);

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.supplier?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isLoading = ordersLoading || spendLoading || catalogLoading;

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
          <h1 className="text-2xl font-bold tracking-tight text-white">Hotel Procurement Portal</h1>
          <p className="text-sm text-white/40 mt-0.5">Track spend, manage orders, and monitor inventory across all properties</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-white/80 transition-all">
            <FileText size={14} />
            Reports
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#022349] hover:bg-[#022349]/80 text-xs text-white font-medium transition-all">
            <Plus size={14} />
            New Order
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
        {/* Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <ShoppingCart size={14} className="text-white/40" />
              Recent Orders
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
              description="Your orders will appear here once you start purchasing."
              action={
                <button className="px-4 py-2 rounded-lg bg-[#022349] text-xs text-white font-medium">
                  Browse Catalog
                </button>
              }
            />
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Order</th>
                    <th className="text-left px-4 py-3 text-[10px] font-semibold text-white/30 uppercase tracking-wider">Supplier</th>
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
                        <span className="text-xs text-white">{order.supplier?.name || "—"}</span>
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
          {/* Inventory Alerts */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <AlertTriangle size={14} className="text-white/40" />
              Inventory Alerts
            </h3>
            {catalogLoading ? (
              <LoadingTable rows={3} />
            ) : lowStockItems.length === 0 ? (
              <EmptyState title="All stocked" description="No low stock items." icon="package" />
            ) : (
              <div className="space-y-2">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.015] border border-white/[0.04]">
                    <div>
                      <p className="text-xs text-white">{item.name}</p>
                      <p className="text-[10px] text-white/25">{item.supplier?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-red-400">{item.stockQuantity} left</p>
                      <p className="text-[9px] text-white/20">min: {item.reorderPoint}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "New Order", icon: Plus, href: "/hotel/catalog" },
                { label: "Browse Catalog", icon: Package, href: "/hotel/catalog" },
                { label: "Track Shipments", icon: Truck, href: "/shipping" },
                { label: "View Invoices", icon: FileText, href: "/eta" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all"
                >
                  <action.icon size={16} className="text-white/30" />
                  <span className="text-[10px] text-white/40">{action.label}</span>
                </a>
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
        description={`Placed on ${selectedOrder ? new Date(selectedOrder.createdAt).toLocaleDateString() : ""}`}
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Supplier</p>
                <p className="text-sm text-white mt-0.5">{selectedOrder.supplier?.name}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Total</p>
                <p className="text-sm text-white mt-0.5">{formatCurrency(selectedOrder.total, selectedOrder.currency)}</p>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedOrder.status} /></div>
              </div>
              <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                <p className="text-[10px] text-white/20 uppercase">Delivery</p>
                <p className="text-sm text-white mt-0.5">
                  {selectedOrder.deliveryDate ? new Date(selectedOrder.deliveryDate).toLocaleDateString() : "Not scheduled"}
                </p>
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
