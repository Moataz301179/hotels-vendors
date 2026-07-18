"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";

interface NavGroup {
  label: string;
  items: { href: string; label: string; description?: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { href: "/#how", label: "How It Works", description: "See the procurement workflow end-to-end" },
      { href: "/marketplace", label: "Marketplace", description: "Browse verified supplier catalog" },
      { href: "/invo", label: "INVO", description: "Financial layer for suppliers — by HotelsVendors" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { href: "/hotels/join", label: "For Hotels", description: "Automate buying, approvals & compliance" },
      { href: "/suppliers/join", label: "For Suppliers", description: "List, sell & get paid faster" },
    ],
  },
  {
    label: "Finance",
    items: [
      { href: "/factoring-service", label: "Reverse Factoring", description: "Early payment for suppliers" },
      { href: "/financing/oliv", label: "Oliv Financing", description: "Credit lines & embedded BNPL" },
    ],
  },
  {
    label: "Compliance",
    items: [
      { href: "/compliance", label: "ETA & FRA Compliance", description: "Egyptian Tax Authority e-invoicing" },
      { href: "/pricing", label: "Pricing", description: "Transparent fee structure" },
    ],
  },
];

function DropdownMenu({ group, onClose }: { group: NavGroup; onClose: () => void }) {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 rounded-xl border border-white/[0.07] bg-[#12121a]/98 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
      {group.items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-3 hover:bg-white/5 transition-colors group"
        >
          <div className="text-[13px] font-medium text-white/80 group-hover:text-white">{item.label}</div>
          {item.description && (
            <div className="text-[11px] text-white/35 mt-0.5 leading-relaxed">{item.description}</div>
          )}
        </Link>
      ))}
    </div>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleGroupEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveGroup(label);
  };

  const handleGroupLeave = () => {
    closeTimer.current = setTimeout(() => setActiveGroup(null), 120);
  };

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-4 border-b border-white/5 bg-[#0c0c12]/85 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2.5">
        <BrandLogo variant="dark" size="sm" showText={false} />
        <span className="font-semibold text-white text-[15px] uppercase" style={{ letterSpacing: "0.2em", fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
          Hotels Vendors
        </span>
      </Link>

      {/* Desktop nav — grouped dropdowns */}
      <div className="hidden md:flex items-center gap-1">
        {navGroups.map((group) => (
          <div
            key={group.label}
            className="relative"
            onMouseEnter={() => handleGroupEnter(group.label)}
            onMouseLeave={handleGroupLeave}
          >
            <button
              className="flex items-center gap-1 px-3 py-2 text-sm text-white/50 hover:text-white transition-colors rounded-lg cursor-pointer bg-transparent border-0"
              onClick={() => setActiveGroup(activeGroup === group.label ? null : group.label)}
              aria-expanded={activeGroup === group.label}
            >
              {group.label}
              <ChevronDown
                size={13}
                className={`transition-transform duration-150 ${activeGroup === group.label ? "rotate-180" : ""}`}
              />
            </button>
            {activeGroup === group.label && (
              <DropdownMenu group={group} onClose={() => setActiveGroup(null)} />
            )}
          </div>
        ))}
      </div>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm px-4 py-2 text-white/50 hover:text-white transition-colors cursor-pointer bg-transparent font-sans"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="text-sm px-4 py-2 font-semibold cursor-pointer rounded-md bg-[#39ff7e] text-[#07090f]"
        >
          Try the Demo
        </Link>
      </div>

      {/* Mobile toggle */}
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden text-white/50 cursor-pointer bg-transparent border-0 p-2"
        aria-label="Toggle menu"
      >
        {open ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile menu — grouped */}
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#12121a] border-b border-white/[0.06] px-6 py-4 flex flex-col gap-2 md:hidden max-h-[80vh] overflow-y-auto">
          {navGroups.map((group) => (
            <div key={group.label}>
              <button
                className="w-full flex items-center justify-between py-2 text-xs font-semibold uppercase tracking-widest text-white/30 bg-transparent border-0 cursor-pointer"
                onClick={() => setActiveGroup(activeGroup === group.label ? null : group.label)}
              >
                {group.label}
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-150 ${activeGroup === group.label ? "rotate-180" : ""}`}
                />
              </button>
              {activeGroup === group.label && (
                <div className="pl-3 flex flex-col gap-1 mb-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => { setOpen(false); setActiveGroup(null); }}
                      className="py-2 text-sm text-white/50 hover:text-white"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="pt-3 border-t border-white/[0.06] flex gap-3 mt-2">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex-1 text-center text-sm text-white/50 hover:text-white py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              onClick={() => setOpen(false)}
              className="flex-1 text-center text-sm px-4 py-2 font-semibold rounded-md bg-[#39ff7e] text-[#07090f]"
            >
              Try the Demo
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
