"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  PlayCircle,
  BookOpen,
  MessageCircle,
  ArrowLeft,
  Mail,
  Phone,
  ChevronDown,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

const GUIDES = [
  {
    role: "Hotel Buyer",
    href: "/videos/portals/hotel-guide.mp4",
    desc: "45-sec guide: catalog → PO → approval → delivery",
  },
  {
    role: "Supplier",
    href: "/videos/portals/supplier-guide.mp4",
    desc: "45-sec guide: listing → orders → fulfillment → payment",
  },
  {
    role: "Platform Admin",
    href: "/videos/portals/admin-guide.mp4",
    desc: "45-sec guide: tenants → fees → audit → compliance",
  },
];

const FAQS = [
  {
    q: "How do I place my first purchase order?",
    a: "Browse the catalog, add items to your cart, set delivery dates, and submit. The Authority Matrix will route it to the right approver automatically.",
  },
  {
    q: "How does ETA e-invoicing work?",
    a: "Every invoice issued through the platform is digitally signed and auto-submitted to the Egyptian Tax Authority in real time.",
  },
  {
    q: "Can I change my dashboard theme?",
    a: "Yes — go to Settings in the sidebar. Choose from 6 presets or pick your own accent color, font, and layout density.",
  },
  {
    q: "How do suppliers get paid?",
    a: "Suppliers can opt for embedded non-recourse factoring at checkout and receive payment within 24-48 hours.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. We enforce tenant isolation, server-side RBAC, field-level permissions, and immutable audit logs. No client-side role switching.",
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <MarketingNav />

      {/* Header */}
      <div className="pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-[12px] font-medium text-[#022349] tracking-[0.15em] uppercase mb-4">
              Support
            </p>
            <h1 className="text-[40px] sm:text-[52px] font-bold text-white tracking-[-0.03em] leading-tight">
              Help Center
            </h1>
            <p className="mt-3 text-[17px] text-white/50 max-w-lg">
              Guides, FAQs, and support for Hotels Vendors platform
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20 space-y-16">
        {/* Video Guides */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <PlayCircle size={18} className="text-[#022349]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Portal Video Guides
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GUIDES.map((g, i) => (
              <motion.a
                key={g.role}
                href={g.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-6 hover:border-white/[0.12] hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0a0a0a] border border-white/[0.08] flex items-center justify-center mb-4">
                  <PlayCircle size={24} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-white mb-1">
                  {g.role}
                </h3>
                <p className="text-xs text-white/40">{g.desc}</p>
              </motion.a>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <BookOpen size={18} className="text-[#022349]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5"
              >
                <h3 className="text-sm font-semibold text-white mb-2">
                  {faq.q}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle size={18} className="text-[#022349]" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Still Need Help?
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="mailto:support@hotelsvendors.com"
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 flex items-center gap-4 hover:border-[#022349]/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] border border-white/[0.08] flex items-center justify-center">
                <Mail size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Email Support
                </p>
                <p className="text-xs text-white/40">
                  support@hotelsvendors.com
                </p>
              </div>
            </a>
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#0a0a0a] border border-white/[0.08] flex items-center justify-center">
                <Phone size={18} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Phone Support
                </p>
                <p className="text-xs text-white/40">+20 1XX XXX XXXX</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-white/40 text-center">
            Or use the <strong className="text-white">AI Assistant</strong>{" "}
            floating button at the bottom-right of any dashboard page.
          </p>
        </section>
      </div>

      <MarketingFooter />
    </div>
  );
}
