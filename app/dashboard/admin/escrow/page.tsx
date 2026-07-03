"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Search,
  ShieldCheck,
  CreditCard,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  Lock,
  Unlock,
  ArrowUpRight,
  Copy,
} from "lucide-react"

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

type EscrowStatus = {
  funded: boolean
  released: boolean
  amount: number
  paymentUrl?: string
}

type EscrowCreateResponse = {
  paymobOrderId: string
  paymentUrl: string
  escrowReference: string
}

type EscrowReleaseResponse = {
  released: boolean
  message: string
}

export default function EscrowAdminPage() {
  const [invoiceId, setInvoiceId] = useState("")
  const [status, setStatus] = useState<EscrowStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [statusError, setStatusError] = useState("")

  const [createResult, setCreateResult] = useState<EscrowCreateResponse | null>(null)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState("")

  const [releaseType, setReleaseType] = useState("DUE_DATE")
  const [coApproverId, setCoApproverId] = useState("")
  const [releaseResult, setReleaseResult] = useState<EscrowReleaseResponse | null>(null)
  const [releasing, setReleasing] = useState(false)
  const [releaseError, setReleaseError] = useState("")

  const [copiedIndex, setCopiedIndex] = useState<string | null>(null)

  async function handleCheck() {
    if (!invoiceId.trim()) return
    setLoading(true)
    setStatusError("")
    setStatus(null)
    setCreateResult(null)
    setReleaseResult(null)
    try {
      const res = await fetch(`/api/v1/payments/escrow?invoiceId=${encodeURIComponent(invoiceId.trim())}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to fetch escrow status")
      setStatus(json)
    } catch (e) {
      setStatusError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleCreateEscrow() {
    setCreating(true)
    setCreateError("")
    setCreateResult(null)
    try {
      const res = await fetch("/api/v1/payments/escrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId: invoiceId.trim() }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to create escrow")
      setCreateResult(json)
      setStatus((prev) => (prev ? { ...prev, funded: true } : prev))
    } catch (e) {
      setCreateError((e as Error).message)
    } finally {
      setCreating(false)
    }
  }

  async function handleReleaseEscrow() {
    if (!coApproverId.trim()) return
    setReleasing(true)
    setReleaseError("")
    setReleaseResult(null)
    try {
      const res = await fetch("/api/v1/payments/escrow", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: invoiceId.trim(),
          releaseType,
          coApproverId: coApproverId.trim(),
        }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || "Failed to release escrow")
      setReleaseResult(json)
      if (json.released) {
        setStatus((prev) => (prev ? { ...prev, released: true } : prev))
      }
    } catch (e) {
      setReleaseError((e as Error).message)
    } finally {
      setReleasing(false)
    }
  }

  async function handleCopy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(key)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={fadeInUp}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-8 h-8 rounded-lg bg-accent-base/10 flex items-center justify-center">
            <ShieldCheck size={16} className="text-accent-base" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Escrow Management</h1>
        </div>
        <p className="text-sm text-foreground-tertiary ml-11">
          Look up, create, and release payment escrows for invoices
        </p>
      </motion.div>

      {/* Invoice Lookup */}
      <motion.div
        variants={fadeInUp}
        className="rounded-xl border border-subtle bg-surface-raised p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <FileText size={14} className="text-foreground-muted" />
          <h2 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
            Invoice Lookup
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted" />
            <input
              type="text"
              placeholder="Enter Invoice ID..."
              value={invoiceId}
              onChange={(e) => {
                setInvoiceId(e.target.value)
                setStatus(null)
                setCreateResult(null)
                setReleaseResult(null)
                setStatusError("")
              }}
              onKeyDown={(e) => { if (e.key === "Enter") handleCheck() }}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-base/50"
            />
          </div>
          <button
            onClick={handleCheck}
            disabled={loading || !invoiceId.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-base/10 border border-accent-base/20 text-accent-base text-sm font-medium hover:bg-accent-base/20 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
            Check
          </button>
        </div>

        {/* Status Error */}
        {statusError && (
          <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle size={14} />
            {statusError}
          </div>
        )}
      </motion.div>

      {/* Escrow Status */}
      {status && (
        <motion.div variants={fadeInUp} className="space-y-4">
          {/* Status Card */}
          <div className="rounded-xl border border-subtle bg-surface-raised p-5">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={14} className="text-foreground-muted" />
              <h2 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                Escrow Status
              </h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-lg border border-subtle bg-surface-raised">
                <p className="text-[10px] text-foreground-muted uppercase tracking-wider mb-1">Funded</p>
                <div className="flex items-center gap-1.5">
                  {status.funded ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">Yes</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={14} className="text-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">No</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-subtle bg-surface-raised">
                <p className="text-[10px] text-foreground-muted uppercase tracking-wider mb-1">Released</p>
                <div className="flex items-center gap-1.5">
                  {status.released ? (
                    <>
                      <CheckCircle2 size={14} className="text-emerald-400" />
                      <span className="text-xs font-semibold text-emerald-400">Yes</span>
                    </>
                  ) : (
                    <>
                      <Lock size={14} className="text-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">No</span>
                    </>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-lg border border-subtle bg-surface-raised">
                <p className="text-[10px] text-foreground-muted uppercase tracking-wider mb-1">Amount</p>
                <p className="text-xs font-semibold text-foreground">
                  EGP {status.amount.toLocaleString("en-EG")}
                </p>
              </div>
            </div>
            {status.paymentUrl && (
              <div className="mt-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs flex items-center gap-2">
                <ExternalLink size={14} />
                <a
                  href={status.paymentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-blue-300"
                >
                  View Payment Page
                </a>
              </div>
            )}
          </div>

          {/* Create Escrow */}
          {!status.funded && (
            <motion.div
              variants={fadeInUp}
              className="rounded-xl border border-subtle bg-surface-raised p-5"
            >
              <div className="flex items-center gap-2 mb-3">
                <CreditCard size={14} className="text-foreground-muted" />
                <h2 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Create Escrow Deposit
                </h2>
              </div>
              <p className="text-xs text-foreground-tertiary mb-4">
                This invoice has not been funded yet. Create an escrow deposit to secure payment.
              </p>
              <button
                onClick={handleCreateEscrow}
                disabled={creating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-base/10 border border-accent-base/20 text-accent-base text-sm font-medium hover:bg-accent-base/20 transition-colors disabled:opacity-50"
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <CreditCard size={14} />}
                {creating ? "Creating Escrow..." : "Create Escrow"}
              </button>

              {createError && (
                <div className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  {createError}
                </div>
              )}

              {createResult && (
                <div className="mt-4 space-y-2">
                  <div className="p-3 rounded-lg border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 size={14} />
                    Escrow deposit created successfully
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 rounded-lg border border-subtle bg-surface-raised">
                      <div>
                        <p className="text-[10px] text-foreground-muted uppercase">Payment URL</p>
                        <a
                          href={createResult.paymentUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-accent-base hover:underline flex items-center gap-1 mt-0.5"
                        >
                          {createResult.paymentUrl.length > 50
                            ? `${createResult.paymentUrl.slice(0, 50)}...`
                            : createResult.paymentUrl}
                          <ExternalLink size={10} />
                        </a>
                      </div>
                      <button
                        onClick={() => handleCopy(createResult.paymentUrl, "paymentUrl")}
                        className="p-1.5 rounded-lg hover:bg-accent-base/10 text-foreground-muted hover:text-accent-base transition-colors"
                        title="Copy URL"
                      >
                        {copiedIndex === "paymentUrl" ? (
                          <CheckCircle2 size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-subtle bg-surface-raised">
                      <div>
                        <p className="text-[10px] text-foreground-muted uppercase">Escrow Reference</p>
                        <p className="text-xs font-mono text-foreground mt-0.5">{createResult.escrowReference}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(createResult.escrowReference, "escrowRef")}
                        className="p-1.5 rounded-lg hover:bg-accent-base/10 text-foreground-muted hover:text-accent-base transition-colors"
                        title="Copy Reference"
                      >
                        {copiedIndex === "escrowRef" ? (
                          <CheckCircle2 size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-subtle bg-surface-raised">
                      <div>
                        <p className="text-[10px] text-foreground-muted uppercase">Paymob Order ID</p>
                        <p className="text-xs font-mono text-foreground-tertiary mt-0.5">{createResult.paymobOrderId}</p>
                      </div>
                      <button
                        onClick={() => handleCopy(createResult.paymobOrderId, "paymobId")}
                        className="p-1.5 rounded-lg hover:bg-accent-base/10 text-foreground-muted hover:text-accent-base transition-colors"
                        title="Copy Paymob ID"
                      >
                        {copiedIndex === "paymobId" ? (
                          <CheckCircle2 size={12} className="text-emerald-400" />
                        ) : (
                          <Copy size={12} />
                        )}
                      </button>
                    </div>
                  </div>
                  <a
                    href={createResult.paymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full mt-2 px-5 py-2.5 rounded-lg bg-accent-base/10 border border-accent-base/20 text-accent-base text-sm font-medium hover:bg-accent-base/20 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Proceed to Payment
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              )}
            </motion.div>
          )}

          {/* Release Escrow */}
          {status.funded && !status.released && (
            <motion.div
              variants={fadeInUp}
              className="rounded-xl border border-subtle bg-surface-raised p-5"
            >
              <div className="flex items-center gap-2 mb-4">
                <Unlock size={14} className="text-foreground-muted" />
                <h2 className="text-xs font-semibold text-foreground-muted uppercase tracking-wider">
                  Release Escrow
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[10px] text-foreground-muted uppercase tracking-wider mb-1.5 block">
                    Release Type
                  </label>
                  <select
                    value={releaseType}
                    onChange={(e) => setReleaseType(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground focus:outline-none focus:border-accent-base/50"
                  >
                    <option value="DUE_DATE" className="bg-[var(--bg-surface)]">Due Date</option>
                    <option value="EARLY_PAYMENT" className="bg-[var(--bg-surface)]">Early Payment</option>
                    <option value="MANUAL" className="bg-[var(--bg-surface)]">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-foreground-muted uppercase tracking-wider mb-1.5 block">
                    Co-Approver User ID
                  </label>
                  <input
                    type="text"
                    placeholder="Enter co-approver user ID..."
                    value={coApproverId}
                    onChange={(e) => setCoApproverId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-surface-raised border border-subtle text-sm text-foreground placeholder:text-foreground-muted focus:outline-none focus:border-accent-base/50"
                  />
                  <p className="text-[10px] text-foreground-muted mt-1">
                    Dual-approval required. Enter the ID of the second admin who must approve this release.
                  </p>
                </div>

                <button
                  onClick={handleReleaseEscrow}
                  disabled={releasing || !coApproverId.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-colors disabled:opacity-50"
                >
                  {releasing ? <Loader2 size={14} className="animate-spin" /> : <Unlock size={14} />}
                  {releasing ? "Releasing..." : "Release Escrow"}
                </button>

                {releaseError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle size={14} />
                    {releaseError}
                  </div>
                )}

                {releaseResult && (
                  <div
                    className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                      releaseResult.released
                        ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-400"
                        : "border-amber-500/20 bg-amber-500/5 text-amber-400"
                    }`}
                  >
                    {releaseResult.released ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                    {releaseResult.message}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Fully Released */}
          {status.funded && status.released && (
            <motion.div
              variants={fadeInUp}
              className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-5"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-emerald-400">Escrow Released</p>
                  <p className="text-xs text-emerald-400/70 mt-0.5">
                    This escrow has been fully released. No further actions are available.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !status && !statusError && (
        <motion.div
          variants={fadeInUp}
          className="rounded-xl border border-subtle bg-surface-raised p-12 text-center"
        >
          <ShieldCheck size={32} className="text-foreground-muted mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground-tertiary">Enter an Invoice ID to begin</p>
          <p className="text-xs text-foreground-muted mt-1">
            Look up escrow status, create deposits, or release funds.
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
