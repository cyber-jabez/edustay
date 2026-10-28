"use client";

import React, { useState } from "react";
import {
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

      setMessage(`Notice '${title}' published successfully.`);
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
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Publish Announcements</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Broadcast university circulars and residence announcements
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

      <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4 text-xs">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2 border-b border-zinc-100 pb-2.5">
          <Megaphone className="w-4 h-4 text-zinc-600" />
          <span>Notice Content</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition bg-white"
              >
                <option value="GENERAL">General Notice</option>
                <option value="HOSTEL">Hostel & Residence</option>
                <option value="MESS">Mess & Dining</option>
                <option value="ACADEMIC">Academic & Exams</option>
                <option value="URGENT">Urgent Circular</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition bg-white"
              >
                <option value="ALL_STUDENTS">All Students</option>
                <option value="HOSTEL_SPECIFIC">Specific Hostel</option>
                <option value="WING_SPECIFIC">Specific Wing</option>
                <option value="ACADEMIC_YEAR">Academic Year</option>
                <option value="STAFF_ONLY">Staff Only</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-500 block mb-1 text-[11px]">Headline / Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Evening Assembly Timings for Even Semester"
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-500 block mb-1 text-[11px]">Notice Body</label>
              <textarea
                rows={5}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter instructions, dates, deadlines, or guidelines..."
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={publishing}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium rounded text-xs transition flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{publishing ? "Publishing..." : "Publish Notice"}</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
