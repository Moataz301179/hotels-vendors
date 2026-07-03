-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 8: PROCUREMENT LOCK-LOOP TRACKING
-- Complete purchase-to-payment cycle, locked and tracked.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

-- Extend orders with procurement state tracking
ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS procurement_state procurement_state DEFAULT 'draft',
    ADD COLUMN IF NOT EXISTS procurement_state_changed_at TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS procurement_state_changed_by UUID REFERENCES public.users(id),
    ADD COLUMN IF NOT EXISTS expected_payment_date DATE,
    ADD COLUMN IF NOT EXISTS actual_payment_date DATE,
    ADD COLUMN IF NOT EXISTS payment_confirmation_source TEXT,
    ADD COLUMN IF NOT EXISTS payment_reference TEXT;

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

COMMIT;
