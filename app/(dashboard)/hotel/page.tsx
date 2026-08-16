"use client";

import { useState } from "react";
import { CheckoutModal } from "@/components/dashboard/checkout-modal";
import { FinancialDashboard } from "@/components/dashboard/financial-dashboard";

export default function HotelDashboardPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-6">
        <div>
          <div className="mb-2 inline-flex">
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-base)]" />
              Hotel Procurement Node
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-[30px]">
            Hotel Procurement Portal
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track spend, manage orders, and monitor inventory across all properties
          </p>
        </div>
        <button
          onClick={() => setCheckoutOpen(true)}
          className="rounded-xl bg-[var(--accent-base)] px-5 py-2.5 text-sm font-medium text-[#1a140f] transition-colors hover:opacity-90"
        >
          Immediate Checkout
        </button>
      </div>

      <FinancialDashboard />

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </div>
  );
}
