"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardCheck,
  FileCheck2,
  Wrench,
  UtensilsCrossed,
  Building,
  Bell,
  LogOut,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export function StaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Staff Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Hostel Roll-Call", href: "/staff/attendance", icon: ClipboardCheck, badge: "SRA" },
    { label: "Outpass Decisions", href: "/staff/outpass", icon: FileCheck2, badge: "Dual Review" },
    { label: "Maintenance Tickets", href: "/staff/complaints", icon: Wrench },
    { label: "Mess Menu Editor", href: "/staff/mess", icon: UtensilsCrossed },
    { label: "Room Allocations", href: "/staff/allocations", icon: Building, badge: "Admin" },
    { label: "Publish Notices", href: "/staff/notices", icon: Bell },
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
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
      <div>
        {/* Karunya EduStay Staff Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black text-sm shadow-sm">
              ES
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white leading-tight">
                <span>Edu</span>
                <span className="text-amber-400">Stay</span>
              </div>
              <div className="text-[9px] uppercase tracking-wider font-bold text-slate-400">
                Staff Administration
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800">
            Staff Portal
          </span>
        </div>

        {/* Navigation Items */}
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
                    ? "bg-amber-500 text-slate-950 font-bold shadow-sm"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-slate-950" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? "bg-slate-950 text-amber-400"
                          : "bg-slate-800 text-amber-300 border border-slate-700"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      isActive ? "text-slate-950" : "text-slate-600 group-hover:text-slate-400"
                    }`}
                  />
                </div>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-900 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Staff Session</span>
        </button>
      </div>
    </aside>
  );
}

