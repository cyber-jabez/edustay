"use client";

import React, { useEffect, useState } from "react";
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Send,
} from "lucide-react";

export default function StudentComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [category, setCategory] = useState("WIFI");
  const [priority, setPriority] = useState("MEDIUM");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const categories = [
    { code: "WIFI", label: "Wi-Fi & Campus Internet" },
    { code: "ELECTRICAL", label: "Electrical (Fans, Lights, Sockets)" },
    { code: "PLUMBING", label: "Plumbing & Restroom Fixtures" },
    { code: "ROOM_MAINTENANCE", label: "Room Maintenance & Doors" },
    { code: "CLEANING", label: "Housekeeping & Cleaning" },
    { code: "MESS_QUALITY", label: "Mess Quality & Food Hygiene" },
    { code: "FURNITURE", label: "Study Desk & Bed Furniture" },
    { code: "WATER_SUPPLY", label: "Drinking & Hot Water" },
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
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setMessage(`Ticket #${data.complaint.ticketNumber} registered successfully.`);
      setTitle("");
      setDescription("");

      const refreshed = await fetch("/api/complaints").then((r) => r.json());
      setComplaints(refreshed.complaints || []);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "IN_PROGRESS":
        return "bg-blue-50 text-karunya-blue border-blue-200";
      case "CLOSED":
        return "bg-slate-100 text-slate-600 border-slate-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  const priorityStyle = (p: string) => {
    switch (p) {
      case "URGENT":
        return "bg-red-50 text-red-600 border-red-200";
      case "HIGH":
        return "bg-orange-50 text-orange-600 border-orange-200";
      case "LOW":
        return "bg-slate-50 text-slate-500 border-slate-200";
      default:
        return "bg-blue-50 text-karunya-blue border-blue-200";
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-6 h-6 border-2 border-karunya-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-slate-500 font-poppins">Loading complaints...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl font-poppins">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 font-lora">Hostel Complaints & Maintenance</h1>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 border ${
            message.startsWith("Error")
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}
        >
          {message.startsWith("Error") ? (
            <AlertCircle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{message}</span>
        </div>
      )}

      {/* Submission Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Wrench className="w-4 h-4 text-karunya-blue" />
          <h2 className="text-sm font-semibold text-slate-800 font-lora">New Maintenance Request</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition bg-white"
              >
                {categories.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition bg-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Subject
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Summary of the issue"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Description
              </label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of the issue..."
                className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-karunya-blue hover:bg-sky-600 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Submitting..." : "Submit Ticket"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Tickets List */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
          <Clock className="w-4 h-4 text-slate-400" />
          <h2 className="text-sm font-semibold text-slate-800 font-lora">My Tickets</h2>
        </div>

        {complaints.length === 0 ? (
          <div className="text-sm text-slate-400 py-8 text-center">No maintenance tickets logged.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {complaints.map((c) => (
              <div key={c.id} className="p-5 space-y-2.5 hover:bg-slate-50/50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">#{c.ticketNumber}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${priorityStyle(c.priority)}`}>
                      {c.priority}
                    </span>
                    <span className="text-[10px] text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {c.category.replace(/_/g, " ")}
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${statusStyle(c.status)}`}>
                    {c.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="text-sm font-semibold text-slate-800">{c.title}</div>
                <p className="text-sm text-slate-600">{c.description}</p>

                {c.resolutionNotes && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800">
                    <span className="font-semibold">Resolution: </span>
                    {c.resolutionNotes} ({new Date(c.resolvedAt).toLocaleDateString()})
                  </div>
                )}

                <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100">
                  <span>{c.hostel.name} {c.room?.roomNumber ? `• Room ${c.room.roomNumber}` : ""}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
