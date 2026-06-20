"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useTheme } from "@/components/theme/theme-provider";

interface FAQItem {
  question: string;
  questionAr: string;
  answer: string;
  answerAr: string;
  category: string;
}

const FAQS: FAQItem[] = [
  {
    question: "What is HotelsVendors?",
    questionAr: "ما هي هوتيلز فيندورز؟",
    answer:
      "HotelsVendors is Egypt's B2B procurement platform built for the hospitality sector. It connects three stakeholders in one system: hotels (who buy), suppliers (who sell), and funders (who finance). AI agents handle forecasting, ordering, compliance, and settlement — so your team spends less time on paperwork and more time running the hotel.",
    answerAr:
      "هوتيلز فيندورز هي منصة الشراء بين الشركات في مصر المصممة لقطاع الضيافة. تربط الفنادق والموردين والممولين في نظام واحد. يتولى العملاء الذكيون التنبؤ والطلب والامتثال والتسوية.",
    category: "General",
  },
  {
    question: "How does the free trial work?",
    questionAr: "كيف تعمل التجربة المجانية؟",
    answer:
      "Hotels join free — no subscription, no setup fee, no credit card. You get the full procurement dashboard, AI forecasting, the INVO supplier marketplace, and ETA-compliant invoicing from day one. We only earn when you transact: 1% on bank transfers, 1.5–3% on factoring services.",
    answerAr:
      "تنضم الفنادق مجاناً — بدون اشتراك أو رسوم إعداد أو بطاقة ائتمان. تحصل على لوحة التحكم الكاملة والتنبؤ الذكي وسوق الموردين والفوترة الإلكترونية من اليوم الأول. نربح فقط عند المعاملات.",
    category: "General",
  },
  {
    question: "What suppliers are available on the platform?",
    questionAr: "ما الموردين المتاحين على المنصة؟",
    answer:
      "INVO — our supplier marketplace — has 680+ verified vendors across 6 governorates. Categories include F&B, cleaning chemicals, linens, FF&E, pool chemicals, and hospitality services. New suppliers join weekly. If you can't find a specific vendor, our AI agent will source and onboard them for you.",
    answerAr:
      "تحتوي منصة إنفو على أكثر من 680 مورداً معتمداً عبر 6 محافظات. تشمل الفئات الأغذية والمشروبات والمواد الكيميائية والمفروشات والمعدات. ينضم موردون جدد أسبوعياً.",
    category: "Suppliers",
  },
  {
    question: "How much can my hotel save?",
    questionAr: "كم يمكن أن يوفر فندقي؟",
    answer:
      "Hotels on HotelsVendors typically cut procurement costs by 15–25%. That comes from three sources: AI-optimized ordering (94% forecast accuracy reduces waste and emergency purchases), shared-route logistics (up to 40% delivery cost reduction), and competitive supplier pricing through INVO.",
    answerAr:
      "تخفض الفنادق على هوتيلز فيندورز تكاليف المشتريات عادةً بنسبة 15-25%. من خلال الطلب الذكي بدقة تنبؤ 94% واللوجستيات المشتركة والتسعير التنافسي عبر إنفو.",
    category: "Pricing",
  },
  {
    question: "What is ETA compliance and why does it matter?",
    questionAr: "ما هو الامتثال لهيئة الضرائب الإلكترونية ولماذا هو مهم؟",
    answer:
      "Egyptian Tax Authority (ETA) e-invoicing is mandatory for all B2B transactions. Every invoice must be digitally signed, UUID-validated, and submitted to the Tax Authority in real time. HotelsVendors does this automatically — every invoice is ETA-compliant by default, with SHA-256 audit trails. You never have to think about tax compliance again.",
    answerAr:
      "الفوترة الإلكترونية لهيئة الضرائب المصرية إلزامية لجميع المعاملات التجارية. يجب توقيع كل فاتورة رقمياً والتحقق منها وإرسالها في الوقت الفعلي. هوتيلز فيندورز يفعل هذا تلقائياً.",
    category: "Compliance",
  },
  {
    question: "How does reverse factoring work?",
    questionAr: "كيف يعمل التمويل العكسي؟",
    answer:
      "After a supplier delivers goods and submits an ETA-compliant invoice, they can request early payment. Licensed factoring companies compete to buy the invoice at the best rate. The supplier gets paid within 48 hours (minus a 1.5–3% fee). The hotel keeps its original Net-30/Net-60 terms. Fully FRA-compliant with three-way matching on every transaction.",
    answerAr:
      "بعد تسليم البضائع وتقديم فاتورة متوافقة، يمكن للمورد طلب الدفع المبكر. تتنافس شركات التمويل المرخصة. يحصل المورد على الدفع خلال 48 ساعة. يحتفظ الفندق بشروط الدفع الأصلية.",
    category: "Factoring",
  },
  {
    question: "Is my data secure on HotelsVendors?",
    questionAr: "هل بياناتي آمنة على هوتيلز فيندورز؟",
    answer:
      "Yes. AES-256-GCM encryption at rest. TLS 1.3 in transit. RSA 2048-bit digital signatures on every ETA invoice. Each tenant's data is architecturally isolated — hotels can't see other hotels' data, suppliers can't see other suppliers'. ISO 27001 aligned, with regular third-party penetration testing.",
    answerAr:
      "نعم. تشفير AES-256-GCM للبيانات المخزنة وTLS 1.3 للبيانات المنقولة. توقيع رقمي RSA 2048 بت على كل فاتورة. بيانات كل مستأجر معزولة هندسياً. متوافق مع ISO 27001.",
    category: "Security",
  },
  {
    question: "What is INVO?",
    questionAr: "ما هي منصة إنفو؟",
    answer:
      "INVO is the supplier marketplace layer of HotelsVendors. It's where hotels discover, compare, and order from 680+ verified suppliers. Every transaction on INVO flows up to HotelsVendors for settlement, ETA compliance, and optional reverse factoring. Think of it as the storefront — HotelsVendors is the engine behind it.",
    answerAr:
      "إنفو هي طبقة سوق الموردين في هوتيلز فيندورز. حيث تكتشف الفنادق وتقارن وتطلب من أكثر من 680 مورداً معتمداً. كل معاملة على إنفو تتدفق إلى هوتيلز فيندورز للتسوية والامتثال.",
    category: "Platform",
  },
  {
    question: "How long does supplier onboarding take?",
    questionAr: "كم يستغرق تسجيل مورد جديد؟",
    answer:
      "Under 24 hours. The supplier submits their commercial registry, tax ID, and product catalog. Our AI agent validates the documents, configures their ETA-compliant invoicing pipeline, and activates their INVO listing. Most suppliers go live within one business day — not weeks.",
    answerAr:
      "أقل من 24 ساعة. يقدم المورد السجل التجاري والرقم الضريبي وكتالوج المنتجات. يتحقق العميل الذكي من المستندات وينشئ خط أنابيب الفوترة. معظم الموردين ينطلقون خلال يوم عمل واحد.",
    category: "Suppliers",
  },
  {
    question: "What regions in Egypt do you cover?",
    questionAr: "ما المناطق في مصر التي تغطونها؟",
    answer:
      "6 governorates: Cairo, Alexandria, Giza, Red Sea (Hurghada), South Sinai (Sharm El-Sheikh), and Matrouh (North Coast). Our Shark-Breaker shared logistics model is purpose-built for coastal resorts — hub-and-spoke delivery to Red Sea and South Sinai properties where traditional logistics are expensive and unreliable.",
    answerAr:
      "6 محافظات: القاهرة والإسكندرية والجيزة والبحر الأحمر وجنوب سيناء ومطروح. نموذج اللوجستيات المشتركة مصمم للمنتجعات الساحلية حيث تكون اللوجستيات التقليدية مكلفة وغير موثوقة.",
    category: "Platform",
  },
  {
    question: "Can I integrate HotelsVendors with my existing hotel ERP?",
    questionAr: "هل يمكنني ربط هوتيلز فيندورز بنظام تخطيط الموارد الفندقي الحالي؟",
    answer:
      "Yes. We provide REST APIs and webhooks for Opera, Fidelio, and custom PMS systems. AI agents sync purchase orders, invoices, and inventory data bidirectionally. Enterprise customers get dedicated integration support — contact our team for a custom integration plan.",
    answerAr:
      "نعم. نوفر واجهات برمجة تطبيقات وتكاملات webhook لأنظمة Opera وFidelio وأنظمة PMS المخصصة. العملاء الذكيون يزامنون أوامر الشراء والفواتير والمخزون في كلا الاتجاهين.",
    category: "Platform",
  },
  {
    question: "What are the legal terms of using HotelsVendors?",
    questionAr: "ما الشروط القانونية لاستخدام هوتيلز فيندورز؟",
    answer:
      "HotelsVendors is operated by Restaurants for E-Marketing (Tax ID: 704226146, Commercial Registry: 105300900196948). We are a technical data orchestrator — not a bank, not a payment provider, not a factoring company. All financial flows go through licensed institutions. We have zero liability for counterparty collection defaults. Full terms and compliance docs are available on request.",
    answerAr:
      "تُدار هوتيلز فيندورز بواسطة مطاعم للتسويق الإلكتروني. نحن منسق بيانات تقني — لسنا بنكاً ولا مزود دفع. جميع التدفقات المالية تمر عبر مؤسسات مرخصة. مسؤولية صفرية عن تعثر التحصيل.",
    category: "Legal",
  },
];

const CATEGORIES = ["All", "General", "Platform", "Suppliers", "Pricing", "Compliance", "Factoring", "Security", "Legal"];

export function FAQSection() {
  const { mode } = useTheme();
  const isLight = false;
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = activeCategory === "All" ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div>
      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
            className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
            style={{
              backgroundColor: activeCategory === cat
                ? (isLight ? "#581c87" : "#FFB000")
                : (isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"),
              color: activeCategory === cat
                ? "#ffffff"
                : (isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.4)"),
              border: `1px solid ${activeCategory === cat
                ? (isLight ? "#581c87" : "#FFB000")
                : (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)")}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ items */}
      <div className="space-y-2">
        {filtered.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.question}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                backgroundColor: isLight ? "#ffffff" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isLight
                  ? (isOpen ? "rgba(88,28,135,0.2)" : "rgba(0,0,0,0.06)")
                  : (isOpen ? "rgba(255,176,0,0.2)" : "rgba(255,255,255,0.06)")}`,
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: isLight ? "rgba(88,28,135,0.08)" : "rgba(255,176,0,0.08)",
                      color: isLight ? "#581c87" : "#FFB000",
                    }}
                  >
                    {faq.category}
                  </span>
                  <span className={`text-[13px] font-medium ${isLight ? "text-gray-800" : "text-white/80"}`}>
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  style={{ color: isLight ? "#581c87" : "#FFB000" }}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4">
                  <p className={`text-[12px] leading-relaxed mb-3 ${isLight ? "text-gray-600" : "text-white/50"}`}>
                    {faq.answer}
                  </p>
                  <p className={`text-[12px] leading-relaxed ${isLight ? "text-gray-500" : "text-white/35"}`} dir="rtl">
                    {faq.answerAr}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
