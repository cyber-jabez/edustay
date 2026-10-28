# 7. Test Plan, Results & Traceability Matrix
**EduStay: Karunya University Smart Hostel Management Portal**

---

## 7.1 Automated Test Execution Results
The test suite was executed using Vitest against the PostgreSQL database cluster:

```
 RUN  v2.1.9 C:/Users/2005z/OneDrive/Desktop/SEM 3/SOFTWARE/MICRo

 ✓ tests/attendance_formula.test.ts (2 tests) 7ms
 ✓ tests/rbac.test.ts (4 tests) 9ms
 ✓ tests/room_allocation_constraints.test.ts (2 tests) 190ms
 ✓ tests/outpass_dual_approval.test.ts (2 tests) 229ms
 ✓ tests/auth.test.ts (3 tests) 393ms

 Test Files  5 passed (5)
      Tests  13 passed (13)
   Duration  5.21s
```

---

## 7.2 Requirements-to-Test Traceability Matrix (RTM)

| Requirement ID | Description | Implementation File | Automated Test File | Test Status |
| :--- | :--- | :--- | :--- | :--- |
| **FR-AUTH-01** | Dedicated login route with KITS Student vs Staff choices | `app/login/page.tsx` | `tests/auth.test.ts` | **PASSED** |
| **FR-AUTH-02** | Bcrypt password verification | `lib/auth/password.ts` | `tests/auth.test.ts` | **PASSED** |
| **FR-AUTH-03** | Encrypted JWT session cookies | `lib/auth/session.ts` | `tests/auth.test.ts` | **PASSED** |
| **FR-AUTH-04** | Role-based authorization & privilege isolation | `lib/permissions/rbac.ts` | `tests/rbac.test.ts` | **PASSED** |
| **FR-STU-02** | Student profile attendance percentages & arrears | `app/student/dashboard/page.tsx` | `tests/attendance_formula.test.ts` | **PASSED** |
| **FR-STU-04** | Preservation of past residential histories | `app/student/residential-history/page.tsx` | `tests/room_allocation_constraints.test.ts` | **PASSED** |
| **FR-ATT-01** | Calculation formula for academic attendance % | `app/api/student/attendance/route.ts` | `tests/attendance_formula.test.ts` | **PASSED** |
| **FR-ATT-02** | SRA 08:30 PM roll call distinct from academic classes | `app/staff/attendance/page.tsx` | `tests/attendance_formula.test.ts` | **PASSED** |
| **FR-ALLOC-03**| Room capacity & occupied bed concurrency constraint | `app/api/staff/allocations/route.ts` | `tests/room_allocation_constraints.test.ts` | **PASSED** |
| **FR-OUT-02** | Outpass dual independent approval constraint | `app/api/staff/outpass/decide/route.ts` | `tests/outpass_dual_approval.test.ts` | **PASSED** |
| **FR-OUT-03** | Single approval leaves outpass in Pending; both required for Approved | `app/api/staff/outpass/decide/route.ts` | `tests/outpass_dual_approval.test.ts` | **PASSED** |
| **FR-OUT-04** | Rejection by either reviewer transitions request to REJECTED | `app/api/staff/outpass/decide/route.ts` | `tests/outpass_dual_approval.test.ts` | **PASSED** |

