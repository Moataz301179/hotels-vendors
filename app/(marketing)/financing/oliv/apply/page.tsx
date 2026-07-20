"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle, Shield, Zap, Landmark } from "lucide-react";
import { OlivLogo } from "@/components/partners/oliv-logo";

const OLIV = {
  code: "CHV000",
  url: "https://oliv.finance/#register",
  minRevenue: "10M",
} as const;

export default function OlivApplyPage() {
  const [etaUuid, setEtaUuid] = useState<boolean | null>(null);
  const [revenue, setRevenue] = useState<boolean | null>(null);
  const [qualified, setQualified] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const bothAnswered = etaUuid !== null && revenue !== null;

  const check = () => {
    setQualified(etaUuid === true && revenue === true);
  };

  const submitLead = async () => {
    setSubmitting(true);
    try {
      await fetch("/api/v1/referrals/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: "Lead from landing page",
          taxUuid: etaUuid ? "PROVIDED" : "NOT_PROVIDED",
          contactName: "Landing Page Lead",
          contactEmail: email || "no-email@lead.com",
          qualified,
          revenueCheck: revenue,
          etaCheck: etaUuid,
          yearsCheck: true, // not asked — assume yes for Phase 1
        }),
      });
    } catch {}
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <main style={{ backgroundColor: "#0c0c12", color: "#ffffff", minHeight: "100vh" }}>
      {/* Hero */}
      <section className="pt-16 pb-8 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(74,124,89,0.08) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border mb-5"
            style={{ borderColor: "#4A7C5933", backgroundColor: "#4A7C5910" }}
          >
            <Zap size={12} style={{ color: "#4A7C59" }} />
            <span className="text-[11px] font-medium uppercase tracking-[0.12em]" style={{ color: "#4A7C59" }}>
              Pre-Qualify in 30 Seconds
            </span>
          </div>
          <h1 className="text-[clamp(28px,5vw,44px)] font-semibold leading-[1.1] tracking-tight mb-4">
            Funded in 48 Hours.
            <br />
            <span style={{ color: "#4A7C59" }}>Up to EGP {OLIV.minRevenue}.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-md mx-auto leading-relaxed mb-2">
            Answer 2 questions. If you qualify, register on HotelsVendors and get instant access to your credit dashboard.
          </p>
          <p className="text-[12px] text-white/20">
            Powered by Oliv — Egypt&apos;s first FRA-licensed digital factoring platform
          </p>
        </div>
      </section>

      {/* Questions */}
      <section className="pb-12">
        <div className="max-w-lg mx-auto px-6 space-y-4">
          {/* Q1: ETA UUID */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[13px] font-bold" style={{ backgroundColor: "#4A7C5915", color: "#4A7C59" }}>1</div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-white mb-1">Do you have an ETA Tax UUID token?</h3>
                <p className="text-[12px] text-white/30 mb-3">Your company is registered with the Egyptian Tax Authority and has a valid UUID.</p>
                <div className="flex gap-2">
                  <button onClick={() => setEtaUuid(true)} className={`px-5 py-2.5 rounded-lg text-[12px] font-medium transition-all ${etaUuid === true ? "text-white" : "text-white/50 hover:text-white/80"}`}
                    style={etaUuid === true ? { backgroundColor: "#4A7C5980", border: "1px solid #4A7C59" } : { backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <CheckCircle2 size={14} className="inline mr-1.5" />Yes, I have ETA UUID
                  </button>
                  <button onClick={() => setEtaUuid(false)} className={`px-5 py-2.5 rounded-lg text-[12px] font-medium transition-all ${etaUuid === false ? "text-white" : "text-white/50 hover:text-white/80"}`}
                    style={etaUuid === false ? { backgroundColor: "#ef444440", border: "1px solid #ef4444" } : { backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <XCircle size={14} className="inline mr-1.5" />Not yet
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Q2: Revenue */}
          <div className="rounded-2xl border border-white/[0.06] bg-[#12121a] p-6">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-[13px] font-bold" style={{ backgroundColor: "#4A7C5915", color: "#4A7C59" }}>2</div>
              <div className="flex-1">
                <h3 className="text-[14px] font-semibold text-white mb-1">Annual revenue EGP {OLIV.minRevenue} or above?</h3>
                <p className="text-[12px] text-white/30 mb-3">Your company&apos;s revenue for the last fiscal year meets Oliv&apos;s threshold.</p>
                <div className="flex gap-2">
                  <button onClick={() => setRevenue(true)} className={`px-5 py-2.5 rounded-lg text-[12px] font-medium transition-all ${revenue === true ? "text-white" : "text-white/50 hover:text-white/80"}`}
                    style={revenue === true ? { backgroundColor: "#4A7C5980", border: "1px solid #4A7C59" } : { backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <CheckCircle2 size={14} className="inline mr-1.5" />Yes, EGP {OLIV.minRevenue}+
                  </button>
                  <button onClick={() => setRevenue(false)} className={`px-5 py-2.5 rounded-lg text-[12px] font-medium transition-all ${revenue === false ? "text-white" : "text-white/50 hover:text-white/80"}`}
                    style={revenue === false ? { backgroundColor: "#ef444440", border: "1px solid #ef4444" } : { backgroundColor: "transparent", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <XCircle size={14} className="inline mr-1.5" />Less than EGP {OLIV.minRevenue}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Check button */}
          {bothAnswered && qualified === null && (
            <button onClick={check} className="w-full py-3.5 rounded-xl text-[14px] font-semibold transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)]" style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
              Check My Qualification <ArrowRight size={16} className="inline ml-2" />
            </button>
          )}
        </div>
      </section>

      {/* RESULT: Qualified → Register on HotelsVendors */}
      {qualified === true && !submitted && (
        <section className="pb-16">
          <div className="max-w-lg mx-auto px-6">
            <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "#4A7C5940", backgroundColor: "#4A7C5908" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#4A7C5920" }}>
                <CheckCircle2 size={32} style={{ color: "#4A7C59" }} />
              </div>
              <h2 className="text-[22px] font-semibold text-white mb-2">You&apos;re Pre-Qualified!</h2>
              <p className="text-[13px] text-white/40 mb-6 max-w-sm mx-auto leading-relaxed">
                Your business meets Oliv&apos;s criteria. Register on HotelsVendors to access your credit dashboard and get referred to Oliv with priority processing.
              </p>

              {/* Steps */}
              <div className="text-left space-y-3 mb-6">
                {[
                  { num: "1", text: "Register on HotelsVendors", sub: "Create your account in under 2 minutes" },
                  { num: "2", text: "Access your credit dashboard", sub: "See your pre-qualified credit limit instantly" },
                  { num: "3", text: "Get referred to Oliv", sub: "We route you to Oliv with referral code CHV000 for priority onboarding" },
                ].map((s) => (
                  <div key={s.num} className="flex gap-3 items-start">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-[11px] font-bold" style={{ backgroundColor: "#4A7C5920", color: "#4A7C59" }}>{s.num}</div>
                    <div>
                      <div className="text-[13px] font-medium text-white">{s.text}</div>
                      <div className="text-[11px] text-white/30">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Email capture */}
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email (optional)"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[13px] text-white placeholder:text-white/20 mb-4 focus:outline-none focus:border-[#4A7C59]" />

              <button onClick={submitLead} disabled={submitting}
                className="w-full py-3 rounded-xl text-[13px] font-semibold transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)] disabled:opacity-50 flex items-center justify-center gap-2 mb-3"
                style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
                {submitting ? "Processing..." : "Continue to Registration"} <ArrowRight size={14} />
              </button>

              <Link href="/register"
                className="block w-full py-3 rounded-xl text-[13px] font-medium transition-all border"
                style={{ borderColor: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.6)" }}>
                Skip — Register Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* RESULT: Submitted → Registration CTA */}
      {submitted && (
        <section className="pb-16">
          <div className="max-w-lg mx-auto px-6">
            <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "#39ff7e40", backgroundColor: "#39ff7e08" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#39ff7e20" }}>
                <CheckCircle2 size={32} style={{ color: "#39ff7e" }} />
              </div>
              <h2 className="text-[22px] font-semibold text-white mb-2">Lead Captured!</h2>
              <p className="text-[13px] text-white/40 mb-6 max-w-sm mx-auto">
                Now create your HotelsVendors account. After registration, your dashboard will show your credit limit and referral code <strong style={{ color: "#4A7C59" }}>{OLIV.code}</strong>.
              </p>

              <div className="inline-block px-6 py-3 rounded-xl border-2 mb-6" style={{ borderColor: "#4A7C5940", backgroundColor: "#4A7C5910" }}>
                <span className="text-[10px] text-white/40 block mb-0.5 uppercase tracking-wider">Your Referral Code</span>
                <span className="text-[24px] font-bold tracking-[0.15em]" style={{ color: "#4A7C59", fontFamily: "monospace" }}>{OLIV.code}</span>
              </div>

              <Link href="/register"
                className="inline-flex items-center gap-2 px-8 py-3.5 text-[14px] font-semibold rounded-xl transition-all hover:shadow-[0_0_30px_rgba(74,124,89,0.25)]"
                style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}>
                Register on HotelsVendors <ArrowRight size={16} />
              </Link>

              <p className="text-[11px] text-white/20 mt-5">
                After registration, you&apos;ll get access to your credit dashboard.
                <br />Questions?{" "}
                <a href="mailto:reem@hotelsvendors.com" className="underline" style={{ color: "#4A7C59" }}>reem@hotelsvendors.com</a>
              </p>
            </div>
          </div>
        </section>
      )}

      {/* RESULT: Not Qualified */}
      {qualified === false && (
        <section className="pb-16">
          <div className="max-w-lg mx-auto px-6">
            <div className="rounded-2xl border p-8 text-center" style={{ borderColor: "#ef444440", backgroundColor: "#ef444408" }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: "#ef444420" }}>
                <XCircle size={32} style={{ color: "#ef4444" }} />
              </div>
              <h2 className="text-[22px] font-semibold text-white mb-2">Not Quite Yet</h2>
              <p className="text-[13px] text-white/40 mb-6 max-w-sm mx-auto">
                {!etaUuid
                  ? "You need an ETA tax UUID to qualify. Register with the Egyptian Tax Authority first."
                  : "Your annual revenue is below the EGP 10M threshold. We'll notify you when lower tiers open."}
              </p>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email for updates"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-[13px] text-white placeholder:text-white/20 mb-4" />
              <button onClick={submitLead} disabled={submitting}
                className="w-full py-3 rounded-xl text-[13px] font-medium transition-all disabled:opacity-40"
                style={{ backgroundColor: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.08)" }}>
                {submitting ? "Saving..." : "Notify Me When Eligible"}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Trust Bar */}
      <section className="py-8 border-t" style={{ borderColor: "#4A7C5918" }}>
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-6 text-[11px] text-white/30">
          <span className="flex items-center gap-2"><Shield size={14} style={{ color: "#4A7C59" }} /> FRA Licensed</span>
          <span className="flex items-center gap-2"><Landmark size={14} style={{ color: "#4A7C59" }} /> Suez Canal Bank Backed</span>
          <span className="flex items-center gap-2"><Zap size={14} style={{ color: "#4A7C59" }} /> Same-Day Credit Approval</span>
          <span className="flex items-center gap-2">
            <OlivLogo size="xs" variant="green" />
            Powered by Oliv Finance
          </span>
        </div>
      </section>
    </main>
  );
}