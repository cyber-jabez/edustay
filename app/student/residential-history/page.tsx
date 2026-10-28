"use client";

import React, { useEffect, useState } from "react";
import {
  History,
  Building,
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Retrieving residence history...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-zinc-500">Residential history unavailable.</div>;
  }

  const { current, history } = data;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Residential History</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Audit record of past and active hostel allocations
        </p>
      </div>

      {/* Active Semester Allocation Card */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900">Active Allocation</h2>
          </div>
          <span className="text-xs text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
            {current.academicYear} • Semester {current.semester}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-1">
          <div>
            <span className="text-zinc-500 block text-[11px]">Hostel</span>
            <span className="font-medium text-zinc-900">{current.hostelName}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[11px]">Wing & Room</span>
            <span className="font-medium text-zinc-900">{current.wingName} - Room {current.roomNumber}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[11px]">Bed Allotment</span>
            <span className="font-semibold text-zinc-900">Bed {current.bedCode}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[11px]">Configuration</span>
            <span className="font-medium text-zinc-900">{current.roomType}</span>
          </div>
        </div>
      </section>

      {/* Chronological Historical Records Table */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
          <History className="w-4 h-4 text-zinc-600" />
          <span>Residence Timeline</span>
        </h2>

        {history.length === 0 ? (
          <div className="text-xs text-zinc-500 py-2">No previous hostel records archived.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 bg-zinc-50 font-medium">
                  <th className="py-2.5 px-3">Period</th>
                  <th className="py-2.5 px-3">Hostel</th>
                  <th className="py-2.5 px-3">Room & Bed</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Check-In</th>
                  <th className="py-2.5 px-3">Check-Out</th>
                  <th className="py-2.5 px-3">Roommates</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-700">
                {history.map((h: any) => (
                  <tr key={h.id} className="hover:bg-zinc-50/50 transition">
                    <td className="py-2.5 px-3 font-medium text-zinc-900">
                      Sem {h.semester} ({h.academicYear})
                    </td>
                    <td className="py-2.5 px-3">{h.hostelName} ({h.wingName})</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-900">
                      {h.roomNumber} ({h.bedCode})
                    </td>
                    <td className="py-2.5 px-3">{h.roomType}</td>
                    <td className="py-2.5 px-3">{new Date(h.checkInDate).toLocaleDateString()}</td>
                    <td className="py-2.5 px-3 text-zinc-500">
                      {h.checkOutDate ? new Date(h.checkOutDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="py-2.5 px-3 text-zinc-500">{h.roommatesSummary || "Single"}</td>
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
