"use client";

import { ReactNode } from "react";
import { CartProvider } from "./cart-context";
import { CartDrawer } from "./cart-drawer";

export function DashboardCartWrapper({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartDrawer />
    </CartProvider>
  );
}
