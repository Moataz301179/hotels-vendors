module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/components/theme/theme-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
    accent: "orange",
    setAccent: ()=>{},
    toggleAccent: ()=>{}
});
function useTheme() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
}
function ThemeProvider({ children }) {
    const [accent, setAccentState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("orange");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setMounted(true);
        const saved = localStorage.getItem("hv-accent-mode");
        if (saved === "lime" || saved === "orange") {
            setAccentState(saved);
            document.documentElement.setAttribute("data-accent", saved);
        } else {
            document.documentElement.setAttribute("data-accent", "orange");
        }
    }, []);
    const setAccent = (mode)=>{
        setAccentState(mode);
        localStorage.setItem("hv-accent-mode", mode);
        document.documentElement.setAttribute("data-accent", mode);
    };
    const toggleAccent = ()=>{
        const next = accent === "orange" ? "lime" : "orange";
        setAccent(next);
    };
    // Prevent hydration mismatch
    if (!mounted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
            children: children
        }, void 0, false);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            accent,
            setAccent,
            toggleAccent
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/components/theme/theme-provider.tsx",
        lineNumber: 55,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/notifications/notification-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "NotificationProvider",
    ()=>NotificationProvider,
    "useNotifications",
    ()=>useNotifications
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
"use client";
;
;
const NotificationContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const STORAGE_KEY = "hv-notifications-v1";
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
function loadFromStorage() {
    if ("TURBOPACK compile-time truthy", 1) return [];
    //TURBOPACK unreachable
    ;
}
function saveToStorage(notifications) {
    if ("TURBOPACK compile-time truthy", 1) return;
    //TURBOPACK unreachable
    ;
}
function NotificationProvider({ children }) {
    const [notifications, setNotifications] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const didInit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Load from storage after hydration to avoid SSR mismatch
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (didInit.current) return;
        didInit.current = true;
        const stored = loadFromStorage();
        if (stored.length > 0) {
            // Defer to avoid synchronous setState-in-effect lint error
            const id = requestAnimationFrame(()=>{
                setNotifications(stored);
            });
            return ()=>cancelAnimationFrame(id);
        }
    }, []);
    // Persist to storage on changes (skip the initial empty state)
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (didInit.current) {
            saveToStorage(notifications);
        }
    }, [
        notifications
    ]);
    const unreadCount = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>notifications.filter((n)=>!n.read).length, [
        notifications
    ]);
    const addNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((notification)=>{
        const newNotification = {
            ...notification,
            id: generateId(),
            read: false,
            timestamp: Date.now()
        };
        setNotifications((prev)=>[
                newNotification,
                ...prev
            ].slice(0, 100));
    }, []);
    const markAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setNotifications((prev)=>prev.map((n)=>n.id === id ? {
                    ...n,
                    read: true
                } : n));
    }, []);
    const markAllAsRead = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setNotifications((prev)=>prev.map((n)=>({
                    ...n,
                    read: true
                })));
    }, []);
    const dismissNotification = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((id)=>{
        setNotifications((prev)=>prev.filter((n)=>n.id !== id));
    }, []);
    const value = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>({
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            dismissNotification
        }), [
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        dismissNotification
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(NotificationContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/notifications/notification-context.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
function useNotifications() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(NotificationContext);
    if (!ctx) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }
    return ctx;
}
}),
"[project]/lib/i18n/translations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "defaultLocale",
    ()=>defaultLocale,
    "getTranslation",
    ()=>getTranslation,
    "isRTL",
    ()=>isRTL,
    "translations",
    ()=>translations
]);
const defaultLocale = "en";
const translations = {
    en: {
        // Navigation
        nav: {
            catalog: "Catalog",
            suppliers: "Suppliers",
            solutions: "Solutions",
            pricing: "Pricing",
            about: "About",
            signIn: "Sign In",
            getStarted: "Get Started"
        },
        // Hero
        hero: {
            badge: "Now serving 200+ Egyptian hotels",
            headline: "The procurement platform built for Egyptian hospitality",
            subheadline: "Connect hotels, suppliers, logistics, and factoring on a single compliant platform. From catalog discovery to ETA e-invoice submission.",
            ctaPrimary: "Start Free",
            ctaSecondary: "Explore Catalog",
            stats: {
                skus: "SKUs",
                suppliers: "Suppliers",
                gmv: "EGP GMV",
                delivery: "Delivery"
            }
        },
        // Trust bar
        trust: {
            label: "Trusted by leading hotels"
        },
        // Categories
        categories: {
            title: "Everything your hotel needs",
            subtitle: "Verified suppliers across six core procurement categories.",
            browse: "Browse"
        },
        // Features
        features: {
            title: "Capabilities",
            subtitle: "From catalog discovery to ETA-compliant invoicing — one platform, zero fragmentation."
        },
        // How it works
        howItWorks: {
            title: "How it works",
            subtitle: "From catalog to compliance in three steps",
            steps: {
                discover: {
                    title: "Discover",
                    desc: "Browse verified suppliers across 6 categories. Filter by price, MOQ, and delivery zone."
                },
                order: {
                    title: "Order",
                    desc: "Build purchase orders with AI-suggested bundles. Route through your Authority Matrix."
                },
                fulfill: {
                    title: "Fulfill",
                    desc: "Track shared-logistics delivery in real time. Invoice auto-submits to ETA."
                }
            }
        },
        // Metrics
        metrics: {
            hotels: "Hotels Onboarded",
            clusters: "Coastal Clusters",
            delivery: "Avg. Delivery",
            savings: "Cost Reduction"
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
                cta: "Get Started Free"
            },
            professional: {
                name: "Professional",
                price: "4,500",
                period: "EGP / month",
                desc: "For growing hotels ready to automate",
                cta: "Start 14-Day Trial",
                badge: "Most Popular"
            },
            enterprise: {
                name: "Enterprise",
                price: "Custom",
                period: "tailored pricing",
                desc: "For hotel groups with 5+ properties",
                cta: "Contact Sales"
            }
        },
        // CTA
        cta: {
            title: "Ready to transform your procurement?",
            subtitle: "Join 200+ Egyptian hotels and 1,200+ suppliers. Setup takes less than 10 minutes.",
            primary: "Get Started Free",
            secondary: "Browse Catalog"
        },
        // Footer
        footer: {
            tagline: "The Digital Procurement Hub for Egyptian Hospitality.",
            product: "Product",
            company: "Company",
            legal: "Legal",
            copyright: "© 2026 Hotels Vendors. All rights reserved."
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
                sec: "Safety & Security"
            }
        },
        // Language
        language: {
            en: "English",
            ar: "العربية"
        }
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
            getStarted: "ابدأ الآن"
        },
        // Hero
        hero: {
            badge: "نخدم الآن أكثر من 200 فندق مصري",
            headline: "منصة المشتريات المصممة لقطاع الضيافة المصري",
            subheadline: "ربط الفنادق والموردين والخدمات اللوجستية والتمويل في منصة موحدة ومتوافقة. من اكتشاف الكتالوج إلى إرسال الفواتير الإلكترونية للهيئة الضريبية.",
            ctaPrimary: "ابدأ مجاناً",
            ctaSecondary: "تصفح الكتالوج",
            stats: {
                skus: "صنف",
                suppliers: "مورد",
                gmv: "مليار جنيه",
                delivery: "ساعة توصيل"
            }
        },
        // Trust bar
        trust: {
            label: "يثق بنا كبار الفنادق"
        },
        // Categories
        categories: {
            title: "كل ما يحتاجه فندقك",
            subtitle: "موردون موثوقون عبر ست فئات مشتريات أساسية.",
            browse: "تصفح"
        },
        // Features
        features: {
            title: "القدرات",
            subtitle: "من اكتشاف الكتالوج إلى الفوترة المتوافقة — منصة واحدة، بدون تجزئة."
        },
        // How it works
        howItWorks: {
            title: "كيف تعمل المنصة",
            subtitle: "من الكتالوج إلى الامتثال في ثلاث خطوات",
            steps: {
                discover: {
                    title: "اكتشف",
                    desc: "تصفح موردين موثوقين عبر 6 فئات. صفّل حسب السعر والحد الأدنى ومنطقة التوصيل."
                },
                order: {
                    title: "اطلب",
                    desc: "بناء أوامر شراء مع حزم مقترحة بالذكاء الاصطناعي. مرر عبر مصفوفة الصلاحيات."
                },
                fulfill: {
                    title: "نفّذ",
                    desc: "تتبع التوصيل اللوجستي المشترك في الوقت الفعلي. يتم إرسال الفاتورة تلقائياً للهيئة الضريبية."
                }
            }
        },
        // Metrics
        metrics: {
            hotels: "فندق مسجل",
            clusters: "تجمع ساحلي",
            delivery: "متوسط التوصيل",
            savings: "تخفيض التكلفة"
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
                cta: "ابدأ مجاناً"
            },
            professional: {
                name: "احترافي",
                price: "4,500",
                period: "جنيه / شهر",
                desc: "للفنادق النامية الجاهزة للأتمتة",
                cta: "ابدأ تجربة 14 يوم",
                badge: "الأكثر شعبية"
            },
            enterprise: {
                name: "مؤسسات",
                price: "مخصص",
                period: "تسعير مخصص",
                desc: "لمجموعات الفنادق ذات 5+ فنادق",
                cta: "تواصل مع المبيعات"
            }
        },
        // CTA
        cta: {
            title: "جاهز لتحويل مشترياتك؟",
            subtitle: "انضم إلى 200+ فندق مصري و1,200+ مورد. الإعداد يستغرق أقل من 10 دقائق.",
            primary: "ابدأ مجاناً",
            secondary: "تصفح الكتالوج"
        },
        // Footer
        footer: {
            tagline: "مركز المشتريات الرقمي لقطاع الضيافة المصري.",
            product: "المنتج",
            company: "الشركة",
            legal: "قانوني",
            copyright: "© 2026 Hotels Vendors. جميع الحقوق محفوظة."
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
                sec: "السلامة والأمان"
            }
        },
        // Language
        language: {
            en: "English",
            ar: "العربية"
        }
    }
};
function getTranslation(locale) {
    return translations[locale] || translations.en;
}
function isRTL(locale) {
    return locale === "ar";
}
}),
"[project]/lib/i18n/language-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LanguageProvider",
    ()=>LanguageProvider,
    "useLanguage",
    ()=>useLanguage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$i18n$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/i18n/translations.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
const LanguageContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
const STORAGE_KEY = "hv_locale";
function getInitialLocale() {
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return "en";
}
function LanguageProvider({ children }) {
    const [locale, setLocaleState] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])("en");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setLocaleState(getInitialLocale());
        setMounted(true);
    }, []);
    const setLocale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((newLocale)=>{
        setLocaleState(newLocale);
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    const toggleLocale = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        setLocale(locale === "en" ? "ar" : "en");
    }, [
        locale,
        setLocale
    ]);
    // Sync on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        locale,
        mounted
    ]);
    const value = {
        locale,
        setLocale,
        toggleLocale,
        dir: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$i18n$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRTL"])(locale) ? "rtl" : "ltr",
        isRTL: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$i18n$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isRTL"])(locale)
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(LanguageContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/i18n/language-context.tsx",
        lineNumber: 66,
        columnNumber: 5
    }, this);
}
function useLanguage() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(LanguageContext);
    if (!ctx) {
        throw new Error("useLanguage must be used within LanguageProvider");
    }
    return ctx;
}
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0atbmfy._.js.map