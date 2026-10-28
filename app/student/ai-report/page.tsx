"use client";

import React, { useState } from "react";
import {
  Sparkles,
  FileCheck2,
  Clock,
  ShieldCheck,
  BarChart3,
  Calendar,
  AlertCircle,
  Database,
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
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">AI-Assisted Residence & Academic Reports</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Auditable analytical summaries synthesized strictly from verified PostgreSQL database records
        </p>
      </div>

      {/* Report Generator Controls */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Generate Verified Student Report</span>
          </h2>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
            <Database className="w-3 h-3" /> PostgreSQL Grounded
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">Select Analysis Domain</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
            >
              <option value="ATTENDANCE_SUMMARY">Academic & Hostel Attendance Compliance</option>
              <option value="OUTPASS_ANALYTICS">Outpass Travel & Discipline Analysis</option>
              <option value="COMPLAINT_SUMMARY">Hostel Maintenance & Repair Turnaround</option>
              <option value="RESIDENCE_HISTORY">Comprehensive Residence Standing</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#0072bc] hover:bg-[#005ea2] disabled:bg-slate-400 text-white font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? "Synthesizing DB Records..." : "Generate Analytical Report"}</span>
            </button>
          </div>
        </div>
      </section>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-semibold">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Rendered Analytical Report */}
      {report && (
        <section className="bg-white border-2 border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 animate-in fade-in-50 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                Institutional Analysis Deliverable
              </span>
              <h2 className="text-base font-extrabold text-slate-900 mt-1">{report.title}</h2>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              Generated: {new Date(report.generatedAt).toLocaleString()}
            </div>
          </div>

          {/* Scope and Coverage Bar */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="text-slate-500 font-semibold">
              <span className="text-slate-800">Source Coverage: </span>
              {report.dataCoverage}
            </div>
            <div className="text-[11px] text-slate-400">
              Database fact grounding: Persisted to PostgreSQL table `AIReport` (Deterministic execution).
            </div>
          </div>

          {/* Synthesis Narrative */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Analytical Observations & Findings
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed bg-sky-50/50 p-4 rounded-xl border border-sky-100">
              {report.summaryText}
            </p>
          </div>

          {/* Data Metrics Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Verified Metric Attributes
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="py-2 px-3">Metric Key</th>
                    <th className="py-2 px-3">Database Persisted Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {Object.entries(report.dataMetrics).map(([k, v]) => (
                    <tr key={k}>
                      <td className="py-2 px-3 font-mono text-slate-600">{k}</td>
                      <td className="py-2 px-3 font-bold text-slate-900">{String(v)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Institutional Compliance Notice */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Academic Software Engineering Integrity Notice: </span>
              {report.engineNotice}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

