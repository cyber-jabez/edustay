"use client";

import React, { useEffect, useState } from "react";
import {
  Bell,
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Loading notices...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="border-b border-zinc-200 pb-4">
        <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Announcements</h1>
        <p className="text-xs text-zinc-500 mt-0.5">
          Official institutional circulars and residence notices
        </p>
      </div>

      <div className="space-y-3">
        {notices.length === 0 ? (
          <div className="text-xs text-zinc-500 py-6 text-center bg-white border border-zinc-200 rounded-lg">
            No active announcements.
          </div>
        ) : (
          notices.map((n) => (
            <div key={n.id} className="bg-white border border-zinc-200 rounded-lg p-5 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-900">{n.title}</span>
                  <span className="text-[10px] text-zinc-600 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                    {n.category}
                  </span>
                </div>
                <span className="text-[11px] text-zinc-400">
                  {new Date(n.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              <p className="text-xs text-zinc-600 leading-relaxed">{n.content}</p>

              <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-100 flex items-center justify-between">
                <span>Issued by: {n.author.fullName}</span>
                <span>{n.targetAudience.replace(/_/g, " ")}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
