import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { redis } from "./redis";

export const sha256 = (s: string) =>
  crypto.createHash("sha256").update(s).digest("hex");
export const now = () => new Date();
export const canonEmail = (e: string) => e.trim().toLowerCase();

export async function createSession(userId: string, ua?: string, ip?: string) {
  const id = crypto.randomBytes(32).toString("base64url");
  const ttlMs = 30 * 24 * 60 * 60 * 1000; // 30 days
  const expires = new Date(Date.now() + ttlMs);

  // Store session in Redis (primary)
  const key = `session:${id}`;
  const value = JSON.stringify({ userId, ua, ip, expiresAt: expires.toISOString() });
  await redis.set(key, value, "PX", ttlMs);

  // Optional: also persist minimal record in DB for audits/analytics if table exists
  try {
    // Gracefully ignore if table not present
    await prisma.session.create({
      data: { id, userId, expiresAt: expires, userAgent: ua, ip },
    });
  } catch {}

  return { id, expires };
}

export async function getSessionUser() {
  const sid = cookies().get("sid")?.value;
  if (!sid) return null;

  // Read from Redis first
  const key = `session:${sid}`;
  const raw = await redis.get(key);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { userId: string; expiresAt?: string };
    if (!parsed.userId) return null;
    // Fetch user
    const user = await prisma.user.findUnique({ where: { id: parsed.userId } });
    return user || null;
  } catch {
    return null;
  }
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
