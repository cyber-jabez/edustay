"use client";

import React, { useEffect, useState } from "react";
import {
  Wrench,
  CheckCircle2,
  Clock,
  AlertCircle,
  Save,
  MessageSquare,
} from "lucide-react";

export default function StaffComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const loadComplaints = () => {
    fetch("/api/complaints")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setComplaints(d?.complaints || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleUpdate = async (complaintId: string) => {
    setUpdatingId(complaintId);
    setMessage(null);

    const newStatus = statusMap[complaintId] || "IN_PROGRESS";
    const notes = notesMap[complaintId] || "Servicing updated by hostel staff";

    try {
      const res = await fetch("/api/complaints", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complaintId,
          status: newStatus,
          resolutionNotes: notes,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setMessage(`Complaint ticket status updated to ${newStatus}.`);
      loadComplaints();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading complaints queue...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Hostel Maintenance & Repair Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Review, assign and mark completion for student residence complaints
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

      <div className="space-y-4">
        {complaints.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-xs text-slate-500">
            No active maintenance complaints.
          </div>
        ) : (
          complaints.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{c.ticketNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                      {c.category.replace("_", " ")}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      c.priority === "URGENT" || c.priority === "HIGH"
                        ? "bg-rose-100 text-rose-800"
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {c.priority}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700 mt-1">
                    Student: {c.student?.user?.fullName} ({c.student?.user?.identifier}) • Venue: {c.hostel.name} - Room {c.room?.roomNumber || "N/A"}
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-1 rounded self-start sm:self-auto ${
                  c.status === "RESOLVED" || c.status === "CLOSED"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {c.status.replace("_", " ")}
                </span>
              </div>

              <div className="text-xs font-bold text-slate-900">{c.title}</div>
              <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {c.description}
              </p>

              {/* Staff Action Controls */}
              <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="text-slate-600 font-semibold block mb-1">Update Status</label>
                  <select
                    value={statusMap[c.id] || c.status}
                    onChange={(e) => setStatusMap({ ...statusMap, [c.id]: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="ACKNOWLEDGED">Acknowledged</option>
                    <option value="ASSIGNED">Assigned to Tech</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved (Fixed)</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-slate-600 font-semibold block mb-1">Resolution Comments</label>
                    <input
                      type="text"
                      placeholder="e.g. Wi-Fi router rebooted / lamp replaced by CIT team"
                      value={notesMap[c.id] || c.resolutionNotes || ""}
                      onChange={(e) => setNotesMap({ ...notesMap, [c.id]: e.target.value })}
                      className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={updatingId === c.id}
                    onClick={() => handleUpdate(c.id)}
                    className="px-4 py-2 bg-[#0072bc] hover:bg-[#005ea2] disabled:bg-slate-400 text-white font-bold rounded-lg shadow-sm transition"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

