import type { Metadata } from "next";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { OurClientsSection } from "@/components/marketing/our-clients";

export const metadata: Metadata = {
  title: "Partner Hotels — Hotels Vendors",
  description:
    "52+ hotels across Egypt trust Hotels Vendors for procurement. From luxury Nile-front properties to coastal Red Sea resorts.",
};

export default function HotelsPage() {
  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      <div className="pt-[140px] pb-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-[11px] font-semibold text-white/60 tracking-[0.18em] uppercase mb-3">
              Partner Network
            </p>
            <h1 className="text-[28px] md:text-[36px] font-bold text-white tracking-[-0.02em]">
              Hotels Operating on Our Platform
            </h1>
            <p className="mt-2 text-[14px] text-gray-400 max-w-lg">
              52+ properties across 12 governorates — from luxury resorts on the Red Sea
              to heritage properties on the Nile. All connected to verified Egyptian suppliers.
            </p>
          </div>
        </div>
      </div>

      <OurClientsSection />

      <MarketingFooter />
    </main>
  );
}
