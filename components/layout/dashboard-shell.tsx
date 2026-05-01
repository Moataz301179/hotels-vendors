"use client";

import { ReactNode, useState } from "react";
import { PulseSidebar } from "./pulse-sidebar";
import { DashboardHeader } from "./dashboard-header";

interface DashboardShellProps {
  children: ReactNode;
  role: "admin" | "hotel" | "supplier" | "factoring" | "shipping";
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Pulse Sidebar */}
      <aside
        className={`flex-shrink-0 transition-all duration-300 ease-out ${
          sidebarOpen ? "w-[280px]" : "w-[72px]"
        }`}
      >
        <PulseSidebar
          role={role}
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </aside>

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0">
        <DashboardHeader role={role} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
