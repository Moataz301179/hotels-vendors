"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  DollarSign,
  Activity,
  ShieldCheck,
  TrendingUp,
  ShoppingBag,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Truck,
  Search,
  Eye,
  ThumbsUp,
  XCircle,
  Loader2,
} from "lucide-react";
import { FinancialDashboard, type KPIData, type LedgerRow } from "@/components/dashboard/financial-dashboard";
import { ForecastWidget } from "@/components/dashboard/forecast-widget";
import { useApi } from "@/lib/hooks/use-api";
import { useSessionInfo } from "@/lib/hooks/use-session-info";
import { Modal } from "@/components/ui/modal";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
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
    IN_TRANSIT: { bg: "bg-cyan-500/10", text: "text-cyan-400", dot: "bg-cyan-400", label: "In Transit" },
    DELIVERED: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Delivered" },
    CANCELLED: { bg: "bg-red-500/10", text: "text-red-400", dot: "bg-red-400", label: "Cancelled" },
    DRAFT: { bg: "bg-surface-raised", text: "text-foreground-tertiary", dot: "bg-foreground-muted", label: "Draft" },
  };
  const c = config[status] || config.DRAFT;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export default function HotelDashboardPage() {
  const session = useSessionInfo();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const { data: ordersData, loading, refetch } = useApi<{ orders: Order[]; pagination: { total: number } }>(
    "/api/v1/orders?page=1&limit=20&sortOrder=desc"
  );
  const orders = ordersData?.orders ?? [];

  const kpis: KPIData[] = useMemo(() => {
    const total = orders.reduce((s, o) => s + (o.total || 0), 0);
    const processing = orders.filter(o => ["APPROVED", "CONFIRMED", "IN_TRANSIT"].includes(o.status)).length;
    const delivered = orders.filter(o => o.status === "DELIVERED").length;
    const deliveryRate = orders.length > 0 ? Math.round((delivered / orders.length) * 100) : 0;

    return [
      { label: "Total Order Value", value: `EGP ${total.toLocaleString()}`, change: `${orders.length} orders`, trend: "up" as const, icon: <DollarSign size={16} /> },
      { label: "Processing", value: processing.toString(), change: "Active", trend: "up" as const, icon: <Activity size={16} /> },
      { label: "Delivery Rate", value: `${deliveryRate}%`, change: `${delivered} delivered`, trend: deliveryRate >= 80 ? "up" as const : "down" as const, icon: <ShieldCheck size={16} /> },
      { label: "Settlement Rate", value: "—", change: "Requires payment data", trend: "up" as const, icon: <TrendingUp size={16} /> },
    ];
  }, [orders]);

  const ledgerData: LedgerRow[] = useMemo(() =>
    orders.slice(0, 10).map((o, i) => ({
      id: o.id,
      invoiceId: o.orderNumber,
      hotel: o.hotel?.name || "—",
      supplier: o.supplier?.name || "—",
      amount: o.total,
      currency: o.currency || "EGP",
      status: o.status === "DELIVERED" ? "delivered" : o.status === "INVOICED" ? "invoiced" : "pending",
      date: o.createdAt?.slice(0, 10) || "—",
      taxStamp: o.id,
      ledgerHash: `0x${i.toString(16).padStart(4, "0")}`,
      riskScore: 0,
    })),
  [orders]);

  const handleApprove = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVED" }),
      });
      const json = await res.json();
      if (json.success) refetch();
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1600px] mx-auto space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground m-0">Hotel Procurement Portal</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Track spend, manage orders, and monitor inventory across all properties
          </p>
        </div>
        <Link
          href="/dashboard/hotel/order"
          className="cta-glow px-5 py-2.5 bg-accent-base text-accent-text text-sm font-medium rounded-sm hover:bg-accent-light transition-colors"
        >
          New Purchase Order
        </Link>
      </div>

      <FinancialDashboard kpis={kpis} ledgerData={ledgerData} />

      <ForecastWidget />

      {/* Recent Orders Quick View */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-sm text-accent-base hover:underline">View all</Link>
        </div>
        {loading ? (
          <div className="rounded-xl border border-subtle bg-surface-raised p-8 text-center">
            <Loader2 className="w-6 h-6 text-foreground-muted animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet"
            description="Create your first purchase order to see activity here."
            action={
              <Link
                href="/dashboard/hotel/catalog"
                className="px-4 py-2 rounded-lg bg-accent-base text-foreground text-xs font-medium hover:bg-accent-light transition-colors"
              >
                Browse Catalog
              </Link>
            }
          />
        ) : (
          <div className="rounded-xl border border-subtle bg-surface-raised overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-subtle">
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Order</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Supplier</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Amount</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Date</th>
                  <th className="text-right px-4 py-3 text-[10px] font-semibold text-foreground-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="border-b border-subtle hover:bg-surface-raised transition-colors">
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono text-foreground-tertiary">{order.orderNumber}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-foreground">{order.supplier?.name || "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-foreground">{order.currency || "EGP"} {(order.total || 0).toLocaleString()}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] text-foreground-muted">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        {order.status === "PENDING_APPROVAL" && (
                          <button
                            onClick={() => handleApprove(order.id)}
                            disabled={actionLoading === order.id}
                            className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-foreground-muted hover:text-emerald-400 transition-colors disabled:opacity-50"
                            title="Quick Approve"
                          >
                            {actionLoading === order.id ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-1.5 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground-tertiary transition-colors"
                        >
                          <Eye size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`Order ${selectedOrder?.orderNumber}`}
        description={`${selectedOrder?.hotel?.name || ""} → ${selectedOrder?.supplier?.name || ""}`}
        size="md"
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Total</p>
                <p className="text-sm text-foreground mt-0.5">{selectedOrder.currency || "EGP"} {(selectedOrder.total || 0).toLocaleString()}</p>
              </div>
              <div className="p-3 rounded-lg bg-surface-raised border border-subtle">
                <p className="text-[10px] text-foreground-muted uppercase">Status</p>
                <div className="mt-0.5"><StatusBadge status={selectedOrder.status} /></div>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-foreground-muted uppercase mb-2">Items</p>
              <div className="space-y-1.5">
                {selectedOrder.items?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-surface-raised border border-subtle">
                    <span className="text-xs text-foreground-tertiary">{item.product?.name}</span>
                    <div className="text-right">
                      <span className="text-xs text-foreground-tertiary">× {item.quantity}</span>
                      <span className="text-xs text-foreground ml-2">{selectedOrder.currency || "EGP"} {(item.total || 0).toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {selectedOrder.status === "PENDING_APPROVAL" && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => { handleApprove(selectedOrder.id); setSelectedOrder(null); }}
                  disabled={actionLoading === selectedOrder.id}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                >
                  <ThumbsUp size={14} /> Approve
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  );
}
