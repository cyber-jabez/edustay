"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Building,
  FileCheck2,
  Wrench,
  ShieldCheck,
  Clock,
  ArrowRight,
  ClipboardList,
} from "lucide-react";

export default function StaffDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/staff/dashboard")
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
        <div className="text-xs font-semibold text-slate-500">Loading staff supervisory dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-slate-500">Staff dashboard data unavailable.</div>;
  }

  const { role, fullName, overview, roleMetrics, recentAudits } = data;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-800">
              Role: {role}
            </span>
            <span className="text-xs text-slate-400">Authenticated Session</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold mt-1.5">{fullName}</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Karunya Institute of Technology and Sciences • Student Residence Administration
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/staff/outpass"
            className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm"
          >
            Review Outpass Queue ({overview.pendingOutpasses})
          </Link>
        </div>
      </section>

      {/* Campus Residence Statistics */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Total Residence Hostels</div>
          <div className="text-2xl font-extrabold text-slate-800 mt-1">{overview.totalHostels}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">{overview.totalRooms} Registered Rooms</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Bed Occupancy Rate</div>
          <div className="text-2xl font-extrabold text-emerald-700 mt-1">{overview.occupancyRate}%</div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {overview.occupiedBeds} Occupied / {overview.totalBeds} Total Beds
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Pending Outpasses</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1">{overview.pendingOutpasses}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Dual approval queue</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Active Maintenance Tickets</div>
          <div className="text-2xl font-extrabold text-rose-600 mt-1">{overview.unresolvedComplaints}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Under campus servicing</div>
        </div>
      </section>

      {/* Role-Specific Metrics */}
      {role === "MENTOR" && roleMetrics.menteesList && (
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-[#0072bc]" />
              <span>Assigned Mentee Roster ({roleMetrics.menteesCount} Students)</span>
            </h2>
            <span className="text-xs font-semibold text-amber-700">
              {roleMetrics.pendingReviewCount} Outpasses Pending Review
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Student Name</th>
                  <th className="py-2 px-3">Register Number</th>
                  <th className="py-2 px-3">Hostel</th>
                  <th className="py-2 px-3 text-center">CGPA</th>
                  <th className="py-2 px-3 text-right">Class Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roleMetrics.menteesList.map((m: any) => (
                  <tr key={m.id} className="hover:bg-slate-50 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold text-[#0072bc]">{m.identifier}</td>
                    <td className="py-2.5 px-3">{m.hostel}</td>
                    <td className="py-2.5 px-3 text-center font-bold">{m.cgpa}</td>
                    <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700">{m.attendancePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {role === "SRA" && (
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" />
              <span>SRA Residence Supervisory Scope</span>
            </h2>
            <Link href="/staff/attendance" className="text-xs font-bold text-[#0072bc] hover:underline">
              Mark Night Roll-Call →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Assigned Hostel</span>
              <span className="font-bold text-slate-900 text-sm">{roleMetrics.assignedHostel}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Assigned Wing</span>
              <span className="font-bold text-slate-900 text-sm">{roleMetrics.assignedWing}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Residents Under Care</span>
              <span className="font-bold text-slate-900 text-sm">{roleMetrics.residentsCount} Students</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-500 block">Pending Outpasses</span>
              <span className="font-bold text-amber-600 text-sm">{roleMetrics.pendingDecisions} Requests</span>
            </div>
          </div>
        </section>
      )}

      {/* Audit Log / Operational Ledger */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <ClipboardList className="w-4 h-4 text-slate-600" />
          <span>Institutional PostgreSQL Audit Trail</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Action</th>
                <th className="py-2 px-3">Entity</th>
                <th className="py-2 px-3">Authorized Staff / User</th>
                <th className="py-2 px-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentAudits.map((a: any) => (
                <tr key={a.id} className="hover:bg-slate-50 transition">
                  <td className="py-2 px-3 font-mono text-slate-400">
                    {new Date(a.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-3 font-bold text-slate-900">{a.action}</td>
                  <td className="py-2 px-3 font-mono text-[#0072bc]">{a.entityType}</td>
                  <td className="py-2 px-3">{a.user?.fullName || "System Engine"}</td>
                  <td className="py-2 px-3 text-slate-500 max-w-xs truncate">{a.detailsJson || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

