"use client";

import { useState, useEffect } from "react";
import { CreditCard, Loader2, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";

interface OrderPaymentProps {
  orderId: string;
  amount: number;
  currency?: string;
  onPaymentComplete?: () => void;
}

interface UserInfo {
  email: string;
  name: string;
  phone: string;
}

export function OrderPaymentButton({ orderId, amount, currency = "EGP", onPaymentComplete }: OrderPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [paymentUrl, setPaymentUrl] = useState<string | null>(null);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    fetch("/api/v1/auth/me")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setUser({
            email: json.data.email || "",
            name: json.data.name || "",
            phone: json.data.phone || "01000000000",
          });
        }
      })
      .catch(() => {});
  }, []);

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          email: user?.email || "",
          firstName: user?.name?.split(" ")[0] || "",
          lastName: user?.name?.split(" ").slice(1).join(" ") || "",
          phone: user?.phone || "01000000000",
          description: `Payment for order ${orderId}`,
          referenceType: "MARKETPLACE_COMMISSION",
          referenceId: orderId,
        }),
      });
      const json = await res.json();
      if (json.success && json.paymentUrl) {
        setPaymentUrl(json.paymentUrl);
        window.open(json.paymentUrl, "_blank", "noopener,noreferrer");
      } else {
        setError(json.error || "Failed to create payment");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  if (paymentUrl) {
    return (
      <div className="p-4 rounded-xl bg-accent-base/10 border border-accent-base/20">
        <div className="flex items-center gap-2 mb-2">
          <ExternalLink size={14} className="text-accent-base" />
          <span className="text-xs font-medium text-accent-base">Payment page opened</span>
        </div>
        <p className="text-xs text-foreground-tertiary mb-3">
          Complete your payment in the new tab. If the window didn't open, click the button below.
        </p>
        <div className="flex gap-2">
          <a
            href={paymentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-base/20 border border-accent-base/30 text-accent-base text-sm font-medium hover:bg-accent-base/30 transition-colors"
          >
            <ExternalLink size={14} />
            Open Payment Page
          </a>
          <button
            onClick={() => onPaymentComplete?.()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors"
          >
            <CheckCircle2 size={14} />
            I've Paid
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="flex items-center gap-2 p-3 mb-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle size={14} /> {error}
        </div>
      )}
      <button
        onClick={handlePay}
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-base/10 border border-accent-base/20 text-accent-base text-sm font-medium hover:bg-accent-base/20 transition-colors disabled:opacity-50 w-full justify-center"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
        {loading ? "Creating payment..." : `Pay ${currency} ${amount.toLocaleString()}`}
      </button>
    </div>
  );
}
