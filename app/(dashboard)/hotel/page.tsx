"use client";

import { useState } from "react";
import { FinancialDashboard } from "@/components/carbon/financial-dashboard";
import { CheckoutModal } from "@/components/carbon/checkout-modal";

export default function HotelDashboardPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#1a1f36",
              margin: 0,
            }}
          >
            Hotel Procurement Portal
          </h1>
          <p
            style={{
              fontSize: "13px",
              color: "#8898aa",
              margin: "4px 0 0 0",
            }}
          >
            Track spend, manage orders, and monitor inventory across all properties
          </p>
        </div>
        <button
          onClick={() => setCheckoutOpen(true)}
          style={{
            fontSize: "13px",
            fontWeight: 500,
            padding: "10px 20px",
            backgroundColor: "#635bff",
            color: "#ffffff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Immediate Checkout
        </button>
      </div>

      {/* Carbon Financial Dashboard */}
      <FinancialDashboard />

      {/* Checkout Modal */}
      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
      />
    </div>
  );
}
