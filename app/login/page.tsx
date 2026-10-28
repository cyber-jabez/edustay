"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  Building2,
  Shield,
  KeyRound,
  UserCheck,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Info,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "STAFF" | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { label: "Jabez Gabrielraj (Student - URK25CS6015)", id: "URK25CS6015", pass: "karunya123", role: "STUDENT" as const },
    { label: "Samuel Johnson (Student Roommate - URK25CS6016)", id: "URK25CS6016", pass: "karunya123", role: "STUDENT" as const },
    { label: "Mr. D. Joseph (SRA - SRA001)", id: "SRA001", pass: "karunya123", role: "STAFF" as const },
    { label: "Dr. R. Philip (Faculty Mentor - MENTOR01)", id: "MENTOR01", pass: "karunya123", role: "STAFF" as const },
    { label: "Dr. K. Samuel (Hostel Warden - WARDEN01)", id: "WARDEN01", pass: "karunya123", role: "STAFF" as const },
    { label: "Dr. C. Andrews (Hostel Administrator - HADMIN01)", id: "HADMIN01", pass: "karunya123", role: "STAFF" as const },
    { label: "CIT Admin (System Admin - SYSADMIN)", id: "SYSADMIN", pass: "karunya123", role: "STAFF" as const },
  ];

  const handleQuickFill = (acc: typeof demoAccounts[0]) => {
    setSelectedRole(acc.role);
    setIdentifier(acc.id);
    setPassword(acc.pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      setError("Please select whether you are logging in as a Student or Staff member.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier,
          password,
          roleType: selectedRole,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      router.push(data.redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred. Please verify your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between selection:bg-sky-100 selection:text-sky-900">
      {/* Top Header matching Reference Portal */}
      <header className="w-full border-b border-slate-100 px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-tr from-[#0072bc] to-sky-500 text-white font-bold text-xl shadow-sm">
            ES
          </div>
          <div>
            <div className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-1.5">
              <span>Edu</span>
              <span className="text-[#0072bc]">Stay</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              Hostel & Residence Portal
            </div>
          </div>
        </div>

        {/* Karunya University Branding */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-[#0a2240] uppercase tracking-wide">
              Karunya Institute of Technology and Sciences
            </div>
            <div className="text-[10px] text-slate-500">
              Deemed to be University • Coimbatore
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-[#0a2240] text-amber-400 font-serif font-black flex items-center justify-center border-2 border-amber-400 shadow-sm text-sm">
            K
          </div>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-5xl mx-auto w-full">
        <div className="w-full max-w-2xl text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Select the role to <span className="text-[#0072bc]">Login</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Access your residential room allocation, outpass authorizations, mess schedule, and attendance
          </p>
        </div>

        {/* Role Selector Cards matching screenshot */}
        <div className="w-full max-w-xl space-y-4 mb-6">
          {/* Student Role Card */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole("STUDENT");
              setError(null);
            }}
            className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between ${
              selectedRole === "STUDENT"
                ? "border-[#0072bc] bg-sky-50/70 shadow-md ring-2 ring-sky-200"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-sky-100 text-[#0072bc] flex items-center justify-center border border-sky-200 shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-800">KITS Students</div>
                <div className="text-xs text-slate-500">Student Residence, Room Allocations, Outpass & Complaints</div>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selectedRole === "STUDENT" ? "border-[#0072bc] bg-[#0072bc] text-white" : "border-slate-300"
            }`}>
              {selectedRole === "STUDENT" && <span className="w-2 h-2 rounded-full bg-white"></span>}
            </div>
          </button>

          {/* Staff & Others Role Card */}
          <button
            type="button"
            onClick={() => {
              setSelectedRole("STAFF");
              setError(null);
            }}
            className={`w-full p-4 rounded-xl border transition-all text-left flex items-center justify-between ${
              selectedRole === "STAFF"
                ? "border-[#0072bc] bg-sky-50/70 shadow-md ring-2 ring-sky-200"
                : "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center border border-amber-200 shadow-sm">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="text-base font-bold text-slate-800">Staffs & Others</div>
                <div className="text-xs text-slate-500">Mentors, SRAs, Wardens, Mess Managers & Administrators</div>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              selectedRole === "STAFF" ? "border-[#0072bc] bg-[#0072bc] text-white" : "border-slate-300"
            }`}>
              {selectedRole === "STAFF" && <span className="w-2 h-2 rounded-full bg-white"></span>}
            </div>
          </button>
        </div>

        {/* Credentials Form */}
        {selectedRole && (
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-8 animate-in fade-in-50 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#0072bc]" />
                <span className="text-sm font-semibold text-slate-800">
                  {selectedRole === "STUDENT" ? "Student Institutional Sign In" : "Staff Authorization Portal"}
                </span>
              </div>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-sky-100 text-sky-800">
                Encrypted Session
              </span>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {selectedRole === "STUDENT" ? "Register Number / Student ID" : "Staff Code or University Email"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={selectedRole === "STUDENT" ? "e.g. URK25CS6015" : "e.g. SRA001 or WARDEN01"}
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0072bc] focus:border-transparent transition-all uppercase"
                  />
                  <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3.5 py-2.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0072bc] focus:border-transparent transition-all"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-[#0072bc] hover:bg-[#005ea2] disabled:bg-slate-400 text-white font-semibold text-sm rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Proceed to Residence Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Selector for Reviewers */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-600" />
                <span>Demonstration Accounts (Instant One-Click Login)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {demoAccounts
                  .filter((a) => a.role === selectedRole)
                  .map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickFill(acc)}
                      className="text-left px-2.5 py-1.5 rounded border border-slate-200 bg-slate-50 hover:bg-sky-50 hover:border-sky-300 text-slate-700 transition truncate"
                    >
                      <div className="font-semibold text-slate-800">{acc.label}</div>
                      <div className="text-[10px] text-slate-500">ID: {acc.id} • Pass: {acc.pass}</div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Bottom Information and Reference Notices matching Image 1 */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-xl border border-sky-100 bg-gradient-to-r from-sky-50/80 to-blue-50/60 flex items-start gap-3 shadow-sm">
            <Building2 className="w-5 h-5 text-[#0072bc] shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-[#0a2240]">Announcement for Students</div>
              <div className="text-xs text-slate-600 mt-1">
                EduStay residence registration and outpass management is live. Submit room preferences for Even Semester 2025-2026.
              </div>
              <div className="text-xs font-semibold text-[#0072bc] mt-1.5 underline">
                https://studentportal.edustay.karunya.edu
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm space-y-2">
            <div>
              <span className="text-xs font-bold text-slate-800">Note for Parents : </span>
              <span className="text-xs text-slate-600">
                For Outpass Inquiries & Emergency Residence Contact:{" "}
              </span>
              <span className="text-xs font-semibold text-[#0072bc]">myksupport@karunya.edu.in</span>
            </div>
            <div>
              <span className="text-xs font-bold text-slate-800">Note for Students : </span>
              <span className="text-xs text-slate-600">
                For SRA Room Allotment & Password Assistance:{" "}
              </span>
              <span className="text-xs font-semibold text-[#0072bc]">hosteldesk@karunya.edu</span>
            </div>
          </div>
        </div>
      </main>

      {/* University Footer */}
      <footer className="w-full border-t border-slate-100 py-4 px-6 text-center text-xs text-slate-500 bg-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 Karunya Institute of Technology and Sciences • Deemed to be University
          </div>
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-700">EduStay Residence System</span>
            <span>•</span>
            <span>Academic Software Engineering Project</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

