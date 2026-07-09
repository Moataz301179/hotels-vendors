"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  MessageSquare,
  ThumbsUp,
  Flag,
  Filter,
  Search,
  ChevronDown,
  CheckCircle2,
  AlertTriangle,
  Clock,
} from "lucide-react";

interface Review {
  id: string;
  hotel: string;
  supplier: string;
  hotelRating: number;
  supplierRating: number;
  comment: string;
  date: string;
  orderValue: number;
  status: "published" | "pending" | "flagged";
  helpful: number;
  tags: string[];
}

const MOCK_REVIEWS: Review[] = [
  {
    id: "r1",
    hotel: "Four Seasons Cairo at Nile Plaza",
    supplier: "Juhayna Food Industries",
    hotelRating: 5,
    supplierRating: 5,
    comment: "Excellent quality and on-time delivery. The UHT milk packaging was perfect for our high-volume F&B operation.",
    date: "2026-05-06",
    orderValue: 48500,
    status: "published",
    helpful: 12,
    tags: ["quality", "delivery"],
  },
  {
    id: "r2",
    hotel: "Rixos Sharm El Sheikh",
    supplier: "National Co. for Fisheries & Aquaculture",
    hotelRating: 4,
    supplierRating: 5,
    comment: "Prawns were fresh and well-packaged. Slight delay due to Red Sea logistics but supplier communicated proactively.",
    date: "2026-05-05",
    orderValue: 185000,
    status: "published",
    helpful: 8,
    tags: ["freshness", "communication"],
  },
  {
    id: "r3",
    hotel: "Marriott Mena House",
    supplier: "Oriental Weavers",
    hotelRating: 5,
    supplierRating: 4,
    comment: "Carpet quality exceeded expectations. Installation team was professional. One dye lot variance on the hallway runner.",
    date: "2026-05-04",
    orderValue: 220000,
    status: "published",
    helpful: 5,
    tags: ["quality", "installation"],
  },
  {
    id: "r4",
    hotel: "Hilton Cairo Heliopolis",
    supplier: "Cairo Poultry Company",
    hotelRating: 3,
    supplierRating: 3,
    comment: "Two deliveries had temperature excursions. Cold chain needs improvement. Supplier is working on new refrigerated trucks.",
    date: "2026-05-03",
    orderValue: 58000,
    status: "flagged",
    helpful: 15,
    tags: ["cold-chain", "issue"],
  },
  {
    id: "r5",
    hotel: "Jaz Aquamarine Hurghada",
    supplier: "Hurghada Resort Supplies",
    hotelRating: 5,
    supplierRating: 5,
    comment: "Local supplier with exceptional service. Same-day delivery for emergency housekeeping equipment. Highly recommended.",
    date: "2026-05-02",
    orderValue: 185000,
    status: "published",
    helpful: 22,
    tags: ["local", "emergency", "service"],
  },
  {
    id: "r6",
    hotel: "Fairmont Nile City",
    supplier: "Cleopatra Ceramics Group",
    hotelRating: 4,
    supplierRating: 4,
    comment: "Fine china quality is comparable to European imports at 40% lower cost. Minor glaze inconsistency on 2% of plates.",
    date: "2026-05-01",
    orderValue: 145000,
    status: "published",
    helpful: 9,
    tags: ["value", "quality"],
  },
  {
    id: "r7",
    hotel: "Steigenberger Al Dau Beach Hotel",
    supplier: "Red Sea Fish Farms",
    hotelRating: 5,
    supplierRating: 5,
    comment: "Outstanding seafood. The mullet was caught same-day and delivered within 6 hours. guests loved it.",
    date: "2026-04-30",
    orderValue: 125000,
    status: "published",
    helpful: 18,
    tags: ["freshness", "speed"],
  },
  {
    id: "r8",
    hotel: "Baron Resort Sharm El Sheikh",
    supplier: "Sharm Amenities Factory",
    hotelRating: 4,
    supplierRating: 3,
    comment: "Amenities are good but packaging design feels dated. Requested custom branding — supplier quoted 3-week turnaround.",
    date: "2026-04-29",
    orderValue: 78000,
    status: "pending",
    helpful: 3,
    tags: ["branding", "design"],
  },
];

export function ReviewSystem() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [filter, setFilter] = useState<"all" | "published" | "pending" | "flagged">("all");
  const [search, setSearch] = useState("");

  const filtered = reviews.filter((r) => {
    if (filter !== "all" && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        r.hotel.toLowerCase().includes(q) ||
        r.supplier.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const stats = {
    avgHotel: (reviews.reduce((s, r) => s + r.hotelRating, 0) / reviews.length).toFixed(1),
    avgSupplier: (reviews.reduce((s, r) => s + r.supplierRating, 0) / reviews.length).toFixed(1),
    total: reviews.length,
    flagged: reviews.filter((r) => r.status === "flagged").length,
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryStat label="Avg Hotel Rating" value={stats.avgHotel} icon={Star} color="#fbbf24" />
        <SummaryStat label="Avg Supplier Rating" value={stats.avgSupplier} icon={Star} color="#fbbf24" />
        <SummaryStat label="Total Reviews" value={stats.total.toString()} icon={MessageSquare} color="#55b3ff" />
        <SummaryStat label="Flagged" value={stats.flagged.toString()} icon={AlertTriangle} color="#ef4444" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {(["all", "published", "pending", "flagged"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border ${
                filter === f
                  ? "bg-white/[0.06] text-white border-white/[0.08]"
                  : "bg-white/[0.02] text-white/40 border-white/[0.04] hover:text-white/70"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && (
                <span className="ml-1 text-white/30">
                  ({reviews.filter((r) => r.status === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="pl-8 pr-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-[11px] text-white placeholder:text-white/20 outline-none focus:border-white/[0.12] w-56"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="glass-card p-4"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="text-[10px] text-white/30">Hotel</div>
                    <StarRating rating={review.hotelRating} size={10} />
                  </div>
                  <div className="w-px h-8 bg-white/[0.06]" />
                  <div className="flex flex-col items-center gap-0.5">
                    <div className="text-[10px] text-white/30">Supplier</div>
                    <StarRating rating={review.supplierRating} size={10} />
                  </div>
                  <div className="w-px h-8 bg-white/[0.06]" />
                  <div>
                    <div className="text-[12px] font-medium text-white/80">{review.hotel}</div>
                    <div className="text-[11px] text-white/30">→ {review.supplier}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={review.status} />
                  <span className="text-[10px] text-white/20">{review.date}</span>
                </div>
              </div>

              <p className="text-[13px] text-white/55 leading-relaxed mb-3">{review.comment}</p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {review.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md text-[9px] font-medium bg-white/[0.03] text-white/35 border border-white/[0.04]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4 text-[11px] text-white/25">
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={10} />
                    {review.helpful} helpful
                  </span>
                  <span>EGP {review.orderValue.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-[13px] text-white/25">
            No reviews match your filters.
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] text-white/40">{label}</span>
        <Icon size={14} style={{ color }} />
      </div>
      <div className="text-[18px] font-bold text-white">{value}</div>
    </div>
  );
}

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < rating ? "fill-amber-400 text-amber-400" : "text-white/10"}
        />
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: Review["status"] }) {
  const config = {
    published: { icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    pending: { icon: Clock, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    flagged: { icon: Flag, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20" },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border ${c.bg} ${c.color} ${c.border}`}>
      <c.icon size={8} />
      {status}
    </span>
  );
}
