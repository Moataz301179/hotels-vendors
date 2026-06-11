import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  MapPin,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { OurClientsSection } from "@/components/marketing/our-clients";

export const metadata: Metadata = {
  title: "Partner Hotels — Hotels Vendors",
  description:
    "52+ hotels across Egypt trust Hotels Vendors for procurement. From luxury Nile-front properties to coastal Red Sea resorts.",
};

const STATS = [
  { value: "52+", label: "Properties", icon: Building2 },
  { value: "12", label: "Governorates", icon: MapPin },
  { value: "98%", label: "On-Time Delivery", icon: Clock },
  { value: "35%", label: "Avg. Cost Savings", icon: TrendingUp },
];

const BENEFITS = [
  "AI-sourced suppliers matched to your property's spend profile",
  "ETA-compliant e-invoicing generated automatically for every PO",
  "Multi-property dashboards with real-time spend analytics",
  "Approval chains enforced server-side — no overrides, no exceptions",
  "Embedded invoice factoring for flexible cashflow management",
  "Shared-route logistics cutting delivery costs across clusters",
];

export default function HotelsPage() {
  return (
    <main className="min-h-screen bg-black">
      <MarketingNav />

      {/* Hero */}
      <section className="relative pt-36 pb-20">
        <div className="absolute top-20 right-1/4 w-[500px] h-[500px] bg-[#8B0000]/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/70 text-[11px] font-medium uppercase tracking-[0.15em] mb-6">
              <Building2 className="w-3 h-3" />
              Partner Network
            </div>
            <h1 className="text-[32px] md:text-[48px] font-medium text-white leading-[1.05] tracking-[-0.02em]">
              52+ Properties Across
              <br />
              <span className="text-white/30">Egypt Running on One Platform.</span>
            </h1>
            <p className="mt-6 text-[16px] text-white/40 leading-relaxed max-w-xl">
              From luxury Red Sea resorts to Nile-front heritage properties, Egypt&apos;s leading hotels procurement, invoice, and pay through Hotels Vendors.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/register?role=hotel"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#8B0000] hover:bg-[#a50000] text-white text-[14px] font-medium rounded-xl transition-colors"
              >
                Register Your Hotel
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/solutions"
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/[0.08] text-white/50 text-[14px] font-medium rounded-xl hover:bg-white/[0.04] transition-colors"
              >
                Explore Solutions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="w-5 h-5 text-[#D4A843]/30 mx-auto mb-2" />
                <div className="text-[26px] md:text-[32px] font-medium text-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-[11px] text-white/25 uppercase tracking-wide mt-1">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Clients Section */}
      <OurClientsSection />

      {/* Benefits */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="label-upper mb-4">Why Hotels Choose Us</p>
              <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] leading-tight tracking-tight text-white">
                A procurement operating system,
                <br />
                <span className="text-white/30">not just a marketplace.</span>
              </h2>
              <p className="mt-5 text-[15px] text-white/35 leading-relaxed">
                Hotels Vendors replaces fragmented procurement workflows — WhatsApp orders,
                manual invoices, invisible approvals — with a unified platform that enforces
                compliance, optimizes spend, and gives you full control.
              </p>
            </div>
            <div className="space-y-3">
              {BENEFITS.map((b) => (
                <div
                  key={b}
                  className="flex items-start gap-3 p-4 rounded-xl bg-[#0a0a0a] border border-white/[0.06]"
                >
                  <CheckCircle2 className="w-5 h-5 text-white/15 shrink-0 mt-0.5" />
                  <p className="text-[14px] text-white/45 leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-[#0a0a0a] border border-white/[0.06] p-12 md:p-16">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#D4A843]/[0.03] rounded-full blur-[120px] pointer-events-none" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
              <div>
                <ShieldCheck className="w-10 h-10 text-[#D4A843]/20 mb-6" />
                <h3 className="text-[24px] md:text-[30px] font-medium text-white tracking-tight">
                  Ready to digitize your
                  <br />
                  procurement workflow?
                </h3>
                <p className="mt-4 text-[14px] text-white/35 leading-relaxed">
                  Get set up in under 10 minutes. Import your supplier list, configure
                  approval chains, and start issuing ETA-compliant purchase orders from day one.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
                <Link
                  href="/register?role=hotel"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#8B0000] hover:bg-[#a50000] text-white text-[14px] font-medium rounded-xl transition-colors"
                >
                  Register Your Hotel
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/become-supplier"
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 border border-white/[0.08] text-white/50 text-[14px] font-medium rounded-xl hover:bg-white/[0.04] transition-colors"
                >
                  Join as Supplier
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}
