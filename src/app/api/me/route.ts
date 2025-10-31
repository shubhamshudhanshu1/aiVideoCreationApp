import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const UpdateMe = z.object({
  displayName: z.string().min(1).max(100).optional(),
  handle: z.string().min(3).max(30).regex(/^[a-z0-9_]+$/).optional(),
  avatarUrl: z.string().url().optional().nullable(),
  marketingOptIn: z.boolean().optional(),
});

export async function GET() {
  const user = await getUser();

  if (!user) {
    return NextResponse.json({ user: null });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      handle: user.handle,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      marketingOptIn: user.marketingOptIn,
    },
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = UpdateMe.parse(body);

    const updateData: any = {};
    if (data.displayName !== undefined) updateData.displayName = data.displayName;
    if (data.handle !== undefined) {
      // Check if handle is taken
      const existing = await prisma.user.findUnique({
        where: { handle: data.handle },
      });
      if (existing && existing.id !== user.id) {
        return NextResponse.json(
          { error: "Handle already taken" },
          { status: 409 }
        );
      }
      updateData.handle = data.handle;
    }
    if (data.avatarUrl !== undefined) updateData.avatarUrl = data.avatarUrl;
    if (data.marketingOptIn !== undefined)
      updateData.marketingOptIn = data.marketingOptIn;

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        handle: updated.handle,
        displayName: updated.displayName,
        avatarUrl: updated.avatarUrl,
        marketingOptIn: updated.marketingOptIn,
      },
    });
  } catch (error: any) {
    console.error("Update me error:", error);
    if (error.issues) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
