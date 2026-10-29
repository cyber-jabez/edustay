"use client";

import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";

export default function StudentNoticesPage() {
  const [notices, setNotices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notices")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setNotices(d?.notices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-6 h-6 border-2 border-karunya-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-slate-500 font-poppins">Loading notices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-4xl font-poppins">
      <div className="border-b border-slate-200 pb-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
          <Bell className="w-4 h-4 text-amber-500" />
        </div>
        <h1 className="text-xl font-bold text-slate-800 font-lora">Announcements</h1>
      </div>

      <div className="space-y-3">
        {notices.length === 0 ? (
          <div className="text-sm text-slate-400 py-10 text-center bg-white border border-slate-200 rounded-xl shadow-card">
            No active announcements.
          </div>
        ) : (
          notices.map((n) => (
            <div
              key={n.id}
              className="bg-white border border-slate-200 rounded-xl p-5 shadow-card hover:border-blue-200 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-slate-800">{n.title}</span>
                    <span className="text-[11px] font-medium text-karunya-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mt-2">{n.content}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0 mt-0.5">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="text-xs text-slate-400 pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
                <span>
                  Issued by: <span className="font-medium text-slate-600">{n.author.fullName}</span>
                </span>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full">
                  {n.targetAudience.replace(/_/g, " ")}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
