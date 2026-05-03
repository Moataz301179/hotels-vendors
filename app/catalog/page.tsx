"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, MapPin, ChevronDown, Menu, X, Star,
  Truck, Clock, BadgePercent, Zap, ArrowRight, ChevronLeft,
  ChevronRight, Heart, Eye, Filter, TrendingDown, Package,
  Building2, Factory, Landmark, ShieldCheck, CreditCard,
  Flame, Sparkles, RotateCcw, ThumbsUp, Globe, CheckCircle2,
  Phone, Mail,
} from "lucide-react";

/* ─────────────────────────────────────────
   DATA
   ───────────────────────────────────────── */
const IMG = {
  hero1: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80",
  hero2: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80",
  hero3: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80",
  fnb: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80",
  housekeeping: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80",
  linens: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
  amenities: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600&q=80",
  engineering: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&q=80",
  spa: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80",
  uniforms: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
  bar: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=600&q=80",
  outdoor: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80",
  oliveOil: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&q=80",
  towels: "https://images.unsplash.com/photo-1616627547584-bf28cee262db?w=400&q=80",
  chefKnife: "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&q=80",
  coffee: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&q=80",
  soap: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&q=80",
  bedding: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80",
  cleaning: "https://images.unsplash.com/photo-1583947581924-860bda6a26df?w=400&q=80",
  plates: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=400&q=80",
  champagne: "https://images.unsplash.com/photo-1594144439088-9cc8609f0a7c?w=400&q=80",
  vacuum: "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=400&q=80",
  teaSet: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=400&q=80",
  slippers: "https://images.unsplash.com/photo-1603252109303-27514432f5c9?w=400&q=80",
};

const CATEGORIES = [
  { id: "fnb", name: "Food & Beverage", image: IMG.fnb, count: "2,400+ items" },
  { id: "housekeeping", name: "Housekeeping", image: IMG.housekeeping, count: "1,800+ items" },
  { id: "linens", name: "Linens & Towels", image: IMG.linens, count: "950+ items" },
  { id: "amenities", name: "Guest Amenities", image: IMG.amenities, count: "1,200+ items" },
  { id: "engineering", name: "Engineering", image: IMG.engineering, count: "670+ items" },
  { id: "spa", name: "Spa & Wellness", image: IMG.spa, count: "430+ items" },
  { id: "uniforms", name: "Staff Uniforms", image: IMG.uniforms, count: "380+ items" },
  { id: "bar", name: "Bar Supplies", image: IMG.bar, count: "720+ items" },
  { id: "outdoor", name: "Outdoor & Pool", image: IMG.outdoor, count: "290+ items" },
];

const DEALS = [
  { id: 1, name: "Extra Virgin Olive Oil 5L — Bulk Pack", price: 2840, was: 3200, image: IMG.oliveOil, rating: 4.7, reviews: 128, delivery: "Tomorrow", express: true, supplier: "Cairo Oils Co.", moq: 6 },
  { id: 2, name: "Premium Egyptian Cotton Bath Towels (Set of 12)", price: 1950, was: 2400, image: IMG.towels, rating: 4.9, reviews: 89, delivery: "2 days", express: true, supplier: "Nile Textiles", moq: 2 },
  { id: 3, name: "Professional Chef Knife Set — 8 Pieces", price: 4200, was: 5500, image: IMG.chefKnife, rating: 4.6, reviews: 56, delivery: "Tomorrow", express: false, supplier: "SteelEdge Egypt", moq: 1 },
  { id: 4, name: "Arabica Coffee Beans 10kg — Single Origin", price: 1680, was: 1950, image: IMG.coffee, rating: 4.8, reviews: 203, delivery: "Tomorrow", express: true, supplier: "Wadi Foods", moq: 2 },
  { id: 5, name: "Luxury Guest Soap Bars (Box of 100)", price: 890, was: 1100, image: IMG.soap, rating: 4.5, reviews: 312, delivery: "3 days", express: false, supplier: "Nefertari Naturals", moq: 5 },
  { id: 6, name: "5-Star Bedding Set — King Size (Pack of 6)", price: 7200, was: 8900, image: IMG.bedding, rating: 4.9, reviews: 67, delivery: "2 days", express: true, supplier: "Nile Textiles", moq: 1 },
  { id: 7, name: "Industrial Floor Cleaner Concentrate 20L", price: 1450, was: 1700, image: IMG.cleaning, rating: 4.4, reviews: 45, delivery: "Tomorrow", express: true, supplier: "CleanPro Egypt", moq: 3 },
  { id: 8, name: "Porcelain Dinner Plate Set (48 pcs)", price: 3600, was: 4200, image: IMG.plates, rating: 4.7, reviews: 98, delivery: "3 days", express: false, supplier: "El Fayoum Ceramics", moq: 2 },
];

const EXPRESS_DEALS = [
  { id: 9, name: "Premium Champagne Glasses (Set of 24)", price: 2100, was: 2600, image: IMG.champagne, rating: 4.8, reviews: 42, delivery: "Tomorrow by 2pm", express: true, supplier: "GlassHouse Cairo", moq: 1 },
  { id: 10, name: "Commercial Vacuum Cleaner — Backpack", price: 5800, was: 7200, image: IMG.vacuum, rating: 4.6, reviews: 34, delivery: "Tomorrow by 2pm", express: true, supplier: "CleanPro Egypt", moq: 1 },
  { id: 11, name: "Moroccan Tea Glass Set (36 pcs)", price: 1200, was: 1500, image: IMG.teaSet, rating: 4.5, reviews: 156, delivery: "Tomorrow by 2pm", express: true, supplier: "El Fayoum Ceramics", moq: 3 },
  { id: 12, name: "Disposable Hotel Slippers (Pack of 200)", price: 650, was: 800, image: IMG.slippers, rating: 4.3, reviews: 289, delivery: "Tomorrow by 2pm", express: true, supplier: "Nile Textiles", moq: 5 },
];

const FACTORING_PARTNERS = [
  { name: "Egypt Factoring", rate: "1.2% monthly", logo: "EF", color: "var(--accent-700)" },
  { name: "Nile Finance", rate: "1.5% monthly", logo: "NF", color: "var(--error)" },
  { name: "SME Credit House", rate: "1.1% monthly", logo: "SC", color: "var(--success)" },
  { name: "Cairo Capital", rate: "1.3% monthly", logo: "CC", color: "var(--info)" },
];

const SUPPLIER_SPOTLIGHT = [
  { name: "Wadi Foods", category: "F&B", rating: 4.9, orders: "12K+", since: 2019, initials: "WF" },
  { name: "Nile Textiles", category: "Housekeeping", rating: 4.8, orders: "8.5K+", since: 2017, initials: "NT" },
  { name: "CleanPro Egypt", category: "Hygiene", rating: 4.7, orders: "6.2K+", since: 2020, initials: "CP" },
  { name: "SteelEdge Egypt", category: "Kitchen", rating: 4.6, orders: "4.1K+", since: 2018, initials: "SE" },
];

const SEARCH_SUGGESTIONS = [
  "olive oil bulk 5L", "egyptian cotton towels", "chef knives professional",
  "coffee beans arabica", "guest amenities set", "bedding king size",
  "cleaning supplies industrial", "bar glassware", "spa essential oils",
  "uniforms housekeeping", "dinner plates porcelain", "slippers disposable",
];

const HERO_SLIDES = [
  { title: "Summer Coastal Stock-Up", subtitle: "Up to 30% off F&B & housekeeping essentials for Red Sea resorts", cta: "Shop Deals", image: IMG.hero1, badge: "Limited Time" },
  { title: "New Supplier Onboarding", subtitle: "68+ verified suppliers with ETA-compliant invoicing", cta: "Browse Suppliers", image: IMG.hero2, badge: "New" },
  { title: "Express Delivery Expanded", subtitle: "Cairo & Alexandria — next-day delivery on 2,000+ SKUs", cta: "Shop Express", image: IMG.hero3, badge: "Express" },
];

/* ─────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────── */
function formatPrice(egp: number) {
  return `EGP ${egp.toLocaleString("en-EG")}`;
}

function discountPercent(price: number, was: number) {
  return Math.round(((was - price) / was) * 100);
}

function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star key={s} className={`w-3 h-3 ${s <= Math.round(rating) ? "fill-[var(--warning)] text-[var(--warning)]" : "text-[var(--border-strong)]"}`} />
        ))}
      </div>
      {count !== undefined && <span className="text-[10px] text-[var(--foreground-muted)]">({count})</span>}
    </div>
  );
}

/* ─────────────────────────────────────────
   HEADER
   ───────────────────────────────────────── */
function Header() {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartCount] = useState(3);
  const searchRef = useRef<HTMLDivElement>(null);

  const filtered = SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(search.toLowerCase())).slice(0, 6);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div className="bg-[var(--surface)] text-[var(--foreground)]">
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="flex items-center gap-4 h-[60px]">
            <Link href="/" className="flex items-center gap-3 shrink-0 hover:opacity-90 transition-opacity">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-[var(--surface-raised)] border border-[var(--border-default)]">
                <Image src="/logo-transparent.png" alt="Hotels Vendors" width={32} height={32} className="object-contain p-1" />
              </div>
              <div className="hidden sm:block">
                <div className="text-base font-bold tracking-tight leading-none text-[var(--foreground)]">Hotels Vendors</div>
                <div className="text-[10px] text-[var(--foreground-muted)] tracking-wide">Business Procurement</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1 text-xs cursor-pointer hover:bg-[var(--surface-raised)] rounded-lg px-2 py-1.5 transition-colors border border-transparent hover:border-[var(--border-default)]">
              <MapPin className="w-3.5 h-3.5 text-[var(--foreground-secondary)]" />
              <div>
                <div className="text-[var(--foreground-muted)] text-[10px]">Deliver to</div>
                <div className="font-bold text-[11px] text-[var(--foreground)]">Cairo, Egypt</div>
              </div>
            </div>

            <div ref={searchRef} className="flex-1 max-w-3xl relative">
              <div className="flex rounded-lg overflow-hidden h-10 bg-[var(--background)] border border-[var(--border-default)] focus-within:border-[var(--accent-500)] focus-within:ring-1 focus-within:ring-[var(--accent-500)] transition-all">
                <button className="px-3 bg-[var(--surface-raised)] text-[var(--foreground-muted)] text-xs border-r border-[var(--border-default)] flex items-center gap-1 hover:bg-[var(--surface-hover)] transition-colors">
                  All <ChevronDown className="w-3 h-3" />
                </button>
                <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} placeholder="Search hotel supplies, suppliers, SKUs..." className="flex-1 px-3 text-sm text-[var(--foreground)] bg-transparent outline-none placeholder:text-[var(--foreground-muted)]" />
                <button className="px-5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] transition-colors flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 bg-[var(--surface)] rounded-b-lg shadow-xl border border-[var(--border-default)] z-50 overflow-hidden">
                    <div className="px-3 py-2 text-xs text-[var(--foreground-muted)] border-b border-[var(--border-subtle)]">Popular searches</div>
                    {filtered.map((s) => (
                      <button key={s} onClick={() => { setSearch(s); setShowSuggestions(false); }} className="w-full text-left px-4 py-2.5 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--surface-raised)] flex items-center gap-3 transition-colors">
                        <Search className="w-4 h-4 text-[var(--foreground-muted)]" /> <span>{s}</span>
                      </button>
                    ))}
                    <div className="px-3 py-2 text-xs text-[var(--foreground-muted)] border-t border-[var(--border-subtle)]">Filters: Price · Delivery · Express · Deals</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              <div className="cursor-pointer hover:bg-[var(--surface-raised)] rounded-lg px-3 py-1.5 transition-colors border border-transparent hover:border-[var(--border-default)]">
                <div className="text-[10px] text-[var(--foreground-muted)]">Hello, Sign in</div>
                <div className="text-[11px] font-bold text-[var(--foreground)] flex items-center gap-0.5">Account <ChevronDown className="w-3 h-3" /></div>
              </div>
              <div className="cursor-pointer hover:bg-[var(--surface-raised)] rounded-lg px-3 py-1.5 transition-colors border border-transparent hover:border-[var(--border-default)]">
                <div className="text-[10px] text-[var(--foreground-muted)]">Returns</div>
                <div className="text-[11px] font-bold text-[var(--foreground)]">& Orders</div>
              </div>
              <Link href="/hotel/order" className="flex items-end gap-1 hover:bg-[var(--surface-raised)] rounded-lg px-3 py-1.5 transition-colors border border-transparent hover:border-[var(--border-default)] relative">
                <div className="relative">
                  <ShoppingCart className="w-7 h-7 text-[var(--foreground)]" />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[var(--accent-500)] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                </div>
                <span className="text-[11px] font-bold text-[var(--foreground)] pb-0.5">Cart</span>
              </Link>
            </div>

            <button className="lg:hidden p-2 text-[var(--foreground)]" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[var(--surface-raised)] text-[var(--foreground)] text-[13px] border-b border-[var(--border-default)]">
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="flex items-center gap-5 h-[40px] overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-1 font-bold hover:bg-[var(--surface-hover)] rounded-lg px-2 py-1 transition-colors shrink-0 text-[var(--foreground)]">
              <Menu className="w-4 h-4" /> All
            </button>
            <Link href="#deals" className="hover:bg-[var(--surface-hover)] rounded-lg px-2 py-1 transition-colors shrink-0 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">Today&apos;s Deals</Link>
            <Link href="#express" className="hover:bg-[var(--surface-hover)] rounded-lg px-2 py-1 transition-colors shrink-0 flex items-center gap-1 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]"><Zap className="w-3.5 h-3.5 text-[var(--accent-500)]" /> Express</Link>
            <Link href="#factoring" className="hover:bg-[var(--surface-hover)] rounded-lg px-2 py-1 transition-colors shrink-0 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">Factoring</Link>
            <Link href="#suppliers" className="hover:bg-[var(--surface-hover)] rounded-lg px-2 py-1 transition-colors shrink-0 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">Suppliers</Link>
            <Link href="#categories" className="hover:bg-[var(--surface-hover)] rounded-lg px-2 py-1 transition-colors shrink-0 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">Categories</Link>
            <Link href="/register" className="hover:bg-[var(--surface-hover)] rounded-lg px-2 py-1 transition-colors shrink-0 text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">Register Business</Link>
            <div className="flex-1" />
            <div className="hidden md:flex items-center gap-2 text-[var(--accent-400)] font-bold shrink-0">
              <span className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-[var(--surface)] border border-[var(--border-default)]">
                <Image src="https://flagcdn.com/w40/eg.png" alt="Egypt" width={20} height={14} className="object-cover" />
              </span>
              Egypt
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.3 }} className="fixed inset-0 z-[100] bg-[var(--surface)] lg:hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[var(--surface-raised)] border border-[var(--border-default)] flex items-center justify-center overflow-hidden">
                    <Image src="/logo-transparent.png" alt="Hotels Vendors" width={28} height={28} className="object-contain p-0.5" />
                  </div>
                  <span className="font-bold text-lg text-[var(--foreground)]">Hotels Vendors</span>
                </div>
                <button onClick={() => setMobileMenu(false)} className="text-[var(--foreground)]"><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-1 text-[15px]">
                {["Today's Deals", "Express Delivery", "Factoring", "Suppliers", "Categories", "Register Business"].map((item) => (
                  <Link key={item} href="#" className="block py-3 border-b border-[var(--border-default)] text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">{item}</Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ─────────────────────────────────────────
   HERO CAROUSEL
   ───────────────────────────────────────── */
function HeroCarousel() {
  const [slide, setSlide] = useState(0);
  useEffect(() => { const timer = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000); return () => clearInterval(timer); }, []);

  return (
    <div className="relative mx-auto max-w-[1500px] px-4">
      <div className="relative h-[280px] sm:h-[350px] lg:h-[400px] rounded-none sm:rounded-xl overflow-hidden border border-[var(--border-default)]">
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
            <Image src={HERO_SLIDES[slide].image} alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 sm:px-12 max-w-lg">
                <span className="inline-block px-3 py-1 bg-[var(--accent-500)] text-white text-[10px] font-bold uppercase tracking-wider rounded-md mb-4">{HERO_SLIDES[slide].badge}</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">{HERO_SLIDES[slide].title}</h2>
                <p className="text-white/70 text-sm sm:text-base mb-6 max-w-sm">{HERO_SLIDES[slide].subtitle}</p>
                <button className="px-6 py-2.5 bg-[var(--surface)] text-[var(--foreground)] text-sm font-semibold rounded-lg hover:bg-[var(--surface-raised)] transition-colors">{HERO_SLIDES[slide].cta}</button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <button onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {HERO_SLIDES.map((_, i) => <button key={i} onClick={() => setSlide(i)} className={`w-2 h-2 rounded-full transition-colors ${i === slide ? "bg-[var(--accent-500)]" : "bg-[var(--border-strong)]"}`} />)}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CATEGORY GRID
   ───────────────────────────────────────── */
function CategoryGrid() {
  return (
    <section id="categories" className="mx-auto max-w-[1500px] px-4 py-8">
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-default)] p-6">
        <h2 className="text-xl font-bold text-[var(--foreground)] mb-5">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="group text-center">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 bg-[var(--surface-raised)] border border-[var(--border-subtle)]">
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p className="text-xs font-medium text-[var(--foreground)] group-hover:text-[var(--accent-400)] transition-colors">{cat.name}</p>
              <p className="text-[10px] text-[var(--foreground-muted)]">{cat.count}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PRODUCT CAROUSEL
   ───────────────────────────────────────── */
function ProductCarousel({ title, products, id, badge }: { title: string; products: typeof DEALS; id?: string; badge?: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => { if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" }); };

  return (
    <section id={id} className="mx-auto max-w-[1500px] px-4 py-4">
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-default)] p-5 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[var(--foreground)]">{title}</h2>
            {badge}
          </div>
          <Link href="#" className="text-sm text-[var(--accent-400)] hover:text-[var(--accent-500)] hover:underline font-medium">See all</Link>
        </div>
        <button onClick={() => scroll("left")} className="absolute left-2 top-1/2 z-10 w-10 h-10 bg-[var(--surface)]/90 hover:bg-[var(--surface-raised)] shadow-md border border-[var(--border-default)] rounded-full flex items-center justify-center transition-colors">
          <ChevronLeft className="w-5 h-5 text-[var(--foreground-secondary)]" />
        </button>
        <button onClick={() => scroll("right")} className="absolute right-2 top-1/2 z-10 w-10 h-10 bg-[var(--surface)]/90 hover:bg-[var(--surface-raised)] shadow-md border border-[var(--border-default)] rounded-full flex items-center justify-center transition-colors">
          <ChevronRight className="w-5 h-5 text-[var(--foreground-secondary)]" />
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1 scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {products.map((product) => (
            <div key={product.id} className="min-w-[220px] max-w-[220px] flex-shrink-0 group cursor-pointer">
              <div className="relative h-[200px] bg-[var(--surface-raised)] rounded-lg overflow-hidden mb-2 border border-[var(--border-subtle)]">
                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                {product.express && <div className="absolute top-2 left-2 px-2 py-0.5 bg-[var(--accent-500)] text-white text-[10px] font-bold rounded-md flex items-center gap-1"><Zap className="w-3 h-3" /> Express</div>}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
              <div className="space-y-1">
                <Link href="#" className="text-sm text-[var(--foreground)] hover:text-[var(--accent-400)] line-clamp-2 leading-snug font-medium transition-colors">{product.name}</Link>
                <Stars rating={product.rating} count={product.reviews} />
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[var(--accent-400)]">{formatPrice(product.price)}</span>
                  <span className="text-xs text-[var(--foreground-muted)] line-through">{formatPrice(product.was)}</span>
                </div>
                <div className="text-xs text-[var(--success)] font-medium flex items-center gap-1"><BadgePercent className="w-3 h-3" /> Save {discountPercent(product.price, product.was)}%</div>
                <div className="text-xs text-[var(--foreground-secondary)] flex items-center gap-1"><Truck className="w-3 h-3" /> Get it {product.delivery.toLowerCase()}</div>
                <div className="text-[10px] text-[var(--foreground-muted)]">MOQ: {product.moq} units · {product.supplier}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FACTORING SECTION
   ───────────────────────────────────────── */
function FactoringSection() {
  return (
    <section id="factoring" className="mx-auto max-w-[1500px] px-4 py-4">
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-default)] p-6">
        <div className="flex items-center gap-3 mb-5">
          <Landmark className="w-6 h-6 text-[var(--accent-400)]" />
          <h2 className="text-xl font-bold text-[var(--foreground)]">Factoring Partners</h2>
          <span className="text-sm text-[var(--foreground-secondary)]">Get paid in 48 hours instead of 90 days</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FACTORING_PARTNERS.map((fp) => (
            <div key={fp.name} className="border border-[var(--border-default)] rounded-lg p-4 hover:shadow-md hover:border-[var(--accent-500)]/30 transition-all cursor-pointer bg-[var(--background)]/40">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: "var(--accent-700)" }}>{fp.logo}</div>
                <div>
                  <div className="text-sm font-semibold text-[var(--foreground)]">{fp.name}</div>
                  <div className="text-xs text-[var(--foreground-secondary)]">Non-recourse factoring</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs"><span className="text-[var(--foreground-secondary)]">Rate from</span><span className="font-bold text-[var(--success)]">{fp.rate}</span></div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-[var(--foreground-muted)]"><ShieldCheck className="w-3 h-3" /> ETA-compliant invoices accepted</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   SUPPLIER CAROUSEL
   ───────────────────────────────────────── */
function SupplierCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => { if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" }); };

  return (
    <section id="suppliers" className="mx-auto max-w-[1500px] px-4 py-4">
      <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-default)] p-5 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[var(--foreground)]">Featured Suppliers</h2>
          <Link href="#" className="text-sm text-[var(--accent-400)] hover:text-[var(--accent-500)] hover:underline font-medium">See all suppliers</Link>
        </div>
        <button onClick={() => scroll("left")} className="absolute left-2 top-1/2 z-10 w-10 h-10 bg-[var(--surface)]/90 hover:bg-[var(--surface-raised)] shadow-md border border-[var(--border-default)] rounded-full flex items-center justify-center transition-colors">
          <ChevronLeft className="w-5 h-5 text-[var(--foreground-secondary)]" />
        </button>
        <button onClick={() => scroll("right")} className="absolute right-2 top-1/2 z-10 w-10 h-10 bg-[var(--surface)]/90 hover:bg-[var(--surface-raised)] shadow-md border border-[var(--border-default)] rounded-full flex items-center justify-center transition-colors">
          <ChevronRight className="w-5 h-5 text-[var(--foreground-secondary)]" />
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1 scroll-smooth" style={{ scrollbarWidth: "none" }}>
          {SUPPLIER_SPOTLIGHT.map((s) => (
            <div key={s.name} className="min-w-[260px] max-w-[260px] flex-shrink-0 border border-[var(--border-default)] rounded-lg overflow-hidden hover:shadow-md hover:border-[var(--accent-500)]/30 transition-all cursor-pointer bg-[var(--background)]/40">
              <div className="relative h-[120px] bg-[var(--surface-raised)] flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--accent-500)]/10 border border-[var(--accent-500)]/20 flex items-center justify-center text-xl font-bold text-[var(--accent-400)]">
                  {s.initials}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-white font-bold text-sm">{s.name}</div>
                  <div className="text-white/70 text-[10px]">{s.category} · Est. {s.since}</div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[var(--warning)] text-[var(--warning)]" /><span className="font-medium text-[var(--foreground)]">{s.rating}</span></div>
                  <span className="text-[var(--foreground-secondary)]">{s.orders} orders</span>
                </div>
                <button className="w-full mt-3 py-1.5 text-xs font-medium rounded-md border border-[var(--accent-500)] text-[var(--accent-400)] hover:bg-[var(--accent-500)] hover:text-white transition-colors">View Catalog</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   PROMO BANNERS
   ───────────────────────────────────────── */
function PromoBanners() {
  return (
    <section className="mx-auto max-w-[1500px] px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[var(--accent-500)] text-white rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-2 mb-2"><Flame className="w-5 h-5" /><span className="text-xs font-bold uppercase tracking-wider">Hot Deal</span></div>
          <h3 className="text-lg font-bold mb-1">Bulk F&B Stock-Up</h3>
          <p className="text-sm text-white/80 mb-3">Oils, grains & spices at wholesale prices</p>
          <span className="text-xs font-bold underline">Shop now</span>
        </div>
        <div className="bg-[var(--surface-raised)] text-[var(--foreground)] rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer border border-[var(--border-default)]">
          <div className="flex items-center gap-2 mb-2"><Zap className="w-5 h-5 text-[var(--accent-400)]" /><span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-400)]">Express</span></div>
          <h3 className="text-lg font-bold mb-1">Next-Day Delivery</h3>
          <p className="text-sm text-[var(--foreground-secondary)] mb-3">Cairo & Alexandria — order by 6pm</p>
          <span className="text-xs font-bold underline text-[var(--accent-400)]">Learn more</span>
        </div>
        <div className="bg-[var(--surface)] border border-[var(--border-default)] rounded-xl p-5 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-5 h-5 text-[var(--success)]" /><span className="text-xs font-bold uppercase tracking-wider text-[var(--success)]">Compliance</span></div>
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-1">100% ETA Ready</h3>
          <p className="text-sm text-[var(--foreground-secondary)] mb-3">Every invoice digitally signed & submitted</p>
          <span className="text-xs font-bold text-[var(--accent-400)] underline">How it works</span>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   TRUST BAR
   ───────────────────────────────────────── */
function TrustBar() {
  return (
    <section className="bg-[var(--surface-raised)] border-b border-[var(--border-default)]">
      <div className="mx-auto max-w-[1500px] px-4 py-3">
        <div className="flex items-center justify-center gap-8 text-xs overflow-x-auto scrollbar-hide">
          <span className="flex items-center gap-1.5 shrink-0 text-[var(--foreground-secondary)]"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" /> 52+ Hotels Onboarded</span>
          <span className="flex items-center gap-1.5 shrink-0 text-[var(--foreground-secondary)]"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" /> 68+ Verified Suppliers</span>
          <span className="flex items-center gap-1.5 shrink-0 text-[var(--foreground-secondary)]"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" /> 15M+ EGP GMV</span>
          <span className="flex items-center gap-1.5 shrink-0 text-[var(--foreground-secondary)]"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" /> 99.9% ETA Compliant</span>
          <span className="flex items-center gap-1.5 shrink-0 text-[var(--foreground-secondary)]"><CheckCircle2 className="w-3.5 h-3.5 text-[var(--success)]" /> Egyptian Tax Authority Registered</span>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────
   FOOTER
   ───────────────────────────────────────── */
function Footer() {
  return (
    <footer className="bg-[var(--surface)] text-[var(--foreground)]">
      <div className="bg-[var(--surface-raised)] text-center py-3 text-xs font-medium hover:bg-[var(--surface-hover)] transition-colors cursor-pointer border-b border-[var(--border-default)] text-[var(--foreground-secondary)]">Back to top</div>
      <div className="mx-auto max-w-[1500px] px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-sm mb-3 text-[var(--foreground)]">Get to Know Us</h4>
            <div className="space-y-2 text-xs text-[var(--foreground-secondary)]"><div className="hover:text-[var(--foreground)] cursor-pointer">About Hotels Vendors</div><div className="hover:text-[var(--foreground)] cursor-pointer">Careers</div><div className="hover:text-[var(--foreground)] cursor-pointer">Press Releases</div><div className="hover:text-[var(--foreground)] cursor-pointer">Our Science</div></div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 text-[var(--foreground)]">Procure with Us</h4>
            <div className="space-y-2 text-xs text-[var(--foreground-secondary)]"><div className="hover:text-[var(--foreground)] cursor-pointer">Supplier Registration</div><div className="hover:text-[var(--foreground)] cursor-pointer">Become a Partner</div><div className="hover:text-[var(--foreground)] cursor-pointer">Advertise Your Products</div><div className="hover:text-[var(--foreground)] cursor-pointer">Logistics Network</div></div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 text-[var(--foreground)]">Payment & Factoring</h4>
            <div className="space-y-2 text-xs text-[var(--foreground-secondary)]"><div className="hover:text-[var(--foreground)] cursor-pointer">Business Credit</div><div className="hover:text-[var(--foreground)] cursor-pointer">Supplier Factoring</div><div className="hover:text-[var(--foreground)] cursor-pointer">Deposit Guarantee</div><div className="hover:text-[var(--foreground)] cursor-pointer">Installment Plans</div></div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3 text-[var(--foreground)]">Let Us Help You</h4>
            <div className="space-y-2 text-xs text-[var(--foreground-secondary)]"><div className="hover:text-[var(--foreground)] cursor-pointer">Your Account</div><div className="hover:text-[var(--foreground)] cursor-pointer">Your Orders</div><div className="hover:text-[var(--foreground)] cursor-pointer">Shipping Rates</div><div className="hover:text-[var(--foreground)] cursor-pointer">Returns & Replacements</div><div className="hover:text-[var(--foreground)] cursor-pointer">Help Center</div></div>
          </div>
        </div>
      </div>
      <div className="border-t border-[var(--border-default)]">
        <div className="mx-auto max-w-[1500px] px-4 py-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--surface-raised)] border border-[var(--border-default)] rounded-lg flex items-center justify-center overflow-hidden">
              <Image src="/logo-transparent.png" alt="" width={28} height={28} className="object-contain p-0.5" />
            </div>
            <span className="font-bold text-[var(--foreground)]">Hotels Vendors</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[var(--foreground-muted)]">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> English</span>
            <span className="flex items-center gap-1"><Image src="https://flagcdn.com/w40/eg.png" alt="Egypt" width={16} height={12} className="rounded-sm" /> Egypt</span>
          </div>
          <div className="flex gap-4 text-[var(--foreground-muted)]">
            <svg className="w-4 h-4 hover:text-[var(--foreground)] cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            <svg className="w-4 h-4 hover:text-[var(--foreground)] cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
            <svg className="w-4 h-4 hover:text-[var(--foreground)] cursor-pointer transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
          </div>
        </div>
      </div>
      <div className="bg-[var(--surface)] border-t border-[var(--border-default)] py-4 text-center text-[11px] text-[var(--foreground-secondary)]">
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-2">
            <span className="hover:text-[var(--foreground)] cursor-pointer">Conditions of Use</span>
            <span className="hover:text-[var(--foreground)] cursor-pointer">Privacy Notice</span>
            <span className="hover:text-[var(--foreground)] cursor-pointer">Interest-Based Ads</span>
            <span className="hover:text-[var(--foreground)] cursor-pointer">ETA Compliance</span>
          </div>
          <div>© 2026 Hotels Vendors. All rights reserved. Smarter Together.</div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────────────────────────────
   PAGE
   ───────────────────────────────────────── */
export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      <TrustBar />
      <main className="pb-8">
        <div className="pt-4"><HeroCarousel /></div>
        <CategoryGrid />
        <PromoBanners />
        <ProductCarousel id="deals" title="Deals of the Week" products={DEALS} badge={<span className="px-2 py-0.5 bg-[var(--accent-500)] text-white text-[10px] font-bold rounded-md">Up to 30% off</span>} />
        <ProductCarousel id="express" title="Express Delivery — Tomorrow by 2pm" products={EXPRESS_DEALS} badge={<span className="px-2 py-0.5 bg-[var(--accent-500)] text-white text-[10px] font-bold rounded-md flex items-center gap-1"><Zap className="w-3 h-3" /> Express</span>} />
        <FactoringSection />
        <ProductCarousel title="Best Sellers in Housekeeping" products={DEALS.slice(2, 6)} />
        <SupplierCarousel />
        <ProductCarousel title="Value Picks — High Quality, Low MOQ" products={DEALS.slice(4, 8)} />
        <section className="mx-auto max-w-[1500px] px-4 py-8">
          <div className="bg-[var(--surface)] rounded-xl border border-[var(--border-default)] p-8 text-center">
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">See personalized recommendations</h2>
            <p className="text-sm text-[var(--foreground-secondary)] mb-4">Sign in to see items matched to your hotel&apos;s procurement history</p>
            <Link href="/login" className="inline-block px-8 py-2.5 bg-[var(--accent-500)] hover:bg-[var(--accent-600)] text-white text-sm font-semibold rounded-lg transition-colors">Sign In</Link>
            <p className="text-xs text-[var(--foreground-secondary)] mt-3">New customer? <Link href="/register" className="text-[var(--accent-400)] hover:text-[var(--accent-500)] hover:underline">Start here</Link></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
