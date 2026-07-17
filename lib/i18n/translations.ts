export type Locale = "en" | "ar";

export const defaultLocale: Locale = "en";

export const translations = {
  en: {
    // Navigation
    nav: {
      catalog: "Catalog",
      suppliers: "Suppliers",
      solutions: "Solutions",
      pricing: "Pricing",
      about: "About",
      signIn: "Sign In",
      getStarted: "Get Started",
    },
    // Hero
    hero: {
      badge: "Now serving 200+ Egyptian hotels",
      headline: "The procurement platform built for Egyptian hospitality",
      subheadline:
        "Connect hotels, suppliers, logistics, and factoring on a single compliant platform. From catalog discovery to ETA e-invoice submission.",
      ctaPrimary: "Start Free",
      ctaSecondary: "Explore Catalog",
      stats: {
        skus: "SKUs",
        suppliers: "Suppliers",
        gmv: "EGP GMV",
        delivery: "Delivery",
      },
    },
    // Trust bar
    trust: {
      label: "Trusted by leading hotels",
    },
    // Categories
    categories: {
      title: "Everything your hotel needs",
      subtitle: "Verified suppliers across six core procurement categories.",
      browse: "Browse",
    },
    // Features
    features: {
      title: "Capabilities",
      subtitle:
        "From catalog discovery to ETA-compliant invoicing — one platform, zero fragmentation.",
    },
    // How it works
    howItWorks: {
      title: "How it works",
      subtitle: "From catalog to compliance in three steps",
      steps: {
        discover: {
          title: "Discover",
          desc: "Browse verified suppliers across 6 categories. Filter by price, MOQ, and delivery zone.",
        },
        order: {
          title: "Order",
          desc: "Build purchase orders with AI-suggested bundles. Route through your Authority Matrix.",
        },
        fulfill: {
          title: "Fulfill",
          desc: "Track shared-logistics delivery in real time. Invoice auto-submits to ETA.",
        },
      },
    },
    // Metrics
    metrics: {
      hotels: "Hotels Onboarded",
      clusters: "Coastal Clusters",
      delivery: "Avg. Delivery",
      savings: "Cost Reduction",
    },
    // Pricing
    pricing: {
      title: "Simple, transparent plans",
      subtitle: "No hidden fees. Scale as you grow.",
      starter: {
        name: "Starter",
        price: "0",
        period: "free forever",
        desc: "For small hotels exploring digital procurement",
        cta: "Get Started Free",
      },
      professional: {
        name: "Professional",
        price: "4,500",
        period: "EGP / month",
        desc: "For growing hotels ready to automate",
        cta: "Start 14-Day Trial",
        badge: "Most Popular",
      },
      enterprise: {
        name: "Enterprise",
        price: "Custom",
        period: "tailored pricing",
        desc: "For hotel groups with 5+ properties",
        cta: "Contact Sales",
      },
    },
    // CTA
    cta: {
      title: "Ready to transform your procurement?",
      subtitle:
        "Join 200+ Egyptian hotels and 1,200+ suppliers. Setup takes less than 10 minutes.",
      primary: "Get Started Free",
      secondary: "Browse Catalog",
    },
    // Footer
    footer: {
      tagline: "The Digital Procurement Hub for Egyptian Hospitality.",
      product: "Product",
      company: "Company",
      legal: "Legal",
      copyright: "© 2026 Hotels Vendors. All rights reserved.",
    },
    // Catalog
    catalog: {
      title: "One-Stop Hotel Procurement",
      badge: "Public Marketplace — Browse without signing in",
      searchPlaceholder: "Search products, suppliers, SKUs...",
      filters: "Filters",
      sort: "Sort by",
      viewGrid: "Grid",
      viewList: "List",
      results: "products found",
      noResults: "No products match your search.",
      loginPrompt: "Sign in to add to cart",
      categories: {
        fb: "Food & Beverage",
        hk: "Housekeeping",
        ffe: "Furniture & Fixtures",
        ose: "Operating Supplies",
        gra: "Guest Room Amenities",
        lin: "Linens & Textiles",
        eng: "Engineering",
        spa: "Spa & Recreation",
        it: "IT & Technology",
        sec: "Safety & Security",
      },
    },
    // Language
    language: {
      en: "English",
      ar: "العربية",
    },
  },
  ar: {
    // Navigation
    nav: {
      catalog: "الكتالوج",
      suppliers: "الموردون",
      solutions: "الحلول",
      pricing: "الأسعار",
      about: "عنّا",
      signIn: "تسجيل الدخول",
      getStarted: "ابدأ الآن",
    },
    // Hero
    hero: {
      badge: "نخدم الآن أكثر من 200 فندق مصري",
      headline: "منصة المشتريات المصممة لقطاع الضيافة المصري",
      subheadline:
        "ربط الفنادق والموردين والخدمات اللوجستية والتمويل في منصة موحدة ومتوافقة. من اكتشاف الكتالوج إلى إرسال الفواتير الإلكترونية للهيئة الضريبية.",
      ctaPrimary: "ابدأ مجاناً",
      ctaSecondary: "تصفح الكتالوج",
      stats: {
        skus: "صنف",
        suppliers: "مورد",
        gmv: "مليار جنيه",
        delivery: "ساعة توصيل",
      },
    },
    // Trust bar
    trust: {
      label: "يثق بنا كبار الفنادق",
    },
    // Categories
    categories: {
      title: "كل ما يحتاجه فندقك",
      subtitle: "موردون موثوقون عبر ست فئات مشتريات أساسية.",
      browse: "تصفح",
    },
    // Features
    features: {
      title: "القدرات",
      subtitle:
        "من اكتشاف الكتالوج إلى الفوترة المتوافقة — منصة واحدة، بدون تجزئة.",
    },
    // How it works
    howItWorks: {
      title: "كيف تعمل المنصة",
      subtitle: "من الكتالوج إلى الامتثال في ثلاث خطوات",
      steps: {
        discover: {
          title: "اكتشف",
          desc: "تصفح موردين موثوقين عبر 6 فئات. صفّل حسب السعر والحد الأدنى ومنطقة التوصيل.",
        },
        order: {
          title: "اطلب",
          desc: "بناء أوامر شراء مع حزم مقترحة بالذكاء الاصطناعي. مرر عبر مصفوفة الصلاحيات.",
        },
        fulfill: {
          title: "نفّذ",
          desc: "تتبع التوصيل اللوجستي المشترك في الوقت الفعلي. يتم إرسال الفاتورة تلقائياً للهيئة الضريبية.",
        },
      },
    },
    // Metrics
    metrics: {
      hotels: "فندق مسجل",
      clusters: "تجمع ساحلي",
      delivery: "متوسط التوصيل",
      savings: "تخفيض التكلفة",
    },
    // Pricing
    pricing: {
      title: "خطط بسيطة وشفافة",
      subtitle: "بدون رسوم خفية. توسع مع نموك.",
      starter: {
        name: "البداية",
        price: "0",
        period: "مجاني للأبد",
        desc: "للفنادق الصغيرة التي تستكشف المشتريات الرقمية",
        cta: "ابدأ مجاناً",
      },
      professional: {
        name: "احترافي",
        price: "4,500",
        period: "جنيه / شهر",
        desc: "للفنادق النامية الجاهزة للأتمتة",
        cta: "ابدأ تجربة 14 يوم",
        badge: "الأكثر شعبية",
      },
      enterprise: {
        name: "مؤسسات",
        price: "مخصص",
        period: "تسعير مخصص",
        desc: "لمجموعات الفنادق ذات 5+ فنادق",
        cta: "تواصل مع المبيعات",
      },
    },
    // CTA
    cta: {
      title: "جاهز لتحويل مشترياتك؟",
      subtitle:
        "انضم إلى 200+ فندق مصري و1,200+ مورد. الإعداد يستغرق أقل من 10 دقائق.",
      primary: "ابدأ مجاناً",
      secondary: "تصفح الكتالوج",
    },
    // Footer
    footer: {
      tagline: "مركز المشتريات الرقمي لقطاع الضيافة المصري.",
      product: "المنتج",
      company: "الشركة",
      legal: "قانوني",
      copyright: "© 2026 Hotels Vendors. جميع الحقوق محفوظة.",
    },
    // Catalog
    catalog: {
      title: "منصة مشتريات الفنادق الشاملة",
      badge: "سوق عام — تصفح بدون تسجيل",
      searchPlaceholder: "ابحث في المنتجات والموردين والأكواد...",
      filters: "عوامل التصفية",
      sort: "ترتيب حسب",
      viewGrid: "شبكة",
      viewList: "قائمة",
      results: "منتج موجود",
      noResults: "لا توجد منتجات تطابق بحثك.",
      loginPrompt: "سجل الدخول لإضافة للسلة",
      categories: {
        fb: "الطعام والشراب",
        hk: "التدبير المنزلي",
        ffe: "الأثاث والتجهيزات",
        ose: "مستلزمات التشغيل",
        gra: "مستلزمات الغرف",
        lin: "المفروشات والمنسوجات",
        eng: "الهندسة",
        spa: "السبا والترفيه",
        it: "تكنولوجيا المعلومات",
        sec: "السلامة والأمان",
      },
    },
    // Language
    language: {
      en: "English",
      ar: "العربية",
    },
  },
} as const;

export type Translations = typeof translations.en | typeof translations.ar;

export function getTranslation(locale: Locale): typeof translations[Locale] {
  return translations[locale] || translations.en;
}

export function isRTL(locale: Locale): boolean {
  return locale === "ar";
}
