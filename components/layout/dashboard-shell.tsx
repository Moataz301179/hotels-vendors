"use client";

import { ReactNode, useState, useEffect } from "react";
import { PulseSidebar } from "./pulse-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { CartProvider } from "@/components/cart/cart-context";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  platformRole: string;
  tenantName?: string;
}

interface DashboardShellProps {
  children: ReactNode;
  role: "admin" | "hotel" | "supplier" | "factoring" | "shipping" | "marketing";
  user?: UserData | null;
}

export function DashboardShell({ children, role, user }: DashboardShellProps) {
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--background)]">
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
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
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
      <CartProvider>
        <div className="flex flex-col flex-1 min-w-0">
          <DashboardHeader
            role={role}
            user={user}
            onMenuClick={() => setMobileOpen(true)}
          />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
      </CartProvider>
    </div>
  );
}
