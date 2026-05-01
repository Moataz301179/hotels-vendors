"use client";

import { Search, Bell, User } from "lucide-react";

interface DashboardHeaderProps {
  role: string;
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const roleLabel = {
    admin: "Platform Administrator",
    hotel: "Hotel Procurement",
    supplier: "Supplier Central",
    factoring: "Factoring Desk",
    shipping: "Logistics Control",
  }[role] || "Dashboard";

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-border-subtle bg-surface/80 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-foreground-muted uppercase tracking-wider">
          {roleLabel}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-faint" />
          <input
            type="text"
            placeholder="Search orders, suppliers, invoices..."
            className="w-80 h-9 pl-9 pr-4 rounded-lg bg-surface-raised border border-border-subtle text-sm text-foreground placeholder:text-foreground-faint focus:outline-none focus:border-brand-700 transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-500 ring-2 ring-surface" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg hover:bg-surface-raised transition-colors">
          <div className="w-8 h-8 rounded-full bg-brand-900/30 flex items-center justify-center">
            <User size={15} className="text-brand-400" />
          </div>
          <span className="text-sm font-medium text-foreground">Admin</span>
        </button>
      </div>
    </header>
  );
}
