-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 5: COMPLIANCE VERIFICATION LOG
-- Every compliance check we perform is recorded. Regulatory evidence trail.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

CREATE TABLE IF NOT EXISTS public.compliance_checks (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    check_type              TEXT NOT NULL CHECK (check_type IN (
                                'eta_uuid_verification', 'delivery_signoff',
                                'duplicate_invoice', 'supplier_verification',
                                'credit_limit_check', 'sanctions_screening',
                                'pep_screening', 'fraud_velocity',
                                'amount_threshold', 'document_expiry',
                                'tax_id_validation', 'commercial_register_validation'
                            )),
    entity_type             TEXT,
    entity_id               UUID,
    invoice_id              UUID REFERENCES invoices(id),
    result                  compliance_check_result NOT NULL,
    details                 JSONB DEFAULT '{}'::jsonb,
    checked_by              UUID REFERENCES public.users(id),
    checked_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_by             UUID REFERENCES public.users(id),
    resolved_at             TIMESTAMPTZ,
    resolution_notes        TEXT,
    created_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_compliance_checks_invoice ON compliance_checks(invoice_id);
CREATE INDEX idx_compliance_checks_entity ON compliance_checks(entity_type, entity_id);
CREATE INDEX idx_compliance_checks_result ON compliance_checks(result);
CREATE INDEX idx_compliance_checks_type ON compliance_checks(check_type);
CREATE INDEX idx_compliance_checks_date ON compliance_checks(checked_at);

ALTER TABLE compliance_checks ENABLE ROW LEVEL SECURITY;
CREATE POLICY compliance_checks_access ON compliance_checks
    FOR ALL TO authenticated
    USING (
        checked_by = auth.uid()
        OR auth.jwt() ->> 'role' IN ('admin', 'compliance')
        OR invoice_id IN (
            SELECT id FROM invoices WHERE hotel_id IN (
                SELECT id FROM hotels WHERE owner_id = auth.uid()
            )
        )
    );

COMMIT;
