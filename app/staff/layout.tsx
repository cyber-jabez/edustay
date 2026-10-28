import React from "react";
import { StaffSidebar } from "@/components/staff-sidebar";
import { PortalNavbar } from "@/components/portal-navbar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-zinc-50 font-sans text-zinc-900">
      <StaffSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <PortalNavbar title="EduStay • Staff Administration" />
        <main className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
          {children}
        </main>

        <footer className="w-full border-t border-zinc-200 py-3 px-6 text-center text-xs text-zinc-400 bg-white">
          © 2026 EduStay • Karunya Institute of Technology and Sciences (Staff Supervisory Console)
        </footer>
      </div>
    </div>
  );
}
