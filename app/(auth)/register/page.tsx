"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Hotel, Store, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

const MARKETPLACE_ROLES = [
  {
    slug: "hotel",
    label: "Hotel / Property",
    tagline: "Streamline procurement across all your properties",
    desc: "Access verified suppliers, automate purchase orders, enforce approval matrices, and generate ETA-compliant invoices — all from one dashboard.",
    icon: Hotel,
    stats: "68 verified suppliers",
    cta: "Register as Hotel",
  },
  {
    slug: "supplier",
    label: "Supplier / Vendor",
    tagline: "Grow your B2B hospitality business",
    desc: "List your products, receive POs from vetted hotels, get paid faster with embedded factoring, and track deliveries in real time.",
    icon: Store,
    stats: "52 hotel properties",
    cta: "Register as Supplier",
  },
];

export default function RegisterGatewayPage() {
  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Mobile brand */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:hidden flex items-center gap-3 mb-8 justify-center"
      >
        <BrandLogo variant="dark" size="md" />
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white">Hotels Vendors</h1>
          <p className="text-[10px] text-white/40 uppercase tracking-wider">Digital Procurement Hub</p>
        </div>
      </motion.div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-center mb-10"
      >
        <h2 className="text-[22px] md:text-[26px] font-semibold text-white tracking-tight">
          Join the platform
        </h2>
        <p className="text-[13px] text-white/35 mt-2">
          Select your business type to get started
        </p>
      </motion.div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {MARKETPLACE_ROLES.map((role, i) => (
          <motion.div
            key={role.slug}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08 }}
          >
            <Link
              href={`/register/${role.slug}`}
              className="group block h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-[#8b5cf6]/30 hover:bg-white/[0.03] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-5">
                <div className="w-11 h-11 rounded-xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/15 flex items-center justify-center group-hover:bg-[#8b5cf6]/15 transition-colors">
                  <role.icon size={22} className="text-[#8b5cf6]" />
                </div>
                <span className="text-[11px] text-white/25 bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.05]">
                  {role.stats}
                </span>
              </div>

              <h3 className="text-[16px] font-semibold text-white mb-1">{role.label}</h3>
              <p className="text-[12px] text-[#8b5cf6]/70 font-medium mb-3">{role.tagline}</p>
              <p className="text-[12px] text-white/30 leading-relaxed mb-5">{role.desc}</p>

              <div className="flex items-center gap-2 text-[13px] font-medium text-white/50 group-hover:text-[#8b5cf6] transition-colors">
                {role.cta}
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Sign in link */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center text-[13px] text-white/25 mt-8"
      >
        Already have an account?{" "}
        <Link href="/login" className="text-[#8b5cf6] hover:text-[#ff6b6b] font-medium transition-colors">
          Sign in
        </Link>
      </motion.p>
    </div>
  );
}
