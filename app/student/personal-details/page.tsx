"use client";

import React, { useEffect, useState } from "react";
import {
  UserCheck,
  Shield,
  Phone,
  Building,
  CheckCircle2,
  Lock,
  Save,
  AlertCircle,
} from "lucide-react";

export default function PersonalDetailsPage() {
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [phone, setPhone] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [permanentAddress, setPermanentAddress] = useState("");
  const [parentName, setParentName] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [emergencyContactName, setEmergencyContactName] = useState("");
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("");

  useEffect(() => {
    fetch("/api/student/personal-details")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.student) {
          const s = data.student;
          setStudent(s);
          setPhone(s.user.phone || "");
          setBloodGroup(s.bloodGroup || "");
          setPermanentAddress(s.permanentAddress || "");
          setParentName(s.parentName || "");
          setParentPhone(s.parentPhone || "");
          setEmergencyContactName(s.emergencyContactName || "");
          setEmergencyContactPhone(s.emergencyContactPhone || "");
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/student/personal-details", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          bloodGroup,
          permanentAddress,
          parentName,
          parentPhone,
          emergencyContactName,
          emergencyContactPhone,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setMessage("Personal information updated successfully.");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-3">
        <div className="w-6 h-6 border-2 border-karunya-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-slate-500 font-poppins">Loading profile...</div>
      </div>
    );
  }

  if (!student) {
    return <div className="p-6 text-sm text-slate-500">Profile data unavailable.</div>;
  }

  return (
    <div className="space-y-5 max-w-4xl font-poppins">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h1 className="text-xl font-bold text-slate-800 font-lora">Student Profile</h1>
        <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <Shield className="w-3.5 h-3.5" />
          <span className="font-semibold">Verified Student</span>
        </div>
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

      <form onSubmit={handleSave} className="space-y-5">
        {/* Official Identity (Read-only) */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-karunya-blue" />
              <h2 className="text-sm font-semibold text-slate-800 font-lora">Official Institutional Identity</h2>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Registrar Record
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Full Legal Name", value: student.user.fullName },
              { label: "Register Number / ID", value: student.user.identifier },
              { label: "Institutional Email", value: student.user.email },
              { label: "Academic Programme", value: student.programme },
              { label: "Department", value: student.department },
              { label: "Academic Period", value: `Semester ${student.semester} (${student.academicYear})` },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                  {field.label}
                </label>
                <div className="h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium flex items-center truncate">
                  {field.value}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact & Emergency (Editable) */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-karunya-blue" />
              <h2 className="text-sm font-semibold text-slate-800 font-lora">Contact & Emergency Details</h2>
            </div>
            <span className="text-xs font-semibold text-karunya-blue bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
              Editable
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Mobile Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98401 23456"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Blood Group
              </label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="e.g. O+ve"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Parent / Guardian Name
              </label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Parent Name"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Parent Contact Number
              </label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="+91 98401 98765"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Emergency Contact Name
              </label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="Name & Relationship"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Emergency Contact Phone
              </label>
              <input
                type="text"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="+91 Emergency Phone"
                className="w-full h-11 px-4 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                Permanent Address
              </label>
              <textarea
                rows={2}
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                placeholder="Address..."
                className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:border-karunya-blue focus:outline-none focus:ring-1 focus:ring-karunya-blue transition resize-none"
              />
            </div>
          </div>
        </section>

        {/* Residence Assignment (Read-only) */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-karunya-blue" />
              <h2 className="text-sm font-semibold text-slate-800 font-lora">Current Residence Assignment</h2>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Hostel Office
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { label: "Hostel", value: student.currentHostel?.name || "Not Allocated" },
              { label: "Wing / Block", value: student.currentWing?.name || "—" },
              { label: "Room Number", value: student.currentRoom?.roomNumber || "—" },
              { label: "Bed Identifier", value: `Bed ${student.currentBed?.bedCode || "—"}` },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                  {field.label}
                </label>
                <div className="h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium flex items-center">
                  {field.value}
                </div>
              </div>
            ))}
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                Faculty Mentor
              </label>
              <div className="h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium flex items-center">
                {student.mentor?.user.fullName} ({student.mentor?.department})
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">
                Hostel Chief Warden
              </label>
              <div className="h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 font-medium flex items-center">
                {student.currentHostel?.warden?.user.fullName || "Office of Student Residences"}
              </div>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-karunya-blue hover:bg-sky-600 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition flex items-center gap-2 shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Details"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
