import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Visibility } from "@prisma/client";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ handle: string }> | { handle: string } }
) {
  try {
    const { handle } = await Promise.resolve(params);
    const user = await prisma.user.findUnique({
      where: { handle },
      select: {
        id: true,
        handle: true,
        displayName: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const projects = await prisma.videoProject.findMany({
      where: {
        userId: user.id,
        status: "public",
        visibility: Visibility.public,
        publishedAt: { not: null },
      },
      orderBy: { publishedAt: "desc" },
      select: {
        id: true,
        title: true,
        coverUrl: true,
        hlsUrl: true,
        mp4Url: true,
        likes: true,
        dislikes: true,
        plays: true,
        publishedAt: true,
      },
    });

    return NextResponse.json({
      user,
      projects,
    });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

