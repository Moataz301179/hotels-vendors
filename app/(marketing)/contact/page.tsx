import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Mail, Phone, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Sales — HotelsVendors Egypt",
  description: "Talk to our team about enterprise procurement, factoring lines, and custom integrations for your hotel chain.",
};

export default function ContactPage() {
  return (
    <main className="marketing-main min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <MarketingNav />

      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-muted) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-[0.15em] mb-3 block">Enterprise Sales</span>
          <h1 className="text-[clamp(28px,5vw,44px)] font-semibold leading-[1.05] tracking-tight mb-5 text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
            Let&apos;s Talk About<br />Your Portfolio.
          </h1>
          <p className="text-[15px] text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
            Whether you manage 3 resorts or 30, we&apos;ll build a subscription plan that fits your size, volume, and factoring needs. Talk to a real operator — no chatbots, no call centers.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-10">
          {/* Form card */}
          <div className="surface-card rounded-2xl p-8">
            <h2 className="text-[18px] font-semibold mb-6 text-foreground">Request a Demo</h2>
            <ContactForm />
          </div>

          {/* Contact info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-[14px] font-semibold mb-4 text-foreground">Direct Contact</h3>
              <div className="space-y-3">
                {[
                  { icon: Mail, label: "Email", value: "sales@hotelsvendors.com" },
                  { icon: Phone, label: "Phone", value: "+20 100 000 0000" },
                  { icon: MapPin, label: "Office", value: "Cairo, Egypt" },
                  { icon: Clock, label: "Response", value: "Within 4 business hours" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ backgroundColor: "var(--accent-muted)" }}>
                      <item.icon size={16} style={{ color: "var(--accent-base)" }} />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-wider">{item.label}</p>
                      <p className="text-[13px] text-foreground">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card rounded-xl p-5">
              <h3 className="text-[13px] font-semibold mb-3 text-foreground">What happens next?</h3>
              <ul className="space-y-2">
                {[
                  "We review your property portfolio and volume",
                  "You get a tailored subscription proposal within 24h",
                  "Optional: live demo with your team (30 min)",
                  "No commitment, no credit card required",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12px] text-secondary">
                    <CheckCircle2 size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--success)" }} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 text-center">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-[13px] text-muted mb-4">Prefer to explore first?</p>
          <Link href="/platform" className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--accent-base)] hover:underline">
            See How It Works <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}

