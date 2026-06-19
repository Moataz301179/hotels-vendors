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
  const isLight = mode === "light";

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isLight
            ? "bg-white/95 backdrop-blur-md shadow-md border-b border-black/[0.06]"
            : "bg-black/95 backdrop-blur-md shadow-lg border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-auto min-h-[72px] py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <BrandLogo variant={isLight ? "light" : "dark"} size="md" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${
                isLight
                  ? "text-gray-600 hover:text-gray-900 hover:bg-purple-50"
                  : "text-zinc-400 hover:text-white hover:text-amber-400"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleMode}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              isLight
                ? "text-gray-500 hover:text-purple-700 hover:bg-purple-50"
                : "text-white/50 hover:text-white hover:bg-white/10"
            }`}
            title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
            aria-label="Toggle theme"
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <Link
            href="/login"
            className={`text-[14px] font-medium transition-colors ${
              isLight ? "text-gray-600 hover:text-gray-900" : "text-zinc-400 hover:text-white"
            }`}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-[13px] py-2 px-5 font-medium rounded-lg transition-all"
            style={{ backgroundColor: isLight ? "#581c87" : "#FFB000", color: "#ffffff" }}
          >
            Get Started Free
          </Link>
        </div>

        <button
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isLight ? "text-gray-600 hover:text-gray-900" : "text-zinc-400 hover:text-white"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className={`lg:hidden backdrop-blur-md animate-fade-in-up ${
          isLight ? "bg-white/98 border-t border-black/[0.06]" : "bg-black/98 border-t border-white/5"
        }`}>
          <div className="px-6 py-5 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-2.5 text-[14px] font-medium transition-colors ${
                  isLight ? "text-gray-600 hover:text-gray-900" : "text-zinc-400 hover:text-white"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={toggleMode}
                className={`flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium rounded-lg border transition-colors ${
                  isLight
                    ? "border-gray-200 text-gray-600 hover:bg-purple-50"
                    : "border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {isLight ? <Moon size={14} /> : <Sun size={14} />}
                {isLight ? "Dark Mode" : "Light Mode"}
              </button>
              <Link
                href="/login"
                className={`flex-1 text-center py-2.5 text-[13px] font-medium border rounded-lg transition-colors ${
                  isLight
                    ? "border-gray-200 text-gray-600 hover:bg-gray-50"
                    : "border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 text-[13px] font-medium rounded-lg transition-all text-white"
                style={{ backgroundColor: isLight ? "#581c87" : "#FFB000" }}
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
