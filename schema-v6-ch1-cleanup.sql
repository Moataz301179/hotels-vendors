-- ═══════════════════════════════════════════════════════════════════════════
-- HOTELSVENDORS v6 — CHAPTER 1: CLEAN SLATE
-- Drop v5 tables that assumed we hold money. We don't.
-- ═══════════════════════════════════════════════════════════════════════════

BEGIN;

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

COMMIT;
