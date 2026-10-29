# EduStay Python Pytest Suite

A complete test suite powered by `pytest` verifying institutional business logic, role-based access control, dual-approval workflows, and live REST API integration.

## Test Suites

| File | Purpose | Coverage |
| --- | --- | --- |
| `test_attendance_logic.py` | Attendance calculations | 75% exam eligibility threshold, assembly compliance, hostel evening roll-call formulas, rounding |
| `test_outpass_workflow.py` | Outpass state machine | Yellow/Green/White duration limits, dual mentor & SRA approval transitions, rejection priority |
| `test_rbac_rules.py` | Access control specification | Permissions matrix for Student, Mentor, SRA, Warden, Hostel Admin, and System Admin |
| `test_allocation_rules.py` | Residence constraints | Room capacity boundaries, gender isolation, mutual roommate request symmetry |
| `test_api_integration.py` | Next.js API integration | Authentication flow, session cookies, `/api/auth/me`, notifications, protected routes |

## How to Run

### 1. Run all tests with pytest
```bash
pytest
```

### 2. Run logic tests only (offline, no server needed)
```bash
pytest tests_py/test_attendance_logic.py tests_py/test_outpass_workflow.py tests_py/test_rbac_rules.py tests_py/test_allocation_rules.py
```

### 3. Run full suite including live API integration
Ensure the dev server is running (`npm run dev`), then execute:
```bash
npm run test:pytest
# or
pytest tests_py
```

