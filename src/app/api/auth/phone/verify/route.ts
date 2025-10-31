import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { sha256, now, createSession } from "@/lib/auth";
import { PhoneVerify } from "@/lib/z";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { otp_id, code, handle } = PhoneVerify.parse(body);

    const otp = await prisma.phoneOtp.findUnique({
      where: { id: otp_id },
    });

    if (!otp) {
      return NextResponse.json({ error: "Invalid OTP ID" }, { status: 400 });
    }

    if (otp.consumedAt) {
      return NextResponse.json({ error: "OTP already used" }, { status: 400 });
    }

    if (otp.expiresAt < now()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    if (otp.attempts >= otp.maxAttempts) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 400 });
    }

    const codeHash = sha256(code);
    if (codeHash !== otp.codeHash) {
      await prisma.phoneOtp.update({
        where: { id: otp_id },
        data: { attempts: { increment: 1 } },
      });
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    // Mark OTP as consumed
    await prisma.phoneOtp.update({
      where: { id: otp_id },
      data: { consumedAt: now() },
    });

    // Upsert user
    let user = await prisma.user.findUnique({
      where: { phoneHash: otp.phoneHash },
    });

    if (!user) {
      const handleValue = handle || `user_${otp_id.slice(-6)}`;
      
      user = await prisma.user.create({
        data: {
          phoneHash: otp.phoneHash,
          handle: handleValue,
          displayName: handleValue,
        },
      });
    }

    // Create session
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0];
    const ua = request.headers.get("user-agent");
    const { id: sessionId, expiresAt } = await createSession(
      user.id,
      ua || undefined,
      ip
    );

    cookies().set("sid", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        handle: user.handle,
        displayName: user.displayName,
      },
    });
  } catch (error: any) {
    console.error("Phone OTP verify error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

