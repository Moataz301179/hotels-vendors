"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "./brand-logo";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Platform", href: "/#platform" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo variant="dark" size="sm" />
            <span className="text-[14px] font-semibold text-white tracking-tight">
              Hotels Vendors
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[13px] text-white/50 hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13px] text-white/50 hover:text-white px-3 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-[12px] font-medium bg-[#DC143C] text-white hover:bg-[#b91031] rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden p-2 text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#0a0a0a]/95 backdrop-blur-xl border-t border-white/[0.06] px-6 py-5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block py-2.5 text-[14px] text-white/50"
            >
              {item.label}
            </a>
          ))}
          <div className="pt-3 flex gap-2">
            <Link
              href="/login"
              className="flex-1 text-center py-2.5 text-[13px] border border-white/[0.10] text-white/50 rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center py-2.5 text-[13px] bg-[#1a1a1a] text-white rounded-lg font-medium"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
