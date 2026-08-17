"use client";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:rounded-md focus:text-sm focus:font-semibold focus:bg-[#39ff7e] focus:text-[#07090f] focus:outline-none focus:ring-2 focus:ring-[#39ff7e]/50 focus:shadow-lg"
    >
      Skip to main content
    </a>
  );
}
