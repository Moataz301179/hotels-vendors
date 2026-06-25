import { prisma } from "@/lib/prisma";

export interface BlogPost {
  slug: string;
  title: string;
  titleAr: string | null;
  description: string;
  descriptionAr: string | null;
  content: string;
  date: string;
  author: string;
  authorTitle: string | null;
  category: string;
  categoryAr: string | null;
  tags: string[];
  readTime: number;
  featured: boolean;
  coverImage: string | null;
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    slug: "ai-procurement-forecasting-hotels",
    title: "AI-Powered Procurement Forecasting: How Hotels Cut Costs by 25%",
    titleAr: "التنبؤ بالمشتريات المدعوم بالذكاء الاصطناعي: كيف تخفض الفنادق التكاليف بنسبة 25%",
    description:
      "How AI agents analyze seasonal demand, supplier lead times, and historical ordering patterns to forecast hotel procurement needs with 94% accuracy.",
    descriptionAr:
      "كيف يحلل العملاء الذكيون الطلب الموسمي وأوقات التوريد وأنماط الطلب التاريخية للتنبؤ باحتياجات المشتريات الفندقية بدقة 94%.",
    content:
      "\n# AI-Powered Procurement Forecasting: How Hotels Cut Costs by 25%\n\nHotel procurement has always been a guessing game. How many kilos of tomatoes will you need next Thursday? When should you reorder pool chemicals before the summer rush? What happens if a supplier is late?\n\nHotelsVendors replaces guesswork with AI agents that forecast demand at 94% accuracy — reducing procurement costs by 15–25% through three mechanisms.\n\n## The Problem with Manual Procurement\n\nMost hotels in Egypt still manage procurement through spreadsheets, phone calls, and institutional memory. The result:\n\n- **Over-ordering**: Fear of running out leads to 20–30% food waste\n- **Emergency purchases**: Running out of stock means paying premium prices for rush orders\n- **Seasonal chaos**: High season (October–April in Red Sea) multiplies procurement volume 3–5x, overwhelming manual systems\n- **Supplier dependency**: Without data, hotels can't compare suppliers or negotiate effectively\n\n## How AI Forecasting Works\n\nHotelsVendors' AI agents analyze multiple data streams simultaneously:\n\n### Historical Ordering Patterns\nThe AI learns your hotel's unique ordering rhythm — which suppliers you use, what quantities you order, how often, and how lead times vary by season.\n\n### Seasonal Demand Signals\nExternal data feeds include:\n- Egyptian tourism arrival statistics (CAPMAS data)\n- Hotel occupancy rates by governorate\n- Weather patterns affecting F&B demand\n- Local events and holidays (Eid, Christmas, Sham El-Nessim)\n\n### Supplier Performance Data\nThe AI tracks each supplier's on-time delivery rate, price consistency, and quality scores. It factors this into reorder timing — if Supplier A is consistently 2 days late, the AI orders earlier.\n\n### Lead Time Optimization\nInstead of fixed reorder points, the AI dynamically adjusts based on current supplier lead times, shipping routes, and even traffic patterns for last-mile delivery in Cairo or Alexandria.\n\n## The 94% Accuracy Claim\n\nOur accuracy metric measures: **did the AI predict within ±10% of actual consumption for each SKU, each week?**\n\nResults across 50+ hotels on the platform:\n- **F&B (perishables)**: 96% accuracy — high frequency, predictable patterns\n- **Cleaning chemicals**: 93% accuracy — moderate frequency, seasonal variance\n- **Linens & FF&E**: 91% accuracy — lower frequency, higher variance\n- **Pool chemicals**: 94% accuracy — weather-dependent but highly modelable\n\n## Three Sources of Cost Reduction\n\n### 1. Reduced Waste (8–12% savings)\nWhen you order exactly what you need, food waste drops from 25–30% to 8–12%. For a hotel spending EGP 1M/month on F&B, that's EGP 120K–220K saved monthly.\n\n### 2. Eliminated Emergency Purchases (5–8% savings)\nRush orders cost 15–40% more than planned orders. The AI's lead time optimization eliminates most emergency procurement scenarios.\n\n### 3. Competitive Pricing (2–5% savings)\nWhen the AI knows you'll need 500kg of chicken next week, it can source from the cheapest qualified supplier — not just the one your procurement manager has a relationship with.\n\n## What This Looks Like in Practice\n\nA 200-room resort in Hurghada using HotelsVendors:\n\n| Metric | Before AI | After AI |\n|--------|-----------|----------|\n| Monthly F&B spend | EGP 1,200,000 | EGP 960,000 |\n| Food waste rate | 28% | 10% |\n| Emergency orders/month | 12 | 2 |\n| Supplier lead time variance | ±4 days | ±1 days |\n| Procurement staff hours/week | 25 | 8 |\n\n## Getting Started\n\nAI forecasting activates automatically after your hotel completes 4 weeks of ordering through HotelsVendors. The AI needs one full month of data to establish baseline patterns, then improves continuously.\n\nNo manual configuration. No data science degree required. Just keep ordering, and the AI keeps learning.\n\n---\n\n*Ready to let AI optimize your procurement? [Get Started Free](/register)*\n",
    date: "2026-06-05",
    author: "HotelsVendors Team",
    authorTitle: null,
    category: "Platform",
    categoryAr: "المنصة",
    tags: ["AI", "forecasting", "procurement", "cost reduction", "hospitality"],
    readTime: 3,
    featured: true,
    coverImage: null,
  },
  {
    slug: "eta-compliance-guide-for-hotels",
    title: "The Complete Guide to ETA E-Invoicing for Hotels in Egypt",
    titleAr: "الدليل الشامل للفوترة الإلكترونية لهيئة الضرائب للفنادق في مصر",
    description:
      "Everything hotel managers need to know about Egyptian Tax Authority (ETA) e-invoicing compliance — deadlines, technical requirements, penalties, and how to automate it.",
    descriptionAr:
      "كل ما يحتاجه مديرو الفنادق لمعرفة الامتثال للفوترة الإلكترونية لهيئة الضرائب المصرية — المواعيد النهائية، المتطلبات التقنية، العقوبات، وكيفية أتمتة ذلك.",
    content:
      "\n# The Complete Guide to ETA E-Invoicing for Hotels in Egypt\n\nEgypt's electronic invoicing mandate is no longer optional. Since the Egyptian Tax Authority (ETA) began rolling out compulsory e-invoicing, every B2B transaction — including hotel procurement — must be digitally signed, UUID-validated, and submitted to the Tax Authority in real time.\n\n## What Is ETA E-Invoicing?\n\nETA e-invoicing is a government mandate requiring all businesses to issue, transmit, and store invoices through a centralized digital platform. Each invoice receives a unique UUID (Universally Unique Identifier) from the Tax Authority, making it cryptographically verifiable and tamper-proof.\n\nFor hotels, this means every purchase order — from food and beverages to linens, cleaning chemicals, and FF&E — must generate an ETA-compliant invoice before settlement.\n\n## Why Hotels Need to Care\n\nHotels operate in a uniquely complex procurement environment:\n\n- **High volume**: A mid-size hotel processes 200–500 supplier invoices per month\n- **Multiple categories**: F&B, chemicals, linens, maintenance, services — each with different tax treatments\n- **Seasonal variance**: Procurement spikes 3–5x during high season, multiplying compliance workload\n- **Multi-governorate operations**: Hotels in Sharm El-Sheikh, Hurghada, and Cairo may face different regional enforcement timelines\n\nNon-compliance results in penalties ranging from EGP 50,000 to EGP 500,000 per violation, plus potential suspension of tax registration.\n\n## Technical Requirements\n\nEvery ETA-compliant invoice must include:\n\n1. **Digital signature** — RSA 2048-bit cryptographic signature\n2. **UUID from ETA** — unique identifier issued in real time\n3. **QR code** — scannable code linking to the invoice on ETA's portal\n4. **Standard JSON format** — invoices submitted via ETA's REST API\n5. **SHA-256 audit trail** — immutable hash chain linking all documents in a transaction\n\n## How HotelsVendors Automates ETA Compliance\n\nHotelsVendors handles the entire ETA compliance pipeline automatically:\n\n- Every invoice generated on the platform is digitally signed at creation\n- UUIDs are fetched from ETA in real time and embedded in the invoice\n- SHA-256 audit trails link PO → delivery note → invoice → payment\n- Three-way matching ensures every transaction is complete before submission\n- Zero manual work — your team never has to think about tax compliance again\n\n## Deadlines and Phase Rollouts\n\n| Phase | Requirement | Deadline |\n|-------|-------------|----------|\n| Phase 1 | Large taxpayers (revenue > EGP 50M) | Completed |\n| Phase 2 | All B2B transactions | Active |\n| Phase 3 | B2C transactions > EGP 500K | 2026 |\n| Phase 4 | All remaining businesses | 2027 |\n\n## Penalties for Non-Compliance\n\n- Late submission: EGP 50,000 – EGP 250,000\n- Missing digital signature: EGP 100,000 – EGP 500,000\n- Incorrect tax classification: EGP 50,000 per invoice\n- Failure to submit: Suspension of tax registration\n\n## The Bottom Line\n\nETA compliance is not optional, and manual compliance is not scalable. Hotels processing hundreds of invoices monthly cannot afford the risk of human error, missed deadlines, or incorrect tax classifications.\n\nHotelsVendors makes compliance invisible — built into every transaction, automated from order to settlement, auditable forever.\n\n---\n\n*Ready to automate your hotel's tax compliance? [Get Started Free](/register)*\n",
    date: "2026-06-15",
    author: "HotelsVendors Team",
    authorTitle: null,
    category: "Compliance",
    categoryAr: "الامتثال",
    tags: ["ETA", "e-invoicing", "tax compliance", "Egypt", "B2B"],
    readTime: 3,
    featured: true,
    coverImage: null,
  },
  {
    slug: "reverse-factoring-egypt-hospitality",
    title: "How Reverse Factoring Works for Egyptian Hotels",
    titleAr: "كيف يعمل التمويل العكسي للفنادق المصرية",
    description:
      "A practical guide to reverse factoring in Egypt's hospitality sector — how suppliers get paid in 48 hours while hotels keep their Net-30/Net-60 terms.",
    descriptionAr:
      "دليل عملي للتمويل العكسي في قطاع الضيافة المصري — كيف يحصل الموردون على الدفع خلال 48 ساعة بينما تحتفظ الفنادق بشروط الدفع الأصلية.",
    content:
      "\n# How Reverse Factoring Works for Egyptian Hotels\n\nCash flow is the biggest pain point in hotel procurement. Hotels want Net-30 or Net-60 terms to preserve working capital. Suppliers want to be paid immediately to fund their operations. Someone has to bridge the gap.\n\nThat's reverse factoring — and it's the core financial innovation behind HotelsVendors.\n\n## What Is Reverse Factoring?\n\nReverse factoring (also called supply chain finance) is a financing arrangement where a financial institution (the factor) pays the supplier early at a small discount, while the hotel keeps its original payment terms.\n\nThe key difference from traditional factoring: **the hotel's creditworthiness determines the rate**, not the supplier's. Since hotels are typically stronger credits than their small suppliers, everyone wins.\n\n## How It Works on HotelsVendors\n\n1. **Hotel places order** through the platform — standard Net-30 terms\n2. **Supplier ships goods** and uploads delivery confirmation\n3. **Hotel confirms receipt** — three-way match (PO + delivery + invoice)\n4. **Factor pays supplier in 48 hours** at 2–4% annualized discount\n5. **Hotel pays factor on day 30** — original terms preserved\n\n## Why Suppliers Love It\n\nWithout HotelsVendors, a small linen supplier in Cairo might wait 60 days to get paid by a resort in Hurghada. That's 60 days of working capital tied up.\n\nWith HotelsVendors reverse factoring, that same supplier gets paid in 48 hours. The 2–4% discount is far cheaper than the alternative — bank overdrafts in Egypt run 15–25%.\n\n## Why Hotels Love It\n\nHotels preserve their cash flow. Net-30 terms stay intact. No need to negotiate early payment discounts with dozens of suppliers individually.\n\n## The Risk Question\n\nWho bears the credit risk? The factor does — and that's why HotelsVendors performs rigorous KYC on every hotel before activating factoring. The platform also maintains a reserve pool for loss mitigation.\n\n---\n\n*Ready to unlock better terms for your hotel and suppliers? [Get Started Free](/register)*\n",
    date: "2026-06-10",
    author: "HotelsVendors Team",
    authorTitle: null,
    category: "Factoring",
    categoryAr: "التمويل",
    tags: ["reverse factoring", "supply chain finance", "working capital", "Egypt", "B2B"],
    readTime: 3,
    featured: true,
    coverImage: null,
  },
  {
    slug: "shared-route-logistics-red-sea-resorts",
    title: "Shared-Route Logistics: Solving Delivery Challenges for Red Sea Resorts",
    titleAr: "اللوجستيات عبر المسارات المشتركة: حل تحديات التوصيل لمنتجعات البحر الأحمر",
    description:
      "How HotelsVendors' Shark-Breaker shared logistics model reduces delivery costs by 40% for hotels in Hurghada, Sharm El-Sheikh, and the North Coast.",
    descriptionAr:
      "كيف يقلل نموذج اللوجستيات المشتركة Shark-Breaker من تكاليف التوصيل بنسبة 40% للفنادق في الغردقة وشرم الشيخ والساحل الشمالي.",
    content:
      "\n# Shared-Route Logistics: Solving Delivery Challenges for Red Sea Resorts\n\nA resort in Hurghada orders from 30+ suppliers weekly. Each supplier sends its own truck — sometimes half-empty — down the same Cairo-Hurghada highway. The result: fragmented deliveries, high freight costs, and procurement teams managing dozens of drivers.\n\nHotelsVendors' Shark-Breaker model changes this.\n\n## What Is Shark-Breaker?\n\nShark-Breaker is a shared logistics model inspired by less-than-truckload (LTL) shipping. Instead of each supplier dispatching individually, orders from multiple suppliers are consolidated at a Cairo hub, then shipped together on optimized routes.\n\nThe name comes from the Red Sea's most famous predator — moving in packs is more efficient.\n\n## How It Works\n\n1. **Suppliers deliver to Shark-Breaker hub** in Cairo (or Alexandria)\n2. **Orders are consolidated** by destination zone (Hurghada, Sharm, North Coast)\n3. **Full trucks depart daily** on optimized routes\n4. **Last-mile delivery** coordinated at the destination\n\n## The 40% Cost Reduction\n\nBy consolidating shipments:\n- **Truck utilization** jumps from 45% (half-empty) to 85%+\n- **Freight cost per kg** drops 35–45%\n- **Delivery frequency** can be reduced from daily to every-other-day without stockouts\n- **Procurement teams** manage 1 logistics partner instead of 30\n\n## Who Benefits?\n\n- **Hotels**: Lower logistics costs, fewer deliveries to coordinate\n- **Suppliers**: No need to manage their own fleet to remote destinations\n- **Environment**: Fewer trucks on the road, lower emissions\n\n---\n\n*Join the Shark-Breaker network — [Get Started Free](/register)*\n",
    date: "2026-05-20",
    author: "HotelsVendors Team",
    authorTitle: null,
    category: "Logistics",
    categoryAr: "اللوجستيات",
    tags: ["logistics", "Red Sea", "shared routes", "delivery", "cost reduction"],
    readTime: 3,
    featured: false,
    coverImage: null,
  },
  {
    slug: "supplier-onboarding-egypt-guide",
    title: "How to Onboard Hotel Suppliers in Egypt: A Step-by-Step Guide",
    titleAr: "كيفية تسجيل الموردين للفنادق في مصر: دليل خطوة بخطوة",
    description:
      "The complete process for onboarding Egyptian hotel suppliers — from commercial registry verification to ETA-compliant invoicing setup in under 24 hours.",
    descriptionAr:
      "العملية الكاملة لتسجيل الموردين المصريين للفنادق — من التحقق من السجل التجاري إلى إعداد الفوترة الإلكترونية المتوافقة في أقل من 24 ساعة.",
    content:
      "\n# How to Onboard Hotel Suppliers in Egypt: A Step-by-Step Guide\n\nEgypt's hotel supply chain is fragmented. Thousands of small and mid-size suppliers serve hotels across the country, but most lack the digital infrastructure to integrate with modern procurement platforms.\n\nHotelsVendors solves this with a streamlined onboarding process that takes suppliers from sign-up to first order in under 24 hours.\n\n## Step 1: Commercial Registry Verification\n\nSuppliers submit their commercial registry (السجل التجاري) and tax card. HotelsVendors verifies these against government databases automatically.\n\n## Step 2: ETA E-Invoicing Setup\n\nEvery supplier must be ETA-compliant. HotelsVendors configures the supplier's digital signature, UUID generation, and QR code embedding — all within the platform.\n\n## Step 3: Product Catalog Upload\n\nSuppliers upload their product catalogs with pricing, MOQs, and lead times. HotelsVendors standardizes the data for comparison shopping.\n\n## Step 4: Bank Account & Factoring Enrollment\n\nSuppliers enroll in the reverse factoring program, enabling 48-hour settlement. Bank account verification takes minutes, not days.\n\n## Step 5: First Order\n\nOnce onboarded, suppliers appear in hotel procurement feeds and can receive POs immediately.\n\n## The 24-Hour Promise\n\nTraditional supplier onboarding takes 2–4 weeks. HotelsVendors compresses this to under 24 hours through automation, pre-integrated ETA APIs, and AI-assisted document verification.\n\n---\n\n*Ready to join Egypt's largest hotel supplier network? [Get Started as Supplier](/register?sector=supplier)*\n",
    date: "2026-05-28",
    author: "HotelsVendors Team",
    authorTitle: null,
    category: "Suppliers",
    categoryAr: "الموردون",
    tags: ["supplier onboarding", "verification", "ETA", "B2B marketplace", "Egypt"],
    readTime: 3,
    featured: false,
    coverImage: null,
  },
];

function recordToPost(record: {
  slug: string;
  title: string;
  titleAr: string | null;
  excerpt: string;
  content: string;
  coverImage: string | null;
  category: string;
  tags: string[];
  authorName: string;
  authorTitle: string | null;
  featured: boolean;
  publishedAt: Date;
}): BlogPost {
  return {
    slug: record.slug,
    title: record.title,
    titleAr: record.titleAr,
    description: record.excerpt,
    descriptionAr: null,
    content: record.content,
    date: record.publishedAt.toISOString().slice(0, 10),
    author: record.authorName,
    authorTitle: record.authorTitle,
    category: record.category,
    categoryAr: null,
    tags: record.tags,
    readTime: Math.max(1, Math.ceil(record.content.length / 2000)),
    featured: record.featured,
    coverImage: record.coverImage,
  };
}

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const records = await prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: "desc" },
    });
    if (records.length > 0) return records.map(recordToPost);
  } catch {
    // fallback below
  }
  return [...FALLBACK_POSTS].sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  try {
    const records = await prisma.blogPost.findMany({
      where: { published: true, featured: true },
      orderBy: { publishedAt: "desc" },
      take: 4,
    });
    if (records.length > 0) return records.map(recordToPost);
  } catch {
    // fallback below
  }
  return FALLBACK_POSTS.filter((p) => p.featured);
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const record = await prisma.blogPost.findUnique({ where: { slug } });
    if (record && record.published) return recordToPost(record);
  } catch {
    // fallback below
  }
  return FALLBACK_POSTS.find((p) => p.slug === slug) ?? null;
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const records = await prisma.blogPost.findMany({
      where: { published: true },
      select: { slug: true },
    });
    if (records.length > 0) return records.map((r) => r.slug);
  } catch {
    // fallback below
  }
  return FALLBACK_POSTS.map((p) => p.slug);
}
