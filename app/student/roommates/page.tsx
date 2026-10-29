"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Building,
  Send,
  History,
} from "lucide-react";

export default function RoommatesPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/roommates")
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
        <div className="text-sm text-slate-500 font-poppins">Loading roommate records...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-slate-500 font-poppins">Roommate records unavailable.</div>;
  }

  const { currentRoom, currentRoommates, requestsSent, requestsReceived, pastHistories } = data;

  return (
    <div className="space-y-5 max-w-4xl font-poppins">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 font-lora">Roommates & Shared Residence</h1>
      </div>

      {/* Current Room Overview */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <Building className="w-4 h-4 text-karunya-blue" />
          <h2 className="text-sm font-semibold text-slate-800 font-lora">Current Room Assignment</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Hostel & Wing", value: `${currentRoom.hostelName} (${currentRoom.wingName})` },
            { label: "Room Number", value: `Room ${currentRoom.roomNumber}` },
            { label: "Assigned Bed", value: `Bed ${currentRoom.myBedCode}` },
            { label: "Occupancy", value: `${currentRoom.currentOccupancy} / ${currentRoom.totalBeds} Beds` },
          ].map((f) => (
            <div key={f.label} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-400 font-medium block mb-1">{f.label}</span>
              <span className="text-sm font-semibold text-slate-800">{f.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Active Roommates */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <Users className="w-4 h-4 text-karunya-blue" />
          <h2 className="text-sm font-semibold text-slate-800 font-lora">Active Roommates</h2>
        </div>
        {currentRoommates.length === 0 ? (
          <div className="text-sm text-slate-400 py-4 text-center">No active roommates allocated.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentRoommates.map((rm: any) => (
              <div
                key={rm.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/40 hover:border-blue-200 transition"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-800">{rm.fullName}</span>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-karunya-blue/10 text-karunya-blue border border-blue-100">
                    Bed {rm.bedCode}
                  </span>
                </div>
                <div className="text-xs text-slate-500">
                  {rm.identifier} • {rm.programme}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Semester {rm.semester} ({rm.academicYear})
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Roommate Preferences */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
          <Send className="w-4 h-4 text-karunya-blue" />
          <h2 className="text-sm font-semibold text-slate-800 font-lora">Roommate Preferences</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Outgoing Requests", items: requestsSent, nameKey: "targetName", idKey: "targetId" },
            { label: "Incoming Requests", items: requestsReceived, nameKey: "fromName", idKey: "fromId" },
          ].map((section) => (
            <div key={section.label}>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                {section.label}
              </span>
              {section.items.length === 0 ? (
                <div className="text-sm text-slate-400 py-2">No records.</div>
              ) : (
                section.items.map((r: any) => (
                  <div
                    key={r.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between mb-2"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-800">{r[section.nameKey]}</span>
                      <span className="text-xs text-slate-400 block">{r[section.idKey]}</span>
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-karunya-blue border border-blue-100">
                      {r.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Previous Roommates */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
          <History className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-800 font-lora">Previous Roommates</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {pastHistories.map((ph: any) => (
            <div
              key={ph.id}
              className="px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 transition"
            >
              <div>
                <span className="text-sm font-semibold text-slate-800">{ph.roommatesSummary || "Single Room"}</span>
                <span className="text-xs text-slate-400 block mt-0.5">
                  {ph.hostelName} — Room {ph.roomNumber} • {ph.academicYear}, Sem {ph.semester}
                </span>
              </div>
              <span className="text-xs text-slate-400 shrink-0">
                {new Date(ph.checkInDate).toLocaleDateString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}{" "}
                –{" "}
                {ph.checkOutDate
                  ? new Date(ph.checkOutDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  : "Present"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
