"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Users,
  Building,
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Loading staff dashboard...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-zinc-500">Staff dashboard data unavailable.</div>;
  }

  const { role, fullName, overview, roleMetrics, recentAudits } = data;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
              Role: {role}
            </span>
            <span className="text-[11px] text-zinc-400">Authenticated Staff Session</span>
          </div>
          <h1 className="text-lg font-semibold text-zinc-900 mt-1">{fullName}</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Karunya Institute of Technology and Sciences • Residence Administration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/staff/outpass"
            className="px-3.5 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-xs transition"
          >
            Review Outpasses ({overview.pendingOutpasses})
          </Link>
        </div>
      </section>

      {/* Campus Residence Statistics */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-lg p-4">
          <div className="text-xs text-zinc-500">Residence Hostels</div>
          <div className="text-xl font-semibold text-zinc-900 mt-1">{overview.totalHostels}</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">{overview.totalRooms} Rooms</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-4">
          <div className="text-xs text-zinc-500">Bed Occupancy Rate</div>
          <div className="text-xl font-semibold text-zinc-900 mt-1">{overview.occupancyRate}%</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">
            {overview.occupiedBeds} / {overview.totalBeds} Beds
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-4">
          <div className="text-xs text-zinc-500">Pending Outpasses</div>
          <div className="text-xl font-semibold text-zinc-900 mt-1">{overview.pendingOutpasses}</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Dual approval queue</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-lg p-4">
          <div className="text-xs text-zinc-500">Active Maintenance</div>
          <div className="text-xl font-semibold text-zinc-900 mt-1">{overview.unresolvedComplaints}</div>
          <div className="text-[11px] text-zinc-400 mt-0.5">Under campus servicing</div>
        </div>
      </section>

      {/* Role-Specific Metrics */}
      {role === "MENTOR" && roleMetrics.menteesList && (
        <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-zinc-600" />
              <span>Assigned Mentee Roster ({roleMetrics.menteesCount} Students)</span>
            </h2>
            <span className="text-xs text-zinc-600">
              {roleMetrics.pendingReviewCount} Outpasses Pending Review
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-600 font-medium border-b border-zinc-200">
                <tr>
                  <th className="py-2 px-3">Student Name</th>
                  <th className="py-2 px-3">Register Number</th>
                  <th className="py-2 px-3">Hostel</th>
                  <th className="py-2 px-3 text-center">CGPA</th>
                  <th className="py-2 px-3 text-right">Attendance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {roleMetrics.menteesList.map((m: any) => (
                  <tr key={m.id} className="hover:bg-zinc-50 transition">
                    <td className="py-2.5 px-3 font-medium text-zinc-900">{m.name}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-600">{m.identifier}</td>
                    <td className="py-2.5 px-3 text-zinc-600">{m.hostel}</td>
                    <td className="py-2.5 px-3 text-center font-medium">{m.cgpa}</td>
                    <td className="py-2.5 px-3 text-right font-medium text-zinc-900">{m.attendancePct}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {role === "SRA" && (
        <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-zinc-600" />
              <span>SRA Supervisory Scope</span>
            </h2>
            <Link href="/staff/attendance" className="text-xs font-medium text-zinc-900 hover:underline">
              Mark Night Attendance →
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-zinc-500 block text-[11px]">Assigned Hostel</span>
              <span className="font-medium text-zinc-900">{roleMetrics.assignedHostel}</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-zinc-500 block text-[11px]">Assigned Wing</span>
              <span className="font-medium text-zinc-900">{roleMetrics.assignedWing}</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-zinc-500 block text-[11px]">Residents</span>
              <span className="font-medium text-zinc-900">{roleMetrics.residentsCount} Students</span>
            </div>
            <div className="p-3 bg-zinc-50 border border-zinc-200 rounded">
              <span className="text-zinc-500 block text-[11px]">Pending Outpasses</span>
              <span className="font-medium text-zinc-900">{roleMetrics.pendingDecisions} Requests</span>
            </div>
          </div>
        </section>
      )}

      {/* Audit Log / Operational Ledger */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-2.5">
          <ClipboardList className="w-4 h-4 text-zinc-600" />
          <span>PostgreSQL Audit Trail</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 font-medium border-b border-zinc-200">
              <tr>
                <th className="py-2 px-3">Timestamp</th>
                <th className="py-2 px-3">Action</th>
                <th className="py-2 px-3">Entity</th>
                <th className="py-2 px-3">Authorized User</th>
                <th className="py-2 px-3">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {recentAudits.map((a: any) => (
                <tr key={a.id} className="hover:bg-zinc-50 transition">
                  <td className="py-2 px-3 font-mono text-zinc-400">
                    {new Date(a.createdAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-3 font-medium text-zinc-900">{a.action}</td>
                  <td className="py-2 px-3 font-mono text-zinc-600">{a.entityType}</td>
                  <td className="py-2 px-3 text-zinc-600">{a.user?.fullName || "System"}</td>
                  <td className="py-2 px-3 text-zinc-500 max-w-xs truncate">{a.detailsJson || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
