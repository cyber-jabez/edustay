"use client";

import React from "react";
import Link from "next/navigation";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCheck,
  GraduationCap,
  Building,
  FileText,
  Users,
  History,
  UtensilsCrossed,
  Wrench,
  Bell,
  Sparkles,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboards", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Personal Information", href: "/student/personal-details", icon: UserCheck },
    { label: "Academic Attendance", href: "/student/attendance", icon: GraduationCap },
    { label: "Outpass", href: "/student/outpass", icon: FileText, badge: "Yellow Form" },
    { label: "Hostel Allocation", href: "/student/hostel-allocation", icon: Building },
    { label: "Roommates", href: "/student/roommates", icon: Users },
    { label: "Residential History", href: "/student/residential-history", icon: History },
    { label: "Mess Schedule", href: "/student/mess", icon: UtensilsCrossed },
    { label: "Complaints & Maintenance", href: "/student/complaints", icon: Wrench },
    { label: "Notices & Updates", href: "/student/notices", icon: Bell },
    { label: "AI Residence Report", href: "/student/ai-report", icon: Sparkles },
  ];

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Karunya University Branding in Sidebar matching Reference Portal */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0072bc] text-white flex items-center justify-center font-black text-sm shadow-sm">
              ES
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-slate-900 leading-tight">
                <span>Edu</span>
                <span className="text-[#0072bc]">Stay</span>
              </div>
              <div className="text-[9px] uppercase tracking-wider font-bold text-slate-500">
                Karunya University
              </div>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Student
          </span>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-[#0072bc] text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-slate-400 group-hover:text-slate-700"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? "bg-amber-400 text-slate-900"
                          : "bg-amber-100 text-amber-800 border border-amber-200"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-white" : "text-slate-300 group-hover:text-slate-500"
                    }`}
                  />
                </div>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Logout & Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

