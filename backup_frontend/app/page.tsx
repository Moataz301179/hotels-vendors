"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

export default function HomePage() {
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
          backgroundColor: "rgba(10, 10, 15, 0.8)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--border-subtle)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: "var(--accent-base)" }}
            >
              <Sparkles className="w-4 h-4" style={{ color: "var(--bg-canvas)" }} />
            </div>
            <span className="font-semibold text-lg">HotelProcure</span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              style={{ color: "var(--text-secondary)" }}
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium px-5 py-2 rounded-lg transition-all"
              style={{
                backgroundColor: "var(--accent-base)",
                color: "#fff",
              }}
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative flex-1 flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/hero-bg.png"
            alt=""
            fill
            className="object-cover"
            priority
            sizes="100vw"
            style={{ objectPosition: "center 30%" }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(135deg, rgba(10,10,15,0.92) 0%, rgba(10,10,15,0.60) 50%, rgba(10,10,15,0.85) 100%)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(0deg, var(--bg-canvas) 0%, transparent 40%)",
            }}
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight">
                Procurement that works
                <br />
                for your{" "}
                <span style={{ color: "var(--accent-base)" }}>hotel</span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="text-lg sm:text-xl mt-6 sm:mt-8 leading-relaxed"
              style={{
                color: "rgba(255,255,255,0.7)",
                maxWidth: "540px",
                textShadow: "0 1px 8px rgba(0,0,0,0.3)",
              }}
            >
              The marketplace that connects hotels with verified suppliers —
              cutting procurement costs, streamlining RFQs, and building
              relationships that last.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
              className="flex items-center gap-4 mt-10 sm:mt-12"
            >
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  backgroundColor: "var(--accent-base)",
                  color: "#fff",
                }}
              >
                Start sourcing
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium transition-all"
                style={{
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.8)",
                  backdropFilter: "blur(4px)",
                }}
              >
                Sign in
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

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
                className="text-xs transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                Terms
              </Link>
              <Link
                href="/privacy"
                className="text-xs transition-colors"
                style={{ color: "var(--text-tertiary)" }}
              >
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
