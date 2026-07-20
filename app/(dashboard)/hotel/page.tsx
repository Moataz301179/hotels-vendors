"use client";

import { useState } from "react";
import { CheckoutModal } from "@/components/dashboard/checkout-modal";
import { FinancialDashboard } from "@/components/dashboard/financial-dashboard";
import { OlivReferralCTA } from "@/components/partners/oliv-referral-cta";

export default function HotelDashboardPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Hotel Procurement Portal
          </h1>
          <p className="text-sm text-white/40 mt-1">
            Track spend, manage orders, and monitor inventory across all properties
          </p>
        </div>
        <button
          onClick={() => setCheckoutOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#39ff7e] text-[#07090f] text-sm font-medium hover:bg-[#39ff7e]/90 transition-colors"
        >
          Immediate Checkout
        </button>
      </div>

      <FinancialDashboard />

      <OlivReferralCTA entityType="HOTEL" financingType="CREDIT_LINE" variant="card" />

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
