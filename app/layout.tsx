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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#f0f7ff] font-poppins antialiased text-slate-800">
        {children}
      </body>
    </html>
  );
}
