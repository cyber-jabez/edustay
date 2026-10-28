"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  Shield,
  KeyRound,
  UserCheck,
  AlertCircle,
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
    { label: "Jabez Gabrielraj (Student)", id: "URK25CS6015", pass: "karunya123", role: "STUDENT" as const },
    { label: "Samuel Johnson (Roommate)", id: "URK25CS6016", pass: "karunya123", role: "STUDENT" as const },
    { label: "Mr. D. Joseph (SRA)", id: "SRA001", pass: "karunya123", role: "STAFF" as const },
    { label: "Dr. R. Philip (Mentor)", id: "MENTOR01", pass: "karunya123", role: "STAFF" as const },
    { label: "Dr. K. Samuel (Warden)", id: "WARDEN01", pass: "karunya123", role: "STAFF" as const },
    { label: "Dr. C. Andrews (Hostel Admin)", id: "HADMIN01", pass: "karunya123", role: "STAFF" as const },
    { label: "CIT Admin (System Admin)", id: "SYSADMIN", pass: "karunya123", role: "STAFF" as const },
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
      setError("Please choose either Student or Staff login.");
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
        setError("Invalid credentials. Please verify your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col justify-between selection:bg-zinc-200 selection:text-zinc-900 font-sans">
      {/* Top Header - Neutral and Minimal */}
      <header className="w-full border-b border-zinc-200/80 bg-white px-6 py-3.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-zinc-900 text-white font-bold text-sm tracking-tight">
              ES
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-zinc-900">
                EduStay
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">
                Karunya University Residences
              </div>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-zinc-800">
              Karunya Institute of Technology & Sciences
            </div>
            <div className="text-[11px] text-zinc-500">Coimbatore</div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10 max-w-2xl mx-auto w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Sign in to EduStay
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Centralized student residence portal & hostel administration
          </p>
        </div>

        {/* Role Choice Cards */}
        <div className="w-full space-y-3 mb-6">
          <button
            type="button"
            onClick={() => {
              setSelectedRole("STUDENT");
              setError(null);
            }}
            className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
              selectedRole === "STUDENT"
                ? "border-zinc-900 bg-white ring-1 ring-zinc-900 shadow-sm"
                : "border-zinc-200 bg-white hover:border-zinc-300"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                selectedRole === "STUDENT" ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-50 text-zinc-600 border-zinc-200"
              }`}>
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900">KITS Students</div>
                <div className="text-xs text-zinc-500">Hostel room allocation, outpasses, mess & attendance</div>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              selectedRole === "STUDENT" ? "border-zinc-900 bg-zinc-900" : "border-zinc-300"
            }`}>
              {selectedRole === "STUDENT" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedRole("STAFF");
              setError(null);
            }}
            className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
              selectedRole === "STAFF"
                ? "border-zinc-900 bg-white ring-1 ring-zinc-900 shadow-sm"
                : "border-zinc-200 bg-white hover:border-zinc-300"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${
                selectedRole === "STAFF" ? "bg-zinc-900 text-white border-zinc-900" : "bg-zinc-50 text-zinc-600 border-zinc-200"
              }`}>
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-900">Staffs & Others</div>
                <div className="text-xs text-zinc-500">Mentors, SRAs, Wardens & Residence Administrators</div>
              </div>
            </div>
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
              selectedRole === "STAFF" ? "border-zinc-900 bg-zinc-900" : "border-zinc-300"
            }`}>
              {selectedRole === "STAFF" && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
            </div>
          </button>
        </div>

        {/* Form Container */}
        {selectedRole && (
          <div className="w-full bg-white border border-zinc-200 rounded-xl p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 mb-4">
              <span className="text-xs font-semibold text-zinc-800">
                {selectedRole === "STUDENT" ? "Student Sign In" : "Staff Authorization"}
              </span>
              <span className="text-[11px] text-zinc-400">Secure Session</span>
            </div>

            {error && (
              <div className="mb-4 p-2.5 rounded-lg bg-zinc-50 border border-zinc-300 text-zinc-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-zinc-600" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-700 font-medium mb-1">
                  {selectedRole === "STUDENT" ? "Register Number / ID" : "Staff Code / Email"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={selectedRole === "STUDENT" ? "e.g. URK25CS6015" : "e.g. SRA001"}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition uppercase"
                  />
                  <UserCheck className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-zinc-700 font-medium mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-zinc-200 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition"
                  />
                  <KeyRound className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-400 text-white font-medium text-xs rounded-lg transition flex items-center justify-center gap-2"
              >
                {loading ? "Authenticating..." : "Continue to Dashboard"}
                {!loading && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </form>

            {/* Quick Demo Fill */}
            <div className="mt-4 pt-4 border-t border-zinc-100">
              <div className="text-[11px] font-medium text-zinc-400 mb-2">
                1-Click Demo Profiles:
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {demoAccounts
                  .filter((a) => a.role === selectedRole)
                  .map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickFill(acc)}
                      className="text-left p-2 rounded-lg border border-zinc-200 hover:border-zinc-400 bg-zinc-50/60 transition truncate"
                    >
                      <div className="font-medium text-zinc-800 text-[11px] truncate">{acc.label}</div>
                      <div className="text-[10px] text-zinc-400">{acc.id}</div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Flat info notes */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-zinc-500">
          <div className="p-3 bg-white border border-zinc-200 rounded-lg">
            <span className="font-medium text-zinc-700 block mb-0.5">Note for Parents</span>
            <span>Queries & Emergency verification: myksupport@karunya.edu.in</span>
          </div>
          <div className="p-3 bg-white border border-zinc-200 rounded-lg">
            <span className="font-medium text-zinc-700 block mb-0.5">Note for Students</span>
            <span>Room allotments & IT support: hosteldesk@karunya.edu</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200/80 py-3 px-6 text-center text-xs text-zinc-400 bg-white">
        © 2026 Karunya Institute of Technology & Sciences • EduStay Portal
      </footer>
    </div>
  );
}
