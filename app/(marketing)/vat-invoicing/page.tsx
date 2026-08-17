"use client";

import Link from "next/link";
import { FileCheck, Shield, Clock, AlertCircle, ArrowRight, CheckCircle2, Zap, Building2, Globe } from "lucide-react";

const features = [
  { icon: Zap, color: "#39ff7e", title: "Real-Time Submission", desc: "Invoices submitted to the Egyptian Tax Authority the moment they are issued." },
  { icon: Shield, color: "#c455ff", title: "Digital Signing", desc: "All payloads digitally signed with your company's ETA credentials. Tamper-proof and audit-ready." },
  { icon: Clock, color: "#ff7e1a", title: "Dead-Letter Retry", desc: "Failed submissions automatically retry with exponential backoff." },
  { icon: FileCheck, color: "#64b5f6", title: "UUID & Serial Tracking", desc: "Every invoice gets a unique ETA UUID and serial number. Full traceability." },
];

const compliance = [
  "ETA API v2.0 compliant", "Digital signature (XML-DSig)", "UUID generation per invoice",
  "Real-time status polling", "Dead-letter queue with retry", "Immutable audit log",
  "Multi-tenant isolation", "JSON-LD structured data",
];

export default function VatInvoicingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-24 pb-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[#c455ff]/[0.04] blur-[120px]" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(196,85,255,0.15)] bg-[rgba(196,85,255,0.05)] px-4 py-1.5 text-[12px] text-[#c455ff]/80">
            <FileCheck className="h-3.5 w-3.5" />ETA E-Invoicing Engine
          </div>
          <h1 className="mx-auto max-w-3xl text-[clamp(2rem,4.5vw,3.5rem)] font-semibold leading-[1.1] tracking-tight text-white" style={{ fontFamily: "var(--font-display)" }}>
            Compliance, <span className="text-[#c455ff]">automated.</span><br />Zero manual tax work.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[15px] text-white/40">HotelsVendors integrates directly with the Egyptian Tax Authority API. Every invoice is digitally signed, UUID-tracked, and submitted in real time.</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/register" className="btn-accent !px-8 !py-3 !text-[14px]">Enable ETA Invoicing<ArrowRight className="h-4 w-4" /></Link>
            <Link href="/contact" className="btn-ghost !px-8 !py-3 !text-[14px]">View Documentation</Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-[clamp(1.5rem,3vw,2.2rem)] font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>How ETA E-Invoicing Works</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div key={f.title} className="surface-card neon-card p-6">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg" style={{ backgroundColor: `${f.color}10` }}><f.icon className="h-5 w-5" style={{ color: f.color }} /></div>
                <h3 className="text-[15px] font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-[13px] leading-relaxed text-white/40">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-12">
            <h2 className="mb-8 text-center text-[22px] font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>Full ETA Compliance Checklist</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {compliance.map((c) => (
                <div key={c} className="flex items-center gap-3 rounded-lg bg-white/[0.02] px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-[#39ff7e]" />
                  <span className="text-[13px] text-white/60">{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 md:p-10">
            <h3 className="text-[18px] font-semibold text-white mb-4" style={{ fontFamily: "var(--font-display)" }}>Invisible by Design</h3>
            <p className="text-[14px] text-white/40 leading-relaxed mb-6">The ETA bridge runs entirely in the background. No UI routes, no client-side code, no exposed API keys. Invoice lifecycle events trigger submissions automatically.</p>
            <div className="grid gap-4 sm:grid-cols-3 text-center">
              <div className="rounded-lg bg-white/[0.03] p-4">
                <Building2 className="h-5 w-5 mx-auto mb-2 text-[#39ff7e]/60" />
                <p className="text-[12px] font-medium text-white/50">Zero UI Routes</p>
                <p className="text-[11px] text-white/25 mt-1">Pure background service</p>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-4">
                <Globe className="h-5 w-5 mx-auto mb-2 text-[#c455ff]/60" />
                <p className="text-[12px] font-medium text-white/50">Event-Driven</p>
                <p className="text-[11px] text-white/25 mt-1">Triggers on invoice.status = ISSUED</p>
              </div>
              <div className="rounded-lg bg-white/[0.03] p-4">
                <AlertCircle className="h-5 w-5 mx-auto mb-2 text-[#ff7e1a]/60" />
                <p className="text-[12px] font-medium text-white/50">Dead-Letter Queue</p>
                <p className="text-[11px] text-white/25 mt-1">Auto-retry + manual resolution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.04] py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-[clamp(1.6rem,3.5vw,2.5rem)] font-semibold text-white tracking-tight" style={{ fontFamily: "var(--font-display)" }}>Stay compliant. Stay automated.</h2>
          <p className="mt-4 text-[14px] text-white/40">Every invoice submitted to ETA. Every time. No exceptions.</p>
          <div className="mt-8"><Link href="/register" className="btn-accent !px-10 !py-3.5 !text-[15px]">Get Started<ArrowRight className="h-4 w-4" /></Link></div>
        </div>
      </section>
    </>
  );
}
