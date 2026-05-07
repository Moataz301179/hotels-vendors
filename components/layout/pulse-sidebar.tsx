"use client";

import Image from "next/image";
import { useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  PackageSearch,
  ClipboardList,
  FileText,
  Calculator,
  BarChart3,
  Zap,
  BrainCircuit,
  Bot,
  Shield,
  Target,
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
  Truck,
  Landmark,
  Megaphone,
  ShieldCheck,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PulseSidebarProps {
  role: string;
  collapsed: boolean;
  onToggle: () => void;
}

const ROLE_NAV: Record<string, { section: string; items: { icon: React.ElementType; label: string; href: string }[] }[]> = {
  hotel: [
    {
      section: "OPERATIONS",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/hotel" },
        { icon: Building2, label: "Properties", href: "/hotel/properties" },
        { icon: Users, label: "Suppliers", href: "/hotel/suppliers" },
        { icon: PackageSearch, label: "Catalog", href: "/hotel/catalog" },
        { icon: ClipboardList, label: "Orders", href: "/hotel/order" },
        { icon: FileText, label: "Invoices", href: "/hotel/invoices" },
        { icon: Calculator, label: "Accounting", href: "/hotel/accounting" },
      ],
    },
    {
      section: "INTELLIGENCE",
      items: [
        { icon: BarChart3, label: "AI Inventory", href: "/hotel/ai-inventory" },
        { icon: BrainCircuit, label: "Intelligence", href: "/hotel/intelligence" },
      ],
    },
    {
      section: "COMPLIANCE",
      items: [{ icon: Zap, label: "ETA Demo", href: "/eta-demo" }],
    },
    {
      section: "SUPPORT",
      items: [{ icon: HelpCircle, label: "Help & Guides", href: "/help" }],
    },
  ],
  admin: [
    {
      section: "PLATFORM",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: Users, label: "Suppliers", href: "/admin/suppliers/pipeline" },
        { icon: BrainCircuit, label: "Swarm", href: "/admin/swarm" },
        { icon: Bot, label: "OpenClaw", href: "/admin/openclaw" },
      ],
    },
    {
      section: "SUPPORT",
      items: [{ icon: HelpCircle, label: "Help & Guides", href: "/help" }],
    },
  ],
  supplier: [
    {
      section: "OPERATIONS",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/supplier" },
        { icon: Store, label: "Products", href: "/supplier/products" },
        { icon: ClipboardList, label: "Orders", href: "/supplier/orders" },
        { icon: BarChart3, label: "Analytics", href: "/supplier/analytics" },
      ],
    },
    {
      section: "SUPPORT",
      items: [{ icon: HelpCircle, label: "Help & Guides", href: "/help" }],
    },
  ],
  factoring: [
    {
      section: "PORTFOLIO",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/factoring" },
        { icon: FileText, label: "Invoices", href: "/factoring/invoices" },
        { icon: Landmark, label: "Risk Engine", href: "/factoring/risk" },
      ],
    },
    {
      section: "SUPPORT",
      items: [{ icon: HelpCircle, label: "Help & Guides", href: "/help" }],
    },
  ],
  shipping: [
    {
      section: "LOGISTICS",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/shipping" },
        { icon: Truck, label: "Routes", href: "/shipping/routes" },
        { icon: ClipboardList, label: "Deliveries", href: "/shipping/deliveries" },
      ],
    },
    {
      section: "SUPPORT",
      items: [{ icon: HelpCircle, label: "Help & Guides", href: "/help" }],
    },
  ],
  marketing: [
    {
      section: "GROWTH",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/marketing" },
        { icon: Megaphone, label: "Campaigns", href: "/marketing/campaigns" },
        { icon: Users, label: "Leads", href: "/marketing/leads" },
        { icon: BarChart3, label: "Analytics", href: "/marketing/analytics" },
      ],
    },
    {
      section: "SUPPORT",
      items: [{ icon: HelpCircle, label: "Help & Guides", href: "/help" }],
    },
  ],
};

export function PulseSidebar({ role, collapsed, onToggle }: PulseSidebarProps) {
  const pathname = usePathname();
  const navGroups = ROLE_NAV[role] || ROLE_NAV.hotel;

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 border-r border-[rgba(255,255,255,0.06)] bg-[#121212]">
        <Link href="/" className="mb-4 p-1.5 rounded-lg hover:bg-[#FF5C00]/20 transition-colors">
          <Image src="/logo-horse-only.png" alt="Hotels Vendors" width={28} height={32} className="opacity-90 object-contain" priority />
        </Link>
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.35)] hover:text-white transition-colors"
        >
          <ChevronRight size={18} />
        </button>

        <div className="mt-6 flex flex-col gap-1 w-full px-2">
          {navGroups.map((g) =>
            g.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all ${
                    isActive
                      ? "bg-[rgba(128,0,0,0.15)] text-white"
                      : "text-[rgba(255,255,255,0.35)] hover:text-white hover:bg-[rgba(255,255,255,0.04)]"
                  }`}
                  title={item.label}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-[#FF5C00] rounded-r-full" />
                  )}
                  <item.icon size={18} />
                </Link>
              );
            })
          )}
        </div>

        <div className="mt-auto flex flex-col gap-1 w-full px-2">
          <button className="flex items-center justify-center w-10 h-10 rounded-lg text-[rgba(255,255,255,0.35)] hover:text-white hover:bg-[rgba(255,255,255,0.04)] transition-all">
            <Settings size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-r border-[rgba(255,255,255,0.06)] bg-[#121212]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[rgba(255,255,255,0.04)]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-[#FF5C00]/15 border border-[#FF5C00]/25 flex items-center justify-center group-hover:bg-[#FF5C00]/25 transition-colors">
            <Image src="/logo-horse-only.png" alt="Hotels Vendors" width={20} height={20} className="opacity-90" priority />
          </div>
          <span className="text-sm font-semibold text-white tracking-tight">HotelsVendors</span>
        </Link>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.30)] hover:text-white transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {navGroups.map((group) => (
          <div key={group.section} className="mb-5">
            <p className="px-3 mb-1.5 text-[10px] font-semibold text-[rgba(255,255,255,0.25)] uppercase tracking-wider">
              {group.section}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                      isActive
                        ? "bg-[rgba(128,0,0,0.12)] text-white font-medium"
                        : "text-[rgba(255,255,255,0.50)] hover:text-white hover:bg-[rgba(255,255,255,0.03)]"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-[#FF5C00] rounded-r-full shadow-[0_0_8px_rgba(128,0,0,0.50)]" />
                    )}
                    <item.icon size={17} className={isActive ? "text-[#FF5C00]" : ""} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[rgba(255,255,255,0.04)]">
        <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[rgba(255,255,255,0.40)] hover:text-white hover:bg-[rgba(255,255,255,0.03)] transition-all w-full">
          <Settings size={17} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}
