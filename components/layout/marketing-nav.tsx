"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { RegistrationWizard } from "@/components/auth/registration-wizard";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/shared/language-switcher";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { label: "Platform", href: "/platform" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Pricing", href: "/pricing" },
    { label: "Solutions", href: "/solutions" },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <header
        className="marketing-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "rgba(246,247,249,0.92)" : "transparent",
          borderBottom: `1px solid ${scrolled ? "var(--border-subtle)" : "transparent"}`,
          backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 h-[68px] flex items-center justify-between font-sans">
          {/* Brand */}
          <Link href="/" className="relative z-10">
            <BrandLogo variant="light" size="md" />
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden lg:flex items-center gap-0.5">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 text-[13px] font-medium tracking-wide uppercase rounded-xl transition-colors text-muted hover:text-primary hover:bg-surface-hover"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-[13px] font-medium tracking-wide uppercase px-4 py-2 rounded-xl transition-colors text-secondary hover:text-primary"
            >
              Sign In
            </Link>
            <button
              onClick={() => setWizardOpen(true)}
              className="text-[13px] font-semibold tracking-wide uppercase px-5 py-2.5 rounded-xl transition-all hover:opacity-90 hover:shadow-lg cursor-pointer"
              style={{ background: "var(--accent-base)", color: "var(--accent-text)" }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-xl transition-colors text-secondary hover:text-primary"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="lg:hidden backdrop-blur-md"
            style={{
              backgroundColor: "rgba(246,247,249,0.98)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <div className="px-6 py-5 space-y-1">
              {navLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block py-2.5 text-[13px] font-medium tracking-wide uppercase transition-colors text-muted hover:text-primary"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <div
                className="pt-4 mt-2 flex flex-col gap-2 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[12px] font-medium tracking-wide uppercase text-muted">
                    Theme
                  </span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 text-[12px] font-medium border rounded-xl transition-colors border-white/40 text-muted hover:text-primary hover:bg-surface-hover"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setWizardOpen(true);
                  }}
                  className="w-full text-center py-2.5 text-[12px] font-semibold rounded-xl transition-all text-white cursor-pointer"
                  style={{ background: "var(--accent-base)" }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <RegistrationWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
      />
    </>
  );
}
