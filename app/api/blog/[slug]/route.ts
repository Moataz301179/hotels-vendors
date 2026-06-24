import { NextResponse } from "next/server";

interface BlogPost {
  slug: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  date: string;
  author: string;
  category: string;
  categoryAr: string;
  tags: string[];
  readTime: number;
  featured: boolean;
  content: string;
}

const POSTS: BlogPost[] = [
  {
    slug: "ai-procurement-forecasting-hotels",
    title: "AI-Powered Procurement Forecasting: How Hotels Cut Costs by 25%",
    titleAr: "التنبؤ بالمشتريات المدعوم بالذكاء الاصطناعي: كيف تخفض الفنادق التكاليف بنسبة 25%",
    description: "How AI agents analyze seasonal demand, supplier lead times, and historical ordering patterns to forecast hotel procurement needs with 94% accuracy.",
    descriptionAr: "كيف يحلل العملاء الذكيون الطلب الموسمي وأوقات التوريد وأنماط الطلب التاريخية للتنبؤ باحتياجات المشتريات الفندقية بدقة 94%.",
    date: "2026-06-05",
    author: "HotelsVendors Team",
    category: "Platform",
    categoryAr: "المنصة",
    tags: ["AI", "forecasting", "procurement", "cost reduction", "hospitality"],
    readTime: 3,
    featured: true,
    content: "See full article at /blog/ai-procurement-forecasting-hotels",
  },
  {
    slug: "eta-compliance-guide-for-hotels",
    title: "The Complete Guide to ETA E-Invoicing for Hotels in Egypt",
    titleAr: "الدليل الشامل للفوترة الإلكترونية لهيئة الضرائب للفنادق في مصر",
    description: "Everything hotel managers need to know about Egyptian Tax Authority (ETA) e-invoicing compliance.",
    descriptionAr: "كل ما يحتاجه مديرو الفنادق لمعرفة الامتثال للفوترة الإلكترونية لهيئة الضرائب المصرية.",
    date: "2026-06-15",
    author: "HotelsVendors Team",
    category: "Compliance",
    categoryAr: "الامتثال",
    tags: ["ETA", "e-invoicing", "tax compliance", "Egypt", "B2B"],
    readTime: 3,
    featured: true,
    content: "See full article at /blog/eta-compliance-guide-for-hotels",
  },
  {
    slug: "reverse-factoring-egypt-hospitality",
    title: "How Reverse Factoring Works for Egyptian Hotels",
    titleAr: "كيف يعمل التمويل العكسي للفنادق المصرية",
    description: "A practical guide to reverse factoring in Egypt's hospitality sector.",
    descriptionAr: "دليل عملي للتمويل العكسي في قطاع الضيافة المصري.",
    date: "2026-06-10",
    author: "HotelsVendors Team",
    category: "Factoring",
    categoryAr: "التمويل",
    tags: ["reverse factoring", "supply chain finance", "working capital", "Egypt", "B2B"],
    readTime: 3,
    featured: true,
    content: "See full article at /blog/reverse-factoring-egypt-hospitality",
  },
  {
    slug: "shared-route-logistics-red-sea-resorts",
    title: "Shared-Route Logistics: Solving Delivery Challenges for Red Sea Resorts",
    titleAr: "اللوجستيات عبر المسارات المشتركة: حل تحديات التوصيل لمنتجعات البحر الأحمر",
    description: "How HotelsVendors' Shark-Breaker shared logistics model reduces delivery costs by 40%.",
    descriptionAr: "كيف يقلل نموذج اللوجستيات المشتركة Shark-Breaker من تكاليف التوصيل بنسبة 40%.",
    date: "2026-05-20",
    author: "HotelsVendors Team",
    category: "Logistics",
    categoryAr: "اللوجستيات",
    tags: ["logistics", "Red Sea", "shared routes", "delivery", "cost reduction"],
    readTime: 3,
    featured: false,
    content: "See full article at /blog/shared-route-logistics-red-sea-resorts",
  },
  {
    slug: "supplier-onboarding-egypt-guide",
    title: "How to Onboard Hotel Suppliers in Egypt: A Step-by-Step Guide",
    titleAr: "كيفية تسجيل الموردين للفنادق في مصر: دليل خطوة بخطوة",
    description: "The complete process for onboarding Egyptian hotel suppliers in under 24 hours.",
    descriptionAr: "العملية الكاملة لتسجيل الموردين المصريين للفنادق في أقل من 24 ساعة.",
    date: "2026-05-28",
    author: "HotelsVendors Team",
    category: "Suppliers",
    categoryAr: "الموردون",
    tags: ["supplier onboarding", "verification", "ETA", "B2B marketplace", "Egypt"],
    readTime: 3,
    featured: false,
    content: "See full article at /blog/supplier-onboarding-egypt-guide",
  },
];

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
}
