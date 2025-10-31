import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { s3 } from "@/lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";

const DraftUrlRequest = z.object({
  key: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { key } = DraftUrlRequest.parse(body);

    // Verify the key belongs to the user
    if (!key.startsWith(`draft/${user.id}/`)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const bucket = process.env.R2_BUCKET || process.env.S3_BUCKET!;
    const cmd = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const url = await getSignedUrl(s3, cmd, { expiresIn: 3600 }); // 1 hour

    return NextResponse.json({ url });
  } catch (error: any) {
    console.error("Draft URL error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

