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
    { label: "Solutions", href: "/solutions" },
    { label: "Sandbox", href: "/sandbox" },
    { label: "Suppliers", href: "/become-supplier" },
    { label: "Compliance", href: "/compliance" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? isLight
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-black/[0.06]"
            : "bg-[#07090f]/95 backdrop-blur-md shadow-lg border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-[68px] flex items-center justify-between">
        {/* Logo — consistent uppercase */}
        <Link href="/" className="relative z-10">
          <BrandLogo variant={isLight ? "light" : "dark"} size="md" />
        </Link>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`px-4 py-2 text-[13px] font-medium tracking-wide uppercase rounded-lg transition-colors ${
                isLight
                  ? "text-gray-500 hover:text-gray-900 hover:bg-purple-50"
                  : "text-white/50 hover:text-white hover:bg-white/[0.06]"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={toggleMode}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
              isLight
                ? "text-gray-400 hover:text-purple-700 hover:bg-purple-50"
                : "text-white/40 hover:text-white hover:bg-white/[0.06]"
            }`}
            aria-label="Toggle theme"
          >
            {isLight ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <Link
            href="/login"
            className={`text-[13px] font-medium tracking-wide uppercase px-4 py-2 rounded-lg transition-colors ${
              isLight ? "text-gray-600 hover:text-gray-900" : "text-white/60 hover:text-white"
            }`}
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="text-[13px] font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg transition-all hover:opacity-90 hover:shadow-lg"
            style={{
              background: isLight
                ? "linear-gradient(135deg, #FF6B00, #FF8C38)"
                : "linear-gradient(135deg, #FF6B00, #FF8C38)",
              color: "#ffffff",
            }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className={`lg:hidden p-2 rounded-lg transition-colors ${
            isLight ? "text-gray-600 hover:text-gray-900" : "text-white/60 hover:text-white"
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`lg:hidden backdrop-blur-md ${
          isLight ? "bg-white/98 border-t border-black/[0.06]" : "bg-[#07090f]/98 border-t border-white/[0.04]"
        }`}>
          <div className="px-6 py-5 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block py-2.5 text-[13px] font-medium tracking-wide uppercase transition-colors ${
                  isLight ? "text-gray-500 hover:text-gray-900" : "text-white/50 hover:text-white"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex items-center gap-3 border-t" style={{ borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }}>
              <button
                onClick={toggleMode}
                className={`flex items-center gap-2 px-4 py-2.5 text-[12px] font-medium rounded-lg border transition-colors ${
                  isLight
                    ? "border-gray-200 text-gray-500 hover:bg-purple-50"
                    : "border-white/10 text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                {isLight ? <Moon size={14} /> : <Sun size={14} />}
                {isLight ? "Dark" : "Light"}
              </button>
              <Link
                href="/login"
                className={`flex-1 text-center py-2.5 text-[12px] font-medium border rounded-lg transition-colors ${
                  isLight
                    ? "border-gray-200 text-gray-500 hover:bg-gray-50"
                    : "border-white/10 text-white/40 hover:text-white hover:bg-white/5"
                }`}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center py-2.5 text-[12px] font-semibold rounded-lg transition-all text-white"
                style={{ background: "linear-gradient(135deg, #FF6B00, #FF8C38)" }}
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
