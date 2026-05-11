"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

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
    <footer className="marketing-footer bg-[#050505] border-t border-white/[0.06]">
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
                <span className="marketing-footer-logo-text text-[14px] font-bold text-white tracking-tight block">
                  Hotels Vendors
                </span>
                <span className="marketing-footer-logo-sub text-[9px] font-medium text-white/30 uppercase tracking-[0.1em]">
                  Smarter Together
                </span>
              </div>
            </div>
            <p className="marketing-footer-desc text-[12px] text-white/30 leading-relaxed max-w-xs">
              Egypt's first AI-powered digital procurement hub built exclusively for the hospitality sector.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="marketing-footer-heading text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {["How it Works", "Features", "Security", "API Docs"].map((item) => (
                <li key={item}>
                  <Link href="/" className="marketing-footer-link text-[13px] text-white/30 hover:text-white/70 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="marketing-footer-heading text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5">
              {["Browse Products", "Categories", "Top Suppliers", "Deals & Offers"].map((item) => (
                <li key={item}>
                  <Link href="/marketplace" className="marketing-footer-link text-[13px] text-white/30 hover:text-white/70 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="marketing-footer-heading text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              Company
            </h4>
            <ul className="space-y-2.5">
              {["About Us", "Careers", "Press", "Partners", "Contact"].map((item) => (
                <li key={item}>
                  <Link href="/" className="marketing-footer-link text-[13px] text-white/30 hover:text-white/70 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="marketing-footer-heading text-[11px] font-semibold text-white/50 uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <Link href="/" className="marketing-footer-link text-[13px] text-white/30 hover:text-white/70 transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="marketing-footer-bottom-border pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="marketing-footer-copyright text-[11px] text-white/20">
            &copy; 2026 Hotels Vendors. All rights reserved. Cairo, Egypt.
          </p>
          <div className="flex items-center gap-6">
            {["LinkedIn", "Twitter", "Facebook"].map((social) => (
              <a
                key={social}
                href="#"
                className="marketing-footer-social text-[11px] text-white/20 hover:text-white/50 transition-colors"
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
