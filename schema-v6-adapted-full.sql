-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — ADAPTED FULL SCHEMA
-- Adapted to actual base schema:
--   Tables: hotels, suppliers, funder_configs, invoices, factoring_requests,
--           factoring_bids, users, notifications, webhook_secrets,
--           agent_audit_log, platform_config
--   No: corporate_accounts, properties, orders (orders created below)
-- ═══════════════════════════════════════════════════════════════════════════


-- ═══════════════════════════════════════════════════════════
-- SECTION 1: ENTITY RISK PROFILES
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.entity_risk_profiles (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type             TEXT NOT NULL CHECK (entity_type IN ('hotel', 'supplier', 'funder')),
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

CREATE INDEX IF NOT EXISTS idx_risk_profiles_entity ON entity_risk_profiles(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_risk_profiles_band ON entity_risk_profiles(risk_band);
CREATE INDEX IF NOT EXISTS idx_risk_profiles_score ON entity_risk_profiles(overall_risk_score);
CREATE INDEX IF NOT EXISTS idx_risk_profiles_status ON entity_risk_profiles(status);
CREATE INDEX IF NOT EXISTS idx_risk_profiles_review ON entity_risk_profiles(next_review_date);


-- ═══════════════════════════════════════════════════════════
-- SECTION 2: COMPLIANCE VERIFICATION LOG
-- ═══════════════════════════════════════════════════════════

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

CREATE INDEX IF NOT EXISTS idx_compliance_checks_invoice ON compliance_checks(invoice_id);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_entity ON compliance_checks(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_result ON compliance_checks(result);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_type ON compliance_checks(check_type);
CREATE INDEX IF NOT EXISTS idx_compliance_checks_date ON compliance_checks(checked_at);


-- ═══════════════════════════════════════════════════════════
-- SECTION 3: INVOICE QUALIFICATION ENGINE
-- ═══════════════════════════════════════════════════════════

-- Extend invoices with qualification tracking (all IF NOT EXISTS safe)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'qualification_status') THEN
        ALTER TABLE invoices ADD COLUMN qualification_status invoice_qualification DEFAULT 'pending_documents';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'qualification_score') THEN
        ALTER TABLE invoices ADD COLUMN qualification_score NUMERIC(5, 2) DEFAULT 0.00;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'qualification_date') THEN
        ALTER TABLE invoices ADD COLUMN qualification_date TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'qualified_at') THEN
        ALTER TABLE invoices ADD COLUMN qualified_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'qualification_notes') THEN
        ALTER TABLE invoices ADD COLUMN qualification_notes TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'eta_qr_code') THEN
        ALTER TABLE invoices ADD COLUMN eta_qr_code TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'eta_submission_date') THEN
        ALTER TABLE invoices ADD COLUMN eta_submission_date TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'invoices' AND column_name = 'eta_acknowledgment_id') THEN
        ALTER TABLE invoices ADD COLUMN eta_acknowledgment_id TEXT;
    END IF;
END $$;

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

CREATE INDEX IF NOT EXISTS idx_inv_qual_invoice ON invoice_qualification(invoice_id);
CREATE INDEX IF NOT EXISTS idx_inv_qual_status ON invoice_qualification(status);
CREATE INDEX IF NOT EXISTS idx_inv_qual_eligible ON invoice_qualification(factoring_eligible);
CREATE INDEX IF NOT EXISTS idx_inv_qual_score ON invoice_qualification(invoice_risk_score);


-- ═══════════════════════════════════════════════════════════
-- SECTION 4: FACTORING MATCHMAKING ENGINE
-- ═══════════════════════════════════════════════════════════

-- Extend factoring_requests with orchestrator tracking
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'factoring_requests' AND column_name = 'match_status') THEN
        ALTER TABLE factoring_requests ADD COLUMN match_status factoring_match_status DEFAULT 'not_submitted';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'factoring_requests' AND column_name = 'submitted_to_funders_at') THEN
        ALTER TABLE factoring_requests ADD COLUMN submitted_to_funders_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'factoring_requests' AND column_name = 'bidding_closed_at') THEN
        ALTER TABLE factoring_requests ADD COLUMN bidding_closed_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'factoring_requests' AND column_name = 'selected_bid_id') THEN
        ALTER TABLE factoring_requests ADD COLUMN selected_bid_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'factoring_requests' AND column_name = 'selected_funder_id') THEN
        ALTER TABLE factoring_requests ADD COLUMN selected_funder_id UUID;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'factoring_requests' AND column_name = 'match_score') THEN
        ALTER TABLE factoring_requests ADD COLUMN match_score NUMERIC(5, 2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'factoring_requests' AND column_name = 'orchestrator_notes') THEN
        ALTER TABLE factoring_requests ADD COLUMN orchestrator_notes TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'factoring_requests' AND column_name = 'funded_at') THEN
        ALTER TABLE factoring_requests ADD COLUMN funded_at TIMESTAMPTZ;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'factoring_requests' AND column_name = 'funding_confirmed') THEN
        ALTER TABLE factoring_requests ADD COLUMN funding_confirmed BOOLEAN DEFAULT false;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'factoring_requests' AND column_name = 'funding_confirmation_source') THEN
        ALTER TABLE factoring_requests ADD COLUMN funding_confirmation_source TEXT CHECK (funding_confirmation_source IN (
            'funder_webhook', 'hotel_confirmation', 'supplier_confirmation', 'manual'
        ));
    END IF;
END $$;

-- FK for selected_bid_id (factoring_bids already exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name = 'factoring_requests_selected_bid_id_fkey') THEN
        ALTER TABLE factoring_requests
            ADD CONSTRAINT factoring_requests_selected_bid_id_fkey
            FOREIGN KEY (selected_bid_id) REFERENCES factoring_bids(id);
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.funder_api_log (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funder_id               UUID NOT NULL REFERENCES funder_configs(id),
    request_type            TEXT NOT NULL CHECK (request_type IN (
                                'submit_invoice', 'request_bid', 'check_status',
                                'confirm_funding', 'health_check'
                            )),
    invoice_id              UUID REFERENCES invoices(id),
    factoring_request_id    UUID REFERENCES factoring_requests(id),
    request_payload         JSONB,
    response_payload        JSONB,
    http_status_code        INTEGER,
    success                 BOOLEAN NOT NULL DEFAULT false,
    error_message           TEXT,
    requested_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
    responded_at            TIMESTAMPTZ,
    duration_ms             INTEGER,
    created_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_funder_api_funder ON funder_api_log(funder_id);
CREATE INDEX IF NOT EXISTS idx_funder_api_invoice ON funder_api_log(invoice_id);
CREATE INDEX IF NOT EXISTS idx_funder_api_request ON funder_api_log(factoring_request_id);
CREATE INDEX IF NOT EXISTS idx_funder_api_date ON funder_api_log(requested_at);
CREATE INDEX IF NOT EXISTS idx_funder_api_success ON funder_api_log(success);

CREATE TABLE IF NOT EXISTS public.funder_performance (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    funder_id               UUID NOT NULL REFERENCES funder_configs(id),
    period_month            TEXT NOT NULL,
    invoices_submitted      INTEGER DEFAULT 0,
    bids_received           INTEGER DEFAULT 0,
    bids_accepted           INTEGER DEFAULT 0,
    invoices_funded         INTEGER DEFAULT 0,
    total_funded_amount     NUMERIC(15, 2) DEFAULT 0.00,
    avg_bid_rate            NUMERIC(5, 3),
    avg_response_time_ms    INTEGER DEFAULT 0,
    api_uptime_pct          NUMERIC(5, 2) DEFAULT 100.00,
    reliability_score       NUMERIC(5, 2) DEFAULT 50.00,
    competitiveness_score   NUMERIC(5, 2) DEFAULT 50.00,
    overall_score           NUMERIC(5, 2) DEFAULT 50.00,
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now(),
    UNIQUE(funder_id, period_month)
);

CREATE INDEX IF NOT EXISTS idx_funder_perf_funder ON funder_performance(funder_id);
CREATE INDEX IF NOT EXISTS idx_funder_perf_period ON funder_performance(period_month);
CREATE INDEX IF NOT EXISTS idx_funder_perf_score ON funder_performance(overall_score);


-- ═══════════════════════════════════════════════════════════
-- SECTION 5: ORDERS TABLE (create if missing) + PROCUREMENT TRACKING
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.orders (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id                UUID REFERENCES hotels(id),
    supplier_id             UUID REFERENCES suppliers(id),
    total_value             NUMERIC(15, 2),
    currency                TEXT DEFAULT 'EGP',
    maker_user_id           UUID REFERENCES public.users(id),
    checker_user_id         UUID REFERENCES public.users(id),
    checker_approved        BOOLEAN DEFAULT false,
    procurement_state       procurement_state DEFAULT 'draft',
    procurement_state_changed_at TIMESTAMPTZ,
    procurement_state_changed_by UUID REFERENCES public.users(id),
    expected_payment_date   DATE,
    actual_payment_date     DATE,
    payment_confirmation_source TEXT,
    payment_reference       TEXT,
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

-- Now add FK from invoices.order_id → orders.id if not already
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE table_name = 'invoices' AND constraint_name = 'invoices_order_id_fkey') THEN
        ALTER TABLE invoices
            ADD CONSTRAINT invoices_order_id_fkey
            FOREIGN KEY (order_id) REFERENCES orders(id);
    END IF;
END $$;

-- Procurement state transition log
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

CREATE INDEX IF NOT EXISTS idx_proc_trans_order ON procurement_transitions(order_id);
CREATE INDEX IF NOT EXISTS idx_proc_trans_state ON procurement_transitions(to_state);
CREATE INDEX IF NOT EXISTS idx_proc_trans_date ON procurement_transitions(transitioned_at);

-- GRN (Goods Receipt Note)
CREATE TABLE IF NOT EXISTS public.grn_records (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id                UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    invoice_id              UUID REFERENCES invoices(id),
    delivery_date           DATE NOT NULL,
    received_by             UUID NOT NULL REFERENCES public.users(id),
    delivery_condition      TEXT CHECK (delivery_condition IN (
                                'perfect', 'acceptable', 'damaged', 'partial', 'rejected'
                            )) DEFAULT 'perfect',
    items_received          JSONB DEFAULT '[]'::jsonb,
    items_rejected          JSONB DEFAULT '[]'::jsonb,
    dispute_window_start    TIMESTAMPTZ,
    dispute_window_end      TIMESTAMPTZ,
    dispute_raised          BOOLEAN DEFAULT false,
    dispute_reason          TEXT,
    dispute_resolved_at     TIMESTAMPTZ,
    signed_off              BOOLEAN DEFAULT false,
    signed_off_at           TIMESTAMPTZ,
    signed_off_by           UUID REFERENCES public.users(id),
    created_at              TIMESTAMPTZ DEFAULT now(),
    updated_at              TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grn_order ON grn_records(order_id);
CREATE INDEX IF NOT EXISTS idx_grn_invoice ON grn_records(invoice_id);
CREATE INDEX IF NOT EXISTS idx_grn_dispute ON grn_records(dispute_raised);
CREATE INDEX IF NOT EXISTS idx_grn_window ON grn_records(dispute_window_end);


-- ═══════════════════════════════════════════════════════════
-- SECTION 6: ALERTS & MONITORING
-- ═══════════════════════════════════════════════════════════

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
    hotel_id                UUID REFERENCES hotels(id),
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

CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_alerts_entity ON alerts(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_alerts_hotel ON alerts(hotel_id);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at);


-- ═══════════════════════════════════════════════════════════
-- SECTION 7: REVENUE TRACKING (Orchestrator Model)
-- No corporate_account_id → link subscriptions to hotels directly
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    hotel_id                UUID NOT NULL REFERENCES hotels(id),
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

CREATE INDEX IF NOT EXISTS idx_subscriptions_hotel ON subscriptions(hotel_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period ON subscriptions(current_period_end);

CREATE TABLE IF NOT EXISTS public.success_fees (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id              UUID NOT NULL REFERENCES invoices(id),
    factoring_request_id    UUID REFERENCES factoring_requests(id),
    funder_id               UUID REFERENCES funder_configs(id),
    hotel_id                UUID REFERENCES hotels(id),
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

CREATE INDEX IF NOT EXISTS idx_success_fees_invoice ON success_fees(invoice_id);
CREATE INDEX IF NOT EXISTS idx_success_fees_hotel ON success_fees(hotel_id);
CREATE INDEX IF NOT EXISTS idx_success_fees_status ON success_fees(status);
CREATE INDEX IF NOT EXISTS idx_success_fees_funder ON success_fees(funder_id);

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

CREATE INDEX IF NOT EXISTS idx_listing_fees_supplier ON supplier_listing_fees(supplier_id);
CREATE INDEX IF NOT EXISTS idx_listing_fees_status ON supplier_listing_fees(status);


-- ═══════════════════════════════════════════════════════════
-- SECTION 8: ANALYTICS VIEWS
-- ═══════════════════════════════════════════════════════════

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
    h.id AS hotel_id,
    h.name AS hotel_name,
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
LEFT JOIN hotels h ON h.id = i.hotel_id
LEFT JOIN suppliers s ON s.id = i.supplier_id;

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
        WHEN 'hotel' THEN (SELECT name FROM hotels WHERE id = erp.entity_id)
        WHEN 'supplier' THEN (SELECT name FROM suppliers WHERE id = erp.entity_id)
        WHEN 'funder' THEN (SELECT name FROM funder_configs WHERE id = erp.entity_id)
    END AS entity_name
FROM entity_risk_profiles erp
ORDER BY erp.overall_risk_score DESC;

CREATE OR REPLACE VIEW public.v_revenue_summary AS
SELECT
    'subscription' AS revenue_type,
    s.hotel_id,
    s.monthly_total_egp AS amount_egp,
    s.status,
    s.current_period_start AS period_start,
    s.current_period_end AS period_end
FROM subscriptions s
WHERE s.status = 'active'
UNION ALL
SELECT
    'success_fee' AS revenue_type,
    sf.hotel_id,
    sf.fee_amount_egp AS amount_egp,
    sf.status,
    sf.created_at AS period_start,
    sf.paid_at AS period_end
FROM success_fees sf
UNION ALL
SELECT
    'listing_fee' AS revenue_type,
    NULL AS hotel_id,
    slf.amount_egp,
    slf.status,
    slf.created_at AS period_start,
    slf.paid_at AS period_end
FROM supplier_listing_fees slf;


-- ═══════════════════════════════════════════════════════════
-- SECTION 9: HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════

-- 9a. Calculate invoice qualification score
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
    SELECT eta_uuid IS NOT NULL AND eta_uuid != '',
           eta_status = 'accepted'
    INTO v_eta_present, v_eta_verified
    FROM invoices WHERE id = p_invoice_id;

    SELECT delivery_signed_off INTO v_delivery_signed
    FROM invoices WHERE id = p_invoice_id;

    SELECT s.verified INTO v_supplier_verified
    FROM invoices i
    JOIN suppliers s ON s.id = i.supplier_id
    WHERE i.id = p_invoice_id;

    SELECT COALESCE(erp.overall_risk_score, 50) INTO v_hotel_risk_score
    FROM invoices i
    LEFT JOIN entity_risk_profiles erp ON erp.entity_type = 'hotel' AND erp.entity_id = i.hotel_id
    WHERE i.id = p_invoice_id;

    SELECT COALESCE(erp.overall_risk_score, 50) INTO v_supplier_risk_score
    FROM invoices i
    LEFT JOIN entity_risk_profiles erp ON erp.entity_type = 'supplier' AND erp.entity_id = i.supplier_id
    WHERE i.id = p_invoice_id;

    IF v_eta_present THEN v_compliance_score := v_compliance_score + 25; ELSE v_eligible := false; v_reasons := array_append(v_reasons, 'Missing ETA UUID'); END IF;
    IF v_eta_verified THEN v_compliance_score := v_compliance_score + 25; END IF;
    IF v_delivery_signed THEN v_compliance_score := v_compliance_score + 25; ELSE v_eligible := false; v_reasons := array_append(v_reasons, 'Delivery not signed off'); END IF;
    IF v_supplier_verified THEN v_compliance_score := v_compliance_score + 25; END IF;

    v_risk_score := (v_hotel_risk_score * 0.4) + (v_supplier_risk_score * 0.4) + ((100 - v_compliance_score) * 0.2);

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

-- 9b. Update procurement state with validation
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
        WHEN 'completed' THEN false
        WHEN 'cancelled' THEN false
    END;

    IF NOT v_valid_transition THEN
        RAISE EXCEPTION 'Invalid procurement transition from % to %', v_current_state, p_new_state;
    END IF;

    UPDATE orders SET
        procurement_state = p_new_state,
        procurement_state_changed_at = now(),
        procurement_state_changed_by = p_user_id
    WHERE id = p_order_id;

    INSERT INTO procurement_transitions (order_id, from_state, to_state, transitioned_by, transition_reason)
    VALUES (p_order_id, v_current_state, p_new_state, p_user_id, p_reason);

    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 9c. Auto-update risk band when score changes
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

DROP TRIGGER IF EXISTS trigger_update_risk_band ON entity_risk_profiles;
CREATE TRIGGER trigger_update_risk_band
    BEFORE INSERT OR UPDATE ON entity_risk_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_risk_band();

-- 9d. Auto-update timestamps function
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
        'funder_performance', 'factoring_requests', 'orders'
    ])
    LOOP
        EXECUTE format('
            DROP TRIGGER IF EXISTS trigger_%s_updated_at ON %I;
            CREATE TRIGGER trigger_%s_updated_at
            BEFORE UPDATE ON %I
            FOR EACH ROW
            EXECUTE FUNCTION public.auto_update_timestamp();
        ', t, t, t, t);
    END LOOP;
END $$;


-- ═══════════════════════════════════════════════════════════
-- SECTION 10: SEED DATA
-- ═══════════════════════════════════════════════════════════

INSERT INTO funder_configs (name, rate_min, rate_max, credit_limit, min_invoice) VALUES
    ('OLIV', 0.012, 0.015, 500000, 5000),
    ('ValU', 0.015, 0.018, 300000, 3000),
    ('CIB Factoring', 0.010, 0.012, 1000000, 10000),
    ('Fawry Business', 0.018, 0.021, 100000, 2000)
ON CONFLICT DO NOTHING;
