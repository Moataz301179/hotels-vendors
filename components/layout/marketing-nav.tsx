"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Check } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useTheme, type ThemeMode } from "@/components/theme/theme-provider";
import { RegistrationWizard } from "@/components/auth/registration-wizard";

const THEMES: { key: ThemeMode; label: string; color: string }[] = [
  { key: "wimbledon", label: "Wimbledon", color: "#84CC16" },
  { key: "original", label: "Original", color: "#ED1C24" },
  { key: "hercules", label: "Hercules", color: "#D4AF37" },
];

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const { mode, setMode } = useTheme();
  const menuRef = useRef<HTMLDivElement>(null);

  const isHercules = mode === "hercules";
  const isOriginal = mode === "original";

  // Close theme menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setThemeMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "For Hotels", href: "/register/hotel" },
    { label: "For Suppliers", href: "/register/supplier" },
    { label: "For Funders", href: "/register/funder" },
    { label: "Sandbox", href: "/sandbox" },
  ];

  const accentColor = isHercules ? "#D4AF37" : isOriginal ? "#ED1C24" : "#84CC16";
  const headerBg = scrolled
    ? isHercules
      ? "rgba(10,22,40,0.95)"
      : "rgba(0,0,0,0.95)"
    : "transparent";
  const headerBorder = scrolled
    ? isHercules
      ? "rgba(255,255,255,0.06)"
      : "rgba(255,255,255,0.06)"
    : "transparent";

  return (
    <>
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: headerBg,
        borderBottom: `1px solid ${headerBorder}`,
        backdropFilter: scrolled ? "blur(12px)" : "none",
      }}
    >
      <div className="mx-auto max-w-7xl px-6 h-[68px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-10">
          <BrandLogo variant="dark" size="md" />
        </Link>

        {/* Nav links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 text-[13px] font-medium tracking-wide uppercase rounded-lg transition-colors text-white/50 hover:text-white hover:bg-white/[0.06]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Theme selector dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setThemeMenuOpen(!themeMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-medium rounded-lg transition-all text-white/50 hover:text-white hover:bg-white/[0.06]"
              aria-label="Select theme"
            >
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: accentColor }}
              />
              <span className="uppercase tracking-wider">{mode}</span>
              <ChevronDown size={12} className={`transition-transform ${themeMenuOpen ? "rotate-180" : ""}`} />
            </button>

            {themeMenuOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-48 rounded-xl overflow-hidden shadow-2xl"
                style={{
                  backgroundColor: isHercules ? "#0f1d35" : "#111111",
                  border: `1px solid ${isHercules ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.08)"}`,
                }}
              >
                {THEMES.map((theme) => (
                  <button
                    key={theme.key}
                    onClick={() => { setMode(theme.key); setThemeMenuOpen(false); }}
                    className="w-full flex items-center justify-between px-4 py-3 text-[13px] transition-colors hover:bg-white/[0.04]"
                    style={{ color: mode === theme.key ? theme.color : "rgba(255,255,255,0.6)" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: theme.color }}
                      />
                      <span className="font-medium">{theme.label}</span>
                    </div>
                    {mode === theme.key && <Check size={14} style={{ color: theme.color }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/login"
            className="text-[13px] font-medium tracking-wide uppercase px-4 py-2 rounded-lg transition-colors text-white/60 hover:text-white"
          >
            Sign In
          </Link>

          <button
            onClick={() => setWizardOpen(true)}
            className="text-[13px] font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg transition-all hover:opacity-90 hover:shadow-lg cursor-pointer"
            style={{ background: accentColor, color: isHercules ? "#0a1628" : "#ffffff" }}
          >
            Get Started
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-lg transition-colors text-white/60 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="lg:hidden backdrop-blur-md"
          style={{
            backgroundColor: isHercules ? "rgba(10,22,40,0.98)" : "rgba(0,0,0,0.98)",
            borderTop: `1px solid ${isHercules ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.06)"}`,
          }}
        >
          <div className="px-6 py-5 space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="block py-2.5 text-[13px] font-medium tracking-wide uppercase transition-colors text-white/50 hover:text-white"
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 flex flex-col gap-2 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              {/* Theme selector for mobile */}
              <div className="flex items-center gap-2 pb-2">
                <span className="text-[11px] text-white/30 uppercase tracking-wider">Theme:</span>
                {THEMES.map((theme) => (
                  <button
                    key={theme.key}
                    onClick={() => setMode(theme.key)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg border transition-colors"
                    style={{
                      borderColor: mode === theme.key ? theme.color : "rgba(255,255,255,0.1)",
                      color: mode === theme.key ? theme.color : "rgba(255,255,255,0.5)",
                      backgroundColor: mode === theme.key ? theme.color + "15" : "transparent",
                    }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: theme.color }} />
                    {theme.label}
                  </button>
                ))}
              </div>
              <Link
                href="/login"
                className="w-full text-center py-2.5 text-[12px] font-medium border rounded-lg transition-colors border-white/10 text-white/40 hover:text-white hover:bg-white/5"
              >
                Sign In
              </Link>
              <button
                onClick={() => { setMobileOpen(false); setWizardOpen(true); }}
                className="w-full text-center py-2.5 text-[12px] font-semibold rounded-lg transition-all text-white cursor-pointer"
                style={{ background: accentColor }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
    </header>

    <RegistrationWizard isOpen={wizardOpen} onClose={() => setWizardOpen(false)} />
    </>
  );
}
