import { NextRequest, NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> | { handle: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { handle } = await Promise.resolve(params);
    const target = await prisma.user.findUnique({
      where: { handle },
    });

    if (!target) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (target.id === user.id) {
      return NextResponse.json(
        { error: "Cannot follow yourself" },
        { status: 400 }
      );
    }

    await prisma.follow.upsert({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: target.id,
        },
      },
      update: {},
      create: {
        followerId: user.id,
        followingId: target.id,
      },
    });

    return NextResponse.json({ following: true });
  } catch (error) {
    console.error("Follow user error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ handle: string }> | { handle: string } }
) {
  try {
    const user = await getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { handle } = await Promise.resolve(params);
    const target = await prisma.user.findUnique({
      where: { handle },
    });

    if (!target) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.follow.deleteMany({
      where: {
        followerId: user.id,
        followingId: target.id,
      },
    });

    return NextResponse.json({ following: false });
  } catch (error) {
    console.error("Unfollow user error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

