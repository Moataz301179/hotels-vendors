"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { AppContextData, Order, Supplier, Delivery, Invoice, Financing, Product, Role } from "@/lib/types";

export interface AppContextType {
  user?: { id: string; name?: string; tenantId: string; role: Role; platformRole: string; orgId?: string };
  cartCount: number;
  toasts: { id: string; message: string; type: "info" | "success" | "warning" | "error"; tone?: string; msg?: string; toast?: boolean }[];
  logout: () => void;
  data?: AppContextData;
  decideOrder?: (orderId: string, action: string, reason?: string) => Promise<void>;
  advanceFulfillment?: (orderId: string, stage?: string) => Promise<void>;
  toast?: (message: string, type?: "info" | "success" | "warning" | "error") => void;
}

const AppContext = createContext<AppContextType>({
  user: undefined,
  cartCount: 0,
  toasts: [],
  logout: () => {},
  data: undefined,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppContextType["user"]>(undefined);
  const [cartCount, setCartCount] = useState(0);
  const [toasts, setToasts] = useState<AppContextType["toasts"]>([]);
  const router = useRouter();
  const [data, setData] = useState<AppContextData | undefined>(undefined);

  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch("/api/auth/session", { credentials: "include" });
        if (res.ok) {
          const payload = await res.json();
          if (payload?.user) setUser(payload.user as AppContextType["user"]);
        }
        const cartRes = await fetch("/api/v1/cart/count");
        if (cartRes.ok) {
          const cartData = await cartRes.json();
          if (typeof cartData.count === "number") setCartCount(cartData.count);
        }
      } catch {}
    }
    loadSession();
  }, []);

  const addToast = useCallback((message: string, type: "info" | "success" | "warning" | "error" = "info") => {
    const toast = { id: Date.now().toString(), message, msg: message, tone: type, type };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toast.id)), 5000);
  }, []);

  const logout = useCallback(async () => {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch {}
    setUser(undefined);
    router.push("/login");
  }, [router]);

  const decideOrder = useCallback(async (orderId: string, action: string, reason?: string) => {
    try {
      await fetch(`/api/v1/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action, reason }),
      });
      addToast(`Order ${action}`, "success");
    } catch { addToast("Approval action failed", "error"); }
  }, [addToast]);

  const advanceFulfillment = useCallback(async (orderId: string, stage?: string) => {
    try {
      await fetch(`/api/v1/orders/${orderId}/fulfill`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage }),
      });
      addToast("Fulfillment advanced", "success");
    } catch { addToast("Fulfillment action failed", "error"); }
  }, [addToast]);

  const contextValue = { user, cartCount, toasts, logout, data, decideOrder, advanceFulfillment, toast: addToast };
  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
}

export function canApprove(user: { role?: string; id?: string } | undefined, required: string[] | boolean | undefined): boolean {
  if (!user) return false;
  if (required === undefined) return false;
  if (typeof required === "boolean") return required;
  if (!required.length) return false;
  return true;
}

export function useApp(): AppContextType {
  return useContext(AppContext);
}
