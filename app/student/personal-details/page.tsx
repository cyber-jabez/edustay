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

  // Editable fields
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
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="text-xs text-zinc-500">Loading student profile...</div>
      </div>
    );
  }

  if (!student) {
    return <div className="p-6 text-sm text-zinc-500">Profile data unavailable.</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900 tracking-tight">Student Profile</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Institutional registration details and personal contact information
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-zinc-700 bg-zinc-100 px-2.5 py-1 rounded border border-zinc-200">
          <Shield className="w-3.5 h-3.5 text-zinc-600" />
          <span>Verified Student</span>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Official Institutional Identity (Read-only) */}
        <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-zinc-600" />
              <span>Official Institutional Identity</span>
            </h2>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Registrar Record
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Full Legal Name</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900 font-medium">
                {student.user.fullName}
              </div>
            </div>
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Register Number / ID</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900 font-medium">
                {student.user.identifier}
              </div>
            </div>
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Institutional Email</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900 font-medium truncate">
                {student.user.email}
              </div>
            </div>
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Academic Programme</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900">
                {student.programme}
              </div>
            </div>
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Department</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900">
                {student.department}
              </div>
            </div>
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Academic Period</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900">
                Semester {student.semester} ({student.academicYear})
              </div>
            </div>
          </div>
        </section>

        {/* 2. Personal & Emergency Information (Student Editable) */}
        <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-600" />
              <span>Contact & Emergency Details</span>
            </h2>
            <span className="text-[11px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded border border-zinc-200">
              Editable
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Student Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98401 23456"
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Blood Group</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="e.g. O+ve"
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Parent / Guardian Name</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Father or Mother Full Name"
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Parent / Guardian Contact</label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="+91 98401 98765"
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Emergency Contact Person</label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="Name & Relationship"
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>
            <div>
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Emergency Contact Phone</label>
              <input
                type="text"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="+91 Emergency Phone"
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-zinc-700 font-medium block mb-1 text-[11px]">Permanent Address</label>
              <textarea
                rows={2}
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                placeholder="Street address, city, state, pincode"
                className="w-full p-2 border border-zinc-300 rounded text-xs focus:border-zinc-900 focus:outline-none transition"
              />
            </div>
          </div>
        </section>

        {/* 3. Official Residence Assignment (Read-only) */}
        <section className="bg-white border border-zinc-200 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-zinc-600" />
              <span>Current Residence Assignment</span>
            </h2>
            <span className="text-[11px] text-zinc-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Hostel Office
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Hostel</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900 font-medium">
                {student.currentHostel?.name || "Not Allocated"}
              </div>
            </div>
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Wing / Block</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900">
                {student.currentWing?.name || "—"}
              </div>
            </div>
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Room Number</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900">
                {student.currentRoom?.roomNumber || "—"}
              </div>
            </div>
            <div>
              <label className="text-zinc-500 block mb-1 text-[11px]">Bed Identifier</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900">
                Bed {student.currentBed?.bedCode || "—"}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-zinc-500 block mb-1 text-[11px]">Faculty Mentor</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900">
                {student.mentor?.user.fullName} ({student.mentor?.department})
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-zinc-500 block mb-1 text-[11px]">Hostel Chief Warden</label>
              <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded text-zinc-900">
                {student.currentHostel?.warden?.user.fullName || "Office of Student Residences"}
              </div>
            </div>
          </div>
        </section>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 rounded bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium text-xs transition flex items-center gap-2"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? "Saving..." : "Save Details"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
