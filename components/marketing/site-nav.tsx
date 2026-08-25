"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { useLanguage } from "@/lib/i18n/language-context";

/* ────────────────────────────────────────────────────────────────
   Site Nav — Bold Typography edition
   • Logo: icon 34px + tight wordmark, single line, 68px bar
   • Menu: 4 focused groups (no duplication), flat links, Partner Portal
   • Motion: 150ms underline scale, chevron rotate, dropdown fade
   • CTA: "Create account" (accent underline style), "Sign in" ghost
   ──────────────────────────────────────────────────────────────── */

interface DropdownItem { href: string; label: string; desc?: string; }
interface NavGroup { label: string; items: DropdownItem[]; }

function getGroups(ar: boolean): NavGroup[] {
  return [
    {
      label: ar ? "السوق" : "Marketplace",
      items: [
        { href: "/marketplace", label: ar ? "تصفح الكتالوج" : "Browse catalog", desc: ar ? "كل فئات التوريد الفندقي" : "All hospitality supply categories" },
        { href: "/categories", label: ar ? "الفئات" : "Categories", desc: ar ? "F&B، Housekeeping، FF&E وأكثر" : "F&B, Housekeeping, FF&E and more" },
        { href: "/rfq", label: ar ? "طلب عروض أسعار" : "Request for quote", desc: ar ? "أرسل احتياجك للموردين المعتمدين" : "Send requirements to vetted suppliers" },
      ],
    },
    {
      label: ar ? "التمويل" : "Financing",
      items: [
        { href: "/financing", label: ar ? "التمويل والسيولة" : "Financing & liquidity", desc: ar ? "خطوط ائتمان حتى 10 مليون ج.م" : "Credit lines up to EGP 10M" },
        { href: "/factoring-service", label: ar ? "خصم الفواتير" : "Invoice factoring", desc: ar ? "دفع للموردين خلال 48 ساعة" : "Suppliers paid in 48 hours" },
        { href: "/yield-calculator", label: ar ? "حاسبة العائد" : "Yield calculator", desc: ar ? "احسب التكلفة قبل الالتزام" : "Model the cost before committing" },
      ],
    },
    {
      label: ar ? "المنصة" : "Platform",
      items: [
        { href: "/platform", label: ar ? "نظرة عامة" : "Overview", desc: ar ? "كيف تعمل المنصة" : "How the platform works" },
        { href: "/erp-integrations", label: ar ? "التكاملات" : "Integrations", desc: ar ? "SAP و Oracle و Opera" : "SAP, Oracle, Opera PMS" },
        { href: "/eta-compliance", label: ar ? "الامتثال الضريبي" : "ETA compliance", desc: ar ? "فوترة إلكترونية موقعة" : "Signed e-invoicing, built in" },
      ],
    },
  ];
}

function DropdownMenu({ group, ar }: { group: NavGroup; ar: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="hv-nav-link flex items-center gap-1 text-[13px] font-medium text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors cursor-pointer bg-transparent border-0"
      >
        {group.label}
        <ChevronDown size={13} className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute left-0 top-full pt-3 hv-dropdown">
          <div className="border border-[#262626] bg-[#0F0F0F] min-w-[300px] py-2">
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-5 py-3 hover:bg-[#1A1A1A] transition-colors group/item"
              >
                <div className="text-[13.5px] font-medium text-[#FAFAFA] group-hover/item:text-[#FF3D00] transition-colors">
                  {item.label}
                </div>
                {item.desc && <div className="text-[12px] text-[#737373] mt-0.5">{item.desc}</div>}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteNav() {
  const { locale } = useLanguage();
  const ar = locale === "ar";
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const groups = getGroups(ar);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#262626]" : "bg-[#0A0A0A] border-b border-transparent"
      }`}
    >
      <style>{`
        .hv-nav-link { position: relative; }
        .hv-nav-link::after { content: ""; position: absolute; left: 0; bottom: -6px; height: 2px; width: 100%;
          background: #FF3D00; transform: scaleX(0); transform-origin: left; transition: transform .15s cubic-bezier(.25,0,0,1); }
        .hv-nav-link:hover::after, .hv-cta::after { transform: scaleX(1); }
        .hv-cta { position: relative; color: #FF3D00; font-weight: 600; font-size: 13px;
          letter-spacing: .08em; text-transform: uppercase; }
        .hv-cta::after { content: ""; position: absolute; left: 0; bottom: -4px; height: 2px; width: 100%;
          background: #FF3D00; transform: scaleX(1); transform-origin: left; transition: transform .15s cubic-bezier(.25,0,0,1); }
        .hv-cta:hover::after { transform: scaleX(1.1); }
        .hv-dropdown { animation: hvDrop .15s cubic-bezier(.25,0,0,1); }
        @keyframes hvDrop { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .hv-dropdown { animation: none; }
          .hv-nav-link::after, .hv-cta::after { transition: none; }
        }
      `}</style>

      <div className="mx-auto max-w-[1200px] px-6 md:px-12 h-[68px] flex items-center justify-between gap-6">
        {/* Logo — icon + wordmark, tight, single line */}
        <Link href="/" className="flex items-center gap-3 shrink-0" dir="ltr">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="HotelsVendors" width={30} height={30} className="object-contain" />
          <span
            className="hidden sm:block font-semibold uppercase text-[13px] text-[#FAFAFA]"
            style={{ letterSpacing: "0.22em" }}
          >
            HotelsVendors
          </span>
        </Link>

        {/* Desktop menu */}
        <div className="hidden lg:flex items-center gap-8">
          {groups.map((g) => (
            <DropdownMenu key={g.label} group={g} ar={ar} />
          ))}
          <Link href="/partners" className="hv-nav-link text-[13px] font-medium text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors">
            {ar ? "بوابة الشركاء" : "Partners"}
          </Link>
        </div>

        {/* Desktop actions */}
        <div className="hidden lg:flex items-center gap-6 shrink-0">
          <Link href="/login" className="text-[13px] font-medium text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors">
            {ar ? "تسجيل الدخول" : "Sign in"}
          </Link>
          <Link href="/register" className="hv-cta">
            {ar ? "أنشئ حساباً" : "Create account"}
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden text-[#FAFAFA] cursor-pointer bg-transparent border-0 p-2"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-[#262626] bg-[#0A0A0A] px-6 py-4 space-y-4 max-h-[80dvh] overflow-y-auto">
          {groups.map((g) => (
            <div key={g.label}>
              <div className="hv-label mb-2">{g.label}</div>
              {g.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 text-[14px] text-[#A3A3A3] hover:text-[#FAFAFA] transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
          <hr className="border-[#262626]" />
          <Link href="/partners" onClick={() => setOpen(false)} className="block py-2 text-[14px] text-[#A3A3A3] hover:text-[#FAFAFA]">
            {ar ? "بوابة الشركاء" : "Partner Portal"}
          </Link>
          <Link href="/pricing" onClick={() => setOpen(false)} className="block py-2 text-[14px] text-[#A3A3A3] hover:text-[#FAFAFA]">
            {ar ? "الأسعار" : "Pricing"}
          </Link>
          <div className="flex gap-4 pt-2 pb-4">
            <Link href="/login" onClick={() => setOpen(false)} className="text-[13px] font-medium text-[#A3A3A3] hover:text-[#FAFAFA]">
              {ar ? "تسجيل الدخول" : "Sign in"}
            </Link>
            <Link href="/register" onClick={() => setOpen(false)} className="hv-cta">
              {ar ? "أنشئ حساباً" : "Create account"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
