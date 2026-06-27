"use client";

import { useDashboardContext } from "@/components/dashboard/dashboard-shell";

export function useSessionInfo() {
  return useDashboardContext();
}
