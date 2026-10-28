"use client";

import React, { useEffect, useState } from "react";
import {
  GraduationCap,
  Building,
  Clock,
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
        <div className="text-xs text-zinc-500 font-medium">Loading attendance data...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-xs text-zinc-500">Attendance data unavailable.</div>;
  }

  const { academic, hostel } = data;

  return (
    <div className="space-y-5 max-w-5xl font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-200 pb-3">
        <div>
          <h1 className="text-lg font-bold text-zinc-900 tracking-tight">Attendance & Roll-Call</h1>
          <p className="text-xs text-zinc-500">
            Persisted records for academic classes and hostel evening check-ins
          </p>
        </div>

        {/* Minimal Tab Switcher */}
        <div className="flex p-0.5 bg-zinc-100 rounded-lg text-xs font-medium w-fit">
          <button
            onClick={() => setActiveTab("academic")}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === "academic" ? "bg-white text-zinc-900 shadow-xs font-semibold" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Academic Classes
          </button>
          <button
            onClick={() => setActiveTab("hostel")}
            className={`px-3 py-1.5 rounded-md transition ${
              activeTab === "hostel" ? "bg-white text-zinc-900 shadow-xs font-semibold" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Hostel Roll-Call
          </button>
        </div>
      </div>

      {activeTab === "academic" ? (
        <div className="space-y-5">
          {/* Formula Info */}
          <div className="p-3.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-600">
            <span className="font-semibold text-zinc-900">Calculation: </span>
            <span className="font-mono text-zinc-800">{academic.formula}</span>
            <span className="text-zinc-400 block mt-0.5">Minimum attendance required for examination eligibility: 75.00%</span>
          </div>

          {/* Academic Overview Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
              <div className="text-[11px] text-zinc-500 font-medium">Overall Attendance</div>
              <div className="text-xl font-bold text-zinc-900 mt-1">{academic.overallPercentage}%</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Eligible</div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
              <div className="text-[11px] text-zinc-500 font-medium">Assembly Attendance</div>
              <div className="text-xl font-bold text-zinc-900 mt-1">{academic.assemblyAttendancePct.toFixed(2)}%</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Full compliance</div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
              <div className="text-[11px] text-zinc-500 font-medium">Attended Sessions</div>
              <div className="text-xl font-bold text-zinc-900 mt-1">
                {academic.attendedSessions} <span className="text-xs font-normal text-zinc-400">/ {academic.totalSessions}</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Scheduled hours</div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
              <div className="text-[11px] text-zinc-500 font-medium">Absent Sessions</div>
              <div className="text-xl font-bold text-zinc-900 mt-1">{academic.absentSessions}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Unexcused hours</div>
            </div>
          </div>

          {/* Subject-wise Attendance Table */}
          <section className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Subject Breakdown
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500 font-medium bg-zinc-50/60">
                    <th className="py-2.5 px-3">Code</th>
                    <th className="py-2.5 px-3">Course Name</th>
                    <th className="py-2.5 px-3 text-center">Total</th>
                    <th className="py-2.5 px-3 text-center">Attended</th>
                    <th className="py-2.5 px-3 text-center">Absent</th>
                    <th className="py-2.5 px-3 text-right">Percentage</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {academic.subjects.map((sub: any) => (
                    <tr key={sub.code} className="hover:bg-zinc-50/50 transition">
                      <td className="py-2 px-3 font-mono font-medium text-zinc-900">{sub.code}</td>
                      <td className="py-2 px-3 text-zinc-800">{sub.name}</td>
                      <td className="py-2 px-3 text-center text-zinc-500">{sub.total}</td>
                      <td className="py-2 px-3 text-center text-zinc-800 font-medium">{sub.attended}</td>
                      <td className="py-2 px-3 text-center text-zinc-500">{sub.absent}</td>
                      <td className="py-2 px-3 text-right font-semibold text-zinc-900">
                        {sub.percentage}%
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          sub.percentage >= 75 ? "bg-zinc-100 text-zinc-800" : "bg-zinc-200 text-zinc-900"
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
          <div className="p-3.5 rounded-lg border border-zinc-200 bg-white text-xs text-zinc-600">
            <span className="font-semibold text-zinc-900">Hostel Roll-Call: </span>
            <span>Conducted daily by assigned SRAs at 08:30 PM. Approved outpasses are officially recognized.</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
              <div className="text-[11px] text-zinc-500 font-medium">Compliance Rate</div>
              <div className="text-xl font-bold text-zinc-900 mt-1">{hostel.attendanceRate}%</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Compliant resident</div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
              <div className="text-[11px] text-zinc-500 font-medium">Days Present</div>
              <div className="text-xl font-bold text-zinc-900 mt-1">{hostel.presentDays}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Physically in residence</div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
              <div className="text-[11px] text-zinc-500 font-medium">Outpass Days</div>
              <div className="text-xl font-bold text-zinc-900 mt-1">{hostel.outpassDays}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Authorized leave</div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
              <div className="text-[11px] text-zinc-500 font-medium">Absences</div>
              <div className="text-xl font-bold text-zinc-900 mt-1">{hostel.absentDays}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Zero unexcused</div>
            </div>
          </div>

          {/* Roll Call History */}
          <section className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Recent Roll-Call History
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-zinc-200 text-zinc-500 font-medium bg-zinc-50/60">
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Wing</th>
                    <th className="py-2 px-3">Marked By (SRA)</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-zinc-700">
                  {hostel.recentHistory.map((h: any) => (
                    <tr key={h.id} className="hover:bg-zinc-50/50 transition">
                      <td className="py-2 px-3 text-zinc-800 font-medium">
                        {new Date(h.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-2 px-3 text-zinc-600">{h.hostelName} ({h.wingName})</td>
                      <td className="py-2 px-3 text-zinc-600">{h.markedBy}</td>
                      <td className="py-2 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-800 border border-zinc-200">
                          {h.status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-zinc-400">{h.remarks || "—"}</td>
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
