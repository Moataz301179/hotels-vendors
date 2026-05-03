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
    marketing: "Marketing Command",
  }[role] || "Dashboard";

  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-[var(--border-subtle)] bg-[var(--surface)]/80 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
          {roleLabel}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]" />
          <input
            type="text"
            placeholder="Search orders, suppliers, invoices..."
            className="w-80 h-9 pl-9 pr-4 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-default)] text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-muted)] focus:outline-none focus:border-[var(--accent-600)] focus:ring-1 focus:ring-[var(--accent-600)] transition-colors"
          />
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-500)] ring-2 ring-[var(--surface)]" />
        </button>

        {/* User */}
        <button className="flex items-center gap-2.5 p-1.5 pr-3 rounded-lg hover:bg-[var(--surface-raised)] transition-colors">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-500)]/10 flex items-center justify-center">
            <User size={15} className="text-[var(--accent-400)]" />
          </div>
          <span className="text-sm font-medium text-[var(--foreground)]">Admin</span>
        </button>
      </div>
    </header>
  );
}
