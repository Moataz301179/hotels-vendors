"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoFull } from "@/components/logo";
import { LayoutDashboard, Store, ShoppingCart, Landmark, Wallet, Route, ClipboardCheck, FileCheck2, BrainCircuit, BellRing, Settings2, FileSignature } from "lucide-react";

const nav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, layer: "INVO" },
  { href: "/marketplace", label: "Marketplace", icon: Store, layer: "INVO" },
  { href: "/orders", label: "Orders", icon: ShoppingCart, layer: "INVO" },
  { href: "/tracking", label: "Tracking", icon: Route, layer: "INVO" },
  { href: "/grn", label: "GRN", icon: ClipboardCheck, layer: "INVO" },
  { href: "/guarantees", label: "Guarantees", icon: FileSignature, layer: "CAPITAL" },
  { href: "/financing", label: "Capital", icon: Landmark, layer: "CAPITAL" },
  { href: "/wallet", label: "Wallet", icon: Wallet, layer: "CAPITAL" },
  { href: "/compliance", label: "Compliance", icon: FileCheck2, layer: "CAPITAL" },
  { href: "/ai-assistant", label: "AI Assistant", icon: BrainCircuit, layer: "INVO" },
  { href: "/notifications", label: "Notifications", icon: BellRing, layer: "INVO" },
  { href: "/admin", label: "Admin", icon: Settings2, layer: "CAPITAL" },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-bg-1 lg:flex lg:flex-col">
      <div className="flex h-14 items-center border-b border-border px-5">
        <Link href="/"><LogoFull /></Link>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {(["INVO", "CAPITAL"] as const).map((layer) => (
          <div key={layer} className="mb-2">
            <p className="px-3 pb-1.5 pt-3 text-[10px] font-semibold uppercase tracking-widest text-fg-4">
              {layer === "INVO" ? "INVO · Transactional" : "HV Capital · Orchestration"}
            </p>
            <div className="space-y-0.5">
              {nav.filter((n) => n.layer === layer).map((n) => {
                const active = pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href));
                return (
                  <Link key={n.href} href={n.href} className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition ${active ? "bg-lime-dim text-lime" : "text-fg-3 hover:bg-bg-2 hover:text-fg"}`}>
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
