"use client"

import type { ReactNode } from "react"

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-surface-1)",
        padding: "24px",
      }}
    >
      {children}
    </div>
  )
}
