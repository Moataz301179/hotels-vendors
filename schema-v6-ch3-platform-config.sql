-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 3: PLATFORM CONFIGURATION
-- Single row config for the orchestrator platform
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

CREATE TABLE IF NOT EXISTS public.platform_config (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legal_name                  TEXT NOT NULL DEFAULT 'HotelsVendors',
    legal_name_ar               TEXT,
    commercial_register_number  TEXT NOT NULL,
    tax_id                      TEXT NOT NULL,
    default_take_rate           NUMERIC(5, 4) NOT NULL DEFAULT 0.0050,
    min_take_rate               NUMERIC(5, 4) NOT NULL DEFAULT 0.0025,
    max_take_rate               NUMERIC(5, 4) NOT NULL DEFAULT 0.0150,
    large_transaction_threshold NUMERIC(15, 2) NOT NULL DEFAULT 500000.00,
    fraud_velocity_window_hours INTEGER NOT NULL DEFAULT 24,
    fraud_velocity_multiplier   NUMERIC(5, 2) NOT NULL DEFAULT 3.00,
    starter_price_egp           NUMERIC(10, 2) NOT NULL DEFAULT 1500.00,
    growth_price_egp            NUMERIC(10, 2) NOT NULL DEFAULT 3500.00,
    professional_price_egp      NUMERIC(10, 2) NOT NULL DEFAULT 7500.00,
    enterprise_price_egp        NUMERIC(10, 2) NOT NULL DEFAULT 15000.00,
    trial_days                  INTEGER NOT NULL DEFAULT 30,
    max_properties_per_corporate INTEGER NOT NULL DEFAULT 50,
    max_supplier_listing_fee    NUMERIC(10, 2) NOT NULL DEFAULT 5000.00,
    updated_at                  TIMESTAMPTZ DEFAULT now(),
    created_at                  TIMESTAMPTZ DEFAULT now()
);

INSERT INTO platform_config (legal_name, commercial_register_number, tax_id)
    VALUES ('HotelsVendors', 'PENDING', 'PENDING')
ON CONFLICT DO NOTHING;

ALTER TABLE platform_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY platform_config_read ON platform_config FOR SELECT TO authenticated USING (true);
CREATE POLICY platform_config_write ON platform_config FOR ALL TO service_role USING (true);

COMMIT;
