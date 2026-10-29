"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  ChevronDown,
  LogOut,
  User,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface UserProfile {
  id: string;
  fullName: string;
  identifier: string;
  email: string;
  role: string;
  studentProfile?: {
    programme?: string;
    department?: string;
  } | null;
  staffProfile?: {
    designation?: string;
    department?: string;
  } | null;
}

export function PortalNavbar({
  title = "Residence Portal",
  showBack = false,
}: {
  title?: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Fetch notifications
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      })
      .catch(() => {});

    // Fetch active session user
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch {}
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .filter(Boolean)
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : user?.identifier
    ? user.identifier.slice(0, 2).toUpperCase()
    : "KU";

  const displayName = user?.fullName || user?.identifier || "Loading...";
  const displaySubtitle = user?.studentProfile?.programme
    ? user.studentProfile.programme
    : user?.staffProfile?.designation
    ? user.staffProfile.designation
    : user?.role === "STUDENT"
    ? "Student"
    : user?.role
    ? user.role.replace(/_/g, " ")
    : "Student";

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20 font-poppins shadow-sm">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <div className="text-sm font-semibold text-slate-800 font-lora">{title}</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowUserMenu(false);
            }}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 relative transition"
            title="Notifications"
          >
            <Bell style={{ width: '18px', height: '18px' }} className="text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-karunya-blue text-[8px] text-white font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-sm">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-2.5">
                <span className="font-semibold text-slate-800 font-lora text-sm">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-karunya-blue hover:text-sky-700 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-1.5">
                {notifications.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-lg border transition ${
                        n.isRead
                          ? "bg-white border-slate-100 text-slate-500"
                          : "bg-blue-50 border-blue-100 text-slate-800"
                      }`}
                    >
                      <div className="font-semibold text-slate-800 text-[12px] flex items-center gap-1.5">
                        {n.type === "SUCCESS" && <CheckCircle2 className="w-3 h-3 text-emerald-500" />}
                        {n.type === "ALERT" && <AlertTriangle className="w-3 h-3 text-amber-500" />}
                        {n.type === "INFO" && <Info className="w-3 h-3 text-karunya-blue" />}
                        <span>{n.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dynamic User Profile Widget */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowUserMenu(!showUserMenu);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-200 hover:opacity-85 transition text-left"
          >
            <div className="w-8 h-8 rounded-full bg-karunya-navy text-white flex items-center justify-center text-[11px] font-semibold">
              {initials}
            </div>
            <div className="hidden sm:block">
              <div className="text-[13px] font-semibold text-slate-700 leading-tight max-w-[150px] truncate">
                {displayName}
              </div>
              <div className="text-[10px] text-slate-400 font-medium leading-tight max-w-[150px] truncate">
                {displaySubtitle}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* User Profile Dropdown */}
          {showUserMenu && user && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-3 z-50 text-xs">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-9 h-9 rounded-full bg-karunya-navy text-white flex items-center justify-center text-xs font-semibold">
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-800 text-sm truncate">{user.fullName}</div>
                  <div className="text-slate-400 font-mono text-[11px]">{user.identifier}</div>
                </div>
              </div>

              <div className="py-2 space-y-1 text-slate-600 border-b border-slate-100">
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Email:</span>
                  <span className="font-medium text-slate-700 truncate max-w-[150px]">{user.email}</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Role:</span>
                  <span className="font-semibold text-karunya-blue">{user.role}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
