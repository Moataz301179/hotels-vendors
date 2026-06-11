"use client";

import { useState } from "react";

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
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 24px 48px rgba(0, 0, 0, 0.12), 0 8px 16px rgba(0, 0, 0, 0.06)",
          overflow: "hidden",
        }}
      >
        {/* Modal Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 24px",
            borderBottom: "1px solid #e3e8ee",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#1a1f36",
                margin: 0,
              }}
            >
              Immediate Checkout
            </h2>
            <p
              style={{
                fontSize: "12px",
                color: "#8898aa",
                margin: "4px 0 0 0",
              }}
            >
              Process a payment or settlement
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "20px",
              color: "#8898aa",
              cursor: "pointer",
              padding: "4px",
            }}
          >
            x
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: "24px" }}>
          {/* Amount */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#525f7f",
                marginBottom: "6px",
              }}
            >
              Amount (EGP)
            </label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              style={{
                width: "100%",
                fontSize: "14px",
                padding: "10px 12px",
                border: "1px solid #e3e8ee",
                borderRadius: "6px",
                outline: "none",
                color: "#1a1f36",
                backgroundColor: "#f7f8fa",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Recipient */}
          <div style={{ marginBottom: "16px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#525f7f",
                marginBottom: "6px",
              }}
            >
              Recipient
            </label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Supplier name or IBAN"
              style={{
                width: "100%",
                fontSize: "14px",
                padding: "10px 12px",
                border: "1px solid #e3e8ee",
                borderRadius: "6px",
                outline: "none",
                color: "#1a1f36",
                backgroundColor: "#f7f8fa",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Reference */}
          <div style={{ marginBottom: "24px" }}>
            <label
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: 600,
                color: "#525f7f",
                marginBottom: "6px",
              }}
            >
              Reference
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Invoice or PO reference"
              style={{
                width: "100%",
                fontSize: "14px",
                padding: "10px 12px",
                border: "1px solid #e3e8ee",
                borderRadius: "6px",
                outline: "none",
                color: "#1a1f36",
                backgroundColor: "#f7f8fa",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* ═══════════════════════════════════════════════════════
              STRIPE PAYMENT ELEMENT MOUNT POINT
              This isolated div is designated for mounting the
              Stripe Payment Element. When Stripe.js is loaded,
              the Payment Element will be injected here.
              ═══════════════════════════════════════════════════════ */}
          <div
            id="stripe-payment-element-mount"
            style={{
              minHeight: "48px",
              marginBottom: "20px",
              padding: "12px",
              border: "1px dashed #c1c9d2",
              borderRadius: "6px",
              backgroundColor: "#f7f8fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#8898aa",
                textAlign: "center",
              }}
            >
              Stripe Payment Element will mount here
            </span>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "flex-end",
            }}
          >
            <button
              onClick={onClose}
              style={{
                fontSize: "13px",
                fontWeight: 500,
                padding: "10px 20px",
                border: "1px solid #e3e8ee",
                borderRadius: "6px",
                backgroundColor: "#ffffff",
                color: "#525f7f",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              style={{
                fontSize: "13px",
                fontWeight: 500,
                padding: "10px 20px",
                border: "none",
                borderRadius: "6px",
                backgroundColor: "#635bff",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              Process Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
