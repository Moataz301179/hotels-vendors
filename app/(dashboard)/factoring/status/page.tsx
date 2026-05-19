"use client";

/**
 * Factoring Application Status Page
 * 
 * Hotels can track their pre-qualification application status
 * and view their approved credit facility once approved.
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  CreditCard,
  TrendingUp,
  FileText,
  ChevronRight,
  RefreshCw,
  Wallet
} from "lucide-react";
import { ButtonEnterprise } from "@/components/ui/button-enterprise";
import { CardEnterprise } from "@/components/ui/card-enterprise";
import { StatusBadge } from "@/components/ui/status-badge";

type ApplicationStatus = "PENDING" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "NEEDS_INFO";

interface ApplicationData {
  id: string;
  status: ApplicationStatus;
  submittedAt: string;
  reviewedAt?: string;
  hotelName: string;
  monthlyProcurement: number;
  creditFacility?: {
    approvedAmount: number;
    utilizedAmount: number;
    availableAmount: number;
    interestRate: number;
    termDays: number;
  };
  reviewNotes?: string;
  nextSteps?: string[];
}

const STATUS_STEPS = [
  { id: "PENDING", label: "Application Received", description: "Your application is in queue" },
  { id: "UNDER_REVIEW", label: "Under Review", description: "Our team is verifying your documents" },
  { id: "APPROVED", label: "Approved", description: "Credit facility activated" },
  { id: "ACTIVE", label: "Active", description: "Ready for factoring" },
];

export default function FactoringStatusPage() {
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicationStatus();
  }, []);

  const fetchApplicationStatus = async () => {
    try {
      const response = await fetch("/api/v1/factoring/status");
      if (response.ok) {
        const data = await response.json();
        setApplication(data);
      } else {
        setError("Failed to load application status");
      }
    } catch (err) {
      setError("Network error - please try again");
    } finally {
      setIsLoading(false);
    }
  };

  // Demo data for preview
  const demoApplication: ApplicationData = {
    id: "FAC-2024-001",
    status: "APPROVED",
    submittedAt: "2024-01-15T10:30:00Z",
    reviewedAt: "2024-01-17T14:20:00Z",
    hotelName: "Nile Hilton Hotel",
    monthlyProcurement: 750000,
    creditFacility: {
      approvedAmount: 2000000,
      utilizedAmount: 450000,
      availableAmount: 1550000,
      interestRate: 2.5,
      termDays: 90,
    },
    reviewNotes: "Strong financial history. Approved for maximum facility based on monthly procurement volume.",
    nextSteps: [
      "Complete supplier onboarding",
      "Submit first invoice for factoring",
      "Set up automatic payment preferences",
    ],
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
      </div>
    );
  }

  // Use demo data for now
  const data = application || demoApplication;
  const currentStepIndex = STATUS_STEPS.findIndex(s => s.id === data.status);

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0a0a10]">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-6 h-6 text-indigo-400" />
              <div>
                <h1 className="text-xl font-semibold">Factoring Status</h1>
                <p className="text-white/50 text-sm">{data.hotelName}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <ButtonEnterprise variant="secondary" size="sm" onClick={fetchApplicationStatus}>
                <RefreshCw className="w-4 h-4 mr-1" /> Refresh
              </ButtonEnterprise>
              <StatusBadge 
                variant={
                  data.status === "APPROVED" ? "success" :
                  data.status === "REJECTED" ? "error" :
                  data.status === "UNDER_REVIEW" ? "warning" : "info"
                }
              >
                {data.status.replace("_", " ")}
              </StatusBadge>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Status */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Tracker */}
            <CardEnterprise variant="elevated" className="p-6">
              <h2 className="text-lg font-medium mb-6">Application Progress</h2>
              <div className="relative">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
                    style={{ width: `${((currentStepIndex + 1) / STATUS_STEPS.length) * 100}%` }}
                  />
                </div>
                
                {/* Steps */}
                <div className="relative flex justify-between">
                  {STATUS_STEPS.map((step, index) => {
                    const isCompleted = index <= currentStepIndex;
                    const isCurrent = index === currentStepIndex;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <motion.div
                          initial={false}
                          animate={{ 
                            scale: isCurrent ? 1.1 : 1,
                            backgroundColor: isCompleted ? "#6366f1" : "#1a1a2e",
                          }}
                          className={`
                            w-10 h-10 rounded-full flex items-center justify-center
                            border-2 transition-colors duration-300 z-10
                            ${isCompleted ? "border-indigo-500" : "border-white/20"}
                            ${isCurrent ? "ring-4 ring-indigo-500/20" : ""}
                          `}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5 text-white" />
                          ) : (
                            <Clock className="w-5 h-5 text-white/40" />
                          )}
                        </motion.div>
                        <div className="mt-3 text-center">
                          <div className={`text-sm font-medium ${isCompleted ? "text-white" : "text-white/40"}`}>
                            {step.label}
                          </div>
                          <div className="text-xs text-white/30 mt-1 max-w-[120px]">
                            {step.description}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardEnterprise>

            {/* Credit Facility Card (if approved) */}
            {data.creditFacility && (
              <CardEnterprise variant="elevated" className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <h2 className="text-lg font-medium">Credit Facility</h2>
                      <p className="text-white/50 text-sm">Your approved working capital</p>
                    </div>
                  </div>
                  <ButtonEnterprise variant="primary" size="sm">
                    <TrendingUp className="w-4 h-4 mr-1" /> Request Increase
                  </ButtonEnterprise>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-white/40 mb-1">Approved Limit</div>
                    <div className="text-2xl font-bold text-white">
                      {data.creditFacility.approvedAmount.toLocaleString()} EGP
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-white/40 mb-1">Utilized</div>
                    <div className="text-2xl font-bold text-amber-400">
                      {data.creditFacility.utilizedAmount.toLocaleString()} EGP
                    </div>
                    <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-amber-400 rounded-full"
                        style={{ 
                          width: `${(data.creditFacility.utilizedAmount / data.creditFacility.approvedAmount) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="text-sm text-white/40 mb-1">Available</div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {data.creditFacility.availableAmount.toLocaleString()} EGP
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-indigo-400" />
                    <span className="text-white/60">Interest Rate:</span>
                    <span className="text-white font-medium">{data.creditFacility.interestRate}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-indigo-400" />
                    <span className="text-white/60">Payment Term:</span>
                    <span className="text-white font-medium">{data.creditFacility.termDays} days</span>
                  </div>
                </div>
              </CardEnterprise>
            )}

            {/* Review Notes */}
            {data.reviewNotes && (
              <CardEnterprise variant="elevated" className="p-6">
                <h2 className="text-lg font-medium mb-4">Review Notes</h2>
                <div className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
                  <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <p className="text-emerald-100">{data.reviewNotes}</p>
                </div>
              </CardEnterprise>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Summary */}
            <CardEnterprise variant="elevated" className="p-6">
              <h2 className="text-sm font-medium text-white/60 mb-4">Application Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Application ID</span>
                  <span className="text-white font-mono">{data.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Submitted</span>
                  <span className="text-white">
                    {new Date(data.submittedAt).toLocaleDateString("en-GB")}
                  </span>
                </div>
                {data.reviewedAt && (
                  <div className="flex justify-between">
                    <span className="text-white/40">Reviewed</span>
                    <span className="text-white">
                      {new Date(data.reviewedAt).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/40">Monthly Volume</span>
                  <span className="text-white">{data.monthlyProcurement.toLocaleString()} EGP</span>
                </div>
              </div>
            </CardEnterprise>

            {/* Next Steps */}
            {data.nextSteps && data.nextSteps.length > 0 && (
              <CardEnterprise variant="elevated" className="p-6">
                <h2 className="text-sm font-medium text-white/60 mb-4">Next Steps</h2>
                <div className="space-y-3">
                  {data.nextSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-indigo-400">{index + 1}</span>
                      </div>
                      <span className="text-sm text-white/80">{step}</span>
                    </div>
                  ))}
                </div>
                <ButtonEnterprise variant="primary" className="w-full mt-4">
                  Start Onboarding <ChevronRight className="w-4 h-4 ml-1" />
                </ButtonEnterprise>
              </CardEnterprise>
            )}

            {/* Quick Actions */}
            <CardEnterprise variant="elevated" className="p-6">
              <h2 className="text-sm font-medium text-white/60 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <ButtonEnterprise variant="secondary" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" /> View Documents
                </ButtonEnterprise>
                <ButtonEnterprise variant="secondary" className="w-full justify-start">
                  <Building2 className="w-4 h-4 mr-2" /> Update Business Info
                </ButtonEnterprise>
                <ButtonEnterprise variant="secondary" className="w-full justify-start">
                  <CreditCard className="w-4 h-4 mr-2" /> Payment Settings
                </ButtonEnterprise>
              </div>
            </CardEnterprise>

            {/* Support */}
            <CardEnterprise variant="elevated" className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-medium">Need Help?</span>
              </div>
              <p className="text-sm text-white/60 mb-4">
                Our factoring specialists are available to answer your questions.
              </p>
              <ButtonEnterprise variant="secondary" className="w-full">
                Contact Support
              </ButtonEnterprise>
            </CardEnterprise>
          </div>
        </div>
      </div>
    </div>
  );
}
