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
      "HotelsVendors is Egypt's first AI-native B2B procurement platform built exclusively for the hospitality sector. It connects hotels, suppliers, factoring companies, and logistics providers in one unified platform — with built-in ETA e-invoicing compliance, AI demand forecasting, and embedded reverse factoring for supplier settlement within 48 hours.",
    answerAr:
      "هوتيلز فيندورز هي أول منصة ذكاء اصطناعي للشراء بين الشركات في مصر، مصممة حصرياً لقطاع الضيافة. تربط المنشآت الفندقية والموردين وشركات التمويل ومقدمي الخدمات اللوجستية في منصة موحدة.",
    category: "General",
  },
  {
    question: "How does the free trial work?",
    questionAr: "كيف تعمل التجربة المجانية؟",
    answer:
      "Hotels can join HotelsVendors free of charge. There is no subscription fee to start. You get full access to the procurement dashboard, AI forecasting, supplier marketplace (INVO), and ETA-compliant invoicing. We only earn when value is exchanged — 1% on bank transfers and 1.5–3% on factoring services.",
    answerAr:
      "يمكن للفنادق الانضمام مجاناً. لا يوجد اشتراك للبدء. تحصل على وصول كامل للوحة التحكم والتنبؤ الذكي وسوق الموردين والفوترة الإلكترونية. نربح فقط عند تبادل القيمة.",
    category: "General",
  },
  {
    question: "What suppliers are available on the platform?",
    questionAr: "ما الموردين المتاحين على المنصة؟",
    answer:
      "INVO — our vendor marketplace — aggregates suppliers across food & beverages, cleaning supplies, hotel linens, FF&E, pool chemicals, and hospitality services. We have 680+ verified suppliers across 6 Egyptian governorates, with new suppliers onboarding weekly. If a specific supplier you need isn't listed, our AI agent can source them for you.",
    answerAr:
      "تجمع منصة إنفو الموردين في قطاعات الأغذية والمشروبات ومستلزمات النظافة والمفروشات والمعدات. لدينا أكثر من 680 مورداً معتمداً عبر 6 محافظات مصرية.",
    category: "Suppliers",
  },
  {
    question: "How much can my hotel save?",
    questionAr: "كم يمكن أن يوفر فندقي؟",
    answer:
      "Hotels using HotelsVendors typically see 15–25% reduction in procurement costs through AI-optimized ordering, shared-route logistics (up to 40% logistics cost reduction), and competitive supplier pricing. Our AI demand forecasting achieves 94% accuracy, reducing waste and emergency orders.",
    answerAr:
      "توفر الفنادق عادةً 15-25% من تكاليف المشتريات من خلال الطلب الذكي واللوجستيات المشتركة والتسعير التنافسي. دقة التنبؤ الذكي تصل إلى 94%.",
    category: "Pricing",
  },
  {
    question: "What is ETA compliance and why does it matter?",
    questionAr: "ما هو الامتثال لهيئة الضرائب الإلكترونية ولماذا هو مهم؟",
    answer:
      "ETA (Egyptian Tax Authority) e-invoicing is mandatory for all B2B transactions in Egypt. Every invoice must be digitally signed with RSA 2048-bit encryption and submitted to the Tax Authority via API. HotelsVendors handles this automatically — every invoice generated on our platform is ETA-compliant out of the box, with cryptographic UUID validation and SHA-256 audit trails.",
    answerAr:
      "الفوترة الإلكترونية لهيئة الضرائب المصرية إلزامية لجميع المعاملات التجارية. يجب توقيع كل فاتورة رقمياً وإرسالها عبر واجهة برمجة التطبيقات. هوتيلز فيندورز يتعامل مع هذا تلقائياً.",
    category: "Compliance",
  },
  {
    question: "How does reverse factoring work?",
    questionAr: "كيف يعمل التمويل العكسي؟",
    answer:
      "When a supplier delivers goods and submits an ETA-compliant invoice, they can request early payment through our reverse factoring module. Licensed factoring companies bid on the invoice. The winning funder pays the supplier within 48 hours (minus a 1.5–3% fee). The hotel keeps its original Net-30/Net-60 payment terms. This is fully compliant with FRA anti-fraud regulations.",
    answerAr:
      "عندما يسلم المورد البضائع ويرسل فاتورة متوافق مع هيئة الضرائب، يمكنه طلب الدفع المبكر عبر التمويل العكسي. شركات التمويل المرخصة تناقص على الفاتورة. الممول الفائز يدفع للمورد خلال 48 ساعة.",
    category: "Factoring",
  },
  {
    question: "Is my data secure on HotelsVendors?",
    questionAr: "هل بياناتي آمنة على هوتيلز فيندورز؟",
    answer:
      "Yes. We use AES-256-GCM encryption for data at rest, TLS 1.3 for data in transit, and RSA 2048-bit signing for all ETA invoices. Each tenant's data is fully isolated — hotels cannot see other hotels' data, and suppliers cannot access other suppliers' information. We are ISO 27001 aligned and undergo regular security audits.",
    answerAr:
      "نعم. نستخدم تشفير AES-256-GCM للبيانات المخزنة وTLS 1.3 للبيانات المنقولة. بيانات كل مستأجر معزولة بالكامل. نتوافق مع معايير ISO 27001 ونخضع لتدقيقات أمنية دورية.",
    category: "Security",
  },
  {
    question: "What is INVO?",
    questionAr: "ما هي منصة إنفو؟",
    answer:
      "INVO is HotelsVendors' vendor marketplace sub-layer. It aggregates supplier catalogs via API and plugin integrations from global and local supply networks. Hotels browse INVO to discover, compare, and order from verified suppliers. Every transaction flows up to HotelsVendors for settlement, compliance, and factoring.",
    answerAr:
      "إنفو هي طبقة سوق الموردين التابعة لهوتيلز فيندورز. تجمع كتالوجات الموردين عبر واجهات برمجة التطبيقات والتكاملات. تتصفح الفنادق إنفو لاكتشاف ومقارنة والطلب من موردين معتمدين.",
    category: "Platform",
  },
  {
    question: "How long does supplier onboarding take?",
    questionAr: "كم يستغرق تسجيل مورد جديد؟",
    answer:
      "Supplier onboarding takes under 24 hours. The supplier submits their commercial registry, tax ID, and product catalog. Our AI agent validates the documents, sets up their ETA-compliant invoicing pipeline, and activates their INVO marketplace listing. Most suppliers are live within one business day.",
    answerAr:
      "يستغرق تسجيل المورد أقل من 24 ساعة. يقدم المورد السجل التجاري والرقم الضريبي وكتالوج المنتجات. يتحقق العميل الذكي من المستندات وينشئ خط أنابيب الفوترة الإلكترونية.",
    category: "Suppliers",
  },
  {
    question: "What regions in Egypt do you cover?",
    questionAr: "ما المناطق في مصر التي تغطونها؟",
    answer:
      "We currently cover 6 governorates: Cairo, Alexandria, Giza, Red Sea (Hurghada), South Sinai (Sharm El-Sheikh), and Matrouh (North Coast). Our Shark-Breaker shared logistics model is optimized for coastal resorts, with hub-and-spoke delivery to Red Sea and South Sinai properties.",
    answerAr:
      "نغطي حالياً 6 محافظات: القاهرة والإسكندرية والجيزة والبحر الأحمر (الغردقة) وجناء سيناء (شرم الشيخ) ومطروح (الساحل الشمالي). نموذج اللوجستيات المشتركة مُحسّن للمنتجعات الساحلية.",
    category: "Platform",
  },
  {
    question: "Can I integrate HotelsVendors with my existing hotel ERP?",
    questionAr: "هل يمكنني ربط هوتيلز فيندورز بنظام تخطيط الموارد الفندقي الحالي؟",
    answer:
      "Yes. HotelsVendors provides REST APIs and webhook integrations for hotel ERP systems including Opera, Fidelio, and custom PMS solutions. Our AI agents can sync purchase orders, invoices, and inventory data bidirectionally. Contact our enterprise team for custom integration support.",
    answerAr:
      "نعم. توفر هوتيلز فيندورز واجهات برمجة تطبيقات وتكاملات webhook لأنظمة تخطيط الموارد الفندقية مثل Opera وFidelio. يمكن للعملاء الذكيين مزامنة أوامر الشراء والفواتير وبيانات المخزون.",
    category: "Platform",
  },
  {
    question: "What are the legal terms of using HotelsVendors?",
    questionAr: "ما الشروط القانونية لاستخدام هوتيلز فيندورز؟",
    answer:
      "HotelsVendors is owned and operated by Restaurants for E-Marketing (Tax ID: 704226146, Commercial Registry: 105300900196948). We operate strictly as a technical data orchestrator — we do not hold cash, do not provide factoring directly, and are not a bank. All financial transactions are processed through licensed financial institutions. Our full terms, privacy policy, and compliance documentation are available on our website.",
    answerAr:
      "هوتيلز فيندورز مملوكة وتُدار بواسطة مطاعم للتسويق الإلكتروني. نعمل كمنسق بيانات تقني فقط — لا نحتفظ بالنقود ولا نقدم التمويل مباشرة. جميع المعاملات المالية تتم عبر مؤسسات مالية مرخصة.",
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
