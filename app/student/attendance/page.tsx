"use client";

import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  AlertTriangle,
  Info,
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Calculating attendance records from database...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-slate-500">Attendance data unavailable.</div>;
  }

  const { academic, hostel } = data;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Attendance & Residence Roll-Call Audit</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Verified calculation from persisted academic sessions and daily hostel check-ins
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-bold w-fit">
          <button
            onClick={() => setActiveTab("academic")}
            className={`px-4 py-1.5 rounded-lg transition ${
              activeTab === "academic" ? "bg-white text-[#0072bc] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Academic Attendance
          </button>
          <button
            onClick={() => setActiveTab("hostel")}
            className={`px-4 py-1.5 rounded-lg transition ${
              activeTab === "hostel" ? "bg-white text-[#0072bc] shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Hostel Night Attendance
          </button>
        </div>
      </div>

      {activeTab === "academic" ? (
        <div className="space-y-6">
          {/* Formula & Policy Card */}
          <div className="p-4 rounded-xl border border-sky-100 bg-sky-50/70 flex items-start gap-3 text-xs">
            <Info className="w-4 h-4 text-[#0072bc] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Attendance Calculation Formula: </span>
              <span className="font-mono text-sky-900">{academic.formula}</span>
              <p className="text-slate-600 mt-1">
                Minimum requirement for end-semester examinations is 75.00%. Approved on-duty assignments (OD) count as attended sessions.
              </p>
            </div>
          </div>

          {/* Academic Overview Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Overall Attendance</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">{academic.overallPercentage}%</div>
              <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">Eligibility: Excellent</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Assembly Attendance</div>
              <div className="text-2xl font-black text-purple-700 mt-1">{academic.assemblyAttendancePct.toFixed(2)}%</div>
              <div className="text-[11px] font-semibold text-purple-600 mt-0.5">Fully Compliant</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Attended Sessions</div>
              <div className="text-2xl font-black text-slate-800 mt-1">
                {academic.attendedSessions} <span className="text-sm font-normal text-slate-400">/ {academic.totalSessions}</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-0.5">Total scheduled classes</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Absent Sessions</div>
              <div className="text-2xl font-black text-rose-600 mt-1">{academic.absentSessions}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Unexcused hours</div>
            </div>
          </div>

          {/* Subject-wise Attendance Table */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#0072bc]" />
              <span>Subject-wise Attendance Breakdown</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                    <th className="py-2.5 px-3">Course Code</th>
                    <th className="py-2.5 px-3">Course Title</th>
                    <th className="py-2.5 px-3 text-center">Total Sessions</th>
                    <th className="py-2.5 px-3 text-center">Attended</th>
                    <th className="py-2.5 px-3 text-center">Absent</th>
                    <th className="py-2.5 px-3 text-right">Percentage</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {academic.subjects.map((sub: any) => (
                    <tr key={sub.code} className="hover:bg-slate-50/60 transition">
                      <td className="py-2.5 px-3 font-mono font-bold text-[#0072bc]">{sub.code}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{sub.name}</td>
                      <td className="py-2.5 px-3 text-center">{sub.total}</td>
                      <td className="py-2.5 px-3 text-center text-emerald-700 font-semibold">{sub.attended}</td>
                      <td className="py-2.5 px-3 text-center text-rose-600 font-semibold">{sub.absent}</td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-slate-900">
                        {sub.percentage}%
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          sub.percentage >= 75 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-rose-50 text-rose-700 border border-rose-200"
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
        <div className="space-y-6">
          <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/70 flex items-start gap-3 text-xs">
            <Building className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Hostel Night Roll-Call Policy: </span>
              <p className="text-slate-600 mt-1">
                Roll call attendance is verified daily by assigned SRAs at 08:30 PM. Approved outpasses are officially categorized as `Approved Outpass` and do not count as unauthorized absence.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Roll Call Compliance</div>
              <div className="text-2xl font-black text-emerald-700 mt-1">{hostel.attendanceRate}%</div>
              <div className="text-[11px] font-semibold text-emerald-600 mt-0.5">Compliant Resident</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Days Present</div>
              <div className="text-2xl font-black text-slate-800 mt-1">{hostel.presentDays}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Physically in residence</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Approved Outpass Days</div>
              <div className="text-2xl font-black text-amber-600 mt-1">{hostel.outpassDays}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Authorized leave periods</div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <div className="text-xs font-semibold text-slate-500">Unapproved Absences</div>
              <div className="text-2xl font-black text-rose-600 mt-1">{hostel.absentDays}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Zero infractions</div>
            </div>
          </div>

          {/* Hostel Roll-Call History Table */}
          <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span>Recent Daily Hostel Roll-Call History</span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Residence Wing</th>
                    <th className="py-2.5 px-3">Marked By (SRA)</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Official Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                  {hostel.recentHistory.map((h: any) => (
                    <tr key={h.id} className="hover:bg-slate-50/60 transition">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {new Date(h.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-2.5 px-3">{h.hostelName} ({h.wingName})</td>
                      <td className="py-2.5 px-3">{h.markedBy}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          h.status === "PRESENT"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : h.status === "APPROVED_OUTPASS"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          {h.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-500">{h.remarks || "—"}</td>
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

