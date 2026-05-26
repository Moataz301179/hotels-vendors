"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Play,
  Hotel,
  Truck,
  ShieldCheck,
  Mail,
  HelpCircle,
  ShoppingCart,
  FileText,
  Palette,
  CreditCard,
  Lock,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] as const } }),
};

const videoGuides = [
  {
    icon: Hotel,
    title: "Hotel Buyer",
    desc: "45-sec guide: catalog → PO → approval → delivery",
    color: "#a3e635",
  },
  {
    icon: Truck,
    title: "Supplier",
    desc: "45-sec guide: listing → orders → fulfillment → payment",
    color: "#a3e635",
  },
  {
    icon: ShieldCheck,
    title: "Platform Admin",
    desc: "45-sec guide: tenants → fees → audit → compliance",
    color: "#60a5fa",
  },
];

const faqs = [
  {
    q: "How do I place my first purchase order?",
    a: "Navigate to the Catalog section from your hotel dashboard, browse verified suppliers, add items to your cart, and submit for approval. Your designated approvers will receive a notification. Once approved, the PO is sent directly to the supplier.",
    icon: ShoppingCart,
  },
  {
    q: "How does ETA e-invoicing work?",
    a: "Every invoice generated on Hotels Vendors is automatically formatted to Egyptian Tax Authority (ETA) standards. The system submits e-invoices in real-time via our direct API integration with ETA. You receive a UUID and QR code for every invoice instantly.",
    icon: FileText,
  },
  {
    q: "Can I change my dashboard theme?",
    a: "Yes. Go to Settings → Appearance in your dashboard. You can toggle between dark mode, OLED black, and light mode. Enterprise accounts can also apply custom brand colors.",
    icon: Palette,
  },
  {
    q: "How do suppliers get paid?",
    a: "Suppliers receive payments through our integrated fintech partners. Standard settlement is T+3 business days. For faster cashflow, suppliers can opt for embedded invoice factoring through Oliv, receiving up to 90% of invoice value within 24 hours.",
    icon: CreditCard,
  },
  {
    q: "Is my data secure?",
    a: "Absolutely. We use AES-256 encryption at rest and TLS 1.3 in transit. Role-based access control (RBAC) ensures users only see data relevant to their permissions. All actions are logged in an immutable audit trail. We are SOC 2 Type II compliant.",
    icon: Lock,
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0f0f11]">
      {/* Hero */}
      <section className="pt-24 pb-16 px-8">
        <div className="max-w-[1280px] mx-auto text-center">
          <motion.h1
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4"
          >
            Help Center
          </motion.h1>

          <motion.p
            custom={1}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-lg text-white/50 max-w-xl mx-auto"
          >
            Guides, FAQs, and support for every portal
          </motion.p>
        </div>
      </section>

      {/* Video Guides */}
      <section className="py-16 px-8 border-y border-white/[0.06]">
        <div className="max-w-[1280px] mx-auto">
          <motion.p
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-xs font-semibold text-[#a3e635] tracking-[0.2em] uppercase mb-8"
          >
            PORTAL VIDEO GUIDES
          </motion.p>

          <div className="grid md:grid-cols-3 gap-6">
            {videoGuides.map((guide, i) => (
              <motion.div
                key={guide.title}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="group p-6 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${guide.color}15` }}
                  >
                    <guide.icon className="w-5 h-5" style={{ color: guide.color }} />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white/[0.04] flex items-center justify-center group-hover:bg-[#a3e635]/20 transition-colors">
                    <Play className="w-4 h-4 text-white/40 group-hover:text-[#a3e635]" />
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-white mb-1">{guide.title}</h3>
                <p className="text-sm text-white/40">{guide.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 px-8">
        <div className="max-w-[800px] mx-auto">
          <motion.p
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-xs font-semibold text-[#a3e635] tracking-[0.2em] uppercase mb-8"
          >
            FREQUENTLY ASKED QUESTIONS
          </motion.p>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                custom={i + 1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInUp}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center gap-4 px-6 py-5 text-left"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#a3e635]/10 flex items-center justify-center flex-shrink-0">
                    <faq.icon className="w-4 h-4 text-[#a3e635]" />
                  </div>
                  <span className="flex-1 text-sm font-medium text-white">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-white/30 transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-6 pb-5 pl-[76px]">
                        <p className="text-sm text-white/50 leading-relaxed">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-16 px-8 border-y border-white/[0.06]">
        <div className="max-w-[800px] mx-auto text-center">
          <motion.div
            custom={0}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <div className="w-16 h-16 rounded-full bg-[#a3e635]/10 flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-7 h-7 text-[#a3e635]" />
            </div>

            <h2 className="text-2xl font-bold text-white tracking-tight mb-3">Still Need Help?</h2>
            <p className="text-white/50 mb-6">
              Our support team is available for enterprise clients and platform partners
            </p>

            <a
              href="mailto:support@hotelsvendors.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#a3e635] hover:bg-[#bef264] text-white text-sm font-medium transition-all"
            >
              <Mail className="w-4 h-4" />
              Email Support
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
