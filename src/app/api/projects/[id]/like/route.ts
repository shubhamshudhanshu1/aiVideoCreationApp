import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { LikeBody } from "@/lib/z";
import { ReactType } from "@prisma/client";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.videoProject.findUnique({
      where: { id: params.id },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const { type } = LikeBody.parse(body);

    const reactType = type === "like" ? ReactType.like : ReactType.dislike;

    // Check if reaction exists
    const existing = await prisma.reaction.findUnique({
      where: {
        projectId_userId: {
          projectId: params.id,
          userId: user.id,
        },
      },
    });

    if (existing) {
      if (existing.type === reactType) {
        // Same type, ignore
        return NextResponse.json({ success: true });
      }

      // Different type, switch it
      await prisma.reaction.update({
        where: { id: existing.id },
        data: { type: reactType },
      });

      // Update counters
      const oldType = existing.type === ReactType.like ? "likes" : "dislikes";
      const newType = reactType === ReactType.like ? "likes" : "dislikes";

      await prisma.videoProject.update({
        where: { id: params.id },
        data: {
          [oldType]: { decrement: 1 },
          [newType]: { increment: 1 },
        },
      });
    } else {
      // New reaction
      await prisma.reaction.create({
        data: {
          projectId: params.id,
          userId: user.id,
          type: reactType,
        },
      });

      // Update counter
      const field = reactType === ReactType.like ? "likes" : "dislikes";
      await prisma.videoProject.update({
        where: { id: params.id },
        data: {
          [field]: { increment: 1 },
        },
      });
    }

    // Get updated counts
    const updated = await prisma.videoProject.findUnique({
      where: { id: params.id },
      select: { likes: true, dislikes: true },
    });

    return NextResponse.json({
      likes: updated?.likes ?? 0,
      dislikes: updated?.dislikes ?? 0,
    });
  } catch (error: any) {
    console.error("Like project error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

