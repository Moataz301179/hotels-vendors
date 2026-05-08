"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
import Image from "next/image";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Platform", href: "/#platform" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Suppliers", href: "/suppliers" },
    { label: "Hotels", href: "/hotels" },
    { label: "For Hotels", href: "/register?role=hotel" },
    { label: "For Suppliers", href: "/register?role=supplier" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "shadow-[0_2px_20px_rgba(0,0,0,0.15)]" : ""
      }`}
    >
      {/* ─── TOP ROW — BLACK ─── */}
      <div className="bg-[#050505] border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-6 h-[52px] flex items-center justify-between relative">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative z-10">
            <Image
              src="/logo-icon-white.png"
              alt="Hotels Vendors"
              width={36}
              height={50}
              className="object-contain"
              priority
            />
            <div className="flex flex-col">
              <span className="text-[15px] font-bold text-white tracking-tight leading-none">
                Hotels Vendors
              </span>
              <span className="text-[9px] font-medium text-white/40 uppercase tracking-[0.1em] leading-none mt-0.5">
                Smarter Together
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-[13px] font-medium text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-white/40 hover:text-white hover:bg-white/[0.04] rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
            <div className="w-px h-5 bg-white/[0.10] mx-1" />
            <Link
              href="/login"
              className="text-[13px] font-medium text-white/50 hover:text-white px-4 py-2 transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-[13px] font-semibold bg-white text-[#022349] hover:bg-white/90 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-white/60 hover:text-white rounded-lg hover:bg-white/[0.04] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ─── BOTTOM ROW — WHITE ─── */}
      <div className="bg-white border-b border-black/[0.06]">
        <div className="mx-auto max-w-7xl px-6 h-[36px] flex items-center justify-center relative">
          <div className="flex items-center gap-3">
            <span className="text-[14px] font-bold text-black tracking-tight">
              Hotels Vendors
            </span>
            <span className="w-1 h-1 rounded-full bg-[#022349]" />
            <span className="text-[11px] font-medium text-black/40 uppercase tracking-[0.1em]">
              Smarter Together
            </span>
          </div>
        </div>
      </div>

      {/* Search dropdown */}
      {searchOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-black/[0.06] shadow-lg">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
              <input
                type="text"
                placeholder="Search products, suppliers, categories..."
                autoFocus
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-black/[0.08] bg-black/[0.02] text-sm text-black placeholder:text-black/30 outline-none focus:border-[#022349]/40 transition-all"
              />
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#050505] border-t border-white/[0.06] px-6 py-5 shadow-xl">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block py-2.5 text-[14px] font-medium text-white/60 hover:text-white transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="pt-4 mt-2 border-t border-white/[0.06] flex gap-3">
            <Link
              href="/login"
              className="flex-1 text-center py-2.5 text-[13px] font-medium border border-white/[0.10] text-white/60 hover:text-white rounded-lg transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="flex-1 text-center py-2.5 text-[13px] font-semibold bg-white text-[#022349] rounded-lg hover:bg-white/90 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
