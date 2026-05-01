"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Package,
  Star,
  CheckCircle2,
  Upload,
  Plus,
} from "lucide-react";

export default function SupplierCentral() {
  const [activeTab, setActiveTab] = useState<"orders" | "catalog" | "analytics">("orders");
  const [step, setStep] = useState(1);

  const onboardingSteps = [
    { num: 1, title: "Business Profile", desc: "Company info, tax ID, certifications" },
    { num: 2, title: "Product Catalog", desc: "Upload SKUs, pricing, images" },
    { num: 3, title: "Delivery Zones", desc: "Where you can deliver and lead times" },
    { num: 4, title: "Go Live", desc: "Review and publish your storefront" },
  ];

  const orders = [
    { id: "PO-2841", hotel: "Nile Resort Cairo", items: 12, total: "EGP 45,000", status: "Pending", time: "2h ago" },
    { id: "PO-2840", hotel: "Pyramids Plaza Hotel", items: 8, total: "EGP 12,500", status: "Confirmed", time: "5h ago" },
    { id: "PO-2839", hotel: "Red Sea Oasis", items: 24, total: "EGP 89,000", status: "Delivered", time: "1d ago" },
    { id: "PO-2838", hotel: "Alexandria Grand", items: 6, total: "EGP 18,200", status: "Disputed", time: "2d ago" },
  ];

  const catalogItems = [
    { sku: "HV-SH-001", name: "Premium Shampoo 300ml", price: "EGP 18", stock: 2400, orders: 156 },
    { sku: "HV-LN-042", name: "Egyptian Cotton Towel Set", price: "EGP 320", stock: 450, orders: 89 },
    { sku: "HV-FB-118", name: "Extra Virgin Olive Oil 5L", price: "EGP 185", stock: 120, orders: 234 },
    { sku: "HV-HK-067", name: "All-Purpose Cleaner 4L", price: "EGP 45", stock: 89, orders: 67 },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden aurora pt-24 pb-16">
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-700/30 bg-brand-900/20 px-4 py-1.5 text-xs font-medium text-brand-400 mb-6">
              <Star className="h-3.5 w-3.5" />
              Supplier Program — Zero commission for 90 days
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="gradient-text">Sell</span>{" "}
              <span className="text-foreground">to Egypt&apos;s hotel chains</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground-muted">
              Join 1,000+ verified suppliers on the only procurement platform built for Egyptian hospitality. Fixed pricing, guaranteed payments, and shared-route logistics.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => document.getElementById("onboarding")?.scrollIntoView({ behavior: "smooth" })}
                className="group inline-flex items-center justify-center rounded-xl bg-brand-700 px-8 py-3.5 text-base font-semibold text-white hover:bg-brand-600 transition-all shadow-glow-red"
              >
                Start Onboarding
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-border-default bg-surface/60 px-8 py-3.5 text-base font-medium text-foreground hover:bg-surface-raised transition-all"
              >
                Back to Home
              </Link>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              { value: "EGP 2.1B", label: "Annual GMV" },
              { value: "450+", label: "Active Hotel Buyers" },
              { value: "24hr", label: "Avg. Payment" },
              { value: "98%", label: "Reorder Rate" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border-subtle bg-surface/60 p-5 text-center backdrop-blur-sm">
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="mt-1 text-xs text-foreground-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding */}
      <section id="onboarding" className="py-20 border-t border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Four steps to your first hotel order</h2>
            <p className="mt-3 text-foreground-muted">Most suppliers are live within 48 hours</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {onboardingSteps.map((s) => (
              <div
                key={s.num}
                onClick={() => setStep(s.num)}
                className={`cursor-pointer rounded-2xl border p-6 transition-all ${
                  step === s.num
                    ? "border-brand-600 bg-brand-900/10 shadow-glow-red"
                    : "border-border-subtle bg-surface hover:border-border-default"
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold mb-4 ${
                  step === s.num ? "bg-brand-700 text-white" : "bg-surface-raised text-foreground-muted"
                }`}>
                  {s.num}
                </div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p className="text-sm text-foreground-muted">{s.desc}</p>
                {step === s.num && (
                  <div className="mt-4 flex items-center gap-2 text-xs text-brand-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    In progress
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
            {step === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Business Profile</h3>
                  <div className="space-y-4">
                    {["Company Name", "Tax Registration Number (ETA)", "Commercial Registration", "Primary Contact Email"].map((label) => (
                      <div key={label}>
                        <label className="block text-sm font-medium text-foreground-muted mb-1.5">{label}</label>
                        <input
                          type="text"
                          placeholder={label.includes("Email") ? "supplier@example.com" : ""}
                          className="w-full rounded-lg border border-border-subtle bg-background px-4 py-2.5 text-sm text-foreground placeholder-foreground-faint focus:border-brand-600 focus:outline-none"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-medium text-foreground-muted mb-1.5">Certifications</label>
                      <div className="flex flex-wrap gap-2">
                        {["ISO 9001", "HACCP", "Organic", "Eco-Friendly"].map((cert) => (
                          <button key={cert} className="rounded-full border border-border-default bg-background px-3 py-1 text-xs text-foreground-muted hover:border-brand-600 hover:text-brand-400 transition-colors">
                            {cert}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-dashed border-border-default bg-background/50 p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-10 w-10 text-foreground-faint mb-3" />
                  <p className="text-sm font-medium">Upload company logo &amp; trade license</p>
                  <p className="text-xs text-foreground-faint mt-1">PDF, JPG, or PNG up to 10MB</p>
                </div>
              </div>
            )}
            {step === 2 && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Product Catalog</h3>
                <div className="rounded-xl border border-border-subtle bg-background overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-surface-raised text-xs text-foreground-faint uppercase">
                      <tr>
                        <th className="px-4 py-3 text-left">SKU</th>
                        <th className="px-4 py-3 text-left">Product</th>
                        <th className="px-4 py-3 text-left">Price</th>
                        <th className="px-4 py-3 text-left">Stock</th>
                        <th className="px-4 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {catalogItems.map((item) => (
                        <tr key={item.sku} className="hover:bg-surface-raised/50">
                          <td className="px-4 py-3 font-mono text-xs text-foreground-faint">{item.sku}</td>
                          <td className="px-4 py-3 font-medium">{item.name}</td>
                          <td className="px-4 py-3">{item.price}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs ${item.stock < 100 ? "text-red-400" : "text-emerald-400"}`}>
                              {item.stock} units
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-xs text-brand-400 hover:text-brand-300">Edit</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="px-4 py-3 border-t border-border-subtle">
                    <button className="inline-flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300">
                      <Plus className="h-4 w-4" /> Add Product
                    </button>
                  </div>
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Delivery Zones</h3>
                  <div className="space-y-3">
                    {[
                      { zone: "Greater Cairo", days: "Same day / Next day", fee: "EGP 150" },
                      { zone: "Alexandria & North Coast", days: "2–3 days", fee: "EGP 450" },
                      { zone: "Red Sea (Hurghada)", days: "3–4 days", fee: "EGP 600" },
                      { zone: "Upper Egypt (Luxor/Aswan)", days: "4–5 days", fee: "EGP 750" },
                    ].map((z) => (
                      <div key={z.zone} className="flex items-center justify-between rounded-lg border border-border-subtle bg-background px-4 py-3">
                        <div>
                          <p className="text-sm font-medium">{z.zone}</p>
                          <p className="text-xs text-foreground-faint">{z.days}</p>
                        </div>
                        <span className="text-sm text-foreground-muted">{z.fee}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-xl border border-border-subtle bg-background p-5">
                  <h4 className="text-sm font-semibold mb-3">Coverage Map</h4>
                  <div className="aspect-video rounded-lg bg-surface-raised flex items-center justify-center">
                    <p className="text-xs text-foreground-faint">Interactive map — select zones to activate</p>
                  </div>
                </div>
              </div>
            )}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-8 w-8 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to Go Live</h3>
                <p className="text-foreground-muted max-w-md mx-auto mb-6">
                  Our team will review your profile within 24 hours. Once approved, your products will be visible to 450+ hotel buyers.
                </p>
                <button className="inline-flex items-center justify-center rounded-xl bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-glow-red">
                  Submit for Review
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 bg-surface/30 border-t border-border-subtle">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold">Your Supplier Command Center</h2>
            <p className="mt-3 text-foreground-muted">Everything you need to manage orders, inventory, and growth</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-lg border border-border-subtle bg-background p-1">
              {(["orders", "catalog", "analytics"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-all ${
                    activeTab === tab
                      ? "bg-brand-700 text-white"
                      : "text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            {activeTab === "orders" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Orders</h3>
                  <div className="flex gap-2">
                    {["All", "Pending", "Confirmed", "Delivered"].map((f) => (
                      <button key={f} className="rounded-full border border-border-subtle bg-background px-3 py-1 text-xs text-foreground-muted hover:border-brand-600 hover:text-brand-400 transition-colors">
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
                {orders.map((o) => (
                  <div key={o.id} className="flex items-center justify-between rounded-lg bg-background border border-border-subtle px-4 py-3">
                    <div className="flex items-center gap-4">
                      <div className={`h-2 w-2 rounded-full ${
                        o.status === "Pending" ? "bg-amber-400" :
                        o.status === "Confirmed" ? "bg-brand-400" :
                        o.status === "Delivered" ? "bg-emerald-400" : "bg-red-400"
                      }`} />
                      <div>
                        <p className="text-sm font-medium">{o.id} — {o.hotel}</p>
                        <p className="text-xs text-foreground-faint">{o.items} items • {o.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{o.total}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        o.status === "Pending" ? "bg-amber-500/10 text-amber-400" :
                        o.status === "Confirmed" ? "bg-brand-500/10 text-brand-400" :
                        o.status === "Delivered" ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"
                      }`}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "catalog" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {catalogItems.map((item) => (
                  <div key={item.sku} className="rounded-xl border border-border-subtle bg-background p-4">
                    <div className="aspect-square rounded-lg bg-surface-raised mb-3 flex items-center justify-center">
                      <Package className="h-8 w-8 text-foreground-faint" />
                    </div>
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-foreground-faint font-mono">{item.sku}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm font-bold text-brand-400">{item.price}</span>
                      <span className={`text-xs ${item.stock < 100 ? "text-red-400" : "text-emerald-400"}`}>{item.stock} left</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {activeTab === "analytics" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 rounded-xl border border-border-subtle bg-background p-5">
                  <h4 className="text-sm font-semibold mb-4">Revenue Trend</h4>
                  <div className="flex items-end gap-2 h-40">
                    {[35, 42, 38, 55, 48, 62, 58, 75, 68, 82, 90, 95].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm bg-brand-700/40 hover:bg-brand-600 transition-colors" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-foreground-faint">
                    <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Top Customer", value: "Nile Resort Cairo", sub: "EGP 1.2M YTD" },
                    { label: "Avg. Order Value", value: "EGP 34,500", sub: "+12% vs last month" },
                    { label: "On-Time Delivery", value: "96.4%", sub: "Target: 98%" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-xl border border-border-subtle bg-background p-4">
                      <p className="text-xs text-foreground-faint">{stat.label}</p>
                      <p className="text-lg font-bold mt-1">{stat.value}</p>
                      <p className="text-xs text-emerald-400 mt-0.5">{stat.sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
