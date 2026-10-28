# 6. API Specification & Endpoint Documentation
**EduStay: Karunya University Smart Hostel Management Portal**

---

## 6.1 Authentication Endpoints

### 1. `POST /api/auth/login`
- **Description**: Authenticates institutional student or staff credentials and issues an HttpOnly session JWT.
- **Request Body**:
  ```json
  {
    "identifier": "URK25CS6015",
    "password": "karunya123",
    "roleType": "STUDENT"
  }
  ```
- **Success Response (200 OK)**:
  ```json
  {
    "success": true,
    "user": {
      "id": "uuid",
      "identifier": "URK25CS6015",
      "fullName": "JABEZ GABRIELRAJ E",
      "role": "STUDENT"
    },
    "redirectUrl": "/student/dashboard"
  }
  ```
- **Error Responses**: `400 Bad Request` (Invalid params), `401 Unauthorized` (Bad password), `403 Forbidden` (Role mismatch).

### 2. `POST /api/auth/logout`
- **Description**: Clears session cookie and writes audit log.

---

## 6.2 Student Endpoints

### 3. `GET /api/student/dashboard`
- **Description**: Retrieves student identity, academic stats, residence assignment, roommates, and recent activity.

### 4. `PUT /api/student/personal-details`
- **Description**: Updates student-controlled fields (phone, emergency contacts, address). Rejects modifications to official academic fields.

### 5. `GET /api/student/attendance`
- **Description**: Returns formula calculation, subject-wise academic attendance, and hostel 08:30 PM roll call history.

### 6. `POST /api/student/hostel-allocation`
- **Description**: Submits room preference (Hostel, room type, AC option) and preferred roommate student identifier.

### 7. `POST /api/outpass`
- **Description**: Submits leave request for Yellow, Green, or White Form.
- **Request Body**:
  ```json
  {
    "formTypeCode": "YELLOW",
    "destination": "Gandhipuram, Coimbatore",
    "reason": "Textbooks & electronics project components",
    "departureTime": "2026-10-30T09:00:00.000Z",
    "expectedReturnTime": "2026-10-30T20:30:00.000Z",
    "contactPhone": "+91 98401 23456",
    "parentConsentGiven": true
  }
  ```

---

## 6.3 Staff Endpoints

### 8. `POST /api/staff/outpass/decide`
- **Description**: Records independent Mentor or SRA decision and evaluates dual approval state machine.
- **Request Body**:
  ```json
  {
    "outpassId": "uuid-outpass",
    "decision": "APPROVED",
    "comments": "Good academic standing. Permitted."
  }
  ```
- **Dual Approval Rule**: Transitions to `APPROVED` if both reviewers approve; `REJECTED` if either rejects; `PENDING_SRA` / `PENDING_MENTOR` if one approved and other pending.

### 9. `POST /api/staff/attendance`
- **Description**: Marks daily 08:30 PM roll-call attendance session for resident wing.

### 10. `POST /api/staff/allocations`
- **Description**: Executes bed allotment validating room capacity and bed occupancy.

