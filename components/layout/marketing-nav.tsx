"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { RegistrationWizard } from "@/components/auth/registration-wizard";

const ACCENT = "#FF6B00";

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

  const headerBg = scrolled ? "rgba(0,0,0,0.95)" : "transparent";
  const headerBorder = scrolled ? "rgba(255,255,255,0.06)" : "transparent";

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
        <Link href="/" className="relative z-10">
          <BrandLogo variant="dark" size="md" />
        </Link>

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

        <div className="hidden lg:flex items-center gap-2">
          <Link
            href="/login"
            className="text-[13px] font-medium tracking-wide uppercase px-4 py-2 rounded-lg transition-colors text-white/60 hover:text-white"
          >
            Sign In
          </Link>

          <button
            onClick={() => setWizardOpen(true)}
            className="text-[13px] font-semibold tracking-wide uppercase px-5 py-2.5 rounded-lg transition-all hover:opacity-90 hover:shadow-lg cursor-pointer"
            style={{ background: ACCENT, color: "#ffffff" }}
          >
            Get Started
          </button>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg transition-colors text-white/60 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div
          className="lg:hidden backdrop-blur-md"
          style={{
            backgroundColor: "rgba(0,0,0,0.98)",
            borderTop: "1px solid rgba(255,255,255,0.06)",
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
              <Link
                href="/login"
                className="w-full text-center py-2.5 text-[12px] font-medium border rounded-lg transition-colors border-white/10 text-white/40 hover:text-white hover:bg-white/5"
              >
                Sign In
              </Link>
              <button
                onClick={() => { setMobileOpen(false); setWizardOpen(true); }}
                className="w-full text-center py-2.5 text-[12px] font-semibold rounded-lg transition-all text-white cursor-pointer"
                style={{ background: ACCENT }}
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
