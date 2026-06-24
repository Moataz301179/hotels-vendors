import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

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
    content: "\n# AI-Powered Procurement Forecasting: How Hotels Cut Costs by 25%\n\nHotel procurement has always been a guessing game. How many kilos of tomatoes will you need next Thursday? When should you reorder pool chemicals before the summer rush? What happens if a supplier is late?\n\nHotelsVendors replaces guesswork with AI agents that forecast demand at 94% accuracy — reducing procurement costs by 15–25% through three mechanisms.\n\n## The Problem with Manual Procurement\n\nMost hotels in Egypt still manage procurement through spreadsheets, phone calls, and institutional memory. The result:\n\n- **Over-ordering**: Fear of running out leads to 20–30% food waste\n- **Emergency purchases**: Running out of stock means paying premium prices for rush orders\n- **Seasonal chaos**: High season (October–April in Red Sea) multiplies procurement volume 3–5x, overwhelming manual systems\n- **Supplier dependency**: Without data, hotels can't compare suppliers or negotiate effectively\n\n## How AI Forecasting Works\n\nHotelsVendors' AI agents analyze multiple data streams simultaneously:\n\n### Historical Ordering Patterns\nThe AI learns your hotel's unique ordering rhythm — which suppliers you use, what quantities you order, how often, and how lead times vary by season.\n\n### Seasonal Demand Signals\nExternal data feeds include:\n- Egyptian tourism arrival statistics (CAPMAS data)\n- Hotel occupancy rates by governorate\n- Weather patterns affecting F&B demand\n- Local events and holidays (Eid, Christmas, Sham El-Nessim)\n\n### Supplier Performance Data\nThe AI tracks each supplier's on-time delivery rate, price consistency, and quality scores. It factors this into reorder timing — if Supplier A is consistently 2 days late, the AI orders earlier.\n\n### Lead Time Optimization\nInstead of fixed reorder points, the AI dynamically adjusts based on current supplier lead times, shipping routes, and even traffic patterns for last-mile delivery in Cairo or Alexandria.\n\n## The 94% Accuracy Claim\n\nOur accuracy metric measures: **did the AI predict within ±10% of actual consumption for each SKU, each week?**\n\nResults across 50+ hotels on the platform:\n- **F&B (perishables)**: 96% accuracy — high frequency, predictable patterns\n- **Cleaning chemicals**: 93% accuracy — moderate frequency, seasonal variance\n- **Linens & FF&E**: 91% accuracy — lower frequency, higher variance\n- **Pool chemicals**: 94% accuracy — weather-dependent but highly modelable\n\n## Three Sources of Cost Reduction\n\n### 1. Reduced Waste (8–12% savings)\nWhen you order exactly what you need, food waste drops from 25–30% to 8–12%. For a hotel spending EGP 1M/month on F&B, that's EGP 120K–220K saved monthly.\n\n### 2. Eliminated Emergency Purchases (5–8% savings)\nRush orders cost 15–40% more than planned orders. The AI's lead time optimization eliminates most emergency procurement scenarios.\n\n### 3. Competitive Pricing (2–5% savings)\nWhen the AI knows you'll need 500kg of chicken next week, it can source from the cheapest qualified supplier — not just the one your procurement manager has a relationship with.\n\n## What This Looks Like in Practice\n\nA 200-room resort in Hurghada using HotelsVendors:\n\n| Metric | Before AI | After AI |\n|--------|-----------|----------|\n| Monthly F&B spend | EGP 1,200,000 | EGP 960,000 |\n| Food waste rate | 28% | 10% |\n| Emergency orders/month | 12 | 2 |\n| Supplier lead time variance | ±4 days | ±1 days |\n| Procurement staff hours/week | 25 | 8 |\n\n## Getting Started\n\nAI forecasting activates automatically after your hotel completes 4 weeks of ordering through HotelsVendors. The AI needs one full month of data to establish baseline patterns, then improves continuously.\n\nNo manual configuration. No data science degree required. Just keep ordering, and the AI keeps learning.\n\n---\n\n*Ready to let AI optimize your procurement? [Get Started Free](/register)*\n",
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
    content: "\n# The Complete Guide to ETA E-Invoicing for Hotels in Egypt\n\nEgypt's electronic invoicing mandate is no longer optional. Since the Egyptian Tax Authority (ETA) began rolling out compulsory e-invoicing, every B2B transaction — including hotel procurement — must be digitally signed, UUID-validated, and submitted to the Tax Authority in real time.\n\n## What Is ETA E-Invoicing?\n\nETA e-invoicing is a government mandate requiring all businesses to issue, transmit, and store invoices through a centralized digital platform. Each invoice receives a unique UUID (Universally Unique Identifier) from the Tax Authority, making it cryptographically verifiable and tamper-proof.\n\nFor hotels, this means every purchase order — from food and beverages to linens, cleaning chemicals, and FF&E — must generate an ETA-compliant invoice before settlement.\n\n## Why Hotels Need to Care\n\nHotels operate in a uniquely complex procurement environment:\n\n- **High volume**: A mid-size hotel processes 200–500 supplier invoices per month\n- **Multiple categories**: F&B, chemicals, linens, maintenance, services — each with different tax treatments\n- **Seasonal variance**: Procurement spikes 3–5x during high season, multiplying compliance workload\n- **Multi-governorate operations**: Hotels in Sharm El-Sheikh, Hurghada, and Cairo may face different regional enforcement timelines\n\nNon-compliance results in penalties ranging from EGP 50,000 to EGP 500,000 per violation, plus potential suspension of tax registration.\n\n## Technical Requirements\n\nEvery ETA-compliant invoice must include:\n\n1. **Digital signature** — RSA 2048-bit cryptographic signature\n2. **UUID from ETA** — unique identifier issued in real time\n3. **QR code** — scannable code linking to the invoice on ETA's portal\n4. **Standard JSON format** — invoices submitted via ETA's REST API\n5. **SHA-256 audit trail** — immutable hash chain linking all documents in a transaction\n\n## How HotelsVendors Automates ETA Compliance\n\nHotelsVendors handles the entire ETA compliance pipeline automatically:\n\n- Every invoice generated on the platform is digitally signed at creation\n- UUIDs are fetched from ETA in real time and embedded in the invoice\n- SHA-256 audit trails link PO → delivery note → invoice → payment\n- Three-way matching ensures every transaction is complete before submission\n- Zero manual work — your team never has to think about tax compliance again\n\n## Deadlines and Phase Rollouts\n\n| Phase | Requirement | Deadline |\n|-------|-------------|----------|\n| Phase 1 | Large taxpayers (revenue > EGP 50M) | Completed |\n| Phase 2 | All B2B transactions | Active |\n| Phase 3 | B2C transactions > EGP 500K | 2026 |\n| Phase 4 | All remaining businesses | 2027 |\n\n## Penalties for Non-Compliance\n\n- Late submission: EGP 50,000 – EGP 250,000\n- Missing digital signature: EGP 100,000 – EGP 500,000\n- Incorrect tax classification: EGP 50,000 per invoice\n- Failure to submit: Suspension of tax registration\n\n## The Bottom Line\n\nETA compliance is not optional, and manual compliance is not scalable. Hotels processing hundreds of invoices monthly cannot afford the risk of human error, missed deadlines, or incorrect tax classifications.\n\nHotelsVendors makes compliance invisible — built into every transaction, automated from order to settlement, auditable forever.\n\n---\n\n*Ready to automate your hotel's tax compliance? [Get Started Free](/register)*\n",
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
    content: "\n# How Reverse Factoring Works for Egyptian Hotels\n\nCash flow is the biggest constraint in hotel procurement. Suppliers want to be paid quickly; hotels want to preserve working capital as long as possible. Reverse factoring solves both problems — and HotelsVendors makes it fully automated and FRA-compliant.\n\n## What Is Reverse Factoring?\n\nReverse factoring (also called supply chain finance) is a financing arrangement where a licensed financial institution pays your supplier early — at a discount — while you, the hotel, keep your original payment terms (Net-30, Net-60, or even Net-90).\n\nThe key difference from traditional factoring: **the credit risk is based on your creditworthiness as the buyer**, not the supplier's. This means better rates for everyone.\n\n## The 48-Hour Process\n\n### Step 1: Delivery and Invoice\nThe supplier delivers goods to your hotel and submits an ETA-compliant invoice through HotelsVendors. The invoice includes the ETA UUID, digital signature, and all required tax fields.\n\n### Step 2: Three-Way Matching\nHotelsVendors automatically matches three documents:\n- The original Purchase Order (PO)\n- The ETA-compliant invoice with UUID\n- The signed delivery note confirming receipt\n\nAll three must match before the invoice is eligible for factoring. This protects against fraud and disputes.\n\n### Step 3: Supplier Requests Early Payment\nOnce the invoice is approved and matched, the supplier can request early payment through the platform. They see the estimated rate (typically 1.5–3% of invoice value) and the exact amount they'll receive.\n\n### Step 4: Funders Compete\nLicensed factoring companies on the platform see the invoice and compete to offer the best rate. The supplier picks the best offer, and the funder pays the supplier within 48 hours.\n\n### Step 5: Hotel Pays on Original Terms\nYou pay the factoring company on the original due date (Net-30/Net-60). Your working capital position is unchanged — you just enabled your supplier to get paid faster.\n\n## Why This Matters for Hotels\n\n**Supplier relationships**: Suppliers who get paid faster offer better pricing, priority delivery, and flexible terms. Your procurement team gets leverage.\n\n**Working capital**: You keep cash on your balance sheet longer. For a hotel doing EGP 5M/month in procurement, that's EGP 5M–10M in preserved liquidity annually.\n\n**No debt**: Reverse factoring is not a loan. It doesn't appear as debt on your balance sheet. It's a payment facilitation service.\n\n## FRA Compliance\n\nThe Financial Regulatory Authority (FRA) oversees all factoring operations in Egypt. HotelsVendors is fully FRA-compliant:\n\n- Licensed factoring partners only\n- Three-way matching on every transaction\n- SHA-256 audit trails\n- Real-time fraud detection\n- Full transparency for regulators\n\n## Who Qualifies?\n\nAny hotel on HotelsVendors can access reverse factoring if:\n- They have completed at least 3 transactions on the platform\n- Their suppliers are verified and onboarded\n- Invoices are ETA-compliant with valid UUIDs\n\n## The Bottom Line\n\nReverse factoring turns your procurement process into a working capital optimization tool. Suppliers get paid in 48 hours. You keep your original terms. Everyone wins — and HotelsVendors automates the entire flow.\n\n---\n\n*Start optimizing your working capital: [Get Started Free](/register)*\n",
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
    content: "\n# Shared-Route Logistics: Solving Delivery Challenges for Red Sea Resorts\n\nDelivering to remote resort destinations is expensive and unreliable. A truck traveling from Cairo to Hurghada (450km) might carry goods for only one hotel — driving up costs and delivery times.\n\nHotelsVendors' shared-route logistics model, called **Shark-Breaker**, solves this by consolidating deliveries across multiple hotels on the same route.\n\n## The Problem\n\nHotels in Red Sea and South Sinai face unique logistics challenges:\n\n- **Distance**: 400–600km from major distribution centers in Cairo and Alexandria\n- **Low density**: Hotels spread along coastal corridors with few nearby alternatives\n- **Seasonal variance**: Delivery volume spikes 5x during high season (October–April)\n- **Unreliable carriers**: Traditional logistics providers offer inconsistent service and pricing\n\nThe result: delivery costs can represent 15–25% of product cost — compared to 5–8% in urban areas.\n\n## How Shark-Breaker Works\n\n### Hub-and-Spoke Model\n\nHotelsVendors operates regional hubs in:\n- **Cairo** (serving mainland routes)\n- **Alexandria** (serving North Coast/Marsa Matruh)\n- **Hurghada** (serving Red Sea resorts)\n- **Sharm El-Sheikh** (serving South Sinai)\n\n### Route Optimization\n\nWhen multiple hotels on the platform order from the same supplier or distribution corridor, the AI agent:\n\n1. **Clusters orders** by destination and delivery window\n2. **Optimizes truck loads** to maximize vehicle utilization\n3. **Schedules consolidated deliveries** on shared routes\n4. **Tracks in real-time** with GPS and delivery confirmation\n\n### The 40% Cost Reduction\n\n| Cost Component | Traditional | Shark-Breaker |\n|---------------|-------------|---------------|\n| Per-km transport cost | EGP 8–12/km | EGP 4–6/km |\n| Truck utilization | 30–40% | 75–85% |\n| Delivery frequency | Per-hotel | Consolidated |\n| Last-mile cost | EGP 500–800 | EGP 200–300 |\n| **Total delivery cost** | **Baseline** | **-40%** |\n\n## Real-World Example\n\nA group of 12 hotels along the Hurghada–Safaga corridor:\n\n- **Before**: Each hotel arranged own logistics. Average delivery cost: EGP 2,400 per order. Frequency: 3x/week per hotel.\n- **After Shark-Breaker**: Consolidated to 2 shared deliveries/week for the entire corridor. Average delivery cost: EGP 1,440 per order. Savings: EGP 960 per order × 36 orders/week = EGP 34,560/week across the group.\n\n## Environmental Impact\n\nFewer trucks on the road means:\n- 40% reduction in CO₂ emissions per delivery\n- Less traffic on Red Sea coastal roads\n- Reduced packaging waste from consolidated shipments\n\n## Coverage Areas\n\n| Region | Hub | Coverage |\n|--------|-----|----------|\n| Red Sea | Hurghada | Hurghada, Safaga, Soma Bay, Makadi |\n| South Sinai | Sharm El-Sheikh | Sharm, Dahab, Nuweiba, Taba |\n| North Coast | Alexandria | Marsa Matrouh, Sidi Bishr, Agami |\n| Greater Cairo | Cairo | Cairo, Giza, 6th of October |\n\n## Getting Started\n\nShark-Breaker logistics activate automatically when your hotel joins HotelsVendors and places orders. The AI agent identifies route-sharing opportunities and suggests consolidated delivery windows.\n\nNo additional setup required. Just order as usual, and the logistics optimization happens behind the scenes.\n\n---\n\n*Reduce your delivery costs by 40%: [Get Started Free](/register)*\n",
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
    content: "\n# How to Onboard Hotel Suppliers in Egypt: A Step-by-Step Guide\n\nEgypt's hotel supply chain is fragmented. Thousands of suppliers — from F&B distributors to linen manufacturers — operate without standardized onboarding, digital invoicing, or verification. HotelsVendors changes this.\n\n## Why Supplier Onboarding Matters\n\nBefore a supplier can sell to hotels on HotelsVendors, they must be verified. This protects hotels from:\n\n- **Fraudulent suppliers** with fake commercial registries\n- **Tax non-compliance** — suppliers who can't issue ETA-compliant invoices\n- **Quality risk** — unverified suppliers with no track record\n- **Delivery failures** — suppliers without logistics capability\n\n## The 4-Step Onboarding Process\n\n### Step 1: Document Submission (15 minutes)\n\nThe supplier submits:\n- Commercial Registry (السجل التجاري)\n- Tax Card (البطاقة الضريبية)\n- VAT registration certificate\n- Product catalog with pricing\n- Reference hotels (if applicable)\n\n### Step 2: AI Verification (2–4 hours)\n\nHotelsVendors' AI agent validates:\n- Commercial registry authenticity via government database cross-check\n- Tax ID validity and active status\n- Product catalog categorization and pricing benchmarking\n- Supplier creditworthiness (for factoring eligibility)\n\n### Step 3: ETA Pipeline Configuration (1 hour)\n\nOnce verified, the supplier's invoicing pipeline is configured:\n- Digital signature certificate installed\n- ETA API credentials provisioned\n- Invoice template generated with supplier details\n- QR code and UUID workflow tested\n\n### Step 4: INVO Marketplace Listing (instant)\n\nThe supplier's products go live on INVO — the HotelsVendors supplier marketplace. Hotels can discover, compare, and order immediately.\n\n## Total Time: Under 24 Hours\n\nMost suppliers complete the entire process within one business day. Compare this to traditional marketplace onboarding that takes 2–4 weeks.\n\n## Requirements for Egyptian Suppliers\n\n| Requirement | Details |\n|-------------|---------|\n| Commercial Registry | Active, matching the supplier's business name |\n| Tax Card | Valid, with active VAT registration |\n| Bank Account | For receiving payments (EGP account required) |\n| Product Catalog | Minimum 10 SKUs with pricing |\n| Delivery Capability | Ability to deliver to hotels in their coverage area |\n\n## What Happens After Onboarding\n\nOnce live on INVO, suppliers get:\n- Access to 500+ verified hotels on the platform\n- Automated ETA-compliant invoicing (no manual tax work)\n- Optional reverse factoring (get paid in 48 hours)\n- Real-time order notifications\n- Performance analytics dashboard\n\n## Common Onboarding Issues\n\n**Expired commercial registry**: The most common rejection reason. Suppliers must renew annually.\n\n**Mismatched tax ID**: The tax card must match the commercial registry exactly. Subsidiaries need separate profiles.\n\n**Incomplete catalog**: Suppliers with fewer than 10 SKUs or without pricing get flagged for manual review.\n\n## Start Onboarding Suppliers\n\nIf you're an Egyptian supplier serving the hospitality sector, [join HotelsVendors](/register) and complete onboarding in under 24 hours.\n\n---\n\n*Are you a hotel looking for verified suppliers? [Explore our marketplace](/marketplace)*\n",
  },
];

function getPostBySlug(slug: string): BlogPost | null {
  return POSTS.find((p) => p.slug === slug) || null;
}

function getAllSlugs(): string[] {
  return POSTS.map((p) => p.slug);
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post Not Found" };
  return {
    title: `${post.title} — HotelsVendors Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
  };
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function renderMarkdown(content: string): string {
  let html = content;
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-[16px] font-semibold mt-8 mb-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-[20px] font-semibold mt-10 mb-4 mt-12">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-[28px] font-semibold mb-6">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white/90 font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em class="text-white/70 italic">$1</em>');
  html = html.replace(/^- (.+)$/gm, '<li class="text-[14px] text-white/60 leading-relaxed ml-4 list-disc">$1</li>');
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="text-[14px] text-white/60 leading-relaxed ml-4 list-decimal">$1</li>');
  html = html.replace(/^\|(.+)\|$/gm, (match) => {
    const cells = match.split("|").filter(Boolean).map((c) => c.trim());
    if (cells.every((c) => /^[-:]+$/.test(c))) return "";
    const tag = match.includes("---") ? "" : `<tr>${cells.map((c) => `<td class="px-4 py-2 border border-white/10 text-[13px] text-white/60">${c}</td>`).join("")}</tr>`;
    return tag;
  });
  html = html.replace(/(<tr>[\s\S]*?<\/tr>(\n)?)+/g, (match) => {
    const rows = match.split("\n").filter(Boolean);
    const headerRow = rows[0];
    const bodyRows = rows.slice(2);
    return `<table class="w-full border-collapse border border-white/10 my-6 rounded-lg overflow-hidden"><thead class="bg-white/5">${headerRow}</thead><tbody>${bodyRows.join("")}</tbody></table>`;
  });
  html = html.replace(/\n\n/g, '</p><p class="text-[14px] text-white/60 leading-relaxed mb-4">');
  html = `<p class="text-[14px] text-white/60 leading-relaxed mb-4">${html}</p>`;
  html = html.replace(/<p class="[^"]*"><\/p>/g, "");
  html = html.replace(/<p class="[^"]*">(\s*<(h[1-6]|ul|ol|table|li))/g, "$1");
  html = html.replace(/(<\/(h[1-6]|ul|ol|table)>)<\/p>/g, "$1");
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-[var(--accent-base)] hover:text-[var(--accent-base)]/80 underline underline-offset-2">$1</a>');
  html = html.replace(/^---$/gm, '<hr class="border-white/10 my-8" />');
  return html;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Back nav */}
      <div className="border-b border-white/10">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <Link
            href="/blog"
            className="text-[11px] font-medium uppercase tracking-[0.15em] text-white/40 hover:text-white/70 transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </div>

      {/* Article header */}
      <article className="py-12">
        <div className="mx-auto max-w-4xl px-6">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-[var(--accent-base)]/10 text-[var(--accent-base)]">
              {post.category}
            </span>
            <span className="text-[10px] text-white/30" dir="rtl">
              {post.categoryAr}
            </span>
            <span className="text-[10px] text-white/20">
              {post.readTime} min read
            </span>
          </div>

          <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-tight leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-[14px] text-white/30 mb-6" dir="rtl">
            {post.titleAr}
          </p>

          <div className="flex items-center gap-4 mb-10 pb-10 border-b border-white/10">
            <div className="w-8 h-8 rounded-full bg-[var(--accent-base)]/10 flex items-center justify-center">
              <span className="text-[11px] font-medium text-[var(--accent-base)]">
                {post.author.charAt(0)}
              </span>
            </div>
            <div>
              <p className="text-[12px] font-medium text-white/70">{post.author}</p>
              <p className="text-[11px] text-white/30">{formatDate(post.date)}</p>
            </div>
          </div>

          {/* Content */}
          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 text-white/40"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-12 p-8 rounded-2xl border border-[var(--accent-base)]/20 bg-[var(--accent-base)]/3 text-center">
            <h3 className="text-[18px] font-semibold mb-2">
              Ready to transform your hotel procurement?
            </h3>
            <p className="text-[13px] text-white/50 mb-5">
              Join 500+ hotels on Egypt&apos;s B2B procurement platform.
            </p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--accent-base)] text-black text-[13px] font-medium hover:bg-orange-400 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
