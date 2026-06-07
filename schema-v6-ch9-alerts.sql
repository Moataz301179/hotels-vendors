-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 9: ALERTS & MONITORING
-- Real-time alerts for all parties
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

CREATE TABLE IF NOT EXISTS public.alerts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type              TEXT NOT NULL CHECK (alert_type IN (
                                'compliance_failure', 'fraud_suspected',
                                'risk_score_change', 'document_expiring',
                                'kyc_review_due', 'invoice_overdue',
                                'bid_expiring', 'funder_api_down',
                                'large_transaction', 'velocity_spike',
                                'dispute_opened', 'procurement_stuck',
                                'subscription_expiring', 'system'
                            )),
    severity                alert_severity NOT NULL DEFAULT 'medium',
    status                  alert_status NOT NULL DEFAULT 'open',
    entity_type             TEXT,
    entity_id               UUID,
    corporate_account_id    UUID REFERENCES corporate_accounts(id),
    property_id             UUID REFERENCES properties(id),
    invoice_id              UUID REFERENCES invoices(id),
    order_id                UUID REFERENCES orders(id),
    title                   TEXT NOT NULL,
    description             TEXT NOT NULL,
    details                 JSONB DEFAULT '{}'::jsonb,
    assigned_to             UUID REFERENCES public.users(id),
    resolved_by             UUID REFERENCES public.users(id),
    resolution_notes        TEXT,
    resolved_at             TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_type ON alerts(alert_type);
CREATE INDEX idx_alerts_entity ON alerts(entity_type, entity_id);
CREATE INDEX idx_alerts_corporate ON alerts(corporate_account_id);
CREATE INDEX idx_alerts_created ON alerts(created_at);

ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY alerts_access ON alerts
    FOR ALL TO authenticated
    USING (
        corporate_account_id IN (
            SELECT corporate_account_id FROM public.users WHERE id = auth.uid()
        )
        OR property_id IN (
            SELECT property_id FROM public.users WHERE id = auth.uid()
        )
        OR entity_id IN (
            SELECT supplier_id FROM public.users WHERE id = auth.uid()
        )
        OR assigned_to = auth.uid()
        OR auth.jwt() ->> 'role' IN ('admin', 'compliance')
    );

COMMIT;
