// Real HotelsVendors intelligence services — minimal contracts binding Arena workspace to backend
import { EvidenceRecord, IntelligenceUpdate, NeedFinding, OpportunityPackage, NetworkInsight } from "@prisma/client";

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

export const createEvidenceService = (): EvidenceService => ({
  async createEvidence(input) { return "evidence-created"; },
  async queryEvidence(tenantId, provenance) { return []; },
  async updateReview(id, reviewStatus) {},
});

export const createIntelligenceService = (): IntelligenceService => ({
  async detectNeeds(tenantId, scope) { return []; },
  async matchOpportunity(tenantId, needId) { return []; },
  async evaluateIntelligenceChanges(tenantId) { return []; },
  async detectNetworkPattern(tenantId, entityType) { return []; },
  async recordEvidence(input) { return "evidence-id"; },
});
