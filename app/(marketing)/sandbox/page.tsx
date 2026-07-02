"use client";

import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { ProxyTaxEngine } from "@/components/sandbox/ProxyTaxEngine";
import { BudgetHealth } from "@/components/sandbox/BudgetHealth";
import { MultiTierTerms } from "@/components/sandbox/MultiTierTerms";
import { PwaInstall } from "@/components/sandbox/PwaInstall";

export default function SandboxPage() {
  return (
    <main className="min-h-screen" style={{ background: "#0f100e" }}>
      <MarketingNav />

      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] rounded-full blur-[200px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(140,108,44,0.06) 0%, transparent 70%)" }} />

        <div className="relative z-10 mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <p className="bento-label mb-3">INTERACTIVE SANDBOX</p>
            <h1 className="text-2xl md:text-3xl font-medium text-[#ffffff] tracking-tight">
              Test Your Procurement Workflow
            </h1>
            <p className="text-[#9a9696] text-sm md:text-base mt-2 max-w-xl mx-auto font-light">
              Adjust parameters in real time. No sign-up required.
              Each widget reflects live logic from the platform engine.
            </p>
          </div>

          <div className="bento-grid">
            <div className="bento-cell">
              <div className="bento-inner">
                <ProxyTaxEngine />
              </div>
            </div>
            <div className="bento-cell">
              <div className="bento-inner">
                <BudgetHealth />
              </div>
            </div>
            <div className="bento-cell">
              <div className="bento-inner">
                <MultiTierTerms />
              </div>
            </div>
            <div className="bento-cell">
              <div className="bento-inner">
                <PwaInstall />
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
