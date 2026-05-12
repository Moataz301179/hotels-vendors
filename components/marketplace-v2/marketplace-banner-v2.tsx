"use client";

import { motion } from "framer-motion";
import { Truck, ShieldCheck, Clock, Headphones } from "lucide-react";

const TRUST_SIGNALS = [
  {
    icon: ShieldCheck,
    title: "Verified Suppliers",
    desc: "1,200+ vetted hospitality vendors",
  },
  {
    icon: Clock,
    title: "48h Delivery",
    desc: "Coastal & industrial clusters",
  },
  {
    icon: Truck,
    title: "Shared Logistics",
    desc: "Optimized routes, lower costs",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    desc: "Dedicated account managers",
  },
];

export function MarketplaceBannerV2() {
  return (
    <div className="relative bg-gradient-to-br from-[#8B0000] to-[#6B0512] rounded-2xl overflow-hidden">
      {/* Pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            HotelsVendors Marketplace
          </h1>
          <p className="text-white/70 text-sm sm:text-base max-w-xl">
            Discover verified suppliers across 10 hospitality categories. Fixed pricing, ETA-compliant invoicing, and 48-hour delivery in key clusters.
          </p>
        </motion.div>

        {/* Trust Signals */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {TRUST_SIGNALS.map((signal, i) => {
            const Icon = signal.icon;
            return (
              <motion.div
                key={signal.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2.5 border border-white/10"
              >
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">{signal.title}</p>
                  <p className="text-[10px] text-white/60">{signal.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
