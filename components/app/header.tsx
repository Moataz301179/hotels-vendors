"use client";

import { Search, Bell, ChevronRight, ShoppingCart, LogOut, User } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { RoleSwitcher } from "./role-context";
import { useCart } from "./cart-context";
import { useAuth } from "./auth-context";

const CRUMB_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  hotels: "Hotels",
  supplier: "Suppliers",
  catalog: "Catalog",
  cart: "Cart",
  orders: "Orders",
  invoices: "Invoices",
  accounting: "Accounting",
  "ai-inventory": "AI Inventory",
  "eta-demo": "ETA Demo",
  intelligence: "Intelligence",
  settings: "Settings",
  factoring: "Factoring",
  outlets: "Outlets",
  logistics: "Logistics",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AppHeader() {
  const [search, setSearch] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const crumbs = segments.map((s) => CRUMB_MAP[s] || s);
  const { cart, setIsOpen } = useCart();
  const { user, logout } = useAuth();
  const itemCount = cart?.summary?.itemCount ?? 0;

  return (
    <header className="fixed top-0 right-0 left-56 z-30 h-14 flex items-center justify-between px-4 border-b border-border-subtle bg-background/95 backdrop-blur-sm">
      {/* Breadcrumbs + Search */}
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <nav className="flex items-center gap-1 text-xs text-foreground-muted shrink-0">
          {crumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3 h-3" />}
              <span className={i === crumbs.length - 1 ? "text-foreground font-medium" : ""}>{crumb}</span>
            </span>
          ))}
        </nav>
        <div className="h-4 w-px bg-border-subtle shrink-0" />
        <div className="relative w-64 max-w-full">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-foreground-muted" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-md bg-surface border border-border-subtle focus:border-brand-500/50 focus:outline-none transition-colors placeholder:text-foreground-faint"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <RoleSwitcher />
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 rounded-md text-foreground-muted hover:bg-surface hover:text-foreground transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          {itemCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] flex items-center justify-center rounded-full bg-brand-600 text-white text-[10px] font-bold px-1">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </button>
        <button className="relative p-2 rounded-md text-foreground-muted hover:bg-surface hover:text-foreground transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
        </button>
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 border-l border-border-subtle py-1 pr-1 rounded-md hover:bg-surface transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-brand-700 flex items-center justify-center text-white text-[10px] font-bold">
              {user ? getInitials(user.name) : "?"}
            </div>
            <div className="hidden sm:flex flex-col items-start leading-tight">
              <span className="text-xs text-foreground font-medium">{user?.name || "Guest"}</span>
              <span className="text-[10px] text-foreground-faint">{user?.hotel?.name || "Select hotel"}</span>
            </div>
          </button>
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-48 rounded-lg border border-border-subtle bg-surface shadow-lg z-50 py-1">
                <div className="px-3 py-2 border-b border-border-subtle">
                  <p className="text-xs font-medium text-foreground">{user?.name || "Guest"}</p>
                  <p className="text-[10px] text-foreground-faint">{user?.email || ""}</p>
                </div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-foreground-muted hover:bg-surface-raised hover:text-foreground transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
