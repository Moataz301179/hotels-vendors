"use client";

import { useState } from "react";
import { X, Construction, ExternalLink } from "lucide-react";

export function SandboxBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      <div className="max-w-lg mx-auto px-6 text-center">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: "var(--accent-muted)", border: "1px solid rgba(232,168,56,0.2)" }}>
          <Construction className="w-8 h-8" style={{ color: "var(--accent-base)" }} />
        </div>

        {/* Title */}
        <h1 className="text-[28px] font-medium text-white tracking-tight mb-3">
          HotelsVendors
          <span className="block text-[14px] font-normal text-white/30 mt-1">
            Sandbox Environment
          </span>
        </h1>

        {/* Message */}
        <p className="text-[15px] text-white/50 leading-relaxed mb-8 max-w-md mx-auto">
          This dashboard is currently under active development.
          The procurement marketplace, supplier portals, and factoring
          workflows are being rebuilt. Check back soon.
        </p>

        {/* Status indicators */}
        <div className="flex items-center justify-center gap-6 mb-8 text-[12px] text-white/25">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500/60 animate-pulse" />
            In Development
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "var(--accent-base)", opacity: 0.6 }} />
            Private Sandbox
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/invo"
            className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium rounded-xl transition-colors"
            style={{ backgroundColor: "var(--accent-base)", color: "var(--accent-text, #fff)" }}
          >
            View INVO Platform
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="inline-flex items-center gap-2 px-6 py-3 text-[14px] font-medium text-white/40 border border-white/[0.08] rounded-xl hover:bg-white/[0.04] hover:text-white/60 transition-colors"
          >
            Enter Dashboard
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Footer */}
        <p className="mt-10 text-[11px] text-white/15">
          HotelsVendors · Egyptian Hospitality Procurement Hub · Sharm El-Sheikh & Hurghada
        </p>
      </div>
    </div>
  );
}
