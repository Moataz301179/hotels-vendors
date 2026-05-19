"use client";

/**
 * Hotel Factoring Application Workflow - Phase 1
 * 
 * This page allows hotels to apply for pre-qualification
 * for reverse factoring services. The application collects:
 * - Monthly procurement amounts
 * - Payment frequency preferences
 * - Supporting documentation
 * 
 * The application feeds into the existing factoring queue.ts backend
 * through the admin review queue.
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  FileText,
  Calculator,
  Upload,
  AlertCircle,
  CheckCircle,
  ChevronRight,
  ChevronLeft,
  Building,
  TrendingUp,
  Calendar,
  FileCheck,
  Shield
} from "lucide-react";
import { ButtonEnterprise } from "@/components/ui/button-enterprise";
import { CardEnterprise } from "@/components/ui/card-enterprise";

// Application steps
const STEPS = [
  { id: "eligibility", label: "Eligibility Check", icon: Shield },
  { id: "business", label: "Business Info", icon: Building2 },
  { id: "financial", label: "Financial Details", icon: Calculator },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "review", label: "Review & Submit", icon: FileCheck },
];

// Egyptian hotel categories
const HOTEL_CATEGORIES = [
  { value: "luxury", label: "Luxury (5-Star)", minMonthly: 500000 },
  { value: "upscale", label: "Upscale (4-Star)", minMonthly: 300000 },
  { value: "midscale", label: "Midscale (3-Star)", minMonthly: 150000 },
  { value: "budget", label: "Budget/Economy", minMonthly: 50000 },
  { value: "resort", label: "Resort", minMonthly: 400000 },
  { value: "boutique", label: "Boutique Hotel", minMonthly: 100000 },
];

// Payment frequency options
const PAYMENT_FREQUENCIES = [
  { value: "monthly", label: "Monthly", description: "Pay suppliers every 30 days" },
  { value: "biweekly", label: "Bi-Weekly", description: "Pay suppliers every 14 days" },
  { value: "weekly", label: "Weekly", description: "Pay suppliers every 7 days" },
  { value: "on_demand", label: "On Demand", description: "Pay when cash flow allows" },
];

export default function FactoringApplicationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    // Eligibility
    hotelCategory: "",
    monthlyProcurementAmount: "",
    
    // Business Info
    companyName: "",
    taxId: "",
    commercialRegistration: "",
    yearsInOperation: "",
    numberOfRooms: "",
    
    // Financial
    preferredPaymentFrequency: "",
    averageInvoiceAmount: "",
    currentSuppliersCount: "",
    
    // Documents
    taxCardUrl: "",
    commercialRegistryUrl: "",
    bankStatementUrl: "",
    recentInvoicesUrl: "",
    
    // Additional
    notes: "",
    agreeToTerms: false,
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Submit to API
      const response = await fetch("/api/v1/factoring/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setIsComplete(true);
        setTimeout(() => {
          router.push("/factoring/status");
        }, 3000);
      }
    } catch (error) {
      console.error("Application submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if current step is valid
  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Eligibility
        return formData.hotelCategory && formData.monthlyProcurementAmount;
      case 1: // Business Info
        return formData.companyName && formData.taxId && formData.yearsInOperation;
      case 2: // Financial
        return formData.preferredPaymentFrequency;
      case 3: // Documents
        return formData.taxCardUrl && formData.commercialRegistryUrl;
      case 4: // Review
        return formData.agreeToTerms;
      default:
        return true;
    }
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center p-4">
        <CardEnterprise variant="elevated" className="max-w-md w-full text-center p-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h2 className="text-2xl font-bold text-white mb-4">
            Application Submitted Successfully
          </h2>
          <p className="text-white/60 mb-6">
            Your factoring pre-qualification application has been received. 
            Our team will review your documents and respond within 2-3 business days.
          </p>
          <ButtonEnterprise
            variant="primary"
            onClick={() => router.push("/factoring/status")}
          >
            Check Application Status
          </ButtonEnterprise>
        </CardEnterprise>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Header */}
      <div className="border-b border-white/[0.06] bg-[#0a0a10]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-indigo-400" />
            <h1 className="text-xl font-semibold">Factoring Pre-Qualification</h1>
          </div>
          <p className="text-white/50 text-sm">
            Apply for working capital solutions through our reverse factoring program
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-lg
                    transition-all duration-200
                    ${isCompleted ? "bg-emerald-500/20 text-emerald-400" : ""}
                    ${isActive ? "bg-indigo-500/20 text-indigo-400 ring-2 ring-indigo-500/40" : ""}
                    ${!isActive && !isCompleted ? "bg-white/5 text-white/30" : ""}
                  `}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`
                    ml-2 text-xs font-medium hidden sm:block
                    ${isActive ? "text-indigo-400" : ""}
                    ${isCompleted ? "text-emerald-400" : ""}
                    ${!isActive && !isCompleted ? "text-white/30" : ""}
                  `}
                >
                  {step.label}
                </span>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-white/10 mx-2" />
                )}
              </div>
            );
          })}
        </div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <CardEnterprise variant="elevated" className="p-6">
              {/* Step 1: Eligibility Check */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-1">Eligibility Check</h2>
                    <p className="text-white/50 text-sm">
                      Tell us about your hotel to check eligibility
                    </p>
                  </div>

                  {/* Hotel Category */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Hotel Category <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {HOTEL_CATEGORIES.map((category) => (
                        <button
                          key={category.value}
                          onClick={() => updateForm("hotelCategory", category.value)}
                          className={`
                            p-4 rounded-xl border text-left transition-all duration-200
                            ${formData.hotelCategory === category.value
                              ? "border-indigo-500/50 bg-indigo-500/10"
                              : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                            }
                          `}
                        >
                          <Building className="w-5 h-5 text-indigo-400 mb-2" />
                          <div className="text-sm font-medium">{category.label}</div>
                          <div className="text-xs text-white/40 mt-1">
                            Min: {category.minMonthly.toLocaleString()} EGP/mo
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monthly Procurement */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Average Monthly Procurement Amount (EGP) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.monthlyProcurementAmount}
                        onChange={(e) => updateForm("monthlyProcurementAmount", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/30"
                        placeholder="e.g., 500000"
                      />
                      <span className="absolute right-4 top-3 text-white/40">EGP</span>
                    </div>
                    <p className="text-xs text-white/40 mt-2">
                      This helps us determine your eligible credit facility
                    </p>
                  </div>

                  {/* Eligibility Note */}
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-4">
                    <p className="text-sm text-indigo-200">
                      <strong>Eligibility:</strong> Hotels with monthly procurement of 
                      50,000+ EGP and 2+ years in operation qualify for our factoring program.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Business Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-1">Business Information</h2>
                    <p className="text-white/50 text-sm">
                      Provide your hotel's legal and operational details
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Company Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) => updateForm("companyName", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                        placeholder="e.g., Nile Hilton Hotel"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Tax ID Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.taxId}
                        onChange={(e) => updateForm("taxId", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                        placeholder="123-456-789"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Commercial Registration
                      </label>
                      <input
                        type="text"
                        value={formData.commercialRegistration}
                        onChange={(e) => updateForm("commercialRegistration", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                        placeholder="Registration number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Years in Operation <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="number"
                        value={formData.yearsInOperation}
                        onChange={(e) => updateForm("yearsInOperation", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                        placeholder="e.g., 5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Number of Rooms
                      </label>
                      <input
                        type="number"
                        value={formData.numberOfRooms}
                        onChange={(e) => updateForm("numberOfRooms", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                        placeholder="e.g., 250"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Financial Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-1">Financial Details</h2>
                    <p className="text-white/50 text-sm">
                      Configure your preferred factoring terms
                    </p>
                  </div>

                  {/* Payment Frequency */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-3">
                      Preferred Payment Frequency <span className="text-red-400">*</span>
                    </label>
                    <div className="space-y-3">
                      {PAYMENT_FREQUENCIES.map((freq) => (
                        <button
                          key={freq.value}
                          onClick={() => updateForm("preferredPaymentFrequency", freq.value)}
                          className={`
                            w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-start gap-4
                            ${formData.preferredPaymentFrequency === freq.value
                              ? "border-indigo-500/50 bg-indigo-500/10"
                              : "border-white/10 bg-white/5 hover:bg-white/[0.07]"
                            }
                          `}
                        >
                          <Calendar className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-medium">{freq.label}</div>
                            <div className="text-sm text-white/40">{freq.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Average Invoice Amount (EGP)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          value={formData.averageInvoiceAmount}
                          onChange={(e) => updateForm("averageInvoiceAmount", e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                          placeholder="e.g., 50000"
                        />
                        <span className="absolute right-4 top-3 text-white/40">EGP</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Current Active Suppliers
                      </label>
                      <input
                        type="number"
                        value={formData.currentSuppliersCount}
                        onChange={(e) => updateForm("currentSuppliersCount", e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-indigo-500/50"
                        placeholder="e.g., 15"
                      />
                    </div>
                  </div>

                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                    <p className="text-sm text-amber-200">
                      <TrendingUp className="w-4 h-4 inline mr-1" />
                      <strong>Factoring Benefits:</strong> Get paid within 24-48 hours instead of 
                      waiting 60-90 days. We charge 2.5% platform fee + partner discount rate.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Documents */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-1">Supporting Documents</h2>
                    <p className="text-white/50 text-sm">
                      Upload required documents for verification
                    </p>
                  </div>

                  <div className="space-y-4">
                    {/* Tax Card */}
                    <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                            <div className="font-medium">Tax Card</div>
                            <div className="text-xs text-white/40">Required for verification</div>
                          </div>
                        </div>
                        <span className="text-red-400 text-xs">Required *</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.taxCardUrl}
                          onChange={(e) => updateForm("taxCardUrl", e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                          placeholder="Document URL or upload..."
                        />
                        <ButtonEnterprise variant="secondary" size="sm">
                          <Upload className="w-4 h-4 mr-1" /> Upload
                        </ButtonEnterprise>
                      </div>
                    </div>

                    {/* Commercial Registry */}
                    <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                            <Building className="w-5 h-5 text-indigo-400" />
                          </div>
                          <div>
                            <div className="font-medium">Commercial Registry</div>
                            <div className="text-xs text-white/40">Required for verification</div>
                          </div>
                        </div>
                        <span className="text-red-400 text-xs">Required *</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.commercialRegistryUrl}
                          onChange={(e) => updateForm("commercialRegistryUrl", e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                          placeholder="Document URL or upload..."
                        />
                        <ButtonEnterprise variant="secondary" size="sm">
                          <Upload className="w-4 h-4 mr-1" /> Upload
                        </ButtonEnterprise>
                      </div>
                    </div>

                    {/* Bank Statement */}
                    <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="font-medium">Bank Statement (Last 3 months)</div>
                            <div className="text-xs text-white/40">Optional but recommended</div>
                          </div>
                        </div>
                        <span className="text-white/40 text-xs">Optional</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.bankStatementUrl}
                          onChange={(e) => updateForm("bankStatementUrl", e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                          placeholder="Document URL or upload..."
                        />
                        <ButtonEnterprise variant="secondary" size="sm">
                          <Upload className="w-4 h-4 mr-1" /> Upload
                        </ButtonEnterprise>
                      </div>
                    </div>

                    {/* Recent Invoices */}
                    <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="font-medium">Sample Invoices (Last 3)</div>
                            <div className="text-xs text-white/40">Shows payment patterns</div>
                          </div>
                        </div>
                        <span className="text-white/40 text-xs">Optional</span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.recentInvoicesUrl}
                          onChange={(e) => updateForm("recentInvoicesUrl", e.target.value)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white"
                          placeholder="Document URL or upload..."
                        />
                        <ButtonEnterprise variant="secondary" size="sm">
                          <Upload className="w-4 h-4 mr-1" /> Upload
                        </ButtonEnterprise>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-white/40 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Documents will be securely stored and verified by our AI auditor
                  </div>
                </div>
              )}

              {/* Step 5: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium mb-1">Review & Submit</h2>
                    <p className="text-white/50 text-sm">
                      Review your application before submission
                    </p>
                  </div>

                  {/* Summary */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-white/60 mb-3">Business Information</h3>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-white/40">Company:</span>{" "}
                          <span className="text-white">{formData.companyName || "-"}</span>
                        </div>
                        <div>
                          <span className="text-white/40">Category:</span>{" "}
                          <span className="text-white">{formData.hotelCategory || "-"}</span>
                        </div>
                        <div>
                          <span className="text-white/40">Monthly Procurement:</span>{" "}
                          <span className="text-white">
                            {formData.monthlyProcurementAmount ? `${parseInt(formData.monthlyProcurementAmount).toLocaleString()} EGP` : "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/40">Years Operating:</span>{" "}
                          <span className="text-white">{formData.yearsInOperation || "-"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-white/60 mb-3">Factoring Preferences</h3>
                      <div className="grid sm:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-white/40">Payment Frequency:</span>{" "}
                          <span className="text-white capitalize">
                            {formData.preferredPaymentFrequency?.replace("_", " ") || "-"}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/40">Avg Invoice:</span>{" "}
                          <span className="text-white">
                            {formData.averageInvoiceAmount ? `${parseInt(formData.averageInvoiceAmount).toLocaleString()} EGP` : "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-white/60 mb-3">Documents</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          {formData.taxCardUrl ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={formData.taxCardUrl ? "text-white" : "text-white/40"}>
                            Tax Card {formData.taxCardUrl ? "" : "(missing)"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {formData.commercialRegistryUrl ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className={formData.commercialRegistryUrl ? "text-white" : "text-white/40"}>
                            Commercial Registry {formData.commercialRegistryUrl ? "" : "(missing)"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Terms */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={formData.agreeToTerms}
                      onChange={(e) => updateForm("agreeToTerms", e.target.checked)}
                      className="mt-1 w-4 h-4 rounded border-white/30 bg-white/5 text-indigo-500 focus:ring-indigo-500/30"
                    />
                    <label htmlFor="terms" className="text-sm text-white/70">
                      I confirm that all information provided is accurate and complete. 
                      I authorize Hotels Vendors to verify this information and conduct credit checks. 
                      I agree to the{" "}
                      <a href="#" className="text-indigo-400 hover:underline">Terms of Service</a>
                      {" "}and{" "}
                      <a href="#" className="text-indigo-400 hover:underline">Privacy Policy</a>.
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
                <ButtonEnterprise
                  variant="secondary"
                  onClick={handlePrevious}
                  disabled={currentStep === 0}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </ButtonEnterprise>

                {currentStep < STEPS.length - 1 ? (
                  <ButtonEnterprise
                    variant="primary"
                    onClick={handleNext}
                    disabled={!isStepValid()}
                  >
                    Next <ChevronRight className="w-4 h-4 ml-1" />
                  </ButtonEnterprise>
                ) : (
                  <ButtonEnterprise
                    variant="primary"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    disabled={!isStepValid()}
                  >
                    Submit Application
                  </ButtonEnterprise>
                )}
              </div>
            </CardEnterprise>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
