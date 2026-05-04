"use client";

import { Search, Bell, ChevronDown } from "lucide-react";

interface DashboardHeaderProps {
  role: string;
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
  const roleBadge: Record<string, string> = {
    admin: "Platform Admin",
    hotel: "Hotel Buyer",
    supplier: "Supplier",
    factoring: "Factoring Partner",
    shipping: "Logistics",
    marketing: "Marketing",
  };

  const label = roleBadge[role] || "User";

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-100">
      <div className="flex items-center gap-4">
        <h1 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Dashboard</h1>
      </div>

      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[var(--accent-500)] focus:ring-1 focus:ring-[var(--accent-500)]/20 transition-colors"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-500)]" />
          <span className="text-xs font-medium text-gray-700">{label}</span>
          <ChevronDown size={12} className="text-gray-400" />
        </div>

        <button className="relative p-2.5 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[var(--accent-500)] ring-2 ring-white" />
        </button>

        <button className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[var(--accent-500)] flex items-center justify-center text-white text-sm font-bold">
            AH
          </div>
          <span className="text-sm font-medium text-gray-900">Ahmed Hassan</span>
        </button>
      </div>
    </header>
  );
}
