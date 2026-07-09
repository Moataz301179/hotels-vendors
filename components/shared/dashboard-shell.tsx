"use client";

import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { cn } from "@/lib/utils";

interface DashboardShellProps {
  children: React.ReactNode;
  role: "hotel" | "supplier" | "factoring" | "admin";
  className?: string;
}

export function DashboardShell({ children, role, className }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar role={role} />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className={cn("flex-1 p-6", className)}>
          {children}
        </main>
      </div>
    </div>
  );
}
