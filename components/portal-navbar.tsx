"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
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

  return (
    <header className="h-12 bg-white border-b border-zinc-200 px-6 flex items-center justify-between sticky top-0 z-20 font-sans">
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={() => router.back()}
            className="p-1 rounded border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition"
            title="Go back"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        )}
        <div className="text-xs font-semibold text-zinc-800">{title}</div>
      </div>

      <div className="flex items-center gap-3">
        {/* Persistent In-app Notification System */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 relative transition"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 text-zinc-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-3 h-3 rounded-full bg-zinc-900 text-[8px] text-white font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white border border-zinc-200 rounded-lg shadow-lg p-3 z-50 text-xs">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2">
                <span className="font-semibold text-zinc-800">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[10px] text-zinc-600 hover:text-zinc-900 font-medium"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-56 overflow-y-auto space-y-1.5">
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-zinc-400">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2 rounded border transition ${
                        n.isRead ? "bg-white border-zinc-100 text-zinc-500" : "bg-zinc-50 border-zinc-200 text-zinc-800"
                      }`}
                    >
                      <div className="font-semibold text-zinc-800 text-[11px] flex items-center gap-1.5">
                        {n.type === "SUCCESS" && <CheckCircle2 className="w-3 h-3 text-zinc-700" />}
                        {n.type === "ALERT" && <AlertTriangle className="w-3 h-3 text-zinc-700" />}
                        {n.type === "INFO" && <Info className="w-3 h-3 text-zinc-500" />}
                        <span>{n.title}</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Mini Profile Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-zinc-200">
          <div className="w-6 h-6 rounded-full bg-zinc-800 text-white flex items-center justify-center text-[10px] font-medium">
            JG
          </div>
          <span className="text-xs font-medium text-zinc-700 hidden sm:inline">Jabez Gabrielraj</span>
        </div>
      </div>
    </header>
  );
}
