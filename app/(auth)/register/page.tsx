"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Hotel, UserCog, ArrowRight, Building2, Landmark, Truck } from "lucide-react";

const roles = [
  {
    icon: Hotel,
    title: "Hotel Owner",
    desc: "Manage procurement, track spend, and connect with verified suppliers.",
    href: "/register/hotel",
    accent: "#a3e635",
  },
  {
    icon: UserCog,
    title: "Supplier",
    desc: "List products, receive orders, and get paid faster with embedded financing.",
    href: "/register/supplier",
    accent: "#bef264",
  },
  {
    icon: Landmark,
    title: "Factoring Partner",
    desc: "Provide liquidity to suppliers through invoice factoring.",
    href: "/register/factoring",
    accent: "#34d399",
  },
  {
    icon: Truck,
    title: "Logistics Partner",
    desc: "Optimize delivery routes and reduce shipping overhead.",
    href: "/register/logistics",
    accent: "#60a5fa",
  },
];

export default function RegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#a3e635]/10 border border-[#a3e635]/20 mb-6">
          <Building2 className="w-6 h-6 text-[#a3e635]" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Join HotelsVendors</h1>
        <p className="mt-2 text-sm text-white/40">Choose your role to get started</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role, i) => (
          <motion.div
            key={role.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <Link
              href={role.href}
              className="group flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 hover:border-[#a3e635]/20 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08]"
                  style={{ backgroundColor: `${role.accent}10`, borderColor: `${role.accent}20` }}
                >
                  <role.icon className="w-5 h-5" style={{ color: role.accent }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white group-hover:text-[#a3e635] transition-colors">
                    {role.title}
                  </h3>
                </div>
              </div>
              <p className="text-xs text-white/30 leading-relaxed mb-4">{role.desc}</p>
              <div className="mt-auto flex items-center gap-1 text-xs font-medium" style={{ color: role.accent }}>
                Get Started <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs text-white/20">
          Already have an account?{" "}
          <Link href="/login" className="text-[#a3e635] hover:text-[#bef264] transition-colors font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
