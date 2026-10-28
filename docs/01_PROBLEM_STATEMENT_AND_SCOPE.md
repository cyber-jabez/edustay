# 1. Problem Statement, Project Objectives & Scope
**EduStay: Karunya University Smart Hostel Management & Student Residence Portal**

---

## 1.1 Problem Statement
Karunya Institute of Technology and Sciences (KITS), Coimbatore accommodates thousands of residential students across multiple premier hostel facilities (including Father Duraisamy, P. R. Garg, Edward George, Angelina, Hepzibah, S. G. Bobraj, Jerry Manual, Johnson Victor, and Bethany). Traditionally, university residence administration encountered several systemic bottlenecks:

1. **Fragmented Communication & Residence Silos**:
   Room allocations, roommate requests, and warden oversight were previously handled through disconnected spreadsheets or paper forms, leading to double-allocation risks and human pairing discrepancies.
2. **Delayed & Unverified Outpass Approvals**:
   Leave authorization (local weekend city visits, academic hackathons, and home visits) required physical signatures or unstructured approvals. Crucially, the requirement for independent mentor academic clearance and SRA residential supervision was difficult to enforce simultaneously.
3. **Absence of Historical Continuity**:
   When students transferred rooms between semesters, earlier roommate pairings and residential histories were overwritten or lost, eliminating the audit trail required for institutional evaluation.
4. **Disconnection Between Roll Calls and Official Outpass Records**:
   Evening assembly and night roll-call attendance (conducted by SRAs at 08:30 PM) often lacked real-time synchronization with active approved outpasses, leading to unwarranted absence markers for students legitimately outside campus.
5. **Lack of Transparent Meal Planning & Maintenance Lifecycles**:
   Dining menus and maintenance complaints lacked transparent state machines (`SUBMITTED` → `ACKNOWLEDGED` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`), depriving students of real-time resolution updates.

---

## 1.2 Project Objectives
EduStay was engineered to establish a modern, PostgreSQL-backed web platform tailored for academic software engineering standards:

- **Centralized Institutional Single Source of Truth**: Leverage PostgreSQL with normalized relational models for users, student profiles, staff assignments, hostel hierarchy, beds, attendance sessions, and outpasses.
- **Strict Role-Based Access Control (RBAC)**: Support 6 distinct institutional personas: Student, Mentor, SRA, Warden, Hostel Administrator, and System Administrator, with record-level authorization boundaries.
- **Dual Independent Authorization State Machine**: Guarantee that outpass applications (Yellow, Green, and White Forms) strictly require both assigned Mentor clearance AND assigned SRA approval before becoming officially authorized.
- **Capacity & Relational Integrity**: Enforce constraints preventing room over-occupancy, conflicting active bed tenancies, and overlapping active allocations.
- **High-Density Academic User Interface**: Faithfully adapt the aesthetic principles and layout architecture of Karunya’s EduServe portal (fixed left sidebar, top navbar, verified profile banner with class attendance, assembly attendance, arrears, and spacious module cards).

---

## 1.3 Scope of the Deliverable

### In-Scope:
- Full-stack production application built on Next.js 14 App Router, TypeScript strict mode, Tailwind CSS, and Prisma ORM.
- Real PostgreSQL 16 persistence.
- Complete authentication with HttpOnly session cookies, bcrypt password hashing, and role selector.
- Student Dashboard, Personal Details, Academic & Hostel Attendance, Room Selection, Roommate Pairing, Residential History, Mess Menu, Complaints, Notices, and AI Reporting.
- Staff Dashboard with SRA Roll-Call Sheet, Outpass Decision Center, Maintenance Ticket Updater, and Room Bed Allotment Engine.
- Automated Vitest test suite testing auth, RBAC, outpass dual approval, capacity constraints, and attendance calculation formulas.

### Out-of-Scope (Future Institutional Phases):
- Live hardware integration with campus biometric RFID turnstiles.
- Live payment gateway processing for hostel caution deposits.

