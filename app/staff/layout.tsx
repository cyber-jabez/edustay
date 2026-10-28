import React from "react";
import { StaffSidebar } from "@/components/staff-sidebar";
import { PortalNavbar } from "@/components/portal-navbar";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <StaffSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <PortalNavbar title="EduStay Staff Administration • Karunya University" />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        <footer className="w-full border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
            <div>© 2026 EduStay • Karunya Institute of Technology and Sciences (Staff Supervisory Console)</div>
            <div className="text-[11px] text-slate-400">Restricted Institutional Access</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

