import React from "react";

/* ═══════════════════════════════════════════════════════════════
   MARKETING PAGE WRAPPER
   Shared shell for all marketing pages: theme-aware <main> with
   consistent font-family and min-height. Use this instead of
   repeating the inline style on every page.
   ═══════════════════════════════════════════════════════════════ */
export function MarketingPage({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="marketing-main"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
        minHeight: "100vh",
        fontFamily: "var(--font-sans)",
      }}
    >
      {children}
    </main>
  );
}
