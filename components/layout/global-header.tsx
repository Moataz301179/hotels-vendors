"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Search, Menu, X } from "lucide-react";

function HorseLogo({ className = "w-7 h-7", stroke = "#800000" }: { className?: string; stroke?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" className={className} fill="none">
      <path d="M85 15 C95 15, 105 22, 110 32 L108 42 C112 48, 115 55, 112 62 L105 75 C100 82, 92 85, 84 83 L72 88 C65 92, 58 98, 55 105 L48 120 C45 128, 38 135, 30 138 L20 135 C15 132, 12 125, 15 118 L22 98 C25 90, 32 85, 40 82 L52 78 C58 76, 62 72, 60 66 L55 52 C52 42, 58 32, 68 28 L78 22 C80 18, 82 15, 85 15Z" stroke={stroke} strokeWidth="3" strokeLinejoin="round" opacity="0.95" />
      <path d="M58 32 C62 28, 68 26, 74 28 L80 42 C82 48, 80 55, 75 60 L65 70 C60 75, 55 78, 50 76 L42 72 C38 70, 36 65, 38 60 L45 45 C48 38, 52 34, 58 32Z" stroke={stroke} strokeWidth="2" strokeLinejoin="round" opacity="0.45" />
      <circle cx="88" cy="38" r="3.5" fill={stroke} opacity="0.8" />
      <path d="M25 125 C30 122, 35 120, 40 122" stroke={stroke} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

export function GlobalHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Catalog", href: "/catalog" },
    { label: "Suppliers", href: "/catalog?tab=suppliers" },
    { label: "Solutions", href: "/#solutions" },
    { label: "Pricing", href: "/#pricing" },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.05)]" : "bg-white"}`}>
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <HorseLogo className="w-7 h-8" stroke="#800000" />
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
