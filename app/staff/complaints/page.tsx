"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  AlertCircle,
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Maintenance Management</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Review, assign and update student residence complaints
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

      <div className="space-y-3">
        {complaints.length === 0 ? (
          <div className="p-8 text-center bg-white border border-zinc-200 rounded-lg text-xs text-zinc-500">
            No active maintenance complaints.
          </div>
        ) : (
          complaints.map((c) => (
            <div key={c.id} className="bg-white border border-zinc-200 rounded-lg p-5 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-zinc-900 text-xs">#{c.ticketNumber}</span>
                    <span className="text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                      {c.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                      {c.priority}
                    </span>
                  </div>
                  <div className="text-xs text-zinc-600 mt-1">
                    Student: {c.student?.user?.fullName} ({c.student?.user?.identifier}) • {c.hostel.name} - Room {c.room?.roomNumber || "—"}
                  </div>
                </div>

                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 self-start sm:self-auto">
                  {c.status.replace(/_/g, " ")}
                </span>
              </div>

              <div className="text-xs font-medium text-zinc-900">{c.title}</div>
              <p className="text-xs text-zinc-600 bg-zinc-50 p-2.5 rounded border border-zinc-200">
                {c.description}
              </p>

              {/* Staff Action Controls */}
              <div className="pt-2 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                <div>
                  <label className="text-zinc-500 block mb-1 text-[11px]">Update Status</label>
                  <select
                    value={statusMap[c.id] || c.status}
                    onChange={(e) => setStatusMap({ ...statusMap, [c.id]: e.target.value })}
                    className="w-full p-1.5 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition bg-white"
                  >
                    <option value="SUBMITTED">Submitted</option>
                    <option value="ACKNOWLEDGED">Acknowledged</option>
                    <option value="ASSIGNED">Assigned</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>

                <div className="sm:col-span-2 flex items-end gap-2">
                  <div className="flex-1">
                    <label className="text-zinc-500 block mb-1 text-[11px]">Resolution Notes</label>
                    <input
                      type="text"
                      placeholder="e.g. Wi-Fi router rebooted / fixture replaced"
                      value={notesMap[c.id] || c.resolutionNotes || ""}
                      onChange={(e) => setNotesMap({ ...notesMap, [c.id]: e.target.value })}
                      className="w-full p-1.5 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={updatingId === c.id}
                    onClick={() => handleUpdate(c.id)}
                    className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium rounded text-xs transition"
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
