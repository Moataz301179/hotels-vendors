"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, CheckCircle2, Clock, Truck,
  ArrowUpRight, ArrowDownRight, Search, Eye,
  X, Download, Check, Ban,
} from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { LoadingCard, LoadingTable } from "@/components/dashboards/shared/loading-card";
import { EmptyState } from "@/components/dashboards/shared/empty-state";
import { CardTable, CardTableColumn } from "@/components/shared/card-table";
import { OrderDetailPanel } from "@/components/shared/order-detail-panel";

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
    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}>
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
    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${colors[status] || colors.UNPAID}`}>
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkLoading, setBulkLoading] = useState(false);
  const [bulkMessage, setBulkMessage] = useState<string | null>(null);

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

  const allFilteredIds = filteredOrders.map((o) => o.id);
  const allSelected = allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.has(id));
  const someSelected = allFilteredIds.some((id) => selectedIds.has(id));

  const toggleSelectAll = useCallback(() => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        allFilteredIds.forEach((id) => next.delete(id));
      } else {
        allFilteredIds.forEach((id) => next.add(id));
      }
      return next;
    });
  }, [allSelected, allFilteredIds]);

  const toggleRow = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const exportCsv = useCallback(() => {
    const selected = filteredOrders.filter((o) => selectedIds.has(o.id));
    const rows = selected.length > 0 ? selected : filteredOrders;
    const header = ["Order #", "Hotel", "Supplier", "Items", "Amount", "Status", "Delivery Date", "Created"];
    const csvRows = rows.map((o) => [
      o.orderNumber,
      o.hotel?.name ?? "",
      o.supplier?.name ?? "",
      String(o.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0),
      o.total.toFixed(2),
      o.status,
      o.deliveryDate ? new Date(o.deliveryDate).toISOString().slice(0, 10) : "",
      new Date(o.createdAt).toISOString().slice(0, 10),
    ]);
    const csv = [header, ...csvRows].map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `orders-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [filteredOrders, selectedIds]);

  const bulkAction = useCallback(async (action: "APPROVE" | "REJECT") => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    setBulkLoading(true);
    setBulkMessage(null);
    try {
      const res = await fetch("/api/v1/orders/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids, action }),
      });
      const json = await res.json();
      if (!res.ok) {
        setBulkMessage(json.error || "Bulk action failed");
      } else {
        setBulkMessage(`${action === "APPROVE" ? "Approved" : "Rejected"} ${json.processed} order(s). ${json.skipped} skipped.`);
        clearSelection();
      }
    } catch {
      setBulkMessage("Network error — please try again.");
    } finally {
      setBulkLoading(false);
      setTimeout(() => setBulkMessage(null), 5000);
    }
  }, [selectedIds, clearSelection]);

  const orderColumns: CardTableColumn<Order>[] = [
    {
      key: "orderNumber",
      label: "Order ID",
      primary: true,
      render: (o) => <span className="text-xs font-mono text-white/60">{o.orderNumber}</span>,
    },
    {
      key: "hotel",
      label: "Hotel",
      render: (o) => <span className="text-xs text-white">{o.hotel?.name || "—"}</span>,
    },
    {
      key: "supplier",
      label: "Supplier",
      render: (o) => <span className="text-[11px] text-white/40">{o.supplier?.name || "—"}</span>,
    },
    {
      key: "items",
      label: "Items",
      render: (o) => (
        <span className="text-xs text-white">{o.items?.reduce((sum, i) => sum + i.quantity, 0) || 0}</span>
      ),
    },
    {
      key: "total",
      label: "Amount",
      render: (o) => (
        <span className="text-xs font-semibold text-white">{formatCurrency(o.total, o.currency)}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      badge: true,
      render: (o) => <StatusBadge status={o.status} />,
    },
    {
      key: "deliveryDate",
      label: "Delivery",
      render: (o) => (
        <span className="text-[11px] text-white/30">
          {o.deliveryDate ? new Date(o.deliveryDate).toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "action",
      label: "",
      align: "right",
      hideOnMobile: true,
      render: (o) => (
        <button
          onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}
          className="p-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/[0.04] text-white/20 hover:text-white/60 transition-colors"
          aria-label={`View order ${o.orderNumber}`}
        >
          <Eye size={14} />
        </button>
      ),
    },
  ];

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

      {/* Bulk Action Toolbar */}
      <AnimatePresence>
        {selectedIds.size > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between rounded-xl border border-accent-base/20 bg-accent-base/[0.06] px-4 py-3"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-white">
                {selectedIds.size} order{selectedIds.size !== 1 ? "s" : ""} selected
              </span>
              <button
                onClick={clearSelection}
                className="p-1 rounded hover:bg-white/[0.06] text-white/40 hover:text-white transition-colors"
                aria-label="Clear selection"
              >
                <X size={14} />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={exportCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.04] border border-white/[0.06] text-white/60 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <Download size={13} />
                Export CSV
              </button>
              <button
                onClick={() => bulkAction("APPROVE")}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 disabled:opacity-40 transition-colors"
              >
                <Check size={13} />
                Approve
              </button>
              <button
                onClick={() => bulkAction("REJECT")}
                disabled={bulkLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 disabled:opacity-40 transition-colors"
              >
                <Ban size={13} />
                Reject
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Action Toast */}
      <AnimatePresence>
        {bulkMessage && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 text-sm text-white/70"
          >
            {bulkMessage}
          </motion.div>
        )}
      </AnimatePresence>

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
          <CardTable<Order>
            columns={orderColumns}
            data={filteredOrders}
            getRowId={(o) => o.id}
            onRowClick={(o) => setSelectedOrder(o)}
            selectedIds={selectedIds}
            onToggleRow={toggleRow}
            onToggleAll={toggleSelectAll}
            allSelected={allSelected}
            someSelected={someSelected}
          />
        )}
      </motion.div>

      {/* Order Detail Panel */}
      <OrderDetailPanel
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        onViewFull={(o) => window.open(`/orders/${o.id}`, "_self")}
      />
    </motion.div>
  );
}
