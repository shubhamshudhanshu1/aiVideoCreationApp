import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  sha256,
  now,
  createSession,
  canonEmail,
  logAuditEvent,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { otp_id, code, handle } = await req.json();
    if (!otp_id || !code)
      return NextResponse.json({ error: "invalid" }, { status: 400 });

    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0] || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    const otp = await prisma.emailOtp.findUnique({ where: { id: otp_id } });
    if (!otp || otp.consumedAt || otp.expiresAt < now()) {
      await logAuditEvent(
        "email.verify.invalid_otp",
        undefined,
        ip,
        userAgent,
        { otpId: otp_id }
      );
      return NextResponse.json({ error: "otp_invalid" }, { status: 400 });
    }
    if (otp.attempts >= otp.maxAttempts) {
      await logAuditEvent("email.verify.locked", undefined, ip, userAgent, {
        otpId: otp_id,
        email: otp.email,
      });
      return NextResponse.json({ error: "otp_locked" }, { status: 429 });
    }

    const ok = otp.codeHash === sha256(code);
    await prisma.emailOtp.update({
      where: { id: otp_id },
      data: { attempts: { increment: 1 }, consumedAt: ok ? now() : null },
    });

    if (!ok) {
      await logAuditEvent("email.verify.wrong_code", undefined, ip, userAgent, {
        otpId: otp_id,
        email: otp.email,
      });
      return NextResponse.json({ error: "otp_wrong" }, { status: 400 });
    }

    const email = canonEmail(otp.email);

    // Upsert user by email
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const h =
        handle && handle.length >= 3 ? handle : `user_${otp_id.slice(-6)}`;
      user = await prisma.user.create({
        data: {
          email,
          emailVerified: now(),
          handle: h,
          displayName: h,
        },
      });
      await logAuditEvent("user.created", user.id, ip, userAgent, {
        email,
        handle: h,
      });
    } else if (!user.emailVerified) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: now() },
      });
      await logAuditEvent("user.email_verified", user.id, ip, userAgent, {
        email,
      });
    }

    // Create session
    const { id, expires } = await createSession(user.id, userAgent, ip);
    await logAuditEvent("session.created", user.id, ip, userAgent, {
      sessionId: id,
    });

    const res = NextResponse.json({ user });
    res.cookies.set("sid", id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires,
    });
    return res;
  } catch (error) {
    console.error("Email OTP verify error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
