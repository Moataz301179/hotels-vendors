"use client";

import Link from "next/link";
import { Settings, Menu, ShoppingCart, HeartPulse, ScrollText, Sun, Moon, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { BrandLogo } from "./brand-logo";
import { UserDropdown } from "./user-dropdown";
import { useCart } from "@/components/cart/cart-context";
import { NotificationBell } from "@/components/notifications/notification-bell";
import { DensityToggle } from "@/components/shared/density-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
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
  admin: { label: "Platform Admin", badgeColor: "bg-[var(--accent-base)]" },
  hotel: { label: "Hotel Buyer", badgeColor: "bg-[var(--accent-base)]" },
  supplier: { label: "Supplier", badgeColor: "bg-[var(--orange-base)]" },
  factoring: { label: "Factoring Partner", badgeColor: "bg-[var(--purple-base)]" },
  shipping: { label: "Logistics", badgeColor: "bg-[#64b5f6]" },
  marketing: { label: "Marketing", badgeColor: "bg-[var(--purple-base)]" },
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

  const nowLabel = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/80 px-3 backdrop-blur-xl sm:h-16 sm:px-6">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <button
          onClick={onMenuClick}
          className="flex-shrink-0 rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>
        <Link href="/" className="flex flex-shrink-0 items-center gap-2.5">
          <BrandLogo variant="light" size="md" showText={false} />
          <span className="hidden text-sm font-semibold uppercase tracking-[0.2em] text-slate-800 lg:block" style={{ fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
            Hotels Vendors
          </span>
        </Link>
        <div className="hidden items-center gap-2 xl:flex">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-base)]" />
            Control Atelier
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
            {config.label}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-600">
            Node {nowLabel}
          </span>
        </div>
      </div>

      <div className="mx-2 hidden max-w-xl flex-1 md:block sm:mx-4 lg:mx-8">
        <CommandPaletteTrigger onOpen={() => onCmdOpen?.()} className="w-full justify-center" />
      </div>

      <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 sm:flex">
          <span className={`h-2 w-2 rounded-full ${config.badgeColor}`} />
          <span className="text-xs font-medium text-slate-600">{config.label}</span>
          {role === "supplier" && user?.createdAt && (() => {
            const trial = getTrialStatus(user.createdAt);
            if (trial.isExpired) return null;
            return (
              <span className="ml-1 flex items-center gap-1 rounded-full bg-slate-200 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-slate-700">
                <Clock size={10} />
                Trial {trial.daysRemaining}d
              </span>
            );
          })()}
        </div>

        {role === "admin" && (
          <>
            <Link href="/admin/health" className="relative hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 sm:flex" aria-label="Platform Health">
              <HeartPulse size={18} />
            </Link>
            <Link href="/admin/logs" className="relative hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 sm:flex" aria-label="System Logs">
              <ScrollText size={18} />
            </Link>
          </>
        )}

        <Link href={role === "admin" ? "/admin/settings" : "/settings"} className="relative hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 sm:flex" aria-label="Settings">
          <Settings size={18} />
        </Link>

        <button
          onClick={toggleTheme}
          className="relative hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700 sm:flex"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <DensityToggle />
        <LanguageSwitcher />

        <button
          onClick={toggleCart}
          className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 text-slate-500 transition-all hover:bg-slate-100 hover:text-slate-700"
          aria-label={`Shopping cart${totalItems > 0 ? `, ${totalItems} items` : ""}`}
        >
          <ShoppingCart size={18} />
          {totalItems > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--accent-base)] px-1 text-[11px] font-bold text-[#1a140f] ring-2 ring-white">
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
