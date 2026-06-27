"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { RegistrationWizard } from "@/components/auth/registration-wizard";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { LanguageSwitcher } from "@/components/layout/language-switcher";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onClick = () => setOpenDropdown(null);
    if (openDropdown) document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [openDropdown]);

  const platformItems = [
    { label: "Overview", href: "/platform" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Sandbox", href: "/sandbox" },
    { label: "Compliance", href: "/compliance" },
  ];

  const solutionItems = [
    { label: "For Hotels", href: "/hotels" },
    { label: "For Suppliers", href: "/become-supplier" },
    { label: "For Funders", href: "/factoring-service" },
    { label: "For Carriers", href: "/logistics-service" },
  ];

  const navLinks = [
    { label: "Platform", href: "/platform", dropdown: platformItems },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Pricing", href: "/pricing" },
    { label: "Solutions", href: "/solutions", dropdown: solutionItems },
    { label: "Blog", href: "/blog" },
  ];

  return (
    <>
      <header
        className="marketing-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? "var(--bg-surface-1)" : "transparent",
          borderBottom: `1px solid ${scrolled ? "var(--border-subtle)" : "transparent"}`,
          backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
          boxShadow: scrolled ? "0 1px 0 var(--border-invisible)" : "none",
        }}
      >
        <div
          className="mx-auto max-w-7xl px-6 h-[68px] flex items-center justify-between"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          {/* Brand */}
          <Link href="/" className="relative z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50 rounded-lg">
            <BrandLogo variant="light" size="md" />
          </Link>

          {/* Desktop nav — centered */}
          <nav className="hidden lg:flex items-center gap-0.5 relative">
            {navLinks.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.dropdown && setOpenDropdown(item.label)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="px-4 py-2 text-[13px] font-medium tracking-wide uppercase rounded-xl transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50"
                  style={{
                    color: "var(--text-primary)",
                  }}
                  onClick={(e) => {
                    if (item.dropdown) {
                      e.preventDefault();
                      setOpenDropdown(openDropdown === item.label ? null : item.label);
                    }
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--accent-base)";
                    (e.currentTarget as HTMLElement).style.background = "var(--accent-muted)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {item.label}
                  {item.dropdown && (
                    <ChevronDown
                      size={12}
                      className="transition-transform"
                      style={{
                        transform: openDropdown === item.label ? "rotate(180deg)" : "rotate(0)",
                        color: "var(--text-secondary)",
                      }}
                    />
                  )}
                </Link>

                {/* Dropdown */}
                {item.dropdown && openDropdown === item.label && (
                  <div
                    className="absolute top-full left-0 mt-1 w-52 py-2 rounded-xl shadow-xl z-50"
                    style={{
                      background: "var(--bg-surface-1)",
                      border: "1px solid var(--border-subtle)",
                      boxShadow: "var(--shadow-elevated)",
                    }}
                  >
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.label}
                        href={sub.href}
                        className="block px-4 py-2.5 text-[12px] tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50"
                        style={{ color: "var(--text-secondary)" }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--accent-base)";
                          (e.currentTarget as HTMLElement).style.background = "var(--accent-muted)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                          (e.currentTarget as HTMLElement).style.background = "transparent";
                        }}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Link
              href="/login"
              className="text-[13px] font-medium tracking-wide uppercase px-3 py-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              Sign In
            </Link>
            <Link
              href="/about"
              className="text-[13px] font-medium tracking-wide uppercase px-3 py-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50"
              style={{ color: "var(--text-secondary)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              Contact Sales
            </Link>
            <button
              onClick={() => setWizardOpen(true)}
              className="text-[13px] font-semibold tracking-wide uppercase px-5 py-2.5 rounded-xl transition-all hover:opacity-90 hover:scale-[1.02] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
              style={{
                background: "var(--accent-base)",
                color: "var(--accent-text)",
                boxShadow: "0 0 12px var(--accent-glow)",
              }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50"
            style={{ color: "var(--text-primary)" }}
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
              backgroundColor: "var(--bg-surface-1)",
              borderTop: "1px solid var(--border-subtle)",
            }}
          >
            <div className="px-6 py-5 space-y-1">
              {navLinks.map((item) => (
                <div key={item.label}>
                  <Link
                    href={item.href}
                    className="block py-2.5 text-[13px] font-medium tracking-wide uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50 rounded-lg"
                    style={{ color: "var(--text-primary)" }}
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                  {item.dropdown && (
                    <div className="pl-4 space-y-0.5">
                      {item.dropdown.map((sub) => (
                        <Link
                          key={sub.label}
                          href={sub.href}
                          className="block py-2 text-[12px] tracking-wide transition-colors"
                          style={{ color: "var(--text-secondary)" }}
                          onClick={() => setMobileOpen(false)}
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div
                className="pt-4 mt-2 flex flex-col gap-2 border-t"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[12px] font-medium tracking-wide uppercase"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Theme
                  </span>
                  <ThemeToggle />
                </div>
                <Link
                  href="/login"
                  className="w-full text-center py-2.5 text-[12px] font-medium border rounded-xl transition-colors"
                  style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/about"
                  className="w-full text-center py-2.5 text-[12px] font-medium border rounded-xl transition-colors"
                  style={{ borderColor: "var(--border-subtle)", color: "var(--text-secondary)" }}
                  onClick={() => setMobileOpen(false)}
                >
                  Contact Sales
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    setWizardOpen(true);
                  }}
                  className="w-full text-center py-2.5 text-[12px] font-semibold rounded-xl transition-all cursor-pointer"
                  style={{ background: "var(--accent-base)", color: "var(--accent-text)" }}
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
