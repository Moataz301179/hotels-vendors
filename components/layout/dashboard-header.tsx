"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown, Settings } from "lucide-react";

interface DashboardHeaderProps {
  role: string;
}

const ROLE_CONFIG: Record<string, { label: string; badgeColor: string }> = {
  admin: { label: "Platform Admin", badgeColor: "bg-[#800000]" },
  hotel: { label: "Hotel Buyer", badgeColor: "bg-emerald-500" },
  supplier: { label: "Supplier", badgeColor: "bg-blue-500" },
  factoring: { label: "Factoring Partner", badgeColor: "bg-amber-500" },
  shipping: { label: "Logistics", badgeColor: "bg-cyan-500" },
  marketing: { label: "Marketing", badgeColor: "bg-purple-500" },
};

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.hotel;

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-30"
      style={{
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(16px) saturate(1.2)",
        WebkitBackdropFilter: "blur(16px) saturate(1.2)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Left: Logo + Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#800000]/15 border border-[#800000]/25 flex items-center justify-center group-hover:bg-[#800000]/25 transition-colors">
            <Image src="/logo-horse-only.png" alt="Hotels Vendors" width={20} height={20} className="opacity-90" priority />
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-[rgba(255,255,255,0.35)] uppercase tracking-wider">
            Dashboard
          </span>
          <span className="text-[rgba(255,255,255,0.15)]">/</span>
          <span className="text-xs font-medium text-[rgba(255,255,255,0.60)]">
            {config.label}
          </span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(255,255,255,0.30)] group-focus-within:text-[#800000] transition-colors"
          />
          <input
            type="text"
            placeholder="Search orders, suppliers, products..."
            className="w-full h-9 pl-9 pr-4 rounded-lg text-sm text-white placeholder:text-[rgba(255,255,255,0.25)] glass-input"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass-card">
          <span className={`w-2 h-2 rounded-full ${config.badgeColor}`} />
          <span className="text-xs font-medium text-[rgba(255,255,255,0.70)]">
            {config.label}
          </span>
          <ChevronDown size={12} className="text-[rgba(255,255,255,0.30)]" />
        </div>

        {/* Settings */}
        <button className="relative p-2 rounded-lg text-[rgba(255,255,255,0.40)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all">
          <Settings size={18} />
        </button>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg text-[rgba(255,255,255,0.40)] hover:text-white hover:bg-[rgba(255,255,255,0.05)] transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#800000] ring-2 ring-black" />
        </button>

        {/* Avatar */}
        <button className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#800000] to-[#4d0000] flex items-center justify-center text-white text-xs font-bold ring-2 ring-[rgba(255,255,255,0.08)]">
            AH
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-white leading-tight">Ahmed Hassan</p>
            <p className="text-[10px] text-[rgba(255,255,255,0.35)] leading-tight">Nile Palace Hotel</p>
          </div>
        </button>
      </div>
    </header>
  );
}
