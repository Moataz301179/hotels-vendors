"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckoutModal } from "@/components/dashboard/checkout-modal";
import { FinancialDashboard, type KPIData, type LedgerRow } from "@/components/dashboard/financial-dashboard";
import { ForecastWidget } from "@/components/dashboard/forecast-widget";
import {
  DollarSign,
  Activity,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

const kpis: KPIData[] = [
  { label: "Available Capital", value: "EGP 2,450,000", change: "+12.4%", trend: "up", icon: <DollarSign size={16} /> },
  { label: "Utilized Credit", value: "EGP 1,820,000", change: "+8.2%", trend: "up", icon: <Activity size={16} /> },
  { label: "Real-time Risk Score", value: "82/100", change: "-3 pts", trend: "down", icon: <ShieldCheck size={16} /> },
  { label: "Settlement Rate", value: "94.2%", change: "+1.1%", trend: "up", icon: <TrendingUp size={16} /> },
];

const ledgerData: LedgerRow[] = [
  { id: "1", invoiceId: "INV-2026-00142", hotel: "Stella Di Mare Resort", supplier: "Nile Fresh Foods", amount: 45200, currency: "EGP", status: "paid", date: "2026-06-08", taxStamp: "ETA-UUID: a3f8c2d1-0042", ledgerHash: "0x7f3a...e2b1", riskScore: 92 },
  { id: "2", invoiceId: "INV-2026-00141", hotel: "Jaz Aquamarine", supplier: "Pyramid Linens", amount: 28700, currency: "EGP", status: "pending", date: "2026-06-07", taxStamp: "ETA-UUID: b4e9d3e2-0041", ledgerHash: "0x8a4b...f3c2", riskScore: 78 },
  { id: "3", invoiceId: "INV-2026-00140", hotel: "Sunrise Palace", supplier: "Red Sea Amenities", amount: 61500, currency: "EGP", status: "invoiced", date: "2026-06-06", taxStamp: "ETA-UUID: c5f0e4f3-0040", ledgerHash: "0x9b5c...g4d3", riskScore: 85 },
  { id: "4", invoiceId: "INV-2026-00139", hotel: "Baron Resort Sharm", supplier: "Cairo Kitchen Pro", amount: 128400, currency: "EGP", status: "delivered", date: "2026-06-05", taxStamp: "ETA-UUID: d6a1f5a4-0039", ledgerHash: "0xac6d...h5e4", riskScore: 91 },
  { id: "5", invoiceId: "INV-2026-00138", hotel: "Hurghada Grand", supplier: "Delta Maintenance", amount: 18900, currency: "EGP", status: "overdue", date: "2026-05-28", taxStamp: "ETA-UUID: e7b2a6b5-0038", ledgerHash: "0xbd7e...i6f5", riskScore: 42 },
  { id: "6", invoiceId: "INV-2026-00137", hotel: "Stella Di Mare Resort", supplier: "Nile Fresh Foods", amount: 38100, currency: "EGP", status: "paid", date: "2026-05-25", taxStamp: "ETA-UUID: f8c3b7c6-0037", ledgerHash: "0xce8f...j7g6", riskScore: 88 },
  { id: "7", invoiceId: "INV-2026-00136", hotel: "Jaz Aquamarine", supplier: "Pyramid Linens", amount: 22400, currency: "EGP", status: "pending", date: "2026-05-24", taxStamp: "ETA-UUID: a9d4c8d7-0036", ledgerHash: "0xdf9g...k8h7", riskScore: 74 },
];

export default function HotelDashboardPage() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-[1600px] mx-auto space-y-6"
    >
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground m-0">Hotel Procurement Portal</h1>
          <p className="text-sm text-foreground-muted mt-1">
            Track spend, manage orders, and monitor inventory across all properties
          </p>
        </div>
        <button
          onClick={() => setCheckoutOpen(true)}
          className="cta-glow px-5 py-2.5 bg-accent-base text-accent-text text-sm font-medium rounded-sm hover:bg-accent-light transition-colors"
        >
          Immediate Checkout
        </button>
      </div>

      <FinancialDashboard kpis={kpis} ledgerData={ledgerData} />

      <ForecastWidget />

      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </motion.div>
  );
}
