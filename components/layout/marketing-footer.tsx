"use client";

import Link from "next/link";
import { ShieldCheck, FileCheck, Zap } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Trust bar */}
      <div className="border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <div className="flex flex-wrap items-center justify-center gap-6 text-[12px] text-gray-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#8B0000]" />
              Bank-grade security & encryption
            </span>
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-4 h-4 text-[#8B0000]" />
              Full ETA e-invoicing compliance
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#8B0000]" />
              99.9% uptime SLA
            </span>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-md bg-[#8B0000] flex items-center justify-center">
                <span className="text-white font-bold text-xs">HV</span>
              </div>
              <span className="text-[15px] font-bold text-gray-900">Hotels Vendors</span>
            </div>
            <p className="text-[13px] text-gray-500 leading-relaxed max-w-xs">
              Egypt's first integrated procurement operating system for hospitality. SaaS-powered, AI-driven, fully compliant.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Platform</p>
            <div className="flex flex-col gap-2">
              <Link href="/solutions" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Solutions</Link>
              <Link href="/pricing" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Pricing</Link>
              <Link href="/marketplace" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Marketplace</Link>
              <Link href="/register" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Get Started</Link>
            </div>
          </div>

          {/* For Stakeholders */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Stakeholders</p>
            <div className="flex flex-col gap-2">
              <Link href="/register?role=hotel" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Hotels</Link>
              <Link href="/become-supplier" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Suppliers</Link>
              <Link href="/register?role=shipping" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Logistics</Link>
              <Link href="/register?role=factoring" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Factoring</Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Company</p>
            <div className="flex flex-col gap-2">
              <Link href="/about" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">About Us</Link>
              <Link href="/about" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Careers</Link>
              <Link href="/social-media" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Press Kit</Link>
              <Link href="/help" className="text-[13px] text-gray-600 hover:text-[#8B0000] transition-colors">Contact</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Legal</p>
            <div className="flex flex-col gap-2">
              <span className="text-[13px] text-gray-400">Privacy Policy</span>
              <span className="text-[13px] text-gray-400">Terms of Service</span>
              <span className="text-[13px] text-gray-400">Cookie Policy</span>
              <span className="text-[13px] text-gray-400">Compliance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-gray-400">
            &copy; 2026 Hotels Vendors. Cairo, Egypt. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[12px] text-gray-400 hover:text-[#8B0000] cursor-pointer transition-colors">LinkedIn</span>
            <span className="text-[12px] text-gray-400 hover:text-[#8B0000] cursor-pointer transition-colors">Twitter</span>
            <span className="text-[12px] text-gray-400 hover:text-[#8B0000] cursor-pointer transition-colors">Facebook</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
