# 8. Security & Data Governance
**EduStay: Karunya University Smart Hostel Management Portal**

---

## 8.1 Security Architecture & Controls

1. **Authentication Security**:
   - Industry-standard bcrypt hashing with work factor 10. Passwords are never stored or logged in plain text.
   - Session tokens generated via JOSE HMAC-SHA256 with server-side secrets (`JWT_SECRET`).
   - Stored in `HttpOnly`, `SameSite=Lax`, and `Secure` (production) cookies, mitigating Cross-Site Scripting (XSS) token theft.

2. **Access Control & Least Privilege**:
   - Zero self-service privilege escalation. Role validation is enforced on every API route handler.
   - Record-level authorization ensures students cannot access other students' private emergency contacts or documents.
   - Mentor and SRA decisions strictly verify that the authenticated staff member holds an active scope assignment over the target student or hostel wing.

3. **Database Integrity & Concurrency**:
   - PostgreSQL transactions (`prisma.$transaction`) ensure atomicity for multi-step mutations:
     - Outpass decision updates (simultaneous status history, approval log, audit record, and notification).
     - Room allocation (vacating prior beds, occupying target bed, updating student pointers, recording residential history).
   - Capacity constraint checks prevent overbooking rooms beyond rated bed limits.

4. **Institutional Audit Trails**:
   - Every login, profile update, outpass submission, roll-call marking, and room allocation logs an entry into the `AuditLog` table containing the executing `userId`, `action`, `entityType`, `entityId`, timestamp, and serialized parameters.

5. **AI Report Fact Grounding**:
   - Fulfilling academic software engineering integrity, AI reporting features are grounded entirely on deterministic database queries.
   - Source coverage, generation timestamps, and limitation disclaimers are explicitly displayed on all analytical outputs.

