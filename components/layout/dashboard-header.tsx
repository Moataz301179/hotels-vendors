"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Bell, Settings, Filter, SlidersHorizontal } from "lucide-react";

interface DashboardHeaderProps {
  role: string;
}

const ROLE_CONFIG: Record<string, { label: string; badgeColor: string }> = {
  admin: { label: "Platform Admin", badgeColor: "bg-[#FF5C00]" },
  hotel: { label: "Hotel Buyer", badgeColor: "bg-emerald-500" },
  supplier: { label: "Supplier", badgeColor: "bg-blue-500" },
  factoring: { label: "Factoring Partner", badgeColor: "bg-amber-500" },
  shipping: { label: "Logistics", badgeColor: "bg-cyan-500" },
  marketing: { label: "Marketing", badgeColor: "bg-purple-500" },
};

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.hotel;

  return (
    <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-30 bg-[#121212]/80 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left: Logo + Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <Image src="/logo-horse-only.png" alt="Hotels Vendors" width={28} height={34} className="object-contain opacity-90" priority />
          <span className="text-sm font-semibold text-white hidden lg:block">Hotels Vendors</span>
        </Link>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs font-medium text-white/30 uppercase tracking-wider">Dashboard</span>
          <span className="text-white/10">/</span>
          <span className="text-xs font-medium text-white/60">{config.label}</span>
        </div>
      </div>

      {/* Center: Search with Advanced Filters */}
      <div className="flex-1 max-w-xl mx-4 lg:mx-8">
        <div className="relative group flex items-center">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#FF5C00] transition-colors z-10" />
          <input
            type="text"
            placeholder="Search orders, suppliers, products..."
            className="w-full h-9 pl-9 pr-24 rounded-lg text-sm text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#FF5C00]/40 focus:ring-1 focus:ring-[#FF5C00]/10 transition-all"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors border border-white/[0.06]">
            <SlidersHorizontal size={11} />
            <span className="hidden sm:inline">Advanced Filters</span>
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className={`w-2 h-2 rounded-full ${config.badgeColor}`} />
          <span className="text-xs font-medium text-white/60">{config.label}</span>
        </div>

        <button className="relative p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all">
          <Settings size={18} />
        </button>

        <button className="relative p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF5C00] ring-2 ring-[#121212]" />
        </button>

        <button className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF5C00] to-[#cc4700] flex items-center justify-center text-white text-xs font-bold ring-2 ring-white/10">
            MZ
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-white leading-tight">Moataz</p>
            <p className="text-[10px] text-white/30 leading-tight">CEO</p>
          </div>
        </button>
      </div>
    </header>
  );
}
