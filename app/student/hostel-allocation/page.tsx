"use client";

import React, { useEffect, useState } from "react";
import {
  Building,
  CheckCircle2,
  Send,
  AlertCircle,
} from "lucide-react";

export default function HostelAllocationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [selectedWindowId, setSelectedWindowId] = useState("");
  const [preferredHostelId, setPreferredHostelId] = useState("");
  const [preferredRoomType, setPreferredRoomType] = useState("DOUBLE");
  const [isAcPreferred, setIsAcPreferred] = useState(false);
  const [preferredRoommateId, setPreferredRoommateId] = useState("");

  useEffect(() => {
    fetch("/api/student/hostel-allocation")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        if (d) {
          setData(d);
          if (d.windows?.length > 0) setSelectedWindowId(d.windows[0].id);
          if (d.hostels?.length > 0) setPreferredHostelId(d.hostels[0].id);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/student/hostel-allocation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          windowId: selectedWindowId,
          preferredHostelId,
          preferredRoomType,
          isAcPreferred,
          preferredRoommateIdentifier: preferredRoommateId,
        }),
      });

      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Submission failed");

      setMessage("Preferences submitted successfully.");
      const refreshed = await fetch("/api/student/hostel-allocation").then((r) => r.json());
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
        <div className="text-sm text-slate-500 font-poppins">Loading allocation details...</div>
      </div>
    );
  }

  if (!data) return <div className="p-6 text-sm text-slate-500">Allocation information unavailable.</div>;

  const { windows, hostels, currentAllocation } = data;

  return (
    <div className="space-y-5 max-w-5xl font-poppins">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 font-lora">Hostel Allocation & Room Selection</h1>
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

      {currentAllocation && (
        <section className="p-5 rounded-xl border border-emerald-200 bg-emerald-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wide">
                Current Confirmed Allotment
              </div>
              <div className="font-bold text-slate-800 text-sm mt-0.5">
                {currentAllocation.hostel.name} • Room {currentAllocation.room.roomNumber} (Bed {currentAllocation.bed.bedCode})
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Allocated: {new Date(currentAllocation.allocationDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
              </div>
            </div>
          </div>
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">
            Active Allotment
          </span>
        </section>
      )}

      {/* Preferences Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-5">
          <Building className="w-4 h-4 text-karunya-blue" />
          <h2 className="text-sm font-semibold text-slate-800 font-lora">Room & Roommate Preferences</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Allocation Window
              </label>
              <select
                value={selectedWindowId}
                onChange={(e) => setSelectedWindowId(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition bg-white"
              >
                {windows.map((w: any) => (
                  <option key={w.id} value={w.id}>
                    {w.title} ({w.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Preferred Hostel
              </label>
              <select
                value={preferredHostelId}
                onChange={(e) => setPreferredHostelId(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition bg-white"
              >
                {hostels.map((h: any) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.genderCategory})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Room Type
              </label>
              <select
                value={preferredRoomType}
                onChange={(e) => setPreferredRoomType(e.target.value)}
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition bg-white"
              >
                <option value="SINGLE">Single Bedded</option>
                <option value="DOUBLE">Double Bedded</option>
                <option value="FOUR_SEATER">Four-Seater</option>
                <option value="SIX_SEATER">Six-Seater</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Air Conditioning
              </label>
              <div className="flex items-center gap-5 h-11">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                  <input
                    type="radio"
                    name="ac"
                    checked={isAcPreferred === true}
                    onChange={() => setIsAcPreferred(true)}
                    className="w-4 h-4 accent-karunya-blue"
                  />
                  <span>AC Room</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-700">
                  <input
                    type="radio"
                    name="ac"
                    checked={isAcPreferred === false}
                    onChange={() => setIsAcPreferred(false)}
                    className="w-4 h-4 accent-karunya-blue"
                  />
                  <span>Non-AC Room</span>
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Preferred Roommate (Register Number)
              </label>
              <input
                type="text"
                value={preferredRoommateId}
                onChange={(e) => setPreferredRoommateId(e.target.value)}
                placeholder="e.g. URK25CS6016"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition uppercase"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-karunya-blue hover:bg-sky-600 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? "Saving..." : "Save Preferences"}</span>
            </button>
          </div>
        </form>
      </section>

      {/* Available Hostels */}
      <section className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-card">
        <div className="px-5 py-3.5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800 font-lora">Available Residences</h2>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {hostels.map((h: any) => (
            <div
              key={h.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50/40 hover:border-blue-200 transition"
            >
              <div className="font-semibold text-slate-800 text-sm">{h.name}</div>
              <div className="text-xs text-slate-500 mt-1">
                {h.buildingCode} • {h.genderCategory}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
