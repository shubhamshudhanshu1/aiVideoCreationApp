import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateProject } from "@/lib/z";
import { Aspect, JobState } from "@prisma/client";

function mapAspectRatio(ratio: string): Aspect {
  switch (ratio) {
    case "9:16":
      return Aspect.RATIO_9X16;
    case "1:1":
      return Aspect.RATIO_1X1;
    case "16:9":
      return Aspect.RATIO_16X9;
    default:
      return Aspect.RATIO_9X16;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = CreateProject.parse(body);

    // Get user's current credit balance
    const lastCredit = await prisma.creditLedger.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    const currentBalance = lastCredit?.balanceAfter ?? 40;
    const newBalance = currentBalance - 1;

    if (newBalance < 0) {
      return NextResponse.json(
        { error: "Insufficient credits" },
        { status: 402 }
      );
    }

    // Create project and transaction
    const project = await prisma.videoProject.create({
      data: {
        userId: user.id,
        prompt: data.prompt,
        styles: data.styles,
        exclude: data.exclude_styles,
        durationS: data.duration_s,
        aspect: mapAspectRatio(data.aspect_ratio),
        voiceoff: data.voiceover_off,
        modelVersion: data.model_version,
        seed: data.seed,
        status: "draft",
      },
    });

    // Create credit ledger entry
    await prisma.creditLedger.create({
      data: {
        userId: user.id,
        delta: -1,
        reason: "generate",
        balanceAfter: newBalance,
      },
    });

    // Create render job
    const job = await prisma.renderJob.create({
      data: {
        projectId: project.id,
        state: JobState.queued,
        progress: 0,
      },
    });

    // Update project with jobId
    await prisma.videoProject.update({
      where: { id: project.id },
      data: { jobId: job.id },
    });

    return NextResponse.json({
      project_id: project.id,
      job_id: job.id,
    });
  } catch (error: any) {
    console.error("Create project error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
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

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("List projects error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

