"use client";

import Link from "next/link";
import { PlayCircle, BookOpen, MessageCircle, ArrowLeft, Mail, Phone } from "lucide-react";

const GUIDES = [
  { role: "Hotel Buyer", href: "/videos/portals/hotel-guide.mp4", desc: "45-sec guide: catalog → PO → approval → delivery" },
  { role: "Supplier", href: "/videos/portals/supplier-guide.mp4", desc: "45-sec guide: listing → orders → fulfillment → payment" },
  { role: "Platform Admin", href: "/videos/portals/admin-guide.mp4", desc: "45-sec guide: tenants → fees → audit → compliance" },
];

const FAQS = [
  { q: "How do I place my first purchase order?", a: "Browse the catalog, add items to your cart, set delivery dates, and submit. The Authority Matrix will route it to the right approver automatically." },
  { q: "How does ETA e-invoicing work?", a: "Every invoice issued through the platform is digitally signed and auto-submitted to the Egyptian Tax Authority in real time." },
  { q: "Can I change my dashboard theme?", a: "Yes — go to Settings in the sidebar. Choose from 6 presets or pick your own accent color, font, and layout density." },
  { q: "How do suppliers get paid?", a: "Suppliers can opt for embedded non-recourse factoring at checkout and receive payment within 24-48 hours." },
  { q: "Is my data secure?", a: "Yes. We enforce tenant isolation, server-side RBAC, field-level permissions, and immutable audit logs. No client-side role switching." },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="border-b border-[var(--border-default)] bg-[var(--surface)]">
        <div className="mx-auto max-w-5xl px-6 py-6 flex items-center gap-4">
          <Link href="/hotel" className="p-2 rounded-lg hover:bg-[var(--surface-raised)] transition-colors">
            <ArrowLeft size={20} className="text-[var(--foreground-muted)]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Help Center</h1>
            <p className="text-sm text-[var(--foreground-muted)]">Guides, FAQs, and support</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-10 space-y-10">
        <section>
          <div className="flex items-center gap-2 mb-6">
            <PlayCircle size={18} className="text-[var(--accent-400)]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Portal Video Guides</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GUIDES.map((g) => (
              <a key={g.role} href={g.href} className="glass-card rounded-xl p-5 hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 flex items-center justify-center mb-4">
                  <PlayCircle size={24} className="text-[var(--accent-400)]" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">{g.role}</h3>
                <p className="text-xs text-[var(--foreground-muted)]">{g.desc}</p>
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={18} className="text-[var(--accent-400)]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="glass-card rounded-xl p-5">
                <h3 className="text-sm font-semibold text-white mb-2">{faq.q}</h3>
                <p className="text-sm text-[var(--foreground-secondary)] leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={18} className="text-[var(--accent-400)]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Still Need Help?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a href="mailto:support@hotelsvendors.com" className="glass-card rounded-xl p-5 flex items-center gap-4 hover:border-[var(--accent-500)]/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/10 flex items-center justify-center">
                <Mail size={18} className="text-[var(--accent-400)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Email Support</p>
                <p className="text-xs text-[var(--foreground-muted)]">support@hotelsvendors.com</p>
              </div>
            </a>
            <div className="glass-card rounded-xl p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[var(--accent-500)]/10 flex items-center justify-center">
                <Phone size={18} className="text-[var(--accent-400)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Phone Support</p>
                <p className="text-xs text-[var(--foreground-muted)]">+20 1XX XXX XXXX</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--foreground-muted)] text-center">
            Or use the <strong className="text-[var(--accent-400)]">AI Assistant</strong> floating button at the bottom-right of any dashboard page.
          </p>
        </section>
      </div>
    </div>
  );
}
