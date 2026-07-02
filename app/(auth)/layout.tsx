"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Sparkles } from "lucide-react"

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundColor: "var(--bg-canvas)",
        color: "var(--text-primary)",
        fontFamily: "var(--font-sans)",
      }}
    >
      <header
        className="fixed top-0 left-0 right-0 z-40 h-16"
        style={{
          backgroundColor: "var(--bg-canvas)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <Link href="/" className="flex items-center gap-2">
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
              HotelProcure
            </span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center pt-16 px-4">
        {children}
      </main>

      <footer
        className="py-6"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
              &copy; {new Date().getFullYear()} HotelProcure. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/terms"
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-xs"
                style={{ color: "var(--text-tertiary)" }}
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
