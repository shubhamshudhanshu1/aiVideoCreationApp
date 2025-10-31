import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sha256, now } from "@/lib/auth";
import { PhoneStart } from "@/lib/z";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, country } = PhoneStart.parse(body);

    // Normalize to E.164 (for now, treat input as E.164)
    // In production, use a library like libphonenumber-js
    const phoneNormalized = phone.trim();
    const phoneHash = sha256(phoneNormalized);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const codeHash = sha256(code);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const otp = await prisma.phoneOtp.create({
      data: {
        phoneHash,
        codeHash,
        expiresAt,
        attempts: 0,
        maxAttempts: 5,
      },
    });

    // TODO: Send SMS via Twilio or similar
    console.log(`OTP for ${phone}: ${code}`);

    return NextResponse.json({
      otp_id: otp.id,
      ttl: 300,
      ...(process.env.NODE_ENV !== "production" && { mockCode: code }),
    });
  } catch (error: any) {
    console.error("Phone OTP start error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

