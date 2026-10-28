"use client";

import React, { useEffect, useState } from "react";
import {
  History,
  Building,
  Calendar,
  BedDouble,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function ResidentialHistoryPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/residential-history")
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
        <div className="text-xs font-semibold text-slate-500">Retrieving chronological residence archives...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-slate-500">Residential history unavailable.</div>;
  }

  const { current, history } = data;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Residential & Room History</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Immutable audit record of past and active hostel residence allocations across academic semesters
        </p>
      </div>

      {/* Active Semester Allocation Card */}
      <section className="bg-white border-2 border-[#0072bc] rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h2 className="text-sm font-bold text-slate-900">Active Residence Allocation</h2>
          </div>
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-sky-100 text-[#0072bc]">
            {current.academicYear} • Semester {current.semester}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
          <div>
            <span className="text-slate-500 block">Hostel Name</span>
            <span className="font-bold text-slate-800 text-sm">{current.hostelName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Wing & Room</span>
            <span className="font-bold text-slate-800 text-sm">{current.wingName} - Room {current.roomNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Bed Allotment</span>
            <span className="font-bold text-[#0072bc] text-sm">Bed {current.bedCode}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Room Configuration</span>
            <span className="font-bold text-slate-800 text-sm">{current.roomType}</span>
          </div>
        </div>
      </section>

      {/* Chronological Historical Records Table */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-purple-600" />
          <span>Chronological Residence Timeline</span>
        </h2>

        {history.length === 0 ? (
          <div className="text-xs text-slate-500 py-3">No previous hostel records archived.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Hostel & Wing</th>
                  <th className="py-2.5 px-3">Room & Bed</th>
                  <th className="py-2.5 px-3">Room Type</th>
                  <th className="py-2.5 px-3">Check-In Date</th>
                  <th className="py-2.5 px-3">Check-Out Date</th>
                  <th className="py-2.5 px-3">Roommates</th>
                  <th className="py-2.5 px-3">Administrative Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {history.map((h: any) => (
                  <tr key={h.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3 font-semibold text-slate-900">
                      Sem {h.semester} ({h.academicYear})
                    </td>
                    <td className="py-3 px-3">{h.hostelName} ({h.wingName})</td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-800">
                      {h.roomNumber} ({h.bedCode})
                    </td>
                    <td className="py-3 px-3">{h.roomType}</td>
                    <td className="py-3 px-3">{new Date(h.checkInDate).toLocaleDateString()}</td>
                    <td className="py-3 px-3">
                      {h.checkOutDate ? new Date(h.checkOutDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-3 px-3 text-slate-600">{h.roommatesSummary || "Individual"}</td>
                    <td className="py-3 px-3 text-slate-500">{h.transferNotes || "Regular"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

