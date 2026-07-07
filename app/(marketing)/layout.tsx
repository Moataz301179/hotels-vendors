"use client"

import { type ReactNode } from "react"
import { Sparkles } from "lucide-react"
import Link from "next/link"
import { AIAssistantProvider } from "@/components/ai/assistant-context"
import { AIAssistant } from "@/components/ai/ai-assistant"
import { CartProvider } from "@/components/cart/cart-context"

const navLinks = [
  { label: "Marketplace", href: "/invo" },
  { label: "VAT Engine", href: "/vat-invoicing" },
  { label: "Solutions", href: "/solutions" },
  { label: "About", href: "/about" },
]

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
    <AIAssistantProvider>
      <div
        className="min-h-screen flex flex-col"
        style={{
          backgroundColor: "var(--bg-canvas)",
          color: "var(--text-primary)",
          fontFamily: "var(--font-sans)",
        }}
      >
        <nav
          className="fixed top-0 left-0 right-0 z-40 h-16"
          style={{
            backgroundColor: "var(--bg-canvas)",
            borderBottom: "1px solid var(--border-subtle)",
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "var(--accent-base)" }}
              >
                <Sparkles className="w-4 h-4" style={{ color: "var(--bg-canvas)" }} />
              </div>
              <span
                className="font-semibold text-lg"
                style={{ color: "var(--text-primary)", fontFamily: "var(--font-sans)" }}
              >
                HotelsVendors
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium transition-colors duration-200 hover:opacity-100"
                  style={{
                    color: "var(--text-secondary)",
                    fontFamily: "var(--font-sans)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-base)")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-secondary)")}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <main className="flex-1 pt-16">{children}</main>

        <footer className="py-12" style={{ borderTop: "1px solid var(--border-subtle)" }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                &copy; {new Date().getFullYear()} HotelsVendors. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        <AIAssistant />
      </div>
    </AIAssistantProvider>
    </CartProvider>
  )
}
