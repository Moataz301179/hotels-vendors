"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { PaletteSwitcher } from "@/components/palette-switcher";
import { initials } from "@/lib/utils";
import { LogOut, ChevronDown, Store, ShoppingCart, Landmark, Wallet, LayoutDashboard, Route, ClipboardCheck, BrainCircuit, BellRing, Settings2, FileCheck2, FileSignature } from "lucide-react";

const headerNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/orders", label: "Orders", icon: ShoppingCart },
  { href: "/tracking", label: "Tracking", icon: Route },
  { href: "/grn", label: "GRN", icon: ClipboardCheck },
  { href: "/guarantees", label: "Guarantees", icon: FileSignature },
  { href: "/financing", label: "Capital", icon: Landmark },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/compliance", label: "ETA", icon: FileCheck2 },
  { href: "/ai-assistant", label: "AI", icon: BrainCircuit },
  { href: "/notifications", label: "Alerts", icon: BellRing },
  { href: "/admin", label: "Admin", icon: Settings2 },
];

export function Topbar({ name, org, orgType, title }: { name: string; org: string; orgType: string; title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/92 backdrop-blur-md">
      <div className="flex h-14 items-center justify-between px-5 lg:px-8">
        <div>
          <h1 className="text-base font-semibold text-fg">{title}</h1>
          <p className="hidden text-xs text-fg-3 sm:block">{org} · <span className="capitalize">{orgType}</span> workspace</p>
        </div>
        <div className="flex items-center gap-2">
          <PaletteSwitcher />
          <ThemeToggle />
          <div className="relative">
            <button onClick={() => setOpen((v) => !v)} className="flex items-center gap-2 rounded-xl border border-border-2 py-1 pl-1 pr-2 transition hover:border-border-3">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-lime text-xs font-semibold text-bg">{initials(name)}</span>
              <ChevronDown className="h-3.5 w-3.5 text-fg-3" />
            </button>
            {open && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-border bg-bg-1 shadow-2xl">
                  <div className="border-b border-border px-4 py-3">
                    <p className="text-sm font-semibold text-fg">{name}</p>
                    <p className="text-xs text-fg-3">{org}</p>
                  </div>
                  <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-red transition hover:bg-bg-2">
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-border px-3 py-2 lg:px-6">
        {headerNav.map((n) => {
          const active = pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href));
          return (
            <Link key={n.href} href={n.href} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${active ? "bg-lime-dim text-lime" : "text-fg-3 hover:bg-bg-2 hover:text-fg"}`}>
              <n.icon className="h-3.5 w-3.5" /> {n.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
