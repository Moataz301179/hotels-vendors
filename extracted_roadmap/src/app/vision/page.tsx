import type { Metadata } from "next";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Btn, Badge } from "@/components/ui";
import { ArrowRight, CheckCircle2, ShieldAlert, Target, Swords } from "lucide-react";

export const metadata: Metadata = { title: "Investor Thesis & Market Analysis" };

const swot = [
  { title: "Strengths", tone: "lime", icon: CheckCircle2, items: ["Data-native underwriting from real transaction flow", "Multi-sided network with compounding lock-in", "Egypt-native payment rails (InstaPay, Fawry, Paymob)", "Enterprise security posture from day one"] },
  { title: "Weaknesses", tone: "yellow", icon: ShieldAlert, items: ["Capital-intensive to seed the lending book", "Two-sided cold-start", "Regulatory dependency on CBE licensing"] },
  { title: "Opportunities", tone: "blue", icon: Target, items: ["EGP 2T+ tourism economy digitising post-2024 reforms", "SME credit gap banks structurally cannot serve", "Tourism national targets: 30M visitors by 2028", "Regional expansion: GCC & North Africa"] },
  { title: "Threats", tone: "red", icon: Swords, items: ["FX volatility affecting import-heavy suppliers", "Incumbent banks launching SME BNPL", "Global B2B marketplaces entering MENA"] },
];

const roadmap = [
  { phase: "Q1 · Foundation", status: "Now", items: ["Pilot 25 hotels + 40 suppliers in Cairo & Red Sea", "Paymob + InstaPay live", "First EGP 10M financed"] },
  { phase: "Q2 · Capital engine", status: "Next", items: ["Onboard 2 anchor funders", "Automated risk scoring v2", "Factoring product GA"] },
  { phase: "Q3 · Scale", status: "Planned", items: ["300+ suppliers, 150+ hotels", "Managed logistics network", "Mobile PWA"] },
  { phase: "Q4 · Defensible", status: "Planned", items: ["Insurance-wrapped receivables", "Treasury analytics suite", "GCC expansion pilot"] },
];

export default function VisionPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <section className="pt-28 pb-10">
        <div className="max-w-4xl mx-auto px-5 lg:px-8 py-20 text-center">
          <Badge tone="lime">Investor thesis</Badge>
          <h1 className="mt-5 text-4xl sm:text-5xl font-semibold tracking-tight">Why HotelsVendors wins Egypt&apos;s hospitality economy.</h1>
          <p className="mt-5 text-lg text-fg-2 max-w-2xl mx-auto">A category-defining opportunity at the intersection of a trillion-pound market, a structural SME credit gap, and a once-in-a-decade timing window.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Btn href="/register">Talk to founders <ArrowRight className="h-4 w-4" /></Btn>
            <Btn href="#roadmap" variant="secondary">View roadmap</Btn>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[{ v: "EGP 2.1T", l: "Addressable hospitality spend" }, { v: "EGP 210B", l: "Serviceable market (SAM)" }, { v: "EGP 6.5B", l: "3-year obtainable (SOM)" }, { v: "30M", l: "Egypt visitor target 2028" }].map((m) => (
            <div key={m.l} className="rounded-xl border border-border bg-bg-1 p-6">
              <p className="text-3xl font-semibold text-lime">{m.v}</p>
              <p className="mt-2 text-sm text-fg-3">{m.l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-bg-1">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
          <h2 className="text-2xl font-semibold mb-8">SWOT analysis</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {swot.map((s) => (
              <div key={s.title} className="rounded-xl border border-border bg-bg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <s.icon className="h-4 w-4" />
                  <h3 className="font-medium">{s.title}</h3>
                  <Badge tone={s.tone} className="ml-auto">{s.items.length}</Badge>
                </div>
                <ul className="space-y-2">
                  {s.items.map((it) => (
                    <li key={it} className="flex gap-2 text-sm text-fg-3"><span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-lime" />{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="roadmap" className="max-w-7xl mx-auto px-5 lg:px-8 py-16">
        <h2 className="text-2xl font-semibold mb-8">12-month roadmap</h2>
        <div className="grid gap-4 lg:grid-cols-4">
          {roadmap.map((r, i) => (
            <div key={r.phase} className="rounded-xl border border-border bg-bg-1 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-lime-dim text-lime text-sm font-medium">{i + 1}</span>
                <Badge tone={i === 0 ? "lime" : "muted"}>{r.status}</Badge>
              </div>
              <h3 className="font-medium">{r.phase}</h3>
              <ul className="mt-3 space-y-2">
                {r.items.map((it) => (
                  <li key={it} className="flex gap-2 text-sm text-fg-3"><CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-lime" />{it}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
