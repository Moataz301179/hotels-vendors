"use client";

import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/layout/brand-logo";

export default function OfflinePage() {
  const [bg, setBg] = useState("#0B0F1A");

  useEffect(() => {
    try {
      const mode = localStorage.getItem("hv-theme-mode");
      if (mode === "hercules") setBg("#0a1628");
      else setBg("#000000");
    } catch {
      setBg("#000000");
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: bg }}>
      <div className="text-center space-y-4 max-w-sm">
        <BrandLogo variant="dark" size="lg" />
        <div className="space-y-2">
          <h1 className="text-lg font-semibold text-white">You are offline</h1>
          <p className="text-sm text-white/40">
            Please check your internet connection and try again. Some cached features may still be available.
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-semibold text-sm hover:bg-amber-400 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
