"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ChevronDown } from "lucide-react";
import { InvoSidebar } from "@/components/invo/invo-sidebar";
import type { UserData } from "../layout";

export function InvoDashboardShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserData;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div data-accent="invo" className="flex h-screen w-full overflow-hidden bg-black">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-shrink-0 transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-[280px]"
        }`}
      >
        <InvoSidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-full w-[280px] md:hidden">
            <InvoSidebar
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              isMobile
            />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Header */}
        <header className="flex-shrink-0 h-14 border-b border-[rgba(212,168,67,0.08)] bg-black flex items-center justify-between px-4 sm:px-6">
          <button
            className="md:hidden p-2 rounded-lg text-white/40 hover:text-[#D4A843] hover:bg-[rgba(212,168,67,0.08)] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <Menu size={20} />
          </button>

          <div className="hidden md:block" />

          <div className="flex items-center gap-3">
            <span className="text-[13px] text-white/40 hidden sm:inline">
              {user.tenantName || user.name}
            </span>
            <div className="flex items-center gap-2 pl-3 border-l border-white/[0.06]">
              <div className="w-8 h-8 rounded-lg bg-[rgba(212,168,67,0.15)] flex items-center justify-center">
                <span className="text-[12px] font-medium text-[#D4A843]">
                  {user.name?.charAt(0)?.toUpperCase() || "S"}
                </span>
              </div>
              <ChevronDown size={14} className="text-white/25" />
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
