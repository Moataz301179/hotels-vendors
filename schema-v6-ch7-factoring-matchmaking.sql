-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 7: FACTORING MATCHMAKING ENGINE
-- Submit qualified invoices to funders, collect bids, recommend the best.
-- We never touch the money.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

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

-- Funder API integration log
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

CREATE INDEX idx_funder_api_funder ON funder_api_log(funder_id);
CREATE INDEX idx_funder_api_invoice ON funder_api_log(invoice_id);
CREATE INDEX idx_funder_api_request ON funder_api_log(factoring_request_id);
CREATE INDEX idx_funder_api_date ON funder_api_log(requested_at);
CREATE INDEX idx_funder_api_success ON funder_api_log(success);

ALTER TABLE funder_api_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY funder_api_access ON funder_api_log
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'role' IN ('admin', 'finance', 'compliance'));

-- Funder performance tracking
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

CREATE INDEX idx_funder_perf_funder ON funder_performance(funder_id);
CREATE INDEX idx_funder_perf_period ON funder_performance(period_month);
CREATE INDEX idx_funder_perf_score ON funder_performance(overall_score);

ALTER TABLE funder_performance ENABLE ROW LEVEL SECURITY;
CREATE POLICY funder_perf_access ON funder_performance
    FOR SELECT TO authenticated USING (true);

COMMIT;
