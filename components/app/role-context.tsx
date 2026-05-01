"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type PlatformRole = "HOTEL" | "SUPPLIER" | "FACTORING" | "SHIPPING" | "ADMIN";

const ROLE_MODULES: Record<PlatformRole, string[]> = {
  HOTEL: ["/dashboard", "/hotels", "/supplier", "/catalog", "/orders", "/invoices", "/accounting", "/ai-inventory", "/eta-demo", "/intelligence"],
  SUPPLIER: ["/supplier", "/catalog", "/orders", "/eta-demo"],
  FACTORING: ["/invoices", "/accounting", "/eta-demo", "/intelligence"],
  SHIPPING: ["/orders", "/eta-demo", "/intelligence"],
  ADMIN: ["/dashboard", "/hotels", "/supplier", "/catalog", "/orders", "/invoices", "/accounting", "/ai-inventory", "/eta-demo", "/intelligence"],
};

const ROLE_LABELS: Record<PlatformRole, string> = {
  HOTEL: "Hotel Buyer",
  SUPPLIER: "Supplier",
  FACTORING: "Factoring",
  SHIPPING: "Shipping",
  ADMIN: "Administrator",
};

const ROLE_COLORS: Record<PlatformRole, string> = {
  HOTEL: "bg-blue-500",
  SUPPLIER: "bg-emerald-500",
  FACTORING: "bg-amber-500",
  SHIPPING: "bg-cyan-500",
  ADMIN: "bg-brand-500",
};

interface RoleContextValue {
  role: PlatformRole;
  setRole: (role: PlatformRole) => void;
  allowedModules: string[];
  isAllowed: (href: string) => boolean;
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<PlatformRole>("HOTEL");

  useEffect(() => {
    const saved = localStorage.getItem("hv_role") as PlatformRole | null;
    if (saved && ROLE_MODULES[saved]) {
      setRoleState(saved);
    }
  }, []);

  const setRole = (r: PlatformRole) => {
    setRoleState(r);
    localStorage.setItem("hv_role", r);
  };

  const allowedModules = ROLE_MODULES[role] || ROLE_MODULES.ADMIN;

  const isAllowed = (href: string) => {
    if (role === "ADMIN") return true;
    return allowedModules.some((m) => href === m || href.startsWith(`${m}/`));
  };

  return (
    <RoleContext.Provider value={{ role, setRole, allowedModules, isAllowed }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside RoleProvider");
  return ctx;
}

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 rounded-md text-[11px] font-medium bg-surface border border-border-subtle hover:border-brand-500/30 transition-colors"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${ROLE_COLORS[role]}`} />
        <span>{ROLE_LABELS[role]}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 w-40 rounded-md border border-border-subtle bg-surface shadow-lg z-50 py-1">
            {(Object.keys(ROLE_LABELS) as PlatformRole[]).map((r) => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setOpen(false);
                  window.location.reload();
                }}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-[11px] transition-colors ${
                  role === r ? "bg-brand-500/10 text-brand-400" : "text-foreground-muted hover:bg-surface-raised hover:text-foreground"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${ROLE_COLORS[r]}`} />
                {ROLE_LABELS[r]}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
