-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 2: ENUM TYPES
-- Orchestrator-specific state enums
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'entity_status') THEN
        CREATE TYPE entity_status AS ENUM (
            'pending_verification', 'documents_submitted', 'under_review',
            'verified_active', 'verified_limited', 'suspended', 'deactivated'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_qualification') THEN
        CREATE TYPE invoice_qualification AS ENUM (
            'pending_documents', 'pending_eta', 'pending_delivery_signoff',
            'compliance_review', 'qualified', 'rejected', 'expired', 'withdrawn'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'factoring_match_status') THEN
        CREATE TYPE factoring_match_status AS ENUM (
            'not_submitted', 'submitted_to_funder', 'bidding_open',
            'bids_received', 'bid_accepted', 'funded', 'declined_by_funders',
            'withdrawn', 'expired'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_band') THEN
        CREATE TYPE risk_band AS ENUM ('low', 'medium', 'high', 'critical', 'prohibited');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_tier') THEN
        CREATE TYPE subscription_tier AS ENUM (
            'starter', 'growth', 'professional', 'enterprise'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM (
            'trial', 'active', 'past_due', 'paused', 'cancelled', 'expired'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'compliance_check_result') THEN
        CREATE TYPE compliance_check_result AS ENUM ('pass', 'fail', 'manual_review', 'not_applicable');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'procurement_state') THEN
        CREATE TYPE procurement_state AS ENUM (
            'draft', 'pending_approval', 'approved', 'ordered', 'shipped',
            'delivered', 'delivery_verified', 'invoice_submitted', 'invoice_validated',
            'factoring_pending', 'factoring_matched', 'payment_initiated',
            'payment_confirmed', 'completed', 'disputed', 'cancelled'
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_severity') THEN
        CREATE TYPE alert_severity AS ENUM ('info', 'low', 'medium', 'high', 'critical');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'alert_status') THEN
        CREATE TYPE alert_status AS ENUM ('open', 'acknowledged', 'investigating', 'resolved', 'dismissed');
    END IF;
END $$;

COMMIT;
