-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 10: REVENUE TRACKING (Orchestrator Model)
-- We earn from: SaaS subscriptions + success fees + listing fees
-- We NEVER hold or disburse funds.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- 10a. Corporate subscriptions (SaaS revenue)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corporate_account_id    UUID NOT NULL REFERENCES corporate_accounts(id),
    tier                    subscription_tier NOT NULL DEFAULT 'starter',
    status                  subscription_status NOT NULL DEFAULT 'trial',
    price_per_property_egp  NUMERIC(10, 2) NOT NULL,
    property_count          INTEGER NOT NULL DEFAULT 1,
    monthly_total_egp       NUMERIC(12, 2) GENERATED ALWAYS AS (
                                price_per_property_egp * property_count
                            ) STORED,
    trial_started_at        TIMESTAMPTZ DEFAULT now(),
    trial_ends_at           TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
    current_period_start    TIMESTAMPTZ DEFAULT now(),
    current_period_end      TIMESTAMPTZ DEFAULT (now() + INTERVAL '1 month'),
    cancelled_at            TIMESTAMPTZ,
    cancellation_reason     TEXT,
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_subscriptions_corporate ON subscriptions(corporate_account_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_period ON subscriptions(current_period_end);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY subscriptions_access ON subscriptions
    FOR ALL TO authenticated
    USING (corporate_account_id IN (
        SELECT corporate_account_id FROM public.users WHERE id = auth.uid()
    ) OR auth.jwt() ->> 'role' = 'admin');

-- 10b. Success fees (take rate on funded invoices)
CREATE TABLE IF NOT EXISTS public.success_fees (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id              UUID NOT NULL REFERENCES invoices(id),
    factoring_request_id    UUID REFERENCES factoring_requests(id),
    funder_id               UUID REFERENCES funder_configs(id),
    corporate_account_id    UUID REFERENCES corporate_accounts(id),
    invoice_face_value      NUMERIC(15, 2) NOT NULL,
    take_rate               NUMERIC(5, 4) NOT NULL,
    fee_amount_egp          NUMERIC(15, 2) NOT NULL,
    status                  TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                                'pending', 'invoice_issued', 'paid', 'waived', 'refunded'
                            )),
    invoiced_to             TEXT CHECK (invoiced_to IN ('funder', 'hotel')),
    invoiced_at             TIMESTAMPTZ,
    paid_at                 TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_success_fees_invoice ON success_fees(invoice_id);
CREATE INDEX idx_success_fees_corporate ON success_fees(corporate_account_id);
CREATE INDEX idx_success_fees_status ON success_fees(status);
CREATE INDEX idx_success_fees_funder ON success_fees(funder_id);

ALTER TABLE success_fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY success_fees_access ON success_fees
    FOR ALL TO authenticated
    USING (corporate_account_id IN (
        SELECT corporate_account_id FROM public.users WHERE id = auth.uid()
    ) OR auth.jwt() ->> 'role' IN ('admin', 'finance'));

-- 10c. Supplier listing fees
CREATE TABLE IF NOT EXISTS public.supplier_listing_fees (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id             UUID NOT NULL REFERENCES suppliers(id),
    fee_type                TEXT NOT NULL CHECK (fee_type IN (
                                'listing', 'verification', 'premium_placement', 'annual_renewal'
                            )),
    amount_egp              NUMERIC(10, 2) NOT NULL,
    status                  TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                                'pending', 'invoice_issued', 'paid', 'waived'
                            )),
    invoiced_at             TIMESTAMPTZ,
    paid_at                 TIMESTAMPTZ,
    valid_until             DATE,
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_listing_fees_supplier ON supplier_listing_fees(supplier_id);
CREATE INDEX idx_listing_fees_status ON supplier_listing_fees(status);

ALTER TABLE supplier_listing_fees ENABLE ROW LEVEL SECURITY;
CREATE POLICY listing_fees_access ON supplier_listing_fees
    FOR ALL TO authenticated
    USING (supplier_id IN (
        SELECT supplier_id FROM public.users WHERE id = auth.uid()
    ) OR auth.jwt() ->> 'role' IN ('admin', 'finance'));

COMMIT;
