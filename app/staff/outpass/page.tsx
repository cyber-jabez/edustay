"use client";

import React, { useEffect, useState } from "react";
import {
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

export default function StaffOutpassDecisionPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  const loadData = () => {
    fetch(`/api/outpass?filter=${filter}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const handleDecision = async (outpassId: string, decision: "APPROVED" | "REJECTED") => {
    setProcessingId(outpassId);
    setMessage(null);

    try {
      const res = await fetch("/api/staff/outpass/decide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outpassId,
          decision,
          comments: commentInput[outpassId] || `Official ${decision} recorded`,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Decision failed");

      setMessage(`Success: ${resData.message}`);
      loadData();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Loading outpass queue...</div>
      </div>
    );
  }

  const outpasses = data?.outpasses || [];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Outpass Authorizations</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Mentor & SRA independent evaluations (both approvals required)
          </p>
        </div>

        {/* Filters */}
        <div className="flex p-0.5 bg-zinc-100 rounded border border-zinc-200 text-xs w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded transition text-xs font-medium ${
              filter === "all" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            All ({outpasses.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded transition text-xs font-medium ${
              filter === "pending" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
            }`}
          >
            Pending
          </button>
        </div>
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

      {/* Outpass Cards List */}
      <div className="space-y-4">
        {outpasses.length === 0 ? (
          <div className="p-8 text-center bg-white border border-zinc-200 rounded-lg text-xs text-zinc-500">
            No outpass applications in this queue.
          </div>
        ) : (
          outpasses.map((op: any) => {
            return (
              <div key={op.id} className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium text-zinc-900 text-xs">{op.outpassNumber}</span>
                      <span className="text-[10px] text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                        {op.formType.name}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-600 mt-1">
                      Student: <span className="font-medium text-zinc-900">{op.student.user.fullName}</span> ({op.student.user.identifier}) • {op.student.currentHostel?.name || "Hostel"} - Room {op.student.currentRoom?.roomNumber || "—"}
                    </div>
                  </div>

                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-800 border border-zinc-200 self-start sm:self-auto">
                    {op.status.replace(/_/g, " ")}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-zinc-50 p-3 rounded border border-zinc-200">
                  <div>
                    <span className="text-zinc-500 text-[11px]">Destination:</span>{" "}
                    <span className="font-medium text-zinc-900">{op.destination}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px]">Phone:</span>{" "}
                    <span className="text-zinc-800">{op.contactPhone}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px]">Departure:</span>{" "}
                    <span className="text-zinc-800">{new Date(op.departureTime).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 text-[11px]">Expected Return:</span>{" "}
                    <span className="text-zinc-800">{new Date(op.expectedReturnTime).toLocaleString()}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-zinc-500 text-[11px]">Reason:</span>{" "}
                    <span className="text-zinc-700">{op.reason}</span>
                  </div>
                </div>

                {/* Current Dual Review Progress */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded border border-zinc-200 bg-zinc-50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-zinc-900">1. Mentor Review</span>
                      <span className="text-[10px] text-zinc-700 bg-zinc-200 px-1.5 py-0.5 rounded">{op.mentorDecision}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      Mentor: {op.mentor?.user.fullName || "Unassigned"}
                    </div>
                    {op.mentorComments && (
                      <div className="text-[11px] text-zinc-600 mt-0.5">"{op.mentorComments}"</div>
                    )}
                  </div>

                  <div className="p-3 rounded border border-zinc-200 bg-zinc-50">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-zinc-900">2. SRA Review</span>
                      <span className="text-[10px] text-zinc-700 bg-zinc-200 px-1.5 py-0.5 rounded">{op.sraDecision}</span>
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      SRA: {op.sra?.user.fullName || "Unassigned"}
                    </div>
                    {op.sraComments && (
                      <div className="text-[11px] text-zinc-600 mt-0.5">"{op.sraComments}"</div>
                    )}
                  </div>
                </div>

                {/* Reviewer Action Bar */}
                <div className="pt-2 border-t border-zinc-100 flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter decision comments..."
                    value={commentInput[op.id] || ""}
                    onChange={(e) => setCommentInput({ ...commentInput, [op.id]: e.target.value })}
                    className="flex-1 text-xs p-1.5 border border-zinc-300 rounded focus:border-zinc-900 focus:outline-none w-full"
                  />

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={processingId === op.id}
                      onClick={() => handleDecision(op.id, "APPROVED")}
                      className="flex-1 sm:flex-none px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium text-xs rounded transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>

                    <button
                      type="button"
                      disabled={processingId === op.id}
                      onClick={() => handleDecision(op.id, "REJECTED")}
                      className="flex-1 sm:flex-none px-3.5 py-1.5 border border-zinc-300 hover:bg-zinc-100 disabled:bg-zinc-100 text-zinc-700 font-medium text-xs rounded transition flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
