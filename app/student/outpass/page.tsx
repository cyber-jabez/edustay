"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Phone,
} from "lucide-react";

export default function StudentOutpassPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

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

      setMessage(`Application ${resData.outpass.outpassNumber} submitted successfully.`);
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
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-6 h-6 border-2 border-karunya-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-slate-500 font-poppins">Loading outpass...</div>
      </div>
    );
  }

  const { outpasses = [] } = data || {};

  const statusStyle = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "REJECTED":
        return "bg-red-50 text-red-600 border-red-200";
      case "SUBMITTED":
        return "bg-blue-50 text-karunya-blue border-blue-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="space-y-5 max-w-5xl font-poppins">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 font-lora">Outpass Applications</h1>
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

      {/* Form Type Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { code: "YELLOW", label: "Yellow Form", tag: "Day Leave" },
          { code: "GREEN", label: "Green Form", tag: "Up to 5 Days" },
          { code: "WHITE", label: "White Form", tag: "Up to 14 Days" },
        ].map((form) => (
          <button
            key={form.code}
            type="button"
            onClick={() => setFormTypeCode(form.code as any)}
            className={`p-4 rounded-xl border text-left transition-all ${
              formTypeCode === form.code
                ? "border-karunya-blue bg-blue-50/70 ring-1 ring-karunya-blue shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 shadow-card"
            }`}
          >
            <div className="flex items-center justify-between">
              <span
                className={`font-semibold text-sm ${
                  formTypeCode === form.code ? "text-karunya-blue" : "text-slate-800"
                }`}
              >
                {form.label}
              </span>
              <span
                className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full ${
                  formTypeCode === form.code
                    ? "bg-karunya-blue text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {form.tag}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Application Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <FileText className="w-4 h-4 text-karunya-blue" />
          <h2 className="text-sm font-semibold text-slate-800 font-lora">
            Apply: {formTypeCode} Form
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Destination Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Gandhipuram, Coimbatore"
                  className="w-full h-11 px-4 pl-10 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Contact Phone
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full h-11 px-4 pl-10 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
                />
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Departure Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Expected Return Date & Time
              </label>
              <input
                type="datetime-local"
                required
                value={expectedReturnTime}
                onChange={(e) => setExpectedReturnTime(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Reason for Leave
              </label>
              <textarea
                rows={3}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Reason for travel..."
                className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition resize-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="parentConsent"
                checked={parentConsentGiven}
                onChange={(e) => setParentConsentGiven(e.target.checked)}
                className="w-4 h-4 rounded text-karunya-blue focus:ring-karunya-blue accent-karunya-blue"
              />
              <label htmlFor="parentConsent" className="text-sm text-slate-700 font-medium">
                Parent / Guardian informed and consented
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-karunya-blue hover:bg-sky-600 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Submitting..." : "Submit Application"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Outpass Records */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800 font-lora">Application Records</h2>
        </div>

        {outpasses.length === 0 ? (
          <div className="text-sm text-slate-400 py-8 text-center">No applications found.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {outpasses.map((op: any) => (
              <div key={op.id} className="p-5 space-y-3 hover:bg-slate-50/50 transition">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{op.outpassNumber}</span>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                      {op.formType.name}
                    </span>
                  </div>
                  <span className={`text-[11px] font-semibold px-3 py-1 rounded-full border ${statusStyle(op.status)}`}>
                    {op.status.replace("_", " ")}
                  </span>
                </div>

                <div className="text-sm text-slate-700">
                  <span className="text-slate-400 text-xs font-medium">Destination: </span>
                  {op.destination}
                  <span className="text-slate-300 mx-2">•</span>
                  <span className="text-slate-400 text-xs font-medium">Reason: </span>
                  {op.reason}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">1. Mentor Review</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle(op.mentorDecision)}`}>
                        {op.mentorDecision}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{op.mentor?.user?.fullName || "Assigned Mentor"}</div>
                  </div>
                  <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700">2. SRA Review</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusStyle(op.sraDecision)}`}>
                        {op.sraDecision}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">{op.sra?.user?.fullName || "Assigned SRA"}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 pt-1 border-t border-slate-100">
                  <span>Departure: {new Date(op.departureTime).toLocaleString("en-IN")}</span>
                  <span>Return: {new Date(op.expectedReturnTime).toLocaleString("en-IN")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
