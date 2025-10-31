import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.videoProject.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        prompt: true,
        coverUrl: true,
        hlsUrl: true,
        mp4Url: true,
        status: true,
        visibility: true,
        likes: true,
        dislikes: true,
        plays: true,
        createdAt: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({ items: projects });
  } catch (error) {
    console.error("Get library error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
