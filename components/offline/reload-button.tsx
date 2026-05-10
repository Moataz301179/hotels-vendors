"use client";

import { RefreshCw } from "lucide-react";

export function ReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-[#022349] text-white text-sm font-medium hover:bg-[#033a6d] transition-colors"
    >
      <RefreshCw size={16} />
      Try Again
    </button>
  );
}
