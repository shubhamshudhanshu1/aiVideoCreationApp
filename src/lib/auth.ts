import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const sha256 = (s: string) =>
  crypto.createHash("sha256").update(s).digest("hex");
export const now = () => new Date();
export const canonEmail = (e: string) => e.trim().toLowerCase();

export async function createSession(userId: string, ua?: string, ip?: string) {
  const id = crypto.randomBytes(32).toString("base64url");
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  await prisma.session.create({
    data: {
      id,
      userId,
      expiresAt: expires,
      userAgent: ua,
      ip,
    },
  });
  return { id, expires };
}

export async function getSessionUser() {
  const sid = cookies().get("sid")?.value;
  if (!sid) return null;
  const s = await prisma.session.findUnique({
    where: { id: sid },
    include: { user: true },
  });
  if (!s || s.expiresAt < now()) return null;
  return s.user;
}

export async function logAuditEvent(
  event: string,
  userId?: string,
  ip?: string,
  userAgent?: string,
  meta?: any
) {
  await prisma.auditLog.create({
    data: {
      event,
      userId,
      ip,
      userAgent,
      meta,
    },
  });
}
