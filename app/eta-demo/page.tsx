"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Shield,
  CheckCircle2,
  XCircle,
  Loader2,
  Copy,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  Clock,
  Fingerprint,
} from "lucide-react";

/* ── ETA Invoice Submission Demo ── */
export default function ETADemo() {
  const [step, setStep] = useState<"form" | "signing" | "submitting" | "success" | "failure">("form");
  const [progress, setProgress] = useState(0);

  /* Form State */
  const [invoice, setInvoice] = useState({
    invoiceNo: "INV-2026-0542",
    hotel: "Nile Resort Cairo",
    supplier: "Nile Fresh Co. (Tax ID: 123-456-789)",
    date: "2026-05-01",
    dueDate: "2026-06-15",
    items: [
      { desc: "Premium Shampoo 300ml", qty: 500, unit: "EGP 18", total: "EGP 9,000" },
      { desc: "Extra Virgin Olive Oil 5L", qty: 48, unit: "EGP 185", total: "EGP 8,880" },
      { desc: "Egyptian Cotton Towel Set", qty: 120, unit: "EGP 320", total: "EGP 38,400" },
    ],
    subtotal: "EGP 56,280",
    vat: "EGP 7,879",
    total: "EGP 64,159",
  });

  const [uuid, setUuid] = useState("");
  const [signature, setSignature] = useState("");

  const generateUUID = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    }).toUpperCase();
  };

  const generateSignature = () => {
    return Array.from({ length: 64 }, () =>
      "0123456789abcdef"[Math.floor(Math.random() * 16)]
    ).join("");
  };

  const handleSubmit = () => {
    setStep("signing");
    setProgress(0);

    // Simulate signing
    let p = 0;
    const signingInterval = setInterval(() => {
      p += 5;
      setProgress(p);
      if (p >= 100) {
        clearInterval(signingInterval);
        setUuid(generateUUID());
        setSignature(generateSignature());
        setStep("submitting");
        simulateSubmission();
      }
    }, 80);
  };

  const simulateSubmission = () => {
    setProgress(0);
    let p = 0;
    const submitInterval = setInterval(() => {
      p += 4;
      setProgress(p);
      if (p >= 100) {
        clearInterval(submitInterval);
        // 90% success rate for demo
        const success = Math.random() > 0.1;
        setStep(success ? "success" : "failure");
      }
    }, 60);
  };

  const reset = () => {
    setStep("form");
    setProgress(0);
    setUuid("");
    setSignature("");
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-600/30 bg-emerald-900/20 px-3 py-1 text-xs font-medium text-emerald-400 mb-3">
              <Shield className="h-3.5 w-3.5" />
              ETA E-Invoicing Demo
            </div>
            <h1 className="text-2xl font-bold">Submit a Digital Tax Invoice</h1>
            <p className="text-sm text-foreground-muted mt-1">
              Real-time submission to the Egyptian Tax Authority with UUID validation and digital signing.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-surface px-4 py-2 text-sm font-medium text-foreground hover:bg-surface-raised transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 max-w-2xl mx-auto">
          {[
            { label: "Invoice", step: "form" },
            { label: "Sign", step: "signing" },
            { label: "Submit", step: "submitting" },
            { label: "Result", step: "success" },
          ].map((s, i, arr) => {
            const isActive =
              (s.step === "form" && step === "form") ||
              (s.step === "signing" && (step === "signing" || step === "submitting" || step === "success" || step === "failure")) ||
              (s.step === "submitting" && (step === "submitting" || step === "success" || step === "failure")) ||
              (s.step === "success" && (step === "success" || step === "failure"));
            const isDone =
              (s.step === "form" && step !== "form") ||
              (s.step === "signing" && (step === "submitting" || step === "success" || step === "failure")) ||
              (s.step === "submitting" && (step === "success" || step === "failure"));
            return (
              <div key={s.label} className="flex items-center gap-2">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  isDone ? "bg-emerald-600 text-white" :
                  isActive ? "bg-brand-700 text-white" :
                  "bg-surface-raised text-foreground-faint"
                }`}>
                  {isDone ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${
                  isActive ? "text-foreground" : "text-foreground-faint"
                }`}>{s.label}</span>
                {i < arr.length - 1 && (
                  <div className={`hidden sm:block w-12 h-px mx-2 ${
                    isDone ? "bg-emerald-600" : "bg-border-subtle"
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* FORM STEP */}
        {step === "form" && (
          <div className="rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
            {/* Invoice Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs text-foreground-faint mb-1.5">Invoice Number</label>
                <input
                  value={invoice.invoiceNo}
                  onChange={(e) => setInvoice({ ...invoice, invoiceNo: e.target.value })}
                  className="w-full rounded-lg border border-border-subtle bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground-faint mb-1.5">Invoice Date</label>
                <input
                  type="date"
                  value={invoice.date}
                  onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                  className="w-full rounded-lg border border-border-subtle bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground-faint mb-1.5">Billed To (Hotel)</label>
                <input
                  value={invoice.hotel}
                  onChange={(e) => setInvoice({ ...invoice, hotel: e.target.value })}
                  className="w-full rounded-lg border border-border-subtle bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs text-foreground-faint mb-1.5">From (Supplier)</label>
                <input
                  value={invoice.supplier}
                  onChange={(e) => setInvoice({ ...invoice, supplier: e.target.value })}
                  className="w-full rounded-lg border border-border-subtle bg-background px-4 py-2.5 text-sm text-foreground focus:border-brand-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Line Items */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3">Line Items</h3>
              <div className="rounded-xl border border-border-subtle bg-background overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-surface-raised text-xs text-foreground-faint uppercase">
                    <tr>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-right">Qty</th>
                      <th className="px-4 py-3 text-right">Unit Price</th>
                      <th className="px-4 py-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {invoice.items.map((item, i) => (
                      <tr key={i}>
                        <td className="px-4 py-3">{item.desc}</td>
                        <td className="px-4 py-3 text-right">{item.qty}</td>
                        <td className="px-4 py-3 text-right text-foreground-muted">{item.unit}</td>
                        <td className="px-4 py-3 text-right font-medium">{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-full max-w-sm space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">Subtotal</span>
                  <span>{invoice.subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-foreground-muted">VAT (14%)</span>
                  <span>{invoice.vat}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-border-subtle">
                  <span>Total Due</span>
                  <span className="text-brand-400">{invoice.total}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
              <button className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-surface px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-raised transition-colors">
                Save as Draft
              </button>
              <button
                onClick={handleSubmit}
                className="group inline-flex items-center gap-2 rounded-lg bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition-all shadow-glow-red"
              >
                <Fingerprint className="h-4 w-4" />
                Digitally Sign &amp; Submit to ETA
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        )}

        {/* SIGNING STEP */}
        {step === "signing" && (
          <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-brand-700/10 flex items-center justify-center mb-6 animate-pulse">
              <Fingerprint className="h-8 w-8 text-brand-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Digitally Signing Invoice</h3>
            <p className="text-foreground-muted mb-6 max-w-md mx-auto">
              Cryptographically signing using the supplier&apos;s registered ETA certificate. This ensures the invoice cannot be tampered with after submission.
            </p>
            <div className="max-w-md mx-auto">
              <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-brand-700 to-brand-500 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-foreground-faint mt-2">{progress}% — Generating SHA-256 signature...</p>
            </div>
          </div>
        )}

        {/* SUBMITTING STEP */}
        {step === "submitting" && (
          <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-900/20 flex items-center justify-center mb-6">
              <Loader2 className="h-8 w-8 text-emerald-400 animate-spin" />
            </div>
            <h3 className="text-xl font-bold mb-2">Submitting to Egyptian Tax Authority</h3>
            <p className="text-foreground-muted mb-6 max-w-md mx-auto">
              Transmitting signed invoice payload to eta.gov.eg API. Awaiting validation response...
            </p>
            <div className="max-w-md mx-auto">
              <div className="h-2 w-full rounded-full bg-surface-raised overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-xs text-foreground-faint mt-2">{progress}% — ETA API response pending...</p>
            </div>

            {/* Live log */}
            <div className="mt-8 max-w-md mx-auto rounded-lg border border-border-subtle bg-background p-4 text-left">
              <p className="text-[10px] uppercase tracking-wider text-foreground-faint mb-2">Submission Log</p>
              <div className="space-y-1 font-mono text-xs">
                <p className="text-emerald-400">✓ Connected to eta.gov.eg API</p>
                <p className="text-emerald-400">✓ UUID generated: {uuid || "..."}</p>
                <p className="text-emerald-400">✓ Digital signature attached</p>
                <p className="text-amber-400">⟳ Validating tax registration...</p>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS STEP */}
        {step === "success" && (
          <div className="rounded-2xl border border-emerald-600/30 bg-emerald-900/10 p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Invoice Accepted by ETA</h3>
            <p className="text-foreground-muted mb-6 max-w-md mx-auto">
              The Egyptian Tax Authority has validated and accepted your digital invoice. It is now legally compliant and registered.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto mb-8">
              <div className="rounded-lg border border-border-subtle bg-surface p-4 text-left">
                <p className="text-[10px] uppercase text-foreground-faint mb-1">ETA UUID</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs font-mono text-emerald-400 truncate">{uuid}</p>
                  <button className="text-foreground-faint hover:text-foreground">
                    <Copy className="h-3 w-3" />
                  </button>
                </div>
              </div>
              <div className="rounded-lg border border-border-subtle bg-surface p-4 text-left">
                <p className="text-[10px] uppercase text-foreground-faint mb-1">Digital Signature</p>
                <p className="text-xs font-mono text-foreground-muted truncate">{signature.slice(0, 24)}...</p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-surface p-4 text-left">
                <p className="text-[10px] uppercase text-foreground-faint mb-1">Submission Time</p>
                <p className="text-xs font-medium">{new Date().toLocaleString("en-EG")}</p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-surface p-4 text-left">
                <p className="text-[10px] uppercase text-foreground-faint mb-1">Validation Status</p>
                <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" />
                  Accepted
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-surface px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-raised transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Submit Another Invoice
              </button>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-600 transition-colors shadow-glow-red"
              >
                Return to Dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* FAILURE STEP */}
        {step === "failure" && (
          <div className="rounded-2xl border border-red-600/30 bg-red-900/10 p-8 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-red-500/20 flex items-center justify-center mb-6">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Submission Failed</h3>
            <p className="text-foreground-muted mb-6 max-w-md mx-auto">
              The Egyptian Tax Authority rejected the invoice. The error has been logged to the dead-letter queue for manual resolution.
            </p>

            <div className="max-w-lg mx-auto mb-8 rounded-lg border border-border-subtle bg-surface p-5 text-left">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <span className="text-sm font-semibold text-red-400">Error Code: ETA-422-BAD_TAX_ID</span>
              </div>
              <p className="text-sm text-foreground-muted mb-2">
                The supplier tax registration number could not be validated against the ETA database.
              </p>
              <div className="rounded bg-background p-3 font-mono text-xs text-foreground-faint">
                <p>timestamp: {new Date().toISOString()}</p>
                <p>uuid: {uuid || "N/A"}</p>
                <p>supplier_tax_id: 123-456-789</p>
                <p>error: Tax ID not found or inactive</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-lg border border-border-default bg-surface px-6 py-3 text-sm font-medium text-foreground hover:bg-surface-raised transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </button>
              <button className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-6 py-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors">
                <Clock className="h-4 w-4" />
                Queue for Manual Resolution
              </button>
            </div>
          </div>
        )}

        {/* Info Cards */}
        {step === "form" && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: Shield,
                title: "Legally Compliant",
                desc: "Every invoice is digitally signed and registered with the ETA in real time.",
              },
              {
                icon: Fingerprint,
                title: "Tamper-Proof",
                desc: "SHA-256 cryptographic signatures ensure invoice integrity from issuance to payment.",
              },
              {
                icon: Clock,
                title: "Auto-Retry",
                desc: "Failed submissions are automatically retried with exponential backoff.",
              },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border border-border-subtle bg-surface p-5">
                <card.icon className="h-6 w-6 text-brand-400 mb-3" />
                <h4 className="text-sm font-semibold mb-1">{card.title}</h4>
                <p className="text-xs text-foreground-muted">{card.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
