"use client";

import React from "react";
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
} from "lucide-react";

export function StaffSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Dashboard", href: "/staff/dashboard", icon: LayoutDashboard },
    { label: "Hostel Roll-Call", href: "/staff/attendance", icon: ClipboardCheck },
    { label: "Outpass Queue", href: "/staff/outpass", icon: FileCheck2 },
    { label: "Maintenance Tickets", href: "/staff/complaints", icon: Wrench },
    { label: "Mess Menu Editor", href: "/staff/mess", icon: UtensilsCrossed },
    { label: "Room Allocations", href: "/staff/allocations", icon: Building },
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
    <aside className="w-64 bg-karunya-navy flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none font-poppins">
      <div>
        {/* Brand header */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm shrink-0">
              <img
                src="/karunya-logo.png"
                alt="Karunya Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="font-bold text-base text-white leading-tight font-lora">
                EduStay
              </div>
              <div className="text-[11px] text-blue-300 font-medium mt-0.5">
                Staff Administration
              </div>
            </div>
          </div>
        </div>

        {/* Navigation label */}
        <div className="px-5 pt-5 pb-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-400/70">
            Navigation
          </span>
        </div>

        {/* Navigation list */}
        <nav className="px-3 space-y-0.5 overflow-y-auto max-h-[calc(100vh-160px)] pb-4 text-sm">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
                  isActive
                    ? "bg-karunya-blue/20 text-white font-semibold border-l-[3px] border-karunya-blue pl-[9px]"
                    : "text-blue-200/80 hover:text-white hover:bg-white/10 border-l-[3px] border-transparent"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive ? "text-karunya-sky" : "text-blue-400 group-hover:text-blue-200"
                  }`}
                />
                <span className="text-[13px]">{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-karunya-sky" />
                )}
              </a>
            );
          })}
        </nav>
      </div>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium text-blue-200/70 hover:text-white hover:bg-white/10 transition-all duration-150"
        >
          <LogOut className="w-4 h-4 text-blue-400" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
