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
          <BrandLogo size="md" />
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-[14px] font-medium rounded-lg transition-colors"
              style={{ color: "var(--foreground-secondary)" }}
              onMouseEnter={(e) => e.target.style.color = mode === "dark" ? "var(--accent-base)" : "var(--accent-dark)"}
              onMouseLeave={(e) => e.target.style.color = "var(--foreground-secondary)"}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleMode}
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all"
            style={{ color: "var(--foreground-secondary)" }}
            onMouseEnter={(e) => e.target.style.backgroundColor = mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
            title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {mode === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <Link
            href="/login"
            className="text-[14px] font-medium transition-colors"
            style={{ color: "var(--foreground-secondary)" }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center text-[13px] py-2 px-5 font-medium rounded-lg transition-all"
            style={{ backgroundColor: "var(--accent-base)", color: "#0B0F1A" }}
          >
            Get Started Free
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg transition-colors"
          style={{ color: "var(--foreground-secondary)" }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden animate-fade-in-up"
          style={{ backgroundColor: "var(--bg-surface-1)", borderTop: "1px solid var(--border-subtle)" }}
        >
          <div className="px-6 py-5 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-2.5 text-[14px] font-medium transition-colors"
                style={{ color: "var(--foreground-secondary)" }}
                onMouseEnter={(e) => e.target.style.color = "var(--accent-base)"}
                onMouseLeave={(e) => e.target.style.color = "var(--foreground-secondary)"}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex gap-3">
              <Link
                href="/login"
                className="flex-1 text-center py-2.5 text-[13px] font-medium rounded-lg transition-colors"
                style={{ border: "1px solid var(--border-visible)", color: "var(--foreground-secondary)" }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 text-[13px] font-medium rounded-lg transition-all"
                style={{ backgroundColor: "var(--accent-base)", color: "#0B0F1A" }}
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
