"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";
import { BrandLogo } from "./brand-logo";

export function GlobalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Suppliers", href: "/marketplace?tab=suppliers" },
    { label: "Solutions", href: "/#solutions" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandLogo variant="light" size="md" />
            <span className="text-[15px] font-bold tracking-tight text-black leading-tight">Hotels Vendors</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-3 py-2 rounded-md text-[13px] font-medium text-black/50 hover:text-black hover:bg-black/[0.03] transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-black/10 text-[13px] font-medium text-black/70 hover:bg-black/[0.03] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 rounded-lg bg-black hover:bg-black/80 text-white text-[13px] font-semibold transition-colors"
            >
              Get Started
            </Link>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg text-black/50 hover:text-black hover:bg-black/[0.03]"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-black/5 bg-white">
          <nav className="px-5 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-2.5 rounded-lg text-[14px] font-medium text-black/60 hover:text-black hover:bg-black/[0.03]"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2 flex gap-2">
              <Link href="/login" className="flex-1 text-center px-4 py-2.5 rounded-lg border border-black/10 text-[13px] font-medium text-black/70">Sign In</Link>
              <Link href="/register" className="flex-1 text-center px-4 py-2.5 rounded-lg bg-black text-white text-[13px] font-semibold">Get Started</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
