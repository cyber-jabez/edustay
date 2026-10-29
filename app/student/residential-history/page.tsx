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
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-6 h-6 border-2 border-karunya-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-slate-500 font-poppins">Retrieving residence history...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-slate-500 font-poppins">Residential history unavailable.</div>;
  }

  const { current, history } = data;

  return (
    <div className="space-y-5 max-w-4xl font-poppins">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 font-lora">Residential History</h1>
      </div>

      {/* Active Semester Allocation Card */}
      {current && (
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <h2 className="text-sm font-semibold text-slate-800 font-lora">Active Allocation</h2>
            </div>
            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              {current.academicYear} • Semester {current.semester}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Hostel", value: current.hostelName },
              { label: "Wing & Room", value: `${current.wingName} - Room ${current.roomNumber}` },
              { label: "Bed Identifier", value: `Bed ${current.bedCode}` },
              { label: "Room Type", value: `${current.roomType} ${current.isAc ? "(AC)" : "(Non-AC)"}` },
            ].map((f) => (
              <div key={f.label} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-xs text-slate-400 font-medium block mb-1">{f.label}</span>
                <span className="text-sm font-semibold text-slate-800">{f.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Historical Residences */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
          <History className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-800 font-lora">Past Residence Allocations</h2>
        </div>

        {history.length === 0 ? (
          <div className="text-sm text-slate-400 py-8 text-center">No past residence records.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((h: any) => (
              <div
                key={h.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-slate-800">
                      {h.hostelName} ({h.wingName})
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      Room {h.roomNumber} • Bed {h.bedCode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {h.academicYear} • Semester {h.semester} • {h.roomType} {h.isAc ? "(AC)" : "(Non-AC)"}
                  </div>
                </div>
                <div className="text-xs text-slate-400 sm:text-right shrink-0">
                  <div>Check-In: {new Date(h.checkInDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
                  <div>Check-Out: {h.checkOutDate ? new Date(h.checkOutDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "Active"}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
