"use client";

/* /sandbox — the REAL interactive micro-app (not the old static mock dashboard).
   Hosts the InteractiveSandbox try-before-you-buy widget: role tabs, simulated
   approval chain / cash-out / dock scan, and a live execution trace terminal. */

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { InteractiveSandbox } from "@/components/marketing/interactive-sandbox";

export default function SandboxPage() {
  return (
    <main className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        {/* Header */}
        <div className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 text-[11px] font-semibold">
            <Sparkles size={12} /> Interactive Sandbox — no account needed
          </div>
          <h1 className="mt-4 text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
            Run the platform before you sign up
          </h1>
          <p className="mt-3 text-slate-600 text-sm lg:text-base max-w-2xl leading-relaxed">
            Switch between Hotel, Supplier, and Funder views below to simulate real workflows —
            approval chains, 48h cash-out, dock scans — and watch the execution trace in real time.
          </p>
        </div>

        {/* The interactive micro-app */}
        <InteractiveSandbox />

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-500 text-sm mb-4">Ready to go beyond the sandbox?</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/register?type=hotel" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-sm font-semibold rounded-md hover:bg-slate-800 transition-colors">
              Create free account <ArrowRight size={15} />
            </Link>
            <Link href="/register?type=supplier" className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-300 text-slate-700 text-sm font-semibold rounded-md hover:bg-slate-50 transition-colors">
              Join as Supplier
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}