"use client";

import React, { useEffect, useState } from "react";
import {
  BedDouble,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function StaffAllocationsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form State
  const [targetStudentId, setTargetStudentId] = useState("");
  const [targetBedId, setTargetBedId] = useState("");
  const [remarks, setRemarks] = useState("Administrative Allotment");

  const loadData = () => {
    fetch("/api/staff/allocations")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setAllocating(true);
    setMessage(null);

    try {
      const res = await fetch("/api/staff/allocations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: targetStudentId,
          bedId: targetBedId,
          remarks,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Allocation failed");

      setMessage(`Success: ${resData.message}`);
      setTargetStudentId("");
      setTargetBedId("");
      loadData();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setAllocating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Loading allocations...</div>
      </div>
    );
  }

  const { hostels = [], pendingPreferences = [], recentAllocations = [] } = data || {};

  // Flatten available beds
  const availableBeds: any[] = [];
  hostels.forEach((h: any) => {
    h.wings.forEach((w: any) => {
      w.floors.forEach((f: any) => {
        f.rooms.forEach((r: any) => {
          r.beds.forEach((b: any) => {
            if (!b.isOccupied) {
              availableBeds.push({
                bedId: b.id,
                bedCode: b.bedCode,
                roomNumber: r.roomNumber,
                roomType: r.roomType,
                hostelName: h.name,
                wingName: w.name,
              });
            }
          });
        });
      });
    });
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Hostel Bed Allocations</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Assign student room and bed allotments across residence halls
        </p>
      </div>

      {message && (
        <div
          className={`p-3 rounded text-xs flex items-center gap-2 border ${
            message.startsWith("Error")
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-zinc-50 border-zinc-200 text-zinc-800"
          }`}
        >
          {message.startsWith("Error") ? (
            <AlertCircle className="w-4 h-4 text-red-600" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-zinc-700" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Manual Allocation Form */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4 text-xs">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-2.5">
          <BedDouble className="w-4 h-4 text-zinc-600" />
          <span>Execute Bed Allotment</span>
        </h2>

        <form onSubmit={handleAllocate} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Select Student Request</label>
              <select
                required
                value={targetStudentId}
                onChange={(e) => setTargetStudentId(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition bg-white"
              >
                <option value="">-- Choose Student --</option>
                {pendingPreferences.map((p: any) => (
                  <option key={p.id} value={p.student.id}>
                    {p.student.user.fullName} ({p.student.user.identifier}) - {p.preferredRoomType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">
                Select Bed ({availableBeds.length} Available)
              </label>
              <select
                required
                value={targetBedId}
                onChange={(e) => setTargetBedId(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition bg-white"
              >
                <option value="">-- Choose Bed --</option>
                {availableBeds.map((b: any) => (
                  <option key={b.bedId} value={b.bedId}>
                    {b.hostelName} - {b.wingName} | Room {b.roomNumber} (Bed {b.bedCode}) - {b.roomType}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-500 block mb-1 text-[11px]">Allocation Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={allocating || !targetStudentId || !targetBedId}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium rounded text-xs transition"
            >
              {allocating ? "Processing..." : "Confirm Allocation"}
            </button>
          </div>
        </form>
      </section>

      {/* Recent Allocations Audit List */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3 text-xs">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-2.5">
          Recent Allocations
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-zinc-50 text-zinc-600 font-medium border-b border-zinc-200">
              <tr>
                <th className="py-2 px-3">Student Name</th>
                <th className="py-2 px-3">Register No</th>
                <th className="py-2 px-3">Hostel</th>
                <th className="py-2 px-3">Room & Bed</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {recentAllocations.map((a: any) => (
                <tr key={a.id} className="hover:bg-zinc-50 transition">
                  <td className="py-2.5 px-3 font-medium text-zinc-900">{a.student.user.fullName}</td>
                  <td className="py-2.5 px-3 font-mono text-zinc-600">{a.student.user.identifier}</td>
                  <td className="py-2.5 px-3">{a.hostel.name}</td>
                  <td className="py-2.5 px-3 font-mono">Room {a.room.roomNumber} ({a.bed.bedCode})</td>
                  <td className="py-2.5 px-3">
                    <span className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 text-[10px] border border-zinc-200">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-zinc-500">{new Date(a.allocationDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
