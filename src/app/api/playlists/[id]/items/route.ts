import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const AddItem = z.object({
  project_id: z.string(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const playlist = await prisma.playlist.findUnique({
      where: { id: params.id },
    });

    if (!playlist) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (playlist.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { project_id } = AddItem.parse(body);

    // Get max order
    const maxOrder = await prisma.playlistItem.findFirst({
      where: { playlistId: params.id },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    await prisma.playlistItem.create({
      data: {
        playlistId: params.id,
        projectId: project_id,
        order: (maxOrder?.order ?? -1) + 1,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Add playlist item error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

