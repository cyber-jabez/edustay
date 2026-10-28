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
  ShieldCheck,
  Calendar,
  Clock,
  ChevronRight,
  BedDouble,
  AlertCircle,
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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-[#0072bc] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-500">Loading EduStay Student Portal...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.student) {
    return (
      <div className="p-8 text-center text-slate-500 bg-white border border-slate-200 rounded-xl">
        <AlertCircle className="w-8 h-8 text-rose-500 mx-auto mb-2" />
        <p className="text-sm font-semibold">Student profile data unavailable.</p>
      </div>
    );
  }

  const { student, stats, recentActivity } = data;

  const moduleCards = [
    {
      title: "Attendance",
      description: "Academic subject-wise & hostel roll call records",
      icon: GraduationCap,
      href: "/student/attendance",
      tag: `${stats.academicAttendancePct}% Present`,
      color: "bg-sky-500",
    },
    {
      title: "Outpass",
      description: "Yellow, Green & White form applications",
      icon: FileText,
      href: "/student/outpass",
      tag: stats.pendingOutpassesCount > 0 ? `${stats.pendingOutpassesCount} Pending` : "Apply Now",
      color: "bg-amber-500",
    },
    {
      title: "Hostel Allocation",
      description: "Room preferences & hostel criteria browser",
      icon: Building,
      href: "/student/hostel-allocation",
      tag: student.residence.hostelName !== "Not Allocated" ? "Allocated" : "Open Window",
      color: "bg-blue-600",
    },
    {
      title: "Roommates",
      description: "Confirmed roommates & preference pairing",
      icon: Users,
      href: "/student/roommates",
      tag: `${student.roommates.length} Roommate(s)`,
      color: "bg-indigo-600",
    },
    {
      title: "Mess Schedule",
      description: "Weekly vegetarian & non-vegetarian menus",
      icon: UtensilsCrossed,
      href: "/student/mess",
      tag: "Active Menu",
      color: "bg-emerald-600",
    },
    {
      title: "Complaints & Maintenance",
      description: "Wi-Fi, electrical & room repairs lifecycle",
      icon: Wrench,
      href: "/student/complaints",
      tag: `${stats.unresolvedComplaintsCount} Active Ticket(s)`,
      color: "bg-rose-500",
    },
    {
      title: "Residential History",
      description: "Chronological records of previous semesters",
      icon: History,
      href: "/student/residential-history",
      tag: "Archived",
      color: "bg-purple-600",
    },
    {
      title: "Personal Information",
      description: "Profile, emergency contacts & verification",
      icon: UserCheck,
      href: "/student/personal-details",
      tag: "Verified",
      color: "bg-teal-600",
    },
    {
      title: "Notices & Updates",
      description: "Targeted university & hostel circulars",
      icon: Bell,
      href: "/student/notices",
      tag: `${recentActivity.notices.length} New`,
      color: "bg-cyan-600",
    },
    {
      title: "AI Residence Report",
      description: "Automated analysis from verified PostgreSQL records",
      icon: Sparkles,
      href: "/student/ai-report",
      tag: "Audit Ready",
      color: "bg-violet-600",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Student Identity Banner Card (Faithfully recreated from Reference Portal Screenshot 2) */}
      <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full lg:w-auto">
          {/* Student Portrait / Photo */}
          <div className="w-24 h-28 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center relative shadow-sm">
            <div className="w-full h-full bg-gradient-to-b from-slate-200 to-slate-300 flex flex-col items-center justify-center text-slate-600 font-bold">
              <span className="text-2xl">JG</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-500 mt-1">Photo</span>
            </div>
          </div>

          {/* Student Details & Outline Badges */}
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {student.fullName}
                </h1>
                <CheckCircle className="w-5 h-5 text-[#0072bc] fill-[#0072bc]/10" />
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600 mt-1 font-medium">
                <span className="font-semibold text-slate-800">{student.identifier}</span>
                <span>•</span>
                <span>{student.programme}</span>
                <span>•</span>
                <span className="text-[#0072bc]">{student.email}</span>
              </div>
            </div>

            {/* Exactly matching reference screenshot's 3 distinct stat boxes + CGPA */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1">
              {/* Class Attendance - Green outline badge */}
              <div className="px-3.5 py-1.5 rounded-lg border border-emerald-400 bg-emerald-50/40 text-left">
                <div className="text-sm font-extrabold text-emerald-700">
                  {stats.academicAttendancePct.toFixed(2)}%
                </div>
                <div className="text-[10px] font-semibold text-slate-600">Class Attendance</div>
              </div>

              {/* Assembly Attendance - Purple outline badge */}
              <div className="px-3.5 py-1.5 rounded-lg border border-purple-400 bg-purple-50/40 text-left">
                <div className="text-sm font-extrabold text-purple-700">
                  {stats.assemblyAttendancePct.toFixed(2)}%
                </div>
                <div className="text-[10px] font-semibold text-slate-600">Assembly Attendance</div>
              </div>

              {/* Arrears - Red outline badge */}
              <div className="px-3.5 py-1.5 rounded-lg border border-rose-300 bg-rose-50/40 text-left">
                <div className="text-sm font-extrabold text-rose-600">{stats.arrearsCount}</div>
                <div className="text-[10px] font-semibold text-slate-600">No. of Arrears</div>
              </div>

              {/* CGPA - Blue outline badge */}
              <div className="px-3.5 py-1.5 rounded-lg border border-sky-400 bg-sky-50/40 text-left">
                <div className="text-sm font-extrabold text-sky-700">{stats.cgpa.toFixed(2)}</div>
                <div className="text-[10px] font-semibold text-slate-600">CGPA</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Profile Action Button (as shown in reference screenshot) */}
        <div className="shrink-0 flex sm:flex-col items-center gap-2">
          <Link
            href="/student/personal-details"
            className="px-5 py-2.5 rounded-lg bg-[#0072bc] hover:bg-[#005ea2] text-white text-xs font-bold transition shadow-sm flex items-center gap-2"
          >
            <span>View Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <span className="text-[10px] text-slate-400 font-semibold">Active Odd Semester</span>
        </div>
      </section>

      {/* 2. Residence Quick Info Bar */}
      <section className="bg-gradient-to-r from-slate-900 to-[#0a2240] rounded-xl text-white p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400">
            <Building className="w-5 h-5" />
          </div>
          <div>
            <div className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Current Residence</div>
            <div className="text-sm font-bold text-white">
              {student.residence.hostelName} • {student.residence.wingName} (Room {student.residence.roomNumber}, Bed {student.residence.bedCode})
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <div>
            <span className="text-slate-400">Room Type:</span>{" "}
            <span className="font-semibold text-white">{student.residence.roomType} {student.residence.isAc ? "(AC)" : "(Non-AC)"}</span>
          </div>
          <div className="hidden md:block text-slate-500">•</div>
          <div>
            <span className="text-slate-400">Faculty Mentor:</span>{" "}
            <span className="font-semibold text-white">{student.residence.mentorName}</span>
          </div>
          <div className="hidden md:block text-slate-500">•</div>
          <div>
            <span className="text-slate-400">Assigned SRA:</span>{" "}
            <span className="font-semibold text-white">{student.residence.sraName}</span>
          </div>
        </div>
      </section>

      {/* 3. Operational Quick Metrics Row */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Hostel Night Roll Calls</div>
          <div className="text-xl font-extrabold text-slate-800 mt-1">
            {stats.hostelPresentDays + stats.hostelOutpassDays} / {stats.totalHostelRecordedDays}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">100% Residence Compliance</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Room Occupancy</div>
          <div className="text-xl font-extrabold text-slate-800 mt-1">{stats.roomOccupancyRatio} Beds</div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
            {student.roommates.length} Confirmed Roommate
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Outpass Applications</div>
          <div className="text-xl font-extrabold text-slate-800 mt-1">
            {stats.pendingOutpassesCount > 0 ? (
              <span className="text-amber-600">{stats.pendingOutpassesCount} Under Review</span>
            ) : (
              <span className="text-slate-800">0 Active</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Dual Mentor/SRA Workflow</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs font-semibold text-slate-500">Maintenance Tickets</div>
          <div className="text-xl font-extrabold text-slate-800 mt-1">
            {stats.unresolvedComplaintsCount > 0 ? (
              <span className="text-sky-600">{stats.unresolvedComplaintsCount} In Progress</span>
            ) : (
              <span className="text-emerald-600">All Resolved</span>
            )}
          </div>
          <div className="text-[11px] text-slate-500 font-semibold mt-0.5">Campus IT & Hostel Dept</div>
        </div>
      </section>

      {/* 4. Large Module Cards Grid (Faithfully matching Image 2 spacious white cards layout) */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-900">Residence Modules & Services</h2>
          <span className="text-xs text-slate-500 font-medium">PostgreSQL Relational Single Source of Truth</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {moduleCards.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                href={mod.href}
                className="bg-white border border-slate-200 rounded-2xl p-5 portal-card flex flex-col justify-between h-44 group relative overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${mod.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-800 group-hover:text-[#0072bc] transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0072bc] pt-2 border-t border-slate-100 group-hover:translate-x-1 transition-transform">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Recent Activity & Official Announcements */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Outpass Status Tracker */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#0072bc]" />
              <span>Recent Outpass Status</span>
            </h3>
            <Link href="/student/outpass" className="text-xs text-[#0072bc] font-semibold hover:underline">
              View All
            </Link>
          </div>

          {recentActivity.latestOutpass ? (
            <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800">
                  {recentActivity.latestOutpass.outpassNumber} ({recentActivity.latestOutpass.formType?.name || "Outpass"})
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  recentActivity.latestOutpass.status === "APPROVED" || recentActivity.latestOutpass.status === "COMPLETED"
                    ? "bg-emerald-100 text-emerald-800"
                    : recentActivity.latestOutpass.status === "REJECTED"
                    ? "bg-rose-100 text-rose-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {recentActivity.latestOutpass.status}
                </span>
              </div>
              <div className="text-xs text-slate-600">
                <span className="font-semibold text-slate-700">Destination:</span> {recentActivity.latestOutpass.destination}
              </div>
              <div className="text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Reason:</span> {recentActivity.latestOutpass.reason}
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                <span>Mentor: {recentActivity.latestOutpass.mentorDecision}</span>
                <span>SRA: {recentActivity.latestOutpass.sraDecision}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">No active outpass submissions.</div>
          )}
        </div>

        {/* Official Notices */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-amber-600" />
              <span>Hostel & Campus Circulars</span>
            </h3>
            <Link href="/student/notices" className="text-xs text-[#0072bc] font-semibold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-2.5">
            {recentActivity.notices.map((n) => (
              <div key={n.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition">
                <div className="text-xs font-bold text-slate-800">{n.title}</div>
                <div className="text-[11px] text-slate-600 line-clamp-2 mt-1">{n.content}</div>
                <div className="text-[10px] text-slate-400 mt-1.5 flex items-center justify-between">
                  <span>Author: {n.author.fullName}</span>
                  <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

