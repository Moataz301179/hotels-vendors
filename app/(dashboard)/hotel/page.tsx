"use client";

import { useState } from "react";
import { CheckoutModal } from "@/components/dashboard/checkout-modal";
import { FinancialDashboard } from "@/components/dashboard/financial-dashboard";

export default function HotelDashboardPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#1a1f36", margin: 0 }}>
            Hotel Procurement Portal
          </h1>
          <p style={{ fontSize: 13, color: "#8898aa", margin: "4px 0 0 0" }}>
            Track spend, manage orders, and monitor inventory across all properties
          </p>
        </div>
        <button
          onClick={() => setCheckoutOpen(true)}
          style={{
            fontSize: 13,
            fontWeight: 500,
            padding: "10px 20px",
            backgroundColor: "#635bff",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Immediate Checkout
        </button>
      </div>

      <FinancialDashboard />

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
