"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  CreditCard,
  BarChart3,
  Settings,
  Truck,
  FileText,
  Building2,
  Users,
  Shield,
  Brain,
  HeartPulse,
} from "lucide-react";

interface SidebarProps {
  role: "hotel" | "supplier" | "factoring" | "admin";
}

const NAV_ITEMS: Record<string, { label: string; href: string; icon: React.ElementType }[]> = {
  admin: [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { label: "Orders", href: "/admin/marketplace/orders", icon: ShoppingCart },
    { label: "Products", href: "/admin/marketplace/products", icon: Package },
    { label: "Hotels", href: "/admin/marketplace/hotels", icon: Building2 },
    { label: "Health", href: "/admin/health", icon: HeartPulse },
    { label: "Swarm", href: "/admin/swarm", icon: Brain },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ],
  hotel: [
    { label: "Dashboard", href: "/hotel", icon: LayoutDashboard },
    { label: "Catalog", href: "/hotel/catalog", icon: Package },
    { label: "Orders", href: "/hotel/order", icon: ShoppingCart },
    { label: "Invoices", href: "/hotel/invoices", icon: FileText },
    { label: "Credit", href: "/hotel/credit", icon: CreditCard },
    { label: "Properties", href: "/hotel/properties", icon: Building2 },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  supplier: [
    { label: "Dashboard", href: "/supplier", icon: LayoutDashboard },
    { label: "Products", href: "/supplier/products", icon: Package },
    { label: "Orders", href: "/supplier/orders", icon: ShoppingCart },
    { label: "Analytics", href: "/supplier/analytics", icon: BarChart3 },
    { label: "Credit", href: "/supplier/credit", icon: CreditCard },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
  factoring: [
    { label: "Dashboard", href: "/factoring", icon: LayoutDashboard },
    { label: "Credit Lines", href: "/factoring/credit-lines", icon: CreditCard },
    { label: "Settings", href: "/settings", icon: Settings },
  ],
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = NAV_ITEMS[role] || NAV_ITEMS.hotel;

  return (
    <aside className="hidden md:flex w-60 flex-col border-r border-slate-800 bg-slate-950">
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <Shield className="h-5 w-5 text-emerald-400" />
        <span className="ml-2 text-sm font-semibold text-white capitalize">{role}</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && item.href !== "/hotel" && item.href !== "/supplier" && item.href !== "/factoring" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-emerald-400 bg-emerald-400/10 border-r-2 border-emerald-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
