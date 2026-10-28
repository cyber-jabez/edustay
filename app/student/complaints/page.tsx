"use client";

import React, { useEffect, useState } from "react";
import {
  Wrench,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Send,
  Building,
  AlertCircle,
  MessageSquare,
} from "lucide-react";

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form State
  const [category, setCategory] = useState("WIFI");
  const [priority, setPriority] = useState("MEDIUM");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const categories = [
    { code: "WIFI", label: "Wi-Fi & Campus Internet" },
    { code: "ELECTRICAL", label: "Electrical (Fans, Lights, Power Sockets)" },
    { code: "PLUMBING", label: "Plumbing & Restroom Fixtures" },
    { code: "ROOM_MAINTENANCE", label: "Room Maintenance & Doors" },
    { code: "CLEANING", label: "Housekeeping & Waste Management" },
    { code: "MESS_QUALITY", label: "Mess Quality & Hygiene" },
    { code: "FURNITURE", label: "Study Desk & Bed Furniture" },
    { code: "WATER_SUPPLY", label: "Drinking Water & Solar Water" },
    { code: "SECURITY", label: "Residence Security & Access" },
  ];

  useEffect(() => {
    fetch("/api/complaints")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setComplaints(d?.complaints || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/complaints", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, priority, title, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Complaint submission failed");

      setMessage(`Complaint ticket ${data.complaint.ticketNumber} registered successfully.`);
      setTitle("");
      setDescription("");

      // Refresh list
      const refreshed = await fetch("/api/complaints").then((r) => r.json());
      setComplaints(refreshed.complaints || []);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading maintenance complaints...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Hostel Complaints & Maintenance Services</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Report infrastructure, network, electrical, plumbing and residence issues for prompt resolution
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

      {/* Ticket Submission Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Wrench className="w-4 h-4 text-[#0072bc]" />
          <span>Register New Maintenance Ticket</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Issue Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Urgency Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                <option value="LOW">Low (Non-urgent)</option>
                <option value="MEDIUM">Medium (Normal daily routine)</option>
                <option value="HIGH">High (Impacts study/comfort)</option>
                <option value="URGENT">Urgent (Safety/leakage/power outage)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 font-semibold block mb-1">Issue Summary / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Wi-Fi router keeps resetting or ceiling fan speed regulator broken"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 font-semibold block mb-1">Detailed Description of Problem</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe exact location within room, timing, and nature of defect"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-[#0072bc] hover:bg-[#005ea2] disabled:bg-slate-400 text-white font-bold text-xs shadow-sm transition"
            >
              {submitting ? "Registering..." : "Submit Maintenance Ticket"}
            </button>
          </div>
        </form>
      </section>

      {/* Existing Tickets Lifecycle List */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-600" />
          <span>My Maintenance Tickets & Resolution Status</span>
        </h2>

        {complaints.length === 0 ? (
          <div className="text-xs text-slate-500 py-3">No maintenance tickets logged.</div>
        ) : (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{c.ticketNumber}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
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

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                    c.status === "RESOLVED" || c.status === "CLOSED"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-amber-100 text-amber-800"
                  }`}>
                    {c.status.replace("_", " ")}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-800">{c.title}</div>
                <p className="text-xs text-slate-600">{c.description}</p>

                {c.resolutionNotes && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900">
                    <span className="font-bold">Staff Resolution: </span>
                    {c.resolutionNotes} (Resolved on {new Date(c.resolvedAt).toLocaleDateString()})
                  </div>
                )}

                <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-100">
                  <span>Venue: {c.hostel.name} - Room {c.room?.roomNumber || "N/A"}</span>
                  <span>Submitted on: {new Date(c.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

