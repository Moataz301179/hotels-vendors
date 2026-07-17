import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

export function SiteFooter() {
  return (
    <footer className="border-t py-12 px-6" style={{ borderColor: "#39ff7e18" }}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5 mb-3">
              <BrandLogo variant="dark" size="sm" showText={false} />
              <span className="font-semibold text-[15px] text-white uppercase" style={{ letterSpacing: "0.2em", fontFamily: "var(--font-display), 'Plus Jakarta Sans', 'Inter', system-ui, sans-serif" }}>
                Hotels Vendors
              </span>
            </div>
            <p className="text-white/45 text-sm leading-relaxed mb-4">
              The world&apos;s first AI-driven B2B procurement platform for
              hospitality. ETA &amp; FRA compliant. Free to start.
            </p>
            <div className="flex gap-2 flex-wrap">
              <span
                className="text-xs px-2 py-0.5 rounded-full border font-semibold"
                style={{
                  borderColor: "#39ff7e44",
                  color: "#39ff7e",
                }}
              >
                ETA
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full border font-semibold"
                style={{
                  borderColor: "#ff7e1a44",
                  color: "#ff7e1a",
                }}
              >
                FRA
              </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full border font-semibold"
              style={{
                borderColor: "#c455ff44",
                color: "#c455ff",
              }}
            >
              AML/KYC
            </span>
            </div>
          </div>

          {/* Link columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <div className="font-semibold mb-3 text-white">Platform</div>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/marketplace"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    HotelsVendors
                  </Link>
                </li>
                <li>
                  <Link
                    href="/marketplace"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    INVO Marketplace
                  </Link>
                </li>
                <li>
                  <Link
                    href="/sandbox"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    AI Agents
                  </Link>
                </li>
                <li>
                  <Link
                    href="/factoring-service"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    Reverse Factoring
                  </Link>
                </li>
                <li>
                  <Link
                    href="/financing/oliv"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    Oliv Financing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/suppliers/join"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    For Suppliers
                  </Link>
                </li>
                <li>
                  <Link
                    href="/hotels/join"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    For Hotels
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compliance"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3 text-white">Company</div>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/about"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <span className="text-white/45">Blog</span>
                </li>
                <li>
                  <span className="text-white/45">Careers</span>
                </li>
                <li>
                  <span className="text-white/45">Press</span>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold mb-3 text-white">Legal</div>
              <ul className="flex flex-col gap-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    Security
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compliance"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    ETA Compliance
                  </Link>
                </li>
                <li>
                  <Link
                    href="/compliance"
                    className="text-white/45 hover:text-white transition-colors"
                  >
                    FRA Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t text-xs text-white/30"
          style={{ borderColor: "#39ff7e15" }}
        >
          <span>&copy; {new Date().getFullYear()} HotelsVendors Inc. All rights reserved.</span>
          <span className="flex items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#39ff7e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            ETA &middot; FRA &middot; AML/KYC Compliant &middot; Payments via PCI-DSS partners (Oliv, Paymob)
          </span>
        </div>
      </div>
    </footer>
  );
}
