-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 11: REPORTING & ANALYTICS VIEWS
-- Pre-built views for dashboards and regulatory reporting
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- 11a. Invoice pipeline view (the core dashboard)
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

-- 11b. Risk dashboard view
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

-- 11c. Revenue summary view
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

-- 11d. Procurement status view
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

COMMIT;
