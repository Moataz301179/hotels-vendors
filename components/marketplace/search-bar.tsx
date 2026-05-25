"use client";

import { Search } from "lucide-react";

export function SearchBar() {
  return (
    <div className="relative w-full max-w-xl">
      <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/20" />
      <input
        type="text"
        placeholder="Search products, suppliers, categories..."
        className="w-full rounded-full border border-white/[0.04] bg-[#0a0a12] py-3 pl-11 pr-5 text-[13px] text-white placeholder-white/20 focus:border-[#7c3aed]/30 focus:outline-none focus:ring-1 focus:ring-[#7c3aed]/20 transition-all"
      />
    </div>
  );
}
