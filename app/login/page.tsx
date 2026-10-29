"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap,
  Users,
  KeyRound,
  UserCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"STUDENT" | "STAFF">("STUDENT");
  const [identifier, setIdentifier] = useState("URK25CS6015");
  const [password, setPassword] = useState("karunya123");
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

  const handleRoleChange = (role: "STUDENT" | "STAFF") => {
    setSelectedRole(role);
    setError(null);
    if (role === "STUDENT") {
      setIdentifier("URK25CS6015");
      setPassword("karunya123");
    } else {
      setIdentifier("SRA001");
      setPassword("karunya123");
    }
  };

  const handleQuickFill = (acc: typeof demoAccounts[0]) => {
    setSelectedRole(acc.role);
    setIdentifier(acc.id);
    setPassword(acc.pass);
    setError(null);
  };

  const executeLogin = async (idToUse?: string, passToUse?: string, roleToUse?: "STUDENT" | "STAFF") => {
    const finalId = idToUse || identifier;
    const finalPass = passToUse || password;
    const finalRole = roleToUse || selectedRole;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: finalId,
          password: finalPass,
          roleType: finalRole,
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
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLogin();
  };

  return (
    <div className="min-h-screen bg-[#f0f7ff] flex flex-col justify-between font-poppins text-slate-800">
      {/* Top Header */}
      <header className="w-full border-b border-slate-200 bg-white px-6 py-3.5 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 p-1 shadow-sm shrink-0">
              <img
                src="/karunya-logo.png"
                alt="Karunya Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-base text-slate-900 leading-tight font-lora">
                EduStay
              </div>
              <div className="text-[10px] text-karunya-blue font-semibold uppercase tracking-wider">
                Karunya University
              </div>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-slate-800">
              Karunya Institute of Technology & Sciences
            </div>
            <div className="text-[11px] text-slate-400">Coimbatore, Tamil Nadu</div>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-lg mx-auto w-full">
        <div className="text-center mb-6 flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 shadow-sm mb-3 flex items-center justify-center">
            <img
              src="/karunya-logo.png"
              alt="Karunya Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 font-lora">
            Sign in to EduStay
          </h1>
        </div>

        {/* Role Choice Pills */}
        <div className="w-full grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => handleRoleChange("STUDENT")}
            className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
              selectedRole === "STUDENT"
                ? "border-karunya-blue bg-blue-50/70 ring-1 ring-karunya-blue shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 shadow-card"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                selectedRole === "STUDENT"
                  ? "bg-karunya-blue text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="font-semibold text-sm text-slate-900">Student</div>
          </button>

          <button
            type="button"
            onClick={() => handleRoleChange("STAFF")}
            className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
              selectedRole === "STAFF"
                ? "border-karunya-blue bg-blue-50/70 ring-1 ring-karunya-blue shadow-sm"
                : "border-slate-200 bg-white hover:border-slate-300 shadow-card"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                selectedRole === "STAFF"
                  ? "bg-karunya-blue text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              <Users className="w-5 h-5" />
            </div>
            <div className="font-semibold text-sm text-slate-900">Staff</div>
          </button>
        </div>

        {/* Form Container */}
        <div className="w-full bg-white border border-slate-200 rounded-2xl p-6 shadow-card mb-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-5">
            <span className="text-sm font-semibold text-slate-800 font-lora">
              {selectedRole === "STUDENT" ? "Student Sign In" : "Staff Sign In"}
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                {selectedRole === "STUDENT" ? "Register Number" : "Staff Code"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={selectedRole === "STUDENT" ? "e.g. URK25CS6015" : "e.g. SRA001"}
                  className="w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-karunya-blue focus:ring-1 focus:ring-karunya-blue transition uppercase"
                />
                <UserCheck className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full h-11 px-4 pr-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-karunya-blue focus:ring-1 focus:ring-karunya-blue transition"
                />
                <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 px-4 bg-karunya-blue hover:bg-sky-600 disabled:bg-slate-300 text-white font-semibold text-sm rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
            >
              {loading ? "Authenticating..." : "Continue to Dashboard"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {/* Quick Demo Fill */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
              Quick Demo Accounts
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts
                .filter((a) => a.role === selectedRole)
                .map((acc) => (
                  <button
                    key={acc.id}
                    type="button"
                    onClick={() => {
                      handleQuickFill(acc);
                      executeLogin(acc.id, acc.pass, acc.role);
                    }}
                    className="text-left p-2.5 rounded-xl border border-slate-200 hover:border-karunya-blue bg-slate-50 hover:bg-blue-50/50 transition truncate group"
                  >
                    <div className="font-semibold text-slate-800 text-xs truncate group-hover:text-karunya-blue">
                      {acc.label}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{acc.id}</div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-400 bg-white">
        © 2026 Karunya Institute of Technology & Sciences • EduStay
      </footer>
    </div>
  );
}
