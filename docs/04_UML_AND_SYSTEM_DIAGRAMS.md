# 4. UML & System Architecture Diagrams
**EduStay: Karunya University Smart Hostel Management Portal**

---

## 4.1 System Architecture Diagram
The application follows a clean 3-tier decoupled architecture hosted with Next.js App Router and PostgreSQL 16 persistence:

```mermaid
flowchart TD
    subgraph PresentationTier ["Presentation Tier (Client Browser)"]
        UI["Next.js App Router (React 18 / Tailwind CSS)"]
        Components["Radix UI Primitives & Lucide Icons"]
        Charts["Recharts Analytics Visualizer"]
    end

    subgraph ApplicationTier ["Application & Security Tier (Next.js Server)"]
        AuthMiddleware["JWT Session & RBAC Authorization Layer"]
        APIRoutes["Route Handlers (/api/auth, /api/student, /api/staff)"]
        Services["Domain Engines (Allocation, Outpass State Machine, Attendance)"]
    end

    subgraph DataTier ["Data Persistence Tier (PostgreSQL 16)"]
        PrismaORM["Prisma Client ORM (Strict Type Engine)"]
        PGDB[("PostgreSQL 16 Relational Cluster (port 5433 / Neon)")]
    end

    UI -->|HTTPS / REST API Requests| AuthMiddleware
    AuthMiddleware --> APIRoutes
    APIRoutes --> Services
    Services --> PrismaORM
    PrismaORM -->|SQL Connection Pool| PGDB
```

---

## 4.2 Use Case UML Diagram
```mermaid
flowchart LR
    Student((KITS Student))
    Mentor((Faculty Mentor))
    SRA((Assigned SRA))
    Warden((Chief Warden))
    Admin((Hostel Admin))

    subgraph EduStaySystem ["EduStay Residence Portal"]
        UC1["Submit Room Preferences"]
        UC2["Apply for Outpass (Yellow/Green/White)"]
        UC3["View Academic & Hostel Attendance"]
        UC4["Register Maintenance Ticket"]
        UC5["View Mess Schedule"]
        UC6["Review Outpass (Mentor Clearance)"]
        UC7["Review Outpass (SRA Clearance)"]
        UC8["Mark Daily 08:30 PM Roll Call"]
        UC9["Resolve Maintenance Complaint"]
        UC10["Execute Bed Allotment & Transfer"]
        UC11["Publish Hostel Circular"]
    end

    Student --> UC1
    Student --> UC2
    Student --> UC3
    Student --> UC4
    Student --> UC5

    Mentor --> UC6

    SRA --> UC7
    SRA --> UC8
    SRA --> UC9

    Warden --> UC9
    Warden --> UC11

    Admin --> UC10
    Admin --> UC11
```

---

## 4.3 Sequence Diagram: Dual Outpass Authorization
```mermaid
sequenceDiagram
    autonumber
    actor S as KITS Student
    participant Portal as EduStay UI
    participant API as Outpass Engine
    participant DB as PostgreSQL 16
    actor M as Faculty Mentor
    actor SRA as Assigned SRA

    S->>Portal: Selects Form (Yellow/Green/White) & Enters Travel Details
    Portal->>API: POST /api/outpass
    API->>DB: INSERT OutpassRequest (status = SUBMITTED, mentor = PENDING, sra = PENDING)
    API->>DB: INSERT In-app Notification for Mentor & SRA
    DB-->>Portal: Outpass Created (e.g. OUT-2026-0001)
    Portal-->>S: Application Submitted for Dual Review

    Note over M,API: Phase 1: Mentor Independent Decision
    M->>Portal: Reviews Mentee Academic & Disciplinary Standing
    Portal->>API: POST /api/staff/outpass/decide (decision = APPROVED)
    API->>DB: UPDATE Outpass (mentorDecision = APPROVED, status = PENDING_SRA)
    Note over API: Status remains PENDING_SRA (Single approval insufficient!)

    Note over SRA,API: Phase 2: SRA Residential Clearance
    SRA->>Portal: Reviews Residence Wing Scope & Timings
    Portal->>API: POST /api/staff/outpass/decide (decision = APPROVED)
    API->>DB: Check: Both mentorDecision AND sraDecision == APPROVED
    API->>DB: UPDATE Outpass (sraDecision = APPROVED, status = APPROVED)
    API->>DB: INSERT Notification to Student ("Fully Approved")
    DB-->>Portal: Transaction Committed
    Portal-->>S: Outpass Status: FULLY APPROVED
```

---

## 4.4 Activity Diagram: Room Selection & Allotment Engine
```mermaid
flowchart TD
    Start([Student Opens Portal]) --> CheckWindow{Is Allocation Window Open?}
    CheckWindow -- No --> WaitWindow[Display Window Upcoming Notice] --> End([End])
    CheckWindow -- Yes --> BrowseHostels[Browse Hostels matching Gender]
    BrowseHostels --> SelectPreferences[Select Room Type: Single/Double/4-Seater & AC Option]
    SelectPreferences --> AddRoommate[Enter Preferred Roommate Register Number]
    AddRoommate --> SubmitPref[Submit Preferences to Database]
    SubmitPref --> StaffReview[Hostel Admin Reviews Allocation Window]
    StaffReview --> CheckCapacity{Does Room have Available Bed?}
    CheckCapacity -- No --> RejectRoom[Flag as Capacity Exceeded / Waitlist]
    CheckCapacity -- Yes --> CheckBed{Is Target Bed Occupied?}
    CheckBed -- Yes --> RejectBed[Reject Conflicting Assignment]
    CheckBed -- No --> CommitAllocation[Transaction: Occupy Bed, Increment Count, Create RoomAllocation, Update History]
    CommitAllocation --> NotifyStudent[Notify Student of Confirmed Room & Bed Allotment] --> Complete([Allocation Finalized])
```

---

## 4.5 Activity Diagram: Hostel Night Roll-Call Attendance
```mermaid
flowchart TD
    SRAStart([SRA Opens Staff Attendance]) --> SelectWing[Select Assigned Hostel Wing & Date]
    SelectWing --> LoadRoster[Fetch Student Residents in Wing from DB]
    LoadRoster --> ReviewRoster[Inspect Room & Bed Numbers]
    ReviewRoster --> CheckOutpass{Does Student have Approved Outpass?}
    CheckOutpass -- Yes --> MarkOutpass[Auto-suggest: APPROVED_OUTPASS]
    CheckOutpass -- No --> RollCall{Is Student Physically Present?}
    RollCall -- Yes --> MarkPresent[Mark Status: PRESENT]
    RollCall -- No --> MarkAbsent[Mark Status: ABSENT]
    MarkOutpass --> SaveSession[SRA Clicks Submit Roll-Call Session]
    MarkPresent --> SaveSession
    MarkAbsent --> SaveSession
    SaveSession --> TransactionCommit[Transaction: Save HostelAttendanceSession & Records, Insert AuditLog]
    TransactionCommit --> Finish([Daily Roll-Call Complete])
```

---

## 4.6 Component Diagram
```mermaid
flowchart TD
    subgraph UIModule ["Frontend Client Components"]
        LoginComp["Login Component (Dual Role Selector)"]
        DashComp["Dashboard Banner & Metric Cards"]
        OutpassComp["Outpass Application & Live Tracker"]
        AllocComp["Room Allocation & Roommate Browser"]
        AttComp["Academic & Roll-Call Visualizer"]
        NavComp["Sidebar Navigation & Notification Bell"]
    end

    subgraph ServiceModule ["Backend Services & Middleware"]
        AuthService["Auth & JWT Cookie Service"]
        RBACService["RBAC Permission Matrix"]
        AllocEngine["Allocation & Capacity Engine"]
        OutpassService["Dual Approval State Service"]
        AttendanceService["Attendance Formula Engine"]
        ReportService["AI Report Synthesis Engine"]
    end

    subgraph DataAccessModule ["Data Access & Models"]
        PrismaClient["Prisma Client Instance"]
        PostgresDB[("PostgreSQL 16 Tables")]
    end

    UIModule --> ServiceModule
    ServiceModule --> DataAccessModule
```

---

## 4.7 Deployment Diagram
```mermaid
flowchart TD
    subgraph ClientHost ["Client Tier"]
        Browser["Modern Browser (Chrome / Edge / Firefox)"]
    end

    subgraph ApplicationHost ["Next.js Application Server (Node.js runtime / Vercel)"]
        NextServer["Next.js 14 App Server (Port 3000)"]
        EnvConfig[".env (JWT_SECRET, DATABASE_URL)"]
    end

    subgraph DatabaseHost ["Database Infrastructure (Local Cluster / Managed Neon)"]
        PostgresService["PostgreSQL 16 Engine (Port 5433 / 5432)"]
        DataDir["Storage: edustay DB, WAL logs, Tablespaces"]
    end

    Browser -->|HTTPS / Port 443| NextServer
    NextServer -->|TCP / Connection Pool| PostgresService
    PostgresService --> DataDir
```

