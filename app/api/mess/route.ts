import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { isStaffRole } from "@/lib/permissions/rbac";
import { MealType } from "@prisma/client";
import { z } from "zod";

const menuItemSchema = z.object({
  menuId: z.string().min(1),
  mealType: z.nativeEnum(MealType),
  itemName: z.string().min(1),
  description: z.string().optional(),
  isVeg: z.boolean().default(true),
  allergens: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const day = searchParams.get("day"); // optional filter

    // Retrieve active mess
    const mess = await prisma.mess.findFirst({
      where: { isActive: true },
      include: {
        menus: {
          where: day ? { dayOfWeek: day.toUpperCase() } : undefined,
          include: {
            items: true,
          },
          orderBy: { dayOfWeek: "asc" },
        },
      },
    });

    if (!mess) {
      return NextResponse.json({ mess: null, menus: [] });
    }

    return NextResponse.json({
      mess: {
        id: mess.id,
        name: mess.name,
        location: mess.location,
        capacity: mess.capacity,
      },
      menus: mess.menus,
    });
  } catch (error) {
    console.error("Mess GET error:", error);
    return NextResponse.json({ error: "Failed to load mess schedule" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || !isStaffRole(session.role)) {
      return NextResponse.json({ error: "Forbidden: Staff authorization required" }, { status: 403 });
    }

    const body = await req.json();
    const result = menuItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid dish data", details: result.error.flatten() }, { status: 400 });
    }

    const item = await prisma.messMenuItem.create({
      data: result.data,
    });

    await prisma.auditLog.create({
      data: {
        userId: session.userId,
        action: "MESS_MENU_ITEM_CREATED",
        entityType: "MessMenuItem",
        entityId: item.id,
        detailsJson: JSON.stringify(result.data),
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    console.error("Mess item POST error:", error);
    return NextResponse.json({ error: "Failed to save menu dish" }, { status: 500 });
  }
}

