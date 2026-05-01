"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Hotel,
  Factory,
  Package,
  ClipboardList,
  FileText,
  Zap,
  Brain,
  Settings,
  Calculator,
  TrendingUp,
  ShoppingCart,
  Anchor,
  Landmark,
  Store,
} from "lucide-react";
import { useRole, type PlatformRole } from "./role-context";

const NAV: Record<PlatformRole, { label: string; items: { href: string; label: string; icon: React.ElementType }[] }[]> = {
  HOTEL: [
    {
      label: "Operations",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/hotels", label: "Hotels", icon: Hotel },
        { href: "/supplier", label: "Suppliers", icon: Factory },
        { href: "/catalog", label: "Catalog", icon: Package },
        { href: "/cart", label: "Cart", icon: ShoppingCart },
        { href: "/orders", label: "Orders", icon: ClipboardList },
        { href: "/invoices", label: "Invoices", icon: FileText },
        { href: "/accounting", label: "Accounting", icon: Calculator },
        { href: "/ai-inventory", label: "AI Inventory", icon: TrendingUp },
      ],
    },
    {
      label: "Finance & Coastal",
      items: [
        { href: "/factoring", label: "Factoring", icon: Landmark },
        { href: "/dashboard/coastal", label: "Coastal Hub", icon: Anchor },
        { href: "/outlets", label: "Outlets", icon: Store },
      ],
    },
    {
      label: "Compliance",
      items: [{ href: "/eta-demo", label: "ETA Demo", icon: Zap }],
    },
    {
      label: "Intelligence",
      items: [{ href: "/intelligence", label: "Intelligence", icon: Brain }],
    },
  ],
  SUPPLIER: [
    {
      label: "Operations",
      items: [
        { href: "/supplier", label: "Supplier Central", icon: Factory },
        { href: "/supplier/onboarding", label: "Onboarding", icon: Store },
        { href: "/catalog", label: "Catalog", icon: Package },
        { href: "/orders", label: "Orders", icon: ClipboardList },
      ],
    },
    {
      label: "Compliance",
      items: [{ href: "/eta-demo", label: "ETA Demo", icon: Zap }],
    },
  ],
  FACTORING: [
    {
      label: "Finance",
      items: [
        { href: "/factoring", label: "Facilities", icon: Landmark },
        { href: "/invoices", label: "Invoices", icon: FileText },
        { href: "/accounting", label: "Accounting", icon: Calculator },
      ],
    },
    {
      label: "Compliance",
      items: [{ href: "/eta-demo", label: "ETA Demo", icon: Zap }],
    },
    {
      label: "Intelligence",
      items: [{ href: "/intelligence", label: "Intelligence", icon: Brain }],
    },
  ],
  SHIPPING: [
    {
      label: "Operations",
      items: [
        { href: "/dashboard/coastal", label: "Coastal Hub", icon: Anchor },
        { href: "/orders", label: "Orders", icon: ClipboardList },
        { href: "/logistics", label: "Logistics", icon: Store },
      ],
    },
    {
      label: "Compliance",
      items: [{ href: "/eta-demo", label: "ETA Demo", icon: Zap }],
    },
    {
      label: "Intelligence",
      items: [{ href: "/intelligence", label: "Intelligence", icon: Brain }],
    },
  ],
  ADMIN: [
    {
      label: "Operations",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/hotels", label: "Hotels", icon: Hotel },
        { href: "/supplier", label: "Suppliers", icon: Factory },
        { href: "/catalog", label: "Catalog", icon: Package },
        { href: "/cart", label: "Cart", icon: ShoppingCart },
        { href: "/orders", label: "Orders", icon: ClipboardList },
        { href: "/invoices", label: "Invoices", icon: FileText },
        { href: "/accounting", label: "Accounting", icon: Calculator },
        { href: "/ai-inventory", label: "AI Inventory", icon: TrendingUp },
      ],
    },
    {
      label: "Finance & Coastal",
      items: [
        { href: "/factoring", label: "Factoring", icon: Landmark },
        { href: "/dashboard/coastal", label: "Coastal Hub", icon: Anchor },
        { href: "/outlets", label: "Outlets", icon: Store },
        { href: "/logistics", label: "Logistics", icon: ClipboardList },
      ],
    },
    {
      label: "Compliance",
      items: [{ href: "/eta-demo", label: "ETA Demo", icon: Zap }],
    },
    {
      label: "Intelligence",
      items: [{ href: "/intelligence", label: "Intelligence", icon: Brain }],
    },
  ],
};

export function AppSidebar() {
  const pathname = usePathname();
  const { role } = useRole();
  const sections = NAV[role] || NAV.ADMIN;

  return (
    <aside className="fixed left-0 top-0 bottom-0 z-40 w-56 flex flex-col border-r border-border-subtle bg-[#0a0e1a]">
      {/* Logo */}
      <div className="px-3 pt-5 pb-4 border-b border-border-subtle shrink-0">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl overflow-hidden shrink-0 bg-brand-700/20 flex items-center justify-center">
            <Image src="/logo-transparent.png" alt="Hotels Vendors" width={40} height={40} className="object-contain" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-tight text-foreground">HOTELS VENDORS</span>
            <span className="text-[10px] text-foreground-muted mt-1">Smarter Together</span>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-2.5 mb-1 text-[9px] font-semibold uppercase tracking-wider text-foreground-faint">
              {section.label}
            </div>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 rounded-md px-2.5 py-[5px] text-xs font-medium transition-colors ${
                      active
                        ? "bg-brand-500/10 text-brand-400"
                        : "text-foreground-muted hover:bg-surface hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-border-subtle p-2 shrink-0">
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-md px-2.5 py-[5px] text-xs font-medium text-foreground-muted hover:bg-surface hover:text-foreground transition-colors"
        >
          <Settings className="w-3.5 h-3.5 shrink-0" />
          <span>Settings</span>
        </Link>
      </div>
    </aside>
  );
}
