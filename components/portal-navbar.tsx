"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  LogOut,
  Building,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export function PortalNavbar({
  title = "Student Residence Portal",
  showBack = false,
}: {
  title?: string;
  showBack?: boolean;
}) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
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
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition"
            title="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="text-sm font-bold text-slate-800">{title}</div>
      </div>

      <div className="flex items-center gap-4">
        {/* Persistent In-app Notification System */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 relative transition"
            title="Notifications"
          >
            <Bell className="w-4 h-4 text-slate-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-600 text-[10px] text-white font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-xl shadow-lg p-3 z-50 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="font-bold text-slate-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] text-[#0072bc] hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-slate-400">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded-lg border transition ${
                        n.isRead ? "bg-slate-50 border-slate-100 text-slate-600" : "bg-sky-50 border-sky-200 text-slate-800 font-medium"
                      }`}
                    >
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        {n.type === "SUCCESS" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        {n.type === "ALERT" && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                        {n.type === "INFO" && <Info className="w-3.5 h-3.5 text-sky-600" />}
                        <span>{n.title}</span>
                      </div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile Avatar */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#0a2240] text-white flex items-center justify-center text-xs font-bold border border-slate-300">
            JG
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-800">Jabez Gabrielraj</div>
            <div className="text-[10px] text-slate-500">URK25CS6015</div>
          </div>
        </div>
      </div>
    </header>
  );
}

