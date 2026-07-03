-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 12: HELPER FUNCTIONS
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- 12a. Calculate invoice qualification score
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
    JOIN hotels h ON h.id = i.hotel_id
    LEFT JOIN entity_risk_profiles erp ON erp.entity_type = 'property' AND erp.entity_id = h.id
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

-- 12b. Update procurement state with validation
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

-- 12c. Auto-update risk band when score changes
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

-- 12d. Auto-update timestamps function
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

COMMIT;
