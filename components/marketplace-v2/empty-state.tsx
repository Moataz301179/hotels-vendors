"use client";

import { SearchX, ArrowLeft } from "lucide-react";

interface EmptyStateProps {
  searchTerm?: string;
  onClear?: () => void;
}

export function EmptyState({ searchTerm, onClear }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <SearchX size={28} className="text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">
        {searchTerm ? `No results for "${searchTerm}"` : "No products found"}
      </h3>
      <p className="text-sm text-gray-500 max-w-sm mb-4">
        {searchTerm
          ? "Try adjusting your search terms or browse by category."
          : "Check back soon — we're adding new suppliers daily."}
      </p>
      {onClear && (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B0000]/10 text-[#8B0000] text-sm font-medium hover:bg-[#8B0000]/20 transition-colors"
        >
          <ArrowLeft size={14} />
          Clear filters
        </button>
      )}
    </div>
  );
}
