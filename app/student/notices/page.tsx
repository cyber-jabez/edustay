"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
  Calendar,
  Building,
  UserCheck,
  ShieldAlert,
} from "lucide-react";

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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading university and residence notices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Hostel & Campus Announcements</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Official institutional circulars, assembly notices, and residence guidelines
        </p>
      </div>

      <div className="space-y-4">
        {notices.length === 0 ? (
          <div className="text-xs text-slate-500 py-6 text-center bg-white border rounded-xl">
            No active announcements.
          </div>
        ) : (
          notices.map((n) => (
            <div key={n.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{n.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-[#0072bc]">
                    {n.category}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{n.content}</p>

              <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-100 flex items-center justify-between">
                <span>Issued by: {n.author.fullName} ({n.author.role})</span>
                <span className="text-slate-400">Target: {n.targetAudience.replace("_", " ")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

