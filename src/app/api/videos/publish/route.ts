import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { copyTo, publicUrl } from "@/lib/s3";
import { z } from "zod";

const PublishVideo = z.object({
  projectId: z.string(),
  draftKey: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { projectId, draftKey } = PublishVideo.parse(body);

    const project = await prisma.videoProject.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (project.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const finalKey = `videos/${user.id}/${projectId}/video.mp4`;
    await copyTo(draftKey, finalKey, "video/mp4");

    const mp4Url = publicUrl(finalKey);

    await prisma.videoProject.update({
      where: { id: projectId },
      data: { mp4Url },
    });

    return NextResponse.json({ key: finalKey, publicUrl: mp4Url });
  } catch (error: any) {
    console.error("Publish video error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

