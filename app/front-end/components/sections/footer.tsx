"use client";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="px-8 pt-16 pb-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/front-end" className="flex items-center gap-3 no-underline text-white mb-3">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <path d="M8 26L9.5 22L11 17L10 14L12 9L15 7L17 5L19 4L20 6L18 8L19 9L24 8L23 11L19 12L18 15L20 22L22 26" stroke="#8cff2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <circle cx="22" cy="10" r="1" fill="#8cff2e" />
              </svg>
              <span className="font-bold text-[15px] tracking-tight">
                Hotels<span className="text-[#8cff2e]">Vendors</span>
              </span>
            </Link>
            <p className="text-[14px] leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
              B2B procurement platform for the Egyptian hospitality industry. Smarter Together.
            </p>
          </div>
          <div>
            <h5 className="text-[12px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>Platform</h5>
            <a href="#platform" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>Features</a>
            <a href="#hotels" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>For Hotels</a>
            <a href="#suppliers" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>For Suppliers</a>
            <a href="#pricing" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>Pricing</a>
            <a href="#" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>ETA Compliance</a>
          </div>
          <div>
            <h5 className="text-[12px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>Company</h5>
            <a href="#" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>About</a>
            <a href="#" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>Blog</a>
            <a href="#" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>Careers</a>
            <a href="#" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>Contact</a>
          </div>
          <div>
            <h5 className="text-[12px] font-bold uppercase tracking-[0.1em] mb-4" style={{ color: "rgba(255,255,255,0.45)" }}>Legal</h5>
            <a href="#" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>Privacy Policy</a>
            <a href="#" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>Terms of Service</a>
            <a href="#" className="block text-[14px] mb-2 no-underline" style={{ color: "rgba(255,255,255,0.65)" }}>Cookie Policy</a>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <span className="text-[13px]" style={{ color: "rgba(255,255,255,0.45)" }}>© 2026 HotelsVendors. All rights reserved.</span>
          <span className="text-[13px] mt-2 md:mt-0" style={{ color: "rgba(255,255,255,0.45)" }}>Built for Egyptian hospitality. Smarter Together.</span>
        </div>
      </div>
    </footer>
  );
}
