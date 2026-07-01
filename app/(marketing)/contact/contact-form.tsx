"use client";

import { useState } from "react";
import { Bot, ArrowRight, CheckCircle2, Loader2, Sparkles } from "lucide-react";

const AGENT_STEPS = [
  "agent_1_ingestion: parsing submission...",
  "agent_2_compliance: validating eligibility...",
  "agent_3_signoff: scoring portfolio fit...",
  "agent_4_routing: provisioning tenant...",
];

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [running, setRunning] = useState(false);
  const [stepIndex, setStepIndex] = useState(-1);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRunning(true);
    setSubmitted(true);

    for (let i = 0; i < AGENT_STEPS.length; i++) {
      setStepIndex(i);
      await new Promise((r) => setTimeout(r, 800));
    }
    setDone(true);
    setRunning(false);
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-2xl bg-[var(--accent-muted)] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={28} style={{ color: "var(--accent-base)" }} />
        </div>
        <h3 className="text-[16px] font-semibold mb-2">Tenant Provisioned</h3>
        <p className="text-[13px] text-secondary mb-6">
          AI agents have qualified and provisioned your environment. Check your email for credentials.
        </p>
        <a
          href="/register"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold transition-all"
          style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}
        >
          Go to Onboarding <ArrowRight size={14} />
        </a>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="First name"
          required
          className="surface-input w-full text-[13px]"
        />
        <input
          type="text"
          placeholder="Last name"
          required
          className="surface-input w-full text-[13px]"
        />
      </div>
      <input
        type="email"
        placeholder="Work email"
        required
        className="surface-input w-full text-[13px]"
      />
      <input
        type="text"
        placeholder="Company name"
        required
        className="surface-input w-full text-[13px]"
      />
      <select required className="surface-input w-full text-[13px]" defaultValue="">
        <option value="" disabled>Number of properties</option>
        <option value="1-3">1–3</option>
        <option value="4-10">4–10</option>
        <option value="11-25">11–25</option>
        <option value="25+">25+</option>
      </select>

      {submitted && (
        <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: "var(--surface-raised, rgba(255,255,255,0.04))", border: "1px solid var(--border-subtle)" }}>
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-base)" }}>
            <Sparkles size={12} /> AI Swarm Pipeline
          </div>
          {AGENT_STEPS.map((step, i) => (
            <div
              key={step}
              className="flex items-center gap-2 text-[12px] font-mono transition-opacity"
              style={{
                color: i <= stepIndex ? "var(--accent-base)" : "var(--text-muted)",
                opacity: i <= stepIndex ? 1 : 0.4,
              }}
            >
              {i < stepIndex ? (
                <CheckCircle2 size={12} style={{ color: "var(--success)" }} />
              ) : i === stepIndex ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Bot size={12} />
              )}
              {step}
            </div>
          ))}
        </div>
      )}

      <button
        type="submit"
        disabled={running}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 hover:opacity-90 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}
      >
        {running ? (
          <>Provisioning <Loader2 size={14} className="animate-spin" /></>
        ) : (
          <>Deploy with AI <ArrowRight size={14} /></>
        )}
      </button>
    </form>
  );
}
