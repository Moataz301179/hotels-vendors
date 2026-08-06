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
      <div className="h-full flex flex-col items-center py-4 border-r border-border-subtle bg-surface-1">
        <Link href="/" className="mb-4 p-1.5 rounded-lg hover:bg-white/[0.05] transition-colors">
          <BrandLogo variant="dark" size="md" showText={false} iconOnly />
        </Link>
        <button
          onClick={onToggle}
          className="p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg hover:bg-white/[0.05] text-foreground-muted hover:text-white transition-colors"
          aria-label={isMobile ? "Close menu" : "Expand sidebar"}
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
                      ? "bg-accent-base/12 text-white"
                      : "text-foreground-muted hover:text-white hover:bg-white/[0.04]"
                  }`}
                  title={item.label}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 bg-accent-base rounded-r-full" />
                  )}
                  <item.icon size={18} />
                </Link>
              );
            })
          )}
        </div>

        <div className="mt-auto flex flex-col gap-1 w-full px-2">
          <button className="flex items-center justify-center w-10 h-10 rounded-lg text-foreground-muted hover:text-white hover:bg-white/[0.04] transition-all">
            <Settings size={18} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col border-r border-border-subtle bg-surface-1">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-14 sm:h-16 border-b border-border-invisible">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent-base flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-[17px] font-medium tracking-tight text-white">
            INVO
          </span>
          <span className="hidden sm:inline text-[11px] font-medium text-white/30 px-1.5 py-0.5 rounded border border-white/10 tracking-wider">
            by HotelsVendors
          </span>
        </Link>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-white/[0.05] text-foreground-muted hover:text-white transition-colors"
          aria-label={isMobile ? "Close menu" : "Collapse sidebar"}
        >
          {isMobile ? <X size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Sidebar navigation">
        {navGroups.map((group) => (
          <div key={group.section} className="mb-5">
            <p className="px-3 mb-1.5 text-[12px] font-semibold text-foreground-muted uppercase tracking-[0.15em]">
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
                        ? "bg-accent-base/10 text-white font-medium"
                        : "text-foreground-muted hover:text-white hover:bg-surface-1"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-4 bg-accent-base rounded-r-full shadow-accent" />
                    )}
                    <item.icon size={17} className={isActive ? "text-accent-base" : ""} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-border-invisible">
          <button
            className="flex items-center gap-3 px-3 py-2 min-h-[44px] rounded-lg text-sm text-foreground-muted hover:text-white hover:bg-surface-1 transition-all w-full"
            aria-label="Settings"
          >
          <Settings size={17} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}