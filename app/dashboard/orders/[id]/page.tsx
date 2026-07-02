"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  Building2,
  Calendar,
  Truck,
  FileText,
  ThumbsUp,
  XCircle,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
  User,
  Hash,
  CreditCard,
  Package,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { OrderPaymentButton } from "@/components/dashboards/shared/order-payment";

interface OrderItem {
  id: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: { id: string; name: string; sku: string; unitOfMeasure: string };
}

interface Approval {
  id: string;
  action: string;
  reason: string | null;
  createdAt: string;
  approver: { id: string; name: string; role: string };
}

interface Invoice {
  id: string;
  invoiceNumber: string;
  total: number;
  status: string;
  etaStatus: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  subtotal: number;
  vatAmount: number;
  shippingCost: number;
  currency: string;
  paymentMethod: string;
  deliveryDate: string | null;
  deliveryInstructions: string | null;
  shippingMethod: string;
  poNumber: string | null;
  costCenter: string | null;
  createdAt: string;
  hotel: { id: string; name: string; city: string };
  supplier: { id: string; name: string; tier: string };
  property: { id: string; name: string } | null;
  outlet: { id: string; name: string } | null;
  items: OrderItem[];
  approvals: Approval[];
  invoices: Invoice[];
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PENDING_APPROVAL: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending Approval" },
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

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-EG", { year: "numeric", month: "short", day: "numeric" });
}

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    fetch(`/api/v1/orders/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setOrder(json.data?.order ?? json.order);
        else setError(json.error || "Failed to load order");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      const res = await fetch(`/api/v1/orders/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVED" }),
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccess("Order approved successfully");
        const refreshed = await fetch(`/api/v1/orders/${id}`);
        const refreshedJson = await refreshed.json();
        if (refreshedJson.success) setOrder(refreshedJson.data?.order ?? refreshedJson.order);
      } else {
        setActionError(json.error || "Failed to approve");
      }
    } catch {
      setActionError("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      const res = await fetch(`/api/v1/orders/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason || "No reason provided" }),
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccess("Order rejected");
        setRejectModalOpen(false);
        setRejectReason("");
        const refreshed = await fetch(`/api/v1/orders/${id}`);
        const refreshedJson = await refreshed.json();
        if (refreshedJson.success) setOrder(refreshedJson.data?.order ?? refreshedJson.order);
      } else {
        setActionError(json.error || "Failed to reject");
      }
    } catch {
      setActionError("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      const res = await fetch(`/api/v1/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (json.success) {
        setActionSuccess(`Order status updated to ${newStatus.replace(/_/g, " ")}`);
        const refreshed = await fetch(`/api/v1/orders/${id}`);
        const refreshedJson = await refreshed.json();
        if (refreshedJson.success) setOrder(refreshedJson.data?.order ?? refreshedJson.order);
      } else {
        setActionError(json.error || "Failed to update status");
      }
    } catch {
      setActionError("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-foreground-muted" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error || "Order not found"}
        </div>
        <button onClick={() => router.back()} className="mt-4 flex items-center gap-2 text-sm text-foreground-tertiary hover:text-foreground-tertiary transition-colors">
          <ArrowLeft size={14} /> Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground-tertiary transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">{order.orderNumber}</h1>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-foreground-tertiary mt-0.5">
              Created {formatDate(order.createdAt)} &middot; {order.hotel?.name} &rarr; {order.supplier?.name}
            </p>
          </div>
        </div>
      </div>

      {/* Action Messages */}
      {actionSuccess && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 size={14} /> {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle size={14} /> {actionError}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={14} className="text-foreground-muted" />
            <span className="text-[10px] text-foreground-muted uppercase tracking-wider">Total</span>
          </div>
          <p className="text-lg font-bold text-foreground">{formatCurrency(order.total, order.currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Truck size={14} className="text-foreground-muted" />
            <span className="text-[10px] text-foreground-muted uppercase tracking-wider">Shipping</span>
          </div>
          <p className="text-lg font-bold text-foreground">{order.shippingMethod?.replace(/_/g, " ") || "—"}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={14} className="text-foreground-muted" />
            <span className="text-[10px] text-foreground-muted uppercase tracking-wider">Delivery</span>
          </div>
          <p className="text-lg font-bold text-foreground">{order.deliveryDate ? formatDate(order.deliveryDate) : "—"}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2">
            <CreditCard size={14} className="text-foreground-muted" />
            <span className="text-[10px] text-foreground-muted uppercase tracking-wider">Payment</span>
          </div>
          <p className="text-lg font-bold text-foreground">{order.paymentMethod?.replace(/_/g, " ") || "—"}</p>
        </div>
      </div>

      {/* Detail Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Items */}
        <div className="lg:col-span-2 space-y-4">
          {/* Order Items */}
          <div className="rounded-xl border border-subtle bg-surface-raised overflow-hidden">
            <div className="px-5 py-3 border-b border-subtle flex items-center gap-2">
              <Package size={14} className="text-foreground-muted" />
              <h3 className="text-sm font-semibold text-foreground">Order Items ({order.items?.length || 0})</h3>
            </div>
            <div className="divide-y divide-white/[0.04]">
              {order.items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between px-5 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{item.product?.name}</p>
                    <p className="text-[11px] text-foreground-muted">{item.product?.sku} &middot; {item.product?.unitOfMeasure}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">{formatCurrency(item.total, order.currency)}</p>
                    <p className="text-[11px] text-foreground-muted">&times;{item.quantity} @ {formatCurrency(item.unitPrice)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t border-subtle space-y-1">
              <div className="flex justify-between text-xs"><span className="text-foreground-muted">Subtotal</span><span className="text-foreground-tertiary">{formatCurrency(order.subtotal, order.currency)}</span></div>
              {order.shippingCost > 0 && <div className="flex justify-between text-xs"><span className="text-foreground-muted">Shipping</span><span className="text-foreground-tertiary">{formatCurrency(order.shippingCost, order.currency)}</span></div>}
              <div className="flex justify-between text-xs"><span className="text-foreground-muted">VAT</span><span className="text-foreground-tertiary">{formatCurrency(order.vatAmount, order.currency)}</span></div>
              <div className="flex justify-between text-sm font-semibold pt-1 border-t border-subtle"><span className="text-foreground">Total</span><span className="text-foreground">{formatCurrency(order.total, order.currency)}</span></div>
            </div>
          </div>

          {/* Approvals Timeline */}
          <div className="rounded-xl border border-subtle bg-surface-raised p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
              <Clock size={14} className="text-foreground-muted" />
              Approval Timeline
            </h3>
            {(!order.approvals || order.approvals.length === 0) ? (
              <p className="text-xs text-foreground-muted text-center py-4">No approvals yet</p>
            ) : (
              <div className="space-y-3">
                {order.approvals.map((a) => (
                  <div key={a.id} className="flex items-start gap-3">
                    <div className={`p-1 rounded-full ${a.action === "APPROVED" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}`}>
                      {a.action === "APPROVED" ? <ThumbsUp size={12} /> : <XCircle size={12} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">{a.approver?.name || "Unknown"}</span>
                        <span className="text-[10px] text-foreground-muted">{formatDate(a.createdAt)}</span>
                      </div>
                      <span className="text-[10px] text-foreground-muted">{a.action} {a.reason && `— ${a.reason}`}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          {/* Supplier */}
          <div className="rounded-xl border border-subtle bg-surface-raised p-4">
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 size={14} className="text-foreground-muted" />
              Supplier
            </h3>
            <p className="text-sm font-medium text-foreground">{order.supplier?.name || "—"}</p>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-raised text-foreground-tertiary mt-1 inline-block">
              {order.supplier?.tier || "STANDARD"}
            </span>
          </div>

          {/* Hotel */}
          <div className="rounded-xl border border-subtle bg-surface-raised p-4">
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Building2 size={14} className="text-foreground-muted" />
              Hotel
            </h3>
            <p className="text-sm font-medium text-foreground">{order.hotel?.name || "—"}</p>
            {order.hotel?.city && <p className="text-xs text-foreground-muted mt-0.5">{order.hotel.city}</p>}
            {order.property && <p className="text-xs text-foreground-muted mt-0.5">Property: {order.property.name}</p>}
            {order.outlet && <p className="text-xs text-foreground-muted mt-0.5">Outlet: {order.outlet.name}</p>}
          </div>

          {/* Reference */}
          <div className="rounded-xl border border-subtle bg-surface-raised p-4">
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2">
              <Hash size={14} className="text-foreground-muted" />
              Reference
            </h3>
            {order.poNumber && <div className="flex justify-between text-xs mb-1"><span className="text-foreground-muted">PO#</span><span className="text-foreground-tertiary">{order.poNumber}</span></div>}
            {order.costCenter && <div className="flex justify-between text-xs mb-1"><span className="text-foreground-muted">Cost Center</span><span className="text-foreground-tertiary">{order.costCenter}</span></div>}
            <div className="flex justify-between text-xs"><span className="text-foreground-muted">Payment</span><span className="text-foreground-tertiary">{order.paymentMethod?.replace(/_/g, " ")}</span></div>
          </div>

          {/* Invoices */}
          {order.invoices && order.invoices.length > 0 && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-4">
              <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                <FileText size={14} className="text-foreground-muted" />
                Invoices
              </h3>
              <div className="space-y-2">
                {order.invoices.map((inv) => (
                  <div key={inv.id} className="flex items-center justify-between py-1.5">
                    <span className="text-xs text-foreground-tertiary font-mono">{inv.invoiceNumber}</span>
                    <span className="text-xs text-foreground-tertiary">{formatCurrency(inv.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Delivery Instructions */}
          {order.deliveryInstructions && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-4">
              <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-2">Instructions</h3>
              <p className="text-xs text-foreground-muted">{order.deliveryInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      {order.status === "PENDING_APPROVAL" && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-subtle bg-surface-raised">
          <span className="text-xs text-foreground-tertiary flex-1">This order is pending your approval</span>
          <button
            onClick={handleApprove}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <ThumbsUp size={14} />}
            Approve
          </button>
          <button
            onClick={() => setRejectModalOpen(true)}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50"
          >
            <XCircle size={14} />
            Reject
          </button>
        </div>
      )}

      {/* Supplier Fulfillment Controls */}
      {order.status === "CONFIRMED" && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-subtle bg-surface-raised">
          <span className="text-xs text-foreground-tertiary flex-1">This order is ready for fulfillment</span>
          <button
            onClick={() => handleStatusUpdate("IN_TRANSIT")}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-base/10 border border-accent-base/20 text-accent-base text-sm font-medium hover:bg-accent-base/20 transition-colors disabled:opacity-50"
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Truck size={14} />}
            Mark as In Transit
          </button>
        </div>
      )}

      {order.status === "IN_TRANSIT" && (
        <div className="flex items-center gap-3 p-4 rounded-xl border border-subtle bg-surface-raised">
          <span className="text-xs text-foreground-tertiary flex-1">Shipment is in transit</span>
          <button
            onClick={() => handleStatusUpdate("DELIVERED")}
            disabled={actionLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
            Mark as Delivered
          </button>
        </div>
      )}

      {/* Payment */}
      {order.status === "APPROVED" && (
        <div className="rounded-xl border border-subtle bg-surface-raised p-4">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard size={14} className="text-foreground-muted" />
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">Payment</h3>
          </div>
          <OrderPaymentButton
            orderId={order.id}
            amount={order.total}
            currency={order.currency}
            onPaymentComplete={() => {
              fetch(`/api/v1/orders/${order.id}`)
                .then(r => r.json())
                .then(json => {
                  if (json.success) setOrder(json.data?.order ?? json.order);
                });
            }}
          />
        </div>
      )}

      {/* Reject Modal */}
      <Modal isOpen={rejectModalOpen} onClose={() => setRejectModalOpen(false)} title="Reject Order" description={`Reject ${order.orderNumber}?`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-foreground-tertiary uppercase tracking-wider mb-1.5 block">Reason (optional)</label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Why is this order being rejected?"
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-red-500/40 resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setRejectModalOpen(false)} className="flex-1 px-4 py-2 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground-tertiary hover:text-foreground transition-colors">
              Cancel
            </button>
            <button onClick={handleReject} disabled={actionLoading} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors disabled:opacity-50">
              {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
              Reject Order
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
