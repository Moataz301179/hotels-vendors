"use client";

import { motion } from "framer-motion";
import { BrandLogo } from "@/components/layout/brand-logo";
import { BarChart3, ShieldCheck, Truck, Landmark } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: BarChart3,
    title: "AI Demand Forecasting",
    description: "Predict consumption 14 days ahead. Reduce over-ordering by 34%.",
  },
  {
    icon: ShieldCheck,
    title: "Authority Matrix",
    description: "Multi-signature approval chains. No bypass. Full audit trail.",
  },
  {
    icon: Landmark,
    title: "Embedded Factoring",
    description: "Suppliers paid in 48 hours. Hotels keep 90-day terms.",
  },
  {
    icon: Truck,
    title: "Shared Logistics",
    description: "Coastal cluster routes cut delivery costs by 40%.",
  },
];

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden bg-[#080c14]">
      {/* Top: Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-3">
          <BrandLogo variant="dark" size="md" />
          <span className="text-xl font-bold tracking-tight text-white">
            HotelsVendors
          </span>
        </div>
      </motion.div>

      {/* Middle: Tagline + Value Props */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative z-10 flex-1 flex flex-col justify-center py-12"
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">
          Control Your Hotel's
          <br />
          <span className="text-accent-base">Supply Chain.</span>
        </h2>
        <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-sm">
          From F&B to capital equipment: track every dirham, automate every order, and get AI demand forecasting that prevents waste before it happens.
        </p>

        <div className="mt-10 space-y-4">
          {VALUE_PROPS.map((prop, i) => (
            <motion.div
              key={prop.title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="flex items-start gap-4 group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-accent-base/10 border border-accent-base/15 flex items-center justify-center">
                <prop.icon className="w-4 h-4 text-accent-base" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-300">{prop.title}</p>
                <p className="text-xs text-gray-600 mt-0.5">{prop.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom: Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-6 border-t border-white/[0.05] pt-6">
          <div>
            <p className="text-xl font-bold text-white">2,400+</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">Hotels Onboarded</p>
          </div>
          <div className="w-px h-8 bg-white/[0.06]" />
          <div>
            <p className="text-xl font-bold text-white">680+</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">Verified Suppliers</p>
          </div>
          <div className="w-px h-8 bg-white/[0.06]" />
          <div>
            <p className="text-xl font-bold text-white">EGP 4.2B</p>
            <p className="text-[10px] text-gray-600 uppercase tracking-wider">Annual GMV</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
