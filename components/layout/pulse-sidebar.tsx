"use client";

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
  ChevronLeft,
  ChevronRight,
  Settings,
  HelpCircle,
} from "lucide-react";

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
        { icon: Building2, label: "Hotels", href: "/hotel/properties" },
        { icon: Users, label: "Suppliers", href: "/hotel/suppliers" },
        { icon: PackageSearch, label: "Catalog", href: "/hotel/catalog" },
        { icon: ClipboardList, label: "Orders", href: "/hotel/order" },
        { icon: FileText, label: "Invoices", href: "/hotel/invoices" },
        { icon: Calculator, label: "Accounting", href: "/hotel/accounting" },
        { icon: BarChart3, label: "AI Inventory", href: "/hotel/ai-inventory" },
      ],
    },
    {
      section: "COMPLIANCE",
      items: [{ icon: Zap, label: "ETA Demo", href: "/eta-demo" }],
    },
    {
      section: "INTELLIGENCE",
      items: [{ icon: BrainCircuit, label: "Intelligence", href: "/hotel/intelligence" }],
    },
    {
      section: "SUPPORT",
      items: [{ icon: HelpCircle, label: "Help & Guides", href: "/help" }],
    },
  ],
  admin: [
    {
      section: "OPERATIONS",
      items: [
        { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
        { icon: Users, label: "Suppliers", href: "/admin/suppliers" },
        { icon: Settings, label: "Security", href: "/admin/security" },
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
        { icon: PackageSearch, label: "Products", href: "/supplier/products" },
        { icon: ClipboardList, label: "Orders", href: "/supplier/orders" },
      ],
    },
    {
      section: "SUPPORT",
      items: [{ icon: HelpCircle, label: "Help & Guides", href: "/help" }],
    },
  ],
};

export function PulseSidebar({ role, collapsed, onToggle }: PulseSidebarProps) {
  const [activePath, setActivePath] = useState("");
  const navGroups = ROLE_NAV[role] || ROLE_NAV.hotel;

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 border-r border-[var(--border-subtle)] bg-[var(--surface)]">
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ChevronRight size={18} />
        </button>
        <div className="mt-6 flex flex-col gap-3">
          {navGroups.map((g) =>
            g.items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="p-2.5 rounded-xl hover:bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
                title={item.label}
              >
                <item.icon size={18} />
              </a>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[var(--surface)] border-r border-[var(--border-subtle)]">
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent-500)] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <path d="M8 4L16 12L8 20L4 16L8 12V4Z" fill="white"/>
              <path d="M16 12L24 4V12L20 16L24 20L16 28L12 24L16 20V12Z" fill="white" opacity="0.7"/>
            </svg>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-white tracking-wide">Hotels Vendors</p>
            <p className="text-[10px] text-[var(--foreground-muted)] tracking-widest uppercase">Smarter Together</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="p-1.5 rounded-lg hover:bg-[var(--surface-raised)] text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.section}>
            <p className="px-3 mb-2 text-[10px] font-semibold text-[var(--foreground-muted)] uppercase tracking-widest">
              {group.section}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setActivePath(item.href)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activePath === item.href
                      ? "bg-[var(--accent-500)]/15 text-[var(--accent-400)] border border-[var(--accent-500)]/20"
                      : "text-[var(--foreground-secondary)] hover:text-white hover:bg-[var(--surface-raised)]"
                  }`}
                >
                  <item.icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-4 py-3 border-t border-[var(--border-subtle)]">
        <a href="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-[var(--foreground-secondary)] hover:text-white hover:bg-[var(--surface-raised)] transition-colors w-full">
          <Settings size={16} />
          <span className="font-medium">Settings</span>
        </a>
      </div>
    </div>
  );
}
