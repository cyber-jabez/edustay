"use client";

import React, { useEffect, useState } from "react";
import {
  UserCheck,
  Shield,
  Phone,
  Mail,
  Home,
  GraduationCap,
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

      setMessage("Personal information updated successfully in PostgreSQL database.");
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs font-semibold text-slate-500">Loading student profile...</div>
      </div>
    );
  }

  if (!student) {
    return <div className="p-6 text-sm text-slate-500">Profile data unavailable.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Student Profile & Personal Details</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Institutional records and student-controlled emergency contact details
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          <Shield className="w-3.5 h-3.5" />
          <span>Identity Verified</span>
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

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Official Institutional Identity (Read-only) */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[#0072bc]" />
              <span>Official Institutional Identity</span>
            </h2>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Managed by University Registrar
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Full Legal Name</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800">
                {student.user.fullName}
              </div>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Register Number / ID</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800">
                {student.user.identifier}
              </div>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Institutional Email</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800">
                {student.user.email}
              </div>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Academic Programme</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800">
                {student.programme}
              </div>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Department</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800">
                {student.department}
              </div>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Current Academic Period</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-800">
                Semester {student.semester} ({student.academicYear})
              </div>
            </div>
          </div>
        </section>

        {/* 2. Personal & Emergency Information (Student Editable) */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>Contact & Emergency Details</span>
            </h2>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Student Editable
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Student Primary Mobile Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98401 23456"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Blood Group</label>
              <input
                type="text"
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                placeholder="e.g. O+ve"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Parent / Guardian Name</label>
              <input
                type="text"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                placeholder="Father or Mother Full Name"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Parent / Guardian Contact Number</label>
              <input
                type="text"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                placeholder="+91 98401 98765"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Emergency Contact Person</label>
              <input
                type="text"
                value={emergencyContactName}
                onChange={(e) => setEmergencyContactName(e.target.value)}
                placeholder="Name & Relationship"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-slate-700 font-semibold block mb-1">Emergency Contact Phone</label>
              <input
                type="text"
                value={emergencyContactPhone}
                onChange={(e) => setEmergencyContactPhone(e.target.value)}
                placeholder="+91 Emergency Phone"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-700 font-semibold block mb-1">Registered Permanent Address</label>
              <textarea
                rows={2}
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                placeholder="Street address, city, state, pincode"
                className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0072bc] focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* 3. Official Residence Assignment (Read-only) */}
        <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-purple-600" />
              <span>Current Hostel Residence Assignment</span>
            </h2>
            <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Managed by Hostel Administration
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Hostel</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-800">
                {student.currentHostel?.name || "Not Allocated"}
              </div>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Wing / Block</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800">
                {student.currentWing?.name || "N/A"}
              </div>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Room Number</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800">
                {student.currentRoom?.roomNumber || "N/A"}
              </div>
            </div>
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Bed Identifier</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-800">
                Bed {student.currentBed?.bedCode || "N/A"}
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-500 font-semibold block mb-1">Assigned Faculty Mentor</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
                {student.mentor?.user.fullName} ({student.mentor?.department})
              </div>
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-500 font-semibold block mb-1">Hostel Chief Warden</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800">
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
            className="px-6 py-2.5 rounded-lg bg-[#0072bc] hover:bg-[#005ea2] disabled:bg-slate-400 text-white font-bold text-xs shadow-sm transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Personal Information"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

