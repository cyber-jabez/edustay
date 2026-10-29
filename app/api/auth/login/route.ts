import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { verifyPassword } from "@/lib/auth/password";
import { setSessionCookie } from "@/lib/auth/session";
import { Role } from "@prisma/client";
import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Registration number or email is required"),
  password: z.string().min(1, "Password is required"),
  roleType: z.enum(["STUDENT", "STAFF"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid login parameters", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { identifier, password, roleType } = result.data;
    const cleanId = identifier.trim();

    // Query user by identifier or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { identifier: { equals: cleanId, mode: "insensitive" } },
          { email: { equals: cleanId, mode: "insensitive" } },
        ],
      },
      include: {
        studentProfile: true,
        staffProfile: true,
      },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "Invalid credentials or account inactive" },
        { status: 401 }
      );
    }

    // Role check
    if (roleType === "STUDENT" && user.role !== Role.STUDENT) {
      return NextResponse.json(
        { error: "This identifier is not registered as a Student. Please choose 'Staffs & Others'." },
        { status: 403 }
      );
    }

    if (roleType === "STAFF" && user.role === Role.STUDENT) {
      return NextResponse.json(
        { error: "This identifier is a Student account. Please choose 'KITS Students'." },
        { status: 403 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid credentials or password" },
        { status: 401 }
      );
    }

    // Set secure session cookie
    await setSessionCookie({
      userId: user.id,
      email: user.email,
      identifier: user.identifier,
      role: user.role,
      fullName: user.fullName,
      studentProfileId: user.studentProfile?.id,
      staffProfileId: user.staffProfile?.id,
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: "USER_LOGIN",
        entityType: "User",
        entityId: user.id,
        detailsJson: JSON.stringify({ role: user.role, identifier: user.identifier }),
      },
    });

    const redirectUrl = user.role === Role.STUDENT ? "/student/dashboard" : "/staff/dashboard";

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        identifier: user.identifier,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      redirectUrl,
    });
  } catch (error: any) {
    console.error("Login API error:", error);

    let message = "Internal server error";
    if (error?.message?.includes("Can't reach database server")) {
      message = "Database unreachable. Please set DATABASE_URL in your Render Environment Variables.";
    } else if (error?.code === "P2021" || error?.message?.includes("does not exist")) {
      message = "Database tables not found. Please run 'npm run render:build' to initialize tables.";
    } else if (error?.message) {
      message = error.message.slice(0, 120);
    }

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
