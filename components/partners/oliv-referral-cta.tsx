"use client";

import { useState } from "react";
import { Landmark, ArrowRight, Check, Loader2 } from "lucide-react";
import { OlivLogo } from "@/components/partners/oliv-logo";

interface OlivReferralCTAProps {
  /** Which entity is requesting financing — drives the referral capture. */
  entityType: "HOTEL" | "SUPPLIER";
  /** Optional facility type — defaults to FACTORING. */
  financingType?: "FACTORING" | "REVERSE_FACTORING" | "CREDIT_LINE" | "BNPL";
  /** Display-only: the amount this CTA is attached to (e.g. invoice value). */
  amount?: number;
  variant?: "banner" | "card" | "inline";
}

/**
 * Oliv Referral CTA — pilot email-handoff referral.
 *
 * Replaces the previous direct-link-to-oliv.finance/apply behavior. Now the
 * CTA POSTs to /api/v1/referrals, which:
 *   1. Creates a Referral in SUBMITTED stage
 *   2. Runs the eligibility engine (HotelScoreEngine / SupplierEligibilityEngine)
 *   3. Advances to ELIGIBLE or INELIGIBLE
 *   4. ELIGIBLE referrals appear in the admin pipeline for review + email handoff
 *
 * No Oliv API is called from the client. Phase 2 will replace this with the
 * embedded finance technical loop (see /docs/oliv-referral-pilot.md).
 */
export function OlivReferralCTA({
  entityType,
  financingType = "FACTORING",
  amount,
  variant = "card",
}: OlivReferralCTAProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string>("");

  const submit = async () => {
    setStatus("submitting");
    setMessage("");
    try {
      const res = await fetch("/api/v1/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ entityType, financingType }),
      });
      const data = await res.json();
      if (res.ok && data.referral) {
        const stage = data.referral.stage;
        if (stage === "ELIGIBLE") {
          setStatus("success");
          setMessage("Pre-qualified — our team will review and refer you to Oliv within 24h.");
        } else if (stage === "INELIGIBLE") {
          setStatus("error");
          const reasons = data.referral.ineligibleReasons?.join("; ") || "Not yet eligible";
          setMessage(`Not pre-qualified yet: ${reasons}`);
        } else {
          setStatus("success");
          setMessage("Referral submitted — our team will be in touch.");
        }
      } else {
        setStatus("error");
        setMessage(data.error || "Submission failed");
      }
    } catch {
      setStatus("error");
      setMessage("Network error — please try again");
    }
  };

  const accentColor = "#4A7C59";

  if (variant === "banner") {
    return (
      <div
        className="rounded-xl border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4"
        style={{ borderColor: "#4A7C5922", backgroundColor: "#4A7C5908" }}
      >
        <div className="flex items-center gap-3 flex-1">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#4A7C5915", border: "1px solid #4A7C5925" }}
          >
            <Landmark size={18} style={{ color: accentColor }} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white">Need Working Capital?</div>
            <div className="text-[12px] text-white/40">
              {amount
                ? `Pre-qualify for Oliv financing against this EGP ${amount.toLocaleString()} invoice — 48h funding`
                : "Pre-qualify for Oliv financing — funded in 48 hours"}
            </div>
            {message && <div className="text-[11px] mt-1 text-white/60">{message}</div>}
          </div>
        </div>
        <button
          onClick={submit}
          disabled={status === "submitting" || status === "success"}
          className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold rounded-lg transition-all hover:shadow-[0_0_20px_rgba(74,124,89,0.2)] shrink-0 disabled:opacity-50"
          style={{ backgroundColor: accentColor, color: "#ffffff" }}
        >
          {status === "submitting" ? <Loader2 size={12} className="animate-spin" /> : null}
          {status === "success" ? <Check size={12} /> : null}
          {status === "idle" || status === "error" ? "Pre-qualify" : status === "submitting" ? "Checking..." : "Referred"}
        </button>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <button
        onClick={submit}
        disabled={status === "submitting" || status === "success"}
        className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors hover:opacity-80 disabled:opacity-50"
        style={{ color: accentColor }}
      >
        {status === "submitting" ? <Loader2 size={13} className="animate-spin" /> : <Landmark size={13} />}
        {status === "success" ? "Referred to Oliv" : status === "error" ? "Try again" : "Finance via Oliv"}
      </button>
    );
  }

  // Default: card
  return (
    <div
      className="rounded-xl border bg-[#12121a] p-5 hover:border-white/[0.10] transition-all"
      style={{ borderColor: "#4A7C5922" }}
    >
      <div className="flex items-center gap-3 mb-3">
        <OlivLogo size="sm" variant="green" />
      </div>
      <h3 className="text-[14px] font-semibold text-white mb-1.5">
        {entityType === "HOTEL" ? "Hotel Financing" : "Invoice Financing"}
      </h3>
      <p className="text-[12px] text-white/40 leading-relaxed mb-4">
        Pre-qualify for Oliv financing in seconds. Our team reviews and refers you — no paperwork to start.
      </p>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
          FRA Licensed
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#39ff7e" }} />
          48h Funding
        </div>
      </div>
      {message && (
        <div className="text-[11px] text-white/60 mb-3 p-2 rounded bg-white/5 border border-white/10">{message}</div>
      )}
      <button
        onClick={submit}
        disabled={status === "submitting" || status === "success"}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-semibold rounded-lg transition-all hover:shadow-[0_0_20px_rgba(74,124,89,0.15)] disabled:opacity-50"
        style={{ backgroundColor: accentColor, color: "#ffffff" }}
      >
        {status === "submitting" ? <Loader2 size={13} className="animate-spin" /> : null}
        {status === "success" ? <Check size={13} /> : <ArrowRight size={13} />}
        {status === "submitting" ? "Pre-qualifying..." : status === "success" ? "Referred ✓" : "Pre-qualify Now"}
      </button>
    </div>
  );
}
