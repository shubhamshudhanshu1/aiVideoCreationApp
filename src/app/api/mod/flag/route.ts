import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const FlagRequest = z.object({
  project_id: z.string(),
  reason: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { project_id, reason } = FlagRequest.parse(body);

    const project = await prisma.videoProject.findUnique({
      where: { id: project_id },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // TODO: Store flag in moderation queue table (can add later)
    // For now, just log it
    console.log(`Flag reported: project=${project_id}, reason=${reason}, by=${user.id}`);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Flag project error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

