import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function check() {
  const [users, students, hostels, rooms, beds, outpasses, complaints, menus] = await Promise.all([
    prisma.user.count(),
    prisma.studentProfile.count(),
    prisma.hostel.count(),
    prisma.room.count(),
    prisma.bed.count(),
    prisma.outpassRequest.count(),
    prisma.complaint.count(),
    prisma.messMenu.count(),
  ]);

  console.log("DATABASE VERIFICATION SUCCESS:");
  console.log({ users, students, hostels, rooms, beds, outpasses, complaints, menus });
}

check().catch(console.error).finally(() => prisma.$disconnect());
