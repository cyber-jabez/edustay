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
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Loading roommate records...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-zinc-500">Roommate records unavailable.</div>;
  }

  const { currentRoom, currentRoommates, requestsSent, requestsReceived, pastHistories } = data;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Roommates & Shared Residence</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Active room occupants and allocation pairing records
        </p>
      </div>

      {/* Current Room Overview */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-zinc-600" />
          <span>Current Room Assignment</span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-zinc-500 block text-[11px]">Hostel & Wing</span>
            <span className="font-medium text-zinc-900">{currentRoom.hostelName} ({currentRoom.wingName})</span>
          </div>
          <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-zinc-500 block text-[11px]">Room Number</span>
            <span className="font-medium text-zinc-900">Room {currentRoom.roomNumber}</span>
          </div>
          <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-zinc-500 block text-[11px]">Assigned Bed</span>
            <span className="font-semibold text-zinc-900">Bed {currentRoom.myBedCode}</span>
          </div>
          <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
            <span className="text-zinc-500 block text-[11px]">Occupancy</span>
            <span className="font-medium text-zinc-900">{currentRoom.currentOccupancy} / {currentRoom.totalBeds} Beds</span>
          </div>
        </div>
      </section>

      {/* Confirmed Current Roommates */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
          <Users className="w-4 h-4 text-zinc-600" />
          <span>Active Roommates</span>
        </h2>

        {currentRoommates.length === 0 ? (
          <div className="text-xs text-zinc-500 py-2">No active roommates allocated in your room.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {currentRoommates.map((rm: any) => (
              <div key={rm.id} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-zinc-900">{rm.fullName}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-700">
                      Bed {rm.bedCode}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-600 mt-1">
                    {rm.identifier} • {rm.programme}
                  </div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">
                    Semester {rm.semester} ({rm.academicYear})
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Mutual Roommate Pairing Requests */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
          <Send className="w-4 h-4 text-zinc-600" />
          <span>Roommate Preferences</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-medium text-zinc-700 block mb-2 text-[11px]">Outgoing Requests:</span>
            {requestsSent.length === 0 ? (
              <div className="text-zinc-400 text-xs">No outgoing preferences submitted.</div>
            ) : (
              requestsSent.map((r: any) => (
                <div key={r.id} className="p-2.5 rounded border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-zinc-900">{r.targetName}</span>
                    <span className="text-zinc-500 block text-[11px]">{r.targetId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 text-[10px] font-medium">
                    {r.status}
                  </span>
                </div>
              ))
            )}
          </div>

          <div>
            <span className="font-medium text-zinc-700 block mb-2 text-[11px]">Incoming Requests:</span>
            {requestsReceived.length === 0 ? (
              <div className="text-zinc-400 text-xs">No incoming requests.</div>
            ) : (
              requestsReceived.map((r: any) => (
                <div key={r.id} className="p-2.5 rounded border border-zinc-200 bg-zinc-50 flex items-center justify-between">
                  <div>
                    <span className="font-medium text-zinc-900">{r.fromName}</span>
                    <span className="text-zinc-500 block text-[11px]">{r.fromId}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 text-[10px] font-medium">
                    {r.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Historical Roommates derived from past residences */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
          <History className="w-4 h-4 text-zinc-600" />
          <span>Previous Roommates</span>
        </h2>

        <div className="space-y-2 text-xs">
          {pastHistories.map((ph: any) => (
            <div key={ph.id} className="p-3 rounded border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-medium text-zinc-900">{ph.roommatesSummary || "Single Room"}</span>
                <span className="text-zinc-500 block text-[11px]">
                  {ph.hostelName} - Room {ph.roomNumber} ({ph.academicYear}, Sem {ph.semester})
                </span>
              </div>
              <span className="text-[11px] text-zinc-400">
                {new Date(ph.checkInDate).toLocaleDateString()} – {ph.checkOutDate ? new Date(ph.checkOutDate).toLocaleDateString() : "Present"}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
