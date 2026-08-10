export type AlertSeverity = "low" | "medium" | "high" | "critical";
export type AlertStatus = "open" | "acknowledged" | "resolved";
export type ComplianceCheckResult = "pass" | "fail" | "not_applicable";
export type EntityStatus =
  | "pending_verification"
  | "verified"
  | "suspended"
  | "blacklisted";
export type RiskBand = "low" | "medium" | "high" | "critical";
export type FactoringMatchStatus =
  | "not_submitted"
  | "submitted"
  | "matched"
  | "funded"
  | "rejected";
export type InvoiceQualification =
  | "pending_documents"
  | "qualified"
  | "rejected"
  | "expired";
export type ProcurementState =
  | "draft"
  | "pending_approval"
  | "approved"
  | "ordered"
  | "shipped"
  | "delivered"
  | "invoiced"
  | "paid"
  | "disputed"
  | "cancelled";
export type SubscriptionStatus =
  | "trial"
  | "active"
  | "past_due"
  | "cancelled"
  | "expired";
export type SubscriptionTier = "starter" | "professional" | "growth" | "enterprise";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          company_name: string | null;
          role: string | null;
          tenant_type: string;
          user_role: string;
          hotel_id: string | null;
          supplier_id: string | null;
          funder_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          company_name?: string | null;
          role?: string | null;
          tenant_type?: string;
          user_role?: string;
          hotel_id?: string | null;
          supplier_id?: string | null;
          funder_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          company_name?: string | null;
          role?: string | null;
          tenant_type?: string;
          user_role?: string;
          hotel_id?: string | null;
          supplier_id?: string | null;
          funder_id?: string | null;
          created_at?: string;
        };
      };
      hotels: {
        Row: {
          id: string;
          name: string;
          location: string | null;
          stars: number | null;
          credit_limit: number;
          credit_used: number;
          owner_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location?: string | null;
          stars?: number | null;
          credit_limit?: number;
          credit_used?: number;
          owner_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string | null;
          stars?: number | null;
          credit_limit?: number;
          credit_used?: number;
          owner_id?: string | null;
          created_at?: string;
        };
      };
      suppliers: {
        Row: {
          id: string;
          name: string;
          category: string | null;
          location: string | null;
          hs_code: string | null;
          rating: number | null;
          verified: boolean;
          credit_limit: number;
          credit_used: number;
          owner_user_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category?: string | null;
          location?: string | null;
          hs_code?: string | null;
          rating?: number | null;
          verified?: boolean;
          credit_limit?: number;
          credit_used?: number;
          owner_user_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string | null;
          location?: string | null;
          hs_code?: string | null;
          rating?: number | null;
          verified?: boolean;
          credit_limit?: number;
          credit_used?: number;
          owner_user_id?: string | null;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          hotel_id: string;
          supplier_id: string;
          total_value: number;
          currency: string;
          procurement_state: string;
          procurement_state_changed_at: string | null;
          procurement_state_changed_by: string | null;
          maker_user_id: string | null;
          checker_user_id: string | null;
          checker_approved: boolean;
          expected_payment_date: string | null;
          actual_payment_date: string | null;
          payment_reference: string | null;
          payment_confirmation_source: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hotel_id: string;
          supplier_id: string;
          total_value: number;
          currency?: string;
          procurement_state?: string;
          procurement_state_changed_at?: string | null;
          procurement_state_changed_by?: string | null;
          maker_user_id?: string | null;
          checker_user_id?: string | null;
          checker_approved?: boolean;
          expected_payment_date?: string | null;
          actual_payment_date?: string | null;
          payment_reference?: string | null;
          payment_confirmation_source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hotel_id?: string;
          supplier_id?: string;
          total_value?: number;
          currency?: string;
          procurement_state?: string;
          procurement_state_changed_at?: string | null;
          procurement_state_changed_by?: string | null;
          maker_user_id?: string | null;
          checker_user_id?: string | null;
          checker_approved?: boolean;
          expected_payment_date?: string | null;
          actual_payment_date?: string | null;
          payment_reference?: string | null;
          payment_confirmation_source?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoices: {
        Row: {
          id: string;
          order_id: string | null;
          hotel_id: string;
          supplier_id: string;
          face_value: number;
          currency: string;
          issue_date: string | null;
          due_date: string | null;
          workflow_state: string;
          qualification_status: string;
          qualification_score: number | null;
          qualification_date: string | null;
          qualification_notes: string | null;
          qualified_at: string | null;
          delivery_signed_off: boolean;
          delivery_signed_at: string | null;
          delivery_signer_id: string | null;
          fraud_gate_status: string;
          fraud_gate_reason: string | null;
          eta_status: string;
          eta_uuid: string | null;
          eta_qr_code: string | null;
          eta_submission_date: string | null;
          eta_acknowledgment_id: string | null;
          rsa_signature: string | null;
          signed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          hotel_id: string;
          supplier_id: string;
          face_value: number;
          currency?: string;
          issue_date?: string | null;
          due_date?: string | null;
          workflow_state?: string;
          qualification_status?: string;
          qualification_score?: number | null;
          qualification_date?: string | null;
          qualification_notes?: string | null;
          qualified_at?: string | null;
          delivery_signed_off?: boolean;
          delivery_signed_at?: string | null;
          delivery_signer_id?: string | null;
          fraud_gate_status?: string;
          fraud_gate_reason?: string | null;
          eta_status?: string;
          eta_uuid?: string | null;
          eta_qr_code?: string | null;
          eta_submission_date?: string | null;
          eta_acknowledgment_id?: string | null;
          rsa_signature?: string | null;
          signed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          hotel_id?: string;
          supplier_id?: string;
          face_value?: number;
          currency?: string;
          issue_date?: string | null;
          due_date?: string | null;
          workflow_state?: string;
          qualification_status?: string;
          qualification_score?: number | null;
          qualification_date?: string | null;
          qualification_notes?: string | null;
          qualified_at?: string | null;
          delivery_signed_off?: boolean;
          delivery_signed_at?: string | null;
          delivery_signer_id?: string | null;
          fraud_gate_status?: string;
          fraud_gate_reason?: string | null;
          eta_status?: string;
          eta_uuid?: string | null;
          eta_qr_code?: string | null;
          eta_submission_date?: string | null;
          eta_acknowledgment_id?: string | null;
          rsa_signature?: string | null;
          signed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invoice_qualification_details: {
        Row: {
          id: string;
          invoice_id: string;
          status: string;
          compliance_score: number | null;
          invoice_integrity_score: number | null;
          invoice_risk_score: number | null;
          hotel_credit_score: number | null;
          supplier_trust_score: number | null;
          delivery_signed_off: string;
          delivery_verified_at: string | null;
          eta_uuid_present: string;
          eta_uuid_verified: boolean;
          eta_verified_at: string | null;
          factoring_eligible: boolean;
          max_factoring_amount: number | null;
          recommended_take_rate: number | null;
          risk_factors: unknown | null;
          qualified_at: string | null;
          rejected_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          status?: string;
          compliance_score?: number | null;
          invoice_integrity_score?: number | null;
          invoice_risk_score?: number | null;
          hotel_credit_score?: number | null;
          supplier_trust_score?: number | null;
          delivery_signed_off?: string;
          delivery_verified_at?: string | null;
          eta_uuid_present?: string;
          eta_uuid_verified?: boolean;
          eta_verified_at?: string | null;
          factoring_eligible?: boolean;
          max_factoring_amount?: number | null;
          recommended_take_rate?: number | null;
          risk_factors?: unknown | null;
          qualified_at?: string | null;
          rejected_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          status?: string;
          compliance_score?: number | null;
          invoice_integrity_score?: number | null;
          invoice_risk_score?: number | null;
          hotel_credit_score?: number | null;
          supplier_trust_score?: number | null;
          delivery_signed_off?: string;
          delivery_verified_at?: string | null;
          eta_uuid_present?: string;
          eta_uuid_verified?: boolean;
          eta_verified_at?: string | null;
          factoring_eligible?: boolean;
          max_factoring_amount?: number | null;
          recommended_take_rate?: number | null;
          risk_factors?: unknown | null;
          qualified_at?: string | null;
          rejected_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      factoring_requests: {
        Row: {
          id: string;
          invoice_id: string;
          hotel_id: string;
          face_value: number;
          creditor_name: string | null;
          debtor_name: string | null;
          maturity_date: string | null;
          status: string;
          match_status: string;
          match_score: number | null;
          selected_bid_id: string | null;
          selected_funder_id: string | null;
          submitted_to_funders_at: string | null;
          bidding_closed_at: string | null;
          funded_at: string | null;
          funding_confirmed: boolean;
          funding_confirmation_source: string | null;
          closed_at: string | null;
          orchestrator_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          hotel_id: string;
          face_value: number;
          creditor_name?: string | null;
          debtor_name?: string | null;
          maturity_date?: string | null;
          status?: string;
          match_status?: string;
          match_score?: number | null;
          selected_bid_id?: string | null;
          selected_funder_id?: string | null;
          submitted_to_funders_at?: string | null;
          bidding_closed_at?: string | null;
          funded_at?: string | null;
          funding_confirmed?: boolean;
          funding_confirmation_source?: string | null;
          closed_at?: string | null;
          orchestrator_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          hotel_id?: string;
          face_value?: number;
          creditor_name?: string | null;
          debtor_name?: string | null;
          maturity_date?: string | null;
          status?: string;
          match_status?: string;
          match_score?: number | null;
          selected_bid_id?: string | null;
          selected_funder_id?: string | null;
          submitted_to_funders_at?: string | null;
          bidding_closed_at?: string | null;
          funded_at?: string | null;
          funding_confirmed?: boolean;
          funding_confirmation_source?: string | null;
          closed_at?: string | null;
          orchestrator_notes?: string | null;
          created_at?: string;
        };
      };
      factoring_bids: {
        Row: {
          id: string;
          request_id: string;
          funder_name: string | null;
          offered_amount: number | null;
          offered_rate: number | null;
          status: string;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          funder_name?: string | null;
          offered_amount?: number | null;
          offered_rate?: number | null;
          status?: string;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          funder_name?: string | null;
          offered_amount?: number | null;
          offered_rate?: number | null;
          status?: string;
          expires_at?: string | null;
          created_at?: string;
        };
      };
      funder_configs: {
        Row: {
          id: string;
          name: string | null;
          is_active: boolean;
          credit_limit: number | null;
          min_invoice: number | null;
          rate_min: number | null;
          rate_max: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          is_active?: boolean;
          credit_limit?: number | null;
          min_invoice?: number | null;
          rate_min?: number | null;
          rate_max?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          is_active?: boolean;
          credit_limit?: number | null;
          min_invoice?: number | null;
          rate_min?: number | null;
          rate_max?: number | null;
          created_at?: string;
        };
      };
      funder_performance: {
        Row: {
          id: string;
          funder_id: string;
          period_month: string | null;
          invoices_submitted: number;
          invoices_funded: number;
          bids_received: number;
          bids_accepted: number;
          total_funded_amount: number | null;
          avg_bid_rate: number | null;
          avg_response_time_ms: number | null;
          api_uptime_pct: number;
          overall_score: number;
          competitiveness_score: number;
          reliability_score: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          funder_id: string;
          period_month?: string | null;
          invoices_submitted?: number;
          invoices_funded?: number;
          bids_received?: number;
          bids_accepted?: number;
          total_funded_amount?: number | null;
          avg_bid_rate?: number | null;
          avg_response_time_ms?: number | null;
          api_uptime_pct?: number;
          overall_score?: number;
          competitiveness_score?: number;
          reliability_score?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          funder_id?: string;
          period_month?: string | null;
          invoices_submitted?: number;
          invoices_funded?: number;
          bids_received?: number;
          bids_accepted?: number;
          total_funded_amount?: number | null;
          avg_bid_rate?: number | null;
          avg_response_time_ms?: number | null;
          api_uptime_pct?: number;
          overall_score?: number;
          competitiveness_score?: number;
          reliability_score?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      funder_api_log: {
        Row: {
          id: string;
          funder_id: string;
          factoring_request_id: string | null;
          invoice_id: string | null;
          request_type: string | null;
          request_payload: unknown | null;
          response_payload: unknown | null;
          http_status_code: number | null;
          success: boolean;
          error_message: string | null;
          duration_ms: number | null;
          requested_at: string;
          responded_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          funder_id: string;
          factoring_request_id?: string | null;
          invoice_id?: string | null;
          request_type?: string | null;
          request_payload?: unknown | null;
          response_payload?: unknown | null;
          http_status_code?: number | null;
          success?: boolean;
          error_message?: string | null;
          duration_ms?: number | null;
          requested_at?: string;
          responded_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          funder_id?: string;
          factoring_request_id?: string | null;
          invoice_id?: string | null;
          request_type?: string | null;
          request_payload?: unknown | null;
          response_payload?: unknown | null;
          http_status_code?: number | null;
          success?: boolean;
          error_message?: string | null;
          duration_ms?: number | null;
          requested_at?: string;
          responded_at?: string | null;
          created_at?: string;
        };
      };
      success_fees: {
        Row: {
          id: string;
          invoice_id: string;
          hotel_id: string;
          funder_id: string | null;
          factoring_request_id: string | null;
          invoice_face_value: number | null;
          fee_amount_egp: number | null;
          take_rate: number | null;
          service_fee_type: string;
          fee_label: string;
          status: string;
          invoiced_to: string | null;
          invoiced_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invoice_id: string;
          hotel_id: string;
          funder_id?: string | null;
          factoring_request_id?: string | null;
          invoice_face_value?: number | null;
          fee_amount_egp?: number | null;
          take_rate?: number | null;
          service_fee_type?: string;
          fee_label?: string;
          status?: string;
          invoiced_to?: string | null;
          invoiced_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          invoice_id?: string;
          hotel_id?: string;
          funder_id?: string | null;
          factoring_request_id?: string | null;
          invoice_face_value?: number | null;
          fee_amount_egp?: number | null;
          take_rate?: number | null;
          service_fee_type?: string;
          fee_label?: string;
          status?: string;
          invoiced_to?: string | null;
          invoiced_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invo_subscriptions: {
        Row: {
          id: string;
          supplier_id: string;
          tier: string;
          status: string;
          monthly_fee_egp: number | null;
          trial_started_at: string;
          trial_ends_at: string;
          current_period_start: string;
          current_period_end: string;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          tier?: string;
          status?: string;
          monthly_fee_egp?: number | null;
          trial_started_at?: string;
          trial_ends_at?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          tier?: string;
          status?: string;
          monthly_fee_egp?: number | null;
          trial_started_at?: string;
          trial_ends_at?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          hotel_id: string;
          tier: string;
          status: string;
          property_count: number;
          price_per_property_egp: number | null;
          monthly_total_egp: number | null;
          trial_started_at: string;
          trial_ends_at: string;
          current_period_start: string;
          current_period_end: string;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          hotel_id: string;
          tier?: string;
          status?: string;
          property_count?: number;
          price_per_property_egp?: number | null;
          monthly_total_egp?: number | null;
          trial_started_at?: string;
          trial_ends_at?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          hotel_id?: string;
          tier?: string;
          status?: string;
          property_count?: number;
          price_per_property_egp?: number | null;
          monthly_total_egp?: number | null;
          trial_started_at?: string;
          trial_ends_at?: string;
          current_period_start?: string;
          current_period_end?: string;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      supplier_listing_fees: {
        Row: {
          id: string;
          supplier_id: string;
          amount_egp: number | null;
          fee_type: string | null;
          status: string;
          valid_until: string | null;
          invoiced_at: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          supplier_id: string;
          amount_egp?: number | null;
          fee_type?: string | null;
          status?: string;
          valid_until?: string | null;
          invoiced_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          supplier_id?: string;
          amount_egp?: number | null;
          fee_type?: string | null;
          status?: string;
          valid_until?: string | null;
          invoiced_at?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      procurement_transitions: {
        Row: {
          id: string;
          order_id: string | null;
          invoice_id: string | null;
          from_state: string;
          to_state: string;
          transitioned_by: string | null;
          transition_reason: string | null;
          metadata: unknown | null;
          transitioned_at: string;
        };
        Insert: {
          id?: string;
          order_id?: string | null;
          invoice_id?: string | null;
          from_state: string;
          to_state: string;
          transitioned_by?: string | null;
          transition_reason?: string | null;
          metadata?: unknown | null;
          transitioned_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string | null;
          invoice_id?: string | null;
          from_state?: string;
          to_state?: string;
          transitioned_by?: string | null;
          transition_reason?: string | null;
          metadata?: unknown | null;
          transitioned_at?: string;
        };
      };
      grn_records: {
        Row: {
          id: string;
          order_id: string;
          invoice_id: string | null;
          received_by: string | null;
          delivery_date: string | null;
          delivery_condition: string;
          items_received: unknown | null;
          items_rejected: unknown | null;
          signed_off: boolean;
          signed_off_at: string | null;
          signed_off_by: string | null;
          dispute_raised: boolean;
          dispute_reason: string | null;
          dispute_resolved_at: string | null;
          dispute_window_start: string | null;
          dispute_window_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          invoice_id?: string | null;
          received_by?: string | null;
          delivery_date?: string | null;
          delivery_condition?: string;
          items_received?: unknown | null;
          items_rejected?: unknown | null;
          signed_off?: boolean;
          signed_off_at?: string | null;
          signed_off_by?: string | null;
          dispute_raised?: boolean;
          dispute_reason?: string | null;
          dispute_resolved_at?: string | null;
          dispute_window_start?: string | null;
          dispute_window_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          invoice_id?: string | null;
          received_by?: string | null;
          delivery_date?: string | null;
          delivery_condition?: string;
          items_received?: unknown | null;
          items_rejected?: unknown | null;
          signed_off?: boolean;
          signed_off_at?: string | null;
          signed_off_by?: string | null;
          dispute_raised?: boolean;
          dispute_reason?: string | null;
          dispute_resolved_at?: string | null;
          dispute_window_start?: string | null;
          dispute_window_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      agent_audit_log: {
        Row: {
          log_id: string;
          agent_name: string;
          action_executed: string;
          invoice_id: string | null;
          previous_state: string | null;
          new_state: string | null;
          cryptographic_signature: string | null;
          metadata: unknown | null;
          created_at: string;
        };
        Insert: {
          log_id?: string;
          agent_name: string;
          action_executed: string;
          invoice_id?: string | null;
          previous_state?: string | null;
          new_state?: string | null;
          cryptographic_signature?: string | null;
          metadata?: unknown | null;
          created_at?: string;
        };
        Update: {
          log_id?: string;
          agent_name?: string;
          action_executed?: string;
          invoice_id?: string | null;
          previous_state?: string | null;
          new_state?: string | null;
          cryptographic_signature?: string | null;
          metadata?: unknown | null;
          created_at?: string;
        };
      };
      alerts: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          alert_type: string | null;
          severity: string;
          status: string;
          entity_type: string | null;
          entity_id: string | null;
          hotel_id: string | null;
          invoice_id: string | null;
          order_id: string | null;
          assigned_to: string | null;
          resolved_by: string | null;
          resolved_at: string | null;
          resolution_notes: string | null;
          details: unknown | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          alert_type?: string | null;
          severity?: string;
          status?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          hotel_id?: string | null;
          invoice_id?: string | null;
          order_id?: string | null;
          assigned_to?: string | null;
          resolved_by?: string | null;
          resolved_at?: string | null;
          resolution_notes?: string | null;
          details?: unknown | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          alert_type?: string | null;
          severity?: string;
          status?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          hotel_id?: string | null;
          invoice_id?: string | null;
          order_id?: string | null;
          assigned_to?: string | null;
          resolved_by?: string | null;
          resolved_at?: string | null;
          resolution_notes?: string | null;
          details?: unknown | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      compliance_checks: {
        Row: {
          id: string;
          check_type: string;
          entity_type: string | null;
          entity_id: string | null;
          invoice_id: string | null;
          result: string;
          details: unknown | null;
          checked_by: string | null;
          checked_at: string;
          resolved_by: string | null;
          resolved_at: string | null;
          resolution_notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          check_type: string;
          entity_type?: string | null;
          entity_id?: string | null;
          invoice_id?: string | null;
          result: string;
          details?: unknown | null;
          checked_by?: string | null;
          checked_at?: string;
          resolved_by?: string | null;
          resolved_at?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          check_type?: string;
          entity_type?: string | null;
          entity_id?: string | null;
          invoice_id?: string | null;
          result?: string;
          details?: unknown | null;
          checked_by?: string | null;
          checked_at?: string;
          resolved_by?: string | null;
          resolved_at?: string | null;
          resolution_notes?: string | null;
          created_at?: string;
        };
      };
      entity_risk_profiles: {
        Row: {
          id: string;
          entity_id: string;
          entity_type: string;
          status: string;
          risk_band: string;
          overall_risk_score: number;
          compliance_score: number;
          financial_score: number;
          operational_score: number;
          reputation_score: number;
          risk_factors: unknown | null;
          pep_screened: boolean;
          pep_screened_at: string | null;
          pep_status: string;
          sanctions_screened: boolean;
          sanctions_screened_at: string | null;
          sanctions_status: string;
          commercial_register_verified: boolean;
          commercial_register_verified_at: string | null;
          tax_id_verified: boolean;
          tax_id_verified_at: string | null;
          last_review_date: string | null;
          next_review_date: string | null;
          review_frequency_months: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          entity_id: string;
          entity_type: string;
          status?: string;
          risk_band?: string;
          overall_risk_score?: number;
          compliance_score?: number;
          financial_score?: number;
          operational_score?: number;
          reputation_score?: number;
          risk_factors?: unknown | null;
          pep_screened?: boolean;
          pep_screened_at?: string | null;
          pep_status?: string;
          sanctions_screened?: boolean;
          sanctions_screened_at?: string | null;
          sanctions_status?: string;
          commercial_register_verified?: boolean;
          commercial_register_verified_at?: string | null;
          tax_id_verified?: boolean;
          tax_id_verified_at?: string | null;
          last_review_date?: string | null;
          next_review_date?: string | null;
          review_frequency_months?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          entity_id?: string;
          entity_type?: string;
          status?: string;
          risk_band?: string;
          overall_risk_score?: number;
          compliance_score?: number;
          financial_score?: number;
          operational_score?: number;
          reputation_score?: number;
          risk_factors?: unknown | null;
          pep_screened?: boolean;
          pep_screened_at?: string | null;
          pep_status?: string;
          sanctions_screened?: boolean;
          sanctions_screened_at?: string | null;
          sanctions_status?: string;
          commercial_register_verified?: boolean;
          commercial_register_verified_at?: string | null;
          tax_id_verified?: boolean;
          tax_id_verified_at?: string | null;
          last_review_date?: string | null;
          next_review_date?: string | null;
          review_frequency_months?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: string | null;
          title: string | null;
          body: string | null;
          tenant_type: string | null;
          invoice_id: string | null;
          read: boolean;
          metadata: unknown | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type?: string | null;
          title?: string | null;
          body?: string | null;
          tenant_type?: string | null;
          invoice_id?: string | null;
          read?: boolean;
          metadata?: unknown | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string | null;
          title?: string | null;
          body?: string | null;
          tenant_type?: string | null;
          invoice_id?: string | null;
          read?: boolean;
          metadata?: unknown | null;
          created_at?: string;
        };
      };
      platform_config: {
        Row: {
          id: string;
          legal_name: string;
          legal_name_ar: string | null;
          commercial_register_number: string | null;
          tax_id: string | null;
          default_take_rate: number;
          min_take_rate: number;
          max_take_rate: number;
          starter_price_egp: number;
          professional_price_egp: number;
          growth_price_egp: number;
          enterprise_price_egp: number;
          trial_days: number;
          max_properties_per_corporate: number;
          invo_listing_fee_starter: number;
          invo_listing_fee_professional: number;
          invo_listing_fee_growth: number;
          invo_listing_fee_enterprise: number;
          max_supplier_listing_fee: number;
          factoring_service_fee_min: number;
          factoring_service_fee_max: number;
          large_transaction_threshold: number;
          fraud_velocity_window_hours: number;
          fraud_velocity_multiplier: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          legal_name?: string;
          legal_name_ar?: string | null;
          commercial_register_number?: string | null;
          tax_id?: string | null;
          default_take_rate?: number;
          min_take_rate?: number;
          max_take_rate?: number;
          starter_price_egp?: number;
          professional_price_egp?: number;
          growth_price_egp?: number;
          enterprise_price_egp?: number;
          trial_days?: number;
          max_properties_per_corporate?: number;
          invo_listing_fee_starter?: number;
          invo_listing_fee_professional?: number;
          invo_listing_fee_growth?: number;
          invo_listing_fee_enterprise?: number;
          max_supplier_listing_fee?: number;
          factoring_service_fee_min?: number;
          factoring_service_fee_max?: number;
          large_transaction_threshold?: number;
          fraud_velocity_window_hours?: number;
          fraud_velocity_multiplier?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          legal_name?: string;
          legal_name_ar?: string | null;
          commercial_register_number?: string | null;
          tax_id?: string | null;
          default_take_rate?: number;
          min_take_rate?: number;
          max_take_rate?: number;
          starter_price_egp?: number;
          professional_price_egp?: number;
          growth_price_egp?: number;
          enterprise_price_egp?: number;
          trial_days?: number;
          max_properties_per_corporate?: number;
          invo_listing_fee_starter?: number;
          invo_listing_fee_professional?: number;
          invo_listing_fee_growth?: number;
          invo_listing_fee_enterprise?: number;
          max_supplier_listing_fee?: number;
          factoring_service_fee_min?: number;
          factoring_service_fee_max?: number;
          large_transaction_threshold?: number;
          fraud_velocity_window_hours?: number;
          fraud_velocity_multiplier?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      webhook_secrets: {
        Row: {
          id: string;
          service: string | null;
          secret_key: string | null;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          service?: string | null;
          secret_key?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          service?: string | null;
          secret_key?: string | null;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      v_invoice_pipeline: {
        Row: {
          invoice_id: string | null;
          hotel_id: string | null;
          hotel_name: string | null;
          supplier_name: string | null;
          supplier_verified: boolean | null;
          face_value: number | null;
          currency: string | null;
          issue_date: string | null;
          due_date: string | null;
          days_past_due: number | null;
          procurement_state: string | null;
          qualification_status: string | null;
          invoice_risk_score: number | null;
          fraud_gate_status: string | null;
          eta_status: string | null;
          eta_uuid: string | null;
          delivery_signed_off: boolean | null;
          factoring_eligible: boolean | null;
          match_status: string | null;
          selected_funder_id: string | null;
          selected_funder_name: string | null;
          accepted_bid_amount: number | null;
          accepted_bid_rate: number | null;
          recommended_take_rate: number | null;
        };
      };
      v_procurement_status: {
        Row: {
          order_id: string | null;
          order_date: string | null;
          hotel_name: string | null;
          supplier_name: string | null;
          total_value: number | null;
          currency: string | null;
          procurement_state: string | null;
          maker_user_id: string | null;
          checker_user_id: string | null;
          checker_approved: boolean | null;
          invoice_id: string | null;
          invoice_amount: number | null;
          qualification_status: string | null;
          grn_date: string | null;
          grn_signed: boolean | null;
          dispute_raised: boolean | null;
          factoring_eligible: boolean | null;
          match_status: string | null;
        };
      };
      v_revenue_summary: {
        Row: {
          hotel_id: string | null;
          period_start: string | null;
          period_end: string | null;
          revenue_type: string | null;
          amount_egp: number | null;
          status: string | null;
        };
      };
      v_risk_dashboard: {
        Row: {
          entity_id: string | null;
          entity_name: string | null;
          entity_type: string | null;
          status: string | null;
          risk_band: string | null;
          overall_risk_score: number | null;
          compliance_score: number | null;
          financial_score: number | null;
          operational_score: number | null;
          reputation_score: number | null;
          risk_factors: unknown | null;
          next_review_date: string | null;
        };
      };
    };
    Functions: {
      agent_1_ingestion: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      agent_2_compliance: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      agent_3_signoff: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      agent_4_routing: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      agent_atomic_transition: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      run_agent_swarm: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      calculate_factoring_revenue: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      calculate_invoice_qualification: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
      transition_procurement_state: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];
