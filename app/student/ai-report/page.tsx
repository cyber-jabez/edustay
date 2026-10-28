"use client";

import React, { useState } from "react";
import {
  Sparkles,
  Database,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";

export default function StudentAiReportPage() {
  const [reportType, setReportType] = useState<
    "ATTENDANCE_SUMMARY" | "OUTPASS_ANALYTICS" | "COMPLAINT_SUMMARY" | "RESIDENCE_HISTORY"
  >("ATTENDANCE_SUMMARY");
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportType }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate report");

      setReport(data.report);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">AI Analytical Reports</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Auditable analytical summaries synthesized from database records
        </p>
      </div>

      {/* Report Generator Controls */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-zinc-600" />
            <span>Generate Student Report</span>
          </h2>
          <span className="text-[11px] text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200 flex items-center gap-1">
            <Database className="w-3 h-3 text-zinc-500" /> Grounded in Database
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Analysis Domain</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition bg-white"
            >
              <option value="ATTENDANCE_SUMMARY">Attendance Compliance</option>
              <option value="OUTPASS_ANALYTICS">Outpass Travel & Discipline</option>
              <option value="COMPLAINT_SUMMARY">Hostel Maintenance & Turnaround</option>
              <option value="RESIDENCE_HISTORY">Residence Standing & Room History</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full sm:w-auto px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium text-xs rounded transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{loading ? "Synthesizing..." : "Generate Report"}</span>
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="p-3 rounded bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Rendered Analytical Report */}
      {report && (
        <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-semibold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
                Analytical Deliverable
              </span>
              <h2 className="text-sm font-semibold text-zinc-900 mt-1">{report.title}</h2>
            </div>
            <div className="text-[11px] text-zinc-400">
              {new Date(report.generatedAt).toLocaleString()}
            </div>
          </div>

          {/* Scope and Coverage */}
          <div className="p-3 rounded bg-zinc-50 border border-zinc-200 text-xs space-y-1">
            <div className="text-zinc-700">
              <span className="font-medium text-zinc-900">Source: </span>
              {report.dataCoverage}
            </div>
            <div className="text-[11px] text-zinc-400">
              Persisted to PostgreSQL table `AIReport`.
            </div>
          </div>

          {/* Synthesis Narrative */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Observations & Findings
            </h3>
            <p className="text-xs text-zinc-700 leading-relaxed bg-zinc-50 p-3.5 rounded border border-zinc-200">
              {report.summaryText}
            </p>
          </div>

          {/* Data Metrics Table */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">
              Attributes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-zinc-200 rounded overflow-hidden">
                <thead className="bg-zinc-50 text-zinc-600 font-medium">
                  <tr>
                    <th className="py-2 px-3">Metric</th>
                    <th className="py-2 px-3">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {Object.entries(report.dataMetrics).map(([k, v]) => (
                    <tr key={k}>
                      <td className="py-2 px-3 font-mono text-zinc-600">{k}</td>
                      <td className="py-2 px-3 font-medium text-zinc-900">{String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Integrity Notice */}
          <div className="p-3 rounded bg-zinc-50 border border-zinc-200 text-[11px] text-zinc-600 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-zinc-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-zinc-900">Integrity Notice: </span>
              {report.engineNotice}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
