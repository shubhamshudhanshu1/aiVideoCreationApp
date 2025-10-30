import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { canonEmail, sha256, logAuditEvent } from "@/lib/auth";
import { sendOtpEmail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email)
      return NextResponse.json({ error: "email_required" }, { status: 400 });

    const e = canonEmail(email);
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0] || undefined;
    const userAgent = req.headers.get("user-agent") || undefined;

    // Rate limit idea (pseudo): count OTps in last hour per email/IP (implement with Redis in prod)
    // For now, we'll implement basic rate limiting by checking recent OTPs
    const recentOtps = await prisma.emailOtp.count({
      where: {
        email: e,
        createdAt: {
          gte: new Date(Date.now() - 60 * 60 * 1000), // Last hour
        },
      },
    });

    if (recentOtps >= 5) {
      await logAuditEvent(
        "email.start.rate_limited",
        undefined,
        ip,
        userAgent,
        { email: e }
      );
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const otp = await prisma.emailOtp.create({
      data: {
        email: e,
        codeHash: sha256(code),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    // Send email asynchronously to avoid blocking the response
    sendOtpEmail(e, code)
      .then(async (result) => {
        console.log("✅ [EMAIL] Email sent successfully:", result.messageId);
        await logAuditEvent("email.start.success", undefined, ip, userAgent, {
          email: e,
          otpId: otp.id,
        });
      })
      .catch(async (error) => {
        console.error("❌ [EMAIL] Failed to send email:", error);
        await logAuditEvent(
          "email.start.send_failed",
          undefined,
          ip,
          userAgent,
          {
            email: e,
            otpId: otp.id,
            error: error instanceof Error ? error.message : "Unknown error",
          }
        );
      });

    return NextResponse.json({
      otp_id: otp.id,
      // show mock code only in non-prod
      mockCode: process.env.NODE_ENV !== "production" ? code : undefined,
      ttl: 300,
    });
  } catch (error) {
    console.error("Email OTP start error:", error);
    return NextResponse.json({ error: "internal_error" }, { status: 500 });
  }
}
