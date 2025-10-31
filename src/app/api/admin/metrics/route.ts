import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin authorization check

    const [userCount, projectCount, publicProjectCount, totalCredits] =
      await Promise.all([
        prisma.user.count(),
        prisma.videoProject.count(),
        prisma.videoProject.count({
          where: { status: "public", visibility: "public" },
        }),
        prisma.creditLedger.aggregate({
          _sum: { delta: true },
        }),
      ]);

    return NextResponse.json({
      users: userCount,
      projects: projectCount,
      publicProjects: publicProjectCount,
      totalCreditsIssued: totalCredits._sum.delta || 0,
    });
  } catch (error) {
    console.error("Get admin metrics error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

