"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
      "HotelsVendors is Egypt's B2B procurement platform built for coastal hospitality. We connect hotels, suppliers, and funders in one system — with AI handling forecasting, ordering, ETA e-invoicing compliance, and supplier settlement. Purpose-built for Red Sea resorts in Sharm El-Sheikh and Hurghada.",
    answerAr:
      "هوتيلز فيندورز هي منصة الشراء بين الشركات في مصر المصممة للضيافة الساحلية. نربط الفنادق والموردين والممولين في نظام واحد مع ذكاء اصطناعي للتنبؤ والطلب والامتثال الضريبي والتسوية.",
    category: "General",
  },
  {
    question: "How does the free trial work?",
    questionAr: "كيف تعمل التجربة المجانية؟",
    answer:
      "Hotels join free — no subscription, no setup fee, no credit card. You get full access to the procurement dashboard, AI forecasting, the INVO marketplace with 680+ suppliers, and automatic ETA e-invoicing. We earn only on transactions: 1% on bank transfers, 1.5–3% on factoring services.",
    answerAr:
      "تنضم الفنادق مجاناً — بدون اشتراك أو رسوم إعداد أو بطاقة ائتمان. تحصل على لوحة التحكم الكاملة والتنبؤ الذكي وسوق إنفو مع أكثر من 680 مورداً.",
    category: "General",
  },
  {
    question: "How much can my hotel save?",
    questionAr: "كم يمكن أن يوفر فندقي؟",
    answer:
      "Hotels on HotelsVendors cut procurement costs by 15–25% on average. For a 300-room Red Sea resort spending EGP 8M annually on supplies, that's EGP 1.2–2M saved. The biggest savings come from AI ordering (94% forecast accuracy means fewer emergency purchases) and shared-route logistics (up to 40% lower delivery costs).",
    answerAr:
      "تخفض الفنادق تكاليف المشتريات بنسبة 15-25% في المتوسط. لمنتجع 300 غرفة ينفق 8 ملايين جنيه سنوياً، يعني ذلك توفير 1.2-2 مليون جنيه.",
    category: "Pricing",
  },
  {
    question: "What is ETA compliance and why does it matter?",
    questionAr: "ما هو الامتثال لهيئة الضرائب الإلكترونية؟",
    answer:
      "Egyptian Tax Authority (ETA) e-invoicing is mandatory for all B2B transactions. Every invoice must be digitally signed, UUID-validated, and submitted to the Tax Authority in real time. HotelsVendors does this automatically — every invoice is ETA-compliant by default, with SHA-256 audit trails.",
    answerAr:
      "الفوترة الإلكترونية لهيئة الضرائب المصرية إلزامية لجميع المعاملات التجارية. يجب توقيع كل فاتورة رقمياً والتحقق منها وإرسالها في الوقت الفعلي.",
    category: "Compliance",
  },
  {
    question: "How does reverse factoring work?",
    questionAr: "كيف يعمل التمويل العكسي؟",
    answer:
      "After a supplier delivers goods and submits an ETA-compliant invoice, they can request early payment. Licensed factoring companies compete to buy the invoice at the best rate. The supplier gets paid within 48 hours (minus a 1.5–3% fee). The hotel keeps its original Net-30/Net-60 terms. Fully FRA-compliant with three-way matching on every transaction.",
    answerAr:
      "بعد تسليم البضائع وتقديم فاتورة متوافقة، يمكن للمورد طلب الدفع المبكر. تتنافس شركات التمويل المرخصة. يحصل المورد على الدفع خلال 48 ساعة.",
    category: "Factoring",
  },
  {
    question: "Is my data secure on HotelsVendors?",
    questionAr: "هل بياناتي آمنة على هوتيلز فيندورز؟",
    answer:
      "Yes. AES-256-GCM encryption at rest. TLS 1.3 in transit. RSA 2048-bit digital signatures on every ETA invoice. Each tenant's data is architecturally isolated — hotels can't see other hotels' data, suppliers can't see other suppliers'. ISO 27001 aligned, with regular third-party penetration testing.",
    answerAr:
      "نعم. تشفير AES-256-GCM للبيانات المخزنة وTLS 1.3 للبيانات المنقولة. بيانات كل مستأجر معزولة هندسياً. متوافق مع ISO 27001.",
    category: "Security",
  },
  {
    question: "What regions in Egypt do you cover?",
    questionAr: "ما المناطق في مصر التي تغطونها؟",
    answer:
      "6 governorates: Cairo, Alexandria, Giza, Red Sea (Hurghada), South Sinai (Sharm El-Sheikh), and Matrouh (North Coast). Our Shark-Breaker shared logistics model is purpose-built for coastal resorts — hub-and-spoke delivery to Red Sea and South Sinai properties where traditional logistics are expensive and unreliable.",
    answerAr:
      "6 محافظات: القاهرة والإسكندرية والجيزة والبحر الأحمر وجنوب سيناء ومطروح. نموذج اللوجستيات المشتركة مصمم للمنتجعات الساحلية.",
    category: "Platform",
  },
  {
    question: "I run a 200-room resort in Hurghada. How fast can we go live?",
    questionAr: "أدير منتجع 200 غرفة في الغردقة. كم يستغرق التفعيل؟",
    answer:
      "Most properties go live within 48 hours. We import your existing supplier list, configure your ETA e-invoicing pipeline, and set up your AI forecasting model using your historical purchase data. For Hurghada and Sharm El-Sheikh properties, we activate Shark-Breaker shared logistics from day one.",
    answerAr:
      "معظم المنشآت تنطلق خلال 48 ساعة. نستورد قائمة الموردين الحالية وننشئ خط أنابيب الفوترة الإلكترونية ونقوم بإعداد نموذج التنبؤ الذكي.",
    category: "Platform",
  },
];

const CATEGORIES = ["All", "General", "Platform", "Pricing", "Compliance", "Factoring", "Security"];

export function FAQAccordion() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filtered = activeCategory === "All" ? FAQS : FAQS.filter((f) => f.category === activeCategory);

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => { setActiveCategory(cat); setOpenIndex(null); }}
            className="px-3.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer"
            style={{
              backgroundColor: activeCategory === cat ? "rgba(255,107,0,0.12)" : "rgba(255,255,255,0.04)",
              color: activeCategory === cat ? "#FF6B00" : "rgba(255,255,255,0.4)",
              border: `1px solid ${activeCategory === cat ? "rgba(255,107,0,0.25)" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={faq.question}
              className="rounded-xl overflow-hidden transition-all"
              style={{
                backgroundColor: isOpen ? "rgba(255,107,0,0.03)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isOpen ? "rgba(255,107,0,0.2)" : "rgba(255,255,255,0.06)"}`,
              }}
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: "rgba(255,107,0,0.08)",
                      color: "#FF6B00",
                    }}
                  >
                    {faq.category}
                  </span>
                  <span className="text-[13px] font-medium text-white/80">
                    {faq.question}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  style={{ color: "#FF6B00" }}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-4">
                  <p className="text-[12px] leading-relaxed mb-3 text-white/50">
                    {faq.answer}
                  </p>
                  <p className="text-[12px] leading-relaxed text-white/35" dir="rtl">
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
