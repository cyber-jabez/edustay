"use client";

import React, { useState } from "react";
import {
  Sparkles,
  AlertCircle,
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
    <div className="space-y-5 max-w-4xl font-poppins">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 font-lora">AI Analytical Reports</h1>
      </div>

      {/* Report Generator Controls */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sparkles className="w-4 h-4 text-karunya-blue" />
          <h2 className="text-sm font-semibold text-slate-800 font-lora">Generate Student Report</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
              Analysis Domain
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition bg-white"
            >
              <option value="ATTENDANCE_SUMMARY">Attendance Compliance</option>
              <option value="OUTPASS_ANALYTICS">Outpass Travel & Discipline</option>
              <option value="COMPLAINT_SUMMARY">Hostel Maintenance & Turnaround</option>
              <option value="RESIDENCE_HISTORY">Residence Standing & Room History</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full h-11 px-6 bg-karunya-blue hover:bg-sky-600 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Generating..." : "Generate Report"}</span>
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Rendered Analytical Report */}
      {report && (
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[10px] uppercase font-semibold text-karunya-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Analytical Deliverable
              </span>
              <h2 className="text-base font-bold text-slate-800 font-lora mt-1">{report.title}</h2>
            </div>
            <div className="text-xs text-slate-400">
              {new Date(report.generatedAt).toLocaleString()}
            </div>
          </div>

          {/* Synthesis Narrative */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Observations & Findings
            </h3>
            <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
              {report.summaryText}
            </div>
          </div>

          {/* Data Metrics Table */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-700">
              Attributes
            </h3>
            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-xs uppercase tracking-wide border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {Object.entries(report.dataMetrics).map(([k, v]) => (
                    <tr key={k} className="hover:bg-blue-50/20">
                      <td className="py-2.5 px-4 font-mono text-xs text-slate-600">{k}</td>
                      <td className="py-2.5 px-4 font-semibold text-slate-800">{String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
