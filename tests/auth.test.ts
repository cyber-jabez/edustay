import { describe, it, expect } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSessionToken, verifySessionToken, SessionPayload } from "@/lib/auth/session";
import { Role } from "@prisma/client";

describe("Authentication & Session Security Suite", () => {
  it("should securely hash passwords and verify matching credentials", async () => {
    const rawPassword = "EduStaySecurePassword2026!";
    const hash = await hashPassword(rawPassword);

    expect(hash).not.toBe(rawPassword);
    expect(hash.length).toBeGreaterThan(20);

    const isMatch = await verifyPassword(rawPassword, hash);
    expect(isMatch).toBe(true);

    const isWrongMatch = await verifyPassword("WrongPassword123", hash);
    expect(isWrongMatch).toBe(false);
  });

  it("should generate a valid JWT session token and decode authenticated payload", async () => {
    const payload: SessionPayload = {
      userId: "user-uuid-101",
      email: "jabezgabrielraj@karunya.edu.in",
      identifier: "URK25CS6015",
      role: Role.STUDENT,
      fullName: "Jabez Gabrielraj",
    };

    const token = await createSessionToken(payload);
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = await verifySessionToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.identifier).toBe("URK25CS6015");
    expect(decoded?.role).toBe(Role.STUDENT);
  });

  it("should reject tampered or invalid session tokens", async () => {
    const validPayload: SessionPayload = {
      userId: "user-1",
      email: "test@karunya.edu",
      identifier: "TEST01",
      role: Role.STUDENT,
      fullName: "Test Student",
    };

    const token = await createSessionToken(validPayload);
    const tamperedToken = token.slice(0, -6) + "abcdef";

    const verified = await verifySessionToken(tamperedToken);
    expect(verified).toBeNull();
  });
});

