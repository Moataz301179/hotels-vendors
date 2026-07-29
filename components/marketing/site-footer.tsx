"use client";

import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useLanguage } from "@/lib/i18n/language-context";

export function SiteFooter() {
  const { locale } = useLanguage();
  const ar = locale === "ar";

  return (
    <footer className={`border-t py-12 px-6 ${ar ? "font-cairo" : ""}`} style={{ borderColor: "#14b8a618" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3" dir="ltr">
              <BrandLogo variant="dark" size="md" showText={false} />
              <span className="font-semibold text-white uppercase text-[15px]" style={{ letterSpacing: "0.2em" }}>
                Hotels Vendors
              </span>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-4">
              {ar
                ? "أول منصة مشتريات فندقية B2B بالذكاء الاصطناعي في مصر. متوافقة مع الهيئة الضريبية وهيئة الرقابة المالية. مجانية للبدء."
                : "The world's first AI-driven B2B procurement platform for hospitality. ETA & FRA compliant. Free to start."}
            </p>
            <div className="flex gap-2 flex-wrap">
              <span className="text-xs px-2 py-0.5 rounded-full border font-semibold" style={{ borderColor: "#14b8a644", color: "#14b8a6" }}>ETA</span>
              <span className="text-xs px-2 py-0.5 rounded-full border font-semibold" style={{ borderColor: "#ff7e1a44", color: "#ff7e1a" }}>FRA</span>
              <span className="text-xs px-2 py-0.5 rounded-full border font-semibold" style={{ borderColor: "#c455ff44", color: "#c455ff" }}>AML/KYC</span>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="font-semibold mb-3 text-white">{ar ? "المنتج" : "Platform"}</div>
              <ul className="flex flex-col gap-2">
                <li><Link href="/marketplace" className="text-white/45 hover:text-white transition-colors">HotelsVendors</Link></li>
                <li><Link href="/marketplace" className="text-white/45 hover:text-white transition-colors">INVO {ar ? "السوق" : "Marketplace"}</Link></li>
                <li><Link href="/sandbox" className="text-white/45 hover:text-white transition-colors">{ar ? "كلاء الذكاء الاصطناعي" : "AI Agents"}</Link></li>
                <li><Link href="/factoring-service" className="text-white/45 hover:text-white transition-colors">{ar ? "التمويل العكسي" : "Reverse Factoring"}</Link></li>
                <li><Link href="/financing/oliv" className="text-white/45 hover:text-white transition-colors">Oliv {ar ? "التمويل" : "Financing"}</Link></li>
                <li><Link href="/suppliers/join" className="text-white/45 hover:text-white transition-colors">{ar ? "للموردين" : "For Suppliers"}</Link></li>
                <li><Link href="/hotels/join" className="text-white/45 hover:text-white transition-colors">{ar ? "للفنادق" : "For Hotels"}</Link></li>
                <li><Link href="/compliance" className="text-white/45 hover:text-white transition-colors">{ar ? "الامتثال" : "Compliance"}</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3 text-white">{ar ? "الشركة" : "Company"}</div>
              <ul className="flex flex-col gap-2">
                <li><Link href="/about" className="text-white/45 hover:text-white transition-colors">{ar ? "عنّا" : "About"}</Link></li>
                <li><Link href="/contact" className="text-white/45 hover:text-white transition-colors">{ar ? "تواصل معنا" : "Contact"}</Link></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3 text-white">{ar ? "قانوني" : "Legal"}</div>
              <ul className="flex flex-col gap-2">
                <li><Link href="/privacy" className="text-white/45 hover:text-white transition-colors">{ar ? "سياسة الخصوصية" : "Privacy Policy"}</Link></li>
                <li><Link href="/terms" className="text-white/45 hover:text-white transition-colors">{ar ? "شروط الخدمة" : "Terms of Service"}</Link></li>
                <li><Link href="/compliance" className="text-white/45 hover:text-white transition-colors">{ar ? "الامتثال" : "Compliance"}</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t text-xs text-white/30" style={{ borderColor: "#14b8a615" }}>
          <span>&copy; {new Date().getFullYear()} {ar ? " Restaurants for E-Marketing. جميع الحقوق محفوظة." : "Restaurants for E-Marketing. All rights reserved."}</span>
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#14b8a6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            ETA &middot; FRA &middot; AML/KYC &middot; {ar ? "المدفوعات عبر شركاء PCI-DSS" : "Payments via PCI-DSS partners"} (Oliv, Paymob)
          </span>
        </div>
      </div>
    </footer>
  );
}
