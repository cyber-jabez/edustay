"use client";

import React, { useEffect, useState } from "react";
import {
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
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

      setMessage(`Complaint ticket #${data.complaint.ticketNumber} registered successfully.`);
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
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Hostel Complaints & Maintenance</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Report room, electrical, plumbing, or facility maintenance issues
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

      {/* Ticket Submission Form */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-2.5">
          <Wrench className="w-4 h-4 text-zinc-600" />
          <span>New Maintenance Request</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition bg-white"
              >
                {categories.map((c) => (
                  <option key={c.code} value={c.code}>{c.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition bg-white"
              >
                <option value="LOW">Low (Non-urgent)</option>
                <option value="MEDIUM">Medium (Standard)</option>
                <option value="HIGH">High (Immediate attention)</option>
                <option value="URGENT">Urgent (Safety / leakage)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Subject / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Brief summary of the defect or issue"
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide details about the issue and exact location..."
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium text-xs transition"
            >
              {submitting ? "Submitting..." : "Submit Ticket"}
            </button>
          </div>
        </form>
      </section>

      {/* Existing Tickets Lifecycle List */}
      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-600" />
          <span>My Tickets</span>
        </h2>

        {complaints.length === 0 ? (
          <div className="text-xs text-zinc-500 py-2">No maintenance tickets logged.</div>
        ) : (
          <div className="space-y-3">
            {complaints.map((c) => (
              <div key={c.id} className="p-3.5 rounded border border-zinc-200 bg-zinc-50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-medium text-zinc-900 text-xs">#{c.ticketNumber}</span>
                    <span className="text-[10px] text-zinc-600 bg-zinc-200 px-1.5 py-0.5 rounded">
                      {c.category.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-zinc-600 bg-zinc-200 px-1.5 py-0.5 rounded">
                      {c.priority}
                    </span>
                  </div>

                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">
                    {c.status.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="text-xs font-medium text-zinc-900">{c.title}</div>
                <p className="text-xs text-zinc-600">{c.description}</p>

                {c.resolutionNotes && (
                  <div className="p-2.5 rounded bg-white border border-zinc-200 text-[11px] text-zinc-700">
                    <span className="font-medium text-zinc-900">Staff Resolution: </span>
                    {c.resolutionNotes} ({new Date(c.resolvedAt).toLocaleDateString()})
                  </div>
                )}

                <div className="text-[11px] text-zinc-400 flex items-center justify-between pt-1 border-t border-zinc-200">
                  <span>Hostel: {c.hostel.name} {c.room?.roomNumber ? `• Room ${c.room.roomNumber}` : ""}</span>
                  <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
