"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PackageCheck, MapPin, Phone, KeyRound, CheckCircle, Clock, Truck, ChevronRight } from "lucide-react";
import { useApi } from "@/lib/hooks/use-api";
import { usePost } from "@/lib/hooks/use-api";

interface DeliveryJob {
  id: string;
  jobNumber: string;
  status: string;
  deliveryAddress: string;
  deliveryContact: string | null;
  deliveryPhone: string | null;
  deliveryDate: string | null;
  order: { id: string; orderNumber: string };
  tripStop: { id: string; hotel: { id: string; name: string } } | null;
  otpDelivery: { id: string; status: string; expiresAt: string } | null;
}

const STATUS_COLORS: Record<string, string> = {
  ASSIGNED: "text-amber-400 bg-amber-400/10",
  ACCEPTED_BY_CARRIER: "text-blue-400 bg-blue-400/10",
  PICKED_UP: "text-purple-400 bg-purple-400/10",
  IN_TRANSIT: "text-cyan-400 bg-cyan-400/10",
  ARRIVED: "text-orange-400 bg-orange-400/10",
  DELIVERED: "text-emerald-400 bg-emerald-400/10",
  FAILED: "text-red-400 bg-red-400/10",
  CANCELLED: "text-foreground-tertiary bg-surface-raised",
  RETURNED: "text-red-400 bg-red-400/10",
};

export default function DeliveriesPage() {
  const [selectedJob, setSelectedJob] = useState<DeliveryJob | null>(null);
  const [otpValue, setOtpValue] = useState("");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { data, loading, refetch } = useApi<{ deliveries: DeliveryJob[]; pagination: { total: number } }>(
    "/api/v1/deliveries?limit=50"
  );
  const deliveries = data?.deliveries || [];

  const activeJobs = deliveries.filter((d) => !["DELIVERED", "CANCELLED", "FAILED"].includes(d.status));
  const completedJobs = deliveries.filter((d) => ["DELIVERED", "CANCELLED", "FAILED"].includes(d.status));

  const handleGenerateOtp = async (jobId: string) => {
    setSelectedJob(deliveries.find((d) => d.id === jobId) || null);
    setShowOtpModal(true);
  };

  const handleConfirmDelivery = async (jobId: string) => {
    setSelectedJob(deliveries.find((d) => d.id === jobId) || null);
    setOtpValue("");
    setShowConfirmModal(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div>
        <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
          <PackageCheck size={20} className="text-amber-400" />
          Deliveries
        </h1>
        <p className="text-xs text-foreground-tertiary mt-0.5">View assigned jobs and confirm deliveries</p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-2xl border border-subtle bg-surface-raised p-5 animate-pulse">
              <div className="h-4 w-32 bg-surface-raised rounded mb-2" />
              <div className="h-3 w-48 bg-surface-raised rounded" />
            </div>
          ))}
        </div>
      ) : deliveries.length === 0 ? (
        <div className="rounded-2xl border border-subtle bg-surface-raised p-12 text-center">
          <Truck size={40} className="text-foreground/15 mx-auto mb-3" />
          <p className="text-sm text-foreground-tertiary">No delivery jobs assigned</p>
        </div>
      ) : (
        <>
          {activeJobs.length > 0 && (
            <div>
              <h2 className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-2">Active ({activeJobs.length})</h2>
              <div className="space-y-2">
                {activeJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl border border-subtle bg-surface-raised p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-foreground">{job.jobNumber}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_COLORS[job.status] || "text-foreground-tertiary bg-surface-raised"}`}>
                            {job.status.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-foreground-tertiary mb-1">
                          <MapPin size={12} />
                          <span className="truncate">{job.deliveryAddress}</span>
                        </div>
                        {job.tripStop && (
                          <p className="text-xs text-foreground-muted">{job.tripStop.hotel.name}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!job.otpDelivery && (
                        <button
                          onClick={() => handleGenerateOtp(job.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl border border-amber-500/30 bg-amber-500/5 text-amber-400 text-xs font-medium hover:bg-amber-500/10 transition-colors"
                        >
                          <KeyRound size={12} /> Generate OTP
                        </button>
                      )}
                      {job.otpDelivery && job.otpDelivery.status === "PENDING" && (
                        <button
                          onClick={() => handleConfirmDelivery(job.id)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition-colors"
                        >
                          <CheckCircle size={12} /> Confirm Delivery
                        </button>
                      )}
                      {job.otpDelivery?.status === "VERIFIED" && (
                        <span className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-medium">
                          <CheckCircle size={12} /> OTP Verified
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {completedJobs.length > 0 && (
            <div>
              <h2 className="text-xs font-medium text-foreground-muted uppercase tracking-wider mb-2">Completed ({completedJobs.length})</h2>
              <div className="space-y-2">
                {completedJobs.map((job) => (
                  <div key={job.id} className="rounded-2xl border border-subtle bg-white/[0.01] p-4 opacity-60">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-foreground-tertiary">{job.jobNumber}</span>
                        <span className={`ml-2 text-[10px] px-2 py-0.5 rounded-full ${STATUS_COLORS[job.status]}`}>
                          {job.status}
                        </span>
                      </div>
                      <span className="text-xs text-foreground-muted">{job.order.orderNumber}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {showOtpModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowOtpModal(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-3xl border border-subtle bg-[#0F1320] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-foreground mb-2">Generate OTP</h3>
            <p className="text-xs text-foreground-tertiary mb-4">A 6-digit code will be sent to the receiver to confirm delivery.</p>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-foreground-muted mb-1 block">Receiver Phone</label>
                <input type="tel" placeholder="+20 1XX XXX XXXX" className="w-full px-4 py-2.5 rounded-xl bg-accent-muted border border-subtle[0.1] text-foreground text-sm placeholder:text-foreground-muted focus:outline-none focus:border-amber-400/50" />
              </div>
              <button
                onClick={() => { setShowOtpModal(false); handleConfirmDelivery(selectedJob.id); }}
                className="w-full py-3 rounded-xl bg-accent-base text-foreground font-semibold text-sm"
              >
                Send OTP & Confirm
              </button>
              <button onClick={() => setShowOtpModal(false)} className="w-full py-2 text-xs text-foreground-muted hover:text-foreground-muted">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {showConfirmModal && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-sm rounded-3xl border border-subtle bg-[#0F1320] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-foreground mb-2">Confirm Delivery</h3>
            <p className="text-xs text-foreground-tertiary mb-4">Enter the 6-digit OTP shared by the receiver.</p>
            <div className="space-y-3">
              <input
                type="text"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full px-4 py-3 rounded-xl bg-accent-muted border border-subtle[0.1] text-foreground text-center text-2xl tracking-[0.5em] placeholder:text-foreground-muted focus:outline-none focus:border-amber-400/50"
                maxLength={6}
                autoFocus
              />
              <button
                onClick={() => setShowConfirmModal(false)}
                disabled={otpValue.length !== 6}
                className="w-full py-3 rounded-xl bg-emerald-500 text-black font-semibold text-sm disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Verify & Complete Delivery
              </button>
              <button onClick={() => setShowConfirmModal(false)} className="w-full py-2 text-xs text-foreground-muted hover:text-foreground-muted">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
