import { NextResponse } from "next/server";
import { clearSessionCookie, getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export async function POST() {
  try {
    const session = await getSession();
    if (session) {
      await prisma.auditLog.create({
        data: {
          userId: session.userId,
          action: "USER_LOGOUT",
          entityType: "User",
          entityId: session.userId,
        },
      });
    }

    await clearSessionCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}

