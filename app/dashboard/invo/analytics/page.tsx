"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  TrendingUp, Eye, ShoppingCart, MessageSquare,
  ArrowUpRight, ArrowDownRight, Package, Calendar,
} from "lucide-react";
import { LoadingCard } from "@/components/dashboards/shared/loading-card";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface ProductStat {
  id: string;
  name: string;
  sku: string;
  views: number;
  inquiries: number;
  orders: number;
  conversionRate: number;
}

export default function InvoAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [stats, setStats] = useState<ProductStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats([
        { id: "1", name: "Premium Olive Oil 5L", sku: "FNB-001", views: 234, inquiries: 18, orders: 7, conversionRate: 3.0 },
        { id: "2", name: "Egyptian Rice 10kg", sku: "FNB-002", views: 189, inquiries: 12, orders: 5, conversionRate: 2.6 },
        { id: "3", name: "Luxury Bath Amenities Set", sku: "HSK-001", views: 145, inquiries: 9, orders: 3, conversionRate: 2.1 },
        { id: "4", name: "Premium Bed Sheets (King)", sku: "FFE-002", views: 98, inquiries: 6, orders: 2, conversionRate: 2.0 },
      ]);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  const totalViews = stats.reduce((s, p) => s + p.views, 0);
  const totalInquiries = stats.reduce((s, p) => s + p.inquiries, 0);
  const totalOrders = stats.reduce((s, p) => s + p.orders, 0);

  const summaryCards = [
    { icon: Eye, label: "Total Views", value: totalViews.toLocaleString(), trend: "+15%", positive: true },
    { icon: MessageSquare, label: "Inquiries", value: totalInquiries.toLocaleString(), trend: "+8%", positive: true },
    { icon: ShoppingCart, label: "Orders Placed", value: totalOrders.toLocaleString(), trend: "+22%", positive: true },
    { icon: TrendingUp, label: "Avg. Conversion", value: totalViews > 0 ? `${((totalOrders / totalViews) * 100).toFixed(1)}%` : "0%", trend: "+1.2%", positive: true },
  ];

  if (loading) return <LoadingCard rows={8} />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Product Analytics</h1>
          <p className="text-sm text-foreground-tertiary mt-1">Track views, inquiries, and conversions</p>
        </div>
        <div className="flex items-center gap-2">
          {["7d", "30d", "90d"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors ${
                timeRange === range
                  ? "bg-[rgba(212,168,67,0.12)] text-[#D4A843]"
                  : "text-foreground-tertiary hover:text-foreground-tertiary bg-surface-raised"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {summaryCards.map((card) => (
          <motion.div key={card.label} variants={fadeInUp} className="rounded-xl p-5 bg-surface-raised border border-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.12)] flex items-center justify-center">
                <card.icon className="w-5 h-5 text-[#D4A843]" />
              </div>
              <span className={`flex items-center gap-1 text-[12px] font-medium ${card.positive ? "text-green-400" : "text-red-400"}`}>
                {card.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {card.trend}
              </span>
            </div>
            <div className="text-2xl font-semibold text-foreground mb-0.5">{card.value}</div>
            <div className="text-[13px] text-foreground-tertiary">{card.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Product Performance Table */}
      <div className="rounded-xl border border-subtle overflow-hidden">
        <div className="px-5 py-4 border-b border-subtle flex items-center justify-between">
          <h2 className="text-[15px] font-medium text-foreground">Product Performance</h2>
          <Calendar className="w-4 h-4 text-foreground-muted" />
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-surface-raised border-b border-subtle">
              <th className="text-left py-3 px-4 text-foreground-tertiary font-medium">Product</th>
              <th className="text-center py-3 px-4 text-foreground-tertiary font-medium">Views</th>
              <th className="text-center py-3 px-4 text-foreground-tertiary font-medium">Inquiries</th>
              <th className="text-center py-3 px-4 text-foreground-tertiary font-medium">Orders</th>
              <th className="text-center py-3 px-4 text-foreground-tertiary font-medium">Conversion</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((product) => (
              <tr key={product.id} className="border-b border-subtle hover:bg-surface-raised transition-colors">
                <td className="py-3.5 px-4">
                  <div>
                    <span className="text-foreground/80 font-medium">{product.name}</span>
                    <span className="block text-[11px] text-foreground-muted">{product.sku}</span>
                  </div>
                </td>
                <td className="text-center py-3.5 px-4 text-foreground-tertiary">{product.views}</td>
                <td className="text-center py-3.5 px-4 text-foreground-tertiary">{product.inquiries}</td>
                <td className="text-center py-3.5 px-4 text-foreground-tertiary">{product.orders}</td>
                <td className="text-center py-3.5 px-4">
                  <span className="text-green-400 font-medium">{product.conversionRate}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Insight */}
      <div className="mt-6 rounded-xl p-5 bg-gradient-to-r from-[rgba(212,168,67,0.06)] to-transparent border border-[rgba(212,168,67,0.12)]">
        <div className="flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-[#D4A843] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-[14px] text-foreground font-medium mb-1">Optimization Tip</h3>
            <p className="text-[12px] text-foreground-tertiary">
              Products with detailed descriptions and images get 3x more views.
              Consider adding more product images and updating your descriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
