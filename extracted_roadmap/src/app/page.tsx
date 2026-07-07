import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Building2,
  Truck,
  Landmark,
  FileCheck2,
  BrainCircuit,
  ClipboardCheck,
  ReceiptText,
  Wallet,
  ShieldCheck,
  Lock,
  Sparkles,
  Boxes,
  Database,
  BarChart3,
  CreditCard,
  ArrowDownUp,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import { SiteNav } from "@/components/marketing/site-nav";
import { SiteFooter } from "@/components/marketing/site-footer";
import { WaitlistForm } from "@/components/marketing/waitlist-form";
import { HeroWorkflowCarousel } from "@/components/marketing/hero-workflow-carousel";
import { Badge, Btn } from "@/components/ui";

export default function Home() {
  return (
    <div className="min-h-screen bg-bg text-fg">
      <SiteNav />

      {/* ── HERO ── */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <Image
            src="/images/hero-hotel.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg/80 via-bg/70 to-bg" />
        </div>
        <div className="relative mx-auto max-w-7xl px-5 lg:px-8 grid gap-12 lg:grid-cols-[1fr_0.95fr] items-center">
          <div>
            <Badge tone="lime" className="mb-5">Dual-layer hospitality infrastructure</Badge>
            <h1 className="text-[34px] sm:text-[42px] lg:text-[48px] font-semibold leading-[1.05] tracking-[-0.02em]">
              The operating system for
              <br />
              <span className="text-lime">Egyptian hospitality procurement</span>
              <br />
              <span className="text-gold">& embedded finance.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base lg:text-lg leading-relaxed text-fg-2">
              Two layers. One workflow.
              <br />
              <strong className="text-fg">INVO</strong> — the transactional layer where hotels, suppliers and carriers execute orders, GRN and ETA invoices.
              <br />
              <strong className="text-fg">Capital Layer</strong> — the secured orchestration rail for payments, funders, compliance, AI credit scoring and data.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Btn href="/register" size="lg">Request Access <ArrowRight className="h-4 w-4" /></Btn>
              <Btn href="/login" size="lg" variant="secondary">Enter Sandbox</Btn>
              <Btn href="#ai-demo" size="lg" variant="ghost"><MessageSquare className="h-4 w-4 text-lime" /> AI assistant demo</Btn>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-fg-4">
              {["ETA Phase 1 & 2", "FRA-ready factoring file", "Role-based audit trail", "24h supplier payout"].map((x) => (
                <span key={x} className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-lime" />{x}</span>
              ))}
            </div>
          </div>
          <HeroWorkflowCarousel />
        </div>
      </section>

      {/* ── DUAL LAYER DIAGRAM ── */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 pb-16">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* INVO Layer */}
          <div className="group relative rounded-3xl border border-border bg-bg-1 p-8 transition hover:-translate-y-1 hover:border-lime/30 duration-500 overflow-hidden">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-lime/5 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lime-dim text-lime">
                  <ReceiptText className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">INVO</h2>
                  <p className="text-xs uppercase tracking-widest text-fg-4">Transactional Layer</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-fg-2">
                The procurement operating layer where the work happens. Purchase orders, GRN, ETA invoices, logistics, supplier catalogs, and AI procurement orchestration.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: Boxes, label: "Marketplace" },
                  { icon: ClipboardCheck, label: "GRN & Receiving" },
                  { icon: Truck, label: "Carrier Dispatch" },
                  { icon: FileCheck2, label: "ETA e-Invoicing" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5 rounded-xl border border-border bg-bg p-3.5 text-sm transition group-hover:border-lime/30">
                    <f.icon className="h-4 w-4 text-lime" />
                    {f.label}
                  </div>
                ))}
              </div>
              <div className="mt-6 relative h-44 overflow-hidden rounded-2xl border border-border">
                <Image src="/images/invo-mockup.jpg" alt="" fill sizes="300px" className="object-cover object-top opacity-90 transition group-hover:scale-[1.03] duration-700" />
              </div>
            </div>
          </div>

          {/* Capital Layer */}
          <div className="group relative rounded-3xl border border-gold/20 bg-bg-1 p-8 transition hover:-translate-y-1 hover:border-gold/40 duration-500 overflow-hidden">
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/5 blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-3 mb-6">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-dim text-gold">
                  <Landmark className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight">HV Capital</h2>
                  <p className="text-xs uppercase tracking-widest text-fg-4">Orchestration Layer</p>
                </div>
              </div>
              <p className="text-sm leading-relaxed text-fg-2">
                The secured fintech rail. Payment orchestration, reverse factoring, risk scoring, funder desk, compliance vault and AI underwriting — everything the INVO layer calls but never exposes raw.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {[
                  { icon: CreditCard, label: "Payment Orchestration" },
                  { icon: Wallet, label: "Reverse Factoring" },
                  { icon: BarChart3, label: "AI Credit Scoring" },
                  { icon: Lock, label: "Compliance Vault" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-2.5 rounded-xl border border-border bg-bg p-3.5 text-sm transition group-hover:border-gold/30">
                    <f.icon className="h-4 w-4 text-gold" />
                    {f.label}
                  </div>
                ))}
              </div>
              <div className="mt-6 relative h-44 overflow-hidden rounded-2xl border border-border">
                <Image src="/images/capital-layer.jpg" alt="" fill sizes="300px" className="object-cover object-center opacity-90 transition group-hover:scale-[1.03] duration-700" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT CHANGES ── */}
      <section className="border-y border-border bg-bg-1">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20 grid gap-10 lg:grid-cols-2 items-start">
          <div>
            <Badge tone="muted">Why two layers win</Badge>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Transactions never hold financial secrets. Finance never blocks commerce.
            </h2>
            <p className="mt-5 leading-relaxed text-fg-2">
              A single unified system mixes operational noise with financial risk. By separating INVO and HV Capital, hotels get clean operational UX, suppliers get rapid payouts, and QDB-grade investors see a secured, isolated data and capital layer.
            </p>
            <div className="mt-8 space-y-3">
              {[
                ["INVO stays fast", "Hotels and suppliers see only the workflow they need, no banking clutter."],
                ["Capital stays secure", "Payments, lending and compliance run in an isolated, audited rail."],
                ["AI can cross both", "Demand signals from INVO feed the credit model in the Capital layer instantly."],
                ["Funder-grade data", "Every financed receivable has immutable PO, GRN, ETA and settlement evidence."],
              ].map(([title, body]) => (
                <div key={title} className="flex gap-4 items-start rounded-2xl border border-border bg-bg p-5 hover:border-lime/30 transition">
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-lime-dim text-lime shrink-0"><Sparkles className="h-4 w-4" /></div>
                  <div>
                    <h3 className="font-medium text-fg">{title}</h3>
                    <p className="text-sm text-fg-3 leading-relaxed mt-0.5">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-3xl border border-border overflow-hidden relative h-56">
              <Image src="/images/supplier-warehouse.jpg" alt="Supplier warehouse" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 500px" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <Badge tone="lime">INVO layer</Badge>
                <h3 className="mt-2 text-lg font-semibold">Supplier fulfillment & carrier ops</h3>
                <p className="text-sm text-fg-2">Purchase execution with live tracking, POD and GRN.</p>
              </div>
            </div>
            <div className="rounded-3xl border border-gold/20 overflow-hidden relative h-56">
              <Image src="/images/funder-meeting.jpg" alt="Funder meeting" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 500px" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/80 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5">
                <Badge tone="gold">Capital layer</Badge>
                <h3 className="mt-2 text-lg font-semibold">Funder desk & risk engine</h3>
                <p className="text-sm text-fg-2">Every funded invoice scored against verifiable evidence.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── AI CHATBOT / CONTROL SPEND ── */}
      <section id="ai-demo" className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
        <div>
          <Badge tone="lime">AI Procurement Copilot</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Control spend before it happens — across both layers.
          </h2>
          <p className="mt-5 leading-relaxed text-fg-2 max-w-lg">
            The AI reads occupancy forecasts, PAR levels, supplier SLA history in INVO, and live credit and factoring pricing in the Capital layer. It doesn’t just warn you — it drafts the optimal PO, payment terms and funding request before your team lifts a finger.
          </p>
          <div className="mt-8 grid gap-3">
            {[
              { icon: BrainCircuit, t: "Proactive replenishment", d: "Generates draft POs before stockouts hit breakfast service." },
              { icon: ArrowDownUp, t: "Term optimization", d: "Chooses Net-0 vs Net-60 based on cashflow and factoring price." },
              { icon: Database, t: "Cross-layer signals", d: "Uses GRN variance + ETA history to rerank suppliers." },
              { icon: ShieldCheck, t: "Compliance guard", d: "Blocks orders missing KYC, tax profile, or credit headroom." },
            ].map((x) => (
              <div key={x.t} className="flex gap-3 items-start rounded-2xl border border-border bg-bg-1 p-5">
                <x.icon className="h-5 w-5 text-lime mt-0.5" />
                <div>
                  <h3 className="font-medium">{x.t}</h3>
                  <p className="text-sm text-fg-3 mt-0.5 leading-relaxed">{x.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-bg-1 p-6 shadow-lift">
          <div className="flex items-center gap-3 mb-4">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-lime text-bg"><Sparkles className="h-5 w-5" /></div>
            <div>
              <h3 className="font-semibold">HotelsVendors Copilot</h3>
              <p className="text-xs text-fg-4">Connected to INVO + Capital Layer in real time</p>
            </div>
          </div>
          <div className="space-y-3 max-h-[440px] overflow-y-auto pr-2">
            {[
              { who: "user", text: "We have a 280-room conference starting Thursday. Can we cover the dairy order?" },
              { who: "bot", text: "FreshFields has 28 cases available. I recommend ordering 32 (buffer +7%). Current ETA invoice compliance: valid. Net-60 factoring is priced at 2.1% — cheaper than drawing the facility. I’ve drafted the PO for approval." },
              { who: "user", text: "Approve and lock terms." },
              { who: "bot", text: "Approved. PO-7712 created on INVO, Net-60 selected, factoring request routed to Delta Capital on the Capital layer. Supplier paid in 24h, you settle in 60 days. GRN will trigger payment release." },
              { who: "user", text: "What about linens for Steigen?" },
              { who: "bot", text: "Cairo Linen House is 3% above their contracted rate. I flagged it and suggested a re-quote. Average GRN variance is 2.1% — within threshold. I can hold until they confirm price match." },
              { who: "user", text: "Hold and notify procurement." },
              { who: "bot", text: "Held. Alert sent. I’ll re-approve automatically once the contracted pricing is confirmed." },
            ].map((msg, i) => (
              <div key={i} className={`flex ${msg.who === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${msg.who === "user" ? "bg-lime text-bg rounded-br-sm" : "bg-bg-2 text-fg rounded-bl-sm border border-border"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-2xl border border-border bg-bg p-2.5">
            <input placeholder="Ask the copilot…" className="flex-1 bg-transparent text-sm outline-none px-2 placeholder:text-fg-4" />
            <button className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-lime text-bg px-3 text-sm font-semibold hover:bg-lime-light">
              Ask <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="mt-3 text-xs text-fg-4">Sandbox preview — the live copilot sits inside INVO and surfaces credit/funding decisions via the Capital layer.</p>
        </div>
      </section>

      {/* ── STAKEHOLDER GRID ── */}
      <section className="border-y border-border bg-bg-1">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-20">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Four stakeholders. Two layers. Zero friction.</h2>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Building2, title: "Hotels", text: "Buy confidently, control spend, preserve liquidity, keep ETA evidence matched automatically." },
              { icon: Boxes, title: "Suppliers", text: "List fixed-price SKUs, fulfill faster, get paid in 24h via reverse factoring without chasing AP." },
              { icon: Landmark, title: "Banks & funders", text: "Fund verified receivables backed by PO, GRN and ETA invoice — no blind SME credit." },
              { icon: Truck, title: "Carriers", text: "Accept structured routes, upload POD, and trigger settlement directly from the INVO layer." },
            ].map((r) => (
              <div key={r.title} className="bg-bg p-6 transition hover:bg-bg-1 duration-300 group">
                <r.icon className="h-6 w-6 text-lime" />
                <h3 className="mt-5 font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-3">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="mx-auto max-w-7xl px-5 lg:px-8 py-16 lg:py-24">
        <div className="grid gap-10 rounded-3xl border border-border-2 bg-bg-1 p-8 lg:p-12 lg:grid-cols-[1fr_0.9fr] items-center">
          <div>
            <Badge tone="gold">Sandbox ready</Badge>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Inspect both layers today.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-fg-2">
              Use the one-click sandbox entries to move between the INVO transactional desk and the Capital layer as hotel, supplier, funder or carrier. Any password works — demo data is restored automatically.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Btn href="/login">Open Sandbox <ArrowRight className="h-4 w-4" /></Btn>
              <Btn href="/register" variant="secondary">Request enterprise access</Btn>
            </div>
          </div>
          <div className="rounded-2xl border border-border bg-bg p-6">
            <WaitlistForm />
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
