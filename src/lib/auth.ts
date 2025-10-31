import crypto from "crypto";
import { cookies } from "next/headers";
import { prisma } from "./prisma";

export const sha256 = (s: string) =>
  crypto.createHash("sha256").update(s).digest("hex");

export const now = () => new Date();

export async function getSession() {
  const sid = cookies().get("sid")?.value;
  if (!sid) return null;

  const s = await prisma.session.findUnique({
    where: { id: sid },
    include: { user: true },
  });

  if (!s || s.expiresAt < now()) return null;

  return s;
}

export async function getUser() {
  return (await getSession())?.user ?? null;
}

export async function createSession(
  userId: string,
  ua?: string,
  ip?: string
) {
  const id = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { id, userId, expiresAt, userAgent: ua, ip },
  });

  return { id, expiresAt };
}
