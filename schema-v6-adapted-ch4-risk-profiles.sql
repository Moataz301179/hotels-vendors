-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 4 (ADAPTED): ENTITY RISK PROFILES
-- Adapted for actual schema: hotels (not properties), no corporate_accounts
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

CREATE TABLE IF NOT EXISTS public.entity_risk_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type             TEXT NOT NULL CHECK (entity_type IN (
                                'hotel', 'supplier', 'funder'
                            )),
    entity_id               UUID NOT NULL,
    status                  entity_status NOT NULL DEFAULT 'pending_verification',
    overall_risk_score      NUMERIC(5, 2) NOT NULL DEFAULT 50.00
                            CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
    risk_band               risk_band NOT NULL DEFAULT 'medium',
    financial_score         NUMERIC(5, 2) DEFAULT 50.00
                            CHECK (financial_score >= 0 AND financial_score <= 100),
    compliance_score        NUMERIC(5, 2) DEFAULT 50.00
                            CHECK (compliance_score >= 0 AND compliance_score <= 100),
    operational_score       NUMERIC(5, 2) DEFAULT 50.00
                            CHECK (operational_score >= 0 AND operational_score <= 100),
    reputation_score        NUMERIC(5, 2) DEFAULT 50.00
                            CHECK (reputation_score >= 0 AND reputation_score <= 100),
    commercial_register_verified    BOOLEAN DEFAULT false,
    commercial_register_verified_at TIMESTAMPTZ,
    tax_id_verified                 BOOLEAN DEFAULT false,
    tax_id_verified_at              TIMESTAMPTZ,
    pep_screened            BOOLEAN DEFAULT false,
    pep_screened_at         TIMESTAMPTZ,
    pep_status              TEXT DEFAULT 'not_screened' CHECK (pep_status IN (
                                'not_screened', 'clear', 'confirmed_pep', 'false_positive'
                            )),
    sanctions_screened      BOOLEAN DEFAULT false,
    sanctions_screened_at   TIMESTAMPTZ,
    sanctions_status        TEXT DEFAULT 'not_screened' CHECK (sanctions_status IN (
                                'not_screened', 'clear', 'potential_match', 'confirmed_match'
                            )),
    last_review_date        DATE,
    next_review_date        DATE,
    review_frequency_months INTEGER DEFAULT 12,
    risk_factors            JSONB DEFAULT '[]'::jsonb,
    notes                   TEXT,
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now(),
    UNIQUE(entity_type, entity_id)
);

CREATE INDEX idx_risk_profiles_entity ON entity_risk_profiles(entity_type, entity_id);
CREATE INDEX idx_risk_profiles_band ON entity_risk_profiles(risk_band);
CREATE INDEX idx_risk_profiles_score ON entity_risk_profiles(overall_risk_score);
CREATE INDEX idx_risk_profiles_status ON entity_risk_profiles(status);
CREATE INDEX idx_risk_profiles_review ON entity_risk_profiles(next_review_date);

ALTER TABLE entity_risk_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY risk_profile_access ON entity_risk_profiles
    FOR ALL TO authenticated
    USING (
        entity_id IN (SELECT hotel_id FROM public.users WHERE id = auth.uid())
        OR entity_id IN (SELECT supplier_id FROM public.users WHERE id = auth.uid())
        OR entity_id IN (SELECT funder_id FROM public.users WHERE id = auth.uid())
        OR auth.jwt() ->> 'role' IN ('admin', 'compliance')
    );

COMMIT;
