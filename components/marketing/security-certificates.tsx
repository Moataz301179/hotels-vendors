"use client";

import { Shield, Lock, FileCheck, Server, Eye, Fingerprint } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

const CERTIFICATES = [
  {
    icon: Shield,
    title: "ETA Phase 1 & 2 Compliant",
    titleAr: "متوافق مع الفوترة الإلكترونية — المرحلة الأولى والثانية",
    desc: "Full integration with Egyptian Tax Authority e-invoicing pipeline. RSA 2048-bit digital signing, cryptographic UUID validation, and real-time submission.",
    descAr: "تكامل كامل مع خط أنابيب الفوترة الإلكترونية لهيئة الضرائب المصرية. توقيع رقمي RSA 2048 بت وتحقق UUID تشفيري.",
    status: "Active",
    color: "#22C55E",
  },
  {
    icon: Lock,
    title: "AES-256-GCM Encryption",
    titleAr: "تشفير AES-256-GCM",
    desc: "All data at rest is encrypted using AES-256-GCM — the same standard used by financial institutions. Keys rotated every 90 days via AWS KMS.",
    descAr: "جميع البيانات المخزنة مشفرة باستخدام AES-256-GCM — نفس المعيار المستخدم من قبل المؤسسات المالية. تدوير المفاتيح كل 90 يوماً.",
    status: "Active",
    color: "#3B82F6",
  },
  {
    icon: FileCheck,
    title: "ISO 27001 Aligned",
    titleAr: "متوافق مع معيار ISO 27001",
    desc: "Information security management system aligned with ISO 27001 standards. Regular third-party audits and penetration testing.",
    descAr: "نظام إدارة أمن المعلومات متوافق مع معايير ISO 27001. تدقيقات دورية من جهات خارجية واختبارات اختراق.",
    status: "Certified",
    color: "#FFB000",
  },
  {
    icon: Server,
    title: "Data Residency — Egypt",
    titleAr: "إقامة البيانات — مصر",
    desc: "All tenant data is hosted on servers located within Egypt. No data leaves Egyptian jurisdiction without explicit consent.",
    descAr: "جميع بيانات المستأجرين مستضافة على خوادم داخل مصر. لا تغادر البيانات الأراضي المصرية دون موافقة صريحة.",
    status: "Active",
    color: "#8B5CF6",
  },
  {
    icon: Eye,
    title: "FRA Anti-Fraud Compliance",
    titleAr: "متوافق مع مكافحة الاحتيال — هيئة الرقابة المالية",
    desc: "Three-way matching (PO + ETA UUID + Signed Delivery Note), SHA-256 audit trails, and real-time fraud detection on all transactions.",
    descAr: "مطابقة ثلاثية (أمر شراء + UUID الفاتورة + إيصال تسليم موقّع) ومسارات تدقيق SHA-256 وكشف احتيال فوري.",
    status: "Active",
    color: "#EF4444",
  },
  {
    icon: Fingerprint,
    title: "Tenant Data Isolation",
    titleAr: "عزل بيانات المستأجرين",
    desc: "Each hotel, supplier, and funder operates in a fully isolated data scope. Cross-tenant data access is architecturally impossible.",
    descAr: "يعمل كل فندق ومورد وممول في نطاق بيانات معزول بالكامل. الوصول لبيانات مستأجر آخر مستحيل هندسياً.",
    status: "Enforced",
    color: "#06B6D4",
  },
];

export function SecurityCertificates() {
  const { mode } = useTheme();
  const isLight = false;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="text-[11px] font-medium uppercase tracking-[0.15em] mb-3 block"
            style={{ color: isLight ? "#581c87" : "#FFB000" }}
          >
            Security & Compliance · الأمان والامتثال
          </span>
          <h2 className={`text-[26px] sm:text-[32px] font-semibold tracking-tight mb-3 ${isLight ? "text-gray-900" : "text-white"}`}>
            Bank-Grade Security Infrastructure
          </h2>
          <p className={`text-[14px] max-w-2xl mx-auto leading-relaxed ${isLight ? "text-gray-500" : "text-white/50"}`}>
            Every transaction, every invoice, every data point — protected by cryptographic standards trusted by Egypt&apos;s financial institutions.
            <br />
            <span dir="rtl" className="text-[13px]">كل معاملة، كل فاتورة، كل نقطة بيانات — محمية بمعايير تشفير تثق بها المؤسسات المالية المصرية.</span>
          </p>
        </div>

        {/* Certificates Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.title}
              className="rounded-2xl p-6 transition-all hover:scale-[1.01]"
              style={{
                backgroundColor: isLight ? "#ffffff" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: cert.color + "15" }}
                >
                  <cert.icon size={20} style={{ color: cert.color }} />
                </div>
                <span
                  className="text-[9px] font-medium px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: cert.color + "15",
                    color: cert.color,
                  }}
                >
                  {cert.status}
                </span>
              </div>

              <h3 className={`text-[14px] font-semibold mb-1 ${isLight ? "text-gray-800" : "text-white/80"}`}>
                {cert.title}
              </h3>
              <p className={`text-[10px] mb-3 ${isLight ? "text-gray-400" : "text-white/30"}`} dir="rtl">
                {cert.titleAr}
              </p>
              <p className={`text-[12px] leading-relaxed mb-2 ${isLight ? "text-gray-600" : "text-white/50"}`}>
                {cert.desc}
              </p>
              <p className={`text-[11px] leading-relaxed ${isLight ? "text-gray-400" : "text-white/30"}`} dir="rtl">
                {cert.descAr}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <div
          className="mt-10 rounded-xl p-5 text-center"
          style={{
            backgroundColor: isLight ? "rgba(88,28,135,0.03)" : "rgba(255,176,0,0.03)",
            border: `1px solid ${isLight ? "rgba(88,28,135,0.08)" : "rgba(255,176,0,0.08)"}`,
          }}
        >
          <p className={`text-[12px] ${isLight ? "text-gray-600" : "text-white/50"}`}>
            <strong style={{ color: isLight ? "#581c87" : "#FFB000" }}>Restaurants for E-Marketing</strong> operates as a{" "}
            <strong className={isLight ? "text-gray-700" : "text-white/60"}>technical data orchestrator</strong> — not a bank, not a payment service provider, not a factoring company.
            All financial flows are processed through licensed institutions. Zero liability for counterparty collection defaults.
          </p>
          <p className={`text-[11px] mt-2 ${isLight ? "text-gray-400" : "text-white/30"}`} dir="rtl">
            تعمل مطاعم للتسويق الإلكتروني كمنسق بيانات تقني — ليست بنكاً ولا مزود خدمات دفع. جميع التدفقات المالية تتم عبر مؤسسات مرخصة. مسؤولية صفرية عن تعثر تحصيل الطرف الآخر.
          </p>
        </div>
      </div>
    </section>
  );
}
