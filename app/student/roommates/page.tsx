"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Building,
  CheckCircle2,
  Clock,
  UserCheck,
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading verified roommate records...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-slate-500">Roommate records unavailable.</div>;
  }

  const { currentRoom, currentRoommates, requestsSent, requestsReceived, pastHistories } = data;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Roommates & Shared Residence</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Confirmed room occupants derived from overlapping PostgreSQL allocation records
        </p>
      </div>

      {/* Current Room Overview */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-[#0072bc]" />
          <span>Current Residence Room Details</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block">Hostel & Wing</span>
            <span className="font-bold text-slate-800">{currentRoom.hostelName} ({currentRoom.wingName})</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block">Room Number</span>
            <span className="font-bold text-slate-800">Room {currentRoom.roomNumber}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block">Assigned Bed</span>
            <span className="font-bold text-[#0072bc]">Bed {currentRoom.myBedCode}</span>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-slate-500 block">Occupancy</span>
            <span className="font-bold text-slate-800">{currentRoom.currentOccupancy} / {currentRoom.totalBeds} Beds Filled</span>
          </div>
        </div>
      </section>

      {/* Confirmed Current Roommates */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Active Confirmed Roommates</span>
        </h2>

        {currentRoommates.length === 0 ? (
          <div className="text-xs text-slate-500 py-3">No active roommates allocated in your room.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {currentRoommates.map((rm: any) => (
              <div key={rm.id} className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{rm.fullName}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                      Confirmed Bed {rm.bedCode}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {rm.identifier} • {rm.programme}
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Semester {rm.semester} ({rm.academicYear})
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mutual Roommate Pairing Requests */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Send className="w-4 h-4 text-purple-600" />
          <span>Roommate Selection Preference Requests</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-bold text-slate-700 block mb-2">Outgoing Requests Sent:</span>
            {requestsSent.length === 0 ? (
              <div className="text-slate-400">No outgoing roommate preferences submitted.</div>
            ) : (
              requestsSent.map((r: any) => (
                <div key={r.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{r.targetName}</span>
                    <span className="text-slate-500 block text-[11px]">{r.targetId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {r.status}
                  </span>
                </div>
              ))
            )}
          </div>

          <div>
            <span className="font-bold text-slate-700 block mb-2">Incoming Requests Received:</span>
            {requestsReceived.length === 0 ? (
              <div className="text-slate-400">No incoming roommate requests.</div>
            ) : (
              requestsReceived.map((r: any) => (
                <div key={r.id} className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800">{r.fromName}</span>
                    <span className="text-slate-500 block text-[11px]">{r.fromId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 text-[10px] font-bold">
                    {r.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Historical Roommates derived from past residences */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-600" />
          <span>Previous Roommates from Historical Allocations</span>
        </h2>

        <div className="space-y-2 text-xs">
          {pastHistories.map((ph: any) => (
            <div key={ph.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-800">{ph.roommatesSummary || "Individual Room"}</span>
                <span className="text-slate-500 block text-[11px]">
                  {ph.hostelName} - Room {ph.roomNumber} ({ph.academicYear}, Sem {ph.semester})
                </span>
              </div>
              <span className="text-[10px] text-slate-400">
                {new Date(ph.checkInDate).toLocaleDateString()} to {ph.checkOutDate ? new Date(ph.checkOutDate).toLocaleDateString() : "Present"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

