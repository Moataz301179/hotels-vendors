-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 13: RLS POLICIES & SEED DATA
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

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

-- Seed funder configs
INSERT INTO funder_configs (name, rate_min, rate_max, credit_limit, min_invoice) VALUES
    ('OLIV', 0.012, 0.015, 500000, 5000),
    ('ValU', 0.015, 0.018, 300000, 3000),
    ('CIB Factoring', 0.010, 0.012, 1000000, 10000),
    ('Fawry Business', 0.018, 0.021, 100000, 2000)
ON CONFLICT DO NOTHING;

COMMIT;
