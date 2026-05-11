"use client";

import { motion } from "framer-motion";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Building2, ShieldCheck, Truck, Landmark } from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Building2,
    title: "Fixed-Price Catalogs",
    description: "No bidding, no haggling — transparent supplier pricing",
  },
  {
    icon: ShieldCheck,
    title: "ETA Compliance",
    description: "E-invoicing integrated with Egyptian Tax Authority",
  },
  {
    icon: Landmark,
    title: "Embedded Factoring",
    description: "Instant liquidity & credit lines for your cash flow",
  },
  {
    icon: Truck,
    title: "Shared Logistics",
    description: "Optimized routes reducing delivery overhead by 40%",
  },
];

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-[45%] xl:w-[40%] relative flex-col justify-between p-10 xl:p-14 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(2,35,73,0.25)_0%,_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(185,28,28,0.08)_0%,_transparent_50%)]" />
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />

      {/* Top: Brand */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10"
      >
        <div className="flex items-center gap-4">
          <BrandLogo variant="dark" size="lg" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Hotels Vendors
            </h1>
            <p className="text-[11px] text-white/40 uppercase tracking-[0.15em] font-medium mt-0.5">
              Digital Procurement Hub
            </p>
          </div>
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
          The Amazon of
          <br />
          <span className="text-[#8B0000]">Egyptian Hospitality</span>
        </h2>
        <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-sm">
          Connect hotels, suppliers, logistics providers, and factoring companies on one
          unified B2B procurement platform.
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
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-[#8B0000]/30 group-hover:bg-[#8B0000]/10 transition-colors">
                <prop.icon className="w-4 h-4 text-[#8B0000]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">{prop.title}</p>
                <p className="text-xs text-white/30 mt-0.5">{prop.description}</p>
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
        <div className="flex items-center gap-6 border-t border-white/[0.06] pt-6">
          <div>
            <p className="text-xl font-bold text-white">$21.5B</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Addressable Market</p>
          </div>
          <div className="w-px h-8 bg-white/[0.08]" />
          <div>
            <p className="text-xl font-bold text-white">7.12%</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Annual Growth</p>
          </div>
          <div className="w-px h-8 bg-white/[0.08]" />
          <div>
            <p className="text-xl font-bold text-white">1,000+</p>
            <p className="text-[10px] text-white/30 uppercase tracking-wider">Target Suppliers</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
