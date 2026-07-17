"use client";

import { WifiOff, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[#0c0c12] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-[#ff7e1a]/10 border border-[#ff7e1a]/20 flex items-center justify-center mx-auto mb-6">
          <WifiOff size={36} className="text-[#ff7e1a]" />
        </div>
        <h1 className="text-[24px] font-semibold text-white mb-3">You&apos;re Offline</h1>
        <p className="text-[14px] text-white/40 mb-8 leading-relaxed">
          It looks like you&apos;ve lost your internet connection.
          Please check your network and try again.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#39ff7e] text-[#07090f] text-[13px] font-semibold hover:bg-[#39ff7e]/90 transition-all hover:shadow-[0_0_20px_rgba(57,255,126,0.15)]"
          >
            <RefreshCw size={14} />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.1] text-white/60 text-[13px] font-medium hover:bg-white/[0.04] transition-all"
          >
            <Home size={14} />
            Go Home
          </Link>
        </div>
      </div>
    </main>
  );
}
