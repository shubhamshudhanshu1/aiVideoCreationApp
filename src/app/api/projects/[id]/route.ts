import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PatchProject } from "@/lib/z";
import { Visibility } from "@prisma/client";

function mapVisibility(v: string): Visibility {
  switch (v) {
    case "public":
      return Visibility.public;
    case "unlisted":
      return Visibility.unlisted;
    case "private":
      return Visibility.private;
    default:
      return Visibility.public;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.videoProject.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            handle: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Check visibility
    if (project.visibility === Visibility.private) {
      const user = await getUser();
      if (!user || user.id !== project.userId) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error("Get project error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
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

    if (project.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const data = PatchProject.parse(body);

    const updateData: any = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.allow_remix !== undefined) updateData.allowRemix = data.allow_remix;
    if (data.visibility !== undefined)
      updateData.visibility = mapVisibility(data.visibility);

    const updated = await prisma.videoProject.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({ project: updated });
  } catch (error: any) {
    console.error("Update project error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

