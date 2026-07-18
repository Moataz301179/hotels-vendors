"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { BrandLogo } from "./brand-logo";

interface NavGroup {
  label: string;
  href?: string;
  items?: { href: string; label: string }[];
}

const navGroups: NavGroup[] = [
  {
    label: "Platform",
    items: [
      { href: "/solutions", label: "Overview" },
      { href: "/marketplace", label: "Marketplace" },
      { href: "/invo", label: "INVO — Financial Layer" },
    ],
  },
  {
    label: "Solutions",
    items: [
      { href: "/hotels/join", label: "For Hotels" },
      { href: "/become-supplier", label: "For Suppliers" },
    ],
  },
  { label: "Pricing", href: "/pricing" },
];

function DropdownMenu({ group, onClose }: { group: NavGroup; onClose: () => void }) {
  if (!group.items) return null;
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 rounded-xl border border-white/[0.07] bg-[#0B0F1A]/98 backdrop-blur-xl shadow-2xl overflow-hidden z-50">
      {group.items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClose}
          className="block px-4 py-2.5 text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

export function GlobalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  const handleGroupEnter = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveGroup(label);
  };

  const handleGroupLeave = () => {
    closeTimer.current = setTimeout(() => setActiveGroup(null), 120);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B0F1A]/95 backdrop-blur-sm border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <BrandLogo variant="dark" size="sm" showText={false} />
          <span className="font-semibold text-[15px] text-white uppercase" style={{ letterSpacing: "0.2em", fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
            Hotels Vendors
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navGroups.map((group) =>
            group.href ? (
              <Link
                key={group.label}
                href={group.href}
                className="px-4 py-2 text-[14px] font-medium text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                {group.label}
              </Link>
            ) : (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => handleGroupEnter(group.label)}
                onMouseLeave={handleGroupLeave}
              >
                <button
                  className="flex items-center gap-1 px-4 py-2 text-[14px] font-medium text-gray-400 hover:text-white rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
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
            )
          )}
        </nav>

        {/* Right */}
        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="text-[14px] font-medium text-gray-300 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-accent text-[13px] py-2 px-5"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0B0F1A]/98 border-t border-white/5 backdrop-blur-md">
          <nav className="px-6 py-5 space-y-1">
            {navGroups.map((group) =>
              group.href ? (
                <Link
                  key={group.label}
                  href={group.href}
                  onClick={() => setMobileOpen(false)}
                  className="block py-2.5 text-[14px] font-medium text-gray-400 hover:text-white transition-colors"
                >
                  {group.label}
                </Link>
              ) : (
                <div key={group.label}>
                  <button
                    className="w-full flex items-center justify-between py-2.5 text-[14px] font-medium text-gray-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
                    onClick={() => setActiveGroup(activeGroup === group.label ? null : group.label)}
                  >
                    {group.label}
                    <ChevronDown
                      size={13}
                      className={`transition-transform duration-150 ${activeGroup === group.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {activeGroup === group.label && group.items && (
                    <div className="pl-4 flex flex-col gap-1 mb-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => { setMobileOpen(false); setActiveGroup(null); }}
                          className="py-1.5 text-[13px] text-gray-500 hover:text-white transition-colors"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
            <div className="pt-4 flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 text-[13px] font-medium border border-white/10 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 text-[13px] font-semibold bg-[var(--accent-base)] text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
