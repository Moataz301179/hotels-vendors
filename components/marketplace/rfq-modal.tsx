"use client";

import { useState } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";

interface RfqModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    sku: string;
    supplierId: string;
    supplierName?: string;
    unitPrice?: number | null;
    pricingMode?: string;
    rfqThresholdQty?: number | null;
  };
  /** Pre-filled quantity from the product page */
  initialQty?: number;
}

export function RfqModal({ isOpen, onClose, product, initialQty = 1 }: RfqModalProps) {
  const [qty, setQty] = useState(initialQty);
  const [targetPrice, setTargetPrice] = useState("");
  const [deliveryTimeline, setDeliveryTimeline] = useState("");
  const [specialReq, setSpecialReq] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [estResponse, setEstResponse] = useState("");

  if (!isOpen) return null;

  const isRfqOnly = product.pricingMode === "RFQ";
  const isOverThreshold =
    product.rfqThresholdQty && qty >= product.rfqThresholdQty;

  async function handleSubmit() {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/v1/rfq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          supplierId: product.supplierId,
          requestedQty: qty,
          targetPrice: targetPrice ? Number(targetPrice) : undefined,
          deliveryTimeline: deliveryTimeline || undefined,
          specialReq: specialReq || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEstResponse(data.data?.estimatedResponse || "24 hours");
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to submit RFQ");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const reason =
    isRfqOnly
      ? "This is an RFQ-only product — pricing requires supplier quotation."
      : isOverThreshold
      ? `Bulk orders ≥ ${product.rfqThresholdQty} units require a quotation.`
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md mx-4 rounded-2xl border bg-surface-1 p-6"
        style={{ borderColor: "var(--orange-base)33", boxShadow: "0 0 60px rgba(var(--orange-base-rgb),0.15)" }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-foreground-muted hover:text-white transition-colors">
          <X size={18} />
        </button>

        {submitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
              style={{ background: "var(--accent-base)15", border: "1px solid var(--accent-base)40" }}>
              <CheckCircle2 size={32} style={{ color: "var(--accent-base)" }} />
            </div>
            <h3 className="text-lg font-semibold text-foreground">RFQ Submitted</h3>
            <p className="text-sm text-foreground-secondary">
              Your quotation request for <strong className="text-foreground">{product.name}</strong> has been sent to the supplier.
            </p>
            <div className="rounded-lg p-3 text-xs text-foreground-muted"
              style={{ background: "var(--accent-base)08", border: "1px solid var(--accent-base)22" }}>
              Estimated response: <strong style={{ color: "var(--accent-base)" }}>{estResponse}</strong>
            </div>
            <button onClick={onClose} className="px-6 py-2.5 rounded-lg text-sm font-semibold bg-accent-base text-surface hover:bg-accent-light transition-colors">
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5">
              <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--orange-base)" }}>
                Request for Quotation
              </span>
              <h3 className="text-lg font-semibold text-foreground mt-1">{product.name}</h3>
              <p className="text-xs text-foreground-muted mt-0.5">SKU: {product.sku} · {product.supplierName || "Supplier"}</p>
            </div>

            {reason && (
              <div className="rounded-lg p-3 mb-4 text-[12px] text-foreground-secondary"
                style={{ background: "var(--orange-base)08", border: "1px solid var(--orange-base)22" }}>
                {reason}
              </div>
            )}

            {error && (
              <div className="rounded-lg p-3 mb-4 text-[12px] text-red-400"
                style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.22)" }}>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-foreground-secondary mb-1.5">
                  Desired Quantity <span className="text-red-400">*</span>
                </label>
                <input type="number" min={1} value={qty}
                  onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-white/10 text-foreground text-sm placeholder:text-white/15 focus:border-accent-base/50 focus:outline-none transition-colors"
                />
                {isOverThreshold && (
                  <p className="text-[11px] mt-1" style={{ color: "var(--orange-base)" }}>
                    Bulk orders ≥ {product.rfqThresholdQty} units require quotation
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-medium text-foreground-secondary mb-1.5">
                  Target Price per Unit (EGP)
                </label>
                <input type="number" min={0} step="0.01" value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder={product.unitPrice ? `Current: EGP ${Number(product.unitPrice).toLocaleString()}` : "Your target price"}
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-white/10 text-foreground text-sm placeholder:text-white/15 focus:border-accent-base/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-foreground-secondary mb-1.5">
                  Delivery Timeline
                </label>
                <input type="text" value={deliveryTimeline}
                  onChange={(e) => setDeliveryTimeline(e.target.value)}
                  placeholder="e.g. Within 2 weeks, By end of month"
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-white/10 text-foreground text-sm placeholder:text-white/15 focus:border-accent-base/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-foreground-secondary mb-1.5">
                  Special Requirements
                </label>
                <textarea rows={3} value={specialReq}
                  onChange={(e) => setSpecialReq(e.target.value)}
                  placeholder="Any specific requirements for this order..."
                  className="w-full px-4 py-2.5 rounded-lg bg-canvas border border-white/10 text-foreground text-sm placeholder:text-white/15 focus:border-accent-base/50 focus:outline-none transition-colors resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border border-white/10 text-foreground-muted hover:text-white hover:border-white/20 transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ background: "var(--orange-base)" }}>
                {loading ? <Loader2 size={14} className="animate-spin" /> : null}
                Submit RFQ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}