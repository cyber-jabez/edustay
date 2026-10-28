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
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-xs text-zinc-500 font-medium">Loading dashboard...</div>
      </div>
    );
  }

  if (!data || !data.student) {
    return (
      <div className="p-8 text-center text-zinc-500 bg-white border border-zinc-200 rounded-xl text-xs">
        Student profile data unavailable.
      </div>
    );
  }

  const { student, stats, recentActivity } = data;

  const moduleCards = [
    {
      title: "Attendance",
      description: "Academic & roll-call records",
      icon: GraduationCap,
      href: "/student/attendance",
      tag: `${stats.academicAttendancePct}%`,
    },
    {
      title: "Outpass",
      description: "Yellow, Green & White forms",
      icon: FileText,
      href: "/student/outpass",
      tag: stats.pendingOutpassesCount > 0 ? `${stats.pendingOutpassesCount} Pending` : "Apply",
    },
    {
      title: "Hostel Allocation",
      description: "Room & hostel preferences",
      icon: Building,
      href: "/student/hostel-allocation",
      tag: "Allocated",
    },
    {
      title: "Roommates",
      description: "Current & historical roommates",
      icon: Users,
      href: "/student/roommates",
      tag: `${student.roommates.length} Roommate`,
    },
    {
      title: "Mess Schedule",
      description: "Weekly menu & timings",
      icon: UtensilsCrossed,
      href: "/student/mess",
      tag: "Weekly",
    },
    {
      title: "Complaints",
      description: "Maintenance ticket tracker",
      icon: Wrench,
      href: "/student/complaints",
      tag: `${stats.unresolvedComplaintsCount} Active`,
    },
    {
      title: "Residential History",
      description: "Chronological past stays",
      icon: History,
      href: "/student/residential-history",
      tag: "Archive",
    },
    {
      title: "Personal Information",
      description: "Profile & emergency contacts",
      icon: UserCheck,
      href: "/student/personal-details",
      tag: "Verified",
    },
    {
      title: "Notices",
      description: "Official residence updates",
      icon: Bell,
      href: "/student/notices",
      tag: `${recentActivity.notices.length} New`,
    },
    {
      title: "Reports",
      description: "Verified database metrics",
      icon: Sparkles,
      href: "/student/ai-report",
      tag: "Summary",
    },
  ];

  return (
    <div className="space-y-5 font-sans">
      {/* 1. Student Identity Banner - Neutral & Simple */}
      <section className="bg-white rounded-xl border border-zinc-200 p-5 flex flex-col lg:flex-row items-center justify-between gap-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left w-full lg:w-auto">
          {/* Avatar Photo */}
          <div className="w-20 h-24 rounded-lg bg-zinc-100 border border-zinc-200 flex flex-col items-center justify-center text-zinc-600 font-bold shrink-0">
            <span className="text-xl text-zinc-700">JG</span>
            <span className="text-[9px] uppercase tracking-wider text-zinc-400 mt-1">Photo</span>
          </div>

          {/* Student Details */}
          <div className="space-y-2.5">
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                  {student.fullName}
                </h1>
                <CheckCircle className="w-4 h-4 text-zinc-700" />
              </div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-zinc-500 mt-0.5">
                <span className="font-mono font-medium text-zinc-800">{student.identifier}</span>
                <span>•</span>
                <span>{student.programme}</span>
                <span>•</span>
                <span>{student.email}</span>
              </div>
            </div>

            {/* Neutral Stat Boxes */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 pt-0.5">
              <div className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-left min-w-[100px]">
                <div className="text-xs font-bold text-zinc-900">{stats.academicAttendancePct.toFixed(2)}%</div>
                <div className="text-[10px] text-zinc-500 font-medium">Class Attendance</div>
              </div>

              <div className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-left min-w-[100px]">
                <div className="text-xs font-bold text-zinc-900">{stats.assemblyAttendancePct.toFixed(2)}%</div>
                <div className="text-[10px] text-zinc-500 font-medium">Assembly</div>
              </div>

              <div className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-left min-w-[100px]">
                <div className="text-xs font-bold text-zinc-900">{stats.arrearsCount}</div>
                <div className="text-[10px] text-zinc-500 font-medium">Arrears</div>
              </div>

              <div className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-zinc-50 text-left min-w-[100px]">
                <div className="text-xs font-bold text-zinc-900">{stats.cgpa.toFixed(2)}</div>
                <div className="text-[10px] text-zinc-500 font-medium">CGPA</div>
              </div>
            </div>
          </div>
        </div>

        {/* View Profile Action */}
        <div className="shrink-0 flex items-center gap-2">
          <Link
            href="/student/personal-details"
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-medium transition flex items-center gap-1.5"
          >
            <span>View Profile</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 2. Residence Summary - Simple Flat Neutral Box */}
      <section className="bg-white rounded-xl border border-zinc-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-zinc-100 flex items-center justify-center text-zinc-600">
            <Building className="w-4 h-4" />
          </div>
          <div>
            <div className="text-zinc-400 text-[10px] uppercase tracking-wider font-medium">Current Allocation</div>
            <div className="font-semibold text-zinc-900">
              {student.residence.hostelName} • {student.residence.wingName} (Room {student.residence.roomNumber}, Bed {student.residence.bedCode})
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-zinc-600">
          <div>
            <span className="text-zinc-400">Type:</span>{" "}
            <span className="font-medium text-zinc-800">{student.residence.roomType} {student.residence.isAc ? "(AC)" : "(Non-AC)"}</span>
          </div>
          <span className="text-zinc-300">•</span>
          <div>
            <span className="text-zinc-400">Mentor:</span>{" "}
            <span className="font-medium text-zinc-800">{student.residence.mentorName}</span>
          </div>
          <span className="text-zinc-300">•</span>
          <div>
            <span className="text-zinc-400">SRA:</span>{" "}
            <span className="font-medium text-zinc-800">{student.residence.sraName}</span>
          </div>
        </div>
      </section>

      {/* 3. Operational Simple Metrics Grid */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-500 font-medium">Night Roll-Calls</div>
          <div className="text-lg font-bold text-zinc-900 mt-1">
            {stats.hostelPresentDays + stats.hostelOutpassDays} / {stats.totalHostelRecordedDays}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">100% Present / Authorized</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-500 font-medium">Room Occupancy</div>
          <div className="text-lg font-bold text-zinc-900 mt-1">{stats.roomOccupancyRatio} Beds</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">{student.roommates.length} Roommate</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-500 font-medium">Pending Outpasses</div>
          <div className="text-lg font-bold text-zinc-900 mt-1">
            {stats.pendingOutpassesCount}
          </div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Dual approval queue</div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3.5">
          <div className="text-[11px] text-zinc-500 font-medium">Maintenance Tickets</div>
          <div className="text-lg font-bold text-zinc-900 mt-1">{stats.unresolvedComplaintsCount}</div>
          <div className="text-[10px] text-zinc-400 mt-0.5">Active requests</div>
        </div>
      </section>

      {/* 4. Module Cards - Clean, Flat, Minimalist */}
      <section>
        <div className="mb-3">
          <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Residence Modules</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {moduleCards.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.title}
                href={mod.href}
                className="bg-white border border-zinc-200 rounded-xl p-4 portal-card flex flex-col justify-between h-36 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-zinc-700">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-100 text-zinc-600">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">
                    {mod.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-medium text-zinc-500 group-hover:text-zinc-900 transition-colors pt-2 border-t border-zinc-100">
                  <span>Open</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. Recent Activity & Circulars */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs">
        {/* Outpass Status */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <span className="font-semibold text-zinc-800">Recent Outpass</span>
            <Link href="/student/outpass" className="text-zinc-500 hover:text-zinc-900 text-[11px] font-medium">
              View All
            </Link>
          </div>

          {recentActivity.latestOutpass ? (
            <div className="p-3 rounded-lg border border-zinc-100 bg-zinc-50/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-mono font-medium text-zinc-800">
                  {recentActivity.latestOutpass.outpassNumber}
                </span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-zinc-200 text-zinc-800">
                  {recentActivity.latestOutpass.status}
                </span>
              </div>
              <div className="text-zinc-600">
                <span className="text-zinc-400">Destination:</span> {recentActivity.latestOutpass.destination}
              </div>
              <div className="pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[11px] text-zinc-400">
                <span>Mentor: {recentActivity.latestOutpass.mentorDecision}</span>
                <span>SRA: {recentActivity.latestOutpass.sraDecision}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-zinc-400">No active outpass submissions.</div>
          )}
        </div>

        {/* Notices */}
        <div className="bg-white border border-zinc-200 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2">
            <span className="font-semibold text-zinc-800">Residence Circulars</span>
            <Link href="/student/notices" className="text-zinc-500 hover:text-zinc-900 text-[11px] font-medium">
              View All
            </Link>
          </div>

          <div className="space-y-2">
            {recentActivity.notices.map((n) => (
              <div key={n.id} className="p-2.5 rounded-lg border border-zinc-100 bg-zinc-50/50">
                <div className="font-medium text-zinc-800">{n.title}</div>
                <div className="text-[11px] text-zinc-500 line-clamp-1 mt-0.5">{n.content}</div>
                <div className="text-[10px] text-zinc-400 mt-1">
                  {new Date(n.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
