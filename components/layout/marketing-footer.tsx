"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Shield, FileCheck, Zap } from "lucide-react";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/icons/social-icons";

export function MarketingFooter() {
  return (
    <footer className="bg-white border-t border-gray-100">
      {/* Trust Bar */}
      <div className="border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-6 py-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {[
            { icon: Shield, text: "Bank-grade security & encryption" },
            { icon: FileCheck, text: "Full ETA e-invoicing compliance" },
            { icon: Zap, text: "99.9% uptime SLA" },
          ].map((item) => (
            <div key={item.text} className="flex items-center gap-2 text-[12px] text-gray-500">
              <item.icon className="w-4 h-4 text-[#8B0000]" />
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <BrandLogo variant="light" size="sm" />
              <div>
                <span className="text-[14px] font-bold text-gray-900 tracking-tight block">
                  Hotels Vendors
                </span>
                <span className="text-[9px] font-semibold text-[#8B0000] uppercase tracking-[0.1em]">
                  Smarter Together
                </span>
              </div>
            </div>
            <p className="text-[12px] text-gray-400 leading-relaxed max-w-xs">
              Egypt's first integrated procurement operating system for hospitality. SaaS-powered, AI-driven, fully compliant.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Solutions", href: "/solutions" },
                { label: "Pricing", href: "/pricing" },
                { label: "Marketplace", href: "/marketplace" },
                { label: "Get Started", href: "/register" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-gray-500 hover:text-[#8B0000] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stakeholders */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Stakeholders
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "Hotels", href: "/hotels" },
                { label: "Suppliers", href: "/suppliers" },
                { label: "Logistics", href: "/solutions" },
                { label: "Factoring", href: "/solutions" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-gray-500 hover:text-[#8B0000] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Social Media", href: "/social-media" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[13px] text-gray-500 hover:text-[#8B0000] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li><span className="text-[13px] text-gray-400">Careers</span></li>
              <li><span className="text-[13px] text-gray-400">Contact</span></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              <li><span className="text-[13px] text-gray-400">Privacy Policy</span></li>
              <li><span className="text-[13px] text-gray-400">Terms of Service</span></li>
              <li><span className="text-[13px] text-gray-400">Cookie Policy</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-400">
            &copy; 2026 Hotels Vendors. Cairo, Egypt. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://www.facebook.com/hotelsvendors"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#1877F2] transition-colors"
            >
              <FacebookIcon className="w-3.5 h-3.5" />
              Facebook
            </a>
            <a
              href="https://www.instagram.com/hotelsvendors"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#E4405F] transition-colors"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/hotelsvendors"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-[#0A66C2] transition-colors"
            >
              <LinkedInIcon className="w-3.5 h-3.5" />
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
