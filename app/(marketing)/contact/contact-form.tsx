"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ContactForm() {
  return (
    <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
      <div className="grid grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="First name"
          className="surface-input w-full text-[13px]"
        />
        <input
          type="text"
          placeholder="Last name"
          className="surface-input w-full text-[13px]"
        />
      </div>
      <input
        type="email"
        placeholder="Work email"
        className="surface-input w-full text-[13px]"
      />
      <input
        type="text"
        placeholder="Company name"
        className="surface-input w-full text-[13px]"
      />
      <input
        type="tel"
        placeholder="Phone (optional)"
        className="surface-input w-full text-[13px]"
      />
      <select className="surface-input w-full text-[13px] text-muted">
        <option value="">Number of properties</option>
        <option>1–3</option>
        <option>4–10</option>
        <option>11–25</option>
        <option>25+</option>
      </select>
      <textarea
        placeholder="Tell us about your procurement needs (optional)"
        rows={3}
        className="surface-input w-full text-[13px] resize-none"
      />
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-[13px] font-semibold transition-all duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-base)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
        style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text)" }}
      >
        Request Demo <ArrowRight size={14} />
      </button>
      <p className="text-[10px] text-muted text-center">
        By submitting, you agree to our{" "}
        <Link href="/privacy" className="underline hover:text-foreground">privacy policy</Link>.
      </p>
    </form>
  );
}
