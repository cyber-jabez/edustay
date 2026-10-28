import { PrismaClient, Role, GenderCategory, RoomType, OutpassStatus, OutpassDecision, ComplaintPriority, ComplaintStatus, AcademicAttendanceStatus, HostelAttendanceStatus, MealType, NoticeCategory, TargetAudience } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding EduStay Karunya database...");

  // Clear existing records to ensure clean state
  await prisma.auditLog.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.aIReport.deleteMany({});
  await prisma.notice.deleteMany({});
  await prisma.messMenuItem.deleteMany({});
  await prisma.messMenu.deleteMany({});
  await prisma.mess.deleteMany({});
  await prisma.complaintComment.deleteMany({});
  await prisma.complaint.deleteMany({});
  await prisma.outpassStatusHistory.deleteMany({});
  await prisma.outpassApproval.deleteMany({});
  await prisma.outpassRequest.deleteMany({});
  await prisma.outpassFormType.deleteMany({});
  await prisma.hostelAttendanceRecord.deleteMany({});
  await prisma.hostelAttendanceSession.deleteMany({});
  await prisma.academicAttendanceRecord.deleteMany({});
  await prisma.attendanceSession.deleteMany({});
  await prisma.residentialHistory.deleteMany({});
  await prisma.roomAllocation.deleteMany({});
  await prisma.roommatePreference.deleteMany({});
  await prisma.roomPreference.deleteMany({});
  await prisma.allocationWindow.deleteMany({});
  await prisma.staffScopeAssignment.deleteMany({});
  await prisma.studentProfile.deleteMany({});
  await prisma.staffProfile.deleteMany({});
  await prisma.bed.deleteMany({});
  await prisma.room.deleteMany({});
  await prisma.floor.deleteMany({});
  await prisma.wing.deleteMany({});
  await prisma.hostel.deleteMany({});
  await prisma.user.deleteMany({});

  const defaultPasswordHash = await bcrypt.hash("karunya123", 10);

  // 1. Staff Users
  const sysAdminUser = await prisma.user.create({
    data: {
      email: "admin@karunya.edu",
      identifier: "SYSADMIN",
      fullName: "Prof. Administrative Officer",
      role: Role.SYSTEM_ADMIN,
      passwordHash: defaultPasswordHash,
      phone: "+91 94420 00001",
      staffProfile: {
        create: {
          staffCode: "ADM001",
          designation: "Chief System Administrator",
          department: "Centre for Information Technology",
          staffType: Role.SYSTEM_ADMIN,
        },
      },
    },
    include: { staffProfile: true },
  });

  const hostelAdminUser = await prisma.user.create({
    data: {
      email: "hosteladmin@karunya.edu",
      identifier: "HADMIN01",
      fullName: "Dr. C. Andrews",
      role: Role.HOSTEL_ADMIN,
      passwordHash: defaultPasswordHash,
      phone: "+91 94420 00002",
      staffProfile: {
        create: {
          staffCode: "HADM01",
          designation: "Director of Student Residences",
          department: "Hostel Administration",
          staffType: Role.HOSTEL_ADMIN,
        },
      },
    },
    include: { staffProfile: true },
  });

  const wardenUser = await prisma.user.create({
    data: {
      email: "warden.duraisamy@karunya.edu",
      identifier: "WARDEN01",
      fullName: "Dr. K. Samuel",
      role: Role.WARDEN,
      passwordHash: defaultPasswordHash,
      phone: "+91 94420 00003",
      staffProfile: {
        create: {
          staffCode: "WRD001",
          designation: "Chief Warden - Men's Residences",
          department: "Mechanical Engineering",
          staffType: Role.WARDEN,
        },
      },
    },
    include: { staffProfile: true },
  });

  const sraUser = await prisma.user.create({
    data: {
      email: "sra.duraisamy@karunya.edu",
      identifier: "SRA001",
      fullName: "Mr. D. Joseph",
      role: Role.SRA,
      passwordHash: defaultPasswordHash,
      phone: "+91 94420 00004",
      staffProfile: {
        create: {
          staffCode: "SRA01",
          designation: "Student Resident Advisor",
          department: "Civil Engineering",
          staffType: Role.SRA,
        },
      },
    },
    include: { staffProfile: true },
  });

  const mentorUser = await prisma.user.create({
    data: {
      email: "mentor.philip@karunya.edu",
      identifier: "MENTOR01",
      fullName: "Dr. R. Philip",
      role: Role.MENTOR,
      passwordHash: defaultPasswordHash,
      phone: "+91 94420 00005",
      staffProfile: {
        create: {
          staffCode: "MNT001",
          designation: "Associate Professor & Faculty Mentor",
          department: "Computer Science and Engineering",
          staffType: Role.MENTOR,
        },
      },
    },
    include: { staffProfile: true },
  });

  // 2. Hostels Structure
  const duraisamyHostel = await prisma.hostel.create({
    data: {
      name: "Father Duraisamy",
      genderCategory: GenderCategory.MALE,
      buildingCode: "FD-RES",
      description: "Premier residence for undergraduate engineering students with high-speed Wi-Fi, solar heating, and gym.",
      contactNumber: "+91 422 261 4001",
      facilities: "High-speed Wi-Fi, 24x7 Solar Hot Water, Study Hall, Gymnasium, Badminton Court, Recreation Room",
      rules: "Evening roll call attendance at 08:30 PM. Outpasses must be secured by 05:00 PM. Silence hours 10:00 PM to 06:00 AM.",
      wardenId: wardenUser.staffProfile!.id,
    },
  });

  // Additional Hostels
  const otherHostels = [
    { name: "P. R. Garg", gender: GenderCategory.MALE, code: "PRG-RES" },
    { name: "Edward George", gender: GenderCategory.MALE, code: "EDG-RES" },
    { name: "Angelina", gender: GenderCategory.FEMALE, code: "ANG-RES" },
    { name: "Hepzibah", gender: GenderCategory.FEMALE, code: "HPZ-RES" },
    { name: "S. G. Bobraj", gender: GenderCategory.MALE, code: "SGB-RES" },
    { name: "Jerry Manual", gender: GenderCategory.MALE, code: "JRM-RES" },
    { name: "Johnson Victor", gender: GenderCategory.MALE, code: "JHV-RES" },
    { name: "Bethany", gender: GenderCategory.FEMALE, code: "BTH-RES" },
  ];

  for (const h of otherHostels) {
    await prisma.hostel.create({
      data: {
        name: h.name,
        genderCategory: h.gender,
        buildingCode: h.code,
        facilities: "Wi-Fi, Solar Water, Common Room, Water Purifier",
        rules: "Standard Karunya Residence Regulations apply.",
      },
    });
  }

  // Create Wings for Father Duraisamy Hostel
  const wingA = await prisma.wing.create({
    data: {
      name: "A Block",
      hostelId: duraisamyHostel.id,
      floorsCount: 4,
    },
  });

  const wingB = await prisma.wing.create({
    data: {
      name: "B Block",
      hostelId: duraisamyHostel.id,
      floorsCount: 4,
    },
  });

  // Assign SRA Scope to Wing A
  await prisma.staffScopeAssignment.create({
    data: {
      staffId: sraUser.staffProfile!.id,
      hostelId: duraisamyHostel.id,
      wingId: wingA.id,
      role: Role.SRA,
    },
  });

  // Create Floors and Rooms in Wing A
  let targetRoom204 = null;
  let targetBedA = null;
  let targetBedB = null;

  for (let f = 1; f <= 3; f++) {
    const floor = await prisma.floor.create({
      data: {
        floorNumber: f,
        wingId: wingA.id,
      },
    });

    for (let r = 1; r <= 6; r++) {
      const roomNum = `${f}0${r}`;
      const roomType = r === 1 ? RoomType.SINGLE : r <= 4 ? RoomType.DOUBLE : RoomType.FOUR_SEATER;
      const capacity = roomType === RoomType.SINGLE ? 1 : roomType === RoomType.DOUBLE ? 2 : 4;

      const room = await prisma.room.create({
        data: {
          roomNumber: roomNum,
          floorId: floor.id,
          roomType,
          isAc: r % 2 === 0,
          capacity,
          currentOccupancy: roomNum === "204" ? 2 : 0,
        },
      });

      const bedCodes = capacity === 1 ? ["A"] : capacity === 2 ? ["A", "B"] : ["A", "B", "C", "D"];
      for (const bCode of bedCodes) {
        const bed = await prisma.bed.create({
          data: {
            bedCode: bCode,
            roomId: room.id,
            isOccupied: roomNum === "204" && (bCode === "A" || bCode === "B"),
          },
        });

        if (roomNum === "204") {
          targetRoom204 = room;
          if (bCode === "A") targetBedA = bed;
          if (bCode === "B") targetBedB = bed;
        }
      }
    }
  }

  // 3. Students
  // Student 1: Jabez Gabrielraj E (URK25CS6015) - As shown in reference portal screenshot
  const jabezUser = await prisma.user.create({
    data: {
      email: "jabezgabrielraj@karunya.edu.in",
      identifier: "URK25CS6015",
      fullName: "JABEZ GABRIELRAJ E",
      role: Role.STUDENT,
      passwordHash: defaultPasswordHash,
      phone: "+91 98401 23456",
      avatarUrl: "/avatars/jabez.png",
      studentProfile: {
        create: {
          department: "Computer Science and Engineering",
          programme: "B.Tech (CS6)",
          academicYear: "2025-2026",
          semester: 3,
          section: "A",
          cgpa: 8.92,
          arrearsCount: 0,
          classAttendancePct: 99.00,
          assemblyAttendancePct: 100.00,
          bloodGroup: "O+ve",
          permanentAddress: "14/2 Bethany Nagar, Karunya Post, Coimbatore - 641114",
          currentAddress: "Father Duraisamy Hostel, Room 204, Bed A",
          parentName: "Gabrielraj E",
          parentPhone: "+91 98401 98765",
          emergencyContactName: "Gabrielraj E (Father)",
          emergencyContactPhone: "+91 98401 98765",
          mentorId: mentorUser.staffProfile!.id,
          currentHostelId: duraisamyHostel.id,
          currentWingId: wingA.id,
          currentRoomId: targetRoom204!.id,
          currentBedId: targetBedA!.id,
          isVerified: true,
        },
      },
    },
    include: { studentProfile: true },
  });

  // Student 2: Samuel Johnson (Roommate in 204 Bed B)
  const samuelUser = await prisma.user.create({
    data: {
      email: "samueljohnson@karunya.edu.in",
      identifier: "URK25CS6016",
      fullName: "SAMUEL JOHNSON K",
      role: Role.STUDENT,
      passwordHash: defaultPasswordHash,
      phone: "+91 98401 23457",
      studentProfile: {
        create: {
          department: "Computer Science and Engineering",
          programme: "B.Tech (CS6)",
          academicYear: "2025-2026",
          semester: 3,
          section: "A",
          cgpa: 8.65,
          arrearsCount: 0,
          classAttendancePct: 96.50,
          assemblyAttendancePct: 98.00,
          bloodGroup: "B+ve",
          parentName: "K. Johnson",
          parentPhone: "+91 98401 99999",
          emergencyContactName: "K. Johnson",
          emergencyContactPhone: "+91 98401 99999",
          mentorId: mentorUser.staffProfile!.id,
          currentHostelId: duraisamyHostel.id,
          currentWingId: wingA.id,
          currentRoomId: targetRoom204!.id,
          currentBedId: targetBedB!.id,
          isVerified: true,
        },
      },
    },
    include: { studentProfile: true },
  });

  // Record active room allocations
  await prisma.roomAllocation.create({
    data: {
      studentId: jabezUser.studentProfile!.id,
      bedId: targetBedA!.id,
      roomId: targetRoom204!.id,
      hostelId: duraisamyHostel.id,
      status: "ACTIVE",
      remarks: "Official Odd Semester 2025-2026 Allocation",
    },
  });

  await prisma.roomAllocation.create({
    data: {
      studentId: samuelUser.studentProfile!.id,
      bedId: targetBedB!.id,
      roomId: targetRoom204!.id,
      hostelId: duraisamyHostel.id,
      status: "ACTIVE",
      remarks: "Official Odd Semester 2025-2026 Allocation",
    },
  });

  // Record Residential History for Jabez
  await prisma.residentialHistory.create({
    data: {
      studentId: jabezUser.studentProfile!.id,
      hostelName: "Father Duraisamy",
      wingName: "B Block",
      floorNumber: 1,
      roomNumber: "108",
      bedCode: "B",
      roomType: "DOUBLE",
      academicYear: "2024-2025",
      semester: 1,
      checkInDate: new Date("2024-07-15"),
      checkOutDate: new Date("2024-12-10"),
      roommatesSummary: "Daniel Raj M (URK25CS6017)",
      transferNotes: "First year accommodation assignment",
    },
  });

  await prisma.residentialHistory.create({
    data: {
      studentId: jabezUser.studentProfile!.id,
      hostelName: "Father Duraisamy",
      wingName: "A Block",
      floorNumber: 2,
      roomNumber: "204",
      bedCode: "A",
      roomType: "DOUBLE",
      academicYear: "2024-2025",
      semester: 2,
      checkInDate: new Date("2025-01-05"),
      checkOutDate: new Date("2025-05-20"),
      roommatesSummary: "Samuel Johnson K (URK25CS6016)",
      transferNotes: "Annual room renewal",
    },
  });

  // 4. Outpass Form Types
  const yellowForm = await prisma.outpassFormType.create({
    data: {
      code: "YELLOW",
      name: "Yellow Form (Local City & Weekend Day Outpass)",
      description: "Permission for students to visit Coimbatore city or nearby local areas during permitted hours on weekends or holidays. Return by 08:30 PM mandatory.",
      maxDays: 1,
      requiresMentor: true,
      requiresSRA: true,
      policyVersion: "v2.1-provisional",
    },
  });

  const greenForm = await prisma.outpassFormType.create({
    data: {
      code: "GREEN",
      name: "Green Form (Academic & Official Duty Outpass)",
      description: "Authorized leave for technical symposiums, sports events, hackathons, and institutional project visits. Proof of event required.",
      maxDays: 5,
      requiresMentor: true,
      requiresSRA: true,
      policyVersion: "v2.1-provisional",
    },
  });

  const whiteForm = await prisma.outpassFormType.create({
    data: {
      code: "WHITE",
      name: "White Form (Home & Extended Vacation Outpass)",
      description: "Overnight travel to registered home address during semester breaks, study holidays, or emergency visits. Parent phone verification required.",
      maxDays: 14,
      requiresMentor: true,
      requiresSRA: true,
      policyVersion: "v2.1-provisional",
    },
  });

  // Outpass Sample 1: Approved Outpass
  const approvedOutpass = await prisma.outpassRequest.create({
    data: {
      outpassNumber: "OUT-2026-0001",
      studentId: jabezUser.studentProfile!.id,
      formTypeId: yellowForm.id,
      reason: "Visiting Town Hall for competitive programming textbooks and IEEE project supplies",
      destination: "Gandhipuram & RS Puram, Coimbatore",
      departureTime: new Date(Date.now() - 7 * 86400000 + 36000000),
      expectedReturnTime: new Date(Date.now() - 7 * 86400000 + 72000000),
      actualReturnTime: new Date(Date.now() - 7 * 86400000 + 70200000),
      contactPhone: "+91 98401 23456",
      parentConsentGiven: true,
      status: OutpassStatus.COMPLETED,
      mentorDecision: OutpassDecision.APPROVED,
      mentorDecisionAt: new Date(Date.now() - 8 * 86400000),
      mentorComments: "Recommended. Good academic standing.",
      mentorId: mentorUser.staffProfile!.id,
      sraDecision: OutpassDecision.APPROVED,
      sraDecisionAt: new Date(Date.now() - 8 * 86400000 + 3600000),
      sraComments: "Approved. Expected back by 8:30 PM.",
      sraId: sraUser.staffProfile!.id,
    },
  });

  // Outpass Sample 2: Pending Outpass (Requiring Mentor + SRA approval)
  await prisma.outpassRequest.create({
    data: {
      outpassNumber: "OUT-2026-0002",
      studentId: jabezUser.studentProfile!.id,
      formTypeId: greenForm.id,
      reason: "Participating in Smart India Hackathon Regional Round at PSG Tech",
      destination: "PSG College of Technology, Peelamedu, Coimbatore",
      departureTime: new Date(Date.now() + 2 * 86400000 + 32400000),
      expectedReturnTime: new Date(Date.now() + 4 * 86400000 + 72000000),
      contactPhone: "+91 98401 23456",
      parentConsentGiven: true,
      status: OutpassStatus.SUBMITTED,
      mentorDecision: OutpassDecision.PENDING,
      mentorId: mentorUser.staffProfile!.id,
      sraDecision: OutpassDecision.PENDING,
      sraId: sraUser.staffProfile!.id,
    },
  });

  // 5. Mess and Weekly Menu
  const centralMess = await prisma.mess.create({
    data: {
      name: "Duraisamy Central Dining Mess",
      location: "Ground Floor, South Wing, Father Duraisamy Hostel",
      capacity: 900,
      hostelId: duraisamyHostel.id,
    },
  });

  const weekStart = new Date();
  weekStart.setHours(0, 0, 0, 0);

  const daysOfWeek = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
  const sampleMeals = [
    {
      meal: MealType.BREAKFAST,
      items: [
        { name: "Idli & Vada", desc: "Served with Sambar, Coconut Chutney and Kara Chutney", veg: true, allergen: "Legumes" },
        { name: "Tea & Coffee", desc: "Fresh milk hot beverages", veg: true, allergen: "Dairy" },
      ],
    },
    {
      meal: MealType.LUNCH,
      items: [
        { name: "South Indian Thali", desc: "Steamed Rice, Drumstick Sambar, Rasam, Curd, Poriyal & Appalam", veg: true, allergen: "Dairy" },
        { name: "Egg Curry", desc: "Hard boiled egg in spicy tomato onion gravy", veg: false, allergen: "Egg" },
      ],
    },
    {
      meal: MealType.SNACKS,
      items: [
        { name: "Samosa & Masala Chai", desc: "Crisp potato samosa with green mint chutney", veg: true, allergen: "Gluten" },
      ],
    },
    {
      meal: MealType.DINNER,
      items: [
        { name: "Chapati & Dal Makhani", desc: "Whole wheat rotis with creamy black lentil dal", veg: true, allergen: "Gluten, Dairy" },
        { name: "Chicken Biryani (Wed/Sun)", desc: "Aromatic basmati rice cooked with spices and chicken", veg: false, allergen: "None" },
      ],
    },
  ];

  for (const day of daysOfWeek) {
    const menu = await prisma.messMenu.create({
      data: {
        messId: centralMess.id,
        dayOfWeek: day,
        weekStartDate: weekStart,
        isPublished: true,
      },
    });

    for (const group of sampleMeals) {
      for (const it of group.items) {
        await prisma.messMenuItem.create({
          data: {
            menuId: menu.id,
            mealType: group.meal,
            itemName: it.name,
            description: it.desc,
            isVeg: it.veg,
            allergens: it.allergen,
          },
        });
      }
    }
  }

  // 6. Complaints & Maintenance
  await prisma.complaint.create({
    data: {
      ticketNumber: "CMP-2026-1001",
      studentId: jabezUser.studentProfile!.id,
      hostelId: duraisamyHostel.id,
      roomId: targetRoom204!.id,
      category: "WIFI",
      title: "Intermittent 5GHz Wi-Fi signal drop in 2nd Floor Corridor",
      description: "The access point FD-AP-204 resets every evening between 8 PM and 10 PM during study hours.",
      priority: ComplaintPriority.HIGH,
      status: ComplaintStatus.RESOLVED,
      assignedStaffId: sraUser.staffProfile!.id,
      resolutionNotes: "Network switch rebooted and firmware updated by Karunya CIT team.",
      resolvedAt: new Date(Date.now() - 2 * 86400000),
      comments: {
        create: [
          {
            authorId: jabezUser.id,
            comment: "Issue has been persistent for the last 3 days.",
          },
          {
            authorId: sraUser.id,
            comment: "Escalated ticket to campus IT support team.",
            isInternal: false,
          },
        ],
      },
    },
  });

  await prisma.complaint.create({
    data: {
      ticketNumber: "CMP-2026-1002",
      studentId: jabezUser.studentProfile!.id,
      hostelId: duraisamyHostel.id,
      roomId: targetRoom204!.id,
      category: "ROOM_MAINTENANCE",
      title: "Study desk reading light flickering",
      description: "The desk lamp over Bed A has a loose fixture connector.",
      priority: ComplaintPriority.MEDIUM,
      status: ComplaintStatus.IN_PROGRESS,
      assignedStaffId: sraUser.staffProfile!.id,
    },
  });

  // 7. Notices & Announcements
  await prisma.notice.create({
    data: {
      title: "Evening Assembly and Prayer Timings for Even Semester",
      content: "All resident students of Father Duraisamy and other residences are reminded that daily evening prayer and roll-call assembly starts promptly at 08:30 PM in the hostel auditorium. Punctuality is required for attendance accreditation.",
      category: NoticeCategory.HOSTEL,
      targetAudience: TargetAudience.ALL_STUDENTS,
      authorId: wardenUser.id,
    },
  });

  await prisma.notice.create({
    data: {
      title: "Special Mess Feast for University Anniversary",
      content: "A celebratory special dinner will be served in Duraisamy Central Dining and Hepzibah Mess this Friday from 07:30 PM. Please produce your digital mess QR/identifier upon entry.",
      category: NoticeCategory.MESS,
      targetAudience: TargetAudience.ALL_STUDENTS,
      authorId: hostelAdminUser.id,
    },
  });

  await prisma.notice.create({
    data: {
      title: "Residence Allocation Window for Academic Year 2026-2027",
      content: "Preference submissions for next academic year room and preferred roommate groups will open on the EduStay portal next week. Check the allocation tab for guidelines.",
      category: NoticeCategory.ACADEMIC,
      targetAudience: TargetAudience.ALL_STUDENTS,
      authorId: hostelAdminUser.id,
    },
  });

  // 8. Allocation Window & Preferences
  const allocWindow = await prisma.allocationWindow.create({
    data: {
      title: "Even Semester 2025-2026 Room & Roommate Selection",
      academicYear: "2025-2026",
      semester: 4,
      startDate: new Date(Date.now() - 3 * 86400000),
      endDate: new Date(Date.now() + 10 * 86400000),
      status: "OPEN",
    },
  });

  await prisma.roomPreference.create({
    data: {
      studentId: jabezUser.studentProfile!.id,
      windowId: allocWindow.id,
      preferredHostelId: duraisamyHostel.id,
      preferredRoomType: RoomType.DOUBLE,
      isAcPreferred: true,
      rankOrder: 1,
    },
  });

  await prisma.roommatePreference.create({
    data: {
      requesterStudentId: jabezUser.studentProfile!.id,
      preferredStudentId: samuelUser.studentProfile!.id,
      windowId: allocWindow.id,
      priorityOrder: 1,
      status: "ACCEPTED",
    },
  });

  // 9. Academic Attendance Sessions & Persisted Records
  const subjects = [
    { code: "24CS2001", name: "Data Structures & Algorithms" },
    { code: "24CS2002", name: "Computer Architecture" },
    { code: "24CS2003", name: "Object Oriented Software Engineering" },
    { code: "24MA2005", name: "Discrete Mathematical Structures" },
    { code: "24CS2004", name: "Database Management Systems" },
  ];

  for (let sIdx = 0; sIdx < subjects.length; sIdx++) {
    const sub = subjects[sIdx];
    for (let dayOffset = 15; dayOffset >= 1; dayOffset--) {
      const sessionDate = new Date(Date.now() - dayOffset * 86400000);
      const session = await prisma.attendanceSession.create({
        data: {
          courseCode: sub.code,
          courseName: sub.name,
          sessionDate,
          sessionSlot: `${8 + sIdx}:30 - ${9 + sIdx}:20 AM`,
          totalEnrolled: 64,
        },
      });

      // Jabez has 99% attendance (attended nearly all sessions)
      await prisma.academicAttendanceRecord.create({
        data: {
          studentId: jabezUser.studentProfile!.id,
          sessionId: session.id,
          status: AcademicAttendanceStatus.PRESENT,
          recordedAt: sessionDate,
        },
      });
    }
  }

  // 10. Hostel Attendance Session & Records
  for (let hDay = 10; hDay >= 1; hDay--) {
    const attDate = new Date(Date.now() - hDay * 86400000);
    const hSession = await prisma.hostelAttendanceSession.create({
      data: {
        hostelId: duraisamyHostel.id,
        wingId: wingA.id,
        date: attDate,
        markedById: sraUser.staffProfile!.id,
        status: "SUBMITTED",
      },
    });

    await prisma.hostelAttendanceRecord.create({
      data: {
        sessionId: hSession.id,
        studentId: jabezUser.studentProfile!.id,
        status: hDay === 7 ? HostelAttendanceStatus.APPROVED_OUTPASS : HostelAttendanceStatus.PRESENT,
        remarks: hDay === 7 ? "Approved weekend day outpass OUT-2026-0001" : "Present at roll call",
      },
    });

    await prisma.hostelAttendanceRecord.create({
      data: {
        sessionId: hSession.id,
        studentId: samuelUser.studentProfile!.id,
        status: HostelAttendanceStatus.PRESENT,
        remarks: "Present at roll call",
      },
    });
  }

  // 11. Persistent Notifications
  await prisma.notification.create({
    data: {
      userId: jabezUser.id,
      title: "Outpass OUT-2026-0001 Completed",
      message: "Your weekend day outpass has been marked completed upon your safe return.",
      type: "SUCCESS",
      link: "/student/outpass",
    },
  });

  await prisma.notification.create({
    data: {
      userId: jabezUser.id,
      title: "Room Selection Window Open",
      message: "Even Semester 2025-2026 Room & Roommate Selection window is now open.",
      type: "INFO",
      link: "/student/hostel-allocation",
    },
  });

  // 12. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: sraUser.id,
      action: "OUTPASS_APPROVED",
      entityType: "OutpassRequest",
      entityId: approvedOutpass.id,
      detailsJson: JSON.stringify({ reviewerRole: "SRA", decision: "APPROVED", outpassNumber: "OUT-2026-0001" }),
    },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

