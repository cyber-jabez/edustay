"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  GraduationCap,
  Building,
  FileText,
  Users,
  UtensilsCrossed,
  Wrench,
  Sparkles,
  History,
  UserCheck,
  Bell,
  ArrowRight,
  ChevronRight,
  Home,
  Calendar,
} from "lucide-react";

interface DashboardData {
  student: {
    id: string;
    fullName: string;
    identifier: string;
    email: string;
    phone: string;
    programme: string;
    department: string;
    academicYear: string;
    semester: number;
    section: string;
    cgpa: number;
    arrearsCount: number;
    classAttendancePct: number;
    assemblyAttendancePct: number;
    isVerified: boolean;
    residence: {
      hostelName: string;
      wingName: string;
      roomNumber: string;
      bedCode: string;
      roomType: string;
      isAc: boolean;
      capacity: number;
      currentOccupancy: number;
      mentorName: string;
      sraName: string;
      wardenName: string;
    };
    roommates: Array<{
      id: string;
      fullName: string;
      identifier: string;
      bedCode: string;
      programme: string;
    }>;
  };
  stats: {
    academicAttendancePct: number;
    assemblyAttendancePct: number;
    arrearsCount: number;
    cgpa: number;
    totalAcademicSessions: number;
    attendedAcademicSessions: number;
    absentAcademicSessions: number;
    totalHostelRecordedDays: number;
    hostelPresentDays: number;
    hostelOutpassDays: number;
    hostelAbsentDays: number;
    pendingOutpassesCount: number;
    unresolvedComplaintsCount: number;
    roomOccupancyRatio: string;
  };
  recentActivity: {
    latestOutpass: any;
    notices: Array<{
      id: string;
      title: string;
      content: string;
      createdAt: string;
      author: { fullName: string };
    }>;
    notifications: Array<{
      id: string;
      title: string;
      message: string;
      type: string;
      createdAt: string;
    }>;
  };
}

export default function StudentDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((d) => {
        setData(d);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard error:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-2 border-karunya-blue border-t-transparent rounded-full animate-spin" />
        <div className="text-sm text-slate-500 font-medium font-poppins">Loading dashboard...</div>
      </div>
    );
  }

  if (!data || !data.student) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-xl text-sm font-poppins">
        Student profile data unavailable.
      </div>
    );
  }

  const { student, stats, recentActivity } = data;

  const attendancePct = stats.academicAttendancePct;

  const moduleCards = [
    {
      title: "Attendance",
      icon: GraduationCap,
      href: "/student/attendance",
      tag: `${stats.academicAttendancePct}%`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Outpass",
      icon: FileText,
      href: "/student/outpass",
      tag: stats.pendingOutpassesCount > 0 ? `${stats.pendingOutpassesCount} Pending` : "Apply",
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      title: "Hostel Allocation",
      icon: Building,
      href: "/student/hostel-allocation",
      tag: "Allocated",
      color: "text-sky-600",
      bg: "bg-sky-50",
    },
    {
      title: "Roommates",
      icon: Users,
      href: "/student/roommates",
      tag: `${student.roommates.length} Roommates`,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      title: "Mess Schedule",
      icon: UtensilsCrossed,
      href: "/student/mess",
      tag: "Weekly",
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      title: "Complaints",
      icon: Wrench,
      href: "/student/complaints",
      tag: `${stats.unresolvedComplaintsCount} Active`,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      title: "Residential History",
      icon: History,
      href: "/student/residential-history",
      tag: "Archive",
      color: "text-slate-600",
      bg: "bg-slate-100",
    },
    {
      title: "Personal Information",
      icon: UserCheck,
      href: "/student/personal-details",
      tag: "Verified",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Notices",
      icon: Bell,
      href: "/student/notices",
      tag: `${recentActivity.notices.length} New`,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      title: "Reports",
      icon: Sparkles,
      href: "/student/ai-report",
      tag: "Summary",
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="space-y-5 font-poppins">
      {/* 1. Student Identity Banner */}
      <section className="bg-karunya-navy rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 right-20 w-40 h-40 rounded-full bg-karunya-blue/20 pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white shrink-0">
              <span className="text-xl font-bold font-lora">
                {student.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
            </div>

            <div className="space-y-2">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold font-lora text-white tracking-tight">
                    {student.fullName}
                  </h1>
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-blue-200 mt-1">
                  <span className="font-mono font-semibold text-white bg-white/10 px-2 py-0.5 rounded">
                    {student.identifier}
                  </span>
                  <span>•</span>
                  <span>{student.programme}</span>
                  <span>•</span>
                  <span>{student.email}</span>
                </div>
              </div>

              {/* Stat Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-left min-w-[90px]">
                  <div className={`text-sm font-bold ${attendancePct >= 75 ? "text-emerald-300" : "text-red-300"}`}>
                    {stats.academicAttendancePct.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-blue-200/70 font-medium">Class Attendance</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-left min-w-[90px]">
                  <div className="text-sm font-bold text-sky-300">{stats.assemblyAttendancePct.toFixed(1)}%</div>
                  <div className="text-[10px] text-blue-200/70 font-medium">Assembly</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-left min-w-[70px]">
                  <div className={`text-sm font-bold ${stats.arrearsCount > 0 ? "text-rose-300" : "text-white"}`}>
                    {stats.arrearsCount}
                  </div>
                  <div className="text-[10px] text-blue-200/70 font-medium">Arrears</div>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-white/10 border border-white/15 text-left min-w-[70px]">
                  <div className="text-sm font-bold text-amber-300">{stats.cgpa.toFixed(2)}</div>
                  <div className="text-[10px] text-blue-200/70 font-medium">CGPA</div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              href="/student/personal-details"
              className="px-5 py-2.5 rounded-xl bg-karunya-blue hover:bg-sky-600 text-white text-sm font-semibold transition flex items-center gap-2 shadow-md"
            >
              <span>View Profile</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Residence Summary Bar */}
      <section className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-karunya-blue border border-blue-100 shrink-0">
            <Home className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-slate-800 text-sm">
              {student.residence.hostelName} • {student.residence.wingName}{" "}
              <span className="text-karunya-blue font-bold">
                (Room {student.residence.roomNumber}, Bed {student.residence.bedCode})
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <div>
            <span className="text-slate-400">Type:</span>{" "}
            <span className="font-semibold text-slate-700">
              {student.residence.roomType} {student.residence.isAc ? "(AC)" : "(Non-AC)"}
            </span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span className="text-slate-400">Mentor:</span>{" "}
            <span className="font-semibold text-slate-700">{student.residence.mentorName}</span>
          </div>
          <span className="text-slate-300">|</span>
          <div>
            <span className="text-slate-400">SRA:</span>{" "}
            <span className="font-semibold text-slate-700">{student.residence.sraName}</span>
          </div>
        </div>
      </section>

      {/* 3. Metrics Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Night Roll-Calls</div>
            <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
              <Calendar className="w-3.5 h-3.5 text-karunya-blue" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800 font-lora">
            {stats.hostelPresentDays + stats.hostelOutpassDays}{" "}
            <span className="text-sm font-medium text-slate-400">/ {stats.totalHostelRecordedDays}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Room Occupancy</div>
            <div className="w-7 h-7 rounded-lg bg-sky-50 flex items-center justify-center">
              <Building className="w-3.5 h-3.5 text-sky-500" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800 font-lora">
            {stats.roomOccupancyRatio}{" "}
            <span className="text-sm font-medium text-slate-400">Beds</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Pending Outpasses</div>
            <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-violet-500" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800 font-lora">{stats.pendingOutpassesCount}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wide">Maintenance Tickets</div>
            <div className="w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center">
              <Wrench className="w-3.5 h-3.5 text-rose-500" />
            </div>
          </div>
          <div className="text-xl font-bold text-slate-800 font-lora">{stats.unresolvedComplaintsCount}</div>
        </div>
      </section>

      {/* 4. Module Cards - Clean without descriptions */}
      <section>
        <div className="mb-3">
          <h2 className="text-base font-bold text-slate-800 font-lora">Residence Modules</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {moduleCards.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                href={mod.href}
                className="bg-white border border-slate-200 rounded-xl p-4 portal-card flex flex-col justify-between h-32 group hover:border-blue-200"
              >
                <div className="flex items-center justify-between">
                  <div className={`w-9 h-9 rounded-xl ${mod.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${mod.color}`} />
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${mod.bg} ${mod.color}`}>
                    {mod.tag}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-800 group-hover:text-karunya-blue transition-colors font-poppins leading-tight">
                    {mod.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-karunya-blue transition-colors pt-2 border-t border-slate-100">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Outpass Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-violet-500" />
              </div>
              <span className="font-semibold text-slate-800 text-sm font-lora">Recent Outpass</span>
            </div>
            <Link href="/student/outpass" className="text-karunya-blue hover:text-sky-600 text-xs font-semibold">
              View All →
            </Link>
          </div>

          {recentActivity.latestOutpass ? (
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono font-semibold text-slate-800 text-sm">
                  {recentActivity.latestOutpass.outpassNumber}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-karunya-blue border border-blue-100">
                  {recentActivity.latestOutpass.status}
                </span>
              </div>
              <div className="text-sm text-slate-600">
                <span className="text-slate-400 text-xs">Destination: </span>
                {recentActivity.latestOutpass.destination}
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Mentor: {recentActivity.latestOutpass.mentorDecision}</span>
                <span>SRA: {recentActivity.latestOutpass.sraDecision}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-sm">No active outpass submissions.</div>
          )}
        </div>

        {/* Notices */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-amber-500" />
              </div>
              <span className="font-semibold text-slate-800 text-sm font-lora">Residence Circulars</span>
            </div>
            <Link href="/student/notices" className="text-karunya-blue hover:text-sky-600 text-xs font-semibold">
              View All →
            </Link>
          </div>

          <div className="space-y-2">
            {recentActivity.notices.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">No notices yet.</div>
            ) : (
              recentActivity.notices.map((n) => (
                <div key={n.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-blue-50/50 hover:border-blue-100 transition-colors">
                  <div className="font-semibold text-slate-800 text-sm">{n.title}</div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                    <span>{new Date(n.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</span>
                    <span>•</span>
                    <span>{n.author.fullName}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
