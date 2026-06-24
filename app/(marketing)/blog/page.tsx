import { Metadata } from "next";
import Link from "next/link";

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
  },
  {
    slug: "eta-compliance-guide-for-hotels",
    title: "The Complete Guide to ETA E-Invoicing for Hotels in Egypt",
    titleAr: "الدليل الشامل للفوترة الإلكترونية لهيئة الضرائب للفنادق في مصر",
    description: "Everything hotel managers need to know about Egyptian Tax Authority (ETA) e-invoicing compliance — deadlines, technical requirements, penalties, and how to automate it.",
    descriptionAr: "كل ما يحتاجه مديرو الفنادق لمعرفة الامتثال للفوترة الإلكترونية لهيئة الضرائب المصرية — المواعيد النهائية، المتطلبات التقنية، العقوبات، وكيفية أتمتة ذلك.",
    date: "2026-06-15",
    author: "HotelsVendors Team",
    category: "Compliance",
    categoryAr: "الامتثال",
    tags: ["ETA", "e-invoicing", "tax compliance", "Egypt", "B2B"],
    readTime: 3,
    featured: true,
  },
  {
    slug: "reverse-factoring-egypt-hospitality",
    title: "How Reverse Factoring Works for Egyptian Hotels",
    titleAr: "كيف يعمل التمويل العكسي للفنادق المصرية",
    description: "A practical guide to reverse factoring in Egypt's hospitality sector — how suppliers get paid in 48 hours while hotels keep their Net-30/Net-60 terms.",
    descriptionAr: "دليل عملي للتمويل العكسي في قطاع الضيافة المصري — كيف يحصل الموردون على الدفع خلال 48 ساعة بينما تحتفظ الفنادق بشروط الدفع الأصلية.",
    date: "2026-06-10",
    author: "HotelsVendors Team",
    category: "Factoring",
    categoryAr: "التمويل",
    tags: ["reverse factoring", "supply chain finance", "working capital", "Egypt", "B2B"],
    readTime: 3,
    featured: true,
  },
  {
    slug: "shared-route-logistics-red-sea-resorts",
    title: "Shared-Route Logistics: Solving Delivery Challenges for Red Sea Resorts",
    titleAr: "اللوجستيات عبر المسارات المشتركة: حل تحديات التوصيل لمنتجعات البحر الأحمر",
    description: "How HotelsVendors' Shark-Breaker shared logistics model reduces delivery costs by 40% for hotels in Hurghada, Sharm El-Sheikh, and the North Coast.",
    descriptionAr: "كيف يقلل نموذج اللوجستيات المشتركة Shark-Breaker من تكاليف التوصيل بنسبة 40% للفنادق في الغردقة وشرم الشيخ والساحل الشمالي.",
    date: "2026-05-20",
    author: "HotelsVendors Team",
    category: "Logistics",
    categoryAr: "اللوجستيات",
    tags: ["logistics", "Red Sea", "shared routes", "delivery", "cost reduction"],
    readTime: 3,
    featured: false,
  },
  {
    slug: "supplier-onboarding-egypt-guide",
    title: "How to Onboard Hotel Suppliers in Egypt: A Step-by-Step Guide",
    titleAr: "كيفية تسجيل الموردين للفنادق في مصر: دليل خطوة بخطوة",
    description: "The complete process for onboarding Egyptian hotel suppliers — from commercial registry verification to ETA-compliant invoicing setup in under 24 hours.",
    descriptionAr: "العملية الكاملة لتسجيل الموردين المصريين للفنادق — من التحقق من السجل التجاري إلى إعداد الفوترة الإلكترونية المتوافقة في أقل من 24 ساعة.",
    date: "2026-05-28",
    author: "HotelsVendors Team",
    category: "Suppliers",
    categoryAr: "الموردون",
    tags: ["supplier onboarding", "verification", "ETA", "B2B marketplace", "Egypt"],
    readTime: 3,
    featured: false,
  },
];

function getAllPosts(): BlogPost[] {
  return [...POSTS].sort((a, b) => (a.date > b.date ? -1 : 1));
}

function getFeaturedPosts(): BlogPost[] {
  return POSTS.filter((p) => p.featured);
}

export const metadata: Metadata = {
  title: "Blog — HotelsVendors | Egypt's B2B Hotel Procurement Platform",
  description:
    "Insights on hotel procurement, ETA compliance, reverse factoring, AI forecasting, and supply chain optimization for Egypt's hospitality sector.",
  keywords: [
    "hotel procurement Egypt",
    "ETA compliance",
    "reverse factoring",
    "B2B marketplace",
    "hospitality supply chain",
  ],
  openGraph: {
    title: "HotelsVendors Blog",
    description: "Procurement insights for Egypt's hospitality industry",
    type: "website",
  },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogPage() {
  const posts = getAllPosts();
  const featured = getFeaturedPosts();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6">
          <Link
            href="/"
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40 hover:text-white/70 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-16 border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6">
          <h1 className="text-[32px] sm:text-[48px] font-semibold tracking-tight mb-4">
            The HotelsVendors Blog
          </h1>
          <p className="text-[15px] text-white/50 max-w-2xl leading-relaxed">
            Insights on hotel procurement, ETA compliance, reverse factoring, AI forecasting,
            and supply chain optimization for Egypt&apos;s hospitality industry.
          </p>
          <p className="text-[13px] text-white/30 mt-2" dir="rtl">
            رؤى حول المشتريات الفندقية والامتثال الضريبي والتمويل العكسي والتنبؤ الذكي
            وتحسين سلسلة التوريد لقطاع الضيافة في مصر.
          </p>
        </div>
      </section>

      {/* Featured Posts */}
      {featured.length > 0 && (
        <section className="py-12 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-[var(--accent-base)] mb-8">
              Featured · مميز
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.slice(0, 2).map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group rounded-2xl p-6 border border-white/10 hover:border-amber-400/30 transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-[var(--accent-base)]/10 text-[var(--accent-base)]">
                      {post.category}
                    </span>
                    <span className="text-[10px] text-white/30">{post.categoryAr}</span>
                    <span className="text-[10px] text-white/20 ml-auto">
                      {post.readTime} min read
                    </span>
                  </div>
                  <h3 className="text-[18px] font-semibold mb-2 group-hover:text-[var(--accent-base)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[12px] text-white/30 mb-3" dir="rtl">
                    {post.titleAr}
                  </p>
                  <p className="text-[13px] text-white/50 leading-relaxed line-clamp-3">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[11px] text-white/30">
                      {formatDate(post.date)} · {post.author}
                    </span>
                    <span className="text-[11px] text-[var(--accent-base)]/70 group-hover:text-[var(--accent-base)] transition-colors">
                      Read more →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40 mb-8">
            All Posts · جميع المقالات
          </h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-xl p-5 border border-white/6 hover:border-white/15 transition-all"
                style={{ backgroundColor: "rgba(255,255,255,0.015)" }}
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/5 text-white/60">
                        {post.category}
                      </span>
                      <span className="text-[10px] text-white/25" dir="rtl">
                        {post.categoryAr}
                      </span>
                      <span className="text-[10px] text-white/20">
                        {post.readTime} min
                      </span>
                    </div>
                    <h3 className="text-[15px] font-medium group-hover:text-[var(--accent-base)] transition-colors mb-1">
                      {post.title}
                    </h3>
                    <p className="text-[11px] text-white/25 mb-2" dir="rtl">
                      {post.titleAr}
                    </p>
                    <p className="text-[12px] text-white/40 line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <span className="text-[11px] text-white/30">
                      {formatDate(post.date)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="text-[20px] font-semibold mb-3">
            Ready to transform your hotel procurement?
          </h2>
          <p className="text-[13px] text-white/40 mb-6 max-w-lg mx-auto">
            Join 500+ hotels on Egypt&apos;s B2B procurement platform. AI forecasting.
            ETA compliance. Reverse factoring. All in one system.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent-base)] text-black text-[13px] font-medium hover:bg-amber-400 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
