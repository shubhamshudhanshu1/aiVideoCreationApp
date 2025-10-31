import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Visibility } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor");

    const take = 20;
    let where: any = {
      status: "public",
      visibility: Visibility.public,
      publishedAt: { not: null },
    };

    if (cursor) {
      const cursorProject = await prisma.videoProject.findUnique({
        where: { id: cursor },
        select: { publishedAt: true },
      });
      if (cursorProject) {
        where.publishedAt = {
          lt: cursorProject.publishedAt,
        };
      }
    }

    const projects = await prisma.videoProject.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: take + 1,
      include: {
        _count: {
          select: { comments: true },
        },
      },
    });

    const hasMore = projects.length > take;
    const items = (hasMore ? projects.slice(0, take) : projects).map((p: typeof projects[0]) => ({
      id: p.id,
      title: p.title,
      coverUrl: p.coverUrl,
      likes: p.likes,
      comments: p._count.comments,
      plays: p.plays,
      mp4Url: p.mp4Url,
      hlsUrl: p.hlsUrl,
    }));

    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({
      items,
      ...(nextCursor && { nextCursor }),
    });
  } catch (error) {
    console.error("Feed explore error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
