import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Shield,
  FileCheck,
  Lock,
  Scale,
  FileText,
  Server,
  Eye,
  Building2,
  Banknote,
  Gavel,
} from "lucide-react";
import { MarketingNav } from "@/components/layout/marketing-nav";
import { MarketingFooter } from "@/components/layout/marketing-footer";

export const metadata: Metadata = {
  title: "Compliance & Regulatory Standards | HotelsVendors Egypt",
  description: "HotelsVendors compliance framework: ETA e-invoicing, FRA anti-fraud, ISO 27001, SOC 2, data protection, and Egyptian regulatory standards for hospitality procurement.",
};

const REGULATORY_STANDARDS = [
  {
    category: "Tax Compliance",
    icon: FileCheck,
    color: "#84cc16",
    standards: [
      { name: "ETA E-Invoicing — Phase 1 & 2", status: "Compliant", desc: "Direct integration with Egyptian Tax Authority e-invoicing API. RSA 2048-bit digital signing, cryptographic UUID validation, real-time submission.", ref: "Law 67/2018" },
      { name: "GS1/EGS Tax Code Mapping", status: "Implemented", desc: "Alphabetical Canonical flattening logic for product tax codes. Clear token handling rules for accurate ETA submission.", ref: "ETA Technical Spec" },
      { name: "Digital Signature & Audit Trail", status: "Active", desc: "SHA-256 cryptographic audit trail on every transaction state transition. RSA 2048-bit signing for all ETA submissions.", ref: "ETA Phase 2" },
    ],
  },
  {
    category: "Anti-Fraud & Financial",
    icon: Shield,
    color: "#22C55E",
    standards: [
      { name: "FRA Anti-Fraud Compliance", status: "Enforced", desc: "Mandatory three-way matching gate: PO + ETA UUID + Signed Digital Delivery Note. Every transaction cryptographically validated before processing.", ref: "FRA Regulation" },
      { name: "Non-Recourse Factoring Framework", status: "Implemented", desc: "All platform factoring is non-recourse. Supplier default risk transfers at bid acceptance. Licensed grantors underwrite each invoice.", ref: "Law 194/2020" },
      { name: "Anti-Money Laundering (AML) Screening", status: "Active", desc: "Automated PEP screening, velocity checks on orders, amount thresholds, and geolocation verification for all high-value transactions.", ref: "AML Law 80/2002" },
      { name: "Idempotency & Duplicate Prevention", status: "Enforced", desc: "Payment guarantee gate prevents double-funding. ETA UUID lock prevents duplicate invoice submission. SHA-256 chain ensures no state replay.", ref: "Platform Architecture" },
    ],
  },
  {
    category: "Data Protection & Privacy",
    icon: Lock,
    color: "#3B82F6",
    standards: [
      { name: "AES-256-GCM Encryption at Rest", status: "Active", desc: "All enterprise financial data, invoice payloads, and ETA submission records encrypted with AES-256-GCM at rest.", ref: "ISO 27001" },
      { name: "TLS 1.3 Encryption in Transit", status: "Active", desc: "All data in transit protected with TLS 1.3. No unencrypted communication between platform components.", ref: "Platform Architecture" },
      { name: "Tenant Data Isolation", status: "Enforced", desc: "Data is logically isolated per tenant with zero cross-tenant exposure. Every query tenant-scoped at database level.", ref: "GDPR / Law 151/2020" },
      { name: "Data Processing Agreement (DPA)", status: "Available", desc: "HotelsVendors processes data as a technical data orchestrator under explicit DPAs. Never sells or monetizes customer data.", ref: "Law 151/2020" },
    ],
  },
  {
    category: "Security & Infrastructure",
    icon: Server,
    color: "#D4A843",
    standards: [
      { name: "ISO/IEC 27001 Ready Architecture", status: "Audit-Ready", desc: "Information security management system designed for ISO 27001 certification. Policies, procedures, and controls documented.", ref: "ISO 27001:2022" },
      { name: "SOC 2 Type II Ready", status: "Audit-Ready", desc: "Controls for security, availability, processing integrity, confidentiality, and privacy designed for SOC 2 Type II audit.", ref: "SOC 2" },
      { name: "99.99% Uptime Target", status: "Active", desc: "Redundant multi-zone configurations with automated failover. Architecture aligned with CIB and Paymob aggregator SLA expectations.", ref: "SLA" },
      { name: "Offline-First Data Resilience", status: "Implemented", desc: "Local caching stores serialized transactions during connectivity drops. Auto-queued sync on reconnection — zero data loss.", ref: "Platform Architecture" },
    ],
  },
  {
    category: "Governance & Access Control",
    icon: Eye,
    color: "#6366f1",
    standards: [
      { name: "Authority Matrix Enforcement", status: "Active", desc: "Multi-level approval chains based on order value, hotel tier, supplier tier, and user role. No bypass possible.", ref: "Corporate Governance" },
      { name: "RBAC — Server-Side Only", status: "Enforced", desc: "Permissions assigned to tenant-scoped roles. Every API route calls requirePermission() before execution. Client never decides access.", ref: "Platform Architecture" },
      { name: "Dual-Authorization Override", status: "Implemented", desc: "Admin overrides of Authority Matrix require TWO admin signatures, 20+ character reason, and generate escalated alert.", ref: "FRA Guidelines" },
      { name: "JWT Session Management", status: "Active", desc: "Short-lived JWT tokens with clock tolerance checks. Sessions verified at edge middleware before reaching any route.", ref: "OWASP" },
    ],
  },
  {
    category: "Credit & Risk Management",
    icon: Scale,
    color: "#22C55E",
    standards: [
      { name: "I-Score Assessment Readiness", status: "Ready", desc: "Clean real-time risk parameters for hotel creditworthiness. Payment history, credit utilization, dispute rate, ETA compliance scoring.", ref: "I-Score" },
      { name: "AI Credit Risk Scoring", status: "Active", desc: "Hospitality-specific risk model: seasonal cash flows, occupancy rates, payment histories. Weighted composite score (0-100).", ref: "Platform AI" },
      { name: "Payment Guarantee Gate", status: "Enforced", desc: "No order transitions to CONFIRMED, IN_TRANSIT, or DELIVERED without paymentGuaranteed = true. Absolute rule.", ref: "Platform Architecture" },
      { name: "TCP Report — Total Cost of Procurement", status: "Available", desc: "Counter the 'cheaper offline' objection with real total cost analysis including hidden costs: capital, compliance risk, logistics fragmentation.", ref: "Platform Feature" },
    ],
  },
];

const LEGAL_FRAMEWORKS = [
  { code: "Law 67/2018", name: "ETA E-Invoicing Regulation", desc: "Mandates electronic invoicing for B2B transactions. All platform invoices comply with digital signature and UUID requirements." },
  { code: "Law 194/2020", name: "Fintech for Non-Banking Financial Activities", desc: "Regulates factoring, crowdfunding, and digital financial services. Platform factoring partners hold valid FRA licenses." },
  { code: "Law 151/2020", name: "Personal Data Protection Law", desc: "Egypt's data privacy framework. Platform enforces tenant isolation, encryption, and data processing agreements." },
  { code: "Law 80/2002", name: "Anti-Money Laundering Law", desc: "AML/CFT framework. Platform includes automated screening, velocity checks, and suspicious transaction reporting." },
  { code: "CBE Regulations", name: "Central Bank of Egypt — Payment Systems", desc: "Payment processing and settlement rules. Platform routes funds through licensed banks with full CBE compliance." },
];

const AUDIT_CERTIFICATIONS = [
  { icon: FileCheck, label: "ETA Phase 1 & 2 Compliant", desc: "Egyptian Tax Authority e-invoicing", color: "#84cc16" },
  { icon: Shield, label: "FRA Anti-Fraud — 3-Way Match", desc: "PO + ETA UUID + Signed GRN", color: "#22C55E" },
  { icon: Lock, label: "AES-256-GCM at Rest", desc: "Enterprise data encryption", color: "#3B82F6" },
  { icon: Server, label: "99.99% Uptime SLA", desc: "Multi-zone redundant infrastructure", color: "#D4A843" },
  { icon: Eye, label: "ISO 27001 Ready", desc: "Information security management", color: "#6366f1" },
  { icon: Scale, label: "SOC 2 Type II Ready", desc: "Audit-ready controls", color: "#22C55E" },
];

export default function CompliancePage() {
  return (
    <main style={{ backgroundColor: "#000000", color: "#ffffff", minHeight: "100vh" }}>
      <MarketingNav />
      {/* Hero */}
      <section className="pt-28 pb-16 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(132,204,22,0.03) 0%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <span className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-3 block">Compliance & Regulatory</span>
          <h1 className="text-[clamp(30px,5vw,52px)] font-medium leading-[1.05] tracking-tight mb-5 text-white">
            Regulatory Compliance
            <br />
            <span className="text-gradient-lime">Built Into Every Transaction.<br />Not Bolted On After.</span>
          </h1>
          <p className="text-[15px] text-white/40 max-w-2xl leading-relaxed">
            HotelsVendors is architected from the ground up for Egyptian regulatory compliance. From ETA e-invoicing to FRA anti-fraud standards, every layer of the platform enforces compliance automatically — no manual intervention required.
          </p>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="py-8 border-y" style={{ borderColor: "rgba(255,255,255,0.04)", backgroundColor: "#030303" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap justify-center gap-8">
            {AUDIT_CERTIFICATIONS.map((cert) => (
              <div key={cert.label} className="flex items-center gap-3">
                <cert.icon size={16} style={{ color: cert.color }} />
                <div>
                  <p className="text-[11px] font-medium text-white/60">{cert.label}</p>
                  <p className="text-[9px] text-white/25">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Standards by Category */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 space-y-10">
          {REGULATORY_STANDARDS.map((group) => (
            <div key={group.category}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: group.color + "15" }}>
                  <group.icon size={18} style={{ color: group.color }} />
                </div>
                <h2 className="text-[18px] font-medium text-white">{group.category}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {group.standards.map((s) => (
                  <div key={s.name} className="rounded-xl p-5 transition-all hover:border-white/15" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-[13px] font-medium text-white leading-snug">{s.name}</h3>
                      <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full flex-shrink-0 ml-3" style={{ backgroundColor: group.color + "15", color: group.color }}>
                        {s.status}
                      </span>
                    </div>
                    <p className="text-[12px] text-white/40 leading-relaxed mb-2">{s.desc}</p>
                    <span className="text-[10px] text-white/20 font-mono">{s.ref}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Legal Frameworks */}
      <section className="py-16" style={{ backgroundColor: "#050505" }}>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-10">
            <Gavel size={24} className="mx-auto mb-3" style={{ color: "#84cc16" }} />
            <h2 className="text-[11px] font-medium text-white/30 uppercase tracking-[0.15em] mb-2">Applicable Egyptian Laws & Regulations</h2>
            <p className="text-[14px] text-white/40 max-w-xl mx-auto">The platform is designed to comply with the following Egyptian legal frameworks:</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {LEGAL_FRAMEWORKS.map((law) => (
              <div key={law.code} className="rounded-xl p-5 transition-all hover:border-white/15" style={{ backgroundColor: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}>
                <span className="text-[10px] font-mono font-medium" style={{ color: "#84cc16" }}>{law.code}</span>
                <h3 className="text-[13px] font-medium text-white mt-1 mb-2">{law.name}</h3>
                <p className="text-[11px] text-white/40 leading-relaxed">{law.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <Building2 size={28} className="mx-auto mb-6" style={{ color: "#84cc16" }} />
          <h2 className="text-[24px] font-medium mb-4 text-white">Need a Compliance Walkthrough?</h2>
          <p className="text-[13px] text-white/40 mb-8 max-w-lg mx-auto">Schedule a dedicated session with our compliance team to review how HotelsVendors meets your regulatory requirements.</p>
          <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 text-[13px] font-medium rounded-xl transition-all hover:shadow-[0_0_30px_rgba(132,204,22,0.2)]" style={{ backgroundColor: "#84cc16", color: "#000000" }}>
            Request Compliance Review <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      <MarketingFooter />
    </main>
  );
}

