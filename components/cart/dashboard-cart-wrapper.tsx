"use client";

import { ReactNode } from "react";
import { CartProvider } from "./cart-context";

export function DashboardCartWrapper({ children }: { children: ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}
