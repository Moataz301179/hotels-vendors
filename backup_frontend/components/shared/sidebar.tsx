"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Truck,
  CreditCard,
  FileText,
  Settings,
  Building2,
  Users,
  BarChart3,
  Shield,
  Hotel,
  Store,
} from "lucide-react";

interface SidebarProps {
  role: "hotel" | "supplier" | "factoring" | "admin";
}

const navigation = {
  hotel: [
    { name: "Dashboard", href: "/dashboard/hotel", icon: LayoutDashboard },
    { name: "Catalog", href: "/dashboard/hotel/catalog", icon: Package },
    { name: "Orders", href: "/dashboard/hotel/orders", icon: ShoppingCart },
    { name: "Invoices", href: "/dashboard/hotel/invoices", icon: FileText },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  supplier: [
    { name: "Dashboard", href: "/dashboard/supplier", icon: LayoutDashboard },
    { name: "Products", href: "/dashboard/supplier/products", icon: Package },
    { name: "Orders", href: "/dashboard/supplier/orders", icon: ShoppingCart },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  factoring: [
    { name: "Dashboard", href: "/dashboard/factoring", icon: LayoutDashboard },
    { name: "Credit Lines", href: "/dashboard/factoring/credit-lines", icon: CreditCard },
    { name: "Portfolio", href: "/dashboard/factoring/portfolio", icon: BarChart3 },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    { name: "Suppliers", href: "/dashboard/admin/suppliers", icon: Store },
    { name: "Hotels", href: "/dashboard/admin/hotels", icon: Hotel },
    { name: "Users", href: "/dashboard/admin/users", icon: Users },
    { name: "Settings", href: "/dashboard/admin/settings", icon: Settings },
  ],
};

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = navigation[role] || [];

  return (
    <aside className="w-[280px] flex-col border-r border-slate-800 bg-slate-950 hidden md:flex">
      <div className="flex h-16 items-center border-b border-slate-800 px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-crimson-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">HV</span>
          </div>
          <span className="text-lg font-semibold text-white">Hotels Vendors</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/5 text-white border border-white/10"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-4">
        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-3 py-2.5 border border-white/10">
          <div className="h-8 w-8 rounded-full bg-crimson-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-white">Moataz</span>
            <span className="text-xs text-slate-400">Founder</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
