"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Platform", href: "/#features" },
    { label: "For Hotels", href: "/#hotels" },
    { label: "INVO for Suppliers", href: "/invo" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-border ${
        scrolled
          ? "bg-black/95 backdrop-blur-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <svg width="28" height="28" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
            <g fill="#ffffff" stroke="#ffffff" strokeWidth="12" strokeLinejoin="round">
              <rect x="80" y="100" width="40" height="200" rx="8"/>
              <rect x="80" y="140" width="160" height="40" rx="8"/>
              <path d="M260 100 L300 300 L340 100"/>
              <path d="M120 300 Q200 280 280 300" strokeWidth="8" fill="none"/>
            </g>
          </svg>
          <span className="text-[15px] font-medium tracking-tight text-white">
            HotelsVendors
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                item.href === "/invo"
                  ? "text-[#D4A843] hover:text-[#e0b856]"
                  : "text-white/50 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/login"
            className="text-[14px] font-medium text-white/50 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-accent text-[13px] py-2 px-5 font-medium"
          >
            Get Started
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg text-white/50 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-black/98 border-t border-white/5 backdrop-blur-md animate-fade-in-up">
          <div className="px-6 py-5 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-2.5 text-[14px] font-medium transition-colors ${
                  item.href === "/invo"
                    ? "text-[#D4A843]"
                    : "text-white/50 hover:text-white"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 text-[13px] font-medium border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 text-[13px] font-medium bg-[#8B0000] text-white rounded-lg hover:bg-[#a50000] transition-colors"
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
