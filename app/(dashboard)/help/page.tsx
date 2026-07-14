"use client";

import { BookOpen, MessageCircle, FileText, Shield, Zap, Truck, CreditCard, Building2, ExternalLink } from "lucide-react";
import Link from "next/link";

const GUIDES = [
  {
    icon: Building2,
    title: "Hotel Procurement Guide",
    description: "How to browse catalogs, place orders, and manage your procurement workflow.",
    href: "/hotel/catalog",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Truck,
    title: "Supplier Onboarding",
    description: "Register your business, list products, and start receiving orders from hotels.",
    href: "/suppliers/join",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: CreditCard,
    title: "Oliv Financing",
    description: "Access credit lines up to EGP 10M with 48-hour funding through Oliv factoring.",
    href: "/financing/oliv",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "ETA E-Invoicing",
    description: "Understand Egyptian Tax Authority compliance and digital invoice submission.",
    href: "/vat-invoicing",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Zap,
    title: "Order Flow",
    description: "Complete lifecycle from PO creation to delivery confirmation and payment.",
    href: "/hotel/order",
    color: "text-[#39ff7e]",
    bg: "bg-[#39ff7e]/10",
  },
  {
    icon: FileText,
    title: "Terms of Service",
    description: "Platform terms, user agreements, and legal frameworks.",
    href: "/terms",
    color: "text-white/40",
    bg: "bg-white/5",
  },
];

export default function HelpPage() {
  return (
    <div className="max-w-[900px] mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-2xl font-bold tracking-tight text-white">Help & Guides</h1>
        <p className="text-sm text-white/40 max-w-md mx-auto">
          Everything you need to get started with HotelsVendors. Choose a guide below or reach out to our support team.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {GUIDES.map((guide) => (
          <Link
            key={guide.title}
            href={guide.href}
            className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 hover:bg-white/[0.035] transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`w-10 h-10 rounded-xl ${guide.bg} flex items-center justify-center shrink-0`}>
                <guide.icon size={18} className={guide.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white">{guide.title}</h3>
                  <ExternalLink size={12} className="text-white/20 group-hover:text-white/40 transition-colors" />
                </div>
                <p className="text-xs text-white/35 mt-1 leading-relaxed">{guide.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Contact Support */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
        <MessageCircle size={24} className="text-white/15 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-white mb-1">Need more help?</h3>
        <p className="text-xs text-white/30 mb-4">Our support team is available Sunday–Thursday, 9AM–6PM Cairo time.</p>
        <a
          href="mailto:support@hotelsvendors.com"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#39ff7e]/10 text-[#39ff7e] text-xs font-medium hover:bg-[#39ff7e]/20 transition-colors"
        >
          <MessageCircle size={14} />
          Contact Support
        </a>
      </div>
    </div>
  );
}
