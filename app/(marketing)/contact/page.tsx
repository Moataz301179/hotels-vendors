import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bot, ShieldCheck, Zap, Network } from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "AI Onboarding — HotelsVendors Egypt",
  description: "Fully autonomous tenant provisioning via AI swarm agents. No sales calls, no waitlists — deploy in seconds.",
};

export default function ContactPage() {
  return (
    <main className="marketing-main min-h-screen" style={{ fontFamily: "var(--font-sans)" }}>
      <MarketingNav />

      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent-muted) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
          <span className="text-[11px] font-medium text-foreground-muted uppercase tracking-[0.15em] mb-3 block">Zero Human Touch</span>
          <h1 className="text-[clamp(28px,5vw,44px)] font-semibold leading-[1.05] tracking-tight mb-5 text-foreground" style={{ fontFamily: "var(--font-sans)" }}>
            AI-Powered<br />Tenant Onboarding.
          </h1>
          <p className="text-[15px] text-foreground-secondary max-w-2xl mx-auto leading-relaxed">
            No sales calls. No waitlists. Our 4-agent swarm auto-qualifies your portfolio, provisions your tenant, and sends credentials — all in under 30 seconds.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-10">
          {/* AI Agent form */}
          <div className="surface-card rounded-2xl p-8">
            <div className="flex items-center gap-2 mb-6">
              <Bot size={18} style={{ color: "var(--accent-base)" }} />
              <h2 className="text-[18px] font-semibold text-foreground">Swarm Qualification</h2>
            </div>
            <ContactForm />
          </div>

          {/* Agent pipeline info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-[14px] font-semibold mb-4 text-foreground">4-Agent Pipeline</h3>
              <div className="space-y-3">
                {[
                  { icon: Bot, label: "Ingestion", desc: "Parse submission and validate inputs", color: "var(--accent-base)" },
                  { icon: ShieldCheck, label: "Compliance", desc: "ETA compliance and fraud checks", color: "var(--success)" },
                  { icon: Zap, label: "Sign-off", desc: "Portfolio scoring and credit decision", color: "#F59E0B" },
                  { icon: Network, label: "Routing", desc: "Tenant provisioning + credential dispatch", color: "#3B82F6" },
                ].map((agent) => (
                  <div key={agent.label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "var(--accent-muted)" }}>
                      <agent.icon size={16} style={{ color: agent.color }} />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{agent.label}</p>
                      <p className="text-[12px] text-secondary">{agent.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="surface-card rounded-xl p-5">
              <h3 className="text-[13px] font-semibold mb-3 text-foreground">Autonomous by default</h3>
              <ul className="space-y-2">
                {[
                  "No human sales involvement — AI agents handle everything",
                  "Self-serve provisioning in under 30 seconds",
                  "Dynamic plan matching based on portfolio size",
                  "Credentials delivered to your inbox immediately",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-[12px] text-secondary">
                    <Zap size={13} className="flex-shrink-0 mt-0.5" style={{ color: "var(--accent-base)" }} />
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
