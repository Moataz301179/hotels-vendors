"use client";

import Link from "next/link";
import { Shield, FileCheck, Lock } from "lucide-react";

function FacebookIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  );
}
function InstagramIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
  );
}
import { BrandLogo } from "@/components/layout/brand-logo";
import { useTheme } from "@/components/theme/theme-provider";

const socialLinks = [
  { icon: FacebookIcon, label: "Facebook", href: "https://www.facebook.com/hotelsvendors", color: "#1877F2" },
  { icon: InstagramIcon, label: "Instagram", href: "https://www.instagram.com/hotelsvendors", color: "#E4405F" },
];

export function MarketingFooter() {
  const { mode } = useTheme();
  const isLight = mode === "light";

  return (
    <footer
      className="border-t"
      style={{
        borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)",
        backgroundColor: isLight ? "#ffffff" : "#000000",
      }}
    >
      <div className="mx-auto max-w-7xl px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <BrandLogo variant={isLight ? "light" : "dark"} size="sm" />
            </div>
            <p className={`text-[11px] leading-relaxed max-w-xs mb-4 ${isLight ? "text-gray-500" : "text-zinc-500"}`}>
              Egypt&apos;s B2B procurement operating system for hospitality. AI-powered, ETA-compliant, built for scale.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{ backgroundColor: s.color + "15", color: s.color }}
                >
                  <s.icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className={`text-[11px] font-medium uppercase tracking-wider mb-3 ${isLight ? "text-gray-400" : "text-zinc-500"}`}>Platform</h4>
            <ul className="space-y-2">
              {[
                { label: "Marketplace", href: "/marketplace" },
                { label: "Hotel Solutions", href: "/solutions" },
                { label: "Hotel Dashboard", href: "/sandbox" },
                { label: "Supplier Portal", href: "/become-supplier" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={`text-[12px] transition-colors ${isLight ? "text-gray-500 hover:text-gray-900" : "text-zinc-500 hover:text-white"}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stakeholders */}
          <div>
            <h4 className={`text-[11px] font-medium uppercase tracking-wider mb-3 ${isLight ? "text-gray-400" : "text-zinc-500"}`}>Stakeholders</h4>
            <ul className="space-y-2">
              {[
                { label: "Hotels", href: "/hotels" },
                { label: "Suppliers", href: "/become-supplier" },
                { label: "Pricing", href: "/pricing" },
                { label: "ETA Compliance", href: "/compliance" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={`text-[12px] transition-colors ${isLight ? "text-gray-500 hover:text-gray-900" : "text-zinc-500 hover:text-white"}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className={`text-[11px] font-medium uppercase tracking-wider mb-3 ${isLight ? "text-gray-400" : "text-zinc-500"}`}>Company</h4>
            <ul className="space-y-2">
              {[
                { label: "About", href: "/about" },
                { label: "FAQ", href: "/faq" },
                { label: "Privacy", href: "/privacy" },
                { label: "Terms", href: "/terms" },
                { label: "Sign In", href: "/login" },
                { label: "Get Started", href: "/register" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={`text-[12px] transition-colors ${isLight ? "text-gray-500 hover:text-gray-900" : "text-zinc-500 hover:text-white"}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal */}
        <div className="border-t pt-4 pb-3" style={{ borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)" }}>
          <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)", border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.04)"}` }}>
            <p className={`text-[10px] leading-relaxed text-center ${isLight ? "text-gray-500" : "text-zinc-500"}`}>
              Platform owned and operated by <strong className={isLight ? "text-gray-700" : "text-zinc-400"}>Restaurants for E-Marketing</strong> · Tax ID: <span className={isLight ? "text-gray-500" : "text-zinc-500"}>704226146</span> · Commercial Registry: <span className={isLight ? "text-gray-500" : "text-zinc-500"}>105300900196948</span>
            </p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
          <span className={`flex items-center gap-1.5 text-[10px] ${isLight ? "text-gray-500" : "text-zinc-500"}`}>
            <Shield className="w-3 h-3" style={{ color: isLight ? "#581c87" : "#FFB000" }} />
            Bank-grade security
          </span>
          <span className={`flex items-center gap-1.5 text-[10px] ${isLight ? "text-gray-500" : "text-zinc-500"}`}>
            <FileCheck className="w-3 h-3" style={{ color: isLight ? "#581c87" : "#FFB000" }} />
            ETA compliant · متوافق مع الفوترة الإلكترونية
          </span>
          <span className={`flex items-center gap-1.5 text-[10px] ${isLight ? "text-gray-500" : "text-zinc-500"}`}>
            <Lock className="w-3 h-3" style={{ color: isLight ? "#581c87" : "#FFB000" }} />
            Data isolated · بيانات معزولة
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className={`text-[11px] ${isLight ? "text-gray-400" : "text-zinc-500"}`}>
            &copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.
          </p>
          <div className={`flex items-center gap-4 text-[10px] ${isLight ? "text-gray-400" : "text-zinc-500"}`}>
            <Link href="/privacy" className="hover:opacity-70 transition-opacity">Privacy</Link>
            <span className="opacity-20">|</span>
            <Link href="/terms" className="hover:opacity-70 transition-opacity">Terms</Link>
            <span className="opacity-20">|</span>
            <Link href="/compliance" className="hover:opacity-70 transition-opacity">Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
