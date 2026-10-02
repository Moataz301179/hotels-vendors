import { prisma } from "@/lib/prisma";
import type { EvidenceRecord, IntelligenceUpdate, NeedFinding, OpportunityPackage, NetworkInsight } from "@prisma/client";
import { createHash } from "crypto";

export interface EvidenceService {
  createEvidence(input: Partial<EvidenceRecord>): Promise<string>;
  queryEvidence(tenantId: string, provenance?: string): Promise<EvidenceRecord[]>;
  updateReview(id: string, reviewStatus: string): Promise<void>;
}
export interface IntelligenceService {
  detectNeeds(tenantId: string, scope?: string): Promise<NeedFinding[]>;
  matchOpportunity(tenantId: string, needId?: string): Promise<OpportunityPackage[]>;
  evaluateIntelligenceChanges(tenantId: string): Promise<IntelligenceUpdate[]>;
  detectNetworkPattern(tenantId: string, entityType?: string): Promise<NetworkInsight[]>;
  recordEvidence(input: Partial<EvidenceRecord>): Promise<string>;
}

const hash = (v: unknown) => createHash("sha256").update(JSON.stringify(v)).digest("hex");
const evidenceService = (): EvidenceService => ({
  async createEvidence(input) {
    if (!input.tenantId) throw new Error("Evidence tenantId is required");
    const r = await prisma.evidenceRecord.create({ data: {
      tenantId: input.tenantId, sourceId: input.sourceId ?? null, sourceType: input.sourceType ?? "SYSTEM_INFERENCE",
      provenance: input.provenance ?? "OBSERVED", contentType: input.contentType ?? null,
      contentHash: input.contentHash ?? hash(input.afterState ?? input.beforeState ?? input.sourceId),
      beforeState: input.beforeState as never, afterState: input.afterState as never,
      actorId: input.actorId ?? null, reviewStatus: input.reviewStatus ?? "review-required",
    }});
    return r.id;
  },
  async queryEvidence(tenantId, provenance) { return prisma.evidenceRecord.findMany({ where: { tenantId, ...(provenance ? { provenance } : {}) }, orderBy: { createdAt: "desc" }, take: 100 }); },
  async updateReview(id, reviewStatus) { await prisma.evidenceRecord.update({ where: { id }, data: { reviewStatus } }); },
});

async function update(tenantId: string, kind: string, entityId: string | null, entityType: string | null, afterValue: unknown, engine: string) {
  await prisma.intelligenceUpdate.create({ data: { tenantId, kind, entityId, entityType, afterValue: afterValue as never, detectionEngine: engine, confidenceScore: 0.8, provenance: "OBSERVED", reviewStatus: "review-required" } });
}

export const createEvidenceService = evidenceService;
export const createIntelligenceService = (): IntelligenceService => ({
  async recordEvidence(input) { return evidenceService().createEvidence(input); },

  async detectNeeds(tenantId, scope) {
    const [overdue, lowStock, orders] = await Promise.all([
      prisma.invoice.findMany({ where: { tenantId, paymentStatus: "UNPAID", dueDate: { lt: new Date() }, ...(scope ? { supplier: { name: { contains: scope, mode: "insensitive" } } } : {}) }, select: { id: true, invoiceNumber: true, total: true, dueDate: true }, orderBy: { dueDate: "asc" }, take: 25 }),
      prisma.product.findMany({ where: { tenantId, deletedAt: null, status: "ACTIVE", stockQuantity: { lte: 10 } }, select: { id: true, name: true, stockQuantity: true, reorderPoint: true, unitPrice: true }, orderBy: { stockQuantity: "asc" }, take: 50 }),
      prisma.order.findMany({ where: { tenantId, createdAt: { gte: new Date(Date.now() - 30 * 86400000) } }, select: { supplierId: true }, take: 200 }),
    ]);
    const out: NeedFinding[] = [];
    for (const i of overdue) {
      const existing = await prisma.needFinding.findFirst({ where: { tenantId, category: "CASHFLOW_RISK", description: { contains: i.invoiceNumber }, status: { in: ["DETECTED", "REVIEWED", "CONFIRMED"] } } });
      if (existing) { out.push(existing); continue; }
      const e = await evidenceService().createEvidence({ tenantId, sourceId: i.id, sourceType: "PROCUREMENT_EVENT", provenance: "OBSERVED", contentType: "INVOICE", afterState: { invoiceNumber: i.invoiceNumber, total: Number(i.total ?? 0), dueDate: i.dueDate?.toISOString() ?? null } });
      const n = await prisma.needFinding.create({ data: { tenantId, category: "CASHFLOW_RISK", description: `Invoice ${i.invoiceNumber} is overdue and requires cashflow review.`, urgency: "high", sourceEvidenceId: e, impactEstimate: { amountEgp: Number(i.total ?? 0) }, status: "DETECTED", reviewStatus: "review-required" } });
      out.push(n); await update(tenantId, "NEED_DETECTION", n.id, "INVOICE", { category: n.category, amountEgp: Number(i.total ?? 0) }, "detectNeeds");
    }
    for (const p of lowStock) {
      const existing = await prisma.needFinding.findFirst({ where: { tenantId, category: "INVENTORY_RISK", description: { contains: p.id }, status: { in: ["DETECTED", "REVIEWED", "CONFIRMED"] } } });
      if (existing) { out.push(existing); continue; }
      const e = await evidenceService().createEvidence({ tenantId, sourceId: p.id, sourceType: "PROCUREMENT_EVENT", provenance: "OBSERVED", contentType: "INVENTORY_RISK", afterState: { productId: p.id, productName: p.name, stockQuantity: p.stockQuantity, reorderPoint: p.reorderPoint } });
      const n = await prisma.needFinding.create({ data: { tenantId, category: "INVENTORY_RISK", description: `Product ${p.id} (${p.name}) is at or below its reorder threshold.`, urgency: p.stockQuantity <= 2 ? "critical" : "medium", sourceEvidenceId: e, impactEstimate: { stockQuantity: p.stockQuantity, reorderPoint: p.reorderPoint, unitPriceEgp: Number(p.unitPrice ?? 0) }, status: "DETECTED", reviewStatus: "review-required" } });
      out.push(n); await update(tenantId, "NEED_DETECTION", n.id, "PRODUCT", { productId: p.id, category: n.category }, "detectNeeds");
    }
    const counts = new Map<string, number>(); for (const o of orders) counts.set(o.supplierId, (counts.get(o.supplierId) ?? 0) + 1);
    const concentration = [...counts.entries()].sort((a,b) => b[1]-a[1])[0];
    if (concentration && concentration[1] >= 5) {
      const existing = await prisma.needFinding.findFirst({ where: { tenantId, category: "COST_ANOMALY", description: { contains: concentration[0] }, status: { in: ["DETECTED", "REVIEWED", "CONFIRMED"] } } });
      if (!existing) {
        const e = await evidenceService().createEvidence({ tenantId, sourceType: "PROCUREMENT_EVENT", provenance: "INFERRED", contentType: "PROCUREMENT_EVENT", afterState: { supplierId: concentration[0], orderCount30d: concentration[1] } });
        const n = await prisma.needFinding.create({ data: { tenantId, category: "COST_ANOMALY", description: `Purchasing is concentrated with supplier ${concentration[0]} (${concentration[1]} orders in 30 days); review alternatives.`, urgency: "medium", sourceEvidenceId: e, impactEstimate: { orderCount30d: concentration[1] }, status: "DETECTED", reviewStatus: "review-required" } });
        out.push(n); await update(tenantId, "NEED_DETECTION", n.id, "SUPPLIER", { supplierId: concentration[0], orderCount30d: concentration[1] }, "detectNeeds");
      }
    }
    return out;
  },

  async matchOpportunity(tenantId, needId) {
    const needs = await prisma.needFinding.findMany({ where: { tenantId, status: { in: ["DETECTED", "REVIEWED", "CONFIRMED"] }, ...(needId ? { id: needId } : {}) }, orderBy: { createdAt: "desc" }, take: 50 });
    const out: OpportunityPackage[] = [];
    for (const n of needs) {
      const existing = await prisma.opportunityPackage.findFirst({ where: { tenantId, title: { contains: n.id }, status: { not: "REJECTED" } } });
      if (existing) { out.push(existing); continue; }
      const recommendation = n.category === "CASHFLOW_RISK" ? "Review eligible external funding/factoring options with approved partners; HotelsVendors does not provide financing." : n.category === "INVENTORY_RISK" ? "Review catalog availability and replenish before stock reaches zero." : "Compare supplier pricing, concentration and delivery performance before the next purchase cycle.";
      const amount = typeof n.impactEstimate === "object" && n.impactEstimate && "amountEgp" in n.impactEstimate ? Number((n.impactEstimate as { amountEgp?: number }).amountEgp ?? 0) : null;
      const o = await prisma.opportunityPackage.create({ data: { tenantId, title: `Virtual Shadow opportunity · ${n.id}`, category: n.category === "CASHFLOW_RISK" ? "FACTORING_LIQUIDITY" : n.category === "INVENTORY_RISK" ? "PROCUREMENT_OPTIMIZATION" : "SUPPLIER_EXCLUSIVITY", evidenceIds: n.sourceEvidenceId ? [n.sourceEvidenceId] : [], recommendation, expectedValue: amount, riskLevel: n.urgency === "critical" ? "high" : "medium", status: "PROPOSED", provenance: "INFERRED", reviewStatus: "review-required" } });
      out.push(o); await update(tenantId, "OPPORTUNITY_MATCH", o.id, "CONTRACT", { needId: n.id, category: o.category, expectedValue: amount }, "matchOpportunity");
    }
    return out;
  },

  async evaluateIntelligenceChanges(tenantId) { return prisma.intelligenceUpdate.findMany({ where: { tenantId }, orderBy: { createdAt: "desc" }, take: 100 }); },

  async detectNetworkPattern(tenantId, entityType) {
    const grouped = await prisma.order.groupBy({ by: ["supplierId"], where: { tenantId, createdAt: { gte: new Date(Date.now() - 90 * 86400000) } }, _count: { supplierId: true }, orderBy: { _count: { supplierId: "desc" } }, take: 20 });
    const out: NetworkInsight[] = [];
    for (const s of grouped) {
      if (entityType && entityType !== "SUPPLIER") continue;
      const existing = await prisma.networkInsight.findFirst({ where: { tenantId, sourceEntityType: "HOTEL", sourceEntityId: tenantId, targetEntityType: "SUPPLIER", targetEntityId: s.supplierId, relationshipType: "COLLABORATION" } });
      if (existing) { out.push(existing); continue; }
      out.push(await prisma.networkInsight.create({ data: { tenantId, sourceEntityType: "HOTEL", sourceEntityId: tenantId, relationshipType: "COLLABORATION", targetEntityType: "SUPPLIER", targetEntityId: s.supplierId, strengthScore: Math.min(1, s._count.supplierId / 20), provenance: "OBSERVED", reviewStatus: "review-required" } }));
    }
    return out;
  },
});
