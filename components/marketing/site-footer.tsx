import Link from "next/link";
import { LogoFull } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-black">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <LogoFull />
            <p className="mt-4 text-sm text-white/40 leading-relaxed max-w-xs">
              Enterprise hospitality procurement, ETA e-invoicing, reverse factoring and AI cashflow automation for Egyptian hotels.
            </p>
          </div>
          {[
            {
              title: "Platform",
              links: [
                ["Marketplace", "/marketplace"],
                ["Pricing", "/pricing"],
                ["Solutions", "/solutions"],
                ["ETA Compliance", "/compliance"],
              ],
            },
            {
              title: "Capital",
              links: [
                ["Factoring Service", "/factoring-service"],
                ["Logistics", "/logistics-service"],
                ["VAT Invoicing", "/vat-invoicing"],
                ["Become a Supplier", "/become-supplier"],
              ],
            },
            {
              title: "Access",
              links: [
                ["Sign in", "/login"],
                ["Get started", "/register"],
                ["About Us", "/about"],
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-medium text-white">{col.title}</h4>
              <ul className="mt-3 space-y-2">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-white/40 hover:text-white transition"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <p>&copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/about" className="hover:text-white transition">
              Terms
            </Link>
            <Link href="/about" className="hover:text-white transition">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
