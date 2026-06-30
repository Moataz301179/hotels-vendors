"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check, CreditCard, ArrowRight, AlertCircle,
  Loader2, Shield, Zap, Users, Package,
} from "lucide-react";
import { LoadingTable } from "@/components/dashboards/shared/loading-card";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: string;
  features: string[];
  maxProducts: number;
  maxOrders: number;
  maxUsers: number;
  cta?: string;
}

interface Subscription {
  id: string;
  status: string;
  planId: string;
  plan: Plan;
  autoRenew: boolean;
  startDate: string;
  endDate: string | null;
}

export default function InvoSubscriptionPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const [plansRes, subRes] = await Promise.all([
          fetch("/api/v1/invo/plans"),
          fetch("/api/v1/invo/subscription"),
        ]);
        const plansJson = await plansRes.json();
        const subJson = await subRes.json();
        if (plansJson.success) setPlans(plansJson.data);
        if (subJson.success) setSubscription(subJson.data);
      } catch {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleSubscribe(planId: string) {
    setSubscribing(planId);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/v1/invo/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, autoRenew: true }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Failed to subscribe");
        return;
      }
      setSubscription(json.data);
      setSuccess(`Subscribed to ${json.data.plan.name} plan successfully!`);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubscribing(null);
    }
  }

  async function handleCancel() {
    if (!subscription) return;
    setSubscribing("cancel");
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch("/api/v1/invo/subscription", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cancel" }),
      });
      const json = await res.json();
      if (!json.success) {
        setError(json.error || "Failed to cancel");
        return;
      }
      setSubscription(null);
      setSuccess("Subscription cancelled successfully.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubscribing(null);
    }
  }

  if (loading) return <LoadingTable rows={8} />;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Subscription</h1>
          <p className="text-sm text-foreground-tertiary mt-1">
            {subscription
              ? `Current plan: ${subscription.plan.name}`
              : "Choose a plan that fits your business"}
          </p>
        </div>
      </div>

      {/* Current Subscription Banner */}
      {subscription && (
        <div className="rounded-xl p-5 mb-8 bg-gradient-to-r from-[rgba(212,168,67,0.08)] to-transparent border border-[rgba(212,168,67,0.15)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-[rgba(212,168,67,0.1)] border border-[rgba(212,168,67,0.15)] flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-[#D4A843]" />
              </div>
              <div>
                <h3 className="text-[16px] text-foreground font-medium">{subscription.plan.name}</h3>
                <p className="text-[13px] text-foreground-tertiary">
                  EGP {subscription.plan.price.toLocaleString()}/{subscription.plan.billingCycle.toLowerCase()}
                  {subscription.autoRenew ? " · Auto-renew on" : ""}
                </p>
                <div className="flex items-center gap-4 mt-2 text-[12px] text-foreground-muted">
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {subscription.plan.maxProducts >= 999999 ? "Unlimited" : subscription.plan.maxProducts} products
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {subscription.plan.maxUsers >= 999 ? "Unlimited" : subscription.plan.maxUsers} users
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleCancel}
              disabled={subscribing === "cancel"}
              className="shrink-0 px-4 py-2 text-[12px] font-medium text-red-400 border border-red-400/20 rounded-xl hover:bg-red-400/10 transition-colors disabled:opacity-50"
            >
              {subscribing === "cancel" ? "Cancelling..." : "Cancel"}
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[13px] text-red-400">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/20 text-[13px] text-green-400">
          <Check className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {plans.map((plan) => {
          const isCurrentPlan = subscription?.planId === plan.id;
          return (
            <motion.div
              key={plan.id}
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className={`rounded-xl p-6 flex flex-col border transition-all ${
                isCurrentPlan
                  ? "border-[rgba(212,168,67,0.3)] bg-[rgba(212,168,67,0.04)]"
                  : "border-subtle bg-surface-raised hover:bg-surface-raised"
              }`}
            >
              <h3 className="text-[18px] text-foreground font-medium mb-1">{plan.name}</h3>
              <div className="mb-1">
                <span className="text-[32px] text-foreground font-semibold">
                  {plan.price === 0 ? "Free" : `EGP ${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-[13px] text-foreground-muted">/{plan.billingCycle.toLowerCase()}</span>
                )}
              </div>
              <p className="text-[12px] text-foreground-muted mb-6">{plan.description}</p>

              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-[13px] text-foreground-muted">
                    <Check className="w-4 h-4 text-[#D4A843] shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrentPlan ? (
                <div className="block text-center py-3 rounded-xl text-[14px] font-medium bg-[rgba(212,168,67,0.1)] text-[#D4A843] border border-[rgba(212,168,67,0.2)]">
                  Current Plan
                </div>
              ) : (
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={subscribing === plan.id}
                  className={`block w-full text-center py-3 rounded-xl text-[14px] font-medium transition-all disabled:opacity-50 ${
                    plan.price > 0
                      ? "bg-[#D4A843] text-black hover:bg-[#e0b856] hover:shadow-[0_0_30px_rgba(212,168,67,0.2)]"
                      : "border border-subtle text-foreground-muted hover:bg-surface-raised"
                  }`}
                >
                  {subscribing === plan.id ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Subscribing...
                    </span>
                  ) : subscription ? (
                    "Switch to This Plan"
                  ) : (
                    plan.cta || "Get Started"
                  )}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* FAQ Link */}
      <div className="mt-8 text-center">
        <Link
          href="/pricing"
          className="inline-flex items-center gap-2 text-[13px] text-foreground-muted hover:text-[#D4A843] transition-colors"
        >
          See detailed pricing FAQ
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
