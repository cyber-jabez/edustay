"use client";

import React, { useEffect, useState } from "react";
import {
  Building,
  Users,
  CheckCircle2,
  Clock,
  Sparkles,
  Shield,
  Send,
  AlertCircle,
  Filter,
} from "lucide-react";

export default function HostelAllocationPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Form inputs
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
          if (d.windows?.length > 0) {
            setSelectedWindowId(d.windows[0].id);
          }
          if (d.hostels?.length > 0) {
            setPreferredHostelId(d.hostels[0].id);
          }
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

      setMessage("Preferences submitted and saved successfully to PostgreSQL database.");
      // Refresh allocation data
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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading allocation windows & hostel database...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-sm text-slate-500">Allocation information unavailable.</div>;
  }

  const { windows, hostels, preferences, currentAllocation } = data;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-900">Hostel Room & Roommate Selection</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Submit room type and preferred roommate preferences for official residence allocation
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

      {/* Current Confirmed Allocation Card */}
      {currentAllocation && (
        <section className="p-5 rounded-2xl bg-gradient-to-r from-emerald-900 to-teal-950 text-white shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                Current Confirmed Allotment
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                {currentAllocation.hostel.name} • Room {currentAllocation.room.roomNumber} (Bed {currentAllocation.bed.bedCode})
              </h2>
              <div className="text-xs text-emerald-200/80 mt-1">
                Allocated Date: {new Date(currentAllocation.allocationDate).toLocaleDateString()} • Status: Active
              </div>
            </div>
          </div>

          <div className="text-xs px-3 py-1.5 rounded-lg bg-emerald-800/60 border border-emerald-600/40 font-semibold text-emerald-100">
            Relational DB Verified
          </div>
        </section>
      )}

      {/* Allocation Windows Information */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0072bc]" />
          <span>Active Allocation Windows</span>
        </h2>

        {windows.length === 0 ? (
          <div className="text-xs text-slate-500 py-3">No allocation window currently open.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {windows.map((w: any) => (
              <div key={w.id} className="p-3.5 rounded-xl border border-sky-100 bg-sky-50/50">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{w.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {w.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-600 mt-1">
                  Academic Year: {w.academicYear} • Semester {w.semester}
                </div>
                <div className="text-[10px] text-slate-400 mt-1">
                  Closes on: {new Date(w.endDate).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Preference Submission Form */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-4 h-4 text-[#0072bc]" />
            <span>Submit Room & Roommate Preferences</span>
          </h2>
          <span className="text-[10px] font-semibold text-slate-500">Mutual Roommate Logic Active</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Select Open Window</label>
              <select
                value={selectedWindowId}
                onChange={(e) => setSelectedWindowId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                {windows.map((w: any) => (
                  <option key={w.id} value={w.id}>
                    {w.title} ({w.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Preferred Hostel</label>
              <select
                value={preferredHostelId}
                onChange={(e) => setPreferredHostelId(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                {hostels.map((h: any) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.genderCategory})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Room Configuration</label>
              <select
                value={preferredRoomType}
                onChange={(e) => setPreferredRoomType(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              >
                <option value="SINGLE">Single Bedded Room</option>
                <option value="DOUBLE">Double Bedded Room</option>
                <option value="FOUR_SEATER">Four-Seater Room</option>
                <option value="SIX_SEATER">Six-Seater Room</option>
              </select>
            </div>

            <div>
              <label className="text-slate-700 font-semibold block mb-1">Air Conditioning (AC) Option</label>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="ac"
                    checked={isAcPreferred === true}
                    onChange={() => setIsAcPreferred(true)}
                  />
                  <span>AC Room Required</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-slate-800">
                  <input
                    type="radio"
                    name="ac"
                    checked={isAcPreferred === false}
                    onChange={() => setIsAcPreferred(false)}
                  />
                  <span>Non-AC Room</span>
                </label>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="text-slate-700 font-semibold block mb-1">
                Preferred Roommate (Optional - Register Number / Student ID)
              </label>
              <input
                type="text"
                value={preferredRoommateId}
                onChange={(e) => setPreferredRoommateId(e.target.value)}
                placeholder="e.g. URK25CS6016"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none uppercase"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Enter the register number of the eligible student with whom you wish to share a room. Both students must submit mutual preferences for automatic pairing.
              </p>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-[#0072bc] hover:bg-[#005ea2] disabled:bg-slate-400 text-white font-bold text-xs shadow-sm transition"
            >
              {submitting ? "Submitting..." : "Submit Preference Application"}
            </button>
          </div>
        </form>
      </section>

      {/* Available Hostels Browser */}
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-purple-600" />
          <span>Eligible Residence Hostels at Karunya University</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {hostels.map((h: any) => (
            <div key={h.id} className="p-3.5 rounded-xl border border-slate-200 hover:border-sky-300 transition text-xs">
              <div className="font-bold text-slate-800 text-sm">{h.name}</div>
              <div className="text-[10px] text-[#0072bc] font-semibold mt-0.5">Code: {h.buildingCode} • {h.genderCategory}</div>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{h.description || "University student residence."}</p>
              <div className="text-[10px] text-slate-400 mt-2">
                Facilities: {h.facilities || "Wi-Fi, Solar Water"}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

