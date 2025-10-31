import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const DecisionRequest = z.object({
  project_id: z.string(),
  action: z.enum(["approve", "reject"]),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // TODO: Add admin check

    const body = await request.json();
    const { project_id, action } = DecisionRequest.parse(body);

    const project = await prisma.videoProject.findUnique({
      where: { id: project_id },
    });

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (action === "reject") {
      await prisma.videoProject.update({
        where: { id: project_id },
        data: { status: "draft", visibility: "private" },
      });
    } else if (action === "approve") {
      await prisma.videoProject.update({
        where: { id: project_id },
        data: { status: "public" },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("Mod decision error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

