"use client";

import { motion } from "framer-motion";
import { BrandLogo } from "@/components/layout/brand-logo";

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

      {/* Middle: minimal tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="relative z-10 flex-1 flex flex-col justify-center py-12"
      >
        <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight tracking-tight">
          Smarter Together.
        </h2>
        <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-sm">
          Egypt's B2B procurement platform connecting hotels with verified suppliers, embedded factoring, and automatic ETA compliance.
        </p>
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
