"use client";

import React, { useEffect, useState } from "react";
import {
  Building,
  CheckCircle2,
  Clock,
  Send,
  AlertCircle,
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

      setMessage("Preferences submitted and saved successfully.");
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
        <div className="text-xs text-zinc-500 font-medium">Loading allocation details...</div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-6 text-xs text-zinc-500">Allocation information unavailable.</div>;
  }

  const { windows, hostels, currentAllocation } = data;

  return (
    <div className="space-y-5 max-w-5xl font-sans">
      <div className="border-b border-zinc-200 pb-3">
        <h1 className="text-lg font-bold text-zinc-900 tracking-tight">Hostel Allocation & Room Selection</h1>
        <p className="text-xs text-zinc-500">
          Submit room type and preferred roommate preferences for official residence allocation
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

      {/* Current Confirmed Allocation - Simple Clean Box */}
      {currentAllocation && (
        <section className="p-4 rounded-xl border border-zinc-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">
                Current Confirmed Allotment
              </div>
              <div className="font-semibold text-zinc-900 mt-0.5">
                {currentAllocation.hostel.name} • Room {currentAllocation.room.roomNumber} (Bed {currentAllocation.bed.bedCode})
              </div>
              <div className="text-[11px] text-zinc-500">
                Allocated Date: {new Date(currentAllocation.allocationDate).toLocaleDateString()}
              </div>
            </div>
          </div>

          <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
            Active Allotment
          </span>
        </section>
      )}

      {/* Preference Submission Form */}
      <section className="bg-white border border-zinc-200 rounded-xl p-4 space-y-4 text-xs">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
          <span className="text-xs font-semibold text-zinc-800">
            Submit Room & Roommate Preferences
          </span>
          <span className="text-[11px] text-zinc-400">Mutual Roommate Matching</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="text-zinc-700 font-medium block mb-1">Open Allocation Window</label>
              <select
                value={selectedWindowId}
                onChange={(e) => setSelectedWindowId(e.target.value)}
                className="w-full p-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none"
              >
                {windows.map((w: any) => (
                  <option key={w.id} value={w.id}>
                    {w.title} ({w.academicYear})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-700 font-medium block mb-1">Preferred Hostel</label>
              <select
                value={preferredHostelId}
                onChange={(e) => setPreferredHostelId(e.target.value)}
                className="w-full p-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none"
              >
                {hostels.map((h: any) => (
                  <option key={h.id} value={h.id}>
                    {h.name} ({h.genderCategory})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-zinc-700 font-medium block mb-1">Room Type</label>
              <select
                value={preferredRoomType}
                onChange={(e) => setPreferredRoomType(e.target.value)}
                className="w-full p-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none"
              >
                <option value="SINGLE">Single Bedded</option>
                <option value="DOUBLE">Double Bedded</option>
                <option value="FOUR_SEATER">Four-Seater</option>
                <option value="SIX_SEATER">Six-Seater</option>
              </select>
            </div>

            <div>
              <label className="text-zinc-700 font-medium block mb-1">Air Conditioning</label>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-zinc-700">
                  <input
                    type="radio"
                    name="ac"
                    checked={isAcPreferred === true}
                    onChange={() => setIsAcPreferred(true)}
                  />
                  <span>AC Room</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-zinc-700">
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
              <label className="text-zinc-700 font-medium block mb-1">
                Preferred Roommate (Register Number / Student ID)
              </label>
              <input
                type="text"
                value={preferredRoommateId}
                onChange={(e) => setPreferredRoommateId(e.target.value)}
                placeholder="e.g. URK25CS6016"
                className="w-full p-2 border border-zinc-200 rounded-lg focus:border-zinc-900 focus:outline-none uppercase"
              />
              <span className="text-[11px] text-zinc-400 block mt-1">
                Both students must mutually submit each other's register numbers for automatic matching.
              </span>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium text-xs rounded-lg transition"
            >
              {submitting ? "Saving..." : "Save Preferences"}
            </button>
          </div>
        </form>
      </section>

      {/* Hostels List */}
      <section className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Available Residences
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {hostels.map((h: any) => (
            <div key={h.id} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50/40">
              <div className="font-semibold text-zinc-900">{h.name}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">{h.buildingCode} • {h.genderCategory}</div>
              <p className="text-[11px] text-zinc-500 mt-1 line-clamp-2">{h.description || "University student residence."}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
