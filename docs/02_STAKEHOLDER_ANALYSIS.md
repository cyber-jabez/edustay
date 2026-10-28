# 2. Stakeholder Analysis
**EduStay: Karunya University Smart Hostel Management Portal**

---

| Stakeholder Role | Primary Responsibilities & Goals | Operational Scope | System Access Boundaries |
| :--- | :--- | :--- | :--- |
| **KITS Students** | - Submit room and preferred roommate preferences.<br>- Apply for Yellow, Green, and White Form outpasses.<br>- Monitor academic and hostel roll-call attendance.<br>- Register room and Wi-Fi maintenance tickets.<br>- View weekly mess dining schedules. | Self profile, room, and authorized roommate details. | Read/Write access to own profile, outpass submissions, preferences, and complaints. Zero access to staff decision queues or other students' private records. |
| **Faculty Mentors** | - Supervise mentee academic progression and attendance compliance.<br>- Review, approve, or reject mentee outpass leave applications with comments. | Assigned department mentees. | Filter and review outpasses assigned to them. Cannot approve requests for students outside their assigned mentee roster. |
| **Student Resident Advisors (SRAs)** | - Conduct daily 08:30 PM hostel roll calls.<br>- Perform residence outpass evaluation.<br>- Monitor wing occupancy and student welfare.<br>- Handle residence maintenance escalation. | Assigned hostel wing/block (e.g. Father Duraisamy Wing A). | Read/Write access to wing attendance roster and resident outpasses. Cannot modify academic records or system settings. |
| **Hostel Chief Wardens** | - Overall administrative supervision of designated residences.<br>- Review escalated maintenance complaints.<br>- Publish hostel-wide circulars and prayer timings.<br>- Oversee occupancy and safety compliance. | Designated hostel (e.g., Father Duraisamy, Hepzibah). | High-level hostel reporting, escalated decision override, notice publication. |
| **Hostel Administrators** | - Define allocation windows and eligibility criteria.<br>- Manage hostel hierarchy: Hostel → Wing → Floor → Room → Bed.<br>- Process room transfers and execute bed allotments.<br>- Manage weekly mess dining menus. | All university residence hostels. | University-wide residence management, room allotment engine, dining menu publisher. |
| **System Administrators (CIT)** | - User provisioning and institutional identifier mapping.<br>- Policy versioning and form template configuration.<br>- Audit trail monitoring and system security oversight. | Entire university platform. | Full administrative read/write access and audit inspection. |

