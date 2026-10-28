# EduStay: Karunya University Smart Hostel Management Portal
**Department of Computer Science & Engineering — Software Engineering Academic Project**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6_Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.15-blue?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-green?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1_Tests_Passed-yellow?style=flat&logo=vitest)](https://vitest.dev/)

---

## 1. Executive Summary
**EduStay** is a production-grade, centralized residence management and student life platform designed for **Karunya Institute of Technology and Sciences (Deemed to be University), Coimbatore**. 

Developed as a Software Engineering academic deliverable, EduStay completely replaces traditional paper-based and siloed hostel administration with a PostgreSQL-backed relational system. It faithfully reconstructs the layout hierarchy and user experience of Karunya's EduServe portal (as shown in the institutional reference screenshots), modernizing it with responsive cards, strict Role-Based Access Control (RBAC), and transactional integrity.

---

## 2. Key Modules & Functional Workflows

### 1. Student Identity & Reference Portal Dashboard
- Recreated from the Karunya EduServe student dashboard reference screenshot:
  - Student photo avatar with verified checkmark.
  - Student metadata: `JABEZ GABRIELRAJ E` | `URK25CS6015` | `B.Tech (CS6)` | `jabezgabrielraj@karunya.edu.in`.
  - The exact 3 reference outline stat boxes:
    - **99.00% Class Attendance** (Green outline)
    - **100.00% Assembly Attendance** (Purple outline)
    - **0 No. of Arrears** (Red outline)
    - **8.92 CGPA** (Blue outline)
  - Active residence badge: Father Duraisamy Hostel, Wing A, Room 204 (Bed A).
  - Spacious white module cards with Lucide iconography for all residence services.

### 2. Dual-Approval Outpass State Machine
- Supports Yellow Form (Local city/weekend), Green Form (Academic duty), and White Form (Vacation/Home travel).
- **Strict Software Engineering Constraint**: An outpass strictly requires independent approvals from BOTH the assigned Faculty Mentor AND the assigned Student Resident Advisor (SRA).
- Status remains `PENDING_SRA` or `PENDING_MENTOR` after one approval; transitions to `APPROVED` only when both grant clearance; transitions to `REJECTED` if either rejects.

### 3. Physical Residence Hierarchy & Concurrency Control
- Models physical structure: `University` → `Hostel` → `Wing` → `Floor` → `Room` → `Bed` → `Student Allocation`.
- Prevents overbooking rooms beyond capacity and eliminates conflicting double-occupancy on the same bed.
- Supports mutual preferred roommate pairing by student register number.
- Preserves historical semesters in `ResidentialHistory` across room transfers.

### 4. Distinct Academic & Hostel Attendance
- **Academic Attendance**: Percentage calculated using verified university formulas:
  $$\text{Attendance \%} = \left(\frac{\text{Attended Sessions}}{\text{Scheduled Eligible Sessions}}\right) \times 100$$
- **Hostel Attendance**: SRA daily 08:30 PM roll call sheet with `Present`, `Absent`, `Approved Outpass`, and `Excused` statuses.

### 5. Mess Dining Management & Maintenance Tickets
- Weekly 7-day meal schedules (Breakfast, Lunch, Snacks, Dinner) with vegetarian/non-vegetarian tags and allergen disclosures.
- Maintenance complaint ticketing with full lifecycle: `Submitted` → `Acknowledged` → `Assigned` → `In Progress` → `Resolved` → `Closed`.

### 6. AI-Assisted Residence Reports
- Deterministic, database-grounded analysis of student attendance compliance, outpass movement, and residence standing with explicit coverage and generation timestamps.

---

## 3. Technology Stack

- **Frontend**: Next.js 14 (App Router), TypeScript (Strict Mode), Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: Next.js Server Actions & Route Handlers, Zod Validation, RBAC Security Service.
- **Database & ORM**: PostgreSQL 16 (Relational engine), Prisma ORM 5.22 with version-controlled schema.
- **Security**: Bcrypt password hashing (work factor 10), JOSE encrypted JWT session tokens stored in HttpOnly cookies.
- **Testing**: Vitest automated test suite covering authentication, RBAC, capacity constraints, and dual outpass approvals.

---

## 4. Pre-configured Demonstration Accounts

All demo accounts use the standard password: **`karunya123`**

| Role | Identifier / Code | Name | Scope / Responsibility |
| :--- | :--- | :--- | :--- |
| **Student (Primary)** | `URK25CS6015` | Jabez Gabrielraj E | B.Tech CS6 student in Father Duraisamy Room 204 |
| **Student (Roommate)**| `URK25CS6016` | Samuel Johnson K | Roommate in Room 204 (Bed B) |
| **SRA** | `SRA001` | Mr. D. Joseph | SRA for Father Duraisamy Wing A (Marks roll call) |
| **Faculty Mentor** | `MENTOR01` | Dr. R. Philip | CSE Faculty Mentor (Reviews outpasses) |
| **Hostel Warden** | `WARDEN01` | Dr. K. Samuel | Chief Warden of Men's Residences |
| **Hostel Admin** | `HADMIN01` | Dr. C. Andrews | Director of Student Residences (Allots rooms) |
| **System Admin** | `SYSADMIN` | CIT Admin Officer | Centre for Information Technology (Full audit) |

---

## 5. Quick Start Instructions

```bash
# 1. Install dependencies
npm install

# 2. Push schema to PostgreSQL database
npx prisma db push

# 3. Seed realistic university demonstration dataset
npm run db:seed

# 4. Run automated test suite
npm run test

# 5. Start the web application
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to access EduStay.

---

## 6. Software Engineering Documentation (`/docs`)

Comprehensive documentation is provided in the `/docs` directory:
- [01 Problem Statement and Scope](docs/01_PROBLEM_STATEMENT_AND_SCOPE.md)
- [02 Stakeholder Analysis](docs/02_STAKEHOLDER_ANALYSIS.md)
- [03 Software Requirements Specification (SRS)](docs/03_SOFTWARE_REQUIREMENTS_SPECIFICATION.md)
- [04 UML and System Diagrams](docs/04_UML_AND_SYSTEM_DIAGRAMS.md) (Use Case, Class, Activity, Sequence, Architecture, Deployment)
- [05 Database Design & Data Dictionary](docs/05_DATABASE_DESIGN_AND_DATA_DICTIONARY.md) (ER Diagram & Schema)
- [06 API Specification](docs/06_API_SPECIFICATION.md)
- [07 Test Plan, Results & Traceability Matrix](docs/07_TEST_PLAN_RESULTS_AND_TRACEABILITY.md)
- [08 Security and Data Governance](docs/08_SECURITY_AND_DATA_GOVERNANCE.md)
- [09 User Manual](docs/09_USER_MANUAL.md)
- [10 Installation and Deployment Guide](docs/10_INSTALLATION_AND_DEPLOYMENT_GUIDE.md)

---

## 7. License & Academic Attribution
Developed for the **Software Engineering (SEM 3)** curriculum at **Karunya Institute of Technology and Sciences, Coimbatore**.
© 2026 EduStay • All institutional rights reserved.

