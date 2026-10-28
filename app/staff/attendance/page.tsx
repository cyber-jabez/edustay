"use client";

import React, { useEffect, useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  Calendar,
  Building,
  AlertCircle,
  Save,
  Users,
} from "lucide-react";

export default function StaffAttendancePage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Filters
  const [selectedHostelId, setSelectedHostelId] = useState("");
  const [selectedWingId, setSelectedWingId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);

  // Attendance Records State: Map of studentId -> status
  const [records, setRecords] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/staff/attendance")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) {
          setData(d);
          if (d.hostels?.length > 0) {
            setSelectedHostelId(d.hostels[0].id);
            if (d.hostels[0].wings?.length > 0) {
              setSelectedWingId(d.hostels[0].wings[0].id);
            }
          }
          // Default all students to PRESENT
          const initialMap: Record<string, string> = {};
          d.students?.forEach((s: any) => {
            initialMap[s.id] = "PRESENT";
          });
          setRecords(initialMap);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleStatusChange = (studentId: string, status: string) => {
    setRecords((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: string) => {
    const updated: Record<string, string> = {};
    data?.students?.forEach((s: any) => {
      updated[s.id] = status;
    });
    setRecords(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const recordsArray = Object.entries(records).map(([studentId, status]) => ({
        studentId,
        status,
        remarks: status === "PRESENT" ? "Present at 08:30 PM roll call" : `Marked as ${status}`,
      }));

      const res = await fetch("/api/staff/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hostelId: selectedHostelId,
          wingId: selectedWingId,
          date: attendanceDate,
          records: recordsArray,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Attendance submission failed");

      setMessage(`Success: ${resData.message}`);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading student resident roll call roster...</div>
      </div>
    );
  }

  const students = data?.students || [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">SRA Daily Hostel Night Roll-Call Marking</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Mark and persist 08:30 PM attendance records for assigned residence wings into PostgreSQL
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

      {/* Roster Controls */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-slate-700 font-semibold block mb-1">Hostel Residence</label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800">
              Father Duraisamy Hostel
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Wing Scope</label>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800">
              A Block (Floors 1-4)
            </div>
          </div>

          <div>
            <label className="text-slate-700 font-semibold block mb-1">Roll-Call Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Quick Action:</span>
            <button
              type="button"
              onClick={() => handleMarkAll("PRESENT")}
              className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 font-bold"
            >
              Mark All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll("ABSENT")}
              className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 font-bold"
            >
              Mark All Absent
            </button>
          </div>

          <span className="text-slate-400 font-medium">{students.length} Residents in Roster</span>
        </div>
      </section>

      {/* Roster Table */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Room & Bed</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Register Number</th>
                <th className="py-3 px-4 text-center">Mark Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {students.map((s: any) => {
                const currentStatus = records[s.id] || "PRESENT";

                return (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      Room {s.currentRoom?.roomNumber || "N/A"} (Bed {s.currentBed?.bedCode || "N/A"})
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-800">{s.user.fullName}</td>
                    <td className="py-3 px-4 font-mono text-[#0072bc]">{s.user.identifier}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-center gap-2">
                        {["PRESENT", "APPROVED_OUTPASS", "ABSENT", "EXCUSED"].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(s.id, st)}
                            className={`px-2.5 py-1 rounded text-[10px] font-bold transition ${
                              currentStatus === st
                                ? st === "PRESENT"
                                  ? "bg-emerald-600 text-white"
                                  : st === "APPROVED_OUTPASS"
                                  ? "bg-amber-500 text-white"
                                  : st === "ABSENT"
                                  ? "bg-rose-600 text-white"
                                  : "bg-purple-600 text-white"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {st.replace("_", " ")}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Roll-Call..." : "Save and Submit Official Roll-Call Session"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

