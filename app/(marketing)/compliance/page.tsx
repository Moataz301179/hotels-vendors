import type { Metadata } from "next";
import { FileCheck, Shield, Lock, Globe, Mail, CreditCard } from "lucide-react";

export const metadata: Metadata = {
  title: "Compliance — Regulatory Framework | HotelsVendors",
  description: "Full compliance with Egyptian Tax Authority requirements, financial services regulations, and international data protection standards.",
};

export default function CompliancePage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <section className="pt-28 pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Compliance</span>
          <h1 className="text-[clamp(28px,4vw,48px)] font-bold leading-[1.1] mb-5 text-white">Regulatory Compliance Framework</h1>
          <p className="text-[13px] text-white/40 max-w-2xl">Full compliance with Egyptian Tax Authority requirements, financial services regulations, and international data protection standards.</p>
        </div>
      </section>
      <section className="pb-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-3 mb-4">
              <FileCheck size={20} style={{ color: "#3B82F6" }} />
              <div>
                <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Primary</span>
                <h2 className="text-[18px] font-bold text-white">ETA E-Invoicing Compliance</h2>
              </div>
            </div>
            <p className="text-[13px] text-white/40 max-w-2xl mb-6">Native integration with the Egyptian Tax Authority ensures all invoices meet Phase 1 and Phase 2 requirements. Our system handles document signing, UUID generation, and real-time portal submission automatically.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {["RSA 2048-bit digital signing", "UUID-based invoice tracking", "Real-time ETA portal submission", "Phase 1 & 2 compliance", "Penalty prevention automation", "Submission audit trail"].map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-[12px] text-white/40"><span className="w-1 h-1 rounded-full" style={{ backgroundColor: "#39FF14" }} />{f}</div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20" style={{ backgroundColor: "#0a0a0a" }}>
        <div className="mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Coverage</span>
          <h2 className="text-[20px] font-bold mb-8 text-white">Compliance Areas</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: FileCheck, title: "ETA Compliance", desc: "Full Egyptian Tax Authority Phase 1 & 2 e-invoicing compliance." },
              { icon: Shield, title: "FRS Alignment", desc: "Aligned with Egyptian Financial Regulatory Standards." },
              { icon: Lock, title: "Data Protection", desc: "GDPR-aligned with encryption, access controls, audit trails." },
              { icon: Globe, title: "Anti-Spam", desc: "Strict anti-spam policies compliant with regulations." },
              { icon: Mail, title: "Email Security", desc: "SPF, DKIM, DMARC for all platform communications." },
              { icon: CreditCard, title: "PCI-DSS Roadmap", desc: "Payment Card Industry standards compliance planned." },
            ].map((a, i) => (
              <div key={i} className="rounded-2xl p-6" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "rgba(255,255,255,0.04)" }}><a.icon size={18} style={{ color: "rgba(255,255,255,0.3)" }} /></div>
                <h3 className="text-[13px] font-bold mb-2 text-white">{a.title}</h3>
                <p className="text-[11px] text-white/40">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl p-6" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
            <h3 className="text-[14px] font-bold mb-3 text-white">Financial Services Disclaimer</h3>
            <p className="text-[12px] text-white/40 leading-relaxed mb-3">HotelsVendors (Returants for E-Marketing, CR: 105300900196948) operates as an e-commerce aggregator and technology platform. We do NOT hold a financial services license.</p>
            <ul className="space-y-1.5 text-[11px] text-white/25 mb-3">
              <li>· We do NOT hold client funds or act as a payment intermediary</li>
              <li>· We do NOT approve, underwrite, or guarantee credit facilities</li>
              <li>· We do NOT assume credit risk or default liability</li>
            </ul>
            <p className="text-[11px] text-white/25 leading-relaxed">All factoring, credit lines, and financial facilities are provided exclusively by licensed third-party grantors (OLIV, ValU, CIB Factoring, Fawry). HotelsVendors facilitates document validation, coordination, and compliance auditing only.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
