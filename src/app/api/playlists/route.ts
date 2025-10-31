import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const CreatePlaylist = z.object({
  name: z.string().min(1).max(100),
  isPublic: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, isPublic } = CreatePlaylist.parse(body);

    const playlist = await prisma.playlist.create({
      data: {
        userId: user.id,
        name,
        isPublic,
      },
    });

    return NextResponse.json({ playlist });
  } catch (error: any) {
    console.error("Create playlist error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

