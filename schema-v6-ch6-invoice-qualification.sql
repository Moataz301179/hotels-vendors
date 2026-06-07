-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 6: INVOICE QUALIFICATION ENGINE
-- Verify and score every invoice to determine factoring eligibility.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- Extend invoices with qualification tracking
ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS qualification_status invoice_qualification DEFAULT 'pending_documents',
    ADD COLUMN IF NOT EXISTS qualification_score NUMERIC(5, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS qualification_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS qualified_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS qualification_notes TEXT,
    ADD COLUMN IF NOT EXISTS eta_qr_code TEXT,
    ADD COLUMN IF NOT EXISTS eta_submission_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS eta_acknowledgment_id TEXT;

-- Invoice qualification details
CREATE TABLE IF NOT EXISTS public.invoice_qualification (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id              UUID NOT NULL UNIQUE REFERENCES invoices(id) ON DELETE CASCADE,
    eta_uuid_present        compliance_check_result DEFAULT 'not_applicable',
    eta_uuid_verified       BOOLEAN DEFAULT false,
    eta_verified_at         TIMESTAMPTZ,
    delivery_signed_off     compliance_check_result DEFAULT 'not_applicable',
    delivery_verified_at    TIMESTAMPTZ,
    invoice_risk_score      NUMERIC(5, 2) DEFAULT 0.00
                            CHECK (invoice_risk_score >= 0 AND invoice_risk_score <= 100),
    risk_factors            JSONB DEFAULT '[]'::jsonb,
    status                  invoice_qualification NOT NULL DEFAULT 'pending_documents',
    qualified_at            TIMESTAMPTZ,
    rejected_reason         TEXT,
    compliance_score        NUMERIC(5, 2) DEFAULT 0.00,
    supplier_trust_score    NUMERIC(5, 2) DEFAULT 0.00,
    hotel_credit_score      NUMERIC(5, 2) DEFAULT 0.00,
    invoice_integrity_score NUMERIC(5, 2) DEFAULT 0.00,
    factoring_eligible      BOOLEAN DEFAULT false,
    max_factoring_amount    NUMERIC(15, 2),
    recommended_take_rate   NUMERIC(5, 4),
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_inv_qual_invoice ON invoice_qualification(invoice_id);
CREATE INDEX idx_inv_qual_status ON invoice_qualification(status);
CREATE INDEX idx_inv_qual_eligible ON invoice_qualification(factoring_eligible);
CREATE INDEX idx_inv_qual_score ON invoice_qualification(invoice_risk_score);

ALTER TABLE invoice_qualification ENABLE ROW LEVEL SECURITY;
CREATE POLICY inv_qual_access ON invoice_qualification
    FOR ALL TO authenticated
    USING (invoice_id IN (
        SELECT id FROM invoices WHERE hotel_id IN (
            SELECT id FROM hotels WHERE owner_id = auth.uid()
        )
    ) OR auth.jwt() ->> 'role' IN ('admin', 'compliance'));

COMMIT;
