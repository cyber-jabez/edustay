"use client";

import React, { useEffect, useState } from "react";
import {
  FileCheck2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Filter,
  UserCheck,
  Building,
  Shield,
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading outpass authorization queues...</div>
      </div>
    );
  }

  const outpasses = data?.outpasses || [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Dual Outpass Authorization Queue</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Mentor & SRA independent evaluation (Both approvals strictly required for final clearance)
          </p>
        </div>

        {/* Filters */}
        <div className="flex p-1 bg-slate-200/80 rounded-xl text-xs font-bold w-fit">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Requests ({outpasses.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg transition ${
              filter === "pending" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Awaiting Decision
          </button>
        </div>
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

      {/* Outpass Cards List */}
      <div className="space-y-4">
        {outpasses.length === 0 ? (
          <div className="p-8 text-center bg-white border border-slate-200 rounded-xl text-xs text-slate-500">
            No outpass applications in this queue.
          </div>
        ) : (
          outpasses.map((op: any) => {
            const isApproved = op.status === "APPROVED" || op.status === "COMPLETED";
            const isRejected = op.status === "REJECTED";

            return (
              <div key={op.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-slate-900 text-sm">{op.outpassNumber}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                        {op.formType.name}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium mt-1">
                      Student: <span className="font-bold text-slate-900">{op.student.user.fullName}</span> ({op.student.user.identifier}) • {op.student.currentHostel?.name || "Hostel"} - Room {op.student.currentRoom?.roomNumber || "N/A"}
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-xs font-black self-start sm:self-auto ${
                    isApproved ? "bg-emerald-100 text-emerald-800" : isRejected ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                  }`}>
                    {op.status.replace("_", " ")}
                  </span>
                </div>

                {/* Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50/60 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-slate-500 font-semibold">Destination:</span>{" "}
                    <span className="font-bold text-slate-800">{op.destination}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Contact Phone:</span>{" "}
                    <span className="font-medium text-slate-800">{op.contactPhone}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Departure:</span>{" "}
                    <span className="font-medium text-slate-800">{new Date(op.departureTime).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-semibold">Expected Return:</span>{" "}
                    <span className="font-medium text-slate-800">{new Date(op.expectedReturnTime).toLocaleString()}</span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 font-semibold">Reason for Leave:</span>{" "}
                    <span className="text-slate-700">{op.reason}</span>
                  </div>
                </div>

                {/* Current Dual Review Progress */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className={`p-3 rounded-lg border ${
                    op.mentorDecision === "APPROVED"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : op.mentorDecision === "REJECTED"
                      ? "bg-rose-50 border-rose-200 text-rose-900"
                      : "bg-amber-50/60 border-amber-200 text-amber-900"
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>1. Mentor Review</span>
                      <span className="text-[11px]">{op.mentorDecision}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Assigned Mentor: {op.mentor?.user.fullName || "Unassigned"}
                    </div>
                    {op.mentorComments && (
                      <div className="text-[10px] italic text-slate-500 mt-0.5">"{op.mentorComments}"</div>
                    )}
                  </div>

                  <div className={`p-3 rounded-lg border ${
                    op.sraDecision === "APPROVED"
                      ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                      : op.sraDecision === "REJECTED"
                      ? "bg-rose-50 border-rose-200 text-rose-900"
                      : "bg-amber-50/60 border-amber-200 text-amber-900"
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <span>2. SRA Residence Review</span>
                      <span className="text-[11px]">{op.sraDecision}</span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1">
                      Assigned SRA: {op.sra?.user.fullName || "Unassigned"}
                    </div>
                    {op.sraComments && (
                      <div className="text-[10px] italic text-slate-500 mt-0.5">"{op.sraComments}"</div>
                    )}
                  </div>
                </div>

                {/* Reviewer Action Bar */}
                <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    placeholder="Enter official decision comments / verification note..."
                    value={commentInput[op.id] || ""}
                    onChange={(e) => setCommentInput({ ...commentInput, [op.id]: e.target.value })}
                    className="flex-1 text-xs p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none w-full"
                  />

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      disabled={processingId === op.id}
                      onClick={() => handleDecision(op.id, "APPROVED")}
                      className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Grant Approval</span>
                    </button>

                    <button
                      type="button"
                      disabled={processingId === op.id}
                      onClick={() => handleDecision(op.id, "REJECTED")}
                      className="flex-1 sm:flex-none px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-400 text-white font-bold text-xs rounded-lg transition shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
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

