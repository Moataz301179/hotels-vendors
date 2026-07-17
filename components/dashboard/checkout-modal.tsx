"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

export function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [reference, setReference] = useState("");

  if (!open) return null;

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width: "100%", maxWidth: 520, backgroundColor: "#fff", borderRadius: 12, boxShadow: "0 24px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.06)", overflow: "hidden" }}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid #e3e8ee" }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: "#1a1f36", margin: 0 }}>Immediate Checkout</h2>
            <p style={{ fontSize: 12, color: "#8898aa", margin: "4px 0 0 0" }}>Process a payment or settlement</p>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: "#8898aa", display: "flex" }}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          <FieldInput label="Amount (EGP)" value={amount} onChange={setAmount} placeholder="0.00" />
          <FieldInput label="Recipient" value={recipient} onChange={setRecipient} placeholder="Supplier name or IBAN" />
          <FieldInput label="Reference" value={reference} onChange={setReference} placeholder="Invoice or PO reference" />

          {/* Stripe Payment Element mount point */}
          <div
            id="stripe-payment-element-mount"
            style={{ minHeight: 48, marginBottom: 20, padding: 12, border: "1px dashed #c1c9d2", borderRadius: 6, backgroundColor: "#f7f8fa", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            <span style={{ fontSize: 12, color: "#8898aa" }}>Stripe Payment Element will mount here</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ fontSize: 13, fontWeight: 500, padding: "10px 20px", border: "1px solid #e3e8ee", borderRadius: 6, backgroundColor: "#fff", color: "#525f7f", cursor: "pointer" }}>
              Cancel
            </button>
            <button style={{ fontSize: 13, fontWeight: 500, padding: "10px 20px", border: "none", borderRadius: 6, backgroundColor: "#635bff", color: "#fff", cursor: "pointer" }}>
              Process Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#525f7f", marginBottom: 6 }}>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", fontSize: 14, padding: "10px 12px", border: "1px solid #e3e8ee", borderRadius: 6, outline: "none", color: "#1a1f36", backgroundColor: "#f7f8fa", boxSizing: "border-box" }}
      />
    </div>
  );
}
