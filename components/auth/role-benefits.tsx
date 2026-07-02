"use client";

import { motion } from "framer-motion";
import { Package, Banknote, FileText, TrendingUp, ShieldCheck, Truck } from "lucide-react";

interface RoleBenefitsProps {
  role: "HOTEL" | "SUPPLIER";
  variant?: "full" | "compact";
  theme?: "dark" | "light";
}

const benefits = {
  SUPPLIER: [
    { icon: Package, title: "Reach 2,400+ Hotels", desc: "List your products to qualified hotel buyers across Egypt" },
    { icon: Banknote, title: "Get Paid in 24 Hours", desc: "Opt for early payment via Payme factoring — no more Net-60 delays" },
    { icon: FileText, title: "ETA-Compliant Invoicing", desc: "All invoices are e-invoice compliant with automatic submission" },
    { icon: TrendingUp, title: "Smart Analytics", desc: "Real-time dashboards with demand forecasting and performance insights" },
    { icon: ShieldCheck, title: "Verified Buyers", desc: "Every hotel buyer is vetted — no fraud, no bounced payments" },
    { icon: Truck, title: "Logistics Integration", desc: "Track orders from dispatch to delivery with carrier partners" },
  ],
  HOTEL: [
    { icon: Package, title: "1,200+ Verified Suppliers", desc: "Source from vetted hospitality suppliers with competitive pricing" },
    { icon: Banknote, title: "Net-60 Terms or Early Payment", desc: "Standard payment terms with optional early settlement discounts" },
    { icon: FileText, title: "Automated ETA Compliance", desc: "Every purchase order is automatically converted to an ETA-compliant e-invoice" },
    { icon: TrendingUp, title: "AI Demand Forecasting", desc: "Predict consumption patterns and automate reordering" },
    { icon: ShieldCheck, title: "Budget Controls", desc: "Set department-level budgets with approval workflows and alerts" },
    { icon: Truck, title: "Real-Time Order Tracking", desc: "End-to-end visibility from order placement to delivery confirmation" },
  ],
};

export function RoleBenefits({ role, variant = "full", theme = "dark" }: RoleBenefitsProps) {
  const items = benefits[role];
  const isDark = theme === "dark";

  if (variant === "compact") {
    return (
      <div className="space-y-3">
        {items.slice(0, 4).map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.2 }}
            className="flex items-start gap-3 p-2.5 rounded-lg"
            style={{ backgroundColor: isDark ? "var(--bg-surface-1)" : "var(--bg-canvas)" }}
          >
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ backgroundColor: isDark ? "rgba(212, 168, 67, 0.12)" : "rgba(212, 168, 67, 0.1)" }}
            >
              <item.icon className="w-4 h-4" style={{ color: "var(--accent-base)" }} />
            </div>
            <div>
              <p className="text-[13px] font-medium" style={{ color: "var(--text-primary)" }}>{item.title}</p>
              <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-5" style={{ color: "var(--accent-base)" }}>
        {role === "SUPPLIER" ? "Why Join as a Supplier?" : "Why Join as a Hotel?"}
      </h3>
      <div className="space-y-3">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.25 }}
            className="flex items-start gap-3.5 p-3.5 rounded-xl"
            style={{ backgroundColor: isDark ? "var(--bg-surface-1)" : "var(--bg-canvas)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: isDark ? "rgba(212, 168, 67, 0.12)" : "rgba(212, 168, 67, 0.1)" }}
            >
              <item.icon className="w-5 h-5" style={{ color: "var(--accent-base)" }} />
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.title}</p>
              <p className="text-[13px] leading-relaxed mt-1" style={{ color: "var(--text-secondary)" }}>{item.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
