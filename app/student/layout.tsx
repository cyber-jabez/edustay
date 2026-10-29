import React from "react";
import { StudentSidebar } from "@/components/student-sidebar";
import { PortalNavbar } from "@/components/portal-navbar";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-karunya-pageBg font-poppins text-slate-800">
      <StudentSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <PortalNavbar title="EduStay • Student Residence Portal" />
        <main className="flex-1 p-6 max-w-6xl w-full mx-auto space-y-6">
          {children}
        </main>

        <footer className="w-full border-t border-slate-200 py-3 px-6 text-center text-[11px] text-slate-400 bg-white">
          © 2026 EduStay • Karunya Institute of Technology and Sciences
        </footer>
      </div>
    </div>
  );
}
