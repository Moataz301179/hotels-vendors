"use client";

import { useState, useEffect } from "react";
import { Landmark, Phone, Mail, CreditCard, CheckCircle2, XCircle, Clock, Building2 } from "lucide-react";

interface FactoringCompany {
  id: string;
  name: string;
  legalName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  maxFacility?: number | null;
  interestRate?: number | null;
  rate?: number | null;
  status: string;
  createdAt: string;
}

interface CreditFacility {
  id: string;
  limit: number;
  utilized: number;
  interestRate: number;
  status: string;
  approvedAt?: string | null;
  expiresAt?: string | null;
  createdAt: string;
  hotel?: { id: string; name: string };
  factoringCompany?: { id: string; name: string };
}

const STATUS_BADGE: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400",
  ACTIVE: "bg-emerald-500/10 text-emerald-400",
  REJECTED: "bg-red-500/10 text-red-400",
  EXPIRED: "bg-slate-500/10 text-slate-400",
};

export default function FactoringPage() {
  const [tab, setTab] = useState<"marketplace" | "facilities">("marketplace");
  const [companies, setCompanies] = useState<FactoringCompany[]>([]);
  const [facilities, setFacilities] = useState<CreditFacility[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<FactoringCompany | null>(null);
  const [form, setForm] = useState({ limit: "", interestRate: "" });
  const [hotelId, setHotelId] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [cRes, fRes, hRes] = await Promise.all([
          fetch("/api/factoring/companies"),
          fetch("/api/factoring/facilities"),
          fetch("/api/hotels?limit=10"),
        ]);
        const cData = await cRes.json();
        const fData = await fRes.json();
        const hData = await hRes.json();
        if (cData.success) setCompanies(cData.data);
        if (fData.success) setFacilities(fData.data);
        if (hData.success && hData.data.length > 0) setHotelId(hData.data[0].id);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleApply = (company: FactoringCompany) => {
    setSelectedCompany(company);
    setForm({
      limit: company.maxFacility ? String(Math.round(company.maxFacility / 2)) : "",
      interestRate: company.interestRate ? String(company.interestRate) : company.rate ? String(company.rate) : "",
    });
    setModalOpen(true);
  };

  const submitFacility = async () => {
    if (!selectedCompany || !hotelId) return;
    try {
      const res = await fetch("/api/factoring/facilities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          factoringCompanyId: selectedCompany.id,
          limit: parseFloat(form.limit),
          interestRate: parseFloat(form.interestRate),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setFacilities((prev) => [data.data, ...prev]);
        setModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96 text-xs text-foreground-muted">
        <div className="w-3.5 h-3.5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mr-2" />
        Loading factoring marketplace...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold">Factoring Marketplace</h1>
          <p className="text-[11px] text-foreground-muted">Access working capital through invoice factoring</p>
        </div>
      </div>

      <div className="flex items-center gap-1 border-b border-border-subtle">
        {(["marketplace", "facilities"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 text-[11px] font-medium rounded-t-md transition-colors ${
              tab === t ? "bg-surface text-brand-400 border-t border-x border-border-subtle" : "text-foreground-muted hover:text-foreground"
            }`}
          >
            {t === "marketplace" ? "Marketplace" : "My Facilities"}
          </button>
        ))}
      </div>

      {tab === "marketplace" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {companies.map((company) => (
            <div
              key={company.id}
              className="bg-[#13161c]/80 backdrop-blur border border-white/10 rounded-lg p-4 hover:border-white/20 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-700/20 flex items-center justify-center">
                  <Landmark className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold">{company.name}</div>
                  {company.legalName && <div className="text-[9px] text-foreground-muted">{company.legalName}</div>}
                </div>
              </div>

              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-[10px] text-foreground-muted">
                  <CreditCard className="w-3 h-3" />
                  Max Facility: <span className="text-foreground font-medium">EGP {company.maxFacility?.toLocaleString() || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-foreground-muted">
                  <Clock className="w-3 h-3" />
                  Rate: <span className="text-foreground font-medium">{(company.interestRate || company.rate || 0) * 100}%</span>
                </div>
                {company.contactEmail && (
                  <div className="flex items-center gap-2 text-[10px] text-foreground-muted">
                    <Mail className="w-3 h-3" />
                    {company.contactEmail}
                  </div>
                )}
                {company.contactPhone && (
                  <div className="flex items-center gap-2 text-[10px] text-foreground-muted">
                    <Phone className="w-3 h-3" />
                    {company.contactPhone}
                  </div>
                )}
              </div>

              <button
                onClick={() => handleApply(company)}
                className="w-full py-1.5 text-[11px] font-medium rounded-md bg-brand-600 hover:bg-brand-700 text-white transition-colors"
              >
                Apply for Facility
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === "facilities" && (
        <div className="rounded-md border border-border-subtle bg-surface overflow-hidden">
          <table className="w-full text-[11px]">
            <thead>
              <tr className="border-b border-border-subtle text-foreground-muted bg-surface-raised/50">
                <th className="text-left px-3 py-1.5 font-medium">Company</th>
                <th className="text-left px-3 py-1.5 font-medium">Hotel</th>
                <th className="text-right px-3 py-1.5 font-medium">Limit</th>
                <th className="text-right px-3 py-1.5 font-medium">Utilized</th>
                <th className="text-right px-3 py-1.5 font-medium">Remaining</th>
                <th className="text-left px-3 py-1.5 font-medium">Status</th>
                <th className="text-left px-3 py-1.5 font-medium">Expires</th>
              </tr>
            </thead>
            <tbody>
              {facilities.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-foreground-muted">No credit facilities yet.</td>
                </tr>
              ) : (
                facilities.map((f) => (
                  <tr key={f.id} className="border-b border-border-subtle/40 hover:bg-surface-raised/40 transition-colors">
                    <td className="px-3 py-1.5 font-medium">{f.factoringCompany?.name || "—"}</td>
                    <td className="px-3 py-1.5">{f.hotel?.name || "—"}</td>
                    <td className="px-3 py-1.5 text-right font-mono">EGP {f.limit.toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-red-400">EGP {f.utilized.toLocaleString()}</td>
                    <td className="px-3 py-1.5 text-right font-mono text-emerald-400">EGP {(f.limit - f.utilized).toLocaleString()}</td>
                    <td className="px-3 py-1.5">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-[1px] rounded-full text-[9px] font-medium ${STATUS_BADGE[f.status] || ""}`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-foreground-muted">
                      {f.expiresAt ? new Date(f.expiresAt).toLocaleDateString() : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && selectedCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-surface border border-border-subtle rounded-lg p-4 w-full max-w-md shadow-lg">
            <h2 className="text-sm font-semibold mb-1">Apply for Credit Facility</h2>
            <p className="text-[11px] text-foreground-muted mb-4">{selectedCompany.name}</p>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-medium text-foreground-muted mb-1 block">Hotel</label>
                <select
                  value={hotelId}
                  onChange={(e) => setHotelId(e.target.value)}
                  className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none"
                >
                  <option value="">Select hotel...</option>
                  {/* Loaded dynamically; in real app would list hotels */}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-medium text-foreground-muted mb-1 block">Requested Limit (EGP)</label>
                <input
                  type="number"
                  value={form.limit}
                  onChange={(e) => setForm({ ...form, limit: e.target.value })}
                  className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-medium text-foreground-muted mb-1 block">Interest Rate (decimal)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.interestRate}
                  onChange={(e) => setForm({ ...form, interestRate: e.target.value })}
                  className="w-full text-[11px] rounded-md bg-background border border-border-subtle px-2 py-[5px] focus:border-brand-500/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="px-3 py-1.5 text-[11px] rounded-md text-foreground-muted hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitFacility}
                className="px-3 py-1.5 text-[11px] rounded-md bg-brand-600 hover:bg-brand-700 text-white transition-colors"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
