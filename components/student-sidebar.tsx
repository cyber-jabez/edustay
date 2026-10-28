"use client";

import React from "react";
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
} from "lucide-react";

export function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
    { label: "Personal Details", href: "/student/personal-details", icon: UserCheck },
    { label: "Attendance", href: "/student/attendance", icon: GraduationCap },
    { label: "Outpass", href: "/student/outpass", icon: FileText },
    { label: "Hostel Allocation", href: "/student/hostel-allocation", icon: Building },
    { label: "Roommates", href: "/student/roommates", icon: Users },
    { label: "Residential History", href: "/student/residential-history", icon: History },
    { label: "Mess Schedule", href: "/student/mess", icon: UtensilsCrossed },
    { label: "Complaints", href: "/student/complaints", icon: Wrench },
    { label: "Notices", href: "/student/notices", icon: Bell },
    { label: "Reports", href: "/student/ai-report", icon: Sparkles },
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
    <aside className="w-60 bg-white border-r border-zinc-200 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none font-sans">
      <div>
        {/* Brand header */}
        <div className="px-5 py-4 border-b border-zinc-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-zinc-900 text-white flex items-center justify-center font-bold text-xs">
              ES
            </div>
            <div>
              <div className="font-bold text-sm text-zinc-900 leading-tight">
                EduStay
              </div>
              <div className="text-[10px] text-zinc-400 font-medium">
                Student Residence
              </div>
            </div>
          </div>
          <span className="text-[10px] font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
            Student
          </span>
        </div>

        {/* Navigation list */}
        <nav className="p-2.5 space-y-0.5 overflow-y-auto max-h-[calc(100vh-125px)] text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 font-semibold"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-zinc-900" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                </div>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-zinc-900"></span>}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-2.5 border-t border-zinc-100 bg-zinc-50/50">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition"
        >
          <LogOut className="w-3.5 h-3.5 text-zinc-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
