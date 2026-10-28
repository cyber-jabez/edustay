"use client";

import React, { useState } from "react";
import {
  Bell,
  Send,
  CheckCircle2,
  AlertCircle,
  Megaphone,
} from "lucide-react";

export default function StaffNoticesPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [targetAudience, setTargetAudience] = useState("ALL_STUDENTS");
  const [publishing, setPublishing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setMessage(null);

    try {
      const res = await fetch("/api/notices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          category,
          targetAudience,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish notice");

      setMessage(`Notice '${title}' published successfully to targeted audience.`);
      setTitle("");
      setContent("");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Publish Residence Notices & Circulars</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Broadcast official university circulars, prayer timings, and hostel announcements
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

      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 text-xs">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
          <Megaphone className="w-4 h-4 text-[#0072bc]" />
          <span>Notice Details & Targeting</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Notice Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                <option value="GENERAL">General Notice</option>
                <option value="HOSTEL">Hostel & Residence</option>
                <option value="MESS">Mess & Dining</option>
                <option value="ACADEMIC">Academic & Exams</option>
                <option value="URGENT">Urgent Circular</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                <option value="ALL_STUDENTS">All University Students</option>
                <option value="HOSTEL_SPECIFIC">Specific Hostel Residents</option>
                <option value="WING_SPECIFIC">Specific Wing</option>
                <option value="ACADEMIC_YEAR">Particular Academic Year</option>
                <option value="STAFF_ONLY">Residence Staff Only</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 font-semibold block mb-1">Notice Headline / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Evening Assembly Timings for Even Semester"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 font-semibold block mb-1">Notice Announcement Body</label>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter complete instructions, dates, deadlines, and guidelines"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={publishing}
              className="px-6 py-2.5 bg-[#0072bc] hover:bg-[#005ea2] disabled:bg-slate-400 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>{publishing ? "Publishing..." : "Publish Official Circular"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

