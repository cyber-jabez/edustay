# 3. Software Requirements Specification (SRS)
**EduStay: Karunya University Smart Hostel Management Portal**

---

## 3.1 Functional Requirements (FR)

### Module 1: Authentication & Access Control (FR-AUTH)
- **FR-AUTH-01**: The system shall provide a dedicated `/login` route featuring Karunya university branding and dual role cards: "KITS Students" and "Staffs & Others".
- **FR-AUTH-02**: The system shall validate passwords using bcrypt with a minimum work factor of 10.
- **FR-AUTH-03**: Upon successful verification, the system shall issue an encrypted JWT session stored in an HttpOnly, SameSite=Lax cookie with 24-hour expiration.
- **FR-AUTH-04**: The system shall enforce role validation on every server action and API request, preventing privilege escalation.

### Module 2: Student Residence Management (FR-STU)
- **FR-STU-01**: The student dashboard shall display verified student identity (Name, Register No, Department, Programme, Hostel, Room, Bed).
- **FR-STU-02**: The dashboard shall display exact attendance metrics: Class Attendance (%), Assembly Attendance (%), Arrears count, and CGPA.
- **FR-STU-03**: Students shall be permitted to edit contact details (phone, blood group, emergency contact, address) but barred from modifying official academic records or confirmed room allocations.
- **FR-STU-04**: The system shall preserve chronological residential history when students transfer rooms, retaining past hostels, wings, rooms, dates, and roommates.

### Module 3: Attendance Analytics (FR-ATT)
- **FR-ATT-01**: Academic attendance shall be calculated strictly via:
  $$\text{Attendance \%} = \left(\frac{\text{Attended Eligible Sessions}}{\text{Scheduled Eligible Sessions}}\right) \times 100$$
- **FR-ATT-02**: Hostel attendance shall be distinct from academic attendance and record daily 08:30 PM roll calls with statuses: `PRESENT`, `ABSENT`, `APPROVED_OUTPASS`, and `EXCUSED`.
- **FR-ATT-03**: Approved outpass periods shall be categorized as authorized leave and shall not incur unauthorized absence penalties.

### Module 4: Hostel & Room Allocation (FR-ALLOC)
- **FR-ALLOC-01**: The system shall model the physical hierarchy: `University` → `Hostel` → `Wing` → `Floor` → `Room` → `Bed`.
- **FR-ALLOC-02**: Students shall express room type preferences (Single, Double, 4-Seater, 6-Seater, AC / Non-AC) and submit mutual preferred roommate requests.
- **FR-ALLOC-03**: The allocation engine shall reject transactions that violate room capacity, double-allocate an occupied bed, or assign students to incompatible gender residences.

### Module 5: Outpass Dual Authorization Workflow (FR-OUT)
- **FR-OUT-01**: Support configurable form types: Yellow Form (Local city, max 1 day), Green Form (Official academic duty, max 5 days), and White Form (Home vacation, max 14 days).
- **FR-OUT-02**: The application shall route leave requests to the student's assigned Mentor AND assigned SRA.
- **FR-OUT-03**: The request status shall remain `PENDING_SRA` or `PENDING_MENTOR` if only one reviewer approves. Status shall transition to `APPROVED` if and only if BOTH reviewers grant approval.
- **FR-OUT-04**: Rejection by either reviewer shall transition the request status to `REJECTED`.

### Module 6: Maintenance Complaints & Dining (FR-OPS)
- **FR-OPS-01**: Students shall submit maintenance complaints categorized into Wi-Fi, Electrical, Plumbing, Cleaning, Mess, etc., with assigned priority.
- **FR-OPS-02**: Complaints shall transition through `SUBMITTED` → `ACKNOWLEDGED` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`.
- **FR-OPS-03**: Authorized staff shall publish 7-day dining schedules with dish descriptions, vegetarian/non-vegetarian tags, and allergen notices.

---

## 3.2 Non-Functional Requirements (NFR)

- **NFR-PERF-01 (Performance)**: Page render and API response latency shall not exceed 500ms under standard local network conditions.
- **NFR-SEC-01 (Security)**: All database writes shall execute within parameterized ORM transactions preventing SQL injection.
- **NFR-SEC-02 (Data Privacy)**: Student emergency contacts and application documents shall be subject to record-level authorization.
- **NFR-AUDIT-01 (Auditability)**: All significant administrative actions (room allocations, attendance marking, outpass decisions) shall be persisted to the `AuditLog` table.
- **NFR-REL-01 (Reliability)**: Database integrity constraints (unique composite keys, foreign keys) shall prevent orphaned records.
- **NFR-UX-01 (Design Fidelity)**: The interface shall adhere to Karunya EduServe's visual aesthetic with high information density, accessible contrast, and clean layout cards.

