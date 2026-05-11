"use client";

import Link from "next/link";
import { Search, Settings, SlidersHorizontal, Menu, ShoppingCart } from "lucide-react";
import { BrandLogo } from "./brand-logo";
import { UserDropdown } from "./user-dropdown";
import { useCart } from "@/components/cart/cart-context";
import { NotificationBell } from "@/components/notifications/notification-bell";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  platformRole: string;
  tenantName?: string;
}

interface DashboardHeaderProps {
  role: string;
  user?: UserData | null;
  onMenuClick?: () => void;
}

const ROLE_CONFIG: Record<string, { label: string; badgeColor: string }> = {
  admin: { label: "Platform Admin", badgeColor: "bg-[#8B0000]" },
  hotel: { label: "Hotel Buyer", badgeColor: "bg-emerald-500" },
  supplier: { label: "Supplier", badgeColor: "bg-blue-500" },
  factoring: { label: "Factoring Partner", badgeColor: "bg-amber-500" },
  shipping: { label: "Logistics", badgeColor: "bg-cyan-500" },
  marketing: { label: "Marketing", badgeColor: "bg-purple-500" },
};

export function DashboardHeader({ role, user, onMenuClick }: DashboardHeaderProps) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.hotel;
  const { totalItems, toggleCart } = useCart();

  return (
    <header className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30 bg-[#121212]/80 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left: Mobile Menu + Logo */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <BrandLogo variant="dark" size="md" />
          <span className="text-sm font-semibold text-white hidden lg:block">Hotels Vendors</span>
        </Link>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs font-medium text-white/30 uppercase tracking-wider">Dashboard</span>
          <span className="text-white/10">/</span>
          <span className="text-xs font-medium text-white/60">{config.label}</span>
        </div>
      </div>

      {/* Center: Search */}
      <div className="flex-1 max-w-xl mx-2 sm:mx-4 lg:mx-8">
        <div className="relative group flex items-center">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-[#8B0000] transition-colors z-10" />
          <input
            type="text"
            placeholder="Search orders, suppliers, products..."
            className="w-full h-9 pl-9 pr-20 sm:pr-24 rounded-lg text-sm text-white placeholder:text-white/20 bg-white/[0.04] border border-white/[0.08] outline-none focus:border-[#8B0000]/40 focus:ring-1 focus:ring-[#8B0000]/10 transition-all"
          />
          <button className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-colors border border-white/[0.06]">
            <SlidersHorizontal size={11} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className={`w-2 h-2 rounded-full ${config.badgeColor}`} />
          <span className="text-xs font-medium text-white/60">{config.label}</span>
        </div>

        <button className="relative p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all hidden sm:block">
          <Settings size={18} />
        </button>

        <button
          onClick={toggleCart}
          className="relative p-2 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all"
        >
          <ShoppingCart size={18} />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#8B0000] text-[10px] font-bold text-white flex items-center justify-center ring-2 ring-[#121212]">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </button>

        <NotificationBell />
        <UserDropdown user={user} />
      </div>
    </header>
  );
}
