"use client";

import { useState } from "react";
import { BrandLogo } from "./brand-logo";
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
  X,
  Truck,
  Landmark,
  Megaphone,
  ShieldCheck,
  Store,
  FileCheck,
  Scale,
  CreditCard,
  Calendar,
  ShoppingBag,
  HeartPulse,
  FileEdit,
  Search,
  Brain,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PulseSidebarProps {
  role: string;
  collapsed: boolean;
  onToggle: () => void;
  isMobile?: boolean;
}

const ROLE_NAV: Record<string, { section: string; items: { icon: React.ElementType; label: string; href: string }[] }[]> = {
  hotel: [
    {
      section: "OPERATIONS",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/hotel" },
        { icon: Building2, label: "Properties", href: "/hotel/properties" },
        { icon: PackageSearch, label: "Catalog", href: "/hotel/catalog" },
        { icon: ClipboardList, label: "Orders", href: "/hotel/order" },
        { icon: FileText, label: "Invoices", href: "/hotel/invoices" },
        { icon: Calculator, label: "Accounting", href: "/hotel/accounting" },
        { icon: ShoppingBag, label: "Checkout", href: "/hotel/checkout" },
      ],
    },
    {
      section: "FINANCE",
      items: [
        { icon: CreditCard, label: "Cashflow", href: "/hotel/cashflow" },
        { icon: Wallet, label: "Credit Facility", href: "/hotel/credit" },
        { icon: FileText, label: "Upload Invoice", href: "/hotel/financing" },
      ],
    },
    {
      section: "COMPLIANCE",
      items: [{ icon: Zap, label: "ETA Invoicing", href: "/eta" }],
    },
    {
      section: "SUPPORT",
      items: [{ icon: HelpCircle, label: "Help & Guides", href: "/help" }],
    },
  ],
  admin: [
    {
      section: "COMMAND CENTER",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: Users, label: "Users", href: "/admin/users" },
        { icon: BarChart3, label: "Reports", href: "/admin/reports" },
      ],
    },
    {
      section: "AI & AUTOMATION",
      items: [
        { icon: BrainCircuit, label: "Swarm", href: "/admin/swarm" },
        { icon: Bot, label: "OpenClaw", href: "/admin/openclaw" },
      ],
    },
    {
      section: "MARKETPLACE",
      items: [
        { icon: PackageSearch, label: "Products", href: "/admin/marketplace/products" },
        { icon: ShoppingBag, label: "Orders", href: "/admin/marketplace/orders" },
        { icon: Building2, label: "Hotels", href: "/admin/marketplace/hotels" },
        { icon: Users, label: "Suppliers Pipeline", href: "/admin/suppliers/pipeline" },
        { icon: ShieldCheck, label: "Supplier Review", href: "/admin/suppliers/review" },
      ],
    },
    {
      section: "OPERATIONS",
      items: [
        { icon: ClipboardList, label: "Orders", href: "/orders" },
        { icon: Truck, label: "Shipping", href: "/shipping" },
        { icon: FileCheck, label: "ETA Center", href: "/eta" },
      ],
    },
    {
      section: "FINANCE",
      items: [
        { icon: Landmark, label: "Factoring", href: "/factoring" },
        { icon: CreditCard, label: "Payments", href: "/payments" },
        { icon: Settings, label: "Integration Config", href: "/admin/integration-config" },
      ],
    },
    {
      section: "PLATFORM",
      items: [
        { icon: HeartPulse, label: "Health", href: "/admin/health" },
        { icon: FileEdit, label: "Content Editor", href: "/admin/cms" },
        { icon: Settings, label: "Settings", href: "/settings" },
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
        { icon: FileEdit, label: "New Product", href: "/supplier/products/new" },
        { icon: ClipboardList, label: "Orders", href: "/supplier/orders" },
        { icon: BarChart3, label: "Analytics", href: "/supplier/analytics" },
      ],
    },
    {
      section: "FINANCE",
      items: [
        { icon: CreditCard, label: "Cashflow", href: "/supplier/cashflow" },
        { icon: Wallet, label: "Credit Facility", href: "/supplier/credit" },
        { icon: FileText, label: "Upload Invoice", href: "/supplier/financing" },
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
        { icon: FileText, label: "Credit Lines", href: "/factoring/credit-lines" },
        { icon: FileCheck, label: "Review", href: "/factoring/credit-lines/review" },
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
        { icon: Truck, label: "Fleet", href: "/shipping" },
        { icon: CreditCard, label: "Earnings", href: "/shipping" },
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
      section: "CONTENT",
      items: [
        { icon: Megaphone, label: "Social Media", href: "/marketing/social" },
        { icon: Calendar, label: "Calendar", href: "/marketing/calendar" },
      ],
    },
    {
      section: "SUPPORT",
      items: [{ icon: HelpCircle, label: "Help & Guides", href: "/help" }],
    },
  ],
};

export function PulseSidebar({ role, collapsed, onToggle, isMobile }: PulseSidebarProps) {
  const pathname = usePathname();
  const navGroups = ROLE_NAV[role] || ROLE_NAV.hotel;

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center border-r border-slate-200 bg-slate-50 py-4">
        <Link href="/" className="mb-4 rounded-lg p-1.5 transition-colors hover:bg-slate-200">
          <BrandLogo variant="light" size="md" showText={false} />
        </Link>
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">HV</span>
        <button
          onClick={onToggle}
          className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
          aria-label={isMobile ? "Close menu" : "Expand sidebar"}
        >
          <ChevronRight size={18} />
        </button>

        <div className="mt-6 flex w-full flex-col gap-1 px-2">
          {navGroups.map((g) =>
            g.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                    isActive
                      ? "bg-[var(--accent-base)]/12 text-slate-900"
                      : "text-slate-500 hover:bg-slate-200 hover:text-slate-800"
                  }`}
                  title={item.label}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r-full bg-[var(--accent-base)]" />
                  )}
                  <item.icon size={18} />
                </Link>
              );
            })
          )}
        </div>

        <div className="mt-auto flex w-full flex-col gap-1 px-2">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-all hover:bg-slate-200 hover:text-slate-800">
            <Settings size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col border-r border-slate-200 bg-slate-50">
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 sm:h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <BrandLogo variant="light" size="md" showText={false} />
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-800" style={{ fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
            Hotels Vendors
          </span>
        </Link>
        <button
          onClick={onToggle}
          className="rounded-md p-1.5 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-700"
          aria-label={isMobile ? "Close menu" : "Collapse sidebar"}
        >
          {isMobile ? <X size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      <div className="px-3 pt-3">
        <span className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-base)]" />
          Role Mesh / {role}
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Sidebar navigation">
        {navGroups.map((group) => (
          <div key={group.section} className="mb-5">
            <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              {group.section}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all ${
                      isActive
                        ? "border border-[var(--accent-base)]/30 bg-[linear-gradient(90deg,rgba(179,138,86,0.14),rgba(255,255,255,0.92))] font-medium text-slate-900"
                        : "text-slate-600 hover:bg-slate-200 hover:text-slate-800"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-r-full bg-[var(--accent-base)] shadow-[0_0_8px_rgba(179,138,86,0.35)]" />
                    )}
                    <item.icon size={17} className={isActive ? "text-[var(--accent-base)]" : "text-slate-500"} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-3">
        <button
          className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-800"
          aria-label="Settings"
        >
          <Settings size={17} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}