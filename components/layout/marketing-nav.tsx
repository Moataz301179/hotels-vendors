"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, Moon } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useTheme } from "@/components/theme/theme-provider";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { mode, toggleMode } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Marketplace", href: "/marketplace" },
    { label: "Hotel Solutions", href: "/solutions" },
    { label: "Hotel Dashboard", href: "/sandbox" },
    { label: "Supplier Portal", href: "/become-supplier" },
    { label: "ETA Compliance", href: "/compliance" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-border ${
        scrolled
          ? "bg-gradient-to-b from-black/95 via-black/80 to-transparent backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-auto min-h-[80px] py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <BrandLogo variant="dark" size="md" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-[14px] font-medium rounded-lg text-zinc-400 hover:text-white hover:text-amber-400 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleMode}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.5)" }}
            title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {mode === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <Link
            href="/login"
            className="text-[14px] font-medium text-zinc-400 hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-[13px] py-2 px-5 font-medium rounded-lg transition-all"
            style={{ backgroundColor: "#0a1628", color: "#ffffff" }}
          >
            Get Started Free
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg text-zinc-400 hover:text-white transition-colors"
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
                className="block py-2.5 text-[14px] font-medium text-zinc-400 hover:text-white transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 text-[13px] font-medium border border-white/10 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 text-[13px] font-medium rounded-lg transition-all"
                style={{ backgroundColor: "#0a1628", color: "#ffffff" }}
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
