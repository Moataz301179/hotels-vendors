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
  Phone, Mail, Facebook, Instagram, Linkedin,
} from "lucide-react";

/* ═══════════════════════════════════════════════════
   IMAGE ASSETS — Unsplash Hospitality & Supply Photos
   ═══════════════════════════════════════════════════ */
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
  factory1: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&q=80",
  factory2: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80",
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
  { name: "Egypt Factoring", rate: "1.2% monthly", logo: "EF", color: "#1E3A5F" },
  { name: "Nile Finance", rate: "1.5% monthly", logo: "NF", color: "#7F1D1D" },
  { name: "SME Credit House", rate: "1.1% monthly", logo: "SC", color: "#065F46" },
  { name: "Cairo Capital", rate: "1.3% monthly", logo: "CC", color: "#4A0E4E" },
];

const SUPPLIER_SPOTLIGHT = [
  { name: "Wadi Foods", category: "F&B", rating: 4.9, orders: "12K+", image: IMG.factory1, since: 2019 },
  { name: "Nile Textiles", category: "Housekeeping", rating: 4.8, orders: "8.5K+", image: IMG.factory2, since: 2017 },
  { name: "CleanPro Egypt", category: "Hygiene", rating: 4.7, orders: "6.2K+", image: IMG.factory1, since: 2020 },
  { name: "SteelEdge Egypt", category: "Kitchen", rating: 4.6, orders: "4.1K+", image: IMG.factory2, since: 2018 },
];

const SEARCH_SUGGESTIONS = [
  "olive oil bulk 5L", "egyptian cotton towels", "chef knives professional",
  "coffee beans arabica", "guest amenities set", "bedding king size",
  "cleaning supplies industrial", "bar glassware", "spa essential oils",
  "uniforms housekeeping", "dinner plates porcelain", "slippers disposable",
];

const HERO_SLIDES = [
  { title: "Summer Coastal Stock-Up", subtitle: "Up to 30% off F&B & housekeeping essentials for Red Sea resorts", cta: "Shop Deals", image: IMG.hero1, badge: "Limited Time" },
  { title: "New: Express Delivery", subtitle: "Get orders tomorrow by 2pm across Greater Cairo & Alexandria", cta: "Try Express", image: IMG.hero2, badge: "New" },
  { title: "Supplier Factoring Live", subtitle: "Get paid in 48 hours. Zero paperwork. Non-recourse.", cta: "Learn More", image: IMG.hero3, badge: "Featured" },
];

function formatPrice(egp: number) {
  return `EGP ${egp.toLocaleString()}`;
}

function discountPercent(price: number, was: number) {
  return Math.round(((was - price) / was) * 100);
}

function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star key={i} className={`w-3.5 h-3.5 ${i <= Math.round(rating) ? "fill-[#FFA41C] text-[#FFA41C]" : "fill-gray-200 text-gray-200"}`} />
        ))}
      </div>
      {count !== undefined && <span className="text-xs text-[#007185] hover:text-[#C7511F] hover:underline cursor-pointer">{count}</span>}
    </div>
  );
}

function Header() {
  const [search, setSearch] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartCount] = useState(3);
  const searchRef = useRef<HTMLDivElement>(null);

  const filtered = search ? SEARCH_SUGGESTIONS.filter((s) => s.toLowerCase().includes(search.toLowerCase())) : SEARCH_SUGGESTIONS.slice(0, 5);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div className="bg-[#131921] text-white">
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="flex items-center gap-4 h-[60px]">
            <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity">
              <div className="relative w-10 h-10 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <Image src="/logo-transparent.png" alt="Hotels Vendors" width={32} height={32} className="object-contain" />
              </div>
              <div className="hidden sm:block">
                <div className="text-[18px] font-bold tracking-tight leading-none">Hotels Vendors</div>
                <div className="text-[10px] text-gray-400 tracking-wide">Business Procurement</div>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-1 text-xs cursor-pointer hover:border hover:border-white/30 rounded-sm px-2 py-1 transition-colors">
              <MapPin className="w-3.5 h-3.5 text-white" />
              <div>
                <div className="text-gray-400 text-[10px]">Deliver to</div>
                <div className="font-bold text-[11px]">Cairo, Egypt</div>
              </div>
            </div>

            <div ref={searchRef} className="flex-1 max-w-3xl relative">
              <div className="flex rounded-lg overflow-hidden h-10 bg-white focus-within:ring-2 focus-within:ring-[#B91C1C]">
                <button className="px-3 bg-gray-100 text-gray-600 text-xs border-r border-gray-300 flex items-center gap-1 hover:bg-gray-200 transition-colors">
                  All <ChevronDown className="w-3 h-3" />
                </button>
                <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }} onFocus={() => setShowSuggestions(true)} placeholder="Search hotel supplies, suppliers, SKUs..." className="flex-1 px-3 text-sm text-black outline-none" />
                <button className="px-5 bg-[#B91C1C] hover:bg-[#991B1B] transition-colors flex items-center justify-center">
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute top-full left-0 right-0 bg-white rounded-b-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
                    <div className="px-3 py-2 text-xs text-gray-500 border-b border-gray-100">Popular searches</div>
                    {filtered.map((s) => (
                      <button key={s} onClick={() => { setSearch(s); setShowSuggestions(false); }} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors">
                        <Search className="w-4 h-4 text-gray-400" /> <span>{s}</span>
                      </button>
                    ))}
                    <div className="px-3 py-2 text-xs text-gray-500 border-t border-gray-100">Filters: Price · Delivery · Express · Deals</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              <div className="cursor-pointer hover:border hover:border-white/30 rounded-sm px-3 py-1 transition-colors">
                <div className="text-[10px] text-gray-400">Hello, Sign in</div>
                <div className="text-[11px] font-bold flex items-center gap-0.5">Account <ChevronDown className="w-3 h-3" /></div>
              </div>
              <div className="cursor-pointer hover:border hover:border-white/30 rounded-sm px-3 py-1 transition-colors">
                <div className="text-[10px] text-gray-400">Returns</div>
                <div className="text-[11px] font-bold">& Orders</div>
              </div>
              <Link href="/hotel/order" className="flex items-end gap-1 hover:border hover:border-white/30 rounded-sm px-3 py-1 transition-colors relative">
                <div className="relative">
                  <ShoppingCart className="w-7 h-7" />
                  {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-[#B91C1C] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{cartCount}</span>}
                </div>
                <span className="text-[11px] font-bold pb-0.5">Cart</span>
              </Link>
            </div>

            <button className="lg:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
              {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#232F3E] text-white text-[13px]">
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="flex items-center gap-5 h-[40px] overflow-x-auto scrollbar-hide">
            <button className="flex items-center gap-1 font-bold hover:border hover:border-white/30 rounded-sm px-2 py-1 transition-colors shrink-0">
              <Menu className="w-4 h-4" /> All
            </button>
            <Link href="#deals" className="hover:border hover:border-white/30 rounded-sm px-2 py-1 transition-colors shrink-0">Today&apos;s Deals</Link>
            <Link href="#express" className="hover:border hover:border-white/30 rounded-sm px-2 py-1 transition-colors shrink-0 flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-[#B91C1C]" /> Express</Link>
            <Link href="#factoring" className="hover:border hover:border-white/30 rounded-sm px-2 py-1 transition-colors shrink-0">Factoring</Link>
            <Link href="#suppliers" className="hover:border hover:border-white/30 rounded-sm px-2 py-1 transition-colors shrink-0">Suppliers</Link>
            <Link href="#categories" className="hover:border hover:border-white/30 rounded-sm px-2 py-1 transition-colors shrink-0">Categories</Link>
            <Link href="/register" className="hover:border hover:border-white/30 rounded-sm px-2 py-1 transition-colors shrink-0">Register Business</Link>
            <div className="flex-1" />
            <div className="hidden md:flex items-center gap-2 text-[#B91C1C] font-bold shrink-0">
              <span className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-white">
                <Image src="https://flagcdn.com/w40/eg.png" alt="Egypt" width={20} height={14} className="object-cover" />
              </span>
              Egypt
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenu && (
          <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "tween", duration: 0.3 }} className="fixed inset-0 z-[100] bg-[#131921] lg:hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Image src="/logo-transparent.png" alt="Hotels Vendors" width={28} height={28} className="object-contain" />
                  </div>
                  <span className="font-bold text-lg">Hotels Vendors</span>
                </div>
                <button onClick={() => setMobileMenu(false)}><X className="w-6 h-6" /></button>
              </div>
              <div className="space-y-1 text-[15px]">
                {["Today's Deals", "Express Delivery", "Factoring", "Suppliers", "Categories", "Register Business"].map((item) => (
                  <Link key={item} href="#" className="block py-3 border-b border-white/10">{item}</Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HeroCarousel() {
  const [slide, setSlide] = useState(0);
  useEffect(() => { const timer = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000); return () => clearInterval(timer); }, []);

  return (
    <div className="relative mx-auto max-w-[1500px] px-4">
      <div className="relative h-[280px] sm:h-[350px] lg:h-[400px] rounded-none sm:rounded-lg overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={slide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute inset-0">
            <Image src={HERO_SLIDES[slide].image} alt="" fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
            <div className="absolute inset-0 flex items-center">
              <div className="px-8 sm:px-12 max-w-lg">
                <span className="inline-block px-3 py-1 bg-[#B91C1C] text-white text-[10px] font-bold uppercase tracking-wider rounded-sm mb-4">{HERO_SLIDES[slide].badge}</span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">{HERO_SLIDES[slide].title}</h2>
                <p className="text-white/80 text-sm sm:text-base mb-6 max-w-sm">{HERO_SLIDES[slide].subtitle}</p>
                <button className="px-6 py-2.5 bg-white text-black text-sm font-semibold rounded-sm hover:bg-gray-100 transition-colors">{HERO_SLIDES[slide].cta}</button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <button onClick={() => setSlide((s) => (s - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:border hover:border-white/30 rounded-sm transition-colors">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button onClick={() => setSlide((s) => (s + 1) % HERO_SLIDES.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center hover:border hover:border-white/30 rounded-sm transition-colors">
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
      <div className="flex justify-center gap-2 mt-3">
        {HERO_SLIDES.map((_, i) => <button key={i} onClick={() => setSlide(i)} className={`w-2 h-2 rounded-full transition-colors ${i === slide ? "bg-[#B91C1C]" : "bg-gray-300"}`} />)}
      </div>
    </div>
  );
}

function CategoryGrid() {
  return (
    <section id="categories" className="mx-auto max-w-[1500px] px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-[#0F1111] mb-5">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/catalog?category=${cat.id}`} className="group text-center">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 bg-gray-100">
                <Image src={cat.image} alt={cat.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p className="text-xs font-medium text-[#0F1111] group-hover:text-[#B91C1C] transition-colors">{cat.name}</p>
              <p className="text-[10px] text-gray-500">{cat.count}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCarousel({ title, products, id, badge }: { title: string; products: typeof DEALS; id?: string; badge?: React.ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => { if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" }); };

  return (
    <section id={id} className="mx-auto max-w-[1500px] px-4 py-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-[#0F1111]">{title}</h2>
            {badge}
          </div>
          <Link href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline font-medium">See all</Link>
        </div>
        <button onClick={() => scroll("left")} className="absolute left-2 top-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-md border border-gray-200 rounded-full flex items-center justify-center transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button onClick={() => scroll("right")} className="absolute right-2 top-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-md border border-gray-200 rounded-full flex items-center justify-center transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1 scroll-smooth" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {products.map((product) => (
            <div key={product.id} className="min-w-[220px] max-w-[220px] flex-shrink-0 group cursor-pointer">
              <div className="relative h-[200px] bg-gray-50 rounded-lg overflow-hidden mb-2 border border-gray-100">
                <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                {product.express && <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#B91C1C] text-white text-[10px] font-bold rounded-sm flex items-center gap-1"><Zap className="w-3 h-3" /> Express</div>}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
              </div>
              <div className="space-y-1">
                <Link href="#" className="text-sm text-[#0F1111] hover:text-[#C7511F] line-clamp-2 leading-snug font-medium">{product.name}</Link>
                <Stars rating={product.rating} count={product.reviews} />
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-[#B91C1C]">{formatPrice(product.price)}</span>
                  <span className="text-xs text-gray-500 line-through">{formatPrice(product.was)}</span>
                </div>
                <div className="text-xs text-[#067D62] font-medium flex items-center gap-1"><BadgePercent className="w-3 h-3" /> Save {discountPercent(product.price, product.was)}%</div>
                <div className="text-xs text-gray-500 flex items-center gap-1"><Truck className="w-3 h-3" /> Get it {product.delivery.toLowerCase()}</div>
                <div className="text-[10px] text-gray-400">MOQ: {product.moq} units · {product.supplier}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FactoringSection() {
  return (
    <section id="factoring" className="mx-auto max-w-[1500px] px-4 py-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-5">
          <Landmark className="w-6 h-6 text-[#B91C1C]" />
          <h2 className="text-xl font-bold text-[#0F1111]">Factoring Partners</h2>
          <span className="text-sm text-gray-500">Get paid in 48 hours instead of 90 days</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {FACTORING_PARTNERS.map((fp) => (
            <div key={fp.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md hover:border-[#B91C1C]/30 transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: fp.color }}>{fp.logo}</div>
                <div>
                  <div className="text-sm font-semibold text-[#0F1111]">{fp.name}</div>
                  <div className="text-xs text-gray-500">Non-recourse factoring</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs"><span className="text-gray-500">Rate from</span><span className="font-bold text-[#067D62]">{fp.rate}</span></div>
              <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400"><ShieldCheck className="w-3 h-3" /> ETA-compliant invoices accepted</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SupplierCarousel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => { if (scrollRef.current) scrollRef.current.scrollBy({ left: dir === "left" ? -300 : 300, behavior: "smooth" }); };

  return (
    <section id="suppliers" className="mx-auto max-w-[1500px] px-4 py-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#0F1111]">Featured Suppliers</h2>
          <Link href="#" className="text-sm text-[#007185] hover:text-[#C7511F] hover:underline font-medium">See all suppliers</Link>
        </div>
        <button onClick={() => scroll("left")} className="absolute left-2 top-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-md border border-gray-200 rounded-full flex items-center justify-center transition-colors">
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <button onClick={() => scroll("right")} className="absolute right-2 top-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-md border border-gray-200 rounded-full flex items-center justify-center transition-colors">
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
        <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-1 scroll-smooth" style={{ scrollbarWidth: "none" }}>
          {SUPPLIER_SPOTLIGHT.map((s) => (
            <div key={s.name} className="min-w-[260px] max-w-[260px] flex-shrink-0 border border-gray-200 rounded-lg overflow-hidden hover:shadow-md hover:border-[#B91C1C]/30 transition-all cursor-pointer">
              <div className="relative h-[120px] bg-gray-100">
                <Image src={s.image} alt={s.name} fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-white font-bold text-sm">{s.name}</div>
                  <div className="text-white/70 text-[10px]">{s.category} · Est. {s.since}</div>
                </div>
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-[#FFA41C] text-[#FFA41C]" /><span className="font-medium">{s.rating}</span></div>
                  <span className="text-gray-500">{s.orders} orders</span>
                </div>
                <button className="w-full mt-3 py-1.5 text-xs font-medium rounded-sm border border-[#B91C1C] text-[#B91C1C] hover:bg-[#B91C1C] hover:text-white transition-colors">View Catalog</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoBanners() {
  return (
    <section className="mx-auto max-w-[1500px] px-4 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#B91C1C] text-white rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-2 mb-2"><Flame className="w-5 h-5" /><span className="text-xs font-bold uppercase tracking-wider">Hot Deal</span></div>
          <h3 className="text-lg font-bold mb-1">Bulk F&B Stock-Up</h3>
          <p className="text-sm text-white/80 mb-3">Oils, grains & spices at wholesale prices</p>
          <span className="text-xs font-bold underline">Shop now</span>
        </div>
        <div className="bg-[#1F2937] text-white rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-2 mb-2"><Zap className="w-5 h-5 text-[#B91C1C]" /><span className="text-xs font-bold uppercase tracking-wider text-[#B91C1C]">Express</span></div>
          <h3 className="text-lg font-bold mb-1">Next-Day Delivery</h3>
          <p className="text-sm text-white/60 mb-3">Cairo & Alexandria — order by 6pm</p>
          <span className="text-xs font-bold underline">Learn more</span>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center gap-2 mb-2"><ShieldCheck className="w-5 h-5 text-[#067D62]" /><span className="text-xs font-bold uppercase tracking-wider text-[#067D62]">Compliance</span></div>
          <h3 className="text-lg font-bold text-[#0F1111] mb-1">100% ETA Ready</h3>
          <p className="text-sm text-gray-500 mb-3">Every invoice digitally signed & submitted</p>
          <span className="text-xs font-bold text-[#007185] underline">How it works</span>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <section className="bg-[#232F3E] text-white">
      <div className="mx-auto max-w-[1500px] px-4 py-3">
        <div className="flex items-center justify-center gap-8 text-xs overflow-x-auto scrollbar-hide">
          <span className="flex items-center gap-1.5 shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> 52+ Hotels Onboarded</span>
          <span className="flex items-center gap-1.5 shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> 68+ Verified Suppliers</span>
          <span className="flex items-center gap-1.5 shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> 15M+ EGP GMV</span>
          <span className="flex items-center gap-1.5 shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> 99.9% ETA Compliant</span>
          <span className="flex items-center gap-1.5 shrink-0"><CheckCircle2 className="w-3.5 h-3.5 text-[#22c55e]" /> Egyptian Tax Authority Registered</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#131921] text-white">
      <div className="bg-[#37475A] text-center py-3 text-xs font-medium hover:bg-[#485769] transition-colors cursor-pointer">Back to top</div>
      <div className="mx-auto max-w-[1500px] px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-sm mb-3">Get to Know Us</h4>
            <div className="space-y-2 text-xs text-gray-300"><div>About Hotels Vendors</div><div>Careers</div><div>Press Releases</div><div>Our Science</div></div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3">Procure with Us</h4>
            <div className="space-y-2 text-xs text-gray-300"><div>Supplier Registration</div><div>Become a Partner</div><div>Advertise Your Products</div><div>Logistics Network</div></div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3">Payment & Factoring</h4>
            <div className="space-y-2 text-xs text-gray-300"><div>Business Credit</div><div>Supplier Factoring</div><div>Deposit Guarantee</div><div>Installment Plans</div></div>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-3">Let Us Help You</h4>
            <div className="space-y-2 text-xs text-gray-300"><div>Your Account</div><div>Your Orders</div><div>Shipping Rates</div><div>Returns & Replacements</div><div>Help Center</div></div>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1500px] px-4 py-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <Image src="/logo-transparent.png" alt="" width={24} height={24} className="object-contain" />
            </div>
            <span className="font-bold">Hotels Vendors</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Globe className="w-3.5 h-3.5" /> English</span>
            <span className="flex items-center gap-1"><Image src="https://flagcdn.com/w40/eg.png" alt="Egypt" width={16} height={12} className="rounded-sm" /> Egypt</span>
          </div>
          <div className="flex gap-4 text-gray-500">
            <Facebook className="w-4 h-4 hover:text-white cursor-pointer" />
            <Instagram className="w-4 h-4 hover:text-white cursor-pointer" />
            <Linkedin className="w-4 h-4 hover:text-white cursor-pointer" />
          </div>
        </div>
      </div>
      <div className="bg-[#131921] border-t border-white/5 py-4 text-center text-[11px] text-gray-500">
        <div className="mx-auto max-w-[1500px] px-4">
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mb-2">
            <span>Conditions of Use</span><span>Privacy Notice</span><span>Interest-Based Ads</span><span>ETA Compliance</span>
          </div>
          <div>© 2026 Hotels Vendors. All rights reserved. Smarter Together.</div>
        </div>
      </div>
    </footer>
  );
}

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-[#E3E6E6]">
      <Header />
      <TrustBar />
      <main className="pb-8">
        <div className="pt-4"><HeroCarousel /></div>
        <CategoryGrid />
        <PromoBanners />
        <ProductCarousel id="deals" title="Deals of the Week" products={DEALS} badge={<span className="px-2 py-0.5 bg-[#B91C1C] text-white text-[10px] font-bold rounded-sm">Up to 30% off</span>} />
        <ProductCarousel id="express" title="Express Delivery — Tomorrow by 2pm" products={EXPRESS_DEALS} badge={<span className="px-2 py-0.5 bg-[#B91C1C] text-white text-[10px] font-bold rounded-sm flex items-center gap-1"><Zap className="w-3 h-3" /> Express</span>} />
        <FactoringSection />
        <ProductCarousel title="Best Sellers in Housekeeping" products={DEALS.slice(2, 6)} />
        <SupplierCarousel />
        <ProductCarousel title="Value Picks — High Quality, Low MOQ" products={DEALS.slice(4, 8)} />
        <section className="mx-auto max-w-[1500px] px-4 py-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <h2 className="text-2xl font-bold text-[#0F1111] mb-2">See personalized recommendations</h2>
            <p className="text-sm text-gray-500 mb-4">Sign in to see items matched to your hotel&apos;s procurement history</p>
            <Link href="/login" className="inline-block px-8 py-2.5 bg-[#B91C1C] hover:bg-[#991B1B] text-white text-sm font-semibold rounded-lg transition-colors">Sign In</Link>
            <p className="text-xs text-gray-500 mt-3">New customer? <Link href="/register" className="text-[#007185] hover:text-[#C7511F] hover:underline">Start here</Link></p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
