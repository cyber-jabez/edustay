# 9. EduStay User Manual
**Karunya University Smart Hostel Management & Student Residence Portal**

---

## 9.1 Signing In
1. Navigate to the login portal at `http://localhost:3000/login`.
2. Under **"Select the role to Login"**, choose:
   - **KITS Students** for undergraduate and postgraduate residents.
   - **Staffs & Others** for Mentors, SRAs, Wardens, and Administrators.
3. Enter your institutional register number (e.g., `URK25CS6015`) or staff code, and password (default demo: `karunya123`).
4. Alternatively, click any of the **"Demonstration Accounts (Instant One-Click Login)"** buttons to auto-populate credentials for evaluation.

---

## 9.2 Student Operations Guide

### Viewing Dashboard & Attendance
- The dashboard highlights your active student banner: photo avatar, Register Number (`URK25CS6015`), degree (`B.Tech (CS6)`), institutional email, and the 3 Karunya EduServe outline stat boxes:
  - **99.00% Class Attendance** (Green outline)
  - **100.00% Assembly Attendance** (Purple outline)
  - **0 No. of Arrears** (Red outline)
  - **8.92 CGPA** (Blue outline)
- Click **Attendance** on the sidebar or module card to inspect subject-wise attendance percentages, session counts, and hostel roll-call compliance.

### Applying for an Outpass
1. Click **Outpass** on the sidebar.
2. Select your desired form:
   - **Yellow Form**: Local weekend city visits (return by 08:30 PM roll call).
   - **Green Form**: Academic events, hackathons, sports symposiums.
   - **White Form**: Vacation, study holidays, overnight home travel.
3. Fill in destination, contact phone, departure date/time, expected return date/time, and reason.
4. Click **Submit Outpass for Dual Review**.
5. Track the live visual progress bar showing independent Mentor review and SRA residence review.

### Selecting Room & Roommate Preferences
1. Click **Hostel Allocation** on the sidebar.
2. Select the open allocation window, preferred hostel (e.g. Father Duraisamy), room type (Single, Double, 4-Seater, 6-Seater), and AC preference.
3. Enter your preferred roommate's register number (e.g. `URK25CS6016`) for mutual pairing.
4. Click **Submit Preference Application**.

### Logging Maintenance Complaints
1. Click **Complaints & Maintenance**.
2. Select category (Wi-Fi, Electrical, Plumbing, Cleaning, Mess, etc.) and priority.
3. Enter title and details.
4. Track status updates and staff resolution comments in real time.

---

## 9.3 Staff Operations Guide

### SRA Night Roll-Call Marking
1. Log in as SRA (e.g., `SRA001` / `karunya123`).
2. Navigate to **Hostel Roll-Call** (`/staff/attendance`).
3. Select your assigned wing and roll-call date.
4. Review the resident roster with room and bed identifiers.
5. Mark each student as `Present`, `Absent`, `Approved Outpass`, or `Excused` (or click "Mark All Present").
6. Click **Save and Submit Official Roll-Call Session**.

### Mentor & SRA Outpass Decisions
1. Navigate to **Outpass Decisions** (`/staff/outpass`).
2. Review pending requests showing student identity, destination, timings, and parent consent.
3. Enter official decision comments.
4. Click **Grant Approval** or **Reject**.
5. Notice that if Mentor approves and SRA is pending, status becomes `PENDING_SRA`. Status becomes `APPROVED` only when BOTH grant authorization!

### Hostel Administration Bed Allotment
1. Log in as Hostel Administrator (`HADMIN01`).
2. Navigate to **Room Allocations** (`/staff/allocations`).
3. Select a student request from the preference queue.
4. Select an available bed from unoccupied inventory.
5. Click **Confirm & Persist Bed Allocation**. The engine atomically commits the allocation, updates occupancy counts, and records residential history.

