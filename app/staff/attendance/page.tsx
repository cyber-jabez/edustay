"use client";

import React, { useEffect, useState } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  AlertCircle,
  Save,
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Loading student roster...</div>
      </div>
    );
  }

  const students = data?.students || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Hostel Attendance (Roll-Call)</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Mark 08:30 PM attendance records for assigned residence wings
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

      {/* Roster Controls */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-zinc-500 block mb-1 text-[11px]">Hostel</label>
            <div className="p-2 bg-zinc-50 border border-zinc-200 rounded font-medium text-zinc-900">
              Father Duraisamy Hostel
            </div>
          </div>

          <div>
            <label className="text-zinc-500 block mb-1 text-[11px]">Wing Scope</label>
            <div className="p-2 bg-zinc-50 border border-zinc-200 rounded font-medium text-zinc-900">
              A Block (Floors 1-4)
            </div>
          </div>

          <div>
            <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Date</label>
            <input
              type="date"
              value={attendanceDate}
              onChange={(e) => setAttendanceDate(e.target.value)}
              className="w-full p-1.5 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
          <div className="flex items-center gap-2">
            <span className="text-zinc-500 text-[11px]">Quick Action:</span>
            <button
              type="button"
              onClick={() => handleMarkAll("PRESENT")}
              className="px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 text-[11px] font-medium"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => handleMarkAll("ABSENT")}
              className="px-2 py-1 rounded bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 text-[11px] font-medium"
            >
              All Absent
            </button>
          </div>

          <span className="text-zinc-400 text-[11px]">{students.length} Residents</span>
        </div>
      </section>

      {/* Roster Table */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-white border border-zinc-200 rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-600 font-medium border-b border-zinc-200">
              <tr>
                <th className="py-2.5 px-3">Room & Bed</th>
                <th className="py-2.5 px-3">Student Name</th>
                <th className="py-2.5 px-3">Register Number</th>
                <th className="py-2.5 px-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {students.map((s: any) => {
                const currentStatus = records[s.id] || "PRESENT";

                return (
                  <tr key={s.id} className="hover:bg-zinc-50 transition">
                    <td className="py-2.5 px-3 font-mono font-medium text-zinc-900">
                      Room {s.currentRoom?.roomNumber || "—"} ({s.currentBed?.bedCode || "—"})
                    </td>
                    <td className="py-2.5 px-3 font-medium text-zinc-900">{s.user.fullName}</td>
                    <td className="py-2.5 px-3 font-mono text-zinc-600">{s.user.identifier}</td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center justify-center gap-1.5">
                        {["PRESENT", "APPROVED_OUTPASS", "ABSENT", "EXCUSED"].map((st) => (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(s.id, st)}
                            className={`px-2 py-0.5 rounded text-[10px] font-medium transition ${
                              currentStatus === st
                                ? "bg-zinc-900 text-white"
                                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                            }`}
                          >
                            {st === "APPROVED_OUTPASS" ? "Outpass" : st.charAt(0) + st.slice(1).toLowerCase()}
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
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium text-xs rounded transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Attendance"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
