import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lastCredit = await prisma.creditLedger.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: { balanceAfter: true },
    });

    const balance = lastCredit?.balanceAfter ?? 40;

    return NextResponse.json({ balance });
  } catch (error) {
    console.error("Get credits balance error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

