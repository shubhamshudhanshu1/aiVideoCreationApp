import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const templates = await prisma.template.findMany({
      where: { isOfficial: true },
      orderBy: { createdAt: "desc" },
      include: {
        creator: {
          select: {
            id: true,
            handle: true,
            displayName: true,
          },
        },
      },
    });

    return NextResponse.json({
      items: templates.map((t: typeof templates[0]) => ({
        id: t.id,
        name: t.name,
        tags: t.tags,
        creator: t.creator,
        createdAt: t.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get templates error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

