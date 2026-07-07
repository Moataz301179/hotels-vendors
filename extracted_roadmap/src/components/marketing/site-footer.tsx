import Link from "next/link";
import { LogoFull } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <LogoFull />
            <p className="mt-4 text-sm text-fg-3 leading-relaxed max-w-xs">
              Enterprise hospitality procurement, ETA e-invoicing, GRN, reverse factoring and AI cashflow automation.
            </p>
          </div>
          {[
            { title: "Platform", links: [["Marketplace", "/marketplace"], ["Order tracking", "/tracking"], ["GRN", "/grn"], ["ETA compliance", "/compliance"]] },
            { title: "Capital", links: [["Factoring desk", "/financing"], ["Payments", "/wallet"], ["Admin", "/admin"], ["Investor thesis", "/vision"]] },
            { title: "Access", links: [["Sign in", "/login"], ["Get started", "/register"], ["Sandbox", "/login"]] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={label}><Link href={href} className="text-sm text-fg-3 hover:text-fg transition">{label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-fg-4">
          <p>© {new Date().getFullYear()} HotelsVendors. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/vision" className="hover:text-fg transition">Terms</Link>
            <Link href="/vision" className="hover:text-fg transition">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
