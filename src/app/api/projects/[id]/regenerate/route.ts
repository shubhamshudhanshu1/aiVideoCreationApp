import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { JobState } from "@prisma/client";

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

    if (project.userId !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Create new render job
    const job = await prisma.renderJob.create({
      data: {
        projectId: project.id,
        state: JobState.queued,
        progress: 0,
      },
    });

    // Update project with new jobId
    await prisma.videoProject.update({
      where: { id: params.id },
      data: { jobId: job.id },
    });

    return NextResponse.json({ job_id: job.id });
  } catch (error) {
    console.error("Regenerate project error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

