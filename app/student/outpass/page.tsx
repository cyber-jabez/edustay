"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Clock,
  Send,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldAlert,
  Calendar,
  Phone,
  MapPin,
  HelpCircle,
} from "lucide-react";

export default function StudentOutpassPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form State
  const [formTypeCode, setFormTypeCode] = useState<"YELLOW" | "GREEN" | "WHITE">("YELLOW");
  const [destination, setDestination] = useState("");
  const [reason, setReason] = useState("");
  const [departureTime, setDepartureTime] = useState("");
  const [expectedReturnTime, setExpectedReturnTime] = useState("");
  const [contactPhone, setContactPhone] = useState("+91 98401 23456");
  const [parentConsentGiven, setParentConsentGiven] = useState(true);

  useEffect(() => {
    fetch("/api/outpass")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/outpass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formTypeCode,
          destination,
          reason,
          departureTime,
          expectedReturnTime,
          contactPhone,
          parentConsentGiven,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Outpass submission failed");

      setMessage(`Success: Outpass application ${resData.outpass.outpassNumber} submitted successfully. Dual approval workflow initiated.`);
      // Reset form & reload
      setDestination("");
      setReason("");
      const refreshed = await fetch("/api/outpass").then((r) => r.json());
      setData(refreshed);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading student outpasses & policies...</div>
      </div>
    );
  }

  const { outpasses = [], formTypes = [] } = data || {};

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Student Residence Outpass Portal</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Dual Mentor & SRA authorization for campus exit permissions (Yellow, Green & White Forms)
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

      {/* Form Types Selection Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Yellow Form */}
        <div
          onClick={() => setFormTypeCode("YELLOW")}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            formTypeCode === "YELLOW"
              ? "border-amber-400 bg-amber-50/70 shadow-sm ring-2 ring-amber-200"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-amber-900">YELLOW FORM</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">Max 1 Day</span>
          </div>
          <div className="text-xs font-bold text-slate-800">Local City & Weekend Day Outpass</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Permission to visit Coimbatore city or nearby areas. Mandatory return by 08:30 PM roll call.
          </p>
        </div>

        {/* Green Form */}
        <div
          onClick={() => setFormTypeCode("GREEN")}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            formTypeCode === "GREEN"
              ? "border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-200"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-emerald-900">GREEN FORM</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">Up to 5 Days</span>
          </div>
          <div className="text-xs font-bold text-slate-800">Academic & Official Duty Outpass</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Authorized leave for hackathons, sports, symposiums, or institutional internships.
          </p>
        </div>

        {/* White Form */}
        <div
          onClick={() => setFormTypeCode("WHITE")}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            formTypeCode === "WHITE"
              ? "border-blue-500 bg-blue-50/70 shadow-sm ring-2 ring-blue-200"
              : "border-slate-200 bg-white hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-blue-900">WHITE FORM</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-200 text-blue-900">Up to 14 Days</span>
          </div>
          <div className="text-xs font-bold text-slate-800">Home & Extended Vacation Outpass</div>
          <p className="text-[11px] text-slate-500 mt-1">
            Overnight travel to registered permanent home during holidays or semester breaks.
          </p>
        </div>
      </div>

      {/* Application Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#0072bc]" />
            <span>Apply for {formTypeCode} Form Outpass</span>
          </h2>
          <span className="text-[10px] font-semibold text-slate-500">Dual Authorization Enforced</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Destination Address / City</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Gandhipuram / RS Puram, Coimbatore"
                  className="w-full p-2.5 pl-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Student Contact Phone During Leave</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2.5 pl-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Planned Departure Date & Time</label>
              <input
                type="datetime-local"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Expected Return Date & Time</label>
              <input
                type="datetime-local"
                required
                value={expectedReturnTime}
                onChange={(e) => setExpectedReturnTime(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 font-semibold block mb-1">Detailed Reason for Leave</label>
              <textarea
                rows={2}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Specify exact academic, medical, or personal purpose"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="parentConsent"
                checked={parentConsentGiven}
                onChange={(e) => setParentConsentGiven(e.target.checked)}
                className="w-4 h-4 rounded text-[#0072bc]"
              />
              <label htmlFor="parentConsent" className="text-slate-700 font-medium">
                I certify that my parents/guardian have been informed and have given consent for this travel.
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-lg bg-[#0072bc] hover:bg-[#005ea2] disabled:bg-slate-400 text-white font-bold text-xs shadow-sm transition"
            >
              {submitting ? "Submitting Application..." : "Submit Outpass for Dual Review"}
            </button>
          </div>
        </form>
      </section>

      {/* Outpass Applications History & Live Dual Status Timeline */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-4 h-4 text-purple-600" />
          <span>Application Records & Approval Timelines</span>
        </h2>

        {outpasses.length === 0 ? (
          <div className="text-xs text-slate-500 py-3">No outpasses submitted yet.</div>
        ) : (
          <div className="space-y-4">
            {outpasses.map((op: any) => {
              const isApproved = op.status === "APPROVED" || op.status === "COMPLETED";
              const isRejected = op.status === "REJECTED";
              const isPending = !isApproved && !isRejected;

              return (
                <div key={op.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/40 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 text-sm">{op.outpassNumber}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                          {op.formType.name}
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 mt-1">
                        <span className="font-semibold">Destination:</span> {op.destination}
                      </div>
                    </div>

                    <span className={`px-2.5 py-1 rounded text-xs font-black ${
                      isApproved ? "bg-emerald-100 text-emerald-800" : isRejected ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {op.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    <span className="font-semibold text-slate-700">Reason:</span> {op.reason}
                  </div>

                  {/* Dual Approval Visualization Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                    {/* Mentor Step */}
                    <div className={`p-3 rounded-lg border ${
                      op.mentorDecision === "APPROVED"
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                        : op.mentorDecision === "REJECTED"
                        ? "bg-rose-50/70 border-rose-200 text-rose-900"
                        : "bg-slate-100/70 border-slate-200 text-slate-700"
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span>1. Faculty Mentor Review</span>
                        <span>{op.mentorDecision}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        Mentor: {op.mentor?.user?.fullName || "Assigned Mentor"}
                      </div>
                      {op.mentorComments && (
                        <div className="text-[10px] italic text-slate-500 mt-1">"{op.mentorComments}"</div>
                      )}
                    </div>

                    {/* SRA Step */}
                    <div className={`p-3 rounded-lg border ${
                      op.sraDecision === "APPROVED"
                        ? "bg-emerald-50/70 border-emerald-200 text-emerald-900"
                        : op.sraDecision === "REJECTED"
                        ? "bg-rose-50/70 border-rose-200 text-rose-900"
                        : "bg-slate-100/70 border-slate-200 text-slate-700"
                    }`}>
                      <div className="flex items-center justify-between font-bold">
                        <span>2. SRA Residence Review</span>
                        <span>{op.sraDecision}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-1">
                        SRA: {op.sra?.user?.fullName || "Assigned SRA"}
                      </div>
                      {op.sraComments && (
                        <div className="text-[10px] italic text-slate-500 mt-1">"{op.sraComments}"</div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <span>Departure: {new Date(op.departureTime).toLocaleString()}</span>
                    <span>Expected Return: {new Date(op.expectedReturnTime).toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

