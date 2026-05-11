"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Shield, FileCheck, Zap } from "lucide-react";

export function MarketingFooter() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const sync = () => {
      setIsLight(document.documentElement.getAttribute("data-theme") === "light");
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const logoSrc = isLight ? "/logo-icon.png" : "/logo-icon-white.png";

  return (
    <footer className={`${isLight ? "bg-gray-50 border-t border-gray-100" : "bg-white border-t border-gray-100"}`}>
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
              <Image
                src={logoSrc}
                alt="Hotels Vendors"
                width={32}
                height={44}
                className="object-contain"
                priority
              />
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
              {["Solutions", "Pricing", "Marketplace", "Get Started"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-[13px] text-gray-500 hover:text-[#8B0000] transition-colors">
                    {item}
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
              {["Hotels", "Suppliers", "Logistics", "Factoring"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-[13px] text-gray-500 hover:text-[#8B0000] transition-colors">
                    {item}
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
              {["About Us", "Careers", "Press Kit", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-[13px] text-gray-500 hover:text-[#8B0000] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy", "Compliance"].map((item) => (
                <li key={item}>
                  <Link href="/" className="text-[13px] text-gray-500 hover:text-[#8B0000] transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-400">
            &copy; 2026 Hotels Vendors. Cairo, Egypt. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["LinkedIn", "Twitter", "Facebook"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-[11px] text-gray-400 hover:text-[#8B0000] transition-colors"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
