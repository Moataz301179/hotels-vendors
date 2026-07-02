"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

interface OrderActionsProps {
  orderId: string;
}

export function OrderActions({ orderId }: OrderActionsProps) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);

  async function handleApprove() {
    setLoading("approve");
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "APPROVED" }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to approve");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(null);
    }
  }

  async function handleReject() {
    const reason = prompt("Rejection reason:");
    if (!reason || reason.length < 3) return alert("Reason must be at least 3 characters");
    setLoading("reject");
    try {
      const res = await fetch(`/api/v1/orders/${orderId}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to reject");
      }
    } catch {
      alert("Network error");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={handleApprove}
        disabled={loading !== null}
        className="p-1.5 rounded-md hover:bg-[rgba(52,211,153,0.10)] text-[#34d399] border border-[rgba(52,211,153,0.15)] hover:border-[rgba(52,211,153,0.30)] transition-all disabled:opacity-50"
      >
        {loading === "approve" ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
      </button>
      <button
        onClick={handleReject}
        disabled={loading !== null}
        className="p-1.5 rounded-md hover:bg-[rgba(239,68,68,0.10)] text-[#ef4444] border border-[rgba(239,68,68,0.15)] hover:border-[rgba(239,68,68,0.30)] transition-all disabled:opacity-50"
      >
        {loading === "reject" ? <Loader2 size={14} className="animate-spin" /> : <XCircle size={14} />}
      </button>
    </div>
  );
}
