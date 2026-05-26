"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Shield, FileCheck, Zap } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/icons/social-icons";

const INVESTORS = [
  { name: "Flat6Labs", region: "Egypt" },
  { name: "Algebra Ventures", region: "Egypt" },
  { name: "500 Startups", region: "Global" },
  { name: "Sawari Ventures", region: "MENA" },
  { name: "Global Ventures", region: "MENA" },
  { name: "A15", region: "Egypt" },
];

const FOOTER_LINKS = {
  Product: [
    { label: "Platform", href: "/solutions" },
    { label: "Marketplace", href: "/marketplace" },
    { label: "Pricing", href: "/pricing" },
    { label: "API", href: "/about" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/about" },
    { label: "Press", href: "/about" },
    { label: "Contact", href: "/about" },
  ],
  Resources: [
    { label: "Blog", href: "/about" },
    { label: "Documentation", href: "/about" },
    { label: "Help Center", href: "/help" },
    { label: "Status", href: "/about" },
  ],
  Legal: [
    { label: "Privacy", href: "/about" },
    { label: "Terms", href: "/about" },
    { label: "Compliance", href: "/about" },
    { label: "Security", href: "/about" },
  ],
};

export function MarketingFooter() {
  return (
    <footer className="bg-[#000000] border-t border-white/[0.04]">
      {/* Trust Bar */}
      <div className="border-b border-white/[0.04]">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { icon: Shield, text: "Bank-grade security & encryption" },
            { icon: FileCheck, text: "Full ETA e-invoicing compliance" },
            { icon: Zap, text: "99.9% uptime SLA" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-[12px] text-white/30">
              <item.icon className="w-4 h-4 text-[#a3e635]" />
              {item.text}
            </div>
          ))}
        </div>
      </div>

      {/* Venture Capital */}
      <div className="border-b border-white/[0.04] bg-white/[0.01]">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <p className="text-[11px] font-semibold text-white/30 uppercase tracking-wider text-center mb-4">
            Backed by Leading Investors in MENA Fintech
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {INVESTORS.map((inv) => (
              <div key={inv.name} className="text-center group">
                <span className="text-[13px] font-semibold text-white/60 group-hover:text-[#a3e635] transition-colors">
                  {inv.name}
                </span>
                <span className="block text-[10px] text-white/20 mt-0.5">{inv.region}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <BrandLogo variant="light" size="sm" />
              <div>
                <span className="text-[14px] font-bold text-white tracking-tight block">
                  Hotels Vendors
                </span>
                <span className="text-[9px] font-semibold text-[#a3e635] uppercase tracking-[0.1em]">
                  Smarter Together
                </span>
              </div>
            </div>
            <p className="text-[12px] text-white/25 leading-relaxed max-w-xs">
              Egypt&apos;s first integrated procurement operating system for hospitality. SaaS-powered, AI-driven, fully compliant.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-[11px] font-semibold text-white/30 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-white/25 hover:text-[#a3e635] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-white/15">
            &copy; 2026 Hotels Vendors. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/hotelsvendors" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg transition-colors text-white/20 hover:text-[#a3e635] hover:bg-white/[0.03]">
              <FacebookIcon className="w-4 h-4" />
            </a>
            <a href="https://www.instagram.com/hotelsvendors" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg transition-colors text-white/20 hover:text-[#a3e635] hover:bg-white/[0.03]">
              <InstagramIcon className="w-4 h-4" />
            </a>
            <a href="https://www.linkedin.com/company/hotelsvendors" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg transition-colors text-white/20 hover:text-[#a3e635] hover:bg-white/[0.03]">
              <LinkedInIcon className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
