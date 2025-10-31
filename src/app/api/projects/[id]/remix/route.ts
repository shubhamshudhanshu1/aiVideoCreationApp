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

    const original = await prisma.videoProject.findUnique({
      where: { id: params.id },
    });

    if (!original) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (!original.allowRemix) {
      return NextResponse.json(
        { error: "Remix not allowed" },
        { status: 403 }
      );
    }

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

    // Create remix as new draft
    const remix = await prisma.videoProject.create({
      data: {
        userId: user.id,
        prompt: original.prompt,
        styles: original.styles,
        exclude: original.exclude,
        durationS: original.durationS,
        aspect: original.aspect,
        voiceoff: original.voiceoff,
        modelVersion: original.modelVersion,
        seed: original.seed,
        status: "draft",
      },
    });

    // Create credit ledger entry
    await prisma.creditLedger.create({
      data: {
        userId: user.id,
        delta: -1,
        reason: "remix",
        balanceAfter: newBalance,
      },
    });

    // Create render job
    const job = await prisma.renderJob.create({
      data: {
        projectId: remix.id,
        state: JobState.queued,
        progress: 0,
      },
    });

    await prisma.videoProject.update({
      where: { id: remix.id },
      data: { jobId: job.id },
    });

    return NextResponse.json({
      project_id: remix.id,
    });
  } catch (error) {
    console.error("Remix project error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

