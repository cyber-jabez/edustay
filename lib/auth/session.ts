import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { Role } from "@prisma/client";

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "edustay-karunya-secret-key-2026-very-secure-jwt-token"
);

export const SESSION_COOKIE_NAME = "edustay_session";

export interface SessionPayload {
  userId: string;
  email: string;
  identifier: string;
  role: Role;
  fullName: string;
  studentProfileId?: string;
  staffProfileId?: string;
  [key: string]: unknown;
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(SECRET);
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) {
    return null;
  }
  return verifySessionToken(sessionCookie.value);
}

export async function setSessionCookie(payload: SessionPayload): Promise<string> {
  const token = await createSessionToken(payload);
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
  return token;
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

