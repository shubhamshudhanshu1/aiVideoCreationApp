import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { presignPut } from "@/lib/s3";
import { z } from "zod";

const UploadUrlRequest = z.object({
  contentType: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { contentType } = UploadUrlRequest.parse(body);

    const projectId = `prj_${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const key = `draft/${user.id}/${projectId}/video.mp4`;
    const url = await presignPut(key, contentType);

    return NextResponse.json({ key, url, projectId });
  } catch (error: any) {
    console.error("Upload URL error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

