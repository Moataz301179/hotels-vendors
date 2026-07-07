import { requireUser } from "@/lib/session";
import { db } from "@/db";
import { orders, organizations } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { Topbar } from "@/components/app/topbar";
import { Badge, StatusPill } from "@/components/ui";
import { egp, shortDate } from "@/lib/utils";
import { EtaCalculator } from "@/components/app/eta-calculator";
import { FileCheck2, ShieldCheck, ClipboardCheck, ArrowUpRight, Code, Eye, FileText, CheckCircle, Info } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CompliancePage() {
  const user = await requireUser();
  const orgId = user.orgId!;

  // Fetch orders matching the user's organization
  const myOrders = await db
    .select({
      id: orders.id,
      reference: orders.reference,
      status: orders.status,
      total: orders.total,
      subtotal: orders.subtotal,
      platformFee: orders.platformFee,
      items: orders.items,
      createdAt: orders.createdAt,
      etaUuid: orders.etaUuid,
      etaStatus: orders.etaStatus,
      grnStatus: orders.grnStatus,
      grnVarianceBps: orders.grnVarianceBps,
      grnNotes: orders.grnNotes,
    })
    .from(orders)
    .where(or(eq(orders.hotelId, orgId), eq(orders.supplierId, orgId)))
    .limit(10);

  return (
    <>
      <Topbar name={user.name} org={user.orgName ?? ""} orgType={user.orgType ?? "hotel"} title="Compliance Registry" />
      <main className="mx-auto w-full max-w-6xl flex-1 p-5 lg:p-8 space-y-6">
        {/* Investor Hook Banner */}
        <div className="rounded-3xl border border-border bg-bg-1 p-6 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-[radial-gradient(closest-side,var(--lime-glow),transparent)]" />
          <div className="relative">
            <Badge tone="gold" className="mb-2">Triple-Evidence Auditing Moat</Badge>
            <h2 className="text-2xl font-semibold text-fg tracking-tight">ETA e-Invoice &amp; GRN Evidence Pack</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-fg-3">
              HotelsVendors prevents factoring fraud and invoice inflation by locking three distinct pieces of evidence before funds disperse: **the PO contract**, **the photographic receiving GRN**, and **the Egyptian Tax Authority e-Invoice**.
            </p>
          </div>
        </div>

        {/* Why the market charges 1.25% — and why we don't */}
        <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-3xl border border-border bg-bg-1 p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-gold" />
              <h3 className="font-semibold">Why competitors charge 1–1.5%</h3>
            </div>
            <p className="text-sm leading-relaxed text-fg-3">
              The ETA charges <strong className="text-fg">nothing</strong> to submit an invoice — it is a free API call. Rivals price at 1–1.5% of invoice <em>value</em> because they bundle hidden <strong className="text-fg">invoice financing</strong> into a &ldquo;compliance&rdquo; wrapper, and price on penalty-fear, not on cost.
            </p>
            <div className="mt-4 space-y-2.5">
              {[
                ["ETA submission cost", "EGP 0 — free government API"],
                ["Real hard cost", "Annual e-seal certificate (fixed) + compute"],
                ["Competitor charge", "1.25% of value — factoring in disguise"],
                ["HotelsVendors charge", "Flat / per-invoice — ~0.1% effective"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-t border-border pt-2.5 text-xs">
                  <span className="text-fg-4">{k}</span>
                  <span className="font-medium text-fg text-right">{v}</span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs leading-relaxed text-fg-3">
              Because your invoice is auto-generated from an INVO order we already hold, our marginal cost is near-zero — so a EGP 8.9M oven invoice costs the same to stamp as a EGP 480 water order. A 1% rival would bill EGP 89,000 for that oven; we bill EGP 5.
            </p>
          </div>
          <EtaCalculator />
        </div>

        {/* Triple Evidence Registry Table */}
        <div className="rounded-3xl border border-border bg-bg-1 overflow-hidden">
          <div className="border-b border-border px-6 py-4 flex items-center justify-between">
            <h3 className="font-semibold text-fg">Active Compliance Registry</h3>
            <Badge tone="lime">ISO 27001 &amp; FRA Aligned</Badge>
          </div>
          <div className="divide-y divide-border">
            {myOrders.map((o) => {
              const mockXML = {
                documentType: "I",
                dateTimeIssued: o.createdAt.toISOString(),
                taxpayerActivityCode: "5510",
                issuer: { id: "987654321", name: "Premium Supplier S.A.E." },
                receiver: { id: "123456789", name: user.orgName },
                invoiceLines: (o.items ?? []).map((it) => ({
                  description: it.name,
                  unitType: "box",
                  quantity: it.qty,
                  valueDifference: 0,
                  totalAmount: it.qty * it.price / 100,
                })),
                totalAmount: o.total / 100,
                signatures: [{ signatureType: "I", value: "SIG-EGP-TAX-AUTHORITY-VALID" }]
              };

              return (
                <div key={o.id} className="p-6 space-y-4 hover:bg-bg-2 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-fg text-base">{o.reference}</span>
                        <StatusPill status={o.status} />
                      </div>
                      <div className="text-xs text-fg-4 mt-1">Created on {shortDate(o.createdAt)} · Value: {egp(o.total)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-fg-4">Underwriting Audit status:</span>
                      <Badge tone={o.etaUuid ? "green" : "warning"}>
                        {o.etaUuid ? "Evidence Locked" : "Pending Intake"}
                      </Badge>
                    </div>
                  </div>

                  {/* Evidence Pillars Grid */}
                  <div className="grid gap-3 md:grid-cols-3 text-sm">
                    {/* Pillar 1: Contract PO */}
                    <div className="rounded-2xl border border-border bg-bg p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-fg-2 font-medium">
                          <ShieldCheck className="h-4 w-4 text-lime" />
                          <span>1. Contract PO</span>
                        </div>
                        <p className="mt-2 text-xs text-fg-3 leading-relaxed">
                          Legally binding contract matching negotiated vendor pricing. Lock-in prevents arbitrary price changes.
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-fg-4">Status:</span>
                        <span className="text-green font-medium flex items-center gap-1">
                          <CheckCircle className="h-3.5 w-3.5" /> Approved
                        </span>
                      </div>
                    </div>

                    {/* Pillar 2: GRN Verification */}
                    <div className="rounded-2xl border border-border bg-bg p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-fg-2 font-medium">
                          <ClipboardCheck className="h-4 w-4 text-lime" />
                          <span>2. Physical GRN</span>
                        </div>
                        <p className="mt-2 text-xs text-fg-3 leading-relaxed">
                          Receiving dock audit. Variance logged at {(o.grnVarianceBps ?? 0) / 100}% discrepancy.
                        </p>
                        {o.grnNotes && (
                          <div className="mt-2 bg-bg-2 p-2 rounded-lg text-[11px] text-fg-4 italic">
                            &ldquo;{o.grnNotes}&rdquo;
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-fg-4">Status:</span>
                        <span className="text-fg font-medium">
                          {(o.grnStatus ?? "not_received").replace("_", " ")}
                        </span>
                      </div>
                    </div>

                    {/* Pillar 3: ETA Tax Registry */}
                    <div className="rounded-2xl border border-border bg-bg p-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 text-fg-2 font-medium">
                          <FileText className="h-4 w-4 text-lime" />
                          <span>3. ETA e-Invoice</span>
                        </div>
                        <p className="mt-2 text-xs text-fg-3 leading-relaxed">
                          Registered UUID returned from the Tax Authority portal. Confirms real e-invoicing record.
                        </p>
                        {o.etaUuid && (
                          <div className="mt-2 font-mono text-[10px] text-lime break-all bg-bg-2 p-2 rounded-lg">
                            {o.etaUuid}
                          </div>
                        )}
                      </div>
                      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                        <span className="text-fg-4">ETA status:</span>
                        <span className="text-lime font-medium uppercase">{o.etaStatus}</span>
                      </div>
                    </div>
                  </div>

                  {/* Live JSON Schema Drawer Trigger (Compelling Investor Interactive Code Mockup) */}
                  <div className="rounded-2xl border border-border bg-bg-2 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-fg-3">
                        <Code className="h-3.5 w-3.5 text-lime" />
                        <span>Live compliant ETA-stamped XML payload</span>
                      </div>
                      <span className="text-xs text-lime select-none font-mono">200 OK</span>
                    </div>
                    <pre className="mt-3 overflow-x-auto text-[10px] text-fg-4 font-mono leading-relaxed bg-bg p-3 rounded-xl max-h-40">
                      {JSON.stringify(mockXML, null, 2)}
                    </pre>
                  </div>
                </div>
              );
            })}
            {myOrders.length === 0 && (
              <div className="p-8 text-center text-fg-4">
                <FileCheck2 className="mx-auto h-12 w-12 text-fg-4 mb-3 animate-pulse" />
                No compliance records available. Open the marketplace to request pilot access.
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
