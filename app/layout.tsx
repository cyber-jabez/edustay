import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduStay | Karunya University Smart Hostel Management Portal",
  description:
    "EduStay - Centralized digital residence management platform for students, mentors, SRAs, wardens, and administrators at Karunya Institute of Technology and Sciences, Coimbatore.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
        {children}
      </body>
    </html>
  );
}

