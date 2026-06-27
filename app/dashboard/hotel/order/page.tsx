"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-context";
import { useSessionInfo } from "@/lib/hooks/use-session-info";
import {
  ArrowLeft,
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  Calendar,
  Send,
  CheckCircle2,
  Loader2,
  Truck,
  FileText,
  Building2,
  AlertTriangle,
} from "lucide-react";

const VAT_RATE = 0.14;

const SHIPPING_METHODS = [
  { id: "standard", label: "Standard Delivery", description: "3–5 business days", price: 75 },
  { id: "express", label: "Express Delivery", description: "1–2 business days", price: 150 },
  { id: "self", label: "Self-Pickup / Self-Shipping", description: "Arrange your own logistics", price: 0 },
] as const;

const PAYMENT_METHODS = [
  { id: "BANK_TRANSFER", label: "Bank Transfer" },
  { id: "INVOICE_NET_30", label: "Invoice Net 30" },
  { id: "INVOICE_NET_60", label: "Invoice Net 60" },
  { id: "FACTORING", label: "Non-Recourse Factoring" },
  { id: "CREDIT_TERMS", label: "Credit Terms" },
] as const;

interface SupplierGroup {
  supplierId: string;
  supplierName: string;
  items: ReturnType<typeof useCart>["items"];
}

export default function OrderBuilderPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, subtotal, clearCart } = useCart();
  const session = useSessionInfo();

  const [deliveryDate, setDeliveryDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("INVOICE_NET_30");
  const [poNumber, setPoNumber] = useState("");
  const [costCenter, setCostCenter] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedOrders, setSubmittedOrders] = useState<{ orderNumber: string; supplierName: string }[]>([]);
  const [error, setError] = useState("");

  const supplierGroups = useMemo(() => {
    const map = new Map<string, SupplierGroup>();
    for (const item of items) {
      const group = map.get(item.supplierId);
      if (group) {
        group.items.push(item);
      } else {
        map.set(item.supplierId, { supplierId: item.supplierId, supplierName: item.supplierName, items: [item] });
      }
    }
    return Array.from(map.values());
  }, [items]);

  const shippingCost = SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.price ?? 0;
  const vatAmount = subtotal * VAT_RATE;
  const total = subtotal + vatAmount + shippingCost;

  async function handleSubmit() {
    if (items.length === 0) return;
    if (!session.hotelId || !session.userId) {
      setError("Missing hotel or user context. Please re-login.");
      return;
    }
    setSubmitting(true);
    setError("");

    const results: { orderNumber: string; supplierName: string }[] = [];
    const errors: string[] = [];

    for (const group of supplierGroups) {
      const orderNumber = `PO-${Date.now().toString(36).toUpperCase()}-${group.supplierId.slice(-4)}`;
      const groupSubtotal = group.items.reduce((s, i) => s + i.quantity * i.unitPrice, 0);
      const groupVat = groupSubtotal * VAT_RATE;
      const groupTotal = groupSubtotal + groupVat + (supplierGroups.length === 1 ? shippingCost : 0);

      try {
        const res = await fetch("/api/v1/orders", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-idempotency-key": `${orderNumber}-${Date.now()}`,
          },
          body: JSON.stringify({
            orderNumber,
            supplierId: group.supplierId,
            hotelId: session.hotelId,
            requesterId: session.userId,
            items: group.items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              notes: "",
            })),
            deliveryDate: deliveryDate || undefined,
            deliveryInstructions: instructions || undefined,
            shippingMethod,
            shippingCost: supplierGroups.length === 1 ? shippingCost : 0,
            poNumber: poNumber || undefined,
            costCenter: costCenter || undefined,
            paymentMethod,
            subtotal: groupSubtotal,
            vatAmount: groupVat,
            total: groupTotal,
          }),
        });

        const json = await res.json();
        if (json.success) {
          results.push({ orderNumber, supplierName: group.supplierName });
        } else {
          errors.push(`${group.supplierName}: ${json.error || "Failed"}`);
        }
      } catch {
        errors.push(`${group.supplierName}: Network error`);
      }
    }

    if (results.length > 0) {
      setSubmittedOrders(results);
      setSubmitted(true);
      clearCart();
    }

    if (errors.length > 0) {
      setError(errors.join("; "));
    }

    setSubmitting(false);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-16 h-16 rounded-full bg-accent-emerald/10 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-accent-emerald" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Order{submittedOrders.length > 1 ? "s" : ""} Submitted!</h2>
        <p className="text-foreground-muted text-center max-w-md">
          {submittedOrders.length} purchase order{submittedOrders.length > 1 ? "s" : ""} sent for approval. You will be notified once reviewed.
        </p>
        {submittedOrders.length > 1 && (
          <div className="glass-card p-4 w-full max-w-sm space-y-2">
            {submittedOrders.map((o) => (
              <div key={o.orderNumber} className="flex items-center justify-between text-sm">
                <span className="text-foreground-muted">{o.supplierName}</span>
                <span className="font-mono text-xs text-foreground-faint">{o.orderNumber}</span>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => router.push("/dashboard/hotel")}
            className="px-5 py-2.5 rounded-xl bg-surface border border-border-default text-foreground font-medium hover:border-border-strong transition-colors"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => { setSubmitted(false); router.push("/dashboard/hotel/catalog"); }}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => router.push("/dashboard/hotel/catalog")}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ArrowLeft size={20} className="text-foreground-muted" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Purchase Order</h1>
          <p className="text-sm text-foreground-muted">Review your cart and submit for approval</p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="glass-card p-12 text-center space-y-4">
          <ShoppingBag size={48} className="mx-auto text-foreground-faint" />
          <h3 className="text-lg font-semibold text-foreground">Your cart is empty</h3>
          <p className="text-foreground-muted">Browse the catalog to add products to your order.</p>
          <button
            onClick={() => router.push("/dashboard/hotel/catalog")}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium transition-colors"
          >
            Browse Catalog
          </button>
        </div>
      ) : (
        <>
          {/* Multi-Supplier Warning */}
          {supplierGroups.length > 1 && (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Multi-supplier cart</p>
                <p className="text-amber-300/70 text-xs mt-1">
                  Your cart contains items from {supplierGroups.length} suppliers. Separate orders will be created for each.
                </p>
              </div>
            </div>
          )}

          {/* Cart Items grouped by supplier */}
          {supplierGroups.map((group) => (
            <div key={group.supplierId} className="glass-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border-subtle flex items-center gap-2">
                <Building2 size={14} className="text-foreground-muted" />
                <span className="text-sm font-semibold text-foreground">{group.supplierName}</span>
                <span className="text-xs text-foreground-faint ml-auto">{group.items.length} item{group.items.length > 1 ? "s" : ""}</span>
              </div>
              <div className="divide-y divide-border-subtle">
                {group.items.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-raised flex items-center justify-center shrink-0">
                      <ShoppingBag size={20} className="text-foreground-muted" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                      <p className="text-xs text-foreground-muted">{item.sku}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center hover:bg-surface-hover transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center hover:bg-surface-hover transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm font-semibold text-foreground">{(item.quantity * item.unitPrice).toLocaleString()}</p>
                      <p className="text-xs text-foreground-faint">EGP</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="p-2 rounded-lg hover:bg-brand-900/30 text-foreground-faint hover:text-brand-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Delivery Details */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-foreground">Delivery Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-foreground-muted uppercase tracking-wider mb-1.5 block">Delivery Date</label>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-faint" />
                  <input
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface border border-border-default text-foreground focus:border-brand-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-foreground-muted uppercase tracking-wider mb-1.5 block">Shipping Method</label>
                <select
                  value={shippingMethod}
                  onChange={(e) => setShippingMethod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border-default text-foreground focus:border-brand-500 focus:outline-none transition-colors"
                >
                  {SHIPPING_METHODS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label} — EGP {m.price} ({m.description})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-foreground-muted uppercase tracking-wider mb-1.5 block">Instructions</label>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Any special delivery instructions..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border-default text-foreground placeholder:text-foreground-faint focus:border-brand-500 focus:outline-none transition-colors resize-none"
              />
            </div>
          </div>

          {/* Payment & PO Details */}
          <div className="glass-card p-5 space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText size={16} className="text-foreground-muted" />
              Payment & PO Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-foreground-muted uppercase tracking-wider mb-1.5 block">PO Number</label>
                <input
                  type="text"
                  value={poNumber}
                  onChange={(e) => setPoNumber(e.target.value)}
                  placeholder="e.g. PO-2026-0042"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border-default text-foreground placeholder:text-foreground-faint focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-foreground-muted uppercase tracking-wider mb-1.5 block">Cost Center</label>
                <input
                  type="text"
                  value={costCenter}
                  onChange={(e) => setCostCenter(e.target.value)}
                  placeholder="e.g. F&B-Outlets"
                  className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border-default text-foreground placeholder:text-foreground-faint focus:border-brand-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-foreground-muted uppercase tracking-wider mb-1.5 block">Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-surface border border-border-default text-foreground focus:border-brand-500 focus:outline-none transition-colors"
              >
                {PAYMENT_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary */}
          <div className="glass-card p-5 space-y-3">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Truck size={16} className="text-foreground-muted" />
              Order Summary
            </h3>
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">Subtotal</span>
              <span className="text-foreground font-medium">{subtotal.toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-foreground-muted">VAT (14%)</span>
              <span className="text-foreground font-medium">{vatAmount.toLocaleString()} EGP</span>
            </div>
            {shippingCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-foreground-muted">Shipping ({SHIPPING_METHODS.find((m) => m.id === shippingMethod)?.label})</span>
                <span className="text-foreground font-medium">{shippingCost.toLocaleString()} EGP</span>
              </div>
            )}
            <div className="pt-3 border-t border-border-subtle flex justify-between">
              <span className="text-foreground font-semibold">Total</span>
              <span className="text-xl font-bold text-foreground metric-value">{total.toLocaleString()} EGP</span>
            </div>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-brand-900/20 border border-brand-700/30 text-brand-300 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard/hotel/catalog")}
              className="px-5 py-2.5 rounded-xl bg-surface border border-border-default text-foreground font-medium hover:border-border-strong transition-colors"
            >
              Add More Items
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-medium transition-colors"
            >
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              {submitting ? "Submitting..." : `Submit ${supplierGroups.length} Order${supplierGroups.length > 1 ? "s" : ""} for Approval`}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
