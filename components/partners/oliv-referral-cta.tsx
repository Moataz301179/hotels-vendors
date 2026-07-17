"use client";

import { Landmark, ArrowRight, ExternalLink } from "lucide-react";
import { OlivLogo } from "@/components/partners/oliv-logo";

interface OlivReferralCTAProps {
  orderId?: string;
  invoiceId?: string;
  amount?: number;
  variant?: "banner" | "card" | "inline";
}

/**
 * Oliv Referral CTA — shown on order/invoice pages for suppliers.
 * Phase 1: Redirects to Oliv for financing application.
 */
export function OlivReferralCTA({
  orderId,
  invoiceId,
  amount,
  variant = "card",
}: OlivReferralCTAProps) {
  const referralUrl = orderId
    ? `https://oliv.finance/apply?ref=${orderId}&source=hotelsvendors`
    : "https://oliv.finance/#register";

  if (variant === "banner") {
    return (
      <div className="rounded-xl border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4" style={{ borderColor: "#4A7C5922", backgroundColor: "#4A7C5908" }}>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#4A7C5915", border: "1px solid #4A7C5925" }}>
            <Landmark size={18} style={{ color: "#4A7C59" }} />
          </div>
          <div>
            <div className="text-[13px] font-semibold text-white">Need Working Capital?</div>
            <div className="text-[12px] text-white/40">
              {amount
                ? `Finance this EGP ${amount.toLocaleString()} invoice via Oliv — funded in 48h`
                : "Get your invoices financed in 48 hours via Oliv"}
            </div>
          </div>
        </div>
        <a
          href={referralUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold rounded-lg transition-all hover:shadow-[0_0_20px_rgba(74,124,89,0.2)] shrink-0"
          style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}
        >
          Apply on Oliv <ExternalLink size={12} />
        </a>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <a
        href={referralUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-[12px] font-medium transition-colors hover:opacity-80"
        style={{ color: "#4A7C59" }}
      >
        <Landmark size={13} />
        Finance via Oliv
        <ExternalLink size={10} />
      </a>
    );
  }

  // Default: card
  return (
    <div className="rounded-xl border bg-[#12121a] p-5 hover:border-white/[0.10] transition-all" style={{ borderColor: "#4A7C5922" }}>
      <div className="flex items-center gap-3 mb-3">
        <OlivLogo size="sm" variant="green" />
      </div>
      <h3 className="text-[14px] font-semibold text-white mb-1.5">Invoice Financing</h3>
      <p className="text-[12px] text-white/40 leading-relaxed mb-4">
        Finance your verified invoices against instant credit approval. No paperwork. No tech integration needed.
      </p>
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#4A7C59" }} />
          FRA Licensed
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-white/30">
          <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#39ff7e" }} />
          48h Funding
        </div>
      </div>
      <a
        href={referralUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-[12px] font-semibold rounded-lg transition-all hover:shadow-[0_0_20px_rgba(74,124,89,0.15)]"
        style={{ backgroundColor: "#4A7C59", color: "#ffffff" }}
      >
        Get Financed <ArrowRight size={13} />
      </a>
    </div>
  );
}
