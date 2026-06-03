"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Platform", href: "/solutions" },
    { label: "For Hotels", href: "/hotels" },
    { label: "For Suppliers", href: "/become-supplier" },
    { label: "Pricing", href: "/pricing" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0B0F1A]/95 backdrop-blur-sm border-b border-white/5"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <BrandLogo variant="dark" size="sm" />
          <span className="text-[15px] font-bold tracking-tight text-white">
            HotelsVendors
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-[14px] font-medium text-gray-400 hover:text-white rounded-lg transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <ThemeToggle />
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
          className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[#0B0F1A]/98 border-t border-white/5 backdrop-blur-md animate-fade-in-up">
          <div className="px-6 py-5 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-2.5 text-[14px] font-medium text-gray-400 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-white/5 flex items-center gap-4">
              <ThemeToggle />
              <span className="text-[12px] text-gray-500">Toggle accent</span>
            </div>
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
          </div>
        </div>
      )}
    </header>
  );
}
