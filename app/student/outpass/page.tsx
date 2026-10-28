"use client";

import React, { useEffect, useState } from "react";
import {
  FileText,
  Clock,
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

      setMessage(`Success: Application ${resData.outpass.outpassNumber} submitted.`);
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
        <div className="text-xs text-zinc-500 font-medium">Loading outpass options...</div>
      </div>
    );
  }

  const { outpasses = [] } = data || {};

  return (
    <div className="space-y-5 max-w-5xl font-sans">
      <div className="border-b border-zinc-200 pb-3">
        <h1 className="text-lg font-bold text-zinc-900 tracking-tight">Outpass Applications</h1>
        <p className="text-xs text-zinc-500">
          Independent Mentor & SRA dual authorization for campus leave
        </p>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-xs font-medium flex items-center gap-2 ${
          message.startsWith("Error")
            ? "bg-zinc-100 border border-zinc-300 text-zinc-800"
            : "bg-zinc-100 border border-zinc-300 text-zinc-900"
        }`}>
          {message.startsWith("Error") ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{message}</span>
        </div>
      )}

      {/* Form Choice Cards - Minimal and Flat */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div
          onClick={() => setFormTypeCode("YELLOW")}
          className={`p-3.5 rounded-xl border cursor-pointer transition text-xs ${
            formTypeCode === "YELLOW"
              ? "border-zinc-900 bg-white ring-1 ring-zinc-900 shadow-xs"
              : "border-zinc-200 bg-white hover:border-zinc-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-zinc-900">Yellow Form</span>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">Day Leave</span>
          </div>
          <div className="text-zinc-500 text-[11px] leading-relaxed">
            Local city and weekend visits. Return by 08:30 PM roll call mandatory.
          </div>
        </div>

        <div
          onClick={() => setFormTypeCode("GREEN")}
          className={`p-3.5 rounded-xl border cursor-pointer transition text-xs ${
            formTypeCode === "GREEN"
              ? "border-zinc-900 bg-white ring-1 ring-zinc-900 shadow-xs"
              : "border-zinc-200 bg-white hover:border-zinc-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-zinc-900">Green Form</span>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">Up to 5 Days</span>
          </div>
          <div className="text-zinc-500 text-[11px] leading-relaxed">
            Academic competitions, sports, and institutional projects.
          </div>
        </div>

        <div
          onClick={() => setFormTypeCode("WHITE")}
          className={`p-3.5 rounded-xl border cursor-pointer transition text-xs ${
            formTypeCode === "WHITE"
              ? "border-zinc-900 bg-white ring-1 ring-zinc-900 shadow-xs"
              : "border-zinc-200 bg-white hover:border-zinc-300"
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-semibold text-zinc-900">White Form</span>
            <span className="text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">Up to 14 Days</span>
          </div>
          <div className="text-zinc-500 text-[11px] leading-relaxed">
            Home travel during vacation, study holidays, or emergencies.
          </div>
        </div>
      </div>

      {/* Application Form */}
      <section className="bg-white border border-zinc-200 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-xs font-semibold text-zinc-800">
            Apply: {formTypeCode} Form
          </span>
          <span className="text-[11px] text-zinc-400">Dual clearance required</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-zinc-700 font-medium block mb-1">Destination Address</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Gandhipuram, Coimbatore"
                  className="w-full p-2 pl-7 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none"
                />
                <MapPin className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-zinc-700 font-medium block mb-1">Contact Phone During Leave</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full p-2 pl-7 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none"
                />
                <Phone className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label className="text-zinc-700 font-medium block mb-1">Departure Date & Time</label>
              <input
                type="datetime-local"
                required
                value={departureTime}
                onChange={(e) => setDepartureTime(e.target.value)}
                className="w-full p-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-zinc-700 font-medium block mb-1">Expected Return Date & Time</label>
              <input
                type="datetime-local"
                required
                value={expectedReturnTime}
                onChange={(e) => setExpectedReturnTime(e.target.value)}
                className="w-full p-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-zinc-700 font-medium block mb-1">Reason for Leave</label>
              <textarea
                rows={2}
                required
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Specify purpose of travel"
                className="w-full p-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-2">
              <input
                type="checkbox"
                id="parentConsent"
                checked={parentConsentGiven}
                onChange={(e) => setParentConsentGiven(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-zinc-900"
              />
              <label htmlFor="parentConsent" className="text-zinc-600 font-normal">
                Parents or guardian have been informed and consented to this journey.
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium text-xs rounded-lg transition"
            >
              {submitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </section>

      {/* Outpass Applications List */}
      <section className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Application Records & History
        </div>

        {outpasses.length === 0 ? (
          <div className="text-xs text-zinc-400 py-3 text-center">No applications found.</div>
        ) : (
          <div className="space-y-3">
            {outpasses.map((op: any) => (
              <div key={op.id} className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/40 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-zinc-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-zinc-900 text-xs">{op.outpassNumber}</span>
                    <span className="text-[10px] text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                      {op.formType.name}
                    </span>
                  </div>

                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-200 text-zinc-800 self-start sm:self-auto">
                    {op.status.replace("_", " ")}
                  </span>
                </div>

                <div className="text-xs text-zinc-700">
                  <span className="text-zinc-400">Destination:</span> {op.destination} • <span className="text-zinc-400">Reason:</span> {op.reason}
                </div>

                {/* Dual Review Progress */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded border border-zinc-200 bg-white">
                    <div className="flex items-center justify-between font-medium text-zinc-900">
                      <span>1. Mentor Review</span>
                      <span className="text-[10px] text-zinc-500">{op.mentorDecision}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      {op.mentor?.user?.fullName || "Assigned Mentor"}
                    </div>
                  </div>

                  <div className="p-2.5 rounded border border-zinc-200 bg-white">
                    <div className="flex items-center justify-between font-medium text-zinc-900">
                      <span>2. SRA Review</span>
                      <span className="text-[10px] text-zinc-500">{op.sraDecision}</span>
                    </div>
                    <div className="text-[10px] text-zinc-400 mt-0.5">
                      {op.sra?.user?.fullName || "Assigned SRA"}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-[10px] text-zinc-400 pt-1">
                  <span>Departure: {new Date(op.departureTime).toLocaleString()}</span>
                  <span>Return: {new Date(op.expectedReturnTime).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
