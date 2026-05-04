"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, ShieldCheck, Globe, Award, Briefcase } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      {/* Navbar */}
      <nav className="border-b border-[var(--border-default)] bg-[var(--surface)]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-[72px] items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[var(--surface-raised)] border border-[var(--border-default)]">
                <Image src="/logo-transparent.png" alt="Hotels Vendors" fill className="object-contain p-1" />
              </div>
              <span className="text-sm font-bold tracking-wider text-[var(--foreground)]">Hotels Vendors</span>
            </Link>
            <Link href="/" className="px-4 py-2 text-[13px] font-medium text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent-500)]/8 rounded-full blur-[150px]" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-[var(--foreground)]">
            Who We <span className="text-white">Are</span>
          </h1>
          <p className="mt-4 text-lg text-[var(--foreground-secondary)] max-w-2xl mx-auto">
            Built by hospitality professionals, for hospitality professionals. 
            Rooted in Egypt. Engineered for scale.
          </p>
        </div>
      </section>

      {/* Founder */}
      <section className="py-16 border-y border-[var(--border-default)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
            {/* Photo */}
            <div className="md:col-span-1 flex justify-center">
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-[var(--accent-500)]/30 shadow-2xl">
                <Image
                  src="/moataz-ceo.jpg"
                  alt="Moataz Abdel Ghani — CEO & Founder"
                  fill
                  className="object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--surface-raised)] text-5xl font-bold text-white" id="ceo-fallback">
                  MAG
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Award size={16} className="text-white" />
                <span className="text-[11px] font-semibold text-white uppercase tracking-widest">Founder & CEO</span>
              </div>
              <h2 className="text-3xl font-bold text-[var(--foreground)]">Moataz Abdel Ghani</h2>
              <p className="mt-1 text-[var(--foreground-muted)]">Chief Executive Officer & Founder, Hotels Vendors</p>

              <p className="mt-6 text-[var(--foreground-secondary)] leading-relaxed">
                Hotels Vendors was conceived, architected, and built from the ground up by <strong className="text-[var(--foreground)]">Moataz Abdel Ghani</strong> — 
                a management consultant and internal audit professional with deep experience across Big 4 firms and multinational corporations.
              </p>

              <p className="mt-4 text-[var(--foreground-secondary)] leading-relaxed">
                Before founding Hotels Vendors, Moataz spent years inside <strong className="text-[var(--foreground)]">Ernst & Young (EY)</strong>, 
                <strong className="text-[var(--foreground)]"> Deloitte</strong>, and <strong className="text-[var(--foreground)]">KPMG</strong> — 
                delivering business solutions, risk management frameworks, and internal audit programs for Fortune 500 clients and 
                large-scale hospitality groups across the Middle East and Africa.
              </p>

              <p className="mt-4 text-[var(--foreground-secondary)] leading-relaxed">
                That front-line exposure to how hotels actually operate — the procurement chaos, the compliance gaps, the cash-flow 
                bottlenecks — is what inspired Hotels Vendors. Every feature, every workflow, and every governance rule in this platform 
                was designed by someone who has sat in the auditor's chair and understands what institutional-grade procurement 
                really means.
              </p>

              {/* Big 4 Badges */}
              <div className="mt-8 flex flex-wrap gap-3">
                {["EY — Ernst & Young", "Deloitte", "KPMG"].map((firm) => (
                  <span key={firm} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-default)] text-sm text-[var(--foreground-secondary)]">
                    <Briefcase size={14} className="text-white" />
                    {firm}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[11px] font-semibold text-white tracking-widest uppercase">
              Our Mission
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-[var(--foreground)]">
              Replace <span className="text-white">WhatsApp + Excel</span> with one intelligent platform
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Building2, title: "For Hotels", desc: "Cut procurement admin by 80%. Get AI-suggested suppliers, automated POs, and real-time ETA compliance — all in one dashboard." },
              { icon: ShieldCheck, title: "For Suppliers", desc: "Access 450+ hotel buyers. Fixed pricing, guaranteed payments via embedded factoring, and shared-route logistics to reduce delivery costs." },
              { icon: Globe, title: "For Egypt", desc: "The first hospitality procurement platform natively integrated with the Egyptian Tax Authority. Built local. Built compliant. Built to scale." },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-xl p-6">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white mb-4">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--foreground)] mb-2">{item.title}</h3>
                <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-[var(--border-default)] bg-[var(--surface)]">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
            Built by <span className="text-white">professionals</span>. Backed by <span className="text-white">Big 4 rigor</span>.
          </h2>
          <p className="mt-3 text-[var(--foreground-secondary)] max-w-xl mx-auto">
            Every line of code, every governance rule, and every compliance check reflects institutional-grade standards.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register" className="px-7 py-3.5 text-sm font-semibold rounded-xl bg-[var(--accent-500)] text-white hover:bg-[var(--accent-600)] transition-all">
              Join Hotels Vendors
            </Link>
            <Link href="/catalog" className="px-7 py-3.5 text-sm font-semibold rounded-xl border border-[var(--border-default)] text-[var(--foreground)] hover:bg-[var(--surface-raised)] transition-all">
              Explore the Platform
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--background)] border-t border-[var(--border-default)] py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-[var(--foreground-muted)]">© 2026 Hotels Vendors. Founded by Moataz Abdel Ghani. All rights reserved.</p>
          <div className="flex items-center gap-6 text-[var(--foreground-muted)] text-xs">
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Privacy</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Terms</a>
            <a href="#" className="hover:text-[var(--foreground)] transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
