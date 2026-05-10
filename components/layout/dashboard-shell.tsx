"use client";

import { ReactNode, useState, useEffect } from "react";
import { PulseSidebar } from "./pulse-sidebar";
import { DashboardHeader } from "./dashboard-header";

interface DashboardShellProps {
  children: ReactNode;
  role: "admin" | "hotel" | "supplier" | "factoring" | "shipping" | "marketing";
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile sidebar on route changes
  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'linear-gradient(180deg, #121212 0%, #1C1C1C 100%)' }}>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-shrink-0 transition-all duration-300 ease-out ${
          desktopCollapsed ? "w-[72px]" : "w-[280px]"
        }`}
      >
        <PulseSidebar
          role={role}
          collapsed={desktopCollapsed}
          onToggle={() => setDesktopCollapsed(!desktopCollapsed)}
        />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          {/* Mobile Sidebar */}
          <aside className="fixed left-0 top-0 z-50 h-full w-[280px] md:hidden">
            <PulseSidebar
              role={role}
              collapsed={false}
              onToggle={() => setMobileOpen(false)}
              isMobile
            />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardHeader
          role={role}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
