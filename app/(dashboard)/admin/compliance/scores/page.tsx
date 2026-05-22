"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Download,
  Table2,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

interface ImportResult {
  total: number;
  created: number;
  skipped: number;
  errors: { row: number; taxId: string; error: string }[];
}

export default function AdminComplianceScoresPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const processFile = (f: File) => {
    if (!f.name.endsWith(".csv") && !f.name.endsWith(".txt")) {
      alert("Please upload a CSV file");
      return;
    }
    setFile(f);
    setResult(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      const lines = text.trim().split(/\r?\n/).slice(0, 6); // preview first 6 rows
      setPreview(lines.map((l) => l.split(",").map((c) => c.trim())));
    };
    reader.readAsText(f);
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/v1/admin/scores/bulk-import", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setResult({ total: 0, created: 0, skipped: 0, errors: [{ row: 0, taxId: "", error: data.error || "Unknown error" }] });
      }
    } catch (err: any) {
      setResult({ total: 0, created: 0, skipped: 0, errors: [{ row: 0, taxId: "", error: err.message }] });
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csv = `supplier_tax_id,source,score_value,score_label,risk_tier,credit_limit,expires_at,report_url
704226146,I_SCORE,78,A-,LOW,500000,2027-12-31,https://example.com/report1
123456789,DUN_BRADSTREET,62,BB,MEDIUM,200000,2027-06-30,https://example.com/report2
987654321,GAFI,85,A,LOW,750000,2028-01-15,https://example.com/report3`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "score-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">Bulk Score Import</h1>
            <p className="text-[13px] text-neutral-400">
              Import I-Score, D&B, GAFI, or manual company credit scores from CSV
            </p>
          </div>
        </div>
      </motion.div>

      {/* Instructions */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-start gap-3">
          <FileSpreadsheet className="w-4 h-4 text-sky-400 mt-0.5 flex-shrink-0" />
          <div className="text-[13px] text-neutral-400 leading-relaxed space-y-1">
            <p className="text-neutral-300 font-medium">CSV Format Requirements</p>
            <p>Required columns: <code className="text-emerald-400">supplier_tax_id</code>, <code className="text-emerald-400">source</code>, <code className="text-emerald-400">score_value</code></p>
            <p>Optional columns: <code className="text-sky-400">score_label</code>, <code className="text-sky-400">risk_tier</code>, <code className="text-sky-400">credit_limit</code>, <code className="text-sky-400">expires_at</code>, <code className="text-sky-400">report_url</code></p>
            <p>Valid sources: <span className="text-neutral-300">I_SCORE, DUN_BRADSTREET, GAFI, MANUAL, PLATFORM_INTERNAL</span></p>
            <p>Valid risk tiers: <span className="text-neutral-300">LOW, MEDIUM, HIGH, CRITICAL</span></p>
            <button
              onClick={downloadTemplate}
              className="inline-flex items-center gap-1.5 text-[12px] text-sky-400 hover:text-sky-300 transition-colors mt-1"
            >
              <Download className="w-3.5 h-3.5" />
              Download template CSV
            </button>
          </div>
        </div>
      </motion.div>

      {/* Upload Zone */}
      <motion.div variants={fadeInUp} initial="hidden" animate="visible">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
            dragActive
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.12]"
          }`}
        >
          <input
            type="file"
            accept=".csv,.txt"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="w-8 h-8 text-neutral-500 mx-auto mb-3" />
          <p className="text-[13px] text-neutral-300">
            {file ? file.name : "Drop a CSV file here, or click to browse"}
          </p>
          <p className="text-[11px] text-neutral-600 mt-1">
            {file ? `${(file.size / 1024).toFixed(1)} KB` : "Max 5MB"}
          </p>
        </div>
      </motion.div>

      {/* Preview */}
      {preview.length > 0 && (
        <motion.div variants={fadeInUp} initial="hidden" animate="visible">
          <div className="flex items-center gap-2 mb-2">
            <Table2 className="w-4 h-4 text-neutral-400" />
            <span className="text-[13px] text-neutral-300 font-medium">Preview (first 5 rows)</span>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden overflow-x-auto">
            <table className="w-full text-left text-[12px]">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {preview[0].map((h, i) => (
                    <th key={i} className="px-3 py-2 text-[11px] font-medium text-neutral-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.slice(1).map((row, ri) => (
                  <tr key={ri} className="border-b border-white/[0.04]">
                    {row.map((cell, ci) => (
                      <td key={ci} className="px-3 py-2 text-neutral-300 whitespace-nowrap">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={handleUpload}
            disabled={loading}
            className="mt-3 px-4 py-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[13px] text-emerald-400 hover:bg-emerald-500/20 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? (
              <>
                <TrendingUp className="w-3.5 h-3.5 animate-spin" />
                Importing...
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5" />
                Import {preview.length - 1} Score{preview.length > 2 ? "s" : ""}
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Results */}
      {result && (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
        >
          <h3 className="text-[13px] font-medium text-white mb-3">Import Results</h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-lg bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <div className="text-lg font-bold text-white">{result.total}</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Total Rows</div>
            </div>
            <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/10 p-3 text-center">
              <div className="text-lg font-bold text-emerald-400">{result.created}</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Created</div>
            </div>
            <div className="rounded-lg bg-amber-500/5 border border-amber-500/10 p-3 text-center">
              <div className="text-lg font-bold text-amber-400">{result.errors.length}</div>
              <div className="text-[11px] text-neutral-500 mt-0.5">Errors</div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-neutral-500 uppercase tracking-wider mb-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                Errors
              </div>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-red-500/10 bg-red-500/5">
                {result.errors.map((err, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 px-3 py-2 text-[12px] border-b border-red-500/5 last:border-0"
                  >
                    <XCircle className="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="text-red-400">Row {err.row}</span>
                      <span className="text-neutral-500"> — {err.taxId || "N/A"}</span>
                      <p className="text-neutral-400">{err.error}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.created > 0 && result.errors.length === 0 && (
            <div className="flex items-center gap-2 text-emerald-400 text-[13px]">
              <CheckCircle2 className="w-4 h-4" />
              All {result.created} scores imported successfully
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
