"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckoutModal } from "@/components/dashboard/checkout-modal";
import { FinancialDashboard } from "@/components/dashboard/financial-dashboard";
import { ForecastWidget } from "@/components/dashboard/forecast-widget";

export default function HotelDashboardPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1600px] mx-auto space-y-6"
      style={{ display: "flex", flexDirection: "column", gap: "24px" }}
    >
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: "#ffffff", margin: 0 }}>
            Hotel Procurement Portal
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.40)", margin: "4px 0 0 0" }}>
            Track spend, manage orders, and monitor inventory across all properties
          </p>
        </div>
        <button
          onClick={() => setCheckoutOpen(true)}
          style={{
            fontSize: 13,
            fontWeight: 500,
            padding: "10px 20px",
            backgroundColor: "#FF6B00",
            color: "#ffffff",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Immediate Checkout
        </button>
      </div>

      <FinancialDashboard />

      {/* AI Forecast */}
      <ForecastWidget />

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </motion.div>
  );
}
