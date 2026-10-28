import React from "react";
import { StudentSidebar } from "@/components/student-sidebar";
import { PortalNavbar } from "@/components/portal-navbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Fixed Left Navigation Sidebar matching Karunya reference portal */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <PortalNavbar title="EduStay • Student Residence & Hostel Portal" />
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>

        <footer className="w-full border-t border-slate-200 py-3 px-6 text-center text-xs text-slate-500 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
            <div>© 2026 EduStay • Karunya Institute of Technology and Sciences</div>
            <div className="text-[11px] text-slate-400">Coimbatore • Tamil Nadu, India</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

