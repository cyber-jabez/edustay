import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { Role } from "@prisma/client";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === Role.STUDENT) {
    redirect("/student/dashboard");
  } else {
    redirect("/staff/dashboard");
  }
}

