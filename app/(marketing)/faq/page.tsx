import type { Metadata } from "next";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { FAQSection } from "@/components/marketing/faq-section";

export const metadata: Metadata = {
  title: "FAQ — HotelsVendors | Egypt's B2B Hospitality Procurement Platform",
  description: "Frequently asked questions about HotelsVendors — onboarding, ETA compliance, supplier settlement, factoring, and how the platform works for hotels in Egypt.",
  keywords: ["HotelsVendors FAQ", "Egypt hotel procurement", "ETA e-invoicing questions", "B2B hospitality platform Egypt", "reverse factoring hotels"],
};

export default function FAQPage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <MarketingNav />

      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(255,176,0,0.04) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">FAQ</span>
          <h1 className="text-[clamp(28px,4vw,44px)] font-medium leading-[1.05] tracking-tight mb-4 text-white">
            Frequently Asked Questions
          </h1>
          <p className="text-[14px] text-white/40 max-w-xl mx-auto leading-relaxed" dir="rtl">
            الأسئلة الشائعة، كل ما تحتاج معرفته عن منصة هوتيلز فيندورز
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-4xl px-6">
          <FAQSection />
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
