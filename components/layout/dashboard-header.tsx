"use client";

import Link from "next/link";
import { Settings, Menu, ShoppingCart, HeartPulse, ScrollText, Sun, Moon, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { BrandLogo } from "./brand-logo";
import { UserDropdown } from "./user-dropdown";
import { useCart } from "@/components/cart/cart-context";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { DensityToggle } from "@/components/shared/density-toggle";
import { getTrialStatus } from "@/lib/fintech/trial";
import { CommandPaletteTrigger } from "@/components/shared/command-palette";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  platformRole: string;
  tenantName?: string;
  createdAt?: string;
}

interface DashboardHeaderProps {
  role: string;
  user?: UserData | null;
  onMenuClick?: () => void;
  onCmdOpen?: () => void;
}

const ROLE_CONFIG: Record<string, { label: string; badgeColor: string }> = {
  admin: { label: "Platform Admin", badgeColor: "bg-[#39ff7e]" },
  hotel: { label: "Hotel Buyer", badgeColor: "bg-[#39ff7e]" },
  supplier: { label: "Supplier", badgeColor: "bg-[#ff7e1a]" },
  factoring: { label: "Factoring Partner", badgeColor: "bg-[#c455ff]" },
  shipping: { label: "Logistics", badgeColor: "bg-[#64b5f6]" },
  marketing: { label: "Marketing", badgeColor: "bg-[#c455ff]" },
};

export function DashboardHeader({ role, user, onMenuClick, onCmdOpen }: DashboardHeaderProps) {
  const config = ROLE_CONFIG[role] || ROLE_CONFIG.hotel;
  const { totalItems, toggleCart } = useCart();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const saved = localStorage.getItem("hv-theme");
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.documentElement.classList.toggle("light-mode", saved === "light");
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("hv-theme", next);
    document.documentElement.classList.toggle("light-mode", next === "light");
  };

  return (
    <header className="h-14 sm:h-16 flex items-center justify-between px-3 sm:px-6 sticky top-0 z-30 bg-[#12121a]/90 backdrop-blur-xl border-b border-white/[0.06]">
      {/* Left: Mobile Menu + Logo */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/[0.06] transition-colors flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
          <BrandLogo variant="dark" size="md" showText={false} />
          <span className="text-sm font-semibold text-white uppercase hidden lg:block" style={{ letterSpacing: "0.2em", fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
            Hotels Vendors
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-3">
          <span className="text-xs font-medium text-white/25 uppercase tracking-[0.15em]">Dashboard</span>
          <span className="text-white/10">/</span>
          <span className="text-xs font-medium text-white/50">{config.label}</span>
        </div>
      </div>

      {/* Center: Search trigger — hidden on mobile, visible on md+ */}
      <div className="hidden md:block flex-1 max-w-xl mx-2 sm:mx-4 lg:mx-8">
        <CommandPaletteTrigger onOpen={() => onCmdOpen?.()} className="w-full justify-center" />
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08]">
          <span className={`w-2 h-2 rounded-full ${config.badgeColor}`} />
          <span className="text-xs font-medium text-white/50">{config.label}</span>
          {role === "supplier" && user?.createdAt && (() => {
            const trial = getTrialStatus(user.createdAt);
            if (trial.isExpired) return null;
            return (
              <span className="flex items-center gap-1 ml-1 px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider"
                style={{ backgroundColor: "#ff7e1a18", color: "#ff7e1a" }}>
                <Clock size={10} />
                Trial {trial.daysRemaining}d
              </span>
            );
          })()}
        </div>

        {role === "admin" && (
          <>
            <Link href="/admin/health" className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all hidden sm:flex" aria-label="Platform Health">
              <HeartPulse size={18} />
            </Link>
            <Link href="/admin/logs" className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all hidden sm:flex" aria-label="System Logs">
              <ScrollText size={18} />
            </Link>
          </>
        )}

        <Link href={role === "admin" ? "/admin/settings" : "/settings"} className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all hidden sm:flex" aria-label="Settings">
          <Settings size={18} />
        </Link>

        <button
          onClick={toggleTheme}
          className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all hidden sm:flex"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <DensityToggle />

        <button
          onClick={toggleCart}
          className="relative p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-white/30 hover:text-white/70 hover:bg-white/[0.05] transition-all"
          aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
        >
          <ShoppingCart size={18} />
          {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#39ff7e] text-[11px] font-bold text-[#07090f] flex items-center justify-center ring-2 ring-[#12121a]">
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
