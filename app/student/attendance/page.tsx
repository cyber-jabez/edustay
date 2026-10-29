"use client";

import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Building,
} from "lucide-react";

export default function AttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"academic" | "hostel">("academic");

  useEffect(() => {
    fetch("/api/student/attendance")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-6 h-6 border-2 border-karunya-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-slate-500 font-medium font-poppins">Loading attendance...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-slate-500 font-poppins">Attendance data unavailable.</div>;
  }

  const { academic, hostel } = data;

  return (
    <div className="space-y-5 max-w-5xl font-poppins">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 font-lora">Attendance & Roll-Call</h1>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-100 rounded-xl text-sm font-medium w-fit gap-1">
          <button
            onClick={() => setActiveTab("academic")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "academic"
                ? "bg-karunya-blue text-white font-semibold shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Academic Classes
          </button>
          <button
            onClick={() => setActiveTab("hostel")}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === "hostel"
                ? "bg-karunya-blue text-white font-semibold shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Hostel Roll-Call
          </button>
        </div>
      </div>

      {activeTab === "academic" ? (
        <div className="space-y-5">
          {/* Academic Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Overall</div>
                <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <GraduationCap className="w-3.5 h-3.5 text-karunya-blue" />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-800 font-lora">{academic.overallPercentage}%</div>
              <div className={`text-[10px] font-semibold mt-1 ${academic.overallPercentage >= 75 ? "text-emerald-600" : "text-red-500"}`}>
                {academic.overallPercentage >= 75 ? "✓ Eligible" : "⚠ Shortage"}
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">Assembly</div>
              <div className="text-xl font-bold text-slate-800 font-lora">{academic.assemblyAttendancePct.toFixed(1)}%</div>
              <div className="text-[10px] text-slate-400 font-medium mt-1">Roll call</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">Attended</div>
              <div className="text-xl font-bold text-slate-800 font-lora">
                {academic.attendedSessions}{" "}
                <span className="text-sm font-normal text-slate-400">/ {academic.totalSessions}</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-1">Sessions</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">Absent</div>
              <div className={`text-xl font-bold font-lora ${academic.absentSessions > 0 ? "text-red-500" : "text-slate-800"}`}>
                {academic.absentSessions}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-1">Sessions</div>
            </div>
          </div>

          {/* Subject Table */}
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
            <div className="px-5 py-3.5 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800 font-lora">Subject Breakdown</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50 text-xs uppercase tracking-wide">
                    <th className="py-3 px-5">Code</th>
                    <th className="py-3 px-5">Course Name</th>
                    <th className="py-3 px-5 text-center">Total</th>
                    <th className="py-3 px-5 text-center">Attended</th>
                    <th className="py-3 px-5 text-center">Absent</th>
                    <th className="py-3 px-5 text-right">%</th>
                    <th className="py-3 px-5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {academic.subjects.map((sub: any) => (
                    <tr key={sub.code} className="hover:bg-blue-50/30 transition">
                      <td className="py-3 px-5 font-mono font-semibold text-slate-900 text-xs">{sub.code}</td>
                      <td className="py-3 px-5 text-slate-700 text-sm">{sub.name}</td>
                      <td className="py-3 px-5 text-center text-slate-500 text-sm">{sub.total}</td>
                      <td className="py-3 px-5 text-center text-slate-800 font-semibold text-sm">{sub.attended}</td>
                      <td className="py-3 px-5 text-center text-slate-500 text-sm">{sub.absent}</td>
                      <td className="py-3 px-5 text-right font-bold text-slate-900 text-sm">{sub.percentage}%</td>
                      <td className="py-3 px-5 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          sub.percentage >= 75
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}>
                          {sub.percentage >= 75 ? "Eligible" : "Shortage"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      ) : (
        /* Hostel Night Roll-Call Tab */
        <div className="space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Compliance</div>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Building className="w-3.5 h-3.5 text-emerald-600" />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-800 font-lora">{hostel.attendanceRate}%</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">✓ Compliant</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">Present</div>
              <div className="text-xl font-bold text-slate-800 font-lora">{hostel.presentDays}</div>
              <div className="text-[10px] text-slate-400 font-medium mt-1">Days in residence</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">Outpass Days</div>
              <div className="text-xl font-bold text-karunya-blue font-lora">{hostel.outpassDays}</div>
              <div className="text-[10px] text-slate-400 font-medium mt-1">Authorized leave</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card">
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide mb-2">Absences</div>
              <div className={`text-xl font-bold font-lora ${hostel.absentDays > 0 ? "text-red-500" : "text-slate-800"}`}>
                {hostel.absentDays}
              </div>
              <div className="text-[10px] text-slate-400 font-medium mt-1">Unexcused</div>
            </div>
          </div>

          {/* Roll Call History Table */}
          <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
            <div className="px-5 py-3.5 border-b border-slate-100">
              <h2 className="text-sm font-semibold text-slate-800 font-lora">Recent Roll-Call History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50 text-xs uppercase tracking-wide">
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Wing</th>
                    <th className="py-3 px-5">Marked By (SRA)</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {hostel.recentHistory.map((h: any) => (
                    <tr key={h.id} className="hover:bg-blue-50/30 transition">
                      <td className="py-3 px-5 text-slate-800 font-medium text-sm">
                        {new Date(h.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </td>
                      <td className="py-3 px-5 text-slate-600 text-sm">{h.hostelName} ({h.wingName})</td>
                      <td className="py-3 px-5 text-slate-600 text-sm">{h.markedBy}</td>
                      <td className="py-3 px-5">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                          h.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : h.status === "ON_OUTPASS"
                            ? "bg-blue-50 text-karunya-blue border-blue-200"
                            : "bg-red-50 text-red-600 border-red-200"
                        }`}>
                          {h.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-slate-400 text-sm">{h.remarks || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
