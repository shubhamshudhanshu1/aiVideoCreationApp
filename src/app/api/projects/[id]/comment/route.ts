import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CommentBody } from "@/lib/z";

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
    const { text } = CommentBody.parse(body);

    await prisma.comment.create({
      data: {
        projectId: params.id,
        userId: user.id,
        text,
      },
    });

    const count = await prisma.comment.count({
      where: { projectId: params.id },
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Comment project error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

