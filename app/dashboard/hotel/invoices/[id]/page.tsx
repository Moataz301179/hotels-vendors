"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  Download,
  Loader2,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Banknote,
  Hash,
  User,
} from "lucide-react";

interface Payment {
  id: string;
  amount: number;
  method: string;
  status: string;
  reference: string | null;
  createdAt: string;
}

interface InvoiceItem {
  id: string;
  quantity: number;
  unitPrice: number;
  total: number;
  product: { id: string; name: string; sku: string };
}

interface OrderSummary {
  id: string;
  orderNumber: string;
  items: InvoiceItem[];
}

interface FactoringCompany {
  id: string;
  name: string;
}

interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  total: number;
  subtotal: number;
  vatAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  etaStatus: string;
  etaUuid: string | null;
  issueDate: string;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
  hotel: { id: string; name: string } | null;
  supplier: { id: string; name: string } | null;
  order: OrderSummary | null;
  factoringCompany: FactoringCompany | null;
  payments: Payment[];
}

function InvoiceStatusBadge({ paymentStatus, dueDate }: { paymentStatus: string; dueDate: string | null }) {
  const now = new Date();
  const due = dueDate ? new Date(dueDate) : null;
  const isOverdue = due && due < now && paymentStatus !== "PAID";
  if (isOverdue) {
    return <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-red-500/10 text-red-400"><span className="w-1.5 h-1.5 rounded-full bg-red-400" />Overdue</span>;
  }
  const config: Record<string, { bg: string; text: string; dot: string; label: string }> = {
    PAID: { bg: "bg-emerald-500/10", text: "text-emerald-400", dot: "bg-emerald-400", label: "Paid" },
    UNPAID: { bg: "bg-amber-500/10", text: "text-amber-400", dot: "bg-amber-400", label: "Pending" },
    PARTIAL: { bg: "bg-blue-500/10", text: "text-blue-400", dot: "bg-blue-400", label: "Partial" },
    REFUNDED: { bg: "bg-surface-raised", text: "text-foreground-tertiary", dot: "bg-foreground-muted", label: "Refunded" },
  };
  const c = config[paymentStatus] || config.UNPAID;
  return <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}><span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />{c.label}</span>;
}

function EtaStatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    VALIDATED: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Validated" },
    ACCEPTED: { bg: "bg-blue-500/10", text: "text-blue-400", label: "Accepted" },
    SUBMITTED: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Submitted" },
    REJECTED: { bg: "bg-red-500/10", text: "text-red-400", label: "Rejected" },
    PENDING: { bg: "bg-surface-raised", text: "text-foreground-tertiary", label: "Pending" },
  };
  const c = config[status] || { bg: "bg-surface-raised", text: "text-foreground-tertiary", label: status };
  return <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider ${c.bg} ${c.text}`}><span className={`w-1.5 h-1.5 rounded-full ${c.text.replace("text-", "bg-")}`} />{c.label}</span>;
}

function formatCurrency(amount: number, currency = "EGP") {
  return `${currency} ${amount.toLocaleString("en-EG")}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-EG", { year: "numeric", month: "short", day: "numeric" });
}

export default function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/v1/invoices/${id}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success) setInvoice(json.data?.invoice ?? json.invoice);
        else setError(json.error || "Failed to load invoice");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="max-w-4xl mx-auto py-12 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-foreground-muted" /></div>;
  }

  if (error || !invoice) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="p-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error || "Invoice not found"}</div>
        <button onClick={() => router.back()} className="mt-4 flex items-center gap-2 text-sm text-foreground-tertiary hover:text-foreground-tertiary transition-colors"><ArrowLeft size={14} /> Go back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 rounded-lg hover:bg-surface-raised text-foreground-muted hover:text-foreground-tertiary transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold text-foreground">{invoice.invoiceNumber}</h1>
              <InvoiceStatusBadge paymentStatus={invoice.paymentStatus} dueDate={invoice.dueDate} />
            </div>
            <p className="text-sm text-foreground-tertiary mt-0.5">
              Issued {formatDate(invoice.issueDate)} {invoice.hotel && `· ${invoice.hotel.name}`} {invoice.supplier && `→ ${invoice.supplier.name}`}
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-raised border border-subtle text-xs text-foreground-tertiary hover:text-foreground transition-colors">
          <Download size={14} /> Download PDF
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><CreditCard size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Total</span></div>
          <p className="text-lg font-bold text-foreground">{formatCurrency(invoice.total, invoice.currency)}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><Calendar size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Due Date</span></div>
          <p className="text-lg font-bold text-foreground">{invoice.dueDate ? formatDate(invoice.dueDate) : "—"}</p>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><FileText size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">ETA Status</span></div>
          <div className="mt-1"><EtaStatusBadge status={invoice.etaStatus} /></div>
        </div>
        <div className="p-4 rounded-xl bg-surface-raised border border-subtle">
          <div className="flex items-center gap-2 mb-2"><Banknote size={14} className="text-foreground-muted" /><span className="text-[10px] text-foreground-muted uppercase tracking-wider">Factoring</span></div>
          <p className="text-lg font-bold text-foreground">{invoice.factoringCompany?.name || "—"}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Items */}
        <div className="lg:col-span-2 space-y-4">
          {invoice.order && invoice.order.items && invoice.order.items.length > 0 && (
            <div className="rounded-xl border border-subtle bg-surface-raised overflow-hidden">
              <div className="px-5 py-3 border-b border-subtle">
                <h3 className="text-sm font-semibold text-foreground">Invoice Items</h3>
              </div>
              <div className="divide-y divide-white/[0.04]">
                {invoice.order.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{item.product?.name}</p>
                      <p className="text-[11px] text-foreground-muted">{item.product?.sku}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{formatCurrency(item.total, invoice.currency)}</p>
                      <p className="text-[11px] text-foreground-muted">&times;{item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-subtle space-y-1">
                <div className="flex justify-between text-xs"><span className="text-foreground-muted">Subtotal</span><span className="text-foreground-tertiary">{formatCurrency(invoice.subtotal || invoice.total, invoice.currency)}</span></div>
                {invoice.vatAmount > 0 && <div className="flex justify-between text-xs"><span className="text-foreground-muted">VAT</span><span className="text-foreground-tertiary">{formatCurrency(invoice.vatAmount, invoice.currency)}</span></div>}
                <div className="flex justify-between text-sm font-semibold pt-1 border-t border-subtle"><span className="text-foreground">Total</span><span className="text-foreground">{formatCurrency(invoice.total, invoice.currency)}</span></div>
              </div>
            </div>
          )}

          {/* Payments */}
          {invoice.payments && invoice.payments.length > 0 && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2"><CreditCard size={14} className="text-foreground-muted" />Payment History</h3>
              <div className="space-y-2">
                {invoice.payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-surface-raised border border-subtle">
                    <div>
                      <p className="text-xs text-foreground">{formatCurrency(p.amount, invoice.currency)}</p>
                      <p className="text-[10px] text-foreground-muted">{p.method} {p.reference && `· ${p.reference}`}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-foreground-tertiary">{formatDate(p.createdAt)}</span>
                      <span className={`block text-[10px] ${p.status === "COMPLETED" ? "text-emerald-400" : "text-amber-400"}`}>{p.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Details */}
        <div className="space-y-4">
          <div className="rounded-xl border border-subtle bg-surface-raised p-4">
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2"><Building2 size={14} className="text-foreground-muted" />Parties</h3>
            <div className="space-y-2">
              {invoice.hotel && <div><p className="text-[11px] text-foreground-muted">Hotel</p><p className="text-sm text-foreground">{invoice.hotel.name}</p></div>}
              {invoice.supplier && <div><p className="text-[11px] text-foreground-muted">Supplier</p><p className="text-sm text-foreground">{invoice.supplier.name}</p></div>}
            </div>
          </div>

          {invoice.order && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-4">
              <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3 flex items-center gap-2"><Hash size={14} className="text-foreground-muted" />Reference Order</h3>
              <p className="text-sm font-mono text-foreground">{invoice.order.orderNumber}</p>
            </div>
          )}

          {invoice.etaUuid && (
            <div className="rounded-xl border border-subtle bg-surface-raised p-4">
              <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">ETA Reference</h3>
              <p className="text-xs font-mono text-foreground-tertiary break-all">{invoice.etaUuid}</p>
            </div>
          )}

          <div className="rounded-xl border border-subtle bg-surface-raised p-4">
            <h3 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider mb-3">Timeline</h3>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between"><span className="text-foreground-muted">Issued</span><span className="text-foreground-tertiary">{formatDate(invoice.issueDate)}</span></div>
              {invoice.dueDate && <div className="flex justify-between"><span className="text-foreground-muted">Due</span><span className="text-foreground-tertiary">{formatDate(invoice.dueDate)}</span></div>}
              {invoice.paidAt && <div className="flex justify-between"><span className="text-foreground-muted">Paid</span><span className="text-emerald-400">{formatDate(invoice.paidAt)}</span></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
