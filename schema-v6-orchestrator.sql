-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — FINTECH ORCHESTRATOR ARCHITECTURE
-- ═══════════════════════════════════════════════════════════════════════════
--
-- CORE IDENTITY: HotelsVendors is a B2B PROCUREMENT ORCHESTRATOR.
-- We do NOT hold money. We do NOT manage escrow. We do NOT disburse funds.
--
-- WHAT WE DO:
-- 1. COMPLIANCE GATE — Verify, score, and qualify invoices for factoring
-- 2. RISK ENGINE — Score every entity (hotel, supplier, funder, invoice)
-- 3. MATCHMAKING — Route qualified invoices to competing funders
-- 4. PROCUREMENT CONTROL — Lock-loop from purchase order to payment verification
-- 5. REPORTING — Regulatory compliance, audit trails, fraud monitoring
-- 6. MONETIZATION — SaaS subscription + success fee on funded invoices
--
-- REVENUE MODEL (3 streams, NO money holding):
--   a) SaaS subscription per property/month (recurring)
--   b) Success fee (take rate) when a funder funds a matched invoice
--   c) Supplier listing/verification fee (one-time or annual)
--
-- This schema REPLACES v5.2. Run on a clean database after v4 base schema.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- ═══════════════════════════════════════════════════════════
-- SECTION 0: CLEAN SLATE — Drop v5 tables that don't fit
-- the orchestrator model (escrow, settlements, fund balances)
-- ═══════════════════════════════════════════════════════════

-- These v5 tables assumed we hold money. We don't.
-- Drop them cleanly if they exist.
DROP TABLE IF EXISTS escrow_transactions CASCADE;
DROP TABLE IF EXISTS escrow_accounts CASCADE;
DROP TABLE IF EXISTS interest_accruals CASCADE;
DROP TABLE IF EXISTS late_payment_penalties CASCADE;
DROP TABLE IF EXISTS financial_settlements CASCADE;
DROP TABLE IF EXISTS bank_accounts CASCADE;
DROP TABLE IF EXISTS reconciliation_items CASCADE;
DROP TABLE IF EXISTS reconciliation_runs CASCADE;
DROP TABLE IF EXISTS large_transaction_reports CASCADE;
DROP TABLE IF EXISTS regulatory_reports CASCADE;
DROP TABLE IF EXISTS platform_regulatory_config CASCADE;
DROP TABLE IF EXISTS provisioning_rules CASCADE;
DROP TABLE IF EXISTS tax_withholding_records CASCADE;
DROP TABLE IF EXISTS aml_screening_log CASCADE;
DROP TABLE IF EXISTS kyc_document_verifications CASCADE;
DROP TABLE IF EXISTS suspicious_transaction_reports CASCADE;
DROP TABLE IF EXISTS compliance_officers CASCADE;
DROP TABLE IF EXISTS fraud_alerts CASCADE;
DROP TABLE IF EXISTS fraud_detection_rules CASCADE;
DROP TABLE IF EXISTS transaction_monitoring_log CASCADE;
DROP TABLE IF EXISTS data_retention_policies CASCADE;
DROP TABLE IF EXISTS incidents CASCADE;
DROP TABLE IF EXISTS exchange_rates CASCADE;
DROP TABLE IF EXISTS platform_revenue_ledger CASCADE;
DROP TABLE IF EXISTS corporate_compliance_profiles CASCADE;
DROP TABLE IF EXISTS system_transaction_logs CASCADE;

-- Drop v5 ENUMs
DROP TYPE IF EXISTS settlement_status CASCADE;
DROP TYPE IF EXISTS billing_type CASCADE;
DROP TYPE IF EXISTS fee_status CASCADE;
DROP TYPE IF EXISTS clearing_channel CASCADE;
DROP TYPE IF EXISTS verification_tier CASCADE;
DROP TYPE IF EXISTS str_status CASCADE;
DROP TYPE IF EXISTS pep_status CASCADE;
DROP TYPE IF EXISTS sanctions_status CASCADE;
DROP TYPE IF EXISTS reconciliation_status CASCADE;
DROP TYPE IF EXISTS incident_severity CASCADE;
DROP TYPE IF EXISTS incident_status CASCADE;
DROP TYPE IF EXISTS fraud_alert_status CASCADE;
DROP TYPE IF EXISTS data_retention_class CASCADE;
DROP TYPE IF EXISTS tax_withholding_type CASCADE;


-- ═══════════════════════════════════════════════════════════
-- SECTION 1: ENUM TYPES — Orchestrator-specific states
-- ═══════════════════════════════════════════════════════════

DO $$
BEGIN
    -- Entity verification status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entity_status') THEN
        CREATE TYPE entity_status AS ENUM (
            'pending_verification', 'documents_submitted', 'under_review',
            'verified_active', 'verified_limited', 'suspended', 'deactivated'
        );
    END IF;

    -- Invoice qualification status (our core compliance gate)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_qualification') THEN
        CREATE TYPE invoice_qualification AS ENUM (
            'pending_documents', 'pending_eta', 'pending_delivery_signoff',
            'compliance_review', 'qualified', 'rejected', 'expired', 'withdrawn'
        );
    END IF;

    -- Factoring match status (our matchmaking engine)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'factoring_match_status') THEN
        CREATE TYPE factoring_match_status AS ENUM (
            'not_submitted', 'submitted_to_funder', 'bidding_open',
            'bids_received', 'bid_accepted', 'funded', 'declined_by_funders',
            'withdrawn', 'expired'
        );
    END IF;

    -- Risk score bands
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_band') THEN
        CREATE TYPE risk_band AS ENUM ('low', 'medium', 'high', 'critical', 'prohibited');
    END IF;

    -- Subscription tiers (SaaS revenue)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
        CREATE TYPE subscription_tier AS ENUM (
            'starter', 'growth', 'professional', 'enterprise'
        );
    END IF;

    -- Subscription status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM (
            'trial', 'active', 'past_due', 'paused', 'cancelled', 'expired'
        );
    END IF;

    -- Compliance check result
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'compliance_check_result') THEN
        CREATE TYPE compliance_check_result AS ENUM ('pass', 'fail', 'manual_review', 'not_applicable');
    END IF;

    -- Procurement workflow state (the locked loop)
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'procurement_state') THEN
        CREATE TYPE procurement_state AS ENUM (
            'draft',                          -- PO being created
            'pending_approval',               -- Awaiting maker/checker
            'approved',                       -- Checker approved
            'ordered',                        -- Sent to supplier
            'shipped',                        -- In transit
            'delivered',                      -- Received at property
            'delivery_verified',              -- GRN signed off
            'invoice_submitted',              -- Supplier invoice received
            'invoice_validated',              -- Compliance gate passed
            'factoring_pending',              -- Awaiting funder match
            'factoring_matched',              -- Funder bid accepted
            'payment_initiated',              -- Funder disbursing (off-platform)
            'payment_confirmed',              -- Hotel confirms payment to funder
            'completed',                      -- Full cycle closed
            'disputed',                       -- Issue raised
            'cancelled'                       -- Terminated
        );
    END IF;

    -- Alert severity
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_severity') THEN
        CREATE TYPE alert_severity AS ENUM ('info', 'low', 'medium', 'high', 'critical');
    END IF;

    -- Alert status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_status') THEN
        CREATE TYPE alert_status AS ENUM ('open', 'acknowledged', 'investigating', 'resolved', 'dismissed');
    END IF;
END $$;


-- ═══════════════════════════════════════════════════════════
-- SECTION 2: PLATFORM CONFIGURATION
-- Single row config for the orchestrator platform
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.platform_config (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Legal identity
    legal_name                  TEXT NOT NULL DEFAULT 'HotelsVendors',
    legal_name_ar               TEXT,
    commercial_register_number  TEXT NOT NULL,
    tax_id                      TEXT NOT NULL,
    -- Platform settings
    default_take_rate           NUMERIC(5, 4) NOT NULL DEFAULT 0.0050,  -- 0.5%
    min_take_rate               NUMERIC(5, 4) NOT NULL DEFAULT 0.0025,  -- 0.25%
    max_take_rate               NUMERIC(5, 4) NOT NULL DEFAULT 0.0150,  -- 1.5%
    -- Compliance thresholds
    large_transaction_threshold NUMERIC(15, 2) NOT NULL DEFAULT 500000.00, -- EGP 500K
    fraud_velocity_window_hours INTEGER NOT NULL DEFAULT 24,
    fraud_velocity_multiplier   NUMERIC(5, 2) NOT NULL DEFAULT 3.00,
    -- Subscription pricing (EGP per property per month)
    starter_price_egp           NUMERIC(10, 2) NOT NULL DEFAULT 1500.00,
    growth_price_egp            NUMERIC(10, 2) NOT NULL DEFAULT 3500.00,
    professional_price_egp      NUMERIC(10, 2) NOT NULL DEFAULT 7500.00,
    enterprise_price_egp        NUMERIC(10, 2) NOT NULL DEFAULT 15000.00,
    -- Trial
    trial_days                  INTEGER NOT NULL DEFAULT 30,
    -- Features
    max_properties_per_corporate INTEGER NOT NULL DEFAULT 50,
    max_supplier_listing_fee    NUMERIC(10, 2) NOT NULL DEFAULT 5000.00,
    -- Timestamps
    updated_at                  TIMESTAMPTZ DEFAULT now(),
    created_at                  TIMESTAMPTZ DEFAULT now()
);

-- Seed default config
INSERT INTO platform_config (legal_name, commercial_register_number, tax_id)
    VALUES ('HotelsVendors', 'PENDING', 'PENDING')
ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════
-- SECTION 3: ENTITY RISK PROFILES
-- Every entity (corporate, property, supplier, funder) gets a
-- continuously updated risk score. This is our core IP.
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.entity_risk_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type             TEXT NOT NULL CHECK (entity_type IN (
                                'corporate_account', 'property', 'supplier', 'funder'
                            )),
    entity_id               UUID NOT NULL,
    -- Verification
    status                  entity_status NOT NULL DEFAULT 'pending_verification',
    -- Risk scoring (0-100, higher = riskier)
    overall_risk_score      NUMERIC(5, 2) NOT NULL DEFAULT 50.00
                            CHECK (overall_risk_score >= 0 AND overall_risk_score <= 100),
    risk_band               risk_band NOT NULL DEFAULT 'medium',
    -- Component scores
    financial_score         NUMERIC(5, 2) DEFAULT 50.00
                            CHECK (financial_score >= 0 AND financial_score <= 100),
    compliance_score        NUMERIC(5, 2) DEFAULT 50.00
                            CHECK (compliance_score >= 0 AND compliance_score <= 100),
    operational_score       NUMERIC(5, 2) DEFAULT 50.00
                            CHECK (operational_score >= 0 AND operational_score <= 100),
    reputation_score        NUMERIC(5, 2) DEFAULT 50.00
                            CHECK (reputation_score >= 0 AND reputation_score <= 100),
    -- Verification details
    commercial_register_verified    BOOLEAN DEFAULT false,
    commercial_register_verified_at TIMESTAMPTZ,
    tax_id_verified                 BOOLEAN DEFAULT false,
    tax_id_verified_at              TIMESTAMPTZ,
    -- KYC/AML
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
    -- Review cycle
    last_review_date        DATE,
    next_review_date        DATE,
    review_frequency_months INTEGER DEFAULT 12,
    -- Metadata
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
    USING (entity_id IN (
        SELECT corporate_account_id FROM public.users WHERE id = auth.uid()
    ) OR entity_id IN (
        SELECT property_id FROM public.users WHERE id = auth.uid()
    ) OR entity_id IN (
        SELECT supplier_id FROM public.users WHERE id = auth.uid()
    ) OR auth.jwt() ->> 'role' IN ('admin', 'compliance'));


-- ═══════════════════════════════════════════════════════════
-- SECTION 4: COMPLIANCE VERIFICATION LOG
-- Every compliance check we perform is recorded.
-- This is our regulatory evidence trail.
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.compliance_checks (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- What was checked
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
    -- Result
    result                  compliance_check_result NOT NULL,
    details                 JSONB DEFAULT '{}'::jsonb,
    -- Who performed the check
    checked_by              UUID REFERENCES public.users(id),
    checked_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    -- Resolution (for manual_review results)
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


-- ═══════════════════════════════════════════════════════════
-- SECTION 5: INVOICE QUALIFICATION ENGINE
-- Our core product: verify and score every invoice to determine
-- if it's eligible for factoring. This replaces the simple
-- fraud_gate_check function with a comprehensive scoring system.
-- ═══════════════════════════════════════════════════════════

-- Extend invoices with qualification tracking
ALTER TABLE invoices
    ADD COLUMN IF NOT EXISTS qualification_status invoice_qualification DEFAULT 'pending_documents',
    ADD COLUMN IF NOT NULL EXISTS qualification_score NUMERIC(5, 2) DEFAULT 0.00,
    ADD COLUMN IF NOT EXISTS qualification_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS qualified_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS qualification_notes TEXT,
    ADD COLUMN IF NOT EXISTS eta_qr_code TEXT,
    ADD COLUMN IF NOT EXISTS eta_submission_date TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS eta_acknowledgment_id TEXT;

-- Invoice qualification details (one per invoice, updated over time)
CREATE TABLE IF NOT EXISTS public.invoice_qualification (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id              UUID NOT NULL UNIQUE REFERENCES invoices(id) ON DELETE CASCADE,
    -- Compliance gate results
    eta_uuid_present        compliance_check_result DEFAULT 'not_applicable',
    eta_uuid_verified       BOOLEAN DEFAULT false,
    eta_verified_at         TIMESTAMPTZ,
    delivery_signed_off     compliance_check_result DEFAULT 'not_applicable',
    delivery_verified_at    TIMESTAMPTZ,
    -- Risk assessment
    invoice_risk_score      NUMERIC(5, 2) DEFAULT 0.00
                            CHECK (invoice_risk_score >= 0 AND invoice_risk_score <= 100),
    risk_factors            JSONB DEFAULT '[]'::jsonb,
    -- Qualification decision
    status                  invoice_qualification NOT NULL DEFAULT 'pending_documents',
    qualified_at            TIMESTAMPTZ,
    rejected_reason         TEXT,
    -- Scoring breakdown
    compliance_score        NUMERIC(5, 2) DEFAULT 0.00,
    supplier_trust_score    NUMERIC(5, 2) DEFAULT 0.00,
    hotel_credit_score      NUMERIC(5, 2) DEFAULT 0.00,
    invoice_integrity_score NUMERIC(5, 2) DEFAULT 0.00,
    -- Factoring readiness
    factoring_eligible      BOOLEAN DEFAULT false,
    max_factoring_amount    NUMERIC(15, 2),
    recommended_take_rate   NUMERIC(5, 4),
    -- Timestamps
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


-- ═══════════════════════════════════════════════════════════
-- SECTION 6: FACTORING MATCHMAKING ENGINE
-- Our matchmaking: submit qualified invoices to funders,
-- collect bids, recommend the best one. We never touch the money.
-- ═══════════════════════════════════════════════════════════

-- Extend factoring_requests with orchestrator tracking
ALTER TABLE factoring_requests
    ADD COLUMN IF NOT EXISTS match_status factoring_match_status DEFAULT 'not_submitted',
    ADD COLUMN IF NOT EXISTS submitted_to_funders_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS bidding_closed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS selected_bid_id UUID,
    ADD COLUMN IF NOT EXISTS selected_funder_id UUID,
    ADD COLUMN IF NOT EXISTS match_score NUMERIC(5, 2),
    ADD COLUMN IF NOT EXISTS orchestrator_notes TEXT,
    ADD COLUMN IF NOT EXISTS funded_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS funding_confirmed BOOLEAN DEFAULT false,
    ADD COLUMN IF NOT EXISTS funding_confirmation_source TEXT CHECK (funding_confirmation_source IN (
        'funder_webhook', 'hotel_confirmation', 'supplier_confirmation', 'manual'
    ));

-- Funder API integration log (track every API call to funders)
CREATE TABLE IF NOT EXISTS public.funder_api_log (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funder_id               UUID NOT NULL REFERENCES funder_configs(id),
    request_type            TEXT NOT NULL CHECK (request_type IN (
                                'submit_invoice', 'request_bid', 'check_status',
                                'confirm_funding', 'health_check'
                            )),
    invoice_id              UUID REFERENCES invoices(id),
    factoring_request_id    UUID REFERENCES factoring_requests(id),
    -- Request/Response
    request_payload         JSONB,
    response_payload        JSONB,
    http_status_code        INTEGER,
    -- Result
    success                 BOOLEAN NOT NULL DEFAULT false,
    error_message           TEXT,
    -- Timing
    requested_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at            TIMESTAMPTZ,
    duration_ms             INTEGER,
    created_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_funder_api_funder ON funder_api_log(funder_id);
CREATE INDEX idx_funder_api_invoice ON funder_api_log(invoice_id);
CREATE INDEX idx_funder_api_request ON funder_api_log(factoring_request_id);
CREATE INDEX idx_funder_api_date ON funder_api_log(requested_at);
CREATE INDEX idx_funder_api_success ON funder_api_log(success);

ALTER TABLE funder_api_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY funder_api_access ON funder_api_log
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' IN ('admin', 'finance', 'compliance'));

-- Funder performance tracking (our scoring of funders)
CREATE TABLE IF NOT EXISTS public.funder_performance (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funder_id               UUID NOT NULL REFERENCES funder_configs(id),
    period_month            TEXT NOT NULL, -- YYYY-MM
    -- Metrics
    invoices_submitted      INTEGER DEFAULT 0,
    bids_received           INTEGER DEFAULT 0,
    bids_accepted           INTEGER DEFAULT 0,
    invoices_funded         INTEGER DEFAULT 0,
    total_funded_amount     NUMERIC(15, 2) DEFAULT 0.00,
    avg_bid_rate            NUMERIC(5, 3),
    avg_response_time_ms    INTEGER DEFAULT 0,
    api_uptime_pct          NUMERIC(5, 2) DEFAULT 100.00,
    -- Our score
    reliability_score       NUMERIC(5, 2) DEFAULT 50.00,
    competitiveness_score   NUMERIC(5, 2) DEFAULT 50.00,
    overall_score           NUMERIC(5, 2) DEFAULT 50.00,
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now(),
    UNIQUE(funder_id, period_month)
);

CREATE INDEX idx_funder_perf_funder ON funder_performance(funder_id);
CREATE INDEX idx_funder_perf_period ON funder_performance(period_month);
CREATE INDEX idx_funder_perf_score ON funder_performance(overall_score);

ALTER TABLE funder_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY funder_perf_access ON funder_performance
    FOR SELECT TO authenticated USING (true);


-- ═══════════════════════════════════════════════════════════
-- SECTION 7: PROCUREMENT LOCK-LOOP TRACKING
-- The complete purchase-to-payment cycle, locked and tracked.
-- This is the core workflow that gives hotels control.
-- ═══════════════════════════════════════════════════════════

-- Extend orders with procurement state tracking
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS procurement_state procurement_state DEFAULT 'draft',
    ADD COLUMN IF NOT NULL EXISTS procurement_state_changed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT NULL EXISTS procurement_state_changed_by UUID REFERENCES public.users(id),
    ADD COLUMN IF NOT NULL EXISTS expected_payment_date DATE,
    ADD COLUMN IF NOT NULL EXISTS actual_payment_date DATE,
    ADD COLUMN IF NOT NULL EXISTS payment_confirmation_source TEXT,
    ADD COLUMN IF NOT NULL EXISTS payment_reference TEXT;

-- Procurement state transition log (immutable audit of every state change)
CREATE TABLE IF NOT EXISTS public.procurement_transitions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    invoice_id              UUID REFERENCES invoices(id),
    from_state              procurement_state,
    to_state                procurement_state NOT NULL,
    transitioned_by         UUID NOT NULL REFERENCES public.users(id),
    transition_reason       TEXT,
    metadata                JSONB DEFAULT '{}'::jsonb,
    transitioned_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_proc_trans_order ON procurement_transitions(order_id);
CREATE INDEX idx_proc_trans_state ON procurement_transitions(to_state);
CREATE INDEX idx_proc_trans_date ON procurement_transitions(transitioned_at);

ALTER TABLE procurement_transitions ENABLE ROW LEVEL SECURITY;
CREATE POLICY proc_trans_access ON procurement_transitions
    FOR ALL TO authenticated
    USING (order_id IN (
        SELECT id FROM orders WHERE property_id IN (
            SELECT property_id FROM public.users WHERE id = auth.uid()
        )
    ) OR auth.jwt() ->> 'role' IN ('admin', 'compliance'));

-- GRN (Goods Receipt Note) — delivery verification
CREATE TABLE IF NOT EXISTS public.grn_records (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    invoice_id              UUID REFERENCES invoices(id),
    -- Delivery details
    delivery_date           DATE NOT NULL,
    received_by             UUID NOT NULL REFERENCES public.users(id),
    delivery_condition      TEXT CHECK (delivery_condition IN (
                                'perfect', 'acceptable', 'damaged', 'partial', 'rejected'
                            )) DEFAULT 'perfect',
    items_received          JSONB DEFAULT '[]'::jsonb,
    items_rejected          JSONB DEFAULT '[]'::jsonb,
    -- Dispute window
    dispute_window_start    TIMESTAMPTZ,
    dispute_window_end      TIMESTAMPTZ,
    dispute_raised          BOOLEAN DEFAULT false,
    dispute_reason          TEXT,
    dispute_resolved_at     TIMESTAMPTZ,
    -- Sign-off
    signed_off              BOOLEAN DEFAULT false,
    signed_off_at           TIMESTAMPTZ,
    signed_off_by           UUID REFERENCES public.users(id),
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_grn_order ON grn_records(order_id);
CREATE INDEX idx_grn_invoice ON grn_records(invoice_id);
CREATE INDEX idx_grn_dispute ON grn_records(dispute_raised);
CREATE INDEX idx_grn_window ON grn_records(dispute_window_end);

ALTER TABLE grn_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY grn_access ON grn_records
    FOR ALL TO authenticated
    USING (order_id IN (
        SELECT id FROM orders WHERE property_id IN (
            SELECT property_id FROM public.users WHERE id = auth.uid()
        )
    ) OR auth.jwt() ->> 'role' IN ('admin', 'compliance'));


-- ═══════════════════════════════════════════════════════════
-- SECTION 8: ALERTS & MONITORING
-- Real-time alerts for all parties
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.alerts (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- What triggered it
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
    -- Target
    entity_type             TEXT,
    entity_id               UUID,
    corporate_account_id    UUID REFERENCES corporate_accounts(id),
    property_id             UUID REFERENCES properties(id),
    invoice_id              UUID REFERENCES invoices(id),
    order_id                UUID REFERENCES orders(id),
    -- Content
    title                   TEXT NOT NULL,
    description             TEXT NOT NULL,
    details                 JSONB DEFAULT '{}'::jsonb,
    -- Resolution
    assigned_to             UUID REFERENCES public.users(id),
    resolved_by             UUID REFERENCES public.users(id),
    resolution_notes        TEXT,
    resolved_at             TIMESTAMPTZ,
    -- Timestamps
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


-- ═══════════════════════════════════════════════════════════
-- SECTION 9: REVENUE TRACKING (Orchestrator Model)
-- We earn from: SaaS subscriptions + success fees + listing fees
-- We NEVER hold or disburse funds.
-- ═══════════════════════════════════════════════════════════

-- 9a. Corporate subscriptions (SaaS revenue)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    corporate_account_id    UUID NOT NULL REFERENCES corporate_accounts(id),
    tier                    subscription_tier NOT NULL DEFAULT 'starter',
    status                  subscription_status NOT NULL DEFAULT 'trial',
    -- Billing
    price_per_property_egp  NUMERIC(10, 2) NOT NULL,
    property_count          INTEGER NOT NULL DEFAULT 1,
    monthly_total_egp       NUMERIC(12, 2) GENERATED ALWAYS AS (
                                price_per_property_egp * property_count
                            ) STORED,
    -- Trial
    trial_started_at        TIMESTAMPTZ DEFAULT now(),
    trial_ends_at           TIMESTAMPTZ DEFAULT (now() + INTERVAL '30 days'),
    -- Subscription period
    current_period_start    TIMESTAMPTZ DEFAULT now(),
    current_period_end      TIMESTAMPTZ DEFAULT (now() + INTERVAL '1 month'),
    -- Cancellation
    cancelled_at            TIMESTAMPTZ,
    cancellation_reason     TEXT,
    -- Timestamps
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

-- 9b. Success fees (take rate on funded invoices)
CREATE TABLE IF NOT EXISTS public.success_fees (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id              UUID NOT NULL REFERENCES invoices(id),
    factoring_request_id    UUID REFERENCES factoring_requests(id),
    funder_id               UUID REFERENCES funder_configs(id),
    corporate_account_id    UUID REFERENCES corporate_accounts(id),
    -- Fee calculation
    invoice_face_value      NUMERIC(15, 2) NOT NULL,
    take_rate               NUMERIC(5, 4) NOT NULL,
    fee_amount_egp          NUMERIC(15, 2) NOT NULL,
    -- Status
    status                  TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
                                'pending', 'invoice_issued', 'paid', 'waived', 'refunded'
                            )),
    -- We invoice the funder or hotel for our fee — we don't deduct from disbursement
    invoiced_to             TEXT CHECK (invoiced_to IN ('funder', 'hotel')),
    invoiced_at             TIMESTAMPTZ,
    paid_at                 TIMESTAMPTZ,
    -- Timestamps
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

-- 9c. Supplier listing fees
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


-- ═══════════════════════════════════════════════════════════
-- SECTION 10: REPORTING & ANALYTICS VIEWS
-- Pre-built views for dashboards and regulatory reporting
-- ═══════════════════════════════════════════════════════════

-- 10a. Invoice pipeline view (the core dashboard)
CREATE OR REPLACE VIEW public.v_invoice_pipeline AS
SELECT
    i.id AS invoice_id,
    i.face_value,
    i.currency,
    i.eta_uuid,
    i.eta_status,
    i.delivery_signed_off,
    i.fraud_gate_status,
    i.qualification_status,
    iq.invoice_risk_score,
    iq.factoring_eligible,
    iq.recommended_take_rate,
    fr.match_status,
    fr.selected_funder_id,
    fc.name AS selected_funder_name,
    fb.offered_rate AS accepted_bid_rate,
    fb.offered_amount AS accepted_bid_amount,
    o.procurement_state,
    o.property_id,
    p.name AS property_name,
    p.corporate_account_id,
    ca.name AS corporate_name,
    s.name AS supplier_name,
    s.verified AS supplier_verified,
    i.issue_date,
    i.due_date,
    CURRENT_DATE - i.due_date AS days_past_due
FROM invoices i
LEFT JOIN invoice_qualification iq ON iq.invoice_id = i.id
LEFT JOIN factoring_requests fr ON fr.invoice_id = i.id
LEFT JOIN factoring_bids fb ON fb.id = fr.selected_bid_id
LEFT JOIN funder_configs fc ON fc.id = fr.selected_funder_id
LEFT JOIN orders o ON o.id = i.order_id
LEFT JOIN properties p ON p.id = o.property_id
LEFT JOIN corporate_accounts ca ON ca.id = p.corporate_account_id
LEFT JOIN suppliers s ON s.id = i.supplier_id;

-- 10b. Risk dashboard view
CREATE OR REPLACE VIEW public.v_risk_dashboard AS
SELECT
    erp.entity_type,
    erp.entity_id,
    erp.overall_risk_score,
    erp.risk_band,
    erp.status,
    erp.financial_score,
    erp.compliance_score,
    erp.operational_score,
    erp.reputation_score,
    erp.risk_factors,
    erp.next_review_date,
    CASE erp.entity_type
        WHEN 'corporate_account' THEN (SELECT name FROM corporate_accounts WHERE id = erp.entity_id)
        WHEN 'property' THEN (SELECT name FROM properties WHERE id = erp.entity_id)
        WHEN 'supplier' THEN (SELECT name FROM suppliers WHERE id = erp.entity_id)
        WHEN 'funder' THEN (SELECT name FROM funder_configs WHERE id = erp.entity_id)
    END AS entity_name
FROM entity_risk_profiles erp
ORDER BY erp.overall_risk_score DESC;

-- 10c. Revenue summary view
CREATE OR REPLACE VIEW public.v_revenue_summary AS
SELECT
    'subscription' AS revenue_type,
    s.corporate_account_id,
    s.monthly_total_egp AS amount_egp,
    s.status,
    s.current_period_start AS period_start,
    s.current_period_end AS period_end
FROM subscriptions s
WHERE s.status = 'active'
UNION ALL
SELECT
    'success_fee' AS revenue_type,
    sf.corporate_account_id,
    sf.fee_amount_egp AS amount_egp,
    sf.status,
    sf.created_at AS period_start,
    sf.paid_at AS period_end
FROM success_fees sf
UNION ALL
SELECT
    'listing_fee' AS revenue_type,
    NULL AS corporate_account_id,
    slf.amount_egp,
    slf.status,
    slf.created_at AS period_start,
    slf.paid_at AS period_end
FROM supplier_listing_fees slf;

-- 10d. Procurement status view
CREATE OR REPLACE VIEW public.v_procurement_status AS
SELECT
    o.id AS order_id,
    o.procurement_state,
    o.total_value,
    o.currency,
    o.maker_user_id,
    o.checker_user_id,
    o.checker_approved,
    p.name AS property_name,
    ca.name AS corporate_name,
    s.name AS supplier_name,
    i.id AS invoice_id,
    i.face_value AS invoice_amount,
    i.qualification_status,
    iq.factoring_eligible,
    fr.match_status,
    grn.signed_off AS grn_signed,
    grn.dispute_raised,
    o.created_at AS order_date,
    o.delivered_at,
    grn.delivery_date AS grn_date
FROM orders o
LEFT JOIN properties p ON p.id = o.property_id
LEFT JOIN corporate_accounts ca ON ca.id = o.corporate_account_id
LEFT JOIN suppliers s ON s.id = o.supplier_id
LEFT JOIN invoices i ON i.order_id = o.id
LEFT JOIN invoice_qualification iq ON iq.invoice_id = i.id
LEFT JOIN factoring_requests fr ON fr.invoice_id = i.id
LEFT JOIN grn_records grn ON grn.order_id = o.id;


-- ═══════════════════════════════════════════════════════════
-- SECTION 11: HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════

-- 11a. Calculate invoice qualification score
CREATE OR REPLACE FUNCTION public.calculate_invoice_qualification(p_invoice_id UUID)
RETURNS TABLE (
    qualification_status invoice_qualification,
    risk_score NUMERIC,
    eligible BOOLEAN,
    reasons TEXT[]
) AS $$
DECLARE
    v_eta_present BOOLEAN;
    v_eta_verified BOOLEAN;
    v_delivery_signed BOOLEAN;
    v_supplier_verified BOOLEAN;
    v_hotel_risk_score NUMERIC;
    v_supplier_risk_score NUMERIC;
    v_compliance_score NUMERIC := 0;
    v_risk_score NUMERIC := 0;
    v_eligible BOOLEAN := true;
    v_reasons TEXT[] := '{}';
BEGIN
    -- Check ETA
    SELECT eta_uuid IS NOT NULL AND eta_uuid != '',
           eta_status = 'accepted'
    INTO v_eta_present, v_eta_verified
    FROM invoices WHERE id = p_invoice_id;

    -- Check delivery
    SELECT delivery_signed_off INTO v_delivery_signed
    FROM invoices WHERE id = p_invoice_id;

    -- Check supplier
    SELECT s.verified INTO v_supplier_verified
    FROM invoices i
    JOIN suppliers s ON s.id = i.supplier_id
    WHERE i.id = p_invoice_id;

    -- Get risk scores
    SELECT COALESCE(erp.overall_risk_score, 50) INTO v_hotel_risk_score
    FROM invoices i
    JOIN hotels h ON h.id = i.hotel_id
    LEFT JOIN entity_risk_profiles erp ON erp.entity_type = 'property' AND erp.entity_id = h.id
    WHERE i.id = p_invoice_id;

    SELECT COALESCE(erp.overall_risk_score, 50) INTO v_supplier_risk_score
    FROM invoices i
    LEFT JOIN entity_risk_profiles erp ON erp.entity_type = 'supplier' AND erp.entity_id = i.supplier_id
    WHERE i.id = p_invoice_id;

    -- Calculate compliance score
    IF v_eta_present THEN v_compliance_score := v_compliance_score + 25; ELSE v_eligible := false; v_reasons := array_append(v_reasons, 'Missing ETA UUID'); END IF;
    IF v_eta_verified THEN v_compliance_score := v_compliance_score + 25; END IF;
    IF v_delivery_signed THEN v_compliance_score := v_compliance_score + 25; ELSE v_eligible := false; v_reasons := array_append(v_reasons, 'Delivery not signed off'); END IF;
    IF v_supplier_verified THEN v_compliance_score := v_compliance_score + 25; END IF;

    -- Calculate risk score (weighted)
    v_risk_score := (v_hotel_risk_score * 0.4) + (v_supplier_risk_score * 0.4) + ((100 - v_compliance_score) * 0.2);

    -- Determine status
    RETURN QUERY SELECT
        CASE
            WHEN NOT v_eligible THEN 'pending_documents'::invoice_qualification
            WHEN v_compliance_score = 100 AND v_risk_score < 30 THEN 'qualified'::invoice_qualification
            WHEN v_compliance_score = 100 AND v_risk_score < 60 THEN 'compliance_review'::invoice_qualification
            ELSE 'rejected'::invoice_qualification
        END,
        v_risk_score,
        v_eligible AND v_compliance_score = 100 AND v_risk_score < 60,
        v_reasons;
END;
$$ LANGUAGE plpgsql;

-- 11b. Update procurement state with validation
CREATE OR REPLACE FUNCTION public.transition_procurement_state(
    p_order_id UUID,
    p_new_state procurement_state,
    p_user_id UUID,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_state procurement_state;
    v_valid_transition BOOLEAN := false;
BEGIN
    SELECT procurement_state INTO v_current_state FROM orders WHERE id = p_order_id;
    IF v_current_state IS NULL THEN RETURN false; END IF;

    -- Define valid transitions (the locked loop)
    v_valid_transition := CASE v_current_state
        WHEN 'draft' THEN p_new_state IN ('pending_approval', 'cancelled')
        WHEN 'pending_approval' THEN p_new_state IN ('approved', 'draft', 'cancelled')
        WHEN 'approved' THEN p_new_state IN ('ordered', 'cancelled')
        WHEN 'ordered' THEN p_new_state IN ('shipped', 'cancelled')
        WHEN 'shipped' THEN p_new_state IN ('delivered', 'disputed')
        WHEN 'delivered' THEN p_new_state IN ('delivery_verified', 'disputed')
        WHEN 'delivery_verified' THEN p_new_state IN ('invoice_submitted', 'disputed')
        WHEN 'invoice_submitted' THEN p_new_state IN ('invoice_validated', 'disputed')
        WHEN 'invoice_validated' THEN p_new_state IN ('factoring_pending', 'completed', 'disputed')
        WHEN 'factoring_pending' THEN p_new_state IN ('factoring_matched', 'completed', 'disputed')
        WHEN 'factoring_matched' THEN p_new_state IN ('payment_initiated', 'disputed')
        WHEN 'payment_initiated' THEN p_new_state IN ('payment_confirmed', 'disputed')
        WHEN 'payment_confirmed' THEN p_new_state IN ('completed')
        WHEN 'disputed' THEN p_new_state IN ('completed', 'cancelled')
        WHEN 'completed' THEN false  -- terminal state
        WHEN 'cancelled' THEN false  -- terminal state
    END;

    IF NOT v_valid_transition THEN
        RAISE EXCEPTION 'Invalid procurement transition from % to %', v_current_state, p_new_state;
    END IF;

    -- Update order
    UPDATE orders SET
        procurement_state = p_new_state,
        procurement_state_changed_at = now(),
        procurement_state_changed_by = p_user_id
    WHERE id = p_order_id;

    -- Log transition
    INSERT INTO procurement_transitions (order_id, from_state, to_state, transitioned_by, transition_reason)
    VALUES (p_order_id, v_current_state, p_new_state, p_user_id, p_reason);

    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 11c. Auto-update risk band when score changes
CREATE OR REPLACE FUNCTION public.update_risk_band()
RETURNS TRIGGER AS $$
BEGIN
    NEW.risk_band := CASE
        WHEN NEW.overall_risk_score < 20 THEN 'low'::risk_band
        WHEN NEW.overall_risk_score < 40 THEN 'medium'::risk_band
        WHEN NEW.overall_risk_score < 70 THEN 'high'::risk_band
        WHEN NEW.overall_risk_score < 90 THEN 'critical'::risk_band
        ELSE 'prohibited'::risk_band
    END;
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_risk_band
    BEFORE INSERT OR UPDATE ON entity_risk_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_risk_band();

-- 11d. Auto-update timestamps on key tables
CREATE OR REPLACE FUNCTION public.auto_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN SELECT unnest(ARRAY[
        'entity_risk_profiles', 'invoice_qualification', 'grn_records',
        'alerts', 'subscriptions', 'success_fees', 'supplier_listing_fees',
        'funder_performance', 'factoring_requests'
    ])
    LOOP
        EXECUTE format('
            CREATE TRIGGER trigger_%s_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION public.auto_update_timestamp();
        ', t, t);
    END LOOP;
END $$;


-- ═══════════════════════════════════════════════════════════
-- SECTION 12: RLS POLICIES for remaining tables
-- ═══════════════════════════════════════════════════════════

-- Platform config: read for all, write for admin only
ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY platform_config_read ON platform_config FOR SELECT TO authenticated USING (true);
CREATE POLICY platform_config_write ON platform_config FOR ALL TO service_role USING (true);

-- Funder configs: read for all, write for admin
ALTER TABLE funder_configs ENABLE ROW LEVEL SECURITY;
CREATE POLICY funder_configs_read ON funder_configs FOR SELECT TO authenticated USING (true);
CREATE POLICY funder_configs_write ON funder_configs FOR ALL TO service_role USING (true);

-- Factoring requests: scoped to hotel
ALTER TABLE factoring_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY fr_access ON factoring_requests
    FOR ALL TO authenticated
    USING (hotel_id IN (
        SELECT id FROM hotels WHERE owner_id = auth.uid()
    ) OR auth.jwt() ->> 'role' IN ('admin', 'finance'));

-- Factoring bids: scoped through factoring requests
ALTER TABLE factoring_bids ENABLE ROW LEVEL SECURITY;
CREATE POLICY fb_access ON factoring_bids
    FOR ALL TO authenticated
    USING (request_id IN (
        SELECT fr.id FROM factoring_requests fr
        JOIN hotels h ON fr.hotel_id = h.id
        WHERE h.owner_id = auth.uid()
    ) OR auth.jwt() ->> 'role' IN ('admin', 'finance'));


-- ═══════════════════════════════════════════════════════════
-- SECTION 13: SEED DATA
-- ═══════════════════════════════════════════════════════════

-- Ensure funder configs exist
INSERT INTO funder_configs (name, rate_min, rate_max, credit_limit, min_invoice) VALUES
    ('OLIV', 0.012, 0.015, 500000, 5000),
    ('ValU', 0.015, 0.018, 300000, 3000),
    ('CIB Factoring', 0.010, 0.012, 1000000, 10000),
    ('Fawry Business', 0.018, 0.021, 100000, 2000)
ON CONFLICT DO NOTHING;


COMMIT;
