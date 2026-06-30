"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Package, TrendingUp, ShoppingCart, CreditCard,
  ArrowUpRight, ArrowDownRight, Plus, Settings,
  BarChart3, Layers, Sparkles,
} from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

interface SubscriptionInfo {
  id: string;
  status: string;
  plan: { name: string; price: number; currency: string; maxProducts: number; maxOrders: number };
}

interface ProductCount {
  total: number;
  active: number;
}

export default function InvoDashboardPage() {
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [productCount, setProductCount] = useState<ProductCount>({ total: 0, active: 0 });
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [subRes, prodRes] = await Promise.all([
          fetch("/api/v1/invo/subscription"),
          fetch("/api/v1/products?limit=1&page=1"),
        ]);
        const subJson = await subRes.json();
        if (subJson.success) setSubscription(subJson.data);
        const prodJson = await prodRes.json();
        if (prodJson.success) {
          setProductCount({
            total: prodJson.data.pagination.total,
            active: prodJson.data.products.filter((p: { status: string }) => p.status === "ACTIVE").length,
          });
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const productUsage = subscription
    ? Math.round((productCount.total / subscription.plan.maxProducts) * 100)
    : 0;

  const stats = [
    {
      icon: Package,
      label: "Total Products",
      value: productCount.total.toString(),
      sub: `${productCount.active} active`,
      trend: "+12%",
      positive: true,
      href: "/dashboard/invo/products",
    },
    {
      icon: ShoppingCart,
      label: "Orders This Month",
      value: orderCount.toString(),
      sub: subscription ? `Max ${subscription.plan.maxOrders}` : "—",
      trend: "+8%",
      positive: true,
      href: "/dashboard/orders",
    },
    {
      icon: CreditCard,
      label: "Subscription Plan",
      value: subscription?.plan.name || "Free",
      sub: subscription
        ? `EGP ${subscription.plan.price.toLocaleString()}/mo`
        : "No active plan",
      trend: null,
      positive: true,
      href: "/dashboard/invo/subscription",
    },
    {
      icon: TrendingUp,
      label: "Product Usage",
      value: `${productUsage}%`,
      sub: `${productCount.total} / ${subscription?.plan.maxProducts || 10} used`,
      trend: productUsage > 80 ? "Near limit" : "Available",
      positive: productUsage <= 80,
      href: "/dashboard/invo/products",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-foreground-tertiary">
        <div className="w-6 h-6 border-2 border-subtle20 border-t-white rounded-full animate-spin mr-3" />
        <span>Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">INVO Dashboard</h1>
          <p className="text-sm text-foreground-tertiary mt-1">Manage your marketplace presence</p>
        </div>
        <Link
          href="/dashboard/invo/products/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4A843] text-black text-sm font-medium rounded-xl hover:bg-[#e0b856] transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      </div>

      {/* Stats Grid */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <motion.div variants={fadeInUp} className="rounded-xl p-5 bg-surface-raised border border-subtle hover:bg-surface-raised transition-all hover-lift">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-[rgba(212,168,67,0.08)] border border-[rgba(212,168,67,0.12)] flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-[#D4A843]" />
                </div>
                {stat.trend && (
                  <span className={`flex items-center gap-1 text-[12px] font-medium ${stat.positive ? "text-green-400" : "text-red-400"}`}>
                    {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                  </span>
                )}
              </div>
              <div className="text-2xl font-semibold text-foreground mb-0.5">{stat.value}</div>
              <div className="text-[13px] text-foreground-tertiary">{stat.label}</div>
              <div className="text-[11px] text-foreground-muted mt-1">{stat.sub}</div>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <div className="rounded-xl p-6 bg-surface-raised border border-subtle mb-8">
        <h2 className="text-[15px] font-medium text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Package, label: "Manage Products", href: "/dashboard/invo/products" },
            { icon: BarChart3, label: "View Analytics", href: "/dashboard/invo/analytics" },
            { icon: Settings, label: "Subscription", href: "/dashboard/invo/subscription" },
            { icon: Sparkles, label: "Feature a Product", href: "/dashboard/invo/products" },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-3 p-4 rounded-xl bg-surface-raised border border-subtle hover:bg-surface-raised transition-all"
            >
              <action.icon className="w-4 h-4 text-[#D4A843]" />
              <span className="text-[13px] text-foreground/70">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Subscription Banner */}
      {(!subscription || subscription.plan.name === "Starter") && (
        <div className="rounded-xl p-6 bg-gradient-to-r from-[rgba(212,168,67,0.08)] to-transparent border border-[rgba(212,168,67,0.15)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-[15px] font-medium text-foreground mb-1">
                {subscription ? "Upgrade Your Plan" : "Choose a Subscription Plan"}
              </h3>
              <p className="text-[13px] text-foreground-tertiary">
                {subscription
                  ? "Unlock more products, featured listings, and advanced analytics."
                  : "Subscribe to list your products on the marketplace and reach every hotel."}
              </p>
            </div>
            <Link
              href="/dashboard/invo/subscription"
              className="shrink-0 px-5 py-2.5 bg-[#D4A843] text-black text-sm font-medium rounded-xl hover:bg-[#e0b856] transition-all"
            >
              {subscription ? "Upgrade" : "Subscribe"}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
