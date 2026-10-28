"use client";

import React, { useEffect, useState } from "react";
import {
  Building,
  BedDouble,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Shield,
} from "lucide-react";

export default function StaffAllocationsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [allocating, setAllocating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form State
  const [targetStudentId, setTargetStudentId] = useState("");
  const [targetBedId, setTargetBedId] = useState("");
  const [remarks, setRemarks] = useState("Administrative Allotment by Hostel Admin");

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading residence allocation engine...</div>
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
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Hostel Room & Bed Allocation Engine</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Assign verified student bed allotments and maintain residence hierarchy (Hostel → Wing → Floor → Room → Bed)
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 ${
          message.startsWith("Error")
            ? "bg-rose-50 border border-rose-200 text-rose-700"
            : "bg-emerald-50 border border-emerald-200 text-emerald-700"
        }`}>
          {message.startsWith("Error") ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{message}</span>
        </div>
      )}

      {/* Manual Allocation Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <BedDouble className="w-4 h-4 text-[#0072bc]" />
          <span>Execute Official Bed Allotment</span>
        </h2>

        <form onSubmit={handleAllocate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Select Student from Preference Queue</label>
              <select
                required
                value={targetStudentId}
                onChange={(e) => setTargetStudentId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                <option value="">-- Choose Student Request --</option>
                {pendingPreferences.map((p: any) => (
                  <option key={p.id} value={p.student.id}>
                    {p.student.user.fullName} ({p.student.user.identifier}) - Pref: {p.preferredRoomType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">
                Select Available Bed ({availableBeds.length} Unoccupied)
              </label>
              <select
                required
                value={targetBedId}
                onChange={(e) => setTargetBedId(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                <option value="">-- Choose Available Bed --</option>
                {availableBeds.map((b: any) => (
                  <option key={b.bedId} value={b.bedId}>
                    {b.hostelName} - {b.wingName} | Room {b.roomNumber} (Bed {b.bedCode}) - {b.roomType}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 font-semibold block mb-1">Official Allocation Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={allocating || !targetStudentId || !targetBedId}
              className="px-6 py-2.5 bg-[#0072bc] hover:bg-[#005ea2] disabled:bg-slate-400 text-white font-bold rounded-lg shadow-sm transition"
            >
              {allocating ? "Executing Transaction..." : "Confirm & Persist Bed Allocation"}
            </button>
          </div>
        </form>
      </section>

      {/* Recent Allocations Audit List */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2.5">
          <span>Recent Confirmed Bed Allocations</span>
          <span className="text-slate-400 font-medium">PostgreSQL Transaction Safe</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Register No</th>
                <th className="py-2.5 px-3">Hostel</th>
                <th className="py-2.5 px-3">Room & Bed</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Allocation Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {recentAllocations.map((a: any) => (
                <tr key={a.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{a.student.user.fullName}</td>
                  <td className="py-2.5 px-3 font-mono text-[#0072bc]">{a.student.user.identifier}</td>
                  <td className="py-2.5 px-3">{a.hostel.name}</td>
                  <td className="py-2.5 px-3 font-mono font-bold">Room {a.room.roomNumber} ({a.bed.bedCode})</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      {a.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500">{new Date(a.allocationDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

