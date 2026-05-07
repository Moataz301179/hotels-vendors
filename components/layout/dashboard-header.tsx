"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, Bell, Settings } from "lucide-react";

interface DashboardHeaderProps {
  role: string;
}

const ROLE_CONFIG: Record<string, { label: string; badgeColor: string }> = {
  admin: { label: "Platform Admin", badgeColor: "bg-[#b91c1c]" },
  hotel: { label: "Hotel Buyer", badgeColor: "bg-emerald-500" },
  supplier: { label: "Supplier", badgeColor: "bg-blue-500" },
  factoring: { label: "Factoring Partner", badgeColor: "bg-amber-500" },
  shipping: { label: "Logistics", badgeColor: "bg-cyan-500" },
  marketing: { label: "Marketing", badgeColor: "bg-purple-500" },
};

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.hotel;

  return (
    <header className="h-16 flex items-center justify-between px-6 sticky top-0 z-30 bg-white border-b border-gray-200">
      {/* Left: Logo + Breadcrumb */}
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-9 h-10 flex items-center justify-center rounded-lg border-2 border-[#b91c1c]/80 bg-white p-0.5">
            <Image src="/logo-horse-only.png" alt="" width={28} height={34} className="object-contain" priority />
          </div>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Dashboard</span>
          <span className="text-gray-200">/</span>
          <span className="text-xs font-medium text-gray-600">{config.label}</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative group">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#b91c1c] transition-colors" />
          <input
            type="text"
            placeholder="Search orders, suppliers, products..."
            className="w-full h-9 pl-9 pr-4 rounded-lg text-sm text-gray-700 placeholder:text-gray-300 bg-gray-50 border border-gray-200 outline-none focus:border-[#b91c1c]/40 focus:ring-1 focus:ring-[#b91c1c]/10 transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-200">
          <span className={`w-2 h-2 rounded-full ${config.badgeColor}`} />
          <span className="text-xs font-medium text-gray-600">{config.label}</span>
        </div>

        <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
          <Settings size={18} />
        </button>

        <button className="relative p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#b91c1c] ring-2 ring-white" />
        </button>

        <button className="flex items-center gap-2.5 pl-1">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#b91c1c] to-[#7f1d1d] flex items-center justify-center text-white text-xs font-bold ring-2 ring-gray-100">
            MZ
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-medium text-gray-900 leading-tight">Moataz</p>
            <p className="text-[10px] text-gray-400 leading-tight">CEO</p>
          </div>
        </button>
      </div>
    </header>
  );
}
